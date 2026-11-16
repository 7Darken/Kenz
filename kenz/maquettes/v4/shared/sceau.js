/* ==========================================================================
   Le sceau : l'énigme qui fait passer d'un univers à l'autre (Pro <-> Créateur)

   Contrat (BRIEF-V3.md) :
     <link rel="stylesheet" href="shared/sceau.css">                       (dans le <head>)
     <section id="sceau" class="sceau" data-sceau data-vers="createur.html" data-symbole="soleil"></section>
     <script src="shared/sceau.js" defer></script>      (fin du <body>, après GSAP s'il est utilisé)

   - Le script remplit la section : phrase, médaillon (trois anneaux), indice, « Passer ».
   - Résolu : verrouillage en cascade, lumière dans les rainures, symbole, porte qui se fend,
     la lumière remplit l'écran, puis navigation vers data-vers + "#porte".
   - Arrivée : si location.hash === '#porte', la lumière se retire sur la porte fermée,
     les battants s'écartent, puis document reçoit l'événement « sceau:arrivee »,
     et history.replaceState retire #porte.
   - Couleurs : --sceau-lumiere, --bg, --creme (variables CSS de la page).
   - GSAP 3 si présent, sinon Web Animations API. Aucune autre dépendance.
   - Test : data-sceau-test sur la section pré-aligne deux anneaux (inoffensif hors test).
   ========================================================================== */
