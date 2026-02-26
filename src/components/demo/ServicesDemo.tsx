"use client";

import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import type { LandingData } from "@/lib/demoTypes";
import { trackGrowthEvent } from "@/lib/analytics";

function buildWhatsappMessage(lines: string[], phone: string) {
  const normalized = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ServicesDemo({ demo }: { demo: LandingData }) {
  const whatsappHref = buildWhatsappMessage(
    [`Hola, me interesa ${demo.title}.`, "Quiero una propuesta para mi negocio."],
    demo.whatsappNumber,
  );

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-3xl border border-[var(--fp-border)] bg-[var(--fp-surface)]">
        <div className="relative h-56 md:h-80">
          <Image src={demo.coverImage} alt={demo.title} fill unoptimized sizes="100vw" className="object-cover" />
        </div>
        <div className="space-y-4 p-4 md:p-8">
          <p className="inline-flex rounded-full bg-[var(--fp-card)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">{demo.heroKicker}</p>
          <h2 className="text-3xl font-black md:text-5xl">{demo.title}</h2>
          <p className="text-[var(--fp-muted)]">{demo.description}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {demo.bullets.map((bullet) => (
              <p key={bullet} className="rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-3 py-2 text-sm font-semibold">{bullet}</p>
            ))}
          </div>
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
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--fp-primary)] px-5 py-3 text-sm font-black text-white"
          >
            💬 Contactar por WhatsApp <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </article>

      <section className="grid gap-3 md:grid-cols-3">
        {demo.cards.map((card) => (
          <article key={card.id} className="rounded-2xl border border-[var(--fp-border)] bg-[var(--fp-surface)] p-4">
            <p className="inline-flex rounded-full bg-[var(--fp-card)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--fp-primary)]"><Star className="mr-1 h-3.5 w-3.5" />Servicio</p>
            <h3 className="mt-3 text-2xl font-black">{card.title}</h3>
            <p className="mt-2 text-sm text-[var(--fp-muted)]">{card.summary}</p>
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
              className="mt-4 inline-flex rounded-xl border border-[var(--fp-border)] bg-[var(--fp-card)] px-4 py-2 text-sm font-bold"
            >
              {card.cta}
            </a>
          </article>
        ))}
      </section>
    </section>
  );
}
