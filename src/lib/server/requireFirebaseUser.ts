import { NextRequest } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function requireFirebaseUser(request: NextRequest): Promise<DecodedIdToken> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    throw new Error("UNAUTHORIZED: missing bearer token");
  }

  if (!adminAuth) {
    throw new Error("SERVICE_UNAVAILABLE: firebase admin is not configured");
  }

  return adminAuth.verifyIdToken(token);
}

export async function requireFirebaseUserId(request: NextRequest): Promise<string> {
  const decoded = await requireFirebaseUser(request);
  const userId = String(decoded?.uid || "").trim();
  if (!userId) {
    throw new Error("UNAUTHORIZED: invalid token payload");
  }
  return userId;
}
