import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";

const statPositions = [
  "md:-left-28 md:-top-4",
  "md:-right-28 md:-top-6",
  "md:-left-32 md:bottom-2",
  "md:-right-30 md:bottom-0",
  "md:-left-10 md:-bottom-16",
  "md:-right-10 md:-bottom-16",
] as const;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
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
    return {
      title: "Projet introuvable · Kenz",
    };
  }

  return {
    title: `${project.name} · Projet · Kenz`,
    description: project.detail?.subheadline ?? project.description,
    openGraph: {
      title: project.name,
      description: project.detail?.subheadline ?? project.description,
      images: project.thumbnail
        ? [
            {
              url: project.thumbnail,
              width: 1200,
              height: 630,
              alt: `${project.name} thumbnail`,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.detail) {
    notFound();
  }

  const { detail } = project;
  const accentColor = project.glowColor ?? "#2563eb";
  const stats = detail.stats ?? [];
  const overviewItems = detail.overview ?? [];
  const tags = detail.tags ?? [];

  return (
    <div className="flex flex-col gap-16 pb-24">
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-2 text-sm text-[color:color-mix(in_srgb,var(--muted)_80%,transparent)]"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--border)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--card)_55%,transparent)] px-3 py-1.5 font-medium text-[color:color-mix(in_srgb,var(--muted)_70%,transparent)] transition-all hover:-translate-y-[1px] hover:text-[var(--foreground)]"
        >
          Accueil
        </Link>
        <span className="text-[color:color-mix(in_srgb,var(--muted)_70%,transparent)]">/</span>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium text-[color:color-mix(in_srgb,var(--muted)_70%,transparent)] transition-all hover:-translate-y-[1px] hover:text-[var(--foreground)]"
        >
          Projets
        </Link>
        <span className="text-[color:color-mix(in_srgb,var(--muted)_70%,transparent)]">/</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--foreground)_10%,transparent)] px-3 py-1.5 font-medium text-[var(--foreground)]">
          {project.name}
        </span>
      </nav>

      <section className="relative overflow-hidden rounded-3xl px-6 py-16 sm:px-12 lg:px-16">

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-14 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="text-xs uppercase tracking-[0.42em] text-[color:color-mix(in_srgb,var(--muted)_88%,transparent)]">
              {project.period}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              {project.name}
            </h1>
            <p className="max-w-3xl text-lg text-[color:color-mix(in_srgb,var(--muted)_80%,transparent)]">
              {detail.subheadline ?? detail.headline}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:color-mix(in_srgb,var(--border)_65%,transparent)] bg-[color:color-mix(in_srgb,var(--card)_55%,transparent)] px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[color:color-mix(in_srgb,var(--muted)_75%,transparent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-[560px] md:h-[420px]">
            <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[220px]">
              <div
                className="absolute inset-0 rounded-[2.2rem]"
                style={{
                  background: `${accentColor}22`,
                  filter: "blur(60px)",
                  transform: "scale(1.25)",
                }}
              />
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-[color:color-mix(in_srgb,var(--border)_55%,transparent)] bg-[color:color-mix(in_srgb,var(--background)_60%,transparent)] shadow-[0_24px_40px_rgba(8,8,8,0.35)]">
                <Image
                  src={project.thumbnail}
                  alt={`${project.name} aperçu`}
                  fill
                  sizes="(max-width: 768px) 60vw, 220px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className={`mt-10 flex w-full max-w-[220px] flex-col gap-2 rounded-2xl border border-[color:color-mix(in_srgb,var(--border)_55%,transparent)] bg-[color:color-mix(in_srgb,var(--card)_60%,transparent)] px-5 py-4 text-left shadow-[0_18px_38px_rgba(10,10,10,0.18)] backdrop-blur-xl md:absolute ${
                  statPositions[index] ?? ""
                } md:mt-0`}
                style={{
                  boxShadow: stat.accentColor
                    ? `0 18px 48px ${stat.accentColor}33`
                    : "0 18px 48px rgba(12, 12, 12, 0.22)",
                }}
              >
                <span className="text-xs uppercase tracking-[0.32em] text-[color:color-mix(in_srgb,var(--muted)_80%,transparent)]">
                  {stat.label}
                </span>
                <span className="text-3xl font-semibold text-[var(--foreground)]">
                  {stat.value}
                </span>
                {stat.description ? (
                  <span className="text-sm text-[color:color-mix(in_srgb,var(--muted)_85%,transparent)]">
                    {stat.description}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mx-auto grid w-full max-w-4xl gap-10 text-left md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Vision produit</h2>
              <p className="text-[color:color-mix(in_srgb,var(--muted)_78%,transparent)]">
                {detail.headline}
              </p>
              <ul className="mt-4 space-y-3 text-[color:color-mix(in_srgb,var(--muted)_78%,transparent)]">
                {overviewItems.map((point) => (
                  <li key={point} className="relative pl-5">
                    <span className="absolute left-0 top-2 h-2 w-2 rounded-full" style={{ background: accentColor }} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="flex flex-col gap-4 rounded-2xl border border-[color:color-mix(in_srgb,var(--border)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--card)_50%,transparent)] p-6 shadow-[0_16px_34px_rgba(10,10,10,0.24)]">
              <h3 className="text-sm uppercase tracking-[0.32em] text-[color:color-mix(in_srgb,var(--muted)_85%,transparent)]">
                Ressources
              </h3>
              <div className="flex flex-col gap-2 text-sm text-[color:color-mix(in_srgb,var(--muted)_80%,transparent)]">
                {project.liveUrl ? (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:color-mix(in_srgb,var(--foreground)_12%,transparent)] px-4 py-2 font-medium text-[var(--foreground)] transition-transform hover:-translate-y-[2px]"
                  >
                    Voir le produit
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ) : null}
                {project.repoUrl ? (
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:color-mix(in_srgb,var(--foreground)_12%,transparent)] px-4 py-2 font-medium text-[var(--foreground)] transition-transform hover:-translate-y-[2px]"
                  >
                    Code source
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ) : null}
                {project.socials?.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between gap-3 rounded-2xl border border-[color:color-mix(in_srgb,var(--border)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--background)_70%,transparent)] px-4 py-3 transition-all hover:-translate-y-[2px] hover:border-[color:color-mix(in_srgb,var(--foreground)_25%,transparent)]"
                  >
                    <span className="font-medium text-[var(--foreground)]">{link.label}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
