/** `/` : l'accueil Pro (hero, scène des apps, 54 heures, aperçu IA, contact). Module « Pro accueil ». */
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../_components/route-placeholder";

const { meta } = getDictionary().pro;

export const metadata = pageMetadata({ ...meta, path: "/", universe: "pro" });

export default function ProHomePage() {
  return <RoutePlaceholder title={{ k: "pro.meta.title" }} lead={{ k: "pro.meta.description" }} />;
}
