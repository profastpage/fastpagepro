"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  browserLocalPersistence,
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
  setPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useLanguage } from "@/context/LanguageContext";
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
const GOOGLE_AUTH_INTENT_KEY = "fp_google_auth_intent";

type LandingPlanIntent = "FREE" | "BUSINESS" | "PRO";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function normalizePlanIntent(rawValue: string | null): LandingPlanIntent | null {
  const normalized = String(rawValue || "")
    .trim()
    .toUpperCase();
  if (normalized === "FREE" || normalized === "STARTER" || normalized === "29") return "FREE";
  if (normalized === "BUSINESS" || normalized === "59") return "BUSINESS";
  if (normalized === "PRO" || normalized === "99") return "PRO";
  return null;
}

function normalizeReferralCode(rawValue: string | null): string {
  return String(rawValue || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-black text-sm font-semibold text-zinc-300">
          Loading...
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
  const { language, setLanguage } = useLanguage();
  const errorParam = searchParams.get("error");
  const isEnglish = language === "en";
  const i18n = useMemo(
    () =>
      isEnglish
        ? {
            loading: "Loading...",
            suspended: "Your account has been temporarily suspended.",
            disabled: "Your account has been disabled by the administrator.",
            redirectingSecure: "Redirecting to secure domain:",
            signupWelcome: "Start building your",
            signupEmpire: "digital business",
            loginWelcome: "Welcome back,",
            creator: "creator",
            selectedVertical: "Selected category:",
            loginTab: "Sign In",
            registerTab: "Create Account",
            labelName: "Name",
            labelEmail: "Email",
            labelPassword: "Password",
            labelReferral: "Referral code (optional)",
            placeholderName: "Your name",
            placeholderEmail: "you@domain.com",
            placeholderReferral: "Example: FASTAB12",
            forgotPassword: "Forgot your password?",
            submitLogin: "Enter",
            submitRegister: "Create account",
            fillAllFields: "Complete all fields",
            accountCreated: "Account created successfully!",
            emailInUse: "This email is already registered",
            weakPassword: "Password is too weak (minimum 6 characters)",
            authNotEnabled:
              "Configuration error: Enable Authentication in Firebase Console",
            genericError: "Error:",
            enterCredentials: "Enter email and password",
            useGoogle: "Use Google. Your account is linked to Google.",
            invalidCredentials:
              "Invalid credentials. If you used Google, use the button below.",
            loginError: "Login error:",
            redirectGoogle: "Redirecting to sign in with Google...",
            unauthorizedDomainGoogle: "Unauthorized domain for Google. Redirecting...",
            unauthorizedDomainFirebase:
              "Unauthorized domain in Firebase. Add in Authorized domains:",
            popupBlocked: "The browser blocked the popup window. Please enable it.",
            loginCancelled: "Sign-in cancelled.",
            browserSecurityError: "Browser security error. Please try again.",
            unknownError: "Unknown error",
            typeEmailForRecovery: "Type your email and then click Recover.",
            recoverySent: "We sent you an email to reset your password.",
            invalidEmail: "The email is not valid.",
            accountNotFound: "No account exists with that email.",
            recoveryFailed: "Could not send recovery email.",
            continueWith: "Or continue with",
            continueGoogle: "Continue with Google",
            recoverButton: "Forgot your password? Recover",
            rights: "All rights reserved.",
          }
        : {
            loading: "Cargando...",
            suspended: "Tu cuenta ha sido suspendida temporalmente.",
            disabled: "Tu cuenta ha sido desactivada por el administrador.",
            redirectingSecure: "Redirigiendo al dominio seguro:",
            signupWelcome: "Comienza a construir tu",
            signupEmpire: "imperio digital",
            loginWelcome: "Bienvenido de nuevo,",
            creator: "creador",
            selectedVertical: "Rubro seleccionado:",
            loginTab: "Iniciar Sesion",
            registerTab: "Registrarse",
            labelName: "Nombre",
            labelEmail: "Email",
            labelPassword: "Contrasena",
            labelReferral: "Codigo de referido (opcional)",
            placeholderName: "Tu nombre",
            placeholderEmail: "tucorreo@dominio.com",
            placeholderReferral: "Ejemplo: FASTAB12",
            forgotPassword: "Olvidaste tu contrasena?",
            submitLogin: "Entrar",
            submitRegister: "Crear cuenta",
            fillAllFields: "Completa todos los campos",
            accountCreated: "Cuenta creada exitosamente!",
            emailInUse: "El email ya esta registrado",
            weakPassword: "La contrasena es muy debil (minimo 6 caracteres)",
            authNotEnabled:
              "Error de configuracion: Habilita Authentication en Firebase Console",
            genericError: "Error:",
            enterCredentials: "Ingresa email y contrasena",
            useGoogle: "Usa Google. Tu cuenta esta vinculada a Google.",
            invalidCredentials:
              "Credenciales invalidas. Si usaste Google, usa el boton de abajo.",
            loginError: "Error al iniciar sesion:",
            redirectGoogle: "Redirigiendo para iniciar sesion con Google...",
            unauthorizedDomainGoogle: "Dominio no autorizado para Google. Redirigiendo...",
            unauthorizedDomainFirebase:
              "Dominio no autorizado en Firebase. Agrega en Authorized domains:",
            popupBlocked: "El navegador bloqueo la ventana emergente. Por favor, habilitala.",
            loginCancelled: "Inicio de sesion cancelado.",
            browserSecurityError: "Error de seguridad del navegador. Intenta de nuevo.",
            unknownError: "Error desconocido",
            typeEmailForRecovery: "Escribe tu email y luego presiona Recuperar.",
            recoverySent: "Te enviamos un correo para restablecer tu contrasena.",
            invalidEmail: "El correo no es valido.",
            accountNotFound: "No existe una cuenta con ese correo.",
            recoveryFailed: "No se pudo enviar el correo de recuperacion.",
            continueWith: "O continua con",
            continueGoogle: "Continuar con Google",
            recoverButton: "Olvidaste tu contrasena? Recuperar",
            rights: "Todos los derechos reservados.",
          },
    [isEnglish],
  );

  useEffect(() => {
    if (errorParam === "suspended") {
      showToast(i18n.suspended);
    } else if (errorParam === "disabled") {
      showToast(i18n.disabled);
    }
  }, [errorParam, i18n.disabled, i18n.suspended]);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [toast, setToast] = useState<string>("");
  const [isStandalonePwa, setIsStandalonePwa] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const referralCodeIntent = normalizeReferralCode(searchParams.get("ref"));
  const [registerReferralCode, setRegisterReferralCode] = useState(referralCodeIntent);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleError, setIsGoogleError] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const isPostAuthProcessingRef = useRef(false);
  const googleIntentRef = useRef<"login" | "register">("login");
  const preferredVertical = normalizeVertical(searchParams.get("vertical"));
  const planIntent = normalizePlanIntent(searchParams.get("plan"));
  const trialIntent = String(searchParams.get("trial") || "").trim().toLowerCase();
  const demoSlugIntent = String(searchParams.get("demoSlug") || "")
    .trim()
    .replace(/[^\w-]/g, "");
  const demoThemeIntent = String(searchParams.get("demoTheme") || "")
    .trim()
    .replace(/[^\w-]/g, "");

  useEffect(() => {
    if (!referralCodeIntent) return;
    setRegisterReferralCode((current) => current || referralCodeIntent);
  }, [referralCodeIntent]);

  const persistGoogleIntent = (intent: "login" | "register") => {
    if (typeof window === "undefined") return;
    googleIntentRef.current = intent;
    window.sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, intent);
  };

  const readGoogleIntent = (): "login" | "register" => {
    if (typeof window === "undefined") return tab;
    const raw = String(window.sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY) || "").trim().toLowerCase();
    if (raw === "register") return "register";
    if (raw === "login") return "login";
    return tab;
  };

  const clearGoogleIntent = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY);
  };

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
    void setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn("[Auth] No se pudo fijar persistencia local:", error);
    });
  }, []);

  useEffect(() => {
    setIsStandalonePwa(isStandaloneMode());
  }, []);

  useEffect(() => {
    if (!isCanonicalRedirectNeeded()) return;
    showToast(`${i18n.redirectingSecure} ${CANONICAL_AUTH_HOST}`);
    setTimeout(() => redirectToCanonicalAuthHost(), 700);
  }, [i18n.redirectingSecure]);

  const startGoogleRedirect = async (intent: "login" | "register") => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    persistGoogleIntent(intent);
    showToast(i18n.redirectGoogle);
    await signInWithRedirect(auth, provider);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchWithTimeout = async (
    input: RequestInfo | URL,
    init: RequestInit = {},
    timeoutMs = 6000,
  ) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  const activateBusinessTrial = async (firebaseUser: any) => {
    if (!firebaseUser?.uid) return;

    try {
      const token = await firebaseUser.getIdToken();
      await fetchWithTimeout("/api/subscription/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchWithTimeout("/api/subscription/current", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => undefined);

      const shouldStartTrial = planIntent === "BUSINESS" || trialIntent === "business14";
      if (shouldStartTrial) {
        const formData = new FormData();
        formData.append("plan", "BUSINESS");
        formData.append("trial", "true");
        formData.append("paymentMethod", "TRANSFERENCIA");
        await fetchWithTimeout("/api/subscription/request", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }).catch(() => undefined);
        await fetchWithTimeout("/api/subscription/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => undefined);
      }
    } catch (error) {
      console.warn("[Auth] No se pudo activar trial Business automaticamente.", error);
    }
  };

  const applyReferralCodeAfterAuth = async (firebaseUser: any, forceApply = false) => {
    const code = normalizeReferralCode(registerReferralCode || referralCodeIntent);
    if (!code) return;
    if (!forceApply && tab !== "register") return;
    if (!firebaseUser?.uid) return;

    try {
      const token = await firebaseUser.getIdToken();
      await fetch("/api/referrals/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
    } catch (error) {
      console.warn("[Auth] No se pudo aplicar codigo de referido.", error);
    }
  };

  const resolvePostAuthTarget = (email?: string | null) => {
    if (email === "afiliadosprobusiness@gmail.com") return "/admin";
    if (planIntent) {
      const params = new URLSearchParams({ plan: planIntent });
      if (trialIntent) {
        params.set("trial", trialIntent);
      }
      return `/dashboard/billing?${params.toString()}`;
    }
    const fromQuery = searchParams.get("vertical");
    const hasStoredVertical =
      typeof window !== "undefined" && Boolean(window.localStorage.getItem("fp_vertical"));
    if (!fromQuery && !hasStoredVertical) return "/hub";
    const resolvedVertical = normalizeVertical(fromQuery || readVerticalFromClient());
    const params = new URLSearchParams({ vertical: resolvedVertical });
    if (demoSlugIntent) params.set("demoSlug", demoSlugIntent);
    if (demoThemeIntent) params.set("demoTheme", demoThemeIntent);
    return `/app/new?${params.toString()}`;
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

  const runPostAuthFlow = async (
    firebaseUser: any,
    source: "auth_state" | "redirect" | "popup",
  ) => {
    if (!firebaseUser?.uid) return;
    if (isPostAuthProcessingRef.current) return;
    isPostAuthProcessingRef.current = true;

    const target = resolvePostAuthTarget(firebaseUser.email);
    router.push(target);

    void (async () => {
      try {
        const intent = readGoogleIntent();
        await syncUserToFirestore(firebaseUser, preferredVertical);
        await applyReferralCodeAfterAuth(firebaseUser, intent === "register");
        await activateBusinessTrial(firebaseUser);
        if (intent === "register") {
          void trackGrowthEvent("signup_complete", {
            vertical: preferredVertical,
            location: source === "popup" ? "auth_google_popup" : "auth_google_redirect",
          });
        }
        clearGoogleIntent();
      } catch (error: any) {
        console.error("[Auth] Error en flujo post login Google:", error);
      }
    })();
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
      showToast(i18n.fillAllFields);
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
      await applyReferralCodeAfterAuth(user, true);
      await activateBusinessTrial(user);

      showToast(i18n.accountCreated);
      
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
        showToast(i18n.emailInUse);
      } else if (error.code === "auth/weak-password") {
        showToast(i18n.weakPassword);
      } else if (error.code === "auth/configuration-not-found") {
        showToast(i18n.authNotEnabled);
      } else {
        showToast(`${i18n.genericError} ${error.message}`);
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
      showToast(i18n.enterCredentials);
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
      await activateBusinessTrial(user);

      router.push(resolvePostAuthTarget(user.email));
    } catch (error: any) {
      console.error(error);

      // Detectar si el usuario debe usar Google
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("google.com") && !methods.includes("password")) {
          setIsGoogleError(true);
          showToast(i18n.useGoogle);
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
        showToast(i18n.invalidCredentials);
      } else {
        showToast(`${i18n.loginError} ${error.message}`);
      }
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await runPostAuthFlow(user, "auth_state");
      }
    });

    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await runPostAuthFlow(result.user, "redirect");
          return;
        }
      } catch (error: any) {
        console.error("Redirect Error:", error);
        clearGoogleIntent();
        showToast(`${i18n.loginError} ${error?.code || error?.message || i18n.unknownError}`);
      }
    };
    checkRedirect();
    return () => unsubscribe();
  }, [demoSlugIntent, demoThemeIntent, i18n.loginError, i18n.unknownError, planIntent, preferredVertical, router, tab, trialIntent]);

  const shouldUseGooglePopup = () => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    const isMobile =
      /android|iphone|ipad|ipod|mobile|opera mini|iemobile|webos/.test(ua) ||
      isStandaloneMode();
    return !isMobile;
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;

    if (isCanonicalRedirectNeeded()) {
      persistGoogleIntent(tab);
      showToast(i18n.redirectingSecure + " " + CANONICAL_AUTH_HOST);
      setTimeout(() => redirectToCanonicalAuthHost(), 500);
      return;
    }

    setIsGoogleLoading(true);
    try {
      if (shouldUseGooglePopup()) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
          const result = await signInWithPopup(auth, provider);
          if (result?.user) {
            persistGoogleIntent(tab);
            await runPostAuthFlow(result.user, "popup");
            return;
          }
        } catch (popupError: any) {
          const popupCode = String(popupError?.code || "");
          const popupMessage = String(popupError?.message || "");
          const unsupportedEnvironment =
            popupCode === "auth/operation-not-supported-in-this-environment";
          const popupBlocked =
            popupCode === "auth/popup-blocked" ||
            popupCode === "auth/popup-closed-by-user" ||
            popupCode === "auth/cancelled-popup-request" ||
            /popup/i.test(popupMessage);

          if (!unsupportedEnvironment && !popupBlocked) {
            throw popupError;
          }

          if (popupBlocked) {
            setIsGoogleError(true);
            showToast(`${i18n.popupBlocked} ${i18n.redirectGoogle}`);
            setTimeout(() => setIsGoogleError(false), 3000);
            await startGoogleRedirect(tab);
            return;
          }

          console.warn("[Auth] Entorno sin soporte popup, fallback a redirect", popupError);
        }
      }

      await startGoogleRedirect(tab);
    } catch (error: any) {
      console.error("Google Login Error:", error);
      clearGoogleIntent();
      
      if (error.code === "auth/unauthorized-domain") {
        if (isCanonicalRedirectNeeded()) {
          showToast(i18n.unauthorizedDomainGoogle);
          setTimeout(() => redirectToCanonicalAuthHost(), 700);
        } else {
          showToast(`${i18n.unauthorizedDomainFirebase} ${RECOMMENDED_FIREBASE_AUTH_DOMAINS.join(", ")}`);
        }
      } else {
        showToast(`${i18n.loginError} ${error.message || i18n.unknownError}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordRecovery = async () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      showToast(i18n.typeEmailForRecovery);
      return;
    }

    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast(i18n.recoverySent);
    } catch (error: any) {
      console.error("Password Recovery Error:", error);
      if (error.code === "auth/invalid-email") {
        showToast(i18n.invalidEmail);
      } else if (error.code === "auth/user-not-found") {
        showToast(i18n.accountNotFound);
      } else {
        showToast(i18n.recoveryFailed);
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
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-full border border-white/20 bg-white/5 px-2 text-[10px] font-bold tracking-[0.08em] text-white transition hover:border-amber-300/45 hover:text-amber-200"
              aria-label={isEnglish ? "Change language" : "Cambiar idioma"}
            >
              {language === "es" ? "EN" : "ES"}
            </button>
          </div>
          {isStandalonePwa ? (
            <div className="inline-flex items-center gap-3">
              <Zap className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
              <span className="text-3xl font-bold text-tornasolado tracking-tight transition-all">
                Fast Page
              </span>
            </div>
          ) : (
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Zap className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-bold text-tornasolado tracking-tight transition-all">
                Fast Page
              </span>
            </Link>
          )}
          <p className="mt-3 min-h-[24px] text-zinc-400 dark:text-white">
            {tab === "login" ? (
              <>
                {i18n.loginWelcome}{" "}
                <span className="text-gold-glow">{i18n.creator}</span>.
              </>
            ) : (
              <>
                {i18n.signupWelcome}{" "}
                <span className="text-gold-glow">{i18n.signupEmpire}</span>.
              </>
            )}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            {i18n.selectedVertical} {preferredVertical}
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
              {i18n.loginTab}
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
              {i18n.registerTab}
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="min-h-[320px]">
              <form
                onSubmit={handleLogin}
                aria-hidden={tab !== "login"}
                className={`flex flex-col gap-5 transition-opacity duration-200 ${
                  tab === "login"
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none hidden opacity-0"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {i18n.labelEmail}
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={i18n.placeholderEmail}
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-300">
                      {i18n.labelPassword}
                    </label>
                    <button
                      type="button"
                      onClick={handlePasswordRecovery}
                      disabled={isResettingPassword}
                      className="text-xs text-yellow-500/80 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {i18n.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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
                  {i18n.submitLogin}
                </button>
              </form>

              <form
                onSubmit={handleRegister}
                aria-hidden={tab !== "register"}
                className={`flex flex-col gap-5 transition-opacity duration-200 ${
                  tab === "register"
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none hidden opacity-0"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {i18n.labelName}
                  </label>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={i18n.placeholderName}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {i18n.labelEmail}
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={i18n.placeholderEmail}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {i18n.labelReferral}
                  </label>
                  <input
                    name="referralCode"
                    type="text"
                    autoComplete="off"
                    placeholder={i18n.placeholderReferral}
                    value={registerReferralCode}
                    onChange={(event) => setRegisterReferralCode(normalizeReferralCode(event.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white uppercase placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {i18n.labelPassword}
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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
                  {i18n.submitRegister}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] bg-white/10 flex-1" />
              <span className="text-xs text-muted uppercase tracking-widest">
                {i18n.continueWith}
              </span>
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className={`w-full transition-all duration-300 py-3.5 rounded-full font-medium flex items-center justify-center gap-3 shadow-lg ${
                isGoogleError
                  ? "bg-red-600 text-white animate-shake ring-4 ring-red-500/50"
                  : "bg-[#0f141f] border border-white/15 text-white hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 hover:bg-gradient-to-r hover:text-black hover:border-yellow-200/80 disabled:opacity-60 disabled:cursor-not-allowed"
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
              {isGoogleLoading ? i18n.redirectGoogle : i18n.continueGoogle}
            </button>
            <div className="mt-4 min-h-[24px]">
            {tab === "login" ? (
              <button
                type="button"
                onClick={handlePasswordRecovery}
                disabled={isResettingPassword}
                className="w-full text-center text-sm text-slate-300 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {i18n.recoverButton}
              </button>
            ) : null}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-400 dark:text-white mt-8">
          &copy; {new Date().getFullYear()} Fast Page. {i18n.rights}
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



