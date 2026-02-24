"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingControls() {
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const isPublicBio = pathname?.startsWith("/bio/");

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

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const wrapperClass = isPublicBio
    ? "fixed bottom-3 right-3 z-[80] flex flex-col gap-2"
    : "fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-50";

  const languageButtonClass = isPublicBio
    ? "h-9 w-9 rounded-full bg-zinc-950/90 border border-white/20 shadow-xl transition-all hover:scale-105 flex items-center justify-center"
    : "px-2 py-1 md:px-3 md:py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center group";

  return (
    <div className={wrapperClass}>
      {/* Scroll to Top */}
      {!isPublicBio && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-110 transition-all group animate-fade-in"
          aria-label={t("floating.scrollTop")}
        >
          <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
        </button>
      )}

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={languageButtonClass}
        aria-label={t("floating.toggleLanguage")}
      >
        <span className={`font-bold text-white transition-colors ${isPublicBio ? "text-[11px]" : "text-[10px] md:text-xs group-hover:text-yellow-400"}`}>
          {language === "es" ? "EN" : "ES"}
        </span>
      </button>
    </div>
  );
}
