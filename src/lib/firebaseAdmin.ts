import * as admin from "firebase-admin";

let isInitialized = false;
let initWarningShown = false;

type ServiceAccountLike = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function toAdminServiceAccount(input: Partial<ServiceAccountLike> | null | undefined): admin.ServiceAccount | null {
  const projectId = String(input?.project_id || "").trim();
  const clientEmail = String(input?.client_email || "").trim();
  const privateKey = String(input?.private_key || "").trim();
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
  const serviceAccountKey = String(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "").trim();
  if (serviceAccountKey) {
    return parseServiceAccount(serviceAccountKey);
  }

  const projectId = String(
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  ).trim();
  const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || "").trim();
  const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || "")
    .replace(/\\n/g, "\n")
    .trim();

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
