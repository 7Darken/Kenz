/** `/apps/[slug]` : l'histoire d'une app (6 apps mobiles et Escapades Libres). Module « 54 h et pages des apps ». */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { APP_SLUGS, getApp } from "@/content/apps";
import { ROUTES } from "@/content/site";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../../../_components/route-placeholder";

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

/** Seuls les 7 slugs connus existent : tout autre chemin est un 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return APP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  const { meta } = getDictionary().apps;
  return pageMetadata({
    title: format(meta.title, { app: app.name }),
    description: meta.description,
    path: ROUTES.app(app.slug),
    universe: "pro",
  });
}

export default async function AppPage({ params }: AppPageProps) {
  const app = getApp((await params).slug);
  if (!app) notFound();
  return <RoutePlaceholder title={{ value: { fr: app.name, en: app.name } }} lead={{ k: "apps.meta.description" }} />;
}
