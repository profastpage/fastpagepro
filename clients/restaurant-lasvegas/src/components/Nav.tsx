"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Nav() {
  const pathname = usePathname();

  // Lo casteo a any para no pelear con el tipo exacto de tu contexto
  const langCtx: any = useLanguage?.() ?? {};
  const language: string = langCtx.language ?? "es";
  const toggleLanguage: (() => void) | undefined = langCtx.toggleLanguage;

  const isAuth = useMemo(() => pathname?.startsWith("/auth"), [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        {/* Logo (tu script copia a /public/logo.png) */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language */}
          <button
            type="button"
            onClick={() => toggleLanguage?.()}
            className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            aria-label="Cambiar idioma"
          >
            {language === "es" ? "EN" : "ES"}
          </button>

          {/* Auth links (simples y seguros, sin providers) */}
          {!isAuth && (
            <>
              <Link
                href="/auth?tab=login"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/auth?tab=register"
                className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/20"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}