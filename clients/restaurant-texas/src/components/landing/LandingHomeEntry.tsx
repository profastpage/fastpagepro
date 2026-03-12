"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import LandingHome from "@/components/landing/LandingHome";
import { auth } from "@/lib/firebase";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function LandingHomeEntry() {
  const router = useRouter();
  const [canRenderLanding, setCanRenderLanding] = useState(false);

  useEffect(() => {
    if (!isStandaloneMode()) {
      setCanRenderLanding(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      router.replace(user ? "/hub" : "/auth");
    });
    return () => unsubscribe();
  }, [router]);

  if (!canRenderLanding) {
    return <div className="min-h-screen bg-black" />;
  }

  return <LandingHome />;
}

