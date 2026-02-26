import { NextRequest } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { createVerify } from "crypto";
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

const SECURE_TOKEN_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let secureTokenCertCache: {
  expiresAtMs: number;
  certs: Record<string, string>;
} | null = null;

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

function decodeBase64UrlToBuffer(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64");
}

function parseCacheMaxAgeSeconds(cacheControl: string): number {
  const match = String(cacheControl || "")
    .split(",")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("max-age="));
  if (!match) return 300;
  const value = Number(match.replace("max-age=", "").trim());
  return Number.isFinite(value) && value > 0 ? value : 300;
}

async function getSecureTokenCertificates(): Promise<Record<string, string>> {
  const now = Date.now();
  if (secureTokenCertCache && secureTokenCertCache.expiresAtMs > now) {
    return secureTokenCertCache.certs;
  }

  const response = await fetch(SECURE_TOKEN_CERTS_URL, { cache: "no-store" });
  const certs = (await response.json().catch(() => ({}))) as Record<string, string>;

  if (!response.ok || !certs || typeof certs !== "object" || Object.keys(certs).length === 0) {
    throw new Error("SERVICE_UNAVAILABLE: secure token certificates unavailable");
  }

  const maxAgeSeconds = parseCacheMaxAgeSeconds(response.headers.get("cache-control") || "");
  secureTokenCertCache = {
    certs,
    expiresAtMs: now + maxAgeSeconds * 1000,
  };
  return certs;
}

async function verifyViaSecureTokenCertificates(token: string): Promise<DecodedIdToken> {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = segments;
  const header = JSON.parse(decodeBase64UrlToBuffer(encodedHeader).toString("utf8")) as {
    alg?: string;
    kid?: string;
  };
  const payload = JSON.parse(decodeBase64UrlToBuffer(encodedPayload).toString("utf8")) as Record<
    string,
    unknown
  >;

  if (header?.alg !== "RS256" || !header?.kid) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }

  const certs = await getSecureTokenCertificates();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error("UNAUTHORIZED: unknown token key id");
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  const isValidSignature = verifier.verify(cert, decodeBase64UrlToBuffer(encodedSignature));
  if (!isValidSignature) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }

  const projectId = resolveFirebaseProjectId();
  const nowSec = Math.floor(Date.now() / 1000);
  const issuer = `https://securetoken.google.com/${projectId}`;
  const exp = Number(payload.exp || 0);
  const iat = Number(payload.iat || 0);
  const aud = String(payload.aud || "");
  const iss = String(payload.iss || "");
  const sub = String(payload.sub || "");
  const uid = String(payload.user_id || sub || "").trim();

  if (!uid || !sub || aud !== projectId || iss !== issuer) {
    throw new Error("UNAUTHORIZED: invalid token claims");
  }
  if (!Number.isFinite(exp) || exp <= nowSec) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }
  if (!Number.isFinite(iat) || iat > nowSec + 300) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }

  return {
    ...(payload as unknown as DecodedIdToken),
    uid,
  };
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
      try {
        return await verifyViaSecureTokenCertificates(token);
      } catch (secureTokenError: any) {
        const message = String(secureTokenError?.message || "");
        if (message.startsWith("UNAUTHORIZED")) {
          throw secureTokenError;
        }
      }
      // Last fallback path: Identity Toolkit.
      return verifyViaIdentityToolkit(token);
    }
  }

  try {
    return await verifyViaSecureTokenCertificates(token);
  } catch (secureTokenError: any) {
    const message = String(secureTokenError?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      throw secureTokenError;
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
