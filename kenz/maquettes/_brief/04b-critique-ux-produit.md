# 04b — Critique produit & UX de la stratégie v1

> **Document de travail.** Rédigé le 11/11/2026 par Claude, en panel « produit & UX » (lead product designer, PM growth, chercheur UX). Il critique `04-strategie-v1.md` à partir des briefs 01, 02 et 03, lus en entier, et de quelques vérifications légères faites le 11/11 (section 9).
> Comme les autres briefs, ce fichier est dans le dossier `maquettes/` d'un **dépôt public**. Il ne contient ni adresse, ni identifiant, ni surnom d'agent, ni petit chiffre interne, ni rien de la vie privée de Kenz. Lire d'abord **B1** : il concerne ce dossier lui-même.

**Statuts** (les mêmes que dans 04) : **[Observé jj/mm]** relevé dans un fichier, le code ou une donnée publique · **[Déclaré jj/mm]** dit par Kenz · **[Code]** lu dans le code · **[Proposition]** choix de ce panel, à valider par Kenz · **[Hypothèse]** déduction à vérifier · **à confirmer** aucune source fiable.

**Gravité**
- **Bloquant** : à régler avant de publier la moindre maquette ou de lancer le développement.
- **Majeur** : la v3 ratera un de ses objectifs (audience, conversion, maintenance) si rien ne change.
- **Mineur** : améliore la qualité, mais ne change pas la trajectoire.

---

## 0. Verdict

### Ce qui est solide (à garder tel quel)

- **Deux adresses au lieu d'un mode caché.** `/pro/…` et `/moi` + des URL courtes : c'est la bonne réponse au « ne pas tout mélanger », au partage par lien et à l'indexation.
- **Le point comme signature**, transformé en vrai lien accessible.
- **La pastille de preuve, les quatre états live et l'instantané de secours** (`live.snapshot.json`). Aucune page vide, aucun faux squelette : c'est rare et crédible.
- **Le cadrage des agents comme savoir-faire**, avec garde-fous, vérification et humain dans la boucle, sans usage privé (A5).
- **Le mouvement tiré des tokens du Motion Lab** (F0) : c'est l'argument anti-générique le plus fort.
- **Le plan de redirections** (C3) et les **états vides honnêtes** (C2).
- **« Ce que j'en retiens »** à la fin de chaque étude de cas.

### Ce qui ne tient pas

La stratégie est juste sur le **quoi** et le **pourquoi**. Elle est fragile sur trois choses : le **combien** (le périmètre), le **pour qui d'abord** (la hiérarchie des audiences) et le **qui le tient à jour** (la maintenance). Elle décrit aussi les agents IA comme Kenz les vit, alors qu'il faut les décrire comme un client les achète.

Quatre bloquants, quinze majeurs, quatorze mineurs. Les dix points prioritaires sont en section 8.

---

## 1. Le test des 10 secondes, audience par audience

| Audience | Porte d'entrée réelle | Ce que la v1 lui montre en 10 s | Verdict | Correctif |
|---|---|---|---|---|
| **Client** qui veut des agents IA | lien envoyé, recherche, LinkedIn → `/` ou `/pro` | Un pitch « apps où l'IA fait le vrai travail, et les systèmes d'agents **qui m'aident à les construire** », puis 6 apps et leurs versions | ❌ Il comprend que Kenz *utilise* des agents, pas qu'il peut en *acheter* | B4, M2 |
| **Client** qui veut une app ou un produit IA | idem | 6 apps en production, versions en direct, études de cas | ✅ Clair, à condition que le bouton « Demander un devis » soit visible dès le premier écran | M8 |
| **Recruteur tech** | lien du CV, LinkedIn, GitHub → souvent la **racine** | Le carrefour `/` (un clic de plus), puis `/pro` qui parle aux clients | ⚠️ Correct sur `/pro/cv`, mais le lien qu'il a en main pointe vers la racine | M2, M3 |
| **Abonné voyage** depuis TikTok, sur mobile | lien en bio → `/liens` | Dernière vidéo, guide du moment, 4 à 6 liens | ✅ Si `/liens` reste légère ; ❌ si le guide `/itineraire/chine` disparaît au prochain déploiement | B2, M12 |
| **Abonné k15ze** depuis YouTube Shorts | aucun lien prévu | `/liens`, qui parle d'Asie | ❌ Le mauvais univers, alors que k15ze n'a « rien du voyage » [Déclaré 08/11] | M4 |
| **Abonné qui tape le domaine** entendu dans une vidéo | `kenzenbien.fr` → `/` | Le carrefour à deux portes | ⚠️ Correct si la porte Créateur montre tout de suite le guide ou la dernière vidéo, sans scroll à 390 px | M3 |
| **Marque** | TikTok, YouTube → `/collaborer` | Audience datée, sujets, formats | ⚠️ Le TikTok est sans publication depuis le 01/09 [Observé 04/11] ; une marque le verra en 10 s sur le profil | M11 |
| **Pair développeur** | GitHub, étude de cas partagée | « Sous le capot », choix d'architecture | ✅ La partie la plus réussie de la v1 | — |
| **Kenz** | favori | `/now` + `/atelier` privé | ⚠️ `/atelier` coûte cher et ouvre une surface d'attaque ; `/now` bien fait couvre l'essentiel | M10 |
| **Un proche** | lien direct | `/` puis `/now` | ✅ | — |

---

## 2. Bloquants

### B1. Le dossier `maquettes/` peut partir sur GitHub avec des données privées

**Constat**
- Le dépôt du site est public [Observé 11/11, `git remote`]. `maquettes/` n'est pas encore suivi (`?? maquettes/`), mais **aucune règle `.gitignore` ne le couvre** [Observé 11/11, `git check-ignore` : « not ignored »]. Un `git add .` suffit à le publier.
- Le brief 01 contient des éléments marqués 🔒 ou non validés : petits nombres d'utilisateurs, une dépense publicitaire, les surnoms des agents, des éléments de parcours que Kenz n'a pas confirmés, des chemins locaux du Mac.
- Les listes « jamais publié » des briefs 03 (§ 0 bis) et 04 (A2, A5) **énumèrent les catégories d'usage privé**. Elles ne disent rien de précis, mais une liste d'interdits renseigne un lecteur sur ce qu'elle protège. C'est contraire à la précision de Kenz : ne rien laisser deviner de l'usage privé.

