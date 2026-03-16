"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Globe2,
  Hotel,
  MessageCircle,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Footer from "@/components/Footer";
import DemoImage from "@/components/demo/DemoImage";
import { useLandingLanguage } from "@/context/LandingLanguageContext";
import { persistUtmFromUrl, trackGrowthEvent } from "@/lib/analytics";
import { getDemoUrl } from "@/lib/demoRouting";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "51919662011";

type Locale = "es" | "en";

type SectorCard = {
  key: string;
  title: string;
  description: string;
  href: string;
  image: string;
  icon: LucideIcon;
};

type ProcessStep = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type BenefitItem = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type PricingPlan = {
  key: string;
  name: string;
  label: string;
  summary: string;
  features: string[];
  accent: string;
};

const COPY = {
  es: {
    hero: {
      eyebrow: "FASTPAGEPRO",
      badge: "Pago unico. Diseno premium. WhatsApp integrado.",
      title: "Sistemas web que generan clientes por WhatsApp",
      description:
        "Creamos paginas web profesionales para hoteles, restaurantes, tiendas y servicios. Tu negocio vende con una presencia moderna, rapida y lista para convertir.",
      note:
        "La homepage deja de vender un SaaS DIY publico y pasa a presentar un servicio hecho a medida usando la base actual del proyecto.",
      primaryCta: "Solicitar mi pagina web",
      secondaryCta: "Ver demos",
      loginCta: "Acceder al panel",
      benefits: [
        "Diseno profesional",
        "Optimizado para celular",
        "Integracion con WhatsApp",
        "Activacion rapida",
      ],
      highlights: [
        "Reservas directas para hoteles",
        "Pedidos por WhatsApp para restaurantes",
        "Catalogos que convierten para tiendas",
        "Landing pages que captan clientes para servicios",
      ],
      showcaseLabel: "Muestras listas para adaptar",
      showcaseTitle: "Base premium reutilizable, personalizada y enfocada en resultados.",
      showcaseDescription:
        "Cada entrega se apoya en la base actual de FastPagePro, pero con copy, composicion y CTA pensados para el negocio del cliente.",
      mockupDesktop: "Vista principal",
      mockupPhoneOne: "Reservas",
      mockupPhoneTwo: "WhatsApp",
      industriesLine: "Hoteles, restaurantes, tiendas y negocios de servicios.",
    },
    sections: {
      sectorsEyebrow: "Sistemas por rubro",
      sectorsTitle: "Demos premium para distintos tipos de negocio",
      sectorsDescription:
        "Usamos la base actual para acelerar entregas, pero cada proyecto se adapta al tipo de cliente que quieres captar.",
      sectorsFootnote:
        "Si tu rubro no aparece aqui, adaptamos la estructura a tu flujo comercial.",
      stepsEyebrow: "Como funciona",
      stepsTitle: "Un proceso corto, claro y orientado a publicar rapido",
      stepsDescription:
        "No te damos una plataforma para aprender desde cero. Construimos contigo y entregamos una web lista para vender.",
      benefitsEyebrow: "Beneficios",
      benefitsTitle: "Todo lo que necesita tu negocio para vender mejor",
      benefitsDescription:
        "La propuesta deja de ser una herramienta generica y se convierte en un sistema web hecho para reservas, pedidos y clientes reales.",
      pricingEyebrow: "Paquetes",
      pricingTitle: "Planes orientados a pago unico",
      pricingDescription:
        "La cotizacion final depende del alcance, pero la logica es simple: desarrollamos tu sistema y queda listo para vender, sin una suscripcion SaaS publica.",
      pricingNote:
        "Incluimos soporte de lanzamiento y definimos el alcance exacto antes de iniciar.",
      finalEyebrow: "CTA final",
      finalTitle: "Convierte tu negocio en una experiencia web premium",
      finalDescription:
        "Si quieres una pagina o sistema web elegante, rapido y enfocado en generar conversaciones por WhatsApp, el siguiente paso es solicitar tu version.",
      finalButton: "Hablar por WhatsApp",
    },
    buttons: {
      viewDemo: "Ver demo",
      requestQuote: "Solicitar propuesta",
    },
    whatsappMessage:
      "Hola, quiero cotizar un sistema web premium para mi negocio con integracion a WhatsApp.",
  },
  en: {
    hero: {
      eyebrow: "FASTPAGEPRO",
      badge: "One-time payment. Premium design. WhatsApp integrated.",
      title: "Web systems that generate customers through WhatsApp",
      description:
        "We build professional websites for hotels, restaurants, stores, and service businesses. Your brand gets a modern, fast, conversion-ready digital presence.",
      note:
        "The homepage stops selling a public DIY SaaS and shifts into a done-for-you service built on top of the current project base.",
      primaryCta: "Request my website",
      secondaryCta: "View demos",
      loginCta: "Open dashboard",
      benefits: [
        "Professional design",
        "Mobile optimized",
        "WhatsApp integration",
        "Fast activation",
      ],
      highlights: [
        "Direct bookings for hotels",
        "WhatsApp orders for restaurants",
        "Storefronts that convert for shops",
        "Landing pages that attract leads for services",
      ],
      showcaseLabel: "Examples ready to adapt",
      showcaseTitle: "A premium base, reused with intention and customized for results.",
      showcaseDescription:
        "Every delivery reuses the FastPagePro foundation, then gets copy, composition, and CTA logic designed for the client business.",
      mockupDesktop: "Main view",
      mockupPhoneOne: "Bookings",
      mockupPhoneTwo: "WhatsApp",
      industriesLine: "Hotels, restaurants, stores, and service businesses.",
    },
    sections: {
      sectorsEyebrow: "Systems by vertical",
      sectorsTitle: "Premium demos for different business types",
      sectorsDescription:
        "We reuse the current base to move faster, but every delivery is adapted to the type of client you want to attract.",
      sectorsFootnote:
        "If your business type is not listed here, we adapt the structure to your commercial workflow.",
      stepsEyebrow: "How it works",
      stepsTitle: "A short, clear process focused on launching fast",
      stepsDescription:
        "We do not hand you a platform to learn from scratch. We build with you and deliver a website ready to sell.",
      benefitsEyebrow: "Benefits",
      benefitsTitle: "Everything your business needs to sell better",
      benefitsDescription:
        "The offer stops being a generic tool and becomes a web system built for real bookings, orders, and customer conversations.",
      pricingEyebrow: "Packages",
      pricingTitle: "Plans designed around one-time payment",
      pricingDescription:
        "Final pricing depends on scope, but the commercial logic is simple: we build your system and leave it ready to sell, without a public SaaS subscription.",
      pricingNote:
        "Launch support is included and the exact scope is defined before development starts.",
      finalEyebrow: "Final CTA",
      finalTitle: "Turn your business into a premium web experience",
      finalDescription:
        "If you want an elegant, fast website or web system focused on generating WhatsApp conversations, the next step is requesting your version.",
      finalButton: "Talk on WhatsApp",
    },
    buttons: {
      viewDemo: "View demo",
      requestQuote: "Request proposal",
    },
    whatsappMessage:
      "Hello, I want to request a quote for a premium web system for my business with WhatsApp integration.",
  },
} as const;

