/**
 * Module « la machine » (features/ia) : point d'entrée public, pour les autres modules.
 *
 * `IaPreview` : l'aperçu de l'accueil Pro. Un seul cas, qui se joue tout seul deux fois tant qu'il est à
 * l'écran, puis garde son état final (mouvement réduit : l'état final, tout de suite), puis « Voir comment » vers /agents.
 *   - `caseId` : le cas joué, parmi `recette | assiette | video | projet` (défaut `recette` ; un id inconnu
 *     retombe sur `recette`) ;
 *   - `href` : la cible de « Voir comment » (défaut `/agents`, avec la transition Passage) ; `""` : pas de lien.
 *
 * Les chapitres de la page /agents ont leur point d'entrée, ./page (importé par sa route seule : l'accueil
 * n'embarque pas les composants client de /agents).
 */
export { IaPreview, type IaPreviewProps } from "./ia-preview";
