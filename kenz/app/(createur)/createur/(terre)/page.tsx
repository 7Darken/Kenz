/**
 * `/createur` : l'accueil Créateur, la DA « Terre » (maquettes/v6/createur.html). Une idée par écran :
 * le hero sur le tour de la Terre (#top), le trajet du voyage sur le globe (#voyage), le sport en un écran (#sport),
 * puis « Me suivre », deux univers (#suivre). Un seul globe pour la page : le ciel passe sous le paysage du hero,
 * le globe se lève à l'horizon (calque `behind` du hero) ; le trajet les pilote au défilement.
 */
import { ROUTES } from "@/content/site";
import { Hero } from "@/features/hero";
import { SuivreSection } from "@/features/suivre";
import { TerreLayer, TerreScene, TerreSky, VoyageSection } from "@/features/terre";
import { getDictionary } from "@/i18n/server";
import { pageMetadata } from "@/i18n/metadata";
import { SportSection } from "./sport-section";

const { meta } = getDictionary().createur;

export const metadata = pageMetadata({ ...meta, path: ROUTES.createur, universe: "createur" });

export default function CreateurHomePage() {
  return (
    <>
      <TerreScene>
        <TerreSky />
        <Hero variant="createur" behind={<TerreLayer />} />
        <VoyageSection />
      </TerreScene>
      <SportSection />
      <SuivreSection />
    </>
  );
}
