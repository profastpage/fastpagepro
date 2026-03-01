import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary, startProTrial } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);
    await startProTrial(userId);
    const summary = await buildSubscriptionSummary(userId);
    return NextResponse.json({
      ok: true,
      summary,
      message: "Prueba PRO activada por 7 dias.",
    });
  } catch (error: unknown) {
    const message = String((error as { message?: string })?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    if (message.startsWith("PRO_TRIAL_ALREADY_USED")) {
      return NextResponse.json(
        { error: "La prueba PRO ya fue usada en esta cuenta." },
        { status: 400 },
      );
    }
    if (message.startsWith("USER_ID_REQUIRED")) {
      return NextResponse.json({ error: "No se pudo identificar el usuario." }, { status: 400 });
    }

    console.error("[Subscription Pro Trial] Error:", error);
    return NextResponse.json(
      { error: "No se pudo activar la prueba PRO." },
      { status: 500 },
    );
  }
}

