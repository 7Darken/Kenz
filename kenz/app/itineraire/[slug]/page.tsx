import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItineraryView } from "@/components/itinerary/itinerary-view";
import { getCityStops, getItinerary, itineraries } from "@/data/itineraries";

type PageProps = { params: Promise<{ slug: string }> };

const SITE_URL = "https://kenzenbien.fr";

export const dynamicParams = false;

export function generateStaticParams() {
  return itineraries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = getItinerary(slug);
  if (!itinerary) return {};

  const route = getCityStops(itinerary)
    .map((stop) => stop.city.name.fr)
    .join(" → ");
  const title = `${itinerary.title.fr} : ${route}`;
  const description = itinerary.description.fr;
  const url = `/itineraire/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: itinerary.thumbnail, width: 1280, height: 720, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [itinerary.thumbnail],
    },
  };
}

export default async function ItineraryPage({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = getItinerary(slug);
  if (!itinerary) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: itinerary.title.fr,
    description: itinerary.description.fr,
    url: `${SITE_URL}/itineraire/${slug}`,
    image: `${SITE_URL}${itinerary.thumbnail}`,
    provider: { "@type": "Person", name: "Kenz Narainen", url: SITE_URL },
    itinerary: {
      "@type": "ItemList",
      itemListElement: getCityStops(itinerary).map((stop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "City", name: stop.city.name.fr },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ItineraryView slug={slug} />
    </>
  );
}
