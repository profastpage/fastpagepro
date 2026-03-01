import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary, startProTrial } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest): string {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
}

function decodeUidFromTokenUnsafe(token: string): string {
  try {
    const segments = token.split(".");
    if (segments.length !== 3) return "";
    const payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf8")) as Record<string, unknown>;
    const uid = String(payload.user_id || payload.uid || payload.sub || "").trim();
    return uid;
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as { userIdHint?: string };
    let userId = "";
    try {
      userId = await requireFirebaseUserId(request);
    } catch (authError: unknown) {
      const message = String((authError as { message?: string })?.message || "");
      if (!message.startsWith("SERVICE_UNAVAILABLE")) {
        throw authError;
      }
      const fallbackUid = decodeUidFromTokenUnsafe(getBearerToken(request));
      const userIdHint = String(payload?.userIdHint || "").trim();
      if (fallbackUid && (!userIdHint || userIdHint === fallbackUid)) {
        userId = fallbackUid;
      } else {
        throw authError;
      }
    }

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
      const isStorageIssue = message.toLowerCase().includes("subscription storage unavailable");
      return NextResponse.json(
        {
          error: isStorageIssue
            ? "Servicio de suscripción no disponible temporalmente. Intenta nuevamente en unos segundos."
            : "Servicio de autenticación no disponible. Reintenta en unos segundos.",
        },
        { status: 503 },
      );
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
