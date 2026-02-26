"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Share2,
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
      if (category !== "Todos" && item.category !== category) return false;
      if (!term) return true;
      return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(term);
    });
  }, [category, demo.items, searchDebounced]);

  const groupedItems = useMemo(() => {
    if (category !== "Todos") {
      return [
        {
          name: category,
          items: filteredItems,
        },
      ];
    }
    return demo.categories
      .map((currentCategory) => ({
        name: currentCategory,
        items: filteredItems.filter((item) => item.category === currentCategory),
      }))
      .filter((group) => group.items.length > 0);
  }, [category, demo.categories, filteredItems]);

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
      <article className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] md:max-w-5xl">
        <div className="sticky top-0 z-30 border-b border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-3 backdrop-blur-sm">
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
              <div className="sticky top-[5.5rem] z-20 rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-card)] p-3 backdrop-blur-sm md:top-[6.4rem]">
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
                      onClick={() => setCategory(itemCategory)}
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

              <div className="space-y-6">
                {groupedItems.map((group) => (
                  <div key={group.name} className="space-y-3">
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
          className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--fp-primary)] px-3 py-2 text-xs font-black text-white shadow-2xl md:bottom-8 md:px-4 md:py-3 md:text-sm"
        >
          💬 Mi pedido ({cartCount})
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
