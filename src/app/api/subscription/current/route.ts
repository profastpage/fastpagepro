import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary, getPendingRequestsByUser } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);
    const [summary, pendingRequests] = await Promise.all([
      buildSubscriptionSummary(userId),
      getPendingRequestsByUser(userId),
    ]);

    return NextResponse.json({
      summary,
      pendingRequests: pendingRequests.map((requestItem) => ({
        id: requestItem.id,
        requestedPlan: requestItem.requestedPlan,
        paymentMethod: requestItem.paymentMethod,
        status: requestItem.status,
        createdAt: requestItem.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticación no disponible" }, { status: 503 });
    }
    console.error("[Subscription Current] Error:", error);
    return NextResponse.json({ error: "No se pudo obtener la suscripción actual" }, { status: 500 });
  }
}
