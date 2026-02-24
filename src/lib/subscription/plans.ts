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
    name: "FREE",
    monthlyPriceLabel: "S/ 0",
    subtitle: "Ideal para comenzar",
    features: [],
    bulletPoints: [
      "3 temas básicos",
      "Subdominio fastpage.app",
      "Branding visible",
      "Sin IA y sin métricas avanzadas",
      "1 página publicada",
    ],
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    monthlyPriceLabel: "S/ 99",
    subtitle: "Escala tu presencia B2B",
    features: [
      "premiumThemes",
      "categoryThemes",
      "removeBranding",
      "basicMetrics",
      "ctaOptimization",
      "advancedColorCustomization",
      "supportPriority",
    ],
    bulletPoints: [
      "Todos los temas por categoría",
      "Sin branding",
      "Métricas básicas",
      "Optimización CTA",
      "Hasta 5 páginas",
      "Soporte prioritario",
      "Personalización avanzada de colores",
    ],
    highlighted: true,
  },
  {
    id: "PRO",
    name: "PRO",
    monthlyPriceLabel: "S/ 199",
    subtitle: "Automatización con IA y crecimiento ilimitado",
    features: [
      "premiumThemes",
      "categoryThemes",
      "aiOptimization",
      "advancedMetrics",
      "removeBranding",
      "customDomain",
      "multiUser",
      "conversionOptimizationAdvanced",
      "ctaOptimization",
      "advancedColorCustomization",
      "supportPriority",
    ],
    bulletPoints: [
      "IA para sugerir tema y paleta por logo/categoría",
      "IA para optimizar estructura de conversión",
      "Métricas avanzadas",
      "Dominio personalizado",
      "Multi usuario",
      "Páginas ilimitadas",
    ],
  },
];

export function getPlanDefinition(plan: PlanType): PlanDefinition {
  return PLAN_DEFINITIONS.find((entry) => entry.id === plan) || PLAN_DEFINITIONS[0];
}
