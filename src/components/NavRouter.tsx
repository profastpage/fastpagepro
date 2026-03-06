"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import PublicNav from "@/components/nav/PublicNav";

const AppNav = dynamic(() => import("@/components/nav/AppNav"));

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

  return <AppNav />;
}
