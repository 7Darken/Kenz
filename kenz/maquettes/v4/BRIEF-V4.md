# Brief V4 : intriguer, puis raconter (12/11/2026)

Tout ce qui n'est pas changé ici reste valable dans `../v3/BRIEF-V3.md` : identité heure bleue / heure dorée, charte de Kenz, règles du récit (une idée par écran, on montre au lieu d'affirmer, mots de l'utilisateur, mobile d'abord), interdiction des composants « tag », règles techniques, outil de capture `review.cjs`, rien d'inventé, rien de privé.

## Ce que Kenz a dit de la V3
« Tu montres trop clairement l'énigme. Je veux un truc discret : il faut connaître pour voir le mode. Genre tirer un truc, faire rouler un truc qui normalement n'est pas utilisé pour ça, et ça active un truc. Si tu ne connais pas l'énigme, tu ne peux pas savoir. Et l'accueil parle beaucoup trop du fait que j'ai beaucoup d'apps, et après ça enchaîne plein de trucs. Il faut penser l'architecture des pages pour que tu sois intrigué : Oshii, la motion, puis une transition, tu arrives sur la page Oshii et là tu commences à comprendre le projet en entier. Et mettre en avant la victoire. »

## 1. Le passage secret : « le cordon »
- **Ce qu'on voit** : rien. Le point de « Kenz· » dans la nav est un simple point, présent sur toutes les pages. Aucun indice, aucune légende, aucune animation d'invitation. Seul le curseur passe en `grab` quand on survole exactement le point.
- **Le geste** : on attrape le point et on le **tire vers le bas**, comme le cordon d'une vieille lampe ou la chaîne d'un mécanisme caché.
  - En tirant, un fil fin apparaît entre l'origine et le point, avec une légère résistance (le point suit à environ 0,6 × le déplacement du doigt).
  - Au-delà d'environ 110 px, un « cran » se produit : le fil s'éclaire d'un coup, et `navigator.vibrate(12)` si disponible.
  - Au relâchement après le cran, le point remonte d'un coup sec et le mécanisme s'enclenche. Relâché avant le cran, il remonte simplement et rien ne se passe.
  - Un simple clic sur le point garde son comportement normal : retour en haut de la page d'accueil.
- **Ce que ça déclenche, façon Tomb Raider** :
  1. Un grondement visuel très bref : la page tremble de 2 px pendant 200 ms, sans rebond.
  2. Deux battants de pierre arrivent des bords de l'écran et se referment au centre. En se rejoignant, ils forment le symbole de l'autre univers (soleil vers Créateur, lune vers Pro), qui s'illumine. La matière et l'éclairage sont ceux du sceau de la V3 (`shared/sceau.js` et `shared/sceau.css`, à recycler).
  3. La page navigue vers l'autre univers avec `#porte`.
  4. À l'arrivée, les battants fermés s'ouvrent (≈ 1,1 s expo.out) sur l'autre univers.
- **Accessibilité** : le point est un `button` focusable avec `aria-label="Kenz"` (rien ne trahit le secret). Au clavier, Alt + Flèche bas déclenche le même passage. En mouvement réduit, fondu simple.
- **Plus aucun médaillon visible ni phrase « Il existe une autre version de moi »** sur les pages.

## 2. L'architecture Pro : intriguer, puis raconter
Fichiers : `pro.html` (accueil), `app.html` (une page par projet, choisie par le hash : `app.html#oshii`, `#sago`, `#wado`, `#croc`, `#miru`, `#zenko`), `agents.html` (agents IA pour votre équipe).

### `pro.html` : l'accueil intrigue
On ne dit jamais « j'ai beaucoup d'apps ». On ouvre UNE histoire, puis on laisse deviner qu'il y en a d'autres.
- **A0 Hero**, en heure bleue avec le portrait en costume. « Kenz· » et une phrase : « Je construis des apps où l'IA fait le *vrai* travail. » Une invitation discrète à descendre. Rien d'autre.
- **A1 Une histoire** : écran presque plein, une question dans les mots de l'utilisateur : « Et si tes recettes TikTok devenaient de *vraies* recettes ? ».
  - L'animation Oshii se joue en grand à l'arrivée à l'écran : vidéo → partage → fiche pesée, reprise de la V3 (`_v3-pro-reference.html`) mais plus grande et plus cinématique.
  - Une seule action : « Entrer dans l'histoire », vers `app.html#oshii` avec la transition « passage ».
