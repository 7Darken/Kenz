# 05 — Brief final : la référence des constructeurs

> Rédigé le 11/11/2026 par Claude (stratège produit et personal branding), après la v1 (`04-strategie-v1.md`) et ses deux critiques (`04b-critique-ux-produit.md`, `04c-critique-direction-artistique.md`). Relu contre les briefs 01, 02, 03, le protocole d'équipe du coffre (lecture seule) et le code du site (lecture seule).
> **Ce document remplace la v1.** En cas de doute, il fait foi ; pour les données, c'est `_shared/content.js` qui fait foi.
> Confidentialité : aucun usage personnel, aucune donnée personnelle, aucun détail d'infrastructure. `content.js` est la **liste blanche** : une maquette n'affiche rien qui n'y figure pas.

**Statuts** : **[Observé jj/mm]** relevé public, fichier ou API · **[Code]** lu dans le code · **[Déclaré]** dit par Kenz · **[Validé]** décision de Kenz · **[Proposition]** choix de ce brief, à valider · **[Hypothèse]** · **à confirmer** (jamais publié).

**Fichiers produits à cette étape**
- `maquettes/_brief/05-brief-final.md` (ce document)
- `maquettes/_shared/content.js` (`window.KENZ`, 27 clés, 38 routes, 38 images vérifiées)
- À construire : `maquettes/01-rec-prod.html`, `02-carnet.html`, `03-lignes.html`, `04-episode.html`, `05-matiere.html`

---

## 0. En bref

1. **Deux casquettes, deux adresses, un seul système.** Pro sous `/pro/…` (posé, clair, vouvoiement sur les pages clients). Créateur sous `/moi` et des URL courtes (`/asie`, `/guides`, `/itineraire/chine`, `/k15ze`, `/liens`, `/collaborer`), énergique, tutoiement. Un seul jeu de tokens ; le côté est un attribut `data-cote`.
2. **`/pro` parle d'abord aux clients.** Trois portes : *une app ou un produit IA*, *des agents IA dans votre équipe*, *du contenu vidéo automatisé*. Le recruteur a son entrée directe : `/pro/cv`.
3. **Les agents IA sont un catalogue de ce que Kenz installe chez un client**, dans les mots du client : six problèmes, ce que font les agents, ce que vous validez, ce que vous recevez, ce que je n'automatise pas. Hermes est le seul nom propre. Chaque pratique a une **preuve publique** tirée d'un produit. La démo « Composez votre équipe » mène au devis pré-rempli.
4. **Le point mène toujours au hub de l'autre côté** (`/pro` ↔ `/moi`), avec un libellé visible. Plus d'appui long, plus de page jumelle implicite.
5. **Le sitemap final compte 38 routes**, toutes maquettées : 7 communes, 22 Pro, 9 Créateur. Une page n'existe que si son contenu est sourcé aujourd'hui ; le reste attend un déclencheur.
6. **La couche live est automatique d'abord** (versions App Store, RSS YouTube, date de build) ; `now.json` est déclaré, daté, et ne s'affiche à l'accueil que s'il a moins de 21 jours. Pas de calendrier GitHub.
7. **Une seule fonction d'IA au lancement : le devis assisté**, hors du chemin critique. Le faux chat disparaît. Pas d'assistant voyage.
8. **Pages livrables** : `/livrable/demo` (client fictif) pour les clients ; guides, `/liens` et `/k15ze` pour les abonnés.
9. **Socle commun** : typo de la charte (Inter + Instrument Serif), mouvement tiré des tokens vidéo de Kenz, composants nommés W1–W16, contrastes calculés. Une direction ne change que **la composition, la matière et ses gestes exclusifs**.
10. **Cinq directions finales**, chacune couvrant les 38 routes : **REC / PROD**, **Carnet**, **Lignes**, **Épisode**, **Matière**.

---

## 1. Arbitrages des deux critiques

### 1.1 Critique produit & UX (04b)

| # | Point | Décision | Justification |
|---|---|---|---|
| B1 | Le dossier `maquettes/` n'est pas ignoré par Git | **Accepté** (action de Kenz) | Je n'ai le droit d'écrire que dans `maquettes/` : je recommande d'ignorer `maquettes/_brief/` avant tout `git add`, et j'applique dès maintenant la règle « aucune liste d'interdits détaillée » dans 05 et `content.js`. |
| B1.2 | Neutraliser les listes « jamais publié » | **Accepté** | Une seule phrase neutre suffit ; `content.js` sert de liste blanche, ce qui rend les listes d'interdits inutiles. |
| B2 | `/itineraire/chine` absente du dépôt | **Accepté** (Lot 0, hors maquettes) | L'URL est liée depuis une vidéo publique ; les maquettes la gardent telle quelle, la source doit être retrouvée avant tout déploiement. |
| B3 | Périmètre irréaliste | **Accepté en partie** | Le site est découpé en lots avec déclencheurs ; mais les maquettes couvrent **tout** le sitemap final, parce que Kenz a demandé des maquettes complètes et que voir une page aide à décider si elle mérite d'exister. |
| B4 | Les agents ne disent pas au client ce qu'il achète | **Accepté** | C'est la demande explicite de Kenz ; `/pro/agents` devient un catalogue par problème client, relié au devis. |
| M1 | Preuves agents tirées de l'outillage privé | **Accepté** | Les chiffres de l'outillage interne disparaissent ; chaque pratique s'adosse à un produit public ou à une démo étiquetée. |
| M2 | Pas d'audience principale côté Pro | **Accepté** | `/pro` parle aux clients ; `/pro/cv` est l'URL du recruteur (à mettre sur CV, LinkedIn, GitHub). |
| M3 | L'accueil carrefour coûte un clic | **Accepté** | Deux portes **pleines** (phrase, preuve live, action directe) tiennent sans scroll à 390 px. |
| M4 | Ne pas mélanger à l'intérieur du Créateur | **Accepté** | `/liens` pour l'Asie, `/k15ze` comme lien en bio de k15ze dans sa propre DA ; barre basse à 4 cibles ; le sport perso rejoint `/k15ze` (« Mes courses »). |
| M5 | Deux systèmes de design | **Accepté** | Un seul jeu de tokens, `data-cote` change couleurs, densité, multiplicateur de mouvement et place de la navigation. |
| M6 | Le point doit être prévisible | **Accepté** | Toujours le hub d'en face, libellé visible ; l'appui long est retiré (conflit avec l'aperçu de lien d'iOS). |
| M7 | Live : automatique d'abord | **Accepté** | Niveau 1 automatique, niveau 2 déclaré ; historique des versions écrit à la main ; pas de calendrier GitHub, pas de santé d'API publique. |
| M8 | Route de contact trop pauvre | **Accepté** | Une route avec champ `intention`, ALTCHA, limite par IP ; le LLM n'est jamais sur le chemin critique ; alertes par guide plutôt que newsletter. |
| M9 | Trois fonctions LLM | **Accepté** | Devis assisté seul (Lot 2) ; assistant Pro au Lot 3 si l'évaluation passe ; pas d'assistant voyage. |
| M10 | Livrables et vue privée trop tôt | **Accepté** | `/livrable/demo` statique ; pas de `/atelier` : `/now` devient le tableau de bord public complet, avec tous les liens. |
| M11 | Pages Créateur trop minces | **Accepté** | Un `/asie` riche ; une page pays seulement quand un guide existe (Chine) ; pas de pages de séries avant le premier épisode de Maurice ; médianes réservées à `/collaborer` et sous réserve. |
| M12 | Mobile depuis TikTok, guides lus en Chine | **Accepté** | Pas de rafale ni de GSAP sur `/liens` et les guides ; aucune requête Google ou YouTube au chargement des guides ; version hors ligne prévue. |
| M13 | L'anglais partout | **Accepté** | EN pour le Pro et les pages communes (Lot 2) ; Créateur en français seulement. |
| M14 | Pages légales et données | **Accepté** | `/mentions-legales`, `/confidentialite` et une 404 utile font partie du sitemap. |
| M15 | Aucune mesure | **Accepté** | Huit événements définis (§ 9.7) ; outil sans cookie à choisir par Kenz. |
| m1 | Un chiffre « à confirmer » affiché en gris | **Accepté** | Jamais publié ; seul le panneau de simulation peut révéler « les trous » pour que Kenz les voie. |
| m2 | Ton des pages communes | **Accepté** | Formulations neutres (« Un projet ? Une collab ? Une question voyage ? »). |
| m3 | Hermes à expliquer | **Accepté en partie** | Kenz veut voir Hermes nommé : il l'est, comme coordinateur ; l'éditeur et la licence du framework ne sont pas écrits avant confirmation. |
| m4 | Alias courts | **Accepté** | `/chine` → `/itineraire/chine` en 302. |
| m5 | Pastille partout = bruit | **Accepté** | Pastille sur les chiffres et les statuts seulement. |
| m6 | Scroll détourné | **Accepté** | Aucun scroll-snap pleine page ; aimantation seulement dans une galerie bornée. |
| m7 | Accessibilité, compléments | **Accepté** | `<del>`/`<ins>`, liste équivalente à chaque schéma, `aria-live="polite"`, focus sur le titre, cibles de 44 px. |
| m8 | Trop de polices | **Accepté** | Deux familles de socle + une police d'accent par direction au plus (exception documentée pour Épisode). |
| m9 | SEO | **Accepté** (build) | Hors maquettes : OG par page, JSON-LD, sitemap régénéré, `noindex` sur `/livrable/*`. |
| m10 | `/pro/lab`, `/enkenz` | **Accepté** | Le Lab devient une section de `/pro/apps` ; Enkenz attend G8. |
| m11 | Leçons créateur comme preuve Pro | **Accepté en option** | Une phrase possible sur `/pro/video`, masquée par défaut, jamais de visuel voyage côté Pro. |
| m12 | Témoignages | **Accepté** | Aucun témoignage inventé ; emplacement absent tant qu'il n'y en a pas. |
| m13 | Une seule hybride d'abord | **Rejeté** | Kenz demande « plein de nouvelles maquettes » ; je garde cinq directions, mais avec un socle commun qui les rend comparables (règle de 04c). |
| m14 | États d'erreur des formulaires | **Accepté** | Envoi, succès, échec réseau (le texte reste), limite atteinte, assistant en pause : textes dans `content.js`. |

### 1.2 Critique de direction artistique (04c)

| Point | Décision | Justification |
|---|---|---|
| Socle typo de la charte (Inter / Inter Display + Instrument Serif) | **Accepté** | La charte de Kenz tranche déjà ; c'est le premier rempart contre le générique. |
| Melodrama pour les lieux | **Accepté en cible** | Pas sur Google Fonts et licence web à confirmer : les maquettes utilisent **Instrument Serif romain** pour les lieux (même famille que « le mot », dessin proche). |
| Retirer Geist Mono et la frappe en mono | **Accepté** | Effet « page de statut » et « terminal » ; les versions passent en chiffres tabulaires d'Inter et montent par la fente. |
| F1 : iris au lieu des bandes | **Accepté** | La fermeture en iris fait partie des transitions que Kenz valide ; les masques, non. À confirmer (DA-1). |
| F1 : 16:9 (21:9 en bandeau), 3:2 sur mobile | **Accepté** | Un module 21:9 fait 167 px de haut à 390 px. |
| F1 : timeline à pistes pour les agents | **Accepté** | Elle vient de la chaîne de montage de Kenz et lit naturellement « qui fait quoi, quand ». |
| F1 : Pro toujours clair | **Accepté** | La lumière fait partie de l'identité de chaque côté ; pas d'inversion automatique. |
| F2 : Créateur = image annotée | **Accepté** | Le carnet de route crème était trop sage pour TikTok ; l'énergie vient de l'image, le carnet survit dans les annotations. |
| F2 : registre au lieu de la grille de fiches | **Accepté** | Il reprend la « Carte des apps » et évite la grille de cartes identiques. |
| F2 : « le quadrillage se retire » | **Accepté** | Geste propre, sans masque. |
| F3 : réduire à un module Pro | **Rejeté en partie** | Je garde *Lignes* en direction complète (cinq directions demandées), mais avec **deux plans séparés** : lignes orthogonales côté Pro, carte géographique côté Créateur, jamais le même SVG. |
| F3 : sept couleurs, rouge partout | **Accepté** | Une famille d'encres côté Pro, **une** saison active côté Créateur. |
| F3 : skill `industrial-brutalist-ui` | **Accepté** | Remplacé par `frontend-design:frontend-design`. |
| F4 : Pro en « arcs » et « épisodes » | **Accepté** | C'est le mélange que Kenz refuse ; le Pro d'*Épisode* devient « la fiche technique » (posé, crédits honnêtes), sans aucun vocabulaire de série. |
| F4 : rafale, WANTED, épinglages, inertie | **Accepté** | Rafale corrigée (coupes franches, lames une fois), WANTED en bas de page, bande d'épisodes native, pas d'inertie. |
| F4 : Bebas Neue en titre | **Accepté** | Bebas Neue reste pour les tampons uniquement. |
| F5 : rétrograder en couche | **Rejeté en partie** | Je la garde en direction complète, mais **sans asset 3D** : vue éclatée en plans CSS, objets-preuves en CSS provisoire, créateur sur le bleu nuit de la référence de Kenz. |
| F5 : tilt, bento, Fraunces, verre sur fond uni | **Accepté** | Clichés retirés ; verre seulement au-dessus d'une vraie image. |
| Composants communs sortis des signatures (pastille, fente, tampon, prix barré, arrêt obligatoire) | **Accepté** | Ils vont dans le socle (§ 9.3) ; chaque direction est jugée sur ses gestes exclusifs. |
| Accent de saison, sous-identité k15ze | **Accepté** | Règles de la charte et DA validée le 08/11. |
| Deux tokens par accent (`--accent`, `--accent-texte`) | **Accepté** | Les contrastes sont recalculés pour chaque palette de ce brief. |
| Nommer les gestes W1–W16 | **Accepté** | Kenz nomme ses motions ; les constructeurs parlent la même langue. |
| Recomposition « 3 maquettes + 2 modules » | **Rejeté** | Cinq directions complètes sont demandées ; la règle « socle commun + gestes exclusifs » en garde l'esprit. |

