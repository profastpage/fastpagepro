"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Copy,
  Globe2,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PlayCircle,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import VerticalSelector from "@/components/demo/VerticalSelector";
import PwaInstallTopBanner from "@/components/pwa/PwaInstallTopBanner";
import { useLanguage } from "@/context/LanguageContext";
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

const HeroOrbScene = dynamic(() => import("@/components/landing/HeroOrbScene"), {
  ssr: false,
});
const LandingHomeSecondarySectionsDynamic = dynamic(
  () => import("@/components/landing/LandingHomeSecondarySections"),
);

type ModuleCard = {
  id: "builder" | "templates" | "cloner" | "store" | "menu" | "metrics";
  title: string;
  line: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type HeroMetric = {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const MODULES_ES: ModuleCard[] = [
  {
    id: "menu",
    icon: UtensilsCrossed,
    title: "Carta Digital",
    line: "Recibe mas pedidos en hora punta desde un solo link.",
    href: "/demo/restaurant/sushi-prime",
  },
  {
    id: "store",
    icon: ShoppingCart,
    title: "Tienda Online",
    line: "Muestra productos y cierra pedidos por WhatsApp sin friccion.",
    href: "/demo/ecommerce/urban-wear",
  },
  {
    id: "builder",
    icon: WandSparkles,
    title: "Constructor",
    line: "Crea paginas que convierten clics en mensajes listos para comprar.",
    href: "/builder",
  },
  {
    id: "templates",
    icon: Palette,
    title: "Plantillas",
    line: "Lanza campanas en horas con copys que ya venden.",
    href: "/demo/services/consultoria-pro",
  },
  {
    id: "cloner",
    icon: Copy,
    title: "Clonador",
    line: "Replica ofertas ganadoras y acelera tus ventas.",
    href: "/cloner/web",
  },
  {
    id: "metrics",
    icon: BarChart3,
    title: "Metricas PRO",
    line: "Detecta que campana vende mas y escala con datos.",
    href: "/demo/services/pro-metrics",
  },
];

const MODULES_EN: ModuleCard[] = [
  {
    id: "menu",
    icon: UtensilsCrossed,
    title: "Digital Menu",
    line: "Get more peak-hour orders from one single link.",
    href: "/demo/restaurant/sushi-prime",
  },
  {
    id: "store",
    icon: ShoppingCart,
    title: "Online Store",
    line: "Show products and close WhatsApp orders friction-free.",
    href: "/demo/ecommerce/urban-wear",
  },
  {
    id: "builder",
    icon: WandSparkles,
    title: "Builder",
    line: "Create pages that turn clicks into ready-to-buy chats.",
    href: "/builder",
  },
  {
    id: "templates",
    icon: Palette,
    title: "Templates",
    line: "Launch campaigns in hours with copy that already sells.",
    href: "/demo/services/consultoria-pro",
  },
  {
    id: "cloner",
    icon: Copy,
    title: "Cloner",
    line: "Replicate winning offers and accelerate your sales.",
    href: "/cloner/web",
  },
  {
    id: "metrics",
    icon: BarChart3,
    title: "Pro Metrics",
    line: "Identify what sells best and scale with data.",
    href: "/demo/services/pro-metrics",
  },
];

const FLOW_STEPS_ES = [
  { title: "Visitas", icon: Globe2, description: "Trae trafico desde anuncios, redes y recomendaciones." },
  { title: "Landing", icon: MonitorSmartphone, description: "Convierte interes en pedidos, reservas o cotizaciones." },
  { title: "WhatsApp", icon: MessageCircle, description: "Responde rapido y cierra ventas en la misma conversacion." },
  { title: "Metricas", icon: BarChart3, description: "Mide que fuentes y productos generan mas ingresos." },
  { title: "Escala", icon: Rocket, description: "Duplica lo que funciona sin perder tiempo ni presupuesto." },
];

const FLOW_STEPS_EN = [
  { title: "Traffic", icon: Globe2, description: "Bring traffic from ads, social channels, and referrals." },
  { title: "Landing", icon: MonitorSmartphone, description: "Turn interest into orders, bookings, or quotes." },
  { title: "WhatsApp", icon: MessageCircle, description: "Reply fast and close sales in the same chat." },
  { title: "Metrics", icon: BarChart3, description: "Measure which sources and products generate more revenue." },
  { title: "Scale", icon: Rocket, description: "Double down on what works without wasting time or budget." },
];

const HERO_METRICS_ES: HeroMetric[] = [
  { value: "+120", label: "Negocios activos", icon: Store },
  { value: "24/7", label: "Ventas activas", icon: ShieldCheck },
  { value: "0%", label: "Comision por venta", icon: BarChart3 },
];

const HERO_METRICS_EN: HeroMetric[] = [
  { value: "+120", label: "Active businesses", icon: Store },
  { value: "24/7", label: "Always selling", icon: ShieldCheck },
  { value: "0%", label: "Commission per sale", icon: BarChart3 },
];

const DEMO_TAB_CONFIG_ES: Record<BusinessVertical, string> = {
  restaurant: "Carta Digital",
  ecommerce: "Tienda Online",
  services: "Landing",
};

const DEMO_TAB_CONFIG_EN: Record<BusinessVertical, string> = {
  restaurant: "Digital Menu",
  ecommerce: "Online Store",
  services: "Landing",
};

const FAQS_ES = [
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
    a: "Todo proyecto publicado desde Constructor, Plantillas, Clonador, Carta Digital o Tienda Online.",
  },
  {
    q: "Carta Digital vs Tienda Online?",
    a: "Carta Digital es para restaurantes. Tienda Online es ecommerce multirubro.",
  },
  {
    q: "Que mide Metricas PRO?",
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

const FAQS_EN = [
  {
    q: "Do I need coding skills to use FastPage?",
    a: "No. Everything is visual and you can publish without writing code.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. From Business plan, you can connect a domain bought by your business.",
  },
  {
    q: "Can I remove branding?",
    a: "Yes, on Pro plan (and Agency when enabled).",
  },
  {
    q: "What is an active project?",
    a: "Any published project from Builder, Templates, Cloner, Digital Menu, or Online Store.",
  },
  {
    q: "Digital Menu vs Online Store?",
    a: "Digital Menu is for restaurants. Online Store is for multi-category ecommerce.",
  },
  {
    q: "What does Pro Metrics track?",
    a: "Visits, conversion, time on page, clicks, weekly traffic, and technical performance.",
  },
  {
    q: "What does AI do?",
    a: "Business: basic copy help. Pro: advanced optimization for structure, copy, and conversion.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel from billing whenever you need.",
  },
];

type TestimonialItem = {
  name: string;
  city: string;
  segment: string;
  quote: string;
  avatar: string;
};

const TESTIMONIALS_ES: TestimonialItem[] = [
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

const TESTIMONIALS_EN: TestimonialItem[] = [
  {
    name: "Mariana Quispe",
    city: "Lima, Peru",
    segment: "Digital Menu",
    quote: "With the digital menu, we went from random orders to a daily WhatsApp flow.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Carlos Gutierrez",
    city: "Arequipa, Peru",
    segment: "Digital Menu",
    quote: "Search and categories helped our customers order much faster.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Javier Rojas",
    city: "Trujillo, Peru",
    segment: "Online Store",
    quote: "With FastPage our online store closed sales from the very first weekend.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Diana Salazar",
    city: "Cusco, Peru",
    segment: "Service Landing",
    quote: "Our services landing now brings leads ready to book through WhatsApp.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Fernando Paredes",
    city: "Chiclayo, Peru",
    segment: "Online Store",
    quote: "We improved cold-traffic conversion and increased average ticket size.",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Sofia Herrera",
    city: "Piura, Peru",
    segment: "Digital Menu",
    quote: "Featured dishes increased our orders during peak hours.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Miguel Campos",
    city: "Bogota, Colombia",
    segment: "Service Landing",
    quote: "We stopped depending on referrals and started acquiring clients with ads and landing pages.",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Valentina Castro",
    city: "Medellin, Colombia",
    segment: "Online Store",
    quote: "The store was campaign-ready and now we sell every single day.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Luis Mendoza",
    city: "Quito, Ecuador",
    segment: "Digital Menu",
    quote: "We reduced phone calls and centralized orders from one single link.",
    avatar:
      "https://images.unsplash.com/photo-1542204625-de293a06df33?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Camila Navarro",
    city: "Guayaquil, Ecuador",
    segment: "Service Landing",
    quote: "With AI copy optimization, we increased qualified inquiries.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Andres Molina",
    city: "Santiago, Chile",
    segment: "Online Store",
    quote: "The mobile experience converted better than our previous website.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Paula Ibanez",
    city: "Valparaiso, Chile",
    segment: "Digital Menu",
    quote: "Our customers now find promotions in seconds.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Daniela Ponce",
    city: "CDMX, Mexico",
    segment: "Online Store",
    quote: "WhatsApp checkout simplified sales and follow-up.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Ricardo Leon",
    city: "Monterrey, Mexico",
    segment: "Service Landing",
    quote: "FastPage gave us a high-impact landing without depending on developers.",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Gabriela Flores",
    city: "Puebla, Mexico",
    segment: "Digital Menu",
    quote: "The digital menu organized our delivery operation in one day.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Jose Zamora",
    city: "Santa Cruz, Bolivia",
    segment: "Online Store",
    quote: "With dynamic themes and offers, we increased conversion from Instagram Ads.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Lucia Ortega",
    city: "La Paz, Bolivia",
    segment: "Service Landing",
    quote: "We went from a few messages to a stable weekly meeting schedule.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Diego Ferreyra",
    city: "Buenos Aires, Argentina",
    segment: "Online Store",
    quote: "The catalog structure let us scale campaigns without friction.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Natalia Acosta",
    city: "Cordoba, Argentina",
    segment: "Digital Menu",
    quote: "With category chips, customers buy more combinations.",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=320&auto=format&fit=crop",
  },
  {
    name: "Hector Villanueva",
    city: "Asuncion, Paraguay",
    segment: "Service Landing",
    quote: "FastPage helped us present our offer better and close faster.",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=320&auto=format&fit=crop",
  },
];

type LiveActivityItem = {
  name: string;
  city: string;
  action: string;
  minutesAgo: number;
};

const LIVE_ACTIVITY_FEED_ES: LiveActivityItem[] = [
  { name: "Jorge M.", city: "Piura", action: "conecto su WhatsApp y activo su Carta Digital", minutesAgo: 1 },
  { name: "Valeria R.", city: "Lima", action: "publico su tienda online y recibio 2 pedidos", minutesAgo: 2 },
  { name: "Sushi Prime", city: "Arequipa", action: "convirtio 5 mensajes en ventas", minutesAgo: 3 },
  { name: "Urban Wear", city: "Trujillo", action: "cerro 3 ventas desde WhatsApp", minutesAgo: 4 },
  { name: "Cafe Nativo", city: "Cusco", action: "activo promociones en Carta Digital", minutesAgo: 5 },
  { name: "Luna Store", city: "Chiclayo", action: "recibio su primer carrito por WhatsApp", minutesAgo: 6 },
  { name: "Tacos MX", city: "CDMX", action: "aumento conversion desde menu digital", minutesAgo: 7 },
  { name: "NovaTech", city: "Bogota", action: "convirtio trafico en 4 consultas por WhatsApp", minutesAgo: 8 },
  { name: "Maki House", city: "Quito", action: "activo botones de pedido directo", minutesAgo: 9 },
  { name: "Casa Natura", city: "Medellin", action: "cerro 6 ventas con Online Store", minutesAgo: 10 },
  { name: "Deli Burger", city: "Guayaquil", action: "publico nueva carta y subio pedidos", minutesAgo: 11 },
  { name: "Fit Market", city: "Santiago", action: "activo checkout por WhatsApp", minutesAgo: 12 },
  { name: "Don Anticucho", city: "Lima", action: "logro 9 pedidos en hora punta", minutesAgo: 13 },
  { name: "Trendy Shop", city: "Monterrey", action: "recibio 5 ventas desde anuncios", minutesAgo: 14 },
  { name: "Punto Verde", city: "Santa Cruz", action: "convirtio visitas en ventas por chat", minutesAgo: 15 },
  { name: "Pan & Cafe", city: "La Paz", action: "activo CTA de pedido por WhatsApp", minutesAgo: 16 },
  { name: "Beauty Home", city: "Puebla", action: "publico catalogo y cerro 3 ventas", minutesAgo: 17 },
  { name: "Parrilla 51", city: "Buenos Aires", action: "aumento reservas desde Carta Digital", minutesAgo: 18 },
  { name: "Smart Lab", city: "Cordoba", action: "convirtio 7 leads en conversaciones", minutesAgo: 19 },
  { name: "Moda Street", city: "Asuncion", action: "activo ofertas y vendio por WhatsApp", minutesAgo: 20 },
  { name: "Crustaceo", city: "Piura", action: "subio el ticket promedio con combos", minutesAgo: 21 },
  { name: "Flash Store", city: "Lima", action: "recibio pago confirmado desde chat", minutesAgo: 22 },
  { name: "Sabor Criollo", city: "Arequipa", action: "reactivo clientes con menu digital", minutesAgo: 23 },
  { name: "Electro Home", city: "Trujillo", action: "convirtio mensajes en ventas del dia", minutesAgo: 24 },
];

const LIVE_ACTIVITY_FEED_EN: LiveActivityItem[] = [
  { name: "Jorge M.", city: "Piura", action: "connected WhatsApp and activated the digital menu", minutesAgo: 1 },
  { name: "Valeria R.", city: "Lima", action: "published an online store and received 2 orders", minutesAgo: 2 },
  { name: "Sushi Prime", city: "Arequipa", action: "converted 5 chats into sales", minutesAgo: 3 },
  { name: "Urban Wear", city: "Trujillo", action: "closed 3 sales from WhatsApp", minutesAgo: 4 },
  { name: "Cafe Nativo", city: "Cusco", action: "activated promotions on digital menu", minutesAgo: 5 },
  { name: "Luna Store", city: "Chiclayo", action: "received first WhatsApp cart", minutesAgo: 6 },
  { name: "Tacos MX", city: "CDMX", action: "improved conversion from digital menu", minutesAgo: 7 },
  { name: "NovaTech", city: "Bogota", action: "turned traffic into 4 WhatsApp inquiries", minutesAgo: 8 },
  { name: "Maki House", city: "Quito", action: "enabled direct order buttons", minutesAgo: 9 },
  { name: "Casa Natura", city: "Medellin", action: "closed 6 sales with Online Store", minutesAgo: 10 },
  { name: "Deli Burger", city: "Guayaquil", action: "published a new menu and increased orders", minutesAgo: 11 },
  { name: "Fit Market", city: "Santiago", action: "enabled WhatsApp checkout", minutesAgo: 12 },
  { name: "Don Anticucho", city: "Lima", action: "achieved 9 orders in peak hour", minutesAgo: 13 },
  { name: "Trendy Shop", city: "Monterrey", action: "received 5 sales from ads", minutesAgo: 14 },
  { name: "Punto Verde", city: "Santa Cruz", action: "converted visits into chat sales", minutesAgo: 15 },
  { name: "Pan & Cafe", city: "La Paz", action: "enabled WhatsApp order CTA", minutesAgo: 16 },
  { name: "Beauty Home", city: "Puebla", action: "published catalog and closed 3 sales", minutesAgo: 17 },
  { name: "Parrilla 51", city: "Buenos Aires", action: "increased bookings from digital menu", minutesAgo: 18 },
  { name: "Smart Lab", city: "Cordoba", action: "turned 7 leads into conversations", minutesAgo: 19 },
  { name: "Moda Street", city: "Asuncion", action: "activated offers and sold via WhatsApp", minutesAgo: 20 },
  { name: "Crustaceo", city: "Piura", action: "raised average ticket with combo offers", minutesAgo: 21 },
  { name: "Flash Store", city: "Lima", action: "received a confirmed payment from chat", minutesAgo: 22 },
  { name: "Sabor Criollo", city: "Arequipa", action: "reactivated clients with digital menu", minutesAgo: 23 },
  { name: "Electro Home", city: "Trujillo", action: "converted chats into same-day sales", minutesAgo: 24 },
];

const DELUXE_BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/45 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 px-5 py-2.5 text-sm font-black text-amber-100 shadow-[inset_0_1px_0_rgba(251,191,36,0.32),0_10px_24px_-16px_rgba(251,191,36,0.55)] transition hover:-translate-y-0.5 hover:border-amber-300/70 hover:text-amber-50 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/55";
const SOFT_BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50";
const HERO_STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};
const HERO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};
const HERO_CTA_VARIANT_ES = "B" as "A" | "B";
const HERO_PRIMARY_CTA_LABEL_ES =
  HERO_CTA_VARIANT_ES === "A" ? "CREA TU NEGOCIO DIGITAL HOY" : "Crea tu negocio digital hoy";

const PRICING_FEATURES_ES = {
  starter: [
    "1 proyecto activo",
    "10 productos por proyecto",
    "🔒 Dominio propio (Business o Pro)",
    "Branding visible",
    "❌ Sin soporte directo",
    "🔒 IA (Business o Pro)",
  ],
  business: [
    "Hasta 5 proyectos activos",
    "50 productos por proyecto",
    "Dominio propio permitido",
    "IA basica",
    "Metricas basicas",
    "📧 Soporte por correo (max. 24h)",
    "🔒 Testimonios, copys PRO y galeria avanzada",
  ],
  pro: [
    "Hasta 20 proyectos activos",
    "Productos ilimitados",
    "Branding removible",
    "IA avanzada",
    "💬 Soporte en vivo por WhatsApp",
    "Metricas PRO + insights",
    "Testimonios reales con transicion por tema",
    "Copys de venta instantaneos por plato/producto",
    "Galeria PRO: hasta 5 fotos por producto",
    "Despacho configurable: delivery/recojo/comer en local",
  ],
} as const;

const PRICING_FEATURES_EN = {
  starter: [
    "1 active project",
    "10 products per project",
    "🔒 Custom domain (Business or Pro)",
    "Visible branding",
    "❌ No direct support",
    "🔒 AI (Business or Pro)",
  ],
  business: [
    "Up to 5 active projects",
    "50 products per project",
    "Custom domain enabled",
    "Basic AI",
    "Basic metrics",
    "📧 Email support (max 24h)",
    "🔒 Testimonials, PRO copy and advanced gallery",
  ],
  pro: [
    "Up to 20 active projects",
    "Unlimited products",
    "Removable branding",
    "Advanced AI",
    "💬 Live WhatsApp support",
    "Pro metrics + insights",
    "Real testimonials with theme transitions",
    "Instant sales copy per dish/product",
    "Pro gallery: up to 5 photos per product",
    "Configurable fulfillment: delivery/pickup/dine-in",
  ],
} as const;

export default function LandingHome() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [vertical, setVertical] = useState<BusinessVertical>("restaurant");
  const [activityIndex, setActivityIndex] = useState(0);
  const [enableHero3D, setEnableHero3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlVertical = normalizeVertical(
      new URLSearchParams(window.location.search).get("vertical"),
    );
    setVertical(urlVertical);
    persistVerticalChoice(urlVertical);
    persistUtmFromUrl();
    void trackGrowthEvent("page_view", {
      page: "landing_home",
      vertical: urlVertical,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resolve3D = () => {
      const navigatorWithMemory = window.navigator as Navigator & { deviceMemory?: number };
      const memory = navigatorWithMemory.deviceMemory ?? 8;
      const cores = window.navigator.hardwareConcurrency ?? 8;
      const isLowEnd = memory <= 3 || cores <= 4;
      setEnableHero3D(desktopMedia.matches && !reducedMotionMedia.matches && !isLowEnd);
    };

    resolve3D();

    const onMediaChange = () => resolve3D();
    desktopMedia.addEventListener("change", onMediaChange);
    reducedMotionMedia.addEventListener("change", onMediaChange);
    return () => {
      desktopMedia.removeEventListener("change", onMediaChange);
      reducedMotionMedia.removeEventListener("change", onMediaChange);
    };
  }, []);

  const liveActivityFeed = isEnglish ? LIVE_ACTIVITY_FEED_EN : LIVE_ACTIVITY_FEED_ES;
  const testimonials = isEnglish ? TESTIMONIALS_EN : TESTIMONIALS_ES;
  const pricingFeatures = isEnglish ? PRICING_FEATURES_EN : PRICING_FEATURES_ES;

  useEffect(() => {
    setActivityIndex(0);
  }, [isEnglish]);

  useEffect(() => {
    if (!liveActivityFeed.length) return;
    const intervalId = window.setInterval(() => {
      setActivityIndex((current) => (current + 1) % liveActivityFeed.length);
    }, 3800);
    return () => window.clearInterval(intervalId);
  }, [liveActivityFeed.length]);

  const copy = useMemo(
    () =>
      isEnglish
        ? {
            heroTag: "More WhatsApp orders",
            heroTitle: "Turn visits into WhatsApp orders, every day",
            heroDesc:
              "FastPage helps you sell more with landing, store, and digital menu in one system.",
            heroProof: "+120 businesses already activated their orders and sales flow in FastPage.",
            heroChecklist: [
              "Live in minutes",
              "No commissions per sale",
              "Pay and activate now",
            ],
            ctaPrimary: "Create your digital business today",
            ctaPrimaryHelper: "Plans from 29 soles/month • No commissions",
            ctaDemo: "Watch live demo",
            ctaPlans: "View plans",
            urgency: "This week is key to sell more: activate your version today.",
            chips: ["Ready in minutes", "WhatsApp orders", "No commissions"],
            panelTag: "FastPage System",
            panelDesc: "Pick a demo, adapt it to your business, and start selling today.",
            panelCta: "Open demo and sell",
            systemTitle: "FastPage System",
            systemDesc: "Attract traffic, convert on WhatsApp, and measure sales to scale.",
            allInOneTitle: "All in one",
            allInOneDesc:
              "Everything you need to attract customers, convert orders, and increase sales.",
            moduleCta: "View module",
            verticalTitle: "Choose your business type",
            verticalCards: [
              "Get more direct WhatsApp orders and spend less time on calls.",
              "Turn traffic into purchases with catalog and chat checkout.",
              "Capture clients ready to schedule and close by WhatsApp.",
            ],
            demosTitle: "Demos already selling by business type",
            demosDesc: "Explore ready-to-convert cases to capture clients and close WhatsApp orders.",
            pricingTitle: "Plans to sell and scale 💸",
            starterSubtitle: "Direct monthly payment (no trial) ⚡",
            starterAnnualDiscount: "Up to 10% off annual plan",
            starterCta: "Start now",
            businessBadge: "⭐ Most chosen",
            businessSubtitle: "Create your digital business today with support and key sales tools.",
            businessAnnualDiscount: "Up to 20% off annual plan",
            businessNote: "Immediate activation after payment.",
            businessCta: "Activate Business",
            proSubtitle: "Direct monthly payment to scale seriously (no trial) 🚀",
            proAnnualDiscount: "Up to 30% off annual plan",
            proCta: "Buy now",
            domainLine: "Connect your domain from Business and keep a professional brand.",
            riskFree: "No commissions per order. Cancel anytime.",
            resultsTitle: "Real business outcomes",
            testimonialsLeft: "Scroll testimonials left",
            testimonialsRight: "Scroll testimonials right",
            testimonialBadges: ["WhatsApp", "Orders", "Bookings", "Checkout", "Metrics", "Conversion"],
            faqTitle: "Frequently asked questions",
            finalTitle: "Start today and get more WhatsApp orders",
            finalDesc: "Activate your demo, personalize your business, and publish in minutes.",
            liveActivity: "LIVE ACTIVITY",
            from: "from",
          }
        : {
            heroTag: "MAS PEDIDOS POR WHATSAPP",
            heroTitle: "Convierte visitas en pedidos por WhatsApp en minutos",
            heroDesc:
              "Landing, tienda y carta digital conectadas a WhatsApp en un solo sistema.",
            heroProof: "Más de 120 negocios ya reciben pedidos por WhatsApp con FastPage.",
            heroChecklist: [
              "Activo en minutos",
              "Sin comisiones por venta",
              "Pago y activacion inmediata",
            ],
            ctaPrimary: HERO_PRIMARY_CTA_LABEL_ES,
            ctaPrimaryHelper: "Planes desde 29 soles/mes • Sin comisiones",
            ctaDemo: "Ver demo en vivo",
            ctaPlans: "Ver planes",
            urgency: "Actívalo hoy y empieza a recibir pedidos.",
            chips: ["Listo en minutos", "Pedidos por WhatsApp", "Sin comisiones"],
            panelTag: "Sistema FastPage",
            panelDesc: "Elige una demo, adapta tu negocio y empieza a vender hoy.",
            panelCta: "Abrir demo y vender",
            systemTitle: "Sistema FastPage",
            systemDesc: "Atraes visitas, conviertes en WhatsApp y mides ventas para escalar.",
            allInOneTitle: "Todo en uno",
            allInOneDesc:
              "Todo lo que necesitas para atraer clientes, convertir pedidos y aumentar ventas.",
            moduleCta: "Ver modulo",
            verticalTitle: "Elige tu rubro",
            verticalCards: [
              "Mas pedidos directos por WhatsApp y menos tiempo al telefono.",
              "Convierte trafico en compras con catalogo y cierre en chat.",
              "Capta clientes listos para agendar y cerrar por WhatsApp.",
            ],
            demosTitle: "Demos que ya venden por rubro",
            demosDesc: "Explora casos listos para captar clientes y cerrar pedidos por WhatsApp.",
            pricingTitle: "Planes para vender y escalar 💸",
            starterSubtitle: "Pago directo mensual (sin trial) ⚡",
            starterAnnualDiscount: "Hasta 10% de descuento en plan anual",
            starterCta: "Empezar ahora",
            businessBadge: "⭐ Mas elegido",
            businessSubtitle: "Crea tu negocio digital hoy con soporte y herramientas clave para vender.",
            businessAnnualDiscount: "Hasta 20% de descuento en plan anual",
            businessNote: "Activacion inmediata tras pago.",
            businessCta: "Activar Business",
            proSubtitle: "Pago directo mensual para escalar en serio (sin trial) 🚀",
            proAnnualDiscount: "Hasta 30% de descuento en plan anual",
            proCta: "Comprar ahora",
            domainLine: "Conecta tu dominio desde Plan Business y manten una marca profesional.",
            riskFree: "Sin comisiones por pedido. Cancela cuando quieras.",
            resultsTitle: "Resultados de negocios reales",
            testimonialsLeft: "Desplazar testimonios a la izquierda",
            testimonialsRight: "Desplazar testimonios a la derecha",
            testimonialBadges: ["WhatsApp", "Pedidos", "Reservas", "Checkout", "Metricas", "Conversion"],
            faqTitle: "Preguntas frecuentes",
            finalTitle: "Empieza hoy y recibe mas pedidos por WhatsApp",
            finalDesc: "Activa tu demo, personaliza tu negocio y publica en minutos.",
            liveActivity: "ACTIVIDAD EN VIVO",
            from: "de",
          },
    [isEnglish],
  );
  const moduleCards = isEnglish ? MODULES_EN : MODULES_ES;
  const flowSteps = isEnglish ? FLOW_STEPS_EN : FLOW_STEPS_ES;
  const heroMetrics = isEnglish ? HERO_METRICS_EN : HERO_METRICS_ES;
  const demoTabConfig = isEnglish ? DEMO_TAB_CONFIG_EN : DEMO_TAB_CONFIG_ES;
  const faqs = isEnglish ? FAQS_EN : FAQS_ES;
  const verticalCopy = useMemo(() => getVerticalCopy(vertical, language), [language, vertical]);
  const heroDemoHref = useMemo(() => verticalToDemoHref(vertical), [vertical]);
  const heroSignupHref = useMemo(
    () => `${verticalToSignupHref(vertical)}&plan=BUSINESS`,
    [vertical],
  );
  const starterSignupHref = useMemo(
    () => `${verticalToSignupHref(vertical)}&plan=FREE`,
    [vertical],
  );
  const businessSignupHref = useMemo(
    () => `${verticalToSignupHref(vertical)}&plan=BUSINESS`,
    [vertical],
  );
  const proSignupHref = useMemo(
    () => `${verticalToSignupHref(vertical)}&plan=PRO`,
    [vertical],
  );
  const safeActivityIndex = liveActivityFeed.length ? activityIndex % liveActivityFeed.length : 0;
  const activeLiveActivity = liveActivityFeed[safeActivityIndex] || liveActivityFeed[0];
  const activityTimeLabel = activeLiveActivity
    ? isEnglish
      ? `${activeLiveActivity.minutesAgo} min ago`
      : `Hace ${activeLiveActivity.minutesAgo} min`
    : "";

  return (
    <main className="relative overflow-x-hidden pb-24 md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_56%)]" />
      <section className="relative z-30 mx-auto w-full max-w-7xl px-3 pt-20 md:hidden">
        <PwaInstallTopBanner />
      </section>

      <section className="relative z-10 mx-auto min-h-[calc(100svh-84px)] w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(120deg,rgba(16,16,16,0.95),rgba(10,10,10,0.82)_45%,rgba(17,17,17,0.96))] px-4 pb-12 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute right-[-4rem] top-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <motion.div
            variants={HERO_STAGGER_VARIANTS}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.p
              variants={HERO_ITEM_VARIANTS}
              className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300"
            >
              {copy.heroTag}
            </motion.p>
            <motion.h1
              variants={HERO_ITEM_VARIANTS}
              className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              {copy.heroTitle}
            </motion.h1>
            <motion.p variants={HERO_ITEM_VARIANTS} className="max-w-2xl text-base text-zinc-300 md:text-lg">
              {copy.heroDesc}
            </motion.p>
            <motion.div
              variants={HERO_ITEM_VARIANTS}
              className="max-w-2xl space-y-0.5 text-left text-[11px] font-medium leading-[1.3] text-zinc-300 sm:text-xs"
            >
              {copy.heroChecklist.map((item) => (
                <p key={item}>✅ {item}</p>
              ))}
            </motion.div>
            <motion.p variants={HERO_ITEM_VARIANTS} className="max-w-2xl text-xs font-semibold text-amber-200/90">
              {copy.heroProof}
            </motion.p>

            <motion.div variants={HERO_ITEM_VARIANTS} className="grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
              {heroMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/12 bg-white/[0.03] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                      <Icon className="h-3.5 w-3.5 text-amber-300" />
                    </span>
                    <p className="mt-2 text-sm font-black text-white sm:text-base">{metric.value}</p>
                    <p className="text-[11px] text-zinc-300 sm:text-xs">{metric.label}</p>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={HERO_ITEM_VARIANTS}>
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
            </motion.div>

            <motion.div
              variants={HERO_ITEM_VARIANTS}
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link
                href={heroSignupHref}
                onClick={() =>
                  void trackGrowthEvent("click_cta_signup", {
                    vertical,
                    location: "hero_primary",
                  })
                }
                className={`${DELUXE_BUTTON_BASE} inline-flex w-full justify-center rounded-full px-7 py-3 uppercase tracking-[0.12em] sm:w-auto`}
              >
                {copy.ctaPrimary}
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
                className={`${SOFT_BUTTON_BASE} inline-flex w-full justify-center rounded-full px-6 py-3 uppercase tracking-[0.12em] sm:w-auto`}
              >
                <PlayCircle className="h-4 w-4" /> {copy.ctaDemo}
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
                {copy.ctaPlans}
              </a>
            </motion.div>
            <motion.p variants={HERO_ITEM_VARIANTS} className="max-w-2xl text-center text-[11px] text-zinc-400/80 sm:text-xs">
              {copy.ctaPrimaryHelper}
            </motion.p>
            <motion.p variants={HERO_ITEM_VARIANTS} className="text-xs font-semibold text-amber-200/85">
              {copy.urgency}
            </motion.p>

            <motion.div variants={HERO_ITEM_VARIANTS} className="flex flex-wrap gap-2">
              {copy.chips.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md"
          >
            <motion.div
              aria-hidden
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-amber-300/20 bg-amber-300/10 blur-xl"
            />
            <div className="relative mb-4 hidden md:block">
              {enableHero3D ? (
                <HeroOrbScene />
              ) : (
                <div className="relative flex h-[220px] items-end overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_28%_18%,rgba(251,191,36,0.14),transparent_48%),radial-gradient(circle_at_78%_72%,rgba(34,211,238,0.1),transparent_55%),linear-gradient(165deg,rgba(8,8,8,0.96),rgba(18,18,18,0.88))] p-4">
                  <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-amber-200/90">
                    {copy.panelTag}
                  </p>
                </div>
              )}
            </div>
            <div className="relative mb-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">{copy.liveActivity}</p>
                <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                  {activityTimeLabel || (isEnglish ? "now" : "ahora")}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {activeLiveActivity ? `${activeLiveActivity.name} ${copy.from} ${activeLiveActivity.city}` : "FastPage"}
              </p>
              <p className="mt-1 text-xs text-zinc-300">
                {activeLiveActivity?.action ?? copy.panelDesc}
              </p>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{copy.panelTag}</p>
            <h2 className="mt-3 text-3xl font-black text-white">{verticalCopy.headline}</h2>
            <p className="mt-3 text-sm text-zinc-300">
              {copy.panelDesc}
            </p>
            <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2">
              {flowSteps.map((step) => (
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
              {copy.panelCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <LandingHomeSecondarySectionsDynamic
        copy={copy}
        flowSteps={flowSteps}
        moduleCards={moduleCards}
        demoTabConfig={demoTabConfig}
        pricingFeatures={pricingFeatures}
        faqs={faqs}
        testimonials={testimonials}
        heroSignupHref={heroSignupHref}
        heroDemoHref={heroDemoHref}
        starterSignupHref={starterSignupHref}
        businessSignupHref={businessSignupHref}
        proSignupHref={proSignupHref}
        vertical={vertical}
        activityTimeLabel={activityTimeLabel}
        activeLiveActivity={activeLiveActivity}
      />
    </main>
  );
}



