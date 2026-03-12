import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "view_demo",
  "click_demo_open",
  "click_cta_signup",
  "start_signup",
  "signup_complete",
  "click_whatsapp",
]);

function normalizeText(value: unknown, max = 140) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = normalizeText(body?.event || body?.type || "", 60);
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ error: "Evento no permitido" }, { status: 400 });
    }

    const payload = {
      event,
      path: normalizeText(body?.path, 160),
      href: normalizeText(body?.href, 260),
      vertical: normalizeText(body?.vertical, 40),
      slug: normalizeText(body?.slug, 80),
      utm_source: normalizeText(body?.utm_source, 80),
      utm_campaign: normalizeText(body?.utm_campaign, 120),
      utm_content: normalizeText(body?.utm_content, 120),
      ts: Number(body?.ts || Date.now()),
      createdAt: Date.now(),
      userAgent: normalizeText(request.headers.get("user-agent"), 220),
      referer: normalizeText(request.headers.get("referer"), 220),
      ip:
        normalizeText(request.headers.get("x-forwarded-for"), 120) ||
        normalizeText(request.headers.get("x-real-ip"), 120),
    };

    if (adminDb) {
      await adminDb.collection("growth_events").add(payload);
    } else if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[growth_events:fallback]", payload);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "No se pudo registrar evento", details: error?.message },
      { status: 500 },
    );
  }
}
