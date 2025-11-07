import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { destinationDetails, getDestinationDetail } from "@/data/destination-details";
import { destinations } from "@/data/destinations";
import { DestinationDetailView } from "@/components/destination/destination-detail";

const detailList = Object.values(destinationDetails);

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return detailList.map((detail) => ({ slug: detail.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getDestinationDetail(slug);

  if (!detail) {
    return {
      title: "Destination introuvable · Kenz",
    };
  }

  const destination = destinations.find((item) => item.slug === detail.slug);

  return {
    title: `${detail.title} · Destination · Kenz`,
    description: destination?.description ?? detail.description,
    openGraph: {
      title: detail.title,
      description: destination?.description ?? detail.description,
      images: [
        {
          url: detail.heroImage,
          width: 1800,
          height: 1013,
          alt: `${detail.title} hero image`,
        },
      ],
    },
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = getDestinationDetail(slug);

  if (!detail) {
    notFound();
  }

  return <DestinationDetailView detail={detail} />;
}
