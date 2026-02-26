"use client";

import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Copy,
  Globe2,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PlayCircle,
  Rocket,
  ShoppingCart,
  Sparkles,
  Store,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import DemoCard from "@/components/demo/DemoCard";
import VerticalSelector from "@/components/demo/VerticalSelector";
import { useAuth } from "@/hooks/useAuth";
import { getDemoCatalog } from "@/lib/demoCatalog";
import {
  persistUtmFromUrl,
  trackGrowthEvent,
} from "@/lib/analytics";
import {
  getVerticalCopy,
  normalizeVertical,
  persistVerticalChoice,
  verticalToDemoHref,
  verticalToSignupHref,
  type BusinessVertical,
} from "@/lib/vertical";

type ModuleCard = {
  id: "builder" | "templates" | "cloner" | "store" | "menu" | "metrics" | "ai";
  title: string;
  line: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const MODULES: ModuleCard[] = [
  {
    id: "builder",
    icon: WandSparkles,
    title: "Builder",
    line: "Editor visual no-code para paginas orientadas a conversion.",
    href: "/builder",
  },
  {
    id: "templates",
    icon: Palette,
    title: "Templates",
    line: "Plantillas por nicho listas para lanzar en minutos.",
    href: "/templates",
  },
  {
    id: "cloner",
    icon: Copy,
    title: "Cloner",
    line: "Replica paginas ganadoras y adaptalas a tu marca.",
    href: "/cloner/web",
  },
  {
    id: "store",
    icon: ShoppingCart,
    title: "Online Store",
    line: "Catalogo, carrito y checkout conectado a WhatsApp.",
    href: "/store",
  },
  {
    id: "menu",
    icon: UtensilsCrossed,
    title: "Carta Digital",
    line: "Menu para restaurantes con pedido directo por WhatsApp.",
    href: "/linkhub",
  },
  {
    id: "metrics",
    icon: BarChart3,
    title: "Pro Metrics",
    line: "Visitas, conversion, rendimiento tecnico e insights.",
    href: "/metrics",
  },
  {
    id: "ai",
    icon: Bot,
    title: "IA",
    line: "Sugerencias de copy, estructura y optimizacion por plan.",
    href: "/dashboard/billing",
  },
];

const FLOW_STEPS = [
  { title: "Visitas", icon: Globe2, description: "Atrae trafico desde anuncios, redes y contenido." },
  { title: "Landing", icon: MonitorSmartphone, description: "Convierte interes en oportunidad comercial real." },
  { title: "WhatsApp", icon: MessageCircle, description: "Cierra pedidos, reservas y leads sin friccion." },
  { title: "Metricas", icon: BarChart3, description: "Mide conversion y toma decisiones por datos." },
  { title: "Escala", icon: Rocket, description: "Optimiza y multiplica resultados con precision." },
];

const DEMO_TAB_CONFIG: Record<BusinessVertical, string> = {
  restaurant: "Carta Digital",
  ecommerce: "Online Store",
  services: "Landing",
};

const FAQS = [
  {
    q: "Necesito programar para usar FastPage?",
    a: "No. Todo es visual y puedes publicar sin escribir codigo.",
  },
  {
    q: "Puedo usar mi dominio?",
    a: "Si. Desde Business puedes conectar un dominio comprado por tu negocio.",
  },
  {
    q: "Puedo quitar el branding?",
    a: "Si, en plan Pro (y Agency cuando se habilite).",
  },
  {
    q: "Que es un proyecto activo?",
    a: "Todo proyecto publicado desde Builder, Templates, Cloner, Carta Digital u Online Store.",
  },
  {
    q: "Carta Digital vs Tienda Online?",
    a: "Carta Digital es para restaurantes. Online Store es ecommerce multirubro.",
  },
  {
    q: "Que mide Pro Metrics?",
    a: "Visitas, conversion, tiempo en pagina, clics, trafico semanal y rendimiento tecnico.",
  },
  {
    q: "Que hace la IA?",
    a: "Business: copy basico. Pro: optimizacion avanzada de estructura, copy y conversion.",
  },
  {
    q: "Puedo cancelar cuando quiera?",
    a: "Si, puedes cancelar desde billing cuando lo necesites.",
  },
];

export default function LandingHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vertical, setVertical] = useState<BusinessVertical>("restaurant");
  const [demoTab, setDemoTab] = useState<BusinessVertical>("restaurant");

  useEffect(() => {
    if (!loading && user) router.replace("/hub");
  }, [loading, router, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlVertical = normalizeVertical(
      new URLSearchParams(window.location.search).get("vertical"),
    );
    setVertical(urlVertical);
    setDemoTab(urlVertical);
    persistVerticalChoice(urlVertical);
    persistUtmFromUrl();
    void trackGrowthEvent("page_view", {
      page: "landing_home",
      vertical: urlVertical,
    });
  }, []);

  const verticalCopy = useMemo(() => getVerticalCopy(vertical), [vertical]);
  const heroDemoHref = useMemo(() => verticalToDemoHref(vertical), [vertical]);
  const heroSignupHref = useMemo(() => verticalToSignupHref(vertical), [vertical]);
  const demoItems = useMemo(() => getDemoCatalog(demoTab), [demoTab]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
      </div>
    );
  }

  if (user) return null;

  return (
    <main className="relative overflow-x-hidden pb-24 md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_56%)]" />

      <section className="relative z-10 mx-auto min-h-[calc(100svh-84px)] w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Crea, clona y vende en Latam
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Crea paginas que convierten visitas en clientes por WhatsApp
            </h1>
            <p className="max-w-2xl text-base text-zinc-300 md:text-lg">
              FastPage no es solo un builder: es un sistema para crear, vender, medir y escalar.
            </p>
            <p className="max-w-2xl text-sm text-zinc-400">{verticalCopy.subheadline}</p>

            <VerticalSelector
              value={vertical}
              onChange={(nextVertical) => {
                setVertical(nextVertical);
                persistVerticalChoice(nextVertical);
                void trackGrowthEvent("view_demo", {
                  vertical: nextVertical,
                  slug: "landing_selector",
                });
              }}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={heroSignupHref}
                onClick={() =>
                  void trackGrowthEvent("click_cta_signup", {
                    vertical,
                    location: "hero_primary",
                  })
                }
                className="inline-flex items-center justify-center rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110"
              >
                🚀 Probar gratis
              </Link>
              <Link
                href={heroDemoHref}
                onClick={() =>
                  void trackGrowthEvent("click_demo_open", {
                    vertical,
                    slug: "hub",
                    location: "hero_secondary",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
              >
                <PlayCircle className="h-4 w-4" />
                Ver demo
              </Link>
              <a
                href="#pricing"
                onClick={() =>
                  void trackGrowthEvent("click_demo_open", {
                    vertical,
                    slug: "pricing",
                    location: "hero_pricing_link",
                  })
                }
                className="text-sm font-semibold text-amber-300 underline-offset-4 transition hover:text-amber-200 hover:underline"
              >
                Ver precios
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Sin codigo", "Listo en minutos", "Optimiza con metricas", "IA para copy"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Sistema FastPage</p>
            <h2 className="mt-3 text-3xl font-black text-white">{verticalCopy.headline}</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Elige demo, personaliza tu version y registra solo cuando ya viste el valor.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {FLOW_STEPS.slice(0, 4).map((step) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">{step.title}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{step.description}</p>
                </div>
              ))}
            </div>
            <Link
              href={heroDemoHref}
              onClick={() =>
                void trackGrowthEvent("click_demo_open", {
                  vertical,
                  slug: "hero_panel",
                })
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
            >
              Abrir demo ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="sistema-fastpage" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Sistema FastPage</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Visitas → Landing → WhatsApp → Metricas → Escala.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[repeat(9,minmax(0,1fr))] md:items-center">
          {FLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={index < FLOW_STEPS.length - 1 ? "md:col-span-2" : "md:col-span-1"}>
                <article className="group rounded-2xl border border-white/10 bg-black/45 p-4 transition hover:-translate-y-1 hover:border-amber-300/45">
                  <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2">
                    <Icon className="h-5 w-5 text-amber-300 transition group-hover:scale-110" />
                  </div>
                  <p className="mt-3 text-base font-black text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-zinc-300">{step.description}</p>
                </article>
                {index < FLOW_STEPS.length - 1 ? (
                  <div className="hidden items-center justify-center py-2 md:flex">
                    <ArrowRight className="h-4 w-4 animate-pulse text-amber-300/80" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Todo en uno</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Builder, templates, cloner, tienda, carta digital, IA y metricas en un solo sistema.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                href={module.href}
                onClick={() =>
                  void trackGrowthEvent("click_demo_open", {
                    vertical,
                    slug: `module_${module.id}`,
                  })
                }
                className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-amber-300/45"
              >
                <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2.5">
                  <Icon className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-4 text-lg font-black text-white">{module.title}</p>
                <p className="mt-2 text-sm text-zinc-300">{module.line}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-amber-300">
                  Ver modulo
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Elige tu rubro</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              vertical: "restaurant" as const,
              icon: UtensilsCrossed,
              copy: "Cartas digitales y pedidos directos a WhatsApp sin comisiones.",
            },
            {
              vertical: "ecommerce" as const,
              icon: Store,
              copy: "Landing y catalogo optimizado para convertir trafico en ventas.",
            },
            {
              vertical: "services" as const,
              icon: MessageCircle,
              copy: "Captura leads calificados y agenda clientes automaticamente.",
            },
          ].map((item) => {
            const Icon = item.icon;
            const itemCopy = getVerticalCopy(item.vertical);
            return (
              <article key={item.vertical} className="rounded-2xl border border-white/10 bg-black/45 p-6">
                <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2.5">
                  <Icon className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-4 text-2xl font-black text-white">{itemCopy.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.copy}</p>
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/demo?vertical=${item.vertical}`}
                    onClick={() =>
                      void trackGrowthEvent("click_demo_open", {
                        vertical: item.vertical,
                        slug: "rubro_card",
                      })
                    }
                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white"
                  >
                    Ver demo
                  </Link>
                  <Link
                    href={`/signup?vertical=${item.vertical}`}
                    onClick={() =>
                      void trackGrowthEvent("click_cta_signup", {
                        vertical: item.vertical,
                        location: "rubro_card",
                      })
                    }
                    className="rounded-xl border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200"
                  >
                    Crear mi version
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black text-white md:text-4xl">Casos reales por rubro</h2>
            <p className="mt-2 text-zinc-300">4 demos de Carta Digital, 4 de Online Store y 3 de Landing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["restaurant", "ecommerce", "services"] as BusinessVertical[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDemoTab(tab)}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                  demoTab === tab
                    ? "border-amber-300 bg-amber-300/15 text-amber-100"
                    : "border-white/20 bg-white/5 text-zinc-300"
                }`}
              >
                {DEMO_TAB_CONFIG[tab]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demoItems.map((item) => (
            <DemoCard
              key={`${item.vertical}-${item.slug}`}
              item={item}
              onOpen={(selectedVertical, slug) =>
                void trackGrowthEvent("click_demo_open", {
                  vertical: selectedVertical,
                  slug,
                  location: "landing_cases",
                })
              }
            />
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Planes para crecer</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-black/45 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">FREE</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 0</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-300">
              <li>1 proyecto activo</li>
              <li>10 productos por proyecto</li>
              <li>Sin dominio propio</li>
              <li>Branding visible</li>
              <li>Sin IA</li>
            </ul>
          </article>

          <article className="relative rounded-3xl border border-amber-300/45 bg-gradient-to-b from-amber-300/10 to-black/60 p-6">
            <span className="absolute -top-3 right-4 rounded-full border border-amber-300/45 bg-black px-3 py-1 text-xs font-bold text-amber-200">
              ⭐ Mas elegido por negocios
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">BUSINESS</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 59</p>
            <p className="mt-2 text-sm font-semibold text-amber-100">🔥 Ideal para negocios que quieren vender todos los dias</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              <li>Hasta 5 proyectos activos</li>
              <li><strong>50 productos</strong> por proyecto</li>
              <li>Dominio propio permitido</li>
              <li>IA basica</li>
              <li>Metricas basicas</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-cyan-300/35 bg-gradient-to-b from-cyan-300/10 to-black/60 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">PRO</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 99</p>
            <p className="mt-2 text-sm font-semibold text-cyan-100">🚀 Para negocios que quieren escalar en serio</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              <li>Hasta 20 proyectos activos</li>
              <li><strong>Productos ilimitados</strong></li>
              <li><strong>Branding removible</strong></li>
              <li><strong>IA avanzada</strong></li>
              <li>Metricas PRO + insights</li>
            </ul>
          </article>
        </div>
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          El dominio lo compra el cliente. Desde Business puedes conectarlo.
        </p>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Prueba social</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { quote: "Duplicamos pedidos por WhatsApp en 30 dias.", author: "Restaurante Lima", role: "Carta Digital" },
            { quote: "Subimos conversion de trafico frio en 42%.", author: "Ecommerce moda", role: "Online Store" },
            { quote: "Generamos leads calificados sin depender de dev.", author: "Consultora B2B", role: "Landing servicios" },
          ].map((item) => (
            <article key={item.quote} className="rounded-2xl border border-white/10 bg-black/45 p-5">
              <p className="text-sm leading-relaxed text-zinc-200">&quot;{item.quote}&quot;</p>
              <p className="mt-4 text-sm font-black text-white">{item.author}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-amber-300">{item.role}</p>
              <div className="mt-3 flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Sparkles key={`${item.author}-${index}`} className="h-4 w-4" />
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
          {["WhatsApp", "Yape", "Plin", "QR", "Checkout", "Metricas"].map((badge) => (
            <span key={badge} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Preguntas frecuentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((item) => (
            <details key={item.q} className="group overflow-hidden rounded-2xl border border-white/10 bg-black/45">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left">
                <span className="text-sm font-bold text-white md:text-base">{item.q}</span>
                <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition group-open:rotate-90" />
              </summary>
              <div className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-black/70 to-cyan-300/10 p-8 text-center">
          <p className="text-3xl font-black text-white md:text-4xl">Empieza gratis en 60 segundos</p>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">
            Mira una demo ahora y crea tu version cuando estes listo.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={heroSignupHref}
              onClick={() =>
                void trackGrowthEvent("click_cta_signup", {
                  vertical,
                  location: "final_cta",
                })
              }
              className="rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110"
            >
              Probar gratis
            </Link>
            <Link
              href={heroDemoHref}
              onClick={() =>
                void trackGrowthEvent("click_demo_open", {
                  vertical,
                  slug: "final",
                })
              }
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
            >
              Ver demo
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden">
        <Link
          href={heroSignupHref}
          onClick={() =>
            void trackGrowthEvent("click_cta_signup", {
              vertical,
              location: "mobile_sticky",
            })
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/55 bg-gradient-to-r from-black via-black/95 to-zinc-900 px-4 py-3 text-sm font-black text-amber-200 shadow-2xl backdrop-blur-md"
        >
          <Rocket className="h-4 w-4" />
          Crear mi version gratis
        </Link>
      </div>

      <Footer />
    </main>
  );
}
