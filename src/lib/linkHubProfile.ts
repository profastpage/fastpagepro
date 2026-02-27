import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  CartaThemeId,
  getSafeCartaThemeId,
  recommendCartaThemeIdByRubro,
} from "@/theme/cartaThemes";

export const LINK_HUB_COLLECTION = "link_profiles";
export const MAX_LINK_HUB_LINKS = 12;
export const MAX_LINK_HUB_CATALOG_CATEGORIES = 16;
export const MAX_LINK_HUB_CATALOG_ITEMS = 120;
export const MAX_LINK_HUB_COVER_IMAGES = 5;
export const MAX_LINK_HUB_ITEM_GALLERY_IMAGES = 5;
export const LINK_HUB_PRO_TESTIMONIALS_COUNT = 5;

export const LINK_HUB_THEME_STYLES = {
  midnight: {
    label: "Noir Gold Deluxe",
    primary: "#facc15",
    secondary: "#f59e0b",
    background: "from-black via-zinc-950 to-black",
    surface: "border-amber-300/40 bg-zinc-950/90 shadow-[0_0_26px_rgba(250,204,21,0.2)]",
    button:
      "border-amber-300/45 bg-gradient-to-r from-zinc-900/95 to-amber-900/35 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/75",
    accent: "text-amber-300",
  },
  graphite: {
    label: "Monochrome Luxe",
    primary: "#e5e7eb",
    secondary: "#6b7280",
    background: "from-zinc-950 via-black to-zinc-900",
    surface: "border-zinc-200/20 bg-zinc-100/10",
    button:
      "border-zinc-200/30 bg-gradient-to-r from-zinc-200/20 to-slate-300/20 text-zinc-50 hover:brightness-110",
    muted: "text-zinc-300/75",
    accent: "text-zinc-100",
  },
  sunset: {
    label: "Sunset",
    primary: "#fb7185",
    secondary: "#fb923c",
    background: "from-rose-950 via-fuchsia-950 to-orange-900",
    surface: "border-rose-200/20 bg-rose-100/10",
    button:
      "border-rose-200/30 bg-gradient-to-r from-rose-300/30 to-orange-200/30 text-rose-50 hover:brightness-110",
    muted: "text-rose-100/75",
    accent: "text-orange-200",
  },
  ocean: {
    label: "Ocean",
    primary: "#22d3ee",
    secondary: "#3b82f6",
    background: "from-slate-950 via-cyan-950 to-sky-900",
    surface: "border-cyan-200/20 bg-cyan-100/10",
    button:
      "border-cyan-200/30 bg-gradient-to-r from-cyan-300/30 to-sky-200/30 text-cyan-50 hover:brightness-110",
    muted: "text-cyan-100/75",
    accent: "text-cyan-200",
  },
  aurora: {
    label: "Aurora",
    primary: "#34d399",
    secondary: "#60a5fa",
    background: "from-emerald-950 via-slate-950 to-sky-900",
    surface: "border-emerald-200/20 bg-emerald-100/10",
    button:
      "border-emerald-200/30 bg-gradient-to-r from-emerald-300/30 to-sky-300/30 text-emerald-50 hover:brightness-110",
    muted: "text-emerald-100/75",
    accent: "text-emerald-200",
  },
  neon: {
    label: "Neon Pulse",
    primary: "#22c55e",
    secondary: "#eab308",
    background: "from-zinc-950 via-zinc-900 to-black",
    surface: "border-lime-200/20 bg-lime-100/10",
    button:
      "border-lime-200/30 bg-gradient-to-r from-lime-300/30 to-yellow-300/30 text-lime-50 hover:brightness-110",
    muted: "text-lime-100/75",
    accent: "text-yellow-200",
  },
  ruby: {
    label: "Ruby Flame",
    primary: "#ef4444",
    secondary: "#e11d48",
    background: "from-rose-950 via-red-950 to-zinc-950",
    surface: "border-red-200/20 bg-red-100/10",
    button:
      "border-red-200/30 bg-gradient-to-r from-red-300/30 to-rose-300/30 text-red-50 hover:brightness-110",
    muted: "text-red-100/75",
    accent: "text-rose-200",
  },
  jade: {
    label: "Jade Luxe",
    primary: "#10b981",
    secondary: "#14b8a6",
    background: "from-emerald-950 via-teal-950 to-slate-950",
    surface: "border-teal-200/20 bg-teal-100/10",
    button:
      "border-teal-200/30 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 text-teal-50 hover:brightness-110",
    muted: "text-teal-100/75",
    accent: "text-emerald-200",
  },
  coral: {
    label: "Coral Pop",
    primary: "#fb7185",
    secondary: "#fb923c",
    background: "from-rose-950 via-orange-950 to-zinc-950",
    surface: "border-orange-200/20 bg-orange-100/10",
    button:
      "border-orange-200/30 bg-gradient-to-r from-rose-300/30 to-orange-300/30 text-orange-50 hover:brightness-110",
    muted: "text-orange-100/75",
    accent: "text-rose-200",
  },
  violet: {
    label: "Violet Nova",
    primary: "#8b5cf6",
    secondary: "#d946ef",
    background: "from-violet-950 via-purple-950 to-fuchsia-950",
    surface: "border-violet-200/20 bg-violet-100/10",
    button:
      "border-violet-200/30 bg-gradient-to-r from-violet-300/30 to-fuchsia-300/30 text-violet-50 hover:brightness-110",
    muted: "text-violet-100/75",
    accent: "text-fuchsia-200",
  },
  cobalt: {
    label: "Cobalt Pro",
    primary: "#3b82f6",
    secondary: "#2563eb",
    background: "from-blue-950 via-indigo-950 to-slate-950",
    surface: "border-blue-200/20 bg-blue-100/10",
    button:
      "border-blue-200/30 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 text-blue-50 hover:brightness-110",
    muted: "text-blue-100/75",
    accent: "text-indigo-200",
  },
  sandstorm: {
    label: "Sandstorm",
    primary: "#f59e0b",
    secondary: "#d97706",
    background: "from-amber-950 via-orange-950 to-zinc-950",
    surface: "border-amber-200/20 bg-amber-100/10",
    button:
      "border-amber-200/30 bg-gradient-to-r from-amber-300/30 to-orange-300/30 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/75",
    accent: "text-orange-200",
  },
  obsidian: {
    label: "Obsidian Gold Tech",
    primary: "#facc15",
    secondary: "#0ea5e9",
    background: "from-black via-zinc-950 to-slate-950",
    surface: "border-amber-300/35 bg-zinc-950/88 shadow-[0_0_24px_rgba(250,204,21,0.16)]",
    button:
      "border-amber-300/40 bg-gradient-to-r from-zinc-900/95 via-zinc-900/85 to-sky-900/30 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/72",
    accent: "text-amber-300",
  },
  saffron: {
    label: "Saffron Kitchen",
    primary: "#f59e0b",
    secondary: "#ef4444",
    background: "from-amber-950 via-orange-950 to-rose-950",
    surface: "border-amber-200/25 bg-amber-100/12",
    button:
      "border-amber-200/35 bg-gradient-to-r from-amber-300/30 to-red-300/25 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/75",
    accent: "text-red-200",
  },
  crimsonChef: {
    label: "Crimson Chef",
    primary: "#ef4444",
    secondary: "#f97316",
    background: "from-red-950 via-zinc-950 to-orange-950",
    surface: "border-red-200/20 bg-red-100/10",
    button:
      "border-red-200/30 bg-gradient-to-r from-red-300/30 to-orange-300/25 text-red-50 hover:brightness-110",
    muted: "text-red-100/75",
    accent: "text-orange-200",
  },
  runway: {
    label: "Runway Gold",
    primary: "#facc15",
    secondary: "#a16207",
    background: "from-black via-zinc-950 to-zinc-900",
    surface: "border-amber-300/35 bg-zinc-950/88 shadow-[0_0_22px_rgba(250,204,21,0.16)]",
    button:
      "border-amber-300/40 bg-gradient-to-r from-zinc-900/95 to-amber-900/30 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/74",
    accent: "text-amber-300",
  },
  blushBoutique: {
    label: "Blush Boutique",
    primary: "#ec4899",
    secondary: "#f472b6",
    background: "from-fuchsia-950 via-rose-950 to-pink-950",
    surface: "border-pink-200/20 bg-pink-100/10",
    button:
      "border-pink-200/30 bg-gradient-to-r from-pink-300/30 to-rose-300/25 text-pink-50 hover:brightness-110",
    muted: "text-pink-100/75",
    accent: "text-rose-200",
  },
  neonCircuit: {
    label: "Neon Circuit",
    primary: "#22d3ee",
    secondary: "#22c55e",
    background: "from-cyan-950 via-zinc-950 to-emerald-950",
    surface: "border-cyan-200/20 bg-cyan-100/10",
    button:
      "border-cyan-200/30 bg-gradient-to-r from-cyan-300/30 to-emerald-300/25 text-cyan-50 hover:brightness-110",
    muted: "text-cyan-100/75",
    accent: "text-emerald-200",
  },
  titanTech: {
    label: "Titan Tech",
    primary: "#3b82f6",
    secondary: "#06b6d4",
    background: "from-slate-950 via-blue-950 to-cyan-950",
    surface: "border-blue-200/20 bg-blue-100/10",
    button:
      "border-blue-200/30 bg-gradient-to-r from-blue-300/30 to-cyan-300/25 text-blue-50 hover:brightness-110",
    muted: "text-blue-100/75",
    accent: "text-cyan-200",
  },
  rgb: {
    label: "RGB Custom",
    primary: "#ff0055",
    secondary: "#00d4ff",
    background: "from-zinc-950 via-black to-zinc-900",
    surface: "border-fuchsia-200/20 bg-fuchsia-100/10",
    button:
      "border-fuchsia-200/30 bg-gradient-to-r from-fuchsia-300/30 to-cyan-300/30 text-fuchsia-50 hover:brightness-110",
    muted: "text-zinc-100/75",
    accent: "text-fuchsia-200",
  },
} as const;

