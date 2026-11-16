/**
 * Métadonnées d'une route (titre, description, URL canonique, Open Graph, Twitter), en français :
 * la langue de base du rendu serveur. Les textes viennent du dictionnaire (`<espace>.meta`).
 *
 * Pas de hreflang ni d'`og:locale:alternate` : l'anglais n'est qu'un basculement côté client (`?lang=en` sert le
 * même HTML français, canonique vers la page FR), donc aucune URL ne sert de version anglaise aux moteurs.
 * Les `meta` anglais des dictionnaires attendent une vraie route EN ; il faudra alors déclarer les alternates.
 */
import type { Metadata } from "next";

import { SHARE_IMAGES, SITE_NAME, type Universe } from "@/content/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Chemin canonique, ex. « /agents ». */
  path: string;
  universe: Universe;
  /** L'image de partage propre à la page (sinon celle de l'univers). */
  image?: (typeof SHARE_IMAGES)[Universe];
}

export function pageMetadata({ title, description, path, universe, image = SHARE_IMAGES[universe] }: PageMetadataInput): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "fr_FR",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
