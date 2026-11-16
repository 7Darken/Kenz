# Vérification — maquette 05 « Matière »

> Audit puis corrections du 11/11/2026, par un panel : produit, recherche UX, UI, motion, accessibilité.
> Fichier : `maquettes/05-matiere.html` (2 815 → 2 865 lignes). Références : `_brief/05-brief-final.md` et `_shared/content.js`, lus en entier, puis la maquette lue en entier.
> Aucun navigateur lancé (règle machine) : les rendus visuels restent **à regarder à l'écran**. Les estimations de hauteur et les contrastes sur image sont des **hypothèses** de calcul.
> Précision de Kenz appliquée : les agents IA restent présentés comme un savoir-faire à installer chez un client (Hermes, rôles, mémoire, garde-fous, validation humaine). Aucun usage privé, rien sur une recherche d'emploi.

## Notes sur 10

| Axe | Avant | Après | En une ligne |
|---|---|---|---|
| Produit | 7,5 | 8,5 | Les 6 cas clients deviennent accessibles dès l'ouverture de /pro/agents et depuis /pro. /k15ze ne renvoie plus vers la chaîne Asie. Le jargon interne a disparu. |
| UX | 6 | 8 | L'îlot Pro et le dock Créateur restent enfin collés. L'accueil à 390 px tient dans un écran (estimé). La version hors ligne de l'itinéraire est imprimable. Le menu mobile est modal. |
| UI | 7,5 | 8 | L'état « en retard » est lisible, un seul rouge par écran, Anton réservé à /k15ze, apostrophes typographiques partout. |
| Motion | 7,5 | 8,5 | La pulsation interdite est retirée, la double descente supprimée, l'objet se repose à l'appui, les survols sont réservés aux pointeurs fins. |
| Accessibilité | 7 | 8,5 | Contraste du gris corrigé (2,35 → 6,00), focus visible sur fond sombre, cibles de 44 px, fiches de rôle nommées, message de statut annoncé. |

## Vérifications faites (légères)

- `node --check` du JS inline extrait dans `maquettes/_tmp-v5.js` : OK avant et après. Le fichier a été supprimé ; les `_tmp-*` des autres sessions sont intacts.
- Sandbox node (vm, sans navigateur) : 38 routes × 4 états live × mode trous oui/non, soit **304 rendus, 0 erreur, 0 « undefined/NaN »**, 0 lien interne mort.
- Images : **29 sur 29 existent** (ls). Aucune capture V1 de Sago, aucun `background-moi`.
- Contenu rendu :
  - aucun code interne visible (W1–W16) ;
  - aucune apostrophe droite ;
  - aucun mot de recherche d'emploi, aucune adresse e-mail ;
  - aucun « à confirmer » hors bloc « trou » ;
  - au plus un rouge `#E8322B` par vue.
- Accolades CSS équilibrées (945 / 945).
- Contrastes recalculés (formule WCAG 2.x, script node local). Les principaux sont dans le tableau « Accessibilité ».

---

## 1. Produit