(function () {
  'use strict';
  if (window.Sceau && window.Sceau.pret) return;

  var D = document;
  var HTML = D.documentElement;

  /* Chemins des images relatifs à ce fichier (shared/sceau.js -> racine du site). */
  var CUR = D.currentScript;
  var SRC = (CUR && CUR.src) || (function () {
    var s = D.querySelector('script[src*="sceau.js"]');
    return s ? s.src : location.href;
  })();
  var BASE = SRC;
  try { BASE = new URL('../', SRC).href; } catch (e) {}
  function asset(p) { try { return new URL(p, BASE).href; } catch (e) { return p; } }

  var G = (window.gsap && typeof window.gsap.to === 'function') ? window.gsap : null;
  var MQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function arr(x) {
    if (!x) return [];
    if (x.nodeType) return [x];
    return Array.prototype.slice.call(x);
  }
  function at(s, fn) { return setTimeout(fn, s * 1000); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function f2(n) { return Math.round(n * 100) / 100; }
  var NUM = 0;

  var SYM = {
    soleil: { rgb: [242, 180, 90], heure: 'doree', portrait: 'assets/img/kenz-moi.webp' },
    lune: { rgb: [157, 184, 255], heure: 'bleue', portrait: 'assets/img/kenz-pro.webp' }
  };
  var PAYSAGE = 'assets/img/paysage-kuala-lumpur.jpg';
  var CLE = 'sceau:porte';
  var NOMS = ['Anneau extérieur', 'Anneau du milieu', 'Anneau intérieur'];
  var DEPART = [2, 4, 1];          /* crans à faire : extérieur, milieu, intérieur */
  var ROT = 0.42;                  /* durée d'un cran (s) */

  window.Sceau = { pret: true, arrivee: location.hash === '#porte' };

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
     Spéc. neutre : xp/yp (%), x/y (px), r (deg), s (échelle), o, f (filter), cp (clip-path), dash.
     ------------------------------------------------------------------------ */
  var E = {
    expo: ['expo.out', 'cubic-bezier(.16,1,.3,1)'],
    sortie: ['power2.out', 'cubic-bezier(.33,1,.68,1)'],
    doux: ['power2.inOut', 'cubic-bezier(.45,0,.55,1)'],
    lourd: ['power3.inOut', 'cubic-bezier(.65,0,.35,1)'],
    vite: ['power2.in', 'cubic-bezier(.55,0,1,.45)']
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
    if (s.dash != null) o.strokeDashoffset = String(s.dash);
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
    if (s.dash != null) o.strokeDashoffset = s.dash;
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
      /* Web Animations : une piste par groupe de propriétés ; une animation interrompue garde sa valeur. */
      var cles = Object.keys(css(els[0], fin, false)).sort().join(' ');
      els.forEach(function (el) {
        var p = el.__scA && el.__scA[cles];
        if (p) { try { if (p.commitStyles) p.commitStyles(); p.cancel(); } catch (e) {} }
      });
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
        function termine() {
          if (fait) return;
          fait = true;
          if (el.__scA && el.__scA[cles] === a) delete el.__scA[cles];
          if (--reste === 0) ok();
        }
        el.__scA = el.__scA || {};
        el.__scA[cles] = a;
        a.onfinish = function () { set(el, fin); termine(); try { a.cancel(); } catch (e) {} };
        a.oncancel = termine;
      });
    });
  }

  /* ------------------------------------------------------------------------
     Dessin du médaillon (SVG, viewBox 400, centre 200)
     ------------------------------------------------------------------------ */
  var C = 200;
  var BANDES = [[135, 185], [85, 132], [36, 82]];      /* anneaux : extérieur, milieu, intérieur */
  var RAINURES = [186.5, 133.5, 83.5, 34.5];             /* rainure de chaque anneau, puis du moyeu */

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
  /* arc du cercle (c, r) de p à q, du côté dont le milieu est hors (dehors=true) ou dans (false) le cercle « autre » */
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

  /* Le symbole complet, découpé ensuite par chaque anneau.
     Soleil : un soleil levant (rayons au-dessus de l'horizon, reflets dessous).
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
    FIG[sym] = '<path class="sc-fs" d="' + s + '"/><path class="sc-ff" d="' + f + '"/>';
    return FIG[sym];
  }

  function svg(cls, inner) {
    return '<svg class="sc-svg ' + cls + '" viewBox="0 0 400 400" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  /* Ornement propre à chaque anneau : graduations, crans, rainure-repère en haut */
  function ornement(i) {
    var b = BANDES[i], t = '', dots = '', k;
    var pas = [5, 10, 15][i], r1 = b[1] - 3.5, r0 = r1 - [5, 4.5, 4][i];
    for (k = pas; k < 360; k += pas) t += rayon(k % 30 === 0 ? r0 - 3 : r0, r1, k - 90);
    for (k = 0; k < 6; k++) { var p = pol(b[0] + 6, -60 + k * 60); dots += cercle(1.5, p[0], p[1]); }
    var y0 = C - b[1] + 4, y1 = C - b[0] - 4;
    var canal = 'M198.2 ' + y0 + 'V' + y1 + 'M201.8 ' + y0 + 'V' + y1;
    var chevron = 'M195.5 ' + (y0 + 1) + 'L200 ' + (y0 + 5.5) + 'L204.5 ' + (y0 + 1);
    return '<path class="sc-o-t" d="' + t + '"/><path class="sc-o-d" d="' + dots + '"/>' +
      '<path class="sc-o-n" d="' + canal + '"/><path class="sc-o-c" d="' + chevron + '"/>';
  }

  function socleSVG(id, sym) {
    var s = '<defs>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3e2" stop-opacity=".17"/><stop offset=".45" stop-color="#fff3e2" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#fff3e2" stop-opacity="0"/><stop offset="1" stop-color="#fff3e2" stop-opacity=".12"/></linearGradient>' +
      '<radialGradient id="' + id + 'm" cx=".4" cy=".34" r=".72"><stop offset="0" stop-color="#2d2925"/><stop offset="1" stop-color="#15130f"/></radialGradient>' +
      '<clipPath id="' + id + 'k"><circle cx="200" cy="200" r="33"/></clipPath>' +
      '</defs>';
    var ticks = '', k;
    for (k = 6; k < 360; k += 6) if (k < 354) ticks += rayon(190.5, 196, k - 90);
    s += '<path d="' + ticks + '" stroke="#1c140b" stroke-opacity=".65" stroke-width=".9" fill="none"/>';
    s += '<path fill="#000" fill-opacity=".16" fill-rule="evenodd" d="' + cercle(132) + cercle(85) + '"/>';
    BANDES.forEach(function (b) {
      s += '<circle cx="200" cy="200" r="' + (b[1] - .6) + '" fill="none" stroke="url(#' + id + 'h)" stroke-width="1.3"/>';
      s += '<circle cx="200" cy="200" r="' + (b[0] + .6) + '" fill="none" stroke="url(#' + id + 'b)" stroke-width="1.3"/>';
    });
    RAINURES.forEach(function (r) {
      s += '<circle cx="200" cy="200" r="' + r + '" fill="none" stroke="#050404" stroke-opacity=".92" stroke-width="3"/>';
    });
    s += '<circle cx="200" cy="200" r="33" fill="url(#' + id + 'm)"/>';
    s += '<circle cx="200" cy="200" r="32.4" fill="none" stroke="url(#' + id + 'h)" stroke-width="1.2"/>';
    s += '<g clip-path="url(#' + id + 'k)"><g class="sc-go" transform="translate(0 -.8)">' + figure(sym) + '</g><g class="sc-gv">' + figure(sym) + '</g></g>';
    return svg('sc-s', s);
  }

  function bagueHTML(id, i, sym) {
    var b = BANDES[i], cid = id + 'c' + i;
    var grav = '<defs><clipPath id="' + cid + '"><path clip-rule="evenodd" d="' + cercle(b[1]) + cercle(b[0]) + '"/></clipPath></defs>' +
      ornement(i) +
      '<g clip-path="url(#' + cid + ')"><g class="sc-go" transform="translate(0 -.8)">' + figure(sym) + '</g><g class="sc-gv">' + figure(sym) + '</g></g>';
    var lit = '<g clip-path="url(#' + cid + ')" class="sc-gl">' + figure(sym) + '</g>';
    return '<div class="sc-bague" data-i="' + i + '">' + svg('sc-b-grav', grav) + svg('sc-b-lit', lit) + '</div>';
  }

  function lumieresHTML(sym) {
    var rn = '', cr = '<path class="sc-cr" data-k="c" pathLength="1" d="M200 13V200"/>';
    RAINURES.forEach(function (r, i) {
      rn += '<circle class="sc-rn" data-i="' + i + '" cx="200" cy="200" r="' + r + '"/>';
      var y0 = f2(C - r), y1 = f2(C + r);
      cr += '<path class="sc-cr" data-k="' + i + '" pathLength="1" d="M200 ' + y0 + 'A' + r + ' ' + r + ' 0 0 0 200 ' + y1 + '"/>';
      cr += '<path class="sc-cr" data-k="' + i + '" pathLength="1" d="M200 ' + y0 + 'A' + r + ' ' + r + ' 0 0 1 200 ' + y1 + '"/>';
    });
    rn += '<circle class="sc-point" cx="200" cy="15" r="1.9"/>';
    return svg('sc-l-rn', rn) + svg('sc-l-cr', cr) +
      '<div class="sc-l-sym">' + svg('sc-l-symbole', '<g class="sc-gl">' + figure(sym) + '</g>') + '</div>';
  }

  function art(sym, id) {
    var h = '<div class="sc-art" aria-hidden="true"><div class="sc-socle"><i class="sc-grain"></i></div>' + socleSVG(id, sym);
    for (var i = 0; i < 3; i++) h += bagueHTML(id, i, sym);
    return h + lumieresHTML(sym) + '<i class="sc-cliquet"></i><i class="sc-reflet"></i><i class="sc-arete"></i></div>';
  }

  /* ------------------------------------------------------------------------
     Poussière (canvas, quelques grains qui tombent de la fente)
     ------------------------------------------------------------------------ */
  function poussiere(cv, o) {
    if (!cv || reduit() || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = W / 2, cy = H / 2, P = [], i, creme = [244, 239, 230];
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
      var t = now(), dt = Math.min(0.05, (t - der) / 1000), vivant = false;
      der = t;
      ctx.clearRect(0, 0, W, H);
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
      if (vivant) requestAnimationFrame(pas); else ctx.clearRect(0, 0, W, H);
    })();
  }

  /* Défilement bloqué pendant l'ouverture */
  function bloq(e) { e.preventDefault(); e.stopImmediatePropagation(); }
  function bloqTouche(e) {
    if (/^(?: |Spacebar|PageDown|PageUp|ArrowDown|ArrowUp|Home|End)$/.test(e.key)) bloq(e);
  }
  var OPT = { capture: true, passive: false };
  function bloquer(on) {
    var f = on ? 'addEventListener' : 'removeEventListener';
    window[f]('wheel', bloq, OPT);
    window[f]('touchmove', bloq, OPT);
    window[f]('keydown', bloqTouche, OPT);
  }

  /* ------------------------------------------------------------------------
     Anneaux : rotation au cran, glisser, clavier
     ------------------------------------------------------------------------ */
  /* Ralentit, marque un temps, puis tombe dans le cran (sans dépasser). */
  function cran(p) {
    if (p >= 1) return 1;
    var k = 0.76, v = 0.94;
    if (p < k) { var q = p / k; return v * (1 - Math.pow(1 - q, 3)); }
    var q2 = (p - k) / (1 - k);
    return v + (1 - v) * q2 * q2;
  }
  function Anneau(S, i, a) {
    this.S = S; this.i = i; this.a = a; this.t = a; this.de = a;
    this.t0 = 0; this.dur = 0; this.raf = 0; this.els = [];
  }
  Anneau.prototype.peindre = function () {
    var v = 'rotate(' + f2(this.a) + 'deg)';
    for (var k = 0; k < this.els.length; k++) this.els[k].style.transform = v;
  };
  Anneau.prototype.ok = function () { return Math.round(this.t / 60) % 6 === 0; };
  Anneau.prototype.vers = function (cible, dur) {
    var self = this, S = this.S;
    this.de = this.a; this.t = cible; this.t0 = now(); this.dur = reduit() ? 0 : dur;
    S.med.classList.add('is-tourne');
    if (!this.raf) {
      var pas = function () {
        var p = self.dur ? Math.min(1, (now() - self.t0) / (self.dur * 1000)) : 1;
        self.a = self.de + (self.t - self.de) * cran(p);
        self.peindre(); cliquet(S);
        if (p < 1) { self.raf = requestAnimationFrame(pas); return; }
        self.raf = 0; self.a = self.t; self.peindre(); pose(S, self);
      };
      this.raf = requestAnimationFrame(pas);
    }
    etat(S, this.i);
  };

  function cliquet(S) {
    var m = 0;
    S.rings.forEach(function (r) { var fr = ((r.a / 60) % 1 + 1) % 1; m = Math.max(m, Math.sin(Math.PI * fr)); });
    var v = 'translateY(' + f2(-m * 34) + '%)';
    S.cliquets.forEach(function (c) { c.style.transform = v; });
  }

  function etat(S, i) {
    var r = S.rings[i], ok = !r.raf && r.ok(), lk = S.lock[i];
    var rn = lk ? 1 : ok ? 0.55 : (S.survol === i ? 0.2 : 0);
    var lit = lk ? 0.9 : ok ? 0.38 : 0;
    S.q('.sc-rn[data-i="' + i + '"]').forEach(function (e) { e.style.opacity = rn; });
    S.q('.sc-bague[data-i="' + i + '"] .sc-b-lit').forEach(function (e) { e.style.opacity = lit; });
    S.etats[i].textContent = ok ? 'Aligné.' : 'Pas aligné.';
  }

  /* Petit éclat de la rainure quand l'anneau tombe dans un cran. */
  function eclat(els, v) {
    els.forEach(function (e) {
      var fin = e.style.opacity;
      e.style.transition = 'none'; e.style.opacity = v;
      void e.getBoundingClientRect();
      e.style.transition = ''; e.style.opacity = fin;
    });
  }

  function pose(S, r) {
    if (!S.rings.some(function (x) { return x.raf; })) S.med.classList.remove('is-tourne');
    etat(S, r.i);
    if (S.etat !== 'jeu') return;
    if (!r.ok()) eclat(S.q('.sc-rn[data-i="' + r.i + '"]'), 0.3);
    dire(S, NOMS[r.i] + (r.ok() ? ' : aligné.' : ' : pas encore aligné.'));
    if (S.rings.every(function (x) { return !x.raf && x.ok(); })) resoudre(S, 'jeu');
  }

  function dire(S, txt) {
    S.live.textContent = '';
    at(0.05, function () { S.live.textContent = txt; });
  }

  function compter(S) {
    S.coups++;
    if (S.coups >= 8) aide(S);
  }

  /* Aide : le bon fragment de chaque anneau scintille faiblement, une seule fois. */
  function aide(S) {
    if (S.aideFaite || S.etat !== 'jeu') return;
    S.aideFaite = true;
    clearTimeout(S.aideT);
    S.rings.forEach(function (r, i) {
      at(i * 0.14, function () {
        if (S.etat !== 'jeu') return;
        S.q('.sc-bague[data-i="' + i + '"] .sc-b-lit').forEach(function (e) { e.style.opacity = '.55'; });
        at(0.8, function () { etat(S, i); });
      });
    });
    S.indice.classList.add('is-eclat');
    at(1.8, function () { S.indice.classList.remove('is-eclat'); });
  }
  function minuter(S) {
    if (!S.aideT && !S.aideFaite) S.aideT = setTimeout(function () { aide(S); }, 10000);
  }

  function angle(S, e) {
    var b = S.med.getBoundingClientRect();
    return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI;
  }

  function brancher(S) {
    var g = null, taire = -1e9;
    S.btns.forEach(function (b, i) {
      var r = S.rings[i];
      function survol(on) { if (on) S.survol = i; else if (S.survol === i) S.survol = -1; etat(S, i); }
      b.addEventListener('pointerenter', function () { survol(true); });
      b.addEventListener('pointerleave', function () { survol(false); });
      b.addEventListener('focus', function () { survol(true); });
      b.addEventListener('blur', function () { survol(false); });

      b.addEventListener('pointerdown', function (e) {
        if (S.etat !== 'jeu' || (e.pointerType === 'mouse' && e.button !== 0)) return;
        g = { id: e.pointerId, i: i, x: e.clientX, y: e.clientY, der: angle(S, e), cumul: 0, base: r.a, cible: r.t, bouge: false };
        try { b.setPointerCapture(e.pointerId); } catch (err) {}
      });
      b.addEventListener('pointermove', function (e) {
        if (!g || g.id !== e.pointerId || g.i !== i) return;
        var a = angle(S, e), d = a - g.der;
        if (d > 180) d -= 360; else if (d < -180) d += 360;
        g.der = a; g.cumul += d;
        if (!g.bouge && Math.sqrt(Math.pow(e.clientX - g.x, 2) + Math.pow(e.clientY - g.y, 2)) > 6) {
          g.bouge = true;
          if (r.raf) { cancelAnimationFrame(r.raf); r.raf = 0; }
          g.base = r.a; g.cumul = 0;
          S.med.classList.add('is-glisse', 'is-tourne');
        }
        if (g.bouge) { r.a = g.base + g.cumul; r.t = r.a; r.peindre(); cliquet(S); etat(S, i); }
      });
      function lacher(e, annule) {
        if (!g || g.id !== e.pointerId || g.i !== i) return;
        var gg = g;
        g = null; taire = now();
        S.med.classList.remove('is-glisse');
        if (S.etat !== 'jeu') return;
        if (!gg.bouge) {
          if (!annule) { compter(S); r.vers(gg.cible + 60, ROT); }
          return;
        }
        var cible = Math.round(r.a / 60) * 60;
        if (cible !== Math.round(gg.cible / 60) * 60) compter(S);
        r.vers(cible, 0.26);
      }
      b.addEventListener('pointerup', function (e) { lacher(e, false); });
      b.addEventListener('pointercancel', function (e) { lacher(e, true); });
      b.addEventListener('click', function () {
        if (now() - taire < 450 || S.etat !== 'jeu') return;   /* déjà traité au pointeur */
        compter(S); r.vers(r.t + 60, ROT);
      });
      b.addEventListener('keydown', function (e) {
        if (S.etat !== 'jeu') return;
        var s = 0;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') s = -1;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') s = 1;
        if (!s) return;
        e.preventDefault();
        compter(S); r.vers(r.t + 60 * s, ROT);
      });
    });
    var p = S.sec.querySelector('.sc-passer');
    if (p) p.addEventListener('click', function (e) {
      e.preventDefault();
      if (S.etat === 'jeu') resoudre(S, 'passer');
    });
  }

  /* ------------------------------------------------------------------------
     L'ouverture (page de départ)
     ------------------------------------------------------------------------ */
  function resoudre(S, via) {
    if (S.etat !== 'jeu') return;
    S.etat = 'ouverture';
    clearTimeout(S.aideT);
    S.sec.classList.add('is-ouverture');
    S.btns.forEach(function (b) { b.setAttribute('aria-disabled', 'true'); });
    dire(S, via === 'passer' ? 'La porte s’ouvre.' : 'Les trois fragments sont alignés. La porte s’ouvre.');
    bloquer(true);
    var rm = reduit(), attente = 0;
    S.rings.forEach(function (r) {
      var n = Math.round(r.t / 60), k = ((n % 6) + 6) % 6;
      if (k || r.raf) {
        r.vers((n + (k > 3 ? 6 - k : -k)) * 60, rm ? 0 : 0.7);
        attente = rm ? 0.05 : 0.78;
      }
    });
    at(attente, function () { (rm ? ouvrirDoux : ouvrir)(S); });
  }

  function verrou(S, i) {
    S.lock[i] = true;
    etat(S, i);
    to(S.med, { s: 0.993 }, { s: 1 }, { d: 0.3, e: 'expo' });
  }

  function ouvrir(S) {
    var d = S.med.getBoundingClientRect().width;
    /* 1. Verrouillage en cascade, de l'extérieur vers le centre */
    [0, 1, 2].forEach(function (i) { at(i * 0.12, function () { verrou(S, i); }); });
    /* 2. La lumière court dans les rainures jusqu'au centre */
    at(0.4, function () {
      to(S.q('.sc-cr[data-k="c"]'), { dash: 1 }, { dash: 0 }, { d: 0.62, e: 'doux' });
      [0, 1, 2, 3].forEach(function (k) {
        to(S.q('.sc-cr[data-k="' + k + '"]'), { dash: 1 }, { dash: 0 }, { d: 0.78 - k * 0.1, delay: k * 0.12, e: 'doux' });
      });
      S.lock[3] = true;
      at(0.5, function () { S.q('.sc-rn[data-i="3"]').forEach(function (e) { e.style.opacity = 1; }); });
    });
    /* 3. Le symbole complet s'illumine */
    at(1.1, function () {
      to(S.q('.sc-l-sym'), { o: 0, f: 'blur(4px) brightness(2.2)' }, { o: 1, f: 'blur(0px) brightness(1)' }, { d: 0.9, e: 'expo' });
      to(S.halo, { o: 0 }, { o: 0.5 }, { d: 1.2, e: 'expo' });
    });
    /* 4. Le médaillon se fend */
    at(1.5, function () {
      to(S.fente, { o: 1, cp: 'inset(50% -60px 50% -60px)' }, { o: 1, cp: 'inset(0% -60px 0% -60px)' }, { d: 0.42, e: 'doux' });
    });
    /* 5. Les deux moitiés s'écartent : la lumière et l'autre univers derrière */
    at(1.86, function () {
      set(S.moitG, { cp: 'inset(0 50% 0 0)' });
      S.sec.classList.add('is-fendu');
      to(S.ombre, null, { o: 0 }, { d: 0.5, e: 'sortie' });
      to(S.moitG, { xp: 0 }, { xp: -24 }, { d: 1.3, e: 'lourd' });
      to(S.moitD, { xp: 0 }, { xp: 24 }, { d: 1.3, e: 'lourd' });
      to(S.fente, null, { o: 0 }, { d: 0.8, delay: 0.3, e: 'sortie' });
      to(S.halo, null, { o: 1 }, { d: 1.2, e: 'expo' });
      poussiere(S.cv, { n: 38, h: d * 0.86, v: 52, rgb: S.rgb, etale: 0.6 });
    });
    /* 6. L'ouverture grandit jusqu'à remplir l'écran, puis on part */
    at(2.62, function () { inonder(S, false); });
  }

  function ouvrirDoux(S) {
    [0, 1, 2, 3].forEach(function (i) { S.lock[i] = true; if (i < 3) etat(S, i); });
    set(S.q('.sc-cr'), { dash: 0 });
    set(S.q('.sc-l-sym'), { o: 1 });
    set(S.halo, { o: 0.5 });
    at(0.3, function () { inonder(S, true); });
  }

  function flashEl(sym) {
    var f = D.createElement('div');
    f.className = 'sc-flash';
    f.setAttribute('data-symbole', sym);
    f.setAttribute('aria-hidden', 'true');
    return f;
  }

  function inonder(S, doux) {
    var f = flashEl(S.sym);
    D.body.appendChild(f);
    S.flash = f;
    if (doux) {
      to(f, { o: 0 }, { o: 1 }, { d: 0.5, e: 'doux' }).then(function () { partir(S); });
      return;
    }
    /* Une éclosion de lumière, douce, part de l'ouverture et grandit ; la lumière pleine (identique
       à la première image de la page d'arrivée) la recouvre à la fin. */
    var b = S.med.getBoundingClientRect(), cx = f2(b.left + b.width / 2), cy = f2(b.top + b.height / 2);
    var W = window.innerWidth, H = window.innerHeight;
    var R = Math.sqrt(Math.pow(Math.max(cx, W - cx), 2) + Math.pow(Math.max(cy, H - cy), 2));
    var T = 512, ec = D.createElement('div');
    ec.className = 'sc-eclosion';
    ec.setAttribute('aria-hidden', 'true');
    ec.style.cssText = 'left:' + (cx - T / 2) + 'px;top:' + (cy - T / 2) + 'px;--sc-l-rgb:' + S.rgb.join(' ');
    D.body.insertBefore(ec, f);
    set(f, { o: 0 });
    to(ec, { o: 0 }, { o: 1 }, { d: 0.35, e: 'sortie' });
    to(ec, { s: f2(b.width * 0.5 / T) }, { s: f2(R * 2.6 / T) }, { d: 0.95, e: 'vite' });
    to(f, null, { o: 1 }, { d: 0.42, delay: 0.56, e: 'doux' }).then(function () { partir(S); });
    to(S.scene, { s: 1 }, { s: 1.08 }, { d: 0.95, e: 'vite' });
  }

  function partir(S) {
    try { sessionStorage.setItem(CLE, JSON.stringify({ s: S.sym, t: Date.now() })); } catch (e) {}
    if (!S.url) { relancer(S); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { location.href = S.url; }); });
    S.secours = at(6, function () { relancer(S); });   /* navigation bloquée : on rend la main */
  }

  function relancer(S) {
    clearTimeout(S.secours);
    arr(D.querySelectorAll('body > .sc-flash, body > .sc-eclosion')).forEach(function (f) { f.remove(); });
    bloquer(false);
    construire(S.sec);
  }

  /* ------------------------------------------------------------------------
     Construction de la section
     ------------------------------------------------------------------------ */
  var MOTS = ['Il', 'existe', 'une', '<em class="sc-serif">autre</em>', 'version', 'de', 'moi.'];

  function audelaHTML(sym) {
    var v = SYM[sym];
    return '<div class="sc-audela" data-heure="' + v.heure + '" aria-hidden="true">' +
      '<img class="sc-audela__pays" src="' + asset(PAYSAGE) + '" alt="" loading="lazy" decoding="async">' +
      '<i class="sc-audela__voile"></i>' +
      '<img class="sc-audela__portrait" src="' + asset(v.portrait) + '" alt="" loading="lazy" decoding="async">' +
      '<i class="sc-audela__eclat"></i></div>';
  }

  var SECTIONS = [];

  function construire(sec) {
    var old = SECTIONS.filter(function (x) { return x.sec === sec; })[0];
    if (old) {
      clearTimeout(old.aideT);
      if (old.io1) old.io1.disconnect();
      if (old.io2) old.io2.disconnect();
      old.rings.forEach(function (r) { if (r.raf) cancelAnimationFrame(r.raf); });
      SECTIONS.splice(SECTIONS.indexOf(old), 1);
    }
    var S = { sec: sec, etat: 'jeu', coups: 0, survol: -1, lock: [false, false, false, false] };
    S.sym = sec.getAttribute('data-symbole') === 'lune' ? 'lune' : 'soleil';
    S.rgb = rgbDe(getComputedStyle(sec).getPropertyValue('--sceau-lumiere'), SYM[S.sym].rgb);
    sec.style.setProperty('--sc-l-rgb', S.rgb.join(' '));
    S.url = '';
    var vers = sec.getAttribute('data-vers');
    if (vers) { try { var u = new URL(vers, location.href); u.hash = 'porte'; S.url = u.href; } catch (e) {} }

    var uid = 'sc' + (++NUM);
    var titre = '<h2 class="sc-titre" id="' + uid + '-t">' + MOTS.map(function (m, i) {
      return '<span class="sc-mot" style="--i:' + i + '">' + m + '</span>';
    }).join(' ') + '</h2>';
    var boutons = NOMS.map(function (n, i) {
      return '<button type="button" class="sc-anneau" data-i="' + i + '" aria-label="' + n + ', tourner" aria-describedby="' + uid + '-e' + i + ' ' + uid + '-i"></button>';
    }).join('');

    sec.classList.remove('is-pret', 'is-vu', 'is-ouverture', 'is-fendu');
    sec.innerHTML =
      '<div class="sc-in">' + titre +
        '<div class="sc-entree"><div class="sc-scene">' +
          '<i class="sc-halo" aria-hidden="true"></i>' + audelaHTML(S.sym) + '<i class="sc-ombre" aria-hidden="true"></i>' +
          '<div class="sc-medaillon" role="group" aria-labelledby="' + uid + '-t" aria-describedby="' + uid + '-i">' +
            '<div class="sc-moitie sc-moitie--g">' + art(S.sym, uid + 'g') + '</div>' +
            '<div class="sc-moitie sc-moitie--d">' + art(S.sym, uid + 'd') + '</div>' +
            boutons + '<i class="sc-moyeu" aria-hidden="true"></i>' +
          '</div>' +
          '<i class="sc-fente" aria-hidden="true"></i><canvas class="sc-poussiere" aria-hidden="true"></canvas>' +
        '</div></div>' +
        '<p class="sc-indice" id="' + uid + '-i">Aligne les trois fragments.</p>' +
        (S.url ? '<a class="sc-passer" href="' + S.url + '">Passer<span class="sc-sr"> l’énigme</span></a>' : '') +
        NOMS.map(function (n, i) { return '<span class="sc-sr" id="' + uid + '-e' + i + '"></span>'; }).join('') +
        '<p class="sc-sr" aria-live="polite"></p>' +
      '</div>';
    if (!sec.hasAttribute('aria-label') && !sec.hasAttribute('aria-labelledby')) sec.setAttribute('aria-labelledby', uid + '-t');

    var q1 = function (s) { return sec.querySelector(s); };
    S.med = q1('.sc-medaillon');
    S.q = function (s) { return arr(S.med.querySelectorAll(s)); };
    S.entree = q1('.sc-entree'); S.scene = q1('.sc-scene'); S.halo = q1('.sc-halo'); S.ombre = q1('.sc-ombre');
    S.fente = q1('.sc-fente'); S.cv = q1('.sc-poussiere'); S.indice = q1('.sc-indice'); S.live = q1('[aria-live]');
    S.moitG = q1('.sc-moitie--g'); S.moitD = q1('.sc-moitie--d');
    S.btns = arr(sec.querySelectorAll('.sc-anneau'));
    S.etats = NOMS.map(function (n, i) { return D.getElementById(uid + '-e' + i); });
    S.cliquets = S.q('.sc-cliquet');
    var depart = sec.hasAttribute('data-sceau-test') ? [0, 0, 1] : DEPART;
    S.rings = depart.map(function (n, i) {
      var r = new Anneau(S, i, -60 * n);
      r.els = S.q('.sc-bague[data-i="' + i + '"]');
      r.peindre();
      return r;
    });
    S.rings.forEach(function (r, i) { etat(S, i); });
    brancher(S);
    observer(S);
    SECTIONS.push(S);
    return S;
  }

  function observer(S) {
    if (!('IntersectionObserver' in window)) { S.sec.classList.add('is-vu'); minuter(S); return; }
    S.sec.classList.add('is-pret');
    S.io1 = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { S.sec.classList.add('is-vu'); S.io1.disconnect(); }
    }, { rootMargin: '0px 0px -14% 0px' });
    S.io1.observe(S.sec.querySelector('.sc-in'));
    S.io2 = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.intersectionRatio >= 0.5; })) { minuter(S); S.io2.disconnect(); }
    }, { threshold: [0.5] });
    S.io2.observe(S.entree);
  }

  /* ------------------------------------------------------------------------
     L'arrivée (page d'arrivée, #porte)
     ------------------------------------------------------------------------ */
  function ornementPorte() {
    var s = '', k;
    [108, 111.5, 150, 153].forEach(function (r) {
      s += 'M' + (-r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z';
    });
    for (k = 0; k < 360; k += 6) {
      var t = k * Math.PI / 180, c = Math.cos(t), si = Math.sin(t);
      s += 'M' + f2(117 * c) + ' ' + f2(117 * si) + 'L' + f2(145 * c) + ' ' + f2(145 * si);
    }
    return '<svg class="sc-orn" viewBox="-170 -170 340 340" aria-hidden="true" focusable="false">' +
      '<g class="sc-orn-o" transform="translate(0 -.6)"><path d="' + s + '"/></g><g class="sc-orn-c"><path d="' + s + '"/></g></svg>';
  }

  function arriver() {
    var sec = D.querySelector('[data-sceau]');
    var sym = HTML.getAttribute('data-sceau-arrivee');
    if (sym !== 'soleil' && sym !== 'lune') {
      sym = null;
      try {
        var st = JSON.parse(sessionStorage.getItem(CLE) || 'null');
        if (st && Date.now() - st.t < 120000) sym = st.s;
      } catch (e) {}
    }
    try { sessionStorage.removeItem(CLE); } catch (e) {}
    if (sym !== 'soleil' && sym !== 'lune') {
      sym = sec ? (sec.getAttribute('data-symbole') === 'lune' ? 'soleil' : 'lune') : 'soleil';
    }

    var fini = false, garde;
    function signal() {
      if (fini) return;
      fini = true;
      try { D.dispatchEvent(new CustomEvent('sceau:arrivee', { bubbles: true })); } catch (e) {}
    }
    var el = D.createElement('div');
    function nettoyer() {
      clearTimeout(garde);
      signal();
      if (el.parentNode) el.parentNode.removeChild(el);
      HTML.classList.remove('sceau-arrivee');
      HTML.removeAttribute('data-sceau-arrivee');
      if (location.hash === '#porte') {
        try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
      }
    }
    garde = at(4, nettoyer);

    try {
      var rgb = SYM[sym].rgb, id = 'scp' + (++NUM);
      el.className = 'sc-porte';
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-symbole', sym);
      el.style.setProperty('--sc-l-rgb', rgb.join(' '));
      var battant = function (c) {
        return '<div class="sc-battant sc-battant--' + c + '"><div class="sc-battant__in"><i class="sc-grain"></i>' + ornementPorte() +
          '<div class="sc-medaillon"><i class="sc-ombre"></i>' + art(sym, id + c) + '</div></div></div>';
      };
      el.innerHTML = '<div class="sc-porte__lum"></div>' + battant('g') + battant('d') +
        '<i class="sc-porte__fente"></i><canvas class="sc-poussiere"></canvas><div class="sc-flash" data-symbole="' + sym + '"></div>';
      HTML.classList.add('sceau-arrivee');
      (D.body || HTML).appendChild(el);
      HTML.removeAttribute('data-sceau-arrivee');   /* la porte du script prend le relais du voile CSS */

      var q = function (s) { return el.querySelector(s); };
      var fl = q('.sc-flash'), bg = q('.sc-battant--g'), bd = q('.sc-battant--d');
      var fe = q('.sc-porte__fente'), lum = q('.sc-porte__lum'), cv = q('.sc-poussiere');

      if (reduit()) {
        to(fl, { o: 1 }, { o: 0 }, { d: 0.35, e: 'sortie' });
        to([bg, bd, fe, lum], { o: 1 }, { o: 0 }, { d: 0.45, delay: 0.3, e: 'sortie' }).then(nettoyer);
        at(0.45, signal);
        return;
      }
      /* La lumière se retire sur la porte fermée, symbole allumé ; puis les battants s'écartent. */
      to(fl, { o: 1 }, { o: 0 }, { d: 0.62, e: 'sortie' });
      at(0.66, function () {
        to(fe, null, { o: 0 }, { d: 0.45, e: 'sortie' });
        to(lum, { o: 1 }, { o: 0 }, { d: 1.5, e: 'sortie' });
        to(bg, { xp: 0 }, { xp: -102 }, { d: 1.1, e: 'expo' });
        to(bd, { xp: 0 }, { xp: 102 }, { d: 1.1, e: 'expo' }).then(nettoyer);
        poussiere(cv, { n: 30, h: window.innerHeight * 0.7, v: 70, rgb: rgb, etale: 0.35 });
      });
      at(0.66 + 0.42, signal);
    } catch (err) {
      nettoyer();
    }
  }

  /* ------------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------------ */
  function demarrer() {
    if (location.hash === '#porte') arriver();
    else HTML.removeAttribute('data-sceau-arrivee');
    arr(D.querySelectorAll('[data-sceau]')).forEach(function (sec) {
      try { construire(sec); } catch (e) { if (window.console) console.error('sceau', e); }
    });
  }

  /* Retour arrière depuis l'autre page (cache) : on remet le sceau en place. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var reprendre = SECTIONS.filter(function (S) { return S.etat !== 'jeu'; });
    if (!reprendre.length) return;
    bloquer(false);
    arr(D.querySelectorAll('body > .sc-flash, body > .sc-eclosion')).forEach(function (f) { f.remove(); });
    reprendre.forEach(function (S) { clearTimeout(S.secours); construire(S.sec); });
  });

  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
