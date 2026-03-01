import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary, startProTrial } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";
import { canAccessFeature, getPlanLimits, type SubscriptionFeature } from "@/lib/permissions";

export const runtime = "nodejs";

const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";
const ALL_FEATURES: SubscriptionFeature[] = [
  "premiumThemes",
  "categoryThemes",
  "aiOptimization",
  "advancedMetrics",
  "basicMetrics",
  "removeBranding",
  "customDomain",
  "multiUser",
  "conversionOptimizationAdvanced",
  "ctaOptimization",
  "advancedColorCustomization",
  "supportPriority",
  "fullStore",
  "clonerAccess",
  "insightsAutomation",
  "whiteLabel",
];

function getBearerToken(request: NextRequest): string {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
}

function decodeUidFromTokenUnsafe(token: string): string {
  try {
    const segments = token.split(".");
    if (segments.length !== 3) return "";
    const payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf8")) as Record<string, unknown>;
    return String(payload.user_id || payload.uid || payload.sub || "").trim();
  } catch {
    return "";
  }
}

function resolveFirestoreProjectId(): string {
  return String(
    process.env.FIREBASE_PROJECT_ID ||
      process.env.GCLOUD_PROJECT ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      DEFAULT_FIREBASE_PROJECT_ID,
  ).trim();
}

function firestoreString(value: string) {
  return { stringValue: String(value || "") };
}

function firestoreBool(value: boolean) {
  return { booleanValue: value };
}

function firestoreInt(value: number) {
  const safe = Number.isFinite(value) ? Math.floor(value) : 0;
  return { integerValue: String(safe) };
}

function parseFirestoreBool(input: any): boolean {
  if (!input || typeof input !== "object") return false;
  if (typeof input.booleanValue === "boolean") return input.booleanValue;
  if (typeof input.stringValue === "string") return input.stringValue.toLowerCase() === "true";
  return false;
}

async function readFirestoreUserDocWithToken(userId: string, idToken: string) {
  const projectId = resolveFirestoreProjectId();
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/users/${encodeURIComponent(userId)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED: invalid bearer token");
  }
  if (response.status === 403) {
    throw new Error("FORBIDDEN: firestore rules denied read access (users)");
  }
  if (!response.ok) {
    throw new Error("SERVICE_UNAVAILABLE: firestore user read failed");
  }
  return response.json().catch(() => null);
}

