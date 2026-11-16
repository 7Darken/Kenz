# 04 — Stratégie v1 : deux casquettes, une seule personne

> **Document de travail.** Rédigé le 11/11/2026 par Claude (stratège produit et personal branding) à partir des briefs 01 (Builder), 02 (Créateur) et 03 (Marque & style). Les points douteux ont été revérifiés dans le coffre (lecture seule), dans le code du site et dans la charte du Motion Lab (section 0 bis).
> Le dossier `maquettes/` vit dans un **dépôt public**. Ce document ne contient donc ni adresse, ni identifiant, ni chemin de serveur, ni chiffre interne, ni rien de la vie privée de Kenz. Les petits nombres d'utilisateurs et les revenus des briefs ne sont pas repris ici.

**Légende des statuts**

| Marque | Sens |
|---|---|
| **[Observé jj/mm]** | relevé dans un fichier, le code ou une donnée publique à cette date |
| **[Déclaré jj/mm]** | dit ou écrit par Kenz, non vérifié dans une console |
| **[Validé jj/mm]** | décision de Kenz consignée dans `Décisions.md` |
| **[Code]** | lu dans le code (site ou dépôts des apps, via les notes Dev) |
| **[Proposition]** | choix de stratégie de ce document, à valider par Kenz |
| **[Hypothèse]** | déduction, à vérifier |
| **à confirmer** | aucune source fiable : ne rien publier sans réponse de Kenz |
| **[privé]** | ne pas publier sans accord explicite de Kenz |

---

## 0. En bref

