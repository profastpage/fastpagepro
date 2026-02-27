import { NextRequest, NextResponse } from "next/server";
import { requireFirebaseUser } from "@/lib/server/requireFirebaseUser";
import { assertSuperAdmin } from "@/lib/server/requireSuperAdmin";
import {
  createDemoAccount,
  deleteDemoAccount,
  deleteExpiredDemos,
  listDemoAccounts,
  resetDemoToFirstTime,
  updateDemoSettings,
} from "@/lib/server/demoAccounts/service";
import { DemoTemplate } from "@/lib/server/demoAccounts/seeds";
import { DemoResetMode } from "@/lib/server/demoAccounts/service";

type ActionName =
  | "createDemoAccount"
  | "resetDemoToFirstTime"
  | "updateDemoSettings"
  | "deleteDemoAccount"
  | "deleteExpiredDemos";

interface ActionBody {
  action?: ActionName;
  uid?: string;
  demoGroupId?: string;
  template?: DemoTemplate;
  resetMode?: DemoResetMode;
  expiresAt?: string | number | null;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireFirebaseUser(request);
    assertSuperAdmin(adminUser);
    const demos = await listDemoAccounts();
    return NextResponse.json({ demos });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    console.error("[Admin Demos] List error:", error);
    return NextResponse.json({ error: "No se pudo listar demos." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireFirebaseUser(request);
    assertSuperAdmin(adminUser);

    const body = (await request.json()) as ActionBody;
    const action = String(body?.action || "").trim() as ActionName;

    if (action === "createDemoAccount") {
      const created = await createDemoAccount({
        template: (body.template || "restaurant") as DemoTemplate,
        resetMode: body.resetMode || "manual",
        expiresAt: Object.prototype.hasOwnProperty.call(body, "expiresAt") ? body.expiresAt : null,
      });
      return NextResponse.json(created);
    }

    if (action === "resetDemoToFirstTime") {
      const result = await resetDemoToFirstTime({
        uid: body.uid,
        demoGroupId: body.demoGroupId,
        template: body.template,
        resetMode: body.resetMode,
        ...(Object.prototype.hasOwnProperty.call(body, "expiresAt") ? { expiresAt: body.expiresAt } : {}),
      });
      return NextResponse.json(result);
    }

    if (action === "updateDemoSettings") {
      const uid = String(body.uid || "").trim();
      if (!uid) {
        return NextResponse.json({ error: "uid requerido" }, { status: 400 });
      }
      const result = await updateDemoSettings({
        uid,
        template: body.template,
        resetMode: body.resetMode,
        ...(Object.prototype.hasOwnProperty.call(body, "expiresAt") ? { expiresAt: body.expiresAt } : {}),
      });
      return NextResponse.json(result);
    }

    if (action === "deleteDemoAccount") {
      const uid = String(body.uid || "").trim();
      if (!uid) {
        return NextResponse.json({ error: "uid requerido" }, { status: 400 });
      }
      const result = await deleteDemoAccount({ uid });
      return NextResponse.json(result);
    }

    if (action === "deleteExpiredDemos") {
      const result = await deleteExpiredDemos();
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Accion no valida." }, { status: 400 });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (message.startsWith("FORBIDDEN")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
    if (message.startsWith("NOT_FOUND")) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    if (message.startsWith("INVALID_ARGUMENT")) {
      return NextResponse.json({ error: message.replace("INVALID_ARGUMENT:", "").trim() }, { status: 400 });
    }
    if (message.startsWith("SERVICE_UNAVAILABLE")) {
      return NextResponse.json({ error: "Servicio de autenticacion no disponible" }, { status: 503 });
    }
    console.error("[Admin Demos] Action error:", error);
    return NextResponse.json({ error: "No se pudo ejecutar la accion de demo." }, { status: 500 });
  }
}
