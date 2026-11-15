/**
 * La scène des apps (features/apps-space) : le chapitre `#apps` de l'accueil Pro.
 *   <AppsSpace />   composant serveur sans props (contenu : content/apps.ts, SPACE_ORDER).
 * Survol, clavier ou premier toucher : la fiche holographique (vraies captures App Store) ; clic : le départ
 * vers /apps/[slug], l'icône qui vole (openPassage). Le tracé secret de CONSTELLATION_CODE lance startDive().
 */
export { AppsSpace } from "./apps-space";