| Constat | Gravité | Suite |
|---|---|---|
| Sur /pro/agents, un client devait descendre au bloc 2 pour voir ce qui peut s'installer chez lui. L'ouverture ne montrait que la promesse et « En 10 secondes ». | Majeur (demande de Kenz) | **Corrigé.** Une rangée « Votre cas » sous les boutons de l'ouverture : 6 accès directs (Veille sourcée, Contenu marketing, IA dans votre produit, Agents de code, Mémoire d'équipe, Back-office). Libellés tirés de `KENZ.routes`, problème client en infobulle. |
| Sur /pro, la porte « Des agents IA dans votre équipe » ne montrait qu'un schéma et « Composer mon équipe ». | Mineur | **Corrigé.** Ajout du lien « Les six cas clients » (→ `/pro/agents#cas`), aligné en bas de la porte. |
| Sur /k15ze, le bouton « S'abonner » de l'en-tête menait à la chaîne Kenz en Asie, ce qui mélange les univers (brief M4 : « /k15ze n'a rien du voyage »). | Majeur | **Corrigé.** L'en-tête de /k15ze pointe vers la chaîne YouTube k15ze (`createur.k15ze.liens[0]`). |
| Jargon de travail visible côté site : « W8 · la coupe au mot » ; « Trois horloges datées, jamais de compteur qui défile… » ; « Cinq plans, aux vraies étiquettes » ; et « Rangées par séries, puis par épisodes », qui est en plus faux (les saisons sont chronologiques). | Majeur | **Corrigé.** Les nouveaux textes : « La coupe au mot » ; « Chaque sortie et chaque grande version, à sa date. » ; « Cinq plans, de l'app à l'*infra*. » ; « De mes débuts au Japon à l'Île Maurice. » |
| /k15ze : « Ils s'afficheront ici dès que le flux de la chaîne sera branché » (vocabulaire technique devant un abonné). | Mineur | **Corrigé.** « Bientôt ici. En attendant, ils sont sur la chaîne. » + lien vers la chaîne k15ze. |
| /guides : « Il sort quand : la vidéo « budget réel » publiée. » (tournure bancale). | Mineur | **Corrigé.** « Il sort une fois la vidéo « budget réel » publiée. » |
| /pro/cv : les preuves « 6 apps » et « 6 fiches store » n'étaient pas cliquables (« chaque groupe mène à sa preuve »). | Mineur | **Corrigé.** Liens vers /pro/apps. |
| /a-propos : « Dernière mise en ligne : 08/06/2026 » suivi de « mis à jour le 11/11/2026 », qui se contredisent. | Mineur | **Corrigé.** La pastille du déploiement dit « relevé le 11/11/2026 ». |
| Séparation des casquettes, ordre du § 6.1, 6 cas dans les mots du client ; « ce que vous validez / recevez / je n'automatise pas » visibles sans accordéon ; démo étiquetée, injection en quarantaine ; « Envoyer ce brief » pré-remplit le devis ; Hermes seul nom propre. | — | **Conforme**, rien à corriger. |

## 2. UX

| Constat | Gravité | Suite |
|---|---|---|
| **Navigation jamais collante.** `.entete` (îlot Pro, `position:sticky`) et `.dock` (dock Créateur) étaient chacun le seul enfant d'un `div` exactement de leur taille (#entete, #dock). Une boîte sticky ne sort pas de son parent : ni l'îlot ni le dock au pouce ne restaient à l'écran. C'est pourtant le choix fort qui sépare les deux casquettes. | **Bloquant** | **Corrigé.** `#entete,#dock,#pied{display:contents}`, donc ils sont collants par rapport à `#app`. Ajouts : `.entete{top:0}` (sa marge de 12 px suffit), dock à `bottom: 12px + safe-area`, `scroll-margin-top:104px` sur les ancres. Les animations de « la lumière change » visent maintenant l'îlot et le dock eux-mêmes (un élément en `display:contents` n'a pas de boîte). |
| `/` à 390 px : les deux portes pleines dépassaient le premier écran (≈ 920 px estimés), alors que le brief exige « sans scroll ». | Majeur | **Corrigé (estimé ≈ 660 px).** Version compacte sous 760 px : <br>• objets de 64 px ; <br>• phrases à 1,14–1,16 rem sur toute la largeur ; <br>• la ligne de preuve Pro, qui répète le bloc version, est masquée ; <br>• boutons de 44 px ; <br>• le bouton secondaire perd son icône, ce qui garde les deux boutons sur une ligne à 390 px. <br>Avant : `--t` posé sur `.pp` mais pas sur `.pose`, d'où une ombre décalée sous le téléphone. Corrigé aussi. |
| Version hors ligne de /itineraire/chine : à l'impression, les tokens Créateur restaient actifs (texte crème, prix pêche sur fond blanc) : PDF illisible. | Majeur | **Corrigé.** `@media print` remet tous les tokens en encre sur papier quel que soit le côté. Boutons, schémas 3D et objets en pâte sont masqués ; les prix vécus passent en noir ; pas de coupure dans les bases, les villes ni les prix. |
| Menu mobile : `aria-modal` sans vrai piège, la tabulation pouvait repasser derrière. | Majeur | **Corrigé.** `#app` passe en `inert` tant que le menu est ouvert, puis le focus revient au bouton. |
| L'îlot Pro débordait presque entre 900 et 960 px. | Mineur | **Corrigé.** Le menu remplace la navigation sous 980 px de conteneur. |
| Pipeline des études de cas : défilement horizontal impossible au clavier. | Mineur | **Corrigé.** `tabindex="0"` (il a déjà son `aria-label`). |
| Ouverture avec une ancre non routée (`#vue`) : page vide au premier chargement. | Mineur | **Corrigé.** Repli sur `/`. |
| Formulaires (validation, `aria-invalid`, 5 états), retour navigateur, retour en haut, focus sur le titre, palette ⌘K (piège + Échap), 404 utile. | — | **Conforme.** |
| Débordements à 360 px : grilles en `minmax(0,…)`, aucune largeur fixe hors zones défilantes bornées, pas de `100vw` dans la mise en page. | — | **Conforme** (relu, non mesuré). |

