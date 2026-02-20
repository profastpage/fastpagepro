"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  buildDefaultLinkHubProfile,
  getLinkHubProfileByUserId,
  isLinkHubSlugAvailable,
  isValidExternalUrl,
  LINK_HUB_THEME_STYLES,
  LinkHubLink,
  LinkHubLinkType,
  LinkHubProfile,
  normalizeLinkUrl,
  sanitizeSlug,
  saveLinkHubProfileForUser,
  MAX_LINK_HUB_LINKS,
} from "@/lib/linkHubProfile";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  MoveDown,
  MoveUp,
  Music2,
  Plus,
  Save,
  Trash2,
  Youtube,
  Facebook,
  MessageCircle,
  AtSign,
  Rocket,
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

export default function LinkHubPage() {
  const { user, loading } = useAuth(true);
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [origin, setOrigin] = useState("");
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
          setProfile({
            ...buildDefaultLinkHubProfile(user),
            ...stored,
            userId: user.uid,
            links: Array.isArray(stored.links) && stored.links.length > 0 ? stored.links : [createEmptyLink()],
          });
          return;
        }

        setProfile(buildDefaultLinkHubProfile(user));
      } catch (error) {
        console.error("[LinkHub] Failed loading profile:", error);
        setMessage({ type: "error", text: "No se pudo cargar tu Link Hub. Intenta de nuevo." });
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

  const currentTheme = profile ? LINK_HUB_THEME_STYLES[profile.theme] : LINK_HUB_THEME_STYLES.midnight;

  function patchProfile<K extends keyof LinkHubProfile>(field: K, value: LinkHubProfile[K]) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
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

    setIsSaving(true);
    setMessage(null);

    try {
      const available = await isLinkHubSlugAvailable(sanitizedSlug, user.uid);
      if (!available) {
        setMessage({ type: "error", text: "Ese slug ya esta en uso. Elige uno diferente." });
        return;
      }

      const now = Date.now();
      const nextProfile: LinkHubProfile = {
        ...profile,
        userId: user.uid,
        slug: sanitizedSlug,
        displayName: profile.displayName.trim(),
        bio: profile.bio.trim(),
        avatarUrl: profile.avatarUrl.trim(),
        links: preparedLinks.length > 0 ? preparedLinks : [createEmptyLink()],
        published: mode === "publish",
        updatedAt: now,
        createdAt: profile.createdAt || now,
      };

      await saveLinkHubProfileForUser(user.uid, nextProfile);
      setProfile(nextProfile);
      setMessage({
        type: "success",
        text:
          mode === "publish"
            ? "Link Hub publicado. Ya puedes compartir tu URL."
            : "Borrador guardado correctamente.",
      });
    } catch (error) {
      console.error("[LinkHub] Save error:", error);
      setMessage({ type: "error", text: "No se pudo guardar. Revisa permisos de Firestore." });
    } finally {
      setIsSaving(false);
    }
  }

  if (loading || isLoadingProfile || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 pt-24 md:pt-28 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Link Hub</h1>
          <p className="mt-2 text-zinc-400 max-w-3xl">
            Crea una landing de enlaces estilo Linktree para compartir todas tus redes, productos y canales en
            una sola URL profesional.
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
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Foto de perfil (URL)</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    value={profile.avatarUrl}
                    onChange={(event) => patchProfile("avatarUrl", event.target.value)}
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
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-7">
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
              <h2 className="text-xl font-bold text-white mb-5">Tema visual</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(LINK_HUB_THEME_STYLES) as Array<keyof typeof LINK_HUB_THEME_STYLES>).map(
                  (themeKey) => {
                    const theme = LINK_HUB_THEME_STYLES[themeKey];
                    const active = profile.theme === themeKey;

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => patchProfile("theme", themeKey)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? "border-amber-300/80 bg-amber-400/10"
                            : "border-white/10 bg-black/30 hover:border-white/20"
                        }`}
                      >
                        <div className={`h-12 rounded-xl bg-gradient-to-r ${theme.background}`} />
                        <p className="mt-3 text-sm font-bold text-white">{theme.label}</p>
                      </button>
                    );
                  },
                )}
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
            <div className={`rounded-[2rem] border p-5 bg-gradient-to-b ${currentTheme.background}`}>
              <div className={`rounded-[1.75rem] border ${currentTheme.surface} p-5 backdrop-blur-xl`}>
                <p className={`text-[10px] uppercase tracking-[0.25em] font-black ${currentTheme.muted}`}>
                  Preview Mobile
                </p>

                <div className="mt-4 flex flex-col items-center text-center">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="h-24 w-24 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-3xl font-black text-white">
                      {profile.displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <h3 className="mt-4 text-2xl font-black text-white">{profile.displayName || "Tu nombre"}</h3>
                  <p className={`mt-2 text-sm ${currentTheme.muted}`}>
                    {profile.bio || "Tu descripcion corta aparecera aqui."}
                  </p>
                  <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${currentTheme.accent}`}>
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
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${currentTheme.button}`}
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
                  <div className={`mt-6 rounded-xl border border-white/15 bg-black/30 p-3 text-xs ${currentTheme.muted}`}>
                    <p className="font-bold text-white">URL publica</p>
                    <p className="mt-1 break-all">{publicUrl}</p>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-amber-300 font-semibold"
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
