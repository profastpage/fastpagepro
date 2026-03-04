import {
  PaymentMethod,
  PlanType,
  SubscriptionRequest,
  SubscriptionRequestStatus,
  SubscriptionStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminDb } from "@/lib/firebaseAdmin";
import { canAccessFeature, getPlanLimits, SubscriptionFeature } from "@/lib/permissions";
import { getPlanDefinition } from "@/lib/subscription/plans";
import { isRootAdminEmail } from "@/lib/adminAccess";
import { markReferralPaid } from "@/lib/referrals/service";

const FREE_PLAN_HORIZON_DAYS = 3650;
const EXPIRY_WARNING_DAYS = 5;
const PLAN_DEFAULT_DURATION_DAYS: Record<PlanType, number> = {
  FREE: FREE_PLAN_HORIZON_DAYS,
  BUSINESS: 30,
  PRO: 30,
};

export interface SubscriptionSummary {
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  expiringSoon: boolean;
  daysRemaining: number;
  isBusinessTrial: boolean;
  trialDaysRemaining: number;
  trialDaysTotal: number;
  trialExpired: boolean;
  limits: ReturnType<typeof getPlanLimits>;
  usage: {
    publishedPages: number;
  };
  features: Record<SubscriptionFeature, boolean>;
}

type SubscriptionRecordSource = "prisma" | "firestore" | "memory";

export interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  source: SubscriptionRecordSource;
}

function isBusinessTrialRecord(record: SubscriptionRecord): boolean {
  if (record.plan !== "BUSINESS") return false;
  const durationDays = getDurationDays(record.startDate, record.endDate);
  return durationDays > 0 && durationDays <= 14;
}

async function isRootAdminAccount(userId: string): Promise<boolean> {
  if (!adminDb) return false;
  try {
    const snapshot = await adminDb.collection("users").doc(userId).get();
    const payload = snapshot.data() as Record<string, unknown> | undefined;
    return isRootAdminEmail(String(payload?.email || ""));
  } catch (error) {
    console.error("[Subscription] Root admin check warning:", error);
    return false;
  }
}

async function hasUsedBusinessTrial(userId: string): Promise<boolean> {
  try {
    const businessOrPro = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: { in: ["BUSINESS", "PRO"] },
        status: { in: ["ACTIVE", "EXPIRED"] },
      },
      select: { id: true },
    });
    if (businessOrPro) return true;
  } catch (error) {
    console.error("[Subscription Trial] Prisma usage check warning:", error);
  }

  if (!adminDb) return false;

  try {
    const snapshot = await adminDb.collection("users").doc(userId).get();
    const payload = snapshot.data() as Record<string, unknown> | undefined;
    return payload?.businessTrialUsed === true;
  } catch (error) {
    console.error("[Subscription Trial] Firestore usage check warning:", error);
    return false;
  }
}

async function hasUsedProTrial(userId: string): Promise<boolean> {
  try {
    const previousPro = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: "PRO",
        status: { in: ["ACTIVE", "EXPIRED"] },
      },
      select: { id: true },
    });
    if (previousPro) return true;
  } catch (error) {
    console.error("[Subscription Pro Trial] Prisma usage check warning:", error);
  }

  if (!adminDb) return false;

  try {
    const snapshot = await adminDb.collection("users").doc(userId).get();
    const payload = snapshot.data() as Record<string, unknown> | undefined;
    return payload?.proTrialUsed === true;
  } catch (error) {
    console.error("[Subscription Pro Trial] Firestore usage check warning:", error);
    return false;
  }
}

async function moveTrialExpiredUserToFreeBlocked(userId: string): Promise<SubscriptionRecord> {
  const now = getNow();
  let next: SubscriptionRecord | null = null;

  try {
    const created = await prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          userId,
          status: {
            in: ["ACTIVE", "PENDING"],
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      return tx.subscription.create({
        data: {
          userId,
          plan: "FREE",
          status: "EXPIRED",
          paymentMethod: "TRANSFERENCIA",
          startDate: now,
          endDate: now,
        },
      });
    });
    next = mapPrismaSubscription(created);
  } catch (error) {
    console.error("[Subscription Trial] Prisma free-blocked fallback:", error);
    next = buildSubscriptionRecord({
      userId,
      plan: "FREE",
      status: "EXPIRED",
      paymentMethod: "TRANSFERENCIA",
      startDate: now,
      endDate: now,
      source: adminDb ? "firestore" : "memory",
    });
  }

  await saveSubscriptionRecordToFirestore(next).catch((error) => {
    console.error("[Subscription Trial] Firestore free-blocked sync warning:", error);
  });

  return next;
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

