import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { enforceRouteRateLimit } from "@/lib/server/rateLimit";
import { updateReferralProfileSettings } from "@/lib/referrals/service";
import { isFirebaseAdminCredentialError, isFirebaseProjectConfigError } from "@/lib/server/firebaseError";

export const runtime = "nodejs";
const referralProfilePatchSchema = z
  .object({
    customAlias: z.string().trim().max(32).optional(),
    regenerateCode: z.coerce.boolean().optional(),
  })
  .passthrough();

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const rateLimit = await enforceRouteRateLimit({
      request,
      namespace: "referrals_profile_patch",
      limit: 8,
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
    const parsedBody = referralProfilePatchSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Alias invalido. Usa letras, numeros y guion." }, { status: 400 });
    }
    const body = parsedBody.data;

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
    if (isFirebaseProjectConfigError(error)) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE") || isFirebaseAdminCredentialError(error)) {
      return NextResponse.json({ error: "Servicio de referidos no disponible" }, { status: 503 });
    }
    if (message.includes("REFERRAL_ALIAS_TAKEN")) {
      return NextResponse.json({ error: "Ese alias ya esta en uso" }, { status: 409 });
    }
    if (message.includes("REFERRAL_ALIAS_GENERATION_FAILED")) {
      return NextResponse.json({ error: "No se pudo reservar ese alias. Prueba otro." }, { status: 409 });
    }
    if (message.includes("INVALID_REFERRAL_ALIAS")) {
      return NextResponse.json({ error: "Alias invalido. Usa letras, numeros y guion." }, { status: 400 });
    }

    console.error("[Referrals Profile] Error:", error);
    return NextResponse.json({ error: "No se pudo actualizar referidos" }, { status: 500 });
  }
}
