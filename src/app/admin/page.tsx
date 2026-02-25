"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isRootAdminEmail, ROOT_ADMIN_EMAIL } from "@/lib/adminAccess";
import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot
} from "firebase/firestore";
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Search,
  LogOut,
  RefreshCw,
  Trash2
} from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  name: string;
  lastLogin: number;
  createdAt?: number;
  status?: 'active' | 'suspended' | 'disabled';
  photoURL?: string;
  role?: string;
}

type PlanType = "FREE" | "BUSINESS" | "PRO";
type PlanStatus = "ACTIVE" | "EXPIRED" | "PENDING";
type PlanMode = "ACTIVATE" | "DEACTIVATE";

interface PlanSummary {
  userId: string;
  plan: PlanType;
  status: PlanStatus;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

const PLAN_BADGE_STYLES: Record<PlanType, string> = {
  FREE: "border-zinc-500/40 bg-zinc-600/20 text-zinc-200",
  BUSINESS: "border-amber-400/50 bg-amber-500/20 text-amber-100",
  PRO: "border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-100",
};

export default function AdminPanel() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planSyncError, setPlanSyncError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [planByUserId, setPlanByUserId] = useState<Record<string, PlanSummary>>({});
  const [planDraftByUserId, setPlanDraftByUserId] = useState<Record<string, PlanType>>({});
  const [planLoadingByUserId, setPlanLoadingByUserId] = useState<Record<string, boolean>>({});
  const [planMessageByUserId, setPlanMessageByUserId] = useState<Record<string, string>>({});
  const router = useRouter();
  const fetchPlanSummaries = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) {
      setPlanByUserId({});
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/subscription/admin/summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userIds }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error || "No se pudo cargar el estado de planes."));
      }

      const summaries = Array.isArray(payload?.summaries) ? (payload.summaries as PlanSummary[]) : [];
      setPlanSyncError(null);
      setPlanByUserId((previous) => {
        const next: Record<string, PlanSummary> = { ...previous };
        for (const summary of summaries) {
          if (!summary?.userId) continue;
          next[summary.userId] = summary;
        }
        return next;
      });
      setPlanDraftByUserId((previous) => {
        const next = { ...previous };
        for (const summary of summaries) {
          if (!summary?.userId || next[summary.userId]) continue;
          next[summary.userId] = summary.plan;
        }
        return next;
      });
    } catch (requestError: any) {
      setPlanSyncError(requestError?.message || "No se pudo cargar el estado de planes.");
    }
  }, []);

  const applyPlanAction = useCallback(async (userId: string, requestedPlan: PlanType, mode: PlanMode) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("Sesion invalida. Vuelve a iniciar sesion.");
      return;
    }

    setPlanLoadingByUserId((previous) => ({ ...previous, [userId]: true }));
    setPlanMessageByUserId((previous) => ({ ...previous, [userId]: "" }));

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/subscription/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId,
          plan: requestedPlan,
          mode,
          durationDays: requestedPlan === "FREE" ? 3650 : 30,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error || "No se pudo actualizar el plan."));
      }

      const subscription = payload?.subscription as PlanSummary | undefined;
      if (subscription?.userId) {
        setPlanByUserId((previous) => ({ ...previous, [subscription.userId]: subscription }));
        setPlanDraftByUserId((previous) => ({ ...previous, [subscription.userId]: subscription.plan }));
      } else {
        await fetchPlanSummaries([userId]);
      }

      setPlanMessageByUserId((previous) => ({
        ...previous,
        [userId]: mode === "DEACTIVATE" ? "Plan cambiado a FREE." : `Plan ${requestedPlan} activo.`,
      }));
    } catch (requestError: any) {
      setPlanMessageByUserId((previous) => ({
        ...previous,
        [userId]: requestError?.message || "No se pudo actualizar el plan.",
      }));
    } finally {
      setPlanLoadingByUserId((previous) => ({ ...previous, [userId]: false }));
    }
  }, [fetchPlanSummaries]);

  useEffect(() => {
    // Verificación de sesión local primero
    const session = localStorage.getItem("fp_session");
    if (session) {
      try {
        const userData = JSON.parse(session);
        if (isRootAdminEmail(userData?.email)) {
          setAuthorized(true);
        } else {
          router.replace("/hub");
          return;
        }
      } catch {
        localStorage.removeItem("fp_session");
      }
    }

    let unsubscribeSnapshot: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth");
        return;
      }
  
      if (!isRootAdminEmail(user.email)) {
        router.replace("/hub");
        return;
      }

      setAuthorized(true);
      
      // Sincronizar al propio admin si no existe en Firestore
      try {
        const adminRef = doc(db, "users", user.uid);
        await setDoc(adminRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Super Admin",
          lastLogin: Date.now(),
          role: "admin",
          status: "active"
        }, { merge: true });
      } catch (e) {
        console.error("Error sincronizando admin:", e);
      }

      // Cargar lista de usuarios
      const usersRef = collection(db, "users");
      setDebugInfo("Conectando con Firestore...");
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      
      unsubscribeSnapshot = onSnapshot(usersRef, (querySnapshot) => {
        console.log("Admin: Snapshot recibido con", querySnapshot.size, "documentos");
        
        if (querySnapshot.empty) {
          console.log("Admin: La colección está vacía");
          setDebugInfo("Base de datos conectada, pero vacía (0 usuarios).");
          setUsers([]);
        } else {
          const usersData: UserData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Admin: Usuario encontrado ->", data.email);
            usersData.push({ uid: doc.id, ...data } as UserData);
          });
          
          // Ordenar por último acceso
          usersData.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
          setUsers(usersData);
          setDebugInfo(`Conectado. Usuarios en tabla: ${querySnapshot.size}`);
        }
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error("Admin: Error en onSnapshot:", err);
        setError(`Error de acceso a Firestore: ${err.message}. Verifica las reglas de seguridad.`);
        setLoading(false);
      });

    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    const userIds = users.map((user) => user.uid).filter(Boolean);
    if (userIds.length === 0) {
      setPlanByUserId({});
      return;
    }
    fetchPlanSummaries(userIds);
  }, [users, authorized, fetchPlanSummaries]);

  // Ya no necesitamos fetchUsers manual ya que onSnapshot se encarga

  const updateUserStatus = async (uid: string, status: UserData['status']) => {
    try {
      await updateDoc(doc(db, "users", uid), { status });
      setUsers((previous) => previous.map((entry) => (entry.uid === uid ? { ...entry, status } : entry)));
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const deleteUser = async (uid: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((previous) => previous.filter((entry) => entry.uid !== uid));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("fp_session");
    router.push("/auth");
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Panel <span className="text-amber-500">Super Admin</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Control Total del Sistema</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold">{ROOT_ADMIN_EMAIL}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Sesión de Administrador</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-end justify-between">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
              <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Total Usuarios</p>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-[10px] text-zinc-600 mt-1">{debugInfo}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
              <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Activos</p>
              <p className="text-2xl font-bold text-emerald-500">{users.filter(u => u.status !== 'disabled' && u.status !== 'suspended').length}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Estado de Sincronización</p>
              <p className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Sincronizado
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              disabled={refreshing}
              className="mt-2 text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              Forzar Actualización
            </button>
          </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        {planSyncError && (
          <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-200">Estado de planes parcial</p>
            <p className="mt-1 text-xs text-amber-100/90">{planSyncError}</p>
          </div>
        )}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usuario</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Registro</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Último Acceso</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">Cargando base de datos...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-md mx-auto">
                        <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-400 text-sm font-bold">Error de Conexión</p>
                        <p className="text-red-400/60 text-xs mt-1">{error}</p>
                        <p className="text-zinc-500 text-[10px] mt-4 uppercase tracking-widest">Verifica Firebase Auth, reglas de Firestore y variables del servidor</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="py-8">
                        <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm font-medium">No se encontraron usuarios en Firestore.</p>
                        <p className="text-zinc-600 text-xs mt-2 max-w-xs mx-auto">
                          Los usuarios de "Authentication" deben iniciar sesión al menos una vez para aparecer en este panel.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const summary = planByUserId[user.uid];
                    const currentPlan: PlanType = summary?.plan || "FREE";
                    const selectedPlan = planDraftByUserId[user.uid] || currentPlan;
                    const planLoading = Boolean(planLoadingByUserId[user.uid]);
                    const planMessage = planMessageByUserId[user.uid];

                    return (
                      <tr key={user.uid} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {user.photoURL ? (
                                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-5 h-5 text-zinc-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {user.name || "Sin nombre"}
                                {isRootAdminEmail(user.email) && (
                                  <span className="ml-2 text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">ROOT</span>
                                )}
                              </p>
                              <p className="text-xs text-zinc-500">{user.email}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] ${PLAN_BADGE_STYLES[currentPlan]}`}
                                >
                                  {currentPlan}
                                </span>
                                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                                  {summary?.status || "ACTIVE"}
                                </span>
                                {summary?.endDate && (
                                  <span className="text-[10px] text-zinc-500">
                                    vence: {new Date(summary.endDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.status === 'suspended' ? 'bg-orange-500/10 text-orange-500' :
                            user.status === 'disabled' ? 'bg-red-500/10 text-red-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-zinc-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-zinc-400">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Nunca"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {!isRootAdminEmail(user.email) ? (
                              <>
                                <select
                                  value={selectedPlan}
                                  onChange={(event) =>
                                    setPlanDraftByUserId((previous) => ({
                                      ...previous,
                                      [user.uid]: event.target.value as PlanType,
                                    }))
                                  }
                                  className="h-9 min-w-[120px] rounded-lg border border-white/15 bg-black/40 px-2 text-xs font-bold uppercase tracking-[0.08em] text-zinc-100 outline-none focus:border-amber-500/50"
                                  aria-label={`Plan de ${user.email}`}
                                >
                                  <option value="FREE">FREE</option>
                                  <option value="BUSINESS">BUSINESS</option>
                                  <option value="PRO">PRO</option>
                                </select>

                                <button
                                  onClick={() => applyPlanAction(user.uid, selectedPlan, "ACTIVATE")}
                                  disabled={planLoading}
                                  className="h-9 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                                  title="Activar plan seleccionado"
                                >
                                  {planLoading ? "Aplicando..." : "Activar"}
                                </button>

                                <button
                                  onClick={() => applyPlanAction(user.uid, "FREE", "DEACTIVATE")}
                                  disabled={planLoading}
                                  className="h-9 rounded-lg border border-zinc-400/30 bg-zinc-500/10 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-200 transition-colors hover:bg-zinc-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                  title="Quitar Business/Pro y pasar a Free"
                                >
                                  Free
                                </button>

                                <button 
                                  onClick={() => updateUserStatus(user.uid, user.status === 'suspended' ? 'active' : 'suspended')}
                                  className={`p-2 rounded-lg transition-all ${user.status === 'suspended' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                                  title={user.status === 'suspended' ? "Reactivar" : "Suspender"}
                                >
                                  {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                </button>
                                
                                <button 
                                  onClick={() => updateUserStatus(user.uid, user.status === 'disabled' ? 'active' : 'disabled')}
                                  className={`p-2 rounded-lg transition-all ${user.status === 'disabled' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500 hover:text-white'}`}
                                  title={user.status === 'disabled' ? "Habilitar" : "Deshabilitar"}
                                >
                                  {user.status === 'disabled' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                </button>

                                <button 
                                  onClick={() => deleteUser(user.uid)}
                                  className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                  title="Eliminar Permanente"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                {planMessage && (
                                  <p className="w-full text-right text-[10px] text-zinc-400">{planMessage}</p>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-medium px-2 py-1">SISTEMA PROTEGIDO</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}



