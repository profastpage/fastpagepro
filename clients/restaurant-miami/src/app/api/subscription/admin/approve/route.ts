import { NextRequest, NextResponse } from "next/server";
import { approveSubscriptionRequest } from "@/lib/subscription/service";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { assertSuperAdmin } from "@/lib/server/requireSuperAdmin";

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    assertSuperAdmin(user);

    const body = (await request.json()) as { requestId?: string; durationDays?: number };
    const requestId = String(body?.requestId || "").trim();
    const durationDays = Math.max(1, Number(body?.durationDays || 30));
    if (!requestId) {
      return NextResponse.json({ error: "requestId es requerido" }, { status: 400 });
    }

    const approved = await approveSubscriptionRequest({
      requestId,
      reviewerId: user.uid,
      durationDays,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: approved.id,
        userId: approved.userId,
        plan: approved.plan,
        status: approved.status,
        startDate: approved.startDate.toISOString(),
        endDate: approved.endDate.toISOString(),
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
      return NextResponse.json({ error: "Servicio de autenticación no disponible" }, { status: 503 });
    }
    console.error("[Subscription Approve] Error:", error);
    return NextResponse.json({ error: "No se pudo aprobar la suscripción" }, { status: 500 });
  }
}
