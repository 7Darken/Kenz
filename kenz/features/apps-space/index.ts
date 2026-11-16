/**
 * La scène des apps (features/apps-space) : le chapitre `#apps` de l'accueil Pro.
 *   <AppsSpace />   composant serveur sans props (contenu : content/apps.ts, SPACE_ORDER).
 * Survol, clavier (Tab, flèches) ou premier toucher : la fiche holographique compacte (vraies captures App Store),
 * posée dans le vide près de l'astre ou en feuille en bas de la scène, qui glisse d'un astre à l'autre ; clic : le
 * départ vers /apps/[slug], l'icône qui vole (openPassage). Le tracé secret de CONSTELLATION_CODE lance startDive().
 */
export { AppsSpace } from "./apps-space";