export const LINK_HUB_FONT_FAMILIES = {
  modern: {
    label: "Modern Sans",
    stack: "'Poppins','Montserrat','Segoe UI',system-ui,sans-serif",
  },
  elegant: {
    label: "Elegant Serif",
    stack: "'Playfair Display','Merriweather',Georgia,serif",
  },
  energetic: {
    label: "Energetic",
    stack: "'Nunito','Trebuchet MS','Segoe UI',sans-serif",
  },
  editorial: {
    label: "Editorial",
    stack: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  },
  mono: {
    label: "Mono",
    stack: "'JetBrains Mono','Fira Code','Courier New',monospace",
  },
} as const;

export type LinkHubTheme = keyof typeof LINK_HUB_THEME_STYLES;
export type LinkHubFontFamily = keyof typeof LINK_HUB_FONT_FAMILIES;

export type LinkHubBusinessType = "restaurant" | "general";
export type LinkHubThemeCategory = "food" | "fashion" | "technology";
export type LinkHubButtonShape = "rounded" | "pill" | "square";
export type LinkHubCardStyle = "glass" | "solid" | "outline";
export type LinkHubTextTone = "white" | "black" | "gold" | "blackGold";
export type LinkHubCartaBackgroundMode = "white" | "theme";

export const LINK_HUB_THEME_CATEGORY_LABELS: Record<LinkHubThemeCategory, string> = {
  food: "Comida",
  fashion: "Ropa",
  technology: "Tecnologia",
};

