/**
 * Script inline du <head> : une page rechargée par un passage (le routeur a dû naviguer en dur) pose
 * <html data-kz-arrive> avant le premier affichage, pour que l'arrivée du hero, jouée en CSS dès ce premier
 * affichage, attende le voile (le hero la libère avec data-in, et retire l'attribut).
 */
import { FRESH_MS, STORAGE_KEY } from "./passage-state";

export const arrivalScript = `(function(){try{var a=JSON.parse(sessionStorage.getItem("${STORAGE_KEY}")||"null");if(a&&a.path===location.pathname&&Date.now()-a.t<(a.kind==="passage"?${FRESH_MS.passage}:${FRESH_MS.dive}))document.documentElement.setAttribute("data-kz-arrive","")}catch(e){}})();`;
