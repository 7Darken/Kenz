/**
 * Script inline du <head>, exécuté avant le premier rendu (aucun éclair blanc ou noir) :
 * - <html data-theme> : choix mémorisé (localStorage « kz-theme »), sinon le système ;
 * - <html class="js"> : les apparitions animées peuvent cacher leur état de départ ;
 * - garde-fou : si l'application ne démarre pas en 4 s, on retire « js » (tout redevient visible).
 * MotionProvider lève ce garde-fou au démarrage.
 */
export const THEME_STORAGE_KEY = "kz-theme";

export const themeScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&!window.matchMedia("(prefers-color-scheme: dark)").matches?"light":"dark"}d.setAttribute("data-theme",t);d.classList.add("js");window.__kzBoot=setTimeout(function(){d.classList.remove("js")},4000)})();`;
