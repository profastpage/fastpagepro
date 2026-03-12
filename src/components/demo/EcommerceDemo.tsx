"use client";

import { Minus, Plus, Search, ShoppingCart, Sparkles, Truck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { EcommerceProduct, EcommerceStoreData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import DemoImage from "@/components/demo/DemoImage";
import DemoReveal from "@/components/demo/DemoReveal";
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
  const [sortBy, setSortBy] = useState<"top" | "priceAsc" | "priceDesc" | "new">("top");
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "retiro">("delivery");
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
    if (sortBy === "priceDesc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "new") {
      return [...filtered].sort(
        (a, b) => Number(b.badge === "Nuevo") - Number(a.badge === "Nuevo"),
      );
    }
    return [...filtered].sort(
      (a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)),
    );
  }, [category, demo.products, search, sortBy]);

  const featuredProducts = useMemo(
    () => demo.products.filter((product) => product.bestSeller).slice(0, 3),
    [demo.products],
  );

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
    <section className="space-y-6 md:space-y-8">
      <DemoReveal>
        <article className="fp-demo-shell fp-demo-grid px-4 py-4 md:px-8 md:py-8">
          <span
            className="fp-demo-orb left-[2%] top-[-3rem] h-44 w-44"
            style={{ background: "color-mix(in srgb, var(--fp-primary) 42%, white)" }}
          />
          <span
            className="fp-demo-orb fp-demo-float right-[-2rem] top-[24%] h-52 w-52"
            style={{ background: "color-mix(in srgb, var(--fp-primary) 24%, transparent)" }}
          />

          <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="fp-demo-panel fp-demo-hover-card hidden p-5 xl:block">
              <p className="fp-demo-kicker">Store curation</p>
              <div className="mt-5 space-y-4">
                {["Todos", ...demo.categories].map((itemCategory) => (
                  <button
                    key={itemCategory}
                    type="button"
                    onClick={() => setCategory(itemCategory)}
                    className="flex w-full items-start justify-between rounded-[1.2rem] border border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-4 text-left transition hover:border-[var(--fp-primary)]/40"
                    style={
                      category === itemCategory
                        ? {
                            borderColor: "color-mix(in srgb, var(--fp-primary) 38%, transparent)",
                            background: "color-mix(in srgb, var(--fp-primary) 10%, var(--fp-card))",
                          }
                        : undefined
                    }
                  >
                    <span>
                      <span className="block text-sm font-black text-[var(--fp-text)]">
                        {itemCategory}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--fp-muted)]">
                        Curaduria visual y accion comercial.
                      </span>
                    </span>
                    <span className="text-xs font-black text-[var(--fp-primary)]">01</span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)]">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="fp-demo-kicker">{demo.heroKicker}</p>
                    <span className="rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--fp-muted)]">
                      storefront 2025
                    </span>
                  </div>

                  <div className="max-w-3xl space-y-4">
                    <h2 className="fp-demo-hero-heading font-black text-[var(--fp-text)]">
                      {demo.title}
                    </h2>
                    <p className="max-w-2xl text-base leading-7 text-[var(--fp-muted)] md:text-lg">
                      {demo.description}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {demo.trustBullets.slice(0, 4).map((bullet) => (
                      <div
                        key={bullet}
                        className="fp-demo-panel fp-demo-hover-card flex items-center gap-3 p-4"
                      >
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--fp-primary)]/12 text-[var(--fp-primary)]">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-bold text-[var(--fp-text)]">{bullet}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center">
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
                </div>

                <div className="space-y-4">
                  <div className="fp-demo-image-frame min-h-[360px]">
                    <DemoImage
                      src={demo.coverImage}
                      alt={demo.title}
                      fallbackLabel={demo.title}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-white/75">
                        visual commerce
                      </p>
                      <p className="mt-2 max-w-[18ch] text-2xl font-black leading-tight">
                        Producto grande, colecciones visibles y accion real.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {featuredProducts.slice(0, 2).map((product) => (
                      <div
                        key={product.id}
                        className="fp-demo-panel fp-demo-hover-card flex gap-3 p-3"
                      >
                        <div className="fp-demo-image-frame h-24 w-24 shrink-0 rounded-[1.2rem]">
                          <DemoImage
                            src={product.image}
                            alt={product.name}
                            fallbackLabel={product.name}
                            fill
                            unoptimized
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--fp-muted)]">
                            {product.category}
                          </p>
                          <p className="mt-1 line-clamp-2 text-lg font-black leading-tight text-[var(--fp-text)]">
                            {product.name}
                          </p>
                          <p className="mt-2 text-sm font-black text-[var(--fp-primary)]">
                            {formatMoney(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <section className="fp-demo-panel p-4 md:p-5">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <label className="flex min-h-[52px] items-center gap-3 rounded-[1.2rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-4">
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
                    className="min-h-[52px] rounded-[1.2rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-4 text-sm font-bold outline-none"
                  >
                    <option value="top">Mas vendido</option>
                    <option value="priceAsc">Precio menor</option>
                    <option value="priceDesc">Precio mayor</option>
                    <option value="new">Nuevo</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="fp-demo-button-primary inline-flex min-h-[52px] items-center justify-center gap-2 px-5 text-sm font-black text-white"
                  >
                    <ShoppingCart className="h-4 w-4" /> Carrito ({cartCount})
                  </button>
                </div>
                <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
                  {["Todos", ...demo.categories].map((itemCategory) => (
                    <button
                      key={itemCategory}
                      type="button"
                      onClick={() => setCategory(itemCategory)}
                      className="shrink-0 rounded-full border px-4 py-2 text-sm font-bold"
                      style={
                        category === itemCategory
                          ? {
                              background: "var(--fp-primary)",
                              borderColor: "var(--fp-primary)",
                              color: "#fff",
                            }
                          : { borderColor: "var(--fp-border)" }
                      }
                    >
                      {itemCategory}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </article>
      </DemoReveal>

      <DemoReveal delay={0.08}>
        <section className="fp-demo-scroll-rail no-scrollbar">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="fp-demo-panel fp-demo-hover-card flex h-full flex-col p-4"
            >
              <div className="fp-demo-image-frame relative h-64 rounded-[1.4rem]">
                <DemoImage
                  src={product.image}
                  alt={product.name}
                  fallbackLabel={product.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 84vw, 320px"
                  className="object-cover"
                />
                {product.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--fp-primary)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                    {product.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--fp-muted)]">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-[var(--fp-text)]">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--fp-muted)]">
                    {product.description}
                  </p>
                </div>

                <div className="pt-5">
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-[var(--fp-primary)]">
                      {formatMoney(product.price)}
                    </p>
                    {product.compareAtPrice ? (
                      <p className="pb-1 text-xs text-[var(--fp-muted)] line-through">
                        {formatMoney(product.compareAtPrice)}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(product, -1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-card)] transition hover:border-[var(--fp-primary)]/40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-lg font-black text-[var(--fp-text)]">
                      {cart[product.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(product, 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-card)] transition hover:border-[var(--fp-primary)]/40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQty(product, 1)}
                      className="fp-demo-button-primary ml-auto inline-flex items-center justify-center px-5 text-sm font-black text-white"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </DemoReveal>

      <DemoReveal delay={0.12}>
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <div className="fp-demo-panel fp-demo-hover-card p-6 md:p-7">
            <p className="fp-demo-kicker">Confianza comercial</p>
            <h3 className="mt-5 fp-demo-section-title font-black text-[var(--fp-text)]">
              El storefront parte del producto, la coleccion y una accion clara.
            </h3>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {["Envio nacional", "Pagos por Yape", "Cambios faciles", "Soporte inmediato"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-4 text-sm font-bold text-[var(--fp-text)]"
                  >
                    <Truck className="mb-3 h-4 w-4 text-[var(--fp-primary)]" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="fp-demo-panel p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-[var(--fp-text)]">Carrito</h3>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="fp-demo-button-secondary inline-flex items-center px-4 text-sm font-black text-[var(--fp-text)]"
              >
                Ver detalle
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {cartProducts.length ? (
                cartProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-[1.3rem] border border-[var(--fp-border)] bg-[var(--fp-card)] p-4"
                  >
                    <p className="font-black text-[var(--fp-text)]">{product.name}</p>
                    <p className="mt-1 text-sm text-[var(--fp-muted)]">
                      x{product.quantity} · {formatMoney(product.price * product.quantity)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-[1.3rem] border border-[var(--fp-border)] bg-[var(--fp-card)] p-4 text-sm text-[var(--fp-muted)]">
                  Tu carrito esta vacio. Agrega productos para probar la experiencia de cierre.
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode("delivery")}
                className="rounded-full border px-4 py-3 text-sm font-black"
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
                className="rounded-full border px-4 py-3 text-sm font-black"
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

            <div className="mt-5 flex items-center justify-between rounded-[1.3rem] border border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-4">
              <span className="text-sm text-[var(--fp-muted)]">Total</span>
              <span className="text-3xl font-black text-[var(--fp-primary)]">
                {formatMoney(total)}
              </span>
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
              className="fp-demo-button-primary mt-5 inline-flex w-full items-center justify-center px-5 text-sm font-black text-white"
            >
              Finalizar pedido por WhatsApp
            </a>
          </div>
        </section>
      </DemoReveal>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fp-demo-button-primary fixed bottom-24 right-4 z-40 hidden items-center gap-2 px-4 text-sm font-black text-white shadow-2xl md:inline-flex"
      >
        <ShoppingCart className="h-4 w-4" /> Ver carrito ({cartCount})
      </button>

      {cartOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/58 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[var(--fp-border)] bg-[var(--fp-surface)] p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Carrito</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--fp-border)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
              {cartProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[1.2rem] border border-[var(--fp-border)] bg-[var(--fp-card)] p-3"
                >
                  <p className="font-black">{product.name}</p>
                  <p className="text-sm text-[var(--fp-muted)]">
                    x{product.quantity} · {formatMoney(product.price * product.quantity)}
                  </p>
                </article>
              ))}
              {!cartProducts.length ? (
                <p className="rounded-[1.2rem] border border-[var(--fp-border)] bg-[var(--fp-card)] p-3 text-sm text-[var(--fp-muted)]">
                  Tu carrito esta vacio.
                </p>
              ) : null}
            </div>
            <div className="mt-4 space-y-3 border-t border-[var(--fp-border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total</span>
                <span className="text-2xl font-black text-[var(--fp-primary)]">
                  {formatMoney(total)}
                </span>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  void trackGrowthEvent("click_whatsapp", {
                    vertical: demo.vertical,
                    slug: demo.slug,
                    location: "ecommerce_checkout_sidebar",
                  })
                }
                className="fp-demo-button-primary inline-flex h-12 w-full items-center justify-center text-sm font-black text-white"
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