function getDurationDays(startDate: Date, endDate: Date): number {
  const diff = endDate.getTime() - startDate.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function getDaysRemaining(endDate: Date): number {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function buildEphemeralBusinessTrialRecord(userId: string): SubscriptionRecord {
  const now = getNow();
  return buildSubscriptionRecord({
    userId,
    plan: "BUSINESS",
    status: "ACTIVE",
    paymentMethod: "TRANSFERENCIA",
    startDate: now,
    endDate: addDays(now, 14),
    source: "memory",
  });
}

async function resolveAutoTrialFallback(
  userId: string,
  context: string,
  error: unknown,
): Promise<SubscriptionRecord> {
  const message = String((error as { message?: string })?.message || "");
  const trialAlreadyUsed =
    message.startsWith("BUSINESS_TRIAL_ALREADY_USED") || (await hasUsedBusinessTrial(userId));

  if (trialAlreadyUsed) {
    return moveTrialExpiredUserToFreeBlocked(userId);
  }

  console.error(`[Subscription Auto Trial] ${context}:`, error);
  return buildEphemeralBusinessTrialRecord(userId);
}

function toPlanType(value: unknown): PlanType | null {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "free" || normalized === "starter") {
    return "FREE";
  }
  if (normalized === "business") {
    return "BUSINESS";
  }
  if (normalized === "pro" || normalized === "agency") {
    return "PRO";
  }
  return null;
}

function toCanonicalPlanLabel(plan: PlanType): "starter" | "business" | "pro" {
  if (plan === "BUSINESS") return "business";
  if (plan === "PRO") return "pro";
  return "starter";
}

function toSubscriptionStatus(value: unknown): SubscriptionStatus | null {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "ACTIVE" || normalized === "EXPIRED" || normalized === "PENDING") {
    return normalized as SubscriptionStatus;
  }
  return null;
}

function toPaymentMethod(value: unknown): PaymentMethod | null {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "YAPE" || normalized === "PLIN" || normalized === "TRANSFERENCIA") {
    return normalized as PaymentMethod;
  }
  return null;
}

