/* ==========================================================================
   Module « apps » : choisis une app (BRIEF-V5.md)

   Contrat :
     <head>  <link rel="stylesheet" href="shared/apps.css">
     </body> GSAP 3.12.5 (facultatif), puis <script src="shared/apps.js" defer></script>
     <section id="apps" class="kz-apps" data-kz-apps data-theme="dark" aria-label="Mes apps"></section>

   Attributs facultatifs de la section :
     data-theme="dark|light"   thème (défaut : dark)
     data-titre="…"            titre de la signature (défaut « Mes apps ») ; data-titre="" : pas de signature
     data-href="app.html"      page projet ; le lien devient app.html#<slug>
     data-auto="off"           pas de défilement automatique

   Le script remplit la section (signature de Kenz, domaine, téléphone, dock), pose --kz-app
   (couleur de l'app, animée) et data-app="<slug>",
   et émet sur la section :
     « kz-apps:pret »    detail { slug }
     « kz-apps:change »  detail { slug, nom, couleur, index, auto }
   API : section.kzApps.choisir('wado') · .suivant() · .precedent()  ·  window.KzApps.init(section)

   Transition (clic, survol prolongé, clavier, défilement automatique × 1,25) : l'icône s'enfonce
   (90 ms) puis se soulève, le trait glisse sous elle (320 ms), le domaine sort (160 ms) et entre
   mot par mot (380 ms), la teinte suit (350 ms) ; l'icône vole du dock jusqu'à l'écran et s'y ouvre
   (480 ms, cubic-bezier(.2,.8,.2,1)), puis l'animation de l'app enchaîne. Tout est interruptible.
   Glisser sur le téléphone : l'écran suit le doigt, l'app voisine entre par le bord (seuil 25 %).
   Sans GSAP : écrans finaux et minuteries. Mouvement réduit : fondus de 200 ms, pas de défilement
   automatique.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KzApps && window.KzApps.pret) return;

  var D = document, W = window;
  var SCRIPT = D.currentScript;
  var SRC = (SCRIPT && SCRIPT.src) || '';
  function chemin(rel) { try { return new URL(rel, SRC || location.href).href; } catch (e) { return rel; } }
  var ASSETS = chemin('../assets/apps/');
  var PORTRAIT = chemin('../assets/img/kenz-pro.webp');
  var icone = function (s) { return ASSETS + s + '-icone.jpg'; };
  var ecranDe = function (s) { return ASSETS + s + '-ecran-1.jpg'; };

  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function gsapOk() { return (W.gsap && typeof W.gsap.timeline === 'function') ? W.gsap : null; }
  var EXPO = 'cubic-bezier(.16,1,.3,1)', SORT = 'cubic-bezier(.55,0,.75,.2)';
  var UID = 0;

  /* ------------------------------------------------------------------------
     Les apps (ordre d'arrivée : Oshii, Wado, Sago, Croc, Miru, Zenko)
     ------------------------------------------------------------------------ */
  var AS = 'https://apps.apple.com/';
  var APPS = [
    { slug: 'oshii', nom: 'Oshii', domaine: 'Cuisine', couleur: '#E5483B',
      ligne: 'Ta vidéo TikTok devient une vraie recette.',
      store: AS + 'fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905', capture: true, depuis: 'novembre 2025', aussi: 'et sur Google Play',
      alt: 'Animation : une vidéo de recette, « pâtes crémeuses au citron », est partagée à Oshii. Elle se replie dans l’icône et devient une fiche pesée : pâtes 200 g, parmesan 40 g, citron 1, crème 10 cl. Puis un écran de l’app.' },
    { slug: 'wado', nom: 'Wado', domaine: 'Sport & nutrition', domaineHtml: 'Sport <em>&amp;</em> nutrition', couleur: '#2F7A55',
      ligne: 'Une photo de ton plat, et ton plan s’ajuste.',
      store: AS + 'us/app/wado-calories-ia-muscu/id6813179120', capture: false, depuis: 'octobre 2026',
      alt: 'Animation : une assiette est prise en photo et scannée. Les macros montent : protéines 38 g, glucides 62 g, lipides 14 g, environ 520 kcal, et l’anneau « Ta journée » se remplit. Données d’exemple.' },
    { slug: 'sago', nom: 'Sago', domaine: 'Japonais', couleur: '#5B4BC4',
      ligne: 'Le japonais, par l’image, épisode par épisode.',
      store: AS + 'fr/app/sago-apprendre-le-japonais/id6759610780', capture: true, depuis: 'avril 2026',
      alt: 'Animation : la phrase japonaise « ねこ が すき », d’abord floue. Un chat se dessine au-dessus de ねこ, un cœur au-dessus de すき, et la traduction apparaît : « J’aime les chats. » Puis un écran de l’app.' },
    { slug: 'croc', nom: 'Croc', domaine: 'Bonnes habitudes', couleur: '#8E7CF0',
      ligne: 'Un petit pacte par jour pour arrêter de te ronger les ongles.',
      store: AS + 'app/croc-stop-ongles-rong%C3%A9s/id6801541157', capture: false, depuis: 'septembre 2026',
      alt: 'Animation : le matin, « Je m’engage » se coche, le soir « Tenu ». Les jours de la semaine se cochent un à un et la série monte jusqu’à 12 jours. Données d’exemple.' },
    { slug: 'miru', nom: 'Miru', domaine: 'Jeux entre amis', couleur: '#4B5FD6',
      ligne: 'Un thème, et le jeu se crée en direct.',
      store: AS + 'us/app/miru-jeux-entre-amis/id6761622088', capture: true, depuis: 'avril 2026',
      alt: 'Animation : le thème « Les films des années 2000 » s’écrit. Des cartes se battent puis se distribuent à cinq joueurs en cercle, et un téléphone passe de main en main. Puis un écran de l’app.' },
    { slug: 'zenko', nom: 'Zenko', domaine: 'Idées de journée', couleur: '#A0613A',
      ligne: 'Ta journée composée selon tes envies et ton budget.',
      store: AS + 'ch/app/zenko/id6753706200', capture: true, depuis: 'octobre 2025',
      alt: 'Animation : le curseur du budget glisse de 40 € à 25 €, et le matin, l’après-midi et le soir se recomposent avec des activités moins chères. Données d’exemple. Puis un écran de l’app.' }
  ];

  /* ------------------------------------------------------------------------
     Petits dessins
     ------------------------------------------------------------------------ */
  var I = {
    droite: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5"/></svg>',
    sortie: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>',
    reseau: '<svg viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>',
    wifi: '<svg viewBox="0 0 16 12" fill="currentColor" aria-hidden="true"><path d="M8 11.6 5.7 9.3a3.3 3.3 0 0 1 4.6 0z"/><path d="M8 5.7c1.7 0 3.2.7 4.4 1.8l-1.3 1.3A4.4 4.4 0 0 0 8 7.5c-1.2 0-2.3.5-3.1 1.3L3.6 7.5A6.2 6.2 0 0 1 8 5.7z"/><path d="M8 1.8c2.8 0 5.3 1.1 7.2 2.9l-1.3 1.3A8.4 8.4 0 0 0 8 3.6 8.4 8.4 0 0 0 2.1 6L.8 4.7A10.2 10.2 0 0 1 8 1.8z"/></svg>',
    pile: '<svg viewBox="0 0 27 12" aria-hidden="true"><rect x=".6" y=".6" width="22" height="10.8" rx="3.3" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.1"/><rect x="2.3" y="2.3" width="18.6" height="7.4" rx="1.9" fill="currentColor"/><path d="M24.4 4.1v3.8c.8-.3 1.3-1 1.3-1.9s-.5-1.6-1.3-1.9z" fill="currentColor" fill-opacity=".45"/></svg>',
    coeur: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    bulle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c4.7 0 8 2.9 8 6.6s-3.3 6.6-8 6.6c-.9 0-1.8-.1-2.6-.3L5 19l1-3.6C4.8 14.2 4 12.5 4 10.6 4 6.9 7.3 4 12 4z"/></svg>',
    partage: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 6.5-7 6.5v-4c-4.5 0-7 1.3-9 4.5.5-5 3-8.5 9-9.3V5z"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
    coche: '<span class="chk"><i></i><svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M7 12.5l3.2 3.2L17 9"/></svg></span>'
  };

  function plat(u, cls, vb) {
    return '<svg class="' + cls + '" viewBox="' + (vb || '0 0 90 160') + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="kzT' + u + '" cx="50%" cy="40%" r="72%"><stop offset="0" stop-color="#6A4E3A"/><stop offset="1" stop-color="#1F1712"/></radialGradient>' +
      '<radialGradient id="kzS' + u + '" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#FCEBC0"/><stop offset="1" stop-color="#E4BC6E"/></radialGradient></defs>' +
      '<rect width="90" height="160" fill="url(#kzT' + u + ')"/>' +
      '<ellipse cx="46" cy="71" rx="40" ry="37" fill="#140F0B" opacity=".45"/>' +
      '<circle cx="45" cy="66" r="37" fill="#EDE5D8"/><circle cx="45" cy="66" r="29" fill="#F8F3EB"/><circle cx="45" cy="66" r="24" fill="url(#kzS' + u + ')"/>' +
      '<g fill="none" stroke="#F7DC94" stroke-width="2.4" stroke-linecap="round"><path d="M28 60c6-8 16-8 20 0s12 10 18 2"/><path d="M26 70c8-6 14 4 22-2s14-8 18 0"/><path d="M32 78c6-4 12 4 18-1s10-5 14 1"/><path d="M34 52c4-4 10-4 14 0s10 4 12 1"/></g>' +
      '<g fill="none" stroke="#D8AA58" stroke-width="1.3" stroke-linecap="round" opacity=".85"><path d="M30 65c5-5 11 3 17-1s11-4 15 1"/><path d="M33 74c5-3 9 2 14 0"/></g>' +
      '<g transform="translate(60 53)"><circle r="8.5" fill="#F2CF3A"/><circle r="7" fill="#FBE68A"/><path d="M0 0V-7M0 0L6-3.5M0 0L6 3.5M0 0V7M0 0L-6 3.5M0 0L-6-3.5" stroke="#F2CF3A" stroke-width=".9"/></g>' +
      '<ellipse cx="33" cy="58" rx="5.4" ry="2.6" fill="#5C8F45" transform="rotate(-35 33 58)"/><ellipse cx="38" cy="54.5" rx="4.4" ry="2.2" fill="#76A85A" transform="rotate(20 38 54.5)"/>' +
      '<g fill="#FFF8E6"><circle cx="44" cy="64" r=".9"/><circle cx="50" cy="70" r=".8"/><circle cx="40" cy="72" r=".8"/><circle cx="52" cy="60" r=".9"/><circle cx="47" cy="77" r=".7"/></g>' +
      '<path d="M80 98L66 132" stroke="#B9B2A6" stroke-width="2.6" stroke-linecap="round"/></svg>';
  }

  /* Miru : cinq joueurs en cercle (rayon 34 cqw), cartes et téléphone vers eux */
  var MR_A = [[0, -34], [32.3, -10.5], [20, 27.5], [-20, 27.5], [-32.3, -10.5]];
  var MR_ROT = [-6, 10, 14, -12, -9];
  var MR_AV = [
    '<circle cx="20" cy="20" r="20" fill="#FFB86B"/><path d="M5 17c2-8 8-13 15-13s13 5 15 13c-5-3-9-4-15-4S10 14 5 17z" fill="#7A4A1E" opacity=".55"/><circle cx="15" cy="21" r="1.8" fill="#2A1C3D"/><circle cx="25" cy="21" r="1.8" fill="#2A1C3D"/><path d="M15.5 27q4.5 3.5 9 0" stroke="#2A1C3D" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    '<circle cx="20" cy="20" r="20" fill="#7FD1C7"/><path d="M6 15c3-7 8-11 14-11 7 0 12 5 14 12-6-4-10-1-14-5-4 4-9 2-14 4z" fill="#1F4F4A" opacity=".55"/><circle cx="15" cy="21" r="1.8" fill="#16302E"/><circle cx="25" cy="21" r="1.8" fill="#16302E"/><path d="M16 27h8" stroke="#16302E" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    '<circle cx="20" cy="20" r="20" fill="#B9A5FF"/><path d="M4 22c0-11 7-18 16-18s16 7 16 18c-3-5-8-8-16-8S7 17 4 22z" fill="#3B2A7A" opacity=".5"/><circle cx="15" cy="22" r="1.8" fill="#221A45"/><circle cx="25" cy="22" r="1.8" fill="#221A45"/><path d="M15.5 28q4.5 3.5 9 0" stroke="#221A45" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    '<circle cx="20" cy="20" r="20" fill="#FFA493"/><path d="M8 13c3-6 7-9 12-9s9 3 12 9c-4-2-8-2-12-2s-8 0-12 2z" fill="#6B2A22" opacity=".5"/><circle cx="15" cy="21" r="1.8" fill="#3A1A16"/><circle cx="25" cy="21" r="1.8" fill="#3A1A16"/><path d="M15.5 26.5q4.5 4 9 0" stroke="#3A1A16" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    '<circle cx="20" cy="20" r="20" fill="#8EC5FF"/><path d="M5 18c1-9 7-14 15-14s14 5 15 14c-4-4-8-6-15-6S9 14 5 18z" fill="#1E3F66" opacity=".5"/><circle cx="15" cy="21" r="1.8" fill="#14263D"/><circle cx="25" cy="21" r="1.8" fill="#14263D"/><path d="M15.5 27q4.5 3 9 0" stroke="#14263D" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  ];

  /* ------------------------------------------------------------------------
     Les six écrans : markup (état final) et animation (état de départ -> final)
     ------------------------------------------------------------------------ */
  function arr(n) { return Array.prototype.slice.call(n); }
  function sel(el) { return { q: function (s) { return arr(el.querySelectorAll(s)); }, q1: function (s) { return el.querySelector(s); } }; }

  var SC = {
    oshii: {
      html: function (u) {
        var autres = '<span class="kzs-os-app"><i></i><b></b></span>';
        return '<div class="kzs-os-video">' + plat(u + 'v', 'kzs-os-food') +
            '<span class="kzs-os-rail">' + I.coeur + I.bulle + I.partage + '</span>' +
            '<p class="kzs-os-cap">pâtes crémeuses au citron</p><span class="kzs-os-bar"><i></i></span></div>' +
          '<div class="kzs-os-sheet"><p class="kzs-os-sheet__t">Partager vers</p><div class="kzs-os-row">' +
            '<span class="kzs-os-app kzs-os-app--on"><img src="' + icone('oshii') + '" alt="" draggable="false"><span>Oshii</span><span class="kzs-os-tap"></span></span>' + autres + autres + autres + '</div></div>' +
          '<div class="kzs-os-recipe"><div class="kzs-os-photo">' + plat(u + 'p', 'kzs-os-ph', '4 30 82 72') + '</div>' +
            '<div class="kzs-os-body"><div class="kzs-os-head"><img src="' + icone('oshii') + '" alt="" draggable="false"><p>Pâtes crémeuses au citron</p></div>' +
            '<ul class="kzs-os-ing">' +
              '<li><span>Pâtes</span><b class="slit"><span class="num">200 g</span></b></li>' +
              '<li><span>Parmesan</span><b class="slit"><span class="num">40 g</span></b></li>' +
              '<li><span>Citron</span><b class="slit"><span class="num">1</span></b></li>' +
              '<li><span>Crème</span><b class="slit"><span class="num">10 cl</span></b></li></ul>' +
            '<p class="kzs-os-steps"><span>4 étapes</span>' + I.chevron + '</p></div></div>' +
          '<span class="kzs-ex">exemple</span>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var v = $.q1('.kzs-os-video'), bar = $.q1('.kzs-os-bar i'), sheet = $.q1('.kzs-os-sheet'), tap = $.q1('.kzs-os-tap'), ico = $.q1('.kzs-os-app--on img');
        var rec = $.q1('.kzs-os-recipe'), ph = $.q1('.kzs-os-ph'), head = $.q1('.kzs-os-head'), lis = $.q('.kzs-os-ing li'), nums = $.q('.kzs-os-ing .num'), steps = $.q1('.kzs-os-steps');
        g.set(v, { opacity: 1, scale: 1, filter: 'blur(0px)' });
        g.set(bar, { scaleX: 0 });
        g.set(sheet, { y: 0, yPercent: 105 });
        g.set(tap, { opacity: 0, scale: .5 });
        g.set(rec, { opacity: 0, y: 30, scale: .94, clipPath: 'inset(0% 0% 100% 0%)' });
        g.set(ph, { scale: 1.18, transformOrigin: '50% 50%' });
        g.set([head, steps].concat(lis), { opacity: 0, y: 10, filter: 'blur(4px)' });
        g.set(nums, { yPercent: 110 });
        return g.timeline({ defaults: { ease: 'expo.out' } })
          .to(bar, { scaleX: .62, duration: 1.45, ease: 'none' }, 0)
          .to(sheet, { yPercent: 0, duration: .8 }, .5)
          .to(tap, { opacity: .9, scale: 1, duration: .25, ease: 'power2.out' }, 1.25)
          .to(ico, { scale: .9, duration: .12, ease: 'power2.out' }, 1.25)
          .to(ico, { scale: 1, duration: .5 }, 1.37)
          .to(tap, { opacity: 0, scale: 1.3, duration: .4, ease: 'power2.out' }, 1.5)
          .to(v, { scale: .06, opacity: 0, filter: 'blur(8px)', duration: .62, ease: 'power3.in' }, 1.55)
          .to(sheet, { yPercent: 105, duration: .32, ease: 'power2.in' }, 2.2)
          .to(rec, { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 2.35)
          .to(ph, { scale: 1, duration: 1.5 }, 2.35)
          .to(head, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 2.45)
          .to(lis, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7, stagger: .13 }, 2.58)
          .to(nums, { yPercent: 0, duration: .9, stagger: .13 }, 2.66)
          .to(steps, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 3.35);
      }
    },

    wado: {
      html: function () {
        return '<div class="kzs-wd-view"><svg class="kzs-wd-food" viewBox="0 0 200 200" aria-hidden="true">' +
            '<circle cx="100" cy="106" r="95" fill="#04100A" opacity=".5"/><circle cx="100" cy="100" r="94" fill="#E6E0D2"/><circle cx="100" cy="100" r="78" fill="#F4F0E6"/>' +
            '<path d="M44 104C40 80 62 64 84 68c20 4 26 26 18 44-8 18-50 18-58-8z" fill="#FFFDF7"/>' +
            '<g fill="#E8E1D0"><ellipse cx="62" cy="88" rx="3" ry="1.4" transform="rotate(-20 62 88)"/><ellipse cx="74" cy="96" rx="3" ry="1.4" transform="rotate(30 74 96)"/><ellipse cx="58" cy="104" rx="3" ry="1.4" transform="rotate(10 58 104)"/><ellipse cx="84" cy="84" rx="3" ry="1.4" transform="rotate(-40 84 84)"/><ellipse cx="70" cy="112" rx="3" ry="1.4" transform="rotate(-10 70 112)"/></g>' +
            '<g transform="rotate(-14 134 84)"><rect x="104" y="68" width="60" height="34" rx="15" fill="#F28E6C"/><path d="M118 72c4 8 4 18 0 26M132 70c4 9 4 21 0 30M146 71c4 9 4 20 0 29" stroke="#FFC4AA" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/></g>' +
            '<circle cx="122" cy="132" r="15" fill="#4E9C5C"/><circle cx="142" cy="124" r="12" fill="#68B46C"/><circle cx="134" cy="147" r="11" fill="#3F8A4E"/><circle cx="153" cy="141" r="9" fill="#5BAA60"/>' +
            '<g transform="rotate(-24 80 146)"><ellipse cx="80" cy="146" rx="22" ry="12" fill="#BFD776"/><ellipse cx="80" cy="146" rx="15" ry="7.5" fill="#E7EFAE"/></g>' +
            '<g fill="#2B2B2B" opacity=".5"><ellipse cx="122" cy="80" rx="1.6" ry=".8"/><ellipse cx="138" cy="86" rx="1.6" ry=".8" transform="rotate(30 138 86)"/><ellipse cx="150" cy="78" rx="1.6" ry=".8"/></g></svg>' +
            '<span class="kzs-wd-scan"><span class="kzs-wd-sweep"></span></span>' +
            '<i class="kzs-wd-br kzs-wd-br--a"></i><i class="kzs-wd-br kzs-wd-br--b"></i><i class="kzs-wd-br kzs-wd-br--c"></i><i class="kzs-wd-br kzs-wd-br--d"></i></div>' +
          '<span class="kzs-wd-shutter"></span>' +
          '<div class="kzs-wd-sheet"><ul class="kzs-wd-pills">' +
            '<li><span>Protéines</span><b class="slit"><span class="num">38 g</span></b></li>' +
            '<li><span>Glucides</span><b class="slit"><span class="num">62 g</span></b></li>' +
            '<li><span>Lipides</span><b class="slit"><span class="num">14 g</span></b></li>' +
            '<li class="kzs-wd-k"><b class="slit"><span class="num">≈ 520 <small>kcal</small></span></b></li></ul>' +
            '<div class="kzs-wd-ring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="kzs-wd-ring__bg" cx="22" cy="22" r="18"/><circle class="kzs-wd-ring__fg" cx="22" cy="22" r="18" pathLength="1"/></svg><span>Ta journée</span></div></div>' +
          '<span class="kzs-wd-flash"></span><span class="kzs-ex">exemple</span>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var view = $.q1('.kzs-wd-view'), br = $.q('.kzs-wd-br'), sw = $.q1('.kzs-wd-sweep'), sh = $.q1('.kzs-wd-shutter'), fl = $.q1('.kzs-wd-flash');
        var sheet = $.q1('.kzs-wd-sheet'), pills = $.q('.kzs-wd-pills li'), nums = $.q('.kzs-wd-pills .num'), fg = $.q1('.kzs-wd-ring__fg');
        g.set(view, { scale: 1.05 });
        g.set(br, { opacity: 0, xPercent: function (i) { return [-45, 45, -45, 45][i]; }, yPercent: function (i) { return [-45, -45, 45, 45][i]; } });
        g.set(sw, { y: 0, yPercent: -100, opacity: 1 });
        g.set(sh, { opacity: 1, scale: 1 });
        g.set(fl, { opacity: 0 });
        g.set(sheet, { y: 0, yPercent: 125, opacity: 0 });
        g.set(pills, { opacity: 0, y: 12, scale: .965 });
        g.set(nums, { yPercent: 110 });
        g.set(fg, { strokeDashoffset: .7 });
        return g.timeline({ defaults: { ease: 'expo.out' } })
          .to(view, { scale: 1, duration: 1.3 }, 0)
          .to(br, { opacity: 1, xPercent: 0, yPercent: 0, duration: .8, stagger: .04 }, .1)
          .to(sh, { scale: .86, duration: .14, ease: 'power2.out' }, .72)
          .to(sh, { scale: 1, duration: .5 }, .86)
          .fromTo(fl, { opacity: .5 }, { opacity: 0, duration: .6, ease: 'power2.out', immediateRender: false }, .8)
          .to(sw, { yPercent: 0, duration: 1.05, ease: 'power2.inOut' }, .92)
          .to(sw, { opacity: 0, duration: .35, ease: 'power2.out' }, 1.97)
          .to(br, { opacity: .35, duration: .5 }, 2)
          .to(sh, { opacity: 0, duration: .3, ease: 'power2.out' }, 1.97)
          .to(sheet, { yPercent: 0, opacity: 1, duration: 1 }, 1.97)
          .to(pills, { opacity: 1, y: 0, scale: 1, duration: .9, stagger: .1 }, 2.12)
          .to(nums, { yPercent: 0, duration: 1, stagger: .1 }, 2.22)
          .to(fg, { strokeDashoffset: .24, duration: 1.3, ease: 'power2.out' }, 2.6);
      }
    },

    sago: {
      html: function () {
        return '<div class="kzs-col"><p class="kzs-sg-line" lang="ja">' +
            '<span class="kzs-sg-w"><svg class="kzs-sg-draw kzs-sg-cat" viewBox="0 0 80 64" aria-hidden="true"><path pathLength="1" d="M14 56C8 44 10 30 16 22L14 6l14 10c7-3 17-3 24 0L66 6l-2 16c6 8 8 22 2 34-10 6-42 6-52 0z"/><path pathLength="1" d="M30 35v4M50 35v4"/><path pathLength="1" d="M37 44l3 2.4 3-2.4"/><path pathLength="1" d="M5 41l17 2.5M5 48l17-1M75 41l-17 2.5M75 48l-17-1"/></svg><span class="kzs-sg-k">ねこ</span></span>' +
            '<span class="kzs-sg-w"><span class="kzs-sg-k">が</span></span>' +
            '<span class="kzs-sg-w"><svg class="kzs-sg-draw kzs-sg-heart" viewBox="0 0 80 64" aria-hidden="true"><path pathLength="1" d="M40 58C18 44 8 34 8 22 8 13 15 7 23 7c8 0 14 5 17 11 3-6 9-11 17-11 8 0 15 6 15 15 0 12-10 22-32 36z"/></svg><span class="kzs-sg-k">すき</span></span>' +
          '</p><span class="kzs-sg-rule"></span>' +
          '<p class="kzs-sg-fr"><span class="kzs-sg-fw">J’aime</span> <span class="kzs-sg-fw">les</span> <span class="kzs-sg-fw">chats.</span></p></div>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var ks = $.q('.kzs-sg-k'), cat = $.q('.kzs-sg-cat path'), heart = $.q('.kzs-sg-heart path'), fw = $.q('.kzs-sg-fw'), rule = $.q1('.kzs-sg-rule');
        g.set(ks, { opacity: .55, filter: 'blur(7px)' });
        g.set(cat.concat(heart), { strokeDasharray: 1, strokeDashoffset: 1 });
        g.set(fw, { opacity: 0, filter: 'blur(8px)', y: 6 });
        g.set(rule, { scaleX: 0 });
        return g.timeline({ defaults: { ease: 'expo.out' } })
          .to(cat[0], { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .05)
          .to([cat[1], cat[2]], { strokeDashoffset: 0, duration: .35, ease: 'power2.out', stagger: .1 }, .8)
          .to(cat[3], { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, 1)
          .to(ks[0], { opacity: 1, filter: 'blur(0px)', duration: .9 }, .75)
          .to(heart, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, 1.2)
          .to(ks[2], { opacity: 1, filter: 'blur(0px)', duration: .9 }, 1.8)
          .to(ks[1], { opacity: 1, filter: 'blur(0px)', duration: .9 }, 1.95)
          .to(rule, { scaleX: 1, duration: .9 }, 2.1)
          .to(fw, { opacity: 1, filter: 'blur(0px)', y: 0, duration: .8, stagger: .07 }, 2.25)
          .to({}, { duration: .5 }, 3.05);
      }
    },

    croc: {
      html: function (u) {
        var jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (j) { return '<li>' + I.coche + j + '</li>'; }).join('');
        var roll = [5, 6, 7, 8, 9, 10, 11, 12].map(function (n) { return '<b>' + n + '</b>'; }).join('');
        return '<div class="kzs-col"><div class="kzs-cr-top">' +
            '<svg class="kzs-cr-mascot" viewBox="0 0 60 60" aria-hidden="true"><defs><radialGradient id="kzC' + u + '" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#CDBFFF"/><stop offset="1" stop-color="#7F69E6"/></radialGradient></defs>' +
              '<path d="M30 6C40 6 46 16 49 28c4 14 1 26-19 26S7 42 11 28C14 16 20 6 30 6z" fill="url(#kzC' + u + ')"/>' +
              '<ellipse cx="19.5" cy="38.5" rx="2.8" ry="1.5" fill="#F4A6C8" opacity=".55"/><ellipse cx="40.5" cy="38.5" rx="2.8" ry="1.5" fill="#F4A6C8" opacity=".55"/>' +
              '<circle cx="24" cy="33" r="2" fill="#1C1733"/><circle cx="36" cy="33" r="2" fill="#1C1733"/>' +
              '<path class="kzs-cr-m1" d="M27 40.5h6" stroke="#1C1733" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0"/>' +
              '<path class="kzs-cr-m2" d="M26 39.5q4 4 8 0" stroke="#1C1733" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>' +
            '<div class="kzs-cr-streak"><span class="kzs-cr-streak__l">Série</span><span class="kzs-cr-streak__v"><span class="roll-w"><span class="roll kzs-cr-roll">' + roll + '</span></span><span class="kzs-cr-streak__u">jours</span></span></div></div>' +
          '<div class="kzs-cr-pact"><div class="kzs-cr-pill">' + I.coche + '<div><small>Matin</small><span>Je m’engage</span></div></div>' +
            '<div class="kzs-cr-pill">' + I.coche + '<div><small>Soir</small><span>Tenu</span></div></div></div>' +
          '<ol class="kzs-cr-week">' + jours + '</ol>' +
          '<p class="kzs-cr-bravo">Cette série tient. Bravo.</p></div><span class="kzs-ex">exemple</span>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var pills = $.q('.kzs-cr-pact .chk'), days = $.q('.kzs-cr-week .chk'), roll = $.q1('.kzs-cr-roll'), m1 = $.q1('.kzs-cr-m1'), m2 = $.q1('.kzs-cr-m2'), bravo = $.q1('.kzs-cr-bravo');
        var all = pills.concat(days);
        var fill = function (c) { return c.querySelector('i'); }, mark = function (c) { return c.querySelector('path'); };
        g.set(all.map(fill), { scale: 0, opacity: 0 });
        g.set(all.map(mark), { strokeDashoffset: 1 });
        g.set(roll, { y: 0, yPercent: 0 });
        g.set(m1, { opacity: 1 });
        g.set(m2, { opacity: 0 });
        g.set(bravo, { opacity: 0, y: 10, filter: 'blur(6px)' });
        var tl = g.timeline({ defaults: { ease: 'expo.out' } });
        var coche = function (c, t, d) {
          d = d || .6;
          tl.to(fill(c), { scale: 1, opacity: 1, duration: d }, t).to(mark(c), { strokeDashoffset: 0, duration: d * .8, ease: 'power2.out' }, t + .12);
        };
        coche(pills[0], .3);
        coche(pills[1], .85);
        coche(days[0], 1.3);
        tl.to(roll, { yPercent: -12.5, duration: .5 }, 1.35);
        for (var k = 1; k < 7; k++) {
          var t = 1.55 + k * .2;
          coche(days[k], t, .45);
          tl.to(roll, { yPercent: -12.5 * (k + 1), duration: .45 }, t + .05);
        }
        tl.to(m1, { opacity: 0, duration: .2 }, 3).to(m2, { opacity: 1, duration: .3 }, 3)
          .to(bravo, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, 3.05);
        return tl;
      }
    },

    miru: {
      html: function () {
        var cartes = '', avs = '';
        MR_A.forEach(function (p, i) {
          var st = '--x:' + p[0] + ';--y:' + p[1];
          cartes += '<span class="kzs-mr-card" style="' + st + ';--r:' + MR_ROT[i] + 'deg"></span>';
          avs += '<span class="kzs-mr-av kzs-mr-av--' + i + '" style="' + st + '"><svg viewBox="0 0 40 40" aria-hidden="true">' + MR_AV[i] + '</svg><i class="kzs-mr-hi"></i></span>';
        });
        return '<div class="kzs-col"><div class="kzs-mr-field"><span class="kzs-mr-field__l">Thème</span><span class="kzs-mr-type"><span class="kzs-mr-txt">Les films des années 2000</span><i class="kzs-mr-caret"></i></span></div>' +
          '<div class="kzs-mr-ring">' + cartes + avs + '<span class="kzs-mr-phone"><i></i></span></div></div><span class="kzs-ex">exemple</span>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var txt = $.q1('.kzs-mr-txt');
        var t0 = txt.textContent;
        txt.textContent = '';
        Array.prototype.forEach.call(t0, function (ch) { var s = D.createElement('span'); s.className = 'kzs-mr-ch'; s.textContent = ch; txt.appendChild(s); });
        var chs = $.q('.kzs-mr-ch'), caret = $.q1('.kzs-mr-caret'), cards = $.q('.kzs-mr-card'), avs = $.q('.kzs-mr-av'), his = $.q('.kzs-mr-hi'), phone = $.q1('.kzs-mr-phone');
        var cx = function (i) { return MR_A[i][0] * .58 / 13 * 100; }, cy = function (i) { return MR_A[i][1] * .58 / 17 * 100; };
        g.set(chs, { display: 'none' });
        g.set(caret, { opacity: 1 });
        g.set(cards, { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 0 });
        g.set(avs, { opacity: .35, scale: .9 });
        g.set(his, { opacity: 0 });
        g.set(phone, { x: 0, y: 0, xPercent: 0, yPercent: 0, opacity: 0, scale: .8 });
        var tl = g.timeline({ defaults: { ease: 'expo.out' } })
          .to(chs, { display: 'inline', duration: 0, stagger: .034 }, .15)
          .to(avs, { opacity: 1, scale: 1, duration: .8, stagger: .06 }, .25)
          .to(caret, { opacity: 0, duration: .2 }, 1.1)
          .to(cards, { opacity: 1, duration: .3, stagger: .03 }, 1.1)
          .to(cards, { xPercent: function (i) { return i % 2 ? 58 : -58; }, rotation: function (i) { return i % 2 ? 8 : -8; }, duration: .28, ease: 'power2.out' }, 1.3)
          .to(cards, { xPercent: 0, rotation: function (i) { return (i - 2) * 2; }, yPercent: function (i) { return -i * 4; }, duration: .32, ease: 'power3.inOut', stagger: .03 }, 1.6)
          .to(cards, { xPercent: cx, yPercent: cy, rotation: function (i) { return MR_ROT[i]; }, scale: .75, duration: .7, stagger: .09 }, 2)
          .to(phone, { opacity: 1, scale: 1, duration: .5 }, 2.6);
        [0, 1, 2].forEach(function (k) {
          var t = 2.85 + k * .36;
          tl.to(phone, { xPercent: MR_A[k][0] * .57 / 10 * 100, yPercent: MR_A[k][1] * .57 / 17.5 * 100, duration: .4, ease: 'power3.inOut' }, t)
            .to(his[k], { opacity: 1, duration: .3 }, t + .28);
          if (k > 0) tl.to(his[k - 1], { opacity: 0, duration: .2 }, t + .1);
        });
        return tl;
      }
    },

    zenko: {
      html: function () {
        var vals = '';
        for (var v = 40; v >= 25; v--) vals += '<b>' + v + '</b>';
        var carte = function (c1, c2, quand, a1, a2) {
          return '<li class="kzs-zk-card" style="--c1:' + c1 + ';--c2:' + c2 + '"><span class="kzs-zk-act">' +
            '<svg class="kzs-zk-a kzs-zk-a--1" viewBox="0 0 24 24" aria-hidden="true"><path d="' + a1 + '"/></svg>' +
            '<svg class="kzs-zk-a kzs-zk-a--2" viewBox="0 0 24 24" aria-hidden="true"><path d="' + a2 + '"/></svg></span>' +
            '<span class="kzs-zk-txt"><span class="kzs-zk-when">' + quand + '</span><span class="kzs-zk-cost"><i></i></span></span></li>';
        };
        return '<div class="kzs-col"><div class="kzs-zk-budget">' +
            '<div class="kzs-zk-head"><span class="kzs-zk-l">Budget</span><span class="kzs-zk-v"><span class="roll-w"><span class="roll kzs-zk-roll">' + vals + '</span></span><small>€</small></span></div>' +
            '<div class="kzs-zk-track"><i class="kzs-zk-fill"></i><span class="kzs-zk-knobwrap"><i class="kzs-zk-knob"></i></span></div>' +
            '<div class="kzs-zk-ends"><span>0 €</span><span>50 €</span></div></div>' +
          '<ol class="kzs-zk-day">' +
            carte(.86, .42, 'Matin', 'M5 16.5h14M4.5 16.5v-3.2l1.8-4.6a2 2 0 0 1 1.9-1.2h7.6a2 2 0 0 1 1.9 1.2l1.8 4.6v3.2M7 16.5v2M17 16.5v2M7.5 13h.01M16.5 13h.01', 'M8.5 4.5c1.6 0 2.5 1.6 2.5 3.6S10 12 8.5 12 6 10.1 6 8.1s.9-3.6 2.5-3.6zM7.8 14.5h1.6M15.5 9.5c1.6 0 2.5 1.6 2.5 3.6S17 17 15.5 17 13 15.1 13 13.1s.9-3.6 2.5-3.6zM14.8 19.5h1.6') +
            carte(.74, .36, 'Après-midi', 'M3.5 9 12 4.5 20.5 9M5.5 9.5v7M10 9.5v7M14 9.5v7M18.5 9.5v7M3.5 19.5h17', 'M12 20.5V15M12 15c-3.6 0-5.5-2.3-5.5-5S8.9 4 12 4s5.5 3.3 5.5 6-1.9 5-5.5 5z') +
            carte(.92, .5, 'Soir', 'M4 16.5h16M5.5 16.5a6.5 6.5 0 0 1 13 0M12 10V8M10.5 8h3M3.5 19.5h17', 'M4 12.5h16a8 8 0 0 1-16 0zM13.5 4l-3 6.5M18 5l-5 5.5') +
          '</ol></div><span class="kzs-ex">exemple</span>';
      },
      tl: function (el, g) {
        var $ = sel(el);
        var roll = $.q1('.kzs-zk-roll'), fill = $.q1('.kzs-zk-fill'), kw = $.q1('.kzs-zk-knobwrap'), knob = $.q1('.kzs-zk-knob');
        var cards = $.q('.kzs-zk-card'), a1 = $.q('.kzs-zk-a--1'), a2 = $.q('.kzs-zk-a--2'), costs = $.q('.kzs-zk-cost i');
        var cv = function (i, k) { return parseFloat(cards[i].style.getPropertyValue(k)) || .6; };
        g.set(roll, { y: 0, yPercent: 0 });
        g.set(fill, { scaleX: .8 });
        g.set(kw, { x: 0, xPercent: 80 });
        g.set(a1.concat(a2), { transformPerspective: 240 });
        g.set(a1, { opacity: 1, rotationX: 0 });
        g.set(a2, { opacity: 0, rotationX: -90 });
        g.set(costs, { scaleX: function (i) { return cv(i, '--c1'); } });
        g.set(cards, { xPercent: function (i) { return [-3, 4, -2][i]; }, rotation: function (i) { return [-1.4, 1.1, -.7][i]; } });
        return g.timeline({ defaults: { ease: 'expo.out' } })
          .to(knob, { scale: 1.15, duration: .25, ease: 'power2.out' }, .25)
          .to(kw, { xPercent: 50, duration: 1.4, ease: 'power2.inOut' }, .4)
          .to(fill, { scaleX: .5, duration: 1.4, ease: 'power2.inOut' }, .4)
          .to(roll, { yPercent: -93.75, duration: 1.4, ease: 'power2.inOut' }, .4)
          .to(knob, { scale: 1, duration: .4 }, 1.8)
          .to(cards, { xPercent: 0, rotation: 0, duration: .9, stagger: .12 }, 1.75)
          .to(a1, { rotationX: 90, opacity: 0, duration: .24, ease: 'power2.in', stagger: .14 }, 1.8)
          .to(a2, { rotationX: 0, opacity: 1, duration: .8, stagger: .14 }, 2.05)
          .to(costs, { scaleX: function (i) { return cv(i, '--c2'); }, duration: 1, stagger: .14 }, 1.95)
          .to({}, { duration: .5 }, 3);
      }
    }
  };

  /* ------------------------------------------------------------------------
     Utilitaires
     ------------------------------------------------------------------------ */
  var IOS = 'cubic-bezier(.2,.8,.2,1)', VITE = 'cubic-bezier(.4,0,1,1)';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function stop(el) { if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }
  /* Fige l'état courant (animations comprises) puis annule : on repart de là, sans saut */
  function figer(el) {
    if (!el || !el.getAnimations) return;
    el.getAnimations({ subtree: true }).forEach(function (x) { try { x.commitStyles(); } catch (e) {} x.cancel(); });
  }
  function etat(el) {
    var c = getComputedStyle(el);
    return { opacity: c.opacity, filter: c.filter === 'none' ? 'blur(0px)' : c.filter, transform: c.transform === 'none' ? 'translateY(0px)' : c.transform };
  }
  function nu(el) { el.style.opacity = ''; el.style.filter = ''; el.style.transform = ''; }
  function retirer(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }
  function mots(html) { return html.split(' ').map(function (m) { return '<span class="kz-apps__w">' + m + '</span>'; }).join(' '); }
  function mod(i) { var N = APPS.length; return ((i % N) + N) % N; }
  function emettre(el, nom, detail) {
    try { el.dispatchEvent(new CustomEvent(nom, { bubbles: true, detail: detail })); } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     Un module
     ------------------------------------------------------------------------ */
  function init(sec) {
    if (!sec || sec.kzApps) return sec ? sec.kzApps : null;
    var n = ++UID, pid = 'kz-apps-' + n;
    var titre = sec.hasAttribute('data-titre') ? sec.getAttribute('data-titre') : 'Mes apps';
    var base = sec.getAttribute('data-href') || 'app.html';
    var autoOk = sec.getAttribute('data-auto') !== 'off';
    if (!sec.hasAttribute('data-theme')) sec.setAttribute('data-theme', 'dark');
    var PAR = '<p class="kz-apps__par"><span>par</span> <b>Kenz</b></p>';

    var tabs = APPS.map(function (a, i) {
      return '<button class="kz-apps__ico" type="button" role="tab" id="' + pid + '-t-' + a.slug + '" aria-controls="' + pid + '-p" aria-selected="false" tabindex="-1" aria-label="' + a.nom + ', ' + a.domaine.toLowerCase() + '" style="--i:' + i + '">' +
        '<span class="kz-apps__puce"><img src="' + icone(a.slug) + '" alt="" width="320" height="320" draggable="false" decoding="async"></span></button>';
    }).join('');

    sec.innerHTML =
      '<div class="kz-apps__fond" aria-hidden="true"></div>' +
      '<div class="kz-apps__in">' +
        (titre ? '<div class="kz-apps__sig"><span class="kz-apps__moi"><img src="' + PORTRAIT + '" alt="Kenz" width="1080" height="1920" decoding="async" draggable="false"></span>' +
          '<div class="kz-apps__sigt"><h2 class="kz-apps__titre" id="' + pid + '-h">' + titre + '</h2>' +
          '<p class="kz-apps__sous">Je les imagine, je les code, je les <em>publie</em>.</p></div></div>' : '') +
        '<p class="kz-apps__tete" aria-hidden="true"><span class="kz-apps__dom"></span></p>' +
        '<div class="kz-apps__scene">' +
          '<div class="kz-apps__halo" aria-hidden="true"></div>' +
          '<div class="kz-apps__tel"><div class="kz-apps__verre"><div class="kz-apps__ecran" role="img">' +
            '<div class="kz-apps__contenu">' +
              '<div class="kz-apps__vues"></div>' +
              '<img class="kz-apps__capture" alt="" draggable="false" decoding="async">' +
              '<div class="kz-apps__splash kz-apps__lance"><img alt="" draggable="false">' + PAR + '</div>' +
            '</div>' +
            '<div class="kz-apps__splash kz-apps__voisin" aria-hidden="true"><img alt="" draggable="false">' + PAR + '</div>' +
            '<div class="kz-apps__statut" aria-hidden="true"><span>9:41</span><span>' + I.reseau + I.wifi + I.pile + '</span></div>' +
            '<i class="kz-apps__ile" aria-hidden="true"></i><i class="kz-apps__barre" aria-hidden="true"></i>' +
            '<i class="kz-apps__reflet" aria-hidden="true"></i>' +
          '</div></div></div>' +
        '</div>' +
        '<div class="kz-apps__dock" role="tablist" aria-label="Choisir une app">' + tabs + '<i class="kz-apps__fil" aria-hidden="true"><b></b></i></div>' +
        '<div class="kz-apps__corps" role="tabpanel" id="' + pid + '-p">' +
          '<p class="kz-apps__nom"><span class="kz-apps__sr"></span><span class="kz-apps__nl"></span></p>' +
          '<p class="kz-apps__depuis"></p>' +
          '<div class="kz-apps__actions">' +
            '<a class="kz-apps__btn" href="' + esc(base) + '"><span>Découvrir l’app</span><span class="kz-apps__btn-ico">' + I.droite + '</span></a>' +
            '<a class="kz-apps__store" href="#" target="_blank" rel="noopener">App Store' + I.sortie + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var $ = function (s) { return sec.querySelector(s); };
    var tabEls = arr(sec.querySelectorAll('.kz-apps__ico'));
    var dock = $('.kz-apps__dock'), filEl = $('.kz-apps__fil'), filB = filEl.firstChild;
    var panel = $('.kz-apps__corps'), dom = $('.kz-apps__dom'), sr = $('.kz-apps__sr'), nl = $('.kz-apps__nl'), dep = $('.kz-apps__depuis');
    var btn = $('.kz-apps__btn'), store = $('.kz-apps__store'), scene = $('.kz-apps__scene');
    var ecran = $('.kz-apps__ecran'), contenu = $('.kz-apps__contenu'), vues = $('.kz-apps__vues'), cap = $('.kz-apps__capture');
    var splash = $('.kz-apps__lance'), splashImg = splash.querySelector('img'), voisin = $('.kz-apps__voisin'), statut = $('.kz-apps__statut');

    var cur = -1, master = null, vu = false, visible = false, auto = autoOk && !reduit();
    var tTexte = 0, tTenir = 0, tSurvol = 0, tA = 0, tB = 0, survolDock = false, filAnim = null, gen = 0, jeton = 0, vol = null;

    function rayon() { return parseFloat(getComputedStyle(ecran).borderTopLeftRadius) || 30; }
    function habiller(el, a) {
      el.style.setProperty('--_splash', a.couleur);
      var im = el.querySelector('img');
      if (im.getAttribute('src') !== icone(a.slug)) im.src = icone(a.slug);
    }

    /* ---------- Le trait sous l'icône : un seul, qui glisse d'une icône à l'autre ---------- */
    function fil(p) { filB.style.setProperty('--p', auto ? p : 1); }
    function placerFil(anim) {
      var t = tabEls[cur];
      if (!t) return;
      if (!anim) filEl.style.transition = 'none';
      filEl.style.setProperty('--x', (t.offsetLeft + t.offsetWidth / 2) + 'px');
      if (!anim) { void filEl.offsetWidth; filEl.style.transition = ''; }
    }

    /* ---------- Le texte : sortie 160 ms (flou, légère montée), entrée mot par mot 380 ms ---------- */
    function texte(a, instant, k) {
      var t = ++tTexte;
      var hDom = mots(a.domaineHtml || esc(a.domaine));
      var hNl = '<b>' + esc(a.nom) + '</b> ' + mots(esc(a.ligne));
      var hDep = 'Sur l’App Store depuis ' + a.depuis + (a.aussi ? ', ' + a.aussi : '') + '.';
      sr.textContent = a.domaine + ' : ';
      if (instant || !dom.animate) { dom.innerHTML = hDom; nl.innerHTML = hNl; dep.textContent = hDep; return; }
      var rm = reduit();
      [dom, nl, dep].forEach(figer);
      var dOut = rm ? 200 : 160 * k;
      var sortie = function (el, d, y) {
        return el.animate([etat(el), rm ? { opacity: 0, filter: 'blur(0px)', transform: 'translateY(0px)' } : { opacity: 0, filter: 'blur(8px)', transform: 'translateY(' + y + ')' }],
          { duration: d, easing: VITE, fill: 'forwards' });
      };
      var o = sortie(dom, dOut, '-.08em');
      sortie(nl, dOut, '-.3em');
      sortie(dep, dOut, '-.3em');
      o.onfinish = function () {
        if (t !== tTexte) return;
        dom.innerHTML = hDom; nl.innerHTML = hNl; dep.textContent = hDep;
        [dom, nl, dep].forEach(function (el) { stop(el); nu(el); });
        var entre = function (w, d, delai) {
          w.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(.18em)' }, { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }],
            { duration: d, delay: delai, easing: IOS, fill: 'backwards' });
        };
        arr(dom.querySelectorAll('.kz-apps__w')).forEach(function (w, i) { entre(w, rm ? 200 : 380 * k, rm ? 0 : i * 60 * k); });
        arr(nl.querySelectorAll('.kz-apps__w')).forEach(function (w, i) { entre(w, rm ? 200 : 380 * k, rm ? 0 : (50 + i * 22) * k); });
        entre(dep, rm ? 200 : 380 * k, rm ? 0 : 160 * k);
      };
    }

    /* ---------- L'écran du téléphone ---------- */
    function rendre(a, dessous) {
      var st = D.createElement('div');
      st.className = 'kzs kzs--' + a.slug;
      st.setAttribute('aria-hidden', 'true');
      st.innerHTML = SC[a.slug].html(n + '-' + (++gen));
      if (dessous && vues.firstChild) vues.insertBefore(st, vues.firstChild); else vues.appendChild(st);
      return st;
    }
    function vider(garder) { arr(vues.children).forEach(function (c) { if (c !== garder) vues.removeChild(c); }); }
    function detacher() {
      if (master) { master.eventCallback('onComplete', null); master.eventCallback('onUpdate', null); }
      clearTimeout(tA); clearTimeout(tB);
      if (filAnim) { try { filAnim.cancel(); } catch (e) {} filAnim = null; }
    }
    function arreter() { detacher(); if (master) { master.kill(); master = null; } }

    /* mode : 'vol' (l'écran de lancement couvre déjà l'écran), 'entree' (il s'ouvre depuis le centre), 'boucle' */
    function lancer(a, mode, k) {
      k = k || 1;
      arreter();
      var g = gsapOk();
      if (!g || reduit()) return lancerSimple(a, mode !== 'boucle');
      var capVue = parseFloat(getComputedStyle(cap).opacity) > .01;
      var tl = g.timeline({ paused: true, onComplete: fini, onUpdate: function () { if (auto) fil(this.progress()); } });
      var st, t0;
      if (mode === 'vol') {
        g.killTweensOf([splash, splashImg, contenu, voisin, statut]);
        habiller(splash, a);
        g.set(splash, { opacity: 1, clipPath: 'inset(0px 0px 0px 0px round ' + Math.round(rayon()) + 'px)' });
        g.set(splashImg, { scale: 1, filter: 'blur(0px)' });
        g.set(contenu, { x: 0, opacity: 1 });
        g.set(voisin, { opacity: 0, x: 0 });
        st = rendre(a, false);
        vider(st);
        g.set(cap, { opacity: 0 });
        if (a.capture) cap.src = ecranDe(a.slug);
        g.set(statut, { opacity: 0 });
        tl.to(statut, { opacity: 1, duration: .3 * k, ease: 'power2.out' }, .04)
          .to(splash, { opacity: 0, duration: .34 * k, ease: 'power2.out' }, .02)
          .to(splashImg, { scale: 1.12, filter: 'blur(5px)', duration: .34 * k, ease: 'power2.out' }, .02);
        t0 = .02;
      } else if (mode === 'entree') {
        var r = ecran.getBoundingClientRect(), w = r.width, h = r.height, s = w * .26;
        var ix = Math.round((w - s) / 2), iy = Math.round((h - s) / 2), D1 = .5 * k;
        var plein = 'inset(0px 0px 0px 0px round ' + Math.round(rayon()) + 'px)';
        st = rendre(a, true);
        g.killTweensOf([splash, splashImg]);
        if (parseFloat(getComputedStyle(splash).opacity) > .05) {
          tl.to(splash, { '--_splash': a.couleur, opacity: 1, clipPath: plein, duration: D1 * .7, ease: 'power3.out' }, 0)
            .call(function () { habiller(splash, a); }, null, D1 * .35);
        } else {
          habiller(splash, a);
          tl.fromTo(splash, { opacity: 1, clipPath: 'inset(' + iy + 'px ' + ix + 'px ' + iy + 'px ' + ix + 'px round ' + Math.round(s * .225) + 'px)' },
            { clipPath: plein, duration: D1, ease: 'power3.out' }, 0)
            .fromTo(splashImg, { scale: .9, filter: 'blur(0px)' }, { scale: 1, duration: D1, ease: 'power3.out' }, 0);
        }
        tl.call(function () { vider(st); g.set(cap, { opacity: 0 }); if (a.capture) cap.src = ecranDe(a.slug); }, null, D1 * .9)
          .to(splash, { opacity: 0, duration: .34 * k, ease: 'power2.out' }, D1)
          .to(splashImg, { scale: 1.12, filter: 'blur(5px)', duration: .34 * k, ease: 'power2.out' }, D1);
        t0 = D1;
      } else {
        st = rendre(a, false);
        vider(st);
        g.set(splash, { opacity: 0 });
        if (capVue) tl.to(cap, { opacity: 0, duration: .4, ease: 'power2.out' }, 0);
        else if (a.capture) cap.src = ecranDe(a.slug);
        t0 = capVue ? .2 : .05;
      }
      var sc = SC[a.slug].tl(st, g);
      tl.add(sc, t0);
      var fin = t0 + sc.duration();
      if (a.capture) {
        if (mode === 'boucle' && capVue) tl.call(function () { cap.src = ecranDe(a.slug); }, null, .42);
        tl.fromTo(cap, { opacity: 0, yPercent: 5, scale: 1.02 }, { opacity: 1, yPercent: 0, scale: 1, duration: .75, ease: 'expo.out', immediateRender: false }, fin + .45)
          .to(statut, { opacity: 0, duration: .3, ease: 'power2.out' }, fin + .45)
          .to({}, { duration: .55 + 1.5 }, fin + .45);
      } else {
        tl.to({}, { duration: 1.7 }, fin);
      }
      master = tl;
      fil(0);
      if (visible && !D.hidden) tl.play();
    }

    /* Sans GSAP ou en mouvement réduit : écran final, puis la capture, en fondus de 200 ms */
    function lancerSimple(a, trans) {
      var anc = arr(vues.children);
      var st = rendre(a, false);
      if (trans && anc.length && st.animate) st.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: IOS }).onfinish = function () { anc.forEach(retirer); };
      else anc.forEach(retirer);
      var g = gsapOk();
      if (g) {
        g.killTweensOf([splash, contenu, voisin]);
        g.set(splash, { opacity: 0 });
        g.set(contenu, { x: 0, opacity: 1 });
        if (parseFloat(getComputedStyle(voisin).opacity) > .05) g.to(voisin, { opacity: 0, duration: .2, ease: 'power2.out' });
      } else { splash.style.opacity = '0'; voisin.style.opacity = '0'; }
      if (cap.animate && parseFloat(getComputedStyle(cap).opacity) > .01) cap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: IOS });
      cap.style.opacity = '0';
      statut.style.opacity = '1';
      fil(0);
      if (!visible) return;
      var dur = 6500;
      if (auto && filB.animate) filAnim = filB.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: dur, fill: 'forwards' });
      if (a.capture) tA = setTimeout(function () {
        cap.src = ecranDe(a.slug);
        cap.style.opacity = '1';
        statut.style.opacity = '0';
        if (cap.animate) cap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: IOS });
      }, 3400);
      tB = setTimeout(fini, dur);
    }

    function fini() {
      if (auto && visible) changer(cur + 1, 'auto');
      else lancer(APPS[cur], 'boucle');
    }

    /* ---------- L'icône vole du dock jusqu'à l'écran et s'y ouvre ---------- */
    function voler(a, i, k, fin) {
      if (!D.body || !D.body.animate) return null;
      var im = tabEls[i].querySelector('img');
      var s0 = im.getBoundingClientRect(), d0 = ecran.getBoundingClientRect();
      var vh = W.innerHeight || D.documentElement.clientHeight;
      var vis = (Math.min(d0.bottom, vh) - Math.max(d0.top, 0)) / (d0.height || 1);
      if (!s0.width || !d0.width || vis < .45 || s0.top > vh + 40 || s0.bottom < -40) return null;
      var U = { l: Math.min(s0.left, d0.left), t: Math.min(s0.top, d0.top), r: Math.max(s0.right, d0.right), b: Math.max(s0.bottom, d0.bottom) };
      var Wd = d0.width, R = rayon(), sz = Wd * .26;
      var f = function (v) { return (Math.round(v * 10) / 10) + 'px'; };
      var ins = function (r, rad) { return 'inset(' + f(r.top - U.t) + ' ' + f(U.r - r.right) + ' ' + f(U.b - r.bottom) + ' ' + f(r.left - U.l) + ' round ' + f(rad) + ')'; };
      var cx = d0.left + Wd / 2 - U.l, cy = d0.top + d0.height / 2 - U.t;
      var el = D.createElement('div');
      el.className = 'kz-apps-vol';
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = 'left:' + f(U.l + (W.pageXOffset || 0)) + ';top:' + f(U.t + (W.pageYOffset || 0)) + ';width:' + f(U.r - U.l) + ';height:' + f(U.b - U.t) + ';--c:' + a.couleur;
      el.innerHTML =
        '<i class="kz-apps-vol__hl" style="left:' + f(d0.left - U.l) + ';top:' + f(d0.top - U.t) + ';width:' + f(Wd) + ';height:' + f(d0.height) + '"></i>' +
        '<img src="' + icone(a.slug) + '" alt="" style="left:' + f(cx - sz / 2) + ';top:' + f(cy - sz / 2) + ';width:' + f(sz) + ';height:' + f(sz) + '">' +
        '<p class="kz-apps-vol__par" style="left:' + f(d0.left - U.l) + ';width:' + f(Wd) + ';bottom:' + f(U.b - d0.bottom + Wd * .105) + ';font-size:' + f(Math.max(8, Wd * .031)) + ';gap:' + f(Wd * .014) + '"><span>par</span> <b style="font-size:' + f(Math.max(11, Wd * .05)) + '">Kenz</b></p>' +
        '<i class="kz-apps-vol__ile" style="left:' + f(cx - Wd * .15) + ';top:' + f(d0.top - U.t + Wd * .029) + ';width:' + f(Wd * .3) + ';height:' + f(Wd * .086) + '"></i>';
      D.body.appendChild(el);
      var img = el.querySelector('img'), par = el.querySelector('p'), ile = el.querySelector('.kz-apps-vol__ile');
      var sc = s0.width / sz;
      var dx = (s0.left + s0.width / 2) - (d0.left + Wd / 2), dy = (s0.top + s0.height / 2) - (d0.top + d0.height / 2);
      var Dur = 480 * k;
      var an = [
        el.animate([{ clipPath: ins(s0, s0.width * .225) }, { clipPath: ins(d0, R) }], { duration: Dur, easing: IOS, fill: 'both' }),
        img.animate([{ transform: 'translate(' + f(dx) + ',' + f(dy) + ') scale(' + sc.toFixed(4) + ')' }, { transform: 'translate(0px,0px) scale(1)' }], { duration: Dur, easing: IOS, fill: 'both' }),
        par.animate([{ opacity: 0 }, { opacity: 0, offset: .5 }, { opacity: 1 }], { duration: Dur, easing: IOS, fill: 'both' }),
        ile.animate([{ opacity: 0 }, { opacity: 0, offset: .55 }, { opacity: 1 }], { duration: Dur, easing: IOS, fill: 'both' })
      ];
      var fait = false;
      an[0].onfinish = function () { if (fait) return; fait = true; fin(); retirer(el); };
      return {
        annuler: function () {
          if (fait) return;
          fait = true;
          an.forEach(function (x) { try { x.commitStyles(); } catch (e) {} x.cancel(); });
          el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: VITE, fill: 'forwards' }).onfinish = function () { retirer(el); };
        }
      };
    }

    function transporter(a, i, k) {
      if (vol) { vol.annuler(); vol = null; }
      detacher();
      if (!gsapOk() || reduit()) { lancer(a, 'simple', k); return; }
      var j = ++jeton;
      vol = voler(a, i, k, function () { if (j !== jeton) return; vol = null; lancer(a, 'vol', k); });
      if (!vol) lancer(a, 'entree', k);
    }

    /* ---------- Choisir une app ---------- */
    function changer(i, source) {
      i = mod(i);
      if (i === cur && source !== 'init') return false;
      var premier = cur < 0;
      var k = source === 'auto' ? 1.25 : 1;
      cur = i;
      var a = APPS[i];
      sec.style.setProperty('--_k', k);
      tabEls.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panel.setAttribute('aria-labelledby', tabEls[i].id);
      placerFil(!premier && !reduit());
      sec.setAttribute('data-app', a.slug);
      sec.style.setProperty('--kz-app', a.couleur);
      texte(a, premier || !vu, k);
      btn.setAttribute('href', base + '#' + a.slug);
      btn.setAttribute('aria-label', 'Découvrir ' + a.nom);
      store.setAttribute('href', a.store);
      store.setAttribute('aria-label', a.nom + ' sur l’App Store (nouvel onglet)');
      ecran.setAttribute('aria-label', a.alt);
      emettre(sec, 'kz-apps:change', { slug: a.slug, nom: a.nom, couleur: a.couleur, index: i, auto: source === 'auto' });
      if (!vu) { arreter(); vider(rendre(a, false)); fil(1); return true; }
      if (source !== 'glisse') transporter(a, i, k);
      fil(0);
      return true;
    }

    /* ---------- Le visiteur prend la main : on s'arrête, on reprend après 10 s ---------- */
    function clavierDedans() { try { return !!sec.querySelector(':focus-visible'); } catch (e) { return false; } }
    function tenir() {
      if (!autoOk || reduit()) return;
      if (auto) { auto = false; fil(1); if (filAnim) { try { filAnim.cancel(); } catch (e) {} filAnim = null; } }
      clearTimeout(tTenir);
      tTenir = setTimeout(reprendre, 10000);
    }
    function reprendre() {
      if (survolDock || clavierDedans()) { tTenir = setTimeout(reprendre, 10000); return; }
      auto = true;
      if (master) fil(master.progress());
      else if (visible && !vol) lancer(APPS[cur], 'boucle');
    }

    tabEls.forEach(function (t, k) {
      t.addEventListener('pointerdown', function (e) { if (e.button > 0) return; t.classList.add('is-presse'); });
      ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(function (ev) { t.addEventListener(ev, function () { t.classList.remove('is-presse'); }); });
      t.addEventListener('click', function () { t.classList.remove('is-presse'); tenir(); changer(k, 'user'); });
      t.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(tSurvol);
        tSurvol = setTimeout(function () { changer(k, 'user'); }, 450);
      });
      t.addEventListener('pointerleave', function () { clearTimeout(tSurvol); });
    });
    dock.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { survolDock = true; tenir(); } });
    dock.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && !auto) tenir(); });
    dock.addEventListener('pointerleave', function () { survolDock = false; });
    dock.addEventListener('keydown', function (e) {
      var key = e.key, i = cur;
      if (key === 'ArrowRight' || key === 'ArrowDown') i = cur + 1;
      else if (key === 'ArrowLeft' || key === 'ArrowUp') i = cur - 1;
      else if (key === 'Home') i = 0;
      else if (key === 'End') i = APPS.length - 1;
      else return;
      e.preventDefault();
      tenir();
      changer(i, 'user');
      tabEls[cur].focus();
    });
    sec.addEventListener('keydown', function () { tenir(); });
    panel.addEventListener('click', function () { tenir(); });

    /* ---------- Glisser sur le téléphone : l'écran suit le doigt, la voisine entre par le bord ---------- */
    var gl = null, GS = null;
    function debutGlisse() {
      tenir();
      if (vol) { vol.annuler(); vol = null; }
      ++jeton;
      if (master) master.pause();
      var g = gsapOk(), Wd = ecran.clientWidth || 260;
      GS = { W: Wd, gap: Math.round(Wd * .06), s: 0 };
      if (!g) return;
      g.killTweensOf([contenu, voisin]);
      GS.qc = g.quickTo(contenu, 'x', { duration: .2, ease: 'power3.out' });
      GS.qo = g.quickTo(contenu, 'opacity', { duration: .2, ease: 'power3.out' });
      GS.qv = g.quickTo(voisin, 'x', { duration: .2, ease: 'power3.out' });
      g.set(voisin, { opacity: 1, clipPath: 'none' });
    }
    function suivreGlisse(dx) {
      var g = gsapOk();
      if (!g || !GS) return;
      var s = dx < 0 ? 1 : -1, off = s * (GS.W + GS.gap);
      if (s !== GS.s) { GS.s = s; habiller(voisin, APPS[mod(cur + s)]); g.set(voisin, { x: off + dx }); }
      GS.qc(dx);
      GS.qo(1 - Math.min(.45, Math.abs(dx) / GS.W * .55));
      GS.qv(off + dx);
    }
    function finGlisse(g0, v, annule) {
      var g = gsapOk(), G2 = GS;
      GS = null;
      if (!g || !G2) {
        if (!annule && Math.abs(g0.dx) > 36) changer(cur + (g0.dx < 0 ? 1 : -1), 'user');
        return;
      }
      var s = G2.s, off = s * (G2.W + G2.gap);
      var ok = !annule && s && (Math.abs(g0.dx) > G2.W * .25 || (Math.abs(v) > .45 && Math.abs(g0.dx) > 20 && (v < 0 ? 1 : -1) === s));
      if (ok) {
        changer(cur + s, 'glisse');
        detacher();
        var a = APPS[cur], j = ++jeton;
        var d = Math.max(.22, .44 * (1 - Math.min(1, Math.abs(g0.dx) / (G2.W + G2.gap))) + .12);
        g.to(contenu, { x: -off, opacity: .4, duration: d, ease: 'power3.out', overwrite: true });
        g.to(voisin, { x: 0, duration: d, ease: 'power3.out', overwrite: true, onComplete: function () { if (j !== jeton) return; vol = null; lancer(a, 'vol', 1); } });
        vol = { annuler: function () {
          g.killTweensOf([contenu, voisin]);
          g.to(voisin, { opacity: 0, duration: .14, ease: 'power2.out' });
          g.to(contenu, { x: 0, opacity: 1, duration: .3, ease: 'power3.out' });
        } };
      } else {
        g.to(contenu, { x: 0, opacity: 1, duration: .38, ease: 'expo.out', overwrite: true });
        g.to(voisin, { x: off || G2.W, duration: .38, ease: 'expo.out', overwrite: true, onComplete: function () { g.set(voisin, { opacity: 0 }); } });
        if (master && visible) master.play();
      }
    }
    scene.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || !vu) return;
      gl = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, on: false, h: [] };
      try { scene.setPointerCapture(e.pointerId); } catch (er) {}
    });
    scene.addEventListener('pointermove', function (e) {
      if (!gl || e.pointerId !== gl.id) return;
      var dx = e.clientX - gl.x0, dy = e.clientY - gl.y0;
      if (!gl.on) {
        if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
        if (Math.abs(dy) > Math.abs(dx)) { gl = null; return; }
        gl.on = true;
        debutGlisse();
      }
      gl.dx = dx;
      gl.h.push([e.timeStamp || Date.now(), dx]);
      if (gl.h.length > 5) gl.h.shift();
      suivreGlisse(dx);
    });
    scene.addEventListener('pointerup', function (e) {
      if (!gl || e.pointerId !== gl.id) return;
      var g0 = gl, v = 0, h = g0.h;
      gl = null;
      if (!g0.on) { tenir(); return; }
      if (h.length > 1) { var dt = h[h.length - 1][0] - h[0][0]; if (dt > 0) v = (h[h.length - 1][1] - h[0][1]) / dt; }
      finGlisse(g0, v, false);
    });
    scene.addEventListener('pointercancel', function () { if (gl && gl.on) finGlisse(gl, 0, true); gl = null; });
    scene.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* « Découvrir l'app » : le passage part de l'écran du téléphone */
    btn.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      tenir();
      if (master) master.pause();
      var a = APPS[cur], href = btn.getAttribute('href');
      if (W.Passage && typeof W.Passage.ouvrir === 'function') W.Passage.ouvrir(ecran, href, { couleur: a.couleur });
      else location.href = href;
    });

    /* ---------- Visible ou non : on joue, on se met en pause ---------- */
    function voir(oui) {
      if (oui === visible) return;
      visible = oui;
      if (oui && !vu) {
        vu = true;
        sec.classList.add('is-vu');
        setTimeout(function () { if (cur >= 0 && !vol) lancer(APPS[cur], 'entree', 1); }, 420);
        return;
      }
      if (!vu) return;
      if (master) { if (oui) master.play(); else master.pause(); }
      else if (oui && !vol) lancer(APPS[cur], 'boucle');
      else if (!oui) arreter();
    }
    if ('IntersectionObserver' in W) {
      sec.classList.add('is-pret');
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { voir(en.isIntersecting && en.intersectionRatio >= .28); });
      }, { threshold: [0, .28, .5] }).observe(sec);
    } else {
      voir(true);
    }
    D.addEventListener('visibilitychange', function () {
      if (!master) return;
      if (D.hidden) master.pause(); else if (visible) master.play();
    });
    W.addEventListener('resize', function () { placerFil(false); });

    changer(0, 'init');
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { placerFil(false); });
    var api = {
      choisir: function (slug) { var i = APPS.map(function (a) { return a.slug; }).indexOf(slug); if (i > -1) { tenir(); changer(i, 'user'); } },
      suivant: function () { tenir(); changer(cur + 1, 'user'); },
      precedent: function () { tenir(); changer(cur - 1, 'user'); }
    };
    sec.kzApps = api;
    emettre(sec, 'kz-apps:pret', { slug: APPS[cur].slug });
    return api;
  }

  function tout() { arr(D.querySelectorAll('[data-kz-apps]')).forEach(init); }
  W.KzApps = { pret: true, init: init, apps: APPS.map(function (a) { return { slug: a.slug, nom: a.nom, domaine: a.domaine, couleur: a.couleur, depuis: a.depuis }; }) };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout); else tout();
})();
