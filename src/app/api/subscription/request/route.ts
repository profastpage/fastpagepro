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
      const trialSubscription = await startBusinessTrial(userId);
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
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    console.error("[Subscription Request] Error:", error);
    return NextResponse.json({ error: "No se pudo registrar la solicitud de suscripcion" }, { status: 500 });
  }
}
