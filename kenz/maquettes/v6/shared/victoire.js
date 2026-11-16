/* ==========================================================================
   Victoire : « 54 heures », Escapades Libres au Startup Weekend (module partagé, brief V6-EL, 7e version)

   Dans la page :
     <head>   <link rel="stylesheet" href="shared/victoire.css">
     <body>   <section id="victoire" class="kz-victoire" data-kz-victoire data-theme="dark"
                       aria-label="Escapades Libres au Startup Weekend"></section>
     fin      GSAP 3.12.5 + ScrollTrigger (facultatifs, chargés AVANT), puis
              <script src="shared/victoire.js"></script>
   Le script remplit chaque [data-kz-victoire] et gère lui-même son épinglage.
   Images cherchées à partir de l'adresse du script : ../assets/img/ (photos) et ../assets/el/ (captures du site).
   Réglages facultatifs sur la section :
     data-img="…/img/"   data-el="…/el/"   data-projet="app.html#escapades-libres"   data-site="https://…"

   Le récit, en images (épinglé sur 3 écrans ; le compteur 54 h, petit, défile du début à la fin) :
     1. Plein de monde, plein de projets, un seul choisi. « Startup Weekend » (drapeau), un mur de post-it de
        pitchs (couleurs douces, de travers, chacun avec un petit pictogramme d'idée, aucun nom) : « Vendredi soir,
        des dizaines d'idées. » ; des avatars ronds, anonymes, se regroupent autour de certains : « Des équipes se
        forment. » ; un faisceau de projecteur balaie le mur, les autres pâlissent, il s'arrête sur le nôtre (le logo
        d'Escapades Libres), qui vient au premier plan en or : « Dimanche, le jury en choisit une. »
     2. Mon rôle, en trois images qui se changent l'une en l'autre :
        « J'écoute la cliente. » : une bulle avec son besoin, dans ses mots, et une oreille en trait fin ;
        « Je conçois la solution : design et UX. » : la bulle devient une table de travail d'outil de design
        (fond à points, trois plans de travail : les vraies maquettes, un panneau de styles) ; un curseur
        sélectionne l'accueil (cadre, poignées, dimensions), un repère d'alignement s'allume ;
        « Je développe un premier MVP en 24 heures. » : la maquette sélectionnée s'ouvre et devient la vraie
        plateforme, dans une fenêtre de navigateur, pendant qu'un « 24 h » file.
        Puis : « Du besoin du client au produit. »
     3. Dimanche. Pendant que le compteur file vers 00:00:00, on traverse un couloir d'arches (la porte du hero,
        répétée) ; la dernière arche est le cadre de la photo. À zéro, un éclat : la photo des bras levés prend
        la scène, en paysage, dans une arche large (bas droit, haut arrondi, 3:2 ; recadrée sur les deux qui
        célèbrent, jamais en plein fond, jamais agrandie au-delà de sa taille réelle ; crédit photo dessous).
        Le moment triomphant, en constellation :
        des étoiles dorées s'allument une à une autour de l'arche, des fils fins les relient en couronne de
        lauriers, un rayon de lumière s'ouvre derrière les bras levés, deux ou trois étoiles filantes montent,
        puis un scintillement très léger s'installe. Le compteur s'efface ; dans la colonne, un immense « 1re » or
        se lève, puis « Escapades Libres » et « 1re place · Startup Weekend Grenoble · 2025 » ;
        un grand podium en 3D se monte au centre bas, devant la photo (les marches montent, la or en dernier avec
        un éclat) ; deux petits tirages (le chèque, l'équipe) se posent sur le bord droit du cadre ; enfin
        « Aujourd'hui, elle est en ligne. », « Voir la plateforme ↗ », « Découvrir le projet » (Passage or).
        Le podium tourne légèrement au pointeur (± 10°), à la souris seulement.

   Modes :
     - ordinateur ≥ 900 × 600 avec GSAP + ScrollTrigger, sans mouvement réduit : la section est épinglée ;
       « vu une fois » : dès que la fin est atteinte (onLeave ou progression ≥ 0,98), l'état final est figé,
       puis, au repos du défilement, l'épinglage est retiré et la position compensée de la hauteur ôtée :
       la section devient un bloc statique d'un écran (la photo couronnée, le « 1re », le podium, le texte,
       les boutons). Drapeau sessionStorage « kz-54h-vu » : l'état final tient pendant toute la session ;
       arrivée sous la section (ancre, rechargement en bas, retour arrière) : l'état final directement ;
     - sinon : les trois temps se suivent, chacun joué à son entrée (temps 2 et 3 avec GSAP s'il est là) ;
     - mouvement réduit : fondus, chaque temps posé dans son état final, podium immobile.

   API : window.KzVictoire.init(section) (appelé tout seul au chargement),
         window.KzVictoire.refresh() (recalcule l'épinglage après un changement de mise en page).
   Événement : « victoire:pret » sur la section quand elle est remplie.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  if (W.KzVictoire) return;

  var SRC = (D.currentScript && D.currentScript.src) || '';
  var RMQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var FINQ = W.matchMedia ? W.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var PIN_Q = '(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
  var PIN_ECRANS = 3;                            /* longueur de l'épinglage, en hauteurs d'écran */
  var HR = 3600, H54 = 54 * HR, H30 = 30 * HR, H14 = 14 * HR;
  var PROJET = 'app.html#escapades-libres', SITE = 'https://escapades-libres.vercel.app', OR = '#E3A21A';
  var TAU = Math.PI * 2;
  function rng(a) {                               /* tirages fixes : le mur est toujours le même */
    return function () {
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* Le mur de post-it : 7 × 4, le nôtre au rang 1, colonne 3 ; des pictogrammes d'idées, aucun nom de projet */
  var MC = 7, ML = 4, NOTRE = 10;
  var TEINTES = ['#FFF0A6', '#FFD4DF', '#C8EDD5', '#CFE2FF', '#E3D7FF', '#FFDDBD'];
  var PICTOS = [
    'M8 3v6M12 3v6M16 3v6M8 9a4 4 0 0 0 8 0M12 13v8',                                   /* une fourchette */
    'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l8-8',                                    /* une feuille */
    'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-6h4v6',                                       /* une maison */
    'M6.5 17.5a3.5 3.5 0 1 0 0-.01M17.5 17.5a3.5 3.5 0 1 0 0-.01M6.5 17.5L10 10h6.5l1 7.5M10 10L9 7H7M13 17.5L16.5 10',  /* un vélo */
    'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',   /* une note */
    'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',                 /* un cœur */
    'M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0',                                               /* un sac */
    'M4 6.5C6.5 5 9.5 5 12 6.5 14.5 5 17.5 5 20 6.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 6.5V19',  /* un livre */
    'M4 8h4l2-2h4l2 2h4v11H4zM12 16a3 3 0 1 0 0-.01',                                  /* un appareil photo */
    'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.5a2 2 0 0 1 0 4H16M9 3.5v3M12.5 3.5v3',  /* une tasse */
    'M12 15.5a3.5 3.5 0 1 0 0-.01M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8',  /* un soleil */
    'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z',                /* une ampoule */
    'M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12',                                             /* un haltère */
    'M12 20c-3 0-5-1.8-5-3.8S9 13 12 13s5 1.2 5 3.2S15 20 12 20zM6.5 10.5a1.6 2 0 1 0 0-.01M10 7.5a1.6 2 0 1 0 0-.01M14 7.5a1.6 2 0 1 0 0-.01M17.5 10.5a1.6 2 0 1 0 0-.01'  /* une patte */
  ];
  var AV_TEINTES = ['#9FB4D6', '#D6B49A', '#A8D0C0', '#E0AFBC', '#BFB1E3', '#CFC6B4'];
  var MUR = (function () {
    var r = rng(54), pi = [], av = [], n;
    for (n = 0; n < MC * ML; n++) {
      var c = n % MC, l = Math.floor(n / MC);
      pi.push({ x: (c + .5) / MC * 100 + (r() - .5) * 4.4, y: (l + .5) / ML * 100 + (r() - .5) * 7, rot: (r() - .5) * 14,
        t: TEINTES[Math.floor(r() * TEINTES.length)], ic: (n * 5) % PICTOS.length, d: r() });
    }
    pi[NOTRE].x = 50; pi[NOTRE].y = 37.5; pi[NOTRE].rot = -3;
    /* Les équipes se forment : des avatars ronds viennent sous certains post-it */
    [NOTRE, 1, 5, 8, 15, 19, 23, 26].forEach(function (k, j) {
      var m = 3 + (j % 3), p = pi[k];
      for (var a = 0; a < m; a++) {
        av.push({ k: k, x: p.x + (a - (m - 1) / 2) * 3.1, y: p.y + 10.2 + Math.abs(a - (m - 1) / 2) * -.8,
          x0: 6 + r() * 88, y0: 6 + r() * 88, c: AV_TEINTES[Math.floor(r() * AV_TEINTES.length)] });
      }
    });
    return { pi: pi, av: av };
  })();
  /* Le couloir : 7 arches puis la dernière (le cadre de la photo) ; perspective P, écart GAP (px) */
  var PORTES = 7, P = 900, GAP = 420;

  /* La couronne de lauriers en étoiles, autour du haut de l'arche large (3:2 ; haut en demi-ellipse de centre
     u .5, v .38). Repère de l'arche : u (0 → 1 en largeur), v (0 → 1 en hauteur) ; la boîte de la constellation
     va de u -0,1 à 1,1 et de v -0,2 à 0,7 (repère 120 × 60, même rapport que la boîte). */
  var CONS = { u0: -.1, du: 1.2, v0: -.2, dv: .9, W: 120, H: 60 };
  var COURONNE = (function () {
    var st = [], fils = [], A = [165, 182, 198, 214, 230, 246, 258], g = [], d = [];
    function pt(u, v, k, cls) { st.push({ x: (u - CONS.u0) / CONS.du * CONS.W, y: (v - CONS.v0) / CONS.dv * CONS.H, u: u, v: v, k: k, c: cls || '' }); return st.length - 1; }
    A.forEach(function (deg, n) {
      var t = deg * Math.PI / 180, u = .5 + .545 * Math.cos(t), v = .38 + .46 * Math.sin(t);
      g.push(pt(u, v, n)); d.push(pt(1 - u, v, n + .04));
    });
    var haut = pt(.5, -.11, 8, ' kv-st--haut');
    for (var n = 0; n < A.length - 1; n++) { fils.push([g[n], g[n + 1]]); fils.push([d[n], d[n + 1]]); }
    fils.push([g[A.length - 1], haut]); fils.push([d[A.length - 1], haut]);
    [1, 3, 5].forEach(function (n) {                /* les feuilles du laurier */
      var t = (A[n] + 25) * Math.PI / 180, p = st[g[n]], du = .06 * Math.cos(t), dv = .09 * Math.sin(t);
      var u = p.u, v = p.v;
      fils.push([g[n], pt(u + du, v + dv, n + .5, ' kv-st--f')]);
      fils.push([d[n], pt(1 - u - du, v + dv, n + .54, ' kv-st--f')]);
    });
    return { st: st, fils: fils };
  })();

  /* Le symbole d'Escapades Libres : les deux arcs du site (logo_symbol.svg, repère 128) */
  var ARCS = '<path d="M62 41A29 29 0 1 0 62 87"/><path d="M99 41A29 29 0 1 0 99 87"/>';
  function marque(cls) {
    return '<svg class="' + cls + '" viewBox="7 27 100 74" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round">' + ARCS + '</g></svg>';
  }
  /* L'icône du passage : le symbole or sur le bleu nuit du site */
  var ICONE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="#121A2B"/><g transform="translate(64 64) scale(.72) translate(-57 -64)" fill="none" stroke="#E3A21A" stroke-width="12" stroke-linecap="round">' + ARCS + '</g></svg>');
  var DRAPEAU = '<svg class="kv-flag" viewBox="0 0 3 2" role="img" aria-label="France" focusable="false"><rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#FFFFFF"/><rect x="2" width="1" height="2" fill="#EF4135"/></svg>';
  var ICO_SORTIE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>';
  var ICO_FLECHE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5"/></svg>';
  var ICO_CADENAS = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.2"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';
  /* L'oreille, en trait fin (repère 48) */
  var OREILLE = '<svg class="kv-ear" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path pathLength="1" d="M13 19.5C13 11.5 19 6 26 6s13 5.5 13 13.5c0 6.3-3.5 9.3-6.2 11.6-2.3 2-3.5 3.8-3.5 7.2 0 4.3-3.4 7.7-7.6 7.7-3.4 0-6.3-2.2-7.3-5.3"/>' +
    '<path pathLength="1" d="M19.5 19.5c0-4 2.9-7 6.5-7s6.5 3 6.5 7c0 2.8-1.5 4.3-3 5.6"/>' +
    '<path pathLength="1" d="M6 15c-1.4 2.6-1.4 6.4 0 9M2.6 12.4c-2.6 4.4-2.6 9.8 0 14.2"/></svg>';
  /* Le curseur de l'outil de design */
  var CURSEUR = '<svg class="kv-cur__i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 3l14 8.2-6.3 1.5L9.2 19z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  /* ---------- Outils ---------- */
  function box(el, root) {                        /* position dans root, sans les transformations */
    var x = 0, y = 0, e = el;
    while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function base(sec, attr, rel) {
    var d = sec.getAttribute(attr);
    try { return d ? new URL(d, location.href).href : new URL(rel, SRC || location.href).href; }
    catch (e) { return d || rel; }
  }
  function words(html) {
    return html.split(' ').map(function (w, n) { return '<span class="kv-w" style="--i:' + n + '">' + w + '</span>'; }).join(' ');
  }
  function c01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ---------- Le compteur ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(s) {
    s = Math.max(0, Math.ceil(s - 1e-6));
    return pad(Math.floor(s / 3600)) + pad(Math.floor(s % 3600 / 60)) + pad(s % 60);
  }
  function clockHTML(v) {
    var str = fmt(v), h = '', n = 0;
    for (var x = 0; x < 8; x++) {
      if (x === 2 || x === 5) h += '<span class="kv-sep">:</span>';
      else { h += '<span class="kv-slot' + (str[n] === '0' ? ' is-0' : '') + '"><span class="kv-dg" style="--i:' + n + '">' + str[n] + '</span></span>'; n++; }
    }
    return h;
  }
  function setClock(groups, v) {
    var str = fmt(v);
    for (var g = 0; g < groups.length; g++) {
      var dg = groups[g];
      for (var x = 0; x < 6; x++) {
        if (dg[x].textContent === str[x]) continue;
        dg[x].textContent = str[x];
        dg[x].parentNode.classList.toggle('is-0', str[x] === '0');   /* le zéro de Melodrama est large : resserré */
      }
    }
  }

  /* ---------- Le couloir d'arches : la caméra avance de 0 (entrée) à 1 (devant le cadre de la photo) ---------- */
  function couloir(R, p) {
    var cam = p * PORTES * GAP;
    for (var i = 0; i <= PORTES; i++) {
      var el = i < PORTES ? R.doors[i] : R.arch;
      var z = cam - i * GAP, s = P / (P - Math.min(z, P * .92));
      var o = c01((s - .16) / .22);
      if (z > 0) o *= 1 - c01(z / (P * .42));
      el.style.transform = 'scale(' + s.toFixed(4) + ')';
      if (i < PORTES) el.style.opacity = o.toFixed(3);
    }
  }
  /* La photo (1200 × 800) dans l'arche : centrée sur les deux qui célèbrent (x 48 %, y 35 %), à peine au-delà
     de la couverture minimale, jamais agrandie au-delà de sa taille réelle ; le filigrane reste hors du cadre */
  var PHOTO = { w: 1200, h: 800, x: .48, y: .3, bas: .78 };
  function cadrer(R) {
    var bw = R.archIn.offsetWidth, bh = R.archIn.offsetHeight;
    if (!bw || !bh) return;
    /* au moins la couverture, et le bas coupé au-dessus de 78 % (le filigrane) ; jamais au-delà de 1 */
    var s = Math.min(1, Math.max(bw / PHOTO.w, bh / PHOTO.h, bh / (PHOTO.h * PHOTO.bas))), w = PHOTO.w * s, h = PHOTO.h * s;
    var l = Math.min(0, Math.max(bw - w, bw * .5 - PHOTO.x * w)), t = Math.min(0, Math.max(bh - h, bh * .42 - PHOTO.y * h));
    var im = R.archImg.style;
    im.width = w.toFixed(1) + 'px'; im.height = h.toFixed(1) + 'px'; im.left = l.toFixed(1) + 'px'; im.top = t.toFixed(1) + 'px';
  }
  function faisceau(R, g) {
    var w = R.wall.offsetWidth, h = R.wall.offsetHeight;
    if (!w || !h) return;
    var px = w * .5, py = -h * .34, p = MUR.pi[NOTRE], dx = w * p.x / 100 - px, dy = h * p.y / 100 - py;
    g.ww = w; g.wh = h; g.a = -Math.atan2(dx, dy) * 180 / Math.PI; g.l = Math.hypot(dx, dy);
    R.beamC.style.height = (g.l + w * .06).toFixed(1) + 'px';
    R.beam.style.setProperty('--kv-bw', (w * .26).toFixed(1) + 'px');
  }
  function couloirFin(R) {                        /* état final : les arches traversées, le cadre à sa place */
    R.doors.forEach(function (d) { d.style.opacity = '0'; d.style.transform = ''; });
    R.arch.style.transform = '';
  }

  /* ---------- Le contenu ---------- */
  function build(sec) {
    var IMG = base(sec, 'data-img', '../assets/img/'), EL = base(sec, 'data-el', '../assets/el/');
    var projet = sec.getAttribute('data-projet') || PROJET, site = sec.getAttribute('data-site') || SITE;
    var host = site.replace(/^https?:\/\//, '').replace(/\/$/, '');
    var x, mur = '', avatars = '', sparks = '', doors = '';
    MUR.pi.forEach(function (p, n) {
      var st = 'left:' + p.x.toFixed(2) + '%;top:' + p.y.toFixed(2) + '%;--r:' + p.rot.toFixed(1) + 'deg;--t:' + p.t;
      mur += n === NOTRE
        ? '<i class="kv-pi kv-pi--el" style="' + st + '"><b class="kv-pi__in">' + marque('kv-pi__mark') + '</b></i>'
        : '<i class="kv-pi" style="' + st + '"><b class="kv-pi__in"><svg viewBox="0 0 24 24" focusable="false"><path d="' + PICTOS[p.ic] + '"/></svg></b></i>';
    });
    MUR.av.forEach(function (a) {
      avatars += '<i class="kv-av' + (a.k === NOTRE ? ' kv-av--el' : '') + '" style="left:' + a.x.toFixed(2) + '%;top:' + a.y.toFixed(2) + '%;--c:' + a.c + '">' +
        '<svg viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="7.6" r="3.3"/><path d="M3.8 17.2c1-3.7 3.4-5.4 6.2-5.4s5.2 1.7 6.2 5.4"/></svg></i>';
    });
    for (x = 0; x < 10; x++) {
      var a = x / 10 * TAU + Math.sin(x * 2.3) * .25, rr = 80 + (x * 37 % 70);
      sparks += '<i style="--i:' + x + ';--sx:' + (Math.cos(a) * rr).toFixed(1) + 'px;--sy:' + (Math.sin(a) * rr * .8).toFixed(1) + 'px"></i>';
    }
    for (x = 0; x < PORTES; x++) doors += '<i class="kv-door"></i>';
    var etoiles = COURONNE.st.map(function (p, n) {
      return '<i class="kv-st' + p.c + '" style="left:' + (p.x / CONS.W * 100).toFixed(2) + '%;top:' + (p.y / CONS.H * 100).toFixed(2) + '%;--d:' + (2.4 + (n * 37 % 17) / 10).toFixed(2) + 's;--dd:-' + ((n * 53 % 23) / 10).toFixed(2) + 's"><b class="kv-st__a"></b></i>';
    }).join('');
    var fils = COURONNE.fils.map(function (f) {
      var a = COURONNE.st[f[0]], b = COURONNE.st[f[1]];
      return '<line pathLength="1" x1="' + a.x.toFixed(2) + '" y1="' + a.y.toFixed(2) + '" x2="' + b.x.toFixed(2) + '" y2="' + b.y.toFixed(2) + '"/>';
    }).join('');
    var mini = function (v) { return '<div class="kv-mini" aria-hidden="true">' + clockHTML(v) + '</div>'; };
    var bloc = function (n, contenu) {
      return '<div class="kv-blk kv-blk--' + n + '"><div class="kv-blk__in">' +
        '<i class="kv-f kv-f--tp">' + (n === 1 ? '<b class="kv-glint"></b>' : '') + '</i>' +
        '<i class="kv-f kv-f--sd"></i>' +
        '<span class="kv-f kv-f--fr">' + contenu + '</span>' +
      '</div></div>';
    };
    var plan = function (n, nom, img) {
      return '<span class="kv-ab kv-ab--' + n + '"><span class="kv-ab__nom">' + nom + '</span>' +
        '<img src="' + EL + img + '" alt="" width="780" height="1688" loading="lazy" decoding="async"></span>';
    };

    sec.innerHTML =
      '<div class="kv-stage">' +
        '<i class="kv-glow" aria-hidden="true"></i>' +
        '<div class="kv-clock" aria-hidden="true"><span class="kv-face">' + clockHTML(H54) + '</span></div>' +
        '<p class="kv-sr">54 heures, du vendredi au dimanche.</p>' +

        /* 1. Beaucoup d'équipes, une seule gagne */
        '<div class="kv-t kv-t1">' +
          '<div class="kv-col">' + mini(H54) +
            '<h2 class="kv-h kv-h--sw"><span class="kv-w" style="--i:0">Startup</span> <span class="kv-w" style="--i:1">Weekend' + DRAPEAU + '</span></h2>' +
            '<p class="kv-date">Grenoble · 28–30 novembre 2025</p>' +
            '<div class="kv-l1s">' +
              '<p class="kv-line kv-line--1">' + words('Vendredi soir, des dizaines d’<em>idées</em>.') + '</p>' +
              '<p class="kv-line kv-line--2">' + words('Des équipes se <em>forment</em>.') + '</p>' +
              '<p class="kv-line kv-line--3">' + words('Dimanche, le jury en choisit <em>une</em>.') + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="kv-wall" role="img" aria-label="Un mur de post-it de pitchs, chacun une idée ; des équipes se forment autour ; le projecteur s’arrête sur celui d’Escapades Libres.">' +
            mur + avatars +
            '<span class="kv-beam" aria-hidden="true"><i class="kv-beam__c"></i></span>' +
          '</div>' +
        '</div>' +

        /* 2. Mon rôle : écouter, concevoir, développer */
        '<div class="kv-t kv-t2">' +
          '<div class="kv-col">' + mini(H30) +
            '<div class="kv-steps">' +
              '<p class="kv-step kv-step--1">' + words('J’écoute la <em>cliente</em>.') + '</p>' +
              '<p class="kv-step kv-step--2">' + words('Je conçois la solution&nbsp;: design et <em>UX</em>.') + '</p>' +
              '<p class="kv-step kv-step--3">' + words('Je développe un premier MVP en <em>24&nbsp;heures</em>.') + '</p>' +
              '<p class="kv-step kv-step--4">' + words('Du besoin du client au <em>produit</em>.') + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="kv-box">' +
            '<div class="kv-scene">' +
              '<i class="kv-scene__sh" aria-hidden="true"></i>' +
              '<div class="kv-scene__bar" aria-hidden="true"><i></i><i></i><i></i><span class="kv-url">' + ICO_CADENAS + '<span>' + host + '</span></span></div>' +
              '<div class="kv-scene__view">' +
                /* La table de travail d'un outil de design (sans marque) */
                '<div class="kv-desk" aria-hidden="true">' +
                  plan(1, 'Accueil', 'el-accueil.jpg') + plan(2, 'Test', 'el-test.jpg') + plan(3, 'Profil', 'el-profil-aventurier.jpg') +
                  '<i class="kv-guide"></i>' +
                  '<span class="kv-sel"><i></i><i></i><i></i><i></i><b class="kv-sel__dim">390 × 844</b></span>' +
                  '<span class="kv-panel">' +
                    '<b class="kv-panel__t">Couleurs</b>' +
                    '<span class="kv-sw"><i style="background:#121A2B"></i>#121A2B</span>' +
                    '<span class="kv-sw kv-sw--or"><i style="background:#E3A21A"></i>#E3A21A</span>' +
                    '<b class="kv-panel__t">Texte</b>' +
                    '<span class="kv-ty"><b>Aa</b>Cabinet Grotesk</span>' +
                  '</span>' +
                  '<span class="kv-cur">' + CURSEUR + '</span>' +
                '</div>' +
                /* La maquette choisie s'ouvre et devient la vraie plateforme */
                '<div class="kv-grow">' +
                  '<img class="kv-grow__m" src="' + EL + 'el-accueil.jpg" alt="" width="780" height="1688" loading="lazy" decoding="async">' +
                  '<img class="kv-shot" src="' + EL + 'el-web-hero.jpg" alt="La plateforme Escapades Libres en ligne : « Voyager libre, ensemble. », un globe et une carte postale de Lisbonne." width="1440" height="900" loading="lazy" decoding="async">' +
                '</div>' +
                '<figure class="kv-bubble">' +
                  '<blockquote class="kv-bubble__q"><p>« Trouver un voyage accessible, c’est possible. Trouver avec qui partir, beaucoup moins. »</p></blockquote>' +
                  OREILLE +
                '</figure>' +
              '</div>' +
            '</div>' +
            '<p class="kv-24" aria-hidden="true"><span class="kv-24__n">24</span>&nbsp;h<i class="kv-24__r"></i></p>' +
          '</div>' +
        '</div>' +

        /* 3. Dimanche : le couloir, l'éclat, la victoire */
        '<div class="kv-t kv-t3">' +
          '<div class="kv-col">' + mini(0) +
            '<div class="kv-swap">' +
              '<div class="kv-day"><p class="kv-h kv-h--day">' + words('Dimanche') + '</p><p class="kv-line">' + words('Le pitch, devant le jury.') + '</p></div>' +
              '<div class="kv-une">' +
                '<p class="kv-une__n" aria-hidden="true"><span class="kv-une__g">1<sup>re</sup></span></p>' +
                '<p class="kv-une__nom">Escapades Libres</p>' +
                '<p class="kv-une__l">1<sup>re</sup> place · Startup Weekend Grenoble · 2025</p>' +
              '</div>' +
            '</div>' +
            '<p class="kv-h kv-h--live">' + words('Aujourd’hui, elle est en <em>ligne</em>.') + '</p>' +
            '<div class="kv-acts">' +
              '<a class="btn btn--light kv-act" href="' + site + '" target="_blank" rel="noopener">Voir la plateforme<span class="btn__ico" aria-hidden="true">' + ICO_SORTIE + '</span></a>' +
              '<a class="btn btn--ghost kv-act" href="' + projet + '" data-kv-projet>Découvrir le projet<span class="btn__ico" aria-hidden="true">' + ICO_FLECHE + '</span></a>' +
            '</div>' +
          '</div>' +
          '<div class="kv-box">' +
            '<div class="kv-portal">' +
              '<span class="kv-doors" aria-hidden="true">' + doors + '</span>' +
              '<figure class="kv-arch"><i class="kv-arch__halo" aria-hidden="true"></i><i class="kv-arch__lum" aria-hidden="true"></i><span class="kv-arch__in">' +
                '<img class="kv-arch__img" src="' + IMG + 'startup-weekend-2.jpg" alt="Kenz, en t-shirt vert, les deux poings levés au moment de l’annonce de la première place, à côté d’un coéquipier qui lève le poing, au milieu du public qui applaudit." width="1200" height="800" loading="lazy" decoding="async">' +
                '<i class="kv-ray" aria-hidden="true"></i>' +
              '</span>' +
              '<figcaption class="kv-credit">Photo&nbsp;: Annie Frénot</figcaption></figure>' +
              '<span class="kv-cons" aria-hidden="true">' +
                '<svg class="kv-cons__fils" viewBox="0 0 ' + CONS.W + ' ' + CONS.H + '" focusable="false">' + fils + '</svg>' +
                etoiles +
                '<i class="kv-shoot kv-shoot--1"></i><i class="kv-shoot kv-shoot--2"></i><i class="kv-shoot kv-shoot--3"></i>' +
              '</span>' +
              '<span class="kv-prints">' +
                '<figure class="kv-print kv-print--equipe"><span class="kv-print__img"><img src="' + IMG + 'startup-weekend-3.jpg" alt="L’équipe, réunie devant le tableau blanc couvert de recherches." width="900" height="1200" loading="lazy" decoding="async"></span></figure>' +
                '<figure class="kv-print kv-print--cheque"><span class="kv-print__img"><img src="' + IMG + 'startup-weekend-1.jpg" alt="L’équipe sur scène avec le chèque géant du Techstars Startup Weekend Grenoble, 15e anniversaire." width="1200" height="900" loading="lazy" decoding="async"></span></figure>' +
              '</span>' +
              '<i class="kv-flash" aria-hidden="true"></i>' +
              '<span class="kv-sparks" aria-hidden="true">' + sparks + '</span>' +
            '</div>' +
            '<div class="kv-pod3" role="img" aria-label="Le podium : Escapades Libres, première place.">' +
              '<div class="kv-p3">' +
                '<i class="kv-floor"></i>' +
                bloc(2, '<b class="kv-rank">2</b>') +
                bloc(1, '<b class="kv-rank kv-rank--1">1</b><span class="kv-blk__nom">Escapades Libres</span>') +
                bloc(3, '<b class="kv-rank">3</b>') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var q = function (s, r) { return (r || sec).querySelector(s); };
    var qa = function (s, r) { return Array.prototype.slice.call((r || sec).querySelectorAll(s)); };
    var R = { sec: sec, stage: q('.kv-stage'), ts: qa('.kv-t') };
    [1, 2, 3].forEach(function (n) { R['t' + n] = q('.kv-t' + n); });
    R.glow = q('.kv-glow');
    R.clock = q('.kv-clock'); R.face = q('.kv-face'); R.seps = qa('.kv-sep', R.face);
    R.cols = qa('.kv-col'); R.minis = qa('.kv-mini');
    R.dg = { clock: [qa('.kv-dg', R.face)], m: R.minis.map(function (m) { return [qa('.kv-dg', m)]; }) };
    /* 1 */
    R.h1w = qa('.kv-t1 .kv-h .kv-w'); R.date = q('.kv-date');
    R.l1 = [1, 2, 3].map(function (n) { return qa('.kv-line--' + n + ' .kv-w'); });
    R.wall = q('.kv-wall'); R.pis = qa('.kv-pi'); R.ours = q('.kv-pi--el'); R.others = R.pis.filter(function (c) { return c !== R.ours; });
    R.avs = qa('.kv-av'); R.avsAutres = qa('.kv-av:not(.kv-av--el)'); R.avsEl = qa('.kv-av--el'); R.beam = q('.kv-beam'); R.beamC = q('.kv-beam__c');
    /* 2 */
    R.steps = [1, 2, 3, 4].map(function (n) { return qa('.kv-step--' + n + ' .kv-w'); });
    R.scene = q('.kv-scene'); R.ssh = q('.kv-scene__sh'); R.bar = q('.kv-scene__bar');
    R.desk = q('.kv-desk'); R.abs = qa('.kv-ab'); R.abNoms = qa('.kv-ab__nom'); R.guide = q('.kv-guide'); R.sel = q('.kv-sel');
    R.panel = q('.kv-panel'); R.swOr = q('.kv-sw--or'); R.cur = q('.kv-cur'); R.curI = q('.kv-cur__i');
    R.grow = q('.kv-grow'); R.growM = q('.kv-grow__m'); R.shot = q('.kv-shot');
    R.bubble = q('.kv-bubble'); R.ear = q('.kv-ear'); R.earP = qa('.kv-ear path');
    R.k24 = q('.kv-24'); R.n24 = q('.kv-24__n'); R.r24 = q('.kv-24__r');
    /* 3 */
    R.day = qa('.kv-day .kv-w'); R.l3 = qa('.kv-h--live .kv-w'); R.acts = q('.kv-acts');
    R.uneG = q('.kv-une__g'); R.uneL = q('.kv-une__l'); R.uneNom = q('.kv-une__nom');
    R.portal = q('.kv-portal'); R.doorsBox = q('.kv-doors'); R.doors = qa('.kv-door');
    R.arch = q('.kv-arch'); R.archIn = q('.kv-arch__in'); R.archImg = q('.kv-arch__img'); R.halo = q('.kv-arch__halo'); R.lum = q('.kv-arch__lum');
    R.ray = q('.kv-ray'); R.credit = q('.kv-credit'); R.cons = q('.kv-cons'); R.shoots = qa('.kv-shoot');
    R.printE = q('.kv-print--equipe'); R.printC = q('.kv-print--cheque');
    R.fils = qa('.kv-cons__fils line');
    R.stars = qa('.kv-cons .kv-st').map(function (el, n) { return { el: el, k: COURONNE.st[n].k }; }).sort(function (a, b) { return a.k - b.k; }).map(function (o) { return o.el; });
    R.pod = q('.kv-pod3'); R.p3 = q('.kv-p3'); R.floor = q('.kv-floor');
    R.blocks = ['.kv-blk--3', '.kv-blk--2', '.kv-blk--1'].map(function (s) { return q(s + ' .kv-blk__in'); });
    R.glint = q('.kv-glint'); R.flash = q('.kv-flash'); R.sparks = qa('.kv-sparks i');

    /* « Découvrir le projet » : le passage vers la page projet, dans l'or d'Escapades Libres */
    var lien = q('[data-kv-projet]');
    lien.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var url = lien.getAttribute('href'), P2 = W.Passage;
      if (P2 && typeof P2.ouvrir === 'function') {
        try { P2.ouvrir(lien, url, { couleur: OR, icone: ICONE, taille: 112 }); return; } catch (err) { /* repli : navigation directe */ }
      }
      location.href = url;
    });
    return R;
  }

  /* ---------- Le podium suit le pointeur (± 10°), à la souris seulement ---------- */
  function tilt(R, zone) {
    if (!FINQ || !FINQ.matches || (RMQ && RMQ.matches)) return function () {};
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function loop() {
      cx += (tx - cx) * .12; cy += (ty - cy) * .12;
      R.p3.style.setProperty('--ry', (cx * 10).toFixed(2) + 'deg');
      R.p3.style.setProperty('--rx', (-cy * 6).toFixed(2) + 'deg');
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) ? requestAnimationFrame(loop) : 0;
    }
    function move(e) {
      var r = zone.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function out() { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); }
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', out);
    return function () {
      zone.removeEventListener('pointermove', move);
      zone.removeEventListener('pointerleave', out);
      if (raf) cancelAnimationFrame(raf);
      R.p3.style.removeProperty('--ry'); R.p3.style.removeProperty('--rx');
    };
  }

  /* ---------- Le temps 2, commun aux deux modes : écouter, concevoir, développer ----------
     t0 : début ; s : échelle du temps (1 = unités du défilement, ou secondes à l'entrée). */
  function seqRole(tl, R, t0, s, h24) {
    var OUT = 'power2.out', IO = 'power3.inOut', AWAY = 'power2.in';
    var mot = function (els, at) {
      tl.fromTo(els, { opacity: 0, y: 18, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .4 * s, stagger: .05 * s, ease: OUT }, at);
    };
    var hors = function (els, at) { tl.to(els, { opacity: 0, y: -12, duration: .18 * s, ease: AWAY }, at); };
    var T = function (u) { return t0 + u * s; };
    /* J'écoute la cliente */
    tl.fromTo(R.bubble, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .45 * s, ease: 'power3.out' }, T(0))
      .fromTo(R.earP, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .4 * s, stagger: .08 * s, ease: IO }, T(.25))
      .fromTo(R.ear, { opacity: 0 }, { opacity: 1, duration: .1 * s }, T(.25));
    mot(R.steps[0], T(.2));
    /* Je conçois : la bulle devient la table de travail ; le curseur sélectionne l'accueil */
    hors(R.steps[0], T(1.35));
    mot(R.steps[1], T(1.45));
    tl.to(R.bubble, { opacity: 0, scale: 1.12, duration: .25 * s, ease: AWAY }, T(1.35))
      .fromTo(R.desk, { opacity: 0, clipPath: 'inset(26% 10% 26% 10% round 28px)' },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: .45 * s, ease: IO }, T(1.38))
      .fromTo(R.abs, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .32 * s, stagger: .08 * s, ease: OUT }, T(1.58))
      .fromTo(R.panel, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: .3 * s, ease: OUT }, T(1.7))
      .fromTo(R.cur, { opacity: 0, xPercent: 62, yPercent: 86 }, { opacity: 1, duration: .1 * s }, T(1.88))
      .to(R.cur, { xPercent: 16, yPercent: 52, duration: .42 * s, ease: 'power2.inOut' }, T(1.92))
      .fromTo(R.curI, { scale: 1 }, { scale: .8, duration: .07 * s, yoyo: true, repeat: 1, ease: 'power1.inOut' }, T(2.34))
      .fromTo(R.sel, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: .18 * s, ease: OUT }, T(2.38))
      .fromTo(R.guide, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: .28 * s, ease: OUT }, T(2.5))
      .fromTo(R.swOr, { '--kv-on': 0 }, { '--kv-on': 1, duration: .2 * s }, T(2.62))
      .to(R.cur, { opacity: 0, duration: .12 * s }, T(2.95));
    /* Je développe : la maquette choisie s'ouvre et devient la vraie plateforme ; un « 24 h » file */
    hors(R.steps[1], T(3.05));
    mot(R.steps[2], T(3.15));
    var n24 = { h: 0 };
    tl.fromTo(R.bar, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: .25 * s, ease: OUT }, T(3.05))
      .fromTo(R.grow, { opacity: 0, clipPath: 'inset(20% 74.36% 12% 6% round 6px)' },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: .5 * s, ease: IO, immediateRender: true }, T(3.08))
      .fromTo(R.growM, { opacity: 1 }, { opacity: 0, duration: .25 * s }, T(3.3))
      .fromTo(R.shot, { opacity: 0 }, { opacity: 1, duration: .3 * s, ease: OUT }, T(3.26))
      .to([R.sel, R.guide, R.panel], { opacity: 0, duration: .15 * s }, T(3.06))
      .to(R.desk, { opacity: 0, duration: .2 * s }, T(3.45))
      .fromTo(R.ssh, { opacity: 0 }, { opacity: 1, duration: .3 * s }, T(3.1))
      .fromTo(R.k24, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .25 * s, ease: OUT }, T(3.1))
      .fromTo(n24, { h: 0 }, { h: 24, duration: .9 * s, ease: 'power1.inOut', onUpdate: function () { h24(Math.round(n24.h)); } }, T(3.15))
      .fromTo(R.r24, { scaleX: 0 }, { scaleX: 1, duration: .9 * s, ease: 'power1.inOut' }, T(3.15));
    /* La synthèse */
    hors(R.steps[2], T(4.25));
    mot(R.steps[3], T(4.35));
    return T(5);
  }

  /* ---------- Le temps 1, commun : le mur de post-it, les équipes, le projecteur ----------
     g() donne la géométrie mesurée : { ww, wh, a (angle du faisceau vers le nôtre), l (sa longueur) } */
  function seqMur(tl, R, t0, s, g) {
    var OUT = 'power2.out', AWAY = 'power2.in';
    var T = function (u) { return t0 + u * s; };
    var mot = function (els, at) { tl.fromTo(els, { opacity: 0, y: 18, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .38 * s, stagger: .045 * s, ease: OUT }, at); };
    var hors = function (els, at) { tl.to(els, { opacity: 0, y: -12, duration: .16 * s, ease: AWAY }, at); };
    var ordre = R.pis.slice().sort(function (a, b) { return MUR.pi[R.pis.indexOf(a)].d - MUR.pi[R.pis.indexOf(b)].d; });
    /* Vendredi soir : des dizaines d'idées */
    mot(R.l1[0], T(0));
    tl.fromTo(ordre, { opacity: 0, scale: .6, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: .3 * s, stagger: .022 * s, ease: 'power3.out' }, T(.04));
    /* Des équipes se forment */
    hors(R.l1[0], T(.86)); mot(R.l1[1], T(.92));
    tl.fromTo(R.avs, {
      opacity: 0, scale: .5,
      x: function (n) { return (MUR.av[n].x0 - MUR.av[n].x) / 100 * g().ww; },
      y: function (n) { return (MUR.av[n].y0 - MUR.av[n].y) / 100 * g().wh; }
    }, { opacity: 1, scale: 1, x: 0, y: 0, duration: .42 * s, stagger: .012 * s, ease: 'power3.inOut' }, T(.9));
    /* Dimanche, le jury en choisit une : le projecteur balaie le mur et s'arrête sur le nôtre */
    hors(R.l1[1], T(1.62)); mot(R.l1[2], T(1.68));
    tl.set(R.beam, { rotation: function () { return g().a - 40; } }, T(1.6))
      .fromTo(R.beam, { opacity: 0 }, { opacity: 1, duration: .14 * s }, T(1.6))
      .to(R.beam, { keyframes: [
        { rotation: function () { return g().a + 26; }, duration: .36 * s, ease: 'power1.inOut' },
        { rotation: function () { return g().a; }, duration: .26 * s, ease: 'power2.out' }] }, T(1.62))
      .to(R.others, { opacity: .26, duration: .3 * s, stagger: { each: .006 * s, from: 'random' } }, T(1.86))
      .to(R.avsAutres, { opacity: .28, duration: .3 * s }, T(1.9))
      .fromTo(R.ours, { '--kv-on': 0 }, { '--kv-on': 1, duration: .24 * s }, T(2.14))
      .fromTo(R.ours, { scale: 1 }, { scale: 1.7, duration: .3 * s, ease: 'power3.out' }, T(2.14))
      .to(R.avsEl, { y: function () { return g().wh * .085; }, duration: .3 * s, ease: 'power3.out' }, T(2.14));
    return T(2.45);
  }
  /* Le « 1re » or se lève, puis « Escapades Libres » et sa mention */
  function seqUne(tl, R, at, s) {
    tl.fromTo(R.uneG, { opacity: 0, y: 60, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .45 * s, ease: 'power3.out' }, at)
      .fromTo([R.uneNom, R.uneL], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3 * s, stagger: .1 * s, ease: 'power2.out' }, at + .26 * s);
  }

  /* ---------- Le temps 3, commun : le couloir, puis l'éclat et la photo dans l'arche ----------
     Renvoie l'instant du zéro. clockTo(s) règle le compteur ; la suite (podium…) est propre à chaque mode. */
  function seqCouloir(tl, R, t0, d, geoK) {
    var cam = { p: 0 };
    tl.fromTo(R.doorsBox, { opacity: 0 }, { opacity: 1, duration: .2 * d }, t0)
      .fromTo(R.arch, { opacity: 0 }, { opacity: 1, duration: .2 * d }, t0)
      .fromTo(cam, { p: 0 }, { p: 1, duration: d, ease: 'power2.inOut', onUpdate: function () { couloir(R, cam.p); } }, t0)
      .fromTo(R.lum, { opacity: .25 }, { opacity: 1, duration: d * .9, ease: 'power2.in' }, t0);
    var tZ = t0 + d;
    tl.fromTo(R.flash, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .12, ease: 'power2.out' }, tZ)
      .to(R.flash, { opacity: 0, scale: 1.5, duration: .5, ease: 'power1.out' }, tZ + .12)
      .fromTo(R.archIn, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(150% at 50% 55%)', duration: .45, ease: 'power2.out' }, tZ + .03)
      .to(R.lum, { opacity: 0, duration: .3 }, tZ + .2)
      .fromTo(R.halo, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' }, tZ + .05)
      .to(R.doorsBox, { opacity: 0, duration: .1 }, tZ + .05);
    R.sparks.forEach(function (sp, n) {
      var a = n / 10 * TAU + Math.sin(n * 2.3) * .25, r = 80 + (n * 37 % 70);
      tl.fromTo(sp, { x: 0, y: 0, scale: 1 },
        { x: function () { return Math.cos(a) * r * geoK(); }, y: function () { return Math.sin(a) * r * .8 * geoK(); }, scale: .3, duration: .7, ease: 'power3.out' }, tZ + .02)
        .fromTo(sp, { opacity: 0 }, { opacity: 1, duration: .08 }, tZ + .02)
        .to(sp, { opacity: 0, duration: .35 }, tZ + .3);
    });
    return tZ;
  }
  /* Le podium s'assemble (le 1 en dernier, un éclat doré sur le dessus), le chèque se pose */
  function seqPodium(tl, R, tZ, s) {
    tl.fromTo(R.pod, { autoAlpha: 0 }, { autoAlpha: 1, duration: .12 * s }, tZ + .36 * s)
      .fromTo(R.floor, { opacity: 0 }, { opacity: 1, duration: .3 * s }, tZ + .35 * s)
      .fromTo(R.blocks, { scaleY: .001 }, { scaleY: 1, duration: .42 * s, stagger: .16 * s, ease: 'power3.out' }, tZ + .42 * s)
      .fromTo(R.glint, { xPercent: -120 }, { xPercent: 120, duration: .4 * s, ease: 'power1.inOut' }, tZ + 1.0 * s);
  }
  /* Les deux petits tirages se posent sur le bord du cadre, après la couronne */
  function seqTirages(tl, R, at, s) {
    tl.fromTo(R.printE, { opacity: 0, y: 70, rotation: 14, scale: .965 }, { opacity: 1, y: 0, rotation: 5, scale: 1, duration: .45 * s, ease: 'power3.out' }, at)
      .fromTo(R.printC, { opacity: 0, y: 80, rotation: -12, scale: .965 }, { opacity: 1, y: 0, rotation: -4, scale: 1, duration: .45 * s, ease: 'power3.out' }, at + .14 * s);
  }
  /* Le moment triomphant, en constellation : le rayon derrière les bras levés (une fois), les étoiles une à une,
     les fils qui les relient en couronne, deux ou trois étoiles filantes ; ensuite le scintillement (CSS) */
  function seqTriomphe(tl, R, tZ, s) {
    tl.fromTo(R.ray, { opacity: 0, scaleY: .55 }, { opacity: .9, scaleY: 1, duration: .38 * s, ease: 'power2.out' }, tZ + .12 * s)
      .to(R.ray, { opacity: .32, duration: .7 * s, ease: 'power1.inOut' }, tZ + .55 * s)
      .fromTo(R.credit, { opacity: 0 }, { opacity: 1, duration: .3 * s }, tZ + .6 * s)
      .fromTo(R.stars, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .24 * s, stagger: .032 * s, ease: 'power3.out' }, tZ + .22 * s)
      .fromTo(R.fils, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .26 * s, stagger: .024 * s, ease: 'power1.inOut' }, tZ + .52 * s);
    R.shoots.forEach(function (sh, n) {
      var at = tZ + (.7 + n * .16) * s;
      tl.set(sh, { opacity: 0, x: 0, y: 0 }, at - .001)
        .to(sh, { keyframes: [
          { opacity: 1, x: 40, y: -30, duration: .12 * s, ease: 'none' },
          { opacity: 0, x: 190, y: -150, duration: .42 * s, ease: 'power2.out' }] }, at);
    });
  }

  /* =========================================================
     Mode « à la suite » : chaque temps se joue à son entrée
     ========================================================= */
  function flow(R, G) {
    var sec = R.sec, rm = !!(RMQ && RMQ.matches), anim = !!(G && !rm), timers = [], alive = true, io = null, tl2 = null, tl3 = null;
    sec.classList.add('is-flow');
    sec.classList.toggle('is-rm', rm);
    var M = R.dg.m;                                /* minis : t1, t2, t3 */
    setClock(M[0], H54); setClock(M[1], H30); setClock(M[2], H14);
    function later(ms, fn) { timers.push(setTimeout(function () { if (alive) fn(); }, ms)); }
    function count(groups, from, to, ms, ease, done) {
      var t0 = 0;
      (function f(now) {
        if (!alive) return;
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / ms);
        setClock(groups, from + (to - from) * ease(p));
        if (p < 1) requestAnimationFrame(f); else if (done) done();
      })(performance.now());
    }
    var o3 = function (p) { return 1 - Math.pow(1 - p, 3); };
    var i2 = function (p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
    function zero() { setClock(M[2], 0); R.t3.classList.add('is-zero'); couloirFin(R); }
    var gm = { ww: 0, wh: 0, a: 0, l: 0 };
    function mesureMur() { faisceau(R, gm); }
    var tl1 = null;
    if (anim) {
      sec.classList.add('is-seq');
      mesureMur();
      tl1 = G.timeline({ paused: true });
      seqMur(tl1, R, .2, 1.15, function () { return gm; });
      tl2 = G.timeline({ paused: true });
      seqRole(tl2, R, .25, 1.05, function (h) { R.n24.textContent = h; });
      tl3 = G.timeline({ paused: true });
      var cl = { s: H14 };
      tl3.fromTo(cl, { s: H14 }, { s: 0, duration: 1.7, ease: 'power2.in', onUpdate: function () { setClock(M[2], cl.s); } }, .3);
      var z = seqCouloir(tl3, R, .3, 1.7, function () { return 1.6; });
      seqTriomphe(tl3, R, z, 1.15);
      tl3.to(R.day, { opacity: 0, y: -10, duration: .2 }, z);
      seqUne(tl3, R, z + .5, 1.1);
      tl3.call(function () { R.t3.classList.add('is-zero'); }, null, z + 1.7);
      couloir(R, 0);
    } else {
      couloirFin(R);
    }
    var untilt = tilt(R, R.t3), rt = 0;
    function recadre() { clearTimeout(rt); rt = setTimeout(function () { if (alive) { cadrer(R); if (anim) mesureMur(); } }, 120); }
    cadrer(R);
    W.addEventListener('resize', recadre);
    function play(t) {
      if (t.classList.contains('is-in')) return;
      t.classList.add('is-in');
      if (t === R.t1) {
        if (rm || !tl1) setClock(M[0], H30);
        else { later(300, function () { count(M[0], H54, H30, 2600, o3); }); mesureMur(); tl1.invalidate().play(); }
      }
      if (t === R.t2) { if (rm) setClock(M[1], H14); else later(300, function () { count(M[1], H30, H14, 4200, o3); }); if (tl2) tl2.play(); }
      if (t === R.t3) { if (tl3) tl3.play(); else zero(); }
    }
    if ('IntersectionObserver' in W) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
      }, { threshold: .4 });
      R.ts.forEach(function (t) { io.observe(t); });
    } else {
      R.ts.forEach(play);
    }
    void i2;
    return function () {
      alive = false;
      timers.forEach(clearTimeout); clearTimeout(rt);
      W.removeEventListener('resize', recadre);
      if (io) io.disconnect();
      untilt();
      couloirFin(R);
      sec.classList.remove('is-flow', 'is-rm', 'is-seq');
      R.ts.forEach(function (t) { t.classList.remove('is-in', 'is-zero', 'is-lit'); });
    };
  }

  /* =========================================================
     Mode épinglé : la section reste à l'écran, le défilement joue le week-end
     ========================================================= */
  /* « Vu une fois » : le drapeau de session */
  var VU = 'kz-54h-vu';
  function dejaVu() { try { return W.sessionStorage.getItem(VU) === '1'; } catch (e) { return false; } }
  function noterVu() { try { W.sessionStorage.setItem(VU, '1'); } catch (e) { /* stockage indisponible : on garde l'état en mémoire */ } }

  function pin(R, G, ST) {
    var sec = R.sec, st = R.stage, geo = { k: 2 };
    sec.classList.add('is-pin');
    /* Une ancre sous la section (pro.html#equipe, #contact) : on arrive sous la section, donc à l'état final */
    var cible = null;
    try { cible = location.hash.length > 1 ? D.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch (e) { cible = null; }
    var apres = !!(cible && cible !== sec && !sec.contains(cible) && (sec.compareDocumentPosition(cible) & 4));
    var vu = dejaVu() || apres;

    var gm = { ww: 0, wh: 0, a: 0, l: 0 };
    function measure() { geo.k = Math.max(1.6, Math.min(2.6, st.clientWidth / 620)); cadrer(R); faisceau(R, gm); }
    measure();
    ST.addEventListener('refreshInit', measure);

    var clk = { s: H54 }, tLive = 1e9, trig = null;
    var tl = G.timeline({
      defaults: { ease: 'none' }, paused: true,
      onUpdate: function () { setClock(R.dg.clock, clk.s); sec.classList.toggle('is-live', tl.time() > tLive); }
    });
    var OUT = 'power2.out', AWAY = 'power2.in';
    var blurIn = function (els, at, stg, d) {
      tl.fromTo(els, { opacity: 0, y: 20, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: d || .4, stagger: stg || .05, ease: OUT }, at);
    };

    /* 0. Pendant que la section arrive : le titre, le drapeau, la date, la foule des équipes
       (autre timeline, autres éléments que ceux de la scène) ; rien de tout ça une fois la séquence vue */
    var prep = vu ? null : G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 8%', scrub: .8 } });
    if (prep) prep
      .fromTo(R.h1w, { opacity: 0, y: 26, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .5, stagger: .12, ease: OUT }, 0)
      .fromTo(R.date, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4, ease: OUT }, .35)
      .fromTo(R.dg.clock[0], { yPercent: 110 }, { yPercent: 0, duration: .45, stagger: .04, ease: 'power3.out' }, .3)
      .fromTo(R.seps, { opacity: 0 }, { opacity: .5, duration: .3 }, .45);

    /* 1. Le mur de post-it : des dizaines d'idées, des équipes, le projecteur s'arrête sur le nôtre */
    var e1 = seqMur(tl, R, 0, 1, function () { return gm; });
    tl.fromTo(clk, { s: H54 }, { s: H30, duration: e1 + .1 }, 0);

    /* 2. Mon rôle (le post-it or s'efface, la bulle naît à sa place) */
    var t2 = e1 + .1;
    tl.to(R.cols[0], { opacity: 0, y: -14, duration: .2, ease: AWAY }, t2)
      .to([R.others, R.avs, R.beam], { opacity: 0, duration: .22 }, t2)
      .to(R.ours, { scale: 2.2, opacity: 0, duration: .2, ease: AWAY }, t2)
      .to(R.wall, { opacity: 0, duration: .01 }, t2 + .4);
    var e2 = seqRole(tl, R, t2 + .12, .9, function (h) { R.n24.textContent = h; });
    tl.to(clk, { s: H14, duration: e2 - t2 }, t2);

    /* 3. Dimanche : on traverse le couloir d'arches pendant que le compteur file vers 00:00:00 */
    var t3 = e2 - .2;
    tl.to([R.cols[1], R.k24], { opacity: 0, y: -14, duration: .2, ease: AWAY }, t3)
      .to(R.scene, { opacity: 0, scale: .96, duration: .25, ease: AWAY }, t3);
    blurIn(R.day, t3 + .12, .05);
    var dC = 1.45;
    tl.to(clk, { s: 0, duration: dC, ease: 'power2.in' }, t3 + .05);
    var tZ = seqCouloir(tl, R, t3 + .05, dC, function () { return geo.k; });
    /* 00:00:00 : la photo des bras levés prend la scène, la couronne, le « 1re » or, le grand podium, puis le texte */
    tl.to(R.day, { opacity: 0, y: -12, duration: .16, ease: AWAY }, tZ);
    seqTriomphe(tl, R, tZ, 1);
    tl.to(R.clock, { opacity: 0, duration: .25 }, tZ + .6);
    seqUne(tl, R, tZ + .72, 1);
    seqPodium(tl, R, tZ + .95, 1);
    seqTirages(tl, R, tZ + 1.75, 1);
    blurIn(R.l3, tZ + 2.05, .06);
    tl.fromTo(R.acts, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .3, ease: OUT }, tZ + 2.3);
    tLive = tZ + 2.35;
    tl.to({}, { duration: .45 }, tZ + 2.65);

    /* L'état final, figé : la timeline au bout, le compteur à zéro, les boutons actifs */
    var garde = false;
    function figer() {
      /* la timeline reste au bout, callbacks compris (le couloir remet l'arche à sa taille) */
      tl.eventCallback('onUpdate', function () {
        if (garde || tl.progress() >= 1) return;
        garde = true; tl.progress(1); garde = false;
      });
      tl.progress(1);
      couloir(R, 1);
      clk.s = 0; setClock(R.dg.clock, 0);
      sec.classList.add('is-vu', 'is-live');
    }
    /* Retire l'épinglage et compense la position : rien ne bouge à l'écran */
    function detacher() {
      if (!trig) return;
      var y = W.pageYOffset, d = trig.end - trig.start, dy = Math.max(0, Math.min(d, y - trig.start));
      /* revert du seul épinglage (l'espaceur part), l'animation est gardée puis remise au bout aussitôt */
      trig.kill(true, true);
      trig = null;
      if (prep && prep.scrollTrigger) prep.scrollTrigger.kill(false, true);
      tl.progress(1);
      couloir(R, 1);
      W.scrollTo(0, y - dy);
      ST.refresh();
    }
    /* Au repos du défilement (Lenis ne doit pas être en train d'animer), puis on détache */
    var repos = 0, ecoute = false;
    function auRepos() {
      clearTimeout(repos);
      repos = setTimeout(function essai() {
        if (D.documentElement.classList.contains('lenis-scrolling')) { repos = setTimeout(essai, 160); return; }
        W.removeEventListener('scroll', auRepos);
        ecoute = false;
        detacher();
      }, 260);
    }
    function atteint() {
      if (vu) return;
      vu = true;
      noterVu();
      figer();
      if (!ecoute) { ecoute = true; W.addEventListener('scroll', auRepos, { passive: true }); }
      auRepos();
    }

    if (vu) {
      /* Déjà vue (ou arrivée sous la section) : un bloc statique d'un écran, à l'état final */
      figer();
    } else {
      /* L'épinglage : 3 écrans de défilement, la victoire arrive vers 2,3 */
      trig = ST.create({
        animation: tl, trigger: sec, start: 'top top',
        end: function () { return '+=' + Math.round(st.clientHeight * PIN_ECRANS); },
        pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: function () { setClock(R.dg.clock, clk.s); },
        onUpdate: function (self) { if (self.progress >= .98) atteint(); },
        onLeave: atteint
      });
    }

    /* Une ancre sur la section (pro.html#victoire) : le navigateur l'a résolue avant que l'épinglage
       n'ajoute sa longueur ; on la rejoint une fois, au premier recalcul. */
    var ancre = null;
    if (!vu && cible === sec) {
      var t0a = Date.now();
      ancre = function () {
        ST.removeEventListener('refresh', ancre);
        if (Date.now() - t0a > 5000) return;
        requestAnimationFrame(function () { W.scrollTo(0, cible.getBoundingClientRect().top + W.pageYOffset); });
      };
      ST.addEventListener('refresh', ancre);
    }
    /* Rechargement en bas de page, retour arrière : si l'on se retrouve sous la section, l'état final */
    function sousLaSection() { if (trig && W.pageYOffset >= trig.end - 2) atteint(); }
    function auChargement() { setTimeout(sousLaSection, 60); }
    if (D.readyState === 'complete') auChargement(); else W.addEventListener('load', auChargement);
    function auRetour(e) { if (e.persisted) sousLaSection(); }
    W.addEventListener('pageshow', auRetour);

    /* Au clavier : un bouton reçoit le focus avant la fin du récit -> on va à la fin */
    function focusFin() {
      if (trig && !sec.classList.contains('is-live')) W.scrollTo(0, trig.end - 2);
    }
    R.acts.addEventListener('focusin', focusFin);
    var untilt = tilt(R, st);

    setClock(R.dg.clock, clk.s);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { if (sec.classList.contains('is-pin')) ST.refresh(); });

    return function () {
      ST.removeEventListener('refreshInit', measure);
      if (ancre) ST.removeEventListener('refresh', ancre);
      R.acts.removeEventListener('focusin', focusFin);
      W.removeEventListener('scroll', auRepos);
      W.removeEventListener('load', auChargement);
      W.removeEventListener('pageshow', auRetour);
      clearTimeout(repos);
      untilt();
      couloirFin(R);
      sec.classList.remove('is-pin', 'is-live', 'is-vu');
      clk.s = H54; setClock(R.dg.clock, clk.s);
      R.n24.textContent = '24';
    };
  }

  /* ---------- Démarrage ---------- */
  function init(sec) {
    if (!sec) return null;
    if (sec.__kv) return sec.__kv;
    var R = build(sec);
    sec.__kv = R;
    var G = W.gsap, ST = W.ScrollTrigger;
    if (G && ST && typeof G.matchMedia === 'function') {
      G.registerPlugin(ST);
      R.mm = G.matchMedia();
      R.mm.add({ pin: PIN_Q, all: '(min-width: 0px)' }, function (ctx) {
        return ctx.conditions.pin ? pin(R, G, ST) : flow(R, G);
      });
    } else {
      R.stop = flow(R, null);
    }
    sec.dispatchEvent(new CustomEvent('victoire:pret', { bubbles: true }));
    return R;
  }
  function boot() { Array.prototype.forEach.call(D.querySelectorAll('[data-kz-victoire]'), init); }

  W.KzVictoire = {
    init: init,
    refresh: function () { if (W.ScrollTrigger) W.ScrollTrigger.refresh(); }
  };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
