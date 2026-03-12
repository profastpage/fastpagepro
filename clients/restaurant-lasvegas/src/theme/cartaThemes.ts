export type CartaThemeTokens = {
  background: string;
  surface: string;
  surface2: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentHover: string;
  border: string;
  ring: string;
  shadow: string;
  chipBg: string;
  chipText: string;
  chipActiveBg: string;
  chipActiveText: string;
  chipBorder: string;
  navBg: string;
  navActiveBg: string;
  navActiveText: string;
  navText: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
  buttonSecondaryBg: string;
  inputBg: string;
  inputText: string;
  placeholder: string;
  inputBorder: string;
  gradientHero: string;
};

export type CartaThemePreset = {
  id: string;
  name: string;
  rubro: string;
  previewImage: string;
  previewDescription: string;
  official: boolean;
  premium?: boolean;
  sortOrder: number;
  tokens: CartaThemeTokens;
};

export type CartaCustomStyle = "luxe" | "soft" | "neon";

export type CartaCustomThemeInput = {
  primary?: string | null;
  secondary?: string | null;
  accent?: string | null;
  style?: CartaCustomStyle | string | null;
};

export const CARTA_CUSTOM_DEFAULTS = {
  primary: "#d4a84f",
  secondary: "#0f172a",
  accent: "#f59e0b",
  style: "luxe" as CartaCustomStyle,
};

const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

function normalizeHexToLong(input: string): string {
  const source = String(input || "").trim();
  if (!HEX_COLOR_PATTERN.test(source)) return "";
  if (source.length === 7) return source.toLowerCase();
  const [_, r, g, b] = source;
  return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function shiftHex(input: string, delta: number): string {
  const safe = normalizeHexToLong(input);
  const value = safe.replace("#", "");
  const parsed = Number.parseInt(value, 16);
  const r = clampByte(((parsed >> 16) & 255) + delta);
  const g = clampByte(((parsed >> 8) & 255) + delta);
  const b = clampByte((parsed & 255) + delta);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function hexToRgba(input: string, alpha: number): string {
  const safe = normalizeHexToLong(input);
  const value = safe.replace("#", "");
  const parsed = Number.parseInt(value, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;
  const safeAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

function safeCustomHex(input: string | null | undefined, fallback: string): string {
  const normalized = normalizeHexToLong(String(input || ""));
  if (!normalized) return fallback;
  return normalized;
}

export function getSafeCartaCustomStyle(value?: string | null): CartaCustomStyle {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "soft" || normalized === "neon" || normalized === "luxe") {
    return normalized;
  }
  return CARTA_CUSTOM_DEFAULTS.style;
}

function buildCustomRgbThemeTokens(input?: CartaCustomThemeInput): CartaThemeTokens {
  const primary = safeCustomHex(input?.primary, CARTA_CUSTOM_DEFAULTS.primary);
  const secondary = safeCustomHex(input?.secondary, CARTA_CUSTOM_DEFAULTS.secondary);
  const accent = safeCustomHex(input?.accent, CARTA_CUSTOM_DEFAULTS.accent);
  const style = getSafeCartaCustomStyle(input?.style);

  const primaryHover = shiftHex(primary, -14);
  const accentHover = shiftHex(accent, -10);
  const lightText = "#f8fafc";

  if (style === "neon") {
    return {
      background: "#030712",
      surface: `linear-gradient(155deg, ${hexToRgba(secondary, 0.88)} 0%, ${hexToRgba(primary, 0.26)} 60%, ${hexToRgba(accent, 0.22)} 100%)`,
      surface2: `linear-gradient(145deg, ${hexToRgba(secondary, 0.94)} 0%, ${hexToRgba(primary, 0.2)} 100%)`,
      text: lightText,
      mutedText: "#cbd5e1",
      primary,
      primaryHover,
      primaryText: "#f8fafc",
      accent,
      accentHover,
      border: hexToRgba(primary, 0.42),
      ring: hexToRgba(primary, 0.55),
      shadow: `0 18px 36px -24px ${hexToRgba(primary, 0.58)}`,
      chipBg: hexToRgba(secondary, 0.9),
      chipText: lightText,
      chipActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.94)} 0%, ${hexToRgba(accent, 0.86)} 100%)`,
      chipActiveText: "#ffffff",
      chipBorder: hexToRgba(primary, 0.42),
      navBg: `linear-gradient(120deg, ${hexToRgba(secondary, 0.96)} 0%, ${hexToRgba(primary, 0.18)} 100%)`,
      navActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.95)} 0%, ${hexToRgba(accent, 0.88)} 100%)`,
      navActiveText: "#ffffff",
      navText: "#cbd5e1",
      badgeBg: `linear-gradient(120deg, ${hexToRgba(accent, 0.92)} 0%, ${hexToRgba(primary, 0.9)} 100%)`,
      badgeText: "#ffffff",
      buttonBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.94)} 0%, ${hexToRgba(accent, 0.86)} 100%)`,
      buttonText: "#ffffff",
      buttonSecondaryBg: hexToRgba(secondary, 0.9),
      inputBg: hexToRgba(secondary, 0.88),
      inputText: lightText,
      placeholder: "#94a3b8",
      inputBorder: hexToRgba(primary, 0.4),
      gradientHero: `linear-gradient(120deg, ${hexToRgba(secondary, 0.96)} 0%, ${hexToRgba(primary, 0.24)} 50%, ${hexToRgba(accent, 0.2)} 100%)`,
    };
  }

  if (style === "soft") {
    return {
      background: "#f8fafc",
      surface: `linear-gradient(155deg, rgba(255,255,255,0.97) 0%, ${hexToRgba(primary, 0.12)} 100%)`,
      surface2: `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, ${hexToRgba(accent, 0.12)} 100%)`,
      text: "#0f172a",
      mutedText: "#475569",
      primary,
      primaryHover,
      primaryText: "#ffffff",
      accent,
      accentHover,
      border: hexToRgba(primary, 0.24),
      ring: hexToRgba(primary, 0.34),
      shadow: `0 16px 30px -24px ${hexToRgba(primary, 0.34)}`,
      chipBg: "rgba(255,255,255,0.96)",
      chipText: "#0f172a",
      chipActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.86)} 100%)`,
      chipActiveText: "#ffffff",
      chipBorder: hexToRgba(primary, 0.24),
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
      navActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.86)} 100%)`,
      navActiveText: "#ffffff",
      navText: "#334155",
      badgeBg: `linear-gradient(120deg, ${hexToRgba(accent, 0.92)} 0%, ${hexToRgba(primary, 0.86)} 100%)`,
      badgeText: "#ffffff",
      buttonBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.86)} 100%)`,
      buttonText: "#ffffff",
      buttonSecondaryBg: hexToRgba(primary, 0.1),
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#0f172a",
      placeholder: "#64748b",
      inputBorder: hexToRgba(primary, 0.2),
      gradientHero: `linear-gradient(120deg, rgba(255,255,255,0.98) 0%, ${hexToRgba(primary, 0.14)} 50%, ${hexToRgba(accent, 0.14)} 100%)`,
    };
  }

  return {
    background: "#070a12",
    surface: `linear-gradient(160deg, ${hexToRgba(secondary, 0.95)} 0%, ${hexToRgba(primary, 0.24)} 42%, ${hexToRgba(accent, 0.18)} 100%)`,
    surface2: `linear-gradient(145deg, ${hexToRgba(secondary, 0.94)} 0%, ${hexToRgba(primary, 0.18)} 100%)`,
    text: lightText,
    mutedText: "#cbd5e1",
    primary,
    primaryHover,
    primaryText: "#ffffff",
    accent,
    accentHover,
    border: hexToRgba(primary, 0.34),
    ring: hexToRgba(primary, 0.46),
    shadow: `0 18px 36px -24px ${hexToRgba(primary, 0.5)}`,
    chipBg: hexToRgba(secondary, 0.9),
    chipText: lightText,
    chipActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.84)} 100%)`,
    chipActiveText: "#ffffff",
    chipBorder: hexToRgba(primary, 0.36),
    navBg: `linear-gradient(120deg, ${hexToRgba(secondary, 0.96)} 0%, ${hexToRgba(primary, 0.14)} 100%)`,
    navActiveBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.84)} 100%)`,
    navActiveText: "#ffffff",
    navText: "#cbd5e1",
    badgeBg: `linear-gradient(120deg, ${hexToRgba(accent, 0.9)} 0%, ${hexToRgba(primary, 0.86)} 100%)`,
    badgeText: "#ffffff",
    buttonBg: `linear-gradient(130deg, ${hexToRgba(primary, 0.92)} 0%, ${hexToRgba(accent, 0.84)} 100%)`,
    buttonText: "#ffffff",
    buttonSecondaryBg: hexToRgba(secondary, 0.9),
    inputBg: hexToRgba(secondary, 0.88),
    inputText: lightText,
    placeholder: "#94a3b8",
    inputBorder: hexToRgba(primary, 0.32),
    gradientHero: `linear-gradient(120deg, ${hexToRgba(secondary, 0.96)} 0%, ${hexToRgba(primary, 0.2)} 46%, ${hexToRgba(accent, 0.16)} 100%)`,
  };
}

