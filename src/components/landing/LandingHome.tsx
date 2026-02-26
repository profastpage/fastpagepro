"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
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
  TrendingUp,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

type IntentId = "landing" | "store" | "menu" | "clone";
type ModuleId =
  | "builder"
  | "templates"
  | "cloner"
  | "store"
  | "menu"
  | "metrics"
  | "ai";

type ModuleCard = {
  id: ModuleId;
  title: string;
  line: string;
  href: string;
  icon: LucideIcon;
};

const INTENTS: Array<{
  id: IntentId;
  label: string;
  subtitle: string;
  cta: string;
}> = [
  {
    id: "landing",
    label: "Landing",
    subtitle: "Capta leads y activa campanas de trafico con paginas que convierten.",
    cta: "/auth?tab=register&intent=landing",
  },
  {
    id: "store",
    label: "Tienda Online",
    subtitle: "Vende con catalogo, carrito y checkout conectado a WhatsApp.",
    cta: "/auth?tab=register&intent=store",
  },
  {
    id: "menu",
    label: "Carta Digital",
    subtitle: "Recibe pedidos directos sin comisiones y con flujo ordenado.",
    cta: "/auth?tab=register&intent=menu",
  },
  {
    id: "clone",
    label: "Clonar",
    subtitle: "Replica estructuras ganadoras y adaptalas a tu negocio.",
    cta: "/auth?tab=register&intent=clone",
  },
];

const MODULES: ModuleCard[] = [
  { id: "builder", icon: WandSparkles, title: "Builder", line: "Editor visual no-code para paginas de alto impacto", href: "/builder" },
  { id: "templates", icon: Palette, title: "Templates", line: "Plantillas por nicho listas para publicar en minutos", href: "/templates" },
  { id: "cloner", icon: Copy, title: "Cloner", line: "Replica paginas y mejora la estructura para tu marca", href: "/cloner/web" },
  { id: "store", icon: ShoppingCart, title: "Online Store", line: "Tienda completa con carrito y cierre por WhatsApp", href: "/store" },
  { id: "menu", icon: UtensilsCrossed, title: "Carta Digital", line: "Menu para restaurantes con pedidos directos", href: "/linkhub" },
  { id: "metrics", icon: BarChart3, title: "Pro Metrics", line: "Visitas, conversiones, clics y rendimiento tecnico", href: "/metrics" },
  { id: "ai", icon: Bot, title: "IA", line: "Copy, estructura y recomendaciones para vender mas", href: "/dashboard/billing" },
];

const FLOW_STEPS = [
  { title: "Visitas", icon: Globe2, description: "Trae trafico desde anuncios, redes y contenido." },
  { title: "Landing", icon: MonitorSmartphone, description: "Convierte la atencion en interes real." },
  { title: "WhatsApp", icon: MessageCircle, description: "Cierra conversaciones y pedidos mas rapido." },
  { title: "Metricas", icon: BarChart3, description: "Mide lo que funciona y corta lo que no." },
  { title: "Escala", icon: TrendingUp, description: "Duplica resultados con decisiones por datos." },
];

const DEMOS = [
  { group: "Carta Digital", title: "Sushi Prime", subtitle: "Menu premium + pedidos por WhatsApp", href: "/linkhub" },
  { group: "Carta Digital", title: "Burger Lab", subtitle: "Carta con combos y categorias inteligentes", href: "/linkhub" },
  { group: "Carta Digital", title: "Coffee Route", subtitle: "Flujo para cafeterias con upsell", href: "/linkhub" },
  { group: "Online Store", title: "Urban Wear", subtitle: "Moda urbana con enfoque de conversion", href: "/store" },
  { group: "Online Store", title: "Tech Nova", subtitle: "Catalogo tecnologico con checkout rapido", href: "/store" },
  { group: "Online Store", title: "Couture Plus", subtitle: "Accesorios y promociones diarias", href: "/store" },
];

