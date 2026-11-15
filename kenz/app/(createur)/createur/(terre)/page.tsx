/** `/createur` : l'accueil Créateur (la Terre, le voyage, le sport, me suivre). Module « Créateur accueil ». */
import { ROUTES } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../../../_components/route-placeholder";

const { meta } = getDictionary().createur;

export const metadata = pageMetadata({ ...meta, path: ROUTES.createur, universe: "createur" });

export default function CreateurHomePage() {
  return <RoutePlaceholder title={{ k: "createur.meta.title" }} lead={{ k: "createur.meta.description" }} />;
}
