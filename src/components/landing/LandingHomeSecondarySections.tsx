"use client";

import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Footer from "@/components/Footer";
import DemoCard from "@/components/demo/DemoCard";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { trackGrowthEvent } from "@/lib/analytics";
import { getVerticalCopy, type BusinessVertical } from "@/lib/vertical";

type ModuleCard = {
  id: "builder" | "templates" | "cloner" | "store" | "menu" | "metrics";
  title: string;
  line: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type FlowStep = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type TestimonialItem = {
  name: string;
  city: string;
  quote: string;
  segment: string;
  avatar: string;
};

type SecondaryCopy = {
  systemTitle: string;
  systemDesc: string;
  allInOneTitle: string;
  allInOneDesc: string;
  moduleCta: string;
  verticalTitle: string;
  verticalCards: string[];
  ctaDemo: string;
  ctaPrimary: string;
  demosTitle: string;
  demosDesc: string;
  pricingTitle: string;
  starterSubtitle: string;
  starterAnnualDiscount: string;
  starterCta: string;
  businessBadge: string;
  businessSubtitle: string;
  businessAnnualDiscount: string;
  businessNote: string;
  businessCta: string;
  proSubtitle: string;
  proAnnualDiscount: string;
  proCta: string;
  domainLine: string;
  riskFree: string;
  resultsTitle: string;
  testimonialsLeft: string;
  testimonialsRight: string;
  testimonialBadges: string[];
  faqTitle: string;
  finalTitle: string;
  finalDesc: string;
  liveActivity: string;
  from: string;
};

type PricingFeatures = {
  starter: readonly string[];
  business: readonly string[];
  pro: readonly string[];
};

type LiveActivity = {
  name: string;
  city: string;
  action: string;
};

type Props = {
  copy: SecondaryCopy;
  flowSteps: FlowStep[];
  moduleCards: ModuleCard[];
  demoTabConfig: Record<BusinessVertical, string>;
  pricingFeatures: PricingFeatures;
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  heroSignupHref: string;
  heroDemoHref: string;
  starterSignupHref: string;
  businessSignupHref: string;
  proSignupHref: string;
  vertical: BusinessVertical;
  activityTimeLabel: string;
  activeLiveActivity: LiveActivity;
};

export default function LandingHomeSecondarySections({
  copy,
  flowSteps,
  moduleCards,
  demoTabConfig,
  pricingFeatures,
  faqs,
  testimonials,
  heroSignupHref,
  heroDemoHref,
  starterSignupHref,
  businessSignupHref,
  proSignupHref,
  vertical,
  activityTimeLabel,
  activeLiveActivity,
}: Props) {
  const [demoTab, setDemoTab] = useState<BusinessVertical>(vertical);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [desktopTestimonialIndex, setDesktopTestimonialIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDemoTab(vertical);
  }, [vertical]);

  useEffect(() => {
    setDesktopTestimonialIndex(0);
  }, [testimonials.length]);

  const demoItems = useMemo(() => getDemoCatalog(demoTab), [demoTab]);
  const desktopTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    const visibleCount = Math.min(3, testimonials.length);
    return Array.from({ length: visibleCount }, (_, offset) => {
      const index = (desktopTestimonialIndex + offset) % testimonials.length;
      return testimonials[index];
    });
  }, [desktopTestimonialIndex, testimonials]);

  const scrollTestimonials = (direction: "left" | "right") => {
    const isDesktopViewport =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    if (isDesktopViewport && testimonials.length > 0) {
      setDesktopTestimonialIndex((current) => {
        if (direction === "left") {
          return (current - 1 + testimonials.length) % testimonials.length;
        }
        return (current + 1) % testimonials.length;
      });
      return;
    }

    const container = testimonialsRef.current;
    if (!container) return;
    const card = container.querySelector("article") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 380;
    const offset = direction === "left" ? -step : step;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <>
      <section id="sistema-fastpage" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.systemTitle}</h2>
          <p className="mx-auto mt-3 hidden max-w-3xl text-zinc-300 sm:block">
            {copy.systemDesc}
          </p>
          <div className="mx-auto mt-3 grid max-w-sm grid-cols-5 gap-2 sm:hidden">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={`mobile-step-${step.title}`} className="relative flex flex-col items-center gap-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-300">{step.title}</p>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/40 bg-zinc-950 shadow-[inset_0_1px_0_rgba(251,191,36,0.25),0_8px_18px_-14px_rgba(251,191,36,0.55)]">
                    <Icon className="h-4 w-4 text-amber-300" />
                  </span>
                  {index < flowSteps.length - 1 ? (
                    <ArrowRight className="absolute -right-2 top-[1.95rem] h-3.5 w-3.5 text-amber-300/80" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div className="hidden gap-3 md:grid md:grid-cols-[repeat(9,minmax(0,1fr))] md:items-center">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={index < flowSteps.length - 1 ? "md:col-span-2" : "md:col-span-1"}>
                <article className="group rounded-2xl border border-white/10 bg-black/45 p-4 transition hover:-translate-y-1 hover:border-amber-300/45">
                  <div className="inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2">
                    <Icon className="h-5 w-5 text-amber-300 transition group-hover:scale-110" />
                  </div>
                  <p className="mt-3 text-base font-black text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-zinc-300">{step.description}</p>
                </article>
                {index < flowSteps.length - 1 ? (
                  <div className="hidden items-center justify-center py-2 md:flex">
                    <ArrowRight className="h-4 w-4 animate-pulse text-amber-300/80" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.allInOneTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            {copy.allInOneDesc}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {moduleCards.map((module) => {
            const Icon = module.icon;
            const isClickableModule = module.id === "menu" || module.id === "store";

            if (!isClickableModule) {
              return (
                <article
                  key={module.id}
                  className="flex aspect-square flex-col rounded-2xl border border-white/10 bg-black/40 p-3 md:p-4"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                    <Icon className="h-4 w-4 text-amber-300" />
                  </div>
                  <p className="mt-3 text-base font-black text-white md:text-lg">{module.title}</p>
                  <p className="mt-1 text-xs leading-snug text-zinc-300 md:text-sm">{module.line}</p>
                </article>
              );
            }

            return (
              <Link
                key={module.id}
                href={module.href}
                onClick={() =>
                  void trackGrowthEvent("click_demo_open", {
                    vertical,
                    slug: `module_${module.id}`,
                  })
                }
                className="group flex aspect-square flex-col rounded-2xl border border-white/10 bg-black/40 p-3 transition hover:-translate-y-1 hover:border-amber-300/45 md:p-4"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-3 text-base font-black text-white md:text-lg">{module.title}</p>
                <p className="mt-1 text-xs leading-snug text-zinc-300 md:text-sm">{module.line}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-amber-300 md:text-sm">
                  {copy.moduleCta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.verticalTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              vertical: "restaurant" as const,
              icon: UtensilsCrossed,
              copy: copy.verticalCards[0],
            },
            {
              vertical: "ecommerce" as const,
              icon: Store,
              copy: copy.verticalCards[1],
            },
            {
              vertical: "services" as const,
              icon: MessageCircle,
              copy: copy.verticalCards[2],
            },
          ].map((item) => {
            const Icon = item.icon;
            const itemCopy = getVerticalCopy(item.vertical);
            return (
              <article key={item.vertical} className="rounded-2xl border border-white/10 bg-black/45 p-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10">
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-4 text-2xl font-black text-white">{itemCopy.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.copy}</p>
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/demo?vertical=${item.vertical}`}
                    onClick={() =>
                      void trackGrowthEvent("click_demo_open", {
                        vertical: item.vertical,
                        slug: "rubro_card",
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
                  >{copy.ctaDemo}</Link>
                  <Link
                    href={`/signup?vertical=${item.vertical}`}
                    onClick={() =>
                      void trackGrowthEvent("click_cta_signup", {
                        vertical: item.vertical,
                        location: "rubro_card",
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/45 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
                  >{copy.ctaPrimary}</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="demos" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black text-white md:text-4xl">{copy.demosTitle}</h2>
            <p className="mt-2 text-zinc-300">{copy.demosDesc}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["restaurant", "ecommerce", "services"] as BusinessVertical[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDemoTab(tab)}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                  demoTab === tab
                    ? "border-amber-300 bg-amber-300/15 text-amber-100"
                    : "border-white/20 bg-white/5 text-zinc-300"
                }`}
              >
                {demoTabConfig[tab]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demoItems.map((item) => (
            <DemoCard
              key={`${item.vertical}-${item.slug}`}
              item={item}
              onOpen={(selectedVertical, slug) =>
                void trackGrowthEvent("click_demo_open", {
                  vertical: selectedVertical,
                  slug,
                  location: "landing_cases",
                })
              }
            />
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.pricingTitle}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-black/45 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">STARTER</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 29</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">{copy.starterSubtitle}</p>
            <p className="mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100">
              {copy.starterAnnualDiscount}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-300">
              {pricingFeatures.starter.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link href={starterSignupHref} className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10">
              {copy.starterCta}
            </Link>
          </article>

          <article className="relative flex h-full flex-col rounded-3xl border border-amber-300/45 bg-gradient-to-b from-amber-300/10 to-black/60 p-6">
            <span className="absolute -top-3 right-4 rounded-full border border-amber-300/45 bg-black px-3 py-1 text-xs font-bold text-amber-200">{copy.businessBadge}</span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">BUSINESS</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 59</p>
            <p className="mt-2 text-sm font-semibold text-amber-100">
              {copy.businessSubtitle}
            </p>
            <p className="mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100">
              {copy.businessAnnualDiscount}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-100/90">{copy.businessNote}</p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              {pricingFeatures.business.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link href={businessSignupHref} className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-amber-300/45 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300/20">
              {copy.businessCta}
            </Link>
          </article>

          <article className="flex h-full flex-col rounded-3xl border border-cyan-300/35 bg-gradient-to-b from-cyan-300/10 to-black/60 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">PRO</p>
            <p className="mt-2 text-4xl font-black text-white">S/ 99</p>
            <p className="mt-2 text-sm font-semibold text-cyan-100">{copy.proSubtitle}</p>
            <p className="mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100">
              {copy.proAnnualDiscount}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
              {pricingFeatures.pro.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link href={proSignupHref} className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20">
              {copy.proCta}
            </Link>
          </article>
        </div>
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          {copy.domainLine}
        </p>
        <p className="mt-2 text-center text-xs font-semibold text-zinc-300">
          {copy.riskFree}
        </p>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.resultsTitle}</h2>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label={copy.testimonialsLeft}
              onClick={() => scrollTestimonials("left")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={copy.testimonialsRight}
              onClick={() => scrollTestimonials("right")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="hidden grid-cols-3 gap-4 md:grid">
          {desktopTestimonials.map((item, index) => (
            <article
              key={`${item.name}-${item.city}-desktop-${desktopTestimonialIndex}-${index}`}
              className="min-h-[250px] rounded-2xl border border-white/10 bg-black/45 p-5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-300/30">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{item.name}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.14em] text-zinc-400">{item.city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-200">&quot;{item.quote}&quot;</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-amber-300">{item.segment}</p>
              <div className="mt-3 flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, sparkIndex) => (
                  <Sparkles key={`${item.name}-desktop-${sparkIndex}`} className="h-4 w-4" />
                ))}
              </div>
            </article>
          ))}
        </div>
        <div
          ref={testimonialsRef}
          className="no-scrollbar w-full max-w-full flex gap-4 overflow-x-auto px-2 pb-2 snap-x snap-mandatory [direction:rtl] md:hidden"
        >
          {testimonials.map((item) => (
            <article
              key={`${item.name}-${item.city}`}
              className="snap-start [direction:ltr] aspect-square w-[82vw] max-w-[360px] shrink-0 rounded-2xl border border-white/10 bg-black/45 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-300/30">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{item.name}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.14em] text-zinc-400">{item.city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-200">&quot;{item.quote}&quot;</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-amber-300">{item.segment}</p>
              <div className="mt-3 flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Sparkles key={`${item.name}-${index}`} className="h-4 w-4" />
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
          {copy.testimonialBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">{copy.faqTitle}</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openFaqIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <article
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/45 transition-all duration-300"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenFaqIndex((current) => (current === index ? -1 : index))
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-bold text-white md:text-base">{item.q}</span>
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-amber-300" : ""
                    }`}
                  />
                </button>
                <div
                  id={panelId}
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-300 transition-all duration-300 ${
                        isOpen ? "translate-y-0" : "-translate-y-1"
                      }`}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-black/70 to-cyan-300/10 p-8 text-center">
          <p className="text-3xl font-black text-white md:text-4xl">{copy.finalTitle}</p>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">
            {copy.finalDesc}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={heroSignupHref}
              onClick={() =>
                void trackGrowthEvent("click_cta_signup", {
                  vertical,
                  location: "final_cta",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/45 bg-amber-300/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-amber-100 transition hover:bg-amber-300/20"
            >{copy.ctaPrimary}</Link>
            <Link
              href={heroDemoHref}
              onClick={() =>
                void trackGrowthEvent("click_demo_open", {
                  vertical,
                  slug: "final",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
            >{copy.ctaDemo}</Link>
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden w-[min(360px,calc(100vw-3rem))] max-w-full lg:block">
        <article className="rounded-2xl border border-amber-300/35 bg-[linear-gradient(145deg,rgba(8,8,10,0.96),rgba(22,16,6,0.96))] p-3 shadow-[0_18px_45px_-24px_rgba(251,191,36,0.65)] backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-300/30 bg-black/70 text-amber-300">
              <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">
                  {copy.liveActivity}
                </p>
                <p className="text-[10px] font-semibold text-zinc-400">{activityTimeLabel}</p>
              </div>
              <p className="mt-1 truncate text-[1.05rem] font-black text-white">
                {activeLiveActivity.name}
                <span className="pl-1 text-sm font-semibold text-zinc-300">{copy.from} {activeLiveActivity.city}</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold leading-snug text-zinc-100">
                <span>{activeLiveActivity.action}</span>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden">
        <Link
          href={heroSignupHref}
          onClick={() =>
            void trackGrowthEvent("click_cta_signup", {
              vertical,
              location: "mobile_sticky",
            })
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/45 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100 shadow-2xl backdrop-blur-md transition hover:bg-amber-300/20"
        >
          <Rocket className="h-4 w-4" />
          {copy.ctaPrimary}
        </Link>
      </div>

      <Footer />
    </>
  );
}
