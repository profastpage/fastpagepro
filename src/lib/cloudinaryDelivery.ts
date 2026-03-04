type CloudinaryTransformOptions = {
  width?: number | "auto";
  height?: number;
  quality?: string;
  crop?: string;
};

function isTransformationSegment(segment: string): boolean {
  const value = String(segment || "").trim();
  if (!value) return false;
  if (value.includes(",")) return true;
  return /^[a-z]{1,3}_.+/i.test(value);
}

function getTransformKey(token: string): string {
  const trimmed = String(token || "").trim();
  if (!trimmed) return "";
  const underscoreIndex = trimmed.indexOf("_");
  if (underscoreIndex <= 0) return trimmed.toLowerCase();
  return trimmed.slice(0, underscoreIndex).toLowerCase();
}

function mergeTransforms(baseTokens: string[], existingTokens: string[]): string[] {
  const tokenByKey = new Map<string, string>();
  for (const token of existingTokens) {
    const key = getTransformKey(token);
    if (!key) continue;
    tokenByKey.set(key, token);
  }
  for (const token of baseTokens) {
    const key = getTransformKey(token);
    if (!key || tokenByKey.has(key)) continue;
    tokenByKey.set(key, token);
  }
  return Array.from(tokenByKey.values());
}

function normalizeWidthToken(width: number | "auto" | undefined): string {
  if (width === "auto" || width == null) return "w_auto";
  const safeWidth = Math.max(1, Math.min(8192, Math.round(Number(width) || 0)));
  return safeWidth > 0 ? `w_${safeWidth}` : "w_auto";
}

export function isCloudinaryDeliveryUrl(value: string): boolean {
  const source = String(value || "").trim();
  if (!source) return false;
  try {
    const parsed = new URL(source);
    return parsed.hostname === "res.cloudinary.com" || parsed.hostname.endsWith(".res.cloudinary.com");
  } catch {
    return false;
  }
}

export function optimizeCloudinaryDeliveryUrl(
  sourceUrl: string,
  options?: CloudinaryTransformOptions,
): string {
  const source = String(sourceUrl || "").trim();
  if (!isCloudinaryDeliveryUrl(source)) return source;

  try {
    const parsed = new URL(source);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = pathParts.findIndex((segment, index) => segment === "upload" && pathParts[index - 1] === "image");
    if (uploadIndex < 0) return source;

    const defaultTransforms = [
      "f_auto",
      `q_${String(options?.quality || "auto").trim() || "auto"}`,
      "dpr_auto",
      `c_${String(options?.crop || "limit").trim() || "limit"}`,
      normalizeWidthToken(options?.width),
    ];
    if (Number.isFinite(Number(options?.height)) && Number(options?.height) > 0) {
      defaultTransforms.push(`h_${Math.max(1, Math.min(8192, Math.round(Number(options?.height))))}`);
    }

    const firstAfterUpload = pathParts[uploadIndex + 1] || "";
    const startsWithVersion = /^v\d+$/i.test(firstAfterUpload);
    if (!firstAfterUpload || startsWithVersion) {
      pathParts.splice(uploadIndex + 1, 0, defaultTransforms.join(","));
    } else if (isTransformationSegment(firstAfterUpload)) {
      const existingTokens = firstAfterUpload
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean);
      const mergedTokens = mergeTransforms(defaultTransforms, existingTokens);
      pathParts[uploadIndex + 1] = mergedTokens.join(",");
    } else {
      pathParts.splice(uploadIndex + 1, 0, defaultTransforms.join(","));
    }

    parsed.pathname = `/${pathParts.join("/")}`;
    return parsed.toString();
  } catch {
    return source;
  }
}
