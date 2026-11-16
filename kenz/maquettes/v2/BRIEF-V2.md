# Brief V2 : site de Kenz, nouvelles propositions (11/11/2026)

## Ce que Kenz a dit de la V1 (à ne surtout pas refaire)
« Je n'aime pas du tout. Pas épuré, aucune micro-animation, beaucoup trop geek, nerveux, pas satisfaisant. Je ne veux pas rentrer dans les clichés de développeur. Tout refaire, plusieurs propositions, utiliser de vrais assets, reprendre les photos de moi. Des containers premium, des assets premium. »

La V1 avait : métaphores techniques (voyant PROD, timecode, lignes de métro, registre), polices mono, 38 pages, beaucoup de texte, des étiquettes « à confirmer » partout, et des animations trop discrètes pour être vues. **Tout cela est banni.**

## Le cap de la V2
- **Épuré** : beaucoup d'air, peu de mots, une idée par écran. Une phrase vaut mieux que trois.
- **Premium** : des containers soignés (grands rayons, ombres douces en couches, filets fins, matières), des images grandes et belles, une typographie maîtrisée. Références d'ambiance : pages produit Apple, Aesop, Airbnb Éditions, sites de photographes et de studios haut de gamme. Pas de « site de dev ».
- **Les vraies photos de Kenz en premier** : portraits détourés, paysage de Kuala Lumpur, Startup Weekend, HYROX, Spartan, miniatures réelles des vidéos, vraies captures App Store.
- **Micro-animations visibles et élégantes** dès le chargement et à chaque interaction : on doit les sentir sans qu'elles crient.
- **Deux casquettes vraiment séparées** : Pro (AI engineer, développeur fullstack, solopreneur qui lance des apps et installe des agents IA chez ses clients) et Créateur (Kenz en Asie, sport k15ze). Une bascule claire et belle entre les deux.
- **Aucun cliché de développeur** : pas de police monospace, pas de terminal, pas de code affiché, pas de `</>`, pas d'accolades, pas de grilles de points façon blueprint, pas de néon, pas de « Hello World », pas de jargon (API, stack, pipeline, commit, prod) dans les titres. On parle comme à un client ou à un abonné.
- **Rien d'inventé** et **rien de privé** : aucune adresse e-mail, rien sur la recherche d'emploi ni sur l'usage privé des agents. Les agents IA se présentent comme un savoir-faire installé chez un client.

