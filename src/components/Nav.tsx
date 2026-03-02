"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { useCallback, useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useSubscription } from "@/hooks/useSubscription";
import PlanBadge from "@/components/subscription/PlanBadge";
import { ChevronLeft, ChevronRight, Zap, LogOut, Lock, Download } from "lucide-react";
import IosInstallGuideModal from "@/components/pwa/IosInstallGuideModal";

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

export default function Nav() {
  const { user: session, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [desktopLockedOpen, setDesktopLockedOpen] = useState<string | null>(null);
  const [mobileLockedOpen, setMobileLockedOpen] = useState<string | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallingApp, setIsInstallingApp] = useState(false);
  const [isStandalonePwa, setIsStandalonePwa] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const isEnglish = language === "en";
  const permissions = usePlanPermissions(Boolean(session?.uid));
  const { summary } = useSubscription(Boolean(session?.uid));
  const projectsUsageLabel =
    permissions.maxProjects == null
      ? `${permissions.usage.publishedProjects}`
      : `${permissions.usage.publishedProjects}/${permissions.maxProjects}`;
  const computedPlanDays = summary?.isBusinessTrial ? summary?.trialDaysRemaining : summary?.daysRemaining;
  const planDaysRemaining =
    summary?.status === "ACTIVE" ? Math.max(0, Number(computedPlanDays || 0)) : 0;
  const navStatusCopy = isEnglish
    ? {
        plan: "Plan:",
        projects: "Projects:",
        days: "Days left:",
        trial: (days: number) => `Business trial: ${days} days left.`,
      }
    : {
        plan: "Plan:",
        projects: "Proyectos:",
        days: "Dias restantes:",
        trial: (days: number) => `Prueba Business: ${days} dias restantes.`,
      };

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const prefetchRoute = useCallback(
    (href: string) => {
      if (!href) return;
      try {
        router.prefetch(href);
      } catch {
        // no-op: prefetch best-effort
      }
    },
    [router],
  );

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setDesktopLockedOpen(null);
    setMobileLockedOpen(null);
  }, [pathname]);

  // Lock scroll when menu is open
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

  const installLabel = isEnglish ? "Install app" : "Instalar app";
  const homeHref = isStandalonePwa ? "/auth" : "/";

  const handleInstallFromMenu = async () => {
    if (isStandalonePwa) return;
    if (!deferredInstallPrompt) {
      if (isIosDevice) {
        setShowIosInstallGuide(true);
        setIsOpen(false);
        return;
      }
      const message =
        "Si no ves el boton de instalacion, abre el menu del navegador y elige Instalar app.";
      window.alert(message);
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

  const navLinks = useMemo(() => {
    if (!session) {
      return [];
    }

    const isStarter = permissions.canonicalPlan === "starter";
    const isBusiness = permissions.canonicalPlan === "business";
    const isExpired = summary?.status === "EXPIRED";
    const starterLockedRoutes = new Set(["/builder", "/templates", "/cloner/web", "/store", "/metrics"]);
    const businessLockedRoutes = new Set(["/builder", "/templates", "/cloner/web"]);
    const expiredUnlockedRoutes = new Set(["/dashboard/billing", "/settings"]);

    const resolveLockHint = (href: string) => {
      if (isExpired && !expiredUnlockedRoutes.has(href)) {
        return isEnglish
          ? "Your active period ended. Renew in Billing to reactivate panels."
          : "Tu periodo activo termino. Renueva en Billing para reactivar paneles.";
      }
      if (["/builder", "/templates", "/cloner/web"].includes(href)) {
        return isEnglish ? "Available only on PRO plan." : "Disponible solo en plan PRO.";
      }
      return isEnglish ? "Available on Business or Pro." : "Disponible en Business o Pro.";
    };

    const resolveRequiredFeature = (href: string) => {
      if (["/builder", "/templates", "/cloner/web"].includes(href)) return "clonerAccess";
      if (href === "/store") return "fullStore";
      if (href === "/metrics") return "basicMetrics";
      return "";
    };

    const isLockedRoute = (href: string) => {
      if (isExpired && !expiredUnlockedRoutes.has(href)) return true;
      if (isStarter && starterLockedRoutes.has(href)) return true;
      if (isBusiness && businessLockedRoutes.has(href)) return true;
      return false;
    };

    const mapItem = (name: string, href: string, emoji = "") => ({
      name,
      href,
      emoji,
      locked: isLockedRoute(href),
      lockHint: resolveLockHint(href),
      requiredFeature: resolveRequiredFeature(href),
    });

    return [
      mapItem(t("nav.hub"), "/hub"),
      mapItem(t("nav.builder"), "/builder"),
      mapItem(t("nav.templates"), "/templates"),
      mapItem(t("nav.cloner"), "/cloner/web"),
      mapItem(t("nav.store"), "/store"),
      mapItem(t("nav.linkhub"), "/cartadigital"),
      mapItem(t("nav.published"), "/published"),
      mapItem(t("nav.metrics"), "/metrics"),
      mapItem("Billing", "/dashboard/billing"),
      mapItem(t("nav.settings"), "/settings"),
    ];
  }, [isEnglish, permissions.canonicalPlan, session, summary?.status, t]);

  useEffect(() => {
    if (!session) return;
    if (typeof window === "undefined") return;

    const routes = Array.from(
      new Set([
        "/hub",
        "/cartadigital",
        "/published",
        "/dashboard/billing",
        "/settings",
        ...navLinks.map((entry) => entry.href),
      ]),
    );

    const timers = routes.map((href, index) =>
      window.setTimeout(() => prefetchRoute(href), 80 + index * 55),
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [navLinks, prefetchRoute, session]);

  if (
    pathname === "/auth" ||
    pathname === "/signup" ||
    pathname === "/demo" ||
    pathname.startsWith("/demo/") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/bio/")
  ) return null;

  const planStatusBlock = session ? (
    <div className="rounded-2xl border border-amber-300/25 bg-black/70 px-3 py-2 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-300">{navStatusCopy.plan}</span>
        <PlanBadge plan={summary?.plan || "FREE"} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-200">
          {navStatusCopy.projects} {projectsUsageLabel}
        </span>
        <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
          {navStatusCopy.days} {planDaysRemaining}
        </span>
      </div>
      {summary?.isBusinessTrial ? (
        <p className="mt-2 text-[11px] font-semibold text-amber-200">
          {navStatusCopy.trial(Math.max(0, Number(summary?.trialDaysRemaining || 0)))}
        </p>
      ) : null}
    </div>
  ) : null;

  return (
    <>
      {/* Desktop Navigation Layout */}
      <div className="hidden md:block">
        {/* Logo - Top Left */}
        <div className="fixed top-8 left-8 z-50">
          {session ? (
            <div className="flex items-center gap-2 cursor-default" aria-label="Fast Page Home">
              <Zap className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]" />
              <span className="text-lg font-black tracking-tighter text-gold-gradient drop-shadow-sm">FAST PAGE</span>
            </div>
          ) : (
            <Link href={homeHref} className="flex items-center gap-2 group transition-all" aria-label="Fast Page Home">
              <Zap className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-black tracking-tighter text-gold-gradient drop-shadow-sm group-hover:brightness-110 transition-all">FAST PAGE</span>
            </Link>
          )}
        </div>

        {/* Center Minimalist Nav */}
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-transparent">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => {
                if (link.locked) {
                  const requiredFeature = String(link.requiredFeature || "");
                  const target = requiredFeature
                    ? `/dashboard/billing?requiredFeature=${requiredFeature}`
                    : "/dashboard/billing";
                  prefetchRoute(target);
                  setDesktopLockedOpen(link.href);
                  return;
                }
                prefetchRoute(link.href);
              }}
              onMouseLeave={() => link.locked && setDesktopLockedOpen((current) => (current === link.href ? null : current))}
            >
              {link.locked ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopLockedOpen((current) => (current === link.href ? null : link.href));
                      const requiredFeature = String(link.requiredFeature || "");
                      const target = requiredFeature
                        ? `/dashboard/billing?requiredFeature=${requiredFeature}`
                        : "/dashboard/billing";
                      router.push(target);
                    }}
                    className="nav-link-glow inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-400 transition-all hover:text-amber-200"
                    title={link.lockHint}
                  >
                    {link.name}
                    <Lock className="h-3.5 w-3.5 text-amber-300" />
                  </button>
                  <div
                    className={`absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-xl border border-amber-300/30 bg-black/95 px-3 py-2 text-[11px] font-semibold text-amber-100 shadow-2xl transition-opacity ${
                      desktopLockedOpen === link.href ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    {link.lockHint}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  prefetch
                  onMouseEnter={() => prefetchRoute(link.href)}
                  onFocus={() => prefetchRoute(link.href)}
                  className={`nav-link-glow text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${
                    pathname === link.href
                      ? "text-amber-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Auth - Top Right */}
        <div className="fixed top-8 right-8 z-50 flex max-w-[45vw] flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={t("floating.toggleLanguage")}
              className="inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-full border border-white/20 bg-white/5 px-3 text-[11px] font-bold tracking-[0.08em] text-white transition hover:border-amber-300/45 hover:text-amber-200"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            {!session ? (
              <>
                <Link
                  href="/auth?tab=login"
                  className="nav-link-glow flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {t("nav.create_account")}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="max-w-[14rem] truncate text-sm text-zinc-400 font-medium">{session.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-all duration-300 border border-red-500/20 group"
                  title={t("nav.logout")}
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t("nav.logout")}</span>
                </button>
              </div>
            )}
          </div>
          {planStatusBlock}
        </div>
      </div>

      {/* Mobile Navigation Layout */}
      <div className="md:hidden">
        <header className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 bg-bg/80 backdrop-blur-md border-b border-border">
          {session ? (
            <div className="flex items-center gap-2 font-bold text-lg cursor-default" aria-label="Fast Page Home">
              <Zap className="w-6 h-6 text-amber-400" />
              <span>Fast Page</span>
            </div>
          ) : (
            <Link href={homeHref} className="flex items-center gap-2 font-bold text-lg" aria-label="Fast Page Home">
              <Zap className="w-6 h-6 text-amber-400" />
              <span>Fast Page</span>
            </Link>
          )}

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
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay - Portaled to body to avoid clipping */}
        {isOpen &&
          createPortal(
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {session ? <div className="mb-4">{planStatusBlock}</div> : null}

                <div className="flex flex-col gap-2.5">
                  {navLinks.map((link) => (
                    <div key={link.href} className="space-y-2">
                      {link.locked ? (
                        <>
                          <button
                            type="button"
                            onTouchStart={() => {
                              const requiredFeature = String(link.requiredFeature || "");
                              const target = requiredFeature
                                ? `/dashboard/billing?requiredFeature=${requiredFeature}`
                                : "/dashboard/billing";
                              prefetchRoute(target);
                            }}
                            onClick={() => {
                              setMobileLockedOpen((current) => (current === link.href ? null : link.href));
                              const requiredFeature = String(link.requiredFeature || "");
                              const target = requiredFeature
                                ? `/dashboard/billing?requiredFeature=${requiredFeature}`
                                : "/dashboard/billing";
                              router.push(target);
                            }}
                            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-lg font-semibold leading-tight text-white transition-all hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-100"
                          >
                            <span>{link.name}</span>
                            <Lock className="h-4 w-4 text-amber-300" />
                          </button>
                          {mobileLockedOpen === link.href ? (
                            <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
                              {link.lockHint}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          prefetch
                          onTouchStart={() => prefetchRoute(link.href)}
                          className="flex w-full items-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-lg font-semibold leading-tight text-white transition-all hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-100"
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {!isStandalonePwa ? (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleInstallFromMenu}
                      disabled={isInstallingApp}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/60 bg-amber-300/15 px-4 py-3 text-base font-black leading-tight text-amber-100 transition-all hover:border-amber-200 hover:bg-amber-300/25 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <Download className="h-4 w-4" />
                      {isInstallingApp ? (isEnglish ? "Installing..." : "Instalando...") : installLabel}
                    </button>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-4">
                  {!session ? (
                    <>
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
                    </>
                  ) : (
                    <button
                      onClick={logout}
                      className="flex items-center justify-center gap-3 w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-all active:scale-95"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold uppercase tracking-wider">{t("nav.logout")}</span>
                    </button>
                  )}
                </div>
              </aside>
            </div>,
            document.body,
          )}
      </div>
      <IosInstallGuideModal open={showIosInstallGuide} onClose={() => setShowIosInstallGuide(false)} />
    </>
  );
}
