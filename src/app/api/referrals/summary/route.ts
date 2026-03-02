import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { buildReferralSummary } from "@/lib/referrals/service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const summary = await buildReferralSummary({
      userId: user.uid,
      email: String(user.email || ""),
    });

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    console.error("[Referrals Summary] Error:", error);
    return NextResponse.json({ error: "No se pudo cargar resumen de referidos" }, { status: 500 });
  }
}
