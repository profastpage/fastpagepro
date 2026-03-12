import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import {
  STORE_THEMES,
  type StoreConfig,
  type StoreProduct,
} from "@/lib/storefrontGenerator";
import {
  normalizeImagePosition,
} from "@/lib/imagePosition";

export const CLONED_SITES_COLLECTION = "cloned_sites";
export const STORE_ORDERS_COLLECTION = "store_orders";

export type PublicStoreProduct = StoreProduct & {
  category: string;
  displayPriceCents: number;
  compareAtPriceCents?: number;
  hasOffer: boolean;
};

export type PublicStorefront = {
  id: string;
  userId: string;
  slug: string;
  config: StoreConfig;
  products: PublicStoreProduct[];
};

function safeText(value: unknown): string {
  return String(value ?? "").trim();
}

function safeInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.round(parsed));
}

export function sanitizeStoreSlug(input: string): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function buildStoreSlug(storeName: string, stableId = ""): string {
  const base = sanitizeStoreSlug(storeName || "tienda");
  const shortId = sanitizeStoreSlug(stableId).slice(0, 8);
  const seed = shortId ? `-${shortId}` : "";
  return sanitizeStoreSlug(`${base || "tienda"}${seed}`);
}

export function resolveStoreSlug(
  config: Partial<StoreConfig> | null | undefined,
  stableId: string,
  currentSlug?: string,
): string {
  const fromCurrent = sanitizeStoreSlug(currentSlug || "");
  if (fromCurrent) return fromCurrent;
  const fromConfig = sanitizeStoreSlug(String((config as any)?.storeSlug || ""));
  if (fromConfig) return fromConfig;
  const generated = buildStoreSlug(String(config?.storeName || ""), stableId);
  return generated || sanitizeStoreSlug(stableId) || "tienda";
}

function normalizeThemeId(value: unknown): StoreConfig["themeId"] {
  const raw = safeText(value) as StoreConfig["themeId"];
  if (STORE_THEMES.some((theme) => theme.id === raw)) return raw;
  return STORE_THEMES[0].id;
}

function normalizeTestimonials(raw: unknown): NonNullable<StoreConfig["testimonials"]> {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      const row = (item || {}) as Record<string, unknown>;
      return {
        id: safeText(row.id) || `ts-${index + 1}`,
        name: safeText(row.name) || `Cliente ${index + 1}`,
        role: safeText(row.role) || "",
        text: safeText(row.text) || "Excelente experiencia de compra.",
        rating: Math.max(1, Math.min(5, safeInt(row.rating, 5))),
      };
    })
    .slice(0, 12);
}

function normalizeFaq(raw: unknown): NonNullable<StoreConfig["faq"]> {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      const row = (item || {}) as Record<string, unknown>;
      return {
        id: safeText(row.id) || `faq-${index + 1}`,
        question: safeText(row.question) || `Pregunta ${index + 1}`,
        answer: safeText(row.answer) || "Respuesta pendiente.",
      };
    })
    .slice(0, 20);
}

function normalizeCategory(raw: DocumentData): string {
  const explicit = safeText(
    raw.category || raw.collection || raw.department || raw.segment,
  );
  if (explicit) return explicit.slice(0, 32);

  const sku = safeText(raw.sku);
  if (sku.includes("-")) {
    const bySku = safeText(sku.split("-")[0]);
    if (bySku) return bySku.slice(0, 32);
  }

  return "General";
}

function normalizeStoreProduct(raw: DocumentData, index: number): PublicStoreProduct {
  const basePrice = safeInt(raw.priceCents, 0);
  const offerPrice = safeInt(raw.offerPriceCents, basePrice);
  const displayPrice = offerPrice > 0 ? offerPrice : basePrice;
  const compareAt = safeInt(raw.compareAtPriceCents, 0);
  const badge = safeText(raw.badge);
  const badgeOffer = /(oferta|offer|sale|promo|descuento)/i.test(badge);
  const hasOffer = compareAt > displayPrice || badgeOffer;

  return {
    id: safeText(raw.id) || `product-${index + 1}`,
    name: safeText(raw.name) || `Producto ${index + 1}`,
    priceCents: basePrice,
    description: safeText(raw.description),
    imageUrl: safeText(raw.imageUrl),
    imagePositionX: normalizeImagePosition(raw.imagePositionX, 50),
    imagePositionY: normalizeImagePosition(raw.imagePositionY, 50),
    active: raw.active !== false,
    badge: badge || undefined,
    sku: safeText(raw.sku) || undefined,
    stockQty: Math.max(0, safeInt(raw.stockQty, 0)),
    category: normalizeCategory(raw),
    displayPriceCents: displayPrice,
    compareAtPriceCents: compareAt > displayPrice ? compareAt : undefined,
    hasOffer,
  };
}

