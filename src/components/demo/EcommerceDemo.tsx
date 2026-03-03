"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, Truck, X } from "lucide-react";
import type { EcommerceProduct, EcommerceStoreData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import DemoImage from "@/components/demo/DemoImage";
import DemoSocialLinks from "@/components/demo/DemoSocialLinks";
import { getDemoSocialLinks } from "@/lib/demoSocial";
import {
  buildEcommerceDemoMessage,
  buildOfficialDemoWhatsappUrl,
} from "@/lib/demoWhatsapp";

type CartMap = Record<string, number>;

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EcommerceDemo({ demo }: { demo: EcommerceStoreData }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<"top" | "priceAsc" | "priceDesc" | "new">(
    "top",
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "retiro">(
    "delivery",
  );
  const [cart, setCart] = useState<CartMap>({});
  const socialLinks = useMemo(() => getDemoSocialLinks(demo), [demo]);

  const filteredProducts = useMemo(() => {
    const filtered = demo.products.filter((product) => {
      if (category !== "Todos" && product.category !== category) return false;
      if (!search.trim()) return true;
      const text =
        `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return text.includes(search.trim().toLowerCase());
    });

    if (sortBy === "priceAsc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "priceDesc")
      return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "new") {
      return [...filtered].sort(
        (a, b) => Number(b.badge === "Nuevo") - Number(a.badge === "Nuevo"),
      );
    }
    return [...filtered].sort(
      (a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)),
    );
  }, [category, demo.products, search, sortBy]);

  const cartProducts = useMemo(
    () =>
      demo.products
        .filter((product) => (cart[product.id] || 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] || 0 })),
    [cart, demo.products],
  );

  const total = useMemo(
    () => cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0),
    [cartProducts],
  );

  const cartCount = useMemo(
    () => cartProducts.reduce((sum, product) => sum + product.quantity, 0),
    [cartProducts],
  );

  const updateQty = (product: EcommerceProduct, delta: number) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: Math.max(0, (prev[product.id] || 0) + delta),
    }));
  };

  const whatsappHref = useMemo(() => {
    const lines = buildEcommerceDemoMessage({
      title: demo.title,
      deliveryMode,
      items: cartProducts.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        lineTotal: formatMoney(product.price * product.quantity),
      })),
      total: formatMoney(total),
    });
    return buildOfficialDemoWhatsappUrl(lines);
  }, [cartProducts, deliveryMode, demo.title, total]);

  return (
    <section className="min-w-0 w-full space-y-6">
      <article className="w-full overflow-hidden rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-surface)]">
        <div className="relative h-56 md:h-72">
          <DemoImage
            src={demo.coverImage}
            alt={demo.title}
            fallbackLabel={demo.title}
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-4 p-4 md:p-8">
          <p className="inline-flex rounded-full bg-[var(--fp-card)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">
            {demo.heroKicker}
          </p>
          <h2 className="text-3xl font-black md:text-5xl">{demo.title}</h2>
          <p className="text-[var(--fp-muted)]">{demo.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--fp-muted)]">Redes</span>
            <DemoSocialLinks
              links={socialLinks}
              onOpen={(platform) =>
                void trackGrowthEvent("click_social", {
                  vertical: demo.vertical,
                  slug: demo.slug,
                  location: "ecommerce_hero",
                  platform,
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {demo.trustBullets.map((bullet) => (
              <p
                key={bullet}
                className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold"
              >
                {bullet}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="w-full rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-[var(--fp-border)] px-3">
            <Search className="h-4 w-4 text-[var(--fp-muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "top" | "priceAsc" | "priceDesc" | "new")
            }
            className="h-11 rounded-xl border border-[var(--fp-border)] bg-transparent px-3 text-sm font-semibold outline-none"
          >
            <option value="top">Mas vendido</option>
            <option value="priceAsc">Precio menor</option>
            <option value="priceDesc">Precio mayor</option>
            <option value="new">Nuevo</option>
          </select>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--fp-primary)] px-4 text-sm font-black text-white"
          >
            <ShoppingCart className="h-4 w-4" /> Ver carrito ({cartCount})
          </button>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todos", ...demo.categories].map((itemCategory) => (
            <button
              key={itemCategory}
              type="button"
              onClick={() => setCategory(itemCategory)}
              className="shrink-0 rounded-xl border border-[var(--fp-border)] px-4 py-2 text-sm font-bold"
              style={
                category === itemCategory
                  ? {
                      background: "var(--fp-primary)",
                      borderColor: "var(--fp-primary)",
                      color: "#fff",
                    }
                  : undefined
              }
            >
              {itemCategory}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full min-w-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)]"
          >
            <div className="relative h-40 md:h-48">
              <DemoImage
                src={product.image}
                alt={product.name}
                fallbackLabel={product.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              {product.badge ? (
                <span className="absolute left-2 top-2 rounded-lg bg-[var(--fp-primary)] px-2 py-1 text-[10px] font-black uppercase text-white">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div className="space-y-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fp-muted)]">
                {product.category}
              </p>
              <h3 className="line-clamp-2 text-lg font-black">{product.name}</h3>
              <p className="line-clamp-2 text-sm text-[var(--fp-muted)]">{product.description}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-[var(--fp-primary)] md:text-3xl">
                  {formatMoney(product.price)}
                </p>
                {product.compareAtPrice ? (
                  <p className="text-xs line-through text-[var(--fp-muted)]">
                    {formatMoney(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(product, -1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--fp-border)]"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-black">{cart[product.id] || 0}</span>
                <button
                  type="button"
                  onClick={() => updateQty(product, 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--fp-border)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="w-full rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
        <h3 className="text-xl font-black">Confianza</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <p className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold">
            <Truck className="mr-1 inline h-4 w-4" />
            Envio nacional
          </p>
          <p className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold">
            Pagos por Yape/Plin
          </p>
          <p className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold">
            Cambios faciles
          </p>
          <p className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold">
            Soporte inmediato
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-24 right-4 z-40 hidden items-center gap-2 rounded-full bg-[var(--fp-primary)] px-4 py-3 text-sm font-black text-white shadow-2xl md:inline-flex"
      >{`\u{1F6D2} Ver carrito (${cartCount})`}</button>

      {cartOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Carrito</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--fp-border)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
              {cartProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] p-3"
                >
                  <p className="font-black">{product.name}</p>
                  <p className="text-sm text-[var(--fp-muted)]">
                    x{product.quantity} - {formatMoney(product.price * product.quantity)}
                  </p>
                </article>
              ))}
              {!cartProducts.length ? (
                <p className="rounded-xl border border-[var(--fp-border)] p-3 text-sm text-[var(--fp-muted)]">
                  Tu carrito esta vacio.
                </p>
              ) : null}
            </div>
            <div className="mt-4 space-y-2 border-t border-[var(--fp-border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total</span>
                <span className="text-xl font-black text-[var(--fp-primary)]">
                  {formatMoney(total)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode("delivery")}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold"
                  style={
                    deliveryMode === "delivery"
                      ? {
                          background: "var(--fp-primary)",
                          borderColor: "var(--fp-primary)",
                          color: "#fff",
                        }
                      : { borderColor: "var(--fp-border)" }
                  }
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode("retiro")}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold"
                  style={
                    deliveryMode === "retiro"
                      ? {
                          background: "var(--fp-primary)",
                          borderColor: "var(--fp-primary)",
                          color: "#fff",
                        }
                      : { borderColor: "var(--fp-border)" }
                  }
                >
                  Recojo
                </button>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  void trackGrowthEvent("click_whatsapp", {
                    vertical: demo.vertical,
                    slug: demo.slug,
                    location: "ecommerce_checkout",
                  })
                }
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--fp-primary)] text-sm font-black text-white"
              >
                Finalizar pedido por WhatsApp
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
