"use client";

import { useEffect } from "react";

const APP_SW_URL = "/sw.js";

export default function PwaServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register(APP_SW_URL, { scope: "/" });
      } catch (error) {
        console.warn("[PWA] service worker registration warning:", error);
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}

