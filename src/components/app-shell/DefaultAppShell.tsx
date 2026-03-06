"use client";

import DeferredGlobalEnhancements from "@/components/DeferredGlobalEnhancements";
import NavRouter from "@/components/NavRouter";
import { LanguageProvider } from "@/context/LanguageContext";

export default function DefaultAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <NavRouter />
      {children}
      <DeferredGlobalEnhancements />
    </LanguageProvider>
  );
}
