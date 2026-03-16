import type { Metadata } from "next";
import ClientLanding from "@/components/landing/ClientLanding";

export const metadata: Metadata = {
  title: "FastPagePro | Sistemas web premium para negocios",
  description:
    "FastPagePro disena sistemas web premium para restaurantes, hoteles, tiendas y negocios de servicios, con foco en conversion, velocidad y WhatsApp.",
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
  return <ClientLanding />;
}
