"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { db } from "@/lib/firebase";
import { collection, doc as firestoreDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  FolderOpen,
  LayoutGrid,
  Link2,
  Loader2,
  Rocket,
  Store,
} from "lucide-react";

type PublishedKind = "site" | "linkhub";

type PublishedProject = {
  id: string;
  kind: PublishedKind;
  title: string;
  subtitle: string;
  sourceLabel: string;
  publishedAt: number;
  publishedUrl: string;
  editPath: string;
  source?: string;
};

function formatDate(value: number) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}

function normalizeSourceLabel(source?: string) {
  if (source === "store-builder") return "Online Store";
  if (source === "builder") return "Builder";
  return "Cloner / Editor";
}

function PublishedProjectsContent() {
  const { user, loading } = useAuth(true);
  const { summary: subscriptionSummary } = useSubscription(Boolean(user?.uid));
  const permissions = usePlanPermissions(Boolean(user?.uid));
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const filter = searchParams.get("kind") || "all";

  const [items, setItems] = useState<PublishedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPublishedProjects() {
      if (!user?.uid) return;
      setIsLoading(true);
      setError(null);

      try {
        const sitesQuery = query(
          collection(db, "cloned_sites"),
          where("userId", "==", user.uid),
        );
        const sitesSnapshot = await getDocs(sitesQuery);
        const siteItems: PublishedProject[] = sitesSnapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as any;
            if (!data?.published) return null;
            const id = String(data.id || docSnap.id);
            const source = String(data.source || "");
            const title =
              String(
                data.templateName ||
                  data.storeConfig?.storeName ||
                  data.name ||
                  data.url ||
                  `Proyecto ${id}`,
              ) || `Proyecto ${id}`;
            const subtitle =
              source === "store-builder"
                ? "Tienda online publicada"
                : source === "builder"
                  ? "Landing creada en Builder"
                  : "Proyecto clonado/editado";

            return {
              id,
              kind: "site" as const,
              title,
              subtitle,
              sourceLabel: normalizeSourceLabel(source),
              publishedAt: Number(data.publishedAt || data.updatedAt || data.createdAt || 0),
              publishedUrl:
                source === "store-builder"
                  ? `/t/${String(data.storeSlug || id)}`
                  : `/preview/${id}`,
              editPath: source === "store-builder" ? "/store" : source === "builder" ? "/builder" : `/editor/${id}`,
              source,
            };
          })
          .filter(Boolean) as PublishedProject[];

        const linkHubSnapshot = await getDoc(firestoreDoc(db, "link_profiles", user.uid));
        const linkHubItems: PublishedProject[] = [];
        if (linkHubSnapshot.exists()) {
          const data = linkHubSnapshot.data() as any;
          if (data?.published && data?.slug) {
            linkHubItems.push({
              id: `linkhub-${user.uid}`,
              kind: "linkhub",
              title: String(data.displayName || "Carta Digital"),
              subtitle: `@${String(data.slug)}`,
              sourceLabel: "Carta Digital",
              publishedAt: Number(data.publishedAt || data.updatedAt || data.createdAt || 0),
              publishedUrl: `/bio/${String(data.slug)}`,
              editPath: "/cartadigital",
            });
          }
        }

        const merged = [...linkHubItems, ...siteItems].sort(
          (a, b) => b.publishedAt - a.publishedAt,
        );

        if (active) {
          setItems(merged);
        }
      } catch (err: any) {
        console.error("[Published] Error loading projects:", err);
        if (active) {
          setError("No se pudo cargar la seccion de publicados.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    if (!loading && user?.uid) {
      loadPublishedProjects();
    }

    return () => {
      active = false;
    };
  }, [loading, user?.uid]);

  const filteredItems = useMemo(() => {
    if (filter === "linkhub") return items.filter((item) => item.kind === "linkhub");
    if (filter === "site") return items.filter((item) => item.kind === "site");
    return items;
  }, [items, filter]);

  const counters = useMemo(() => {
    const linkhub = items.filter((item) => item.kind === "linkhub").length;
    const site = items.filter((item) => item.kind === "site").length;
    return {
      total: items.length,
      linkhub,
      site,
    };
  }, [items]);
  const publishedLimitLabel =
    permissions.maxProjects == null
      ? `${permissions.usage.publishedProjects}`
      : `${permissions.usage.publishedProjects}/${permissions.maxProjects}`;
  const availableProjectsLabel =
    permissions.maxProjects == null
      ? "Ilimitado"
      : `${Math.max(permissions.maxProjects - permissions.usage.publishedProjects, 0)} disponibles`;
  const daysRemaining = Math.max(0, Number(subscriptionSummary?.daysRemaining || 0));

  async function copyUrl(url: string, id: string) {
    const absolute = /^https?:\/\//.test(url) ? url : `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(absolute);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  function openEditor(item: PublishedProject) {
    if (item.source === "store-builder") {
      localStorage.setItem("fastpage_store_project_id", item.id);
      router.push(item.editPath);
      return;
    }
    if (item.source === "builder") {
      localStorage.setItem("fastpage_builder_project_id", item.id);
      router.push(item.editPath);
      return;
    }
    router.push(item.editPath);
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),rgba(2,6,23,0.92)_45%,rgba(2,6,23,0.98)_100%)] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300 font-black">
                Dashboard Deluxe Pro
              </p>
              <h1 className="mt-2 text-3xl md:text-5xl font-black text-white">
                Proyectos Publicados
              </h1>
              <p className="mt-3 text-zinc-300 max-w-3xl">
                Centro unificado para todas tus publicaciones: Carta Digital, landings y tiendas.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
                  Proyectos en plan: {publishedLimitLabel}
                </span>
                <span className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Cupo: {availableProjectsLabel}
                </span>
                <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                  Dias restantes: {daysRemaining}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                <p className="text-xl font-black text-white">{counters.total}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Total</p>
              </div>
              <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 px-4 py-3 text-center">
                <p className="text-xl font-black text-sky-100">{counters.linkhub}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-sky-200/80">Carta Digital</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-center">
                <p className="text-xl font-black text-emerald-100">{counters.site}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/80">Paginas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap gap-2">
          <a
            href="/published"
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] border transition-all ${
              filter === "all"
                ? "border-amber-300/70 bg-amber-400/15 text-amber-100"
                : "border-white/15 bg-white/[0.03] text-zinc-300 hover:text-white"
            }`}
          >
            Todos
          </a>
          <a
            href="/published?kind=site"
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] border transition-all ${
              filter === "site"
                ? "border-emerald-300/70 bg-emerald-400/15 text-emerald-100"
                : "border-white/15 bg-white/[0.03] text-zinc-300 hover:text-white"
            }`}
          >
            Paginas
          </a>
          <a
            href="/published?kind=linkhub"
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] border transition-all ${
              filter === "linkhub"
                ? "border-sky-300/70 bg-sky-400/15 text-sky-100"
                : "border-white/15 bg-white/[0.03] text-zinc-300 hover:text-white"
            }`}
          >
            Carta Digital
          </a>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100 font-semibold">
            {error}
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <Rocket className="w-10 h-10 text-amber-300 mx-auto" />
            <h2 className="mt-4 text-2xl font-black text-white">Aun no tienes publicaciones</h2>
            <p className="mt-2 text-zinc-400">
              Publica un proyecto desde Builder, Cloner, Store o Carta Digital para verlo aqui.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredItems.map((item) => {
              const isHighlighted = highlight === item.id;
              const liveUrl = /^https?:\/\//.test(item.publishedUrl)
                ? item.publishedUrl
                : `${origin}${item.publishedUrl}`;

              return (
                <article
                  key={item.id}
                  className={`rounded-3xl border p-5 md:p-6 bg-zinc-950/70 transition-all ${
                    isHighlighted
                      ? "border-amber-300/70 shadow-[0_0_30px_rgba(251,191,36,0.25)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-300">
                        {item.kind === "linkhub" ? <Link2 className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                        {item.sourceLabel}
                      </div>
                      <h3 className="mt-3 text-2xl font-black text-white truncate">{item.title}</h3>
                      <p className="mt-1 text-zinc-400">{item.subtitle}</p>
                    </div>
                    {isHighlighted && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 border border-amber-300/50 px-3 py-1 text-amber-100 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recien publicado
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                      <p className="text-zinc-500 uppercase tracking-[0.15em] font-bold">Publicado</p>
                      <p className="text-zinc-200 mt-1">{formatDate(item.publishedAt)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                      <p className="text-zinc-500 uppercase tracking-[0.15em] font-bold">ID</p>
                      <p className="text-zinc-200 mt-1 truncate">{item.id}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver en vivo
                    </a>
                    <button
                      onClick={() => copyUrl(item.publishedUrl, item.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-sky-300/40 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-100"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === item.id ? "Copiado" : "Copiar URL"}
                    </button>
                    <button
                      onClick={() => openEditor(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white"
                    >
                      {item.kind === "linkhub" ? <LayoutGrid className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5" />}
                      Editar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PublishedProjectsFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
    </div>
  );
}

export default function PublishedProjectsPage() {
  return (
    <Suspense fallback={<PublishedProjectsFallback />}>
      <PublishedProjectsContent />
    </Suspense>
  );
}
