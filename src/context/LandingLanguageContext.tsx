"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LandingLanguage = "es" | "en" | "pt";

type LandingLanguageContextValue = {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
};

const DEFAULT_LANGUAGE: LandingLanguage = "en";
const STORAGE_KEY = "language";

const LandingLanguageContext = createContext<LandingLanguageContextValue | undefined>(
  undefined,
);

function isSupportedLanguage(value: string): value is LandingLanguage {
  return value === "es" || value === "en" || value === "pt";
}

export function LandingLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<LandingLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage: LandingLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem(STORAGE_KEY, nextLanguage);
      },
    }),
    [language],
  );

  return (
    <LandingLanguageContext.Provider value={value}>
      {children}
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage() {
  const context = useContext(LandingLanguageContext);
  if (!context) {
    throw new Error("useLandingLanguage must be used within a LandingLanguageProvider");
  }
  return context;
}

export function useOptionalLandingLanguage() {
  return useContext(LandingLanguageContext);
}
