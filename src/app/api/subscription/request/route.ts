import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, PlanType } from "@prisma/client";
import { createSubscriptionRequest } from "@/lib/subscription/service";
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
    const notes = String(formData.get("notes") || "");
    const proof = formData.get("proof");

    if (!plan || plan === "FREE") {
      return NextResponse.json({ error: "Debes seleccionar BUSINESS o PRO." }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: "Método de pago inválido." }, { status: 400 });
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
      message: "Solicitud registrada. Estado pendiente hasta validación admin.",
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticación no disponible" }, { status: 503 });
    }
    console.error("[Subscription Request] Error:", error);
    return NextResponse.json({ error: "No se pudo registrar la solicitud de suscripción" }, { status: 500 });
  }
}