async function patchFirestoreDocWithToken(input: {
  collection: "users" | "link_profiles";
  documentId: string;
  idToken: string;
  fields: Record<string, any>;
}) {
  const projectId = resolveFirestoreProjectId();
  const updateFields = Object.keys(input.fields);
  const params = new URLSearchParams();
  updateFields.forEach((field) => params.append("updateMask.fieldPaths", field));
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${input.collection}/${encodeURIComponent(input.documentId)}?${params.toString()}`;

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${input.idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: input.fields,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED: invalid bearer token");
    }
    if (response.status === 403) {
      throw new Error(`FORBIDDEN: firestore rules denied write access (${input.collection})`);
    }
    throw new Error(`SERVICE_UNAVAILABLE: firestore patch failed (${input.collection})`);
  }
}

async function startProTrialViaFirestoreToken(userId: string, idToken: string) {
  const existing = await readFirestoreUserDocWithToken(userId, idToken);
  const existingFields = (existing as any)?.fields || {};
  if (parseFirestoreBool(existingFields.proTrialUsed)) {
    throw new Error("PRO_TRIAL_ALREADY_USED");
  }

  const now = Date.now();
  const endDate = now + 7 * 24 * 60 * 60 * 1000;

  await patchFirestoreDocWithToken({
    collection: "users",
    documentId: userId,
    idToken,
    fields: {
      uid: firestoreString(userId),
      lastLogin: firestoreInt(now),
      plan: firestoreString("pro"),
      subscriptionPlan: firestoreString("PRO"),
      subscriptionStatus: firestoreString("ACTIVE"),
      subscriptionPaymentMethod: firestoreString("TRANSFERENCIA"),
      subscriptionStartAt: firestoreInt(now),
      subscriptionEndAt: firestoreInt(endDate),
      subscriptionCreatedAt: firestoreInt(now),
      subscriptionUpdatedAt: firestoreInt(now),
      proTrialUsed: firestoreBool(true),
      proTrialUsedAt: firestoreInt(now),
    },
  });

  await patchFirestoreDocWithToken({
    collection: "link_profiles",
    documentId: userId,
    idToken,
    fields: {
      userId: firestoreString(userId),
      subscriptionBlocked: firestoreBool(false),
      subscriptionPlan: firestoreString("PRO"),
      subscriptionStatus: firestoreString("ACTIVE"),
      subscriptionEndAt: firestoreInt(endDate),
      subscriptionUpdatedAt: firestoreInt(now),
    },
  }).catch(() => undefined);

  return { startMs: now, endMs: endDate };
}

function buildProFallbackSummary(userId: string, startMs: number, endMs: number) {
  const daysRemaining = Math.max(0, Math.ceil((endMs - Date.now()) / (24 * 60 * 60 * 1000)));
  const features = ALL_FEATURES.reduce<Record<SubscriptionFeature, boolean>>((acc, feature) => {
    acc[feature] = canAccessFeature("PRO", feature);
    return acc;
  }, {} as Record<SubscriptionFeature, boolean>);

  return {
    userId,
    plan: "PRO" as const,
    status: "ACTIVE" as const,
    startDate: new Date(startMs).toISOString(),
    endDate: new Date(endMs).toISOString(),
    expiringSoon: daysRemaining > 0 && daysRemaining <= 5,
    daysRemaining,
    isBusinessTrial: false,
    trialDaysRemaining: 0,
    trialDaysTotal: 0,
    trialExpired: false,
    limits: getPlanLimits("PRO"),
    usage: { publishedPages: 0 },
    features,
  };
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as { userIdHint?: string };
  const idToken = getBearerToken(request);
  let userId = "";
  let fallbackTrialWindow: { startMs: number; endMs: number } | null = null;

  try {
    try {
      userId = await requireFirebaseUserId(request);
    } catch (authError: unknown) {
      const message = String((authError as { message?: string })?.message || "");
      if (!message.startsWith("SERVICE_UNAVAILABLE")) {
        throw authError;
      }
      const fallbackUid = decodeUidFromTokenUnsafe(idToken);
      const userIdHint = String(payload?.userIdHint || "").trim();
      if (fallbackUid && (!userIdHint || userIdHint === fallbackUid)) {
        userId = fallbackUid;
      } else {
        throw authError;
      }
    }

    try {
      await startProTrial(userId);
    } catch (trialError: unknown) {
      const trialMessage = String((trialError as { message?: string })?.message || "");
      if (trialMessage.startsWith("PRO_TRIAL_ALREADY_USED")) {
        throw trialError;
      }
      if (trialMessage.startsWith("SERVICE_UNAVAILABLE") && idToken) {
        fallbackTrialWindow = await startProTrialViaFirestoreToken(userId, idToken);
      } else {
        throw trialError;
      }
    }

    let summary;
    try {
      summary = await buildSubscriptionSummary(userId);
    } catch (summaryError: unknown) {
      if (!fallbackTrialWindow) throw summaryError;
      summary = buildProFallbackSummary(userId, fallbackTrialWindow.startMs, fallbackTrialWindow.endMs);
    }

    return NextResponse.json({
      ok: true,
      summary,
      message: "Prueba PRO activada por 7 dias.",
    });
  } catch (error: unknown) {
    const message = String((error as { message?: string })?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json(
        { error: "No hay permisos para activar prueba PRO con la configuración actual." },
        { status: 403 },
      );
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json(
        { error: "Servicio temporalmente no disponible. Reintenta en unos segundos." },
        { status: 503 },
      );
    }
    if (message.startsWith("PRO_TRIAL_ALREADY_USED")) {
      return NextResponse.json(
        { error: "La prueba PRO ya fue usada en esta cuenta." },
        { status: 400 },
      );
    }
    if (message.startsWith("USER_ID_REQUIRED")) {
      return NextResponse.json({ error: "No se pudo identificar el usuario." }, { status: 400 });
    }

    console.error("[Subscription Pro Trial] Error:", error);
    return NextResponse.json(
      { error: "No se pudo activar la prueba PRO." },
      { status: 500 },
    );
  }
}
