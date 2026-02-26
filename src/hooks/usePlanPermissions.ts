"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import {
  canAccessFeature,
  CanonicalPlanType,
  getPlanAiLevel,
  getPlanAnalyticsLevel,
  getPlanLimits,
  toCanonicalPlanType,
  toPlanType,
} from "@/lib/permissions";
import { db, auth } from "@/lib/firebase";
import { useSubscription } from "@/hooks/useSubscription";

export type PlanUpsellReason = "ai" | "branding" | "insights" | "limit" | "cloner";

export interface PlanUpsellMessage {
  reason: PlanUpsellReason;
  title: string;
  description: string;
  targetPlan: "business" | "pro" | "agency";
}

interface UsageSnapshot {
  publishedProjects: number;
  maxProductsInOneProject: number;
}

const LIMIT_WARNING_THRESHOLD = 0.8;

function extractProductCount(project: Record<string, unknown>): number {
  const byStore = Array.isArray(project.storeProducts) ? project.storeProducts.length : 0;
  const byCatalog = Array.isArray(project.catalogItems) ? project.catalogItems.length : 0;
  const byProducts = Array.isArray(project.products) ? project.products.length : 0;

  if (byStore > 0 || byCatalog > 0 || byProducts > 0) {
    return Math.max(byStore, byCatalog, byProducts);
  }

  const storeConfig = project.storeConfig;
  if (storeConfig && typeof storeConfig === "object") {
    const nested = storeConfig as Record<string, unknown>;
    if (Array.isArray(nested.products)) return nested.products.length;
  }

  return 0;
}

async function readPublishedStoreProjects(uid: string): Promise<Array<Record<string, unknown>>> {
  const byStatusQuery = query(
    collection(db, "cloned_sites"),
    where("userId", "==", uid),
    where("status", "==", "published"),
  );

  try {
    const snapshot = await getDocs(byStatusQuery);
    return snapshot.docs.map((item) => item.data() as Record<string, unknown>);
  } catch {
    const byLegacyFlagQuery = query(
      collection(db, "cloned_sites"),
      where("userId", "==", uid),
      where("published", "==", true),
    );
    const snapshot = await getDocs(byLegacyFlagQuery);
    return snapshot.docs.map((item) => item.data() as Record<string, unknown>);
  }
}

async function readUsageSnapshot(uid: string, fallbackPublishedPages: number): Promise<UsageSnapshot> {
  const [publishedSites, linkProfileSnapshot] = await Promise.all([
    readPublishedStoreProjects(uid),
    getDoc(doc(db, "link_profiles", uid)),
  ]);

  let publishedProjects = publishedSites.length;
  let maxProductsInOneProject = publishedSites.reduce((max, project) => {
    return Math.max(max, extractProductCount(project));
  }, 0);

  if (linkProfileSnapshot.exists()) {
    const linkProfile = linkProfileSnapshot.data() as Record<string, unknown>;
    if (linkProfile.published === true) {
      publishedProjects += 1;
    }
    if (Array.isArray(linkProfile.catalogItems)) {
      maxProductsInOneProject = Math.max(maxProductsInOneProject, linkProfile.catalogItems.length);
    }
  }

  return {
    publishedProjects: Math.max(publishedProjects, fallbackPublishedPages),
    maxProductsInOneProject,
  };
}

function getNextPlan(currentPlan: CanonicalPlanType): "business" | "pro" | "agency" {
  if (currentPlan === "starter") return "business";
  if (currentPlan === "business") return "pro";
  return "agency";
}

