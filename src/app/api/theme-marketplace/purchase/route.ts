import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { getThemePackById } from "@/lib/themeMarketplace/packs";
import {
  createThemeMarketplaceOrder,
  getThemeMarketplaceOrderById,
  markThemeMarketplaceOrderPaid,
  updateThemeMarketplaceOrderProvider,
  type ThemeMarketplacePaymentMethod,
} from "@/lib/themeMarketplace/service";
import { createIzipayCheckoutSession, fetchIzipayPaymentStatus } from "@/lib/payments/izipay";

export const runtime = "nodejs";

function toPaymentMethod(input: unknown): ThemeMarketplacePaymentMethod {
  const normalized = String(input || "").trim().toUpperCase();
  if (normalized === "YAPE" || normalized === "PLIN" || normalized === "TRANSFERENCIA") {
    return normalized;
  }
  return "IZIPAY";
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
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      packId?: string;
      paymentMethod?: ThemeMarketplacePaymentMethod;
    };

    const packId = String(body?.packId || "").trim();
    const paymentMethod = toPaymentMethod(body?.paymentMethod);
    const pack = getThemePackById(packId);

    if (!pack) {
      return NextResponse.json({ error: "Pack invalido" }, { status: 400 });
    }

    const provider = paymentMethod === "IZIPAY" ? "IZIPAY" : "MANUAL";
    const order = await createThemeMarketplaceOrder({
      userId: user.uid,
      packId: pack.id,
      paymentMethod,
      provider,
    });

    if (paymentMethod !== "IZIPAY") {
      return NextResponse.json({
        success: true,
        order,
        paymentFlow: "MANUAL",
      });
    }

    const origin = buildOrigin(request);
    const successUrl = `${origin}/dashboard/billing?marketplaceResult=success&orderId=${encodeURIComponent(order.id)}`;
    const cancelUrl = `${origin}/dashboard/billing?marketplaceResult=cancel&orderId=${encodeURIComponent(order.id)}`;

    const checkout = await createIzipayCheckoutSession({
      referenceId: order.id,
      amountSoles: pack.priceSoles,
      customerId: user.uid,
      customerEmail: String(user.email || ""),
      description: `Theme pack ${pack.name}`,
      successUrl,
      cancelUrl,
      intent: "THEME_PACK",
      metadata: {
        orderId: order.id,
        packId: pack.id,
      },
    });

    await updateThemeMarketplaceOrderProvider({
      orderId: order.id,
      providerPaymentId: checkout.providerPaymentId,
      provider: "IZIPAY",
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutUrl: checkout.checkoutUrl,
      paymentFlow: "IZIPAY",
      mode: checkout.mode,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Marketplace no disponible" }, { status: 503 });
    }
    if (message.startsWith("IZIPAY_CHECKOUT_FAILED")) {
      return NextResponse.json({ error: "No se pudo iniciar pago Izipay" }, { status: 502 });
    }
    console.error("[Theme Marketplace Purchase] Error:", error);
    return NextResponse.json({ error: "No se pudo crear orden del marketplace" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as { orderId?: string };
    const orderId = String(body?.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 });
    }

    const order = await getThemeMarketplaceOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }
    if (order.userId !== user.uid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ success: true, paid: true, alreadyPaid: true });
    }

    if (order.provider !== "IZIPAY") {
      return NextResponse.json({ success: true, paid: false, status: order.status });
    }
    if (!order.providerPaymentId) {
      return NextResponse.json({ error: "Orden sin pago proveedor" }, { status: 409 });
    }

    const providerStatus = await fetchIzipayPaymentStatus({
      providerPaymentId: order.providerPaymentId,
    });

    if (!providerStatus.paid) {
      return NextResponse.json({
        success: true,
        paid: false,
        status: providerStatus.status,
      });
    }

    const paidOrder = await markThemeMarketplaceOrderPaid({
      orderId: order.id,
      providerPaymentId: order.providerPaymentId,
    });

    return NextResponse.json({
      success: true,
      paid: true,
      status: providerStatus.status,
      order: paidOrder,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Marketplace no disponible" }, { status: 503 });
    }
    if (message.startsWith("IZIPAY_STATUS_FAILED")) {
      return NextResponse.json({ error: "No se pudo validar pago de marketplace" }, { status: 502 });
    }
    console.error("[Theme Marketplace Confirm] Error:", error);
    return NextResponse.json({ error: "No se pudo confirmar orden del marketplace" }, { status: 500 });
  }
}