**Proposition**
1. Avant toute publication des maquettes : ajouter `maquettes/_brief/` au `.gitignore`, ou sortir les briefs du dépôt (par exemple dans le coffre). Ce panel ne modifie pas `.gitignore` : c'est à Kenz de valider.
2. Réécrire les listes « jamais publié » en une ligne neutre : « Aucun usage personnel, aucune donnée personnelle, aucun détail d'infrastructure. » Ne plus énumérer de catégories.
3. Avant chaque commit du site, faire une vérification par liste de termes interdits (surnoms, noms d'entreprises, petits chiffres, chemins locaux). **Cette liste est elle-même sensible** : la garder hors du dépôt public.
4. Les maquettes HTML (`maquettes/*.html`, `_shared/live.mock.json`) ne reprennent que des données publiques ou étiquetées « exemple ».
5. Avant de mettre GitHub en avant côté Pro, passer en revue les dépôts publics du compte (un ancien dépôt d'outillage vérifié le 11/11 n'est pas public : HTTP 404 en anonyme).

**Critère de sortie** : `git check-ignore maquettes/_brief/04b-critique-ux-produit.md` répond « ignoré », et la vérification par liste ne trouve rien dans les fichiers suivis.

### B2. Le seul livrable abonné en ligne risque de disparaître au prochain déploiement

**Constat** [Observé 11/11]
- `https://kenzenbien.fr/itineraire/chine` répond **200**, avec `x-matched-path: /itineraire/chine` et `x-nextjs-prerender: 1`. C'est donc une **route du déploiement Next.js actuel**, servie depuis le cache depuis environ 12 jours.
- Cette route n'existe **ni dans `main`, ni dans les deux autres branches** connues localement (`claude/create-new-branch-2cI40`, `vercel/react-server-components-cve-…`). Les références distantes n'ont pas été rafraîchies : aucun `git fetch` n'a été lancé.
- Or c'est le lien de la description de la vidéo du 31/10 [Décision du 28/10, brief 02].

**Pourquoi c'est bloquant** : un nouveau déploiement de production construit depuis ce dépôt remplace tout le site. Si la source de la page n'y est pas, l'URL tombe en 404 [Hypothèse très probable]. La v1 la marque « adresse conservée », mais elle ne dit pas d'où viendra son code.

**Proposition (Lot 0)**
1. Retrouver la source : `git fetch` puis recherche dans les branches distantes, sinon la source du déploiement sur l'hébergeur, sinon la session qui a construit la page.
2. La committer dans le dépôt **avant tout déploiement**, telle quelle (contenu identique), puis la migrer dans le layout Créateur.
3. Ajouter un test de fumée sur les URL qui ne doivent jamais casser : `/itineraire/chine`, les anciennes `/apps/*`, `/projets/*`, `/destination/*` (redirections 301), `/`, `/liens`. Le lancer après chaque déploiement de prévisualisation.

### B3. Le périmètre est irréaliste pour une seule personne

**Constat** : le plan C1 compte **environ 55 pages ou instances de pages** :
- 4 communes ;
- 22 Pro (dont 8 études de cas et 6 cas d'agents) ;
- 26 Créateur (dont 10 pays et 5 séries) ;
- 3 privées.

Avec `/en/…` partout, cela fait **environ 110 versions**. S'y ajoutent :
- deux PDF ;
- **trois fonctions LLM** (deux assistants et un devis assisté), avec une suite d'évaluation ;
- un **portail client** avec base de données, jetons, expiration et validation ;
- une **vue privée authentifiée** ;
- une couche live d'une dizaine de sources ;
- cinq directions de design.

Tout cela pour une personne qui maintient déjà six apps, deux chaînes et un atelier vidéo. La v1 ordonne les directions de design, mais **ne découpe pas le produit en lots**.

**Pourquoi c'est bloquant** : un site de 55 pages à moitié rempli contredit la promesse de la v1 elle-même (« chaque chiffre a sa preuve », « aucune page vide »). Les pages minces (un pays avec une seule vidéo, une série sans épisodes listés) feront plus de mal que de bien.

**Proposition** : découper en lots, avec des **déclencheurs réels** pour tout ce qui dépend d'un événement futur (section 6). Règles de périmètre :
- **Une page n'existe que si elle a du contenu sourcé aujourd'hui.** Sinon, c'est une ligne dans une page parente.
- **Ce qui demande une mise à jour manuelle plus souvent qu'une fois par mois** doit avoir une source automatique, ou disparaître.
- **Un seul système de design** à deux intensités (M5), **une seule fonction LLM** au lancement (M9), **pas de portail client ni de vue privée en v1** (M10).

### B4. La partie « agents IA » ne dit pas à un client ce qu'il peut acheter

C'est la précision explicite de Kenz : « qu'un futur client qui veut mettre des choses en place comprenne **tout ce que je peux mettre en place** ».

**Constat**
1. **Le pitch Pro** (A1) présente les agents comme un outil interne : « les systèmes d'agents **qui m'aident à les construire** ». Un client lit : « Kenz se sert d'agents ». Il ne lit pas : « Kenz peut en installer chez moi ».
2. **`/pro/agents` suit l'architecture de Kenz**, pas les problèmes du client. Dans l'ordre : schéma, rôles, mémoire et protocole, 10 pratiques, 6 cas, 5 étapes, incidents, FAQ. Les mots sont ceux du métier (« coordinateur », « protocole de transmission », « dry-run », « empreintes »). Un dirigeant de PME cherche « je perds du temps sur X », pas « mémoire partagée ».
3. **Ce que le client reçoit n'est jamais dit** : quels livrables à la fin d'une mission, qui possède quoi (comptes, clés, code, données), ce que coûte le fonctionnement, ce qui se passe après la mission, sous quelle forme on commence.
4. **Aucun travail client à montrer** : les offres sont toutes **[Hypothèse]** et la fiche Freelance est « à cadrer » [Observé 11/11]. La v1 ne dit pas comment l'assumer honnêtement.
5. Le schéma interactif (E3) et le devis assisté (E5) sont **deux démos séparées**, alors qu'elles devraient former un seul parcours : comprendre, composer, demander.

**Proposition** : réécrire `/pro/agents` comme un **catalogue de ce que Kenz met en place**, dans les mots du client, et relier la démo au devis.

**a) Le pitch Pro** [Proposition, vouvoiement selon G3] :
> « Je construis des apps où l'IA fait le vrai travail, et j'installe des agents IA dans votre équipe. »
> Sous-titre : « Six apps sur l'App Store, conçues, codées et lancées de bout en bout. Les mêmes méthodes chez vous : des agents qui ont chacun un rôle, une mémoire commune, et rien ne part sans votre validation. »

Trois portes de même niveau sur `/pro` :
- « Une app ou un produit IA » ;
- « Des agents IA dans votre équipe » ;
- « Du contenu vidéo automatisé ».

**b) La structure de `/pro/agents`** [Proposition] :

