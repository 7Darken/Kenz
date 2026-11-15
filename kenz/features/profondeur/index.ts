/**
 * La profondeur des heros (features/profondeur) : des objets 3D (et des polaroïds) sur trois plans autour du
 * portrait. Posée par features/hero dans la scène du hero :
 *   <Profondeur series="pro" | "createur" ready={heroArrivé} />
 * `figSelector` (le portrait, défaut `[data-hero-fig]`) et `avoidSelector` (ce qu'aucun objet ne couvre,
 * défaut `[data-hero-avoid]`) sont cherchés dans le chapitre qui la contient.
 */
export { Profondeur, type ProfondeurProps } from "./profondeur";
