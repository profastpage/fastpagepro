"use client";

import { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getLinkHubThemeColors,
  getSafeLinkHubTheme,
  getPublishedLinkHubProfileBySlug,
  getSafeLinkHubFontFamily,
  hexToRgba,
  isValidExternalUrl,
  LINK_HUB_FONT_FAMILIES,
  LINK_HUB_THEME_STYLES,
  LinkHubLinkType,
  LinkHubProfile,
  sanitizeSlug,
} from "@/lib/linkHubProfile";
import {
  AtSign,
  ExternalLink,
  Facebook,
  Fish,
  Globe,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Shirt,
  Store,
  Youtube,
  Instagram,
  Linkedin,
  Music2,
  Share2,
} from "lucide-react";

type PublicTab = "contact" | "catalog" | "location";

const LINK_TYPE_ICON = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  x: AtSign,
} satisfies Record<LinkHubLinkType, ComponentType<{ className?: string }>>;

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
  if (style === "solid") return "border-transparent";
  if (style === "outline") return "border-white/25 bg-transparent";
  return "border-white/10 backdrop-blur";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-300" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-black px-6 text-white flex items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">Link Hub</p>
          <h1 className="mt-3 text-3xl font-black">Perfil no disponible</h1>
          <p className="mt-3 text-zinc-400">Este enlace no existe o aun no fue publicado.</p>
        </div>
      </div>
    );
  }

  const themeKey = getSafeLinkHubTheme(profile.theme);
  const theme = LINK_HUB_THEME_STYLES[themeKey];
  const colors = getLinkHubThemeColors(themeKey, profile.themePrimaryColor, profile.themeSecondaryColor);
  const safeFont = getSafeLinkHubFontFamily(profile.fontFamily);
  const fontFamily = LINK_HUB_FONT_FAMILIES[safeFont].stack;

  const buttonRadiusClass = getButtonRadiusClass(profile.buttonShape);
  const cardClass = getCardClass(profile.cardStyle);
  const callHref = profile.phoneNumber ? `tel:${normalizePhone(profile.phoneNumber)}` : "";
  const whatsappHref = toWhatsappUrl(profile.whatsappNumber);
  const catalogLabel =
    profile.businessType === "restaurant" ? profile.sectionLabels.menu : profile.sectionLabels.catalog;

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

  const pageStyle = {
    backgroundColor: hexToRgba(colors.secondary, 0.45),
    backgroundImage: `radial-gradient(120% 110% at 10% 0%, ${hexToRgba(colors.primary, 0.34)} 0%, transparent 55%), radial-gradient(120% 110% at 100% 100%, ${hexToRgba(colors.secondary, 0.4)} 0%, transparent 60%), linear-gradient(165deg, ${hexToRgba(colors.primary, 0.28)} 0%, ${hexToRgba(colors.secondary, 0.26)} 50%, ${hexToRgba(colors.primary, 0.24)} 100%)`,
  };

  const wrapperStyle = {
    borderColor: hexToRgba(colors.primary, 0.45),
    fontFamily,
    background: `linear-gradient(160deg, ${hexToRgba(colors.primary, 0.22)} 0%, ${hexToRgba(colors.secondary, 0.18)} 55%, ${hexToRgba(colors.primary, 0.14)} 100%)`,
  };

  const interactiveStyle = {
    borderColor: hexToRgba(colors.primary, 0.42),
    background: `linear-gradient(120deg, ${hexToRgba(colors.primary, 0.36)} 0%, ${hexToRgba(colors.secondary, 0.3)} 100%)`,
    boxShadow: `0 10px 24px -18px ${hexToRgba(colors.primary, 0.95)}`,
  };

  const headerBarStyle = {
    borderColor: hexToRgba(colors.primary, 0.2),
    background: `linear-gradient(90deg, ${hexToRgba(colors.primary, 0.26)} 0%, ${hexToRgba(colors.secondary, 0.2)} 100%)`,
  };

  const avatarFallbackStyle = {
    borderColor: hexToRgba(colors.primary, 0.85),
    background: `linear-gradient(130deg, ${hexToRgba(colors.primary, 0.4)} 0%, ${hexToRgba(colors.secondary, 0.3)} 100%)`,
  };

  const cardSurfaceStyle =
    profile.cardStyle === "solid"
      ? { background: `linear-gradient(145deg, ${hexToRgba(colors.primary, 0.26)} 0%, ${hexToRgba(colors.secondary, 0.22)} 100%)` }
      : profile.cardStyle === "outline"
      ? { background: "transparent" }
      : {
          background: `linear-gradient(150deg, ${hexToRgba(colors.primary, 0.18)} 0%, ${hexToRgba(colors.secondary, 0.14)} 100%)`,
          backdropFilter: "blur(10px)",
        };

  const catalogStickyStyle = {
    borderColor: hexToRgba(colors.primary, 0.24),
    background: `linear-gradient(180deg, ${hexToRgba(colors.primary, 0.38)} 0%, ${hexToRgba(colors.secondary, 0.26)} 100%)`,
    boxShadow: `0 12px 24px -22px ${hexToRgba(colors.primary, 0.95)}`,
  };

  const searchSurfaceStyle = {
    borderColor: hexToRgba(colors.primary, 0.4),
    background: `linear-gradient(120deg, ${hexToRgba(colors.primary, 0.26)} 0%, ${hexToRgba(colors.secondary, 0.2)} 100%)`,
  };

  const navSurfaceStyle = {
    borderColor: hexToRgba(colors.primary, 0.35),
    background: `linear-gradient(120deg, ${hexToRgba(colors.primary, 0.42)} 0%, ${hexToRgba(colors.secondary, 0.32)} 100%)`,
  };

  const itemSurfaceStyle = {
    background: `linear-gradient(145deg, ${hexToRgba(colors.primary, 0.18)} 0%, ${hexToRgba(colors.secondary, 0.12)} 100%)`,
  };

  return (
    <div className="min-h-screen px-2 py-3 md:px-6 md:py-8" style={pageStyle}>
      <div
        className="mx-auto w-full max-w-md md:max-w-5xl rounded-[2.25rem] md:rounded-[2.5rem] border overflow-hidden text-white"
        style={wrapperStyle}
      >
        <div className="px-4 md:px-8 py-3 border-b" style={headerBarStyle}>
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
              <span className="truncate text-xs md:text-sm font-semibold text-zinc-100">{profile.displayName}</span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/5 text-white hover:bg-white/10"
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
                        borderColor: hexToRgba(colors.primary, 0.35),
                        background: `linear-gradient(120deg, ${hexToRgba(colors.primary, 0.35)} 0%, ${hexToRgba(colors.secondary, 0.28)} 100%)`,
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
                    background: `linear-gradient(130deg, ${hexToRgba(colors.primary, 0.5)} 0%, ${hexToRgba(colors.secondary, 0.44)} 100%)`,
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
                      borderColor: hexToRgba(colors.primary, 0.95),
                      background: avatarFallbackStyle.background,
                    }}
                  />
                ) : (
                  <div
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 flex items-center justify-center text-3xl md:text-4xl font-black"
                    style={{
                      borderColor: hexToRgba(colors.primary, 0.95),
                      background: avatarFallbackStyle.background,
                    }}
                  >
                    {profile.displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 md:px-8 pt-16 md:pt-20 pb-4 text-center">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">{profile.displayName}</h1>
              <p className="mt-2 text-sm md:text-base uppercase tracking-[0.18em]" style={{ color: hexToRgba(colors.primary, 0.95) }}>
                {profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante" : "Tienda online")}
              </p>
              {profile.bio && <p className="mt-3 text-sm md:text-base text-zinc-100/85">{profile.bio}</p>}
            </div>

            <div className="px-4 md:px-8 pb-4 flex items-center justify-center flex-wrap gap-2">
              {profile.links
                .filter((link) => link.url)
                .slice(0, 8)
                .map((link) => {
                  const Icon = LINK_TYPE_ICON[link.type];
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center border text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${buttonRadiusClass}`}
                      style={interactiveStyle}
                      aria-label={link.title}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
            </div>
          </>
        ) : (
          <div className="px-5 md:px-8 py-6 md:py-8 text-center border-b border-white/10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
              {activeTab === "catalog" ? catalogLabel : profile.sectionLabels.location}
            </h1>
          </div>
        )}

        <div className="hidden md:grid grid-cols-3 gap-3 px-8 pb-6">
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition ${
              activeTab === "contact" ? "text-white" : "text-zinc-300"
            }`}
            style={activeTab === "contact" ? interactiveStyle : { borderColor: hexToRgba(colors.primary, 0.32) }}
          >
            {profile.sectionLabels.contact}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition ${
              activeTab === "catalog" ? "text-white" : "text-zinc-300"
            }`}
            style={activeTab === "catalog" ? interactiveStyle : { borderColor: hexToRgba(colors.primary, 0.32) }}
          >
            {catalogLabel}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`rounded-2xl border px-3 py-3 text-sm font-black uppercase tracking-[0.08em] transition ${
              activeTab === "location" ? "text-white" : "text-zinc-300"
            }`}
            style={activeTab === "location" ? interactiveStyle : { borderColor: hexToRgba(colors.primary, 0.32) }}
          >
            {profile.sectionLabels.location}
          </button>
        </div>

        <div className="px-4 md:px-8 pb-24 md:pb-8">
          {activeTab === "contact" && (
            <section className={`rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28), ...cardSurfaceStyle }}>
              <h2 className="text-2xl font-black">{profile.sectionLabels.contact}</h2>
              <p className="mt-1 text-sm text-zinc-200/90">Atiende clientes directo desde tu canal favorito.</p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {callHref && (
                  <a
                    href={callHref}
                    className={`inline-flex items-center justify-center gap-2 border px-4 py-3 font-bold ${buttonRadiusClass}`}
                    style={interactiveStyle}
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
                    className={`inline-flex items-center justify-center gap-2 border px-4 py-3 font-bold ${buttonRadiusClass}`}
                    style={interactiveStyle}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Escribir ahora
                  </a>
                )}

                {profile.links
                  .filter((link) => isValidExternalUrl(link.url))
                  .map((link) => {
                    const Icon = LINK_TYPE_ICON[link.type];
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center justify-between gap-2 border px-4 py-3 text-sm font-semibold ${buttonRadiusClass}`}
                        style={interactiveStyle}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {link.title}
                        </span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    );
                  })}
              </div>
            </section>
          )}

          {activeTab === "catalog" && (
            <section className={`rounded-3xl border p-4 overflow-hidden ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28), ...cardSurfaceStyle }}>
              <div className="hidden md:flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{catalogLabel}</h2>
                <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: hexToRgba(colors.primary, 0.4) }}>
                  {profile.businessType === "restaurant" ? <Fish className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                  {totalFilteredItems}
                </div>
              </div>

              <div
                ref={catalogScrollRef}
                onScroll={handleCatalogScroll}
                className="mt-2 max-h-[66vh] overflow-y-auto pr-1 no-scrollbar md:mt-4 md:max-h-[72vh]"
              >
                <div
                  ref={catalogStickyRef}
                  className="sticky top-0 z-20 -mx-1 mb-3 border-b px-1 pb-3 pt-1 backdrop-blur"
                  style={catalogStickyStyle}
                >
                  <label className="flex items-center gap-2 rounded-2xl border px-3 py-2" style={searchSurfaceStyle}>
                    <Search className="h-4 w-4 text-zinc-400" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={profile.businessType === "restaurant" ? "Buscar en la carta..." : "Buscar en el catalogo..."}
                      className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
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
                        className={`shrink-0 border px-3 py-2 text-xs font-bold transition ${buttonRadiusClass} ${
                          selectedCategoryId === category.id ? "text-white" : "text-zinc-100"
                        }`}
                        style={
                          selectedCategoryId === category.id
                            ? interactiveStyle
                            : { borderColor: hexToRgba(colors.primary, 0.35) }
                        }
                      >
                        <span className="mr-1">{category.emoji || category.name.slice(0, 1).toUpperCase()}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {categorySections.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/25 p-4 text-sm text-zinc-200">
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
                      <h3 className="text-3xl md:text-2xl font-black tracking-tight">{section.name}</h3>
                      <div className="mt-3 space-y-3">
                        {section.items.map((item) => (
                          <article
                            key={item.id}
                            className={`rounded-2xl border p-3 ${cardClass}`}
                            style={{ borderColor: hexToRgba(colors.primary, 0.26), ...itemSurfaceStyle }}
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
                                  <h4 className="text-xl font-extrabold leading-tight">{item.title}</h4>
                                  {item.badge && (
                                    <span className="rounded-full border px-2 py-1 text-[10px] font-black uppercase" style={interactiveStyle}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && <p className="mt-1 text-sm text-zinc-200/90">{item.description}</p>}
                                <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                                  {item.compareAtPrice && (
                                    <span className="text-zinc-400 line-through">S/{item.compareAtPrice}</span>
                                  )}
                                  <span className="text-lg" style={{ color: hexToRgba(colors.primary, 0.98) }}>
                                    S/{item.price}
                                  </span>
                                </div>
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
            <section className={`rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28), ...cardSurfaceStyle }}>
              <h2 className="hidden md:block text-2xl font-black">{profile.sectionLabels.location}</h2>

              <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: hexToRgba(colors.primary, 0.36) }}>
                {profile.location.mapEmbedUrl ? (
                  <iframe
                    title={`Mapa de ${profile.displayName}`}
                    src={profile.location.mapEmbedUrl}
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="h-64 w-full flex items-center justify-center text-center px-6 text-zinc-300" style={itemSurfaceStyle}>
                    Agrega un link de Google Maps Embed para mostrar el mapa.
                  </div>
                )}
              </div>

              {profile.location.address && (
                <div className="mt-4">
                  <h3 className="text-3xl font-black leading-tight">{profile.location.address}</h3>
                </div>
              )}

              {profile.location.scheduleLines.length > 0 && (
                <div className="mt-4">
                  <p className="text-2xl font-black">Horarios</p>
                  <div className="mt-2 space-y-2 text-sm text-zinc-100">
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

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="mx-auto w-full max-w-md rounded-2xl border p-1 backdrop-blur-xl" style={navSurfaceStyle}>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={`h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight ${
                activeTab === "contact" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "contact" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <Phone className="h-4 w-4" />
              </div>
              <span className="block truncate">{profile.sectionLabels.contact}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight ${
                activeTab === "catalog" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "catalog" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                {profile.businessType === "restaurant" ? <Menu className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
              </div>
              <span className="block truncate">{catalogLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("location")}
              className={`h-14 rounded-xl px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight ${
                activeTab === "location" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "location" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="block truncate">{profile.sectionLabels.location}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