1. **Deux sites dans un.** Côté **Pro** (`/pro/…`) : posé, clair, « je » et vouvoiement sur les pages clients [Proposition]. Côté **Créateur** (`/moi` + des URL courtes à la racine : `/asie`, `/liens`, `/itineraire/chine`) : énergique, tutoiement. Ils ont deux navigations, deux palettes et deux rythmes. Rien ne passe de l'un à l'autre, sauf quatre ponts : **le point**, `/now`, `/contact` et le pied de page.
2. **Une seule personne.** Le même wordmark « Kenz. », le même point (vert **PROD** côté Pro, rouge-orangé **REC** côté Créateur), les mêmes vraies photos et la même règle de preuve sur chaque chiffre.
3. **Le point devient la passerelle.** C'est un vrai bouton, accessible au clavier, qui mène à la **page jumelle** de l'autre casquette (par exemple Wado ↔ k15ze). Il ne se contente plus de cacher des blocs. Chaque casquette a enfin sa propre URL, partageable.
4. **La progression se lit sur trois horloges datées** : la frise des mises en prod (6 apps iOS, du 20/10/2025 au 10/10/2026), les saisons de voyage (de 2024 à Maurice) et les versions du site lui-même. Le présent est sur `/now`, le passé dans `/pro/lab`. Aucun compteur animé.
5. **Les agents IA sont présentés comme un savoir-faire à installer chez un client**, jamais comme l'usage privé de Kenz. Le site montre l'architecture, les rôles, la mémoire, les garde-fous, la vérification et l'humain dans la boucle, appliqués à 6 cas clients. Seul « Hermes » est nommé ; les autres agents ne sont désignés que par leur rôle.
6. **Les pages « livrables »** : `/livrable/[jeton]` pour chaque client (privée, avec le même format « Où j'en suis + décisions + valider » que le système de Kenz) et des guides pour les abonnés (`/itineraire/chine` existe déjà et reste à son adresse).
7. **La couche live** n'utilise que des sources réelles et sans secret côté navigateur : l'API iTunes (testée le 11/11), les flux RSS YouTube, un `now.json` tenu par Kenz, un calendrier GitHub agrégé, des requêtes HEAD sur les landings. Chaque valeur porte sa source et l'heure de son relevé. Dans les maquettes, tout est **simulé** à partir des valeurs relevées le 11/11.
8. **La vitrine IA est honnête** : deux assistants « Demande à Kenz » aux corpus séparés (pro / voyage), qui citent leurs sources et refusent le privé ; une palette ⌘K ; un schéma d'agents étiqueté « simulation » ; des pipelines rejoués ; un devis assisté. Le faux chat actuel disparaît.
9. **Le mouvement du site reprend les tokens du Motion Lab de Kenz** (`tokens.json`, observé le 11/11) : « arrive lentement, part vite », 500 ms en expo.out pour arriver, 240 ms en power3.in pour partir, intensité ×1,2 côté Pro et ×0,8 côté Créateur. C'est la preuve la plus forte que le site n'est pas générique.
10. **Cinq directions de design** radicalement différentes (section F) : *REC / PROD*, *Carnet*, *Lignes*, *Épisode*, *Matière*. Il faut d'abord prototyper *REC / PROD* et *Carnet*, qui demandent peu d'assets et portent le système le plus fort [Proposition].

---

## 0 bis. Points revérifiés pour ce document

| Point | Vérification | Conséquence |
|---|---|---|
| Langage de mouvement de Kenz | Charte du Motion Lab v2.0 (07/11) et `01_Noyau/tokens.json` lus le 11/11 : arrivée `expo.out` 0,5 s ; sortie `power3.in` 0,24 s ; mot à mot (flou 8 px, 0,14 s, 0,07 s d'écart) ; carte (+34 px, de 0,965 à 1, 0,55 s) ; flèche 0,38 s + pointe 0,14 s ; posé ×1,2 sans « coup de poing », énergique ×0,8 avec +4 %. Interdits écrits : rebond, flottement, pulsation, « fondu + glissé vers le haut partout ». | Base commune de toutes les directions (F0) |
| Couleurs et typo validées | Charte : crème `#F4EFE6`, encre `#1A1918`, rouge `#E8322B` (**un seul** élément rouge à l'écran), jaune `#FFE600` réservé à l'énergique ; Melodrama 600 (Fontshare, licence ITF FFL), Inter Display (Inter, axe opsz 32), Instrument Serif italique pour **un** mot. | Palettes de F ; Melodrama n'est pas sur Google Fonts, d'où une option « hors Google » |
| Wado | Décision du 11/11 : Wado vise **la muscu en salle** ; street workout et maison sont mis de côté (code gardé). Le brief 01 parle encore de street workout. | L'étude de cas Wado suit la décision du 11/11 |
| Rôles des agents | `AGENTS.md` (v1, 10/10) : un coordinateur (Hermes), un rôle produit/code, un rôle contenu/marketing, un rôle recherche. | Côté site, le rôle « recherche » est présenté de façon générique (« veille et recherche sourcée »), sans surnom ni exemple réel |
| Offre freelance | `Business/Freelance.md` (09/10) : statut « à cadrer » ; qualité et marketing plutôt que volume ; validation visuelle par Kenz ; « pas de prospection, email ou build autonome ». | Les offres restent des **hypothèses** ; aucune promesse d'« usine autonome » |
| Atelier vidéo | `Montage programmatique.md` : « pas un SaaS autonome ». | Présenté comme un savoir-faire et un service, pas comme un produit |
| Itinéraire Chine | Décision du 28/10 : itinéraire publié sur le site et lié dans la description YouTube ; la page n'est pas dans ce dépôt (brief 02). | `/itineraire/chine` est une URL à **conserver telle quelle** |
| Rangement des contenus | Décision du 08/11 : pas de tableau ni de calendrier des posts. | Le côté Créateur range par séries puis par épisodes |
| Accords du site actuel | `i18n/dictionaries/fr.ts` : « Créateur de Contenu », « Globe Trotteur », « Athlète Hybride », « Passionné… », « Développeur Full Stack ». | Ce sont les formes à reprendre dans la copie en « je » |
| Routes actuelles | `app/` : `/`, `/apps/[slug]`, `/projets/[slug]`, `/destination/[slug]`, `/api/contact` ; dernier commit le 08/06/2026. | Plan de redirections (C3) |

---

## A. Positionnement

### A1. Une personne, deux casquettes

| Axe | **Pro** — AI engineer, fullstack, solopreneur | **Créateur** — Kenz en Asie et les autres univers | Commun (la personne) |
|---|---|---|---|
| Promesse | « Je conçois, code et mets en production des apps où l'IA fait le vrai travail, et les systèmes d'agents qui m'aident à les construire. » (brief 01) | « Le voyage tel que je le vis, et ce qu'il m'a vraiment coûté. » [Proposition, d'après « le pratique bat le vlog », observé 04/11] | Le concret d'abord : un geste, un prix, un écran, un résultat |
| Intensité | **Posée** (règle « YouTube posé ») | **Énergique** (règle « TikTok énergique ») | « Une identité, deux intensités » [Validé 07/11] |
| URL | `/pro/…` | `/moi`, plus des URL courtes à la racine : `/asie`, `/liens`, `/itineraire/chine`, `/k15ze` | `/`, `/now`, `/contact`, `/a-propos` |
| Navigation | Apps · Agents IA · Services · CV · bouton « Demander un devis » | Asie · Guides · k15ze · Sport · Collaborer (barre basse au pouce sur mobile) | Le point, le sélecteur de langue, le pied de page |
| Ton | « je », phrases nettes, vocabulaire de métier expliqué ; **vouvoiement** sur services, devis et livrables [Proposition, à trancher] | « je », oral, tutoiement, verdicts courts (« JE CONSEILLE », « FLOP », « ABUSÉ ») | Jamais de pub, jamais de superlatif sans preuve |
| Couleur du point | vert **PROD** (un voyant « en production ») | rouge-orangé **REC** (le point d'enregistrement d'une caméra) | La forme du point et sa place dans « Kenz. » |
| Preuves | versions en direct, stack réelle, tests, décisions datées | vues et abonnés datés, séries, prix vécus validés | La pastille de preuve sur chaque chiffre |

**Pourquoi les séparer autant ?** Kenz l'a demandé dès le cadrage du 09/10 (« ne pas mélanger toutes ses passions sur une seule chaîne ») et l'a répété le 11/11. Aujourd'hui, l'abonné qui arrive de TikTok tombe sur la page « développeur » et doit deviner qu'il faut cliquer sur un point (brief 03, § 4.8). Le client, lui, retrouve le mode « Moi » s'il a cliqué une fois. Deux adresses règlent ces deux problèmes.

### A2. Ce qui ne traverse jamais

- **Aucun contenu voyage dans la navigation Pro.** Une seule ligne dans `/a-propos` et `/pro/cv` peut dire « je fais aussi de la vidéo de voyage ». Elle a une vraie valeur pro (savoir-faire contenu et marketing) et pointe vers le côté Créateur par le point.
- **Aucune app dans la navigation Créateur.** Wado peut apparaître sur `/k15ze` comme dans les vidéos : « montré naturellement, jamais en pub » [Validé 15/10]. Un lien discret « Kenz côté pro » en bas de `/liens` suffit.
- **Aucun outil interne côté Créateur.** Les coulisses du montage restent côté Pro (`/pro/video`) [brief 02, annexe B].
- **Les comptes produits** (UGC recettes d'Oshii, Du Bleu au Violet pour Miru, Croc) ne sont **pas** côté Créateur. Ils ne vont côté Pro, comme étude d'acquisition, qu'avec l'accord de Kenz : le compte UGC n'est pas présenté comme celui de Kenz [brief 02, § 1.5].
- **Jamais publié, nulle part** : les démarches personnelles et les automatisations privées qui s'y rattachent, le journal, les notes « Perso », la famille, les points de sécurité des apps, les adresses, les clés, les identifiants de projets et les URL de consoles.

### A3. La passerelle

1. **Le point.** C'est un lien accessible (« Passer côté créateur » / « Passer côté pro »), au clavier comme au toucher. Son état est annoncé. Il mène à la **page jumelle** :

| Page Pro | Page jumelle Créateur | Raison |
|---|---|---|
| `/pro` | `/moi` | hub ↔ hub |
| `/pro/apps/wado` | `/k15ze` | la même vie sportive, dans deux registres |
| `/pro/apps/sago` | `/enkenz` (si Kenz le classe côté Créateur) sinon `/asie/japon` | le japonais |
| `/pro/video` | `/asie` | « comment je monte mes vidéos » ↔ les vidéos |
| `/pro/cv` | `/moi` | — |
| toute autre page | le hub de l'autre côté | règle par défaut |

2. **L'accueil `/`** est un carrefour à deux portes. Il est pensé pour les visiteurs qui connaissent Kenz : les autres arrivent directement sur `/pro`, `/liens` ou un guide.
3. **`/now`** montre les deux casquettes au présent, dans deux colonnes clairement séparées.
4. **`/a-propos`** raconte une personne, deux casquettes, et contient le colophon (versions du site, sources live, fonctionnement de l'assistant).
5. **Le pont narratif** se résume en une phrase, sans mélanger les contenus : « Je construis l'app, et je fais la vidéo qui la fait connaître. » (brief 03, § 1.6).

### A4. Montrer la progression

| Horloge | Ce qu'elle montre | Où | Faits sourcés |
|---|---|---|---|
| **Mises en prod** | la frise des apps et des systèmes | `/pro` (frise), `/pro/cv`, chaque étude de cas (versions) | Zenko 20/10/2025 → Oshii 06/11/2025 → Sago 08/04/2026 → Miru 17/04/2026 → Croc 23/09/2026 → Wado 10/10/2026 [Observé 11/11, API iTunes] ; protocole humain + agents v1 le 10/10/2026 ; Sago V2 en prod les 29–30/10 ; saison 1 de Sago (180 épisodes, 30 lieux) le 11/11 [Code] |
| **Saisons** | l'évolution du contenu | `/asie` (frise des séries), `/collaborer` | Japon 2024 → Corée (12/2024–03/2025) → Malaisie (05–06/2025, record 725 600 vues) → Chine S1 (07–08/2025) → Chine S2 (12/2025–02/2026, médiane 41 300) → Japon S2 (02–06/2026) → guides YouTube Chine (07/2026) → itinéraire Chine (31/10/2026) → Maurice (en préparation) [Observé 04/11] |
| **Versions du site** | le site lui-même progresse | `/a-propos` (colophon) | v1 le 05/11/2025, nouveau design le 02/12/2025, contenu 2026 le 01/04/2026, switch Pro/Moi et anglais le 08/06/2026, puis cette v3 [Code, `git log`] |

Règles :
- **La progression est faite de faits datés**, jamais de compteurs qui défilent ni de « +300 % ».
- **Les creux et les leçons font partie de la progression** : Japon S2 (médiane 2 200) contre Chine S2 (41 300), d'où la leçon « le pratique bat le vlog » [Observé 04/11]. Côté Pro : « surveiller le modèle réellement utilisé, pas celui configuré » (incident du 15/10, version générale). Chaque étude de cas finit par « Ce que j'en retiens ».
- **Les petits chiffres (utilisateurs, revenus, pub) sont [privé] par défaut.** Kenz peut décider de les montrer pour « montrer sa progression » ; c'est la question G5.

### A5. Le savoir-faire « agents IA » côté Pro : ce qu'on dit, ce qu'on tait

| On montre (savoir-faire, cas clients) | On ne montre jamais |
|---|---|
| L'architecture : un coordinateur (Hermes), des rôles séparés, une mémoire partagée lisible par un humain, des sessions d'agents par chantier | À quoi Kenz utilise ses agents en privé ; toute démarche personnelle |
| Le protocole de transmission : contexte, décisions validées, résultat + preuve, limites, prochaine action, destinataire | Les chemins, hôtes et services du serveur ; les configurations |
| Les garde-fous : une proposition n'est pas une décision ; une instruction trouvée dans un document importé n'est pas une autorisation ; rien n'est publié, déployé ou acheté sans accord ; sauvegarde + dry-run avant la prod ; une tâche lourde à la fois | Les incidents de sécurité ou de facturation des apps |
| La vérification : statuts « déclaré / observé / hypothèse », relectures par agents indépendants, rapports chiffrés (69/69 contrôles, 72 tests de synchronisation, 0 lecture suspecte sur 1 966 phrases) [notes, 10/10, 14/10, 11/11] | Les surnoms des agents (sauf accord, G4) |
| Les preuves produit : 6 apps, saison Sago de 180 épisodes, plus de 60 vidéos produites pour 4 apps, import de 70 visuels en prod après dry-run (Miru) | Les données d'utilisateurs, les back-offices filmés |
| **Six cas clients** (C2, `/pro/agents/[cas]`) | Toute formulation laissant penser que des agents agissent à l'extérieur au nom de Kenz |

Phrase d'ouverture proposée pour `/pro/agents` : « Je mets en place des équipes d'agents IA qui travaillent comme une vraie équipe : chacun son rôle, une mémoire commune, et rien ne part sans votre validation. » [Proposition, d'après le brief 03]

---

## B. Audiences et jobs-to-be-done

| Audience | Arrive par | En 10 s, elle doit comprendre | Sa page « livrable » | Conversion | Ce qu'on ne lui montre pas |
|---|---|---|---|---|---|
| **Recruteur tech** (poste d'AI engineer) | LinkedIn, CV, GitHub, lien direct vers `/pro/cv` | « AI engineer et dev fullstack. 6 apps iOS en prod (vérifiable en direct). Des LLM en production : vidéo → recette, photo → macros, thèmes générés en streaming. Sait cadrer des agents avec des garde-fous. » | `/pro/cv` : CV interactif où chaque compétence mène à sa preuve, parcours daté, distinction (Startup Weekend), version PDF | Télécharger le PDF · formulaire « recrutement » · LinkedIn | Rien de la situation personnelle de Kenz ; les contenus voyage (une ligne au plus) |
| **Client freelance ou studio** qui veut une app ou des agents IA | bouche-à-oreille, LinkedIn, recherche, lien envoyé par Kenz | « Kenz peut livrer mon app ou installer des agents IA chez moi, avec un process clair, des preuves, et ma validation à chaque étape. » | `/pro/services` puis `/pro/agents/[cas]` ; après le premier échange, `/livrable/[jeton]` | Demande de devis assistée (`/pro/devis`) ; appel découverte (à confirmer) | Les usages privés ; des prix non fixés ; tout ce qui est interne |
| **Pair développeur** | GitHub, réseaux, étude de cas partagée | « Des choix d'architecture vérifiés et pas banals : aucune génération à l'exécution (Sago), file BullMQ + SSE (Miru), provider factice pour les tests (Wado), tests par propriétés, contrats zod partagés. » | `/pro/apps/[app]#sous-le-capot`, `/pro/agents#pratiques` | Partager, suivre sur GitHub, « échanger » via le contact | — |
| **Abonné voyage** arrivant de TikTok, sur mobile | lien en bio, description YouTube, URL dite dans une vidéo | « C'est bien Kenz d'En Bien en Asie. Voilà le guide promis, et la dernière vidéo. » | `/liens`, puis `/itineraire/chine` (et les futurs guides) | Ouvrir le guide, s'abonner sur YouTube, partager | Le côté Pro (un lien discret en bas de `/liens`) |
| **Marque ou partenaire** | TikTok, YouTube, lien « Collaborer » | « Une audience datée et sourcée ; des sujets qui marchent (budget, pratique, Chine) ; des formats intégrables ; aucun faux logo. » | `/collaborer` (media kit, version PDF) | Formulaire collab : marque, format, période, budget indicatif | Les données privées de Studio ; tout partenariat inventé |
| **Kenz** | favori, `/atelier` | « Où en est chaque chantier, ce qui est en ligne, ce qui attend ma décision, ce qui a cassé. » | `/now` (public) + `/atelier` (privé, authentifié) | Valider la note de la semaine ; répondre aux questions à trancher | — |
| **Un proche** ou quelqu'un qui connaît Kenz | lien direct | « Ce que Kenz fait en ce moment, des deux côtés. » | `/` puis `/now` | Partager un lien | — |

---

## C. Architecture

### C1. Plan du site

Les pages Créateur ont des URL courtes à la racine, faciles à dire dans une vidéo (« lien : kenzenbien.fr/chine… »). Elles utilisent pourtant le **layout Créateur** (groupe de routes Next.js `(createur)`). Les pages Pro sont toutes sous `/pro`, avec le **layout Pro** (groupe `(pro)`).

```
kenzenbien.fr
├─ /                               Accueil carrefour : deux portes + « En ce moment »          [commun]
├─ /now                            En direct, deux colonnes Pro | Créateur                      [commun]
├─ /contact                        Contact par intention                                        [commun]
├─ /a-propos                       Une personne, deux casquettes + colophon                     [commun]
│
├─ /pro                            Hub Pro                                                      [Pro]
│  ├─ /pro/apps                    Apps et études de cas
│  │  └─ /pro/apps/[app]           oshii · sago · wado · croc · miru · zenko · escapades-libres* · ce-site
│  ├─ /pro/agents                  Systèmes d'agents IA et automatisation (schéma interactif)
│  │  └─ /pro/agents/[cas]         veille · contenu · back-office · agents-de-code · llm-produit · memoire-equipe
│  ├─ /pro/video                   Automatisation de contenu vidéo (atelier programmatique)
│  ├─ /pro/services                Offres, process, principes, FAQ
│  ├─ /pro/devis                   Demande de devis assistée
│  ├─ /pro/cv                      CV interactif, page recruteur (+ /pro/cv.pdf)
│  └─ /pro/lab                     Archives et premières apps
│
├─ /moi                            Hub Créateur                                                 [Créateur]
├─ /asie                           Kenz en Asie (hub)
│  ├─ /asie/[pays]                 chine · japon · malaisie · coree · hong-kong · taiwan · abu-dhabi · suisse · islande · maurice (à venir)
│  └─ /asie/series/[serie]         branche-toi-japon · branche-toi-chine · en-bien-en-malaisie · dans-le-bon-en-coree · branche-toi-maurice
├─ /guides                         Ressources pour les abonnés (index)
│  ├─ /itineraire/chine            EXISTE (lié depuis YouTube) : adresse conservée
│  ├─ /avant-de-partir/chine       checklist (matière déjà sourcée)
│  └─ /budget/chine                vide tant que la vidéo « budget réel » n'est pas sortie
├─ /k15ze                          Sport, nutrition, lifestyle
├─ /sport                          Hyrox, Spartan, boxe
├─ /enkenz                         Anime et japonais (à trancher, G8)
├─ /liens                          Link-in-bio mobile
├─ /collaborer                     Media kit marques (+ /collaborer.pdf)
│
├─ /livrable/[jeton]               Pages livrables clients : privées, noindex                   [privé]
├─ /livrable/demo                  Exemple avec un client fictif, étiqueté comme tel
├─ /atelier                        Vue de Kenz : privée, authentifiée                           [privé]
└─ /en/…                           Version anglaise, même arborescence (à confirmer, C6)
```

### C2. Contenu de chaque page, état vide, état live

| URL | Contenu | État vide (honnête) | État live |
|---|---|---|---|
| `/` | « Kenz. » ; **porte Pro** (« Je construis des apps où l'IA fait le vrai travail. Six sont sur l'App Store. ») ; **porte Créateur** (« Je voyage en Asie et je raconte ce que ça coûte vraiment. ») [Proposition] ; bande « En ce moment » (3 lignes de `now.json`) ; pied de page | Si `now.json` a plus de 14 jours : « Pas de nouvelle publiée depuis le [date]. » | Dernière version d'app publiée, dernière vidéo YouTube |
| `/pro` | Pitch en une ligne + trois lignes (brief 01, § 1) ; 6 apps avec leur version en direct ; trois entrées (Apps, Agents IA, Services) ; frise des mises en prod ; extrait de `/now` côté Pro ; boutons Devis et CV | Une app sans réponse de l'API garde sa dernière valeur connue, avec sa date | Versions et « mise à jour il y a N j » des 6 apps |
| `/pro/apps` | Index : 6 apps iOS, Escapades Libres (si accord), le site ; filtres (avec IA / sans IA, plateforme, statut) ; Lab en bas | Escapades Libres absente tant que l'accord manque, sans case vide | Une pastille d'état par carte (en ligne / mise à jour récente / hors ligne) |
| `/pro/apps/[app]` | Problème, public, ce que j'ai construit, **IA en détail** (ou « pas d'IA, et pourquoi » pour Croc), sous le capot (stack), défis techniques, chiffres avec pastille, frise de versions, vidéos de lancement (si accord), liens publics, « Ce que j'en retiens ». Contenu par app en C4 | Note App Store masquée sous 5 avis ; sans capture récente : icône + « captures à venir » (pas de V1 de Sago) | Version, date, notes de version (iTunes) ; landing en ligne (HEAD) |
| `/pro/agents` | Ouverture (A5) ; **schéma interactif** (E3) ; rôles (ce que chacun lit, écrit, n'a pas le droit de faire) ; mémoire et protocole ; **10 pratiques démontrables**, chacune avec sa preuve (brief 01, § 3.7) ; 6 cas clients ; « Comment je l'installe chez vous » en 5 étapes ; incidents et leçons (version générale) ; FAQ (données, coûts, modèles, sortie de la mission) | — | Option : « journal de l'atelier » validé par Kenz (D1) |
| `/pro/agents/[cas]` | Pour chaque cas : le besoin du client, l'équipe d'agents proposée, le circuit, les garde-fous, ce que le client valide, le livrable, la preuve chez Kenz. Les 6 cas : **veille sourcée**, **production de contenu marketing**, **back-office et opérations**, **agents de code pour une petite équipe**, **intégrer un LLM dans un produit**, **mémoire d'équipe et reprise** (brief 01, § 3.8) | Le « support de premier niveau » reste absent tant qu'aucun cas réel n'existe [Hypothèse du brief 01] | — |
| `/pro/video` | Le circuit : brief → montage programmatique → aperçu → voix de Kenz (−16 LUFS) → rendu unique → publication par l'humain ; règles (fonctions réelles, pas de faux chiffres) ; bibliothèque de motions nommées ; avant/après « brief → vidéo » ; volumes datés (Croc 31 épisodes, Wado/k15ze 19 vidéos, Sago 14 vidéos et des carrousels) [notes 04–11/11] | Sans accord pour les vidéos : schéma et captures fixes seulement | — |
| `/pro/services` | Offres **en hypothèse** (G13) : agents IA pour votre équipe ; intégration IA dans votre produit ; MVP mobile de l'idée au store ; atelier contenu programmatique ; back-office et analytics produit ; audit et reprise de code assistée. Process en 5 temps : cadrage → maquettes → construction → validation → passation. Principes : « vous ne voyez que votre livrable », « chaque affirmation vérifiée », « rien n'est publié sans votre feu vert ». FAQ | Prix : « sur devis » tant que Kenz n'a rien fixé | Disponibilité lue dans `now.json` (formulation de Kenz) |
| `/pro/devis` | Devis assisté (E5) ; repli sur un formulaire classique ; confirmation qui dit le délai de réponse (à confirmer) | Assistant en pause (budget du jour atteint) : formulaire classique, sans perte | — |
| `/pro/cv` | Résumé en 60 s ; compétences groupées (brief 01, § 4) où chaque compétence mène à sa preuve ; parcours daté (les lignes « à confirmer » restent masquées tant que Kenz n'a pas validé) ; distinction Startup Weekend (date à confirmer) ; langues ; PDF ; mode impression | — | Nombre d'apps en ligne, dernière mise en prod |
| `/pro/lab` | Zenko (pipeline JSON fiabilisé, sans les statistiques non sourcées) ; l'idée du cockpit d'agents v1 → mémoire Markdown v2 (sans montrer l'ancien site) ; les versions du site | Kaido et les autres : absents tant que Kenz ne décide pas (G7) | — |
| `/moi` | Ouverture du côté Créateur (selon la direction) ; univers : Kenz en Asie, k15ze, Sport (Enkenz selon G8) ; dernière vidéo ; guides ; Collaborer | — | Dernière vidéo de chaque chaîne (RSS) |
| `/asie` | Promesse ; pays filmés (9, observé) ; séries rangées par saison ; top vidéos (liens publics) ; guides ; « En préparation : Branche-toi Île Maurice » ; chiffres datés (TikTok ≈ 28 000 abonnés [Déclaré 09/10], 392 vidéos et 7,83 M de vues [Observé 04/11], YouTube 1 530 abonnés [Observé 04/11]) | — | Dernière vidéo YouTube et dernier Short (RSS) |
| `/asie/[pays]` | Séries tournées, villes **sourcées** uniquement, verdicts validés (pour la Chine : Yuyuan le soir, Palais d'Été au coucher du soleil, Hongyadong depuis la place, Skywalk le soir), « le vrai prix » (Chine : prix vécus validés), meilleures vidéos, guides liés. **Aucune photo de banque** | « Pays filmé : la page arrive » + les vidéos existantes ; jamais de lieux inventés (Nara, Langkawi, Penang, Bornéo, Jeju restent absents tant qu'ils ne sont pas sourcés) | Dernière vidéo liée au pays (filtre RSS par mot-clé) |
| `/asie/series/[serie]` | La saison, les épisodes dans l'ordre, la meilleure vidéo, la médiane datée, le format (accroche 0–3 s, générique « rafale », épisode, « ABONNE TOI ») | Maurice : « Générique prêt, tournage à venir » | — |
| `/guides`, `/itineraire/chine`, `/avant-de-partir/chine`, `/budget/chine` | Itinéraire de 14 jours (Pékin → Chongqing + Wulong → Shanghai ; Shenzhen et Guangzhou en option pour un 2ᵉ voyage) ; checklist (internet et VPN, paiement mobile, traducteur, billets nominatifs, temples fermés le lundi) ; budget | `/budget/chine` : « La vidéo budget réel est en préparation. En attendant, ce que certains postes m'ont coûté : … » (prix vécus validés uniquement) | — |
| `/k15ze` | Promesse (manger plaisir en sèche, doses exactes) ; « ni coach ni expert » ; formats ; Shorts récents | Abonnés inconnus : ne rien afficher plutôt que « 0 » | Derniers Shorts (RSS) |
| `/sport` | Hyrox Paris (31/05/2025), Spartan (06/2025), boxe depuis le 14/10/2026 ; vidéo « Mon premier HYROX sans entraînement » | Photos d'organisateur en attente de droits : cadres vides élégants plutôt que des images non autorisées | — |
| `/liens` | Pensée d'abord pour un mobile à 390 px. Dans l'ordre : dernière vidéo, guide du moment, 4 à 6 liens au plus, réseaux, Collaborer, lien discret « Kenz côté pro » | Sans guide du moment : la vidéo la plus vue de la saison | Dernière vidéo (RSS) |
| `/collaborer` | Audience par plateforme, datée ; sujets qui marchent ; 3 à 5 études de cas tirées des vidéos de Kenz (budget Malaisie, Chine S2) ; formats intégrables (un épisode Branche-toi, un chapitre de guide, un Short) ; zone (Asie, puis Maurice) ; formulaire ; PDF | Audience (âge, pays) : « sur demande » tant que Kenz ne l'a pas extraite de Studio | Abonnés YouTube (API, arrondis par YouTube) |
| `/now` | Pro : « Cette semaine je construis », état des apps, dernière mise en prod, activité de code agrégée. Créateur : dernière vidéo, en préparation, lieu (selon G9). Journal public validé | « Rien de nouveau publié cette semaine — mis à jour le [date] » | Toutes les sources de D1 |
| `/contact` | Une question d'abord, « Vous venez pour… » : un projet (→ devis), un recrutement (→ formulaire court + CV), une marque (→ collaborer), une question voyage (→ assistant voyage ou guides), autre. Envoi par la route actuelle `/api/contact`. Aucune adresse en clair | — | — |
| `/a-propos` | Une personne, deux casquettes ; colophon : versions du site, sources live, fonctionnement de l'assistant, accessibilité | — | Dernier déploiement du site |
| `/livrable/[jeton]` | C5 | Jeton expiré : « Ce lien a expiré, écrivez-moi pour un nouveau. » | État du projet du client |
| `/atelier` | Tout ce que montre `/now`, plus : les questions à trancher, les brouillons de la note de la semaine à valider, l'état des services, des liens rapides vers ses outils (configurés hors du dépôt public) | — | Tout |

### C3. Redirections et URL existantes

| Ancienne URL | Nouvelle | Note |
|---|---|---|
| `/apps/[slug]` | `/pro/apps/[slug]` (301) | La page la plus riche du site actuel ; elle sert de base aux études de cas |
| `/projets/[slug]` | `/pro/apps/[slug]` (301) | Encore présente dans le sitemap |
| `/destination/[slug]` | `/asie/[pays]` (301) | |
| `/itineraire/chine` | **inchangée** | Liée dans la description de la vidéo du 31/10 ; sa source de déploiement est à confirmer (brief 02) |
| `?lang=en` | `/en/…` | Pour que l'anglais soit indexable (`hreflang`). Cela change la convention actuelle : à confirmer |
| Mode gardé dans le navigateur (`kenz-mode`) | supprimé | Les deux URL remplacent l'état caché |

### C4. Les études de cas : angle, preuve, live

| App | Angle de l'étude de cas | Preuves (statut) | Live | À confirmer ou [privé] |
|---|---|---|---|---|
| **Oshii** | Une vidéo TikTok devient une recette pesée : partage natif → audio → Whisper → LLM (OpenAI ou Gemini) → fiche ; repli Whisper si l'analyse directe échoue | iOS + Google Play [Observé 11/11] ; environ 3 700 tests [Code 10–11/11] ; drapeaux de fonctions maison [Code] | iTunes `6754848905` | Le chiffre public (≈ 10 000 téléchargements ou ≈ 12 000 personnes, écart à trancher) ; retirer « 4.9 / 1 200 avis » (l'App Store FR affiche 3,5 sur 10 notes, observé le 11/11) ; lier l'UGC à Kenz : non par défaut |
| **Sago** | **Aucune génération à l'exécution** : du contenu écrit avec des agents, compilé, validé, publié, activé et réversible ; voix VOICEVOX contrôlées (1 966 phrases, 0 lecture suspecte) | Saison 1 : 180 épisodes, 30 lieux, 5 arcs [Code 11/11] ; serveur : 260 tests et 93 % de couverture [Code 11/11] | iTunes `6759610780` | Contenu au statut « brouillon » (pas encore relu par une personne native) ; captures V1 à retirer |
| **Wado** | Gemini vision reconnaît le plat et calcule les macros, avec un provider `mock` hors ligne et un quota de 2 analyses par jour ; moteur de charges ; **muscu en salle** [Validé 11/11] | 14 widgets iOS, 120 recettes, 60 migrations [Code 04/11] ; sortie le 10/10/2026 [Observé 11/11] | iTunes `6813179120` | Le « panier » et le « + » tant qu'ils ne sont pas dans l'app publiée |
| **Croc** | **Pas d'IA, et c'est un choix** : logique pure et testée, analytics produit maison (J1/J7/J30), synchro hors ligne, Skia | v1.2.1 [Observé 11/11] ; 1.3.0 codée [Code 11/11] | iTunes `6801541157` | Chiffres d'acquisition [privé] |
| **Miru** | Thèmes de jeu générés en direct (SSE) via une file BullMQ avec quota ; temps réel Socket.IO + Redis ; mode TV ; invité depuis le navigateur | 9 jeux en V2 [Code 04/11] | iTunes `6761622088` | V2 réellement en ligne (l'App Store affiche 2.0 depuis le 30/10, alors que les notes du 04/11 disaient l'inverse) |
| **Zenko** (Lab) | Plan de voyage typé en JSON avec GPT-4o-mini, extraction et réparation du JSON | v1.0 du 20/10/2025, jamais mise à jour [Observé 11/11] | iTunes `6753706200` | Statut de l'app ; statistiques du site actuel à retirer |
| **Escapades Libres** | MVP web d'une startup : formulaire versionné, test de personnalité, RGPD santé (consentement, chiffrement, audit), accessibilité testée (Playwright + axe) | MVP en prod le 02/11 [Code] | — | Accord de l'équipe, rôle exact de Kenz, nom de la fondatrice non publié |
| **Ce site** | Live sans secret côté navigateur, assistant à corpus public, mouvement tiré des tokens vidéo de Kenz | — | Dernier déploiement | — |

### C5. Les pages « livrables »

**Pour les clients — `/livrable/[jeton]`.** C'est le protocole de Kenz appliqué au projet d'un client, et donc la meilleure démonstration du savoir-faire « agents » sans en raconter l'usage privé.
- **Où j'en suis** : état daté, prochaine action, « à vous » (ce qui attend le client), limites. C'est le format du bloc « OÙ J'EN SUIS » du coffre.
- **Décisions** : une ligne datée par arbitrage, pour ne jamais redécider trois fois la même chose.
- **Livrables** : maquettes, builds de test, vidéos, documents. Chacun porte un statut : brouillon → à valider → validé → en ligne (« une preview n'est pas une publication »).
- **Bouton « Valider »** sur chaque livrable : il enregistre la date et le nom du valideur. L'humain dans la boucle, côté client.
- **Planning** par jalons datés, **risques et non-vérifiés**, contact direct.
- **Règles** :
  - `noindex` ; jeton long et non devinable ; expiration ;
  - rien d'interne : « le prospect ne voit que son livrable » (leçon du 17/09) ;
  - aucun visuel sans droits vérifiés ;
  - **les données clients ne sont jamais dans le dépôt public** (base privée, accès serveur seulement).
- **Maquette** : `/livrable/demo`, avec un client fictif étiqueté « Exemple — client fictif » sur chaque écran.

**Pour les abonnés.** Les guides (`/itineraire/chine` existe ; checklist et budget à venir), `/liens`, puis plus tard une page de série pour Maurice. Règle : uniquement du vécu validé par Kenz, jamais une photo de banque présentée comme une preuve. Les ebooks « En Bien » ne sont plus le cap [Déclaré 09/10] : ne pas les présenter comme existants. Newsletter : elle n'existe pas (G14).

### C6. Navigation et composants communs

- **Barre Pro** (en haut, en texte) : Apps · Agents IA · Services · CV · [Demander un devis] · ⌘K · langue · le point.
- **Barre Créateur** (en bas sur mobile, au pouce ; en haut sur ordinateur) : Asie · Guides · k15ze · Sport · Collaborer · recherche · le point.
- **Menus** : ils s'ouvrent au clic et au clavier, avec `aria-expanded`, plus jamais au seul survol (défaut actuel, brief 03, § 4.6).
- **Pied de page commun** : « Kenz. — une personne, deux casquettes », `/now`, `/contact`, `/a-propos`, langue.
- **i18n** : FR d'abord, EN avec les mêmes clés (convention du projet : dictionnaires + `Localized<T>`). Chaque texte des maquettes est prévu en FR et en EN.

---

## D. La couche « live »

### D1. Ce qui s'affiche en direct, et d'où ça vient

| Donnée | Où elle s'affiche | Source réelle en production | Fréquence | Confidentialité |
|---|---|---|---|---|
| Version, date de mise à jour, notes de version, captures des 6 apps | `/pro`, `/pro/apps`, études de cas, `/now` | **API iTunes Lookup**, sans clé, 6 identifiants en une requête, vitrine `fr` (testée le 11/11 par le brief 01) | revalidation toutes les 6 h | Note masquée sous 5 avis |
| Landing en ligne ou hors ligne | cartes d'apps | requête `HEAD` côté serveur | 1 h | Ne renvoie que « en ligne / hors ligne » |
| Santé des API des apps | `/atelier` (et `/now` si Kenz le veut) | les points `/health` existants, appelés par un **proxy serveur** qui ne renvoie que up/down | 5 min | Les hôtes ne sortent jamais du serveur [privé] |
| Dernière vidéo longue, derniers Shorts (Kenz in Asia, k15ze) | `/`, `/moi`, `/asie`, `/k15ze`, `/liens`, `/now` | **Flux RSS YouTube** `feeds/videos.xml?channel_id=…`, sans clé ; il donne titre, date, miniature et vues | 1 h | Identifiants de chaînes à relever (publics) |
| Abonnés YouTube | `/collaborer`, `/asie` | YouTube Data API v3, clé côté serveur ; le nombre est arrondi par YouTube | 24 h | Clé en variable d'environnement |
| Abonnés et vues TikTok | `/asie`, `/collaborer` | Pas de statistiques publiques. Possible avec une app TikTok validée (portée « user.info.stats ») [Hypothèse, à évaluer] ; sinon une **saisie manuelle datée** dans `now.json` | à chaque saisie | — |
| Activité de code | `/now`, `/pro` | Calendrier de contributions GitHub **agrégé** (GraphQL, jeton en lecture seule côté serveur) : aucun nom de dépôt ni message de commit ; seul le dépôt public du site peut afficher son dernier commit | 6 h | Le jeton reste sur le serveur [privé] ; prise en compte des contributions privées à vérifier |
| « Cette semaine je construis » | `/`, `/now`, `/pro` | **`now.json`** tenu par Kenz (3 lignes au plus, datées, avec statut) | à chaque merge | Uniquement des projets publics |
| Journal public de l'atelier (option, G11) | `/now`, `/pro/agents` | Un brouillon **préparé par un agent** à partir des notes, filtré sur les projets publics, **proposé en pull request et publié seulement quand Kenz fusionne**. Démonstration vivante de l'humain dans la boucle | hebdomadaire | Liste blanche de projets ; jamais de texte brut du coffre |
| « En préparation » | `/asie`, `/now` | `now.json` (exemple : « Branche-toi Île Maurice : générique prêt, tournage à venir ») | à chaque merge | — |
| Pays actuel | `/now` (selon G9) | `now.json`, **déclaré**, au niveau du pays, avec un délai si Kenz le veut ; jamais de géolocalisation | à chaque merge | Sécurité : par défaut, « dernier pays filmé » plutôt que la position du moment [Proposition] |
| Version du contenu de Sago, nombre d'épisodes | étude de cas Sago | petite route publique à créer côté backend, agrégée, sans données de joueurs | 6 h | [privé] tant que Kenz n'a pas dit oui |
| Dernier déploiement du site | `/a-propos` | API de l'hébergeur ou date de build | à chaque build | — |

### D2. Mise en œuvre conseillée

- **Une seule forme pour toute valeur affichée**, live ou non : `{ valeur, source, statut: observé | déclaré | hypothèse | à confirmer, releve_le, lien }`. La pastille de preuve et le live sont ainsi le même composant.
- **Récupération côté serveur** (composants serveur ou route handlers), avec `revalidate` selon le tableau D1. Aucun secret dans le navigateur.
- **Un instantané de secours** (`live.snapshot.json`), généré au build, sert si une source tombe : la page n'est jamais vide.
- **`now.json` versionné dans le dépôt**, car il est public par nature. Kenz le modifie lui-même ou valide une proposition d'agent en fusionnant une pull request.
- Schéma proposé :

```json
{
  "maj": "2026-11-11",
  "semaine": [
    { "cote": "pro", "projet": "sago", "texte": "Saison 1 complète : 180 épisodes publiés", "statut": "observé", "date": "2026-11-11" }
  ],
  "enPreparation": [
    { "cote": "createur", "univers": "asie", "texte": "Branche-toi Île Maurice : générique prêt, tournage à venir", "statut": "déclaré", "date": "2026-11-08" }
  ],
  "lieu": { "visible": false, "pays": null, "depuis": null },
  "disponibilite": { "texte": null },
  "tiktok": { "abonnes": null, "releve_le": null }
}
```

### D3. Les quatre états, et leur texte

| État | Condition | Affichage |
|---|---|---|
| **En direct** | relevé il y a moins de 2× la fréquence prévue | la valeur + « relevé il y a 2 h » en petit |
| **En retard** | relevé plus ancien | la valeur en gris + « dernier relevé le 09/11 » |
| **Indisponible** | la source ne répond pas | la dernière valeur connue + « source indisponible pour l'instant » |
| **Vide** | jamais rien eu | une phrase honnête (« Pas encore de vidéo cette saison »), jamais un 0 ni un faux squelette qui charge sans fin |

### D4. Simulation dans les maquettes

- **Aucun appel réseau** dans les maquettes. Un fichier `_shared/live.mock.json` (à créer à l'étape des maquettes) reprend les valeurs **relevées le 11/11/2026** dans les briefs :
  - Oshii 2.0.2 (04/11) · Sago 2.0.1 (30/10) · Wado 1.1.1 (04/11) · Croc 1.2.1 (19/10) · Miru 2.0 (30/10) · Zenko 1.0 (20/10/2025) ;
  - dernière vidéo longue : « Premier voyage en Chine : itinéraire de 14 jours » (31/10/2026) ;
  - chaque valeur est étiquetée « simulée — relevé du 11/11/2026 ».
- **Un panneau de simulation**, visible seulement dans les maquettes, permet de passer chaque bloc de l'état « en direct » à « en retard », « indisponible » ou « vide ». Une horloge réglable montre les dates relatives (« il y a 3 j »).
- La note de la semaine et le journal public portent l'étiquette « exemple de contenu, à valider par Kenz ».

---

## E. La vitrine IA : prouver la compétence sans tricher

Principe : le site d'un AI engineer **montre** de l'IA qui marche, **dit** où il n'y en a pas, et **étiquette** ce qui est simulé. Le chat actuel, qui répond par mots-clés, est un risque de crédibilité (brief 03, § 4.3) : il est retiré.

### E1. « Demande à Kenz » : deux assistants, deux corpus

| | Assistant Pro | Assistant voyage |
|---|---|---|
| Corpus | Les contenus publics du côté Pro : études de cas, services, cas agents, CV validé, FAQ | Les guides, les verdicts validés, les prix vécus, les séries |
| Exemple | « Comment Oshii transforme une vidéo en recette ? » → le pipeline en 5 étapes, avec un lien vers la section | « Combien coûte le taxi pour Mutianyu ? » → « ≈ 40 € par personne aller-retour, prix vécu ; le chauffeur revient 4 h plus tard », avec un lien vers l'itinéraire |
| Ton | « je », posé | « je », tutoiement |
| Refus | vie privée, sujets hors corpus → renvoi vers le contact | demandes de prix actuels (« ce sont des prix vécus, pas des tarifs garantis ») |

Pourquoi deux assistants : séparer les corpus, c'est « ne pas tout mélanger » appliqué à l'IA.

Choix techniques (à présenter comme tels dans `/a-propos`) :
- **Le corpus est la même source de données que les pages** (un seul endroit à tenir à jour).
- Il est **assez petit pour tenir entier dans le contexte**, mis en cache : pas de base vectorielle inutile [Hypothèse, à mesurer : quelques dizaines de milliers de tokens].
- **Sortie structurée** : réponse, citations (ancres de sections), statut de preuve, renvoi au contact si besoin. Les citations s'affichent sous la réponse avec leurs pastilles.
- **Fournisseur interchangeable** par variable, comme dans les apps de Kenz ; quota par visiteur ; **plafond de budget journalier**. Une fois le plafond atteint, une recherche classique prend le relais avec un message honnête.
- **Rien n'est conservé par défaut** : uniquement des métriques agrégées (nombre de questions, taux de refus).
- **Injection de prompt** : le corpus est une donnée, pas une consigne (même règle que `AGENTS.md`).
- **Évaluation continue** : 30 à 50 questions types, avec leurs citations attendues et des tests de refus (questions privées, tentatives d'injection), rejouées à chaque déploiement.
- **Bouton « Comment j'ai répondu »** : il montre les passages utilisés, le temps de réponse et le fait que la réponse peut se tromper. Ce sont les sources qui font foi.

### E2. Palette ⌘K

- **Commandes** : aller à une page, une app, un guide ; changer de casquette ; changer de langue ; copier le lien de la page ; ouvrir le devis.
- **Recherche plein texte locale**, instantanée et sans IA. Si rien ne correspond : « Demander à l'assistant ».
- **Côté Pro** : un raccourci clavier visible, signal de culture dev. **Côté Créateur** : une simple loupe, pensée pour le mobile.

### E3. Le schéma d'agents vivant (`/pro/agents`)

- **Une simulation pédagogique** fondée sur l'architecture réelle. L'étiquette est fixe : « Simulation — aucun agent ne tourne sur cette page. »
- **On choisit un cas client** (les 6 de C2) : une demande part du coordinateur, traverse les rôles, s'écrit dans la mémoire partagée, puis s'arrête au nœud **Validation humaine**. Rien ne part tant que le visiteur n'a pas cliqué « Valider ».
- **Chaque nœud ouvre sa fiche** : ce qu'il lit, ce qu'il écrit, ce qu'il n'a pas le droit de faire.
- **Des interrupteurs de garde-fous** : en couper un montre ce qui pourrait mal tourner (exemple : publier sans relecture), puis le schéma le rétablit.
- **Un journal en bas**, avec des lignes datées et leur statut (« observé », « hypothèse »). Le format est celui d'une vraie transmission, avec un contenu d'exemple.
- **Plus tard** [Proposition] : rejouer une **trace réelle** du pipeline de `now.json` (préparation par un agent → pull request → fusion par Kenz), sans rien de privé.

### E4. Les pipelines rejoués (dans les études de cas)

| App | Ce qui est rejoué | Honnêteté |
|---|---|---|
| Oshii | vidéo → audio → transcription → LLM → fiche ; le repli Whisper s'allume si on simule « échec de l'analyse directe » | rejoué, avec des données d'exemple |
| Wado | photo d'un plat → aliments → macros, avec le provider `mock` | le même mode factice que dans les tests de l'app |
| Miru | génération d'un thème en streaming | rejoué, ou démo réelle avec quota si Kenz l'accepte |
| Sago | compile → valide → publie → active → **retour arrière** | il n'y a pas d'IA à l'exécution, et le site le dit |
| Croc | — | « Pas d'IA ici : la logique est testée, et c'est voulu » |

### E5. Le devis assisté (`/pro/devis`)

1. Le visiteur décrit son besoin avec ses mots.
2. Le modèle en tire un **brief structuré et modifiable** : objectif, utilisateurs, existant, délais, budget indicatif, contraintes, risques, questions ouvertes.
3. Le visiteur corrige puis **valide** : rien n'est envoyé avant.
4. Kenz reçoit le brief et répond **en personne** (« réponse sous N jours », à confirmer).

On y retrouve deux fois l'humain dans la boucle et la sortie structurée, le cœur de l'offre.

### E6. Ce qu'on ne fait pas

- Un chat qui fait semblant d'être de l'IA.
- Des « agents en direct » qui n'en sont pas.
- Un terminal décoratif ou du néon (« jamais geek »).
- Des portraits de Kenz générés par IA.
- Un assistant branché sur le coffre.
- Une IA qui répond sur la vie privée.

---

## F. Cinq directions de design

### F0. Les invariants, quelle que soit la direction

**Mouvement** (tiré de `tokens.json` du Motion Lab, observé le 11/11)

| Token | Vidéo (Kenz) | Web (traduction) |
|---|---|---|
| Arrivée | `expo.out`, 0,5 s | `cubic-bezier(0.16, 1, 0.3, 1)`, 500 ms (Pro ×1,2 = 600 ms ; Créateur ×0,8 = 400 ms) |
| Sortie | `power3.in`, 0,24 s, texte avant son fond | `cubic-bezier(0.32, 0, 0.67, 0)`, 240 ms ; le texte sort 40 ms avant son conteneur |
| Mot à mot | flou 8 px → net, 0,14 s, 0,07 s d'écart | identique, réservé aux titres (×0,8 côté Créateur : 56 ms d'écart) |
| Carte | +34 px, échelle 0,965 → 1, 0,55 s | identique pour les cartes qui entrent ; le contenu arrive ensuite, puis le filet se trace |
| Flèche | 0,38 s + pointe 0,14 s | tracé SVG, mêmes durées |
| Coup de poing | énergique : +4 % puis se pose ; posé : aucun | côté Créateur uniquement, sur **un** chiffre ou **un** titre par écran |
| Micro-interactions (survol, focus, appui) | — | 120 à 240 ms, jamais ralenties au-delà de 280 ms |
| Ressorts | — | amortissement critique, sans dépassement (exemple : raideur 260, amortissement 34, ζ ≈ 1,05) |

**Interdits** (charte et règles de montage) :
- rebond, flottement, pulsation ou boucle infinie, flash blanc ;
- « fondu + glissé vers le haut partout », zoom lent sur un titre posé ;
- transitions en masque, néon ;
- chiffre géant sur un dégradé, compteurs qui défilent ;
- photos de banque ;
- plus d'**un** élément rouge à l'écran ;
- du jaune hors de l'énergique.

**`prefers-reduced-motion`** : chaque effet devient un fondu de 120 ms ou un état immédiat, et les effets liés au défilement sont coupés.

**Composants communs** :
- le point (lien accessible avec un nom) ;
- la pastille de preuve ;
- les quatre états live ;
- ⌘K ;
- le contact par intention ;
- le panneau de simulation (seulement dans les maquettes).

**Performance** :
- LCP sous 2 s en 4G sur les pages Créateur mobiles ;
- moins de 150 Ko de JavaScript sur `/liens` ;
- vidéos en vignette d'abord, chargées au clic ;
- plus aucun fichier de 30 Mo.

**Accessibilité** : contrastes AA pour le texte courant (les accents colorés sont réservés aux éléments de 18 px et plus ou non textuels), focus visible, menus au clavier, `lang` correct dès le rendu serveur.

**Typo validée par Kenz pour son univers vidéo** : Melodrama 600 (Fontshare, ITF FFL, gratuite en usage commercial), Inter Display et Instrument Serif italique. Seules Inter et Instrument Serif sont sur Google Fonts. Melodrama est donc une **option hors Google**, auto-hébergée, possible pour les titres de destinations côté Créateur.

**Écrans à maquetter pour chaque direction** : `/`, `/pro`, `/pro/agents` (avec le schéma), `/pro/apps/sago`, `/asie` ou `/moi`, `/liens` en 390 px, `/now`, et la **transition du point**.

---

### F1. « REC / PROD » — le point, deux formats

- **Concept** : le point de « Kenz. » devient tout le système. Côté Pro, c'est le voyant vert **PROD** d'un service en ligne. Côté Créateur, c'est le point **REC** d'une caméra. Le format suit, et il vient de la vraie production de Kenz :
  - le Pro se compose en **21:9**, le format paysage de ses vidéos App Store (21:9 et 3:2), large et posé ;
  - le Créateur se compose en **9:16**, le format de ses TikTok et Shorts, vertical et énergique.

  L'accueil juxtapose une fenêtre 21:9 (la dernière mise en prod) et une fenêtre 9:16 (la dernière vidéo), avec le point entre les deux.
- **Pourquoi ce n'est pas générique** : l'identité vient de l'interrupteur que Kenz a déjà inventé (commit du 08/06/2026) et de ses deux vrais formats de sortie. Il n'y a ni héros à dégradé ni grille de cartes interchangeable.
- **Palette** :
  - Pro clair : fond `#F5F3EE`, surface `#FBFAF7`, encre `#16181C`, texte secondaire `#5D6168`, filet `#E3DFD7`, PROD `#1F8A5B` (voyants et grands éléments uniquement).
  - Pro sombre : `#101113`, surface `#17191C`, texte `#ECEAE4`, secondaire `#9A9EA6`, filet `#26292E`, PROD `#34C38F`.
  - Créateur (sombre par défaut) : nuit `#0E0D0C`, surface `#1A1918`, crème `#F4EFE6`, REC `#FF5A1F` (dans la continuité de l'orange actuel `#ff8c38`), rouge de la charte `#E8322B` pour l'unique prix barré ou verdict, jaune `#FFE600` pour l'accroche seulement.
  - Créateur clair : crème `#F4EFE6`, encre `#1A1918`, REC `#E5410F`.
- **Typographies (Google Fonts)** :
  - Pro : **Inter Tight** 500–600 (titres, interlettrage −2 %), **Inter** (texte, opsz), **Instrument Serif** italique pour **un** mot, **Geist Mono** pour les statuts et les timecodes.
  - Créateur : **Inter** 800 (titres en capitales serrées, comme dans Branche-toi), **Instrument Serif** italique pour le mot ; option Melodrama pour les noms de lieux.
  - L'italique serif est commun aux deux côtés : c'est « la voix » de Kenz.
- **Grille et layout** :
  - Pro : 12 colonnes, 1 320 px au plus, gouttière de 24 px ; modules en 21:9 ; frise horizontale.
  - Créateur : sur ordinateur, une colonne 9:16 centrée (440 px au plus) entre deux rails de métadonnées (série, date, vues avec pastille) ; sur mobile, un fil vertical plein écran aimanté (scroll-snap).
- **Micro-interactions signature** :
  1. **Le point bascule.** Au clic, à Entrée ou à Espace : le point glisse le long de la ligne de base du wordmark (240 ms, expo.out) et sa couleur passe de PROD à REC (160 ms). Le cadre de page se **recadre** : deux bandes entrent depuis les bords (de 21:9 à 9:16, 420 ms, `cubic-bezier(0.65, 0, 0.35, 1)`), et la page jumelle se charge dessous (View Transitions API). En bonus, un appui long de 500 ms remplit un anneau autour du point, comme le bouton d'enregistrement d'un téléphone. Avec mouvement réduit : un fondu de 120 ms.
  2. **La capture monte dans la carte.** Au survol ou au focus d'une carte d'app 21:9, la capture verticale monte de 34 px depuis le bas et se pose (de 0,965 à 1, 480 ms). La ligne d'état s'écrit en mono (« v2.0.1 · mise à jour il y a 12 j ») à 12 ms par caractère, en 250 ms au plus.
  3. **Le timecode.** Côté Créateur, le défilement du fil fait avancer un timecode `00:00:14:08` en haut à droite. Il est calculé depuis la position du défilement : aucune boucle. Quand une vidéo s'aimante, son titre arrive mot à mot (flou 8 px → net, 56 ms d'écart) et le chiffre de vues prend un coup de poing de +4 % qui se pose en 200 ms.
  4. **La pastille de preuve.** Le chiffre est déjà à sa valeur finale. Au survol ou au focus, un filet se trace dessous de gauche à droite (200 ms) et l'étiquette glisse de 4 px : « relevé le 04/11/2026 · données publiques ».
  5. **La valeur live change.** L'ancienne valeur sort vers le haut (160 ms, power3.in, flou 4 px) ; la nouvelle « monte d'une fente » (320 ms, expo.out). Pas de clignotement.
  6. **Le point devient bouton.** « Démarrer un projet » (Pro) : au survol, le point vert s'étire en pilule qui accueille le libellé (de 12 px à la largeur du texte, 280 ms, expo.out). Côté Créateur, même geste avec le point REC sur « S'abonner ».
- **Langage de mouvement** : côté Pro, arrivées en 600 ms, aucun coup de poing ; côté Créateur, arrivées en 400 ms, coups francs, un seul coup de poing par écran ; les sorties durent toujours 240 ms ; aucune boucle.
- **Séparation des casquettes** :
  - format (21:9 contre 9:16) ;
  - lumière (papier contre nuit) ;
  - couleur du point ;
  - navigation (barre haute en texte contre barre basse au pouce ou rail vertical) ;
  - ton (vous contre tu).
- **Skill à charger** : `design-taste-frontend` (pour sa vérification avant livraison et son refus des schémas de portfolio).
- **Risques** :
  - une colonne 9:16 sur un grand écran peut sembler vide : il faut des rails riches ;
  - le recadrage peut rappeler une « transition en masque » (refusée le 02/11) : rester sur deux bandes droites, courtes, sans forme découpée ;
  - il faut de vrais extraits verticaux, exportés légers ;
  - côté Créateur sombre, le risque est de ressembler au site actuel : il faut le texte crème et de vraies images, sans halo ni grille.

---

### F2. « Carnet » — le site comme une fiche « Où j'en suis »

- **Concept** : tout le travail de Kenz repose sur une mémoire écrite. Une fiche par projet commence par « OÙ J'EN SUIS », les décisions sont datées, et chaque fait porte son statut (déclaré, observé, hypothèse). Le site en est la version publique et filtrée :
  - chaque page se lit comme une feuille datée ;
  - les marges portent les annotations et les sources ;
  - chaque chiffre a sa pastille.

  Côté Pro, c'est un **carnet d'atelier** quadrillé, annoté au stylo bleu. Côté Créateur, c'est un **carnet de route** crème, avec des tampons (JE CONSEILLE / FLOP / ABUSÉ), des prix barrés à la main et des tracés d'itinéraire.
- **Pourquoi ce n'est pas générique** : la signature visuelle **est** la discipline de preuve de Kenz. Le décor ne sert à rien d'autre. C'est l'inverse du portfolio de développeur sombre et le meilleur argument pour un client qui veut des agents fiables.
- **Palette** :
  - Clair : papier `#F2EDE3` (papier de Kenz in Asia), feuille `#FAF7F1`, encre `#111013`, graphite `#5C5853`, filet `#D9D2C5`. Pro : stylo bleu `#2B4C9B` (annotations) et vert prod `#2F6B4F`. Créateur : rouge tampon `#E0352B` (un seul par écran) et moutarde `#C9962E` (texte) / `#F2C14E` (aplats).
  - Sombre : `#16140F`, feuille `#1E1B16`, encre `#EDE6D8`, graphite `#A39C8F`, filet `#2E2A23`, bleu `#8FA8E8`, vert `#6FBF95`, rouge `#FF6B5E`.
- **Typographies (Google Fonts)** : **Newsreader** (titres et texte, axe opsz, registre éditorial) ; **IBM Plex Mono** (annotations, dates, statuts) ; **Bebas Neue** pour les tampons uniquement (police choisie par Kenz pour Branche-toi). Les annotations « à la main » sont des tracés SVG, pas une police manuscrite.
- **Grille et layout** : trois colonnes de cahier sur ordinateur, avec une marge de notes (220 px), le texte (640 px) et une colonne latérale pour les preuves et les liens (280 px). Grille de ligne de base de 8 px ; des lignes réglées discrètes seulement en tête de page. Les index d'apps sont une grille plate de fiches bristol, sans ombre. Sur mobile, les notes de marge passent sous leur paragraphe, repliées.
- **Micro-interactions signature** :
  1. **La fiche « Où j'en suis ».** Au survol, le tampon de date se déplie en mono (« état au 11/11/2026 », 200 ms) et la ligne « Prochaine action » se souligne d'un trait à la main (SVG, 380 ms + pointe 140 ms). Au clic, l'historique s'ouvre en tiroir, ses entrées datées échelonnées de 40 ms.
  2. **La pastille de preuve, au cœur du système.** Un petit cercle suit chaque chiffre. Au survol ou au focus, un trait de crayon se trace sous le chiffre (200 ms) et une note de marge glisse de 4 px. Un chiffre « à confirmer » reste visible, en graphite, souligné en pointillé.
  3. **Le vrai prix.** Côté Créateur, quand la ligne entre dans l'écran, « 200 € » est barré d'un trait rouge tracé à la main (280 ms). « 10 € » descend de 8 px et se pose en Newsreader italique (320 ms, expo.out). C'est l'unique élément rouge de l'écran.
  4. **Le tampon.** Le verdict s'imprime quand une ville entre dans l'écran : échelle de 1,04 à 1 en 160 ms, opacité de 0 à 1, rotation fixe de −4°, texture d'encre statique.
  5. **Le renvoi de marge.** Survoler une note de marge trace une flèche jusqu'à l'élément cité (380 + 140 ms) ; la quitter l'efface (240 ms, power3.in).
  6. **Changer de carnet (le point).** La feuille courante sort de 24 px vers la gauche avec un léger flou (240 ms, power3.in). La nouvelle entre de 34 px par la droite et se pose (550 ms, de 0,965 à 1 : le token « carte »). Le Pro est quadrillé, le Créateur uni.
- **Langage de mouvement** : calme. Les seules mises en scène sont les **tracés** (traits, flèches, ratures), toujours de 200 à 550 ms et en expo.out. Rien ne bouge seul.
- **Séparation des casquettes** :
  - papier (quadrillé contre uni crème) ;
  - encre (stylo bleu contre tampon rouge) ;
  - navigation (table des matières collante à gauche contre onglets-intercalaires en haut) ;
  - ton.
- **Skill à charger** : `minimalist-ui` (éditorial, monochrome chaud, grilles plates, sans ombres lourdes).
- **Risques** :
  - trop calme pour un abonné qui arrive de TikTok : compenser par de vraies photos en pleine largeur côté Créateur ;
  - l'effet « modèle Notion » ;
  - les tracés à la main deviennent « gamins » s'ils sont trop nombreux : un seul par écran ;
  - Newsreader s'éloigne de la typo validée (Melodrama / Inter / Instrument Serif) : à faire valider.

---

### F3. « Lignes » — le plan de réseau

- **Concept** : Kenz vit sur des lignes.
  - Côté voyage : le train de Chongqing à Wulong, les bus de nuit au Japon, l'itinéraire de base Pékin → Chongqing → Shanghai, et bientôt le bus local de Maurice.
  - Côté pro : les pipelines (compile → valide → publie → active), l'ordre de déploiement (migration → serveur → contenu → build), les transmissions entre agents.

  Le site devient un **plan de réseau** de type signalétique suisse :
  - des **lignes Pro** (Apps, Agents, Services) et des **lignes Créateur** (Asie, k15ze, Sport, Maurice) ;
  - une seule station de correspondance, « Kenz » ;
  - chaque page est une station ;
  - la progression, ce sont les lignes qui s'allongent, chaque station portant sa date d'ouverture ;
  - le schéma d'agents est une ligne avec un **arrêt obligatoire** : « Validation humaine ».
- **Pourquoi ce n'est pas générique** : la navigation **est** la métaphore, tirée des itinéraires et des pipelines documentés de Kenz. Ni héros, ni cartes en grille.
- **Palette** :
  - Clair : fond `#F7F7F4`, encre `#0F1012`, gris `#8A8D93`, filet `#DCDDD8`. Lignes Pro : Apps bleu `#2D52C4`, Agents ardoise `#3E4A5C`, Services sauge `#5E8C6A`. Lignes Créateur : Asie rouge `#E8322B`, Maurice lagon `#0F5D6B`, k15ze vert lumineux `#2FBF71` (DA de k15ze), Sport moutarde `#D9A21B`. Correspondance « Kenz » : anneau encre, cœur blanc.
  - Sombre : `#0E0F11`, texte `#EDEDE8`, lignes éclaircies (bleu `#6F8DF2`, ardoise `#8C99AD`, sauge `#86B592`, rouge `#FF5A4E`, lagon `#2A9BAE`, vert `#45D98A`, moutarde `#F2C14E`).
- **Typographies (Google Fonts)** : **Archivo** (axe wdth 75–100 : noms de stations semi-condensés, comme une signalétique) ; **JetBrains Mono** (horaires, dates d'ouverture, codes de lignes) ; **Noto Sans JP** et **Noto Sans SC** pour les sous-titres de stations (東京, 重庆 : la charte utilise déjà Noto Sans SC).
- **Grille et layout** :
  - Grille stricte de 8 px ; tracés à 45° et 90° côté Pro, courbes géographiques côté Créateur.
  - Accueil sur ordinateur : le plan en plein écran (SVG), plus une **liste équivalente** pour l'accessibilité.
  - Sur mobile : un **diagramme de ligne vertical**, comme celui au-dessus des portes d'un train.
  - Chaque page est une « station » : en-tête (nom, ronds des lignes desservies), tableau des départs (live), puis le contenu.
- **Micro-interactions signature** :
  1. **Survol d'une ligne.** Les autres passent à 20 % d'opacité (180 ms) ; les stations de la ligne affichent leur nom en cascade (30 ms d'écart).
  2. **Le trajet.** Au clic sur une station, une rame (une pastille) parcourt la ligne jusqu'à elle : 120 ms par station, entre 300 et 700 ms, linéaire entre les stations, expo.out à l'arrivée. Le rond de la station grandit ensuite et devient l'en-tête de la page (élément partagé, 420 ms).
  3. **La correspondance (le point).** Activer la station « Kenz » fait passer la famille Pro en arrière-plan (désaturée à 15 %, 300 ms) et la famille Créateur au premier plan. On **voit** la différence de dessin : orthogonal contre géographique.
  4. **Le tableau des départs (`/now`).** Quand une valeur change, le texte glisse dans sa fente (sortie 160 ms, entrée 280 ms), sans palettes qui claquent ni son. Les états live deviennent « à l'heure », « retard » et « supprimé ».
  5. **L'arrêt obligatoire (`/pro/agents`).** La rame s'arrête à « Validation humaine ». Un anneau se trace une seule fois (1,2 s). Le segment suivant reste en pointillé tant qu'on n'a pas cliqué « Valider ».
  6. **L'ouverture de ligne (progression).** Un curseur d'années, de 2024 à 2026, prolonge les lignes au fil du défilement (tracé lié au scroll) et « ouvre » chaque station avec sa date (« ouverte le 06/11/2025 »).
- **Langage de mouvement** : mécanique mais doux. Trajets linéaires, arrivées en expo.out, de 180 à 700 ms. Avec mouvement réduit, la rame saute directement et les lignes restent fixes.
- **Séparation des casquettes** : familles de lignes (couleurs + **codes** P1–P3 et C1–C4, qui reprennent l'habitude des codes de motions de Kenz comme O1 ou R5), mode de tracé, couche de fond (schéma abstrait côté Pro, carte de l'Asie en pointillés côté Créateur).
- **Skill à charger** : `industrial-brutalist-ui` (rigueur typographique suisse, couleurs utilitaires), en **retirant** explicitement l'esthétique terminal ou militaire et la dégradation analogique.
- **Risques** :
  - la métaphore peut fatiguer : les contenus doivent rester lisibles comme des pages normales ;
  - le plan est complexe sur mobile : le diagramme vertical est obligatoire ;
  - la couleur seule ne suffit pas aux daltoniens : codes et formes en plus ;
  - le skill tire vers le « geek » ;
  - la typo s'écarte de la charte validée.

---

### F4. « Épisode » — Branche-toi, version site

- **Concept** : Kenz raconte sa vie « comme un anime le ferait » : séries, saisons, épisodes, générique « rafale » de 2,6 s, titre en verre, affiche WANTED pour s'abonner [Validé 08/11]. Tout le site devient une série :
  - côté Créateur, des **saisons** de voyage ;
  - côté Pro, des **arcs**, comme Sago qui est construit en 5 arcs × 6 lieux × 6 épisodes : arc 1 « les premières apps » (2025), arc 2 « six apps en prod » (2026), arc 3 « les systèmes ».

  La progression se lit dans « Précédemment dans… » et « Prochain épisode ».
- **Pourquoi ce n'est pas générique** : la grammaire vient des formats réels et validés de Kenz (rafale, verre réservé au titre, WANTED, tampons), avec de vraies saisons et de vrais chiffres. Ce n'est pas un portfolio de développeur.
- **Palette** :
  - Créateur (charte Branche-toi et Kenz in Asia) : encre `#111013`, crème `#F4EFE6`, jaune `#FFE600` (accroche), rouge `#E8322B` (un seul élément), moutarde `#F2C14E`, lagon `#0F5D6B` (accent de la saison Maurice). Version claire : papier `#F2EDE3`.
  - Pro (arcs, posé) : noir film `#0B0B0C`, crème `#F4EFE6`, gris `#8C8781`, un seul accent corail satiné `#F0705A` (le corail des objets 3D validé le 08/11), pas de jaune.
- **Typographies (Google Fonts)** : **Bebas Neue** (titres d'épisodes, choisie par Kenz pour Branche-toi) ; **Inter** 400 et 800 (texte) ; **Instrument Serif** italique (le mot) ; **Dela Gothic One** pour quelques tampons japonais (第1話), avec parcimonie. Option hors Google : Melodrama pour les destinations.
- **Grille et layout** :
  - Créateur : sections plein cadre (100vw) ; temps forts en **cases de manga** asymétriques (gouttières noires de 8 px) ; sur mobile, cases verticales.
  - Pro : « épisodes » en bandeau 2,39:1, très aéré.
- **Micro-interactions signature** :
  1. **La rafale.** À l'ouverture de `/moi` ou `/asie`, une fois par visite : 7 vrais plans de Kenz en moins de 2,6 s, coupés par un **déclencheur photo** (deux lames qui se ferment et s'ouvrent en 90 ms, sans flash blanc). La dernière image ralentit et le titre se pose dessus en 500 ms (expo.out). Bouton « Passer ». Avec mouvement réduit : la dernière image, fixe.
  2. **La pause WANTED.** Au survol ou au toucher de « S'abonner », la page se désature de 30 % (200 ms). Une affiche en papier entre (rotateX de 12° à 0°, translateY de 40 à 0 px, 600 ms, expo.out) puis se colle (une ombre de 2 px apparaît en 120 ms), avec une vraie photo de Kenz et sa phrase. Aucun logo ni élément de One Piece.
  3. **Les épisodes épinglés** (GSAP ScrollTrigger). Sur une page de série, chaque épisode s'épingle ; son numéro (Bebas Neue + 第N話) se remplace en fondu enchaîné de 240 ms ; une barre « épisode 12 / 46 » en haut suit le défilement.
  4. **Le survol qui fait défiler** (arcs Pro). Survoler une carte d'app en 2,39:1 fait défiler 5 images de sa vidéo App Store selon la position horizontale du curseur, sans lecture automatique en boucle. Au toucher, on glisse.
  5. **« Précédemment dans… ».** Un bandeau récapitule les saisons précédentes : on le fait glisser, avec une inertie amortie sans dépassement (raideur 260, amortissement 34).
  6. **Les tampons de verdict** au survol d'un lieu (de 1,04 à 1, 160 ms).
- **Langage de mouvement** : côté Créateur, l'énergique de la charte (×0,8, coupes de 90 à 160 ms, un coup de poing de +4 % par écran) ; côté Pro, le posé (×1,2, aucun coup de poing).
- **Séparation des casquettes** : arcs Pro monochromes en 2,39:1, calmes et corail ; saisons Créateur en couleur (jaune, rouge, lagon), en cases et plein cadre.
- **Skill à charger** : `gpt-taste` (GSAP ScrollTrigger : épinglage, empilement, défilement lié).
- **Risques** :
  - le poids (vidéos, GSAP) : budget de performance strict, vidéos au clic ;
  - le « mal à la tête » : un seul geste fort par écran ;
  - les droits (One Piece) : on garde l'idée, jamais la marque ;
  - un côté Pro qui paraîtrait léger à un recruteur : le garder très posé ;
  - il faut beaucoup de vrais rushs exportés légers.

---

### F5. « Matière » — pâte et verre, sous une lumière de studio

- **Concept** : le Motion Lab a validé de vraies matières : des objets 3D doux en **pâte** (corail satiné, crème satinée, verre fumé, touches dorées), un **bloc de verre** épais pour les chapitres, des personnages mignons avec un visage [Validé 07–08/11]. Le site devient une **table de studio éclairée** :
  - côté Pro, chaque app est un objet posé, avec sa mascotte (Kuro et Yui pour Sago, les flammes de Wado, le personnage vinyle de Croc, la mascotte d'Oshii) ;
  - côté Créateur, ce sont des objets de voyage (téléphone, pièce, avion : certains existent déjà dans les exports du Motion Lab).
- **Pourquoi ce n'est pas générique** : les matières, les mascottes et les règles d'usage (« le verre seulement pour les titres ») sont celles de Kenz. C'est l'opposé des sites plats et sombres.
- **Palette** :
  - Pro (lumière froide) : studio `#ECEFEC`, surface `#F7F8F6`, encre `#1B1D1C`, sauge `#5E7D6A`, verre `rgba(255,255,255,0.55)` avec un liseré `rgba(255,255,255,0.8)` et une ombre `rgba(27,29,28,0.12)`.
  - Créateur (lumière chaude) : studio `#F3E8DA`, surface `#FBF4EA`, encre `#1A1918`, corail satiné `#F0705A`, doré `#C9A45C`.
  - Sombre : `#151413`, texte `#F4EFE6`, verre de la charte `rgba(28,27,26,0.42)` (flou 26 px, liseré blanc à 16 %).
  - La lumière est une **lumière de studio** douce (ombres de contact), jamais un dégradé décoratif derrière un chiffre.
- **Typographies (Google Fonts)** : **Fraunces** (axe SOFT à 100, opsz 144, WONK à 0 : des titres « en pâte », ronds et doux) ; **Instrument Sans** (texte) ; **DM Mono** (étiquettes techniques). Instrument Serif italique reste possible pour le mot, pour rester proche de la charte.
- **Grille et layout** : chaque section est un **plateau** (cadre 16:10) avec un objet héros, beaucoup d'air et des étiquettes en verre. Les apps sont présentées en grille d'objets (bento sans bordures) ; sur mobile, un objet par écran.
- **Micro-interactions signature** :
  1. **L'objet en main.** Au survol ou au focus d'une app, l'objet se soulève de 8 px ; son ombre s'élargit et s'adoucit (320 ms, expo.out) ; il s'oriente de 4° vers le curseur (ressort critique : raideur 180, amortissement 28, ζ ≈ 1,04).
  2. **La vue éclatée « Sous le capot ».** Au clic, l'objet se sépare en plaques de verre empilées (App · API · Données · IA · Infra). Chaque plaque s'écarte de 28 px, avec 60 ms d'écart, 480 ms en tout. Les étiquettes sont réelles (« Fastify 5 », « Postgres + Drizzle », « VOICEVOX »…).
  3. **Le bloc de verre.** Pour les titres de chapitres, le titre apparaît derrière un bloc de verre biseauté qui glisse de 24 px (420 ms), avec un flou de 26 px et un liseré blanc à 16 % (valeurs de la charte). Le verre ne sert qu'aux titres.
  4. **La mascotte se penche.** Sur une carte d'app, la mascotte sort du bord : translation de 24 px, rotation de 6°, 350 ms. Elle se pose sans rebondir.
  5. **L'étagère de progression.** Sur `/pro`, la frise pose les objets sur une étagère dans l'ordre de sortie (Zenko, Oshii, Sago, Miru, Croc, Wado). Chaque objet descend de 12 px, son ombre de contact apparaît, en 260 ms.
  6. **La lumière change (le point).** La lumière du studio passe du froid (Pro) au chaud (Créateur) en 500 ms. Les objets de l'autre univers sortent d'abord (240 ms), puis les nouveaux entrent : « arrive lentement, part vite ».
- **Langage de mouvement** : un mouvement avec du poids, de 260 à 550 ms ; ressorts critiques ; parallaxe de 12 px au plus ; aucune boucle.
- **Séparation des casquettes** :
  - température de la lumière ;
  - familles d'objets (apps et outils contre objets de voyage et de sport) ;
  - accent (sauge contre corail).
- **Skill à charger** : `high-end-visual-design` (matières, ombres, cartes et rythme d'agence haut de gamme).
- **Risques** :
  - **les assets** : il existe seulement quelques objets en pâte dans les exports du Motion Lab, aucune génération d'images n'est faite à cette étape, et les maquettes resteront partielles sans nouveaux rendus validés par Kenz ;
  - une 3D mal éclairée devient de l'« IA slop » ;
  - le poids des PNG avec transparence ;
  - trop de verre (la règle de Kenz : les titres seulement) ;
  - Fraunces s'écarte de la charte.

---

### F6. Comparaison et ordre de test

| Direction | Énergie | Dépend d'assets | Force | Risque principal | Skill |
|---|---|---|---|---|---|
| F1 REC / PROD | posé / énergique très net | moyenne (extraits verticaux) | le système du point et des formats | colonne 9:16 vide sur grand écran | `design-taste-frontend` |
| F2 Carnet | calme | faible | la preuve comme identité ; crédibilité agents | trop sage pour TikTok | `minimalist-ui` |
| F3 Lignes | mécanique | faible | navigation mémorable, schéma d'agents naturel | métaphore lourde sur mobile | `industrial-brutalist-ui` |
| F4 Épisode | très énergique | forte (rushs) | le côté Créateur le plus fort | poids, droits, Pro trop léger | `gpt-taste` |
| F5 Matière | doux, tactile | très forte (3D) | le plus « premium » | assets 3D, « IA slop » | `high-end-visual-design` |

Ordre de test proposé [Proposition] :
1. **F1** et **F2** d'abord : peu d'assets, système fort, et ce sont les deux directions qui montrent le mieux « une personne, deux casquettes » et la rigueur pro.
2. **F4** si Kenz veut plus d'énergie côté Créateur.
3. **F3** comme pari audacieux.
4. **F5** quand des rendus 3D validés existent.

Un hybride reste possible : le squelette de F1, les pastilles de F2 partout, la rafale de F4 sur le seul hub Créateur. Pour la mise en code de la direction retenue : `frontend-design:frontend-design` pour les composants communs, `stitch-design-taste` pour écrire son `DESIGN.md`.

---

## G. À trancher par Kenz (réponds par un numéro)

1. **Adresse du côté Créateur** : 1) `/moi` + des URL courtes à la racine (recommandé) ; 2) un sous-domaine ; 3) tout sous `/moi/…`.
2. **Nom public de l'univers voyage** : 1) Kenz in Asia ; 2) Kenz en Asie ; 3) En Bien en Asie.
3. **Ton côté Pro** : 1) vouvoiement sur services, devis et livrables (recommandé) ; 2) tutoiement partout.
4. **Noms des agents** : 1) Hermes seul, les autres par leur rôle (recommandé) ; 2) tous les surnoms ; 3) aucun nom.
5. **Chiffres business** (utilisateurs, téléchargements, revenus) : 1) publiés, datés et sourcés ; 2) audience seulement ; 3) aucun.
6. **Escapades Libres** : 1) étude de cas avec l'accord de l'équipe ; 2) mention anonyme ; 3) rien.
7. **Zenko et les archives** : 1) dans le Lab, sans statistiques ; 2) retirées.
8. **Enkenz** : 1) côté Créateur ; 2) côté Pro (acquisition de Sago) ; 3) les deux.
9. **Lieu sur `/now`** : 1) jamais ; 2) le pays déclaré, avec un délai ; 3) le dernier pays filmé seulement (recommandé).
10. **Assistant IA** : 1) branché sur un vrai modèle, avec plafond de budget ; 2) simulation étiquetée seulement.
11. **Journal public** préparé par un agent et validé par toi avant publication : 1) oui ; 2) non.
12. **Vue privée `/atelier`** : 1) oui ; 2) non, `/now` suffit.
13. **Offres et disponibilité** : lesquelles des 6 offres garder ; formulation de la disponibilité (missions, collaborations) ; prix « sur devis » ou fourchettes.
14. **Newsletter** : 1) oui (outil à choisir) ; 2) non.
15. **Vérifications de faits** :
    - quel chiffre pour Oshii ;
    - la V2 de Miru est-elle bien en ligne ;
    - l'éditeur de « Hermes Agent » ;
    - les dates du Startup Weekend ;
    - le lieu affiché ;
    - les droits des photos de sport et l'origine des photos de destinations ;
    - quelles vidéos intégrer ;
    - le passage de `?lang=en` à `/en/`.

---

## H. Sources

- **Briefs** : `_brief/01-builder.md`, `_brief/02-createur.md`, `_brief/03-marque-style.md` (11/11/2026), lus en entier.
- **Coffre, en lecture seule** : `AGENTS.md`, `Travailler avec les agents.md`, `Business/Freelance.md`, `Carte des apps.md` (partie apps actives), `Cockpit.md`, `Idées.md`, `Décisions.md`, `Contenu/Montage programmatique.md` (extrait). Les notes personnelles et les notes de démarches n'ont pas été ouvertes.
- **Motion Lab, en lecture seule** : `00_Charte/CHARTE.md` (v2.0, 07/11) et `01_Noyau/tokens.json` (bloc `mouvement`).
- **Code du site, en lecture seule** : arborescence `app/`, `components/`, `i18n/dictionaries/fr.ts` (accords), `lib/socials.ts`, `git log`.
- **Aucune requête réseau, aucune tâche lourde.** Les valeurs live citées sont celles relevées le 11/11 par le brief 01.

*— Claude, stratège produit et personal branding, 11/11/2026. Aucune note du coffre ni aucun fichier du site n'a été modifié ; seul ce fichier a été écrit dans `maquettes/_brief/`.*
