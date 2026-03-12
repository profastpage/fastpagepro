type PlanTypeLike = "FREE" | "BUSINESS" | "PRO" | "AGENCY";
type SubscriptionStatusLike = "ACTIVE" | "EXPIRED" | "PENDING";

export const SUBSCRIPTION_SESSION_COOKIE = "fp_sub_session";

export interface SubscriptionSessionPayload {
  userId: string;
  plan: PlanTypeLike;
  status: SubscriptionStatusLike;
  endDate: string;
  iat: number;
  exp: number;
}

function encodeBase64Url(input: Uint8Array): string {
  let raw = "";
  for (let i = 0; i < input.length; i += 1) {
    raw += String.fromCharCode(input[i]);
  }
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sign(content: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(content));
  return encodeBase64Url(new Uint8Array(signature));
}

export async function createSubscriptionSessionToken(
  payload: SubscriptionSessionPayload,
  secret: string,
): Promise<string> {
  const json = JSON.stringify(payload);
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(json));
  const signature = await sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySubscriptionSessionToken(
  token: string,
  secret: string,
): Promise<SubscriptionSessionPayload | null> {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = await sign(encodedPayload, secret);
  if (expected !== signature) return null;

  try {
    const payloadRaw = new TextDecoder().decode(decodeBase64Url(encodedPayload));
    const payload = JSON.parse(payloadRaw) as SubscriptionSessionPayload;
    if (!payload?.userId || !payload?.plan || !payload?.status) return null;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
