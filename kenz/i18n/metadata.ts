/**
 * Métadonnées d'une route (titre, description, URL canonique, Open Graph, Twitter), en français :
 * la langue de base du rendu serveur. Les textes viennent du dictionnaire (`<espace>.meta`).
 */
import type { Metadata } from "next";

import { SHARE_IMAGES, SITE_NAME, type Universe } from "@/content/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Chemin canonique, ex. « /agents ». */
  path: string;
  universe: Universe;
}

export function pageMetadata({ title, description, path, universe }: PageMetadataInput): Metadata {
  const image = SHARE_IMAGES[universe];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "fr_FR",
      alternateLocale: ["en_GB"],
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
