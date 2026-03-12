"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, RefreshCw, Trash2, RotateCcw, Save, ShieldAlert } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { isRootAdminEmail, ROOT_ADMIN_EMAIL } from "@/lib/adminAccess";

type DemoTemplate = "restaurant" | "store" | "services";
type DemoResetMode = "manual" | "on_login";

type DemoRow = {
  uid: string;
  email: string;
  template: DemoTemplate;
  demoGroupId: string;
  createdAt: number;
  expiresAt: number | null;
  resetMode: DemoResetMode;
  status: "active" | "deleted";
};

type CreatedCredentials = {
  uid: string;
  email: string;
  password: string;
  demoGroupId: string;
  expiresAt: number | null;
};

function toDateTimeLocal(value: number | null) {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function parseDateTimeLocal(value: string): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
}

function TemplateSelect(props: {
  value: DemoTemplate;
  onChange: (value: DemoTemplate) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as DemoTemplate)}
      disabled={props.disabled}
      className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-zinc-100 disabled:opacity-60"
    >
      <option value="restaurant">restaurant</option>
      <option value="store">store</option>
      <option value="services">services</option>
    </select>
  );
}

function ResetModeSelect(props: {
  value: DemoResetMode;
  onChange: (value: DemoResetMode) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as DemoResetMode)}
      disabled={props.disabled}
      className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-zinc-100 disabled:opacity-60"
    >
      <option value="manual">manual</option>
      <option value="on_login">on_login</option>
    </select>
  );
}

