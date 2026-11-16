# 03 — Marque & style : voix, goûts, récit, audit du site, assets, concepts

> Brief rédigé le **11/11/2026** par Claude (documentaliste « Marque & style »), en lecture seule du coffre Obsidian et du code du site.
> Il sert de base aux maquettes du nouveau site. Rien n'a été modifié dans le coffre ni dans le code (`app/`, `components/`, `data/`…).

**Comment lire les statuts**
- **déclaré par Kenz (date)** : Kenz l'a dit ou écrit. Le chiffre n'a pas été vérifié dans une console.
- **observé le (date)** : relevé dans un fichier, le code ou des données publiques à cette date.
- **validé (date)** : Kenz a approuvé une proposition.
- **hypothèse** : déduction de l'auteur, à vérifier.
- **à confirmer** : aucune source trouvée ; ne rien afficher tant que Kenz n'a pas répondu.

---

## 0. En bref

1. **Le site actuel date du 08/06/2026** (dernier commit, `add english`). Depuis, Kenz a sorti ou refait Croc, Wado, Sago V2, Miru V2, le MVP web d'Escapades Libres, un studio vidéo programmatique et un système d'agents. **Le site a cinq mois de retard sur la réalité.**
2. **La bonne idée à garder** : le point de « Kenz. » sert d'interrupteur Pro/Moi. C'est une vraie signature. Mais aujourd'hui il est caché, ne marche pas au clavier et ne peut pas être partagé par un lien. Un abonné qui vient de TikTok tombe sur la page « développeur ».
3. **Ce qui fait template** : fond noir, halos et grille, titres de poste qui tournent, badge « Disponible », compteurs animés, faux chat « Kenz AI » qui répond par mots-clés, photos Unsplash sur les pages voyage, README d'origine de `create-next-app`.
4. **Des chiffres sans source ou qui se contredisent** : « 3 apps » d'un côté, « 4 apps » de l'autre ; « 10K abonnés TikTok » contre ~28 000 déclarés ; l'app Zenko et ses statistiques n'apparaissent nulle part dans le coffre. Ça va à l'encontre de la règle de Kenz : « des chiffres exacts, jamais inventés ».
5. **Le goût de Kenz est très clair et très documenté** : premium mais authentique, jamais une pub ; dynamique sans « mal à la tête » ; aucun rebond ; non verbeux ; de vraies images ; verre, 3D douce façon pâte, serif italique + grotesque, flèches à la main.
6. **La voix** : orale, directe, courte, en « je ». Kenz tutoie et tranche (« pas fan », « trop IA », « ok vasy la A »). Un peu de franglais tech, des clins d'œil anime (One Piece).
7. **Côté Pro**, on met en avant la **mise en place d'agents IA** (avec Hermes) comme un savoir-faire : rôles, mémoire partagée, garde-fous, vérification, humain dans la boucle. On n'y raconte jamais l'usage privé de Kenz.
8. **Dette perf** : `public/` pèse **86 Mo**, dont **~80 Mo jamais utilisés** (`earth.webp` 29 Mo, `frames/` 35 Mo, `ta_video.mp4` 16 Mo). `app/icon.png` (1,4 Mo) est servi comme favicon.
9. **Accessibilité** : aucune prise en compte de `prefers-reduced-motion`, des menus qui ne s'ouvrent qu'au survol, un interrupteur secret qui n'est pas un bouton, des textes à faible contraste.
10. **Huit pistes de concepts** en fin de document, chacune tirée de la vraie vie de Kenz et avec une micro-interaction précise.

---

## 0 bis. Séparer les casquettes : ce qui va où

> Demande de Kenz (11/11) : « ne pas tout mélanger », pas de détails privés, mais montrer dans la partie pro ce qu'un futur client pourrait mettre en place.

