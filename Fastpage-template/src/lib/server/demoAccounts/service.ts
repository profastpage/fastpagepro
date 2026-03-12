import { randomBytes } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { DEMO_SUBCOLLECTIONS, DemoTemplate, seedDemoTemplate } from "@/lib/server/demoAccounts/seeds";

export type DemoResetMode = "manual" | "on_login";

type DemoExpiryInput = string | number | null | undefined;

export interface DemoIndexRow {
  uid: string;
  email: string;
  template: DemoTemplate;
  demoGroupId: string;
  createdAt: number;
  expiresAt: number | null;
  resetMode: DemoResetMode;
  status: "active" | "deleted";
}

function assertAdminSdk() {
  if (!adminDb || !adminAuth) {
    throw new Error("SERVICE_UNAVAILABLE: firebase admin not configured");
  }
  return { db: adminDb, auth: adminAuth };
}

function toResetMode(input: unknown): DemoResetMode {
  return String(input || "").trim().toLowerCase() === "on_login" ? "on_login" : "manual";
}

function toTemplate(input: unknown): DemoTemplate {
  const normalized = String(input || "").trim().toLowerCase();
  if (normalized === "store") return "store";
  if (normalized === "services") return "services";
  return "restaurant";
}

function toTimestampOrNull(input: DemoExpiryInput): Timestamp | null {
  if (input === null) return null;
  if (typeof input === "undefined") return null;
  if (typeof input === "number" && Number.isFinite(input)) {
    return Timestamp.fromMillis(Math.max(0, Math.floor(input)));
  }
  if (typeof input === "string" && input.trim()) {
    const asNumber = Number(input);
    if (Number.isFinite(asNumber)) {
      return Timestamp.fromMillis(Math.max(0, Math.floor(asNumber)));
    }
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) {
      return Timestamp.fromDate(parsed);
    }
  }
  return null;
}

function toMillisOrNull(value: unknown): number | null {
  if (!value) return null;
  if (typeof value === "number" && Number.isFinite(value)) return Math.floor(value);
  if (typeof value === "string") {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return Math.floor(asNumber);
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
    return null;
  }
  if (typeof value === "object" && value && "toMillis" in (value as any)) {
    return Number((value as any).toMillis());
  }
  return null;
}

function buildDemoEmail(template: DemoTemplate) {
  const short = randomBytes(3).toString("hex");
  const timestamp = Date.now().toString().slice(-6);
  return `demo_${template}_${timestamp}${short}@fastpagepro.demo`;
}

function buildPassword() {
  return `${randomBytes(5).toString("base64url")}#${randomBytes(4).toString("hex")}!A1`;
}

function buildDemoGroupId(template: DemoTemplate) {
  return `demo_${template}_${Date.now()}_${randomBytes(3).toString("hex")}`;
}

async function deleteCollection(path: string, batchSize = 400) {
  const { db } = assertAdminSdk();
  const collectionRef = db.collection(path);

  while (true) {
    const snapshot = await collectionRef.limit(batchSize).get();
    if (snapshot.empty) break;

    for (const documentSnapshot of snapshot.docs) {
      const nestedCollections = await documentSnapshot.ref.listCollections();
      for (const nestedCollection of nestedCollections) {
        await deleteCollection(nestedCollection.path, batchSize);
      }
    }

    const batch = db.batch();
    snapshot.docs.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    await batch.commit();

    if (snapshot.size < batchSize) break;
  }
}

async function clearDemoGroupSubcollections(demoGroupId: string) {
  for (const subcollection of DEMO_SUBCOLLECTIONS) {
    await deleteCollection(`demoGroups/${demoGroupId}/${subcollection}`);
  }
}

