# Vérification — maquette n° 4 « Épisode »

> Relu le 11/11/2026 par un panel (produit, recherche UX, design visuel, motion, accessibilité), contre `05-brief-final.md` (§ 3, 4, 6, 7, 8, 9.8, 10.4) et `_shared/content.js`.
> Fichier corrigé : `maquettes/04-episode.html` (2 930 → 3 013 lignes). Aucune autre écriture que ce rapport. Coffre et code du site non touchés.
> Méthode légère : lecture intégrale, `node --check` sur le JS extrait, rendu des 38 routes et des redirections dans un faux DOM Node (aucun navigateur), contrastes calculés selon la formule WCAG 2.x. **Aucun test visuel** : le rendu, la 3D CSS et les timings restent à valider à l'œil.

---

## 1. Notes sur 10

| Axe | Avant | Après | En une ligne |
|---|---|---|---|
| Produit | 7 | 8,5 | La page agents était déjà solide. Il manquait trois choses : à 390 px, la porte Pro ne disait pas ce que fait Kenz ; sur `/k15ze`, « S'abonner » menait à la chaîne voyage ; trois surtitres de `/pro` recopiaient la spécification du brief. |
| UX | 5,5 | 8 | `hidden` était sans effet : les filtres, le repli, les cadres de la démo et « Rejouer » étaient cassés. Des textes débordaient à 360 px. |
| UI | 7 | 8,5 | La direction est fidèle et les contrastes justes, mais le focus était invisible sur les boutons principaux et plusieurs survols manquaient. |
| Motion | 7,5 | 8,5 | Les six signatures sont en place et le mouvement réduit est respecté. Restaient deux animations de layout, un encadré de texte sur un visage et la vue éclatée dans le mauvais ordre. |
| Accessibilité | 6 | 8,5 | Il y avait du focus invisible, des textes alternatifs qui nommaient Kenz sans source, une cible de 40 px et une zone `aria-live` trop bavarde. |

---

## 2. Constats et corrections

### Bloquants

| # | Constat | Correction appliquée |
|---|---|---|
| B1 | **`hidden` sans effet** sur les éléments qui ont un `display` d'auteur (`.reg-l`, `.pipeline li`, `.fsv-attente`, `.fsv-injection`, `.btn`). Résultats : les filtres « Avec IA / Sans IA » ne masquaient rien, l'interrupteur de repli (W9) ne changeait rien, deux cadres vides (attente W6 corail, injection pointillée) s'affichaient avant toute démo, et « Rejouer » était toujours visible. | Ajout de `[hidden]{display:none!important}` dans la base. |
| B2 | **Focus invisible** : l'anneau prenait `currentColor`, c'est-à-dire la couleur du texte du bouton, sur un fond de la même couleur. Ratio 1,00:1 sur « Demander un devis » en Pro (`.btn--plein`), sur `.btn--encre` côté papier, sur `.btn--k`, dans la barre basse, dans le panneau de simulation et dans l'aperçu. Les cases-liens de planche (`a.cs`) avaient aussi leur anneau perdu dans la gouttière d'encre. | Le focus prend `var(--encre)` (crème en Pro : 17,18:1 ; encre en Créateur : 16,64:1). `a.cs` reçoit un anneau jaune doublé d'encre, tracé à l'intérieur (15,32:1 contre la gouttière). Exceptions réglées pour la barre basse, le panneau de simulation et l'aperçu. |

### Majeurs

