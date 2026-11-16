/**
 * `/createur/voyage` : Kenz en Asie, dans la DA Terre (maquettes/v6/voyage.html). Une idée par écran :
 * l'arrivée (la bille de cristal), la dernière vidéo, mes séries (la bille suit la liste), le vrai prix,
 * « Tu pars en Chine ? », Marques & collaborations, me suivre, le retour.
 */
import { ROUTES } from "@/content/site";
import { ReturnDoor } from "@/design-system/components/return-door";
import { MarquesSection } from "@/features/marques";
import {
  FollowSection,
  GuideSection,
  LatestVideo,
  PriceSection,
  SeriesSection,
  VoyageBille,
  VoyageHero,
} from "@/features/voyage";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";

const { meta } = getDictionary().voyage;

export const metadata = pageMetadata({ ...meta, path: ROUTES.voyage, universe: "createur" });

export default function VoyagePage() {
  return (
    <>
      <VoyageBille />
      <VoyageHero />
      <LatestVideo />
      <SeriesSection />
      <PriceSection />
      <GuideSection />
      <MarquesSection />
      <FollowSection />
      <ReturnDoor variant="terre" label="voyage.retour.label" door="voyage.retour.door" />
    </>
  );
}
