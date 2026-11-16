/**
 * features/passages : les transitions entre les pages et les passages secrets entre les deux univers.
 * Seul point d'entrée du module (contrat commun de la refonte V6) ; le reste est interne.
 *
 * MONTAGE (déjà fait)
 *   <PassageRoot />          dans UniverseShell : branche le routeur, intercepte les liens [data-passage], joue l'arrivée.
 *   <Cordon />               le point du logo côté Créateur (UniverseShell navDot, layout (terre)).
 *   <StarSky />              le ciel en arche du pied de page Créateur (UniverseShell sky, layout (terre)).
 *
 * LIENS AVEC TRANSITION
 *   {...passageAttributes("voyage")} (content/site) sur un lien interne. Facultatif : data-source="<sélecteur>",
 *   l'élément dont le rectangle grandit (cherché parmi les ancêtres du lien, puis dans la page).
 *   openPassage(source, href, { color?, icon?, size? }) : le même passage lancé par le code (ex. le départ vers une
 *   app, avec son icône comme élément partagé). Faux si un passage est déjà en cours.
 *   Page d'arrivée avec l'icône : [data-passage-icone] sur l'icône (le passage la masque, puis la pose : opacity 1,
 *   transform none) et [data-passage-arche] sur l'arche où le voile se rétracte.
 *
 * PASSAGES SECRETS
 *   startDive({ from?: { x, y } })   la plongée Pro → Créateur, depuis ce point de l'écran (le centre de la constellation).
 *                                    La planète naît en 0,75 s ; la plongée commence à DIVE_PLUNGE_DELAY (0,82 s) : la
 *                                    caméra de la scène peut plonger en même temps. Faux si un passage est déjà en cours.
 *   startLiftoff()                   le décollage Créateur → Pro (le ciel, le cordon).
 *   isPassageBusy()                  vrai pendant un passage ou le geste du cordon : un autre geste secret attend.
 *   announceTerreReady()             à appeler par la Terre à son premier rendu : l'éclat de la plongée se dissipe
 *                                    alors sur elle (sinon au bout de 2,4 s).
 *
 * ARRIVÉE
 *   usePassageArrival() → { via: null | "passage" | "dive" | "liftoff", withIcon, ready }
 *   Le hero raccourcit son entrée si `via` n'est pas null et la joue quand `ready` devient vrai ; la Terre finit la
 *   descente si `via === "dive"`. Drapeau sessionStorage « kz-passage » (repris si la navigation recharge la page).
 *   usePageEntrance({ enabled?, waitFonts?, delay?, maxWait? }) → { entered, via, ready }
 *   Le moment de jouer l'entrée d'une page (heros, /agents, nav) : après le voile, ou après les polices, ou après
 *   une image et `delay` ms. Une seule règle pour tout le site.
 */
export { PassageRoot } from "./passage-root";
export { Cordon } from "./cordon";
export { StarSky } from "./star-sky";
export { openPassage, type OpenPassageOptions } from "./veil";
export { announceTerreReady, DIVE_PLUNGE_DELAY, startDive, startLiftoff } from "./portal";
export { isPassageBusy, type PassageArrival, type PassageKind } from "./passage-state";
export { usePassageArrival } from "./use-passage-arrival";
export { usePageEntrance, type PageEntrance, type PageEntranceOptions } from "./use-page-entrance";
