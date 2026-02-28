"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { db } from "@/lib/firebase";
import {
  assertCanPublishWithMode,
  confirmPublishSlot,
  requestPublishTarget,
  type PublishTargetMode,
} from "@/lib/subscription/publishClient";
import { doc as firestoreDoc, getDoc, setDoc } from "firebase/firestore";
import { injectMetricsTracking } from "@/lib/metricsTracking";
import { resolveStoreSlug, sanitizeStoreSlug } from "@/lib/publicStorefront";
import { getVisualStoreTheme, getVisualStoreVars } from "@/lib/storeVisualTheme";
import { getThemesByVertical } from "@/lib/themes";
import { normalizeVertical, type BusinessVertical } from "@/lib/vertical";
import {
  generateStorefrontHtml,
  STORE_THEMES,
  type StoreFaqItem,
  type StoreConfig,
  type StoreProduct,
  type StoreTestimonial,
  type StoreThemeId,
} from "@/lib/storefrontGenerator";
import {
  EditorProvider,
  ensureAnalyticsDocument,
  publishEditorDraft,
  saveEditorDraft,
  useAutosave,
  useEditorState,
} from "@/editor-core";
import InlineEditable from "@/components/editor/InlineEditable";
import EditorSidebar, { type EditorSidebarTab } from "@/components/editor/EditorSidebar";
import MobilePlanStatusCard from "@/components/subscription/MobilePlanStatusCard";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  Loader2,
  MessageCircle,
  Monitor,
  Plus,
  Rocket,
  Save,
  Sparkles,
  Smartphone,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";

const FIREBASE_PUBLIC_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAkb9GtjFXt2NPjuM_-M41Srd6aUK7Ch2Y",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "fastpage-7ceb3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fastpage-7ceb3",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "fastpage-7ceb3.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "812748660444",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:812748660444:web:4bf4184a13a377bc26de19",
};

type VisualSort = "featured" | "priceAsc" | "priceDesc" | "nameAsc";
type VisualContent = NonNullable<StoreConfig["content"]>;
type EcommerceSettings = NonNullable<StoreConfig["ecommerce"]>;
type AiSettings = NonNullable<StoreConfig["ai"]>;
type CartSettings = NonNullable<StoreConfig["cart"]>;
type WidgetSettings = NonNullable<StoreConfig["widget"]>;
type StoreEditorSnapshot = { config: StoreConfig; products: StoreProduct[] };

const DEFAULT_ECOMMERCE_SETTINGS: EcommerceSettings = {
  deliveryEnabled: true,
  pickupEnabled: true,
  inStoreEnabled: false,
  shippingBaseFeeCents: 1000,
  freeShippingFromCents: 12000,
  yapeEnabled: true,
  plinEnabled: true,
  transferEnabled: true,
  cashEnabled: true,
  cardEnabled: false,
  termsRequired: true,
  termsText: "Acepto terminos y condiciones de compra.",
};

const DEFAULT_AI_SETTINGS: AiSettings = {
  enabled: true,
  mode: "business",
  tone: "comercial",
  promoFocus: "Delivery rapido y cierre por WhatsApp",
  autoCopyEnabled: true,
};

const DEFAULT_CART_SETTINGS: CartSettings = {
  floatingButtonEnabled: true,
  floatingButtonLabel: "Carrito",
};

const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  enabled: false,
  mode: "whatsapp",
  title: "Asistente de tienda",
  welcomeMessage: "Hola, te ayudo con productos, precios y pedidos.",
  assistantPlaceholder: "Escribe tu consulta...",
  ctaLabel: "Abrir chat",
  position: "right",
};

const DEFAULT_TESTIMONIALS: StoreTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Camila Ruiz",
    role: "Cliente frecuente",
    text: "La tienda responde rapido y el pedido llego exacto. Excelente experiencia.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Jorge Salazar",
    role: "Compra semanal",
    text: "El catalogo es claro y pude pagar y coordinar en minutos por WhatsApp.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "Mariana Soto",
    role: "Cliente nuevo",
    text: "Todo bien explicado, envio puntual y productos en perfecto estado.",
    rating: 5,
  },
];

const DEFAULT_FAQ: StoreFaqItem[] = [
  {
    id: "faq-1",
    question: "Cuanto demora el delivery?",
    answer: "Normalmente entre 30 y 60 minutos segun la zona.",
  },
  {
    id: "faq-2",
    question: "Puedo recoger en tienda?",
    answer: "Si, activa Recojo en tienda y coordinamos por WhatsApp.",
  },
  {
    id: "faq-3",
    question: "Que metodos de pago aceptan?",
    answer: "Puedes habilitar Yape, Plin, transferencia, efectivo o tarjeta.",
  },
];

const DEFAULT_CONFIG: StoreConfig = {
  vertical: "ecommerce",
  storeName: "Edita aqui: Nombre de tu tienda",
  tagline: "Escribe aqui una propuesta de valor breve para vender mas.",
  currency: "PEN",
  themeId: "cleanStore",
  primaryCta: "Comprar ahora",
  supportWhatsapp: "51999999999",
  customRgb: {
    accent: { r: 220, g: 38, b: 38 },
    accent2: { r: 248, g: 113, b: 113 },
  },
  content: {
    topStripText: "Edita aqui: envio gratis en compras mayores a S/200",
    kicker: "Edita aqui: ecommerce multirubro",
    heroTitle: "Edita aqui: Coleccion nueva para vender hoy",
    heroSubtitle:
      "Escribe aqui beneficios claros: envio rapido, garantia y pago seguro.",
    heroPrimaryButton: "Explorar productos",
    heroSecondaryButton: "Ver carrito",
    productsTitle: "Edita aqui: Productos destacados",
    productsSubtitle:
      "Escribe aqui una frase comercial para impulsar conversion.",
    tipText: "Edita aqui: soporte rapido por WhatsApp y promociones semanales.",
    offerSectionTitle: "Ofertas especiales",
    searchPlaceholder: "Escribe para buscar producto...",
    scheduleText: "Edita aqui: Atencion 9:00 am - 9:00 pm",
    businessAddress: "Edita aqui: direccion de tienda o punto de retiro",
    heroImageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1800&auto=format&fit=crop",
    logoImageUrl:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=600&auto=format&fit=crop",
    facebookUrl: "https://facebook.com/",
    instagramUrl: "https://instagram.com/",
    tiktokUrl: "https://tiktok.com/",
    whatsappUrl: "https://wa.me/51999999999",
    phoneUrl: "tel:+51999999999",
    footerLeft: "Edita aqui: mensaje final, politicas o copyright.",
    checkoutTitle: "Finaliza tu pedido",
    checkoutButton: "Confirmar pedido",
    continueButton: "Seguir comprando",
  },
  ai: DEFAULT_AI_SETTINGS,
  cart: DEFAULT_CART_SETTINGS,
  widget: DEFAULT_WIDGET_SETTINGS,
  testimonials: DEFAULT_TESTIMONIALS,
  faq: DEFAULT_FAQ,
  ecommerce: DEFAULT_ECOMMERCE_SETTINGS,
};

