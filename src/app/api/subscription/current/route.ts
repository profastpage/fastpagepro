import { NextRequest, NextResponse } from "next/server";
import { buildSubscriptionSummary, getPendingRequestsByUser } from "@/lib/subscription/service";
import { requireFirebaseUserId } from "@/lib/server/requireFirebaseUser";
import { canAccessFeature, getPlanLimits, type SubscriptionFeature } from "@/lib/permissions";

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

export async function GET(request: NextRequest) {
  let userId = "";
  try {
    userId = await requireFirebaseUserId(request);
    const [summary, pendingRequests] = await Promise.all([
      buildSubscriptionSummary(userId),
      getPendingRequestsByUser(userId),
    ]);

    return NextResponse.json({
      summary,
      pendingRequests: pendingRequests.map((requestItem) => ({
        id: requestItem.id,
        requestedPlan: requestItem.requestedPlan,
        paymentMethod: requestItem.paymentMethod,
        status: requestItem.status,
        createdAt: requestItem.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }

    console.error("[Subscription Current] Error:", error);

    if (userId) {
      const now = new Date();
      const endDate = new Date(now.getTime() + 3650 * 24 * 60 * 60 * 1000);
      const features = ALL_FEATURES.reduce<Record<SubscriptionFeature, boolean>>(
        (acc, feature) => {
          acc[feature] = canAccessFeature("FREE", feature);
          return acc;
        },
        {} as Record<SubscriptionFeature, boolean>,
      );

      return NextResponse.json(
        {
          degraded: true,
          summary: {
            userId,
            plan: "FREE",
            status: "ACTIVE",
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            expiringSoon: false,
            daysRemaining: 3650,
            limits: getPlanLimits("FREE"),
            usage: {
              publishedPages: 0,
            },
            features,
          },
          pendingRequests: [],
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "No se pudo obtener la suscripcion actual" }, { status: 500 });
  }
}
