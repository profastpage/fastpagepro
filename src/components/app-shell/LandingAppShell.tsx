"use client";

import PublicNav from "@/components/nav/PublicNav";
import { LandingLanguageProvider } from "@/context/LandingLanguageContext";

export default function LandingAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingLanguageProvider>
      <PublicNav />
      {children}
    </LandingLanguageProvider>
  );
}
