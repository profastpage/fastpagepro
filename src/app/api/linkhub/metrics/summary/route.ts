import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

type CategoryAggregate = {
  categoryId: string;
  categoryName: string;
  views: number;
  orders: number;
  conversionRate: number;
};

function sanitizeText(value: unknown, max = 160) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function toHourLabel(hour: number) {
  const safe = Math.max(0, Math.min(23, Math.round(Number(hour) || 0)));
  return `${String(safe).padStart(2, "0")}:00`;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);

    if (!adminDb) {
      return NextResponse.json({
        summary: {
          whatsappClicks: 0,
          totalOrders: 0,
          totalReservations: 0,
          topDishes: [],
          peakHours: [],
          categories: [],
        },
      });
    }

    const url = new URL(request.url);
    const profileId = sanitizeText(url.searchParams.get("profileId"), 160);
    const slug = sanitizeText(url.searchParams.get("slug"), 120);
    const now = Date.now();
    const fromTs = now - 30 * 24 * 60 * 60 * 1000;

    const snapshot = await adminDb
      .collection("linkhub_metrics_events")
      .where("ownerUserId", "==", userId)
      .limit(2500)
      .get();

    const rows = snapshot.docs
      .map((doc) => doc.data() as Record<string, unknown>)
      .filter((row) => Number(row.createdAt || row.ts || 0) >= fromTs)
      .filter((row) => {
        if (profileId) return String(row.profileId || "") === profileId;
        if (slug) return String(row.slug || "") === slug;
        return true;
      });

    const topDishMap = new Map<string, number>();
    const peakHoursMap = new Map<number, number>();
    const categoryViews = new Map<string, { categoryName: string; views: number }>();
    const categoryOrders = new Map<string, { categoryName: string; orders: number }>();

    let whatsappClicks = 0;
    let totalOrders = 0;
    let totalReservations = 0;

    for (const row of rows) {
      const eventType = String(row.eventType || "");
      const hour = Math.max(0, Math.min(23, Math.round(Number(row.hour || 0))));
      const categoryId = sanitizeText(row.categoryId, 120);
      const categoryName = sanitizeText(row.categoryName, 120) || "Sin categoria";

      if (
        eventType === "contact_whatsapp_click" ||
        eventType === "order_whatsapp" ||
        eventType === "reservation_whatsapp"
      ) {
        whatsappClicks += 1;
        peakHoursMap.set(hour, (peakHoursMap.get(hour) || 0) + 1);
      }

      if (eventType === "reservation_whatsapp") {
        totalReservations += 1;
      }

      if (eventType === "category_view") {
        const key = categoryId || categoryName;
        const prev = categoryViews.get(key) || { categoryName, views: 0 };
        prev.views += 1;
        if (!prev.categoryName) prev.categoryName = categoryName;
        categoryViews.set(key, prev);
      }

      if (eventType === "cart_add") {
        const itemTitle = sanitizeText(row.itemTitle, 140) || "Item";
        const qty = Math.max(1, Math.round(Number(row.quantity || 1)));
        topDishMap.set(itemTitle, (topDishMap.get(itemTitle) || 0) + qty);
      }

      if (eventType === "order_whatsapp") {
        totalOrders += 1;
        const items = Array.isArray(row.items) ? row.items : [];
        if (items.length === 0) {
          const fallbackTitle = sanitizeText(row.itemTitle, 140);
          const fallbackQty = Math.max(1, Math.round(Number(row.quantity || 1)));
          if (fallbackTitle) {
            topDishMap.set(fallbackTitle, (topDishMap.get(fallbackTitle) || 0) + fallbackQty);
          }
          if (categoryId || categoryName) {
            const key = categoryId || categoryName;
            const prev = categoryOrders.get(key) || { categoryName, orders: 0 };
            prev.orders += fallbackQty;
            if (!prev.categoryName) prev.categoryName = categoryName;
            categoryOrders.set(key, prev);
          }
        } else {
          for (const item of items) {
            const itemRow = item as Record<string, unknown>;
            const title = sanitizeText(itemRow.itemTitle, 140) || "Item";
            const qty = Math.max(1, Math.round(Number(itemRow.quantity || 1)));
            const itemCategoryId = sanitizeText(itemRow.categoryId, 120);
            const itemCategoryName = sanitizeText(itemRow.categoryName, 120) || "Sin categoria";
            topDishMap.set(title, (topDishMap.get(title) || 0) + qty);
            const categoryKey = itemCategoryId || itemCategoryName;
            const prev = categoryOrders.get(categoryKey) || {
              categoryName: itemCategoryName,
              orders: 0,
            };
            prev.orders += qty;
            if (!prev.categoryName) prev.categoryName = itemCategoryName;
            categoryOrders.set(categoryKey, prev);
          }
        }
      }
    }

    const topDishes = Array.from(topDishMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const peakHours = Array.from(peakHoursMap.entries())
      .map(([hour, clicks]) => ({ hour: toHourLabel(hour), clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 4);

    const categoryKeys = new Set<string>([
      ...Array.from(categoryViews.keys()),
      ...Array.from(categoryOrders.keys()),
    ]);
    const categories: CategoryAggregate[] = Array.from(categoryKeys)
      .map((key) => {
        const views = categoryViews.get(key)?.views || 0;
        const orders = categoryOrders.get(key)?.orders || 0;
        const categoryName =
          categoryOrders.get(key)?.categoryName || categoryViews.get(key)?.categoryName || "Sin categoria";
        const conversionRate = views > 0 ? (orders / views) * 100 : 0;
        return {
          categoryId: key,
          categoryName,
          views,
          orders,
          conversionRate: Number(conversionRate.toFixed(1)),
        };
      })
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 8);

    return NextResponse.json({
      summary: {
        whatsappClicks,
        totalOrders,
        totalReservations,
        topDishes,
        peakHours,
        categories,
      },
    });
  } catch (error: unknown) {
    const message = String((error as { message?: string })?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    console.error("[LinkHub Metrics Summary] Error:", error);
    return NextResponse.json({ error: "No se pudo cargar metricas." }, { status: 500 });
  }
}

