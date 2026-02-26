"use client";

import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe2,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PlayCircle,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  CheckCircle2,
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
  id: "builder" | "templates" | "cloner" | "store" | "menu" | "metrics";
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
    line: "Crea paginas que convierten clics en mensajes listos para comprar.",
    href: "/builder",
  },
  {
    id: "templates",
    icon: Palette,
    title: "Templates",
    line: "Lanza campanas en horas con copys que ya venden.",
    href: "/demo/services/consultoria-pro",
  },
  {
    id: "cloner",
    icon: Copy,
    title: "Cloner",
    line: "Replica ofertas ganadoras y acelera tus ventas.",
    href: "/cloner/web",
  },
  {
    id: "store",
    icon: ShoppingCart,
    title: "Online Store",
    line: "Muestra productos y cierra pedidos por WhatsApp sin friccion.",
    href: "/demo/ecommerce/urban-wear",
  },
  {
    id: "menu",
    icon: UtensilsCrossed,
    title: "Carta Digital",
    line: "Recibe mas pedidos en hora punta desde un solo link.",
    href: "/demo/restaurant/sushi-prime",
  },
  {
    id: "metrics",
    icon: BarChart3,
    title: "Pro Metrics",
    line: "Detecta que campana vende mas y escala con datos.",
    href: "/demo/services/pro-metrics",
  },
];

