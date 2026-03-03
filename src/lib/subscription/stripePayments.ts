import { adminDb } from "@/lib/firebaseAdmin";
import type { PlanType } from "@/lib/subscription/plans";

type BillingCycle = "MONTHLY" | "ANNUAL";
type StripeSubscriptionPaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface StripeSubscriptionPaymentRecord {
  id: string;
  userId: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  durationMonths: number;
  discountPercent: number;
  amountSoles: number;
  status: StripeSubscriptionPaymentStatus;
  providerSessionId: string;
  checkoutMode: "mock" | "live";
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
}

const SUBSCRIPTION_STRIPE_PAYMENTS_COLLECTION = "subscription_stripe_payments";

function sanitizeText(value: unknown, maxLen = 180): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function assertStorage() {
  if (!adminDb) {
    throw new Error("SERVICE_UNAVAILABLE: billing payment storage unavailable");
  }
  return adminDb;
}

function createPaymentId() {
  return `sub_stripe_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function toRecord(id: string, payload: Record<string, unknown>): StripeSubscriptionPaymentRecord {
  const planRaw = sanitizeText(payload.plan, 20).toUpperCase();
  const plan: PlanType = planRaw === "PRO" ? "PRO" : planRaw === "BUSINESS" ? "BUSINESS" : "FREE";
  const billingCycle: BillingCycle = sanitizeText(payload.billingCycle, 20) === "ANNUAL" ? "ANNUAL" : "MONTHLY";
  const statusRaw = sanitizeText(payload.status, 20).toUpperCase();
  const status: StripeSubscriptionPaymentStatus =
    statusRaw === "PAID" || statusRaw === "FAILED" || statusRaw === "CANCELLED"
      ? (statusRaw as StripeSubscriptionPaymentStatus)
      : "PENDING";

  return {
    id,
    userId: sanitizeText(payload.userId, 120),
    plan,
    billingCycle,
    durationMonths: Math.max(1, Math.min(12, Math.floor(Number(payload.durationMonths || 1) || 1))),
    discountPercent: Math.max(0, Math.min(90, Math.floor(Number(payload.discountPercent || 0) || 0))),
    amountSoles: Math.max(0, Number(payload.amountSoles || 0)),
    status,
    providerSessionId: sanitizeText(payload.providerSessionId, 220),
    checkoutMode: sanitizeText(payload.checkoutMode, 20) === "live" ? "live" : "mock",
    createdAt: Math.max(0, Number(payload.createdAt || Date.now())),
    updatedAt: Math.max(0, Number(payload.updatedAt || Date.now())),
    paidAt: Number(payload.paidAt || 0) > 0 ? Number(payload.paidAt) : undefined,
  };
}

export async function createPendingStripeSubscriptionPayment(input: {
  userId: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  durationMonths: number;
  discountPercent: number;
  amountSoles: number;
  providerSessionId?: string;
  checkoutMode?: "mock" | "live";
}) {
  const db = assertStorage();
  const paymentId = createPaymentId();
  const now = Date.now();
  const payload: StripeSubscriptionPaymentRecord = {
    id: paymentId,
    userId: sanitizeText(input.userId, 120),
    plan: input.plan,
    billingCycle: input.billingCycle,
    durationMonths: Math.max(1, Math.min(12, Math.floor(input.durationMonths || 1))),
    discountPercent: Math.max(0, Math.min(90, Math.floor(input.discountPercent || 0))),
    amountSoles: Math.max(0, Number(input.amountSoles || 0)),
    status: "PENDING",
    providerSessionId: sanitizeText(input.providerSessionId, 220),
    checkoutMode: input.checkoutMode === "live" ? "live" : "mock",
    createdAt: now,
    updatedAt: now,
  };

  await db
    .collection(SUBSCRIPTION_STRIPE_PAYMENTS_COLLECTION)
    .doc(paymentId)
    .set(payload, { merge: true });

  return payload;
}

export async function updateStripeSubscriptionPaymentProvider(input: {
  paymentId: string;
  providerSessionId: string;
  checkoutMode: "mock" | "live";
}) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(input.paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }
  const now = Date.now();
  await db
    .collection(SUBSCRIPTION_STRIPE_PAYMENTS_COLLECTION)
    .doc(safePaymentId)
    .set(
      {
        providerSessionId: sanitizeText(input.providerSessionId, 220),
        checkoutMode: input.checkoutMode,
        updatedAt: now,
      },
      { merge: true },
    );
}

export async function getStripeSubscriptionPayment(paymentId: string) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }

  const snapshot = await db.collection(SUBSCRIPTION_STRIPE_PAYMENTS_COLLECTION).doc(safePaymentId).get();
  if (!snapshot.exists) return null;

  return toRecord(snapshot.id, (snapshot.data() || {}) as Record<string, unknown>);
}

export async function markStripeSubscriptionPaymentStatus(input: {
  paymentId: string;
  status: StripeSubscriptionPaymentStatus;
}) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(input.paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }

  const now = Date.now();
  await db
    .collection(SUBSCRIPTION_STRIPE_PAYMENTS_COLLECTION)
    .doc(safePaymentId)
    .set(
      {
        status: input.status,
        paidAt: input.status === "PAID" ? now : null,
        updatedAt: now,
      },
      { merge: true },
    );
}
