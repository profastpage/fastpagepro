"use client";

type PlanType = "FREE" | "BUSINESS" | "PRO" | "AGENCY";

const PLAN_STYLES: Record<PlanType, string> = {
  FREE: "border-zinc-500/50 bg-zinc-700/30 text-zinc-100",
  BUSINESS: "border-amber-300/50 bg-amber-400/15 text-amber-100",
  PRO: "border-fuchsia-300/50 bg-fuchsia-500/15 text-fuchsia-100",
  AGENCY: "border-cyan-300/50 bg-cyan-500/15 text-cyan-100",
};

const PLAN_LABELS: Record<PlanType, string> = {
  FREE: "STARTER",
  BUSINESS: "BUSINESS",
  PRO: "PRO",
  AGENCY: "AGENCY",
};

export default function PlanBadge({ plan }: { plan: PlanType }) {
  const safePlan = plan in PLAN_STYLES ? plan : "FREE";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${PLAN_STYLES[safePlan]}`}
    >
      {PLAN_LABELS[safePlan]}
    </span>
  );
}

