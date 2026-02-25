"use client";

import { useEffect } from "react";

const CLEANUP_KEY = "fp_sw_cleanup_v1";

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyDone = window.localStorage.getItem(CLEANUP_KEY) === "done";
    if (alreadyDone) return;

    const runCleanup = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
      } catch (error) {
        console.warn("[SW Cleanup] unregister warning:", error);
      }

      try {
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }
      } catch (error) {
        console.warn("[SW Cleanup] cache delete warning:", error);
      }

      window.localStorage.setItem(CLEANUP_KEY, "done");
    };

    void runCleanup();
  }, []);

  return null;
}
