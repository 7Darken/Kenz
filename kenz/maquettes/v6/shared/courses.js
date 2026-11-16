/* ==========================================================================
   Mes courses (k15ze) : un module partagé, piloté par UNE seule liste de données (COURSES, juste dessous).
   Ajouter une course = ajouter un objet à COURSES. Rien d'autre à toucher.
   Styles : shared/courses.css (identité k15ze, clair et sombre). Polices chargées par la page : Anton, Inter.
   Données d'origine : ../_shared/content.js → KENZ.createur.k15ze.courses.

   LE RENDU : pas de cartes. Chaque course est une composition photo éditoriale, posée sur le fond de la section :
     une grande photo, une ou deux plus petites qui la chevauchent en décalé (parallaxe au défilement, GSAP ScrollTrigger
     + scrub, chargé ici s'il manque), le nom en Anton qui mord sur le bas de la photo ; dessous, la date et le lieu,
     2 à 3 lignes de description, les chiffres en discret, « Voir le détail + ». Toute la composition s'ouvre au clic.
   LE DÉTAIL : une fiche compacte (≈ 680 px, au plus ≈ 80 vh ; sur mobile, une feuille qui monte du bas à ≈ 85 %), fond flouté
     (role="dialog", aria-modal, focus piégé puis rendu, Échap, clic sur le fond, défilement de la page bloqué).
     Au cœur : une petite scène animée, en icônes 3D (assets/sport3d/), qui fait comprendre le sport (champ anim), puis une ou deux phrases, les photos
     en vignettes (une vignette cliquée s'agrandit dans la fiche), la vidéo. La photo cliquée vole jusqu'à sa vignette.
   Mouvement réduit : ni parallaxe, ni vol de la photo, des fondus ; la scène est figée dans un état final lisible.
   Photos jamais affichées au-delà de leur taille réelle : chaque cadre est borné par la taille de sa photo.

   BRANCHEMENT
     <head> <link rel="stylesheet" href="shared/courses.css">
     <body> <div data-kz-courses data-ids="hyrox,spartan" data-variante="landing"></div>
            <script src="shared/courses.js" defer></script>
     data-ids       les courses à montrer, dans cet ordre (absent : toutes, dans l'ordre de COURSES)
     data-variante  "landing" : côte à côte sur ordinateur, en rythmes décalés (une plus haute que l'autre), l'une sous l'autre sur mobile
                    "page"    : une course par rangée, la composition et le texte côte à côte, en alternance (empilés sur mobile)
     data-titre     niveau des titres (défaut "h3")

   UNE COURSE
     id, nom (Anton), lieu (facultatif), date ('AAAA-MM-JJ' ou 'AAAA-MM'), statut ('faite' | 'en cours')
     resume     2 à 3 lignes : ce qu'est la course, ce qu'elle représente pour Kenz (à partir des données)
     chiffres   [{ v: '8', l: 'stations' }] : en Anton, en discret
     photos     la composition : la 1re en grand, les suivantes (1 ou 2) en décalé. [{ src, w, h, alt, cadrage }] ; src relatif à v6/
     dessin     sans photo : un dessin au trait à la place ('ring')
     video      facultatif : { url, titre, duree }
     anim       la scène animée de la fiche : 'hyrox' | 'spartan' | 'boxe' (extensible : voir ANIMS plus bas)
     detail     la fiche : { paragraphes: [une ou deux phrases], photos: [3 ou 4 vignettes] (défaut : photos) }

   API : window.KzCourses = { donnees: COURSES, rendre(el), ajouter(course), ouvrir(id) } ; document reçoit « kz-courses:pret ».
   ========================================================================== */
