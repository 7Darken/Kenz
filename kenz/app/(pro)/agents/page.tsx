/**
 * `/agents` : l'IA au travail (maquettes/v6/agents.html). Une phrase forte, la machine tout de suite (quatre vrais cas,
 * le visiteur valide), « Et chez vous ? », comment on avance, puis le contact.
 */
import { ROUTES } from "@/content/site";
import { ContactSection } from "@/features/contact";
import { AgentsHero } from "@/features/ia/agents-hero";
import { MachineSection } from "@/features/ia/machine-section";
import { MethodSection } from "@/features/ia/method-section";
import { NeedsSection } from "@/features/ia/needs-section";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";

const { meta } = getDictionary().agents;

export const metadata = pageMetadata({ ...meta, path: ROUTES.agents, universe: "pro" });

export default function AgentsPage() {
  return (
    <>
      <AgentsHero />
      <MachineSection />
      <NeedsSection />
      <MethodSection />
      <ContactSection variant="agents" />
    </>
  );
}
