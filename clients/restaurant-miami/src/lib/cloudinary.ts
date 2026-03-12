import { createHash } from "crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
};

function parseCloudinaryUrl(raw: string): Partial<CloudinaryConfig> {
  const value = String(raw || "").trim();
  if (!value) return {};
  const match = value.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/i);
  if (!match) return {};
  return {
    apiKey: decodeURIComponent(match[1] || "").trim(),
    apiSecret: decodeURIComponent(match[2] || "").trim(),
    cloudName: decodeURIComponent(match[3] || "").trim(),
  };
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL || "");
  const cloudName = String(
    process.env.CLOUDINARY_CLOUD_NAME || fromUrl.cloudName || "",
  ).trim();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || fromUrl.apiKey || "").trim();
  const apiSecret = String(
    process.env.CLOUDINARY_API_SECRET || fromUrl.apiSecret || "",
  ).trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function sanitizeFolderSegment(input: string): string {
  return String(input || "")
    .replace(/\.\./g, "-")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .slice(0, 180);
}

function sanitizePublicId(input: string): string {
  return String(input || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function buildSignature(
  params: Record<string, string | number | boolean | undefined>,
  apiSecret: string,
): string {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => [key, String(value)] as const)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export function isCloudinaryAssetUrl(value: string): boolean {
  const source = String(value || "").trim();
  if (!source) return false;
  try {
    const parsed = new URL(source);
    return (
      parsed.hostname === "res.cloudinary.com" ||
      parsed.hostname.endsWith(".res.cloudinary.com")
    );
  } catch {
    return false;
  }
}

export async function uploadImageToCloudinary(input: {
  source: string;
  folder: string;
  publicId: string;
}): Promise<CloudinaryUploadResult> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  const source = String(input.source || "").trim();
  const folder = sanitizeFolderSegment(input.folder);
  const publicId = sanitizePublicId(input.publicId) || `img-${Date.now()}`;
  if (!source || !folder) {
    throw new Error("CLOUDINARY_INVALID_UPLOAD_INPUT");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = buildSignature(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    config.apiSecret,
  );

  const formData = new FormData();
  formData.append("file", source);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("overwrite", "false");

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    secure_url?: string;
    public_id?: string;
    bytes?: number;
    format?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  };

  if (!response.ok) {
    const message = String(payload?.error?.message || "upload_failed");
    throw new Error(`CLOUDINARY_UPLOAD_FAILED:${response.status}:${message}`);
  }

  const secureUrl = String(payload?.secure_url || "").trim();
  const uploadedPublicId = String(payload?.public_id || publicId).trim();
  if (!secureUrl) {
    throw new Error("CLOUDINARY_UPLOAD_MISSING_URL");
  }

  return {
    secureUrl,
    publicId: uploadedPublicId,
    bytes: Math.max(0, Number(payload?.bytes || 0)),
    format: String(payload?.format || "").trim() || "jpg",
    width: Number.isFinite(Number(payload?.width)) ? Number(payload?.width) : undefined,
    height: Number.isFinite(Number(payload?.height)) ? Number(payload?.height) : undefined,
  };
}
