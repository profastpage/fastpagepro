"use client";

import { CSSProperties, ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getLinkHubThemeColors,
  getSafeLinkHubTheme,
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
import { getSafeCartaThemeId, recommendCartaThemeIdByRubro } from "@/theme/cartaThemes";
import {
  AtSign,
  Facebook,
  Fish,
  Globe,
  Loader2,
  MapPin,
  Minus,
  Menu,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Shirt,
  Store,
  Trash2,
  XCircle,
  Youtube,
  Instagram,
  Linkedin,
  Music2,
  Share2,
} from "lucide-react";

type PublicTab = "contact" | "catalog" | "location";
type CheckoutStep = "cart" | "checkout";
type DeliveryMethod = "delivery" | "pickup" | "dinein";
type PaymentMethod = "cash" | "transfer" | "yape" | "plin";

type CartItem = {
  id: string;
  title: string;
  imageUrl: string;
  categoryName: string;
  priceLabel: string;
  unitPrice: number;
  quantity: number;
};

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

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function toWhatsappUrl(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
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

export default function PublicBioPage() {
  const params = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<PublicTab>("contact");
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
  const catalogItems = profile?.catalogItems ?? [];
  const categorySections = (profile?.catalogCategories ?? [])
    .map((category) => {
      const items = catalogItems.filter((item) => {
        if (item.categoryId !== category.id) return false;
        if (!normalizedSearch) return true;
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch) ||
          (item.badge || "").toLowerCase().includes(normalizedSearch)
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
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 text-slate-900 flex items-center justify-center">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold">Link Hub</p>
          <h1 className="mt-3 text-3xl font-black">Perfil no disponible</h1>
          <p className="mt-3 text-slate-600">Este enlace no existe o aun no fue publicado.</p>
        </div>
      </div>
    );
  }

  const themeKey = getSafeLinkHubTheme(profile.theme);
  const colors = getLinkHubThemeColors(themeKey, profile.themePrimaryColor, profile.themeSecondaryColor);
  const rubroHint =
    profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante / Cafeteria" : "Tienda / General");
  const cartaThemeId = getSafeCartaThemeId(
    profile.cartaThemeId || recommendCartaThemeIdByRubro(rubroHint),
  );
  const textTone = getSafeLinkHubTextTone(profile.textTone);
  const _legacyTextPalette = getTextTonePalette(textTone, colors.primary);
  const textPalette = {
    base: "#0f172a",
    muted: "#475569",
    soft: "#64748b",
    heading: "#0f172a",
    key: colors.primary,
    inactive: "#64748b",
    active: colors.primary,
    accent: colors.primary,
    searchPlaceholder: "#94a3b8",
  };
  const safeFont = getSafeLinkHubFontFamily(profile.fontFamily);
  const fontFamily = LINK_HUB_FONT_FAMILIES[safeFont].stack;

  const buttonRadiusClass = getButtonRadiusClass(profile.buttonShape);
  const cardClass = getCardClass(profile.cardStyle);
  const callHref = profile.phoneNumber ? `tel:${normalizePhone(profile.phoneNumber)}` : "";
  const whatsappHref = toWhatsappUrl(profile.whatsappNumber);
  const catalogLabel =
    profile.businessType === "restaurant" ? profile.sectionLabels.menu : profile.sectionLabels.catalog;
  const socialLinks = profile.links
    .filter((link) => isValidExternalUrl(link.url))
    .slice(0, 8);
  const businessName = profile.displayName || "Negocio";
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const autoDiscount = cartSubtotal >= AUTO_DISCOUNT_THRESHOLD ? cartSubtotal * AUTO_DISCOUNT_RATE : 0;
  const couponDiscountRate = appliedCouponCode ? COUPON_DISCOUNTS[appliedCouponCode] || 0 : 0;
  const couponDiscount = cartSubtotal * couponDiscountRate;
  const cartTotal = Math.max(0, cartSubtotal - autoDiscount - couponDiscount);
  const amountToAutoDiscount = Math.max(0, AUTO_DISCOUNT_THRESHOLD - cartSubtotal);
  const whatsappTargetDigits = (profile.whatsappNumber || profile.phoneNumber).replace(/\D/g, "");

  const deliveryLabelMap: Record<DeliveryMethod, string> = {
    delivery: "Envio a domicilio",
    pickup: "Recoger en local",
    dinein: "Comer en el lugar",
  };
  const paymentLabelMap: Record<PaymentMethod, string> = {
    cash: "Efectivo",
    transfer: "Transferencia",
    yape: "Yape",
    plin: "Plin",
  };

  function addItemToCart(
    item: LinkHubProfile["catalogItems"][number],
    categoryName: string,
  ) {
    const unitPrice = parsePriceToNumber(item.price || "0");
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          title: item.title || "Producto",
          imageUrl: item.imageUrl || "",
          categoryName,
          priceLabel: item.price || "0.00",
          unitPrice,
          quantity: 1,
        },
      ];
    });
    setCartFeedback(`"${item.title || "Producto"}" agregado al pedido.`);
    setCartError("");
    window.setTimeout(() => setCartFeedback(""), 1400);
  }

  function removeCartItem(itemId: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function patchCartItemQuantity(itemId: string, nextQty: number) {
    if (nextQty <= 0) {
      removeCartItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: nextQty } : item)),
    );
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
      setCartError("Ingresa un cupon para aplicar descuento.");
      return;
    }
    if (!COUPON_DISCOUNTS[code]) {
      setAppliedCouponCode("");
      setCartError("Cupon invalido. Prueba con FAST5 o FAST10.");
      return;
    }
    setAppliedCouponCode(code);
    setCartError("");
  }

  function buildWhatsappOrderMessage(): string {
    const date = new Date();
    const deliveryLabel =
      deliveryMethod && deliveryLabelMap[deliveryMethod]
        ? deliveryLabelMap[deliveryMethod]
        : "No especificado";
    const paymentLabel =
      paymentMethod && paymentLabelMap[paymentMethod]
        ? paymentLabelMap[paymentMethod]
        : "No especificado";
    const itemLines = cartItems
      .map((item, index) => {
        const itemSubtotal = item.unitPrice * item.quantity;
        return [
          `${index + 1}. ${item.title} ${item.categoryName ? `(${item.categoryName})` : ""}`,
          `   Cantidad: ${item.quantity}`,
          `   Precio base: ${formatSoles(item.unitPrice)}`,
          `   Subtotal item: ${formatSoles(itemSubtotal)}`,
        ].join("\n");
      })
      .join("\n\n");

    const discountLines = [
      autoDiscount > 0 ? `- Descuento por compra: ${formatSoles(autoDiscount)}` : "",
      couponDiscount > 0 ? `- Cupon (${appliedCouponCode}): ${formatSoles(couponDiscount)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const noteLine = note.trim() ? `\nNota adicional: ${note.trim()}` : "";

    return [
      `Hola ${businessName}! 👋`,
      "",
      "Quiero realizar el siguiente pedido por favor 🙌",
      "",
      "🛒 *Detalle del pedido*",
      itemLines,
      "",
      "📌 *Datos del cliente*",
      `- Nombre: ${customerName.trim()}`,
      `- Telefono: ${customerPhone.trim()}`,
      `- Entrega: ${deliveryLabel}`,
      `- Pago: ${paymentLabel}`,
      noteLine ? noteLine : "",
      "",
      "💰 *Resumen*",
      `- Subtotal: ${formatSoles(cartSubtotal)}`,
      discountLines || "- Descuentos: S/0.00 SOLES",
      `- Total: ${formatSoles(cartTotal)}`,
      "",
      `🕒 Pedido generado: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      "",
      "Muchas gracias! 😊",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submitOrderWhatsapp() {
    if (cartItems.length === 0) {
      setCartError("Tu carrito esta vacio. Agrega productos para continuar.");
      return;
    }
    if (!customerName.trim()) {
      setCartError("Ingresa tu nombre para continuar.");
      return;
    }
    if (!customerPhone.trim()) {
      setCartError("Ingresa tu telefono para continuar.");
      return;
    }
    if (!deliveryMethod) {
      setCartError("Selecciona una opcion de entrega.");
      return;
    }
    if (!paymentMethod) {
      setCartError("Selecciona una forma de pago.");
      return;
    }
    if (!acceptedTerms) {
      setCartError("Debes aceptar los terminos y condiciones para enviar el pedido.");
      return;
    }
    if (!whatsappTargetDigits) {
      setCartError("Este negocio no tiene WhatsApp configurado aun.");
      return;
    }

    const text = buildWhatsappOrderMessage();
    const url = `https://wa.me/${whatsappTargetDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCartError("");
    setCartFeedback("Pedido listo. Te estamos redirigiendo a WhatsApp.");
  }

  async function handleShare() {
    if (!profile) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile.displayName,
          text: `Mira ${profile.displayName} en Fast Page`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Enlace copiado");
        window.setTimeout(() => setShareFeedback(""), 1800);
      }
    } catch {
      // user cancelled share dialog
    }
  }

  function scrollToCategory(categoryId: string) {
    setSelectedCategoryId(categoryId);
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

  const menuGradientSoft = `linear-gradient(135deg, ${hexToRgba(colors.primary, 0.18)} 0%, ${hexToRgba(colors.secondary, 0.14)} 100%)`;
  const menuGradientActive = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
  const menuBorder = hexToRgba(colors.primary, 0.35);

  const pageStyle: CSSProperties = {
    "--carta-bg": "#e7ebf0",
    "--carta-surface": "#ffffff",
    "--carta-surface-2": "#ffffff",
    "--carta-text": "#0f172a",
    "--carta-muted-text": "#475569",
    "--carta-border": "rgba(15,23,42,0.12)",
    "--carta-shadow": "0 18px 34px -26px rgba(15,23,42,0.28)",
    "--carta-input-bg": "#ffffff",
    "--carta-input-text": "#0f172a",
    "--carta-placeholder": "#94a3b8",
    "--carta-input-border": "rgba(15,23,42,0.16)",
    "--carta-button-bg": "#ffffff",
    "--carta-button-text": "#0f172a",
    "--carta-button-secondary-bg": "#ffffff",
    "--carta-gradient-hero": "#ffffff",
    "--carta-chip-bg": "#ffffff",
    "--carta-chip-text": "#0f172a",
    "--carta-chip-active-bg": menuGradientActive,
    "--carta-chip-active-text": "#ffffff",
    "--carta-chip-border": menuBorder,
    "--carta-nav-bg": "#ffffff",
    "--carta-nav-active-bg": menuGradientActive,
    "--carta-nav-active-text": "#ffffff",
    "--carta-nav-text": "#0f172a",
    "--carta-badge-bg": "linear-gradient(135deg, #fb7185 0%, #f97316 100%)",
    "--carta-badge-text": "#ffffff",
    "--carta-accent": colors.primary,
    "--carta-primary": colors.primary,
    "--carta-primary-hover": colors.secondary,
    background: "var(--carta-bg)",
  } as CSSProperties;

  const wrapperStyle = {
    borderColor: "rgba(15,23,42,0.12)",
    fontFamily,
    color: "#0f172a",
    background: "#ffffff",
    boxShadow: "0 24px 50px -36px rgba(15,23,42,0.4)",
  };

  const interactiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: "0 12px 24px -18px rgba(15,23,42,0.32)",
    color: "#ffffff",
  };

  const chipActiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: "0 12px 24px -18px rgba(15,23,42,0.28)",
    color: "#ffffff",
  };

  const navActiveStyle = {
    borderColor: menuBorder,
    background: menuGradientActive,
    boxShadow: "0 14px 24px -18px rgba(15,23,42,0.3)",
    color: "#ffffff",
  };

  const badgeStyle = {
    borderColor: "var(--carta-chip-border)",
    background: "var(--carta-badge-bg)",
    color: "var(--carta-badge-text)",
  };

  const headerBarStyle = {
    borderColor: "rgba(15,23,42,0.12)",
    background: "#ffffff",
  };

  const avatarFallbackStyle = {
    borderColor: menuBorder,
    background: menuGradientSoft,
  };

  const cardSurfaceStyle =
    profile.cardStyle === "solid"
      ? {
          background: "#ffffff",
        }
      : profile.cardStyle === "outline"
      ? { background: "#ffffff" }
      : {
          background: "#ffffff",
          backdropFilter: "none",
        };

  const catalogStickyStyle = {
    borderColor: "rgba(15,23,42,0.12)",
    background: "#ffffff",
    boxShadow: "0 10px 18px -16px rgba(15,23,42,0.36)",
  };

  const searchSurfaceStyle = {
    borderColor: "rgba(15,23,42,0.16)",
    background: "#ffffff",
    color: "#0f172a",
  };

  const navSurfaceStyle = {
    borderColor: menuBorder,
    background: menuGradientSoft,
  };

  const itemSurfaceStyle = {
    background: "var(--carta-surface-2)",
  };

  const contactActionStyle = {
    borderColor: "rgba(15,23,42,0.16)",
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 10px 18px -16px rgba(15,23,42,0.3)",
  };

  const cartPanelStyle = {
    borderColor: "rgba(15,23,42,0.12)",
    background: "#ffffff",
  };

  const checkoutInputStyle = {
    borderColor: "rgba(15,23,42,0.16)",
    color: "#0f172a",
    background: "#ffffff",
  };

  return (
    <CartaThemeProvider
      themeId={cartaThemeId}
      className="h-[100dvh] overflow-hidden px-2 py-3 md:px-6 md:py-8"
      style={pageStyle}
    >
      <div
        className="mx-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-[2.25rem] border md:max-w-5xl md:rounded-[2.5rem]"
        style={wrapperStyle}
      >
        <div
          className={`border-b px-3 md:px-8 ${activeTab === "contact" ? "py-3" : "py-2"}`}
          style={headerBarStyle}
        >
          <div className="relative flex items-center justify-between gap-3">
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
            {activeTab !== "contact" && (
              <p
                className="pointer-events-none absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-sm font-black uppercase tracking-[0.12em] md:text-base"
                style={{ color: textPalette.heading }}
              >
                {activeTab === "catalog" ? catalogLabel : profile.sectionLabels.location}
              </p>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              style={{ borderColor: "var(--carta-chip-border)", color: "var(--carta-text)", background: "var(--carta-button-secondary-bg)" }}
              aria-label="Compartir"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          {shareFeedback && <p className="mt-2 text-xs font-semibold text-emerald-200">{shareFeedback}</p>}
        </div>

        {activeTab === "contact" ? (
          <>
            <div className="relative">
              {coverImages.length > 0 ? (
                <div className="relative h-40 md:h-64 w-full overflow-hidden">
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

              <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 object-cover"
                    style={{
                      borderColor: "var(--carta-chip-border)",
                      background: avatarFallbackStyle.background,
                    }}
                  />
                ) : (
                  <div
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 flex items-center justify-center text-3xl md:text-4xl font-black"
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

            <div className="px-5 md:px-8 pt-16 md:pt-20 pb-4 text-center">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: textPalette.heading }}>
                {profile.displayName}
              </h1>
              <p className="mt-2 text-sm md:text-base uppercase tracking-[0.18em]" style={{ color: "var(--carta-accent)" }}>
                {profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante" : "Tienda online")}
              </p>
              {profile.bio && (
                <p className="mt-3 text-sm md:text-base" style={{ color: textPalette.muted }}>
                  {profile.bio}
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

        <div className="hidden md:grid grid-cols-3 gap-3 px-8 pb-6">
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className="rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition"
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
            onClick={() => setActiveTab("catalog")}
            className="rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition"
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
            onClick={() => setActiveTab("location")}
            className="rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition"
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
        </div>

        <div className="flex-1 overflow-hidden px-4 pb-24 md:px-8 md:pb-6">
          {activeTab === "contact" && (
            <section
              className={`flex h-full min-h-0 flex-col rounded-3xl border p-4 md:p-6 ${cardClass}`}
              style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}
            >
              <h2 className="text-2xl font-black" style={{ color: textPalette.heading }}>
                {profile.sectionLabels.contact}
              </h2>
              <p className="mt-1 text-sm" style={{ color: textPalette.muted }}>
                Atiende clientes directo desde tu canal favorito.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:mt-5 md:grid-cols-2 md:gap-4">
                {callHref && (
                  <a
                    href={callHref}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 border px-4 py-3 font-bold transition hover:-translate-y-0.5 active:scale-[0.98] md:min-h-[3.25rem] ${!whatsappHref ? "md:col-span-2" : ""} ${buttonRadiusClass}`}
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
                    className={`inline-flex min-h-12 items-center justify-center gap-2 border px-4 py-3 font-bold transition hover:-translate-y-0.5 active:scale-[0.98] md:min-h-[3.25rem] ${!callHref ? "md:col-span-2" : ""} ${buttonRadiusClass}`}
                    style={contactActionStyle}
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    Escribir ahora
                  </a>
                )}
              </div>
            </section>
          )}

          {activeTab === "catalog" && (
            <section className={`flex h-full flex-col overflow-hidden rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
              <div className="hidden md:flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black" style={{ color: textPalette.heading }}>
                  {catalogLabel}
                </h2>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: "var(--carta-chip-border)", color: "var(--carta-chip-text)" }}>
                    {profile.businessType === "restaurant" ? <Fish className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                    {totalFilteredItems}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(true);
                      setCheckoutStep("cart");
                    }}
                    className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] ${buttonRadiusClass}`}
                    style={interactiveStyle}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Mi pedido
                    {cartItemsCount > 0 && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: "var(--carta-chip-active-bg)", color: "var(--carta-chip-active-text)" }}>
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div
                ref={catalogScrollRef}
                onScroll={handleCatalogScroll}
                className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1 no-scrollbar md:mt-4"
              >
                <div
                  ref={catalogStickyRef}
                  className="sticky top-0 z-20 -mx-1 mb-3 border-b px-1 pb-3 pt-1 backdrop-blur"
                  style={catalogStickyStyle}
                >
                  <label className="flex items-center gap-2 rounded-2xl border px-3 py-2" style={searchSurfaceStyle}>
                    <Search className="h-4 w-4" style={{ color: textPalette.soft }} />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={profile.businessType === "restaurant" ? "Buscar en la carta..." : "Buscar en el catalogo..."}
                      className="w-full bg-transparent text-sm focus:outline-none placeholder:[color:var(--carta-placeholder)]"
                      style={{ color: "var(--carta-input-text)" }}
                    />
                  </label>

                  <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                    {categorySections.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        ref={(node) => {
                          categoryChipRefs.current[category.id] = node;
                        }}
                        onClick={() => scrollToCategory(category.id)}
                        className={`shrink-0 border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 active:scale-[0.98] ${buttonRadiusClass}`}
                        style={
                          selectedCategoryId === category.id
                            ? chipActiveStyle
                            : { borderColor: "var(--carta-chip-border)", background: "var(--carta-chip-bg)", color: "var(--carta-chip-text)" }
                        }
                      >
                        <span className="mr-1">{category.emoji || category.name.slice(0, 1).toUpperCase()}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
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
                      <h3 className="text-3xl md:text-2xl font-black tracking-tight" style={{ color: textPalette.heading }}>
                        {section.name}
                      </h3>
                      <div className="mt-3 space-y-3">
                        {section.items.map((item) => (
                          <article
                            key={item.id}
                            className={`rounded-2xl border p-3 ${cardClass}`}
                            style={{ borderColor: "var(--carta-border)", ...itemSurfaceStyle }}
                          >
                            <div className="flex gap-3">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                              ) : (
                                <div
                                  className="h-20 w-20 rounded-xl flex items-center justify-center text-2xl"
                                  style={interactiveStyle}
                                >
                                  <span className="text-[10px] font-black uppercase tracking-[0.08em]">
                                    {item.emoji || (profile.businessType === "restaurant" ? "menu" : "item")}
                                  </span>
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xl font-extrabold leading-tight" style={{ color: textPalette.heading }}>
                                    {item.title}
                                  </h4>
                                  {item.badge && (
                                    <span className="rounded-full border px-2 py-1 text-[10px] font-black uppercase" style={badgeStyle}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="mt-1 text-sm" style={{ color: textPalette.muted }}>
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                                  {item.compareAtPrice && (
                                    <span className="line-through" style={{ color: textPalette.soft }}>
                                      S/{item.compareAtPrice}
                                    </span>
                                  )}
                                  <span className="text-lg" style={{ color: "var(--carta-accent)" }}>
                                    S/{item.price}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => addItemToCart(item, section.name)}
                                  className={`mt-3 inline-flex items-center justify-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition hover:-translate-y-0.5 active:scale-[0.98] ${buttonRadiusClass}`}
                                  style={interactiveStyle}
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  Agregar
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "location" && (
            <section className={`h-full overflow-hidden rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
              <h2 className="hidden md:block text-2xl font-black" style={{ color: textPalette.heading }}>
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
                    Agrega un link de Google Maps Embed para mostrar el mapa.
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
                  <p className="text-2xl font-black" style={{ color: textPalette.heading }}>Horarios</p>
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
                  {profile.location.ctaLabel || "Ir ahora"}
                </a>
              )}
            </section>
          )}
        </div>

      </div>

      {activeTab === "catalog" && (
        <div className="md:hidden fixed right-4 bottom-24 z-40">
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setCheckoutStep("cart");
            }}
            className={`inline-flex items-center gap-2 border px-4 py-3 text-xs font-black uppercase tracking-[0.08em] shadow-xl ${buttonRadiusClass}`}
            style={interactiveStyle}
          >
            <ShoppingBag className="h-4 w-4" />
            Pedido
            {cartItemsCount > 0 && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: "var(--carta-chip-active-bg)", color: "var(--carta-chip-active-text)" }}>
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      )}

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="mx-auto w-full max-w-md rounded-2xl border p-1 backdrop-blur-xl" style={navSurfaceStyle}>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className="h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight"
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
              onClick={() => setActiveTab("catalog")}
              className="h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight"
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
              onClick={() => setActiveTab("location")}
              className="h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight"
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
                    {checkoutStep === "cart" ? "Mi Pedido" : "Completa tu pedido"}
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
                  aria-label="Cerrar carrito"
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
                      Tu carrito esta vacio. Agrega productos desde la carta para continuar.
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
                                    aria-label="Eliminar item"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="mt-1 text-sm" style={{ color: textPalette.muted }}>
                                  Cantidad: {item.quantity}
                                </p>
                                <p className="mt-1 text-sm font-semibold" style={{ color: textPalette.muted }}>
                                  Precio base: {formatSoles(item.unitPrice)}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <div className="inline-flex items-center gap-1 rounded-xl border px-1 py-1" style={{ borderColor: "var(--carta-chip-border)" }}>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
                                      style={{ borderColor: "var(--carta-chip-border)" }}
                                      onClick={() => patchCartItemQuantity(item.id, item.quantity - 1)}
                                      aria-label="Disminuir cantidad"
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
                                      style={{ borderColor: "var(--carta-chip-border)" }}
                                      onClick={() => patchCartItemQuantity(item.id, item.quantity + 1)}
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-xl font-black" style={{ color: "var(--carta-accent)" }}>
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
                          Subtotal: {formatSoles(cartSubtotal)}
                        </p>
                        <div
                          className="mt-3 rounded-xl px-3 py-3 text-sm font-semibold"
                          style={{
                            background: "var(--carta-badge-bg)",
                            color: "var(--carta-badge-text)",
                          }}
                        >
                          {amountToAutoDiscount > 0
                            ? `🎁 ¡Agrega ${formatSoles(amountToAutoDiscount)} mas para obtener 5% de descuento!`
                            : "🎉 ¡Excelente! Ya tienes 5% de descuento por monto acumulado."}
                        </div>
                        <div className="mt-3 border-t pt-3 text-3xl font-black" style={{ borderColor: "var(--carta-border)", color: textPalette.heading }}>
                          Total: {formatSoles(cartTotal)}
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
                      Vaciar carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (cartItems.length === 0) {
                          setCartError("Tu carrito esta vacio. Agrega productos antes de continuar.");
                          return;
                        }
                        setCheckoutStep("checkout");
                        setCartError("");
                      }}
                      className={`border px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] ${buttonRadiusClass}`}
                      style={interactiveStyle}
                    >
                      Completar pedido
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
                    ← Regresar al carrito
                  </button>

                  <div className="space-y-3">
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>Nombre:</span>
                      <input
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder="Tu nombre completo"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>Telefono:</span>
                      <input
                        value={customerPhone}
                        onChange={(event) => setCustomerPhone(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder="999 999 999"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>Opciones de entrega:</span>
                      <select
                        value={deliveryMethod}
                        onChange={(event) => setDeliveryMethod(event.target.value as DeliveryMethod)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                      >
                        <option value="">Selecciona una opcion</option>
                        {ORDER_DELIVERY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>Formas de pago:</span>
                      <select
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                      >
                        <option value="">Selecciona una opcion</option>
                        {ORDER_PAYMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>

                    <div className="space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>
                        ¿Tienes un cupon de descuento?
                      </span>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(event) => setCouponInput(event.target.value)}
                          className={`min-w-0 flex-1 border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                          style={checkoutInputStyle}
                          placeholder="Ingresa el codigo"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className={`border px-4 py-3 text-sm font-bold ${buttonRadiusClass}`}
                          style={interactiveStyle}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--carta-border)", ...cardSurfaceStyle }}>
                      <p className="text-lg font-semibold" style={{ color: textPalette.heading }}>Resumen del pedido</p>
                      <div
                        className="mt-3 rounded-xl px-3 py-3 text-sm font-semibold"
                        style={{
                          background: "var(--carta-badge-bg)",
                          color: "var(--carta-badge-text)",
                        }}
                      >
                        {amountToAutoDiscount > 0
                          ? `🎁 ¡Estas cerca! Te faltan ${formatSoles(amountToAutoDiscount)} para obtener 5% de descuento`
                          : "🎉 Descuento de 5% activado por monto acumulado."}
                      </div>
                      <div className="mt-3 space-y-1 text-sm" style={{ color: textPalette.muted }}>
                        <div className="flex items-center justify-between">
                          <span>Subtotal:</span>
                          <span>{formatSoles(cartSubtotal)}</span>
                        </div>
                        {autoDiscount > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Descuento por monto:</span>
                            <span>- {formatSoles(autoDiscount)}</span>
                          </div>
                        )}
                        {couponDiscount > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Cupon ({appliedCouponCode}):</span>
                            <span>- {formatSoles(couponDiscount)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 border-t pt-3 text-2xl font-black" style={{ borderColor: "var(--carta-border)", color: textPalette.heading }}>
                        Total: {formatSoles(cartTotal)}
                      </div>
                    </div>

                    <label className="block space-y-1">
                      <span className="text-sm font-semibold" style={{ color: textPalette.heading }}>Nota adicional:</span>
                      <textarea
                        rows={3}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        className={`w-full border px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carta-ring)] placeholder:[color:var(--carta-placeholder)] ${buttonRadiusClass}`}
                        style={checkoutInputStyle}
                        placeholder="Ejemplo: sin cebolla, tocar timbre, etc."
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
                        Acepto los <a href="#" className="underline">terminos y condiciones</a>.
                      </span>
                    </label>

                    <div className="rounded-xl border-l-2 px-3 py-2 text-xs" style={{ borderColor: "var(--carta-accent)", color: textPalette.muted }}>
                      ℹ️ Importante: al enviar este pedido, se abrirá WhatsApp con el mensaje listo para confirmar.
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
                      Enviar pedido
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
