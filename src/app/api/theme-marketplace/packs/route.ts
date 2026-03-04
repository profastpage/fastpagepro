import { NextRequest, NextResponse } from "next/server";
import { buildThemeMarketplaceUseCases } from "@/context/themeMarketplace/buildThemeMarketplaceUseCases";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";

export const runtime = "nodejs";

const themeMarketplaceUseCases = buildThemeMarketplaceUseCases();

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request);
    const catalog = await themeMarketplaceUseCases.getCatalog.execute({ userId: user.uid });
    return NextResponse.json({ success: true, ...catalog });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Marketplace no disponible" }, { status: 503 });
    }
    console.error("[Theme Marketplace Packs] Error:", error);
    return NextResponse.json({ error: "No se pudo cargar marketplace" }, { status: 500 });
  }
}
