export const VERTICAL_COOKIE_KEY = "fp_vertical";
export const VERTICAL_STORAGE_KEY = "fp_vertical";

export const BUSINESS_VERTICALS = [
  "restaurant",
  "ecommerce",
  "services",
] as const;

export type BusinessVertical = (typeof BUSINESS_VERTICALS)[number];

export type VerticalCopy = {
  label: string;
  emoji: string;
  headline: string;
  subheadline: string;
  demoCta: string;
  signupCta: string;
};

export type DemoSelection = {
  demoSlug?: string | null;
  demoTheme?: string | null;
};

const FALLBACK_VERTICAL: BusinessVertical = "restaurant";

type SupportedLanguage = "es" | "en" | "pt";

const VERTICAL_COPY_ES: Record<BusinessVertical, VerticalCopy> = {
  restaurant: {
    label: "Restaurante",
    emoji: "\u{1F37D}\uFE0F",
    headline: "Tu carta digital + pedidos por WhatsApp en 1 dia",
    subheadline:
      "Activa menu, categorias y pedido directo sin comisiones para vender mas.",
    demoCta: "Ver demo de restaurante",
    signupCta: "Crear mi carta digital gratis",
  },
  ecommerce: {
    label: "Tienda Online",
    emoji: "\u{1F6CD}\uFE0F",
    headline: "Tu tienda lista para vender + carrito directo a WhatsApp",
    subheadline:
      "Publica catalogo, ofertas y checkout rapido para convertir trafico en ventas.",
    demoCta: "Ver demo de tienda online",
    signupCta: "Crear mi tienda gratis",
  },
  services: {
    label: "Servicios",
    emoji: "\u{1F9E9}",
    headline: "Landing que convierte + contacto inmediato",
    subheadline:
      "Captura leads calificados con mensajes claros y CTA de conversion.",
    demoCta: "Ver demo de servicios",
    signupCta: "Crear mi landing gratis",
  },
};

const VERTICAL_COPY_EN: Record<BusinessVertical, VerticalCopy> = {
  restaurant: {
    label: "Restaurant",
    emoji: "\u{1F37D}\uFE0F",
    headline: "Your digital menu + WhatsApp orders in 1 day",
    subheadline:
      "Activate menu, categories, and direct ordering with no commissions to sell more.",
    demoCta: "See restaurant demo",
    signupCta: "Create my digital menu free",
  },
  ecommerce: {
    label: "Online Store",
    emoji: "\u{1F6CD}\uFE0F",
    headline: "Your store ready to sell + cart connected to WhatsApp",
    subheadline:
      "Publish catalog, offers, and fast checkout to turn traffic into sales.",
    demoCta: "See online store demo",
    signupCta: "Create my store free",
  },
  services: {
    label: "Services",
    emoji: "\u{1F9E9}",
    headline: "Landing that converts + instant contact",
    subheadline:
      "Capture qualified leads with clear messaging and conversion-focused CTAs.",
    demoCta: "See services demo",
    signupCta: "Create my landing free",
  },
};

const VERTICAL_COPY_BY_LANGUAGE: Record<SupportedLanguage, Record<BusinessVertical, VerticalCopy>> = {
  es: VERTICAL_COPY_ES,
  en: VERTICAL_COPY_EN,
  pt: VERTICAL_COPY_ES,
};

export function normalizeVertical(value: unknown): BusinessVertical {
  const input = String(value || "")
    .trim()
    .toLowerCase();
  if (input === "store") return "ecommerce";
  if (BUSINESS_VERTICALS.includes(input as BusinessVertical)) {
    return input as BusinessVertical;
  }
  return FALLBACK_VERTICAL;
}

export function getVerticalCopy(
  vertical: unknown,
  language: SupportedLanguage = "es",
): VerticalCopy {
  const safeLanguage = language in VERTICAL_COPY_BY_LANGUAGE ? language : "es";
  return VERTICAL_COPY_BY_LANGUAGE[safeLanguage][normalizeVertical(vertical)];
}

function normalizeDemoQueryValue(value: unknown) {
  const safe = String(value || "").trim();
  if (!safe) return "";
  return safe.replace(/[^\w-]/g, "");
}

function buildVerticalQueryString(vertical: unknown, demo?: DemoSelection) {
  const normalized = normalizeVertical(vertical);
  const params = new URLSearchParams({ vertical: normalized });
  const safeDemoSlug = normalizeDemoQueryValue(demo?.demoSlug);
  const safeDemoTheme = normalizeDemoQueryValue(demo?.demoTheme);
  if (safeDemoSlug) params.set("demoSlug", safeDemoSlug);
  if (safeDemoTheme) params.set("demoTheme", safeDemoTheme);
  return params.toString();
}

export function verticalToSignupHref(vertical: unknown, demo?: DemoSelection) {
  return `/signup?${buildVerticalQueryString(vertical, demo)}`;
}

export function verticalToDemoHref(vertical: unknown) {
  const normalized = normalizeVertical(vertical);
  return `/demo?vertical=${normalized}`;
}

export function verticalToCreateHref(vertical: unknown, demo?: DemoSelection) {
  return `/app/new?${buildVerticalQueryString(vertical, demo)}`;
}

export function resolveVerticalFromSearchParams(
  params:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
    | null
    | undefined,
): BusinessVertical {
  if (!params) return FALLBACK_VERTICAL;
  if (params instanceof URLSearchParams) {
    return normalizeVertical(params.get("vertical"));
  }
  const raw = params.vertical;
  if (Array.isArray(raw)) return normalizeVertical(raw[0]);
  return normalizeVertical(raw);
}

export function persistVerticalChoice(vertical: unknown) {
  if (typeof window === "undefined") return;
  const normalized = normalizeVertical(vertical);
  try {
    window.localStorage.setItem(VERTICAL_STORAGE_KEY, normalized);
  } catch {
    // ignore
  }
  document.cookie = `${VERTICAL_COOKIE_KEY}=${normalized}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
}

export function readVerticalFromClient(): BusinessVertical {
  if (typeof window === "undefined") return FALLBACK_VERTICAL;
  const fromUrl = new URLSearchParams(window.location.search).get("vertical");
  if (fromUrl) return normalizeVertical(fromUrl);

  try {
    const fromStorage = window.localStorage.getItem(VERTICAL_STORAGE_KEY);
    if (fromStorage) return normalizeVertical(fromStorage);
  } catch {
    // ignore
  }

  const cookieMatch = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${VERTICAL_COOKIE_KEY}=`));
  if (cookieMatch) {
    return normalizeVertical(cookieMatch.split("=")[1]);
  }

  return FALLBACK_VERTICAL;
}

export function readVerticalFromCookieValue(cookieValue: string | undefined | null) {
  return normalizeVertical(cookieValue || FALLBACK_VERTICAL);
}
