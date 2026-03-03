"use client";

import { CSSProperties, ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getLinkHubThemeColors,
  getSafeLinkHubCartaBackgroundMode,
  getSafeLinkHubTheme,
  recommendCartaThemeIdByLinkTheme,
  getPublishedLinkHubProfileBySlug,
  getSafeLinkHubFontFamily,
  getSafeLinkHubTextTone,
  hexToRgba,
  isValidExternalUrl,
  LINK_HUB_FONT_FAMILIES,
  LinkHubLinkType,
  LinkHubProfile,
  sanitizeSlug,
} from "@/lib/linkHubProfile";
import CartaThemeProvider from "@/theme/CartaThemeProvider";
import {
  CARTA_CUSTOM_DEFAULTS,
  getCartaTheme,
  getSafeCartaCustomStyle,
  getSafeCartaThemeId,
  recommendCartaThemeIdByRubro,
} from "@/theme/cartaThemes";
import ProductCard, { type ProductCardBadge } from "@/components/carta/ProductCard";
import StickyCategoryBar from "@/components/carta/StickyCategoryBar";
import FloatingCartButton from "@/components/carta/FloatingCartButton";
import RestaurantStatusChip from "@/components/carta/RestaurantStatusChip";
import CartaMenuSkeleton from "@/components/carta/CartaMenuSkeleton";
import {
  addItemToCartStore,
  patchCartItemQuantityStore,
  removeItemFromCartStore,
  type CartaCartItem,
} from "@/lib/cartaCartStore";
import { buildWhatsappSendUrl, normalizeWhatsappDigits } from "@/lib/whatsapp";
import {
  CalendarDays,
  AtSign,
  ChevronDown,
  ChevronUp,
  Facebook,
  Fish,
  Globe,
  Palette,
  MapPin,
  Minus,
  Menu,
  Phone,
  Plus,
  Search,
  Shirt,
  Store,
  SunMedium,
  Trash2,
  XCircle,
  Youtube,
  Instagram,
  Linkedin,
  Music2,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type PublicTab = "contact" | "catalog" | "location" | "reservation";
type CheckoutStep = "cart" | "checkout";
type DeliveryMethod = "delivery" | "pickup" | "dinein";
type PaymentMethod = "cash" | "transfer" | "yape" | "plin";
type GoldKeywordAction = "contact" | "catalog" | "location" | "reservation" | "call" | "whatsapp";

type CartItem = CartaCartItem;

const ORDER_DELIVERY_OPTIONS: Array<{ value: DeliveryMethod; label: string }> = [
  { value: "delivery", label: "Envio a domicilio" },
  { value: "pickup", label: "Recoger en local" },
  { value: "dinein", label: "Comer en el lugar" },
];

const ORDER_PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string }> = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "yape", label: "Yape" },
  { value: "plin", label: "Plin" },
];

const COUPON_DISCOUNTS: Record<string, number> = {
  FAST5: 0.05,
  FAST10: 0.1,
};

const AUTO_DISCOUNT_THRESHOLD = 80;
const AUTO_DISCOUNT_RATE = 0.05;

const LINK_TYPE_ICON = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircleIcon,
  x: AtSign,
} satisfies Record<LinkHubLinkType, ComponentType<{ className?: string }>>;

const SOCIAL_BRAND_STYLE: Record<
  LinkHubLinkType,
  { background: string; color: string }
> = {
  website: { background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", color: "#ffffff" },
  instagram: { background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 70%, #515bd4 100%)", color: "#ffffff" },
  facebook: { background: "#1877F2", color: "#ffffff" },
  tiktok: { background: "#111827", color: "#ffffff" },
  youtube: { background: "#FF0000", color: "#ffffff" },
  linkedin: { background: "#0A66C2", color: "#ffffff" },
  whatsapp: { background: "#25D366", color: "#ffffff" },
  x: { background: "#111827", color: "#ffffff" },
};

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.52 2 2.04 6.3 2.04 11.62c0 2.1.7 4.03 1.88 5.6L2 22l4.94-1.56a10.24 10.24 0 0 0 5.1 1.34c5.52 0 10-4.3 10-9.62S17.56 2 12.04 2Zm.02 17.98c-1.64 0-3.25-.44-4.64-1.28l-.33-.2-2.93.93.95-2.85-.21-.35a7.78 7.78 0 0 1-1.2-4.13c0-4.3 3.73-7.8 8.34-7.8 4.6 0 8.33 3.5 8.33 7.8 0 4.31-3.73 7.8-8.31 7.8Zm4.56-5.9c-.25-.13-1.47-.7-1.7-.78-.23-.09-.4-.13-.57.13-.16.26-.65.77-.8.93-.15.17-.3.2-.56.07-.25-.13-1.07-.38-2.03-1.2-.75-.64-1.25-1.42-1.4-1.66-.15-.25-.02-.39.11-.51.12-.12.25-.3.37-.45.12-.15.16-.26.25-.44.08-.18.04-.33-.02-.46-.07-.13-.57-1.35-.78-1.84-.2-.48-.4-.42-.57-.42h-.48c-.17 0-.45.06-.69.31-.24.25-.9.87-.9 2.11 0 1.25.92 2.46 1.05 2.63.13.16 1.8 2.75 4.36 3.85.61.26 1.1.42 1.47.54.62.2 1.19.18 1.63.1.5-.07 1.47-.6 1.68-1.18.21-.57.21-1.06.15-1.17-.06-.11-.22-.17-.47-.3Z" />
    </svg>
  );
}

function renderTitleWithAccent(value: string, accentColor: string) {
  const clean = value.trim();
  if (!clean) return value;
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return <span>{clean}</span>;
  }
  const tail = parts.pop() || "";
  return (
    <>
      <span>{parts.join(" ")} </span>
      <span style={{ color: accentColor }}>{tail}</span>
    </>
  );
}

function normalizeKeywordToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function resolveGoldKeywordAction(token: string): GoldKeywordAction | null {
  if (!token) return null;
  if (["carta", "menu", "catalogo", "productos", "platos"].includes(token)) return "catalog";
  if (["ubicacion", "mapa", "direccion", "local"].includes(token)) return "location";
  if (["reserva", "reservas", "mesa", "booking"].includes(token)) return "reservation";
  if (["contacto", "atencion", "clientes"].includes(token)) return "contact";
  if (["llamar", "telefono", "celular"].includes(token)) return "call";
  if (["whatsapp", "pedido", "pedidos"].includes(token)) return "whatsapp";
  return null;
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function toWhatsappUrl(raw: string): string {
  return buildWhatsappSendUrl(raw);
}

function parseHexColor(value: string): [number, number, number] | null {
  if (!value.startsWith("#")) return null;
  const hex = value.slice(1);
  if (hex.length === 3) {
    const r = Number.parseInt(hex[0] + hex[0], 16);
    const g = Number.parseInt(hex[1] + hex[1], 16);
    const b = Number.parseInt(hex[2] + hex[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return [r, g, b];
  }
  if (hex.length === 6) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return [r, g, b];
  }
  return null;
}

function resolvePriceColor(accentColor: string, useWhiteBackground: boolean): string {
  if (!useWhiteBackground) return accentColor;
  const rgb = parseHexColor(accentColor);
  if (!rgb) return "#0f172a";
  const [r, g, b] = rgb;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#0f172a" : accentColor;
}

function getButtonRadiusClass(shape: LinkHubProfile["buttonShape"]): string {
  if (shape === "pill") return "rounded-full";
  if (shape === "square") return "rounded-md";
  return "rounded-2xl";
}

function getCardClass(style: LinkHubProfile["cardStyle"]): string {
  if (style === "solid") return "border-[color:var(--carta-border)]";
  if (style === "outline") return "border-[color:var(--carta-border)] bg-transparent";
  return "border-[color:var(--carta-border)] backdrop-blur";
}

function getTextTonePalette(tone: LinkHubProfile["textTone"], primaryColor: string) {
  if (tone === "black") {
    return {
      base: "#111827",
      muted: "rgba(17,24,39,0.84)",
      soft: "rgba(17,24,39,0.72)",
      heading: "#0f172a",
      key: "#0f172a",
      inactive: "rgba(17,24,39,0.75)",
      active: "#0f172a",
      accent: "#0f172a",
      searchPlaceholder: "rgba(17,24,39,0.54)",
    };
  }
  if (tone === "gold") {
    return {
      base: "#fef3c7",
      muted: "#fde68a",
      soft: "rgba(253,230,138,0.8)",
      heading: "#fef3c7",
      key: "#fbbf24",
      inactive: "rgba(253,230,138,0.78)",
      active: "#fef3c7",
      accent: "#fbbf24",
      searchPlaceholder: "rgba(253,230,138,0.6)",
    };
  }
  if (tone === "blackGold") {
    return {
      base: "#0f172a",
      muted: "rgba(15,23,42,0.82)",
      soft: "rgba(15,23,42,0.68)",
      heading: "#fbbf24",
      key: "#f59e0b",
      inactive: "rgba(15,23,42,0.72)",
      active: "#fbbf24",
      accent: "#fbbf24",
      searchPlaceholder: "rgba(15,23,42,0.54)",
    };
  }
  return {
    base: "#f8fafc",
    muted: "rgba(248,250,252,0.88)",
    soft: "rgba(226,232,240,0.8)",
    heading: "#ffffff",
    key: primaryColor,
    inactive: "rgba(228,228,231,0.74)",
    active: "#ffffff",
    accent: primaryColor,
    searchPlaceholder: "rgba(212,212,216,0.74)",
  };
}

function parsePriceToNumber(raw: string): number {
  const normalized = raw
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=.*\.)/g, "")
    .replace(",", ".");
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatSoles(value: number): string {
  return `S/${value.toFixed(2)} SOLES`;
}

function resolvePriorityBadge(badge?: string): ProductCardBadge | null {
  const value = String(badge || "").toLowerCase();
  if (!value) return null;
  if (value.includes("pedido") || value.includes("top")) return "🔥 Más pedido";
  if (value.includes("favorito")) return "⭐ Favorito";
  if (value.includes("acaba") || value.includes("ultima")) return "🕒 Se acaba";
  return null;
}

function resolveRestaurantOpen(scheduleLines: string[]): boolean {
  if (!scheduleLines.length) return false;
  const normalized = scheduleLines.join(" ").toLowerCase();
  return !normalized.includes("cerrado");
}

function resolveEtaMinutes(scheduleLines: string[]): number {
  const match = scheduleLines.join(" ").match(/(\d{2})\s*min/i);
  if (!match) return 25;
  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) ? value : 25;
}

function parseClockToMinutes(value: string): number | null {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
}

