import { redirect } from "next/navigation";
import { resolveReferralAlias } from "@/lib/referrals/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params:
    | {
        alias: string;
      }
    | Promise<{
        alias: string;
      }>;
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

function pickSearchParam(
  source: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = source[key];
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
}

export default async function AffiliateAliasPage({ params, searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams || {});
  const alias = String(resolvedParams?.alias || "").trim();
  if (!alias) {
    redirect("/auth?tab=register");
  }

  const nextParams = new URLSearchParams();
  nextParams.set("tab", "register");

  const passthroughKeys = [
    "vertical",
    "plan",
    "demoSlug",
    "demoTheme",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  for (const key of passthroughKeys) {
    const value = pickSearchParam(resolvedSearchParams, key);
    if (value) nextParams.set(key, value);
  }

  try {
    const resolved = await resolveReferralAlias(alias);
    if (resolved?.alias) {
      const lockedCode = String(resolved.referralCode || resolved.alias || "").trim();
      if (lockedCode) nextParams.set("ref", lockedCode);
      nextParams.set("af", String(resolved.alias || "").trim());
      nextParams.set("lockRef", "1");
      redirect(`/auth?${nextParams.toString()}`);
    }
  } catch {
    // Ignore and fall back to register without locked referral.
  }

  redirect(`/auth?${nextParams.toString()}`);
}
