export interface CreateStripeCheckoutInput {
  referenceId: string;
  amountSoles: number;
  currency?: "PEN" | "USD";
  customerId: string;
  customerEmail: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface StripeCheckoutSession {
  mode: "mock" | "live";
  checkoutUrl: string;
  providerSessionId: string;
  rawResponse: Record<string, unknown>;
}

export interface StripeCheckoutStatus {
  mode: "mock" | "live";
  providerSessionId: string;
  status: string;
  paid: boolean;
  rawResponse: Record<string, unknown>;
}

type StripeConfig = {
  mode: "mock" | "live";
  secretKey: string;
};

function sanitizeText(value: unknown, maxLen = 220): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function getConfig(): StripeConfig {
  const modeRaw = String(process.env.STRIPE_MODE || "mock").trim().toLowerCase();
  return {
    mode: modeRaw === "live" ? "live" : "mock",
    secretKey: String(process.env.STRIPE_SECRET_KEY || "").trim(),
  };
}

function isLiveConfigReady(config: StripeConfig) {
  return config.mode === "live" && config.secretKey.startsWith("sk_");
}

function appendQuery(url: string, query: Record<string, string>): string {
  const target = new URL(url);
  Object.entries(query).forEach(([key, value]) => {
    target.searchParams.set(key, value);
  });
  return target.toString();
}

function randomId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseJson(input: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore parse errors and return wrapped raw payload.
  }
  return { raw: input };
}

function extractErrorMessage(payload: Record<string, unknown>, fallback: string): string {
  const nestedError = payload.error;
  if (nestedError && typeof nestedError === "object") {
    const message = sanitizeText((nestedError as Record<string, unknown>).message, 220);
    if (message) return message;
  }
  return sanitizeText(payload.message, 220) || fallback;
}

function normalizeStatus(payload: Record<string, unknown>): string {
  const paymentStatus = sanitizeText(payload.payment_status, 80).toUpperCase();
  if (paymentStatus) return paymentStatus;
  return sanitizeText(payload.status, 80).toUpperCase() || "UNKNOWN";
}

function isPaidStatus(status: string): boolean {
  const normalized = status.toUpperCase();
  return (
    normalized === "PAID" ||
    normalized.includes("SUCCEEDED") ||
    normalized.includes("COMPLETED")
  );
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutInput,
): Promise<StripeCheckoutSession> {
  const config = getConfig();
  const providerSessionId = randomId("stripe");

  if (!isLiveConfigReady(config)) {
    return {
      mode: "mock",
      checkoutUrl: appendQuery(input.successUrl, {
        stripeMock: "1",
        session_id: providerSessionId,
      }),
      providerSessionId,
      rawResponse: {
        mode: "mock",
        reason: "missing_live_configuration",
      },
    };
  }

  const unitAmount = Math.max(1, Math.round(Math.max(0, Number(input.amountSoles || 0)) * 100));
  const currency = sanitizeText(input.currency || "PEN", 3).toLowerCase() || "pen";
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("client_reference_id", sanitizeText(input.referenceId, 120));
  params.set("payment_method_types[0]", "card");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", currency);
  params.set("line_items[0][price_data][unit_amount]", String(unitAmount));
  params.set(
    "line_items[0][price_data][product_data][name]",
    sanitizeText(input.description, 120) || "Fast Page plan",
  );
  const customerEmail = sanitizeText(input.customerEmail, 180);
  if (customerEmail) {
    params.set("customer_email", customerEmail);
  }
  Object.entries(input.metadata || {}).forEach(([key, value]) => {
    const safeKey = sanitizeText(key, 40);
    if (!safeKey) return;
    params.set(`metadata[${safeKey}]`, sanitizeText(value, 220));
  });
  params.set("metadata[userId]", sanitizeText(input.customerId, 120));

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const rawText = await response.text();
  const rawResponse = parseJson(rawText);

  if (!response.ok) {
    throw new Error(
      `STRIPE_CHECKOUT_FAILED: ${extractErrorMessage(rawResponse, response.statusText || "Stripe checkout failed")}`,
    );
  }

  const checkoutUrl = sanitizeText(rawResponse.url, 2000);
  const sessionId = sanitizeText(rawResponse.id, 180) || providerSessionId;
  if (!checkoutUrl || !checkoutUrl.startsWith("http")) {
    throw new Error("STRIPE_CHECKOUT_FAILED: missing checkout url");
  }

  return {
    mode: "live",
    checkoutUrl,
    providerSessionId: sessionId,
    rawResponse,
  };
}

export async function fetchStripeCheckoutSessionStatus(input: {
  providerSessionId: string;
}): Promise<StripeCheckoutStatus> {
  const config = getConfig();
  const providerSessionId = sanitizeText(input.providerSessionId, 180);
  if (!providerSessionId) {
    throw new Error("MISSING_PROVIDER_SESSION_ID");
  }

  if (!isLiveConfigReady(config)) {
    return {
      mode: "mock",
      providerSessionId,
      status: "PAID",
      paid: true,
      rawResponse: { mode: "mock" },
    };
  }

  const endpoint = `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(providerSessionId)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
    },
    cache: "no-store",
  });

  const rawText = await response.text();
  const rawResponse = parseJson(rawText);

  if (!response.ok) {
    throw new Error(
      `STRIPE_STATUS_FAILED: ${extractErrorMessage(rawResponse, response.statusText || "Stripe status failed")}`,
    );
  }

  const status = normalizeStatus(rawResponse);
  return {
    mode: "live",
    providerSessionId,
    status,
    paid: isPaidStatus(status),
    rawResponse,
  };
}
