"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  normalizeVertical,
  persistVerticalChoice,
  readVerticalFromClient,
} from "@/lib/vertical";
import { persistUtmFromUrl, trackGrowthEvent } from "@/lib/analytics";

const DEFAULT_AUTH_CANONICAL_HOST = "www.fastpagepro.com";
const CANONICAL_AUTH_HOST = (
  process.env.NEXT_PUBLIC_AUTH_CANONICAL_HOST || DEFAULT_AUTH_CANONICAL_HOST
)
  .trim()
  .toLowerCase();
const DEFAULT_AUTH_ALIAS_HOSTS =
  "fastpagepro.com";
const AUTH_ALIAS_HOSTS = (
  process.env.NEXT_PUBLIC_AUTH_ALIAS_HOSTS || DEFAULT_AUTH_ALIAS_HOSTS
)
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
const RECOMMENDED_FIREBASE_AUTH_DOMAINS = Array.from(
  new Set([CANONICAL_AUTH_HOST, ...AUTH_ALIAS_HOSTS].filter(Boolean)),
);

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-black text-sm font-semibold text-zinc-300">
          Cargando...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "suspended") {
      showToast("Tu cuenta ha sido suspendida temporalmente.");
    } else if (errorParam === "disabled") {
      showToast("Tu cuenta ha sido desactivada por el administrador.");
    }
  }, [errorParam]);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [toast, setToast] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleError, setIsGoogleError] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const preferredVertical = normalizeVertical(searchParams.get("vertical"));
  const trialIntent = String(searchParams.get("trial") || "").trim().toLowerCase();

  const isCanonicalRedirectNeeded = () => {
    if (typeof window === "undefined") return false;
    const currentHost = window.location.host.toLowerCase();
    if (!CANONICAL_AUTH_HOST) return false;
    if (currentHost === CANONICAL_AUTH_HOST) return false;

    // Redirect only known alias hosts to canonical auth host.
    return AUTH_ALIAS_HOSTS.includes(currentHost);
  };

  const redirectToCanonicalAuthHost = () => {
    if (typeof window === "undefined") return;
    const target = new URL(window.location.href);
    target.host = CANONICAL_AUTH_HOST;
    window.location.href = target.toString();
  };

  useEffect(() => {
    persistUtmFromUrl(searchParams);
    persistVerticalChoice(preferredVertical);
    if (searchParams.get("tab") === "register") {
      setTab("register");
      void trackGrowthEvent("start_signup", {
        vertical: preferredVertical,
        location: "auth_register_tab",
      });
    }
  }, [preferredVertical, searchParams]);

  useEffect(() => {
    if (!isCanonicalRedirectNeeded()) return;
    showToast(`Redirigiendo al dominio seguro: ${CANONICAL_AUTH_HOST}`);
    setTimeout(() => redirectToCanonicalAuthHost(), 700);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const activateBusinessTrial = async (firebaseUser: any) => {
    if (!firebaseUser?.uid) return;
    const shouldStartTrial = tab === "register" || trialIntent === "business14";
    if (!shouldStartTrial) return;

    try {
      const token = await firebaseUser.getIdToken();
      const formData = new FormData();
      formData.append("plan", "BUSINESS");
      formData.append("trial", "true");
      formData.append("paymentMethod", "TRANSFERENCIA");
      await fetch("/api/subscription/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      await fetch("/api/subscription/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("[Auth] No se pudo activar trial Business automaticamente.", error);
    }
  };

  const resolvePostAuthTarget = (email?: string | null) => {
    if (email === "afiliadosprobusiness@gmail.com") return "/admin";
    const fromQuery = searchParams.get("vertical");
    const hasStoredVertical =
      typeof window !== "undefined" && Boolean(window.localStorage.getItem("fp_vertical"));
    if (!fromQuery && !hasStoredVertical) return "/hub";
    const resolvedVertical = normalizeVertical(fromQuery || readVerticalFromClient());
    return `/app/new?vertical=${resolvedVertical}`;
  };

  // Funcion centralizada para sincronizar usuario con Firestore
  const syncUserToFirestore = async (user: any, verticalHint?: string) => {
    if (!user || !user.uid) return;
    
    try {
      console.log("Intentando sincronizar en Firestore:", user.email);
      const userRef = doc(db, "users", user.uid);
      const is_admin = user.email === "afiliadosprobusiness@gmail.com";
      const resolvedVertical = normalizeVertical(
        verticalHint || searchParams.get("vertical") || readVerticalFromClient(),
      );
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.name || (user.email ? user.email.split('@')[0] : "Usuario"),
        photoURL: user.photoURL || "",
        lastLogin: Date.now(),
        createdAt: user.metadata?.createdAt ? parseInt(user.metadata.createdAt) : Date.now(),
        status: "active",
        role: is_admin ? "admin" : "user",
        vertical: resolvedVertical,
        businessType: resolvedVertical,
      };

      // Aumentamos el timeout a 10 segundos
      const savePromise = setDoc(userRef, userData, { merge: true });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout sync")), 10000)
      );

      await Promise.race([savePromise, timeoutPromise]);
      console.log("Sincronizacion exitosa para:", user.email);
      
      // Actualizar sesion local
      localStorage.setItem("fp_session", JSON.stringify(userData));
      return true;
    } catch (error: any) {
      console.error("Error detallado de sincronizacion:", error);
      // Fallback local
      localStorage.setItem("fp_session", JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Usuario"
      }));
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") || "");

    if (!email || !password || !name) {
      showToast("Completa todos los campos");
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Actualizar perfil (nombre)
      await updateProfile(user, { displayName: name });

      // 3. Sincronizar con Firestore - Esperar a que se complete para asegurar que el Admin lo vea
      await syncUserToFirestore(user, preferredVertical);
      await activateBusinessTrial(user);

      showToast("Cuenta creada exitosamente!");
      
      // Redireccion basada en el rol
      const target = resolvePostAuthTarget(email);
      void trackGrowthEvent("signup_complete", {
        vertical: preferredVertical,
        location: "auth_email_register",
      });
      setTimeout(() => router.push(target), 1000);
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        showToast("El email ya esta registrado");
      } else if (error.code === "auth/weak-password") {
        showToast("La contrasena es muy debil (minimo 6 caracteres)");
      } else if (error.code === "auth/configuration-not-found") {
        showToast("Error de configuracion: Habilita Authentication en Firebase Console");
      } else {
        showToast("Error: " + error.message);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      showToast("Ingresa email y contrasena");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Sincronizacion prioritaria antes de redireccionar
      await syncUserToFirestore(user, preferredVertical);

      router.push(resolvePostAuthTarget(user.email));
    } catch (error: any) {
      console.error(error);

      // Detectar si el usuario debe usar Google
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("google.com") && !methods.includes("password")) {
          setIsGoogleError(true);
          showToast("Usa Google. Tu cuenta esta vinculada a Google.");
          setTimeout(() => setIsGoogleError(false), 3000);
          return;
        }
      } catch (e) {
        // Ignorar error de fetchSignInMethods (puede fallar por politicas de privacidad)
      }

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        showToast("Credenciales invalidas. Si usaste Google, usa el boton de abajo.");
      } else {
        showToast("Error al iniciar sesion: " + error.message);
      }
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sincronizacion prioritaria
        await syncUserToFirestore(user, preferredVertical);

        // Redireccion inmediata despues de asegurar datos
        router.push(resolvePostAuthTarget(user.email));
      }
    });

    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Sincronizacion prioritaria
          await syncUserToFirestore(result.user, preferredVertical);
          await activateBusinessTrial(result.user);
          if (tab === "register") {
            void trackGrowthEvent("signup_complete", {
              vertical: preferredVertical,
              location: "auth_google_redirect",
            });
          }
          router.push(resolvePostAuthTarget(result.user.email));
        }
      } catch (error: any) {
        console.error("Redirect Error:", error);
      }
    };
    checkRedirect();
    return () => unsubscribe();
  }, [preferredVertical, router, tab]);

  const handleGoogleLogin = async () => {
    if (isCanonicalRedirectNeeded()) {
      showToast("Redirigiendo para iniciar sesion con Google...");
      setTimeout(() => redirectToCanonicalAuthHost(), 500);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      // Intentamos con Popup primero
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Sincronizacion prioritaria (esperamos a que se guarde en Firestore)
        await syncUserToFirestore(result.user, preferredVertical);
        await activateBusinessTrial(result.user);
        if (tab === "register") {
          void trackGrowthEvent("signup_complete", {
            vertical: preferredVertical,
            location: "auth_google_popup",
          });
        }

        // Forzar redireccion inmediata
        const target = resolvePostAuthTarget(result.user.email);
        window.location.href = target;
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      
      if (error.code === "auth/unauthorized-domain") {
        if (isCanonicalRedirectNeeded()) {
          showToast("Dominio no autorizado para Google. Redirigiendo...");
          setTimeout(() => redirectToCanonicalAuthHost(), 700);
        } else {
          showToast(`Dominio no autorizado en Firebase. Agrega en Authorized domains: ${RECOMMENDED_FIREBASE_AUTH_DOMAINS.join(", ")}`);
        }
      } else if (error.code === 'auth/popup-blocked') {
        showToast("El navegador bloqueo la ventana emergente. Por favor, habilitala.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Ignorar
      } else if (error.code === 'auth/popup-closed-by-user') {
        showToast("Inicio de sesion cancelado.");
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        console.log("Detectado error COOP, intentando redireccion...");
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          showToast("Error de seguridad del navegador. Intenta de nuevo.");
        }
      } else {
        // Fallback general para otros errores
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          showToast("Error al iniciar sesion: " + (error.message || "Error desconocido"));
        }
      }
    }
  };

  const handlePasswordRecovery = async () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      showToast("Escribe tu email y luego presiona Recuperar.");
      return;
    }

    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Te enviamos un correo para restablecer tu contrasena.");
    } catch (error: any) {
      console.error("Password Recovery Error:", error);
      if (error.code === "auth/invalid-email") {
        showToast("El correo no es valido.");
      } else if (error.code === "auth/user-not-found") {
        showToast("No existe una cuenta con ese correo.");
      } else {
        showToast("No se pudo enviar el correo de recuperacion.");
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto px-4 pb-10 pt-12 md:pb-12 md:pt-16">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-stretch">
        {/* Logo/Header */}
        <div className="mb-8 min-h-[116px] text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Zap className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-3xl font-bold text-tornasolado tracking-tight transition-all">
              Fast Page
            </span>
          </Link>
          <p className="mt-3 min-h-[24px] text-zinc-400 dark:text-white">
            {tab === "login" ? (
              <>
                Bienvenido de nuevo,{" "}
                <span className="text-gold-glow">creador</span>.
              </>
            ) : (
              <>
                Comienza a construir tu{" "}
                <span className="text-gold-glow">imperio digital</span>.
              </>
            )}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            Rubro seleccionado: {preferredVertical}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass min-h-[700px] overflow-hidden rounded-2xl border border-white/10 p-1 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/20 rounded-xl mb-6">
            <button
              onClick={() => setTab("login")}
              className={`py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                tab === "login"
                  ? "bg-white/10 text-white shadow-lg border border-white/5"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Iniciar Sesion
            </button>
            <button
              onClick={() => {
                setTab("register");
                void trackGrowthEvent("start_signup", {
                  vertical: preferredVertical,
                  location: "auth_tab_click",
                });
              }}
              className={`py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                tab === "register"
                  ? "bg-white/10 text-white shadow-lg border border-white/5"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Registrarse
            </button>
          </div>

          <div className="min-h-[560px] px-6 pb-8">
            <div className="relative min-h-[360px]">
              <form
                onSubmit={handleLogin}
                aria-hidden={tab !== "login"}
                className={`absolute inset-0 flex min-h-[360px] flex-col gap-5 transition-opacity duration-200 ${
                  tab === "login"
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="tucorreo@dominio.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-300">
                      Contrasena
                    </label>
                    <button
                      type="button"
                      onClick={handlePasswordRecovery}
                      disabled={isResettingPassword}
                      className="text-xs text-yellow-500/80 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Olvidaste tu contrasena?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-deluxe w-full py-3.5 rounded-full text-black font-bold text-lg shadow-lg hover:shadow-yellow-500/20 mt-2"
                >
                  Entrar
                </button>
              </form>

              <form
                onSubmit={handleRegister}
                aria-hidden={tab !== "register"}
                className={`absolute inset-0 flex min-h-[360px] flex-col gap-5 transition-opacity duration-200 ${
                  tab === "register"
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Nombre
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="tucorreo@dominio.com"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Contrasena
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-deluxe w-full py-3.5 rounded-full text-black font-bold text-lg shadow-lg hover:shadow-yellow-500/20 mt-2"
                >
                  Crear cuenta
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] bg-white/10 flex-1" />
              <span className="text-xs text-muted uppercase tracking-widest">
                O continua con
              </span>
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleLogin}
              className={`w-full transition-all duration-300 py-3.5 rounded-full font-medium flex items-center justify-center gap-3 shadow-lg ${
                isGoogleError
                  ? "bg-red-600 text-white animate-shake ring-4 ring-red-500/50"
                  : "bg-[#0f141f] border border-white/15 text-white hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 hover:bg-gradient-to-r hover:text-black hover:border-yellow-200/80"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>
            <div className="mt-4 min-h-[24px]">
            {tab === "login" ? (
              <button
                type="button"
                onClick={handlePasswordRecovery}
                disabled={isResettingPassword}
                className="w-full text-center text-sm text-slate-300 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Olvidaste tu contrasena? Recuperar
              </button>
            ) : null}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-400 dark:text-white mt-8">
          &copy; {new Date().getFullYear()} Fast Page. Todos los derechos
          reservados.
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-xl backdrop-blur-md animate-fade-in">
          <span className="text-yellow-400">!</span>
          {toast}
        </div>
      )}
    </main>
  );
}