export function usePlanPermissions(enabled = true) {
  const { summary, loading: subscriptionLoading } = useSubscription(enabled);

  const [firestorePlan, setFirestorePlan] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageSnapshot>({
    publishedProjects: 0,
    maxProductsInOneProject: 0,
  });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const uid = summary?.userId || auth.currentUser?.uid;
    if (!uid) {
      setLoading(subscriptionLoading);
      return;
    }

    let cancelled = false;
    const fallbackPublishedPages = Number(summary?.usage?.publishedPages || 0);

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [userSnapshot, usageSnapshot] = await Promise.all([
          getDoc(doc(db, "users", uid)),
          readUsageSnapshot(uid, fallbackPublishedPages),
        ]);

        if (cancelled) return;

        const userData = userSnapshot.data() as Record<string, unknown> | undefined;
        const rawPlan = String(userData?.plan || userData?.subscriptionPlan || "").trim();

        setFirestorePlan(rawPlan || null);
        setUsage(usageSnapshot);
      } catch (currentError: any) {
        if (cancelled) return;
        setError(currentError?.message || "No se pudieron calcular permisos del plan.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, subscriptionLoading, summary?.userId, summary?.usage?.publishedPages]);

  return useMemo(() => {
    const resolvedRawPlan = firestorePlan || summary?.plan || "FREE";
    const canonicalPlan = toCanonicalPlanType(resolvedRawPlan);
    const legacyPlan = toPlanType(canonicalPlan);
    const limits = getPlanLimits(canonicalPlan);

    const maxProjects = limits.maxProjects;
    const maxProductsPerProject = limits.maxProductsPerProject;

    const projectUsagePercent = maxProjects
      ? Math.min(1, usage.publishedProjects / maxProjects)
      : 0;
    const productUsagePercent = maxProductsPerProject
      ? Math.min(1, usage.maxProductsInOneProject / maxProductsPerProject)
      : 0;

    const nearProjectLimit = maxProjects != null && projectUsagePercent >= LIMIT_WARNING_THRESHOLD;
    const nearProductLimit =
      maxProductsPerProject != null && productUsagePercent >= LIMIT_WARNING_THRESHOLD;

    const canRemoveBranding = canAccessFeature(canonicalPlan, "removeBranding");
    const canUseCustomDomain = canAccessFeature(canonicalPlan, "customDomain");
    const canUseCloner = canAccessFeature(canonicalPlan, "clonerAccess");
    const aiLevel = getPlanAiLevel(canonicalPlan);
    const analyticsLevel = getPlanAnalyticsLevel(canonicalPlan);

    const getUpsellMessage = (reason: PlanUpsellReason): PlanUpsellMessage | null => {
      if (reason === "ai") {
        if (aiLevel !== "none") return null;
        return {
          reason,
          title: "Business: IA + tienda completa",
          description:
            "Activa Business para usar IA basica, hasta 5 proyectos, hasta 50 productos por proyecto, dominio propio y soporte por correo.",
          targetPlan: "business",
        };
      }

      if (reason === "branding") {
        if (canRemoveBranding) return null;
        return {
          reason,
          title: "PRO: publica sin branding",
          description:
            "Sube a PRO para quitar branding y desbloquear IA avanzada, metricas PRO con insights y soporte en vivo por WhatsApp.",
          targetPlan: "pro",
        };
      }

      if (reason === "insights") {
        if (analyticsLevel === "pro") return null;
        return {
          reason,
          title: "PRO: insights y rendimiento tecnico",
          description:
            "Business incluye metricas basicas. En PRO obtienes insights automaticos y analisis tecnico (LCP/SEO/Accesibilidad).",
          targetPlan: "pro",
        };
      }

      if (reason === "cloner") {
        if (canUseCloner) return null;
        return {
          reason,
          title: "PRO: clona y escala mas rapido",
          description:
            "El Clonador y las exportaciones avanzadas estan habilitados en PRO para escalar con mas velocidad.",
          targetPlan: "pro",
        };
      }

      if (!nearProjectLimit && !nearProductLimit) return null;

      const targetPlan = getNextPlan(canonicalPlan);
      const parts: string[] = [];

      if (nearProjectLimit && maxProjects != null) {
        parts.push(`Ya usaste ${usage.publishedProjects}/${maxProjects} proyectos publicados.`);
      }
      if (nearProductLimit && maxProductsPerProject != null) {
        parts.push(
          `Tu proyecto mas grande ya usa ${usage.maxProductsInOneProject}/${maxProductsPerProject} productos.`,
        );
      }

      return {
        reason,
        title: "Estas cerca del limite de tu plan",
        description: parts.join(" "),
        targetPlan,
      };
    };

    return {
      loading: loading || subscriptionLoading,
      error,
      canonicalPlan,
      legacyPlan,
      canRemoveBranding,
      canUseCustomDomain,
      canUseCloner,
      aiLevel,
      analyticsLevel,
      maxProjects,
      maxProductsPerProject,
      usage,
      nearProjectLimit,
      nearProductLimit,
      getUpsellMessage,
    };
  }, [error, firestorePlan, loading, subscriptionLoading, summary?.plan, usage]);
}

