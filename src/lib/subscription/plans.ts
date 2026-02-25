import { SubscriptionFeature } from "@/lib/permissions";

export type PlanType = "FREE" | "BUSINESS" | "PRO";

export interface PlanDefinition {
  id: PlanType;
  name: string;
  monthlyPriceLabel: string;
  subtitle: string;
  features: SubscriptionFeature[];
  bulletPoints: string[];
  highlighted?: boolean;
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: "FREE",
    name: "STARTER",
    monthlyPriceLabel: "S/ 0",
    subtitle: "Ideal para empezar y validar tu idea",
    features: [],
    bulletPoints: [
      "1 proyecto activo publicado",
      "Hasta 10 productos por proyecto",
      "Branding visible obligatorio",
      "Subdominio fastpage.app",
      "Sin IA",
    ],
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    monthlyPriceLabel: "S/ 59 / mes",
    subtitle: "Escala ventas con tienda completa y dominio propio",
    features: [
      "premiumThemes",
      "categoryThemes",
      "basicMetrics",
      "customDomain",
      "ctaOptimization",
      "advancedColorCustomization",
      "supportPriority",
      "fullStore",
    ],
    bulletPoints: [
      "Hasta 5 proyectos activos",
      "Tienda Virtual y Carta Digital completas",
      "Hasta 50 productos por proyecto",
      "Dominio propio permitido (cliente compra su dominio)",
      "IA básica para descripciones y ayuda de textos",
      "Branding visible (no removible)",
    ],
    highlighted: true,
  },
  {
    id: "PRO",
    name: "PRO",
    monthlyPriceLabel: "S/ 99 / mes",
    subtitle: "Power plan con IA avanzada, cloner e insights",
    features: [
      "premiumThemes",
      "categoryThemes",
      "aiOptimization",
      "advancedMetrics",
      "basicMetrics",
      "removeBranding",
      "customDomain",
      "conversionOptimizationAdvanced",
      "ctaOptimization",
      "advancedColorCustomization",
      "supportPriority",
      "fullStore",
      "clonerAccess",
      "insightsAutomation",
    ],
    bulletPoints: [
      "Hasta 20 proyectos activos",
      "Productos ilimitados por proyecto",
      "Clonador habilitado y exportaciones avanzadas",
      "Branding removible",
      "IA avanzada para conversion y optimizacion automatica",
      "Insights automaticos y rendimiento tecnico (LCP/SEO/Accesibilidad)",
    ],
  },
];

export function getPlanDefinition(plan: PlanType): PlanDefinition {
  return PLAN_DEFINITIONS.find((entry) => entry.id === plan) || PLAN_DEFINITIONS[0];
}