export default function AdminDemosPage() {
  const { user, loading, logout } = useAuth(true);
  const router = useRouter();
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [createTemplate, setCreateTemplate] = useState<DemoTemplate>("restaurant");
  const [createResetMode, setCreateResetMode] = useState<DemoResetMode>("manual");
  const [createIndefinite, setCreateIndefinite] = useState(true);
  const [createExpiresAtInput, setCreateExpiresAtInput] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [rowDrafts, setRowDrafts] = useState<Record<string, { template: DemoTemplate; resetMode: DemoResetMode; indefinite: boolean; expiresAtInput: string }>>({});

  useEffect(() => {
    if (loading) return;
    if (!user || !isRootAdminEmail(user.email)) {
      router.replace("/hub");
    }
  }, [loading, router, user]);

  const fetchDemos = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setBusy(true);
    setError("");
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch("/api/admin/demos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error || "No se pudo listar demos."));
      }
      const demos = Array.isArray(payload?.demos) ? payload.demos : [];
      setRows(demos);
      setRowDrafts((previous) => {
        const next = { ...previous };
        demos.forEach((demo: DemoRow) => {
          if (!next[demo.uid]) {
            next[demo.uid] = {
              template: demo.template,
              resetMode: demo.resetMode,
              indefinite: demo.expiresAt == null,
              expiresAtInput: toDateTimeLocal(demo.expiresAt),
            };
          }
        });
        return next;
      });
    } catch (fetchError: any) {
      setError(String(fetchError?.message || "No se pudo cargar demos."));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user || !isRootAdminEmail(user.email)) return;
    void fetchDemos();
  }, [fetchDemos, loading, user]);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [rows],
  );

  async function runAction(actionBody: Record<string, unknown>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Sesion no valida.");
    const token = await currentUser.getIdToken(true);
    const response = await fetch("/api/admin/demos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(actionBody),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(String(payload?.error || "No se pudo ejecutar la accion."));
    }
    return payload;
  }

  async function onCreateDemo(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const expiresAt = createIndefinite ? null : parseDateTimeLocal(createExpiresAtInput);
      const payload = await runAction({
        action: "createDemoAccount",
        template: createTemplate,
        resetMode: createResetMode,
        expiresAt,
      });
      setCreatedCredentials({
        uid: String(payload.uid || ""),
        email: String(payload.email || ""),
        password: String(payload.password || ""),
        demoGroupId: String(payload.demoGroupId || ""),
        expiresAt: payload.expiresAt == null ? null : Number(payload.expiresAt),
      });
      setFeedback("Demo creada correctamente.");
      setCreateExpiresAtInput("");
      setCreateIndefinite(true);
      await fetchDemos();
    } catch (createError: any) {
      setError(String(createError?.message || "No se pudo crear la demo."));
    } finally {
      setBusy(false);
    }
  }

  async function onResetFirstTime(uid: string) {
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const payload = await runAction({
        action: "resetDemoToFirstTime",
        uid,
      });
      setFeedback(`Demo reiniciada. demoVersion=${payload.demoVersion}`);
      await fetchDemos();
    } catch (resetError: any) {
      setError(String(resetError?.message || "No se pudo reiniciar demo."));
    } finally {
      setBusy(false);
    }
  }

  async function onUpdateSettings(uid: string) {
    const draft = rowDrafts[uid];
    if (!draft) return;
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const expiresAt = draft.indefinite ? null : parseDateTimeLocal(draft.expiresAtInput);
      await runAction({
        action: "updateDemoSettings",
        uid,
        template: draft.template,
        resetMode: draft.resetMode,
        expiresAt,
      });
      setFeedback("Settings de demo actualizados.");
      await fetchDemos();
    } catch (updateError: any) {
      setError(String(updateError?.message || "No se pudo actualizar settings de demo."));
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteDemo(uid: string) {
    if (!window.confirm("Eliminar demo account? Esta accion borra datos demo y elimina Auth user.")) return;
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      await runAction({
        action: "deleteDemoAccount",
        uid,
      });
      setFeedback("Demo eliminada.");
      await fetchDemos();
    } catch (deleteError: any) {
      setError(String(deleteError?.message || "No se pudo eliminar demo."));
    } finally {
      setBusy(false);
    }
  }

  const copyText = async (value: string) => {
    const text = String(value || "").trim();
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-7 w-7 animate-spin text-amber-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-2">
              <ShieldAlert className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Super Admin</p>
              <h1 className="text-lg font-black">Demo Accounts</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200"
            >
              Volver a panel
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-red-400/35 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-8">
        <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold">Crear demo account</h2>
              <p className="text-xs text-zinc-400">La clave se muestra una sola vez y no se almacena en Firestore.</p>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
              {ROOT_ADMIN_EMAIL}
            </span>
          </div>
          <form onSubmit={onCreateDemo} className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <TemplateSelect value={createTemplate} onChange={setCreateTemplate} disabled={busy} />
            <ResetModeSelect value={createResetMode} onChange={setCreateResetMode} disabled={busy} />
            <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={createIndefinite}
                onChange={(event) => setCreateIndefinite(event.target.checked)}
                disabled={busy}
              />
              Indefinido
            </label>
            <input
              type="datetime-local"
              value={createExpiresAtInput}
              disabled={busy || createIndefinite}
              onChange={(event) => setCreateExpiresAtInput(event.target.value)}
              className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-zinc-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-200 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Crear demo
            </button>
          </form>
        </section>

        {feedback ? (
          <p className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{feedback}</p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-red-300/35 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p>
        ) : null}

        <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 md:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold">Demo accounts</h2>
            <button
              type="button"
              onClick={() => void fetchDemos()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              Refrescar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="px-2 py-2">Cuenta</th>
                  <th className="px-2 py-2">Template</th>
                  <th className="px-2 py-2">ResetMode</th>
                  <th className="px-2 py-2">Expiry</th>
                  <th className="px-2 py-2">Estado</th>
                  <th className="px-2 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => {
                  const draft = rowDrafts[row.uid] || {
                    template: row.template,
                    resetMode: row.resetMode,
                    indefinite: row.expiresAt == null,
                    expiresAtInput: toDateTimeLocal(row.expiresAt),
                  };
                  return (
                    <tr key={row.uid} className="border-b border-white/5 align-top">
                      <td className="px-2 py-3">
                        <p className="font-semibold text-white">{row.email}</p>
                        <p className="text-xs text-zinc-500">{row.uid}</p>
                        <p className="text-xs text-zinc-500">{row.demoGroupId}</p>
                      </td>
                      <td className="px-2 py-3">
                        <TemplateSelect
                          value={draft.template}
                          onChange={(template) =>
                            setRowDrafts((previous) => ({
                              ...previous,
                              [row.uid]: { ...draft, template },
                            }))
                          }
                          disabled={busy || row.status === "deleted"}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <ResetModeSelect
                          value={draft.resetMode}
                          onChange={(resetMode) =>
                            setRowDrafts((previous) => ({
                              ...previous,
                              [row.uid]: { ...draft, resetMode },
                            }))
                          }
                          disabled={busy || row.status === "deleted"}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <label className="mb-2 flex items-center gap-2 text-xs text-zinc-300">
                          <input
                            type="checkbox"
                            checked={draft.indefinite}
                            disabled={busy || row.status === "deleted"}
                            onChange={(event) =>
                              setRowDrafts((previous) => ({
                                ...previous,
                                [row.uid]: { ...draft, indefinite: event.target.checked },
                              }))
                            }
                          />
                          Indefinido
                        </label>
                        <input
                          type="datetime-local"
                          value={draft.expiresAtInput}
                          disabled={busy || draft.indefinite || row.status === "deleted"}
                          onChange={(event) =>
                            setRowDrafts((previous) => ({
                              ...previous,
                              [row.uid]: { ...draft, expiresAtInput: event.target.value },
                            }))
                          }
                          className="h-10 w-52 rounded-xl border border-white/15 bg-black/35 px-3 text-xs text-zinc-100 disabled:opacity-60"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                            row.status === "deleted"
                              ? "border-red-400/30 bg-red-500/10 text-red-200"
                              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void onResetFirstTime(row.uid)}
                            disabled={busy || row.status === "deleted"}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-300/35 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-200 disabled:opacity-60"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset a primera vez
                          </button>
                          <button
                            type="button"
                            onClick={() => void onUpdateSettings(row.uid)}
                            disabled={busy || row.status === "deleted"}
                            className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/35 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-200 disabled:opacity-60"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Cambiar settings
                          </button>
                          <button
                            type="button"
                            onClick={() => void onDeleteDemo(row.uid)}
                            disabled={busy || row.status === "deleted"}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-400/35 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-red-200 disabled:opacity-60"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sortedRows.length === 0 && !busy ? (
              <p className="py-8 text-center text-sm text-zinc-400">No hay demos registradas.</p>
            ) : null}
          </div>
        </section>
      </main>

      {createdCredentials ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-amber-300/40 bg-zinc-950 p-5">
            <h3 className="text-lg font-black text-amber-200">Credenciales demo (una sola vez)</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Guarda estos datos ahora. La password no se almacena en Firestore.
            </p>
            <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-300">{createdCredentials.email}</span>
                <button
                  type="button"
                  onClick={() => void copyText(createdCredentials.email)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-300">{createdCredentials.password}</span>
                <button
                  type="button"
                  onClick={() => void copyText(createdCredentials.password)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCreatedCredentials(null)}
              className="mt-4 w-full rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-100"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
