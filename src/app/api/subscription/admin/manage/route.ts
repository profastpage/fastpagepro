import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, PlanType } from "@prisma/client";
import { assignSubscriptionPlanByAdmin } from "@/lib/subscription/service";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { assertSuperAdmin } from "@/lib/server/requireSuperAdmin";

interface ManageBody {
  userId?: string;
  plan?: string;
  mode?: string;
  durationDays?: number;
  paymentMethod?: string;
}

function toPlanType(value: string): PlanType | null {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "FREE" || normalized === "BUSINESS" || normalized === "PRO") {
    return normalized;
  }
  return null;
}

function toMode(value: string): "ACTIVATE" | "DEACTIVATE" | null {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "ACTIVATE" || normalized === "DEACTIVATE") {
    return normalized;
  }
  return null;
}

function toPaymentMethod(value: string): PaymentMethod | null {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "YAPE" || normalized === "PLIN" || normalized === "TRANSFERENCIA") {
    return normalized;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireFirebaseUser(request);
    assertSuperAdmin(adminUser);

    const body = (await request.json()) as ManageBody;
    const userId = String(body?.userId || "").trim();
    const plan = toPlanType(String(body?.plan || ""));
    const mode = toMode(String(body?.mode || "")) || "ACTIVATE";
    const paymentMethod = toPaymentMethod(String(body?.paymentMethod || "")) || "TRANSFERENCIA";
    const durationDays = Math.max(1, Math.floor(Number(body?.durationDays || 30)));

    if (!userId) {
      return NextResponse.json({ error: "userId es requerido." }, { status: 400 });
    }
    if (!plan) {
      return NextResponse.json({ error: "Plan invalido. Usa FREE, BUSINESS o PRO." }, { status: 400 });
    }
    if (!mode) {
      return NextResponse.json({ error: "Modo invalido. Usa ACTIVATE o DEACTIVATE." }, { status: 400 });
    }

    const subscription = await assignSubscriptionPlanByAdmin({
      userId,
      plan,
      mode,
      durationDays,
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      message:
        mode === "DEACTIVATE"
          ? "Plan premium desactivado. Usuario movido a FREE."
          : "Plan actualizado correctamente.",
      subscription: {
        id: subscription.id,
        userId: subscription.userId,
        plan: subscription.plan,
        status: subscription.status,
        paymentMethod: subscription.paymentMethod,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
      },
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    if (message === "USER_ID_REQUIRED") {
      return NextResponse.json({ error: "userId es requerido." }, { status: 400 });
    }
    console.error("[Subscription Admin Manage] Error:", error);
    return NextResponse.json({ error: "No se pudo actualizar el plan del usuario." }, { status: 500 });
  }
}