| # | Constat | Correction appliquée |
|---|---|---|
| M1 | Sur **`/k15ze`**, le « S'abonner » de l'en-tête menait à **Kenz in Asia** (`@7Kinze`), contraire à « rien du voyage côté k15ze ». | Sur `/k15ze`, le lien mène à la chaîne k15ze (`liens[actif]` de `content.js`), avec le style `btn--k` et un nom accessible précis (« à k15ze sur YouTube »). |
| M2 | **Accueil à 390 px** : les deux phrases étaient masquées, contrairement à M3 (« portes pleines »), et la porte Pro n'affichait que « Oshii · Version · Format ». Un client mobile ne lisait nulle part « AI engineer » ni « l'IA fait le vrai travail ». | La porte Pro a pour titre la phrase `pitchs.accueil.portePro.phrase`, suivie de la preuve live `derniereMajApp`, qui passe par les 4 états. La fiche d'Oshii reste sur ordinateur. Côté créateur, la phrase reste visible. Mobile compacté : titre visible masqué visuellement mais lu, image ≥ 64 px, boutons de 44 px. |
| M3 | Sur **`/pro`**, les surtitres des portes recopiaient le brief : « LA LISTE DES VERSIONS EN DIRECT », « UN APERÇU JOUABLE DU SCHÉMA », « UNE PHRASE ET UN BOUTON ». | Remplacés par « Apps · versions relevées », « Agents IA · ce que j'installe chez vous » et « Contenu vidéo ». |
| M4 | **Précision de Kenz** (« qu'un futur client comprenne tout ce que je peux mettre en place ») : depuis `/pro`, la porte « Agents » ne montrait qu'une démo. Les six problèmes clients n'apparaissaient que sur `/pro/agents`. | Liste des **six problèmes, dans les mots du client** ajoutée à la porte, chacun lié à sa page de cas, avant l'aperçu de la feuille de service. Toujours aucun usage privé : un catalogue de ce qui s'installe chez un client. |
| M5 | **Donnée inventée** : le relevé RSS YouTube était daté du 11/11 à 17:20 (`K.live.releveLe`), alors que `content.js` indique `sources.youtubeRss.releveLe = 2026-11-07`. | Le relevé vient de `sources.youtubeRss`. Par défaut, la vidéo s'affiche donc en **retard** (« dernier relevé le 07/11/2026 »), ce qui est honnête. Le panneau permet toujours de simuler les 4 états. |
| M6 | **Textes alternatifs sans source** : « Kenz marche dans une rue de Chine » (accueil, `/moi`) et « Kenz dans une rue de Chine, le soir » (`/asie/chine`). `content.js` note « Photo de Kenz ? » à confirmer (G15). | L'alt décrit ce qui se voit : « affiche « Chine », une rue bordée de lanternes rouges, le soir ». Il n'attribue plus d'identité. |
| M7 | **Texte sur un visage** (§ 9.4) : sur `/asie`, la case « Branche-toi Chine S2 » posait un encadré pleine largeur au-dessus du sujet de la photo. | Image en bandeau 16:7 au-dessus, texte en dessous, sans aucune superposition. |
| M8 | **Débordements à 360 px** : les libellés de fiche (`dt`) en capitales espacées sur une colonne d'environ 121 px (« AUTOMATISATION », « INTERCHANGEABLE ») ; les noms de pays de la carte en `nowrap` sur deux colonnes d'environ 137 px (« ÉMIRATS (ABU DHABI) »). | `dt` en bloc avec `overflow-wrap:anywhere` et `hyphens:auto`, interlettrage réduit sous 480 px. Carte : `white-space:normal` et colonnes `minmax(0,1fr)` sous 600 px. |
| M9 | **Bandeaux 2,39:1** : `min-height:0` laissait le contenu déborder sur la porte suivante entre 980 et 1 200 px. Dans les listes d'apps, la colonne de 120 px (icône de 26 px) et celle de 200 px écrasaient le nom et la version dans une demi-colonne. | `min-height:auto` : le ratio reste un minimum. Nouveau modificateur `.sorties--apps` (40 px · nom · auto) sur `/pro` et `/now`. |

### Mineurs (tous appliqués)

| # | Constat | Correction |
|---|---|---|
| m1 | Message d'erreur avec un exemple d'adresse e-mail (`nom@…`). | « il manque l'arobase ou le domaine ». Le fichier ne contient plus aucun motif d'e-mail. |
| m2 | Sélecteur FR/EN affiché côté créateur, qui est en français seulement (G17). | Retiré côté créateur. |
| m3 | Boutons FR/EN de 40 × 40 px. | 44 × 44 px, plus un état de survol. |
| m4 | Animations de propriétés de layout : `padding-left` au survol de l'index des liens, `width` sur le filet du registre. | Remplacées par `transform` (`translateX`, `scaleX`). |
| m5 | États de survol manquants : tâches de la démo, intentions de contact, filtres, flèches de la bande. | Ajoutés (120 à 200 ms). Polish de la bande : au survol ou au focus, la vignette d'épisode reprend sa couleur (240 ms) : la case « s'encre ». |
| m6 | « Composer votre équipe » (`#/pro/agents#composer`) reconstruisait toute la page, avec fondu de sortie et d'entrée, pour une simple ancre. | Sur la même page : défilement doux (immédiat en mouvement réduit) et focus sur le titre de la section. À l'arrivée sur une autre page avec ancre, le focus va aussi sur la section visée. |
| m7 | Vue éclatée (W10) : l'ordre de tabulation et de lecture allait d'Infra à App. Un clic sur une plaque ouvrait la vue sans changer le libellé du bouton. | Ordre App · API · Données · IA · Infra, avec App en haut de la pile. Le bouton passe à « Refermer la vue ». |
| m8 | Devis pré-rempli sans tâche cochée : « Je voudrais mettre en place : . ». Depuis un cas, l'étiquette disait « depuis Composez votre équipe ». | Phrase de repli. L'étiquette cite le cas d'origine. |
| m9 | Checklist : « Prêt à 0 / 6 » (tournure maladroite et accordée au lecteur). | « Points cochés : 0 / 6 ». |
| m10 | `/now` : « Dernier Short » ignorait l'état de la source RSS. | Passe par `live('youtubeRss')`, avec un état vide honnête. |
| m11 | `/asie` : la case « abonnés TikTok » restait vide quand la saisie était simulée vide. | « Abonnés TikTok : pas encore relevés. » |
| m12 | Bouton radio d'intention en `position:absolute` sans parent positionné (saut de défilement possible au focus). | `.intention{position:relative}`. |
| m13 | Recruteur : « Me contacter » sur `/pro/cv` menait à un contact sans contexte. | `#/contact?i=recrutement` pré-sélectionne l'intention et ouvre le formulaire avec le lien vers le CV (le routeur lit maintenant la requête). |
| m14 | La palette ⌘K proposait la page conditionnelle de la startup (G6) hors du mode « trous ». | Masquée hors du mode « trous ». |
| m15 | Impression : un bloc pas encore « révélé » (fente, balayage) pouvait s'imprimer masqué. | `@media print` neutralise `fente-attente` et `titre-balaye`. |
| m16 | `/moi` à la deuxième visite (sans rafale) : titre sans entrée. | Le titre arrive mot à mot (CSS, ou GSAP s'il est chargé). |
| m17 | En-tête de la bande en `aria-live` : chaque défilement relisait le compteur, le kanji et les boutons. | Une seule annonce ciblée et masquée (« Épisode N sur 21 : titre ») ; le compteur visuel est `aria-hidden`. |
| m18 | Journal de la démo défilable mais inaccessible au clavier. | `tabindex="0"` et nom accessible. |
| m19 | Gris secondaire sur moutarde : 4,20:1, sous le seuil, même s'il n'est pas utilisé aujourd'hui. | `--texte-2:#45413C` sur `.cs--moutarde`. |
| m20 | Deux `<nav>` de même nom côté créateur (en-tête et barre basse). | La barre basse s'appelle « Navigation créateur, barre du bas ». |
| m21 | `/contact` : « Aucune adresse en clair », une contrainte interne affichée au visiteur. | Retiré du chapeau. Le mot reste dans les mentions légales, où il a sa place. |

---

## 3. Contrôles

**Syntaxe.** `node --check` passe sur le JS extrait dans `maquettes/_tmp-v4.js`. Le fichier a été supprimé ensuite. (`_tmp-2.js` et `_tmp-3.js` appartiennent à d'autres sessions et n'ont pas été touchés.)

**Rendu.** Faux DOM Node (`vm`), en mode normal et en mouvement réduit, sur 45 adresses : les 38 routes, `/chine`, `/apps/oshii`, `/projets/sago`, `/destination/chine`, une adresse inconnue, `/pro/agents#composer` et `/contact?i=recrutement`. Résultat : **0 erreur de vue, 0 `console.error`, 1 seul `h1` par page, aucun `id` en double, aucun lien interne mort, aucune image sans `alt`**, et aucun « undefined » ni « NaN » dans le texte. Les redirections aboutissent et l'adresse inconnue mène à la 404.

**Images.** Les 38 chemins de `content.js` existent (vérifié dans Node avec `fs.existsSync`). Aucune image `aEviter` n'est utilisée (`background-moi`, captures V1 de Sago, `kenz-pp`).

**Confidentialité.**
- Aucun motif d'adresse e-mail.
- Aucun mot lié à une recherche d'emploi : postuler, candidature, emploi, chasse aux offres, plateformes d'offres.
- Aucun identifiant Supabase ou Firebase, aucune URL de console, aucune clé ni aucun jeton.
- Les agents restent un savoir-faire installé chez un client : catalogue de six problèmes, « vous validez », « vous recevez », « je n'automatise pas ». Hermes est le seul nom propre ; la démo met en scène un client fictif étiqueté.

**Données.** Tout le texte factuel vient de `content.js`. Il y avait deux écarts, tous deux corrigés : la date du relevé RSS (M5) et les textes alternatifs (M6). Les crédits par app ne déduisent l'usage d'« agents de code » que de la preuve du cas `agents-de-code` (« Six apps livrées ») : c'est une déduction raisonnable, à confirmer par Kenz s'il veut un crédit par app.

**Français.** Pas d'espace fautive, pas de mot répété, pas d'anglais égaré. Les « !! » viennent de titres de vidéos de Kenz, laissés tels quels (§ 8.1). Aucun accord ne genre Kenz ; les seuls « prêt » et « seul » portent sur des objets (« générique prêt », « un seul cas »).

### Contrastes calculés (WCAG 2.x)

| Paire | Ratio | |
|---|---|---|
| crème / noir film | 17,18 | ✓ |
| gris / noir · gris / surface Pro | 6,78 · 6,28 | ✓ |
| corail / noir · corail / surface | 6,72 · 6,23 | ✓ |
| noir sur bouton corail | 6,72 | ✓ |
| encre / papier · secondaire / papier | 16,64 · 6,05 | ✓ |
| encre / jaune · secondaire / jaune | 15,32 · 5,57 | ✓ |
| secondaire / moutarde (avant m19) | 4,20 | ✗ → corrigé |
| papier / lagon · #D9E6E4 / lagon | 6,43 · 5,86 | ✓ |
| erreur #A3330B / papier-2 | 6,31 | ✓ |
| k15ze texte · vert · secondaire | 17,90 · 10,78 · 6,96 | ✓ |
| anneau de focus jaune / gouttière d'encre | 15,32 | ✓ (avant : 1,00) |
| crème sur l'en-tête Escapades (≈ 38 % de noir) | 4,33 | ✓ en grand texte, visible seulement en mode « trous » |

---

## 4. Restants (à valider à l'œil ou à trancher par Kenz)

1. **Aucun test en navigateur** (interdit ici) : il faut vérifier à l'œil la 3D CSS de la vue éclatée, les timings de la rafale (≤ 2,6 s), le tracé W6 et le WANTED (rotateX).
2. **Accueil à 390 px sans défilement** : l'estimation est d'environ 635 px de contenu pour environ 664 px visibles sur iPhone (hypothèse). C'est à mesurer, la marge est faible.
3. **Images** :
   - Les vignettes de pays sont des affiches composites avec du texte incrusté. Celle de la Chine porte une phrase avec des fautes (« quand meme supris »), visible en grand sur `/asie/chine`.
   - Origine et identité des personnes à confirmer (G15).
   - Plans de la rafale jusqu'à 427 Ko pour une cible de 40 Ko : exports JPG à demander (DA-7).
4. **Tampons des verdicts** affichés hors du mode « trous » alors que `content.js` les dit « proposés, à valider ». La note n'apparaît qu'en mode « trous ». À décider : les garder visibles comme maquette, ou les cacher tant que Kenz ne les a pas validés.
5. `dl > div{display:contents}` (fiches) : la sémantique peut se perdre dans d'anciennes versions de Safari. À tester avec VoiceOver.
6. **EN** : seule la navigation est traduite (Lot 2).
7. **Crédits par app** : la ligne « Agents de code » sur les cinq apps est déduite (voir § 3). À confirmer.
8. Le panneau d'aperçu à 390 px ne garde pas le focus à l'intérieur ; c'est un outil hors design, sans gravité.

---

## 5. Points forts (à garder)

- **Séparation des casquettes nette** : la salle noire et la fiche technique côté Pro ; le papier manga, les cases, les tampons et 第N話 côté Créateur. Aucun vocabulaire de série côté Pro, aucune app dans la navigation créateur.
- **`/pro/agents` suit l'ordre du § 6.1.** La feuille de service s'arrête à « Validation » et attend les touches 1/2/3. La démo d'injection reste immobile. « Envoyer ce brief » pré-remplit le devis.
- Le tableau des rôles met en évidence la colonne « N'a pas le droit de », ce qui démontre les garde-fous sans rien révéler d'un usage privé.
- **Crédits honnêtes** : la dernière ligne est toujours humaine, et un liseré corail signale le travail d'un agent. C'est la meilleure preuve de l'« humain dans la boucle » des cinq directions.
- **Couche live à 4 états** : la forme de l'indicateur change, pas seulement sa couleur. Le panneau de simulation est complet : horloge, « trous », 5 états de formulaire, lien expiré, plan du site.
- **Mouvement sobre et réversible** : GSAP n'est chargé que sur `/moi` et `/asie`, avec repli WAAPI. Pas de compteur qui défile. Le mouvement réduit est géré en CSS comme en JS.
- **Livrables utiles** :
  - `/livrable/demo` : « Valider », tampon, crédits mis à jour, lien expiré simulable.
  - Guides : alerte simulée, checklist mémorisée, lecteur au clic seulement.
  - `/liens` : sans effet.
  - CV : imprimable.

*— Claude, panel de vérification, 11/11/2026.*