const FAQS = [
  { q: "Necesito programar?", a: "No. FastPage es visual y no-code." },
  { q: "Puedo usar mi dominio?", a: "Si. Desde Business puedes conectar dominio propio." },
  { q: "Puedo quitar el branding?", a: "Si, en plan Pro (y Agencia en el futuro)." },
  { q: "Que es un proyecto activo?", a: "Cualquier proyecto publicado desde Builder, Templates, Cloner, Carta Digital u Online Store." },
  { q: "Carta Digital o Tienda Online?", a: "Carta Digital es para restaurantes. Online Store es multirubro para ecommerce." },
  { q: "Que mide Pro Metrics?", a: "Visitas, conversiones, tiempo en pagina, clics, trafico semanal y rendimiento tecnico." },
  { q: "Que hace la IA?", a: "En Business sugiere copy basico. En Pro optimiza descripciones, estructura y CTA para vender mas." },
  { q: "Puedo cancelar cuando quiera?", a: "Si, puedes cancelar desde billing cuando lo necesites." },
];

function trackLandingEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const win = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[landing-event]", { event: eventName, ...payload });
  }
  win.dataLayer?.push({ event: eventName, ...payload });
  if (typeof win.gtag === "function") win.gtag("event", eventName, payload);
}

function scrollToSection(id: string) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function intentById(id: IntentId) {
  return INTENTS.find((item) => item.id === id) ?? INTENTS[0];
}

