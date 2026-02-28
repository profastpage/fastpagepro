import "./globals.css"
import Nav from "@/components/Nav"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { LanguageProvider } from "@/context/LanguageContext"
import FloatingControls from "@/components/FloatingControls"
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup"
import LuxuryCursorEffect from "@/components/LuxuryCursorEffect"

export const metadata = {
  title: "Fast Page",
  description: "Creador y clonador de landing pages"
}

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
            <ServiceWorkerCleanup />
            <Nav />
            {children}
            <FloatingControls />
            <LuxuryCursorEffect />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
