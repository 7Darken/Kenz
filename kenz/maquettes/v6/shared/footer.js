/* ==========================================================================
   Le pied de page commun (V6) : un pied de page classique et compact. Styles : shared/footer.css.
   Ne dépend de rien (theme.js, Passage, etoiles.js facultatifs).

   BRANCHEMENT
     <head>  <link rel="stylesheet" href="shared/footer.css">          (après shared/theme.css)
     page    <footer data-kz-footer="pro|createur|k15ze"></footer>
             <script src="shared/footer.js"></script>                    (synchrone, juste après le <footer>)
     Ou bien en defer en fin de <body>, mais AVANT shared/etoiles.js : le ciel doit exister quand etoiles.js démarre.

   LE GABARIT (environ 160 à 200 px de haut sur ordinateur)
     Ligne 1 : « Kenz· » en petit (le logo de la nav) et la phrase, discrète ; la navigation en ligne ; les réseaux.
     Un filet fin.
     Ligne 2 : « © 2026 Kenz » (et « Marques & collaborations » côté Créateur) ; « Revenir en haut ↑ ».
     Téléphone : la navigation et les réseaux en deux colonnes, des cibles de 44 px.

   LES TROIS UNIVERS. Le pied de page ne lie ni ne nomme jamais l'autre univers : on passe de Pro à Créateur
   (et retour) seulement par les passages secrets (la constellation des apps, le ciel, le cordon).
     pro       « Je construis des apps où l'IA fait le vrai travail. » ;
               Mes apps (pro.html#apps), Escapades Libres (app.html#escapades-libres), Agents IA (agents.html),
               Contact (#contact de la page si elle en a une, sinon pro.html#contact) ; GitHub, LinkedIn ;
               le bouton clair / sombre ; Revenir en haut ; © 2026 Kenz.
     createur  « Je voyage en Asie, je m'entraîne entre deux voyages, et je te raconte tout. » ;
               Le voyage (voyage.html), Le sport (sport.html) ; YouTube (Kenz in Asia), TikTok (En Bien en Asie),
               Instagram, YouTube k15ze ; Marques & collaborations (voyage.html#marques) ; Revenir en haut ; © 2026 Kenz ;
               le ciel (shared/etoiles.*), sans légende : à droite de la ligne 1 sur grand écran (en dehors du flux,
               il ne grossit pas le pied de page), juste au-dessus du filet ailleurs. Mêmes dimensions, même geste.
     k15ze     l'identité k15ze (fond #0D0F0E, vert #3DDC84, #1E7A46 en clair : le vert au survol) ; la promesse ;
               Ce que je partage (#partage), Mes courses (#courses), Toute ma création de contenu (createur.html) ;
               YouTube (k15ze) ; Revenir en haut ; © 2026 Kenz. Rien sur l'Asie ni le voyage.

   OPTIONS (attributs du <footer>)
     data-ciel="non"        createur : pas de ciel (il est là par défaut).
     data-mode="oui|non"    le bouton clair / sombre (par défaut : oui côté pro, non ailleurs ; jamais sans theme.js).

   COMPORTEMENT
     - Un lien vers la page courante devient une ancre interne (pro.html#apps sur pro.html -> #apps) ;
       la page elle-même (agents.html sur agents.html) -> #top avec aria-current="page".
     - Les liens vers une autre page portent data-passage, data-couleur (le fond d'arrivée) et data-couleur-clair :
       la page les prend avec sa transition Passage (même contrat que ses propres liens) ; sinon ce module
       appelle window.Passage.ouvrir ; sinon navigation simple. La recherche (?clair) est gardée.
     - Ancres internes : la page s'en charge (Lenis) ; sinon ce module défile en douceur. « Revenir en haut »
       marche aussi sans #top (ex. app.html).
     - À l'arrivée dans l'écran : <footer class="is-in">, un fondu discret. Liens : soulignement au survol.
   API : window.KzFooter.monter(el)   rend un <footer data-kz-footer> ajouté après coup (sans effet s'il est déjà rendu)
         window.KzFooter.tout()       rend tous ceux de la page
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, H = D.documentElement;
  if (W.KzFooter) { W.KzFooter.tout(); return; }

  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }

  /* ------------------------------------------------------------------------
     Les icônes (même trait que le reste du site)
     ------------------------------------------------------------------------ */
  function svg(d) {
    return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }
  var ICO = {
    sortie: svg('M4.5 11.5l7-7M5.5 4.5h6v6'),
    haut: svg('M8 13V3M3.5 7.5L8 3l4.5 4.5'),
    retour: svg('M13 8H3M7.5 3.5L3 8l4.5 4.5')
  };
  /* Le soleil / la lune du bouton de mode (le même dessin que shared/theme.js) */
  var ICO_MODE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<g class="kz-mode__soleil"><circle cx="12" cy="12" r="4.1"/><g class="kz-mode__rayons">' +
    '<path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></g></g>' +
    '<path class="kz-mode__lune" d="M19.5 14.3A7.6 7.6 0 0 1 9.7 4.5a7.6 7.6 0 1 0 9.8 9.8z"/></svg>';

  /* ------------------------------------------------------------------------
     Le passage : la couleur du fond d'arrivée (sombre, clair), comme les liens des pages
     ------------------------------------------------------------------------ */
  var C = {
    pro: ['#0E1220', '#F5F3EF'],
    agents: ['#1A2440', '#E9EDEF'],
    escapades: ['#E3A21A'],
    voyage: ['#0F5D6B'],
    sport: ['#0D0F0E'],
    createur: ['#0A1117', '#F6F2EB']
  };

  /* ------------------------------------------------------------------------
     Le contenu, par univers (seulement des liens réels, déjà présents sur les pages)
     t : texte ; a : nom complet pour les lecteurs d'écran ; h : adresse ; c : couleur du passage ;
     ext : nouvel onglet ; ici : rester sur la page si elle a cette ancre ; retour : flèche vers la gauche
     ------------------------------------------------------------------------ */
  var UNIVERS = {
    pro: {
      phrase: 'Je construis des apps où l’IA fait le vrai travail.',
      nav: [
        { t: 'Mes apps', h: 'pro.html#apps', c: C.pro },
        { t: 'Escapades Libres', h: 'app.html#escapades-libres', c: C.escapades },
        { t: 'Agents IA', h: 'agents.html', c: C.agents },
        { t: 'Contact', h: 'pro.html#contact', c: C.pro, ici: true }
      ],
      reseaux: [
        { t: 'GitHub', h: 'https://github.com/7Darken', ext: true },
        { t: 'LinkedIn', h: 'https://www.linkedin.com/in/kenz-narainen/', ext: true }
      ],
      bas: [], mode: true, ciel: false
    },
    createur: {
      phrase: 'Je voyage en Asie, je m’entraîne entre deux voyages, et je te raconte tout.',
      nav: [
        { t: 'Le voyage', h: 'voyage.html', c: C.voyage },
        { t: 'Le sport', h: 'sport.html', c: C.sport }
      ],
      reseaux: [
        { t: 'YouTube', a: 'YouTube · Kenz in Asia', h: 'https://www.youtube.com/@7Kinze', ext: true },
        { t: 'TikTok', a: 'TikTok · En Bien en Asie', h: 'https://www.tiktok.com/@7kinze', ext: true },
        { t: 'Instagram', a: 'Instagram · @kenzvoyage_enbien', h: 'https://www.instagram.com/kenzvoyage_enbien/', ext: true },
        { t: 'YouTube k15ze', a: 'YouTube · k15ze', h: 'https://www.youtube.com/@K15ze-l6z', ext: true }
      ],
      bas: [{ t: 'Marques & collaborations', h: 'voyage.html#marques', c: C.voyage }],
      mode: false, ciel: true
    },
    k15ze: {
      phrase: 'En sèche, je mange plaisir et copieux&nbsp;: des recettes simples, aux doses exactes.',
      nav: [
        { t: 'Ce que je partage', h: 'sport.html#partage', c: C.sport, ici: true },
        { t: 'Mes courses', h: 'sport.html#courses', c: C.sport, ici: true },
        { t: 'Toute ma création de contenu', h: 'createur.html', c: C.createur, retour: true }
      ],
      reseaux: [
        { t: 'YouTube', a: 'YouTube · k15ze', h: 'https://www.youtube.com/@K15ze-l6z', ext: true }
      ],
      bas: [], mode: false, ciel: false
    }
  };

  /* ------------------------------------------------------------------------
     Les adresses : la page courante devient une ancre interne
     ------------------------------------------------------------------------ */
  var ICI = (function () {
    var p = (location.pathname || '').split('/').pop() || '';
    try { p = decodeURIComponent(p); } catch (e) {}
    return p;
  })();
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function resoudre(l) {
    if (l.ext) return { href: l.h, ext: true };
    var i = l.h.indexOf('#'), fichier = i < 0 ? l.h : l.h.slice(0, i), ancre = i < 0 ? '' : l.h.slice(i + 1);
    var meme = !!ICI && fichier === ICI;
    if (meme && !ancre) return { href: '#top', courant: true };
    if (ancre && (meme || l.ici) && D.getElementById(ancre)) return { href: '#' + ancre };
    return { href: l.h, c: l.c };
  }
  function avecRecherche(h) {
    var s = location.search;
    if (!s || h.indexOf('?') > -1 || /^[a-z]+:/i.test(h)) return h;
    var i = h.indexOf('#');
    return i < 0 ? h + s : h.slice(0, i) + s + h.slice(i);
  }

  /* ------------------------------------------------------------------------
     Le dessin
     ------------------------------------------------------------------------ */
  function lien(l, cls) {
    var r = resoudre(l), a = '<a class="kzf__a' + (cls ? ' ' + cls : '') + '" href="' + esc(r.href) + '"';
    if (l.a) a += ' aria-label="' + esc(l.a) + '"';
    if (r.ext) a += ' target="_blank" rel="noopener"';
    if (r.courant) a += ' aria-current="page"';
    if (r.c) {
      a += ' data-passage data-couleur="' + r.c[0] + '"';
      if (r.c[1]) a += ' data-couleur-clair="' + r.c[1] + '"';
    }
    a += '>';
    if (l.retour) a += '<i class="kzf__ico kzf__ico--retour">' + ICO.retour + '</i>';
    a += '<span class="kzf__t">' + esc(l.t) + '</span>';
    if (r.ext) a += '<i class="kzf__ico kzf__ico--sortie">' + ICO.sortie + '</i>';
    return a + '</a>';
  }
  function liste(arr, cls, label) {
    var h = '<ul class="kzf__liste ' + cls + '" role="list" aria-label="' + label + '">';
    arr.forEach(function (l) { h += '<li>' + lien(l) + '</li>'; });
    return h + '</ul>';
  }

  function dessiner(el, U) {
    var h = '<div class="kzf__in">';
    /* Ligne 1 : le logo et la phrase ; la navigation en ligne ; les réseaux */
    h += '<div class="kzf__l1">' +
      '<p class="kzf__id"><span class="kzf__logo">Kenz<i class="kzf__point"></i></span><span class="kzf__phrase">' + U.phrase + '</span></p>' +
      '<nav class="kzf__nav" aria-label="Pied de page">' + liste(U.nav, 'kzf__liste--nav', 'Navigation') + liste(U.reseaux, 'kzf__liste--reseaux', 'Réseaux') + '</nav>' +
    '</div>';
    /* Le ciel (Créateur) : sans légende, ses dimensions et son geste d'origine */
    if (U.ciel && el.getAttribute('data-ciel') !== 'non') {
      h += '<div class="kzf__ciel"><div class="kz-etoiles" data-etoiles data-vers="pro.html" data-symbole="lune"></div></div>';
    }
    /* Ligne 2, sous un filet fin */
    h += '<div class="kzf__bas"><p class="kzf__copy">© 2026 Kenz</p>';
    U.bas.forEach(function (l) { h += lien(l, 'kzf__a--bas'); });
    h += '<div class="kzf__fin">';
    var mode = el.getAttribute('data-mode');
    if (W.KzTheme && (mode === 'oui' || (U.mode && mode !== 'non'))) h += '<button class="kz-mode kzf__mode" type="button"></button>';
    h += '<a class="kzf__a kzf__monter" href="#top"><span class="kzf__t">Revenir en haut</span><i class="kzf__ico kzf__ico--haut">' + ICO.haut + '</i></a>';
    h += '</div></div></div>';
    el.innerHTML = h;
  }

  /* ------------------------------------------------------------------------
     Le bouton clair / sombre (il pilote shared/theme.js)
     ------------------------------------------------------------------------ */
  function brancherMode(el) {
    var b = el.querySelector('.kzf__mode');
    if (!b) return;
    b.innerHTML = ICO_MODE;
    var maj = function () {
      var m = W.KzTheme ? W.KzTheme.mode() : H.getAttribute('data-theme');
      b.setAttribute('aria-label', m === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair');
    };
    b.addEventListener('click', function () { if (W.KzTheme) W.KzTheme.basculer(); });
    D.addEventListener('kz-theme:change', maj);
    maj();
  }

  /* ------------------------------------------------------------------------
     L'arrivée dans l'écran : un fondu discret
     ------------------------------------------------------------------------ */
  var io = null;
  function reveler(el) {
    if (!W.IntersectionObserver) { el.classList.add('is-in'); return; }
    if (!io) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          /* À l'écran, ou déjà dépassé (saut en bas de page, retour en arrière) */
          if (!en.isIntersecting && !(en.boundingClientRect.bottom < 0)) return;
          io.unobserve(en.target);
          var f = en.target;
          requestAnimationFrame(function () { f.classList.add('is-in'); });
        });
      }, { threshold: 0 , rootMargin: '0px 0px -4% 0px' });
    }
    io.observe(el);
  }

  /* ------------------------------------------------------------------------
     Monter un pied de page
     ------------------------------------------------------------------------ */
  function monter(el) {
    if (!el || el.__kzf) return;
    var nom = el.getAttribute('data-kz-footer');
    var U = UNIVERS[nom];
    if (!U) { console.error('[kz-footer] univers inconnu : ' + nom); return; }
    el.__kzf = true;
    el.classList.add('kzf', 'kzf--' + nom);
    if (!el.hasAttribute('role') && el.tagName !== 'FOOTER') el.setAttribute('role', 'contentinfo');
    dessiner(el, U);
    brancherMode(el);
    el.classList.add('kzf--anim');
    reveler(el);
  }
  function tout() {
    Array.prototype.forEach.call(D.querySelectorAll('[data-kz-footer]'), monter);
  }

  /* ------------------------------------------------------------------------
     Les clics, en dernier recours (la page passe d'abord : ses ancres, son Passage)
     ------------------------------------------------------------------------ */
  W.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('.kzf a[href]') : null;
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') {
      var id = href.slice(1), t = id && D.getElementById(id);
      if (id !== 'top' && !t) return;
      e.preventDefault();
      var y = (id === 'top' || !t) ? 0 : t.getBoundingClientRect().top + W.pageYOffset;
      try { W.scrollTo({ top: y, behavior: reduit() ? 'auto' : 'smooth' }); } catch (err) { W.scrollTo(0, y); }
      if (t && t.hasAttribute('tabindex')) setTimeout(function () { try { t.focus({ preventScroll: true }); } catch (err) {} }, reduit() ? 0 : 900);
      return;
    }
    if (!a.hasAttribute('data-passage')) return;
    var url = avecRecherche(href), P = W.Passage;
    e.preventDefault();
    var clair = H.getAttribute('data-theme') === 'light';
    var couleur = (clair && a.getAttribute('data-couleur-clair')) || a.getAttribute('data-couleur');
    if (P && typeof P.ouvrir === 'function') {
      try { P.ouvrir(a, url, { couleur: couleur }); return; } catch (err) { console.error('[kz-footer] passage : ' + err.message); }
    }
    location.href = url;
  });

  W.KzFooter = { monter: monter, tout: tout, pret: true };
  tout();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout);
})();
