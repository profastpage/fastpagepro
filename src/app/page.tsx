import type { Metadata } from "next";
import LandingHomeEntry from "@/components/landing/LandingHomeEntry";

export const metadata: Metadata = {
  title: "FastPagePro | Sistemas web premium que generan clientes por WhatsApp",
  description:
    "FastPagePro crea paginas web y sistemas web premium para hoteles, restaurantes, tiendas y servicios, con enfoque en reservas, pedidos y clientes por WhatsApp.",
  openGraph: {
    title: "FastPagePro | Sistemas web premium para negocios",
    description:
      "Creamos sistemas web premium para negocios que quieren captar reservas, pedidos y clientes por WhatsApp.",
    type: "website",
    url: "https://www.fastpagepro.com",
    siteName: "FastPagePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastPagePro | Sistemas web premium para negocios",
    description:
      "Paginas web y sistemas hechos a medida para vender por WhatsApp.",
  },
  alternates: {
    canonical: "https://www.fastpagepro.com",
  },
};

export default function HomePage() {
  return <LandingHomeEntry />;
}
