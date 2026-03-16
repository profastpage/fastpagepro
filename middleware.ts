import { NextRequest, NextResponse } from "next/server";
import { canAccessFeature, SubscriptionFeature } from "@/lib/permissions";
import {
  SUBSCRIPTION_SESSION_COOKIE,
  verifySubscriptionSessionToken,
} from "@/lib/subscription/sessionToken";

type Guard = {
  pattern: RegExp;
  feature: SubscriptionFeature;
  mode: "api" | "page";
};

const GUARDS: Guard[] = [
  { pattern: /^\/api\/ai(?:\/|$)/, feature: "aiOptimization", mode: "api" },
  { pattern: /^\/metrics(?:\/|$)/, feature: "basicMetrics", mode: "page" },
  { pattern: /^\/api\/metrics(?:\/|$)/, feature: "basicMetrics", mode: "api" },
  { pattern: /^\/builder(?:\/|$)/, feature: "clonerAccess", mode: "page" },
  { pattern: /^\/templates(?:\/|$)/, feature: "clonerAccess", mode: "page" },
  { pattern: /^\/cloner\/web(?:\/|$)/, feature: "clonerAccess", mode: "page" },
  { pattern: /^\/dashboard\/domain(?:\/|$)/, feature: "customDomain", mode: "page" },
  { pattern: /^\/dashboard\/team(?:\/|$)/, feature: "multiUser", mode: "page" },
  { pattern: /^\/dashboard\/branding(?:\/|$)/, feature: "removeBranding", mode: "page" },
  { pattern: /^\/dashboard\/optimizacion(?:\/|$)/, feature: "conversionOptimizationAdvanced", mode: "page" },
];

const EXCLUDED_PATHS = ["/dashboard/billing", "/api/subscription/"];
const ACTIVE_ONLY_PATHS: RegExp[] = [];

const DEFAULT_CANONICAL_HOST = "www.fastpagepro.com";
const DEFAULT_ALLOWED_PUBLIC_HOSTS = ["www.fastpagepro.com", "fastpagepro.com"];
const VERCEL_HOST_SUFFIXES = [".vercel.app", ".vercel.sh"];

function normalizeHost(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return "";
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  return withoutProtocol.split("/")[0]?.split(",")[0]?.trim().split(":")[0] || "";
}

function resolveCurrentHost(request: NextRequest): string {
  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return hostHeader.split(",")[0]?.trim().split(":")[0]?.toLowerCase() || "";
}

function resolveCanonicalHost(): string {
  return (
    String(process.env.NEXT_PUBLIC_AUTH_CANONICAL_HOST || DEFAULT_CANONICAL_HOST)
      .trim()
      .toLowerCase() || DEFAULT_CANONICAL_HOST
  );
}

function resolveAllowedPublicHosts(): Set<string> {
  const canonical = resolveCanonicalHost();
  const aliases = String(process.env.NEXT_PUBLIC_AUTH_ALIAS_HOSTS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const vercelHosts = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
  ]
    .map((value) => normalizeHost(String(value || "")))
    .filter((value) => VERCEL_HOST_SUFFIXES.some((suffix) => value.endsWith(suffix)));

  return new Set([...DEFAULT_ALLOWED_PUBLIC_HOSTS, canonical, ...aliases, ...vercelHosts]);
}

function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = resolveCurrentHost(request);

  if (process.env.NODE_ENV === "production" && host && !isLocalHost(host)) {
    const allowedHosts = resolveAllowedPublicHosts();
    if (!allowedHosts.has(host)) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Host no permitido" }, { status: 403 });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.host = resolveCanonicalHost();
      redirectUrl.protocol = "https:";
      return NextResponse.redirect(redirectUrl, 308);
    }
  }

  if (EXCLUDED_PATHS.some((entry) => path.startsWith(entry))) {
    return NextResponse.next();
  }

  const guard = GUARDS.find((entry) => entry.pattern.test(path));
  const activeOnlyGuard = ACTIVE_ONLY_PATHS.some((entry) => entry.test(path));
  if (!guard && !activeOnlyGuard) {
    return NextResponse.next();
  }

  const secret = process.env.SUBSCRIPTION_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SUBSCRIPTION_SESSION_COOKIE)?.value || "";
  const payload = token ? await verifySubscriptionSessionToken(token, secret) : null;
  const userPlan = payload?.plan || "FREE";
  const isActive = payload?.status === "ACTIVE" && new Date(payload.endDate).getTime() > Date.now();
  const hasFeature = guard ? isActive && canAccessFeature(userPlan, guard.feature) : false;

  if (activeOnlyGuard && payload && !isActive) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Suscripcion expirada. Renueva en Billing para reactivar funciones.",
        },
        { status: 403 },
      );
    }
    const billingUrl = request.nextUrl.clone();
    billingUrl.pathname = "/dashboard/billing";
    return NextResponse.redirect(billingUrl);
  }

  if (!guard || hasFeature) {
    return NextResponse.next();
  }

  if (guard.mode === "api") {
    return NextResponse.json(
      {
        error: `Feature bloqueada: ${guard.feature}. Actualiza a BUSINESS o PRO.`,
      },
      { status: 403 },
    );
  }

  const billingUrl = request.nextUrl.clone();
  billingUrl.pathname = "/dashboard/billing";
  billingUrl.searchParams.set("requiredFeature", guard.feature);
  return NextResponse.redirect(billingUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