### 1.3 Ce qui change par rapport à la v1

- **Retirés** : `/atelier`, l'assistant voyage, le calendrier GitHub, les requêtes HEAD et la santé d'API publiques, 9 pages pays, 5 pages de séries, `/sport` (fusionné dans `/k15ze`), `/pro/lab` (section de `/pro/apps`), `/enkenz` (G8), `/budget/chine` (déclencheur), l'appui long sur le point, les pages jumelles implicites, les surnoms d'agents, les chiffres de l'outillage interne.
- **Ajoutés** : `/mentions-legales`, `/confidentialite`, `/404`, l'alias `/chine`, la démo « Composez votre équipe », « ce que vous recevez », « ce que je n'automatise pas », les formats d'engagement, la route de contact par intention, les états d'erreur, la mesure.

---

## 2. Positionnement

### 2.1 Une personne, deux casquettes, deux intensités

| | **Pro** — AI engineer, fullstack, solopreneur | **Créateur** — Kenz en Asie, k15ze | Commun |
|---|---|---|---|
| Promesse | « Je construis des apps où l'IA fait le vrai travail, et j'installe des agents IA dans votre équipe. » [Proposition] | « Je voyage en Asie et je raconte ce que ça coûte vraiment. » [Proposition] | « Je construis l'app, et je fais la vidéo qui la fait connaître. » |
| Intensité | posée (×1,2) | énergique (×0,8) | « une identité, deux intensités » [Validé 07/11] |
| Lumière | claire (sauf direction 4, voir § 10.4) | propre à chaque direction | — |
| Ton | « je » ; **vous** sur services, devis, agents, livrable | « je », **tu**, verdicts courts | neutre |
| Preuves | versions en direct, stack réelle, tests, décisions datées | vues et abonnés datés, prix vécus validés | pastille de preuve |

### 2.2 Ce qui traverse, ce qui ne traverse pas

- **Quatre ponts seulement** : le point, `/now`, `/contact`, le pied de page. Plus une phrase dans `/a-propos` et `/pro/cv` (« je fais aussi de la vidéo de voyage »).
- **Aucune vidéo de voyage dans la navigation Pro. Aucune app dans la navigation Créateur.** Wado peut apparaître sur `/k15ze` comme dans les vidéos, jamais en pub, et seulement si Kenz valide le lien (`apps[wado].pont`).
- **Les comptes d'acquisition des apps** restent côté Pro, et seulement le compte de marque de Croc figure (sur sa page).
- **Les agents** ne sont présentés que comme un savoir-faire installé chez un client : aucune mention, directe ou indirecte, d'un usage personnel de Kenz.

### 2.3 Montrer la progression

Trois horloges datées, jamais de compteur qui défile :
- **Mises en prod** (`progression.evenements`) : Zenko 20/10/2025 → Oshii 06/11/2025 → Sago 08/04/2026 → Miru 17/04/2026 → Croc 23/09/2026 → Wado 10/10/2026 → Sago V2 et Miru 2.0 le 30/10/2026 → saison 1 de Sago (180 épisodes) le 11/11/2026.
- **Saisons de voyage** (`createur.asie.saisons`) : Japon 2024 → Corée → Malaisie → Chine S1 → Chine S2 → Japon S2 → guides Chine → itinéraire (31/10/2026) → Île Maurice (en préparation).
- **Versions du site** (`site.versions`), dans le colophon de `/a-propos`.

Chaque étude de cas finit par « Ce que j'en retiens » (`apps[].retenir`, proposition à valider).

---

## 3. Audiences

| Audience | Porte réelle | En 10 secondes | Page « livrable » | Conversion |
|---|---|---|---|---|
| **Client qui veut des agents IA** | lien envoyé, LinkedIn, recherche → `/pro` | « Kenz peut installer chez moi une équipe d'agents pour *mon* problème ; je valide tout ; je sais ce que je reçois. » | `/pro/agents`, puis `/livrable/demo` | « Composez votre équipe » → devis pré-rempli |
| **Client qui veut une app ou de l'IA dans son produit** | idem | « Six apps en production, versions en direct, études de cas honnêtes. » | `/pro/apps/[app]` | Devis |
| **Client qui veut du contenu vidéo** | idem | « De mes rushs à une vidéo prête, à ma charte, validée à chaque étape. » | `/pro/video` | Devis |
| **Recruteur tech** | `/pro/cv` (URL du CV et de LinkedIn) | « AI engineer et fullstack ; LLM en production ; agents avec garde-fous ; preuves cliquables. » | `/pro/cv` + impression PDF | PDF, formulaire « recrutement » |
| **Pair développeur** | GitHub, étude de cas partagée | « Des choix d'architecture vérifiés : aucune génération à l'exécution, file + SSE, mode factice, tests par propriétés. » | `#sous-le-capot` des études de cas | Partage, contact |
| **Abonné voyage (mobile, TikTok)** | `/liens` | « C'est bien Kenz ; voilà le guide promis et la dernière vidéo. » | `/itineraire/chine`, `/guides` | Ouvrir le guide, s'abonner |
| **Abonné k15ze** | `/k15ze` | « Les Shorts, la promesse, mes courses. » | `/k15ze` | S'abonner |
| **Marque** | `/collaborer` | « Audience datée et sourcée, sujets qui marchent, formats intégrables, aucun faux logo. » | `/collaborer` | Formulaire collab |
| **Kenz et ses proches** | `/` puis `/now` | « Tout ce qui est en ligne, ce qui bouge, tous les liens. » | `/now` | — |

---

## 4. Sitemap final

### 4.1 Arborescence (38 routes + 1 alias)

```
kenzenbien.fr
├─ /                          Carrefour : deux portes pleines + « En ce moment »            [commun]  L1
├─ /now                       Tableau de bord public : Pro | Créateur + tous les liens       [commun]  L1
├─ /contact                   Contact par intention                                          [commun]  L1
├─ /a-propos                  Une personne, deux casquettes + colophon                       [commun]  L1
├─ /mentions-legales                                                                          [commun]  L1
├─ /confidentialite                                                                           [commun]  L1
├─ /404                                                                                       [commun]  L1
│
├─ /pro                       Hub Pro : trois portes, versions live, frise                   [Pro]     L1
│  ├─ /pro/apps               Registre des apps + section Lab                                          L1
│  │  └─ /pro/apps/[app]      oshii · sago · wado (L1) · croc · miru · zenko · escapades-libres* · ce-site (L2)
│  ├─ /pro/agents             Catalogue « ce que je mets en place chez vous » + démo                  L1
│  │  └─ /pro/agents/[cas]    veille · contenu · llm-produit · agents-de-code · memoire-equipe · back-office (L2)
│  ├─ /pro/video              Contenu vidéo automatisé                                                L2
│  ├─ /pro/services           Offres, formats, process, principes, FAQ                                L1
│  ├─ /pro/devis              Formulaire court, puis brief assisté                                     L2
│  ├─ /pro/cv                 CV interactif + impression                                               L1
│  └─ /livrable/demo          Exemple de livrable client (client fictif, noindex)                      L2
│
├─ /moi                       Hub Créateur                                                   [Créateur] L1
├─ /asie                      Kenz en Asie : saisons, carte, meilleures vidéos, guides                 L1
│  └─ /asie/chine             Seule page pays (un guide existe)                                        L1
├─ /guides                    Index des guides et des « à venir »                                      L1
├─ /itineraire/chine          URL CONSERVÉE (liée depuis YouTube)                                      L1
├─ /avant-de-partir/chine     Checklist                                                                L2
├─ /k15ze                     k15ze + « Mes courses » (Hyrox, Spartan, boxe) ; lien en bio de k15ze    L1
├─ /liens                     Lien en bio de Kenz en Asie (390 px d'abord)                             L1
└─ /collaborer                Media kit léger                                                          L2

Alias : /chine → /itineraire/chine (302)
* conditionnel : accord de l'équipe (G6), nom masqué par défaut
```

Dans les maquettes, chaque route existe en hash (`#/pro/apps/sago`). Liste machine : `KENZ.routes`.

### 4.2 Page par page : contenu et états

Données : clés de `content.js` entre crochets. **Vide** = jamais rien eu ; **Live** = ce qui vient de la couche live (§ 5).