export const CARTA_THEMES = {
  gourmet: {
    id: "gourmet",
    name: "Ceviche House",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta marina enfocada en pedidos por WhatsApp.",
    official: true,
    sortOrder: 4,
    tokens: {
      background: "#05070d",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(250,204,21,0.08) 34%, rgba(3,7,18,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(2,6,23,0.95) 0%, rgba(180,83,9,0.16) 100%)",
      text: "#f8fafc",
      mutedText: "#cbd5e1",
      primary: "#d4a84f",
      primaryHover: "#e4bf70",
      primaryText: "#0b1220",
      accent: "#b45309",
      accentHover: "#c66a1a",
      border: "rgba(212,168,79,0.34)",
      ring: "rgba(212,168,79,0.46)",
      shadow: "0 18px 36px -24px rgba(212,168,79,0.55)",
      chipBg: "rgba(12,18,30,0.88)",
      chipText: "#e2e8f0",
      chipActiveBg: "linear-gradient(130deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.26) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(212,168,79,0.42)",
      navBg: "linear-gradient(120deg, rgba(3,7,18,0.95) 0%, rgba(10,15,27,0.95) 100%)",
      navActiveBg: "linear-gradient(125deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.28) 100%)",
      navActiveText: "#fff7ed",
      navText: "#cbd5e1",
      badgeBg: "linear-gradient(120deg, rgba(127,29,29,0.9) 0%, rgba(212,168,79,0.36) 100%)",
      badgeText: "#fef2f2",
      buttonBg: "linear-gradient(130deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.3) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(11,18,32,0.88)",
      inputBg: "rgba(9,14,26,0.86)",
      inputText: "#f8fafc",
      placeholder: "#94a3b8",
      inputBorder: "rgba(212,168,79,0.34)",
      gradientHero: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(212,168,79,0.22) 42%, rgba(180,83,9,0.2) 100%)",
    },
  },
  cafe: {
    id: "cafe",
    name: "Coffee Route",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Menu cafeteria con upsell y recomendados.",
    official: true,
    sortOrder: 3,
    tokens: {
      background: "#f5ede2",
      surface: "linear-gradient(150deg, rgba(255,255,255,0.88) 0%, rgba(210,180,140,0.2) 100%)",
      surface2: "linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(205,133,63,0.18) 100%)",
      text: "#3a281f",
      mutedText: "#6c5648",
      primary: "#6f4e37",
      primaryHover: "#5b3f2d",
      primaryText: "#fff7ed",
      accent: "#b86f50",
      accentHover: "#9f5f45",
      border: "rgba(111,78,55,0.24)",
      ring: "rgba(111,78,55,0.38)",
      shadow: "0 16px 30px -24px rgba(111,78,55,0.35)",
      chipBg: "rgba(255,250,244,0.92)",
      chipText: "#4a3226",
      chipActiveBg: "linear-gradient(130deg, rgba(111,78,55,0.92) 0%, rgba(91,63,45,0.9) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(111,78,55,0.26)",
      navBg: "linear-gradient(120deg, rgba(255,249,242,0.92) 0%, rgba(241,226,206,0.92) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(111,78,55,0.9) 0%, rgba(91,63,45,0.88) 100%)",
      navActiveText: "#fff7ed",
      navText: "#6c5648",
      badgeBg: "linear-gradient(120deg, rgba(184,111,80,0.92) 0%, rgba(111,78,55,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(111,78,55,0.92) 0%, rgba(91,63,45,0.9) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(111,78,55,0.12)",
      inputBg: "rgba(255,252,247,0.92)",
      inputText: "#3a281f",
      placeholder: "#8b6e5c",
      inputBorder: "rgba(111,78,55,0.24)",
      gradientHero: "linear-gradient(120deg, rgba(255,248,238,0.95) 0%, rgba(210,180,140,0.38) 45%, rgba(184,111,80,0.28) 100%)",
    },
  },
  sushi: {
    id: "sushi",
    name: "Sushi Prime",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta premium con favoritos del dia y pedidos por WhatsApp.",
    official: true,
    sortOrder: 1,
    tokens: {
      background: "#08090c",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(185,28,28,0.16) 42%, rgba(10,10,10,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(10,10,10,0.95) 0%, rgba(153,27,27,0.18) 100%)",
      text: "#f5f5f4",
      mutedText: "#d6d3d1",
      primary: "#b91c1c",
      primaryHover: "#991b1b",
      primaryText: "#fff7ed",
      accent: "#f1f5f9",
      accentHover: "#e2e8f0",
      border: "rgba(185,28,28,0.34)",
      ring: "rgba(185,28,28,0.46)",
      shadow: "0 18px 36px -24px rgba(185,28,28,0.45)",
      chipBg: "rgba(24,24,27,0.9)",
      chipText: "#e7e5e4",
      chipActiveBg: "linear-gradient(130deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(185,28,28,0.38)",
      navBg: "linear-gradient(120deg, rgba(9,9,11,0.95) 0%, rgba(24,24,27,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(185,28,28,0.86) 0%, rgba(127,29,29,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#d6d3d1",
      badgeBg: "linear-gradient(120deg, rgba(185,28,28,0.95) 0%, rgba(239,68,68,0.8) 100%)",
      badgeText: "#fff5f5",
      buttonBg: "linear-gradient(130deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.88) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(24,24,27,0.88)",
      inputBg: "rgba(24,24,27,0.9)",
      inputText: "#f5f5f4",
      placeholder: "#a8a29e",
      inputBorder: "rgba(185,28,28,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(185,28,28,0.24) 45%, rgba(245,245,244,0.08) 100%)",
    },
  },
  fastfood: {
    id: "fastfood",
    name: "Burger Lab",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Combos rapidos y categorias para delivery.",
    official: true,
    sortOrder: 2,
    tokens: {
      background: "#11151b",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(251,146,60,0.18) 44%, rgba(15,23,42,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(30,41,59,0.94) 0%, rgba(251,191,36,0.16) 100%)",
      text: "#f8fafc",
      mutedText: "#cbd5e1",
      primary: "#f97316",
      primaryHover: "#ea580c",
      primaryText: "#fff7ed",
      accent: "#fbbf24",
      accentHover: "#f59e0b",
      border: "rgba(249,115,22,0.34)",
      ring: "rgba(249,115,22,0.46)",
      shadow: "0 18px 36px -24px rgba(249,115,22,0.45)",
      chipBg: "rgba(15,23,42,0.88)",
      chipText: "#f1f5f9",
      chipActiveBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(249,115,22,0.38)",
      navBg: "linear-gradient(120deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#cbd5e1",
      badgeBg: "linear-gradient(120deg, rgba(220,38,38,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(15,23,42,0.88)",
      inputBg: "rgba(15,23,42,0.88)",
      inputText: "#f8fafc",
      placeholder: "#94a3b8",
      inputBorder: "rgba(249,115,22,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(15,23,42,0.95) 0%, rgba(249,115,22,0.24) 48%, rgba(251,191,36,0.2) 100%)",
    },
  },
  polleria_parrilla: {
    id: "polleria_parrilla",
    name: "Brasa Power",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Pollo a la brasa con combos y delivery por zonas.",
    official: true,
    sortOrder: 6,
    tokens: {
      background: "#080a0d",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(245,158,11,0.16) 40%, rgba(10,10,10,0.95) 100%)",
      surface2: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(217,119,6,0.18) 100%)",
      text: "#f8fafc",
      mutedText: "#d1d5db",
      primary: "#f59e0b",
      primaryHover: "#d97706",
      primaryText: "#fff7ed",
      accent: "#b91c1c",
      accentHover: "#991b1b",
      border: "rgba(245,158,11,0.34)",
      ring: "rgba(245,158,11,0.46)",
      shadow: "0 18px 36px -24px rgba(245,158,11,0.46)",
      chipBg: "rgba(17,24,39,0.9)",
      chipText: "#f3f4f6",
      chipActiveBg: "linear-gradient(130deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.86) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(245,158,11,0.38)",
      navBg: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(17,24,39,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(245,158,11,0.88) 0%, rgba(217,119,6,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#d1d5db",
      badgeBg: "linear-gradient(120deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.84) 100%)",
      badgeText: "#fef2f2",
      buttonBg: "linear-gradient(130deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(17,24,39,0.9)",
      inputBg: "rgba(17,24,39,0.9)",
      inputText: "#f8fafc",
      placeholder: "#9ca3af",
      inputBorder: "rgba(245,158,11,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(245,158,11,0.22) 44%, rgba(185,28,28,0.18) 100%)",
    },
  },
  healthy: {
    id: "healthy",
    name: "Tacos Street",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Street food vibrante con acentos verdes y fondo claro.",
    official: false,
    sortOrder: 7,
    tokens: {
      background: "#f7faf8",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(22,163,74,0.08) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(132,204,22,0.12) 100%)",
      text: "#1f2937",
      mutedText: "#4b5563",
      primary: "#166534",
      primaryHover: "#14532d",
      primaryText: "#f0fdf4",
      accent: "#84cc16",
      accentHover: "#65a30d",
      border: "rgba(22,101,52,0.24)",
      ring: "rgba(22,101,52,0.34)",
      shadow: "0 16px 30px -24px rgba(22,101,52,0.34)",
      chipBg: "rgba(255,255,255,0.95)",
      chipText: "#1f2937",
      chipActiveBg: "linear-gradient(130deg, rgba(22,101,52,0.92) 0%, rgba(21,128,61,0.9) 100%)",
      chipActiveText: "#f0fdf4",
      chipBorder: "rgba(22,101,52,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.94) 0%, rgba(240,253,244,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(22,101,52,0.9) 0%, rgba(21,128,61,0.88) 100%)",
      navActiveText: "#f0fdf4",
      navText: "#4b5563",
      badgeBg: "linear-gradient(120deg, rgba(101,163,13,0.9) 0%, rgba(22,101,52,0.82) 100%)",
      badgeText: "#f7fee7",
      buttonBg: "linear-gradient(130deg, rgba(22,101,52,0.9) 0%, rgba(21,128,61,0.88) 100%)",
      buttonText: "#f0fdf4",
      buttonSecondaryBg: "rgba(22,101,52,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#1f2937",
      placeholder: "#6b7280",
      inputBorder: "rgba(22,101,52,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(22,163,74,0.14) 48%, rgba(132,204,22,0.12) 100%)",
    },
  },
  desserts: {
    id: "desserts",
    name: "Pizza Norte",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Pizzeria con promos y pedidos rapidos por WhatsApp.",
    official: true,
    sortOrder: 5,
    tokens: {
      background: "#fff5f7",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(244,114,182,0.12) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(210,105,30,0.1) 100%)",
      text: "#4a1d2b",
      mutedText: "#7a4b58",
      primary: "#be185d",
      primaryHover: "#9d174d",
      primaryText: "#fff1f2",
      accent: "#a16207",
      accentHover: "#854d0e",
      border: "rgba(190,24,93,0.24)",
      ring: "rgba(190,24,93,0.34)",
      shadow: "0 16px 30px -24px rgba(190,24,93,0.34)",
      chipBg: "rgba(255,255,255,0.95)",
      chipText: "#4a1d2b",
      chipActiveBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      chipActiveText: "#fff1f2",
      chipBorder: "rgba(190,24,93,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(255,241,242,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      navActiveText: "#fff1f2",
      navText: "#7a4b58",
      badgeBg: "linear-gradient(120deg, rgba(161,98,7,0.9) 0%, rgba(190,24,93,0.8) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      buttonText: "#fff1f2",
      buttonSecondaryBg: "rgba(190,24,93,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#4a1d2b",
      placeholder: "#8b5e67",
      inputBorder: "rgba(190,24,93,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(244,114,182,0.18) 48%, rgba(161,98,7,0.12) 100%)",
    },
  },
  bar_drinks: {
    id: "bar_drinks",
    name: "Fuego Criollo",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Parrilla urbana premium con look nocturno.",
    official: false,
    sortOrder: 8,
    tokens: {
      background: "#050711",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(124,58,237,0.18) 44%, rgba(4,10,24,0.94) 100%)",
      surface2: "linear-gradient(145deg, rgba(2,6,23,0.95) 0%, rgba(14,116,144,0.16) 100%)",
      text: "#e2e8f0",
      mutedText: "#a5b4fc",
      primary: "#7c3aed",
      primaryHover: "#6d28d9",
      primaryText: "#eef2ff",
      accent: "#0891b2",
      accentHover: "#0e7490",
      border: "rgba(124,58,237,0.3)",
      ring: "rgba(124,58,237,0.44)",
      shadow: "0 18px 36px -24px rgba(124,58,237,0.44)",
      chipBg: "rgba(2,6,23,0.9)",
      chipText: "#c7d2fe",
      chipActiveBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      chipActiveText: "#eef2ff",
      chipBorder: "rgba(124,58,237,0.34)",
      navBg: "linear-gradient(120deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      navActiveText: "#eef2ff",
      navText: "#a5b4fc",
      badgeBg: "linear-gradient(120deg, rgba(30,64,175,0.9) 0%, rgba(124,58,237,0.82) 100%)",
      badgeText: "#eef2ff",
      buttonBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      buttonText: "#eef2ff",
      buttonSecondaryBg: "rgba(2,6,23,0.88)",
      inputBg: "rgba(2,6,23,0.88)",
      inputText: "#e2e8f0",
      placeholder: "#94a3b8",
      inputBorder: "rgba(124,58,237,0.3)",
      gradientHero: "linear-gradient(120deg, rgba(2,6,23,0.96) 0%, rgba(124,58,237,0.22) 42%, rgba(8,145,178,0.18) 100%)",
    },
  },
  marina_fresh: {
    id: "marina_fresh",
    name: "Marina Fresh",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estilo marino claro para cevicherias y pescados.",
    official: false,
    sortOrder: 9,
    tokens: {
      background: "#f2f9fb",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(14,116,144,0.12) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.1) 100%)",
      text: "#0f172a",
      mutedText: "#334155",
      primary: "#0e7490",
      primaryHover: "#155e75",
      primaryText: "#ecfeff",
      accent: "#0284c7",
      accentHover: "#0369a1",
      border: "rgba(14,116,144,0.24)",
      ring: "rgba(14,116,144,0.35)",
      shadow: "0 16px 30px -24px rgba(14,116,144,0.38)",
      chipBg: "rgba(255,255,255,0.96)",
      chipText: "#0f172a",
      chipActiveBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      chipActiveText: "#ecfeff",
      chipBorder: "rgba(14,116,144,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      navActiveText: "#ecfeff",
      navText: "#334155",
      badgeBg: "linear-gradient(120deg, rgba(2,132,199,0.9) 0%, rgba(14,116,144,0.84) 100%)",
      badgeText: "#ecfeff",
      buttonBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      buttonText: "#ecfeff",
      buttonSecondaryBg: "rgba(14,116,144,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#0f172a",
      placeholder: "#64748b",
      inputBorder: "rgba(14,116,144,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(14,116,144,0.12) 48%, rgba(2,132,199,0.14) 100%)",
    },
  },
  criollo_lima: {
    id: "criollo_lima",
    name: "Criollo Lima",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta tradicional con acentos dorados y gran contraste.",
    official: false,
    sortOrder: 10,
    tokens: {
      background: "#101214",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(202,138,4,0.16) 44%, rgba(9,9,11,0.94) 100%)",
      surface2: "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(161,98,7,0.2) 100%)",
      text: "#fefce8",
      mutedText: "#fde68a",
      primary: "#ca8a04",
      primaryHover: "#a16207",
      primaryText: "#fff7ed",
      accent: "#f97316",
      accentHover: "#ea580c",
      border: "rgba(202,138,4,0.34)",
      ring: "rgba(202,138,4,0.45)",
      shadow: "0 18px 36px -24px rgba(202,138,4,0.5)",
      chipBg: "rgba(24,24,27,0.9)",
      chipText: "#fde68a",
      chipActiveBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(202,138,4,0.34)",
      navBg: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(24,24,27,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#fde68a",
      badgeBg: "linear-gradient(120deg, rgba(249,115,22,0.9) 0%, rgba(202,138,4,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(24,24,27,0.9)",
      inputBg: "rgba(24,24,27,0.9)",
      inputText: "#fefce8",
      placeholder: "#fcd34d",
      inputBorder: "rgba(202,138,4,0.28)",
      gradientHero: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(202,138,4,0.26) 44%, rgba(249,115,22,0.2) 100%)",
    },
  },
  neon_izakaya: {
    id: "neon_izakaya",
    name: "Neon Izakaya",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estetica nocturna con acentos neon para barras y cocina asiatica.",
    official: false,
    premium: true,
    sortOrder: 11,
    tokens: {
      background: "#04060f",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(59,130,246,0.18) 42%, rgba(12,10,30,0.94) 100%)",
      surface2: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(168,85,247,0.2) 100%)",
      text: "#eef2ff",
      mutedText: "#c4b5fd",
      primary: "#6366f1",
      primaryHover: "#4f46e5",
      primaryText: "#eef2ff",
      accent: "#22d3ee",
      accentHover: "#06b6d4",
      border: "rgba(99,102,241,0.34)",
      ring: "rgba(99,102,241,0.46)",
      shadow: "0 18px 36px -24px rgba(99,102,241,0.48)",
      chipBg: "rgba(15,23,42,0.9)",
      chipText: "#e0e7ff",
      chipActiveBg: "linear-gradient(130deg, rgba(99,102,241,0.9) 0%, rgba(34,211,238,0.84) 100%)",
      chipActiveText: "#ecfeff",
      chipBorder: "rgba(99,102,241,0.34)",
      navBg: "linear-gradient(120deg, rgba(2,6,23,0.96) 0%, rgba(17,24,39,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(99,102,241,0.9) 0%, rgba(34,211,238,0.84) 100%)",
      navActiveText: "#ecfeff",
      navText: "#c4b5fd",
      badgeBg: "linear-gradient(120deg, rgba(168,85,247,0.92) 0%, rgba(99,102,241,0.86) 100%)",
      badgeText: "#f5f3ff",
      buttonBg: "linear-gradient(130deg, rgba(99,102,241,0.92) 0%, rgba(34,211,238,0.84) 100%)",
      buttonText: "#ecfeff",
      buttonSecondaryBg: "rgba(15,23,42,0.9)",
      inputBg: "rgba(15,23,42,0.88)",
      inputText: "#eef2ff",
      placeholder: "#a5b4fc",
      inputBorder: "rgba(99,102,241,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(2,6,23,0.96) 0%, rgba(99,102,241,0.22) 46%, rgba(34,211,238,0.18) 100%)",
    },
  },
  andes_brasa: {
    id: "andes_brasa",
    name: "Andes Brasa",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1529692236671-f1dc4f4a1f54?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Sabor ahumado con presencia premium para parrillas y brasas.",
    official: false,
    premium: true,
    sortOrder: 12,
    tokens: {
      background: "#0c0d0f",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(217,119,6,0.2) 42%, rgba(9,9,11,0.95) 100%)",
      surface2: "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(127,29,29,0.18) 100%)",
      text: "#fef3c7",
      mutedText: "#fcd34d",
      primary: "#d97706",
      primaryHover: "#b45309",
      primaryText: "#fff7ed",
      accent: "#dc2626",
      accentHover: "#b91c1c",
      border: "rgba(217,119,6,0.34)",
      ring: "rgba(217,119,6,0.46)",
      shadow: "0 18px 36px -24px rgba(217,119,6,0.48)",
      chipBg: "rgba(24,24,27,0.92)",
      chipText: "#fde68a",
      chipActiveBg: "linear-gradient(130deg, rgba(217,119,6,0.92) 0%, rgba(220,38,38,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(217,119,6,0.36)",
      navBg: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(24,24,27,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(217,119,6,0.92) 0%, rgba(220,38,38,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#fde68a",
      badgeBg: "linear-gradient(120deg, rgba(220,38,38,0.9) 0%, rgba(217,119,6,0.86) 100%)",
      badgeText: "#fef2f2",
      buttonBg: "linear-gradient(130deg, rgba(217,119,6,0.92) 0%, rgba(220,38,38,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(24,24,27,0.9)",
      inputBg: "rgba(24,24,27,0.88)",
      inputText: "#fef3c7",
      placeholder: "#f59e0b",
      inputBorder: "rgba(217,119,6,0.3)",
      gradientHero: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(217,119,6,0.24) 44%, rgba(220,38,38,0.18) 100%)",
    },
  },
  mediterraneo_luxe: {
    id: "mediterraneo_luxe",
    name: "Mediterraneo Luxe",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Look claro premium para pescados, brunch y cocina de autor.",
    official: false,
    premium: true,
    sortOrder: 13,
    tokens: {
      background: "#f4f8fb",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(14,165,233,0.1) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(59,130,246,0.12) 100%)",
      text: "#0f172a",
      mutedText: "#334155",
      primary: "#0f766e",
      primaryHover: "#115e59",
      primaryText: "#ecfeff",
      accent: "#2563eb",
      accentHover: "#1d4ed8",
      border: "rgba(14,118,110,0.24)",
      ring: "rgba(14,118,110,0.36)",
      shadow: "0 16px 30px -24px rgba(37,99,235,0.34)",
      chipBg: "rgba(255,255,255,0.96)",
      chipText: "#0f172a",
      chipActiveBg: "linear-gradient(130deg, rgba(15,118,110,0.92) 0%, rgba(37,99,235,0.86) 100%)",
      chipActiveText: "#ecfeff",
      chipBorder: "rgba(15,118,110,0.22)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(15,118,110,0.92) 0%, rgba(37,99,235,0.86) 100%)",
      navActiveText: "#ecfeff",
      navText: "#334155",
      badgeBg: "linear-gradient(120deg, rgba(37,99,235,0.9) 0%, rgba(15,118,110,0.84) 100%)",
      badgeText: "#eff6ff",
      buttonBg: "linear-gradient(130deg, rgba(15,118,110,0.92) 0%, rgba(37,99,235,0.86) 100%)",
      buttonText: "#ecfeff",
      buttonSecondaryBg: "rgba(37,99,235,0.08)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#0f172a",
      placeholder: "#64748b",
      inputBorder: "rgba(37,99,235,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(14,165,233,0.14) 46%, rgba(37,99,235,0.16) 100%)",
    },
  },
  urban_matcha: {
    id: "urban_matcha",
    name: "Urban Matcha",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estilo limpio y natural con conversion alta en mobile.",
    official: false,
    premium: true,
    sortOrder: 14,
    tokens: {
      background: "#f3f8f4",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(16,185,129,0.1) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(132,204,22,0.12) 100%)",
      text: "#10231d",
      mutedText: "#365048",
      primary: "#15803d",
      primaryHover: "#166534",
      primaryText: "#f0fdf4",
      accent: "#0f766e",
      accentHover: "#115e59",
      border: "rgba(21,128,61,0.24)",
      ring: "rgba(21,128,61,0.36)",
      shadow: "0 16px 30px -24px rgba(21,128,61,0.3)",
      chipBg: "rgba(255,255,255,0.96)",
      chipText: "#10231d",
      chipActiveBg: "linear-gradient(130deg, rgba(21,128,61,0.92) 0%, rgba(15,118,110,0.86) 100%)",
      chipActiveText: "#ecfeff",
      chipBorder: "rgba(21,128,61,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(236,253,245,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(21,128,61,0.92) 0%, rgba(15,118,110,0.86) 100%)",
      navActiveText: "#ecfeff",
      navText: "#365048",
      badgeBg: "linear-gradient(120deg, rgba(15,118,110,0.9) 0%, rgba(21,128,61,0.84) 100%)",
      badgeText: "#ecfeff",
      buttonBg: "linear-gradient(130deg, rgba(21,128,61,0.92) 0%, rgba(15,118,110,0.86) 100%)",
      buttonText: "#ecfeff",
      buttonSecondaryBg: "rgba(21,128,61,0.08)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#10231d",
      placeholder: "#5f7d74",
      inputBorder: "rgba(21,128,61,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(16,185,129,0.14) 48%, rgba(15,118,110,0.12) 100%)",
    },
  },
  royal_cacao: {
    id: "royal_cacao",
    name: "Royal Cacao",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Chocolate oscuro premium para postres y experiencias gourmet.",
    official: false,
    premium: true,
    sortOrder: 15,
    tokens: {
      background: "#110d0b",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(180,83,9,0.18) 42%, rgba(17,12,10,0.95) 100%)",
      surface2: "linear-gradient(145deg, rgba(41,26,20,0.95) 0%, rgba(120,53,15,0.2) 100%)",
      text: "#fff7ed",
      mutedText: "#fdba74",
      primary: "#c2410c",
      primaryHover: "#9a3412",
      primaryText: "#fff7ed",
      accent: "#f59e0b",
      accentHover: "#d97706",
      border: "rgba(194,65,12,0.34)",
      ring: "rgba(194,65,12,0.46)",
      shadow: "0 18px 36px -24px rgba(194,65,12,0.48)",
      chipBg: "rgba(41,26,20,0.9)",
      chipText: "#ffedd5",
      chipActiveBg: "linear-gradient(130deg, rgba(194,65,12,0.92) 0%, rgba(245,158,11,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(194,65,12,0.34)",
      navBg: "linear-gradient(120deg, rgba(17,12,10,0.96) 0%, rgba(41,26,20,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(194,65,12,0.92) 0%, rgba(245,158,11,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#fdba74",
      badgeBg: "linear-gradient(120deg, rgba(245,158,11,0.9) 0%, rgba(194,65,12,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(194,65,12,0.92) 0%, rgba(245,158,11,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(41,26,20,0.9)",
      inputBg: "rgba(41,26,20,0.88)",
      inputText: "#fff7ed",
      placeholder: "#fdba74",
      inputBorder: "rgba(194,65,12,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(17,12,10,0.96) 0%, rgba(194,65,12,0.24) 44%, rgba(245,158,11,0.2) 100%)",
    },
  },
  pacifico_breeze: {
    id: "pacifico_breeze",
    name: "Pacifico Breeze",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Visual marino premium con contraste alto para carta y reservas.",
    official: false,
    premium: true,
    sortOrder: 16,
    tokens: buildCustomRgbThemeTokens({ primary: "#0e7490", secondary: "#0b1120", accent: "#22d3ee", style: "luxe" }),
  },
  mango_fuego: {
    id: "mango_fuego",
    name: "Mango Fuego",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Paleta tropical de alto impacto para menus con fotos vibrantes.",
    official: false,
    premium: true,
    sortOrder: 17,
    tokens: buildCustomRgbThemeTokens({ primary: "#f97316", secondary: "#1e1b4b", accent: "#facc15", style: "luxe" }),
  },
  velvet_night: {
    id: "velvet_night",
    name: "Velvet Night",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1514361892635-eae31ec6a8c0?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estilo nocturno elegante para restobar, cocteles y cocina de autor.",
    official: false,
    premium: true,
    sortOrder: 18,
    tokens: buildCustomRgbThemeTokens({ primary: "#7c3aed", secondary: "#111827", accent: "#ec4899", style: "neon" }),
  },
  oliva_garden: {
    id: "oliva_garden",
    name: "Oliva Garden",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Tema claro premium para cocina saludable, brunch y cafeterias.",
    official: false,
    premium: true,
    sortOrder: 19,
    tokens: buildCustomRgbThemeTokens({ primary: "#15803d", secondary: "#f8fafc", accent: "#84cc16", style: "soft" }),
  },
  cobre_urbano: {
    id: "cobre_urbano",
    name: "Cobre Urbano",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Look industrial premium para hamburguesas, parrilla y street food.",
    official: false,
    premium: true,
    sortOrder: 20,
    tokens: buildCustomRgbThemeTokens({ primary: "#b45309", secondary: "#0f172a", accent: "#fb7185", style: "luxe" }),
  },
  aurora_mint: {
    id: "aurora_mint",
    name: "Aurora Mint",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Combinacion fresca y limpia para propuestas modernas en mobile.",
    official: false,
    premium: true,
    sortOrder: 21,
    tokens: buildCustomRgbThemeTokens({ primary: "#0f766e", secondary: "#ecfeff", accent: "#06b6d4", style: "soft" }),
  },
  rubi_carmin: {
    id: "rubi_carmin",
    name: "Rubi Carmin",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estetica intensa para marcas con personalidad visual fuerte.",
    official: false,
    premium: true,
    sortOrder: 22,
    tokens: buildCustomRgbThemeTokens({ primary: "#be123c", secondary: "#1f2937", accent: "#f97316", style: "neon" }),
  },
  zafiro_cloud: {
    id: "zafiro_cloud",
    name: "Zafiro Cloud",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Tema premium claro con acentos azules para lectura impecable.",
    official: false,
    premium: true,
    sortOrder: 23,
    tokens: buildCustomRgbThemeTokens({ primary: "#1d4ed8", secondary: "#f8fafc", accent: "#0ea5e9", style: "soft" }),
  },
  rgb_creator: {
    id: "rgb_creator",
    name: "RGB Personalizable",
    rubro: "Tema premium - Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Crea tu propio diseño con colores RGB y estilo visual premium.",
    official: false,
    premium: true,
    sortOrder: 24,
    tokens: buildCustomRgbThemeTokens(),
  },
} as const satisfies Record<string, CartaThemePreset>;