| Contenu | Pro | Moi (créateur) | Nulle part |
|---|---|---|---|
| Apps (Oshii, Sago, Croc, Wado, Miru), stack, IA dans les produits, défis techniques | ✅ | Mention courte (« mes apps ») | |
| Systèmes d'agents IA : architecture, rôles, mémoire, garde-fous, vérification | ✅ (savoir-faire + cas clients) | | |
| Studio vidéo programmatique (HyperFrames, Motion Lab, montage automatique) | ✅ (automatisation créative) | En coulisses (« comment je monte ») | |
| Escapades Libres (MVP web d'une startup) | ✅ si Kenz et l'équipe donnent leur accord | | Nom de la fondatrice sans son accord |
| Voyage (Kenz in Asia, En Bien en Asie, Branche-toi), anime/japonais (Enkenz), sport (k15ze, Hyrox, Spartan) | | ✅ | |
| Startup Weekend (1ʳᵉ place) | ✅ | | |
| Démarches personnelles de Kenz (carrière, logement, administratif) et les automatisations privées qui s'y rattachent | | | ⛔ jamais |
| Journal personnel, notes du dossier « Perso », famille, projets privés | | | ⛔ jamais |
| Tout point de sécurité des apps, clés, identifiants de projets, URL de consoles, adresses e-mail | | | ⛔ jamais |
| MRR, nombre d'utilisateurs faibles, échecs pub | Seulement si Kenz le décide (« montrer ma progression ») | | Par défaut |
| Noms internes des agents (autres que Hermes) | À confirmer par Kenz | | Par défaut |

---

## 1. La voix de Kenz

### 1.1 Registre
- **Oral, direct, court.** Kenz parle comme dans ses vidéos : des phrases courtes, des verdicts nets. Ses retours font quelques mots : « trop long », « pas fan », « trop IA ». *(Règles de montage, 04/11 ; Décisions, 11/11)*
- **Des validations très brèves**, souvent sans ponctuation : « ok vasy la A », « ok dac » *(Oshii — Marketing, 04/11)*, « ok cest bon je vois » *(Travailler avec les agents, 10/10)*, « tu peux push en prod » *(Escapades Libres, 02/11)*.
- **Un niveau d'exigence élevé** : « vérifie tout, super senior pro » *(Sago — Dev, 11/11)* ; « des vraies maquettes, interactions et micro-animations poussées » *(Sago — Dev, 06/11)* ; « plus premium, plus travaillés » *(Motion Lab, 08/11)*.
- **Pragmatique avec le produit** : « trop compliqué, le user s'en fout » *(Décisions, Oshii, 11/11)* ; « Je ne veux rien casser en prod. » *(Décisions, Oshii, 04/11)* ; « tout gratuit » *(Décisions, Escapades Libres, 31/10)*.
- **Assume de ne pas plaire à tout le monde** : « on vise pas tout le monde » *(Décisions, YouTube, 28/10)*.
- **Veut que ce soit vraiment Kenz** : « que ce soit moi » *(Branche-toi Île Maurice, 01/11)*. Les phrases de Kenz ne sont pas réécrites *(même note)*.

### 1.2 Les mots qui reviennent

| Mot ou tournure | Sens chez Kenz | Source |
|---|---|---|
| « premium », « pro », « passer un cap » | le niveau attendu | Croc 04/10 · Miru 19/10 · Motion Lab 08/11 |
| « trop IA », « IA slop », « AI slop » | rendu générique, fabriqué | Wado 15/10 · Miru 19/10 · Règles de montage |
| « gamin », « amateur », « cours de SVT » | animation ratée | Règles de montage (Croc, voyage, Wado) |
| « trop verbeux », « visuel avec des exemples » | trop de texte | Motion Lab, 07/11 |
| « trop complexe, pas assez structuré » | page confuse | Motion Lab, 07/11 |
| « saccadées, pas premium », « des flashs » | micro-animations ratées | maquettes de l'app Wado, 21 et 26/10 |
| « trop statique, pas dynamique ni pro » ; « animations datées, pas assez 2026 » | rejet d'un montage | Croc, 04/10 |
| « il ne faut pas que j'aie mal à la tête » | dynamique oui, chaos non | Règles de montage, demande du 04/11 |
| « c'est trop ancien » | effet démodé (masques) | Maurice, 02/11 |
| « beaucoup trop de whoosh » | excès de bruitages | Règles de montage |
| « trop intense » | couleur trop saturée | Motion Lab, 08/11 |
| JE CONSEILLE / FLOP / ABUSÉ | ses tampons de verdict en vidéo | Branche-toi Île Maurice (Motion Lab) |
| « hook », « POV », « UGC », « go rendu », « push en prod » | franglais de métier | Règles de montage · Escapades Libres |

### 1.3 Humour et références
- **One Piece** : CTA d'abonnement en affiche « WANTED » *(validé le 08/11, motion F4)*, jingle One Piece pour les grandes villes *(Branche-toi)*. Inspirations déclarées : « One Piece, films immersifs, sport » *(PDF Personal Brand, résumé dans Kenz in Asia — atelier)*.
- **Clins d'œil dans les apps** : le manga de Sago est signé « Zoro l'frérot » *(Sago — Dev)*.
- **Des titres avec du chiffre et de l'image** : « 36 500 fois », « Pop-corn », « Pas fichu » *(épisodes Croc)* ; « team pâtes ou team patates ? » *(règle Wado : question binaire, jamais ouverte)*.
- **Le vécu qui fait sourire** : l'iPhone vu à 200 € sur le site Apple France, payé 10 € au marché de Shenzhen ; la tenue d'empereur louée 20 € à la Muraille *(passages validés à l'identique, 10–11/10, script Chine)*.
- L'humour reste **léger et situationnel** : jamais de blague forcée, jamais « commentez », jamais de question ouverte creuse *(Règles de montage, CTA)*.

### 1.4 Tutoiement ou vouvoiement
- **Tutoiement** sur le site actuel (« Pose-moi une question… », « Laisse-moi ton email… », « Continue l'aventure ») et dans les apps de Kenz : Oshii « tutoiement partout » *(validé le 11/11)*.
- **Vouvoiement** seulement chez Escapades Libres, pour son public *(Décisions, 23/10)*.
- **À trancher par Kenz pour la partie Pro** (voir § 7) : 1) tutoiement partout, cohérent avec la marque ; 2) vouvoiement sur les pages destinées aux clients uniquement.

### 1.5 FR / EN
- **Le français est la langue de base** du site et de tout le contenu. Les chaînes visent un public francophone *(En Bien en Asie, Kenz in Asia)*.
- Les titres de poste sont déjà en anglais sur le site, même en FR (« Full Stack Developer »). Le nom de la chaîne YouTube est en anglais (« Kenz in Asia ») alors que les vidéos sont en français.
- Oshii existe en **FR, EN et ES** (vidéos et captures App Store, 22–23/10). L'anglais compte donc côté apps et côté clients.
- Convention technique du site : voir § 4.7.

### 1.6 Règles pour la copie du nouveau site
- **Toujours « je »**, Kenz parle. Pour les accords, reprendre les formes déjà sur le site : « Passionné », « Créateur de contenu », « Développeur », « Globe Trotteur », « Athlète Hybride ».
- **Une phrase = une idée.** Peu de texte : l'image ou la démo explique *(règle « non verbeux »)*.
- **Le concret d'abord** : un geste, un prix, un écran, un résultat. Pas de « passionné par la création d'expériences intuitives qui apportent une vraie valeur » (phrase actuelle du héros, générique).
- **Jamais de pub** : le produit arrive comme la solution, en action *(règle n° 9 du montage)*.
- **Pas de superlatif sans preuve.** Un chiffre porte sa date et sa source (voir la piste 4).

*Exemples de ton (propositions, à valider par Kenz) :*
- Pro : « Je conçois l'app, je la code, je la mets en prod, et je fais la vidéo qui la fait connaître. »
- Pro, agents : « Je mets en place des équipes d'agents IA qui travaillent comme une vraie équipe : chacun son rôle, une mémoire commune, et rien ne part sans ta validation. »
- Moi : « J'ai payé un iPhone 10 € à Shenzhen. Sur le site d'Apple, il en coûtait 200. »

---

## 2. Les goûts visuels de Kenz

### 2.1 Les principes
1. **Premium mais authentique, jamais une pub.** *(Règles de montage n° 9 ; Croc 18/10, Sago 24/10, Wado 15/10)*
2. **Dynamique, mais pas dans tous les sens** : « il ne faut pas que j'aie mal à la tête ». *(n° 5 ; demande du 04/11)*
3. **Non verbeux** : l'image explique. *(n° 6 ; Motion Lab 07/11 : « trop verbeux, visuel avec des exemples »)*
4. **De vraies images** : jamais d'images de banque dans un épisode, jamais de voix IA, jamais de musique IA. *(Branche-toi ; Règles de montage, Son)*
5. **Une identité, deux intensités** : TikTok énergique, YouTube posé. *(Décisions, 07/11)* Cette règle colle exactement au couple **Moi (énergique) / Pro (posé)**.
6. **Structuré, avec des noms** : chaque motion a un nom et un code (O1 Rafale, R5 Itinéraire, I2 Barré…). Kenz a demandé « donner des noms aux motions ». *(Motion Lab, 07/11)*
7. **Ranger par séries, puis par épisodes**, pas en tableau ni en calendrier. *(Décisions, 08/11)*

### 2.2 Le mouvement
- **Aucun rebond** : le mouvement ralentit et se pose. *(Règles de montage, Animation ; Croc 03/09, Oshii 27/09, Wado 12/10)*. Exception : dans la DA Croc, « seule la mascotte rebondit ».
- **Pas de petite animation en boucle qui saccade, pas d'effet « flash ».** *(app Wado, 21 et 26/10)*
- **Transitions très rapides et discrètes, avec un mouvement doux.** Oui : le flou directionnel, le déclencheur photo, le détourage, l'obstruction, la fermeture en iris. Non : les transitions qui rebondissent, les effets de masque. *(Règles de montage ; Maurice 02/11)*
- **Le texte arrive sur le mot exact, jamais en avance.** Jamais deux textes qui se chevauchent. *(Règles de montage)*
- **Un moment de bascule mérite du suspense.** *(voyage, 28/10)*
- **Traduction web (proposition)** : courbe `cubic-bezier(0.22, 1, 0.36, 1)` (déjà sur le site) ou `(0.16, 1, 0.3, 1)` ; 180 à 450 ms pour les micro-interactions ; aucun ressort qui dépasse sa cible ; tout désactivable avec `prefers-reduced-motion`.

### 2.3 La typographie
- **Validée le 07/11 pour tout le Motion Lab (proposition « Crème »)** : **Melodrama** pour les titres et les destinations, **Inter Display**, et **Instrument Serif italique** (parfois lumineuse). *(Décisions, 07/11)*
- Kenz aime **le mélange grotesque + serif italique**, une police de titres « façon sa photo HAND CREAM ». *(Décisions, 07/11)*
- Polices choisies par Kenz pour Branche-toi : Akira Expanded (démo, sans accents, licence « pas pour l'instant »), Inter ExtraBold et Black, Open Sauce, Bebas Neue, Instrument Serif. *(Branche-toi, 01/11)*
- Sous-titres : le mot important plus grand, dans un 2ᵉ style (Instrument Serif italique). *(Règles de montage ; Maurice 01/11)*
- k15ze : TikTok Sans, mots verts en Instrument Serif, chiffres en Anton (réf. « 31.3 KM »). *(Décisions, 08/11)*
- **Refusée** : Unbounded. *(Décisions, Maurice, 02/11)*
- Le site actuel utilise **Inter + Bodoni Moda italique + JetBrains Mono**. Le mélange sans-serif + serif italique est déjà là : il suffit de passer à la typo validée.

### 2.4 Les couleurs validées (par univers)

| Univers | Couleurs | Source |
|---|---|---|
| Branche-toi (TikTok voyage) | jaune `#FFE600`, rouge `#E8322B`, moutarde `#F2C14E`, crème `#F4EFE6`, lagon `#0F5D6B` (miniatures) | Branche-toi, DA v4/v5 |
| Kenz in Asia v1 « Manga éditorial » | encre `#111013`, papier `#F2EDE3`, rouge `#E0352B` | Kenz in Asia — atelier (`00_Bible/DA.md`) |
| Objets 3D du Motion Lab | laque rouge adoucie en **corail satiné**, crème satinée, verre fumé, touches dorées | Décisions 08/11 ; atelier 08/11 |
| k15ze (sport) | texte blanc, mots forts en **vert Wado lumineux avec glow** | Décisions, 08/11 |
| Site actuel | Pro = vert `#00c8a0`, Moi = orange `#ff8c38` (couleur du point) ; fond `#030305` | `components/Navbar.tsx`, `components/Hero.tsx` |

Les couleurs de chaque app sont au § 5.2.

**Constat** : les univers de Kenz convergent vers **crème/papier + encre + un rouge ou corail + une couleur d'accent par série**. Le site actuel est l'inverse : noir profond et cyan/violet « cyberpunk » dans `styles/theme.ts`, avec un commentaire « for that geek feel ». Or Kenz veut un style **« friendly… jamais geek »** *(Règles de montage, Animation)*.

### 2.5 Les matières
- **Le verre** : verre épais validé (motion R9 Bloc), lentille de verre (R10), relief + verre (R11), cartes en verre dépoli. *(Décisions, 07 et 08/11)* Mais pour Branche-toi : **le verre seulement pour le titre**, car ailleurs « il cache les rushs ». *(01/11)*
- **3D douce, style pâte (clay)**, éclairée en studio avec des ombres douces. *(Décisions, 08/11)*
- **Flèches à la main**, motions simples. *(Décisions, 07/11)*
- **Personnages mignons avec un visage**, jamais de mannequin ni de marionnette. *(Croc, 01/11)*
- Refusés : la loupe sur le prix, la boule de cristal *(08/11)* ; le néon rouge, la prise électrique, les masques *(Maurice, 02/11)* ; le style « After Hours » de Miru (« AI slop », 19/10).

### 2.6 Les références citées
- One Piece, les films immersifs, le sport *(PDF Personal Brand)*.
- Les inspirations de Branche-toi : le titre « JAPAN » en verre (sa préférée), « LET'S TALK LEGS », « LETS ANSWER A QUESTION », « nostalgia » *(01/11)*.
- Format « day in my life » pour Wado, réf. ZAYLON « Sunday Reset » *(08/11)*.
- Des vidéos US qui font plus de vues que leur chaîne n'a d'abonnés *(07/11)*. **On copie la mécanique, jamais les images ni les couleurs.** *(Règles de montage, Contenu)*

### 2.7 Les interdits (à appliquer au web)

| Interdit | Application au site | Source |
|---|---|---|
| Chiffre géant sur un fond dégradé (« trop IA ») | pas de compteur géant sur halo ; un chiffre se pose sur une vraie image | Wado 15 et 18/10 |
| Rebond | pas de ressort ni de `scale` qui dépasse sa cible | Règles de montage |
| Boucle qui saccade, flash | pas de pulsation infinie (cf. le point actuel au survol), pas de flash blanc | app Wado 21 et 26/10 |
| Images de banque | pas d'Unsplash sur les pages voyage | Branche-toi |
| Écran chargé, mots dans tous les sens | une idée par écran, peu de calques | n° 5 |
| Texte qui chevauche, texte coupé | grille stricte, zones sûres | Règles de montage |
| Style geek | pas de terminal décoratif, pas de néon cyan | Règles de montage, Animation |
| Pub | pas de « télécharge mon app » en gros bloc | n° 9 |
| « Commentez », question ouverte creuse | pas de CTA creux | Règles de montage, CTA |
| Tableau ou calendrier de posts | contenus rangés par séries et épisodes | Décisions, 08/11 |

---

## 3. Le récit personnel publiable

### 3.1 Le fil (proposition)
Une seule personne, deux casquettes, deux intensités :
- **Pro (posé)** : je construis des produits entiers, de l'idée à la prod, puis le marketing ; je mets en place des agents IA qui travaillent avec moi.
- **Moi (énergique)** : je voyage en Asie et je le raconte « comme un anime le ferait » ; je fais du sport ; je partage le vrai prix des choses.

*Phrases-clés de Kenz, tirées de son PDF Personal Brand (27–28/01/2026, résumé dans Kenz in Asia — atelier) :*
- « Voyager pour faire ressentir. Créer pour inspirer. »
- Kenz « personnage principal », le voyage le décor, l'émotion le cœur ; une chaîne « où l'on ne scrolle pas » ; pour ceux qui veulent « voyager même depuis leur lit ».
- Objectif : « que les gens reconnaissent TON FORMAT avant même ton nom ».
- La phrase « Tu ne crées pas pour les stats… Même si tu as peur, publie. » est une **note personnelle** (« à relire les jours de doute ») : **ne pas la publier** sans l'accord de Kenz.

### 3.2 Les faits publiables

| Thème | Fait | Statut |
|---|---|---|
| Voyage — TikTok « En Bien en Asie » (@7kinze) | ~28 000 abonnés | déclaré par Kenz (09/10) |
| | 392 vidéos, 7,83 M de vues ; record : Malaisie ép. 32 « Budget », 725 600 vues | observé le 04/11 (données publiques) |
| | Séries « Branche-toi » : Japon S1 et S2, Chine S1 et S2 (Shenzhen, Guangzhou : meilleure médiane, 41 300 vues), Malaisie, Corée, Hong Kong | observé le 04/11 |
| Voyage — YouTube « Kenz in Asia » (@7Kinze) | 1 530 abonnés ; 15 vidéos longues ; Shorts ≈ 507 000 vues ; Short « iPhone réparé 10 € en Chine » : 93 760 vues | observé le 04/11 |
| | Vidéo « Itinéraire Chine » publiée le 31/10 ; prochaine : le budget réel de la Chine | observé le 04/11 ; Décisions 07/11 |
| Anecdotes Chine | iPhone 200 € (Apple France) → 10 € à Shenzhen ; spa V Life à Pékin ≈ 25 € nuit comprise ; taxi pour Mutianyu 40 € aller-retour ; tenue à la Muraille 20 € ; Skywalk de Raffles City le soir ; Yuyuan, son endroit préféré de Shanghai ; Shenzhen aimée mais pas pour un premier voyage | validé à l'identique (10–11/10, script Chine) |
| Destinations | Japon, Chine, Corée, Malaisie, Hong Kong, Islande (site), Abu Dhabi (épisode « MTPO#1 », à confirmer) | observé (coffre et site) |
| Île Maurice | Nouvelle saison « Branche-toi Île Maurice » en préparation ; aucun épisode tourné | déclaré par Kenz (04/11) |
| | Lien personnel de Kenz avec Maurice | **à confirmer** (rien dans le coffre) |
| Anime / japonais | TikTok @enkenz : openings d'anime traduits, ~200 abonnés ; en pause pendant la refonte de Sago | déclaré par Kenz (09/10, 12/10) |
| Sport | Hyrox Paris (mai 2025), Spartan (juin 2025) | site actuel (`i18n/dictionaries/fr.ts`) |
| | Chaîne k15ze (sport, nutrition, lifestyle) lancée le 15/10, en Shorts ; TikTok à faire | déclaré par Kenz (04/11) |
| Pro — distinction | 1ʳᵉ place au Startup Weekend (54 h, en équipe) | site actuel ; date exacte « à ajuster » (TODO dans `ProAchievements.tsx`) |
| Pro — apps | Oshii (App Store + Google Play), Sago, Miru, Croc publiées ; Wado sur l'App Store | fiches projets (liens stores) |
| | Oshii : ~10 000 comptes/téléchargements cumulés ; certaines vidéos UGC à un million de vues | déclaré par Kenz (09/10) |
| | Croc : phase 2 des Reels depuis le 01/11, épisode 19 ≈ 4 000 vues | déclaré par Kenz (04/11) |
| Pro — web | Escapades Libres : MVP web en prod (test de personnalité, espace voyageur, back-office) | observé le 04/11 dans le dépôt ; publication **à confirmer** avec l'équipe |
| Solopreneur | Kenz conçoit, code, déploie et fait le marketing vidéo de ses apps ; atelier vidéo programmatique (HyperFrames) | observé (coffre, ateliers) |
| Lieu de vie | Le site dit « Basé à Paris » | **à confirmer** (ne rien déduire d'autres notes) |

### 3.3 Le savoir-faire « agents IA », version publique (partie Pro)
Ce que Kenz sait mettre en place, décrit à partir de **son propre système** (protocole `AGENTS.md`, accord du 10/10 ; `Travailler avec les agents.md`), traduit en **offre pour un client**. On ne dit jamais à quoi Kenz s'en sert en privé.

| Brique | Ce qui existe chez Kenz (source) | Comment le montrer à un client |
|---|---|---|
| **Un coordinateur** | Hermes garde la cohérence, les points de reprise et règle les conflits ; il ne lance aucune nouvelle automatisation tout seul (`AGENTS.md`) | « Un chef d'orchestre qui sait où en est chaque dossier » |
| **Des rôles séparés** | un agent produit/code/tests, un agent contenu/angles, un agent recherche sourcée, des sessions locales par atelier (`AGENTS.md`) | un schéma par rôle : ce qu'il lit, ce qu'il écrit, ce qu'il n'a pas le droit de faire |
| **Une mémoire partagée lisible par un humain** | un coffre de notes Markdown : une fiche par projet avec « Où j'en suis », « Prochaine action », les décisions datées (`README.md` du coffre) | « Vos agents et vous lisez le même dossier » |
| **Des garde-fous** | une proposition n'est pas une décision ; rien n'est publié ou déployé sans accord ; pas de secrets dans les notes ; une seule tâche lourde à la fois (`AGENTS.md` ; règles machine) | une liste de règles, chacune avec un exemple concret |
| **La vérification** | distinguer « déclaré », « observé le », « hypothèse », « non vérifié » ; relectures indépendantes (« relu par trois agents », Sago 11/11) | la pastille de preuve (piste 4) |
| **L'humain dans la boucle** | Kenz valide entre chaque étape (cadrage → script → tournage → montage, YouTube 16/10) ; options numérotées, Kenz répond « la 1 » (Règles de montage) | une démo où le flux s'arrête et attend « Valider » (piste 2) |
| **Synchronisation privée** | notes transportées entre Mac, iPad et serveur, sans abonnement ni port public (Cadrage, 09/10) | « Vos données restent chez vous » (sans nommer les outils si Kenz préfère) |
| **Des mises en prod sans casse** | fonction livrée derrière un drapeau éteint par défaut (Oshii, 08/11) ; refonte du back-office en front seul d'abord (04/11) | une étude de cas : « livrer sans rien casser » |
| **L'automatisation créative** | rushs + voix off → transcription → coupe au mot → montage → MP4 + séquence Premiere ; Motion Lab de 33 motions nommées (atelier, 07/11) | « De vos rushs à une vidéo prête à poster, avec votre validation » |

**Cas d'usage clients à proposer** (hypothèses de positionnement, à valider par Kenz) : une équipe d'agents pour produire du contenu vidéo ; un back-office + des agents qui préparent, et l'humain qui valide ; une veille sourcée pour un commerce ; un audit d'app ou de site par plusieurs agents relecteurs.

### 3.4 À ne jamais publier (rappel)
Démarches personnelles (carrière, logement, administratif) et automatisations privées ; journal et notes du dossier « Perso » ; famille et projets privés ; tout point de sécurité des apps ; e-mails, clés, identifiants de projets, URL de consoles et liens `localhost` ; nom de la fondatrice d'Escapades Libres sans son accord.

---

## 4. Audit du site actuel

### 4.1 Architecture (observé le 11/11)
- **Stack** : Next.js 16 (App Router), React 19.2, **styled-components 6** (presque tout le style), Tailwind 4 installé mais `app/globals.css` utilise la syntaxe v3 (`@tailwind base`) : *hypothèse* Tailwind n'agit pas. Framer Motion 11, Lenis (scroll doux), Radix, Lucide.
- **Une seule page d'accueil**, `app/page.tsx`, entièrement en `'use client'`. Le mode Pro/Moi affiche ou cache des blocs :
  - Pro : `Hero` → `Impact` → `MobileApps` → `TechStack` (« Kenz AI ») → `ProAchievements` → `Contact` ;
  - Moi : `Hero` → `ContentCreation` → `TravelShowcase` → `SportTimeline` → `Socials` ;
  - puis le `Footer`.
- **Routes** : `/apps/[slug]` (1 220 lignes, la plus riche), `/projets/[slug]` (ancienne, toujours dans le sitemap), `/destination/[slug]`, `/api/contact` (envoie le message par un bot Telegram).
- **Données** : `data/projects.ts` (Oshii, Zenko, Sago, Miru), `data/destinations.ts` (5 destinations), `data/destination-details.ts`.
- **Code mort** : `sections/*` (5 fichiers), `components/site/header.tsx`, `components/hero/hero-wordmark.tsx` (logos « Nebula » et « Pulse » d'un modèle), `components/PassionReveal.tsx`, `components/theme/*`, `components/ui/project-card.tsx`. Aucun n'est importé par `app/`.
- **Histoire du site** (`git log`, 15 commits) : première version le 05/11/2025 → nouveau design le 02/12/2025 → « new design new content 2026 » le 01/04/2026 → Miru le 22/04 → Startup Weekend le 06/06 → switch Pro/Moi et anglais le 08/06/2026. **Rien depuis.**

### 4.2 Ce qui marche
- **Le point de « Kenz. »** : un interrupteur caché dont la couleur dit le mode (vert = Pro, orange = Moi) et d'où part une onde de couleur. C'est personnel et mémorable.
- **Les pages d'app** (`/apps/[slug]`) avec « Sous le capot », « Intégrations IA », « Défis techniques », alimentées par `PROMPT-TECH.md`, dont la règle est « Honnêteté technique… pas de techno fantôme ». C'est la bonne base pour la crédibilité Pro.
- **L'i18n** est propre et typée (voir § 4.7), et la langue se partage par l'URL (`?lang=en`).
- **De vraies photos** : Startup Weekend, Hyrox, Spartan, captures des apps, photos détourées de Kenz.
- **Les courbes d'animation** `[0.22, 1, 0.36, 1]` et `[0.16, 1, 0.3, 1]` : elles ralentissent et se posent, comme Kenz l'aime.
- **Le mélange sans-serif + serif italique** (Inter + Bodoni italique), proche de la typo validée en novembre.
- **Le contact** en fenêtre avec envoi direct : simple et rapide.

### 4.3 Ce qui fait générique ou template
1. Le **README** est celui de `create-next-app`, jamais modifié.
2. **Fond noir `#030305` + grille + halos qui flottent en boucle** (20 s et 25 s) : le décor type des portfolios de développeur.
3. **Le titre qui tourne** entre « Full Stack / Backend / Frontend / Software Developer / Engineer » : un schéma très courant, et cinq variantes du même métier ne disent rien de Kenz.
4. **Le badge vert « Disponible pour de nouvelles opportunités »** : générique, et il ne dit pas pour quoi Kenz est disponible (missions, collaborations, contenus sponsorisés ?).
5. **La rangée d'avatars + « 4 apps · 12k+ téléchargements »** et les **compteurs animés** (12 000+, 3, 4,9/5) : le motif « preuve sociale » des modèles.
6. **« Kenz AI »** : un faux chat qui répond par mots-clés avec des délais simulés (`components/TechStack.tsx`). Pour quelqu'un qui se présente comme **AI engineer**, c'est un risque : un visiteur technique verra que ce n'est pas de l'IA.
7. **Des bulles de commentaires et de notifications** flottantes, avec des emojis : effet « maquette de réseau social ».
8. **Les pages destinations utilisent des photos Unsplash** (`data/destination-details.ts`), alors que Kenz a 1 629 clips Chine catalogués et une règle « jamais d'images de banque ».
9. **Le fond du mode Moi** (`background-moi.webp`) montre les tours de Kuala Lumpur au-dessus de rizières en terrasses. *Hypothèse* : un montage ou une image générée, car ce paysage n'existe pas tel quel. C'est contraire à « une vraie image ».
10. Des **formules vides** : « Repousser les limites », « L'Aventure », « Des expériences digitales conçues avec passion », « Le moteur de l'impossible » (`PassionReveal`, inutilisé).
11. Un **lien de remplissage** sur Oshii : un TikTok vers un domaine « …/nebula » avec le titre « +1 abonnés » (`data/projects.ts`, l. 103).

### 4.4 Crédibilité des chiffres (site comparé au coffre)

| Affiché sur le site | Où | Ce que dit le coffre | Verdict |
|---|---|---|---|
| « 4 apps publiées » / « 3 » apps publiées | héros / `Impact.tsx` | au moins Oshii, Sago, Miru, Croc publiées ; Wado sur l'App Store | contradiction interne ; à recompter |
| « 12k+ téléchargements » | héros, Impact, Oshii | Oshii ~10 000 cumulés (déclaré 09/10) | à confirmer, avec une date |
| « 4,9/5 » ; Oshii « 4.9 » | Impact, Oshii | la landing Oshii affiche « 4,8 ★ », non vérifié (29/10) | à confirmer |
| Oshii « 40 % d'engagement », « 280+ créateurs connectés » | `data/projects.ts` | rien | à retirer ou sourcer |
| **Zenko** (63 % de rétention, 18k itinéraires, 460 commerces partenaires, 4,7) | `data/projects.ts` | **Zenko n'apparaît nulle part dans le coffre** | à confirmer : l'app existe-t-elle encore ? |
| Sago « 85 % de rétention », « 2000+ caractères », « 150+ leçons » | `data/projects.ts` | « peu d'utilisateurs » (09/10) ; la V1 est mise de côté, la V2 est en prod (29/10) | obsolète |
| « 10K abonnés atteints sur TikTok » | héros Moi | ~28 000 déclarés (09/10) | à mettre à jour |
| « 5 pays filmés » | héros Moi | au moins 6 à 7 (Japon, Chine, Corée, Malaisie, Hong Kong, Islande, Abu Dhabi) | à recompter |
| Croc, Wado, Escapades Libres | — | projets actifs | absents du site |

### 4.5 Dette de performance

| Fichier | Poids | Utilisé ? | Action proposée |
|---|---|---|---|
| `public/frames/` (192 images WebP 1920×1080) | 35 Mo | non | sortir du dépôt |
| `public/earth.webp` (1920×1080, *hypothèse* : animé) | 29 Mo | non | sortir du dépôt |
| `public/ta_video.mp4` | 16 Mo | non | sortir du dépôt |
| `public/favicon.png` (1024×1024) | 1,3 Mo | non | supprimer |
| `app/icon.png` | **1,4 Mo** | **oui** (Next le sert comme icône) | remplacer par une icône de 32 et 180 px |
| `public/images/KzLogo.webp` (1024×1024) | 64 Ko | oui, déclaré en 16 et 32 px | décliner en petites tailles |
| `public/images/background-moi.webp` (1920×1080) | 484 Ko | fond CSS du héros Moi | passe hors de `next/image` : pas de tailles adaptées |
| Iframes TikTok et YouTube | — | oui (`ContentCreation.tsx`) | pas de `loading="lazy"` : remplacer par une vignette, puis charger au clic |

Autres coûts :
- animations infinies (halos, lueur de la photo, pulsation du point) ;
- Lenis sur toutes les pages ;
- toute la page d'accueil rendue côté client ;
- styled-components et Tailwind chargés ensemble.

### 4.6 Accessibilité
- **`prefers-reduced-motion` n'est pris en compte nulle part** (aucune occurrence dans le code).
- **Le point secret** est un `<span>` avec un `onClick`, placé dans un lien : il n'a pas de rôle, pas de nom accessible, pas de focus clavier, et ses deux états ne sont pas annoncés.
- **Les menus « Projets » et « Voyages » ne s'ouvrent qu'au survol** (`onMouseEnter`) : pas de `aria-expanded`, pas d'ouverture au clavier ni au toucher.
- **Le menu mobile** ne garde pas le focus et ne se ferme pas avec Échap.
- **Des contrastes faibles** : du blanc à 30–40 % d'opacité sur `#030305`, pour des textes de 0,72 à 0,78 rem.
- `PassionReveal` cache le curseur (`cursor: none`). Il n'est pas utilisé, mais à ne pas réutiliser.
- La langue du document est `fr` au rendu serveur, puis passe en `en` après le chargement.
- Des emojis dans les textes (« 🌍 », « 💰 ») sont lus à voix haute par les lecteurs d'écran.

### 4.7 i18n
**La convention à garder** (mémoire du projet + code) :
- français par défaut ;
- **dictionnaires** pour l'interface (`i18n/dictionaries/fr.ts` définit la forme ; `en.ts` doit avoir les mêmes clés, TypeScript le vérifie) ;
- **`Localized<T>` + `localize()`** pour le contenu des fichiers `data/` ;
- sélecteur de drapeaux via flagcdn (FR → drapeau français, EN → drapeau britannique) ;
- `?lang=en` dans l'URL, préférence gardée dans le navigateur.

Les limites :
- l'anglais s'applique **après** le premier affichage : la page apparaît en français, puis bascule ;
- le HTML servi et les métadonnées (titre, description, Open Graph) sont **seulement en français**, sans `hreflang` : l'anglais n'est pas indexable ;
- il reste du français en dur : les libellés « Télécharger sur » et « Disponible sur » dans `data/projects.ts`, les dates (« Mai 2025 ») et les mots de `PassionReveal`.

**Pour les maquettes** : prévoir chaque texte en FR et en EN. Le FR est rédigé en premier.

### 4.8 Le switch Pro/Moi
**Comment il marche** (`contexts/mode-context.tsx`, `components/Navbar.tsx`, commit `c058f1e` du 08/06/2026) :
- un état `pro` ou `perso`, gardé dans le navigateur (clé `kenz-mode`), Pro par défaut ;
- un clic sur le point inverse le mode ; une onde de la couleur du nouveau mode part du point (0,95 s) ;
- la navigation, le héros (photo, titres, couleur), les sections et le pied de page changent.

**Les problèmes** :
1. **Invisible pour un abonné.** Quelqu'un qui arrive de TikTok voit la page Pro et doit deviner qu'il faut cliquer sur un point.
2. **Impossible à partager** : il n'y a pas d'URL pour le mode Moi. Un lien en bio ne peut pas mener directement à « Moi ».
3. **Le mode reste en mémoire** : un client qui a cliqué une fois tombe ensuite sur le mode Moi.
4. **Rendu serveur toujours en Pro** : le contenu Moi n'existe pas dans le HTML (rien d'indexable), et l'écran saute si le mode gardé est Moi.
5. **Pas accessible** (voir § 4.6). La pulsation infinie au survol est le genre de boucle que Kenz n'aime pas.

**Proposition** : garder le point comme signature, mais en faire un vrai bouton. Lui ajouter deux adresses claires, par exemple `/` (Pro) et `/moi`, ou un sous-domaine (à trancher par Kenz, § 7). Le point fait alors **passer d'une adresse à l'autre** au lieu de cacher des blocs.

### 4.9 Partage et SEO
- **L'image Open Graph** est `Pro-pp.webp` : un portrait de 1080×1920, déclaré comme 1200×630. L'aperçu sur les réseaux sera mal recadré.
- **Le sitemap** liste `/projets/oshii`, `/projets/zenko` et même `/icon.png`, mais pas `/apps/*` ni `/destination/*`.
- **Le JSON-LD** cite Instagram `kenz.dev` alors que le coffre cite `@kenzvoyage_enbien` (repost des TikToks) : à vérifier.
- L'adresse e-mail de contact est écrite en clair dans le dictionnaire (risque de spam). Elle n'est pas reproduite ici.

---

## 5. Inventaire des assets de marque

### 5.1 Logo et photos (observé le 11/11 avec `sips`)

| Fichier | Dimensions | Poids | Ce qu'on voit | Remarques |
|---|---|---|---|---|
| `public/images/KzLogo.webp` | 1024×1024 | 64 Ko | monogramme « KZ » blanc, anguleux et penché, fond transparent | seul logo ; aucune version sombre ni SVG |
| `public/images/Pro-pp.webp` | 1080×1920 | 120 Ko | Kenz détouré, costume bleu marine, chemise blanche | petite étoile à 4 branches en bas à droite. *Hypothèse* : filigrane d'un outil d'édition IA. À recadrer ou à remplacer |
| `public/images/Moi-pp.webp` | 1080×1920 | 132 Ko | Kenz détouré, t-shirt de sport vert anis avec logo de marque | logo de marque bien visible |
| `public/images/kenz-pp.webp` | 902×857 | 120 Ko | Kenz devant le même décor KL + rizières, t-shirt vert anis | inutilisé (l'ancien code pointe vers `kenz-pp.PNG`, qui n'existe pas) |
| `public/images/background-moi.webp` | 1920×1080 | 484 Ko | tours de KL au-dessus de rizières, coucher de soleil | *hypothèse* : composite (voir § 4.3) |
| `app/icon.png` / `app/favicon.ico` | — | 1,4 Mo / 22 Ko | icône du site | trop lourde |

**Le wordmark « Kenz. »** est du texte (Inter 700). Le point est vert `#00c8a0` en Pro et orange `#ff8c38` en Moi. C'est l'asset le plus « signature » du site.

### 5.2 Les identités des apps

| App | Couleurs | Mascotte, personnages | Typo | Ton | Source |
|---|---|---|---|---|---|
| **Oshii** (recettes des réseaux) | beige, corail ; rouge Oshii `#f9403c` ; boutons `#DE3330` (back-office) ; sur le site : lueur `#ff2330` | une mascotte (« à cheval sur le bord », « qui déborde du coin ») | à confirmer | tutoiement partout | Décisions 04/11 et 11/11 ; Oshii — Dev |
| **Sago** (japonais par l'image) | V1 : landing « Night Studio », halo violet. V2 : à confirmer | **Kuro** la mascotte, **Yui** la guide ; konbini, quartier, manga café | V1 : Outfit + Noto Sans JP + IBM Plex Mono | « aucun pitch produit » | Sago — Dev ; Sago (fiche) |
| **Croc** (arrêter de se ronger les ongles) | DA « Mesuré » : crème → sauge → lavande → prune ; ombres prune ; l'or réservé à l'objet-héros | personnage 3D façon jouet en vinyle (depuis l'ép. 18) ; mascotte blob pastel (08/2025) | Bebas Neue, Baloo 2 ExtraBold (un mot), Nunito 800 | de la valeur, jamais de pub | Croc — Marketing |
| **Wado** (sport et nutrition) | crème `#FFFDF5`, encre `#172728`, vert `#285A42` ; protéines `#CF5A43`, glucides `#E2A93B`, lipides `#6E9E4A` | deux mascottes flammes : bleue (entraînement), verte (nutrition) | k15ze : TikTok Sans, Instrument Serif, Anton | gains « façon jeu vidéo » (« +630 kcal ») | Wado — Marketing ; Wado — Dev ; Décisions 08/11 |
| **Miru** (jeux de soirée) | dégradé violet | cartes de jeu avec personnages | Nunito Black italique | 18–25 ans, entre potes ; pas d'« AI slop » | Miru — Dev ; Miru — Marketing |
| **Escapades Libres** (voyages en groupe, startup) | moutarde `#E3A21A`, nuit, crème, sable, corail | globe en pâte à modeler, avions sur des pointillés, cartes postales | Cabinet Grotesk, Instrument Serif italique, Open Sauce | vouvoiement ; « ni misérabilisme ni héroïsation » | Escapades Libres — Marketing |
| Kaido (en pause) | braise `#FF6B2C`, « La forge » | — | — | — | Kaido (fiche) — à ne pas montrer sans accord |

Icônes disponibles dans `public/images/projects/` : Oshii, Zenko, Sago, Miru (icône + captures). **Il manque Croc, Wado et Escapades Libres.**

### 5.3 Autres assets du site
- **Startup Weekend** : 3 photos (`public/images/startupwknd/`, 408 Ko).
- **Sport** : 4 photos Hyrox et 3 photos Spartan (664 Ko). Les noms de fichiers (`…_socialmedia.webp`) font penser à des photos d'organisateur : *hypothèse*, droits à vérifier.
- **Destinations** : 5 photos de couverture (`Japon`, `Chine`, `Coree`, `Islande`, `Malaisie`, 1,1 Mo). Origine à confirmer. Le dossier `Chine/` est vide.
- **Icônes** Apple et TikTok (40 Ko).

### 5.4 À demander à Kenz pour les maquettes
- Une version **SVG** du monogramme KZ, et une version sombre.
- Des photos **non détourées** de Kenz en situation : au bureau ou en tournage, en voyage, au sport.
- Des **captures de ses meilleurs moments** vidéo (Malaisie budget, Shenzhen, Short iPhone) et 3 à 5 extraits verticaux courts.
- Les icônes et captures de Croc, Wado et Escapades Libres (et l'accord de l'équipe pour celle-ci).
- Le statut de Zenko.
- Les chiffres que Kenz accepte de rendre publics, avec leur date.

---

## 6. Huit pistes de concepts « signature Kenz »

Chaque piste part d'un fait réel. Les micro-interactions respectent les règles du § 2.2 : rien ne rebondit, tout se pose, aucune boucle saccadée, aucun flash, une version fixe si `prefers-reduced-motion`.

### Piste 1 — « Le point » (l'interrupteur devient le système)
- **Ancrage** : le point caché de « Kenz. » (commit du 08/06/2026) ; « une identité, deux intensités » (Décisions, 07/11).
- **Côté** : les deux ; c'est le pivot du site.
- **Idée** : le point a deux vies. En **Pro**, c'est un voyant vert « en prod ». En **Moi**, c'est le point rouge-orangé **REC** d'une caméra. Chaque mode a sa propre adresse.
- **Micro-interaction signature** :
  - un appui long de 500 ms sur le point fait se remplir un anneau autour de lui, comme le bouton d'enregistrement d'un téléphone ;
  - au relâchement, le point glisse vers le coin haut gauche et devient l'indicateur REC (ou redevient le voyant « en prod ») ;
  - la page change par un volet horizontal de 420 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, sans rebond ;
  - au clavier : Entrée ou Espace ; l'état est annoncé (« Mode créateur ») ;
  - un simple clic marche aussi (l'appui long reste un bonus).
- **À éviter** : la pulsation infinie actuelle ; l'onde qui recouvre tout l'écran (trop proche d'un flash).

### Piste 2 — « L'orchestre » (la démo des agents IA)
- **Ancrage** : le protocole `AGENTS.md` (10/10) : un coordinateur (Hermes), des rôles, une mémoire commune, « une proposition n'est pas une décision », validation par Kenz entre les étapes.
- **Côté** : Pro, page « Agents IA ».
- **Idée** : un schéma vivant d'une équipe d'agents, appliqué à **un cas client** (par exemple « préparer la vidéo de la semaine » ou « répondre aux demandes de devis »). Chaque nœud ouvre sa fiche : ce qu'il lit, ce qu'il écrit, ce qu'il n'a pas le droit de faire.
- **Micro-interaction signature** :
  - le visiteur clique sur « Lancer une demande » ; une petite pastille part du coordinateur et suit les liens (300 ms par segment) ;
  - à chaque nœud, une ligne de journal datée s'écrit en mono (« Produit · a vérifié le code · observé ») ;
  - au nœud **« Validation humaine »**, la pastille s'arrête ; un anneau fin se trace autour (un seul tracé de 1,2 s, pas de boucle) et un bouton « Valider » apparaît ;
  - tant que le visiteur ne valide pas, rien ne part : c'est le message.
- **À éviter** : un terminal décoratif ou du néon (« jamais geek ») ; parler de l'usage privé de Kenz.

### Piste 3 — « Où j'en suis » (l'atelier en direct)
- **Ancrage** : les blocs « OÙ J'EN SUIS / PROCHAINE ACTION » des fiches ; la demande de Kenz de « voir tout ce que je fais, les trucs en live ».
- **Côté** : Pro (et une version courte côté Moi : « en cours de tournage », « prochaine vidéo »).
- **Idée** : un tableau de bord public de **l'état réel des projets**. Pour chacun : la version, la dernière mise en prod, la prochaine étape, un voyant d'état (en prod, en review, en préparation, en pause). Les données viennent d'un fichier tenu par Kenz, sans secret.
- **Micro-interaction signature** :
  - chaque carte porte un voyant ; au survol, la date relative se déroule caractère par caractère en mono (« mis en prod il y a 3 j »), en 250 ms ;
  - la carte s'ouvre en tiroir sur une **frise de jalons** (comme `git log`), dont les points s'allument un par un en 40 ms chacun ;
  - aucun voyant ne clignote : un état « actif » est une couleur pleine, pas une animation.
- **À éviter** : un calendrier ou un tableau de posts (refusé le 08/11) ; un statut inventé ou non daté.

### Piste 4 — « La pastille de preuve »
- **Ancrage** : la discipline du coffre (« déclaré par Kenz », « observé le », « hypothèse ») ; la règle « des chiffres exacts, jamais inventés » ; `PROMPT-TECH.md` (« pas de techno fantôme »).
- **Côté** : Pro surtout (preuve de rigueur pour un client), et les chiffres du côté Moi.
- **Idée** : chaque chiffre du site a une petite pastille de source. On remplace les compteurs génériques par des chiffres **qui disent d'où ils viennent**.
- **Micro-interaction signature** :
  - le chiffre arrive déjà à sa valeur finale (pas de compteur qui défile) ;
  - au survol ou au focus, un trait fin se dessine dessous de gauche à droite (200 ms), puis une étiquette glisse de 4 px : « déclaré par Kenz · 09/10 » ou « relevé le 04/11 · données publiques » ;
  - un chiffre « à confirmer » s'affiche en gris avec ce libellé, au lieu d'être caché.
- **À éviter** : les chiffres géants sur un halo (« trop IA ») ; les étoiles et notes sans source.

### Piste 5 — « Les mondes des apps »
- **Ancrage** : les vraies mascottes et palettes (Kuro et Yui pour Sago ; les flammes bleue et verte de Wado ; le personnage vinyle de Croc ; la mascotte d'Oshii « à cheval sur le bord »).
- **Côté** : Pro, galerie des apps et pages d'app.
- **Idée** : chaque app est un petit monde, avec sa couleur, sa matière et son personnage. La page prend la couleur de l'app que l'on regarde. La vidéo marketing est montrée à côté du code, car Kenz fait les deux.
- **Micro-interaction signature** :
  - au survol d'une carte, la mascotte de l'app **se penche depuis le bord de la carte** (translation de 24 px et rotation de 6°, 350 ms, elle se pose sans rebondir) ;
  - en même temps, l'accent du site glisse vers la couleur de l'app en 400 ms (par exemple vers le vert `#285A42` pour Wado) ;
  - au clic, la carte s'agrandit jusqu'à devenir la page de l'app (transition partagée).
- **À éviter** : les mascottes qui rebondissent (sauf Croc, selon sa DA), les mannequins ou marionnettes, toute fonction qui n'est pas dans la note Dev.

### Piste 6 — « Le vrai prix »
- **Ancrage** : ce qui marche le mieux chez Kenz, c'est le pratique et l'argent (Malaisie budget : 725 600 vues ; l'iPhone à 10 € au lieu de 200) ; motion I2 Barré ; prochaine vidéo : le budget réel de la Chine.
- **Côté** : Moi, pages destinations et livrables pour les abonnés (guides, budgets).
- **Idée** : chaque destination s'ouvre sur **ce que ça m'a vraiment coûté**, ligne par ligne, avec les anecdotes validées.
- **Micro-interaction signature** :
  - au défilement, le prix « attendu » (200 €) est barré par un **trait tracé à la main** (SVG, 280 ms) ;
  - le vrai prix (10 €) descend de 8 px et se pose, en Instrument Serif italique ;
  - le total du séjour se remplit poste par poste, sans dépasser sa valeur finale ;
  - une version fixe sans animation est prévue.
- **À éviter** : la loupe sur le prix (refusée le 08/11) ; les montants « à compléter » affichés comme vrais. Rien n'est publié tant que Kenz n'a pas donné ses relevés.

### Piste 7 — « La carte aux tampons »
- **Ancrage** : les tampons JE CONSEILLE / FLOP / ABUSÉ et la motion R5 Itinéraire ; les flèches à la main (validées le 07/11) ; les verdicts réels de Kenz (Shenzhen « aimée, pas pour un premier voyage » ; Yuyuan « endroit préféré de Shanghai » ; le bateau de Hongya « pas indispensable »).
- **Côté** : Moi, la carte des voyages.
- **Idée** : une carte de l'Asie en pointillés, tracée à la main, sur fond crème. Chaque ville porte le verdict de Kenz sous forme de tampon. Les séries sont rangées par saison (Japon S1 et S2, Chine S1 et S2, Malaisie, Corée, puis Maurice).
- **Micro-interaction signature** :
  - en faisant glisser (ou en défilant) le long du trajet, un petit train en pâte 3D suit les pointillés ;
  - à chaque ville, le tampon **s'imprime** : il descend de 1,04 à 1 en 160 ms, l'encre apparaît, sans rebond ;
  - la ville affiche ensuite sa phrase-verdict et ouvre l'épisode lié.
- **À éviter** : la mini-carte qui porte du texte sur ses traits (« aucun texte sur un trait ou une carte ») ; le néon ; les photos de banque.

### Piste 8 — « La rafale » (et l'avis de recherche)
- **Ancrage** : le générique « rafale » de Branche-toi (7 micro-plans, puis le titre en verre ; validé, devenu O1) ; le verre réservé au titre ; le CTA d'abonnement en affiche « WANTED » (validé le 08/11).
- **Côté** : Moi, l'ouverture du mode créateur et l'appel à s'abonner.
- **Idée** : le mode Moi s'ouvre comme un épisode. Une rafale de 7 vrais plans de Kenz (moins de 2,6 s au total), puis « KENZ » en verre épais. En bas de la page, l'abonnement prend la forme d'une affiche d'avis de recherche.
- **Micro-interaction signature** :
  - **la rafale** : 7 images enchaînées par un **déclencheur photo** (deux lames qui se ferment et s'ouvrent en 90 ms, sans flash blanc). La dernière image ralentit et le titre en verre se pose dessus en 500 ms. Elle ne se joue qu'une fois par visite ; avec `prefers-reduced-motion`, on voit directement la dernière image ;
  - **l'avis de recherche** : au survol de « S'abonner », la page se fige et se désature légèrement (200 ms). Une affiche en papier entre en tournant doucement (rotation 3D de 12° à 0°, 600 ms) et se colle, avec la photo de Kenz et sa phrase.
- **À éviter** : le verre ailleurs que sur le titre (« il cache les rushs ») ; un générique plus long que 3 s ; le logo et les marques One Piece (*hypothèse* : risque de droits). On garde l'idée de l'avis de recherche, pas la marque.

---

## 7. À trancher par Kenz (réponds par un numéro)

1. **Adresse du mode créateur** : 1) `/moi` sur le même domaine ; 2) un sous-domaine ; 3) un seul site, avec le point comme seul accès (comme aujourd'hui).
2. **Tutoiement côté Pro** : 1) tutoiement partout ; 2) vouvoiement sur les pages clients.
3. **Chiffres business** (utilisateurs, téléchargements, MRR) : 1) publiés avec date et source ; 2) seulement les chiffres d'audience ; 3) aucun chiffre.
4. **Zenko** : 1) on la garde (donne l'état réel) ; 2) on la retire.
5. **Escapades Libres** : 1) étude de cas avec l'accord de l'équipe ; 2) mention anonyme (« une startup de voyage inclusif ») ; 3) on n'en parle pas.
6. **Noms internes des agents** : 1) seulement « Hermes » ; 2) les rôles sans nom ; 3) tous les noms.
7. **Lien avec Maurice** : à raconter ou non ?
8. **Lieu affiché** : garder « Paris » ou autre chose ?

