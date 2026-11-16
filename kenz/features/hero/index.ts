/**
 * Le hero partagé (features/hero) : point d'entrée public, pour les autres modules.
 *
 * `Hero` : le paysage de Kuala Lumpur, le portrait détouré sous l'arche de lumière, « Kenz. », la phrase et
 * le lien vers le premier chapitre ; les objets 3D sur trois plans (features/profondeur) autour du portrait.
 *   - `variant` : `pro` (l'heure bleue, « Voir ce que je construis » → #apps) ou `createur` (l'heure dorée,
 *     « Partir avec moi » → #voyage) ;
 *   - `behind` : un calque posé entre le paysage et l'arche (côté Créateur : l'horizon de la Terre).
 * Composant serveur ; c'est le chapitre `#top` de la page (aura « droite », sans trait du fil).
 * L'arrivée se joue au chargement, ou à la fin d'un passage (`passage:arrivee`, `porte:arrivee`).
 *
 * `setHeroFade(hero, value)` : côté Créateur, le paysage et la scène du portrait suivent un fondu piloté de l'extérieur
 * (l'écran statique « vu une fois » de features/terre), au lieu du défilement ; `null` rend la main au défilement.
 */
export { Hero, type HeroProps } from "./hero";
export { setHeroFade } from "./hero-fade";
