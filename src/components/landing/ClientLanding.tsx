"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import {
  INDUSTRIES,
  PORTFOLIO_ITEMS,
  PortfolioItem,
  PortfolioPreview,
  PROCESS_STEPS,
} from "@/components/landing/landingData";

export default function ClientLanding() {
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const modalScreenshots = useMemo(() => activeProject?.screenshots ?? [], [activeProject]);
  const handleOpen = (project: PortfolioItem) => setActiveProject(project);
  const handleClose = () => setActiveProject(null);

  return (
    <main className="relative overflow-x-hidden bg-[#0b0b0c] text-white">
      <section className="hero-landing relative z-10 min-h-[90vh] w-full pt-[90px]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#c9a227] sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#c9a227]" />
              FastPagePro
            </div>
            <h1 className="hero-title mt-6 max-w-4xl text-white">
              Sistemas web premium para negocios que venden en serio
            </h1>
            <p className="hero-subtitle mt-6 text-white/80">
              FastPagePro organiza la oferta principal de la marca y separa cada vertical comercial en su propia landing para escalar conversion de forma limpia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/restaurantes"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/60 bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#0B0B0B] transition hover:bg-[#1fba59]"
              >
                Ver landing restaurantes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                Ver demos
              </Link>
              <Link
                href="/auth?tab=login"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                Acceder al panel
              </Link>
            </div>
            <ul className="mt-10 space-y-3 text-white/80">
              <li className="text-[18px]">Diseno profesional</li>
              <li className="text-[18px]">Optimizado para celular</li>
              <li className="text-[18px]">Integracion con WhatsApp</li>
              <li className="text-[18px]">Activacion rapida</li>
            </ul>
          </div>

          <div className="hero-mockup mx-auto w-full max-w-[540px]">
            <div className="rounded-[14px] border border-white/12 bg-black/35 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c9a227]">
                Arquitectura comercial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
                Una marca principal, varias landings por vertical
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-300">
                La homepage presenta FastPagePro como sistema web premium. Cada sector vive en una ruta propia para claridad de conversion y mensaje.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-200">
                <li>Arquitectura modular para cada vertical.</li>
                <li>Narrativa visual premium con foco comercial.</li>
                <li>Velocidad y mensajeria directa con WhatsApp.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 rounded-[32px] border border-white/8 bg-white/[0.02] px-6 py-10 backdrop-blur-sm sm:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Soluciones web para negocios modernos
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center justify-items-center gap-10">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.label}
                  className="industry-mark group flex min-w-0 flex-col items-center gap-3 text-center text-white/70"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium tracking-[0.02em]">{industry.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Portfolio
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Ejemplos de sistemas web
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Paginas web modernas creadas para negocios reales.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
            {PORTFOLIO_ITEMS.map((item) => (
              <article key={item.name} className="portfolio-card">
                <PortfolioPreview
                  accent={item.accent}
                  surface={item.surface}
                  businessType={item.businessType}
                  metrics={item.metrics}
                />
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{item.name}</h3>
                      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-zinc-500">
                        {item.businessType}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpen(item)}
                    className="mt-8 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Ver demo
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
              Proceso
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Como creamos tu sistema web
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.step}
                  className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0f0f10] p-[30px]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#c9a227]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {activeProject ? (
        <div className="portfolio-modal" role="dialog" aria-modal="true">
          <div className="portfolio-modal__layer" onClick={handleClose} />
          <div className="portfolio-modal__panel">
            <header className="portfolio-modal__header">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                  Portfolio
                </p>
                <h3 className="text-3xl font-semibold text-white">{activeProject.name}</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
              >
                Cerrar
              </button>
            </header>
            <p className="mt-4 text-sm text-zinc-300">{activeProject.businessType}</p>
            <div className="portfolio-modal__grid">
              {modalScreenshots.map((screenshot) => (
                <div
                  key={`${activeProject.name}-${screenshot.label}`}
                  className={`portfolio-screenshot portfolio-screenshot--${screenshot.variant}`}
                >
                  <span className="portfolio-screenshot__label">{screenshot.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-300">
              {activeProject.metrics.map((metric) => (
                <p key={metric} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#c9a227]" />
                  {metric}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={activeProject.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Ver sitio completo
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400 underline-offset-4 hover:text-white"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </main>
  );
}
