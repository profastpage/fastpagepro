"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPublishedLinkHubProfileBySlug,
  LINK_HUB_THEME_STYLES,
  LinkHubLinkType,
  LinkHubProfile,
  sanitizeSlug,
} from "@/lib/linkHubProfile";
import {
  AtSign,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  MessageCircle,
  Music2,
  Youtube,
} from "lucide-react";

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

export default function PublicBioPage() {
  const params = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<LinkHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
        <Loader2 className="w-10 h-10 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">Link Hub</p>
          <h1 className="mt-3 text-3xl font-black">Perfil no disponible</h1>
          <p className="mt-3 text-zinc-400">
            Este enlace no existe o aun no fue publicado.
          </p>
        </div>
      </div>
    );
  }

  const theme = LINK_HUB_THEME_STYLES[profile.theme];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.background} px-4 py-10`}>
      <div className={`mx-auto max-w-xl rounded-[2.25rem] border ${theme.surface} p-6 sm:p-8 backdrop-blur-xl`}>
        <div className="flex flex-col items-center text-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="h-28 w-28 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="h-28 w-28 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-4xl font-black text-white">
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
          )}

          <h1 className="mt-4 text-3xl font-black text-white">{profile.displayName}</h1>
          <p className={`mt-2 text-sm sm:text-base ${theme.muted}`}>
            {profile.bio}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {profile.links.map((link) => {
            const Icon = LINK_TYPE_ICON[link.type];
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`block w-full rounded-2xl border px-4 py-4 transition-all ${theme.button}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{link.title}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </span>
              </a>
            );
          })}
        </div>

        <p className={`mt-8 text-center text-xs ${theme.muted}`}>
          Powered by Fast Page
        </p>
      </div>
    </div>
  );
}
