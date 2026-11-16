# 06 — Verdict du jury

> Rédigé le 11/11/2026 par Claude, en jury final : directeur produit, direction artistique, lead dev Next.js.
> Lu : `05-brief-final.md` (en entier), les cinq rapports `verif-0N-*.md`, `_shared/content.js` (clés agents, apps, live, progression), le code des cinq maquettes (routeur, vues, signatures, tokens), et le dépôt Next.js en lecture seule (`app/`, `components/`, `contexts/`, `i18n/`, `data/`, `public/`, `next.config.ts`, `package.json`).
> **Rien n'a été vu dans un navigateur** (règle machine). Les notes du jury sont une lecture du code et des rapports, pas un test visuel.
> Confidentialité : ce document ne parle des agents IA que comme d'un savoir-faire installé chez un client. Aucun usage privé, aucune donnée personnelle.

**Statuts** : **[Observé 11/11]** relevé dans un fichier, le dépôt ou une requête · **[Code]** lu dans le code · **[Rapport]** tiré d'un `verif-0N` · **[Jury]** appréciation du jury · **[Hypothèse]** · **à confirmer**.

---

## 0. La recommandation en bref

1. **Direction principale : 03 « Lignes »** (note pondérée du jury : 72/80, devant Épisode 65, REC / PROD 64, Carnet 63, Matière 56).
2. **Pourquoi elle** : c'est la meilleure réponse à la précision de Kenz. La ligne **P2 « Agents IA »** et son arrêt obligatoire **« Validation humaine »** montrent à un client, d'un coup d'œil, ce qui s'installe chez lui. Les quatre lignes sont les quatre offres. Le tableau des départs rend la couche live visible. Les deux dessins (plan orthogonal, carte de l'Asie) ne peuvent pas se mélanger. Et il n'y a **aucun asset à produire**.
3. **Sept greffes (G1 à G7)**, chacune redessinée dans la matière de Lignes :
   - les **crédits honnêtes** (Épisode) ;
   - la **fiche « Où on en est » et ses tampons** pour le livrable (Carnet) ;
   - les **cadres 9:16** et le **cadre REC** (REC / PROD) ;
   - **le point qui s'étire en bouton** (REC / PROD) ;
   - la **bande d'épisodes** native sur `/asie` (Épisode) ;
   - la **vue éclatée d'une équipe** dans « Sous le capot » (Matière) ;
   - les **six cas dès le premier écran** (01, 04, 05).

   S'y ajoutent des **correctifs transverses** (G8) venus de 02, 03 et 04.
4. **Non repris** : l'iris, la rafale, WANTED, GSAP, le Pro en noir film, les objets en pâte en CSS, le timecode.
5. **Implémentation** :
   - routes App Router en groupes `(commun)`, `(pro)`, `(createur)` ;
   - CSS Modules et tokens `[data-cote]` ;
   - données typées `Fait<T>`, portées depuis `content.js`, avec une garde de publication ;
   - live réel : iTunes (6 h), RSS YouTube (1 h), date de build et `now.json` ;
   - i18n selon la convention en place.
6. **Avant tout (Lot 0)** :
   - `/itineraire/chine` répond 200 en production, mais n'existe dans aucune branche du dépôt ;
   - environ 82 Mo de médias inutilisés dorment dans `public/`.

---

## 1. Méthode et limites

- Les notes « après » viennent des cinq rapports de vérification ([Rapport]). Les tableaux par audience et par critère sont l'appréciation du jury ([Jury]), sur 5, à partir du code et des rapports.
- Aucun rendu n'a été observé. Chaque rapport liste ses « restants à voir à l'œil ». Ils restent valables pour la direction retenue (voir § 7.11).
- Les cinq maquettes partagent `content.js` (liste blanche), le socle typographique, les composants W2 à W15 et le panneau de simulation. Elles ne diffèrent que par la composition, la matière et les gestes exclusifs (§ 10 du brief). C'est ce qui rend la comparaison juste.

---

## 2. Notes après vérification [Rapport]

| Maquette | Produit | UX | UI | Motion | Accessibilité | Moyenne | Note la plus basse avant correction |
|---|---|---|---|---|---|---|---|
| 01 REC / PROD | 8,5 | 8 | 8 | 8 | 8 | **8,1** | UX 6 |
| 02 Carnet | 8,5 | 8,5 | 8,5 | 8,5 | 8,5 | **8,5** | UI 7 |
| 03 Lignes | **9** | 8,5 | 8,5 | 8,5 | 8,5 | **8,6** | UX 6,5 |
| 04 Épisode | 8,5 | 8 | 8,5 | 8,5 | 8,5 | **8,4** | UX 5,5 |
| 05 Matière | 8,5 | 8 | 8 | 8,5 | 8,5 | **8,3** | UX 6 |

Les cinq maquettes sont toutes livrables comme maquettes. L'écart se joue sur le produit, et sur ce que coûte chaque direction une fois dans le vrai site.

---

## 3. Comparatif par audience [Jury]

Notes sur 5. Le poids reflète la demande de Kenz : le Pro « vraiment poussé », et la précision sur la mise en place d'agents IA.

| Audience (poids) | 01 REC / PROD | 02 Carnet | 03 Lignes | 04 Épisode | 05 Matière | Meilleure |
|---|---|---|---|---|---|---|
| Client qui veut des agents IA (×3) | 4 | 4 | **5** | 4 | 4 | Lignes |
| Client qui veut une app ou de l'IA produit (×2) | 4 | 4 | 4 | **5** | 4 | Épisode |
| Client qui veut du contenu vidéo (×1) | **5** | 3 | 4 | 4 | 3 | REC / PROD |
| Recruteur tech (×1) | 4 | **5** | 4 | 4 | 3 | Carnet |
| Pair développeur (×1) | 4 | 4 | **5** | 4 | 4 | Lignes |
| Abonné voyage, mobile (×2) | 4 | 4 | 3 | **5** | 3 | Épisode |
| Abonné k15ze (×1) | 4 | 3 | 4 | 4 | 3 | égalité |
| Marque (×1) | 4 | 4 | 3 | 4 | 4 | égalité |
| Kenz et ses proches, `/now` (×1) | 4 | 4 | **5** | 3 | 3 | Lignes |
| **Total pondéré (sur 65)** | 53 | 51 | 54 | **55** | 46 | |

Ce que dit le tableau :
- **Client agents** : Lignes est le seul à faire de l'équipe d'agents un objet de navigation. La ligne P2 porte des stations-rôles, s'arrête à « Validation humaine », et chaque rôle dit sa mission (rapport 03, n° 8). REC / PROD (timeline à pistes), Carnet (dossier de transmission), Épisode (feuille de service) et Matière (vue éclatée) l'expliquent bien, mais comme une démo dans une page.
- **Client app** : la fiche technique et les crédits d'Épisode sont la présentation la plus crédible d'un produit. C'est la première greffe.
- **Abonné voyage** : Épisode est le plus proche des vraies vidéos de Kenz (saisons, tampons, bande d'épisodes). Le Créateur de Lignes, crème et carte, est le plus calme : c'est sa faiblesse, et la raison des greffes G3 et G5.
- **`/now`** : le tableau des départs de Lignes est la seule mise en forme où les quatre états live (à l'heure, retard, supprimé, pas de service) se lisent comme dans la vraie vie.

Épisode gagne d'une courte tête sur les audiences. Le tableau par critère, qui compte aussi le coût réel et le risque, inverse l'ordre.

---

## 4. Comparatif par critère [Jury]

| Critère (poids) | 01 | 02 | 03 | 04 | 05 |
|---|---|---|---|---|---|
| C1 Séparation réelle des casquettes (×2) | 5 | 4 | **5** | 5 | 4 |
| C2 Pro poussé : AI engineer, fullstack, solopreneur (×2) | 4 | 4 | **5** | 4 | 4 |
| C3 Agents IA lisibles pour un futur client (×3) | 4 | 4 | **5** | 4 | 4 |
| C4 Créateur : énergie et personal brand (×2) | 4 | 3 | 3 | **5** | 3 |
| C5 Live et progression (×1) | 4 | 4 | **5** | 3 | 3 |
| C6 Pages livrables, clients et abonnés (×1) | 4 | **5** | 4 | 4 | 4 |
| C7 Personnel, non générique (×1) | 4 | 5 | **5** | 5 | 3 |
| C8 Micro-animations premium et sobres (×1) | 4 | 4 | 4 | **5** | 4 |
| C9 Faisabilité Next.js : assets, poids, effort (×2) | 3 | 3 | **4** | 2 | 2 |
| C10 Mobile et accessibilité (×1) | 4 | 5 | **5** | 4 | 4 |
| **Total pondéré (sur 80)** | 64 | 63 | **72** | 65 | 56 |

Justifications des écarts :
- **C2, Lignes 5** : la navigation Pro **est** l'offre (P1 Apps, P2 Agents, P3 Services, P4 Vidéo), chaque étude de cas montre sa **ligne de déploiement**, et le CV montre les compétences « desservies » par les lignes qui les prouvent. Épisode perd un point parce que son Pro est sombre, à rebours de la règle « Pro toujours clair » (exception du § 10.4), et proche du site actuel.
- **C4, Lignes 3** : la carte aux tampons est très personnelle (les vrais trajets de Kenz), mais peu énergique pour un public TikTok. C'est corrigé par greffe, sans changer de matière.
- **C9** :
  - Lignes n'a besoin d'aucun asset ni d'aucune bibliothèque (SVG et CSS). Son coût est le plan : une version ordinateur, un diagramme vertical sur mobile, et une liste équivalente.
  - REC / PROD dépend d'extraits verticaux pas encore exportés. Carnet dépend d'images plein cadre propres, que Kenz n'a pas.
  - Épisode dépend de GSAP, de sept plans (jusqu'à 427 Ko pour une cible de 40 Ko, rapport 04) et de trois polices d'accent.
  - Matière dépend des objets en pâte exportés (DA-4).

---

## 5. Forces et faiblesses, maquette par maquette

### 01 — REC / PROD (moyenne 8,1)

**Concept** : le point de « Kenz. » devient un voyant, PROD côté Pro et REC côté Créateur. Chaque côté prend le format de sortie réel de Kenz : 16:9 posé, 9:16 énergique.

**Forces**
- La séparation la plus lisible en vignette floue : papier en 16:9 contre nuit en 9:16, navigation haute contre barre au pouce, « vous » contre « tu ».
- Le concept vient du métier de Kenz : vidéos App Store en paysage, TikTok et Shorts en vertical.
- Agents : la timeline à pistes (W7) reprend la grammaire de la chaîne de montage. Hermes est en piste maîtresse, « Vous » en bas. Le sommaire des six cas est dans le premier écran (rapport 01, M9).
- « Le point s'étire en bouton » : une micro-interaction unique, en CSS seul.
- C'est la seule maquette qui retire de l'affichage la leçon « Une tâche lourde à la fois », qui raconte un incident interne (rapport 01, M10).

**Faiblesses**
- C'était la note UX la plus fragile avant correction. Trois bloquants de mise en page ont été corrigés sans être vus.
- La colonne 9:16 reste vide sur grand écran sans ses rails, et le Créateur de nuit ressemble au site actuel.
- L'iris attend la décision DA-1 (risque d'effet « masque »). Le timecode est un gadget pour un abonné.
- La maquette dépend d'extraits verticaux pas encore exportés (DA-7).

**À garder** : les cadres 9:16 côté Créateur, le cadre REC, le point qui s'étire.

### 02 — Carnet (moyenne 8,5)

**Concept** : côté Pro, un carnet d'atelier (feuilles datées, sources en marge, registre). Côté Créateur, l'image annotée.

**Forces**
- La signature visuelle est la discipline de preuve de Kenz : « état au … », renvois de marge (W14), registre qui s'ouvre en fiche « Où on en est » (W15).
- **`/livrable/demo` est le plus convaincant des cinq** (§ 10.2 du brief, rapport 02) : décisions datées, états des livrables, tampons de validation.
- Ce sont les notes les plus régulières. Plusieurs correctifs servent à tous : `libPreuve()` (plus de pastille « observé le » sans date), passe typographique française, statuts de travail masqués au public.
- Le CV est une feuille A4 imprimable, où chaque compétence renvoie à sa preuve.

**Faiblesses**
- Risque d'effet « modèle Notion » côté Pro, et une énergie limitée.
- Le Créateur repose sur des images plein cadre qui n'existent pas encore. Les vignettes de pays sont des miniatures YouTube avec titres incrustés, Malaisie est un composite, et la photo HYROX porte un filigrane d'une autre ville que celle de la donnée (rapport 02, restants 2 et 3).
- La flèche qui s'arrête avant le visage est délicate à fiabiliser en production.

**À garder** : la fiche « Où on en est » et ses tampons, pour le livrable et le cas « mémoire d'équipe » ; `libPreuve()`.

### 03 — Lignes (moyenne 8,6) · direction retenue

**Concept** : côté Pro, un plan de lignes en signalétique suisse, où chaque page est une station. Côté Créateur, une carte de l'Asie en pointillés, avec des tampons de ville. Ce sont deux dessins qui ne partagent aucun SVG.

**Forces**
- C'est la meilleure note produit (9).
- **Le Pro devient l'offre** : P1 Apps, P2 Agents, P3 Services, P4 Vidéo. Les pages restent des pages éditoriales normales.
- **Agents** :
  - la ligne P2 s'arrête obligatoirement à « Validation humaine » (W6) ;
  - le tronçon suivant reste en pointillé tant que rien n'est validé ;
  - « Composez votre équipe » ajoute des stations-rôles ;
  - la démo d'injection fige la rame ;
  - chaque rôle dit sa mission.
- **Le tableau des départs** fait de la couche live un objet visuel : les quatre états ont chacun un mot et une forme.
- Chaque ligne a une couleur **et** une forme (plein, double, tireté, pointillé), ce qui la rend lisible pour les daltoniens.
- La séparation va jusqu'aux pages « lien en bio » : `navCrea()` retire le voyage de `/k15ze` et k15ze de `/liens` (rapport 03, n° 1).
- Aucune dépendance et aucun asset.

**Faiblesses**
- Le Créateur est calme pour un public TikTok : il faut les greffes G3 et G5.
- Le plan est dense entre 900 et 1 100 px (à voir à l'œil). Les tampons de ville de `/asie/chine` font environ 5 px sur mobile (rapport 03, restant 2).
- La métaphore est à doser : la rame reste sur `/pro`, sans mono ni terminal.
- W8 anime `flex-grow`, une propriété de mise en page (à passer en `transform` dans le vrai site).
- Le slug `escapades-libres` dévoile le nom de la startup dans l'URL (rapport 03, restant 3).

### 04 — Épisode (moyenne 8,4)

**Concept** : côté Créateur, la grammaire de Branche-toi (planche de manga, 第N話, tampons, rafale, WANTED). Côté Pro, la fiche technique d'un film, avec des crédits honnêtes.

**Forces**
- Le Créateur le plus proche des vidéos de Kenz.
- **Les crédits honnêtes** : la dernière ligne est toujours humaine, et un liseré marque le travail d'un agent. Pour le rapport 04, c'est « la meilleure preuve de l'humain dans la boucle des cinq directions ».
- La feuille de service des agents (rôles × étapes), et les six problèmes clients dès la porte de `/pro` (rapport 04, M4).
- Le mouvement le plus riche, avec un repli WAAPI quand GSAP manque.

**Faiblesses**
- Le Pro en noir film va contre « Pro toujours clair » et ressemble au site actuel.
- Le poids : plans de rafale jusqu'à 427 Ko, GSAP sur `/moi` et `/asie`, trois polices d'accent (Bebas Neue, Dela Gothic One, Anton).
- Les références d'anime sont à surveiller. La vignette Chine porte une phrase incrustée avec des fautes (rapport 04, restant 3).
- La base CSS était fragile : `hidden` restait sans effet avant correction.

**À garder** : les crédits honnêtes et la bande d'épisodes (sans GSAP).

### 05 — Matière (moyenne 8,3)

**Concept** : une table de studio. Côté Pro, la lumière du jour et les apps en objets posés. Côté Créateur, le bleu nuit, avec des objets-preuves et du verre posé sur les vraies images.

**Forces**
- **La vue éclatée (W10) la plus parlante** : de vraies plaques. La même mécanique éclate **une équipe d'agents** (Vous, Hermes, rôles, mémoire, garde-fous), ce qui est idéal pour un client technique.
- Les côtés se séparent par la température de la lumière et par la place de la navigation (îlot en haut, dock au pouce).
- Une rangée « Votre cas » dès l'ouverture de `/pro/agents` (rapport 05).

**Faiblesses**
- Les objets en CSS restent provisoires. Tant que les objets en pâte (DA-4) ne sont pas exportés, ils risquent l'effet « fait par une IA ».
- Le contraste du verre sur image reste à mesurer : environ 4,6:1 au pire cas supposé, une hypothèse du rapport 05.
- Un bloquant (navigation jamais collante) a été corrigé sans être vu.
- Le Pro est le moins personnel : une étagère d'icônes.

**À garder** : la mécanique « éclater une équipe », redessinée en coupe de station.

---

## 6. Recommandation : Lignes, plus sept greffes

### 6.1 Pourquoi Lignes

- **Elle répond mot pour mot à la précision de Kenz.** Un futur client voit une ligne P2 avec ses stations : les six problèmes qu'il reconnaît, les rôles, Hermes qui coordonne, puis l'arrêt « Validation humaine », où il garde la main. Il comprend ce qu'il peut faire installer sans lire de jargon. Et rien ne parle d'un usage privé.
- **La structure du Pro est celle de l'offre.** Quatre lignes, quatre portes d'entrée commerciales, et `/pro/cv` à part pour le recruteur.
- **Le live devient un objet.** Le tableau des départs donne à « les trucs en live » une forme qu'on ne voit sur aucun portfolio. Les quatre états y sont honnêtes.
- **La séparation est structurelle**, pas seulement une affaire de couleur : un plan orthogonal contre une carte géographique, et des pages-stations contre des pages-carte.
- **C'est le coût le plus bas.** Pas d'asset à attendre, pas de bibliothèque, du SVG rendu côté serveur, et peu de JavaScript côté client.

### 6.2 Les greffes

Chaque greffe se redessine dans la matière de Lignes (crème, encre, couleurs de ligne et formes). On ne colle jamais un morceau d'une autre direction tel quel.

| # | Greffe | Source (maquette, code) | Où dans le site | Adaptation | Pourquoi |
|---|---|---|---|---|---|
| G1 | **Crédits honnêtes** | 04, signature 5 (`creditsApp`, `creditsEquipe`, `creditsLivrable`) | fin de `/pro/apps/[app]`, `/pro/agents`, `/pro/agents/[cas]`, `/livrable/demo` | un **terminus** : rôles alignés sur l'axe de la ligne, liseré de la forme de P2 (double) sur les lignes « agent · rôle », dernière ligne toujours humaine ; chaque ligne monte par la fente au défilement, sans défilement automatique | la preuve la plus directe de l'humain dans la boucle |
| G2 | **Fiche « Où on en est » et tampons de validation** | 02, W15 et gabarit livrable (`ficheTiroir`, `hyLivrable`) | `/livrable/demo`, `/pro/agents/memoire-equipe` | sous la ligne projet de 03 (diagnostic → pilote → mise en place → passation) : chaque arrêt validé reçoit son tampon daté (W5) | le meilleur gabarit livrable ; même format que la mémoire d'équipe, donc la preuve du cas |
| G3 | **Cadres 9:16 et cadre REC** | 01, gabarits Créateur et signature 6 | dernière vidéo, Shorts, k15ze (`/moi`, `/asie`, `/liens`, `/k15ze`) ; cadre REC sur `/moi` seulement | cadre vertical en filet d'encre ; quatre équerres posées une fois (220 ms), « REC · date » ; ni timecode ni aimantation | l'énergie TikTok et Shorts, sans quitter la matière crème et carte |
| G4 | **Le point s'étire en bouton** | 01, signature 3 (variable `--pt-x`) | « Demander un devis » (Pro), « S'abonner » (Créateur) | le point prend la forme de l'anneau de station (Pro) ou la couleur de la saison active (Créateur) | un geste signature en CSS seul |
| G5 | **Bande d'épisodes** | 04, signature 4 (`episodes`) | `/asie`, sous la légende des saisons de la carte | `scroll-snap` natif, compteur « ép. N / total » par `IntersectionObserver`, numéro qui change par la fente ; 第N話 en option (12 glyphes, à trancher) ; sans GSAP | ramène la grammaire de Branche-toi côté abonné |
| G6 | **Vue éclatée d'une équipe** | 05, signature 2 (`eclateEquipe`, `listeEquipe`) | « Sous le capot » de `/pro/agents` | dessinée en **coupe de station**, cinq niveaux : Vous, Hermes, rôles, mémoire, garde-fous ; liste équivalente ; en mouvement réduit, liste empilée | montre l'architecture à un client technique |
| G7 | **Les six cas dès le premier écran** | 01 (M9), 05 (« Votre cas »), 04 (M4) | premier écran de `/pro/agents` et porte P2 de `/pro` | six stations nommées dans les mots du client, cibles de 44 px | précision de Kenz |
| G8 | **Correctifs transverses** | 02 `libPreuve()` et passe typographique ; 03 `navCrea()` et `?intention=` ; 04 `[hidden]{display:none!important}` et `?i=recrutement` | socle | réécrits comme règles des composants, pas comme rustines | évite de reproduire des bugs déjà trouvés |

G8 n'est pas une greffe de design. Il est listé ici pour que rien ne se perde au passage en Next.js.

### 6.3 Ce qu'on ne reprend pas

| Élément | Origine | Raison |
|---|---|---|
| L'iris du point | 01 | DA-1 toujours ouverte ; l'aiguillage de 03 est cohérent avec le plan et ne ressemble pas à un masque |
| Rafale, WANTED, GSAP | 04 | poids (plans jusqu'à 427 Ko), références d'anime, une bibliothèque de plus pour deux pages |
| Pro en noir film | 04 | contraire à « Pro toujours clair », proche du site actuel |
| Objets en pâte en CSS, verre | 05 | provisoires tant que DA-4 n'est pas livré ; hors matière de Lignes |
| Timecode | 01 | gadget pour l'abonné ; IBM Plex Mono en plus |
| Quadrillage et renvois de marge | 02 | le plan de 03 joue déjà le rôle de structure ; deux métaphores se gêneraient |

### 6.4 La vitrine agents, dans la version retenue

C'est la partie la plus importante pour Kenz. Le contenu existe déjà dans `content.js`. Il reste à le **montrer comme un savoir-faire à installer chez un client**.

**`/pro/agents`, dans l'ordre**

1. **Premier écran.**
   - La promesse : « Je mets en place des équipes d'agents IA qui travaillent comme une vraie équipe… ».
   - La ligne P2 en bandeau, avec ses **six stations-cas** dans les mots du client (G7) : chercher et trier l'info ; publier plus de contenu ; de l'IA dans un produit sans exploser les coûts ; des agents de code sans perdre le contrôle ; savoir où en est un dossier ; un back-office qui n'est plus un tableur.
   - « Composez votre équipe ».
2. **Le catalogue des six cas**, sur la même trame : le problème, ce que font les agents (rôle et mission), **ce que vous validez**, **ce que vous recevez**, ce qui reste humain, la preuve publique.
3. **La démo « Composez votre équipe »**, étiquetée « Simulation — aucun agent ne tourne sur cette page ».
   - La rame traverse les rôles et s'arrête à « Validation humaine », avec trois options (touches 1, 2, 3).
   - La démo d'injection laisse la rame immobile.
   - « Envoyer ce brief » ouvre le devis pré-rempli.
4. **« Ce que je n'automatise pas »** : publier, envoyer en votre nom, payer ou acheter, déployer en production, décider à votre place. C'est le bloc le plus visible après la démo.
5. **Comment on commence** : diagnostic → pilote → mise en place → suivi, « sur devis » (G19 à trancher), puis l'installation en cinq étapes.
6. **Sous le capot**, pour le client technique :
   - **Hermes, le coordinateur** (seul nom propre) ;
   - la vue éclatée de l'équipe (G6) ;
   - les rôles en fiches « lit / écrit / n'a pas le droit de », avec la colonne « interdit » la plus visible ;
   - la mémoire partagée ;
   - la transmission en six champs ;
   - les sept garde-fous ;
   - **les pratiques, chacune avec sa preuve publique**, tirée d'un produit (Sago : 260 tests serveur et 93 % de couverture ; Oshii : interrupteurs de fonctions ; Croc : « pas d'IA ici, et c'est voulu ») ;
   - les outils.
7. **Crédits de l'équipe** (G1), puis la FAQ.
8. **En option : « Imprimer le catalogue »**, une feuille `@media print` qui reprend les six cas, pour qu'un client la fasse circuler en interne [Jury, proposition].

**À retirer ou reformuler avant publication**, pour ne rien raconter d'un usage privé :
- La leçon « Une tâche lourde à la fois » (un incident sur une machine) : **retirer**. Seule 01 la filtre aujourd'hui ; 02, 03, 04 et 05 l'affichent depuis `agents.lecons`.
- La leçon « Surveiller le modèle réellement utilisé » raconte une bascule silencieuse d'agents. **La reformuler en pratique** : « le modèle réellement utilisé est épinglé et surveillé, avec une alerte en cas de bascule », sans récit d'incident.
- `agents.outils[0].usage` (« coordination d'une équipe d'agents qui tourne en continu ») devient « coordonne l'équipe installée chez vous ».
- L'événement de frise « Méthode de travail humain + agents formalisée (v1) » est à garder seulement si Kenz le veut public (question Q6).

---

## 7. Plan d'implémentation dans le dépôt Next.js

### 7.1 État du dépôt [Observé 11/11, Code]

| Point | Constat |
|---|---|
| Stack | Next `^16.2.2`, React 19.2, styled-components 6 (registre SSR, composants presque tous `'use client'`), framer-motion 11 (22 fichiers), Lenis (`SmoothScroll`), Tailwind 4 installé |
| Tailwind | `app/globals.css` utilise les directives v3 (`@tailwind base`) avec Tailwind 4 : [Hypothèse] inopérant ; le style passe par styled-components |
| Routes | `/`, `/apps/[slug]`, `/projets/[slug]` (oshii, zenko, sago, miru), `/destination/[slug]` (japon, islande, chine, coree, malaisie), `/api/contact` |
| Mode Pro / Perso | `contexts/mode-context.tsx`, clé `kenz-mode` dans le navigateur : à supprimer (§ 4.4 du brief) |
| i18n | `LanguageProvider` côté client ; `?lang=en` dans l'URL (FR implicite) ; dictionnaires `i18n/dictionaries/fr.ts` (type `Dictionary`) et `en.ts` ; `Localized<T>` et `localize()` dans `i18n/localize.ts` ; drapeaux via flagcdn |
| `/itineraire/chine` | **répond 200 en production** (requête HEAD du 11/11/2026), **mais n'existe dans aucune branche** du dépôt (`main`, `claude/create-new-branch-2cI40`, branche Vercel) : un déploiement depuis ce dépôt la casserait |
| Médias lourds dans `public/` | `earth.webp` 30,6 Mo, `ta_video.mp4` 16,6 Mo, `frames/` 35 Mo (192 images), `favicon.png` 1,4 Mo (1 024 px) : aucun n'est référencé dans `app/`, `components/`, `sections/`, `lib/` ni `styles/` ; 194 fichiers suivis par Git ; `public/` pèse 86 Mo en tout |
| Autres médias | `background-moi.webp` (495 Ko) n'est utilisé que par `Hero.tsx` et figure dans les images « à éviter » ; `Malaisie.webp` pèse 427 Ko |
| `maquettes/` | non suivi et non ignoré (`git status` : `?? maquettes/`) |

### 7.2 Lots

| Lot | Contenu | Condition de sortie |
|---|---|---|
| **L0** (avant tout) | retrouver la source de `/itineraire/chine` et la porter dans `app/` ; ajouter `maquettes/_brief/` au `.gitignore` (décision de Kenz : tout `maquettes/` ?) ; sortir les médias inutilisés de `public/` ; valider la direction et les greffes | `/itineraire/chine` rendue par le dépôt, `public/` sous 10 Mo |
| **L1** | socle (tokens, polices, gabarits, point, W2, W3, W5, W6, état live) ; données typées et garde de publication ; couche live (iTunes, RSS, build, `now.json`) ; les routes L1 du brief ; **promus par le jury** : les six `/pro/agents/[cas]` et `/livrable/demo` (précision de Kenz : le catalogue et sa preuve) ; redirections ; contact par intention ; CV imprimable | les 9 contrôles du § 7.11 au vert sur un aperçu |
| **L2** | `/pro/video` (W8), `/pro/devis` et le brief assisté, `/avant-de-partir/chine`, `/collaborer`, études de cas de croc, miru, zenko et ce-site ; anglais du Pro et des pages communes | évaluation du brief assisté sur 10 demandes fictives |
| **L3** | assistant Pro (si son évaluation passe) ; alertes par guide (G14) ; étude de cas de la startup (G6) | décisions de Kenz |

### 7.3 Arborescence App Router

Les groupes de routes donnent à chaque côté son gabarit, sans changer les URL.

```
app/
  layout.tsx                      <html lang>, polices next/font, tokens.css, fournisseurs allégés
  tokens.css                      socle : [data-cote="pro|createur|commun"], easings, durées, mouvement réduit
  not-found.tsx                   /404 : « Station inconnue », deux correspondances, guide du moment
  (commun)/
    layout.tsx                    <div data-cote="commun"> + en-tête commun + pied
    page.tsx                      /            deux portes pleines + « En ce moment » (tableau des départs court)
    now/page.tsx                  /now         tableau des départs Pro | Créateur + tous les liens
    contact/page.tsx              /contact     intentions (?intention=…)
    a-propos/page.tsx             /a-propos    + colophon, sources live
    mentions-legales/page.tsx
    confidentialite/page.tsx
  (pro)/
    layout.tsx                    <div data-cote="pro"> + en-tête Pro (P1–P4, ⌘K, FR/EN, devis)
    pro/page.tsx                  /pro         le plan + liste équivalente + frise des mises en prod
    pro/apps/page.tsx             /pro/apps    registre = ligne P1 verticale + section Lab
    pro/apps/[app]/page.tsx       generateStaticParams (apps publiables), dynamicParams = false
    pro/agents/page.tsx           /pro/agents  § 6.4
    pro/agents/[cas]/page.tsx     6 cas, generateStaticParams, dynamicParams = false
    pro/video/page.tsx            L2
    pro/services/page.tsx
    pro/devis/page.tsx            L2 (le formulaire court peut venir en L1)
    pro/cv/page.tsx               + cv.print.css
    livrable/demo/page.tsx        metadata.robots = { index: false, follow: false }
  (createur)/
    layout.tsx                    <div data-cote="createur" lang="fr"> + navigation créateur filtrée (navCrea)
    moi/page.tsx
    asie/page.tsx                 carte + légende des saisons + bande d'épisodes (G5)
    asie/chine/page.tsx
    guides/page.tsx
    itineraire/chine/page.tsx     URL conservée (L0)
    avant-de-partir/chine/page.tsx   L2
    collaborer/page.tsx           L2
    liens/page.tsx                aucun effet lourd, aucune requête Google ou YouTube côté client
    k15ze/page.tsx                sous-identité (classe .k15ze, Anton chargée ici seulement)
  api/
    contact/route.ts              étendue (§ 7.7)
    devis/brief/route.ts          L2
  opengraph-image.tsx             + un par côté
```

- `data-cote` se pose sur un conteneur de gabarit, pas sur `<html>` : un gabarit imbriqué ne peut pas modifier `<html>` côté serveur. Le conteneur porte `min-height: 100svh` et `background: var(--fond)`. Un petit effet client recopie la valeur sur `document.documentElement`, pour la couleur de rebond du défilement.
- **Next 16** : `params` et `searchParams` sont des promesses (`const { app } = await params`).
- **Redirections** dans `next.config.ts` → `redirects()`. Utiliser `statusCode` plutôt que `permanent` : `permanent: true` renvoie un 308, pas le 301 du brief.
  - `/apps/:slug` et `/projets/:slug` → `/pro/apps/:slug` (301) ;
  - `/destination/chine` → `/asie/chine` (301) ;
  - `/destination/:slug` → `/asie` (301) ;
  - `/chine` → `/itineraire/chine` (302).
- À supprimer en fin de L1 : `contexts/mode-context.tsx` (et la clé `kenz-mode`), `components/SmoothScroll.tsx` (Lenis détourne le défilement et gêne `sticky` et `scroll-snap`, règle m6), le code mort `sections/*`, `components/site/header.tsx`, `PassionReveal.tsx`, `destination-*`, ainsi que les anciennes pages `/apps`, `/projets` et `/destination`, remplacées par les redirections.

### 7.4 Composants

**Socle** (`components/socle/`). Ce sont des composants serveur par défaut. Seuls les îlots marqués « client » embarquent du JavaScript.

| Composant | Code | Type | Rôle |
|---|---|---|---|
| `Pastille` | W3 | serveur | statut et date (`libPreuve`) ; la forme suit le statut (plein, demi, contour, pointillé) ; un filet se trace au survol et au focus |
| `EtatLive` | — | serveur | 4 états (direct, retard, indisponible, vide) ; la forme change avec l'état, pas seulement la couleur |
| `Relatif` | — | client | « il y a 3 j », calculé **dans le navigateur** à partir d'une date absolue rendue par le serveur : une page en cache ne ment jamais |
| `Fente` | W2 | client | l'ancienne valeur sort, la nouvelle monte ; `overflow: clip`, avec un repli `hidden` |
| `PrixBarre` | W4 | serveur + CSS | `<del>` et `<ins>`, SVG du trait en `aria-hidden` ; l'unique rouge de l'écran |
| `Tampon` | W5 | serveur + CSS | une fois, à l'arrivée à l'écran |
| `ArretObligatoire` | W6 | client | anneau tracé une fois ; options 1, 2, 3 au clavier ; rien ne part avant « Valider » |
| `Drapeau` | W9 | client | interrupteur des pipelines rejoués |
| `CoupeDeStation` | W10 + G6 | client | 5 plans d'app ou d'équipe ; liste équivalente ; liste empilée en mouvement réduit |
| `FicheOuOnEnEst` | W15 + G2 | serveur, plus tiroir client | livrable et mémoire d'équipe |
| `CoupeAuMot` | W8 | client | `/pro/video` ; en `transform`, pas en `flex-grow` |
| `Credits` | G1 | serveur + CSS | terminus des études de cas, des agents et du livrable |
| `Point` | — | client | `<Link>` vers le hub d'en face, avec nom accessible et libellé visible ; l'**aiguillage** (interpolation du tronçon de 64 px, 400 ms) ; « s'étire en bouton » (G4) |
| `Palette` | ⌘K | client, chargée à la demande | index local construit au build ; `next/dynamic` au premier raccourci |
| `Reveal`, `MotAMot`, `Balayage` | — | client léger | `IntersectionObserver` une fois ; CSS et WAAPI ; rien sans `prefers-reduced-motion: no-preference` |

**Direction Lignes** (`components/lignes/`)
- `PlanReseau` (serveur) : un SVG généré depuis `data/kenz/reseau.ts` (stations, coordonnées, lignes, formes). Il est rendu en trois calques : traits, puis capsules de correspondance, puis stations (correctif 03, n° 6). `PlanListe` en donne l'équivalent accessible. `DiagrammeVertical` prend le relais sous 640 px.
- `PlanInteractif` (client, `/pro` seulement) : survol d'une ligne (les autres à 20 %) et la **rame** (120 ms par station, entre 300 et 700 ms).
- `StationTete` : plaque en Archivo, ronds des lignes desservies, tableau des départs de la station.
- `TableauDeparts` : `/now`, l'accueil et les en-têtes de station.
- `LigneAgents` (client) : la démo « Composez votre équipe ».
  - Machine à états : choix → lancement → rôle N → arrêt → décision → fin.
  - Journal en `aria-live="polite"`.
  - Démo d'injection : `agents.simulation.injection`.
  - Sortie : un lien vers `/pro/devis?taches=…`.
- `Billet` : le devis en « billet » qui se remplit.
- `CarteAsie` et `TrajetChine` (serveur, tampons en CSS). Le tracé lié au défilement est borné à sa section et coupé en mouvement réduit.

**Créateur** (`components/createur/`) : `CadreVertical` et `CadreRec` (G3), `BandeEpisodes` (G5, client léger), `ListeLiens` (sans JavaScript), `K15ze` (sous-identité).

### 7.5 Données

- **Porter `_shared/content.js` en TypeScript typé**, sous `data/kenz/` :
  - `apps.ts`, `agents.ts`, `services.ts`, `parcours.ts`, `competences.ts`, `progression.ts` ;
  - `createur.ts`, `ressources.ts`, `mediaKit.ts`, `reseaux.ts` ;
  - `livrableDemo.ts`, `legal.ts`, `site.ts`, `reseau.ts` (le plan), `routes.ts`.
  
  Un script ponctuel `scripts/port-content.mjs` (Node, léger) écrit un premier jet, relu à la main. `content.js` reste la liste blanche de référence jusqu'à la fin du portage.
- **Une forme unique** (`lib/fait.ts`) :
  ```ts
  type Statut = 'observé' | 'code' | 'déclaré' | 'validé' | 'proposition' | 'hypothèse' | 'à confirmer';
  type Fait<T> = { v: T; statut: Statut; date?: string; source?: string; aConfirmer?: string; afficher?: boolean };
  ```
- **Garde de publication** : `publiable(f)` exclut `afficher: false` et les statuts `proposition`, `hypothèse` et `à confirmer`, sauf dans un aperçu non public. Les pages ne reçoivent que des faits publiables. Le « mode trous » existe seulement en développement et en aperçu (`VERCEL_ENV !== 'production'`), jamais dans le bundle de production.
- **`libPreuve(f, lang)`** (correctif 02) : « observé le 04/11/2026 · source » avec une date, « observé · source » sans date. Le nettoyage des sources internes (`srcPub()`, correctif 01) retire toute référence aux documents de travail.
- **Réutiliser `data/projects.ts`** : ses blocs `technical` sont déjà en `Localized` (FR et EN). Ils alimentent « Sous le capot » et l'anglais du Pro sans retraduire.
- **Corrections à faire à la source, pendant le portage** :
  - les leçons d'agents (§ 6.4) ;
  - « (Lot 2) » dans deux textes ;
  - `exempleTon` ;
  - le slug `escapades-libres` (à renommer, par exemple `mvp-startup`, ou à retirer selon G6) ;
  - les dates de `mediaKit` (« 50 381 vues longues », « 13 vidéos au-dessus de 100 000 vues » sont sans date propre : à confirmer).

### 7.6 La couche live réelle

| Source | Implémentation | Cache | Repli |
|---|---|---|---|
| Versions des 6 apps | `lib/live/itunes.ts` : **une** requête `itunes.apple.com/lookup?id=…,…&country=fr` (les `itunesId` sont dans `apps[].store`) ; on lit `version`, `currentVersionReleaseDate` et `releaseNotes` | `fetch(…, { next: { revalidate: 21600, tags: ['itunes'] }, signal: AbortSignal.timeout(4000) })` | dernière valeur de `data/live-snapshot.json`, état « indisponible » |
| Dernière vidéo, derniers Shorts | `lib/live/youtube.ts` : flux `feeds/videos.xml?channel_id=…` ; un analyseur minimal des balises `<entry>` (sans dépendance) | `revalidate: 3600` | snapshot ; état vide honnête tant que les identifiants de chaînes manquent (`sources.youtubeRss.channelIds = null`) |
| Miniature de la vidéo | `next/image` avec `i.ytimg.com` dans `images.remotePatterns` : l'optimiseur la sert depuis le domaine du site, **le navigateur ne contacte jamais Google** (lecteurs en Chine, M12) | cache de l'optimiseur (30 jours, déjà configuré) | image locale |
| Dernier déploiement | `env: { BUILD_DATE }` posé dans `next.config.ts` au build | — | — |
| « Cette semaine », « En préparation » | `data/now.json` versionné, tenu par Kenz ; affiché sur `/` et `/pro` seulement s'il a moins de 21 jours | au build | le dernier événement automatique |
| Abonnés TikTok | saisie manuelle datée dans `data/kenz/createur.ts` | — | rien plutôt que « 0 » |

- **États** (`lib/live/etat.ts`) : `direct` si l'âge est inférieur à 2 × la fréquence, `retard` au-delà, `indisponible` sur erreur ou dépassement du délai, `vide` si la source n'a jamais rien rendu. Les tests portent dessus (§ 7.11).
- **Segments** : `export const revalidate = 3600` sur `/`, `/now`, `/moi`, `/asie`, `/liens` ; `21600` sur `/pro` et `/pro/apps/*`. Cela suppose que `cacheComponents` reste désactivé, ce qui est le cas aujourd'hui (absent de `next.config.ts`).
- **Aucune requête live sur les guides** (`/itineraire/chine`, `/avant-de-partir/chine`), qui restent statiques.

### 7.7 Formulaires, devis assisté, mesure

- **`/api/contact`**, la route existante, étendue :
  - champs `intention` (6 valeurs), `message`, adresse de réponse, échéance ;
  - validation côté serveur et pot de miel ;
  - preuve de travail sans cookie (ALTCHA, à valider) ;
  - limite par adresse IP.
  
  La notification actuelle est conservée. Les 5 états d'interface viennent de `services.devis.etats`, et aucune adresse n'apparaît en clair sur le site.
- **`/api/devis/brief`** (L2) n'est appelé **qu'après** l'envoi du formulaire court : le LLM n'est jamais sur le chemin critique.
  - Fournisseur interchangeable, avec un mode factice : c'est déjà une pratique publiée dans `agents.pratiques`.
  - Clé côté serveur, délai court.
  - Le brief en 8 champs est modifiable, et rien ne part avant « Valider et envoyer ».
- **Mesure** : des attributs `data-event` (`porte_choisie`, `devis_ouvert`, `devis_envoye`, `collab_envoyee`, `cv_pdf`, `guide_ouvert`, `sortie_youtube`, `sortie_store`) et un petit `lib/mesure.ts`, branché sur l'outil sans cookie que Kenz choisira (G20).

### 7.8 i18n (convention en place)

- **Interface** : de nouveaux espaces de noms dans `i18n/dictionaries/fr.ts` (base, type `Dictionary`) et `en.ts` (même forme) : `commun`, `pro`, `agents`, `live`, `formulaires`, `cv`, `legal`. Lecture via `useTranslation()` dans les îlots client.
- **Données** : les champs Pro et communs sont en `Localized<string>` et se lisent avec `localize(valeur, lang)`. Les champs Créateur restent en français simple (décisions M13 et G17), dans un dictionnaire à part, `i18n/dictionaries/createur.fr.ts`, qui ne fait pas partie de `Dictionary`.
- **Langue** : FR par défaut, `?lang=en` comme aujourd'hui.
  - Les pages Pro et communes lisent `searchParams.lang` et rendent directement la bonne langue côté serveur.
  - `LanguageProvider` reçoit un `initialLang` pour que serveur et client démarrent pareil, sans erreur d'hydratation.
  - Contrepartie : ces pages sont rendues à la demande. Les données live restent en cache au niveau de `fetch`.
  - Si le temps de réponse gêne, une réécriture vers un segment `[lang]` statique pourra venir au L2, sans changer les URL publiques.
- **Côté Créateur** : le sélecteur FR/EN est masqué et `lang="fr"` est forcé (correctifs 02, n° 4, et 04, m2).
- **Sélecteur** : les maquettes affichent « FR / EN » en texte. Garder les drapeaux de flagcdn coûte une requête externe, et un drapeau n'est pas une langue (question Q15).

### 7.9 Performance et médias

- **Sortir de `public/`** les fichiers non référencés : `earth.webp` (30,6 Mo), `ta_video.mp4` (16,6 Mo), `frames/` (35 Mo) et le dossier vide `public/public/frames`. S'ils servent à un autre projet (vidéo), les déplacer hors du dépôt (question Q3).
- **Remplacer** :
  - `favicon.png` (1,4 Mo, 1 024 px) par des icônes de 32, 180 et 512 px ;
  - `background-moi.webp` (« à éviter ») par rien ;
  - les vignettes de pays (de 93 à 427 Ko, titres incrustés) par les exports de Kenz (DA-7), en AVIF ou WebP de 150 Ko au plus à 1 600 px, servis par `next/image` avec `sizes`.
- **Polices** :
  - par `next/font/google` : Inter (axe `opsz`, à vérifier dans la liste des axes de `next/font`), Instrument Serif (romain et italique) et Archivo (axe `wdth`) ;
  - Anton, chargée dans `/k15ze` seulement ;
  - Noto Sans SC et JP, réduits aux glyphes utiles (lien `text=` sur les pages Asie, ou sous-ensemble auto-hébergé) ;
  - à retirer : JetBrains Mono et Bodoni Moda.
- **Styles** : CSS Modules et `app/tokens.css` pour les nouvelles routes. Cela permet des composants serveur sans moteur CSS-in-JS au runtime, et le portage depuis le CSS des maquettes se fait presque ligne à ligne. styled-components reste le temps de la migration et disparaît avec les anciennes pages. framer-motion part aussi s'il n'est plus utilisé.
- **JavaScript** : uniquement des îlots client (point, fente, démo agents, palette chargée à la demande, formulaires, bande d'épisodes, plan interactif sur `/pro`).
  - Budget cible [Hypothèse] : moins de 80 Ko de JS compressé sur `/liens` et les guides, LCP sous 2,5 s en 4G.
- **Vidéo** : ni iframe ni lecteur au chargement. Une vignette locale, et un lien (ou un lecteur seulement au clic).

### 7.10 SEO, accessibilité

- `generateMetadata` par route, une image Open Graph par côté, et le JSON-LD `Person` mis à jour (`jobTitle` : « AI engineer & développeur fullstack »).
- `next-sitemap` reconfiguré : nouvelles routes, `/livrable/*` exclu, `noindex` sur `/livrable/demo`.
- Accessibilité :
  - un seul `h1` par page, avec le focus sur le titre au changement de route (`useEffect` sur `usePathname`) ;
  - cibles de 44 px, `lang` sur le chinois, le japonais et le coréen ;
  - liste équivalente pour chaque schéma, `<del>` et `<ins>` pour les prix ;
  - `@media print` pour le CV et l'itinéraire, qui révèle tout ce qui attend une animation (correctif 01, B3).

### 7.11 Vérifier sans charger la machine

- **Sur ce Mac**, quand aucune autre tâche lourde ne tourne : `npx tsc --noEmit` et `node --test` sur `lib/fait.ts` (`libPreuve`, `publiable`), `lib/live/etat.ts` (les 4 états, l'horloge) et la table des redirections.
- **Sur l'aperçu de déploiement** (CI, pas sur ce Mac) : `next build`, puis un script qui parcourt le HTML rendu des 38 routes et vérifie neuf points :
  1. aucun motif d'adresse e-mail ;
  2. aucun « à confirmer » ;
  3. aucun « proposition, à valider » ;
  4. aucune source interne (« brief », « notes Dev », chemins de fichiers) ;
  5. aucun `undefined`, `NaN` ni `[object` ;
  6. aucun lien interne mort ;
  7. un seul `h1` par page ;
  8. aucune image « à éviter » ;
  9. aucune pastille sans date.
- **À l'œil, sur un vrai téléphone et un ordinateur** (les restants des rapports, valables pour Lignes) :
  - la densité du plan entre 900 et 1 100 px ;
  - la carte collante de `/asie/chine` sur un écran de 640 px de haut ;
  - les deux portes de `/` sans défilement à 390 px ;
  - l'impression du CV ;
  - l'aiguillage et la rame en mouvement réduit.

---

## 8. Questions à poser à Kenz

Réponds par numéro.

**Pour démarrer**
1. **Direction** : Lignes, avec les greffes G1 à G7, ça te va ? Ou préfères-tu partir d'une autre maquette (01, 02, 04, 05) ?
2. **`/itineraire/chine`** : la page répond en production, mais sa source n'est dans aucune branche de ce dépôt. Où est-elle ? (C'est bloquant avant tout déploiement.)
3. **Médias** : `earth.webp`, `ta_video.mp4` et `frames/` (82 Mo, non utilisés par le site) : je les sors du dépôt, ou ils servent ailleurs ?
4. **Git** : on ignore `maquettes/_brief/` seulement, ou tout `maquettes/` ?
5. **Styles** : OK pour passer les nouvelles pages en CSS Modules et retirer peu à peu styled-components, Lenis et framer-motion ?

**Agents IA (partie Pro)**
6. **Frise** : l'événement « Méthode de travail humain + agents formalisée (v1), 10/10/2026 », public ou non ?
7. **Leçons** : je retire « Une tâche lourde à la fois » et je reformule « le modèle réellement utilisé » en pratique, sans récit d'incident. D'accord ?
8. **Hermes Agent** : on écrit seulement « Hermes, le coordinateur », ou tu veux nommer l'éditeur et la licence (à confirmer) ?
9. **Offres et formats** (G13, G19) : lesquelles des six offres ; diagnostic → pilote → mise en place → suivi ; « sur devis » ou des fourchettes ; comment formuler ta disponibilité ?
10. **Crédits honnêtes** : la ligne « Agents de code » est aujourd'hui déduite pour chaque app. Tu confirmes app par app ?
11. **Démo « veille »** sur les vraies versions App Store (G21) : oui ou non ?

**Créateur**
12. **Nom public de l'univers voyage** (G2) : Kenz in Asia, Kenz en Asie ou En Bien en Asie ?
13. **Identifiants des chaînes YouTube** (Kenz in Asia et k15ze), pour brancher le RSS.
14. **Exports** (DA-7, DA-4) :
    - 3 à 5 extraits verticaux pour les cadres 9:16 ;
    - des photos de pays sans titre incrusté ;
    - des captures V2 de Sago, Wado, Miru et Croc ;
    - les droits des photos HYROX et Spartan (le filigrane HYROX ne correspond pas à la ville de la donnée).
15. **Langue** : sélecteur « FR / EN » en texte plutôt que les drapeaux ? Créateur en français seulement : confirmé ?
16. **Tampons « JE CONSEILLE »** : tu valides la liste des verdicts tamponnés ?
17. **第N話** dans la bande d'épisodes : on le garde (12 glyphes en Dela Gothic One) ou « Ép. N » en Inter ?

**Avant publication**
18. **Chiffres business** (G5) : publiés et datés, audience seulement, ou aucun ? Et les dates des chiffres du media kit.
19. **MVP de la startup** (G6) : étude de cas avec l'accord de l'équipe, mention anonyme, ou rien ? (Le slug actuel dévoile le nom.)
20. **Zenko** (G7), **Enkenz** (G8), **journal public** (G11), **alertes par guide** (G14), **mesure sans cookie** (G20), **anti-spam ALTCHA** : tes choix ?

---

## 9. Sources

- **Brief et rapports** : `05-brief-final.md` (en entier) et `verif-01-rec-prod.md` à `verif-05-matiere.md` (11/11/2026).
- **Maquettes** : `01-rec-prod.html` à `05-matiere.html`, lues pour leurs routeurs, vues, signatures et tokens ; `_shared/content.js`, lu avec `node -e` (clés `agents`, `apps`, `live`, `progression`, `pitchs`).
- **Dépôt, en lecture seule** : `package.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/api/contact/route.ts`, `contexts/*.tsx`, `i18n/*`, `data/projects.ts` (slugs), `data/destinations.ts` (slugs), `components/Providers.tsx`, `components/SmoothScroll.tsx`, `.gitignore`, `public/` (`ls`, `du`, `sips`, `git ls-files`).
- **Une requête réseau** : `curl -sI` sur `/itineraire/chine` (HTTP 200, 11/11/2026).
- **Aucune tâche lourde**, aucun navigateur, aucun serveur lancé. Aucun fichier du coffre ni du site n'a été modifié. Seuls `maquettes/_brief/06-verdict.md` et `maquettes/index.html` ont été écrits.

*— Claude, jury final (produit, direction artistique, lead dev Next.js), 11/11/2026.*
