export type IzipayCheckoutIntent = "SUBSCRIPTION" | "THEME_PACK";

export interface CreateIzipayCheckoutInput {
  referenceId: string;
  amountSoles: number;
  currency?: "PEN" | "USD";
  customerId: string;
  customerEmail: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  intent: IzipayCheckoutIntent;
  metadata?: Record<string, string | number | boolean>;
}

export interface IzipayCheckoutSession {
  mode: "mock" | "live";
  checkoutUrl: string;
  providerPaymentId: string;
  rawResponse: Record<string, unknown>;
}

export interface IzipayPaymentStatus {
  mode: "mock" | "live";
  providerPaymentId: string;
  status: string;
  paid: boolean;
  rawResponse: Record<string, unknown>;
}

type IzipayConfig = {
  mode: "mock" | "live";
  baseUrl: string;
  checkoutPath: string;
  statusPath: string;
  username: string;
  password: string;
  apiKey: string;
};

const DEFAULT_CHECKOUT_PATH = "/v1/payments/checkout";
const DEFAULT_STATUS_PATH = "/v1/payments/{paymentId}";

function sanitizeText(value: unknown, maxLen = 220): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function getConfig(): IzipayConfig {
  const modeRaw = String(process.env.IZIPAY_MODE || "mock").trim().toLowerCase();
  return {
    mode: modeRaw === "live" ? "live" : "mock",
    baseUrl: String(process.env.IZIPAY_API_BASE_URL || "").trim(),
    checkoutPath: String(process.env.IZIPAY_CHECKOUT_PATH || DEFAULT_CHECKOUT_PATH).trim(),
    statusPath: String(process.env.IZIPAY_STATUS_PATH || DEFAULT_STATUS_PATH).trim(),
    username: String(process.env.IZIPAY_USERNAME || "").trim(),
    password: String(process.env.IZIPAY_PASSWORD || "").trim(),
    apiKey: String(process.env.IZIPAY_API_KEY || "").trim(),
  };
}

function isLiveConfigReady(config: IzipayConfig) {
  return (
    config.mode === "live" &&
    Boolean(config.baseUrl) &&
    Boolean(config.checkoutPath) &&
    Boolean(config.statusPath) &&
    Boolean(config.username) &&
    Boolean(config.password)
  );
}

function toBasicAuth(username: string, password: string): string {
  const raw = `${username}:${password}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

function safeUrlJoin(baseUrl: string, path: string): string {
  const safeBase = baseUrl.replace(/\/+$/, "");
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${safeBase}${safePath}`;
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
    // Ignore parse errors and return wrapped raw payload below.
  }
  return { raw: input };
}

function extractCheckoutUrl(payload: Record<string, unknown>): string {
  const directKeys = ["checkoutUrl", "redirectUrl", "paymentUrl", "url"];
  for (const key of directKeys) {
    const value = sanitizeText(payload[key], 2000);
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
  }

  const links = payload.links;
  if (Array.isArray(links)) {
    for (const entry of links) {
      if (!entry || typeof entry !== "object") continue;
      const href = sanitizeText((entry as Record<string, unknown>).href, 2000);
      const rel = sanitizeText((entry as Record<string, unknown>).rel, 80).toLowerCase();
      if ((rel.includes("checkout") || rel.includes("redirect") || !rel) && href.startsWith("http")) {
        return href;
      }
    }
  }

  if (payload._links && typeof payload._links === "object") {
    const wrapped = payload._links as Record<string, unknown>;
    for (const key of Object.keys(wrapped)) {
      const entry = wrapped[key];
      if (!entry || typeof entry !== "object") continue;
      const href = sanitizeText((entry as Record<string, unknown>).href, 2000);
      if (href.startsWith("http")) return href;
    }
  }

  return "";
}

function extractProviderPaymentId(payload: Record<string, unknown>, fallback: string): string {
  const keys = ["paymentId", "id", "transactionId", "orderId", "uuid", "token"];
  for (const key of keys) {
    const value = sanitizeText(payload[key], 180);
    if (value) return value;
  }
  return fallback;
}

