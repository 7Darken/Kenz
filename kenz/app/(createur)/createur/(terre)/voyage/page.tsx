/** `/createur/voyage` : Kenz en Asie (séries, vrai prix, guide, marques, me suivre). Module « Voyage et Sport ». */
import { ROUTES } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../../../../_components/route-placeholder";

const { meta } = getDictionary().voyage;

export const metadata = pageMetadata({ ...meta, path: ROUTES.voyage, universe: "createur" });

export default function VoyagePage() {
  return <RoutePlaceholder title={{ k: "voyage.meta.title" }} lead={{ k: "voyage.meta.description" }} />;
}
