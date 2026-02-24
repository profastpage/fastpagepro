"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { SubscriptionFeature } from "@/lib/permissions";
import { SubscriptionClientSummary as BaseSubscriptionClientSummary } from "@/lib/subscription/client";
import { onAuthStateChanged } from "firebase/auth";

export interface SubscriptionClientSummary extends BaseSubscriptionClientSummary {
  features: Record<SubscriptionFeature, boolean>;
}

interface CurrentSubscriptionResponse {
  summary: SubscriptionClientSummary;
  pendingRequests: Array<{
    id: string;
    requestedPlan: "FREE" | "BUSINESS" | "PRO";
    paymentMethod: "YAPE" | "PLIN" | "TRANSFERENCIA";
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
  }>;
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
        throw new Error(data?.error || "No se pudo cargar suscripción");
      }
      const data = (await response.json()) as CurrentSubscriptionResponse;
      setSummary(data.summary);
      setPendingRequests(data.pendingRequests || []);
    } catch (requestError: any) {
      setError(requestError?.message || "No se pudo cargar suscripción");
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
