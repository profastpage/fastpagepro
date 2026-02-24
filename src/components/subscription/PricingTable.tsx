"use client";

import { Check, X } from "lucide-react";
import { PLAN_DEFINITIONS } from "@/lib/subscription/plans";
import { SubscriptionFeature } from "@/lib/permissions";

type PlanType = "FREE" | "BUSINESS" | "PRO";

type PlanFeatureRow = {
  id: SubscriptionFeature;
  label: string;
};

const FEATURE_ROWS: PlanFeatureRow[] = [
  { id: "premiumThemes", label: "Temas premium" },
  { id: "aiOptimization", label: "IA de personalización" },
  { id: "advancedMetrics", label: "Analíticas avanzadas" },
  { id: "customDomain", label: "Dominio personalizado" },
  { id: "removeBranding", label: "Eliminar branding Fast Page" },
  { id: "conversionOptimizationAdvanced", label: "Optimización de conversión avanzada" },
  { id: "multiUser", label: "Multi usuario" },
];

interface PricingTableProps {
  activePlan?: PlanType;
  onSelectPlan?: (plan: PlanType) => void;
  loadingPlan?: PlanType | null;
}

export default function PricingTable({ activePlan, onSelectPlan, loadingPlan }: PricingTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70">
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3 md:gap-4 md:p-6">
        {PLAN_DEFINITIONS.map((plan) => {
          const isActive = plan.id === activePlan;
          const isLoading = loadingPlan === plan.id;
          return (
            <article
              key={plan.id}
              className={`rounded-2xl border p-4 transition ${
                plan.highlighted ? "border-amber-400/40 bg-amber-400/10" : "border-white/10 bg-black/25"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{plan.name}</p>
              <h3 className="mt-2 text-3xl font-black text-white">{plan.monthlyPriceLabel}</h3>
              <p className="mt-1 text-sm text-zinc-300">{plan.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                {plan.bulletPoints.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isActive || isLoading}
                onClick={() => onSelectPlan?.(plan.id)}
                className={`mt-6 w-full rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                    : "border-amber-300/40 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20"
                } disabled:opacity-70`}
              >
                {isActive ? "Plan Activo" : isLoading ? "Procesando..." : "Actualizar Plan"}
              </button>
            </article>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-4 py-4 md:px-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-300">
                <th className="py-2 pr-4 font-semibold">Feature</th>
                {PLAN_DEFINITIONS.map((plan) => (
                  <th key={plan.id} className="py-2 px-3 text-center font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-2 pr-4 text-zinc-200">{row.label}</td>
                  {PLAN_DEFINITIONS.map((plan) => {
                    const enabled = plan.features.includes(row.id);
                    return (
                      <td key={`${row.id}-${plan.id}`} className="py-2 px-3 text-center">
                        {enabled ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-300" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-zinc-500" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
