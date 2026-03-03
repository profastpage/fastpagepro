import { NextRequest, NextResponse } from "next/server";

function normalizeHost(value: string | null): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function resolveAffiliateAlias(host: string, affiliatesDomain: string): string {
  if (!host || !affiliatesDomain) return "";
  if (host === affiliatesDomain) return "";
  const suffix = `.${affiliatesDomain}`;
  if (!host.endsWith(suffix)) return "";
  const alias = host.slice(0, -suffix.length).split(".")[0] || "";
  return alias
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function middleware(request: NextRequest) {
  const affiliatesDomain = normalizeHost(process.env.NEXT_PUBLIC_REFERRAL_AFFILIATES_DOMAIN || "");
  if (!affiliatesDomain) return NextResponse.next();

  const host = normalizeHost(request.headers.get("host"));
  const alias = resolveAffiliateAlias(host, affiliatesDomain);
  if (!alias) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const isStaticAsset = pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".");
  if (isStaticAsset) return NextResponse.next();
  if (pathname.startsWith("/afiliados/")) return NextResponse.next();

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/afiliados/${alias}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
