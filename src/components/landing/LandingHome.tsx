"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
  Copy,
  Palette,
  Rocket,
  ShoppingCart,
  Sparkles,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
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

const ROCKET = "\u{1F680}";
const PLAY = "\u25B6";

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

export default function LandingHome() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [intent, setIntent] = useState<IntentId>("landing");
  const [previewModule, setPreviewModule] = useState<ModuleId>("builder");

  const isEn = language === "en";
  const isPt = language === "pt";

  const copy = useMemo(() => {
    if (isEn) {
      return {
        selector: "What do you want to build today?",
        heroSubtitle:
          "Builder, Templates, Cloner, Online Store, Digital Menu, AI and Pro Metrics in one platform.",
        ctaPrimary: `${ROCKET} Start free`,
        ctaDemo: `${PLAY} Watch demo`,
        ctaPricing: "View pricing",
        modulesTitle: "Everything in one growth stack",
        modulesSubtitle: "Create, publish, sell and optimize without tool fragmentation.",
        howTitle: "How it works",
        howSubtitle: "Choose, customize, publish and optimize with data.",
        useCasesTitle: "Use cases by niche",
        demosTitle: "Conversion-ready demos",
        pricingTitle: "Plans built to scale",
        faqTitle: "Frequently asked questions",
        finalTitle: "Start free in 60 seconds",
        finalSubtitle: "Launch your first project now and upgrade when you need more.",
        sticky: `${ROCKET} Start FastPage free`,
      };
    }
    if (isPt) {
      return {
        selector: "O que voce quer criar hoje?",
        heroSubtitle:
          "Builder, Templates, Cloner, Online Store, Cardapio Digital, IA e Pro Metrics em uma plataforma.",
        ctaPrimary: `${ROCKET} Testar gratis`,
        ctaDemo: `${PLAY} Ver demo`,
        ctaPricing: "Ver planos",
        modulesTitle: "Tudo em um stack de crescimento",
        modulesSubtitle: "Crie, publique, venda e otimize sem fragmentacao de ferramentas.",
        howTitle: "Como funciona",
        howSubtitle: "Escolha, personalize, publique e otimize com dados.",
        useCasesTitle: "Casos de uso por nicho",
        demosTitle: "Demos prontas para converter",
        pricingTitle: "Planos para escalar",
        faqTitle: "Perguntas frequentes",
        finalTitle: "Comece gratis em 60 segundos",
        finalSubtitle: "Publique seu primeiro projeto hoje e faca upgrade quando quiser.",
        sticky: `${ROCKET} Testar FastPage gratis`,
      };
    }
    return {
      selector: "Que quieres crear hoy?",
      heroSubtitle:
        "Builder, Templates, Cloner, Online Store, Carta Digital, IA y Pro Metrics en una sola plataforma.",
      ctaPrimary: `${ROCKET} Probar gratis`,
      ctaDemo: `${PLAY} Ver demo`,
      ctaPricing: "Ver precios",
      modulesTitle: "Todo en un stack de crecimiento",
      modulesSubtitle: "Crea, publica, vende y optimiza sin fragmentar herramientas.",
      howTitle: "Como funciona",
      howSubtitle: "Elige, personaliza, publica y optimiza con datos.",
      useCasesTitle: "Casos de uso por rubro",
      demosTitle: "Demos listas para convertir",
      pricingTitle: "Planes para escalar",
      faqTitle: "Preguntas frecuentes",
      finalTitle: "Empieza gratis en 60 segundos",
      finalSubtitle: "Publica tu primer proyecto hoy y escala cuando necesites mas.",
      sticky: `${ROCKET} Probar FastPage gratis`,
    };
  }, [isEn, isPt]);

  useEffect(() => {
    if (!loading && user) router.replace("/hub");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user && !loading) trackLandingEvent("landing_view", { page: "/" });
  }, [user, loading]);

  const intentMap: Record<IntentId, { title: string; subtitle: string; cta: string }> = {
    landing: {
      title: isEn
        ? "Launch premium landing pages in minutes."
        : isPt
          ? "Lance landing pages premium em minutos."
          : "Lanza landing pages premium en minutos.",
      subtitle: isEn
        ? "Perfect for lead generation and validation."
        : isPt
          ? "Perfeito para captar leads e validar ofertas."
          : "Ideal para captar leads y validar ofertas.",
      cta: "/auth?tab=register&intent=landing",
    },
    store: {
      title: isEn
        ? "Build an online store with real checkout flow."
        : isPt
          ? "Crie uma loja online com checkout real."
          : "Crea una tienda online con flujo de compra real.",
      subtitle: isEn
        ? "Products, cart and conversion-first checkout."
        : isPt
          ? "Produtos, carrinho e checkout orientado a conversao."
          : "Productos, carrito y checkout orientado a conversion.",
      cta: "/auth?tab=register&intent=store",
    },
    menu: {
      title: isEn
        ? "Launch a Digital Menu for restaurants."
        : isPt
          ? "Ative um Cardapio Digital para restaurantes."
          : "Activa una Carta Digital para restaurantes.",
      subtitle: isEn
        ? "Search, categories and WhatsApp order flow."
        : isPt
          ? "Busca, categorias e pedidos por WhatsApp."
          : "Buscador, categorias y pedidos por WhatsApp.",
      cta: "/auth?tab=register&intent=menu",
    },
    clone: {
      title: isEn
        ? "Clone winning pages and adapt them to your brand."
        : isPt
          ? "Clone paginas ganadoras e adapte a sua marca."
          : "Clona paginas ganadoras y adaptalas a tu marca.",
      subtitle: isEn
        ? "Benchmark fast and publish better."
        : isPt
          ? "Benchmark rapido e publicacao otimizada."
          : "Benchmark rapido y publicacion optimizada.",
      cta: "/auth?tab=register&intent=clone",
    },
  };

  const modules = [
    { id: "builder" as ModuleId, icon: WandSparkles, title: "Builder", href: "/builder", line: "Editor visual no-code" },
    { id: "templates" as ModuleId, icon: Palette, title: "Templates", href: "/templates", line: "Plantillas por nicho" },
    { id: "cloner" as ModuleId, icon: Copy, title: "Cloner", href: "/cloner/web", line: "Replica y adapta paginas" },
    { id: "store" as ModuleId, icon: ShoppingCart, title: "Online Store", href: "/store", line: "Ecommerce completo" },
    { id: "menu" as ModuleId, icon: UtensilsCrossed, title: "Carta Digital", href: "/linkhub", line: "Restaurantes + WhatsApp" },
    { id: "metrics" as ModuleId, icon: BarChart3, title: "Pro Metrics", href: "/metrics", line: "Visitas, conversion e insights" },
    { id: "ai" as ModuleId, icon: Bot, title: "IA", href: "/dashboard/billing", line: "Copy, estructura y recomendaciones" },
  ];

  const demos = [
    { group: "menu", title: "Sushi Prime", subtitle: "Carta Deluxe + WhatsApp", href: "/linkhub" },
    { group: "menu", title: "Burger Lab", subtitle: "Combos y categorias", href: "/linkhub" },
    { group: "menu", title: "Coffee Street", subtitle: "Carta para cafeteria", href: "/linkhub" },
    { group: "menu", title: "Nikkei Spot", subtitle: "Carta premium", href: "/linkhub" },
    { group: "store", title: "Urban Wear", subtitle: "Moda urbana", href: "/store" },
    { group: "store", title: "TechNova", subtitle: "Tienda tecnologica", href: "/store" },
    { group: "store", title: "Couture Plus", subtitle: "Accesorios y ofertas", href: "/store" },
    { group: "store", title: "Fit Supply", subtitle: "Suplementos y catalogo", href: "/store" },
  ];

  const faqs = [
    { q: isEn ? "Do I need to code?" : "Necesito programar?", a: isEn ? "No. FastPage is visual no-code." : "No. FastPage es visual no-code." },
    { q: isEn ? "Can I use my own domain?" : "Puedo usar mi dominio?", a: isEn ? "Yes, from Business. Customer buys domain externally." : "Si, desde Business. El cliente compra el dominio externamente." },
    { q: isEn ? "Can I remove branding?" : "Puedo quitar el branding?", a: isEn ? "Only Pro (and Agency in the future)." : "Solo Pro (y Agencia en futuro)." },
    { q: isEn ? "What counts as active project?" : "Que es un proyecto activo?", a: isEn ? "Any published project from Builder, Templates, Cloner, Digital Menu or Online Store." : "Cualquier proyecto publicado desde Builder, Templates, Cloner, Carta Digital u Online Store." },
    { q: isEn ? "Digital Menu vs Online Store?" : "Carta Digital vs Online Store?", a: isEn ? "Digital Menu is restaurant-first. Online Store is multi-niche ecommerce." : "Carta Digital es para restaurantes. Online Store es ecommerce multirubro." },
    { q: isEn ? "What does Pro Metrics measure?" : "Que mide Pro Metrics?", a: isEn ? "Visits, clicks, conversion, time on page, weekly traffic and technical scores." : "Visitas, clics, conversion, tiempo en pagina, trafico semanal y rendimiento tecnico." },
    { q: isEn ? "What does AI do?" : "Que hace la IA?", a: isEn ? "Business: basic copy. Pro: advanced descriptions, CTA and structure optimization." : "Business: copy basico. Pro: descripciones, CTA y optimizacion avanzada." },
    { q: isEn ? "Can I cancel anytime?" : "Puedo cancelar cuando quiera?", a: isEn ? "Yes, anytime from billing." : "Si, cuando quieras desde billing." },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }
  if (user) return null;

  return (
    <main className="relative overflow-hidden pb-24 md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.15),transparent_55%)]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 md:pt-36 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">FastPage SaaS Suite</p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{intentMap[intent].title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">{copy.heroSubtitle}</p>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">{intentMap[intent].subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={intentMap[intent].cta} data-event="cta_primary_click" onClick={() => trackLandingEvent("cta_primary_click", { location: "hero", intent })} className="btn btn-deluxe px-6 py-3 text-sm font-black uppercase tracking-[0.12em]">{copy.ctaPrimary}</Link>
              <button type="button" data-event="view_demo_click" onClick={() => { trackLandingEvent("view_demo_click", { location: "hero" }); scrollToSection("demos"); }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/50 hover:bg-amber-300/10">{copy.ctaDemo}</button>
              <button type="button" data-event="view_pricing_click" onClick={() => { trackLandingEvent("view_pricing_click", { location: "hero" }); scrollToSection("pricing"); }} className="text-sm font-semibold text-amber-300 underline-offset-4 transition hover:text-amber-200 hover:underline">{copy.ctaPricing}</button>
            </div>
            <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{copy.selector}</p>
            <div className="flex flex-wrap gap-2">
              {(["landing", "store", "menu", "clone"] as IntentId[]).map((id) => (
                <button key={id} type="button" onClick={() => setIntent(id)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${intent === id ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/20 bg-white/5 text-zinc-300 hover:border-white/40 hover:text-white"}`}>{id === "landing" ? "Landing" : id === "store" ? "Online Store" : id === "menu" ? "Carta Digital" : "Cloner"}</button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex flex-wrap gap-2">
              {modules.map((m) => (
                <button key={m.id} onClick={() => setPreviewModule(m.id)} className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${previewModule === m.id ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/15 bg-white/[0.03] text-zinc-300"}`}>{m.title}</button>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{modules.find((m) => m.id === previewModule)?.title}</p>
              <p className="mt-3 text-2xl font-black text-white">{modules.find((m) => m.id === previewModule)?.line}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-xs text-zinc-400">Flow</p><p className="text-sm font-bold text-white">Draft - Publish - Metrics</p></div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-xs text-zinc-400">Plans</p><p className="text-sm font-bold text-white">Free / Business / Pro</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.modulesTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">{copy.modulesSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.id} href={m.href} data-event={`module_click_${m.id}`} onClick={() => trackLandingEvent(`module_click_${m.id}`, { destination: m.href })} className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-amber-300/40">
                <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2.5"><Icon className="h-5 w-5 text-amber-300" /></div>
                <p className="mt-4 text-lg font-black text-white">{m.title}</p>
                <p className="mt-2 text-sm text-zinc-300">{m.line}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-amber-300">{copy.ctaDemo}<ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.howTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">{copy.howSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { id: "1", title: "Elige", text: "Template, Builder o Cloner segun tu objetivo." },
            { id: "2", title: "Personaliza", text: "Textos, colores, imagenes, IA y estructura de conversion." },
            { id: "3", title: "Publica y Mide", text: "Dominio, metricas y mejoras continuas por datos reales." },
          ].map((step) => (
            <article key={step.id} className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">{step.id}</p>
              <p className="mt-3 text-xl font-black text-white">{step.title}</p>
              <p className="mt-2 text-sm text-zinc-300">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.useCasesTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { icon: "🍽️", title: "Restaurantes", href: "/linkhub" },
            { icon: "🛒", title: "Ecommerce", href: "/store" },
            { icon: "🧰", title: "Servicios", href: "/templates" },
            { icon: "📈", title: "Consultoria", href: "/templates" },
            { icon: "🎓", title: "Eventos / Cursos", href: "/templates" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="rounded-2xl border border-white/10 bg-black/35 p-5 transition hover:border-amber-300/50">
              <p className="text-2xl">{item.icon}</p>
              <p className="mt-3 text-lg font-black text-white">{item.title}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-amber-300">
                Ver plantilla ideal
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center"><h2 className="text-3xl font-black text-white md:text-4xl">{copy.demosTitle}</h2></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {demos.map((demo) => (
            <article key={demo.title} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90">
              <div className={`h-32 ${demo.group === "menu" ? "bg-gradient-to-br from-amber-400/25 to-red-500/20" : "bg-gradient-to-br from-cyan-400/20 to-blue-500/20"} p-4`}>
                <span className="inline-flex rounded-full border border-white/30 bg-black/40 px-2 py-1 text-xs font-bold text-white">{demo.group === "menu" ? "Carta Digital" : "Online Store"}</span>
              </div>
              <div className="p-4">
                <p className="text-lg font-black text-white">{demo.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{demo.subtitle}</p>
                <Link href={demo.href} data-event="view_demo_click" onClick={() => trackLandingEvent("view_demo_click", { type: demo.group })} className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">Abrir demo</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center"><h2 className="text-3xl font-black text-white md:text-4xl">{copy.pricingTitle}</h2></div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-black/45 p-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">FREE</p><p className="mt-2 text-4xl font-black text-white">S/ 0</p><ul className="mt-5 space-y-2 text-sm text-zinc-300"><li>1 proyecto activo</li><li>10 productos por proyecto</li><li>Sin dominio propio</li><li>Branding visible</li><li>Sin IA</li></ul></article>
          <article className="relative rounded-3xl border border-amber-300/40 bg-gradient-to-b from-amber-300/10 to-black/60 p-6"><span className="absolute -top-3 right-4 rounded-full border border-amber-300/40 bg-black px-3 py-1 text-xs font-bold text-amber-200">Mas popular</span><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">BUSINESS</p><p className="mt-2 text-4xl font-black text-white">S/ 59</p><ul className="mt-5 space-y-2 text-sm text-zinc-200"><li>5 proyectos activos</li><li><strong>50 productos</strong> por proyecto</li><li>Dominio propio permitido</li><li>IA basica</li><li>Metricas basicas</li></ul></article>
          <article className="relative rounded-3xl border border-cyan-300/35 bg-gradient-to-b from-cyan-300/10 to-black/60 p-6"><span className="absolute -top-3 right-4 rounded-full border border-cyan-300/40 bg-black px-3 py-1 text-xs font-bold text-cyan-100">Mejor valor</span><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">PRO</p><p className="mt-2 text-4xl font-black text-white">S/ 99</p><ul className="mt-5 space-y-2 text-sm text-zinc-200"><li>20 proyectos activos</li><li><strong>Productos ilimitados</strong></li><li><strong>Branding removible</strong></li><li><strong>IA avanzada</strong></li><li>Metricas PRO + insights</li></ul></article>
        </div>
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">El dominio lo compra el cliente externamente. Desde Business puedes conectarlo en FastPage.</p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-left text-zinc-300">
                <th className="px-4 py-3 font-bold">Feature</th>
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
          <h2 className="text-3xl font-black text-white md:text-4xl">Equipos que ya venden con FastPage</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            Restaurantes, ecommerce y agencias lanzan mas rapido y mejoran conversion con una sola plataforma.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { quote: "Lanzamos 11 proyectos en una semana sin aumentar equipo.", author: "Growth Agency", role: "Agencias" },
            { quote: "Duplicamos pedidos por WhatsApp tras migrar a Carta Digital.", author: "Marca gastronica", role: "Restaurantes" },
            { quote: "Pro Metrics nos mostro que cambiar CTA subio conversion.", author: "Ecommerce Team", role: "Tienda online" },
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

      <section className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center"><h2 className="text-3xl font-black text-white md:text-4xl">{copy.faqTitle}</h2></div>
        <div className="space-y-3">
          {faqs.map((item) => (
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
          <p className="text-3xl font-black text-white md:text-4xl">{copy.finalTitle}</p>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">{copy.finalSubtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth?tab=register" onClick={() => trackLandingEvent("cta_primary_click", { location: "final" })} className="btn btn-deluxe px-6 py-3 text-sm font-black uppercase tracking-[0.12em]">{copy.ctaPrimary}</Link>
            <button type="button" onClick={() => { trackLandingEvent("view_pricing_click", { location: "final" }); scrollToSection("pricing"); }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/50 hover:bg-amber-300/10">{copy.ctaPricing}</button>
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
        <Link href={intentMap[intent].cta} data-event="cta_primary_click" onClick={() => trackLandingEvent("cta_primary_click", { location: "mobile_sticky", intent })} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/45 bg-black/90 px-4 py-3 text-sm font-black text-amber-200 shadow-2xl backdrop-blur-md">
          <Rocket className="h-4 w-4" />
          {copy.sticky}
        </Link>
      </div>

      <Footer />
    </main>
  );
}
