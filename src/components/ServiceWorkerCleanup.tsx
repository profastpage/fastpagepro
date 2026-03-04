"use client";

import { useEffect } from "react";

const CLEANUP_KEY = "fp_sw_cleanup_v2";
const ACTIVE_PWA_SW_PATH = "/sw.js";
const PWA_CACHE_PREFIX = "fastpage-pwa-";
const CLEANUP_TTL_MS = 5 * 60 * 1000;

function resolveScriptURL(registration: ServiceWorkerRegistration): string {
  return (
    registration.active?.scriptURL ||
    registration.waiting?.scriptURL ||
    registration.installing?.scriptURL ||
    ""
  );
}

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastRun = Number(window.localStorage.getItem(CLEANUP_KEY) || 0);
    const shouldSkip = Number.isFinite(lastRun) && Date.now() - lastRun < CLEANUP_TTL_MS;
    if (shouldSkip) return;

    const runCleanup = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const staleRegistrations = registrations.filter(
            (registration) => !resolveScriptURL(registration).includes(ACTIVE_PWA_SW_PATH),
          );
          await Promise.all(
            staleRegistrations.map((registration) => registration.unregister()),
          );
        }
      } catch (error) {
        console.warn("[SW Cleanup] unregister warning:", error);
      }

      try {
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          const staleCaches = cacheKeys.filter(
            (key) => !key.startsWith(PWA_CACHE_PREFIX),
          );
          await Promise.all(staleCaches.map((key) => caches.delete(key)));
        }
      } catch (error) {
        console.warn("[SW Cleanup] cache delete warning:", error);
      }

      window.localStorage.setItem(CLEANUP_KEY, String(Date.now()));
    };

    void runCleanup();
  }, []);

  return null;
}
