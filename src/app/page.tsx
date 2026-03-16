import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Coffee,
  Hotel,
  Palette,
  Rocket,
  Search,
  ShoppingBag,
  Stethoscope,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FastPagePro | Sistemas web premium para negocios",
  description:
    "FastPagePro disena sistemas web premium para restaurantes, hoteles, tiendas y negocios de servicios, con foco en conversion, velocidad y WhatsApp.",
  openGraph: {
    title: "FastPagePro | Sistemas web premium para negocios",
    description:
      "Creamos sistemas web premium para negocios que quieren captar reservas, pedidos y clientes por WhatsApp.",
    type: "website",
    url: "https://www.fastpagepro.com",
    siteName: "FastPagePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastPagePro | Sistemas web premium para negocios",
    description:
      "Paginas web y sistemas hechos a medida para vender por WhatsApp.",
  },
  alternates: {
    canonical: "https://www.fastpagepro.com",
  },
};

type IndustryItem = {
  label: string;
  icon: LucideIcon;
};

type PortfolioItem = {
  name: string;
  businessType: string;
  href: string;
  accent: string;
  surface: string;
  metrics: string[];
};

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const INDUSTRIES: IndustryItem[] = [
  { label: "Hoteles", icon: Hotel },
  { label: "Restaurantes", icon: UtensilsCrossed },
  { label: "Cafeterias", icon: Coffee },
  { label: "Tiendas", icon: ShoppingBag },
  { label: "Empresas", icon: Building2 },
  { label: "Clinicas", icon: Stethoscope },
];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: "Hotel Vuelo78",
    businessType: "Hotel premium",
    href: "/demo/services/estate-prime",
    accent: "rgba(212, 175, 55, 0.9)",
    surface: "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.22), transparent 40%), linear-gradient(180deg, #171717 0%, #0f1012 100%)",
    metrics: ["Reservas directas", "Suite showcase", "WhatsApp concierge"],
  },
  {
    name: "Restaurante Demo",
    businessType: "Carta digital",
    href: "/restaurantes",
    accent: "rgba(255, 132, 76, 0.9)",
    surface: "radial-gradient(circle at 80% 10%, rgba(255,132,76,0.18), transparent 34%), linear-gradient(180deg, #151515 0%, #101112 100%)",
    metrics: ["Menu visual", "Pedidos por chat", "CTA rapido"],
  },
  {
    name: "Cafeteria Moderna",
    businessType: "Landing comercial",
    href: "/demo/restaurant/coffee-route",
    accent: "rgba(122, 197, 169, 0.9)",
    surface: "radial-gradient(circle at 18% 20%, rgba(122,197,169,0.18), transparent 36%), linear-gradient(180deg, #151618 0%, #0f1011 100%)",
    metrics: ["Branding limpio", "Promos del dia", "Mobile first"],
  },
  {
    name: "Empresa Corporativa",
    businessType: "Servicios B2B",
    href: "/demo/services/consultoria-pro",
    accent: "rgba(126, 166, 255, 0.92)",
    surface: "radial-gradient(circle at 78% 18%, rgba(126,166,255,0.18), transparent 36%), linear-gradient(180deg, #121315 0%, #0d0e10 100%)",
    metrics: ["Autoridad visual", "Leads calificados", "Proceso consultivo"],
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Analizamos tu negocio",
    description: "Entendemos tu oferta, tus clientes y la accion comercial que debe dominar la pagina.",
    icon: Search,
  },
  {
    step: "02",
    title: "Disenamos tu web profesional",
    description: "Construimos una interfaz clara, premium y optimizada para transmitir confianza de inmediato.",
    icon: Palette,
  },
  {
    step: "03",
    title: "Publicamos tu sistema online",
    description: "Dejamos la web lista en produccion, conectada y preparada para operar sin friccion.",
    icon: Rocket,
  },
  {
    step: "04",
    title: "Empiezas a recibir clientes",
    description: "La experiencia queda enfocada en consultas, reservas o ventas por WhatsApp y formularios.",
    icon: TrendingUp,
  },
];

