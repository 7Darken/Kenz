/**
 * Module « la Terre » (features/terre) : point d'entrée public, pour les autres modules.
 *
 * Un seul globe three.js par page (une bille de cristal : coque de verre, monde intérieur en relief, pays filmés en
 * néon ambré, fils d'or des trajets), dans un calque fixe. three.js est chargé à part (`next/dynamic`, sans rendu
 * serveur) ; le rendu se met en pause hors écran ; tout est libéré au démontage. Sans WebGL ou en mouvement réduit :
 * une image fixe ronde, le même halo.
 *
 * /createur : `<TerreScene>` relie trois pièces, que le trajet du voyage pilote au défilement :
 *   - `TerreSky` : le ciel, un calque fixe posé avant le hero (sous son paysage, qui s'efface dessus) ;
 *   - `TerreLayer` : le globe, à passer au hero (`<Hero variant="createur" behind={<TerreLayer />} />`). Il doit rester
 *     hors de tout ancêtre transformé, filtré ou `contain` (sinon `position: fixed` ne se rapporte plus à l'écran) ;
 *   - `VoyageSection` : le chapitre #voyage, juste après le hero.
 *
 * `TerreBille` : la petite bille de /createur/voyage, à poser une fois en tête de la page (calque fixe, z-index 0,
 *   sous les sections). Elle se pose sur l'emplacement `[data-bille]` le plus visible (un élément carré, vide :
 *   la bille prend son centre et la moitié de sa largeur pour rayon) et s'efface quand aucun n'est à l'écran.
 *   - `data-bille="libre"` : la rotation lente, l'Asie face à nous ;
 *   - tout autre emplacement suit `focus` : `{ escale, lat, lon }` (le pays allumé, le point visé ; ex. la série au
 *     milieu de l'écran : `{ escale: serie.escale, ...(serie.focus ?? ESCALES[serie.escale]) }`) ; null : comme libre.
 */
export { TerreLayer } from "./terre-layer";
export { TerreBille, type TerreBilleFocus, type TerreBilleProps } from "./terre-bille";
export { TerreScene } from "./terre-scene";
export { TerreSky } from "./terre-sky";
export { VoyageSection } from "./voyage-section";
