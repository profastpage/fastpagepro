import {
  PaymentMethod,
  PlanType,
  Subscription,
  SubscriptionRequest,
  SubscriptionRequestStatus,
  SubscriptionStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminDb } from "@/lib/firebaseAdmin";
import { canAccessFeature, getPlanLimits, SubscriptionFeature } from "@/lib/permissions";
import { getPlanDefinition } from "@/lib/subscription/plans";

const FREE_PLAN_HORIZON_DAYS = 3650;
const EXPIRY_WARNING_DAYS = 7;

export interface SubscriptionSummary {
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  expiringSoon: boolean;
  daysRemaining: number;
  limits: ReturnType<typeof getPlanLimits>;
  usage: {
    publishedPages: number;
  };
  features: Record<SubscriptionFeature, boolean>;
}

function getNow() {
  return new Date();
}

function toIso(value: Date) {
  return value.toISOString();
}

function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

function getDaysRemaining(endDate: Date): number {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export async function countPublishedPagesByUser(userId: string): Promise<number> {
  if (!adminDb) {
    return 0;
  }
  const snapshot = await adminDb
    .collection("cloned_sites")
    .where("userId", "==", userId)
    .where("published", "==", true)
    .get();
  return snapshot.size;
}

export async function getLatestSubscription(userId: string): Promise<Subscription | null> {
  return prisma.subscription.findFirst({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function createDefaultFreeSubscription(userId: string): Promise<Subscription> {
  const now = getNow();
  return prisma.subscription.create({
    data: {
      userId,
      plan: "FREE",
      status: "ACTIVE",
      paymentMethod: "TRANSFERENCIA",
      startDate: now,
      endDate: addDays(now, FREE_PLAN_HORIZON_DAYS),
    },
  });
}

export async function resolveUserSubscription(userId: string): Promise<Subscription> {
  let current = await getLatestSubscription(userId);
  if (!current) {
    current = await createDefaultFreeSubscription(userId);
    return current;
  }

  if (current.status === "ACTIVE" && current.endDate.getTime() < Date.now()) {
    current = await prisma.subscription.update({
      where: { id: current.id },
      data: { status: "EXPIRED" },
    });
  }

  if (current.status === "EXPIRED") {
    // Keep experience alive with fallback free plan.
    const freePlan = await createDefaultFreeSubscription(userId);
    return freePlan;
  }

  return current;
}

export async function buildSubscriptionSummary(userId: string): Promise<SubscriptionSummary> {
  const subscription = await resolveUserSubscription(userId);
  const publishedPages = await countPublishedPagesByUser(userId);
  const limits = getPlanLimits(subscription.plan);
  const daysRemaining = getDaysRemaining(subscription.endDate);
  const expiringSoon = daysRemaining > 0 && daysRemaining <= EXPIRY_WARNING_DAYS;
  const allFeatures: SubscriptionFeature[] = [
    "premiumThemes",
    "categoryThemes",
    "aiOptimization",
    "advancedMetrics",
    "basicMetrics",
    "removeBranding",
    "customDomain",
    "multiUser",
    "conversionOptimizationAdvanced",
    "ctaOptimization",
    "advancedColorCustomization",
    "supportPriority",
  ];

  const featureFlags = allFeatures.reduce<Record<SubscriptionFeature, boolean>>((acc, feature) => {
    acc[feature] = subscription.status === "ACTIVE" && canAccessFeature(subscription.plan, feature);
    return acc;
  }, {} as Record<SubscriptionFeature, boolean>);

  return {
    userId,
    plan: subscription.plan,
    status: subscription.status,
    startDate: toIso(subscription.startDate),
    endDate: toIso(subscription.endDate),
    expiringSoon,
    daysRemaining,
    limits,
    usage: {
      publishedPages,
    },
    features: featureFlags,
  };
}

export async function assertPageQuota(userId: string) {
  const summary = await buildSubscriptionSummary(userId);
  const { maxPublishedPages } = summary.limits;
  if (maxPublishedPages == null) return summary;
  if (summary.usage.publishedPages >= maxPublishedPages) {
    throw new Error(
      `Has alcanzado el límite de ${maxPublishedPages} páginas publicadas en tu plan ${summary.plan}.`,
    );
  }
  return summary;
}

export async function createSubscriptionRequest(input: {
  userId: string;
  requestedPlan: PlanType;
  paymentMethod: PaymentMethod;
  notes?: string;
  proofFileName?: string;
  proofMimeType?: string;
  proofBase64?: string;
}) {
  const now = getNow();
  const pendingSubscription = await prisma.subscription.create({
    data: {
      userId: input.userId,
      plan: input.requestedPlan,
      status: "PENDING",
      paymentMethod: input.paymentMethod,
      startDate: now,
      endDate: now,
    },
  });

  const request = await prisma.subscriptionRequest.create({
    data: {
      userId: input.userId,
      requestedPlan: input.requestedPlan,
      paymentMethod: input.paymentMethod,
      status: "PENDING",
      notes: input.notes?.trim() || null,
      proofFileName: input.proofFileName || null,
      proofMimeType: input.proofMimeType || null,
      proofBase64: input.proofBase64 || null,
      approvedSubscriptionId: pendingSubscription.id,
    },
  });

  return { request, pendingSubscription };
}

export async function approveSubscriptionRequest(input: {
  requestId: string;
  reviewerId: string;
  durationDays: number;
}) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.subscriptionRequest.findUnique({
      where: { id: input.requestId },
    });

    if (!request) {
      throw new Error("Solicitud no encontrada.");
    }

    if (request.status !== "PENDING") {
      throw new Error("La solicitud ya fue procesada.");
    }

    const now = getNow();
    const endDate = addDays(now, input.durationDays);

    const activeSubscription = await tx.subscription.create({
      data: {
        userId: request.userId,
        plan: request.requestedPlan,
        status: "ACTIVE",
        paymentMethod: request.paymentMethod,
        startDate: now,
        endDate,
      },
    });

    await tx.subscriptionRequest.update({
      where: { id: request.id },
      data: {
        status: "APPROVED",
        reviewedAt: now,
        reviewedBy: input.reviewerId,
        approvedSubscriptionId: activeSubscription.id,
      },
    });

    // Expire previous pending subscriptions linked to this request user.
    await tx.subscription.updateMany({
      where: {
        userId: request.userId,
        status: "PENDING",
      },
      data: {
        status: "EXPIRED",
      },
    });

    return activeSubscription;
  });
}

export async function getPendingRequestsByUser(userId: string): Promise<SubscriptionRequest[]> {
  return prisma.subscriptionRequest.findMany({
    where: {
      userId,
      status: SubscriptionRequestStatus.PENDING,
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getPlanLabel(plan: PlanType): string {
  return getPlanDefinition(plan).name;
}
