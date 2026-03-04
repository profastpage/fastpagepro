import { NextRequest, NextResponse } from "next/server";
import { buildThemeMarketplaceUseCases } from "@/context/themeMarketplace/buildThemeMarketplaceUseCases";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

const themeMarketplaceUseCases = buildThemeMarketplaceUseCases();

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
      paymentMethod?: unknown;
    };

    const result = await themeMarketplaceUseCases.executePurchase.execute({
      userId: user.uid,
      userEmail: String(user.email || ""),
      packId: String(body?.packId || "").trim(),
      paymentMethod: body?.paymentMethod,
      origin: buildOrigin(request),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("INVALID_PACK")) {
      return NextResponse.json({ error: "Pack invalido" }, { status: 400 });
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

    const result = await themeMarketplaceUseCases.confirmPurchase.execute({
      userId: user.uid,
      orderId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("ORDER_NOT_FOUND")) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    if (message.startsWith("ORDER_PROVIDER_PAYMENT_MISSING")) {
      return NextResponse.json({ error: "Orden sin pago proveedor" }, { status: 409 });
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