const DEFAULT_PRODUCTS: StoreProduct[] = [
  {
    id: "prod-urban-sneakers",
    name: "Sneakers Urban Edge",
    description: "Edicion comoda para uso diario y look premium.",
    category: "Ropa",
    priceCents: 15900,
    compareAtPriceCents: 19900,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Oferta",
    ctaLabel: "Ver producto",
    sku: "ROP-001",
    stockQty: 25,
  },
  {
    id: "prod-smartwatch",
    name: "Smartwatch Pulse X",
    description: "Control de salud, notificaciones y bateria extendida.",
    category: "Tech",
    priceCents: 23900,
    compareAtPriceCents: 28900,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Oferta",
    ctaLabel: "Ver oferta",
    sku: "TEC-002",
    stockQty: 18,
  },
  {
    id: "prod-backpack",
    name: "Mochila Tech Pro",
    description: "Espacios organizados para laptop, cableado y accesorios.",
    category: "Accesorios",
    priceCents: 18900,
    compareAtPriceCents: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Top",
    ctaLabel: "Ver producto",
    sku: "ACC-003",
    stockQty: 32,
  },
  {
    id: "prod-headphones",
    name: "Auriculares Air Beat",
    description: "Audio inmersivo con cancelacion de ruido y microfono HD.",
    category: "Tech",
    priceCents: 12900,
    compareAtPriceCents: 15900,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Oferta",
    ctaLabel: "Ver producto",
    sku: "TEC-004",
    stockQty: 14,
  },
  {
    id: "prod-bag",
    name: "Bolso Minimal Leather",
    description: "Diseno elegante para oficina, eventos y uso casual.",
    category: "Ropa",
    priceCents: 17500,
    compareAtPriceCents: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Nuevo",
    ctaLabel: "Ver producto",
    sku: "ROP-005",
    stockQty: 20,
  },
  {
    id: "prod-camera",
    name: "Camara Pocket 4K",
    description: "Ideal para creadores que necesitan grabar en movimiento.",
    category: "Tech",
    priceCents: 35900,
    compareAtPriceCents: 39900,
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Oferta",
    ctaLabel: "Ver producto",
    sku: "TEC-006",
    stockQty: 9,
  },
  {
    id: "prod-glasses",
    name: "Lentes Sunframe",
    description: "Montura ligera con acabado premium y filtro UV.",
    category: "Accesorios",
    priceCents: 8900,
    compareAtPriceCents: 10900,
    imageUrl:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Oferta",
    ctaLabel: "Ver oferta",
    sku: "ACC-007",
    stockQty: 27,
  },
  {
    id: "prod-desk-kit",
    name: "Set Desk Essentials",
    description: "Kit de accesorios para productividad y setup profesional.",
    category: "Accesorios",
    priceCents: 9900,
    compareAtPriceCents: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    active: true,
    badge: "Nuevo",
    ctaLabel: "Ver producto",
    sku: "ACC-008",
    stockQty: 40,
  },
];

function cloneDefaultConfig(): StoreConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as StoreConfig;
}

function cloneDefaultProducts(): StoreProduct[] {
  return DEFAULT_PRODUCTS.map((product) => ({ ...product }));
}

function mergeConfigWithDefaults(input?: StoreConfig, slug?: string): StoreConfig {
  const defaults = cloneDefaultConfig();
  const merged: StoreConfig = {
    ...defaults,
    ...(input || {}),
    content: {
      ...(defaults.content || {}),
      ...((input?.content || {}) as VisualContent),
    },
    ecommerce: {
      ...DEFAULT_ECOMMERCE_SETTINGS,
      ...((input?.ecommerce || {}) as EcommerceSettings),
    },
    ai: {
      ...DEFAULT_AI_SETTINGS,
      ...((input?.ai || {}) as AiSettings),
    },
    cart: {
      ...DEFAULT_CART_SETTINGS,
      ...((input?.cart || {}) as CartSettings),
    },
    widget: {
      ...DEFAULT_WIDGET_SETTINGS,
      ...((input?.widget || {}) as WidgetSettings),
    },
    testimonials:
      Array.isArray(input?.testimonials) && input?.testimonials.length
        ? input.testimonials
        : defaults.testimonials,
    faq:
      Array.isArray(input?.faq) && input?.faq.length
        ? input.faq
        : defaults.faq,
  };
  if (slug) merged.storeSlug = slug;
  merged.vertical = normalizeVertical(merged.vertical || "ecommerce");
  return merged;
}

function mergeProductsWithDefaults(input?: StoreProduct[]): StoreProduct[] {
  if (!Array.isArray(input) || !input.length) return cloneDefaultProducts();
  const defaults = cloneDefaultProducts();
  return input.map((product, index) => ({
    ...defaults[index % defaults.length],
    ...product,
    id: product.id || newId("prod-"),
    active: product.active !== false,
  }));
}

