import type { Metadata } from "next";
import LandingHomeEntry from "@/components/landing/LandingHomeEntry";

export const metadata: Metadata = {
  title: "FastPage | Crea paginas que convierten clientes por WhatsApp",
  description:
    "FastPage es un sistema de crecimiento para Latam: landing pages, carta digital, tienda online, IA y metricas para vender mas por WhatsApp.",
  openGraph: {
    title: "FastPage | Convierte visitas en clientes por WhatsApp",
    description:
      "Crea, vende y escala con Builder, Online Store, Carta Digital, IA y Pro Metrics en una sola plataforma.",
    type: "website",
    url: "https://www.fastpagepro.com",
    siteName: "FastPage",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastPage | Sistema de crecimiento para negocios en Latam",
    description:
      "Lanza activos que convierten y cierra por WhatsApp con metricas reales.",
  },
  alternates: {
    canonical: "https://www.fastpagepro.com",
  },
};

export default function HomePage() {
  return <LandingHomeEntry />;
}
