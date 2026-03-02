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

type LandingPlanIntent = "FREE" | "BUSINESS" | "PRO";

function normalizePlanIntent(rawValue: string | null): LandingPlanIntent | null {
  const normalized = String(rawValue || "")
    .trim()
    .toUpperCase();
  if (normalized === "FREE" || normalized === "STARTER" || normalized === "29") return "FREE";
  if (normalized === "BUSINESS" || normalized === "59") return "BUSINESS";
  if (normalized === "PRO" || normalized === "99") return "PRO";
  return null;
}

function normalizeReferralCode(rawValue: string | null): string {
  return String(rawValue || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
}

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vertical, setVertical] = useState<BusinessVertical>("restaurant");
  const [selectedPlan, setSelectedPlan] = useState<LandingPlanIntent | null>(null);
  const [trialIntent, setTrialIntent] = useState("");
  const [demoSlug, setDemoSlug] = useState("");
  const [demoTheme, setDemoTheme] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    persistUtmFromUrl(params || undefined);
    const resolved = normalizeVertical(params?.get("vertical"));
    const planIntent = params ? normalizePlanIntent(params.get("plan")) : null;
    const incomingTrial = String(params?.get("trial") || "").trim().toLowerCase();
    const incomingDemoSlug = String(params?.get("demoSlug") || "")
      .trim()
      .replace(/[^\w-]/g, "");
    const incomingDemoTheme = String(params?.get("demoTheme") || "")
      .trim()
      .replace(/[^\w-]/g, "");
    const incomingReferralCode = normalizeReferralCode(params?.get("ref") || null);
    setVertical(resolved);
    setSelectedPlan(planIntent);
    setTrialIntent(planIntent === "BUSINESS" ? incomingTrial || "business14" : incomingTrial);
    setDemoSlug(incomingDemoSlug);
    setDemoTheme(incomingDemoTheme);
    setReferralCode(incomingReferralCode);
    persistVerticalChoice(resolved);
    void trackGrowthEvent("start_signup", {
      vertical: resolved,
      location: "signup_page",
    });
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    if (selectedPlan) {
      const params = new URLSearchParams({ plan: selectedPlan });
      if (trialIntent) params.set("trial", trialIntent);
      router.replace(`/dashboard/billing?${params.toString()}`);
      return;
    }
    router.replace(verticalToCreateHref(vertical, { demoSlug, demoTheme }));
  }, [demoSlug, demoTheme, loading, router, selectedPlan, trialIntent, user, vertical]);

  const copy = useMemo(() => getVerticalCopy(vertical), [vertical]);
  const registerHref = useMemo(() => {
    const params = new URLSearchParams({ tab: "register", vertical });
    if (selectedPlan) params.set("plan", selectedPlan);
    if (trialIntent) params.set("trial", trialIntent);
    if (demoSlug) params.set("demoSlug", demoSlug);
    if (demoTheme) params.set("demoTheme", demoTheme);
    if (referralCode) params.set("ref", referralCode);
    return `/auth?${params.toString()}`;
  }, [demoSlug, demoTheme, referralCode, selectedPlan, trialIntent, vertical]);
  const loginHref = useMemo(() => {
    const params = new URLSearchParams({ tab: "login", vertical });
    if (selectedPlan) params.set("plan", selectedPlan);
    if (trialIntent) params.set("trial", trialIntent);
    if (demoSlug) params.set("demoSlug", demoSlug);
    if (demoTheme) params.set("demoTheme", demoTheme);
    if (referralCode) params.set("ref", referralCode);
    return `/auth?${params.toString()}`;
  }, [demoSlug, demoTheme, referralCode, selectedPlan, trialIntent, vertical]);
  const returnDemoHref = useMemo(() => {
    if (demoSlug) return `/demo/${vertical}/${demoSlug}`;
    return `/demo?vertical=${vertical}`;
  }, [demoSlug, vertical]);

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
          Primero elige tu rubro. Luego te llevamos al registro para activar tu plan.
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
            href={registerHref}
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
            href={loginHref}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
          >
            Ya tengo cuenta
          </Link>
          <Link
            href={returnDemoHref}
            className="rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-300"
          >
            Ver demo otra vez
          </Link>
        </div>
      </div>
    </main>
  );
}