async function resolveDemoByUidOrGroup(input: { uid?: string; demoGroupId?: string }) {
  const { db } = assertAdminSdk();
  const uid = String(input.uid || "").trim();
  const demoGroupId = String(input.demoGroupId || "").trim();

  if (uid) {
    const userDoc = await db.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      throw new Error("NOT_FOUND: demo user not found");
    }
    const userData = userDoc.data() || {};
    const resolvedGroupId = String(userData.demoGroupId || "").trim();
    if (!resolvedGroupId) {
      throw new Error("NOT_FOUND: demoGroupId not found");
    }
    return {
      uid,
      demoGroupId: resolvedGroupId,
      userData,
    };
  }

  if (demoGroupId) {
    const groupDoc = await db.doc(`demoGroups/${demoGroupId}`).get();
    if (!groupDoc.exists) {
      throw new Error("NOT_FOUND: demo group not found");
    }
    const groupData = groupDoc.data() || {};
    const ownerUid = String(groupData.ownerUid || "").trim();
    if (!ownerUid) {
      throw new Error("NOT_FOUND: owner uid not found");
    }
    const userDoc = await db.doc(`users/${ownerUid}`).get();
    if (!userDoc.exists) {
      throw new Error("NOT_FOUND: demo user not found");
    }
    return {
      uid: ownerUid,
      demoGroupId,
      userData: userDoc.data() || {},
    };
  }

  throw new Error("INVALID_ARGUMENT: uid or demoGroupId is required");
}

async function upsertDemoIndex(input: {
  uid: string;
  email: string;
  template: DemoTemplate;
  demoGroupId: string;
  resetMode: DemoResetMode;
  expiresAt: Timestamp | null;
  status: "active" | "deleted";
  createdAt?: Timestamp;
}) {
  const { db } = assertAdminSdk();
  const indexRef = db.doc(`admin/demoIndex/${input.uid}`);
  const createdAt = input.createdAt || Timestamp.now();

  await indexRef.set(
    {
      uid: input.uid,
      email: input.email,
      template: input.template,
      demoGroupId: input.demoGroupId,
      createdAt,
      expiresAt: input.expiresAt || null,
      resetMode: input.resetMode,
      status: input.status,
      updatedAt: Timestamp.now(),
    },
    { merge: true },
  );
}

export async function createDemoAccount(input: {
  template: DemoTemplate;
  resetMode?: DemoResetMode;
  expiresAt?: DemoExpiryInput;
}) {
  const { db, auth } = assertAdminSdk();
  const template = toTemplate(input.template);
  const resetMode = toResetMode(input.resetMode);
  const expiresAt = toTimestampOrNull(input.expiresAt);
  const email = buildDemoEmail(template);
  const password = buildPassword();
  const demoGroupId = buildDemoGroupId(template);
  const now = Timestamp.now();

  const createdUser = await auth.createUser({
    email,
    password,
    emailVerified: true,
    disabled: false,
    displayName: `Demo ${template}`,
  });

  const uid = createdUser.uid;

  await db.doc(`demoGroups/${demoGroupId}`).set({
    ownerUid: uid,
    template,
    createdAt: now,
    expiresAt: expiresAt || null,
    status: "active",
  });

  await db.doc(`users/${uid}`).set(
    {
      uid,
      email,
      name: `Demo ${template}`,
      role: "user",
      status: "active",
      isDemo: true,
      demoGroupId,
      demoTemplate: template,
      demoExpiresAt: expiresAt || null,
      resetMode,
      lastResetAt: null,
      onboardingDone: false,
      demoVersion: 1,
      createdAt: now.toMillis(),
      lastLogin: now.toMillis(),
    },
    { merge: true },
  );

  await seedDemoTemplate({ db, demoGroupId, template });

  await upsertDemoIndex({
    uid,
    email,
    template,
    demoGroupId,
    resetMode,
    expiresAt,
    status: "active",
    createdAt: now,
  });

  return {
    uid,
    email,
    password,
    demoGroupId,
    expiresAt: expiresAt ? expiresAt.toMillis() : null,
    resetMode,
    template,
  };
}

