/* ==========================================================================
   Le ciel : le passage secret par constellation, entre l'univers Pro et l'univers Créateur.
   Styles : shared/etoiles.css. Le départ (le décollage) et l'arrivée sont ceux du cordon (shared/cordon.js).

   Contrat :
     <head>  <link rel="stylesheet" href="shared/etoiles.css">
     pied    <div class="kz-etoiles" data-etoiles data-vers="pro.html" data-symbole="lune"></div>          (Créateur seulement)
             Côté Pro, plus de bande ni de cordon : le passage vers Créateur est le tracé dans la constellation
             des apps (shared/apps.js, « LE TRACÉ »).
     </body> <script src="shared/etoiles.js" defer></script>   (après shared/cordon.js)

   Au repos : 9 étoiles fines à positions fixes, irrégulières. Rien ne les trahit (ni légende, ni indice,
   ni animation d'invitation) ; au plus un scintillement au survol direct d'une étoile.

   Le geste (Pointer Events, souris ou doigt) :
     - il ne démarre que si le pointeur part d'une étoile (touch-action: none sur les étoiles seulement,
       le défilement de la page n'est jamais gêné ailleurs) ;
     - un trait lumineux suit le pointeur ; à moins de ACCROCHE px d'une étoile, il s'y accroche :
       l'étoile s'allume et un segment se fixe ; une étoile déjà prise ne se reprend pas ;
     - le bon code (CODE, dans l'ordre) : les segments s'illuminent un à un, la constellation s'embrase,
       la forme se resserre vers son centre et devient le symbole (soleil ou lune). Puis le passage du cordon
       (DA Terre) : vers Pro, le décollage (la Terre s'éloigne, les étoiles reviennent), vers data-vers + « #porte » ;
     - un mauvais code : au lâcher, le tracé s'efface doucement en 400 ms, sans message ni vibration.
   Accessibilité : la bande est décorative (aria-hidden) ; le chemin accessible reste le cordon
     (Alt + Flèche bas sur « Kenz· »). Mouvement réduit : pas d'échelle, l'ouverture se fait en fondu.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KzEtoiles) return;

  /* ------------------------------------------------------------------------
     LE CODE : les étoiles à relier, dans l'ordre (numéros de ETOILES ci-dessous, de 1 à 9).
     Par défaut, l'arche (la porte) : en bas à gauche (3), épaule gauche (4), sommet (5),
     épaule droite (7), en bas à droite (8). Pour le changer : une autre suite de numéros.
     ------------------------------------------------------------------------ */
  var CODE = [3, 4, 5, 7, 8];

  /* Les 9 étoiles, numérotées de gauche à droite, dans un repère de 360 × 130 (la bande garde ces proportions).
     [x, y, rayon, éclat (0 à 1), 'or' = dorée, 'rais' = petite croix de lumière] */
  var ETOILES = [
    /* 1 */ [24, 84, 1.3, 0.55],
    /* 2 */ [76, 36, 1.8, 0.8, 'or', 'rais'],
    /* 3 */ [128, 108, 1.4, 0.7],
    /* 4 */ [138, 58, 1.1, 0.6],
    /* 5 */ [180, 20, 1.6, 0.85, '', 'rais'],
    /* 6 */ [184, 84, 1.5, 0.65, 'or'],
    /* 7 */ [226, 50, 1.2, 0.7],
    /* 8 */ [236, 104, 1.7, 0.75, 'or'],
    /* 9 */ [332, 58, 1.9, 0.8, '', 'rais']
  ];
  var VB_W = 360, VB_H = 130;
  var ACCROCHE = 22;          /* px à l'écran : le tracé s'accroche à une étoile */
  var DEPART = 26;            /* px : tolérance pour partir d'une étoile */
  var EFFACE = 400;           /* ms : le mauvais tracé s'efface */

  var D = document, W = window, HTML = D.documentElement, NS = 'http://www.w3.org/2000/svg';
  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function at(s, fn) { return setTimeout(fn, s * 1000); }
  function now() { return (W.performance && performance.now) ? performance.now() : Date.now(); }
  function f2(n) { return Math.round(n * 100) / 100; }
  function arr(x) { return Array.prototype.slice.call(x || []); }
  var NUM = 0;
  var PASSAGE = false;

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
  function entre(p) { return p * p * p; }                 /* part lentement, se resserre vite */
  function doux(p) { return 1 - Math.pow(1 - p, 3); }

  /* ------------------------------------------------------------------------
     Dessin
     ------------------------------------------------------------------------ */
  function etoileSVG(e, i) {
    var x = e[0], y = e[1], r = e[2], s = '';
    s += '<g class="kz-et' + (e[4] === 'or' ? ' kz-et--or' : '') + '" data-i="' + (i + 1) + '" style="--a:' + e[3] + ';--h:' + f2(0.05 + e[3] * 0.04) + '">';
    s += '<circle class="kz-et__halo" cx="' + x + '" cy="' + y + '" r="' + f2(r * 4.2) + '"/>';
    if (e[5] === 'rais') {
      var l = f2(r * 3.6);
      s += '<path class="kz-et__rais" d="M' + f2(x - l) + ' ' + y + 'H' + f2(x + l) + 'M' + x + ' ' + f2(y - l) + 'V' + f2(y + l) + '"/>';
    }
    s += '<circle class="kz-et__coeur" cx="' + x + '" cy="' + y + '" r="' + r + '"/></g>';
    return s;
  }

  function monter(el) {
    if (el.kzEtoiles) return el.kzEtoiles;
    var id = 'kzEt' + (++NUM);
    var sym = el.getAttribute('data-symbole') === 'lune' ? 'lune' : 'soleil';
    var cx = 0, cy = 0;
    CODE.forEach(function (n) { var e = ETOILES[n - 1]; if (e) { cx += e[0]; cy += e[1]; } });
    cx = f2(cx / CODE.length); cy = f2(cy / CODE.length);

    var s = '<svg class="kz-etoiles__ciel" viewBox="0 0 ' + VB_W + ' ' + VB_H + '" aria-hidden="true" focusable="false">' +
      '<defs><radialGradient id="' + id + 'b"><stop offset="0" class="kz-etoiles__b0"/><stop offset=".42" class="kz-etoiles__b1"/><stop offset="1" class="kz-etoiles__b2"/></radialGradient></defs>' +
      '<circle class="kz-etoiles__brasier" cx="' + cx + '" cy="' + cy + '" r="96" fill="url(#' + id + 'b)"/>' +
      '<g class="kz-etoiles__astres">' + ETOILES.map(etoileSVG).join('') + '</g>' +
      '<g class="kz-etoiles__forme"><g class="kz-etoiles__trace"></g></g>' +
      '<g class="kz-etoiles__symbole"></g>' +
      '</svg>';
    ETOILES.forEach(function (e, i) {
      s += '<span class="kz-etoile" data-i="' + (i + 1) + '" style="left:' + f2(e[0] / VB_W * 100) + '%;top:' + f2(e[1] / VB_H * 100) + '%"></span>';
    });
    el.innerHTML = s;
    el.setAttribute('aria-hidden', 'true');
    el.classList.add('is-pret');

    var q = function (c) { return el.querySelector(c); };
    var S = {
      el: el, sym: sym, cx: cx, cy: cy,
      svg: q('.kz-etoiles__ciel'), astres: arr(el.querySelectorAll('.kz-et')),
      groupeAstres: q('.kz-etoiles__astres'), forme: q('.kz-etoiles__forme'), trace: q('.kz-etoiles__trace'),
      brasier: q('.kz-etoiles__brasier'), symbole: q('.kz-etoiles__symbole'),
      seq: [], segs: [], vif: null, id: null, etat: 'repos', fondu: 0, px: 0, py: 0, secours: 0
    };
    S.vif = segment(S, null, null, true);
    S.vif.style.display = 'none';
    el.kzEtoiles = S;
    if (!el.kzBranche) { el.kzBranche = true; brancher(el); }
    return S;
  }

  function segment(S, a, b, vif) {
    var g = D.createElementNS(NS, 'g');
    g.setAttribute('class', 'kz-seg' + (vif ? ' kz-seg--vif' : ''));
    var h = D.createElementNS(NS, 'line'), f = D.createElementNS(NS, 'line');
    h.setAttribute('class', 'kz-seg__halo');
    f.setAttribute('class', 'kz-seg__fil');
    g.appendChild(h); g.appendChild(f);
    if (a && b) ligne(g, ETOILES[a - 1][0], ETOILES[a - 1][1], ETOILES[b - 1][0], ETOILES[b - 1][1]);
    S.trace.appendChild(g);
    return g;
  }
  function ligne(g, x1, y1, x2, y2) {
    var l = g.childNodes;
    for (var k = 0; k < l.length; k++) {
      l[k].setAttribute('x1', f2(x1)); l[k].setAttribute('y1', f2(y1));
      l[k].setAttribute('x2', f2(x2)); l[k].setAttribute('y2', f2(y2));
    }
  }

  /* Repère : la bande garde les proportions du repère, l'échelle est donc la même en x et en y. */
  function geom(S) {
    var r = S.svg.getBoundingClientRect();
    return { l: r.left, t: r.top, k: (r.width / VB_W) || 1 };
  }
  function versEcran(G, n) { var e = ETOILES[n - 1]; return [G.l + e[0] * G.k, G.t + e[1] * G.k]; }

  function plusProche(S, G, x, y, rayon) {
    var best = 0, bd = rayon;
    ETOILES.forEach(function (e, i) {
      var p = versEcran(G, i + 1), d = Math.sqrt(Math.pow(p[0] - x, 2) + Math.pow(p[1] - y, 2));
      if (d <= bd) { bd = d; best = i + 1; }
    });
    return best;
  }

  /* Les étoiles libres que le pointeur frôle entre deux positions, dans l'ordre du passage. */
  function frolees(S, G, x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy, out = [];
    ETOILES.forEach(function (e, i) {
      var n = i + 1;
      if (S.seq.indexOf(n) > -1) return;
      var p = versEcran(G, n), t = L ? ((p[0] - x0) * dx + (p[1] - y0) * dy) / L : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      var qx = x0 + t * dx - p[0], qy = y0 + t * dy - p[1];
      if (qx * qx + qy * qy < ACCROCHE * ACCROCHE) out.push([t, n]);
    });
    out.sort(function (a, b) { return a[0] - b[0]; });
    return out.map(function (o) { return o[1]; });
  }

  /* ------------------------------------------------------------------------
     Le tracé
     ------------------------------------------------------------------------ */
  function prendre(S, n) {
    var avant = S.seq[S.seq.length - 1];
    S.seq.push(n);
    S.astres[n - 1].classList.add('is-prise');
    if (avant) {
      S.segs.push(segment(S, avant, n));
      S.trace.appendChild(S.vif);              /* le trait vif reste au-dessus des segments */
    }
    if (S.seq.length === CODE.length && S.seq.join() === CODE.join()) reussir(S);
  }

  function majVif(S, G, x, y) {
    var n = S.seq[S.seq.length - 1];
    if (!n) return;
    var e = ETOILES[n - 1];
    ligne(S.vif, e[0], e[1], (x - G.l) / G.k, (y - G.t) / G.k);
    S.vif.style.display = '';
  }

  function vider(S) {
    clearTimeout(S.fondu);
    S.segs.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
    S.segs = []; S.seq = [];
    S.vif.style.display = 'none';
    S.trace.style.transition = 'none';
    S.trace.style.opacity = '';
    S.astres.forEach(function (a) { a.classList.remove('is-prise'); });
    S.etat = 'repos';
  }

  /* Mauvais code : le tracé s'efface doucement, sans un mot. */
  function effacer(S) {
    S.etat = 'efface';
    S.trace.style.transition = 'opacity ' + EFFACE + 'ms cubic-bezier(.45,0,.55,1)';
    S.trace.style.opacity = '0';
    S.astres.forEach(function (a) { a.classList.remove('is-prise'); });
    clearTimeout(S.fondu);
    S.fondu = setTimeout(function () { vider(S); }, EFFACE + 20);
  }

  /* ------------------------------------------------------------------------
     Le bon code : embrasement, symbole, puis les portes du cordon
     ------------------------------------------------------------------------ */
  function figureDe(sym) {
    var C = W.Cordon, f = (C && typeof C.figure === 'function') ? C.figure(sym) : '';
    if (!f) f = '<path class="cd-fs" d="M140 200a60 60 0 1 0 120 0a60 60 0 1 0 -120 0"/><path class="cd-ff" d=""/>';
    return f.replace(/class="cd-fs"/g, 'class="kz-sym-s" pathLength="1"').replace(/class="cd-ff"/g, 'class="kz-sym-f"');
  }

  function dessinerSymbole(S) {
    var f = figureDe(S.sym);
    S.symbole.innerHTML = '<g class="kz-sym-halo">' + f + '</g><g class="kz-sym-net">' + f + '</g>';
    S.symTraits = arr(S.symbole.querySelectorAll('.kz-sym-s'));
    S.symFonds = arr(S.symbole.querySelectorAll('.kz-sym-f'));
    S.symTraits.forEach(function (p) { p.style.strokeDasharray = '1 1'; p.style.strokeDashoffset = '1'; });
    S.symFonds.forEach(function (p) { p.style.opacity = '0'; });
  }
  /* Le symbole (dessiné dans un repère de 400) posé au centre de la forme. */
  function placerSymbole(S, k) {
    var base = 0.27 * k, fy = S.sym === 'lune' ? 200 : 158, fx = S.sym === 'lune' ? 206 : 200;
    S.symbole.setAttribute('transform', 'translate(' + S.cx + ' ' + S.cy + ') scale(' + f2(base * 1000) / 1000 + ') translate(' + (-fx) + ' ' + (-fy) + ')');
  }

  function reussir(S) {
    S.etat = 'feu';
    PASSAGE = true;
    lacherCapture(S);
    S.vif.style.display = 'none';
    var rm = reduit();
    var code = CODE.map(function (n) { return S.astres[n - 1]; });
    code.forEach(function (a) { S.forme.appendChild(a); });     /* la forme emporte ses étoiles */
    dessinerSymbole(S);
    placerSymbole(S, 1);

    /* 1. Les segments s'illuminent un à un */
    code.forEach(function (a, k) {
      at(rm ? 0 : 0.1 * k, function () {
        a.classList.add('is-feu');
        if (k > 0 && S.segs[k - 1]) S.segs[k - 1].classList.add('is-feu');
      });
    });
    /* 2. La constellation s'embrase */
    at(rm ? 0 : 0.52, function () { S.el.classList.add('is-embrase'); });

    if (rm) {
      at(0.25, function () {
        tween(0.35, doux, function (k) { S.forme.style.opacity = String(f2(1 - k)); });
        S.symTraits.forEach(function (p) { p.style.strokeDashoffset = '0'; });
        S.symFonds.forEach(function (p) { p.style.opacity = '1'; });
        tween(0.45, doux, function (k) { S.symbole.style.opacity = String(f2(k)); });
      });
      at(1.0, function () { porte(S); });
      return;
    }

    /* 3. La forme se resserre vers son centre… */
    at(0.98, function () {
      var cx = S.cx, cy = S.cy;
      tween(0.62, entre, function (k) {
        var s = 1 - 0.9 * k;
        S.forme.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') scale(' + f2(s * 1000) / 1000 + ') translate(' + (-cx) + ' ' + (-cy) + ')');
        S.forme.style.opacity = String(f2(1 - k * k));
        S.brasier.setAttribute('r', f2(96 - 44 * k));
      });
    });
    /* … et devient le symbole */
    at(1.34, function () {
      tween(1.0, expoOut, function (k) {
        placerSymbole(S, 0.55 + 0.45 * k);
        S.symbole.style.opacity = String(f2(Math.min(1, k * 2.2)));
        S.symTraits.forEach(function (p) { p.style.strokeDashoffset = String(f2(1 - k)); });
        S.symFonds.forEach(function (p) { p.style.opacity = String(f2(Math.max(0, k * 1.6 - 0.6))); });
      });
    });
    /* 4. Le décollage (cordon.js) */
    at(2.05, function () { porte(S); });
  }

  function porte(S) {
    var vers = S.el.getAttribute('data-vers') || '';
    var C = W.Cordon;
    clearTimeout(S.secours);
    S.secours = at(8, function () { remettre(S); });   /* navigation bloquée : le ciel revient au repos */
    if (C && typeof C.ouvrirPorte === 'function') {
      C.ouvrirPorte({ vers: vers, symbole: S.sym });
      return;
    }
    /* Sans le cordon : on part directement (l'autre page gère #porte si elle charge le cordon). */
    if (!vers) return;
    try { var u = new URL(vers, location.href); u.hash = 'porte'; location.href = u.href; }
    catch (e) { location.href = vers.split('#')[0] + '#porte'; }
  }

  /* Retour à l'état de repos (retour arrière depuis l'autre page, navigation bloquée). */
  function remettre(S) {
    clearTimeout(S.secours);
    var el = S.el;
    el.kzEtoiles = null;
    el.classList.remove('is-embrase', 'is-pret');
    PASSAGE = false;
    monter(el);
  }

  /* ------------------------------------------------------------------------
     Pointer Events
     ------------------------------------------------------------------------ */
  function lacherCapture(S) {
    if (S.id !== null) { try { S.el.releasePointerCapture(S.id); } catch (e) {} }
    S.id = null;
    HTML.classList.remove('kz-trace');
  }

  /* Les écouteurs sont posés une fois sur la bande ; l'état courant est lu à chaque événement. */
  function brancher(el) {
    function etat() { return el.kzEtoiles; }

    el.addEventListener('pointerdown', function (e) {
      var S = etat();
      if (!S || S.etat === 'feu' || PASSAGE || S.id !== null) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      var t = e.target && e.target.closest ? e.target.closest('.kz-etoile') : null;
      if (!t) return;
      if (W.Cordon && typeof W.Cordon.enCours === 'function' && W.Cordon.enCours()) return;
      var G = geom(S);
      var n = plusProche(S, G, e.clientX, e.clientY, DEPART) || +t.getAttribute('data-i');
      if (S.etat === 'efface') vider(S);
      if (e.cancelable) e.preventDefault();
      S.id = e.pointerId;
      S.etat = 'trace';
      S.px = e.clientX; S.py = e.clientY;
      try { el.setPointerCapture(e.pointerId); } catch (er) {}
      HTML.classList.add('kz-trace');
      prendre(S, n);
      if (S.etat === 'trace') majVif(S, G, e.clientX, e.clientY);
    });

    el.addEventListener('pointermove', function (e) {
      var S = etat();
      if (!S || S.id !== e.pointerId || S.etat !== 'trace') return;
      if (e.cancelable) e.preventDefault();
      var G = geom(S);
      var evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
      if (!evs.length) evs = [e];
      for (var k = 0; k < evs.length; k++) {
        var x = evs[k].clientX, y = evs[k].clientY;
        var prises = frolees(S, G, S.px, S.py, x, y);
        S.px = x; S.py = y;
        for (var j = 0; j < prises.length; j++) {
          prendre(S, prises[j]);
          if (S.etat !== 'trace') return;
        }
      }
      majVif(S, G, e.clientX, e.clientY);
    }, { passive: false });

    function fin(e) {
      var S = etat();
      if (!S || S.id !== e.pointerId) return;
      lacherCapture(S);
      if (S.etat === 'trace') effacer(S);
    }
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', fin);
    el.addEventListener('lostpointercapture', fin);
    el.addEventListener('contextmenu', function (e) { var S = etat(); if (S && S.etat === 'trace') e.preventDefault(); });
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* Au plus un scintillement, au survol direct d'une étoile (souris) */
    el.addEventListener('pointerover', function (e) {
      var S = etat();
      if (!S || e.pointerType !== 'mouse' || S.etat !== 'repos') return;
      var t = e.target && e.target.closest ? e.target.closest('.kz-etoile') : null;
      if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
      var a = S.astres[+t.getAttribute('data-i') - 1];
      if (!a || a.classList.contains('is-scintille')) return;
      a.classList.add('is-scintille');
      setTimeout(function () { a.classList.remove('is-scintille'); }, 1150);
    });
  }

  /* ------------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------------ */
  function demarrer() { arr(D.querySelectorAll('[data-etoiles]')).forEach(monter); }
  W.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    arr(D.querySelectorAll('[data-etoiles]')).forEach(function (el) { if (el.kzEtoiles) remettre(el.kzEtoiles); });
  });
  W.KzEtoiles = { pret: true };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