function getLocale(language: string): Locale {
  return language === "en" ? "en" : "es";
}

export default function LandingHome() {
  const { language } = useLandingLanguage();
  const locale = getLocale(language);
  const copy = COPY[locale];

  useEffect(() => {
    persistUtmFromUrl();
    void trackGrowthEvent("page_view", {
      vertical: "services",
      slug: "homepage_service_rebrand",
    });
  }, []);

  const whatsappHref = useMemo(
    () => buildWhatsappSendUrl(WHATSAPP_NUMBER, copy.whatsappMessage),
    [copy.whatsappMessage],
  );

  const sectorCards = useMemo<SectorCard[]>(
    () => [
      {
        key: "hotels",
        title: locale === "en" ? "Hotels" : "Hoteles",
        description:
          locale === "en"
            ? "Booking pages with boutique style, direct WhatsApp contact, and polished room presentation."
            : "Paginas de reservas con estilo boutique, contacto directo por WhatsApp y presentacion cuidada de habitaciones.",
        href: getDemoUrl("services", "estate-prime"),
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
        icon: Hotel,
      },
      {
        key: "restaurants",
        title: locale === "en" ? "Restaurants" : "Restaurantes",
        description:
          locale === "en"
            ? "Digital menu experiences and conversion flows that turn visits into WhatsApp orders."
            : "Experiencias tipo carta digital y flujos de conversion para pasar de visitas a pedidos por WhatsApp.",
        href: getDemoUrl("restaurant", "sushi-prime"),
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
        icon: UtensilsCrossed,
      },
      {
        key: "stores",
        title: locale === "en" ? "Stores" : "Tiendas",
        description:
          locale === "en"
            ? "Product catalogs, campaign-ready storefronts, and chat-first purchase journeys."
            : "Catalogos de productos, storefronts listos para campanas y recorridos de compra centrados en chat.",
        href: getDemoUrl("store", "urban-wear"),
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
        icon: Store,
      },
      {
        key: "services",
        title: locale === "en" ? "Services" : "Servicios",
        description:
          locale === "en"
            ? "Authority-focused landing pages built to generate consultations, meetings, and qualified leads."
            : "Landing pages de autoridad pensadas para generar consultas, reuniones y leads calificados.",
        href: getDemoUrl("services", "consultoria-pro"),
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
        icon: BriefcaseBusiness,
      },
    ],
    [locale],
  );

  const processSteps = useMemo<ProcessStep[]>(
    () => [
      {
        key: "brief",
        title:
          locale === "en"
            ? "You send us your business information"
            : "Nos envias la informacion",
        description:
          locale === "en"
            ? "Brand assets, WhatsApp number, offers, photos, references, and the action you want the client to take."
            : "Marca, numero de WhatsApp, oferta, fotos, referencias y la accion que quieres que haga tu cliente.",
        icon: Sparkles,
      },
      {
        key: "build",
        title:
          locale === "en"
            ? "We create your professional website"
            : "Creamos tu web profesional",
        description:
          locale === "en"
            ? "We adapt the base, define the visual direction, and build the sections that matter for your business."
            : "Adaptamos la base, definimos la direccion visual y construimos las secciones que mas importan para tu negocio.",
        icon: MonitorSmartphone,
      },
      {
        key: "launch",
        title:
          locale === "en"
            ? "You start receiving customers"
            : "Empiezas a recibir clientes",
        description:
          locale === "en"
            ? "The site goes live with WhatsApp integrated so your business can start capturing bookings, orders, or inquiries."
            : "Publicamos la web con WhatsApp integrado para empezar a captar reservas, pedidos o consultas.",
        icon: Rocket,
      },
    ],
    [locale],
  );

  const benefits = useMemo<BenefitItem[]>(
    () => [
      {
        key: "whatsapp",
        title: locale === "en" ? "WhatsApp integrated" : "WhatsApp integrado",
        description:
          locale === "en"
            ? "Buttons, flows, and messages designed to move the client into a conversation."
            : "Botones, flujos y mensajes pensados para llevar al cliente directo a la conversacion.",
        icon: MessageCircle,
      },
      {
        key: "premium",
        title: locale === "en" ? "Premium design" : "Diseno premium",
        description:
          locale === "en"
            ? "Dark, elegant aesthetics with clear hierarchy and refined surfaces."
            : "Estetica oscura y elegante con jerarquia clara y superficies refinadas.",
        icon: Sparkles,
      },
      {
        key: "fees",
        title: locale === "en" ? "No commissions" : "Sin comisiones",
        description:
          locale === "en"
            ? "Your business does not depend on a public platform charging per order or booking."
            : "Tu negocio no depende de una plataforma publica que cobre por cada pedido o reserva.",
        icon: ShieldCheck,
      },
      {
        key: "tailored",
        title: locale === "en" ? "Tailored to your business" : "Adaptado a tu negocio",
        description:
          locale === "en"
            ? "Each vertical gets its own information structure and CTA logic."
            : "Cada rubro recibe una estructura de informacion y una logica de CTA coherente.",
        icon: BriefcaseBusiness,
      },
      {
        key: "speed",
        title: locale === "en" ? "Fast hosting" : "Hosting rapido",
        description:
          locale === "en"
            ? "A lightweight delivery base focused on quick load times and a premium feel."
            : "Una base ligera enfocada en tiempos de carga rapidos y sensacion premium.",
        icon: Globe2,
      },
      {
        key: "mobile",
        title: locale === "en" ? "Mobile optimized" : "Optimizado para movil",
        description:
          locale === "en"
            ? "Mobile-first layouts, visible CTA, and intentional flows on smaller screens."
            : "Diseno mobile-first, CTA visible y flujos intencionales en pantallas pequenas.",
        icon: MonitorSmartphone,
      },
    ],
    [locale],
  );

  const pricingPlans = useMemo<PricingPlan[]>(
    () => [
      {
        key: "basic",
        name: locale === "en" ? "Basic" : "Basico",
        label: locale === "en" ? "One-time payment" : "Pago unico",
        summary:
          locale === "en"
            ? "Ideal for a clean commercial homepage with WhatsApp CTA and fast launch."
            : "Ideal para una homepage comercial clara, con CTA a WhatsApp y salida rapida.",
        features:
          locale === "en"
            ? [
                "Premium hero + essential sections",
                "Responsive delivery",
                "WhatsApp button and lead capture focus",
                "Fast content setup",
              ]
            : [
                "Hero premium + secciones esenciales",
                "Entrega responsive",
                "WhatsApp y foco en captacion",
                "Carga rapida de contenido",
              ],
        accent:
          "border-white/12 bg-[linear-gradient(180deg,rgba(17,17,17,0.92),rgba(10,10,10,0.9))]",
      },
      {
        key: "pro",
        name: locale === "en" ? "Professional" : "Profesional",
        label: locale === "en" ? "Recommended" : "Recomendado",
        summary:
          locale === "en"
            ? "For businesses that need better conversion, better sales narrative, and a more robust proposal."
            : "Para negocios que necesitan mejor conversion, mejor narrativa comercial y una propuesta mas robusta.",
        features:
          locale === "en"
            ? [
                "Sector-specific structure",
                "Demo adaptation for your business",
                "WhatsApp flows for bookings, orders, or leads",
                "Premium visual polish and launch support",
              ]
            : [
                "Estructura por rubro",
                "Adaptacion de demo a tu negocio",
                "Flujos a WhatsApp para reservas, pedidos o leads",
                "Pulido visual premium y soporte de lanzamiento",
              ],
        accent:
          "border-[#c9a227]/45 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(9,9,9,0.94))]",
      },
      {
        key: "premium",
        name: "Premium",
        label: locale === "en" ? "Custom scope" : "Alcance a medida",
        summary:
          locale === "en"
            ? "For businesses that want a more complete system with custom flow decisions and stronger positioning."
            : "Para negocios que quieren un sistema mas completo, con decisiones de flujo a medida y posicionamiento mas fuerte.",
        features:
          locale === "en"
            ? [
                "Custom architecture and sections",
                "Advanced content direction",
                "Broader scope for complex businesses",
                "Launch aligned to your commercial objective",
              ]
            : [
                "Arquitectura y secciones a medida",
                "Direccion de contenido avanzada",
                "Mayor alcance para negocios mas complejos",
                "Salida alineada a tu objetivo comercial",
              ],
        accent:
          "border-emerald-200/20 bg-[linear-gradient(180deg,rgba(39,69,60,0.34),rgba(8,8,8,0.92))]",
      },
    ],
    [locale],
  );

  return (
    <main className="relative overflow-x-hidden bg-[#0B0B0B] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="fp-demo-orb left-[-8rem] top-[-4rem] h-72 w-72 bg-[#c9a227]" />
        <div className="fp-demo-orb right-[-5rem] top-[18rem] h-80 w-80 bg-[#25D366]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.16),transparent_38%),radial-gradient(circle_at_right,rgba(37,211,102,0.1),transparent_32%),linear-gradient(180deg,#0B0B0B_0%,#0B0B0B_38%,#101010_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#c9a227] sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#c9a227]" />
              {copy.hero.eyebrow}
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
              {copy.hero.badge}
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              {copy.hero.description}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              {copy.hero.note}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  void trackGrowthEvent("click_whatsapp", {
                    vertical: "services",
                    slug: "hero_primary",
                    location: "hero_primary",
                  })
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/60 bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B] transition hover:bg-[#1fba59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#demos"
                onClick={() =>
                  void trackGrowthEvent("view_demo", {
                    vertical: "services",
                    slug: "hero_demos_anchor",
                  })
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#c9a227]/45 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {copy.hero.secondaryCta}
              </a>
              <Link
                href="/auth?tab=login"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                {copy.hero.loginCta}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {copy.hero.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                {copy.hero.industriesLine}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {copy.hero.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#c9a227]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="fp-demo-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,164,107,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(60,109,90,0.16),transparent_36%)]" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-black/35 px-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c9a227]">
                    {copy.hero.showcaseLabel}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">{copy.hero.showcaseTitle}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
                <article className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#090909] shadow-[0_28px_80px_-42px_rgba(0,0,0,0.92)]">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {copy.hero.mockupDesktop}
                    </p>
                    <span className="rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9a227]">
                      FastPagePro
                    </span>
                  </div>
                  <div className="relative h-[320px] w-full sm:h-[420px]">
                    <DemoImage
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop"
                      alt="FastPagePro main showcase"
                      fallbackLabel="FastPagePro"
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                </article>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <article className="fp-demo-hover-card overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/45 p-3">
                    <div className="relative h-44 w-full overflow-hidden rounded-[1.35rem] border border-white/10">
                      <DemoImage
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop"
                        alt="Hotel booking mockup"
                        fallbackLabel="Bookings"
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 50vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                          {copy.hero.mockupPhoneOne}
                        </p>
                        <p className="mt-1 text-sm text-zinc-200">
                          {locale === "en" ? "Hotel and booking flows" : "Flujos para hoteleria y reservas"}
                        </p>
                      </div>
                      <Hotel className="h-5 w-5 text-[#c9a227]" />
                    </div>
                  </article>

                  <article className="fp-demo-hover-card overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/45 p-3">
                    <div className="relative h-44 w-full overflow-hidden rounded-[1.35rem] border border-white/10">
                      <DemoImage
                        src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop"
                        alt="WhatsApp commerce mockup"
                        fallbackLabel="WhatsApp"
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 50vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                          {copy.hero.mockupPhoneTwo}
                        </p>
                        <p className="mt-1 text-sm text-zinc-200">
                          {locale === "en" ? "Orders, leads, and direct contact" : "Pedidos, leads y contacto directo"}
                        </p>
                      </div>
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    </div>
                  </article>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                {copy.hero.showcaseDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            {copy.sections.sectorsEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            {copy.sections.sectorsTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            {copy.sections.sectorsDescription}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sectorCards.map((sector) => {
            const Icon = sector.icon;
            return (
              <article
                key={sector.key}
                className="fp-demo-hover-card overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.03]"
              >
                <div className="relative h-64 w-full">
                  <DemoImage
                    src={sector.image}
                    alt={sector.title}
                    fallbackLabel={sector.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/45 text-[#f1ddb5] backdrop-blur-md">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      {sector.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{sector.description}</p>
                  </div>
                  <Link
                    href={sector.href}
                    prefetch={false}
                    onClick={() =>
                      void trackGrowthEvent("click_demo_open", {
                        vertical:
                          sector.key === "stores"
                            ? "ecommerce"
                            : sector.key === "restaurants"
                              ? "restaurant"
                              : "services",
                        slug: sector.key,
                        location: "sector_card",
                      })
                    }
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#25D366]/40 hover:bg-[#25D366]/10"
                  >
                    {copy.buttons.viewDemo}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-zinc-400">{copy.sections.sectorsFootnote}</p>
      </section>
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              {copy.sections.stepsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              {copy.sections.stepsTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              {copy.sections.stepsDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.key}
                  className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(12,12,12,0.9))] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            {copy.sections.benefitsEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            {copy.sections.benefitsTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            {copy.sections.benefitsDescription}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.key}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#c9a227]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="precios" className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
            {copy.sections.pricingEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            {copy.sections.pricingTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            {copy.sections.pricingDescription}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.key}
              className={`flex h-full flex-col rounded-[2rem] border p-6 ${plan.accent}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    {plan.label}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {plan.name}
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-300">
                  FastPagePro
                </span>
              </div>
              <p className="mt-5 text-sm leading-6 text-zinc-300">{plan.summary}</p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-zinc-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#25D366]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  void trackGrowthEvent("click_whatsapp", {
                    vertical: "services",
                    slug: plan.key,
                    location: "pricing_card",
                  })
                }
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#25D366]/45 bg-[#25D366]/12 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#25D366]/60 hover:bg-[#25D366]/18"
              >
                {copy.buttons.requestQuote}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-6 text-zinc-300">
          {copy.sections.pricingNote}
        </p>
      </section>

      <section id="contacto" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.2rem] border border-[#c9a227]/28 bg-[linear-gradient(135deg,rgba(201,162,39,0.16),rgba(11,11,11,0.94)_42%,rgba(37,211,102,0.22))] p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              {copy.sections.finalEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              {copy.sections.finalTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-200">
              {copy.sections.finalDescription}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                void trackGrowthEvent("click_whatsapp", {
                  vertical: "services",
                  slug: "final_cta",
                  location: "final_cta",
                })
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/60 bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B] transition hover:bg-[#1fba59]"
            >
              {copy.sections.finalButton}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#demos"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              {copy.hero.secondaryCta}
            </a>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            void trackGrowthEvent("click_whatsapp", {
              vertical: "services",
              slug: "mobile_sticky",
              location: "mobile_sticky",
            })
          }
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#25D366]/55 bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#0B0B0B] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.92)] backdrop-blur-md transition hover:bg-[#1fba59]"
        >
          <MessageCircle className="h-4 w-4" />
          {copy.hero.primaryCta}
        </a>
      </div>

      <Footer />
    </main>
  );
}