function isNowInsideTimeRange(startTime: string, endTime: string, now = new Date()): boolean {
  const start = parseClockToMinutes(startTime);
  const end = parseClockToMinutes(endTime);
  if (start == null || end == null) return false;
  const current = now.getHours() * 60 + now.getMinutes();
  if (start === end) return true;
  if (start < end) {
    return current >= start && current <= end;
  }
  return current >= start || current <= end;
}

function postLinkHubMetric(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify({
      ...payload,
      ts: Date.now(),
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/linkhub/metrics/event", blob);
      return;
    }
    fetch("/api/linkhub/metrics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // no-op for analytics
  }
}

export default function PublicBioPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tx = (es: string, en: string) => (isEn ? en : es);

  const params = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<PublicTab>("contact");
  const [backgroundMode, setBackgroundMode] = useState<"theme" | "white">("theme");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const [shareFeedback, setShareFeedback] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [note, setNote] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartFeedback, setCartFeedback] = useState("");
  const [reservationName, setReservationName] = useState("");
  const [reservationGuests, setReservationGuests] = useState("2");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationSlot, setReservationSlot] = useState("");
  const [reservationContact, setReservationContact] = useState("");
  const [reservationNote, setReservationNote] = useState("");
  const [reservationError, setReservationError] = useState("");
  const [reservationFeedback, setReservationFeedback] = useState("");
  const [reservationPanelReady, setReservationPanelReady] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const tabContentAnchorRef = useRef<HTMLDivElement | null>(null);
  const catalogScrollRef = useRef<HTMLDivElement | null>(null);
  const catalogStickyRef = useRef<HTMLDivElement | null>(null);
  const categorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categoryChipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const slug = useMemo(() => sanitizeSlug(params?.slug || ""), [params?.slug]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const published = await getPublishedLinkHubProfileBySlug(slug);
        if (!active) return;

        if (!published) {
          setNotFound(true);
          return;
        }

        setProfile(published);
        setSelectedCategoryId(published.catalogCategories[0]?.id || "");
      } catch (error) {
        console.error("[PublicBio] Error loading profile:", error);
        setNotFound(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const automationConfig = profile?.automation;
  const hideOutOfStockEnabled = Boolean(profile?.proFeaturesUnlocked && automationConfig?.hideOutOfStock);
  const promoActive = Boolean(
    profile?.proFeaturesUnlocked &&
      automationConfig?.promoEnabled &&
      isNowInsideTimeRange(automationConfig?.promoStart || "", automationConfig?.promoEnd || ""),
  );
  const promoDiscountRate = promoActive
    ? Math.max(0, Math.min(0.9, Number(automationConfig?.promoDiscountPercent || 0) / 100))
    : 0;
  const catalogItems = (profile?.catalogItems ?? []).filter((item) =>
    hideOutOfStockEnabled ? !item.outOfStock : true,
  );
  const categorySections = (profile?.catalogCategories ?? [])
    .map((category) => {
      const items = catalogItems.filter((item) => {
        if (item.categoryId !== category.id) return false;
        if (!normalizedSearch) return true;
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch)
        );
      });
      return { ...category, items };
    })
    .filter((section) => section.items.length > 0);

  const totalFilteredItems = categorySections.reduce((acc, section) => acc + section.items.length, 0);
  const coverImages = [
    ...(profile?.coverImageUrls ?? []),
    profile?.coverImageUrl || "",
  ]
    .map((url) => String(url || "").trim())
    .filter(Boolean)
    .filter((url, index, source) => source.indexOf(url) === index)
    .slice(0, 5);

  useEffect(() => {
    if (activeTab !== "catalog") return;
    if (categorySections.length === 0) return;
    const exists = categorySections.some((section) => section.id === selectedCategoryId);
    if (!exists) {
      setSelectedCategoryId(categorySections[0].id);
    }
  }, [activeTab, categorySections, selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    const chip = categoryChipRefs.current[selectedCategoryId];
    chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedCategoryId]);

  useEffect(() => {
    if (activeCoverIndex >= coverImages.length) {
      setActiveCoverIndex(0);
    }
  }, [activeCoverIndex, coverImages.length]);

  useEffect(() => {
    if (activeTab !== "contact" || coverImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveCoverIndex((prev) => (prev + 1) % coverImages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [activeTab, coverImages.length]);

  const proFeaturesEnabled = Boolean(profile?.proFeaturesUnlocked);
  const proTestimonials = useMemo(
    () =>
      proFeaturesEnabled
        ? (profile?.proTestimonials || []).filter((entry) => String(entry.quote || "").trim().length > 0).slice(0, 5)
        : [],
    [profile?.proTestimonials, proFeaturesEnabled],
  );

  useEffect(() => {
    if (!proTestimonials.length) {
      setActiveTestimonialIndex(0);
      return;
    }
    if (activeTestimonialIndex >= proTestimonials.length) {
      setActiveTestimonialIndex(0);
    }
  }, [activeTestimonialIndex, proTestimonials.length]);

  useEffect(() => {
    if (activeTab !== "contact" || proTestimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveTestimonialIndex((current) => (current + 1) % proTestimonials.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [activeTab, proTestimonials.length]);

  useEffect(() => {
    if (!profile?.reservation?.enabled && activeTab === "reservation") {
      setActiveTab("contact");
    }
  }, [activeTab, profile?.reservation?.enabled]);

  useEffect(() => {
    if (!profile?.reservation?.enabled) {
      setReservationPanelReady(false);
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let disposed = false;
    const warmReservationPanel = () => {
      if (disposed) return;
      setReservationPanelReady(true);
    };

    if (typeof win.requestIdleCallback === "function") {
      const idleHandle = win.requestIdleCallback(() => warmReservationPanel(), { timeout: 1200 });
      return () => {
        disposed = true;
        win.cancelIdleCallback?.(idleHandle);
      };
    }

    const timer = window.setTimeout(() => warmReservationPanel(), 350);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
    };
  }, [profile?.reservation?.enabled]);

  useEffect(() => {
    if (!profile?.reservation?.enabled) return;
    const hero = String(profile.reservation.heroImageUrl || "").trim();
    if (!hero) return;
    const img = new Image();
    img.src = hero;
  }, [profile?.reservation?.enabled, profile?.reservation?.heroImageUrl]);

  useEffect(() => {
    if (!profile) return;
    setBackgroundMode(getSafeLinkHubCartaBackgroundMode(profile.cartaBackgroundMode));
  }, [profile?.cartaBackgroundMode, profile?.slug]);

  useEffect(() => {
    if (!profile?.slug) return;
    postLinkHubMetric({
      eventType: "page_view",
      ownerUserId: profile.userId,
      slug: profile.slug,
    });
  }, [profile?.slug, profile?.userId]);

  useEffect(() => {
    if (!profile?.reservation?.enabled) {
      if (reservationSlot) setReservationSlot("");
      return;
    }
    const slots = (profile.reservation.slotOptions || [])
      .map((slot) => String(slot || "").trim())
      .filter(Boolean)
      .slice(0, 12);
    if (!slots.length) {
      if (reservationSlot) setReservationSlot("");
      return;
    }
    if (!slots.includes(reservationSlot)) {
      setReservationSlot(slots[0]);
    }
  }, [profile?.reservation?.enabled, profile?.reservation?.slotOptions, reservationSlot]);

  useEffect(() => {
    if (!profile?.reservation?.enabled) return;
    const minParty = Math.max(1, Math.min(99, Math.round(Number(profile.reservation.minPartySize) || 1)));
    const maxFromProfile = Math.max(1, Math.min(99, Math.round(Number(profile.reservation.maxPartySize) || minParty)));
    const maxParty = Math.max(minParty, maxFromProfile);
    const requestedGuests = Math.round(Number(reservationGuests) || minParty);
    const clampedGuests = Math.max(minParty, Math.min(maxParty, requestedGuests));
    if (String(clampedGuests) !== reservationGuests) {
      setReservationGuests(String(clampedGuests));
    }
  }, [profile?.reservation?.enabled, profile?.reservation?.maxPartySize, profile?.reservation?.minPartySize, reservationGuests]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehaviorY;
    const prevBodyOverscroll = body.style.overscrollBehaviorY;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehaviorY = prevHtmlOverscroll;
      body.style.overscrollBehaviorY = prevBodyOverscroll;
    };
  }, []);

  if (loading) {
    return <CartaMenuSkeleton />;
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 text-slate-900 flex items-center justify-center">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold">{tx("Carta Digital", "Digital Menu")}</p>
          <h1 className="mt-3 text-3xl font-black">{tx("Perfil no disponible", "Profile unavailable")}</h1>
          <p className="mt-3 text-slate-600">
            {tx(
              "Este enlace no existe, no fue publicado o fue pausado por plan vencido. El negocio debe pagar para reactivarlo.",
              "This link doesn't exist, was not published, or was paused due to an expired plan. The business must pay to reactivate it.",
            )}
          </p>
        </div>
      </div>
    );
  }

  const themeKey = getSafeLinkHubTheme(profile.theme);
  const colors = getLinkHubThemeColors(themeKey, profile.themePrimaryColor, profile.themeSecondaryColor);
  const rubroHint =
    profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante / Cafeteria" : "Tienda / General");
  const cartaThemeId = getSafeCartaThemeId(
    profile.cartaThemeId || recommendCartaThemeIdByLinkTheme(profile.theme) || recommendCartaThemeIdByRubro(rubroHint),
  );
  const activeCartaTheme = getCartaTheme(cartaThemeId, {
    primary: profile.cartaCustomPrimaryColor || CARTA_CUSTOM_DEFAULTS.primary,
    secondary: profile.cartaCustomSecondaryColor || CARTA_CUSTOM_DEFAULTS.secondary,
    accent: profile.cartaCustomAccentColor || CARTA_CUSTOM_DEFAULTS.accent,
    style: getSafeCartaCustomStyle(profile.cartaCustomDesignStyle),
  });
  const useWhiteCartaBackground = backgroundMode === "white";
  const readablePriceColor = resolvePriceColor(activeCartaTheme.tokens.accent, useWhiteCartaBackground);
  const textTone = getSafeLinkHubTextTone(profile.textTone);
  const _legacyTextPalette = getTextTonePalette(textTone, colors.primary);
  const textPalette = {
    base: useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.text,
    muted: useWhiteCartaBackground ? "#475569" : activeCartaTheme.tokens.mutedText,
    soft: useWhiteCartaBackground ? "#64748b" : activeCartaTheme.tokens.mutedText,
    heading: useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.text,
    key: activeCartaTheme.tokens.primary,
    inactive: useWhiteCartaBackground ? "#64748b" : activeCartaTheme.tokens.navText,
    active: activeCartaTheme.tokens.primary,
    accent: activeCartaTheme.tokens.accent,
    searchPlaceholder: useWhiteCartaBackground ? "#94a3b8" : activeCartaTheme.tokens.placeholder,
  };
  const accentWordColor = activeCartaTheme.tokens.primary;
  const safeFont = getSafeLinkHubFontFamily(profile.fontFamily);
  const fontFamily = LINK_HUB_FONT_FAMILIES[safeFont].stack;

  const buttonRadiusClass = getButtonRadiusClass(profile.buttonShape);
  const cardClass = getCardClass(profile.cardStyle);
  const callHref = profile.phoneNumber ? `tel:${normalizePhone(profile.phoneNumber)}` : "";
  const whatsappHref = toWhatsappUrl(profile.whatsappNumber);
  const catalogLabel =
    profile.businessType === "restaurant" ? profile.sectionLabels.menu : profile.sectionLabels.catalog;
  const reservationLabel = profile.sectionLabels.reservation || tx("Reserva", "Booking");
  const reservationEnabled = Boolean(profile.reservation.enabled);
  const reservationSlots = profile.reservation.slotOptions
    .map((slot) => String(slot || "").trim())
    .filter(Boolean)
    .slice(0, 12);
  const reservationMinParty = Math.max(1, Math.min(99, Math.round(Number(profile.reservation.minPartySize) || 1)));
  const reservationMaxParty = Math.max(
    reservationMinParty,
    Math.min(99, Math.round(Number(profile.reservation.maxPartySize) || reservationMinParty)),
  );
  const reservationGuestsCount = Math.max(
    reservationMinParty,
    Math.min(reservationMaxParty, Math.round(Number(reservationGuests) || reservationMinParty)),
  );
  const reservationRequiresDeposit = reservationEnabled && Boolean(profile.reservation.requiresDeposit);
  const reservationDepositAmount = String(profile.reservation.depositAmount || "").trim();
  const reservationDepositInstructions = String(profile.reservation.depositInstructions || "").trim();
  const reservationHasDepositDetails =
    reservationRequiresDeposit &&
    (reservationDepositAmount.length > 0 || reservationDepositInstructions.length > 0);
  const visibleTabCount = reservationEnabled ? 4 : 3;
  const activateTab = (nextTab: PublicTab) => {
    const resolvedTab = nextTab === "reservation" && !reservationEnabled ? "contact" : nextTab;
    if (resolvedTab === "reservation") {
      setReservationPanelReady(true);
    }
    setActiveTab(resolvedTab);
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const anchor = tabContentAnchorRef.current;
      if (!anchor) return;
      const offset = window.innerWidth < 768 ? 14 : 22;
      const top = window.scrollY + anchor.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };
  const socialLinks = profile.links
    .filter((link) => isValidExternalUrl(link.url))
    .slice(0, 8);
  const businessName = profile.displayName || tx("Negocio", "Business");
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartQtyById = new Map<string, number>();
  for (const item of cartItems) {
    cartQtyById.set(item.id, item.quantity);
  }
  const autoDiscount = cartSubtotal >= AUTO_DISCOUNT_THRESHOLD ? cartSubtotal * AUTO_DISCOUNT_RATE : 0;
  const couponDiscountRate = appliedCouponCode ? COUPON_DISCOUNTS[appliedCouponCode] || 0 : 0;
  const couponDiscount = cartSubtotal * couponDiscountRate;
  const cartTotal = Math.max(0, cartSubtotal - autoDiscount - couponDiscount);
  const amountToAutoDiscount = Math.max(0, AUTO_DISCOUNT_THRESHOLD - cartSubtotal);
  const whatsappTargetDigits = normalizeWhatsappDigits(profile.whatsappNumber || profile.phoneNumber);
  const autoScheduleOpen = Boolean(
    profile.proFeaturesUnlocked &&
      profile.automation?.autoScheduleEnabled &&
      isNowInsideTimeRange(profile.automation.openTime, profile.automation.closeTime),
  );
  const isRestaurantOpen =
    profile.proFeaturesUnlocked && profile.automation?.autoScheduleEnabled
      ? autoScheduleOpen
      : resolveRestaurantOpen(profile.location.scheduleLines);
  const etaMinutes = resolveEtaMinutes(profile.location.scheduleLines);

  const deliveryLabelMap: Record<DeliveryMethod, string> = {
    delivery: tx("Envio a domicilio", "Home delivery"),
    pickup: tx("Recoger en local", "Store pickup"),
    dinein: tx("Comer en el lugar", "Dine in"),
  };
  const availableDeliveryOptions: Array<{ value: DeliveryMethod; label: string }> = (
    proFeaturesEnabled
      ? ORDER_DELIVERY_OPTIONS.filter((option) => profile?.proDeliveryModes?.[option.value] !== false)
      : ORDER_DELIVERY_OPTIONS
  ).map((option) => ({ ...option, label: deliveryLabelMap[option.value] }));
  const paymentLabelMap: Record<PaymentMethod, string> = {
    cash: tx("Efectivo", "Cash"),
    transfer: tx("Transferencia", "Bank transfer"),
    yape: "Yape",
    plin: "Plin",
  };

  const goldKeywordStyle: CSSProperties = {
    backgroundImage:
      "linear-gradient(180deg, rgba(255,248,220,1) 0%, rgba(252,211,77,1) 46%, rgba(217,119,6,1) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: useWhiteCartaBackground
      ? "0 0 10px rgba(217,119,6,0.26)"
      : "0 0 12px rgba(252,211,77,0.3), 0 1px 0 rgba(255,255,255,0.25)",
  };

  function onGoldKeywordClick(action: GoldKeywordAction) {
    if (action === "catalog") {
      activateTab("catalog");
      return;
    }
    if (action === "location") {
      activateTab("location");
      return;
    }
    if (action === "contact") {
      activateTab("contact");
      return;
    }
    if (action === "reservation") {
      activateTab("reservation");
      return;
    }
    if (action === "call") {
      if (callHref) {
        window.location.href = callHref;
      } else {
        activateTab("contact");
      }
      return;
    }
    if (whatsappHref) {
      postLinkHubMetric({
        eventType: "contact_whatsapp_click",
        ownerUserId: profile?.userId || "",
        slug: profile?.slug || slug,
      });
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    } else {
      activateTab("contact");
    }
  }

  function renderBioWithGoldKeywords(text: string) {
    const chunks = text.split(/(\s+)/);
    return chunks.map((chunk, index) => {
      if (!chunk.trim()) return <span key={`space-${index}`}>{chunk}</span>;
      const action = resolveGoldKeywordAction(normalizeKeywordToken(chunk));
      if (!action) return <span key={`txt-${index}`}>{chunk}</span>;
      return (
        <button
          key={`kw-${index}`}
          type="button"
          onClick={() => onGoldKeywordClick(action)}
          className="inline font-semibold underline-offset-4 transition hover:brightness-110 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] rounded-[0.35rem] px-0.5"
          style={goldKeywordStyle}
          title="Ir a esta seccion"
        >
          {chunk}
        </button>
      );
    });
  }

  function addItemToCart(
    item: LinkHubProfile["catalogItems"][number],
    categoryName: string,
  ) {
    const basePrice = parsePriceToNumber(item.price || "0");
    const unitPrice = promoDiscountRate > 0
      ? Math.max(0, basePrice * (1 - promoDiscountRate))
      : basePrice;
    const normalizedPriceLabel = unitPrice > 0 ? unitPrice.toFixed(2) : item.price || "0.00";
    const selectedImage =
      (proFeaturesEnabled
        ? (item.galleryImageUrls || []).find((url) => String(url || "").trim().length > 0)
        : undefined) || item.imageUrl || "";
    setCartItems((prev) =>
      addItemToCartStore(prev, {
        id: item.id,
        title: item.title || "Producto",
        imageUrl: selectedImage,
        categoryName,
        priceLabel: normalizedPriceLabel,
        unitPrice,
      }),
    );
    postLinkHubMetric({
      eventType: "cart_add",
      ownerUserId: profile?.userId || "",
      slug: profile?.slug || slug,
      itemId: item.id,
      itemTitle: item.title || "Producto",
      categoryId: item.categoryId,
      categoryName,
      quantity: 1,
    });
    setCartFeedback(`"${item.title || "Producto"}" agregado al pedido.`);
    setCartError("");
    window.setTimeout(() => setCartFeedback(""), 1400);
  }

  function removeCartItem(itemId: string) {
    setCartItems((prev) => removeItemFromCartStore(prev, itemId));
  }

  function patchCartItemQuantity(itemId: string, nextQty: number) {
    setCartItems((prev) => patchCartItemQuantityStore(prev, itemId, nextQty));
  }

  function clearCart() {
    setCartItems([]);
    setCheckoutStep("cart");
    setCouponInput("");
    setAppliedCouponCode("");
    setNote("");
    setAcceptedTerms(false);
    setCartError("");
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setAppliedCouponCode("");
      setCartError(tx("Ingresa un cupon para aplicar descuento.", "Enter a coupon to apply discount."));
      return;
    }
    if (!COUPON_DISCOUNTS[code]) {
      setAppliedCouponCode("");
      setCartError(tx("Cupon invalido. Prueba con FAST5 o FAST10.", "Invalid coupon. Try FAST5 or FAST10."));
      return;
    }
    setAppliedCouponCode(code);
    setCartError("");
  }

  function buildWhatsappOrderMessage(): string {
    const date = new Date();
    const orderRef = `FP-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
      date.getDate(),
    ).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
    const availableDeliveryValues = new Set(availableDeliveryOptions.map((option) => option.value));
    const selectedDelivery =
      deliveryMethod && availableDeliveryValues.has(deliveryMethod) ? deliveryMethod : "";
    const deliveryLabel =
      selectedDelivery && deliveryLabelMap[selectedDelivery]
        ? deliveryLabelMap[selectedDelivery]
        : availableDeliveryOptions[0]?.label || tx("Por confirmar", "Pending");
    const paymentLabel =
      paymentMethod && paymentLabelMap[paymentMethod]
        ? paymentLabelMap[paymentMethod]
        : tx("Por confirmar", "Pending");
    const itemLines = cartItems
      .map((item, index) => {
        const itemSubtotal = item.unitPrice * item.quantity;
        return [
          `${index + 1}. \u{1F37D}\u{FE0F} ${item.title} ${item.categoryName ? `(${item.categoryName})` : ""}`,
          `   ${tx("Cantidad", "Quantity")}: ${item.quantity}`,
          `   ${tx("Precio unitario", "Unit price")}: ${formatSoles(item.unitPrice)}`,
          `   Subtotal: ${formatSoles(itemSubtotal)}`,
        ].join("\n");
      })
      .join("\n\n");

    const discountLines = [
      autoDiscount > 0 ? `- ${tx("Descuento por compra", "Purchase discount")}: ${formatSoles(autoDiscount)}` : "",
      couponDiscount > 0 ? `- ${tx("Cupon", "Coupon")} (${appliedCouponCode}): ${formatSoles(couponDiscount)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const noteLine = note.trim() ? `- ${tx("Nota adicional", "Additional note")}: ${note.trim()}` : "";
    const customerLine = customerName.trim() ? `- ${tx("Nombre de referencia", "Reference name")}: ${customerName.trim()}` : "";
    const customerPhoneLine = customerPhone.trim() ? `- ${tx("Celular de referencia", "Reference phone")}: ${customerPhone.trim()}` : "";

    return [
      `\u{1F9FE} *${tx("Solicitud de pedido para", "Order request for")} ${businessName}*`,
      `\u{1F194} Ref: ${orderRef}`,
      "",
      `\u{1F44B} ${tx(`Hola equipo ${businessName}, quiero confirmar este pedido:`, `Hi ${businessName} team, I want to confirm this order:`)}`,
      "",
      `\u{1F9FE} *${tx("Detalle del pedido", "Order details")}*`,
      itemLines,
      "",
      `\u{1F4CC} *${tx("Datos para coordinar", "Coordination details")}*`,
      customerLine,
      customerPhoneLine,
      `- ${tx("Entrega", "Delivery")}: ${deliveryLabel}`,
      `- ${tx("Pago", "Payment")}: ${paymentLabel}`,
      noteLine,
      "",
      `\u{1F4B0} *${tx("Resumen", "Summary")}*`,
      `- Subtotal: ${formatSoles(cartSubtotal)}`,
      discountLines || `- ${tx("Descuentos", "Discounts")}: S/0.00 SOLES`,
      `- Total: ${formatSoles(cartTotal)}`,
      "",
      `\u{1F4F2} ${tx("Canal", "Channel")}: ${tx("Carta Digital FastPage", "FastPage Digital Menu")}`,
      `\u{1F552} ${tx("Pedido generado", "Order generated")}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      "",
      tx("\u{1F64F} Muchas gracias. Quedo atento(a) a su confirmacion. \u{2728}", "\u{1F64F} Thank you very much. I’ll be waiting for your confirmation. \u{2728}"),
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submitOrderWhatsapp() {
    if (cartItems.length === 0) {
      setCartError(tx("Tu carrito esta vacio. Agrega productos para continuar.", "Your cart is empty. Add products to continue."));
      return;
    }
    if (!whatsappTargetDigits) {
      setCartError(tx("Este negocio no tiene WhatsApp configurado aun.", "This business doesn't have WhatsApp configured yet."));
      return;
    }
    if (availableDeliveryOptions.length > 0 && !deliveryMethod) {
      setCartError(tx("Selecciona una opcion de entrega para continuar.", "Select a delivery option to continue."));
      return;
    }

    const text = buildWhatsappOrderMessage();
    postLinkHubMetric({
      eventType: "order_whatsapp",
      ownerUserId: profile?.userId || "",
      slug: profile?.slug || slug,
      totalAmount: cartTotal,
      items: cartItems.map((item) => ({
        categoryId: (profile?.catalogItems || []).find((entry) => entry.id === item.id)?.categoryId || "",
        itemId: item.id,
        itemTitle: item.title,
        categoryName: item.categoryName,
        quantity: item.quantity,
      })),
    });
    const url = buildWhatsappSendUrl(whatsappTargetDigits, text);
    window.open(url, "_blank", "noopener,noreferrer");
    setCartError("");
    setCartFeedback(tx("Pedido listo. Te estamos redirigiendo a WhatsApp.", "Order ready. Redirecting you to WhatsApp."));
  }

  function submitQuickOrderWhatsapp() {
    if (!whatsappTargetDigits) {
      setCartError(tx("Este negocio no tiene WhatsApp configurado aun.", "This business doesn't have WhatsApp configured yet."));
      return;
    }

    const date = new Date();
    const quickLines =
      cartItems.length > 0
        ? cartItems.map(
            (item, index) =>
              `${index + 1}. ${item.title} x${item.quantity} - ${formatSoles(item.unitPrice * item.quantity)}`,
          )
        : [tx("1. Quiero realizar un pedido y necesito asesoria.", "1. I want to place an order and need assistance.")];

    const text = [
      tx(
        `\u{1F44B} Hola equipo ${businessName}, les escribo desde su Carta Digital FastPage.`,
        `\u{1F44B} Hi ${businessName} team, I'm contacting you from your FastPage Digital Menu.`,
      ),
      "",
      `\u{1F9FE} *${tx("Resumen rapido de mi pedido", "Quick summary of my order")}*`,
      ...quickLines,
      "",
      `\u{1F4B0} ${tx("Total estimado", "Estimated total")}: ${formatSoles(cartTotal)}`,
      `\u{1F552} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      "",
      tx("Quedo atento(a) para confirmar mi pedido. Gracias.", "I'll wait for your confirmation. Thanks."),
    ].join("\n");

    postLinkHubMetric({
      eventType: "order_whatsapp",
      ownerUserId: profile?.userId || "",
      slug: profile?.slug || slug,
      totalAmount: cartTotal,
      source: "floating_button",
      items: cartItems.map((item) => ({
        categoryId: (profile?.catalogItems || []).find((entry) => entry.id === item.id)?.categoryId || "",
        itemId: item.id,
        itemTitle: item.title,
        categoryName: item.categoryName,
        quantity: item.quantity,
      })),
    });

    const url = buildWhatsappSendUrl(whatsappTargetDigits, text);
    window.open(url, "_blank", "noopener,noreferrer");
    setCartError("");
    setCartFeedback(tx("Te estamos redirigiendo a WhatsApp.", "Redirecting you to WhatsApp."));
  }

  function submitReservationWhatsapp() {
    if (!reservationEnabled) {
      setActiveTab("contact");
      return;
    }
    if (!whatsappTargetDigits) {
      setReservationError(tx("Este negocio no tiene WhatsApp configurado para reservas.", "This business doesn't have WhatsApp configured for bookings."));
      return;
    }
    const cleanName = reservationName.trim();
    if (!cleanName) {
      setReservationError(tx("Ingresa tu nombre para enviar la reserva.", "Enter your name to send the booking."));
      return;
    }
    if (!reservationDate) {
      setReservationError(tx("Selecciona una fecha para la reserva.", "Select a date for the booking."));
      return;
    }
    const requestedGuests = Math.round(Number(reservationGuests) || reservationMinParty);
    const guests = Math.max(reservationMinParty, Math.min(reservationMaxParty, requestedGuests));
    const selectedSlot = reservationSlot || reservationSlots[0] || tx("Por coordinar", "To be confirmed");
    const cleanContact = reservationContact.trim();
    const cleanNote = reservationNote.trim();
    const date = new Date();
    const reservationDataLines = [
      `\u{00B7} ${tx("Nombre", "Name")}: ${cleanName}`,
      `\u{00B7} ${tx("Personas", "Guests")}: ${guests}`,
      `\u{00B7} ${tx("Fecha", "Date")}: ${reservationDate}`,
      `\u{00B7} ${tx("Horario", "Time")}: ${selectedSlot}`,
      cleanContact ? `\u{00B7} ${tx("Contacto", "Contact")}: ${cleanContact}` : "",
      cleanNote ? `\u{00B7} ${tx("Nota", "Note")}: ${cleanNote}` : "",
    ].filter(Boolean);
    const depositLines = reservationHasDepositDetails
      ? [
          `\u{1F4B3} *${tx("Anticipo para confirmar", "Deposit to confirm")}*`,
          "",
          ...(reservationDepositAmount ? [`\u{00B7} ${tx("Monto sugerido", "Suggested amount")}: ${reservationDepositAmount}`] : []),
          ...(reservationDepositInstructions ? [`\u{00B7} ${tx("Instrucciones", "Instructions")}: ${reservationDepositInstructions}`] : []),
        ]
      : [];

    const lines = [
      `\u{1F37D}\u{FE0F} *${tx("Solicitud de reserva para", "Booking request for")} ${businessName}*`,
      "",
      tx(`\u{1F44B} Hola equipo ${businessName}, quiero agendar una reserva:`, `\u{1F44B} Hi ${businessName} team, I'd like to schedule a booking:`),
      "",
      `\u{1F4CB} *${tx("Datos de reserva", "Booking details")}:*`,
      "",
      ...reservationDataLines,
      ...(depositLines.length > 0 ? ["", ...depositLines] : []),
      "",
      `\u{1F552} *${tx("Solicitud enviada", "Request sent")}:* ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      "",
      tx("\u{1F64F} Gracias. Quedo atento(a) a su confirmacion por WhatsApp.", "\u{1F64F} Thanks. I’ll wait for your confirmation on WhatsApp."),
    ].join("\n");

    postLinkHubMetric({
      eventType: "reservation_whatsapp",
      ownerUserId: profile?.userId || "",
      slug: profile?.slug || slug,
      quantity: guests,
    });
    const url = buildWhatsappSendUrl(whatsappTargetDigits, lines);
    window.open(url, "_blank", "noopener,noreferrer");
    setReservationError("");
    setReservationFeedback(tx("Reserva lista. Te estamos redirigiendo a WhatsApp.", "Booking ready. Redirecting you to WhatsApp."));
    window.setTimeout(() => setReservationFeedback(""), 2200);
  }

  async function handleShare() {
    if (!profile) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile.displayName,
          text: tx(`Mira ${profile.displayName} en Fast Page`, `Check out ${profile.displayName} on Fast Page`),
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareFeedback(tx("Enlace copiado", "Link copied"));
        window.setTimeout(() => setShareFeedback(""), 1800);
      }
    } catch {
      // user cancelled share dialog
    }
  }

  function scrollToCategory(categoryId: string) {
    setSelectedCategoryId(categoryId);
    const categoryMeta = categorySections.find((entry) => entry.id === categoryId);
    postLinkHubMetric({
      eventType: "category_view",
      ownerUserId: profile?.userId || "",
      slug: profile?.slug || slug,
      categoryId,
      categoryName: categoryMeta?.name || "Categoria",
    });
    const container = catalogScrollRef.current;
    const target = categorySectionRefs.current[categoryId];
    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const stickyHeight = catalogStickyRef.current?.offsetHeight || 0;
    const nextTop = container.scrollTop + (targetRect.top - containerRect.top) - stickyHeight - 8;
    container.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
  }

  function handleCatalogScroll() {
    const container = catalogScrollRef.current;
    if (!container || categorySections.length === 0) return;

    const containerTop = container.getBoundingClientRect().top;
    const stickyHeight = catalogStickyRef.current?.offsetHeight || 0;
    const threshold = containerTop + stickyHeight + 8;
    let activeId = categorySections[0].id;

    for (const section of categorySections) {
      const node = categorySectionRefs.current[section.id];
      if (!node) continue;
      const top = node.getBoundingClientRect().top;
      if (top <= threshold) {
        activeId = section.id;
      } else {
        break;
      }
    }

    if (activeId !== selectedCategoryId) {
      setSelectedCategoryId(activeId);
    }
  }

  const menuGradientSoft = useWhiteCartaBackground
    ? "#ffffff"
    : activeCartaTheme.tokens.navBg;
  const menuGradientActive = activeCartaTheme.tokens.navActiveBg;
  const menuBorder = activeCartaTheme.tokens.chipBorder;

  const pageStyle: CSSProperties = {
    "--carta-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.background,
    "--carta-surface": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.surface,
    "--carta-surface-2": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.surface2,
    "--carta-text": useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.text,
    "--carta-muted-text": useWhiteCartaBackground ? "#475569" : activeCartaTheme.tokens.mutedText,
    "--carta-border": useWhiteCartaBackground ? "rgba(15,23,42,0.12)" : activeCartaTheme.tokens.border,
    "--carta-shadow": useWhiteCartaBackground
      ? "0 18px 34px -26px rgba(15,23,42,0.28)"
      : activeCartaTheme.tokens.shadow,
    "--carta-input-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.inputBg,
    "--carta-input-text": useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.inputText,
    "--carta-placeholder": useWhiteCartaBackground ? "#94a3b8" : activeCartaTheme.tokens.placeholder,
    "--carta-input-border": useWhiteCartaBackground ? "rgba(15,23,42,0.16)" : activeCartaTheme.tokens.inputBorder,
    "--carta-button-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.buttonBg,
    "--carta-button-text": useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.buttonText,
    "--carta-button-secondary-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.buttonSecondaryBg,
    "--carta-gradient-hero": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.gradientHero,
    "--carta-chip-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.chipBg,
    "--carta-chip-text": useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.chipText,
    "--carta-chip-active-bg": menuGradientActive,
    "--carta-chip-active-text": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.chipActiveText,
    "--carta-chip-border": menuBorder,
    "--carta-nav-bg": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.navBg,
    "--carta-nav-active-bg": menuGradientActive,
    "--carta-nav-active-text": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.navActiveText,
    "--carta-nav-text": useWhiteCartaBackground ? "#0f172a" : activeCartaTheme.tokens.navText,
    "--carta-badge-bg": useWhiteCartaBackground
      ? "linear-gradient(135deg, #fb7185 0%, #f97316 100%)"
      : activeCartaTheme.tokens.badgeBg,
    "--carta-badge-text": useWhiteCartaBackground ? "#ffffff" : activeCartaTheme.tokens.badgeText,
    "--carta-accent": activeCartaTheme.tokens.accent,
    "--carta-price-color": readablePriceColor,
    "--carta-primary": activeCartaTheme.tokens.primary,
    "--carta-primary-hover": activeCartaTheme.tokens.primaryHover,
    background: "var(--carta-bg)",
  } as CSSProperties;

  const wrapperStyle = {
    borderColor: "var(--carta-border)",
    fontFamily,
    color: "var(--carta-text)",
    background: "var(--carta-surface)",
    boxShadow: useWhiteCartaBackground ? "0 24px 50px -36px rgba(15,23,42,0.4)" : "var(--carta-shadow)",
  };

  const interactiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: useWhiteCartaBackground ? "0 12px 24px -18px rgba(15,23,42,0.32)" : "var(--carta-shadow)",
    color: "var(--carta-nav-active-text)",
  };

  const chipActiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: useWhiteCartaBackground ? "0 12px 24px -18px rgba(15,23,42,0.28)" : "var(--carta-shadow)",
    color: "var(--carta-chip-active-text)",
  };

  const navActiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: useWhiteCartaBackground ? "0 14px 24px -18px rgba(15,23,42,0.3)" : "var(--carta-shadow)",
    color: "var(--carta-nav-active-text)",
  };

  const badgeStyle = {
    borderColor: "var(--carta-chip-border)",
    background: "var(--carta-badge-bg)",
    color: "var(--carta-badge-text)",
  };

  const headerBarStyle = {
    borderColor: "var(--carta-border)",
    background: "var(--carta-gradient-hero)",
  };

  const avatarFallbackStyle = {
    borderColor: menuBorder,
    background: menuGradientSoft,
  };

  const cardSurfaceStyle =
    profile.cardStyle === "solid"
      ? {
          background: "var(--carta-surface-2)",
        }
      : profile.cardStyle === "outline"
      ? { background: "transparent" }
      : {
          background: "var(--carta-surface)",
          backdropFilter: useWhiteCartaBackground ? "none" : "blur(12px)",
        };

  const catalogStickyStyle = {
    borderColor: "var(--carta-border)",
    background: "var(--carta-surface)",
    boxShadow: useWhiteCartaBackground ? "0 10px 18px -16px rgba(15,23,42,0.36)" : "var(--carta-shadow)",
  };

  const searchSurfaceStyle = {
    borderColor: "var(--carta-input-border)",
    background: "var(--carta-input-bg)",
    color: "var(--carta-input-text)",
  };

  const navSurfaceStyle = {
    borderColor: menuBorder,
    background: menuGradientSoft,
  };

  const itemSurfaceStyle = {
    background: "var(--carta-surface-2)",
    boxShadow: useWhiteCartaBackground ? "0 10px 22px -18px rgba(15,23,42,0.35)" : "var(--carta-shadow)",
  };

  const contactActionStyle = {
    borderColor: "var(--carta-chip-border)",
    background: "var(--carta-nav-active-bg)",
    color: "var(--carta-nav-active-text)",
    boxShadow: useWhiteCartaBackground ? "0 12px 22px -18px rgba(15,23,42,0.34)" : "var(--carta-shadow)",
  };

  const cartPanelStyle = {
    borderColor: "var(--carta-border)",
    background: "var(--carta-surface)",
  };

  const checkoutInputStyle = {
    borderColor: "var(--carta-input-border)",
    color: "var(--carta-input-text)",
    background: "var(--carta-input-bg)",
  };

  return (
    <CartaThemeProvider
      themeId={cartaThemeId}
      className="h-[100dvh] overflow-hidden px-2 pb-3 pt-4 md:px-6 md:pb-8 md:pt-10"
      style={pageStyle}
    >
      <div
        className="mx-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-[2.45rem] border md:max-w-5xl md:rounded-[2.75rem]"
        style={wrapperStyle}
      >
        <div
          className={`border-b px-3 md:px-8 ${activeTab === "contact" ? "py-3" : "py-2"}`}
          style={headerBarStyle}
        >
          <div className="relative space-y-1.5 md:space-y-0">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex min-w-0 items-center gap-2">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full border object-cover"
                  style={avatarFallbackStyle}
                />
              ) : (
                <div
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full border flex items-center justify-center text-sm font-black"
                  style={avatarFallbackStyle}
                >
                  {profile.displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <span className="truncate text-xs md:text-sm font-semibold" style={{ color: textPalette.muted }}>
                {profile.displayName}
              </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex h-10 items-center gap-1 rounded-xl border p-1"
                  style={{
                    borderColor: "var(--carta-chip-border)",
                    background: "var(--carta-button-secondary-bg)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setBackgroundMode("theme")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition md:h-8 md:w-auto md:px-2.5"
                    style={
                      backgroundMode === "theme"
                        ? {
                            borderColor: "transparent",
                            background: "var(--carta-nav-active-bg)",
                            color: "var(--carta-nav-active-text)",
                            boxShadow: useWhiteCartaBackground
                              ? "0 10px 20px -14px rgba(15,23,42,0.35)"
                              : "var(--carta-shadow)",
                          }
                        : {
                            borderColor: "transparent",
                            color: "var(--carta-nav-text)",
                          }
                    }
                    aria-label={tx("Usar fondo del tema", "Use theme background")}
                    title={tx("Modo tema", "Theme mode")}
                  >
                    <Palette className="h-4 w-4" />
                    <span className="hidden pl-1 text-[10px] font-black uppercase tracking-[0.09em] md:inline">{tx("Tema", "Theme")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackgroundMode("white")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition md:h-8 md:w-auto md:px-2.5"
                    style={
                      backgroundMode === "white"
                        ? {
                            borderColor: "transparent",
                            background: "var(--carta-nav-active-bg)",
                            color: "var(--carta-nav-active-text)",
                            boxShadow: useWhiteCartaBackground
                              ? "0 10px 20px -14px rgba(15,23,42,0.35)"
                              : "var(--carta-shadow)",
                          }
                        : {
                            borderColor: "transparent",
                            color: "var(--carta-nav-text)",
                          }
                    }
                    aria-label={tx("Usar fondo claro", "Use light background")}
                    title={tx("Modo claro", "Light mode")}
                  >
                    <SunMedium className="h-4 w-4" />
                    <span className="hidden pl-1 text-[10px] font-black uppercase tracking-[0.09em] md:inline">{tx("Claro", "Light")}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                  style={{ borderColor: "var(--carta-chip-border)", color: "var(--carta-text)", background: "var(--carta-button-secondary-bg)" }}
                  aria-label={tx("Compartir", "Share")}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          {shareFeedback && (
            <p
              className="mt-2 text-xs font-semibold"
              style={{ color: useWhiteCartaBackground ? "#16a34a" : "#86efac" }}
            >
              {shareFeedback}
            </p>
          )}
        </div>

        <div
          className="hidden md:grid gap-3 px-8 pb-6 pt-1"
          style={{ gridTemplateColumns: `repeat(${visibleTabCount}, minmax(0, 1fr))` }}
        >
          <button
            type="button"
            onClick={() => activateTab("contact")}
            aria-pressed={activeTab === "contact"}
            className="rounded-[1.1rem] border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
            style={
              activeTab === "contact"
                ? navActiveStyle
                : {
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-nav-text)",
                  }
            }
          >
            {profile.sectionLabels.contact}
          </button>
          <button
            type="button"
            onClick={() => activateTab("catalog")}
            aria-pressed={activeTab === "catalog"}
            className="rounded-[1.1rem] border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
            style={
              activeTab === "catalog"
                ? navActiveStyle
                : {
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-nav-text)",
                  }
            }
          >
            {catalogLabel}
          </button>
          <button
            type="button"
            onClick={() => activateTab("location")}
            aria-pressed={activeTab === "location"}
            className="rounded-[1.1rem] border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
            style={
              activeTab === "location"
                ? navActiveStyle
                : {
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-nav-text)",
                  }
            }
          >
            {profile.sectionLabels.location}
          </button>
          {reservationEnabled ? (
            <button
              type="button"
              onClick={() => activateTab("reservation")}
              aria-pressed={activeTab === "reservation"}
              className="rounded-[1.1rem] border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
              style={
                activeTab === "reservation"
                  ? navActiveStyle
                  : {
                      borderColor: "var(--carta-chip-border)",
                      color: "var(--carta-nav-text)",
                    }
              }
            >
              {reservationLabel}
            </button>
          ) : null}
        </div>

        <div ref={tabContentAnchorRef} className="h-0 w-full" aria-hidden="true" />

        {activeTab === "contact" ? (
          <>
            <div className="relative">
              {coverImages.length > 0 ? (
                <div className="relative h-48 md:h-72 w-full overflow-hidden">
                  {coverImages.map((imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`Portada ${index + 1}`}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                        index === activeCoverIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
                      }`}
                    />
                  ))}
                  {coverImages.length > 1 && (
                    <div
                      className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-2 py-1 backdrop-blur"
                      style={{
                        borderColor: "var(--carta-chip-border)",
                        background: "var(--carta-button-bg)",
                      }}
                    >
                      {coverImages.map((_, index) => (
                        <span
                          key={`cover-dot-${index}`}
                          className={`h-1.5 w-1.5 rounded-full transition ${
                            index === activeCoverIndex ? "bg-white" : "bg-white/45"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="h-40 md:h-64 w-full"
                  style={{
                    background: "var(--carta-gradient-hero)",
                  }}
                />
              )}

              <div className="absolute inset-x-0 -bottom-14 flex justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 object-cover"
                    style={{
                      borderColor: "var(--carta-chip-border)",
                      background: avatarFallbackStyle.background,
                    }}
                  />
                ) : (
                  <div
                    className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 flex items-center justify-center text-3xl md:text-4xl font-black"
                    style={{
                      borderColor: "var(--carta-chip-border)",
                      background: avatarFallbackStyle.background,
                    }}
                  >
                    {profile.displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 md:px-8 pt-20 md:pt-24 pb-4 text-center">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: textPalette.heading }}>
                {renderTitleWithAccent(profile.displayName, accentWordColor)}
              </h1>
              <p className="mt-2 text-sm md:text-base uppercase tracking-[0.18em]" style={{ color: "var(--carta-accent)" }}>
                {profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante" : "Tienda online")}
              </p>
              {profile.businessType === "restaurant" ? (
                <RestaurantStatusChip isOpen={isRestaurantOpen} etaMinutes={etaMinutes} className="mt-3" />
              ) : null}
              {promoDiscountRate > 0 ? (
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                  {profile.automation?.promoLabel || "Promo activa"}: -{Math.round(promoDiscountRate * 100)}% en franja horaria
                </p>
              ) : null}
              {profile.bio && (
                <p className="mt-3 text-sm md:text-base" style={{ color: textPalette.muted }}>
                  {renderBioWithGoldKeywords(profile.bio)}
                </p>
              )}
            </div>

            <div className="px-4 md:px-8 pb-4 flex items-center justify-center flex-wrap gap-2.5">
              {socialLinks.map((link) => {
                const Icon = LINK_TYPE_ICON[link.type];
                const brandStyle = SOCIAL_BRAND_STYLE[link.type];
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)]"
                    style={{
                      background: brandStyle.background,
                      color: brandStyle.color,
                      boxShadow: "0 8px 18px -14px rgba(15,23,42,0.9)",
                    }}
                    aria-label={link.title || link.type}
                    title={link.title || link.type}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </>
        ) : null}

        <div className="flex-1 overflow-hidden px-4 pb-24 pt-2 md:px-8 md:pb-6 md:pt-0">
          {activeTab === "contact" && (
            <section
              className={`flex h-full min-h-0 flex-col overflow-y-auto pr-1 no-scrollbar rounded-[1.9rem] border p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0 ${cardClass}`}
              style={{ borderColor: "var(--carta-border)", background: "transparent", boxShadow: "none", backdropFilter: "none" }}
            >
              <h2 className="text-2xl font-black md:hidden" style={{ color: accentWordColor }}>
                {profile.sectionLabels.contact}
              </h2>
              <p className="mt-1 text-sm md:hidden" style={{ color: textPalette.muted }}>
                Atiende clientes directo desde tu canal favorito.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:mt-5 md:grid-cols-2 md:items-stretch md:gap-4">
                {callHref && (
                  <a
                    href={callHref}
                    className={`flex w-full min-h-12 items-center justify-center gap-2 border px-4 py-3 text-center font-bold transition hover:-translate-y-0.5 active:scale-[0.98] md:min-h-[3.25rem] ${!whatsappHref ? "md:col-span-2" : ""} ${buttonRadiusClass}`}
                    style={contactActionStyle}
                  >
                    <Phone className="h-4 w-4" />
                    Llamar ahora
                  </a>
                )}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      postLinkHubMetric({
                        eventType: "contact_whatsapp_click",
                        ownerUserId: profile.userId,
                        slug: profile.slug,
                      });
                    }}
                    className={`flex w-full min-h-12 items-center justify-center gap-2 border px-4 py-3 text-center font-bold transition hover:-translate-y-0.5 active:scale-[0.98] md:min-h-[3.25rem] ${!callHref ? "md:col-span-2" : ""} ${buttonRadiusClass}`}
                    style={contactActionStyle}
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    Escribir ahora
                  </a>
                )}
              </div>
              {proTestimonials.length > 0 ? (
                <div className="mt-4 rounded-2xl border p-3 md:mt-5 md:p-4" style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
                  <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: accentWordColor }}>
                    Testimonios reales
                  </p>
                  <div className="relative mt-2 min-h-[108px]">
                    {proTestimonials.map((testimonial, index) => {
                      const isActive = index === activeTestimonialIndex;
                      return (
                        <article
                          key={testimonial.id}
                          className={`absolute inset-0 rounded-xl border p-3 transition-all duration-700 ${
                            isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1.5 opacity-0"
                          }`}
                          style={{
                            borderColor: "var(--carta-chip-border)",
                            background: "var(--carta-surface-2)",
                          }}
                        >
                          <p className="text-sm font-semibold leading-relaxed" style={{ color: textPalette.heading }}>
                            “{testimonial.quote}”
                          </p>
                          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: textPalette.muted }}>
                            {testimonial.author} · {testimonial.role || "Cliente"}
                          </p>
                          <p className="mt-1 text-xs" style={{ color: accentWordColor }}>
                            {"★".repeat(Math.max(1, Math.min(5, Number(testimonial.rating) || 5)))}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    {proTestimonials.map((testimonial, index) => (
                      <span
                        key={`dot-${testimonial.id}`}
                        className={`h-1.5 w-5 rounded-full transition ${
                          index === activeTestimonialIndex ? "opacity-100" : "opacity-35"
                        }`}
                        style={{ background: accentWordColor }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          )}

          {activeTab === "catalog" && (
            <section className={`flex h-full flex-col overflow-hidden rounded-[1.9rem] border p-4 ${cardClass}`} style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
              <div className="hidden md:flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black" style={{ color: accentWordColor }}>
                  {catalogLabel}
                </h2>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: "var(--carta-chip-border)", color: "var(--carta-chip-text)" }}>
                    {profile.businessType === "restaurant" ? <Fish className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                    {totalFilteredItems}
                  </div>
                </div>
              </div>

              <div
                ref={catalogScrollRef}
                onScroll={handleCatalogScroll}
                className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1 no-scrollbar md:mt-4"
              >
                <div
                  ref={catalogStickyRef}
                  className="sticky top-0 z-30 -mx-1 mb-3 border-b px-1 pb-3 pt-1 shadow-[0_12px_22px_-18px_rgba(0,0,0,0.45)] backdrop-blur"
                  style={catalogStickyStyle}
                >
                  <label className="flex items-center gap-2 rounded-2xl border px-3 py-2" style={searchSurfaceStyle}>
                    <Search className="h-4 w-4" style={{ color: textPalette.soft }} />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={profile.businessType === "restaurant" ? tx("Buscar en la carta...", "Search in menu...") : tx("Buscar en el catalogo...", "Search in catalog...")}
                      className="w-full bg-transparent text-sm focus:outline-none placeholder:[color:var(--carta-placeholder)]"
                      style={{ color: "var(--carta-input-text)" }}
                    />
                  </label>

                  <StickyCategoryBar
                    categories={categorySections.map((category) => ({
                      id: category.id,
                      name: category.name,
                      emoji: category.emoji,
                    }))}
                    activeId={selectedCategoryId}
                    onSelect={scrollToCategory}
                    buttonShapeClass={buttonRadiusClass}
                    getButtonRef={(categoryId, node) => {
                      categoryChipRefs.current[categoryId] = node;
                    }}
                  />
                </div>

                {categorySections.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--carta-border)", color: textPalette.muted }}>
                    No hay productos para el filtro actual.
                  </div>
                )}

                <div className="space-y-6">
                  {categorySections.map((section) => (
                    <div
                      key={section.id}
                      ref={(node) => {
                        categorySectionRefs.current[section.id] = node;
                      }}
                      className="scroll-mt-24"
                    >
                      <h3 className="text-3xl md:text-2xl font-black tracking-tight" style={{ color: accentWordColor }}>
                        {section.name}
                      </h3>
                      <div className="mt-3 space-y-3">
                        {section.items.map((item) => {
                          const basePrice = parsePriceToNumber(item.price || "0");
                          const discountedPrice = promoDiscountRate > 0
                            ? Math.max(0, basePrice * (1 - promoDiscountRate))
                            : basePrice;
                          const displayPrice = discountedPrice > 0 ? discountedPrice.toFixed(2) : item.price || "0.00";
                          const displayOldPrice =
                            promoDiscountRate > 0 && basePrice > 0
                              ? basePrice.toFixed(2)
                              : item.compareAtPrice ||
                                (() => {
                                  if (!basePrice) return undefined;
                                  return (basePrice * 1.2).toFixed(2);
                                })();
                          const promoBadge =
                            promoDiscountRate > 0
                              ? `${profile.automation?.promoLabel || "Promo"} -${Math.round(promoDiscountRate * 100)}%`
                              : "";
                          return (
                            <ProductCard
                              key={item.id}
                              className={cardClass}
                              title={item.title}
                              description={item.description}
                              salesCopy={proFeaturesEnabled ? item.salesCopy : undefined}
                              imageUrl={item.imageUrl}
                              galleryImageUrls={proFeaturesEnabled ? item.galleryImageUrls : []}
                              oldPrice={displayOldPrice}
                              price={displayPrice}
                              badge={(promoBadge || "").trim() || undefined}
                              priorityBadge={resolvePriorityBadge((promoBadge || "").trim())}
                              emojiFallback={section.emoji || (profile.businessType === "restaurant" ? "🍽️" : "🛍️")}
                              onAdd={() => addItemToCart(item, section.name)}
                              quantity={cartQtyById.get(item.id) || 0}
                              onIncrement={() => addItemToCart(item, section.name)}
                              onDecrement={() => patchCartItemQuantity(item.id, (cartQtyById.get(item.id) || 0) - 1)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "location" && (
            <section className={`h-full overflow-hidden rounded-[1.9rem] border p-4 ${cardClass}`} style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
              <h2 className="hidden md:block text-2xl font-black" style={{ color: accentWordColor }}>
                {profile.sectionLabels.location}
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--carta-border)" }}>
                {profile.location.mapEmbedUrl ? (
                  <iframe
                    title={`Mapa de ${profile.displayName}`}
                    src={profile.location.mapEmbedUrl}
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="h-64 w-full flex items-center justify-center px-6 text-center" style={{ ...itemSurfaceStyle, color: textPalette.muted }}>
                    {tx("Agrega un link de Google Maps Embed para mostrar el mapa.", "Add a Google Maps Embed link to show the map.")}
                  </div>
                )}
              </div>

              {profile.location.address && (
                <div className="mt-4">
                  <h3 className="text-3xl font-black leading-tight" style={{ color: textPalette.heading }}>
                    {profile.location.address}
                  </h3>
                </div>
              )}

              {profile.location.scheduleLines.length > 0 && (
                <div className="mt-4">
                  <p className="text-2xl font-black" style={{ color: accentWordColor }}>{tx("Horarios", "Hours")}</p>
                  <div className="mt-2 space-y-2 text-sm" style={{ color: textPalette.muted }}>
                    {profile.location.scheduleLines.map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {profile.location.mapsUrl && isValidExternalUrl(profile.location.mapsUrl) && (
                <a
                  href={profile.location.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 inline-flex items-center justify-center gap-2 border px-5 py-3 font-bold ${buttonRadiusClass}`}
                  style={interactiveStyle}
                >
                  <MapPin className="h-4 w-4" />
                  {profile.location.ctaLabel || tx("Ir ahora", "Go now")}
                </a>
              )}

              <p className="mt-5 text-xs font-semibold" style={{ color: textPalette.muted }}>
                <a
                  href="https://www.fastpagepro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: accentWordColor }}
                >
                  {tx("Creado por FastPage", "Created by FastPage")}
                </a>
              </p>
            </section>
          )}

          {reservationEnabled && (activeTab === "reservation" || reservationPanelReady) && (
            <section
              className={`${activeTab === "reservation" ? "block" : "hidden"} h-full overflow-y-auto rounded-[1.9rem] border p-4 no-scrollbar ${cardClass}`}
              style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}
            >
              <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--carta-border)" }}>
                {profile.reservation.heroImageUrl ? (
                  <img
                    src={profile.reservation.heroImageUrl}
                    alt={tx("Reservas", "Bookings")}
                    className="h-40 w-full object-cover md:h-56"
                  />
                ) : (
                  <div
                    className="flex h-40 w-full items-center justify-center text-sm font-semibold md:h-56"
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(245,158,11,0.2) 0%, rgba(16,185,129,0.18) 52%, rgba(249,115,22,0.18) 100%)",
                      color: textPalette.muted,
                    }}
                  >
                    {tx("Imagen de reservas premium", "Premium booking image")}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-black md:text-3xl" style={{ color: accentWordColor }}>
                  {profile.reservation.title || tx("Reserva premium", "Premium booking")}
                </h2>
                <p className="mt-1 text-sm md:text-base" style={{ color: textPalette.muted }}>
                  {profile.reservation.subtitle || tx("Agenda tu mesa y te confirmamos por WhatsApp.", "Book your table and we'll confirm via WhatsApp.")}
                </p>
                {reservationHasDepositDetails ? (
                  <div
                    className="mt-3 rounded-xl border px-3 py-2 text-xs font-semibold"
                    style={{
                      borderColor: "rgba(52,211,153,0.45)",
                      background: "rgba(16,185,129,0.12)",
                      color: textPalette.base,
                    }}
                  >
                    {reservationDepositAmount ? (
                      <p>
                        {tx("Anticipo sugerido", "Suggested deposit")}: <span className="font-black">{reservationDepositAmount}</span>
                      </p>
                    ) : null}
                    {reservationDepositInstructions ? (
                      <p className={reservationDepositAmount ? "mt-1" : undefined}>{reservationDepositInstructions}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Nombre completo", "Full name")}
                  </span>
                  <input
                    value={reservationName}
                    onChange={(event) => setReservationName(event.target.value)}
                    placeholder={tx("Ej. Maria Gomez", "Ex. Maria Gomez")}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${buttonRadiusClass}`}
                    style={checkoutInputStyle}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Personas", "Guests")}
                  </span>
                  <div className={`flex items-center rounded-xl border ${buttonRadiusClass}`} style={checkoutInputStyle}>
                    <button
                      type="button"
                      onClick={() => setReservationGuests(String(Math.max(reservationMinParty, reservationGuestsCount - 1)))}
                      disabled={reservationGuestsCount <= reservationMinParty}
                      className="inline-flex h-11 w-11 items-center justify-center transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                      style={{ borderRight: "1px solid var(--carta-input-border)", color: "var(--carta-input-text)" }}
                      aria-label={tx("Disminuir personas", "Decrease guests")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div
                      className="flex min-w-0 flex-1 flex-col items-center justify-center px-2"
                      role="spinbutton"
                      aria-label={tx("Cantidad de personas", "Guests quantity")}
                      aria-valuemin={reservationMinParty}
                      aria-valuemax={reservationMaxParty}
                      aria-valuenow={reservationGuestsCount}
                    >
                      <span className="text-base font-black leading-none" style={{ color: "var(--carta-input-text)" }}>
                        {reservationGuestsCount}
                      </span>
                      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: textPalette.soft }}>
                        {tx("personas", "guests")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReservationGuests(String(Math.min(reservationMaxParty, reservationGuestsCount + 1)))}
                      disabled={reservationGuestsCount >= reservationMaxParty}
                      className="inline-flex h-11 w-11 items-center justify-center transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                      style={{ borderLeft: "1px solid var(--carta-input-border)", color: "var(--carta-input-text)" }}
                      aria-label={tx("Aumentar personas", "Increase guests")}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: textPalette.soft }}>
                    {tx("Rango permitido", "Allowed range")}: {reservationMinParty} {tx("a", "to")} {reservationMaxParty} {tx("personas", "guests")}.
                  </p>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Fecha", "Date")}
                  </span>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(event) => setReservationDate(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${buttonRadiusClass}`}
                    style={checkoutInputStyle}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Horario", "Time")}
                  </span>
                  <select
                    value={reservationSlot}
                    onChange={(event) => setReservationSlot(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${buttonRadiusClass}`}
                    style={checkoutInputStyle}
                  >
                    {(reservationSlots.length > 0 ? reservationSlots : [tx("Por coordinar", "To be confirmed")]).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Celular (opcional)", "Phone (optional)")}
                  </span>
                  <input
                    value={reservationContact}
                    onChange={(event) => setReservationContact(event.target.value)}
                    placeholder="+51 999 999 999"
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${buttonRadiusClass}`}
                    style={checkoutInputStyle}
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentWordColor }}>
                    {tx("Nota adicional", "Additional note")}
                  </span>
                  <textarea
                    rows={3}
                    value={reservationNote}
                    onChange={(event) => setReservationNote(event.target.value)}
                    placeholder={profile.reservation.notePlaceholder || tx("Celebracion, alergias o zona preferida.", "Celebration, allergies, or preferred area.")}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm resize-none ${buttonRadiusClass}`}
                    style={checkoutInputStyle}
                  />
                </label>
              </div>

              {reservationError ? (
                <p className="mt-3 rounded-xl border px-3 py-2 text-xs font-semibold text-red-300" style={{ borderColor: "rgba(248,113,113,0.45)" }}>
                  {reservationError}
                </p>
              ) : null}
              {reservationFeedback ? (
                <p className="mt-3 rounded-xl border px-3 py-2 text-xs font-semibold text-emerald-200" style={{ borderColor: "rgba(52,211,153,0.45)" }}>
                  {reservationFeedback}
                </p>
              ) : null}

              <button
                type="button"
                onClick={submitReservationWhatsapp}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 border px-4 py-3 text-sm font-black uppercase tracking-[0.1em] ${buttonRadiusClass}`}
                style={interactiveStyle}
              >
                <CalendarDays className="h-4 w-4" />
                {profile.reservation.ctaLabel || tx("Enviar reserva", "Send booking")}
              </button>
              <p className="mt-2 text-[11px]" style={{ color: textPalette.soft }}>
                {tx("Confirmamos por WhatsApp segun disponibilidad real del restaurante.", "We confirm via WhatsApp based on real-time restaurant availability.")}
              </p>
            </section>
          )}
        </div>

      </div>

      {activeTab === "catalog" && (
        <FloatingCartButton
          cartCount={cartItemsCount}
          buttonShapeClass="rounded-[1.15rem]"
          visible={activeTab === "catalog"}
          onOpen={submitQuickOrderWhatsapp}
        />
      )}

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="mx-auto w-full max-w-md rounded-[1.5rem] border p-1 backdrop-blur-xl" style={navSurfaceStyle}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${visibleTabCount}, minmax(0, 1fr))` }}>
            <button
              type="button"
              onClick={() => activateTab("contact")}
              aria-pressed={activeTab === "contact"}
              className="h-14 rounded-[0.95rem] px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
              style={
                activeTab === "contact"
                  ? navActiveStyle
                  : { color: "var(--carta-nav-text)" }
              }
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <Phone className="h-4 w-4" />
              </div>
              <span className="block truncate">{profile.sectionLabels.contact}</span>
            </button>

            <button
              type="button"
              onClick={() => activateTab("catalog")}
              aria-pressed={activeTab === "catalog"}
              className="h-14 rounded-[0.95rem] px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
              style={
                activeTab === "catalog"
                  ? navActiveStyle
                  : { color: "var(--carta-nav-text)" }
              }
            >
              <div className="mx-auto mb-1 h-4 w-4">
                {profile.businessType === "restaurant" ? <Menu className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
              </div>
              <span className="block truncate">{catalogLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => activateTab("location")}
              aria-pressed={activeTab === "location"}
              className="h-14 rounded-[0.95rem] px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
              style={
                activeTab === "location"
                  ? navActiveStyle
                  : { color: "var(--carta-nav-text)" }
              }
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="block truncate">{profile.sectionLabels.location}</span>
            </button>
            {reservationEnabled ? (
              <button
                type="button"
                onClick={() => activateTab("reservation")}
                aria-pressed={activeTab === "reservation"}
                className="h-14 rounded-[0.95rem] px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carta-bg)] active:scale-[0.98]"
                style={activeTab === "reservation" ? navActiveStyle : { color: "var(--carta-nav-text)" }}
              >
                <div className="mx-auto mb-1 h-4 w-4">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <span className="block truncate">{reservationLabel}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-2 md:p-6">
          <div
            className="mx-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-3xl border"
            style={cartPanelStyle}
          >
            <div className="border-b px-4 py-3 md:px-6" style={{ borderColor: "var(--carta-border)" }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-3xl font-black leading-tight" style={{ color: textPalette.heading }}>
                    {checkoutStep === "cart" ? tx("Mi Pedido", "My Order") : tx("Completa tu pedido", "Complete your order")}
                  </p>
                  <p className="text-sm" style={{ color: textPalette.muted }}>
                    {profile.displayName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep("cart");
                    setCartError("");
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                  style={{
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-button-text)",
                    background: "var(--carta-badge-bg)",
                  }}
                  aria-label={tx("Cerrar carrito", "Close cart")}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
              {checkoutStep === "cart" && (
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-5 text-sm" style={{ borderColor: "var(--carta-border)", color: textPalette.muted }}>
                      {tx("Tu carrito esta vacio. Agrega productos desde la carta para continuar.", "Your cart is empty. Add products from the menu to continue.")}
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => {
                        const itemSubtotal = item.unitPrice * item.quantity;
                        return (
                          <article
                            key={item.id}
                            className="rounded-2xl border p-3"
                            style={{ borderColor: "var(--carta-border)", ...itemSurfaceStyle }}
                          >
                            <div className="flex gap-3">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                              ) : (
                                <div className="h-20 w-20 rounded-xl border flex items-center justify-center text-xs font-bold" style={{ borderColor: "var(--carta-chip-border)" }}>
                                  ITEM
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xl font-extrabold leading-tight" style={{ color: textPalette.heading }}>
                                    {item.title}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => removeCartItem(item.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                                    style={{ borderColor: "var(--carta-chip-border)", color: "var(--carta-badge-text)", background: "var(--carta-badge-bg)" }}
                                    aria-label={tx("Eliminar item", "Remove item")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="mt-1 text-sm" style={{ color: textPalette.muted }}>
                                  {tx("Cantidad", "Quantity")}: {item.quantity}
                                </p>
                                <p className="mt-1 text-sm font-semibold" style={{ color: textPalette.muted }}>
                                  {tx("Precio base", "Base price")}: {formatSoles(item.unitPrice)}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <div className="inline-flex items-center gap-1 rounded-xl border px-1 py-1" style={{ borderColor: "var(--carta-chip-border)" }}>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
                                      style={{ borderColor: "var(--carta-chip-border)" }}
                                      onClick={() => patchCartItemQuantity(item.id, item.quantity - 1)}
                                      aria-label={tx("Disminuir cantidad", "Decrease quantity")}
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
                                      style={{ borderColor: "var(--carta-chip-border)" }}
                                      onClick={() => patchCartItemQuantity(item.id, item.quantity + 1)}
                                      aria-label={tx("Aumentar cantidad", "Increase quantity")}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-xl font-black" style={{ color: "var(--carta-price-color, var(--carta-accent))" }}>
                                    {formatSoles(itemSubtotal)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}

                      <div className="rounded-2xl border p-4" style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
                        <p className="text-base font-semibold" style={{ color: textPalette.muted }}>
                          {tx("Subtotal", "Subtotal")}: {formatSoles(cartSubtotal)}
                        </p>
                        <div
                          className="mt-3 rounded-xl px-3 py-3 text-sm font-semibold"
                          style={{
                            background: "var(--carta-badge-bg)",
                            color: "var(--carta-badge-text)",
                          }}
                        >
                          {amountToAutoDiscount > 0
                            ? tx(`🎁 ¡Agrega ${formatSoles(amountToAutoDiscount)} mas para obtener 5% de descuento!`, `🎁 Add ${formatSoles(amountToAutoDiscount)} more to unlock a 5% discount!`)
                            : tx("🎉 ¡Excelente! Ya tienes 5% de descuento por monto acumulado.", "🎉 Great! You already unlocked a 5% discount by total amount.")}
                        </div>
                        <div className="mt-3 border-t pt-3 text-3xl font-black" style={{ borderColor: "var(--carta-border)", color: textPalette.heading }}>
                          {tx("Total", "Total")}: {formatSoles(cartTotal)}
                        </div>
                      </div>
                    </>
                  )}

                  {cartFeedback && (
                    <p className="text-sm font-semibold text-emerald-300">{cartFeedback}</p>
                  )}
                  {cartError && <p className="text-sm font-semibold text-red-300">{cartError}</p>}

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      className={`border px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] ${buttonRadiusClass}`}
                      style={{ borderColor: "var(--carta-border)", color: textPalette.heading }}
                    >
                      {tx("Vaciar carrito", "Clear cart")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (cartItems.length === 0) {
                          setCartError(tx("Tu carrito esta vacio. Agrega productos antes de continuar.", "Your cart is empty. Add products before continuing."));
                          return;
                        }
                        setCheckoutStep("checkout");
                        setCartError("");
                      }}
                      className={`border px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] ${buttonRadiusClass}`}
                      style={interactiveStyle}
                    >
                      {tx("Completar pedido", "Complete order")}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === "checkout" && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="text-sm font-semibold"
                    style={{ color: textPalette.muted }}
                  >
                    {tx("← Regresar al carrito", "← Back to cart")}
                  </button>

                  <div className="space-y-3">
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>{tx("Nombre", "Name")}:</span>
                      <input
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder={tx("Tu nombre completo", "Your full name")}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>{tx("Telefono", "Phone")}:</span>
                      <input
                        value={customerPhone}
                        onChange={(event) => setCustomerPhone(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder="999 999 999"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>{tx("Opciones de entrega", "Delivery options")}:</span>
                      <select
                        value={deliveryMethod}
                        onChange={(event) => setDeliveryMethod(event.target.value as DeliveryMethod)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        disabled={availableDeliveryOptions.length === 0}
                      >
                        <option value="">
                          {availableDeliveryOptions.length === 0 ? tx("Sin opciones configuradas", "No options configured") : tx("Selecciona una opcion", "Select an option")}
                        </option>
                        {availableDeliveryOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>{tx("Formas de pago", "Payment methods")}:</span>
                      <select
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                      >
                        <option value="">{tx("Selecciona una opcion", "Select an option")}</option>
                        {ORDER_PAYMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{paymentLabelMap[option.value]}</option>
                        ))}
                      </select>
                    </label>

                    <div className="space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>
                        {tx("¿Tienes un cupon de descuento?", "Do you have a discount coupon?")}
                      </span>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(event) => setCouponInput(event.target.value)}
                          className={`min-w-0 flex-1 border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                          style={checkoutInputStyle}
                          placeholder={tx("Ingresa el codigo", "Enter code")}
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className={`border px-4 py-3 text-sm font-bold ${buttonRadiusClass}`}
                          style={interactiveStyle}
                        >
                          {tx("Aplicar", "Apply")}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
                      <p className="text-lg font-semibold" style={{ color: textPalette.heading }}>{tx("Resumen del pedido", "Order summary")}</p>
                      <div
                        className="mt-3 rounded-xl px-3 py-3 text-sm font-semibold"
                        style={{
                          background: "var(--carta-badge-bg)",
                          color: "var(--carta-badge-text)",
                        }}
                      >
                        {amountToAutoDiscount > 0
                          ? tx(`🎁 ¡Estas cerca! Te faltan ${formatSoles(amountToAutoDiscount)} para obtener 5% de descuento`, `🎁 You're close! You need ${formatSoles(amountToAutoDiscount)} more to unlock a 5% discount`)
                          : tx("🎉 Descuento de 5% activado por monto acumulado.", "🎉 5% discount activated by total amount.")}
                      </div>
                      <div className="mt-3 space-y-1 text-sm" style={{ color: textPalette.muted }}>
                        <div className="flex items-center justify-between">
                          <span>{tx("Subtotal", "Subtotal")}:</span>
                          <span>{formatSoles(cartSubtotal)}</span>
                        </div>
                        {autoDiscount > 0 && (
                          <div className="flex items-center justify-between">
                            <span>{tx("Descuento por monto", "Amount discount")}:</span>
                            <span>- {formatSoles(autoDiscount)}</span>
                          </div>
                        )}
                        {couponDiscount > 0 && (
                          <div className="flex items-center justify-between">
                            <span>{tx("Cupon", "Coupon")} ({appliedCouponCode}):</span>
                            <span>- {formatSoles(couponDiscount)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 border-t pt-3 text-2xl font-black" style={{ borderColor: "var(--carta-border)", color: textPalette.heading }}>
                        {tx("Total", "Total")}: {formatSoles(cartTotal)}
                      </div>
                    </div>

                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>{tx("Nota adicional", "Additional note")}:</span>
                      <textarea
                        rows={3}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder={tx("Ejemplo: sin cebolla, tocar timbre, etc.", "Example: no onion, ring the bell, etc.")}
                      />
                    </label>

                    <label className="flex items-start gap-2 text-sm" style={{ color: textPalette.muted }}>
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) => setAcceptedTerms(event.target.checked)}
                        className="mt-0.5"
                      />
                      <span>
                        {tx("Acepto los", "I accept")} <a href="#" className="underline">{tx("terminos y condiciones", "terms and conditions")}</a>.
                      </span>
                    </label>

                    <div className="rounded-xl border-l-2 px-3 py-2 text-xs" style={{ borderColor: "var(--carta-accent)", color: textPalette.muted }}>
                      {tx("ℹ️ Importante: al enviar este pedido, se abrirá WhatsApp con el mensaje listo para confirmar.", "ℹ️ Important: when sending this order, WhatsApp opens with the message ready to confirm.")}
                    </div>

                    {cartFeedback && (
                      <p className="text-sm font-semibold text-emerald-300">{cartFeedback}</p>
                    )}
                    {cartError && <p className="text-sm font-semibold text-red-300">{cartError}</p>}

                    <button
                      type="button"
                      onClick={submitOrderWhatsapp}
                      className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-3 text-base font-black transition hover:-translate-y-0.5 active:scale-[0.98] ${buttonRadiusClass}`}
                      style={{
                        borderColor: "var(--carta-chip-border)",
                        background: "var(--carta-button-bg)",
                        color: "var(--carta-button-text)",
                        boxShadow: "var(--carta-shadow)",
                      }}
                    >
                      <MessageCircleIcon className="h-5 w-5" />
                      {tx("Enviar pedido", "Send order")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CartaThemeProvider>
  );
}
