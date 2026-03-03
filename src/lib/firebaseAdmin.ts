import * as admin from "firebase-admin";

let isInitialized = false;
let initWarningShown = false;
const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";

type ServiceAccountLike = {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
};

function resolveFirebaseProjectId(): string {
  return normalizeSecret(
    String(
      process.env.FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_ADMIN_PROJECT_ID ||
        process.env.GCLOUD_PROJECT ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        DEFAULT_FIREBASE_PROJECT_ID,
    ),
  );
}

function resolveFirebaseStorageBucket(projectId: string): string {
  const fromEnv = normalizeSecret(
    String(
      process.env.FIREBASE_STORAGE_BUCKET ||
        process.env.FIREBASE_ADMIN_STORAGE_BUCKET ||
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        "",
    ),
  );
  if (fromEnv) return fromEnv;
  return projectId ? `${projectId}.firebasestorage.app` : "";
}

function unwrapQuoted(raw: string): string {
  const trimmed = String(raw || "").trim();
  return (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed
  );
}

function normalizeSecret(raw: string): string {
  return unwrapQuoted(raw).replace(/\\n/g, "\n").trim();
}

function normalizeServiceAccountJson(raw: string): string {
  const unquoted = unwrapQuoted(raw);
  if (!unquoted) return "";
  if (unquoted.startsWith("{")) return unquoted;

  try {
    const parsed = JSON.parse(unquoted);
    if (typeof parsed === "string") return String(parsed).trim();
  } catch {
    // Ignore and continue.
  }

  return unquoted;
}

function toAdminServiceAccount(input: Partial<ServiceAccountLike> | null | undefined): admin.ServiceAccount | null {
  const projectId = String(input?.project_id || input?.projectId || resolveFirebaseProjectId()).trim();
  const clientEmail = String(input?.client_email || input?.clientEmail || "").trim();
  const privateKey = normalizeSecret(String(input?.private_key || input?.privateKey || ""));

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function parseServiceAccount(raw: string): admin.ServiceAccount | null {
  const normalized = normalizeServiceAccountJson(raw);
  if (!normalized) return null;

  try {
    const parsed = JSON.parse(normalized) as Partial<ServiceAccountLike>;
    return toAdminServiceAccount(parsed);
  } catch {
    // Ignore and continue with base64 fallback.
  }

  try {
    const decoded = Buffer.from(normalized, "base64").toString("utf8").trim();
    const parsed = JSON.parse(decoded) as Partial<ServiceAccountLike>;
    return toAdminServiceAccount(parsed);
  } catch {
    return null;
  }
}

function buildServiceAccountFromEnv(): admin.ServiceAccount | null {
  const serviceAccountKey = String(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY ||
      process.env.FIREBASE_SERVICE_ACCOUNT ||
      process.env.FIREBASE_ADMIN_CREDENTIALS ||
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
      "",
  ).trim();

  if (serviceAccountKey) {
    return parseServiceAccount(serviceAccountKey);
  }

  const projectId = resolveFirebaseProjectId();
  const clientEmail = normalizeSecret(
    String(
      process.env.FIREBASE_CLIENT_EMAIL ||
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        process.env.GOOGLE_CLIENT_EMAIL ||
        "",
    ),
  );
  const privateKey = normalizeSecret(
    String(
      process.env.FIREBASE_PRIVATE_KEY ||
        process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
        process.env.GOOGLE_PRIVATE_KEY ||
        "",
    ),
  );

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

if (!admin.apps.length) {
  try {
    const serviceAccount = buildServiceAccountFromEnv();
    const projectId = resolveFirebaseProjectId();
    const storageBucket = resolveFirebaseStorageBucket(projectId);

    if (!serviceAccount) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId,
          ...(storageBucket ? { storageBucket } : {}),
        });
        isInitialized = true;
        console.log("[FirebaseAdmin] Initialized with application default credentials");
      } catch {
        if (!initWarningShown) {
          console.warn("[FirebaseAdmin] No Firebase Admin credentials found. Admin SDK disabled.");
          initWarningShown = true;
        }
      }
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId || projectId,
        ...(storageBucket ? { storageBucket } : {}),
      });
      isInitialized = true;
      console.log("[FirebaseAdmin] Initialized");
    }
  } catch (error) {
    console.error("[FirebaseAdmin] Initialization error:", error);
  }
} else {
  isInitialized = true;
}

export const adminDb = isInitialized ? admin.firestore() : null;
export const adminAuth = isInitialized ? admin.auth() : null;
export const adminStorage = isInitialized ? admin.storage() : null;
