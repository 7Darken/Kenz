/**
 * Le chapitre « 54 heures » de l'accueil Pro : Escapades Libres au Startup Weekend (1re place), le rôle de Kenz
 * (écouter, concevoir, un MVP en 24 heures), puis la plateforme en ligne. Composant serveur : le chapitre du fil
 * (`#victoire`, aura au centre) et son nom ; la scène animée est une feuille client.
 */
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";

import { VictoireStage } from "./victoire-stage";

const LABEL_ID = "victoire-titre";

export function Victoire() {
  return (
    <Section id="victoire" aura="centre" aria-labelledby={LABEL_ID}>
      <p className="sr" id={LABEL_ID}>
        <T k="victoire.sectionLabel" />
      </p>
      <VictoireStage />
    </Section>
  );
}
