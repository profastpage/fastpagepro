"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
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
  BadgeDollarSign,
  Sparkles,
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
  if (style === "solid") return "border-transparent bg-black/40";
  if (style === "outline") return "border-white/25 bg-transparent";
  return "border-white/10 bg-white/[0.04] backdrop-blur";
}

export default function PublicBioPage() {
  const params = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<PublicTab>("contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

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

  const filteredItems = profile.catalogItems.filter((item) => {
    const byCategory = selectedCategoryId ? item.categoryId === selectedCategoryId : true;
    const query = searchTerm.trim().toLowerCase();
    const bySearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.badge?.toLowerCase().includes(query);
    return byCategory && bySearch;
  });

  const pageStyle = {
    backgroundImage: `radial-gradient(120% 110% at 10% 0%, ${hexToRgba(colors.primary, 0.28)} 0%, transparent 50%), radial-gradient(120% 110% at 100% 100%, ${hexToRgba(colors.secondary, 0.32)} 0%, transparent 55%), linear-gradient(180deg, #020617 0%, #020617 44%, #000000 100%)`,
  };

  const wrapperStyle = {
    borderColor: hexToRgba(colors.primary, 0.45),
    fontFamily,
    background: `linear-gradient(160deg, ${hexToRgba(colors.primary, 0.14)} 0%, ${hexToRgba(colors.secondary, 0.16)} 55%, rgba(0, 0, 0, 0.88) 100%)`,
  };

  const interactiveStyle = {
    borderColor: hexToRgba(colors.primary, 0.42),
    background: `linear-gradient(120deg, ${hexToRgba(colors.primary, 0.2)} 0%, ${hexToRgba(colors.secondary, 0.2)} 100%)`,
  };

  return (
    <div className="min-h-screen bg-black px-2 py-3 md:py-8" style={pageStyle}>
      <div className="mx-auto w-full max-w-md rounded-[2.25rem] border overflow-hidden text-white" style={wrapperStyle}>
        <div className="relative">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt="Portada"
              className="h-40 w-full object-cover"
            />
          ) : (
            <div
              className="h-40 w-full"
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
                className="h-24 w-24 rounded-full border-4 object-cover bg-black"
                style={{ borderColor: hexToRgba(colors.primary, 0.95) }}
              />
            ) : (
              <div
                className="h-24 w-24 rounded-full border-4 flex items-center justify-center text-3xl font-black bg-black"
                style={{ borderColor: hexToRgba(colors.primary, 0.95) }}
              >
                {profile.displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pt-16 pb-4 text-center">
          <h1 className="text-4xl font-black tracking-tight">{profile.displayName}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.18em]" style={{ color: hexToRgba(colors.primary, 0.95) }}>
            {profile.categoryLabel || (profile.businessType === "restaurant" ? "Restaurante" : "Tienda online")}
          </p>
          {profile.bio && <p className="mt-3 text-sm text-zinc-100/85">{profile.bio}</p>}
        </div>

        <div className="px-4 pb-4 flex items-center justify-center flex-wrap gap-2">
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
                  className={`inline-flex h-11 w-11 items-center justify-center border text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${buttonRadiusClass}`}
                  style={interactiveStyle}
                  aria-label={link.title}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
        </div>

        <div className="px-4 pb-4">
          {activeTab === "contact" && (
            <section className={`rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28) }}>
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
            <section className={`rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28) }}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{catalogLabel}</h2>
                <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: hexToRgba(colors.primary, 0.4) }}>
                  {profile.businessType === "restaurant" ? <Fish className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                  {filteredItems.length}
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 rounded-2xl border bg-black/30 px-3 py-2" style={{ borderColor: hexToRgba(colors.primary, 0.35) }}>
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={`Buscar en ${catalogLabel.toLowerCase()}...`}
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
                />
              </label>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {profile.catalogCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`shrink-0 border px-3 py-2 text-xs font-bold transition ${buttonRadiusClass} ${
                      selectedCategoryId === category.id ? "text-white" : "text-zinc-100"
                    }`}
                    style={
                      selectedCategoryId === category.id
                        ? interactiveStyle
                        : { borderColor: hexToRgba(colors.primary, 0.35) }
                    }
                  >
                    <span className="mr-1">{category.emoji || (profile.businessType === "restaurant" ? "???" : "???")}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {filteredItems.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/25 p-4 text-sm text-zinc-200">
                    No hay productos para el filtro actual.
                  </div>
                )}

                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-2xl border p-3 ${cardClass}`}
                    style={{ borderColor: hexToRgba(colors.primary, 0.26) }}
                  >
                    <div className="flex gap-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                      ) : (
                        <div
                          className="h-20 w-20 rounded-xl flex items-center justify-center text-2xl"
                          style={interactiveStyle}
                        >
                          {item.emoji || (profile.businessType === "restaurant" ? "???" : "??")}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-extrabold leading-tight">{item.title}</h3>
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

              {profile.pricing.enabled && (
                <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: hexToRgba(colors.primary, 0.36) }}>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-[0.16em] font-bold">{profile.sectionLabels.pricing}</p>
                  </div>
                  <h3 className="mt-2 text-xl font-black">{profile.pricing.title}</h3>
                  <p className="mt-1 text-sm text-zinc-200/85">{profile.pricing.subtitle}</p>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {profile.pricing.plans.slice(0, 3).map((plan) => (
                      <article
                        key={plan.id}
                        className={`rounded-2xl border p-3 ${plan.highlighted ? "ring-1" : ""}`}
                        style={{ borderColor: hexToRgba(colors.primary, 0.4), boxShadow: plan.highlighted ? `0 0 0 1px ${hexToRgba(colors.secondary, 0.45)}` : undefined }}
                      >
                        <p className="text-sm font-black">{plan.title}</p>
                        {plan.normalPrice && <p className="mt-1 text-xs text-zinc-400">Normal: {plan.currency}{plan.normalPrice}</p>}
                        <p className="mt-1 text-3xl font-black" style={{ color: hexToRgba(colors.primary, 0.98) }}>
                          {plan.currency}{plan.price}
                        </p>
                        <ul className="mt-3 space-y-1 text-xs text-zinc-100/90">
                          {plan.features.slice(0, 5).map((feature, idx) => (
                            <li key={`${plan.id}-${idx}`} className="flex gap-2">
                              <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.ctaUrl && isValidExternalUrl(plan.ctaUrl) && (
                          <a
                            href={plan.ctaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-3 inline-flex w-full items-center justify-center border px-3 py-2 text-xs font-bold ${buttonRadiusClass}`}
                            style={interactiveStyle}
                          >
                            {plan.ctaLabel || "Mas detalles"}
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "location" && (
            <section className={`rounded-3xl border p-4 ${cardClass}`} style={{ borderColor: hexToRgba(colors.primary, 0.28) }}>
              <h2 className="text-2xl font-black">{profile.sectionLabels.location}</h2>

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
                  <div className="h-64 w-full flex items-center justify-center bg-black/40 text-center px-6 text-zinc-300">
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

        <div className="sticky bottom-0 z-20 border-t border-white/10 bg-black/85 px-1 pb-1 pt-1 backdrop-blur">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.08em] ${
                activeTab === "contact" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "contact" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <Phone className="h-4 w-4" />
              </div>
              {profile.sectionLabels.contact}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.08em] ${
                activeTab === "catalog" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "catalog" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                {profile.businessType === "restaurant" ? <Menu className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
              </div>
              {catalogLabel}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("location")}
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.08em] ${
                activeTab === "location" ? "text-white" : "text-zinc-300"
              }`}
              style={activeTab === "location" ? interactiveStyle : undefined}
            >
              <div className="mx-auto mb-1 h-4 w-4">
                <MapPin className="h-4 w-4" />
              </div>
              {profile.sectionLabels.location}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