## 3. UI

| Constat | Gravité | Suite |
|---|---|---|
| État live « en retard » rendu par `opacity:.55` : 2,35:1 (gris secondaire) et 3,68:1 (encre). | Majeur | **Corrigé.** La valeur passe en `--texte-2` (6,00:1 Pro, 5,77:1 sur la porte nuit) ; la forme de la pastille (contour) porte l'état. `.porte-crea` définit maintenant ses propres `--encre`, `--texte-2`, `--filet` et `--focus`. |
| Trois épingles rouges `#E8322B` à côté du trait du prix barré sur /itineraire/chine : plus d'un rouge à l'écran. | Mineur | **Corrigé.** Épingles en corail matière ; le trait du W4 reste l'unique rouge. |
| Anton sur la tuile k15ze de /moi (brief : Anton seulement sur /k15ze). | Mineur | **Corrigé.** Inter 800, crénage serré. |
| Apostrophes mélangées (’ dans la micro-copie, ' dans les données). | Mineur | **Corrigé.** `t()` rend l'apostrophe typographique partout. |
| `.badge.ia` Pro à 4,53:1. | Mineur | **Corrigé.** Fond à 13 %, d'où 4,82:1. |
| Survols discrets absents sur les étiquettes de /liens et la palette ⌘K. | Mineur | **Corrigé.** Fond `--surface-2` (pointeur fin seulement) ; survol de la palette. |
| Direction respectée : plateaux, étagère, objets mats à deux ombres, double cadre, verre seulement sur image, aucun tilt, aucun bento, aucun dégradé héros, typo du socle. | — | **Conforme.** |

## 4. Motion

| Constat | Gravité | Suite |
|---|---|---|
| /now : « une pulsation unique » sur les points live. Le § 9.1 interdit la pulsation. | Majeur | **Corrigé.** Le point « se pose » une fois (échelle 0,2 → 1, 260 ms, arrivée). |
| Sortie de « la lumière change » : un `.pp` dans un `.pose` (ou un `.pose` dans un `.univ`) descendait deux fois, soit 24 px au lieu de 12. | Mineur | **Corrigé.** Seuls les objets de premier niveau sont animés. |
| « L'objet en main » restait soulevé après un toucher (`:hover` collant sur mobile). | Mineur | **Corrigé.** Survols sous `@media (hover:hover)`, focus clavier conservé. Polish ajouté : à l'appui, l'objet se repose (−3 px, ombre resserrée, 120 ms). |
| Mouvement réduit : la scène 3D était masquée mais « Ouvrir la vue éclatée » restait, sans effet. | Mineur | **Corrigé.** Le bouton est masqué avec la scène ; la liste des plans reste. |
| Propriétés animées : uniquement `transform`, `opacity`, `clip-path`, `filter`. Aucun CDN (CSS + WAAPI natifs). `prefers-reduced-motion` et le bouton du panneau sont respectés. | — | **Conforme.** |

## 5. Accessibilité

| Constat | Gravité | Suite |
|---|---|---|
| W8 (coupe au mot) sur fond `#1B1D1C` : anneau de focus `#1B1D1C`, donc invisible. | Majeur | **Corrigé.** `--focus:#F4F5F3` dans `.w8` (15,5:1). |
| Cibles sous 44 px : sélecteur FR/EN (38–40 px), filtres du registre (42 px), épingle Chine de la carte (≈ 16 × 30 px). | Majeur | **Corrigé.** 44 × 44 px partout ; marge de clic de 14 px sur l'épingle. |
| Fiches de rôle focusables (`tabindex=0`) sans rôle ni nom. | Mineur | **Corrigé.** `role="group"` et `aria-label="Rôle : …"`. |
| Devis, « Non merci » : message de confirmation non annoncé. | Mineur | **Corrigé.** `role="status"`. |
| Verre au-dessus des images : voile à 0,42. Le texte en petit corps tombe à ≈ 2,9:1 sur une image claire (hypothèse : ciel `#BFD3E6`). Le titre « Kenz » sur le t-shirt vert anis de /moi est à ≈ 3,1:1 (hypothèse `#D4E157`). | Majeur | **Corrigé en partie.** Voile à 0,56 (≈ 4,6:1 dans ce pire cas supposé), 0,58 sur le portrait (≈ 4,7:1). Halo sombre doux (charte § 9.4). Petit texte du verre en crème graisse 600. **À mesurer sur les vraies images.** |
| Repères, `lang`, `alt`, journal `aria-live`, liste équivalente à chaque schéma, `<del>`/`<ins>`, lien d'évitement, focus sur le h1 à chaque vue. | — | **Conforme.** |

Contrastes clés (avant → après) :

| Paire | Ratio |
|---|---|
| encre Pro / fond | 14,63 |
| gris Pro / fond | 6,00 |
| sauge texte / fond | 5,58 |
| crème / bleu nuit | 14,08 |
| gris nuit / surface | 6,68 |
| corail texte / fond nuit | 5,51 |
| corail texte / surface nuit | 4,85 |
| bouton Créateur | 5,51 |
| k15ze secondaire | 7,49 |
| k15ze vert | 10,78 |
| `.gris` | 2,35 → 6,00 |
| `.badge.ia` | 4,53 → 4,82 |

---

## Restant (à trancher par Kenz ou à regarder à l'écran)

1. **Rien n'a été vu dans un navigateur.** À vérifier à l'écran :
   - l'îlot et le dock enfin collants ;
   - la vue éclatée 3D ;
   - le verre sur les 4 images de pays et sur le portrait ;
   - l'accueil à 390 px (≈ 660 px estimés, à mesurer sur un iPhone avec les barres Safari).
2. **Photos HYROX et Spartan** affichées sur /k15ze alors que leurs droits sont « à confirmer » (G15). Les retirer si l'accord manque.
3. **Leçon « Une tâche lourde à la fois »** sur /pro/agents : elle évoque un incident sur la machine de Kenz. Elle est sur la liste blanche, mais Kenz doit dire si elle a sa place devant un client.
4. **Tampons « JE CONSEILLE »** sur /asie/chine : proposés, pas encore validés (note de `verdictsStatut`).
5. **Objets en pâte en CSS provisoire** (DA-4). Croc reste une plaque neutre faute de couleurs. Wado reste en monogramme.
6. **EN** : seule la navigation est traduite (Lot 2). Le Créateur reste en français et le dit.
7. **Alertes par guide** simulées (G14) ; aucune adresse n'est enregistrée.
8. Chiffres de /collaborer : « 50 381 vues longues » et « 13 vidéos au-dessus de 100 000 vues » sont affichés sans date propre dans `mediaKit`. **Date à confirmer** avant publication.
9. Le slug `/pro/apps/escapades-libres` reste joignable par URL (page « en attente ») ; la palette ne le montre qu'en mode trous.

## Points forts (gardés tels quels)

- Les deux casquettes se séparent par la **lumière** (studio jour / bleu nuit) et par la **place de la navigation** (îlot en haut / dock au pouce). Désormais réellement collants.
- **/pro/agents** se lit comme un catalogue client complet : 6 problèmes, une trame identique, « Composez votre équipe » qui s'arrête à la validation humaine (anneau tracé une fois, touches 1/2/3), injection mise en quarantaine, devis pré-rempli, « Ce que je n'automatise pas » en plaque sombre, puis rôles lit / écrit / interdit, mémoire, transmission en 6 champs, garde-fous et pratiques adossées à des preuves publiques.
- **W10** : vue éclatée à 5 plaques aux vraies étiquettes de stack, avec une liste équivalente cliquable ; la même mécanique éclate une équipe d'agents.
- **Pages livrables utiles** :
  - /livrable/demo, avec « Valider » et le lien expiré ;
  - le devis en deux temps ;
  - le CV imprimable ;
  - /liens à 390 px ;
  - /now et ses 4 états live ;
  - les 5 états de formulaire.
- **Données** : tout vient de `content.js`. Les « à confirmer » ne sortent qu'en mode trous ; aucune adresse en clair ; aucune requête réseau hors polices.

*— Claude, panel d'audit (produit, UX, UI, motion, accessibilité), 11/11/2026.*
