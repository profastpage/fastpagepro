import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
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

export type IndustryItem = {
  label: string;
  icon: LucideIcon;
};

export type PortfolioItem = {
  name: string;
  businessType: string;
  href: string;
  accent: string;
  surface: string;
  metrics: string[];
  screenshots: {
    label: string;
    variant: "desktop" | "mobile";
    src?: string;
    description: string;
  }[];
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const INDUSTRIES: IndustryItem[] = [
  { label: "Hoteles", icon: Hotel },
  { label: "Restaurantes", icon: UtensilsCrossed },
  { label: "Cafeterias", icon: Coffee },
  { label: "Tiendas", icon: ShoppingBag },
  { label: "Empresas", icon: Building2 },
  { label: "Clinicas", icon: Stethoscope },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: "Hotel Vuelo78",
    businessType: "Hotel premium",
    href: "https://vuelo78hotel.vercel.app/",
    accent: "rgba(212, 175, 55, 0.9)",
    surface:
      "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.22), transparent 40%), linear-gradient(180deg, #171717 0%, #0f1012 100%)",
    metrics: ["Reservas directas", "Suite showcase", "WhatsApp concierge"],
    screenshots: [
      {
        label: "Desktop hero",
        variant: "desktop",
        src: "/portfolio/vuelo78/desktop-hero.jpg",
        description: "Hero principal con propuesta de valor, CTA y estilo premium orientado a conversion.",
      },
      {
        label: "Desktop landing completa",
        variant: "desktop",
        src: "/portfolio/vuelo78/desktop-full.jpg",
        description: "Vista completa del flujo desktop para revisar estructura, jerarquia y continuidad visual.",
      },
      {
        label: "Mobile hero",
        variant: "mobile",
        src: "/portfolio/vuelo78/mobile-hero.jpg",
        description: "Primer pantallazo en mobile con lectura clara y llamada a accion visible.",
      },
      {
        label: "Mobile landing completa",
        variant: "mobile",
        src: "/portfolio/vuelo78/mobile-full.jpg",
        description: "Scroll total en mobile para validar composicion, espaciado y experiencia responsive.",
      },
    ],
  },
  {
    name: "Restaurante Demo",
    businessType: "Carta digital",
    href: "/restaurantes",
    accent: "rgba(255, 132, 76, 0.9)",
    surface:
      "radial-gradient(circle at 80% 10%, rgba(255,132,76,0.18), transparent 34%), linear-gradient(180deg, #151515 0%, #101112 100%)",
    metrics: ["Menu visual", "Pedidos por chat", "CTA rapido"],
    screenshots: [
      {
        label: "Desktop menu",
        variant: "desktop",
        description: "Vista de carta digital orientada a conversion por WhatsApp.",
      },
      {
        label: "Mobile menu",
        variant: "mobile",
        description: "Experiencia de pedido en mobile con foco en rapidez.",
      },
    ],
  },
  {
    name: "Cafeteria Moderna",
    businessType: "Landing comercial",
    href: "/demo/restaurant/coffee-route",
    accent: "rgba(122, 197, 169, 0.9)",
    surface:
      "radial-gradient(circle at 18% 20%, rgba(122,197,169,0.18), transparent 36%), linear-gradient(180deg, #151618 0%, #0f1011 100%)",
    metrics: ["Branding limpio", "Promos del dia", "Mobile first"],
    screenshots: [
      {
        label: "Desktop hero",
        variant: "desktop",
        description: "Landing de cafeteria con branding limpio y bloque comercial principal.",
      },
      {
        label: "Mobile hero",
        variant: "mobile",
        description: "Version mobile optimizada para lectura y accion rapida.",
      },
    ],
  },
  {
    name: "Empresa Corporativa",
    businessType: "Servicios B2B",
    href: "/demo/services/consultoria-pro",
    accent: "rgba(126, 166, 255, 0.92)",
    surface:
      "radial-gradient(circle at 78% 18%, rgba(126,166,255,0.18), transparent 36%), linear-gradient(180deg, #121315 0%, #0d0e10 100%)",
    metrics: ["Autoridad visual", "Leads calificados", "Proceso consultivo"],
    screenshots: [
      {
        label: "Desktop lead form",
        variant: "desktop",
        description: "Bloques de autoridad y captura de lead en entorno B2B.",
      },
      {
        label: "Mobile info",
        variant: "mobile",
        description: "Informacion esencial adaptada a pantalla mobile.",
      },
    ],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
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

export function PortfolioPreview({
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
