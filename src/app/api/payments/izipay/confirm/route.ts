import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import {
  getIzipaySubscriptionPayment,
  markIzipaySubscriptionPaymentStatus,
} from "@/lib/subscription/izipayPayments";
import { fetchIzipayPaymentStatus } from "@/lib/payments/izipay";
import { assignSubscriptionPlanByAdmin } from "@/lib/subscription/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as { paymentId?: string };
    const paymentId = String(body?.paymentId || "").trim();

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId es requerido" }, { status: 400 });
    }

    const payment = await getIzipaySubscriptionPayment(paymentId);
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

    if (!payment.providerPaymentId) {
      return NextResponse.json({ error: "Pago sin proveedor asociado" }, { status: 409 });
    }

    const providerStatus = await fetchIzipayPaymentStatus({
      providerPaymentId: payment.providerPaymentId,
    });

    if (!providerStatus.paid) {
      return NextResponse.json({
        success: true,
        paid: false,
        status: providerStatus.status,
      });
    }

    await markIzipaySubscriptionPaymentStatus({ paymentId: payment.id, status: "PAID" });

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
    if (message.startsWith("IZIPAY_STATUS_FAILED")) {
      return NextResponse.json({ error: "No se pudo validar pago Izipay" }, { status: 502 });
    }

    console.error("[Izipay Confirm] Error:", error);
    return NextResponse.json({ error: "No se pudo confirmar pago Izipay" }, { status: 500 });
  }
}

