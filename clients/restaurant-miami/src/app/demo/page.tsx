import type { Metadata } from "next";
import DemoHub from "@/components/demo/DemoHub";

export const metadata: Metadata = {
  title: "FastPage Demo Hub | Ver demos sin registro",
  description:
    "Explora demos reales de Carta Digital, Tienda Online y Landing de Servicios sin crear cuenta.",
  alternates: {
    canonical: "https://www.fastpagepro.com/demo",
  },
  openGraph: {
    title: "FastPage Demo Hub",
    description:
      "Demo-first: revisa ejemplos por rubro y crea tu version cuando estes listo.",
    url: "https://www.fastpagepro.com/demo",
    type: "website",
  },
};

export default function DemoPage() {
  return <DemoHub />;
}