export type CartaThemeId = keyof typeof CARTA_THEMES;

export const DEFAULT_THEME_BY_RUBRO: Record<string, CartaThemeId> = {
  "Gourmet / Fine Dining": "gourmet",
  "Cafe / Bakery": "cafe",
  "Sushi / Asian": "sushi",
  "Fast Food / Burger": "fastfood",
  "Polleria / Parrilla": "polleria_parrilla",
  "Healthy / Vegano": "healthy",
  "Postres / Heladeria": "desserts",
  "Bar / Drinks": "bar_drinks",
  "Restaurante / Cafeteria": "sushi",
  "Tienda / General": "fastfood",
};

const LEGACY_THEME_ALIASES: Record<string, CartaThemeId> = {
  gourmet: "gourmet",
  cafe: "cafe",
  sushi: "sushi",
  fastfood: "fastfood",
  polleria_parrilla: "polleria_parrilla",
  healthy: "healthy",
  desserts: "desserts",
  bar_drinks: "bar_drinks",
  neon_izakaya: "neon_izakaya",
  andes_brasa: "andes_brasa",
  mediterraneo_luxe: "mediterraneo_luxe",
  urban_matcha: "urban_matcha",
  royal_cacao: "royal_cacao",
  pacifico_breeze: "pacifico_breeze",
  mango_fuego: "mango_fuego",
  velvet_night: "velvet_night",
  oliva_garden: "oliva_garden",
  cobre_urbano: "cobre_urbano",
  aurora_mint: "aurora_mint",
  rubi_carmin: "rubi_carmin",
  zafiro_cloud: "zafiro_cloud",
  rgb_creator: "rgb_creator",
};

