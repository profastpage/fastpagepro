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

const FALLBACK_VERTICAL: BusinessVertical = "restaurant";

export const VERTICAL_COPY: Record<BusinessVertical, VerticalCopy> = {
  restaurant: {
    label: "Restaurante",
    emoji: "🍽️",
    headline: "Tu carta digital + pedidos por WhatsApp en 1 dia",
    subheadline:
      "Activa menu, categorias y pedido directo sin comisiones para vender mas.",
    demoCta: "Ver demo de restaurante",
    signupCta: "Crear mi carta digital gratis",
  },
  ecommerce: {
    label: "Tienda Online",
    emoji: "🛍️",
    headline: "Tu tienda lista para vender + carrito directo a WhatsApp",
    subheadline:
      "Publica catalogo, ofertas y checkout rapido para convertir trafico en ventas.",
    demoCta: "Ver demo de tienda online",
    signupCta: "Crear mi tienda gratis",
  },
  services: {
    label: "Servicios",
    emoji: "🧩",
    headline: "Landing que convierte + contacto inmediato",
    subheadline:
      "Captura leads calificados con mensajes claros y CTA de conversion.",
    demoCta: "Ver demo de servicios",
    signupCta: "Crear mi landing gratis",
  },
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

export function getVerticalCopy(vertical: unknown): VerticalCopy {
  return VERTICAL_COPY[normalizeVertical(vertical)];
}

export function verticalToSignupHref(vertical: unknown) {
  const normalized = normalizeVertical(vertical);
  return `/signup?vertical=${normalized}`;
}

export function verticalToDemoHref(vertical: unknown) {
  const normalized = normalizeVertical(vertical);
  return `/demo?vertical=${normalized}`;
}

export function verticalToCreateHref(vertical: unknown) {
  const normalized = normalizeVertical(vertical);
  return `/app/new?vertical=${normalized}`;
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
