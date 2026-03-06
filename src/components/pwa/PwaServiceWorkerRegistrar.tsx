"use client";

import { useEffect } from "react";

const APP_SW_URL = "/sw.js";
const FORCE_UPDATE_INTERVAL_MS = 60 * 1000;

export default function PwaServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let hasReloadedOnControllerChange = false;
    let idleCallbackId: number | null = null;
    let loadTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let removeLoadListener: (() => void) | null = null;
    const browserWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

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

    const scheduleRegistration = () => {
      if (typeof browserWindow.requestIdleCallback === "function") {
        idleCallbackId = browserWindow.requestIdleCallback(() => {
          void registerServiceWorker();
        }, { timeout: 5000 });
        return;
      }

      loadTimeoutId = globalThis.setTimeout(() => {
        void registerServiceWorker();
      }, 1500);
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    if (document.readyState === "complete") {
      scheduleRegistration();
    } else {
      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        scheduleRegistration();
      };
      window.addEventListener("load", onLoad);
      removeLoadListener = () => window.removeEventListener("load", onLoad);
    }

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
      removeLoadListener?.();
      if (
        idleCallbackId !== null &&
        typeof browserWindow.cancelIdleCallback === "function"
      ) {
        browserWindow.cancelIdleCallback(idleCallbackId);
      }
      if (loadTimeoutId !== null) {
        globalThis.clearTimeout(loadTimeoutId);
      }
    };
  }, []);

  return null;
}
