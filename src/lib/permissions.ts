export type PlanTypeLike = "FREE" | "BUSINESS" | "PRO";

export type SubscriptionFeature =
  | "premiumThemes"
  | "categoryThemes"
  | "aiOptimization"
  | "advancedMetrics"
  | "basicMetrics"
  | "removeBranding"
  | "customDomain"
  | "multiUser"
  | "conversionOptimizationAdvanced"
  | "ctaOptimization"
  | "advancedColorCustomization"
  | "supportPriority";

export interface PlanLimits {
  maxPublishedPages: number | null;
  maxBasicThemes: number | null;
}

const FEATURE_MATRIX: Record<PlanTypeLike, Record<SubscriptionFeature, boolean>> = {
  FREE: {
    premiumThemes: false,
    categoryThemes: false,
    aiOptimization: false,
    advancedMetrics: false,
    basicMetrics: false,
    removeBranding: false,
    customDomain: false,
    multiUser: false,
    conversionOptimizationAdvanced: false,
    ctaOptimization: false,
    advancedColorCustomization: false,
    supportPriority: false,
  },
  BUSINESS: {
    premiumThemes: true,
    categoryThemes: true,
    aiOptimization: false,
    advancedMetrics: false,
    basicMetrics: true,
    removeBranding: true,
    customDomain: false,
    multiUser: false,
    conversionOptimizationAdvanced: false,
    ctaOptimization: true,
    advancedColorCustomization: true,
    supportPriority: true,
  },
  PRO: {
    premiumThemes: true,
    categoryThemes: true,
    aiOptimization: true,
    advancedMetrics: true,
    basicMetrics: true,
    removeBranding: true,
    customDomain: true,
    multiUser: true,
    conversionOptimizationAdvanced: true,
    ctaOptimization: true,
    advancedColorCustomization: true,
    supportPriority: true,
  },
};

const PLAN_LIMITS: Record<PlanTypeLike, PlanLimits> = {
  FREE: {
    maxPublishedPages: 1,
    maxBasicThemes: 3,
  },
  BUSINESS: {
    maxPublishedPages: 5,
    maxBasicThemes: null,
  },
  PRO: {
    maxPublishedPages: null,
    maxBasicThemes: null,
  },
};

export function toPlanType(input?: string | null): PlanTypeLike {
  if (input === "BUSINESS" || input === "PRO" || input === "FREE") return input;
  return "FREE";
}

export function canAccessFeature(
  userPlan: PlanTypeLike | string | null | undefined,
  feature: SubscriptionFeature,
): boolean {
  const normalized = toPlanType(typeof userPlan === "string" ? userPlan.toUpperCase() : userPlan);
  return FEATURE_MATRIX[normalized][feature];
}

export function getPlanLimits(userPlan: PlanTypeLike | string | null | undefined): PlanLimits {
  const normalized = toPlanType(typeof userPlan === "string" ? userPlan.toUpperCase() : userPlan);
  return PLAN_LIMITS[normalized];
}

export function isThemeAllowedForPlan(
  userPlan: PlanTypeLike | string | null | undefined,
  themeIndex: number,
): boolean {
  const limits = getPlanLimits(userPlan);
  if (limits.maxBasicThemes == null) return true;
  return themeIndex < limits.maxBasicThemes;
}