1. **Ce que je peux mettre en place chez vous** : six cartes, une par problème, avec le titre dans les mots du client (tableau ci-dessous). Chaque carte suit la même trame :
   - le problème ;
   - ce que font les agents ;
   - **ce que vous validez** (les points d'arrêt) ;
   - **ce que vous recevez** ;
   - ce qui reste humain ;
   - les outils ;
   - la preuve publique.
2. **Composez votre équipe** (démo interactive, étiquetée « Simulation ») :
   - le visiteur coche 1 à 3 tâches ;
   - le schéma d'agents se construit et le flux s'arrête au nœud « Validation humaine » (l'idée d'E3) ;
   - le bouton « Envoyer ce brief » ouvre `/pro/devis` **déjà pré-rempli**.

   Une seule démo, qui sert à la fois de preuve et de conversion.
3. **Ce que vous recevez à la fin d'une mission** [Proposition, à valider par Kenz] :
   - les agents configurés **dans vos comptes**, avec vos clés et vos abonnements ;
   - un fichier de règles écrit (rôles, droits, interdits) ;
   - une mémoire partagée : des fiches « Où on en est » et un journal des décisions ;
   - la liste des points de validation (qui valide quoi) ;
   - un rapport de vérification (ce qui a été testé, les limites connues) ;
   - une passation.
4. **Ce que je n'automatise pas** : publier, envoyer en votre nom, payer ou acheter, déployer en production, décider à votre place. C'est la traduction client des garde-fous d'`AGENTS.md` (« rien n'est publié, déployé ou acheté sans accord explicite », brief 01 § 3.5). Pour un acheteur, c'est la phrase la plus rassurante de la page.
5. **Comment on commence** : formats d'engagement [Proposition, noms et prix à fixer par Kenz, G19] :
   - un **diagnostic** court à périmètre fixe ;
   - un **pilote** sur un seul cas ;
   - une **mise en place** avec passation ;
   - un **suivi** en option.
6. **Sous le capot** (pour le client technique et le pair développeur) :
   - l'architecture, les rôles, la mémoire et le protocole de la v1 ;
   - **Hermes** présenté en une ligne (m3) ;
   - les outils : Claude Code et Codex pour les agents de code, MCP pour brancher vos outils, n8n **à confirmer** [Déclaré, non vérifié].
7. **FAQ**, avec des réponses concrètes :
   - « Que coûte le fonctionnement ? » : estimé au diagnostic et mesuré au pilote, jamais promis à l'avance ;
   - « Mes données sortent-elles ? » ;
   - « Que se passe-t-il si vous arrêtez ? » : tout est dans vos comptes et documenté ;
   - « Quels modèles ? » : fournisseur interchangeable, comme dans les apps de Kenz.
8. **Honnêteté sur l'historique** : « Mes propres produits sont mon terrain d'essai : six apps, une saison de 180 épisodes, plus de 60 vidéos. » Pas de logo client, pas de « +40 projets » (non sourcé, brief 01 § 4).

**c) Les six cas, dans les mots du client** [Proposition]

| Titre de carte | Cas de la v1 | Ce que vous recevez | Preuve publique (voir M1) |
|---|---|---|---|
| « Je passe trop de temps à chercher et trier l'info » | Veille sourcée | Une note datée où chaque ligne a sa source et son statut ; aucune action externe | **Démo étiquetée « exemple » sur des données publiques**, à construire (G21) |
| « Je veux publier plus de contenu sans y passer mes soirées » | Contenu marketing | Des gabarits vidéo à votre charte, un circuit brief → aperçu → validation → rendu | Plus de 60 vidéos pour 4 apps, vidéos App Store, Motion Lab [notes 04–11/11] |
| « Je veux de l'IA dans mon produit sans exploser les coûts ni casser la prod » | Intégrer un LLM | Un pipeline avec fournisseur interchangeable, quotas, file, replis, mode factice pour les tests | Oshii, Wado, Miru, Zenko [Code] |
| « Mon équipe veut des agents de code sans perdre le contrôle » | Agents de code | Des règles par dépôt, des revues indépendantes, les tests et la CI comme arbitres | 6 apps ; Sago : 260 tests, couverture de 93 % [Code 11/11] |
| « Personne ne sait où en est un dossier » | Mémoire d'équipe | Des fiches « Où on en est », un journal des décisions, une reprise en 30 s | La démo `/livrable/demo` (le même format, un client fictif) |
| « Mon back-office, c'est un tableur » | Back-office | Un admin lisible, des interrupteurs de fonctions, des tableaux de rétention | Croc (J1/J7/J30), Oshii (interrupteurs) [Code] ; Escapades Libres si l'équipe donne son accord (G6) |

---

## 3. Majeurs

### M1. Les preuves « agents » doivent toutes être publiques, et pas tirées de l'outillage privé

**Constat**
- A5 cite « 69/69 contrôles » et « 72 tests de synchronisation ». Ce sont des vérifications de **l'infrastructure de mémoire personnelle** de Kenz. Elles sont incompréhensibles pour un client et elles décrivent l'outillage privé.
- Le cas « mémoire d'équipe » a pour preuve « le coffre de Kenz ».
- Le cas « veille » s'appuie sur le rôle « recherche » et sur le tri d'archives internes. Ce rôle n'a **aucun exemple réel publiable** (04, § 0 bis).

**Proposition**
- Chaque cas cite **une preuve tirée d'un produit public** :
  - 1 966 phrases audio contrôlées, 0 lecture suspecte (Sago, 11/11) ;
  - 70 visuels importés en prod après sauvegarde et dry-run (Miru, 10/10) ;
  - la chaîne compile → valide → publie → active → retour arrière (Sago) ;
  - le mode factice et les quotas (Wado) ;
  - le repli Whisper (Oshii).
- À défaut, une **démo étiquetée « exemple »**.
- Retirer 69/69, 72 tests et toute mention du coffre comme preuve.
- Côté vocabulaire, n'afficher que les statuts épistémiques (« déclaré », « observé le », « hypothèse ») et aucun statut de suivi propre à un rôle interne.

### M2. Le côté Pro n'a pas d'audience principale

