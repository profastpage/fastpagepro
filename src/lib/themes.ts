import type { CSSProperties } from "react";
import { normalizeVertical, type BusinessVertical } from "@/lib/vertical";

export type ThemeToken = {
  id: string;
  vertical: BusinessVertical;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  card: string;
  border: string;
  dark: string;
};

export const THEME_TOKENS: ThemeToken[] = [
  {
    id: "foodWarm",
    vertical: "restaurant",
    name: "Food Warm",
    primary: "#d9480f",
    secondary: "#f59f00",
    bg: "#f8f4ec",
    surface: "#ffffff",
    text: "#2f1a0f",
    muted: "#7a5a44",
    card: "#fff7ed",
    border: "#f3d6bd",
    dark: "#1f120b",
  },
  {
    id: "darkKitchen",
    vertical: "restaurant",
    name: "Dark Kitchen",
    primary: "#f97316",
    secondary: "#fde68a",
    bg: "#111111",
    surface: "#1b1b1b",
    text: "#f8fafc",
    muted: "#cbd5e1",
    card: "#1f2937",
    border: "#374151",
    dark: "#090909",
  },
  {
    id: "coffeeLight",
    vertical: "restaurant",
    name: "Coffee Light",
    primary: "#92400e",
    secondary: "#d6a85a",
    bg: "#f7f3ee",
    surface: "#ffffff",
    text: "#2b2118",
    muted: "#6b5a49",
    card: "#fdf8f2",
    border: "#e8d9c8",
    dark: "#26190f",
  },
  {
    id: "sushiPremium",
    vertical: "restaurant",
    name: "Sushi Premium",
    primary: "#b91c1c",
    secondary: "#111827",
    bg: "#f4f4f5",
    surface: "#ffffff",
    text: "#18181b",
    muted: "#52525b",
    card: "#fafafa",
    border: "#e4e4e7",
    dark: "#09090b",
  },
  {
    id: "cleanStore",
    vertical: "ecommerce",
    name: "Clean Store",
    primary: "#2563eb",
    secondary: "#38bdf8",
    bg: "#f4f7fb",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    card: "#ffffff",
    border: "#dbeafe",
    dark: "#0b1220",
  },
  {
    id: "premiumShop",
    vertical: "ecommerce",
    name: "Premium Shop",
    primary: "#111827",
    secondary: "#f59e0b",
    bg: "#f5f5f4",
    surface: "#ffffff",
    text: "#111827",
    muted: "#57534e",
    card: "#ffffff",
    border: "#e7e5e4",
    dark: "#030712",
  },
  {
    id: "flashSale",
    vertical: "ecommerce",
    name: "Flash Sale",
    primary: "#ef4444",
    secondary: "#fb7185",
    bg: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    card: "#fff1f2",
    border: "#fecdd3",
    dark: "#0b1020",
  },
  {
    id: "minimalCommerce",
    vertical: "ecommerce",
    name: "Minimal Commerce",
    primary: "#334155",
    secondary: "#94a3b8",
    bg: "#f8fafc",
    surface: "#ffffff",
    text: "#111827",
    muted: "#64748b",
    card: "#ffffff",
    border: "#e2e8f0",
    dark: "#020617",
  },
  {
    id: "leadDark",
    vertical: "services",
    name: "Lead Dark",
    primary: "#22c55e",
    secondary: "#06b6d4",
    bg: "#020617",
    surface: "#0f172a",
    text: "#f8fafc",
    muted: "#94a3b8",
    card: "#111827",
    border: "#1f2937",
    dark: "#020617",
  },
  {
    id: "corporateLight",
    vertical: "services",
    name: "Corporate Light",
    primary: "#1d4ed8",
    secondary: "#0ea5e9",
    bg: "#f1f5f9",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#475569",
    card: "#ffffff",
    border: "#cbd5e1",
    dark: "#0f172a",
  },
  {
    id: "agencyBold",
    vertical: "services",
    name: "Agency Bold",
    primary: "#7c3aed",
    secondary: "#ec4899",
    bg: "#0b1020",
    surface: "#111827",
    text: "#f8fafc",
    muted: "#c4b5fd",
    card: "#1f2937",
    border: "#374151",
    dark: "#070b16",
  },
];

export function getThemesByVertical(vertical: unknown) {
  const normalized = normalizeVertical(vertical);
  return THEME_TOKENS.filter((theme) => theme.vertical === normalized);
}

export function resolveThemeById(vertical: unknown, themeId?: string | null): ThemeToken {
  const normalized = normalizeVertical(vertical);
  const verticalThemes = getThemesByVertical(normalized);
  const fromId = verticalThemes.find((theme) => theme.id === themeId);
  return fromId || verticalThemes[0];
}

export function themeToCssVars(theme: ThemeToken): CSSProperties {
  return {
    "--fp-primary": theme.primary,
    "--fp-secondary": theme.secondary,
    "--fp-bg": theme.bg,
    "--fp-surface": theme.surface,
    "--fp-text": theme.text,
    "--fp-muted": theme.muted,
    "--fp-card": theme.card,
    "--fp-border": theme.border,
    "--fp-dark": theme.dark,
  } as CSSProperties;
}
