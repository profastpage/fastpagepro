"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import GuestSupportWidget from "@/components/GuestSupportWidget";

export default function FloatingControls() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const isPublicBio = pathname?.startsWith("/bio/");
  const isDemoRoute = pathname === "/demo" || pathname?.startsWith("/demo/");

  useEffect(() => {
    setMounted(true);
    if (isPublicBio) {
      setShowScrollTop(false);
      return;
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPublicBio]);

  if (!mounted) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const wrapperClass = isPublicBio
    ? "fixed bottom-3 right-3 z-[80] flex flex-col gap-2"
    : "fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-50";
  const scrollTopClass = isDemoRoute
    ? "fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+5.6rem)] md:left-6 md:bottom-6 z-[90] p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-110 transition-all group animate-fade-in"
    : "p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-110 transition-all group animate-fade-in";

  return (
    <div className={wrapperClass}>
      {/* Scroll to Top */}
      {!isPublicBio && showScrollTop && (
        <button
          onClick={scrollToTop}
          className={scrollTopClass}
          aria-label={t("floating.scrollTop")}
        >
          <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
        </button>
      )}

      {!isPublicBio && <GuestSupportWidget />}

    </div>
  );
}
