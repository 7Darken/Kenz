# Brief V3 : le récit (12/11/2026)

## Ce que Kenz a dit de la V2
« Le passage : plutôt comme une énigme à la Tomb Raider. Pas trop compliqué, mais avec du motion. Et travailler vraiment les pages : c'est assez design, mais ce n'est pas UX. Il y a beaucoup d'info, ça va un peu dans tous les sens. Et ne dis pas des trucs genre "6 apps". Je pensais plutôt aux icônes, puis une animation différente pour chaque app, introduite comme un onboarding : c'est quoi, là ? Vraiment pensé user. Je ne veux pas une logique de portfolio où j'expose ce que j'ai fait, mais un storytelling digeste. »

Avant (V1, V2) : trop geek, puis trop d'info. Kenz aime le design de la V2 (« assez design »). Le problème est maintenant l'**expérience** : la page doit se lire comme une histoire, pas comme un catalogue.

## Les règles du récit (à respecter strictement)
1. **Une idée par écran.** Un écran = un titre court + une animation qui montre + au plus une phrase et une action. Au plus ~25 mots visibles par écran, hors navigation.
2. **On montre au lieu d'affirmer.** Interdits : « Six apps », « 180 épisodes », « 60+ vidéos », « 4 offres », les murs de chiffres, les nuages de puces, les tableaux. Un chiffre n'apparaît que s'il raconte quelque chose (ex. le prix payé en Chine).
3. **On parle du problème de la personne en face, dans ses mots**, puis on montre comment c'est résolu. Jamais « j'ai fait X » en premier.
4. **Une progression claire.** On sait toujours où on est (un repère discret : petite barre ou dock), et on sait quoi faire ensuite (une seule action principale par écran).
5. **Digeste sur mobile** : les visiteurs créateur arrivent de TikTok sur leur téléphone. Chaque chapitre se lit sans zoomer, sans scroll horizontal forcé, avec des cibles de 44 px.
6. Pas d'étiquettes « exemple », « à confirmer » visibles, sauf une mention discrète quand une animation montre des données d'exemple.
7. **Aucun composant « tag »** (Kenz, 12/11 : « vraiment trop AI slop ») : pas de sur-titre en pastille ou en capitales espacées au-dessus des titres, pas de badge avec un point de couleur (« ● En ligne »), pas de numéros décoratifs 01/02/03. Un titre se suffit ; un contexte utile passe dans la phrase ou en petite légende en Instrument Serif italique, sans bordure, sans fond, sans point.

## Identité visuelle (reprise de la V2 « Golden hour », la plus appréciée)
- **Pro = heure bleue** : fond encre bleu nuit (≈ `#0E1220` → `#121A2B`), texte Crème `#F4EFE6`, accent Lagon `#0F5D6B` éclairci pour le contraste si besoin. Portrait en costume `assets/img/kenz-pro.webp`. Paysage de Kuala Lumpur en heure bleue (filtres CSS sur `assets/img/paysage-kuala-lumpur.jpg`).
- **Créateur = heure dorée** : fond encre chaud (≈ `#16110C`), texte Crème, lumière dorée du paysage, portrait en t-shirt `assets/img/kenz-moi.webp`.
- Charte de Kenz (Motion Lab v2.0) :
  - Titres en **Melodrama** (`assets/melodrama.css`, famille `"Melodrama"`), 1 à 3 mots.
  - Texte en **Inter** (Google Fonts).
  - **Un seul** mot en *Instrument Serif italique* par phrase.
  - Rouge `#E8322B` : un seul élément rouge à l'écran.
  - Verre (`rgba(28,27,26,.42)`, flou 26 px, liseré blanc 16 %) seulement sur une image.
  - Gestes : mot par mot du flou au net (0,07 s) ; titre en balayage doux avec flou ; chiffre qui monte d'une fente ; carte qui monte de 34 px et se pose (0,965 → 1) ; arrive lentement (expo.out), part vite (0,24 s).
  - Interdits : rebond, flottement en boucle, pulsation, zoom lent.
- Containers premium : grands rayons, ombres en couches, filets fins. Les vraies captures App Store dans `assets/apps/`.

