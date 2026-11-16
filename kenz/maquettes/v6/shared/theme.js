/* ==========================================================================
   Thème commun de la maquette unique (V6) : le mode, l'aura, le fil, les arches, la loupe.
   Styles : shared/theme.css (la documentation des classes et des jetons y est aussi).

   BRANCHEMENT, dans le <head>, juste après shared/theme.css et AVANT le <style> de la page :
     <script src="shared/theme.js"></script>
   Synchrone exprès : le mode est posé avant le premier rendu (pas d'éclair blanc ou noir).
   Tout le reste attend DOMContentLoaded, puis les modules (apps, victoire) remplis.
   Ne dépend de rien (GSAP, Lenis, ScrollTrigger facultatifs).

   LE MODE
     <html data-theme="dark|light">, choisi dans cet ordre :
       1. porte de test de l'outil de revue : ?clair  ?sombre  #clair  #sombre  (jamais mémorisée ;
          à retirer quand la maquette sera finie) ;
       2. le choix mémorisé : localStorage « kz-theme » = "light" | "dark" (lu et écrit dans un try/catch) ;
       3. prefers-color-scheme (et on le suit en direct tant que rien n'est mémorisé).
     À chaque bascule : data-theme sur <html> et sur [data-kz-apps], [data-kz-victoire], [data-theme-suit] ;
     <meta name="color-scheme"> et <meta name="theme-color"> mis à jour ; fondu de 400 ms
     (View Transitions, sinon fondu des couleurs).
     Événement : document « kz-theme:change »  detail { theme: 'dark'|'light', source: 'init'|'user'|'systeme' }.

   LE BOUTON SOLEIL / LUNE
     Rempli dans [data-kz-mode] s'il existe (ex. <button class="kz-mode" type="button" data-kz-mode></button>),
     sinon créé dans .nav__in, juste avant .nav__cta. aria-label : « Passer en mode clair / sombre ».

   L'AURA ET LE GRAIN
     .kz-aura (3 halos) et .kz-grain insérés en tête de <body> (sauf <html data-aura="off">).
     data-aura="droite|gauche|centre|haut|bas|calme" ou "x y" (en % de l'écran) sur un [data-chapitre] :
     les halos glissent vers cette place quand le chapitre passe au centre de l'écran.

   LE FIL
     Chaque [data-chapitre] (dans l'ordre du document) a un nœud sur le rail (≥ 1100 px) ; en dessous,
     un filet de progression en haut. Un .kz-fil-trait est ajouté en haut de chaque chapitre sauf le premier
     (data-fil-trait="non" : pas de trait ; data-fil-trait="centre" : trait centré).
     Les épinglages (ScrollTrigger, .pin-spacer) sont pris en compte ; on remesure au chargement,
     au redimensionnement, quand la hauteur de la page change et à chaque refresh de ScrollTrigger.

   L'ARCHE
     [data-arche-trace] sur un .kz-arche : le fil de l'arche est dessiné en SVG (à la taille réelle)
     et tracé à l'entrée à l'écran (.is-trace). Écart du fil fantôme : --arche-ecart (px).

   LA LOUPE (souris seulement ; ni toucher ni mouvement réduit)
     [data-loupe] sur l'élément : une lentille de verre teinté, ×1,1, qui suit la souris.
     data-loupe="1.15" : échelle ; data-loupe-taille="200" : diamètre en px.

   API : window.KzTheme
     .mode()                    -> 'dark' | 'light'
     .definir('light'|'dark')   choix du visiteur (mémorisé, avec fondu)
     .basculer()                l'autre mode
     .loupe(el, { echelle: 1.1, taille: 168, source: elementAClooner })  -> fonction pour détacher
     .arche(el)                 dessine le fil d'une arche ajoutée après coup
     .rafraichir()              remesure le fil et l'aura (après un changement de mise en page)
     .porte                     'light' | 'dark' | null (porte de test active)
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, H = D.documentElement;
  if (W.KzTheme) return;

  var CLE = 'kz-theme';
  function mq(q) { return W.matchMedia ? W.matchMedia(q) : null; }
  var MQ_SOMBRE = mq('(prefers-color-scheme: dark)');
  var MQ_RM = mq('(prefers-reduced-motion: reduce)');
  var MQ_SOURIS = mq('(hover: hover) and (pointer: fine)');
  function reduit() { return !!(MQ_RM && MQ_RM.matches); }
  function arr(x) { return Array.prototype.slice.call(x || []); }
  function borne(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function ecouter(m, fn) { if (!m) return; if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); }

  /* ------------------------------------------------------------------------
     1. Le mode, posé tout de suite
     ------------------------------------------------------------------------ */
  var PORTE = (function () {
    var s = (location.search + '|' + location.hash).toLowerCase();
    if (/(^|[?&#|])clair($|[&#|=])/.test(s)) return 'light';
    if (/(^|[?&#|])sombre($|[&#|=])/.test(s)) return 'dark';
    return null;
  })();
  function lu() { try { var v = W.localStorage.getItem(CLE); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; } }
  function ecrire(v) { if (PORTE) return; try { W.localStorage.setItem(CLE, v); } catch (e) {} }
  function systeme() { return MQ_SOMBRE && !MQ_SOMBRE.matches ? 'light' : 'dark'; }

  var mode = PORTE || lu() || systeme();
  var btn = null, tBascule = 0;

  function metas() {
    var cs = D.querySelector('meta[name="color-scheme"]');
    if (cs) cs.setAttribute('content', mode);
    var tc = D.querySelector('meta[name="theme-color"]');
    if (tc) {
      var bg = '';
      try { bg = getComputedStyle(H).getPropertyValue('--bg').trim(); } catch (e) {}
      if (bg) tc.setAttribute('content', bg);
    }
  }
  function suivre() {
    arr(D.querySelectorAll('[data-kz-apps],[data-kz-victoire],[data-theme-suit]')).forEach(function (el) {
      if (el.getAttribute('data-theme') !== mode) el.setAttribute('data-theme', mode);
    });
  }
  function majBouton() {
    if (!btn) return;
    btn.setAttribute('aria-label', mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
  }
  function poser() {
    H.setAttribute('data-theme', mode);
    metas();
    suivre();
    majBouton();
  }
  function emettre(source) {
    try { D.dispatchEvent(new CustomEvent('kz-theme:change', { detail: { theme: mode, source: source } })); } catch (e) {}
  }
  function changer(v, source) {
    v = v === 'light' ? 'light' : 'dark';
    if (source === 'user') ecrire(v);
    if (v === mode) return;
    mode = v;
    var fin = function () { poser(); emettre(source); mesurerBientot(); };
    if (source === 'user' && D.startViewTransition && !D.hidden) {
      try { D.startViewTransition(fin); return; } catch (e) {}
    }
    H.classList.add('kz-bascule');
    fin();
    clearTimeout(tBascule);
    tBascule = setTimeout(function () { H.classList.remove('kz-bascule'); }, 460);
  }

  H.setAttribute('data-theme', mode);
  H.classList.add('kz-t');
  metas();
  /* Tant que rien n'est mémorisé, on suit le système en direct */
  ecouter(MQ_SOMBRE, function () { if (!PORTE && !lu()) changer(systeme(), 'systeme'); });

  /* ------------------------------------------------------------------------
     2. Le bouton soleil / lune
     ------------------------------------------------------------------------ */
  var ICONE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<g class="kz-mode__soleil"><circle cx="12" cy="12" r="4.1"/><g class="kz-mode__rayons">' +
    '<path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></g></g>' +
    '<path class="kz-mode__lune" d="M19.5 14.3A7.6 7.6 0 0 1 9.7 4.5a7.6 7.6 0 1 0 9.8 9.8z"/></svg>';
  function bouton() {
    var b = D.querySelector('[data-kz-mode]');
    if (!b) {
      var nav = D.querySelector('.nav__in');
      if (!nav) return;
      b = D.createElement('button');
      var cta = nav.querySelector('.nav__cta');
      if (cta && cta.parentNode === nav) nav.insertBefore(b, cta); else nav.appendChild(b);
    }
    if (b.tagName === 'BUTTON') b.type = 'button';
    b.classList.add('kz-mode');
    b.innerHTML = ICONE;
    b.addEventListener('click', function () { changer(mode === 'dark' ? 'light' : 'dark', 'user'); });
    btn = b;
    majBouton();
  }

  /* ------------------------------------------------------------------------
     3. L'aura (et le grain)
     ------------------------------------------------------------------------ */
  var POS = {
    droite: [[82, 14, 1], [6, 98, 1], [64, 80, .7]],
    gauche: [[16, 18, 1], [96, 92, 1], [38, 78, .7]],
    centre: [[50, 30, 1], [10, 102, .8], [90, 94, .6]],
    haut: [[62, -6, 1], [4, 72, .8], [32, 18, .5]],
    bas: [[46, 104, 1], [98, 12, .8], [8, 40, .5]],
    calme: [[88, 4, .5], [2, 102, .55], [60, 76, .3]]
  };
  var aura = null, auraCle = '';
  function creerAura() {
    if (H.getAttribute('data-aura') === 'off' || !D.body) return;
    aura = D.querySelector('.kz-aura');
    if (!aura) {
      aura = D.createElement('div');
      aura.className = 'kz-aura';
      aura.setAttribute('aria-hidden', 'true');
      aura.innerHTML = '<i class="kz-aura__h kz-aura__h--1"></i><i class="kz-aura__h kz-aura__h--2"></i><i class="kz-aura__h kz-aura__h--3"></i>';
      D.body.insertBefore(aura, D.body.firstChild);
    }
    if (!D.querySelector('.kz-grain') && H.getAttribute('data-grain') !== 'off') {
      var g = D.createElement('div');
      g.className = 'kz-grain';
      g.setAttribute('aria-hidden', 'true');
      D.body.insertBefore(g, aura.nextSibling);
    }
  }
  function placerAura(v) {
    if (!aura) return;
    v = (v || 'droite').trim();
    if (v === auraCle) return;
    auraCle = v;
    var p = POS[v];
    if (!p) {
      var n = v.split(/[\s,]+/).map(parseFloat);
      p = (n.length >= 2 && !isNaN(n[0]) && !isNaN(n[1])) ? [[n[0], n[1], 1], POS.droite[1], POS.droite[2]] : POS.droite;
    }
    arr(aura.children).forEach(function (h, i) {
      var q = p[i] || p[0];
      h.style.setProperty('--x', q[0] + 'vw');
      h.style.setProperty('--y', q[1] + 'vh');
      h.style.setProperty('--o', q[2]);
    });
  }

  /* ------------------------------------------------------------------------
     4. Le fil : rail, nœuds, filet de progression, traits de chapitre
     ------------------------------------------------------------------------ */
  var chs = [], boites = [], ps = [], noeuds = [], traits = [], dps = [];
  var rail = null, railFill = null, railBox = null, prog = null, raf = 0, tMes = 0, pret = false;

  function boite(c) {
    var p = c.parentElement;
    return (p && /(^|\s)pin-spacer(\s|$)/.test(p.className)) ? p : c;
  }
  function construireFil() {
    chs = arr(D.querySelectorAll('[data-chapitre]'));
    chs.forEach(function (c, i) {
      var t = c.getAttribute('data-fil-trait');
      if (i === 0 || t === 'non') return;
      var has = false;
      arr(c.children).forEach(function (k) { if (k.classList && k.classList.contains('kz-fil-trait')) has = true; });
      if (has) return;
      var s = D.createElement('span');
      s.className = 'kz-fil-trait' + (t === 'centre' ? ' kz-fil-trait--c' : '');
      s.setAttribute('aria-hidden', 'true');
      c.appendChild(s);
    });
    traits = arr(D.querySelectorAll('.kz-fil-trait'));
    while (dps.length < traits.length) dps.push(reduit() ? 1 : 0);
    if (chs.length > 1 && !rail) {
      rail = D.createElement('div');
      rail.className = 'kz-fil-rail';
      rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = '<i class="kz-fil-rail__fill"></i><span class="kz-fil-rail__noeuds"></span><i class="kz-fil-rail__tete"></i>';
      D.body.appendChild(rail);
      railFill = rail.firstChild;
      railBox = rail.querySelector('.kz-fil-rail__noeuds');
      prog = D.createElement('i');
      prog.className = 'kz-fil-progres';
      prog.setAttribute('aria-hidden', 'true');
      D.body.appendChild(prog);
    }
  }
  function maxScroll() { return Math.max(1, (D.documentElement.scrollHeight || D.body.scrollHeight) - (W.innerHeight || 1)); }
  function mesurer() {
    tMes = 0;
    if (!pret) return;
    construireFil();
    var y = W.pageYOffset || 0, vh = W.innerHeight || 1, max = maxScroll();
    boites = chs.map(function (c) {
      var r = boite(c).getBoundingClientRect();
      return { top: r.top + y, bas: r.bottom + y };
    });
    ps = boites.map(function (b) { return borne((b.top - vh * .5) / max); });
    if (railBox) {
      rail.style.setProperty('--rh', rail.offsetHeight + 'px');
      railBox.textContent = '';
      noeuds = ps.map(function (v) {
        var k = D.createElement('i');
        k.className = 'kz-fil-rail__noeud';
        k.style.top = (v * 100).toFixed(3) + '%';
        railBox.appendChild(k);
        return k;
      });
      rail.classList.add('is-on');
    }
    tick();
  }
  function mesurerBientot() { if (!pret) return; clearTimeout(tMes); tMes = setTimeout(mesurer, 120); }

  function cadre() {
    raf = 0;
    var y = W.pageYOffset || 0, vh = W.innerHeight || 1, p = borne(y / maxScroll()), encore = false, rm = reduit();
    var fp = p.toFixed(4);
    if (rail) rail.style.setProperty('--fp', fp);
    if (prog) prog.style.setProperty('--fp', fp);
    for (var i = 0; i < noeuds.length; i++) noeuds[i].classList.toggle('is-lit', p >= ps[i] - .002);
    for (var j = 0; j < traits.length; j++) {
      var r = traits[j].getBoundingClientRect();
      if (!r.height) continue;
      var cible = borne((vh * .94 - r.top) / (vh * .46 + r.height));
      var v = rm ? cible : dps[j] + (cible - dps[j]) * .2;
      if (Math.abs(cible - v) < .002) v = cible; else encore = true;
      if (v !== dps[j] || !traits[j].__kzVu) { dps[j] = v; traits[j].__kzVu = 1; traits[j].style.setProperty('--dp', v.toFixed(3)); }
    }
    /* L'aura suit le chapitre qui occupe le centre de l'écran */
    if (aura && boites.length) {
      var cur = 0, mid = y + vh * .5;
      for (var k = 0; k < boites.length; k++) if (boites[k].top <= mid) cur = k;
      placerAura(chs[cur] && chs[cur].getAttribute('data-aura'));
    }
    if (encore) raf = requestAnimationFrame(cadre);
  }
  function tick() { if (!raf) raf = requestAnimationFrame(cadre); }

  /* ------------------------------------------------------------------------
     5. L'arche : le fil dessiné à la taille réelle, tracé à l'entrée à l'écran
     ------------------------------------------------------------------------ */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var ioArche = null;
  function chemin(w, h, e) {
    var x0 = -e, x1 = w + e, r = (x1 - x0) / 2, cy = -e + r;
    return 'M' + f1(x0) + ' ' + f1(h) + 'V' + f1(cy) + 'A' + f1(r) + ' ' + f1(r) + ' 0 0 1 ' + f1(x1) + ' ' + f1(cy) + 'V' + f1(h);
  }
  function arche(el) {
    if (!el || el.__kzArche) return;
    el.__kzArche = true;
    if (!el.hasAttribute('data-arche-trace')) el.setAttribute('data-arche-trace', '');
    var svg = D.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'kz-arche__trace');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var ombre = D.createElementNS(SVGNS, 'path'), fil = D.createElementNS(SVGNS, 'path');
    ombre.setAttribute('class', 'kz-arche__ombre');
    fil.setAttribute('class', 'kz-arche__fil');
    [ombre, fil].forEach(function (p) { p.setAttribute('pathLength', '1'); svg.appendChild(p); });
    el.appendChild(svg);
    var dessiner = function () {
      var w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) return;
      var e = parseFloat(getComputedStyle(el).getPropertyValue('--arche-ecart'));
      if (isNaN(e)) e = Math.max(8, Math.min(18, w * .04));
      svg.setAttribute('viewBox', '0 0 ' + f1(w) + ' ' + f1(h));
      fil.setAttribute('d', chemin(w, h, 0));
      ombre.setAttribute('d', chemin(w, h, e));
    };
    dessiner();
    if (W.ResizeObserver) new ResizeObserver(dessiner).observe(el);
    else W.addEventListener('resize', dessiner);
    if (reduit() || !W.IntersectionObserver) { el.classList.add('is-trace'); return; }
    if (!ioArche) {
      ioArche = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var t = en.target;
          ioArche.unobserve(t);
          requestAnimationFrame(function () { t.classList.add('is-trace'); });
        });
      }, { threshold: .2 });
    }
    ioArche.observe(el);
  }
  function arches() { arr(D.querySelectorAll('[data-arche-trace]')).forEach(arche); }

  /* ------------------------------------------------------------------------
     6. La loupe : une seule lentille pour toute la page, branchée par délégation
     ------------------------------------------------------------------------ */
  var L = null, A = null, rafL = 0;
  function lentille() {
    if (L) return L;
    var el = D.createElement('div');
    el.className = 'kz-loupe';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="kz-loupe__corps"><div class="kz-loupe__disque"><div class="kz-loupe__in"></div><i class="kz-loupe__teinte"></i></div><i class="kz-loupe__bague"></i></div>';
    D.body.appendChild(el);
    L = { el: el, corps: el.firstChild, inn: el.querySelector('.kz-loupe__in') };
    return L;
  }
  /* Rotation et échelle cumulées (les tirages penchés restent alignés dans la lentille) */
  function pose(el) {
    var ang = 0, k = 1, e = el, n = 0;
    while (e && e.nodeType === 1 && e !== D.body && n < 8) {
      var cs = getComputedStyle(e), t = cs.transform;
      if (t && t !== 'none' && W.DOMMatrixReadOnly) {
        try { var m = new DOMMatrixReadOnly(t); ang += Math.atan2(m.b, m.a); k *= Math.sqrt(m.a * m.a + m.b * m.b) || 1; } catch (er) {}
      }
      if (cs.rotate && cs.rotate !== 'none') { var rr = parseFloat(String(cs.rotate).replace(/^[a-z\s]+/i, '')); if (!isNaN(rr)) ang += rr * Math.PI / 180; }
      if (cs.scale && cs.scale !== 'none') { var sc = parseFloat(cs.scale); if (!isNaN(sc) && sc > 0) k *= sc; }
      e = e.parentElement; n++;
    }
    return { ang: ang, k: k };
  }
  function visible(el) {
    var o = 1, e = el, n = 0;
    while (e && e.nodeType === 1 && e !== D.body && n < 8) {
      var cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      o *= parseFloat(cs.opacity);
      e = e.parentElement; n++;
    }
    return o > .55;
  }
  function optionsDe(h) {
    var o = h.__kzLoupeO || {};
    var a = parseFloat(h.getAttribute('data-loupe')), t = parseFloat(h.getAttribute('data-loupe-taille'));
    return {
      echelle: o.echelle || (a > 1 && a < 2 ? a : 1.1),
      taille: o.taille || (t > 60 ? t : 0),
      source: o.source || null
    };
  }
  function demarrer(h, ex, ey) {
    arreterLoupe();
    var o = optionsDe(h), src = o.source || h;
    var l = lentille();
    var node = src.cloneNode(true);
    node.removeAttribute('id');
    node.removeAttribute('data-loupe');
    arr(node.querySelectorAll('[id]')).forEach(function (n) { n.removeAttribute('id'); });
    arr(node.querySelectorAll('[data-loupe]')).forEach(function (n) { n.removeAttribute('data-loupe'); });
    if (node.tagName === 'IMG') { node.alt = ''; node.loading = 'eager'; }
    arr(node.querySelectorAll('img')).forEach(function (im) { im.alt = ''; im.loading = 'eager'; im.removeAttribute('fetchpriority'); });
    node.classList.add('kz-loupe__clone');
    var w = src.offsetWidth, hh = src.offsetHeight;
    node.style.width = w + 'px';
    node.style.height = hh + 'px';
    l.inn.textContent = '';
    l.inn.appendChild(node);
    if (o.taille) l.el.style.setProperty('--lt', o.taille + 'px'); else l.el.style.removeProperty('--lt');
    var p = pose(src);
    var cache = !h.matches('a,button,[role="button"]') && !h.querySelector('a,button,input,textarea,select');
    A = { h: h, src: src, node: node, S: o.echelle, w: w, hh: hh, ang: p.ang, k: p.k, tx: ex, ty: ey, x: ex, y: ey, R: (l.corps.offsetWidth || 168) / 2, cache: cache, n: 0 };
    if (cache) H.classList.add('kz-loupe-curseur');
    l.el.classList.add('is-on');
    cadreLoupe();
  }
  function arreterLoupe() {
    if (rafL) { cancelAnimationFrame(rafL); rafL = 0; }
    if (!A) return;
    H.classList.remove('kz-loupe-curseur');
    A = null;
    if (L) L.el.classList.remove('is-on');
  }
  function cadreLoupe() {
    rafL = 0;
    var a = A;
    if (!a || !L) return;
    var r = a.h.getBoundingClientRect();
    if (a.tx < r.left || a.tx > r.right || a.ty < r.top || a.ty > r.bottom || !r.width || (++a.n % 12 === 0 && !visible(a.h))) { arreterLoupe(); sonderBientot(); return; }
    a.x += (a.tx - a.x) * .24;
    a.y += (a.ty - a.y) * .24;
    var R = a.R;
    L.corps.style.transform = 'translate3d(' + f1(a.x - R) + 'px,' + f1(a.y - R) + 'px,0)';
    var rs = a.src === a.h ? r : a.src.getBoundingClientRect();
    var cx = rs.left + rs.width / 2, cy = rs.top + rs.height / 2;
    var qx = R - a.S * (a.x - cx), qy = R - a.S * (a.y - cy);
    a.node.style.transform = 'translate(' + f1(qx - a.w / 2) + 'px,' + f1(qy - a.hh / 2) + 'px) rotate(' + a.ang.toFixed(4) + 'rad) scale(' + (a.S * a.k).toFixed(4) + ')';
    if (Math.abs(a.tx - a.x) > .3 || Math.abs(a.ty - a.y) > .3) rafL = requestAnimationFrame(cadreLoupe);
  }
  function relancerLoupe() { if (A && !rafL) rafL = requestAnimationFrame(cadreLoupe); }
  /* On cherche l'hôte sous la souris par ses dimensions : les calques épinglés (pointer-events:none)
     n'empêchent rien, et un calque invisible ne déclenche rien. */
  var hotes = [], hotesT = 0, sx = -1, sy = -1, rafS = 0;
  function listeHotes() {
    var t = Date.now();
    if (t - hotesT > 700) { hotes = arr(D.querySelectorAll('[data-loupe]')); hotesT = t; }
    return hotes;
  }
  function sonder() {
    rafS = 0;
    if (sx < 0 || A || reduit() || !(MQ_SOURIS && MQ_SOURIS.matches)) return;
    var dessus = D.elementFromPoint(sx, sy);
    if (dessus && dessus.closest && dessus.closest('.nav, a, button, input, textarea, select, label, .kz-revue')) return;
    var hs = listeHotes();
    for (var i = hs.length - 1; i >= 0; i--) {
      var r = hs[i].getBoundingClientRect();
      if (r.width > 40 && sx >= r.left && sx <= r.right && sy >= r.top && sy <= r.bottom && visible(hs[i])) { demarrer(hs[i], sx, sy); return; }
    }
  }
  function sonderBientot() { if (!rafS) rafS = requestAnimationFrame(sonder); }
  function brancherLoupe() {
    D.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      sx = e.clientX; sy = e.clientY;
      if (A) { A.tx = sx; A.ty = sy; relancerLoupe(); } else sonderBientot();
    }, { passive: true });
    D.addEventListener('pointerout', function (e) { if (!e.relatedTarget) { sx = -1; arreterLoupe(); } }, { passive: true });
    D.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { sx = -1; arreterLoupe(); } }, { passive: true });
  }
  function loupe(el, o) {
    if (!el) return function () {};
    el.__kzLoupeO = o || {};
    if (!el.hasAttribute('data-loupe')) el.setAttribute('data-loupe', '');
    hotesT = 0;
    return function () { if (A && A.h === el) arreterLoupe(); el.removeAttribute('data-loupe'); el.__kzLoupeO = null; hotesT = 0; };
  }

  /* ------------------------------------------------------------------------
     7. Démarrage
     ------------------------------------------------------------------------ */
  function auChargement(fn) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }
  auChargement(function () {
    suivre();
    try { bouton(); } catch (e) { console.error('[kz-theme] bouton : ' + e.message); }
    try { creerAura(); } catch (e) { console.error('[kz-theme] aura : ' + e.message); }
    try { brancherLoupe(); } catch (e) { console.error('[kz-theme] loupe : ' + e.message); }
    /* Après les modules (ils remplissent leur section à DOMContentLoaded) */
    setTimeout(function () {
      pret = true;
      try { arches(); } catch (e) { console.error('[kz-theme] arches : ' + e.message); }
      try { mesurer(); } catch (e) { console.error('[kz-theme] fil : ' + e.message); }
      if (aura) {
        var c0 = D.querySelector('[data-chapitre]');
        placerAura(c0 && c0.getAttribute('data-aura'));
        requestAnimationFrame(function () { aura.classList.add('is-on'); });
      }
      if (W.ScrollTrigger && W.ScrollTrigger.addEventListener) W.ScrollTrigger.addEventListener('refresh', mesurerBientot);
      if (W.ResizeObserver) new ResizeObserver(mesurerBientot).observe(D.body);
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(mesurerBientot);
    }, 0);
    ['kz-apps:pret', 'victoire:pret'].forEach(function (n) { D.addEventListener(n, function () { suivre(); mesurerBientot(); }); });
    W.addEventListener('load', mesurerBientot);
    W.addEventListener('resize', mesurerBientot);
    W.addEventListener('scroll', function () { tick(); if (A) relancerLoupe(); else if (sx >= 0) sonderBientot(); }, { passive: true });
  });

  W.KzTheme = {
    mode: function () { return mode; },
    definir: function (v) { changer(v, 'user'); },
    basculer: function () { changer(mode === 'dark' ? 'light' : 'dark', 'user'); },
    loupe: loupe,
    arche: function (el) { arche(el); },
    rafraichir: mesurerBientot,
    porte: PORTE
  };
})();