(function () {
  'use strict';
  if (window.KzCourses) return;

  /* ------------------------------------------------------------------------
     LES PHOTOS (une fois, réutilisées par les courses)
     ------------------------------------------------------------------------ */
  var PH = {
    skierg: { src: 'assets/img/sport/hyrox-riga-skierg.webp', w: 1200, h: 1801, alt: 'Kenz au SkiErg, les bras tendus vers les poignées', cadrage: '50% 30%' },
    traineau: { src: 'assets/img/sport/hyrox-riga-traineau.webp', w: 1200, h: 1801, alt: 'Kenz pousse le traîneau sur la piste, sous les projecteurs', cadrage: '50% 46%' },
    tirage: { src: 'assets/img/sport/hyrox-riga-tirage.webp', w: 1200, h: 1801, alt: 'Kenz tire la corde du traîneau, à côté d’un autre participant', cadrage: '35% 55%' },
    rameur: { src: 'assets/img/sport/hyrox-riga-rameur.webp', w: 1200, h: 1801, alt: 'Kenz rame à fond sur l’ergomètre, le visage crispé par l’effort', cadrage: '50% 24%' },
    fentes: { src: 'assets/img/sport/hyrox-riga-fentes.webp', w: 1200, h: 1801, alt: 'Kenz en fente, un sandbag sur les épaules', cadrage: '50% 50%' },
    wallball: { src: 'assets/img/sport/hyrox-riga-wallball.webp', w: 1200, h: 1801, alt: 'Kenz en squat, un medicine-ball contre la poitrine', cadrage: '40% 62%' },
    finish: { src: 'assets/img/sport/hyrox-riga-finish.webp', w: 1200, h: 800, alt: 'Kenz et un autre participant sous l’arche d’arrivée, tout sourire', cadrage: '45% 50%' },
    arrivee: { src: 'assets/img/sport/hyrox-riga-arrivee.webp', w: 1200, h: 800, alt: 'Kenz et un autre participant devant le panneau du temps final', cadrage: '38% 50%' },
    spartanBoule: { src: 'assets/img/spartan-1.jpg', w: 511, h: 768, alt: 'Kenz porte une lourde boule de pierre dans les herbes hautes', cadrage: '50% 40%' },
    spartanFeu: { src: 'assets/img/spartan-2.jpg', w: 768, h: 511, alt: 'Kenz saute au-dessus d’un feu pendant une Spartan Race', cadrage: '48% 50%' }
  };

  /* ------------------------------------------------------------------------
     LES DONNÉES : une course = un objet
     ------------------------------------------------------------------------ */
  var COURSES = [
    {
      id: 'hyrox',
      nom: 'HYROX',
      lieu: 'Riga',
      date: '2025-05-31',
      statut: 'faite',
      resume: 'Une course hybride : huit fois un kilomètre de course, chacun suivi d’une station. Mon premier, à Riga, sans entraînement.',
      chiffres: [{ v: '8', l: 'stations' }, { v: '8', l: 'km de course' }],
      photos: [PH.rameur, PH.traineau, PH.arrivee],
      video: { url: 'https://www.youtube.com/watch?v=kBNLSpnhrGU', titre: 'Mon premier HYROX sans entraînement !', duree: '7:08' },
      anim: 'hyrox',
      detail: {
        paragraphes: [
          'Une course de fitness en salle : 8 fois 1 km de course, chacun suivi d’une station.',
          'Le mien : Riga, le 31 mai 2025. Mon premier, sans entraînement.'
        ],
        photos: [PH.rameur, PH.traineau, PH.wallball, PH.finish]
      }
    },
    {
      id: 'spartan',
      nom: 'Spartan Race',
      date: '2025-06',
      statut: 'faite',
      resume: 'Une course à obstacles en pleine nature : de la boue, des murs à franchir, des charges à porter.',
      chiffres: [],
      photos: [PH.spartanBoule, PH.spartanFeu],
      anim: 'spartan',
      detail: {
        paragraphes: [
          'Une course à obstacles en pleine nature : des murs, de la boue, des charges à porter, des filets, des sauts.',
          'J’en ai couru une en juin 2025.'
        ]
      }
    },
    {
      id: 'boxe',
      nom: 'Boxe',
      date: '2026-10-14',
      statut: 'en cours',
      resume: 'J’apprends les bases : garde, déplacements, technique.',
      chiffres: [],
      photos: [],
      dessin: 'ring',
      anim: 'boxe',
      detail: {
        paragraphes: [
          'Depuis le 14 octobre 2026, j’apprends la boxe.',
          'Pour l’instant, les bases : la garde, les déplacements, la technique.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------------
     Outils
     ------------------------------------------------------------------------ */
  var D = document, W = window, H = D.documentElement;
  var SCRIPT = D.currentScript;
  var BASE = (function () {
    var s = (SCRIPT && SCRIPT.src) || ((D.querySelector('script[src*="courses.js"]') || {}).src) || location.href;
    try { return new URL('../', s).href; } catch (e) { return ''; }
  })();
  function chemin(p) { if (/^(https?:|data:|\/)/.test(p)) return p; try { return new URL(p, BASE).href; } catch (e) { return p; } }
  function mq(q) { return W.matchMedia ? W.matchMedia(q) : { matches: false }; }
  var MQ_RM = mq('(prefers-reduced-motion: reduce)'), MQ_SOURIS = mq('(hover: hover) and (pointer: fine)');
  function ecouter(m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* espaces insécables avant « : ; ! ? » (typographie française) */
  function fr(s) { return esc(s).replace(/ ([:;!?])/g, '&nbsp;$1'); }
  function arr(x) { return Array.prototype.slice.call(x || []); }
  function trouver(id) { return COURSES.filter(function (c) { return c.id === id; })[0]; }
  function reduit() { return !!MQ_RM.matches; }

  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function quand(c) {
    var p = String(c.date || '').split('-'), a = p[0], m = MOIS[+p[1] - 1], j = +p[2];
    var enCours = c.statut === 'en cours';
    if (j && m) return (enCours ? 'Depuis le ' : '') + (j === 1 ? '1er' : j) + ' ' + m + ' ' + a;
    if (m) return enCours ? 'Depuis ' + m + ' ' + a : m.charAt(0).toUpperCase() + m.slice(1) + ' ' + a;
    return (enCours ? 'Depuis ' : '') + (a || '');
  }
  function ligneQuand(c, cls) {
    return '<p class="' + cls + '">' + (c.lieu ? '<span class="kc-lieu">' + esc(c.lieu) + '</span><span class="kc-point" aria-hidden="true">·</span>' : '') +
      '<time datetime="' + esc(c.date) + '">' + esc(quand(c)) + '</time>' +
      (c.statut === 'en cours' ? '<span class="kc-encours"><i aria-hidden="true"></i>en cours</span>' : '') + '</p>';
  }
  /* Un cadre de photo, jamais plus grand que la photo : largeur max = min(largeur réelle, hauteur réelle × rapport du cadre) */
  function cadre(p, ratio, cls, eager) {
    var max = Math.floor(Math.min(+p.w || 9999, (+p.h || 9999) * ratio));
    return '<div class="kc-cadre ' + (cls || '') + '" style="--r:' + ratio.toFixed(4) + ';max-width:' + max + 'px">' +
      '<img src="' + esc(chemin(p.src)) + '" alt="' + esc(p.alt) + '" width="' + (+p.w || '') + '" height="' + (+p.h || '') + '"' +
      (p.cadrage ? ' style="object-position:' + esc(p.cadrage) + '"' : '') + (eager ? '' : ' loading="lazy"') + ' decoding="async" data-kc-src="' + esc(p.src) + '"></div>';
  }
  function ratioDe(p) { var r = (+p.w || 4) / (+p.h || 5); return r >= 1 ? 1.5 : .75; }
  var RING = '<svg class="kc-dessin" viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
    '<rect x="34" y="34" width="132" height="132" rx="3" pathLength="1"/><rect x="44" y="44" width="112" height="112" rx="2" pathLength="1"/>' +
    '<rect x="54" y="54" width="92" height="92" rx="2" pathLength="1"/>' +
    '<rect class="acc" x="28" y="28" width="12" height="12" rx="2" pathLength="1"/><rect class="acc" x="160" y="28" width="12" height="12" rx="2" pathLength="1"/>' +
    '<rect class="acc" x="28" y="160" width="12" height="12" rx="2" pathLength="1"/><rect class="acc" x="160" y="160" width="12" height="12" rx="2" pathLength="1"/></svg>';
  var PLUS = '<span class="kc-plus" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 3.5v9M3.5 8h9"/></svg></span>';

  /* ------------------------------------------------------------------------
     Une composition
     ------------------------------------------------------------------------ */
  function compo(c, i, hN) {
    var ph = (c.photos || []).slice(0, 3), id = 'kc-' + esc(c.id);
    var h = '<li class="kc-item" style="--i:' + i + '"><article class="kc-course" data-course="' + esc(c.id) + '" aria-labelledby="' + id + '">';
    h += '<div class="kc-compo' + (ph.length ? '' : ' kc-compo--dessin') + (ph.length > 2 ? ' kc-compo--3' : '') + '" data-kc-ouvrir>';
    if (ph.length) {
      h += '<figure class="kc-calque kc-calque--a" data-vitesse="2">' + cadre(ph[0], .8, 'kc-cadre--a', i === 0) + '</figure>';
      if (ph[1]) h += '<figure class="kc-calque kc-calque--b" data-vitesse="7">' + cadre(ph[1], ratioDe(ph[1]), 'kc-cadre--b') + '</figure>';
      if (ph[2]) h += '<figure class="kc-calque kc-calque--c" data-vitesse="4.5">' + cadre(ph[2], ratioDe(ph[2]), 'kc-cadre--c') + '</figure>';
    } else {
      h += '<figure class="kc-calque kc-calque--a" data-vitesse="2"><div class="kc-cadre kc-cadre--a kc-cadre--vide">' + (c.dessin === 'ring' ? RING : '') + '</div></figure>';
    }
    h += '<' + hN + ' class="kc-nom" id="' + id + '" data-vitesse="3.2">' + esc(c.nom) + '</' + hN + '>';
    h += '</div>';
    h += '<div class="kc-texte">';
    h += ligneQuand(c, 'kc-quand');
    if (c.resume) h += '<p class="kc-resume">' + fr(c.resume) + '</p>';
    if (c.chiffres && c.chiffres.length) {
      h += '<p class="kc-chiffres">' + c.chiffres.map(function (x) { return '<span class="kc-chiffre"><b>' + esc(x.v) + '</b> ' + esc(x.l) + '</span>'; }).join('<span class="kc-sep" aria-hidden="true">·</span>') + '</p>';
    }
    h += '<button class="kc-voir" type="button" aria-haspopup="dialog" data-kc-voir>Voir le détail<span class="kc-sr"> : ' + esc(c.nom) + '</span>' + PLUS + '</button>';
    h += '</div></article></li>';
    return h;
  }

  /* ------------------------------------------------------------------------
     Une boîte [data-kz-courses]
     ------------------------------------------------------------------------ */
  var boites = [];
  function choisir(box) {
    var ids = (box.getAttribute('data-ids') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!ids.length) return COURSES.slice();
    return ids.map(trouver).filter(Boolean);
  }
  /* La couleur du fond sous la boîte : le bas de la grande photo fond dedans (le nom mord dessus, lisible) */
  function fondSous(box) {
    var el = box;
    while (el && el.nodeType === 1) {
      var bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'transparent' && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(bg)) return bg;
      el = el.parentElement;
    }
    return '';
  }
  function poserFond(box) { var f = fondSous(box); if (f) box.style.setProperty('--kc-fond', f); }

  function rendre(box) {
    if (!box) return;
    var v = box.getAttribute('data-variante') === 'page' ? 'page' : 'landing';
    var hN = /^h[2-6]$/.test(box.getAttribute('data-titre') || '') ? box.getAttribute('data-titre') : 'h3';
    var liste = choisir(box);
    box.classList.add('kc');
    box.classList.remove('is-rangee');
    box.setAttribute('data-variante', v);
    box.setAttribute('data-n', liste.length);
    box.classList.toggle('kc--anim', !reduit());
    box.innerHTML = '<ul class="kc-liste" role="list">' + liste.map(function (c, i) { return compo(c, i, hN); }).join('') + '</ul>';
    if (boites.indexOf(box) < 0) boites.push(box);
    poserFond(box);
    brancher(box);
    parallaxe(box);
  }

  /* L'entrée à l'écran (une fois) : les calques se posent */
  var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: .18, rootMargin: '0px 0px -8% 0px' }) : null;

  function brancher(box) {
    arr(box.querySelectorAll('.kc-course')).forEach(function (art) {
      if (io && box.classList.contains('kc--anim')) io.observe(art); else art.classList.add('is-in');
      var c = trouver(art.getAttribute('data-course'));
      var voir = art.querySelector('[data-kc-voir]'), comp = art.querySelector('[data-kc-ouvrir]');
      voir.addEventListener('click', function () { ouvrir(c, art.querySelector('.kc-cadre--a img'), voir); });
      /* toute la composition est cliquable ; au clavier, c'est le bouton « Voir le détail » */
      comp.addEventListener('click', function (e) {
        var img = e.target.closest('.kc-cadre') && e.target.closest('.kc-cadre').querySelector('img');
        ouvrir(c, img || art.querySelector('.kc-cadre--a img'), voir);
      });
    });
  }

  /* ------------------------------------------------------------------------
     La parallaxe : GSAP ScrollTrigger + scrub (chargés ici s'ils manquent). Rien en mouvement réduit.
     Chaque calque glisse à sa vitesse (data-vitesse, en % de la hauteur de l'écran sur toute la traversée).
     ------------------------------------------------------------------------ */
  var GSAP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  var ST_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
  var gsapEtat = 0, gsapAttente = [];
  function charger(src, ok, ko) {
    var s = D.createElement('script'); s.src = src; s.async = true;
    s.onload = ok; s.onerror = ko || function () {};
    D.head.appendChild(s);
  }
  function avecGsap(fn) {
    if (W.gsap && W.ScrollTrigger) { gsapEtat = 2; return fn(); }
    gsapAttente.push(fn);
    if (gsapEtat) return;
    gsapEtat = 1;
    var fin = function () { gsapEtat = 2; var l = gsapAttente; gsapAttente = []; l.forEach(function (f) { try { f(); } catch (e) { console.error('[kz] courses : ' + e.message); } }); };
    var go = function () { if (W.ScrollTrigger) fin(); else charger(ST_URL, fin, function () { gsapEtat = 3; }); };
    if (W.gsap) go(); else charger(GSAP_URL, go, function () { gsapEtat = 3; });
  }
  function parallaxe(box) {
    if (box.__kcST) { box.__kcST.forEach(function (t) { t.kill(); }); box.__kcST = null; }
    arr(box.querySelectorAll('[data-vitesse]')).forEach(function (el) { el.style.transform = ''; });
    if (reduit()) return;
    avecGsap(function () {
      var G = W.gsap, ST = W.ScrollTrigger;
      if (!G || !ST || reduit()) return;
      G.registerPlugin(ST);
      var liste = [];
      arr(box.querySelectorAll('.kc-compo')).forEach(function (comp) {
        arr(comp.querySelectorAll('[data-vitesse]')).forEach(function (el) {
          var v = parseFloat(el.getAttribute('data-vitesse')) || 0;
          var tw = G.fromTo(el, { y: function () { return v * innerHeight / 100; } }, {
            y: function () { return -v * innerHeight / 100; }, ease: 'none',
            scrollTrigger: { trigger: comp, start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true }
          });
          if (tw.scrollTrigger) liste.push(tw.scrollTrigger);
        });
      });
      box.__kcST = liste;
      ST.refresh();
    });
  }

  /* ------------------------------------------------------------------------
     Les animations qui expliquent le sport : une petite scène vive, en icônes 3D, aux couleurs k15ze.
     ANIMS[nom] = { resume: 'la même chose en mots (lecteurs d'écran)', creer(el) -> { intro, periode, tick(t), figer() } }
     Le tempo : on comprend en ≈ 3 s (l'intro), puis une petite vie au repos (periode), sans longue séquence.
     Mouvement réduit : figer() pose un état final, fixe et lisible. Ajouter un sport = ajouter une entrée ici + anim: 'nom'.
     ------------------------------------------------------------------------ */
  var NS = 'http://www.w3.org/2000/svg';
  function borne(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function doux(p) { p = borne(p); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function attr(el, o) { for (var k in o) el.setAttribute(k, typeof o[k] === 'number' ? (Math.round(o[k] * 100) / 100) : o[k]); }
  /* Une ligne de texte sous la scène : on ne la change que si elle change, avec un petit fondu */
  function legende(el) {
    var t = el.querySelector('.kca-label__t'), s = el.querySelector('.kca-label__s'), cur = '';
    return function (titre, sous, vert) {
      var k = titre + '|' + sous + '|' + (vert ? 1 : 0);
      if (k === cur) return;
      cur = k;
      t.textContent = titre; s.textContent = sous || '';
      el.classList.toggle('is-vert', !!vert);
      el.classList.remove('is-chg'); void el.offsetWidth; el.classList.add('is-chg');
    };
  }
  function mots(liste) { return '<p class="kca-mots" aria-hidden="true">' + liste.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</p>'; }
  function allumerMots(el, i) { arr(el.querySelectorAll('.kca-mots span')).forEach(function (s, k) { s.classList.toggle('is-on', i === 'tous' || (i && i.indexOf ? i.indexOf(k) > -1 : k === i)); }); }

  /* Les icônes 3D (assets/sport3d/ : copies de 256 px, le master de 1024 px en srcset pour les grandes tailles).
     Elles ne sont demandées qu'à l'ouverture de la fiche : la scène est construite à ce moment-là. */
  var I3D = 'assets/sport3d/';
  function ico3d(id, cls, px) {
    var p = chemin(I3D + '256/' + id + '.webp'), m = chemin(I3D + id + '.webp');
    return '<img class="kca-img' + (cls ? ' ' + cls : '') + '" src="' + esc(p) + '" srcset="' + esc(p) + ' 256w, ' + esc(m) + ' 1024w" sizes="' + px + 'px" alt="" width="256" height="256" decoding="async" draggable="false">';
  }
  /* Arriver lentement, partir vite, sans rebond */
  function arrivee(p) { p = borne(p); return 1 - Math.pow(1 - p, 4); }
  function depart(p) { p = borne(p); return p * p * p; }
  function fondu(el, t, duree, ent, sort) {
    el.style.setProperty('--kca-op', t > duree - sort ? (1 - (t - (duree - sort)) / sort).toFixed(3) : t < ent ? (t / ent).toFixed(3) : '1');
  }

  /* Chaque scène : une intro courte (≈ 3 s pour comprendre), puis une petite vie au repos, en boucle légère.
     { intro, periode, tick(t), figer() } : t va de 0 à intro, puis intro + (le temps du repos modulo periode). */
  function fen(t, a, b) { return borne((t - a) / (b - a)); }
  function vis(el, o, tr) { el.style.opacity = borne(o).toFixed(3); if (tr != null) el.style.transform = tr; }

  var ANIMS = {
    /* HYROX : une formule (1 km + 1 station, × 8) qui se replie en une boucle de course */
    hyrox: {
      resume: 'Le HYROX, c’est une formule : 1 km de course, plus 1 station, fois 8. Les 8 stations : SkiErg, traîneau poussé, traîneau tiré, burpees broad jumps, rameur, farmers carry, fentes avec sandbag, wall balls. 8 km et 8 stations, une seule course.',
      creer: function (el) {
        var ST = [['hyrox-01-skierg', 'SkiErg'], ['hyrox-02-sled-push', 'Traîneau poussé'], ['hyrox-03-sled-pull', 'Traîneau tiré'], ['hyrox-04-burpee-broad-jump', 'Burpees broad jumps'],
          ['hyrox-05-row', 'Rameur'], ['hyrox-06-farmers-carry', 'Farmers carry'], ['hyrox-07-sandbag-lunges', 'Fentes avec sandbag'], ['hyrox-08-wall-balls', 'Wall balls']];
        var STOP = 4, SF = ST.map(function (s, k) { return (k + 1) / 8 - .035; });
        el.innerHTML = '<div class="kca-3d kca-3d--hx">' +
          '<p class="kca-formule-fixe">1 km <span>+</span> 1 station <em>× 8</em></p>' +
          '<svg class="kca-hx-svg" focusable="false"><path class="kca-anneau" pathLength="1"/><path class="kca-anneau-fait" pathLength="1"/>' +
            '<path class="kca-trainee" pathLength="1"/><path class="kca-trainee kca-trainee--vive" pathLength="1"/></svg>' +
          '<div class="kca-formule">' +
            '<div class="kf kf-a"><span class="kf-ico">' + ico3d('hyrox-run', '', 72) + '</span><span class="kf-txt"><b>1 km</b><small>de course</small></span></div>' +
            '<span class="kf kf-plus">+</span>' +
            '<div class="kf kf-b"><span class="kf-carte">' + ST.map(function (s) { return ico3d(s[0], 'kf-slot', 64); }).join('') + '</span><span class="kf-txt kf-txt--c"><b>1 station</b><small>SkiErg, traîneau, rameur…</small></span></div>' +
            '<span class="kf kf-x"><i class="kca-halo"></i><b>× 8</b></span>' +
          '</div>' +
          '<div class="kca-coeur"><b>8 km · 8 stations</b><small>une seule course</small></div>' +
          ST.map(function (s, k) { return '<span class="kca-poste" data-k="' + k + '"><i class="kca-halo"></i>' + ico3d(s[0], '', 44) + '<span class="kca-poste__nom">' + esc(s[1]) + '</span></span>'; }).join('') +
          '<span class="kca-arche">' + ico3d('hyrox-finish', '', 52) + '</span>' +
          '<i class="kca-point kca-point--hx"></i></div>';
        var sc = el.querySelector('.kca-3d'), svg = sc.querySelector('svg'), anneau = svg.querySelector('.kca-anneau'), faitA = svg.querySelector('.kca-anneau-fait');
        var tr = arr(svg.querySelectorAll('.kca-trainee')), form = sc.querySelector('.kca-formule'), fa = sc.querySelector('.kf-a'), fp = sc.querySelector('.kf-plus'), fb = sc.querySelector('.kf-b'), fx = sc.querySelector('.kf-x');
        var faTxt = fa.querySelector('.kf-txt'), fbTxt = fb.querySelector('.kf-txt'), carte = fb.querySelector('.kf-carte'), slots = arr(carte.querySelectorAll('.kf-slot')), haloX = fx.querySelector('.kca-halo');
        var coeur = sc.querySelector('.kca-coeur'), postes = arr(sc.querySelectorAll('.kca-poste')), arche = sc.querySelector('.kca-arche'), point = sc.querySelector('.kca-point--hx');
        var G = null;
        /* la géométrie de la boucle : une ellipse, comme un circuit vu de dessus ; les stations autour */
        function geo() {
          var W = sc.clientWidth, H = sc.clientHeight, mob = W < 420, ic = mob ? 34 : 52, off = mob ? 20 : 28, top = sc.classList.contains('is-fige') ? 26 : 0;
          var ia = ic + 12, cy = top + (H - top) / 2 + 4, ry = (H - top) / 2 - off - ia / 2 - 6, rx = Math.min(W / 2 - off - ic / 2 - 6, ry * 2.7);
          G = { W: W, H: H, cx: W / 2, cy: cy, rx: rx, ry: ry, ic: ic, off: off };
          svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
          var d = 'M' + G.cx + ' ' + (cy - ry) + ' A' + rx + ' ' + ry + ' 0 1 1 ' + G.cx + ' ' + (cy + ry) + ' A' + rx + ' ' + ry + ' 0 1 1 ' + G.cx + ' ' + (cy - ry);
          [anneau, faitA].concat(tr).forEach(function (p) { p.setAttribute('d', d); });
          postes.forEach(function (p, k) { var q = pt(SF[k], off); p.style.left = (q.x - ic / 2).toFixed(1) + 'px'; p.style.top = (q.y - ic / 2).toFixed(1) + 'px'; p.style.width = p.style.height = ic + 'px'; });
          var qa = pt(0, off + 4);
          arche.style.left = (qa.x - ia / 2).toFixed(1) + 'px'; arche.style.top = (qa.y - ia / 2).toFixed(1) + 'px'; arche.style.width = arche.style.height = ia + 'px';
          coeur.style.left = G.cx + 'px'; coeur.style.top = cy + 'px';
          /* la formule : à l'échelle de la scène */
          form.style.setProperty('--s', Math.min(1, (W - 8) / Math.max(1, form.scrollWidth)).toFixed(3));
        }
        function pt(f, dr) { var a = (-90 + 360 * f) * Math.PI / 180; return { x: G.cx + (G.rx + (dr || 0)) * Math.cos(a), y: G.cy + (G.ry + (dr || 0)) * Math.sin(a) }; }
        geo();
        if (W.ResizeObserver) new ResizeObserver(function () { if (sc.isConnected) geo(); }).observe(sc);
        el.addEventListener('click', function (e) {
          var p = e.target.closest('.kca-poste');
          postes.forEach(function (x) { x.classList.toggle('is-nom', x === p && !x.classList.contains('is-nom')); });
        });
        /* le point : sa place (f de 0 à 1 sur la boucle), sa traînée, la station qu'il passe s'allume */
        function tour(f, vu) {
          var q = pt(f, 0);
          point.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)';
          point.style.opacity = vu;
          tr[0].style.strokeDashoffset = (-(f - .16)).toFixed(4);
          tr[1].style.strokeDashoffset = (-(f - .07)).toFixed(4);
          tr.forEach(function (p) { p.style.opacity = vu && f > .002 && f < .998 ? 1 : 0; });
          postes.forEach(function (p, k) { p.classList.toggle('is-flash', vu > 0 && Math.abs(f - SF[k]) < .028); });
        }
        /* la boucle : elle se pose ; le tour vert se trace, puis s'efface : restent les 8 segments de 1 km */
        function boucleFinale(o, fait, reste) {
          vis(svg, o, 'scale(' + (.9 + .1 * o).toFixed(3) + ')');
          faitA.style.strokeDasharray = fait.toFixed(4) + ' 1';
          faitA.style.opacity = (reste == null ? 1 : reste).toFixed(3);
        }
        return {
          intro: 3.5, periode: 4.6,
          tick: function (t) {
            el.style.setProperty('--kca-op', '1');
            sc.classList.remove('is-repos');
            if (t < 3.5) {
              /* 1. la chaussure entre avec élan, « 1 km » */
              var a = arrivee(fen(t, 0, .45)), out = depart(fen(t, 2.2, 2.48));
              vis(form, 1 - out, 'translate(-50%,-50%) scale(calc(var(--s,1) * ' + (1 - .3 * out).toFixed(3) + '))');
              vis(fa, a, 'translateX(' + ((1 - a) * -70).toFixed(1) + 'px) rotate(' + ((1 - a) * -10).toFixed(2) + 'deg)');
              vis(faTxt, arrivee(fen(t, .14, .5)), 'translateY(' + ((1 - arrivee(fen(t, .14, .5))) * 8).toFixed(1) + 'px)');
              /* 2. « + » claque, la carte : les stations défilent (≈ 70 ms), puis s'arrêtent */
              var p = arrivee(fen(t, .7, .86));
              vis(fp, p, 'scale(' + lerp(1.8, 1, p).toFixed(3) + ')');
              var c = arrivee(fen(t, .74, .98));
              vis(fb, c, 'scale(' + lerp(.82, 1, c).toFixed(3) + ')');
              var idx = t < .78 ? 0 : t < 1.34 ? Math.floor((t - .78) / .07) % 8 : STOP, tourne = t >= .78 && t < 1.34;
              slots.forEach(function (s, k) { s.style.opacity = k === idx ? 1 : 0; s.style.transform = k === idx ? (tourne ? 'translateY(' + (6 - 12 * (((t - .78) / .07) % 1)).toFixed(1) + 'px)' : 'translateY(' + ((1 - arrivee(fen(t, 1.34, 1.6))) * 10).toFixed(1) + 'px)') : ''; });
              carte.classList.toggle('is-tourne', tourne);
              vis(fbTxt, arrivee(fen(t, 1.12, 1.45)), 'translateY(' + ((1 - arrivee(fen(t, 1.12, 1.45))) * 8).toFixed(1) + 'px)');
              /* 3. « × 8 » : un impact franc (une légère compression, puis ça se pose) */
              var x = fen(t, 1.5, 1.86), sx, sy;
              if (x < .22) { var k1 = arrivee(x / .22); sx = lerp(1.3, 1.07, k1); sy = lerp(1.3, .9, k1); } else { var k2 = arrivee((x - .22) / .78); sx = lerp(1.07, 1, k2); sy = lerp(.9, 1, k2); }
              vis(fx, t < 1.5 ? 0 : 1, 'scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')');
              haloX.style.opacity = (t < 1.5 ? 0 : 1 - fen(t, 1.55, 2.1)).toFixed(3);
              /* 4. la formule se replie : la boucle, les stations en cascade, l'arche, le cœur, un tour complet */
              boucleFinale(arrivee(fen(t, 2.24, 2.66)), Math.max(0, doux(fen(t, 2.32, 3.5))));
              postes.forEach(function (p, k) { var e = arrivee(fen(t, 2.34 + k * .06, 2.66 + k * .06)); vis(p, e, 'scale(' + lerp(.3, 1, e).toFixed(3) + ')'); });
              var ea = arrivee(fen(t, 2.28, 2.6)); vis(arche, ea, 'translateY(' + ((1 - ea) * -10).toFixed(1) + 'px)');
              var ec = arrivee(fen(t, 2.55, 2.95)); vis(coeur, ec, 'translate(-50%,-50%) scale(' + lerp(.9, 1, ec).toFixed(3) + ')');
              if (t >= 2.32) tour(doux(fen(t, 2.32, 3.5)), 1); else tour(0, 0);
            } else {
              /* 5. au repos : un tour toutes les 4,6 s, la station passée s'allume */
              var u = t - 3.5;
              vis(form, 0); vis(fa, 0); vis(fp, 0); vis(fb, 0); vis(fx, 0);
              boucleFinale(1, 1, 1 - arrivee(fen(u, 0, .7)));
              postes.forEach(function (p) { vis(p, 1, ''); });
              vis(arche, 1, ''); vis(coeur, 1, 'translate(-50%,-50%)');
              if (u > 3.2 && u < 4.4) tour(doux(fen(u, 3.2, 4.4)), 1);
              else { tour(0, 1); sc.classList.add('is-repos'); }
            }
          },
          figer: function () {
            sc.classList.add('is-fige'); geo();
            vis(form, 0); boucleFinale(1, 1, 0);
            postes.forEach(function (p) { vis(p, 1, ''); }); vis(arche, 1, ''); vis(coeur, 1, 'translate(-50%,-50%)');
            tour(0, 1);
          }
        };
      }
    },

    /* Spartan Race : le sentier, les obstacles posés dessus ; le point le parcourt d'un trait */
    spartan: {
      resume: 'Une Spartan Race, en général : un sentier en pleine nature, ponctué d’obstacles : des murs, de la boue sous des barbelés, des charges à porter, des filets à grimper, des sauts.',
      creer: function (el) {
        var OB = [{ n: 'Mur', f: .14, t: 'mur', i: 'spartan-mur' }, { n: 'Boue', f: .33, t: 'boue', i: 'spartan-boue' }, { n: 'Portés', f: .52, t: 'porte', i: 'spartan-portes' },
          { n: 'Filet', f: .71, t: 'filet', i: 'spartan-filet' }, { n: 'Sauts', f: .89, t: 'saut', i: 'spartan-saut' }];
        var VBW = 600, VBH = 150, D0 = 'M18 124 C 80 110, 116 138, 166 124 S 256 102, 300 116 S 384 144, 432 124 S 520 104, 584 118';
        el.innerHTML = '<div class="kca-3d kca-3d--spartan"><div class="kca-terrain">' +
          '<svg class="kca-svg" viewBox="0 0 ' + VBW + ' ' + VBH + '" focusable="false">' +
            '<g class="kca-decor">' + [[52, 84], [80, 90], [228, 78], [254, 86], [352, 84], [496, 80], [524, 88]].map(function (a) { return '<path d="M' + a[0] + ' ' + a[1] + 'l9 -18 9 18z"/>'; }).join('') + '</g>' +
            '<path class="kca-sentier" d="' + D0 + '"/><path class="kca-fait kca-fait--sentier" d="' + D0 + '"/></svg>' +
          '<div class="kca-obs3d"></div><i class="kca-point kca-point--sentier"></i></div>' +
          '<p class="kca-label"><span class="kca-label__t"></span><span class="kca-label__s"></span></p>' + mots(OB.map(function (o) { return o.n; })) + '</div>';
        var svg = el.querySelector('svg'), sentier = svg.querySelector('.kca-sentier'), fait = svg.querySelector('.kca-fait'), cour = el.querySelector('.kca-point--sentier'), deco = svg.querySelector('.kca-decor');
        var L = sentier.getTotalLength() || 600, pt = function (f) { return sentier.getPointAtLength(L * borne(f)); };
        var boite = el.querySelector('.kca-obs3d');
        boite.innerHTML = OB.map(function (o) {
          var p = pt(o.f);
          return '<span class="kca-ob3d" style="left:' + (p.x / VBW * 100).toFixed(2) + '%;top:' + (p.y / VBH * 100).toFixed(2) + '%"><i class="kca-halo"></i>' + ico3d(o.i, '', 96) + '</span>';
        }).join('');
        var obs = arr(boite.querySelectorAll('.kca-ob3d')), lab = legende(el.querySelector('.kca-label'));
        var W3 = .055;
        fait.style.strokeDasharray = L + ' ' + (L + 2);
        /* une traversée : f de 0 à 1 ; les sauts au-dessus des obstacles ; l'obstacle passé grandit un instant */
        function course(f, vu) {
          var dy = 0, actif = -1, g = 0;
          OB.forEach(function (o, k) {
            var d = (f - o.f) / W3;
            if (Math.abs(d) < 1) {
              var q = (d + 1) / 2;
              if (o.t === 'mur') dy = -40 * Math.sin(Math.PI * q); else if (o.t === 'filet') dy = -44 * (1 - Math.abs(2 * q - 1)); else if (o.t === 'saut') dy = -30 * Math.sin(Math.PI * q); else if (o.t === 'boue') dy = 2;
            }
            var gk = borne(1 - Math.abs(d) / 1.6);
            if (gk > g) { g = gk; actif = k; }
          });
          var p = pt(f);
          cour.style.left = (p.x / VBW * 100).toFixed(2) + '%'; cour.style.top = ((p.y + dy) / VBH * 100).toFixed(2) + '%'; cour.style.opacity = vu;
          fait.style.strokeDashoffset = (L * (1 - f)).toFixed(1);
          obs.forEach(function (o, k) { o.classList.toggle('is-on', k === actif && g > 0); o.classList.toggle('is-fait', f > OB[k].f); o.style.setProperty('--g', k === actif ? arrivee(g).toFixed(3) : '0'); });
          return actif;
        }
        return {
          intro: 3.3, periode: 4.8,
          tick: function (t) {
            el.style.setProperty('--kca-op', '1');
            if (t < 3.3) {
              var e = arrivee(fen(t, 0, .45));
              vis(sentier, e); vis(deco, e);
              obs.forEach(function (o, k) { var a = arrivee(fen(t, .18 + k * .08, .5 + k * .08)); o.style.opacity = a < 1 ? (a * .45).toFixed(3) : ''; o.style.translate = '0 ' + ((1 - a) * 10).toFixed(1) + 'px'; });
              /* à vitesse constante : chaque obstacle a le temps d'être lu */
              var f = fen(t, .5, 3), k = course(f, t > .45 ? 1 : 0);
              if (t < 3 && k > -1 && f > .03) { lab(OB[k].n, 'un obstacle', true); allumerMots(el, k); }
              else if (t >= 3) { lab('Course à obstacles', 'en pleine nature', true); allumerMots(el, 'tous'); }
              else { lab('Course', 'sur le sentier', false); allumerMots(el, -1); }
            } else {
              var u = t - 3.3;
              vis(sentier, 1); vis(deco, 1); obs.forEach(function (o) { o.style.opacity = ''; o.style.translate = ''; });
              if (u > 2.3 && u < 4.6) {
                var f2 = fen(u, 2.3, 4.6), k2 = course(f2, borne((u - 2.3) / .15));
                if (k2 > -1 && f2 > .03 && f2 < .97) { lab(OB[k2].n, 'un obstacle', true); allumerMots(el, k2); } else { lab('Course à obstacles', 'en pleine nature', true); allumerMots(el, 'tous'); }
              } else { course(1, 1); lab('Course à obstacles', 'en pleine nature', true); allumerMots(el, 'tous'); }
            }
          },
          figer: function () { course(1, 1); lab('Course à obstacles', 'en pleine nature', true); allumerMots(el, 'tous'); }
        };
      }
    },

    /* Boxe : les bandes (la base), la garde, puis jab et direct au sac ; au repos, un enchaînement de temps en temps. Pas de personnage. */
    boxe: {
      resume: 'La boxe, les bases : les bandes, la garde, puis les coups au sac : le jab, le direct, et les deux enchaînés.',
      creer: function (el) {
        el.innerHTML = '<div class="kca-3d kca-3d--boxe">' +
          '<span class="kca-bx kca-bx--bandes"><i class="kca-halo"></i>' + ico3d('boxe-bandes', '', 120) + '</span>' +
          '<span class="kca-bx kca-bx--sac">' + ico3d('boxe-sac', '', 150) + '</span>' +
          '<span class="kca-bx kca-bx--gants">' + ico3d('boxe-gants', '', 112) + '</span>' +
          '<p class="kca-label"><span class="kca-label__t"></span><span class="kca-label__s"></span></p>' + mots(['Bandes', 'Garde', 'Jab', 'Direct']) + '</div>';
        var scene = el.querySelector('.kca-3d'), bandes = el.querySelector('.kca-bx--bandes'), sac = el.querySelector('.kca-bx--sac'), gants = el.querySelector('.kca-bx--gants');
        var lab = legende(el.querySelector('.kca-label'));
        /* un coup : il part vite (.16 s), marque l'impact (.12 s), revient en garde (.4 s) */
        var OUT = .16, TIENT = .12, BACK = .4;
        function ext(t, d) { var u = t - d; if (u < 0 || u > OUT + TIENT + BACK) return 0; return u < OUT ? depart(u / OUT) : u < OUT + TIENT ? 1 : 1 - arrivee((u - OUT - TIENT) / BACK); }
        function frappe(t, coups, entree) {
          var reach = Math.max(0, sac.offsetLeft - gants.offsetLeft - gants.offsetWidth * .62), e = 0, low = 0, ang = 0;
          coups.forEach(function (d, i) { var x = ext(t, d); if (x > e) { e = x; low = i % 2; } var u = t - (d + OUT); if (u > 0) ang += 10 * Math.exp(-u * 2.4) * Math.sin(u * 6.2); });
          var bob = e ? 0 : Math.sin(t * 3.2) * 2;
          gants.style.transform = 'translate(' + (reach * e - (1 - entree) * 16).toFixed(1) + 'px,' + ((low ? e * 8 : -e * 4) + bob).toFixed(1) + 'px) rotate(' + (low ? e * 6 : e * -4).toFixed(2) + 'deg)';
          sac.style.transform = 'translateY(' + ((1 - entree) * -12).toFixed(1) + 'px) rotate(' + ang.toFixed(2) + 'deg)';
          return e > .5 ? (low ? 3 : 2) : -1;
        }
        return {
          intro: 3.2, periode: 3.6,
          tick: function (t) {
            el.style.setProperty('--kca-op', '1'); scene.classList.remove('is-fige');
            if (t < 3.2) {
              var b = t < .75 ? arrivee(t / .45) : 1 - depart((t - .75) / .22);
              vis(bandes, b, 'translateY(' + ((1 - borne(b)) * (t < .75 ? 12 : -10)).toFixed(1) + 'px) scale(' + (.86 + .14 * borne(b)).toFixed(3) + ')');
              var g = arrivee(fen(t, .85, 1.25));
              vis(sac, g); vis(gants, g);
              var c = frappe(t, [1.5, 2.2], g);
              if (t < .85) { lab('Les bandes', 'la base, avant tout', true); allumerMots(el, 0); }
              else if (t < 1.5) { lab('La garde', 'les gants hauts', true); allumerMots(el, 1); }
              else if (t < 2.2) { lab('Jab', 'le bras avant', true); allumerMots(el, 2); }
              else if (t < 2.85) { lab('Direct', 'le bras arrière', true); allumerMots(el, 3); }
              else { lab('Les bases', 'bandes, garde, jab, direct', true); allumerMots(el, 'tous'); }
              void c;
            } else {
              var u = t - 3.2;
              vis(bandes, 0); vis(sac, 1); vis(gants, 1);
              var a = frappe(u, [1.9, 2.25], 1);
              lab('Les bases', 'bandes, garde, jab, direct', true);
              allumerMots(el, a > -1 ? a : 'tous');
            }
          },
          figer: function () {
            el.style.setProperty('--kca-op', '1'); scene.classList.add('is-fige');
            [bandes, sac, gants].forEach(function (x) { x.style.opacity = 1; x.style.transform = ''; });
            lab('Les bases', 'bandes, garde, jab, direct', true); allumerMots(el, 'tous');
          }
        };
      }
    }
  };
  var scene = null, sceneRaf = 0, sceneT0 = 0;
  function tempsScene(s) {
    if (s.intro == null) return s.duree ? s.duree : 0;
    return function (sec) { return sec < s.intro ? sec : s.intro + ((sec - s.intro) % s.periode); };
  }
  function boucler() {
    var f = tempsScene(scene);
    var b = function (ts) {
      if (!scene) return;
      if (!sceneT0) sceneT0 = ts;
      var sec = (ts - sceneT0) / 1000;
      scene.tick(typeof f === 'function' ? f(sec) : sec % f);
      sceneRaf = requestAnimationFrame(b);
    };
    sceneRaf = requestAnimationFrame(b);
  }
  function lancerScene(c, hote) {
    arreterScene();
    var A = ANIMS[c.anim];
    hote.innerHTML = '';
    hote.hidden = !A;
    if (!A) return;
    hote.className = 'kcd-anim kca kca--' + c.anim;
    scene = A.creer(hote);
    if (reduit()) { scene.figer(); return; }
    sceneT0 = 0;
    boucler();
  }
  function arreterScene() { if (sceneRaf) cancelAnimationFrame(sceneRaf); sceneRaf = 0; scene = null; }

  /* ------------------------------------------------------------------------
     La fiche : compacte, centrée (une feuille qui monte du bas sur mobile), sur un fond flouté.
     Le titre, la date et le lieu ; la scène animée ; une ou deux phrases ; les photos en vignettes (une vignette
     cliquée s'agrandit dans la fiche) ; la vidéo ; « Fermer ».
     ------------------------------------------------------------------------ */
  var dlg = null, feuille = null, anim = null, vign = null, corps = null, zoom = null, declencheur = null, ouverte = false, tFerme = 0, zoomSrc = null;
  var FERMER = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4.8v14.4c0 .6.7 1 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1C7.7 3.8 7 4.2 7 4.8z" fill="currentColor"/></svg>';

  function creerDialogue() {
    if (dlg) return;
    dlg = D.createElement('div');
    dlg.className = 'kcd';
    dlg.hidden = true;
    dlg.setAttribute('data-lenis-prevent', '');
    dlg.innerHTML = '<div class="kcd-fond" data-kcd-fermer></div>' +
      '<div class="kcd-feuille" role="dialog" aria-modal="true" aria-labelledby="kcd-titre" aria-describedby="kcd-resume" tabindex="-1">' +
        '<div class="kcd-haut"><div class="kcd-tete"><p class="kcd-quand"></p><h2 class="kcd-titre" id="kcd-titre"></h2></div>' +
          '<button class="kcd-fermer" type="button" data-kcd-fermer>Fermer<span aria-hidden="true">' + FERMER + '</span></button></div>' +
        '<div class="kcd-scene"><div class="kcd-anim kca" aria-hidden="true"></div>' +
          '<figure class="kcd-zoom" hidden><img alt=""><button class="kcd-zoom__fermer" type="button" aria-label="Réduire la photo">' + FERMER + '</button></figure></div>' +
        '<p class="kc-sr" id="kcd-resume"></p>' +
        '<div class="kcd-corps"></div>' +
        '<ul class="kcd-vignettes" role="list"></ul>' +
        '<div class="kcd-actions"></div>' +
      '</div>';
    D.body.appendChild(dlg);
    feuille = dlg.querySelector('.kcd-feuille'); anim = dlg.querySelector('.kcd-anim'); vign = dlg.querySelector('.kcd-vignettes');
    corps = dlg.querySelector('.kcd-corps'); zoom = dlg.querySelector('.kcd-zoom');
    dlg.addEventListener('click', function (e) {
      if (e.target.closest('[data-kcd-fermer]')) { fermer(); return; }
      var v = e.target.closest('.kcd-vignette');
      if (v) { agrandir(v); return; }
      if (e.target.closest('.kcd-zoom')) reduire();
    });
    D.addEventListener('keydown', function (e) {
      if (!ouverte) return;
      if (e.key === 'Escape') { e.preventDefault(); if (!zoom.hidden) reduire(); else fermer(); return; }
      if (e.key !== 'Tab') return;
      /* le focus reste dans la fiche */
      var f = arr(feuille.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && (D.activeElement === a || D.activeElement === feuille)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }

  function remplir(c) {
    var d = c.detail || {}, ph = ((d.photos && d.photos.length ? d.photos : c.photos) || []).slice(0, 4);
    dlg.setAttribute('data-course', c.id);
    dlg.querySelector('.kcd-quand').innerHTML = ligneQuand(c, 'kcd-quand__in').replace(/^<p class="kcd-quand__in">|<\/p>$/g, '');
    dlg.querySelector('.kcd-titre').textContent = c.nom;
    dlg.querySelector('#kcd-resume').textContent = (ANIMS[c.anim] && ANIMS[c.anim].resume) || '';
    corps.innerHTML = (d.paragraphes || [c.resume]).filter(Boolean).slice(0, 2).map(function (t) { return '<p>' + fr(t) + '</p>'; }).join('');
    vign.innerHTML = ph.map(function (p) {
      return '<li><button class="kcd-vignette" type="button" style="--ar:' + ((+p.w || 4) / (+p.h || 3)).toFixed(4) + '" aria-label="Agrandir la photo : ' + esc(p.alt) + '">' +
        '<img src="' + esc(chemin(p.src)) + '" alt="" width="' + (+p.w || '') + '" height="' + (+p.h || '') + '" decoding="async" data-kc-src="' + esc(p.src) + '"' +
        (p.cadrage ? ' style="object-position:' + esc(p.cadrage) + '"' : '') + '></button></li>';
    }).join('');
    vign.hidden = !ph.length;
    dlg.querySelector('.kcd-actions').innerHTML = c.video && c.video.url ?
      '<a class="kcd-video" href="' + esc(c.video.url) + '" target="_blank" rel="noopener"><span class="kcd-play" aria-hidden="true">' + PLAY + '</span>Regarder la vidéo' +
      (c.video.duree ? '<span class="kcd-duree">' + esc(c.video.duree) + '</span>' : '') + '</a>' : '';
    zoom.hidden = true; dlg.classList.remove('is-zoom');
  }

  /* Une vignette s'agrandit dans la fiche (par-dessus la scène), jamais au-delà de la taille réelle de la photo */
  function agrandir(btn) {
    var im = btn.querySelector('img'), z = zoom.querySelector('img');
    z.src = im.src; z.alt = (btn.getAttribute('aria-label') || '').replace(/^Agrandir la photo : /, '');
    z.width = +im.getAttribute('width'); z.height = +im.getAttribute('height');
    zoom.style.setProperty('--nw', im.getAttribute('width') + 'px'); zoom.style.setProperty('--nh', im.getAttribute('height') + 'px');
    zoom.hidden = false; dlg.classList.add('is-zoom'); zoomSrc = btn;
    if (sceneRaf) { cancelAnimationFrame(sceneRaf); sceneRaf = 0; }
    if (!reduit() && z.animate) {
      z.style.transformOrigin = '0 0';
      var a = im.getBoundingClientRect(), b = z.getBoundingClientRect();
      if (a.width && b.width) z.animate([{ transform: 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + (a.width / b.width) + ',' + (a.height / b.height) + ')', opacity: .6 }, { transform: 'none', opacity: 1 }],
        { duration: 460, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'none' });
    }
    zoom.querySelector('.kcd-zoom__fermer').focus({ preventScroll: true });
  }
  function reduire() {
    if (zoom.hidden) return;
    zoom.hidden = true; dlg.classList.remove('is-zoom');
    if (scene && !reduit() && !sceneRaf) boucler();
    if (zoomSrc) zoomSrc.focus({ preventScroll: true });
  }

  function ouvrir(c, source, trigger) {
    if (!c) return;
    creerDialogue();
    clearTimeout(tFerme);
    declencheur = trigger || D.activeElement;
    remplir(c);
    H.classList.add('kcd-verrou');
    dlg.hidden = false;
    dlg.classList.remove('is-ferme');
    void dlg.offsetWidth;
    /* la photo cliquée vole jusqu'à sa vignette */
    var srcAttr = source && source.getAttribute('data-kc-src');
    var vs = arr(vign.querySelectorAll('.kcd-vignette img'));
    var cible = vs.filter(function (im) { return im.getAttribute('data-kc-src') === srcAttr; })[0] || vs[0];
    var vole = !!(source && cible && !reduit() && source.getBoundingClientRect().width > 0);
    if (vole) { dlg.classList.add('is-envol'); cible.parentNode.classList.add('is-cible'); }
    dlg.classList.add('is-ouvert');
    ouverte = true;
    lancerScene(c, anim);
    if (vole) envol(source, cible);
    setTimeout(function () { var b = dlg.querySelector('.kcd-fermer'); if (b && ouverte) b.focus({ preventScroll: true }); }, reduit() ? 30 : 200);
  }
  function envol(source, cible) {
    var a = source.getBoundingClientRect(), b = cible.getBoundingClientRect();
    var vol = source.cloneNode(false);
    vol.removeAttribute('loading'); vol.alt = '';
    vol.className = 'kcd-vol';
    vol.style.objectPosition = getComputedStyle(source).objectPosition;
    var pose = function (r) { return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }; };
    Object.assign(vol.style, pose(a));
    D.body.appendChild(vol);
    var fin = function () {
      dlg.classList.remove('is-envol');
      arr(vign.querySelectorAll('.is-cible')).forEach(function (x) { x.classList.remove('is-cible'); });
      if (vol.parentNode) vol.parentNode.removeChild(vol);
    };
    if (!vol.animate) { fin(); return; }
    var an = vol.animate([Object.assign(pose(a), { borderRadius: '6px', opacity: 1 }), Object.assign(pose(b), { borderRadius: '10px', opacity: 1 })], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    an.onfinish = fin; an.oncancel = fin;
    dlg.__vol = { an: an };
  }
  function fermer() {
    if (!ouverte) return;
    ouverte = false;
    if (dlg.__vol) { try { dlg.__vol.an.cancel(); } catch (e) {} dlg.__vol = null; }
    arreterScene();
    dlg.classList.remove('is-ouvert', 'is-envol', 'is-zoom');
    dlg.classList.add('is-ferme');
    tFerme = setTimeout(function () {
      dlg.hidden = true;
      dlg.classList.remove('is-ferme');
      H.classList.remove('kcd-verrou');
      anim.innerHTML = ''; vign.innerHTML = ''; corps.innerHTML = '';
    }, reduit() ? 120 : 220);
    if (declencheur && declencheur.focus) { try { declencheur.focus({ preventScroll: true }); } catch (e) {} }
  }

  /* ------------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------------ */
  function tout() {
    arr(D.querySelectorAll('[data-kz-courses]')).forEach(rendre);
    try { D.dispatchEvent(new CustomEvent('kz-courses:pret', { detail: { boites: boites.length } })); } catch (e) {}
  }
  ecouter(MQ_RM, function () { boites.forEach(rendre); });
  D.addEventListener('kz-theme:change', function () { setTimeout(function () { boites.forEach(poserFond); }, 460); });
  W.addEventListener('load', function () { boites.forEach(poserFond); if (W.ScrollTrigger) W.ScrollTrigger.refresh(); });

  W.KzCourses = {
    donnees: COURSES,
    rendre: rendre,
    ajouter: function (c) { if (c && c.id) { COURSES.push(c); boites.forEach(rendre); } return W.KzCourses; },
    ouvrir: function (id) { var c = trouver(id), art = D.querySelector('.kc-course[data-course="' + id + '"]'); ouvrir(c, art && art.querySelector('.kc-cadre--a img'), art && art.querySelector('[data-kc-voir]')); },
    fermer: function () { fermer(); }
  };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout); else tout();
})();
