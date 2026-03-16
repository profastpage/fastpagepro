import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Hotel,
  Store,
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

const VERTICALS = [
  {
    title: "Restaurantes",
    description: "Cartas digitales, pedidos por WhatsApp y landings comerciales para trafico frio.",
    href: "/restaurantes",
    icon: UtensilsCrossed,
  },
  {
    title: "Hoteles",
    description: "Experiencias de reserva con narrativa premium y contacto directo por WhatsApp.",
    href: "/demo/services/estate-prime",
    icon: Hotel,
  },
  {
    title: "Tiendas",
    description: "Catalogos ligeros, escaparates de campana y recorridos de compra centrados en chat.",
    href: "/demo/store/urban-wear",
    icon: Store,
  },
  {
    title: "Servicios",
    description: "Paginas de autoridad para consultas, reuniones y leads con mejor posicionamiento.",
    href: "/demo/services/consultoria-pro",
    icon: BriefcaseBusiness,
  },
] as const;

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
              <li className="text-[18px]">✔ Diseño profesional</li>
              <li className="text-[18px]">✔ Optimizado para celular</li>
              <li className="text-[18px]">✔ Integración con WhatsApp</li>
              <li className="text-[18px]">✔ Activación rápida</li>
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
                propia para claridad de conversión y mensaje.
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

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            Verticales activas
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Cada tipo de negocio entra por una pagina mas precisa
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            La primera vertical separada es restaurantes. Las demas quedan listas para crecer como landings
            independientes sin rehacer la home principal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {VERTICALS.map((vertical) => {
            const Icon = vertical.icon;
            return (
              <article
                key={vertical.title}
                className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/45 text-[#f1ddb5]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                  {vertical.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{vertical.description}</p>
                <Link
                  href={vertical.href}
                  prefetch={false}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#25D366]/40 hover:bg-[#25D366]/10"
                >
                  Abrir
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
