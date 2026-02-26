import { SubscriptionFeature } from "@/lib/permissions";

export type PlanType = "FREE" | "BUSINESS" | "PRO";

export interface PlanDefinition {
  id: PlanType;
  name: string;
  monthlyPriceLabel: string;
  subtitle: string;
  ctaLabel: string;
  billingFlow: "direct" | "trial";
  badgeLabel?: string;
  note?: string;
  trialDays?: number;
  features: SubscriptionFeature[];
  bulletPoints: string[];
  highlighted?: boolean;
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: "FREE",
    name: "STARTER",
    monthlyPriceLabel: "S/ 29 / mes",
    subtitle: "Pago directo mensual. Sin trial. ⚡",
    ctaLabel: "Empezar ahora",
    billingFlow: "direct",
    features: [],
    bulletPoints: [
      "1 proyecto activo publicado",
      "Hasta 10 productos por proyecto",
      "Branding visible obligatorio",
      "Subdominio fastpage.app",
      "❌ Sin soporte directo",
      "🔒 Dominio propio (Business o Pro)",
      "🔒 IA (Business o Pro)",
    ],
  },
  {
    id: "BUSINESS",
    name: "BUSINESS",
    monthlyPriceLabel: "S/ 59 / mes",
    subtitle: "Prueba gratis por 14 dias. Luego S/59/mes. Cancela cuando quieras.",
    ctaLabel: "Probar 14 dias gratis",
    billingFlow: "trial",
    badgeLabel: "🔥 Mas elegido",
    note: "Sin compromiso.",
    trialDays: 14,
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
      "IA basica para descripciones y ayuda de textos",
      "📧 Soporte por correo (respuesta maxima 24h)",
      "Branding visible (no removible)",
    ],
    highlighted: true,
  },
  {
    id: "PRO",
    name: "PRO",
    monthlyPriceLabel: "S/ 99 / mes",
    subtitle: "Pago directo mensual para escalar en serio. Sin trial. 🚀",
    ctaLabel: "Comprar ahora",
    billingFlow: "direct",
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
      "💬 Soporte en vivo por WhatsApp",
      "Insights automaticos y rendimiento tecnico (LCP/SEO/Accesibilidad)",
    ],
  },
];

export function getPlanDefinition(plan: PlanType): PlanDefinition {
  return PLAN_DEFINITIONS.find((entry) => entry.id === plan) || PLAN_DEFINITIONS[0];
}
