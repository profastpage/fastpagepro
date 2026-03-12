"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanPermissions, type PlanUpsellReason } from "@/hooks/usePlanPermissions";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/LanguageContext";
import PricingTable from "@/components/subscription/PricingTable";
import PlanBadge from "@/components/subscription/PlanBadge";
import SubscriptionExpiryBanner from "@/components/subscription/SubscriptionExpiryBanner";
import MobilePlanStatusCard from "@/components/subscription/MobilePlanStatusCard";
import {
  PLAN_DEFINITIONS,
  calculateSubscriptionAmountSoles,
  type PlanType,
} from "@/lib/subscription/plans";

type PaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA" | "IZIPAY" | "STRIPE";
type CopiedAccountKey = "bcp_soles" | "bcp_cci";
type BillingCycle = "MONTHLY" | "ANNUAL";
type ThemeMarketplacePaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA" | "IZIPAY";

type ReferralSummaryResponse = {
  profile: {
    referralCode: string;
  };
  referralLink: string;
  stats: {
    invited: number;
    converted: number;
    pending: number;
    totalCommissionSoles: number;
  };
};

type ThemePack = {
  id: string;
  name: string;
  vertical: "restaurant" | "ecommerce" | "services";
  description: string;
  includedThemes: string[];
  priceSoles: number;
  badge: string;
};

type ThemeMarketplaceCatalog = {
  packs: ThemePack[];
  ownedPackIds: string[];
  pendingOrders: Array<{
    id: string;
    packId: string;
    packName: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    paymentMethod: ThemeMarketplacePaymentMethod;
  }>;
};

const PAYMENT_INSTRUCTIONS_ES: Record<PaymentMethod, string> = {
  YAPE: "Yape al 906431630. En el motivo coloca tu correo de Fast Page.",
  PLIN: "Plin al 906431630. En el detalle incluye el plan que deseas activar.",
  TRANSFERENCIA: "Transferencia a BCP en soles y adjunta comprobante para validacion.",
  IZIPAY: "Paga con tarjeta o billetera en Izipay y activamos el plan automaticamente.",
  STRIPE: "Paga con tarjeta en Stripe y activamos el plan automaticamente.",
};

const PAYMENT_INSTRUCTIONS_EN: Record<PaymentMethod, string> = {
  YAPE: "Yape to 906431630. Include your Fast Page email in the note.",
  PLIN: "Plin to 906431630. Add the target plan in the detail.",
  TRANSFERENCIA: "Transfer in soles to BCP and attach payment proof for validation.",
  IZIPAY: "Pay with card or wallet on Izipay and we activate your plan automatically.",
  STRIPE: "Pay with card on Stripe and we activate your plan automatically.",
};

const BANK_ACCOUNTS_ES = [
  "BCP Soles: 19103805375011",
  "BCP CCI / Interbancaria: 00219110380537501152",
];

const BANK_ACCOUNTS_EN = [
  "BCP Soles: 19103805375011",
  "BCP interbank account (CCI): 00219110380537501152",
];

const PAYMENT_ACCOUNT_HOLDER = "Fabio Her*";
const PAYMENT_YAPE_NUMBER = "906431630";
const PAYMENT_BCP_SOLES_ACCOUNT = "19103805375011";
const PAYMENT_BCP_CCI = "00219110380537501152";
const DEFAULT_YAPE_QR_URL = "/payments/yape-qr-oficial.png";

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

function normalizePlanIntent(rawValue: string | null): PlanType | null {
  const normalized = String(rawValue || "")
    .trim()
    .toUpperCase();
  if (normalized === "FREE" || normalized === "STARTER" || normalized === "29") return "FREE";
  if (normalized === "BUSINESS" || normalized === "59") return "BUSINESS";
  if (normalized === "PRO" || normalized === "99") return "PRO";
  return null;
}

function normalizePaymentMethodIntent(rawValue: string | null): PaymentMethod | null {
  const normalized = String(rawValue || "")
    .trim()
    .toUpperCase();
  if (
    normalized === "YAPE" ||
    normalized === "PLIN" ||
    normalized === "TRANSFERENCIA" ||
    normalized === "IZIPAY" ||
    normalized === "STRIPE"
  ) {
    return normalized;
  }
  return null;
}

