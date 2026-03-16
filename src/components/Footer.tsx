"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useLandingLanguage } from "@/context/LandingLanguageContext";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "51919662011";

const COPY = {
  es: {
    description: "Sistemas web premium para negocios que quieren vender por WhatsApp.",
    demos: "Demos",
    pricing: "Precios",
    whatsapp: "WhatsApp",
    login: "Acceder",
    rights: "Todos los derechos reservados.",
  },
  en: {
    description: "Premium web systems for businesses that want to sell through WhatsApp.",
    demos: "Demos",
    pricing: "Pricing",
    whatsapp: "WhatsApp",
    login: "Login",
    rights: "All rights reserved.",
  },
} as const;

export default function Footer() {
  const { language } = useLandingLanguage();
  const locale = language === "en" ? "en" : "es";
  const copy = COPY[locale];
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsappSendUrl(
    WHATSAPP_NUMBER,
    locale === "en"
      ? "Hello, I want to request a quote for a premium web system for my business."
      : "Hola, quiero cotizar un sistema web premium para mi negocio.",
  );

  return (
    <footer className="relative border-t border-white/10 bg-[#0B0B0B]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-white">FASTPAGEPRO</p>
              <p className="mt-1 text-sm text-zinc-400">{copy.description}</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
            <a href="#demos" className="transition hover:text-white">
              {copy.demos}
            </a>
            <a href="#precios" className="transition hover:text-white">
              {copy.pricing}
            </a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="transition hover:text-white">
              {copy.whatsapp}
            </a>
            <Link href="/auth?tab=login" prefetch={false} className="transition hover:text-white">
              {copy.login}
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-5 text-xs text-zinc-500">
          {"\u00A9"} {year} FastPagePro. {copy.rights}
        </div>
      </div>
    </footer>
  );
}
