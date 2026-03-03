export type GrowthEventName =
  | "page_view"
  | "view_demo"
  | "click_demo_open"
  | "click_cta_signup"
  | "start_signup"
  | "signup_complete"
  | "click_whatsapp"
  | "click_social";

type UTMContext = {
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
};

const UTM_STORAGE_KEY = "fp_utm_context";
const UTM_COOKIE_KEY = "fp_utm_context";

function cleanValue(value: unknown, max = 120) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

function encodeCookieValue(value: UTMContext) {
  try {
    return encodeURIComponent(JSON.stringify(value));
  } catch {
    return "";
  }
}

function decodeCookieValue(value: string): UTMContext {
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return {
      utm_source: cleanValue(parsed?.utm_source, 80) || undefined,
      utm_campaign: cleanValue(parsed?.utm_campaign, 120) || undefined,
      utm_content: cleanValue(parsed?.utm_content, 120) || undefined,
    };
  } catch {
    return {};
  }
}

export function getStoredUtmContext(): UTMContext {
  const win = safeWindow();
  if (!win) return {};

  try {
    const fromStorage = win.localStorage.getItem(UTM_STORAGE_KEY);
    if (fromStorage) {
      const parsed = JSON.parse(fromStorage);
      return {
        utm_source: cleanValue(parsed?.utm_source, 80) || undefined,
        utm_campaign: cleanValue(parsed?.utm_campaign, 120) || undefined,
        utm_content: cleanValue(parsed?.utm_content, 120) || undefined,
      };
    }
  } catch {
    // ignore
  }

  const cookieMatch = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${UTM_COOKIE_KEY}=`));
  if (!cookieMatch) return {};
  return decodeCookieValue(cookieMatch.slice(`${UTM_COOKIE_KEY}=`.length));
}

export function persistUtmFromUrl(searchParams?: URLSearchParams) {
  const win = safeWindow();
  if (!win) return;

  const params = searchParams || new URLSearchParams(win.location.search);
  const next: UTMContext = {
    utm_source: cleanValue(params.get("utm_source"), 80) || undefined,
    utm_campaign: cleanValue(params.get("utm_campaign"), 120) || undefined,
    utm_content: cleanValue(params.get("utm_content"), 120) || undefined,
  };

  if (!next.utm_source && !next.utm_campaign && !next.utm_content) return;

  try {
    win.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  const encoded = encodeCookieValue(next);
  if (encoded) {
    document.cookie = `${UTM_COOKIE_KEY}=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
}

type EventPayload = Record<string, unknown> & {
  vertical?: string;
  slug?: string;
};

export async function trackGrowthEvent(
  event: GrowthEventName,
  payload: EventPayload = {},
) {
  const win = safeWindow();
  if (!win) return;

  const utm = getStoredUtmContext();
  const body = {
    event,
    ...utm,
    ...payload,
    path: win.location.pathname,
    href: win.location.href,
    ts: Date.now(),
  };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[growth-event]", body);
  }

  const dataLayerWindow = win as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  dataLayerWindow.dataLayer?.push(body);

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}