- **A2 La victoire** : un vrai moment fort, plein cadre.
  - La photo de Kenz bras levés (`startup-weekend-2.jpg`, filigrane recadré). Puis, mot par mot et en très grand : « 54 heures. Une équipe. La *première* place. »
  - En petit : « Startup Weekend : concevoir, prototyper et pitcher un projet devant un jury. »
  - Les deux autres photos (`startup-weekend-1.jpg`, la remise du prix ; `-3.jpg`) arrivent en petit, comme des tirages posés.
- **A3 Les autres histoires** : pas de grille d'apps, une **liste de questions**, en grand, typographique, une par ligne :
  - « Le japonais, ça a l'air *impossible* ? » (Sago)
  - « Compter ses calories ? Personne n'a le *temps*. » (Wado)
  - « Tu te ronges les ongles depuis *toujours* ? » (Croc)
  - « Ce soir, on joue à *quoi* ? » (Miru)
  - « Une journée à remplir, un budget à *tenir* ? » (Zenko)
  Au survol (ou à l'arrivée au centre de l'écran sur mobile), l'icône de l'app apparaît à côté de sa ligne, la ligne se colore de la teinte de l'app et une mini-animation de 1 s se joue. Clic → `app.html#slug` avec la transition « passage ».
- **A4 Pour votre équipe** : « Et si des agents IA travaillaient pour vous, *sans* jamais rien envoyer sans votre accord ? ». Un aperçu de 2 s (des cartes qui se trient, un bouton « Valider »), puis « Voir comment » → `agents.html`.
- **A5 Contact** : « Parlons de votre idée. » Même formulaire que la V3 (pastilles de besoin, envoi simulé), plus GitHub et LinkedIn.

### `app.html` : la page d'un projet, où l'on comprend tout
Un seul gabarit, rempli selon le hash, à partir d'un objet de données dans la page. Pour chaque app, le récit est le suivant :
1. **L'arrivée** : la couleur de l'app remplit l'écran (raccord avec la transition), l'icône se pose, puis le nom en Melodrama et une phrase.
2. **Le problème** : dans les mots de l'utilisateur, une phrase, un écran.
3. **Comment ça marche** : la grande animation propre à l'app (reprise de la V3, en plus grand), en 3 temps légendés.
4. **Ce que fait l'IA, en clair** : 3 ou 4 étapes en mots simples.
   - Oshii : j'extrais l'audio, je le transcris, un modèle d'IA en tire la recette pesée.
   - Pour les curieux, un petit dépliant « Sous le capot » donne les noms exacts (Whisper, Gemini…).
   - Les données sont dans `../_shared/content.js` → `apps[slug].ia` (résumé, pipeline, repli), `probleme`, `public`, `retenir`, `defis`.
   - Croc : « Pas d'IA ici, et c'est un choix. » Sago : le contenu est écrit avec des agents, relu, compilé, mais pas d'IA à l'exécution.
5. **En vrai** : les vraies captures App Store en grand (`assets/apps/`), la version et la date de mise à jour (relevées le 11/11/2026), dites en mots (« Mise à jour il y a 8 jours »).
6. **L'action** : App Store / Google Play / site.
7. **Histoire suivante** : en bas, la question du projet suivant en grand, cliquable. Elle mène à l'app suivante avec la transition « passage ». Ordre : Oshii → Sago → Wado → Croc → Miru → Zenko → Oshii.

Le petit retour vers l'accueil est le logo (« Kenz· » → `pro.html`). Le cordon marche aussi ici.

Liens stores et textes de base : voir `../v3/BRIEF-V3.md` (section Pro).