## La charte de Kenz (Motion Lab v2.0, validée le 07/11/2026) : à respecter
- Principe : « tes vraies images d'abord. Par-dessus, une couche de texte éditoriale et premium ».
- **Titre** : Melodrama (600), 1 à 3 mots, casse normale. Fichier fourni : `assets/melodrama.css` (police en data URI, famille `"Melodrama"`). Repli : `"Instrument Serif", Georgia, serif`.
- **Texte** : Inter (Google Fonts, axe opsz), 400 à 700, 2 graisses max par bloc.
- **Le mot** : Instrument Serif *italique* (Google Fonts) pour **un seul** mot important par phrase, éventuellement avec une lueur douce.
- **Couleurs** : Crème `#F4EFE6` (texte sur image, jamais de blanc pur sur image), Encre `#1A1918`, Rouge `#E8322B` (un seul élément rouge à l'écran, réservé à un appel à l'action ou un prix), Lagon `#0F5D6B` (accent possible). Le jaune `#FFE600` est réservé à TikTok : à éviter ici.
- **Verre** (cartes posées sur une vraie image uniquement) : `rgba(28,27,26,.42)`, flou 26 px, liseré blanc 16 %.
- **Gestes** : mot par mot du flou au net avec léger zoom (0,07 s d'écart) ; titre révélé par un balayage doux gauche → droite avec flou ; chiffre qui monte d'une fente ; carte qui monte de 34 px et se pose (échelle 0,965 → 1) puis son contenu arrive ; **arrive lentement (expo.out), part vite (0,24 s)**.
- **Interdits de la charte** : rebond, flottement en boucle, pulsation, zoom lent sur un titre posé, « fondu + glissé vers le haut » partout.
- Le texte ne passe jamais sur un visage.

## Assets fournis (chemins relatifs depuis la page : `assets/...`)
Portraits détourés (PNG/WebP transparents, 1080×1920) :
- `assets/img/kenz-pro.webp` : Kenz en costume bleu nuit, chemise blanche, regard caméra. → casquette Pro.
- `assets/img/kenz-moi.webp` : Kenz en t-shirt vert anis Nike, regard de côté. → casquette Créateur.
Photos :
- `assets/img/paysage-kuala-lumpur.jpg` (1600×900) : tours de Kuala Lumpur et rizières en terrasses au coucher du soleil, sans texte. Très belle image de fond.
- `assets/img/kenz-carre.jpg` (900×855) : Kenz en t-shirt vert devant ce même paysage (photo de profil).
- `assets/img/startup-weekend-1.jpg` (1200×900, remise du prix avec l'équipe), `-2.jpg` (1200×800, Kenz bras levés au moment de l'annonce), `-3.jpg` (900×1200, portrait).
- `assets/img/hyrox-1..3.jpg` (733×1100, portrait) et `hyrox-4.jpg` (1100×733) : Kenz en course HYROX (31/05/2025). Un filigrane d'organisateur est en bas à droite : recadrer avec `object-position` pour le cacher si possible.
- `assets/img/spartan-1.jpg` (511×768), `spartan-2.jpg` (768×511) : Spartan Race. Petites : ne pas afficher en grand.
Miniatures réelles des vidéos (16:9, 960×540, avec le titre du pays incrusté : à utiliser comme cartes vidéo, pas comme fonds) :
- `assets/img/video-chine-14-jours.jpg` (« 14 JOURS », la dernière vidéo), `video-chine.jpg`, `video-malaisie.jpg`, `video-coree.jpg`, `video-japon.jpg` (illustrée), `video-islande.jpg`.
Apps (icônes 320×320 carrées, arrondir en CSS ~22 %) :
- `assets/apps/{oshii,sago,wado,croc,miru,zenko}-icone.jpg`
Captures App Store (marketing, très belles) :
- Paysage 1000×~700 (visuel d'iPad avec titre) : `wado-ecran-1.jpg` (« Muscu et calories, un seul plan », fond vert sombre), `wado-ecran-2.jpg`, `croc-ecran-1.jpg` (« Arrête de te ronger les ongles », fond lavande, mascotte violette), `croc-ecran-2.jpg`.
- Portrait ~460×1000 (écran de téléphone) : `oshii-ecran-1.jpg`, `oshii-ecran-2.jpg`, `sago-ecran-1.jpg`, `sago-ecran-2.jpg`, `miru-ecran-1.jpg`, `zenko-ecran-1.jpg`.
- Logo : `assets/img/logo-kz.webp` (monogramme KZ, 1024×1024).

## Les faits (seules données autorisées)
### Pro
- Phrase d'accroche : « Je construis des apps où l'IA fait le vrai travail. Et j'installe des agents IA dans votre équipe. »
- Titres de Kenz (site actuel) : AI engineer · Développeur fullstack · Solopreneur.
- **Six apps sur l'App Store**, conçues, codées et lancées seul, de l'idée au store (Oshii aussi sur Google Play). Versions relevées le 11/11/2026 :
  - **Oshii** : une vidéo TikTok, Instagram ou YouTube Shorts devient une recette pesée, prête à cuisiner. iOS + Android, v2.0.2 (mise à jour le 04/11/2026). App Store : https://apps.apple.com/fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905 · Google Play : https://play.google.com/store/apps/details?id=com.x7kenz.Oshii · Site : https://oshii.fr
  - **Sago** : apprendre le japonais par l'image. « Là, tu ne comprends rien. 15 minutes plus tard : maintenant, tu comprends. » 180 épisodes en saison 1. iOS et iPad, v2.0.1 (30/10/2026). https://apps.apple.com/fr/app/sago-apprendre-le-japonais/id6759610780 · https://sago-landing.vercel.app
  - **Wado** : muscu et calories, un seul plan ; une photo de ton plat devient des macros. iOS, v1.1.1 (04/11/2026). https://apps.apple.com/us/app/wado-calories-ia-muscu/id6813179120 · https://wado-lilac.vercel.app
  - **Croc** : arrêter de se ronger les ongles, un petit pacte chaque jour, sans te juger. iOS, v1.2.1 (19/10/2026). https://apps.apple.com/app/croc-stop-ongles-rong%C3%A9s/id6801541157 · https://croc-snowy.vercel.app
  - **Miru** : jeux de soirée entre amis ; un thème inventé devient un jeu généré en direct. 9 jeux en V2. iOS + web, v2.0 (30/10/2026). https://apps.apple.com/us/app/miru-jeux-entre-amis/id6761622088 · https://v0-miru-website.vercel.app
  - **Zenko** : des programmes quotidiens selon tes envies et ton budget. iOS, v1.0 (20/10/2025). https://apps.apple.com/ch/app/zenko/id6753706200
- **Agents IA (offre client)** — promesse : « Je mets en place des équipes d'agents IA qui travaillent comme une vraie équipe : chacun son rôle, une mémoire commune, et rien ne part sans votre validation. »
  - Comment ça marche, en 4 idées simples : un coordinateur (**Hermes**) qui sait où en est chaque dossier ; des agents avec chacun un rôle séparé ; une mémoire commune où tout est noté et sourcé ; **vous validez** avant que quoi que ce soit parte.
  - Cas d'usage, dans les mots d'un client : veille et recherches sourcées · réponses clients et support · production de contenu et de vidéos · back-office et suivi · agents qui codent avec relecture · mémoire d'équipe (plus rien ne se perd).
  - Ce qui le prouve : six apps livrées, une saison de 180 épisodes, plus de 60 vidéos produites.
- **Offres** : Agents IA pour votre équipe · Intégrer l'IA dans votre produit · Votre app, de l'idée au store · Contenu vidéo automatisé pour votre marque.
- **Distinction** : 1ʳᵉ place au Startup Weekend (54 h pour concevoir, prototyper et pitcher en équipe). Photos disponibles.
- Liens pro : GitHub https://github.com/7Darken · LinkedIn https://www.linkedin.com/in/kenz-narainen/
- Contact : formulaire simulé (nom, besoin, message), pas d'adresse e-mail affichée.

### Créateur
- **Kenz en Asie** : « Je voyage en Asie et je raconte ce que ça coûte vraiment. » Ce qui marche : le pratique (budget, astuces, « avant de partir »), la Chine en tête.
- Chiffres : ≈ 28 000 abonnés TikTok (déclaré le 09/10/2026) · 7,83 M de vues TikTok (04/11/2026) · record 725 600 vues (Malaisie, budget) · 1 530 abonnés YouTube (04/11/2026) · 9 pays filmés.
- Vidéos : **dernière** « Premier voyage en Chine : itinéraire de 14 jours » (31/10/2026) https://www.youtube.com/watch?v=uG6WYRatp0I · **la plus vue sur YouTube** « Tout savoir pour ton voyage en Malaisie » (24 671 vues) https://www.youtube.com/watch?v=Fp3SsWY28WE · « 15 choses à savoir avant de voyager en Chine » (8 275 vues) https://www.youtube.com/watch?v=rR6V6H3hFKA · Short « Réparer son iPhone en Chine » (93 760 vues) https://www.youtube.com/shorts/LRxxde_vebE
- Destinations filmées avec miniature : Chine, Malaisie, Corée, Japon, Islande.
- Pour les abonnés : l'itinéraire Chine 14 jours (en ligne : https://kenzenbien.fr/itineraire/chine) ; d'autres guides « bientôt ».
- **k15ze** : sport, nutrition, mes courses : HYROX (mai 2025), Spartan Race. YouTube https://www.youtube.com/@K15ze-l6z
- Réseaux : YouTube Kenz in Asia https://www.youtube.com/@7Kinze · TikTok En Bien en Asie https://www.tiktok.com/@7kinze · Instagram https://www.instagram.com/kenzvoyage_enbien/
- Marques : « Travaillons ensemble » → formulaire simulé (marque, idée, budget), sans adresse e-mail.

### En ce moment (petit bandeau « live », facultatif)
Oshii mis à jour le 04/11 · Wado mis à jour le 04/11 · dernière vidéo le 31/10 · Short publié le 07/11. Afficher en dates relatives douces (« il y a 7 jours »), calculées depuis la date du jour du navigateur.

## Structure de chaque proposition (une seule page, longue, épurée)
1. Barre de navigation fine : « Kenz » en Melodrama, bascule **Pro / Créateur** (une seule, élégante, avec indicateur animé), un bouton de contact.
2. Hero avec un portrait réel.
3. Côté **Pro** : l'accroche → les 6 apps (icône, une phrase, vraies captures, lien store) → agents IA pour votre équipe (schéma simple et calme, sans jargon) → ce que je peux faire pour vous (4 offres) → Startup Weekend → contact.
4. Côté **Créateur** : l'accroche → la dernière vidéo en grand → chiffres → destinations → guides pour les abonnés → k15ze (sport) → les liens (version « lien en bio ») → travailler avec une marque.
5. Pied de page.
La bascule Pro / Créateur change le contenu affiché (et l'ambiance si ta direction le prévoit) avec une vraie transition. Utilise `location.hash` = `#pro` ou `#createur` (lettres simples seulement) pour qu'on puisse partager un côté.

## Règles techniques (artifact claude.ai)
- Un fichier HTML complet : `<!doctype html>`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `<title>` court (ex. « Kenz — Deux portraits »), styles et scripts inline.
- Polices : `<link rel="stylesheet" href="assets/melodrama.css">` + Google Fonts (Inter, Instrument Serif) uniquement.
- Scripts externes autorisés seulement : GSAP 3.12.5 et ScrollTrigger depuis `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` et `.../ScrollTrigger.min.js`, Lenis `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js`. Rien d'autre. Pas d'iframe, pas d'image externe (YouTube, Unsplash…) : seulement `assets/...`.
- Liens externes en `target="_blank" rel="noopener"`. Pas de `mailto:`. Formulaires : `preventDefault`, validation, état de succès animé.
- La page doit être **complète au repos** : rien ne reste à `opacity:0` en attendant un scroll si le JS échoue (classe `js` sur `<html>` avant d'appliquer les états initiaux d'animation).
- Responsive impeccable de 360 px à 1600 px, sans scroll horizontal ; gouttière `padding-inline: max(16px, env(safe-area-inset-left/right))`.
- Accessibilité : contrastes AA, focus visibles, `alt` réels, `prefers-reduced-motion` respecté (animations réduites à des fondus).
- Animations sur transform / opacity / filter / clip-path uniquement.
- Une seule direction claire : soit tout clair, soit tout sombre, soit une bascule d'ambiance liée à Pro / Créateur. Définis toutes les couleurs explicitement (`body` avec un fond).
- **Aucune commande lourde** sur la machine : pas de navigateur headless, pas de serveur, pas de build. Vérifie ton JS avec `node --check` sur les scripts extraits dans un fichier temporaire (à supprimer ensuite), et vérifie avec `ls` que chaque image citée existe.