| URL | Contenu (dans l'ordre) | État vide / erreur | Live |
|---|---|---|---|
| `/` | Wordmark « Kenz. » avec le point ; **porte Pro** (phrase, preuve live « 6 apps sur l'App Store · dernière mise à jour : Oshii 2.0.2, le 04/11 », bouton « Demander un devis », lien « Côté pro ») ; **porte Créateur** (phrase, dernière vidéo, bouton « L'itinéraire Chine », lien « Côté créateur ») ; bande « En ce moment » (3 lignes) ; pied de page [`pitchs.accueil`]. À 390 px, les deux portes tiennent sans scroll, **tailles et matières différentes** (jamais un 50/50). | `now.json` de plus de 21 jours : la bande montre le dernier événement automatique | dernière MAJ d'app, dernière vidéo |
| `/now` | Deux colonnes séparées. **Pro** : « Cette semaine je construis » [`live.semaine`], état des 6 apps (version + « il y a N j »), dernière mise en prod. **Créateur** : dernière vidéo, dernier Short, en préparation, état de publication par plateforme. **Tous mes liens**, groupés par casquette (stores, landings, chaînes, guides) [`reseaux`, `apps[].liens`, `ressources.guides`]. Date de mise à jour visible. | « Rien de nouveau publié cette semaine — mis à jour le [date]. » | tout |
| `/contact` | Question « Un projet ? Une collab ? Une question voyage ? » ; 6 intentions [`contact.intentions`] qui orientent (devis, collaborer, guides) ou ouvrent le formulaire court ; aucune adresse en clair | états du formulaire [`services.devis.etats`] | — |
| `/a-propos` | Une personne, deux casquettes (deux paragraphes, la phrase-pont) ; colophon [`site.colophon`, `site.versions`] ; sources live ; accessibilité | — | dernier déploiement |
| `/mentions-legales`, `/confidentialite` | Structure [`legal`] ; champs inconnus rendus « à confirmer » seulement en mode « trous » | — | — |
| `/404` | « Cette page n'existe pas, ou plus. » ; les deux portes ; le guide du moment | — | — |
| `/pro` | Héros [`pitchs.pro.hero`, `sousTitre`] + « Demander un devis » visible dès le premier écran ; **trois portes de formes différentes** [`services.portes`] : Apps = la liste des versions live ; Agents = un aperçu jouable du schéma ; Vidéo = une phrase et un bouton ; frise des mises en prod [`progression`] ; une ligne `now.json` Pro si fraîche ; lien CV discret | une app sans réponse garde sa dernière version, datée | versions des 6 apps |
| `/pro/apps` | **Registre** (pas une grille de cartes identiques) : une ligne par app — nom, accroche, version live, sortie, IA oui/non, plateformes [`apps`] ; filtres (avec IA / sans IA, statut) ; section **Lab** en bas [`lab`] | escapades-libres masqué sans accord (nom masqué de toute façon) | pastille d'état par app |
| `/pro/apps/[app]` | En-tête (nom, accroche, version live, liens) ; Problème ; Public ; **L'IA en détail** (pipeline rejoué [`apps[].ia`]) ou « Pas d'IA ici, et c'est un choix » (Croc) ; **Sous le capot** (5 plans : App · API · Données · IA · Infra [`apps[].stack`], W10) ; Défis ; Chiffres avec pastille ; Versions (frise, écrite à la main) ; Captures ; « Ce que j'en retiens » ; app suivante | sans capture : icône (ou monogramme couleur de l'app) + « captures à venir » ; Sago n'affiche **aucune** capture V1 ; Miru légende « avril 2026 » | version, date, notes de version |
| `/pro/agents` | Voir § 6.1 (8 blocs) | — | — |
| `/pro/agents/[cas]` | Titre dans les mots du client ; le besoin ; l'équipe (rôles) ; le circuit ; **ce que vous validez** ; **ce que vous recevez** ; ce qui reste humain ; les outils ; la preuve publique ; démo du cas (schéma de la direction, filtré sur ses rôles) ; « Envoyer ce brief » [`agents.cas[]`] | — | `veille` : démo sur les versions App Store réelles |
| `/pro/video` | Promesse ; le circuit en 7 étapes [`video.circuit`] ; **W8 La coupe au mot** ; règles ; volumes datés ; motions nommées ; outils ; lien devis | sans accord pour les vidéos : schéma et visuels fixes | — |
| `/pro/services` | Six offres (étiquetées « en cours de cadrage » en mode trous) [`services.offres`] ; formats d'engagement [`agents.formats`] ; process en 5 temps ; 3 principes ; FAQ ; prix « sur devis » | disponibilité absente tant qu'elle n'est pas formulée | — |
| `/pro/devis` | Étape 1 : formulaire court (besoin, adresse de réponse, échéance) → envoyé. Étape 2 : « Je vous prépare un brief à relire ? » → brief structuré modifiable (8 champs) → « Valider et envoyer ». Pré-remplissage depuis « Composez votre équipe » [`services.devis`] | 5 états [`services.devis.etats`] | — |
| `/pro/cv` | Résumé en 60 s [`parcours.resume60s`] ; compétences groupées, **chaque groupe mène à sa preuve** [`competences`] ; frise datée ; distinction Startup Weekend avec photos ; langues ; bouton imprimer / PDF ; une ligne « je fais aussi de la vidéo de voyage » → `/moi` | lignes « à confirmer » masquées (formation, expérience salariée, dates) | nombre d'apps en ligne |
| `/livrable/demo` | Voir § 7.1 | « Ce lien a expiré, écrivez-moi pour un nouveau. » (simulable) | — |
| `/moi` | Ouverture propre à la direction ; univers (Kenz en Asie, k15ze) ; dernière vidéo ; guide du moment ; en préparation (Maurice) ; Collaborer ; CTA S'abonner | — | dernière vidéo |
| `/asie` | Promesse ; chiffres datés [`createur.asie.chiffres`] ; état de publication par plateforme ; **frise des saisons** [`saisons`] ; **carte des pays** (9 filmés + Maurice à venir ; Suisse et Islande « hors Asie ») ; meilleures vidéos (YouTube longues, Shorts, top TikTok) ; guides ; « En préparation : Branche-toi Île Maurice » avec son accent de saison | pays sans page : une ligne dans la carte, jamais de lieux non sourcés | dernière vidéo, dernier Short |
| `/asie/chine` | Quand ; 6 villes avec nom chinois et lieux sourcés ; **Ce que ça m'a coûté** (8 prix vécus, W4) ; verdicts ; meilleures vidéos ; guides liés (itinéraire, avant de partir, budget à venir) | budget total : « La vidéo budget réel est en préparation » | — |
| `/guides` | Guides en ligne, à publier et à venir [`ressources.guides`] ; pour chaque « à venir » : son déclencheur et « Préviens-moi quand il sort » (alerte simulée) | — | — |
| `/itineraire/chine` | Titre exact de la page actuelle ; 14 jours, 3 bases ; options (Shenzhen, Guangzhou) ; prix vécus en badges ; vidéo liée (vignette, lecteur au clic) ; « Version hors ligne » | répartition jour par jour et « deux conseils » : à reprendre de la page en ligne (mode trous) | — |
| `/avant-de-partir/chine` | 6 points de checklist cochables [`chine.avantDePartir`] ; vidéos liées | — | — |
| `/k15ze` | **Sous-identité k15ze** (§ 9.5) ; promesse ; « ni coach, ni expert » ; formats ; sujets ; chiffres datés ; **Mes courses** (HYROX Paris 31/05/2025, Spartan 06/2025, boxe depuis le 14/10/2026) ; liens YouTube (TikTok « bientôt ») | abonnés inconnus : rien plutôt que « 0 » ; derniers Shorts : état vide honnête tant que le RSS n'est pas branché | derniers Shorts (RSS, à brancher) |
| `/liens` | 390 px d'abord : dernière vidéo ; guide du moment ; YouTube, TikTok, Instagram ; Tous mes guides ; Collaborer ; lien discret « Kenz côté pro » [`ressources.liens`] | sans guide du moment : la vidéo la plus vue de la saison | dernière vidéo |
| `/collaborer` | Promesse ; audience par plateforme, datée ; sujets qui marchent ; 2 études de cas ; formats intégrables ; zone ; état de publication (tel quel) ; garde-fous ; formulaire (marque, format, période, budget indicatif) [`mediaKit`] | démographie : « sur demande » | abonnés YouTube |

### 4.3 Hors maquettes (sur déclencheur)

| Élément | Déclencheur |
|---|---|
| `/livrable/[jeton]` réel | un premier client signé (page générée depuis un fichier privé, hors dépôt public) |
| `/budget/chine` | la vidéo « budget réel » publiée |
| Page de série Maurice | le premier épisode publié |
| Autres pages pays | un guide qui existe |
| Assistant Pro | la suite d'évaluation qui passe |
| PDF du media kit | une première demande de marque |
| Alertes par guide réelles | G14 = oui |
| `/en/…` | Lot 2, Pro et pages communes |

### 4.4 Redirections

`/apps/[slug]` et `/projets/[slug]` → `/pro/apps/[slug]` (301) ; `/destination/[slug]` → `/asie` ou `/asie/chine` (301) ; `/chine` → `/itineraire/chine` (302) ; `?lang=en` → `/en/…` (Lot 2) ; la clé `kenz-mode` du navigateur est supprimée. Test de fumée après chaque déploiement : `/`, `/liens`, `/itineraire/chine`, les anciennes URL.

---

## 5. La couche live

### 5.1 Sources

| Niveau | Donnée | Source en production | Fréquence | Où |
|---|---|---|---|---|
| 1 (auto) | Version, date, notes de version des 6 apps | API iTunes Lookup, sans clé, une requête pour 6 identifiants | 6 h | `/`, `/pro`, `/pro/apps`, études de cas, `/now` |
| 1 (auto) | Dernière vidéo, derniers Shorts | Flux RSS YouTube, sans clé (identifiants de chaînes à fournir) | 1 h | `/`, `/moi`, `/asie`, `/liens`, `/now`, `/k15ze` |
| 1 (auto) | Dernier déploiement du site | date de build | à chaque build | `/a-propos` |
| 2 (déclaré) | « Cette semaine », « En préparation » | `now.json` versionné, tenu par Kenz (ou proposé par un agent et fusionné par Kenz) | à chaque merge | `/now` ; une ligne sur `/` et `/pro` si moins de 21 jours |
| 2 (déclaré) | Abonnés TikTok | saisie manuelle datée | mensuelle | `/asie`, `/collaborer` |
| 2 (option) | Abonnés YouTube | API YouTube, clé côté serveur | 24 h | `/collaborer` |

Pas de calendrier GitHub, pas de requêtes HEAD publiques, pas de santé d'API publique, jamais de position du moment.

### 5.2 Forme unique

Toute valeur affichée, live ou non : `{ v, statut, date, source }` (`content.js`, en-tête). La pastille de preuve (W3) et l'état live sont **le même composant**. Historique des versions : écrit à la main dans `apps[].versions` (l'API ne le donne pas).

### 5.3 Quatre états

| État | Condition | Affichage |
|---|---|---|
| En direct | relevé il y a moins de 2× la fréquence | valeur + « relevé il y a 2 h » |
| En retard | plus ancien | valeur en gris + « dernier relevé le 09/11 » |
| Indisponible | la source ne répond pas | dernière valeur connue + « source indisponible pour l'instant » |
| Vide | jamais rien eu | une phrase honnête ; jamais un 0, jamais un squelette sans fin |

L'état change **la forme** de l'indicateur (plein, contour, pointillé, absent), pas seulement sa couleur.

### 5.4 Dans les maquettes

Aucune requête réseau : les valeurs sont celles de `KENZ.live` (relevé du 11/11/2026), étiquetées « Simulé — relevé du 11/11/2026 ». Le panneau de simulation (§ 9.6) change l'état de chaque source et l'horloge.

---

## 6. La vitrine IA

Principe : le site d'un AI engineer **montre** de l'IA qui marche, **dit** où il n'y en a pas, **étiquette** ce qui est simulé. Le faux chat de la v2 disparaît.

### 6.1 `/pro/agents`, dans cet ordre

1. **Ouverture** : « Je mets en place des équipes d'agents IA qui travaillent comme une vraie équipe : chacun son rôle, une mémoire commune, et rien ne part sans votre validation. » + les 5 réponses « en 10 secondes » [`agents.enDixSecondes`].
2. **Ce que je peux mettre en place chez vous** : 6 cartes-problèmes [`agents.cas`], titre dans les mots du client, trame identique : le problème, ce que font les agents, ce que vous validez, ce que vous recevez, ce qui reste humain, la preuve publique → lien vers le cas.
3. **Composez votre équipe** (démo, étiquette fixe « Simulation — aucun agent ne tourne sur cette page ») : cocher 1 à 3 tâches [`agents.composer.taches`] → le schéma de la direction se construit (Hermes + rôles + Vous) → « Lancer » → le flux traverse les rôles, écrit dans la mémoire, s'arrête à **Validation humaine** (W6) avec 3 options numérotées (touches 1, 2, 3) → « Envoyer ce brief » ouvre `/pro/devis` pré-rempli. Liste équivalente au schéma pour les lecteurs d'écran ; journal `aria-live="polite"`.
4. **Ce que vous recevez à la fin d'une mission** [`agents.vousRecevez`].
5. **Ce que je n'automatise pas** : publier, envoyer en votre nom, payer ou acheter, déployer en production, décider à votre place. Bloc le plus visible après la démo.
6. **Comment on commence** : diagnostic → pilote → mise en place → suivi [`agents.formats`], « sur devis » ; installation en 5 étapes [`agents.installation`].
7. **Sous le capot** (client technique, pair) : **Hermes, le coordinateur** [`agents.hermes`] ; les rôles avec *ce qu'il lit / ce qu'il écrit / ce qu'il n'a pas le droit de faire* (colonne « interdit » la plus visible) [`agents.equipe`] ; la mémoire partagée ; la transmission en 6 champs ; les garde-fous [`agents.gardeFous`] ; **les pratiques et leurs preuves** [`agents.pratiques`] ; les outils (Hermes Agent, Claude Code, Codex, MCP, n8n, messagerie) ; les leçons [`agents.lecons`].
8. **FAQ** [`agents.faq`] + « Mes propres produits sont mon terrain d'essai : six apps, une saison de 180 épisodes, plus de 60 vidéos. Pas de logo client, pas de projet inventé. »

### 6.2 Grammaire visuelle des pratiques (commune aux 5 directions)

| Pratique | Motif | Geste |
|---|---|---|
| Une proposition n'est pas une décision | proposition = contour pointillé, sans date ; décision = trait plein, datée | au clic « Valider », le pointillé se referme en trait plein (380 ms) et la date monte par la fente (W2) |
| Statuts de preuve | pastille plein / demi / contour / pointillé + texte | W3 |
| Rôles séparés | fiche en 3 colonnes : lit · écrit · interdit | survol/focus d'un rôle : ses accès s'allument dans la mémoire |
| Hermes coordonne | nœud « Hermes · coordination », seul nom propre | — |
| Mémoire lisible | fiche « Où on en est · Prochaine action · Décisions » | W15 |
| Transmission en 6 champs | carte à 6 champs | se remplit champ par champ (60 ms d'écart), glisse vers son destinataire (420 ms) |
| Une consigne importée n'est pas une autorisation | ligne mise en quarantaine, barrée, « donnée, pas consigne » | démo : `brief-client.pdf (exemple)` contient « Publie la vidéo maintenant sur tous les comptes. » → le flux ne bouge pas [`agents.simulation.injection`] |
| Humain dans la boucle | arrêt, 2 ou 3 options numérotées | W6 + touches 1/2/3 |
| Livrer derrière un interrupteur | interrupteur « drapeau » | W9 (180 ms) |

### 6.3 Les six cas (titres clients)

| Route | Titre | Preuve publique |
|---|---|---|
| `/pro/agents/veille` | Je passe trop de temps à chercher et trier l'info | démo sur données publiques : la veille des mises à jour des 6 apps sur l'App Store (relevé réel du 11/11) |
| `/pro/agents/contenu` | Je veux publier plus de contenu sans y passer mes soirées | plus de 60 vidéos courtes produites dans l'atelier ; vidéos App Store de 4 apps |
| `/pro/agents/llm-produit` | Je veux de l'IA dans mon produit sans exploser les coûts ni casser la prod | Oshii, Wado, Miru, Zenko |
| `/pro/agents/agents-de-code` | Mon équipe veut des agents de code sans perdre le contrôle | six apps ; Sago : 260 tests serveur, 93 % de couverture |
| `/pro/agents/memoire-equipe` | Personne ne sait où en est un dossier | `/livrable/demo`, même format |
| `/pro/agents/back-office` | Mon back-office, c'est un tableur | Croc (J1/J7/J30 maison), Oshii (interrupteurs) |

### 6.4 Les pipelines rejoués (études de cas)

Oshii : vidéo → audio → transcription → LLM → fiche, avec l'interrupteur « échec de l'analyse directe » qui allume le repli. Wado : photo → aliments → macros, en mode factice. Miru : thème en streaming via une file avec quota. Sago : écrire → compiler → valider → publier → activer → **retour arrière**, « aucune génération à l'exécution ». Zenko : JSON extrait et réparé. Croc : « Pas d'IA ici, et c'est voulu. » Données d'exemple, étiquetées.

### 6.5 Le devis assisté (`/pro/devis`)

Le formulaire court part **d'abord** ; l'assistant propose ensuite un brief structuré (objectif, utilisateurs, existant, délais, budget indicatif, contraintes, risques, questions ouvertes), modifiable ; rien n'est envoyé avant « Valider ». Exemple fictif dans `services.devis.exemple`. Dans la maquette, le brief « s'écrit » champ par champ par la fente (pas de frappe caractère par caractère).

### 6.6 ⌘K

Palette locale, sans IA : aller à une page, une app, un cas, un guide ; changer de casquette ; copier le lien. Raccourci visible côté Pro ; loupe côté Créateur. Outil, jamais héros.

### 6.7 Ce qu'on ne fait pas

Un chat qui fait semblant ; des « agents en direct » qui n'en sont pas ; un terminal décoratif, du néon, un journal vert qui défile ; des portraits générés ; une IA qui répond sur la vie privée.

---

## 7. Les pages livrables

### 7.1 Pour les clients : `/livrable/demo`

Le même format que la mémoire d'équipe (c'est la preuve du cas `memoire-equipe`), pour un **client fictif**, « Studio Exemple », étiqueté « Exemple — client fictif » sur chaque écran [`livrableDemo`] :
- **Où on en est** : état daté, prochaine action, « À vous », limites ;
- **Décisions** : une ligne datée par arbitrage ;
- **Livrables** : brouillon → à valider → validé → en ligne ; « une preview n'est pas une publication » ;
- **Bouton « Valider »** sur chaque livrable « à valider » : il enregistre « Validé par Studio Exemple, le [date du jour] » (simulé, rien ne part) ;
- **Planning** par jalons ; **Risques et non-vérifiés** et leur parade ;
- état « lien expiré » simulable ; `noindex`.

### 7.2 Pour les abonnés

- **`/itineraire/chine`** (en ligne, URL conservée), **`/avant-de-partir/chine`** (Lot 2), **`/guides`** avec les « à venir » et leur déclencheur.
- **`/liens`** (Asie) et **`/k15ze`** (k15ze) : une page de liens par compte.
- **Alertes par guide** (« Préviens-moi quand il sort ») à la place d'une newsletter (G14).
- Ne jamais présenter les ebooks, une newsletter ou des produits en vente : ils n'existent pas.
- Uniquement du vécu validé par Kenz ; jamais une photo de banque présentée comme une preuve.

---

## 8. Règles de copie

### 8.1 La voix

- **Toujours « je »**. Oral, direct, court : **une phrase = une idée**. Le concret d'abord : un geste, un prix, un écran, un résultat.
- **Pro** : posé, vocabulaire de métier expliqué. **Vous** sur services, devis, agents, cas, livrable. « Je » + formulations neutres ailleurs.
- **Créateur** : **tu**, verdicts courts (JE CONSEILLE, FLOP, ABUSÉ comme tampons), humour situationnel, jamais forcé.
- **Communes** : neutres (« Un projet ? Une collab ? Une question voyage ? »).
- **Accords** : reprendre les formes du site actuel (« Développeur », « Créateur de contenu », « Globe Trotteur », « Athlète Hybride », « Passionné », « Classé 1ᵉʳ ») ; sinon tourner la phrase pour éviter l'accord (« en solo », « de bout en bout »). Les documents de travail écrivent « Kenz », sans pronom.
- **Les phrases de Kenz ne sont pas réécrites** (titres de vidéos, verdicts, prix vécus).

### 8.2 Interdits

« Passionné par la création d'expériences intuitives… », « Disponible pour de nouvelles opportunités », « solution innovante », « révolutionnaire », « n'hésitez pas », « commentez », toute question ouverte creuse, tout superlatif sans preuve, les emojis dans les titres (le drapeau est retiré à l'affichage, le titre exact reste dans le lien), « télécharge mon app » en gros bloc, « usine autonome », les chiffres du site actuel sans source.

### 8.3 Chiffres et dates

- Espace fine insécable avant `; : ! ?` et dans les guillemets (`KENZ.util.fr`). Milliers séparés par une espace : 725 600 ; millions : 7,83 M ; « ≈ » pour les approximations.
- Dates : 04/11/2026 ; relatif : « il y a 3 j » (`KENZ.util.relatif`, horloge simulée).
- Chaque chiffre porte sa pastille : « observé le 04/11/2026 · données publiques », « déclaré par Kenz le 09/10/2026 ».
- Prix vécus : « ce que ça m'a coûté », jamais un tarif.

### 8.4 Banque de micro-copie (commune aux 5 maquettes)

| Usage | Texte |
|---|---|
| CTA Pro | Demander un devis · Voir l'étude de cas · Sous le capot · Ce que j'en retiens · Envoyer ce brief · Imprimer le CV |
| Démos | Lancer la démo · Rejouer · Valider · Simulation — aucun agent ne tourne sur cette page · Exemple — client fictif |
| CTA Créateur | S'abonner · L'itinéraire · Voir la vidéo · Préviens-moi quand il sort · Passer |
| Point | côté créateur → · ← côté pro (nom accessible : « Passer côté créateur » / « Passer côté pro ») |
| Live | relevé il y a 2 h · dernier relevé le 09/11 · source indisponible pour l'instant · mis à jour le 11/11/2026 |
| Vides | Captures à venir · Pas encore de vidéo cette saison · Rien de nouveau publié cette semaine · La vidéo budget réel est en préparation |
| IA absente | Pas d'IA ici, et c'est un choix |

---

## 9. Le socle commun

### 9.1 Mouvement (tokens du Motion Lab de Kenz, traduits pour le web)

| Token | Valeur |
|---|---|
| `--ease-arrivee` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out) |
| `--ease-sortie` | `cubic-bezier(0.32, 0, 0.67, 0)` (power3.in) |
| `--ease-recadre` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| Arrivée | 500 ms × multiplicateur : Pro 600 ms, Créateur 400 ms |
| Sortie | 240 ms ; le texte sort 40 ms avant son conteneur |
| Mot à mot (titres Créateur) | flou 8 px → net, 140 ms par mot, 56 ms d'écart |
| Balayage doux (titres Pro) | révélation de gauche à droite, flou 6 px → 0, 600 ms, crénage conservé |
| Carte | +34 px, 0,965 → 1, 550 ms |
| Flèche | tracé 380 ms + pointe 140 ms |
| Coup de poing | Créateur seulement : +4 % puis se pose (200 ms), **un** par écran |
| Micro-interactions | 120 à 240 ms, jamais au-delà de 280 ms |
| Ressort | amortissement critique, sans dépassement (raideur 260, amortissement 34) |
| Parallaxe | 12 px au plus |

**Interdits** : rebond (sauf la mascotte de Croc), flottement, pulsation, boucle infinie, flash blanc ; « fondu + glissé vers le haut partout » ; zoom lent sur un titre ; transitions en masque ; néon ; chiffre géant sur dégradé ; compteurs qui défilent ; texte tapé caractère par caractère ; tilt au curseur ; plus d'**un** élément rouge à l'écran ; du jaune hors de l'énergique.
**Mouvement réduit** : chaque effet devient un fondu de 120 ms ou un état immédiat ; les effets liés au défilement sont coupés.

### 9.2 Typographie

- **Socle (toutes directions)** : **Inter** (axe `opsz` 14–32 : « Inter Display » = opsz 32) et **Instrument Serif** (romain pour les lieux, italique pour **un** mot par phrase, des deux côtés : c'est la voix de Kenz).
  `https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Instrument+Serif:ital@0;1&display=swap`
- Titres Pro : Inter opsz 32, 600, interlettrage −2 %. Titres Créateur : Inter opsz 32, 800, capitales serrées (−3 %). Deux graisses au plus par bloc.
- Chiffres : `font-feature-settings: "tnum", "zero"` pour les versions et les dates.
- **Une police d'accent par direction au plus** (§ 10). **Anton** seulement sur `/k15ze` (chiffres). Chinois et japonais : Noto Sans SC / JP avec `text=` (seulement les glyphes utiles : `北京重庆武隆上海深圳广州香港中国` et `東京大阪京都福岡熊本広島日本`).
- **Melodrama** (cible pour les lieux) : auto-hébergée plus tard si la licence web le permet ; dans les maquettes, Instrument Serif romain la remplace.

### 9.3 Composants communs (nommés comme les motions du lab)

| Code | Nom | Où | Spécification |
|---|---|---|---|
| W2 | La fente | chiffres, valeurs live, versions | l'ancienne valeur sort vers le haut (160 ms, sortie, flou 4 px) ; la nouvelle monte d'une fente (320 ms, arrivée), `overflow: clip` |
| W3 | La pastille de preuve | chiffres et statuts | forme selon le statut ; au survol/focus, un filet se trace sous le chiffre (200 ms, de gauche à droite) et l'étiquette glisse de 4 px ; jamais de compteur |
| W4 | Le prix barré | Créateur (prix vécus) | « 200 € » barré d'un trait tracé à la main (SVG, 280 ms) ; « 10 € » descend de 8 px et se pose en Instrument Serif italique (320 ms) ; HTML `<del>`/`<ins>`, SVG `aria-hidden` ; l'unique rouge |
| W5 | Le tampon | verdicts, validations | 1,04 → 1 en 160 ms, opacité 0 → 1, rotation fixe −4°, texture statique |
| W6 | L'arrêt obligatoire | démo agents, livrable | le flux s'arrête ; un anneau se trace **une fois** (1,2 s) ; rien ne part avant « Valider » ; options 1/2/3 au clavier |
| W9 | Le drapeau éteint | études de cas | interrupteur ; allumé, la fonction apparaît dans l'écran (180 ms) ; éteint, elle disparaît |
| W10 | La vue éclatée | « Sous le capot » | 5 plans (App · API · Données · IA · Infra) en CSS 3D ; 28 px d'écart, 60 ms de décalage, 480 ms ; clic → fiche du plan ; réduit : liste empilée. Chaque direction l'habille dans sa matière |
| W15 | La fiche « Où on en est » | agents, livrable, apps | tiroir ; entrées échelonnées de 40 ms ; date en tête |
| W8 | La coupe au mot | `/pro/video` | transcription d'exemple en `span` ; clic sur un mot → la timeline se coupe à cet endroit, le segment se referme en 240 ms |
| — | Le point | partout | `<a>` avec nom accessible ; état annoncé ; mène au hub d'en face ; libellé visible sur ordinateur |
| — | ⌘K, contact par intention, états live, panneau de simulation | partout | § 6.6, § 4.2, § 5.3, § 9.6 |

Les gestes exclusifs de chaque direction (W1, W7, W11–W14, W16 et les autres) sont au § 10.

### 9.4 Règles de la charte transposées

Crème, jamais de blanc pur, pour le texte posé sur une image ; **le texte ne passe jamais sur un visage** et une flèche s'arrête avant (zones de texte définies par image, `object-position` respecté) ; une ombre large et douce, jamais de contour ; un halo sombre très doux derrière le texte sur image ; la lueur forte sur un seul mot ; le verre seulement au-dessus d'une vraie image ; titre dans le tiers haut, conclusion dans le tiers bas, une marge commune ; aucun son.

### 9.5 Accents, saisons, k15ze

- **Deux tokens par accent** : `--accent` (matière, traits, 24 px et plus) et `--accent-texte` (4,5:1 au moins).
- **Accent de saison** (Créateur) : une saison ne change que son accent et son ouverture. Chine : trait `#E8322B`, texte `#C42A22` sur clair (4,95). Maurice : `#0F5D6B` sur clair (6,43–6,55), `#3FB0C2` sur sombre (6,30–7,58).
- **Sous-identité k15ze** (toutes directions, page `/k15ze`) : fond `#0D0F0E`, texte `#F7F7F2` (17,90), vert `#3DDC84` (10,78), secondaire `#9DA39F` (7,49) ; un mot vert en Instrument Serif italique avec une lueur douce ; chiffres en **Anton** ; rien du voyage. TikTok Sans en attente de licence (Inter à la place).
- **Couleurs d'app** : jamais en texte courant ; `--accent-texte` fourni dans `apps[].couleurs`. Wado et Croc n'ont pas d'icône dans `public/` : monogramme typographique sur leur couleur.

### 9.6 Le panneau de simulation (toutes les maquettes)

Un bouton système discret en bas à gauche, visuellement **hors du design** (gris neutre, police système), ouvre un panneau :
- **Sources live** : pour iTunes, RSS YouTube, now.json, déploiement : en direct / en retard / indisponible / vide ;
- **Horloge** : date simulée (défaut 11/11/2026 18:00), curseur de −30 à +60 jours, les dates relatives se recalculent ;
- **Montrer les trous** : révèle les champs `afficher: false` / « à confirmer » en contour pointillé avec leur question ;
- **Mouvement réduit** : force l'état réduit ;
- **Aperçu 390 px** : cadre la page à 390 px ;
- **Plan du site** : les 38 routes, cliquables, groupées par côté ;
- mention fixe : « Maquette — données relevées le 11/11/2026, aucune requête réseau ».

### 9.7 Contrat technique des maquettes

- Un fichier par direction : `maquettes/0N-slug.html`, CSS et JS **dans le fichier**, plus `<script src="_shared/content.js"></script>` avant le script de la page.
- **Routeur hash** : `#/…` pour les 38 routes de `KENZ.routes` ; `#/chine` redirige ; toute autre adresse → gabarit 404. Au changement de route : `document.title`, focus sur le `<h1>`, retour en haut, `data-cote` sur `<html>`.
- **Toutes les données viennent de `window.KENZ`** ; le HTML ne contient en dur que la micro-copie d'interface (§ 8.4). Images via `KENZ.util.src()`. Textes passés dans `KENZ.util.fr()`.
- **Aucune requête réseau** sauf Google Fonts (et, pour la direction 4 seulement, GSAP 3.12.5 depuis cdnjs sur `/moi` et `/asie`). Pas d'iframe YouTube ni TikTok : vignette locale + lien.
- **Tokens CSS** sur `:root[data-cote="pro"]`, `[data-cote="createur"]`, `[data-cote="commun"]` : `--fond`, `--surface`, `--encre`, `--texte-2`, `--filet`, `--accent`, `--accent-texte`, `--point`, `--mult` (1,2 / 0,8 / 1).
- **Mesure** : attribut `data-event` sur les éléments concernés : `porte_choisie`, `devis_ouvert`, `devis_envoye`, `collab_envoyee`, `cv_pdf`, `guide_ouvert`, `sortie_youtube`, `sortie_store`.
- **`@media print`** pour `/pro/cv` (le PDF vient de la page).
- **Aucun outil lourd** pour vérifier : `node --check` sur le JS extrait suffit ; ne lancer ni navigateur sans tête, ni serveur.

### 9.8 Checklist qualité commune (chaque maquette, avant livraison)

**Vérité et confidentialité**
- [ ] Aucun chiffre, statut ou fait hors de `content.js` ; aucun chiffre « à confirmer » visible hors du mode « trous ».
- [ ] Chaque chiffre a sa pastille (statut + date) ; aucun compteur qui défile.
- [ ] Aucun usage personnel des agents, aucun surnom d'agent, seul « Hermes » est nommé ; aucun détail d'infrastructure.
- [ ] Démos et livrable étiquetés « Simulation » ou « Exemple — client fictif » sur chaque écran concerné.
- [ ] Aucune capture V1 de Sago ; captures Miru légendées « avril 2026 » ; aucune image de `identite.images.aEviter`.
- [ ] Aucun texte qui attribue un genre à Kenz hors des formes du site actuel.

**Séparation des casquettes**
- [ ] Aucune vidéo de voyage dans la navigation Pro ; aucune app dans la navigation Créateur.
- [ ] Le point mène au hub d'en face, avec libellé visible et nom accessible ; rien n'est mémorisé.
- [ ] `/k15ze` n'a rien du voyage ; `/liens` ne parle pas de k15ze.
- [ ] Les deux côtés se distinguent en vignette floue (lumière, format, composition).

**Agents (demande de Kenz)**
- [ ] `/pro/agents` suit l'ordre du § 6.1 ; les 6 cas sont titrés dans les mots du client.
- [ ] « Ce que vous validez », « ce que vous recevez » et « ce que je n'automatise pas » sont visibles sans ouvrir d'accordéon.
- [ ] La démo s'arrête à « Validation humaine » et rien ne part avant « Valider » ; la démo d'injection ne fait pas bouger le flux.
- [ ] « Envoyer ce brief » pré-remplit `/pro/devis`.

**Mouvement**
- [ ] Arrivées en `--ease-arrivee`, sorties en 240 ms ; aucun rebond, aucune boucle, aucun flash.
- [ ] Un seul geste fort par écran ; un seul élément rouge par écran ; pas de jaune côté Pro.
- [ ] `prefers-reduced-motion` et le bouton du panneau : tout reste lisible et utilisable.

**Accessibilité**
- [ ] Contrastes : texte ≥ 4,5:1 (palettes du § 10, déjà calculées) ; accents en texte seulement via `--accent-texte`.
- [ ] Focus visible ; menus au clic et au clavier (`aria-expanded`, Échap) ; cibles de 44 px ; `lang="fr"`.
- [ ] Liste équivalente à chaque schéma ; journal en `aria-live="polite"` ; prix en `<del>`/`<ins>`.

**Mobile et poids**
- [ ] Aucune page ne défile horizontalement à 390 px (gouttière de 16 px) ; les deux portes de `/` tiennent sans scroll.
- [ ] `/liens` et les guides : ni rafale, ni scroll-snap pleine page, ni GSAP ; aucune requête Google ou YouTube hors polices.
- [ ] Images en `loading="lazy"` sauf la première ; aucune image de plus de 1920 px affichée en plein écran si elle fait moins.

**Live et états**
- [ ] Les 4 états de chaque source sont simulables et ont leur texte ; aucun squelette sans fin.
- [ ] Les 5 états des formulaires (envoi, succès, échec réseau, limite, assistant en pause) sont simulables.

---

## 10. Les cinq directions

Règle commune (04c) : **le socle est la personne** ; une direction ne change que la composition, la matière et ses gestes exclusifs. Chaque direction couvre les 38 routes ; le tableau « Gabarits » dit comment chaque famille de pages s'exprime. Les contrastes indiqués ont été calculés le 11/11/2026 (WCAG 2.x).

---

### 10.1 Direction 1 — « REC / PROD » · `01-rec-prod.html`

**Concept.** Le point de « Kenz. » devient tout le système : voyant **PROD** côté Pro, point **REC** d'une caméra côté Créateur. Chaque côté prend le format de sortie réel de Kenz : le posé en **16:9** (paysage, comme ses vidéos App Store), l'énergique en **9:16** (ses TikTok et Shorts). L'accueil pose une fenêtre 16:9 (la dernière mise en prod) et une fenêtre 9:16 (la dernière vidéo), de tailles différentes, avec le point entre les deux.

**Pourquoi ce n'est pas générique.** L'identité vient d'un interrupteur que Kenz a inventé et des deux intensités validées par sa charte ; pas de héros à dégradé, pas de page de statut (ni Geist Mono, ni voyant seul : PROD porte toujours une version et une date).

**Palette**

| Côté | Rôle | Hex | Contraste |
|---|---|---|---|
| Pro (toujours clair) | fond / surface | `#F5F3EE` / `#FBFAF7` | — |
| | encre / secondaire | `#16181C` / `#5D6168` | 16,03 / 5,61 |
| | filet | `#E3DFD7` | — |
| | PROD (≥ 24 px, non-texte) / PROD texte | `#1F8A5B` / `#17704A` | 3,91 / 5,48 |
| | bouton : crème sur | `#17704A` | 5,83 |
| | agents, Hermes (filets, libellés) | `#2E3A4A` | 10,40 |
| Créateur (nuit) | fond / surface | `#0E0D0C` / `#1A1918` | — |
| | crème / secondaire | `#F4EFE6` / `#A8A196` | 16,95 / 7,58 |
| | REC | `#FF5A1F` | 6,23 |
| | rouge de la charte (un seul élément) | `#E8322B` | 4,55 |
| | jaune (accroche seulement) | `#FFE600` | 15,32 |
| Commun | le Pro clair, avec les deux points visibles | — | — |

**Typos** : socle + **IBM Plex Mono** 500 pour le timecode uniquement (`family=IBM+Plex+Mono:wght@500&text=0123456789:`).

**Layout.** Pro : 12 colonnes, 1 320 px au plus, gouttière 24 px ; modules 16:9 (bandeaux 21:9 en tête sur ordinateur) ; 3:2 sur mobile ; navigation haute en texte. Créateur : sur ordinateur, une colonne 9:16 centrée (440 px au plus) entre deux **rails** — à gauche *le plan* (série, épisode, ville en Instrument Serif + nom chinois, date), à droite *ce que ça m'a coûté* (prix vécu, tampon) ; sur mobile, un fil vertical normal, barre basse au pouce ; aimantation seulement dans la galerie bornée de vidéos.

**Gabarits**

| Pages | Traitement |
|---|---|
| `/` | Fenêtre 16:9 (Oshii 2.0.2, version par la fente) à gauche, fenêtre 9:16 (dernière vidéo, vignette locale) à droite, plus haute ; le point entre les deux ; à 390 px : 16:9 en 3:2 au-dessus, 9:16 recadré en 4:5 dessous, sans scroll |
| `/now`, `/contact`, `/a-propos`, légales, 404 | Fond Pro clair ; `/now` en deux colonnes 16:9 / 9:16 ; tous les liens en liste à deux colonnes ; 404 = deux fenêtres vides avec leur point |
| `/pro` | Héros posé (balayage doux) ; trois portes : liste des versions live (lignes 16:9 fines), mini-timeline à pistes jouable, phrase + bouton ; frise horizontale des mises en prod |
| `/pro/apps`, `/pro/apps/[app]` | Registre en lignes larges ; l'étude de cas s'ouvre sur un bandeau 21:9 aux couleurs de l'app ; captures verticales dans des cadres 16:9 (W « la capture monte ») ; vue éclatée W10 en plaques fines |
| `/pro/agents`, `[cas]` | **W7 timeline à pistes** plein largeur ; les cas filtrent les pistes |
| `/pro/video` | Timeline de montage + W8 coupe au mot (cohérent : c'est la même grammaire) |
| `/pro/services`, `/pro/devis` | Colonnes posées ; devis en deux temps, le brief se remplit par la fente |
| `/pro/cv` | 16:9 en tête (résumé 60 s), puis grille de compétences → preuves ; impression propre |
| `/livrable/demo` | Pro clair ; jalons en mini-timeline ; « Valider » = le point qui s'étire |
| `/moi` | Nuit ; fil 9:16 ; vidéo du moment dans le cadre REC (W16 bis) ; univers en vignettes 9:16 |
| `/asie`, `/asie/chine` | Frise des saisons en bandes 9:16 horizontales ; carte simple ; rails plan / coût sur ordinateur ; prix vécus W4 dans le rail droit |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine` | Sans timecode ni aimantation ; colonne lisible ; jours en cartes 9:16 courtes ; checklist cochable |
| `/k15ze` | Sous-identité k15ze dans le cadre 9:16 ; chiffres Anton ; « Mes courses » en trois cadres verticaux |
| `/liens` | Une colonne 9:16 de liens ; aucun effet lourd |
| `/collaborer` | Nuit ; chiffres en grand dans des cadres 9:16 ; formats en trois vignettes verticales |

**Micro-interactions signature**
1. **W1 L'iris du point.** Au clic, Entrée ou Espace : la page se referme en iris vers les coordonnées du point (`clip-path: circle()`, 240 ms, `--ease-sortie`) ; fermé, le point passe de PROD à REC en 80 ms ; l'iris se rouvre depuis le point sur le hub d'en face (400 ms vers le Créateur, 600 ms vers le Pro, `--ease-arrivee`). Entre les deux, le fond de la page d'arrivée, jamais de blanc. Réduit : fondu 120 ms. Variante B à tester : flou directionnel (−24 px, flou 8 px).
2. **W16 Le timecode.** Côté Créateur, `00:00:14:08` en haut à droite (IBM Plex Mono, chiffres tabulaires) calculé depuis la position de défilement à 25 images/s ; aucune boucle, rien ne bouge si on ne défile pas. Quand une vidéo s'aimante dans la galerie bornée, son titre arrive mot à mot (56 ms d'écart), les rails changent par la fente, et les vues prennent le coup de poing (+4 %, 200 ms).
3. **Le point s'étire en bouton.** « Demander un devis » (PROD) et « S'abonner » (REC) : au survol ou au focus, le point de 10 px s'étire en pilule à la largeur du libellé (280 ms, `--ease-arrivee`), le libellé arrive 60 ms après ; retour en 200 ms.
4. **La capture monte dans la carte.** Au survol ou au focus d'une ligne d'app, sa capture verticale monte de 34 px dans le cadre 16:9 et se pose (0,965 → 1, 480 ms) ; la ligne d'état « v2.0.1 · 30/10 » change par la fente (W2).
5. **W7 La timeline à pistes.** Pistes : Hermes (maîtresse, en haut), Produit & code, Contenu, Veille, Relecture, puis **Vous** en bas. Les tâches sont des clips, les transmissions des liens entre clips, les validations des marqueurs sur la piste Vous. « Lancer » : la tête de lecture avance (300 ms par segment, linéaire), s'arrête à chaque marqueur (W6) jusqu'à « Valider » ; Espace = lecture/pause, 1/2/3 = options. Liste équivalente dessous.
6. **Le cadre REC.** Quand la vidéo du moment entre à l'écran (`/moi`, `/liens` exclu), quatre équerres de viseur se posent autour d'elle (220 ms, `--ease-arrivee`), avec « REC · 31/10/2026 » ; jamais clignotant.

**Mouvement.** Pro : arrivées 600 ms, aucun coup de poing, balayage doux sur les titres. Créateur : arrivées 400 ms, coupes franches, un coup de poing par écran. Sorties 240 ms partout.

**Séparation.** Format (16:9 / 9:16), lumière (papier / nuit), couleur et sens du point, navigation (haute en texte / basse au pouce), ton (vous / tu).

**Skill à charger** : `design-taste-frontend` (vérification avant livraison, refus des schémas de portfolio).

**Risques.** Colonne 9:16 vide sur grand écran (les rails la remplissent) ; iris perçu comme un masque (DA-1, variante B prête) ; Créateur nuit proche du site actuel (texte crème, vraies images, aucun halo ni grille).

---

### 10.2 Direction 2 — « Carnet » · `02-carnet.html`

**Concept.** Tout le travail de Kenz repose sur une mémoire écrite : une fiche par projet qui commence par « Où j'en suis », des décisions datées, un statut sur chaque fait. Côté **Pro**, le site est un **carnet d'atelier** : chaque page est une feuille datée, les marges portent les sources, l'index des apps est un **registre**. Côté **Créateur**, le carnet s'efface derrière **l'image annotée** : des images plein cadre et, par-dessus, la couche d'annotations des montages de Kenz (flèche tracée à la main qui s'arrête avant le visage, prix barré, tampon, nom du lieu).

**Pourquoi ce n'est pas générique.** La signature visuelle **est** la discipline de preuve de Kenz — l'argument le plus fort pour un client qui veut des agents fiables, et le même format que le livrable client.

**Palette**

| Côté | Rôle | Hex | Contraste |
|---|---|---|---|
| Pro | papier / feuille | `#F2EDE3` / `#FAF7F1` | — |
| | encre / graphite | `#111013` / `#5C5853` | 16,25 / 6,05 |
| | filet / quadrillage | `#D9D2C5` / `#E6DFD2` | — |
| | stylo bleu (annotations, point) | `#2B4C9B` | 6,90 (7,53 sur feuille) |
| | vert prod | `#2F6B4F` | 5,39 |
| Créateur | cadre image / encre | `#111013` | — |
| | texte sur image : crème | `#F4EFE6` | 16,56 sur encre (+ halo doux sur image) |
| | papier des sections texte | `#F2EDE3` | — |
| | rouge trait (un seul, ≥ 24 px) / rouge texte | `#E8322B` / `#B92A20` | 3,66 / 5,27 |
| | moutarde aplat (encre dessus) / moutarde texte | `#F2C14E` / `#7D5A10` | 11,30 / 5,39 |
| Commun | papier uni, sans quadrillage | — | — |

**Typos** : socle + **IBM Plex Mono** 400/500 pour les dates, statuts et références de marge (Pro). Les annotations « à la main » sont des tracés SVG, jamais une police manuscrite.

**Layout.** Pro, ordinateur : trois colonnes — marge de notes 200 px, texte 640 px, colonne de preuves et liens 280 px ; ligne de base de 8 px ; quadrillage de 8 px très léger. Mobile : notes de marge repliées sous leur paragraphe. Navigation Pro : table des matières collante à gauche (ordinateur), barre en haut (mobile). Créateur : images plein cadre (100vw) avec zones de texte définies, sections de texte sur papier ; onglets-intercalaires en haut sur ordinateur, barre basse sur mobile.

**Gabarits**

| Pages | Traitement |
|---|---|
| `/` | À gauche une feuille Pro (étroite, quadrillée, la ligne « Oshii 2.0.2 · 04/11 » au stylo) ; à droite une image annotée (plus grande, la flèche vers le titre de la dernière vidéo) ; à 390 px : feuille compacte au-dessus, image dessous |
| `/now`, `/contact`, `/a-propos`, légales, 404 | Papier uni ; `/now` = une double page de carnet (Pro à gauche, Créateur à droite) ; tous les liens comme un index ; 404 = feuille arrachée, deux renvois |
| `/pro` | Feuille datée « état au 11/11/2026 » ; trois portes : registre des versions, aperçu du dossier de transmission, phrase + bouton ; frise en marge |
| `/pro/apps`, `/pro/apps/[app]` | **Registre** : une ligne par app (sortie, version, statut, IA oui/non, prochaine étape) qui s'ouvre en tiroir sur sa fiche (W15) ; étude de cas en feuille longue, sources en marge, vue éclatée W10 en feuillets superposés |
| `/pro/agents`, `[cas]` | **Le dossier de transmission** : une colonne par rôle, des cartes de transmission à 6 champs ; validation = tampon daté (W5) |
| `/pro/video` | Feuille « circuit » ; W8 sur une transcription annotée |
| `/pro/services`, `/pro/devis` | Offres en lignes de registre ; devis = une fiche que le brief remplit ligne par ligne |
| `/pro/cv` | Feuille A4 à l'écran, prête à imprimer ; chaque compétence a son renvoi de marge vers la preuve |
| `/livrable/demo` | La fiche « Où on en est » complète, tampons de validation : la direction la plus convaincante pour ce gabarit |
| `/moi` | Grande image annotée (Moi-pp, flèche qui s'arrête avant le visage) ; univers en images annotées |
| `/asie`, `/asie/chine` | Images plein cadre des pays (origine à confirmer, mention dans le mode trous) ; carte tracée à la main ; prix barrés W4 ; tampons de verdict |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine` | Papier, colonne lisible ; itinéraire en tracé pointillé sur 3 bases ; checklist cochée au stylo |
| `/k15ze` | Sous-identité k15ze ; HYROX en image annotée (« 8 stations, 8 km ») |
| `/liens` | Papier, liens comme lignes d'index ; aucune annotation animée |
| `/collaborer` | Fiche média : chiffres datés en marge, études de cas annotées |

**Micro-interactions signature**
1. **Le quadrillage se retire (le point).** Pro → Créateur : une vingtaine de filets du quadrillage se rétractent vers la marge (`scaleX` 1 → 0, 8 ms d'écart, 300 ms au total, `--ease-sortie`) ; le point passe du bleu au rouge ; la page Créateur entre avec le token carte (+34 px, 0,965 → 1, 550 ms). Créateur → Pro : les filets se redessinent depuis la marge (400 ms, `--ease-arrivee`). Réduit : fondu.
2. **W15 La fiche « Où on en est » en tiroir.** Au survol d'une ligne du registre, le tampon de date se déplie en mono (« état au 11/11/2026 », 200 ms) ; au clic, le tiroir s'ouvre, entrées échelonnées de 40 ms ; « Prochaine action » se souligne d'un trait à la main (380 + 140 ms).
3. **W14 Le renvoi de marge.** Ordinateur : survoler ou focaliser une note de marge trace une flèche jusqu'à l'élément cité (380 ms + pointe 140 ms) ; la quitter l'efface (240 ms, `--ease-sortie`). Mobile : la note se replie sous son paragraphe.
4. **La transmission qui se remplit.** Dans le dossier de transmission, « Lancer » fait remplir une carte champ par champ (contexte → décisions → résultat + preuve → limites → prochaine action → destinataire ; 60 ms d'écart, chaque champ par la fente), puis la carte glisse vers la colonne du destinataire (420 ms) ; à la colonne Vous, le flux s'arrête (W6) et la validation pose un tampon daté.
5. **L'annotation qui se trace.** Quand une image plein cadre entre à l'écran, la flèche se trace vers le sujet (380 + 140 ms) et s'arrête avant le visage ; puis le nom du lieu se pose par balayage doux. Une seule annotation animée par écran.
6. **W4 Le vrai prix** (Créateur, `/asie/chine` et guides), comme au § 9.3, en encre de tampon.

**Mouvement.** Calme : les seules mises en scène sont des **tracés** (traits, flèches, ratures), de 200 à 550 ms, en `--ease-arrivee`. Rien ne bouge seul.

**Séparation.** Matière (feuille quadrillée / image plein cadre), encre (stylo bleu / tampon rouge), navigation (table des matières / intercalaires), ton.

**Skill à charger** : `minimalist-ui`.

**Risques.** Effet « modèle Notion » côté Pro (le casser par la marge et les tracés) ; annotations trop nombreuses (une par écran) ; images de destination d'origine incertaine (DA-7 : exports de Kenz attendus).

---

### 10.3 Direction 3 — « Lignes » · `03-lignes.html`

**Concept.** Kenz vit sur des lignes. Côté **Pro**, les pipelines et les livraisons : compile → valide → publie → active ; migration → serveur → contenu → build ; et l'équipe d'agents, une ligne avec un **arrêt obligatoire**, « Validation humaine ». Le Pro est un **plan de lignes** en signalétique suisse : P1 Apps, P2 Agents, P3 Services, P4 Vidéo ; chaque page est une station. Côté **Créateur**, une **carte géographique** de l'Asie en pointillés tracés à la main, avec des tampons de ville — **un autre dessin, une autre page, jamais le même SVG** que le plan Pro.

**Pourquoi ce n'est pas générique.** La navigation est la métaphore, et la métaphore vient des itinéraires et des pipelines documentés de Kenz ; les codes de lignes reprennent sa manie de nommer ses motions (O1, R5…).

**Palette**

| Côté | Rôle | Hex | Contraste |
|---|---|---|---|
| Pro | fond / encre / gris texte | `#F7F7F4` / `#0F1012` / `#62656B` | — / 17,74 / 5,45 |
| | filet | `#DCDDD8` | — |
| | P1 Apps | `#2D52C4` | 6,28 (crème dessus 6,28) |
| | P2 Agents | `#3E4A5C` | 8,37 |
| | P3 Services | `#4D7A59` | 4,61 (crème dessus 4,61) |
| | P4 Vidéo | `#7A3E6A` | 7,18 (crème dessus 7,18) |
| | arrêt « Validation humaine » | anneau encre `#0F1012`, cœur `#F7F7F4` | — |
| Créateur | fond crème / encre / secondaire | `#F4EFE6` / `#1A1918` / `#6B655C` | — / 15,33 / 5,04 |
| | saison active Chine : trait / texte | `#E8322B` / `#C42A22` | 3,73 / 4,95 |
| | saison Maurice | `#0F5D6B` | 6,55 |
| Commun | fond Pro, sans lignes de couleur | — | — |

Les codes de lignes (P1–P4) sont en crème dans une pastille de la couleur de la ligne, et chaque ligne a aussi une **forme** (plein, double, tireté, pointillé) pour les daltoniens.

**Typos** : socle + **Archivo** semi-condensé pour les noms de stations (`family=Archivo:wdth,wght@75..100,500..700`) ; horaires et dates en chiffres tabulaires ; Noto Sans SC / JP en `text=` pour les sous-titres de villes.

**Layout.** Grille stricte de 8 px. Pro : tracés à 45° et 90° ; `/pro` = le plan en SVG plein écran sur ordinateur **+ une liste équivalente** ; sur mobile, un **diagramme de ligne vertical** (comme au-dessus des portes d'un train). Chaque page Pro = une station : en-tête (nom en Archivo, ronds des lignes desservies, **tableau des départs** live), puis le contenu en colonnes éditoriales. Créateur : la carte en tête de `/moi` et `/asie`, puis des pages éditoriales.

**Gabarits**

| Pages | Traitement |
|---|---|
| `/` | À gauche un fragment du plan Pro (la ligne P1 et sa dernière station « Oshii 2.0.2 · 04/11 ») ; à droite un fragment de carte (Pékin → Chongqing → Shanghai, la dernière vidéo) ; deux dessins incompatibles, côte à côte ; à 390 px : deux bandes |
| `/now`, `/contact`, `/a-propos`, légales, 404 | `/now` = **tableau des départs** à deux sections (Pro / Créateur), états « à l'heure / retard / supprimé / pas de service » ; tous les liens en tableau ; 404 = « Station inconnue », deux correspondances |
| `/pro` | Le plan (P1–P4) avec liste équivalente ; trois portes = trois lignes ; frise des mises en prod = la ligne P1 qui s'allonge |
| `/pro/apps`, `/pro/apps/[app]` | Registre = ligne P1 verticale, une station par app ; étude de cas = station, avec la **ligne de déploiement** de l'app (migration → serveur → contenu → build pour Sago, etc.) et W10 en coupe de station ; section Lab = l'ouverture des lignes 2025 → 2026 |
| `/pro/agents`, `[cas]` | **La ligne avec arrêt obligatoire** ; « Composez votre équipe » ajoute des stations-rôles à la ligne P2 |
| `/pro/video` | Ligne P4 : le circuit en 7 stations ; W8 sous la ligne |
| `/pro/services`, `/pro/devis` | Ligne P3 : process en 5 stations ; le devis est un « billet » qui se remplit |
| `/pro/cv` | Le réseau comme CV : chaque compétence est desservie par les lignes qui la prouvent |
| `/livrable/demo` | La ligne du projet client : diagnostic → pilote → mise en place → passation, arrêts de validation |
| `/moi` | Carte de l'Asie, une saison active ; univers en légende de carte |
| `/asie`, `/asie/chine` | Carte aux tampons ; frise des saisons en légende chronologique ; Chine = trajet Pékin → Chongqing (+ Wulong) → Shanghai, prix vécus le long du trajet (W4) |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine` | Itinéraire = trajet en 3 bases, statique et lisible (aucun tracé lié au défilement) ; checklist en « avant l'embarquement » |
| `/k15ze` | Sous-identité k15ze ; pas de carte (k15ze n'est pas un lieu) : un **tableau de séance** en chiffres Anton ; « Mes courses » en trois stations sportives |
| `/liens` | Liste simple, ronds de ligne en puces ; aucun SVG lourd |
| `/collaborer` | Fiche station « Kenz en Asie » : chiffres datés en tableau des départs |

**Micro-interactions signature**
1. **L'aiguillage (le point).** Sous le wordmark, un court tronçon de 64 px passe d'un tracé orthogonal (Pro) à une courbe géographique (Créateur) par interpolation de chemin SVG (mêmes points de contrôle, 400 ms, `--ease-arrivee`) ; le point passe de l'anneau encre à l'accent de saison ; la page sort en 240 ms et le hub d'en face arrive (600 / 400 ms). Réduit : changement immédiat.
2. **Survol d'une ligne** (plan Pro, aussi au focus et au toucher). Les autres lignes passent à 20 % d'opacité (180 ms) ; les stations de la ligne affichent leur nom en cascade (30 ms d'écart).
3. **La rame** (seulement sur `/pro`, la page du plan). Au clic sur une station, une pastille parcourt la ligne jusqu'à elle (120 ms par station, 300 ms minimum, 700 ms maximum, linéaire puis `--ease-arrivee` à l'arrivée), puis la page s'ouvre. Partout ailleurs, les liens mènent directement à la page.
4. **W6 L'arrêt obligatoire.** Dans la démo, la rame s'arrête à « Validation humaine » ; un anneau se trace une fois (1,2 s) ; le segment suivant reste en **pointillé** tant qu'on n'a pas cliqué « Valider », puis se trace en plein (300 ms). La démo d'injection montre la rame immobile, la ligne suspecte barrée en quarantaine.
5. **Le tableau des départs.** Sur `/now` et dans chaque en-tête de station, les valeurs changent par la fente (sortie 160 ms, entrée 280 ms), sans palettes qui claquent ni son ; les états live deviennent « à l'heure », « retard », « supprimé », « pas de service », chacun avec sa forme.
6. **Le tampon de ville** (carte Créateur). En défilant la section carte (liée au défilement, bornée à la section), le trajet se trace et chaque ville reçoit son tampon (W5 : 1,04 → 1 en 160 ms) avec sa phrase-verdict validée ; les tampons « JE CONSEILLE » ne sont posés que sur les verdicts marqués `tamponPropose`.

**Mouvement.** Mécanique mais doux : trajets linéaires, arrivées en `--ease-arrivee`, de 180 à 700 ms. Réduit : la rame saute, les lignes restent fixes.

**Séparation.** Dessin (orthogonal / géographique), couleurs (famille d'encres / une saison), pages (plan / carte), ton.

**Skill à charger** : `frontend-design:frontend-design`.

**Risques.** Métaphore fatigante (les pages restent lisibles comme des pages normales) ; plan complexe sur mobile (diagramme vertical obligatoire) ; dérive « geek » (pas de mono, pas de terminal).

---

### 10.4 Direction 4 — « Épisode » · `04-episode.html`

**Concept.** Côté **Créateur**, la grammaire validée de Branche-toi : saisons, épisodes (第N話), générique **rafale**, tampons de verdict, affiche **WANTED** pour s'abonner ; chaque page est une **planche de manga** — cases asymétriques, gouttières d'encre sur papier. Côté **Pro**, aucun vocabulaire de série : **la fiche technique**. Chaque projet est présenté comme la fiche technique d'un film — format, sortie, version, langues, IA, stack — et finit par **des crédits honnêtes** : qui a fait quoi, quelle part revient aux agents, qui a validé. Les crédits sont la démonstration la plus directe de l'humain dans la boucle.

**Pourquoi ce n'est pas générique.** Le Créateur vient des formats réels de Kenz (rafale, WANTED, tampons, saisons rangées par séries) ; le Pro transforme la transparence sur les agents en signature visuelle.

**Palette** (la lumière s'inverse par rapport aux autres directions : salle de projection côté Pro, papier de manga côté Créateur)

| Côté | Rôle | Hex | Contraste |
|---|---|---|---|
| Pro (noir film) | fond / surface | `#0B0B0C` / `#161514` | — |
| | crème / gris | `#F4EFE6` / `#9C978F` | 17,18 / 6,78 |
| | filet | `#2A2826` | — |
| | corail (unique accent, point PROD) | `#F0705A` | 6,72 (6,23 sur surface) |
| Créateur (papier manga) | papier / encre (gouttières) | `#F2EDE3` / `#0E0D0C` | — / 16,64 |
| | secondaire | `#5C5853` | 6,05 |
| | jaune accroche (aplat, encre dessus) | `#FFE600` | 15,32 |
| | rouge (un seul élément, ≥ 24 px) | `#E8322B` | 3,66 |
| | moutarde (aplat) | `#F2C14E` | — |
| | lagon Maurice | `#0F5D6B` | 6,43 |
| Commun | le papier Créateur, sans cases | — | — |

**Typos** : socle (titres Créateur en Inter 800 capitales serrées ; Pro en Inter 500–600) + **Bebas Neue** pour les tampons seulement + **Dela Gothic One** pour 第N話 seulement (`family=Dela+Gothic+One&text=第話一二三四五六七八九十`). Exception documentée à « une police d'accent » : Dela est réduite à 12 glyphes.

**Layout.** Créateur : sections plein cadre ; temps forts en cases asymétriques (gouttières d'encre de 8 px) ; sur mobile, cases verticales ; épisodes en **bande horizontale** à `scroll-snap` natif (galerie bornée). Pro : bandeaux 2,39:1 très aérés ; fiches techniques en deux colonnes (libellé à droite, valeur à gauche, axe central) ; navigation haute en texte crème.

**Gabarits**

| Pages | Traitement |
|---|---|
| `/` | Une planche : la grande case Créateur (dernière vidéo, titre en capitales) et, dans une case noire plus étroite, la fiche technique d'Oshii 2.0.2 ; à 390 px : deux cases empilées sans scroll |
| `/now`, `/contact`, `/a-propos`, légales, 404 | Papier ; `/now` = « Précédemment » (Créateur) et « En production » (Pro, case noire) ; tous les liens en index de planche ; 404 = case vide « Épisode introuvable » côté papier |
| `/pro` | Noir film ; héros posé ; trois portes en bandeaux 2,39:1 ; frise des mises en prod comme une liste de sorties (dates, plateformes), sans « arcs » |
| `/pro/apps`, `/pro/apps/[app]` | Registre en bandeaux 2,39:1 ; étude de cas = fiche technique + récit + vue éclatée W10 (plans sur fond noir) + **crédits** |
| `/pro/agents`, `[cas]` | **La feuille de service** (le planning de tournage) : lignes = rôles, colonnes = étapes ; crédits de l'équipe en fin de page |
| `/pro/video` | Fiche technique du circuit ; W8 sur une bande de montage noire |
| `/pro/services`, `/pro/devis` | Fiches posées ; le devis devient la « fiche technique » du projet du client |
| `/pro/cv` | Filmographie : six apps, dates de sortie, rôles ; impression sur fond clair |
| `/livrable/demo` | Fiche technique du projet client + crédits + tampon « Validé » |
| `/moi` | **Rafale** (une fois par visite) puis la planche ; WANTED en bas |
| `/asie`, `/asie/chine` | Saisons en cases ; bande d'épisodes ; accent de saison ; prix vécus en bulles de case avec W4 ; tampons Bebas Neue |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine` | **Ni rafale ni GSAP** ; planche simple et lisible ; jours en cases numérotées 第1話 à 第14話 seulement si lisible, sinon « Jour 1 » |
| `/k15ze` | Sous-identité k15ze, cases sombres ; « Mes courses » en trois cases |
| `/liens` | Papier, liste de cases, aucun effet |
| `/collaborer` | Planche « fiche du personnage » : chiffres datés, formats intégrables en trois cases |

**Micro-interactions signature**
1. **Arrêt sur image ↔ déclencheur (le point).** Créateur → Pro : l'image se fige et se désature de 30 % (200 ms), le point REC devient un carré « stop » (120 ms) puis le voyant corail, la page Pro entre en 600 ms. Pro → Créateur : un déclencheur photo — deux lames d'encre qui se ferment et s'ouvrent (90 ms + 90 ms), **une seule fois**, sans flash blanc — découvre la page Créateur. Réduit : fondu.
2. **W12 La rafale corrigée** (`/moi`, une fois par visite, après le premier affichage). 7 plans locaux (`createur.asie.pays[].image` + portrait créateur + HYROX), coupes franches de 300 à 370 ms (2,6 s au plus), les lames ne jouent qu'une fois juste avant le titre ; la dernière image ralentit et le titre se pose en 500 ms ; bouton « Passer » ; si les images ne sont pas chargées à temps, l'image finale directement ; réduit : l'image finale.
3. **W13 WANTED.** Quand le bas de `/moi` ou de `/asie` arrive à l'écran, une seule fois : l'affiche entre (rotateX 12° → 0°, translateY 40 → 0 px, 600 ms, `--ease-arrivee`), puis se colle (ombre de 2 px en 120 ms) ; vraie photo de Kenz, phrase de Kenz ; aucun élément de marque d'anime ; « S'abonner » reste un lien normal à tout moment.
4. **La bande d'épisodes.** Sur `/asie`, chaque saison est une bande horizontale à `scroll-snap` natif ; un en-tête collant « ép. 12 / 46 » est mis à jour par `IntersectionObserver`, le numéro change par la fente et 第N話 s'affiche en Dela Gothic One.
5. **Les crédits honnêtes** (Pro). En fin d'étude de cas, de `/pro/agents` et du livrable, un générique posé **suit le défilement** (aucun défilement automatique) : rôles alignés sur un axe central, chaque ligne monte par la fente quand elle entre ; les lignes « agent · rôle » portent un liseré corail ; la dernière ligne est toujours humaine (« Mise en production : Kenz · 30/10/2026 », « Validé par : vous »).
6. **La feuille de service** (`/pro/agents`). « Lancer » fait avancer une barre verticale colonne par colonne (300 ms par colonne) ; chaque cellule active s'éclaire ; à la colonne « Validation », la ligne **Vous** s'allume et attend (W6), avec les options 1/2/3.

**Mouvement.** Créateur énergique (×0,8, coupes de 90 à 160 ms, un coup de poing par écran) ; Pro posé (×1,2, aucun coup de poing). GSAP 3.12.5 (cdnjs) autorisé sur `/moi` et `/asie` seulement ; tout le reste en CSS et JS natif.

**Séparation.** Lumière inversée (salle noire / papier), composition (bandeaux 2,39:1 / cases), vocabulaire (fiche technique, crédits / saisons, épisodes), typo (Inter posé / capitales, tampons, 第N話).

**Skill à charger** : `gpt-taste`, en **retirant** l'épinglage, l'empilement, la structure AIDA et les bentos (contraires à 04b et 04c) ; garder sa rigueur GSAP et sa composition éditoriale.

**Risques.** Pro sombre comparé au site actuel (noir chaud, crème, un corail, aucun halo ni grille) ; poids des images de la rafale (40 Ko max chacune) ; références d'anime (on garde l'idée, jamais la marque) ; peu de vrais plans exportés (DA-7).

---

### 10.5 Direction 5 — « Matière » · `05-matiere.html`

**Concept.** Le Motion Lab de Kenz a validé de vraies matières : objets doux en pâte, verre épais pour les titres, lumière de studio [Validé 07–08/11]. Le site devient une **table de studio**. Côté **Pro**, lumière froide de jour : chaque app est un **objet posé** (son icône réelle en relief, ou une plaque à sa couleur pour Wado et Croc) et « Sous le capot » s'ouvre en **vue éclatée**. Côté **Créateur**, la référence de Kenz, « pâte pastel sur bleu nuit » : des **objets-preuves** qui portent chacun un prix vécu, et du verre seulement au-dessus d'une vraie image.

**Pourquoi ce n'est pas générique.** Les matières, la règle « le verre seulement pour les titres », la référence bleu nuit et les prix vécus sont ceux de Kenz ; pas de tilt, pas de bento, pas de glassmorphism sur fond uni.

**Palette**

| Côté | Rôle | Hex | Contraste |
|---|---|---|---|
| Pro (studio jour) | fond / surface | `#ECEFEC` / `#F7F8F6` | — |
| | encre / secondaire | `#1B1D1C` / `#555B57` | 14,63 / 6,00 |
| | sauge matière / sauge texte | `#5E7D6A` / `#48654F` | 3,93 / 5,58 |
| | ombre de contact | `rgba(27,29,28,0.12)` | — |
| Créateur (bleu nuit) | fond / surface | `#16203A` / `#1E2A47` | — |
| | crème / secondaire | `#F4EFE6` / `#A9B2C6` | 14,08 / 7,58 (12,41 / 6,68 sur surface) |
| | corail (point, matière, texte ≥ 18 px) | `#F0705A` | 5,51 |
| | pêche | `#F6B48F` | 9,10 |
| | doré (décor) | `#C9A45C` | 6,87 |
| | verre (au-dessus d'une image) | `rgba(28,27,26,0.42)`, flou 26 px, liseré blanc 16 % | — |
| Commun | le studio jour | — | — |

**Typos** : socle seulement — « la matière est l'accent ». Anton sur `/k15ze`.

**Layout.** Chaque section est un **plateau** 16:10 avec **un** objet héros et beaucoup d'air ; les apps sont posées sur une **étagère** (une rangée, dans l'ordre de sortie), jamais un bento ; sur mobile, un objet par écran. Objets en CSS : icône réelle sur une plaque à coins doux, ombre de contact en deux couches, reflet discret ; objets-preuves Créateur en formes CSS douces (dégradés radiaux mats), étiquetés « rendu provisoire » dans le mode trous, en attendant les WebP exportés par Kenz (DA-4).

**Gabarits**

| Pages | Traitement |
|---|---|
| `/` | Un plateau coupé par la lumière : à gauche l'objet Oshii (icône en relief, version par la fente), à droite un objet-preuve sur bleu nuit (« 10 € », la dernière vidéo) ; tailles différentes ; à 390 px : deux plateaux empilés |
| `/now`, `/contact`, `/a-propos`, légales, 404 | Studio jour ; `/now` = deux plateaux (Pro froid, Créateur nuit) ; tous les liens en étiquettes ; 404 = plateau vide, deux objets à saisir |
| `/pro` | L'étagère de progression (W « étagère ») ; trois portes = trois objets (le registre, une maquette d'équipe éclatée, un objet vidéo) |
| `/pro/apps`, `/pro/apps/[app]` | Étagère + registre lisible dessous ; étude de cas = un plateau par section, **W10 vue éclatée** en vraies plaques épaisses avec ombres |
| `/pro/agents`, `[cas]` | **La vue éclatée d'une équipe** : 5 plans — Vous (validation), Hermes, les rôles, la mémoire, les garde-fous |
| `/pro/video` | Plateau « table de montage » ; W8 sur une bande posée |
| `/pro/services`, `/pro/devis` | Offres en objets étiquetés ; le brief se dépose plaque par plaque |
| `/pro/cv` | Plateau sobre, compétences en plaques ; impression sans ombres |
| `/livrable/demo` | Plateau client : fiche « Où on en est » en plaque, livrables posés avec leur état, tampon de validation |
| `/moi` | Bleu nuit ; portrait créateur sous un bloc de verre portant le titre ; univers en objets |
| `/asie`, `/asie/chine` | Images de pays sous un bloc de verre (titres) ; **W11 objets-preuves** des prix vécus ; saisons en étagère du soir |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine` | Sobres : objets statiques, aucun effet lourd ; 3 bases en 3 épingles |
| `/k15ze` | Sous-identité k15ze sur plateau sombre ; chiffres Anton ; « Mes courses » en trois plaques photo |
| `/liens` | Étiquettes empilées, aucun objet animé |
| `/collaborer` | Plateau « dossier marque » : chiffres datés en plaques, études de cas |

**Micro-interactions signature**
1. **La lumière change (le point).** Les objets de l'univers courant sortent d'abord (descente de 12 px, ombre qui se resserre, 240 ms, `--ease-sortie`) ; la lumière passe du studio jour au bleu nuit (fond et ombres, 500 ms) ; les nouveaux objets entrent (descente de 12 px, ombre de contact, 260 ms, 60 ms d'écart). « Arrive lentement, part vite. » Réduit : fondu.
2. **W10 La vue éclatée « Sous le capot ».** Au clic (ou Entrée), l'objet de l'app se sépare en 5 plaques empilées en CSS 3D (App · API · Données · IA · Infra) ; chaque plaque s'écarte de 28 px, 60 ms d'écart, 480 ms au total ; les étiquettes sont les vraies (`apps[].stack`) ; clic sur une plaque → sa fiche. Sur `/pro/agents`, la même mécanique éclate **une équipe** ; « Lancer » fait descendre un jeton de plaque en plaque jusqu'à « Vous » (W6).
3. **L'objet en main.** Au survol ou au focus : l'objet se soulève de 8 px, son ombre s'élargit et s'adoucit (320 ms, `--ease-arrivee`). Rien d'autre : pas de tilt.
4. **L'étagère de progression** (`/pro`, `/pro/apps`). À l'entrée dans l'écran, les objets se posent dans l'ordre de sortie (Zenko, Oshii, Sago, Miru, Croc, Wado) : chacun descend de 12 px, son ombre de contact apparaît (260 ms, 80 ms d'écart), sa date de sortie monte par la fente.
5. **W11 Les objets-preuves** (`/asie/chine`, guides). Avion ≈ 100 €, train moins de 9 €, lit (V Life) 25 €, bol 7–8 €, téléphone ≈ 10 € (200 € barré, W4) ; chaque objet descend de 12 px et pose son ombre (260 ms), le prix monte par la fente ; pas de total (non sourcé).
6. **Le bloc de verre** (titres de chapitre posés sur une vraie image, Créateur). Le bloc biseauté glisse de 24 px (420 ms) avec un flou de 26 px et un liseré blanc à 16 % ; jamais sur un fond uni.

**Mouvement.** Un mouvement avec du poids, de 260 à 550 ms ; ressorts critiques ; parallaxe de 12 px au plus ; aucune boucle.

**Séparation.** Température de la lumière (jour / bleu nuit), familles d'objets (apps et outils / objets-preuves de voyage et de sport), accent (sauge / corail).

**Skill à charger** : `high-end-visual-design`.

**Risques.** Objets en CSS qui font « IA slop » (rester mat, deux couches d'ombre, aucune brillance) ; peu d'icônes réelles (Wado et Croc en plaque typographique) ; trop de verre (titres seulement).

---

### 10.6 Comparaison

| | Point | Schéma d'agents | Pro | Créateur | Énergie | Assets nécessaires | Skill |
|---|---|---|---|---|---|---|---|
| 1 REC / PROD | iris | timeline à pistes | papier, 16:9 | nuit, 9:16 | posé / énergique très net | extraits verticaux (vignettes locales en attendant) | `design-taste-frontend` |
| 2 Carnet | le quadrillage se retire | dossier de transmission | carnet d'atelier, registre | image annotée | calme | images de pays (en place) | `minimalist-ui` |
| 3 Lignes | l'aiguillage | ligne avec arrêt obligatoire | plan signalétique | carte aux tampons | mécanique | aucun | `frontend-design:frontend-design` |
| 4 Épisode | arrêt sur image ↔ déclencheur | feuille de service + crédits | fiche technique, noir film | planche de manga | très énergique | 7 plans (en place, à remplacer) | `gpt-taste` (avec retraits) |
| 5 Matière | la lumière change | vue éclatée d'une équipe | studio jour, objets | bleu nuit, objets-preuves | doux, tactile | objets en pâte (CSS provisoire) | `high-end-visual-design` |

---

## 11. À trancher par Kenz (réponds par un numéro)

Retenus **pour les maquettes** en attendant ta réponse : G1 = 1, G3 = 1 (vous sur les pages clients), G4 = 1 (Hermes seul), G9 = 3, G16 = 1, G17 = 1, G18 = 1.

1. **G2 Nom public de l'univers voyage** : 1) Kenz in Asia ; 2) Kenz en Asie ; 3) En Bien en Asie.
2. **G5 Chiffres business** : 1) publiés, datés ; 2) audience seulement ; 3) aucun.
3. **G6 MVP web de la startup** : 1) étude de cas avec l'accord de l'équipe ; 2) mention anonyme ; 3) rien.
4. **G7 Zenko** : 1) dans le Lab, sans statistiques ; 2) retirée.
5. **G8 Enkenz** : 1) Créateur ; 2) Pro ; 3) les deux.
6. **G11 Journal public** préparé par un agent, validé par toi : 1) oui ; 2) non.
7. **G13 / G19 Offres et formats** : lesquelles des 6 offres ; diagnostic → pilote → mise en place → suivi ; « sur devis » ou fourchettes ; formulation de la disponibilité.
8. **G14 Alertes par guide** : 1) oui ; 2) non.
9. **G15 Vérifications** : chiffre Oshii ; V2 de Miru en ligne ; éditeur de Hermes Agent ; date du Startup Weekend ; droits des photos HYROX et Spartan ; origine des photos de pays ; vidéos à intégrer.
10. **G20 Mesure sans cookie** : 1) oui ; 2) non.
11. **G21 Démo « veille »** sur les versions App Store : 1) oui ; 2) non.
12. **DA-1 Transition du point** : l'iris est-il acceptable (pas un « masque ») ?
13. **DA-4 / DA-7 Exports** : 7 plans fixes ; 3 à 5 extraits verticaux ; captures V2 de Sago, Wado, Miru, Croc ; objets en pâte en WebP. Lesquels ?
14. **DA-8 TikTok Sans** pour k15ze : licence web ?
15. **Lot 0** : ignorer `maquettes/_brief/` dans Git ; retrouver la source de `/itineraire/chine`.

---

## 12. Sources

- **Briefs** : `01-builder.md`, `02-createur.md`, `03-marque-style.md`, `04-strategie-v1.md`, `04b-critique-ux-produit.md`, `04c-critique-direction-artistique.md` (11/11/2026), lus en entier.
- **Coffre, en lecture seule** : `AGENTS.md` (protocole v1 du 10/10), `Décisions.md` (lignes du 10 et 11/11 sur Wado, Oshii, Croc), liste de `Projets/`. Aucune note personnelle ouverte.
- **Code du site, en lecture seule** : `i18n/dictionaries/fr.ts` (accords, Startup Weekend), `lib/socials.ts` et `app/layout.tsx` (liens publics), `public/images` (`ls` + `sips`, 38 images vérifiées).
- **Contrastes** : recalculés le 11/11/2026 (formule WCAG 2.x, script `node` local) pour toutes les paires des § 9.5 et § 10.
- **Aucune requête réseau, aucune tâche lourde.** Aucun fichier du coffre ni du site n'a été modifié ; seuls `05-brief-final.md` et `_shared/content.js` ont été écrits.

*— Claude, stratège produit et personal branding, 11/11/2026.*
