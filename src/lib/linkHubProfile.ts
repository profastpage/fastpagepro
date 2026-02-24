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

export const LINK_HUB_COLLECTION = "link_profiles";
export const MAX_LINK_HUB_LINKS = 12;
export const MAX_LINK_HUB_CATALOG_CATEGORIES = 16;
export const MAX_LINK_HUB_CATALOG_ITEMS = 120;
export const MAX_LINK_HUB_COVER_IMAGES = 5;

export const LINK_HUB_THEME_STYLES = {
  midnight: {
    label: "Black Gold Deluxe",
    primary: "#fbbf24",
    secondary: "#f59e0b",
    background: "from-zinc-950 via-black to-amber-950",
    surface: "border-amber-200/25 bg-amber-100/10",
    button:
      "border-amber-200/35 bg-gradient-to-r from-amber-300/25 to-yellow-300/20 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/70",
    accent: "text-amber-200",
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
    label: "Obsidian",
    primary: "#a855f7",
    secondary: "#06b6d4",
    background: "from-zinc-950 via-violet-950 to-cyan-950",
    surface: "border-violet-200/20 bg-violet-100/10",
    button:
      "border-violet-200/30 bg-gradient-to-r from-violet-300/30 to-cyan-300/30 text-violet-50 hover:brightness-110",
    muted: "text-violet-100/75",
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
export type LinkHubButtonShape = "rounded" | "pill" | "square";
export type LinkHubCardStyle = "glass" | "solid" | "outline";

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
  imageUrl: string;
  price: string;
  compareAtPrice?: string;
  badge?: string;
  emoji?: string;
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
  fontFamily: LinkHubFontFamily;
  buttonShape: LinkHubButtonShape;
  cardStyle: LinkHubCardStyle;
  sectionLabels: LinkHubSectionLabels;
  theme: LinkHubTheme;
  themePrimaryColor?: string;
  themeSecondaryColor?: string;
  published: boolean;
  publishedAt?: number;
  links: LinkHubLink[];
  catalogCategories: LinkHubCatalogCategory[];
  catalogItems: LinkHubCatalogItem[];
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

function getSafeBusinessType(type: unknown): LinkHubBusinessType {
  return safeText(type).toLowerCase() === "general" ? "general" : "restaurant";
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
    imageUrl: "",
    price: "",
    compareAtPrice: "",
    badge: "",
    emoji: "",
  };
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

  return {
    userId: safeText(user.uid),
    slug: slugBase || "creator",
    displayName: fallbackName,
    bio: "",
    avatarUrl: safeText(user.photoURL),
    coverImageUrl: "",
    coverImageUrls: [],
    categoryLabel: businessType === "restaurant" ? "Cevicheria" : "Tienda online",
    phoneNumber: "",
    whatsappNumber: "",
    businessType,
    fontFamily: "modern",
    buttonShape: "rounded",
    cardStyle: "glass",
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
        imageUrl: safeText(item?.imageUrl),
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

  const rawLocation: Record<string, unknown> = isRecord(input.location) ? input.location : {};
  const location: LinkHubLocation = {
    address: safeText(rawLocation["address"]) || base.location.address,
    mapEmbedUrl: safeText(rawLocation["mapEmbedUrl"]) || base.location.mapEmbedUrl,
    mapsUrl: safeText(rawLocation["mapsUrl"]) || base.location.mapsUrl,
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
  const colors = getLinkHubThemeColors(
    safeTheme,
    safeText(input.themePrimaryColor) || base.themePrimaryColor,
    safeText(input.themeSecondaryColor) || base.themeSecondaryColor,
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
    categoryLabel:
      safeText(input.categoryLabel) ||
      (businessType === "restaurant" ? "Restaurante" : "Tienda online"),
    phoneNumber: safeText(input.phoneNumber),
    whatsappNumber: safeText(input.whatsappNumber),
    businessType,
    fontFamily: getSafeLinkHubFontFamily(safeText(input.fontFamily) || base.fontFamily),
    buttonShape: getSafeLinkHubButtonShape(safeText(input.buttonShape) || base.buttonShape),
    cardStyle: getSafeLinkHubCardStyle(safeText(input.cardStyle) || base.cardStyle),
    sectionLabels,
    theme: safeTheme,
    themePrimaryColor: colors.primary,
    themeSecondaryColor: colors.secondary,
    published: Boolean(input.published),
    publishedAt: Number(input.publishedAt) || undefined,
    links: links.length > 0 ? links : base.links,
    catalogCategories: finalCategories,
    catalogItems: finalItems,
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

  return normalizeLinkHubProfile(snapshot.docs[0].data() as Partial<LinkHubProfile>);
}
