import type { Metadata } from "next";
import ClientLanding from "@/components/landing/ClientLanding";

export const metadata: Metadata = {
  title: "FastPagePro | Sistemas web para reservas y ventas por WhatsApp",
  description:
    "Agencia digital especializada en sistemas web premium para hoteles, restaurantes y negocios que quieren recibir reservas, consultas y ventas por WhatsApp.",
  openGraph: {
    title: "FastPagePro | Sistemas web para reservas y ventas por WhatsApp",
    description:
      "Creamos sistemas web premium que convierten visitas en reservas, consultas y ventas directas por WhatsApp.",
    type: "website",
    url: "https://www.fastpagepro.com",
    siteName: "FastPagePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastPagePro | Sistemas web para reservas y ventas por WhatsApp",
    description:
      "Agencia digital para negocios que quieren mas reservas y ventas por WhatsApp.",
  },
  alternates: {
    canonical: "https://www.fastpagepro.com",
  },
};

export default function HomePage() {
  return <ClientLanding />;
}
