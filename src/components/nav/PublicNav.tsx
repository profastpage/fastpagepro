"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, MessageCircle, X, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLandingLanguage } from "@/context/LandingLanguageContext";
import { trackGrowthEvent } from "@/lib/analytics";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "51919662011";

const COPY = {
  es: {
    studio: "Estudio web premium",
    demos: "Ver demos",
    pricing: "Precios",
    whatsapp: "Solicitar sistema",
    login: "Acceder",
    menu: "Abrir menu",
    close: "Cerrar menu",
  },
  en: {
    studio: "Premium web studio",
    demos: "View demos",
    pricing: "Pricing",
    whatsapp: "Request system",
    login: "Login",
    menu: "Open menu",
    close: "Close menu",
  },
} as const;

function getLocale(language: string) {
  return language === "en" ? "en" : "es";
}

export default function PublicNav() {
  const pathname = usePathname();
  const { language, setLanguage } = useLandingLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const locale = getLocale(language);
  const copy = COPY[locale];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const whatsappHref = useMemo(
    () =>
      buildWhatsappSendUrl(
        WHATSAPP_NUMBER,
        locale === "en"
          ? "Hello, I want to request a quote for a premium web system for my business."
          : "Hola, quiero cotizar un sistema web premium para mi negocio.",
      ),
    [locale],
  );

  const handleWhatsappClick = (location: string) => {
    void trackGrowthEvent("click_whatsapp", {
      vertical: "services",
      slug: "homepage_nav",
      location,
    });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[rgba(11,11,11,0.86)] px-4 py-3 shadow-[0_24px_60px_-34px_rgba(0,0,0,0.92)] backdrop-blur-xl">
          <Link href="/" prefetch={false} className="flex items-center gap-3" aria-label="FastPagePro Home">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
              <Zap className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase tracking-[0.24em] text-white">
                FASTPAGEPRO
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {copy.studio}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <a href="#demos" className="text-sm font-semibold text-zinc-300 transition hover:text-white">
              {copy.demos}
            </a>
            <a href="#precios" className="text-sm font-semibold text-zinc-300 transition hover:text-white">
              {copy.pricing}
            </a>
            <Link
              href="/auth?tab=login"
              prefetch={false}
              className="text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              {copy.login}
            </Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setLanguage(locale === "en" ? "es" : "en")}
              className="inline-flex h-10 min-w-[2.75rem] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-white/20 hover:text-white"
              aria-label="Toggle language"
            >
              {locale === "en" ? "ES" : "EN"}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleWhatsappClick("nav_desktop")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/60 bg-[#25D366] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B] transition hover:bg-[#1fba59]"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.whatsapp}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setLanguage(locale === "en" ? "es" : "en")}
              className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-200"
              aria-label="Toggle language"
            >
              {locale === "en" ? "ES" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
              aria-label={isOpen ? copy.close : copy.menu}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-3 top-20 rounded-[2rem] border border-white/10 bg-[#090909] p-5 shadow-[0_30px_80px_-44px_rgba(0,0,0,0.95)]">
            <div className="flex flex-col gap-3">
              <a
                href="#demos"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.demos}
              </a>
              <a
                href="#precios"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.pricing}
              </a>
              <Link
                href="/auth?tab=login"
                prefetch={false}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.login}
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsappClick("nav_mobile")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/60 bg-[#25D366] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B]"
              >
                <MessageCircle className="h-4 w-4" />
                {copy.whatsapp}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
