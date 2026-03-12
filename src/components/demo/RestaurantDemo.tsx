"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  MapPin,
  Menu,
  Minus,
  Palette,
  Phone,
  Plus,
  Search,
  Share2,
  ShoppingCart,
  SunMedium,
} from "lucide-react";
import type { RestaurantMenuData, RestaurantMenuItem } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import DemoImage from "@/components/demo/DemoImage";
import DemoReveal from "@/components/demo/DemoReveal";
import DemoSocialLinks from "@/components/demo/DemoSocialLinks";
import { getDemoSocialLinks } from "@/lib/demoSocial";
import {
  buildOfficialDemoCallHref,
  buildOfficialDemoWhatsappUrl,
  buildRestaurantDemoMessage,
  buildRestaurantReservationDemoMessage,
} from "@/lib/demoWhatsapp";

type CartMap = Record<string, number>;
type RestaurantTab = "contact" | "menu" | "location" | "reservation";
type DemoQuickGuideStep = {
  id: string;
  title: string;
  description: string;
};

const DEMO_MENU_QUICK_GUIDE_STEPS: DemoQuickGuideStep[] = [
  {
    id: "start-menu",
    title: "Empieza en Carta",
    description: "Explora categorias arriba para ir directo a combos, bebidas o platos clave.",
  },
  {
    id: "scroll-categories",
    title: "Desliza y descubre",
    description: "Haz scroll hacia abajo: la categoria activa se marca automaticamente.",
  },
  {
    id: "add-cart",
    title: "Suma al carrito",
    description: "Usa los botones + y - de cada producto para armar tu pedido.",
  },
  {
    id: "send-whatsapp",
    title: "Envia por WhatsApp",
    description: "Toca Mi pedido para enviar tu orden al WhatsApp del negocio.",
  },
  {
    id: "full-control",
    title: "Todo es personalizable",
    description:
      "Con cuenta y plan activo puedes cambiar imagenes, textos, colores, temas, ubicacion y reserva.",
  },
];

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
  if (badge.includes("pedido") || badge.includes("mas vendido")) return "\u{1F525} Mas pedido";
  if (badge.includes("favorito")) return "\u2B50 Favorito";
  if (badge.includes("top")) return "\u{1F947} Top";
  return value || "";
}