function PortfolioPreview({
  accent,
  surface,
  businessType,
  metrics,
}: Pick<PortfolioItem, "accent" | "surface" | "businessType" | "metrics">) {
  return (
    <div className="portfolio-preview" style={{ background: surface } as CSSProperties}>
      <div className="portfolio-preview__chrome">
        <span />
        <span />
        <span />
      </div>
      <div className="portfolio-preview__hero">
        <div>
          <div className="portfolio-preview__eyebrow" style={{ color: accent }}>
            FastPagePro
          </div>
          <div className="portfolio-preview__headline">{businessType}</div>
        </div>
        <div className="portfolio-preview__badge" style={{ borderColor: accent, color: accent }}>
          Online
        </div>
      </div>
      <div className="portfolio-preview__grid">
        <div className="portfolio-preview__panel portfolio-preview__panel--large">
          <div className="portfolio-preview__line portfolio-preview__line--strong" />
          <div className="portfolio-preview__line" />
          <div className="portfolio-preview__line portfolio-preview__line--short" />
        </div>
        <div className="portfolio-preview__stack">
          {metrics.map((metric) => (
            <div key={metric} className="portfolio-preview__panel">
              <div className="portfolio-preview__metric-dot" style={{ background: accent }} />
              <span>{metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-[#0b0b0c] text-white">
      <section className="hero-landing relative z-10 min-h-[90vh] w-full pt-[90px]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#c9a227] sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#c9a227]" />
              FastPagePro
            </div>
            <h1 className="hero-title mt-6 max-w-4xl text-white">
              Sistemas web premium para negocios que venden en serio
            </h1>
            <p className="hero-subtitle mt-6 text-white/80">
              FastPagePro organiza la oferta principal de la marca y separa cada vertical comercial en su
              propia landing para escalar conversion de forma limpia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/restaurantes"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/60 bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B] transition hover:bg-[#1fba59]"
              >
                Ver landing restaurantes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                Ver demos
              </Link>
              <Link
                href="/auth?tab=login"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                Acceder al panel
              </Link>
            </div>
            <ul className="mt-10 space-y-3 text-white/80">
              <li className="text-[18px]">Diseno profesional</li>
              <li className="text-[18px]">Optimizado para celular</li>
              <li className="text-[18px]">Integracion con WhatsApp</li>
              <li className="text-[18px]">Activacion rapida</li>
            </ul>
          </div>

          <div className="hero-mockup mx-auto w-full max-w-[540px]">
            <div className="rounded-[14px] border border-white/12 bg-black/35 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c9a227]">
                Arquitectura comercial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
                Una marca principal, varias landings por vertical
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-300">
                La homepage presenta FastPagePro como sistema web premium. Cada sector vive en una ruta
                propia para claridad de conversion y mensaje.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-200">
                <li>Arquitectura modular para cada vertical.</li>
                <li>Narrativa visual premium con foco comercial.</li>
                <li>Velocidad y mensajeria directa con WhatsApp.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 rounded-[32px] border border-white/8 bg-white/[0.02] px-6 py-10 backdrop-blur-sm sm:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Soluciones web para negocios modernos
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center justify-items-center gap-10">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.label}
                  className="industry-mark group flex min-w-0 flex-col items-center gap-3 text-center text-white/70"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium tracking-[0.02em]">{industry.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Portfolio
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Ejemplos de sistemas web
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Paginas web modernas creadas para negocios reales.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
            {PORTFOLIO_ITEMS.map((item) => (
              <article key={item.name} className="portfolio-card">
                <PortfolioPreview
                  accent={item.accent}
                  surface={item.surface}
                  businessType={item.businessType}
                  metrics={item.metrics}
                />
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{item.name}</h3>
                      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-zinc-500">
                        {item.businessType}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="mt-8 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Ver demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Proceso
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Como creamos tu sistema web
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.step}
                  className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0f0f10] p-[30px]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#c9a227]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