export const LINK_HUB_THEME_CATEGORY_MAP: Record<LinkHubThemeCategory, LinkHubTheme[]> = {
  food: ["midnight", "sunset", "sandstorm", "ruby", "coral", "saffron", "crimsonChef"],
  fashion: ["runway", "graphite", "blushBoutique", "violet", "jade", "aurora"],
  technology: ["obsidian", "ocean", "cobalt", "neon", "neonCircuit", "titanTech", "rgb"],
};

export const LINK_HUB_THEME_TO_CARTA_THEME: Record<LinkHubTheme, CartaThemeId> = {
  midnight: "gourmet",
  graphite: "gourmet",
  sunset: "desserts",
  ocean: "bar_drinks",
  aurora: "healthy",
  neon: "fastfood",
  ruby: "sushi",
  jade: "healthy",
  coral: "desserts",
  violet: "bar_drinks",
  cobalt: "bar_drinks",
  sandstorm: "fastfood",
  obsidian: "bar_drinks",
  saffron: "polleria_parrilla",
  crimsonChef: "sushi",
  runway: "gourmet",
  blushBoutique: "desserts",
  neonCircuit: "bar_drinks",
  titanTech: "bar_drinks",
  rgb: "bar_drinks",
};

export type LinkHubLinkType =
  | "website"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "x";

export interface LinkHubLink {
  id: string;
  title: string;
  url: string;
  type: LinkHubLinkType;
}

export interface LinkHubSectionLabels {
  contact: string;
  menu: string;
  catalog: string;
  location: string;
  pricing: string;
}

export interface LinkHubCatalogCategory {
  id: string;
  name: string;
  emoji?: string;
}

export interface LinkHubCatalogItem {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  salesCopy?: string;
  imageUrl: string;
  galleryImageUrls: string[];
  price: string;
  compareAtPrice?: string;
  badge?: string;
  emoji?: string;
}

export interface LinkHubProTestimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
}

export interface LinkHubDeliveryModes {
  delivery: boolean;
  pickup: boolean;
  dinein: boolean;
}

export interface LinkHubLocation {
  address: string;
  mapEmbedUrl: string;
  mapsUrl: string;
  scheduleLines: string[];
  ctaLabel: string;
}

export interface LinkHubPricingPlan {
  id: string;
  title: string;
  normalPrice: string;
  price: string;
  currency: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  highlighted?: boolean;
}

export interface LinkHubPricingConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  plans: LinkHubPricingPlan[];
}

export interface LinkHubProfile {
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  coverImageUrls: string[];
  categoryLabel: string;
  phoneNumber: string;
  whatsappNumber: string;
  businessType: LinkHubBusinessType;
  themeCategory: LinkHubThemeCategory;
  fontFamily: LinkHubFontFamily;
  buttonShape: LinkHubButtonShape;
  cardStyle: LinkHubCardStyle;
  textTone: LinkHubTextTone;
  cartaThemeId: CartaThemeId;
  cartaBackgroundMode: LinkHubCartaBackgroundMode;
  sectionLabels: LinkHubSectionLabels;
  theme: LinkHubTheme;
  themePrimaryColor?: string;
  themeSecondaryColor?: string;
  published: boolean;
  publishedAt?: number;
  links: LinkHubLink[];
  catalogCategories: LinkHubCatalogCategory[];
  catalogItems: LinkHubCatalogItem[];
  proTestimonials: LinkHubProTestimonial[];
  proDeliveryModes: LinkHubDeliveryModes;
  proFeaturesUnlocked: boolean;
  location: LinkHubLocation;
  pricing: LinkHubPricingConfig;
  createdAt: number;
  updatedAt: number;
}

