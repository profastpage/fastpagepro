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
  { pattern: /^\/builder(?:\/|$)/, feature: "fullStore", mode: "page" },
  { pattern: /^\/templates(?:\/|$)/, feature: "fullStore", mode: "page" },
  { pattern: /^\/store(?:\/|$)/, feature: "fullStore", mode: "page" },
  { pattern: /^\/cloner\/web(?:\/|$)/, feature: "clonerAccess", mode: "page" },
  { pattern: /^\/dashboard\/domain(?:\/|$)/, feature: "customDomain", mode: "page" },
  { pattern: /^\/dashboard\/team(?:\/|$)/, feature: "multiUser", mode: "page" },
  { pattern: /^\/dashboard\/branding(?:\/|$)/, feature: "removeBranding", mode: "page" },
  { pattern: /^\/dashboard\/optimizacion(?:\/|$)/, feature: "conversionOptimizationAdvanced", mode: "page" },
];

const EXCLUDED_PATHS = ["/dashboard/billing", "/api/subscription/"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (EXCLUDED_PATHS.some((entry) => path.startsWith(entry))) {
    return NextResponse.next();
  }

  const guard = GUARDS.find((entry) => entry.pattern.test(path));
  if (!guard) {
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
  const hasFeature = isActive && canAccessFeature(userPlan, guard.feature);

  if (hasFeature) {
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
