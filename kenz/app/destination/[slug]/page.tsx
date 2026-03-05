import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getDestinationBySlug(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    return { title: "Destination introuvable · Kenz" };
  }

  return {
    title: `${dest.name}, ${dest.country} · Voyage · Kenz`,
    description: dest.description,
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <Link
          href="/#explorations"
          className="inline-flex items-center gap-2 rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-muted hover:text-text-primary transition-colors"
        >
          <span>←</span> Retour
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <Image
          src={dest.imageUrl}
          alt={dest.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/40 to-black/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-6 pb-8 sm:pb-12">
            <div className="flex items-center gap-2 text-muted mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs sm:text-sm">{dest.country}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[0.95] mb-3 sm:mb-4">
              {dest.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-xl leading-relaxed">
              {dest.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-surface border border-stroke rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            {dest.stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted block mb-1 sm:mb-2">
                  {stat.label}
                </span>
                <span className="text-lg sm:text-2xl md:text-3xl font-semibold block">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {dest.gallery && dest.gallery.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-xl sm:text-2xl font-medium mb-6">
              <span className="font-display italic">Galerie</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {dest.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-stroke"
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="50vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More destinations */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-lg sm:text-xl font-medium mb-6">
            Autres <span className="font-display italic">destinations</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {destinations
              .filter((d) => d.slug !== slug)
              .slice(0, 4)
              .map((d) => (
                <Link
                  key={d.slug}
                  href={`/destination/${d.slug}`}
                  className="group relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-stroke"
                >
                  <Image
                    src={d.imageUrl}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <p className="text-xs sm:text-sm font-medium text-white">{d.name}</p>
                    <p className="text-[10px] sm:text-xs text-white/60">{d.country}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer link */}
      <div className="text-center pb-12 sm:pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text-primary transition-colors"
        >
          <span>←</span> Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
