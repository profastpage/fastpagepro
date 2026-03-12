export type ThemePackVertical = "restaurant" | "ecommerce" | "services";

export interface ThemePackDefinition {
  id: string;
  name: string;
  vertical: ThemePackVertical;
  description: string;
  includedThemes: string[];
  priceSoles: number;
  badge: string;
}

export const THEME_PACKS: ThemePackDefinition[] = [
  {
    id: "restaurant-gold-signature",
    name: "Gold Signature Carta",
    vertical: "restaurant",
    description: "Pack premium para restaurantes con estilos dorados, dark-luxe y foco en conversion.",
    includedThemes: ["Golden Brasa", "Royal Ceviche", "Noir Bistro", "Amber Marina", "Deluxe Coffee"],
    priceSoles: 69,
    badge: "Top ventas",
  },
  {
    id: "restaurant-seasonal-pro",
    name: "Seasonal Food Pro",
    vertical: "restaurant",
    description: "Coleccion de temas para campanas estacionales y fechas especiales de alta demanda.",
    includedThemes: ["Verano Fresh", "Fondas Patrias", "Navidad Gourmet", "Back to School Lunch"],
    priceSoles: 59,
    badge: "Campanas",
  },
  {
    id: "ecommerce-conversion-lab",
    name: "Ecommerce Conversion Lab",
    vertical: "ecommerce",
    description: "Temas para tiendas online con bloques de oferta y CTA de alta intencion.",
    includedThemes: ["Flash Store", "Urban Demand", "Luxury Drop", "Retail Momentum"],
    priceSoles: 79,
    badge: "ROI",
  },
  {
    id: "services-premium-brand",
    name: "Service Premium Brand",
    vertical: "services",
    description: "Diseños profesionales para consultoria, agencias y servicios locales premium.",
    includedThemes: ["Executive Clean", "Agency Velvet", "Legal Prestige", "Clinic Prime"],
    priceSoles: 64,
    badge: "Profesional",
  },
  {
    id: "rgb-custom-studio",
    name: "RGB Custom Studio",
    vertical: "restaurant",
    description: "Set avanzado de presets RGB y composiciones de layout para personalizacion total.",
    includedThemes: ["RGB Spectrum", "Neon Pulse", "Aurora Grid", "Deep Ocean Shift"],
    priceSoles: 89,
    badge: "Personalizable",
  },
];

export function getThemePackById(packId: string): ThemePackDefinition | null {
  const normalized = String(packId || "").trim();
  return THEME_PACKS.find((pack) => pack.id === normalized) || null;
}

