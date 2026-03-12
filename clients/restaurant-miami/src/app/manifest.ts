import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fast Page",
    short_name: "FastPage",
    description:
      "Descarga Fast Page para entrar rapido a tu cuenta, mantener sesion activa y abrir directo al Hub.",
    start_url: "/app?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070707",
    theme_color: "#f5d287",
    categories: ["business", "productivity", "marketing"],
    lang: "es",
    icons: [
      {
        src: "/pwa/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/pwa/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
