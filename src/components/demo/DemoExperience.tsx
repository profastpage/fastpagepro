"use client";

import { useEffect, useMemo, useState } from "react";
import ThemePicker from "@/components/demo/ThemePicker";
import StickyCTA from "@/components/demo/StickyCTA";
import RestaurantDemo from "@/components/demo/RestaurantDemo";
import EcommerceDemo from "@/components/demo/EcommerceDemo";
import ServicesDemo from "@/components/demo/ServicesDemo";
import type { DemoData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import { persistVerticalChoice } from "@/lib/vertical";
import { resolveThemeById, themeToCssVars } from "@/lib/themes";

export default function DemoExperience({ demo }: { demo: DemoData }) {
  const [themeId, setThemeId] = useState(demo.themeId);

  useEffect(() => {
    persistVerticalChoice(demo.vertical);
    setThemeId(demo.themeId);
  }, [demo.themeId, demo.vertical]);

  useEffect(() => {
    void trackGrowthEvent("view_demo", {
      vertical: demo.vertical,
      slug: demo.slug,
      mode: demo.mode || "demo",
    });
  }, [demo.mode, demo.slug, demo.vertical]);

  const activeTheme = useMemo(
    () => resolveThemeById(demo.vertical, themeId),
    [demo.vertical, themeId],
  );

  return (
    <main
      style={themeToCssVars(activeTheme)}
      className="min-h-screen bg-[var(--fp-bg)] px-4 pb-28 pt-24 text-[var(--fp-text)] md:px-6 md:pt-28 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fp-muted)]">
              Demo {demo.mode === "real" ? "real" : "preview"} / {demo.vertical}
            </p>
            <h1 className="mt-2 text-2xl font-black md:text-4xl">{demo.title}</h1>
            <p className="mt-2 text-sm text-[var(--fp-muted)] md:text-base">{demo.subtitle}</p>
          </div>
          {demo.vertical === "restaurant" ? <RestaurantDemo demo={demo} /> : null}
          {demo.vertical === "ecommerce" ? <EcommerceDemo demo={demo} /> : null}
          {demo.vertical === "services" ? <ServicesDemo demo={demo} /> : null}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ThemePicker vertical={demo.vertical} value={themeId} onChange={setThemeId} />
          <section className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-sm font-bold text-white">Modo de demo</p>
            <p className="mt-2 text-xs text-zinc-300">
              mode=demo usa JSON mock. mode=real esta preparado para integrar slug del cliente.
            </p>
            <button
              type="button"
              onClick={() =>
                void trackGrowthEvent("click_demo_open", {
                  vertical: demo.vertical,
                  slug: demo.slug,
                  mode: demo.mode || "demo",
                })
              }
              className="mt-3 w-full rounded-xl border border-amber-300/35 bg-amber-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-200"
            >
              Tracking demo activo
            </button>
          </section>
        </aside>
      </div>
      <StickyCTA vertical={demo.vertical} slug={demo.slug} />
    </main>
  );
}
