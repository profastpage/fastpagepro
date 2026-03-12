import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";
import {
  createSubscriptionSessionToken,
  SUBSCRIPTION_SESSION_COOKIE,
} from "@/lib/subscription/sessionToken";

const SESSION_TTL_SECONDS = 60 * 60 * 12;
const DEFAULT_COOKIE_BASE_DOMAINS = ["fastpagepro.com"];

function resolveCookieDomain(request: NextRequest): string | undefined {
  const envDomains = String(process.env.SUBSCRIPTION_COOKIE_BASE_DOMAINS || "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
  const baseDomains = envDomains.length ? envDomains : DEFAULT_COOKIE_BASE_DOMAINS;

  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = hostHeader.split(",")[0]?.trim().split(":")[0]?.toLowerCase();
  if (!host) return undefined;

  for (const baseDomain of baseDomains) {
    if (host === baseDomain || host.endsWith(`.${baseDomain}`)) {
      return `.${baseDomain}`;
    }
  }

  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireFirebaseUserId(request);
    const summary = await buildSubscriptionSummary(userId);
    const secret = process.env.SUBSCRIPTION_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

    if (!secret) {
      return NextResponse.json({
        success: true,
        plan: summary.plan,
        status: summary.status,
        endDate: summary.endDate,
        warning: "SESSION_COOKIE_DISABLED",
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await createSubscriptionSessionToken(
      {
        userId,
        plan: summary.plan,
        status: summary.status,
        endDate: summary.endDate,
        iat: now,
        exp: now + SESSION_TTL_SECONDS,
      },
      secret,
    );

    const response = NextResponse.json({
      success: true,
      plan: summary.plan,
      status: summary.status,
      endDate: summary.endDate,
    });
    const cookieDomain = resolveCookieDomain(request);

    response.cookies.set(SUBSCRIPTION_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    return response;
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticación no disponible" }, { status: 503 });
    }
    console.error("[Subscription Session] Error:", error);
    return NextResponse.json({ error: "No se pudo crear sesión de suscripción" }, { status: 500 });
  }
}
