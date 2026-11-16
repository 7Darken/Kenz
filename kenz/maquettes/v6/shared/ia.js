/* ==========================================================================
   La machine : montrer, sans un mot technique, que Kenz construit des systèmes qui font le travail,
   et que le visiteur garde la main. Brief : maquettes/v6/BRIEF-V6-IA.md. Styles : shared/ia.css.

   BRANCHEMENT (après shared/theme.css et shared/theme.js, dont il prend les jetons clair / sombre)
     <head>  <link rel="stylesheet" href="shared/ia.css">
     </body> <script src="shared/ia.js" defer></script>      (aucune dépendance : ni GSAP, ni Lenis)

   DEUX MODES
     1. Complet (agents.html) : le choix du cas, la machine, « Dans la vraie vie », puis « Et chez vous ? ».
        <section class="kz-ia" data-kz-ia="complet" data-contact="#contact" data-chapitre data-aura="centre"
                 aria-label="La machine, sur quatre vrais cas"></section>
        Si la section porte data-chapitre, « Et chez vous ? » devient un chapitre du fil (data-chapitre, data-aura="gauche").
     2. Aperçu (accueil Pro) : un seul cas qui se joue tout seul, en boucle douce tant qu'il est à l'écran,
        puis « Voir comment » vers agents.html (lien data-passage, repris par la page pour la transition).
        <div class="kz-ia" data-kz-ia="apercu" data-cas="recette" data-lien="agents.html"></div>

   OPTIONS (attributs de l'hôte)
     data-cas       cas de départ : recette | assiette | video | projet   (défaut : recette)
     data-lien      aperçu : cible de « Voir comment » (défaut agents.html ; data-lien="" : pas de lien)
     data-contact   complet : cible de « Parlons de votre process » (défaut #contact)
     data-base      préfixe des images (défaut : déduit de l'adresse de ce script, ex. "../" pour une page dans _test/)

   LE RÉCIT D'UN CAS (chaque étape dure moins d'une seconde)
     l'entrée réelle apparaît → le jeton de lumière (le fil de la base commune) avance de station en station
     → il s'arrête à « Vous validez » : rien ne bouge jusqu'au clic du visiteur sur « Valider »
     → la sortie réelle apparaît avec un léger éclat. Mouvement réduit : pas de trajet, des fondus.

   API
     hote.kzIa.cas('assiette')   change de cas et le rejoue
     hote.kzIa.rejouer()         rejoue le cas courant
     hote.kzIa.valider()         équivaut au clic sur « Valider »
     hote.kzIa.etat()            'repos' | 'marche' | 'attente' | 'fait'
   Événements : document « kz-ia:pret » {mode} ; hôte « kz-ia:valide » {cas}.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  if (W.KzIa) return;

  var SCRIPT = D.currentScript;
  var BASE = (function () { try { return new URL('../', SCRIPT && SCRIPT.src ? SCRIPT.src : location.href).href; } catch (e) { return ''; } })();
  var MQ_RM = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ_RM && MQ_RM.matches); }
  function arr(x) { return Array.prototype.slice.call(x || []); }
  var uid = 0;

  /* ------------------------------------------------------------------------
     Pictogrammes : un trait fin, dessinés sur 24 × 24
     ------------------------------------------------------------------------ */
  var P = {
    oreille: '<path d="M7 9.5a5 5 0 0 1 10 0c0 2.8-2.2 3.9-3.3 5.3-.9 1.1-.6 3.7-3 3.7A2.7 2.7 0 0 1 8 16"/><path d="M10 9.7a2 2 0 0 1 4 0c0 1.1-.9 1.5-1.4 2.3"/>',
    ampoule: '<path d="M9.5 17.5h5M10.5 20.5h3M12 3.5a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3.5z"/>',
    balance: '<path d="M12 4.5v15M8 19.5h8M5.5 8h13"/><path d="M5.5 8 3 13.5a2.7 2.7 0 0 0 5 0L5.5 8zM18.5 8 16 13.5a2.7 2.7 0 0 0 5 0L18.5 8z"/>',
    oeil: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    cible: '<path d="M4 8.5v-3A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3"/><circle cx="12" cy="12" r="3.2"/>',
    compte: '<rect x="5.5" y="3.5" width="13" height="17" rx="2.5"/><path d="M8.5 7.5h7M8.7 11.5h.01M12 11.5h.01M15.3 11.5h.01M8.7 15h.01M12 15h.01M15.3 15h.01"/>',
    ciseaux: '<circle cx="6.5" cy="7" r="2.5"/><circle cx="6.5" cy="17" r="2.5"/><path d="M8.6 8.4 19.5 17.5M8.6 15.6 19.5 6.5"/>',
    eclat: '<path d="M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z"/><path d="M18 14.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>',
    livre: '<path d="M3.5 6.5c3-1.4 5.8-1.4 8.5 0 2.7-1.4 5.5-1.4 8.5 0v11.5c-3-1.4-5.8-1.4-8.5 0-2.7-1.4-5.5-1.4-8.5 0z"/><path d="M12 6.5V18"/>',
    dossier: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l2 2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M3.5 11h17"/>',
    crayon: '<path d="M4.5 19.5l1-4L15.8 5.2a2.1 2.1 0 0 1 3 3L8.5 18.5z"/><path d="M14 7l3 3"/>',
    vous: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c1.1-3.4 3.6-5.2 6.5-5.2s5.4 1.8 6.5 5.2"/>',
    coche: '<path d="M6 12.5l4 4 8-9"/>',
    video: '<rect x="6.5" y="3" width="11" height="18" rx="2.6"/><path d="M10.5 9.7v4.6l4-2.3z"/>',
    photo: '<rect x="3.5" y="6" width="17" height="13" rx="2.5"/><path d="M8.5 6l1.3-2h4.4l1.3 2"/><circle cx="12" cy="12.5" r="3.2"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9h17M3.5 15h17M8 5v4M16 5v4M8 15v4M16 15v4"/>',
    notes: '<path d="M7 3.5h7.5l3.5 3.5v13.5H7z"/><path d="M14.5 3.5V7H18M9.5 11h6M9.5 14h6M9.5 17h3.5"/>',
    loupe: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l4.5 4.5"/>',
    tableur: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10"/>',
    produit: '<rect x="6.5" y="3" width="11" height="18" rx="2.6"/><path d="M12 8.2l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/>',
    rejouer: '<path d="M2.6 8a5.4 5.4 0 1 0 1.7-3.9"/><path d="M2.6 2.6v3h3"/>',
    fleche: '<path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5"/>'
  };
  function svg(n, cls) { return '<svg class="' + (cls || 'kz-ia__ico') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + P[n] + '</svg>'; }
  function svg16(n) { return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + P[n] + '</svg>'; }

  /* ------------------------------------------------------------------------
     Les entrées, dessinées (rien d'inventé : des formes, pas de données)
     ------------------------------------------------------------------------ */
  var ENTREE = {
    video: function (k) {
      return '<div class="kz-ia__e kz-ia__e--video"><svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<defs><radialGradient id="kzT' + k + '" cx="50%" cy="40%" r="72%"><stop offset="0" stop-color="#6A4E3A"/><stop offset="1" stop-color="#1F1712"/></radialGradient>' +
        '<radialGradient id="kzS' + k + '" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#FCEBC0"/><stop offset="1" stop-color="#E4BC6E"/></radialGradient>' +
        '<linearGradient id="kzV' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient></defs>' +
        '<rect width="90" height="160" fill="url(#kzT' + k + ')"/>' +
        '<ellipse cx="46" cy="71" rx="40" ry="37" fill="#140F0B" opacity=".45"/><circle cx="45" cy="66" r="37" fill="#EDE5D8"/><circle cx="45" cy="66" r="29" fill="#F8F3EB"/><circle cx="45" cy="66" r="24" fill="url(#kzS' + k + ')"/>' +
        '<g fill="none" stroke="#F7DC94" stroke-width="2.4" stroke-linecap="round"><path d="M28 60c6-8 16-8 20 0s12 10 18 2"/><path d="M26 70c8-6 14 4 22-2s14-8 18 0"/><path d="M32 78c6-4 12 4 18-1s10-5 14 1"/><path d="M34 52c4-4 10-4 14 0s10 4 12 1"/></g>' +
        '<g transform="translate(60 53)"><circle r="8.5" fill="#F2CF3A"/><circle r="7" fill="#FBE68A"/><path d="M0 0V-7M0 0L6-3.5M0 0L6 3.5M0 0V7M0 0L-6 3.5M0 0L-6-3.5" stroke="#F2CF3A" stroke-width=".9"/></g>' +
        '<ellipse cx="33" cy="58" rx="5.4" ry="2.6" fill="#5C8F45" transform="rotate(-35 33 58)"/><ellipse cx="38" cy="54.5" rx="4.4" ry="2.2" fill="#76A85A" transform="rotate(20 38 54.5)"/>' +
        '<rect width="90" height="160" fill="url(#kzV' + k + ')"/>' +
        '<g fill="#fff"><path d="M80 112.5s-4.4-2.8-4.4-6.3a2.5 2.5 0 0 1 4.4-1.6 2.5 2.5 0 0 1 4.4 1.6c0 3.5-4.4 6.3-4.4 6.3z"/><path d="M81 120l4.4 4-4.4 4v-2.5c-2.8 0-4.4.8-5.6 2.8.3-3.1 1.9-5.3 5.6-5.8z"/></g>' +
        '<rect x="7" y="138" width="44" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="7" y="145" width="30" height="3" rx="1.5" fill="#fff" opacity=".55"/>' +
        '<rect x="5" y="153" width="80" height="1.6" rx=".8" fill="#fff" opacity=".3"/><rect class="kz-ia__lecture" x="5" y="153" width="80" height="1.6" rx=".8" fill="#fff"/>' +
        '</svg></div>';
    },
    assiette: function () {
      return '<div class="kz-ia__e kz-ia__e--assiette"><svg viewBox="0 0 200 200" aria-hidden="true">' +
        '<rect width="200" height="200" rx="18" fill="#2B3A33"/>' +
        '<circle cx="100" cy="106" r="80" fill="#04100A" opacity=".45"/><circle cx="100" cy="100" r="79" fill="#E6E0D2"/><circle cx="100" cy="100" r="65" fill="#F4F0E6"/>' +
        '<path d="M53 103C50 83 68 70 86 73c17 3 22 22 15 37-7 15-42 15-48-7z" fill="#FFFDF7"/>' +
        '<g transform="rotate(-14 130 86)"><rect x="104" y="72" width="52" height="29" rx="13" fill="#F28E6C"/><path d="M116 76c3 7 3 15 0 22M128 74c4 8 4 18 0 26M140 75c3 8 3 17 0 25" stroke="#FFC4AA" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/></g>' +
        '<circle cx="120" cy="128" r="13" fill="#4E9C5C"/><circle cx="137" cy="121" r="10" fill="#68B46C"/><circle cx="130" cy="141" r="9.5" fill="#3F8A4E"/><circle cx="147" cy="135" r="8" fill="#5BAA60"/>' +
        '<g transform="rotate(-24 82 140)"><ellipse cx="82" cy="140" rx="19" ry="10" fill="#BFD776"/><ellipse cx="82" cy="140" rx="13" ry="6.4" fill="#E7EFAE"/></g>' +
        '<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".92"><path d="M14 40V22a8 8 0 0 1 8-8h18M160 14h18a8 8 0 0 1 8 8v18M186 160v18a8 8 0 0 1-8 8h-18M40 186H22a8 8 0 0 1-8-8v-18"/></g>' +
        '</svg></div>';
    },
    video2: function () {
      var clip = function (r, x, y) {
        return '<span class="kz-ia__clip" style="--r:' + r + 'deg; --x:' + x + '%; --y:' + y + '%"><svg viewBox="0 0 120 70" aria-hidden="true"><rect width="120" height="70" rx="9" fill="#1E2433"/>' +
          '<path d="M53 26v18l15-9z" fill="#F4EFE6" opacity=".9"/><path d="M10 58h4M17 54v8M22 56v4M27 52v12M32 55v6M37 57v2M42 53v10M47 56v4M52 58h3M60 55v6M65 52v12M70 56v4M75 54v8M80 57v2M85 55v6M90 53v10M95 56v4M100 58h4M108 55v6" stroke="#9DB8FF" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></svg></span>';
      };
      return '<div class="kz-ia__e kz-ia__e--rushs">' + clip(-7, 0, 0) + clip(5, 14, 30) + clip(-3, 4, 60) +
        '<span class="kz-ia__idee">' + svg('ampoule') + '<i></i><i></i></span></div>';
    },
    notes: function () {
      var note = function (cls, r, lignes) {
        var h = '';
        for (var i = 0; i < lignes.length; i++) h += '<i style="width:' + lignes[i] + '%"></i>';
        return '<span class="kz-ia__note ' + cls + '" style="--r:' + r + 'deg">' + h + '</span>';
      };
      return '<div class="kz-ia__e kz-ia__e--notes">' + note('kz-ia__note--a', -6, [82, 64, 74, 40]) + note('kz-ia__note--b', 4, [70, 88, 52]) +
        '<span class="kz-ia__bulle"><i style="width:78%"></i><i style="width:52%"></i></span>' + note('kz-ia__note--c', -2, [60, 76, 48]) + '</div>';
    }
  };

  /* La fiche projet, dessinée (le format réel des fiches ; aucune donnée) */
  function fiche() {
    var ligne = function (t, w) { return '<p class="kz-ia__fl"><b>' + t + '</b>' + w.map(function (x) { return '<i style="width:' + x + '%"></i>'; }).join('') + '</p>'; };
    return '<div class="kz-ia__s kz-ia__s--fiche"><p class="kz-ia__ft">' + svg('dossier') + '<span>Fiche du projet</span></p>' +
      ligne('Où on en est', [92, 70]) + ligne('Prochaine action', [80]) + ligne('À vous', [56]) + '</div>';
  }

  /* ------------------------------------------------------------------------
     Les quatre vrais cas (tirés du travail réel de Kenz ; rien d'autre)
     ------------------------------------------------------------------------ */
  var CAS = {
    recette: {
      titre: 'Une vidéo devient une recette', picto: 'video', entree: 'video', legE: 'Une vidéo de recette',
      etapes: [['oreille', 'Écoute'], ['ampoule', 'Comprend'], ['balance', 'Pèse']],
      sortie: { img: 'assets/apps/oshii-ecran-2.jpg', w: 462, h: 1000, forme: 'portrait', alt: 'Écran d’Oshii : la fiche « Cheese Nans & Kefta », avec calories, glucides, protéines et lipides.' },
      legS: 'La recette, pesée et rangée',
      vraie: 'c’est Oshii, mon app en ligne sur l’App Store et Google Play.',
      fin: 'La recette est pesée et rangée.'
    },
    assiette: {
      titre: 'Une photo devient un suivi', picto: 'photo', entree: 'assiette', legE: 'La photo d’un plat',
      etapes: [['oeil', 'Regarde'], ['cible', 'Reconnaît'], ['compte', 'Compte']],
      sortie: { img: 'assets/apps/wado-ecran-1.jpg', w: 1000, h: 703, forme: 'paysage', alt: 'Écran de Wado sur tablette : « Muscu et calories, un seul plan », la journée avec le déjeuner à scanner et la séance du jour.' },
      legS: 'Le repas compté, le plan ajusté',
      vraie: 'c’est Wado, mon app de nutrition et de muscu, sur l’App Store.',
      fin: 'Le repas est compté, le plan s’ajuste.'
    },
    video: {
      titre: 'Des idées deviennent des vidéos', picto: 'film', entree: 'video2', legE: 'Des rushs et une idée',
      etapes: [['oreille', 'Écoute'], ['ciseaux', 'Coupe'], ['eclat', 'Habille']],
      sortie: { img: 'assets/img/video-chine-14-jours.jpg', w: 960, h: 540, forme: 'video', alt: 'Miniature d’une vidéo de voyage de Kenz : « 14 jours » en Chine, devant la Grande Muraille.' },
      legS: 'Une vidéo prête à poster',
      vraie: 'c’est mon atelier vidéo : plus de 60 vidéos courtes y sont nées.',
      fin: 'La vidéo est prête à poster.'
    },
    projet: {
      titre: 'Des notes deviennent un projet clair', picto: 'notes', entree: 'notes', legE: 'Des notes en vrac',
      etapes: [['livre', 'Lit'], ['dossier', 'Range'], ['crayon', 'Met à jour']],
      sortie: { fiche: true, forme: 'fiche' },
      legS: 'Une fiche claire : où on en est',
      vraie: 'c’est mon studio. Des agents ont chacun leur rôle, Hermes les coordonne, et rien ne part sans validation.',
      fin: 'La fiche du projet est à jour.'
    }
  };
  var ORDRE = ['recette', 'assiette', 'video', 'projet'];

  /* « Et chez vous ? » : les besoins dans vos mots (agents.cas[].titreClient), et la réponse simple */
  var BESOINS = [
    { picto: 'loupe', dit: 'Je passe trop de temps à chercher et trier l’info.', fait: 'Elle suit vos sources, écarte les doublons et vous remet une note datée, chaque ligne avec sa source.', vous: 'Décider quoi faire de l’information.' },
    { picto: 'film', dit: 'Je veux publier plus de contenu sans y passer mes soirées.', fait: 'Elle prépare les montages, les sous-titres et les visuels, à votre charte.', vous: 'Votre voix, votre accord, et la publication.' },
    { picto: 'dossier', dit: 'Personne ne sait où en est un dossier.', fait: 'Elle tient une fiche par dossier : où on en est, ce qui a été décidé, la prochaine action.', vous: 'Les décisions.' },
    { picto: 'tableur', dit: 'Mon back-office, c’est un tableur.', fait: 'Elle vous donne un espace clair pour voir vos chiffres et modifier vos contenus, sans code.', vous: 'Les décisions à partir des chiffres.' },
    { picto: 'produit', dit: 'Je veux de l’IA dans mon produit.', fait: 'Elle ajoute une fonction utile, avec un coût suivi et un interrupteur pour l’éteindre en une seconde.', vous: 'Le choix de la fonction, et le moment de l’allumer.' }
  ];

  /* ------------------------------------------------------------------------
     Le rendu
     ------------------------------------------------------------------------ */
  function htmlSortie(c, base) {
    if (c.sortie.fiche) return fiche();
    var s = c.sortie;
    return '<div class="kz-ia__s kz-ia__s--' + s.forme + '"><img src="' + base + s.img + '" alt="' + s.alt + '" width="' + s.w + '" height="' + s.h + '" loading="lazy" decoding="async">' +
      (s.forme === 'video' ? '<span class="kz-ia__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9.5 7.5v9l7.5-4.5z"/></svg></span>' : '') + '</div>';
  }
  function htmlMachine(c, k, base, apercu) {
    var st = c.etapes.map(function (e, i) {
      return '<li class="kz-ia__st" data-i="' + i + '"><span class="kz-ia__pt">' + svg(e[0]) + '</span><span class="kz-ia__v">' + e[1] + '</span></li>';
    }).join('');
    st += '<li class="kz-ia__st kz-ia__st--vous" data-i="' + c.etapes.length + '"><span class="kz-ia__pt">' + svg('vous', 'kz-ia__ico kz-ia__ico--vous') + svg('coche', 'kz-ia__ico kz-ia__ico--ok') + '</span>' +
      '<span class="kz-ia__v"><span class="kz-ia__v1">Vous validez</span><span class="kz-ia__v2">Validé</span></span>' +
      '<button class="kz-ia__ok" type="button" tabindex="-1"' + (apercu ? ' aria-hidden="true"' : '') + '>Valider</button></li>';
    return '<div class="kz-ia__scene">' +
      '<figure class="kz-ia__zone kz-ia__zone--e"><div class="kz-ia__carte">' + ENTREE[c.entree](k) + '</div><figcaption class="kz-ia__leg">' + c.legE + '</figcaption></figure>' +
      '<div class="kz-ia__piste"><i class="kz-ia__ligne"><i></i></i><ol class="kz-ia__sts">' + st + '</ol><i class="kz-ia__jeton" aria-hidden="true"></i></div>' +
      '<figure class="kz-ia__zone kz-ia__zone--s"><div class="kz-ia__carte">' + htmlSortie(c, base) + '<i class="kz-ia__eclat" aria-hidden="true"></i></div><figcaption class="kz-ia__leg">' + c.legS + '</figcaption></figure>' +
      '</div>';
  }

  /* ------------------------------------------------------------------------
     Une machine : l'hôte, son état, son minutage
     ------------------------------------------------------------------------ */
  function Machine(hote) {
    var mode = hote.getAttribute('data-kz-ia') === 'apercu' ? 'apercu' : 'complet';
    var base = hote.hasAttribute('data-base') ? hote.getAttribute('data-base') : BASE;
    var cas = CAS[hote.getAttribute('data-cas')] ? hote.getAttribute('data-cas') : 'recette';
    var k = ++uid;
    var etat = 'repos', timers = [], vu = false, rafPose = 0;
    var el = {};
    var self = this;

    hote.classList.add('kz-ia', 'kz-ia--' + mode);
    hote.textContent = '';

    /* --- Le squelette --- */
    var tete = '';
    if (mode === 'complet') {
      tete = '<div class="kz-ia__choix" role="group" aria-label="Choisir un exemple">' + ORDRE.map(function (id) {
        return '<button class="kz-ia__c" type="button" data-cas="' + id + '" aria-pressed="false"><span class="kz-ia__cpt">' + svg(CAS[id].picto) + '</span><span class="kz-ia__ct">' + CAS[id].titre + '</span></button>';
      }).join('') + '</div>';
    } else {
      tete = '<p class="kz-ia__titre">' + CAS[cas].titre + '</p>';
    }
    var corps = '<div class="kz-ia__machine bezel"><div class="kz-ia__core bezel__core" role="group" aria-label="La machine">' +
      '<div class="kz-ia__stage"></div>' +
      (mode === 'complet' ? '<button class="replay kz-ia__rejouer" type="button">' + svg16('rejouer') + 'Rejouer</button>' : '') +
      '</div></div>' +
      '<p class="kz-ia__vraie"><em>Dans la vraie vie</em>&nbsp;: <span></span></p>' +
      '<p class="sr" aria-live="polite" data-kz-ia-live></p>';
    var lien = hote.hasAttribute('data-lien') ? hote.getAttribute('data-lien') : 'agents.html';
    var pied = (mode === 'apercu' && lien) ? '<a class="btn btn--light kz-ia__voir" href="' + lien + '" data-passage data-couleur="#1A2440" data-couleur-clair="#E9EDEF">Voir comment<span class="btn__ico" aria-hidden="true">' + svg16('fleche') + '</span></a>' : '';

    if (mode === 'complet') {
      hote.innerHTML = '<div class="wrap kz-ia__w">' + tete + corps + '</div>' + chezVous(hote);
    } else {
      hote.innerHTML = tete + corps + pied;
    }
    el.stage = hote.querySelector('.kz-ia__stage');
    el.machine = hote.querySelector('.kz-ia__machine');
    el.vraie = hote.querySelector('.kz-ia__vraie span');
    el.live = hote.querySelector('[data-kz-ia-live]');
    el.rejouer = hote.querySelector('.kz-ia__rejouer');
    el.choix = arr(hote.querySelectorAll('.kz-ia__c'));
    el.titre = hote.querySelector('.kz-ia__titre');

    function dire(t) { if (el.live) el.live.textContent = t; }
    function apres(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function stop() { timers.forEach(clearTimeout); timers = []; }

    /* --- Monter un cas --- */
    function monter(id) {
      stop();
      cas = id;
      var c = CAS[id];
      el.stage.innerHTML = htmlMachine(c, k, base, mode === 'apercu');
      el.vraie.textContent = c.vraie;
      if (el.titre) el.titre.textContent = c.titre;
      el.choix.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cas') === id)); });
      el.scene = el.stage.querySelector('.kz-ia__scene');
      el.piste = el.stage.querySelector('.kz-ia__piste');
      el.ligne = el.stage.querySelector('.kz-ia__ligne');
      el.jeton = el.stage.querySelector('.kz-ia__jeton');
      el.sts = arr(el.stage.querySelectorAll('.kz-ia__st'));
      el.ok = el.stage.querySelector('.kz-ia__ok');
      el.ok.addEventListener('click', function () { valider(); });
      etat = 'repos';
      hote.setAttribute('data-etat', 'repos');
      el.machine.classList.remove('has-tl');
      if (el.rejouer) el.rejouer.classList.remove('is-on');
      poser(-1, true);
    }

    /* --- La géométrie : la ligne et le jeton suivent les stations (horizontale ou verticale) --- */
    var pos = -1;
    function vertical() { return el.sts.length > 1 && el.sts[1].offsetTop > el.sts[0].offsetTop + 8; }
    function centre(i) {
      var pt = el.sts[i].querySelector('.kz-ia__pt'), ol = el.sts[i].parentNode;
      return { x: ol.offsetLeft + el.sts[i].offsetLeft + pt.offsetLeft + pt.offsetWidth / 2, y: ol.offsetTop + el.sts[i].offsetTop + pt.offsetTop + pt.offsetHeight / 2 };
    }
    function poser(i, net) {
      pos = i;
      if (!el.piste || !el.sts.length) return;
      var v = vertical(), Wp = el.piste.clientWidth, Hp = el.piste.clientHeight, c0 = centre(0), x, y;
      el.piste.classList.toggle('is-v', v);
      if (v) { el.ligne.style.left = c0.x + 'px'; el.ligne.style.top = '0px'; } else { el.ligne.style.top = c0.y + 'px'; el.ligne.style.left = '0px'; }
      if (i < 0) { x = v ? c0.x : 0; y = v ? 0 : c0.y; }
      else if (i >= el.sts.length) { x = v ? c0.x : Wp; y = v ? Hp : c0.y; }
      else { var c = centre(i); x = v ? c0.x : c.x; y = v ? c.y : c0.y; }
      var p = v ? y / Math.max(1, Hp) : x / Math.max(1, Wp);
      if (net) { el.piste.classList.add('is-net'); }
      el.jeton.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      el.ligne.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
      if (net) { void el.piste.offsetWidth; el.piste.classList.remove('is-net'); }
    }
    function allumer(i) {
      el.sts.forEach(function (s, j) { s.classList.toggle('is-on', j === i); s.classList.toggle('is-passe', j < i); });
    }

    /* --- Le récit --- */
    var PAS = 820; /* une étape : moins d'une seconde */
    function jouer() {
      stop();
      monter(cas);
      etat = 'marche';
      hote.setAttribute('data-etat', 'marche');
      var n = el.sts.length - 1; /* la dernière station est « Vous validez » */
      if (reduit()) {
        el.scene.classList.add('is-e');
        for (var j = 0; j < n; j++) el.sts[j].classList.add('is-passe');
        poser(n, true);
        attendre();
        return;
      }
      requestAnimationFrame(function () { el.scene.classList.add('is-e'); });
      dire('La machine se met au travail.');
      apres(560, function () { el.piste.classList.add('is-en'); });
      for (var i = 0; i < n; i++) (function (i) {
        apres(760 + i * PAS, function () { poser(i); allumer(i); if (!i) el.scene.classList.add('is-lu'); dire(CAS[cas].etapes[i][1] + '.'); });
      })(i);
      apres(760 + n * PAS, function () { poser(n); allumer(n); attendre(); });
    }
    function attendre() {
      etat = 'attente';
      hote.setAttribute('data-etat', 'attente');
      el.sts[el.sts.length - 1].classList.add('is-on', 'is-attente');
      if (mode === 'complet') {
        el.ok.removeAttribute('tabindex');
        dire('La machine s’arrête : elle attend votre validation. Bouton « Valider ».');
      } else {
        /* L'aperçu se valide tout seul, après un temps lisible */
        apres(reduit() ? 0 : 1500, function () { el.ok.classList.add('is-presse'); apres(reduit() ? 0 : 260, valider); });
      }
    }
    function valider() {
      if (etat !== 'attente') return;
      etat = 'fait';
      hote.setAttribute('data-etat', 'fait');
      var vous = el.sts[el.sts.length - 1];
      vous.classList.remove('is-attente');
      vous.classList.add('is-valide');
      el.ok.setAttribute('tabindex', '-1');
      var rm = reduit();
      if (!rm) poser(el.sts.length);
      apres(rm ? 0 : 520, function () {
        allumer(el.sts.length);
        el.scene.classList.add('is-sortie');
        dire('Validé. ' + CAS[cas].fin);
        try { hote.dispatchEvent(new CustomEvent('kz-ia:valide', { detail: { cas: cas } })); } catch (e) {}
      });
      if (mode === 'complet') {
        apres(rm ? 300 : 1700, function () {
          el.machine.classList.add('has-tl');
          if (el.rejouer) {
            el.rejouer.classList.add('is-on');
            if (D.activeElement === el.ok || D.activeElement === D.body) el.rejouer.focus({ preventScroll: true });
          }
        });
      } else if (!rm) {
        /* Boucle douce : on laisse lire, puis on repart */
        apres(4200, function () { el.scene.classList.add('is-fin'); });
        apres(4900, function () { if (vu) jouer(); else monter(cas); });
      }
    }

    /* --- Les commandes --- */
    if (el.rejouer) el.rejouer.addEventListener('click', function () { el.rejouer.classList.remove('is-on'); jouer(); });
    el.choix.forEach(function (b) {
      b.addEventListener('click', function () { cas = b.getAttribute('data-cas'); jouer(); });
    });

    /* --- À l'écran : on joue (complet : une fois ; aperçu : en boucle tant qu'il est visible) --- */
    monter(cas);
    if (mode === 'apercu' && reduit()) {
      /* Mouvement réduit : l'aperçu montre l'état final, sans boucle */
      jouer();
    } else if (W.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            /* un court temps de lecture avant que la machine démarre */
            if (!vu) { vu = true; if (etat === 'repos') apres(mode === 'complet' ? 600 : 300, function () { if (vu && etat === 'repos') jouer(); }); }
          } else if (vu) {
            vu = false;
            if (mode === 'apercu') { stop(); monter(cas); }
          }
        });
      }, { threshold: .4 });
      io.observe(el.machine);
    } else jouer();

    /* --- Redimensionnement : la ligne et le jeton se recalent sans glisser --- */
    var reposer = function () { cancelAnimationFrame(rafPose); rafPose = requestAnimationFrame(function () { poser(pos, true); }); };
    if (W.ResizeObserver) new ResizeObserver(reposer).observe(el.stage);
    else W.addEventListener('resize', reposer);

    /* --- « Et chez vous ? » --- */
    if (mode === 'complet') brancherChez(hote);

    self.cas = function (id) { if (CAS[id]) { cas = id; jouer(); } };
    self.rejouer = jouer;
    self.valider = valider;
    self.etat = function () { return etat; };
  }

  /* ------------------------------------------------------------------------
     « Et chez vous ? » : de grandes cartes ; au choix, une réponse simple et l'action
     ------------------------------------------------------------------------ */
  function chezVous(hote) {
    var chap = hote.hasAttribute('data-chapitre') ? ' data-chapitre data-aura="gauche"' : '';
    var id = 'kz-ia-rep-' + uid;
    return '<div class="kz-ia__chez"' + chap + '><div class="wrap">' +
      '<h2 class="kz-ia__h2">Et chez vous&nbsp;?</h2>' +
      '<div class="kz-ia__besoins">' + BESOINS.map(function (b, i) {
        return '<button class="kz-ia__b" type="button" data-b="' + i + '" aria-expanded="false" aria-controls="' + id + '"><span class="kz-ia__bpt">' + svg(b.picto) + '</span><span class="kz-ia__bt">' + b.dit + '</span></button>';
      }).join('') +
      '<div class="kz-ia__rep bezel" id="' + id + '" role="region" aria-live="polite" aria-label="Ce que la machine ferait pour vous"><div class="bezel__core kz-ia__repc">' +
      '<p class="kz-ia__repi">Choisissez ce qui vous ressemble.</p></div></div>' +
      '</div></div></div>';
  }
  function brancherChez(hote) {
    var cartes = arr(hote.querySelectorAll('.kz-ia__b')), rep = hote.querySelector('.kz-ia__rep'), core = rep && rep.querySelector('.kz-ia__repc');
    var grille = hote.querySelector('.kz-ia__besoins');
    var contact = hote.getAttribute('data-contact') || '#contact';
    if (!rep || !core) return;
    var MQ_UNE = W.matchMedia ? W.matchMedia('(max-width: 719px)') : null;
    var choisi = -1;
    var placer = function () {
      /* Sur téléphone, la réponse se glisse sous la carte touchée ; sinon, elle tient la dernière case de la grille */
      if (MQ_UNE && MQ_UNE.matches && choisi >= 0) cartes[choisi].after(rep);
      else grille.appendChild(rep);
    };
    cartes.forEach(function (c, i) {
      c.addEventListener('click', function () {
        var b = BESOINS[i];
        choisi = i;
        cartes.forEach(function (x, j) { x.setAttribute('aria-expanded', String(j === i)); x.classList.toggle('is-on', j === i); });
        placer();
        core.classList.remove('is-in');
        core.innerHTML = '<p class="kz-ia__rl">Ce que la machine ferait</p><p class="kz-ia__rt">' + b.fait + '</p>' +
          '<p class="kz-ia__rl">Ce qui reste à vous</p><p class="kz-ia__rt kz-ia__rt--vous">' + b.vous + '</p>' +
          '<a class="btn btn--light kz-ia__parlons" href="' + contact + '">Parlons de votre process<span class="btn__ico" aria-hidden="true">' + svg16('fleche') + '</span></a>';
        rep.classList.add('is-choisi');
        void core.offsetWidth;
        core.classList.add('is-in');
      });
    });
    if (MQ_UNE) { var f = function () { placer(); }; if (MQ_UNE.addEventListener) MQ_UNE.addEventListener('change', f); else if (MQ_UNE.addListener) MQ_UNE.addListener(f); }
  }

  /* ------------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------------ */
  function tout() {
    arr(D.querySelectorAll('[data-kz-ia]')).forEach(function (h) {
      if (h.kzIa) return;
      try { h.kzIa = new Machine(h); } catch (e) { console.error('[kz-ia] ' + e.message); }
    });
    try { D.dispatchEvent(new CustomEvent('kz-ia:pret', { detail: { mode: 'tout' } })); } catch (e) {}
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tout); else tout();

  W.KzIa = { cas: CAS, ordre: ORDRE, monter: function (h) { if (h && !h.kzIa) h.kzIa = new Machine(h); return h && h.kzIa; } };
})();
