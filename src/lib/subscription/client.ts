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
  limits: {
    maxPublishedPages: number | null;
    maxBasicThemes: number | null;
  };
  usage: {
    publishedPages: number;
  };
  features: Record<string, boolean>;
}

export async function fetchCurrentSubscriptionSummary(): Promise<SubscriptionClientSummary> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Debes iniciar sesión para validar tu plan.");
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
    throw new Error(data?.error || "No se pudo validar la suscripción.");
  }
  return data.summary as SubscriptionClientSummary;
}

export async function assertCanPublishPageByPlan() {
  const summary = await fetchCurrentSubscriptionSummary();
  const limit = summary.limits.maxPublishedPages;
  if (limit != null && summary.usage.publishedPages >= limit) {
    throw new Error(
      `Límite alcanzado: tu plan ${summary.plan} permite ${limit} página(s) publicadas.`,
    );
  }
  return summary;
}
