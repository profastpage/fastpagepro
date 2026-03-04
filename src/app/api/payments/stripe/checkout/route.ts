import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { enforceRouteRateLimit } from "@/lib/server/rateLimit";
import {
  calculateSubscriptionAmountSoles,
  type PlanType,
} from "@/lib/subscription/plans";
import {
  createPendingStripeSubscriptionPayment,
  markStripeSubscriptionPaymentStatus,
  updateStripeSubscriptionPaymentProvider,
} from "@/lib/subscription/stripePayments";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

export const runtime = "nodejs";

type BillingCycle = "MONTHLY" | "ANNUAL";
const checkoutBodySchema = z
  .object({
    plan: z.string().trim().max(24),
    billingCycle: z.enum(["MONTHLY", "ANNUAL"]).optional(),
    durationMonths: z.coerce.number().int().min(1).max(12).optional(),
  })
  .passthrough();

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
    const rateLimit = await enforceRouteRateLimit({
      request,
      namespace: "stripe_checkout",
      limit: 8,
      window: "1 m",
      identifier: user.uid,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
        { status: 429 },
      );
    }

    const rawBody = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const parsedBody = checkoutBodySchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Datos invalidos para Stripe" }, { status: 400 });
    }
    const body = parsedBody.data;

    const plan = toPlan(body?.plan);
    if (!plan || plan === "FREE") {
      return NextResponse.json({ error: "Plan invalido para Stripe" }, { status: 400 });
    }

    const billingCycle = toBillingCycle(body?.billingCycle);
    const durationMonths = toDurationMonths(body?.durationMonths, billingCycle);
    const pricing = calculateSubscriptionAmountSoles({
      plan,
      months: durationMonths,
      annualBilling: billingCycle === "ANNUAL",
    });

    const pending = await createPendingStripeSubscriptionPayment({
      userId: user.uid,
      plan,
      billingCycle,
      durationMonths,
      discountPercent: pricing.discountPercent,
      amountSoles: pricing.total,
    });
    pendingPaymentId = pending.id;

    const origin = buildOrigin(request);
    const successUrl = `${origin}/dashboard/billing?stripeResult=success&paymentId=${encodeURIComponent(pending.id)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/dashboard/billing?stripeResult=cancel&paymentId=${encodeURIComponent(pending.id)}`;

    const checkout = await createStripeCheckoutSession({
      referenceId: pending.id,
      amountSoles: pricing.total,
      customerId: user.uid,
      customerEmail: String(user.email || ""),
      description: `Fast Page ${plan} ${durationMonths}m`,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.uid,
        plan,
        billingCycle,
        durationMonths,
      },
    });

    await updateStripeSubscriptionPaymentProvider({
      paymentId: pending.id,
      providerSessionId: checkout.providerSessionId,
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
      await markStripeSubscriptionPaymentStatus({
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
    if (message.startsWith("STRIPE_CHECKOUT_FAILED")) {
      return NextResponse.json({ error: "No se pudo crear pago Stripe" }, { status: 502 });
    }

    console.error("[Stripe Checkout] Error:", error);
    return NextResponse.json({ error: "No se pudo iniciar pago con Stripe" }, { status: 500 });
  }
}
