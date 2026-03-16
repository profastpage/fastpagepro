"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useLandingLanguage } from "@/context/LandingLanguageContext";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "51919662011";

const COPY = {
  es: {
    description:
      "Agencia digital especializada en sistemas web premium para reservas, consultas y ventas por WhatsApp.",
    portfolio: "Ejemplos",
    demos: "Demos",
    pricing: "Precios",
    process: "Proceso",
    whatsapp: "WhatsApp",
    login: "Acceder",
    rights: "Todos los derechos reservados.",
  },
  en: {
    description:
      "Digital agency specialized in premium web systems for bookings, inquiries and WhatsApp sales.",
    portfolio: "Work",
    demos: "Demos",
    pricing: "Pricing",
    process: "Process",
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
      ? "Hello, I want to request a premium web system for bookings and WhatsApp sales."
      : "Hola, quiero cotizar un sistema web premium para reservas y ventas por WhatsApp.",
  );

  return (
    <footer className="relative border-t border-white/10 bg-[#0B0B0B]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-white">FASTPAGEPRO</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500">Agencia digital</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-400">{copy.description}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a227]">Navegacion</p>
              <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-zinc-400">
                <a href="#portfolio" className="transition hover:text-white">
                  {copy.portfolio}
                </a>
                <a href="#proceso" className="transition hover:text-white">
                  {copy.process}
                </a>
                <a href="/restaurantes#precios" className="transition hover:text-white">
                  {copy.pricing}
                </a>
                <Link href="/auth?tab=login" prefetch={false} className="transition hover:text-white">
                  {copy.login}
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a227]">Contacto</p>
              <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-zinc-400">
                <Link href="/demo" prefetch={false} className="transition hover:text-white">
                  {copy.demos}
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="transition hover:text-white">
                  {copy.whatsapp}
                </a>
                <a href="/restaurantes" className="transition hover:text-white">
                  FastPagePro Restaurantes
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-xs text-zinc-500">
          {"\u00A9"} {year} FastPagePro. {copy.rights}
        </div>
      </div>
    </footer>
  );
}
