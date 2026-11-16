/* ==========================================================================
   Le cordon : le passage secret entre les deux univers (Pro <-> Créateur)

   Contrat (BRIEF-V4.md, section 3) :
     <head>  <link rel="stylesheet" href="shared/cordon.css">
             <script>location.hash.indexOf('porte')>-1&&document.documentElement.setAttribute('data-porte-arrivee','1')</script>
     nav     <a class="kz-logo" href="pro.html">Kenz<button class="kz-dot" type="button" data-cordon
               data-vers="createur.html" data-symbole="soleil" aria-label="Kenz"></button></a>
     </body> <script src="shared/cordon.js" defer></script>

   Le geste (rien ne le trahit au repos) :
     - on attrape le point et on le tire vers le bas : une chaîne à billes sort de son œillet,
       le point suit à 0,6 × le doigt ;
     - à 110 px de traction, un cran : le point saute de 5 px, la chaîne s'éclaire, vibrate(12) ;
     - relâché après le cran : le point remonte d'un coup sec, puis le passage (ci-dessous),
       puis navigation vers data-vers + "#porte" ;
     - relâché avant le cran : le point remonte, rien ne se passe ;
     - un simple clic garde le lien du logo ; Alt + Flèche bas (point ou logo au focus) déclenche le passage.
   LE PASSAGE, DA Terre (BRIEF-V6-TERRE.md) : le côté Pro, c'est l'espace ; le côté Créateur, c'est la Terre.
     - vers Créateur (symbole « soleil ») : LA PLONGÉE. Un point de lumière devient une petite planète bleue
       (assets/terre/globe-nuit|jour.webp, selon le mode), qui grandit de plus en plus vite et remplit l'écran ;
       un éclat d'atmosphère (.cd-eclat) le recouvre, puis createur.html#porte. Départ : { depuis: { x, y } } ;
     - vers Pro (symbole « lune ») : LE DÉCOLLAGE. La page se fond dans l'espace, la Terre s'éloigne jusqu'à
       n'être plus qu'un point, les étoiles reviennent (.cd-ciel), puis pro.html#porte.
     Le drapeau : sessionStorage['kz-porte'] = { s, rgb, m: 'plongee' | 'decollage', t }.
     Les anciens battants de pierre restent possibles : ouvrirPorte({ …, mode: 'porte' }).
   Arrivée (si le hash contient « porte ») : la page pose son voile dès le premier rendu (cordon.css, selon
     data-univers : l'éclat côté Créateur, le ciel étoilé côté Pro), puis
     - Créateur : l'éclat se dissipe dès que la Terre est prête (« terre:prete », shared/terre.js), et le globe
       finit la descente ; - Pro : les étoiles filent et s'effacent sur la page ;
     document reçoit « porte:arrivee », puis history.replaceState retire #porte.
   Mouvement réduit : fondus. GSAP si présent, sinon Web Animations API. Aucune autre dépendance.
   API : Cordon.passer(el) ; Cordon.ouvrirPorte({ vers, symbole, depuis }) lance directement le passage
     et la navigation (utilisé par le ciel, shared/etoiles.js, et la constellation des apps, shared/apps.js) ;
     Cordon.figure(sym) ; Cordon.enCours(). Pages Pro : le point n'a plus data-cordon (simple point du logo).
   ========================================================================== */
