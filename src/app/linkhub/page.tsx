"use client";

import { ChangeEvent, ComponentType, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  buildDefaultLinkHubProfile,
  createLinkHubCatalogCategory,
  createLinkHubCatalogItem,
  getLinkHubProfileByUserId,
  getLinkHubThemeColors,
  getSafeLinkHubTheme,
  hexToRgba,
  isLinkHubSlugAvailable,
  isValidExternalUrl,
  LINK_HUB_THEME_STYLES,
  LinkHubLink,
  LinkHubLinkType,
  LinkHubBusinessType,
  LinkHubCatalogItem,
  LinkHubPricingPlan,
  LinkHubProfile,
  LinkHubTheme,
  MAX_LINK_HUB_CATALOG_CATEGORIES,
  MAX_LINK_HUB_CATALOG_ITEMS,
  normalizeHexColor,
  normalizeLinkUrl,
  normalizeLinkHubProfile,
  sanitizeSlug,
  saveLinkHubProfileForUser,
  MAX_LINK_HUB_LINKS,
} from "@/lib/linkHubProfile";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Fish,
  Globe,
  ImagePlus,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  MoveDown,
  MoveUp,
  Music2,
  Palette,
  Phone,
  Plus,
  Save,
  Search,
  Sparkles,
  Store,
  BadgeDollarSign,
  Trash2,
  Upload,
  Youtube,
  Facebook,
  MessageCircle,
  AtSign,
  Rocket,
  X,
} from "lucide-react";

type SaveMode = "draft" | "publish";

const LINK_TYPE_OPTIONS: Array<{ value: LinkHubLinkType; label: string }> = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "x", label: "X / Twitter" },
];

const LINK_TYPE_ICON: Record<LinkHubLinkType, ComponentType<{ className?: string }>> = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  x: AtSign,
};

function createEmptyLink(): LinkHubLink {
  return {
    id: crypto.randomUUID(),
    title: "",
    url: "",
    type: "website",
  };
}

function randomColorHex(): string {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0")}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("La imagen no es valida."));
    image.src = dataUrl;
  });
}

async function optimizeAvatarImage(file: File): Promise<string> {
  const source = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(source);

  const maxSize = 512;
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar el avatar.");

  context.drawImage(image, 0, 0, width, height);

  let encoded = canvas.toDataURL("image/jpeg", 0.9);
  if (encoded.length > 780_000) {
    encoded = canvas.toDataURL("image/jpeg", 0.75);
  }

  return encoded;
}

