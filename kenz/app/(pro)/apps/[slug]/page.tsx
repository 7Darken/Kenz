/** `/apps/[slug]` : l'histoire d'une app (6 apps mobiles et Escapades Libres). Module « 54 h et pages des apps ». */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { APP_SLUGS, getApp } from "@/content/apps";
import { ROUTES } from "@/content/site";
import { AppDetail } from "@/features/app-detail";
import { format } from "@/i18n/format";
import { pageMetadata } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

/** Seuls les 7 slugs connus existent : tout autre chemin est un 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return APP_SLUGS.map((slug) => ({ slug }));
}

/** L'accroche de l'app, sans ses marques de mot mis en valeur (« *cuisiner* » → « cuisiner »). */
const plain = (text: string) => text.replace(/\*/g, "");

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  const path = ROUTES.app(app.slug);
  const { meta } = getDictionary("fr").apps;
  const base = pageMetadata({
    title: format(meta.title, { app: app.name }),
    description: `${plain(app.story.hook.fr)} ${meta.description}`,
    path,
    universe: "pro",
  });
  // Le rendu serveur est en français ; l'anglais se partage avec ?lang=en (même page, traduite au client).
  return {
    ...base,
    alternates: { canonical: path, languages: { fr: path, en: `${path}?lang=en` } },
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const app = getApp((await params).slug);
  if (!app) notFound();
  // Une app à la suivante (« L'histoire suivante ») : une page neuve, son arrivée se rejoue.
  return <AppDetail key={app.slug} app={app} />;
}
