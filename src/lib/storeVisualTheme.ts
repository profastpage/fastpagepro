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
  aurora: {
    id: "aurora",
    label: "Aqua",
    accent: "#0ea5e9",
    secondary: "#14b8a6",
    surface: "#f8fbff",
    page: "#edf3f8",
    dark: "#101828",
    text: "#1f2a3a",
    muted: "#64748b",
  },
  onyx: {
    id: "onyx",
    label: "Gold Noir",
    accent: "#d4a017",
    secondary: "#f7c948",
    surface: "#f8f5ee",
    page: "#efebe0",
    dark: "#111111",
    text: "#1f1f1f",
    muted: "#57534e",
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    accent: "#dc2626",
    secondary: "#ef4444",
    surface: "#f7f8fb",
    page: "#eceef3",
    dark: "#1a1a1a",
    text: "#243248",
    muted: "#64748b",
  },
  mint: {
    id: "mint",
    label: "Mint",
    accent: "#10b981",
    secondary: "#14b8a6",
    surface: "#f5fbf8",
    page: "#eaf6f0",
    dark: "#0f172a",
    text: "#1f2937",
    muted: "#64748b",
  },
  mono: {
    id: "mono",
    label: "Mono",
    accent: "#1f2937",
    secondary: "#475569",
    surface: "#f6f7f9",
    page: "#eceff3",
    dark: "#15191f",
    text: "#202939",
    muted: "#6b7280",
  },
};

function toRgb(value: { r: number; g: number; b: number } | undefined, fallback: string) {
  if (!value) return fallback;
  const r = Math.max(0, Math.min(255, Math.round(value.r || 0)));
  const g = Math.max(0, Math.min(255, Math.round(value.g || 0)));
  const b = Math.max(0, Math.min(255, Math.round(value.b || 0)));
  return `rgb(${r}, ${g}, ${b})`;
}

export function getVisualStoreTheme(config: StoreConfig) {
  const preset = VISUAL_THEMES[config.themeId] || VISUAL_THEMES.aurora;
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
