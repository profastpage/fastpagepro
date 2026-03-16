"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import { buildWhatsappSendUrl } from "@/lib/whatsapp";
import {
  AUTHORITY_ITEMS,
  INDUSTRIES,
  PORTFOLIO_ITEMS,
  PortfolioItem,
  PortfolioPreview,
  PROCESS_STEPS,
  RESULT_ITEMS,
} from "@/components/landing/landingData";

const HERO_SLIDES = [
  {
    src: "/Hero/HERO-1.png",
    alt: "Laptop con sistema web premium de reservas",
    desktopPosition: "center center",
    mobilePosition: "58% center",
  },
  {
    src: "/Hero/HERO-2.jpg",
    alt: "Flujo de reservas por WhatsApp en mobile y dashboard",
    desktopPosition: "center center",
    mobilePosition: "64% center",
  },
  {
    src: "/Hero/HERO-3.jpg",
    alt: "Sistema hotelero premium en laptop y mobile",
    desktopPosition: "center center",
    mobilePosition: "40% center",
  },
] as const;

export default function ClientLanding() {
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const modalScreenshots = useMemo(() => activeProject?.screenshots ?? [], [activeProject]);
  const heroScreens = useMemo(() => {
    const screens = PORTFOLIO_ITEMS[0]?.screenshots ?? [];
    const desktop =
      screens.find(
        (screen) =>
          screen.variant === "desktop" &&
          !screen.label.toLowerCase().includes("completa"),
      ) ?? screens.find((screen) => screen.variant === "desktop");
    const mobile =
      screens.find(
        (screen) =>
          screen.variant === "mobile" &&
          !screen.label.toLowerCase().includes("completa"),
      ) ?? screens.find((screen) => screen.variant === "mobile");

    return [desktop, mobile].filter(
      (
        screen,
      ): screen is (typeof PORTFOLIO_ITEMS)[number]["screenshots"][number] => Boolean(screen),
    );
  }, []);
  const whatsappHref = useMemo(
    () =>
      buildWhatsappSendUrl(
        "51919662011",
        "Hola, quiero solicitar un sistema web premium para generar reservas, consultas y ventas por WhatsApp.",
      ),
    [],
  );

  const handleOpen = (project: PortfolioItem) => setActiveProject(project);
  const handleClose = () => setActiveProject(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main className="fp-landing-shell relative overflow-x-hidden bg-[#0b0b0c] text-white">
      <section className="hero-landing relative z-10 min-h-[100svh] w-full pt-[90px] md:min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === heroIndex;

            return (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <div className="absolute inset-0 md:hidden">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    quality={92}
                    sizes="100vw"
                    className={`object-cover transition-transform duration-[4000ms] ease-linear ${
                      isActive ? "scale-100" : "scale-[1.04]"
                    }`}
                    style={{ objectPosition: slide.mobilePosition }}
                  />
                </div>
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    quality={94}
                    sizes="100vw"
                    className={`object-cover transition-transform duration-[4000ms] ease-linear ${
                      isActive ? "scale-100" : "scale-[1.03]"
                    }`}
                    style={{ objectPosition: slide.desktopPosition }}
                  />
                </div>
              </div>
            );
          })}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,7,0.94)_0%,rgba(6,6,7,0.78)_34%,rgba(6,6,7,0.3)_58%,rgba(6,6,7,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,0.12)_0%,rgba(6,6,7,0.36)_100%)] md:bg-[radial-gradient(circle_at_20%_44%,rgba(0,0,0,0.18),transparent_28%),linear-gradient(180deg,rgba(6,6,7,0.18)_0%,rgba(6,6,7,0.3)_100%)]" />
        </div>

        <div className="fp-container relative z-10 flex min-h-[calc(100svh-90px)] items-center py-14 sm:py-20 lg:min-h-[calc(100vh-90px)] lg:py-24">
          <div className="max-w-[44rem]">
            <h1 className="hero-title max-w-5xl text-white">
              Sistemas web que convierten visitas en reservas por WhatsApp
            </h1>
            <p className="hero-subtitle mt-6 max-w-3xl text-balance text-white/80">
              Diseñamos sistemas web premium para hoteles, restaurantes y negocios que quieren
              recibir más reservas y consultas desde su página web.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="fp-button-primary inline-flex items-center justify-center gap-2 !px-8 !py-4 !text-base sm:!text-lg !font-semibold"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar sistema
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/demo"
                prefetch={false}
                className="fp-button-secondary inline-flex items-center justify-center !border !border-[#e6e6e6] !bg-[#f3f3f3]/5 !px-8 !py-4 !text-base !font-semibold !text-white sm:!text-lg"
              >
                Ver demos
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  aria-label={`Ver hero ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === heroIndex ? "w-10 bg-[#4ade80]" : "w-2.5 bg-white/35 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="negocios" className="relative z-10">
        <div className="fp-container pb-6 sm:pb-8">
          <div className="fp-industry-inline-strip">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon;
              return (
                <span key={industry.label} className="fp-industry-inline-item">
                  <Icon className="h-4 w-4" />
                  <span>{industry.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section id="screenshots" className="relative z-10">
        <div className="fp-container fp-container--wide pb-[24px]">
          <div className="fp-showcase-strip">
            <div className="max-w-2xl">
              <p className="fp-eyebrow">Screenshots</p>
              <div className="fp-deluxory-separator" aria-hidden />
              <h2 className="fp-section-title mt-4">Vistas reales</h2>
            </div>
            <div className="fp-showcase-grid mt-10">
              {heroScreens.map((screen, index) => (
                <article
                  key={screen.label}
                  className={`fp-showcase-card fp-showcase-card--${screen.variant} ${index === 0 ? "fp-showcase-card--feature" : ""}`}
                >
                  {screen.src ? (
                    <img
                      src={screen.src}
                      alt={screen.label}
                      className="fp-showcase-card__image"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="fp-showcase-card__meta">
                    <span className="fp-showcase-card__label">{screen.label}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="fp-container fp-section">
          <div className="max-w-3xl">
            <p className="fp-eyebrow">Autoridad</p>
            <div className="fp-deluxory-separator" aria-hidden />
            <h2 className="fp-section-title mt-4">Pensado para vender en serio</h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-5">
            {AUTHORITY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="fp-authority-card">
                  <span className="fp-authority-card__icon">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="fp-authority-strip mt-8">
            <span>Diseno premium</span>
            <span>Experiencia movil impecable</span>
            <span>Flujo orientado a WhatsApp</span>
            <span>Activacion rapida</span>
            <span>Arquitectura enfocada en conversion</span>
          </div>
        </div>
      </section>

      <section id="portfolio" className="relative z-10">
        <div className="fp-container fp-section">
          <div className="max-w-3xl">
            <p className="fp-eyebrow">Portfolio</p>
            <div className="fp-deluxory-separator" aria-hidden />
            <h2 className="fp-section-title mt-4">Ejemplos de sistemas web</h2>
            <p className="fp-muted-copy mt-5 max-w-2xl">Mas visuales. Mas claros. Mas orientados a conversion.</p>
          </div>

          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-9">
            {PORTFOLIO_ITEMS.map((item) => (
              <article key={item.name} className="portfolio-card">
                <PortfolioPreview
                  accent={item.accent}
                  surface={item.surface}
                  businessType={item.businessType}
                  focus={item.focus}
                  metrics={item.metrics}
                  previewImage={item.screenshots.find((screenshot) => screenshot.src)?.src}
                />
                <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
                  <div>
                    <span className="fp-portfolio-tag">{item.focus}</span>
                    <h3 className="mt-4 text-[30px] font-semibold tracking-[-0.04em] text-white">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-zinc-500">
                      {item.businessType}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">{item.summary}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <span key={metric} className="fp-portfolio-chip">
                        {metric}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpen(item)}
                    className="fp-button-secondary mt-8 inline-flex w-fit items-center justify-center gap-2"
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

      <section id="resultados" className="relative z-10">
        <div className="fp-container fp-section">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="max-w-2xl">
              <p className="fp-eyebrow">Resultados</p>
              <div className="fp-deluxory-separator" aria-hidden />
              <h2 className="fp-section-title mt-4">Por que convierten mejor</h2>

              <div className="fp-results-visual mt-10">
                <div className="fp-results-visual__header">
                  <span>Entrada</span>
                  <span>Decision</span>
                  <span>Accion</span>
                </div>
                <div className="fp-results-visual__track">
                  <div className="fp-results-visual__node">
                    <strong>Visita</strong>
                    <p>Google, Instagram, anuncio o referencia.</p>
                  </div>
                  <div className="fp-results-visual__node">
                    <strong>Confianza</strong>
                    <p>Diseno premium, oferta clara y estructura limpia.</p>
                  </div>
                  <div className="fp-results-visual__node">
                    <strong>WhatsApp</strong>
                    <p>Reserva, consulta o venta directa con CTA visibles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {RESULT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="fp-result-card">
                    <span className="fp-result-card__icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="proceso" className="relative z-10">
        <div className="fp-container fp-section">
          <div className="max-w-3xl">
            <p className="fp-eyebrow">Proceso</p>
            <div className="fp-deluxory-separator" aria-hidden />
            <h2 className="fp-section-title mt-4">Como trabajamos</h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.step} className="fp-process-card">
                  <span className="fp-process-number">{step.step}</span>
                  <div className="relative z-[1] flex items-center justify-between gap-4">
                    <span className="fp-process-icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="relative z-[1] mt-8 text-xl font-semibold tracking-[-0.03em] text-white">
                    {step.title}
                  </h3>
                  <p className="relative z-[1] mt-4 text-sm leading-6 text-zinc-300">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="fp-container fp-section">
          <div className="fp-final-cta">
            <p className="fp-eyebrow fp-eyebrow--center">Listo para vender mejor</p>
            <div className="fp-deluxory-separator fp-deluxory-separator--center" aria-hidden />
            <h2 className="fp-section-title mt-5 max-w-4xl text-center">
              Empieza a recibir reservas desde tu web
            </h2>
            <p className="fp-muted-copy mt-6 max-w-3xl text-center">
              Convierte tu página en un canal directo de clientes por WhatsApp.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="fp-button-primary inline-flex items-center justify-center gap-2 !px-8 !py-4 !text-base sm:!text-lg !font-semibold"
              >
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </a>
              <Link href="/demo" prefetch={false} className="fp-button-secondary inline-flex items-center justify-center !px-8 !py-4 !text-base sm:!text-lg !font-semibold !border !border-[#e6e6e6] !bg-[#f3f3f3]/5 !text-white">
                Ver demos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {activeProject ? (
        <div className="portfolio-modal" role="dialog" aria-modal="true">
          <div className="portfolio-modal__layer" onClick={handleClose} />
          <div className="portfolio-modal__panel">
            <header className="portfolio-modal__header">
              <div>
                <p className="fp-eyebrow">Portfolio</p>
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
                  {screenshot.src ? (
                    <img
                      src={screenshot.src}
                      alt={`${activeProject.name} ${screenshot.label}`}
                      className="portfolio-screenshot__image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="portfolio-screenshot__placeholder" />
                  )}
                  <span className="portfolio-screenshot__label">{screenshot.label}</span>
                  <p className="portfolio-screenshot__description">{screenshot.description}</p>
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
                className="fp-button-secondary inline-flex items-center justify-center gap-2"
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


