import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import {
  calculateSubscriptionAmountSoles,
  type PlanType,
} from "@/lib/subscription/plans";
import {
  createPendingIzipaySubscriptionPayment,
  markIzipaySubscriptionPaymentStatus,
  updateIzipaySubscriptionPaymentProvider,
} from "@/lib/subscription/izipayPayments";
import { createIzipayCheckoutSession } from "@/lib/payments/izipay";

export const runtime = "nodejs";

type BillingCycle = "MONTHLY" | "ANNUAL";

function toPlan(input: unknown): PlanType | null {
  const normalized = String(input || "").trim().toUpperCase();
  if (normalized === "FREE" || normalized === "BUSINESS" || normalized === "PRO") {
    return normalized;
  }
  return null;
}

function toBillingCycle(input: unknown): BillingCycle {
  const normalized = String(input || "").trim().toUpperCase();
  return normalized === "ANNUAL" ? "ANNUAL" : "MONTHLY";
}

function toDurationMonths(input: unknown, billingCycle: BillingCycle): number {
  if (billingCycle === "ANNUAL") return 12;
  const parsed = Number(input || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(12, Math.floor(parsed)));
}

function buildOrigin(request: NextRequest): string {
  const fromOrigin = String(request.headers.get("origin") || "").trim();
  if (fromOrigin.startsWith("http://") || fromOrigin.startsWith("https://")) {
    return fromOrigin.replace(/\/$/, "");
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: NextRequest) {
  let pendingPaymentId = "";
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      plan?: string;
      billingCycle?: BillingCycle;
      durationMonths?: number;
    };

    const plan = toPlan(body?.plan);
    if (!plan || plan === "FREE") {
      return NextResponse.json({ error: "Plan invalido para Izipay" }, { status: 400 });
    }

    const billingCycle = toBillingCycle(body?.billingCycle);
    const durationMonths = toDurationMonths(body?.durationMonths, billingCycle);
    const pricing = calculateSubscriptionAmountSoles({
      plan,
      months: durationMonths,
      annualBilling: billingCycle === "ANNUAL",
    });

    const pending = await createPendingIzipaySubscriptionPayment({
      userId: user.uid,
      plan,
      billingCycle,
      durationMonths,
      discountPercent: pricing.discountPercent,
      amountSoles: pricing.total,
    });
    pendingPaymentId = pending.id;

    const origin = buildOrigin(request);
    const successUrl = `${origin}/dashboard/billing?izipayResult=success&paymentId=${encodeURIComponent(pending.id)}`;
    const cancelUrl = `${origin}/dashboard/billing?izipayResult=cancel&paymentId=${encodeURIComponent(pending.id)}`;

    const checkout = await createIzipayCheckoutSession({
      referenceId: pending.id,
      amountSoles: pricing.total,
      customerId: user.uid,
      customerEmail: String(user.email || ""),
      description: `Fast Page ${plan} ${durationMonths}m`,
      successUrl,
      cancelUrl,
      intent: "SUBSCRIPTION",
      metadata: {
        userId: user.uid,
        plan,
        billingCycle,
        durationMonths,
      },
    });

    await updateIzipaySubscriptionPaymentProvider({
      paymentId: pending.id,
      providerPaymentId: checkout.providerPaymentId,
      checkoutMode: checkout.mode,
    });

    return NextResponse.json({
      success: true,
      paymentId: pending.id,
      checkoutUrl: checkout.checkoutUrl,
      mode: checkout.mode,
    });
  } catch (error: any) {
    if (pendingPaymentId) {
      await markIzipaySubscriptionPaymentStatus({
        paymentId: pendingPaymentId,
        status: "FAILED",
      }).catch(() => undefined);
    }

    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de pagos no disponible" }, { status: 503 });
    }
    if (message.startsWith("IZIPAY_CHECKOUT_FAILED")) {
      return NextResponse.json({ error: "No se pudo crear pago Izipay" }, { status: 502 });
    }

    console.error("[Izipay Checkout] Error:", error);
    return NextResponse.json({ error: "No se pudo iniciar pago con Izipay" }, { status: 500 });
  }
}

