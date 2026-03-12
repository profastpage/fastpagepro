export type LegacyPlanType = "FREE" | "BUSINESS" | "PRO";
export type CanonicalPlanType = "starter" | "business" | "pro" | "agency";

export type PlanTypeLike =
  | LegacyPlanType
  | CanonicalPlanType
  | Uppercase<CanonicalPlanType>
  | Lowercase<LegacyPlanType>
  | null
  | undefined
  | string;

export type AiLevel = "none" | "basic" | "advanced";
export type AnalyticsLevel = "none" | "basic" | "pro";

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
  | "supportPriority"
  | "fullStore"
  | "clonerAccess"
  | "insightsAutomation"
  | "whiteLabel";

export interface PlanLimits {
  maxPublishedPages: number | null;
  maxBasicThemes: number | null;
  maxProjects: number | null;
  maxProductsPerProject: number | null;
}

interface PlanCapability {
  aiLevel: AiLevel;
  analyticsLevel: AnalyticsLevel;
  limits: PlanLimits;
  features: Record<SubscriptionFeature, boolean>;
}

const FEATURE_LIST: SubscriptionFeature[] = [
  "premiumThemes",
  "categoryThemes",
  "aiOptimization",
  "advancedMetrics",
  "basicMetrics",
  "removeBranding",
  "customDomain",
  "multiUser",
  "conversionOptimizationAdvanced",
  "ctaOptimization",
  "advancedColorCustomization",
  "supportPriority",
  "fullStore",
  "clonerAccess",
  "insightsAutomation",
  "whiteLabel",
];

function createFeatureMap(active: Partial<Record<SubscriptionFeature, boolean>>): Record<SubscriptionFeature, boolean> {
  return FEATURE_LIST.reduce<Record<SubscriptionFeature, boolean>>((acc, feature) => {
    acc[feature] = Boolean(active[feature]);
    return acc;
  }, {} as Record<SubscriptionFeature, boolean>);
}

const PLAN_CAPABILITIES: Record<CanonicalPlanType, PlanCapability> = {
  starter: {
    aiLevel: "none",
    analyticsLevel: "none",
    limits: {
      maxPublishedPages: 1,
      maxBasicThemes: 3,
      maxProjects: 1,
      maxProductsPerProject: 10,
    },
    features: createFeatureMap({}),
  },
  business: {
    aiLevel: "basic",
    analyticsLevel: "basic",
    limits: {
      maxPublishedPages: 5,
      maxBasicThemes: null,
      maxProjects: 5,
      maxProductsPerProject: 50,
    },
    features: createFeatureMap({
      premiumThemes: true,
      categoryThemes: true,
      basicMetrics: true,
      customDomain: true,
      ctaOptimization: true,
      advancedColorCustomization: true,
      supportPriority: true,
      fullStore: true,
    }),
  },
  pro: {
    aiLevel: "advanced",
    analyticsLevel: "pro",
    limits: {
      maxPublishedPages: 20,
      maxBasicThemes: null,
      maxProjects: 20,
      maxProductsPerProject: null,
    },
    features: createFeatureMap({
      premiumThemes: true,
      categoryThemes: true,
      aiOptimization: true,
      advancedMetrics: true,
      basicMetrics: true,
      removeBranding: true,
      customDomain: true,
      conversionOptimizationAdvanced: true,
      ctaOptimization: true,
      advancedColorCustomization: true,
      supportPriority: true,
      fullStore: true,
      clonerAccess: true,
      insightsAutomation: true,
    }),
  },
  agency: {
    aiLevel: "advanced",
    analyticsLevel: "pro",
    limits: {
      maxPublishedPages: null,
      maxBasicThemes: null,
      maxProjects: null,
      maxProductsPerProject: null,
    },
    features: createFeatureMap({
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
      fullStore: true,
      clonerAccess: true,
      insightsAutomation: true,
      whiteLabel: true,
    }),
  },
};

const CANONICAL_ALIAS: Record<string, CanonicalPlanType> = {
  starter: "starter",
  free: "starter",
  business: "business",
  pro: "pro",
  agency: "agency",
};

const LEGACY_BY_CANONICAL: Record<CanonicalPlanType, LegacyPlanType> = {
  starter: "FREE",
  business: "BUSINESS",
  pro: "PRO",
  // Compatibility fallback while backend enums are still FREE/BUSINESS/PRO.
  agency: "PRO",
};

export function toCanonicalPlanType(input?: PlanTypeLike): CanonicalPlanType {
  const normalized = String(input || "").trim().toLowerCase();
  return CANONICAL_ALIAS[normalized] || "starter";
}

export function toPlanType(input?: PlanTypeLike): LegacyPlanType {
  return LEGACY_BY_CANONICAL[toCanonicalPlanType(input)];
}

export function getPlanLimits(userPlan?: PlanTypeLike): PlanLimits {
  return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].limits;
}

export function getPlanAiLevel(userPlan?: PlanTypeLike): AiLevel {
  return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].aiLevel;
}

export function getPlanAnalyticsLevel(userPlan?: PlanTypeLike): AnalyticsLevel {
  return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].analyticsLevel;
}

export function canAccessFeature(
  userPlan: PlanTypeLike,
  feature: SubscriptionFeature,
): boolean {
  return Boolean(PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].features[feature]);
}

export function isThemeAllowedForPlan(
  userPlan: PlanTypeLike,
  themeIndex: number,
): boolean {
  const limits = getPlanLimits(userPlan);
  if (limits.maxBasicThemes == null) return true;
  return themeIndex < limits.maxBasicThemes;
}

