"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { auth } from "@/lib/firebase";
import PricingTable from "@/components/subscription/PricingTable";
import PlanBadge from "@/components/subscription/PlanBadge";
import SubscriptionExpiryBanner from "@/components/subscription/SubscriptionExpiryBanner";
import { PLAN_DEFINITIONS } from "@/lib/subscription/plans";

type PlanType = "FREE" | "BUSINESS" | "PRO";
type PaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA";

const PAYMENT_INSTRUCTIONS: Record<PaymentMethod, string> = {
  YAPE: "Yape al 999 999 999. En el motivo coloca tu correo de Fast Page.",
  PLIN: "Plin al 999 999 998. En el detalle incluye el plan que deseas activar.",
  TRANSFERENCIA:
    "Transferencia a BCP Cuenta Corriente 191-1234567-0-98 (CCI: 00219100123456709811).",
};

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { summary, pendingRequests, loading, error, reload } = useSubscription(Boolean(user?.uid));
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("BUSINESS");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("YAPE");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activePlan = summary?.plan || "FREE";

  const requestedPlanOptions = useMemo(
    () => PLAN_DEFINITIONS.filter((plan) => plan.id !== "FREE"),
    [],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    if (!user?.uid) return;
    if (selectedPlan === "FREE") {
      setFeedback({ type: "error", text: "Selecciona BUSINESS o PRO para generar la solicitud." });
      return;
    }

    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
      }

      const formData = new FormData();
      formData.append("plan", selectedPlan);
      formData.append("paymentMethod", paymentMethod);
      formData.append("notes", notes);
      if (proofFile) {
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
        text: "Solicitud enviada. Quedó en estado pendiente hasta validación admin.",
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Facturación SaaS</p>
              <h1 className="mt-2 text-3xl font-black">Gestión de Suscripción</h1>
              <p className="mt-2 text-zinc-300">
                Controla tus planes de LinkHub y páginas B2B desde un solo lugar.
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
        </header>

        <PricingTable activePlan={activePlan} onSelectPlan={setSelectedPlan} loadingPlan={null} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 space-y-5"
          >
            <div>
              <h2 className="text-xl font-bold">Solicitar actualización de plan</h2>
              <p className="mt-1 text-sm text-zinc-300">
                El estado se mantiene en pendiente hasta validación del administrador.
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

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                Método de pago
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

            <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-3 text-sm text-cyan-100">
              {PAYMENT_INSTRUCTIONS[paymentMethod]}
            </div>

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

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                Notas
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm resize-none"
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
              disabled={submitting || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-100 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enviar solicitud de pago
            </button>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
            <h3 className="text-lg font-bold">Estado de solicitudes</h3>
            <div className="mt-4 space-y-3">
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
                    <p className="text-zinc-500 text-xs">
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