export interface LinkHubUserSeed {
  uid?: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

function safeText(input: unknown) {
  return String(input || "").replace(/\s+/g, " ").trim();
}

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSafeLinkType(type: unknown): LinkHubLinkType {
  const value = safeText(type).toLowerCase();
  if (
    value === "website" ||
    value === "instagram" ||
    value === "facebook" ||
    value === "tiktok" ||
    value === "youtube" ||
    value === "linkedin" ||
    value === "whatsapp" ||
    value === "x"
  ) {
    return value;
  }
  return "website";
}

function getSafeBusinessType(_type: unknown): LinkHubBusinessType {
  return "restaurant";
}

export function getSafeLinkHubFontFamily(type?: string): LinkHubFontFamily {
  if (!type) return "modern";
  if (type in LINK_HUB_FONT_FAMILIES) return type as LinkHubFontFamily;
  return "modern";
}

export function getSafeLinkHubButtonShape(type?: string): LinkHubButtonShape {
  if (type === "pill" || type === "square" || type === "rounded") return type;
  return "rounded";
}

export function getSafeLinkHubCardStyle(type?: string): LinkHubCardStyle {
  if (type === "glass" || type === "solid" || type === "outline") return type;
  return "glass";
}

export function getSafeLinkHubTextTone(type?: string): LinkHubTextTone {
  if (type === "black" || type === "gold" || type === "blackGold" || type === "white") return type;
  return "white";
}

export function getSafeLinkHubCartaBackgroundMode(type?: string): LinkHubCartaBackgroundMode {
  if (type === "theme" || type === "white") return type;
  return "white";
}

export function getSafeLinkHubThemeCategory(type?: string): LinkHubThemeCategory {
  if (type === "food" || type === "fashion" || type === "technology") return type;
  return "food";
}

export function createLinkHubCatalogCategory(name = "", emoji = ""): LinkHubCatalogCategory {
  return {
    id: createId("cat"),
    name,
    emoji,
  };
}

export function createLinkHubCatalogItem(categoryId = ""): LinkHubCatalogItem {
  return {
    id: createId("item"),
    categoryId,
    title: "",
    description: "",
    salesCopy: "",
    imageUrl: "",
    galleryImageUrls: [],
    price: "",
    compareAtPrice: "",
    badge: "",
    emoji: "",
  };
}

function createDefaultProTestimonials(displayName = "tu negocio"): LinkHubProTestimonial[] {
  return [
    {
      id: createId("tst"),
      author: "Cliente frecuente",
      role: "Pedido semanal",
      quote: `La carta de ${displayName} se ve clara y ahora pedir por WhatsApp es rapidisimo.`,
      rating: 5,
    },
    {
      id: createId("tst"),
      author: "Cliente nuevo",
      role: "Primer pedido",
      quote: "Encontre mis platos favoritos en segundos y el pedido llego tal como se mostro.",
      rating: 5,
    },
    {
      id: createId("tst"),
      author: "Cliente corporativo",
      role: "Pedido para equipo",
      quote: "Las fotos y descripciones ayudan mucho para decidir mas rapido en grupo.",
      rating: 5,
    },
    {
      id: createId("tst"),
      author: "Cliente delivery",
      role: "Compra recurrente",
      quote: "El proceso de compra es simple y la experiencia se siente profesional.",
      rating: 5,
    },
    {
      id: createId("tst"),
      author: "Cliente en local",
      role: "Visita presencial",
      quote: "Pude revisar opciones, promociones y escribir directo sin perder tiempo.",
      rating: 5,
    },
  ];
}

export function createLinkHubPricingPlan(seed?: Partial<LinkHubPricingPlan>): LinkHubPricingPlan {
  return {
    id: seed?.id || createId("plan"),
    title: safeText(seed?.title) || "Plan",
    normalPrice: safeText(seed?.normalPrice),
    price: safeText(seed?.price),
    currency: safeText(seed?.currency) || "S/.",
    features: Array.isArray(seed?.features)
      ? seed!.features.map((feature) => safeText(feature)).filter(Boolean)
      : [],
    ctaLabel: safeText(seed?.ctaLabel) || "Mas detalles",
    ctaUrl: safeText(seed?.ctaUrl),
    highlighted: Boolean(seed?.highlighted),
  };
}

export function getDefaultLinkHubSectionLabels(): LinkHubSectionLabels {
  return {
    contact: "Contacto",
    menu: "Carta",
    catalog: "Catalogo",
    location: "Ubicacion",
    pricing: "Catalogo digital online",
  };
}

export function createDefaultCatalogCategories(
  businessType: LinkHubBusinessType,
): LinkHubCatalogCategory[] {
  if (businessType === "restaurant") {
    return [
      createLinkHubCatalogCategory("Ceviches", "??"),
      createLinkHubCatalogCategory("Sudados", "??"),
      createLinkHubCatalogCategory("Mariscos", "??"),
      createLinkHubCatalogCategory("Bebidas", "??"),
    ];
  }

  return [
    createLinkHubCatalogCategory("Destacados", "?"),
    createLinkHubCatalogCategory("Novedades", "??"),
    createLinkHubCatalogCategory("Ofertas", "??"),
    createLinkHubCatalogCategory("Accesorios", "???"),
  ];
}

export function createDefaultCatalogItems(
  categories: LinkHubCatalogCategory[],
  businessType: LinkHubBusinessType,
): LinkHubCatalogItem[] {
  const firstCategoryId = categories[0]?.id || createId("cat");
  const secondCategoryId = categories[1]?.id || firstCategoryId;

  if (businessType === "restaurant") {
    return [
      {
        ...createLinkHubCatalogItem(firstCategoryId),
        title: "Ceviche de la casa",
        description: "Pescado fresco, leche de tigre y camote glaseado.",
        imageUrl:
          "https://images.unsplash.com/photo-1625943555419-56a2cb596640?auto=format&fit=crop&w=900&q=80",
        price: "27.00",
        compareAtPrice: "30.00",
        badge: "-10%",
        emoji: "??",
      },
      {
        ...createLinkHubCatalogItem(secondCategoryId),
        title: "Sudado de pescado",
        description: "Caldo concentrado con tomate, culantro y yuca cocida.",
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
        price: "32.00",
        compareAtPrice: "",
        badge: "",
        emoji: "??",
      },
    ];
  }

  return [
    {
      ...createLinkHubCatalogItem(firstCategoryId),
      title: "Producto estrella",
      description: "Articulo premium listo para venta online.",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      price: "199.00",
      compareAtPrice: "249.00",
      badge: "HOT",
      emoji: "?",
    },
    {
      ...createLinkHubCatalogItem(secondCategoryId),
      title: "Edicion limitada",
      description: "Ideal para promociones y campanas de temporada.",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      price: "149.00",
      compareAtPrice: "179.00",
      badge: "NEW",
      emoji: "???",
    },
  ];
}

export function createDefaultPricingPlans(): LinkHubPricingPlan[] {
  return [
    createLinkHubPricingPlan({
      title: "Plan Estandar",
      normalPrice: "450",
      price: "350",
      currency: "S/.",
      features: [
        "Carga inicial de 50 productos/platos",
        "Pedidos enviados a WhatsApp",
        "1 banner promocional",
        "Codigo QR personalizado",
        "Soporte prioritario por 1 mes",
      ],
      ctaLabel: "Mas detalles",
      ctaUrl: "",
    }),
    createLinkHubPricingPlan({
      title: "Plan Avanzado",
      normalPrice: "650",
      price: "500",
      currency: "S/.",
      highlighted: true,
      features: [
        "Carga inicial de 100 productos/platos",
        "Pedidos enviados a WhatsApp",
        "2 banners promocionales",
        "Google Maps con ubicacion",
        "Soporte prioritario por 3 meses",
      ],
      ctaLabel: "Mas detalles",
      ctaUrl: "",
    }),
    createLinkHubPricingPlan({
      title: "Plan Premium",
      normalPrice: "950",
      price: "750",
      currency: "S/.",
      features: [
        "Carga inicial de 200 productos/platos",
        "Pedidos enviados a WhatsApp",
        "3 banners promocionales",
        "Video tutorial + capacitacion",
        "Soporte prioritario por 6 meses",
      ],
      ctaLabel: "Mas detalles",
      ctaUrl: "",
    }),
  ];
}

function normalizeHexToLong(hex: string): string {
  if (hex.length !== 4) return hex;
  const [_, r, g, b] = hex;
  return `#${r}${r}${g}${g}${b}${b}`;
}

export function getSafeLinkHubTheme(theme?: string): LinkHubTheme {
  if (!theme) return "midnight";
  if (theme in LINK_HUB_THEME_STYLES) return theme as LinkHubTheme;
  return "midnight";
}

export function recommendCartaThemeIdByLinkTheme(theme?: string): CartaThemeId {
  const safeTheme = getSafeLinkHubTheme(theme);
  return LINK_HUB_THEME_TO_CARTA_THEME[safeTheme] || "gourmet";
}

export function normalizeHexColor(input: string | undefined, fallback: string): string {
  const source = safeText(input);
  if (!HEX_COLOR_PATTERN.test(source)) return fallback;
  return normalizeHexToLong(source.toLowerCase());
}

export function hexToRgba(input: string, alpha: number): string {
  const safe = normalizeHexColor(input, "#000000").replace("#", "");
  const value = safe.length === 3 ? safe.split("").map((part) => part + part).join("") : safe;
  const parsed = Number.parseInt(value, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(alpha, 1))})`;
}

export function getLinkHubThemeColors(
  theme: LinkHubTheme,
  primaryColor?: string,
  secondaryColor?: string,
): { primary: string; secondary: string } {
  const preset = LINK_HUB_THEME_STYLES[theme] || LINK_HUB_THEME_STYLES.midnight;
  return {
    primary: normalizeHexColor(primaryColor, preset.primary),
    secondary: normalizeHexColor(secondaryColor, preset.secondary),
  };
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function normalizeLinkUrl(rawUrl: string): string {
  const value = safeText(rawUrl);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function extractIframeSrc(raw: string): string {
  const match = raw.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (!match) return raw;
  return safeText(match[1]);
}

function decodeHtmlEntities(raw: string): string {
  return raw
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function extractGoogleMapsQueryFromUrl(input: URL): string {
  const byQuery = input.searchParams.get("q") || input.searchParams.get("query");
  if (byQuery) return byQuery;

  const atMatch = input.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    return `${atMatch[1]},${atMatch[2]}`;
  }

  const placeMatch = input.pathname.match(/\/place\/([^/]+)/i);
  if (placeMatch?.[1]) {
    return placeMatch[1].replace(/\+/g, " ");
  }

  return "";
}

function normalizeGoogleMapsSource(raw: string): string {
  const cleaned = decodeHtmlEntities(extractIframeSrc(raw)).trim();
  if (!cleaned) return "";

  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^www\./i.test(cleaned)) return `https://${cleaned}`;
  if (/^\/?maps/i.test(cleaned)) {
    return `https://www.google.com/${cleaned.replace(/^\/+/, "")}`;
  }
  return cleaned;
}

