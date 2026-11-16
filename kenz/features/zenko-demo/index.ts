/**
 * La mini-animation de Zenko (features/zenko-demo), partagée par la fiche de l'accueil Pro (apps-space)
 * et « Comment ça marche » (app-detail) :
 *   <ZenkoDemo texts={…} skin={…} />   le budget et la journée, avec les classes de l'habillage ;
 *   zenkoTimeline(root, start)          sa timeline (état de départ, puis vers l'état final du CSS).
 */
export { ZenkoDemo, type ZenkoSkin, type ZenkoTexts } from "./zenko-demo";
export { zenkoTimeline } from "./zenko-timeline";
