import type { Metadata } from "next";
import LandingHome from "@/components/landing/LandingHome";

export const metadata: Metadata = {
  title: "FastPage | Crea, Clona y Vende en una sola plataforma",
  description:
    "FastPage te permite crear con Builder, usar Templates, clonar páginas, vender con Online Store, publicar Carta Digital y medir con Pro Metrics.",
  openGraph: {
    title: "FastPage | Crea, Clona y Vende",
    description:
      "Lanza proyectos no-code con Builder, Templates, Cloner, Online Store, Carta Digital, IA y Pro Metrics.",
    type: "website",
    url: "https://fastpagespro.com",
    siteName: "FastPage",
  },
  alternates: {
    canonical: "https://fastpagespro.com",
  },
};

export default function HomePage() {
  return <LandingHome />;
}
