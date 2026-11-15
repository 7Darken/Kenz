/**
 * Mes courses (k15ze) : le point d'entrée du module, contrat commun de la refonte V6.
 *
 * `<Courses ids={…} variant="landing" | "page" />`
 * - `ids` : les courses à montrer, dans cet ordre (ids de content/courses.ts ; un id inconnu est ignoré) ;
 * - `variant` : "landing" (côte à côte en rythmes décalés, /createur #sport) ou "page" (une course par rangée,
 *   composition et texte en alternance, /createur/sport) ;
 * - `headingLevel` (facultatif) : niveau des noms de course, "h3" par défaut.
 *
 * Le bas de la grande photo fond dans le fond de la section : si ce fond n'est pas `var(--bg)`, le parent
 * pose sa couleur dans `--courses-bg` (ex. `--courses-bg: #0D0F0E`).
 * Ajouter une course : content/courses.ts (et une scène dans ./scenes si son sport est nouveau).
 */
export { Courses } from "./courses";
