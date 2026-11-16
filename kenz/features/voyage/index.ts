/**
 * La page /createur/voyage (features/voyage) : point d'entrée public, les chapitres dans l'ordre de la page.
 *   <VoyageBille />    la bille de cristal (mode `bille` de features/terre), qui suit l'arrivée puis la liste des séries ;
 *   <VoyageHero />     l'arrivée ; <LatestVideo /> la dernière vidéo ; <SeriesSection /> mes séries ;
 *   <PriceSection />   le vrai prix ; <GuideSection /> « Tu pars en Chine ? » ; <FollowSection /> me suivre.
 * Contenu : content/series.ts ; textes : l'espace `voyage` des dictionnaires.
 */
export { FollowSection } from "./follow-section";
export { GuideSection } from "./guide-section";
export { LatestVideo } from "./latest-video";
export { PriceSection } from "./price-section";
export { SeriesSection } from "./series-section";
export { VoyageBille } from "./voyage-bille";
export { VoyageHero } from "./voyage-hero";