function toGoogleMapsPublicUrl(raw: string, fallbackAddress = ""): string {
  const source = normalizeGoogleMapsSource(raw);
  if (!source) {
    const address = safeText(fallbackAddress);
    return address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : "";
  }

  if (!/^https?:\/\//i.test(source)) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(source)}`;
  }

  try {
    const parsed = new URL(source);
    return parsed.toString();
  } catch {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(source)}`;
  }
}

function toGoogleMapsEmbedUrl(rawEmbed: string, rawMaps: string, fallbackAddress = ""): string {
  const source = normalizeGoogleMapsSource(rawEmbed) || normalizeGoogleMapsSource(rawMaps);

  if (!source) {
    const address = safeText(fallbackAddress);
    return address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : "";
  }

  if (!/^https?:\/\//i.test(source)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(source)}&output=embed`;
  }

  try {
    const parsed = new URL(source);
    const isGoogleHost = /(^|\.)google\./i.test(parsed.hostname) || /maps\.app\.goo\.gl$/i.test(parsed.hostname);
    if (!isGoogleHost) {
      return `https://www.google.com/maps?q=${encodeURIComponent(source)}&output=embed`;
    }

    if (parsed.pathname.includes("/maps/embed")) return parsed.toString();
    if (parsed.searchParams.get("output") === "embed") return parsed.toString();

    const query = extractGoogleMapsQueryFromUrl(parsed);
    if (query) {
      return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(parsed.toString())}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(source)}&output=embed`;
  }
}

export function normalizeGoogleMapsLocationInput(
  mapEmbedInput: string,
  mapsInput: string,
  fallbackAddress = "",
): { mapEmbedUrl: string; mapsUrl: string } {
  return {
    mapEmbedUrl: toGoogleMapsEmbedUrl(mapEmbedInput, mapsInput, fallbackAddress),
    mapsUrl: toGoogleMapsPublicUrl(mapsInput || mapEmbedInput, fallbackAddress),
  };
}

export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildDefaultLinkHubProfile(user: LinkHubUserSeed): LinkHubProfile {
  const now = Date.now();
  const fallbackName = safeText(user.name) || "Creator";
  const emailPrefix = safeText(String(user.email || "").split("@")[0]);
  const slugBase = sanitizeSlug(fallbackName || emailPrefix || "creator");
  const baseTheme = LINK_HUB_THEME_STYLES.midnight;
  const businessType: LinkHubBusinessType = "restaurant";
  const categories = createDefaultCatalogCategories(businessType);
  const rubroHint = "Restaurante / Cafeteria";

  return {
    userId: safeText(user.uid),
    slug: slugBase || "creator",
    displayName: fallbackName,
    bio: "",
    avatarUrl: safeText(user.photoURL),
    coverImageUrl: "",
    coverImageUrls: [],
    categoryLabel: "Cafeteria",
    phoneNumber: "",
    whatsappNumber: "",
    businessType,
    themeCategory: "food",
    fontFamily: "modern",
    buttonShape: "rounded",
    cardStyle: "glass",
    textTone: "white",
    cartaThemeId: recommendCartaThemeIdByRubro(rubroHint),
    cartaBackgroundMode: "white",
    sectionLabels: getDefaultLinkHubSectionLabels(),
    theme: "midnight",
    themePrimaryColor: baseTheme.primary,
    themeSecondaryColor: baseTheme.secondary,
    published: false,
    links: [
      {
        id: createId("link"),
        title: "Instagram",
        url: "",
        type: "instagram",
      },
      {
        id: createId("link"),
        title: "Web",
        url: "",
        type: "website",
      },
    ],
    catalogCategories: categories,
    catalogItems: createDefaultCatalogItems(categories, businessType),
    proTestimonials: createDefaultProTestimonials(fallbackName),
    proDeliveryModes: {
      delivery: true,
      pickup: true,
      dinein: true,
    },
    proFeaturesUnlocked: false,
    location: {
      address: "",
      mapEmbedUrl: "",
      mapsUrl: "",
      scheduleLines: ["Lunes a Sabado: 11:30 am - 9:00 pm", "Domingos: 12:00 pm - 6:00 pm"],
      ctaLabel: "Ir ahora",
    },
    pricing: {
      enabled: true,
      title: "Catalogo digital online",
      subtitle: "Activa tu plataforma con el plan ideal para tu negocio.",
      plans: createDefaultPricingPlans(),
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeLinkHubProfile(
  input: Partial<LinkHubProfile> | null | undefined,
  user: LinkHubUserSeed = {},
): LinkHubProfile {
  const base = buildDefaultLinkHubProfile({
    uid: safeText(input?.userId) || safeText(user.uid),
    name: safeText(input?.displayName) || safeText(user.name),
    email: safeText(user.email),
    photoURL: safeText(input?.avatarUrl) || safeText(user.photoURL),
  });

  if (!input) return base;

  const businessType = getSafeBusinessType(input.businessType);
  const requestedThemeCategory = getSafeLinkHubThemeCategory(safeText(input.themeCategory));
  const themeCategory =
    businessType === "restaurant"
      ? "food"
      : requestedThemeCategory === "food"
        ? "fashion"
        : requestedThemeCategory;

  const rawLabels: Record<string, unknown> = isRecord(input.sectionLabels) ? input.sectionLabels : {};
  const sectionLabels: LinkHubSectionLabels = {
    contact: safeText(rawLabels["contact"]) || base.sectionLabels.contact,
    menu: safeText(rawLabels["menu"]) || base.sectionLabels.menu,
    catalog: safeText(rawLabels["catalog"]) || base.sectionLabels.catalog,
    location: safeText(rawLabels["location"]) || base.sectionLabels.location,
    pricing: safeText(rawLabels["pricing"]) || base.sectionLabels.pricing,
  };

  const defaultCategories = createDefaultCatalogCategories(businessType);
  const rawCategories = Array.isArray(input.catalogCategories) ? input.catalogCategories : [];
  const catalogCategories = rawCategories
    .map((category) => ({
      id: safeText(category?.id) || createId("cat"),
      name: safeText(category?.name),
      emoji: safeText(category?.emoji),
    }))
    .filter((category) => category.name.length > 0)
    .slice(0, MAX_LINK_HUB_CATALOG_CATEGORIES);

  const finalCategories = catalogCategories.length > 0 ? catalogCategories : defaultCategories;
  const categoryIds = new Set(finalCategories.map((category) => category.id));
  const firstCategoryId = finalCategories[0]?.id || createId("cat");

  const rawItems = Array.isArray(input.catalogItems) ? input.catalogItems : [];
  const catalogItems = rawItems
    .map((item) => {
      const rawCategoryId = safeText(item?.categoryId);
      const categoryId = categoryIds.has(rawCategoryId) ? rawCategoryId : firstCategoryId;

      return {
        id: safeText(item?.id) || createId("item"),
        categoryId,
        title: safeText(item?.title),
        description: safeText(item?.description),
        salesCopy: safeText(item?.salesCopy),
        imageUrl: safeText(item?.imageUrl),
        galleryImageUrls: [
          ...(Array.isArray(item?.galleryImageUrls) ? item.galleryImageUrls : []),
          safeText(item?.imageUrl),
        ]
          .map((image) => safeText(image))
          .filter(Boolean)
          .filter((image, index, list) => list.indexOf(image) === index)
          .slice(0, MAX_LINK_HUB_ITEM_GALLERY_IMAGES),
        price: safeText(item?.price),
        compareAtPrice: safeText(item?.compareAtPrice),
        badge: safeText(item?.badge),
        emoji: safeText(item?.emoji),
      } as LinkHubCatalogItem;
    })
    .filter((item) => item.title.length > 0)
    .slice(0, MAX_LINK_HUB_CATALOG_ITEMS);

  const finalItems =
    catalogItems.length > 0
      ? catalogItems
      : createDefaultCatalogItems(finalCategories, businessType);

  const rawTestimonials = Array.isArray((input as Record<string, unknown>)["proTestimonials"])
    ? ((input as Record<string, unknown>)["proTestimonials"] as unknown[])
    : [];
  const normalizedTestimonials = rawTestimonials
    .map((entry) => {
      const safeEntry = isRecord(entry) ? entry : {};
      const ratingRaw = Number(safeEntry["rating"]);
      const rating = Number.isFinite(ratingRaw) ? Math.max(1, Math.min(5, Math.round(ratingRaw))) : 5;
      return {
        id: safeText(safeEntry["id"]) || createId("tst"),
        author: safeText(safeEntry["author"]),
        role: safeText(safeEntry["role"]),
        quote: safeText(safeEntry["quote"]),
        rating,
      } as LinkHubProTestimonial;
    })
    .filter((entry) => entry.quote.length > 0)
    .slice(0, LINK_HUB_PRO_TESTIMONIALS_COUNT);
  const fallbackTestimonials =
    base.proTestimonials.length > 0 ? base.proTestimonials : createDefaultProTestimonials(base.displayName);
  while (normalizedTestimonials.length < LINK_HUB_PRO_TESTIMONIALS_COUNT) {
    normalizedTestimonials.push(
      fallbackTestimonials[normalizedTestimonials.length] || createDefaultProTestimonials(base.displayName)[0],
    );
  }

  const rawDeliveryModes = isRecord((input as Record<string, unknown>)["proDeliveryModes"])
    ? ((input as Record<string, unknown>)["proDeliveryModes"] as Record<string, unknown>)
    : {};
  const deliveryModes: LinkHubDeliveryModes = {
    delivery:
      typeof rawDeliveryModes["delivery"] === "boolean"
        ? (rawDeliveryModes["delivery"] as boolean)
        : base.proDeliveryModes.delivery,
    pickup:
      typeof rawDeliveryModes["pickup"] === "boolean"
        ? (rawDeliveryModes["pickup"] as boolean)
        : base.proDeliveryModes.pickup,
    dinein:
      typeof rawDeliveryModes["dinein"] === "boolean"
        ? (rawDeliveryModes["dinein"] as boolean)
        : base.proDeliveryModes.dinein,
  };

  const rawLocation: Record<string, unknown> = isRecord(input.location) ? input.location : {};
  const rawAddress = safeText(rawLocation["address"]);
  const normalizedMaps = normalizeGoogleMapsLocationInput(
    String(rawLocation["mapEmbedUrl"] || ""),
    String(rawLocation["mapsUrl"] || ""),
    rawAddress,
  );
  const location: LinkHubLocation = {
    address: rawAddress || base.location.address,
    mapEmbedUrl: normalizedMaps.mapEmbedUrl || base.location.mapEmbedUrl,
    mapsUrl: normalizedMaps.mapsUrl || base.location.mapsUrl,
    scheduleLines: Array.isArray(rawLocation["scheduleLines"])
      ? rawLocation["scheduleLines"].map((line: unknown) => safeText(line)).filter(Boolean)
      : base.location.scheduleLines,
    ctaLabel: safeText(rawLocation["ctaLabel"]) || base.location.ctaLabel,
  };

  const defaultPlans = createDefaultPricingPlans();
  const rawPricing: Record<string, unknown> = isRecord(input.pricing) ? input.pricing : {};
  const rawPlans = Array.isArray(rawPricing["plans"]) ? rawPricing["plans"] : [];

  const normalizedPlans = rawPlans
    .map((plan: unknown, index: number) => {
      const safePlan: Record<string, unknown> = isRecord(plan) ? plan : {};
      const safeFeatures = Array.isArray(safePlan["features"]) ? safePlan["features"] : [];
      return createLinkHubPricingPlan({
        id: safeText(safePlan["id"]) || defaultPlans[index]?.id || createId("plan"),
        title: safeText(safePlan["title"]) || defaultPlans[index]?.title || "Plan",
        normalPrice: safeText(safePlan["normalPrice"]),
        price: safeText(safePlan["price"]) || defaultPlans[index]?.price || "",
        currency: safeText(safePlan["currency"]) || defaultPlans[index]?.currency || "S/.",
        features: safeFeatures.length > 0
          ? safeFeatures.map((feature: unknown) => safeText(feature)).filter(Boolean)
          : defaultPlans[index]?.features || [],
        ctaLabel: safeText(safePlan["ctaLabel"]) || defaultPlans[index]?.ctaLabel || "Mas detalles",
        ctaUrl: safeText(safePlan["ctaUrl"]),
        highlighted: Boolean(safePlan["highlighted"]),
      });
    })
    .slice(0, 3);

  while (normalizedPlans.length < 3) {
    normalizedPlans.push(createLinkHubPricingPlan(defaultPlans[normalizedPlans.length]));
  }

  const links = (Array.isArray(input.links) ? input.links : base.links)
    .map((link) => ({
      id: safeText(link?.id) || createId("link"),
      title: safeText(link?.title),
      url: safeText(link?.url),
      type: getSafeLinkType(link?.type),
    }))
    .filter((link) => link.title.length > 0 || link.url.length > 0)
    .slice(0, MAX_LINK_HUB_LINKS);

  const safeTheme = getSafeLinkHubTheme(safeText(input.theme) || base.theme);
  const themePreset = LINK_HUB_THEME_STYLES[safeTheme] || LINK_HUB_THEME_STYLES.midnight;
  const rubroHint = safeText(input.categoryLabel) || "Restaurante / Cafeteria";
  const mappedCartaThemeId = recommendCartaThemeIdByLinkTheme(safeTheme);
  const cartaThemeId = getSafeCartaThemeId(
    safeText((input as Record<string, unknown>)["cartaThemeId"]) ||
      mappedCartaThemeId ||
      recommendCartaThemeIdByRubro(rubroHint),
  );
  const colors = getLinkHubThemeColors(
    safeTheme,
    safeText(input.themePrimaryColor) || themePreset.primary,
    safeText(input.themeSecondaryColor) || themePreset.secondary,
  );

  const rawCoverImageUrls = Array.isArray((input as Record<string, unknown>)["coverImageUrls"])
    ? ((input as Record<string, unknown>)["coverImageUrls"] as unknown[])
    : [];
  const mergedCoverImageUrls = [
    ...rawCoverImageUrls.map((value) => safeText(value)),
    safeText(input.coverImageUrl),
  ]
    .filter(Boolean)
    .filter((value, index, source) => source.indexOf(value) === index)
    .slice(0, MAX_LINK_HUB_COVER_IMAGES);

  const createdAtNumber = Number(input.createdAt);
  const updatedAtNumber = Number(input.updatedAt);

  return {
    ...base,
    ...input,
    userId: safeText(input.userId) || base.userId,
    slug: sanitizeSlug(safeText(input.slug) || base.slug),
    displayName: safeText(input.displayName) || base.displayName,
    bio: safeText(input.bio),
    avatarUrl: safeText(input.avatarUrl) || base.avatarUrl,
    coverImageUrl: mergedCoverImageUrls[0] || "",
    coverImageUrls: mergedCoverImageUrls,
    categoryLabel: safeText(input.categoryLabel) || "Restaurante",
    phoneNumber: safeText(input.phoneNumber),
    whatsappNumber: safeText(input.whatsappNumber),
    businessType,
    themeCategory,
    fontFamily: getSafeLinkHubFontFamily(safeText(input.fontFamily) || base.fontFamily),
    buttonShape: getSafeLinkHubButtonShape(safeText(input.buttonShape) || base.buttonShape),
    cardStyle: getSafeLinkHubCardStyle(safeText(input.cardStyle) || base.cardStyle),
    textTone: getSafeLinkHubTextTone(safeText(input.textTone) || base.textTone),
    cartaThemeId,
    cartaBackgroundMode: getSafeLinkHubCartaBackgroundMode(
      safeText((input as Record<string, unknown>)["cartaBackgroundMode"]) || base.cartaBackgroundMode,
    ),
    sectionLabels,
    theme: safeTheme,
    themePrimaryColor: colors.primary,
    themeSecondaryColor: colors.secondary,
    published: Boolean(input.published),
    publishedAt: Number(input.publishedAt) || undefined,
    links: links.length > 0 ? links : base.links,
    catalogCategories: finalCategories,
    catalogItems: finalItems,
    proTestimonials: normalizedTestimonials,
    proDeliveryModes: deliveryModes,
    proFeaturesUnlocked: Boolean((input as Record<string, unknown>)["proFeaturesUnlocked"]),
    location,
    pricing: {
      enabled: typeof rawPricing["enabled"] === "boolean" ? (rawPricing["enabled"] as boolean) : base.pricing.enabled,
      title: safeText(rawPricing["title"]) || base.pricing.title,
      subtitle: safeText(rawPricing["subtitle"]) || base.pricing.subtitle,
      plans: normalizedPlans,
    },
    createdAt: Number.isFinite(createdAtNumber) && createdAtNumber > 0 ? createdAtNumber : base.createdAt,
    updatedAt: Number.isFinite(updatedAtNumber) && updatedAtNumber > 0 ? updatedAtNumber : base.updatedAt,
  };
}

export async function getLinkHubProfileByUserId(userId: string): Promise<LinkHubProfile | null> {
  const profileRef = doc(db, LINK_HUB_COLLECTION, userId);
  const snapshot = await getDoc(profileRef);
  if (!snapshot.exists()) {
    return null;
  }

  return normalizeLinkHubProfile(
    {
      ...(snapshot.data() as Partial<LinkHubProfile>),
      userId,
    },
    { uid: userId },
  );
}

export async function saveLinkHubProfileForUser(
  userId: string,
  profile: LinkHubProfile,
): Promise<void> {
  const profileRef = doc(db, LINK_HUB_COLLECTION, userId);
  const normalized = normalizeLinkHubProfile(
    {
      ...profile,
      userId,
    },
    { uid: userId },
  );

  await setDoc(profileRef, normalized, { merge: true });
}

export async function isLinkHubSlugAvailable(
  slug: string,
  currentUserId: string,
): Promise<boolean> {
  const normalized = sanitizeSlug(slug);
  if (!normalized) return false;

  try {
    const slugQuery = query(
      collection(db, LINK_HUB_COLLECTION),
      where("slug", "==", normalized),
      limit(1),
    );
    const snapshot = await getDocs(slugQuery);
    if (snapshot.empty) return true;

    const first = snapshot.docs[0];
    return first.id === currentUserId;
  } catch (error: unknown) {
    const code = safeText((error as { code?: string })?.code);
    if (code.includes("permission-denied")) {
      return true;
    }
    throw error;
  }
}

export async function getPublishedLinkHubProfileBySlug(
  slug: string,
): Promise<LinkHubProfile | null> {
  const normalized = sanitizeSlug(slug);
  if (!normalized) return null;

  const profileQuery = query(
    collection(db, LINK_HUB_COLLECTION),
    where("slug", "==", normalized),
    where("published", "==", true),
    limit(1),
  );
  const snapshot = await getDocs(profileQuery);
  if (snapshot.empty) {
    return null;
  }

  const payload = snapshot.docs[0].data() as Partial<LinkHubProfile> & Record<string, unknown>;
  const blocked = Boolean(payload.subscriptionBlocked);
  const status = safeText(payload.subscriptionStatus).toUpperCase();
  const endAtRaw = Number(payload.subscriptionEndAt || 0);
  const endAt = Number.isFinite(endAtRaw) ? endAtRaw : 0;
  const expiredByDate = endAt > 0 && endAt <= Date.now();
  const blockedByStatus = status.length > 0 && status !== "ACTIVE";

  if (blocked || blockedByStatus || expiredByDate) {
    return null;
  }

  const ownerId = safeText(payload.userId);
  if (ownerId) {
    try {
      const ownerSnapshot = await getDoc(doc(db, "users", ownerId));
      if (ownerSnapshot.exists()) {
        const ownerData = ownerSnapshot.data() as Record<string, unknown>;
        const ownerStatus = safeText(ownerData.subscriptionStatus).toUpperCase();
        const ownerEndAtRaw = Number(ownerData.subscriptionEndAt || 0);
        const ownerEndAt = Number.isFinite(ownerEndAtRaw) ? ownerEndAtRaw : 0;
        const ownerExpiredByDate = ownerEndAt > 0 && ownerEndAt <= Date.now();
        const ownerBlockedByStatus = ownerStatus.length > 0 && ownerStatus !== "ACTIVE";
        if (ownerBlockedByStatus || ownerExpiredByDate) {
          return null;
        }
      }
    } catch {
      // Keep published profile visible if owner subscription cannot be read from client rules.
    }
  }

  return normalizeLinkHubProfile(payload);
}
