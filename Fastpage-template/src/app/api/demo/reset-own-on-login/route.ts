import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { resetOwnDemoOnLogin } from "@/lib/server/demoAccounts/service";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireFirebaseUser(request);
    const uid = String(currentUser?.uid || "").trim();
    if (!uid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const result = await resetOwnDemoOnLogin(uid);
    return NextResponse.json(result);
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    if (message.startsWith("NOT_FOUND")) {
      return NextResponse.json({ error: "Demo no encontrada" }, { status: 404 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503 });
    }
    console.error("[Demo Reset On Login] Error:", error);
    return NextResponse.json({ error: "No se pudo reiniciar la demo." }, { status: 500 });
  }
}
