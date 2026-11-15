/** `/createur/sport` : k15ze (la promesse, ce que je partage, mes courses). Module « Voyage et Sport ». */
import { ROUTES } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../../../_components/route-placeholder";

const { meta } = getDictionary().sport;

export const metadata = pageMetadata({ ...meta, path: ROUTES.sport, universe: "k15ze" });

export default function SportPage() {
  return <RoutePlaceholder title={{ k: "sport.meta.title" }} lead={{ k: "sport.meta.description" }} />;
}
