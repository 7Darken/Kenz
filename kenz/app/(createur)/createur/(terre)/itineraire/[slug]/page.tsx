/**
 * `/createur/itineraire/[slug]` : un voyage jour par jour (aujourd'hui la Chine, 14 jours), dans l'univers Créateur.
 * L'arrivée, « Jour par jour » (calendrier, jour ouvert, carte du trajet), les infos pratiques, la vidéo, le retour ;
 * la porte « abonnés » par-dessus. Les anciennes adresses `/itineraire/[slug]` y mènent (308, next.config.ts).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getItinerary, ITINERARY_SLUGS, type Itinerary } from "@/content/itineraries";
import { FOLLOW_MEDIA } from "@/content/series";
import { ROUTES, SITE_NAME, SITE_URL } from "@/content/site";
import { SOCIALS } from "@/content/socials";
import { ReturnDoor } from "@/design-system/components/return-door";
import { cityStops, Essentials, ItineraryHero, Planner, SubscribeGate, VideoSection } from "@/features/itineraire";
import { format } from "@/i18n/format";
import { pageMetadata } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";

interface ItinerairePageProps {
  params: Promise<{ slug: string }>;
}

/** Seuls les itinéraires connus existent : tout autre chemin est un 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return ITINERARY_SLUGS.map((slug) => ({ slug }));
}

/** « Pékin → Chongqing → Wulong → Shanghai » */
const routeOf = (itinerary: Itinerary) =>
  cityStops(itinerary)
    .map((stop) => stop.city.name.fr)
    .join(" → ");

export async function generateMetadata({ params }: ItinerairePageProps): Promise<Metadata> {
  const itinerary = getItinerary((await params).slug);
  if (!itinerary) return {};
  const { meta } = getDictionary().itineraire;
  const title = format(meta.title, { title: itinerary.title.fr, route: routeOf(itinerary) });
  return pageMetadata({
    title,
    description: itinerary.description.fr,
    path: ROUTES.itineraire(itinerary.slug),
    universe: "createur",
    image: { url: itinerary.thumbnail.src, width: itinerary.thumbnail.width, height: itinerary.thumbnail.height, alt: title },
  });
}

const abs = (path: string) => new URL(path, SITE_URL).href;

export default async function ItinerairePage({ params }: ItinerairePageProps) {
  const itinerary = getItinerary((await params).slug);
  if (!itinerary) notFound();
  const channel = SOCIALS["youtube-asie"].href;

  // Données structurées : le voyage, ses villes dans l'ordre, et son auteur (rien qui relie l'univers Pro).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: itinerary.title.fr,
    description: itinerary.description.fr,
    url: abs(ROUTES.itineraire(itinerary.slug)),
    image: abs(itinerary.thumbnail.src),
    provider: { "@type": "Person", name: SITE_NAME, url: abs(ROUTES.createur) },
    itinerary: {
      "@type": "ItemList",
      itemListElement: cityStops(itinerary).map((stop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "City", name: stop.city.name.fr },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ItineraryHero itinerary={itinerary} />
      <Planner itinerary={itinerary} />
      <Essentials itinerary={itinerary} />
      <VideoSection itinerary={itinerary} channel={channel} />
      <ReturnDoor variant="terre" label="voyage.retour.label" door="voyage.retour.door" />
      <SubscribeGate itinerary={itinerary} channel={channel} portrait={FOLLOW_MEDIA.portrait} />
    </>
  );
}