export default function RestaurantDemo({ demo }: { demo: RestaurantMenuData }) {
  const [tab, setTab] = useState<RestaurantTab>("menu");
  const [backgroundMode, setBackgroundMode] = useState<"theme" | "white">("theme");
  const [reservationPanelReady, setReservationPanelReady] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartMap>({});
  const [reservationName, setReservationName] = useState("Fabio Herrera");
  const [reservationGuests, setReservationGuests] = useState("2");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationSlot, setReservationSlot] = useState("");
  const [reservationContact, setReservationContact] = useState("906431630");
  const [reservationNote, setReservationNote] = useState("Cumpleanos");
  const [reservationError, setReservationError] = useState("");
  const [reservationFeedback, setReservationFeedback] = useState("");
  const [showMenuQuickGuide, setShowMenuQuickGuide] = useState(false);
  const tabContentAnchorRef = useRef<HTMLDivElement | null>(null);
  const menuStickyRef = useRef<HTMLDivElement | null>(null);
  const menuStartRef = useRef<HTMLDivElement | null>(null);
  const reservationDateInputRef = useRef<HTMLInputElement | null>(null);
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
  const socialLinks = useMemo(() => getDemoSocialLinks(demo), [demo]);
  const isPublicDemo = demo.mode !== "real";
  const quickGuideStorageKey = useMemo(
    () => `fp_demo_restaurant_quick_guide_seen:${demo.slug}`,
    [demo.slug],
  );
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(demo.address)}&output=embed`;
  const mapsOpen = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.address)}`;
  const callHref = buildOfficialDemoCallHref();
  const reservationConfig = useMemo(() => {
    const slots = (demo.reservation?.slotOptions || ["12:00 pm", "12:30 pm", "1:00 pm", "7:00 pm"])
      .map((slot) => String(slot || "").trim())
      .filter(Boolean)
      .slice(0, 12);
    const minParty = Math.max(1, Math.min(99, Math.round(Number(demo.reservation?.minPartySize) || 3)));
    const maxPartyRaw = Math.max(1, Math.min(99, Math.round(Number(demo.reservation?.maxPartySize) || 9)));
    const maxParty = Math.max(minParty, maxPartyRaw);

    return {
      title: demo.reservation?.title || "Reserva premium",
      subtitle: demo.reservation?.subtitle || "Agenda tu mesa en segundos y recibe confirmacion por WhatsApp.",
      heroImage: demo.reservation?.heroImage || demo.coverImage,
      slotOptions: slots.length > 0 ? slots : ["Por coordinar"],
      minPartySize: minParty,
      maxPartySize: maxParty,
      ctaLabel: demo.reservation?.ctaLabel || "Enviar reserva",
      notePlaceholder: demo.reservation?.notePlaceholder || "Celebracion, alergias o zona preferida.",
    };
  }, [demo.coverImage, demo.reservation]);
  const reservationGuestsCount = Math.max(
    reservationConfig.minPartySize,
    Math.min(
      reservationConfig.maxPartySize,
      Math.round(Number(reservationGuests) || reservationConfig.minPartySize),
    ),
  );
  const isLightBackground = backgroundMode === "white";
  const demoSurfaceStyle = useMemo<CSSProperties | undefined>(() => {
    if (!isLightBackground) return undefined;
    return {
      "--fp-bg": "#f8fafc",
      "--fp-surface": "#ffffff",
      "--fp-card": "#ffffff",
      "--fp-text": "#0f172a",
      "--fp-muted": "#475569",
      "--fp-border": "rgba(15,23,42,0.14)",
    } as CSSProperties;
  }, [isLightBackground]);

  const categories = useMemo(() => ["Todos", ...demo.categories], [demo.categories]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const hero = String(reservationConfig.heroImage || "").trim();
    if (!hero) return;
    const img = new Image();
    img.src = hero;
  }, [reservationConfig.heroImage]);

  useEffect(() => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setReservationDate((prev) => prev || iso);
  }, []);

  useEffect(() => {
    if (!isPublicDemo) return;
    try {
      const hasSeenGuide = window.localStorage.getItem(quickGuideStorageKey) === "1";
      if (!hasSeenGuide) {
        setShowMenuQuickGuide(true);
      }
    } catch {
      setShowMenuQuickGuide(true);
    }
  }, [isPublicDemo, quickGuideStorageKey]);

  useEffect(() => {
    const selected = reservationSlot.trim();
    if (reservationConfig.slotOptions.includes(selected)) return;
    setReservationSlot(reservationConfig.slotOptions[0] || "");
  }, [reservationConfig.slotOptions, reservationSlot]);

  useEffect(() => {
    const clampedGuests = Math.max(
      reservationConfig.minPartySize,
      Math.min(
        reservationConfig.maxPartySize,
        Math.round(Number(reservationGuests) || reservationConfig.minPartySize),
      ),
    );
    if (String(clampedGuests) !== reservationGuests) {
      setReservationGuests(String(clampedGuests));
    }
  }, [reservationConfig.maxPartySize, reservationConfig.minPartySize, reservationGuests]);

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

  const submitReservationDemo = () => {
    const cleanName = reservationName.trim();
    if (!cleanName) {
      setReservationError("Ingresa tu nombre para enviar la reserva.");
      setReservationFeedback("");
      return;
    }
    if (!reservationDate) {
      setReservationError("Selecciona una fecha para la reserva.");
      setReservationFeedback("");
      return;
    }

    const lines = buildRestaurantReservationDemoMessage({
      title: demo.title,
      name: cleanName,
      guests: reservationGuestsCount,
      date: reservationDate,
      slot: reservationSlot || reservationConfig.slotOptions[0] || "Por coordinar",
      contact: reservationContact.trim(),
      note: reservationNote.trim(),
    });
    const href = buildOfficialDemoWhatsappUrl(lines);
    window.open(href, "_blank", "noopener,noreferrer");
    setReservationError("");
    setReservationFeedback("Reserva lista. Te estamos redirigiendo a WhatsApp.");
    void trackGrowthEvent("click_whatsapp", {
      vertical: demo.vertical,
      slug: demo.slug,
      location: "restaurant_reservation",
    });
    window.setTimeout(() => setReservationFeedback(""), 2200);
  };

  const navButton =
    "h-11 rounded-full border px-3 text-xs font-black uppercase tracking-[0.12em] transition duration-300 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fp-surface)] active:scale-[0.98] md:h-12 md:text-sm";

  const activateTab = (nextTab: RestaurantTab) => {
    if (nextTab === "reservation") {
      setReservationPanelReady(true);
    }
    setTab(nextTab);
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const anchor = tabContentAnchorRef.current;
      if (!anchor) return;
      const offset = window.innerWidth < 768 ? 14 : 22;
      const top = window.scrollY + anchor.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };

  const dismissMenuQuickGuide = () => {
    setShowMenuQuickGuide(false);
    if (!isPublicDemo) return;
    try {
      window.localStorage.setItem(quickGuideStorageKey, "1");
    } catch {
      // no-op: localStorage can be blocked in some browsers
    }
  };

  const openReservationDatePicker = () => {
    const input = reservationDateInputRef.current;
    if (!input) return;
    const dateInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  return (
    <section className="space-y-6">
      <DemoReveal>
        <article
          className="fp-demo-shell fp-demo-grid mx-auto w-full max-w-md overflow-visible text-[var(--fp-text)] md:max-w-6xl"
          style={demoSurfaceStyle}
        >
        <div className="z-20 border-b border-[var(--fp-border)] bg-[color-mix(in_srgb,var(--fp-card)_88%,transparent)] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 md:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--fp-border)] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.8)]">
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
              <div>
                <p className="truncate text-sm font-semibold">{demo.title}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fp-muted)]">
                  experiencia inmersiva
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)]/90 p-1">
                <button
                  type="button"
                  onClick={() => setBackgroundMode("theme")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition md:h-8 md:w-auto md:px-2.5"
                  style={
                    backgroundMode === "theme"
                      ? {
                          background: "var(--fp-primary)",
                          color: "#fff",
                          boxShadow: "0 10px 20px -14px rgba(15,23,42,0.4)",
                        }
                      : { color: "var(--fp-muted)" }
                  }
                  aria-label="Usar fondo del tema"
                  title="Modo tema"
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden pl-1 text-[10px] font-black uppercase tracking-[0.09em] md:inline">Tema</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBackgroundMode("white")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition md:h-8 md:w-auto md:px-2.5"
                  style={
                    backgroundMode === "white"
                      ? {
                          background: "var(--fp-primary)",
                          color: "#fff",
                          boxShadow: "0 10px 20px -14px rgba(15,23,42,0.4)",
                        }
                      : { color: "var(--fp-muted)" }
                  }
                  aria-label="Usar fondo claro"
                  title="Modo claro"
                >
                  <SunMedium className="h-4 w-4" />
                  <span className="hidden pl-1 text-[10px] font-black uppercase tracking-[0.09em] md:inline">Claro</span>
                </button>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)]/92 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--fp-primary)]/40"
                aria-label="Compartir demo"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden gap-3 border-b border-[var(--fp-border)] px-4 py-4 md:grid md:grid-cols-4">
          <button
            type="button"
            onClick={() => activateTab("contact")}
            aria-pressed={tab === "contact"}
            className={navButton}
            style={tab === "contact" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Contacto
          </button>
          <button
            type="button"
            onClick={() => activateTab("menu")}
            aria-pressed={tab === "menu"}
            className={navButton}
            style={tab === "menu" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Carta
          </button>
          <button
            type="button"
            onClick={() => activateTab("location")}
            aria-pressed={tab === "location"}
            className={navButton}
            style={tab === "location" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Ubicacion
          </button>
          <button
            type="button"
            onClick={() => activateTab("reservation")}
            aria-pressed={tab === "reservation"}
            className={navButton}
            style={tab === "reservation" ? { background: "var(--fp-primary)", color: "#fff", borderColor: "var(--fp-primary)" } : { borderColor: "var(--fp-border)" }}
          >
            Reserva
          </button>
        </div>

        <div className="min-h-[62vh] px-4 pb-24 pt-5 md:px-8 md:pb-8 md:pt-7">
          <div ref={tabContentAnchorRef} className="h-0 w-full" aria-hidden="true" />
          {tab === "contact" ? (
            <section className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_300px]">
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--fp-border)] bg-[var(--fp-card)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/10 to-transparent" />
                  <div className="relative h-[24rem] md:h-[34rem]">
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
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                    <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
                      {demo.promoStrip}
                    </p>
                    <h2 className="mt-4 max-w-[10ch] text-5xl font-black leading-[0.92] md:text-7xl">
                      {demo.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/78 md:text-base">
                      {demo.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="fp-demo-panel fp-demo-hover-card p-4 md:p-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[var(--fp-border)] shadow-lg">
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
                    <p className="mt-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[var(--fp-primary)]">
                      open now
                    </p>
                    <p className="mt-3 text-3xl font-black leading-none text-[var(--fp-text)]">
                      {demo.openHours}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--fp-muted)]">{demo.address}</p>
                  </div>

                  <div className="fp-demo-panel fp-demo-hover-card p-4 md:p-5">
                    <p className="fp-demo-kicker">Reserva o pedido</p>
                    <div className="mt-5 grid gap-3">
                      <a href={callHref} className="fp-demo-button-secondary inline-flex items-center justify-center gap-2 px-4 text-sm font-black text-[var(--fp-text)]">
                        <Phone className="h-4 w-4 text-[var(--fp-primary)]" /> Llamar ahora
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
                        className="fp-demo-button-primary inline-flex items-center justify-center gap-2 px-4 text-sm font-black text-white"
                      >
                        {"\u{1F4AC}"} Pedir por WhatsApp
                      </a>
                    </div>
                    <div className="mt-4">
                      <DemoSocialLinks
                        links={socialLinks}
                        className="justify-start"
                        onOpen={(platform) =>
                          void trackGrowthEvent("click_social", {
                            vertical: demo.vertical,
                            slug: demo.slug,
                            location: "restaurant_contact",
                            platform,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: "Visual grande", body: "Hero mas inmersivo con fotografia protagonista." },
                  { title: "CTA directo", body: "Reserva o pedido visible sin depender de bloques repetidos." },
                  { title: "Experiencia mobile", body: "Navegacion tactil, categorias claras y cierre rapido." },
                ].map((item) => (
                  <article key={item.title} className="fp-demo-panel fp-demo-hover-card p-5">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--fp-primary)]">
                      restaurante
                    </p>
                    <h3 className="mt-3 text-2xl font-black text-[var(--fp-text)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--fp-muted)]">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {tab === "menu" ? (
            <section className="space-y-5">
              {isPublicDemo ? (
                showMenuQuickGuide ? (
                  <div className="rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-card)] p-3 shadow-[0_12px_24px_-20px_rgba(2,6,23,0.55)] md:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fp-primary)]">Guia rapida demo</p>
                        <p className="mt-1 text-xs text-[var(--fp-muted)] md:text-sm">
                          Revisa este flujo rapido para entender la carta digital sin registro.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={dismissMenuQuickGuide}
                        className="shrink-0 rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-2.5 py-1.5 text-[11px] font-bold"
                      >
                        Entendido
                      </button>
                    </div>
                    <ol className="mt-3 space-y-2">
                      {DEMO_MENU_QUICK_GUIDE_STEPS.map((step, index) => (
                        <li key={step.id} className="flex items-start gap-2.5 rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-2.5 py-2">
                          <span
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{ background: "var(--fp-primary)" }}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[var(--fp-text)]">{step.title}</p>
                            <p className="mt-0.5 text-[11px] text-[var(--fp-muted)] md:text-xs">{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowMenuQuickGuide(true)}
                      className="rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-1.5 text-[11px] font-bold text-[var(--fp-muted)]"
                    >
                      Ver mini guia
                    </button>
                  </div>
                )
              ) : null}

              <div
                ref={menuStickyRef}
                className="sticky top-0 z-40 rounded-[1.8rem] border border-[var(--fp-border)] bg-[color-mix(in_srgb,var(--fp-card)_88%,transparent)] p-3 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.56)] backdrop-blur-xl"
              >
                <label className="flex h-12 items-center gap-3 rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)] px-4">
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
                      className="shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition duration-300 hover:-translate-y-0.5 md:text-sm"
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
                    <h3 className="text-4xl font-black tracking-[-0.04em] md:text-6xl" style={{ color: "var(--fp-primary)" }}>{group.name}</h3>
                    {group.items.map((item) => (
                      <article
                        key={item.id}
                        className="fp-demo-panel fp-demo-hover-card rounded-[1.5rem] p-3.5 md:p-4"
                      >
                        <div className="flex gap-3.5 md:gap-4.5">
                          <div className="fp-demo-image-frame relative h-[124px] w-[124px] shrink-0 rounded-[1.2rem] md:h-[176px] md:w-[176px]">
                            <DemoImage
                              src={item.image}
                              alt={item.name}
                              fallbackLabel={item.name}
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 124px, 168px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="line-clamp-2 text-[1.34rem] font-black leading-tight md:text-3xl">{item.name}</h4>
                              {item.badge ? (
                                <span className="rounded-full bg-[var(--fp-primary)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                                  {normalizeBadge(item.badge)}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[var(--fp-muted)] md:text-base">{item.description}</p>
                            <div className="mt-3 flex items-end gap-2">
                              {item.compareAtPrice ? (
                                <p className="text-[11px] line-through text-[var(--fp-muted)] md:text-xs">{formatMoney(item.compareAtPrice)}</p>
                              ) : null}
                              <p className="text-[1.46rem] font-black tracking-[-0.04em] text-[var(--fp-primary)] md:text-[1.72rem]">{formatMoney(item.price)}</p>
                            </div>
                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-1.5 py-1">
                              <button
                                type="button"
                                onClick={() => updateQty(item, -1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)] transition hover:border-[var(--fp-primary)]/40"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-[1.55rem] text-center text-[1.6rem] font-black leading-none">{cart[item.id] || 0}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item, 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)] transition hover:border-[var(--fp-primary)]/40"
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
            <section className="fp-demo-panel space-y-4 p-3 md:p-5">
              <div className="fp-demo-image-frame rounded-[1.5rem]">
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
                className="fp-demo-button-primary inline-flex items-center justify-center gap-2 px-5 text-sm font-black text-white"
              >
                <MapPin className="h-4 w-4" /> Ir ahora
              </a>
            </section>
          ) : null}

          {tab === "reservation" || reservationPanelReady ? (
            <section
              className={`${tab === "reservation" ? "block" : "hidden"} fp-demo-panel space-y-4 p-3 md:p-5`}
            >
              <div className="fp-demo-image-frame rounded-[1.5rem]">
                <DemoImage
                  src={reservationConfig.heroImage}
                  alt={reservationConfig.title}
                  fallbackLabel={reservationConfig.title}
                  unoptimized
                  width={1400}
                  height={600}
                  className="h-40 w-full object-cover md:h-52"
                />
              </div>
              <div className="rounded-[1.5rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4 md:p-5">
                <h3 className="text-3xl font-black md:text-4xl" style={{ color: "var(--fp-primary)" }}>
                  {reservationConfig.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--fp-muted)] md:text-base">{reservationConfig.subtitle}</p>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                      Nombre completo
                    </span>
                    <input
                      value={reservationName}
                      onChange={(event) => setReservationName(event.target.value)}
                      placeholder="Ej. Fabio Herrera"
                      className="w-full rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2.5 text-sm outline-none"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                      Personas
                    </span>
                    <div className="flex items-center rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)]">
                      <button
                        type="button"
                        onClick={() =>
                          setReservationGuests(String(Math.max(reservationConfig.minPartySize, reservationGuestsCount - 1)))
                        }
                        disabled={reservationGuestsCount <= reservationConfig.minPartySize}
                        className="inline-flex h-11 w-11 items-center justify-center border-r border-[var(--fp-border)] disabled:opacity-45"
                        aria-label="Disminuir personas"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div
                        className="flex min-w-0 flex-1 flex-col items-center justify-center px-2"
                        role="spinbutton"
                        aria-label="Cantidad de personas"
                        aria-valuemin={reservationConfig.minPartySize}
                        aria-valuemax={reservationConfig.maxPartySize}
                        aria-valuenow={reservationGuestsCount}
                      >
                        <span className="text-base font-black leading-none">{reservationGuestsCount}</span>
                        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--fp-muted)]">
                          personas
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setReservationGuests(String(Math.min(reservationConfig.maxPartySize, reservationGuestsCount + 1)))
                        }
                        disabled={reservationGuestsCount >= reservationConfig.maxPartySize}
                        className="inline-flex h-11 w-11 items-center justify-center border-l border-[var(--fp-border)] disabled:opacity-45"
                        aria-label="Aumentar personas"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--fp-muted)]">
                      Rango permitido: {reservationConfig.minPartySize} a {reservationConfig.maxPartySize} personas.
                    </p>
                  </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                    Fecha
                  </span>
                  <div className="relative">
                    <input
                      ref={reservationDateInputRef}
                      type="date"
                      value={reservationDate}
                      onChange={(event) => setReservationDate(event.target.value)}
                      onFocus={openReservationDatePicker}
                      className="w-full rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2.5 pr-12 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={openReservationDatePicker}
                      className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--fp-border)] bg-[var(--fp-surface)]"
                      aria-label="Abrir calendario"
                    >
                      <CalendarDays className="h-4 w-4" />
                    </button>
                  </div>
                </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                      Horario
                    </span>
                    <select
                      value={reservationSlot}
                      onChange={(event) => setReservationSlot(event.target.value)}
                      className="w-full rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2.5 text-sm outline-none"
                    >
                      {reservationConfig.slotOptions.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                      Celular (opcional)
                    </span>
                    <input
                      value={reservationContact}
                      onChange={(event) => setReservationContact(event.target.value)}
                      placeholder="906431630"
                      className="w-full rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2.5 text-sm outline-none"
                    />
                  </label>

                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--fp-primary)" }}>
                      Nota adicional
                    </span>
                    <textarea
                      rows={3}
                      value={reservationNote}
                      onChange={(event) => setReservationNote(event.target.value)}
                      placeholder={reservationConfig.notePlaceholder}
                      className="w-full resize-none rounded-[1rem] border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2.5 text-sm outline-none"
                    />
                  </label>
                </div>

                {reservationError ? (
                  <p
                    className={`mt-3 rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm ${
                      isLightBackground ? "text-rose-900" : "text-rose-100"
                    }`}
                  >
                    {reservationError}
                  </p>
                ) : null}
                {reservationFeedback ? (
                  <p
                    className={`mt-3 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-sm ${
                      isLightBackground ? "text-emerald-900" : "text-emerald-100"
                    }`}
                  >
                    {reservationFeedback}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={submitReservationDemo}
                  className="fp-demo-button-primary mt-4 inline-flex w-full items-center justify-center gap-2 px-4 text-sm font-black text-white"
                >
                  {reservationConfig.ctaLabel}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </article>
      </DemoReveal>

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
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => activateTab("contact")}
              aria-pressed={tab === "contact"}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fp-surface)] active:scale-[0.98]"
              style={tab === "contact" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <Phone className="mx-auto mb-1 h-4 w-4" />
              Contacto
            </button>
            <button
              type="button"
              onClick={() => activateTab("menu")}
              aria-pressed={tab === "menu"}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fp-surface)] active:scale-[0.98]"
              style={tab === "menu" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <Menu className="mx-auto mb-1 h-4 w-4" />
              Carta
            </button>
            <button
              type="button"
              onClick={() => activateTab("location")}
              aria-pressed={tab === "location"}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fp-surface)] active:scale-[0.98]"
              style={tab === "location" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <MapPin className="mx-auto mb-1 h-4 w-4" />
              Ubicacion
            </button>
            <button
              type="button"
              onClick={() => activateTab("reservation")}
              aria-pressed={tab === "reservation"}
              className="h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.08em] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fp-surface)] active:scale-[0.98]"
              style={tab === "reservation" ? { background: "var(--fp-primary)", color: "#fff" } : undefined}
            >
              <CalendarDays className="mx-auto mb-1 h-4 w-4" />
              Reserva
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