export default function LandingHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [intent, setIntent] = useState<IntentId>("landing");
  const [previewModule, setPreviewModule] = useState<ModuleId>("builder");

  useEffect(() => {
    if (!loading && user) router.replace("/hub");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !user) trackLandingEvent("landing_view", { page: "/" });
  }, [loading, user]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }
  if (user) return null;

  const currentIntent = intentById(intent);
  const currentPreview = MODULES.find((module) => module.id === previewModule) ?? MODULES[0];

  return (
    <main className="relative overflow-x-hidden pb-24 md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_58%)]" />
      </div>

      <section id="hero" className="relative z-10 mx-auto w-full max-w-7xl min-h-[calc(100svh-86px)] px-4 pb-12 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-amber-400/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Sistema de crecimiento para Latam
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Crea paginas que convierten visitas en clientes por WhatsApp
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              FastPage une landing, tienda online, carta digital, IA y metricas para ayudarte a vender mas cada dia.
            </p>
            <p className="max-w-2xl text-sm text-zinc-400">{currentIntent.subtitle}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={currentIntent.cta}
                data-event="cta_primary_click"
                onClick={() => trackLandingEvent("cta_primary_click", { location: "hero", intent })}
                className="inline-flex items-center justify-center rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Empezar gratis
              </Link>
              <button
                type="button"
                data-event="view_demo_click"
                onClick={() => {
                  trackLandingEvent("view_demo_click", { location: "hero" });
                  scrollToSection("accion");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/55 hover:bg-amber-300/10"
              >
                <PlayCircle className="h-4 w-4" />
                Ver como funciona
              </button>
              <button
                type="button"
                data-event="view_pricing_click"
                onClick={() => {
                  trackLandingEvent("view_pricing_click", { location: "hero" });
                  scrollToSection("pricing");
                }}
                className="text-sm font-semibold text-amber-300 underline-offset-4 transition hover:text-amber-200 hover:underline"
              >
                Ver precios
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Sin tarjeta", "Configuracion en minutos", "Hecho para negocios de Latam"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200">
                  {item}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Que quieres crear hoy?
              </p>
              <div className="flex flex-wrap gap-2">
                {INTENTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIntent(item.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      intent === item.id
                        ? "border-amber-300 bg-amber-300/15 text-amber-100"
                        : "border-white/20 bg-white/5 text-zinc-300 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex flex-wrap gap-2">
              {MODULES.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setPreviewModule(module.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                    previewModule === module.id
                      ? "border-amber-300 bg-amber-300/15 text-amber-100"
                      : "border-white/15 bg-white/[0.03] text-zinc-300"
                  }`}
                >
                  {module.title}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{currentPreview.title}</p>
              <p className="mt-3 text-2xl font-black text-white">{currentPreview.line}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-zinc-400">Resultado</p>
                  <p className="text-sm font-bold text-white">Mas conversaciones por WhatsApp</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-zinc-400">Tiempo de salida</p>
                  <p className="text-sm font-bold text-white">Tu primer activo en minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto hidden w-full max-w-7xl px-4 pb-8 lg:block lg:px-8">
        <div className="sticky top-20 rounded-2xl border border-white/10 bg-black/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-zinc-200">
              Convierte trafico en clientes con un sistema de crecimiento completo.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={currentIntent.cta}
                onClick={() => trackLandingEvent("cta_primary_click", { location: "desktop_sticky", intent })}
                className="inline-flex items-center rounded-full bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110"
              >
                Empezar gratis
              </Link>
              <button
                type="button"
                onClick={() => {
                  trackLandingEvent("view_demo_click", { location: "desktop_sticky" });
                  scrollToSection("accion");
                }}
                className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/55 hover:bg-amber-300/10"
              >
                Ver como funciona
              </button>
            </div>
          </div>
        </div>
      </div>

      <section id="sistema-fastpage" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Sistema FastPage</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            No es solo un builder. Es un sistema para atraer, convertir, cerrar y escalar.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[repeat(9,minmax(0,1fr))] md:items-center">
          {FLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={index < FLOW_STEPS.length - 1 ? "md:col-span-2" : "md:col-span-1"}>
                <article className="group rounded-2xl border border-white/10 bg-black/45 p-4 transition hover:-translate-y-1 hover:border-amber-300/40">
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
          <h2 className="text-3xl font-black text-white md:text-4xl">Todo en un solo sistema</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Builder, tienda, carta digital, IA y metricas conectadas para acelerar resultados.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                href={module.href}
                data-event={`module_click_${module.id}`}
                onClick={() => trackLandingEvent(`module_click_${module.id}`, { destination: module.href })}
                className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-amber-300/40"
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
          <h2 className="text-3xl font-black text-white md:text-4xl">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Elige, personaliza y publica con un proceso simple y orientado a conversion.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { id: "1", title: "Elige", text: "Template, Builder o Cloner segun tu objetivo comercial." },
            { id: "2", title: "Personaliza", text: "Textos, colores, imagenes, IA y estructura de venta." },
            { id: "3", title: "Publica + Mide", text: "Conecta dominio, activa WhatsApp y optimiza por metricas." },
          ].map((step) => (
            <article key={step.id} className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">{step.id}</p>
              <p className="mt-3 text-xl font-black text-white">{step.title}</p>
              <p className="mt-2 text-sm text-zinc-300">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="casos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Soluciones por tipo de negocio</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: UtensilsCrossed,
              title: "Restaurantes",
              copy: "Cartas digitales y pedidos directos a WhatsApp sin comisiones.",
              href: "/linkhub",
              cta: "Activar Carta Digital",
            },
            {
              icon: Store,
              title: "Tiendas Online",
              copy: "Landing y catalogo optimizado para convertir trafico en ventas.",
              href: "/store",
              cta: "Lanzar Tienda Online",
            },
            {
              icon: MessageCircle,
              title: "Servicios",
              copy: "Captura leads calificados y agenda clientes automaticamente.",
              href: "/templates",
              cta: "Ver Plantillas de Servicios",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-black/45 p-6 transition hover:-translate-y-1 hover:border-amber-300/45"
              >
                <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2.5">
                  <Icon className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-4 text-2xl font-black text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-200 transition group-hover:bg-amber-300/20">
                  {item.cta}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="accion" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Mira FastPage en accion</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Visualiza como se conecta tu flujo comercial desde la visita hasta el cierre.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Product Mockup</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/90 p-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="h-24 rounded-lg bg-gradient-to-r from-amber-300/30 via-black to-cyan-300/20" />
                <div className="mt-3 grid gap-2">
                  <div className="h-2.5 w-3/4 rounded bg-zinc-700/70" />
                  <div className="h-2.5 w-full rounded bg-zinc-700/50" />
                  <div className="h-2.5 w-2/3 rounded bg-zinc-700/50" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-300">Landing + catalogo + CTA para WhatsApp en una sola vista.</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">WhatsApp Flow Preview</p>
            <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-zinc-950/90 p-4">
              <div className="ml-auto max-w-[85%] rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
                Hola, quiero 2 combos del menu y delivery en Miraflores.
              </div>
              <div className="max-w-[88%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-zinc-100">
                Perfecto. Total S/ 52. Confirmas pago por Yape?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
                Confirmado. Enviame el link y cerramos.
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-300">Conversaciones ordenadas para cerrar mas rapido.</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Demo Rapida</p>
            <button
              type="button"
              data-event="view_demo_click"
              onClick={() => {
                trackLandingEvent("view_demo_click", { location: "action_section" });
                scrollToSection("demos");
              }}
              className="group mt-4 grid h-[212px] w-full place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/5 to-black transition hover:border-amber-300/45"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 text-amber-200 transition group-hover:scale-105">
                <PlayCircle className="h-7 w-7" />
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-200">Video demo (90s)</span>
            </button>
            <p className="mt-3 text-sm text-zinc-300">Entiende el flujo completo antes de empezar.</p>
          </article>
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Demos listas para convertir</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEMOS.map((demo) => (
            <article key={demo.title} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90">
              <div className={`h-32 p-4 ${demo.group === "Carta Digital" ? "bg-gradient-to-br from-amber-400/25 to-red-500/20" : "bg-gradient-to-br from-cyan-400/20 to-blue-500/20"}`}>
                <span className="inline-flex rounded-full border border-white/30 bg-black/40 px-2 py-1 text-xs font-bold text-white">{demo.group}</span>
              </div>
              <div className="p-4">
                <p className="text-lg font-black text-white">{demo.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{demo.subtitle}</p>
                <Link
                  href={demo.href}
                  data-event="view_demo_click"
                  onClick={() => trackLandingEvent("view_demo_click", { type: demo.group.toLowerCase().replaceAll(" ", "_") })}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Abrir demo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Planes para crecer y escalar</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-black/45 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">FREE</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 0</p>
            <p className="mt-2 text-sm text-zinc-400">Para empezar y validar oferta.</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-300">
              <li>1 proyecto activo</li>
              <li>10 productos por proyecto</li>
              <li>Sin dominio propio</li>
              <li>Branding visible</li>
              <li>Sin IA</li>
            </ul>
          </article>

          <article className="relative rounded-3xl border border-amber-300/45 bg-gradient-to-b from-amber-300/10 to-black/60 p-6">
            <span className="absolute -top-3 right-4 rounded-full border border-amber-300/45 bg-black px-3 py-1 text-xs font-bold text-amber-200">⭐ Mas elegido por negocios</span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">BUSINESS</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 59</p>
            <p className="mt-2 text-sm font-semibold text-amber-100">🔥 Ideal para negocios que quieren vender todos los dias</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              <li>5 proyectos activos</li>
              <li><strong>50 productos</strong> por proyecto</li>
              <li>Dominio propio permitido</li>
              <li>IA basica</li>
              <li>Metricas basicas</li>
            </ul>
          </article>

          <article className="relative rounded-3xl border border-cyan-300/35 bg-gradient-to-b from-cyan-300/10 to-black/60 p-6">
            <span className="absolute -top-3 right-4 rounded-full border border-cyan-300/40 bg-black px-3 py-1 text-xs font-bold text-cyan-100">Mejor valor</span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">PRO</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 99</p>
            <p className="mt-2 text-sm font-semibold text-cyan-100">🚀 Para negocios que quieren escalar en serio</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              <li>20 proyectos activos</li>
              <li><strong>Productos ilimitados</strong></li>
              <li><strong>Branding removible</strong></li>
              <li><strong>IA avanzada</strong></li>
              <li>Metricas PRO + insights</li>
            </ul>
          </article>
        </div>
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          El dominio lo compra el cliente externamente. Desde Business puedes conectarlo en FastPage.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-left text-zinc-300">
                <th className="px-4 py-3 font-bold">Funcion</th>
                <th className="px-4 py-3 font-bold">FREE</th>
                <th className="px-4 py-3 font-bold">BUSINESS</th>
                <th className="px-4 py-3 font-bold">PRO</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {[
                ["Proyectos activos", "1", "5", "20"],
                ["Productos por proyecto", "10", "50", "Ilimitados"],
                ["Dominio propio", "No", "Si", "Si"],
                ["Branding removible", "No", "No", "Si"],
                ["IA", "No", "Basica", "Avanzada"],
                ["Metricas", "No", "Basicas", "Pro + Insights"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/5">
                  <td className="px-4 py-3 font-semibold text-zinc-300">{row[0]}</td>
                  <td className="px-4 py-3">{row[1]}</td>
                  <td className="px-4 py-3">{row[2]}</td>
                  <td className="px-4 py-3">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Negocios que ya estan vendiendo con FastPage</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { quote: "Lanzamos 11 activos en una semana sin ampliar equipo.", author: "Growth Agency", role: "Agencias" },
            { quote: "Duplicamos pedidos por WhatsApp en 30 dias.", author: "Marca gastronomica", role: "Restaurantes" },
            { quote: "Con Pro Metrics ajustamos CTA y subimos conversiones.", author: "Ecommerce Team", role: "Tienda Online" },
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
                <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition group-open:rotate-90" />
              </summary>
              <div className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-300">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-black/70 to-cyan-300/10 p-8 text-center">
          <p className="text-3xl font-black text-white md:text-4xl">Empieza gratis en 60 segundos</p>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">
            Crea tu primer activo hoy y conviertelo en ventas reales por WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={currentIntent.cta}
              onClick={() => trackLandingEvent("cta_primary_click", { location: "final", intent })}
              className="inline-flex items-center justify-center rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110"
            >
              Empezar gratis
            </Link>
            <button
              type="button"
              onClick={() => {
                trackLandingEvent("view_pricing_click", { location: "final" });
                scrollToSection("pricing");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/50 hover:bg-amber-300/10"
            >
              Ver precios
            </button>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
            <Link href="/hub" className="hover:text-white">Hub</Link>
            <Link href="/builder" className="hover:text-white">Builder</Link>
            <Link href="/templates" className="hover:text-white">Templates</Link>
            <Link href="/cloner/web" className="hover:text-white">Cloner</Link>
            <Link href="/store" className="hover:text-white">Online Store</Link>
            <Link href="/linkhub" className="hover:text-white">Carta Digital</Link>
            <button type="button" onClick={() => scrollToSection("pricing")} className="hover:text-white">Pricing</button>
            <Link href="/auth?tab=login" className="hover:text-white">Login</Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden">
        <Link
          href={currentIntent.cta}
          data-event="cta_primary_click"
          onClick={() => trackLandingEvent("cta_primary_click", { location: "mobile_sticky", intent })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/55 bg-gradient-to-r from-black via-black/95 to-zinc-900 px-4 py-3 text-sm font-black text-amber-200 shadow-2xl backdrop-blur-md"
        >
          <Rocket className="h-4 w-4" />
          Empezar gratis
        </Link>
      </div>

      <Footer />
    </main>
  );
}
