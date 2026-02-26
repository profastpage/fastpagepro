"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trackGrowthEvent } from "@/lib/analytics";
import { getVerticalCopy, verticalToCreateHref, verticalToSignupHref, type BusinessVertical } from "@/lib/vertical";

type StickyCTAProps = {
  vertical: BusinessVertical;
  slug?: string;
  hideOnMobile?: boolean;
  mobileBottomClass?: string;
};

export default function StickyCTA({
  vertical,
  slug,
  hideOnMobile = false,
  mobileBottomClass = "bottom-3",
}: StickyCTAProps) {
  const { user } = useAuth();
  const copy = getVerticalCopy(vertical);

  const targetPrimary = useMemo(
    () => (user ? verticalToCreateHref(vertical) : verticalToSignupHref(vertical)),
    [user, vertical],
  );
  const targetSecondary = useMemo(() => verticalToSignupHref(vertical), [vertical]);

  return (
    <div
      className={`fixed inset-x-0 z-40 px-3 md:bottom-5 ${mobileBottomClass} ${hideOnMobile ? "hidden md:block" : ""}`}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2 overflow-hidden rounded-2xl border border-amber-300/35 bg-black/90 p-3 backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-zinc-200">
          Demo lista. {copy.signupCta}
        </p>
        <div className="grid w-full grid-cols-1 gap-2 md:w-auto md:grid-cols-2">
          <Link
            href={targetPrimary}
            onClick={() =>
              void trackGrowthEvent("click_cta_signup", {
                vertical,
                slug,
                location: "sticky_primary",
              })
            }
            className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110"
          >
            Quiero esta version para mi negocio
          </Link>
          <Link
            href={targetSecondary}
            onClick={() =>
              void trackGrowthEvent("start_signup", {
                vertical,
                slug,
                location: "sticky_secondary",
              })
            }
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
          >
            Probar gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