---

## Sources lues
- **Coffre** (lecture seule) :
  - `Contenu/Règles de montage — Kenz.md`, `Décisions.md`, `Cockpit.md`, `Idées.md`, `Cadrage Obsidian.md`, `Mode d’emploi.md`, `README.md`, `Journal/2026-11-04.md`, `Journal/2026-10-09.md`, `Carte des apps.md`, `AGENTS.md`, `Travailler avec les agents.md` ;
  - `Projets/*.md` (Croc, Oshii, Sago, Wado, Miru, Escapades Libres, Geass OS, Kaido), plus des extraits ciblés des notes Dev et Marketing de chaque app ;
  - `Contenu/Voyage/Kenz en Asie — vue d'ensemble.md`, `Branche-toi Île Maurice — série.md`, `Kenz in Asia — atelier.md`, `Contenu/YouTube — chaîne voyage.md`, `En Bien en Asie — TikTok.md`, `Enkenz — anime et japonais.md`, `Sport & nutrition — Kenz.md`, `Business/Freelance.md`.
- **Volontairement non lus** : les notes personnelles et administratives (`Business/` hors `Freelance.md`, `Perso/`, journal personnel) et `Mes comptes & projets.md` (adresses e-mail).
- **Site** :
  - `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `styles/theme.ts`, `styles/GlobalStyles.ts` ;
  - `components/Hero.tsx`, `components/hero/hero-wordmark.tsx`, `components/Navbar.tsx`, `components/PassionReveal.tsx`, `components/Providers.tsx`, des extraits de `TechStack.tsx`, `Impact.tsx`, `ContentCreation.tsx` et `ProAchievements.tsx` ;
  - `lib/motion.ts`, `lib/socials.ts`, `contexts/mode-context.tsx`, `contexts/language-context.tsx`, `i18n/*`, `data/projects.ts` (extraits), `data/destinations.ts`, `public/sitemap-0.xml`, `PROMPT-TECH.md`, `package.json`, `next.config.ts` ;
  - `git log`, `du -sh public/*`, `sips` sur les images de marque.
