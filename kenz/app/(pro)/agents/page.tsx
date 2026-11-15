/** `/agents` : l'IA au travail (la machine, « Et chez vous ? », la méthode, le contact). Module « Agents ». */
import { ROUTES } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { RoutePlaceholder } from "../../_components/route-placeholder";

const { meta } = getDictionary().agents;

export const metadata = pageMetadata({ ...meta, path: ROUTES.agents, universe: "pro" });

export default function AgentsPage() {
  return <RoutePlaceholder title={{ k: "agents.meta.title" }} lead={{ k: "agents.meta.description" }} />;
}
