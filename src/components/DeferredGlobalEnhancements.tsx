"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const FloatingControls = dynamic(() => import("@/components/FloatingControls"), {
  ssr: false,
});
const ServiceWorkerCleanup = dynamic(() => import("@/components/ServiceWorkerCleanup"), {
  ssr: false,
});
const LuxuryCursorEffect = dynamic(() => import("@/components/LuxuryCursorEffect"), {
  ssr: false,
});
const PwaServiceWorkerRegistrar = dynamic(
  () => import("@/components/pwa/PwaServiceWorkerRegistrar"),
  {
    ssr: false,
  },
);

export default function DeferredGlobalEnhancements() {
  const pathname = usePathname();
  const shouldMountPwaRuntime = pathname !== "/";

  return (
    <>
      {shouldMountPwaRuntime ? <PwaServiceWorkerRegistrar /> : null}
      {shouldMountPwaRuntime ? <ServiceWorkerCleanup /> : null}
      <FloatingControls />
      <LuxuryCursorEffect />
    </>
  );
}
