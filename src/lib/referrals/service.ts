import { FieldValue } from "firebase-admin/firestore";
import { customAlphabet } from "nanoid";
import { adminDb } from "@/lib/firebaseAdmin";

type ReferralEventStatus = "REGISTERED" | "PAID";

type ReferralCommissionConfig = {
  level1Percent: number;
  level2Percent: number;
  maxPercent: number;
  totalPercent: number;
};

export interface ReferralProfileRecord {
  userId: string;
  email: string;
  referralCode: string;
  customAlias: string;
  customAliases: string[];
  invitedCount: number;
  convertedCount: number;
  totalCommissionSoles: number;
  level1CommissionSoles: number;
  level2CommissionSoles: number;
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

export interface ReferralPayoutRecipientRecord {
  userId: string;
  commissionPercent: number;
  commissionSoles: number;
}

export interface ReferralPayoutRecord {
  id: string;
  paymentRef: string;
  sourceInvitedUserId: string;
  sourceInvitedEmail: string;
  requestedPlan: string;
  amountSoles: number;
  level1?: ReferralPayoutRecipientRecord;
  level2?: ReferralPayoutRecipientRecord;
  receiverUserIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ReferralNetworkRecord {
  invitedUserId: string;
  invitedEmail: string;
  inviterUserId: string;
  status: ReferralEventStatus;
  level: 1 | 2;
  createdAt: number;
  lastPaidAt?: number;
  totalGeneratedSoles: number;
  totalCommissionSoles: number;
}

export interface ReferralSummary {
  profile: ReferralProfileRecord;
  referralLink: string;
  events: ReferralEventRecord[];
  payouts: ReferralPayoutRecord[];
  network: {
    level1: ReferralNetworkRecord[];
    level2: ReferralNetworkRecord[];
  };
  stats: {
    invited: number;
    converted: number;
    pending: number;
    level1Referrals: number;
    level2Referrals: number;
    totalCommissionSoles: number;
    level1CommissionSoles: number;
    level2CommissionSoles: number;
    level1CommissionPercent: number;
    level2CommissionPercent: number;
    maxCommissionPercent: number;
  };
}

const REFERRAL_PROFILES_COLLECTION = "referral_profiles";
const REFERRAL_CODES_COLLECTION = "referral_codes";
const REFERRAL_EVENTS_COLLECTION = "referral_events";
const REFERRAL_ALIASES_COLLECTION = "referral_aliases";
const REFERRAL_PAYOUTS_COLLECTION = "referral_payouts";
const DEFAULT_APP_URL = "https://www.fastpagepro.com";
const MAX_REFERRAL_CODE_LEN = 32;
const MAX_ALIAS_LEN = 32;
const MAX_ALIASES_PER_PROFILE = 3;
const MAX_PAYMENT_REF_LEN = 120;
const REFERRAL_CODE_SUFFIX = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 4);
const RESERVED_ALIASES = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "settings",
  "signup",
  "www",
  "afiliados",
]);

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

function roundMoney(value: number): number {
  return Number(Math.max(0, value).toFixed(2));
}

function normalizeReferralCode(rawCode: unknown): string {
  return sanitizeText(rawCode, MAX_REFERRAL_CODE_LEN)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_REFERRAL_CODE_LEN);
}

function normalizeReferralAlias(rawAlias: unknown): string {
  return sanitizeText(rawAlias, MAX_ALIAS_LEN)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_ALIAS_LEN);
}

function normalizeAliasList(rawAliases: unknown, fallbackAlias = ""): string[] {
  const normalizedFallback = normalizeReferralAlias(fallbackAlias);
  const source = Array.isArray(rawAliases) ? rawAliases : [];
  const merged = [...source, normalizedFallback]
    .map((entry) => normalizeReferralAlias(entry))
    .filter((entry) => entry.length >= 3)
    .slice(0, 20);

  const unique: string[] = [];
  for (const entry of merged) {
    if (!entry || unique.includes(entry)) continue;
    unique.push(entry);
    if (unique.length >= MAX_ALIASES_PER_PROFILE) break;
  }
  return unique;
}

function getPrimaryAlias(profile: ReferralProfileRecord): string {
  const fromCustomAlias = normalizeReferralAlias(profile.customAlias);
  if (fromCustomAlias) return fromCustomAlias;
  return normalizeReferralAlias(profile.customAliases[0] || "");
}