**Constat** : `/pro` sert à la fois le recruteur (A, B) et le client, avec le même héros. Les deux n'attendent pas la même chose : l'un veut un parcours, l'autre une offre et des garanties. La v1 ne tranche pas. Le badge « disponible » du site actuel était déjà jugé ambigu (brief 03, § 4.3).

**Proposition** [Proposition, G16] :
- `/pro` parle **d'abord aux clients** : les trois portes de B4, puis « Demander un devis ».
- Le recruteur a **son entrée directe**, `/pro/cv`, présente dans la navigation. C'est l'URL à mettre sur le CV, LinkedIn et GitHub.
- La disponibilité tient en une ligne, lue dans `now.json` et formulée par Kenz. Elle ne s'affiche que sur les pages clients.
- Le PDF du CV est **généré depuis la page** (feuille de style d'impression), pas tenu à part : une seule source, aucune dérive.

### M3. L'accueil carrefour coûte un clic à tout le monde

**Constat** : la v1 dit que `/` est « pensé pour ceux qui connaissent Kenz ». En pratique, la racine reçoit trois publics :
- ceux qui tapent le domaine entendu dans une vidéo ;
- tous les anciens liens (CV, LinkedIn, GitHub, JSON-LD, liens App Store) ;
- les proches.

**Proposition**
- **Des portes pleines, pas un choix vide.** À 390 px, les deux portes tiennent sans scroll (environ 45 % de la hauteur chacune). Chaque porte a :
  - une phrase ;
  - **une preuve live** : pour le Pro, « 6 apps sur l'App Store · dernière mise à jour : Oshii 2.0.2, le 04/11 » [Observé 11/11] ; pour le Créateur, « Dernière vidéo : Premier voyage en Chine, itinéraire de 14 jours (31/10) » ;
  - **une action directe** : « Demander un devis » ou « L'itinéraire ».
- **Aucune mémoire, aucune redirection automatique** : on garde la leçon du `kenz-mode` actuel.
- **Mettre à jour les liens externes** (liste à tenir dans le Lot 0) : CV, LinkedIn et GitHub vers `/pro` ou `/pro/cv` ; bios des comptes vers leur page de liens (M4) ; JSON-LD.
- **Mesurer** quelle porte est choisie (M15) avant de changer l'ordre.

### M4. « Ne pas tout mélanger » vaut aussi à l'intérieur du côté Créateur

**Constat** :
- La v1 prévoit **un seul** `/liens`, centré sur l'Asie.
- La barre Créateur compte **7 cibles** (Asie · Guides · k15ze · Sport · Collaborer · recherche · le point). C'est trop pour une barre au pouce.
- k15ze a sa propre DA et « rien du voyage » [Déclaré 08/11], et son public n'est pas celui de l'Asie.
- Enkenz attend G8.

**Proposition** [Proposition, G18] :
- **Une page de liens par compte** :
  - `/liens` pour l'Asie (TikTok, YouTube et Instagram voyage) ;
  - `/k15ze` comme lien en bio de k15ze, dans la DA de k15ze (blanc, vert lumineux) à l'intérieur du cadre commun ;
  - Enkenz selon G8.
- **La barre Créateur passe à 4 cibles** : Asie · Guides · Autres univers · le point. La recherche va en haut. « Collaborer » passe dans le pied de page et dans `/moi`.
- **Fusionner `/sport` dans `/k15ze`** (« mes courses » : Hyrox, Spartan, boxe), ou l'inverse : une seule page sport.

### M5. Deux systèmes de design, c'est deux fois la maintenance

**Constat** : la règle de Kenz est « **une identité, deux intensités** » [Validé 07/11]. Pourtant les directions F donnent à chaque côté sa palette (en clair et en sombre, soit 4 thèmes), sa grille et parfois ses polices. En F1, le Pro utilise Inter Tight, Inter, Instrument Serif et Geist Mono ; le Créateur, Inter 800, Instrument Serif et Melodrama.

**Proposition**
- **Un seul jeu de tokens et de composants.** Le côté est un attribut (`data-cote="pro|createur"`) qui change :
  - les couleurs ;
  - la densité ;
  - les multiplicateurs de mouvement (×1,2 / ×0,8) ;
  - la place de la navigation.
- **Deux familles partagées** (Inter / Inter Display et Instrument Serif italique), plus une mono pour les statuts côté Pro. Melodrama seulement si Kenz la valide pour le web, sur les noms de lieux.
- **Deux thèmes au lancement** (Pro clair, Créateur nuit). Le mode sombre du Pro vient ensuite.
- **Trancher vite** entre F1 et F2 (ou l'hybride de F6) et ne prototyper que les écrans du Lot 1.

### M6. Le point doit être prévisible

**Constat**
- **La page jumelle (A3) est une règle invisible** : le visiteur ne peut pas deviner où le point va l'emmener. Elle crée aussi des passages Pro → Créateur au milieu d'une étude de cas (Wado → k15ze), ce qui est l'inverse du « ne pas mélanger ».
- **L'appui long de 500 ms (F1)** sur un lien entre en conflit avec l'aperçu de lien d'iOS, qui s'ouvre à l'appui long [Hypothèse, comportement courant de Safari iOS, à tester].

**Proposition**
- Le point mène **toujours au hub de l'autre côté**.
- Il porte un libellé visible sur ordinateur (« côté créateur → ») et un nom accessible partout. Le même lien figure dans le pied de page.
- Les ponts contextuels (Wado ↔ k15ze) ne sont que des **liens explicites**, et seulement là où Kenz les valide.
- Retirer l'appui long.

### M7. La couche live : automatique d'abord, et rien de périmé à l'accueil

**Constat**
- **Les sources sont crédibles** (API iTunes testée, RSS YouTube), mais leur valeur est inégale et certaines demandent de la saisie.
- **L'API iTunes Lookup ne donne que la version courante**, sa date et ses notes. Elle ne donne **pas l'historique des versions** [fait connu de l'API]. Les « frises de versions » des études de cas (A4, C2) ne sont donc pas « live » : il faut les stocker.
- **`now.json` dépend de Kenz.** Un « Pas de nouvelle publiée depuis le [date] » sur l'accueil est honnête, mais c'est un signal négatif au premier écran.
- **Le calendrier de contributions GitHub** est un cliché de portfolio de développeur. Il révèle aussi le rythme de travail et, en creux, les périodes de voyage. Enfin, rien ne dit qui est l'auteur des commits faits avec des agents [Hypothèse, à vérifier].
- **Les requêtes HEAD sur les landings et la santé des API** n'intéressent aucune audience publique.
- **Le journal public préparé par un agent** lirait des notes du coffre. C'est le chemin le plus probable pour qu'un élément privé sorte un jour.

**Proposition**
- **Niveau 1, sans maintenance** :
  - versions iTunes ;
  - RSS YouTube des deux chaînes ;
  - date du dernier déploiement du site.

  Ce niveau suffit à rendre `/`, `/pro`, `/moi` et `/now` « vivants ».
- **Niveau 2, déclaré** : `now.json`, affiché **seulement sur `/now`** (et en une ligne sur `/pro` s'il est frais). Au-delà de 21 jours, l'accueil montre le dernier événement automatique à la place [Proposition].
- **Historique des versions** : écrit à la main dans les données des études de cas, à partir des dates déjà sourcées. Ou alors un relevé périodique qui ajoute une ligne, mais c'est une automatisation planifiée : Kenz doit d'abord l'accepter.
- **Remplacer le calendrier GitHub** par la **frise des mises en prod**, plus parlante et sans rien de privé.
- **Garder HEAD et santé** pour plus tard, dans une éventuelle vue privée.
- **Journal public (G11)** :
  - l'agent ne lit qu'une **liste blanche** de fiches de projets publics (le bloc « OÙ J'EN SUIS ») et **aucun autre dossier** ;
  - la sortie passe la vérification par liste de termes (B1) ;
  - Kenz fusionne.

### M8. La conversion repose sur une route qui ne la supporte pas

**Constat** [Code, 11/11] : `/api/contact` n'accepte que `email` et `message`. Elle n'a ni champ d'intention, ni limite de fréquence, ni anti-spam. La v1 y fait passer le contact par intention, la collab (marque, format, période, budget), le recrutement et le devis assisté. Un devis assisté par LLM sur une route sans limite, c'est aussi un **risque de coût** si quelqu'un en abuse.

**Proposition**
- **Une seule route avec un champ `intention`** (projet, agents, recrutement, marque, voyage, autre) et un schéma zod par intention, comme dans les apps de Kenz.
- **Anti-abus** : un champ piège invisible, **ALTCHA** (déjà utilisé sur Escapades Libres [Code]) et une limite par adresse IP.
- **Le LLM n'est jamais sur le chemin critique.** Le formulaire court part d'abord. Le brief structuré est proposé ensuite (« Je vous prépare un brief à relire ? »). Si l'assistant est en pause, rien n'est perdu.
- **La confirmation dit la suite** : délai de réponse **à confirmer**, et la forme du premier échange.
- **La newsletter (G14)** : plutôt que d'en lancer une générique, proposer une **alerte par guide** (« Préviens-moi quand le budget Chine sort »). L'intention est forte, l'envoi est rare et la liste tient en un outil à choisir, avec consentement explicite. Côté Créateur, le vrai abonnement reste YouTube : le lien `?sub_confirmation=1` ouvre directement la demande d'abonnement [à tester dans le navigateur TikTok].
- **Pages légales et mesure** : voir M14 et M15.

### M9. Trois fonctions LLM, c'est deux de trop au lancement

**Constat** : la v1 prévoit un assistant Pro, un assistant voyage et un devis assisté, plus 30 à 50 questions d'évaluation rejouées à chaque déploiement. Pour une personne seule, cela veut dire trois prompts, trois corpus, trois budgets et un risque de réputation : une réponse fausse peut être capturée en image puis partagée, par exemple « Kenz dit que le taxi coûte 40 € ».

**Proposition**
- **Lot 2** : une seule fonction, **le devis assisté**. C'est à la fois la conversion et la meilleure démonstration (sortie structurée, humain dans la boucle).
- **Lot 3** : l'assistant Pro (questions sur les projets, avec citations), **seulement si** la suite d'évaluation passe.
- **Assistant voyage : retiré.** L'abonné veut le guide, pas un chat. La recherche locale (⌘K ou loupe) et des guides bien structurés suffisent. Les prix vécus restent sur la page, datés.
- Retirer le faux chat actuel dès le Lot 1 (accord total avec E6).

### M10. Livrables clients et vue privée : construire après le premier client, pas avant

**Constat** : `/livrable/[jeton]` est un mini-produit (base privée, jetons, expiration, bouton « Valider » qui enregistre un nom et une date, hébergement de fichiers, statuts, planning). Aucune mission n'est lancée aujourd'hui [Observé 11/11, fiche Freelance]. `/atelier` ajoute une authentification et des liens vers des outils sur un site dont le code est public : une **surface d'attaque** pour une vue que le coffre (le Cockpit) couvre déjà.

**Proposition**
- **Lot 2 : `/livrable/demo` statique**, avec un client fictif étiqueté « Exemple — client fictif » sur chaque écran. C'est un argument de vente (« voilà ce que vous verrez ») qui sert aussi de preuve au cas « mémoire d'équipe ».
- **Au premier client signé** (déclencheur) : une page générée depuis un fichier privé hors du dépôt public, avec un jeton long, `noindex` et une expiration. « Valider » envoie un message daté par la route de contact ; il n'y a pas encore de base. Les builds de test restent dans TestFlight, les fichiers là où ils sont déjà.
- **Une base et des comptes** seulement après deux ou trois clients, si le besoin est prouvé.
- **`/atelier` : hors v1.** Pour « voir tout ce que je fais, les trucs en live, les liens associés », un `/now` complet suffit : tous les liens publics (stores, landings, chaînes, guides) et les signaux du niveau 1. Si Kenz veut plus après un mois d'usage : un **déploiement séparé**, hors du dépôt public.

### M11. Le côté Créateur prévoit des pages trop minces

**Constat**
- **Dix pages pays.** Plusieurs n'ont qu'une à trois vidéos (Suisse, Islande, Taïwan, Abu Dhabi) [Observé 04/11].
- **Cinq pages de séries.** Les listes d'épisodes et les médianes viennent de TikTok, qui n'a pas d'API publique : tout est à saisir à la main.
- **Les médianes affichées sont parfois défavorables** (Japon S2 : 2 200 contre 41 300 pour la Chine S2). Une leçon pour Kenz, mais un mauvais signal pour une marque.
- **Le TikTok est sans publication** depuis le 01/09 [Observé 04/11].

**Proposition**
- **Un `/asie` riche** : la frise des saisons, la carte des pays (piste 7 du brief 03), les meilleures vidéos et les guides.
- **Une page pays n'existe que quand un guide existe** : la Chine maintenant, la Malaisie si le guide est repris.
- **Les pages de séries attendent le Lot 3.** Une série devient une ligne de la frise, avec un lien vers la playlist.
- **Les médianes et les leçons** vont dans `/collaborer` (et seulement si Kenz l'accepte), pas dans les pages abonnés.
- **`/collaborer` reste léger**, avec des chiffres datés. L'état de publication est dit tel quel. Aucune date de reprise n'est promise tant que Kenz n'en a pas donné. Le PDF attend la première demande de marque (déclencheur).

### M12. Mobile depuis TikTok, et des guides utilisables en Chine

**Constat**
- Les budgets de la v1 sont bons (LCP sous 2 s en 4G, moins de 150 Ko de JS sur `/liens`).
- Mais plusieurs gestes signature sont prévus **sur des pages d'entrée mobiles** : la rafale de 7 images (F4), le fil plein écran aimanté et le timecode (F1), les View Transitions.
- Les abonnés ouvrent le lien **dans le navigateur intégré de TikTok ou d'Instagram**.
- Surtout, **le guide Chine est fait pour être lu en Chine**. Or les services Google et YouTube y sont bloqués sans VPN [fait général connu ; le guide lui-même parle du VPN].

**Proposition**
- **Pages d'entrée mobiles (`/liens`, guides)** : ni rafale, ni scroll-snap plein écran, ni GSAP. Les vidéos s'affichent en vignette et se chargent au clic. Les View Transitions ont un repli (navigation normale).
- **Guides** :
  - **aucune requête vers Google ou YouTube au chargement** : les polices sont déjà auto-hébergées par `next/font` [Code], aucune mesure d'audience Google, les vidéos s'ouvrent au clic ;
  - une **version hors ligne** : « Télécharger le PDF » ou un enregistrement hors ligne de la page [Proposition] ;
  - un test réel sans VPN [Hypothèse à vérifier].
- **Tester les parcours** dans les navigateurs intégrés de TikTok et d'Instagram : ouverture de YouTube, demande d'abonnement, retour.
- La rafale reste possible sur `/moi`, **une fois par visite**, après le premier affichage. Elle ne doit pas peser sur le LCP.

### M13. L'anglais partout double le travail sans servir le public Créateur

**Constat** : la v1 propose `/en/…` pour toute l'arborescence. Le public voyage est francophone (brief 03, § 1.5). Le public Pro, lui, peut être international : les apps existent en FR, EN et ES. Le site actuel rend aussi le HTML en français avant de passer à l'anglais, et l'anglais n'est pas indexé [Code, brief 03, § 4.7].

**Proposition** [G17] :
- **EN pour le Pro et les pages communes**, avec `/en/…`, `hreflang` et `lang` correct dès le rendu serveur.
- **Le Créateur en FR seulement.** Le sélecteur de langue y affiche « Contenu en français » au lieu de basculer.
- On garde la convention du projet (dictionnaires + `Localized<T>`). Les données du Créateur peuvent n'avoir qu'une valeur `fr`.

### M14. Il manque les pages légales et l'information sur les données

**Constat** : la v1 ne prévoit ni mentions légales ni politique de confidentialité. Or le site :
- propose des services (activité professionnelle) ;
- collecte des messages et des adresses ;
- enverrait le texte des visiteurs à un fournisseur de LLM ;
- enregistrerait des noms sur les pages livrables.

**Proposition**
- **Lot 1** : `/mentions-legales` et `/confidentialite`. Cette dernière dit quelles données sont collectées, où elles vont, combien de temps elles sont gardées, et ce qui est envoyé au fournisseur du LLM.
- **Le statut juridique** à afficher pour l'activité freelance est **à confirmer** par Kenz. Les obligations exactes sont à faire vérifier.
- Une **page 404** utile, qui propose les deux côtés et le guide du moment.

### M15. Il manque la mesure : aujourd'hui, rien ne dira si la v3 marche

**Constat** : aucun outil de mesure dans le site actuel [Observé 11/11, `package.json` et `app/layout.tsx`]. La v1 ne définit ni indicateur ni événement.

**Proposition** [G20] :
- Un outil de mesure **sans cookie**, pour éviter un bandeau de consentement (exemption à vérifier), à choisir par Kenz.
- Huit événements :
  - `porte_choisie` (pro / createur) ;
  - `devis_ouvert` et `devis_envoye` ;
  - `collab_envoyee` ;
  - `cv_pdf` ;
  - `guide_ouvert` (slug) ;
  - `sortie_youtube` ;
  - `sortie_store` (app).
- **Trois indicateurs**, relevés une fois par mois :
  - demandes de devis qualifiées ;
  - part des visiteurs de `/liens` qui ouvrent un guide ou une vidéo ;
  - part des visiteurs de `/pro/agents` qui composent une équipe dans la démo.

---

## 4. Mineurs

| # | Constat | Proposition |
|---|---|---|
| **m1** | Contradiction : la légende de 04 dit « à confirmer : ne rien publier sans réponse de Kenz », mais F2 (micro-interaction 2) et le brief 03 (piste 4) affichent un chiffre « à confirmer » en gris | Un chiffre « à confirmer » n'est **jamais** publié. Il reste dans les données, masqué |
| **m2** | Les pages communes (`/`, `/contact`, `/now`) n'ont pas de ton défini : `/contact` vouvoie (« Vous venez pour… ») un abonné qui arrive du côté tutoiement | Des formulations neutres sur les pages communes : « Un projet ? Une collab ? Une question voyage ? » |
| **m3** | « Hermes » désigne à la fois le framework et le profil coordinateur (brief 01, § 3.1). Son éditeur est à confirmer. Un lecteur français risque de penser à la marque de luxe | Une ligne d'explication (« Hermes Agent, un framework open source pour faire tourner des agents en continu ; je l'utilise comme coordinateur ») une fois l'éditeur confirmé (G15). Sinon : « un coordinateur » sans nom |
| **m4** | Les URL dites à l'oral ne sont pas fixées : C1 cite « kenzenbien.fr/chine », absent du plan ; `/avant-de-partir/chine` est long à dicter | Des alias courts sans accent ni tiret (`/chine` → le guide Chine du moment, `/maurice` plus tard), redirigés en 302 pour pouvoir changer de cible |
| **m5** | La pastille de preuve sur chaque fait risque de devenir du bruit visuel | Une pastille seulement sur les **chiffres** et les **statuts**. Les faits qualitatifs renvoient à la source en note |
| **m6** | Le fil plein écran aimanté et le timecode lié au défilement (F1) détournent le scroll ; sur le web, ils agacent | Fil aimanté seulement dans une galerie bornée, jamais sur la page entière |
| **m7** | Accessibilité, compléments : le prix barré est un tracé SVG ; le schéma d'agents est graphique ; les lignes de journal s'écrivent en direct | Prix en `<del>` / `<ins>` avec un texte lisible (SVG en `aria-hidden`) ; une **liste équivalente** au schéma (comme le prévoit F3) ; `aria-live="polite"` sur le journal ; focus sur le titre après une transition de page ; cibles de 44 px au moins |
| **m8** | Le poids : F1 charge 4 familles de polices côté Pro ; le dépôt garde environ 80 Mo d'assets inutilisés et une icône de 1,4 Mo (brief 03, § 4.5) | 3 familles au plus, variables et réduites aux caractères utiles ; sortir les 80 Mo du dépôt ; icônes en 32 et 180 px |
| **m9** | SEO : l'image Open Graph actuelle est un portrait déclaré en 1200×630 ; le sitemap est faux (brief 03, § 4.9) ; la v1 ne parle pas de données structurées | Une image OG par page (1200×630, générée) ; JSON-LD `Person`, `SoftwareApplication` (les apps), `VideoObject` (les guides) ; sitemap régénéré ; `noindex` sur `/livrable/*` |
| **m10** | `/pro/lab` et `/enkenz` ajoutent des pages pour peu de contenu | `/pro/lab` devient une section en bas de `/pro/apps` ; `/enkenz` attend G8 |
| **m11** | Les leçons de créateur (« le pratique bat le vlog » : médiane de 5 000 sur 150 vidéos pratiques, contre 1 500 [Observé 04/11]) sont un vrai savoir-faire marketing, rangé côté Créateur | Option pour Kenz : en faire une preuve de l'offre « contenu » côté Pro, en une phrase, sans vidéo voyage dans la navigation Pro |
| **m12** | Aucun témoignage n'existe, et la v1 n'en prévoit pas | Demander, sans jamais en inventer : l'équipe d'Escapades Libres (G6), Startup Weekend (à confirmer). Sinon, rien |
| **m13** | Cinq directions de design, c'est trop pour décider vite | Prototyper l'hybride de F6 (squelette F1, pastilles F2) sur les écrans du Lot 1, avec les assets existants. F4 et F5 attendent des rushs et des rendus validés |
| **m14** | Les états d'erreur des formulaires et du devis ne sont pas décrits | Pour chaque formulaire : état envoi, succès, échec réseau (le brouillon reste), limite atteinte (message honnête et autre canal) |

---

## 5. Ce qui manque, ce qui est de trop

### Ce qui manque
- **Pour le client agents** : ce qu'il reçoit, la propriété, les coûts de fonctionnement, ce que Kenz n'automatise pas, les formats d'engagement (B4).
- **La hiérarchie des audiences Pro** (M2).
- **Une page de liens par compte** (M4).
- **Les pages légales et la confidentialité** (M14).
- **La mesure** (M15).
- **Le plan de maintenance** : qui met à jour quoi, et à quelle fréquence (section 6).
- **Le sauvetage de `/itineraire/chine`** (B2) et les tests de fumée des URL.
- **L'usage des guides en Chine** et dans les navigateurs intégrés (M12).
- **La route de contact** par intention, avec anti-abus (M8).
- **La 404, les états d'erreur et les images OG** (M14, m9, m14).

### Ce qui est de trop (pour la v3, pas pour toujours)

| Élément | Où il va |
|---|---|
| `/atelier` | Hors v1, et hors du dépôt public s'il revient (M10) |
| Assistant voyage | Retiré (M9) |
| Assistant Pro | Lot 3, si les évaluations passent (M9) |
| Portail client avec base de données | Au premier client (M10) |
| Calendrier GitHub, HEAD sur les landings, santé des API publique | Retirés ou reportés (M7) |
| 10 pages pays, 5 pages de séries | Une page `/asie` riche, et des pages pays seulement avec un guide (M11) |
| `/en` pour le côté Créateur | FR seulement (M13) |
| Deux palettes complètes × clair/sombre, polices différentes par côté | Un seul système, deux intensités (M5) |
| Page jumelle implicite, appui long sur le point | Le point mène toujours à l'autre hub (M6) |
| `/sport` séparé de `/k15ze`, `/pro/lab` séparé | Fusionnés (M4, m10) |
| Cinq directions à maquetter | Une hybride d'abord (m13) |

---

## 6. Découpage proposé [Proposition]

### Lot 0 — avant toute maquette publiée ou tout déploiement
1. B1 : `maquettes/_brief/` ignoré par Git ; listes « jamais publié » neutralisées ; vérification par liste de termes, gardée hors du dépôt.
2. B2 : source de `/itineraire/chine` retrouvée et committée ; tests de fumée des URL.
3. Décisions de Kenz : G1, G3, G4, G8, G13, G15 de la v1, et G16 à G21 ci-dessous.
4. Liste des liens externes à mettre à jour (CV, LinkedIn, GitHub, bios, JSON-LD) ; revue des dépôts publics du compte.

### Lot 1 — le socle (environ 17 pages)
`/` · `/pro` · `/pro/agents` (structure B4, démo « Composez votre équipe » simulée) · 3 études de cas · `/pro/services` (formats d'engagement) · `/pro/cv` (+ impression PDF) · `/contact` (par intention, anti-abus) · `/moi` · `/asie` (riche) · `/itineraire/chine` (migrée) · `/liens` · `/k15ze` (avec « mes courses ») · `/now` (niveau 1 automatique) · `/mentions-legales` · `/confidentialite` · 404.

- **Études de cas du Lot 1** : Oshii (pipeline LLM), Sago (aucune génération à l'exécution, contenu produit avec des agents) et Wado (mode factice, quotas). Miru attend que sa V2 soit confirmée en ligne (G15). Croc et Zenko arrivent au Lot 2.
- Le faux chat actuel est retiré. La mesure (M15) est en place.

### Lot 2 — la profondeur
- Les autres études de cas et les 6 pages `/pro/agents/[cas]` ;
- `/pro/video` ;
- `/pro/devis` assisté, la seule fonction LLM ;
- `/livrable/demo` ;
- `/collaborer` léger ;
- `/avant-de-partir/chine` ;
- ⌘K ;
- l'anglais du côté Pro et des pages communes.

### Lot 3 — sur déclencheur seulement

| Élément | Déclencheur |
|---|---|
| `/livrable/[jeton]` réel | un premier client signé |
| `/budget/chine` | la vidéo « budget réel » publiée |
| Page de série Maurice | le premier épisode publié |
| Pages pays supplémentaires | un guide qui existe |
| Assistant Pro | la suite d'évaluation qui passe |
| PDF du media kit | une première demande de marque |
| Alertes par guide | G14 = oui |
| Vue privée | Kenz la demande après un mois d'usage de `/now` |

### Maintenance : ce que Kenz devra tenir à jour

| Élément | Fréquence | Source | Si ce n'est pas fait |
|---|---|---|---|
| Versions des apps, dernière vidéo, dernier déploiement | — | automatique | — |
| `now.json` | quand Kenz veut (optionnel) | Kenz, ou proposition d'agent fusionnée par Kenz | Au-delà de 21 jours, l'accueil montre le dernier événement automatique |
| Abonnés TikTok | mensuelle | saisie datée | La date s'affiche, la valeur passe en « en retard » |
| Études de cas | à chaque version majeure | données du site | La version live reste juste ; le texte vieillit |
| Guides | à chaque voyage | Kenz | Prix « vécus en [mois année] » |

---

## 7. Nouvelles questions pour Kenz (suite de G1–G15)

16. **Audience principale du côté Pro** : 1) les clients, avec les recruteurs sur `/pro/cv` (recommandé) ; 2) les recruteurs ; 3) à égalité.
17. **Langue du côté Créateur** : 1) FR seulement (recommandé) ; 2) FR + EN.
18. **Liens en bio** : 1) une page par compte, `/liens` pour l'Asie et `/k15ze` pour k15ze (recommandé) ; 2) un seul `/liens`.
19. **Formats d'engagement « agents IA »** à afficher : 1) diagnostic → pilote → mise en place → suivi (noms et prix à fixer) ; 2) « sur devis » seulement.
20. **Mesure d'audience** : 1) un outil sans cookie (à choisir) ; 2) aucune.
21. **Démo « veille » sur données publiques**, étiquetée « exemple » : 1) oui ; 2) non, le cas est présenté sans démo.

