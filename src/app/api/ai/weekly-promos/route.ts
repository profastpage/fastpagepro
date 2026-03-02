import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

type PromoDayPlan = {
  day: string;
  headline: string;
  description: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
  focusCategory: string;
};

const WEEK_DAYS = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

function sanitizeText(value: unknown, maxLen = 120): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeItems(input: unknown): Array<{ category: string; title: string; price: number }> {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      return {
        category: sanitizeText(record.categoryName || record.category || "Carta", 60),
        title: sanitizeText(record.title || "Item", 80),
        price: Math.max(0, Number(record.price || 0) || 0),
      };
    })
    .filter((entry): entry is { category: string; title: string; price: number } => Boolean(entry));
}

function buildPromoPlan(input: {
  objective: string;
  categories: string[];
  items: Array<{ category: string; title: string; price: number }>;
}): PromoDayPlan[] {
  const categoryPool = input.categories.length > 0 ? input.categories : ["Carta principal", "Especiales", "Bebidas"];
  const topItems = input.items.slice(0, 8);

  return WEEK_DAYS.map((day, index) => {
    const category = categoryPool[index % categoryPool.length] || "Carta";
    const featured = topItems[index % (topItems.length || 1)] || {
      title: "Producto estrella",
      category,
      price: 0,
    };
    const baseDiscount = 8 + (index % 4) * 2;
    const weekendBoost = index >= 4 ? 4 : 0;
    const discountPercent = clamp(baseDiscount + weekendBoost, 8, 25);
    const startHour = index % 2 === 0 ? "12:00" : "18:00";
    const endHour = index % 2 === 0 ? "14:00" : "21:00";

    return {
      day,
      headline: `${category}: ${featured.title}`,
      description: `Objetivo: ${input.objective}. Oferta recomendada para ${category.toLowerCase()} con foco en cierre por WhatsApp.`,
      discountPercent,
      startTime: startHour,
      endTime: endHour,
      focusCategory: category,
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    await requireFirebaseUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      objective?: string;
      categories?: string[];
      items?: Array<Record<string, unknown>>;
    };

    const objective =
      sanitizeText(body?.objective, 120) || "incrementar pedidos por WhatsApp y ticket promedio";
    const categories = Array.isArray(body?.categories)
      ? body.categories.map((entry) => sanitizeText(entry, 60)).filter(Boolean).slice(0, 12)
      : [];
    const items = normalizeItems(body?.items);

    const promotions = buildPromoPlan({
      objective,
      categories,
      items,
    });

    return NextResponse.json({
      success: true,
      objective,
      promotions,
      generatedAt: Date.now(),
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio IA no disponible" }, { status: 503 });
    }
    console.error("[AI Weekly Promos] Error:", error);
    return NextResponse.json({ error: "No se pudo generar promociones semanales" }, { status: 500 });
  }
}

