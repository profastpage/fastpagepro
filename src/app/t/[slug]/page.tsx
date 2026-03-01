"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import {
  Bot,
  ChevronDown,
  Gift,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingCart,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  STORE_ORDERS_COLLECTION,
  formatStoreMoney,
  getPublishedStoreBySlug,
  sanitizeStoreSlug,
  type PublicStorefront,
} from "@/lib/publicStorefront";
import { getVisualStoreTheme, getVisualStoreVars } from "@/lib/storeVisualTheme";

type SortOption = "featured" | "priceAsc" | "priceDesc" | "nameAsc";
type ShippingMethod = "delivery" | "pickup" | "instore";
type PaymentMethod = "yape" | "plin" | "transfer" | "cash" | "card";

type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  priceCents: number;
  quantity: number;
};

function clampQty(v: number) {
  return Math.max(1, Math.min(99, Math.trunc(v)));
}

function normalizeDigits(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function isOffer(item: {
  badge?: string;
  compareAtPriceCents?: number;
  displayPriceCents: number;
}) {
  const badge = String(item.badge || "").toLowerCase();
  return (
    (item.compareAtPriceCents || 0) > (item.displayPriceCents || 0) ||
    badge.includes("oferta")
  );
}

function paymentMethodLabel(method: PaymentMethod) {
  if (method === "yape") return "Yape";
  if (method === "plin") return "Plin";
  if (method === "transfer") return "Transferencia";
  if (method === "cash") return "Efectivo";
  return "Tarjeta";
}

function shippingMethodLabel(method: ShippingMethod) {
  if (method === "delivery") return "Delivery";
  if (method === "pickup") return "Recojo en tienda";
  return "Consumir en local";
}

function renderStars(value: number) {
  const total = Math.max(1, Math.min(5, Math.round(value || 5)));
  return "★".repeat(total) + "☆".repeat(5 - total);
}

export default function PublicStorePage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => sanitizeStoreSlug(params?.slug || ""), [params?.slug]);

  const [store, setStore] = useState<PublicStorefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [checkoutShippingMethod, setCheckoutShippingMethod] =
    useState<ShippingMethod>("delivery");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] =
    useState<PaymentMethod>("yape");
  const [checkoutAcceptedTerms, setCheckoutAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetMessage, setWidgetMessage] = useState("");
  const [widgetReplies, setWidgetReplies] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await getPublishedStoreBySlug(slug);
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setStore(data);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "No se pudo cargar la tienda.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [slug]);

  const cartKey = store ? `fastpage_public_store_cart_${store.id}` : "";

  useEffect(() => {
    if (!cartKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(cartKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setCart(
        parsed
          .map((item: any) => ({
            id: String(item?.id || ""),
            name: String(item?.name || ""),
            imageUrl: String(item?.imageUrl || ""),
            category: String(item?.category || "General"),
            priceCents: Math.max(0, Number(item?.priceCents || 0)),
            quantity: clampQty(Number(item?.quantity || 1)),
          }))
          .filter((item: CartItem) => item.id),
      );
    } catch {
      setCart([]);
    }
  }, [cartKey]);

  useEffect(() => {
    if (!cartKey || typeof window === "undefined") return;
    window.localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cartKey, cart]);

  const categories = useMemo(() => {
    const set = new Set<string>(["Todos"]);
    (store?.products || []).forEach((p) => set.add(String(p.category || "General")));
    return Array.from(set);
  }, [store?.products]);

  const content = (store?.config?.content || {}) as any;
  const themeConfig = store?.config || {
    storeName: "Tienda",
    tagline: "",
    currency: "PEN" as const,
    themeId: "ruby" as const,
  };
  const theme = getVisualStoreTheme(themeConfig);
  const vars = getVisualStoreVars(themeConfig);
  const cartSettings = {
    floatingButtonEnabled: store?.config?.cart?.floatingButtonEnabled !== false,
    floatingButtonLabel: String(store?.config?.cart?.floatingButtonLabel || "Carrito"),
  };
  const widgetSettings = {
    enabled: store?.config?.widget?.enabled === true,
    mode: store?.config?.widget?.mode === "assistant" ? "assistant" : "whatsapp",
    title: String(store?.config?.widget?.title || "Asistente de tienda"),
    welcomeMessage:
      String(
        store?.config?.widget?.welcomeMessage ||
          "Hola, te ayudo con productos, precios y pedidos.",
      ) || "Hola, te ayudo con productos, precios y pedidos.",
    ctaLabel: String(store?.config?.widget?.ctaLabel || "Abrir chat"),
    assistantPlaceholder: String(
      store?.config?.widget?.assistantPlaceholder || "Escribe tu consulta...",
    ),
    position: store?.config?.widget?.position === "left" ? "left" : "right",
  } as const;
  const testimonials = useMemo(() => {
    const raw = store?.config?.testimonials;
    return Array.isArray(raw) && raw.length ? raw : [];
  }, [store?.config?.testimonials]);
  const faqItems = useMemo(() => {
    const raw = store?.config?.faq;
    return Array.isArray(raw) && raw.length ? raw : [];
  }, [store?.config?.faq]);
  const currentTestimonial = testimonials.length
    ? testimonials[Math.min(testimonialIndex, testimonials.length - 1)]
    : null;

  const ecommerce = useMemo(() => {
    const settings = store?.config?.ecommerce || {};
    return {
      deliveryEnabled: settings.deliveryEnabled !== false,
      pickupEnabled: settings.pickupEnabled !== false,
      inStoreEnabled: settings.inStoreEnabled === true,
      shippingBaseFeeCents: Math.max(0, Number(settings.shippingBaseFeeCents || 0)),
      freeShippingFromCents: Math.max(0, Number(settings.freeShippingFromCents || 0)),
      yapeEnabled: settings.yapeEnabled !== false,
      plinEnabled: settings.plinEnabled !== false,
      transferEnabled: settings.transferEnabled !== false,
      cashEnabled: settings.cashEnabled !== false,
      cardEnabled: settings.cardEnabled === true,
      termsRequired: settings.termsRequired !== false,
      termsText:
        String(settings.termsText || "").trim() ||
        "Acepto terminos y condiciones de compra.",
    };
  }, [store?.config?.ecommerce]);

  const availableShippingMethods = useMemo<ShippingMethod[]>(() => {
    const methods: ShippingMethod[] = [];
    if (ecommerce.deliveryEnabled) methods.push("delivery");
    if (ecommerce.pickupEnabled) methods.push("pickup");
    if (ecommerce.inStoreEnabled) methods.push("instore");
    return methods.length ? methods : (["delivery"] as ShippingMethod[]);
  }, [ecommerce.deliveryEnabled, ecommerce.inStoreEnabled, ecommerce.pickupEnabled]);

  const availablePaymentMethods = useMemo<PaymentMethod[]>(() => {
    const methods: PaymentMethod[] = [];
    if (ecommerce.yapeEnabled) methods.push("yape");
    if (ecommerce.plinEnabled) methods.push("plin");
    if (ecommerce.transferEnabled) methods.push("transfer");
    if (ecommerce.cashEnabled) methods.push("cash");
    if (ecommerce.cardEnabled) methods.push("card");
    return methods.length ? methods : (["yape"] as PaymentMethod[]);
  }, [
    ecommerce.cardEnabled,
    ecommerce.cashEnabled,
    ecommerce.plinEnabled,
    ecommerce.transferEnabled,
    ecommerce.yapeEnabled,
  ]);

  const productsById = useMemo(() => {
    const map = new Map<string, NonNullable<PublicStorefront["products"]>[number]>();
    (store?.products || []).forEach((item) => map.set(item.id, item));
    return map;
  }, [store?.products]);

  const offerProducts = useMemo(
    () => (store?.products || []).filter((p) => p.active && isOffer(p)),
    [store?.products],
  );

  const sorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    let items = (store?.products || []).filter((p) => p.active).filter((p) => {
      if (category !== "Todos" && String(p.category || "General") !== category) return false;
      if (!term) return true;
      return [p.name, p.description, p.category || "", p.badge || ""].join(" ").toLowerCase().includes(term);
    });
    if (sortBy === "priceAsc") items = [...items].sort((a, b) => a.displayPriceCents - b.displayPriceCents);
    else if (sortBy === "priceDesc") items = [...items].sort((a, b) => b.displayPriceCents - a.displayPriceCents);
    else if (sortBy === "nameAsc") items = [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));
    return items;
  }, [store?.products, search, category, sortBy]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = window.setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [testimonials]);

  useEffect(() => {
    if (!testimonials.length) {
      setTestimonialIndex(0);
      return;
    }
    if (testimonialIndex >= testimonials.length) {
      setTestimonialIndex(0);
    }
  }, [testimonialIndex, testimonials]);

  useEffect(() => {
    if (availableShippingMethods.includes(checkoutShippingMethod)) return;
    setCheckoutShippingMethod(availableShippingMethods[0] || "delivery");
  }, [availableShippingMethods, checkoutShippingMethod]);

  useEffect(() => {
    if (availablePaymentMethods.includes(checkoutPaymentMethod)) return;
    setCheckoutPaymentMethod(availablePaymentMethods[0] || "yape");
  }, [availablePaymentMethods, checkoutPaymentMethod]);

  const cartCount = useMemo(() => cart.reduce((a, b) => a + b.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((a, b) => a + b.priceCents * b.quantity, 0), [cart]);
  const shippingFeeCents = useMemo(() => {
    if (checkoutShippingMethod !== "delivery") return 0;
    const freeFrom = ecommerce.freeShippingFromCents || 0;
    if (freeFrom > 0 && cartSubtotal >= freeFrom) return 0;
    return ecommerce.shippingBaseFeeCents || 0;
  }, [
    cartSubtotal,
    checkoutShippingMethod,
    ecommerce.freeShippingFromCents,
    ecommerce.shippingBaseFeeCents,
  ]);
  const cartTotal = cartSubtotal + shippingFeeCents;

  const addToCart = (product: any) => {
    const maxStock = Math.max(0, Number(product?.stockQty ?? 0));
    if (maxStock === 0) {
      setCheckoutError("Este producto esta agotado temporalmente.");
      return;
    }
    setCheckoutError("");
    setCheckoutSuccess("");
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id);
      if (idx >= 0) {
        if (prev[idx].quantity >= maxStock) {
          setCheckoutError("No hay mas stock disponible para este producto.");
          return prev;
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: clampQty(copy[idx].quantity + 1) };
        return copy;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          category: String(product.category || "General"),
          priceCents: product.displayPriceCents,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const maxStock = Math.max(0, Number(productsById.get(id)?.stockQty ?? 0));
          if (maxStock === 0) return null;
          const next = item.quantity + delta;
          if (next <= 0) return null;
          return { ...item, quantity: clampQty(Math.min(next, maxStock)) };
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((x) => x.id !== id));

  const openWhatsAppFromWidget = () => {
    if (!store) return;
    const wa = normalizeDigits(store.config.supportWhatsapp || "");
    if (!wa) return;
    const baseText =
      widgetMessage.trim() ||
      `Hola, quiero informacion de ${store.config.storeName}.`;
    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(baseText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const sendAssistantMessage = () => {
    const question = widgetMessage.trim();
    if (!question) return;
    const normalized = question.toLowerCase();
    let response =
      "Te ayudo con precios, stock y metodos de compra. Si prefieres, te atendemos por WhatsApp.";
    if (normalized.includes("delivery")) {
      response = "Tenemos delivery activo. El costo final se calcula segun tu zona.";
    } else if (normalized.includes("precio") || normalized.includes("costo")) {
      response = "Puedes ver precios actualizados en cada producto y agregar al carrito para cotizar.";
    } else if (normalized.includes("pago") || normalized.includes("yape") || normalized.includes("plin")) {
      response = "Aceptamos los metodos de pago activos de la tienda. Tambien puedes pedir soporte por WhatsApp.";
    } else if (normalized.includes("stock")) {
      response = "El stock visible se actualiza por producto. Si ves un item agotado, vuelve pronto o escribenos.";
    }
    setWidgetReplies((prev) => [...prev.slice(-4), `Tu: ${question}`, `Asistente: ${response}`]);
    setWidgetMessage("");
  };

  async function submitOrder() {
    if (!store) return;
    if (!cart.length) {
      setCheckoutError("Tu carrito esta vacio.");
      return;
    }

    const needsAddress = checkoutShippingMethod === "delivery";
    if (!checkoutName.trim() || !checkoutPhone.trim() || (needsAddress && !checkoutAddress.trim())) {
      setCheckoutError(
        needsAddress
          ? "Completa nombre, celular y direccion."
          : "Completa nombre y celular.",
      );
      return;
    }

    if (ecommerce.termsRequired && !checkoutAcceptedTerms) {
      setCheckoutError("Debes aceptar los terminos de compra para continuar.");
      return;
    }

    setSubmitting(true);
    setCheckoutError("");
    setCheckoutSuccess("");
    try {
      const payload = {
        storeId: store.id,
        storeSlug: store.slug,
        storeOwnerId: store.userId,
        storeName: store.config.storeName,
        source: "public-storefront",
        status: "new",
        currency: store.config.currency,
        createdAt: Date.now(),
        totals: {
          items: cartCount,
          subtotalCents: cartSubtotal,
          shippingFeeCents,
          totalCents: cartTotal,
        },
        customer: {
          name: checkoutName.trim(),
          phone: checkoutPhone.trim(),
          address: checkoutAddress.trim(),
          note: checkoutNote.trim(),
          shippingMethod: checkoutShippingMethod,
          paymentMethod: checkoutPaymentMethod,
          acceptedTerms: checkoutAcceptedTerms,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPriceCents: item.priceCents,
          totalPriceCents: item.priceCents * item.quantity,
        })),
      };
      await addDoc(collection(db, STORE_ORDERS_COLLECTION), payload);

      const wa = normalizeDigits(store.config.supportWhatsapp || "");
      if (wa) {
        const lines = [
          `Hola, quiero finalizar mi pedido en ${store.config.storeName}:`,
          "",
          ...cart.map(
            (item, i) =>
              `${i + 1}. ${item.name} x${item.quantity} - ${formatStoreMoney(
                item.priceCents * item.quantity,
                store.config.currency,
              )}`,
          ),
          "",
          `Subtotal: ${formatStoreMoney(cartSubtotal, store.config.currency)}`,
          `Envio: ${
            shippingFeeCents > 0
              ? formatStoreMoney(shippingFeeCents, store.config.currency)
              : "Gratis"
          }`,
          `Total: ${formatStoreMoney(cartTotal, store.config.currency)}`,
          `Entrega: ${shippingMethodLabel(checkoutShippingMethod)}`,
          `Pago: ${paymentMethodLabel(checkoutPaymentMethod)}`,
          `Nombre: ${checkoutName.trim()}`,
          `Celular: ${checkoutPhone.trim()}`,
          checkoutAddress.trim() ? `Direccion: ${checkoutAddress.trim()}` : "",
          checkoutNote.trim() ? `Nota: ${checkoutNote.trim()}` : "",
        ].filter(Boolean);
        window.open(
          `https://wa.me/${wa}?text=${encodeURIComponent(lines.join("\n"))}`,
          "_blank",
          "noopener,noreferrer",
        );
      }

      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setCheckoutName("");
      setCheckoutPhone("");
      setCheckoutAddress("");
      setCheckoutNote("");
      setCheckoutAcceptedTerms(false);
      setCheckoutSuccess("Pedido registrado correctamente.");
    } catch (e: any) {
      setCheckoutError(e?.message || "No se pudo finalizar el pedido.");
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (notFound || !store) {
    return <div className="grid min-h-screen place-items-center text-center"><div><h1 className="text-2xl font-black">Tienda no disponible</h1><p className="mt-2 text-slate-500">Esta tienda no existe, no esta publicada o fue pausada por plan vencido. Debe pagar para reactivarla.</p></div></div>;
  }

  return (
    <main className="min-h-screen pb-24" style={{ ...vars, background: "var(--vs-page)", color: "var(--vs-text)" }}>
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur" style={{ borderColor: "var(--vs-border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 overflow-hidden rounded-full border bg-white" style={{ borderColor: "var(--vs-border)" }}>
              {content.logoImageUrl ? <img src={content.logoImageUrl} alt="logo" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black md:text-base">{store.config.storeName}</p>
              <p className="truncate text-xs" style={{ color: "var(--vs-muted)" }}>{store.config.tagline}</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(true)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black" style={{ borderColor: "var(--vs-border)" }}>
            <ShoppingCart className="h-4 w-4" />
            {cartSettings.floatingButtonLabel} ({cartCount})
          </button>
        </div>
      </header>

      <section className="text-center text-sm font-bold text-white" style={{ background: theme.dark }}>
        <div className="mx-auto max-w-6xl px-3 py-2">{content.topStripText || "Promocion activa"}</div>
      </section>

      <section className="relative mx-auto max-w-6xl overflow-hidden border-x border-b bg-white" style={{ borderColor: "var(--vs-border)" }}>
        <div className="h-[220px] md:h-[320px]">
          {content.heroImageUrl ? <img src={content.heroImageUrl} alt="hero" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="relative px-4 pb-8 pt-16 md:px-10">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            {content.logoImageUrl ? <img src={content.logoImageUrl} alt="logo" className="h-full w-full object-cover" /> : null}
          </div>
          <h1 className="text-center text-4xl font-black">{store.config.storeName}</h1>
          <p className="mt-3 text-center text-xl" style={{ color: "var(--vs-muted)" }}>{store.config.tagline}</p>
          <div className="mx-auto mt-4 max-w-sm rounded-full px-5 py-3 text-center text-lg font-black text-white" style={{ background: "linear-gradient(135deg,var(--vs-accent),var(--vs-accent-2))" }}>
            {content.scheduleText || "8:00 am - 10:00 pm"}
          </div>
          <p className="mt-4 text-center text-lg">{content.businessAddress || ""}</p>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-6xl px-3 md:px-6">
        {offerProducts.length > 0 && (
          <section>
            <h2 className="text-4xl font-black">{content.offerSectionTitle || "ðŸ”¥ Ofertas Especiales"}</h2>
            <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
              {offerProducts.slice(0, 9).map((product) => (
                <article key={`offer-${product.id}`} className="min-w-[84%] snap-start overflow-hidden rounded-2xl border bg-white md:min-w-0" style={{ borderColor: "var(--vs-border)" }}>
                  <div className="relative h-56 bg-slate-100">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 768px) 84vw, 33vw" className="object-cover" />
                    ) : null}
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase text-white">{product.badge || "Oferta"}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-black">{product.name}</p>
                    <p className="mt-1 text-3xl font-black" style={{ color: "var(--vs-accent)" }}>{formatStoreMoney(product.displayPriceCents, store.config.currency)}</p>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={(product.stockQty ?? 0) <= 0}
                      className="mt-3 h-11 w-full rounded-xl text-base font-black text-white disabled:opacity-55"
                      style={{ background: "var(--vs-accent)" }}
                    >
                      {(product.stockQty ?? 0) <= 0
                        ? "Agotado"
                        : product.ctaLabel || "Ver oferta"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-2xl border bg-white p-4" style={{ borderColor: "var(--vs-border)" }}>
          <label className="flex h-12 items-center gap-2 rounded-xl border px-3" style={{ borderColor: "var(--vs-border)" }}>
            <Search className="h-4 w-4" style={{ color: "var(--vs-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder || "Buscar producto..."} className="w-full bg-transparent text-sm outline-none" />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className="shrink-0 rounded-xl border px-4 py-2 text-sm font-bold" style={category === c ? { borderColor: "var(--vs-accent)", background: "var(--vs-accent)", color: "#fff" } : { borderColor: "var(--vs-border)", background: "#fff" }}>{c}</button>)}</div>
          <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold">Total: {sorted.length} productos</p><label className="relative"><select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="h-11 appearance-none rounded-xl border bg-white px-3 pr-9 text-sm font-semibold outline-none" style={{ borderColor: "var(--vs-border)" }}><option value="featured">Ordenar por</option><option value="priceAsc">Precio ascendente</option><option value="priceDesc">Precio descendente</option><option value="nameAsc">Nombre A-Z</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" /></label></div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "var(--vs-border)" }}>
              <div className="relative h-44 bg-slate-100">
                {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" /> : null}
                <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-black uppercase text-white">{product.badge || "Oferta"}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--vs-muted)" }}>{product.category || "General"}</p>
                <h3 className="mt-1 line-clamp-2 text-xl font-black">{product.name}</h3>
                <p className="line-clamp-1 text-sm" style={{ color: "var(--vs-muted)" }}>{product.description}</p>
                <p className="mt-1 text-xs font-semibold" style={{ color: "var(--vs-muted)" }}>
                  Stock: {Math.max(0, Number(product.stockQty || 0))}
                </p>
                {(product.compareAtPriceCents || 0) > product.displayPriceCents ? <p className="mt-1 text-sm line-through" style={{ color: "var(--vs-muted)" }}>{formatStoreMoney(product.compareAtPriceCents || 0, store.config.currency)}</p> : <div className="h-5" />}
                <p className="text-3xl font-black" style={{ color: "var(--vs-accent)" }}>{formatStoreMoney(product.displayPriceCents, store.config.currency)}</p>
                <button
                  onClick={() => addToCart(product)}
                  disabled={(product.stockQty ?? 0) <= 0}
                  className="mt-2 h-11 w-full rounded-xl text-base font-black text-white disabled:opacity-55"
                  style={{ background: "var(--vs-accent)" }}
                >
                  {(product.stockQty ?? 0) <= 0
                    ? "Agotado"
                    : product.ctaLabel || "Ver producto"}
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-45" style={{ borderColor: "var(--vs-border)" }}>&lt; Anterior</button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const p = i + 1;
            return <button key={p} onClick={() => setPage(p)} className="h-10 w-10 rounded-xl border text-sm font-black" style={p === page ? { borderColor: "var(--vs-accent)", background: "var(--vs-accent)", color: "#fff" } : { borderColor: "var(--vs-border)" }}>{p}</button>;
          })}
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-45" style={{ borderColor: "var(--vs-border)" }}>Siguiente &gt;</button>
        </div>

        {currentTestimonial ? (
          <section className="mt-8 rounded-2xl border bg-white p-4" style={{ borderColor: "var(--vs-border)" }}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black">Testimonios reales</h3>
              <p className="text-xs font-bold" style={{ color: "var(--vs-muted)" }}>
                {testimonialIndex + 1}/{testimonials.length}
              </p>
            </div>
            <div className="mt-3 rounded-xl border p-4" style={{ borderColor: "var(--vs-border)" }}>
              <p className="text-sm font-black" style={{ color: "var(--vs-accent)" }}>
                {renderStars(Number(currentTestimonial.rating || 5))}
              </p>
              <p className="mt-2 text-sm">{currentTestimonial.text}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.08em]">
                {currentTestimonial.name}
              </p>
              <p className="text-xs" style={{ color: "var(--vs-muted)" }}>
                {currentTestimonial.role || "Cliente"}
              </p>
            </div>
          </section>
        ) : null}

        {faqItems.length ? (
          <section className="mt-8 rounded-2xl border bg-white p-4" style={{ borderColor: "var(--vs-border)" }}>
            <h3 className="text-lg font-black">Preguntas frecuentes</h3>
            <div className="mt-3 space-y-2">
              {faqItems.map((faq) => (
                <details key={faq.id} className="rounded-xl border px-3 py-2" style={{ borderColor: "var(--vs-border)" }}>
                  <summary className="cursor-pointer text-sm font-bold">{faq.question}</summary>
                  <p className="mt-2 text-sm" style={{ color: "var(--vs-muted)" }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <footer className="mt-10 border-t text-white" style={{ borderColor: "var(--vs-border)", background: theme.dark }}>
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {[
            { label: "Facebook", url: content.facebookUrl || "#" },
            { label: "Instagram", url: content.instagramUrl || "#" },
            { label: "TikTok", url: content.tiktokUrl || "#" },
          ].map((social) => (
            <div key={social.label} className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div><p className="text-xs text-white/70">Siguenos en {social.label}</p><p className="text-xl font-black">{store.config.storeName}</p></div>
              <a href={social.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-black/50 px-5 py-2 text-sm font-black">Seguir</a>
            </div>
          ))}
          <p className="mt-5 text-center text-sm text-white/75">{content.footerLeft || "(c) 2026 Fast Page"}</p>
        </div>
      </footer>

      {cartSettings.floatingButtonEnabled ? (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-5 right-4 z-40 inline-flex h-14 min-w-[56px] items-center justify-center gap-1 rounded-full px-3 text-white shadow-2xl" style={{ background: theme.dark }}>
          <Gift className="h-5 w-5" />
          <span className="text-[11px] font-black uppercase">{cartSettings.floatingButtonLabel}</span>
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-black">{cartCount}</span>
        </button>
      ) : null}

      {widgetSettings.enabled ? (
        <div
          className={`fixed ${cartSettings.floatingButtonEnabled && widgetSettings.position !== "left" ? "bottom-24" : "bottom-5"} z-40 ${widgetSettings.position === "left" ? "left-4" : "right-4"}`}
        >
          {widgetOpen ? (
            <div className="mb-2 w-[min(90vw,320px)] rounded-2xl border bg-white p-3 shadow-2xl" style={{ borderColor: "var(--vs-border)" }}>
              <p className="text-sm font-black">{widgetSettings.title}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--vs-muted)" }}>{widgetSettings.welcomeMessage}</p>
              {widgetSettings.mode === "assistant" ? (
                <div className="mt-3 space-y-2">
                  <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border p-2 text-xs" style={{ borderColor: "var(--vs-border)" }}>
                    {widgetReplies.length ? (
                      widgetReplies.map((item, index) => (
                        <p key={`${item}-${index}`}>{item}</p>
                      ))
                    ) : (
                      <p style={{ color: "var(--vs-muted)" }}>Pregunta por delivery, pagos o stock.</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={widgetMessage}
                      onChange={(e) => setWidgetMessage(e.target.value)}
                      placeholder={widgetSettings.assistantPlaceholder}
                      className="h-9 w-full rounded-lg border px-2 text-xs outline-none"
                      style={{ borderColor: "var(--vs-border)" }}
                    />
                    <button
                      type="button"
                      onClick={sendAssistantMessage}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white"
                      style={{ background: "var(--vs-accent)" }}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={openWhatsAppFromWidget}
                    className="h-9 w-full rounded-lg border text-xs font-black"
                    style={{ borderColor: "var(--vs-border)" }}
                  >
                    Pasar a WhatsApp
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openWhatsAppFromWidget}
                  className="mt-3 h-9 w-full rounded-lg text-xs font-black text-white"
                  style={{ background: "var(--vs-accent)" }}
                >
                  Ir a WhatsApp
                </button>
              )}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setWidgetOpen((prev) => !prev)}
            className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-xs font-black text-white shadow-xl"
            style={{ background: "var(--vs-accent)" }}
          >
            {widgetSettings.mode === "assistant" ? <Bot className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            {widgetSettings.ctaLabel}
          </button>
        </div>
      ) : null}

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button className="absolute inset-0 bg-black/55" onClick={() => { setCartOpen(false); setCheckoutOpen(false); }} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l bg-white p-4" style={{ borderColor: "var(--vs-border)" }}>
            <div className="flex items-center justify-between"><h3 className="text-xl font-black">Carrito</h3><button onClick={() => { setCartOpen(false); setCheckoutOpen(false); }} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border" style={{ borderColor: "var(--vs-border)" }}><X className="h-4 w-4" /></button></div>
            {!checkoutOpen && (
              <div className="mt-4 flex h-[calc(100%-88px)] flex-col">
                <div className="flex-1 overflow-y-auto pr-1">
                  {!cart.length ? <div className="rounded-xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--vs-border)", color: "var(--vs-muted)" }}>Tu carrito esta vacio.</div> : cart.map((item) => (
                    <article key={item.id} className="mb-3 rounded-xl border p-3" style={{ borderColor: "var(--vs-border)" }}>
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">{item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill unoptimized sizes="64px" className="object-cover" /> : null}</div>
                        <div className="min-w-0 flex-1"><p className="line-clamp-1 font-black">{item.name}</p><p className="text-xs" style={{ color: "var(--vs-muted)" }}>{item.category}</p><p className="font-black" style={{ color: "var(--vs-accent)" }}>{formatStoreMoney(item.priceCents, store.config.currency)}</p></div>
                      </div>
                      <div className="mt-2 flex items-center justify-between"><div className="inline-flex items-center rounded-lg border" style={{ borderColor: "var(--vs-border)" }}><button onClick={() => updateQty(item.id, -1)} className="inline-flex h-8 w-8 items-center justify-center"><Minus className="h-3.5 w-3.5" /></button><span className="w-8 text-center text-sm font-black">{item.quantity}</span><button onClick={() => updateQty(item.id, 1)} className="inline-flex h-8 w-8 items-center justify-center"><Plus className="h-3.5 w-3.5" /></button></div><button onClick={() => removeItem(item.id)} className="text-xs font-black uppercase text-red-600">Quitar</button></div>
                    </article>
                  ))}
                </div>
                <div className="border-t pt-3" style={{ borderColor: "var(--vs-border)" }}>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--vs-muted)" }}>Subtotal</span>
                    <span className="font-black" style={{ color: "var(--vs-accent)" }}>
                      {formatStoreMoney(cartSubtotal, store.config.currency)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span style={{ color: "var(--vs-muted)" }}>Envio</span>
                    <span className="font-black" style={{ color: "var(--vs-accent)" }}>
                      {shippingFeeCents > 0
                        ? formatStoreMoney(shippingFeeCents, store.config.currency)
                        : "Gratis"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span style={{ color: "var(--vs-muted)" }}>Total</span>
                    <span className="text-xl font-black" style={{ color: "var(--vs-accent)" }}>
                      {formatStoreMoney(cartTotal, store.config.currency)}
                    </span>
                  </div>
                  <button disabled={!cart.length} onClick={() => setCheckoutOpen(true)} className="mt-3 h-11 w-full rounded-xl text-sm font-black text-white disabled:opacity-60" style={{ background: "var(--vs-accent)" }}>Finalizar pedido</button>
                </div>
              </div>
            )}
            {checkoutOpen && (
              <div className="mt-4 flex h-[calc(100%-88px)] flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  <input value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} placeholder="Nombre" className="h-11 w-full rounded-xl border px-3 text-sm outline-none" style={{ borderColor: "var(--vs-border)" }} />
                  <input value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="Celular" className="h-11 w-full rounded-xl border px-3 text-sm outline-none" style={{ borderColor: "var(--vs-border)" }} />
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--vs-muted)" }}>
                      Metodo de entrega
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {availableShippingMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setCheckoutShippingMethod(method)}
                          className="h-10 rounded-xl border px-2 text-xs font-bold"
                          style={
                            checkoutShippingMethod === method
                              ? { borderColor: "var(--vs-accent)", background: "var(--vs-accent)", color: "#fff" }
                              : { borderColor: "var(--vs-border)" }
                          }
                        >
                          {shippingMethodLabel(method)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {checkoutShippingMethod === "delivery" ? (
                    <input value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="Direccion de entrega" className="h-11 w-full rounded-xl border px-3 text-sm outline-none" style={{ borderColor: "var(--vs-border)" }} />
                  ) : null}
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--vs-muted)" }}>
                      Metodo de pago
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePaymentMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setCheckoutPaymentMethod(method)}
                          className="h-10 rounded-xl border px-2 text-xs font-bold"
                          style={
                            checkoutPaymentMethod === method
                              ? { borderColor: "var(--vs-accent)", background: "var(--vs-accent)", color: "#fff" }
                              : { borderColor: "var(--vs-border)" }
                          }
                        >
                          {paymentMethodLabel(method)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={checkoutNote} onChange={(e) => setCheckoutNote(e.target.value)} placeholder="Nota" className="min-h-[88px] w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--vs-border)" }} />
                  {ecommerce.termsRequired ? (
                    <label className="flex items-start gap-2 rounded-xl border px-3 py-2 text-xs font-semibold" style={{ borderColor: "var(--vs-border)" }}>
                      <input
                        type="checkbox"
                        checked={checkoutAcceptedTerms}
                        onChange={(e) => setCheckoutAcceptedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4"
                      />
                      <span>{ecommerce.termsText}</span>
                    </label>
                  ) : null}
                  {checkoutError ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{checkoutError}</p> : null}
                  {checkoutSuccess ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{checkoutSuccess}</p> : null}
                </div>
                <div className="border-t pt-3" style={{ borderColor: "var(--vs-border)" }}>
                  <div className="mb-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--vs-muted)" }}>Subtotal</span>
                      <b>{formatStoreMoney(cartSubtotal, store.config.currency)}</b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--vs-muted)" }}>Envio</span>
                      <b>{shippingFeeCents > 0 ? formatStoreMoney(shippingFeeCents, store.config.currency) : "Gratis"}</b>
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <span>Total</span>
                      <b style={{ color: "var(--vs-accent)" }}>{formatStoreMoney(cartTotal, store.config.currency)}</b>
                    </div>
                  </div>
                  <button onClick={submitOrder} disabled={submitting} className="h-11 w-full rounded-xl text-sm font-black text-white disabled:opacity-60" style={{ background: "var(--vs-accent)" }}>{submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Enviar pedido por WhatsApp"}</button>
                  <button onClick={() => setCheckoutOpen(false)} className="mt-2 h-11 w-full rounded-xl border text-xs font-black uppercase" style={{ borderColor: "var(--vs-border)" }}>Volver al carrito</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