(function () {
  'use strict';
  if (window.Cordon && window.Cordon.pret) return;

  var D = document;
  var HTML = D.documentElement;
  var W = window;

  /* Chemins relatifs à ce fichier (shared/cordon.js -> racine du site). */
  var CUR = D.currentScript;
  var SRC = (CUR && CUR.src) || (function () {
    var s = D.querySelector('script[src*="cordon.js"]');
    return s ? s.src : location.href;
  })();
  var BASE = SRC;
  try { BASE = new URL('../', SRC).href; } catch (e) {}
  function asset(p) { try { return new URL(p, BASE).href; } catch (e) { return p; } }

  var G = (W.gsap && typeof W.gsap.to === 'function') ? W.gsap : null;
  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function arr(x) {
    if (!x) return [];
    if (x.nodeType) return [x];
    return Array.prototype.slice.call(x);
  }
  function at(s, fn) { return setTimeout(fn, s * 1000); }
  function now() { return (W.performance && performance.now) ? performance.now() : Date.now(); }
  function f2(n) { return Math.round(n * 100) / 100; }
  function retirer(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }
  var NUM = 0;

  /* ------------------------------------------------------------------------
     Réglages du geste
     ------------------------------------------------------------------------ */
  var SUIT = 0.6;       /* le point suit à 0,6 × le déplacement du doigt */
  var CRAN = 110;       /* px de traction (doigt) pour le cran */
  var DECRAN = 94;      /* en remontant sous ce seuil, le cran se défait */
  var SEUIL = 5;        /* px vers le bas avant que le geste ne commence (sinon : clic) */
  var DECLIC = 5;       /* le point saute de 5 px au cran */
  var AU_DELA = 0.16;   /* au-delà du cran, la résistance augmente */
  var BUTEE = 28;       /* et le point ne descend plus que de 28 px */
  var CLE = 'kz-porte';

  var SYM = {
    soleil: { rgb: [242, 180, 90], img: 'assets/img/kenz-moi.webp' },
    lune: { rgb: [157, 184, 255], img: 'assets/img/kenz-pro.webp' }
  };
  var PAYSAGE = 'assets/img/paysage-kuala-lumpur.jpg';

  W.Cordon = { pret: true, arrivee: false };

  function rgbDe(str, defaut) {
    str = (str || '').trim();
    var m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    m = str.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (m) return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3])];
    return defaut;
  }

  /* ------------------------------------------------------------------------
     Moteur d'animation : GSAP si présent, sinon Web Animations API.
     Spéc. neutre : xp/yp (%), x/y (px), r (deg), s (échelle), o, f (filter), cp (clip-path).
     ------------------------------------------------------------------------ */
  var E = {
    expo: ['expo.out', 'cubic-bezier(.16,1,.3,1)'],
    sortie: ['power2.out', 'cubic-bezier(.33,1,.68,1)'],
    doux: ['power2.inOut', 'cubic-bezier(.45,0,.55,1)'],
    ferme: ['power2.in', 'cubic-bezier(.55,.04,.8,.45)']
  };
  var TF = ['xp', 'yp', 'x', 'y', 'r', 's'];
  var TFE = typeof WeakMap === 'function' ? new WeakMap() : null;
  function tfLire(el) { return (TFE && TFE.get(el)) || { xp: 0, yp: 0, x: 0, y: 0, r: 0, s: 1 }; }
  function css(el, s, garder) {
    var o = {}, t = {}, b = tfLire(el), aT = false, k;
    for (k = 0; k < TF.length; k++) {
      t[TF[k]] = s[TF[k]] != null ? s[TF[k]] : b[TF[k]];
      if (s[TF[k]] != null) aT = true;
    }
    if (aT) {
      o.transform = 'translate(' + t.xp + '%,' + t.yp + '%) translate(' + t.x + 'px,' + t.y + 'px) rotate(' + t.r + 'deg) scale(' + t.s + ')';
      if (garder && TFE) TFE.set(el, t);
    }
    if (s.o != null) o.opacity = String(s.o);
    if (s.f != null) o.filter = s.f;
    if (s.cp != null) o.clipPath = s.cp;
    return o;
  }
  function gs(s) {
    var o = {};
    if (s.xp != null) o.xPercent = s.xp;
    if (s.yp != null) o.yPercent = s.yp;
    if (s.x != null) o.x = s.x;
    if (s.y != null) o.y = s.y;
    if (s.r != null) o.rotation = s.r;
    if (s.s != null) o.scale = s.s;
    if (s.o != null) o.opacity = s.o;
    if (s.f != null) o.filter = s.f;
    if (s.cp != null) o.clipPath = s.cp;
    return o;
  }
  function set(els, s) {
    arr(els).forEach(function (el) {
      if (G) { G.set(el, gs(s)); return; }
      var o = css(el, s, true), k;
      for (k in o) el.style[k] = o[k];
    });
  }
  function to(els, de, fin, o) {
    els = arr(els); o = o || {};
    var d = o.d || 0, delai = o.delay || 0, ez = E[o.e] || E.expo;
    return new Promise(function (ok) {
      if (!els.length) { ok(); return; }
      if (G) {
        if (de) set(els, de);
        if (d <= 0) { at(delai, function () { set(els, fin); ok(); }); return; }
        var v = gs(fin);
        v.duration = d; v.delay = delai; v.ease = ez[0]; v.overwrite = 'auto';
        v.onComplete = function () { ok(); };
        G.to(els, v);
        return;
      }
      if (de) set(els, de);
      if (d <= 0) { at(delai, function () { set(els, fin); ok(); }); return; }
      var reste = els.length;
      els.forEach(function (el) {
        var cible = css(el, fin, false), depart = {}, k, cs = null;
        if (!el.animate) { at(delai + d, function () { set(el, fin); if (--reste === 0) ok(); }); return; }
        for (k in cible) {
          if (el.style[k]) depart[k] = el.style[k];
          else { cs = cs || getComputedStyle(el); depart[k] = cs[k]; }
        }
        var a = el.animate([depart, cible], { duration: d * 1000, delay: delai * 1000, easing: ez[1], fill: 'both' });
        var fait = false;
        function termine() { if (fait) return; fait = true; if (--reste === 0) ok(); }
        a.onfinish = function () { set(el, fin); termine(); try { a.cancel(); } catch (e) {} };
        a.oncancel = termine;
      });
    });
  }

  /* Petite interpolation pilotée à la main (le fil : chemin SVG + point, image par image). */
  function tween(d, ez, maj, fin) {
    if (!(d > 0)) { maj(1); if (fin) fin(); return; }
    var t0 = now();
    (function pas() {
      var p = Math.min(1, (now() - t0) / (d * 1000));
      maj(ez(p));
      if (p < 1) requestAnimationFrame(pas); else if (fin) fin();
    })();
  }
  function expoOut(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function sec(p) { return p * p * p; }                       /* le coup sec : accélère jusqu'à la butée */
  function douxIO(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

  /* ------------------------------------------------------------------------
     Dessin du médaillon (repris du sceau V3 : SVG, viewBox 400, centre 200)
     ------------------------------------------------------------------------ */
  var C = 200;
  var BANDES = [[135, 185], [85, 132], [36, 82]];
  var RAINURES = [186.5, 133.5, 83.5, 34.5];

  function pol(r, a) { var t = a * Math.PI / 180; return [f2(C + r * Math.cos(t)), f2(C + r * Math.sin(t))]; }
  function rayon(r0, r1, a) { var p = pol(r0, a), q = pol(r1, a); return 'M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1]; }
  function cercle(r, cx, cy) {
    cx = cx == null ? C : cx; cy = cy == null ? C : cy;
    return 'M' + f2(cx - r) + ' ' + f2(cy) + 'a' + r + ' ' + r + ' 0 1 0 ' + f2(2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + f2(-2 * r) + ' 0Z';
  }
  function inter(c1, r1, c2, r2) {
    var dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.sqrt(dx * dx + dy * dy);
    var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    var ux = dx / d, uy = dy / d, px = c1[0] + a * ux, py = c1[1] + a * uy;
    return [[px - h * uy, py + h * ux], [px + h * uy, py - h * ux]];
  }
  function arc(c, r, p, q, autre, dehors) {
    var a1 = Math.atan2(p[1] - c[1], p[0] - c[0]), a2 = Math.atan2(q[1] - c[1], q[0] - c[0]);
    var d1 = a2 - a1;
    while (d1 < 0) d1 += 2 * Math.PI;
    var m = a1 + d1 / 2, mx = c[0] + r * Math.cos(m), my = c[1] + r * Math.sin(m);
    var ext = Math.sqrt(Math.pow(mx - autre[0][0], 2) + Math.pow(my - autre[0][1], 2)) > autre[1];
    var sw = ext === dehors ? 1 : 0, span = sw ? d1 : 2 * Math.PI - d1;
    return 'A' + r + ' ' + r + ' 0 ' + (span > Math.PI ? 1 : 0) + ' ' + sw + ' ' + f2(q[0]) + ' ' + f2(q[1]);
  }
  function etoile(x, y, R) {
    var k = R * 0.2;
    return 'M' + f2(x) + ' ' + f2(y - R) +
      'Q' + f2(x + k) + ' ' + f2(y - k) + ' ' + f2(x + R) + ' ' + f2(y) +
      'Q' + f2(x + k) + ' ' + f2(y + k) + ' ' + f2(x) + ' ' + f2(y + R) +
      'Q' + f2(x - k) + ' ' + f2(y + k) + ' ' + f2(x - R) + ' ' + f2(y) +
      'Q' + f2(x - k) + ' ' + f2(y - k) + ' ' + f2(x) + ' ' + f2(y - R) + 'Z';
  }

  /* Soleil : un soleil levant (rayons au-dessus de l'horizon, reflets dessous).
     Lune : un croissant, ses hachures et quelques étoiles. */
  var FIG = {};
  function figure(sym) {
    if (FIG[sym]) return FIG[sym];
    var s = '', f = '';
    if (sym === 'lune') {
      var c1 = [C, C], c2 = [232, 180], r2 = 106, B2 = [c2, r2];
      var I = inter(c1, 124, c2, r2);
      s += 'M' + f2(I[0][0]) + ' ' + f2(I[0][1]) + arc(c1, 124, I[0], I[1], B2, true) + arc(c2, r2, I[1], I[0], [c1, 124], false) + 'Z';
      [111, 98].forEach(function (r) {
        var J = inter(c1, r, c2, r2);
        s += 'M' + f2(J[0][0]) + ' ' + f2(J[0][1]) + arc(c1, r, J[0], J[1], B2, true);
      });
      s += cercle(24);
      var e1 = pol(160, -40), e2 = pol(157, -66), e3 = pol(163, -15), e4 = pol(64, -24);
      f += etoile(e1[0], e1[1], 11) + etoile(e2[0], e2[1], 7) + etoile(e3[0], e3[1], 6) + etoile(e4[0], e4[1], 6) + etoile(C, C, 13);
      var p1 = pol(150, -53), p2 = pol(170, -29), p3 = pol(54, 30);
      f += cercle(1.6, p1[0], p1[1]) + cercle(1.3, p2[0], p2[1]) + cercle(1.5, p3[0], p3[1]);
    } else {
      s += 'M24 200H376';
      s += 'M142 200A58 58 0 0 1 258 200M130 200A70 70 0 0 1 270 200';
      [-150, -110, -70, -30].forEach(function (a) { s += rayon(90, 178, a); });
      [-170, -130, -50, -10].forEach(function (a) { s += rayon(90, 124, a); });
      s += 'M150 214H250M164 228H236M178 242H222M136 258H264';
      f += 'M176 200A24 24 0 0 1 224 200Z';
    }
    FIG[sym] = '<path class="cd-fs" d="' + s + '"/><path class="cd-ff" d="' + f + '"/>';
    return FIG[sym];
  }

  function svg(cls, inner) {
    return '<svg class="cd-svg ' + cls + '" viewBox="0 0 400 400" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  function ornement(i) {
    var b = BANDES[i], t = '', dots = '', k;
    var pas = [5, 10, 15][i], r1 = b[1] - 3.5, r0 = r1 - [5, 4.5, 4][i];
    for (k = pas; k < 360; k += pas) t += rayon(k % 30 === 0 ? r0 - 3 : r0, r1, k - 90);
    for (k = 0; k < 6; k++) { var p = pol(b[0] + 6, -60 + k * 60); dots += cercle(1.5, p[0], p[1]); }
    var y0 = C - b[1] + 4, y1 = C - b[0] - 4;
    var canal = 'M198.2 ' + y0 + 'V' + y1 + 'M201.8 ' + y0 + 'V' + y1;
    var chevron = 'M195.5 ' + (y0 + 1) + 'L200 ' + (y0 + 5.5) + 'L204.5 ' + (y0 + 1);
    return '<path class="cd-o-t" d="' + t + '"/><path class="cd-o-d" d="' + dots + '"/>' +
      '<path class="cd-o-n" d="' + canal + '"/><path class="cd-o-c" d="' + chevron + '"/>';
  }

  function socleSVG(id, sym) {
    var s = '<defs>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3e2" stop-opacity=".17"/><stop offset=".45" stop-color="#fff3e2" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#fff3e2" stop-opacity="0"/><stop offset="1" stop-color="#fff3e2" stop-opacity=".12"/></linearGradient>' +
      '<radialGradient id="' + id + 'm" cx=".4" cy=".34" r=".72"><stop offset="0" stop-color="#2d2925"/><stop offset="1" stop-color="#15130f"/></radialGradient>' +
      '<clipPath id="' + id + 'k"><circle cx="200" cy="200" r="33"/></clipPath>' +
      '</defs>';
    var ticks = '', k;
    for (k = 6; k < 354; k += 6) ticks += rayon(190.5, 196, k - 90);
    s += '<path d="' + ticks + '" stroke="#1c140b" stroke-opacity=".65" stroke-width=".9" fill="none"/>';
    s += '<path fill="#000" fill-opacity=".16" fill-rule="evenodd" d="' + cercle(132) + cercle(85) + '"/>';
    BANDES.forEach(function (b) {
      s += '<circle cx="200" cy="200" r="' + (b[1] - 0.6) + '" fill="none" stroke="url(#' + id + 'h)" stroke-width="1.3"/>';
      s += '<circle cx="200" cy="200" r="' + (b[0] + 0.6) + '" fill="none" stroke="url(#' + id + 'b)" stroke-width="1.3"/>';
    });
    RAINURES.forEach(function (r) {
      s += '<circle cx="200" cy="200" r="' + r + '" fill="none" stroke="#050404" stroke-opacity=".92" stroke-width="3"/>';
    });
    s += '<circle cx="200" cy="200" r="33" fill="url(#' + id + 'm)"/>';
    s += '<circle cx="200" cy="200" r="32.4" fill="none" stroke="url(#' + id + 'h)" stroke-width="1.2"/>';
    s += '<g clip-path="url(#' + id + 'k)"><g class="cd-go" transform="translate(0 -.8)">' + figure(sym) + '</g><g class="cd-gv">' + figure(sym) + '</g></g>';
    return svg('cd-s', s);
  }

  function bagueHTML(id, i, sym) {
    var b = BANDES[i], cid = id + 'c' + i;
    var grav = '<defs><clipPath id="' + cid + '"><path clip-rule="evenodd" d="' + cercle(b[1]) + cercle(b[0]) + '"/></clipPath></defs>' +
      ornement(i) +
      '<g clip-path="url(#' + cid + ')"><g class="cd-go" transform="translate(0 -.8)">' + figure(sym) + '</g><g class="cd-gv">' + figure(sym) + '</g></g>';
    var lit = '<g clip-path="url(#' + cid + ')" class="cd-gl">' + figure(sym) + '</g>';
    return '<div class="cd-bague">' + svg('cd-b-grav', grav) + svg('cd-b-lit', lit) + '</div>';
  }

  function lumieresHTML(sym) {
    var rn = '', cr = '<path class="cd-cr" data-k="c" pathLength="1" d="M200 13V200"/>';
    RAINURES.forEach(function (r, i) {
      rn += '<circle class="cd-rn" data-i="' + i + '" cx="200" cy="200" r="' + r + '"/>';
      var y0 = f2(C - r), y1 = f2(C + r);
      cr += '<path class="cd-cr" data-k="' + i + '" pathLength="1" d="M200 ' + y0 + 'A' + r + ' ' + r + ' 0 0 0 200 ' + y1 + '"/>';
      cr += '<path class="cd-cr" data-k="' + i + '" pathLength="1" d="M200 ' + y0 + 'A' + r + ' ' + r + ' 0 0 1 200 ' + y1 + '"/>';
    });
    rn += '<circle class="cd-point" cx="200" cy="15" r="1.9"/>';
    return svg('cd-l-rn', rn) + svg('cd-l-cr', cr) +
      '<div class="cd-l-sym">' + svg('cd-l-symbole', '<g class="cd-gl">' + figure(sym) + '</g>') + '</div>';
  }

  function art(sym, id) {
    var h = '<div class="cd-art"><div class="cd-socle"><i class="cd-grain"></i></div>' + socleSVG(id, sym);
    for (var i = 0; i < 3; i++) h += bagueHTML(id, i, sym);
    return h + lumieresHTML(sym) + '<i class="cd-cliquet"></i><i class="cd-reflet"></i><i class="cd-arete"></i></div>';
  }

  function ornementPorte() {
    var s = '', k;
    [108, 111.5, 150, 153].forEach(function (r) {
      s += 'M' + (-r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z';
    });
    for (k = 0; k < 360; k += 6) {
      var t = k * Math.PI / 180, c = Math.cos(t), si = Math.sin(t);
      s += 'M' + f2(117 * c) + ' ' + f2(117 * si) + 'L' + f2(145 * c) + ' ' + f2(145 * si);
    }
    return '<svg class="cd-orn" viewBox="-170 -170 340 340" aria-hidden="true" focusable="false">' +
      '<g class="cd-orn-o" transform="translate(0 -.6)"><path d="' + s + '"/></g><g class="cd-orn-c"><path d="' + s + '"/></g></svg>';
  }

  /* ------------------------------------------------------------------------
     Poussière (canvas, quelques grains qui tombent de la fente)
     ------------------------------------------------------------------------ */
  function poussiere(cv, o) {
    if (!cv || reduit() || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(2, W.devicePixelRatio || 1), Wd = cv.clientWidth, H = cv.clientHeight;
    if (!Wd || !H) return;
    cv.width = Math.round(Wd * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = Wd / 2, cy = H / 2, P = [], i, creme = [244, 239, 230];
    for (i = 0; i < o.n; i++) {
      var cote = Math.random() < 0.5 ? -1 : 1;
      P.push({
        x: cx + cote * Math.random() * 3, y: cy + (Math.random() * 2 - 1) * o.h / 2,
        vx: cote * (6 + Math.random() * o.v), vy: -10 + Math.random() * 16, g: 16 + Math.random() * 30,
        vie: 1.2 + Math.random() * 1.6, age: -Math.random() * o.etale,
        r: 0.5 + Math.random() * 1.3, a: 0.35 + Math.random() * 0.5,
        c: (Math.random() < 0.55 ? o.rgb : creme).join(',')
      });
    }
    var der = now();
    (function pas() {
      if (!cv.isConnected) return;
      var t = now(), dt = Math.min(0.05, (t - der) / 1000), vivant = false;
      der = t;
      ctx.clearRect(0, 0, Wd, H);
      for (i = 0; i < P.length; i++) {
        var p = P[i];
        p.age += dt;
        if (p.age >= p.vie) continue;
        vivant = true;
        if (p.age < 0) continue;
        p.vy += p.g * dt; p.vx *= (1 - 0.9 * dt);
        p.x += p.vx * dt; p.y += p.vy * dt;
        var k = p.age / p.vie, al = p.a * Math.min(1, p.age * 5) * (1 - k) * (1 - k);
        ctx.fillStyle = 'rgba(' + p.c + ',' + f2(al) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      if (vivant) requestAnimationFrame(pas); else ctx.clearRect(0, 0, Wd, H);
    })();
  }

  /* Défilement bloqué pendant le passage */
  function bloq(e) { e.preventDefault(); e.stopImmediatePropagation(); }
  function bloqTouche(e) {
    if (/^(?: |Spacebar|PageDown|PageUp|ArrowDown|ArrowUp|Home|End)$/.test(e.key)) bloq(e);
  }
  var OPT = { capture: true, passive: false };
  var BLOQUE = false;
  function bloquer(on) {
    if (BLOQUE === on) return;
    BLOQUE = on;
    var f = on ? 'addEventListener' : 'removeEventListener';
    W[f]('wheel', bloq, OPT);
    W[f]('touchmove', bloq, OPT);
    W[f]('keydown', bloqTouche, OPT);
  }

  /* ------------------------------------------------------------------------
     La porte (départ et arrivée partagent le même dessin)
     ------------------------------------------------------------------------ */
  function creerPorte(sym, rgb, classes) {
    var el = D.createElement('div'), id = 'cdp' + (++NUM);
    el.className = 'cd-porte ' + (classes || '');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-symbole', sym);
    el.style.setProperty('--cd-l-rgb', rgb.join(' '));
    var battant = function (c) {
      return '<div class="cd-battant cd-battant--' + c + '"><div class="cd-battant__in"><i class="cd-grain"></i>' + ornementPorte() +
        '<div class="cd-medaillon"><i class="cd-ombre"></i>' + art(sym, id + c) + '</div></div></div>';
    };
    el.innerHTML = '<i class="cd-porte__ombre"></i><div class="cd-porte__lum"></div>' + battant('g') + battant('d') +
      '<i class="cd-porte__fente"></i><i class="cd-porte__halo"></i><canvas class="cd-poussiere"></canvas>';
    (D.body || HTML).appendChild(el);
    var q = function (s) { return el.querySelector(s); };
    return {
      el: el, sym: sym, rgb: rgb,
      g: q('.cd-battant--g'), d: q('.cd-battant--d'),
      ombre: q('.cd-porte__ombre'), lum: q('.cd-porte__lum'), fente: q('.cd-porte__fente'),
      halo: q('.cd-porte__halo'), cv: q('.cd-poussiere')
    };
  }

  /* ------------------------------------------------------------------------
     Le grondement : la page tremble de 2 px pendant 200 ms, sans rebond.
     On décale avec la propriété « translate » (elle s'ajoute aux transformations de la page)
     et jamais un ancêtre d'un élément fixe (une scène épinglée ne doit pas sauter).
     ------------------------------------------------------------------------ */
  var PAS_GRONDE = [[0, 0], [2, -1], [-2, 1], [1, 2], [-2, -1], [2, 1], [-1, -2], [1, 1], [0, 0]];

  function ignorer(el) {
    var t = el.tagName;
    if (t === 'SCRIPT' || t === 'STYLE' || t === 'LINK' || t === 'TEMPLATE' || t === 'NOSCRIPT' || t === 'META') return true;
    var c = typeof el.className === 'string' ? el.className : '';
    return /(?:^|\s)(?:cd-porte|cd-fil|kz-passage)(?:\s|$)/.test(c);
  }
  function cibles() {
    var b = D.body;
    if (!b) return [];
    var porteurs = [], n = 0, el;
    var tw = D.createTreeWalker(b, 1, {
      acceptNode: function (x) { return (x.ownerSVGElement || ignorer(x)) ? 2 : 1; }   /* 2 = REJECT, 1 = ACCEPT */
    });
    while ((el = tw.nextNode()) && n++ < 6000) {
      if (getComputedStyle(el).position !== 'fixed') continue;
      for (var p = el.parentElement; p && p !== b; p = p.parentElement) {
        if (porteurs.indexOf(p) > -1) break;
        porteurs.push(p);
      }
    }
    var out = [];
    (function prendre(parent) {
      for (var c = parent.firstElementChild; c; c = c.nextElementSibling) {
        if (ignorer(c)) continue;
        if (porteurs.indexOf(c) > -1) prendre(c); else out.push(c);
      }
    })(b);
    return out;
  }
  function gronder() {
    if (reduit()) return;
    var ok = !!(D.body && D.body.animate && W.CSS && CSS.supports && CSS.supports('translate', '1px 1px'));
    if (!ok) return;
    var kf = PAS_GRONDE.map(function (p) { return { translate: p[0] + 'px ' + p[1] + 'px' }; });
    HTML.classList.add('cd-gronde');
    cibles().forEach(function (el) {
      try { el.animate(kf, { duration: 200, easing: 'linear', composite: 'add' }); } catch (e) {}
    });
    at(0.24, function () { HTML.classList.remove('cd-gronde'); });
  }
  function secousse(el, amp, ms) {
    if (!el || !el.animate || reduit()) return;
    var kf = [[0, 0], [amp, 0], [-amp, amp / 2], [amp / 2, -amp / 2], [0, 0]].map(function (p) {
      return { transform: 'translate(' + p[0] + 'px,' + p[1] + 'px)' };
    });
    try { el.animate(kf, { duration: ms, easing: 'linear' }); } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     Le fil : un œillet à l'origine, une chaîne à billes, le point tiré
     ------------------------------------------------------------------------ */
  var EN_COURS = false, FIL = null, SECOURS = 0, TAIRE = -1e9;

  function symDe(dot) { return dot.getAttribute('data-symbole') === 'lune' ? 'lune' : 'soleil'; }
  function lumiereDe(dot, sym) {
    var cs = getComputedStyle(dot);
    var v = (cs.getPropertyValue('--cordon-lumiere') || '').trim() || (cs.getPropertyValue('--sceau-lumiere') || '').trim();
    return rgbDe(v, SYM[sym].rgb);
  }
  function urlPorte(v) {
    if (!v) return '';
    try { var u = new URL(v, location.href); u.hash = 'porte'; return u.href; } catch (e) { return v.split('#')[0] + '#porte'; }
  }
  function urlDe(dot) { return urlPorte(dot.getAttribute('data-vers')); }

  function creerFil(dot) {
    var r = dot.getBoundingClientRect(), sym = symDe(dot), rgb = lumiereDe(dot, sym);
    var w = f2(r.width || 7), h = f2(r.height || 7);
    var el = D.createElement('div');
    el.className = 'cd-fil';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'left:' + f2(r.left + r.width / 2) + 'px;top:' + f2(r.top + r.height / 2) + 'px;--cd-l-rgb:' + rgb.join(' ');
    el.innerHTML = '<i class="cd-fil__oeillet"></i>' +
      '<svg class="cd-fil__svg" viewBox="-60 -20 120 300" aria-hidden="true" focusable="false">' +
        '<path class="cd-fil__lueur" d="M0 0"/><path class="cd-fil__chaine" d="M0 0"/></svg>' +
      '<i class="cd-fil__point"></i>';
    var point = el.querySelector('.cd-fil__point');
    point.style.cssText = 'width:' + w + 'px;height:' + h + 'px;margin:' + f2(-h / 2) + 'px 0 0 ' + f2(-w / 2) + 'px;background:' + getComputedStyle(dot).backgroundColor;
    (D.body || HTML).appendChild(el);
    dot.classList.add('is-tire');
    HTML.classList.add('cd-tire');
    var F = {
      el: el, dot: dot, sym: sym, rgb: rgb, url: urlDe(dot),
      x: 0, y: 0, cran: false, raf: 0, chaud: false,
      point: point, oeil: el.querySelector('.cd-fil__oeillet'), paths: arr(el.querySelectorAll('path'))
    };
    FIL = F;
    return F;
  }

  function peindre(F) {
    F.point.style.transform = 'translate3d(' + f2(F.x) + 'px,' + f2(F.y) + 'px,0)';
    /* La chaîne part du point : les billes suivent le point et sortent de l'œillet. */
    var d = 'M' + f2(F.x) + ' ' + f2(F.y) + 'L0 0';
    F.paths.forEach(function (p) { p.setAttribute('d', d); });
    F.oeil.style.opacity = String(f2(Math.min(1, F.y / 16)));
  }
  function demander(F) {
    if (!F.raf) F.raf = requestAnimationFrame(function () { F.raf = 0; peindre(F); });
  }

  function cran(F, on) {
    if (F.cran === on) return;
    F.cran = on;
    F.el.classList.toggle('is-cran', on);
    if (!on) return;
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
    prechauffer(F);
  }

  /* Au cran, on prépare l'autre page (document et portrait du hero). */
  function prechauffer(F) {
    if (F.chaud || !F.url) return;
    F.chaud = true;
    try {
      var l = D.createElement('link');
      l.rel = 'prefetch'; l.href = F.url.split('#')[0];
      D.head.appendChild(l);
      var jour = HTML.getAttribute('data-theme') === 'light';
      var imgs = F.sym === 'soleil' ? [SYM.soleil.img, jour ? GLOBE.jour : GLOBE.nuit, jour ? 'assets/terre/earth-blue-marble.jpg' : 'assets/terre/earth-night.jpg'] : [SYM[F.sym].img, PAYSAGE];
      imgs.forEach(function (p) { var i = new Image(); i.decoding = 'async'; i.src = asset(p); });
      if (F.sym === 'soleil') {
        var t = D.createElement('link');
        t.rel = 'prefetch'; t.href = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        D.head.appendChild(t);
      }
    } catch (e) {}
  }

  function suivre(F, dx, dy) {
    var t = Math.max(0, dy);
    if (!F.cran && t >= CRAN) cran(F, true);
    else if (F.cran && t < DECRAN) cran(F, false);
    var y = t <= CRAN ? t * SUIT : CRAN * SUIT + Math.min(BUTEE, (t - CRAN) * AU_DELA);
    F.x = Math.max(-12, Math.min(12, dx * 0.12));
    F.y = y + (F.cran ? DECLIC : 0);
    demander(F);
  }

  function finFil(F) {
    if (F.raf) { cancelAnimationFrame(F.raf); F.raf = 0; }
    retirer(F.el);
    F.dot.classList.remove('is-tire');
    HTML.classList.remove('cd-tire');
    if (FIL === F) FIL = null;
  }

  /* Relâché avant le cran : le point remonte, rien ne se passe. */
  function relacher(F) {
    cran(F, false);
    var x0 = F.x, y0 = F.y;
    tween(reduit() ? 0 : 0.42, expoOut, function (k) { F.x = x0 * (1 - k); F.y = y0 * (1 - k); peindre(F); }, function () { finFil(F); });
  }

  /* Relâché après le cran : le point remonte d'un coup sec et le mécanisme s'enclenche. */
  function declencher(F) {
    if (EN_COURS) { relacher(F); return; }
    EN_COURS = true;
    bloquer(true);
    memoriser(F.sym, F.rgb, modeDe(F.sym));
    var x0 = F.x, y0 = F.y;
    tween(reduit() ? 0 : 0.17, sec, function (k) { F.x = x0 * (1 - k); F.y = y0 * (1 - k); peindre(F); }, function () {
      var dot = F.dot;
      finFil(F);
      dot.style.setProperty('--cd-l-rgb', F.rgb.join(' '));
      dot.classList.add('is-enclenche');
      at(0.05, function () { dot.classList.remove('is-enclenche'); });
      enclencher(F.sym, F.rgb, F.url);
    });
  }

  function modeDe(sym, o) {
    var m = o && o.mode;
    return m === 'porte' || m === 'plongee' || m === 'decollage' ? m : (sym === 'soleil' ? 'plongee' : 'decollage');
  }
  function memoriser(sym, rgb, m) {
    try { sessionStorage.setItem(CLE, JSON.stringify({ s: sym, rgb: rgb, m: m || modeDe(sym), t: Date.now() })); } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     La DA Terre : la plongée vers la Terre (vers Créateur), le décollage vers les étoiles (vers Pro)
     ------------------------------------------------------------------------ */
  var GLOBE = { nuit: 'assets/terre/globe-nuit.webp', jour: 'assets/terre/globe-jour.webp' };
  var DISQUE = 0.42, COTE = 400;   /* l'image : le disque fait 42 % de son côté ; on la pose à 400 px puis on l'échelonne */
  function globeSrc() { return asset(HTML.getAttribute('data-theme') === 'light' ? GLOBE.jour : GLOBE.nuit); }
  function astreHTML(cls, lueur) {
    return '<div class="' + cls + '">' + (lueur ? '<i class="cd-astre__lueur"></i>' : '') +
      '<img class="cd-astre__globe" alt="" draggable="false" decoding="async" src="' + globeSrc() + '"></div>';
  }
  /* L'astre centré en (x, y), de rayon apparent r (px) */
  function poserAstre(el, x, y, r) {
    var s = r / (COTE * DISQUE);
    el.style.transform = 'translate3d(' + f2(x - COTE / 2) + 'px,' + f2(y - COTE / 2) + 'px,0) scale(' + (Math.round(s * 10000) / 10000) + ')';
  }
  function lisse(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  /* La plongée : le point de lumière devient la Terre, qui grandit jusqu'à remplir l'écran ; l'éclat d'atmosphère */
  function plonger(url, o) {
    o = o || {};
    var vw = W.innerWidth, vh = W.innerHeight;
    var d = o.depuis || {}, x0 = isFinite(d.x) ? +d.x : vw / 2, y0 = isFinite(d.y) ? +d.y : vh / 2;
    var el = D.createElement('div');
    el.className = 'cd-plongee';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = astreHTML('cd-astre', true) + '<i class="cd-eclat"></i>';
    (D.body || HTML).appendChild(el);
    var astre = el.firstChild, eclat = el.querySelector('.cd-eclat');
    var r1 = Math.max(26, Math.min(44, Math.min(vw, vh) * .045));
    if (reduit()) {
      poserAstre(astre, x0, y0, r1);
      to(astre, { o: 0 }, { o: 1 }, { d: 0.4, e: 'doux' });
      to(eclat, { o: 0 }, { o: 1 }, { d: 0.45, delay: 0.55, e: 'doux' }).then(function () { partir(url); });
      return;
    }
    /* 1. Le point de lumière s'ouvre en petite planète bleue */
    poserAstre(astre, x0, y0, 1.2);
    astre.style.opacity = '1';
    tween(0.75, expoOut, function (k) {
      poserAstre(astre, x0, y0, 1.2 + (r1 - 1.2) * k);
      astre.style.setProperty('--cd-flash', f2(1 - k));
    });
    /* 2. La plongée : elle grandit de plus en plus vite et glisse vers le centre ; 3. l'éclat d'atmosphère */
    var rMax = Math.sqrt(vw * vw + vh * vh) * 1.3, cx = vw / 2, cy = vh * .56;
    at(0.82, function () {
      tween(1.25, function (p) { return p; }, function (p) {
        var e = Math.pow(p, 1.7), m = lisse(0, 1, p);
        poserAstre(astre, x0 + (cx - x0) * m, y0 + (cy - y0) * m, r1 * Math.pow(rMax / r1, e));
        eclat.style.opacity = f2(lisse(0.52, 1, p));
      }, function () { partir(url); });
    });
  }

  /* Le décollage : la page se fond dans l'espace, la Terre s'éloigne, les étoiles reviennent */
  function decoller(url) {
    var vw = W.innerWidth, vh = W.innerHeight;
    var el = D.createElement('div');
    el.className = 'cd-envol';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i class="cd-ciel"></i>' + astreHTML('cd-astre', false);
    (D.body || HTML).appendChild(el);
    var ciel = el.firstChild, astre = el.querySelector('.cd-astre');
    astre.style.opacity = '1';
    if (reduit()) {
      poserAstre(astre, vw / 2, vh * .56, Math.min(vw, vh) * .16);
      to(el, { o: 0 }, { o: 1 }, { d: 0.45, e: 'doux' });
      at(0.95, function () { partir(url); });
      return;
    }
    /* L'horizon en bas de l'écran, comme l'orbite du hero */
    var r0 = Math.max(vw * 1.15, vh * 1.25), y0 = vh * .82 + r0, rf = 2.2, yc = vh * .54;
    poserAstre(astre, vw / 2, y0, r0);
    ciel.style.opacity = '0';
    to(el, { o: 0 }, { o: 1 }, { d: 0.5, e: 'doux' });
    at(0.3, function () {
      tween(1.5, function (p) { return p; }, function (p) {
        var e = 1 - Math.pow(1 - p, 1.6), r = r0 * Math.pow(rf / r0, e), k = (r - rf) / (r0 - rf);
        poserAstre(astre, vw / 2, yc + (y0 - yc) * k, r);
        astre.style.opacity = f2(1 - lisse(0.82, 1, p));
        ciel.style.opacity = f2(lisse(0.05, 0.6, p));
        ciel.style.transform = 'scale(' + f2(1.3 - 0.3 * lisse(0, 1, p)) + ')';
      }, function () { partir(url); });
    });
  }

  /* ------------------------------------------------------------------------
     Le passage (page de départ) : grondement, battants, symbole, navigation
     ------------------------------------------------------------------------ */
  function enclencher(sym, rgb, url, o) {
    var m = modeDe(sym, o);
    if (m === 'plongee') { plonger(url, o); return; }
    if (m === 'decollage') { decoller(url); return; }
    var P;
    if (reduit()) {
      P = creerPorte(sym, rgb, 'is-joint is-allume is-instant');
      set(P.fente, { o: 0.85 }); set(P.halo, { o: 1 });
      to(P.el, { o: 0 }, { o: 1 }, { d: 0.45, e: 'doux' });
      at(0.75, function () { partir(url, P); });
      return;
    }
    gronder();
    P = creerPorte(sym, rgb, '');
    /* Même tâche que l'insertion : aucune image ne montre la porte fermée trop tôt. */
    set(P.g, { xp: -101 }); set(P.d, { xp: 101 });
    var t0 = 0.1, dur = 0.72;
    to(P.ombre, { o: 0 }, { o: 0.6 }, { d: dur + 0.1, delay: t0, e: 'doux' });
    to(P.g, null, { xp: 0 }, { d: dur, delay: t0, e: 'ferme' });
    to(P.d, null, { xp: 0 }, { d: dur, delay: t0, e: 'ferme' }).then(function () { impact(P, url); });
  }

  function impact(P, url) {
    P.el.classList.add('is-joint');
    secousse(P.el, 1.5, 150);
    to(P.fente, { o: 1 }, { o: 0.85 }, { d: 0.6, e: 'sortie' });
    poussiere(P.cv, { n: 36, h: W.innerHeight * 0.8, v: 64, rgb: P.rgb, etale: 0.12 });
    at(0.06, function () {
      P.el.classList.add('is-allume');
      to(P.halo, { o: 0 }, { o: 1 }, { d: 1, delay: 0.3, e: 'expo' });
    });
    at(1.12, function () { partir(url, P); });
  }

  function memeDocument(url) {
    try {
      var u = new URL(url, location.href);
      return u.origin === location.origin && u.pathname === location.pathname && u.search === location.search;
    } catch (e) { return false; }
  }

  function partir(url, P) {
    if (!url) {
      if (P) at(0.3, function () { ouvrir(P, function () { liberer(); }); });
      else at(0.3, liberer);
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (memeDocument(url)) { location.replace(url); location.reload(); }
        else location.href = url;
      });
    });
    clearTimeout(SECOURS);
    SECOURS = at(6, liberer);   /* navigation bloquée : on rend la main */
  }

  function liberer() {
    clearTimeout(SECOURS);
    arr(D.querySelectorAll('.cd-porte, .cd-fil, .cd-plongee, .cd-envol')).forEach(retirer);
    arr(D.querySelectorAll('[data-cordon].is-tire')).forEach(function (d) { d.classList.remove('is-tire'); });
    HTML.classList.remove('cd-tire', 'cd-gronde');
    bloquer(false);
    EN_COURS = false;
    FIL = null;
  }

  /* ------------------------------------------------------------------------
     L'ouverture des battants (page d'arrivée)
     ------------------------------------------------------------------------ */
  function ouvrir(P, fin) {
    if (reduit()) {
      to(P.el, { o: 1 }, { o: 0 }, { d: 0.5, e: 'sortie' }).then(fin);
      return;
    }
    P.el.classList.remove('is-joint');
    to(P.fente, null, { o: 0 }, { d: 0.4, e: 'sortie' });
    to(P.halo, null, { o: 0 }, { d: 0.55, e: 'sortie' });
    to(P.lum, { o: 1 }, { o: 0 }, { d: 1.5, e: 'sortie' });
    to(P.g, { xp: 0 }, { xp: -102 }, { d: 1.1, e: 'expo' });
    to(P.d, { xp: 0 }, { xp: 102 }, { d: 1.1, e: 'expo' }).then(fin);
    poussiere(P.cv, { n: 30, h: W.innerHeight * 0.7, v: 70, rgb: P.rgb, etale: 0.35 });
  }

  function arriver() {
    var st = null;
    try { st = JSON.parse(sessionStorage.getItem(CLE) || 'null'); } catch (e) {}
    try { sessionStorage.removeItem(CLE); } catch (e) {}
    var sym = (st && Date.now() - st.t < 60000) ? st.s : null;
    if (sym !== 'soleil' && sym !== 'lune') {
      var mien = D.querySelector('[data-cordon]');
      sym = mien ? (symDe(mien) === 'lune' ? 'soleil' : 'lune') : (HTML.getAttribute('data-univers') === 'pro' ? 'lune' : 'soleil');
    }
    var rgb = (st && st.s === sym && st.rgb && st.rgb.length === 3) ? st.rgb : SYM[sym].rgb;
    W.Cordon.arrivee = true;

    var fini = false, signale = false, P = null, garde;
    function signal() {
      if (signale) return;
      signale = true;
      try { D.dispatchEvent(new CustomEvent('porte:arrivee', { bubbles: true })); } catch (e) {}
    }
    function nettoyer() {
      if (fini) return;
      fini = true;
      clearTimeout(garde);
      signal();
      if (P) retirer(P.el);
      HTML.classList.remove('kz-porte-arrivee');
      HTML.removeAttribute('data-porte-arrivee');
      if (/porte/.test(location.hash)) {
        try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
      }
    }
    garde = at(4.5, nettoyer);

    /* DA Terre : côté Créateur, l'éclat d'atmosphère se dissipe sur la Terre ; côté Pro, les étoiles filent */
    var univ = HTML.getAttribute('data-univers');
    if (univ === 'createur' || univ === 'pro') {
      try {
        var V = D.createElement('div'), terre = univ === 'createur';
        V.className = 'cd-arrivee cd-arrivee--' + (terre ? 'terre' : 'ciel');
        V.setAttribute('aria-hidden', 'true');
        V.innerHTML = terre ? '<i class="cd-eclat"></i>' : '<i class="cd-ciel"></i>';
        (D.body || HTML).appendChild(V);
        P = { el: V };
        HTML.classList.add('kz-porte-arrivee');
        HTML.removeAttribute('data-porte-arrivee');   /* le voile du script prend le relais du voile CSS */
        var parti = false;
        var go = function () {
          if (parti) return;
          parti = true;
          D.removeEventListener('terre:prete', go);
          clearTimeout(garde);
          garde = at(4, nettoyer);
          if (reduit()) {
            at(0.15, signal);
            to(V, { o: 1 }, { o: 0 }, { d: 0.5, e: 'sortie' }).then(nettoyer);
            return;
          }
          if (terre) {
            at(0.3, signal);
            to(V, { o: 1 }, { o: 0 }, { d: 1.5, e: 'sortie' }).then(nettoyer);
          } else {
            var C2 = V.firstChild;
            at(0.25, signal);
            to(C2, { s: 1 }, { s: 1.7 }, { d: 1.4, e: 'expo' });
            to(V, { o: 1 }, { o: 0 }, { d: 1.1, delay: 0.12, e: 'sortie' }).then(nettoyer);
          }
        };
        if (terre && !(W.Terre && W.Terre.prete)) {
          D.addEventListener('terre:prete', go);
          at(2.4, go);   /* la Terre tarde (réseau) : on n'attend pas plus */
        } else at(0.12, go);
      } catch (err) {
        nettoyer();
      }
      return;
    }

    try {
      P = creerPorte(sym, rgb, 'is-joint is-allume is-instant');
      set(P.fente, { o: 0.85 }); set(P.halo, { o: 1 }); set(P.lum, { o: 1 });
      HTML.classList.add('kz-porte-arrivee');
      HTML.removeAttribute('data-porte-arrivee');   /* la porte du script prend le relais du voile CSS */
      requestAnimationFrame(function () { requestAnimationFrame(function () { P.el.classList.remove('is-instant'); }); });
      if (reduit()) {
        at(0.1, function () { ouvrir(P, nettoyer); });
        at(0.25, signal);
        return;
      }
      at(0.3, function () { ouvrir(P, nettoyer); });
      at(0.3 + 0.36, signal);
    } catch (err) {
      nettoyer();
    }
  }

  /* ------------------------------------------------------------------------
     Le geste : Pointer Events (souris et doigt), délégués depuis document
     ------------------------------------------------------------------------ */
  var g = null;

  function cordonDe(t) { return (t && t.closest) ? t.closest('[data-cordon]') : null; }

  function surDown(e) {
    var dot = cordonDe(e.target);
    if (!dot || EN_COURS || FIL || g) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = dot.closest('a');
    if (a) a.setAttribute('draggable', 'false');
    g = { id: e.pointerId, dot: dot, x0: e.clientX, y0: e.clientY, actif: false, F: null };
    try { dot.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function surMove(e) {
    if (!g || g.id !== e.pointerId) return;
    var dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (!g.actif) {
      if (dy < SEUIL) {
        if (Math.abs(dx) > 16 || dy < -12) abandon();
        return;
      }
      g.actif = true;
      g.F = creerFil(g.dot);
    }
    if (e.cancelable) e.preventDefault();
    suivre(g.F, dx, dy);
  }
  function abandon() {
    if (!g) return;
    var gg = g;
    g = null;
    try { gg.dot.releasePointerCapture(gg.id); } catch (err) {}
  }
  function lacher(e, annule) {
    if (!g || g.id !== e.pointerId) return;
    var gg = g;
    g = null;
    if (!gg.actif) return;            /* un simple clic : le lien du logo garde son comportement */
    TAIRE = now();                    /* le clic qui suit un geste ne doit pas suivre le lien */
    if (gg.F.cran && !annule) declencher(gg.F); else relacher(gg.F);
  }

  /* Un clic sur le point suit le lien du logo, dans tous les navigateurs ; après un geste, rien. */
  function surClic(e) {
    var dot = cordonDe(e.target);
    if (!dot) return;
    if (now() - TAIRE < 700 || EN_COURS || FIL) {
      TAIRE = -1e9;
      e.preventDefault(); e.stopPropagation();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
    var a = dot.closest('a[href]');
    if (!a) return;
    e.preventDefault(); e.stopPropagation();
    a.click();
  }

  /* Au clavier : Alt + Flèche bas, le point (ou le logo) ayant le focus. */
  function surTouche(e) {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key !== 'ArrowDown' && e.keyCode !== 40) return;
    var t = e.target, dot = cordonDe(t);
    if (!dot && t && t.closest) { var a = t.closest('.kz-logo'); if (a) dot = a.querySelector('[data-cordon]'); }
    if (!dot || EN_COURS || FIL || g) return;
    e.preventDefault();
    passer(dot);
  }

  /* Le même passage sans geste : le fil descend seul jusqu'au cran, puis on relâche. */
  function passer(dot) {
    if (EN_COURS || FIL) return;
    var F = creerFil(dot);
    if (reduit()) { cran(F, true); declencher(F); return; }
    var but = CRAN * SUIT;
    tween(0.42, douxIO, function (k) { F.y = but * k; peindre(F); }, function () {
      cran(F, true);
      F.y = but + DECLIC;
      peindre(F);
      at(0.2, function () { declencher(F); });
    });
  }
  W.Cordon.passer = function (el) {
    var dot = el && el.nodeType ? el : D.querySelector('[data-cordon]');
    if (dot) passer(dot);
  };

  /* ------------------------------------------------------------------------
     API pour un autre passage secret (le ciel : shared/etoiles.js ; les apps : shared/apps.js).
       Cordon.ouvrirPorte({ vers: 'createur.html', symbole: 'soleil'|'lune', rgb: [r, g, b], depuis: { x, y }, mode })
         saute le fil : la plongée (soleil : vers Créateur, depuis le point { x, y } de l'écran) ou le décollage
         (lune : vers Pro), puis navigation vers vers + « #porte » (même arrivée que le cordon).
         mode: 'porte' garde les battants de pierre. Renvoie false si un passage est déjà en cours.
       Cordon.figure('soleil'|'lune')  le dessin SVG du symbole (repère 0 0 400 400, classes cd-fs / cd-ff).
       Cordon.enCours()                vrai pendant un geste ou un passage du cordon.
     ------------------------------------------------------------------------ */
  function lumiereSym(sym) {
    var dots = arr(D.querySelectorAll('[data-cordon]'));
    for (var i = 0; i < dots.length; i++) if (symDe(dots[i]) === sym) return lumiereDe(dots[i], sym);
    return SYM[sym].rgb;
  }
  W.Cordon.ouvrirPorte = function (o) {
    o = o || {};
    if (EN_COURS || FIL || g) return false;
    var sym = o.symbole === 'lune' ? 'lune' : 'soleil';
    var rgb = (o.rgb && o.rgb.length === 3) ? o.rgb : lumiereSym(sym);
    var url = urlPorte(o.vers || '');
    EN_COURS = true;
    bloquer(true);
    memoriser(sym, rgb, modeDe(sym, o));
    prechauffer({ url: url, sym: sym });
    enclencher(sym, rgb, url, o);
    return true;
  };
  W.Cordon.figure = function (sym) { return figure(sym === 'lune' ? 'lune' : 'soleil'); };
  W.Cordon.enCours = function () { return !!(EN_COURS || FIL || g); };

  /* Retour arrière depuis l'autre page (cache) : on rend la page intacte. */
  W.addEventListener('pageshow', function (e) { if (e.persisted) liberer(); });

  /* ------------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------------ */
  D.addEventListener('pointerdown', surDown, true);
  D.addEventListener('pointermove', surMove, { capture: true, passive: false });
  D.addEventListener('pointerup', function (e) { lacher(e, false); }, true);
  D.addEventListener('pointercancel', function (e) { lacher(e, true); }, true);
  D.addEventListener('lostpointercapture', function (e) { if (g && g.id === e.pointerId) lacher(e, true); }, true);
  D.addEventListener('click', surClic, true);
  D.addEventListener('keydown', surTouche, true);
  D.addEventListener('dragstart', function (e) { if (cordonDe(e.target) || g) e.preventDefault(); }, true);
  D.addEventListener('contextmenu', function (e) { if (g && g.actif) e.preventDefault(); }, true);

  function demarrer() {
    if (location.hash.indexOf('porte') > -1) arriver();
    else HTML.removeAttribute('data-porte-arrivee');
  }
  if (D.body) demarrer();
  else D.addEventListener('DOMContentLoaded', demarrer);
})();
