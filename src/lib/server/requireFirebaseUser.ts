import { NextRequest } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebaseAdmin";

const DEFAULT_FIREBASE_WEB_API_KEY = "AIzaSyAkb9GtjFXt2NPjuM_-M41Srd6aUK7Ch2Y";
const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";

type IdentityToolkitUser = {
  localId?: string;
  email?: string;
  emailVerified?: boolean;
  validSince?: string;
  providerUserInfo?: Array<{ providerId?: string }>;
};

function getBearerToken(request: NextRequest): string {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
}

function mapAdminAuthError(error: any): Error {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  if (
    code.includes("id-token-expired") ||
    code.includes("id-token-revoked") ||
    code.includes("invalid-id-token") ||
    message.includes("id token has expired") ||
    message.includes("id token has been revoked") ||
    message.includes("decoding firebase id token")
  ) {
    return new Error("UNAUTHORIZED: invalid bearer token");
  }

  return new Error("SERVICE_UNAVAILABLE: firebase admin verification failed");
}

function resolveFirebaseWebApiKey(): string {
  return String(
    process.env.FIREBASE_WEB_API_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      DEFAULT_FIREBASE_WEB_API_KEY,
  ).trim();
}

function resolveFirebaseProjectId(): string {
  return String(
    process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      DEFAULT_FIREBASE_PROJECT_ID,
  ).trim();
}

async function verifyViaIdentityToolkit(token: string): Promise<DecodedIdToken> {
  const webApiKey = resolveFirebaseWebApiKey();
  if (!webApiKey) {
    throw new Error("SERVICE_UNAVAILABLE: missing FIREBASE_WEB_API_KEY");
  }

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(webApiKey)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      users?: IdentityToolkitUser[];
      error?: { message?: string } | string;
    };

    if (!response.ok) {
      const rawError =
        typeof payload?.error === "string"
          ? payload.error
          : String(payload?.error?.message || "IDENTITY_TOOLKIT_REQUEST_FAILED");
      const normalized = rawError.toUpperCase();

      if (
        normalized.includes("INVALID_ID_TOKEN") ||
        normalized.includes("TOKEN_EXPIRED") ||
        normalized.includes("USER_DISABLED")
      ) {
        throw new Error("UNAUTHORIZED: invalid bearer token");
      }

      throw new Error(`SERVICE_UNAVAILABLE: ${normalized}`);
    }

    const user = Array.isArray(payload?.users) ? payload.users[0] : null;
    const uid = String(user?.localId || "").trim();
    if (!uid) {
      throw new Error("UNAUTHORIZED: invalid token payload");
    }

    const now = Math.floor(Date.now() / 1000);
    const projectId = resolveFirebaseProjectId();
    const authTime = Number(user?.validSince || now);
    const providerId = String(user?.providerUserInfo?.[0]?.providerId || "custom");

    const decoded = {
      uid,
      sub: uid,
      user_id: uid,
      email: user?.email || undefined,
      email_verified: Boolean(user?.emailVerified),
      auth_time: Number.isFinite(authTime) ? authTime : now,
      iat: now,
      exp: now + 3600,
      aud: projectId || "fastpage",
      iss: projectId ? `https://securetoken.google.com/${projectId}` : "https://securetoken.google.com/fastpage",
      firebase: {
        sign_in_provider: providerId.replace(".com", ""),
      } as any,
    } as unknown as DecodedIdToken;

    return decoded;
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      throw error;
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      throw error;
    }
    throw new Error("SERVICE_UNAVAILABLE: firebase identity toolkit lookup failed");
  } finally {
    clearTimeout(timeout);
  }
}

export async function requireFirebaseUser(request: NextRequest): Promise<DecodedIdToken> {
  const token = getBearerToken(request);
  if (!token) {
    throw new Error("UNAUTHORIZED: missing bearer token");
  }

  if (adminAuth) {
    try {
      return await adminAuth.verifyIdToken(token);
    } catch (error) {
      const mapped = mapAdminAuthError(error);
      if (mapped.message.startsWith("UNAUTHORIZED")) {
        throw mapped;
      }
      // Fallback path: if Admin SDK cannot validate (credentials/runtime), use Identity Toolkit.
      return verifyViaIdentityToolkit(token);
    }
  }

  return verifyViaIdentityToolkit(token);
}

export async function requireFirebaseUserId(request: NextRequest): Promise<string> {
  const decoded = await requireFirebaseUser(request);
  const userId = String(decoded?.uid || "").trim();
  if (!userId) {
    throw new Error("UNAUTHORIZED: invalid token payload");
  }
  return userId;
}