function PaymentBrandLogo({ brand }: { brand: "YAPE" | "BCP" }) {
  const styles: Record<typeof brand, string> = {
    YAPE: "from-violet-500 to-fuchsia-600 text-white",
    BCP: "from-blue-700 to-blue-900 text-white",
  };
  const label: Record<typeof brand, string> = {
    YAPE: "Yape",
    BCP: "BCP",
  };

  return (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-black uppercase tracking-[0.04em] shadow-[0_0_20px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105 ${styles[brand]}`}
    >
      {label[brand]}
    </span>
  );
}

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const { summary, pendingRequests, loading, error, reload } = useSubscription(Boolean(user?.uid));
  const permissions = usePlanPermissions(Boolean(user?.uid));
  const [requiredFeature, setRequiredFeature] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("BUSINESS");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [durationMonths, setDurationMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("YAPE");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmingIzipay, setConfirmingIzipay] = useState(false);
  const [confirmingStripe, setConfirmingStripe] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [referralSummary, setReferralSummary] = useState<ReferralSummaryResponse | null>(null);
  const [loadingReferralSummary, setLoadingReferralSummary] = useState(false);
  const [marketplaceCatalog, setMarketplaceCatalog] = useState<ThemeMarketplaceCatalog | null>(null);
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);
  const [buyingPackId, setBuyingPackId] = useState("");
  const [copiedAccount, setCopiedAccount] = useState<CopiedAccountKey | null>(null);
  const pricingPlansRef = useRef<HTMLElement | null>(null);
  const paymentFormRef = useRef<HTMLFormElement | null>(null);
  const hasAppliedQueryPlanRef = useRef(false);
  const hasAppliedQueryPaymentMethodRef = useRef(false);
  const hasProcessedIzipayQueryRef = useRef(false);
  const hasProcessedStripeQueryRef = useRef(false);
  const hasProcessedMarketplaceQueryRef = useRef(false);
  const yapeQrUrl = String(process.env.NEXT_PUBLIC_YAPE_QR_URL || "").trim() || DEFAULT_YAPE_QR_URL;

  const activePlan = summary?.plan || "FREE";
  const showPaymentFlow = true;
  const i18n = useMemo(
    () =>
      isEnglish
        ? {
            saasBilling: "SaaS Billing",
            title: "Fast Page official plans",
            subtitle:
              "Starter S/29 to launch, Business S/59 to grow with support, and Pro S/99 with advanced conversion tools.",
            activePlan: "Active plan:",
            trialExpired:
              "Your access period ended. Activate Starter, Business, or Pro to reactivate features and pages.",
            updateTitle: "Request plan upgrade",
            updateSubtitle:
              "All plans activate by direct payment. Choose your plan and billing cycle.",
            requestedPlan: "Requested plan",
            paymentMethod: "Payment method",
            trialBlock:
              "Business S/59/month with immediate activation after payment.",
            trialActive:
              "Business is active. Renew before expiration to keep all features available.",
            uploadProof: "Upload payment proof",
            uploadPlaceholder: "Attach PNG, JPG, WEBP or PDF (optional)",
            paymentDestinationsTitle: "Payment destinations",
            paymentDestinationsHint:
              "Send payment with your account email in the note. Then upload proof for manual approval by the super admin.",
            yapeQr: "Yape QR",
            bankAccounts: "Bank accounts",
            accountHolder: "Account holder",
            yapeNumber: "Yape number",
            bcpSolesAccount: "BCP soles account",
            interbankCci: "BCP interbank account (CCI)",
            openQr: "Open QR in full size",
            copyNumber: "Copy number",
            copied: "Copied",
            notes: "Notes",
            notesPlaceholder: "Add any extra details for the admin team.",
            submitBusiness: "Activate Business",
            submitPaid: "Submit payment request",
            submitIzipay: "Pay with Izipay",
            submitStripe: "Pay with Stripe",
            usageTitle: "Current usage and limits",
            projects: "Published projects",
            products: "Products in largest project",
            customDomain: "Custom domain",
            branding: "Removable branding",
            ai: "AI",
            metrics: "Metrics",
            allowed: "Allowed",
            unavailable: "Unavailable",
            unlimited: "Unlimited",
            pendingTitle: "Pending requests",
            pendingEmpty: "No pending requests.",
            pendingPlan: "Plan",
            pendingStatus: "Status",
            pendingMethod: "Method",
            pendingCreated: "Created",
            processing: "Processing...",
            planDaysLeft: "Plan days left",
            trialDaysLeft: "Days left",
            renewalAlert: "5-day renewal alert active. Renew now to avoid lock.",
            billingCycle: "Billing cycle",
            cycleMonthly: "Monthly",
            cycleAnnual: "Annual (12 months)",
            cycleMonthlyMaxDiscount: (discountPercent: number) =>
              `12 months applies up to ${discountPercent}% discount`,
            cycleAnnualMaxDiscount: (discountPercent: number) =>
              `${discountPercent}% discount included`,
            monthsLabel: "Months",
            annualDiscount: "Annual discount",
            monthly12DiscountApplied: (discountPercent: number, totalSoles: number) =>
              `12 months active: max plan discount ${discountPercent}% applied. Final total: S/ ${totalSoles.toFixed(2)}.`,
            paymentSummary: "Payment summary",
            subtotal: "Subtotal",
            discount: "Discount",
            total: "Total",
            izipaySecure: "Secure online payment (Izipay)",
            izipayRedirecting: "Opening secure Izipay checkout...",
            izipayConfirming: "Confirming Izipay payment...",
            izipayPaidSuccess: "Izipay payment confirmed. Your plan is active.",
            izipayPending: "Your Izipay payment is still pending confirmation.",
            stripeSecure: "Secure online payment (Stripe)",
            stripeRedirecting: "Opening secure Stripe checkout...",
            stripeConfirming: "Confirming Stripe payment...",
            stripePaidSuccess: "Stripe payment confirmed. Your plan is active.",
            stripePending: "Your Stripe payment is still pending confirmation.",
            referralsTitle: "Referral program",
            referralsSubtitle: "Share your code and earn commission for each paid activation.",
            referralCode: "Referral code",
            referralLink: "Referral link",
            referralInvited: "Invited",
            referralConverted: "Converted",
            referralPending: "Pending",
            referralCommission: "Commission",
            marketplaceTitle: "Premium theme marketplace",
            marketplaceSubtitle: "Additional monetization: sell or activate premium packs by vertical.",
            buyWithIzipay: "Buy with Izipay",
            requestManual: "Request manual",
            owned: "Active",
            pending: "Pending",
          }
        : {
            saasBilling: "Facturacion SaaS",
            title: "Planes oficiales Fast Page",
            subtitle:
              "Starter S/29 para empezar, Business S/59 para crecer con soporte y Pro S/99 con herramientas avanzadas de conversion.",
            activePlan: "Plan activo:",
            trialExpired:
              "Tu periodo de acceso finalizo. Activa Starter, Business o Pro para reactivar funciones y paginas.",
            updateTitle: "Solicitar actualizacion de plan",
            updateSubtitle:
              "Todos los planes se activan con pago directo. Elige plan y ciclo.",
            requestedPlan: "Plan solicitado",
            paymentMethod: "Metodo de pago",
            trialBlock:
              "Business S/59/mes con activacion inmediata tras pago.",
            trialActive:
              "Business activo. Renueva antes del vencimiento para mantener todas las funciones.",
            uploadProof: "Subir comprobante",
            uploadPlaceholder: "Adjuntar PNG, JPG, WEBP o PDF (opcional)",
            paymentDestinationsTitle: "Destinos de pago",
            paymentDestinationsHint:
              "Realiza el pago con tu correo de cuenta en el detalle. Luego adjunta el comprobante para aprobacion manual del super admin.",
            yapeQr: "QR de Yape",
            bankAccounts: "Cuentas bancarias",
            accountHolder: "Titular",
            yapeNumber: "Numero Yape",
            bcpSolesAccount: "Cuenta BCP soles",
            interbankCci: "Cuenta interbancaria BCP (CCI)",
            openQr: "Abrir QR en tamano completo",
            copyNumber: "Copiar numero",
            copied: "Copiado",
            notes: "Notas",
            notesPlaceholder: "Agrega detalles extra para el equipo admin.",
            submitBusiness: "Activar Business",
            submitPaid: "Enviar solicitud de pago",
            submitIzipay: "Pagar con Izipay",
            submitStripe: "Pagar con Stripe",
            usageTitle: "Uso actual y limites",
            projects: "Proyectos publicados",
            products: "Productos en proyecto mas grande",
            customDomain: "Dominio propio",
            branding: "Branding removible",
            ai: "IA",
            metrics: "Metricas",
            allowed: "Permitido",
            unavailable: "No disponible",
            unlimited: "Ilimitado",
            pendingTitle: "Solicitudes pendientes",
            pendingEmpty: "No tienes solicitudes pendientes.",
            pendingPlan: "Plan",
            pendingStatus: "Estado",
            pendingMethod: "Metodo",
            pendingCreated: "Creado",
            processing: "Procesando...",
            planDaysLeft: "Dias restantes del plan",
            trialDaysLeft: "Dias restantes",
            renewalAlert: "Alerta de renovacion en 5 dias. Renueva ahora para evitar bloqueo.",
            billingCycle: "Ciclo de cobro",
            cycleMonthly: "Mensual",
            cycleAnnual: "Anual (12 meses)",
            cycleMonthlyMaxDiscount: (discountPercent: number) =>
              `12 meses aplica hasta ${discountPercent}% descuento`,
            cycleAnnualMaxDiscount: (discountPercent: number) =>
              `${discountPercent}% descuento incluido`,
            monthsLabel: "Meses",
            annualDiscount: "Descuento anual",
            monthly12DiscountApplied: (discountPercent: number, totalSoles: number) =>
              `12 meses activo: descuento maximo del plan ${discountPercent}% aplicado. Total final: S/ ${totalSoles.toFixed(2)}.`,
            paymentSummary: "Resumen de pago",
            subtotal: "Subtotal",
            discount: "Descuento",
            total: "Total",
            izipaySecure: "Pago seguro online (Izipay)",
            izipayRedirecting: "Abriendo checkout seguro de Izipay...",
            izipayConfirming: "Confirmando pago Izipay...",
            izipayPaidSuccess: "Pago Izipay confirmado. Tu plan ya esta activo.",
            izipayPending: "Tu pago Izipay sigue pendiente de confirmacion.",
            stripeSecure: "Pago seguro online (Stripe)",
            stripeRedirecting: "Abriendo checkout seguro de Stripe...",
            stripeConfirming: "Confirmando pago Stripe...",
            stripePaidSuccess: "Pago Stripe confirmado. Tu plan ya esta activo.",
            stripePending: "Tu pago Stripe sigue pendiente de confirmacion.",
            referralsTitle: "Programa de referidos",
            referralsSubtitle: "Comparte tu codigo y gana comision por cada activacion pagada.",
            referralCode: "Codigo de referido",
            referralLink: "Link de referido",
            referralInvited: "Invitados",
            referralConverted: "Convertidos",
            referralPending: "Pendientes",
            referralCommission: "Comision",
            marketplaceTitle: "Marketplace de temas premium",
            marketplaceSubtitle: "Monetizacion adicional: activa packs premium por rubro.",
            buyWithIzipay: "Comprar con Izipay",
            requestManual: "Solicitar manual",
            owned: "Activo",
            pending: "Pendiente",
          },
    [isEnglish],
  );
  const paymentInstructions = isEnglish ? PAYMENT_INSTRUCTIONS_EN : PAYMENT_INSTRUCTIONS_ES;
  const bankAccounts = isEnglish ? BANK_ACCOUNTS_EN : BANK_ACCOUNTS_ES;
  const planTextById = useMemo(
    () =>
      isEnglish
        ? {
            FREE: { price: "S/ 29 / month", cta: "Buy now" },
            BUSINESS: { price: "S/ 59 / month", cta: "Activate Business" },
            PRO: { price: "S/ 99 / month", cta: "Buy now" },
          }
        : {
            FREE: { price: "S/ 29 / mes", cta: "Comprar ahora" },
            BUSINESS: { price: "S/ 59 / mes", cta: "Activar Business" },
            PRO: { price: "S/ 99 / mes", cta: "Comprar ahora" },
          },
    [isEnglish],
  );

  const requestedPlanOptions = useMemo(() => PLAN_DEFINITIONS, []);
  const effectiveDurationMonths = billingCycle === "ANNUAL" ? 12 : durationMonths;
  const pricingPreview = useMemo(
    () =>
      calculateSubscriptionAmountSoles({
        plan: selectedPlan,
        months: effectiveDurationMonths,
        annualBilling: billingCycle === "ANNUAL",
      }),
    [billingCycle, effectiveDurationMonths, selectedPlan],
  );
  const selectedPlanDefinition = useMemo(
    () =>
      requestedPlanOptions.find((plan) => plan.id === selectedPlan) || requestedPlanOptions[0],
    [requestedPlanOptions, selectedPlan],
  );
  const selectedPlanMaxAnnualDiscount = selectedPlanDefinition.annualDiscountPercent;
  const daysRemaining = Math.max(0, Number(summary?.daysRemaining || 0));
  const showRenewalAlert = summary?.status === "ACTIVE" && daysRemaining > 0 && daysRemaining <= 5;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setRequiredFeature(String(params.get("requiredFeature") || "").trim());
    const querySelectedPlan = normalizePlanIntent(params.get("plan"));
    const queryPaymentMethod = normalizePaymentMethodIntent(params.get("paymentMethod"));
    if (querySelectedPlan && !hasAppliedQueryPlanRef.current) {
      setSelectedPlan(querySelectedPlan);
      hasAppliedQueryPlanRef.current = true;
    }
    if (queryPaymentMethod && !hasAppliedQueryPaymentMethodRef.current) {
      setPaymentMethod(queryPaymentMethod);
      hasAppliedQueryPaymentMethodRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!summary) return;
    if (hasAppliedQueryPlanRef.current) return;
    if (summary.plan === "PRO") {
      setSelectedPlan("PRO");
      return;
    }
    setSelectedPlan("BUSINESS");
  }, [summary?.plan]);

  useEffect(() => {
    if (billingCycle === "ANNUAL" && durationMonths !== 12) {
      setDurationMonths(12);
    }
  }, [billingCycle, durationMonths]);

  const loadReferralSummary = async () => {
    if (!user?.uid) return;
    setLoadingReferralSummary(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const response = await fetch("/api/referrals/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = (await response.json().catch(() => ({}))) as {
        summary?: ReferralSummaryResponse;
      };
      if (!response.ok) return;
      setReferralSummary(payload.summary || null);
    } catch (error) {
      console.error("[Billing] Could not load referral summary", error);
    } finally {
      setLoadingReferralSummary(false);
    }
  };

  const loadThemeMarketplace = async () => {
    if (!user?.uid) return;
    setLoadingMarketplace(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const response = await fetch("/api/theme-marketplace/packs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = (await response.json().catch(() => ({}))) as ThemeMarketplaceCatalog & {
        error?: string;
      };
      if (!response.ok) return;
      setMarketplaceCatalog({
        packs: payload.packs || [],
        ownedPackIds: payload.ownedPackIds || [],
        pendingOrders: payload.pendingOrders || [],
      });
    } catch (error) {
      console.error("[Billing] Could not load theme marketplace", error);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    void loadReferralSummary();
    void loadThemeMarketplace();
  }, [user?.uid]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user?.uid) return;

    const params = new URLSearchParams(window.location.search);
    const izipayResult = String(params.get("izipayResult") || "").trim().toLowerCase();
    const stripeResult = String(params.get("stripeResult") || "").trim().toLowerCase();
    const paymentId = String(params.get("paymentId") || "").trim();
    const sessionId = String(params.get("session_id") || "").trim();
    const marketplaceResult = String(params.get("marketplaceResult") || "").trim().toLowerCase();
    const orderId = String(params.get("orderId") || "").trim();

    if (izipayResult === "success" && paymentId && !hasProcessedIzipayQueryRef.current) {
      hasProcessedIzipayQueryRef.current = true;
      setConfirmingIzipay(true);
      setFeedback({ type: "success", text: i18n.izipayConfirming });
      (async () => {
        try {
          const token = await auth.currentUser?.getIdToken(true);
          if (!token) throw new Error("UNAUTHORIZED");
          const response = await fetch("/api/payments/izipay/confirm", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentId }),
          });
          const payload = (await response.json().catch(() => ({}))) as { paid?: boolean; error?: string };
          if (!response.ok) {
            throw new Error(payload.error || "No se pudo confirmar.");
          }
          setFeedback({
            type: payload.paid ? "success" : "error",
            text: payload.paid ? i18n.izipayPaidSuccess : i18n.izipayPending,
          });
          await reload();
        } catch (error) {
          setFeedback({
            type: "error",
            text: String((error as { message?: string })?.message || "No se pudo confirmar Izipay."),
          });
        } finally {
          setConfirmingIzipay(false);
        }
      })();
    }

    if (stripeResult === "success" && paymentId && !hasProcessedStripeQueryRef.current) {
      hasProcessedStripeQueryRef.current = true;
      setConfirmingStripe(true);
      setFeedback({ type: "success", text: i18n.stripeConfirming });
      (async () => {
        try {
          const token = await auth.currentUser?.getIdToken(true);
          if (!token) throw new Error("UNAUTHORIZED");
          const response = await fetch("/api/payments/stripe/confirm", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentId, sessionId }),
          });
          const payload = (await response.json().catch(() => ({}))) as { paid?: boolean; error?: string };
          if (!response.ok) {
            throw new Error(payload.error || "No se pudo confirmar.");
          }
          setFeedback({
            type: payload.paid ? "success" : "error",
            text: payload.paid ? i18n.stripePaidSuccess : i18n.stripePending,
          });
          await reload();
        } catch (error) {
          setFeedback({
            type: "error",
            text: String((error as { message?: string })?.message || "No se pudo confirmar Stripe."),
          });
        } finally {
          setConfirmingStripe(false);
        }
      })();
    }

    if (marketplaceResult === "success" && orderId && !hasProcessedMarketplaceQueryRef.current) {
      hasProcessedMarketplaceQueryRef.current = true;
      (async () => {
        try {
          const token = await auth.currentUser?.getIdToken(true);
          if (!token) throw new Error("UNAUTHORIZED");
          const response = await fetch("/api/theme-marketplace/purchase", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          });
          const payload = (await response.json().catch(() => ({}))) as { paid?: boolean; error?: string };
          if (!response.ok) throw new Error(payload.error || "No se pudo validar marketplace.");
          setFeedback({
            type: payload.paid ? "success" : "error",
            text: payload.paid
              ? "Pack premium activado correctamente."
              : "La orden del marketplace sigue pendiente.",
          });
          await loadThemeMarketplace();
        } catch (error) {
          setFeedback({
            type: "error",
            text: String(
              (error as { message?: string })?.message || "No se pudo confirmar orden de marketplace.",
            ),
          });
        }
      })();
    }
  }, [
    i18n.izipayConfirming,
    i18n.izipayPaidSuccess,
    i18n.izipayPending,
    i18n.stripeConfirming,
    i18n.stripePaidSuccess,
    i18n.stripePending,
    reload,
    user?.uid,
  ]);

  const purchaseThemePack = async (packId: string, method: ThemeMarketplacePaymentMethod) => {
    if (!user?.uid) return;
    setBuyingPackId(packId);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error(isEnglish ? "Session expired." : "Sesion expirada.");
      const response = await fetch("/api/theme-marketplace/purchase", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packId, paymentMethod: method }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        checkoutUrl?: string;
        paymentFlow?: "MANUAL" | "IZIPAY";
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || "No se pudo crear la orden.");
      }
      if (payload.paymentFlow === "IZIPAY" && payload.checkoutUrl) {
        setFeedback({ type: "success", text: i18n.izipayRedirecting });
        window.location.href = payload.checkoutUrl;
        return;
      }
      setFeedback({
        type: "success",
        text: isEnglish
          ? "Manual order created. Awaiting admin validation."
          : "Orden manual creada. Queda pendiente de validacion admin.",
      });
      await loadThemeMarketplace();
    } catch (error) {
      setFeedback({
        type: "error",
        text: String((error as { message?: string })?.message || "No se pudo comprar pack."),
      });
    } finally {
      setBuyingPackId("");
    }
  };

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
        label: i18n.projects,
        value:
          permissions.maxProjects == null
            ? `${permissions.usage.publishedProjects} / ${i18n.unlimited}`
            : `${permissions.usage.publishedProjects} / ${permissions.maxProjects}`,
      },
      {
        label: i18n.products,
        value:
          permissions.maxProductsPerProject == null
            ? `${permissions.usage.maxProductsInOneProject} / ${i18n.unlimited}`
            : `${permissions.usage.maxProductsInOneProject} / ${permissions.maxProductsPerProject}`,
      },
      {
        label: i18n.customDomain,
        value: permissions.canUseCustomDomain ? i18n.allowed : i18n.unavailable,
      },
      {
        label: i18n.branding,
        value: permissions.canRemoveBranding ? i18n.allowed : i18n.unavailable,
      },
      {
        label: i18n.ai,
        value: permissions.aiLevel,
      },
      {
        label: i18n.metrics,
        value: permissions.analyticsLevel,
      },
    ];
  }, [i18n.ai, i18n.allowed, i18n.branding, i18n.customDomain, i18n.metrics, i18n.products, i18n.projects, i18n.unavailable, i18n.unlimited, permissions]);

  const goToPlan = (plan: PlanType) => {
    setSelectedPlan(plan);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      pricingPlansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goToPayment = (plan: PlanType) => {
    setSelectedPlan(plan);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      paymentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const copyAccountNumber = async (value: string, key: CopiedAccountKey) => {
    const normalized = String(value || "").replace(/\D/g, "");
    if (!normalized) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(normalized);
      } else if (typeof document !== "undefined") {
        const temp = document.createElement("textarea");
        temp.value = normalized;
        temp.setAttribute("readonly", "");
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      setCopiedAccount(key);
      setTimeout(() => {
        setCopiedAccount((current) => (current === key ? null : current));
      }, 1600);
    } catch (copyError) {
      console.error("[Billing] Could not copy account number", copyError);
    }
  };

  const copyText = async (value: string) => {
    const text = String(value || "").trim();
    if (!text) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setFeedback({
        type: "success",
        text: isEnglish ? "Copied to clipboard." : "Copiado al portapapeles.",
      });
    } catch (error) {
      console.error("[Billing] Could not copy text", error);
    }
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    if (!user?.uid) return;

    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) {
        throw new Error(
          isEnglish
            ? "Your session expired. Sign in again."
            : "Tu sesion expiro. Inicia sesion nuevamente.",
        );
      }

      if (showPaymentFlow && (paymentMethod === "IZIPAY" || paymentMethod === "STRIPE")) {
        const checkoutPath =
          paymentMethod === "STRIPE" ? "/api/payments/stripe/checkout" : "/api/payments/izipay/checkout";
        const response = await fetch(checkoutPath, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: selectedPlan,
            billingCycle,
            durationMonths: effectiveDurationMonths,
          }),
        });
        const data = (await response.json().catch(() => ({}))) as {
          checkoutUrl?: string;
          error?: string;
        };
        if (!response.ok || !data.checkoutUrl) {
          throw new Error(
            data?.error ||
              (paymentMethod === "STRIPE"
                ? isEnglish
                  ? "Could not start Stripe checkout."
                  : "No se pudo iniciar Stripe."
                : isEnglish
                  ? "Could not start Izipay checkout."
                  : "No se pudo iniciar Izipay."),
          );
        }
        setFeedback({
          type: "success",
          text: paymentMethod === "STRIPE" ? i18n.stripeRedirecting : i18n.izipayRedirecting,
        });
        window.location.href = data.checkoutUrl;
        return;
      }

      const formData = new FormData();
      formData.append("plan", selectedPlan);
      formData.append("paymentMethod", paymentMethod);
      formData.append("notes", notes);
      formData.append("billingCycle", billingCycle);
      formData.append("durationMonths", String(effectiveDurationMonths));
      formData.append("discountPercent", String(pricingPreview.discountPercent));
      formData.append("amountSoles", String(pricingPreview.total));
      if (proofFile && showPaymentFlow) {
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
        throw new Error(
          data?.error ||
            (isEnglish
              ? "Could not register your request."
              : "No se pudo registrar la solicitud."),
        );
      }

      setFeedback({
        type: "success",
        text: isEnglish
          ? "Request sent. It is pending admin validation."
          : "Solicitud enviada. Quedo en estado pendiente hasta validacion admin.",
      });
      setProofFile(null);
      setNotes("");
      await reload();
    } catch (submitError: any) {
      setFeedback({
        type: "error",
        text:
          submitError?.message ||
          (isEnglish
            ? "Could not process your payment request."
            : "No se pudo procesar la solicitud de pago."),
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
    <div className="min-h-screen bg-black px-4 pt-24 pb-8 text-white md:px-8 md:pt-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <MobilePlanStatusCard userId={user?.uid} />
        <header className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{i18n.saasBilling}</p>
              <h1 className="mt-2 text-3xl font-black">{i18n.title}</h1>
              <p className="mt-2 text-zinc-300">{i18n.subtitle}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs text-zinc-400">{i18n.activePlan}</span>
              <PlanBadge plan={activePlan} />
            </div>
          </div>

          <div className="mt-4">
            <SubscriptionExpiryBanner
              visible={Boolean(summary?.expiringSoon)}
              daysRemaining={summary?.daysRemaining || 0}
              isBusinessTrial={false}
            />
          </div>
          <div className="mt-3 hidden md:flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
              {i18n.planDaysLeft}: {daysRemaining}
            </span>
            {showRenewalAlert ? (
              <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                {i18n.renewalAlert}
              </span>
            ) : null}
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
                      onClick={() => goToPlan(TARGET_TO_PLAN[upsell.targetPlan])}
                      className="mt-3 rounded-lg border border-amber-200/40 bg-amber-400/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-100"
                    >
                      {isEnglish ? "See" : "Ver"} {TARGET_TO_PLAN[upsell.targetPlan]}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <section id="billing-plans" ref={pricingPlansRef} className="scroll-mt-24">
          <PricingTable activePlan={activePlan} onSelectPlan={goToPayment} loadingPlan={null} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            ref={paymentFormRef}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-zinc-950/70 p-6"
          >
            <div>
              <h2 className="text-xl font-bold">{i18n.updateTitle}</h2>
              <p className="mt-1 text-sm text-zinc-300">{i18n.updateSubtitle}</p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                {i18n.requestedPlan}
              </span>
              <select
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value as PlanType)}
              >
                {requestedPlanOptions.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {planTextById[plan.id].price}
                  </option>
                ))}
              </select>
            </label>

            {showPaymentFlow ? (
              <div className="space-y-3 rounded-xl border border-white/10 bg-black/25 px-3 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">{i18n.billingCycle}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("MONTHLY")}
                    className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      billingCycle === "MONTHLY"
                        ? "border-amber-300/45 bg-amber-400/12 text-amber-100"
                        : "border-white/15 bg-white/5 text-zinc-200"
                    }`}
                  >
                    <span className="block">{i18n.cycleMonthly}</span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.09em] text-amber-200/90">
                      {i18n.cycleMonthlyMaxDiscount(selectedPlanMaxAnnualDiscount)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("ANNUAL")}
                    className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      billingCycle === "ANNUAL"
                        ? "border-emerald-300/45 bg-emerald-400/12 text-emerald-100"
                        : "border-white/15 bg-white/5 text-zinc-200"
                    }`}
                  >
                    <span className="block">{i18n.cycleAnnual}</span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.09em] text-emerald-200/90">
                      {i18n.cycleAnnualMaxDiscount(selectedPlanMaxAnnualDiscount)}
                    </span>
                  </button>
                </div>
                {billingCycle === "MONTHLY" ? (
                  <div className="space-y-2">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">{i18n.monthsLabel}</span>
                      <select
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
                        value={durationMonths}
                        onChange={(event) => setDurationMonths(Math.max(1, Math.min(12, Number(event.target.value) || 1)))}
                      >
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>
                    {durationMonths === 12 ? (
                      <p className="text-xs font-semibold text-amber-100/95">
                        {i18n.monthly12DiscountApplied(pricingPreview.discountPercent, pricingPreview.total)}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-emerald-100/95">
                    {i18n.annualDiscount}: {pricingPreview.discountPercent}%
                  </p>
                )}
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-zinc-200">
                  <p className="font-bold uppercase tracking-[0.12em] text-zinc-300">{i18n.paymentSummary}</p>
                  <p className="mt-1">{i18n.subtotal}: S/ {pricingPreview.subtotal.toFixed(2)}</p>
                  <p>
                    {i18n.discount}: {pricingPreview.discountPercent}% (S/ {pricingPreview.discountAmount.toFixed(2)})
                  </p>
                  <p className="mt-1 font-black text-amber-100">{i18n.total}: S/ {pricingPreview.total.toFixed(2)}</p>
                </div>
              </div>
            ) : null}

            {showPaymentFlow ? (
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {i18n.paymentMethod}
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                  {(["YAPE", "PLIN", "TRANSFERENCIA", "IZIPAY", "STRIPE"] as PaymentMethod[]).map((method) => (
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

            {paymentMethod === "IZIPAY" || paymentMethod === "STRIPE" ? (
              <div className="space-y-2 rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
                <p className="font-semibold">{paymentInstructions[paymentMethod]}</p>
                <p className="text-xs text-amber-100/90">
                  {paymentMethod === "STRIPE" ? i18n.stripeSecure : i18n.izipaySecure}
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-3 text-sm text-cyan-100">
                <p className="font-semibold">{paymentInstructions[paymentMethod]}</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-100">{i18n.paymentDestinationsTitle}</p>
                <p className="text-xs text-cyan-100/90">{i18n.paymentDestinationsHint}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.1fr]">
                  <div className="rounded-xl border border-cyan-200/25 bg-black/25 p-3">
                    <div className="flex items-center gap-2">
                      <PaymentBrandLogo brand="YAPE" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.12em]">{i18n.yapeQr}</p>
                        <p className="text-[11px] text-cyan-100/90">{i18n.accountHolder}: {PAYMENT_ACCOUNT_HOLDER}</p>
                        <p className="text-[11px] text-cyan-100/90">{i18n.yapeNumber}: {PAYMENT_YAPE_NUMBER}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex w-full justify-center">
                      <img
                        src={yapeQrUrl}
                        alt="QR oficial Yape 906431630"
                        className="h-56 w-56 max-w-full rounded-2xl border border-cyan-200/25 bg-white p-2 shadow-[0_0_30px_rgba(14,165,233,0.25)] md:h-64 md:w-64"
                        style={{ imageRendering: "crisp-edges" }}
                        loading="lazy"
                      />
                    </div>
                    <a
                      href={yapeQrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-lg border border-cyan-200/35 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                    >
                      {i18n.openQr}
                    </a>
                  </div>
                  <div className="space-y-3 rounded-xl border border-cyan-200/25 bg-black/25 p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em]">{i18n.bankAccounts}</p>
                    <div className="space-y-2">
                      <div className="rounded-lg border border-blue-300/20 bg-blue-900/20 p-3">
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">
                            <PaymentBrandLogo brand="BCP" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white">BCP</p>
                            <button
                              type="button"
                              onClick={() => copyAccountNumber(PAYMENT_BCP_SOLES_ACCOUNT, "bcp_soles")}
                              className="mt-1 flex w-full items-center justify-between gap-2 rounded-md border border-blue-200/20 bg-blue-950/30 px-2 py-1 text-left text-[11px] text-blue-100/95 transition hover:border-blue-200/40"
                            >
                              <span className="break-all">
                                {i18n.bcpSolesAccount}: {PAYMENT_BCP_SOLES_ACCOUNT}
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold">
                                {copiedAccount === "bcp_soles" ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    {i18n.copied}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    {i18n.copyNumber}
                                  </>
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-blue-300/20 bg-blue-900/20 p-3">
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">
                            <PaymentBrandLogo brand="BCP" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white">BCP</p>
                            <button
                              type="button"
                              onClick={() => copyAccountNumber(PAYMENT_BCP_CCI, "bcp_cci")}
                              className="mt-1 flex w-full items-center justify-between gap-2 rounded-md border border-blue-200/20 bg-blue-950/30 px-2 py-1 text-left text-[11px] text-blue-100/95 transition hover:border-blue-200/40"
                            >
                              <span className="break-all">
                                {i18n.interbankCci}: {PAYMENT_BCP_CCI}
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold">
                                {copiedAccount === "bcp_cci" ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    {i18n.copied}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    {i18n.copyNumber}
                                  </>
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => copyAccountNumber(PAYMENT_BCP_SOLES_ACCOUNT, "bcp_soles")}
                        className="flex w-full items-center justify-between gap-2 rounded-md border border-transparent px-1 py-1 text-left text-[11px] text-cyan-100/90 transition hover:border-cyan-200/20"
                      >
                        <span className="break-all">{bankAccounts[0]}</span>
                        <Copy className="h-3 w-3 shrink-0" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyAccountNumber(PAYMENT_BCP_CCI, "bcp_cci")}
                        className="flex w-full items-center justify-between gap-2 rounded-md border border-transparent px-1 py-1 text-left text-[11px] text-cyan-100/90 transition hover:border-cyan-200/20"
                      >
                        <span className="break-all">{bankAccounts[1]}</span>
                        <Copy className="h-3 w-3 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showPaymentFlow && paymentMethod !== "IZIPAY" && paymentMethod !== "STRIPE" ? (
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {i18n.uploadProof}
                </span>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm">
                  <UploadCloud className="h-4 w-4 text-zinc-300" />
                  <span className="truncate text-zinc-200">
                    {proofFile ? proofFile.name : i18n.uploadPlaceholder}
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
                {i18n.notes}
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
                placeholder={i18n.notesPlaceholder}
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
              disabled={submitting || confirmingIzipay || confirmingStripe || loading || permissions.loading}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-100 disabled:opacity-60"
            >
              {submitting || confirmingIzipay || confirmingStripe ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting || confirmingIzipay || confirmingStripe
                ? i18n.processing
                : paymentMethod === "IZIPAY"
                  ? i18n.submitIzipay
                  : paymentMethod === "STRIPE"
                    ? i18n.submitStripe
                    : i18n.submitPaid}
            </button>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
            <h3 className="text-lg font-bold">{i18n.usageTitle}</h3>
            <div className="mt-4 space-y-2 text-sm">
              {usageRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <span className="text-zinc-300">{row.label}</span>
                  <span className="font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>

            <h4 className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-zinc-400">
              {i18n.pendingTitle}
            </h4>
            <div className="mt-3 space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-4 text-sm text-zinc-400">
                  {i18n.pendingEmpty}
                </p>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-sm"
                  >
                    <p className="font-semibold text-white">{request.requestedPlan}</p>
                    <p className="text-zinc-300">{i18n.pendingMethod}: {request.paymentMethod}</p>
                    <p className="text-zinc-400">{i18n.pendingStatus}: {request.status}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-300">
                {i18n.referralsTitle}
              </h4>
              <p className="mt-1 text-xs text-zinc-400">{i18n.referralsSubtitle}</p>
              {loadingReferralSummary ? (
                <p className="mt-3 text-xs text-zinc-500">{isEnglish ? "Loading..." : "Cargando..."}</p>
              ) : referralSummary ? (
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{i18n.referralCode}</p>
                    <button
                      type="button"
                      onClick={() => copyText(referralSummary.profile.referralCode)}
                      className="mt-1 text-sm font-black text-amber-100"
                    >
                      {referralSummary.profile.referralCode}
                    </button>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{i18n.referralLink}</p>
                    <button
                      type="button"
                      onClick={() => copyText(referralSummary.referralLink)}
                      className="mt-1 break-all text-left text-xs text-zinc-200"
                    >
                      {referralSummary.referralLink}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                      <p className="text-zinc-400">{i18n.referralInvited}</p>
                      <p className="font-black text-white">{referralSummary.stats.invited}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                      <p className="text-zinc-400">{i18n.referralConverted}</p>
                      <p className="font-black text-white">{referralSummary.stats.converted}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                      <p className="text-zinc-400">{i18n.referralPending}</p>
                      <p className="font-black text-white">{referralSummary.stats.pending}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                      <p className="text-zinc-400">{i18n.referralCommission}</p>
                      <p className="font-black text-emerald-200">S/ {referralSummary.stats.totalCommissionSoles.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-300">
                {i18n.marketplaceTitle}
              </h4>
              <p className="mt-1 text-xs text-zinc-400">{i18n.marketplaceSubtitle}</p>
              {loadingMarketplace ? (
                <p className="mt-3 text-xs text-zinc-500">{isEnglish ? "Loading..." : "Cargando..."}</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {(marketplaceCatalog?.packs || []).map((pack) => {
                    const owned = Boolean(marketplaceCatalog?.ownedPackIds?.includes(pack.id));
                    const pending = Boolean(
                      marketplaceCatalog?.pendingOrders?.some(
                        (order) => order.packId === pack.id && order.status === "PENDING",
                      ),
                    );
                    return (
                      <article key={pack.id} className="rounded-xl border border-white/10 bg-black/35 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-black text-white">{pack.name}</p>
                            <p className="mt-1 text-xs text-zinc-400">{pack.description}</p>
                            <p className="mt-1 text-xs font-semibold text-amber-200">{pack.badge} - S/ {pack.priceSoles}</p>
                          </div>
                          <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">
                            {owned ? i18n.owned : pending ? i18n.pending : pack.vertical}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            disabled={owned || pending || buyingPackId === pack.id}
                            onClick={() => purchaseThemePack(pack.id, "IZIPAY")}
                            className="rounded-lg border border-amber-300/40 bg-amber-400/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-amber-100 disabled:opacity-50"
                          >
                            {buyingPackId === pack.id ? i18n.processing : i18n.buyWithIzipay}
                          </button>
                          <button
                            type="button"
                            disabled={owned || pending || buyingPackId === pack.id}
                            onClick={() => purchaseThemePack(pack.id, "YAPE")}
                            className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-zinc-200 disabled:opacity-50"
                          >
                            {i18n.requestManual}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}


