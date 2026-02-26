"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Clock3, MapPin, Minus, Plus, Search } from "lucide-react";
import type { RestaurantMenuData, RestaurantMenuItem } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";

type CartMap = Record<string, number>;

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
}

function buildWhatsappMessage(lines: string[], phone: string) {
  const normalized = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function highlight(text: string, term: string) {
  if (!term.trim()) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "ig"), (match) => `**${match}**`);
}

export default function RestaurantDemo({ demo }: { demo: RestaurantMenuData }) {
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartMap>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchDebounced(search), 260);
    return () => window.clearTimeout(timer);
  }, [search]);

  const favorites = useMemo(
    () => demo.items.filter((item) => item.favoriteOfDay || item.featured),
    [demo.items],
  );

  const filtered = useMemo(() => {
    const term = searchDebounced.trim().toLowerCase();
    return demo.items.filter((item) => {
      if (category !== "Todos" && item.category !== category) return false;
      if (!term) return true;
      return `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(term);
    });
  }, [category, demo.items, searchDebounced]);

  const cartItems = useMemo(
    () =>
      demo.items
        .filter((item) => (cart[item.id] || 0) > 0)
        .map((item) => ({ ...item, quantity: cart[item.id] || 0 })),
    [cart, demo.items],
  );

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const updateQty = (item: RestaurantMenuItem, delta: number) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) + delta),
    }));
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hola, quiero pedir en ${demo.title}:`,
      "",
      ...cartItems.map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - ${formatMoney(
            item.price * item.quantity,
          )}`,
      ),
      "",
      `Total: ${formatMoney(total)}`,
    ];
    return buildWhatsappMessage(lines, demo.whatsappNumber);
  }, [cartItems, demo.title, demo.whatsappNumber, total]);

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-surface)]">
        <div className="relative h-48 md:h-72">
          <Image src={demo.coverImage} alt={demo.title} fill unoptimized sizes="100vw" className="object-cover" />
        </div>
        <div className="space-y-4 p-4 md:p-8">
          <div className="rounded-full bg-[var(--fp-card)] px-4 py-2 text-center text-sm font-bold">{demo.promoStrip}</div>
          <h2 className="text-3xl font-black md:text-5xl">{demo.title}</h2>
          <p className="text-[var(--fp-muted)]">{demo.description}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--fp-border)] px-3 py-1"><Clock3 className="h-4 w-4" />{demo.openHours}</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--fp-border)] px-3 py-1"><MapPin className="h-4 w-4" />{demo.address}</span>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              void trackGrowthEvent("click_whatsapp", {
                vertical: demo.vertical,
                slug: demo.slug,
                location: "restaurant_header",
              })
            }
            className="inline-flex rounded-xl bg-[var(--fp-primary)] px-5 py-3 text-sm font-black text-white"
          >
            💬 Pedir por WhatsApp
          </a>
        </div>
      </article>

      <section>
        <h3 className="text-2xl font-black md:text-3xl">Favoritos del dia</h3>
        <div className="mt-4 grid grid-flow-col auto-cols-[84%] gap-3 overflow-x-auto pb-2 snap-x snap-mandatory min-[430px]:auto-cols-[48%] md:grid-cols-3 md:auto-cols-auto">
          {favorites.map((item) => (
            <article key={item.id} className="snap-start overflow-hidden rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)]">
              <div className="relative h-40">
                <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 768px) 84vw, 33vw" className="object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="font-black">{item.name}</p>
                <p className="text-2xl font-black text-[var(--fp-primary)]">{formatMoney(item.price)}</p>
                <button type="button" onClick={() => updateQty(item, 1)} className="h-10 w-full rounded-xl bg-[var(--fp-primary)] text-sm font-black text-white">Agregar</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-[var(--fp-border)] px-3">
          <Search className="h-4 w-4 text-[var(--fp-muted)]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en la carta..." className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todos", ...demo.categories].map((itemCategory) => (
            <button
              key={itemCategory}
              type="button"
              onClick={() => setCategory(itemCategory)}
              className="shrink-0 rounded-xl border border-[var(--fp-border)] px-4 py-2 text-sm font-bold"
              style={category === itemCategory ? { background: "var(--fp-primary)", borderColor: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              {itemCategory}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)]">
            <div className="relative h-40">
              <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="space-y-2 p-3">
              <p className="text-lg font-black">{highlight(item.name, searchDebounced)}</p>
              <p className="text-sm text-[var(--fp-muted)]">{highlight(item.description, searchDebounced)}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-[var(--fp-primary)]">{formatMoney(item.price)}</p>
                {item.compareAtPrice ? <p className="text-sm line-through text-[var(--fp-muted)]">{formatMoney(item.compareAtPrice)}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => updateQty(item, -1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--fp-border)]"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-black">{cart[item.id] || 0}</span>
                <button type="button" onClick={() => updateQty(item, 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--fp-border)]"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </section>

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
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--fp-primary)] px-4 py-3 text-sm font-black text-white shadow-2xl"
      >
        💬 Pedir por WhatsApp
      </a>
    </section>
  );
}