export async function resetDemoToFirstTime(input: {
  uid?: string;
  demoGroupId?: string;
  template?: DemoTemplate;
  resetMode?: DemoResetMode;
  expiresAt?: DemoExpiryInput;
}) {
  const { db } = assertAdminSdk();
  const resolved = await resolveDemoByUidOrGroup(input);
  const template = input.template
    ? toTemplate(input.template)
    : toTemplate(resolved.userData.demoTemplate || "restaurant");
  const resetMode = typeof input.resetMode === "undefined"
    ? toResetMode(resolved.userData.resetMode)
    : toResetMode(input.resetMode);
  const hasExpiryInput = Object.prototype.hasOwnProperty.call(input, "expiresAt");
  const expiresAt = hasExpiryInput
    ? toTimestampOrNull(input.expiresAt)
    : toTimestampOrNull(resolved.userData.demoExpiresAt);

  await clearDemoGroupSubcollections(resolved.demoGroupId);
  await seedDemoTemplate({ db, demoGroupId: resolved.demoGroupId, template });

  const userRef = db.doc(`users/${resolved.uid}`);
  const userDoc = await userRef.get();
  const currentVersion = Number(userDoc.data()?.demoVersion || 1) || 1;
  const nextVersion = currentVersion + 1;
  const now = Timestamp.now();

  const userPatch: Record<string, unknown> = {
    demoTemplate: template,
    resetMode,
    onboardingDone: false,
    lastResetAt: now,
    demoVersion: nextVersion,
  };
  const groupPatch: Record<string, unknown> = {
    template,
    status: "active",
    updatedAt: now,
  };

  if (hasExpiryInput) {
    userPatch.demoExpiresAt = expiresAt || null;
    groupPatch.expiresAt = expiresAt || null;
  }

  await userRef.set(userPatch, { merge: true });
  await db.doc(`demoGroups/${resolved.demoGroupId}`).set(groupPatch, { merge: true });

  await upsertDemoIndex({
    uid: resolved.uid,
    email: String(userDoc.data()?.email || ""),
    template,
    demoGroupId: resolved.demoGroupId,
    resetMode,
    expiresAt: expiresAt || null,
    status: "active",
    createdAt: Timestamp.now(),
  });

  return {
    ok: true,
    uid: resolved.uid,
    demoGroupId: resolved.demoGroupId,
    lastResetAt: now.toMillis(),
    demoVersion: nextVersion,
  };
}

export async function updateDemoSettings(input: {
  uid: string;
  template?: DemoTemplate;
  resetMode?: DemoResetMode;
  expiresAt?: DemoExpiryInput;
}) {
  const { db } = assertAdminSdk();
  const resolved = await resolveDemoByUidOrGroup({ uid: input.uid });
  const userDoc = await db.doc(`users/${resolved.uid}`).get();
  const currentData = userDoc.data() || {};
  const template = input.template ? toTemplate(input.template) : toTemplate(currentData.demoTemplate);
  const resetMode = typeof input.resetMode === "undefined"
    ? toResetMode(currentData.resetMode)
    : toResetMode(input.resetMode);
  const hasExpiryInput = Object.prototype.hasOwnProperty.call(input, "expiresAt");
  const expiresAt = hasExpiryInput
    ? toTimestampOrNull(input.expiresAt)
    : toTimestampOrNull(currentData.demoExpiresAt);

  const userPatch: Record<string, unknown> = {
    demoTemplate: template,
    resetMode,
  };
  const groupPatch: Record<string, unknown> = {
    template,
    updatedAt: Timestamp.now(),
  };
  if (hasExpiryInput) {
    userPatch.demoExpiresAt = expiresAt || null;
    groupPatch.expiresAt = expiresAt || null;
  }

  await db.doc(`users/${resolved.uid}`).set(userPatch, { merge: true });
  await db.doc(`demoGroups/${resolved.demoGroupId}`).set(groupPatch, { merge: true });

  await upsertDemoIndex({
    uid: resolved.uid,
    email: String(currentData.email || ""),
    template,
    demoGroupId: resolved.demoGroupId,
    resetMode,
    expiresAt: expiresAt || null,
    status: "active",
    createdAt: Timestamp.now(),
  });

  return { ok: true };
}