---

## 8. Les dix points prioritaires

1. **[Bloquant] Dépôt public.** `maquettes/` n'est pas ignoré par Git, et les briefs contiennent des éléments 🔒 et des listes qui décrivent en creux l'usage privé. Il faut ignorer `_brief/`, neutraliser ces listes et vérifier chaque commit avec une liste de termes gardée hors du dépôt.
2. **[Bloquant] `/itineraire/chine`.** La page est en production (route Next.js) mais absente de toutes les branches locales. Le prochain déploiement depuis `main` la supprimera très probablement : il faut retrouver et committer sa source d'abord.
3. **[Bloquant] Périmètre.** Environ 55 pages (110 avec l'anglais), 3 fonctions LLM, un portail client et une vue privée, pour une seule personne. Il faut des lots avec des déclencheurs : un Lot 1 d'environ 17 pages, un seul système de design, un seul LLM (le devis), sans `/atelier`, sans assistant voyage et sans portail en v1.
4. **[Bloquant] Agents IA.** Le pitch les présente comme un outil interne, et `/pro/agents` suit l'architecture de Kenz. Il faut réorganiser par problème client (ce que vous recevez, ce que vous validez, ce que je n'automatise pas, la propriété, les coûts, les formats) et relier la démo au devis pré-rempli.
5. **[Majeur] Preuves agents.** Retirer celles qui viennent de l'outillage privé (69/69, 72 tests, le coffre, le rôle recherche). N'adosser chaque cas qu'à une preuve produit publique ou à une démo étiquetée.
6. **[Majeur] Audience Pro.** Trancher entre clients et recruteurs. Recommandé : `/pro` parle aux clients, et le recruteur a `/pro/cv` comme URL directe.
7. **[Majeur] Créateur.** « Ne pas tout mélanger » vaut aussi entre les univers : une page de liens par compte (Asie, k15ze), une barre basse à 4 cibles, k15ze dans sa propre DA.
8. **[Majeur] Couche live.** D'abord les sources automatiques (iTunes, RSS, déploiements). Pas de calendrier GitHub. Jamais un `now.json` périmé sur l'accueil. L'historique des versions est à stocker, car l'API ne le donne pas. Le journal rédigé par un agent ne lit qu'une liste blanche.
9. **[Majeur] Conversion.** `/api/contact` n'accepte que l'e-mail et le message, sans anti-abus, et le site n'a aucune mesure. Il faut une route par intention avec ALTCHA et une limite, le LLM hors du chemin critique, des alertes par guide plutôt qu'une newsletter, huit événements mesurés, et des mentions légales et une politique de confidentialité.
10. **[Majeur] Mobile et guides.** Pas de rafale, de scroll-snap ni de View Transitions obligatoires sur les pages d'entrée. Les guides ne doivent rien charger de Google ou YouTube au démarrage et doivent exister en version hors ligne, puisqu'ils sont lus en Chine. Tester dans les navigateurs intégrés de TikTok et d'Instagram.