## Deux pages, deux adresses
- `pro.html` : l'univers Pro. `createur.html` : l'univers Créateur. Chaque page ne montre QUE son univers (nav, contenu, pied de page). Aucune bascule visible.
- Le seul passage de l'une à l'autre est **le sceau** (l'énigme, plus bas), placé au dernier chapitre de chaque page. Le point de « Kenz· » dans la nav est un lien discret vers `#sceau`.
- `index.html` : petite page de lancement pour Kenz (deux entrées). Je m'en occupe.

---

## PRO : le récit (`pro.html`)
Public : un futur client (veut une app, de l'IA dans son produit ou des agents IA), un recruteur. Il doit comprendre en 10 s : « Kenz transforme une idée en app que les gens utilisent, et l'IA y fait le vrai travail. Il peut faire pareil pour moi. »

**P0 Hero** (heure bleue, portrait costume, texte jamais sur le visage). Titre « Kenz ». Phrase : « Je transforme une idée en app que les gens utilisent. Et l'IA y fait le *vrai* travail. » Action : « Découvrir » (descend). Lien secondaire discret : « Me contacter ».

**P1 Les icônes** : les icônes des apps arrivent une à une, comme posées sur le dock d'un téléphone (montée 34 px, 0,965 → 1, 80 ms d'écart), sans titre-catalogue. Phrase : « Chaque app part d'un petit problème du *quotidien*. » Puis « Commençons par celui-ci. » Le dock devient ensuite le **repère de progression** des chapitres apps (épinglé en bas sur ordinateur ; compact sur mobile), icône active en lumière, icônes cliquables.

**P2 à P7 Une app = un onboarding**. Chaque chapitre suit 3 temps, joués au scroll (épinglage sur ordinateur, déclenchement à l'entrée sur mobile) :
1. **Le problème**, dans les mots de l'utilisateur (titre court).
2. **L'animation** qui montre la magie, propre à chaque app (voir ci-dessous). Une donnée d'exemple porte une mention discrète « exemple ».
3. **Le résultat** : la vraie capture App Store se pose, l'icône, le nom, une phrase, le lien store.

Storyboards (texte à utiliser, animation à réaliser en CSS/SVG/GSAP, sans image externe) :
- **Oshii** (rouge, icône pot) : problème « Tu enregistres des recettes sur TikTok. Tu ne les refais *jamais*. »
  - Animation : une carte vidéo verticale arrondie (style vidéo courte : barre de progression, cœur, légende « pâtes crémeuses au citron ») ; une feuille de partage monte avec l'icône Oshii ; un toucher ; la vidéo se replie dans l'icône (scale + flou) ; une fiche recette se déplie : titre, puis les ingrédients pesés un par un (« Pâtes · 200 g », « Parmesan · 40 g », « Citron · 1 », « Crème · 10 cl »), puis « 4 étapes ».
  - Résultat : « Partage la vidéo à Oshii : elle devient une recette pesée, prête à cuisiner. » App Store + Google Play. Captures `oshii-ecran-1/2.jpg`.
- **Sago** (violet nuit) : problème « Le japonais, ça a l'air *impossible*. »
  - Animation : la phrase 「ねこ が すき」 en grand, illisible et floue ; au-dessus de ねこ se dessine un chat (trait SVG), au-dessus de すき un cœur ; les mots deviennent nets ; « J'aime les chats. » apparaît mot par mot dessous.
  - Résultat : « Là, tu ne comprends rien. 15 minutes plus tard : maintenant, tu *comprends*. » (texte réel de l'app). Captures `sago-ecran-1/2.jpg`.
- **Wado** (vert sombre) : problème « Compter ses calories ? Personne n'a le *temps*. »
  - Animation : une assiette dessinée (cercle, aliments en formes simples et douces) ; une ligne de scan la balaie ; des pastilles de macros apparaissent par la fente (« Protéines 38 g », « Glucides 62 g », « Lipides 14 g », « ≈ 520 kcal », mention « exemple ») ; l'anneau « Ta journée » se remplit.
  - Résultat : « Une photo de ton plat. Wado compte, et ajuste ton plan. » Capture `wado-ecran-1.jpg` (paysage).
- **Croc** (lavande, mascotte violette) : problème « Tu te ronges les ongles depuis *toujours* ? »
  - Animation : une semaine L M M J V S D ; le matin, une pastille « Je m'engage » se coche ; le soir, « Tenu » ; les jours se cochent un à un ; un compteur de série monte par la fente jusqu'à « 12 jours ».
  - Résultat : « Un petit pacte le matin, validé le soir. Croc t'accompagne, sans te *juger*. » Capture `croc-ecran-1.jpg` (paysage).
- **Miru** (bleu-violet, soirée) : problème « Ce soir, on joue à *quoi* ? »
  - Animation : un champ où s'écrit « Les films des années 2000 » ; des cartes se battent et se distribuent (mots générés) ; un cercle de 5 avatars autour d'un téléphone qui passe de main en main.
  - Résultat : « Tu choisis un thème, Miru crée le jeu en direct. Un téléphone qui tourne, ou chacun le sien. » Capture `miru-ecran-1.jpg`.
- **Zenko** (brun chaud) : problème « Une journée à remplir, un budget à *tenir*. »
  - Animation : un curseur de budget glisse de 40 € à 25 € ; trois cartes Matin, Après-midi, Soir se réorganisent.
  - Résultat : « Zenko compose ta journée selon tes envies et ton budget. » Capture `zenko-ecran-1.jpg`.

Chaque animation est différente, courte (2 à 4 s), jouée une fois à l'entrée, avec un bouton discret « Rejouer ». Le rythme est pensé comme l'onboarding d'une app premium.

**P8 Et pour votre équipe** (agents IA, même logique d'onboarding) :
- Problème : « Vous passez trop de temps à chercher et trier l'*info* ? »
- Animation : des cartes sources tombent (« Site concurrent », « Appel d'offres », « Article ») ; deux agents (« Veille », « Vérification ») les trient ; **Hermes** les assemble en une « Note du lundi » avec une source par ligne. Arrive alors un grand bouton « Valider ». **C'est le visiteur qui clique** : la note part, avec une coche tracée.
- Phrase : « J'installe une équipe d'agents IA chez vous. Chacun son rôle, une mémoire commune, et rien ne part sans votre *validation*. »
- Ensuite, au plus 3 autres besoins en onglets, dans les mots du client : « Je veux publier plus de contenu sans y passer mes soirées » · « Personne ne sait où en est un dossier » · « Mon back-office, c'est un tableur ». Chaque onglet donne une phrase de réponse (tirée de `../_shared/content.js`, `agents.cas`).

**P9 Comment on avance** : trois temps, une ligne chacun : « On en parle. » · « Je vous montre un premier prototype. » · « Vous validez, je lance. »

**P10 Un moment** : la photo du Startup Weekend en grand (`startup-weekend-2.jpg`, Kenz bras levés ; recadrer pour masquer le filigrane). Une phrase : « 54 heures, une équipe, la *première* place. »

**P11 Contact** : « Parlons de votre idée. »
- Champs : nom ; « Votre besoin » en pastilles : Une app · De l'IA dans mon produit · Des agents IA · Autre ; message.
- Envoi simulé avec état de succès animé.
- Liens GitHub (https://github.com/7Darken) et LinkedIn (https://www.linkedin.com/in/kenz-narainen/).
- Aucune adresse e-mail affichée.

**P12 Le sceau** : « Il existe une autre version de moi. » (voir l'énigme).

Liens stores :
- Oshii : https://apps.apple.com/fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905 · https://play.google.com/store/apps/details?id=com.x7kenz.Oshii
- Sago : https://apps.apple.com/fr/app/sago-apprendre-le-japonais/id6759610780
- Wado : https://apps.apple.com/us/app/wado-calories-ia-muscu/id6813179120
- Croc : https://apps.apple.com/app/croc-stop-ongles-rong%C3%A9s/id6801541157
- Miru : https://apps.apple.com/us/app/miru-jeux-entre-amis/id6761622088
- Zenko : https://apps.apple.com/ch/app/zenko/id6753706200

---

## CRÉATEUR : le récit (`createur.html`)
Public : un abonné qui arrive de TikTok sur son téléphone, une marque. Il doit comprendre en 10 s : « Kenz voyage en Asie et dit ce que ça coûte vraiment. Je peux le suivre et m'en servir pour mon voyage. »

**C0 Hero** (heure dorée, portrait t-shirt). Titre « Kenz ». Phrase : « Je voyage en Asie et je te raconte ce que ça coûte *vraiment*. » Action : « Voir la dernière vidéo ».

**C1 La dernière vidéo** : grande miniature `video-chine-14-jours.jpg`, « Premier voyage en Chine : itinéraire de 14 jours », publiée le 31/10/2026, lien https://www.youtube.com/watch?v=uG6WYRatp0I. Le bouton lecture s'étire au survol.

**C2 Le vrai prix** (le cœur du récit, interactif) : « En Chine, voilà ce que j'ai *payé*. » Les prix arrivent un par un au scroll. Chaque carte porte un objet dessiné simple, le poste et le prix qui monte de la fente :
- Vol Pékin → Chongqing ≈ 100 €
- Train Chongqing → Wulong moins de 9 €
- 24 h dans un spa à volonté, petit-déjeuner compris : 25 €
- Un repas à Shanghai : 7–8 €
- Tenue d'empereur à la Grande Muraille ≈ 20 € la journée
- **Finale** : réparation d'iPhone à Shenzhen ≈ 10 €, avec « 200 € » barré à la main en rouge (le seul rouge de l'écran) et « vu sur le site d'Apple France »

Mention discrète : « Prix vécus, pas des tarifs garantis. »

**C3 Le voyage** : une ligne de voyage horizontale, Chine → Malaisie → Corée → Japon → Islande, avec les vraies miniatures (`video-*.jpg`), à faire glisser au doigt (scroll-snap natif). Chaque arrêt mène à la chaîne https://www.youtube.com/@7Kinze. La Malaisie porte : « Ma vidéo la plus vue : le budget. »

**C4 Pour ton voyage** : « Tu pars en Chine ? » → une carte « L'itinéraire de 14 jours, jour par jour » → https://kenzenbien.fr/itineraire/chine. Une ligne : « D'autres guides arrivent. »

**C5 Entre deux voyages** : « Et entre deux voyages, je *m'entraîne*. » Photo HYROX en grand (`hyrox-*.jpg`, recadrer le filigrane), « HYROX · mai 2025 », Spartan en petit. Lien k15ze https://www.youtube.com/@K15ze-l6z.

**C6 Me suivre** : liste façon lien en bio :
- YouTube Kenz in Asia https://www.youtube.com/@7Kinze
- TikTok En Bien en Asie https://www.tiktok.com/@7kinze
- Instagram https://www.instagram.com/kenzvoyage_enbien/
- YouTube k15ze

Une seule phrase chiffrée : « ≈ 28 000 personnes me suivent sur TikTok. »

**C7 Marques** : « Une marque, une destination, une *idée* ? » Formulaire court (marque, idée, ordre de budget), envoi simulé.

**C8 Le sceau** : « Il existe une autre version de moi. »

---

## Le sceau : l'énigme (`shared/sceau.css` + `shared/sceau.js`)
Esprit Tomb Raider : un mécanisme ancien, simple à résoudre, très satisfaisant à ouvrir.
- **Le mécanisme** :
  - Un médaillon circulaire (≈ min(80vw, 420 px)) en pierre sombre ou bronze patiné, rendu en CSS/SVG avec dégradés, grain et gravures fines.
  - **Trois anneaux concentriques**. Chacun porte un fragment gravé du symbole de l'autre univers : un soleil pour aller vers Créateur, une lune ou étoile pour aller vers Pro.
  - Un petit repère gravé en haut indique l'alignement.
- **Le geste** :
  - Un clic ou toucher sur un anneau le fait tourner de 60° : rotation nette, ease mécanique, petit « cran » visuel, sans rebond.
  - On peut aussi le faire glisser du doigt ou de la souris, dans les deux sens.
  - Les positions de départ sont fixes : 2, 4 et 1 crans à faire.
  - Un anneau bien placé allume légèrement sa rainure.
- **L'ouverture** :
  - Quand les trois sont alignés, ils se verrouillent l'un après l'autre (120 ms d'écart).
  - La lumière court dans les rainures jusqu'au centre (stroke-dashoffset) et le symbole complet s'illumine.
  - Le médaillon se fend verticalement et les deux moitiés s'écartent comme une porte de temple, avec quelques particules de poussière (canvas, peu nombreuses).
  - Derrière : la lumière et l'image du hero de l'autre univers (heure dorée ↔ heure bleue).
  - L'ouverture grandit jusqu'à remplir l'écran, puis la page navigue vers l'autre page avec `#porte`.
- **L'arrivée** :
  - Sur la page d'arrivée, si `location.hash === '#porte'`, l'écran démarre avec les deux moitiés de porte fermées au centre, symbole lumineux.
  - Elles s'écartent (≈ 1,1 s expo.out) et révèlent le hero, dont le texte arrive mot par mot.
  - Ensuite, `history.replaceState` retire `#porte`.
- **Aide** :
  - Après 10 s sans réussite ou 8 clics, le bon fragment de chaque anneau scintille faiblement, une seule fois.
  - Une phrase-indice gravée : « Aligne les trois fragments. »
  - Un lien très discret « Passer » ouvre directement la porte (accessibilité).
- **Accessibilité** :
  - Chaque anneau est un `button` : « Anneau extérieur, tourner », avec un état annoncé.
  - Clavier : Entrée ou Espace pour tourner ; flèches pour tourner dans l'autre sens.
  - Mouvement réduit : rotations instantanées, ouverture en fondu.
- **API (contrat entre les fichiers)** :
  - Dans la page : `<section id="sceau" class="sceau" data-sceau data-vers="createur.html" data-symbole="soleil">` côté Pro, et `data-vers="pro.html" data-symbole="lune"` côté Créateur.
  - Le script remplit cette section lui-même (titre, médaillon, indice).
  - La page charge `shared/sceau.css` dans le `<head>` et `shared/sceau.js` en fin de `<body>`, après GSAP s'il est utilisé.
  - Pour l'arrivée, la page n'a rien à faire : `sceau.js` gère `#porte` au chargement et émet `document.dispatchEvent(new CustomEvent('sceau:arrivee'))` quand la porte est ouverte. La page écoute cet événement pour lancer l'entrée de son hero ; sans `#porte`, l'entrée du hero se joue normalement au chargement.
  - Les couleurs viennent des variables CSS de la page : `--sceau-lumiere` (doré `#F2B45A` vers Créateur, bleu `#9DB8FF` vers Pro), `--bg`, `--creme`.

---

## Règles techniques (artifact claude.ai, multi-fichiers)
- Pages HTML complètes : `<!doctype html>`, `meta charset`, `meta viewport` avec `viewport-fit=cover`, `<title>` court (« Kenz — Pro », « Kenz — Créateur »).
- Polices : `assets/melodrama.css` + Google Fonts (Inter, Instrument Serif) uniquement.
- Scripts externes autorisés :
  - GSAP 3.12.5 + ScrollTrigger : `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` et `ScrollTrigger.min.js` ;
  - Lenis 1.1.13 : `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js`.
- Images : uniquement `assets/...` (aucune image externe, aucun iframe).
- Liens externes en `target="_blank" rel="noopener"`. Aucun `mailto:`. Formulaires : `preventDefault`, validation, succès animé.
- Page complète au repos : rien ne reste caché si le JS ou le CDN échoue (classe `js` sur `<html>` + garde-fou).
- Responsive de 360 à 1600 px, sans scroll horizontal ; épinglages seulement à partir de 900 px de large et 600 px de haut ; mouvement réduit = fondus.
- Accessibilité : contrastes AA, focus visibles, `alt` réels, landmarks.
- Animations sur transform, opacity, filter et clip-path uniquement.
- Bouton « ← » vers `index.html`, compact en bas à gauche : je l'ajouterai, laisse ce coin libre.

**Vérification visuelle obligatoire** avec l'outil commun (un verrou garantit une seule capture à la fois sur la machine) : `/private/tmp/claude-501/-Users-kenz15-Documents-Dev-Kenz-kenz/492e2496-4b1a-48c5-9504-f1181702c2bd/scratchpad/review.cjs`
- Défilement : `cd <scratchpad> && WAIT=1500 node review.cjs <fichier absolu> <tag> "" 1440 900 <étapes> <px>` produit `<scratchpad>/shots/<tag>.jpg`, à lire avec Read.
- Interaction : `ACTION="click:<sélecteur>"`, ou `hover:`, `longpress:`, `drag:<sél>:<dx>:<dy>`. Options `FRAMES=8 FRAME_MS=150`, `PRESCROLL=<px>`, `PREHOVER=<ms>`. Les 3 derniers arguments sont alors `0 0`.
- Mobile : largeur 390, hauteur 844.
- Pas de captures en boucle (une dizaine au plus). Aucun autre navigateur, serveur ou build. `node --check` du JS extrait.
- Rien d'inventé hors des textes ci-dessus. Rien de privé : aucune adresse e-mail, rien sur la recherche d'emploi.
