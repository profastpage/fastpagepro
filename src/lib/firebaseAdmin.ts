import * as admin from "firebase-admin";

let isInitialized = false;
let initWarningShown = false;

type ServiceAccountLike = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function normalizeSecret(raw: string): string {
  const trimmed = String(raw || "").trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  return unquoted.replace(/\\n/g, "\n").trim();
}

function toAdminServiceAccount(input: Partial<ServiceAccountLike> | null | undefined): admin.ServiceAccount | null {
  const projectId = String(input?.project_id || "").trim();
  const clientEmail = String(input?.client_email || "").trim();
  const privateKey = normalizeSecret(String(input?.private_key || ""));
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
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccountLike>;
    return toAdminServiceAccount(parsed);
  } catch {
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8");
      const parsed = JSON.parse(decoded) as Partial<ServiceAccountLike>;
      return toAdminServiceAccount(parsed);
    } catch {
      return null;
    }
  }
}

function buildServiceAccountFromEnv(): admin.ServiceAccount | null {
  const serviceAccountKey = normalizeSecret(
    String(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY ||
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
        "",
    ),
  );
  if (serviceAccountKey) {
    return parseServiceAccount(serviceAccountKey);
  }

  const projectId = normalizeSecret(
    String(
      process.env.FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_ADMIN_PROJECT_ID ||
        process.env.GCLOUD_PROJECT ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        "",
    ),
  );
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

    if (!serviceAccount) {
      if (!initWarningShown) {
        console.warn("[FirebaseAdmin] No Firebase Admin credentials found. Admin SDK disabled.");
        initWarningShown = true;
      }
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
