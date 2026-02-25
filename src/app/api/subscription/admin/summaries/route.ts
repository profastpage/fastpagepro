import { NextRequest, NextResponse } from "next/server";
import { getLatestSubscriptionsByUsers } from "@/lib/subscription/service";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { assertSuperAdmin } from "@/lib/server/requireSuperAdmin";

interface SummariesBody {
  userIds?: string[];
}

const MAX_USERS_PER_REQUEST = 200;

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireFirebaseUser(request);
    assertSuperAdmin(adminUser);

    const body = (await request.json()) as SummariesBody;
    const userIds = Array.isArray(body?.userIds)
      ? body.userIds.map((entry) => String(entry || "").trim()).filter(Boolean)
      : [];

    if (userIds.length === 0) {
      return NextResponse.json({ summaries: [] });
    }

    if (userIds.length > MAX_USERS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Maximo ${MAX_USERS_PER_REQUEST} usuarios por solicitud.` },
        { status: 400 },
      );
    }

    const subscriptions = await getLatestSubscriptionsByUsers(userIds);
    const byUserId = new Map(subscriptions.map((item) => [item.userId, item]));

    const summaries = userIds.map((userId) => {
      const current = byUserId.get(userId);
      if (!current) {
        return {
          userId,
          plan: "FREE",
          status: "ACTIVE",
          startDate: null,
          endDate: null,
          isActive: true,
        };
      }

      return {
        userId: current.userId,
        plan: current.plan,
        status: current.status,
        startDate: current.startDate.toISOString(),
        endDate: current.endDate.toISOString(),
        isActive: current.status === "ACTIVE" && current.endDate.getTime() > Date.now(),
      };
    });

    return NextResponse.json({ summaries });
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
    console.error("[Subscription Admin Summaries] Error:", error);
    return NextResponse.json({ error: "No se pudo obtener el estado de planes." }, { status: 500 });
  }
}
