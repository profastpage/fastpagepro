import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const ALLOWED_EVENT_TYPES = new Set([
  "page_view",
  "category_view",
  "cart_add",
  "contact_whatsapp_click",
  "order_whatsapp",
  "reservation_whatsapp",
]);

function sanitizeText(value: unknown, max = 120) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function sanitizeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Servicio de metricas no disponible." }, { status: 503 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const eventType = sanitizeText(body?.eventType || body?.type, 60).toLowerCase();
    const ownerUserId = sanitizeText(body?.ownerUserId, 160);
    const profileId = sanitizeText(body?.profileId, 160);
    const slug = sanitizeText(body?.slug, 120);
    if (!ALLOWED_EVENT_TYPES.has(eventType)) {
      return NextResponse.json({ error: "Evento no permitido." }, { status: 400 });
    }
    if (!ownerUserId && !slug) {
      return NextResponse.json({ error: "ownerUserId o slug es requerido." }, { status: 400 });
    }

    const now = Date.now();
    const sourceTs = sanitizeNumber(body?.ts, now);
    const eventDate = new Date(Math.max(0, sourceTs));
    const hour = eventDate.getHours();
    const dateKey = eventDate.toISOString().slice(0, 10);

    const rawItems = Array.isArray(body?.items) ? body.items : [];
    const items = rawItems
      .map((entry) => {
        const row = entry as Record<string, unknown>;
        return {
          itemId: sanitizeText(row?.itemId, 120),
          itemTitle: sanitizeText(row?.itemTitle, 140),
          categoryId: sanitizeText(row?.categoryId, 120),
          categoryName: sanitizeText(row?.categoryName, 120),
          quantity: Math.max(1, Math.min(999, Math.round(sanitizeNumber(row?.quantity, 1)))),
        };
      })
      .filter((item) => item.itemTitle || item.itemId)
      .slice(0, 24);

    const payload = {
      eventType,
      ownerUserId,
      profileId,
      slug,
      categoryId: sanitizeText(body?.categoryId, 120),
      categoryName: sanitizeText(body?.categoryName, 120),
      itemId: sanitizeText(body?.itemId, 120),
      itemTitle: sanitizeText(body?.itemTitle, 140),
      quantity: Math.max(1, Math.min(999, Math.round(sanitizeNumber(body?.quantity, 1)))),
      totalAmount: Math.max(0, sanitizeNumber(body?.totalAmount, 0)),
      hour,
      dateKey,
      ts: Math.max(0, sourceTs),
      items,
      createdAt: now,
      source: "bio",
    };

    await adminDb.collection("linkhub_metrics_events").add(payload);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[LinkHub Metrics Event] Error:", error);
    return NextResponse.json({ error: "No se pudo registrar el evento." }, { status: 500 });
  }
}

