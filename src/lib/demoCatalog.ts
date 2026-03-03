import { normalizeVertical } from "@/lib/vertical";
import type { DemoVertical } from "@/lib/demoTypes";

export type DemoCatalogItem = {
  vertical: DemoVertical;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
};

export const DEMO_CATALOG: DemoCatalogItem[] = [
  {
    vertical: "restaurant",
    slug: "sushi-prime",
    title: "Sushi Prime",
    subtitle: "Carta premium con favoritos del dia y pedidos por WhatsApp",
    coverImage:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "burger-lab",
    title: "Burger Lab",
    subtitle: "Combos rapidos y categorias para delivery",
    coverImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "coffee-route",
    title: "Coffee Route",
    subtitle: "Menu cafeteria con upsell y recomendados",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "ceviche-house",
    title: "Ceviche House",
    subtitle: "Carta marina enfocada en pedidos por WhatsApp",
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "dolce-bella",
    title: "Dolce Bella",
    subtitle: "Postres premium con pedidos y reservas por WhatsApp",
    coverImage:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "fuente-soda-flow",
    title: "Fuente Soda Flow",
    subtitle: "Fuente de soda full bebidas y pedidos instantaneos",
    coverImage:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "pizza-norte",
    title: "Pizza Norte",
    subtitle: "Pizzeria con promos y pedidos rapidos por WhatsApp",
    coverImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "restaurant",
    slug: "brasa-power",
    title: "Brasa Power",
    subtitle: "Pollo a la brasa con combos y delivery por zonas",
    coverImage:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "ecommerce",
    slug: "urban-wear",
    title: "Urban Wear",
    subtitle: "Catalogo moda con ofertas y carrito instantaneo",
    coverImage:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "ecommerce",
    slug: "technova",
    title: "Technova",
    subtitle: "Tienda tech con badges y checkout WhatsApp",
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "ecommerce",
    slug: "couture-plus",
    title: "Couture Plus",
    subtitle: "Accesorios con enfoque de conversion diario",
    coverImage:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "ecommerce",
    slug: "fitgear",
    title: "FitGear",
    subtitle: "Equipos deportivos con confianza y soporte",
    coverImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "services",
    slug: "consultoria-pro",
    title: "Consultoria Pro",
    subtitle: "Landing de captacion para servicios premium",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "services",
    slug: "legal-studio",
    title: "Legal Studio",
    subtitle: "Landing de autoridad para estudios legales",
    coverImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop",
  },
  {
    vertical: "services",
    slug: "agency-growth",
    title: "Agency Growth",
    subtitle: "Landing para agencias con funnel de reunion",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
  },
];

export function getDemoCatalog(vertical?: string): DemoCatalogItem[] {
  if (!vertical) return DEMO_CATALOG;
  const normalized = normalizeVertical(vertical);
  return DEMO_CATALOG.filter((item) => item.vertical === normalized);
}

export function getDemoBySlug(slug: string): DemoCatalogItem | null {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;
  return DEMO_CATALOG.find((item) => item.slug === normalized) || null;
}
