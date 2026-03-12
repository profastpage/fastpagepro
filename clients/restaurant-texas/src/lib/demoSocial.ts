import type { DemoSocialLink, DemoSocialPlatform, DemoVertical } from "@/lib/demoTypes";

type DemoSocialSource = {
  vertical: DemoVertical;
  slug: string;
  title: string;
  whatsappNumber?: string;
  socialLinks?: DemoSocialLink[];
};

const DEMO_SOCIAL_PLATFORM_ORDER: DemoSocialPlatform[] = [
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "website",
  "whatsapp",
];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function sanitizeHandle(input: string): string {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 28) || "fastpage";
}

function toWhatsappUrl(value?: string): string {
  const digits = String(value || "").replace(/\D+/g, "");
  return digits ? `https://api.whatsapp.com/send?phone=${digits}` : "";
}

function normalizeProvidedSocialLinks(
  socialLinks: DemoSocialLink[] | undefined,
): DemoSocialLink[] {
  if (!Array.isArray(socialLinks) || socialLinks.length === 0) return [];
  const seen = new Set<DemoSocialPlatform>();
  const normalized: DemoSocialLink[] = [];

  for (const rawLink of socialLinks) {
    const platform = rawLink?.platform;
    const url = String(rawLink?.url || "").trim();
    if (!platform || seen.has(platform) || !isValidUrl(url)) continue;
    seen.add(platform);
    normalized.push({
      platform,
      url,
      label: String(rawLink?.label || "").trim() || undefined,
    });
  }

  return normalized.sort(
    (a, b) =>
      DEMO_SOCIAL_PLATFORM_ORDER.indexOf(a.platform) -
      DEMO_SOCIAL_PLATFORM_ORDER.indexOf(b.platform),
  );
}

export function getDemoSocialLinks(source: DemoSocialSource): DemoSocialLink[] {
  const provided = normalizeProvidedSocialLinks(source.socialLinks);
  if (provided.length > 0) return provided;

  const handle = sanitizeHandle(source.title || source.slug);
  const fallback = [
    { platform: "instagram" as const, url: `https://instagram.com/${handle}` },
    { platform: "facebook" as const, url: `https://facebook.com/${handle}` },
    { platform: "tiktok" as const, url: `https://tiktok.com/@${handle}` },
    { platform: "youtube" as const, url: `https://youtube.com/@${handle}` },
    {
      platform: "website" as const,
      url: `https://www.fastpagepro.com/demo/${source.vertical}/${source.slug}`,
    },
    { platform: "whatsapp" as const, url: toWhatsappUrl(source.whatsappNumber) },
  ];

  return fallback.filter((item) => isValidUrl(item.url));
}