function isStoreAccessBlocked(raw: DocumentData): boolean {
  if (raw.subscriptionBlocked === true) return true;
  const status = safeText(raw.subscriptionStatus).toUpperCase();
  const endAtRaw = Number(raw.subscriptionEndAt || 0);
  const endAt = Number.isFinite(endAtRaw) ? endAtRaw : 0;
  if (status && status !== "ACTIVE") return true;
  if (endAt > 0 && endAt <= Date.now()) return true;
  return false;
}

async function ownerSubscriptionBlocked(userId: string): Promise<boolean> {
  const safeUserId = safeText(userId);
  if (!safeUserId) return false;

  try {
    const ownerSnapshot = await getDoc(doc(db, "users", safeUserId));
    if (!ownerSnapshot.exists()) return false;
    const payload = ownerSnapshot.data() as DocumentData;
    const status = safeText(payload.subscriptionStatus).toUpperCase();
    const endAtRaw = Number(payload.subscriptionEndAt || 0);
    const endAt = Number.isFinite(endAtRaw) ? endAtRaw : 0;
    const blockedByStatus = status.length > 0 && status !== "ACTIVE";
    const blockedByDate = endAt > 0 && endAt <= Date.now();
    return blockedByStatus || blockedByDate;
  } catch {
    // Keep storefront visible if owner subscription cannot be read from client rules.
    return false;
  }
}

export function resolveStoreTheme(config: StoreConfig) {
  return (
    STORE_THEMES.find((theme) => theme.id === config.themeId) || STORE_THEMES[0]
  );
}

export function resolveStoreAccentColors(config: StoreConfig) {
  const theme = resolveStoreTheme(config);
  const accent = config.customRgb?.accent;
  const accent2 = config.customRgb?.accent2;

  const primary = accent
    ? `rgb(${safeInt(accent.r)}, ${safeInt(accent.g)}, ${safeInt(accent.b)})`
    : theme.accent;
  const secondary = accent2
    ? `rgb(${safeInt(accent2.r)}, ${safeInt(accent2.g)}, ${safeInt(accent2.b)})`
    : theme.accent2;

  return { primary, secondary };
}

