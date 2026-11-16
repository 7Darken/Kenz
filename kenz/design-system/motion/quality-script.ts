/**
 * Script inline du <head> : le niveau de qualité de départ, posé sur <html data-quality> avant le premier rendu,
 * pour que le CSS des niveaux `medium` et `low` s'applique sans éclair. Il lit les signaux statiques de l'appareil :
 * - `low` : économie de données, réseau 2G, 2 Go de mémoire ou 2 cœurs au plus ;
 * - `medium` : réseau 3G, 4 Go ou 4 cœurs au plus, ou un téléphone (pointeur tactile, écran étroit) ;
 * - sinon `high` (ordinateur récent : rien ne change).
 * Un niveau abaissé par la mesure (./quality, mémorisé pour la session) est repris d'une page à l'autre.
 * La mesure réelle des images, et la baisse en cours de route, sont dans ./quality.
 */
export const QUALITY_STORAGE_KEY = "kz-quality";

export const qualityScript = `(function(){var d=document.documentElement,n=navigator,c=n.connection||{},m=n.deviceMemory,h=n.hardwareConcurrency,e=c.effectiveType||"",q="high";function mq(s){return!!(window.matchMedia&&matchMedia(s).matches)}if(c.saveData||/2g/.test(e)||(m&&m<=2)||(h&&h<=2))q="low";else if(e==="3g"||(m&&m<=4)||(h&&h<=4)||(mq("(pointer: coarse)")&&mq("(max-width: 899px)")))q="medium";try{var s=sessionStorage.getItem("${QUALITY_STORAGE_KEY}");if(s==="low"||(s==="medium"&&q==="high"))q=s}catch(x){}d.setAttribute("data-quality",q)})();`;
