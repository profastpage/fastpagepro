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

export type LinkHubTheme = "midnight" | "sunset" | "ocean";
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
  published: boolean;
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

export const LINK_HUB_THEME_STYLES: Record<
  LinkHubTheme,
  {
    label: string;
    background: string;
    surface: string;
    button: string;
    muted: string;
    accent: string;
  }
> = {
  midnight: {
    label: "Midnight",
    background: "from-zinc-950 via-black to-zinc-900",
    surface: "border-white/10 bg-white/[0.03]",
    button: "border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
    muted: "text-zinc-400",
    accent: "text-amber-300",
  },
  sunset: {
    label: "Sunset",
    background: "from-rose-950 via-fuchsia-950 to-orange-900",
    surface: "border-rose-200/20 bg-rose-100/10",
    button:
      "border-rose-200/30 bg-gradient-to-r from-rose-300/30 to-orange-200/30 text-rose-50 hover:brightness-110",
    muted: "text-rose-100/75",
    accent: "text-orange-200",
  },
  ocean: {
    label: "Ocean",
    background: "from-slate-950 via-cyan-950 to-sky-900",
    surface: "border-cyan-200/20 bg-cyan-100/10",
    button:
      "border-cyan-200/30 bg-gradient-to-r from-cyan-300/30 to-sky-200/30 text-cyan-50 hover:brightness-110",
    muted: "text-cyan-100/75",
    accent: "text-cyan-200",
  },
};

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

  return {
    userId: user.uid || "",
    slug: slugBase || "creator",
    displayName: fallbackName,
    bio: "",
    avatarUrl: user.photoURL || "",
    theme: "midnight",
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
  return snapshot.data() as LinkHubProfile;
}

export async function saveLinkHubProfileForUser(
  userId: string,
  profile: LinkHubProfile,
): Promise<void> {
  const profileRef = doc(db, LINK_HUB_COLLECTION, userId);
  await setDoc(profileRef, profile, { merge: true });
}

export async function isLinkHubSlugAvailable(
  slug: string,
  currentUserId: string,
): Promise<boolean> {
  const normalized = sanitizeSlug(slug);
  if (!normalized) return false;

  const slugQuery = query(
    collection(db, LINK_HUB_COLLECTION),
    where("slug", "==", normalized),
    limit(1),
  );
  const snapshot = await getDocs(slugQuery);
  if (snapshot.empty) return true;

  const first = snapshot.docs[0];
  return first.id === currentUserId;
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