export function formatStoreMoney(cents: number, currency: StoreConfig["currency"]) {
  const amount = Math.max(0, cents || 0) / 100;
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function createProductCategoryList(products: PublicStoreProduct[]): string[] {
  const set = new Set<string>();
  products.forEach((product) => {
    const category = safeText(product.category) || "General";
    set.add(category);
  });
  return ["Todos", ...Array.from(set)];
}

function normalizeStoreConfig(raw: DocumentData): StoreConfig {
  const fromDoc = (raw.storeConfig || {}) as Partial<StoreConfig>;
  const currency = safeText(fromDoc.currency || "PEN");
  const ecommerce = (fromDoc.ecommerce || {}) as NonNullable<StoreConfig["ecommerce"]>;

  return {
    storeName: safeText(fromDoc.storeName || raw.templateName || "Tienda"),
    tagline: safeText(fromDoc.tagline || "Catalogo online"),
    currency: currency === "USD" || currency === "EUR" ? currency : "PEN",
    themeId: normalizeThemeId(fromDoc.themeId),
    supportWhatsapp: safeText(fromDoc.supportWhatsapp || ""),
    primaryCta: safeText(fromDoc.primaryCta || "Comprar"),
    customRgb: fromDoc.customRgb || undefined,
    content: fromDoc.content
      ? {
          ...fromDoc.content,
          heroImagePositionX: normalizeImagePosition(fromDoc.content.heroImagePositionX, 50),
          heroImagePositionY: normalizeImagePosition(fromDoc.content.heroImagePositionY, 50),
          logoImagePositionX: normalizeImagePosition(fromDoc.content.logoImagePositionX, 50),
          logoImagePositionY: normalizeImagePosition(fromDoc.content.logoImagePositionY, 50),
        }
      : undefined,
    features: Array.isArray(fromDoc.features) ? fromDoc.features : undefined,
    ai: {
      enabled: fromDoc.ai?.enabled !== false,
      mode: fromDoc.ai?.mode === "pro" ? "pro" : "business",
      tone:
        fromDoc.ai?.tone === "premium" || fromDoc.ai?.tone === "directo"
          ? fromDoc.ai.tone
          : "comercial",
      promoFocus: safeText(fromDoc.ai?.promoFocus || ""),
      autoCopyEnabled: fromDoc.ai?.autoCopyEnabled !== false,
    },
    cart: {
      floatingButtonEnabled: fromDoc.cart?.floatingButtonEnabled !== false,
      floatingButtonLabel: safeText(fromDoc.cart?.floatingButtonLabel || "Carrito"),
    },
    widget: {
      enabled: fromDoc.widget?.enabled === true,
      mode: fromDoc.widget?.mode === "assistant" ? "assistant" : "whatsapp",
      title: safeText(fromDoc.widget?.title || "Asistente de tienda"),
      welcomeMessage:
        safeText(
          fromDoc.widget?.welcomeMessage ||
            "Hola, te ayudo con productos, precios y pedidos.",
        ) || "Hola, te ayudo con productos, precios y pedidos.",
      assistantPlaceholder:
        safeText(fromDoc.widget?.assistantPlaceholder || "Escribe tu consulta...") ||
        "Escribe tu consulta...",
      ctaLabel: safeText(fromDoc.widget?.ctaLabel || "Abrir chat"),
      position: fromDoc.widget?.position === "left" ? "left" : "right",
    },
    testimonials: normalizeTestimonials(fromDoc.testimonials),
    faq: normalizeFaq(fromDoc.faq),
    ecommerce: {
      deliveryEnabled: ecommerce.deliveryEnabled !== false,
      pickupEnabled: ecommerce.pickupEnabled !== false,
      inStoreEnabled: ecommerce.inStoreEnabled === true,
      shippingBaseFeeCents: safeInt(ecommerce.shippingBaseFeeCents, 0),
      freeShippingFromCents: safeInt(ecommerce.freeShippingFromCents, 0),
      yapeEnabled: ecommerce.yapeEnabled !== false,
      plinEnabled: ecommerce.plinEnabled !== false,
      transferEnabled: ecommerce.transferEnabled !== false,
      cashEnabled: ecommerce.cashEnabled !== false,
      cardEnabled: ecommerce.cardEnabled === true,
      termsRequired: ecommerce.termsRequired !== false,
      termsText:
        safeText(ecommerce.termsText || "Acepto terminos y condiciones de compra.") ||
        "Acepto terminos y condiciones de compra.",
    },
    storeSlug: resolveStoreSlug(fromDoc, safeText(raw.id), safeText(raw.storeSlug)),
  } as StoreConfig;
}

function normalizePublishedStore(docData: DocumentData, fallbackId: string): PublicStorefront {
  const id = safeText(docData.id) || fallbackId;
  const config = normalizeStoreConfig(docData);
  const slug = resolveStoreSlug(config, id, safeText(docData.storeSlug));
  const productsRaw = Array.isArray(docData.storeProducts) ? docData.storeProducts : [];
  const products = productsRaw
    .map((item: DocumentData, index: number) => normalizeStoreProduct(item, index))
    .filter((item) => item.active);

  return {
    id,
    userId: safeText(docData.userId),
    slug,
    config,
    products,
  };
}

async function queryPublishedStoreBySlug(slug: string) {
  const storeQuery = query(
    collection(db, CLONED_SITES_COLLECTION),
    where("source", "==", "store-builder"),
    where("published", "==", true),
    where("storeSlug", "==", slug),
    limit(1),
  );
  const snapshot = await getDocs(storeQuery);
  if (!snapshot.empty) {
    const payload = snapshot.docs[0].data() as DocumentData;
    if (isStoreAccessBlocked(payload)) return null;
    if (await ownerSubscriptionBlocked(safeText(payload.userId))) return null;
    return normalizePublishedStore(
      payload,
      snapshot.docs[0].id,
    );
  }
  return null;
}

async function queryPublishedStoreById(id: string) {
  const fallbackQuery = query(
    collection(db, CLONED_SITES_COLLECTION),
    where("source", "==", "store-builder"),
    where("published", "==", true),
    where("id", "==", id),
    limit(1),
  );
  const fallbackSnapshot = await getDocs(fallbackQuery);
  if (!fallbackSnapshot.empty) {
    const payload = fallbackSnapshot.docs[0].data() as DocumentData;
    if (isStoreAccessBlocked(payload)) return null;
    if (await ownerSubscriptionBlocked(safeText(payload.userId))) return null;
    return normalizePublishedStore(
      payload,
      fallbackSnapshot.docs[0].id,
    );
  }
  return null;
}

export async function getPublishedStoreBySlug(
  slug: string,
): Promise<PublicStorefront | null> {
  const normalized = sanitizeStoreSlug(slug);
  if (!normalized) return null;

  const bySlug = await queryPublishedStoreBySlug(normalized);
  if (bySlug) return bySlug;

  return queryPublishedStoreById(normalized);
}