async function deleteDemoAccountInternal(uid: string) {
  const { db, auth } = assertAdminSdk();
  const resolved = await resolveDemoByUidOrGroup({ uid });
  const userDoc = await db.doc(`users/${resolved.uid}`).get();
  const userData = userDoc.data() || {};
  const template = toTemplate(userData.demoTemplate || "restaurant");
  const resetMode = toResetMode(userData.resetMode || "manual");
  const expiresAt = toTimestampOrNull(userData.demoExpiresAt);

  await clearDemoGroupSubcollections(resolved.demoGroupId);
  await db.doc(`demoGroups/${resolved.demoGroupId}`).set(
    {
      status: "deleted",
      deletedAt: Timestamp.now(),
      template,
      expiresAt: expiresAt || null,
      ownerUid: resolved.uid,
    },
    { merge: true },
  );

  await upsertDemoIndex({
    uid: resolved.uid,
    email: String(userData.email || ""),
    template,
    demoGroupId: resolved.demoGroupId,
    resetMode,
    expiresAt: expiresAt || null,
    status: "deleted",
    createdAt: Timestamp.now(),
  });

  await db.doc(`users/${resolved.uid}`).set(
    {
      status: "deleted",
      isDemo: true,
      demoGroupId: resolved.demoGroupId,
      demoDeletedAt: Timestamp.now(),
    },
    { merge: true },
  );

  await auth.deleteUser(resolved.uid).catch((error: any) => {
    const message = String(error?.message || "");
    if (message.toLowerCase().includes("no user record")) return;
    throw error;
  });

  return { ok: true, uid: resolved.uid, demoGroupId: resolved.demoGroupId };
}

export async function deleteDemoAccount(input: { uid: string }) {
  return deleteDemoAccountInternal(String(input.uid || "").trim());
}

export async function resetOwnDemoOnLogin(uid: string) {
  const { db } = assertAdminSdk();
  const userDoc = await db.doc(`users/${uid}`).get();
  if (!userDoc.exists) {
    throw new Error("NOT_FOUND: user not found");
  }
  const userData = userDoc.data() || {};
  if (userData.isDemo !== true) {
    throw new Error("FORBIDDEN: demo only");
  }
  if (toResetMode(userData.resetMode) !== "on_login") {
    return { ok: true, skipped: true, reason: "reset_mode_manual" };
  }

  const lastResetMs = toMillisOrNull(userData.lastResetAt) || 0;
  if (Date.now() - lastResetMs < 10 * 60 * 1000) {
    return { ok: true, skipped: true, reason: "throttled" };
  }

  return resetDemoToFirstTime({ uid });
}

export async function listDemoAccounts() {
  const { db } = assertAdminSdk();
  const snapshot = await db.collection("admin/demoIndex").orderBy("updatedAt", "desc").get();

  return snapshot.docs.map((documentSnapshot) => {
    const payload = documentSnapshot.data() || {};
    return {
      uid: String(payload.uid || documentSnapshot.id),
      email: String(payload.email || ""),
      template: toTemplate(payload.template),
      demoGroupId: String(payload.demoGroupId || ""),
      createdAt: toMillisOrNull(payload.createdAt) || 0,
      expiresAt: toMillisOrNull(payload.expiresAt),
      resetMode: toResetMode(payload.resetMode),
      status: String(payload.status || "active") === "deleted" ? "deleted" : "active",
    } as DemoIndexRow;
  });
}

export async function deleteExpiredDemos() {
  const { db } = assertAdminSdk();
  const now = Timestamp.now();
  const snapshot = await db
    .collection("demoGroups")
    .where("status", "==", "active")
    .where("expiresAt", "<=", now)
    .get();

  const deleted: string[] = [];
  for (const documentSnapshot of snapshot.docs) {
    const ownerUid = String(documentSnapshot.data()?.ownerUid || "").trim();
    if (!ownerUid) continue;
    await deleteDemoAccountInternal(ownerUid);
    deleted.push(ownerUid);
  }

  return {
    ok: true,
    deletedCount: deleted.length,
    deletedUids: deleted,
  };
}

export { deleteCollection };
