import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const LINK_HUB_COLLECTION = "link_profiles";
export const MAX_LINK_HUB_LINKS = 12;

export const LINK_HUB_THEME_STYLES = {
  midnight: {
    label: "Midnight",
    primary: "#fbbf24",
    secondary: "#f97316",
    background: "from-zinc-950 via-black to-zinc-900",
    surface: "border-white/10 bg-white/[0.03]",
    button: "border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
    muted: "text-zinc-400",
    accent: "text-amber-300",
  },
  sunset: {
    label: "Sunset",
    primary: "#fb7185",
    secondary: "#fb923c",
    background: "from-rose-950 via-fuchsia-950 to-orange-900",
    surface: "border-rose-200/20 bg-rose-100/10",
    button:
      "border-rose-200/30 bg-gradient-to-r from-rose-300/30 to-orange-200/30 text-rose-50 hover:brightness-110",
    muted: "text-rose-100/75",
    accent: "text-orange-200",
  },
  ocean: {
    label: "Ocean",
    primary: "#22d3ee",
    secondary: "#3b82f6",
    background: "from-slate-950 via-cyan-950 to-sky-900",
    surface: "border-cyan-200/20 bg-cyan-100/10",
    button:
      "border-cyan-200/30 bg-gradient-to-r from-cyan-300/30 to-sky-200/30 text-cyan-50 hover:brightness-110",
    muted: "text-cyan-100/75",
    accent: "text-cyan-200",
  },
  aurora: {
    label: "Aurora",
    primary: "#34d399",
    secondary: "#60a5fa",
    background: "from-emerald-950 via-slate-950 to-sky-900",
    surface: "border-emerald-200/20 bg-emerald-100/10",
    button:
      "border-emerald-200/30 bg-gradient-to-r from-emerald-300/30 to-sky-300/30 text-emerald-50 hover:brightness-110",
    muted: "text-emerald-100/75",
    accent: "text-emerald-200",
  },
  neon: {
    label: "Neon Pulse",
    primary: "#22c55e",
    secondary: "#eab308",
    background: "from-zinc-950 via-zinc-900 to-black",
    surface: "border-lime-200/20 bg-lime-100/10",
    button:
      "border-lime-200/30 bg-gradient-to-r from-lime-300/30 to-yellow-300/30 text-lime-50 hover:brightness-110",
    muted: "text-lime-100/75",
    accent: "text-yellow-200",
  },
  graphite: {
    label: "Graphite",
    primary: "#94a3b8",
    secondary: "#64748b",
    background: "from-zinc-900 via-zinc-950 to-black",
    surface: "border-slate-200/20 bg-slate-100/10",
    button:
      "border-slate-200/30 bg-gradient-to-r from-slate-300/30 to-slate-500/25 text-slate-50 hover:brightness-110",
    muted: "text-slate-200/70",
    accent: "text-slate-100",
  },
  ruby: {
    label: "Ruby Flame",
    primary: "#ef4444",
    secondary: "#e11d48",
    background: "from-rose-950 via-red-950 to-zinc-950",
    surface: "border-red-200/20 bg-red-100/10",
    button:
      "border-red-200/30 bg-gradient-to-r from-red-300/30 to-rose-300/30 text-red-50 hover:brightness-110",
    muted: "text-red-100/75",
    accent: "text-rose-200",
  },
  jade: {
    label: "Jade Luxe",
    primary: "#10b981",
    secondary: "#14b8a6",
    background: "from-emerald-950 via-teal-950 to-slate-950",
    surface: "border-teal-200/20 bg-teal-100/10",
    button:
      "border-teal-200/30 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 text-teal-50 hover:brightness-110",
    muted: "text-teal-100/75",
    accent: "text-emerald-200",
  },
  coral: {
    label: "Coral Pop",
    primary: "#fb7185",
    secondary: "#fb923c",
    background: "from-rose-950 via-orange-950 to-zinc-950",
    surface: "border-orange-200/20 bg-orange-100/10",
    button:
      "border-orange-200/30 bg-gradient-to-r from-rose-300/30 to-orange-300/30 text-orange-50 hover:brightness-110",
    muted: "text-orange-100/75",
    accent: "text-rose-200",
  },
  violet: {
    label: "Violet Nova",
    primary: "#8b5cf6",
    secondary: "#d946ef",
    background: "from-violet-950 via-purple-950 to-fuchsia-950",
    surface: "border-violet-200/20 bg-violet-100/10",
    button:
      "border-violet-200/30 bg-gradient-to-r from-violet-300/30 to-fuchsia-300/30 text-violet-50 hover:brightness-110",
    muted: "text-violet-100/75",
    accent: "text-fuchsia-200",
  },
  cobalt: {
    label: "Cobalt Pro",
    primary: "#3b82f6",
    secondary: "#2563eb",
    background: "from-blue-950 via-indigo-950 to-slate-950",
    surface: "border-blue-200/20 bg-blue-100/10",
    button:
      "border-blue-200/30 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 text-blue-50 hover:brightness-110",
    muted: "text-blue-100/75",
    accent: "text-indigo-200",
  },
  sandstorm: {
    label: "Sandstorm",
    primary: "#f59e0b",
    secondary: "#d97706",
    background: "from-amber-950 via-orange-950 to-zinc-950",
    surface: "border-amber-200/20 bg-amber-100/10",
    button:
      "border-amber-200/30 bg-gradient-to-r from-amber-300/30 to-orange-300/30 text-amber-50 hover:brightness-110",
    muted: "text-amber-100/75",
    accent: "text-orange-200",
  },
  obsidian: {
    label: "Obsidian",
    primary: "#a855f7",
    secondary: "#06b6d4",
    background: "from-zinc-950 via-violet-950 to-cyan-950",
    surface: "border-violet-200/20 bg-violet-100/10",
    button:
      "border-violet-200/30 bg-gradient-to-r from-violet-300/30 to-cyan-300/30 text-violet-50 hover:brightness-110",
    muted: "text-violet-100/75",
    accent: "text-cyan-200",
  },
  rgb: {
    label: "RGB Custom",
    primary: "#ff0055",
    secondary: "#00d4ff",
    background: "from-zinc-950 via-black to-zinc-900",
    surface: "border-fuchsia-200/20 bg-fuchsia-100/10",
    button:
      "border-fuchsia-200/30 bg-gradient-to-r from-fuchsia-300/30 to-cyan-300/30 text-fuchsia-50 hover:brightness-110",
    muted: "text-zinc-100/75",
    accent: "text-fuchsia-200",
  },
} as const;

