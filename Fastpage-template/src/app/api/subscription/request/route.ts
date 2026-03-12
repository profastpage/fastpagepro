import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, PlanType } from "@prisma/client";
import { createSubscriptionRequest } from "@/lib/subscription/service";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { calculateSubscriptionAmountSoles, type PlanType as BillingPlanType } from "@/lib/subscription/plans";

const SUPPORTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
]);
const MAX_PROOF_BYTES = 2 * 1024 * 1024;
const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";
type BillingCycle = "MONTHLY" | "ANNUAL";

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

function buildUserIdentityFields(userId: string, email: string) {
  const now = Date.now();
  const safeEmail = sanitizeText(email, 160);
  return {
    uid: firestoreString(userId),
    lastLogin: firestoreInt(now),
    subscriptionUpdatedAt: firestoreInt(now),
    ...(safeEmail ? { email: firestoreString(safeEmail) } : {}),
  };
}

function sanitizeText(value: unknown, maxLen = 500): string {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function buildNotificationDocumentId(userId: string, requestType: string, createdAtMs: number): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${sanitizeText(userId, 120)}-${sanitizeText(requestType, 24).toLowerCase()}-${createdAtMs}-${randomPart}`;
}

async function patchFirestoreDocWithToken(input: {
  collection: "users" | "link_profiles" | "subscription_notifications";
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

async function writeSubscriptionAdminNotificationViaFirestoreToken(input: {
  idToken: string;
  userId: string;
  email: string;
  requestedPlan: PlanType;
  requestType: "PAYMENT" | "FREE";
  requestStatus: "PENDING" | "RECEIVED";
  paymentMethod: PaymentMethod | "";
  notes: string;
  requestId?: string;
  trialDays?: number;
  billingCycle?: BillingCycle;
  durationMonths?: number;
  durationDays?: number;
  discountPercent?: number;
  amountSoles?: number;
  createdAtMs?: number;
}) {
  const createdAtMs =
    Number.isFinite(Number(input.createdAtMs)) && Number(input.createdAtMs) > 0
      ? Math.floor(Number(input.createdAtMs))
      : Date.now();
  const requestId = sanitizeText(input.requestId, 140) || `req-${input.userId}-${createdAtMs}`;
  const notificationId = buildNotificationDocumentId(input.userId, input.requestType, createdAtMs);
  const email = sanitizeText(input.email, 160);
  const notes = sanitizeText(input.notes, 900);

  await patchFirestoreDocWithToken({
    collection: "users",
    documentId: input.userId,
    idToken: input.idToken,
    fields: {
      ...buildUserIdentityFields(input.userId, email),
      latestSubscriptionRequestId: firestoreString(requestId),
      latestSubscriptionNotificationId: firestoreString(notificationId),
      latestSubscriptionRequestEmail: firestoreString(email),
      latestSubscriptionRequestPlan: firestoreString(input.requestedPlan),
      latestSubscriptionRequestType: firestoreString(input.requestType),
      latestSubscriptionRequestStatus: firestoreString(input.requestStatus),
      latestSubscriptionRequestPaymentMethod: firestoreString(input.paymentMethod || "TRANSFERENCIA"),
      latestSubscriptionRequestNotes: firestoreString(notes),
      latestSubscriptionRequestSource: firestoreString("billing"),
      latestSubscriptionRequestTrialDays: firestoreInt(
        Number.isFinite(Number(input.trialDays)) ? Number(input.trialDays) : 0,
      ),
      latestSubscriptionRequestBillingCycle: firestoreString(input.billingCycle || "MONTHLY"),
      latestSubscriptionRequestDurationMonths: firestoreInt(
        Number.isFinite(Number(input.durationMonths)) ? Number(input.durationMonths) : 1,
      ),
      latestSubscriptionRequestDurationDays: firestoreInt(
        Number.isFinite(Number(input.durationDays)) ? Number(input.durationDays) : 30,
      ),
      latestSubscriptionRequestDiscountPercent: firestoreInt(
        Number.isFinite(Number(input.discountPercent)) ? Number(input.discountPercent) : 0,
      ),
      latestSubscriptionRequestAmountSoles: firestoreString(
        Number.isFinite(Number(input.amountSoles)) ? Number(input.amountSoles).toFixed(2) : "0.00",
      ),
      latestSubscriptionRequestCreatedAt: firestoreInt(createdAtMs),
      latestSubscriptionRequestUpdatedAt: firestoreInt(Date.now()),
      latestSubscriptionRequestUnreadForAdmin: firestoreBool(true),
    },
  });

  await patchFirestoreDocWithToken({
    collection: "subscription_notifications",
    documentId: notificationId,
    idToken: input.idToken,
    fields: {
      notificationId: firestoreString(notificationId),
      requestId: firestoreString(requestId),
      userId: firestoreString(input.userId),
      email: firestoreString(email),
      requestedPlan: firestoreString(input.requestedPlan),
      requestType: firestoreString(input.requestType),
      requestStatus: firestoreString(input.requestStatus),
      paymentMethod: firestoreString(input.paymentMethod || "TRANSFERENCIA"),
      notes: firestoreString(notes),
      source: firestoreString("billing"),
      trialDays: firestoreInt(Number.isFinite(Number(input.trialDays)) ? Number(input.trialDays) : 0),
      billingCycle: firestoreString(input.billingCycle || "MONTHLY"),
      durationMonths: firestoreInt(
        Number.isFinite(Number(input.durationMonths)) ? Number(input.durationMonths) : 1,
      ),
      durationDays: firestoreInt(
        Number.isFinite(Number(input.durationDays)) ? Number(input.durationDays) : 30,
      ),
      discountPercent: firestoreInt(
        Number.isFinite(Number(input.discountPercent)) ? Number(input.discountPercent) : 0,
      ),
      amountSoles: firestoreString(
        Number.isFinite(Number(input.amountSoles)) ? Number(input.amountSoles).toFixed(2) : "0.00",
      ),
      unreadForAdmin: firestoreBool(true),
      createdAt: firestoreInt(createdAtMs),
      updatedAt: firestoreInt(Date.now()),
    },
  }).catch((error) => {
    console.error("[Subscription Request] notification event sync warning:", error);
  });

  return {
    requestId,
    notificationId,
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

function toBillingCycle(value: string): BillingCycle {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized === "ANNUAL" ? "ANNUAL" : "MONTHLY";
}

function toDurationMonths(value: string, billingCycle: BillingCycle): number {
  if (billingCycle === "ANNUAL") return 12;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(12, Math.floor(parsed)));
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireFirebaseUser(request);
    const userId = String(authUser?.uid || "").trim();
    if (!userId) {
      throw new Error("UNAUTHORIZED: invalid token payload");
    }
    const userEmail = sanitizeText(authUser?.email, 160);
    const idToken = getBearerToken(request);
    const formData = await request.formData();
    const plan = toPlanType(String(formData.get("plan") || ""));
    const paymentMethod = toPaymentMethod(String(formData.get("paymentMethod") || ""));
    const notes = String(formData.get("notes") || "");
    const billingCycle = toBillingCycle(String(formData.get("billingCycle") || ""));
    const durationMonths = toDurationMonths(String(formData.get("durationMonths") || ""), billingCycle);
    const durationDays = durationMonths * 30;
    const proof = formData.get("proof");

    if (!plan) {
      return NextResponse.json({ error: "Debes seleccionar un plan valido." }, { status: 400 });
    }

    const pricing = calculateSubscriptionAmountSoles({
      plan: plan as BillingPlanType,
      months: durationMonths,
      annualBilling: billingCycle === "ANNUAL",
    });
    const discountPercent = pricing.discountPercent;
    const amountSoles = pricing.total;
    const notesWithDuration = sanitizeText(
      [notes, `ciclo=${billingCycle}`, `meses=${durationMonths}`, `dias=${durationDays}`, `descuento=${discountPercent}%`, `monto=S/${amountSoles.toFixed(2)}`]
        .filter(Boolean)
        .join(" | "),
      900,
    );

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

    let createdRequestId = "";
    try {
      const created = await createSubscriptionRequest({
        userId,
        requestedPlan: plan,
        paymentMethod: paymentMethod || "TRANSFERENCIA",
        notes: notesWithDuration,
        proofBase64: proofBase64 || undefined,
        proofFileName: proofFileName || undefined,
        proofMimeType: proofMimeType || undefined,
      });
      createdRequestId = created.request.id;
    } catch (storageError) {
      if (!idToken) {
        throw storageError;
      }

      const fallbackNotification = await writeSubscriptionAdminNotificationViaFirestoreToken({
        idToken,
        userId,
        email: userEmail,
        requestedPlan: plan,
        requestType: "PAYMENT",
        requestStatus: "PENDING",
        paymentMethod: paymentMethod || "TRANSFERENCIA",
        notes: notesWithDuration,
        requestId: `fallback-${userId}-${Date.now()}`,
        billingCycle,
        durationMonths,
        durationDays,
        discountPercent,
        amountSoles,
      });

      return NextResponse.json({
        success: true,
        requestId: fallbackNotification.requestId,
        message: "Solicitud registrada en modo respaldo y enviada al panel admin.",
      });
    }

    if (idToken) {
      await writeSubscriptionAdminNotificationViaFirestoreToken({
        idToken,
        userId,
        email: userEmail,
        requestedPlan: plan,
        requestType: "PAYMENT",
        requestStatus: "PENDING",
        paymentMethod: paymentMethod || "TRANSFERENCIA",
        notes: notesWithDuration,
        requestId: createdRequestId,
        billingCycle,
        durationMonths,
        durationDays,
        discountPercent,
        amountSoles,
      }).catch((notificationError) => {
        console.error("[Subscription Request] payment notification warning:", notificationError);
      });
    }

    return NextResponse.json({
      success: true,
      requestId: createdRequestId,
      message: "Solicitud registrada. Estado pendiente hasta validacion admin.",
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json(
        { error: "Permisos de Firestore insuficientes para registrar la solicitud." },
        { status: 403 },
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
