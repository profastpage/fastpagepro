import { NextRequest, NextResponse } from "next/server";
import { recommendThemeAndStructure } from "@/lib/ai/themeRecommender";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";
import { buildSubscriptionSummary } from "@/lib/subscription/service";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);
    const summary = await buildSubscriptionSummary(userId);

    if (!summary.features.aiOptimization) {
      return NextResponse.json(
        { error: "Tu plan actual no incluye IA de personalización." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as { category?: string; logoColors?: string[] };
    const category = String(body?.category || "").trim();
    const logoColors = Array.isArray(body?.logoColors)
      ? body.logoColors.map((entry) => String(entry || ""))
      : [];

    if (!category) {
      return NextResponse.json({ error: "category es requerido" }, { status: 400 });
    }

    const recommendation = recommendThemeAndStructure({
      category,
      logoColors,
    });

    return NextResponse.json({
      recommendation,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticación no disponible" }, { status: 503 });
    }
    console.error("[AI Theme Recommender] Error:", error);
    return NextResponse.json({ error: "No se pudo generar recomendación IA" }, { status: 500 });
  }
}
