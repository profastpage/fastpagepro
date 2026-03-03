import { redirect } from "next/navigation";
import { resolveReferralAlias } from "@/lib/referrals/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    alias: string;
  };
};

export default async function AffiliateAliasPage({ params }: PageProps) {
  const alias = String(params?.alias || "").trim();
  if (!alias) {
    redirect("/signup");
  }

  try {
    const resolved = await resolveReferralAlias(alias);
    if (resolved?.referralCode) {
      redirect(
        `/signup?ref=${encodeURIComponent(resolved.referralCode)}&af=${encodeURIComponent(resolved.alias)}`,
      );
    }
  } catch {
    // Ignore and fall back to signup without code.
  }

  redirect(`/signup?af=${encodeURIComponent(alias)}`);
}
