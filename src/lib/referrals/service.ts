import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

type ReferralEventStatus = "REGISTERED" | "PAID";

export interface ReferralProfileRecord {
  userId: string;
  email: string;
  referralCode: string;
  invitedCount: number;
  convertedCount: number;
  totalCommissionSoles: number;
  createdAt: number;
  updatedAt: number;
}

export interface ReferralEventRecord {
  id: string;
  inviterUserId: string;
  inviterCode: string;
  invitedUserId: string;
  invitedEmail: string;
  status: ReferralEventStatus;
  requestedPlan: string;
  amountSoles: number;
  commissionPercent: number;
  commissionSoles: number;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
}

export interface ReferralSummary {
  profile: ReferralProfileRecord;
  referralLink: string;
  events: ReferralEventRecord[];
  stats: {
    invited: number;
    converted: number;
    pending: number;
    totalCommissionSoles: number;
  };
}

const REFERRAL_PROFILES_COLLECTION = "referral_profiles";
const REFERRAL_CODES_COLLECTION = "referral_codes";
const REFERRAL_EVENTS_COLLECTION = "referral_events";
const DEFAULT_APP_URL = "https://www.fastpagepro.com";
const MAX_REFERRAL_CODE_LEN = 20;

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeText(value: unknown, maxLen = 160): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function normalizeReferralCode(rawCode: unknown): string {
  return sanitizeText(rawCode, MAX_REFERRAL_CODE_LEN)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, MAX_REFERRAL_CODE_LEN);
}

function buildBaseCodeFromEmail(email: string): string {
  const local = email.split("@")[0] || "FAST";
  const base = local
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  return base || "FAST";
}

function buildCandidateCode(base: string, attempt: number): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const numbered = `${base}${attempt > 0 ? String(attempt) : ""}${suffix}`;
  return normalizeReferralCode(numbered).slice(0, MAX_REFERRAL_CODE_LEN);
}

function assertReferralsStorage() {
  if (!adminDb) {
    throw new Error("SERVICE_UNAVAILABLE: referral storage unavailable");
  }
  return adminDb;
}

function mapProfile(userId: string, payload: Record<string, unknown>): ReferralProfileRecord {
  return {
    userId,
    email: sanitizeText(payload.email, 180),
    referralCode: normalizeReferralCode(payload.referralCode),
    invitedCount: Math.max(0, Math.floor(toNumber(payload.invitedCount, 0))),
    convertedCount: Math.max(0, Math.floor(toNumber(payload.convertedCount, 0))),
    totalCommissionSoles: Math.max(0, Number(toNumber(payload.totalCommissionSoles, 0).toFixed(2))),
    createdAt: Math.max(0, Math.floor(toNumber(payload.createdAt, Date.now()))),
    updatedAt: Math.max(0, Math.floor(toNumber(payload.updatedAt, Date.now()))),
  };
}

function mapEvent(id: string, payload: Record<string, unknown>): ReferralEventRecord {
  return {
    id,
    inviterUserId: sanitizeText(payload.inviterUserId, 120),
    inviterCode: normalizeReferralCode(payload.inviterCode),
    invitedUserId: sanitizeText(payload.invitedUserId, 120),
    invitedEmail: sanitizeText(payload.invitedEmail, 180),
    status: payload.status === "PAID" ? "PAID" : "REGISTERED",
    requestedPlan: sanitizeText(payload.requestedPlan, 32) || "BUSINESS",
    amountSoles: Math.max(0, Number(toNumber(payload.amountSoles, 0).toFixed(2))),
    commissionPercent: clamp(Math.floor(toNumber(payload.commissionPercent, 0)), 0, 100),
    commissionSoles: Math.max(0, Number(toNumber(payload.commissionSoles, 0).toFixed(2))),
    createdAt: Math.max(0, Math.floor(toNumber(payload.createdAt, Date.now()))),
    updatedAt: Math.max(0, Math.floor(toNumber(payload.updatedAt, Date.now()))),
    paidAt: toNumber(payload.paidAt, 0) > 0 ? Math.floor(toNumber(payload.paidAt, 0)) : undefined,
  };
}

