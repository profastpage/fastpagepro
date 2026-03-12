import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { assertSuperAdmin } from "@/lib/server/requireSuperAdmin";
import { deleteExpiredDemos } from "@/lib/server/demoAccounts/service";

function isCronRequest(request: NextRequest) {
  return request.headers.get("x-vercel-cron") === "1";
}

export async function GET(request: NextRequest) {
  try {
    if (!isCronRequest(request)) {
      const adminUser = await requireFirebaseUser(request);
      assertSuperAdmin(adminUser);
    }

    const result = await deleteExpiredDemos();
    return NextResponse.json(result);
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503 });
    }
    console.error("[Cron Delete Expired Demos] Error:", error);
    return NextResponse.json({ error: "No se pudo limpiar demos expiradas" }, { status: 500 });
  }
}
