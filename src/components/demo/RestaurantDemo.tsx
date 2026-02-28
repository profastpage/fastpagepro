"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Share2,
  ShoppingCart,
} from "lucide-react";
import type { RestaurantMenuData, RestaurantMenuItem } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import DemoImage from "@/components/demo/DemoImage";
import {
  OFFICIAL_DEMO_WHATSAPP,
  buildOfficialDemoWhatsappUrl,
  buildRestaurantDemoMessage,
} from "@/lib/demoWhatsapp";

type CartMap = Record<string, number>;
type RestaurantTab = "contact" | "menu" | "location";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizeBadge(value?: string) {
  const badge = String(value || "").toLowerCase();
  if (!badge) return "";
  if (badge.includes("pedido") || badge.includes("mas vendido")) return "🔥 Más pedido";
  if (badge.includes("favorito")) return "⭐ Favorito";
  if (badge.includes("top")) return "🥇 Top";
  return value || "";
}

export default function RestaurantDemo({ demo }: { demo: RestaurantMenuData }) {
  const [tab, setTab] = useState<RestaurantTab>("contact");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartMap>({});
  const menuStickyRef = useRef<HTMLDivElement | null>(null);
  const menuStartRef = useRef<HTMLDivElement | null>(null);
  const categorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchDebounced(search), 220);
    return () => window.clearTimeout(timer);
  }, [search]);

  const mainImage =
    demo.items.find((item) => item.favoriteOfDay || item.featured)?.image ||
    demo.items[0]?.image ||
    demo.coverImage;
  const profileImage = demo.profileImage || mainImage || demo.coverImage;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(demo.address)}&output=embed`;
  const mapsOpen = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.address)}`;
  const callHref = `tel:${OFFICIAL_DEMO_WHATSAPP}`;

  const categories = useMemo(() => ["Todos", ...demo.categories], [demo.categories]);

  const filteredItems = useMemo(() => {
    const term = searchDebounced.trim().toLowerCase();
    return demo.items.filter((item) => {
      if (!term) return true;
      return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(term);
    });
  }, [demo.items, searchDebounced]);

  const groupedItems = useMemo(() => {
    return demo.categories
      .map((currentCategory) => ({
        name: currentCategory,
        items: filteredItems.filter((item) => item.category === currentCategory),
      }))
      .filter((group) => group.items.length > 0);
  }, [demo.categories, filteredItems]);

  useEffect(() => {
    if (tab !== "menu") return;

    const syncActiveCategory = () => {
      const visibleCategories = groupedItems.map((group) => group.name);
      if (visibleCategories.length === 0) {
        setCategory((prev) => (prev === "Todos" ? prev : "Todos"));
        return;
      }

      const stickyBottom = menuStickyRef.current?.getBoundingClientRect().bottom ?? 130;
      const anchorY = stickyBottom + 8;
      const firstSection = categorySectionRefs.current[visibleCategories[0]];
      const firstTop = firstSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

      if (firstTop > anchorY + 10) {
        setCategory((prev) => (prev === "Todos" ? prev : "Todos"));
        return;
      }

      let nextCategory = visibleCategories[0];
      for (const categoryName of visibleCategories) {
        const node = categorySectionRefs.current[categoryName];
        if (!node) continue;
        if (node.getBoundingClientRect().top <= anchorY) {
          nextCategory = categoryName;
        } else {
          break;
        }
      }

      setCategory((prev) => (prev === nextCategory ? prev : nextCategory));
    };

    syncActiveCategory();
    window.addEventListener("scroll", syncActiveCategory, { passive: true });
    window.addEventListener("resize", syncActiveCategory);
    return () => {
      window.removeEventListener("scroll", syncActiveCategory);
      window.removeEventListener("resize", syncActiveCategory);
    };
  }, [groupedItems, tab]);

  const scrollToCategory = (targetCategory: string) => {
    if (targetCategory === "Todos") {
      const startNode = menuStartRef.current;
      if (startNode) {
        const top = window.scrollY + startNode.getBoundingClientRect().top - 108;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      setCategory("Todos");
      return;
    }

    const targetNode = categorySectionRefs.current[targetCategory];
    if (!targetNode) return;
    const stickyBottom = menuStickyRef.current?.getBoundingClientRect().bottom ?? 130;
    const top = window.scrollY + targetNode.getBoundingClientRect().top - (stickyBottom + 10);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setCategory(targetCategory);
  };

  const cartItems = useMemo(
    () =>
      demo.items
        .filter((item) => (cart[item.id] || 0) > 0)
        .map((item) => ({ ...item, quantity: cart[item.id] || 0 })),
    [cart, demo.items],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const updateQty = (item: RestaurantMenuItem, delta: number) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) + delta),
    }));
  };

  const whatsappHref = useMemo(() => {
    const lines = buildRestaurantDemoMessage({
      title: demo.title,
      address: demo.address,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        lineTotal: formatMoney(item.price * item.quantity),
      })),
      total: formatMoney(total),
    });
    return buildOfficialDemoWhatsappUrl(lines);
  }, [cartItems, demo.address, demo.title, total]);

  const navButton =
    "h-11 rounded-2xl border px-3 text-xs font-black uppercase tracking-[0.08em] transition md:h-12 md:text-sm";

  return (
    <section className="space-y-4">
      <article className="mx-auto w-full max-w-md overflow-visible rounded-[2rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] md:max-w-5xl">
        <div className="z-20 border-b border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--fp-border)]">
                <DemoImage
                  src={profileImage}
                  alt={demo.title}
                  fallbackLabel={demo.title}
                  fill
                  unoptimized
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <p className="truncate text-sm font-semibold">{demo.title}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--fp-border)]"
              aria-label="Compartir demo"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-lg font-black uppercase tracking-[0.18em] text-[var(--fp-primary)] md:text-xl">
            {tab === "contact" ? "Contacto" : tab === "menu" ? "Carta" : "Ubicacion"}
          </p>
        </div>

        <div className="hidden gap-3 border-b border-[var(--fp-border)] px-4 py-3 md:grid md:grid-cols-3">
          <button
            type="button"
            onClick={() => setTab("contact")}
            className={navButton}
            style={tab === "contact" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Contacto
          </button>
          <button
            type="button"
            onClick={() => setTab("menu")}
            className={navButton}
            style={tab === "menu" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Carta
          </button>
          <button
            type="button"
            onClick={() => setTab("location")}
            className={navButton}
            style={tab === "location" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Ubicacion
          </button>
        </div>

        <div className="min-h-[62vh] px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">
          {tab === "contact" ? (
            <section className="space-y-4">
              <div className="relative pb-10 md:pb-12">
                <div className="relative h-44 overflow-hidden rounded-3xl border border-[var(--fp-border)] md:h-72">
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
                <div className="absolute inset-x-0 bottom-0 flex justify-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/90 shadow-lg md:h-28 md:w-28">
                    <DemoImage
                      src={profileImage}
                      alt={`${demo.title} perfil`}
                      fallbackLabel={demo.title}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 text-center md:pt-12">
                <h2 className="text-4xl font-black md:text-6xl">{demo.title}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--fp-primary)]">🍔 Carta Digital 🍔</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-1.5 text-xs font-bold">
                  <span>🟢 Abierto</span>
                  <span>•</span>
                  <span>⏱️ {demo.openHours}</span>
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--fp-muted)] md:text-base">{demo.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <a href={callHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--fp-primary)] bg-[var(--fp-primary)] px-4 text-sm font-black text-white">
                  <Phone className="h-4 w-4" /> Llamar ahora
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    void trackGrowthEvent("click_whatsapp", {
                      vertical: demo.vertical,
                      slug: demo.slug,
                      location: "restaurant_contact",
                    })
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--fp-primary)] bg-[var(--fp-primary)] px-4 text-sm font-black text-white"
                >
                  💬 Escribir ahora
                </a>
              </div>
            </section>
          ) : null}

          {tab === "menu" ? (
            <section className="space-y-4">
              <div
                ref={menuStickyRef}
                className="sticky top-0 z-40 rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-card)] p-3 shadow-[0_14px_28px_-18px_rgba(0,0,0,0.45)] backdrop-blur-sm"
              >
                <label className="flex h-11 items-center gap-2 rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3">
                  <Search className="h-4 w-4 text-[var(--fp-muted)]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar en la carta..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {categories.map((itemCategory) => (
                    <button
                      key={itemCategory}
                      type="button"
                      onClick={() => scrollToCategory(itemCategory)}
                      className="shrink-0 rounded-xl border px-3 py-2 text-xs font-bold md:px-4 md:text-sm"
                      style={
                        category === itemCategory
                          ? { background: "var(--fp-primary)", borderColor: "var(--fp-primary)", color: "#fff" }
                          : { borderColor: "var(--fp-border)" }
                      }
                    >
                      {itemCategory}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={menuStartRef} className="space-y-6">
                {groupedItems.map((group) => (
                  <div
                    key={group.name}
                    ref={(node) => {
                      categorySectionRefs.current[group.name] = node;
                    }}
                    className="space-y-3"
                  >
                    <h3 className="text-4xl font-black md:text-5xl" style={{ color: "var(--fp-primary)" }}>{group.name}</h3>
                    {group.items.map((item) => (
                      <article key={item.id} className="rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-3">
                        <div className="flex gap-3">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--fp-border)] md:h-28 md:w-28">
                            <DemoImage
                              src={item.image}
                              alt={item.name}
                              fallbackLabel={item.name}
                              fill
                              unoptimized
                              sizes="120px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="line-clamp-2 text-xl font-black leading-tight md:text-3xl">{item.name}</h4>
                              {item.badge ? (
                                <span className="rounded-full bg-[var(--fp-primary)] px-2 py-1 text-[10px] font-black text-white">
                                  {normalizeBadge(item.badge)}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-[var(--fp-muted)] md:text-base">{item.description}</p>
                            <div className="mt-2 flex items-end gap-2">
                              {item.compareAtPrice ? (
                                <p className="text-[11px] line-through text-[var(--fp-muted)] md:text-xs">{formatMoney(item.compareAtPrice)}</p>
                              ) : null}
                              <p className="text-2xl font-black text-[var(--fp-primary)] md:text-3xl">{formatMoney(item.price)}</p>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-2 py-1">
                              <button
                                type="button"
                                onClick={() => updateQty(item, -1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--fp-border)] bg-[var(--fp-surface)]"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-6 text-center text-xl font-black">{cart[item.id] || 0}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item, 1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--fp-border)] bg-[var(--fp-surface)]"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {tab === "location" ? (
            <section className="space-y-4 rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-card)] p-3 md:p-5">
              <div className="overflow-hidden rounded-2xl border border-[var(--fp-border)]">
                <iframe
                  title={`Mapa de ${demo.title}`}
                  src={mapsEmbed}
                  className="h-64 w-full md:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <h3 className="text-4xl font-black md:text-5xl">{demo.address}</h3>
              <div>
                <p className="text-3xl font-black md:text-4xl" style={{ color: "var(--fp-primary)" }}>Horarios</p>
                <p className="mt-2 text-sm text-[var(--fp-muted)] md:text-base">{demo.openHours}</p>
              </div>
              <a
                href={mapsOpen}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--fp-primary)] bg-[var(--fp-primary)] px-5 text-sm font-black text-white"
              >
                <MapPin className="h-4 w-4" /> Ir ahora
              </a>
            </section>
          ) : null}
        </div>
      </article>

      {tab === "menu" ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            void trackGrowthEvent("click_whatsapp", {
              vertical: demo.vertical,
              slug: demo.slug,
              location: "restaurant_floating",
            })
          }
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+12rem)] right-4 z-40 inline-flex w-[6.1rem] flex-col items-center justify-center gap-1.5 rounded-[1.15rem] border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,255,225,0.98),rgba(198,240,205,0.95))] px-2 py-2.5 text-emerald-950 shadow-[0_12px_26px_-16px_rgba(16,185,129,0.75)] md:bottom-6 md:w-[6.4rem]"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[0.7rem] border border-emerald-300/60 bg-emerald-600/10">
            <ShoppingCart className="h-3.5 w-3.5" />
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="text-[10px] font-black leading-none">Mi pedido</span>
            <span className="inline-flex min-w-5 items-center justify-center rounded-full border border-emerald-300/70 bg-white/70 px-1.5 py-0.5 text-[10px] font-black leading-none">
              {cartCount}
            </span>
          </span>
        </a>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)] md:hidden">
        <div className="mx-auto w-full max-w-md rounded-[1.35rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] p-1">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setTab("contact")}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em]"
              style={tab === "contact" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <Phone className="mx-auto mb-1 h-4 w-4" />
              Contacto
            </button>
            <button
              type="button"
              onClick={() => setTab("menu")}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em]"
              style={tab === "menu" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <Menu className="mx-auto mb-1 h-4 w-4" />
              Carta
            </button>
            <button
              type="button"
              onClick={() => setTab("location")}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em]"
              style={tab === "location" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <MapPin className="mx-auto mb-1 h-4 w-4" />
              Ubicacion
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
