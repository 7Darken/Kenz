import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Projet introuvable · Kenz" };
  }

  return {
    title: `${project.name} · Projet · Kenz`,
    description: project.detail?.subheadline ?? project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.detail) {
    notFound();
  }

  const { detail } = project;
  const accentColor = project.glowColor ?? "#4E85BF";
  const stats = detail.stats ?? [];
  const overviewItems = detail.overview ?? [];

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-muted hover:text-text-primary transition-colors"
        >
          <span>←</span> Retour
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted mb-4 block">
            {project.period}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 sm:mb-6">
            {project.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mx-auto mb-8 sm:mb-12">
            {detail.subheadline ?? detail.headline}
          </p>

          {/* App thumbnail */}
          <div className="relative mx-auto w-40 sm:w-52 md:w-60 aspect-square mb-8 sm:mb-12">
            <div
              className="absolute inset-0 rounded-[2rem] blur-[60px] scale-125"
              style={{ background: `${accentColor}30` }}
            />
            <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden border border-stroke bg-surface shadow-2xl shadow-black/30">
              <Image
                src={project.thumbnail}
                alt={project.name}
                fill
                sizes="(max-width: 640px) 160px, 240px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {project.socials?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 rounded-full text-sm"
              >
                <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative bg-surface border border-stroke rounded-full px-5 py-2.5 inline-flex items-center gap-2 group-hover:border-transparent transition-colors">
                  {link.icon && (
                    <Image src={link.icon} alt="" width={16} height={16} className="w-4 h-4" />
                  )}
                  {link.label} {link.title && `· ${link.title}`}
                  <span className="text-xs">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-stroke rounded-2xl p-4 sm:p-6"
              style={{
                boxShadow: stat.accentColor
                  ? `0 12px 40px ${stat.accentColor}20`
                  : undefined,
              }}
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted block mb-2">
                {stat.label}
              </span>
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-semibold block mb-1"
                style={{ color: stat.accentColor || 'inherit' }}
              >
                {stat.value}
              </span>
              {stat.description && (
                <span className="text-[10px] sm:text-xs text-muted">{stat.description}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 sm:mb-6">
            Vision <span className="font-display italic">produit</span>
          </h2>
          <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8 leading-relaxed">
            {detail.headline}
          </p>
          <ul className="space-y-3 sm:space-y-4">
            {overviewItems.map((point) => (
              <li key={point} className="flex gap-3 text-sm sm:text-base text-muted">
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-2"
                  style={{ background: accentColor }}
                />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer link */}
      <div className="text-center pb-16 sm:pb-24">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text-primary transition-colors"
        >
          <span>←</span> Retour aux projets
        </Link>
      </div>
    </div>
  );
}
