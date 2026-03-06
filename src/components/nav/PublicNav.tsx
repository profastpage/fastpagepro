"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Zap } from "lucide-react";
import IosInstallGuideModal from "@/components/pwa/IosInstallGuideModal";
import { useLanguage } from "@/context/LanguageContext";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

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

export default function PublicNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallingApp, setIsInstallingApp] = useState(false);
  const [isStandalonePwa, setIsStandalonePwa] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsStandalonePwa(isStandaloneMode());
    setIsIosDevice(isIOSDevice());

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredInstallPrompt(null);
      setIsStandalonePwa(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const handleInstallFromMenu = async () => {
    if (isStandalonePwa) return;
    if (!deferredInstallPrompt) {
      if (isIosDevice) {
        setShowIosInstallGuide(true);
        setIsOpen(false);
        return;
      }
      window.alert("Si no ves el boton de instalacion, abre el menu del navegador y elige Instalar app.");
      return;
    }

    setIsInstallingApp(true);
    try {
      await deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      setDeferredInstallPrompt(null);
      setIsOpen(false);
    } finally {
      setIsInstallingApp(false);
    }
  };

  const installLabel = language === "en" ? "Install app" : "Instalar app";
  const homeHref = isStandalonePwa ? "/auth" : "/";

  return (
    <>
      <div className="hidden md:block">
        <div className="fixed top-8 left-8 z-50">
          <Link href={homeHref} className="flex items-center gap-2 group transition-all" aria-label="Fast Page Home">
            <Zap className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-black tracking-tighter text-gold-gradient drop-shadow-sm group-hover:brightness-110 transition-all">FAST PAGE</span>
          </Link>
        </div>

        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-transparent" />

        <div className="fixed top-8 right-8 z-50 flex max-w-[45vw] items-center gap-4">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t("floating.toggleLanguage")}
            className="inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-full border border-white/20 bg-white/5 px-3 text-[11px] font-bold tracking-[0.08em] text-white transition hover:border-amber-300/45 hover:text-amber-200"
          >
            {language === "es" ? "EN" : "ES"}
          </button>
          <Link
            href="/auth?tab=login"
            className="nav-link-glow flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {t("nav.login")}
          </Link>
          <Link
            href="/auth?tab=register"
            className="nav-link-glow flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t("nav.create_account")}
          </Link>
        </div>
      </div>

      <div className="md:hidden">
        <header className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 bg-bg/80 backdrop-blur-md border-b border-border">
          <Link href={homeHref} className="flex items-center gap-2 font-bold text-lg" aria-label="Fast Page Home">
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Fast Page</span>
          </Link>

          <div className="flex items-center gap-1">
            {!isStandalonePwa ? (
              <>
                <button
                  onClick={() => router.back()}
                  className="p-2 text-white/70 hover:text-white transition-colors active:scale-95"
                  aria-label="Go back"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="p-2 text-white/70 hover:text-white transition-colors active:scale-95"
                  aria-label="Go forward"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-full border border-white/20 bg-white/5 px-2 text-[10px] font-bold tracking-[0.08em] text-white transition hover:border-amber-300/45 hover:text-amber-200"
              aria-label={t("floating.toggleLanguage")}
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              className={`p-2 rounded-xl border transition-all duration-300 active:scale-95 ${
                isOpen
                  ? "text-amber-300 border-amber-400/60 bg-amber-400/15 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                  : "text-white border-transparent hover:text-amber-200 hover:border-amber-400/30 hover:bg-amber-400/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]"
              }`}
              onClick={() => setIsOpen((current) => !current)}
              aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </header>

        {isOpen
          ? createPortal(
              <div className="fixed inset-0 z-[100]">
                <button
                  className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar menu"
                />

                <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-[250px] border-r border-amber-400/25 bg-[linear-gradient(180deg,rgba(14,14,16,0.98),rgba(10,10,12,0.96))] px-5 pb-8 pt-24 shadow-[0_0_35px_rgba(251,191,36,0.2)] animate-in slide-in-from-left duration-300 overflow-y-auto">
                  <button
                    className="absolute top-4 right-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-2 text-amber-200 transition-colors hover:bg-amber-400/20"
                    onClick={() => setIsOpen(false)}
                    aria-label="Cerrar menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  {!isStandalonePwa ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleInstallFromMenu}
                        disabled={isInstallingApp}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/60 bg-amber-300/15 px-4 py-3 text-base font-black leading-tight text-amber-100 transition-all hover:border-amber-200 hover:bg-amber-300/25 disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        <Download className="h-4 w-4" />
                        {isInstallingApp ? (language === "en" ? "Installing..." : "Instalando...") : installLabel}
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-4">
                    <Link
                      href="/auth?tab=login"
                      className="w-full rounded-full border border-amber-300/60 bg-amber-300/10 py-3 text-center text-base font-bold text-amber-200 transition-all hover:bg-amber-300/20"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/auth?tab=register"
                      className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 py-3 text-center text-base font-black text-black transition-all hover:brightness-110"
                    >
                      {t("nav.create_account")}
                    </Link>
                  </div>
                </aside>
              </div>,
              document.body,
            )
          : null}
      </div>

      <IosInstallGuideModal open={showIosInstallGuide} onClose={() => setShowIosInstallGuide(false)} />
    </>
  );
}
