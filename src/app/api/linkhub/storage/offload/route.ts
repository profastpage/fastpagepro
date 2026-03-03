import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function resolveStorageBucketNames(): string[] {
  const names = new Set<string>();
  const fromEnv = String(
    process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "",
  ).trim();
  if (fromEnv) names.add(fromEnv);
  const projectId = String(
    process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      "fastpage-7ceb3",
  ).trim();
  names.add(`${projectId}.firebasestorage.app`);
  names.add(`${projectId}.appspot.com`);
  return Array.from(names).filter(Boolean);
}

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

function mimeToExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "jpg";
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

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    if (!adminStorage) {
      throw new Error("SERVICE_UNAVAILABLE: firebase storage admin unavailable");
    }

    const body = (await request.json().catch(() => ({}))) as {
      profileId?: string;
      pathSegment?: string;
      dataUrl?: string;
    };

    const profileId = sanitizeProfileId(body.profileId || "");
    const pathSegment = sanitizePathSegment(body.pathSegment || "");
    const dataUrl = String(body.dataUrl || "").trim();

    if (!profileId || !pathSegment || !dataUrl) {
      return NextResponse.json(
        { error: "Faltan datos para subir la imagen" },
        { status: 400 },
      );
    }

    const { mimeType, buffer } = parseDataUrlImage(dataUrl);
    const extension = mimeToExtension(mimeType);
    const downloadToken = randomUUID();
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const objectPath = `linkhub-images/${user.uid}/${profileId}/${pathSegment}/${fileName}`;
    const bucketCandidates = resolveStorageBucketNames();
    let uploadedBucketName = "";
    let lastUploadError: unknown = null;
    for (const bucketName of bucketCandidates) {
      try {
        const bucket = adminStorage.bucket(bucketName);
        const file = bucket.file(objectPath);
        await file.save(buffer, {
          resumable: false,
          metadata: {
            contentType: mimeType,
            cacheControl: "public,max-age=31536000,immutable",
            metadata: {
              firebaseStorageDownloadTokens: downloadToken,
            },
          },
        });
        uploadedBucketName = bucket.name;
        break;
      } catch (uploadError) {
        lastUploadError = uploadError;
      }
    }

    if (!uploadedBucketName) {
      throw lastUploadError || new Error("STORAGE_UPLOAD_FAILED");
    }

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
      uploadedBucketName,
    )}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: objectPath,
      bucket: uploadedBucketName,
    });
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
    if (message.includes("IMAGE_TOO_LARGE")) {
      return NextResponse.json(
        { error: "Imagen demasiado pesada para subir" },
        { status: 413 },
      );
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json(
        { error: "Servicio de almacenamiento no disponible" },
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
