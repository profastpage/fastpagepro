import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { updateReferralProfileSettings } from "@/lib/referrals/service";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      customAlias?: string;
      regenerateCode?: boolean;
    };

    const summary = await updateReferralProfileSettings({
      userId: user.uid,
      email: String(user.email || ""),
      customAlias: typeof body.customAlias === "string" ? body.customAlias : undefined,
      regenerateCode: Boolean(body.regenerateCode),
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
    if (
      message.includes("Unable to detect a Project Id") ||
      message.includes("missing-project-id") ||
      message.includes("PROJECT_ID")
    ) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    if (message.includes("REFERRAL_ALIAS_TAKEN")) {
      return NextResponse.json({ error: "Ese alias ya esta en uso" }, { status: 409 });
    }
    if (message.includes("INVALID_REFERRAL_ALIAS")) {
      return NextResponse.json({ error: "Alias invalido. Usa letras, numeros y guion." }, { status: 400 });
    }

    console.error("[Referrals Profile] Error:", error);
    return NextResponse.json({ error: "No se pudo actualizar referidos" }, { status: 500 });
  }
}
