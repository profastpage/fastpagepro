"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ThemePicker from "@/components/demo/ThemePicker";
import StickyCTA from "@/components/demo/StickyCTA";
import RestaurantDemo from "@/components/demo/RestaurantDemo";
import EcommerceDemo from "@/components/demo/EcommerceDemo";
import ServicesDemo from "@/components/demo/ServicesDemo";
import type { DemoData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import { navigateBackWithFallback } from "@/lib/navigation";
import {
  persistVerticalChoice,
  verticalToCreateHref,
  verticalToSignupHref,
} from "@/lib/vertical";
import { resolveThemeById, themeToCssVars } from "@/lib/themes";
import { useLanguage } from "@/context/LanguageContext";
import { localizeDynamicText } from "@/lib/autoI18n";
import DemoReveal from "@/components/demo/DemoReveal";

export default function DemoExperience({ demo }: { demo: DemoData }) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isEn = language === "en";
  const tx = (es: string, en: string) => (isEn ? en : es);
  const td = (value: string) => localizeDynamicText(value, language);
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
  const createHref = user
    ? verticalToCreateHref(demo.vertical, { demoSlug: demo.slug, demoTheme: themeId })
    : verticalToSignupHref(demo.vertical, { demoSlug: demo.slug, demoTheme: themeId });

  const handleBackClick = () => {
    navigateBackWithFallback(`/demo?vertical=${demo.vertical}`);
  };

  if (demo.vertical === "restaurant") {
    return (
      <main
        style={themeToCssVars(activeTheme)}
        className="min-h-screen bg-[var(--fp-bg)] px-3 pb-28 pt-16 text-[var(--fp-text)] md:px-6 md:pt-20 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.08em]"
            >
              {"\u2190"} {tx("Retroceder", "Back")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.08em]"
            >
              {"\u2190"} {tx("Volver al inicio", "Back to home")}
            </Link>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.08em]"
              aria-label={tx("Cambiar idioma", "Change language")}
            >
              {language === "en" ? "ES" : "EN"}
            </button>
            <Link
              href={createHref}
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 px-3 py-2 text-center text-xs font-black uppercase tracking-[0.08em] text-amber-100 sm:col-span-2"
            >
              {tx("Crear mi version gratis", "Create my free version")}
            </Link>
          </div>
          <RestaurantDemo demo={demo} />
        </div>
      </main>
    );
  }

  return (
    <main
      style={themeToCssVars(activeTheme)}
      className="min-h-screen overflow-x-hidden bg-[var(--fp-bg)] px-3 pb-28 pt-20 text-[var(--fp-text)] md:px-6 md:pt-28 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 space-y-4">
          <div className="fp-demo-panel grid gap-2 p-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5"
            >
              {"\u2190"} {tx("Retroceder", "Back")}
            </button>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 sm:justify-start"
            >
              {"\u2190"} {tx("Volver al inicio", "Back to home")}
            </Link>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5"
              aria-label={tx("Cambiar idioma", "Change language")}
            >
              {language === "en" ? "ES" : "EN"}
            </button>
            <Link
              href={createHref}
              className="fp-demo-button-primary inline-flex w-full items-center justify-center gap-2 px-3 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-white sm:justify-end"
            >
              {tx("Crear mi version gratis", "Create my free version")}
            </Link>
          </div>
          <DemoReveal delay={0.03}>
          <div className="fp-demo-panel px-4 py-5 md:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fp-muted)]">
              {tx("Demo", "Demo")} {demo.mode === "real" ? tx("real", "real") : tx("preview", "preview")} / {td(demo.vertical)}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">{td(demo.title)}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--fp-muted)] md:text-base">
              {td(demo.subtitle)}
            </p>
          </div>
          </DemoReveal>
          {demo.vertical === "ecommerce" ? <EcommerceDemo demo={demo} /> : null}
          {demo.vertical === "services" ? <ServicesDemo demo={demo} /> : null}
        </section>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ThemePicker vertical={demo.vertical} value={themeId} onChange={setThemeId} />
          <section className="fp-demo-panel p-4">
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
              className="mt-3 w-full rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-amber-200 transition duration-300 hover:-translate-y-0.5"
            >
              Tracking demo activo
            </button>
          </section>
        </aside>
      </div>
      <StickyCTA vertical={demo.vertical} slug={demo.slug} demoTheme={themeId} />
    </main>
  );
}
