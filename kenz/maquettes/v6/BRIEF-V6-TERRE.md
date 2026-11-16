# Brief V6 : le côté Créateur, c'est la Terre (13/11/2026)

## Ce que Kenz a dit
« Je vois bien la DA : la partie Pro, c'est mon univers. Là, on fait tout ce qui est univers, constellation. Et quand tu arrives dans la partie création de contenu, c'est la Terre, c'est le monde. Faire vraiment le bail de monde où je découvre le monde, parce que c'est mon contenu voyage, le plus important de la création de contenu. À développer, mais tu vois l'idée. Et pas que le monde, mais cette DA, il faut l'avoir en tête. »

## L'idée
- **Pro = l'espace.** C'est déjà fait : étoiles, astres, constellation des apps.
- **Créateur = la Terre.** On quitte l'espace et on descend vers la planète. Le voyage est au centre ; le sport (k15ze), les liens et les marques restent, dans la même DA.
- Le **passage secret** devient une vraie continuité de caméra :
  - **Pro → Créateur** : après le bon code dans la constellation des apps, on **plonge vers une petite planète bleue** qui grandit. Un éclat d'atmosphère remplit l'écran, et on arrive sur `createur.html`, où la Terre est déjà là et finit la descente.
  - **Créateur → Pro** : c'est le **décollage**. La Terre s'éloigne, les étoiles reviennent, et on arrive sur `pro.html`.

## La Terre : une vraie, en 3D
- Textures de la NASA (domaine public, tirées des exemples de three-globe) dans `assets/terre/` :
  - `earth-night.jpg` (4096 × 2048) : la nuit, avec les lumières des villes, pour le **mode sombre** ;
  - `earth-blue-marble.jpg` (4096 × 2048) : le jour, pour le **mode clair** ;
  - `earth-topology.png` : le relief.
- **N'utilise pas** `../../public/frames` ni `earth.webp` : c'est une vidéo Veo avec filigrane, effet cliché.
- Moteur : three.js r128, `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`. C'est le seul CDN de scripts permis avec gsap et lenis ; les textures sont locales.
- Le globe :
  - une sphère texturée ;
  - une **atmosphère** : halo par effet de Fresnel, Lagon ou bleu ciel ;
  - une rotation lente ;
  - de petits points lumineux sur les pays filmés, sans étiquette criarde.
- Performance :
  - DPR plafonné à 1,5 ;
  - rendu en pause hors écran (IntersectionObserver) ;
  - une seule instance WebGL par page si possible ;
  - textures réduites sur mobile (2048 px, via un canvas).
- Si WebGL ou le mouvement réduit l'empêche, une image fixe ronde avec le même halo prend le relais.

## La page Créateur (`createur.html`), première version
1. **Arrivée** : on vient des étoiles, et la Terre s'installe avec l'Asie face à nous.
   - Garde le texte du hero existant (Kenz en Asie…) ; compose-le avec la Terre et le portrait.
   - Tu peux t'inspirer d'une vue en orbite : la courbure de la Terre en bas, et le portrait de Kenz dans l'arche.
   - Une idée par écran, premium, épuré.
2. **« Le voyage »** (`#voyage`) : un trajet épinglé sur le globe.
   - Au défilement, la Terre tourne d'escale en escale, dans **l'ordre réel des séries**. Ces séries sont dans `../_shared/content.js` → `KENZ.createur`, liste des séries avec `pays` et `periode`, et liste `pays` avec les villes. Le fichier se lit avec `window` simulé : `node -e "global.window={};require('./_shared/content.js');console.log(...)"`.
   - Un **arc de vol** lumineux se trace entre deux escales.
   - Chaque escale montre le nom du pays (et son nom local s'il est connu), la période et une vraie image : `assets/img/video-*.jpg`, ou `../../public/destinations` si elles y sont.
   - Ça finit sur l'**Île Maurice** en pointillé : « prochaine escale », en préparation.
   - Pas d'autres pays que ceux des données : 9 pays filmés, chiffre observé.
3. **Le reste de la page** (dernière vidéo, vrai prix, guide, sport, liens, marques) garde son contenu, mais passe dans la DA Terre :
   - l'aura et les teintes vont vers l'océan (Lagon #0F5D6B), la lumière du jour (or doux) et la crème ;
   - le clair, c'est la Terre de jour ; le sombre, la Terre de nuit.
   - La charte reste la même : Melodrama, Inter, un mot en Instrument Serif italique, Rouge sur un seul élément.

## Règles
- Base commune `shared/theme.*` (clair et sombre), `revue.js`, le fil et l'aura.
- **Aucun composant « tag »**, rien d'inventé, rien de privé.
- Mobile d'abord, mouvement réduit respecté.
- Ne touche pas au code secret lui-même : Wado → Oshii → Sago → Croc, discret, sans indice.
