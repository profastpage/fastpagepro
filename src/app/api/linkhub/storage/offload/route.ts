import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { adminStorage } from "@/lib/firebaseAdmin";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const OffloadRequestSchema = z
  .object({
    profileId: z.string().trim().min(1).max(180),
    pathSegment: z.string().trim().min(1).max(240),
    source: z.string().trim().optional(),
    dataUrl: z.string().trim().optional(),
    sourceUrl: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.source && !value.dataUrl && !value.sourceUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes enviar source, dataUrl o sourceUrl",
      });
    }
  });

function parseDataUrlImage(dataUrl: string): { mimeType: string; buffer: Buffer } {
  const source = String(dataUrl || "").trim();
  const match = source.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    throw new Error("INVALID_IMAGE_DATA_URL");
  }
  const mimeType = String(match[1] || "").toLowerCase();
  const base64Data = String(match[2] || "");
  const buffer = Buffer.from(base64Data, "base64");
  if (!buffer.length) {
    throw new Error("INVALID_IMAGE_BINARY");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }
  return { mimeType, buffer };
}

function sanitizePathSegment(input: string): string {
  return String(input || "")
    .replace(/\.\./g, "-")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .slice(0, 160);
}

function sanitizeProfileId(input: string): string {
  return String(input || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 120);
}

function inferFileExtension(mimeType: string): string {
  const normalized = String(mimeType || "").toLowerCase();
  if (normalized === "image/png") return "png";
  if (normalized === "image/webp") return "webp";
  if (normalized === "image/gif") return "gif";
  if (normalized === "image/avif") return "avif";
  if (normalized === "image/svg+xml") return "svg";
  return "jpg";
}

