import type { Metadata } from "next";
import LandingHomeEntry from "@/components/landing/LandingHomeEntry";

export const metadata: Metadata = {
  title: "FastPagePro Restaurantes | Pedidos por WhatsApp y carta digital premium",
  description:
    "Landing comercial de FastPagePro para restaurantes: carta digital, pedidos por WhatsApp y sistema web premium orientado a conversion.",
  openGraph: {
    title: "FastPagePro Restaurantes | Pedidos por WhatsApp y carta digital premium",
    description:
      "Landing comercial para restaurantes que quieren convertir visitas en pedidos por WhatsApp con una experiencia premium.",
    type: "website",
    url: "https://www.fastpagepro.com/restaurantes",
    siteName: "FastPagePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastPagePro Restaurantes | Pedidos por WhatsApp y carta digital premium",
    description: "Landing comercial para restaurantes con conversion orientada a WhatsApp.",
  },
  alternates: {
    canonical: "https://www.fastpagepro.com/restaurantes",
  },
};

export default function RestaurantsLandingPage() {
  return <LandingHomeEntry />;
}
