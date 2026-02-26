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
  compactMobileLeft?: boolean;
};

export default function StickyCTA({
  vertical,
  slug,
  hideOnMobile = false,
  mobileBottomClass = "bottom-3",
  compactMobileLeft = false,
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
      className={`fixed z-40 md:bottom-5 ${
        compactMobileLeft
          ? "left-3 right-[5.1rem] md:inset-x-0 md:px-3"
          : "left-3 right-3 md:inset-x-0 md:px-3"
      } ${mobileBottomClass} ${hideOnMobile ? "hidden md:block" : ""}`}
    >
      <div
        className={`mx-auto flex overflow-hidden border border-amber-300/35 bg-black/90 backdrop-blur-md md:max-w-3xl md:flex-row md:items-center md:justify-between ${
          compactMobileLeft
            ? "max-w-none flex-col gap-1 rounded-xl p-2"
            : "max-w-3xl flex-col gap-2 rounded-2xl p-3"
        }`}
      >
        <p className={`${compactMobileLeft ? "text-[11px]" : "text-sm"} font-semibold text-zinc-200`}>
          Demo lista. {compactMobileLeft ? "Crea tu version gratis" : copy.signupCta}
        </p>
        <div
          className={`grid w-full gap-2 ${compactMobileLeft ? "grid-cols-2" : "grid-cols-1"} md:w-auto md:grid-cols-2`}
        >
          <Link
            href={targetPrimary}
            onClick={() =>
              void trackGrowthEvent("click_cta_signup", {
                vertical,
                slug,
                location: "sticky_primary",
              })
            }
            className={`inline-flex w-full items-center justify-center rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-center font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 ${
              compactMobileLeft ? "px-2 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
            }`}
          >
            {compactMobileLeft ? "Quiero esta version" : "Quiero esta version para mi negocio"}
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
            className={`inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 text-center font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/45 hover:bg-amber-300/10 ${
              compactMobileLeft ? "px-2 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
            }`}
          >
            Probar gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
