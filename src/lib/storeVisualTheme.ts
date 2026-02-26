import type { CSSProperties } from "react";
import type { StoreConfig, StoreThemeId } from "@/lib/storefrontGenerator";

type VisualTheme = {
  id: StoreThemeId;
  label: string;
  accent: string;
  secondary: string;
  surface: string;
  page: string;
  dark: string;
  text: string;
  muted: string;
};

const VISUAL_THEMES: Record<StoreThemeId, VisualTheme> = {
  aurora: { id: "aurora", label: "Aurora Cyan", accent: "#0ea5e9", secondary: "#14b8a6", surface: "#f8fbff", page: "#edf3f8", dark: "#101828", text: "#1f2a3a", muted: "#64748b" },
  onyx: { id: "onyx", label: "Onyx Gold", accent: "#d4a017", secondary: "#f7c948", surface: "#f8f5ee", page: "#efebe0", dark: "#111111", text: "#1f1f1f", muted: "#57534e" },
  ruby: { id: "ruby", label: "Ruby Red", accent: "#dc2626", secondary: "#ef4444", surface: "#f7f8fb", page: "#eceef3", dark: "#1a1a1a", text: "#243248", muted: "#64748b" },
  mint: { id: "mint", label: "Mint Fresh", accent: "#10b981", secondary: "#14b8a6", surface: "#f5fbf8", page: "#eaf6f0", dark: "#0f172a", text: "#1f2937", muted: "#64748b" },
  mono: { id: "mono", label: "Mono Minimal", accent: "#1f2937", secondary: "#475569", surface: "#f6f7f9", page: "#eceff3", dark: "#15191f", text: "#202939", muted: "#6b7280" },
  foodWarm: { id: "foodWarm", label: "Food Warm", accent: "#d9480f", secondary: "#f59f00", surface: "#fff7ed", page: "#f8f0e6", dark: "#1f120b", text: "#2f1a0f", muted: "#7a5a44" },
  darkKitchen: { id: "darkKitchen", label: "Dark Kitchen", accent: "#f97316", secondary: "#facc15", surface: "#f7f7f8", page: "#ececec", dark: "#0d0d0d", text: "#1f2937", muted: "#525252" },
  coffeeLight: { id: "coffeeLight", label: "Coffee Light", accent: "#92400e", secondary: "#d6a85a", surface: "#fdf8f2", page: "#f3ece4", dark: "#26190f", text: "#2b2118", muted: "#6b5a49" },
  sushiPremium: { id: "sushiPremium", label: "Sushi Premium", accent: "#b91c1c", secondary: "#f59e0b", surface: "#f6f6f7", page: "#ececef", dark: "#09090b", text: "#18181b", muted: "#52525b" },
  cleanStore: { id: "cleanStore", label: "Clean Store", accent: "#2563eb", secondary: "#38bdf8", surface: "#ffffff", page: "#f1f5f9", dark: "#0b1220", text: "#0f172a", muted: "#64748b" },
  premiumShop: { id: "premiumShop", label: "Premium Shop", accent: "#111827", secondary: "#f59e0b", surface: "#ffffff", page: "#f5f5f4", dark: "#030712", text: "#111827", muted: "#57534e" },
  flashSale: { id: "flashSale", label: "Flash Sale", accent: "#ef4444", secondary: "#fb7185", surface: "#ffffff", page: "#f8fafc", dark: "#0b1020", text: "#0f172a", muted: "#64748b" },
  minimalCommerce: { id: "minimalCommerce", label: "Minimal Commerce", accent: "#334155", secondary: "#94a3b8", surface: "#ffffff", page: "#f8fafc", dark: "#020617", text: "#111827", muted: "#64748b" },
  leadDark: { id: "leadDark", label: "Lead Dark", accent: "#22c55e", secondary: "#06b6d4", surface: "#0f172a", page: "#020617", dark: "#020617", text: "#f8fafc", muted: "#94a3b8" },
  corporateLight: { id: "corporateLight", label: "Corporate Light", accent: "#1d4ed8", secondary: "#0ea5e9", surface: "#ffffff", page: "#f1f5f9", dark: "#0f172a", text: "#0f172a", muted: "#475569" },
  agencyBold: { id: "agencyBold", label: "Agency Bold", accent: "#7c3aed", secondary: "#ec4899", surface: "#111827", page: "#0b1020", dark: "#070b16", text: "#f8fafc", muted: "#c4b5fd" },
};

function toRgb(value: { r: number; g: number; b: number } | undefined, fallback: string) {
  if (!value) return fallback;
  const r = Math.max(0, Math.min(255, Math.round(value.r || 0)));
  const g = Math.max(0, Math.min(255, Math.round(value.g || 0)));
  const b = Math.max(0, Math.min(255, Math.round(value.b || 0)));
  return `rgb(${r}, ${g}, ${b})`;
}

export function getVisualStoreTheme(config: StoreConfig) {
  const preset = VISUAL_THEMES[config.themeId] || VISUAL_THEMES.cleanStore;
  return {
    ...preset,
    accent: toRgb(config.customRgb?.accent, preset.accent),
    secondary: toRgb(config.customRgb?.accent2, preset.secondary),
  };
}

export function getVisualStoreVars(config: StoreConfig): CSSProperties {
  const theme = getVisualStoreTheme(config);
  return {
    "--vs-accent": theme.accent,
    "--vs-accent-2": theme.secondary,
    "--vs-surface": theme.surface,
    "--vs-page": theme.page,
    "--vs-dark": theme.dark,
    "--vs-text": theme.text,
    "--vs-muted": theme.muted,
    "--vs-border": "color-mix(in srgb, var(--vs-accent) 14%, #cbd5e1)",
    "--vs-border-strong": "color-mix(in srgb, var(--vs-accent) 28%, #cbd5e1)",
    "--vs-shadow": "0 18px 32px -24px rgba(15,23,42,.35)",
  } as CSSProperties;
}
