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
};

export default async function AffiliateAliasPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const alias = String(resolvedParams?.alias || "").trim();
  if (!alias) {
    redirect("/signup");
  }

  try {
    const resolved = await resolveReferralAlias(alias);
    if (resolved?.alias) {
      redirect(
        `/signup?ref=${encodeURIComponent(resolved.alias)}&af=${encodeURIComponent(resolved.alias)}&lockRef=1`,
      );
    }
  } catch {
    // Ignore and fall back to signup without code.
  }

  redirect(`/signup?af=${encodeURIComponent(alias)}`);
}
