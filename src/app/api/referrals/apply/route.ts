import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { applyReferralCode } from "@/lib/referrals/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as { code?: string };
    const code = String(body?.code || "").trim();

    if (!code) {
      return NextResponse.json({ error: "Codigo de referido requerido" }, { status: 400 });
    }

    const result = await applyReferralCode({
      invitedUserId: user.uid,
      invitedEmail: String(user.email || ""),
      code,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    if (message.includes("REFERRAL_CODE_NOT_FOUND")) {
      return NextResponse.json({ error: "Codigo de referido no valido" }, { status: 404 });
    }
    if (message.includes("SELF_REFERRAL_NOT_ALLOWED")) {
      return NextResponse.json({ error: "No puedes usar tu propio codigo" }, { status: 400 });
    }
    if (message.includes("INVALID_REFERRAL_CODE")) {
      return NextResponse.json({ error: "Codigo de referido invalido" }, { status: 400 });
    }

    console.error("[Referrals Apply] Error:", error);
    return NextResponse.json({ error: "No se pudo aplicar el codigo de referido" }, { status: 500 });
  }
}
