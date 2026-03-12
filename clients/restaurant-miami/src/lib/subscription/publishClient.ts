"use client";

import { fetchCurrentSubscriptionSummary } from "@/lib/subscription/client";

export type PublishTargetMode = "existing" | "new";
export type PublishTargetSelection = PublishTargetMode | "cancelled";

interface PublishTargetPromptOptions {
  hasExistingProject: boolean;
  entityLabel?: string;
}

interface PublishQuotaCheckOptions {
  mode: PublishTargetMode;
  alreadyPublished: boolean;
}

export interface PublishQuotaCheckResult {
  used: number;
  limit: number | null;
  next: number;
  consumesSlot: boolean;
}

function requestPublishTargetWithConfirm(entityLabel: string): PublishTargetSelection {
  if (typeof window === "undefined") return "existing";

  const wantsNewProject = window.confirm(
    `Publicar ${entityLabel}:\nAceptar = Publicar como proyecto nuevo\nCancelar = Actualizar proyecto existente`,
  );
  if (wantsNewProject) return "new";

  const wantsExistingProject = window.confirm(
    `Confirmar accion:\nAceptar = Actualizar proyecto existente\nCancelar = No publicar ahora`,
  );
  return wantsExistingProject ? "existing" : "cancelled";
}

function shouldUseConfirmFallback(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(pointer: coarse)")?.matches ||
    window.matchMedia?.("(max-width: 1023px)")?.matches ||
    "ontouchstart" in window
  );
}

export function requestPublishTarget(options: PublishTargetPromptOptions): PublishTargetSelection {
  if (typeof window === "undefined") {
    return options.hasExistingProject ? "existing" : "new";
  }

  if (!options.hasExistingProject) return "new";

  const label = options.entityLabel || "proyecto";
  if (shouldUseConfirmFallback()) {
    return requestPublishTargetWithConfirm(label);
  }

  const answer = window.prompt(
    `Publicar ${label}:\n1 = Actualizar proyecto existente\n2 = Publicar como proyecto nuevo\n\nEscribe 1 o 2.`,
    "1",
  );

  if (answer == null) return "cancelled";
  const normalized = answer.trim().toLowerCase();
  if (normalized === "2" || normalized === "nuevo" || normalized === "new") return "new";
  if (
    normalized === "1" ||
    normalized === "existente" ||
    normalized === "actualizar" ||
    normalized === "existing"
  ) {
    return "existing";
  }
  return requestPublishTargetWithConfirm(label);
}

export async function assertCanPublishWithMode(
  options: PublishQuotaCheckOptions,
): Promise<PublishQuotaCheckResult> {
  const summary = await fetchCurrentSubscriptionSummary();
  const status = String(summary.status || "").toUpperCase();

  if (status !== "ACTIVE") {
    throw new Error("Tu periodo activo termino. Renueva en Billing para reactivar y publicar proyectos.");
  }

  const limit = summary.limits.maxProjects ?? summary.limits.maxPublishedPages ?? null;
  const used = Number(summary.usage.publishedPages || 0);
  const consumesSlot = options.mode === "new" || !options.alreadyPublished;
  const next = consumesSlot ? used + 1 : used;

  if (limit != null && next > limit) {
    throw new Error(
      `Limite alcanzado: ${used}/${limit} proyectos publicados. Renueva o sube de plan en Billing.`,
    );
  }

  return {
    used,
    limit,
    next,
    consumesSlot,
  };
}

export function confirmPublishSlot(check: PublishQuotaCheckResult) {
  if (typeof window === "undefined") return true;
  if (!check.consumesSlot || check.limit == null || check.next < 2) return true;
  return window.confirm(
    `Se publicara como proyecto ${check.next}/${check.limit}. Deseas continuar?`,
  );
}
