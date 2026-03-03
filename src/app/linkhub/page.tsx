"use client";

import { ChangeEvent, ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { auth, storage } from "@/lib/firebase";
import { fetchCurrentSubscriptionSummary } from "@/lib/subscription/client";
import { requestPublishTarget } from "@/lib/subscription/publishClient";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";
import {
  buildDefaultLinkHubProfile,
  buildRestaurantRecordingDemoProfile,
  createLinkHubCatalogCategory,
  createLinkHubCatalogItem,
  getSafeLinkHubCartaBackgroundMode,
  getLinkHubThemeColors,
  getSafeLinkHubThemeCategory,
  getSafeLinkHubTheme,
  recommendCartaThemeIdByLinkTheme,
  hexToRgba,
  isLinkHubSlugAvailable,
  isValidExternalUrl,
  LINK_HUB_THEME_CATEGORY_LABELS,
  LINK_HUB_THEME_CATEGORY_MAP,
  LINK_HUB_THEME_STYLES,
  LinkHubLink,
  LinkHubLinkType,
  LinkHubBusinessType,
  LinkHubCatalogItem,
  LinkHubProTestimonial,
  LinkHubPricingPlan,
  LinkHubProfile,
  LinkHubThemeCategory,
  LinkHubTextTone,
  LinkHubTheme,
  LINK_HUB_PRO_TESTIMONIALS_COUNT,
  MAX_LINK_HUB_CATALOG_CATEGORIES,
  MAX_LINK_HUB_CATALOG_ITEMS,
  MAX_LINK_HUB_COVER_IMAGES,
  MAX_LINK_HUB_ITEM_GALLERY_IMAGES,
  normalizeHexColor,
  normalizeLinkUrl,
  normalizeLinkHubProfile,
  normalizeGoogleMapsLocationInput,
  sanitizeSlug,
  listLinkHubProfilesByUserId,
  saveLinkHubProfileForUser,
  MAX_LINK_HUB_LINKS,
} from "@/lib/linkHubProfile";
import { isThemeAllowedForPlan } from "@/lib/permissions";
import {
  CARTA_CUSTOM_DEFAULTS,
  CARTA_THEME_OPTIONS,
  CartaCustomStyle,
  CartaThemeId,
  getCartaTheme,
  getSafeCartaCustomStyle,
  getSafeCartaThemeId,
  recommendCartaThemeIdByRubro,
  resolveCartaThemeIdFromDemo,
} from "@/theme/cartaThemes";
import PlanBadge from "@/components/subscription/PlanBadge";
import SubscriptionExpiryBanner from "@/components/subscription/SubscriptionExpiryBanner";
import MobilePlanStatusCard from "@/components/subscription/MobilePlanStatusCard";
import {
  CheckCircle2,
  Circle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Fish,
  Globe,
  ImagePlus,
  Images,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  MoveDown,
  MoveUp,
  Music2,
  Palette,
  Phone,
  Plus,
  Percent,
  Save,
  Search,
  Sparkles,
  Store,
  Users,
  BadgeDollarSign,
  Trash2,
  Upload,
  Youtube,
  Facebook,
  MessageCircle,
  AtSign,
  Rocket,
  Lock,
  X,
} from "lucide-react";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";

type SaveMode = "draft" | "publish";
type EditorSectionKey =
  | "checklist"
  | "identity"
  | "bioLinks"
  | "catalog"
  | "pro"
  | "location"
  | "reservation"
  | "themes";

type LinkHubMetricsSummary = {
  whatsappClicks: number;
  totalOrders: number;
  totalReservations: number;
  topDishes: Array<{ name: string; quantity: number }>;
  peakHours: Array<{ hour: string; clicks: number }>;
  categories: Array<{
    categoryId: string;
    categoryName: string;
    views: number;
    orders: number;
    conversionRate: number;
  }>;
};

type WeeklyPromoSuggestion = {
  day: string;
  headline: string;
  description: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
  focusCategory: string;
};

const LINK_TYPE_OPTIONS: Array<{ value: LinkHubLinkType; label: string }> = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "x", label: "X / Twitter" },
];

const RECORDING_DEMO_TARGET_EMAIL = "gozustrike@gmail.com";
const RECORDING_DEMO_PROFILE_ID_SUFFIX = "demo-burger-lab-recording";
const RECORDING_DEMO_BUSINESS_WHATSAPP = "51919662011";

const RESTAURANT_SUBCATEGORY_OPTIONS = [
  "Cafeteria",
  "Pizzeria",
  "Restobar",
  "Parrilla",
  "Anticucheria",
  "Panaderia",
  "Jugueria",
  "Heladeria",
  "Cevicheria",
  "Comida marina",
  "Polleria",
  "Hamburgueseria",
  "Pasteleria",
  "Sangucheria",
  "Comida criolla",
  "Comida china",
  "Chifa",
  "Sushi",
  "Comida japonesa",
  "Comida mexicana",
  "Comida italiana",
  "Comida internacional",
  "Carnes y parrillas",
  "Comida saludable",
  "Comida rapida",
];

type RestaurantDishSeed = {
  title: string;
  description: string;
  price: string;
  compareAtPrice?: string;
};

const DEFAULT_RESTAURANT_RUBRO = "Cafeteria";

const RESTAURANT_DISH_SEEDS_BY_RUBRO: Record<string, RestaurantDishSeed[]> = {
  cafeteria: [
    { title: "Capuccino clasico", description: "Cafe espresso con espuma cremosa y canela.", price: "12.00", compareAtPrice: "14.00" },
    { title: "Latte vainilla", description: "Leche vaporizada, espresso doble y toque de vainilla.", price: "13.00", compareAtPrice: "15.00" },
    { title: "Croissant mantequilla", description: "Horneado del dia, dorado y crujiente.", price: "9.00", compareAtPrice: "10.00" },
    { title: "Sandwich mixto", description: "Pan brioche, jamon artesanal y queso fundido.", price: "14.00", compareAtPrice: "16.00" },
    { title: "Cheesecake de frutos", description: "Porcion casera con topping de frutos rojos.", price: "15.00", compareAtPrice: "18.00" },
  ],
  pizzeria: [
    { title: "Pizza margarita", description: "Salsa de tomate, mozzarella fresca y albahaca.", price: "29.00", compareAtPrice: "33.00" },
    { title: "Pizza pepperoni", description: "Pepperoni crocante, queso extra y oregano.", price: "34.00", compareAtPrice: "38.00" },
    { title: "Pizza hawaiana", description: "Jamón ahumado, piña caramelizada y mozzarella.", price: "35.00", compareAtPrice: "39.00" },
    { title: "Pizza cuatro quesos", description: "Mozzarella, parmesano, azul y provolone.", price: "38.00", compareAtPrice: "43.00" },
    { title: "Pizza suprema", description: "Mix de carnes, pimientos y aceitunas negras.", price: "42.00", compareAtPrice: "46.00" },
  ],
  restobar: [
    { title: "Alitas bbq premium", description: "Alitas glaseadas con salsa bbq de la casa.", price: "27.00", compareAtPrice: "31.00" },
    { title: "Nachos loaded", description: "Totopos, queso fundido, guacamole y pico de gallo.", price: "25.00", compareAtPrice: "29.00" },
    { title: "Burger restobar", description: "Blend de res, cebolla crispy y salsa especial.", price: "32.00", compareAtPrice: "36.00" },
    { title: "Piqueo marino", description: "Mix de mariscos crispy con salsas de autor.", price: "39.00", compareAtPrice: "44.00" },
    { title: "Tacos crispy", description: "Tres tacos crocantes con carne y crema chipotle.", price: "29.00", compareAtPrice: "33.00" },
  ],
  parrilla: [
    { title: "Parrillada especial", description: "Corte de res, chorizo, pollo y papas doradas.", price: "56.00", compareAtPrice: "63.00" },
    { title: "Lomo a la parrilla", description: "Lomo fino al punto con chimichurri artesanal.", price: "49.00", compareAtPrice: "55.00" },
    { title: "Costillas bbq", description: "Costillas ahumadas con salsa bbq intensa.", price: "45.00", compareAtPrice: "51.00" },
    { title: "Anticuchos mixtos", description: "Corazon, pollo y chorizo con papa y choclo.", price: "32.00", compareAtPrice: "36.00" },
    { title: "Brochetas andinas", description: "Brochetas de carne y verduras al carbon.", price: "34.00", compareAtPrice: "38.00" },
  ],
  panaderia: [
    { title: "Pan campesino", description: "Masa madre horneada al dia, corteza crocante.", price: "8.00", compareAtPrice: "9.00" },
    { title: "Pan ciabatta", description: "Pan artesanal ideal para sandwich o piqueo.", price: "9.00", compareAtPrice: "10.00" },
    { title: "Empanada de pollo", description: "Masa hojaldrada con relleno casero jugoso.", price: "7.00", compareAtPrice: "8.00" },
    { title: "Roll de canela", description: "Suave y glaseado, recien horneado.", price: "10.00", compareAtPrice: "12.00" },
    { title: "Pan con queso", description: "Pan caliente con centro de queso fundido.", price: "6.00", compareAtPrice: "7.00" },
  ],
  cevicheria: [
    { title: "Ceviche clasico", description: "Pescado fresco, leche de tigre y camote glaseado.", price: "27.00", compareAtPrice: "31.00" },
    { title: "Ceviche mixto", description: "Pescado y mariscos con limon y aji limo.", price: "34.00", compareAtPrice: "38.00" },
    { title: "Arroz con mariscos", description: "Arroz meloso con mariscos salteados.", price: "36.00", compareAtPrice: "40.00" },
    { title: "Jalea marina", description: "Fritura de mariscos con salsa criolla.", price: "39.00", compareAtPrice: "44.00" },
    { title: "Leche de tigre", description: "Copa concentrada y picante al gusto.", price: "18.00", compareAtPrice: "21.00" },
  ],
  polleria: [
    { title: "1/4 pollo a la brasa", description: "Pollo dorado con papas fritas y ensalada.", price: "22.00", compareAtPrice: "25.00" },
    { title: "1/2 pollo a la brasa", description: "Porcion familiar con cremas especiales.", price: "39.00", compareAtPrice: "44.00" },
    { title: "Mostrito broaster", description: "Arroz chaufa con pieza broaster crocante.", price: "24.00", compareAtPrice: "28.00" },
    { title: "Alitas anticucheras", description: "Alitas grill con aderezo anticuchero.", price: "26.00", compareAtPrice: "30.00" },
    { title: "Parrilla pollera", description: "Mix de pollo y chorizo con papas nativas.", price: "32.00", compareAtPrice: "36.00" },
  ],
  hamburgueseria: [
    { title: "Burger clasica", description: "Carne angus, queso cheddar y salsa de la casa.", price: "24.00", compareAtPrice: "28.00" },
    { title: "Burger doble smash", description: "Doble carne smash con cebolla grill.", price: "29.00", compareAtPrice: "33.00" },
    { title: "Burger crispy chicken", description: "Pollo crispy, pepinillos y mayo spicy.", price: "26.00", compareAtPrice: "30.00" },
    { title: "Burger bbq bacon", description: "Tocino crocante, bbq y aros de cebolla.", price: "31.00", compareAtPrice: "35.00" },
    { title: "Burger premium", description: "Blend especial, queso azul y cebolla caramelizada.", price: "34.00", compareAtPrice: "39.00" },
  ],
  pasteleria: [
    { title: "Torta de chocolate", description: "Bizcocho humedo con fudge artesanal.", price: "16.00", compareAtPrice: "18.00" },
    { title: "Cheesecake frutos rojos", description: "Base crocante y topping de frutos del bosque.", price: "17.00", compareAtPrice: "19.00" },
    { title: "Tres leches", description: "Suave, cremosa y con canela al punto.", price: "14.00", compareAtPrice: "16.00" },
    { title: "Tarta de limon", description: "Crema de limon y merengue tostado.", price: "15.00", compareAtPrice: "17.00" },
    { title: "Brownie premium", description: "Chocolate intenso con nueces tostadas.", price: "12.00", compareAtPrice: "14.00" },
  ],
  sangucheria: [
    { title: "Sanguche de chicharron", description: "Pan frances, camote y salsa criolla.", price: "17.00", compareAtPrice: "19.00" },
    { title: "Sanguche de lomo", description: "Lomo saltado en pan artesanal.", price: "19.00", compareAtPrice: "22.00" },
    { title: "Sanguche de pollo", description: "Pollo deshilachado, mayonesa casera y lechuga.", price: "15.00", compareAtPrice: "17.00" },
    { title: "Sanguche criollo", description: "Panceta, salsa de aji amarillo y cebolla.", price: "18.00", compareAtPrice: "21.00" },
    { title: "Sanguche mixto premium", description: "Jamón, queso y tocino con pan brioche.", price: "20.00", compareAtPrice: "23.00" },
  ],
  "comida criolla": [
    { title: "Lomo saltado", description: "Res salteada con cebolla, tomate y papas.", price: "28.00", compareAtPrice: "32.00" },
    { title: "Aji de gallina", description: "Crema de aji amarillo con pollo y papa.", price: "24.00", compareAtPrice: "28.00" },
    { title: "Seco de res", description: "Guiso de culantro con frejoles y arroz.", price: "27.00", compareAtPrice: "31.00" },
    { title: "Arroz con pollo", description: "Arroz verde tradicional con presa dorada.", price: "23.00", compareAtPrice: "26.00" },
    { title: "Tallarines rojos", description: "Pasta en salsa criolla con carne guisada.", price: "22.00", compareAtPrice: "25.00" },
  ],
  "comida saludable": [
    { title: "Bowl proteico", description: "Quinua, pollo grill y vegetales frescos.", price: "24.00", compareAtPrice: "27.00" },
    { title: "Ensalada fit", description: "Mix verde, palta, semillas y aderezo light.", price: "21.00", compareAtPrice: "24.00" },
    { title: "Wrap integral", description: "Tortilla integral con pollo y vegetales.", price: "20.00", compareAtPrice: "23.00" },
    { title: "Salmon grill", description: "Salmon a la plancha con pure de coliflor.", price: "34.00", compareAtPrice: "39.00" },
    { title: "Jugo detox", description: "Blend natural de pina, pepino y limon.", price: "13.00", compareAtPrice: "15.00" },
  ],
  "comida rapida": [
    { title: "Combo clasico", description: "Hamburguesa, papas y bebida personal.", price: "22.00", compareAtPrice: "25.00" },
    { title: "Salchipapa especial", description: "Papas fritas, salchicha y salsas mixtas.", price: "18.00", compareAtPrice: "21.00" },
    { title: "Hot dog supremo", description: "Pan brioche, salchicha jumbo y toppings.", price: "16.00", compareAtPrice: "18.00" },
    { title: "Nuggets crispy", description: "Porcion de nuggets con dip de la casa.", price: "17.00", compareAtPrice: "20.00" },
    { title: "Papas loaded", description: "Papas con cheddar, tocino y cebollin.", price: "19.00", compareAtPrice: "22.00" },
  ],
};

const CARTA_CUSTOM_STYLE_OPTIONS: Array<{
  value: CartaCustomStyle;
  label: string;
  description: string;
}> = [
  { value: "luxe", label: "Luxe", description: "Contraste premium con brillo elegante." },
  { value: "soft", label: "Soft", description: "Visual claro y limpio para lectura rapida." },
  { value: "neon", label: "Neon", description: "Acentos intensos con estilo moderno." },
];

const CARTA_RGB_PRESET_OPTIONS: Array<{
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  style: CartaCustomStyle;
}> = [
  { id: "gold_luxe", label: "Oro suave", primary: "#d4a84f", secondary: "#0f172a", accent: "#f59e0b", style: "luxe" },
  { id: "ocean_soft", label: "Oceano premium", primary: "#0e7490", secondary: "#f8fafc", accent: "#2563eb", style: "soft" },
  { id: "brasa_luxe", label: "Brasa deluxe", primary: "#d97706", secondary: "#111827", accent: "#dc2626", style: "luxe" },
  { id: "neon_night", label: "Neon night", primary: "#6366f1", secondary: "#020617", accent: "#22d3ee", style: "neon" },
  { id: "mint_soft", label: "Mint fresh", primary: "#15803d", secondary: "#f8fafc", accent: "#0f766e", style: "soft" },
  { id: "sunset_luxe", label: "Sunset luxe", primary: "#f97316", secondary: "#1e1b4b", accent: "#facc15", style: "luxe" },
  { id: "berry_neon", label: "Berry neon", primary: "#be123c", secondary: "#111827", accent: "#ec4899", style: "neon" },
  { id: "sky_soft", label: "Sky soft", primary: "#1d4ed8", secondary: "#f8fafc", accent: "#0ea5e9", style: "soft" },
  { id: "forest_luxe", label: "Forest luxe", primary: "#166534", secondary: "#0b1120", accent: "#84cc16", style: "luxe" },
  { id: "cobre_luxe", label: "Cobre urbano", primary: "#b45309", secondary: "#1f2937", accent: "#fb7185", style: "luxe" },
  { id: "aqua_neon", label: "Aqua neon", primary: "#0f766e", secondary: "#111827", accent: "#22d3ee", style: "neon" },
  { id: "violet_luxe", label: "Violet luxe", primary: "#7c3aed", secondary: "#111827", accent: "#f43f5e", style: "luxe" },
];

const LINK_TYPE_ICON: Record<LinkHubLinkType, ComponentType<{ className?: string }>> = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  x: AtSign,
};

function createClientUuid(): string {
  if (typeof globalThis !== "undefined") {
    const maybeCrypto = (globalThis as { crypto?: Crypto }).crypto;
    if (maybeCrypto && typeof maybeCrypto.randomUUID === "function") {
      return maybeCrypto.randomUUID();
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyLink(): LinkHubLink {
  return {
    id: createClientUuid(),
    title: "",
    url: "",
    type: "website",
  };
}

function highlightLastWord(value: string, accentColor: string) {
  const clean = value.trim();
  if (!clean) return value;
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return clean;
  const tail = parts.pop() || "";
  return (
    <>
      {parts.join(" ")} <span style={{ color: accentColor }}>{tail}</span>
    </>
  );
}

function randomColorHex(): string {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0")}`;
}

function parseHexColorToRgb(value: string): [number, number, number] | null {
  const normalized = String(value || "").trim();
  const short = normalized.match(/^#([0-9a-fA-F]{3})$/);
  if (short) {
    const [r, g, b] = short[1].split("").map((char) => Number.parseInt(char + char, 16));
    if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
    return [r, g, b];
  }
  const long = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (!long) return null;
  const hex = long[1];
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
  return [r, g, b];
}

function resolveSolidHexColor(value: string): string | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.startsWith("#")) return raw;
  const match = raw.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
  return match ? match[0] : null;
}

function isLightThemeSurface(value: string): boolean {
  const solid = resolveSolidHexColor(value);
  if (!solid) return false;
  const rgb = parseHexColorToRgb(solid);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance >= 0.67;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("La imagen no es valida."));
    image.src = dataUrl;
  });
}

type OptimizeImageOptions = {
  maxSize?: number;
  quality?: number;
  minQuality?: number;
  qualityStep?: number;
  maxBytes?: number;
  scaleStep?: number;
  maxIterations?: number;
};

type StoragePlanTier = "FREE" | "BUSINESS" | "PRO";
type ProfileImageKind = "avatar" | "cover" | "reservation" | "item" | "gallery";
const IMAGE_OPTIMIZE_TIMEOUT_MS = 35_000;
const STORAGE_UPLOAD_TIMEOUT_MS = 45_000;
const STORAGE_URL_TIMEOUT_MS = 20_000;
const PROFILE_COMPACT_TIMEOUT_MS = 70_000;
const PROFILE_SAVE_TIMEOUT_MS = 35_000;

function isInlineImageDataUrl(value: string): boolean {
  return /^data:image\//i.test(String(value || "").trim());
}

function estimateDataUrlBytes(dataUrl: string): number {
  const raw = String(dataUrl || "");
  const commaIndex = raw.indexOf(",");
  if (commaIndex < 0) return 0;
  const payload = raw.slice(commaIndex + 1);
  const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((payload.length * 3) / 4) - padding);
}

