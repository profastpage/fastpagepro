import { adminDb } from "@/lib/firebaseAdmin";
import type { PlanType } from "@/lib/subscription/plans";

type BillingCycle = "MONTHLY" | "ANNUAL";

type IzipaySubscriptionPaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface IzipaySubscriptionPaymentRecord {
  id: string;
  userId: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  durationMonths: number;
  discountPercent: number;
  amountSoles: number;
  status: IzipaySubscriptionPaymentStatus;
  providerPaymentId: string;
  checkoutMode: "mock" | "live";
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
}

const SUBSCRIPTION_IZIPAY_PAYMENTS_COLLECTION = "subscription_izipay_payments";

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
  return `sub_izipay_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function toRecord(id: string, payload: Record<string, unknown>): IzipaySubscriptionPaymentRecord {
  const planRaw = sanitizeText(payload.plan, 20).toUpperCase();
  const plan: PlanType = planRaw === "PRO" ? "PRO" : planRaw === "BUSINESS" ? "BUSINESS" : "FREE";
  const billingCycle: BillingCycle = sanitizeText(payload.billingCycle, 20) === "ANNUAL" ? "ANNUAL" : "MONTHLY";
  const statusRaw = sanitizeText(payload.status, 20).toUpperCase();
  const status: IzipaySubscriptionPaymentStatus =
    statusRaw === "PAID" || statusRaw === "FAILED" || statusRaw === "CANCELLED"
      ? (statusRaw as IzipaySubscriptionPaymentStatus)
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
    providerPaymentId: sanitizeText(payload.providerPaymentId, 220),
    checkoutMode: sanitizeText(payload.checkoutMode, 20) === "live" ? "live" : "mock",
    createdAt: Math.max(0, Number(payload.createdAt || Date.now())),
    updatedAt: Math.max(0, Number(payload.updatedAt || Date.now())),
    paidAt: Number(payload.paidAt || 0) > 0 ? Number(payload.paidAt) : undefined,
  };
}

export async function createPendingIzipaySubscriptionPayment(input: {
  userId: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  durationMonths: number;
  discountPercent: number;
  amountSoles: number;
  providerPaymentId?: string;
  checkoutMode?: "mock" | "live";
}) {
  const db = assertStorage();
  const paymentId = createPaymentId();
  const now = Date.now();
  const payload: IzipaySubscriptionPaymentRecord = {
    id: paymentId,
    userId: sanitizeText(input.userId, 120),
    plan: input.plan,
    billingCycle: input.billingCycle,
    durationMonths: Math.max(1, Math.min(12, Math.floor(input.durationMonths || 1))),
    discountPercent: Math.max(0, Math.min(90, Math.floor(input.discountPercent || 0))),
    amountSoles: Math.max(0, Number(input.amountSoles || 0)),
    status: "PENDING",
    providerPaymentId: sanitizeText(input.providerPaymentId, 220),
    checkoutMode: input.checkoutMode === "live" ? "live" : "mock",
    createdAt: now,
    updatedAt: now,
  };

  await db
    .collection(SUBSCRIPTION_IZIPAY_PAYMENTS_COLLECTION)
    .doc(paymentId)
    .set(payload, { merge: true });

  return payload;
}

export async function updateIzipaySubscriptionPaymentProvider(input: {
  paymentId: string;
  providerPaymentId: string;
  checkoutMode: "mock" | "live";
}) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(input.paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }
  const now = Date.now();
  await db
    .collection(SUBSCRIPTION_IZIPAY_PAYMENTS_COLLECTION)
    .doc(safePaymentId)
    .set(
      {
        providerPaymentId: sanitizeText(input.providerPaymentId, 220),
        checkoutMode: input.checkoutMode,
        updatedAt: now,
      },
      { merge: true },
    );
}

export async function getIzipaySubscriptionPayment(paymentId: string) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }

  const snapshot = await db.collection(SUBSCRIPTION_IZIPAY_PAYMENTS_COLLECTION).doc(safePaymentId).get();
  if (!snapshot.exists) return null;

  return toRecord(snapshot.id, (snapshot.data() || {}) as Record<string, unknown>);
}

export async function markIzipaySubscriptionPaymentStatus(input: {
  paymentId: string;
  status: IzipaySubscriptionPaymentStatus;
}) {
  const db = assertStorage();
  const safePaymentId = sanitizeText(input.paymentId, 180);
  if (!safePaymentId) {
    throw new Error("PAYMENT_ID_REQUIRED");
  }

  const now = Date.now();
  await db
    .collection(SUBSCRIPTION_IZIPAY_PAYMENTS_COLLECTION)
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
