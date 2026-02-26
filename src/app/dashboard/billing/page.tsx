"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanPermissions, type PlanUpsellReason } from "@/hooks/usePlanPermissions";
import { auth } from "@/lib/firebase";
import PricingTable from "@/components/subscription/PricingTable";
import PlanBadge from "@/components/subscription/PlanBadge";
import SubscriptionExpiryBanner from "@/components/subscription/SubscriptionExpiryBanner";
import { PLAN_DEFINITIONS, type PlanType } from "@/lib/subscription/plans";

type PaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA";

const PAYMENT_INSTRUCTIONS: Record<PaymentMethod, string> = {
  YAPE: "Yape al 999 999 999. En el motivo coloca tu correo de Fast Page.",
  PLIN: "Plin al 999 999 998. En el detalle incluye el plan que deseas activar.",
  TRANSFERENCIA:
    "Transferencia a BCP Cuenta Corriente 191-1234567-0-98 (CCI: 00219100123456709811).",
};

const REASON_BY_FEATURE: Record<string, PlanUpsellReason> = {
  aiOptimization: "ai",
  removeBranding: "branding",
  advancedMetrics: "insights",
  insightsAutomation: "insights",
  clonerAccess: "cloner",
};

const TARGET_TO_PLAN: Record<string, PlanType> = {
  business: "BUSINESS",
  pro: "PRO",
  agency: "PRO",
};

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { summary, pendingRequests, loading, error, reload } = useSubscription(Boolean(user?.uid));
  const permissions = usePlanPermissions(Boolean(user?.uid));
  const [requiredFeature, setRequiredFeature] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("BUSINESS");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("YAPE");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activePlan = summary?.plan || "FREE";
  const isBusinessTrial = selectedPlan === "BUSINESS";

  const requestedPlanOptions = useMemo(() => PLAN_DEFINITIONS, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setRequiredFeature(String(params.get("requiredFeature") || "").trim());
  }, []);

  const upsells = useMemo(() => {
    const reasons = new Set<PlanUpsellReason>(["ai", "branding", "insights", "cloner", "limit"]);

    const fromFeature = REASON_BY_FEATURE[requiredFeature];
    if (fromFeature) {
      reasons.add(fromFeature);
    }

    return Array.from(reasons)
      .map((reason) => permissions.getUpsellMessage(reason))
      .filter((entry): entry is NonNullable<ReturnType<typeof permissions.getUpsellMessage>> =>
        Boolean(entry),
      );
  }, [permissions, requiredFeature]);

  const usageRows = useMemo(() => {
    return [
      {
        label: "Proyectos publicados",
        value:
          permissions.maxProjects == null
            ? `${permissions.usage.publishedProjects} / Ilimitado`
            : `${permissions.usage.publishedProjects} / ${permissions.maxProjects}`,
      },
      {
        label: "Productos en proyecto mas grande",
        value:
          permissions.maxProductsPerProject == null
            ? `${permissions.usage.maxProductsInOneProject} / Ilimitado`
            : `${permissions.usage.maxProductsInOneProject} / ${permissions.maxProductsPerProject}`,
      },
      {
        label: "Dominio propio",
        value: permissions.canUseCustomDomain ? "Permitido" : "No disponible",
      },
      {
        label: "Branding removible",
        value: permissions.canRemoveBranding ? "Si" : "No",
      },
      {
        label: "IA",
        value: permissions.aiLevel,
      },
      {
        label: "Metricas",
        value: permissions.analyticsLevel,
      },
    ];
  }, [permissions]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    if (!user?.uid) return;

    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Tu sesion expiro. Inicia sesion nuevamente.");
      }

      const formData = new FormData();
      formData.append("plan", selectedPlan);
      formData.append("paymentMethod", paymentMethod);
      formData.append("trial", isBusinessTrial ? "true" : "false");
      formData.append("notes", notes);
      if (proofFile && !isBusinessTrial) {
        formData.append("proof", proofFile);
      }

      const response = await fetch("/api/subscription/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo registrar la solicitud.");
      }

      setFeedback({
        type: "success",
        text: isBusinessTrial
          ? "Business activo en prueba de 14 dias. Luego podras renovar mensual."
          : "Solicitud enviada. Quedo en estado pendiente hasta validacion admin.",
      });
      setProofFile(null);
      setNotes("");
      await reload();
    } catch (submitError: any) {
      setFeedback({
        type: "error",
        text: submitError?.message || "No se pudo procesar la solicitud de pago.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Facturacion SaaS</p>
              <h1 className="mt-2 text-3xl font-black">Planes oficiales Fast Page</h1>
              <p className="mt-2 text-zinc-300">
                Starter S/29 pago directo, Business con 14 días gratis y Pro S/99 pago directo.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs text-zinc-400">Plan activo:</span>
              <PlanBadge plan={activePlan} />
            </div>
          </div>

          <div className="mt-4">
            <SubscriptionExpiryBanner
              visible={Boolean(summary?.expiringSoon)}
              daysRemaining={summary?.daysRemaining || 0}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {permissions.error && (
            <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {permissions.error}
            </p>
          )}
        </header>

        {upsells.length > 0 && (
          <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {upsells.map((upsell) => (
              <article
                key={upsell.reason}
                className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-amber-200" />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-amber-100">{upsell.title}</p>
                    <p className="mt-1 text-xs text-amber-100/90">{upsell.description}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(TARGET_TO_PLAN[upsell.targetPlan])}
                      className="mt-3 rounded-lg border border-amber-200/40 bg-amber-400/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-100"
                    >
                      Ir a {TARGET_TO_PLAN[upsell.targetPlan]}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <PricingTable activePlan={activePlan} onSelectPlan={setSelectedPlan} loadingPlan={null} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-zinc-950/70 p-6"
          >
            <div>
              <h2 className="text-xl font-bold">Solicitar actualizacion de plan</h2>
              <p className="mt-1 text-sm text-zinc-300">
                Business activa prueba de 14 días. Starter y Pro aplican pago directo mensual.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                Plan solicitado
              </span>
              <select
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value as PlanType)}
              >
                {requestedPlanOptions.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.monthlyPriceLabel}
                  </option>
                ))}
              </select>
            </label>

            {!isBusinessTrial ? (
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Metodo de pago
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {(["YAPE", "PLIN", "TRANSFERENCIA"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                        paymentMethod === method
                          ? "border-amber-300/45 bg-amber-400/12 text-amber-100"
                          : "border-white/15 bg-white/5 text-zinc-200"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </label>
            ) : null}

            {isBusinessTrial ? (
              <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-100">
                Prueba gratis por 14 días. Luego S/59/mes. Cancela cuando quieras. Sin compromiso.
              </div>
            ) : (
              <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-3 text-sm text-cyan-100">
                {PAYMENT_INSTRUCTIONS[paymentMethod]}
              </div>
            )}

            {!isBusinessTrial ? (
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  Subir comprobante
                </span>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm">
                  <UploadCloud className="h-4 w-4 text-zinc-300" />
                  <span className="truncate text-zinc-200">
                    {proofFile ? proofFile.name : "Adjuntar PNG, JPG, WEBP o PDF (opcional)"}
                  </span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.pdf"
                    className="hidden"
                    onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                  />
                </label>
              </label>
            ) : null}

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                Notas
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
                placeholder="Ejemplo: pago realizado desde cuenta empresarial."
              />
            </label>

            {feedback && (
              <div
                className={`rounded-xl border px-3 py-2 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                    : "border-red-300/30 bg-red-400/10 text-red-100"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loading || permissions.loading}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-100 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isBusinessTrial ? "Probar 14 días gratis" : selectedPlan === "PRO" ? "Comprar ahora" : "Empezar ahora"}
            </button>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
            <h3 className="text-lg font-bold">Estado real de permisos</h3>
            <div className="mt-4 space-y-2 text-sm">
              {usageRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <span className="text-zinc-300">{row.label}</span>
                  <span className="font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>

            <h4 className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-zinc-400">
              Solicitudes pendientes
            </h4>
            <div className="mt-3 space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-4 text-sm text-zinc-400">
                  No tienes solicitudes pendientes.
                </p>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-sm"
                  >
                    <p className="font-semibold text-white">{request.requestedPlan}</p>
                    <p className="text-zinc-300">Pago: {request.paymentMethod}</p>
                    <p className="text-zinc-400">Estado: {request.status}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

