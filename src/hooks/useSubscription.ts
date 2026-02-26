"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { SubscriptionClientSummary as BaseSubscriptionClientSummary } from "@/lib/subscription/client";
import { canAccessFeature, getPlanLimits, SubscriptionFeature, toPlanType } from "@/lib/permissions";

export interface SubscriptionClientSummary extends BaseSubscriptionClientSummary {
  features: Record<SubscriptionFeature, boolean>;
}

interface CurrentSubscriptionResponse {
  degraded?: boolean;
  summary: SubscriptionClientSummary;
  pendingRequests: Array<{
    id: string;
    requestedPlan: "FREE" | "BUSINESS" | "PRO";
    paymentMethod: "YAPE" | "PLIN" | "TRANSFERENCIA";
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
  }>;
}

const ALL_FEATURES: SubscriptionFeature[] = [
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

type FirestorePlanPayload = {
  plan?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionStartAt?: number | string;
  subscriptionEndAt?: number | string;
};

function parseDateValue(input: unknown, fallback: Date): Date {
  if (typeof input === "number" && Number.isFinite(input)) {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  if (typeof input === "string" && input.trim()) {
    const asNumber = Number(input);
    if (Number.isFinite(asNumber)) {
      const parsed = new Date(asNumber);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
}

function toSubscriptionStatus(input?: string | null): "ACTIVE" | "EXPIRED" | "PENDING" {
  const normalized = String(input || "").trim().toUpperCase();
  if (normalized === "ACTIVE" || normalized === "EXPIRED" || normalized === "PENDING") {
    return normalized;
  }
  return "ACTIVE";
}

function buildSummaryFromFirestore(
  userId: string,
  payload: FirestorePlanPayload,
  baseSummary?: SubscriptionClientSummary | null,
): SubscriptionClientSummary | null {
  const rawPlan = String(payload.subscriptionPlan || payload.plan || "").trim();
  if (!rawPlan) return null;

  const plan = toPlanType(rawPlan);
  const rawStatus = toSubscriptionStatus(payload.subscriptionStatus);
  const now = new Date();
  const startDate = parseDateValue(payload.subscriptionStartAt, now);
  const endFallbackDays = plan === "FREE" ? 3650 : 30;
  const endDate = parseDateValue(
    payload.subscriptionEndAt,
    new Date(now.getTime() + endFallbackDays * 24 * 60 * 60 * 1000),
  );
  const expiredByDate = endDate.getTime() <= Date.now();
  const status: "ACTIVE" | "EXPIRED" | "PENDING" =
    expiredByDate && rawStatus === "ACTIVE" ? "EXPIRED" : rawStatus;
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  const expiringSoon = daysRemaining > 0 && daysRemaining <= 5;
  const trialDaysTotal =
    plan === "BUSINESS"
      ? Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)))
      : 0;
  const isBusinessTrial = plan === "BUSINESS" && trialDaysTotal > 0 && trialDaysTotal <= 14;
  const trialExpired = isBusinessTrial && status === "EXPIRED";
  const limits = getPlanLimits(plan);
  const features = ALL_FEATURES.reduce<Record<SubscriptionFeature, boolean>>((acc, feature) => {
    acc[feature] = status === "ACTIVE" && canAccessFeature(plan, feature);
    return acc;
  }, {} as Record<SubscriptionFeature, boolean>);

  return {
    userId,
    plan,
    status,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    expiringSoon,
    daysRemaining,
    isBusinessTrial,
    trialDaysRemaining: isBusinessTrial && status === "ACTIVE" ? daysRemaining : 0,
    trialDaysTotal: isBusinessTrial ? trialDaysTotal : 0,
    trialExpired,
    limits,
    usage: baseSummary?.usage || { publishedPages: 0 },
    features,
  };
}

export function useSubscription(enabled = true) {
  const [summary, setSummary] = useState<SubscriptionClientSummary | null>(null);
  const [pendingRequests, setPendingRequests] = useState<CurrentSubscriptionResponse["pendingRequests"]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let apiSummary: SubscriptionClientSummary | null = null;
    let apiPending: CurrentSubscriptionResponse["pendingRequests"] = [];
    let apiError: string | null = null;
    let apiDegraded = false;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/subscription/current", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo cargar suscripcion");
      }
      const data = (await response.json()) as CurrentSubscriptionResponse;
      apiSummary = data.summary;
      apiPending = data.pendingRequests || [];
      apiDegraded = data.degraded === true;
    } catch (requestError: any) {
      apiError = requestError?.message || "No se pudo cargar suscripcion";
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data() as FirestorePlanPayload | undefined;
      const firestoreSummary = buildSummaryFromFirestore(currentUser.uid, userData || {}, apiSummary);
      const shouldPreferFirestore =
        Boolean(firestoreSummary) &&
        (
          apiDegraded ||
          !apiSummary ||
          (apiSummary.plan === "FREE" && firestoreSummary?.plan !== "FREE") ||
          (apiSummary.status !== "ACTIVE" && firestoreSummary?.status === "ACTIVE")
        );

      if (shouldPreferFirestore && firestoreSummary) {
        setSummary(firestoreSummary);
        setPendingRequests(apiPending);
        setError(apiError);
      } else if (apiSummary) {
        setSummary(apiSummary);
        setPendingRequests(apiPending);
        setError(apiError);
      } else if (firestoreSummary) {
        setSummary(firestoreSummary);
        setPendingRequests(apiPending);
        setError(null);
      } else {
        setError(apiError || "No se pudo cargar suscripcion");
      }
    } catch (firestoreError: any) {
      if (apiSummary) {
        setSummary(apiSummary);
        setPendingRequests(apiPending);
        setError(apiError);
      } else {
        setError(firestoreError?.message || apiError || "No se pudo cargar suscripcion");
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, () => {
      reload();
    });
    reload();
    return () => unsubscribe();
  }, [enabled, reload]);

  const hasFeature = useCallback(
    (feature: SubscriptionFeature) => {
      return Boolean(summary?.features?.[feature]);
    },
    [summary],
  );

  return useMemo(
    () => ({
      summary,
      pendingRequests,
      loading,
      error,
      reload,
      hasFeature,
    }),
    [summary, pendingRequests, loading, error, reload, hasFeature],
  );
}