async function reserveReferralCode(userId: string, email: string): Promise<string> {
  const db = assertReferralsStorage();
  const base = buildBaseCodeFromEmail(email || userId);

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = buildCandidateCode(base, attempt);
    if (!candidate) continue;

    const codeRef = db.collection(REFERRAL_CODES_COLLECTION).doc(candidate);
    const now = Date.now();
    try {
      await codeRef.create({
        code: candidate,
        userId,
        email,
        active: true,
        createdAt: now,
        updatedAt: now,
      });
      return candidate;
    } catch (error: any) {
      const message = String(error?.message || "").toLowerCase();
      const code = String(error?.code || "").toLowerCase();
      if (message.includes("already exists") || code.includes("already-exists")) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("REFERRAL_CODE_GENERATION_FAILED");
}

export async function ensureReferralProfile(input: {
  userId: string;
  email?: string;
}): Promise<ReferralProfileRecord> {
  const db = assertReferralsStorage();
  const userId = sanitizeText(input.userId, 120);
  const email = sanitizeText(input.email, 180);
  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const profileRef = db.collection(REFERRAL_PROFILES_COLLECTION).doc(userId);
  const existing = await profileRef.get();
  if (existing.exists) {
    const payload = (existing.data() || {}) as Record<string, unknown>;
    const mapped = mapProfile(userId, payload);
    if (mapped.referralCode) {
      return mapped;
    }
  }

  const code = await reserveReferralCode(userId, email);
  const now = Date.now();
  await profileRef.set(
    {
      userId,
      email,
      referralCode: code,
      invitedCount: existing.exists ? toNumber(existing.data()?.invitedCount, 0) : 0,
      convertedCount: existing.exists ? toNumber(existing.data()?.convertedCount, 0) : 0,
      totalCommissionSoles: existing.exists ? toNumber(existing.data()?.totalCommissionSoles, 0) : 0,
      createdAt: existing.exists ? toNumber(existing.data()?.createdAt, now) : now,
      updatedAt: now,
    },
    { merge: true },
  );

  return {
    userId,
    email,
    referralCode: code,
    invitedCount: existing.exists ? Math.floor(toNumber(existing.data()?.invitedCount, 0)) : 0,
    convertedCount: existing.exists ? Math.floor(toNumber(existing.data()?.convertedCount, 0)) : 0,
    totalCommissionSoles: Number(
      (existing.exists ? toNumber(existing.data()?.totalCommissionSoles, 0) : 0).toFixed(2),
    ),
    createdAt: Math.floor(existing.exists ? toNumber(existing.data()?.createdAt, now) : now),
    updatedAt: now,
  };
}

export async function applyReferralCode(input: {
  invitedUserId: string;
  invitedEmail?: string;
  code: string;
}) {
  const db = assertReferralsStorage();
  const invitedUserId = sanitizeText(input.invitedUserId, 120);
  const invitedEmail = sanitizeText(input.invitedEmail, 180);
  const code = normalizeReferralCode(input.code);

  if (!invitedUserId) {
    throw new Error("USER_ID_REQUIRED");
  }
  if (!code) {
    throw new Error("INVALID_REFERRAL_CODE");
  }

  const eventRef = db.collection(REFERRAL_EVENTS_COLLECTION).doc(invitedUserId);
  const existingEvent = await eventRef.get();
  if (existingEvent.exists) {
    const mapped = mapEvent(existingEvent.id, (existingEvent.data() || {}) as Record<string, unknown>);
    return {
      applied: false,
      alreadyLinked: true,
      inviterUserId: mapped.inviterUserId,
      code: mapped.inviterCode,
      status: mapped.status,
    };
  }

  const codeRef = db.collection(REFERRAL_CODES_COLLECTION).doc(code);
  const codeSnapshot = await codeRef.get();
  if (!codeSnapshot.exists) {
    throw new Error("REFERRAL_CODE_NOT_FOUND");
  }

  const codePayload = (codeSnapshot.data() || {}) as Record<string, unknown>;
  const inviterUserId = sanitizeText(codePayload.userId, 120);
  const active = codePayload.active !== false;
  if (!active || !inviterUserId) {
    throw new Error("REFERRAL_CODE_NOT_FOUND");
  }
  if (inviterUserId === invitedUserId) {
    throw new Error("SELF_REFERRAL_NOT_ALLOWED");
  }

  const now = Date.now();
  const profileRef = db.collection(REFERRAL_PROFILES_COLLECTION).doc(inviterUserId);
  const batch = db.batch();
  batch.set(
    eventRef,
    {
      inviterUserId,
      inviterCode: code,
      invitedUserId,
      invitedEmail,
      status: "REGISTERED",
      requestedPlan: "",
      amountSoles: 0,
      commissionPercent: 0,
      commissionSoles: 0,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );
  batch.set(
    profileRef,
    {
      userId: inviterUserId,
      invitedCount: FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true },
  );
  await batch.commit();

  return {
    applied: true,
    alreadyLinked: false,
    inviterUserId,
    code,
    status: "REGISTERED" as const,
  };
}

function getReferralCommissionPercent(): number {
  const raw = Number(process.env.REFERRAL_COMMISSION_PERCENT || 10);
  if (!Number.isFinite(raw)) return 10;
  return clamp(Math.floor(raw), 1, 50);
}

export async function markReferralPaid(input: {
  invitedUserId: string;
  requestedPlan: string;
  amountSoles: number;
}) {
  const db = assertReferralsStorage();
  const invitedUserId = sanitizeText(input.invitedUserId, 120);
  if (!invitedUserId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const eventRef = db.collection(REFERRAL_EVENTS_COLLECTION).doc(invitedUserId);
  const snapshot = await eventRef.get();
  if (!snapshot.exists) {
    return { updated: false };
  }

  const event = mapEvent(snapshot.id, (snapshot.data() || {}) as Record<string, unknown>);
  if (event.status === "PAID") {
    return { updated: false, alreadyPaid: true };
  }

  const commissionPercent = getReferralCommissionPercent();
  const amountSoles = Math.max(0, Number(toNumber(input.amountSoles, 0).toFixed(2)));
  const commissionSoles = Number(((amountSoles * commissionPercent) / 100).toFixed(2));
  const now = Date.now();

  const profileRef = db.collection(REFERRAL_PROFILES_COLLECTION).doc(event.inviterUserId);
  const batch = db.batch();
  batch.set(
    eventRef,
    {
      status: "PAID",
      requestedPlan: sanitizeText(input.requestedPlan, 40),
      amountSoles,
      commissionPercent,
      commissionSoles,
      paidAt: now,
      updatedAt: now,
    },
    { merge: true },
  );
  batch.set(
    profileRef,
    {
      userId: event.inviterUserId,
      convertedCount: FieldValue.increment(1),
      totalCommissionSoles: FieldValue.increment(commissionSoles),
      updatedAt: now,
    },
    { merge: true },
  );
  await batch.commit();

  return {
    updated: true,
    inviterUserId: event.inviterUserId,
    commissionSoles,
    commissionPercent,
  };
}

export async function buildReferralSummary(input: {
  userId: string;
  email?: string;
}): Promise<ReferralSummary> {
  const db = assertReferralsStorage();
  const profile = await ensureReferralProfile(input);
  const appUrl = String(process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL)
    .trim()
    .replace(/\/$/, "");

  const eventsSnapshot = await db
    .collection(REFERRAL_EVENTS_COLLECTION)
    .where("inviterUserId", "==", profile.userId)
    .get();

  const events = eventsSnapshot.docs
    .map((docSnapshot) => mapEvent(docSnapshot.id, (docSnapshot.data() || {}) as Record<string, unknown>))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 100);

  const converted = events.filter((event) => event.status === "PAID").length;
  const pending = events.filter((event) => event.status !== "PAID").length;
  const totalCommissionSoles = Number(
    events
      .reduce((acc, event) => acc + (event.status === "PAID" ? event.commissionSoles : 0), 0)
      .toFixed(2),
  );

  const normalizedProfile: ReferralProfileRecord = {
    ...profile,
    invitedCount: Math.max(profile.invitedCount, events.length),
    convertedCount: Math.max(profile.convertedCount, converted),
    totalCommissionSoles: Math.max(profile.totalCommissionSoles, totalCommissionSoles),
  };

  return {
    profile: normalizedProfile,
    referralLink: `${appUrl}/signup?ref=${normalizedProfile.referralCode}`,
    events,
    stats: {
      invited: normalizedProfile.invitedCount,
      converted: normalizedProfile.convertedCount,
      pending,
      totalCommissionSoles: normalizedProfile.totalCommissionSoles,
    },
  };
}

