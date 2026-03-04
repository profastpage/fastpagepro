import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { enforceRouteRateLimit } from "@/lib/server/rateLimit";
import { applyReferralCode } from "@/lib/referrals/service";
import { isFirebaseAdminCredentialError } from "@/lib/server/firebaseError";

export const runtime = "nodejs";

const applyBodySchema = z
  .object({
    code: z.string().trim().min(3).max(32),
  })
  .passthrough();

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const rateLimit = await enforceRouteRateLimit({
      request,
      namespace: "referrals_apply",
      limit: 12,
      window: "1 m",
      identifier: user.uid,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
        { status: 429 },
      );
    }

    const rawBody = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const parsedBody = applyBodySchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Codigo o alias de referido requerido" }, { status: 400 });
    }

    const result = await applyReferralCode({
      invitedUserId: user.uid,
      invitedEmail: String(user.email || ""),
      code: parsedBody.data.code,
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
    if (message.startsWith("SERVICE_UNAVAILABLE") || isFirebaseAdminCredentialError(error)) {
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
