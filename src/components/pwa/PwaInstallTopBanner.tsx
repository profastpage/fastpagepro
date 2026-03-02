"use client";

import Link from "next/link";
import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "fp_install_banner_hidden_until";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 3;

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOSDevice() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export default function PwaInstallTopBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobileViewport()) return;
    if (isStandaloneMode()) return;

    const hiddenUntil = Number(window.localStorage.getItem(DISMISS_KEY) || "0");
    if (Number.isFinite(hiddenUntil) && hiddenUntil > Date.now()) return;

    const iOS = isIOSDevice();
    setIsIos(iOS);
    setIsVisible(true);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      window.localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const helperText = useMemo(() => {
    if (isIos) {
      return "En iPhone: Safari > Compartir > Anadir a pantalla de inicio.";
    }
    if (!deferredPrompt) {
      return "Si no ves el boton de instalacion del navegador, abre menu y elige Instalar app.";
    }
    return "Al abrir la app: si ya iniciaste sesion entra al Hub, si no, va al autenticador.";
  }, [deferredPrompt, isIos]);

  const hideForNow = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_TTL_MS));
    }
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setIsVisible(false);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(DISMISS_KEY);
        }
      }
      setDeferredPrompt(null);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!isVisible) return null;

  return (
    <aside className="w-full rounded-2xl border border-amber-300/45 bg-[linear-gradient(160deg,rgba(251,191,36,0.22),rgba(23,17,8,0.9)_38%,rgba(8,8,10,0.96))] px-4 py-3 shadow-[0_16px_42px_-24px_rgba(251,191,36,0.78)] backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-black/65 text-amber-200">
          <Smartphone className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-300">
            Aplicacion movil
          </p>
          <h2 className="mt-1 text-sm font-black leading-tight text-amber-50">
            Descargar aplicacion Fast Page
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-amber-100/95">
            Mantente activo en tu cuenta sin cerrar sesion. Entra directo al autenticador o al Hub
            principal si ya estas registrado.
          </p>
          <p className="mt-1 text-[11px] font-semibold text-amber-200/90">{helperText}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              disabled={!deferredPrompt || isInstalling}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-200 px-3 py-1.5 text-xs font-black text-zinc-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <Download className="h-3.5 w-3.5" />
              {isInstalling ? "Instalando..." : "Instalar app"}
            </button>
            <Link
              href="/auth"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:border-amber-300/55 hover:text-amber-200"
            >
              Ir al autenticador
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={hideForNow}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-zinc-200 transition hover:border-amber-300/45 hover:text-amber-200"
          aria-label="Cerrar aviso de instalacion"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}