function estimateJsonBytes(value: unknown): number {
  try {
    const serialized = JSON.stringify(value);
    return new Blob([serialized]).size;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

function getStoragePlanTier(plan: string): StoragePlanTier {
  const normalized = String(plan || "").trim().toUpperCase();
  if (normalized === "PRO") return "PRO";
  if (normalized === "BUSINESS") return "BUSINESS";
  return "FREE";
}

function getImagePresetByPlan(plan: StoragePlanTier, kind: ProfileImageKind): OptimizeImageOptions {
  const baseByKind: Record<ProfileImageKind, OptimizeImageOptions> = {
    avatar: { maxSize: 420, quality: 0.8, minQuality: 0.5, maxBytes: 55_000 },
    cover: { maxSize: 920, quality: 0.8, minQuality: 0.45, maxBytes: 95_000 },
    reservation: { maxSize: 860, quality: 0.8, minQuality: 0.45, maxBytes: 90_000 },
    item: { maxSize: 680, quality: 0.78, minQuality: 0.45, maxBytes: 62_000 },
    gallery: { maxSize: 620, quality: 0.74, minQuality: 0.42, maxBytes: 48_000 },
  };

  const preset = baseByKind[kind];
  if (plan === "PRO") return preset;
  if (plan === "BUSINESS") {
    return {
      ...preset,
      maxSize: Math.round((preset.maxSize || 600) * 0.94),
      quality: Math.max(0.42, (preset.quality || 0.78) - 0.04),
      maxBytes: Math.round((preset.maxBytes || 55_000) * 0.88),
    };
  }
  return {
    ...preset,
    maxSize: Math.round((preset.maxSize || 600) * 0.86),
    quality: Math.max(0.38, (preset.quality || 0.78) - 0.1),
    maxBytes: Math.round((preset.maxBytes || 55_000) * 0.72),
  };
}

function withStricterPreset(base: OptimizeImageOptions, level: number): OptimizeImageOptions {
  if (level <= 1) return base;
  const ratio = Math.pow(0.84, level - 1);
  return {
    ...base,
    maxSize: Math.max(180, Math.round((base.maxSize || 700) * ratio)),
    quality: Math.max(0.26, (base.quality || 0.75) * ratio),
    minQuality: Math.max(0.22, (base.minQuality || 0.45) * ratio),
    maxBytes: Math.max(9_000, Math.round((base.maxBytes || 50_000) * ratio)),
  };
}

async function optimizeImageDataUrl(
  source: string,
  options?: OptimizeImageOptions,
): Promise<string> {
  const image = await loadImageFromDataUrl(source);

  const maxSize = Math.max(160, options?.maxSize ?? 640);
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
  let width = Math.max(1, Math.round(image.width * ratio));
  let height = Math.max(1, Math.round(image.height * ratio));

  const minQuality = Math.max(0.2, Math.min(0.95, options?.minQuality ?? 0.42));
  let quality = Math.max(minQuality, Math.min(0.95, options?.quality ?? 0.78));
  const qualityStep = Math.max(0.02, Math.min(0.18, options?.qualityStep ?? 0.06));
  const scaleStep = Math.max(0.72, Math.min(0.96, options?.scaleStep ?? 0.9));
  const maxIterations = Math.max(3, Math.min(18, options?.maxIterations ?? 11));
  const maxBytes = Math.max(8_000, options?.maxBytes ?? 72_000);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la imagen.");

  let best = source;
  let bestBytes = estimateDataUrlBytes(source);

  for (let attempt = 0; attempt < maxIterations; attempt += 1) {
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const encoded = canvas.toDataURL("image/jpeg", quality);
    const bytes = estimateDataUrlBytes(encoded);
    if (bytes < bestBytes) {
      best = encoded;
      bestBytes = bytes;
    }
    if (bytes <= maxBytes) {
      return encoded;
    }

    if (quality > minQuality + 0.01) {
      quality = Math.max(minQuality, quality - qualityStep);
      continue;
    }

    const nextWidth = Math.max(140, Math.round(width * scaleStep));
    const nextHeight = Math.max(140, Math.round(height * scaleStep));
    if (nextWidth === width && nextHeight === height) break;
    width = nextWidth;
    height = nextHeight;
    quality = Math.max(minQuality, quality - qualityStep / 2);
  }

  return best;
}

async function optimizeImageFile(
  file: File,
  options?: OptimizeImageOptions,
): Promise<string> {
  const source = await readFileAsDataUrl(file);
  return withOperationTimeout(
    optimizeImageDataUrl(source, options),
    IMAGE_OPTIMIZE_TIMEOUT_MS,
    "image_optimize",
  );
}

type CompactProfileResult = {
  profile: LinkHubProfile;
  bytes: number;
  budget: number;
};

const IMAGE_PAYLOAD_BUDGET_BY_PLAN: Record<StoragePlanTier, number> = {
  FREE: 610_000,
  BUSINESS: 760_000,
  PRO: 900_000,
};

function getImagePayloadBudgetByPlan(plan: StoragePlanTier): number {
  return IMAGE_PAYLOAD_BUDGET_BY_PLAN[plan];
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  if (value < 1024) return `${Math.round(value)} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function withOperationTimeout<T>(task: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`OPERATION_TIMEOUT:${label}:${timeoutMs}`));
    }, Math.max(1_000, timeoutMs));

    task
      .then((value) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

function isOperationTimeoutError(error: unknown): boolean {
  const rawMessage = String((error as { message?: string })?.message || "").toLowerCase();
  return rawMessage.includes("operation_timeout:");
}

function mergeUniqueStrings(values: string[], limit?: number): string[] {
  const merged = values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value, index, source) => source.indexOf(value) === index);
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) {
    return merged;
  }
  return merged.slice(0, limit);
}

async function compactInlineDataUrl(
  value: string,
  kind: ProfileImageKind,
  plan: StoragePlanTier,
  pass: number,
): Promise<string> {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  if (!isInlineImageDataUrl(normalized)) return normalized;
  try {
    const preset = withStricterPreset(getImagePresetByPlan(plan, kind), pass);
    return await optimizeImageDataUrl(normalized, preset);
  } catch {
    return normalized;
  }
}

async function compactProfileImagesByPlan(
  input: LinkHubProfile,
  plan: StoragePlanTier,
): Promise<CompactProfileResult> {
  const budget = getImagePayloadBudgetByPlan(plan);
  const maxPasses = 7;
  let profile = JSON.parse(JSON.stringify(input)) as LinkHubProfile;
  let previousBytes = estimateJsonBytes(profile);

  for (let pass = 1; pass <= maxPasses; pass += 1) {
    const compactedAvatar = await compactInlineDataUrl(profile.avatarUrl, "avatar", plan, pass);
    const compactedCovers: string[] = [];
    const coverSources = mergeUniqueStrings(
      [...(profile.coverImageUrls || []), profile.coverImageUrl],
      MAX_LINK_HUB_COVER_IMAGES,
    );
    for (const image of coverSources) {
      compactedCovers.push(await compactInlineDataUrl(image, "cover", plan, pass));
    }
    const normalizedCoverImages = mergeUniqueStrings(compactedCovers, MAX_LINK_HUB_COVER_IMAGES);
    const compactedReservationHero = await compactInlineDataUrl(
      profile.reservation?.heroImageUrl || "",
      "reservation",
      plan,
      pass,
    );

    const compactedItems: LinkHubCatalogItem[] = [];
    for (const item of profile.catalogItems || []) {
      const compactedPrimaryImage = await compactInlineDataUrl(item.imageUrl, "item", plan, pass);
      const gallerySources = mergeUniqueStrings(
        (item.galleryImageUrls || []).filter(
          (image) => String(image || "").trim() !== String(item.imageUrl || "").trim(),
        ),
        MAX_LINK_HUB_ITEM_GALLERY_IMAGES,
      );
      const compactedGallery: string[] = [];
      for (const image of gallerySources) {
        compactedGallery.push(await compactInlineDataUrl(image, "gallery", plan, pass));
      }
      compactedItems.push({
        ...item,
        imageUrl: compactedPrimaryImage,
        galleryImageUrls: mergeUniqueStrings(
          compactedGallery.filter(
            (image) => String(image || "").trim() !== String(compactedPrimaryImage || "").trim(),
          ),
          MAX_LINK_HUB_ITEM_GALLERY_IMAGES,
        ),
      });
    }

    profile = {
      ...profile,
      avatarUrl: compactedAvatar,
      coverImageUrls: normalizedCoverImages,
      coverImageUrl: normalizedCoverImages[0] || "",
      reservation: {
        ...profile.reservation,
        heroImageUrl: compactedReservationHero,
      },
      catalogItems: compactedItems,
    };

    const bytes = estimateJsonBytes(profile);
    if (bytes <= budget) {
      return { profile, bytes, budget };
    }
    const shrinkDelta = previousBytes - bytes;
    previousBytes = bytes;
    if (pass >= 4 && shrinkDelta < 1_500) {
      break;
    }
  }

  return { profile, bytes: estimateJsonBytes(profile), budget };
}

function getDataUrlMimeType(dataUrl: string): string {
  const source = String(dataUrl || "").trim();
  const match = source.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/i);
  return match?.[1]?.toLowerCase() || "image/jpeg";
}

function getMimeExtension(mimeType: string): string {
  const normalized = String(mimeType || "").toLowerCase();
  if (normalized === "image/png") return "png";
  if (normalized === "image/webp") return "webp";
  if (normalized === "image/gif") return "gif";
  return "jpg";
}

async function dataUrlToBlob(dataUrl: string, mimeType: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob.type ? blob : new Blob([blob], { type: mimeType });
}

type OffloadImageOptions = {
  userId: string;
  profileId: string;
};

async function offloadProfileInlineImagesToStorage(
  input: LinkHubProfile,
  options: OffloadImageOptions,
): Promise<LinkHubProfile> {
  const cache = new Map<string, string>();

  const uploadInlineImage = async (value: string, pathSegment: string): Promise<string> => {
    const source = String(value || "").trim();
    if (!source) return "";
    if (!isInlineImageDataUrl(source)) return source;
    const cached = cache.get(source);
    if (cached) return cached;
    try {
      const mimeType = getDataUrlMimeType(source);
      const extension = getMimeExtension(mimeType);
      const fileName = `${Date.now()}-${createClientUuid()}.${extension}`;
      const objectPath = `linkhub-images/${options.userId}/${options.profileId}/${pathSegment}/${fileName}`;
      const blob = await dataUrlToBlob(source, mimeType);
      const uploadRef = storageRef(storage, objectPath);
      await withOperationTimeout(
        uploadBytes(uploadRef, blob, {
          cacheControl: "public,max-age=31536000,immutable",
          contentType: mimeType,
        }),
        STORAGE_UPLOAD_TIMEOUT_MS,
        "storage_upload",
      );
      const downloadUrl = await withOperationTimeout(
        getDownloadURL(uploadRef),
        STORAGE_URL_TIMEOUT_MS,
        "storage_get_url",
      );
      cache.set(source, downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.warn("[LinkHub] Storage offload skipped for image:", error);
      return source;
    }
  };

  const coverSources = mergeUniqueStrings(
    [...(input.coverImageUrls || []), input.coverImageUrl],
    MAX_LINK_HUB_COVER_IMAGES,
  );
  const offloadedCovers: string[] = [];
  for (let index = 0; index < coverSources.length; index += 1) {
    offloadedCovers.push(await uploadInlineImage(coverSources[index], `cover-${index + 1}`));
  }

  const offloadedItems: LinkHubCatalogItem[] = [];
  for (const item of input.catalogItems || []) {
    const offloadedPrimary = await uploadInlineImage(item.imageUrl, `item/${item.id}/primary`);
    const gallerySources = mergeGalleryImages(item.galleryImageUrls || []);
    const offloadedGallery: string[] = [];
    for (let index = 0; index < gallerySources.length; index += 1) {
      offloadedGallery.push(
        await uploadInlineImage(gallerySources[index], `item/${item.id}/gallery-${index + 1}`),
      );
    }
    offloadedItems.push({
      ...item,
      imageUrl: offloadedPrimary,
      galleryImageUrls: mergeGalleryImages(
        offloadedGallery.filter((image) => image.trim() !== offloadedPrimary.trim()),
      ),
    });
  }

  const normalizedCoverImages = mergeUniqueStrings(offloadedCovers, MAX_LINK_HUB_COVER_IMAGES);

  return {
    ...input,
    avatarUrl: await uploadInlineImage(input.avatarUrl, "avatar"),
    coverImageUrls: normalizedCoverImages,
    coverImageUrl: normalizedCoverImages[0] || "",
    reservation: {
      ...input.reservation,
      heroImageUrl: await uploadInlineImage(input.reservation?.heroImageUrl || "", "reservation"),
    },
    catalogItems: offloadedItems,
  };
}

function sanitizeDemoParam(value: string | null) {
  return String(value || "")
    .trim()
    .replace(/[^\w-]/g, "");
}

function normalizeDigits(value: string): string {
  return String(value || "").replace(/\D/g, "");
}

function shouldConfirmExtraProjectSlot(): boolean {
  if (typeof window === "undefined") return false;
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
  const isNarrowViewport = window.matchMedia?.("(max-width: 1023px)")?.matches;
  return !isCoarsePointer && !isNarrowViewport;
}

function isFirestorePermissionDenied(error: unknown): boolean {
  const code = String((error as { code?: string })?.code || "").toLowerCase();
  const message = String((error as { message?: string })?.message || "").toLowerCase();
  return code.includes("permission-denied") || message.includes("insufficient permissions");
}

function parseMultiline(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseEditorPrice(raw: string): number | null {
  const normalized = String(raw || "")
    .trim()
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, parsed);
}

function formatEditorPrice(value: number): string {
  return value.toFixed(2);
}

function mergeGalleryImages(images: string[]): string[] {
  return images
    .map((image) => String(image || "").trim())
    .filter(Boolean)
    .filter((image, index, list) => list.indexOf(image) === index)
    .slice(0, MAX_LINK_HUB_ITEM_GALLERY_IMAGES);
}

function formatMultiline(lines: string[]): string {
  return lines.join("\n");
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function toWhatsappUrl(raw: string): string {
  return buildWhatsappSendUrl(raw);
}

type CatalogDescriptionHint = {
  pattern: RegExp;
  emojis: string[];
  hooks: string[];
};

const RESTAURANT_DESCRIPTION_HINTS: CatalogDescriptionHint[] = [
  {
    pattern: /(ceviche|marino|pescado|conchas|langostin|langostino|jalea|parihuela|sudado)/i,
    emojis: ["🐟", "🦐", "🌊", "🍋"],
    hooks: [
      "frescura marina y sabor intenso en cada bocado",
      "sazon casera con toque costero para volver siempre",
      "equilibrio perfecto entre textura, aroma y frescura",
    ],
  },
  {
    pattern: /(chicharron|broaster|crispy|frito|frita|alita|pollo)/i,
    emojis: ["🍗", "🔥", "😋", "🍟"],
    hooks: [
      "crujiente por fuera y jugoso por dentro",
      "coccion al punto para disfrutar desde el primer mordisco",
      "sabor potente ideal para compartir o repetir",
    ],
  },
  {
    pattern: /(chaufa|arroz|wok|saltado|lomo|tallarin|pasta|noodle)/i,
    emojis: ["🍛", "🥢", "🔥", "🍜"],
    hooks: [
      "combinacion abundante con sazon irresistible",
      "mezcla de ingredientes al punto con gran aroma",
      "plato contundente y lleno de sabor en cada porcion",
    ],
  },
  {
    pattern: /(hamburguesa|burger|sandwich|pan|sanguch|wrap)/i,
    emojis: ["🍔", "🥪", "🔥", "🧀"],
    hooks: [
      "balance perfecto entre carne, pan y salsas",
      "sabor casero y porcion generosa para quedar feliz",
      "hecho al momento para disfrutarlo bien caliente",
    ],
  },
  {
    pattern: /(pizza|lasagna|lasana)/i,
    emojis: ["🍕", "🧀", "🔥", "🍅"],
    hooks: [
      "masa al punto con toppings que se lucen en cada slice",
      "sabor intenso con combinaciones para todos los gustos",
      "textura dorada y relleno poderoso para disfrutar sin pausa",
    ],
  },
];

const TEXT_TONE_OPTIONS: Array<{
  value: LinkHubTextTone;
  label: string;
  description: string;
}> = [
  {
    value: "white",
    label: "Texto blanco",
    description: "Alto contraste sobre fondos oscuros y modernos.",
  },
  {
    value: "black",
    label: "Texto negro",
    description: "Estilo limpio para layouts claros y elegantes.",
  },
  {
    value: "gold",
    label: "Texto dorado",
    description: "Apariencia premium llamativa y sofisticada.",
  },
  {
    value: "blackGold",
    label: "Negro + dorado",
    description: "Base profesional con acentos deluxe en partes clave.",
  },
];

const GENERAL_DESCRIPTION_HINTS: CatalogDescriptionHint[] = [
  {
    pattern: /(zapat|tenis|sneaker|calzado|sandalia|bota)/i,
    emojis: ["👟", "✨", "🛍️", "🔥"],
    hooks: [
      "estilo y comodidad para tu rutina diaria",
      "diseno moderno pensado para destacar",
      "acabado premium con ajuste comodo y versatil",
    ],
  },
  {
    pattern: /(camisa|polo|polera|casaca|chaqueta|vestido|jean|ropa|moda)/i,
    emojis: ["👕", "🧥", "✨", "🛍️"],
    hooks: [
      "look actual con detalles que elevan tu estilo",
      "materiales comodos para usar todo el dia",
      "prenda versatil para combinar facil y lucir increible",
    ],
  },
  {
    pattern: /(celular|smartphone|laptop|auricular|audifono|gamer|teclado|mouse|tablet|tecnolog)/i,
    emojis: ["📱", "💻", "⚡", "🎧"],
    hooks: [
      "rendimiento confiable para trabajo, estudio o entretenimiento",
      "tecnologia actual para mejorar tu experiencia diaria",
      "calidad y potencia en un solo producto",
    ],
  },
  {
    pattern: /(crema|serum|perfume|maquillaje|skincare|belleza|cosmet)/i,
    emojis: ["💄", "🧴", "✨", "🌸"],
    hooks: [
      "formula seleccionada para cuidar y resaltar tu estilo",
      "acabado premium para resultados visibles desde el primer uso",
      "ideal para tu rutina diaria con un toque profesional",
    ],
  },
];

const RESTAURANT_GENERIC_EMOJIS = ["🍽️", "😋", "🔥", "⭐"];
const GENERAL_GENERIC_EMOJIS = ["🛍️", "✨", "💯", "🚀"];
const RESTAURANT_STARTERS = ["Imperdible", "Recomendado", "Favorito del dia", "Recien preparado"];
const GENERAL_STARTERS = ["Nuevo ingreso", "Top venta", "Recomendado", "Edicion especial"];
const RESTAURANT_CLOSERS = [
  "Pide el tuyo hoy y disfruta una experiencia brutal.",
  "Ideal para compartir o darte un gustazo en cualquier momento.",
  "Listo para conquistar paladares desde el primer bocado.",
];
const GENERAL_CLOSERS = [
  "Llevatelo hoy y mejora tu experiencia desde el primer uso.",
  "Perfecto para ti o para regalar con acierto total.",
  "Una opcion que combina utilidad, estilo y valor real.",
];

function pickBySeed<T>(items: T[], seed: number): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty array.");
  }
  return items[Math.abs(seed) % items.length];
}

function normalizeTextForHints(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function extractImageHintText(imageUrl: string): string {
  if (!imageUrl || imageUrl.startsWith("data:image/")) return "";
  try {
    const decoded = decodeURIComponent(imageUrl);
    return decoded.replace(/\.[a-z0-9]{2,5}($|\?)/gi, " ").replace(/[\/_+=%-]/g, " ");
  } catch {
    return imageUrl.replace(/[\/_+=%-]/g, " ");
  }
}

function buildCatalogDescriptionSuggestion(
  item: LinkHubCatalogItem,
  businessType: LinkHubBusinessType,
  categoryName: string,
  seed: number,
): string {
  const title = item.title.trim();
  const fallbackName = businessType === "restaurant" ? "Especial de la casa" : "Producto destacado";
  const productName = title || fallbackName;
  const hintSource = normalizeTextForHints(`${productName} ${categoryName} ${extractImageHintText(item.imageUrl)}`);
  const hints = businessType === "restaurant" ? RESTAURANT_DESCRIPTION_HINTS : GENERAL_DESCRIPTION_HINTS;
  const matchedHint = hints.find((entry) => entry.pattern.test(hintSource));

  const genericEmojis = businessType === "restaurant" ? RESTAURANT_GENERIC_EMOJIS : GENERAL_GENERIC_EMOJIS;
  const starters = businessType === "restaurant" ? RESTAURANT_STARTERS : GENERAL_STARTERS;
  const closers = businessType === "restaurant" ? RESTAURANT_CLOSERS : GENERAL_CLOSERS;
  const hooks =
    matchedHint?.hooks ||
    (businessType === "restaurant"
      ? ["sabor equilibrado y presentacion que provoca", "calidad casera con un toque que enamora"]
      : ["calidad real para uso diario", "diseno funcional con gran presencia"]);

  const primaryEmoji = matchedHint ? pickBySeed(matchedHint.emojis, seed + 7) : pickBySeed(genericEmojis, seed + 11);
  const supportEmoji = matchedHint
    ? pickBySeed(matchedHint.emojis, seed + 13)
    : pickBySeed(genericEmojis, seed + 17);
  const starter = pickBySeed(starters, seed + 19);
  const hook = pickBySeed(hooks, seed + 23);
  const closer = pickBySeed(closers, seed + 29);

  return `${primaryEmoji} ${starter}: ${productName}. ${hook}. ${supportEmoji} ${closer}`;
}

function normalizeCategoryEmojiKeyword(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

function inferCatalogCategoryEmoji(categoryName: string, businessType: LinkHubBusinessType): string {
  const keyword = normalizeCategoryEmojiKeyword(categoryName);
  if (!keyword) return businessType === "restaurant" ? "🍽️" : "🛍️";
  if (/(ceviche|marisc|pescad|jalea|parihuela|langost|concha|marino|sudado)/.test(keyword)) return "🐟";
  if (/(hamburg|burger|sanguch|sandwich|wrap)/.test(keyword)) return "🍔";
  if (/(pollo|parrilla|brasa|carne|bbq|alita)/.test(keyword)) return "🍗";
  if (/(pizza|pastel|lasana|lasagna)/.test(keyword)) return "🍕";
  if (/(bebida|jugo|coctel|cocktail|bar|drink|refresco)/.test(keyword)) return "🥤";
  if (/(caf|coffee|postre|helad|dulce|pasteler)/.test(keyword)) return "☕";
  if (/(veg|healthy|salud|ensalada)/.test(keyword)) return "🥗";
  return businessType === "restaurant" ? "🍽️" : "🛍️";
}

function resolveCatalogItemEmojiByCategory(
  categoryId: string,
  categories: LinkHubProfile["catalogCategories"],
  businessType: LinkHubBusinessType,
): string {
  const category = categories.find((entry) => entry.id === categoryId);
  const explicitEmoji = String(category?.emoji || "").trim();
  if (explicitEmoji) return explicitEmoji;
  return inferCatalogCategoryEmoji(category?.name || "", businessType);
}

function normalizeRubroKeyword(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

function stripRubroEmojiPrefix(value: string): string {
  return String(value || "")
    .trim()
    .replace(/^[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]+/g, "")
    .trim();
}

function inferRubroEmoji(value: string): string {
  const keyword = normalizeRubroKeyword(stripRubroEmojiPrefix(value));
  if (!keyword) return "🍽️";
  if (/(ceviche|marisc|pescad|marino|jalea|parihuela)/.test(keyword)) return "🐟";
  if (/(pollo|polleria|broaster|brasa)/.test(keyword)) return "🍗";
  if (/(pizza|pizzeria)/.test(keyword)) return "🍕";
  if (/(caf|cafeteria|coffee|panader)/.test(keyword)) return "☕";
  if (/(hamburg|burger|comida rapida|fast)/.test(keyword)) return "🍔";
  if (/(parrilla|grill|asado|carne)/.test(keyword)) return "🥩";
  if (/(pasteler|postre|dulce|helad)/.test(keyword)) return "🍰";
  if (/(sanguch|sandwich)/.test(keyword)) return "🥪";
  if (/(crioll|peruan)/.test(keyword)) return "🍲";
  if (/(salud|healthy|veg|ensalad)/.test(keyword)) return "🥗";
  if (/(restobar|bar|coctel|cocktail|trago|bebida)/.test(keyword)) return "🍸";
  return "🍽️";
}

function formatRubroLabelWithEmoji(value: string): string {
  const clean = stripRubroEmojiPrefix(value) || DEFAULT_RESTAURANT_RUBRO;
  return `${inferRubroEmoji(clean)} ${clean}`;
}

function resolveRestaurantDishSeedsByRubro(value: string): RestaurantDishSeed[] {
  const keyword = normalizeRubroKeyword(stripRubroEmojiPrefix(value));
  if (!keyword) return RESTAURANT_DISH_SEEDS_BY_RUBRO.cafeteria;
  const directKey = Object.keys(RESTAURANT_DISH_SEEDS_BY_RUBRO).find((key) => keyword === key);
  if (directKey) return RESTAURANT_DISH_SEEDS_BY_RUBRO[directKey];
  if (keyword.includes("pizza")) return RESTAURANT_DISH_SEEDS_BY_RUBRO.pizzeria;
  if (keyword.includes("parrilla")) return RESTAURANT_DISH_SEEDS_BY_RUBRO.parrilla;
  if (keyword.includes("pollo")) return RESTAURANT_DISH_SEEDS_BY_RUBRO.polleria;
  if (keyword.includes("ceviche") || keyword.includes("marisc") || keyword.includes("pescad")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO.cevicheria;
  }
  if (keyword.includes("hamburg") || keyword.includes("burger")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO.hamburgueseria;
  }
  if (keyword.includes("pastel") || keyword.includes("postre")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO.pasteleria;
  }
  if (keyword.includes("sanguch") || keyword.includes("sandwich")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO.sangucheria;
  }
  if (keyword.includes("crioll")) return RESTAURANT_DISH_SEEDS_BY_RUBRO["comida criolla"];
  if (keyword.includes("salud") || keyword.includes("healthy") || keyword.includes("veg")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO["comida saludable"];
  }
  if (keyword.includes("rapida") || keyword.includes("fast")) {
    return RESTAURANT_DISH_SEEDS_BY_RUBRO["comida rapida"];
  }
  if (keyword.includes("panader")) return RESTAURANT_DISH_SEEDS_BY_RUBRO.panaderia;
  if (keyword.includes("restobar") || keyword.includes("bar")) return RESTAURANT_DISH_SEEDS_BY_RUBRO.restobar;
  return RESTAURANT_DISH_SEEDS_BY_RUBRO.cafeteria;
}

function buildRestaurantStarterItems(
  rubroLabel: string,
  categories: LinkHubProfile["catalogCategories"],
): LinkHubCatalogItem[] {
  const baseCategoryId = categories[0]?.id || "";
  const seeds = resolveRestaurantDishSeedsByRubro(rubroLabel).slice(0, 5);
  return seeds.map((seed) => ({
    ...createLinkHubCatalogItem(baseCategoryId),
    title: seed.title,
    description: seed.description,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice || "",
  }));
}

export default function LinkHubPage() {
  const { user, loading } = useAuth(true);
  const { summary: subscriptionSummary, reload: reloadSubscription } = useSubscription(Boolean(user?.uid));
  const planPermissions = usePlanPermissions(Boolean(user?.uid));
  const router = useRouter();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingReservationImage, setIsUploadingReservationImage] = useState(false);
  const [uploadingCatalogItemId, setUploadingCatalogItemId] = useState<string | null>(null);
  const [isBulkUploadingCatalog, setIsBulkUploadingCatalog] = useState(false);
  const [origin, setOrigin] = useState("");
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewCategoryId, setPreviewCategoryId] = useState("");
  const [previewTab, setPreviewTab] = useState<"contact" | "catalog" | "location" | "reservation">("catalog");
  const [editorItemSearch, setEditorItemSearch] = useState("");
  const [bulkUploadCategoryId, setBulkUploadCategoryId] = useState("all");
  const [priceAdjustCategoryId, setPriceAdjustCategoryId] = useState("all");
  const [priceAdjustPercent, setPriceAdjustPercent] = useState("");
  const [roiVisits, setRoiVisits] = useState("1200");
  const [roiConversionRate, setRoiConversionRate] = useState("4");
  const [roiTicketAverage, setRoiTicketAverage] = useState("45");
  const [isProTrialModalOpen, setIsProTrialModalOpen] = useState(false);
  const [proTrialFeatureLabel, setProTrialFeatureLabel] = useState("");
  const [isActivatingProTrial, setIsActivatingProTrial] = useState(false);
  const [proTrialError, setProTrialError] = useState("");
  const [isGeneratingWeeklyPromos, setIsGeneratingWeeklyPromos] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsSummary, setMetricsSummary] = useState<LinkHubMetricsSummary | null>(null);
  const [metricsError, setMetricsError] = useState("");
  const [mobileEditMenuOpen, setMobileEditMenuOpen] = useState(false);
  const [mobileEditMenuMode, setMobileEditMenuMode] = useState<"sections" | "editor">("sections");
  const [mobileEditorSection, setMobileEditorSection] = useState<EditorSectionKey>("identity");
  const [pendingCatalogEditorItemId, setPendingCatalogEditorItemId] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const descriptionSeedRef = useRef<number>(Date.now());
  const [demoSlugIntent, setDemoSlugIntent] = useState("");
  const [demoThemeIntent, setDemoThemeIntent] = useState("");
  const [requestedProfileId, setRequestedProfileId] = useState("");
  const hasAppliedIncomingDemoTheme = useRef(false);
  const identitySectionRef = useRef<HTMLDivElement | null>(null);
  const bioLinksSectionRef = useRef<HTMLDivElement | null>(null);
  const catalogSectionRef = useRef<HTMLDivElement | null>(null);
  const proSectionRef = useRef<HTMLDivElement | null>(null);
  const locationSectionRef = useRef<HTMLDivElement | null>(null);
  const reservationSectionRef = useRef<HTMLDivElement | null>(null);
  const themesSectionRef = useRef<HTMLDivElement | null>(null);
  const publishChecklistSectionRef = useRef<HTMLDivElement | null>(null);
  const publishChecklistEditorSectionRef = useRef<HTMLDivElement | null>(null);
  const proTrialBannerRef = useRef<HTMLDivElement | null>(null);
  const mobileTopDockRef = useRef<HTMLDivElement | null>(null);
  const catalogEditorItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activePlan = subscriptionSummary?.plan || "FREE";
  const storagePlanTier = useMemo(() => getStoragePlanTier(activePlan), [activePlan]);
  const resolveImagePreset = (kind: ProfileImageKind, strictLevel = 1) =>
    withStricterPreset(getImagePresetByPlan(storagePlanTier, kind), strictLevel);
  const isProPlan = activePlan === "PRO";
  const canUsePremiumThemes = activePlan === "BUSINESS" || activePlan === "PRO";
  const canUseReservations = activePlan === "BUSINESS" || activePlan === "PRO";
  const isProcessingImages =
    isUploadingAvatar ||
    isUploadingCover ||
    isUploadingReservationImage ||
    Boolean(uploadingCatalogItemId) ||
    isBulkUploadingCatalog;
  const aiEnabled = Boolean(subscriptionSummary?.features?.aiOptimization);
  const canCustomizeColors = Boolean(subscriptionSummary?.features?.advancedColorCustomization);
  const publishedProjectsLabel =
    planPermissions.maxProjects == null
      ? `${planPermissions.usage.publishedProjects}`
      : `${planPermissions.usage.publishedProjects}/${planPermissions.maxProjects}`;
  const planDaysRemaining = subscriptionSummary?.isBusinessTrial
    ? Math.max(0, Number(subscriptionSummary?.trialDaysRemaining || 0))
    : Math.max(0, Number(subscriptionSummary?.daysRemaining || 0));
  const roiSafeVisits = Math.max(0, Math.round(Number(roiVisits) || 0));
  const roiSafeConversionRate = Math.max(0.1, Math.min(100, Number(roiConversionRate) || 0.1));
  const roiSafeAverageTicket = Math.max(1, Number(roiTicketAverage) || 1);
  const roiExpectedOrders = Math.round((roiSafeVisits * roiSafeConversionRate) / 100);
  const roiExpectedRevenue = roiExpectedOrders * roiSafeAverageTicket;
  const roiPlanMonthlyCost = activePlan === "PRO" ? 99 : activePlan === "BUSINESS" ? 59 : 29;
  const roiOrdersToRecover = Math.max(1, Math.ceil(roiPlanMonthlyCost / roiSafeAverageTicket));
  const roiVisitsToRecover = Math.max(1, Math.ceil((roiOrdersToRecover * 100) / roiSafeConversionRate));

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!pendingCatalogEditorItemId) return;
    const timer = window.setTimeout(() => {
      const target = catalogEditorItemRefs.current[pendingCatalogEditorItemId];
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const titleInput = target.querySelector<HTMLInputElement>('input[data-catalog-item-title="true"]');
      titleInput?.focus();
      titleInput?.select();
      setPendingCatalogEditorItemId("");
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pendingCatalogEditorItemId, profile?.catalogItems.length]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDemoSlugIntent(sanitizeDemoParam(params.get("demoSlug")));
    setDemoThemeIntent(sanitizeDemoParam(params.get("demoTheme")));
    setRequestedProfileId(sanitizeDemoParam(params.get("profileId")));
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.uid) return;
      setIsLoadingProfile(true);
      try {
        const bootstrapScopedKey = requestedProfileId ? `linkhub_draft_${user.uid}_${requestedProfileId}` : "";
        const bootstrapFallbackKey = `linkhub_draft_${user.uid}`;
        const bootstrapCached = (bootstrapScopedKey ? window.localStorage.getItem(bootstrapScopedKey) : null)
          || window.localStorage.getItem(bootstrapFallbackKey);
        if (bootstrapCached) {
          const bootstrapDraft = normalizeLinkHubProfile(
            JSON.parse(bootstrapCached) as Partial<LinkHubProfile>,
            user,
          );
          setActiveProfileId(requestedProfileId || user.uid);
          setProfile((prev) => {
            if (!prev) return bootstrapDraft;
            return Number(bootstrapDraft.updatedAt || 0) > Number(prev.updatedAt || 0) ? bootstrapDraft : prev;
          });
          setPreviewCategoryId(bootstrapDraft.catalogCategories[0]?.id || "");
        }
      } catch {
        // Ignore local storage parse errors and continue with remote fetch.
      }

      try {
        let records = await listLinkHubProfilesByUserId(user.uid);
        if (!active) return;

        const normalizedEmail = String(user.email || "").trim().toLowerCase();
        const shouldAutoCreateRecordingDemo = normalizedEmail === RECORDING_DEMO_TARGET_EMAIL;
        const recordingDemoProfileId = `${user.uid}-${RECORDING_DEMO_PROFILE_ID_SUFFIX}`;
        let autoCreatedRecordingDemo = false;
        let recordingDemoEnsuredPublished = false;

        if (shouldAutoCreateRecordingDemo) {
          const existingRecordingDemo = records.find((item) => item.id === recordingDemoProfileId);
          if (!existingRecordingDemo) {
            try {
              const demoProfile = buildRestaurantRecordingDemoProfile(user);
              await saveLinkHubProfileForUser(user.uid, demoProfile, recordingDemoProfileId);
              records = await listLinkHubProfilesByUserId(user.uid);
              autoCreatedRecordingDemo = true;
              recordingDemoEnsuredPublished = true;
            } catch (autoCreateError) {
              if (isFirestorePermissionDenied(autoCreateError)) {
                console.warn("[LinkHub] Recording demo auto-create skipped due to Firestore permissions.");
              } else {
                console.error("[LinkHub] Failed auto-creating recording demo profile:", autoCreateError);
              }
            }
          } else {
            try {
              const normalizedExisting = normalizeLinkHubProfile(existingRecordingDemo.profile, user);
              const whatsappDigits = normalizeDigits(normalizedExisting.whatsappNumber);
              const needsPublished = !normalizedExisting.published;
              const needsPublishedAt = !Number(normalizedExisting.publishedAt || 0);
              const needsBusinessWhatsapp = whatsappDigits !== RECORDING_DEMO_BUSINESS_WHATSAPP;

              if (needsPublished || needsPublishedAt || needsBusinessWhatsapp) {
                const now = Date.now();
                const ensuredProfile = normalizeLinkHubProfile(
                  {
                    ...normalizedExisting,
                    phoneNumber: normalizeDigits(normalizedExisting.phoneNumber)
                      ? normalizedExisting.phoneNumber
                      : RECORDING_DEMO_BUSINESS_WHATSAPP,
                    whatsappNumber: RECORDING_DEMO_BUSINESS_WHATSAPP,
                    published: true,
                    publishedAt: Number(normalizedExisting.publishedAt || 0) || now,
                    updatedAt: now,
                  },
                  user,
                );

                await saveLinkHubProfileForUser(user.uid, ensuredProfile, recordingDemoProfileId);
                records = await listLinkHubProfilesByUserId(user.uid);
                recordingDemoEnsuredPublished = true;
              }
            } catch (autoPublishError) {
              if (isFirestorePermissionDenied(autoPublishError)) {
                console.warn("[LinkHub] Recording demo auto-publish skipped due to Firestore permissions.");
              } else {
                console.error("[LinkHub] Failed ensuring recording demo publication:", autoPublishError);
              }
            }
          }
        }

        const legacyRecord = records.find((item) => item.id === user.uid);
        const recordingDemoRecord = shouldAutoCreateRecordingDemo
          ? records.find((item) => item.id === recordingDemoProfileId)
          : null;
        const selectedRecord =
          (requestedProfileId ? records.find((item) => item.id === requestedProfileId) : null)
          || recordingDemoRecord
          || legacyRecord
          || records[0]
          || null;
        const selectedProfileId = selectedRecord?.id || user.uid;
        setActiveProfileId(selectedProfileId);

        let localDraft: LinkHubProfile | null = null;
        try {
          const scopedKey = `linkhub_draft_${user.uid}_${selectedProfileId}`;
          const fallbackKey = `linkhub_draft_${user.uid}`;
          const cached = window.localStorage.getItem(scopedKey) || window.localStorage.getItem(fallbackKey);
          if (cached) {
            localDraft = normalizeLinkHubProfile(
              JSON.parse(cached) as Partial<LinkHubProfile>,
              user,
            );
          }
        } catch {
          localDraft = null;
        }

        if (selectedRecord) {
          const normalized = normalizeLinkHubProfile(selectedRecord.profile, user);
          const nextProfile =
            localDraft && Number(localDraft.updatedAt || 0) > Number(normalized.updatedAt || 0)
              ? localDraft
              : normalized;
          setProfile(nextProfile);
          setPreviewCategoryId(nextProfile.catalogCategories[0]?.id || "");
          if (nextProfile === localDraft) {
            setMessage({ type: "success", text: "Se recupero tu borrador local mas reciente." });
          } else if (autoCreatedRecordingDemo) {
            setMessage({
              type: "success",
              text: "Demo real Burger Lab creada y publicada automaticamente. Ya aparece en Published.",
            });
          } else if (recordingDemoEnsuredPublished) {
            setMessage({
              type: "success",
              text: "Demo Burger Lab actualizada y publicada. Ya aparece en Published.",
            });
          }
          return;
        }

        const defaultProfile = buildDefaultLinkHubProfile(user);
        const nextProfile =
          localDraft && Number(localDraft.updatedAt || 0) > Number(defaultProfile.updatedAt || 0)
            ? localDraft
            : defaultProfile;
        setActiveProfileId(user.uid);
        setProfile(nextProfile);
        setPreviewCategoryId(nextProfile.catalogCategories[0]?.id || "");
      } catch (error) {
        console.error("[LinkHub] Failed loading profile:", error);
        if (active) {
          // Fallback prevents infinite loading if Firestore rules temporarily block reads.
          const fallback = buildDefaultLinkHubProfile(user);
          setActiveProfileId(user.uid);
          setProfile(fallback);
          setPreviewCategoryId(fallback.catalogCategories[0]?.id || "");
        }
        setMessage({
          type: "error",
          text: "No se pudo leer tu perfil guardado. Se cargo un borrador local para que puedas continuar.",
        });
      } finally {
        if (active) {
          setIsLoadingProfile(false);
        }
      }
    }

    if (!loading && user?.uid) {
      loadProfile();
    }

    return () => {
      active = false;
    };
  }, [loading, requestedProfileId, user]);

  useEffect(() => {
    if (!profile || !user?.uid) return;
    const profileId = activeProfileId || user.uid;
    try {
      window.localStorage.setItem(`linkhub_draft_${user.uid}_${profileId}`, JSON.stringify(profile));
      if (profileId === user.uid) {
        window.localStorage.setItem(`linkhub_draft_${user.uid}`, JSON.stringify(profile));
      }
    } catch {
      // Ignore storage errors (private mode/quota).
    }
  }, [activeProfileId, profile, user?.uid]);

  useEffect(() => {
    if (!profile || hasAppliedIncomingDemoTheme.current) return;
    hasAppliedIncomingDemoTheme.current = true;
    if (!demoSlugIntent && !demoThemeIntent) return;
    const nextCartaThemeId = resolveCartaThemeIdFromDemo(demoThemeIntent, demoSlugIntent);
    if (!nextCartaThemeId || nextCartaThemeId === profile.cartaThemeId) return;
    setProfile((prev) => (prev ? { ...prev, cartaThemeId: nextCartaThemeId } : prev));
  }, [demoSlugIntent, demoThemeIntent, profile]);

  useEffect(() => {
    if (!profile) return;
    const validIds = new Set(profile.catalogCategories.map((category) => category.id));
    const fallbackCategoryId = profile.catalogCategories[0]?.id || "";
    if (!fallbackCategoryId) return;

    const hasInvalidCategory = profile.catalogItems.some((item) => !validIds.has(item.categoryId));
    if (!hasInvalidCategory) return;

    setProfile((prev) => {
      if (!prev) return prev;
      const allowedIds = new Set(prev.catalogCategories.map((category) => category.id));
      const fallbackId = prev.catalogCategories[0]?.id || "";
      if (!fallbackId) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) =>
          allowedIds.has(item.categoryId) ? item : { ...item, categoryId: fallbackId },
        ),
      };
    });
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const normalizedCategory =
      profile.businessType === "restaurant"
        ? "food"
        : getSafeLinkHubThemeCategory(profile.themeCategory);
    const allowedThemes = LINK_HUB_THEME_CATEGORY_MAP[normalizedCategory];
    if (allowedThemes.length === 0) return;
    const safeTheme = allowedThemes.includes(profile.theme) ? profile.theme : allowedThemes[0];
    if (normalizedCategory === profile.themeCategory && safeTheme === profile.theme) return;

    const preset = LINK_HUB_THEME_STYLES[safeTheme];
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.themeCategory === normalizedCategory && prev.theme === safeTheme) return prev;
      if (prev.theme === safeTheme) {
        return {
          ...prev,
          themeCategory: normalizedCategory,
        };
      }
      return {
        ...prev,
        themeCategory: normalizedCategory,
        theme: safeTheme,
        themePrimaryColor: preset.primary,
        themeSecondaryColor: preset.secondary,
      };
    });
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const nextLabel = formatRubroLabelWithEmoji(profile.categoryLabel || DEFAULT_RESTAURANT_RUBRO);
    const needsRestaurantType = profile.businessType !== "restaurant";
    const needsLabelFix = profile.categoryLabel !== nextLabel;
    if (!needsRestaurantType && !needsLabelFix) return;

    setProfile((prev) => {
      if (!prev) return prev;
      const safeLabel = formatRubroLabelWithEmoji(prev.categoryLabel || DEFAULT_RESTAURANT_RUBRO);
      if (prev.businessType === "restaurant" && prev.categoryLabel === safeLabel) return prev;
      return {
        ...prev,
        businessType: "restaurant",
        categoryLabel: safeLabel,
      };
    });
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    if (profile.businessType !== "restaurant") return;
    const meaningfulItems = profile.catalogItems.filter((item) => item.title.trim().length > 0).length;
    if (meaningfulItems >= 5) return;

    setProfile((prev) => {
      if (!prev || prev.businessType !== "restaurant") return prev;
      const currentMeaningful = prev.catalogItems.filter((item) => item.title.trim().length > 0).length;
      if (currentMeaningful >= 5) return prev;

      const cleanLabel = stripRubroEmojiPrefix(prev.categoryLabel || DEFAULT_RESTAURANT_RUBRO);
      const formattedLabel = formatRubroLabelWithEmoji(cleanLabel);
      const rubroEmoji = inferRubroEmoji(cleanLabel);
      const categories =
        prev.catalogCategories.length > 0
          ? prev.catalogCategories.map((category, index) =>
              index === 0 ? { ...category, emoji: rubroEmoji, name: cleanLabel || category.name } : category,
            )
          : [createLinkHubCatalogCategory(cleanLabel || DEFAULT_RESTAURANT_RUBRO, rubroEmoji)];
      const categoryId = categories[0]?.id || "";
      const normalizedExisting = prev.catalogItems.map((item) =>
        applyCatalogItemVisualRules({ ...item, categoryId: item.categoryId || categoryId }, categories, "restaurant"),
      );
      const existingTitles = new Set(
        normalizedExisting.map((item) => item.title.trim().toLowerCase()).filter(Boolean),
      );
      const starterCandidates = buildRestaurantStarterItems(cleanLabel, categories)
        .map((item) => applyCatalogItemVisualRules({ ...item, categoryId }, categories, "restaurant"))
        .filter((item) => !existingTitles.has(item.title.trim().toLowerCase()));

      const nextItems = [...normalizedExisting];
      for (const starter of starterCandidates) {
        if (nextItems.filter((item) => item.title.trim().length > 0).length >= 5) break;
        nextItems.push(starter);
      }

      return {
        ...prev,
        categoryLabel: formattedLabel,
        catalogCategories: categories,
        catalogItems: nextItems.slice(0, MAX_LINK_HUB_CATALOG_ITEMS),
      };
    });
  }, [profile?.businessType, profile?.categoryLabel, profile?.catalogCategories.length, profile?.catalogItems.length]);

  const publicUrl = useMemo(() => {
    if (!profile?.slug || !origin) return "";
    return `${origin}/bio/${profile.slug}`;
  }, [origin, profile?.slug]);

  const activeTheme = useMemo(() => {
    const themeKey = getSafeLinkHubTheme(profile?.theme);
    const preset = LINK_HUB_THEME_STYLES[themeKey];
    const colors = getLinkHubThemeColors(themeKey, profile?.themePrimaryColor, profile?.themeSecondaryColor);

    return {
      key: themeKey,
      preset,
      ...colors,
    };
  }, [profile?.theme, profile?.themePrimaryColor, profile?.themeSecondaryColor]);

  const activeThemeCategory = useMemo(() => {
    if (profile?.businessType === "restaurant") return "food" as LinkHubThemeCategory;
    return getSafeLinkHubThemeCategory(profile?.themeCategory);
  }, [profile?.businessType, profile?.themeCategory]);

  const availableThemeKeys = useMemo(() => {
    return LINK_HUB_THEME_CATEGORY_MAP[activeThemeCategory];
  }, [activeThemeCategory]);

  const catalogLabel = profile?.sectionLabels.menu;
  const reservationLabel = profile?.sectionLabels.reservation || "Reserva";
  const previewReservationEnabled = Boolean(profile?.reservation?.enabled);

  const resolvedCartaThemeId = useMemo(() => {
    const rubroHint = stripRubroEmojiPrefix(profile?.categoryLabel || "Restaurante / Cafeteria");
    return getSafeCartaThemeId(profile?.cartaThemeId || recommendCartaThemeIdByRubro(rubroHint));
  }, [profile?.cartaThemeId, profile?.categoryLabel]);

  const resolvedCartaCustomPrimary = useMemo(
    () => normalizeHexColor(profile?.cartaCustomPrimaryColor, CARTA_CUSTOM_DEFAULTS.primary),
    [profile?.cartaCustomPrimaryColor],
  );
  const resolvedCartaCustomSecondary = useMemo(
    () => normalizeHexColor(profile?.cartaCustomSecondaryColor, CARTA_CUSTOM_DEFAULTS.secondary),
    [profile?.cartaCustomSecondaryColor],
  );
  const resolvedCartaCustomAccent = useMemo(
    () => normalizeHexColor(profile?.cartaCustomAccentColor, CARTA_CUSTOM_DEFAULTS.accent),
    [profile?.cartaCustomAccentColor],
  );
  const resolvedCartaCustomStyle = useMemo(
    () => getSafeCartaCustomStyle(profile?.cartaCustomDesignStyle),
    [profile?.cartaCustomDesignStyle],
  );

  const activeCartaTheme = useMemo(
    () =>
      getCartaTheme(resolvedCartaThemeId, {
        primary: resolvedCartaCustomPrimary,
        secondary: resolvedCartaCustomSecondary,
        accent: resolvedCartaCustomAccent,
        style: resolvedCartaCustomStyle,
      }),
    [
      resolvedCartaCustomAccent,
      resolvedCartaCustomPrimary,
      resolvedCartaCustomSecondary,
      resolvedCartaCustomStyle,
      resolvedCartaThemeId,
    ],
  );
  const isRestaurantProfile = profile?.businessType === "restaurant";
  const selectedRestaurantRubroOption = useMemo(() => {
    const currentRubro = stripRubroEmojiPrefix(profile?.categoryLabel || DEFAULT_RESTAURANT_RUBRO);
    const currentKeyword = normalizeRubroKeyword(currentRubro);
    const matched = RESTAURANT_SUBCATEGORY_OPTIONS.find(
      (option) => normalizeRubroKeyword(option) === currentKeyword,
    );
    return matched || "__custom__";
  }, [profile?.categoryLabel]);
  const resolvedCartaBackgroundMode = useMemo(
    () => getSafeLinkHubCartaBackgroundMode(profile?.cartaBackgroundMode),
    [profile?.cartaBackgroundMode],
  );
  const useWhiteCartaBackground = resolvedCartaBackgroundMode === "white";
  const useThemeContrastPalette = useMemo(
    () => !useWhiteCartaBackground && isLightThemeSurface(activeCartaTheme.tokens.background),
    [activeCartaTheme.tokens.background, useWhiteCartaBackground],
  );

  const previewItems = useMemo(() => {
    if (!profile) return [];
    return profile.catalogItems.filter((item) => {
      const byCategory = previewCategoryId ? item.categoryId === previewCategoryId : true;
      const term = previewSearch.trim().toLowerCase();
      const categoryName =
        profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.toLowerCase() || "";
      const bySearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        categoryName.includes(term);
      return byCategory && bySearch;
    });
  }, [previewCategoryId, previewSearch, profile]);

  const filteredEditorItems = useMemo(() => {
    if (!profile) return [];
    const term = editorItemSearch.trim().toLowerCase();
    if (!term) return profile.catalogItems;
    return profile.catalogItems.filter((item) => {
      const categoryName =
        profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.toLowerCase() || "";
      return (
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.salesCopy || "").toLowerCase().includes(term) ||
        categoryName.includes(term) ||
        (item.price || "").toLowerCase().includes(term)
      );
    });
  }, [editorItemSearch, profile]);

  const previewMenuBorder = useMemo(() => activeCartaTheme.tokens.chipBorder, [activeCartaTheme.tokens.chipBorder]);
  const previewMenuGradientSoft = useMemo(
    () =>
      useWhiteCartaBackground
        ? "#ffffff"
        : activeCartaTheme.tokens.surface2,
    [activeCartaTheme.tokens.accent, activeCartaTheme.tokens.primary, activeCartaTheme.tokens.surface2, useWhiteCartaBackground],
  );
  const previewShellStyle = useMemo(
    () => ({
      borderColor: previewMenuBorder,
      background: useWhiteCartaBackground
        ? "#ffffff"
        : activeCartaTheme.tokens.background,
    }),
    [activeCartaTheme.tokens.background, previewMenuBorder, useWhiteCartaBackground],
  );
  const previewPanelStyle = useMemo(
    () => ({
      borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.14)" : activeCartaTheme.tokens.border,
      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.surface,
      boxShadow: activeCartaTheme.tokens.shadow,
    }),
    [activeCartaTheme.tokens.border, activeCartaTheme.tokens.shadow, activeCartaTheme.tokens.surface, useWhiteCartaBackground],
  );
  const previewHeaderStyle = useMemo(
    () => ({
      borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.1)" : activeCartaTheme.tokens.border,
      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.gradientHero,
    }),
    [activeCartaTheme.tokens.border, activeCartaTheme.tokens.gradientHero, useWhiteCartaBackground],
  );
  const previewChipBaseStyle = useMemo(
    () => ({
      borderColor: useWhiteCartaBackground ? previewMenuBorder : activeCartaTheme.tokens.chipBorder,
      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.chipBg,
      color: useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.chipText,
    }),
    [activeCartaTheme.tokens.chipBg, activeCartaTheme.tokens.chipBorder, activeCartaTheme.tokens.chipText, previewMenuBorder, useWhiteCartaBackground],
  );
  const previewChipActiveStyle = useMemo(
    () => ({
      borderColor: activeCartaTheme.tokens.chipBorder,
      background: activeCartaTheme.tokens.chipActiveBg,
      color: activeCartaTheme.tokens.chipActiveText,
      boxShadow: activeCartaTheme.tokens.shadow,
    }),
    [
      activeCartaTheme.tokens.chipActiveBg,
      activeCartaTheme.tokens.chipActiveText,
      activeCartaTheme.tokens.chipBorder,
      activeCartaTheme.tokens.shadow,
    ],
  );
  const previewTextBase = useMemo(
    () => (useWhiteCartaBackground || useThemeContrastPalette ? "#0f172a" : activeCartaTheme.tokens.text),
    [activeCartaTheme.tokens.text, useThemeContrastPalette, useWhiteCartaBackground],
  );
  const previewTextMuted = useMemo(
    () => (useWhiteCartaBackground || useThemeContrastPalette ? "#64748b" : activeCartaTheme.tokens.mutedText),
    [activeCartaTheme.tokens.mutedText, useThemeContrastPalette, useWhiteCartaBackground],
  );
  const previewNavText = useMemo(
    () => (useWhiteCartaBackground || useThemeContrastPalette ? "#64748b" : activeCartaTheme.tokens.navText),
    [activeCartaTheme.tokens.navText, useThemeContrastPalette, useWhiteCartaBackground],
  );
  const previewPlaceholderText = useMemo(
    () => (useWhiteCartaBackground || useThemeContrastPalette ? "#94a3b8" : activeCartaTheme.tokens.placeholder),
    [activeCartaTheme.tokens.placeholder, useThemeContrastPalette, useWhiteCartaBackground],
  );
  const previewInputText = useMemo(
    () => (useWhiteCartaBackground || useThemeContrastPalette ? "#0f172a" : activeCartaTheme.tokens.inputText),
    [activeCartaTheme.tokens.inputText, useThemeContrastPalette, useWhiteCartaBackground],
  );
  const previewSearchStyle = useMemo(
    () => ({
      borderColor: activeCartaTheme.tokens.inputBorder,
      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.inputBg,
      color: previewInputText,
    }),
    [activeCartaTheme.tokens.inputBg, activeCartaTheme.tokens.inputBorder, previewInputText, useWhiteCartaBackground],
  );
  const previewBottomNavStyle = useMemo(
    () => ({
      borderColor: useWhiteCartaBackground ? previewMenuBorder : activeCartaTheme.tokens.border,
      background: useWhiteCartaBackground ? previewMenuGradientSoft : activeCartaTheme.tokens.navBg,
    }),
    [activeCartaTheme.tokens.border, activeCartaTheme.tokens.navBg, previewMenuBorder, previewMenuGradientSoft, useWhiteCartaBackground],
  );
  const previewItemCardStyle = useMemo(
    () => ({
      borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.12)" : activeCartaTheme.tokens.border,
      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.surface2,
      boxShadow: activeCartaTheme.tokens.shadow,
    }),
    [activeCartaTheme.tokens.border, activeCartaTheme.tokens.shadow, activeCartaTheme.tokens.surface2, useWhiteCartaBackground],
  );
  const previewCoverUrl = useMemo(
    () => profile?.coverImageUrls?.[0] || profile?.coverImageUrl || "",
    [profile?.coverImageUrl, profile?.coverImageUrls],
  );
  const previewCategoryTabs = useMemo(
    () => (profile?.catalogCategories || []).slice(0, 6),
    [profile?.catalogCategories],
  );
  const previewVisibleItems = useMemo(() => previewItems.slice(0, 4), [previewItems]);
  const previewNormalizedLocation = useMemo(
    () =>
      normalizeGoogleMapsLocationInput(
        profile?.location.mapEmbedUrl || "",
        profile?.location.mapsUrl || "",
        profile?.location.address || "",
      ),
    [profile?.location.address, profile?.location.mapEmbedUrl, profile?.location.mapsUrl],
  );
  const previewContactPhone = useMemo(() => normalizePhone(profile?.phoneNumber || ""), [profile?.phoneNumber]);
  const previewContactWhatsappDigits = useMemo(
    () => normalizeDigits(profile?.whatsappNumber || profile?.phoneNumber || ""),
    [profile?.phoneNumber, profile?.whatsappNumber],
  );
  const publishChecklist = useMemo<Array<{ id: string; label: string; completed: boolean; section: EditorSectionKey }>>(() => {
    if (!profile) return [];
    const validItems = profile.catalogItems.filter((item) => {
      return item.title.trim().length > 0 && parseEditorPrice(item.price) !== null;
    });
    const normalizedLocation = normalizeGoogleMapsLocationInput(
      profile.location.mapEmbedUrl || "",
      profile.location.mapsUrl || "",
      profile.location.address || "",
    );
    const hasLocationCore = Boolean(
      profile.location.address.trim() &&
        (normalizedLocation.mapEmbedUrl || normalizedLocation.mapsUrl),
    );
    const hasCover = Boolean((profile.coverImageUrls?.[0] || profile.coverImageUrl || "").trim());
    const hasContact = Boolean(normalizeDigits(profile.whatsappNumber || profile.phoneNumber));
    return [
      {
        id: "identity",
        label: "Identidad completa",
        completed: profile.displayName.trim().length >= 2 && sanitizeSlug(profile.slug).length >= 3,
        section: "identity",
      },
      {
        id: "contact",
        label: "Telefono o WhatsApp",
        completed: hasContact,
        section: "bioLinks",
      },
      {
        id: "cover",
        label: "Portada o foto de perfil",
        completed: hasCover || Boolean(profile.avatarUrl.trim()),
        section: "identity",
      },
      {
        id: "catalog",
        label: "Minimo 3 items con precio",
        completed: validItems.length >= 3,
        section: "catalog",
      },
      {
        id: "location",
        label: "Direccion + mapa",
        completed: hasLocationCore,
        section: "location",
      },
    ];
  }, [profile]);
  const checklistCompleted = publishChecklist.filter((item) => item.completed).length;
  const checklistPercent = publishChecklist.length
    ? Math.round((checklistCompleted / publishChecklist.length) * 100)
    : 0;

  useEffect(() => {
    if (previewReservationEnabled) return;
    if (previewTab === "reservation") {
      setPreviewTab("catalog");
    }
  }, [previewReservationEnabled, previewTab]);

  useEffect(() => {
    let active = true;

    async function loadMetricsSummary() {
      if (!user?.uid || !profile?.slug) return;
      setMetricsLoading(true);
      setMetricsError("");
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          if (active) {
            setMetricsSummary(null);
            setMetricsError("Inicia sesion para ver metricas.");
          }
          return;
        }
        const idToken = await currentUser.getIdToken();
        const response = await fetch(
          `/api/linkhub/metrics/summary?profileId=${encodeURIComponent(activeProfileId || currentUser.uid)}&slug=${encodeURIComponent(profile.slug)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          summary?: LinkHubMetricsSummary;
        };
        if (!response.ok) {
          throw new Error(payload?.error || "No se pudieron cargar metricas.");
        }
        if (active) {
          setMetricsSummary(payload.summary || null);
        }
      } catch (error) {
        console.error("[LinkHub] Metrics summary error:", error);
        if (active) {
          setMetricsSummary(null);
          setMetricsError("No se pudieron cargar metricas por ahora.");
        }
      } finally {
        if (active) {
          setMetricsLoading(false);
        }
      }
    }

    loadMetricsSummary();
    return () => {
      active = false;
    };
  }, [activeProfileId, profile?.slug, user?.uid]);

  useEffect(() => {
    if (!profile) return;
    const validCategoryIds = new Set(profile.catalogCategories.map((category) => category.id));
    if (bulkUploadCategoryId !== "all" && !validCategoryIds.has(bulkUploadCategoryId)) {
      setBulkUploadCategoryId("all");
    }
    if (priceAdjustCategoryId !== "all" && !validCategoryIds.has(priceAdjustCategoryId)) {
      setPriceAdjustCategoryId("all");
    }
  }, [bulkUploadCategoryId, priceAdjustCategoryId, profile]);

  function patchProfile<K extends keyof LinkHubProfile>(field: K, value: LinkHubProfile[K]) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }

  function ensureCanCustomizeCartaRgb(): boolean {
    if (canCustomizeColors) return true;
    setMessage({
      type: "error",
      text: "El modo RGB personalizable se desbloquea en BUSINESS o PRO.",
    });
    return false;
  }

  function patchCartaCustomColor(
    field: "cartaCustomPrimaryColor" | "cartaCustomSecondaryColor" | "cartaCustomAccentColor",
    value: string,
    fallback: string,
  ) {
    if (!ensureCanCustomizeCartaRgb()) return;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cartaThemeId: "rgb_creator",
        [field]: normalizeHexColor(value, fallback),
      };
    });
  }

  function patchCartaCustomStyle(style: CartaCustomStyle) {
    if (!ensureCanCustomizeCartaRgb()) return;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cartaThemeId: "rgb_creator",
        cartaCustomDesignStyle: getSafeCartaCustomStyle(style),
      };
    });
  }

  function getEditorSectionElement(section: EditorSectionKey) {
    const checklistTarget =
      typeof window !== "undefined" && window.innerWidth < 768
        ? publishChecklistEditorSectionRef.current || publishChecklistSectionRef.current
        : publishChecklistSectionRef.current;
    const refs = {
      checklist: checklistTarget,
      identity: identitySectionRef.current,
      bioLinks: bioLinksSectionRef.current,
      catalog: catalogSectionRef.current,
      pro: proSectionRef.current,
      location: locationSectionRef.current,
      reservation: reservationSectionRef.current,
      themes: themesSectionRef.current,
    };
    return refs[section];
  }

  function scrollEditorSectionToStart(section: EditorSectionKey) {
    const targetSection = getEditorSectionElement(section);
    if (!targetSection || typeof window === "undefined") return;

    if (window.innerWidth < 768) {
      const dockBottom = mobileTopDockRef.current?.getBoundingClientRect().bottom ?? 0;
      const targetTop = targetSection.getBoundingClientRect().top;
      const absoluteTop = window.scrollY + targetTop - (dockBottom + 12);
      window.scrollTo({ top: Math.max(0, absoluteTop), behavior: "smooth" });
      return;
    }

    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToEditorSection(section: EditorSectionKey) {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileEditorSection(section);
      setMobileEditMenuOpen(true);
      setMobileEditMenuMode("editor");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollEditorSectionToStart(section);
        });
      });
    } else {
      scrollEditorSectionToStart(section);
      setMobileEditMenuOpen(false);
    }
  }

  function scrollToPublishChecklist() {
    scrollToEditorSection("checklist");
  }

  const mobileSectionLabelMap: Record<EditorSectionKey, string> = {
    checklist: "Publica en 10 minutos (tutorial) 📘",
    identity: "Identidad de negocio",
    bioLinks: "BIO y enlaces",
    catalog: "Carta digital",
    pro: "Funciones PRO",
    location: "Ubicacion",
    reservation: "Reserva",
    themes: "Temas",
  };

  function openMobileSectionMenu() {
    setMobileEditMenuOpen(true);
    setMobileEditMenuMode("sections");
  }

  function handleMobilePreviewTapCloseMenu() {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    if (!mobileEditMenuOpen) return;
    if (mobileEditMenuMode !== "sections") return;
    setMobileEditMenuOpen(false);
  }

  function renderMobileSectionBack(section: EditorSectionKey) {
    if (mobileEditorSection !== section) return null;
    return (
      <div className="mb-4 flex items-center justify-between gap-2 md:hidden">
        <button
          type="button"
          onClick={openMobileSectionMenu}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 text-[10px] font-black uppercase tracking-[0.11em] text-zinc-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Volver al submenu
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
          {mobileSectionLabelMap[section]}
        </span>
      </div>
    );
  }

  const isMobileEditorOverlayActive =
    mobileEditMenuOpen && mobileEditMenuMode === "editor";

  function applyTheme(theme: LinkHubTheme) {
    const preset = LINK_HUB_THEME_STYLES[theme];
    const mappedCartaThemeId = recommendCartaThemeIdByLinkTheme(theme);
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        theme,
        cartaThemeId: mappedCartaThemeId,
        themePrimaryColor: preset.primary,
        themeSecondaryColor: preset.secondary,
      };
    });
  }

  function changeThemeCategory(nextCategory: LinkHubThemeCategory) {
    setProfile((prev) => {
      if (!prev) return prev;
      const safeCategory =
        prev.businessType === "restaurant" ? "food" : getSafeLinkHubThemeCategory(nextCategory);
      const allowedThemes = LINK_HUB_THEME_CATEGORY_MAP[safeCategory];
      const nextTheme = allowedThemes.includes(prev.theme) ? prev.theme : allowedThemes[0];
      const nextPreset = LINK_HUB_THEME_STYLES[nextTheme];
      if (nextTheme === prev.theme) {
        return {
          ...prev,
          themeCategory: safeCategory,
        };
      }
      return {
        ...prev,
        themeCategory: safeCategory,
        theme: nextTheme,
        themePrimaryColor: nextPreset.primary,
        themeSecondaryColor: nextPreset.secondary,
      };
    });
  }

  function patchLocation<K extends keyof LinkHubProfile["location"]>(
    field: K,
    value: LinkHubProfile["location"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      };
    });
  }

  function patchSectionLabel<K extends keyof LinkHubProfile["sectionLabels"]>(
    field: K,
    value: LinkHubProfile["sectionLabels"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sectionLabels: {
          ...prev.sectionLabels,
          [field]: value,
        },
      };
    });
  }

  function patchPricing<K extends keyof LinkHubProfile["pricing"]>(
    field: K,
    value: LinkHubProfile["pricing"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: value,
        },
      };
    });
  }

  function patchPlan(planId: string, patch: Partial<LinkHubPricingPlan>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          plans: prev.pricing.plans.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)),
        },
      };
    });
  }

  function changeBusinessType(_nextType: LinkHubBusinessType) {
    setProfile((prev) => {
      if (!prev) return prev;
      const safeType: LinkHubBusinessType = "restaurant";
      const nextThemeCategory: LinkHubThemeCategory = "food";
      const allowedThemes = LINK_HUB_THEME_CATEGORY_MAP[nextThemeCategory];
      const nextTheme = allowedThemes.includes(prev.theme) ? prev.theme : allowedThemes[0];
      const nextPreset = LINK_HUB_THEME_STYLES[nextTheme];
      const recommendedCartaThemeId = recommendCartaThemeIdByRubro("Restaurante / Cafeteria");
      const baseNext = {
        ...prev,
        businessType: safeType,
        categoryLabel: formatRubroLabelWithEmoji(prev.categoryLabel || DEFAULT_RESTAURANT_RUBRO),
        cartaThemeId: prev.cartaThemeId || recommendedCartaThemeId,
        themeCategory: nextThemeCategory,
        sectionLabels: {
          ...prev.sectionLabels,
          menu: "Carta",
          catalog: prev.sectionLabels.catalog,
        },
      };
      if (nextTheme === prev.theme) {
        return baseNext;
      }
      return {
        ...baseNext,
        theme: nextTheme,
        themePrimaryColor: nextPreset.primary,
        themeSecondaryColor: nextPreset.secondary,
      };
    });
  }

  function addCategory() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES) return prev;
      const emoji = prev.businessType === "restaurant" ? "🍽️" : "🛍️";
      return {
        ...prev,
        catalogCategories: [...prev.catalogCategories, createLinkHubCatalogCategory("", emoji)],
      };
    });
  }

  function patchCategory(
    categoryId: string,
    patch: Partial<LinkHubProfile["catalogCategories"][number]>,
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextCategories = prev.catalogCategories.map((category) =>
        category.id === categoryId ? { ...category, ...patch } : category,
      );
      const shouldResyncItems = "emoji" in patch || "name" in patch;
      return {
        ...prev,
        catalogCategories: nextCategories,
        catalogItems: shouldResyncItems
          ? prev.catalogItems.map((item) =>
              item.categoryId === categoryId
                ? applyCatalogItemVisualRules(item, nextCategories, prev.businessType)
                : item,
            )
          : prev.catalogItems,
      };
    });
  }

  function removeCategory(categoryId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogCategories.length <= 1) return prev;
      const categories = prev.catalogCategories.filter((category) => category.id !== categoryId);
      const fallbackId = categories[0]?.id || "";
      return {
        ...prev,
        catalogCategories: categories,
        catalogItems: prev.catalogItems.map((item) =>
          item.categoryId === categoryId ? { ...item, categoryId: fallbackId } : item,
        ),
      };
    });
  }

  function resolveValidCategoryId(
    categories: LinkHubProfile["catalogCategories"],
    requestedCategoryId: string,
  ): string {
    if (categories.some((category) => category.id === requestedCategoryId)) {
      return requestedCategoryId;
    }
    return categories[0]?.id || "";
  }

  function handleRestaurantRubroChange(nextRawValue: string) {
    const formattedLabel = formatRubroLabelWithEmoji(nextRawValue || DEFAULT_RESTAURANT_RUBRO);
    const cleanLabel = stripRubroEmojiPrefix(formattedLabel);
    const rubroEmoji = inferRubroEmoji(cleanLabel);
    let nextPrimaryCategoryId = "";

    setProfile((prev) => {
      if (!prev) return prev;
      const ensuredCategories =
        prev.catalogCategories.length > 0
          ? prev.catalogCategories
          : [createLinkHubCatalogCategory("Especialidades", rubroEmoji)];
      const nextCategories = ensuredCategories.map((category, index) =>
        index === 0
          ? {
              ...category,
              name: cleanLabel || category.name || DEFAULT_RESTAURANT_RUBRO,
              emoji: rubroEmoji,
            }
          : category,
      );
      const categoryId = nextCategories[0]?.id || "";
      nextPrimaryCategoryId = categoryId;
      const starterItems = buildRestaurantStarterItems(cleanLabel, nextCategories).map((item) =>
        applyCatalogItemVisualRules(
          { ...item, categoryId },
          nextCategories,
          "restaurant",
        ),
      );

      return {
        ...prev,
        businessType: "restaurant",
        categoryLabel: formattedLabel,
        cartaThemeId: recommendCartaThemeIdByRubro(cleanLabel),
        catalogCategories: nextCategories,
        catalogItems: starterItems,
      };
    });

    if (nextPrimaryCategoryId) {
      setPreviewCategoryId(nextPrimaryCategoryId);
    }
    setMessage({
      type: "success",
      text: `Rubro actualizado a ${formattedLabel}. Se cargaron 5 platos base para ese rubro.`,
    });
  }

  function applyCatalogItemVisualRules(
    item: LinkHubCatalogItem,
    categories: LinkHubProfile["catalogCategories"],
    businessType: LinkHubBusinessType,
  ): LinkHubCatalogItem {
    const categoryId = resolveValidCategoryId(categories, item.categoryId);
    return {
      ...item,
      categoryId,
      emoji: resolveCatalogItemEmojiByCategory(categoryId, categories, businessType),
      badge: "",
    };
  }

  function getNextDescriptionSeed(extra = 0): number {
    const randomBump = Math.floor(Math.random() * 17) + 1;
    descriptionSeedRef.current += randomBump + extra;
    return descriptionSeedRef.current;
  }

  function addCatalogItem() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS) return prev;
      const baseCategoryId = prev.catalogCategories[0]?.id || "";
      const nextItem = applyCatalogItemVisualRules(
        createLinkHubCatalogItem(baseCategoryId),
        prev.catalogCategories,
        prev.businessType,
      );
      return {
        ...prev,
        catalogItems: [...prev.catalogItems, nextItem],
      };
    });
  }

  function patchCatalogItem(itemId: string, patch: Partial<LinkHubCatalogItem>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => {
          if (item.id !== itemId) return item;
          const next = {
            ...item,
            ...patch,
          };
          return applyCatalogItemVisualRules(next, prev.catalogCategories, prev.businessType);
        }),
      };
    });
  }

  function openProTrialModal(featureLabel: string) {
    setProTrialFeatureLabel(featureLabel);
    setProTrialError("");
    setIsProTrialModalOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        proTrialBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function showProFeatureLocked(featureLabel: string) {
    openProTrialModal(featureLabel);
    setMessage({
      type: "error",
      text: `${featureLabel} está bloqueado. Activa plan PRO para usar esta función.`,
    });
  }

  function renderInlineProTrialButton(featureLabel: string) {
    if (isProPlan) return null;
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={() => openProTrialModal(featureLabel)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-500/15 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-100"
        >
          <Sparkles className="h-4 w-4" />
          Activar prueba PRO 7 dias
        </button>
      </div>
    );
  }

  async function activateProTrial() {
    if (isActivatingProTrial) return;
    setIsActivatingProTrial(true);
    setProTrialError("");
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setProTrialError("Debes iniciar sesion para activar la prueba PRO.");
        return;
      }
      let idToken = await currentUser.getIdToken(true);
      const executeActivation = async (token: string) =>
        fetch("/api/subscription/pro-trial", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIdHint: currentUser.uid,
          }),
        });

      let response = await executeActivation(idToken);
      if (response.status === 503) {
        idToken = await currentUser.getIdToken(true);
        response = await executeActivation(idToken);
      }
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo activar la prueba PRO.");
      }

      await fetch("/api/subscription/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).catch(() => undefined);

      await reloadSubscription();
      setIsProTrialModalOpen(false);
      setMobileEditMenuOpen(false);
      setMobileEditMenuMode("sections");
      scrollEditorSectionToStart("pro");
      setMessage({
        type: "success",
        text: payload?.message || "Prueba PRO activada por 7 dias. Ya puedes usar funciones PRO.",
      });
    } catch (error) {
      const message = String((error as { message?: string })?.message || "");
      setProTrialError(message || "No se pudo activar la prueba PRO.");
    } finally {
      setIsActivatingProTrial(false);
    }
  }

  function patchProTestimonial(index: number, patch: Partial<LinkHubProTestimonial>) {
    if (!isProPlan) {
      showProFeatureLocked("Testimonios PRO");
      return;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      if (index < 0 || index >= prev.proTestimonials.length) return prev;
      const next = [...prev.proTestimonials];
      next[index] = { ...next[index], ...patch };
      return { ...prev, proTestimonials: next };
    });
  }

  function patchProDeliveryMode(mode: keyof LinkHubProfile["proDeliveryModes"], enabled: boolean) {
    if (!isProPlan) {
      showProFeatureLocked("Opciones de despacho PRO");
      return;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proDeliveryModes: {
          ...prev.proDeliveryModes,
          [mode]: enabled,
        },
      };
    });
  }

  function appendCatalogGalleryImage(itemId: string, imageUrl: string) {
    const normalizedUrl = String(imageUrl || "").trim();
    if (!normalizedUrl) return;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => {
          if (item.id !== itemId) return item;
          const nextGallery = mergeGalleryImages([...(item.galleryImageUrls || []), normalizedUrl]);
          return {
            ...item,
            imageUrl: item.imageUrl || normalizedUrl,
            galleryImageUrls: nextGallery,
          };
        }),
      };
    });
  }

  function removeCatalogGalleryImage(itemId: string, imageUrl: string) {
    if (!isProPlan) {
      showProFeatureLocked("Galería de fotos PRO");
      return;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => {
          if (item.id !== itemId) return item;
          const nextGallery = mergeGalleryImages((item.galleryImageUrls || []).filter((image) => image !== imageUrl));
          return {
            ...item,
            imageUrl: item.imageUrl === imageUrl ? nextGallery[0] || "" : item.imageUrl,
            galleryImageUrls: nextGallery,
          };
        }),
      };
    });
  }

  function moveCatalogGalleryImage(itemId: string, imageUrl: string, direction: "left" | "right") {
    if (!isProPlan) {
      showProFeatureLocked("Galería de fotos PRO");
      return;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => {
          if (item.id !== itemId) return item;
          const gallery = mergeGalleryImages(item.galleryImageUrls || []);
          const index = gallery.indexOf(imageUrl);
          if (index < 0) return item;
          const target = direction === "left" ? index - 1 : index + 1;
          if (target < 0 || target >= gallery.length) return item;
          const reordered = [...gallery];
          const [movedImage] = reordered.splice(index, 1);
          reordered.splice(target, 0, movedImage);
          return {
            ...item,
            galleryImageUrls: reordered,
            imageUrl: item.imageUrl || reordered[0] || "",
          };
        }),
      };
    });
  }

  function patchReservation<K extends keyof LinkHubProfile["reservation"]>(
    field: K,
    value: LinkHubProfile["reservation"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reservation: {
          ...prev.reservation,
          [field]: value,
        },
      };
    });
  }

  function patchAutomation<K extends keyof LinkHubProfile["automation"]>(
    field: K,
    value: LinkHubProfile["automation"][K],
  ) {
    if (!isProPlan) {
      showProFeatureLocked("Automatizaciones PRO");
      return;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        automation: {
          ...prev.automation,
          [field]: value,
        },
      };
    });
  }

  async function generateWeeklyPromotionsWithAI() {
    if (!isProPlan) {
      showProFeatureLocked("IA de promociones semanales");
      return;
    }
    if (!profile) return;

    setIsGeneratingWeeklyPromos(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Inicia sesion para usar IA semanal.");
      const idToken = await currentUser.getIdToken();

      const categoriesById = new Map(
        profile.catalogCategories.map((category) => [category.id, category.name.trim() || "Carta"]),
      );
      const response = await fetch("/api/ai/weekly-promos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objective: profile.automation.weeklyPromoObjective,
          categories: profile.catalogCategories.map((category) => category.name.trim()).filter(Boolean),
          items: profile.catalogItems.map((item) => ({
            title: item.title,
            price: Number(item.price || 0),
            categoryName: categoriesById.get(item.categoryId) || "Carta",
          })),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        promotions?: WeeklyPromoSuggestion[];
      };
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo generar plan semanal.");
      }

      const promotions = Array.isArray(payload.promotions) ? payload.promotions : [];
      const weeklyPromoPlan = promotions
        .map((entry) =>
          `${entry.day}: ${entry.startTime}-${entry.endTime} | ${entry.discountPercent}% | ${entry.headline}`,
        )
        .slice(0, 7);

      const firstPromo = promotions[0];
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          automation: {
            ...prev.automation,
            weeklyPromoPlan,
            weeklyPromoUpdatedAt: Date.now(),
            promoEnabled: weeklyPromoPlan.length > 0 ? true : prev.automation.promoEnabled,
            promoStart: firstPromo?.startTime || prev.automation.promoStart,
            promoEnd: firstPromo?.endTime || prev.automation.promoEnd,
            promoDiscountPercent:
              typeof firstPromo?.discountPercent === "number"
                ? Math.max(0, Math.min(90, Math.round(firstPromo.discountPercent)))
                : prev.automation.promoDiscountPercent,
            promoLabel: firstPromo?.headline || prev.automation.promoLabel,
          },
        };
      });

      setMessage({
        type: "success",
        text: "Plan semanal IA generado. Revisa y publica para aplicarlo.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: String((error as { message?: string })?.message || "No se pudo generar IA semanal."),
      });
    } finally {
      setIsGeneratingWeeklyPromos(false);
    }
  }

  async function suggestCatalogItemSalesCopy(itemId: string) {
    if (!isProPlan) {
      showProFeatureLocked("Copy de venta PRO");
      return;
    }
    if (!profile) return;
    const itemIndex = profile.catalogItems.findIndex((entry) => entry.id === itemId);
    if (itemIndex < 0) return;

    const item = profile.catalogItems[itemIndex];
    const categoryName =
      profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.trim() || "";
    const seed = getNextDescriptionSeed(itemIndex + 51);
    const generatedCopy = buildCatalogDescriptionSuggestion(item, profile.businessType, categoryName, seed);
    if (!generatedCopy) return;

    patchCatalogItem(itemId, { salesCopy: generatedCopy });
    setMessage({ type: "success", text: "Copy de venta PRO actualizado." });
  }

  function suggestSalesCopyForAllItems() {
    if (!isProPlan) {
      showProFeatureLocked("Copys de venta PRO");
      return;
    }
    if (!profile) return;
    let updatedCount = 0;
    const nextItems = profile.catalogItems.map((item, index) => {
      const categoryName =
        profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.trim() || "";
      const generatedCopy = buildCatalogDescriptionSuggestion(
        item,
        profile.businessType,
        categoryName,
        getNextDescriptionSeed(index + 83),
      );
      if (!generatedCopy || generatedCopy === item.salesCopy) return item;
      updatedCount += 1;
      return {
        ...item,
        salesCopy: generatedCopy,
      };
    });
    if (updatedCount <= 0) {
      setMessage({ type: "error", text: "Completa titulo o imagen para generar copys de venta." });
      return;
    }
    setProfile((prev) => (prev ? { ...prev, catalogItems: nextItems } : prev));
    setMessage({ type: "success", text: `Copys PRO generados para ${updatedCount} items.` });
  }

  function suggestCatalogItemDescription(itemId: string) {
    if (!aiEnabled) {
      setMessage({
        type: "error",
        text: "Esta función IA está disponible solo en el plan PRO.",
      });
      return;
    }
    if (!profile) return;
    const itemIndex = profile.catalogItems.findIndex((entry) => entry.id === itemId);
    if (itemIndex < 0) return;

    const item = profile.catalogItems[itemIndex];
    const categoryName =
      profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.trim() || "";

    let nextDescription = "";
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const seed = getNextDescriptionSeed(itemIndex + attempt);
      const candidate = buildCatalogDescriptionSuggestion(item, profile.businessType, categoryName, seed);
      if (candidate && candidate !== item.description && candidate !== nextDescription) {
        nextDescription = candidate;
        break;
      }
    }

    if (!nextDescription) {
      setMessage({
        type: "error",
        text: "Completa titulo o imagen para generar una descripcion distinta.",
      });
      return;
    }

    setProfile({
      ...profile,
      catalogItems: profile.catalogItems.map((entry) =>
        entry.id === itemId ? { ...entry, description: nextDescription } : entry,
      ),
    });
    setMessage({ type: "success", text: "Descripcion sugerida lista para este item." });
  }

  function suggestDescriptionsForAllItems() {
    if (!aiEnabled) {
      setMessage({
        type: "error",
        text: "La generación masiva con IA está disponible solo en plan PRO.",
      });
      return;
    }
    if (!profile) return;
    let updatedCount = 0;
    const nextItems = profile.catalogItems.map((item, index) => {
      if (!item.title.trim() && !item.imageUrl.trim()) return item;
      const categoryName =
        profile.catalogCategories.find((category) => category.id === item.categoryId)?.name.trim() || "";
      const seed = getNextDescriptionSeed(index);
      const description = buildCatalogDescriptionSuggestion(item, profile.businessType, categoryName, seed);
      if (!description || description === item.description) return item;
      updatedCount += 1;
      return {
        ...item,
        description,
      };
    });

    if (updatedCount > 0) {
      setProfile({
        ...profile,
        catalogItems: nextItems,
      });
    }

    if (updatedCount > 0) {
      setMessage({ type: "success", text: `Se generaron ${updatedCount} descripciones nuevas.` });
    } else {
      setMessage({
        type: "error",
        text: "Agrega titulo o imagen en tus items para poder sugerir descripciones.",
      });
    }
  }

  function removeCatalogItem(itemId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextItems = prev.catalogItems.filter((item) => item.id !== itemId);
      const fallbackItem = applyCatalogItemVisualRules(
        createLinkHubCatalogItem(prev.catalogCategories[0]?.id || ""),
        prev.catalogCategories,
        prev.businessType,
      );
      return {
        ...prev,
        catalogItems: nextItems.length > 0 ? nextItems : [fallbackItem],
      };
    });
  }

  function createCatalogItemBelow(itemId: string) {
    if (!profile) return;
    if (profile.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS) {
      setMessage({
        type: "error",
        text: `Limite alcanzado. Solo puedes tener ${MAX_LINK_HUB_CATALOG_ITEMS} items.`,
      });
      return;
    }
    let createdItemId = "";
    setProfile((prev) => {
      if (!prev) return prev;
      const source = prev.catalogItems.find((item) => item.id === itemId);
      const targetCategoryId = resolveValidCategoryId(
        prev.catalogCategories,
        source?.categoryId || prev.catalogCategories[0]?.id || "",
      );
      const created = applyCatalogItemVisualRules(
        createLinkHubCatalogItem(targetCategoryId),
        prev.catalogCategories,
        prev.businessType,
      );
      createdItemId = created.id;
      const index = prev.catalogItems.findIndex((item) => item.id === itemId);
      if (index < 0) {
        return {
          ...prev,
          catalogItems: [...prev.catalogItems, created],
        };
      }
      const nextItems = [...prev.catalogItems];
      nextItems.splice(index + 1, 0, created);
      return {
        ...prev,
        catalogItems: nextItems,
      };
    });
    if (createdItemId) {
      setEditorItemSearch("");
      setPendingCatalogEditorItemId(createdItemId);
      setMessage({
        type: "success",
        text: "Nuevo item creado debajo. Ya puedes editarlo.",
      });
    }
  }

  function moveCatalogItem(itemId: string, direction: "up" | "down") {
    setProfile((prev) => {
      if (!prev) return prev;
      const index = prev.catalogItems.findIndex((item) => item.id === itemId);
      if (index < 0) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.catalogItems.length) return prev;

      const reordered = [...prev.catalogItems];
      const [item] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, item);
      return {
        ...prev,
        catalogItems: reordered,
      };
    });
  }

  function duplicateCategoryWithItems(categoryId: string) {
    if (!profile) return;
    if (profile.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES) {
      setMessage({
        type: "error",
        text: `Limite alcanzado. Solo puedes tener ${MAX_LINK_HUB_CATALOG_CATEGORIES} categorias.`,
      });
      return;
    }
    const sourceCategory = profile.catalogCategories.find((category) => category.id === categoryId);
    if (!sourceCategory) return;

    setProfile((prev) => {
      if (!prev) return prev;
      const source = prev.catalogCategories.find((category) => category.id === categoryId);
      if (!source) return prev;
      const nextCategoryId = createClientUuid();
      const clonedCategory = {
        ...source,
        id: nextCategoryId,
        name: source.name ? `${source.name} copia` : "Categoria copia",
      };
      const sourceItems = prev.catalogItems.filter((item) => item.categoryId === source.id);
      const remainingSlots = Math.max(0, MAX_LINK_HUB_CATALOG_ITEMS - prev.catalogItems.length);
      const clonedItems = sourceItems.slice(0, remainingSlots).map((item) => ({
        ...item,
        id: createClientUuid(),
        categoryId: nextCategoryId,
        title: item.title ? `${item.title} copia` : "Item copia",
      }));
      const normalizedClonedItems = clonedItems.map((item) =>
        applyCatalogItemVisualRules(
          item,
          [...prev.catalogCategories, clonedCategory],
          prev.businessType,
        ),
      );
      return {
        ...prev,
        catalogCategories: [...prev.catalogCategories, clonedCategory],
        catalogItems: [...prev.catalogItems, ...normalizedClonedItems],
      };
    });

    setMessage({
      type: "success",
      text: `Categoria duplicada con items base desde ${sourceCategory.name || "categoria"} .`,
    });
  }

  function applyCatalogPriceAdjustment() {
    if (!profile) return;
    if (!isProPlan) {
      showProFeatureLocked("Ajuste masivo de precios PRO");
      return;
    }
    const normalizedPercent = String(priceAdjustPercent || "")
      .trim()
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");
    const percentage = Number(normalizedPercent);
    if (!Number.isFinite(percentage) || percentage === 0) {
      setMessage({ type: "error", text: "Ingresa un porcentaje valido. Ejemplo: 10 o -5." });
      return;
    }

    const validCategoryIds = new Set(profile.catalogCategories.map((category) => category.id));
    const targetCategory =
      priceAdjustCategoryId !== "all" && validCategoryIds.has(priceAdjustCategoryId)
        ? priceAdjustCategoryId
        : "all";
    let touched = 0;

    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => {
          if (targetCategory !== "all" && item.categoryId !== targetCategory) {
            return item;
          }
          const currentPrice = parseEditorPrice(item.price);
          if (currentPrice === null) return item;
          touched += 1;
          const adjusted = Math.max(0, currentPrice * (1 + percentage / 100));
          return {
            ...item,
            price: formatEditorPrice(adjusted),
          };
        }),
      };
    });

    if (touched <= 0) {
      setMessage({ type: "error", text: "No hay precios validos para ajustar en ese alcance." });
      return;
    }
    const scopeLabel =
      targetCategory === "all"
        ? "toda la carta"
        : profile.catalogCategories.find((category) => category.id === targetCategory)?.name || "categoria";
    setMessage({
      type: "success",
      text: `Precios ajustados (${percentage > 0 ? "+" : ""}${percentage}%) en ${scopeLabel}.`,
    });
  }

  function patchLink(linkId: string, patch: Partial<LinkHubLink>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        links: prev.links.map((link) => (link.id === linkId ? { ...link, ...patch } : link)),
      };
    });
  }

  function addLink() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.links.length >= MAX_LINK_HUB_LINKS) {
        return prev;
      }
      return { ...prev, links: [...prev.links, createEmptyLink()] };
    });
  }

  function removeLink(linkId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextLinks = prev.links.filter((link) => link.id !== linkId);
      return { ...prev, links: nextLinks.length > 0 ? nextLinks : [createEmptyLink()] };
    });
  }

  function removeCoverImageAt(indexToRemove: number) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextCovers = (prev.coverImageUrls || []).filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        coverImageUrls: nextCovers,
        coverImageUrl: nextCovers[0] || "",
      };
    });
  }

  function clearCoverImages() {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        coverImageUrls: [],
        coverImageUrl: "",
      };
    });
  }

  function moveLink(linkId: string, direction: "up" | "down") {
    setProfile((prev) => {
      if (!prev) return prev;
      const index = prev.links.findIndex((item) => item.id === linkId);
      if (index < 0) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.links.length) return prev;

      const reordered = [...prev.links];
      const [item] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, item);
      return { ...prev, links: reordered };
    });
  }

  async function copyPublicUrl() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setMessage({ type: "success", text: "URL copiada al portapapeles." });
    } catch {
      setMessage({ type: "error", text: "No se pudo copiar la URL." });
    }
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Solo se permiten archivos de imagen para el avatar." });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen es muy pesada. Usa una menor a 8MB." });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const optimized = await optimizeImageFile(file, resolveImagePreset("avatar"));
      patchProfile("avatarUrl", optimized);
      setMessage({ type: "success", text: "Avatar cargado correctamente." });
    } catch (error) {
      console.error("[LinkHub] Avatar upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen seleccionada." });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const currentCount = profile?.coverImageUrls?.length || 0;
    if (currentCount >= MAX_LINK_HUB_COVER_IMAGES) {
      setMessage({ type: "error", text: `Solo puedes tener hasta ${MAX_LINK_HUB_COVER_IMAGES} portadas.` });
      return;
    }

    const remainingSlots = MAX_LINK_HUB_COVER_IMAGES - currentCount;
    const selected = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setMessage({ type: "error", text: `Solo se cargaron ${remainingSlots} imagen(es). Limite: ${MAX_LINK_HUB_COVER_IMAGES}.` });
    }

    const validFiles = selected.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setMessage({ type: "error", text: "Selecciona archivos de imagen para la portada." });
      return;
    }

    const oversized = validFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setMessage({ type: "error", text: "Cada portada debe ser menor a 10MB." });
      return;
    }

    setIsUploadingCover(true);
    try {
      const optimizedImages: string[] = [];
      for (const file of validFiles) {
        const optimized = await optimizeImageFile(file, resolveImagePreset("cover"));
        optimizedImages.push(optimized);
      }

      setProfile((prev) => {
        if (!prev) return prev;
        const merged = [...(prev.coverImageUrls || []), ...optimizedImages]
          .map((item) => item.trim())
          .filter(Boolean)
          .filter((item, index, source) => source.indexOf(item) === index)
          .slice(0, MAX_LINK_HUB_COVER_IMAGES);
        return {
          ...prev,
          coverImageUrls: merged,
          coverImageUrl: merged[0] || "",
        };
      });

      setMessage({
        type: "success",
        text: `${optimizedImages.length} portada(s) cargada(s) correctamente.`,
      });
    } catch (error) {
      console.error("[LinkHub] Cover upload error:", error);
      setMessage({ type: "error", text: "No se pudieron procesar las portadas." });
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleCatalogItemImageUpload(itemId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "El producto debe tener una imagen valida." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen del producto es muy pesada (max 10MB)." });
      return;
    }

    setUploadingCatalogItemId(itemId);
    try {
      const optimized = await optimizeImageFile(file, resolveImagePreset("item"));
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          catalogItems: prev.catalogItems.map((item) => {
            if (item.id !== itemId) return item;
            const nextGallery = isProPlan
              ? mergeGalleryImages([...(item.galleryImageUrls || []), optimized])
              : item.galleryImageUrls || [];
            return {
              ...item,
              imageUrl: optimized,
              galleryImageUrls: nextGallery,
            };
          }),
        };
      });
      setMessage({ type: "success", text: "Imagen del producto actualizada." });
    } catch (error) {
      console.error("[LinkHub] Catalog image upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen del producto." });
    } finally {
      setUploadingCatalogItemId(null);
    }
  }

  async function handleCatalogItemGalleryUpload(itemId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!isProPlan) {
      showProFeatureLocked("Galería de fotos PRO");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Selecciona una imagen valida para la galeria." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen es muy pesada (max 10MB)." });
      return;
    }

    setUploadingCatalogItemId(itemId);
    try {
      const optimized = await optimizeImageFile(file, resolveImagePreset("gallery"));
      appendCatalogGalleryImage(itemId, optimized);
      setMessage({ type: "success", text: "Foto agregada a la galeria PRO." });
    } catch (error) {
      console.error("[LinkHub] Catalog gallery image upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen para galeria." });
    } finally {
      setUploadingCatalogItemId(null);
    }
  }

  async function handleReservationImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Selecciona una imagen valida para reservas." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen de reservas es muy pesada (max 10MB)." });
      return;
    }

    setIsUploadingReservationImage(true);
    try {
      const optimized = await optimizeImageFile(file, resolveImagePreset("reservation"));
      patchReservation("heroImageUrl", optimized);
      setMessage({ type: "success", text: "Imagen de reservas cargada correctamente." });
    } catch (error) {
      console.error("[LinkHub] Reservation image upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen de reservas." });
    } finally {
      setIsUploadingReservationImage(false);
    }
  }

  async function handleCatalogItemGalleryUploadBatch(itemId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    if (!isProPlan) {
      showProFeatureLocked("Galería de fotos PRO");
      return;
    }

    const selectedItem = profile?.catalogItems.find((entry) => entry.id === itemId);
    const currentGalleryCount = mergeGalleryImages(selectedItem?.galleryImageUrls || []).length;
    const remainingSlots = Math.max(0, MAX_LINK_HUB_ITEM_GALLERY_IMAGES - currentGalleryCount);
    if (remainingSlots <= 0) {
      setMessage({ type: "error", text: `Maximo ${MAX_LINK_HUB_ITEM_GALLERY_IMAGES} fotos extra por item.` });
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    if (selectedFiles.length < files.length) {
      setMessage({
        type: "error",
        text: `Solo se cargaron ${selectedFiles.length} foto(s). Limite de galeria: ${MAX_LINK_HUB_ITEM_GALLERY_IMAGES}.`,
      });
    }

    if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      setMessage({ type: "error", text: "Selecciona una imagen valida para la galeria." });
      return;
    }

    if (selectedFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      setMessage({ type: "error", text: "La imagen es muy pesada (max 10MB)." });
      return;
    }

    setUploadingCatalogItemId(itemId);
    try {
      const optimizedBatch: string[] = [];
      for (const file of selectedFiles) {
        const optimized = await optimizeImageFile(file, resolveImagePreset("gallery"));
        optimizedBatch.push(optimized);
      }
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          catalogItems: prev.catalogItems.map((item) => {
            if (item.id !== itemId) return item;
            const nextGallery = mergeGalleryImages([...(item.galleryImageUrls || []), ...optimizedBatch]);
            return {
              ...item,
              imageUrl: item.imageUrl || optimizedBatch[0] || "",
              galleryImageUrls: nextGallery,
            };
          }),
        };
      });
      setMessage({ type: "success", text: `${optimizedBatch.length} foto(s) agregadas a la galeria PRO.` });
    } catch (error) {
      console.error("[LinkHub] Catalog gallery image upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen para galeria." });
    } finally {
      setUploadingCatalogItemId(null);
    }
  }

  async function handleCatalogBulkImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0 || !profile) return;
    if (!isProPlan) {
      showProFeatureLocked("Carga masiva de imagenes PRO");
      return;
    }

    const selectedCategoryId =
      bulkUploadCategoryId !== "all" &&
      profile.catalogCategories.some((category) => category.id === bulkUploadCategoryId)
        ? bulkUploadCategoryId
        : "all";
    const scopedItems = profile.catalogItems.filter((item) =>
      selectedCategoryId === "all" ? true : item.categoryId === selectedCategoryId,
    );
    if (scopedItems.length === 0) {
      setMessage({ type: "error", text: "No hay items disponibles en la categoria seleccionada." });
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setMessage({ type: "error", text: "Selecciona archivos de imagen validos." });
      return;
    }
    const oversized = validFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setMessage({ type: "error", text: "Cada imagen debe pesar menos de 10MB." });
      return;
    }

    const orderedTargetItems = [...scopedItems].sort((a, b) => {
      const aScore = a.imageUrl.trim() ? 1 : 0;
      const bScore = b.imageUrl.trim() ? 1 : 0;
      return aScore - bScore;
    });
    const assignCount = Math.min(validFiles.length, orderedTargetItems.length);
    const selectedFiles = validFiles.slice(0, assignCount);
    const targetItems = orderedTargetItems.slice(0, assignCount);
    if (assignCount <= 0) {
      setMessage({ type: "error", text: "No hay items disponibles para la carga masiva." });
      return;
    }

    setIsBulkUploadingCatalog(true);
    try {
      const optimizedBatch: Array<{ itemId: string; imageUrl: string }> = [];
      for (let index = 0; index < assignCount; index += 1) {
        const optimized = await optimizeImageFile(selectedFiles[index], resolveImagePreset("item"));
        optimizedBatch.push({ itemId: targetItems[index].id, imageUrl: optimized });
      }
      const updates = new Map(optimizedBatch.map((entry) => [entry.itemId, entry.imageUrl]));
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          catalogItems: prev.catalogItems.map((item) => {
            const nextImage = updates.get(item.id);
            if (!nextImage) return item;
            return {
              ...item,
              imageUrl: nextImage,
              galleryImageUrls: mergeGalleryImages([...(item.galleryImageUrls || []), nextImage]),
            };
          }),
        };
      });
      const droppedFiles = validFiles.length - assignCount;
      setMessage({
        type: "success",
        text:
          droppedFiles > 0
            ? `Carga masiva lista: ${assignCount} item(s) actualizados. ${droppedFiles} imagen(es) quedaron sin asignar.`
            : `Carga masiva lista: ${assignCount} item(s) actualizados.`,
      });
    } catch (error) {
      console.error("[LinkHub] Catalog bulk image upload error:", error);
      setMessage({ type: "error", text: "No se pudo completar la carga masiva de imagenes." });
    } finally {
      setIsBulkUploadingCatalog(false);
    }
  }

  async function saveProfile(mode: SaveMode) {
    if (!profile || !user?.uid) return;
    if (isProcessingImages) {
      setMessage({
        type: "error",
        text: "Espera a que terminen de procesarse las imagenes antes de guardar o publicar.",
      });
      return;
    }

    const sanitizedSlug = sanitizeSlug(profile.slug);
    if (profile.displayName.trim().length < 2) {
      setMessage({ type: "error", text: "El nombre de perfil debe tener al menos 2 caracteres." });
      return;
    }
    if (sanitizedSlug.length < 3) {
      setMessage({ type: "error", text: "El slug publico debe tener al menos 3 caracteres." });
      return;
    }

    const normalizedLinks = profile.links
      .map((link) => ({
        ...link,
        title: link.title.trim(),
        url: normalizeLinkUrl(link.url),
      }))
      .filter((link) => link.title || link.url);
    const preparedLinks = normalizedLinks.filter((link) => isValidExternalUrl(link.url));

    const cleanedCategories = profile.catalogCategories
      .map((category) => ({
        ...category,
        name: category.name.trim(),
        emoji: (category.emoji || "").trim(),
      }))
      .filter((category) => category.name.length > 0)
      .slice(0, MAX_LINK_HUB_CATALOG_CATEGORIES);

    if (cleanedCategories.length === 0) {
      setMessage({ type: "error", text: "Debes agregar al menos una categoria." });
      return;
    }

    const categoryIds = new Set(cleanedCategories.map((category) => category.id));
    const fallbackCategoryId = cleanedCategories[0].id;
    const cleanedItems = profile.catalogItems
      .map((item) => {
        const normalizedCategoryId = categoryIds.has(item.categoryId) ? item.categoryId : fallbackCategoryId;
        const normalizedImageUrl = item.imageUrl.trim();
        return {
          ...item,
          categoryId: normalizedCategoryId,
          title: item.title.trim(),
          description: item.description.trim(),
          salesCopy: (item.salesCopy || "").trim(),
          imageUrl: normalizedImageUrl,
          galleryImageUrls: mergeGalleryImages(
            (item.galleryImageUrls || []).filter((image) => image.trim() !== normalizedImageUrl),
          ),
          price: item.price.trim(),
          compareAtPrice: (item.compareAtPrice || "").trim(),
          badge: "",
          emoji: resolveCatalogItemEmojiByCategory(
            normalizedCategoryId,
            cleanedCategories,
            profile.businessType,
          ),
          outOfStock: Boolean(item.outOfStock),
        };
      })
      .filter((item) => item.title || item.description || item.price || item.imageUrl)
      .slice(0, MAX_LINK_HUB_CATALOG_ITEMS);

    const invalidItem = cleanedItems.find((item) => !item.title || !item.price);
    if (invalidItem) {
      setMessage({ type: "error", text: "Cada item de carta/catalogo debe tener nombre y precio." });
      return;
    }

    const cleanedPlans = profile.pricing.plans.slice(0, 3).map((plan) => ({
      ...plan,
      title: plan.title.trim(),
      normalPrice: plan.normalPrice.trim(),
      price: plan.price.trim(),
      currency: plan.currency.trim() || "S/.",
      ctaLabel: plan.ctaLabel.trim() || "Mas detalles",
      ctaUrl: plan.ctaUrl.trim(),
      features: plan.features.map((feature) => feature.trim()).filter(Boolean),
    }));
    const cleanedTestimonials = profile.proTestimonials
      .slice(0, LINK_HUB_PRO_TESTIMONIALS_COUNT)
      .map((testimonial) => ({
        ...testimonial,
        author: testimonial.author.trim(),
        role: testimonial.role.trim(),
        quote: testimonial.quote.trim(),
        rating: Math.max(1, Math.min(5, Number(testimonial.rating) || 5)),
      }));
    const cleanedReservationSlots = profile.reservation.slotOptions
      .map((slot) => slot.trim())
      .filter(Boolean)
      .slice(0, 12);
    const reservationMinParty = Math.max(1, Math.min(99, Math.round(Number(profile.reservation.minPartySize) || 1)));
    const reservationMaxParty = Math.max(1, Math.min(99, Math.round(Number(profile.reservation.maxPartySize) || 12)));
    const cleanedReservation = {
      ...profile.reservation,
      enabled: canUseReservations ? Boolean(profile.reservation.enabled) : false,
      title: profile.reservation.title.trim() || "Reserva premium",
      subtitle:
        profile.reservation.subtitle.trim() ||
        "Agenda tu mesa en segundos y recibe confirmacion por WhatsApp.",
      heroImageUrl: profile.reservation.heroImageUrl.trim(),
      slotOptions:
        cleanedReservationSlots.length > 0
          ? cleanedReservationSlots
          : ["12:00 pm", "1:00 pm", "7:00 pm", "8:00 pm"],
      minPartySize: Math.min(reservationMinParty, reservationMaxParty),
      maxPartySize: Math.max(reservationMinParty, reservationMaxParty),
      ctaLabel: profile.reservation.ctaLabel.trim() || "Enviar reserva",
      notePlaceholder:
        profile.reservation.notePlaceholder.trim() ||
        "Ejemplo: celebracion, terraza o alergias alimentarias.",
      requiresDeposit: canUseReservations ? Boolean(profile.reservation.requiresDeposit) : false,
      depositAmount: profile.reservation.depositAmount.trim(),
      depositInstructions: profile.reservation.depositInstructions.trim(),
    };
    const promoDiscount = Math.max(0, Math.min(90, Math.round(Number(profile.automation.promoDiscountPercent) || 0)));
    const cleanedWeeklyPromoPlan = Array.isArray(profile.automation.weeklyPromoPlan)
      ? profile.automation.weeklyPromoPlan
          .map((entry) => String(entry || "").trim())
          .filter(Boolean)
          .slice(0, 7)
      : [];
    const cleanedAutomation = {
      ...profile.automation,
      autoScheduleEnabled: isProPlan ? Boolean(profile.automation.autoScheduleEnabled) : false,
      openTime: (profile.automation.openTime || "11:00").trim() || "11:00",
      closeTime: (profile.automation.closeTime || "23:00").trim() || "23:00",
      hideOutOfStock: isProPlan ? Boolean(profile.automation.hideOutOfStock) : false,
      promoEnabled: isProPlan ? Boolean(profile.automation.promoEnabled) : false,
      promoStart: (profile.automation.promoStart || "12:00").trim() || "12:00",
      promoEnd: (profile.automation.promoEnd || "14:00").trim() || "14:00",
      promoDiscountPercent: promoDiscount,
      promoLabel: (profile.automation.promoLabel || "Promo del dia").trim() || "Promo del dia",
      weeklyPromoObjective:
        (profile.automation.weeklyPromoObjective || "incrementar pedidos por WhatsApp").trim() ||
        "incrementar pedidos por WhatsApp",
      weeklyPromoPlan: isProPlan ? cleanedWeeklyPromoPlan : [],
      weeklyPromoUpdatedAt: isProPlan ? Number(profile.automation.weeklyPromoUpdatedAt || 0) || 0 : 0,
    };

    if (profile.pricing.enabled && cleanedPlans.some((plan) => !plan.title || !plan.price)) {
      setMessage({ type: "error", text: "Cada plan debe tener titulo y precio." });
      return;
    }

    if (mode === "publish" && cleanedItems.length === 0) {
      setMessage({
        type: "error",
        text: "Debes agregar al menos un item valido antes de publicar.",
      });
      return;
    }

    const currentProfileId = activeProfileId || user.uid;
    let publishTargetMode: "existing" | "new" = "existing";

    if (mode === "publish") {
      const alreadyPublished = Boolean(profile.published);
      const publishTarget = requestPublishTarget({
        hasExistingProject: alreadyPublished,
        entityLabel: "carta digital",
      });
      if (publishTarget === "cancelled") {
        return;
      }
      publishTargetMode = publishTarget;

      let latestSummary = subscriptionSummary;
      try {
        latestSummary = await fetchCurrentSubscriptionSummary();
      } catch {
        // fallback to current hook snapshot when API is temporarily unavailable
      }

      const planStatus = String(latestSummary?.status || "").toUpperCase();
      const maxProjects = latestSummary?.limits?.maxProjects ?? latestSummary?.limits?.maxPublishedPages ?? null;
      const usedProjects = Number(latestSummary?.usage?.publishedPages || 0);
      const nextProjects =
        publishTargetMode === "new"
          ? usedProjects + 1
          : alreadyPublished
            ? usedProjects
            : usedProjects + 1;

      if (planStatus !== "ACTIVE") {
        setMessage({
          type: "error",
          text: "Tu periodo activo termino. Renueva en Billing para reactivar y publicar proyectos.",
        });
        router.push("/dashboard/billing");
        return;
      }

      if (maxProjects != null && nextProjects > maxProjects) {
        setMessage({
          type: "error",
          text: `Limite alcanzado: ${usedProjects}/${maxProjects} proyectos publicados. Renueva o sube de plan en Billing.`,
        });
        router.push("/dashboard/billing?requiredFeature=limit");
        return;
      }

      if (
        publishTargetMode === "new" &&
        maxProjects != null &&
        nextProjects >= 2 &&
        shouldConfirmExtraProjectSlot()
      ) {
        const confirmed = window.confirm(
          `Se publicara como proyecto ${nextProjects}/${maxProjects}. Deseas continuar?`,
        );
        if (!confirmed) {
          return;
        }
      }
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const isNewPublishedProject = mode === "publish" && publishTargetMode === "new";
      const targetProfileId = isNewPublishedProject
        ? `${user.uid}-${createClientUuid()}`
        : currentProfileId;

      let finalSlug = sanitizedSlug;
      let slugAdjustedForNewProject = false;
      const hasBaseSlugAvailable = await isLinkHubSlugAvailable(finalSlug, user.uid, targetProfileId);

      if (!hasBaseSlugAvailable) {
        if (!isNewPublishedProject) {
          setMessage({ type: "error", text: "Ese slug ya esta en uso. Elige uno diferente." });
          return;
        }

        let candidateFound = false;
        for (let attempt = 2; attempt <= 25; attempt += 1) {
          const candidate = sanitizeSlug(`${sanitizedSlug}-${attempt}`);
          if (!candidate) continue;
          const candidateAvailable = await isLinkHubSlugAvailable(candidate, user.uid, targetProfileId);
          if (candidateAvailable) {
            finalSlug = candidate;
            slugAdjustedForNewProject = true;
            candidateFound = true;
            break;
          }
        }

        if (!candidateFound) {
          setMessage({
            type: "error",
            text: "No se pudo generar un alias unico para el nuevo proyecto. Cambia el alias e intenta nuevamente.",
          });
          return;
        }
      }

      const safeTheme = getSafeLinkHubTheme(profile.theme);
      const safeColors = getLinkHubThemeColors(
        safeTheme,
        profile.themePrimaryColor,
        profile.themeSecondaryColor,
      );

      const now = Date.now();
      const cleanedCoverImageUrls = [...(profile.coverImageUrls || []), profile.coverImageUrl]
        .map((url) => url.trim())
        .filter(Boolean)
        .filter((url, index, source) => source.indexOf(url) === index)
        .slice(0, MAX_LINK_HUB_COVER_IMAGES);
      const normalizedMaps = normalizeGoogleMapsLocationInput(
        profile.location.mapEmbedUrl.trim(),
        profile.location.mapsUrl.trim(),
        profile.location.address.trim(),
      );

      const normalizedNextProfile = normalizeLinkHubProfile(
        {
          ...profile,
          userId: user.uid,
          slug: finalSlug,
          displayName: profile.displayName.trim(),
          bio: profile.bio.trim(),
          avatarUrl: profile.avatarUrl.trim(),
          coverImageUrl: cleanedCoverImageUrls[0] || "",
          coverImageUrls: cleanedCoverImageUrls,
          categoryLabel: formatRubroLabelWithEmoji(profile.categoryLabel.trim() || DEFAULT_RESTAURANT_RUBRO),
          phoneNumber: profile.phoneNumber.trim(),
          whatsappNumber: profile.whatsappNumber.trim(),
          theme: safeTheme,
          cartaThemeId: resolvedCartaThemeId,
          cartaBackgroundMode: resolvedCartaBackgroundMode,
          themePrimaryColor: safeColors.primary,
          themeSecondaryColor: safeColors.secondary,
          links: preparedLinks.length > 0 ? preparedLinks : [createEmptyLink()],
          catalogCategories: cleanedCategories,
          catalogItems: cleanedItems,
          proTestimonials: cleanedTestimonials,
          proDeliveryModes: {
            delivery: Boolean(profile.proDeliveryModes.delivery),
            pickup: Boolean(profile.proDeliveryModes.pickup),
            dinein: Boolean(profile.proDeliveryModes.dinein),
          },
          proFeaturesUnlocked: isProPlan,
          location: {
            ...profile.location,
            address: profile.location.address.trim(),
            mapEmbedUrl: normalizedMaps.mapEmbedUrl,
            mapsUrl: normalizedMaps.mapsUrl,
            ctaLabel: profile.location.ctaLabel.trim() || "Ir ahora",
            scheduleLines: profile.location.scheduleLines.map((line) => line.trim()).filter(Boolean),
          },
          reservation: cleanedReservation,
          automation: cleanedAutomation,
          pricing: {
            ...profile.pricing,
            title: profile.pricing.title.trim() || "Carta Digital",
            subtitle: profile.pricing.subtitle.trim(),
            plans: cleanedPlans,
          },
          published: mode === "publish",
          ...(typeof profile.publishedAt === "number" ? { publishedAt: profile.publishedAt } : {}),
          ...(mode === "publish" ? { publishedAt: now } : {}),
          updatedAt: now,
          createdAt: profile.createdAt || now,
        },
        user,
      );

      const compactedProfileResult = await withOperationTimeout(
        compactProfileImagesByPlan(normalizedNextProfile, storagePlanTier),
        PROFILE_COMPACT_TIMEOUT_MS,
        "profile_compaction",
      );
      let nextProfile = compactedProfileResult.profile;
      try {
        nextProfile = await withOperationTimeout(
          offloadProfileInlineImagesToStorage(nextProfile, {
            userId: user.uid,
            profileId: targetProfileId,
          }),
          PROFILE_COMPACT_TIMEOUT_MS,
          "storage_offload",
        );
      } catch (storageError) {
        console.error("[LinkHub] Storage offload warning:", storageError);
      }
      const nextProfileBytes = estimateJsonBytes(nextProfile);
      if (nextProfileBytes > compactedProfileResult.budget) {
        throw new Error(
          `PROFILE_PAYLOAD_TOO_LARGE:${nextProfileBytes}:${compactedProfileResult.budget}:${storagePlanTier}`,
        );
      }

      let savedProfileId = "";
      let persistedProfile = nextProfile;
      let usedPermissionFallback = false;
      let fallbackSlugAdjusted = false;

      try {
        savedProfileId = await withOperationTimeout(
          saveLinkHubProfileForUser(user.uid, persistedProfile, targetProfileId),
          PROFILE_SAVE_TIMEOUT_MS,
          "profile_write",
        );
      } catch (saveError) {
        if (!isFirestorePermissionDenied(saveError) || targetProfileId === user.uid) {
          throw saveError;
        }

        const fallbackProfileId = user.uid;
        let fallbackSlug = finalSlug;
        const baseAvailableInFallback = await isLinkHubSlugAvailable(fallbackSlug, user.uid, fallbackProfileId);
        if (!baseAvailableInFallback) {
          let found = false;
          for (let attempt = 2; attempt <= 25; attempt += 1) {
            const candidate = sanitizeSlug(`${sanitizedSlug}-main-${attempt}`);
            if (!candidate) continue;
            const available = await isLinkHubSlugAvailable(candidate, user.uid, fallbackProfileId);
            if (available) {
              fallbackSlug = candidate;
              found = true;
              fallbackSlugAdjusted = true;
              break;
            }
          }
          if (!found) {
            throw saveError;
          }
        }

        persistedProfile = normalizeLinkHubProfile(
          {
            ...persistedProfile,
            slug: fallbackSlug,
            updatedAt: Date.now(),
          },
          user,
        );
        finalSlug = fallbackSlug;
        savedProfileId = await withOperationTimeout(
          saveLinkHubProfileForUser(user.uid, persistedProfile, fallbackProfileId),
          PROFILE_SAVE_TIMEOUT_MS,
          "profile_write_fallback",
        );
        usedPermissionFallback = true;
      }

      setActiveProfileId(savedProfileId);
      setProfile(persistedProfile);
      setPreviewCategoryId(persistedProfile.catalogCategories[0]?.id || "");
      try {
        window.localStorage.setItem(`linkhub_draft_${user.uid}_${savedProfileId}`, JSON.stringify(persistedProfile));
        if (savedProfileId === user.uid) {
          window.localStorage.setItem(`linkhub_draft_${user.uid}`, JSON.stringify(persistedProfile));
        }
      } catch {
        // ignore
      }
      setMessage({
        type: "success",
        text:
          mode === "publish"
            ? usedPermissionFallback
              ? fallbackSlugAdjusted
                ? `Publicada en perfil principal por permisos de Firestore (@${finalSlug}).`
                : "Publicada en perfil principal por permisos de Firestore."
              : slugAdjustedForNewProject
                ? `Carta Digital publicada como proyecto nuevo (@${finalSlug}).`
                : "Carta Digital publicada. Ya puedes compartir tu URL."
            : usedPermissionFallback
              ? "Borrador guardado en perfil principal por permisos de Firestore."
              : "Borrador guardado correctamente.",
      });
      if (mode === "publish") {
        router.push(`/published?highlight=${encodeURIComponent(savedProfileId)}&kind=linkhub`);
      }
    } catch (error) {
      console.error("[LinkHub] Save error:", error);
      const rawMessage = String((error as { message?: string })?.message || "").toLowerCase();
      const payloadLimitMatch = rawMessage.match(/profile_payload_too_large:(\d+):(\d+):(free|business|pro)/i);
      if (payloadLimitMatch) {
        const currentBytes = Number(payloadLimitMatch[1] || 0);
        const budgetBytes = Number(payloadLimitMatch[2] || 0);
        const planLabel = String(payloadLimitMatch[3] || activePlan).toUpperCase();
        setMessage({
          type: "error",
          text: `No se pudo guardar: tu perfil supera el limite del plan ${planLabel} (${formatBytes(currentBytes)} de ${formatBytes(budgetBytes)}). Ya comprimimos automaticamente, pero necesitas reducir imagenes o subir de plan.`,
        });
      } else if (isOperationTimeoutError(error)) {
        setMessage({
          type: "error",
          text: "La operacion tardo demasiado y se cancelo para evitar bucle. Revisa tu conexion e intenta nuevamente.",
        });
      } else if (rawMessage.includes("unsupported field value: undefined")) {
        setMessage({
          type: "error",
          text: "No se pudo guardar por un dato invalido en el perfil. Actualiza e intenta nuevamente.",
        });
      } else if (
        rawMessage.includes("maximum size") ||
        rawMessage.includes("document too large") ||
        (rawMessage.includes("exceeds") && rawMessage.includes("size"))
      ) {
        setMessage({
          type: "error",
          text: "No se pudo guardar porque las imagenes pesan demasiado para un solo perfil. Reduce cantidad/calidad e intenta nuevamente.",
        });
      } else if (isFirestorePermissionDenied(error)) {
        setMessage({ type: "error", text: "No se pudo guardar por permisos de Firestore." });
      } else {
        setMessage({ type: "error", text: "No se pudo guardar. Intenta nuevamente." });
      }
    } finally {
      setIsSaving(false);
    }
  }

  function renderPublishChecklistCard(containerClassName = "") {
    return (
      <div className={`${containerClassName} rounded-2xl border border-white/10 bg-zinc-950/65 p-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-white">Publica en 10 minutos (tutorial) 📘</p>
            <p className="mt-1 text-xs text-zinc-300">
              Checklist rapido para dejar tu carta lista y convertir mejor.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100">
            {checklistCompleted}/{publishChecklist.length} listo ({checklistPercent}%)
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all"
            style={{ width: `${Math.max(0, Math.min(100, checklistPercent))}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {publishChecklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToEditorSection(item.section)}
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-left text-xs font-semibold text-zinc-100"
            >
              <span className="inline-flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Circle className="h-4 w-4 text-zinc-500" />
                )}
                {item.label}
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Ir</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if ((loading || isLoadingProfile) && !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">No se pudo abrir Carta Digital</h1>
          <p className="mt-3 text-red-100/90">
            Ocurrio un problema de permisos o conexion. Recarga la pagina e intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-3 md:px-8 pt-40 md:pt-24 pb-16">
      <div ref={mobileTopDockRef} className="fixed inset-x-0 top-16 z-40 px-4 md:hidden">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/90 p-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-row-reverse items-center gap-2">
                <button
                  onClick={() => saveProfile("draft")}
                  disabled={isSaving || isProcessingImages}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold text-white"
                  title="Guardar borrador"
                  aria-label="Guardar borrador"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => saveProfile("publish")}
                  disabled={isSaving || isProcessingImages}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-400/10 text-sm font-bold text-emerald-100"
                  title="Publicar Carta Digital"
                  aria-label="Publicar Carta Digital"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyPublicUrl}
                  disabled={!publicUrl}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/40 bg-sky-400/10 text-sm font-bold text-sky-100 disabled:opacity-50"
                  title="Copiar URL"
                  aria-label="Copiar URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (mobileEditMenuOpen) {
                    setMobileEditMenuOpen(false);
                    return;
                  }
                  setMobileEditMenuOpen(true);
                  setMobileEditMenuMode("sections");
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-400/15 px-3 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Edicion
              </button>
            </div>
            {mobileEditMenuOpen ? (
              <div className="mt-2 space-y-1.5 rounded-2xl border border-white/15 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
                {mobileEditMenuMode === "sections" ? (
                  <>
                    <button type="button" onClick={scrollToPublishChecklist} className="flex w-full items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-400/15 px-3 py-2 text-[11px] font-bold text-emerald-100">
                      <Rocket className="h-3.5 w-3.5" />
                      Publica en 10 minutos (tutorial) 📘
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("identity")} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-zinc-100">
                      <Store className="h-3.5 w-3.5" />
                      Identidad de negocio
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("bioLinks")} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-zinc-100">
                      <MessageCircle className="h-3.5 w-3.5" />
                      BIO y enlaces
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("catalog")} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-zinc-100">
                      <Fish className="h-3.5 w-3.5" />
                      Carta digital
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("pro")} className="flex w-full items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-400/15 px-3 py-2 text-[11px] font-bold text-amber-100">
                      <Lock className="h-3.5 w-3.5" />
                      Funciones PRO
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("location")} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-zinc-100">
                      <MapPin className="h-3.5 w-3.5" />
                      Ubicacion
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("reservation")} className="flex w-full items-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-[11px] font-bold text-emerald-100">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Reserva
                    </button>
                    <button type="button" onClick={() => scrollToEditorSection("themes")} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-zinc-100">
                      <Palette className="h-3.5 w-3.5" />
                      Temas
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-emerald-300/35 bg-emerald-400/10 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={openMobileSectionMenu}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-100"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileEditMenuOpen(false)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-200"
                        aria-label="Cerrar menu edicion"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] font-bold text-emerald-100">
                      Editando: {mobileSectionLabelMap[mobileEditorSection]}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md md:max-w-7xl">
        <MobilePlanStatusCard userId={user?.uid} className="mb-4" />
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Carta Digital</h1>
            <PlanBadge plan={activePlan} />
          </div>
          <p className="mt-2 text-zinc-400 max-w-3xl">
            Crea una landing mobile-first con contacto, {catalogLabel?.toLowerCase()}, ubicacion y reserva opcional (Business/Pro).
            Diseñada para mostrar tu carta con experiencia premium.
          </p>
          <div className="mt-4">
            <SubscriptionExpiryBanner
              visible={Boolean(subscriptionSummary?.expiringSoon)}
              daysRemaining={subscriptionSummary?.daysRemaining || 0}
            />
          </div>
          <div className="mt-3 hidden md:flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
              Proyectos publicados: {publishedProjectsLabel}
            </span>
            <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
              {subscriptionSummary?.isBusinessTrial ? "Dias de prueba" : "Dias de plan"}:{" "}
              {planDaysRemaining}
            </span>
          </div>
          <div ref={publishChecklistSectionRef}>
            {renderPublishChecklistCard("mt-4")}
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              message.type === "success"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-red-400/40 bg-red-400/10 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {isProTrialModalOpen ? (
          <div ref={proTrialBannerRef} className="mb-6 rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-emerald-100">Prueba PRO 7 dias con 1 clic</p>
                <p className="mt-1 text-xs text-emerald-50/90">
                  {proTrialFeatureLabel
                    ? `${proTrialFeatureLabel} requiere PRO.`
                    : "Esta función requiere PRO."}{" "}
                  Activa la prueba ahora mismo desde el editor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProTrialModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-emerald-100"
                aria-label="Cerrar prueba PRO"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {proTrialError ? (
              <p className="mt-3 rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                {proTrialError}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={activateProTrial}
                disabled={isActivatingProTrial}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-100 disabled:opacity-60"
              >
                {isActivatingProTrial ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Activar prueba PRO 7 dias
              </button>
              <button
                type="button"
                onClick={() => setIsProTrialModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200"
              >
                Continuar sin PRO
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,560px)]">
          <section
            className={`min-w-0 space-y-6 md:pt-0 ${
              isMobileEditorOverlayActive ? "pt-[8.6rem]" : "pt-[31.5rem]"
            } ${!isMobileEditorOverlayActive ? "hidden md:block" : ""}`}
          >
            <div
              ref={publishChecklistEditorSectionRef}
              className={`md:hidden ${mobileEditorSection !== "checklist" ? "hidden" : ""}`}
            >
              {renderMobileSectionBack("checklist")}
              {renderPublishChecklistCard()}
            </div>
            <div
              ref={identitySectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "identity" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("identity")}
              <h2 className="text-xl font-bold text-white mb-5">Identidad del Negocio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Nombre de negocio</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.displayName}
                    onChange={(event) => patchProfile("displayName", event.target.value)}
                    placeholder="Tu marca o nombre profesional"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Alias publico</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.slug}
                    onChange={(event) => patchProfile("slug", sanitizeSlug(event.target.value))}
                    placeholder="tu-nombre"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Etiqueta del rubro</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={selectedRestaurantRubroOption}
                    onChange={(event) => {
                      const nextRubro = String(event.target.value || "").trim();
                      if (!nextRubro || nextRubro === "__custom__") return;
                      handleRestaurantRubroChange(nextRubro);
                    }}
                  >
                    <option value="__custom__">Seleccionar rubro predefinido</option>
                    {RESTAURANT_SUBCATEGORY_OPTIONS.map((subcategory) => (
                      <option key={`quick-${subcategory}`} value={subcategory}>
                        {formatRubroLabelWithEmoji(subcategory)}
                      </option>
                    ))}
                  </select>
                  <input
                    list="restaurant-rubro-options"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.categoryLabel}
                    onChange={(event) => patchProfile("categoryLabel", formatRubroLabelWithEmoji(event.target.value))}
                    onBlur={(event) => handleRestaurantRubroChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      handleRestaurantRubroChange((event.target as HTMLInputElement).value);
                    }}
                    placeholder="Escribe un rubro nuevo o elige uno predefinido"
                  />
                  <datalist id="restaurant-rubro-options">
                    {RESTAURANT_SUBCATEGORY_OPTIONS.map((subcategory) => (
                      <option key={subcategory} value={formatRubroLabelWithEmoji(subcategory)}>
                        {formatRubroLabelWithEmoji(subcategory)}
                      </option>
                    ))}
                  </datalist>
                  <p className="text-[11px] text-zinc-400">
                    Emoji automatico detectado: <span className="font-bold text-zinc-200">{inferRubroEmoji(profile.categoryLabel)}</span>
                  </p>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Foto de perfil</span>
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-sky-300/40 bg-sky-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sky-100">
                      {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Adjuntar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploadingAvatar}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => patchProfile("avatarUrl", "")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-red-100"
                    >
                      <X className="h-4 w-4" />
                      Quitar
                    </button>
                  </div>
                  <p className="text-[11px] font-semibold text-zinc-300">
                    {profile.avatarUrl ? "Imagen lista" : "Sin imagen"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Soporta JPG, PNG, WEBP. Se optimiza automaticamente para carga rapida.
                  </p>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    Portadas (hasta {MAX_LINK_HUB_COVER_IMAGES})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-[auto] gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-sky-300/40 bg-sky-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sky-100">
                      {isUploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Subir
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleCoverUpload}
                        className="hidden"
                        disabled={isUploadingCover || profile.coverImageUrls.length >= MAX_LINK_HUB_COVER_IMAGES}
                      />
                    </label>
                  </div>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">
                      {profile.coverImageUrls.length}/{MAX_LINK_HUB_COVER_IMAGES} imagenes de portada. Si agregas mas de una, se mostraran con transicion automatica en la pagina publica.
                    </p>
                    <button
                      type="button"
                      onClick={clearCoverImages}
                      disabled={profile.coverImageUrls.length === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-red-100"
                    >
                      <X className="h-4 w-4" />
                      Quitar todo
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.coverImageUrls.map((coverUrl, index) => (
                      <div key={`${coverUrl}-${index}`} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        <img
                          src={coverUrl}
                          alt={`Portada ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
                          <p className="text-xs font-semibold text-zinc-200 truncate">Portada {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeCoverImageAt(index)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-300/40 bg-red-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                    {profile.coverImageUrls.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/20 px-4 py-6 text-center text-xs text-zinc-400 sm:col-span-2">
                        Aun no agregaste portadas. Sube una o varias imagenes para activar el slider.
                      </div>
                    )}
                  </div>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Bio</span>
                  <textarea
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                    value={profile.bio}
                    onChange={(event) => patchProfile("bio", event.target.value)}
                    placeholder="Describe brevemente lo que ofreces."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Tab contacto</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.sectionLabels.contact}
                    onChange={(event) => patchSectionLabel("contact", event.target.value)}
                    placeholder="Contacto"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Tab ubicacion</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.sectionLabels.location}
                    onChange={(event) => patchSectionLabel("location", event.target.value)}
                    placeholder="Ubicacion"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    Tab reserva (Business/Pro)
                  </span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
                    value={profile.sectionLabels.reservation}
                    onChange={(event) => patchSectionLabel("reservation", event.target.value)}
                    placeholder="Reserva"
                    disabled={!canUseReservations}
                  />
                </label>
              </div>
            </div>

            <div
              ref={bioLinksSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "bioLinks" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("bioLinks")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Telefono</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.phoneNumber}
                    onChange={(event) => patchProfile("phoneNumber", event.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">WhatsApp</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.whatsappNumber}
                    onChange={(event) => patchProfile("whatsappNumber", event.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </label>
              </div>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white">Enlaces sociales y CTA</h2>
                <button
                  type="button"
                  onClick={addLink}
                  disabled={profile.links.length >= MAX_LINK_HUB_LINKS}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              <div className="space-y-4">
                {profile.links.map((link, index) => (
                  <div key={link.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={link.title}
                        onChange={(event) => patchLink(link.id, { title: event.target.value })}
                        placeholder="Texto del boton"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={link.url}
                        onChange={(event) => patchLink(link.id, { url: event.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                      <div className="flex items-center gap-2">
                        <select
                          className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                          value={link.type}
                          onChange={(event) =>
                            patchLink(link.id, { type: event.target.value as LinkHubLinkType })
                          }
                        >
                          {LINK_TYPE_OPTIONS.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => moveLink(link.id, "up")}
                          disabled={index === 0}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 disabled:opacity-40"
                          aria-label="Mover arriba"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(link.id, "down")}
                          disabled={index === profile.links.length - 1}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 disabled:opacity-40"
                          aria-label="Mover abajo"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLink(link.id)}
                          className="rounded-xl border border-red-300/30 bg-red-400/10 p-2 text-red-200"
                          aria-label="Eliminar enlace"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={catalogSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "catalog" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("catalog")}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white">
                  {profile.businessType === "restaurant" ? "Carta" : "Catalogo"} digital
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={suggestDescriptionsForAllItems}
                    disabled={profile.catalogItems.length === 0 || !aiEnabled}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-300/35 bg-amber-400/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-100 disabled:opacity-50"
                    title={aiEnabled ? "Sugerir descripciones con IA" : "Disponible en plan PRO"}
                  >
                    <Sparkles className="w-4 h-4" />
                    Sugerir descripciones
                  </button>
                  <button
                    type="button"
                    onClick={suggestSalesCopyForAllItems}
                    disabled={profile.catalogItems.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-100 disabled:opacity-50"
                    title={isProPlan ? "Generar copys de venta PRO" : "Bloqueado para Starter y Business"}
                  >
                    {isProPlan ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    Copys de venta PRO
                  </button>
                  <button
                    type="button"
                    onClick={addCatalogItem}
                    disabled={profile.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar item
                  </button>
                </div>
              </div>
              <div
                className={`mb-4 rounded-2xl border p-3 ${
                  isProPlan
                    ? "border-emerald-300/35 bg-emerald-500/10"
                    : "border-amber-300/35 bg-amber-400/10"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  {isProPlan ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-2.5 py-1 text-emerald-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      PRO activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/45 bg-amber-400/15 px-2.5 py-1 text-amber-100">
                      <Lock className="h-3.5 w-3.5" />
                      PRO recomendado
                    </span>
                  )}
                  <span className={isProPlan ? "text-emerald-100" : "text-amber-100"}>
                    Carga masiva + copys de venta + ajustes por porcentaje + galería extra.
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2 py-1 text-zinc-200">
                    <Images className="h-3.5 w-3.5" />
                    Fotos masivas
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2 py-1 text-zinc-200">
                    <Percent className="h-3.5 w-3.5" />
                    Precios por categoría
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2 py-1 text-zinc-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Copys para vender más
                  </span>
                </div>
                {renderInlineProTrialButton("Funciones PRO de carta digital")}
              </div>

              <div className="mb-4 rounded-2xl border border-white/10 bg-black/25 p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-300">
                  Acciones rápidas
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                    <select
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                      value={bulkUploadCategoryId}
                      onChange={(event) => setBulkUploadCategoryId(event.target.value)}
                    >
                      <option value="all">Carga masiva: todos los items</option>
                      {profile.catalogCategories.map((category) => (
                        <option key={`bulk-${category.id}`} value={category.id}>
                          {category.emoji || "•"} {category.name}
                        </option>
                      ))}
                    </select>
                    <label
                      onClick={(event) => {
                        if (isProPlan) return;
                        event.preventDefault();
                        showProFeatureLocked("Carga masiva de imagenes PRO");
                      }}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                        isProPlan
                          ? "cursor-pointer border-sky-300/40 bg-sky-400/10 text-sky-100"
                          : "cursor-not-allowed border-white/10 bg-white/5 text-zinc-400"
                      }`}
                      title={isProPlan ? "Subir varias fotos y asignarlas en lote." : "Disponible en plan PRO"}
                    >
                      {isBulkUploadingCatalog ? <Loader2 className="h-4 w-4 animate-spin" /> : <Images className="h-4 w-4" />}
                      Carga masiva
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleCatalogBulkImageUpload}
                        className="hidden"
                        disabled={!isProPlan || isBulkUploadingCatalog}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto]">
                    <select
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                      value={priceAdjustCategoryId}
                      onChange={(event) => setPriceAdjustCategoryId(event.target.value)}
                    >
                      <option value="all">Ajustar precio: toda la carta</option>
                      {profile.catalogCategories.map((category) => (
                        <option key={`price-${category.id}`} value={category.id}>
                          {category.emoji || "•"} {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                      value={priceAdjustPercent}
                      onChange={(event) => setPriceAdjustPercent(event.target.value)}
                      placeholder="+10 o -5"
                    />
                    <button
                      type="button"
                      onClick={applyCatalogPriceAdjustment}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-100"
                      title={isProPlan ? "Aplicar ajuste de precios por porcentaje" : "Disponible en plan PRO"}
                    >
                      <Percent className="h-3.5 w-3.5" />
                      Aplicar
                    </button>
                  </div>
                </div>
                {renderInlineProTrialButton("Acciones rápidas PRO")}
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <input
                    className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                    value={editorItemSearch}
                    onChange={(event) => setEditorItemSearch(event.target.value)}
                    placeholder="Buscar item por nombre, descripcion, copy, categoria o precio..."
                  />
                </label>
                <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200">
                  {filteredEditorItems.length}/{profile.catalogItems.length} items
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold text-white">Categorias</p>
                  <button
                    type="button"
                    onClick={addCategory}
                    disabled={profile.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Categoria
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.catalogCategories.map((category) => (
                    <div key={category.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[90px_minmax(0,1fr)_auto]">
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={category.emoji || ""}
                        onChange={(event) => patchCategory(category.id, { emoji: event.target.value })}
                        placeholder="🍽️"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={category.name}
                        onChange={(event) => patchCategory(category.id, { name: event.target.value })}
                        placeholder="Nombre de categoria"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => duplicateCategoryWithItems(category.id)}
                          disabled={profile.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES}
                          className="rounded-xl border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-sky-100 disabled:opacity-50"
                          title="Duplicar categoría con sus items"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(category.id)}
                          disabled={profile.catalogCategories.length <= 1}
                          className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-red-100 disabled:opacity-40"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {filteredEditorItems.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-4 text-sm text-zinc-300">
                    No hay items para este filtro. Limpia la busqueda o agrega uno nuevo.
                    <button
                      type="button"
                      onClick={addCatalogItem}
                      disabled={profile.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar item
                    </button>
                  </div>
                )}
                {filteredEditorItems.map((item) => (
                  <div
                    key={item.id}
                    ref={(node) => {
                      catalogEditorItemRefs.current[item.id] = node;
                    }}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-white">Item</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveCatalogItem(item.id, "up")}
                          disabled={profile.catalogItems.findIndex((entry) => entry.id === item.id) <= 0}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200"
                          aria-label="Mover item arriba"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCatalogItem(item.id, "down")}
                          disabled={
                            profile.catalogItems.findIndex((entry) => entry.id === item.id) >=
                            profile.catalogItems.length - 1
                          }
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200"
                          aria-label="Mover item abajo"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => createCatalogItemBelow(item.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-sky-300/30 bg-sky-400/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-100 sm:px-3 sm:text-[11px]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Crear nuevo
                        </button>
                        <button
                          type="button"
                          onClick={() => suggestCatalogItemDescription(item.id)}
                          disabled={!aiEnabled}
                          className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-100 sm:px-3 sm:text-[11px]"
                          title={aiEnabled ? "Sugerir descripción con IA" : "Disponible en plan PRO"}
                        >
                          Sugerir descripcion
                        </button>
                        <button
                          type="button"
                          onClick={() => suggestCatalogItemSalesCopy(item.id)}
                          className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-100 sm:px-3 sm:text-[11px]"
                          title={isProPlan ? "Generar copy PRO de venta" : "Disponible en plan PRO"}
                        >
                          {isProPlan ? "Copy PRO" : "Copy 🔒"}
                        </button>
                        <button
                          type="button"
                          onClick={() => patchCatalogItem(item.id, { outOfStock: !item.outOfStock })}
                          className={`rounded-xl border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:px-3 sm:text-[11px] ${
                            item.outOfStock
                              ? "border-rose-300/35 bg-rose-500/15 text-rose-100"
                              : "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                          }`}
                          title="Control de stock para ocultar en carta publicada"
                        >
                          {item.outOfStock ? "Sin stock" : "Con stock"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCatalogItem(item.id)}
                          className="rounded-xl border border-red-300/30 bg-red-400/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-red-100 sm:px-3 sm:text-[11px]"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
                      <label
                        className={`rounded-xl border border-white/10 bg-black/40 p-2 ${
                          uploadingCatalogItemId === item.id
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer transition hover:border-sky-300/45 hover:bg-sky-500/10"
                        }`}
                        title="Haz clic en la imagen para subir/cambiar foto"
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title || "Producto"} className="h-24 w-full rounded-lg object-cover" />
                        ) : (
                          <div className="h-24 w-full rounded-lg bg-zinc-900/80 flex items-center justify-center text-zinc-500 text-xs">
                            Sin imagen
                          </div>
                        )}
                        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300">
                          {item.imageUrl ? "Imagen lista" : "Sube una foto"}
                        </p>
                        <p
                          className={`mt-1 text-center text-[10px] font-bold uppercase tracking-[0.12em] ${
                            item.outOfStock ? "text-rose-300" : "text-emerald-300"
                          }`}
                        >
                          {item.outOfStock ? "Sin stock" : "Stock disponible"}
                        </p>
                        <p className="mt-1 text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-sky-200/80">
                          Toca la imagen para cambiar
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleCatalogItemImageUpload(item.id, event)}
                          className="hidden"
                          disabled={uploadingCatalogItemId === item.id}
                        />
                      </label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-sky-300/40 bg-sky-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-100">
                            {uploadingCatalogItemId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Subir imagen
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => handleCatalogItemImageUpload(item.id, event)}
                              className="hidden"
                              disabled={uploadingCatalogItemId === item.id}
                            />
                          </label>
                          <label
                            onClick={(event) => {
                              if (isProPlan) return;
                              event.preventDefault();
                              showProFeatureLocked("Galería de fotos PRO");
                            }}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] ${
                              isProPlan
                                ? "cursor-pointer border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                                : "cursor-not-allowed border-white/10 bg-white/5 text-zinc-400"
                            }`}
                            title={isProPlan ? "Agregar foto extra a la galería" : "Disponible en plan PRO"}
                          >
                            {isProPlan ? <ImagePlus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                            Foto extra
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(event) => handleCatalogItemGalleryUploadBatch(item.id, event)}
                              className="hidden"
                              disabled={!isProPlan || uploadingCatalogItemId === item.id}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              patchCatalogItem(item.id, {
                                imageUrl: "",
                                galleryImageUrls: [],
                              })
                            }
                            className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-100"
                          >
                            Quitar imagen
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mergeGalleryImages(item.galleryImageUrls || []).map((galleryImage, galleryIndex, galleryList) => (
                            <div key={`${item.id}-${galleryImage}`} className="relative">
                              <img
                                src={galleryImage}
                                alt="Galeria"
                                className="h-10 w-10 rounded-lg border border-white/15 object-cover"
                              />
                              <div className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-white/20 bg-black/75 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => moveCatalogGalleryImage(item.id, galleryImage, "left")}
                                  className="inline-flex h-4 w-4 items-center justify-center rounded bg-white/10 text-white disabled:opacity-35"
                                  disabled={!isProPlan || galleryIndex === 0}
                                  title="Mover izquierda"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveCatalogGalleryImage(item.id, galleryImage, "right")}
                                  className="inline-flex h-4 w-4 items-center justify-center rounded bg-white/10 text-white disabled:opacity-35"
                                  disabled={!isProPlan || galleryIndex === galleryList.length - 1}
                                  title="Mover derecha"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeCatalogGalleryImage(item.id, galleryImage)}
                                className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-red-300/45 bg-red-500/80 text-[9px] font-black text-white"
                                disabled={!isProPlan}
                                title={isProPlan ? "Quitar foto" : "Disponible en plan PRO"}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {item.galleryImageUrls?.length ? (
                            <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-zinc-300">
                              {mergeGalleryImages(item.galleryImageUrls).length}/{MAX_LINK_HUB_ITEM_GALLERY_IMAGES}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        data-catalog-item-title="true"
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.title}
                        onChange={(event) => patchCatalogItem(item.id, { title: event.target.value })}
                        placeholder="Nombre del item"
                      />
                      <label className="space-y-2 rounded-xl border border-white/10 bg-zinc-900/50 px-3 py-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                          Categoria del item
                        </span>
                        <select
                          className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                          value={resolveValidCategoryId(profile.catalogCategories, item.categoryId)}
                          onChange={(event) => patchCatalogItem(item.id, { categoryId: event.target.value })}
                        >
                          {profile.catalogCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.emoji || "•"} {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.price}
                        onChange={(event) => patchCatalogItem(item.id, { price: event.target.value })}
                        placeholder="Precio"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.compareAtPrice || ""}
                        onChange={(event) => patchCatalogItem(item.id, { compareAtPrice: event.target.value })}
                        placeholder="Precio referencial"
                      />
                      <label className="space-y-2 md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                          Descripcion comercial
                        </span>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                          value={item.description}
                          onChange={(event) => patchCatalogItem(item.id, { description: event.target.value })}
                          placeholder="Descripcion"
                        />
                      </label>
                      <label className="space-y-2 md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                          Copy de venta PRO
                        </span>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                          value={item.salesCopy || ""}
                          onChange={(event) => patchCatalogItem(item.id, { salesCopy: event.target.value })}
                          placeholder="Ej: Plato top para cerrar pedidos más rápido."
                          disabled={!isProPlan}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={proSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "pro" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("pro")}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-white">Funciones PRO para vender mas</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    isProPlan
                      ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                      : "border-amber-300/45 bg-amber-400/10 text-amber-100"
                  }`}
                >
                  {isProPlan ? <Sparkles className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  {isProPlan ? "PRO activo" : "Bloqueado en Starter/Business"}
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                En PRO puedes activar testimonios con transicion, copys de venta automáticos por plato/producto,
                galería extra por producto y control de despacho (delivery, recojo o comer en local).
              </p>
              {!isProPlan ? (
                <p className="mt-3 rounded-xl border border-amber-300/35 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100">
                  Estas funciones se muestran como demo, pero solo se habilitan al subir a plan PRO.
                </p>
              ) : null}
              {!isProPlan ? renderInlineProTrialButton("Funciones PRO") : null}

              <article className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                  ROI en tiempo real
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Si conviertes {roiSafeVisits.toLocaleString()} visitas, recuperas el plan con {roiOrdersToRecover} pedidos.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <input
                    className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={roiVisits}
                    onChange={(event) => setRoiVisits(event.target.value)}
                    placeholder="Visitas/mes"
                  />
                  <input
                    className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={roiConversionRate}
                    onChange={(event) => setRoiConversionRate(event.target.value)}
                    placeholder="Conversion %"
                  />
                  <input
                    className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={roiTicketAverage}
                    onChange={(event) => setRoiTicketAverage(event.target.value)}
                    placeholder="Ticket promedio"
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Pedidos estimados</p>
                    <p className="mt-1 text-sm font-black text-white">{roiExpectedOrders}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Facturación estimada</p>
                    <p className="mt-1 text-sm font-black text-emerald-200">S/ {roiExpectedRevenue.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Visitas para recuperar plan</p>
                    <p className="mt-1 text-sm font-black text-amber-200">{roiVisitsToRecover}</p>
                  </div>
                </div>
              </article>
              {renderInlineProTrialButton("ROI en tiempo real PRO")}

              <article className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                  Automatizaciones PRO
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => patchAutomation("autoScheduleEnabled", !profile.automation.autoScheduleEnabled)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                      profile.automation.autoScheduleEnabled
                        ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                        : "border-white/15 bg-white/5 text-zinc-200"
                    }`}
                  >
                    {profile.automation.autoScheduleEnabled ? "✓" : "○"} Horarios automáticos abrir/cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => patchAutomation("hideOutOfStock", !profile.automation.hideOutOfStock)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                      profile.automation.hideOutOfStock
                        ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                        : "border-white/15 bg-white/5 text-zinc-200"
                    }`}
                  >
                    {profile.automation.hideOutOfStock ? "✓" : "○"} Ocultar productos sin stock
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Apertura</span>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.automation.openTime}
                      onChange={(event) => patchAutomation("openTime", event.target.value)}
                      disabled={!profile.automation.autoScheduleEnabled}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Cierre</span>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.automation.closeTime}
                      onChange={(event) => patchAutomation("closeTime", event.target.value)}
                      disabled={!profile.automation.autoScheduleEnabled}
                    />
                  </label>
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                  <button
                    type="button"
                    onClick={() => patchAutomation("promoEnabled", !profile.automation.promoEnabled)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                      profile.automation.promoEnabled
                        ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                        : "border-white/15 bg-white/5 text-zinc-200"
                    }`}
                  >
                    {profile.automation.promoEnabled ? "✓" : "○"} Promociones por franja horaria
                  </button>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <input
                      type="time"
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.automation.promoStart}
                      onChange={(event) => patchAutomation("promoStart", event.target.value)}
                      disabled={!profile.automation.promoEnabled}
                    />
                    <input
                      type="time"
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.automation.promoEnd}
                      onChange={(event) => patchAutomation("promoEnd", event.target.value)}
                      disabled={!profile.automation.promoEnabled}
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={String(profile.automation.promoDiscountPercent)}
                      onChange={(event) =>
                        patchAutomation("promoDiscountPercent", Math.max(0, Math.min(90, Number(event.target.value) || 0)))
                      }
                      placeholder="%"
                      disabled={!profile.automation.promoEnabled}
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.automation.promoLabel}
                      onChange={(event) => patchAutomation("promoLabel", event.target.value)}
                      placeholder="Promo del dia"
                      disabled={!profile.automation.promoEnabled}
                    />
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-violet-300/20 bg-violet-500/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-200">
                    IA de promociones semanales
                  </p>
                  <textarea
                    rows={2}
                    value={profile.automation.weeklyPromoObjective}
                    onChange={(event) => patchAutomation("weeklyPromoObjective", event.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs text-white"
                    placeholder="Objetivo semanal: subir pedidos, ticket promedio, etc."
                  />
                  <button
                    type="button"
                    onClick={generateWeeklyPromotionsWithAI}
                    disabled={isGeneratingWeeklyPromos}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl border border-violet-300/35 bg-violet-400/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.09em] text-violet-100 disabled:opacity-60"
                  >
                    {isGeneratingWeeklyPromos ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    Generar plan semanal IA
                  </button>
                  {profile.automation.weeklyPromoPlan.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-xs text-zinc-200">
                      {profile.automation.weeklyPromoPlan.map((entry, index) => (
                        <li
                          key={`${entry}-${index}`}
                          className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5"
                        >
                          {entry}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
              {renderInlineProTrialButton("Automatizaciones PRO")}

              <article className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                    Métricas clave del dueño
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      setMetricsLoading(true);
                      setMetricsError("");
                      try {
                        const currentUser = auth.currentUser;
                        if (!currentUser) throw new Error("Inicia sesion para ver metricas.");
                        const idToken = await currentUser.getIdToken();
                        const response = await fetch(
                          `/api/linkhub/metrics/summary?profileId=${encodeURIComponent(activeProfileId || currentUser.uid)}&slug=${encodeURIComponent(profile.slug)}`,
                          { headers: { Authorization: `Bearer ${idToken}` } },
                        );
                        const payload = (await response.json().catch(() => ({}))) as { error?: string; summary?: LinkHubMetricsSummary };
                        if (!response.ok) throw new Error(payload?.error || "No se pudo refrescar.");
                        setMetricsSummary(payload.summary || null);
                      } catch (error) {
                        setMetricsError(String((error as { message?: string })?.message || "No se pudo refrescar."));
                      } finally {
                        setMetricsLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-200"
                  >
                    {metricsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
                    Refrescar
                  </button>
                </div>
                {metricsError ? (
                  <p className="mt-2 rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                    {metricsError}
                  </p>
                ) : null}
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Clicks WhatsApp</p>
                    <p className="mt-1 text-sm font-black text-emerald-200">{metricsSummary?.whatsappClicks || 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Pedidos enviados</p>
                    <p className="mt-1 text-sm font-black text-white">{metricsSummary?.totalOrders || 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Hora pico</p>
                    <p className="mt-1 text-sm font-black text-amber-200">
                      {metricsSummary?.peakHours?.[0]?.hour || "--:--"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Top categoría %</p>
                    <p className="mt-1 text-sm font-black text-sky-200">
                      {metricsSummary?.categories?.[0]?.conversionRate?.toFixed(1) || "0.0"}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">Platos más pedidos</p>
                    <div className="mt-2 space-y-1 text-xs">
                      {(metricsSummary?.topDishes || []).slice(0, 4).map((dish) => (
                        <p key={dish.name} className="flex items-center justify-between gap-2 text-zinc-200">
                          <span className="truncate">{dish.name}</span>
                          <span className="font-black text-emerald-200">{dish.quantity}</span>
                        </p>
                      ))}
                      {(metricsSummary?.topDishes || []).length === 0 ? (
                        <p className="text-zinc-500">Aún sin datos.</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">Conversión por categoría</p>
                    <div className="mt-2 space-y-1 text-xs">
                      {(metricsSummary?.categories || []).slice(0, 4).map((category) => (
                        <p key={category.categoryId} className="flex items-center justify-between gap-2 text-zinc-200">
                          <span className="truncate">{category.categoryName}</span>
                          <span className="font-black text-sky-200">{category.conversionRate.toFixed(1)}%</span>
                        </p>
                      ))}
                      {(metricsSummary?.categories || []).length === 0 ? (
                        <p className="text-zinc-500">Aún sin datos.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
              {renderInlineProTrialButton("Métricas PRO")}
              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <article className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                    Testimonios reales (5)
                  </p>
                  <div className="mt-3 space-y-3">
                    {profile.proTestimonials.slice(0, LINK_HUB_PRO_TESTIMONIALS_COUNT).map((testimonial, index) => (
                      <div key={testimonial.id} className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            className="rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                            value={testimonial.author}
                            onChange={(event) => patchProTestimonial(index, { author: event.target.value })}
                            placeholder="Cliente"
                            disabled={!isProPlan}
                          />
                          <input
                            className="rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                            value={testimonial.role}
                            onChange={(event) => patchProTestimonial(index, { role: event.target.value })}
                            placeholder="Contexto"
                            disabled={!isProPlan}
                          />
                          <input
                            className="rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white sm:col-span-2 disabled:opacity-60"
                            value={testimonial.quote}
                            onChange={(event) => patchProTestimonial(index, { quote: event.target.value })}
                            placeholder="Comentario del cliente"
                            disabled={!isProPlan}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                    Opciones de despacho PRO
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {([
                      { id: "delivery", label: "Delivery" },
                      { id: "pickup", label: "Recoger en tienda" },
                      { id: "dinein", label: "Comer en restaurante" },
                    ] as const).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          patchProDeliveryMode(option.id, !profile.proDeliveryModes[option.id])
                        }
                        disabled={!isProPlan}
                        className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          profile.proDeliveryModes[option.id]
                            ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                            : "border-white/15 bg-white/5 text-zinc-200"
                        }`}
                      >
                        {profile.proDeliveryModes[option.id] ? "✓ " : "○ "}
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">
                    Estas opciones se reflejan en el checkout de la carta publicada cuando el perfil está en PRO.
                  </p>
                </article>
              </div>
              {renderInlineProTrialButton("Testimonios y despacho PRO")}
            </div>

            <div
              ref={locationSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "location" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("location")}
              <h2 className="text-xl font-bold text-white mb-5">Ubicacion</h2>
              <div className="grid grid-cols-1 gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Direccion</span>
                  <textarea
                    rows={2}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none"
                    value={profile.location.address}
                    onChange={(event) => patchLocation("address", event.target.value)}
                    placeholder="Av. Principal 123, Ciudad"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Google Maps (link o iframe)</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.mapEmbedUrl}
                    onChange={(event) => patchLocation("mapEmbedUrl", event.target.value)}
                    placeholder="Pega link de Maps o codigo iframe"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Google Maps URL (abrir en app)</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.mapsUrl}
                    onChange={(event) => patchLocation("mapsUrl", event.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Horarios (uno por linea)</span>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none"
                    value={formatMultiline(profile.location.scheduleLines)}
                    onChange={(event) => patchLocation("scheduleLines", parseMultiline(event.target.value))}
                    placeholder="Lunes a Viernes: 10:00 am - 8:00 pm"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Texto boton mapa</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.ctaLabel}
                    onChange={(event) => patchLocation("ctaLabel", event.target.value)}
                    placeholder="Ir ahora"
                  />
                </label>
              </div>
            </div>

            <div
              ref={reservationSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "reservation" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("reservation")}
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Reservas (Business/Pro)</h2>
                  <p className="mt-1 text-xs text-zinc-300">
                    Agrega un cuarto submenu opcional para que el cliente reserve por WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => patchReservation("enabled", !profile.reservation.enabled)}
                  disabled={!canUseReservations}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition disabled:opacity-55 ${
                    profile.reservation.enabled
                      ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                      : "border-white/15 bg-white/5 text-zinc-200"
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  {profile.reservation.enabled ? "Reserva activa" : "Activar reserva"}
                </button>
              </div>

              {!canUseReservations ? (
                <p className="mb-4 rounded-xl border border-amber-300/35 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100">
                  Esta funcion se habilita desde el plan BUSINESS.
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Titulo reserva</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white disabled:opacity-60"
                    value={profile.reservation.title}
                    onChange={(event) => patchReservation("title", event.target.value)}
                    placeholder="Reserva tu mesa"
                    disabled={!canUseReservations}
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Subtitulo</span>
                  <textarea
                    rows={2}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none disabled:opacity-60"
                    value={profile.reservation.subtitle}
                    onChange={(event) => patchReservation("subtitle", event.target.value)}
                    placeholder="Agenda tu reserva en segundos y te confirmamos por WhatsApp."
                    disabled={!canUseReservations}
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Imagen de portada reservas</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-sky-300/40 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-sky-100 disabled:opacity-60">
                      {isUploadingReservationImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Adjuntar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReservationImageUpload}
                        className="hidden"
                        disabled={!canUseReservations || isUploadingReservationImage}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => patchReservation("heroImageUrl", "")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-red-100 disabled:opacity-60"
                      disabled={!canUseReservations || !profile.reservation.heroImageUrl}
                    >
                      <X className="h-4 w-4" />
                      Quitar
                    </button>
                  </div>
                  {profile.reservation.heroImageUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                      <img src={profile.reservation.heroImageUrl} alt="Reserva" className="h-28 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 px-4 py-4 text-xs text-zinc-400">
                      Sin imagen. Puedes subir una foto tematica para potenciar conversion.
                    </div>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Min personas</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white disabled:opacity-60"
                    value={profile.reservation.minPartySize}
                    onChange={(event) => patchReservation("minPartySize", Number(event.target.value) || 1)}
                    disabled={!canUseReservations}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Max personas</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white disabled:opacity-60"
                    value={profile.reservation.maxPartySize}
                    onChange={(event) => patchReservation("maxPartySize", Number(event.target.value) || 12)}
                    disabled={!canUseReservations}
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Horarios disponibles (uno por linea)</span>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none disabled:opacity-60"
                    value={formatMultiline(profile.reservation.slotOptions)}
                    onChange={(event) => patchReservation("slotOptions", parseMultiline(event.target.value))}
                    placeholder={"12:30 pm\n1:30 pm\n7:00 pm\n8:00 pm"}
                    disabled={!canUseReservations}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Texto boton</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white disabled:opacity-60"
                    value={profile.reservation.ctaLabel}
                    onChange={(event) => patchReservation("ctaLabel", event.target.value)}
                    placeholder="Enviar reserva"
                    disabled={!canUseReservations}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Hint de nota</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white disabled:opacity-60"
                    value={profile.reservation.notePlaceholder}
                    onChange={(event) => patchReservation("notePlaceholder", event.target.value)}
                    placeholder="Celebracion, terraza, alergias..."
                    disabled={!canUseReservations}
                  />
                </label>

                <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">
                      Anticipo opcional (PRO)
                    </p>
                    <button
                      type="button"
                      onClick={() => patchReservation("requiresDeposit", !profile.reservation.requiresDeposit)}
                      disabled={!canUseReservations}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] disabled:opacity-50 ${
                        profile.reservation.requiresDeposit
                          ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-100"
                          : "border-white/15 bg-white/5 text-zinc-200"
                      }`}
                    >
                      {profile.reservation.requiresDeposit ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                      {profile.reservation.requiresDeposit ? "Anticipo activo" : "Solicitar anticipo"}
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <input
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.reservation.depositAmount}
                      onChange={(event) => patchReservation("depositAmount", event.target.value)}
                      placeholder="Ej: S/ 30 por mesa"
                      disabled={!canUseReservations || !profile.reservation.requiresDeposit}
                    />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white disabled:opacity-60"
                      value={profile.reservation.depositInstructions}
                      onChange={(event) => patchReservation("depositInstructions", event.target.value)}
                      placeholder="Yape o Plin para confirmar reserva."
                      disabled={!canUseReservations || !profile.reservation.requiresDeposit}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={themesSectionRef}
              className={`rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7 ${
                mobileEditorSection !== "themes" ? "hidden md:block" : ""
              }`}
            >
              {renderMobileSectionBack("themes")}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">
                  {isRestaurantProfile ? "Temas oficiales · Carta Digital" : "Tema visual deluxe"}
                </h2>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isRestaurantProfile ? `${CARTA_THEME_OPTIONS.length} temas gastronómicos` : `${Object.keys(LINK_HUB_THEME_STYLES).length} temas totales`}
                </div>
              </div>
              {isRestaurantProfile ? (
                <p className="mb-4 text-xs text-zinc-300">
                  Diseños visuales inspirados en las demos de la landing: portada, perfil, botones, chips y tipografía con estilo premium.
                </p>
              ) : (
                <p className="mb-4 text-xs text-zinc-300">
                  Categoria activa:{" "}
                  <span className="font-bold uppercase tracking-[0.08em] text-amber-200">
                    {LINK_HUB_THEME_CATEGORY_LABELS[activeThemeCategory]}
                  </span>{" "}
                  ({availableThemeKeys.length} temas exclusivos)
                </p>
              )}

              <div className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-100 hover:border-amber-300/40 hover:text-amber-100"
                      onClick={() => {
                        const suggestedThemeId = recommendCartaThemeIdByRubro(
                          profile.categoryLabel || "Restaurante / Cafeteria",
                        );
                        setProfile((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            cartaThemeId: suggestedThemeId,
                          };
                        });
                      }}
                    >
                      Sugerir por rubro
                    </button>
                    <div className="inline-flex rounded-xl border border-white/10 bg-black/25 p-1">
                      <button
                        type="button"
                        onClick={() => patchProfile("cartaBackgroundMode", "white")}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                          resolvedCartaBackgroundMode === "white"
                            ? "bg-white text-zinc-900 shadow-[0_8px_18px_-14px_rgba(255,255,255,0.8)]"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        Fondo blanco
                      </button>
                      <button
                        type="button"
                        onClick={() => patchProfile("cartaBackgroundMode", "theme")}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                          resolvedCartaBackgroundMode === "theme"
                            ? "bg-amber-400/15 text-amber-100 shadow-[0_8px_18px_-14px_rgba(250,204,21,0.7)]"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        Fondo del tema
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-500/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-fuchsia-100">
                        Creador RGB de Carta Digital
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (!ensureCanCustomizeCartaRgb()) return;
                          setProfile((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              cartaThemeId: "rgb_creator",
                            };
                          });
                        }}
                        className="rounded-xl border border-fuchsia-300/35 bg-fuchsia-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-fuchsia-100"
                        disabled={!canCustomizeColors}
                      >
                        Activar RGB
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-zinc-300">
                      Crea un diseño propio con RGB personalizable y aplica variantes visuales distintas.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {CARTA_RGB_PRESET_OPTIONS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            if (!ensureCanCustomizeCartaRgb()) return;
                            setProfile((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                cartaThemeId: "rgb_creator",
                                cartaCustomPrimaryColor: preset.primary,
                                cartaCustomSecondaryColor: preset.secondary,
                                cartaCustomAccentColor: preset.accent,
                                cartaCustomDesignStyle: preset.style,
                              };
                            });
                          }}
                          disabled={!canCustomizeColors}
                          className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-[11px] font-bold text-zinc-100 transition hover:border-fuchsia-300/45 disabled:opacity-60"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <label className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">Primario</span>
                        <input
                          type="color"
                          className="h-10 w-full rounded-xl border border-white/15 bg-zinc-900"
                          value={resolvedCartaCustomPrimary}
                          onChange={(event) =>
                            patchCartaCustomColor("cartaCustomPrimaryColor", event.target.value, CARTA_CUSTOM_DEFAULTS.primary)
                          }
                          disabled={!canCustomizeColors}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">Secundario</span>
                        <input
                          type="color"
                          className="h-10 w-full rounded-xl border border-white/15 bg-zinc-900"
                          value={resolvedCartaCustomSecondary}
                          onChange={(event) =>
                            patchCartaCustomColor("cartaCustomSecondaryColor", event.target.value, CARTA_CUSTOM_DEFAULTS.secondary)
                          }
                          disabled={!canCustomizeColors}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300">Acento</span>
                        <input
                          type="color"
                          className="h-10 w-full rounded-xl border border-white/15 bg-zinc-900"
                          value={resolvedCartaCustomAccent}
                          onChange={(event) =>
                            patchCartaCustomColor("cartaCustomAccentColor", event.target.value, CARTA_CUSTOM_DEFAULTS.accent)
                          }
                          disabled={!canCustomizeColors}
                        />
                      </label>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {CARTA_CUSTOM_STYLE_OPTIONS.map((option) => {
                        const active = resolvedCartaCustomStyle === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => patchCartaCustomStyle(option.value)}
                            disabled={!canCustomizeColors}
                            className={`rounded-xl border px-3 py-2 text-left transition ${
                              active
                                ? "border-fuchsia-300/60 bg-fuchsia-400/10"
                                : "border-white/10 bg-black/20 hover:border-white/20"
                            }`}
                          >
                            <p className="text-xs font-bold text-zinc-100">{option.label}</p>
                            <p className="mt-0.5 text-[10px] text-zinc-400">{option.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {CARTA_THEME_OPTIONS.map((themeOption) => {
                      const isActive = resolvedCartaThemeId === themeOption.id;
                      const isPremiumTheme = Boolean(themeOption.premium);
                      const canUseTheme = !isPremiumTheme || canUsePremiumThemes;
                      return (
                        <button
                          key={themeOption.id}
                          type="button"
                          onClick={() => {
                            if (!canUseTheme) {
                              setMessage({
                                type: "error",
                                text: "Este tema premium se desbloquea en BUSINESS/PRO.",
                              });
                              return;
                            }
                            setProfile((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                cartaThemeId: themeOption.id,
                              };
                            });
                          }}
                          disabled={!canUseTheme}
                          className={`overflow-hidden rounded-2xl border text-left transition-all ${
                            isActive
                              ? "border-amber-300/80 bg-amber-400/10 shadow-[0_14px_36px_-22px_rgba(250,204,21,0.6)]"
                              : canUseTheme
                                ? "border-white/10 bg-black/40 hover:-translate-y-0.5 hover:border-white/25"
                                : "border-amber-300/35 bg-amber-300/5 opacity-75"
                          }`}
                          title={
                            canUseTheme
                              ? `${themeOption.name} (${themeOption.rubro})`
                              : `${themeOption.name} - Premium BUSINESS/PRO`
                          }
                        >
                          <div className="h-28 w-full overflow-hidden border-b border-white/10">
                            <img
                              src={themeOption.previewImage}
                              alt={themeOption.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="space-y-2 p-3">
                            <div className="inline-flex items-center gap-2">
                              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">
                                {themeOption.premium ? "Premium" : themeOption.official ? "Oficial" : "Extra"}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                                {themeOption.rubro}
                              </span>
                            </div>
                            <p className="text-lg font-black text-white">{themeOption.name}</p>
                            <p className="line-clamp-2 text-xs text-zinc-300">{themeOption.previewDescription}</p>
                            <div className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-bold text-zinc-100">
                              {canUseTheme ? "Aplicar tema" : "Premium BUSINESS/PRO"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.14)" : activeCartaTheme.tokens.border,
                      background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.surface,
                    }}
                  >
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.18em]"
                      style={{ color: useWhiteCartaBackground ? "#64748b" : activeCartaTheme.tokens.mutedText }}
                    >
                      Preview tema carta
                    </p>
                    <div
                      className="mt-2 rounded-xl border px-3 py-2 text-sm font-semibold"
                      style={{
                        borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.border,
                        background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.gradientHero,
                        color: useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.text,
                      }}
                    >
                      {activeCartaTheme.name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className="rounded-full border px-3 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.chipBorder,
                          background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.chipBg,
                          color: useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.chipText,
                        }}
                      >
                        Ceviches
                      </span>
                      <span
                        className="rounded-full border px-3 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.chipBorder,
                          background: activeCartaTheme.tokens.chipActiveBg,
                          color: activeCartaTheme.tokens.chipActiveText,
                        }}
                      >
                        Sudados
                      </span>
                    </div>
                    <div
                      className="mt-2 rounded-xl border px-3 py-2 text-sm font-bold"
                      style={{
                        borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.chipBorder,
                        background: activeCartaTheme.tokens.buttonBg,
                        color: activeCartaTheme.tokens.buttonText,
                      }}
                    >
                      Agregar al carrito
                    </div>
                    <div
                      className="mt-2 grid grid-cols-3 gap-1 rounded-xl border p-1"
                      style={{
                        borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.border,
                        background: useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.navBg,
                      }}
                    >
                      <span
                        className="rounded-lg px-2 py-1 text-center text-[10px] font-bold"
                        style={{ background: activeCartaTheme.tokens.navActiveBg, color: activeCartaTheme.tokens.navActiveText }}
                      >
                        Contacto
                      </span>
                      <span
                        className="rounded-lg px-2 py-1 text-center text-[10px] font-bold"
                        style={{ color: useWhiteCartaBackground ? "#334155" : activeCartaTheme.tokens.navText }}
                      >
                        Carta
                      </span>
                      <span
                        className="rounded-lg px-2 py-1 text-center text-[10px] font-bold"
                        style={{ color: useWhiteCartaBackground ? "#334155" : activeCartaTheme.tokens.navText }}
                      >
                        Ubicacion
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!isRestaurantProfile && (
                <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {availableThemeKeys.map((themeKey, index) => {
                  const theme = LINK_HUB_THEME_STYLES[themeKey];
                  const active = profile.theme === themeKey;
                  const canUseTheme = isThemeAllowedForPlan(activePlan, index);

                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => {
                        if (!canUseTheme) {
                          setMessage({
                            type: "error",
                            text: "Tu plan FREE permite 3 temas por categoria. Actualiza a BUSINESS para desbloquear todos.",
                          });
                          return;
                        }
                        applyTheme(themeKey);
                      }}
                      disabled={!canUseTheme}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-amber-300/80 bg-amber-400/10"
                          : "border-white/10 bg-black/30 hover:border-white/20"
                      }`}
                    >
                      <div
                        className="h-12 rounded-xl"
                        style={{
                          background: `linear-gradient(115deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        }}
                      />
                      <p className="mt-3 text-sm font-bold text-white">{theme.label}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-400">{themeKey}</p>
                      {!canUseTheme && (
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300">
                          Premium (BUSINESS/PRO)
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-zinc-300">
                  <Palette className="w-4 h-4" />
                  Personaliza colores (Primario + Secundario)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Color primario</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-11 w-14 rounded-xl border border-white/15 bg-zinc-900"
                        value={normalizeHexColor(profile.themePrimaryColor, activeTheme.preset.primary)}
                        onChange={(event) => {
                          if (!canCustomizeColors) {
                            setMessage({
                              type: "error",
                              text: "La personalización avanzada de colores requiere plan BUSINESS o PRO.",
                            });
                            return;
                          }
                          patchProfile("themePrimaryColor", event.target.value);
                        }}
                        disabled={!canCustomizeColors}
                      />
                      <input
                        className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={profile.themePrimaryColor || ""}
                        onChange={(event) => {
                          if (!canCustomizeColors) return;
                          patchProfile("themePrimaryColor", event.target.value);
                        }}
                        onBlur={(event) =>
                          canCustomizeColors
                            ? patchProfile(
                                "themePrimaryColor",
                                normalizeHexColor(event.target.value, activeTheme.preset.primary),
                              )
                            : undefined
                        }
                        placeholder="#fbbf24"
                        disabled={!canCustomizeColors}
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Color secundario</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-11 w-14 rounded-xl border border-white/15 bg-zinc-900"
                        value={normalizeHexColor(profile.themeSecondaryColor, activeTheme.preset.secondary)}
                        onChange={(event) => {
                          if (!canCustomizeColors) {
                            setMessage({
                              type: "error",
                              text: "La personalización avanzada de colores requiere plan BUSINESS o PRO.",
                            });
                            return;
                          }
                          patchProfile("themeSecondaryColor", event.target.value);
                        }}
                        disabled={!canCustomizeColors}
                      />
                      <input
                        className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={profile.themeSecondaryColor || ""}
                        onChange={(event) => {
                          if (!canCustomizeColors) return;
                          patchProfile("themeSecondaryColor", event.target.value);
                        }}
                        onBlur={(event) =>
                          canCustomizeColors
                            ? patchProfile(
                                "themeSecondaryColor",
                                normalizeHexColor(event.target.value, activeTheme.preset.secondary),
                              )
                            : undefined
                        }
                        placeholder="#f97316"
                        disabled={!canCustomizeColors}
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-300">
                    Color de texto publico
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Elige como se veran titulos, etiquetas y textos en la Carta Digital publicada.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TEXT_TONE_OPTIONS.map((option) => {
                      const active = profile.textTone === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => patchProfile("textTone", option.value)}
                          className={`rounded-xl border px-3 py-2 text-left transition ${
                            active ? "border-amber-300/70 bg-amber-400/12" : "border-white/10 bg-black/20 hover:border-white/20"
                          }`}
                        >
                          <p className="text-sm font-bold text-white">{option.label}</p>
                          <p className="mt-0.5 text-[11px] text-zinc-300">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTheme(activeTheme.key)}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.13em] text-white"
                  >
                    Reset del tema
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canCustomizeColors) {
                        setMessage({
                          type: "error",
                          text: "El modo RGB avanzado requiere plan BUSINESS o PRO.",
                        });
                        return;
                      }
                      const randomPrimary = randomColorHex();
                      const randomSecondary = randomColorHex();
                      setProfile((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          theme: "rgb",
                          themePrimaryColor: randomPrimary,
                          themeSecondaryColor: randomSecondary,
                        };
                      });
                    }}
                    className="rounded-xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.13em] text-fuchsia-100"
                    disabled={!canCustomizeColors}
                  >
                    RGB aleatorio
                  </button>
                </div>
              </div>
                </>
              )}
            </div>

          </section>

          <aside
            className={`fixed inset-x-0 top-[7.55rem] z-30 min-w-0 px-3 md:static md:px-0 xl:h-fit xl:sticky xl:top-28 xl:w-[560px] xl:justify-self-end ${
              isMobileEditorOverlayActive ? "hidden md:block" : ""
            }`}
          >
            <div className="md:flex md:items-start md:justify-end md:gap-3">
            <div
              className="mx-auto w-full max-w-[450px] rounded-[2rem] border p-3.5 xl:max-w-[560px] xl:p-3"
              style={previewShellStyle}
              onClick={handleMobilePreviewTapCloseMenu}
            >
              <div className="flex min-h-[31rem] flex-col overflow-hidden rounded-[1.85rem] border" style={previewPanelStyle}>
                <p className="px-4 pt-4 text-[10px] uppercase tracking-[0.25em] font-black" style={{ color: previewTextMuted }}>
                  Preview Mobile
                </p>

                <div className="mt-2 border-b px-3 py-3" style={previewHeaderStyle}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex min-w-0 items-center gap-2">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.displayName}
                          className="h-8 w-8 rounded-full border object-cover"
                          style={{ borderColor: previewMenuBorder }}
                        />
                      ) : (
                        <div
                          className="h-8 w-8 rounded-full border flex items-center justify-center text-[11px] font-black"
                          style={{ borderColor: previewMenuBorder, background: previewMenuGradientSoft, color: previewTextBase }}
                        >
                          {(profile.displayName || "N").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <p className="truncate text-xs font-semibold" style={{ color: previewTextBase }}>
                        {profile.displayName || "Nombre del negocio"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: previewMenuBorder,
                        background: useWhiteCartaBackground
                          ? previewMenuGradientSoft
                          : activeCartaTheme.tokens.buttonSecondaryBg,
                        color: previewTextBase,
                      }}
                      aria-label="Compartir"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative h-28 overflow-hidden">
                  {previewCoverUrl ? (
                    <img src={previewCoverUrl} alt="Portada" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full" style={{ background: previewMenuGradientSoft }} />
                  )}
                  <div className="absolute inset-x-0 -bottom-8 flex justify-center">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="h-16 w-16 rounded-full border-[3px] border-white object-cover"
                        style={{ boxShadow: "0 12px 20px -16px rgba(15,23,42,0.45)" }}
                      />
                    ) : (
                      <div
                        className="h-16 w-16 rounded-full border-[3px] border-white flex items-center justify-center text-xl font-black text-slate-700"
                        style={{ background: previewMenuGradientSoft, boxShadow: "0 12px 20px -16px rgba(15,23,42,0.45)" }}
                      >
                        <ImagePlus className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pt-10 pb-2 text-center">
                  <h3 className="text-[1.55rem] font-black leading-tight" style={{ color: previewTextBase }}>
                    {highlightLastWord(profile.displayName || "Tu negocio", activeCartaTheme.tokens.primary)}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: activeCartaTheme.tokens.accent }}>
                    {profile.categoryLabel || "Restaurante"}
                  </p>
                </div>

                <div className="px-4 pb-2">
                  <p className="text-center text-xs font-black uppercase tracking-[0.14em]" style={{ color: activeCartaTheme.tokens.primary }}>
                    {previewTab === "catalog"
                      ? catalogLabel || "Carta"
                      : previewTab === "contact"
                        ? profile.sectionLabels.contact
                        : previewTab === "location"
                          ? profile.sectionLabels.location
                          : reservationLabel}
                  </p>
                  {previewTab === "catalog" ? (
                    <>
                      <label className="mt-2 flex items-center gap-2 rounded-[0.95rem] border px-3 py-2" style={previewSearchStyle}>
                        <Search className="h-3.5 w-3.5" style={{ color: previewPlaceholderText }} />
                        <input
                          value={previewSearch}
                          onChange={(event) => setPreviewSearch(event.target.value)}
                          placeholder="Buscar en la carta..."
                          className="w-full bg-transparent text-xs focus:outline-none"
                          style={{ color: previewInputText }}
                        />
                      </label>
                      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
                        {previewCategoryTabs.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setPreviewCategoryId(category.id)}
                            className="shrink-0 rounded-[0.85rem] border px-2.5 py-1.5 text-[10px] font-bold"
                            style={previewCategoryId === category.id ? previewChipActiveStyle : previewChipBaseStyle}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

                {previewTab === "catalog" ? (
                  <div className="space-y-2.5 px-4 pb-3">
                    {previewVisibleItems.length > 0 ? (
                      previewVisibleItems.map((item) => (
                        <article key={item.id} className="rounded-[1rem] border p-2.5" style={previewItemCardStyle}>
                          <div className="flex gap-2.5">
                            <label
                              className={`h-20 w-20 shrink-0 overflow-hidden rounded-[0.8rem] border ${
                                uploadingCatalogItemId === item.id
                                  ? "cursor-not-allowed opacity-70"
                                  : "cursor-pointer transition hover:brightness-110"
                              }`}
                              style={{ borderColor: previewMenuBorder }}
                              title="Toca la imagen para subir/cambiar foto"
                            >
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="h-20 w-20 rounded-[0.8rem] object-cover" />
                              ) : (
                                <div
                                  className="h-20 w-20 rounded-[0.8rem] border flex items-center justify-center text-[10px] font-black"
                                  style={{ borderColor: previewMenuBorder, color: previewTextMuted }}
                                >
                                  ITEM
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleCatalogItemImageUpload(item.id, event)}
                                className="hidden"
                                disabled={uploadingCatalogItemId === item.id}
                              />
                            </label>
                            <div className="min-w-0 flex-1">
                              <input
                                value={item.title}
                                onChange={(event) => patchCatalogItem(item.id, { title: event.target.value })}
                                placeholder="Nombre del item"
                                className="w-full truncate rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[15px] font-extrabold focus:border-[var(--carta-input-border)] focus:outline-none"
                                style={{ color: previewTextBase }}
                              />
                              <input
                                value={item.description}
                                onChange={(event) => patchCatalogItem(item.id, { description: event.target.value })}
                                placeholder="Descripcion comercial"
                                className="mt-0.5 w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] focus:border-[var(--carta-input-border)] focus:outline-none"
                                style={{ color: previewTextMuted }}
                              />
                              <div className="mt-1.5 flex items-center gap-1 text-[14px] font-black" style={{ color: activeCartaTheme.tokens.primary }}>
                                <span>S/</span>
                                <input
                                  value={item.price}
                                  onChange={(event) => patchCatalogItem(item.id, { price: event.target.value })}
                                  placeholder="0.00"
                                  className="w-24 rounded-md border border-transparent bg-transparent px-1 py-0.5 focus:border-[var(--carta-input-border)] focus:outline-none"
                                  style={{ color: activeCartaTheme.tokens.primary }}
                                />
                              </div>
                              <label className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-md border border-sky-300/40 bg-sky-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-sky-100">
                                <Upload className="h-3 w-3" />
                                Foto
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => handleCatalogItemImageUpload(item.id, event)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div
                        className="rounded-[0.95rem] border border-dashed px-3 py-4 text-center text-[11px]"
                        style={{
                          borderColor: useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.border,
                          color: previewTextMuted,
                        }}
                      >
                        No hay items para el filtro actual.
                      </div>
                    )}
                  </div>
                ) : previewTab === "contact" ? (
                  <div className="space-y-3 px-4 pb-3">
                    <article className="rounded-[0.95rem] border p-3" style={previewItemCardStyle}>
                      <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: activeCartaTheme.tokens.primary }}>
                        {profile.sectionLabels.contact}
                      </p>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(event) => patchProfile("bio", event.target.value)}
                        placeholder="Describe brevemente lo que ofreces."
                        className="mt-2 w-full resize-none rounded-lg border border-transparent bg-transparent px-1 py-1 text-[11px] focus:border-[var(--carta-input-border)] focus:outline-none"
                        style={{ color: previewTextMuted }}
                      />
                    </article>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-[0.8rem] border px-2 py-2 text-[10px] font-bold uppercase" style={previewChipBaseStyle}>
                        <Upload className="h-3.5 w-3.5" />
                        Portada
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleCoverUpload}
                          className="hidden"
                          disabled={isUploadingCover}
                        />
                      </label>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-[0.8rem] border px-2 py-2 text-[10px] font-bold uppercase" style={previewChipBaseStyle}>
                        <Upload className="h-3.5 w-3.5" />
                        Perfil
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isUploadingAvatar}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <a
                        href={previewContactPhone ? `tel:${previewContactPhone}` : "#"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.85rem] border text-[11px] font-bold"
                        style={previewChipActiveStyle}
                        onClick={(event) => {
                          if (!previewContactPhone) event.preventDefault();
                        }}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Llamar ahora
                      </a>
                      <a
                        href={previewContactWhatsappDigits ? buildWhatsappSendUrl(previewContactWhatsappDigits) : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.85rem] border text-[11px] font-bold"
                        style={previewChipActiveStyle}
                        onClick={(event) => {
                          if (!previewContactWhatsappDigits) event.preventDefault();
                        }}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Escribir ahora
                      </a>
                    </div>
                  </div>
                ) : previewTab === "location" ? (
                  <div className="space-y-2 px-4 pb-3">
                    <div className="overflow-hidden rounded-[0.95rem] border" style={previewItemCardStyle}>
                      {previewNormalizedLocation.mapEmbedUrl ? (
                        <iframe
                          title={`Mapa de ${profile.displayName}`}
                          src={previewNormalizedLocation.mapEmbedUrl}
                          className="h-40 w-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center px-4 text-center text-[11px]" style={{ color: previewTextMuted }}>
                          Agrega enlace de Google Maps para mostrar el mapa.
                        </div>
                      )}
                    </div>
                    <input
                      value={profile.location.address}
                      onChange={(event) => patchLocation("address", event.target.value)}
                      placeholder="Direccion del negocio"
                      className="w-full rounded-[0.85rem] border px-3 py-2 text-[12px] font-semibold focus:outline-none"
                      style={previewSearchStyle}
                    />
                    <input
                      value={profile.location.mapEmbedUrl}
                      onChange={(event) => patchLocation("mapEmbedUrl", event.target.value)}
                      placeholder="Google Maps embed o link"
                      className="w-full rounded-[0.85rem] border px-3 py-2 text-[11px] focus:outline-none"
                      style={previewSearchStyle}
                    />
                    <textarea
                      rows={2}
                      value={formatMultiline(profile.location.scheduleLines)}
                      onChange={(event) => patchLocation("scheduleLines", parseMultiline(event.target.value))}
                      placeholder="Horarios por linea"
                      className="w-full resize-none rounded-[0.85rem] border px-3 py-2 text-[11px] focus:outline-none"
                      style={previewSearchStyle}
                    />
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <input
                        value={profile.location.ctaLabel}
                        onChange={(event) => patchLocation("ctaLabel", event.target.value)}
                        placeholder="Texto boton"
                        className="w-full rounded-[0.85rem] border px-3 py-2 text-[11px] focus:outline-none"
                        style={previewSearchStyle}
                      />
                      <a
                        href={previewNormalizedLocation.mapsUrl && isValidExternalUrl(previewNormalizedLocation.mapsUrl) ? previewNormalizedLocation.mapsUrl : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-[0.85rem] border px-3 py-2 text-[11px] font-bold"
                        style={previewChipActiveStyle}
                        onClick={(event) => {
                          if (!previewNormalizedLocation.mapsUrl || !isValidExternalUrl(previewNormalizedLocation.mapsUrl)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        {profile.location.ctaLabel || "Ir ahora"}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-4 pb-3">
                    <article className="overflow-hidden rounded-[0.95rem] border" style={previewItemCardStyle}>
                      {profile.reservation.heroImageUrl ? (
                        <img
                          src={profile.reservation.heroImageUrl}
                          alt="Reservas"
                          className="h-24 w-full object-cover"
                        />
                      ) : null}
                      <div className="space-y-2 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: activeCartaTheme.tokens.primary }}>
                          {profile.reservation.title || "Reserva premium"}
                        </p>
                        <p className="text-[11px]" style={{ color: previewTextMuted }}>
                          {profile.reservation.subtitle || "Agenda tu mesa por WhatsApp."}
                        </p>
                        <div className="rounded-[0.8rem] border px-2 py-1 text-[10px] font-bold" style={previewChipBaseStyle}>
                          {profile.reservation.slotOptions[0] || "Sin horario"}
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-[0.8rem] border px-2 py-1 text-[10px] font-bold" style={previewChipBaseStyle}>
                          <Users className="h-3 w-3" />
                          {profile.reservation.minPartySize}-{profile.reservation.maxPartySize} personas
                        </div>
                        {profile.reservation.requiresDeposit ? (
                          <div className="rounded-[0.8rem] border px-2 py-1 text-[10px] font-bold" style={previewChipBaseStyle}>
                            Anticipo: {profile.reservation.depositAmount || "A coordinar"}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </div>
                )}

                <div className="px-3 pb-3">
                  <div
                    className="grid gap-1 rounded-[1rem] border p-1"
                    style={{
                      ...previewBottomNavStyle,
                      gridTemplateColumns: `repeat(${previewReservationEnabled ? 4 : 3}, minmax(0, 1fr))`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewTab("contact")}
                      className="h-11 rounded-[0.8rem] text-[10px] font-black uppercase"
                      style={previewTab === "contact" ? previewChipActiveStyle : { color: previewNavText }}
                    >
                      {profile.sectionLabels.contact}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("catalog")}
                      className="h-11 rounded-[0.8rem] text-[10px] font-black uppercase"
                      style={previewTab === "catalog" ? previewChipActiveStyle : { color: previewNavText }}
                    >
                      {catalogLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("location")}
                      className="h-11 rounded-[0.8rem] text-[10px] font-black uppercase"
                      style={previewTab === "location" ? previewChipActiveStyle : { color: previewNavText }}
                    >
                      {profile.sectionLabels.location}
                    </button>
                    {previewReservationEnabled ? (
                      <button
                        type="button"
                        onClick={() => setPreviewTab("reservation")}
                        className="h-11 rounded-[0.8rem] text-[10px] font-black uppercase"
                        style={previewTab === "reservation" ? previewChipActiveStyle : { color: previewNavText }}
                      >
                        {reservationLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              {publicUrl && (
                <div
                  className="mt-3 hidden rounded-xl border p-3 text-xs md:block"
                  style={{
                    borderColor: activeCartaTheme.tokens.border,
                    background: activeCartaTheme.tokens.surface2,
                    color: activeCartaTheme.tokens.mutedText,
                  }}
                >
                  <p className="font-bold" style={{ color: activeCartaTheme.tokens.text }}>
                    URL publica
                  </p>
                  <p className="mt-1 break-all">{publicUrl}</p>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-semibold"
                    style={{ color: activeCartaTheme.tokens.primary }}
                  >
                    Abrir pagina
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              <div
                className="mt-3 hidden rounded-xl border p-3 md:block"
                style={{ borderColor: activeCartaTheme.tokens.border, background: activeCartaTheme.tokens.surface2 }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: activeCartaTheme.tokens.mutedText }}>
                  Carta Theme
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: activeCartaTheme.tokens.text }}>
                  {activeCartaTheme.name}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full border px-2 py-1 text-[10px] font-bold" style={previewChipBaseStyle}>
                    Categoria
                  </span>
                  <span className="rounded-full border px-2 py-1 text-[10px] font-bold" style={previewChipActiveStyle}>
                    Activa
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:w-[122px] md:flex-col md:items-stretch md:gap-2 rounded-2xl border border-white/10 bg-zinc-950/70 p-2.5 backdrop-blur-xl">
              <button
                onClick={() => saveProfile("draft")}
                disabled={isSaving || isProcessingImages}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 text-[11px] font-bold text-white"
                title="Guardar borrador"
                aria-label="Guardar borrador"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span className="truncate">Guardar</span>
              </button>
              <button
                onClick={() => saveProfile("publish")}
                disabled={isSaving || isProcessingImages}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 text-[11px] font-bold text-emerald-100"
                title="Publicar Carta Digital"
                aria-label="Publicar Carta Digital"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
                <span className="truncate">Publicar</span>
              </button>
              <button
                onClick={copyPublicUrl}
                disabled={!publicUrl}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-sky-300/40 bg-sky-400/10 px-3 text-[11px] font-bold text-sky-100 disabled:opacity-50"
                title="Copiar URL"
                aria-label="Copiar URL"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="truncate">Copiar</span>
              </button>
            </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

