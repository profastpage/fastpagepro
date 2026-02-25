"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import {
  BadgePercent,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  STORE_ORDERS_COLLECTION,
  createProductCategoryList,
  formatStoreMoney,
  getPublishedStoreBySlug,
  resolveStoreAccentColors,
  resolveStoreTheme,
  sanitizeStoreSlug,
  type PublicStoreProduct,
  type PublicStorefront,
} from "@/lib/publicStorefront";

type SortOption = "featured" | "priceAsc" | "priceDesc" | "nameAsc";

type CartLine = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  unitPriceCents: number;
  quantity: number;
};

function clampQuantity(value: number) {
  return Math.max(1, Math.min(99, Math.trunc(value)));
}

function getInitials(value: string) {
  const clean = String(value || "").trim();
  if (!clean) return "FP";
  const parts = clean.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function normalizeDigits(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function ProductSkeleton() {
  return (
    <article className="rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[color:var(--store-surface-soft)]" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-1/3 rounded bg-[color:var(--store-surface-soft)]" />
        <div className="h-4 w-5/6 rounded bg-[color:var(--store-surface-soft)]" />
        <div className="h-3 w-full rounded bg-[color:var(--store-surface-soft)]" />
        <div className="h-3 w-2/3 rounded bg-[color:var(--store-surface-soft)]" />
        <div className="h-10 w-full rounded-2xl bg-[color:var(--store-surface-soft)]" />
      </div>
    </article>
  );
}

export default function PublicStorefrontPage() {
  const params = useParams<{ slug: string }>();
  const routeSlug = useMemo(
    () => sanitizeStoreSlug(params?.slug || ""),
    [params?.slug],
  );

  const [store, setStore] = useState<PublicStorefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStore() {
      if (!routeSlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        const published = await getPublishedStoreBySlug(routeSlug);
        if (!active) return;

        if (!published) {
          setNotFound(true);
          return;
        }

        setStore(published);
      } catch (loadError: any) {
        if (!active) return;
        setError(loadError?.message || "No se pudo cargar la tienda.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadStore();
    return () => {
      active = false;
    };
  }, [routeSlug]);

  const cartStorageKey = store ? `fastpage_public_store_cart_${store.id}` : "";

  useEffect(() => {
    if (!cartStorageKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(cartStorageKey);
      if (!raw) {
        setCart([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setCart([]);
        return;
      }
      const normalized = parsed
        .map((item: any) => ({
          id: String(item?.id || ""),
          name: String(item?.name || ""),
          imageUrl: String(item?.imageUrl || ""),
          category: String(item?.category || "General"),
          unitPriceCents: Math.max(0, Math.round(Number(item?.unitPriceCents || 0))),
          quantity: clampQuantity(Number(item?.quantity || 1)),
        }))
        .filter((item: CartLine) => item.id);
      setCart(normalized);
    } catch {
      setCart([]);
    }
  }, [cartStorageKey]);

  useEffect(() => {
    if (!cartStorageKey || typeof window === "undefined") return;
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  const categories = useMemo(
    () => (store ? createProductCategoryList(store.products) : ["Todos"]),
    [store],
  );

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("Todos");
    }
  }, [categories, selectedCategory]);

  const offerProducts = useMemo(
    () => (store?.products || []).filter((product) => product.hasOffer),
    [store?.products],
  );

  const filteredProducts = useMemo(() => {
    const products = store?.products || [];
    const search = searchTerm.trim().toLowerCase();

    let result = products.filter((product) => {
      if (selectedCategory !== "Todos" && product.category !== selectedCategory) {
        return false;
      }

      if (!search) return true;
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        String(product.badge || "").toLowerCase().includes(search)
      );
    });

    if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => a.displayPriceCents - b.displayPriceCents);
    } else if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => b.displayPriceCents - a.displayPriceCents);
    } else if (sortBy === "nameAsc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "es"));
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy, store?.products]);

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const cartSubtotalCents = useMemo(
    () => cart.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0),
    [cart],
  );

  const theme = resolveStoreTheme(
    store?.config || {
      storeName: "Tienda",
      tagline: "",
      currency: "PEN",
      themeId: "aurora",
    },
  );
  const accent = resolveStoreAccentColors(
    store?.config || {
      storeName: "Tienda",
      tagline: "",
      currency: "PEN",
      themeId: "aurora",
    },
  );

  const surfaceStyle = {
    "--store-primary": accent.primary,
    "--store-secondary": accent.secondary,
    "--store-bg": theme.surface,
    "--store-surface": theme.surface2,
    "--store-surface-soft": "color-mix(in srgb, var(--store-surface) 72%, #ffffff 10%)",
    "--store-border": "color-mix(in srgb, var(--store-primary) 26%, rgba(255,255,255,0.14))",
    "--store-text": theme.text,
    "--store-muted": theme.muted,
    "--store-font": theme.font,
    "--store-shadow":
      "0 20px 48px -28px color-mix(in srgb, var(--store-primary) 24%, rgba(0,0,0,0.7))",
  } as CSSProperties;

  function addToCart(product: PublicStoreProduct) {
    setOrderError("");
    setOrderSuccess("");
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: clampQuantity(copy[idx].quantity + 1),
        };
        return copy;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          category: product.category,
          unitPriceCents: product.displayPriceCents,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return {
            ...item,
            quantity: clampQuantity(nextQty),
          };
        })
        .filter(Boolean) as CartLine[],
    );
  }

  async function submitOrder() {
    if (!store) return;
    if (cart.length === 0) {
      setOrderError("Agrega productos antes de finalizar.");
      return;
    }

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();
    const note = customerNote.trim();

    if (!name || !phone || !address) {
      setOrderError("Completa nombre, celular y direccion.");
      return;
    }

    setSubmittingOrder(true);
    setOrderError("");
    setOrderSuccess("");

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
          subtotalCents: cartSubtotalCents,
          totalCents: cartSubtotalCents,
        },
        customer: {
          name,
          phone,
          address,
          note,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          totalPriceCents: item.unitPriceCents * item.quantity,
        })),
      };

      await addDoc(collection(db, STORE_ORDERS_COLLECTION), payload);

      const phoneDigits = normalizeDigits(store.config.supportWhatsapp || "");
      const lines = [
        `Hola, quiero finalizar este pedido de ${store.config.storeName}:`,
        "",
        ...cart.map(
          (item, index) =>
            `${index + 1}. ${item.name} x${item.quantity} - ${formatStoreMoney(
              item.unitPriceCents * item.quantity,
              store.config.currency,
            )}`,
        ),
        "",
        `Subtotal: ${formatStoreMoney(cartSubtotalCents, store.config.currency)}`,
        "",
        `Nombre: ${name}`,
        `Celular: ${phone}`,
        `Direccion: ${address}`,
        note ? `Nota: ${note}` : "",
      ].filter(Boolean);

      if (phoneDigits) {
        const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
          lines.join("\n"),
        )}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setCart([]);
      setCheckoutMode(false);
      setIsCartOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerNote("");
      setOrderSuccess(
        phoneDigits
          ? "Pedido enviado y sincronizado correctamente."
          : "Pedido guardado correctamente. Configura WhatsApp para envio automatico.",
      );
    } catch (submitError: any) {
      setOrderError(
        submitError?.message ||
          "No se pudo finalizar el pedido. Intenta nuevamente.",
      );
    } finally {
      setSubmittingOrder(false);
    }
  }

  if (loading) {
    return (
      <main
        className="min-h-screen px-4 py-8 md:px-8 lg:px-10"
        style={{
          ...surfaceStyle,
          fontFamily: "var(--store-font)",
          background:
            "radial-gradient(1200px 600px at 10% 0%, color-mix(in srgb, var(--store-primary) 14%, transparent), transparent 65%), radial-gradient(900px 500px at 100% 10%, color-mix(in srgb, var(--store-secondary) 13%, transparent), transparent 70%), var(--store-bg)",
          color: "var(--store-text)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] py-14">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} />
            ))}
          </section>
        </div>
      </main>
    );
  }

  if (notFound || !store) {
    return (
      <main
        className="min-h-screen px-4 py-10 md:px-8"
        style={{
          ...surfaceStyle,
          fontFamily: "var(--store-font)",
          background:
            "radial-gradient(1200px 600px at 10% 0%, color-mix(in srgb, var(--store-primary) 14%, transparent), transparent 65%), radial-gradient(900px 500px at 100% 10%, color-mix(in srgb, var(--store-secondary) 13%, transparent), transparent 70%), var(--store-bg)",
          color: "var(--store-text)",
        }}
      >
        <div className="mx-auto max-w-xl rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-8 text-center shadow-[var(--store-shadow)]">
          <h1 className="text-2xl font-black">Tienda no disponible</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--store-muted)" }}>
            Esta tienda no existe o aun no fue publicada.
          </p>
        </div>
      </main>
    );
  }

  const supportWhatsapp = normalizeDigits(store.config.supportWhatsapp || "");

  return (
    <main
      className="min-h-screen"
      style={{
        ...surfaceStyle,
        fontFamily: "var(--store-font)",
        background:
          "radial-gradient(1200px 600px at 10% 0%, color-mix(in srgb, var(--store-primary) 14%, transparent), transparent 65%), radial-gradient(900px 500px at 100% 10%, color-mix(in srgb, var(--store-secondary) 13%, transparent), transparent 70%), var(--store-bg)",
        color: "var(--store-text)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-4 md:px-8 md:pt-6">
        <header className="sticky top-3 z-30 rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)]/95 backdrop-blur px-4 py-3 shadow-[var(--store-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 shrink-0 rounded-2xl border border-[color:var(--store-border)] bg-gradient-to-br from-[color:var(--store-primary)] to-[color:var(--store-secondary)] text-black font-black flex items-center justify-center">
                {getInitials(store.config.storeName)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--store-muted)" }}>
                  Online Store
                </p>
                <h1 className="truncate text-base md:text-lg font-black">
                  {store.config.storeName}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex h-11 items-center gap-2 rounded-2xl border border-[color:var(--store-border)] bg-black/20 px-4 text-sm font-black transition hover:brightness-110"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Carrito</span>
              <span className="rounded-full px-2 py-0.5 text-xs font-black text-black bg-[color:var(--store-primary)]">
                {cartCount}
              </span>
            </button>
          </div>
        </header>

        <section className="mt-5 rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-5 shadow-[var(--store-shadow)] md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: "var(--store-muted)" }}>
                Catalogo ecommerce
              </p>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                {store.config.tagline || "Tienda online multirubro"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                const productsSection = document.getElementById("store-products-grid");
                productsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[color:var(--store-border)] bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] px-5 text-sm font-black text-black transition hover:brightness-110"
            >
              Ver productos
            </button>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                    active
                      ? "text-black bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] border-transparent"
                      : "border-[color:var(--store-border)] bg-[color:var(--store-surface)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {offerProducts.length > 0 && (
          <section className="mt-5 rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em]">
              <BadgePercent className="h-4 w-4" />
              Ofertas especiales
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {offerProducts.slice(0, 3).map((product) => (
                <article
                  key={`offer-${product.id}`}
                  className="rounded-2xl border border-[color:var(--store-border)] bg-black/20 p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--store-muted)" }}>
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-sm font-black line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-lg font-black text-[color:var(--store-primary)]">
                    {formatStoreMoney(product.displayPriceCents, store.config.currency)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5 rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-3 md:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--store-border)] bg-black/20 px-3">
              <Search className="h-4 w-4" style={{ color: "var(--store-muted)" }} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar producto, marca o categoria..."
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--store-muted)]"
              />
            </label>
            <label className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-11 w-full appearance-none rounded-2xl border border-[color:var(--store-border)] bg-black/20 px-3 pr-9 text-sm font-bold outline-none"
              >
                <option value="featured">Ordenar: destacados</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="nameAsc">Nombre A-Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </label>
          </div>
        </section>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <section id="store-products-grid" className="mt-5">
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[color:var(--store-border)] bg-[color:var(--store-surface)] px-5 py-10 text-center">
              <ShoppingBag className="mx-auto h-8 w-8" style={{ color: "var(--store-muted)" }} />
              <p className="mt-3 text-sm" style={{ color: "var(--store-muted)" }}>
                No hay productos para este filtro.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[color:var(--store-surface-soft)]">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-300 hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold" style={{ color: "var(--store-muted)" }}>
                        Sin imagen
                      </div>
                    )}

                    {product.hasOffer && (
                      <span className="absolute left-2 top-2 rounded-full bg-[color:var(--store-primary)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                        Oferta
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--store-muted)" }}>
                      {product.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-black md:text-[15px]">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs" style={{ color: "var(--store-muted)" }}>
                      {product.description || "Producto disponible para pedido inmediato."}
                    </p>

                    <div className="mt-auto pt-3">
                      {product.compareAtPriceCents ? (
                        <p className="text-xs line-through" style={{ color: "var(--store-muted)" }}>
                          {formatStoreMoney(product.compareAtPriceCents, store.config.currency)}
                        </p>
                      ) : (
                        <div className="h-[18px]" />
                      )}

                      <div className="flex items-end justify-between gap-2">
                        <p className="text-base font-black md:text-lg text-[color:var(--store-primary)]">
                          {formatStoreMoney(product.displayPriceCents, store.config.currency)}
                        </p>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="inline-flex h-9 items-center rounded-xl border border-[color:var(--store-border)] px-3 text-[11px] font-black uppercase tracking-[0.12em] transition hover:brightness-110 bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] text-black"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-10 rounded-3xl border border-[color:var(--store-border)] bg-zinc-950 px-4 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--store-muted)" }}>
              Redes de la tienda
            </p>
            <div className="flex flex-wrap gap-2">
              {supportWhatsapp ? (
                <a
                  href={`https://wa.me/${supportWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[color:var(--store-border)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] transition hover:brightness-110"
                >
                  WhatsApp
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-full border border-[color:var(--store-border)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] transition hover:brightness-110"
              >
                Volver arriba
              </button>
            </div>
          </div>
        </footer>
      </div>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-5 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full border border-[color:var(--store-border)] bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] px-4 text-sm font-black text-black shadow-[var(--store-shadow)] transition hover:brightness-110"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>{cartCount}</span>
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutMode(false);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black">Carrito</h3>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutMode(false);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--store-border)] bg-black/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!checkoutMode && (
              <div className="mt-4 flex h-[calc(100%-90px)] flex-col">
                <div className="flex-1 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[color:var(--store-border)] p-5 text-center text-sm" style={{ color: "var(--store-muted)" }}>
                      Tu carrito esta vacio.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <article
                          key={`cart-${item.id}`}
                          className="rounded-2xl border border-[color:var(--store-border)] bg-black/20 p-3"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[color:var(--store-surface-soft)]">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--store-muted)" }}>
                                {item.category}
                              </p>
                              <h4 className="line-clamp-1 text-sm font-black">{item.name}</h4>
                              <p className="text-sm font-black text-[color:var(--store-primary)]">
                                {formatStoreMoney(item.unitPriceCents, store.config.currency)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-xl border border-[color:var(--store-border)]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="inline-flex h-8 w-8 items-center justify-center"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-black">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="inline-flex h-8 w-8 items-center justify-center"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs font-black uppercase tracking-[0.12em] text-red-300"
                            >
                              Quitar
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-[color:var(--store-border)] pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--store-muted)" }}>Subtotal</span>
                    <span className="text-lg font-black text-[color:var(--store-primary)]">
                      {formatStoreMoney(cartSubtotalCents, store.config.currency)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(true)}
                    disabled={cart.length === 0}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 disabled:opacity-60"
                  >
                    Finalizar pedido
                  </button>
                </div>
              </div>
            )}

            {checkoutMode && (
              <div className="mt-4 flex h-[calc(100%-90px)] flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--store-muted)" }}>
                      Nombre
                    </span>
                    <input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-[color:var(--store-border)] bg-black/20 px-3 text-sm outline-none"
                      placeholder="Tu nombre"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--store-muted)" }}>
                      Celular
                    </span>
                    <input
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-[color:var(--store-border)] bg-black/20 px-3 text-sm outline-none"
                      placeholder="999 999 999"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--store-muted)" }}>
                      Direccion
                    </span>
                    <input
                      value={customerAddress}
                      onChange={(event) => setCustomerAddress(event.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-[color:var(--store-border)] bg-black/20 px-3 text-sm outline-none"
                      placeholder="Distrito, calle, referencia"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--store-muted)" }}>
                      Nota
                    </span>
                    <textarea
                      value={customerNote}
                      onChange={(event) => setCustomerNote(event.target.value)}
                      className="mt-1 min-h-[84px] w-full rounded-xl border border-[color:var(--store-border)] bg-black/20 px-3 py-2 text-sm outline-none"
                      placeholder="Indicaciones adicionales"
                    />
                  </label>

                  {orderError ? (
                    <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      {orderError}
                    </p>
                  ) : null}

                  {orderSuccess ? (
                    <p className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                      {orderSuccess}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 border-t border-[color:var(--store-border)] pt-4 space-y-2">
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={submittingOrder}
                    className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[color:var(--store-primary)] to-[color:var(--store-secondary)] text-sm font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 disabled:opacity-60"
                  >
                    {submittingOrder ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Enviar pedido por WhatsApp"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[color:var(--store-border)] bg-black/20 text-xs font-black uppercase tracking-[0.12em]"
                  >
                    Volver al carrito
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