const FLOW_STEPS = [
  { title: "Visitas", icon: Globe2, description: "Trae trafico desde anuncios, redes y recomendaciones." },
  { title: "Landing", icon: MonitorSmartphone, description: "Convierte interes en pedidos, reservas o cotizaciones." },
  { title: "WhatsApp", icon: MessageCircle, description: "Responde rapido y cierra ventas en la misma conversacion." },
  { title: "Metricas", icon: BarChart3, description: "Mide que fuentes y productos generan mas ingresos." },
  { title: "Escala", icon: Rocket, description: "Duplica lo que funciona sin perder tiempo ni presupuesto." },
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

const TESTIMONIALS = [
  {
    name: "Mariana Quispe",
    city: "Lima, Peru",
    segment: "Carta Digital",
    quote: "Con la carta digital pasamos de pedidos sueltos a un flujo diario por WhatsApp.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Carlos Gutierrez",
    city: "Arequipa, Peru",
    segment: "Carta Digital",
    quote: "El buscador y categorias hicieron que nuestros clientes pidan mas rapido.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Javier Rojas",
    city: "Trujillo, Peru",
    segment: "Online Store",
    quote: "Con FastPage nuestra tienda online cerro ventas desde el primer fin de semana.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Diana Salazar",
    city: "Cusco, Peru",
    segment: "Landing Servicios",
    quote: "La landing para servicios nos trae leads listos para agendar por WhatsApp.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Fernando Paredes",
    city: "Chiclayo, Peru",
    segment: "Online Store",
    quote: "Mejoramos conversion en trafico frio y subimos el ticket promedio.",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Sofia Herrera",
    city: "Piura, Peru",
    segment: "Carta Digital",
    quote: "Los platos destacados elevaron nuestros pedidos en horas punta.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Miguel Campos",
    city: "Bogota, Colombia",
    segment: "Landing Servicios",
    quote: "Pasamos de depender de referidos a captar clientes con anuncios y landing.",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Valentina Castro",
    city: "Medellin, Colombia",
    segment: "Online Store",
    quote: "La tienda quedo lista para campanas y ahora vendemos todos los dias.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Luis Mendoza",
    city: "Quito, Ecuador",
    segment: "Carta Digital",
    quote: "Reducimos llamadas y centralizamos pedidos desde un solo link.",
    avatar:
      "https://images.unsplash.com/photo-1542204625-de293a06df33?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Camila Navarro",
    city: "Guayaquil, Ecuador",
    segment: "Landing Servicios",
    quote: "Con IA ajustamos el copy y aumentamos consultas calificadas.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Andres Molina",
    city: "Santiago, Chile",
    segment: "Online Store",
    quote: "La experiencia mobile nos ayudo a convertir mejor que nuestro sitio anterior.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Paula Ibanez",
    city: "Valparaiso, Chile",
    segment: "Carta Digital",
    quote: "Nuestros clientes ahora encuentran promociones en segundos.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Daniela Ponce",
    city: "CDMX, Mexico",
    segment: "Online Store",
    quote: "El checkout por WhatsApp nos simplifico ventas y seguimiento.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Ricardo Leon",
    city: "Monterrey, Mexico",
    segment: "Landing Servicios",
    quote: "FastPage nos dio una landing de alto impacto sin depender de programadores.",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Gabriela Flores",
    city: "Puebla, Mexico",
    segment: "Carta Digital",
    quote: "La carta digital ordeno nuestra operacion de delivery en un dia.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Jose Zamora",
    city: "Santa Cruz, Bolivia",
    segment: "Online Store",
    quote: "Con temas y ofertas dinamicas aumentamos conversion desde Instagram Ads.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Lucia Ortega",
    city: "La Paz, Bolivia",
    segment: "Landing Servicios",
    quote: "Pasamos de pocos mensajes a una agenda estable de reuniones semanales.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Diego Ferreyra",
    city: "Buenos Aires, Argentina",
    segment: "Online Store",
    quote: "La estructura del catalogo nos permitio escalar campanas sin friccion.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Natalia Acosta",
    city: "Cordoba, Argentina",
    segment: "Carta Digital",
    quote: "Con chips por categoria los clientes compran mas combinaciones.",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Hector Villanueva",
    city: "Asuncion, Paraguay",
    segment: "Landing Servicios",
    quote: "FastPage nos ayudo a presentar mejor nuestra oferta y cerrar mas rapido.",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=320&auto=format&fit=crop",
  },
];

type LiveActivityItem = {
  name: string;
  city: string;
  action: string;
  timeAgo: string;
};

const LIVE_ACTIVITY_FEED: LiveActivityItem[] = [
  { name: "Jorge M.", city: "Piura", action: "conecto su WhatsApp y activo su Carta Digital", timeAgo: "Hace 1 min" },
  { name: "Valeria R.", city: "Lima", action: "publico su tienda online y recibio 2 pedidos", timeAgo: "Hace 2 min" },
  { name: "Sushi Prime", city: "Arequipa", action: "convirtio 5 mensajes en ventas", timeAgo: "Hace 3 min" },
  { name: "Urban Wear", city: "Trujillo", action: "cerro 3 ventas desde WhatsApp", timeAgo: "Hace 4 min" },
  { name: "Cafe Nativo", city: "Cusco", action: "activo promociones en Carta Digital", timeAgo: "Hace 5 min" },
  { name: "Luna Store", city: "Chiclayo", action: "recibio su primer carrito por WhatsApp", timeAgo: "Hace 6 min" },
  { name: "Tacos MX", city: "CDMX", action: "aumento conversion desde menu digital", timeAgo: "Hace 7 min" },
  { name: "NovaTech", city: "Bogota", action: "convirtio trafico en 4 consultas por WhatsApp", timeAgo: "Hace 8 min" },
  { name: "Maki House", city: "Quito", action: "activo botones de pedido directo", timeAgo: "Hace 9 min" },
  { name: "Casa Natura", city: "Medellin", action: "cerro 6 ventas con Online Store", timeAgo: "Hace 10 min" },
  { name: "Deli Burger", city: "Guayaquil", action: "publico nueva carta y subio pedidos", timeAgo: "Hace 11 min" },
  { name: "Fit Market", city: "Santiago", action: "activo checkout por WhatsApp", timeAgo: "Hace 12 min" },
  { name: "Don Anticucho", city: "Lima", action: "logro 9 pedidos en hora punta", timeAgo: "Hace 13 min" },
  { name: "Trendy Shop", city: "Monterrey", action: "recibio 5 ventas desde anuncios", timeAgo: "Hace 14 min" },
  { name: "Punto Verde", city: "Santa Cruz", action: "convirtio visitas en ventas por chat", timeAgo: "Hace 15 min" },
  { name: "Pan & Cafe", city: "La Paz", action: "activo CTA de pedido por WhatsApp", timeAgo: "Hace 16 min" },
  { name: "Beauty Home", city: "Puebla", action: "publico catalogo y cerro 3 ventas", timeAgo: "Hace 17 min" },
  { name: "Parrilla 51", city: "Buenos Aires", action: "aumento reservas desde Carta Digital", timeAgo: "Hace 18 min" },
  { name: "Smart Lab", city: "Cordoba", action: "convirtio 7 leads en conversaciones", timeAgo: "Hace 19 min" },
  { name: "Moda Street", city: "Asuncion", action: "activo ofertas y vendio por WhatsApp", timeAgo: "Hace 20 min" },
  { name: "Crustaceo", city: "Piura", action: "subio el ticket promedio con combos", timeAgo: "Hace 21 min" },
  { name: "Flash Store", city: "Lima", action: "recibio pago confirmado desde chat", timeAgo: "Hace 22 min" },
  { name: "Sabor Criollo", city: "Arequipa", action: "reactivo clientes con menu digital", timeAgo: "Hace 23 min" },
  { name: "Electro Home", city: "Trujillo", action: "convirtio mensajes en ventas del dia", timeAgo: "Hace 24 min" },
];

const DELUXE_BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/45 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 px-5 py-2.5 text-sm font-black text-amber-100 shadow-[inset_0_1px_0_rgba(251,191,36,0.32),0_10px_24px_-16px_rgba(251,191,36,0.55)] transition hover:-translate-y-0.5 hover:border-amber-300/70 hover:text-amber-50 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/55";
const SOFT_BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50";

export default function LandingHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vertical, setVertical] = useState<BusinessVertical>("restaurant");
  const [demoTab, setDemoTab] = useState<BusinessVertical>("restaurant");
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivityIndex((current) => (current + 1) % LIVE_ACTIVITY_FEED.length);
    }, 3800);
    return () => window.clearInterval(intervalId);
  }, []);

  const verticalCopy = useMemo(() => getVerticalCopy(vertical), [vertical]);
  const heroDemoHref = useMemo(() => verticalToDemoHref(vertical), [vertical]);
  const heroSignupHref = useMemo(() => verticalToSignupHref(vertical), [vertical]);
  const demoItems = useMemo(() => getDemoCatalog(demoTab), [demoTab]);
  const activeLiveActivity = LIVE_ACTIVITY_FEED[activityIndex];

  const scrollTestimonials = (direction: "left" | "right") => {
    const container = testimonialsRef.current;
    if (!container) return;
    const card = container.querySelector("article") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 380;
    const offset = direction === "left" ? -step : step;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

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
              Mas pedidos por WhatsApp
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Convierte visitas en pedidos por WhatsApp, todos los dias
            </h1>
            <p className="max-w-2xl text-base text-zinc-300 md:text-lg">
              FastPage te ayuda a vender mas con landing, tienda y carta digital en un solo sistema.
            </p>
            <p className="max-w-2xl text-sm text-zinc-400">{verticalCopy.subheadline}</p>
            <p className="max-w-2xl text-xs font-semibold text-amber-200/90">
              +120 negocios ya activaron su flujo de pedidos y ventas en FastPage.
            </p>

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
                className={`${DELUXE_BUTTON_BASE} rounded-full px-7 py-3 uppercase tracking-[0.12em]`}
              >
                Crear mi version gratis
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
                className={`${SOFT_BUTTON_BASE} rounded-full px-6 py-3 uppercase tracking-[0.12em]`}
              >
                <PlayCircle className="h-4 w-4" /> Ver demo en vivo</Link>
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
                Ver planes
              </a>
            </div>
            <p className="text-xs font-semibold text-amber-200/85">
              Esta semana es clave para vender mas: activa tu version hoy.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Listo en minutos", "Pedidos por WhatsApp", "Sin comisiones"].map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Sistema FastPage</p>
            <h2 className="mt-3 text-3xl font-black text-white">{verticalCopy.headline}</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Elige una demo, adapta tu negocio y empieza a vender hoy.
            </p>
            <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2">
              {FLOW_STEPS.map((step) => (
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
              className={`${DELUXE_BUTTON_BASE} mt-5 w-full rounded-xl px-4 py-2.5 text-base`}
            >
              Abrir demo y vender
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="sistema-fastpage" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Sistema FastPage</h2>
          <p className="mx-auto mt-3 hidden max-w-3xl text-zinc-300 sm:block">
            Atraes visitas, conviertes en WhatsApp y mides ventas para escalar.
          </p>
          <div className="mx-auto mt-3 grid max-w-sm grid-cols-5 gap-2 sm:hidden">
            {FLOW_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={`mobile-step-${step.title}`} className="relative flex flex-col items-center gap-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-300">{step.title}</p>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/40 bg-zinc-950 shadow-[inset_0_1px_0_rgba(251,191,36,0.25),0_8px_18px_-14px_rgba(251,191,36,0.55)]">
                    <Icon className="h-4 w-4 text-amber-300" />
                  </span>
                  {index < FLOW_STEPS.length - 1 ? (
                    <ArrowRight className="absolute -right-2 top-[1.95rem] h-3.5 w-3.5 text-amber-300/80" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div className="hidden gap-3 md:grid md:grid-cols-[repeat(9,minmax(0,1fr))] md:items-center">
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
            Todo lo que necesitas para atraer clientes, convertir pedidos y aumentar ventas.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
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
                className="group flex aspect-square flex-col rounded-2xl border border-white/10 bg-black/40 p-3 transition hover:-translate-y-1 hover:border-amber-300/45 md:p-4"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-3 text-base font-black text-white md:text-lg">{module.title}</p>
                <p className="mt-1 text-xs leading-snug text-zinc-300 md:text-sm">{module.line}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-amber-300 md:text-sm">
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
              copy: "Mas pedidos directos por WhatsApp y menos tiempo al telefono.",
            },
            {
              vertical: "ecommerce" as const,
              icon: Store,
              copy: "Convierte trafico en compras con catalogo y cierre en chat.",
            },
            {
              vertical: "services" as const,
              icon: MessageCircle,
              copy: "Capta clientes listos para agendar y cerrar por WhatsApp.",
            },
          ].map((item) => {
            const Icon = item.icon;
            const itemCopy = getVerticalCopy(item.vertical);
            return (
              <article key={item.vertical} className="rounded-2xl border border-white/10 bg-black/45 p-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                  <Icon className="h-4 w-4 text-amber-300" />
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
                    className={`${SOFT_BUTTON_BASE} rounded-xl px-4 py-2`}
                  >Ver demo en vivo</Link>
                  <Link
                    href={`/signup?vertical=${item.vertical}`}
                    onClick={() =>
                      void trackGrowthEvent("click_cta_signup", {
                        vertical: item.vertical,
                        location: "rubro_card",
                      })
                    }
                    className={`${DELUXE_BUTTON_BASE} rounded-xl px-4 py-2`}
                  >Crear mi version</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black text-white md:text-4xl">Demos que ya venden por rubro</h2>
            <p className="mt-2 text-zinc-300">Explora casos listos para captar clientes y cerrar pedidos por WhatsApp.</p>
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
          <h2 className="text-3xl font-black text-white md:text-4xl">Planes para vender y escalar</h2>
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
          Conecta tu dominio desde Business y manten una marca profesional.
        </p>
        <p className="mt-2 text-center text-xs font-semibold text-zinc-300">
          Empieza gratis. Sin compromisos.
        </p>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-black text-white md:text-4xl">Resultados de negocios reales</h2>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Desplazar testimonios a la izquierda"
              onClick={() => scrollTestimonials("left")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Desplazar testimonios a la derecha"
              onClick={() => scrollTestimonials("right")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div
          ref={testimonialsRef}
          className="no-scrollbar w-full max-w-full flex gap-4 overflow-x-auto px-2 pb-2 snap-x snap-mandatory [direction:rtl] md:[direction:ltr]"
        >
          {TESTIMONIALS.map((item) => (
            <article
              key={`${item.name}-${item.city}`}
              className="snap-start [direction:ltr] aspect-square w-[82vw] max-w-[360px] shrink-0 rounded-2xl border border-white/10 bg-black/45 p-5 md:aspect-auto md:min-h-[250px] md:w-[360px]"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-300/30">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{item.name}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.14em] text-zinc-400">{item.city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-200">&quot;{item.quote}&quot;</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-amber-300">{item.segment}</p>
              <div className="mt-3 flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Sparkles key={`${item.name}-${index}`} className="h-4 w-4" />
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
          {["WhatsApp", "Pedidos", "Reservas", "Checkout", "Metricas", "Conversion"].map((badge) => (
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
          {FAQS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <article
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/45 transition-all duration-300"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenFaqIndex((current) => (current === index ? -1 : index))
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-bold text-white md:text-base">{item.q}</span>
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-amber-300" : ""
                    }`}
                  />
                </button>
                <div
                  id={panelId}
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-300 transition-all duration-300 ${
                        isOpen ? "translate-y-0" : "-translate-y-1"
                      }`}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-black/70 to-cyan-300/10 p-8 text-center">
          <p className="text-3xl font-black text-white md:text-4xl">Empieza hoy y recibe mas pedidos por WhatsApp</p>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">
            Activa tu demo, personaliza tu negocio y publica en minutos.
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
              className={`${DELUXE_BUTTON_BASE} rounded-full px-6 py-3 uppercase tracking-[0.12em]`}
            >Probar gratis ahora</Link>
            <Link
              href={heroDemoHref}
              onClick={() =>
                void trackGrowthEvent("click_demo_open", {
                  vertical,
                  slug: "final",
                })
              }
              className={`${SOFT_BUTTON_BASE} rounded-full px-6 py-3 uppercase tracking-[0.12em]`}
            >Ver demo en vivo</Link>
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden w-[min(360px,calc(100vw-3rem))] max-w-full lg:block">
        <article className="rounded-2xl border border-amber-300/35 bg-[linear-gradient(145deg,rgba(8,8,10,0.96),rgba(22,16,6,0.96))] p-3 shadow-[0_18px_45px_-24px_rgba(251,191,36,0.65)] backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-300/30 bg-black/70 text-amber-300">
              <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">
                  ACTIVIDAD EN VIVO
                </p>
                <p className="text-[10px] font-semibold text-zinc-400">{activeLiveActivity.timeAgo}</p>
              </div>
              <p className="mt-1 truncate text-[1.05rem] font-black text-white">
                {activeLiveActivity.name}
                <span className="pl-1 text-sm font-semibold text-zinc-300">de {activeLiveActivity.city}</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold leading-snug text-zinc-100">
                <span>{activeLiveActivity.action}</span>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden">
        <Link
          href={heroSignupHref}
          onClick={() =>
            void trackGrowthEvent("click_cta_signup", {
              vertical,
              location: "mobile_sticky",
            })
          }
          className={`${DELUXE_BUTTON_BASE} w-full rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md`}
        >
          <Rocket className="h-4 w-4" />
          Crear mi version gratis
        </Link>
      </div>

      <Footer />
    </main>
  );
}