### `agents.html` : agents IA pour votre équipe
- **Arrivée** : « Et si des agents IA travaillaient pour vous, *sans* jamais rien envoyer sans votre accord ? »
- **La démo de la V3** : les sources tombent, Veille trie, Vérification coche, Hermes assemble la « Note du lundi ». **C'est le visiteur qui clique « Valider »**. Reprise de `_v3-pro-reference.html`, en plus grand.
- **Les 6 besoins des clients**, dans leurs mots (`../_shared/content.js` → `agents.cas[].titreClient`). C'est une liste de questions comme sur l'accueil. Au clic, la réponse se déplie : `besoin`, puis « Vous recevez » (`vousRecevez`), puis « Ce qui reste humain » (`resteHumain`). Une seule réponse ouverte à la fois.
- **Comment on avance** : « On en parle. » · « Je vous montre un premier prototype. » · « Vous validez, je lance. »
- **Contact** : « Parlons de votre équipe. »

## 3. Les transitions entre pages (contrat commun)
Fichiers : `shared/passage.js` et `shared/passage.css` (transition entre l'accueil et un projet), `shared/cordon.js` et `shared/cordon.css` (passage secret et portes). Toutes les pages les chargent :
- dans le `<head>` : `<link rel="stylesheet" href="shared/passage.css"><link rel="stylesheet" href="shared/cordon.css">` ;
- toujours dans le `<head>`, pour éviter le flash : `<script>location.hash.indexOf('porte')>-1&&document.documentElement.setAttribute('data-porte-arrivee','1')</script>` ;
- en fin de `<body>` : `<script src="shared/passage.js" defer></script><script src="shared/cordon.js" defer></script>`.

**Passage** (accueil → projet → projet suivant) :
- `window.Passage.ouvrir(elementSource, url, { couleur: '#…' })` :
  - le rectangle de l'élément source grandit jusqu'à l'écran entier dans la couleur donnée (≈ 700 ms expo.out, avec un léger flou au départ) ;
  - il enregistre `sessionStorage['kz-passage'] = JSON.stringify({ couleur, t: Date.now() })` ;
  - puis il navigue vers `url`.
- À l'arrivée :
  - si `kz-passage` a moins de 6 s, un voile de cette couleur couvre l'écran dès le premier rendu, puis se retire en se contractant vers le centre (≈ 800 ms) ;
  - `document.dispatchEvent(new CustomEvent('passage:arrivee'))` ;
  - la clé est effacée.
- Toujours entourer `sessionStorage` de `try/catch`. Si `Passage` n'existe pas, la page navigue directement.
- `app.html` change aussi de projet sans recharger : quand le hash change, faire `Passage.ouvrir` vers `app.html#suivant`. Une vraie navigation est plus simple et acceptée.

**Cordon** :
- `shared/cordon.js` s'attache à tout `[data-cordon]`, avec `data-vers="createur.html"` et `data-symbole="soleil"` côté Pro, `data-vers="pro.html"` et `data-symbole="lune"` côté Créateur ;
- il gère l'arrivée `#porte` (ouverture des battants) puis `history.replaceState` pour retirer `#porte` ;
- il émet `document.dispatchEvent(new CustomEvent('porte:arrivee'))`.

**Les pages** :
- jouent leur entrée de hero sur `passage:arrivee`, `porte:arrivee`, ou au chargement si aucune des deux arrivées n'est en cours (repli à 2,5 s) ;
- utilisent le même markup de nav : `<a class="kz-logo" href="pro.html">Kenz<button class="kz-dot" type="button" data-cordon data-vers="createur.html" data-symbole="soleil" aria-label="Kenz"></button></a>` (adapter `href` et `data-*` côté Créateur). Le point est un vrai disque de 7 px dans la couleur crème, aligné sur la ligne de base comme un point final.

## 4. Créateur
`createur.html` est la page V3, adaptée par l'agent du cordon :
- la section du sceau visible est retirée ;
- la nav reçoit le point-cordon ;
- les fichiers `shared/` de la V4 sont branchés.
Le reste ne bouge pas pour cette version.
