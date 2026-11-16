/* ==========================================================================
   La profondeur des heros (V6) : des objets qui flottent sur trois plans autour du portrait de Kenz,
   pour faire comprendre chaque univers sans texte. Styles : shared/profondeur.css.

   BRANCHEMENT
     <link rel="stylesheet" href="shared/profondeur.css">                 dans le <head>
     <div class="kz-prof" data-kz-prof="pro|createur" aria-hidden="true"></div>
                                                                           PREMIER enfant de .hero__stage
     <script src="shared/profondeur.js" defer></script>                   en fin de <body>, APRÈS shared/courses.js
                                                                           s'il est là (GSAP chargé une seule fois)
   GSAP + ScrollTrigger : pris sur la page s'ils y sont, attendus si un autre module les charge, sinon chargés ici.

   LES TROIS PLANS (plan)
     'loin'    derrière le portrait (sous le halo et l'arche) : petit (≈ 48 à 72 px visibles), flou, opacité réduite ;
     'milieu'  autour de l'arche, devant le portrait : net (≈ 90 à 130 px visibles) ;
     'pres'    devant tout : grand (≈ 160 à 240 px visibles), légèrement flou, coupé par le bord de l'écran.
   Mouvement : souris (ordinateur, pivot sur le portrait : le loin suit la souris de 6 px, le milieu la fuit de 7 px,
   le près de 18 px) ; défilement (ScrollTrigger + scrub : le loin traîne, le près file) puis effacement ;
   flottaison lente, désynchronisée (3 à 8 px, 1 à 3°). Mouvement réduit : objets fixes.

   UN OBJET (les listes par hero : SERIES, plus bas)
     { id:     'nom',                        (repère)
       src:    'assets/…/512/objet.webp'     (relatif à la page) ; ou une liste de candidats, essayés dans l'ordre :
               ['…/objet.webp', '…/objet.png'] (le premier qui se charge est gardé)
       srcset: '… 256w, … 1024w',            (facultatif : plusieurs tailles ; sinon la taille affichée est
                                              plafonnée à la largeur réelle de l'image)
       type:   'objet' | 'polaroid',         (objet 3D détouré, ou miniature dans un cadre de polaroïd)
       plan:   'loin' | 'milieu' | 'pres',
       x, y:   centre de l'objet, en % du conteneur (.kz-prof couvre .hero__stage : le portrait y est centré),
       taille: largeur en px. Un objet 3D occupe ≈ 70 % de son image carrée : taille 160 ≈ 110 px visibles.
       rot:    inclinaison au repos, en degrés,
       mobile: { x, y, taille, rot, plan }   (≤ 860 px ; sans « mobile », l'objet n'est pas montré sur mobile) }

   LES RÈGLES
     - Un fichier absent (pas encore livré) : l'image ne se charge pas, l'objet est retiré, sans erreur.
       Rien n'est demandé pour un objet qui n'a pas de place dans le mode en cours (ex. sur mobile).
     - Ordre de la liste = priorité : on garde les premiers objets chargés qui ne gênent rien,
       6 au plus sur ordinateur, 3 au plus sur mobile. Les suivants sont des remplaçants.
     - Jamais sur le visage de Kenz (options.visage, en fractions de .hero__fig), ni sur le titre, la phrase
       ou le bouton (options.interdits) : l'emprise de l'objet, sa marge de mouvement (souris, flottaison) et
       son trajet au défilement sont vérifiés à chaque mise en page ; un objet qui gênerait n'est pas montré.
     - Entrée : après celle du hero (classe options.pret sur <html>), du fond vers l'avant.

   API : window.KzProfondeur
     .series                         les listes par hero : { pro: { options, objets }, createur: { … } }
     .poser(el, objets, options)     remplit un conteneur -> { rafraichir(), detruire(), objets(), pourquoi() }
                                     (pourquoi() : pour chaque objet, montré, absent, gênerait : visage…, etc. ;
                                      le conteneur la porte aussi : document.querySelector('.kz-prof').__kzProf)
     options : { max: 6, maxMobile: 3, fig: '.hero__fig', visage: [x0, y0, x1, y1],
                 interdits: '.hero__title, .hero__line, .hero__down', marge: 10,
                 pret: ['hero-in', 'is-loaded'], delai: 1.05 (s après l'entrée du hero),
                 effacement: [debut, fin] (part du défilement du hero), attente: 3200 (ms, images lentes) }
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, H = D.documentElement;
  if (W.KzProfondeur) return;

  var GSAP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  var ST_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
  var Q_ORDI = '(min-width: 861px)';
  var Q_SOURIS = '(min-width: 861px) and (hover: hover) and (pointer: fine)';
  var Q_REDUIT = '(prefers-reduced-motion: reduce)';

  /* Les plans. vitesse : déplacement au défilement, en part de la hauteur du hero (+ : traîne, − : file) ;
     souris : amplitude en px (le portrait est le pivot) ; flotte : px, rot : degrés, duree : s. */
  var PLANS = {
    loin:   { vitesse: .16,  souris: 6,   flotte: 3, rot: 1.2, duree: 11,  rang: 0 },
    milieu: { vitesse: -.05, souris: -7,  flotte: 6, rot: 2,   duree: 8.5, rang: 1 },
    pres:   { vitesse: -.3,  souris: -18, flotte: 8, rot: 2.6, duree: 10,  rang: 2 }
  };
  var EMPRISE = { objet: .7, polaroid: 1 };     /* la part visible de l'image (un objet 3D : ≈ 70 % du carré) */
  var RATIO_POLA = .056 + .888 * 9 / 16 + .19;  /* hauteur / largeur du polaroïd (cadre 5,6 % + photo 16:9 + bas 19 %) */

  var DEFAUTS = {
    max: 6, maxMobile: 3,
    fig: '.hero__fig',
    visage: [.27, .06, .73, .46],
    interdits: '.hero__title, .hero__line, .hero__down',
    marge: 10,
    pret: ['hero-in', 'is-loaded'],
    delai: 1.05,
    effacement: [.12, .6],
    attente: 3200
  };

  /* ------------------------------------------------------------------------
     Les listes. Positions en % de .hero__stage (ordinateur : la moitié droite de l'écran, sous la nav ;
     mobile : le bas de l'écran, sous le texte). Le visage occupe à peu près x 35-65 %, y 9-57 % de la scène.
     ------------------------------------------------------------------------ */
  /* Les objets 3D : la copie de 512 px en WebP (livrée avec le PNG, 6 fois plus légère). Un seul candidat par objet :
     tant qu'il manque, une seule requête échoue (le navigateur la note dans sa console réseau, sans erreur JS). */
  var H3D = 'assets/hero3d/';
  /* Le filtre du néon Lagon (livré avec les objets : assets/hero3d/neon-filter.svg), inséré une seule fois */
  function neonFiltre() {
    if (document.getElementById('hero3d-lagon-neon')) return;
    var w = document.createElement('div');
    w.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;pointer-events:none;overflow:hidden"><defs>' +
      '<filter id="hero3d-lagon-neon" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
      '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.88  0 0 0 0 0.96  -5 2.5 2.5 0 -0.8" result="blue-selection"/>' +
      '<feComposite in="blue-selection" in2="SourceAlpha" operator="in" result="blue-parts"/>' +
      '<feGaussianBlur in="blue-parts" stdDeviation="5" result="wide-glow"/><feGaussianBlur in="blue-parts" stdDeviation="1.5" result="close-glow"/>' +
      '<feMerge><feMergeNode in="wide-glow"/><feMergeNode in="close-glow"/><feMergeNode in="blue-parts"/></feMerge></filter></defs></svg>';
    document.body.appendChild(w.firstChild);
  }
  var SERIES = {
    /* Créateur : le voyage (polaroïds de vraies miniatures, puis passeport, avion, appareil, étiquette) et le sport
       (la chaussure k15ze). Aujourd'hui : 3 polaroïds (loin, milieu, près) + la chaussure. Livrés, les objets 3D
       prennent la place du polaroïd lointain ; l'étiquette est un remplaçant. */
    createur: {
      options: { effacement: [.02, .24] },
      objets: [
        { id: 'polaroid-japon', type: 'polaroid', src: 'assets/img/video-japon.jpg', plan: 'pres', x: 97, y: 62, taille: 230, rot: 8,
          mobile: { x: 97, y: 76, taille: 140 } },
        { id: 'kettlebells', src: 'assets/sport3d/256/hyrox-06-farmers-carry.webp', srcset: 'assets/sport3d/256/hyrox-06-farmers-carry.webp 256w, assets/sport3d/hyrox-06-farmers-carry.webp 1024w',
          plan: 'milieu', x: 86, y: 38, taille: 150, rot: -8,
          mobile: { x: 10, y: 22, taille: 104 } },
        { id: 'polaroid-chine', type: 'polaroid', src: 'assets/img/video-chine.jpg', plan: 'milieu', x: 15, y: 22, taille: 124, rot: -7 },
        { id: 'passeport', src: H3D + 'createur/512/createur-passeport.webp', plan: 'milieu', x: 20, y: 60, taille: 170, rot: -12 },
        { id: 'avion', src: H3D + 'createur/512/createur-avion.webp', plan: 'loin', x: 6, y: 7, taille: 96, rot: -8 },
        { id: 'appareil', src: H3D + 'createur/512/createur-appareil.webp', plan: 'milieu', x: 95, y: 9, taille: 140, rot: 10 },
        { id: 'polaroid-malaisie', type: 'polaroid', src: 'assets/img/video-malaisie.jpg', plan: 'loin', x: 78, y: 6, taille: 70, rot: 6,
          mobile: { x: 88, y: 5, taille: 58 } },
        { id: 'etiquette', src: H3D + 'createur/512/createur-etiquette.webp', plan: 'loin', x: 4, y: 42, taille: 92, rot: 14 }
      ]
    },
    /* Pro : « je construis des apps où l'IA fait le vrai travail », dans l'heure bleue. Pas d'icônes d'apps
       (elles sont dans la constellation, juste en dessous). Tant que rien n'est livré, rien ne s'affiche. */
    pro: {
      options: { effacement: [.12, .6] },
      objets: [
        { id: 'telephone', neon: .35, src: H3D + 'pro/512/pro-telephone.webp', plan: 'pres', x: 97, y: 64, taille: 300, rot: -16,
          mobile: { x: 100, y: 80, taille: 180 } },
        { id: 'noyau-ia', neon: .4, src: H3D + 'pro/512/pro-noyau-ia.webp', plan: 'milieu', x: 16, y: 30, taille: 160, rot: 0,
          mobile: { x: 10, y: 22, taille: 104 } },
        { id: 'trophee', neon: .3, src: H3D + 'pro/512/pro-trophee.webp', plan: 'milieu', x: 86, y: 28, taille: 170, rot: 8 },
        { id: 'satellite', neon: .35, src: H3D + 'pro/512/pro-satellite.webp', plan: 'loin', x: 8, y: 8, taille: 100, rot: -14,
          mobile: { x: 88, y: 5, taille: 76 } }
      ]
    }
  };

  /* ------------------------------------------------------------------------ Outils */
  var mq = function (q) { return W.matchMedia ? W.matchMedia(q) : { matches: false, addEventListener: function () {} }; };
  var onMQ = function (m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); };
  var arr = function (l) { return Array.prototype.slice.call(l || []); };
  var assign = function (a) { for (var i = 1; i < arguments.length; i++) { var b = arguments[i]; if (b) for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; } return a; };
  var MQ_ORDI = mq(Q_ORDI), MQ_SOURIS = mq(Q_SOURIS), MQ_REDUIT = mq(Q_REDUIT);

  /* GSAP + ScrollTrigger : ceux de la page, ou ceux qu'un autre module est en train de charger, sinon on les charge */
  function charger(src, ok) {
    var s = D.createElement('script'); s.src = src; s.async = true;
    s.onload = ok; s.onerror = function () {};
    D.head.appendChild(s);
  }
  function present(motif) { return !!D.querySelector('script[src*="' + motif + '"]'); }
  function avecGsap(fn) {
    var essais = 0;
    (function attendre() {
      if (W.gsap && W.ScrollTrigger) { fn(W.gsap, W.ScrollTrigger); return; }
      if (!W.gsap && !present('/gsap.min.js')) { charger(GSAP_URL, attendre); return; }
      if (W.gsap && !W.ScrollTrigger && !present('/ScrollTrigger.min.js')) { charger(ST_URL, attendre); return; }
      if (++essais < 120) setTimeout(attendre, 100);   /* 12 s au plus, puis on renonce sans bruit */
    })();
  }

  /* La place d'un élément au repos : sa boîte à l'écran, moins les glissements verticaux (transform) posés sur lui
     et ses parents (entrée du hero, défilement). Les décalages horizontaux restent comptés : ce sont des centrages
     fixes (translate: -50% du portrait, que GSAP replie dans transform quand il l'anime). */
  function repos(el) {
    var b = el.getBoundingClientRect(), dy = 0;
    for (var n = el; n && n !== H && n.nodeType === 1; n = n.parentElement) {
      var t = getComputedStyle(n).transform;
      if (t && t !== 'none' && W.DOMMatrixReadOnly) {
        try { dy += new DOMMatrixReadOnly(t).m42; } catch (e) {}
      }
    }
    return { l: b.left, t: b.top - dy, w: b.width, h: b.height };
  }

  /* ------------------------------------------------------------------------ Un hero */
  function poser(cont, objets, options) {
    if (!cont) return null;
    if (cont.__kzProf) cont.__kzProf.detruire();
    var opt = assign({}, DEFAUTS, options);
    var hero = cont.closest('.hero') || cont.closest('section') || cont.parentElement;
    var mort = false, revele = false, heroPret = false, delaiFini = false, tDebut = 0, minuteurs = [];
    var G = null, ST = null;
    cont.classList.add('kz-prof');
    cont.setAttribute('aria-hidden', 'true');
    cont.textContent = '';
    var plus = function (fn, ms) { var t = setTimeout(fn, ms); minuteurs.push(t); return t; };

    var liste = (objets || []).map(function (def, i) { return creer(def, i); });

    function creer(def, i) {
      var type = def.type === 'polaroid' ? 'polaroid' : 'objet';
      var o = { def: def, i: i, type: type, etat: 'neuf', ratio: type === 'polaroid' ? RATIO_POLA : 1, nat: 0, plan: null, tl: null, vis: false };
      var el = D.createElement('div');
      el.className = 'kz-prof__o';
      el.setAttribute('data-type', type);
      el.setAttribute('data-id', def.id || 'o' + i);
      var f = D.createElement('span'); f.className = 'kz-prof__f';
      var c = D.createElement('span'); c.className = 'kz-prof__c';
      var img = D.createElement('img');
      img.alt = ''; img.decoding = 'async'; img.draggable = false;
      img.setAttribute('fetchpriority', 'low');   /* après le paysage et le portrait */
      if (type === 'polaroid') {
        c.className += ' kz-prof__pola';
        var ph = D.createElement('span'); ph.className = 'kz-prof__photo';
        ph.appendChild(img); c.appendChild(ph);
      } else {
        img.className = 'kz-prof__img';
        if (def.neon != null) {   /* lueur néon sur les accents Lagon (filtre SVG, assets/hero3d/neon-*), rien de peint dans l'image */
          neonFiltre();
          var nw = D.createElement('span'); nw.className = 'hero3d-neon';
          nw.style.setProperty('--neon-strength', String(def.neon));
          var gl = D.createElement('img'); gl.className = 'hero3d-neon__glow';
          gl.alt = ''; gl.setAttribute('aria-hidden', 'true'); gl.decoding = 'async'; gl.draggable = false;
          nw.appendChild(img); nw.appendChild(gl); c.appendChild(nw); o.glow = gl;
        } else c.appendChild(img);
      }
      f.appendChild(c); el.appendChild(f);
      /* désynchronisés : chaque objet sa durée et sa phase */
      f.style.setProperty('--fdl', (-((i * 3.7) % 9) - .4).toFixed(2) + 's');
      o.el = el; o.f = f; o.img = img;
      img.addEventListener('load', function () {
        if (mort) return;
        var premier = o.etat !== 'ok';   /* une image à srcset peut se recharger (autre taille) : un seul réglage */
        o.etat = 'ok';
        if (o.glow) { var cs = img.currentSrc || img.src; if (o.glow.getAttribute('src') !== cs) o.glow.src = cs; }
        o.nat = img.naturalWidth || 0;
        if (type === 'objet' && img.naturalWidth) o.ratio = img.naturalHeight / img.naturalWidth;
        if (premier) regle();
      });
      img.addEventListener('error', function () {   /* pas encore livré : le candidat suivant, sinon retiré, sans bruit */
        if (mort) return;
        if (o.srcs.length) { img.src = o.srcs.shift(); return; }
        o.etat = 'absent';
        if (el.parentNode) el.parentNode.removeChild(el);
        regle();
      });
      return o;
    }

    /* Les réglages de l'objet dans le mode en cours (null : pas de place pour lui) */
    function reglages(o) {
      if (MQ_ORDI.matches) return o.def;
      return o.def.mobile ? assign({}, o.def, o.def.mobile) : null;
    }
    function largeur(o, p) {
      var t = +p.taille || 120;
      if (!o.def.srcset && o.nat) t = Math.min(t, o.type === 'polaroid' ? o.nat / .888 : o.nat);   /* jamais plus grand que l'image */
      return t;
    }
    /* Ne demande que les images utiles dans ce mode */
    function demander() {
      liste.forEach(function (o) {
        if (o.etat !== 'neuf' || !reglages(o)) return;
        o.etat = 'attente';
        cont.appendChild(o.el);
        if (o.def.srcset) { o.img.sizes = Math.round(+reglages(o).taille || 120) + 'px'; o.img.srcset = o.def.srcset; }
        o.srcs = [].concat(o.def.src || []);
        if (o.srcs.length) o.img.src = o.srcs.shift(); else { o.etat = 'absent'; cont.removeChild(o.el); }
      });
    }
    function appliquer(o, p) {
      var plan = PLANS[p.plan] ? p.plan : 'milieu', P = PLANS[plan], el = o.el, k = (o.i % 3) - 1;
      el.setAttribute('data-plan', plan);
      el.style.setProperty('--x', (+p.x || 0) + '%');
      el.style.setProperty('--y', (+p.y || 0) + '%');
      el.style.setProperty('--t', largeur(o, p).toFixed(1) + 'px');
      el.style.setProperty('--k', o.ratio.toFixed(4));
      var sz = Math.round(+p.taille || 120) + 'px';
      if (o.def.srcset && o.img.getAttribute('sizes') !== sz) o.img.sizes = sz;   /* seulement s'il change (sinon l'image se recharge) */
      o.f.style.setProperty('--r', (+p.rot || 0) + 'deg');
      o.f.style.setProperty('--ax', P.souris + 'px');
      o.f.style.setProperty('--fy', (P.flotte * (1 + k * .18)).toFixed(1) + 'px');
      o.f.style.setProperty('--fx', (P.flotte * .25).toFixed(1) + 'px');
      o.f.style.setProperty('--fr', (P.rot * (1 - k * .2)).toFixed(2) + 'deg');
      o.f.style.setProperty('--fd', (P.duree + k * 1.3).toFixed(1) + 's');
      if (o.plan !== plan && o.tl) { o.tl.scrollTrigger && o.tl.scrollTrigger.kill(); o.tl.kill(); o.tl = null; if (G) G.set(el, { clearProps: 'transform,opacity' }); }
      o.plan = plan;
    }

    /* Les zones interdites (visage, titre, phrase, bouton) et la boîte du conteneur, au repos */
    function mesurer() {
      var c = repos(cont), zones = [];
      var fig = hero.querySelector(opt.fig), v = opt.visage;
      if (fig && v) { var r = repos(fig); if (r.w && r.h) zones.push({ nom: 'visage', l: r.l + v[0] * r.w, t: r.t + v[1] * r.h, r: r.l + v[2] * r.w, b: r.t + v[3] * r.h }); }
      if (opt.interdits) arr(hero.querySelectorAll(opt.interdits)).forEach(function (el) {
        var q = repos(el); if (q.w && q.h) zones.push({ nom: (el.className || el.tagName) + '', l: q.l, t: q.t, r: q.l + q.w, b: q.t + q.h });
      });
      return { c: c, zones: zones, h: hero.offsetHeight || innerHeight };
    }
    function gene(o, p, g) {
      var P = PLANS[o.plan], w = largeur(o, p), h = w * o.ratio, e = EMPRISE[o.type];
      var a = Math.abs(+p.rot || 0) * Math.PI / 180, we = w * e, he = h * e;
      var bw = we * Math.cos(a) + he * Math.sin(a), bh = we * Math.sin(a) + he * Math.cos(a);
      var cx = g.c.l + (+p.x || 0) / 100 * g.c.w, cy = g.c.t + (+p.y || 0) / 100 * g.c.h;
      var m = opt.marge + P.flotte + (MQ_SOURIS.matches ? Math.abs(P.souris) : 0);
      var r = { l: cx - bw / 2 - m, r: cx + bw / 2 + m, t: cy - bh / 2 - m, b: cy + bh / 2 + m };
      if (!MQ_REDUIT.matches) {   /* le trajet au défilement, tant que l'objet est visible */
        var tr = P.vitesse * g.h * opt.effacement[1];
        if (tr < 0) r.t += tr; else r.b += tr;
      }
      for (var i = 0; i < g.zones.length; i++) {
        var z = g.zones[i];
        if (r.l < z.r && r.r > z.l && r.t < z.b && r.b > z.t) return z.nom;
      }
      return '';
    }

    /* Le choix : dans l'ordre de la liste, les objets chargés qui ne gênent rien, jusqu'au maximum */
    function choisir() {
      if (mort) return;
      demander();
      var g = mesurer(), max = MQ_ORDI.matches ? opt.max : opt.maxMobile, n = 0, vus = [];
      liste.forEach(function (o) {
        var p = reglages(o), ok = false, z = '';
        if (p && o.etat === 'ok') {
          appliquer(o, p);
          z = gene(o, p, g);
          ok = n < max && !z;
        }
        o.raison = !p ? 'pas de place dans ce mode' : o.etat !== 'ok' ? o.etat : z ? 'gênerait : ' + z : ok ? 'montré' : 'au-delà du maximum';
        o.vis = ok;
        o.el.classList.toggle('is-vis', ok);
        if (ok) { n++; vus.push(o); }
      });
      /* l'entrée : du fond vers l'avant */
      vus.slice().sort(function (a, b) { return (PLANS[a.plan].rang - PLANS[b.plan].rang) || (a.i - b.i); })
        .forEach(function (o, k) { o.f.style.setProperty('--ed', (k * .14).toFixed(2) + 's'); });
      if (revele && n) {
        mouvement();
        if (!cont.classList.contains('is-in')) requestAnimationFrame(function () { if (!mort) cont.classList.add('is-in'); });
      }
      return n;
    }

    /* Les images se sont réglées (chargées ou absentes) : on peut révéler dès que le hero est entré */
    function regle() { if (revele) choisir(); else tenter(); }
    function tenter() {
      if (revele || mort || !delaiFini) return;
      var enAttente = liste.some(function (o) { return o.etat === 'attente'; });
      if (enAttente && Date.now() - tDebut < opt.attente) return;
      reveler();
    }
    function reveler() {
      if (revele || mort) return;
      revele = true;
      choisir();   /* rien à montrer : le hero reste tel quel */
    }
    function signal() {
      if (heroPret) return;
      var ok = (opt.pret || []).some(function (c) { return H.classList.contains(c); });
      if (!ok) return;
      heroPret = true;
      if (mo) mo.disconnect();
      plus(function () { delaiFini = true; tDebut = Date.now(); tenter(); plus(function () { if (!revele) reveler(); }, opt.attente + 50); }, opt.delai * 1000);
    }
    var mo = W.MutationObserver ? new MutationObserver(signal) : null;
    if (mo) mo.observe(H, { attributes: true, attributeFilter: ['class'] });
    plus(function () { if (!heroPret) { heroPret = true; if (mo) mo.disconnect(); delaiFini = true; tDebut = Date.now(); tenter(); plus(reveler, opt.attente + 50); } }, 4800);

    /* ---------- Le défilement : chaque plan à sa vitesse (scrub), puis l'effacement au départ du hero ---------- */
    function mouvement() {
      var fixe = MQ_REDUIT.matches;
      cont.classList.toggle('kz-prof--fixe', fixe);
      if (fixe) {
        liste.forEach(function (o) { if (o.tl) { o.tl.scrollTrigger && o.tl.scrollTrigger.kill(); o.tl.kill(); o.tl = null; } });
        if (G) liste.forEach(function (o) { G.set(o.el, { clearProps: 'transform,opacity' }); });
        souris(false);
        return;
      }
      souris(MQ_SOURIS.matches);
      if (!liste.some(function (o) { return o.vis && !o.tl; })) return;
      avecGsap(function (g, st) {
        if (mort || MQ_REDUIT.matches) return;
        G = g; ST = st;
        G.registerPlugin(ST);
        var e0 = opt.effacement[0], e1 = Math.max(e0 + .01, opt.effacement[1]);
        liste.forEach(function (o) {
          if (!o.vis || o.tl) return;
          var v = PLANS[o.plan].vitesse * (1 + ((o.i % 3) - 1) * .12);
          var tl = G.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
          tl.fromTo(o.el, { y: 0 }, { y: function () { return v * (hero.offsetHeight || innerHeight); }, duration: 1, ease: 'none' }, 0)
            .fromTo(o.el, { opacity: 1 }, { opacity: 0, duration: e1 - e0, ease: 'none', immediateRender: false }, e0);
          o.tl = tl;
        });
      });
    }

    /* ---------- La souris (ordinateur) : faible amplitude, lissée, seulement quand le hero est à l'écran ---------- */
    var cible = { x: 0, y: 0 }, cour = { x: 0, y: 0 }, raf = 0, sourisOn = false, aLEcran = true;
    function pas() {
      raf = 0;
      cour.x += (cible.x - cour.x) * .07;
      cour.y += (cible.y - cour.y) * .07;
      cont.style.setProperty('--mx', cour.x.toFixed(4));
      cont.style.setProperty('--my', cour.y.toFixed(4));
      if (Math.abs(cible.x - cour.x) > .0008 || Math.abs(cible.y - cour.y) > .0008) raf = requestAnimationFrame(pas);
    }
    function relancer() { if (!raf) raf = requestAnimationFrame(pas); }
    function bouge(e) {
      if (!sourisOn || !aLEcran || e.pointerType === 'touch') return;
      cible.x = Math.max(-1, Math.min(1, e.clientX / (innerWidth || 1) * 2 - 1));
      cible.y = Math.max(-1, Math.min(1, e.clientY / (innerHeight || 1) * 2 - 1));
      relancer();
    }
    function sort() { cible.x = 0; cible.y = 0; relancer(); }
    function souris(on) {
      if (on === sourisOn) return;
      sourisOn = on;
      if (on) {
        W.addEventListener('pointermove', bouge, { passive: true });
        H.addEventListener('mouseleave', sort);
      } else {
        W.removeEventListener('pointermove', bouge);
        H.removeEventListener('mouseleave', sort);
        sort();
      }
    }
    var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) {
      aLEcran = es[es.length - 1].isIntersecting;
      if (!aLEcran) sort();
    }) : null;
    if (io) io.observe(hero);

    /* ---------- Mise en page : remesurer (redimensionnement, polices, changement de mode) ---------- */
    var rz = 0;
    function plusTard() { clearTimeout(rz); rz = setTimeout(function () { if (revele) choisir(); else demander(); }, 160); }
    W.addEventListener('resize', plusTard);
    onMQ(MQ_ORDI, plusTard);
    onMQ(MQ_SOURIS, plusTard);
    onMQ(MQ_REDUIT, plusTard);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { if (revele) choisir(); });

    demander();
    signal();

    var inst = {
      rafraichir: function () { if (revele) choisir(); },
      objets: function () { return liste.filter(function (o) { return o.vis; }).map(function (o) { return o.def.id; }); },
      pourquoi: function () { return liste.map(function (o) { return (o.def.id || 'o' + o.i) + ' : ' + (o.raison || o.etat); }); },
      detruire: function () {
        mort = true;
        minuteurs.forEach(clearTimeout); clearTimeout(rz);
        if (mo) mo.disconnect();
        if (io) io.disconnect();
        souris(false);
        if (raf) cancelAnimationFrame(raf);
        W.removeEventListener('resize', plusTard);
        liste.forEach(function (o) { if (o.tl) { o.tl.scrollTrigger && o.tl.scrollTrigger.kill(); o.tl.kill(); } });
        cont.textContent = '';
        cont.classList.remove('is-in', 'kz-prof--fixe');
        cont.__kzProf = null;
      }
    };
    cont.__kzProf = inst;
    return inst;
  }

  /* ------------------------------------------------------------------------ Démarrage automatique */
  function tout() {
    arr(D.querySelectorAll('[data-kz-prof]')).forEach(function (el) {
      var s = SERIES[el.getAttribute('data-kz-prof')];
      if (!s || el.__kzProf) return;
      try { poser(el, s.objets, s.options); }
      catch (e) { console.error('[kz] profondeur : ' + e.message); }
    });
  }

  W.KzProfondeur = { series: SERIES, plans: PLANS, poser: poser };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout, { once: true });
  else tout();
})();
