/**
 * La page d'un itinéraire jour par jour (features/itineraire) : point d'entrée public, les chapitres dans l'ordre.
 *   <ItineraryHero />   l'arrivée (titre, étapes, affiche de la vidéo, le voyage en bref) ;
 *   <Planner />         « Jour par jour » : calendrier, jour ouvert, carte du trajet, barre des jours ;
 *   <Essentials />      les infos pratiques et la checklist ; <VideoSection /> la vidéo ;
 *   <SubscribeGate />   la porte « abonnés », sur l'honneur (rien n'est envoyé).
 * Contenu : content/itineraries.ts ; textes : l'espace `itineraire` des dictionnaires.
 */
export { Essentials } from "./essentials";
export { ItineraryHero } from "./itinerary-hero";
export { Planner } from "./planner";
export { SubscribeGate } from "./subscribe-gate";
export { cityStops } from "./trip";
export { VideoSection } from "./video-section";
