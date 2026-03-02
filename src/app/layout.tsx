import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import FloatingControls from "@/components/FloatingControls";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";
import LuxuryCursorEffect from "@/components/LuxuryCursorEffect";
import PwaServiceWorkerRegistrar from "@/components/pwa/PwaServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "Fast Page",
  description: "Creador y clonador de landing pages",
  manifest: "/manifest.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070707" },
    { color: "#f5d287" },
  ],
  appleWebApp: {
    capable: true,
    title: "Fast Page",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/pwa/icon-192.svg",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="overflow-x-hidden overscroll-x-none">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <LanguageProvider>
            <PwaServiceWorkerRegistrar />
            <ServiceWorkerCleanup />
            <Nav />
            {children}
            <FloatingControls />
            <LuxuryCursorEffect />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