const RESTAURANT_DEMO_SLUG_THEME_MAP: Record<string, CartaThemeId> = {
  "sushi-prime": "sushi",
  "pizza-norte": "desserts",
  "burger-lab": "fastfood",
  "coffee-route": "cafe",
  "brasa-power": "polleria_parrilla",
  "ceviche-house": "gourmet",
};

export const CARTA_THEME_OPTIONS = Object.values(CARTA_THEMES)
  .map((theme) => ({
    id: theme.id as CartaThemeId,
    name: theme.name,
    rubro: theme.rubro,
    preview: [theme.tokens.primary, theme.tokens.accent, theme.tokens.background],
    previewImage: theme.previewImage,
    previewDescription: theme.previewDescription,
    official: theme.official,
    premium: Boolean((theme as { premium?: boolean }).premium),
    sortOrder: theme.sortOrder,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder);

export function getSafeCartaThemeId(value?: string | null): CartaThemeId {
  if (!value) return "sushi";
  if (value in CARTA_THEMES) return value as CartaThemeId;
  const alias = LEGACY_THEME_ALIASES[value];
  if (alias && alias in CARTA_THEMES) return alias;
  return "sushi";
}

export function getCartaTheme(themeId?: string | null, customInput?: CartaCustomThemeInput): CartaThemePreset {
  const safeThemeId = getSafeCartaThemeId(themeId);
  const baseTheme = CARTA_THEMES[safeThemeId];
  if (safeThemeId !== "rgb_creator") return baseTheme;
  return {
    ...baseTheme,
    tokens: buildCustomRgbThemeTokens(customInput),
  };
}

export function resolveCartaThemeIdFromDemo(
  demoThemeId?: string | null,
  demoSlug?: string | null,
): CartaThemeId | null {
  const safeSlug = String(demoSlug || "")
    .trim()
    .toLowerCase();
  if (safeSlug && RESTAURANT_DEMO_SLUG_THEME_MAP[safeSlug]) {
    return RESTAURANT_DEMO_SLUG_THEME_MAP[safeSlug];
  }

  const safeThemeId = String(demoThemeId || "").trim();
  if (!safeThemeId) return null;
  if (safeThemeId === "sushiPremium") return "sushi";
  if (safeThemeId === "coffeeLight") return "cafe";
  if (safeThemeId === "foodWarm") return "fastfood";
  if (safeThemeId === "darkKitchen") return "polleria_parrilla";
  return null;
}

export function recommendCartaThemeIdByRubro(rubro?: string | null): CartaThemeId {
  const source = String(rubro || "").toLowerCase().trim();
  if (!source) return "sushi";

  const direct = DEFAULT_THEME_BY_RUBRO[rubro || ""];
  if (direct) return direct;

  if (source.includes("sushi") || source.includes("asian") || source.includes("nikkei") || source.includes("ramen")) {
    return "sushi";
  }
  if (source.includes("cafe") || source.includes("cafeteria") || source.includes("bakery") || source.includes("panader")) {
    return "cafe";
  }
  if (source.includes("burger") || source.includes("fast") || source.includes("hamburg")) {
    return "fastfood";
  }
  if (source.includes("polleria") || source.includes("parrilla") || source.includes("brasa") || source.includes("grill") || source.includes("pollo")) {
    return "polleria_parrilla";
  }
  if (source.includes("ceviche") || source.includes("marino") || source.includes("pescado") || source.includes("marisc")) {
    return "gourmet";
  }
  if (source.includes("pizza") || source.includes("pizzeria")) {
    return "desserts";
  }
  if (source.includes("vegan") || source.includes("vegano") || source.includes("healthy") || source.includes("salud")) {
    return "healthy";
  }
  if (source.includes("postre") || source.includes("helad") || source.includes("dessert") || source.includes("pasteler") || source.includes("dulce")) {
    return "criollo_lima";
  }
  if (source.includes("bar") || source.includes("drink") || source.includes("cocktail") || source.includes("coctel")) {
    return "bar_drinks";
  }
  if (source.includes("taco") || source.includes("mex")) {
    return "healthy";
  }
  if (source.includes("criollo") || source.includes("peruan")) {
    return "criollo_lima";
  }
  if (source.includes("fusion") || source.includes("marina")) {
    return "marina_fresh";
  }
  if (source.includes("gourmet") || source.includes("fine")) {
    return "gourmet";
  }
  return "sushi";
}

export function buildCartaThemeCssVars(themeId?: string | null): Record<string, string> {
  const { tokens } = getCartaTheme(themeId);
  return {
    "--carta-bg": tokens.background,
    "--carta-surface": tokens.surface,
    "--carta-surface-2": tokens.surface2,
    "--carta-text": tokens.text,
    "--carta-muted-text": tokens.mutedText,
    "--carta-primary": tokens.primary,
    "--carta-primary-hover": tokens.primaryHover,
    "--carta-primary-text": tokens.primaryText,
    "--carta-accent": tokens.accent,
    "--carta-accent-hover": tokens.accentHover,
    "--carta-border": tokens.border,
    "--carta-ring": tokens.ring,
    "--carta-shadow": tokens.shadow,
    "--carta-chip-bg": tokens.chipBg,
    "--carta-chip-text": tokens.chipText,
    "--carta-chip-active-bg": tokens.chipActiveBg,
    "--carta-chip-active-text": tokens.chipActiveText,
    "--carta-chip-border": tokens.chipBorder,
    "--carta-nav-bg": tokens.navBg,
    "--carta-nav-active-bg": tokens.navActiveBg,
    "--carta-nav-active-text": tokens.navActiveText,
    "--carta-nav-text": tokens.navText,
    "--carta-badge-bg": tokens.badgeBg,
    "--carta-badge-text": tokens.badgeText,
    "--carta-button-bg": tokens.buttonBg,
    "--carta-button-text": tokens.buttonText,
    "--carta-button-secondary-bg": tokens.buttonSecondaryBg,
    "--carta-input-bg": tokens.inputBg,
    "--carta-input-text": tokens.inputText,
    "--carta-placeholder": tokens.placeholder,
    "--carta-input-border": tokens.inputBorder,
    "--carta-gradient-hero": tokens.gradientHero,
  };
}
