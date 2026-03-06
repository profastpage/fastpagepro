"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const LandingAppShell = dynamic(() => import("@/components/app-shell/LandingAppShell"));
const DefaultAppShell = dynamic(() => import("@/components/app-shell/DefaultAppShell"));

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <LandingAppShell>{children}</LandingAppShell>;
  }

  return <DefaultAppShell>{children}</DefaultAppShell>;
}