function sanitizePaymentRef(rawPaymentRef: unknown): string {
  return sanitizeText(rawPaymentRef, MAX_PAYMENT_REF_LEN)
    .replace(/[^a-zA-Z0-9:_-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getReferralCommissionConfig(): ReferralCommissionConfig {
  const maxPercent = clamp(Math.floor(toNumber(process.env.REFERRAL_MAX_PERCENT, 50)), 1, 90);
  const requestedLevel1 = clamp(Math.floor(toNumber(process.env.REFERRAL_LEVEL1_PERCENT, 40)), 1, 90);
  const requestedLevel2 = clamp(Math.floor(toNumber(process.env.REFERRAL_LEVEL2_PERCENT, 10)), 0, 90);

  const level1Percent = Math.min(requestedLevel1, maxPercent);
  const level2Percent = Math.min(requestedLevel2, Math.max(0, maxPercent - level1Percent));

  return {
    level1Percent,
    level2Percent,
    maxPercent,
    totalPercent: level1Percent + level2Percent,
  };
}

function getAppUrl(): string {
  return String(process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL)
    .trim()
    .replace(/\/$/, "");
}

function getAffiliatesDomain(): string {
  return String(process.env.NEXT_PUBLIC_REFERRAL_AFFILIATES_DOMAIN || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*/, "");
}

function getAffiliatesBaseUrl(): string {
  return String(process.env.NEXT_PUBLIC_REFERRAL_AFFILIATES_BASE_URL || "")
    .trim()
    .replace(/\/$/, "");
}

function buildReferralLink(profile: ReferralProfileRecord): string {
  const primaryAlias = getPrimaryAlias(profile);
  if (primaryAlias) {
    const affiliatesDomain = getAffiliatesDomain();
    if (affiliatesDomain) {
      return `https://${primaryAlias}.${affiliatesDomain}`;
    }
    const affiliatesBaseUrl = getAffiliatesBaseUrl();
    if (affiliatesBaseUrl) {
      return `${affiliatesBaseUrl}/${primaryAlias}`;
    }
    return `${getAppUrl()}/afiliados/${primaryAlias}`;
  }
  return `${getAppUrl()}/signup?ref=${profile.referralCode}`;
}

function buildBaseCodeFromEmail(email: string): string {
  const local = email.split("@")[0] || "FAST";
  const base = local
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  return base || "FAST";
}

function buildBaseAliasFromEmail(email: string, userId: string): string {
  const local = email.split("@")[0] || userId || "afiliado";
  const base = normalizeReferralAlias(local).slice(0, 18);
  return base || "afiliado";
}

function buildCandidateCode(base: string, attempt: number): string {
  const suffix = REFERRAL_CODE_SUFFIX();
  const numbered = `${base}${attempt > 0 ? String(attempt) : ""}${suffix}`;
  return normalizeReferralCode(numbered).slice(0, MAX_REFERRAL_CODE_LEN);
}

function buildCandidateAlias(base: string, attempt: number): string {
  if (attempt <= 0) return normalizeReferralAlias(base);
  const numbered = `${base}-${attempt + 1}`;
  return normalizeReferralAlias(numbered);
}

function assertReferralsStorage() {
  if (!adminDb) {
    throw new Error("SERVICE_UNAVAILABLE: referral storage unavailable");
  }
  return adminDb;
}

function mapProfile(userId: string, payload: Record<string, unknown>): ReferralProfileRecord {
  const customAlias = normalizeReferralAlias(payload.customAlias);
  const customAliases = normalizeAliasList(payload.customAliases, customAlias);
  return {
    userId,
    email: sanitizeText(payload.email, 180),
    referralCode: normalizeReferralCode(payload.referralCode),
    customAlias: customAlias || customAliases[0] || "",
    customAliases,
    invitedCount: Math.max(0, Math.floor(toNumber(payload.invitedCount, 0))),
    convertedCount: Math.max(0, Math.floor(toNumber(payload.convertedCount, 0))),
    totalCommissionSoles: roundMoney(toNumber(payload.totalCommissionSoles, 0)),
    level1CommissionSoles: roundMoney(toNumber(payload.level1CommissionSoles, 0)),
    level2CommissionSoles: roundMoney(toNumber(payload.level2CommissionSoles, 0)),
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
    amountSoles: roundMoney(toNumber(payload.amountSoles, 0)),
    commissionPercent: clamp(Math.floor(toNumber(payload.commissionPercent, 0)), 0, 100),
    commissionSoles: roundMoney(toNumber(payload.commissionSoles, 0)),
    createdAt: Math.max(0, Math.floor(toNumber(payload.createdAt, Date.now()))),
    updatedAt: Math.max(0, Math.floor(toNumber(payload.updatedAt, Date.now()))),
    paidAt: toNumber(payload.paidAt, 0) > 0 ? Math.floor(toNumber(payload.paidAt, 0)) : undefined,
  };
}

function mapRecipient(payload: unknown): ReferralPayoutRecipientRecord | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const data = payload as Record<string, unknown>;
  const userId = sanitizeText(data.userId, 120);
  if (!userId) return undefined;
  return {
    userId,
    commissionPercent: clamp(Math.floor(toNumber(data.commissionPercent, 0)), 0, 100),
    commissionSoles: roundMoney(toNumber(data.commissionSoles, 0)),
  };
}

function mapPayout(id: string, payload: Record<string, unknown>): ReferralPayoutRecord {
  const receiverUserIdsRaw = Array.isArray(payload.receiverUserIds) ? payload.receiverUserIds : [];
  const receiverUserIds = receiverUserIdsRaw
    .map((entry) => sanitizeText(entry, 120))
    .filter(Boolean)
    .slice(0, 4);

  return {
    id,
    paymentRef: sanitizePaymentRef(payload.paymentRef || id),
    sourceInvitedUserId: sanitizeText(payload.sourceInvitedUserId, 120),
    sourceInvitedEmail: sanitizeText(payload.sourceInvitedEmail, 180),
    requestedPlan: sanitizeText(payload.requestedPlan, 40),
    amountSoles: roundMoney(toNumber(payload.amountSoles, 0)),
    level1: mapRecipient(payload.level1),
    level2: mapRecipient(payload.level2),
    receiverUserIds,
    createdAt: Math.max(0, Math.floor(toNumber(payload.createdAt, Date.now()))),
    updatedAt: Math.max(0, Math.floor(toNumber(payload.updatedAt, Date.now()))),
  };
}

async function reserveReferralCode(userId: string, email: string): Promise<string> {
  const db = assertReferralsStorage();
  const base = buildBaseCodeFromEmail(email || userId);

  for (let attempt = 0; attempt < 30; attempt += 1) {
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

async function reserveExactReferralCode(input: {
  userId: string;
  email?: string;
  code: string;
  customAlias?: string;
}): Promise<string> {
  const db = assertReferralsStorage();
  const userId = sanitizeText(input.userId, 120);
  const email = sanitizeText(input.email, 180);
  const code = normalizeReferralCode(input.code);
  const customAlias = normalizeReferralAlias(input.customAlias);

  if (!userId || !code) {
    throw new Error("INVALID_REFERRAL_CODE");
  }

  const codeRef = db.collection(REFERRAL_CODES_COLLECTION).doc(code);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(codeRef);
    const payload = (snapshot.data() || {}) as Record<string, unknown>;
    const ownerUserId = sanitizeText(payload.userId, 120);
    if (snapshot.exists && ownerUserId !== userId) {
      throw new Error("REFERRAL_CODE_TAKEN");
    }

    tx.set(
      codeRef,
      {
        code,
        userId,
        email,
        customAlias,
        active: true,
        createdAt: snapshot.exists ? toNumber(payload.createdAt, now) : now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  return code;
}

async function deactivateReferralCode(code: string) {
  if (!code) return;
  const db = assertReferralsStorage();
  const now = Date.now();
  await db
    .collection(REFERRAL_CODES_COLLECTION)
    .doc(code)
    .set(
      {
        active: false,
        updatedAt: now,
      },
      { merge: true },
    );
}

async function upsertReferralCodeMetadata(input: {
  code: string;
  userId: string;
  email?: string;
  customAlias?: string;
}) {
  const code = normalizeReferralCode(input.code);
  if (!code) return;
  const db = assertReferralsStorage();
  const now = Date.now();
  await db
    .collection(REFERRAL_CODES_COLLECTION)
    .doc(code)
    .set(
      {
        code,
        userId: sanitizeText(input.userId, 120),
        email: sanitizeText(input.email, 180),
        customAlias: normalizeReferralAlias(input.customAlias),
        active: true,
        updatedAt: now,
      },
      { merge: true },
    );
}

async function releaseReferralAlias(alias: string, userId: string) {
  const normalizedAlias = normalizeReferralAlias(alias);
  if (!normalizedAlias) return;
  const db = assertReferralsStorage();
  const now = Date.now();
  await db
    .collection(REFERRAL_ALIASES_COLLECTION)
    .doc(normalizedAlias)
    .set(
      {
        alias: normalizedAlias,
        userId: sanitizeText(userId, 120),
        active: false,
        releasedAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
}

async function reserveReferralAlias(input: {
  userId: string;
  email?: string;
  alias?: string;
  referralCode: string;
}): Promise<string> {
  const db = assertReferralsStorage();
  const userId = sanitizeText(input.userId, 120);
  const email = sanitizeText(input.email, 180);
  const requestedAlias = normalizeReferralAlias(input.alias);
  const baseAlias = requestedAlias || buildBaseAliasFromEmail(email, userId);

  if (!baseAlias || baseAlias.length < 3 || RESERVED_ALIASES.has(baseAlias)) {
    throw new Error("INVALID_REFERRAL_ALIAS");
  }

  const maxAttempts = requestedAlias ? 1 : 40;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = buildCandidateAlias(baseAlias, attempt);
    if (!candidate || candidate.length < 3 || RESERVED_ALIASES.has(candidate)) {
      continue;
    }
    const aliasRef = db.collection(REFERRAL_ALIASES_COLLECTION).doc(candidate);
    const now = Date.now();

    try {
      await db.runTransaction(async (tx) => {
        const aliasSnapshot = await tx.get(aliasRef);
        const aliasPayload = (aliasSnapshot.data() || {}) as Record<string, unknown>;
        const aliasOwner = sanitizeText(aliasPayload.userId, 120);
        const aliasActive = aliasPayload.active !== false;
        if (aliasSnapshot.exists && aliasActive && aliasOwner && aliasOwner !== userId) {
          throw new Error("REFERRAL_ALIAS_TAKEN");
        }
        tx.set(
          aliasRef,
          {
            alias: candidate,
            userId,
            referralCode: normalizeReferralCode(input.referralCode),
            email,
            active: true,
            createdAt: aliasSnapshot.exists ? toNumber(aliasPayload.createdAt, now) : now,
            updatedAt: now,
          },
          { merge: true },
        );
      });
      return candidate;
    } catch (error: any) {
      const message = String(error?.message || "");
      if (message.includes("REFERRAL_ALIAS_TAKEN")) {
        if (requestedAlias) {
          throw new Error("REFERRAL_ALIAS_TAKEN");
        }
        continue;
      }
      throw error;
    }
  }

  throw new Error("REFERRAL_ALIAS_GENERATION_FAILED");
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
    const updates: Record<string, unknown> = {};
    const normalizedAliases = normalizeAliasList(mapped.customAliases, mapped.customAlias);
    let nextProfile: ReferralProfileRecord = {
      ...mapped,
      customAliases: normalizedAliases,
      customAlias: normalizeReferralAlias(mapped.customAlias) || normalizedAliases[0] || "",
    };

    if (!mapped.referralCode) {
      const generatedCode = await reserveReferralCode(userId, email || mapped.email || userId);
      nextProfile = {
        ...nextProfile,
        referralCode: generatedCode,
      };
      updates.referralCode = generatedCode;
    }

    if (!mapped.email && email) {
      nextProfile = {
        ...nextProfile,
        email,
      };
      updates.email = email;
    }

    if (
      nextProfile.customAlias !== mapped.customAlias ||
      JSON.stringify(nextProfile.customAliases) !== JSON.stringify(mapped.customAliases)
    ) {
      updates.customAlias = nextProfile.customAlias;
      updates.customAliases = nextProfile.customAliases;
    }

    if (Object.keys(updates).length > 0) {
      const now = Date.now();
      updates.updatedAt = now;
      await profileRef.set(updates, { merge: true });
      nextProfile.updatedAt = now;
    }

    for (const alias of nextProfile.customAliases) {
      await reserveReferralAlias({
        userId,
        email: nextProfile.email,
        alias,
        referralCode: nextProfile.referralCode,
      }).catch(() => undefined);
    }

    await upsertReferralCodeMetadata({
      code: nextProfile.referralCode,
      userId,
      email: nextProfile.email,
      customAlias: nextProfile.customAlias,
    });

    return nextProfile;
  }

  const code = await reserveReferralCode(userId, email);
  const now = Date.now();
  const profile: ReferralProfileRecord = {
    userId,
    email,
    referralCode: code,
    customAlias: "",
    customAliases: [],
    invitedCount: 0,
    convertedCount: 0,
    totalCommissionSoles: 0,
    level1CommissionSoles: 0,
    level2CommissionSoles: 0,
    createdAt: now,
    updatedAt: now,
  };
  await profileRef.set(profile, { merge: true });
  await upsertReferralCodeMetadata({
    code,
    userId,
    email,
  });

  return profile;
}

export async function updateReferralProfileSettings(input: {
  userId: string;
  email?: string;
  customAlias?: string;
  regenerateCode?: boolean;
}): Promise<ReferralSummary> {
  const db = assertReferralsStorage();
  const userId = sanitizeText(input.userId, 120);
  const email = sanitizeText(input.email, 180);
  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const currentProfile = await ensureReferralProfile({
    userId,
    email,
  });

  const nextEmail = email || currentProfile.email;
  let nextCode = currentProfile.referralCode;
  let nextAliases = normalizeAliasList(currentProfile.customAliases, currentProfile.customAlias);
  let nextAlias = normalizeReferralAlias(currentProfile.customAlias) || nextAliases[0] || "";
  const now = Date.now();

  if (input.regenerateCode) {
    nextCode = await reserveReferralCode(userId, nextEmail || userId);
    if (currentProfile.referralCode && currentProfile.referralCode !== nextCode) {
      await deactivateReferralCode(currentProfile.referralCode);
    }
  }

  if (typeof input.customAlias === "string") {
    const normalizedInputAlias = normalizeReferralAlias(input.customAlias);
    if (!normalizedInputAlias || normalizedInputAlias.length < 3 || RESERVED_ALIASES.has(normalizedInputAlias)) {
      throw new Error("INVALID_REFERRAL_ALIAS");
    }
    let reservedAlias = normalizedInputAlias;
    if (!nextAliases.includes(normalizedInputAlias)) {
      if (nextAliases.length >= MAX_ALIASES_PER_PROFILE) {
        throw new Error("ALIAS_LIMIT_REACHED");
      }
      reservedAlias = await reserveReferralAlias({
        userId,
        email: nextEmail,
        alias: normalizedInputAlias,
        referralCode: nextCode,
      });
      nextAliases = [reservedAlias, ...nextAliases].slice(0, MAX_ALIASES_PER_PROFILE);
    }
    const aliasAsCode = normalizeReferralCode(reservedAlias);
    if (!aliasAsCode) {
      throw new Error("INVALID_REFERRAL_ALIAS");
    }
    nextCode = await reserveExactReferralCode({
      userId,
      email: nextEmail,
      code: aliasAsCode,
      customAlias: reservedAlias,
    });
    nextAlias = reservedAlias;
  }

  nextAliases = normalizeAliasList(nextAliases, nextAlias);
  if (!nextAlias && nextAliases.length > 0) {
    nextAlias = nextAliases[0];
  }

  for (const alias of nextAliases) {
    await reserveReferralAlias({
      userId,
      email: nextEmail,
      alias,
      referralCode: nextCode,
    });
  }

  await db
    .collection(REFERRAL_PROFILES_COLLECTION)
    .doc(userId)
    .set(
      {
        userId,
        email: nextEmail,
        referralCode: nextCode,
        customAlias: nextAlias,
        customAliases: nextAliases,
        updatedAt: now,
      },
      { merge: true },
    );

  await upsertReferralCodeMetadata({
    code: nextCode,
    userId,
    email: nextEmail,
    customAlias: nextAlias,
  });

  return buildReferralSummary({
    userId,
    email: nextEmail,
  });
}

export async function applyReferralCode(input: {
  invitedUserId: string;
  invitedEmail?: string;
  code: string;
}) {
  const db = assertReferralsStorage();
  const invitedUserId = sanitizeText(input.invitedUserId, 120);
  const invitedEmail = sanitizeText(input.invitedEmail, 180);
  const referralInput = sanitizeText(input.code, MAX_ALIAS_LEN);

  if (!invitedUserId) {
    throw new Error("USER_ID_REQUIRED");
  }
  if (!referralInput) {
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

  let inviterUserId = "";
  let resolvedCode = normalizeReferralCode(referralInput);

  if (resolvedCode) {
    const codeRef = db.collection(REFERRAL_CODES_COLLECTION).doc(resolvedCode);
    const codeSnapshot = await codeRef.get();
    if (codeSnapshot.exists) {
      const codePayload = (codeSnapshot.data() || {}) as Record<string, unknown>;
      const active = codePayload.active !== false;
      const owner = sanitizeText(codePayload.userId, 120);
      if (active && owner) {
        inviterUserId = owner;
      }
    }
  }

  if (!inviterUserId) {
    const normalizedAlias = normalizeReferralAlias(referralInput);
    if (!normalizedAlias) {
      throw new Error("REFERRAL_CODE_NOT_FOUND");
    }

    const aliasSnapshot = await db.collection(REFERRAL_ALIASES_COLLECTION).doc(normalizedAlias).get();
    if (!aliasSnapshot.exists) {
      throw new Error("REFERRAL_CODE_NOT_FOUND");
    }
    const aliasPayload = (aliasSnapshot.data() || {}) as Record<string, unknown>;
    const aliasActive = aliasPayload.active !== false;
    const aliasOwner = sanitizeText(aliasPayload.userId, 120);
    if (!aliasActive || !aliasOwner) {
      throw new Error("REFERRAL_CODE_NOT_FOUND");
    }
    inviterUserId = aliasOwner;

    const aliasCode = normalizeReferralCode(aliasPayload.referralCode);
    if (aliasCode) {
      resolvedCode = aliasCode;
    } else {
      const inviterProfileSnapshot = await db.collection(REFERRAL_PROFILES_COLLECTION).doc(aliasOwner).get();
      if (!inviterProfileSnapshot.exists) {
        throw new Error("REFERRAL_CODE_NOT_FOUND");
      }
      const inviterProfilePayload = (inviterProfileSnapshot.data() || {}) as Record<string, unknown>;
      resolvedCode = normalizeReferralCode(inviterProfilePayload.referralCode);
      if (!resolvedCode) {
        throw new Error("REFERRAL_CODE_NOT_FOUND");
      }
    }
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
      inviterCode: resolvedCode,
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
    code: resolvedCode,
    status: "REGISTERED" as const,
  };
}

export async function markReferralPaid(input: {
  invitedUserId: string;
  requestedPlan: string;
  amountSoles: number;
  paymentRef?: string;
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
  if (!event.inviterUserId) {
    return { updated: false };
  }

  const commissionConfig = getReferralCommissionConfig();
  const requestedPlan = sanitizeText(input.requestedPlan, 40);
  const amountSoles = roundMoney(toNumber(input.amountSoles, 0));
  const sanitizedPaymentRef = sanitizePaymentRef(input.paymentRef);
  const payoutId =
    sanitizedPaymentRef ||
    sanitizePaymentRef(`${invitedUserId}:${requestedPlan}:${amountSoles}:${Date.now().toString(36)}:${REFERRAL_CODE_SUFFIX()}`);
  const payoutRef = db.collection(REFERRAL_PAYOUTS_COLLECTION).doc(payoutId);
  const existingPayout = await payoutRef.get();
  if (existingPayout.exists) {
    return {
      updated: false,
      alreadySettled: true,
      payoutId,
    };
  }

  const level1CommissionSoles = roundMoney((amountSoles * commissionConfig.level1Percent) / 100);
  let level2CommissionSoles = 0;
  let level2UserId = "";

  if (commissionConfig.level2Percent > 0) {
    const inviterEventSnapshot = await db.collection(REFERRAL_EVENTS_COLLECTION).doc(event.inviterUserId).get();
    if (inviterEventSnapshot.exists) {
      const inviterEvent = mapEvent(
        inviterEventSnapshot.id,
        (inviterEventSnapshot.data() || {}) as Record<string, unknown>,
      );
      if (
        inviterEvent.inviterUserId &&
        inviterEvent.inviterUserId !== event.inviterUserId &&
        inviterEvent.inviterUserId !== invitedUserId
      ) {
        level2UserId = inviterEvent.inviterUserId;
        level2CommissionSoles = roundMoney((amountSoles * commissionConfig.level2Percent) / 100);
      }
    }
  }

  const now = Date.now();
  const directInviterProfile = await ensureReferralProfile({
    userId: event.inviterUserId,
  });
  const secondLevelProfile = level2UserId
    ? await ensureReferralProfile({
        userId: level2UserId,
      })
    : null;

  const receiverUserIds = [event.inviterUserId];
  if (level2UserId) receiverUserIds.push(level2UserId);
  const isFirstPaidSettlement = event.status !== "PAID";

  const batch = db.batch();
  batch.set(
    payoutRef,
    {
      id: payoutId,
      paymentRef: payoutId,
      sourceInvitedUserId: invitedUserId,
      sourceInvitedEmail: event.invitedEmail,
      requestedPlan,
      amountSoles,
      level1: {
        userId: event.inviterUserId,
        commissionPercent: commissionConfig.level1Percent,
        commissionSoles: level1CommissionSoles,
      },
      level2: level2UserId
        ? {
            userId: level2UserId,
            commissionPercent: commissionConfig.level2Percent,
            commissionSoles: level2CommissionSoles,
          }
        : null,
      receiverUserIds,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );
  batch.set(
    eventRef,
    {
      status: "PAID",
      requestedPlan,
      amountSoles,
      commissionPercent: commissionConfig.totalPercent,
      commissionSoles: roundMoney(level1CommissionSoles + level2CommissionSoles),
      paidAt: isFirstPaidSettlement ? now : event.paidAt || now,
      updatedAt: now,
    },
    { merge: true },
  );
  batch.set(
    db.collection(REFERRAL_PROFILES_COLLECTION).doc(event.inviterUserId),
    {
      userId: event.inviterUserId,
      email: directInviterProfile.email,
      convertedCount: FieldValue.increment(isFirstPaidSettlement ? 1 : 0),
      totalCommissionSoles: FieldValue.increment(level1CommissionSoles),
      level1CommissionSoles: FieldValue.increment(level1CommissionSoles),
      updatedAt: now,
    },
    { merge: true },
  );

  if (level2UserId && secondLevelProfile) {
    batch.set(
      db.collection(REFERRAL_PROFILES_COLLECTION).doc(level2UserId),
      {
        userId: level2UserId,
        email: secondLevelProfile.email,
        totalCommissionSoles: FieldValue.increment(level2CommissionSoles),
        level2CommissionSoles: FieldValue.increment(level2CommissionSoles),
        updatedAt: now,
      },
      { merge: true },
    );
  }

  await batch.commit();

  return {
    updated: true,
    inviterUserId: event.inviterUserId,
    secondLevelUserId: level2UserId || undefined,
    payoutId,
    commissionSoles: roundMoney(level1CommissionSoles + level2CommissionSoles),
    level1CommissionSoles,
    level2CommissionSoles,
    commissionPercent: commissionConfig.totalPercent,
    level1CommissionPercent: commissionConfig.level1Percent,
    level2CommissionPercent: commissionConfig.level2Percent,
  };
}

async function findDirectAndIndirectEvents(userId: string): Promise<{
  level1Events: ReferralEventRecord[];
  level2Events: ReferralEventRecord[];
}> {
  const db = assertReferralsStorage();
  const directSnapshot = await db
    .collection(REFERRAL_EVENTS_COLLECTION)
    .where("inviterUserId", "==", userId)
    .get();

  const level1Events = directSnapshot.docs
    .map((docSnapshot) => mapEvent(docSnapshot.id, (docSnapshot.data() || {}) as Record<string, unknown>))
    .sort((a, b) => b.createdAt - a.createdAt);

  const directInvitedIds = level1Events
    .map((event) => sanitizeText(event.invitedUserId, 120))
    .filter(Boolean)
    .slice(0, 80);

  if (directInvitedIds.length === 0) {
    return {
      level1Events: level1Events.slice(0, 300),
      level2Events: [],
    };
  }

  const indirectSnapshots = await Promise.all(
    directInvitedIds.map((directInviteeId) =>
      db.collection(REFERRAL_EVENTS_COLLECTION).where("inviterUserId", "==", directInviteeId).get(),
    ),
  );

  const level2Map = new Map<string, ReferralEventRecord>();
  for (const snapshot of indirectSnapshots) {
    for (const docSnapshot of snapshot.docs) {
      const mapped = mapEvent(docSnapshot.id, (docSnapshot.data() || {}) as Record<string, unknown>);
      if (!mapped.invitedUserId) continue;
      level2Map.set(mapped.invitedUserId, mapped);
    }
  }

  return {
    level1Events: level1Events.slice(0, 300),
    level2Events: Array.from(level2Map.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 300),
  };
}

async function getPayoutsForUser(userId: string): Promise<ReferralPayoutRecord[]> {
  const db = assertReferralsStorage();
  try {
    const snapshot = await db
      .collection(REFERRAL_PAYOUTS_COLLECTION)
      .where("receiverUserIds", "array-contains", userId)
      .get();
    return snapshot.docs
      .map((docSnapshot) => mapPayout(docSnapshot.id, (docSnapshot.data() || {}) as Record<string, unknown>))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 300);
  } catch {
    const [level1Snapshot, level2Snapshot] = await Promise.all([
      db.collection(REFERRAL_PAYOUTS_COLLECTION).where("level1.userId", "==", userId).get(),
      db.collection(REFERRAL_PAYOUTS_COLLECTION).where("level2.userId", "==", userId).get(),
    ]);
    const merged = new Map<string, ReferralPayoutRecord>();
    for (const docSnapshot of [...level1Snapshot.docs, ...level2Snapshot.docs]) {
      merged.set(docSnapshot.id, mapPayout(docSnapshot.id, (docSnapshot.data() || {}) as Record<string, unknown>));
    }
    return Array.from(merged.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 300);
  }
}

function buildNetworkRows(input: {
  viewerUserId: string;
  events: ReferralEventRecord[];
  payouts: ReferralPayoutRecord[];
  level: 1 | 2;
}): ReferralNetworkRecord[] {
  const byInvited = new Map<
    string,
    {
      generated: number;
      commission: number;
      lastPaidAt: number;
    }
  >();

  for (const payout of input.payouts) {
    const invitedUserId = sanitizeText(payout.sourceInvitedUserId, 120);
    if (!invitedUserId) continue;
    const recipient = input.level === 1 ? payout.level1 : payout.level2;
    if (!recipient || recipient.userId !== input.viewerUserId) continue;

    const current = byInvited.get(invitedUserId) || {
      generated: 0,
      commission: 0,
      lastPaidAt: 0,
    };
    current.generated = roundMoney(current.generated + payout.amountSoles);
    current.commission = roundMoney(current.commission + recipient.commissionSoles);
    current.lastPaidAt = Math.max(current.lastPaidAt, payout.createdAt);
    byInvited.set(invitedUserId, current);
  }

  return input.events
    .map((event) => {
      const payoutStats = byInvited.get(event.invitedUserId);
      return {
        invitedUserId: event.invitedUserId,
        invitedEmail: event.invitedEmail,
        inviterUserId: event.inviterUserId,
        status: event.status,
        level: input.level,
        createdAt: event.createdAt,
        lastPaidAt: payoutStats?.lastPaidAt || event.paidAt,
        totalGeneratedSoles: payoutStats?.generated || 0,
        totalCommissionSoles: payoutStats?.commission || 0,
      } satisfies ReferralNetworkRecord;
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

function buildEmptyReferralSummary(input: {
  profile: ReferralProfileRecord;
  commissionConfig: ReferralCommissionConfig;
}): ReferralSummary {
  const profile = input.profile;
  return {
    profile,
    referralLink: buildReferralLink(profile),
    events: [],
    payouts: [],
    network: {
      level1: [],
      level2: [],
    },
    stats: {
      invited: profile.invitedCount,
      converted: profile.convertedCount,
      pending: Math.max(0, profile.invitedCount - profile.convertedCount),
      level1Referrals: 0,
      level2Referrals: 0,
      totalCommissionSoles: profile.totalCommissionSoles,
      level1CommissionSoles: profile.level1CommissionSoles,
      level2CommissionSoles: profile.level2CommissionSoles,
      level1CommissionPercent: input.commissionConfig.level1Percent,
      level2CommissionPercent: input.commissionConfig.level2Percent,
      maxCommissionPercent: input.commissionConfig.maxPercent,
    },
  };
}

export async function buildReferralSummary(input: {
  userId: string;
  email?: string;
}): Promise<ReferralSummary> {
  const commissionConfig = getReferralCommissionConfig();
  const profile = await ensureReferralProfile(input);

  let level1Events: ReferralEventRecord[] = [];
  let level2Events: ReferralEventRecord[] = [];
  try {
    const events = await findDirectAndIndirectEvents(profile.userId);
    level1Events = events.level1Events;
    level2Events = events.level2Events;
  } catch (error) {
    console.warn("[Referrals] Could not load network events. Returning base summary.", error);
  }

  let payouts: ReferralPayoutRecord[] = [];
  try {
    payouts = await getPayoutsForUser(profile.userId);
  } catch (error) {
    console.warn("[Referrals] Could not load payouts. Returning summary without payouts.", error);
  }

  if (level1Events.length === 0 && level2Events.length === 0 && payouts.length === 0) {
    return buildEmptyReferralSummary({
      profile,
      commissionConfig,
    });
  }

  const level1CommissionSoles = roundMoney(
    payouts.reduce((acc, payout) => acc + (payout.level1?.userId === profile.userId ? payout.level1.commissionSoles : 0), 0),
  );
  const level2CommissionSoles = roundMoney(
    payouts.reduce((acc, payout) => acc + (payout.level2?.userId === profile.userId ? payout.level2.commissionSoles : 0), 0),
  );
  const totalCommissionSoles = roundMoney(level1CommissionSoles + level2CommissionSoles);

  const converted = level1Events.filter((event) => event.status === "PAID").length;
  const pending = level1Events.filter((event) => event.status !== "PAID").length;

  const normalizedProfile: ReferralProfileRecord = {
    ...profile,
    invitedCount: Math.max(profile.invitedCount, level1Events.length),
    convertedCount: Math.max(profile.convertedCount, converted),
    level1CommissionSoles: Math.max(profile.level1CommissionSoles, level1CommissionSoles),
    level2CommissionSoles: Math.max(profile.level2CommissionSoles, level2CommissionSoles),
    totalCommissionSoles: Math.max(profile.totalCommissionSoles, totalCommissionSoles),
  };

  const level1Network = buildNetworkRows({
    viewerUserId: profile.userId,
    events: level1Events,
    payouts,
    level: 1,
  }).slice(0, 200);

  const level2Network = buildNetworkRows({
    viewerUserId: profile.userId,
    events: level2Events,
    payouts,
    level: 2,
  }).slice(0, 200);

  return {
    profile: normalizedProfile,
    referralLink: buildReferralLink(normalizedProfile),
    events: level1Events,
    payouts,
    network: {
      level1: level1Network,
      level2: level2Network,
    },
    stats: {
      invited: normalizedProfile.invitedCount,
      converted: normalizedProfile.convertedCount,
      pending,
      level1Referrals: level1Events.length,
      level2Referrals: level2Events.length,
      totalCommissionSoles: normalizedProfile.totalCommissionSoles,
      level1CommissionSoles: normalizedProfile.level1CommissionSoles,
      level2CommissionSoles: normalizedProfile.level2CommissionSoles,
      level1CommissionPercent: commissionConfig.level1Percent,
      level2CommissionPercent: commissionConfig.level2Percent,
      maxCommissionPercent: commissionConfig.maxPercent,
    },
  };
}

export async function resolveReferralAlias(alias: string): Promise<{
  alias: string;
  userId: string;
  referralCode: string;
} | null> {
  const db = assertReferralsStorage();
  const normalizedAlias = normalizeReferralAlias(alias);
  if (!normalizedAlias) {
    return null;
  }

  const aliasSnapshot = await db.collection(REFERRAL_ALIASES_COLLECTION).doc(normalizedAlias).get();
  if (!aliasSnapshot.exists) {
    return null;
  }

  const payload = (aliasSnapshot.data() || {}) as Record<string, unknown>;
  if (payload.active === false) {
    return null;
  }
  const userId = sanitizeText(payload.userId, 120);
  if (!userId) {
    return null;
  }

  let referralCode = normalizeReferralCode(payload.referralCode);
  if (!referralCode) {
    const profileSnapshot = await db.collection(REFERRAL_PROFILES_COLLECTION).doc(userId).get();
    if (!profileSnapshot.exists) {
      return null;
    }
    const profilePayload = (profileSnapshot.data() || {}) as Record<string, unknown>;
    referralCode = normalizeReferralCode(profilePayload.referralCode);
    if (!referralCode) {
      return null;
    }
  }

  return {
    alias: normalizedAlias,
    userId,
    referralCode,
  };
}



