import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import {
  getStripeSubscriptionPayment,
  markStripeSubscriptionPaymentStatus,
  updateStripeSubscriptionPaymentProvider,
} from "@/lib/subscription/stripePayments";
import { fetchStripeCheckoutSessionStatus } from "@/lib/payments/stripe";
import { assignSubscriptionPlanByAdmin } from "@/lib/subscription/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      paymentId?: string;
      sessionId?: string;
    };
    const paymentId = String(body?.paymentId || "").trim();
    const sessionId = String(body?.sessionId || "").trim();

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId es requerido" }, { status: 400 });
    }

    const payment = await getStripeSubscriptionPayment(paymentId);
    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    if (payment.userId !== user.uid) {
      return NextResponse.json({ error: "No autorizado para este pago" }, { status: 403 });
    }

    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        paid: true,
        alreadyPaid: true,
      });
    }

    let providerSessionId = String(payment.providerSessionId || "").trim();
    if (!providerSessionId && sessionId) {
      await updateStripeSubscriptionPaymentProvider({
        paymentId: payment.id,
        providerSessionId: sessionId,
        checkoutMode: payment.checkoutMode,
      });
      providerSessionId = sessionId;
    }

    if (!providerSessionId) {
      return NextResponse.json({ error: "Pago Stripe sin sesion asociada" }, { status: 409 });
    }

    const providerStatus = await fetchStripeCheckoutSessionStatus({
      providerSessionId,
    });

    if (!providerStatus.paid) {
      return NextResponse.json({
        success: true,
        paid: false,
        status: providerStatus.status,
      });
    }

    await markStripeSubscriptionPaymentStatus({ paymentId: payment.id, status: "PAID" });

    const durationDays = Math.max(1, payment.durationMonths * 30);
    const assigned = await assignSubscriptionPlanByAdmin({
      userId: payment.userId,
      plan: payment.plan,
      durationDays,
      paymentMethod: "TRANSFERENCIA",
    });

    return NextResponse.json({
      success: true,
      paid: true,
      status: providerStatus.status,
      subscription: {
        id: assigned.id,
        plan: assigned.plan,
        status: assigned.status,
        startDate: assigned.startDate.toISOString(),
        endDate: assigned.endDate.toISOString(),
      },
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
    }
    if (message.startsWith("STRIPE_STATUS_FAILED")) {
      return NextResponse.json({ error: "No se pudo validar pago Stripe" }, { status: 502 });
    }

    console.error("[Stripe Confirm] Error:", error);
    return NextResponse.json({ error: "No se pudo confirmar pago Stripe" }, { status: 500 });
  }
}
