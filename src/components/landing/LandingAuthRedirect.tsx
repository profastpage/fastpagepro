"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function LandingAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;

    void (async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase"),
      ]);
      if (!active) return;

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (isStandaloneMode()) {
          router.replace(user ? "/hub" : "/auth");
          return;
        }

        if (user) {
          router.replace("/hub");
        }
      });
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [router]);

  return null;
}
