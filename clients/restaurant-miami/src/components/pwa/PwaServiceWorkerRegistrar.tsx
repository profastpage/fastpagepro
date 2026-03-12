"use client";

import { useEffect } from "react";

const APP_SW_URL = "/sw.js";
const FORCE_UPDATE_INTERVAL_MS = 60 * 1000;

export default function PwaServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let hasReloadedOnControllerChange = false;

    const askWorkerToSkipWaiting = (worker: ServiceWorker | null | undefined) => {
      if (!worker) return;
      worker.postMessage({ type: "SKIP_WAITING" });
    };

    const wireRegistration = (registration: ServiceWorkerRegistration) => {
      askWorkerToSkipWaiting(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") {
            askWorkerToSkipWaiting(registration.waiting || installingWorker);
          }
        });
      });
    };

    const onControllerChange = () => {
      if (hasReloadedOnControllerChange) return;
      hasReloadedOnControllerChange = true;
      window.location.reload();
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(APP_SW_URL, {
          scope: "/",
          updateViaCache: "none",
        });
        wireRegistration(registration);
        await registration.update();
      } catch (error) {
        console.warn("[PWA] service worker registration warning:", error);
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    void registerServiceWorker();

    const intervalId = window.setInterval(() => {
      void navigator.serviceWorker.getRegistration(APP_SW_URL).then((registration) => {
        if (!registration) return;
        wireRegistration(registration);
        void registration.update();
      });
    }, FORCE_UPDATE_INTERVAL_MS);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
