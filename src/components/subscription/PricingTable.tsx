"use client";

import { Fragment } from "react";
import { Check, Lock } from "lucide-react";
import { PLAN_DEFINITIONS, PlanType } from "@/lib/subscription/plans";

type ComparisonRow = {
  label: string;
  values: Record<PlanType, string>;
};

const EMPHASIS_REGEX = /(50 productos|Productos ilimitados|Branding removible|IA avanzada)/gi;
const EMPHASIS_TOKENS = new Set([
  "50 productos",
  "productos ilimitados",
  "branding removible",
  "ia avanzada",
]);

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Proyectos activos",
    values: {
      FREE: "1 proyecto",
      BUSINESS: "5 proyectos",
      PRO: "20 proyectos",
    },
  },
  {
    label: "Productos por proyecto",
    values: {
      FREE: "10 productos",
      BUSINESS: "50 productos",
      PRO: "Productos ilimitados",
    },
  },
  {
    label: "Branding",
    values: {
      FREE: "Visible obligatorio",
      BUSINESS: "Visible (no removible)",
      PRO: "Branding removible",
    },
  },
  {
    label: "Dominio propio",
    values: {
      FREE: "ðŸ”’ Solo Business/Pro",
      BUSINESS: "Permitido (cliente compra dominio)",
      PRO: "Permitido",
    },
  },
  {
    label: "IA",
    values: {
      FREE: "ðŸ”’ Solo Business/Pro",
      BUSINESS: "IA basica",
      PRO: "IA avanzada",
    },
  },
  {
    label: "Soporte",
    values: {
      FREE: "âŒ Sin soporte",
      BUSINESS: "ðŸ“§ Correo (max. 24h)",
      PRO: "ðŸ’¬ En vivo por WhatsApp",
    },
  },
  {
    label: "Metricas",
    values: {
      FREE: "Sin metricas avanzadas",
      BUSINESS: "Visitas, clicks y conversion media",
      PRO: "Metricas PRO + insights automaticos",
    },
  },
  {
    label: "Clonador",
    values: {
      FREE: "No",
      BUSINESS: "No",
      PRO: "Habilitado",
    },
  },
];

interface PricingTableProps {
  activePlan?: PlanType;
  onSelectPlan?: (plan: PlanType) => void;
  loadingPlan?: PlanType | null;
}

function renderEmphasis(text: string) {
  const parts = text.split(EMPHASIS_REGEX);
  return parts.map((part, index) => {
    if (!part) return null;
    const highlighted = EMPHASIS_TOKENS.has(part.toLowerCase());
    if (!highlighted) return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    return (
      <strong key={`${part}-${index}`} className="font-black text-white">
        {part}
      </strong>
    );
  });
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
              className={`flex h-full flex-col rounded-2xl border p-4 transition ${
                plan.highlighted ? "border-amber-400/40 bg-amber-400/10" : "border-white/10 bg-black/25"
              }`}
            >
              {plan.badgeLabel ? (
                <div className="mb-2 inline-flex items-center rounded-full border border-amber-300/45 bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">
                  {plan.badgeLabel}
                </div>
              ) : null}
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{plan.name}</p>
              <h3 className="mt-2 text-3xl font-black text-white">{plan.monthlyPriceLabel}</h3>
              <p className="mt-1 text-sm text-zinc-300">{plan.subtitle}</p>
              {plan.note ? <p className="mt-1 text-xs font-semibold text-amber-100">{plan.note}</p> : null}
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                {plan.bulletPoints.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    {item.includes("🔒") || item.includes("❌") ? (
                      <Lock className="mt-0.5 h-4 w-4 text-amber-300" />
                    ) : (
                      <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                    )}
                    <span>{renderEmphasis(item)}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isActive || isLoading}
                onClick={() => onSelectPlan?.(plan.id)}
                className={`mt-auto w-full rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                    : "border-amber-300/40 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20"
                } disabled:opacity-70`}
              >
                {isActive ? "Plan Activo" : isLoading ? "Procesando..." : plan.ctaLabel}
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
                <th className="py-2 pr-4 font-semibold">Capacidad</th>
                {PLAN_DEFINITIONS.map((plan) => (
                  <th key={plan.id} className="px-3 py-2 text-center font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-white/5">
                  <td className="py-2 pr-4 text-zinc-200">{row.label}</td>
                  {PLAN_DEFINITIONS.map((plan) => (
                    <td key={`${row.label}-${plan.id}`} className="px-3 py-2 text-center text-zinc-100">
                      {renderEmphasis(row.values[plan.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="border-t border-white/10 px-4 py-3 text-center text-xs font-semibold text-zinc-200 md:px-6">
        Sin comisiones por pedido. Cancela cuando quieras.
      </p>
    </div>
  );
}

