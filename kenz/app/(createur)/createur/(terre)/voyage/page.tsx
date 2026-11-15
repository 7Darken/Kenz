/**
 * `/createur/voyage` : Kenz en Asie, dans la DA Terre (maquettes/v6/voyage.html). Une idée par écran :
 * l'arrivée (la bille de cristal), la dernière vidéo, mes séries (la bille suit la liste), le vrai prix,
 * « Tu pars en Chine ? », Marques & collaborations, me suivre, le retour.
 */
import { ROUTES } from "@/content/site";
import { MarquesSection } from "@/features/marques/marques-section";
import { ReturnDoor } from "@/features/univers/return-door";
import { FollowSection } from "@/features/voyage/follow-section";
import { GuideSection } from "@/features/voyage/guide-section";
import { LatestVideo } from "@/features/voyage/latest-video";
import { PriceSection } from "@/features/voyage/price-section";
import { SeriesSection } from "@/features/voyage/series-section";
import { VoyageBille } from "@/features/voyage/voyage-bille";
import { VoyageHero } from "@/features/voyage/voyage-hero";
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
