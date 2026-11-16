import type { MetadataRoute } from "next";

/* Manifeste de l'application web : sert quand on ajoute le site à l'écran d'accueil (icône, nom, couleur).
   Next le sert sur /manifest.webmanifest et le relie à chaque page. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kenz",
    short_name: "Kenz",
    description: "Kenz : des apps où l'IA fait le vrai travail, du voyage en Asie et du sport.",
    lang: "fr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0E1220",
    theme_color: "#0E1220",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