function parseMultiline(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatMultiline(lines: string[]): string {
  return lines.join("\n");
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function toWhatsappUrl(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function LinkHubPage() {
  const { user, loading } = useAuth(true);
  const router = useRouter();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [origin, setOrigin] = useState("");
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewCategoryId, setPreviewCategoryId] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.uid) return;
      setIsLoadingProfile(true);

      try {
        const stored = await getLinkHubProfileByUserId(user.uid);
        if (!active) return;

        if (stored) {
          const normalized = normalizeLinkHubProfile(stored, user);
          setProfile(normalized);
          setPreviewCategoryId(normalized.catalogCategories[0]?.id || "");
          return;
        }

        const defaultProfile = buildDefaultLinkHubProfile(user);
        setProfile(defaultProfile);
        setPreviewCategoryId(defaultProfile.catalogCategories[0]?.id || "");
      } catch (error) {
        console.error("[LinkHub] Failed loading profile:", error);
        if (active) {
          // Fallback prevents infinite loading if Firestore rules temporarily block reads.
          const fallback = buildDefaultLinkHubProfile(user);
          setProfile(fallback);
          setPreviewCategoryId(fallback.catalogCategories[0]?.id || "");
        }
        setMessage({
          type: "error",
          text: "No se pudo leer tu perfil guardado. Se cargo un borrador local para que puedas continuar.",
        });
      } finally {
        if (active) {
          setIsLoadingProfile(false);
        }
      }
    }

    if (!loading && user?.uid) {
      loadProfile();
    }

    return () => {
      active = false;
    };
  }, [loading, user]);

  const publicUrl = useMemo(() => {
    if (!profile?.slug || !origin) return "";
    return `${origin}/bio/${profile.slug}`;
  }, [origin, profile?.slug]);

  const activeTheme = useMemo(() => {
    const themeKey = getSafeLinkHubTheme(profile?.theme);
    const preset = LINK_HUB_THEME_STYLES[themeKey];
    const colors = getLinkHubThemeColors(themeKey, profile?.themePrimaryColor, profile?.themeSecondaryColor);

    return {
      key: themeKey,
      preset,
      ...colors,
    };
  }, [profile?.theme, profile?.themePrimaryColor, profile?.themeSecondaryColor]);

  const catalogLabel =
    profile?.businessType === "restaurant" ? profile?.sectionLabels.menu : profile?.sectionLabels.catalog;

  const previewItems = useMemo(() => {
    if (!profile) return [];
    return profile.catalogItems.filter((item) => {
      const byCategory = previewCategoryId ? item.categoryId === previewCategoryId : true;
      const term = previewSearch.trim().toLowerCase();
      const bySearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.badge?.toLowerCase().includes(term);
      return byCategory && bySearch;
    });
  }, [previewCategoryId, previewSearch, profile]);

  const previewShellStyle = useMemo(
    () => ({
      borderColor: hexToRgba(activeTheme.primary, 0.35),
      backgroundImage: `radial-gradient(120% 110% at 10% 0%, ${hexToRgba(activeTheme.primary, 0.38)} 0%, transparent 46%), radial-gradient(120% 110% at 100% 100%, ${hexToRgba(activeTheme.secondary, 0.34)} 0%, transparent 52%), linear-gradient(180deg, #020617 0%, #020617 40%, #000000 100%)`,
    }),
    [activeTheme.primary, activeTheme.secondary],
  );

  const previewPanelStyle = useMemo(
    () => ({
      borderColor: hexToRgba(activeTheme.primary, 0.25),
      background: `linear-gradient(160deg, ${hexToRgba(activeTheme.primary, 0.16)} 0%, ${hexToRgba(activeTheme.secondary, 0.14)} 42%, rgba(0, 0, 0, 0.58) 100%)`,
    }),
    [activeTheme.primary, activeTheme.secondary],
  );

  const previewButtonStyle = useMemo(
    () => ({
      borderColor: hexToRgba(activeTheme.primary, 0.5),
      background: `linear-gradient(120deg, ${hexToRgba(activeTheme.primary, 0.25)} 0%, ${hexToRgba(activeTheme.secondary, 0.24)} 100%)`,
    }),
    [activeTheme.primary, activeTheme.secondary],
  );

  function patchProfile<K extends keyof LinkHubProfile>(field: K, value: LinkHubProfile[K]) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }

  function applyTheme(theme: LinkHubTheme) {
    const preset = LINK_HUB_THEME_STYLES[theme];
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        theme,
        themePrimaryColor: preset.primary,
        themeSecondaryColor: preset.secondary,
      };
    });
  }

  function patchLocation<K extends keyof LinkHubProfile["location"]>(
    field: K,
    value: LinkHubProfile["location"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      };
    });
  }

  function patchSectionLabel<K extends keyof LinkHubProfile["sectionLabels"]>(
    field: K,
    value: LinkHubProfile["sectionLabels"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sectionLabels: {
          ...prev.sectionLabels,
          [field]: value,
        },
      };
    });
  }

  function patchPricing<K extends keyof LinkHubProfile["pricing"]>(
    field: K,
    value: LinkHubProfile["pricing"][K],
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: value,
        },
      };
    });
  }

  function patchPlan(planId: string, patch: Partial<LinkHubPricingPlan>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          plans: prev.pricing.plans.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)),
        },
      };
    });
  }

  function changeBusinessType(nextType: LinkHubBusinessType) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        businessType: nextType,
        sectionLabels: {
          ...prev.sectionLabels,
          menu: nextType === "restaurant" ? "Carta" : prev.sectionLabels.menu,
          catalog: nextType === "general" ? "Catalogo" : prev.sectionLabels.catalog,
        },
      };
    });
  }

  function addCategory() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES) return prev;
      const emoji = prev.businessType === "restaurant" ? "🍽️" : "🛍️";
      return {
        ...prev,
        catalogCategories: [...prev.catalogCategories, createLinkHubCatalogCategory("", emoji)],
      };
    });
  }

  function patchCategory(
    categoryId: string,
    patch: Partial<LinkHubProfile["catalogCategories"][number]>,
  ) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogCategories: prev.catalogCategories.map((category) =>
          category.id === categoryId ? { ...category, ...patch } : category,
        ),
      };
    });
  }

  function removeCategory(categoryId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogCategories.length <= 1) return prev;
      const categories = prev.catalogCategories.filter((category) => category.id !== categoryId);
      const fallbackId = categories[0]?.id || "";
      return {
        ...prev,
        catalogCategories: categories,
        catalogItems: prev.catalogItems.map((item) =>
          item.categoryId === categoryId ? { ...item, categoryId: fallbackId } : item,
        ),
      };
    });
  }

  function addCatalogItem() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS) return prev;
      return {
        ...prev,
        catalogItems: [...prev.catalogItems, createLinkHubCatalogItem(prev.catalogCategories[0]?.id || "")],
      };
    });
  }

  function patchCatalogItem(itemId: string, patch: Partial<LinkHubCatalogItem>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        catalogItems: prev.catalogItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
      };
    });
  }

  function removeCatalogItem(itemId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextItems = prev.catalogItems.filter((item) => item.id !== itemId);
      return {
        ...prev,
        catalogItems: nextItems.length > 0 ? nextItems : [createLinkHubCatalogItem(prev.catalogCategories[0]?.id || "")],
      };
    });
  }

  function patchLink(linkId: string, patch: Partial<LinkHubLink>) {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        links: prev.links.map((link) => (link.id === linkId ? { ...link, ...patch } : link)),
      };
    });
  }

  function addLink() {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.links.length >= MAX_LINK_HUB_LINKS) {
        return prev;
      }
      return { ...prev, links: [...prev.links, createEmptyLink()] };
    });
  }

  function removeLink(linkId: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const nextLinks = prev.links.filter((link) => link.id !== linkId);
      return { ...prev, links: nextLinks.length > 0 ? nextLinks : [createEmptyLink()] };
    });
  }

  function moveLink(linkId: string, direction: "up" | "down") {
    setProfile((prev) => {
      if (!prev) return prev;
      const index = prev.links.findIndex((item) => item.id === linkId);
      if (index < 0) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.links.length) return prev;

      const reordered = [...prev.links];
      const [item] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, item);
      return { ...prev, links: reordered };
    });
  }

  async function copyPublicUrl() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setMessage({ type: "success", text: "URL copiada al portapapeles." });
    } catch {
      setMessage({ type: "error", text: "No se pudo copiar la URL." });
    }
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Solo se permiten archivos de imagen para el avatar." });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: "error", text: "La imagen es muy pesada. Usa una menor a 8MB." });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const optimized = await optimizeAvatarImage(file);
      patchProfile("avatarUrl", optimized);
      setMessage({ type: "success", text: "Avatar cargado correctamente." });
    } catch (error) {
      console.error("[LinkHub] Avatar upload error:", error);
      setMessage({ type: "error", text: "No se pudo procesar la imagen seleccionada." });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function saveProfile(mode: SaveMode) {
    if (!profile || !user?.uid) return;

    const sanitizedSlug = sanitizeSlug(profile.slug);
    if (profile.displayName.trim().length < 2) {
      setMessage({ type: "error", text: "El nombre de perfil debe tener al menos 2 caracteres." });
      return;
    }
    if (sanitizedSlug.length < 3) {
      setMessage({ type: "error", text: "El slug publico debe tener al menos 3 caracteres." });
      return;
    }

    const preparedLinks = profile.links
      .map((link) => ({
        ...link,
        title: link.title.trim(),
        url: normalizeLinkUrl(link.url),
      }))
      .filter((link) => link.title || link.url);

    const invalidLink = preparedLinks.find(
      (link) => !link.title || !link.url || !isValidExternalUrl(link.url),
    );
    if (invalidLink) {
      setMessage({
        type: "error",
        text: "Cada enlace necesita titulo y URL valida (ej. https://...).",
      });
      return;
    }

    const cleanedCategories = profile.catalogCategories
      .map((category) => ({
        ...category,
        name: category.name.trim(),
        emoji: (category.emoji || "").trim(),
      }))
      .filter((category) => category.name.length > 0)
      .slice(0, MAX_LINK_HUB_CATALOG_CATEGORIES);

    if (cleanedCategories.length === 0) {
      setMessage({ type: "error", text: "Debes agregar al menos una categoria." });
      return;
    }

    const categoryIds = new Set(cleanedCategories.map((category) => category.id));
    const fallbackCategoryId = cleanedCategories[0].id;
    const cleanedItems = profile.catalogItems
      .map((item) => ({
        ...item,
        categoryId: categoryIds.has(item.categoryId) ? item.categoryId : fallbackCategoryId,
        title: item.title.trim(),
        description: item.description.trim(),
        imageUrl: item.imageUrl.trim(),
        price: item.price.trim(),
        compareAtPrice: (item.compareAtPrice || "").trim(),
        badge: (item.badge || "").trim(),
        emoji: (item.emoji || "").trim(),
      }))
      .filter((item) => item.title || item.description || item.price || item.imageUrl)
      .slice(0, MAX_LINK_HUB_CATALOG_ITEMS);

    const invalidItem = cleanedItems.find((item) => !item.title || !item.price);
    if (invalidItem) {
      setMessage({ type: "error", text: "Cada item de carta/catalogo debe tener nombre y precio." });
      return;
    }

    const cleanedPlans = profile.pricing.plans.slice(0, 3).map((plan) => ({
      ...plan,
      title: plan.title.trim(),
      normalPrice: plan.normalPrice.trim(),
      price: plan.price.trim(),
      currency: plan.currency.trim() || "S/.",
      ctaLabel: plan.ctaLabel.trim() || "Mas detalles",
      ctaUrl: plan.ctaUrl.trim(),
      features: plan.features.map((feature) => feature.trim()).filter(Boolean),
    }));

    if (profile.pricing.enabled && cleanedPlans.some((plan) => !plan.title || !plan.price)) {
      setMessage({ type: "error", text: "Cada plan debe tener titulo y precio." });
      return;
    }

    if (mode === "publish" && cleanedItems.length === 0) {
      setMessage({
        type: "error",
        text: "Debes agregar al menos un item valido antes de publicar.",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const available = await isLinkHubSlugAvailable(sanitizedSlug, user.uid);
      if (!available) {
        setMessage({ type: "error", text: "Ese slug ya esta en uso. Elige uno diferente." });
        return;
      }

      const safeTheme = getSafeLinkHubTheme(profile.theme);
      const safeColors = getLinkHubThemeColors(
        safeTheme,
        profile.themePrimaryColor,
        profile.themeSecondaryColor,
      );

      const now = Date.now();
      const nextProfile = normalizeLinkHubProfile(
        {
          ...profile,
          userId: user.uid,
          slug: sanitizedSlug,
          displayName: profile.displayName.trim(),
          bio: profile.bio.trim(),
          avatarUrl: profile.avatarUrl.trim(),
          coverImageUrl: profile.coverImageUrl.trim(),
          categoryLabel: profile.categoryLabel.trim(),
          phoneNumber: profile.phoneNumber.trim(),
          whatsappNumber: profile.whatsappNumber.trim(),
          theme: safeTheme,
          themePrimaryColor: safeColors.primary,
          themeSecondaryColor: safeColors.secondary,
          links: preparedLinks.length > 0 ? preparedLinks : [createEmptyLink()],
          catalogCategories: cleanedCategories,
          catalogItems: cleanedItems,
          location: {
            ...profile.location,
            address: profile.location.address.trim(),
            mapEmbedUrl: profile.location.mapEmbedUrl.trim(),
            mapsUrl: profile.location.mapsUrl.trim(),
            ctaLabel: profile.location.ctaLabel.trim() || "Ir ahora",
            scheduleLines: profile.location.scheduleLines.map((line) => line.trim()).filter(Boolean),
          },
          pricing: {
            ...profile.pricing,
            title: profile.pricing.title.trim() || "Catalogo digital online",
            subtitle: profile.pricing.subtitle.trim(),
            plans: cleanedPlans,
          },
          published: mode === "publish",
          ...(typeof profile.publishedAt === "number" ? { publishedAt: profile.publishedAt } : {}),
          ...(mode === "publish" ? { publishedAt: now } : {}),
          updatedAt: now,
          createdAt: profile.createdAt || now,
        },
        user,
      );

      await saveLinkHubProfileForUser(user.uid, nextProfile);
      setProfile(nextProfile);
      setPreviewCategoryId(nextProfile.catalogCategories[0]?.id || "");
      setMessage({
        type: "success",
        text:
          mode === "publish"
            ? "Link Hub publicado. Ya puedes compartir tu URL."
            : "Borrador guardado correctamente.",
      });
      if (mode === "publish") {
        router.push(`/published?highlight=linkhub-${user.uid}&kind=linkhub`);
      }
    } catch (error) {
      console.error("[LinkHub] Save error:", error);
      setMessage({ type: "error", text: "No se pudo guardar. Revisa permisos de Firestore." });
    } finally {
      setIsSaving(false);
    }
  }

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">No se pudo abrir Link Hub</h1>
          <p className="mt-3 text-red-100/90">
            Ocurrio un problema de permisos o conexion. Recarga la pagina e intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 pt-24 md:pt-28 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Link Hub</h1>
          <p className="mt-2 text-zinc-400 max-w-3xl">
            Crea una landing mobile-first con 3 secciones: contacto, {catalogLabel?.toLowerCase()} y ubicacion.
            Incluye catalogo digital online con 3 planes para activacion de clientes.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              message.type === "success"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-red-400/40 bg-red-400/10 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <h2 className="text-xl font-bold text-white mb-5">Identidad del perfil</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Nombre</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.displayName}
                    onChange={(event) => patchProfile("displayName", event.target.value)}
                    placeholder="Tu marca o nombre profesional"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Slug publico</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.slug}
                    onChange={(event) => patchProfile("slug", sanitizeSlug(event.target.value))}
                    placeholder="tu-nombre"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Rubro</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.businessType}
                    onChange={(event) => changeBusinessType(event.target.value as LinkHubBusinessType)}
                  >
                    <option value="restaurant">Restaurante / Cafeteria</option>
                    <option value="general">Tienda / General</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Etiqueta del rubro</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.categoryLabel}
                    onChange={(event) => patchProfile("categoryLabel", event.target.value)}
                    placeholder={profile.businessType === "restaurant" ? "Cevicheria" : "Tienda online"}
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Foto de perfil</span>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      value={profile.avatarUrl}
                      onChange={(event) => patchProfile("avatarUrl", event.target.value)}
                      placeholder="https://... o sube un archivo"
                    />
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-sky-300/40 bg-sky-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-sky-100">
                      {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Adjuntar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploadingAvatar}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => patchProfile("avatarUrl", "")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-red-100"
                    >
                      <X className="h-4 w-4" />
                      Quitar
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Soporta JPG, PNG, WEBP. Se optimiza automaticamente para carga rapida.
                  </p>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Portada (URL)</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.coverImageUrl}
                    onChange={(event) => patchProfile("coverImageUrl", event.target.value)}
                    placeholder="https://..."
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Bio</span>
                  <textarea
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                    value={profile.bio}
                    onChange={(event) => patchProfile("bio", event.target.value)}
                    placeholder="Describe brevemente lo que ofreces."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Tab contacto</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.sectionLabels.contact}
                    onChange={(event) => patchSectionLabel("contact", event.target.value)}
                    placeholder="Contacto"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Tab ubicacion</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.sectionLabels.location}
                    onChange={(event) => patchSectionLabel("location", event.target.value)}
                    placeholder="Ubicacion"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Telefono</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.phoneNumber}
                    onChange={(event) => patchProfile("phoneNumber", event.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">WhatsApp</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.whatsappNumber}
                    onChange={(event) => patchProfile("whatsappNumber", event.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-white">Enlaces sociales y CTA</h2>
                <button
                  type="button"
                  onClick={addLink}
                  disabled={profile.links.length >= MAX_LINK_HUB_LINKS}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              <div className="space-y-4">
                {profile.links.map((link, index) => (
                  <div key={link.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={link.title}
                        onChange={(event) => patchLink(link.id, { title: event.target.value })}
                        placeholder="Texto del boton"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={link.url}
                        onChange={(event) => patchLink(link.id, { url: event.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                      <div className="flex items-center gap-2">
                        <select
                          className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                          value={link.type}
                          onChange={(event) =>
                            patchLink(link.id, { type: event.target.value as LinkHubLinkType })
                          }
                        >
                          {LINK_TYPE_OPTIONS.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => moveLink(link.id, "up")}
                          disabled={index === 0}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 disabled:opacity-40"
                          aria-label="Mover arriba"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(link.id, "down")}
                          disabled={index === profile.links.length - 1}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 disabled:opacity-40"
                          aria-label="Mover abajo"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLink(link.id)}
                          className="rounded-xl border border-red-300/30 bg-red-400/10 p-2 text-red-200"
                          aria-label="Eliminar enlace"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">
                  {profile.businessType === "restaurant" ? "Carta" : "Catalogo"} digital
                </h2>
                <button
                  type="button"
                  onClick={addCatalogItem}
                  disabled={profile.catalogItems.length >= MAX_LINK_HUB_CATALOG_ITEMS}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Item
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">Categorias</p>
                  <button
                    type="button"
                    onClick={addCategory}
                    disabled={profile.catalogCategories.length >= MAX_LINK_HUB_CATALOG_CATEGORIES}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Categoria
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.catalogCategories.map((category) => (
                    <div key={category.id} className="grid grid-cols-[90px_1fr_auto] gap-2">
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={category.emoji || ""}
                        onChange={(event) => patchCategory(category.id, { emoji: event.target.value })}
                        placeholder="🍽️"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={category.name}
                        onChange={(event) => patchCategory(category.id, { name: event.target.value })}
                        placeholder="Nombre de categoria"
                      />
                      <button
                        type="button"
                        onClick={() => removeCategory(category.id)}
                        disabled={profile.catalogCategories.length <= 1}
                        className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-red-100 disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {profile.catalogItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">Item</p>
                      <button
                        type="button"
                        onClick={() => removeCatalogItem(item.id)}
                        className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-100"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.title}
                        onChange={(event) => patchCatalogItem(item.id, { title: event.target.value })}
                        placeholder="Nombre del item"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.imageUrl}
                        onChange={(event) => patchCatalogItem(item.id, { imageUrl: event.target.value })}
                        placeholder="URL imagen"
                      />
                      <select
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.categoryId}
                        onChange={(event) => patchCatalogItem(item.id, { categoryId: event.target.value })}
                      >
                        {profile.catalogCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.emoji || "•"} {category.name}
                          </option>
                        ))}
                      </select>
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.emoji || ""}
                        onChange={(event) => patchCatalogItem(item.id, { emoji: event.target.value })}
                        placeholder="Emoji"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.price}
                        onChange={(event) => patchCatalogItem(item.id, { price: event.target.value })}
                        placeholder="Precio"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.compareAtPrice || ""}
                        onChange={(event) => patchCatalogItem(item.id, { compareAtPrice: event.target.value })}
                        placeholder="Precio referencial"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.badge || ""}
                        onChange={(event) => patchCatalogItem(item.id, { badge: event.target.value })}
                        placeholder="Badge"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={item.description}
                        onChange={(event) => patchCatalogItem(item.id, { description: event.target.value })}
                        placeholder="Descripcion"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <h2 className="text-xl font-bold text-white mb-5">Ubicacion</h2>
              <div className="grid grid-cols-1 gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Direccion</span>
                  <textarea
                    rows={2}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none"
                    value={profile.location.address}
                    onChange={(event) => patchLocation("address", event.target.value)}
                    placeholder="Av. Principal 123, Ciudad"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Google Maps embed URL</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.mapEmbedUrl}
                    onChange={(event) => patchLocation("mapEmbedUrl", event.target.value)}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Google Maps URL</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.mapsUrl}
                    onChange={(event) => patchLocation("mapsUrl", event.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Horarios (uno por linea)</span>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white resize-none"
                    value={formatMultiline(profile.location.scheduleLines)}
                    onChange={(event) => patchLocation("scheduleLines", parseMultiline(event.target.value))}
                    placeholder="Lunes a Viernes: 10:00 am - 8:00 pm"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Texto boton mapa</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                    value={profile.location.ctaLabel}
                    onChange={(event) => patchLocation("ctaLabel", event.target.value)}
                    placeholder="Ir ahora"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">Tema visual deluxe</h2>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {Object.keys(LINK_HUB_THEME_STYLES).length} temas
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {(Object.keys(LINK_HUB_THEME_STYLES) as LinkHubTheme[]).map((themeKey) => {
                  const theme = LINK_HUB_THEME_STYLES[themeKey];
                  const active = profile.theme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => applyTheme(themeKey)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-amber-300/80 bg-amber-400/10"
                          : "border-white/10 bg-black/30 hover:border-white/20"
                      }`}
                    >
                      <div
                        className="h-12 rounded-xl"
                        style={{
                          background: `linear-gradient(115deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        }}
                      />
                      <p className="mt-3 text-sm font-bold text-white">{theme.label}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-400">{themeKey}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-zinc-300">
                  <Palette className="w-4 h-4" />
                  Personaliza colores (Primario + Secundario)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Color primario</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-11 w-14 rounded-xl border border-white/15 bg-zinc-900"
                        value={normalizeHexColor(profile.themePrimaryColor, activeTheme.preset.primary)}
                        onChange={(event) => patchProfile("themePrimaryColor", event.target.value)}
                      />
                      <input
                        className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={profile.themePrimaryColor || ""}
                        onChange={(event) => patchProfile("themePrimaryColor", event.target.value)}
                        onBlur={(event) =>
                          patchProfile(
                            "themePrimaryColor",
                            normalizeHexColor(event.target.value, activeTheme.preset.primary),
                          )
                        }
                        placeholder="#fbbf24"
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Color secundario</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="h-11 w-14 rounded-xl border border-white/15 bg-zinc-900"
                        value={normalizeHexColor(profile.themeSecondaryColor, activeTheme.preset.secondary)}
                        onChange={(event) => patchProfile("themeSecondaryColor", event.target.value)}
                      />
                      <input
                        className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={profile.themeSecondaryColor || ""}
                        onChange={(event) => patchProfile("themeSecondaryColor", event.target.value)}
                        onBlur={(event) =>
                          patchProfile(
                            "themeSecondaryColor",
                            normalizeHexColor(event.target.value, activeTheme.preset.secondary),
                          )
                        }
                        placeholder="#f97316"
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTheme(activeTheme.key)}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.13em] text-white"
                  >
                    Reset del tema
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const randomPrimary = randomColorHex();
                      const randomSecondary = randomColorHex();
                      setProfile((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          theme: "rgb",
                          themePrimaryColor: randomPrimary,
                          themeSecondaryColor: randomSecondary,
                        };
                      });
                    }}
                    className="rounded-xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.13em] text-fuchsia-100"
                  >
                    RGB aleatorio
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">Catalogo digital online (planes)</h2>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <input
                    type="checkbox"
                    checked={profile.pricing.enabled}
                    onChange={(event) => patchPricing("enabled", event.target.checked)}
                    className="h-4 w-4 rounded border border-white/20 bg-black"
                  />
                  Mostrar planes
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Titulo</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={profile.pricing.title}
                    onChange={(event) => patchPricing("title", event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Subtitulo</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={profile.pricing.subtitle}
                    onChange={(event) => patchPricing("subtitle", event.target.value)}
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold">Etiqueta seccion</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                    value={profile.sectionLabels.pricing}
                    onChange={(event) => patchSectionLabel("pricing", event.target.value)}
                    placeholder="Catalogo digital online"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {profile.pricing.plans.slice(0, 3).map((plan, index) => (
                  <article
                    key={plan.id}
                    className={`rounded-2xl border p-4 ${
                      plan.highlighted ? "border-amber-300/60 bg-amber-500/10" : "border-white/10 bg-black/30"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-300 font-bold">Plan {index + 1}</p>
                    <div className="mt-3 space-y-2">
                      <input
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={plan.title}
                        onChange={(event) => patchPlan(plan.id, { title: event.target.value })}
                        placeholder="Plan"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          className="rounded-xl border border-white/10 bg-zinc-900/80 px-2 py-2 text-sm text-white"
                          value={plan.currency}
                          onChange={(event) => patchPlan(plan.id, { currency: event.target.value })}
                          placeholder="S/."
                        />
                        <input
                          className="rounded-xl border border-white/10 bg-zinc-900/80 px-2 py-2 text-sm text-white"
                          value={plan.normalPrice}
                          onChange={(event) => patchPlan(plan.id, { normalPrice: event.target.value })}
                          placeholder="450"
                        />
                        <input
                          className="rounded-xl border border-white/10 bg-zinc-900/80 px-2 py-2 text-sm text-white"
                          value={plan.price}
                          onChange={(event) => patchPlan(plan.id, { price: event.target.value })}
                          placeholder="350"
                        />
                      </div>
                      <textarea
                        rows={4}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white resize-none"
                        value={formatMultiline(plan.features)}
                        onChange={(event) => patchPlan(plan.id, { features: parseMultiline(event.target.value) })}
                        placeholder="Una caracteristica por linea"
                      />
                      <input
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={plan.ctaLabel}
                        onChange={(event) => patchPlan(plan.id, { ctaLabel: event.target.value })}
                        placeholder="Mas detalles"
                      />
                      <input
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white"
                        value={plan.ctaUrl}
                        onChange={(event) => patchPlan(plan.id, { ctaUrl: event.target.value })}
                        placeholder="https://..."
                      />
                      <label className="inline-flex items-center gap-2 text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={Boolean(plan.highlighted)}
                          onChange={(event) => patchPlan(plan.id, { highlighted: event.target.checked })}
                        />
                        Destacar
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={() => saveProfile("draft")}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar borrador
              </button>
              <button
                onClick={() => saveProfile("publish")}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-100"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                Publicar Link Hub
              </button>
              <button
                onClick={copyPublicUrl}
                disabled={!publicUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-300/40 bg-sky-400/10 px-5 py-3 text-sm font-bold text-sky-100 disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                Copiar URL
              </button>
            </div>
          </section>

          <aside className="xl:sticky xl:top-28 h-fit">
            <div className="rounded-[2rem] border p-5" style={previewShellStyle}>
              <div
                className={`rounded-[1.75rem] border ${activeTheme.preset.surface} p-5 backdrop-blur-xl`}
                style={previewPanelStyle}
              >
                <p className={`text-[10px] uppercase tracking-[0.25em] font-black ${activeTheme.preset.muted}`}>
                  Preview Mobile
                </p>

                <div className="mt-4 flex flex-col items-center text-center">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="h-24 w-24 rounded-full border object-cover"
                      style={{ borderColor: hexToRgba(activeTheme.primary, 0.55) }}
                    />
                  ) : (
                    <div
                      className="h-24 w-24 rounded-full border flex items-center justify-center text-3xl font-black text-white"
                      style={{
                        borderColor: hexToRgba(activeTheme.primary, 0.55),
                        background: `linear-gradient(130deg, ${hexToRgba(activeTheme.primary, 0.32)} 0%, ${hexToRgba(activeTheme.secondary, 0.28)} 100%)`,
                      }}
                    >
                      <ImagePlus className="h-8 w-8" />
                    </div>
                  )}

                  <h3 className="mt-4 text-2xl font-black text-white">{profile.displayName || "Tu nombre"}</h3>
                  <p className={`mt-2 text-sm ${activeTheme.preset.muted}`}>
                    {profile.bio || "Tu descripcion corta aparecera aqui."}
                  </p>
                  <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${activeTheme.preset.accent}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {profile.published ? "Publicado" : "Borrador"}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {profile.links.map((link) => {
                    const Icon = LINK_TYPE_ICON[link.type];
                    return (
                      <div
                        key={link.id}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${activeTheme.preset.button}`}
                        style={previewButtonStyle}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span className="font-semibold text-sm">
                            {link.title || "Nuevo enlace"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {publicUrl && (
                  <div className={`mt-6 rounded-xl border border-white/15 bg-black/30 p-3 text-xs ${activeTheme.preset.muted}`}>
                    <p className="font-bold text-white">URL publica</p>
                    <p className="mt-1 break-all">{publicUrl}</p>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 font-semibold"
                      style={{ color: activeTheme.primary }}
                    >
                      Abrir pagina
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
