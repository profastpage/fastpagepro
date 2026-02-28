"use client";

import { useLanguage } from "@/context/LanguageContext";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useSubscription } from "@/hooks/useSubscription";
import PlanBadge from "@/components/subscription/PlanBadge";

type MobilePlanStatusCardProps = {
  userId?: string | null;
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function MobilePlanStatusCard({ userId, className }: MobilePlanStatusCardProps) {
  const enabled = Boolean(userId);
  const { language } = useLanguage();
  const { summary } = useSubscription(enabled);
  const permissions = usePlanPermissions(enabled);
  const isEnglish = language === "en";

  if (!enabled) return null;

  const projectsUsageLabel =
    permissions.maxProjects == null
      ? `${permissions.usage.publishedProjects}`
      : `${permissions.usage.publishedProjects}/${permissions.maxProjects}`;
  const computedPlanDays = summary?.isBusinessTrial ? summary?.trialDaysRemaining : summary?.daysRemaining;
  const planDaysRemaining = summary?.status === "ACTIVE" ? Math.max(0, Number(computedPlanDays || 0)) : 0;

  const copy = isEnglish
    ? {
        plan: "Plan:",
        projects: "Projects:",
        days: "Days left:",
        trial: (days: number) => `Business trial: ${days} days left.`,
      }
    : {
        plan: "Plan:",
        projects: "Proyectos:",
        days: "Dias restantes:",
        trial: (days: number) => `Prueba Business: ${days} dias restantes.`,
      };

  return (
    <div
      data-plan-status-mobile="true"
      className={joinClasses(
        "md:hidden w-full max-w-full rounded-2xl border border-amber-300/25 bg-black/70 px-3 py-2 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-300">{copy.plan}</span>
        <PlanBadge plan={summary?.plan || "FREE"} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-200">
          {copy.projects} {projectsUsageLabel}
        </span>
        <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
          {copy.days} {planDaysRemaining}
        </span>
      </div>
      {summary?.isBusinessTrial ? (
        <p className="mt-2 text-[11px] font-semibold text-amber-200">
          {copy.trial(Math.max(0, Number(summary?.trialDaysRemaining || 0)))}
        </p>
      ) : null}
    </div>
  );
}
