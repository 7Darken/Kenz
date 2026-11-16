/* Outil de revue de la maquette unique (pour Kenz, pas pour le site final).
   Pastille en bas à gauche : retour à l'accueil des maquettes, puis, sur les pages qui ont le module apps :
   - le cadre de l'écran : Téléphone / Arche        → `kz-revue:cadre` {cadre}       + section.kzApps.setCadre()
   Les choix sont mémorisés (localStorage, dans un try/catch). */
(function () {
  'use strict';
  var GROUPES = []; /* plus de variante à comparer : l'espace ouvre la page de l'app */
  /* Le style de la Terre n'est plus à comparer : la bille de verre (shared/terre.js) est le seul style. */
  var css = document.createElement('style');
  css.textContent = [
    '.kz-revue{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;flex-wrap:wrap;align-items:center;gap:4px;max-width:calc(100vw - 24px);padding:4px;border-radius:22px;font:500 13px/1 "Inter",system-ui,-apple-system,sans-serif;color:#F4EFE6;background:rgba(18,17,16,.62);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 0 1px rgba(255,255,255,.14) inset,0 14px 34px -14px rgba(0,0,0,.55);opacity:.8;transition:opacity .3s}',
    '.kz-revue:hover,.kz-revue:focus-within{opacity:1}',
    '.kz-revue a,.kz-revue button{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;height:30px;padding:0 11px;border-radius:999px;color:inherit;white-space:nowrap;transition:background .3s,color .3s}',
    '.kz-revue a:hover,.kz-revue button:hover{background:rgba(255,255,255,.1)}',
    '.kz-revue a:focus-visible,.kz-revue button:focus-visible{outline:2px solid #F4EFE6;outline-offset:1px}',
    '.kz-revue .sep{width:1px;height:18px;background:rgba(255,255,255,.16)}',
    '.kz-revue .grp{display:inline-flex;align-items:center;gap:2px}',
    '.kz-revue button[aria-pressed="true"]{background:rgba(255,255,255,.18)}',
    'html.kz-passage-arrivee .kz-revue,html[data-porte-arrivee] .kz-revue{opacity:0}'
  ].join('\n');
  document.head.appendChild(css);

  var bar = document.createElement('nav');
  bar.className = 'kz-revue';
  bar.setAttribute('aria-label', 'Revue de la maquette');
  var hasApps = false;
  var html = '<a href="index.html" aria-label="Accueil des maquettes">←</a>';
  if (hasApps) {
    GROUPES.forEach(function (g, i) {
      html += '<span class="sep"></span><span class="grp" role="group" aria-label="' + 'Cadre des apps' + '">' +
        g.options.map(function (o) { return '<button type="button" data-g="' + i + '" data-v="' + o.id + '" aria-pressed="false">' + o.nom + '</button>'; }).join('') + '</span>';
    });
  }
  bar.innerHTML = html;

  function appliquer(g, v, annoncer) {
    bar.querySelectorAll('[data-g="' + GROUPES.indexOf(g) + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); });
    document.querySelectorAll('[data-kz-apps]').forEach(function (s) {
      if (s.kzApps && typeof s.kzApps[g.methode] === 'function') s.kzApps[g.methode](v); else s.setAttribute(g.attr, v);
    });
    if (annoncer) { var d = {}; d[g.prop] = v; document.dispatchEvent(new CustomEvent(g.evt, { detail: d })); }
  }
  bar.querySelectorAll('[data-g]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = GROUPES[+b.getAttribute('data-g')], v = b.getAttribute('data-v');
      ecrire(g, v); appliquer(g, v, true);
    });
  });
  if (hasApps) {
    var tout = function (annoncer) { GROUPES.forEach(function (g) { appliquer(g, lire(g), annoncer); }); };
    tout(false);
    document.addEventListener('kz-apps:pret', function () { tout(true); });
    setTimeout(function () { tout(true); }, 1200);
  }
})();
