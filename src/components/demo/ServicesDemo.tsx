"use client";

import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import type { LandingData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";
import DemoImage from "@/components/demo/DemoImage";
import DemoReveal from "@/components/demo/DemoReveal";
import DemoSocialLinks from "@/components/demo/DemoSocialLinks";
import { getDemoSocialLinks } from "@/lib/demoSocial";
import {
  buildOfficialDemoWhatsappUrl,
  buildServicesDemoMessage,
} from "@/lib/demoWhatsapp";

export default function ServicesDemo({ demo }: { demo: LandingData }) {
  const socialLinks = getDemoSocialLinks(demo);
  const whatsappHref = buildOfficialDemoWhatsappUrl(
    buildServicesDemoMessage({ title: demo.title }),
  );
  const nicheFingerprint =
    `${demo.slug} ${demo.title} ${demo.subtitle} ${demo.heroKicker}`.toLowerCase();
  const isRealEstate =
    nicheFingerprint.includes("estate") ||
    nicheFingerprint.includes("property") ||
    nicheFingerprint.includes("residence") ||
    nicheFingerprint.includes("inmobili");
  const segmentLabel = isRealEstate ? "inmobiliaria premium" : "servicios / conversion";
  const visualEyebrow = isRealEstate ? "coleccion residencial" : "sistema de marca";
  const visualHeadline = isRealEstate
    ? "Propiedades mejor presentadas, mejor filtradas y listas para agendar visitas."
    : "Menos bloques. Mas direccion visual, mas claridad comercial.";
  const narrativeTitle = isRealEstate
    ? "Una composicion mas aspiracional para vender ubicacion, estilo de vida y valor percibido."
    : "Una composicion mas editorial para vender servicios con confianza.";
  const narrativeBody = isRealEstate
    ? "La plantilla prioriza fotografia amplia, aire visual y llamados a la accion sobrios para compra, alquiler o inversion sin sentirse como una landing generica."
    : "Esta plantilla ya no depende de cajas repetidas. Prioriza jerarquia, aire, profundidad y una ruta de accion mas limpia para equipos de servicios, consultorias y agencias.";

  return (
    <section className="space-y-6 md:space-y-8">
      <DemoReveal>
        <article className="fp-demo-shell fp-demo-grid px-4 py-4 md:px-8 md:py-8">
          <span
            className="fp-demo-orb fp-demo-float left-[-3rem] top-[-4rem] h-36 w-36"
            style={{ background: "color-mix(in srgb, var(--fp-primary) 72%, transparent)" }}
          />
          <span
            className="fp-demo-orb right-[8%] top-[16%] h-44 w-44"
            style={{ background: "color-mix(in srgb, var(--fp-primary) 26%, white)" }}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-stretch">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="fp-demo-kicker">{demo.heroKicker}</p>
                <span className="rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--fp-muted)]">
                  {segmentLabel}
                </span>
              </div>

              <div className="max-w-4xl space-y-4">
                <h2 className="fp-demo-hero-heading font-black text-[var(--fp-text)]">
                  {demo.title}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[var(--fp-muted)] md:text-lg">
                  {demo.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    void trackGrowthEvent("click_whatsapp", {
                      vertical: demo.vertical,
                      slug: demo.slug,
                      location: "services_hero",
                    })
                  }
                  className="fp-demo-button-primary inline-flex items-center gap-2 px-5 text-sm font-black text-white"
                >
                  Contactar por WhatsApp <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#servicios-demo"
                  className="fp-demo-button-secondary inline-flex items-center gap-2 px-5 text-sm font-black text-[var(--fp-text)]"
                >
                  Ver propuesta
                </a>
              </div>

              <div className="flex items-center">
                <DemoSocialLinks
                  links={socialLinks}
                  onOpen={(platform) =>
                    void trackGrowthEvent("click_social", {
                      vertical: demo.vertical,
                      slug: demo.slug,
                      location: "services_hero",
                      platform,
                    })
                  }
                />
              </div>

              <div className="fp-demo-scroll-rail no-scrollbar">
                {demo.bullets.map((bullet, index) => (
                  <div
                    key={bullet}
                    className="fp-demo-panel fp-demo-hover-card flex min-h-[136px] flex-col justify-between p-5"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--fp-primary)]">
                      0{index + 1}
                    </span>
                    <p className="max-w-[18ch] text-lg font-black leading-tight text-[var(--fp-text)]">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_168px] lg:grid-cols-1">
              <div className="fp-demo-image-frame min-h-[340px] bg-[var(--fp-card)] md:min-h-[420px]">
                <DemoImage
                  src={demo.coverImage}
                  alt={demo.title}
                  fallbackLabel={demo.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/75">
                    {visualEyebrow}
                  </p>
                  <p className="mt-2 max-w-[18ch] text-2xl font-black leading-tight md:text-3xl">
                    {visualHeadline}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {demo.cards.slice(0, 2).map((card) => (
                  <div
                    key={card.id}
                    className="fp-demo-panel fp-demo-hover-card flex min-h-[200px] flex-col justify-between p-5"
                  >
                    <div className="space-y-3">
                      <p className="inline-flex items-center gap-2 rounded-full border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--fp-primary)]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        focus area
                      </p>
                      <h3 className="text-2xl font-black leading-tight text-[var(--fp-text)]">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-6 text-[var(--fp-muted)]">{card.summary}</p>
                    </div>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        void trackGrowthEvent("click_whatsapp", {
                          vertical: demo.vertical,
                          slug: demo.slug,
                          location: `services_card_${card.id}`,
                        })
                      }
                      className="inline-flex items-center gap-2 text-sm font-black text-[var(--fp-text)]"
                    >
                      {card.cta} <ArrowRight className="h-4 w-4 text-[var(--fp-primary)]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </DemoReveal>

      <div
        id="servicios-demo"
        className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <DemoReveal delay={0.06}>
          <section className="fp-demo-panel fp-demo-hover-card p-6 md:p-8">
            <p className="fp-demo-kicker">Narrativa comercial</p>
            <h3 className="mt-5 fp-demo-section-title font-black text-[var(--fp-text)]">
              {narrativeTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--fp-muted)] md:text-base">
              {narrativeBody}
            </p>

            <div className="mt-8 grid gap-3">
              {demo.cards.map((card, index) => (
                <article
                  key={card.id}
                  className="fp-demo-hover-card rounded-[1.5rem] border border-[var(--fp-border)] bg-[var(--fp-card)] p-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--fp-primary)]/15 text-sm font-black text-[var(--fp-primary)]">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="text-xl font-black text-[var(--fp-text)]">{card.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[var(--fp-muted)]">
                        {card.summary}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </DemoReveal>

        <DemoReveal delay={0.12}>
          <section className="space-y-5">
            <div className="fp-demo-image-frame aspect-[16/10]">
              <DemoImage
                src={demo.coverImage}
                alt={demo.title}
                fallbackLabel={demo.title}
                fill
                unoptimized
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/55" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {demo.bullets.slice(0, 2).map((bullet) => (
                <div
                  key={bullet}
                  className="fp-demo-panel fp-demo-hover-card flex min-h-[190px] flex-col justify-between p-5"
                >
                  <Star className="h-5 w-5 text-[var(--fp-primary)]" />
                  <p className="max-w-[20ch] text-2xl font-black leading-tight text-[var(--fp-text)]">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </DemoReveal>
      </div>
    </section>
  );
}
