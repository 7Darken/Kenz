/* ==========================================================================
   Module « apps » : les apps de Kenz, dans l'espace (BRIEF-V6.md, retours de Kenz du 13/11)

   Contrat :
     <head>  <link rel="stylesheet" href="shared/apps.css">  (et shared/passage.css)
     </body> GSAP 3.12.5 (facultatif), puis <script src="shared/apps.js" defer></script>  (et shared/passage.js)
     <section id="apps" class="kz-apps" data-kz-apps data-theme="dark" aria-label="Mes apps"></section>

   Attributs facultatifs de la section :
     data-theme="dark|light"   thème de la page (posé par theme.js) : la section est une nuit dans les deux modes,
                               ses bords haut et bas fondent progressivement dans la page
     data-titre="…"            titre de la signature (défaut « Mes apps ») ; data-titre="" : pas de signature
     data-href="app.html"      page projet ; chaque astre mène à app.html#<slug>
     data-cadre="telephone|arche"  sans effet dans l'espace (gardé pour l'outil de revue : setCadre, « kz-revue:cadre »)

   LE CIEL : plein cadre (100svh), quatre couches en parallaxe au pointeur (4, 10, 18, 30 px, lissé) et au
   défilement : étoiles lointaines en canvas (260 à 520, chacune scintille à son rythme, aigrettes sur les plus
   vives, une étoile filante toutes les 10 à 16 s, jamais sur un texte), nébuleuses qui dérivent lentement, les
   six astres (l'icône, sa lueur, un grand halo, une aigrette en croix qui scintille, un anneau orbital au
   survol ; le nom et le domaine écrits à côté), poussière au premier plan. Des fils de lumière relient les
   astres voisins ; toutes les 4 s environ, un photon passe de l'un au suivant, qui s'éclaire. À l'arrivée : les
   étoiles s'allument depuis le centre, les nébuleuses s'épanouissent, les astres s'allument un à un.

   LA FICHE HOLOGRAPHIQUE (survol à la souris, focus clavier, premier toucher) : près de l'astre, du côté où il y a
   de la place, reliée à lui par un fil de lumière (légende de HUD). Retours de Kenz du 15/11 (« pas assez imagé ») :
   un éventail de vrais écrans App Store qui défilent (l'écran de droite passe au centre toutes les 2,6 s), le nom,
   le domaine, deux ou trois phrases tirées des captures, « Explorer ». Zenko garde l'ancienne fiche : un mini-écran
   qui joue sa mini-animation en boucle (puis sa vraie capture), la ligne (les scènes des cinq autres apps restent
   dans SC, en réserve, sans être jouées). Apparition en 340 ms
   (balayage de haut en bas, flou → net, légère aberration de couleur à l'arrivée), disparition en 180 ms.
   L'astre s'intensifie, la caméra glisse à peine vers lui (≈ 3 % de zoom, parallaxe accrue), les autres s'atténuent.

   LE DÉPART (clic, Entrée, « Explorer », deuxième toucher) : la caméra plonge vers l'astre (les couches grossissent
   selon leur profondeur), les autres astres filent hors du cadre et les étoiles s'étirent, la fiche se replie dans
   l'icône ; puis shared/passage.js : l'icône se détache et se pose au centre (112 px) pendant que la couleur de l'app
   remplit l'écran en cercle depuis l'astre. Sur app.html, cette icône vole jusqu'à sa place (élément partagé).
   Mouvement réduit : ciel fixe sans scintillement, pas de caméra, des fondus.
   La boucle requestAnimationFrame est unique et s'arrête hors écran (IntersectionObserver).

   LE TRACÉ (le seul passage Pro -> Créateur ; rien ne le trahit) : on appuie sur un astre et on glisse sans lâcher.
   Au-delà de SEUIL_TRACE px, la fiche se ferme et un fil de lumière fin suit le pointeur ; il s'accroche à chaque
   astre traversé à moins de ACCROCHE px de son centre (un astre déjà pris ne se reprend pas). Le ciel retient sa
   parallaxe pendant le geste. Doigt : le tracé part d'un astre (touch-action: none sur les astres seulement).
     - CODE (ci-dessous, dans l'ordre) : les fils s'allument un à un, la constellation s'embrase et se resserre en un
       point de lumière ; il devient une petite planète bleue, la Terre, et l'on plonge vers elle (Cordon.ouvrirPorte,
       DA Terre : BRIEF-V6-TERRE.md) jusqu'à l'éclat d'atmosphère ; createur.html#porte finit la descente ;
     - autre chose (trop court, désordre, au lâcher) : le fil s'efface en EFFACE ms, sans un mot ni vibration ;
     - un tracé n'ouvre jamais la page d'une app ; un clic qui bouge de moins de SEUIL_TRACE px reste un clic.
   Mouvement réduit : pas d'échelle ni de resserrement, la planète puis l'éclat apparaissent en fondu.
   Raccourci réservé aux tests : ?test-code dans l'adresse déclenche la réussite du code, sans tracer.

   Le script pose --kz-app (couleur de l'app survolée) et data-app="<slug>" sur la section, et y émet :
     « kz-apps:pret »    detail { slug }
     « kz-apps:fiche »   detail { slug }   (une fiche s'ouvre)
     « kz-apps:depart »  detail { slug }   (le voyage vers la page de l'app commence)
     « kz-apps:cadre »   detail { cadre }
   API : section.kzApps.fiche('wado') · .fermer() · .explorer('wado') · .setCadre() · .cadre()  ·  window.KzApps.init(section)
   ========================================================================== */
