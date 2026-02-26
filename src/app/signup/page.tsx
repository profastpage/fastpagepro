"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerticalSelector from "@/components/demo/VerticalSelector";
import { useAuth } from "@/hooks/useAuth";
import { persistUtmFromUrl, trackGrowthEvent } from "@/lib/analytics";
import {
  getVerticalCopy,
  normalizeVertical,
  persistVerticalChoice,
  verticalToCreateHref,
  type BusinessVertical,
} from "@/lib/vertical";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vertical, setVertical] = useState<BusinessVertical>("restaurant");

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    persistUtmFromUrl(params || undefined);
    const resolved = normalizeVertical(params?.get("vertical"));
    setVertical(resolved);
    persistVerticalChoice(resolved);
    void trackGrowthEvent("start_signup", {
      vertical: resolved,
      location: "signup_page",
    });
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    router.replace(verticalToCreateHref(vertical));
  }, [loading, router, user, vertical]);

  const copy = useMemo(() => getVerticalCopy(vertical), [vertical]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
      </div>
    );
  }

  if (user) return null;

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-20 pt-24 sm:px-6 md:pt-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_58%)]" />
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/50 p-6 md:p-8">
        <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          Paso 1 de 2
        </p>
        <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">
          Crea tu version en minutos
        </h1>
        <p className="mt-3 text-zinc-300">
          Primero elige tu rubro. Luego te llevamos al registro para activar 14 dias gratis en Business.
        </p>
        <div className="mt-6">
          <VerticalSelector
            value={vertical}
            onChange={(nextVertical) => {
              setVertical(nextVertical);
              persistVerticalChoice(nextVertical);
              void trackGrowthEvent("start_signup", {
                vertical: nextVertical,
                location: "signup_vertical_select",
              });
            }}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-zinc-100">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber-300">
            {copy.label}
          </p>
          <p className="mt-2 text-sm">{copy.subheadline}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/auth?tab=register&vertical=${vertical}&trial=business14`}
            onClick={() =>
              void trackGrowthEvent("start_signup", {
                vertical,
                location: "signup_continue_register",
              })
            }
            className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
          >
            Continuar con registro
          </Link>
          <Link
            href={`/auth?tab=login&vertical=${vertical}`}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
          >
            Ya tengo cuenta
          </Link>
          <Link
            href={`/demo?vertical=${vertical}`}
            className="rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-300"
          >
            Ver demo otra vez
          </Link>
        </div>
      </div>
    </main>
  );
}
