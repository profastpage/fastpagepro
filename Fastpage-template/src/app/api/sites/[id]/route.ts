import { NextRequest, NextResponse } from "next/server";
import { sitesStorage } from "@/lib/sitesStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const site = await sitesStorage.get(id);

    if (!site) {
      return NextResponse.json({ error: "El sitio solicitado no existe." }, { status: 404 });
    }

    return new Response(site.html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("[Sites GET API] Error:", error);
    return NextResponse.json({ error: error.message || "Error al recuperar el sitio." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { html } = body;

    if (!html) {
      return NextResponse.json({ error: "El contenido HTML es requerido." }, { status: 400 });
    }

    const success = await sitesStorage.update(id, html);
    if (!success) {
      return NextResponse.json({ error: "No se pudo actualizar: el sitio no existe." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Sitio actualizado correctamente." });
  } catch (error: any) {
    console.error("[Sites PUT API] Error:", error);
    return NextResponse.json({ error: error.message || "Error al actualizar el sitio." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await sitesStorage.publish(id);
    if (!success) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to publish site" }, { status: 500 });
  }
}
