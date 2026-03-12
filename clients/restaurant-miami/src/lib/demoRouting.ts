export type DemoType = "restaurant" | "store" | "services";

export function getDemoUrl(type: DemoType, slug?: string): string {
  const safeSlug = String(slug || "").trim().toLowerCase();
  if (!safeSlug) return "/demo";

  switch (type) {
    case "restaurant":
      return `/demo/restaurant/${safeSlug}`;
    case "store":
      return `/demo/store/${safeSlug}`;
    case "services":
      return `/demo/services/${safeSlug}`;
    default:
      return "/demo";
  }
}

