/**
 * `/createur/sport` : k15ze, dans son identité (fond #0D0F0E, vert ; maquettes/v6/sport.html).
 * Une idée par écran : l'arrivée (la promesse), ce que je partage, mes courses, me suivre, le retour.
 * Rien sur l'Asie ni le voyage.
 */
import { ROUTES } from "@/content/site";
import { ReturnDoor } from "@/design-system/components/return-door";
import { CoursesSection, FollowSection, PartageSection, SportHero } from "@/features/sport/page";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";

const { meta } = getDictionary().sport;

export const metadata = pageMetadata({ ...meta, path: ROUTES.sport, universe: "k15ze" });

export default function SportPage() {
  return (
    <>
      <SportHero />
      <PartageSection />
      <CoursesSection />
      <FollowSection />
      <ReturnDoor variant="k15ze" label="sport.retour.label" door="sport.retour.door" />
    </>
  );
}