function toDateOrFallback(value: unknown, fallback: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (typeof value === "string") {
    const maybeMs = Number(value);
    if (Number.isFinite(maybeMs) && value.trim() !== "") {
      const fromMs = new Date(maybeMs);
      if (!Number.isNaN(fromMs.getTime())) return fromMs;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  if (value && typeof value === "object" && "toDate" in (value as Record<string, unknown>)) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") {
      const parsed = toDate();
      if (parsed instanceof Date && !Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  return fallback;
}

function buildSubscriptionRecord(input: {
  id?: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  paymentMethod?: PaymentMethod;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  source: SubscriptionRecordSource;
}): SubscriptionRecord {
  const createdAt = input.createdAt || getNow();
  const updatedAt = input.updatedAt || createdAt;
  return {
    id: input.id || `${input.source}-${input.userId}-${createdAt.getTime()}`,
    userId: input.userId,
    plan: input.plan,
    status: input.status,
    paymentMethod: input.paymentMethod || "TRANSFERENCIA",
    startDate: input.startDate,
    endDate: input.endDate,
    createdAt,
    updatedAt,
    source: input.source,
  };
}

function mapPrismaSubscription(row: {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}): SubscriptionRecord {
  return buildSubscriptionRecord({
    id: row.id,
    userId: row.userId,
    plan: row.plan,
    status: row.status,
    paymentMethod: row.paymentMethod,
    startDate: row.startDate,
    endDate: row.endDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    source: "prisma",
  });
}

async function readFirestoreSubscriptionRecord(userId: string): Promise<SubscriptionRecord | null> {
  if (!adminDb) return null;

  try {
    const snapshot = await adminDb.collection("users").doc(userId).get();
    const data = snapshot.data();
    if (!data) return null;

    const plan = toPlanType(
      (data as Record<string, unknown>).subscriptionPlan || (data as Record<string, unknown>).plan,
    );
    if (!plan) return null;

    const now = getNow();
    const fallbackEnd = addDays(now, plan === "FREE" ? FREE_PLAN_HORIZON_DAYS : 30);
    const status = toSubscriptionStatus((data as Record<string, unknown>).subscriptionStatus) || "ACTIVE";
    const paymentMethod = toPaymentMethod((data as Record<string, unknown>).subscriptionPaymentMethod) || "TRANSFERENCIA";
    const startDate = toDateOrFallback((data as Record<string, unknown>).subscriptionStartAt, now);
    const endDate = toDateOrFallback((data as Record<string, unknown>).subscriptionEndAt, fallbackEnd);
    const updatedAt = toDateOrFallback((data as Record<string, unknown>).subscriptionUpdatedAt, new Date(0));
    const createdAt = toDateOrFallback(
      (data as Record<string, unknown>).subscriptionCreatedAt,
      updatedAt.getTime() > 0 ? updatedAt : startDate,
    );

    return buildSubscriptionRecord({
      id: String((data as Record<string, unknown>).subscriptionId || `firestore-${userId}`).trim(),
      userId,
      plan,
      status,
      paymentMethod,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      source: "firestore",
    });
  } catch (error) {
    console.error("[Subscription Firestore Read] Warning:", error);
    return null;
  }
}

async function saveSubscriptionRecordToFirestore(record: SubscriptionRecord): Promise<void> {
  if (!adminDb) return;

  const isActive = record.status === "ACTIVE" && record.endDate.getTime() > Date.now();
  const publicAccessPayload = {
    subscriptionBlocked: !isActive,
    subscriptionPlan: record.plan,
    subscriptionStatus: record.status,
    subscriptionEndAt: record.endDate.getTime(),
    subscriptionUpdatedAt: Date.now(),
  };

  await adminDb.collection("users").doc(record.userId).set(
    {
      plan: toCanonicalPlanLabel(record.plan),
      subscriptionId: record.id,
      subscriptionPlan: record.plan,
      subscriptionStatus: record.status,
      subscriptionPaymentMethod: record.paymentMethod,
      subscriptionStartAt: record.startDate.getTime(),
      subscriptionEndAt: record.endDate.getTime(),
      subscriptionCreatedAt: record.createdAt.getTime(),
      subscriptionUpdatedAt: record.updatedAt.getTime(),
    },
    { merge: true },
  );

  try {
    const linkProfilesRef = adminDb.collection("link_profiles");
    const linkProfilesByOwner = await linkProfilesRef
      .where("userId", "==", record.userId)
      .get();
    const batch = adminDb.batch();
    const touched = new Set<string>();

    linkProfilesByOwner.docs.forEach((profileDoc) => {
      touched.add(profileDoc.id);
      batch.set(profileDoc.ref, publicAccessPayload, { merge: true });
    });

    if (!touched.has(record.userId)) {
      batch.set(linkProfilesRef.doc(record.userId), publicAccessPayload, { merge: true });
    }

    await batch.commit();
  } catch (error) {
    console.error("[Subscription Sync] Link profile access sync warning:", error);
  }

  try {
    const storeSnapshots = await adminDb
      .collection("cloned_sites")
      .where("userId", "==", record.userId)
      .get();

    if (!storeSnapshots.empty) {
      const batch = adminDb.batch();
      storeSnapshots.docs.forEach((storeDoc) => {
        batch.set(storeDoc.ref, publicAccessPayload, { merge: true });
      });
      await batch.commit();
    }
  } catch (error) {
    console.error("[Subscription Sync] Store access sync warning:", error);
  }
}

export async function countPublishedPagesByUser(userId: string): Promise<number> {
  if (!adminDb) {
    return 0;
  }
  try {
    let publishedProjects = 0;

    try {
      const byStatus = await adminDb
        .collection("cloned_sites")
        .where("userId", "==", userId)
        .where("status", "==", "published")
        .get();
      publishedProjects += byStatus.size;
    } catch {
      const byLegacyFlag = await adminDb
        .collection("cloned_sites")
        .where("userId", "==", userId)
        .where("published", "==", true)
        .get();
      publishedProjects += byLegacyFlag.size;
    }

    const publishedLinkProfileIds = new Set<string>();
    try {
      const ownedProfiles = await adminDb.collection("link_profiles").where("userId", "==", userId).get();
      ownedProfiles.docs.forEach((profileDoc) => {
        if (profileDoc.data()?.published === true) {
          publishedLinkProfileIds.add(profileDoc.id);
        }
      });
    } catch (error) {
      console.error("[Subscription] countPublishedPagesByUser link_profiles query warning:", error);
    }

    const legacyLinkProfile = await adminDb.collection("link_profiles").doc(userId).get();
    if (legacyLinkProfile.exists && legacyLinkProfile.data()?.published === true) {
      publishedLinkProfileIds.add(legacyLinkProfile.id);
    }

    publishedProjects += publishedLinkProfileIds.size;

    return publishedProjects;
  } catch (error) {
    console.error("[Subscription] countPublishedPagesByUser warning:", error);
    return 0;
  }
}

export async function getLatestSubscription(userId: string): Promise<SubscriptionRecord | null> {
  let prismaRecord: SubscriptionRecord | null = null;
  try {
    const rows = await prisma.subscription.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 20,
    });
    if (rows.length > 0) {
      const effective = rows.find((entry) => entry.status !== "PENDING") || rows[0];
      prismaRecord = mapPrismaSubscription(effective);
    }
  } catch (error) {
    console.error("[Subscription] Prisma read fallback (single):", error);
  }

  const firestoreRecord = await readFirestoreSubscriptionRecord(userId);
  if (firestoreRecord) {
    if (!prismaRecord) return firestoreRecord;

    const firestoreHasReliableTimestamp = firestoreRecord.updatedAt.getTime() > 0;
    const firestoreWinsByFreshness =
      firestoreHasReliableTimestamp &&
      firestoreRecord.updatedAt.getTime() >= prismaRecord.updatedAt.getTime();
    const firestoreWinsByPlan = prismaRecord.plan === "FREE" && firestoreRecord.plan !== "FREE";
    const firestoreWinsByStatus =
      prismaRecord.status !== "ACTIVE" && firestoreRecord.status === "ACTIVE";

    if (firestoreWinsByFreshness || firestoreWinsByPlan || firestoreWinsByStatus) {
      return firestoreRecord;
    }
  }

  return prismaRecord;
}

export async function getLatestSubscriptionsByUsers(userIds: string[]): Promise<SubscriptionRecord[]> {
  const cleaned = Array.from(
    new Set(
      userIds
        .map((entry) => String(entry || "").trim())
        .filter(Boolean),
    ),
  );
  if (cleaned.length === 0) return [];

  try {
    const rows = await prisma.subscription.findMany({
      where: {
        userId: {
          in: cleaned,
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const latestByUser = new Map<string, SubscriptionRecord>();
    for (const row of rows) {
      const previous = latestByUser.get(row.userId);
      if (!previous) {
        latestByUser.set(row.userId, mapPrismaSubscription(row));
        continue;
      }

      if (previous.status === "PENDING" && row.status !== "PENDING") {
        latestByUser.set(row.userId, mapPrismaSubscription(row));
      }
    }

    return cleaned
      .map((userId) => latestByUser.get(userId))
      .filter((entry): entry is SubscriptionRecord => Boolean(entry));
  } catch (error) {
    console.error("[Subscription] Prisma read fallback (multi):", error);
  }

  const firestore = adminDb;
  if (!firestore) {
    return [];
  }

  try {
    const refs = cleaned.map((userId) => firestore.collection("users").doc(userId));
    const snapshots = await firestore.getAll(...refs);
    const result: SubscriptionRecord[] = [];
    for (const snapshot of snapshots) {
      const mapped = await readFirestoreSubscriptionRecord(snapshot.id);
      if (mapped) {
        result.push(mapped);
      }
    }
    return result;
  } catch (error) {
    console.error("[Subscription] Firestore fallback (multi) failed:", error);
    return [];
  }
}

export async function createDefaultFreeSubscription(userId: string): Promise<SubscriptionRecord> {
  const now = getNow();
  const fallback = buildSubscriptionRecord({
    userId,
    plan: "FREE",
    status: "ACTIVE",
    paymentMethod: "TRANSFERENCIA",
    startDate: now,
    endDate: addDays(now, FREE_PLAN_HORIZON_DAYS),
    source: adminDb ? "firestore" : "memory",
  });

  try {
    const created = await prisma.subscription.create({
      data: {
        userId,
        plan: "FREE",
        status: "ACTIVE",
        paymentMethod: "TRANSFERENCIA",
        startDate: now,
        endDate: addDays(now, FREE_PLAN_HORIZON_DAYS),
      },
    });
    const mapped = mapPrismaSubscription(created);
    await saveSubscriptionRecordToFirestore(mapped).catch(() => undefined);
    return mapped;
  } catch (error) {
    console.error("[Subscription] Prisma create fallback (free):", error);
    await saveSubscriptionRecordToFirestore(fallback).catch(() => undefined);
    return fallback;
  }
}

function getPlanDurationDays(plan: PlanType, durationDays?: number): number {
  if (plan === "FREE") return PLAN_DEFAULT_DURATION_DAYS.FREE;
  const fromInput = Number(durationDays || 0);
  if (Number.isFinite(fromInput) && fromInput > 0) {
    return Math.floor(fromInput);
  }
  return PLAN_DEFAULT_DURATION_DAYS[plan];
}

export async function startBusinessTrial(
  userId: string,
  options?: {
    force?: boolean;
  },
): Promise<SubscriptionRecord> {
  const safeUserId = String(userId || "").trim();
  if (!safeUserId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const force = options?.force === true;
  let alreadyUsed = false;

  if (!force) {
    try {
      const previousPaidOrTrial = await prisma.subscription.findFirst({
        where: {
          userId: safeUserId,
          plan: { in: ["BUSINESS", "PRO"] },
          status: { in: ["ACTIVE", "EXPIRED"] },
        },
        select: { id: true },
      });
      alreadyUsed = Boolean(previousPaidOrTrial);
    } catch (error) {
      console.error("[Subscription Trial] Prisma read fallback:", error);
    }

    if (!alreadyUsed) {
      const firestoreRecord = await readFirestoreSubscriptionRecord(safeUserId);
      if (firestoreRecord && (firestoreRecord.plan === "BUSINESS" || firestoreRecord.plan === "PRO")) {
        alreadyUsed = true;
      }
    }

    if (!alreadyUsed && adminDb) {
      try {
        const userDoc = await adminDb.collection("users").doc(safeUserId).get();
        alreadyUsed = userDoc.data()?.businessTrialUsed === true;
      } catch (error) {
        console.error("[Subscription Trial] Firestore flag read warning:", error);
      }
    }
  }

  if (alreadyUsed) {
    throw new Error("BUSINESS_TRIAL_ALREADY_USED");
  }

  const assigned = await assignSubscriptionPlanByAdmin({
    userId: safeUserId,
    plan: "BUSINESS",
    durationDays: 14,
    paymentMethod: "TRANSFERENCIA",
  });

  if (adminDb) {
    await adminDb
      .collection("users")
      .doc(safeUserId)
      .set(
        {
          businessTrialUsed: true,
          businessTrialUsedAt: Date.now(),
        },
        { merge: true },
      )
      .catch((error) => {
        console.error("[Subscription Trial] Firestore flag write warning:", error);
      });
  }

  return assigned;
}

export async function startProTrial(
  userId: string,
  options?: {
    force?: boolean;
  },
): Promise<SubscriptionRecord> {
  const safeUserId = String(userId || "").trim();
  if (!safeUserId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const force = options?.force === true;
  if (!force) {
    const used = await hasUsedProTrial(safeUserId);
    if (used) {
      throw new Error("PRO_TRIAL_ALREADY_USED");
    }
  }

  const assigned = await assignSubscriptionPlanByAdmin({
    userId: safeUserId,
    plan: "PRO",
    durationDays: 7,
    paymentMethod: "TRANSFERENCIA",
  });

  if (adminDb) {
    await adminDb
      .collection("users")
      .doc(safeUserId)
      .set(
        {
          proTrialUsed: true,
          proTrialUsedAt: Date.now(),
        },
        { merge: true },
      )
      .catch((error) => {
        console.error("[Subscription Pro Trial] Firestore flag write warning:", error);
      });
  }

  return assigned;
}

export async function assignSubscriptionPlanByAdmin(input: {
  userId: string;
  plan: PlanType;
  mode?: "ACTIVATE" | "DEACTIVATE";
  durationDays?: number;
  paymentMethod?: PaymentMethod;
}): Promise<SubscriptionRecord> {
  const userId = String(input.userId || "").trim();
  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const mode = input.mode || "ACTIVATE";
  const targetPlan: PlanType = mode === "DEACTIVATE" ? "FREE" : input.plan;
  const now = getNow();
  const durationDays = getPlanDurationDays(targetPlan, input.durationDays);
  const endDate = addDays(now, durationDays);
  const paymentMethod = input.paymentMethod || "TRANSFERENCIA";

  let assignedSubscription: SubscriptionRecord | null = null;

  try {
    const prismaAssigned = await prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          userId,
          status: {
            in: ["ACTIVE", "PENDING"],
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      return tx.subscription.create({
        data: {
          userId,
          plan: targetPlan,
          status: "ACTIVE",
          paymentMethod,
          startDate: now,
          endDate,
        },
      });
    });
    assignedSubscription = mapPrismaSubscription(prismaAssigned);
  } catch (error) {
    console.error("[Subscription Admin] Prisma write fallback:", error);
    if (!adminDb) {
      throw new Error("SERVICE_UNAVAILABLE: subscription storage unavailable");
    }
    assignedSubscription = buildSubscriptionRecord({
      userId,
      plan: targetPlan,
      status: "ACTIVE",
      paymentMethod,
      startDate: now,
      endDate,
      source: "firestore",
    });
  }

  await saveSubscriptionRecordToFirestore(assignedSubscription).catch((error) => {
    console.error("[Subscription Admin Sync] Firestore sync warning:", error);
  });

  return assignedSubscription;
}

export async function resolveUserSubscription(userId: string): Promise<SubscriptionRecord> {
  const isRootAdmin = await isRootAdminAccount(userId);
  let current = await getLatestSubscription(userId);
  if (!current) {
    if (isRootAdmin) {
      current = await createDefaultFreeSubscription(userId);
      return current;
    }
    // New accounts start blocked until they purchase a plan from Billing.
    current = await moveTrialExpiredUserToFreeBlocked(userId);
    return current;
  }

  if (!isRootAdmin && current.status === "PENDING") {
    current = await moveTrialExpiredUserToFreeBlocked(userId);
    return current;
  }

  if (!isRootAdmin && current.plan === "FREE") {
    if (current.status !== "ACTIVE" || current.endDate.getTime() <= Date.now()) {
      current = await moveTrialExpiredUserToFreeBlocked(userId);
      return current;
    }
  }

  if (!isRootAdmin && current.status === "EXPIRED" && current.plan !== "FREE") {
    current = await moveTrialExpiredUserToFreeBlocked(userId);
    return current;
  }

  if (current.status === "ACTIVE" && current.endDate.getTime() <= Date.now()) {
    if (!isRootAdmin && current.plan !== "FREE") {
      current = await moveTrialExpiredUserToFreeBlocked(userId);
      return current;
    }
    if (current.source === "prisma") {
      try {
        const updated = await prisma.subscription.update({
          where: { id: current.id },
          data: { status: "EXPIRED" },
        });
        current = mapPrismaSubscription(updated);
      } catch (error) {
        console.error("[Subscription] Prisma status update fallback:", error);
        current = { ...current, status: "EXPIRED", updatedAt: getNow() };
      }
      await saveSubscriptionRecordToFirestore(current).catch(() => undefined);
    } else {
      current = { ...current, status: "EXPIRED", updatedAt: getNow() };
      await saveSubscriptionRecordToFirestore(current).catch(() => undefined);
    }
  }

  return current;
}

export async function buildSubscriptionSummary(userId: string): Promise<SubscriptionSummary> {
  const subscription = await resolveUserSubscription(userId);
  const publishedPages = await countPublishedPagesByUser(userId);
  const limits = getPlanLimits(subscription.plan);
  const daysRemaining = getDaysRemaining(subscription.endDate);
  const expiringSoon = daysRemaining > 0 && daysRemaining <= EXPIRY_WARNING_DAYS;
  const isBusinessTrial = false;
  const trialDaysRemaining = 0;
  const trialExpired = false;
  const trialDaysTotal = 0;
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
    "fullStore",
    "clonerAccess",
    "insightsAutomation",
    "whiteLabel",
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
    isBusinessTrial,
    trialDaysRemaining,
    trialDaysTotal,
    trialExpired,
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
  const approval = await prisma.$transaction(async (tx) => {
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

    return {
      request,
      activeSubscription,
    };
  });

  const approxMonths = Math.max(1, Math.round(input.durationDays / 30));
  const approvedAmountSoles = Number(
    (getPlanDefinition(approval.request.requestedPlan).monthlyPriceSoles * approxMonths).toFixed(2),
  );
  await markReferralPaid({
    invitedUserId: approval.request.userId,
    requestedPlan: approval.request.requestedPlan,
    amountSoles: approvedAmountSoles,
    paymentRef: approval.request.id,
  }).catch((error) => {
    console.error("[Subscription Approve] referral settlement warning:", error);
  });

  return approval.activeSubscription;
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
