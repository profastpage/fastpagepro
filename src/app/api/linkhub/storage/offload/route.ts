import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

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

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);

    const body = (await request.json().catch(() => ({}))) as {
      profileId?: string;
      pathSegment?: string;
      source?: string;
      dataUrl?: string;
      sourceUrl?: string;
    };

    const profileId = sanitizeProfileId(body.profileId || "");
    const pathSegment = sanitizePathSegment(body.pathSegment || "");
    const source = String(body.source || body.dataUrl || body.sourceUrl || "").trim();

    if (!profileId || !pathSegment || !source) {
      return NextResponse.json(
        { error: "Faltan datos para subir la imagen" },
        { status: 400 },
      );
    }

    let normalizedSource = source;
    let mimeType = "image/jpeg";

    if (/^data:image\//i.test(source)) {
      const parsed = parseDataUrlImage(source);
      mimeType = parsed.mimeType;
      normalizedSource = source;
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
    const uploaded = await uploadImageToCloudinary({
      source: normalizedSource,
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
    if (message.includes("IMAGE_TOO_LARGE")) {
      return NextResponse.json(
        { error: "Imagen demasiado pesada para subir" },
        { status: 413 },
      );
    }
    if (message.includes("CLOUDINARY_NOT_CONFIGURED")) {
      return NextResponse.json(
        { error: "Cloudinary no configurado en el servidor" },
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