---

## 9. Sources et vérifications

- **Lus en entier** : `_brief/01-builder.md`, `_brief/02-createur.md`, `_brief/03-marque-style.md`, `_brief/04-strategie-v1.md`.
- **Code du site, en lecture seule** : `.gitignore`, `app/api/contact/route.ts` (champs acceptés), `contexts/language-context.tsx` (`?lang=en`), `app/layout.tsx` (polices via `next/font`, aucune mesure d'audience), `i18n/dictionaries/fr.ts` (formulation du contact).
- **Git, en lecture seule** : `git remote -v`, `git check-ignore`, `git branch -a`, `git ls-tree` des trois branches locales (recherche de la route de l'itinéraire). Aucun `git fetch`.
- **Réseau** (deux requêtes `HEAD`, une à la fois) :
  - `kenzenbien.fr/itineraire/chine` → 200, route Next.js prérendue, en cache ;
  - un ancien dépôt d'outillage → 404 en anonyme (non public).
- **Coffre, en lecture seule** : extraits de `Décisions.md` et de `Business/Freelance.md` (orientation de l'offre, statut « à cadrer », aucune mission lancée, rien d'autonome déclenché). Aucune note personnelle ouverte.
- Aucune tâche lourde, aucun navigateur, aucun serveur. Aucune note du coffre ni aucun fichier du site n'a été modifié. Seul ce fichier a été écrit.

*— Claude, panel produit & UX, 11/11/2026.*
