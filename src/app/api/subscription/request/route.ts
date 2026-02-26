import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, PlanType } from "@prisma/client";
import { createSubscriptionRequest, startBusinessTrial } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";

const SUPPORTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
]);
const MAX_PROOF_BYTES = 2 * 1024 * 1024;
const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";

function getBearerToken(request: NextRequest): string {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
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
  if (typeof input.stringValue === "string") {
    return input.stringValue.toLowerCase() === "true";
  }
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
    throw new Error(`SERVICE_UNAVAILABLE: firestore patch failed (${input.collection})`);
  }
}

async function startBusinessTrialViaFirestoreToken(userId: string, idToken: string) {
  const existing = await readFirestoreUserDocWithToken(userId, idToken);
  const existingFields = (existing as any)?.fields || {};
  const trialUsed = parseFirestoreBool(existingFields.businessTrialUsed);
  if (trialUsed) {
    throw new Error("BUSINESS_TRIAL_ALREADY_USED");
  }

  const now = Date.now();
  const endDate = now + 14 * 24 * 60 * 60 * 1000;
  const userFields = {
    plan: firestoreString("business"),
    subscriptionPlan: firestoreString("BUSINESS"),
    subscriptionStatus: firestoreString("ACTIVE"),
    subscriptionPaymentMethod: firestoreString("TRANSFERENCIA"),
    subscriptionStartAt: firestoreInt(now),
    subscriptionEndAt: firestoreInt(endDate),
    subscriptionCreatedAt: firestoreInt(now),
    subscriptionUpdatedAt: firestoreInt(now),
    businessTrialUsed: firestoreBool(true),
    businessTrialUsedAt: firestoreInt(now),
  };

  await patchFirestoreDocWithToken({
    collection: "users",
    documentId: userId,
    idToken,
    fields: userFields,
  });

  await patchFirestoreDocWithToken({
    collection: "link_profiles",
    documentId: userId,
    idToken,
    fields: {
      subscriptionBlocked: firestoreBool(false),
      subscriptionPlan: firestoreString("BUSINESS"),
      subscriptionStatus: firestoreString("ACTIVE"),
      subscriptionEndAt: firestoreInt(endDate),
      subscriptionUpdatedAt: firestoreInt(now),
    },
  }).catch(() => undefined);

  return {
    id: `firestore-rest-${userId}-${now}`,
    plan: "BUSINESS" as const,
    status: "ACTIVE" as const,
    startDate: new Date(now),
    endDate: new Date(endDate),
  };
}

function toPlanType(value: string): PlanType | null {
  const normalized = value.toUpperCase().trim();
  if (normalized === "FREE" || normalized === "BUSINESS" || normalized === "PRO") return normalized;
  return null;
}

function toPaymentMethod(value: string): PaymentMethod | null {
  const normalized = value.toUpperCase().trim();
  if (normalized === "YAPE" || normalized === "PLIN" || normalized === "TRANSFERENCIA") return normalized;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);
    const formData = await request.formData();
    const plan = toPlanType(String(formData.get("plan") || ""));
    const paymentMethod = toPaymentMethod(String(formData.get("paymentMethod") || ""));
    const trialRaw = String(formData.get("trial") || "").trim().toLowerCase();
    const isBusinessTrial = plan === "BUSINESS" && (trialRaw === "true" || trialRaw === "1" || trialRaw === "yes");
    const notes = String(formData.get("notes") || "");
    const proof = formData.get("proof");

    if (!plan) {
      return NextResponse.json({ error: "Debes seleccionar un plan valido." }, { status: 400 });
    }

    if (isBusinessTrial) {
      let trialSubscription;
      try {
        trialSubscription = await startBusinessTrial(userId);
      } catch (trialError: any) {
        const trialMessage = String(trialError?.message || "");
        if (!trialMessage.includes("subscription storage unavailable")) {
          throw trialError;
        }

        const idToken = getBearerToken(request);
        if (!idToken) {
          throw trialError;
        }

        trialSubscription = await startBusinessTrialViaFirestoreToken(userId, idToken);
      }
      return NextResponse.json({
        success: true,
        message: "Prueba Business activada por 14 dias.",
        subscription: {
          id: trialSubscription.id,
          plan: trialSubscription.plan,
          status: trialSubscription.status,
          startDate: trialSubscription.startDate.toISOString(),
          endDate: trialSubscription.endDate.toISOString(),
        },
      });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Metodo de pago invalido." }, { status: 400 });
    }

    let proofBase64 = "";
    let proofFileName = "";
    let proofMimeType = "";

    if (proof && proof instanceof File) {
      if (proof.size > MAX_PROOF_BYTES) {
        return NextResponse.json({ error: "El comprobante excede 2MB." }, { status: 400 });
      }
      if (!SUPPORTED_MIME_TYPES.has(proof.type)) {
        return NextResponse.json(
          { error: "Formato no soportado. Usa PNG, JPG, WEBP o PDF." },
          { status: 400 },
        );
      }

      const bytes = await proof.arrayBuffer();
      proofBase64 = Buffer.from(bytes).toString("base64");
      proofFileName = proof.name;
      proofMimeType = proof.type;
    }

    const created = await createSubscriptionRequest({
      userId,
      requestedPlan: plan,
      paymentMethod,
      notes,
      proofBase64: proofBase64 || undefined,
      proofFileName: proofFileName || undefined,
      proofMimeType: proofMimeType || undefined,
    });

    return NextResponse.json({
      success: true,
      requestId: created.request.id,
      message: "Solicitud registrada. Estado pendiente hasta validacion admin.",
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("BUSINESS_TRIAL_ALREADY_USED")) {
      return NextResponse.json(
        { error: "La prueba de 14 dias de Business ya fue usada en esta cuenta." },
        { status: 400 },
      );
    }
    if (message.includes("subscription storage unavailable")) {
      return NextResponse.json(
        { error: "Servicio de suscripcion temporalmente no disponible. Intenta nuevamente en unos minutos." },
        { status: 503 },
      );
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    console.error("[Subscription Request] Error:", error);
    return NextResponse.json({ error: "No se pudo registrar la solicitud de suscripcion" }, { status: 500 });
  }
}