(function () {
  'use strict';
  if (window.KzApps && window.KzApps.pret) return;

  /* ------------------------------------------------------------------------
     LE CODE : les astres à relier sans lâcher, dans l'ordre (les slugs de APPS ci-dessous).
     Pour le changer : une autre suite de slugs, par exemple ['oshii', 'miru', 'zenko'].
     ------------------------------------------------------------------------ */
  var CODE = ['wado', 'oshii', 'sago', 'croc'];
  var PASSAGE = { vers: 'createur.html', symbole: 'soleil' };   /* l'autre univers, et le symbole de ses portes */
  var ACCROCHE = 28;      /* px à l'écran : le fil s'accroche à un astre traversé à cette distance de son centre */
  var SEUIL_TRACE = 8;    /* px : en dessous, c'est un clic (la page de l'app) ; au-delà, un tracé */
  var EFFACE = 400;       /* ms : un tracé qui n'est pas le code s'efface */

  var D = document, W = window;
  var SCRIPT = D.currentScript;
  var SRC = (SCRIPT && SCRIPT.src) || '';
  function chemin(rel) { try { return new URL(rel, SRC || location.href).href; } catch (e) { return rel; } }
  var ASSETS = chemin('../assets/apps/');
  var PORTRAIT = chemin('../assets/img/kenz-pro.webp');
  var icone = function (s) { return ASSETS + s + '-icone.jpg'; };
  var ecranDe = function (s) { return ASSETS + s + '-ecran-1.jpg'; };
  var captureDe = function (s, c, w) { return ASSETS + s + '/' + c + (w ? '-' + w : '') + '.webp'; };

  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function gsapOk() { return (W.gsap && typeof W.gsap.timeline === 'function') ? W.gsap : null; }
  var EXPO = 'cubic-bezier(.16,1,.3,1)', SORT = 'cubic-bezier(.55,0,.75,.2)';
  var UID = 0;

  /* ------------------------------------------------------------------------
     Les apps (ordre d'arrivée : Oshii, Wado, Sago, Croc, Miru, Zenko)
     ------------------------------------------------------------------------ */
  var AS = 'https://apps.apple.com/';
  /* captures : les écrans App Store iPhone en français (assets/apps/<slug>/<n>.webp, 600 px, et <n>-320.webp) ;
     points : deux ou trois phrases reprises des accroches de ces captures (rien d'inventé). Sans captures (Zenko) :
     la fiche garde sa mini-animation (SC ci-dessous). Sources, relevées le 15/11/2026 :
       Oshii  Oshi/appstore-screenshots, fichiers oshii-0N-fr-1206x2622.png (01 à 04, la série en ligne)
       Wado   Wado/appstore-screenshots/iphone (01 à 04 ; la 05 montre des photos d'illustration aux droits non vérifiés)
       Sago   Sago/output/app-store/sago-v2-screenshots/exports/iphone-6.3 (la série V2 en ligne : 01, 02, 03, 04, 06)
       Croc   croc/appstore-screenshots/iphone (01 à 05, livraison du 11/11)
       Miru   miru/app-store/screenshots/iphone (01 à 05) */
  var APPS = [
    { slug: 'oshii', nom: 'Oshii', domaine: 'Cuisine', couleur: '#E5483B',
      ligne: 'Ta vidéo TikTok devient une vraie recette.',
      store: AS + 'fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905', capture: true, depuis: 'novembre 2025', aussi: 'et sur Google Play',
      captures: ['01', '02', '03', '04'],
      points: ['Ta vidéo TikTok, Instagram ou YouTube devient une recette.', 'Pas à pas, avec quantités et minuteurs.', 'Ta liste de courses se fait toute seule.'],
      alt: 'Animation : une vidéo de recette, « pâtes crémeuses au citron », est partagée à Oshii. Elle se replie dans l’icône et devient une fiche pesée : pâtes 200 g, parmesan 40 g, citron 1, crème 10 cl. Puis un écran de l’app.' },
    { slug: 'wado', nom: 'Wado', domaine: 'Sport & nutrition', domaineHtml: 'Sport <em>&amp;</em> nutrition', couleur: '#2F7A55',
      ligne: 'Une photo de ton plat, et ton plan s’ajuste.',
      store: AS + 'us/app/wado-calories-ia-muscu/id6813179120', capture: false, depuis: 'octobre 2026',
      captures: ['01', '02', '03', '04'],
      points: ['Ton repas en photo, calories et macros comptées.', 'Charge et reps exactes, à chaque série.', 'Une date estimée pour ton poids cible.'],
      alt: 'Animation : une assiette est prise en photo et scannée. Les macros montent : protéines 38 g, glucides 62 g, lipides 14 g, environ 520 kcal, et l’anneau « Ta journée » se remplit. Données d’exemple.' },
    { slug: 'sago', nom: 'Sago', domaine: 'Japonais', couleur: '#5B4BC4',
      ligne: 'Le japonais, par l’image, épisode par épisode.',
      store: AS + 'fr/app/sago-apprendre-le-japonais/id6759610780', capture: true, depuis: 'avril 2026',
      captures: ['01', '02', '03', '04', '06'],
      points: ['Le japonais, comme dans un anime.', 'Un épisode de 15 minutes, chaque jour.', 'Chaque mot, épinglé à sa place dans l’image.'],
      alt: 'Animation : la phrase japonaise « ねこ が すき », d’abord floue. Un chat se dessine au-dessus de ねこ, un cœur au-dessus de すき, et la traduction apparaît : « J’aime les chats. » Puis un écran de l’app.' },
    { slug: 'croc', nom: 'Croc', domaine: 'Bonnes habitudes', couleur: '#8E7CF0',
      ligne: 'Un petit pacte par jour pour arrêter de te ronger les ongles.',
      store: AS + 'app/croc-stop-ongles-rong%C3%A9s/id6801541157', capture: false, depuis: 'septembre 2026',
      captures: ['01', '02', '03', '04', '05'],
      points: ['Un pacte par jour, sans te juger.', 'Une envie ? 30 secondes guidées pour tenir.', 'Un rappel juste avant tes heures à risque.'],
      alt: 'Animation : le matin, « Je m’engage » se coche, le soir « Tenu ». Les jours de la semaine se cochent un à un et la série monte jusqu’à 12 jours. Données d’exemple.' },
    { slug: 'miru', nom: 'Miru', domaine: 'Jeux entre amis', couleur: '#4B5FD6',
      ligne: 'Un thème, et le jeu se crée en direct.',
      store: AS + 'us/app/miru-jeux-entre-amis/id6761622088', capture: true, depuis: 'avril 2026',
      captures: ['01', '02', '03', '04', '05'],
      points: ['9 jeux de soirée, zéro préparation.', 'Un seul tél, ou chacun le sien, même à distance.', 'Écris une idée, Miru crée les mots.'],
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
    gauche: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7.5 3.5L3 8l4.5 4.5"/></svg>',
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
    if (!sec.hasAttribute('data-theme')) sec.setAttribute('data-theme', 'dark');

    /* Les astres (un lien par app) : halo, aigrette en croix qui scintille à son propre rythme (--d, --dd),
       anneau orbital (au survol), icône, puis le nom et le domaine */
    var astres = APPS.map(function (a, i) {
      var d = (1.6 + ((i * 7) % 6) * .27).toFixed(2), dd = (-(i * .53)).toFixed(2);
      return '<a class="kz-apps__astre" href="' + esc(base) + '#' + a.slug + '" id="' + pid + '-a-' + a.slug + '" draggable="false" aria-label="' + esc(a.nom + ', ' + a.domaine.toLowerCase() + ' : ' + a.ligne) + '" style="--i:' + i + ';--c:' + a.couleur + ';--d:' + d + 's;--dd:' + dd + 's">' +
        '<span class="kz-apps__aura" aria-hidden="true"><i class="kz-apps__hal"></i><i class="kz-apps__orb"></i><i class="kz-apps__aig"></i></span>' +
        '<span class="kz-apps__puce"><img src="' + icone(a.slug) + '" alt="" width="320" height="320" draggable="false" decoding="async"></span>' +
        '<span class="kz-apps__etiq" aria-hidden="true"><b>' + esc(a.nom) + '</b><em>' + esc(a.domaine) + '</em></span></a>';
    }).join('');
    /* Les nébuleuses (couleur, x, y, taille, intensité) : les teintes des apps, un violet et un bleu de nuit */
    var NEB = [['#6A4BE6', 28, 30, 78, .8], ['#2C5AE6', 74, 62, 72, .72], ['#C83E62', 8, 64, 50, .42], ['#22867E', 46, 92, 54, .36], ['#C9853F', 92, 22, 46, .34]]
      .map(function (v, i) { return '<i class="kz-apps__neb' + (i < 3 ? ' kz-apps__neb--derive' : '') + '" style="--nc:' + v[0] + ';--nx:' + v[1] + '%;--ny:' + v[2] + '%;--ns:' + v[3] + 'vmax;--na:' + v[4] + ';--nd:' + (64 + i * 11) + 's;--ndd:' + (-i * 13) + 's"></i>'; }).join('');
    /* La poussière du premier plan (x, y, taille, intensité) */
    var POUS = [[8, 26, 7, .3], [23, 74, 4, .45], [36, 18, 9, .2], [52, 86, 5, .35], [63, 30, 3, .5], [70, 80, 8, .24], [82, 20, 4, .4], [93, 56, 10, .18], [15, 50, 3, .5], [46, 58, 4, .28], [58, 12, 6, .26], [78, 46, 3, .45], [30, 42, 5, .3], [95, 84, 6, .28]]
      .map(function (v, i) { return '<i style="--px:' + v[0] + '%;--py:' + v[1] + '%;--pt:' + v[2] + 'px;--pa:' + v[3] + (i % 4 === 1 ? ';--pc:255 214 150' : '') + '"></i>'; }).join('');

    sec.innerHTML =
      '<div class="kz-apps__espace" aria-hidden="true">' +
        '<div class="kz-apps__couche kz-apps__couche--loin"><canvas class="kz-apps__etoiles"></canvas></div>' +
        '<div class="kz-apps__couche kz-apps__couche--neb">' + NEB + '</div>' +
      '</div>' +
      '<div class="kz-apps__couche kz-apps__couche--pous" aria-hidden="true">' + POUS + '</div>' +
      '<div class="kz-apps__in">' +
        (titre ? '<div class="kz-apps__sig"><span class="kz-apps__moi"><img src="' + PORTRAIT + '" alt="Kenz" width="1080" height="1920" decoding="async" draggable="false"></span>' +
          '<div class="kz-apps__sigt"><h2 class="kz-apps__titre" id="' + pid + '-h">' + titre + '</h2>' +
          '<p class="kz-apps__sous">Je les imagine, je les code, je les <em>publie</em>.</p></div></div>' : '') +
        '<div class="kz-apps__astres">' + astres + '<svg class="kz-apps__fils" aria-hidden="true" focusable="false"></svg>' +
          '<svg class="kz-apps__trace" aria-hidden="true" focusable="false"></svg></div>' +
        '<svg class="kz-apps__legende" aria-hidden="true" focusable="false"><path class="kz-apps__legende-l" pathLength="1"/><circle class="kz-apps__legende-p" r="2.4"/></svg>' +
        '<div class="kz-apps__fiche" aria-hidden="true"><i class="kz-apps__fiche-scan"></i>' +
          '<div class="kz-apps__fiche-ecran"><div class="kz-apps__fiche-vues"></div><img class="kz-apps__fiche-cap" alt="" draggable="false" decoding="async"></div>' +
          '<div class="kz-apps__fiche-galerie"></div>' +
          '<div class="kz-apps__fiche-txt"><div class="kz-apps__fiche-tete"><p class="kz-apps__fiche-nom"></p><p class="kz-apps__fiche-dom"></p></div>' +
            '<p class="kz-apps__fiche-ligne"></p><ul class="kz-apps__fiche-pts"></ul>' +
            '<a class="kz-apps__fiche-cta" href="' + esc(base) + '" tabindex="-1" draggable="false"><span>Explorer</span>' + I.droite + '</a></div>' +
        '</div>' +
        '<p class="kz-apps__indice" aria-hidden="true">Touche une étoile.</p>' +
      '</div>';

    var $ = function (s) { return sec.querySelector(s); };
    var tabEls = arr(sec.querySelectorAll('.kz-apps__astre'));
    var dock = $('.kz-apps__astres'), svg = $('.kz-apps__fils'), canvas = $('.kz-apps__etoiles'), trSvg = $('.kz-apps__trace');
    var fiche = $('.kz-apps__fiche'), fScan = $('.kz-apps__fiche-scan'), fVues = $('.kz-apps__fiche-vues'), fCap = $('.kz-apps__fiche-cap');
    var fNom = $('.kz-apps__fiche-nom'), fDom = $('.kz-apps__fiche-dom'), fLigne = $('.kz-apps__fiche-ligne'), fCta = $('.kz-apps__fiche-cta');
    var fGal = $('.kz-apps__fiche-galerie'), fPts = $('.kz-apps__fiche-pts'), GAL = {};
    var leg = $('.kz-apps__legende'), legL = $('.kz-apps__legende-l'), legP = $('.kz-apps__legende-p');
    var vu = false, visible = false, gen = 0;

    /* ---------- L'espace : quatre couches, une seule boucle requestAnimationFrame, en pause hors écran ---------- */
    var MQ_SOURIS = W.matchMedia ? W.matchMedia('(hover: hover) and (pointer: fine)') : null;
    var PARAL = [4, 10, 18, 30];                                 /* parallaxe au pointeur (px) : lointaines, nébuleuses, astres, poussière */
    var TRAV = [6, 16, 30, 54];                                  /* travelling de caméra au défilement (px) */
    var ZS = [[1.012, .01], [1.025, .02], [1.03, .02], [1.06, .05]];      /* caméra au survol : ≈ 3 % de zoom vers l'astre */
    var ZOOM = [[1.05, .12], [1.2, .4], [1.8, 1], [2.5, 1.6]];          /* caméra au départ : la plongée */
    var E = { pret: false, actif: false, raf: 0, arrivee: 0, cielPret: false, W: 0, H: 0,
      pts: [], seg: [], couches: [], par: [[0, 0], [0, 0], [0, 0], [0, 0]], nx: 0, ny: 0,
      etoiles: [], ctx: null, cw: 0, chh: 0, ox: 0, oy: 0, dpr: 1, filante: null, tFilante: 0, zones: [],
      glint: { k: 0, t: 0, proch: 0 }, survol: -1, an: [], minut: [],
      fiche: -1, ficheBox: null, ficheTl: null, ficheAn: [], ficheT: 0, ptype: '', saut: false, plonge: 0, plongeX: 0, plongeY: 0 };
    /* Le tracé : le pointeur suivi, l'état (repos | trace | efface | feu), les astres pris, les segments fixés */
    var T = { id: null, k0: -1, x0: 0, y0: 0, actif: false, etat: 'repos', seq: [], segs: [], px: 0, py: 0,
      taire: -1e9, fondu: 0, secours: 0, diff: 0, minut: [], gen: 0, cx: 0, cy: 0,
      g: null, vif: null, vifL: [], vifP: [], brasier: null, soleil: null };
    function px(v) { return (Math.round(v * 10) / 10) + 'px'; }
    function n1(v) { return String(Math.round(v * 10) / 10); }
    function maintenant() { return W.performance ? W.performance.now() : Date.now(); }

    function espaceConstruire() {
      if (E.pret) return;
      E.pret = true;
      E.couches = [$('.kz-apps__couche--loin'), $('.kz-apps__couche--neb'), dock, $('.kz-apps__couche--pous')];
      E.ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
      var defs = '', lignes = '', i;
      for (i = 0; i < APPS.length - 1; i++) {
        defs += '<linearGradient id="' + pid + '-f' + i + '" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0" stop-color="' + APPS[i].couleur + '" stop-opacity=".6"/><stop offset=".5" stop-color="#F4EFE6" stop-opacity=".12"/>' +
          '<stop offset="1" stop-color="' + APPS[i + 1].couleur + '" stop-opacity=".6"/></linearGradient>';
        lignes += '<line class="kz-apps__fil-l" pathLength="1" stroke="url(#' + pid + '-f' + i + ')"/>';
      }
      svg.innerHTML = '<defs>' + defs +
          '<radialGradient id="' + pid + '-ph"><stop offset="0" stop-color="#FFF8EC" stop-opacity=".95"/><stop offset=".3" stop-color="#FFE6BC" stop-opacity=".3"/><stop offset="1" stop-color="#FFE6BC" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="' + pid + '-pt" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF1D6" stop-opacity="0"/><stop offset="1" stop-color="#FFF6E6" stop-opacity=".95"/></linearGradient></defs>' +
        '<g class="kz-apps__fils-g">' + lignes + '</g>' +
        '<g class="kz-apps__photon"><line class="kz-apps__photon-t" stroke="url(#' + pid + '-pt)"/><circle class="kz-apps__photon-h" r="15" fill="url(#' + pid + '-ph)"/><circle class="kz-apps__photon-c" r="2.1"/></g>';
      E.lignes = arr(svg.querySelectorAll('.kz-apps__fil-l'));
      E.grads = E.lignes.map(function (l, k) { return svg.querySelector('#' + pid + '-f' + k); });
      E.photon = svg.querySelector('.kz-apps__photon');
      E.photonT = svg.querySelector('.kz-apps__photon-t');
      E.photonH = svg.querySelector('.kz-apps__photon-h');
      E.photonC = svg.querySelector('.kz-apps__photon-c');
      E.ptGrad = svg.querySelector('#' + pid + '-pt');
      /* Le tracé : sous les icônes (le fil se branche dans l'astre), la braise, le fil vif et sa pointe, le soleil */
      trSvg.innerHTML = '<defs>' +
          '<radialGradient id="' + pid + '-br"><stop offset="0" stop-color="#FFF1CC" stop-opacity=".92"/><stop offset=".16" stop-color="#FFC56A" stop-opacity=".52"/><stop offset=".46" stop-color="#F2A040" stop-opacity=".15"/><stop offset="1" stop-color="#F2A040" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="' + pid + '-tp"><stop offset="0" stop-color="#FFF8EC" stop-opacity=".9"/><stop offset=".32" stop-color="#FFE6BC" stop-opacity=".22"/><stop offset="1" stop-color="#FFE6BC" stop-opacity="0"/></radialGradient></defs>' +
        '<circle class="kz-apps__brasier" r="0" fill="url(#' + pid + '-br)"/>' +
        '<g class="kz-apps__trace-g"><g class="kz-apps__trace-vif"><line class="kz-apps__seg-h"/><line class="kz-apps__seg-f"/>' +
          '<circle class="kz-apps__trace-ph" r="11" fill="url(#' + pid + '-tp)"/><circle class="kz-apps__trace-pt" r="1.7"/></g></g>' +
        '<g class="kz-apps__soleil"></g>';
      T.g = trSvg.querySelector('.kz-apps__trace-g');
      T.vif = trSvg.querySelector('.kz-apps__trace-vif');
      T.vifL = arr(T.vif.querySelectorAll('line'));
      T.vifP = arr(T.vif.querySelectorAll('circle'));
      T.brasier = trSvg.querySelector('.kz-apps__brasier');
      T.soleil = trSvg.querySelector('.kz-apps__soleil');
      /* Une lueur douce, dessinée une fois, pour les étoiles vives et l'étoile filante */
      E.sprite = D.createElement('canvas');
      E.sprite.width = E.sprite.height = 32;
      var g = E.sprite.getContext && E.sprite.getContext('2d');
      if (g) {
        var rg = g.createRadialGradient(16, 16, 0, 16, 16, 16);
        rg.addColorStop(0, 'rgba(255,248,236,1)'); rg.addColorStop(.22, 'rgba(255,238,212,.38)'); rg.addColorStop(1, 'rgba(255,238,212,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 32, 32);
      } else E.sprite = null;
    }

    function espaceMesurer() {
      if (!E.pret) return false;
      E.W = sec.clientWidth; E.H = sec.clientHeight;
      if (!E.W || !E.H) return false;
      var i;
      E.pts = tabEls.map(function (t) { return { x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, r: t.offsetWidth / 2 }; });
      svg.setAttribute('viewBox', '0 0 ' + E.W + ' ' + E.H);
      trSvg.setAttribute('viewBox', '0 0 ' + E.W + ' ' + E.H);
      leg.setAttribute('viewBox', '0 0 ' + E.W + ' ' + E.H);
      /* Les fils de lumière partent du bord de la lueur de chaque astre */
      E.seg = [];
      for (i = 0; i < E.pts.length - 1; i++) {
        var a = E.pts[i], b = E.pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
        var s = E.seg[i] = { x1: a.x + ux * a.r * 1.3, y1: a.y + uy * a.r * 1.3, x2: b.x - ux * b.r * 1.3, y2: b.y - uy * b.r * 1.3 };
        ['x1', 'y1', 'x2', 'y2'].forEach(function (k) { E.lignes[i].setAttribute(k, n1(s[k])); E.grads[i].setAttribute(k, n1(s[k])); });
      }
      /* Le ciel lointain */
      var loin = E.couches[0];
      E.ox = loin.offsetLeft; E.oy = loin.offsetTop; E.cw = loin.clientWidth; E.chh = loin.clientHeight;
      E.dpr = Math.min(W.devicePixelRatio || 1, 1.5);
      if (canvas) { canvas.width = Math.round(E.cw * E.dpr); canvas.height = Math.round(E.chh * E.dpr); }
      semerEtoiles();
      zonesTexte();
      if (E.fiche >= 0 && !E.saut) { placerFiche(E.fiche); camera(E.fiche, 'survol'); }
      if (reduit() || !E.actif) dessinerCiel(maintenant());
      return true;
    }

    /* 260 à 520 étoiles : blanc chaud, bleu pâle, quelques dorées ; chacune son rythme (0,6 à 3 s) ; les vives ont des aigrettes */
    function semerEtoiles() {
      var s = 7, rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
      var nb = Math.round(Math.max(260, Math.min(520, E.cw * E.chh / 2600)));
      var cols = ['#FFF3E2', '#FFF3E2', '#FFF3E2', '#FFF3E2', '#D3E1FF', '#D3E1FF', '#FFD596'];
      var cx = E.cw / 2, cy = E.chh / 2, dm = Math.sqrt(cx * cx + cy * cy) || 1;
      E.etoiles = [];
      for (var i = 0; i < nb; i++) {
        var x = rnd() * E.cw, y = rnd() * E.chh, vif = rnd() < .055, z = rnd();
        E.etoiles.push({ x: x, y: y, r: vif ? 1.15 + z * .8 : .38 + z * z * 1.05, a: vif ? 1 : .3 + rnd() * .65,
          col: cols[Math.floor(rnd() * cols.length)], w: 6.2832 / (.6 + rnd() * 2.4), ph: rnd() * 6.2832,
          aig: vif ? 5 + rnd() * 8 : 0, n: Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) / dm * 1100 });
      }
      E.etoiles.sort(function (a, b) { return a.col < b.col ? -1 : a.col > b.col ? 1 : 0; });
    }
    /* Les zones de texte (coordonnées de la section) : l'étoile filante ne les traverse jamais */
    function zonesTexte() {
      var r = sec.getBoundingClientRect();
      E.zones = arr(sec.querySelectorAll('.kz-apps__etiq, .kz-apps__puce, .kz-apps__sig, .kz-apps__indice'))
        .map(function (el) { var b = el.getBoundingClientRect(); return { x: b.left - r.left - 36, y: b.top - r.top - 36, w: b.width + 72, h: b.height + 72 }; })
        .filter(function (o) { return o.w > 74; });
    }

    function dessinerCiel(t) {
      var c = E.ctx;
      if (!c || !E.cw) return;
      var rm = reduit(), ta = t / 1000, age = E.arrivee ? t - E.arrivee : 1e9, col = null;
      /* La plongée : les étoiles filent vers l'extérieur, depuis l'astre choisi */
      var pl = E.plonge && !rm ? Math.min(1, (t - E.plonge) / 760) : 0, pe = pl * pl * .2, fx = E.plongeX - E.ox, fy = E.plongeY - E.oy;
      c.setTransform(E.dpr, 0, 0, E.dpr, 0, 0);
      c.clearRect(0, 0, E.cw, E.chh);
      for (var i = 0; i < E.etoiles.length; i++) {
        var s = E.etoiles[i], na = age > 1700 ? 1 : Math.max(0, Math.min(1, (age - s.n) / 480));
        if (na <= 0) continue;
        var sn = rm ? .55 : Math.sin(ta * s.w + s.ph), a = s.a * (.58 + .42 * sn) * na, rr = s.r * (.86 + .14 * sn);
        if (s.col !== col) { col = s.col; c.fillStyle = col; c.strokeStyle = col; }
        c.globalAlpha = a;
        if (pe) {
          c.lineWidth = Math.max(.6, rr * 1.5); c.lineCap = 'round';
          c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x + (s.x - fx) * pe, s.y + (s.y - fy) * pe); c.stroke();
          continue;
        }
        c.beginPath(); c.arc(s.x, s.y, rr, 0, 6.2832); c.fill();
        if (s.aig) {
          var L = s.aig * (rm ? 1 : .62 + .38 * Math.sin(ta * s.w * 1.27 + s.ph * 2));
          c.globalAlpha = a * .5; c.lineWidth = .6;
          c.beginPath(); c.moveTo(s.x - L, s.y); c.lineTo(s.x + L, s.y); c.moveTo(s.x, s.y - L); c.lineTo(s.x, s.y + L); c.stroke();
          if (E.sprite) { c.globalAlpha = a * .6; c.drawImage(E.sprite, s.x - 7, s.y - 7, 14, 14); }
        }
      }
      if (!rm && E.cielPret && !E.saut) filante(t, c);
      c.globalAlpha = 1;
    }

    /* Une étoile filante discrète toutes les 10 à 16 s, sur un trajet qui ne croise aucun texte (ni la fiche) */
    function filante(t, c) {
      var f = E.filante;
      if (!f) {
        if (!E.tFilante) E.tFilante = t + 3500 + Math.random() * 3000;
        if (t < E.tFilante) return;
        E.tFilante = t + 10000 + Math.random() * 6000;
        var zs = E.zones.slice();
        if (E.fiche >= 0 && E.ficheBox) zs.push({ x: E.ficheBox.x - 40, y: E.ficheBox.y - 40, w: E.ficheBox.w + 80, h: E.ficheBox.h + 80 });
        for (var essai = 0; essai < 12 && !f; essai++) {
          var x0 = E.W * (.2 + Math.random() * .75), y0 = E.H * (.12 + Math.random() * .42), ang = (.16 + Math.random() * .16) * Math.PI, L = 150 + Math.random() * 150;
          var dx = -Math.cos(ang) * L, dy = Math.sin(ang) * L, libre = x0 + dx > 10 && y0 + dy < E.H - 220 && y0 > 200;
          for (var k = 0; k <= 10 && libre; k++) {
            var qx = x0 + dx * k / 10, qy = y0 + dy * k / 10;
            for (var z = 0; z < zs.length; z++) { var Z = zs[z]; if (qx > Z.x && qx < Z.x + Z.w && qy > Z.y && qy < Z.y + Z.h) { libre = false; break; } }
          }
          if (libre) f = { x: x0 - E.ox, y: y0 - E.oy, dx: dx, dy: dy, t0: t, d: 700 + Math.random() * 350 };
        }
        E.filante = f || null;
        if (!f) return;
      }
      var k2 = (t - f.t0) / f.d;
      if (k2 >= 1) { E.filante = null; return; }
      var e = 1 - (1 - k2) * (1 - k2), q = Math.min(1, k2 * 5) * (1 - Math.max(0, (k2 - .55) / .45));
      var hx = f.x + f.dx * e, hy = f.y + f.dy * e, b = Math.max(0, e - .34), tx = f.x + f.dx * b, ty = f.y + f.dy * b;
      var gr = c.createLinearGradient(tx, ty, hx, hy);
      gr.addColorStop(0, 'rgba(255,244,228,0)'); gr.addColorStop(1, 'rgba(255,250,240,' + (.85 * q).toFixed(3) + ')');
      c.globalAlpha = 1; c.strokeStyle = gr; c.lineWidth = 1.2; c.lineCap = 'round';
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(hx, hy); c.stroke();
      if (E.sprite) { c.globalAlpha = q * .9; c.drawImage(E.sprite, hx - 8, hy - 8, 16, 16); }
    }

    /* Un photon sur le fil i, k de 0 à 1 (k < 0 : éteint) */
    function photon(i, k) {
      if (!E.photon) return;
      var s = E.seg[i];
      if (k < 0 || !s) { E.photon.classList.remove('is-on'); return; }
      var e = .5 - Math.cos(Math.PI * k) / 2, b = Math.max(0, e - .3);
      var x = s.x1 + (s.x2 - s.x1) * e, y = s.y1 + (s.y2 - s.y1) * e, x0 = s.x1 + (s.x2 - s.x1) * b, y0 = s.y1 + (s.y2 - s.y1) * b;
      [E.photonT, E.ptGrad].forEach(function (el) { el.setAttribute('x1', n1(x0)); el.setAttribute('y1', n1(y0)); el.setAttribute('x2', n1(x + .1)); el.setAttribute('y2', n1(y)); });
      E.photonH.setAttribute('cx', n1(x)); E.photonH.setAttribute('cy', n1(y));
      E.photonC.setAttribute('cx', n1(x)); E.photonC.setAttribute('cy', n1(y));
      E.photon.setAttribute('opacity', Math.max(0, Math.min(1, k / .08, (1 - k) / .1)).toFixed(3));
      E.photon.classList.add('is-on');
    }
    /* Le reflet qui guide l'œil : toutes les 4 s environ, un photon passe d'un astre au suivant, qui s'éclaire */
    function reflet(t) {
      var g = E.glint;
      if (!E.cielPret || E.saut || E.fiche >= 0 || T.actif || reduit()) { if (g.t) { g.t = 0; photon(0, -1); } return; }
      if (!g.t) { if (t < g.proch) return; g.t = t; }
      var k = (t - g.t) / 1150;
      if (k >= 1) { photon(0, -1); eclat(g.k + 1); g.t = 0; g.k = (g.k + 1) % (APPS.length - 1); g.proch = t + 2900; return; }
      photon(g.k, k);
    }
    /* L'éclat d'un astre : l'aigrette s'allonge, le halo s'avive, puis tout revient */
    function eclat(i, fort) {
      var t = tabEls[i];
      if (!t || !t.animate || reduit()) return;
      var aig = t.querySelector('.kz-apps__aig'), hal = t.querySelector('.kz-apps__hal'), m = fort ? 2.3 : 1.7;
      aig.animate([{ transform: 'scale(1)' }, { transform: 'scale(' + m + ')', offset: .28 }, { transform: 'scale(1)' }], { duration: fort ? 1200 : 950, easing: 'cubic-bezier(.2,.8,.2,1)' });
      hal.animate([{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(' + (fort ? 1.5 : 1.25) + ')', filter: 'brightness(1.9)', offset: .25 }, { transform: 'scale(1)', filter: 'brightness(1)' }], { duration: fort ? 1200 : 950, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }

    /* La boucle unique : parallaxe (pointeur + défilement ; accrue au survol), ciel, reflet, légende de la fiche */
    function boucle(t) {
      E.raf = 0;
      if (!E.actif) return;
      var rm = reduit(), vh = W.innerHeight || 1, r = sec.getBoundingClientRect();
      var sp = rm ? 0 : Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh)), boost = E.fiche >= 0 ? 1.6 : 1;
      for (var i = 0; i < 4; i++) {
        var p = E.par[i], tx = rm ? 0 : -E.nx * PARAL[i] * boost, ty = rm ? 0 : -E.ny * PARAL[i] * .75 * boost + sp * TRAV[i];
        p[0] += (tx - p[0]) * .075; p[1] += (ty - p[1]) * .075;
        E.couches[i].style.translate = px(p[0]) + ' ' + px(p[1]);
      }
      dessinerCiel(t);
      reflet(t);
      if (E.fiche >= 0) legende();
      if (!rm || E.plonge) E.raf = requestAnimationFrame(boucle);
    }
    function espaceActif() {
      var on = visible && !D.hidden && E.pret;
      if (on === E.actif) return;
      E.actif = on;
      sec.classList.toggle('is-actif', on);
      if (on) { if (!E.raf && W.requestAnimationFrame) E.raf = requestAnimationFrame(boucle); }
      else if (E.raf) { cancelAnimationFrame(E.raf); E.raf = 0; }
    }
    sec.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !(MQ_SOURIS && MQ_SOURIS.matches) || T.actif) return;   /* pendant un tracé, le ciel retient sa parallaxe */
      var r = sec.getBoundingClientRect();
      E.nx = Math.max(-1, Math.min(1, (e.clientX - r.left) / (r.width || 1) * 2 - 1));
      E.ny = Math.max(-1, Math.min(1, (e.clientY - r.top) / (r.height || 1) * 2 - 1));
    });
    sec.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { E.nx = 0; E.ny = 0; } });

    /* La caméra. 'survol' : elle glisse à peine vers l'astre (≈ 3 % de zoom des couches).
       'saut' : elle plonge vers lui (chaque couche grossit selon sa profondeur), les autres astres filent hors du cadre. */
    function camera(i, mode) {
      var P = E.pts[i], Z = mode === 'saut' ? ZOOM : ZS, C = { x: E.W / 2, y: E.H / 2 }, R = Math.max(E.W, E.H) * .9;
      tabEls.forEach(function (t, j) {
        if (mode !== 'saut' || i < 0 || j === i || reduit() || !P || !E.pts[j]) { t.style.translate = ''; return; }
        var dx = E.pts[j].x - P.x, dy = E.pts[j].y - P.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        t.style.translate = px(dx / L * R) + ' ' + px(dy / L * R);
      });
      E.couches.forEach(function (el, j) {
        if (i < 0 || reduit() || !P) { el.style.transform = ''; return; }
        var z = Z[j], lx = P.x - el.offsetLeft, ly = P.y - el.offsetTop;
        el.style.transform = 'translate(' + px(lx + (C.x - P.x) * z[1] - z[0] * lx) + ',' + px(ly + (C.y - P.y) * z[1] - z[0] * ly) + ') scale(' + z[0] + ')';
      });
    }
    function survoler(k) {
      if (E.survol === k) return;
      E.survol = k;
      dock.classList.toggle('is-survol', k >= 0);
      tabEls.forEach(function (t, j) { t.classList.toggle('is-vise', j === k); });
    }

    /* ---------- La fiche holographique ----------
       Avec captures (Oshii, Wado, Sago, Croc, Miru) : un éventail de trois vrais écrans App Store ; toutes les 2,6 s,
       celui de droite passe au centre, celui de gauche s'efface (mouvement réduit : l'éventail reste fixe).
       Les images ne sont demandées qu'à la première ouverture de la fiche de l'app (320 px, 600 px pour les écrans denses),
       puis gardées. Sans captures (Zenko) : un mini-écran qui joue l'app, puis sa capture, et la ligne. */
    function galerie(a) {
      if (GAL[a.slug]) return GAL[a.slug];
      var el = D.createElement('div');
      el.className = 'kz-apps__gal';
      el.innerHTML = a.captures.map(function (c, i) {
        return '<span class="kz-apps__cap"><span class="kz-apps__cap-in"><img src="' + captureDe(a.slug, c, 320) + '" srcset="' +
          captureDe(a.slug, c, 320) + ' 320w, ' + captureDe(a.slug, c) + ' 600w" sizes="(max-width: 599px) 120px, 156px" alt="" width="320" height="696"' +
          ' loading="lazy" decoding="async" draggable="false"' + (i > 2 ? ' fetchpriority="low"' : '') + '></span></span>';
      }).join('') + '<span class="kz-apps__gal-pts" aria-hidden="true">' + a.captures.map(function () { return '<i></i>'; }).join('') + '</span>';
      arr(el.querySelectorAll('img')).forEach(function (im) {
        var ok = function () { im.classList.add('is-pret'); };
        if (im.complete && im.naturalWidth) ok(); else { im.addEventListener('load', ok); im.addEventListener('error', ok); }
      });
      return (GAL[a.slug] = { el: el, caps: arr(el.querySelectorAll('.kz-apps__cap')), pts: arr(el.querySelectorAll('.kz-apps__gal-pts i')), cur: 0 });
    }
    /* La place de chaque écran : 0 au centre, ±1 de côté, ±2 caché. Un écran qui revient par la droite y est
       d'abord posé sans transition (il ne traverse jamais l'éventail). */
    function galPoser(G, net) {
      var N = G.caps.length, M = Math.floor((N - 1) / 2), saut = [];
      G.caps.forEach(function (c, i) {
        var o = ((i - G.cur) % N + N) % N, s = Math.max(-2, Math.min(2, o <= M ? o : o - N));
        if (net || (c._s != null && s - c._s > 1)) { c.style.transition = 'none'; c.setAttribute('data-s', net ? String(s) : '2'); saut.push(c); }
        c._s = s;
      });
      if (saut.length) { void G.el.offsetWidth; saut.forEach(function (c) { c.style.transition = ''; }); }
      G.caps.forEach(function (c) { c.setAttribute('data-s', String(c._s)); });
      G.pts.forEach(function (p, i) { p.classList.toggle('is-on', i === G.cur); });
    }
    function galerieJouer(a) {
      var G = galerie(a), rm = reduit(), an = [], minut = 0, arret = false, pause = false;
      fGal.innerHTML = '';
      fGal.appendChild(G.el);
      G.cur = 0;
      galPoser(G, true);
      if (rm) return;
      /* À l'ouverture : les trois écrans montent en place, le central d'abord */
      G.caps.forEach(function (c) {
        if (Math.abs(c._s) > 1 || !c.firstChild.animate) return;
        an.push(c.firstChild.animate([{ opacity: 0, transform: 'translateY(16px) scale(.94)' }, { opacity: 1, transform: 'none' }],
          { duration: 620, delay: 40 + Math.abs(c._s) * 90, easing: EXPO, fill: 'backwards' }));
      });
      function armer(d) { clearTimeout(minut); if (!arret && !pause) minut = setTimeout(avancer, d); }
      function avancer() { G.cur = (G.cur + 1) % G.caps.length; galPoser(G); armer(2600); }
      armer(1900);
      E.ficheTl = {
        play: function () { if (pause) { pause = false; armer(1400); } },
        pause: function () { pause = true; clearTimeout(minut); },
        kill: function () { arret = true; clearTimeout(minut); an.forEach(function (x) { try { x.cancel(); } catch (e) {} }); }
      };
    }
    function ficheJouer(a) {
      ficheStop();
      if (a.captures) { fVues.innerHTML = ''; fCap.removeAttribute('src'); galerieJouer(a); return; }
      var st = D.createElement('div');
      st.className = 'kzs kzs--' + a.slug;
      st.setAttribute('aria-hidden', 'true');
      st.innerHTML = SC[a.slug].html('f' + n + '-' + (++gen));
      fVues.innerHTML = '';
      fVues.appendChild(st);
      fVues.style.opacity = '1'; fVues.style.filter = 'none';
      fCap.style.opacity = '0'; fCap.style.filter = 'none';
      if (a.capture) fCap.src = ecranDe(a.slug); else fCap.removeAttribute('src');
      var g = gsapOk();
      if (!g || reduit()) { if (a.capture) { fVues.style.opacity = '0'; fCap.style.opacity = '1'; } return; }
      var sc = SC[a.slug].tl(st, g), tl = g.timeline({ repeat: -1, repeatDelay: .25 });
      tl.add(sc, .15);
      var fin = .15 + sc.duration();
      if (a.capture) {
        /* La scène sort, puis la vraie capture entre ; elle ressort entièrement avant que la scène ne reparte */
        tl.to(fVues, { opacity: 0, filter: 'blur(5px)', duration: .18, ease: 'power2.in' }, fin + .3)
          .fromTo(fCap, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: .45, ease: 'expo.out', immediateRender: false }, fin + .5)
          .to(fCap, { opacity: 0, filter: 'blur(6px)', duration: .24, ease: 'power2.in' }, fin + 2.3);
      } else {
        tl.to({}, { duration: 1.6 }, fin);
      }
      E.ficheTl = tl;
    }
    function ficheStop() { if (E.ficheTl) { E.ficheTl.kill(); E.ficheTl = null; } }
    function ficheAnAnnuler() { E.ficheAn.forEach(function (x) { try { x.cancel(); } catch (e) {} }); E.ficheAn = []; }

    /* La place de la fiche : à côté de l'astre, du côté où il y a de la place, jamais hors du cadre.
       Si elle ne tient d'aucun côté (fiche en galerie sur un écran étroit), au-dessus ou au-dessous de l'astre. */
    function placerFiche(k) {
      var P = E.pts[k];
      if (!P) return;
      var petit = E.W < 600, fw = fiche.offsetWidth, fh = fiche.offsetHeight, m = petit ? 12 : 24, haut = petit ? 92 : 104, bas = petit ? 40 : 72;
      var sl = ZS[2][1], x0 = P.x + (E.W / 2 - P.x) * sl, y0 = P.y + (E.H / 2 - P.y) * sl, gap = P.r * 1.2 + (petit ? 14 : 64);
      var yMax = Math.max(haut, E.H - bas - fh);
      var cx = function (v) { return Math.max(m, Math.min(E.W - m - fw, v)); }, cy = function (v) { return Math.max(haut, Math.min(yMax, v)); };
      var cands = [{ x: x0 + gap, s: 1 }, { x: x0 - gap - fw, s: -1 }];
      if (x0 > E.W / 2) cands.reverse();
      var libre = function (c) { return c.x >= m && c.x + fw <= E.W - m; };
      var cotes = cands.filter(libre), mieux = null, gal = fiche.classList.contains('kz-apps__fiche--galerie');
      /* On garde la place qui recouvre le moins d'autres astres (cible entière, 14 px autour) : chaque astre doit rester
         joignable, pour un clic comme pour un tracé ; recouvrir l'astre visé coûte plus encore. */
      function essai(x, y, s, v, cout) {
        if (gal && P.x + P.r > x && P.x - P.r < x + fw && P.y + P.r > y && P.y - P.r < y + fh) cout += 4;
        E.pts.forEach(function (q, j) {
          if (j !== k && q.x + q.r + 14 > x && q.x - q.r - 14 < x + fw && q.y + q.r + 14 > y && q.y - q.r - 14 < y + fh) cout += 1;
        });
        if (!mieux || cout < mieux.cout) mieux = { x: x, y: y, s: s, v: v, cout: cout };
      }
      /* Du côté préféré si possible ; en hauteur : centrée sur l'astre, ou calée sur lui */
      (cotes.length ? cotes : [cands[0]]).forEach(function (cd, ci) {
        [y0 - fh / 2, y0 - P.r * 1.4, y0 - fh + P.r * 1.4, y0 + P.r * .5, y0 - fh - P.r * .5].forEach(function (yc, o) {
          essai(cx(cd.x), cy(yc), cd.s, 0, o * .1 + ci * .5 + (cotes.length ? 0 : 2));
        });
      });
      if (!cotes.length && gal) {
        var gv = P.r * 1.4 + (petit ? 12 : 30);
        [[y0 + gv, 1], [y0 - gv - fh, -1]].forEach(function (c, o) {
          essai(cx(x0 - fw / 2), cy(c[0]), 0, c[1], 1 + o * .1 + (c[0] < haut - 1 || c[0] > yMax + 1 ? 2 : 0));
        });
      }
      fiche.style.left = px(mieux.x);
      fiche.style.top = px(mieux.y);
      E.ficheBox = { x: mieux.x, y: mieux.y, w: fw, h: fh, s: mieux.s, v: mieux.v };
    }
    /* La légende de HUD : un fil de lumière de l'astre à la fiche (suit l'astre pendant la parallaxe) */
    function legende() {
      var F = E.ficheBox, t = tabEls[E.fiche];
      if (!F || !t) return;
      var r = sec.getBoundingClientRect(), b = t.querySelector('img').getBoundingClientRect();
      var ax = b.left - r.left + b.width / 2, ay = b.top - r.top + b.height / 2, R = b.width * .82, ex, ey, dx, dy, L, sx, sy, d;
      if (F.v) {
        /* fiche au-dessus ou au-dessous : le fil descend (ou monte) droit vers son bord */
        ex = Math.max(F.x + 28, Math.min(F.x + F.w - 28, ax)); ey = F.v > 0 ? F.y : F.y + F.h;
        dx = ex - ax; dy = ey - ay; L = Math.sqrt(dx * dx + dy * dy) || 1; sx = ax + dx / L * R; sy = ay + dy / L * R;
        d = 'M' + n1(sx) + ' ' + n1(sy) + 'L' + n1(ex) + ' ' + n1(ey);
      } else {
        ex = F.s > 0 ? F.x : F.x + F.w; ey = Math.max(F.y + 28, Math.min(F.y + F.h - 28, ay));
        var kx = ex - F.s * 20;
        dx = kx - ax; dy = ey - ay; L = Math.sqrt(dx * dx + dy * dy) || 1; sx = ax + dx / L * R; sy = ay + dy / L * R;
        d = (kx - sx) * F.s < 6 ? 'M' + n1(sx) + ' ' + n1(sy) + 'L' + n1(ex) + ' ' + n1(ey)
          : 'M' + n1(sx) + ' ' + n1(sy) + 'L' + n1(kx) + ' ' + n1(ey) + 'L' + n1(ex) + ' ' + n1(ey);
      }
      legL.setAttribute('d', d);
      legP.setAttribute('cx', n1(sx)); legP.setAttribute('cy', n1(sy));
    }

    function ficheOuvrir(k) {
      if (E.saut || !vu) return;
      clearTimeout(E.ficheT);
      if (E.fiche === k) return;
      var a = APPS[k];
      if (!E.cielPret) {   /* ouverte pendant l'arrivée : l'arrivée se termine tout de suite */
        E.an.forEach(function (x) { try { x.finish(); } catch (e) {} });
        E.minut.forEach(clearTimeout); E.minut = []; E.cielPret = true;
      }
      E.fiche = k;
      survoler(k);
      sec.style.setProperty('--kz-app', a.couleur);
      sec.setAttribute('data-app', a.slug);
      fiche.style.setProperty('--c', a.couleur);
      leg.style.setProperty('--c', a.couleur);
      fNom.textContent = a.nom;
      fDom.textContent = a.domaine;
      fLigne.textContent = a.ligne;
      fPts.innerHTML = (a.points || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
      fiche.classList.toggle('kz-apps__fiche--galerie', !!a.captures);
      fCta.setAttribute('href', base + '#' + a.slug);
      ficheJouer(a);
      ficheAnAnnuler();
      fiche.style.transformOrigin = '';
      fiche.classList.add('is-on');
      leg.classList.add('is-on');
      placerFiche(k);
      legende();
      camera(k, 'survol');
      var rm = reduit(), h = fiche.offsetHeight;
      if (fiche.animate) {
        /* Apparition holographique : un balayage la dessine de haut en bas, du flou au net,
           une très légère aberration de couleur sur les bords, à l'arrivée seulement */
        E.ficheAn.push(fiche.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [
          { opacity: .35, clipPath: 'inset(0% 0% 100% 0% round 20px)', filter: 'blur(7px) drop-shadow(3px 0px 0px rgba(255,64,120,.65)) drop-shadow(-3px 0px 0px rgba(64,214,255,.65))' },
          { opacity: .95, clipPath: 'inset(0% 0% 0% 0% round 20px)', filter: 'blur(1.5px) drop-shadow(1.5px 0px 0px rgba(255,64,120,.3)) drop-shadow(-1.5px 0px 0px rgba(64,214,255,.3))', offset: .72 },
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 20px)', filter: 'blur(0px) drop-shadow(0px 0px 0px rgba(255,64,120,0)) drop-shadow(0px 0px 0px rgba(64,214,255,0))' }
        ], { duration: rm ? 200 : 340, easing: IOS }));
        if (!rm) {
          E.ficheAn.push(fScan.animate([{ transform: 'translateY(0px)', opacity: 1 }, { transform: 'translateY(' + h + 'px)', opacity: .9, offset: .86 }, { transform: 'translateY(' + h + 'px)', opacity: 0 }],
            { duration: 320, easing: 'cubic-bezier(.45,0,.55,1)' }));
          E.ficheAn.push(legL.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 240, easing: IOS }));
        }
      }
      emettre(sec, 'kz-apps:fiche', { slug: a.slug });
    }
    function ficheFermer(vite) {
      clearTimeout(E.ficheT);
      if (E.fiche < 0 || E.saut) return;
      E.fiche = -1;
      survoler(-1);
      camera(-1);
      ficheAnAnnuler();
      var fin = function () { fiche.classList.remove('is-on'); leg.classList.remove('is-on'); ficheStop(); ficheAnAnnuler(); };
      if (vite || !fiche.animate) { fin(); return; }
      var an = fiche.animate([{ opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }, { opacity: 0, filter: 'blur(4px)', transform: 'scale(.985)' }], { duration: 180, easing: VITE, fill: 'forwards' });
      E.ficheAn = [an, leg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: VITE, fill: 'forwards' })];
      an.onfinish = function () { if (E.fiche < 0) fin(); };
    }
    function ficheFermerBientot() { clearTimeout(E.ficheT); E.ficheT = setTimeout(function () { ficheFermer(); }, 170); }

    /* ---------- Le départ : la caméra plonge vers l'astre, la fiche se replie dans l'icône,
       l'icône se détache et se pose au centre pendant que la couleur de l'app remplit l'écran (shared/passage.js) ---------- */
    function explorer(k) {
      if (E.saut || k < 0) return;
      var a = APPS[k], url = base + '#' + a.slug, im = tabEls[k].querySelector('img');
      var r = sec.getBoundingClientRect(), b = im.getBoundingClientRect();
      E.saut = true;
      clearTimeout(E.ficheT);
      sec.classList.add('is-saut');
      survoler(k);
      /* la fiche se replie dans l'icône */
      if (E.fiche >= 0 && fiche.animate && !reduit() && E.ficheBox) {
        var F = E.ficheBox, tx = b.left - r.left + b.width / 2 - (F.x + F.w / 2), ty = b.top - r.top + b.height / 2 - (F.y + F.h / 2);
        ficheAnAnnuler();
        fiche.style.transformOrigin = '50% 50%';
        E.ficheAn = [fiche.animate([{ transform: 'translate(0px,0px) scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'translate(' + px(tx) + ',' + px(ty) + ') scale(.06)', opacity: 0, filter: 'blur(3px)' }],
          { duration: 320, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }),
          leg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: VITE, fill: 'forwards' })];
        E.ficheAn[0].onfinish = ficheStop;
      } else { fiche.classList.remove('is-on'); leg.classList.remove('is-on'); ficheStop(); }
      E.fiche = -1;
      E.plonge = maintenant(); E.plongeX = b.left - r.left + b.width / 2; E.plongeY = b.top - r.top + b.height / 2;
      camera(k, 'saut');
      if (!E.raf && E.actif && W.requestAnimationFrame) E.raf = requestAnimationFrame(boucle);
      emettre(sec, 'kz-apps:depart', { slug: a.slug });
      if (W.Passage && typeof W.Passage.ouvrir === 'function') {
        try { W.Passage.ouvrir(im, url, { couleur: a.couleur, icone: icone(a.slug), taille: 112 }); return; } catch (e) {}
      }
      setTimeout(function () { location.href = url; }, reduit() ? 0 : 520);
    }
    /* Retour arrière (page restaurée du cache) : le ciel revient tel quel */
    W.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      traceRemettre();
      E.saut = false; E.plonge = 0;
      sec.classList.remove('is-saut');
      ficheAnAnnuler();
      fiche.classList.remove('is-on'); leg.classList.remove('is-on'); ficheStop();
      E.fiche = -1;
      survoler(-1);
      camera(-1);
    });

    /* ---------- Les gestes ---------- */
    /* Le survol n'ouvre la fiche qu'avec une vraie souris (écran qui sait survoler) */
    function souris(e) { return e.pointerType === 'mouse' && (!MQ_SOURIS || MQ_SOURIS.matches); }
    tabEls.forEach(function (t, k) {
      t.addEventListener('pointerdown', function (e) { E.ptype = e.pointerType; if (e.button > 0) return; t.classList.add('is-presse'); });
      ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(function (ev) { t.addEventListener(ev, function () { t.classList.remove('is-presse'); }); });
      t.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        /* Un tracé n'ouvre jamais la page d'une app (ni la fiche) : le clic qui le suit est ignoré */
        if (T.actif || T.etat === 'feu' || maintenant() - T.taire < 700) { E.ptype = ''; return; }
        var tactile = E.ptype === 'touch' || E.ptype === 'pen';
        E.ptype = '';
        /* Au toucher : un premier toucher ouvre la fiche, un deuxième lance le voyage */
        if (tactile && E.fiche !== k) { ficheOuvrir(k); return; }
        explorer(k);
      });
      t.addEventListener('pointerenter', function (e) {
        if (!souris(e) || T.actif) return;
        /* Juste après un tracé, la fiche attend que le fil se soit effacé */
        var reste = T.taire + EFFACE - maintenant();
        clearTimeout(T.diff);
        if (reste > 0) T.diff = setTimeout(function () { try { if (!T.actif && t.matches(':hover')) ficheOuvrir(k); } catch (er) {} }, reste);
        else ficheOuvrir(k);
      });
      t.addEventListener('pointerleave', function (e) { if (souris(e) && E.fiche === k) ficheFermerBientot(); });
      t.addEventListener('focus', function () { try { if (t.matches(':focus-visible')) ficheOuvrir(k); } catch (e) {} });
      t.addEventListener('blur', function () { if (E.fiche === k) ficheFermerBientot(); });
    });
    fiche.addEventListener('pointerenter', function (e) { if (souris(e)) clearTimeout(E.ficheT); });
    fiche.addEventListener('pointerleave', function (e) { if (souris(e)) ficheFermerBientot(); });
    /* Un glissé (≥ SEUIL_TRACE px entre l'appui et le lâcher) sur la fiche n'est pas un clic : il n'ouvre rien */
    var ficheAppui = null;
    fiche.addEventListener('pointerdown', function (e) { ficheAppui = [e.clientX, e.clientY]; });
    function ficheGlisse(e) {
      var a = ficheAppui;
      if (!a || !e.detail) return false;   /* detail 0 : activation au clavier */
      var dx = e.clientX - a[0], dy = e.clientY - a[1];
      return dx * dx + dy * dy >= SEUIL_TRACE * SEUIL_TRACE;
    }
    fCta.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (ficheGlisse(e)) return;
      explorer(E.fiche >= 0 ? E.fiche : E.survol);
    });
    fiche.addEventListener('click', function (e) {
      if (e.target.closest('.kz-apps__fiche-cta') || E.fiche < 0) return;
      e.preventDefault();
      if (!ficheGlisse(e)) explorer(E.fiche);
    });
    /* Un toucher dans le vide referme la fiche ; Échap aussi */
    sec.addEventListener('pointerdown', function (e) {
      if (E.fiche < 0 || e.pointerType === 'mouse') return;
      if (e.target.closest && e.target.closest('.kz-apps__astre, .kz-apps__fiche')) return;
      ficheFermer();
    });
    sec.addEventListener('keydown', function (e) { if (e.key === 'Escape' && E.fiche >= 0) ficheFermer(); });

    /* ---------- Le tracé, d'astre en astre (voir LE TRACÉ en tête de fichier). Rien ne l'annonce :
       pour qui glisse par hasard, c'est un jeu de lumière entre les astres. ---------- */
    var HTML = D.documentElement, NS = 'http://www.w3.org/2000/svg';
    function trAt(s, fn) { var id = setTimeout(fn, s * 1000); T.minut.push(id); return id; }
    function trTween(d, ez, maj, fin) {
      var g0 = T.gen, t0 = maintenant();
      (function pas() {
        if (g0 !== T.gen) return;
        var p = d > 0 ? Math.min(1, (maintenant() - t0) / (d * 1000)) : 1;
        maj(ez(p));
        if (p < 1) requestAnimationFrame(pas); else if (fin) fin();
      })();
    }
    function trExpo(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
    function trEntre(p) { return p * p * p; }               /* part lentement, se resserre vite */
    function f3(v) { return String(Math.round(v * 1000) / 1000); }
    /* Du pointeur (écran) au repère des astres : le dock, parallaxe et caméra comprises */
    function trRepere() { var R = dock.getBoundingClientRect(); return { l: R.left, t: R.top, k: (R.width / (E.W || 1)) || 1 }; }
    function trDock(G, x, y) { return [(x - G.l) / G.k, (y - G.t) / G.k]; }
    function trLigne(els, x1, y1, x2, y2) {
      els.forEach(function (l) { l.setAttribute('x1', n1(x1)); l.setAttribute('y1', n1(y1)); l.setAttribute('x2', n1(x2)); l.setAttribute('y2', n1(y2)); });
    }
    /* Un segment fixé, d'un centre à l'autre (sous les icônes : le fil se branche dans l'astre) */
    function trSegment(a, b) {
      var g = D.createElementNS(NS, 'g'), h = D.createElementNS(NS, 'line'), f = D.createElementNS(NS, 'line');
      g.setAttribute('class', 'kz-apps__seg'); h.setAttribute('class', 'kz-apps__seg-h'); f.setAttribute('class', 'kz-apps__seg-f');
      g.appendChild(h); g.appendChild(f);
      trLigne([h, f], E.pts[a].x, E.pts[a].y, E.pts[b].x, E.pts[b].y);
      T.g.insertBefore(g, T.vif);
      return g;
    }
    /* Les astres libres que le pointeur frôle entre deux positions, dans l'ordre du passage */
    function trFrolees(x0, y0, x1, y1, rayon) {
      var dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy, out = [];
      E.pts.forEach(function (p, k) {
        if (T.seq.indexOf(k) > -1) return;
        var t = L ? ((p.x - x0) * dx + (p.y - y0) * dy) / L : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var qx = x0 + t * dx - p.x, qy = y0 + t * dy - p.y;
        if (qx * qx + qy * qy < rayon * rayon) out.push([t, k]);
      });
      out.sort(function (a, b) { return a[0] - b[0]; });
      return out.map(function (o) { return o[1]; });
    }
    function trPrendre(k) {
      var avant = T.seq.length ? T.seq[T.seq.length - 1] : -1;
      T.seq.push(k);
      tabEls[k].classList.add('is-lie');
      eclat(k);
      if (avant > -1) T.segs.push(trSegment(avant, k));
      if (T.seq.length === CODE.length && T.seq.map(function (i) { return APPS[i].slug; }).join() === CODE.join()) trReussir();
    }
    /* Le fil vif : du dernier astre pris jusqu'au pointeur, avec une pointe de lumière */
    function trVif(x, y) {
      var k = T.seq[T.seq.length - 1];
      if (k == null) return;
      trLigne(T.vifL, E.pts[k].x, E.pts[k].y, x, y);
      T.vifP.forEach(function (c) { c.setAttribute('cx', n1(x)); c.setAttribute('cy', n1(y)); });
      T.vif.classList.add('is-on');
    }
    function trVider() {
      clearTimeout(T.fondu);
      T.segs.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
      T.segs = []; T.seq = [];
      T.vif.classList.remove('is-on');
      T.g.style.transition = 'none'; T.g.style.opacity = '';
      tabEls.forEach(function (t) { t.classList.remove('is-lie'); });
      T.etat = 'repos';
    }
    /* Pas le code (au lâcher) : le fil s'efface doucement, sans un mot ni vibration */
    function trEffacer() {
      T.etat = 'efface';
      T.g.style.transition = 'opacity ' + EFFACE + 'ms cubic-bezier(.45,0,.55,1)';
      T.g.style.opacity = '0';
      tabEls.forEach(function (t) { t.classList.remove('is-lie'); });
      clearTimeout(T.fondu);
      T.fondu = setTimeout(trVider, EFFACE + 20);
    }

    /* Le geste. Il s'arme sur un astre, ne devient un tracé qu'au-delà de SEUIL_TRACE px (sinon : un clic). */
    function trArmer(e, k) {
      if (T.id !== null || E.saut || T.etat === 'feu' || !vu) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.isPrimary === false || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (W.Cordon && typeof W.Cordon.enCours === 'function' && W.Cordon.enCours()) return;
      T.id = e.pointerId; T.k0 = k; T.x0 = e.clientX; T.y0 = e.clientY; T.actif = false;
    }
    function trDemarrer(e) {
      T.actif = true;
      T.taire = maintenant();
      if (T.etat === 'efface') trVider();
      if (!E.cielPret) {   /* pendant l'arrivée : elle se termine tout de suite */
        E.an.forEach(function (x) { try { x.finish(); } catch (er) {} });
        E.minut.forEach(clearTimeout); E.minut = []; E.cielPret = true;
      }
      tabEls[T.k0].classList.remove('is-presse');
      if (E.fiche >= 0) ficheFermer(); else { clearTimeout(E.ficheT); survoler(-1); }
      try { sec.setPointerCapture(e.pointerId); } catch (er) {}
      HTML.classList.add('kz-apps-trace');
      T.etat = 'trace';
      var p = trDock(trRepere(), T.x0, T.y0);
      T.px = p[0]; T.py = p[1];
      trPrendre(T.k0);
    }
    function trBouger(e) {
      if (T.id === null || T.id !== e.pointerId) return;
      if (!T.actif) {
        var dx = e.clientX - T.x0, dy = e.clientY - T.y0;
        if (dx * dx + dy * dy < SEUIL_TRACE * SEUIL_TRACE) return;
        trDemarrer(e);
      }
      if (T.etat !== 'trace') return;
      if (e.cancelable) e.preventDefault();
      var G = trRepere(), r = ACCROCHE / G.k;
      var evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
      if (!evs.length) evs = [e];
      for (var i = 0; i < evs.length; i++) {
        var p = trDock(G, evs[i].clientX, evs[i].clientY), prises = trFrolees(T.px, T.py, p[0], p[1], r);
        T.px = p[0]; T.py = p[1];
        for (var j = 0; j < prises.length; j++) { trPrendre(prises[j]); if (T.etat !== 'trace') return; }
      }
      var q = trDock(G, e.clientX, e.clientY);
      trVif(q[0], q[1]);
    }
    /* Fin du geste (lâcher, annulation, ou le code trouvé) ; vrai s'il y avait un tracé */
    function trFin() {
      var id = T.id, actif = T.actif;
      T.id = null; T.actif = false;
      if (id !== null) { try { if (sec.hasPointerCapture && sec.hasPointerCapture(id)) sec.releasePointerCapture(id); } catch (er) {} }
      HTML.classList.remove('kz-apps-trace');
      if (actif) T.taire = maintenant();
      return actif;
    }
    function trLacher(e) {
      if (T.id === null || T.id !== e.pointerId) return;
      if (trFin() && T.etat === 'trace') trEffacer();
    }
    tabEls.forEach(function (t, k) { t.addEventListener('pointerdown', function (e) { trArmer(e, k); }); });
    sec.addEventListener('pointermove', trBouger, { passive: false });
    D.addEventListener('pointerup', trLacher, true);
    D.addEventListener('pointercancel', trLacher, true);
    sec.addEventListener('lostpointercapture', function (e) { if (e.target === sec) trLacher(e); });
    sec.addEventListener('contextmenu', function (e) { if (T.actif || T.etat === 'feu') e.preventDefault(); });

    /* Le code : les fils s'allument un à un, la constellation s'embrase et se resserre en un point de lumière,
       qui devient la Terre ; on plonge vers elle (shared/cordon.js : la plongée, l'éclat d'atmosphère, createur.html#porte) */
    function trEcran() {   /* le centre de la constellation, à l'écran */
      var G = trRepere();
      return { x: G.l + T.cx * G.k, y: G.t + T.cy * G.k };
    }
    /* La caméra plonge vers ce point : les couches grossissent selon leur profondeur, les étoiles filent */
    function trPlonger(x, y) {
      var r = sec.getBoundingClientRect(), sx = x - r.left, sy = y - r.top;
      E.plonge = maintenant(); E.plongeX = sx; E.plongeY = sy;
      sec.classList.add('is-saut');
      E.couches.forEach(function (el, j) {
        var z = ZOOM[j], lx = sx - el.offsetLeft, ly = sy - el.offsetTop;
        el.style.transform = 'translate(' + px(lx + (E.W / 2 - sx) * z[1] - z[0] * lx) + ',' + px(ly + (E.H / 2 - sy) * z[1] - z[0] * ly) + ') scale(' + z[0] + ')';
      });
      if (!E.raf && E.actif && W.requestAnimationFrame) E.raf = requestAnimationFrame(boucle);
    }
    function trReussir() {
      T.etat = 'feu';
      E.saut = true;                 /* plus de fiche, de départ, de reflet ni d'étoile filante */
      trFin();
      T.vif.classList.remove('is-on');
      var rm = reduit(), seq = T.seq.slice(), els = seq.map(function (k) { return tabEls[k]; });
      var cx = 0, cy = 0, R = 0;
      seq.forEach(function (k) { cx += E.pts[k].x; cy += E.pts[k].y; });
      cx /= seq.length; cy /= seq.length;
      seq.forEach(function (k) { var dx = E.pts[k].x - cx, dy = E.pts[k].y - cy; R = Math.max(R, Math.sqrt(dx * dx + dy * dy)); });
      T.cx = cx; T.cy = cy;
      var r0 = R * .8 + 50;
      T.brasier.setAttribute('cx', n1(cx)); T.brasier.setAttribute('cy', n1(cy)); T.brasier.setAttribute('r', n1(r0));

      /* 1. Les fils s'allument un à un */
      els.forEach(function (t, i) {
        trAt(rm ? 0 : .11 * i, function () {
          t.classList.add('is-feu');
          if (i > 0 && T.segs[i - 1]) T.segs[i - 1].classList.add('is-feu');
          eclat(seq[i]);
        });
      });
      /* 2. La constellation s'embrase */
      trAt(rm ? 0 : .52, function () { sec.classList.add('is-embrase'); });

      if (rm) {   /* Mouvement réduit : pas de resserrement, des fondus ; la planète apparaît, puis l'éclat */
        trAt(.25, function () {
          els.concat([T.g]).forEach(function (el) { el.style.transition = 'opacity .35s linear'; el.style.opacity = '0'; });
        });
        trAt(.7, function () { trPorte(trEcran()); });
        return;
      }
      /* 3. Elle se resserre vers son centre, en un point de lumière… */
      trAt(.98, function () {
        els.forEach(function (t) { t.style.transition = 'none'; });
        T.g.style.transition = 'none';
        trTween(.62, trEntre, function (k) {
          els.forEach(function (t, i) {
            var P = E.pts[seq[i]];
            t.style.translate = px((cx - P.x) * k) + ' ' + px((cy - P.y) * k);
            t.style.scale = f3(1 - .82 * k);
            t.style.opacity = f3(1 - k * k);
          });
          T.g.setAttribute('transform', 'translate(' + n1(cx) + ' ' + n1(cy) + ') scale(' + f3(1 - .9 * k) + ') translate(' + n1(-cx) + ' ' + n1(-cy) + ')');
          T.g.style.opacity = f3(1 - k * k);
          T.brasier.setAttribute('r', n1(r0 + (16 - r0) * k));
        });
      });
      /* 4. … qui devient une petite planète bleue : la Terre. On plonge vers elle. */
      trAt(1.52, function () {
        var pt = trEcran();
        trPorte(pt);
        trAt(.3, function () { T.brasier.style.transition = 'opacity .6s ease-out'; T.brasier.style.opacity = '0'; });
        trAt(.82, function () { trPlonger(pt.x, pt.y); });
      });
    }
    function trPorte(pt) {
      clearTimeout(T.secours);
      T.secours = setTimeout(traceRemettre, 9000);   /* navigation bloquée : le ciel revient au repos */
      var C = W.Cordon;
      if (C && typeof C.ouvrirPorte === 'function') {
        if (C.ouvrirPorte({ vers: PASSAGE.vers, symbole: PASSAGE.symbole, depuis: pt }) === false) traceRemettre();
        return;
      }
      try { var u = new URL(PASSAGE.vers, location.href); u.hash = 'porte'; location.href = u.href; }
      catch (e) { location.href = PASSAGE.vers.split('#')[0] + '#porte'; }
    }
    /* Retour au repos (retour arrière depuis l'autre page, navigation bloquée) */
    function traceRemettre() {
      if (!T.g) return;
      var feu = T.etat === 'feu';
      T.gen++;
      clearTimeout(T.secours);
      T.minut.forEach(clearTimeout); T.minut = [];
      trFin();
      sec.classList.remove('is-embrase');
      tabEls.forEach(function (t) {
        t.classList.remove('is-lie', 'is-feu');
        t.style.translate = ''; t.style.scale = ''; t.style.opacity = ''; t.style.transition = '';
      });
      trVider();
      T.g.removeAttribute('transform');
      T.brasier.setAttribute('r', '0');
      T.soleil.innerHTML = ''; T.soleil.style.opacity = ''; T.soleil.style.transition = '';
      T.brasier.style.opacity = ''; T.brasier.style.transition = '';
      if (feu) { E.saut = false; E.plonge = 0; sec.classList.remove('is-saut'); camera(-1); }
    }

    /* ---------- L'arrivée : les étoiles s'allument depuis le centre, les nébuleuses s'épanouissent,
       puis les six astres s'allument un à un, chacun avec un éclat ; les fils se tracent ---------- */
    function espaceArrivee(anime) {
      E.an.forEach(function (x) { try { x.cancel(); } catch (e) {} });
      E.an = [];
      E.minut.forEach(clearTimeout);
      E.minut = [];
      E.cielPret = false;
      var rm = reduit();
      E.arrivee = anime && !rm ? maintenant() : 0;
      sec.classList.remove('is-arrive');
      void sec.offsetWidth;
      sec.classList.add('is-arrive');
      var fin = function () { E.cielPret = true; E.glint.proch = maintenant() + 1600; };
      if (!anime || !dock.animate) { fin(); return; }
      var t0 = rm ? 0 : 650, pas = rm ? 0 : 150;
      tabEls.forEach(function (t, i) {
        E.an.push(t.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] :
          [{ opacity: 0, scale: '.15', filter: 'brightness(3) blur(4px)' }, { opacity: 1, scale: '1', filter: 'brightness(1) blur(0px)' }],
          { duration: rm ? 200 : 950, delay: t0 + i * pas, easing: EXPO, fill: 'backwards' }));
        if (!rm) E.minut.push(setTimeout(function () { eclat(i, true); }, t0 + i * pas + 60));
      });
      E.lignes.forEach(function (l, i) {
        E.an.push(l.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
          { duration: rm ? 200 : 800, delay: rm ? 0 : t0 + (i + 1) * pas + 250, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' }));
      });
      E.minut.push(setTimeout(fin, rm ? 200 : t0 + APPS.length * pas + 1000));
    }

    /* ---------- Visible ou non : le ciel joue, ou se met en pause ---------- */
    function voir(oui) {
      if (oui === visible) return;
      visible = oui;
      espaceActif();
      if (E.ficheTl) { if (oui) E.ficheTl.play(); else E.ficheTl.pause(); }
      if (oui && !vu) {
        vu = true;
        sec.classList.add('is-vu');
        espaceMesurer();
        espaceArrivee(true);
      }
    }
    if ('IntersectionObserver' in W) {
      sec.classList.add('is-pret');
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { voir(en.isIntersecting && en.intersectionRatio >= .28); });
      }, { threshold: [0, .28, .5] }).observe(sec);
    } else {
      voir(true);
    }
    D.addEventListener('visibilitychange', espaceActif);
    function remesurer() { espaceMesurer(); }
    if (W.ResizeObserver) new ResizeObserver(remesurer).observe(sec);
    W.addEventListener('resize', remesurer);

    /* ---------- Le cadre (téléphone / arche) : sans effet dans l'espace, gardé pour l'outil de revue ---------- */
    function cadreOk(v) { return v === 'arche' ? 'arche' : 'telephone'; }
    sec.setAttribute('data-cadre', cadreOk(sec.getAttribute('data-cadre')));
    function setCadre(v) {
      v = cadreOk(v);
      if (sec.getAttribute('data-cadre') !== v) { sec.setAttribute('data-cadre', v); emettre(sec, 'kz-apps:cadre', { cadre: v }); }
      return v;
    }
    D.addEventListener('kz-revue:cadre', function (e) { if (e && e.detail && e.detail.cadre) setCadre(e.detail.cadre); });

    espaceConstruire();
    espaceMesurer();
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(remesurer);
    function index(slug) { return APPS.map(function (a) { return a.slug; }).indexOf(slug); }
    var api = {
      fiche: function (slug) { var i = index(slug); if (i > -1) ficheOuvrir(i); },
      fermer: function () { ficheFermer(); },
      explorer: function (slug) { var i = index(slug); if (i > -1) explorer(i); },
      setCadre: setCadre,
      cadre: function () { return sec.getAttribute('data-cadre'); }
    };
    sec.kzApps = api;
    /* Raccourci réservé aux tests (?test-code dans l'adresse) : la réussite du code, sans tracer. Jamais dans un lien. */
    if (/[?&]test-code(?:[=&]|$)/.test(location.search)) {
      var essai = function () {
        if (!vu || !E.cielPret || T.etat !== 'repos' || E.saut) { setTimeout(essai, 250); return; }
        CODE.forEach(function (slug) { var k = index(slug); if (k > -1 && T.seq.indexOf(k) < 0 && T.etat !== 'feu') trPrendre(k); });
      };
      setTimeout(function () {
        try { W.scrollTo(0, sec.getBoundingClientRect().top + (W.pageYOffset || 0) - Math.max(0, (W.innerHeight - sec.offsetHeight) / 2)); } catch (e) {}
        setTimeout(essai, 900);
      }, 700);
    }
    emettre(sec, 'kz-apps:pret', { slug: APPS[0].slug });
    return api;
  }

  function tout() { arr(D.querySelectorAll('[data-kz-apps]')).forEach(init); }
  W.KzApps = { pret: true, init: init, apps: APPS.map(function (a) { return { slug: a.slug, nom: a.nom, domaine: a.domaine, couleur: a.couleur, depuis: a.depuis }; }) };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout); else tout();
})();
