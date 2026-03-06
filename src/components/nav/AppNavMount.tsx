"use client";

import dynamic from "next/dynamic";

const AppNav = dynamic(() => import("@/components/nav/AppNav"));

export default function AppNavMount() {
  return <AppNav />;
}
