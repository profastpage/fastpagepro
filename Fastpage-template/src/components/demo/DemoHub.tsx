"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DemoCard from "@/components/demo/DemoCard";
import VerticalSelector from "@/components/demo/VerticalSelector";
import { DEMO_CATALOG } from "@/lib/demoCatalog";
import { persistUtmFromUrl, trackGrowthEvent } from "@/lib/analytics";
import { navigateBackWithFallback } from "@/lib/navigation";
import {
  BUSINESS_VERTICALS,
  getVerticalCopy,
  normalizeVertical,
  persistVerticalChoice,
  verticalToSignupHref,
  type BusinessVertical,
} from "@/lib/vertical";

type DemoHubProps = {
  defaultVertical?: BusinessVertical;
};

const DEMO_VERTICAL_HISTORY_KEY = "fp_demo_vertical_history";

function readVerticalHistoryFromSession(): BusinessVertical[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(DEMO_VERTICAL_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeVertical(entry))
      .filter((entry): entry is BusinessVertical => BUSINESS_VERTICALS.includes(entry));
  } catch {
    return [];
  }
}

function writeVerticalHistoryToSession(values: BusinessVertical[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DEMO_VERTICAL_HISTORY_KEY, JSON.stringify(values.slice(-12)));
  } catch {
    // ignore sessionStorage restrictions
  }
}

export default function DemoHub({ defaultVertical = "restaurant" }: DemoHubProps) {
  const [vertical, setVertical] = useState<BusinessVertical>(defaultVertical);

  const syncVerticalInUrl = (nextVertical: BusinessVertical) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("vertical", nextVertical);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}?${url.searchParams.toString()}${url.hash}`,
    );
  };

  const registerVerticalInHistory = (nextVertical: BusinessVertical) => {
    const current = readVerticalHistoryFromSession();
    if (current[current.length - 1] === nextVertical) return;
    writeVerticalHistoryToSession([...current, nextVertical]);
  };

  const applyVertical = (nextVertical: BusinessVertical) => {
    setVertical(nextVertical);
    persistVerticalChoice(nextVertical);
    syncVerticalInUrl(nextVertical);
    registerVerticalInHistory(nextVertical);
  };

  const resolvePreviousVertical = (currentVertical: BusinessVertical): BusinessVertical | null => {
    const stack = readVerticalHistoryFromSession();
    if (stack.length === 0) return null;
    const nextStack = [...stack];
    if (nextStack[nextStack.length - 1] === currentVertical) {
      nextStack.pop();
    }
    const previous = nextStack[nextStack.length - 1] || null;
    writeVerticalHistoryToSession(nextStack);
    return previous;
  };

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    persistUtmFromUrl(params || undefined);
    const fromQuery = normalizeVertical(params?.get("vertical") || defaultVertical);
    applyVertical(fromQuery);
    void trackGrowthEvent("page_view", {
      page: "demo_hub",
      vertical: fromQuery,
    });
  }, [defaultVertical]);

  const copy = getVerticalCopy(vertical);
  const items = useMemo(
    () => DEMO_CATALOG.filter((item) => item.vertical === vertical),
    [vertical],
  );
  const handleBackClick = () => {
    const previousVertical = resolvePreviousVertical(vertical);
    if (previousVertical && previousVertical !== vertical) {
      setVertical(previousVertical);
      persistVerticalChoice(previousVertical);
      syncVerticalInUrl(previousVertical);
      void trackGrowthEvent("view_demo", {
        vertical: previousVertical,
        slug: "hub_back_tab",
      });
      return;
    }
    navigateBackWithFallback("/");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-24 sm:px-6 md:pt-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl">
        <section className="rounded-3xl border border-white/10 bg-black/50 p-6 md:p-8">
          <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Demo sin registro
          </p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">
            Mira FastPage funcionando para tu negocio en menos de 1 minuto
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-300">
            {copy.headline}. {copy.subheadline}
          </p>
          <div className="mt-5">
            <VerticalSelector
              value={vertical}
              onChange={(nextVertical) => {
                applyVertical(nextVertical);
                void trackGrowthEvent("view_demo", {
                  vertical: nextVertical,
                  slug: "hub",
                });
              }}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBackClick}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Retroceder
            </button>
            <Link
              href={verticalToSignupHref(vertical)}
              onClick={() =>
                void trackGrowthEvent("start_signup", {
                  vertical,
                  location: "demo_hub",
                })
              }
              className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
            >
              Crear mi version gratis
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white md:text-3xl">
              Demos de {copy.label}
            </h2>
            <span className="text-sm text-zinc-400">{items.length} demos listas</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <DemoCard
                key={`${item.vertical}-${item.slug}`}
                item={item}
                onOpen={(v, slug) =>
                  void trackGrowthEvent("click_demo_open", {
                    vertical: v,
                    slug,
                  })
                }
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
