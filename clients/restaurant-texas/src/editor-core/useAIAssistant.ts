"use client";

import { useCallback, useMemo } from "react";
import { usePlanPermissions } from "@/editor-core/usePlanPermissions";
import type { EditorAILevel } from "@/editor-core/types";

type AssistantTargetPlan = "business" | "pro" | "agency";

interface AssistantResponse {
  ok: boolean;
  text?: string;
  error?: string;
  targetPlan?: AssistantTargetPlan;
}

interface OptimizeResponse {
  ok: boolean;
  suggestions: string[];
  error?: string;
  targetPlan?: AssistantTargetPlan;
}

function pickUpgrade(level: EditorAILevel): AssistantTargetPlan {
  if (level === "none") return "business";
  return "pro";
}

function buildDescription(name: string, context?: string) {
  const cleanName = name.trim() || "Producto";
  const cleanContext = context?.trim();
  if (cleanContext) {
    return `${cleanName}: ${cleanContext}. Ideal para destacar valor, confianza y conversion en checkout.`;
  }
  return `${cleanName} con enfoque en beneficio real, confianza y compra rapida desde WhatsApp o carrito.`;
}

export function useAIAssistant() {
  const permissions = usePlanPermissions(true);
  const aiLevel = permissions.aiLevel;

  const generateProductDescription = useCallback(
    async (name: string, context?: string): Promise<AssistantResponse> => {
      if (aiLevel === "none") {
        return {
          ok: false,
          error: "Tu plan actual no incluye IA para descripciones.",
          targetPlan: "business",
        };
      }

      return {
        ok: true,
        text: buildDescription(name, context),
      };
    },
    [aiLevel],
  );

  const improveShortCopy = useCallback(
    async (input: string): Promise<AssistantResponse> => {
      if (aiLevel === "none") {
        return {
          ok: false,
          error: "La mejora de copy requiere IA basica (Business o superior).",
          targetPlan: "business",
        };
      }

      const base = input.trim();
      const improved = base
        ? `${base.replace(/\.$/, "")}. Mensaje claro, orientado a accion y conversion inmediata.`
        : "Texto optimizado con enfoque en beneficio, confianza y llamada a la accion.";

      return {
        ok: true,
        text: improved,
      };
    },
    [aiLevel],
  );

  const optimizeMenu = useCallback(
    async (): Promise<OptimizeResponse> => {
      if (aiLevel !== "advanced") {
        return {
          ok: false,
          suggestions: [],
          error: "La optimizacion completa de Carta Digital requiere plan PRO.",
          targetPlan: "pro",
        };
      }

      return {
        ok: true,
        suggestions: [
          "Prioriza 3 productos ancla con margen alto en primer scroll.",
          "Reduce el texto de descripcion a 2 lineas para mejorar escaneo movil.",
          "Refuerza CTA con verbo directo: 'Pedir ahora' y urgencia suave.",
        ],
      };
    },
    [aiLevel],
  );

  const optimizeStore = useCallback(
    async (): Promise<OptimizeResponse> => {
      if (aiLevel !== "advanced") {
        return {
          ok: false,
          suggestions: [],
          error: "La optimizacion completa de tienda requiere plan PRO.",
          targetPlan: "pro",
        };
      }

      return {
        ok: true,
        suggestions: [
          "Mueve ofertas al primer bloque de pantalla para elevar CTR inicial.",
          "Muestra ahorro absoluto junto al precio para mejorar percepcion de valor.",
          "Mantiene chips de categoria sticky en mobile para reducir friccion.",
        ],
      };
    },
    [aiLevel],
  );

  const suggestCTA = useCallback(
    async (context: string): Promise<AssistantResponse> => {
      if (aiLevel !== "advanced") {
        return {
          ok: false,
          error: "Sugerencias avanzadas de CTA disponibles en plan PRO.",
          targetPlan: "pro",
        };
      }

      const base = context.trim();
      return {
        ok: true,
        text: base
          ? `Activa ahora: ${base}. Compra segura y entrega rapida.`
          : "Activa ahora tu compra. Oferta limitada con entrega rapida.",
      };
    },
    [aiLevel],
  );

  return useMemo(
    () => ({
      aiLevel,
      canUseBasicAI: aiLevel === "basic" || aiLevel === "advanced",
      canUseAdvancedAI: aiLevel === "advanced",
      recommendedUpgradePlan: pickUpgrade(aiLevel),
      generateProductDescription,
      improveShortCopy,
      optimizeMenu,
      optimizeStore,
      suggestCTA,
      upsell: permissions.getUpsellMessage("ai"),
    }),
    [
      aiLevel,
      generateProductDescription,
      improveShortCopy,
      optimizeMenu,
      optimizeStore,
      permissions,
      suggestCTA,
    ],
  );
}