function newId(prefix = "") {
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}${rand}` : rand;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function formatMoney(cents: number, currency: StoreConfig["currency"]) {
  const v = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(v);
  } catch {
    return `${v.toFixed(2)} ${currency}`;
  }
}

function isOfferProduct(product: StoreProduct) {
  const badge = String(product.badge || "").toLowerCase();
  return (product.compareAtPriceCents || 0) > (product.priceCents || 0) || badge.includes("oferta");
}

function sortProducts(items: StoreProduct[], sort: VisualSort) {
  if (sort === "priceAsc") return [...items].sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
  if (sort === "priceDesc") return [...items].sort((a, b) => (b.priceCents || 0) - (a.priceCents || 0));
  if (sort === "nameAsc") return [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));
  return items;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(rgb?: { r: number; g: number; b: number }) {
  const r = (rgb?.r || 0).toString(16).padStart(2, "0");
  const g = (rgb?.g || 0).toString(16).padStart(2, "0");
  const b = (rgb?.b || 0).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

const SOFT_INPUT_BORDER = "#ecf1f7";
const DARK_FORM_FIELD_CLASS =
  "bg-zinc-700/95 text-white placeholder:text-zinc-300";

function isPermissionDeniedError(error: unknown) {
  const message = String((error as any)?.message || "").toLowerCase();
  const code = String((error as any)?.code || "").toLowerCase();
  return (
    message.includes("permission") ||
    message.includes("insufficient") ||
    code.includes("permission-denied")
  );
}

function scopedStoreProjectKey(userId: string) {
  return `fastpage_store_project_id:${userId}`;
}

function sanitizeDemoValue(value: string | null) {
  return String(value || "")
    .trim()
    .replace(/[^\w-]/g, "");
}

async function compressImage(file: File, maxSide = 1400, quality = 0.84) {
  const data = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(new Error("No se pudo leer la imagen."));
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("No se pudo procesar la imagen."));
    i.src = data;
  });
  const ratio = img.width / img.height;
  let width = img.width;
  let height = img.height;
  if (Math.max(width, height) > maxSide) {
    if (ratio >= 1) {
      width = maxSide;
      height = Math.round(maxSide / ratio);
    } else {
      height = maxSide;
      width = Math.round(maxSide * ratio);
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function StorePage() {
  return (
    <EditorProvider<StoreEditorSnapshot>
      projectId="store-draft"
      projectType="store"
      initialStatus="draft"
      initialData={{ config: cloneDefaultConfig(), products: cloneDefaultProducts() }}
    >
      <StoreEditorPage />
    </EditorProvider>
  );
}

function StoreEditorPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { summary: subscriptionSummary } = useSubscription(Boolean(user?.uid));
  const router = useRouter();
  const hydratedRef = useRef(false);
  const demoThemeAppliedRef = useRef(false);
  const offerCarouselRef = useRef<HTMLDivElement | null>(null);
  const {
    state: editorState,
    setProjectMeta,
    replaceData,
    markSaved,
    setError: setEditorError,
  } = useEditorState<StoreEditorSnapshot>();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectPublished, setProjectPublished] = useState(false);
  const [config, setConfig] = useState<StoreConfig>(() => cloneDefaultConfig());
  const [products, setProducts] = useState<StoreProduct[]>(() => cloneDefaultProducts());

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");
  const [activeSidebarTab, setActiveSidebarTab] = useState<EditorSidebarTab>("content");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<VisualSort>("featured");

  const [loadingProject, setLoadingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [demoThemeIntent, setDemoThemeIntent] = useState("");

  const liveConfig = editorState.previewData?.config || config;
  const liveProducts = editorState.previewData?.products || products;
  const content = (liveConfig.content || {}) as VisualContent;
  const ecommerce = {
    ...DEFAULT_ECOMMERCE_SETTINGS,
    ...((liveConfig.ecommerce || {}) as EcommerceSettings),
  };
  const ai = {
    ...DEFAULT_AI_SETTINGS,
    ...((liveConfig.ai || {}) as AiSettings),
  };
  const cartSettings = {
    ...DEFAULT_CART_SETTINGS,
    ...((liveConfig.cart || {}) as CartSettings),
  };
  const widgetSettings = {
    ...DEFAULT_WIDGET_SETTINGS,
    ...((liveConfig.widget || {}) as WidgetSettings),
  };
  const testimonials = Array.isArray(liveConfig.testimonials)
    ? liveConfig.testimonials
    : DEFAULT_TESTIMONIALS;
  const faqItems = Array.isArray(liveConfig.faq) ? liveConfig.faq : DEFAULT_FAQ;
  const canUseBusinessAi =
    subscriptionSummary?.plan === "BUSINESS" || subscriptionSummary?.plan === "PRO";
  const isProPlan = subscriptionSummary?.plan === "PRO";
  const themeVars = getVisualStoreVars(liveConfig);
  const visualTheme = getVisualStoreTheme(liveConfig);
  const currentVertical = normalizeVertical(liveConfig.vertical || "ecommerce");
  const verticalThemeOptions = useMemo(
    () => getThemesByVertical(currentVertical),
    [currentVertical],
  );
  const publicStoreSlug = useMemo(() => resolveStoreSlug(liveConfig, projectId || "draft"), [liveConfig, projectId]);

  const categories = useMemo(() => {
    const set = new Set<string>(["Todos"]);
    liveProducts.forEach((p) => set.add(String(p.category || "General")));
    return Array.from(set);
  }, [liveProducts]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = liveProducts.filter((p) => p.active).filter((p) => {
      if (category !== "Todos" && String(p.category || "General") !== category) return false;
      if (!term) return true;
      return [p.name, p.description, p.badge || "", p.category || ""].join(" ").toLowerCase().includes(term);
    });
    return sortProducts(base, sortBy);
  }, [liveProducts, category, search, sortBy]);

  const offerProducts = useMemo(() => liveProducts.filter((p) => p.active && isOfferProduct(p)), [liveProducts]);
  const useOffersCarousel = viewMode === "mobile";

  const storefrontHtml = useMemo(() => {
    try {
      return generateStorefrontHtml({
        storeId: projectId || "draft",
        config: liveConfig,
        products: liveProducts,
        firebaseConfig: FIREBASE_PUBLIC_CONFIG,
      });
    } catch {
      return "<!doctype html><html><body>Store</body></html>";
    }
  }, [projectId, liveConfig, liveProducts]);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.uid) return;
    const scoped = localStorage.getItem(scopedStoreProjectKey(user.uid));
    const legacy = localStorage.getItem("fastpage_store_project_id");
    if (scoped) {
      setProjectId(scoped);
      return;
    }
    if (legacy) {
      setProjectId(legacy);
      localStorage.setItem(scopedStoreProjectKey(user.uid), legacy);
      localStorage.removeItem("fastpage_store_project_id");
      return;
    }
    setProjectId(null);
  }, [user?.uid]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setDemoThemeIntent(sanitizeDemoValue(params.get("demoTheme")));
  }, []);

  useEffect(() => {
    setProjectMeta(projectId || "store-draft", "store");
  }, [projectId, setProjectMeta]);

  useEffect(() => {
    if (authLoading || !user?.uid || !projectId) return;
    let cancelled = false;
    setLoadingProject(true);
    setError(null);
    (async () => {
      try {
        const snap = await getDoc(firestoreDoc(db, "cloned_sites", projectId));
        if (!snap.exists() || cancelled) return;
        const data = snap.data() as any;
        if (data?.userId && data.userId !== user.uid) throw new Error("No tienes permisos.");
        const loadedConfig = mergeConfigWithDefaults(
          data?.storeConfig as StoreConfig | undefined,
          sanitizeStoreSlug(String(data?.storeSlug || (data?.storeConfig as any)?.storeSlug || "")) || undefined,
        );
        const loadedProducts = mergeProductsWithDefaults(data?.storeProducts as StoreProduct[] | undefined);
        if (cancelled) return;
        setConfig(loadedConfig);
        setProducts(loadedProducts);
        setProjectPublished(Boolean(data?.published));
        setIsDirty(false);
        replaceData(
          {
            config: loadedConfig,
            products: loadedProducts,
          },
          { markDirty: false, syncPreview: true, changeKind: "bulk" },
        );
        markSaved(data?.status === "published" ? "published" : "draft");
      } catch (e: any) {
        if (cancelled) return;
        if (isPermissionDeniedError(e) || String(e?.message || "").toLowerCase().includes("no tienes permisos")) {
          setConfig(cloneDefaultConfig());
          setProducts(cloneDefaultProducts());
          setProjectId(null);
          setProjectPublished(false);
          if (typeof window !== "undefined" && user?.uid) {
            localStorage.removeItem(scopedStoreProjectKey(user.uid));
            localStorage.removeItem("fastpage_store_project_id");
          }
          setError("Se detecto un borrador de otra cuenta. Se inicio un borrador nuevo.");
          return;
        }
        setError(e?.message || "No se pudo cargar.");
        setEditorError(e?.message || "No se pudo cargar.");
      } finally {
        if (!cancelled) setLoadingProject(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, markSaved, projectId, replaceData, setEditorError, user?.uid]);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      replaceData({ config, products }, { markDirty: false, syncPreview: true, changeKind: "bulk" });
      return;
    }
    setIsDirty(true);
    replaceData({ config, products }, { markDirty: true, syncPreview: true, changeKind: "bulk" });
  }, [config, products, replaceData]);

  useEffect(() => {
    if (!categories.includes(category)) setCategory("Todos");
  }, [categories, category]);

  const setContent = (patch: Partial<VisualContent>) =>
    setConfig((prev) => ({ ...prev, content: { ...(prev.content || {}), ...patch } }));

  const setEcommerce = (patch: Partial<EcommerceSettings>) =>
    setConfig((prev) => ({
      ...prev,
      ecommerce: {
        ...DEFAULT_ECOMMERCE_SETTINGS,
        ...((prev.ecommerce || {}) as EcommerceSettings),
        ...patch,
      },
    }));

  const setAi = (patch: Partial<AiSettings>) =>
    setConfig((prev) => ({
      ...prev,
      ai: {
        ...DEFAULT_AI_SETTINGS,
        ...((prev.ai || {}) as AiSettings),
        ...patch,
      },
    }));

  const setCartSettings = (patch: Partial<CartSettings>) =>
    setConfig((prev) => ({
      ...prev,
      cart: {
        ...DEFAULT_CART_SETTINGS,
        ...((prev.cart || {}) as CartSettings),
        ...patch,
      },
    }));

  const setWidgetSettings = (patch: Partial<WidgetSettings>) =>
    setConfig((prev) => ({
      ...prev,
      widget: {
        ...DEFAULT_WIDGET_SETTINGS,
        ...((prev.widget || {}) as WidgetSettings),
        ...patch,
      },
    }));

  const updateTestimonial = (id: string, patch: Partial<StoreTestimonial>) => {
    setConfig((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || DEFAULT_TESTIMONIALS).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addTestimonial = () => {
    setConfig((prev) => ({
      ...prev,
      testimonials: [
        ...(prev.testimonials || DEFAULT_TESTIMONIALS),
        {
          id: newId("ts-"),
          name: "Cliente",
          role: "Compra online",
          text: "Excelente atencion y entrega rapida.",
          rating: 5,
        },
      ],
    }));
  };

  const removeTestimonial = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || DEFAULT_TESTIMONIALS).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const updateFaq = (id: string, patch: Partial<StoreFaqItem>) => {
    setConfig((prev) => ({
      ...prev,
      faq: (prev.faq || DEFAULT_FAQ).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addFaq = () => {
    setConfig((prev) => ({
      ...prev,
      faq: [
        ...(prev.faq || DEFAULT_FAQ),
        {
          id: newId("faq-"),
          question: "Nueva pregunta",
          answer: "Escribe aqui la respuesta.",
        },
      ],
    }));
  };

  const removeFaq = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      faq: (prev.faq || DEFAULT_FAQ).filter((item) => item.id !== id),
    }));
  };

  const applyAiStoreCopy = () => {
    if (!canUseBusinessAi) {
      setError("Activa Business o Pro para usar el panel IA.");
      return;
    }
    const focus = ai.promoFocus?.trim() || "delivery rapido y cierre por WhatsApp";
    const toneLabel =
      ai.tone === "premium"
        ? "premium"
        : ai.tone === "directo"
          ? "directo"
          : "comercial";

    setContent({
      heroSubtitle: `Compra segura y atencion ${toneLabel} para ${focus}.`,
      productsSubtitle: `Seleccion optimizada para convertir visitas en pedidos por WhatsApp.`,
      tipText: `IA ${ai.mode === "pro" ? "PRO" : "Business"} activa: copys listos para vender mas rapido.`,
    });

    if (ai.autoCopyEnabled) {
      setProducts((prev) =>
        prev.map((product, index) => ({
          ...product,
          ctaLabel:
            product.ctaLabel && product.ctaLabel.trim().length > 0
              ? product.ctaLabel
              : index % 2 === 0
                ? "Comprar por WhatsApp"
                : "Pedir ahora",
          description:
            product.description && product.description.trim().length > 0
              ? product.description
              : `Producto ideal para ${focus}. Entrega rapida y calidad garantizada.`,
        })),
      );
    }
  };

  const applyThemePreset = (themeId: StoreThemeId) => {
    const preset = STORE_THEMES.find((theme) => theme.id === themeId);
    setConfig((prev) => ({
      ...prev,
      themeId,
      customRgb: preset
        ? {
            ...(prev.customRgb || {}),
            accent: hexToRgb(preset.accent),
            accent2: hexToRgb(preset.accent2),
          }
        : prev.customRgb,
    }));
  };

  useEffect(() => {
    if (demoThemeAppliedRef.current) return;
    if (projectId) {
      demoThemeAppliedRef.current = true;
      return;
    }
    const requestedDemoTheme = demoThemeIntent;
    if (!requestedDemoTheme) return;
    const isValidTheme = STORE_THEMES.some((theme) => theme.id === requestedDemoTheme);
    demoThemeAppliedRef.current = true;
    if (!isValidTheme) return;
    applyThemePreset(requestedDemoTheme as StoreThemeId);
  }, [demoThemeIntent, projectId]);

  useEffect(() => {
    if (!verticalThemeOptions.length) return;
    if (verticalThemeOptions.some((theme) => theme.id === liveConfig.themeId)) return;
    applyThemePreset(verticalThemeOptions[0].id as StoreThemeId);
  }, [liveConfig.themeId, verticalThemeOptions]);

  const updateProduct = (id: string, patch: Partial<StoreProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addProduct = () => {
    setProducts((prev) => [
      {
        id: newId("prod-"),
        name: "Edita aqui: Nombre del producto",
        description: "Escribe aqui una descripcion corta orientada a venta.",
        category: "General",
        priceCents: 9900,
        compareAtPriceCents: 0,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
        active: true,
        badge: "Nuevo",
        ctaLabel: "Ver producto",
        sku: "",
        stockQty: 10,
      },
      ...prev,
    ]);
  };

  const removeProduct = (id: string) => {
    if (!confirm("Eliminar producto?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const onImage = async (file: File, cb: (data: string) => void) => {
    try {
      const image = await compressImage(file);
      cb(image);
    } catch (e: any) {
      setError(e?.message || "No se pudo subir imagen.");
    }
  };

  const applyMarketingTemplate = () => {
    setConfig(cloneDefaultConfig());
    setProducts(cloneDefaultProducts());
    setSearch("");
    setCategory("Todos");
    setSortBy("featured");
    setError(null);
  };

  const scrollOffersCarousel = (direction: "left" | "right") => {
    const node = offerCarouselRef.current;
    if (!node) return;
    const delta = Math.max(220, Math.round(node.clientWidth * 0.92));
    node.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" });
  };

  const saveProject = async (
    publishNow: boolean,
    publishMode: PublishTargetMode = "existing",
  ) => {
    if (saving || publishing) return;
    publishNow ? setPublishing(true) : setSaving(true);
    setError(null);
    if (publishNow) setSyncWarning(null);
    try {
      if (authLoading) throw new Error("Validando sesion...");
      if (!user?.uid) throw new Error("Debes iniciar sesion.");

      const targetMode: PublishTargetMode =
        publishNow ? (projectId ? publishMode : "new") : "existing";
      const reuseExistingId = Boolean(projectId) && (!publishNow || targetMode === "existing");
      const existingId = reuseExistingId ? projectId : null;
      let existingWasPublished = projectPublished;

      if (publishNow) {
        if (existingId) {
          try {
            const existingSnap = await getDoc(firestoreDoc(db, "cloned_sites", existingId));
            existingWasPublished = Boolean(existingSnap.data()?.published);
          } catch {
            // Keep cached value
          }
        }
        const quota = await assertCanPublishWithMode({
          mode: targetMode,
          alreadyPublished: targetMode === "existing" ? existingWasPublished : false,
        });
        if (!confirmPublishSlot(quota)) return;
      }

      const keepPublished = !publishNow && Boolean(existingId) && existingWasPublished;
      const persistedPublished = publishNow || keepPublished;
      let id = existingId || newId();
      let storeSlug = resolveStoreSlug(config, id);
      const nextProducts = mergeProductsWithDefaults(products);
      const now = Date.now();
      let nextConfig = mergeConfigWithDefaults(config, storeSlug);
      let html = publishNow ? injectMetricsTracking(storefrontHtml, id) : storefrontHtml;
      let payload: Record<string, any> = {
        id,
        userId: user.uid,
        source: "store-builder",
        type: "ecommerce",
        templateName: nextConfig.storeName || "Tienda Online",
        url: `/t/${storeSlug}`,
        storeConfig: nextConfig,
        storeSlug,
        storeProducts: nextProducts,
        html,
        updatedAt: now,
        status: persistedPublished ? "published" : "draft",
        published: persistedPublished,
      };
      if (!existingId) payload.createdAt = now;
      if (publishNow) payload.publishedAt = now;

      try {
        await setDoc(firestoreDoc(db, "cloned_sites", id), payload, { merge: true });
      } catch (writeError: any) {
        if (!(existingId && isPermissionDeniedError(writeError))) throw writeError;
        id = newId();
        storeSlug = resolveStoreSlug(config, id);
        nextConfig = mergeConfigWithDefaults(config, storeSlug);
        html = publishNow ? injectMetricsTracking(storefrontHtml, id) : storefrontHtml;
        payload = {
          ...payload,
          id,
          url: `/t/${storeSlug}`,
          storeConfig: nextConfig,
          storeSlug,
          html,
          createdAt: now,
          updatedAt: now,
        };
        await setDoc(firestoreDoc(db, "cloned_sites", id), payload, { merge: true });
      }
      const snapshot: StoreEditorSnapshot = { config: nextConfig, products: nextProducts };
      if (publishNow) {
        await publishEditorDraft({
          projectId: id,
          userId: user.uid,
          projectType: "store",
          data: snapshot,
          publishedUrl: `/t/${storeSlug}`,
        });
        await ensureAnalyticsDocument(id);
      } else {
        await saveEditorDraft({
          projectId: id,
          userId: user.uid,
          projectType: "store",
          data: snapshot,
        });
      }

      if (projectId !== id) {
        setProjectId(id);
        localStorage.setItem(scopedStoreProjectKey(user.uid), id);
        localStorage.removeItem("fastpage_store_project_id");
      }
      setProjectPublished(persistedPublished);
      if (config.storeSlug !== storeSlug) setConfig((prev) => ({ ...prev, storeSlug }));

      setIsDirty(false);
      markSaved(persistedPublished ? "published" : "draft");
      if (publishNow) router.push(`/published?highlight=${id}&kind=site`);
      else {
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 1300);
      }
    } catch (e: any) {
      if (!publishNow && isPermissionDeniedError(e)) {
        setSyncWarning(
          "Sin permisos de escritura en Firestore. Los cambios se mantienen localmente hasta iniciar sesion con una cuenta autorizada.",
        );
        setError(null);
        setEditorError(null);
        return;
      }
      setError(e?.message || "No se pudo guardar.");
      setEditorError(e?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  useAutosave<StoreEditorSnapshot>({
    enabled: Boolean(user?.uid) && !loadingProject && !syncWarning,
    onSave: async () => {
      await saveProject(false);
    },
    intervalMs: 30000,
  });

  const handlePublishClick = async () => {
    const mode = requestPublishTarget({
      hasExistingProject: Boolean(projectId),
      entityLabel: "tienda",
    });
    if (mode === "cancelled") return;
    await saveProject(true, mode);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030712] pt-24 md:pt-28 pb-10 md:pb-12" style={{ ...themeVars }}>
      <div className="mx-auto max-w-[1600px] px-3 md:px-6">
        <MobilePlanStatusCard userId={user?.uid} className="mb-4" />
        <header className="sticky top-[72px] md:top-20 z-40 rounded-2xl border bg-white/90 px-3 py-3 text-slate-900 backdrop-blur md:px-4" style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => (window.history.length > 1 ? router.back() : router.push("/hub"))} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white" style={{ borderColor: "var(--vs-border)" }}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--vs-muted)" }}>Editor visual ecommerce</p>
                <InlineEditable
                  value={config.storeName}
                  field="storeName"
                  projectId={projectId || "store-draft"}
                  onChange={(value: string) => setConfig((p) => ({ ...p, storeName: value }))}
                  className="text-lg font-black"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border bg-white p-1" style={{ borderColor: "var(--vs-border)" }}>
                <button onClick={() => setViewMode("desktop")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${viewMode === "desktop" ? "text-white" : "text-slate-700"}`} style={viewMode === "desktop" ? { background: "var(--vs-dark)" } : undefined}><Monitor className="h-4 w-4" />PC</button>
                <button onClick={() => setViewMode("mobile")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${viewMode === "mobile" ? "text-white" : "text-slate-700"}`} style={viewMode === "mobile" ? { background: "var(--vs-dark)" } : undefined}><Smartphone className="h-4 w-4" />Movil</button>
              </div>
              <button onClick={() => window.open(`/t/${publicStoreSlug}`, "_blank", "noopener,noreferrer")} className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-bold" style={{ borderColor: "var(--vs-border)" }}><ExternalLink className="h-4 w-4" />Ver tienda</button>
              <button onClick={applyMarketingTemplate} className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-bold" style={{ borderColor: "var(--vs-border)" }}><Wand2 className="h-4 w-4" />Plantilla marketing</button>
              <button onClick={() => saveProject(false)} disabled={saving || loadingProject} className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-bold disabled:opacity-60" style={{ borderColor: "var(--vs-border)" }}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Guardar</button>
              <button onClick={() => void handlePublishClick()} disabled={publishing || loadingProject} className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-black text-white disabled:opacity-60" style={{ background: "var(--vs-dark)" }}>{publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}Publicar</button>
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <section className="order-1 min-w-0 rounded-3xl border bg-white p-3 text-slate-900 md:p-5 lg:order-2" style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
            <div className="mb-4 rounded-2xl border bg-white px-4 py-3 text-xs font-semibold" style={{ borderColor: "var(--vs-border)", color: "var(--vs-muted)" }}>
              Haz clic en cualquier campo para editar. Encontraras texto base de marketing listo para personalizar y fotos demo para reemplazar.
            </div>
            <div className={viewMode === "mobile" ? "mx-auto w-full min-w-0 max-w-[430px] overflow-x-clip" : "w-full min-w-0"} style={{ color: "var(--vs-text)" }}>
              <div className="overflow-hidden rounded-[30px] border bg-[var(--vs-surface)]" style={{ borderColor: "var(--vs-border-strong)" }}>
                <div className="px-4 py-2 text-center text-sm font-bold text-white" style={{ background: "var(--vs-dark)" }}>
                  <input value={content.topStripText || ""} onChange={(e) => setContent({ topStripText: e.target.value })} placeholder="Edita aqui: promo principal" className="w-full bg-transparent text-center outline-none" />
                </div>
                <div className="relative h-[220px] md:h-[320px]">
                  {content.heroImageUrl ? <img src={content.heroImageUrl} alt="hero" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center bg-slate-200 text-sm font-semibold text-slate-500">Sube una portada para tu tienda</div>}
                  <label className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1 rounded-xl bg-black/70 px-3 py-2 text-xs font-bold text-white"><Upload className="h-3.5 w-3.5" />Portada<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void onImage(f, (img) => setContent({ heroImageUrl: img })); e.target.value = ""; }} /></label>
                </div>
                <div className="relative px-4 pb-8 pt-16 md:px-8">
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <label className="relative block h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                      {content.logoImageUrl ? <img src={content.logoImageUrl} alt="logo" className="h-full w-full object-cover" /> : null}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void onImage(f, (img) => setContent({ logoImageUrl: img })); e.target.value = ""; }} />
                    </label>
                  </div>

                  <div className="mx-auto max-w-3xl text-center">
                    <input value={config.storeName} onChange={(e) => setConfig((p) => ({ ...p, storeName: e.target.value }))} placeholder="Edita aqui: nombre de la tienda" className="w-full bg-transparent text-center text-4xl font-black outline-none" />
                    <textarea value={config.tagline} onChange={(e) => setConfig((p) => ({ ...p, tagline: e.target.value }))} placeholder="Escribe aqui: propuesta de valor de tu negocio" className="mt-3 w-full resize-none bg-transparent text-center text-lg outline-none" style={{ color: "var(--vs-muted)" }} />
                    <div className="mx-auto mt-4 max-w-sm rounded-full px-5 py-3 text-lg font-black text-white" style={{ background: "linear-gradient(135deg,var(--vs-accent),var(--vs-accent-2))" }}>
                      <input value={content.scheduleText || ""} onChange={(e) => setContent({ scheduleText: e.target.value })} placeholder="Edita aqui: horario de atencion" className="w-full bg-transparent text-center outline-none" />
                    </div>
                    <input value={content.businessAddress || ""} onChange={(e) => setContent({ businessAddress: e.target.value })} placeholder="Edita aqui: direccion, distrito o punto de retiro" className="mt-4 w-full bg-transparent text-center text-lg outline-none" />
                  </div>

                  <div className="mt-8">
                    <input value={content.offerSectionTitle || ""} onChange={(e) => setContent({ offerSectionTitle: e.target.value })} placeholder="Edita aqui: titulo de ofertas" className="w-full bg-transparent text-4xl font-black outline-none" />
                    {useOffersCarousel ? (
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => scrollOffersCarousel("left")}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white"
                          style={{ borderColor: "var(--vs-border)" }}
                          aria-label="Mover ofertas a la izquierda"
                          title="Mover a la izquierda"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollOffersCarousel("right")}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white"
                          style={{ borderColor: "var(--vs-border)" }}
                          aria-label="Mover ofertas a la derecha"
                          title="Mover a la derecha"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                    <div
                      ref={useOffersCarousel ? offerCarouselRef : null}
                      className={useOffersCarousel ? "no-scrollbar mt-3 grid grid-flow-col auto-cols-[100%] gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth touch-pan-x" : "mt-4 grid grid-cols-3 gap-4"}
                    >
                      {offerProducts.map((p) => (
                        <article key={`offer-${p.id}`} className={`${useOffersCarousel ? "w-full snap-start" : ""} overflow-hidden rounded-2xl border bg-white text-slate-900`} style={{ borderColor: "#edf2f7" }}>
                          <div className="relative h-44 bg-slate-100">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : null}<span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black uppercase text-white" style={{ background: "var(--vs-accent)" }}>{p.badge || "Oferta"}</span></div>
                          <div className="p-3"><p className="font-black">{p.name}</p><p className="mt-1 text-xl font-black" style={{ color: "var(--vs-accent)" }}>{formatMoney(p.priceCents, config.currency)}</p><button className="mt-2 h-10 w-full rounded-xl text-sm font-black text-white" style={{ background: "var(--vs-accent)" }}>{p.ctaLabel || "Ver oferta"}</button></div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border bg-white p-3 text-slate-900" style={{ borderColor: "var(--vs-border)" }}>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder || "Buscar producto..."} className="h-10 w-full rounded-xl border px-3 text-sm outline-none" style={{ borderColor: "var(--vs-border)" }} />
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className="shrink-0 rounded-xl border px-4 py-2 text-sm font-bold" style={category === c ? { borderColor: "var(--vs-accent)", background: "var(--vs-accent)", color: "#fff" } : { borderColor: "var(--vs-border)" }}>{c}</button>)}</div>
                    <div className="mt-3 flex items-center justify-between"><p className="text-sm font-semibold" style={{ color: "var(--vs-muted)" }}>Total: {filteredProducts.length} productos</p><select value={sortBy} onChange={(e) => setSortBy(e.target.value as VisualSort)} className="h-10 rounded-xl border px-3 text-sm font-semibold outline-none" style={{ borderColor: "var(--vs-border)" }}><option value="featured">Ordenar por</option><option value="priceAsc">Precio ascendente</option><option value="priceDesc">Precio descendente</option><option value="nameAsc">Nombre A-Z</option></select></div>
                  </div>

                  <div className={`mt-4 grid gap-3 ${viewMode === "mobile" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
                    {filteredProducts.map((p) => (
                      <article key={p.id} className="overflow-hidden rounded-2xl border bg-white text-slate-900" style={{ borderColor: "#edf2f7" }}>
                        <div className="relative h-36 bg-slate-100">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-500">Sube foto</div>}<label className="absolute right-2 top-2 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-[11px] font-bold text-white"><Upload className="h-3 w-3" />Foto<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; void onImage(f, (img) => updateProduct(p.id, { imageUrl: img })); e.target.value = ""; }} /></label></div>
                        <div className="space-y-2 p-3">
                          <input value={p.badge || ""} onChange={(e) => updateProduct(p.id, { badge: e.target.value })} className="w-full rounded-lg border bg-white px-2 py-1 text-xs font-bold uppercase text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Escribe aqui: badge" />
                          <input value={p.name} onChange={(e) => updateProduct(p.id, { name: e.target.value })} className="w-full rounded-lg border bg-white px-2 py-1 text-sm font-black text-slate-800 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Escribe aqui: nombre del producto" />
                          <input value={p.description} onChange={(e) => updateProduct(p.id, { description: e.target.value })} className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Escribe aqui: descripcion comercial" />
                          <input value={p.category || ""} onChange={(e) => updateProduct(p.id, { category: e.target.value })} className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Escribe aqui: categoria" />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              value={p.sku || ""}
                              onChange={(e) => updateProduct(p.id, { sku: e.target.value })}
                              className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none"
                              style={{ borderColor: SOFT_INPUT_BORDER }}
                              placeholder="SKU"
                            />
                            <input
                              value={String(p.stockQty ?? 0)}
                              onChange={(e) => {
                                const n = Number(e.target.value);
                                updateProduct(p.id, {
                                  stockQty: Number.isFinite(n) ? clampInt(n, 0, 9999) : 0,
                                });
                              }}
                              className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none"
                              style={{ borderColor: SOFT_INPUT_BORDER }}
                              placeholder="Stock"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input value={String((p.priceCents || 0) / 100)} onChange={(e) => { const n = Number(e.target.value.replace(",", ".")); if (!Number.isFinite(n)) return; updateProduct(p.id, { priceCents: clampInt(Math.round(n * 100), 0, 99999999) }); }} className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Precio" />
                            <input value={String(((p.compareAtPriceCents || 0) / 100) || "")} onChange={(e) => { const n = Number(e.target.value.replace(",", ".")); if (!Number.isFinite(n)) { updateProduct(p.id, { compareAtPriceCents: 0 }); return; } updateProduct(p.id, { compareAtPriceCents: clampInt(Math.round(n * 100), 0, 99999999) }); }} className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Antes" />
                          </div>
                          <input value={p.ctaLabel || "Ver producto"} onChange={(e) => updateProduct(p.id, { ctaLabel: e.target.value })} className="w-full rounded-lg border bg-white px-2 py-1 text-xs text-slate-700 outline-none" style={{ borderColor: SOFT_INPUT_BORDER }} placeholder="Escribe aqui: texto del boton" />
                          <button
                            type="button"
                            onClick={() => updateProduct(p.id, { active: !(p.active !== false) })}
                            className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold"
                            style={
                              p.active !== false
                                ? { borderColor: "#bbf7d0", background: "#f0fdf4", color: "#166534" }
                                : { borderColor: "#fecaca", background: "#fff7ed", color: "#9a3412" }
                            }
                          >
                            {p.active !== false ? "Producto activo" : "Producto oculto"}
                          </button>
                          <button onClick={() => removeProduct(p.id)} className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold text-red-600" style={{ borderColor: "#fecaca", background: "#fff5f5" }}><Trash2 className="h-3.5 w-3.5" />Eliminar</button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button onClick={addProduct} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black text-white" style={{ borderColor: "var(--vs-accent)", background: "var(--vs-accent)" }}><Plus className="h-4 w-4" />Agregar producto</button>
                </div>
              </div>
            </div>
          </section>

          <aside className="order-2 min-w-0 space-y-4 self-start lg:order-1 lg:sticky lg:top-[150px]">
            <EditorSidebar
              activeTab={activeSidebarTab}
              onTabChange={setActiveSidebarTab}
              contentTab={<p className="text-xs text-zinc-600">Contenido comercial y configuracion ecommerce sincronizados.</p>}
              designTab={<p className="text-xs text-zinc-600">Tema, colores y layout desktop/mobile.</p>}
              aiTab={<p className="text-xs text-zinc-600">Panel IA para copys de tienda: activo desde plan Business.</p>}
              seoTab={<p className="text-xs text-zinc-600">Slug y metadata comercial para publicar en /t/{'{slug}'}.</p>}
              settingsTab={<p className="text-xs text-zinc-600">Widget, carrito, testimonios y FAQ configurables con autosave.</p>}
            />
            <section className={`rounded-2xl border bg-white p-4 text-slate-900 ${activeSidebarTab === "design" ? "" : "hidden"}`} style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
              <h3 className="text-sm font-black uppercase tracking-[0.15em]">Tema dinamico</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>Selecciona rubro y aplica temas relacionados.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["restaurant", "ecommerce", "services"] as BusinessVertical[]).map((vertical) => (
                  <button
                    key={vertical}
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        vertical,
                      }))
                    }
                    className="rounded-xl border px-2 py-2 text-xs font-bold capitalize"
                    style={
                      currentVertical === vertical
                        ? {
                            borderColor: "var(--vs-accent)",
                            background: "color-mix(in srgb,var(--vs-accent) 12%,white)",
                          }
                        : { borderColor: "var(--vs-border)" }
                    }
                  >
                    {vertical}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {verticalThemeOptions.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => applyThemePreset(themeOption.id as StoreThemeId)}
                    className="rounded-xl border px-3 py-2 text-left text-xs font-bold"
                    style={
                      config.themeId === themeOption.id
                        ? {
                            borderColor: "var(--vs-accent)",
                            background: "color-mix(in srgb,var(--vs-accent) 12%,white)",
                          }
                        : { borderColor: "var(--vs-border)" }
                    }
                  >
                    {themeOption.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-xs font-semibold">Primario<input type="color" value={rgbToHex(config.customRgb?.accent)} onChange={(e) => setConfig((p) => ({ ...p, customRgb: { ...(p.customRgb || {}), accent: hexToRgb(e.target.value) } }))} className="mt-1 h-10 w-full rounded-lg border p-1" style={{ borderColor: "var(--vs-border)" }} /></label>
                <label className="text-xs font-semibold">Secundario<input type="color" value={rgbToHex(config.customRgb?.accent2)} onChange={(e) => setConfig((p) => ({ ...p, customRgb: { ...(p.customRgb || {}), accent2: hexToRgb(e.target.value) } }))} className="mt-1 h-10 w-full rounded-lg border p-1" style={{ borderColor: "var(--vs-border)" }} /></label>
              </div>
              <div className="mt-2 rounded-xl border p-3 text-xs" style={{ borderColor: "var(--vs-border)" }}>Rubro activo: <b>{currentVertical}</b><br />Tema activo: <b>{visualTheme.label}</b><br />URL publica: <b>{`/t/${publicStoreSlug}`}</b></div>
            </section>
            <section className={`rounded-2xl border bg-white p-4 text-slate-900 ${activeSidebarTab === "content" ? "" : "hidden"}`} style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
              <h3 className="text-sm font-black uppercase tracking-[0.15em]">Ecommerce real</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>
                Configura ventas reales: moneda, WhatsApp, envio, metodos de pago y terminos.
              </p>
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold">
                  WhatsApp de ventas
                  <input
                    value={config.supportWhatsapp || ""}
                    onChange={(e) => setConfig((prev) => ({ ...prev, supportWhatsapp: e.target.value.replace(/\D/g, "") }))}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="51999999999"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-semibold">
                    Moneda
                    <select
                      value={config.currency}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          currency: e.target.value as StoreConfig["currency"],
                        }))
                      }
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                    >
                      <option value="PEN">PEN (Soles)</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </label>
                  <label className="block text-xs font-semibold">
                    CTA principal
                    <input
                      value={config.primaryCta || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, primaryCta: e.target.value }))}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="Comprar ahora"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setEcommerce({ deliveryEnabled: !ecommerce.deliveryEnabled })}
                    className="rounded-lg border px-3 py-2 text-xs font-bold"
                    style={
                      ecommerce.deliveryEnabled
                        ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" }
                        : { borderColor: "var(--vs-border)" }
                    }
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setEcommerce({ pickupEnabled: !ecommerce.pickupEnabled })}
                    className="rounded-lg border px-3 py-2 text-xs font-bold"
                    style={
                      ecommerce.pickupEnabled
                        ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" }
                        : { borderColor: "var(--vs-border)" }
                    }
                  >
                    Recojo en tienda
                  </button>
                  <button
                    type="button"
                    onClick={() => setEcommerce({ inStoreEnabled: !ecommerce.inStoreEnabled })}
                    className="rounded-lg border px-3 py-2 text-xs font-bold"
                    style={
                      ecommerce.inStoreEnabled
                        ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" }
                        : { borderColor: "var(--vs-border)" }
                    }
                  >
                    Consumir en local
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-semibold">
                    Envio base
                    <input
                      value={String((ecommerce.shippingBaseFeeCents || 0) / 100)}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(",", "."));
                        setEcommerce({
                          shippingBaseFeeCents: Number.isFinite(n)
                            ? clampInt(Math.round(n * 100), 0, 99999999)
                            : 0,
                        });
                      }}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="10"
                    />
                  </label>
                  <label className="block text-xs font-semibold">
                    Envio gratis desde
                    <input
                      value={String((ecommerce.freeShippingFromCents || 0) / 100)}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(",", "."));
                        setEcommerce({
                          freeShippingFromCents: Number.isFinite(n)
                            ? clampInt(Math.round(n * 100), 0, 99999999)
                            : 0,
                        });
                      }}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="120"
                    />
                  </label>
                </div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--vs-muted)" }}>
                  Metodos de pago activos
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["yapeEnabled", "Yape"],
                      ["plinEnabled", "Plin"],
                      ["transferEnabled", "Transferencia"],
                      ["cashEnabled", "Efectivo"],
                      ["cardEnabled", "Tarjeta"],
                    ] as Array<[keyof EcommerceSettings, string]>
                  ).map(([key, label]) => {
                    const active = Boolean(ecommerce[key]);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setEcommerce({ [key]: !active } as Partial<EcommerceSettings>)
                        }
                        className="rounded-lg border px-3 py-2 text-xs font-bold"
                        style={
                          active
                            ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" }
                            : { borderColor: "var(--vs-border)" }
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <label className="block text-xs font-semibold">
                  Terminos de compra
                  <input
                    value={ecommerce.termsText || ""}
                    onChange={(e) => setEcommerce({ termsText: e.target.value })}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="Acepto terminos y condiciones de compra."
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setEcommerce({ termsRequired: !ecommerce.termsRequired })}
                  className="w-full rounded-lg border px-3 py-2 text-xs font-bold"
                  style={
                    ecommerce.termsRequired
                      ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" }
                      : { borderColor: "var(--vs-border)" }
                  }
                >
                  {ecommerce.termsRequired
                    ? "Terminos obligatorios activados"
                    : "Terminos obligatorios desactivados"}
                </button>
              </div>
            </section>

            <section className={`rounded-2xl border bg-white p-4 text-slate-900 ${activeSidebarTab === "ai" ? "" : "hidden"}`} style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em]">
                <Sparkles className="h-4 w-4" />
                Mini panel IA
              </h3>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>
                Configura copys de venta. IA basica en Business y modo avanzado en Pro.
              </p>
              <div className="mt-3 rounded-xl border p-3 text-xs" style={{ borderColor: "var(--vs-border)" }}>
                Plan detectado: <b>{subscriptionSummary?.plan || "FREE"}</b>
              </div>
              {!canUseBusinessAi ? (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Activa Business o Pro para habilitar IA de tienda.
                  </div>
                </div>
              ) : null}
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold">
                  Tono de copy
                  <select
                    value={ai.tone}
                    onChange={(e) => setAi({ tone: e.target.value as AiSettings["tone"] })}
                    disabled={!canUseBusinessAi}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none disabled:opacity-60 ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                  >
                    <option value="comercial">Comercial</option>
                    <option value="directo">Directo</option>
                    <option value="premium">Premium</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold">
                  Enfoque de conversion
                  <input
                    value={ai.promoFocus || ""}
                    onChange={(e) => setAi({ promoFocus: e.target.value })}
                    disabled={!canUseBusinessAi}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none disabled:opacity-60 ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="delivery rapido, combos, ticket medio..."
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAi({ mode: "business" })}
                    disabled={!canUseBusinessAi}
                    className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-60"
                    style={ai.mode === "business" ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" } : { borderColor: "var(--vs-border)" }}
                  >
                    IA Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setAi({ mode: "pro" })}
                    disabled={!isProPlan}
                    className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-60"
                    style={ai.mode === "pro" ? { borderColor: "#93c5fd", background: "#eff6ff", color: "#1d4ed8" } : { borderColor: "var(--vs-border)" }}
                  >
                    IA PRO
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setAi({ autoCopyEnabled: !ai.autoCopyEnabled })}
                  disabled={!canUseBusinessAi}
                  className="w-full rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-60"
                  style={ai.autoCopyEnabled ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" } : { borderColor: "var(--vs-border)" }}
                >
                  {ai.autoCopyEnabled ? "Copys auto por producto: ACTIVADO" : "Copys auto por producto: DESACTIVADO"}
                </button>
                <button
                  type="button"
                  onClick={applyAiStoreCopy}
                  disabled={!canUseBusinessAi}
                  className="w-full rounded-lg border px-3 py-2 text-xs font-black text-white disabled:opacity-60"
                  style={{ borderColor: "var(--vs-accent)", background: "var(--vs-accent)" }}
                >
                  Aplicar copys IA en tienda
                </button>
              </div>
            </section>
            <section className={`rounded-2xl border bg-white p-4 text-slate-900 ${activeSidebarTab === "seo" ? "" : "hidden"}`} style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
              <h3 className="text-sm font-black uppercase tracking-[0.15em]">SEO tienda online</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>
                Ajusta URL y textos clave para mejorar descubrimiento y conversion.
              </p>
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold">
                  Alias publico (slug)
                  <input
                    value={config.storeSlug || ""}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        storeSlug: sanitizeStoreSlug(e.target.value),
                      }))
                    }
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="mi-tienda-online"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Frase SEO principal
                  <input
                    value={content.kicker || ""}
                    onChange={(e) => setContent({ kicker: e.target.value })}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="Tienda online + WhatsApp"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Placeholder de busqueda
                  <input
                    value={content.searchPlaceholder || ""}
                    onChange={(e) => setContent({ searchPlaceholder: e.target.value })}
                    className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                    style={{ borderColor: "var(--vs-border)" }}
                    placeholder="Buscar producto..."
                  />
                </label>
                <div className="rounded-xl border p-3 text-xs" style={{ borderColor: "var(--vs-border)" }}>
                  URL publica actual: <b>{`/t/${publicStoreSlug}`}</b>
                </div>
              </div>
            </section>

            <section className={`rounded-2xl border bg-white p-4 text-slate-900 ${activeSidebarTab === "settings" ? "" : "hidden"}`} style={{ borderColor: "var(--vs-border)", boxShadow: "var(--vs-shadow)" }}>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em]">
                <MessageCircle className="h-4 w-4" />
                Ajustes PRO tienda
              </h3>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>
                Autosave activo cada 30s. Configura carrito, widget, testimonios y FAQ.
              </p>
              <div className="mt-3 space-y-4">
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--vs-border)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.12em]">Carrito</p>
                  <label className="mt-2 block text-xs font-semibold">
                    Etiqueta del boton
                    <input
                      value={cartSettings.floatingButtonLabel || ""}
                      onChange={(e) => setCartSettings({ floatingButtonLabel: e.target.value })}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="Carrito"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setCartSettings({ floatingButtonEnabled: !cartSettings.floatingButtonEnabled })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-xs font-bold"
                    style={cartSettings.floatingButtonEnabled ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" } : { borderColor: "var(--vs-border)" }}
                  >
                    {cartSettings.floatingButtonEnabled ? "Boton flotante: ACTIVO" : "Boton flotante: INACTIVO"}
                  </button>
                </div>

                <div className="rounded-xl border p-3" style={{ borderColor: "var(--vs-border)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.12em]">Widget WhatsApp / Asistente</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWidgetSettings({ enabled: !widgetSettings.enabled })}
                      className="rounded-lg border px-3 py-2 text-xs font-bold"
                      style={widgetSettings.enabled ? { borderColor: "#86efac", background: "#f0fdf4", color: "#166534" } : { borderColor: "var(--vs-border)" }}
                    >
                      {widgetSettings.enabled ? "Widget activo" : "Widget apagado"}
                    </button>
                    <select
                      value={widgetSettings.mode}
                      onChange={(e) => setWidgetSettings({ mode: e.target.value as WidgetSettings["mode"] })}
                      className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="assistant">Asistente</option>
                    </select>
                  </div>
                  <label className="mt-2 block text-xs font-semibold">
                    Titulo del widget
                    <input
                      value={widgetSettings.title || ""}
                      onChange={(e) => setWidgetSettings({ title: e.target.value })}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="Asistente de tienda"
                    />
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="block text-xs font-semibold">
                      Texto del boton
                      <input
                        value={widgetSettings.ctaLabel || ""}
                        onChange={(e) => setWidgetSettings({ ctaLabel: e.target.value })}
                        className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                        style={{ borderColor: "var(--vs-border)" }}
                        placeholder="Abrir chat"
                      />
                    </label>
                    <label className="block text-xs font-semibold">
                      Posicion
                      <select
                        value={widgetSettings.position}
                        onChange={(e) => setWidgetSettings({ position: e.target.value as WidgetSettings["position"] })}
                        className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                        style={{ borderColor: "var(--vs-border)" }}
                      >
                        <option value="right">Derecha</option>
                        <option value="left">Izquierda</option>
                      </select>
                    </label>
                  </div>
                  <label className="mt-2 block text-xs font-semibold">
                    Mensaje inicial
                    <textarea
                      value={widgetSettings.welcomeMessage || ""}
                      onChange={(e) => setWidgetSettings({ welcomeMessage: e.target.value })}
                      className={`mt-1 min-h-[70px] w-full rounded-lg border px-3 py-2 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="Hola, te ayudo con productos y pedidos."
                    />
                  </label>
                  <label className="mt-2 block text-xs font-semibold">
                    Placeholder del asistente
                    <input
                      value={widgetSettings.assistantPlaceholder || ""}
                      onChange={(e) => setWidgetSettings({ assistantPlaceholder: e.target.value })}
                      className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none ${DARK_FORM_FIELD_CLASS}`}
                      style={{ borderColor: "var(--vs-border)" }}
                      placeholder="Escribe tu consulta..."
                    />
                  </label>
                </div>

                <div className="rounded-xl border p-3" style={{ borderColor: "var(--vs-border)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.12em]">Testimonios reales</p>
                  <div className="mt-2 space-y-2">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="rounded-lg border p-2" style={{ borderColor: "var(--vs-border)" }}>
                        <input
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                          className={`h-9 w-full rounded-lg border px-2 text-xs outline-none ${DARK_FORM_FIELD_CLASS}`}
                          style={{ borderColor: "var(--vs-border)" }}
                          placeholder="Nombre"
                        />
                        <input
                          value={testimonial.text}
                          onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                          className={`mt-2 h-9 w-full rounded-lg border px-2 text-xs outline-none ${DARK_FORM_FIELD_CLASS}`}
                          style={{ borderColor: "var(--vs-border)" }}
                          placeholder="Testimonio"
                        />
                        <button
                          type="button"
                          onClick={() => removeTestimonial(testimonial.id)}
                          className="mt-2 h-8 w-full rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-600"
                        >
                          Eliminar testimonio
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addTestimonial} className="mt-2 h-9 w-full rounded-lg border px-3 text-xs font-black text-white" style={{ borderColor: "var(--vs-accent)", background: "var(--vs-accent)" }}>
                    Agregar testimonio
                  </button>
                </div>

                <div className="rounded-xl border p-3" style={{ borderColor: "var(--vs-border)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.12em]">FAQ</p>
                  <div className="mt-2 space-y-2">
                    {faqItems.map((faq) => (
                      <div key={faq.id} className="rounded-lg border p-2" style={{ borderColor: "var(--vs-border)" }}>
                        <input
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                          className={`h-9 w-full rounded-lg border px-2 text-xs outline-none ${DARK_FORM_FIELD_CLASS}`}
                          style={{ borderColor: "var(--vs-border)" }}
                          placeholder="Pregunta"
                        />
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                          className={`mt-2 min-h-[64px] w-full rounded-lg border px-2 py-2 text-xs outline-none ${DARK_FORM_FIELD_CLASS}`}
                          style={{ borderColor: "var(--vs-border)" }}
                          placeholder="Respuesta"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="mt-2 h-8 w-full rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-600"
                        >
                          Eliminar FAQ
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addFaq} className="mt-2 h-9 w-full rounded-lg border px-3 text-xs font-black text-white" style={{ borderColor: "var(--vs-accent)", background: "var(--vs-accent)" }}>
                    Agregar FAQ
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {error && <div className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-xl md:bottom-6 md:left-auto md:right-24 md:w-auto md:translate-x-0">{error}</div>}
      {syncWarning && <div className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-700 shadow-xl md:bottom-6 md:left-auto md:right-24 md:w-auto md:translate-x-0">{syncWarning}</div>}
      {savedToast && <div className="fixed bottom-5 left-5 z-50 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-xl">Cambios guardados</div>}
      {loadingProject && <div className="fixed inset-0 z-50 grid place-items-center bg-black/30"><div className="rounded-2xl bg-white p-6 shadow-2xl"><Loader2 className="h-7 w-7 animate-spin" /></div></div>}
    </div>
  );
}