export type LinkHubTheme = keyof typeof LINK_HUB_THEME_STYLES;
export type LinkHubLinkType =
  | "website"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "x";

export interface LinkHubLink {
  id: string;
  title: string;
  url: string;
  type: LinkHubLinkType;
}

export interface LinkHubProfile {
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: LinkHubTheme;
  themePrimaryColor?: string;
  themeSecondaryColor?: string;
  published: boolean;
  publishedAt?: number;
  links: LinkHubLink[];
  createdAt: number;
  updatedAt: number;
}

export interface LinkHubUserSeed {
  uid?: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

function normalizeHexToLong(hex: string): string {
  if (hex.length !== 4) return hex;
  const [_, r, g, b] = hex;
  return `#${r}${r}${g}${g}${b}${b}`;
}

export function getSafeLinkHubTheme(theme?: string): LinkHubTheme {
  if (!theme) return "midnight";
  if (theme in LINK_HUB_THEME_STYLES) return theme as LinkHubTheme;
  return "midnight";
}

export function normalizeHexColor(input: string | undefined, fallback: string): string {
  const source = String(input || "").trim();
  if (!HEX_COLOR_PATTERN.test(source)) return fallback;
  return normalizeHexToLong(source.toLowerCase());
}

export function hexToRgba(input: string, alpha: number): string {
  const safe = normalizeHexColor(input, "#000000").replace("#", "");
  const value = safe.length === 3 ? safe.split("").map((part) => part + part).join("") : safe;
  const parsed = Number.parseInt(value, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(alpha, 1))})`;
}

export function getLinkHubThemeColors(
  theme: LinkHubTheme,
  primaryColor?: string,
  secondaryColor?: string,
): { primary: string; secondary: string } {
  const preset = LINK_HUB_THEME_STYLES[theme] || LINK_HUB_THEME_STYLES.midnight;
  return {
    primary: normalizeHexColor(primaryColor, preset.primary),
    secondary: normalizeHexColor(secondaryColor, preset.secondary),
  };
}

function safeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function normalizeLinkUrl(rawUrl: string): string {
  const value = safeText(rawUrl);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildDefaultLinkHubProfile(user: LinkHubUserSeed): LinkHubProfile {
  const now = Date.now();
  const fallbackName = safeText(user.name || "") || "Creator";
  const emailPrefix = safeText((user.email || "").split("@")[0] || "");
  const slugBase = sanitizeSlug(fallbackName || emailPrefix || "creator");
  const baseTheme = LINK_HUB_THEME_STYLES.midnight;

  return {
    userId: user.uid || "",
    slug: slugBase || "creator",
    displayName: fallbackName,
    bio: "",
    avatarUrl: user.photoURL || "",
    theme: "midnight",
    themePrimaryColor: baseTheme.primary,
    themeSecondaryColor: baseTheme.secondary,
    published: false,
    links: [
      {
        id: crypto.randomUUID(),
        title: "Website",
        url: "",
        type: "website",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export async function getLinkHubProfileByUserId(userId: string): Promise<LinkHubProfile | null> {
  const profileRef = doc(db, LINK_HUB_COLLECTION, userId);
  const snapshot = await getDoc(profileRef);
  if (!snapshot.exists()) {
    return null;
  }
  return {
    ...(snapshot.data() as LinkHubProfile),
    userId,
  };
}

export async function saveLinkHubProfileForUser(
  userId: string,
  profile: LinkHubProfile,
): Promise<void> {
  const profileRef = doc(db, LINK_HUB_COLLECTION, userId);
  await setDoc(
    profileRef,
    {
      ...profile,
      userId,
    },
    { merge: true },
  );
}

export async function isLinkHubSlugAvailable(
  slug: string,
  currentUserId: string,
): Promise<boolean> {
  const normalized = sanitizeSlug(slug);
  if (!normalized) return false;

  try {
    const slugQuery = query(
      collection(db, LINK_HUB_COLLECTION),
      where("slug", "==", normalized),
      limit(1),
    );
    const snapshot = await getDocs(slugQuery);
    if (snapshot.empty) return true;

    const first = snapshot.docs[0];
    return first.id === currentUserId;
  } catch (error: any) {
    const code = String(error?.code || "");
    if (code.includes("permission-denied")) {
      // Keep publish flow usable if security rules disallow global slug scans.
      return true;
    }
    throw error;
  }
}

export async function getPublishedLinkHubProfileBySlug(
  slug: string,
): Promise<LinkHubProfile | null> {
  const normalized = sanitizeSlug(slug);
  if (!normalized) return null;

  const profileQuery = query(
    collection(db, LINK_HUB_COLLECTION),
    where("slug", "==", normalized),
    where("published", "==", true),
    limit(1),
  );
  const snapshot = await getDocs(profileQuery);
  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as LinkHubProfile;
}
