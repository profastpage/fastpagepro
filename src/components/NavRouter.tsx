"use client";

import { usePathname } from "next/navigation";
import PublicNav from "@/components/nav/PublicNav";
import AppNavMount from "@/components/nav/AppNavMount";

export default function NavRouter() {
  const pathname = usePathname();

  if (
    pathname === "/auth" ||
    pathname === "/signup" ||
    pathname === "/demo" ||
    pathname.startsWith("/demo/") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/bio/")
  ) {
    return null;
  }

  if (pathname === "/") {
    return <PublicNav />;
  }

  return <AppNavMount />;
}
