/**
 * Module « la machine » (features/ia) : point d'entrée public, pour les autres modules.
 *
 * `IaPreview` : l'aperçu de l'accueil Pro. Un seul cas, qui se joue tout seul en boucle douce tant qu'il
 * est à l'écran (mouvement réduit : l'état final, sans boucle), puis « Voir comment » vers /agents.
 *   - `caseId` : le cas joué, parmi `recette | assiette | video | projet` (défaut `recette` ; un id inconnu
 *     retombe sur `recette`) ;
 *   - `href` : la cible de « Voir comment » (défaut `/agents`, avec la transition Passage) ; `""` : pas de lien.
 *
 * La page /agents assemble ses propres sections (mode complet de la machine, « Et chez vous ? », la méthode).
 */
export { IaPreview, type IaPreviewProps } from "./ia-preview";