async function fetchRemoteImageBuffer(sourceUrl: string): Promise<{ mimeType: string; buffer: Buffer }> {
  const response = await fetch(sourceUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`IMAGE_SOURCE_FETCH_FAILED:${response.status}`);
  }

  const mimeTypeHeader = String(response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (mimeTypeHeader && !mimeTypeHeader.startsWith("image/")) {
    throw new Error("INVALID_IMAGE_SOURCE_CONTENT_TYPE");
  }

  const raw = Buffer.from(await response.arrayBuffer());
  if (!raw.length) {
    throw new Error("INVALID_IMAGE_BINARY");
  }

  if (raw.length > MAX_IMAGE_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  return {
    mimeType: mimeTypeHeader || "image/jpeg",
    buffer: raw,
  };
}

async function optimizeForFallbackStorage(input: {
  buffer: Buffer;
  mimeType: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
  const mimeType = String(input.mimeType || "").toLowerCase();
  if (mimeType === "image/svg+xml" || mimeType === "image/gif") {
    return { buffer: input.buffer, mimeType };
  }

  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;
    const optimized = await sharp(input.buffer)
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    return {
      buffer: optimized,
      mimeType: "image/webp",
    };
  } catch {
    return {
      buffer: input.buffer,
      mimeType,
    };
  }
}

async function uploadImageToFirebaseStorageFallback(input: {
  source: string;
  folder: string;
  fileName: string;
}): Promise<{ url: string; bytes: number; mimeType: string; provider: "firebase-storage" }> {
  if (!adminStorage) {
    throw new Error("FIREBASE_STORAGE_FALLBACK_UNAVAILABLE");
  }

  let sourceBuffer: Buffer;
  let sourceMimeType: string;
  if (/^data:image\//i.test(input.source)) {
    const parsed = parseDataUrlImage(input.source);
    sourceBuffer = parsed.buffer;
    sourceMimeType = parsed.mimeType;
  } else {
    const parsed = await fetchRemoteImageBuffer(input.source);
    sourceBuffer = parsed.buffer;
    sourceMimeType = parsed.mimeType;
  }

  const optimized = await optimizeForFallbackStorage({
    buffer: sourceBuffer,
    mimeType: sourceMimeType,
  });

  const extension = inferFileExtension(optimized.mimeType);
  const objectPath = `${sanitizePathSegment(input.folder)}/${sanitizePathSegment(input.fileName)}.${extension}`;
  const token = randomUUID();

  const bucket = adminStorage.bucket();
  const file = bucket.file(objectPath);

  await file.save(optimized.buffer, {
    resumable: false,
    metadata: {
      contentType: optimized.mimeType,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const encodedPath = encodeURIComponent(objectPath);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;

  return {
    url,
    bytes: optimized.buffer.length,
    mimeType: optimized.mimeType,
    provider: "firebase-storage",
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);

    const rawBody = (await request.json().catch(() => ({}))) as unknown;
    const parsedBody = OffloadRequestSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || "Datos invalidos" },
        { status: 400 },
      );
    }

    const body = parsedBody.data;
    const profileId = sanitizeProfileId(body.profileId || "");
    const pathSegment = sanitizePathSegment(body.pathSegment || "");
    const source = String(body.source || body.dataUrl || body.sourceUrl || "").trim();

    if (!profileId || !pathSegment || !source) {
      return NextResponse.json(
        { error: "Faltan datos para subir la imagen" },
        { status: 400 },
      );
    }

    let mimeType = "image/jpeg";
    if (/^data:image\//i.test(source)) {
      const parsed = parseDataUrlImage(source);
      mimeType = parsed.mimeType;
    } else {
      try {
        const parsed = new URL(source);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          throw new Error("INVALID_IMAGE_SOURCE_URL");
        }
      } catch {
        throw new Error("INVALID_IMAGE_SOURCE_URL");
      }
    }

    const fileName = `img-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const folder = `fastpage/linkhub/${user.uid}/${profileId}/${pathSegment}`;

    try {
      const uploaded = await uploadImageToCloudinary({
        source,
        folder,
        publicId: fileName,
      });

      return NextResponse.json({
        success: true,
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
        provider: "cloudinary",
        mimeType,
        bytes: uploaded.bytes,
      });
    } catch (cloudinaryError: unknown) {
      const cloudinaryMessage = String((cloudinaryError as { message?: string })?.message || "");
      if (!cloudinaryMessage.startsWith("CLOUDINARY_")) {
        throw cloudinaryError;
      }

      console.warn("[LinkHub Storage Offload] Cloudinary upload failed, using Firebase Storage fallback", {
        reason: cloudinaryMessage,
      });

      const fallbackUploaded = await uploadImageToFirebaseStorageFallback({
        source,
        folder,
        fileName,
      });

      return NextResponse.json({
        success: true,
        url: fallbackUploaded.url,
        publicId: `${folder}/${fileName}`,
        provider: fallbackUploaded.provider,
        mimeType: fallbackUploaded.mimeType,
        bytes: fallbackUploaded.bytes,
        fallbackFrom: "cloudinary",
      });
    }
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.includes("INVALID_IMAGE_DATA_URL")) {
      return NextResponse.json(
        { error: "Formato de imagen no valido" },
        { status: 400 },
      );
    }
    if (message.includes("INVALID_IMAGE_BINARY")) {
      return NextResponse.json(
        { error: "No se pudo leer la imagen" },
        { status: 400 },
      );
    }
    if (message.includes("INVALID_IMAGE_SOURCE_URL")) {
      return NextResponse.json(
        { error: "URL de imagen no valida para migrar" },
        { status: 400 },
      );
    }
    if (message.includes("INVALID_IMAGE_SOURCE_CONTENT_TYPE")) {
      return NextResponse.json(
        { error: "La URL no apunta a una imagen valida" },
        { status: 400 },
      );
    }
    if (message.includes("IMAGE_TOO_LARGE")) {
      return NextResponse.json(
        { error: "Imagen demasiado pesada para subir" },
        { status: 413 },
      );
    }
    if (message.includes("FIREBASE_STORAGE_FALLBACK_UNAVAILABLE")) {
      return NextResponse.json(
        { error: "Cloudinary no esta configurado y Firebase Storage no esta disponible" },
        { status: 503 },
      );
    }
    if (message.includes("CLOUDINARY_NOT_CONFIGURED")) {
      return NextResponse.json(
        {
          error:
            "Cloudinary no configurado en el servidor. Configura CLOUDINARY_CLOUD_NAME y (CLOUDINARY_API_KEY+CLOUDINARY_API_SECRET o CLOUDINARY_UPLOAD_PRESET) en Vercel.",
        },
        { status: 503 },
      );
    }

    console.error("[LinkHub Storage Offload] Error:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
