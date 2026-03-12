"use client";

import { auth } from "@/lib/firebase";

export interface SubscriptionClientSummary {
  userId: string;
  plan: "FREE" | "BUSINESS" | "PRO";
  status: "ACTIVE" | "EXPIRED" | "PENDING";
  startDate: string;
  endDate: string;
  expiringSoon: boolean;
  daysRemaining: number;
  isBusinessTrial: boolean;
  trialDaysRemaining: number;
  trialDaysTotal: number;
  trialExpired: boolean;
  limits: {
    maxPublishedPages: number | null;
    maxBasicThemes: number | null;
    maxProjects: number | null;
    maxProductsPerProject: number | null;
  };
  usage: {
    publishedPages: number;
  };
  features: Record<string, boolean>;
}

export async function fetchCurrentSubscriptionSummary(): Promise<SubscriptionClientSummary> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Debes iniciar sesion para validar tu plan.");
  }

  const token = await currentUser.getIdToken();
  const response = await fetch("/api/subscription/current", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.summary) {
    throw new Error(data?.error || "No se pudo validar la suscripcion.");
  }
  return data.summary as SubscriptionClientSummary;
}

export async function assertCanPublishPageByPlan() {
  const summary = await fetchCurrentSubscriptionSummary();
  const limit = summary.limits.maxPublishedPages;
  if (limit != null && summary.usage.publishedPages >= limit) {
    throw new Error(
      `Limite alcanzado: tu plan ${summary.plan} permite ${limit} proyecto(s) publicados.`,
    );
  }
  return summary;
}

