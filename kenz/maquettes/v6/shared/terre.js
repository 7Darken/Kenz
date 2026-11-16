/* ==========================================================================
   La Terre (V6, côté Créateur) : un vrai globe en 3D. three.js r128, textures de la NASA locales.
   Brief : maquettes/v6/BRIEF-V6-TERRE.md. Styles : shared/terre.css.

   BRANCHEMENT
     <head>  <link rel="stylesheet" href="shared/terre.css">
     <body>  <div class="terre" data-terre aria-hidden="true"></div>     (le calque fixe, juste avant <main>)
     </body> <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
             <script src="shared/terre.js" defer></script>
             puis, au DOMContentLoaded : var g = Terre.creer(document.querySelector('[data-terre]'), { … });
   Textures : assets/terre/earth-night.jpg (mode sombre : la nuit et ses villes), earth-blue-marble.jpg
     (mode clair : le jour) et earth-topology.png (le relief, de jour). Ramenées à 2048 px sur mobile (canvas).
   Repli (sans three.js, sans WebGL, texture illisible, ou mouvement réduit) : une image fixe ronde, le même
     halo (assets/terre/globe-nuit.webp | globe-jour.webp, l'Asie face à nous). L'API reste la même :
     cadrer() déplace l'image ; viser(), arc(), allumer() ne font rien.

   API
     var g = Terre.creer(hote, options)          une seule instance WebGL par page
       options = {
         points:  [{ id, lat, lon, futur }]       les escales ; futur : un anneau en pointillé (prochaine escale)
         lat, lon                                  le point face à nous au départ (défaut : l'Asie)
         derive:  2.4                              rotation lente, en degrés par seconde (0 : aucune)
         arrivee: 'plongee'                        on arrive de l'espace (passage secret) : la descente finit ici
         observer: [elements]                      rendu seulement si l'un d'eux est à l'écran (défaut : l'hôte)
       }
     g.mode                          '3d' | 'repli'
     g.cadrer({ x, y, r }, opt)      place le globe à l'écran : centre et rayon apparent, en px CSS (suivi lissé)
                                     opt.saut : posé tout de suite, sans glisser (sous un fondu) ;
                                     opt.suivre : le déplacement de la cible est appliqué tel quel (le globe suit la
                                     page au défilement, sans retard) ; le reste de l'écart reste lissé
     g.orienter(lat, lon)            le point face à nous (suivi lissé : pour un trajet piloté au défilement)
     g.viser(lat, lon, { duree })    tourne vers ce point en `duree` s (défaut 1,4) -> Promise
     g.vue()                         { lat, lon } : le point face à nous en ce moment
     g.deriver(v)                    vitesse de la rotation lente (°/s) ; 0 l'arrête
     g.arc(id, de, vers, { pointille })   un arc de vol entre deux points { lat, lon } -> objet arc :
         arc.tracer(p, net)          0 → 1 : la part tracée ; une tête lumineuse avance avec elle (net : sans lissage)
         arc.vif(oui, net)           l'arc en cours (lumineux) ou déjà parcouru (atténué)
         arc.retirer()
     g.allumer(id)                   le point actif (plus gros, une onde) ; null : aucun
     g.escales(oui)                  montre ou masque les points des escales (tout de suite)
     g.opacite(v)                    fondu du calque (0 → 1) ; à 0, le rendu s'arrête
     g.suivre(fn)                    fn({ x, y, r }) à chaque image : le globe tel qu'il est dessiné (ex. masquer
                                     ce qui passe derrière l'horizon)
     g.theme('jour' | 'nuit')        déjà branché sur « kz-theme:change » (clair = jour, sombre = nuit)
     g.style('or' | 'reel')          l'heure dorée (défaut) ou la variante réaliste ; lu sur <html data-terre-style>,
                                     et branché sur « kz-revue:terre » { style } (outil de revue, shared/revue.js)
     g.pause() · g.reprendre() · g.detruire()
     Terre.supporte()                vrai si le globe 3D est possible ici (three.js, WebGL, pas de mouvement réduit)
   Événement : document « terre:prete » { mode } au premier rendu (textures prêtes, ou image de repli posée).
   Performance : DPR ≤ 1,5 ; rendu en pause hors écran (IntersectionObserver), onglet caché ou calque à 0.
   ========================================================================== */
