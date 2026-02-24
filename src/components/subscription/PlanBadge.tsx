"use client";

type PlanType = "FREE" | "BUSINESS" | "PRO";

const PLAN_STYLES: Record<PlanType, string> = {
  FREE: "border-zinc-500/50 bg-zinc-700/30 text-zinc-100",
  BUSINESS: "border-amber-300/50 bg-amber-400/15 text-amber-100",
  PRO: "border-fuchsia-300/50 bg-fuchsia-500/15 text-fuchsia-100",
};

export default function PlanBadge({ plan }: { plan: PlanType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${PLAN_STYLES[plan]}`}
    >
      {plan}
    </span>
  );
}