function normalizeStatus(payload: Record<string, unknown>): string {
  const rawStatus =
    sanitizeText(payload.status, 60) ||
    sanitizeText(payload.paymentStatus, 60) ||
    sanitizeText(payload.state, 60) ||
    sanitizeText(payload.result, 60) ||
    "UNKNOWN";
  return rawStatus.toUpperCase();
}

function isPaidStatus(status: string): boolean {
  const normalized = status.toUpperCase();
  return (
    normalized.includes("PAID") ||
    normalized.includes("APPROVED") ||
    normalized.includes("SUCCESS") ||
    normalized.includes("COMPLETED") ||
    normalized.includes("CAPTURED")
  );
}

export async function createIzipayCheckoutSession(
  input: CreateIzipayCheckoutInput,
): Promise<IzipayCheckoutSession> {
  const config = getConfig();
  const providerPaymentId = randomId("izipay");

  if (!isLiveConfigReady(config)) {
    const checkoutUrl = appendQuery(input.successUrl, {
      izipayMock: "1",
      providerPaymentId,
    });

    return {
      mode: "mock",
      checkoutUrl,
      providerPaymentId,
      rawResponse: {
        mode: "mock",
        reason: "missing_live_configuration",
      },
    };
  }

  const endpoint = safeUrlJoin(config.baseUrl, config.checkoutPath);
  const payload = {
    amount: {
      currency: input.currency || "PEN",
      value: Math.round(Math.max(0, Number(input.amountSoles || 0)) * 100),
    },
    order: {
      id: sanitizeText(input.referenceId, 100),
      description: sanitizeText(input.description, 280),
      intent: input.intent,
    },
    customer: {
      id: sanitizeText(input.customerId, 120),
      email: sanitizeText(input.customerEmail, 180),
    },
    returnUrls: {
      success: input.successUrl,
      cancel: input.cancelUrl,
    },
    metadata: input.metadata || {},
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: toBasicAuth(config.username, config.password),
      ...(config.apiKey ? { "X-API-KEY": config.apiKey } : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const rawText = await response.text();
  const rawResponse = parseJson(rawText);

  if (!response.ok) {
    throw new Error(
      `IZIPAY_CHECKOUT_FAILED: ${sanitizeText(rawResponse.error || rawResponse.message || response.statusText, 220)}`,
    );
  }

  const checkoutUrl = extractCheckoutUrl(rawResponse);
  if (!checkoutUrl) {
    throw new Error("IZIPAY_CHECKOUT_FAILED: missing checkout url");
  }

  return {
    mode: "live",
    checkoutUrl,
    providerPaymentId: extractProviderPaymentId(rawResponse, providerPaymentId),
    rawResponse,
  };
}

export async function fetchIzipayPaymentStatus(input: {
  providerPaymentId: string;
}): Promise<IzipayPaymentStatus> {
  const config = getConfig();
  const providerPaymentId = sanitizeText(input.providerPaymentId, 180);

  if (!providerPaymentId) {
    throw new Error("MISSING_PROVIDER_PAYMENT_ID");
  }

  if (!isLiveConfigReady(config)) {
    return {
      mode: "mock",
      providerPaymentId,
      status: "PAID",
      paid: true,
      rawResponse: { mode: "mock" },
    };
  }

  const statusPath = config.statusPath.replace("{paymentId}", encodeURIComponent(providerPaymentId));
  const endpoint = safeUrlJoin(config.baseUrl, statusPath);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: toBasicAuth(config.username, config.password),
      ...(config.apiKey ? { "X-API-KEY": config.apiKey } : {}),
    },
    cache: "no-store",
  });

  const rawText = await response.text();
  const rawResponse = parseJson(rawText);

  if (!response.ok) {
    throw new Error(
      `IZIPAY_STATUS_FAILED: ${sanitizeText(rawResponse.error || rawResponse.message || response.statusText, 220)}`,
    );
  }

  const status = normalizeStatus(rawResponse);

  return {
    mode: "live",
    providerPaymentId,
    status,
    paid: isPaidStatus(status),
    rawResponse,
  };
}