(function () {
  'use strict';
  if (window.Terre) return;

  var D = document, W = window, H = D.documentElement;
  var SCRIPT = D.currentScript;
  var SRC = (SCRIPT && SCRIPT.src) || (function () {
    var s = D.querySelector('script[src*="terre.js"]');
    return s ? s.src : location.href;
  })();
  function chemin(rel) { try { return new URL(rel, SRC).href; } catch (e) { return rel; } }
  var TEX = {
    masque: chemin('../assets/terre/terre-masque.png'),
    jour: chemin('../assets/terre/earth-blue-marble.jpg'),
    nuit: chemin('../assets/terre/earth-night.jpg'),
    relief: chemin('../assets/terre/earth-topology.png'),
    repliJour: chemin('../assets/terre/globe-jour.webp'),
    repliNuit: chemin('../assets/terre/globe-nuit.webp')
  };
  var DISQUE = .42;          /* image de repli : rayon du disque / côté de l'image */
  var FOV = 30, RAD = Math.PI / 180;
  var ATMO = 1.04;           /* rayon maximal de la coquille d'atmosphère (elle reste fine : ≈ 10 px à l'écran) */
  var ASIE = { lat: 16, lon: 106 };

  function mq(q) { return W.matchMedia ? W.matchMedia(q) : null; }
  var MQ_RM = mq('(prefers-reduced-motion: reduce)');
  function reduit() { return !!(MQ_RM && MQ_RM.matches); }
  var PETIT = (function () { var m = mq('(max-width: 899px), (pointer: coarse)'); return !!(m && m.matches); })();
  function themeDoc() { return H.getAttribute('data-theme') === 'light' ? 'jour' : 'nuit'; }
  function borne(v, a, b) { return v < a ? a : v > b ? b : v; }
  function n180(d) { return ((d + 180) % 360 + 360) % 360 - 180; }
  function lisse(a, b, x) { var t = borne((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function expo(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function doux(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function emettre(nom, detail) { try { D.dispatchEvent(new CustomEvent(nom, { detail: detail })); } catch (e) {} }

  function webgl() {
    try {
      var c = D.createElement('canvas');
      return !!(W.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  function supporte() { return !!(W.THREE && W.THREE.WebGLRenderer) && !reduit() && webgl(); }

  /* Une image, ramenée à `max` px de large dans un canvas (et lisible : un canvas « sali » est refusé) */
  function chargerImage(url, max) {
    return new Promise(function (ok, ko) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        try {
          var w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / w);
          var c = D.createElement('canvas');
          c.width = Math.round(w * k); c.height = Math.round(h * k);
          var g = c.getContext('2d');
          g.drawImage(img, 0, 0, c.width, c.height);
          g.getImageData(0, 0, 1, 1);
          ok(c);
        } catch (e) { ko(e); }
      };
      img.onerror = function () { ko(new Error('image : ' + url)); };
      img.src = url;
    });
  }

  /* ------------------------------------------------------------------------
     Les shaders
     ------------------------------------------------------------------------ */
  var V_SURF = [
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV;',
    'void main(){',
    '  vUv = uv;',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vN = normalize(normalMatrix * normal);',
    '  vV = normalize(-mv.xyz);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  /* Le globe : le repère local (est, nord) sert au relief éclairé */
  var V_GLOBE = [
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vE; varying vec3 vNo; varying vec3 vObj;',
    'void main(){',
    '  vUv = uv;',
    '  vObj = position;',
    '  vec3 p = normalize(position);',
    '  float la = asin(clamp(p.y, -1.0, 1.0)), lo = atan(-p.z, p.x);',
    '  vE = normalize(normalMatrix * vec3(-sin(lo), 0.0, -cos(lo)));',
    '  vNo = normalize(normalMatrix * vec3(-sin(la) * cos(lo), cos(la), sin(la) * sin(lo)));',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vN = normalize(normalMatrix * normal);',
    '  vV = normalize(-mv.xyz);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  /* Deux styles, mêlés par uOr (1 : l'heure dorée, par défaut ; 0 : la variante réaliste).
     L'HEURE DORÉE (la DA de Kenz) : un soleil bas, qui se lève au bord de la planète. Les terres dans une palette
     chaude et désaturée (sable, ocre, crème), l'océan d'encre au Lagon profond, une lumière rasante dorée ;
     côté nuit, les villes en points d'or, comme des étoiles ; un liseré or côté soleil, qui tourne au Lagon puis
     à la nuit ; un grain fin. En clair (uJour = 1) : la même idée en impression, crème, sable et Lagon.
     LE RÉALISTE : la Blue Marble et son relief, un reflet sur les océans, les villes en or, un liseré bleu pâle. */
  /* LE GLOBE : cinq styles, choisis par uStyle (shared/revue.js : « Terre : Carnet / Relief / Lumière »).
       0  CARNET (par défaut) : le carnet de voyage gravé. Les côtes en traits d'encre fins (l'isoligne du masque
          terre / mer, anticrénelée par fwidth), des hachures dont la densité suit l'ombre (croisées dans le plus
          sombre), quelques parallèles et méridiens, les pays filmés à la feuille d'or (un or mat, un reflet qui
          bouge avec la rotation). Clair : encre sur papier crème, grain de papier ; sombre : carte à gratter,
          traits crème sur encre (les hachures dessinent alors la lumière). Un limbe d'encre, une ombre douce.
       1  RELIEF : la Terre en courbes de niveau (fract(h × N) sur la topologie), qui s'allument face à la caméra ;
          les pays filmés en or ; un limbe fin. Les océans restent vides.
       2  LUMIÈRE : une sphère sobre ; les continents sont la poussière de points (THREE.Points, plus bas).
       3  heure dorée, 4  réaliste : les essais précédents, gardés (hors de la pastille de revue). */
  var F_GLOBE = [
    'uniform sampler2D uTexJ; uniform sampler2D uTexN; uniform sampler2D uRelief; uniform sampler2D uMasque;',
    'uniform vec3 uSoleil; uniform vec3 uAtmo; uniform vec2 uPas; uniform float uBosse; uniform float uVilles; uniform float uAmb;',
    'uniform float uOr; uniform float uJour; uniform float uStyle; uniform float uDpr;',
    'uniform vec3 uCamObj; uniform vec3 uSoleilObj; uniform float uLod; uniform vec3 uFond;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vE; varying vec3 vNo; varying vec3 vObj;',
    '#if defined(GL_EXT_shader_texture_lod) || __VERSION__ >= 300',
    '#define LOD(t, p, l) texture2DLodEXT(t, p, l)',
    '#else',
    '#define LOD(t, p, l) texture2D(t, p)',
    '#endif',
    'float bruit(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
    'float doux(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(bruit(i), bruit(i + vec2(1.0, 0.0)), u.x), mix(bruit(i + vec2(0.0, 1.0)), bruit(i + vec2(1.0, 1.0)), u.x), u.y); }',
    /* une isoligne d'épaisseur px (pixels), anticrénelée */
    'float isoligne(float s, float niveau, float px){ float d = abs(s - niveau) / max(fwidth(s), 1e-5); return 1.0 - smoothstep(px * 0.5, px * 0.5 + 1.0, d); }',
    /* des lignes à chaque entier de s */
    'float periode(float s, float px){ float d = abs(fract(s - 0.5) - 0.5) / max(fwidth(s), 1e-5); return 1.0 - smoothstep(px * 0.5, px * 0.5 + 1.0, d); }',
    'float limbe(vec3 n, vec3 v, float px){ float d = dot(n, v), w = max(fwidth(d), 1e-5); return 1.0 - smoothstep(w * px * 0.5, w * (px * 0.5 + 1.2), d); }',
    'vec3 ancien(vec3 n, vec3 v){',
    '  float hC = texture2D(uRelief, vUv).r;',
    '  float hx = texture2D(uRelief, vUv + vec2(uPas.x, 0.0)).r - texture2D(uRelief, vUv - vec2(uPas.x, 0.0)).r;',
    '  float hy = texture2D(uRelief, vUv + vec2(0.0, uPas.y)).r - texture2D(uRelief, vUv - vec2(0.0, uPas.y)).r;',
    '  vec3 nb = normalize(n - uBosse * (hx * vE + hy * vNo));',
    '  float ndl = dot(n, uSoleil);',
    '  float jour = max(smoothstep(-0.08, 0.2, ndl), uAmb * 1.6);',
    '  float lam = max(dot(nb, uSoleil), 0.0);',
    '  vec3 tj = texture2D(uTexJ, vUv).rgb;',
    '  vec3 cj = pow(tj, vec3(1.08)) * 1.1;',
    '  float ocean = 1.0 - smoothstep(0.01, 0.045, hC);',
    '  vec3 hv = normalize(uSoleil + v);',
    '  float nh = max(dot(n, hv), 0.0);',
    '  vec3 nt = texture2D(uTexN, vUv).rgb;',
    '  float f = 1.0 - clamp(dot(n, v), 0.0, 1.0);',
    '  vec3 cd = cj * (uAmb + (1.04 - uAmb * 0.6) * lam);',
    '  cd += vec3(1.0, 0.95, 0.86) * (pow(nh, 900.0) * 0.08) * ocean * jour;',
    '  float villes = smoothstep(0.1, 0.46, nt.r);',
    '  vec3 cn = cj * 0.02 + vec3(1.0, 0.72, 0.4) * pow(villes, 1.2) * 1.45 * uVilles;',
    '  float crep = exp(-pow((ndl - 0.1) / 0.09, 2.0));',
    '  vec3 cR = mix(cn, cd, jour) + vec3(1.0, 0.55, 0.3) * crep * 0.03;',
    '  float coteR = smoothstep(-0.3, 0.7, ndl);',
    '  cR = mix(cR, uAtmo, pow(f, 3.2) * 0.62 * coteR) + uAtmo * pow(f, 7.0) * 0.3 * coteR;',
    '  float L = dot(tj, vec3(0.3, 0.59, 0.11));',
    '  vec3 terreN = mix(vec3(0.17, 0.13, 0.09), vec3(0.66, 0.5, 0.31), smoothstep(0.08, 0.42, L));',
    '  vec3 terreJ = mix(vec3(0.62, 0.52, 0.37), vec3(0.9, 0.8, 0.62), smoothstep(0.08, 0.42, L));',
    '  vec3 terre = mix(terreN, terreJ, uJour);',
    '  terre = mix(terre, vec3(0.96, 0.93, 0.86), smoothstep(0.55, 0.85, L));',
    '  terre = mix(terre, cj, 0.14);',
    '  vec3 merN = mix(vec3(0.022, 0.07, 0.085), vec3(0.05, 0.24, 0.27), smoothstep(0.06, 0.34, L));',
    '  vec3 merJ = mix(vec3(0.09, 0.32, 0.38), vec3(0.38, 0.58, 0.62), smoothstep(0.08, 0.4, L));',
    '  vec3 base = mix(terre, mix(merN, merJ, uJour), ocean);',
    '  vec3 lumiere = mix(vec3(1.0, 0.5, 0.22), vec3(1.0, 0.87, 0.68), smoothstep(0.0, 0.6, ndl));',
    '  vec3 dO = base * lumiere * (uAmb * 0.8 + uJour * 0.24 + (1.18 - uJour * 0.2) * lam) + vec3(1.0, 0.76, 0.46) * pow(nh, 900.0) * 0.1 * ocean * jour;',
    '  float vO = pow(smoothstep(0.16, 0.5, nt.r), 1.7);',
    '  vec3 nO = base * 0.05 + vec3(1.0, 0.78, 0.42) * vO * 1.75 * uVilles;',
    '  vec3 cO = mix(nO, dO, jour);',
    '  float s = dot(n, uSoleil);',
    '  vec3 lis = mix(vec3(0.2, 0.56, 0.6), vec3(1.0, 0.72, 0.4), smoothstep(0.0, 0.7, s));',
    '  float coteO = smoothstep(-0.4, 0.5, s);',
    '  cO = mix(cO, lis, pow(f, 3.0) * 0.6 * coteO) + lis * pow(f, 6.0) * 0.4 * coteO;',
    '  cO += (bruit(gl_FragCoord.xy) - 0.5) * 0.022;',
    '  return mix(cR, cO, uOr);',
    '}',
    'vec3 carnet(vec3 n, vec3 v){',
    '  vec4 m = texture2D(uMasque, vUv);',
    '  float ndl = dot(n, uSoleil);',
    '  float ombre = 1.0 - smoothstep(-0.25, 0.85, ndl);',
    '  vec3 papier = mix(vec3(0.075, 0.105, 0.12), vec3(0.957, 0.933, 0.886), uJour);',
    '  vec3 mer = mix(vec3(0.04, 0.068, 0.082), vec3(0.9, 0.915, 0.895), uJour);',
    '  vec3 encre = mix(vec3(0.93, 0.89, 0.8), vec3(0.11, 0.15, 0.18), uJour);',
    '  float terre = smoothstep(0.3, 0.7, m.r);',
    '  vec3 c = mix(mer, papier, terre);',
    '  c *= mix(1.0, mix(0.6, 0.84, uJour), ombre);',
    /* les hachures, dans le plan de l'écran : l'ombre en clair, la lumière en sombre (carte à gratter) */
    '  vec2 fc = gl_FragCoord.xy / uDpr;',
    '  float t1 = (fc.x + fc.y) * 0.17, t2 = (fc.x - fc.y) * 0.17;',
    '  float dens = mix(clamp(ndl, 0.0, 1.0) * 0.72, ombre, uJour) * mix(1.0, 0.5, terre);',
    '  float a1 = fwidth(t1), hw = dens * 0.34;',
    '  float h1 = (1.0 - smoothstep(hw - a1 * 0.5, hw + a1 * 0.5, abs(fract(t1) - 0.5))) * smoothstep(0.04, 0.12, dens);',
    '  float d2 = smoothstep(0.5, 1.0, dens);',
    '  float h2 = (1.0 - smoothstep(d2 * 0.28 - a1 * 0.5, d2 * 0.28 + a1 * 0.5, abs(fract(t2) - 0.5))) * step(0.02, d2);',
    '  c = mix(c, encre, max(h1, h2) * mix(0.5, 0.6, uJour));',
    /* les parallèles et les méridiens, tous les 15°, très discrets */
    '  float gr = max(periode(vUv.y * 12.0, 0.7), periode(vUv.x * 24.0, 0.7) * (1.0 - smoothstep(0.78, 0.92, abs(vUv.y - 0.5) * 2.0)));',
    '  c = mix(c, encre, gr * 0.13);',
    /* les pays filmés : la feuille d'or, froissée (son reflet bouge avec la rotation) */
    '  float pf = smoothstep(0.35, 0.65, m.g);',
    '  vec2 g = vUv * vec2(1100.0, 550.0);',
    '  vec3 nf = normalize(n + (vec3(doux(g), doux(g + 17.3), doux(g * 1.7 + 3.1)) - 0.5) * 0.75);',
    '  float lo = clamp(dot(nf, uSoleil) * 0.5 + 0.5, 0.0, 1.0);',
    '  float rf = pow(max(dot(reflect(-uSoleil, nf), v), 0.0), 9.0);',
    '  vec3 feuille = mix(vec3(0.55, 0.42, 0.2), vec3(0.86, 0.7, 0.41), lo) + vec3(1.0, 0.9, 0.64) * rf * 0.5;',
    '  c = mix(c, feuille, pf);',
    /* les côtes et le contour des pays filmés, à l'encre ; l'île Maurice en pointillé d'or */
    '  c = mix(c, encre, max(isoligne(m.r, 0.5, 1.25) * 0.88, isoligne(m.g, 0.5, 1.0) * 0.6));',
    '  float tir = step(0.5, fract((fc.x + fc.y) * 0.22));',
    '  c = mix(c, vec3(0.8, 0.64, 0.34), isoligne(m.b, 0.5, 1.4) * tir);',
    '  c = mix(c, encre, limbe(n, v, 1.3) * 0.8);',
    '  return c + (bruit(gl_FragCoord.xy) - 0.5) * mix(0.016, 0.03, uJour);',
    '}',
    'vec3 relief(vec3 n, vec3 v){',
    '  vec4 m = texture2D(uMasque, vUv);',
    '  float h = texture2D(uRelief, vUv).r;',
    '  float ndl = dot(n, uSoleil);',
    '  vec3 fond = mix(vec3(0.05, 0.078, 0.092), vec3(0.95, 0.93, 0.885), uJour);',
    '  vec3 trait = mix(vec3(0.9, 0.86, 0.76), vec3(0.12, 0.16, 0.19), uJour);',
    '  vec3 orA = vec3(0.86, 0.68, 0.36);',
    '  vec3 c = fond * mix(1.0, mix(0.68, 0.88, uJour), 1.0 - smoothstep(-0.3, 0.8, ndl));',
    '  float terre = smoothstep(0.3, 0.7, m.r);',
    '  float hn = h * 12.0;',
    '  float niv = periode(hn, 0.9) * smoothstep(0.004, 0.03, h) * terre * (1.0 - smoothstep(0.38, 0.75, fwidth(hn)));',
    '  float maj = 1.0 - step(0.5, mod(floor(hn + 0.5), 4.0));',
    '  float allume = 0.28 + 0.72 * pow(clamp(dot(n, v), 0.0, 1.0), 2.5);',
    '  float pf = smoothstep(0.35, 0.65, m.g);',
    '  vec3 col = mix(trait, orA, pf);',
    '  c = mix(c, orA, pf * 0.1);',
    '  c = mix(c, col, niv * (0.5 + 0.35 * maj) * allume);',
    '  c = mix(c, col, isoligne(m.r, 0.5, 1.0) * (0.5 + 0.4 * allume));',
    '  c = mix(c, trait, limbe(n, v, 1.0) * 0.6);',
    '  return c + (bruit(gl_FragCoord.xy) - 0.5) * 0.014 * uJour;',
    '}',
    'vec3 lumiere(vec3 n, vec3 v){',
    '  float ndl = dot(n, uSoleil);',
    '  vec3 fond = mix(vec3(0.032, 0.048, 0.058), vec3(0.935, 0.91, 0.865), uJour);',
    '  vec3 c = fond * mix(1.0, mix(0.68, 0.9, uJour), 1.0 - smoothstep(-0.3, 0.8, ndl));',
    '  vec3 trait = mix(vec3(0.9, 0.86, 0.76), vec3(0.12, 0.16, 0.19), uJour);',
    '  return mix(c, trait, limbe(n, v, 1.0) * 0.35);',
    '}',
    /* VERRE (le style du site) : la Terre comme un objet précieux, une bille de cristal éclairée en studio.
       La coque : un Fresnel marqué, les reflets de trois boîtes à lumière (calculés ici, une seule passe), une légère
       dispersion au bord. Dedans, un peu en retrait (sphère intérieure, rayon 0,9, réfraction n = 1,45) : les
       continents en verre dépoli, laiteux ; l'océan en verre clair ; les pays filmés en feuille d'or prise dans le verre. */
    'float boite(vec3 R, vec3 d, vec2 demi, float flou){',
    '  float k = dot(R, d); if (k <= 0.0) return 0.0;',
    '  vec3 u = normalize(cross(vec3(0.0, 1.0, 0.0), d)), w = cross(d, u);',
    '  vec2 q = abs(vec2(dot(R, u), dot(R, w)) / k);',
    '  vec2 e = 1.0 - smoothstep(demi - flou, demi + flou, q);',
    '  return e.x * e.y;',
    '}',
    'vec3 studio(vec3 R){',
    '  vec3 c = uFond * mix(0.35, 0.9, uJour);',
    '  c += vec3(1.0, 0.985, 0.96) * mix(1.45, 0.85, uJour) * boite(R, normalize(vec3(-0.74, 0.56, 0.38)), vec2(0.34, 0.22), 0.06);',
    '  c += vec3(1.0, 0.95, 0.88) * 1.5 * boite(R, normalize(vec3(0.9, 0.12, 0.42)), vec2(0.07, 0.62), 0.05);',
    '  c += vec3(0.8, 0.9, 1.0) * mix(2.2, 0.7, uJour) * boite(R, normalize(vec3(0.15, 0.4, -0.9)), vec2(0.9, 0.5), 0.3);',
    '  c += vec3(1.0, 0.9, 0.76) * 0.22 * smoothstep(-0.2, -0.7, R.y);',
    '  return c;',
    '}',
    'vec3 verre(vec3 n, vec3 v){',
    '  float nv = clamp(dot(n, v), 0.0, 1.0), e = 1.0 - nv;',
    '  vec3 P = normalize(vObj), Vo = normalize(uCamObj - vObj);',
    '  vec3 T = refract(-Vo, P, 1.0 / 1.3);',
    '  float ri = 0.92, b = dot(P, T), disc = b * b - (1.0 - ri * ri);',
    /* le verre clair : le fond, un peu assombri vers le bord, une teinte Lagon dans l'épaisseur */
    '  vec3 clair = uFond * mix(0.9, 0.93, uJour) * (0.82 + 0.22 * nv);',
    '  clair = mix(clair, mix(vec3(0.03, 0.09, 0.1), vec3(0.62, 0.74, 0.74), uJour), e * e * 0.35);',
    '  vec3 dedans = clair;',
    '  if (disc > 0.0) {',
    '    vec3 Q = (P + T * (-b - sqrt(disc))) / ri;',
    '    vec2 uvQ = vec2(atan(-Q.z, Q.x) / 6.2831853 + 0.5, asin(clamp(Q.y, -1.0, 1.0)) / 3.1415927 + 0.5);',
    '    vec4 m = LOD(uMasque, uvQ, uLod);',
    '    float lq = dot(Q, uSoleilObj);',
    '    float terre = smoothstep(0.22, 0.78, m.r), pf = smoothstep(0.3, 0.7, m.g);',
    '    vec3 lait = mix(vec3(0.66, 0.7, 0.72), vec3(0.99, 0.99, 0.975), uJour) * (0.6 + 0.4 * smoothstep(-0.4, 0.8, lq));',
    '    vec3 feuille = mix(vec3(0.56, 0.42, 0.18), vec3(0.93, 0.76, 0.42), smoothstep(-0.3, 0.8, lq));',
    '    feuille += vec3(1.0, 0.82, 0.5) * pow(max(dot(reflect(-uSoleilObj, Q), -T), 0.0), 26.0) * 0.26;',
    '    float voile = smoothstep(0.0, 0.25, sqrt(disc));',   /* au ras de la sphère intérieure, le monde s'efface dans le verre */
    '    dedans = mix(clair, mix(lait, feuille, pf), max(terre * mix(0.66, 0.8, uJour), pf) * voile);',
    '  }',
    /* la lumière concentrée par la bille (une caustique intérieure, à l'opposé de la boîte principale) */
    '  vec2 fo = n.xy - vec2(0.36, -0.3);',
    '  dedans += mix(vec3(1.0, 0.88, 0.66) * 0.16, vec3(1.0, 0.95, 0.85) * 0.12, uJour) * exp(-dot(fo, fo) * 7.0);',
    /* la coque : Fresnel et reflets de studio */
    '  vec3 R = reflect(-v, n);',
    '  float F = 0.05 + 0.95 * pow(e, 5.0);',
    '  vec3 c = mix(dedans, studio(R), clamp(F + 0.06, 0.0, 1.0));',
    /* le bord : une dispersion très légère, et le contre-jour qui le dessine (surtout en sombre) */
    '  vec3 disp = vec3(pow(e, 4.4), pow(e, 4.8), pow(e, 5.3));',
    '  c += disp * mix(vec3(0.7, 0.82, 1.0) * 0.9, vec3(0.34, 0.38, 0.4) * 0.35, uJour);',
    '  c = mix(c, vec3(0.1, 0.13, 0.15), pow(e, 3.0) * 0.16 * uJour);',
    '  return c;',
    '}',
    'void main(){',
    '  vec3 n = normalize(vN), v = normalize(vV);',
    '  vec3 c;',
    '  if (uStyle > 4.5) c = verre(n, v);',
    '  else if (uStyle < 0.5) c = carnet(n, v);',
    '  else if (uStyle < 1.5) c = relief(n, v);',
    '  else if (uStyle < 2.5) c = lumiere(n, v);',
    '  else c = ancien(n, v);',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'].join('\n');
  /* LA BILLE EN RELIEF (style Verre) : deux maillages.
     - le monde intérieur : une sphère dense (rayon 0,9 ; 512 × 256 segments, 256 × 128 sur mobile) dont les sommets sont
       soulevés une fois au chargement (CPU), d'après le masque flouté (un biseau doux) : les terres à +2,6 %, les pays
       filmés un cran plus haut (+1 %), un soupçon de topologie sur les montagnes. Verre dépoli laiteux, flancs qui
       attrapent la lumière, ombre de contact sur l'océan au pied des côtes ; les pays filmés en or métallique ;
     - la coque de verre (rayon 1), transparente par-dessus : Fresnel, boîtes à lumière, dispersion, contre-jour.
     Les fils d'or et les escales passent au-dessus de la coque. */
  var GLSL_STUDIO = [
    'uniform vec3 uFond; uniform float uJour;',
    'float boite(vec3 R, vec3 d, vec2 demi, float flou){',
    '  float k = dot(R, d); if (k <= 0.0) return 0.0;',
    '  vec3 u = normalize(cross(vec3(0.0, 1.0, 0.0), d)), w = cross(d, u);',
    '  vec2 q = abs(vec2(dot(R, u), dot(R, w)) / k);',
    '  vec2 e = 1.0 - smoothstep(demi - flou, demi + flou, q);',
    '  return e.x * e.y;',
    '}',
    'vec3 studio(vec3 R){',
    '  vec3 c = uFond * mix(0.35, 0.9, uJour);',
    '  c += vec3(1.0, 0.985, 0.96) * mix(1.45, 0.85, uJour) * boite(R, normalize(vec3(-0.74, 0.56, 0.38)), vec2(0.34, 0.22), 0.06);',
    '  c += vec3(1.0, 0.95, 0.88) * 1.5 * boite(R, normalize(vec3(0.9, 0.12, 0.42)), vec2(0.07, 0.62), 0.05);',
    '  c += vec3(0.8, 0.9, 1.0) * mix(2.2, 0.7, uJour) * boite(R, normalize(vec3(0.15, 0.4, -0.9)), vec2(0.9, 0.5), 0.3);',
    '  c += vec3(1.0, 0.9, 0.76) * 0.22 * smoothstep(-0.2, -0.7, R.y);',
    '  return c;',
    '}'].join('\n');
  /* LE NÉON des pays filmés : une texture d'émission calculée une fois au chargement (le masque : un contour par
     détection de bord = le tube ; des flous = le halo, le cœur du pays, la lueur large). R tube, G halo, B cœur, A lueur.
     L'escale active : son pays (cercle autour de son centre, uActif / uActifCos) brille plus fort, et s'allume en douceur. */
  var GLSL_NEON = [
    'uniform sampler2D uEmi; uniform vec3 uActif; uniform vec2 uActifCos; uniform float uActifK;',
    'float actif(vec3 p){ return smoothstep(uActifCos.y, uActifCos.x, dot(normalize(p), uActif)) * uActifK; }'].join('\n');
  var F_COQUE = [
    GLSL_STUDIO,
    GLSL_NEON,
    'uniform float uZoom;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;',
    'void main(){',
    '  vec3 n = normalize(vN), v = normalize(vV);',
    '  float nv = clamp(dot(n, v), 0.0, 1.0), e = 1.0 - nv;',
    '  float F = (0.05 + 0.95 * pow(e, 5.0)) * mix(1.0, 0.3, uZoom);',
    '  vec3 R = reflect(-v, n);',
    '  vec3 st = studio(R);',
    /* en clair, on retire de la coque le reflet de la pièce (crème) et du sol : sinon un voile plus ou moins épais
       recouvre le bord du monde selon l'angle, et l'anneau paraît décentré ; restent les boîtes à lumière */
    '  st -= (uFond * mix(0.35, 0.9, uJour) * 0.8 + vec3(1.0, 0.9, 0.76) * 0.22 * smoothstep(-0.2, -0.7, R.y)) * uJour;',
    '  vec3 col = max(st, vec3(0.0)) * F;',
    '  float a = F * mix(1.0, 0.55, uJour) + 0.06;',
    /* en clair, un corps de verre à peine teinté : l'anneau ne se lit pas comme un vide crème */
    '  col += vec3(0.6, 0.72, 0.76) * 0.1 * uJour; a += 0.1 * uJour;',
    '  vec3 disp = vec3(pow(e, 4.4), pow(e, 4.8), pow(e, 5.3));',
    '  col += disp * mix(vec3(0.7, 0.82, 1.0) * 0.9, vec3(0.34, 0.38, 0.4) * 0.35, uJour);',
    '  a += (disp.r + disp.g + disp.b) * 0.12;',
    '  vec2 fo = n.xy - vec2(0.36, -0.3);',
    '  col += mix(vec3(1.0, 0.88, 0.66) * 0.1, vec3(1.0, 0.95, 0.85) * 0.08, uJour) * exp(-dot(fo, fo) * 7.0);',
    '  float bord = pow(e, 3.0) * 0.16 * uJour;',
    '  col += vec3(0.1, 0.13, 0.15) * bord; a += bord;',
    /* en gros plan (le hero), la coque s'efface : un liseré lumineux fin au bord, les reflets, et la Terre dessous */
    '  a *= mix(1.0, 0.35, uZoom);',
    '  col *= mix(1.0, 0.55, uZoom);',
    '  col += mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 0.98, 0.94), uJour) * pow(e, 16.0) * 0.9 * uZoom;',
    /* le reflet très doux des néons sur la coque, au-dessus d'eux */
    '  vec4 em = texture2D(uEmi, vUv);',
    '  col += vec3(1.0, 0.68, 0.3) * (em.a * 0.5 + em.g * 0.25) * (0.18 + F) * mix(0.42, 0.18, uJour) * mix(0.75, 1.2, actif(vObj));',
    '  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));',   /* mélange : src × 1 + dst × (1 − a) */
    '}'].join('\n');
  var V_LUEUR = [
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;',
    'void main(){',
    '  vUv = uv; vObj = position;',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  var F_LUEUR = [
    'uniform float uJour;',
    GLSL_NEON,
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;',
    'void main(){',
    '  vec4 em = texture2D(uEmi, vUv);',
    '  float nv = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);',
    '  float d = em.a * 0.7 + em.g * 0.3;',
    '  vec3 col = vec3(1.0, 0.55, 0.15) * d * mix(0.95, 0.26, uJour) * mix(0.7, 1.3, actif(vObj)) * (0.55 + 0.45 * nv);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'].join('\n');
  var V_INTERIEUR = [
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vR; varying vec3 vObj;',
    'void main(){',
    '  vUv = uv;',
    '  vObj = position;',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vN = normalize(normalMatrix * normal);',
    '  vR = normalize(normalMatrix * normalize(position));',
    '  vV = normalize(-mv.xyz);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  /* Le monde intérieur, en couleurs : les terres de la Blue Marble, un peu plus saturées et lumineuses, comme un verre
     teinté dans la masse (le biseau et les flancs restent plus clairs) ; l'océan en verre coloré, bleu profond qui tire au
     turquoise près des côtes (masque flouté : les eaux peu profondes), de légères caustiques qui bougent ; les pays
     filmés en or métallique, cernés d'une ombre fine pour rester lisibles à côté des déserts. */
  var F_INTERIEUR = [
    GLSL_STUDIO,
    GLSL_NEON,
    'uniform sampler2D uMasque; uniform sampler2D uTexJ; uniform vec3 uSoleil; uniform float uLod; uniform float uTemps;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vR; varying vec3 vObj;',
    '#if defined(GL_EXT_shader_texture_lod) || __VERSION__ >= 300',
    '#define LOD(t, p, l) texture2DLodEXT(t, p, l)',
    '#else',
    '#define LOD(t, p, l) texture2D(t, p)',
    '#endif',
    'float bruit(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
    'float doux(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(bruit(i), bruit(i + vec2(1.0, 0.0)), u.x), mix(bruit(i + vec2(0.0, 1.0)), bruit(i + vec2(1.0, 1.0)), u.x), u.y); }',
    'vec3 sature(vec3 c, float k){ float l = dot(c, vec3(0.3, 0.59, 0.11)); return mix(vec3(l), c, k); }',
    'void main(){',
    '  vec3 n = normalize(vN), v = normalize(vV), nr = normalize(vR);',
    '  vec4 m = LOD(uMasque, vUv, uLod);',
    '  float pied = LOD(uMasque, vUv, uLod + 1.6).r;',
    '  float large = LOD(uMasque, vUv, uLod + 3.4).r;',
    '  float cerne = LOD(uMasque, vUv, uLod + 1.4).g;',
    '  float terre = smoothstep(0.3, 0.7, m.r), pf = smoothstep(0.35, 0.65, m.g);',
    '  float lam = dot(n, uSoleil), nvr = clamp(dot(nr, v), 0.0, 1.0);',
    '  float lum = 0.5 + 0.5 * smoothstep(-0.45, 0.85, lam);',
    '  float pente = clamp((1.0 - dot(n, nr)) * 9.0, 0.0, 1.0);',
    '  vec3 photo = LOD(uTexJ, vUv, uLod).rgb;',
    /* l'océan : du bleu profond au turquoise des lagons près des côtes */
    '  float peu = smoothstep(0.08, 0.55, large);',
    '  vec3 profond = mix(vec3(0.02, 0.11, 0.27), vec3(0.08, 0.3, 0.56), uJour);',
    '  vec3 lagon = mix(vec3(0.06, 0.5, 0.56), vec3(0.24, 0.72, 0.74), uJour);',
    '  vec3 mer = mix(profond, lagon, peu);',
    '  mer *= 0.85 + 0.3 * dot(photo, vec3(0.3, 0.59, 0.11));',
    '  vec2 cq = vUv * vec2(320.0, 160.0);',
    '  float n1 = doux(cq + vec2(uTemps * 0.22, uTemps * 0.13)), n2 = doux(cq * 1.3 - vec2(uTemps * 0.17, -uTemps * 0.2));',
    '  float caus = pow(1.0 - abs(n1 - n2), 9.0) * peu;',
    '  mer += mix(vec3(0.5, 0.9, 0.95), vec3(0.85, 1.0, 1.0), uJour) * caus * 0.22;',
    '  mer *= lum * (0.78 + 0.3 * nvr);',
    '  mer *= 1.0 - clamp(pied * 1.5, 0.0, 1.0) * (1.0 - terre) * mix(0.42, 0.2, uJour);',
    /* les terres : la vraie couleur, teintée dans la masse ; les flancs et le biseau plus clairs */
    '  vec3 sol = sature(photo, 1.35) * 1.22;',
    '  sol = mix(sol, vec3(0.97, 0.97, 0.95), smoothstep(0.62, 0.9, dot(photo, vec3(0.3, 0.59, 0.11))) * 0.6);',
    /* les lacs (sombres et bleus sur la photo) : du verre lagon, pas des taches noires */
    /* les lacs (Victoria, Tanganyika, Baïkal : presque noirs sur la photo, « terre » dans le masque) : de l'eau claire, turquoise */
    '  float lac = 1.0 - smoothstep(0.02, 0.065, dot(photo, vec3(0.3, 0.59, 0.11)));',
    '  sol = mix(sol, lagon * mix(0.9, 1.05, uJour) * (0.7 + 0.3 * smoothstep(-0.45, 0.85, lam)), lac);',
    '  sol *= mix(0.58, 0.7, uJour) + mix(0.5, 0.36, uJour) * smoothstep(-0.45, 0.85, lam);',
    '  sol += vec3(1.0, 0.99, 0.96) * pente * mix(0.45, 0.3, uJour) * smoothstep(-0.25, 0.5, lam);',
    '  sol += studio(reflect(-v, n)) * 0.06;',
    '  sol *= 1.0 - smoothstep(0.08, 0.5, cerne) * (1.0 - pf) * 0.32;',   /* un cerne d'ombre autour des pays filmés */
    /* les pays filmés : de l'or métallique, qui reflète le studio */
    /* les pays filmés : du verre ambré éclairé de l'intérieur (lumineux au centre, plus dense au bord, le relief dessous),
       cerné d'un tube de néon (cœur blanc chaud, puis or et ambre) et d'un halo qui déborde */
    '  vec4 em = texture2D(uEmi, vUv);',
    '  float act = actif(vObj), niveau = mix(0.62, 1.3, act);',
    '  vec3 ambre = vec3(1.0, 0.5, 0.1), orN = vec3(1.0, 0.76, 0.3), blanc = vec3(1.0, 0.96, 0.84);',
    '  float centre = smoothstep(0.55, 0.97, em.b);',   /* 0 au bord du pays, 1 au cœur */
    '  vec3 verreAmbre = mix(vec3(0.8, 0.3, 0.04) * 0.78, vec3(1.0, 0.8, 0.44) * 1.12, centre) * niveau;',
    '  verreAmbre = mix(verreAmbre, sol * vec3(1.0, 0.7, 0.4), 0.22) * (0.82 + 0.3 * smoothstep(-0.4, 0.8, lam));',
    '  verreAmbre += vec3(1.0, 0.85, 0.6) * pente * 0.3;',
    '  vec3 c = mix(mer, mix(sol, verreAmbre, pf), max(terre, pf));',
    '  c *= mix(0.74, 1.0, uJour);',   /* en sombre, le néon porte la scène */
    '  float tube = em.r;',
    '  vec3 emi = blanc * smoothstep(0.55, 1.0, tube) * 1.45 + orN * smoothstep(0.08, 0.65, tube) * 1.15 + vec3(1.0, 0.45, 0.08) * em.g * 1.6;',
    '  emi *= 0.86 + 0.14 * sin(uTemps * 1.3 + vObj.x * 9.0);',
    '  c += emi * niveau * mix(1.0, 0.5, uJour);',
    '  gl_FragColor = vec4(min(c, vec3(1.25)), 1.0);',
    '}'].join('\n');
  /* L'atmosphère : une coquille fine vue de l'intérieur, plus claire côté soleil (or à l'heure dorée, puis Lagon) */
  var F_ATMO = [
    'uniform vec3 uCouleur; uniform float uMax; uniform float uForce; uniform vec3 uSoleil; uniform float uOr;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV;',
    'void main(){',
    '  vec3 n = normalize(vN);',
    '  float d = -dot(n, normalize(vV));',
    '  float i = pow(clamp(d / uMax, 0.0, 1.0), 1.7);',
    '  float s = dot(n, uSoleil);',
    '  float cote = smoothstep(-0.45, 0.6, s);',
    '  vec3 dore = mix(vec3(0.2, 0.56, 0.6), vec3(1.0, 0.7, 0.36), smoothstep(0.05, 0.75, s));',
    '  gl_FragColor = vec4(mix(uCouleur, dore, uOr), i * uForce * (0.1 + 0.9 * cote) * (1.0 + 0.35 * uOr));',
    '}'].join('\n');
  /* Les points des escales (taille fixe à l'écran) ; ils s'éteignent vers le bord du globe */
  var V_POINTS = [
    'attribute float aTaille; attribute float aEtat; attribute float aId;',
    'uniform float uDpr; uniform float uActif; uniform float uEchelle;',
    'varying float vA; varying float vEtat; varying float vActif;',
    'void main(){',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vec3 n = normalize(normalMatrix * normalize(position));',
    '  vA = smoothstep(0.04, 0.32, dot(n, normalize(-mv.xyz)));',
    '  vActif = abs(aId - uActif) < 0.5 ? 1.0 : 0.0;',
    '  vEtat = aEtat;',
    '  gl_PointSize = aTaille * uDpr * uEchelle * (1.0 + vActif * 1.6);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  var F_POINTS = [
    'uniform vec3 uCouleur; uniform vec3 uCoeur; uniform float uTemps; uniform float uForce;',
    'varying float vA; varying float vEtat; varying float vActif;',
    'void main(){',
    '  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);',
    '  if (r > 1.0) discard;',
    '  float a; float c = 0.0;',
    '  if (vEtat > 0.5) {',
    '    float anneau = smoothstep(0.5, 0.6, r) * (1.0 - smoothstep(0.74, 0.84, r));',
    '    a = anneau * step(0.0, sin(atan(p.y, p.x) * 7.0 + uTemps * 0.8)) * 0.95;',
    '  } else {',
    '    c = 1.0 - smoothstep(0.16, 0.3, r);',
    '    a = c + pow(1.0 - r, 3.0) * 0.18;',
    '    float o = fract(uTemps * 0.5);',
    '    a += vActif * (1.0 - smoothstep(0.0, 0.05, abs(r - (0.34 + o * 0.62)))) * (1.0 - o) * 0.75;',
    '  }',
    '  gl_FragColor = vec4(mix(uCouleur, uCoeur, c), clamp(a, 0.0, 1.0) * vA * uForce);',
    '}'].join('\n');
  /* L'arc de vol : visible jusqu'à la tête, plus lumineux près d'elle ; en pointillé pour la prochaine escale */
  var F_ARC = [
    'uniform float uProg; uniform float uVif; uniform float uPointille; uniform vec3 uCouleur; uniform float uForce; uniform float uTirets;',
    'varying vec2 vUv; varying vec3 vN; varying vec3 vV;',
    'void main(){',
    '  float x = vUv.x;',
    '  if (x > uProg) discard;',
    '  if (uPointille > 0.5 && fract(x * uTirets) > 0.5) discard;',
    '  float tete = smoothstep(uProg - 0.3, uProg, x);',
    '  float a = mix(0.32, 0.55 + 0.45 * tete, uVif);',
    '  gl_FragColor = vec4(uCouleur, a * uForce);',
    '}'].join('\n');
  /* La poussière de lumière : des milliers de points sur les terres (grille lat / lon, masque terre / mer) */
  var V_POUSS = [
    'attribute float aPays; attribute float aPhase;',
    'uniform float uDpr; uniform float uTaille; uniform float uTemps; uniform vec3 uSoleil;',
    'varying float vA; varying float vPays; varying float vL;',
    'void main(){',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vec3 n = normalize(normalMatrix * normalize(position));',
    '  vA = smoothstep(0.0, 0.28, dot(n, normalize(-mv.xyz)));',
    '  vA *= 0.84 + 0.16 * sin(uTemps * (0.6 + aPhase * 1.4) + aPhase * 37.0);',
    '  vL = clamp(dot(n, uSoleil) * 0.5 + 0.5, 0.0, 1.0);',
    '  vPays = aPays;',
    '  gl_PointSize = uTaille * uDpr * (1.0 + aPays * 0.75);',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  var F_POUSS = [
    'uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uOrC; uniform float uJour;',
    'varying float vA; varying float vPays; varying float vL;',
    'void main(){',
    '  vec2 p = gl_PointCoord * 2.0 - 1.0;',
    '  float a = 1.0 - smoothstep(0.5, 1.0, length(p));',
    '  if (a <= 0.0) discard;',
    '  vec3 c = mix(mix(uC2, uC1, vL), uOrC, vPays);',
    '  gl_FragColor = vec4(c, a * vA * mix(0.3 + 0.7 * vL, 0.55 + 0.45 * vL, uJour));',
    '}'].join('\n');
  var V_ETOILES = [
    'attribute float aTaille; attribute float aPhase;',
    'uniform float uDpr; uniform float uTemps;',
    'varying float vA;',
    'void main(){',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vA = 0.45 + 0.55 * sin(uTemps * (0.6 + aPhase) + aPhase * 6.0);',
    '  gl_PointSize = aTaille * uDpr;',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  var F_ETOILES = [
    'uniform float uForce; varying float vA;',
    'void main(){',
    '  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);',
    '  if (r > 1.0) discard;',
    '  gl_FragColor = vec4(1.0, 0.97, 0.92, (1.0 - smoothstep(0.2, 1.0, r)) * vA * uForce);',
    '}'].join('\n');
  var V_TETE = [
    'uniform float uDpr; uniform float uTaille;',
    'void main(){',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  gl_PointSize = uTaille * uDpr;',
    '  gl_Position = projectionMatrix * mv;',
    '}'].join('\n');
  var F_TETE = [
    'uniform vec3 uCouleur; uniform float uForce;',
    'void main(){',
    '  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);',
    '  if (r > 1.0) discard;',
    '  float c = 1.0 - smoothstep(0.2, 0.42, r);',
    '  gl_FragColor = vec4(mix(uCouleur, vec3(1.0, 0.98, 0.94), c * 0.6), (c + pow(1.0 - r, 3.0) * 0.15) * uForce);',
    '}'].join('\n');

  /* Couleurs (r, g, b de 0 à 1) : la nuit et le jour */
  var C = {
    atmoN: [.6, .76, .95], atmoJ: [.72, .84, .96],
    pointN: [.95, .8, .55], pointJ: [.98, .86, .62], coeurN: [1, .97, .9], coeurJ: [1, .99, .96],
    arcN: [.95, .83, .62], arcJ: [.99, .9, .7]
  };
  /* Le soleil (repère de la caméra) : de côté la nuit (la ligne jour / nuit se voit), presque de face le jour */
  var SOLEIL_N = [.84, .26, .48], SOLEIL_J = [.32, .3, .9];      /* le réaliste */
  var OR_N = [.62, .34, .7], OR_J = [.52, .34, .78];                  /* l'heure dorée : un soleil bas, de côté */
  var STYLES = { carnet: 0, relief: 1, lumiere: 2, or: 3, reel: 4, verre: 5 };
  var NOUVEAU = [-.5, .5, .71];                                     /* carnet, relief, lumière : la lumière des gravures, en haut à gauche */
  function styleDoc() { var v = H.getAttribute('data-terre-style'); return STYLES.hasOwnProperty(v) ? v : 'verre'; }
  /* Les escales et les arcs, selon le style : encre / crème (carnet), crème et or (relief), or (lumière) */
  var PALETTE = {
    carnet: { pointN: [.93, .89, .8], pointJ: [.11, .15, .18], coeurN: [.93, .89, .8], coeurJ: [.11, .15, .18], arcN: [.93, .89, .8], arcJ: [.11, .15, .18], pointille: true },
    relief: { pointN: [.86, .68, .36], pointJ: [.72, .52, .2], coeurN: [1, .94, .8], coeurJ: [.86, .68, .36], arcN: [.9, .86, .76], arcJ: [.12, .16, .19] },
    lumiere: { pointN: [1, .8, .46], pointJ: [.78, .56, .24], coeurN: [1, .96, .88], coeurJ: [.86, .68, .36], arcN: [1, .84, .56], arcJ: [.06, .36, .42] },
    or: { pointN: C.pointN, pointJ: C.pointJ, coeurN: C.coeurN, coeurJ: C.coeurJ, arcN: C.arcN, arcJ: C.arcJ }
  };
  PALETTE.reel = PALETTE.or;
  /* le verre : un fil d'or fin posé sur la coque, l'escale en petit point d'or */
  PALETTE.verre = { pointN: [1, .84, .52], pointJ: [.86, .58, .2], coeurN: [1, .97, .88], coeurJ: [1, .86, .56], arcN: [1, .8, .44], arcJ: [.88, .58, .2], lumineux: true };
  /* Les pays filmés : centre (lat, lon) et rayon (°) du cercle qui s'allume plus fort quand leur escale est active */
  var PAYS = { chine: [34, 104, 19], japon: [36.5, 138, 9], coree: [36.3, 127.8, 3.6], malaisie: [3.6, 108, 9], hong: [22.35, 114.15, 1.4],
    taiwan: [23.7, 121, 2.4], emirats: [24, 54, 3.4], suisse: [46.8, 8.2, 2.2], islande: [64.9, -18.6, 4.6] };
  function mix3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }

  /* ------------------------------------------------------------------------
     Une instance
     ------------------------------------------------------------------------ */
  function creer(hote, o) {
    o = o || {};
    if (!hote) return null;
    if (hote.__terre) return hote.__terre;
    hote.classList.add('terre');
    hote.setAttribute('aria-hidden', 'true');
    if (!hote.querySelector('.terre__ciel')) {
      var ciel = D.createElement('i');
      ciel.className = 'terre__ciel';
      hote.insertBefore(ciel, hote.firstChild);
    }

    var THREE = W.THREE;
    var S = {
      mode: supporte() ? '3d' : 'repli',
      theme: themeDoc(), jour: themeDoc() === 'jour' ? 1 : 0, jourCible: themeDoc() === 'jour' ? 1 : 0,
      or: styleDoc() === 'reel' ? 0 : 1, orCible: styleDoc() === 'reel' ? 0 : 1, style: styleDoc(), pouss: null,
      vue: { lat: o.lat != null ? o.lat : ASIE.lat, lon: o.lon != null ? o.lon : ASIE.lon },
      cible: null, tw: null, derive: o.derive != null ? +o.derive : 2.4,
      cadre: null, cadreCible: null, desc: o.arrivee === 'plongee' && !reduit() ? { t0: 0 } : null,
      opac: 1, pause: false, visibles: 0, raf: 0, last: 0, temps: 0, prete: false, mort: false, texOk: false,
      W: 0, H: 0, dpr: Math.min(W.devicePixelRatio || 1, 1.5), actif: null
    };
    S.cible = { lat: S.vue.lat, lon: S.vue.lon };
    var api = { mode: S.mode };
    hote.__terre = api;

    /* ---------- Le repli : une image fixe ronde, le même halo ---------- */
    var repli = null;
    function poserRepli() {
      if (repli) return;
      repli = D.createElement('img');
      repli.className = 'terre__repli';
      repli.alt = '';
      repli.decoding = 'async';
      repli.draggable = false;
      repli.src = S.theme === 'jour' ? TEX.repliJour : TEX.repliNuit;
      hote.appendChild(repli);
      var fini = function () { signaler(); };
      if (repli.complete) fini(); else { repli.onload = fini; repli.onerror = fini; }
      placerRepli();
    }
    function placerRepli() {
      if (!repli || !S.cadreCible) return;
      var c = S.cadreCible, s = c.r / DISQUE;
      if (S.suivi) S.suivi(c);
      placerSol(c);
      repli.style.width = repli.style.height = s.toFixed(1) + 'px';
      repli.style.transform = 'translate3d(' + (c.x - s / 2).toFixed(1) + 'px,' + (c.y - s / 2).toFixed(1) + 'px,0)';
    }
    function signaler() {
      if (S.prete) return;
      S.prete = true;
      hote.classList.add('is-pret');
      Terre.prete = true;
      emettre('terre:prete', { mode: S.mode });
    }

    /* ---------- Posée comme un objet : l'ombre portée douce et la caustique sous la sphère (style Verre) ----------
       Visibles seulement quand la sphère entière est à l'écran (le voyage), jamais dans l'horizon du hero. */
    var sol = D.createElement('div');
    sol.className = 'terre__sol';
    sol.innerHTML = '<i class="terre__ombre"></i><i class="terre__caustique"></i>';
    hote.insertBefore(sol, hote.querySelector('.terre__ciel').nextSibling);
    function placerSol(c) {
      var H2 = S.H || W.innerHeight, voit = S.style === 'verre' ? borne((H2 - (c.y + c.r * 1.06)) / (H2 * .05), 0, 1) : 0;
      sol.style.opacity = voit.toFixed(3);
      if (voit <= 0) return;
      var w = c.r * 2.3, h = c.r * .42;
      sol.style.width = w.toFixed(1) + 'px'; sol.style.height = h.toFixed(1) + 'px';
      sol.style.transform = 'translate3d(' + (c.x - w / 2 + c.r * .16).toFixed(1) + 'px,' + (c.y + c.r * .9).toFixed(1) + 'px,0)';
    }
    var qInv = null, coque = null, interieur = null, lueur = null, uV = null;
    /* Le monde intérieur, en relief : une seule fois, d'après le masque (flouté : un biseau) et la topologie */
    function interieurConstruire() {
      if (interieur || !S.masqueCv) return;
      var GW = PETIT ? 512 : 1024, GH = GW / 2;
      var lire = function (cv) {
        var c = D.createElement('canvas'); c.width = GW; c.height = GH;
        var g = c.getContext('2d'); g.drawImage(cv, 0, 0, GW, GH);
        return g.getImageData(0, 0, GW, GH).data;
      };
      var dm = lire(S.masqueCv), dr = S.reliefCv ? lire(S.reliefCv) : null;
      var T = new Float32Array(GW * GH), P = new Float32Array(GW * GH), Hh = new Float32Array(GW * GH), i;
      for (i = 0; i < GW * GH; i++) { T[i] = dm[i * 4] / 255; P[i] = dm[i * 4 + 1] / 255; Hh[i] = dr ? dr[i * 4] / 255 : 0; }
      /* le biseau : deux flous en boîte, séparables (horizontal en boucle, vertical borné) */
      var flou = function (A, rr) {
        var B = new Float32Array(A.length), x, y, k, s2;
        for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) { s2 = 0; for (k = -rr; k <= rr; k++) s2 += A[y * GW + ((x + k + GW) % GW)]; B[y * GW + x] = s2 / (2 * rr + 1); }
        for (x = 0; x < GW; x++) for (y = 0; y < GH; y++) { s2 = 0; for (k = -rr; k <= rr; k++) s2 += B[Math.min(GH - 1, Math.max(0, y + k)) * GW + x]; A[y * GW + x] = s2 / (2 * rr + 1); }
        return A;
      };
      var rb = PETIT ? 1 : 2;
      flou(flou(T, rb), rb); flou(flou(P, rb), rb);
      var ech = function (A, u, v) {
        var x = u * GW - .5, y = Math.min(GH - 1.001, Math.max(0, (1 - v) * GH - .5)), x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
        var a = function (xx, yy) { return A[yy * GW + ((xx % GW) + GW) % GW]; };
        return (a(x0, y0) * (1 - fx) + a(x0 + 1, y0) * fx) * (1 - fy) + (a(x0, y0 + 1) * (1 - fx) + a(x0 + 1, y0 + 1) * fx) * fy;
      };
      /* rayon 0,88 : l'anneau de verre est assez large pour que le relief au limbe ne le rende pas inégal */
      var geo = new THREE.SphereGeometry(.88, PETIT ? 256 : 512, PETIT ? 128 : 256);
      var pos = geo.attributes.position, uv = geo.attributes.uv, v3 = new THREE.Vector3();
      for (i = 0; i < pos.count; i++) {
        var u = uv.getX(i), vv = uv.getY(i), t = ech(T, u, vv), p = ech(P, u, vv), h = ech(Hh, u, vv);
        var dh = .022 * t + .009 * p + .006 * h * t;
        v3.fromBufferAttribute(pos, i).multiplyScalar(1 + dh);
        pos.setXYZ(i, v3.x, v3.y, v3.z);
      }
      geo.computeVertexNormals();
      interieur = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: uV, vertexShader: V_INTERIEUR, fragmentShader: F_INTERIEUR, extensions: { shaderTextureLOD: true } }));
      interieur.renderOrder = 0;
      G.add(interieur);
      emissionConstruire();
      /* additif sur la couleur seulement : l'alpha du canvas ne bouge pas (sinon un anneau noir sur la crème, au clair) */
      lueur = new THREE.Mesh(new THREE.SphereGeometry(.95, 128, 64), new THREE.ShaderMaterial({ uniforms: uV, vertexShader: V_LUEUR, fragmentShader: F_LUEUR,
        transparent: true, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor }));
      lueur.renderOrder = 1;
      G.add(lueur);
      coque.renderOrder = 2;
      couleurs();
    }
    /* La texture du néon, une fois : le masque des pays filmés -> le tube (bord), le halo, le cœur, la lueur large.
       Flous en boîte à somme glissante (horizontal en boucle, vertical borné), plusieurs passes ≈ un flou gaussien. */
    function emissionConstruire() {
      var EW = PETIT ? 1024 : 2048, EH = EW / 2, N = EW * EH, i;
      var c = D.createElement('canvas'); c.width = EW; c.height = EH;
      var g = c.getContext('2d'); g.drawImage(S.masqueCv, 0, 0, EW, EH);
      var d = g.getImageData(0, 0, EW, EH).data, P0 = new Float32Array(N);
      for (i = 0; i < N; i++) P0[i] = d[i * 4 + 1] / 255;
      var boite = function (A, r) {
        var B = new Float32Array(N), C = new Float32Array(N), n = 2 * r + 1, x, y, s2, row;
        for (y = 0; y < EH; y++) {
          row = y * EW; s2 = 0;
          for (x = -r; x <= r; x++) s2 += A[row + ((x + EW) % EW)];
          for (x = 0; x < EW; x++) { B[row + x] = s2 / n; s2 += A[row + ((x + r + 1) % EW)] - A[row + ((x - r + EW) % EW)]; }
        }
        var cl = function (k) { return k < 0 ? 0 : k >= EH ? EH - 1 : k; };
        for (x = 0; x < EW; x++) {
          s2 = 0;
          for (y = -r; y <= r; y++) s2 += B[cl(y) * EW + x];
          for (y = 0; y < EH; y++) { C[y * EW + x] = s2 / n; s2 += B[cl(y + r + 1) * EW + x] - B[cl(y - r) * EW + x]; }
        }
        return C;
      };
      var k = EW / 2048;
      var fin = boite(boite(P0, Math.max(1, Math.round(2 * k))), 1), bord = new Float32Array(N);
      for (i = 0; i < N; i++) { var e = 1 - Math.abs(2 * fin[i] - 1); bord[i] = e * e; }
      var halo = boite(boite(bord, Math.max(3, Math.round(9 * k))), Math.max(3, Math.round(9 * k)));
      var coeur = boite(boite(P0, Math.max(6, Math.round(22 * k))), Math.max(6, Math.round(22 * k)));
      var large = boite(boite(boite(P0, Math.max(4, Math.round(16 * k))), Math.max(4, Math.round(16 * k))), Math.max(4, Math.round(16 * k)));
      var out = new Uint8Array(N * 4), y2, x2, src, dst;
      for (y2 = 0; y2 < EH; y2++) for (x2 = 0; x2 < EW; x2++) {
        src = y2 * EW + x2; dst = ((EH - 1 - y2) * EW + x2) * 4;   /* DataTexture : la ligne 0 est en bas (v = 0) */
        out[dst] = Math.min(255, bord[src] * 255);
        out[dst + 1] = Math.min(255, halo[src] * 2.6 * 255);
        out[dst + 2] = Math.min(255, coeur[src] * 255);
        out[dst + 3] = Math.min(255, large[src] * 1.6 * 255);
      }
      var t = new THREE.DataTexture(out, EW, EH, THREE.RGBAFormat);
      t.wrapS = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
      uV.uEmi.value = t;
    }

    /* ---------- La scène ---------- */
    var renderer, scene, camera, G, globe, atmo, uG, uA, uP, uE, pts = null, etoiles, arcs = {}, ids = [];
    var texJ = null, texN = null, texR = null, vide = null;

    function versRepli(raison) {
      if (raison) console.warn('[terre] repli : ' + raison);
      S.mode = 'repli'; api.mode = 'repli';
      arreter();
      if (renderer) { try { renderer.dispose(); } catch (e) {} if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); renderer = null; }
      hote.classList.add('is-repli');
      poserRepli();
    }

    function llVec(lat, lon, r) {
      var a = lat * RAD, b = lon * RAD;
      return new THREE.Vector3(Math.cos(a) * Math.cos(b) * r, Math.sin(a) * r, -Math.cos(a) * Math.sin(b) * r);
    }

    function construire() {
      var canvas = D.createElement('canvas');
      canvas.className = 'terre__canvas';
      hote.appendChild(canvas);
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !PETIT, alpha: true, powerPreference: 'high-performance' });
      } catch (e) { versRepli('WebGL'); return false; }
      renderer.setPixelRatio(S.dpr);
      renderer.setClearColor(0x000000, 0);
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); versRepli('contexte perdu'); });
      scene = new THREE.Scene();
      qInv = new THREE.Quaternion();
      camera = new THREE.PerspectiveCamera(FOV, 1, .01, 200);
      G = new THREE.Group();
      scene.add(G);

      vide = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
      vide.needsUpdate = true;
      var soleil = new THREE.Vector3().fromArray(SOLEIL_N).normalize();
      uG = {
        uTexJ: { value: vide }, uTexN: { value: vide }, uRelief: { value: vide },
        uSoleil: { value: soleil }, uAtmo: { value: new THREE.Vector3() },
        uPas: { value: new THREE.Vector2(1 / 2048, 1 / 1024) }, uBosse: { value: PETIT ? 1.6 : 2.4 }, uVilles: { value: 1 }, uAmb: { value: .035 },
        uOr: { value: S.or }, uJour: { value: S.jour }, uMasque: { value: vide }, uStyle: { value: STYLES[S.style] }, uDpr: { value: S.dpr },
        uCamObj: { value: new THREE.Vector3(0, 0, 3) }, uSoleilObj: { value: new THREE.Vector3(0, 0, 1) }, uLod: { value: 0 }, uFond: { value: new THREE.Vector3() }
      };
      var seg = PETIT ? [96, 64] : [160, 112];
      globe = new THREE.Mesh(new THREE.SphereGeometry(1, seg[0], seg[1]),
        new THREE.ShaderMaterial({ uniforms: uG, vertexShader: V_GLOBE, fragmentShader: F_GLOBE, extensions: { derivatives: true, shaderTextureLOD: true } }));
      G.add(globe);
      /* la bille : la coque de verre (transparente) ; le monde intérieur viendra avec le masque */
      uV = { uFond: uG.uFond, uJour: uG.uJour, uSoleil: uG.uSoleil, uMasque: uG.uMasque, uLod: uG.uLod, uTexJ: uG.uTexJ, uTemps: { value: 0 },
        uEmi: { value: vide }, uActif: { value: new THREE.Vector3(0, 0, 1) }, uActifCos: { value: new THREE.Vector2(1, 1) }, uActifK: { value: 0 }, uZoom: { value: 0 } };
      coque = new THREE.Mesh(new THREE.SphereGeometry(1, seg[0], seg[1]),
        new THREE.ShaderMaterial({ uniforms: uV, vertexShader: V_LUEUR, fragmentShader: F_COQUE, transparent: true, depthWrite: false,
          blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor }));
      coque.renderOrder = 1;
      G.add(coque);

      uA = { uCouleur: { value: new THREE.Vector3() }, uMax: { value: Math.sqrt(1 - 1 / (ATMO * ATMO)) }, uForce: { value: 1 }, uSoleil: { value: soleil }, uOr: { value: S.or } };
      atmo = new THREE.Mesh(new THREE.SphereGeometry(ATMO, 96, 64),
        new THREE.ShaderMaterial({ uniforms: uA, vertexShader: V_SURF, fragmentShader: F_ATMO, side: THREE.BackSide, transparent: true, depthWrite: false }));
      scene.add(atmo);

      /* Les étoiles (la nuit seulement), fixes : le globe tourne devant elles */
      var n = PETIT ? 420 : 760, pos = new Float32Array(n * 3), ta = new Float32Array(n), ph = new Float32Array(n), s = 11;
      var rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
      for (var i = 0; i < n; i++) {
        var u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u), R = 40;
        pos[i * 3] = q * Math.cos(t) * R; pos[i * 3 + 1] = u * R; pos[i * 3 + 2] = q * Math.sin(t) * R;
        var z = rnd();
        ta[i] = z < .07 ? 2.6 + rnd() * 1.4 : 1 + z * z * 1.6;
        ph[i] = rnd();
      }
      var ge = new THREE.BufferGeometry();
      ge.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      ge.setAttribute('aTaille', new THREE.BufferAttribute(ta, 1));
      ge.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
      uE = { uDpr: { value: S.dpr }, uTemps: { value: 0 }, uForce: { value: 1 - S.jour } };
      etoiles = new THREE.Points(ge, new THREE.ShaderMaterial({ uniforms: uE, vertexShader: V_ETOILES, fragmentShader: F_ETOILES, transparent: true, depthWrite: false }));
      etoiles.renderOrder = -1;
      scene.add(etoiles);

      uP = {
        uDpr: { value: S.dpr }, uActif: { value: -1 }, uEchelle: { value: 1 }, uTemps: { value: 0 }, uForce: { value: 1 },
        uCouleur: { value: new THREE.Vector3() }, uCoeur: { value: new THREE.Vector3() }
      };
      if (o.points) points(o.points);
      couleurs();
      return true;
    }

    function points(liste) {
      if (S.mode !== '3d') return;
      if (pts) { G.remove(pts); pts.geometry.dispose(); }
      ids = [];
      var n = liste.length, pos = new Float32Array(n * 3), ta = new Float32Array(n), et = new Float32Array(n), id = new Float32Array(n);
      liste.forEach(function (p, i) {
        var v = llVec(p.lat, p.lon, 1.004);
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
        ta[i] = p.futur ? 18 : 8; et[i] = p.futur ? 1 : 0; id[i] = i;
        ids.push(p.id);
      });
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aTaille', new THREE.BufferAttribute(ta, 1));
      g.setAttribute('aEtat', new THREE.BufferAttribute(et, 1));
      g.setAttribute('aId', new THREE.BufferAttribute(id, 1));
      pts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: uP, vertexShader: V_POINTS, fragmentShader: F_POINTS, transparent: true, depthWrite: false }));
      pts.renderOrder = 3;
      pts.visible = !S.ptsMasques;
      G.add(pts);
      couleurs();
    }

    /* Les couleurs et les mélanges suivent le mode (la nuit s'ajoute à la lumière, le jour se pose dessus) */
    function couleurs() {
      if (!uA) return;
      var j = S.jour, add = j < .5;
      var ancien = S.style === 'or' || S.style === 'reel';
      uG.uStyle.value = STYLES[S.style];
      uG.uSoleil.value.fromArray(ancien ? mix3(mix3(SOLEIL_N, SOLEIL_J, j), mix3(OR_N, OR_J, j), S.or) : NOUVEAU).normalize();
      atmo.visible = ancien;
      var bille = S.style === 'verre';
      globe.visible = !bille;
      if (coque) coque.visible = bille;
      if (interieur) interieur.visible = bille;
      if (lueur) lueur.visible = bille;
      if (S.pouss) S.pouss.visible = S.style === 'lumiere';
      uG.uOr.value = S.or; uG.uJour.value = j; uA.uOr.value = S.or;
      uG.uAtmo.value.fromArray(mix3(C.atmoN, C.atmoJ, j));
      uG.uVilles.value = 1 - .3 * j;
      uG.uAmb.value = .035 + .12 * j;   /* de jour, l'ombre reste douce sur la crème */
      uA.uCouleur.value.fromArray(mix3(C.atmoN, C.atmoJ, j));
      uA.uForce.value = add ? .85 : .6;
      uE.uForce.value = S.style === 'verre' ? 0 : (1 - j) * .8;
      uG.uFond.value.fromArray(mix3([.035, .05, .062], [.955, .937, .905], j));
      var P = PALETTE[S.style] || PALETTE.or;
      uP.uCouleur.value.fromArray(mix3(P.pointN, P.pointJ, j));
      uP.uCoeur.value.fromArray(mix3(P.coeurN, P.coeurJ, j));
      if (S.pouss) {
        var up = S.pouss.material.uniforms;
        up.uC1.value.fromArray(mix3([.96, .93, .86], [.06, .36, .42], j));
        up.uC2.value.fromArray(mix3([.42, .44, .44], [.11, .15, .18], j));
        up.uOrC.value.fromArray(mix3([1, .8, .46], [.78, .56, .24], j));
        up.uJour.value = j;
      }
      var mode = add ? THREE.AdditiveBlending : THREE.NormalBlending;
      if (atmo.material.blending !== mode) { atmo.material.blending = mode; atmo.material.needsUpdate = true; }
      Object.keys(arcs).forEach(function (k) { arcs[k].couleur(); });
    }

    /* ---------- Les textures ---------- */
    var MAX = PETIT ? 2048 : 4096;
    var enCharge = {};
    function texture(cle) {
      if (enCharge[cle]) return enCharge[cle];
      enCharge[cle] = chargerImage(TEX[cle], cle === 'relief' ? 2048 : MAX).then(function (cv) {
        var t = new THREE.CanvasTexture(cv);
        t.anisotropy = Math.min(8, renderer ? renderer.capabilities.getMaxAnisotropy() : 1);
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.wrapS = THREE.RepeatWrapping;
        if (cle === 'jour') { texJ = t; uG.uTexJ.value = t; }
        else if (cle === 'nuit') { texN = t; uG.uTexN.value = t; }
        else if (cle === 'masque') { uG.uMasque.value = t; t.anisotropy = Math.min(4, t.anisotropy); S.masqueCv = cv; }
        else { texR = t; uG.uRelief.value = t; uG.uPas.value.set(1 / cv.width, 1 / cv.height); S.reliefCv = cv; }
        return t;
      });
      return enCharge[cle];
    }
    /* Le jour et le relief toujours (le côté éclairé) ; la carte de nuit pour les villes, en mode sombre d'abord */
    function texturesDe(th) {
      if (S.style === 'verre') return Promise.all([texture('masque'), texture('relief'), texture('jour')]).then(function (r) { interieurConstruire(); return r; });
      if (S.style !== 'or' && S.style !== 'reel') return Promise.all([texture('masque'), texture('relief')]);
      var l = [texture('jour'), texture('relief')];
      if (th === 'nuit') l.push(texture('nuit'));
      else setTimeout(function () { texture('nuit').catch(function () {}); }, 2500);
      return Promise.all(l);
    }
    /* La poussière de lumière : les points des terres, tirés une fois du masque (grille en quinconce) */
    function poussiere() {
      if (S.pouss || !S.masqueCv) return;
      var cv = S.masqueCv, w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data;
      var pas = PETIT ? .9 : .6, pos = [], pays = [], ph = [], rang = 0, sd = 3;
      var rnd = function () { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
      for (var la = -84; la <= 84; la += pas, rang++) {
        var pl = pas / Math.max(.08, Math.cos(la * RAD));
        for (var lo = -180 + (rang % 2) * pl / 2; lo < 180; lo += pl) {
          var x = Math.min(w - 1, Math.floor((lo + 180) / 360 * w)), y = Math.min(h - 1, Math.floor((90 - la) / 180 * h)), k = (y * w + x) * 4;
          if (d[k] < 128) continue;
          var v = llVec(la, lo, 1.003);
          pos.push(v.x, v.y, v.z); pays.push(d[k + 1] > 128 ? 1 : 0); ph.push(rnd());
        }
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      g.setAttribute('aPays', new THREE.BufferAttribute(new Float32Array(pays), 1));
      g.setAttribute('aPhase', new THREE.BufferAttribute(new Float32Array(ph), 1));
      var u = { uDpr: { value: S.dpr }, uTaille: { value: 2.4 }, uTemps: { value: 0 }, uSoleil: uG.uSoleil,
        uC1: { value: new THREE.Vector3() }, uC2: { value: new THREE.Vector3() }, uOrC: { value: new THREE.Vector3() }, uJour: { value: S.jour } };
      S.pouss = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: u, vertexShader: V_POUSS, fragmentShader: F_POUSS, transparent: true, depthWrite: false }));
      S.pouss.renderOrder = 1;
      G.add(S.pouss);
      couleurs();
    }

    /* ---------- Le cadre : la caméra, et le décalage de l'objectif pour placer le globe ---------- */
    function mesurer() {
      var w = hote.clientWidth || W.innerWidth, h = hote.clientHeight || W.innerHeight;
      if (w === S.W && h === S.H) return;
      S.W = w; S.H = h;
      if (renderer) renderer.setSize(w, h, false);
    }
    /* L'arrivée de la plongée : on est encore tout près, l'horizon au-dessus de l'écran ; il redescend */
    function cadreApproche(c) {
      var r = c.r * 1.5;
      return { x: c.x, y: r - S.H * .25, r: r };
    }
    function appliquer(c) {
      var t = Math.tan(FOV / 2 * RAD), q = S.H / (2 * Math.max(1, c.r) * t), d = Math.sqrt(1 + q * q);
      camera.position.set(0, 0, d);
      camera.near = Math.max(.002, (d - 1) * .5);
      camera.far = d + 60;
      camera.aspect = S.W / S.H;
      camera.setViewOffset(S.W, S.H, S.W / 2 - c.x, S.H / 2 - c.y, S.W, S.H);
      camera.updateProjectionMatrix();
      if (uP) uP.uEchelle.value = borne(c.r / 300, .62, 1.25);
    }

    /* ---------- La boucle (unique, en pause hors écran) ---------- */
    function vivant() { return !S.mort && !S.pause && S.mode === '3d' && S.texOk && S.opac > .01 && S.visibles > 0 && !D.hidden; }
    function relancer() { if (!S.raf && vivant() && S.cadreCible) { S.last = 0; S.raf = requestAnimationFrame(boucle); } }
    function arreter() { if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; } }
    function boucle(t) {
      S.raf = 0;
      if (!vivant()) return;
      var dt = S.last ? Math.min(.05, (t - S.last) / 1000) : .016;
      S.last = t; S.temps += dt;
      mesurer();
      var k = 1 - Math.exp(-dt * 9);
      /* La rotation : le tour programmé, sinon la cible (et la dérive lente) */
      if (S.tw) {
        var w = S.tw, p = Math.min(1, (t - (w.t0 || (w.t0 = t))) / w.d), e = doux(p);
        S.vue.lat = w.a.lat + (w.b.lat - w.a.lat) * e;
        S.vue.lon = w.a.lon + n180(w.b.lon - w.a.lon) * e;
        if (p >= 1) { S.tw = null; S.cible = { lat: w.b.lat, lon: w.b.lon }; w.ok(); }
      } else {
        if (S.derive) S.cible.lon -= S.derive * dt;
        S.vue.lat += (S.cible.lat - S.vue.lat) * k;
        S.vue.lon += n180(S.cible.lon - S.vue.lon) * k;
      }
      /* Le cadre, lissé ; la descente de l'arrivée s'y mêle */
      var c = S.cadreCible, a = S.cadre;
      if (!a) a = S.cadre = { x: c.x, y: c.y, r: c.r };
      else { a.x += (c.x - a.x) * k * 1.4; a.y += (c.y - a.y) * k * 1.4; a.r += (c.r - a.r) * k * 1.4; }
      var vu = a, lonPlus = 0;
      if (S.desc) {
        /* la descente se voit encore quand l'éclat s'est dissipé : une courbe douce sur 3,4 s */
        var pd = S.desc.t0 ? Math.min(1, (t - S.desc.t0) / 3400) : 0, ed = 1 - (1 - pd) * (1 - pd), ap = cadreApproche(a);
        vu = { x: ap.x + (a.x - ap.x) * ed, y: ap.y + (a.y - ap.y) * ed, r: ap.r + (a.r - ap.r) * ed };
        lonPlus = (1 - ed) * 26;
        if (pd >= 1) S.desc = null;
      }
      appliquer(vu);
      var ep = 1 + borne(10 / Math.max(1, vu.r), .012, ATMO - 1);
      atmo.scale.setScalar(ep / ATMO);
      uA.uMax.value = Math.sqrt(1 - 1 / (ep * ep));
      if (S.suivi) S.suivi(vu);
      G.rotation.set(S.vue.lat * RAD, -(S.vue.lon + lonPlus + 90) * RAD, 0, 'XYZ');
      if (S.style === 'verre') {
        G.updateMatrixWorld();
        qInv.copy(G.quaternion).invert();
        uG.uCamObj.value.copy(camera.position).applyQuaternion(qInv);
        uG.uSoleilObj.value.copy(uG.uSoleil.value).applyQuaternion(qInv);
        var tw = (S.masqueCv ? S.masqueCv.width : 4096) / (6.2832 * Math.max(1, vu.r) * S.dpr * .9);
        uG.uLod.value = Math.max(0, Math.log(tw) / Math.LN2) + 1.2;
      }
      placerSol(vu);
      /* en gros plan (l'horizon du hero), le monde intérieur remonte sous la coque : la bande de verre devient fine */
      if (uV) {
        var zoom = borne((vu.r / Math.max(1, S.H) - .6) / 1.1, 0, 1);
        uV.uZoom.value = zoom;
        if (interieur) interieur.scale.setScalar(1 + .08 * zoom);
        if (lueur) lueur.scale.setScalar(1 + .035 * zoom);
      }
      /* Le mode : fondu nuit ↔ jour */
      if (S.or !== S.orCible) {
        S.or += borne(S.orCible - S.or, -dt * 2.2, dt * 2.2);
        couleurs();
      }
      if (S.jour !== S.jourCible) {
        S.jour += borne(S.jourCible - S.jour, -dt * 2.4, dt * 2.4);
        couleurs();
      }
      uE.uTemps.value = S.temps; uP.uTemps.value = S.temps;
      if (uV) {
        uV.uTemps.value = S.temps;
        S.actifK = (S.actifK || 0) + ((S.actifCible || 0) - (S.actifK || 0)) * (1 - Math.exp(-dt * 2.2));   /* le néon s'allume en douceur */
        uV.uActifK.value = S.actifK;
      }
      if (S.pouss && S.pouss.visible) { var uq = S.pouss.material.uniforms; uq.uTemps.value = S.temps; uq.uTaille.value = borne(vu.r * .0082, 1.6, 4.2); }
      Object.keys(arcs).forEach(function (id) { arcs[id].pas(); });
      renderer.render(scene, camera);
      if (!S.prete) signaler();
      if (S.desc && !S.desc.t0) S.desc.t0 = t;
      S.raf = requestAnimationFrame(boucle);
    }

    /* ---------- Les arcs de vol ---------- */
    function courbe(a, b) {
      var va = llVec(a.lat, a.lon, 1), vb = llVec(b.lat, b.lon, 1), ang = va.angleTo(vb), pts2 = [], i, N = 64;
      var h = .016 + ang * .085, s = Math.sin(ang);
      for (i = 0; i <= N; i++) {
        var u = i / N, v;
        if (s < 1e-4) v = va.clone().lerp(vb, u).normalize();
        else v = va.clone().multiplyScalar(Math.sin((1 - u) * ang) / s).add(vb.clone().multiplyScalar(Math.sin(u * ang) / s));
        pts2.push(v.multiplyScalar(1.005 + h * Math.sin(Math.PI * u)));
      }
      return new THREE.CatmullRomCurve3(pts2);
    }
    var uT = null;
    function arc(id, de, vers, opt) {
      opt = opt || {};
      var rien = { tracer: function () { return rien; }, vif: function () { return rien; }, retirer: function () {} };
      if (S.mode !== '3d' || !de || !vers) return rien;
      if (arcs[id]) return arcs[id];
      var cb = courbe(de, vers);
      var u = { uProg: { value: 0 }, uVif: { value: 0 }, uPointille: { value: opt.pointille ? 1 : 0 }, uCouleur: { value: new THREE.Vector3() }, uForce: { value: 1 }, uTirets: { value: 30 } };
      var rt = PETIT ? .0048 : .0036;
      var m = new THREE.Mesh(new THREE.TubeGeometry(cb, 140, rt, 6, false),
        new THREE.ShaderMaterial({ uniforms: u, vertexShader: V_SURF, fragmentShader: F_ARC, transparent: true, depthWrite: false }));
      m.renderOrder = 2;
      m.visible = false;
      G.add(m);
      if (!uT) uT = { uDpr: { value: S.dpr }, uTaille: { value: 9 }, uCouleur: { value: new THREE.Vector3() }, uForce: { value: 0 } };
      var tg = new THREE.BufferGeometry();
      tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
      var ut = { uDpr: uT.uDpr, uTaille: uT.uTaille, uCouleur: { value: new THREE.Vector3() }, uForce: { value: 0 } };
      var tete = new THREE.Points(tg, new THREE.ShaderMaterial({ uniforms: ut, vertexShader: V_TETE, fragmentShader: F_TETE, transparent: true, depthWrite: false }));
      tete.renderOrder = 4;
      tete.visible = false;
      G.add(tete);
      var etat = { p: 0, cible: 0, vif: 0, vifCible: 0 };
      var A = {
        tracer: function (p, net) { etat.cible = borne(p, 0, 1); if (net) etat.p = etat.cible; relancer(); return A; },
        vif: function (oui, net) { etat.vifCible = oui ? 1 : 0; if (net) etat.vif = etat.vifCible; relancer(); return A; },
        retirer: function () {
          G.remove(m); G.remove(tete); m.geometry.dispose(); m.material.dispose(); tg.dispose(); tete.material.dispose();
          delete arcs[id];
        },
        couleur: function () {
          var j = S.jour, P = PALETTE[S.style] || PALETTE.or;
          u.uCouleur.value.fromArray(mix3(P.arcN, P.arcJ, j));
          ut.uCouleur.value.fromArray(mix3(P.arcN, P.arcJ, j));
          u.uPointille.value = (opt.pointille || P.pointille) ? 1 : 0;
          u.uTirets.value = P.pointille ? 90 : 30;
          /* le fil d'or du verre : lumineux (additif) en sombre */
          var mode = P.lumineux && j < .5 ? THREE.AdditiveBlending : THREE.NormalBlending;
          [m, tete].forEach(function (x) { if (x.material.blending !== mode) { x.material.blending = mode; x.material.needsUpdate = true; } });
        },
        pas: function () {
          etat.p += (etat.cible - etat.p) * .22;
          if (Math.abs(etat.cible - etat.p) < .001) etat.p = etat.cible;
          etat.vif += (etat.vifCible - etat.vif) * .12;
          u.uProg.value = etat.p; u.uVif.value = etat.vif;
          m.visible = etat.p > .001;
          var vis = etat.p > .002 && etat.p < .998 && etat.vif > .05;
          tete.visible = vis;
          if (vis) {
            var q = cb.getPointAt(etat.p);
            tg.attributes.position.setXYZ(0, q.x, q.y, q.z);
            tg.attributes.position.needsUpdate = true;
            ut.uForce.value = etat.vif;
          }
        }
      };
      A.couleur();
      arcs[id] = A;
      return A;
    }

    /* ---------- Le mode clair / sombre ---------- */
    function theme(th) {
      th = th === 'jour' ? 'jour' : 'nuit';
      if (th === S.theme) return;
      S.theme = th;
      if (S.mode === 'repli') {
        if (repli) repli.src = th === 'jour' ? TEX.repliJour : TEX.repliNuit;
        return;
      }
      texturesDe(th).then(function () { S.jourCible = th === 'jour' ? 1 : 0; relancer(); }, function (e) { versRepli(e && e.message); });
    }
    function surTheme(e) { theme(e && e.detail && e.detail.theme === 'light' ? 'jour' : 'nuit'); }
    D.addEventListener('kz-theme:change', surTheme);
    function style(st) {
      st = STYLES.hasOwnProperty(st) ? st : 'carnet';
      S.orCible = st === 'reel' ? 0 : 1;
      if (S.mode !== '3d') { S.style = st; return; }
      texturesDe(S.theme).then(function () {
        S.style = st;
        if (st === 'lumiere') poussiere();
        couleurs();
        relancer();
      }, function (e) { versRepli(e && e.message); });
    }
    function surStyle(e) { style(e && e.detail && e.detail.style); }
    D.addEventListener('kz-revue:terre', surStyle);

    /* ---------- Visible ou non ---------- */
    var io = null, cibles = (o.observer && o.observer.length ? Array.prototype.slice.call(o.observer) : [hote]);
    var vus = typeof WeakMap === 'function' ? new WeakMap() : null;
    if ('IntersectionObserver' in W && vus) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { vus.set(en.target, en.isIntersecting); });
        S.visibles = cibles.filter(function (el) { return vus.get(el); }).length;
        if (S.visibles) relancer(); else arreter();
      }, { rootMargin: '10% 0px' });
      cibles.forEach(function (el) { io.observe(el); });
    } else S.visibles = 1;
    function surVisibilite() { if (D.hidden) arreter(); else relancer(); }
    D.addEventListener('visibilitychange', surVisibilite);
    var ro = null;
    if (W.ResizeObserver) { ro = new ResizeObserver(function () { mesurer(); relancer(); }); ro.observe(hote); }

    /* ---------- Démarrage ---------- */
    if (S.mode === '3d') {
      if (!construire()) { /* repli posé */ }
      else {
        mesurer();
        texturesDe(S.theme).then(function () { S.texOk = true; if (S.style === 'lumiere') poussiere(); relancer(); }, function (e) { versRepli(e && e.message); });
      }
    } else {
      hote.classList.add('is-repli');
      poserRepli();
    }

    /* ---------- L'API ---------- */
    api.cadrer = function (c, opt) {
      if (!c) return api;
      var n = { x: +c.x, y: +c.y, r: Math.max(4, +c.r) }, a = S.cadre, o = S.cadreCible;
      if (opt && opt.saut) S.cadre = { x: n.x, y: n.y, r: n.r };
      else if (opt && opt.suivre && a && o) { a.x += n.x - o.x; a.y += n.y - o.y; }
      S.cadreCible = n;
      if (S.mode === 'repli') placerRepli(); else relancer();
      return api;
    };
    api.orienter = function (lat, lon) {
      if (S.tw) { S.tw.ok(); S.tw = null; }
      S.cible = { lat: +lat, lon: +lon };
      relancer();
      return api;
    };
    api.viser = function (lat, lon, opt) {
      opt = opt || {};
      if (S.mode !== '3d') return Promise.resolve();
      var d = opt.duree != null ? +opt.duree : 1.4;
      if (S.tw) { S.tw.ok(); S.tw = null; }
      if (!(d > 0) || reduit()) { S.vue = { lat: +lat, lon: +lon }; S.cible = { lat: +lat, lon: +lon }; relancer(); return Promise.resolve(); }
      return new Promise(function (ok) {
        S.tw = { a: { lat: S.vue.lat, lon: S.vue.lon }, b: { lat: +lat, lon: +lon }, d: d * 1000, t0: 0, ok: ok };
        relancer();
      });
    };
    api.vue = function () { return { lat: S.vue.lat, lon: n180(S.vue.lon) }; };
    api.deriver = function (v) { S.derive = Math.max(0, +v || 0); return api; };
    api.arc = arc;
    api.points = function (l) { points(l || []); return api; };
    api.allumer = function (id) {
      if (uP) uP.uActif.value = id == null ? -1 : ids.indexOf(id);
      var pa = id == null ? null : PAYS[String(id).split('-')[0]];
      if (uV) {
        if (pa) {
          uV.uActif.value.copy(llVec(pa[0], pa[1], 1));
          uV.uActifCos.value.set(Math.cos(pa[2] * RAD), Math.cos((pa[2] + Math.max(2, pa[2] * .4)) * RAD));
        }
        if (id !== S.actifId) { S.actifId = id; S.actifK = 0; }
        S.actifCible = pa ? 1 : 0;
      }
      relancer();
      return api;
    };
    api.escales = function (oui) { S.ptsMasques = !oui; if (pts) pts.visible = !!oui; relancer(); return api; };
    api.opacite = function (v) {
      v = borne(+v || 0, 0, 1);
      if (Math.abs(v - S.opac) < .002) return api;
      S.opac = v;
      hote.style.opacity = v >= .999 ? '' : v.toFixed(3);
      hote.style.visibility = v < .01 ? 'hidden' : '';
      if (v < .01) arreter(); else relancer();
      return api;
    };
    api.theme = function (th) { theme(th); return api; };
    api.style = function (st) { style(st); return api; };
    api.suivre = function (fn) { S.suivi = typeof fn === 'function' ? fn : null; if (S.suivi && S.mode === 'repli' && S.cadreCible) S.suivi(S.cadreCible); return api; };
    api.pause = function () { S.pause = true; arreter(); return api; };
    api.reprendre = function () { S.pause = false; relancer(); return api; };
    api.detruire = function () {
      S.mort = true; arreter();
      D.removeEventListener('kz-theme:change', surTheme);
      D.removeEventListener('kz-revue:terre', surStyle);
      D.removeEventListener('visibilitychange', surVisibilite);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (renderer) { renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      if (repli && repli.parentNode) repli.parentNode.removeChild(repli);
      hote.__terre = null;
    };
    return api;
  }

  var Terre = W.Terre = { creer: creer, supporte: supporte, prete: false };
})();
