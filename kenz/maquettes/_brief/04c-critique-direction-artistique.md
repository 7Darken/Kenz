# 04c — Critique de direction artistique : les cinq directions de la stratégie v1

> Rédigé le 11/11/2026 par Claude (directeur de création, motion design web).
> Lu section par section : `03-marque-style.md`, `02-createur.md`, puis `04-strategie-v1.md`.
> Deux sources ont été revérifiées en **lecture seule** dans le Motion Lab de Kenz : la charte v2.0 (`00_Charte/CHARTE.md`, 07/11) et le journal des versions (`CHANGELOG.md`, entrée v2.13.0 du 08/11 sur les objets en pâte).
> Les contrastes ont été **calculés le 11/11** avec la formule WCAG 2.x (luminance relative) sur chaque paire de couleurs proposée, par un petit script `node` local, sans réseau.
> Rien n'a été modifié dans le coffre, dans le Motion Lab ni dans le code du site. Ce fichier vit dans un dépôt public : il ne contient aucune donnée privée.

**Statuts utilisés**

| Marque | Sens |
|---|---|
| **[Charte]** | charte du Motion Lab v2.0, validée par Kenz le 07/11 |
| **[Lab 08/11]** | journal des versions du Motion Lab, observé le 11/11 |
| **[Brief 02]**, **[Brief 03]**, **[Stratégie]** | les documents de `_brief/`, avec la section citée |
| **[Calculé 11/11]** | ratio de contraste calculé pour ce document |
| **[Avis]** | jugement du directeur de création, à discuter avec Kenz |
| **[Hypothèse]** | déduction, à vérifier |
| **à confirmer** | aucune source : ne rien publier sans réponse de Kenz |

---

## 0. Verdicts en une ligne

| Direction | Verdict |
|---|---|
| **F1 REC / PROD** | **À garder en tête.** C'est la plus « Kenz » (elle traduit la règle validée « une identité, deux intensités » par ses deux formats vidéo). Mais son côté Pro ressemble à une page de statut à la Vercel, et sa page Agents n'a aucun geste propre. **Correctifs** : passer à la typo de la charte ; remplacer les bandes par l'iris qui se referme sur le point ; donner aux agents une « timeline à pistes ». |
| **F2 Carnet** | **Le meilleur côté Pro pour vendre la mise en place d'agents** : la preuve y est le décor, et les livrables clients ont le même format. Son côté Créateur est trop sage pour un abonné TikTok, Newsreader sort de la charte et la moutarde en texte échoue (2,28:1). **Correctifs** : garder le carnet pour le Pro ; faire du Créateur des images plein cadre annotées à la main. |
| **F3 Lignes** | **Excellente pour les pipelines et l'« arrêt obligatoire », fausse comme système global.** Un seul plan réunit les deux casquettes (l'inverse de « ne pas tout mélanger »). Ses sept couleurs cassent la règle du rouge unique, et trois d'entre elles échouent au contraste. **Correctif** : la réduire à un module Pro et séparer la carte de l'Asie. |
| **F4 Épisode** | **Le côté Créateur le plus fort des cinq, et le côté Pro le plus faible.** Habiller le travail client en « arcs » et en « épisodes », c'est mélanger. Bebas Neue est usée, et aucune transition du point n'est définie. **Correctif** : en faire la peau Créateur d'un hybride, avec un Pro emprunté à F2 ou à F1. |
| **F5 Matière** | **La plus premium sur le papier et la moins faisable maintenant.** Seuls 2 objets sur 12 sont exportés, et la génération d'images est interdite à cette étape. Les objets de voyage sont génériques, le tilt au curseur est un cliché, Fraunces est usée et deux accents sont illisibles en texte. **Correctif** : la rétrograder en couche « Matière » (vue éclatée en plans CSS, objets-preuves avec les prix vécus), à activer quand les rendus existent. |

---

## 1. Diagnostic d'ensemble

### 1.1 Ce que la stratégie a déjà bien fait
- **Le mouvement vient des tokens de Kenz**, pas d'un modèle. C'est rare, et c'est la meilleure garantie contre le générique.
- **La liste d'interdits couvre déjà la moitié des clichés** : rebond, pulsation, compteurs qui défilent, néon, photos de banque, chiffre géant sur un dégradé, titres qui tournent.
- **Chaque direction part d'un fait réel** et liste ses propres risques.
- **Le texte courant passe partout** : l'encre sur le papier dépasse 14:1 dans les cinq palettes [Calculé 11/11].
- **Aucune direction ne tombe dans** le dégradé violet-bleu, le globe 3D, le héros « Hi, I'm… » ou le néon cyberpunk.

### 1.2 Sont-elles vraiment différentes ? Pas assez, et pas là où il faut

| | Fond Pro | Fond Créateur | Titres | Geste du point | Ce qu'on reconnaît en vignette floue |
|---|---|---|---|---|---|
| F1 | papier `#F5F3EE` | nuit `#0E0D0C` | Inter Tight | glissé + bandes (21:9 → 9:16) | deux fenêtres de formats différents |
| F2 | papier `#F2EDE3`, quadrillé | crème `#F2EDE3`, uni | Newsreader | la feuille glisse | une colonne de marge + un quadrillage |
| F3 | `#F7F7F4` | **le même plan** | Archivo | station « Kenz » | des lignes de couleur |
| F4 | noir film `#0B0B0C` | encre `#111013` / crème | Bebas Neue | **non défini** | des cases de manga, gouttières noires |
| F5 | studio `#ECEFEC` | studio `#F3E8DA` | Fraunces | lumière froide → chaude | des objets sur un plateau |

**Constats**
1. **Quatre côtés Pro sur cinq ont le même fond.** Entre `#F5F3EE`, `#F2EDE3`, `#F7F7F4` et `#ECEFEC`, le contraste va de **1,01 à 1,08:1** [Calculé 11/11] : l'œil ne voit aucune différence. En vignette, les côtés Pro de F1, F2, F3 et F5 se confondent ; seule la mise en page les sépare.
2. **Des composants communs sont présentés comme des signatures** :
   - la pastille de preuve (F1 n° 4 et F2 n° 2) ;
   - la valeur qui « monte d'une fente » (F1 n° 5 et F3 n° 4) ;
   - le tampon (F2 n° 4 et F4 n° 6) ;
   - le prix barré (F2 n° 3, piste 6 du brief 03) ;
   - l'arrêt « Validation humaine » (F3 n° 5, piste 2).

   Ce sont de bons composants, mais ils ne différencient rien. Il faut les ranger dans F0 (§ 4) et juger chaque direction sur ses **seuls gestes exclusifs**.
3. **Côté Créateur, F2 et F4 partagent la palette de la charte** (crème, encre, rouge, moutarde). C'est normal, c'est la marque. La différence doit donc venir de la composition : la marge pour F2, les cases pour F4.
4. **F4 n'a pas de transition du point**, alors que c'est le geste central du site. F5 n'en a qu'une très douce.

**Règle proposée** [Avis] : *le socle (typo, point, pastille, mouvement) est la personne ; une direction ne change que la composition, la matière et **un** geste exclusif.* Les directions deviennent alors comparables, et chacune est reconnaissable.

### 1.3 Ancrage dans la vie de Kenz

● central · ○ présent · — absent

| Matière de vie | F1 | F2 | F3 | F4 | F5 |
|---|---|---|---|---|---|
| Asie (séries, prix vécus, verdicts) | ○ | ● | ● | ● | ○ (objets génériques) |
| Île Maurice (saison en préparation) | — | — | ○ (ligne lagon) | ○ (accent) | — |
| Apps et mascottes | ● (format App Store) | ○ | ○ | ○ | ● |
| Sport, k15ze | — | — | ○ (ligne verte) | — | ○ (« objets de sport », non définis) |
| Montage vidéo | ● (formats, timecode) | — | — | ● (rafale, WANTED) | ○ |
| Agents IA (savoir-faire Pro) | — (aucun geste propre) | ● | ● | — | ○ (vue éclatée) |

**Trois trous**
- **Les agents IA**, que Kenz veut mettre en avant côté Pro, ne sont vraiment portés que par F2 et F3. Voir la section 3.
- **k15ze** a pourtant une identité validée : texte blanc, mots forts en vert, **TikTok Sans**, mots verts en **Instrument Serif**, chiffres en **Anton** (réf. « 31.3 KM ») [Brief 03 § 2.3, validé 08/11]. Aucune direction ne la reprend.
- **Maurice** n'est qu'une couleur. Or la charte a déjà un système : « une saison ne change que son accent et son générique » (Chine `#E8322B`, Maurice `#0F5D6B`) [Charte].

**Correctifs valables pour toutes les directions**
- **Accent de saison** : chaque page de série ne change que son accent et son ouverture. Maurice obtient ainsi une vraie page, sans rien inventer.
- **Sous-identité k15ze**, dans toutes les directions :
  - chiffres en Anton, un mot en Instrument Serif italique vert ;
  - vert `#1E7A46` sur crème (4,67:1) ou `#3DDC84` sur fond sombre (10,63:1) [Calculé 11/11] ;
  - la « lueur » seulement sur fond sombre, sur **un** mot, et douce [Charte, « La lueur »].
  - Licence et disponibilité web de TikTok Sans : **à confirmer**.

### 1.4 Clichés : ce qui reste à retirer

| Cliché | Où | Pourquoi ça pose problème [Avis] | Remplacement |
|---|---|---|---|
| Look « page de statut » : Inter Tight + Geist Mono + point vert | F1 Pro | C'est l'esthétique de Vercel et Linear, copiée par une grande partie des portfolios de développeurs récents. Le point vert rappelle aussi le badge « Disponible » que le brief 03 classe parmi les effets de modèle (§ 4.3) | La typo de la charte, et les **chiffres tabulaires d'Inter** au lieu d'une mono pour les versions. Le voyant PROD porte toujours une valeur (version + date), jamais seul |
| Texte qui s'écrit caractère par caractère, en mono | F1 n° 2 ; piste 3 du brief 03 | effet « terminal », contraire au « jamais geek » [Brief 03 § 2.7] | le geste de la charte « le chiffre monte d'une fente, flou → net » |
| Carte qui s'incline vers le curseur (tilt) | F5 n° 1 | gadget connu, qui n'apporte aucune information | soulever de 8 px avec une ombre qui s'élargit, rien de plus |
| Bento | F5 (« bento sans bordures ») | la grille la plus vue des sites produits de ces dernières années | un plateau à **un** objet héros, ou un registre de lignes datées |
| Grille de fiches ou de cartes identiques | F2 (« grille plate de fiches bristol ») ; `/pro` (trois entrées Apps · Agents IA · Services) [Stratégie C2] | c'est la « grille de 3 cartes identiques » | trois **formes** différentes : Apps = la liste des versions en direct ; Agents = un aperçu jouable du schéma ; Services = une phrase et un bouton |
| Écran coupé en deux, 50/50, qui s'agrandit au survol | tentation sur `/` (« deux portes ») | le portfolio « designer / codeur » le plus copié | les formats asymétriques de F1 (une fenêtre 16:9 et une 9:16), ou deux portes de tailles et de matières différentes |
| Carrousel à glisser avec inertie | F4 n° 5 | gadget, mauvais au clavier | défilement natif avec `scroll-snap` |
| Une section épinglée par épisode (46 épisodes) | F4 n° 3 | défilement détourné, interminable sur mobile | une bande horizontale d'épisodes et un en-tête collant « ép. 12 / 46 » |
| Verre dépoli sur un fond uni | F5 (étiquettes en verre) | du glassmorphism : sur un fond uni, le flou ne montre rien | le verre **seulement au-dessus d'une vraie image**, comme dans la charte (« des cartes en verre dépoli » posées sur « tes vraies images d'abord ») |
| Bebas Neue en titre | F4 | la police des miniatures YouTube et des salles de sport ; absente de la charte v2 | Inter Display 800 en capitales serrées (Kenz a aussi choisi Inter ExtraBold et Black pour Branche-toi [Brief 03 § 2.3]). Bebas Neue reste pour les tampons |
| Fraunces « soft » | F5 | la serif « chaleureuse » de beaucoup de sites de startups | la typo de la charte : la douceur vient des objets, pas de la police |
| ⌘K et « Demande à… » mis en avant | E1 et E2 de la stratégie | presque tous les portfolios Next.js récents en ont un | les garder comme **outils**, jamais en héros. Leur valeur tient aux citations (« Comment j'ai répondu ») |
| Objets de voyage génériques (téléphone, pièce, avion) | F5 Créateur | les icônes de n'importe quel site de voyage | des **objets-preuves** : chaque objet porte un prix vécu et validé (§ 2.5) |
| Drapeaux en emoji | titres TikTok repris tels quels (« VLOG 🇲🇾 ») | lus à voix haute par les lecteurs d'écran [Brief 03 § 4.6] ; effet « réseau social » | retirer l'emoji à l'affichage et garder le titre exact dans le lien |
| Lueur verte | traduction web de k15ze | sur un écran, une lueur verte devient vite un néon | une lueur douce sur **un** mot, et seulement sur fond sombre [Charte] |
| Pastille verte « en ligne » | états live (F1, F3) | elle ressemble au point « disponible » | toujours avec du texte (« v2.0.1 · 30/10 »). L'état change la **forme** (plein, contour, pointillé), pas seulement la couleur |

### 1.5 Typographie : la charte tranche déjà

**Ce que dit la charte** [Charte] :

| Rôle | Police | Pour quoi | Jamais |
|---|---|---|---|
| Titre | Melodrama 600 | les destinations, les villes, un titre de chapitre ; 1 à 3 mots, en casse normale | en phrase longue, en sous-titre |
| Texte | Inter Display (Inter, axe opsz 32), de 400 à 800 | les phrases, les chiffres, les étiquettes en capitales espacées | plus de 2 graisses dans un même bloc |
| Le mot | Instrument Serif italique | **un** mot important par phrase | deux mots lumineux en même temps |
| Chinois | Noto Sans SC | les noms chinois dans les étiquettes | en titre géant |

**Proposition : un socle commun aux cinq directions** [Avis]
- **Titres Pro** : Inter Display 600, interlettrage −2 %. Pas de Melodrama.
- **Titres Créateur** :
  - Melodrama 600 pour les lieux ;
  - Inter Display 800 en capitales serrées pour les accroches et les titres d'épisodes.
- La charte réserve Melodrama aux lieux : **elle appartient donc naturellement au côté Créateur.** C'est une séparation des casquettes qui vient d'une règle déjà validée.
- **Le mot** : Instrument Serif italique, des deux côtés. C'est la voix de Kenz, le seul trait typographique partagé.
- **Une seule police d'accent par direction**, au plus :

| Direction | Police d'accent | Usage | Remplace |
|---|---|---|---|
| F1 | IBM Plex Mono | **seulement** le timecode, côté Créateur | Geist Mono (connotation Vercel) ; côté Pro, chiffres tabulaires d'Inter (`font-feature-settings: "tnum", "zero"`) |
| F2 | IBM Plex Mono | dates et statuts du carnet Pro | Newsreader (à garder seulement comme option pour les longues études de cas, si Kenz l'aime) |
| F3 | Archivo semi-condensé (`wdth` 75–87) | noms de stations | JetBrains Mono : les horaires passent en chiffres tabulaires d'Archivo |
| F4 | Dela Gothic One + Bebas Neue | 第N話 seulement ; les tampons seulement | Bebas Neue en titre |
| F5 | aucune | la matière est l'accent | Fraunces, Instrument Sans, DM Mono |
| k15ze (partout) | Anton | les chiffres seulement [validé 08/11] | — |

**Points techniques**
- **Inter Display** : vérifier que Google Fonts sert bien l'axe `opsz`. Sinon, auto-héberger Inter Display.
- **Melodrama** : licence ITF FFL ; l'usage web est **à confirmer** [Brief 02, annexe A].
- **Polices chinoises et japonaises** (Noto Sans SC et JP, Dela Gothic One) : charger seulement les glyphes utiles avec le paramètre `text=` de l'API Google Fonts (par exemple `text=重庆東京第話`), plutôt que des fichiers de plusieurs mégaoctets.

### 1.6 Contrastes (calculés le 11/11)

Seuils WCAG :
- texte courant : **4,5:1** ;
- texte de grande taille (24 px, ou 18,7 px en gras) et éléments non textuels (traits, icônes, bords de champs) : **3:1**.

**Échecs à corriger**

| Dir. | Couleur | Fond | Ratio | Problème | Correction | Ratio corrigé |
|---|---|---|---|---|---|---|
| F2 | moutarde « texte » `#C9962E` | papier `#F2EDE3` | **2,28** | échoue même en grand | texte `#7D5A10` ; `#F2C14E` seulement en aplat, sous de l'encre (11,30) | 5,39 |
| F3 | gris texte `#8A8D93` | `#F7F7F4` | **3,10** | texte courant illisible | `#62656B` | 5,45 |
| F3 | ligne k15ze `#2FBF71` | `#F7F7F4` | **2,22** | échoue même en non-texte | `#178048` | 4,64 |
| F3 | ligne Sport `#D9A21B` | `#F7F7F4` | **2,14** | idem | `#9A700C` | 4,17 |
| F4 | lagon `#0F5D6B` | encre `#111013` | **2,53** | l'accent de Maurice disparaît sur le fond sombre | `#3FB0C2` sur fond sombre ; `#0F5D6B` seulement sur crème (6,55) | 7,41 |
| F5 | corail `#F0705A` | studio `#F3E8DA` | **2,42** | — | texte `#B4432F` ; `#F0705A` pour la matière seulement | 4,59 |
| F5 | doré `#C9A45C` | studio `#F3E8DA` | **1,94** | — | texte `#7E5F22`, ou décor seulement | 4,90 |

**À réserver aux grands éléments** (passent à 3:1, pas à 4,5:1)

| Dir. | Couleur / fond | Ratio | Variante pour le texte | Ratio |
|---|---|---|---|---|
| F1 | PROD `#1F8A5B` / `#F5F3EE` | 3,91 | `#17704A` (bouton : crème sur `#17704A`, 5,83) | 5,48 |
| F1 | REC clair `#E5410F` / `#F4EFE6` | 3,60 | `#B8360A` | 5,14 |
| F1 | rouge `#E8322B` / surface `#1A1918` | 4,12 | sur le fond nuit `#0E0D0C` | 4,55 |
| F2 | rouge tampon `#E0352B` / `#F2EDE3` | 3,82 | tampons de 24 px et plus ; texte `#B92A20` | 5,27 |
| F3 | sauge `#5E8C6A` · rouge `#E8322B` / `#F7F7F4` | 3,60 · 3,97 | `#4D7A59` · `#C42A22` pour les libellés | 4,61 · 5,29 |
| F4 | rouge `#E8322B` / encre `#111013` | 4,45 | 24 px et plus, ou fond `#0E0D0C` | 4,55 |
| F5 | sauge `#5E7D6A` / `#ECEFEC` | 3,93 | `#48654F` | 5,58 |
| Charte | rouge `#E8322B` / crème `#F4EFE6` | 3,73 | juste pour le trait du prix barré et un grand verdict ; jamais en petit texte | — |
| Apps | rouge Oshii `#f9403c` / crème | 3,15 | la couleur d'une app ne sert jamais au texte courant ; si besoin, `#C8302C` | 4,68 |

**Règle système** : chaque accent existe en **deux tokens**, `--accent` (matière, traits, 24 px et plus) et `--accent-texte` (4,5:1 au moins).

### 1.7 Micro-interactions : signature ou gadget ?

**Cinq questions par geste**
1. Vient-il d'un geste réel de Kenz (motion du lab, règle de montage, protocole) ?
2. Porte-t-il une information (preuve, état, prix, étape) ?
3. Est-il seul de son espèce à l'écran ?
4. Est-il faisable en CSS ou JS vanilla, ou avec GSAP, sans 3D temps réel ni vidéo lourde ?
5. A-t-il un état fixe propre avec `prefers-reduced-motion` ?

**5/5 = signature · 4/5 = à corriger · 3/5 ou moins = gadget** [Avis]

| Geste | Note | Verdict |
|---|---|---|
| F1-1 Le point bascule, avec deux bandes 21:9 → 9:16 | 4 | Les bandes frôlent la « transition en masque » refusée. **Remplacer par l'iris** (§ 2.1) |
| F1-2 La capture monte dans la carte + ligne d'état tapée en mono | 3 | Garder la capture (token « carte ») ; **retirer la frappe** |
| F1-3 Le timecode lié au défilement | 5 | **Signature** |
| F1-6 Le point s'étire en bouton | 5 | **Signature** |
| F2-1 La fiche « Où j'en suis » en tiroir | 5 | **Signature** ; passe dans le socle (agents, livrables) |
| F2-5 Le renvoi de marge (une flèche trace jusqu'à l'élément cité) | 4 | Ordinateur seulement ; sur mobile, la note se replie sous son paragraphe |
| F2-6 La feuille glisse | 2 | Transition générique. **Remplacer par « le quadrillage se retire »** (§ 2.2) |
| F3-1 Survol d'une ligne | 4 | Ajouter le focus clavier et le toucher |
| F3-2 La rame + l'élément partagé | 3 | Jusqu'à ~1,1 s avant chaque page. **Seulement sur la page du plan** ; les liens de navigation mènent directement à la page |
| F3-3 La correspondance (deux familles sur un même plan) | 2 | Mélange les casquettes. **Deux plans séparés** |
| F3-6 L'ouverture des lignes au défilement | 4 | Garder sur `/pro/lab` uniquement |
| F4-1 La rafale | 4 | Risque de flash et LCP retardé. **Corriger** (§ 2.4) |
| F4-2 La pause WANTED au survol | 3 | Pas de survol sur mobile, et le CTA est bloqué. **Déplacer en fin de page** |
| F4-3 Les épisodes épinglés | 2 | **Remplacer** par une bande horizontale |
| F4-4 Le survol qui fait défiler 5 images | 4 | Garder ; au toucher, on glisse |
| F4-5 « Précédemment dans… » avec inertie | 2 | **Défilement natif** |
| F5-1 L'objet en main, avec tilt | 2 | **Garder le soulèvement, retirer le tilt** |
| F5-2 La vue éclatée « Sous le capot » | 5 | **Signature**, faisable en plans CSS 3D sans aucun rendu. À promouvoir dans toutes les études de cas |
| F5-3 Le bloc de verre pour les titres | 4 | Validé dans le lab (« Verre épais », R9 Bloc) [Lab 08/11]. **Seulement au-dessus d'une image** |
| F5-4 La mascotte se penche | 3 | Assets à confirmer ; seulement sur la page de l'app (§ 2.5) |
| F5-5 L'étagère de progression | 4 | Garder si les objets existent |
| F5-6 La lumière change (le point) | 4 | Garder comme geste du point de F5 |

---

## 2. Direction par direction

### 2.1 F1 « REC / PROD »

**Verdict** : la plus forte. À garder, avec trois correctifs.

**Ce qui tient**
- **C'est la seule direction qui traduit littéralement une règle validée.** La charte définit deux intensités par leur format : énergique en 1080×1920, posé en 1920×1080 [Charte]. F1 en fait la séparation des casquettes.
- **Le point reste le pivot.** L'accueil asymétrique (une fenêtre paysage, une fenêtre verticale) évite l'écran coupé en deux.
- **Deux vraies signatures** : le timecode lié au défilement, et le point qui s'étire en bouton.

**Ce qui ne tient pas**
- **Côté Pro, le look « page de statut »** : Inter Tight, Geist Mono et un voyant vert (§ 1.4).
- **Le 21:9 sur mobile** : à 390 px de large, un module 21:9 fait 167 px de haut. C'est trop mince pour une capture d'app.
- **La page Agents** n'a aucun geste propre à F1.
- **Les deux modes sombres** : si le Pro suit `prefers-color-scheme`, la séparation « papier contre nuit » disparaît. Le Pro sombre proposé (`#101113` avec le vert `#34C38F`) ressemble en plus au site actuel (`#030305` avec `#00c8a0`).
- **Les bandes** qui recadrent la page frôlent la transition en masque [Stratégie F1, risques].

**Renforcements**
- **Palette Pro**, toujours claire (la lumière fait partie de l'identité ; pas d'inversion automatique) :

  | Rôle | Valeur | Contraste |
  |---|---|---|
  | papier / surface | `#F5F3EE` / `#FBFAF7` | — |
  | encre | `#16181C` | 16,03 |
  | secondaire | `#5D6168` | 5,61 |
  | voyant PROD (24 px et plus, non-texte) | `#1F8A5B` | 3,91 |
  | PROD texte | `#17704A` | 5,48 |
  | bouton : crème sur | `#17704A` | 5,83 |
  | Agents, Hermes (filets, libellés) | ardoise `#2E3A4A` | 11,05 |

- **Palette Créateur**, nuit par défaut, avec une variante crème au choix manuel :

  | Rôle | Valeur | Contraste |
  |---|---|---|
  | nuit | `#0E0D0C` | — |
  | crème | `#F4EFE6` | 16,95 |
  | secondaire (nouveau) | `#A8A196` | 7,58 |
  | REC | `#FF5A1F` | 6,23 |
  | rouge de la charte (un seul élément) | `#E8322B` | 4,55 |
  | jaune, accroche seulement | `#FFE600` | 15,32 |

- **Typo** : le socle du § 1.5.
  - Pro : versions en chiffres tabulaires d'Inter, avec le zéro barré.
  - Créateur : IBM Plex Mono **seulement** pour le timecode.
- **Formats** :
  - Pro en **16:9**, le format posé de la charte. Le 21:9 reste pour les bandeaux de tête sur ordinateur.
  - Sur mobile, les modules Pro passent en **3:2**, l'autre format des vidéos App Store [Stratégie F1].
- **W1 « L'iris du point »** (remplace les bandes) :
  1. Au clic, à Entrée ou à Espace, la page se referme en iris **vers le point** : 240 ms, `cubic-bezier(0.32, 0, 0.67, 0)`.
  2. Fermé, le point passe de PROD à REC en 80 ms.
  3. L'iris se rouvre depuis le point sur la page jumelle : 400 ms côté Créateur, 600 ms côté Pro, `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Entre les deux, on voit le fond de la page d'arrivée : jamais de blanc, jamais de flash.
  - Mise en œuvre : View Transitions + `clip-path: circle()` centré sur les coordonnées du point ; ailleurs, un fondu de 120 ms. Avec mouvement réduit : le fondu.
  - **Source** : la « fermeture en iris » fait partie des transitions que Kenz valide [Brief 03 § 2.2], et l'iris existe déjà dans le lab avec son son [Charte, « Le son »].
  - **Variante B à tester** : le **flou directionnel**, lui aussi validé. La page part de −24 px avec un flou de 8 px (240 ms), la nouvelle arrive en 400 ou 600 ms.
  - L'iris est-il un « effet de masque » pour Kenz ? À trancher (question 1, § 6).
- **La ligne d'état** : la frappe en mono disparaît. La version monte d'une fente, flou → net (geste de la charte).
- **W7 « Timeline à pistes »** pour `/pro/agents` (voir § 3.2).
- **Les rails de la colonne 9:16** (sur ordinateur, ils règlent le risque de « colonne vide ») :
  - à gauche, **le plan** : série, épisode, ville en Melodrama et son nom chinois en Noto Sans SC, date ;
  - à droite, **ce que ça m'a coûté** : le prix vécu validé, et le verdict en tampon ;
  - les rails changent quand une vidéo s'aimante (geste « fente »).
- **Les deux casquettes** [Avis] : Pro 4/5 aujourd'hui, 5/5 avec ces correctifs ; Créateur 4/5 ; séparation 5/5.
- **Assets à prévoir** : 3 à 5 extraits verticaux légers et des captures 16:9 des vidéos App Store (à confirmer avec Kenz).

### 2.2 F2 « Carnet »

**Verdict** : le meilleur Pro pour un client qui veut des agents fiables. Le Créateur est à refaire.

**Ce qui tient**
- **La discipline de preuve est le décor.** Pour un client qui veut des agents fiables, c'est l'argument le plus fort des cinq.
- **`/livrable/[jeton]` a le même format** (« Où j'en suis », décisions datées, « Valider ») [Stratégie C5]. Le site et le livrable client parlent la même langue visuelle.

**Ce qui ne tient pas**
- **Le Créateur est trop sage pour un abonné TikTok** (la stratégie le dit), et un carnet de route crème frôle l'effet album scrapbook.
- **La même métaphore des deux côtés** : la séparation ne repose que sur le papier et l'encre, ce qui se lit mal en un coup d'œil.
- **Newsreader** sort de la charte ; la **moutarde en texte** échoue (2,28:1).
- **La feuille qui glisse** est une transition générique ; **la grille de fiches** est une grille de cartes.
- **Risque d'effet « modèle Notion »** [Stratégie F2].

**Renforcements**
- **Pro, « carnet d'atelier »** :
  - quadrillage décoratif de 8 px ;
  - stylo bleu `#2B4C9B` pour les annotations (6,90) ;
  - vert prod `#2F6B4F` (5,39) ;
  - graphite `#5C5853` (6,05).
- **L'index des apps devient un registre**, comme `Carte des apps` : une ligne par app (sortie, version, statut, IA oui ou non, prochaine action). Une ligne s'ouvre en tiroir sur sa fiche « Où j'en suis ». Il n'y a plus de grille de cartes.
- **Créateur, « l'image annotée »** (à la place du carnet de route) :
  - des images **plein cadre**, tirées des vidéos de Kenz ;
  - par-dessus, la couche d'annotations de ses montages : une flèche tracée à la main (validée le 07/11, elle s'arrête **avant** le visage [Charte]), un prix barré, un tampon, le nom du lieu en Melodrama ;
  - l'énergie vient de l'image, le « carnet » ne survit que dans les annotations.
  - Couleurs : texte crème `#F4EFE6` avec le « halo sombre très doux » de la charte ; **un** rouge `#E8322B` pour le trait ; moutarde `#F2C14E` en aplat sous de l'encre ; moutarde texte `#7D5A10` sur papier.
- **Typo** : le socle, plus IBM Plex Mono pour les dates et les statuts du Pro. Newsreader reste une option pour les études de cas longues, si Kenz l'aime.
- **W « Le quadrillage se retire »** (le geste du point) :
  - **de Pro vers Créateur** : les lignes du quadrillage se rétractent vers la marge (`scaleX` de 1 à 0, 8 ms d'écart, 300 ms au total, power3.in). Le point passe du bleu au rouge, puis la nouvelle page entre avec le token « carte » (+34 px, de 0,965 à 1, 550 ms) ;
  - **de Créateur vers Pro** : les lignes se redessinent depuis la marge (expo.out, 400 ms) ;
  - mise en œuvre : une vingtaine de filets de 1 px animés par GSAP (`stagger`), sans masque.
- **Le renvoi de marge** : sur ordinateur seulement.
- **Les deux casquettes** [Avis] : Pro 5/5 ; Créateur 2/5 aujourd'hui, 4/5 avec l'image annotée ; séparation 3/5, puis 4/5.

### 2.3 F3 « Lignes »

**Verdict** : une excellente métaphore pour le Pro, un mauvais système global.

**Ce qui tient**
- **L'« arrêt obligatoire » à « Validation humaine »** est l'image la plus claire de l'humain dans la boucle.
- **Les pipelines collent à la ligne** : compile → valide → publie → active ; migration → serveur → contenu → build. Un client y voit d'un coup d'œil comment se passe une livraison.
- **Les codes P1–P3 et C1–C4** reprennent l'habitude des codes de motions de Kenz.

**Ce qui ne tient pas**
- **Un seul plan réunit les deux familles** autour d'une correspondance « Kenz » : c'est visuellement l'inverse de « ne pas tout mélanger ».
- **Sept couleurs de lignes** :
  - la ligne Asie, en rouge, met du rouge sur chaque station, alors que la charte n'autorise qu'**un** élément rouge à l'écran ;
  - trois couleurs échouent au contraste (§ 1.6).
- **k15ze et le Sport ne sont pas des lieux** : en lignes sur une carte, la métaphore casse.
- **JetBrains Mono et le skill `industrial-brutalist-ui`** tirent vers le geek.
- **Jusqu'à ~1,1 s de trajet** avant chaque page.

**Renforcements**
- **En faire un module « Lignes », côté Pro seulement**, sur trois pages :
  - `/pro/agents` : la ligne avec l'arrêt obligatoire ;
  - `/pro/apps/[app]` : la ligne de déploiement ;
  - `/pro/lab` : l'ouverture des lignes, de 2024 à 2026.
  - Tracés orthogonaux, à 45° et 90°.
- **Le Créateur a sa propre carte géographique** (la « carte aux tampons », piste 7 du brief 03). Ce n'est jamais le même SVG, ni la même page.
- **Lignes Pro (une famille d'encres)** :

  | Ligne | Couleur | Contraste |
  |---|---|---|
  | Apps | bleu `#2D52C4` | 6,28 |
  | Agents | ardoise `#3E4A5C` | 8,37 |
  | Services | sauge foncée `#4D7A59` | 4,61 |
  | texte secondaire | gris `#62656B` | 5,45 |

  Les codes de lignes sont en crème dans une pastille de la couleur de la ligne (au moins 4,6:1 pour toutes).
- **Carte Créateur** : **une** saison active à la fois, avec son accent [Charte] : Chine `#E8322B` (trait, 3,97, non-texte) ou Maurice `#0F5D6B` (6,99).
- **Typo** : Archivo semi-condensé pour les noms de stations, Inter Display pour le texte, horaires en chiffres tabulaires. Plus de mono. Le chinois et le japonais sont chargés avec `text=`.
- **Le trajet de la rame** ne joue que sur la page du plan. Le survol vaut aussi pour le focus et le toucher.
- **Skill** : remplacer `industrial-brutalist-ui` par `minimalist-ui` ou `frontend-design`.
- **Les deux casquettes** [Avis] : Pro 4/5 ; Créateur 3/5 ; séparation 1/5 aujourd'hui, 4/5 une fois les deux plans séparés.

### 2.4 F4 « Épisode »

**Verdict** : le Créateur le plus fort ; le Pro à abandonner.

**Ce qui tient**
- **Le côté Créateur le plus fort des cinq.** Sa grammaire vient des formats réels et validés de Kenz : la rafale, le verre du titre, l'affiche WANTED, les tampons, 第N話. Les séries sont rangées par saisons, comme Kenz l'a décidé le 08/11.

**Ce qui ne tient pas**
- **Le Pro en « arcs », « épisodes » et « Précédemment dans… »** habille le travail client en divertissement. C'est exactement le mélange que Kenz veut éviter. Un client qui veut installer des agents attend un process, des preuves et sa validation, pas une saison.
- **Aucune transition du point.**
- **Bebas Neue en titre** (§ 1.4).
- **La rafale** : 6 à 7 fermetures plein écran du déclencheur en moins de 2,6 s, soit près de 3 par seconde. On frôle la limite de 3 flashs par seconde du critère WCAG 2.3.1. En lecture automatique, elle retarde aussi l'affichage principal sur mobile.
- **WANTED au survol** : le survol n'existe pas sur mobile, l'appareil du public principal. Et figer la page au survol bloque le bouton.
- **Les épinglages et l'inertie** sont des gadgets ; **le lagon sur l'encre** échoue (2,53:1).

**Renforcements**
- **En faire la peau Créateur d'un hybride** : F4 Créateur avec F2 Pro (ou F1 Pro). Voir § 5, maquette C.
- **Palette Créateur** :
  - encre `#0E0D0C` (au lieu de `#111013`, pour que le rouge de la charte passe à 4,55:1), ou garder `#111013` et le rouge à 24 px et plus ;
  - crème `#F4EFE6` ;
  - jaune `#FFE600` pour l'accroche seulement ;
  - moutarde `#F2C14E` ;
  - lagon `#3FB0C2` sur fond sombre (7,41) et `#0F5D6B` sur crème ;
  - accent de saison.
- **Typo** :
  - Inter Display 800 en capitales serrées pour les titres d'épisodes ;
  - Melodrama pour les lieux ;
  - Instrument Serif italique pour le mot ;
  - Dela Gothic One pour 第N話 seulement, chargée avec `text=` ;
  - Bebas Neue pour les tampons seulement.
- **La rafale, corrigée** :
  - on garde les 7 plans du générique validé ;
  - entre les plans, des **coupes franches** ; les lames du déclencheur ne jouent **qu'une fois**, juste avant le titre ;
  - elle se lance après le premier affichage, à partir de 7 JPG légers (40 Ko au plus chacun). S'ils ne sont pas chargés vite, on montre directement l'image finale ;
  - une fois par visite, avec un bouton « Passer » ; avec mouvement réduit, l'image finale.
- **WANTED, déplacé** : l'affiche entre une seule fois quand le bas de `/moi` ou de `/asie` arrive à l'écran (rotateX de 12° à 0°, 600 ms). La page ne se désature pas, et « S'abonner » reste un lien normal à tout moment.
- **Les épisodes** :
  - une bande horizontale avec `scroll-snap` ;
  - un en-tête collant « ép. 12 / 46 », mis à jour par `IntersectionObserver` ; le numéro change par la fente ;
  - « Précédemment dans… » en défilement natif.
- **W « Arrêt sur image »** (la transition du point qui manquait) :
  - **de Créateur vers Pro** : l'image se fige et se désature de 30 % (200 ms) ; le point REC devient un carré « stop », puis le voyant PROD ; la page Pro entre en 600 ms ;
  - **de Pro vers Créateur** : le déclencheur photo (deux lames, 90 ms, une seule fois) s'ouvre sur la page Créateur ;
  - les deux gestes viennent de la grammaire de montage de Kenz ; le déclencheur fait partie de ses transitions validées [Brief 03 § 2.2].
- **Les deux casquettes** [Avis] : Pro 1/5 (à remplacer) ; Créateur 5/5.

### 2.5 F5 « Matière »

**Verdict** : à garder pour plus tard, en couche plutôt qu'en direction complète.

**Ce qui tient**
- **Les matières sont vraiment validées** : Kenz a validé la lentille de verre, le verre épais et les objets en relief [Lab 08/11].
- **La vue éclatée « Sous le capot »** est le meilleur geste Pro des cinq : elle explique une stack à un client non technique en un seul geste.

**Ce qui ne tient pas**
- **Les assets** : le lab a 12 objets en pâte, rendus en local avec Three.js. Au 11/11, **deux seulement** sont exportés en PNG (téléphone et pièce) [Lab 08/11, fichiers observés le 11/11]. Il n'existe aucune icône d'app ni aucune mascotte en pâte, et la génération d'images est interdite à cette étape : les maquettes seraient vides.
- **La référence de Kenz** pour ces objets est « objets 3D en pâte, pastel, **sur bleu nuit** » [Lab 08/11]. F5 propose au contraire un studio crème chaud.
- **Les objets du côté Créateur** (téléphone, pièce, avion) sont présentés comme des icônes de voyage génériques.
- **Clichés** : le tilt, le bento, Fraunces (§ 1.4). Le corail et le doré échouent en texte (§ 1.6).
- **Les mascottes sur le hub Pro** risquent de paraître enfantines à un client.
- **Les étiquettes en verre sur un fond uni** sont du glassmorphism.

**Renforcements : une couche « Matière », utilisable par les maquettes A, B et C**
1. **W10 « Vue éclatée »**, dans chaque étude de cas Pro :
   - 5 plans en CSS 3D (`transform-style: preserve-3d`), des surfaces plates dans la couleur de l'app ;
   - les vraies étiquettes de la stack (« Fastify 5 », « Postgres + Drizzle », « VOICEVOX »…) ;
   - 28 px d'écart entre les plans, 60 ms de décalage, 480 ms au total ;
   - avec mouvement réduit, une liste empilée ;
   - aucun rendu 3D nécessaire.
2. **W11 « Objets-preuves »**, sur les pages de prix du côté Créateur. C'est la version web de la motion I9 Profondeur du lab (« chaque poste avec son objet en pâte qui tourne, puis le total ») [Lab]. Chaque objet porte **un** prix vécu et validé :

   | Objet du lab | Prix vécu validé (10–11/10) [Brief 02 § 2.2] |
   |---|---|
   | avion | vol Pékin → Chongqing, ≈ 100 € |
   | TGV | train Chongqing → Wulong, moins de 9 € |
   | lit | V Life, 24 h de spa à volonté avec le petit-déjeuner, 25 € |
   | bol | un repas à Shanghai, 7–8 € |
   | téléphone | réparation d'iPhone à Shenzhen, ≈ 10 € (200 € sur le site d'Apple France) |
   | épingle | l'itinéraire de base Pékin → Chongqing (+ Wulong) → Shanghai |

   - L'objet descend de 12 px et son ombre de contact apparaît (260 ms) ; le prix monte d'une fente.
   - Images : WebP fixes de 60 Ko au plus, **exportés par Kenz depuis son lab**. Pas de Three.js sur le site.
3. **Le verre** :
   - les cartes d'info en verre dépoli **seulement au-dessus d'une vraie image**, avec les valeurs de la charte (`rgba(28,27,26,.42)`, flou de 26 px, liseré blanc à 16 %) ;
   - le bloc de verre épais seulement pour un titre de chapitre posé sur une image ;
   - les lettres en verre réfracté seulement pour « BRANCHE TOI » [Charte].

**Si F5 reste une direction complète**
- **Créateur sur bleu nuit `#16203A`**, comme la référence de Kenz :

  | Rôle | Valeur | Contraste |
  |---|---|---|
  | crème | `#F4EFE6` | 14,08 |
  | corail | `#F0705A` | 5,51 |
  | pêche | `#F6B48F` | 9,10 |
  | secondaire | `#A9B2C6` | 7,58 |

- **Pro** : studio `#ECEFEC`, sauge texte `#48654F` (5,58).
- **Typo** : le socle.
- **Gestes** : on soulève l'objet, sans tilt.
- **Mascottes** : seulement sur la page de leur app, jamais sur le hub Pro ; uniquement avec les assets existants des apps ; seule celle de Croc a le droit de rebondir [Brief 03 § 2.2].
- **Les deux casquettes** [Avis] : Pro 3/5 ; Créateur 2/5 aujourd'hui, 4/5 avec les objets-preuves.

### 2.6 Récapitulatif des deux casquettes [Avis]

| Direction | Pro aujourd'hui → corrigé | Créateur aujourd'hui → corrigé | Séparation | Agents lisibles par un client |
|---|---|---|---|---|
| F1 | 4 → 5 | 4 → 4 | 5 | 1 → 4 (timeline à pistes) |
| F2 | 5 → 5 | 2 → 4 | 3 → 4 | 5 |
| F3 | 4 → 4 (module) | 3 → 3 (carte séparée) | 1 → 4 | 4 |
| F4 | 1 → remplacé | 5 → 5 | 3 → 5 (hybride) | 1 → selon le Pro choisi |
| F5 | 3 → 3 | 2 → 4 | 3 | 3 (vue éclatée) |

---

## 3. La page « Agents IA » : ce qu'un futur client doit comprendre

Kenz l'a précisé : pas de détails privés, mais montrer côté Pro **tout ce qui peut être mis en place**, avec Hermes, pour qu'un futur client le comprenne. En 10 secondes, le client doit saisir :
1. **ce qui s'installe chez lui** : une équipe d'agents pour son besoin ;
2. **comment elle s'organise** : Hermes coordonne, chaque rôle est séparé, la mémoire est commune ;
3. **où il garde la main** : rien ne part sans sa validation ;
4. **comment c'est vérifié** : les statuts de preuve, les relectures ;
5. **ce que ça a déjà produit** : les preuves (apps, saison Sago, vidéos).

Rien sur l'usage privé de Kenz.

### 3.1 Une grammaire visuelle commune des pratiques

Le même motif, quelle que soit la direction. Ainsi, chaque pratique devient **visible**, pas seulement écrite.

| Pratique (source) | Motif visuel | Geste |
|---|---|---|
| Une proposition n'est pas une décision [Stratégie A5] | proposition = contour **pointillé**, sans date ; décision = trait **plein** et datée | au clic sur « Valider », le pointillé se referme en trait plein (380 ms) et la date monte d'une fente |
| Les statuts de preuve [Brief 03 § 3.3] | pastille : pleine = observé, demi = déclaré, contour = hypothèse, pointillé gris = à confirmer. Forme et texte, pas seulement la couleur | W3 |
| Des rôles séparés : ce qu'il lit, ce qu'il écrit, ce qu'il n'a pas le droit de faire [Brief 03 § 3.3] | une fiche de rôle en trois colonnes ; la colonne « interdit » est la plus visible | au survol ou au focus d'un rôle, ses accès s'allument dans la mémoire partagée |
| Hermes coordonne, garde les points de reprise, règle les conflits et ne lance aucune automatisation seul [Brief 03 § 3.3] | un nœud « Hermes · coordination », **seul nom propre** du schéma [Stratégie G4, recommandation] | — |
| La mémoire partagée, lisible par un humain | la fiche « Où j'en suis · Prochaine action · Décisions » | W15 |
| Le protocole de transmission : contexte, décisions validées, résultat + preuve, limites, prochaine action, destinataire [Stratégie A5] | une carte de transmission à 6 champs | la carte se remplit champ par champ, puis glisse vers son destinataire |
| Une instruction trouvée dans un document importé n'est pas une autorisation [Stratégie A5] | la ligne suspecte, mise en quarantaine et barrée, avec « donnée, pas consigne » | démo : un document importé contient « publie maintenant », et le flux ne bouge pas |
| L'humain dans la boucle, avec des options numérotées (« la 1 ») [Brief 03 § 3.3] | le flux s'arrête ; 2 ou 3 options numérotées, aussi au clavier (touches 1, 2, 3) | W6 |
| Livrer sans rien casser : la fonction sort derrière un drapeau éteint [Brief 03 § 3.3] | un interrupteur « drapeau » dans l'étude de cas | l'allumer montre la fonction dans l'écran ; l'éteindre la retire aussitôt, comme un retour arrière immédiat |
| Des relectures indépendantes et des rapports chiffrés (69/69 contrôles…) [Stratégie A5] | un tampon de relecture, avec son chiffre et sa date | pastille |

Une étiquette reste fixe sur le schéma : « Simulation — aucun agent ne tourne sur cette page » [Stratégie E3]. Les démos utilisent un **client fictif, étiqueté comme tel**.

### 3.2 Le schéma, direction par direction

- **F1, W7 « Timeline à pistes »** :
  - chaque rôle est une **piste**, comme dans un logiciel de montage : Hermes en piste maîtresse en haut, puis Produit et code, Contenu, Recherche sourcée, et en bas la piste **« Vous »** (le client) ;
  - les tâches sont des clips, les transmissions relient les clips, les validations sont des **marqueurs** sur la piste « Vous » ;
  - au clic sur « Lancer une demande », la tête de lecture avance, puis s'arrête à chaque marqueur jusqu'à « Valider » ;
  - **ancrage** : la chaîne de montage de Kenz produit déjà une séquence Premiere [Brief 03 § 3.3], et le format paysage du Pro accueille naturellement une timeline ;
  - aucune fenêtre de terminal.
- **F2, « Le dossier de transmission »** :
  - une colonne par rôle, et des cartes de transmission à 6 champs ;
  - la validation du client est un tampon daté et signé, le même que dans `/livrable` ;
  - c'est la version la plus convaincante pour un client qui achète de la fiabilité [Avis].
- **F3, « La ligne avec arrêt obligatoire »** : comme dans la stratégie, en module Pro. Le segment qui suit la validation reste en pointillé tant que le client n'a pas cliqué « Valider ».
- **F4** : sans objet. Le Pro vient de F1 ou de F2.
- **F5, « La vue éclatée d'une équipe »** :
  - 5 plans : Vous (validation), Hermes, les rôles, la mémoire, les garde-fous ;
  - un clic sur un plan ouvre sa fiche.

### 3.3 Ce qu'on ne montre jamais
- **Aucune phrase** qui laisse penser que des agents agissent à l'extérieur au nom de Kenz. Aucun exemple tiré de la vie privée de Kenz. Seulement les six cas clients de la stratégie (C2).
- **Seul « Hermes » est nommé** ; les autres agents sont désignés par leur rôle. L'éditeur de Hermes est **à confirmer** (G15) : ne pas l'écrire.
- **Pas de terminal**, pas de néon, pas de journal vert qui défile.

---

## 4. Le socle commun proposé (à ajouter à F0)

### 4.1 Les composants communs, sortis des directions
W2 Fente, W3 Pastille, W4 Prix barré, W5 Tampon, W6 Arrêt obligatoire, W15 Fiche « Où j'en suis ». Ils sont identiques dans toutes les maquettes ; seule leur matière change.

### 4.2 Nommer les gestes, comme les motions du lab
Kenz a demandé de « donner des noms aux motions » (O1 Rafale, R5 Itinéraire, I2 Barré…) [Brief 03 § 2.1]. On fait pareil pour le web.

| Code | Nom | Où | Durées clés |
|---|---|---|---|
| W1 | L'iris du point | F1 (le point) | 240 ms + 80 ms + 400 ou 600 ms |
| W2 | La fente | partout (chiffres, valeurs live) | sortie 160 ms, entrée 320 ms |
| W3 | La pastille de preuve | partout | filet de 200 ms, étiquette de 4 px |
| W4 | Le prix barré | Créateur | trait de 280 ms, le prix se pose en 320 ms |
| W5 | Le tampon | Créateur | de 1,04 à 1 en 160 ms |
| W6 | L'arrêt obligatoire | page Agents, livrables | anneau tracé une seule fois, 1,2 s |
| W7 | La timeline à pistes | F1, page Agents | 300 ms par segment |
| W8 | La coupe au mot | `/pro/video` | voir ci-dessous |
| W9 | Le drapeau éteint | études de cas | 180 ms |
| W10 | La vue éclatée | études de cas | 480 ms |
| W11 | Les objets-preuves | pages de prix | 260 ms par objet |
| W12 | La rafale | `/moi`, une fois par visite | 2,6 s au plus |
| W13 | WANTED | bas de `/moi` et de `/asie` | 600 ms |
| W14 | Le renvoi de marge | F2, sur ordinateur | 380 + 140 ms |
| W15 | La fiche « Où j'en suis » | partout | tiroir, 40 ms d'écart entre les entrées |
| W16 | Le timecode | F1 Créateur | lié au défilement |

**W8 « La coupe au mot »**, nouvelle proposition pour `/pro/video` :
- on montre la transcription d'un extrait **d'exemple** et, sous elle, une timeline ;
- un clic sur un mot coupe la timeline à cet endroit : le segment se referme en 240 ms ;
- c'est la démonstration la plus directe du savoir-faire « rushs + voix off → transcription → coupe au mot → montage » [Brief 03 § 3.3], pour une marque ou un créateur qui veut produire plus vite ;
- c'est faisable en JS vanilla : des `span` pour les mots, des `div` pour la timeline.

### 4.3 Règles de la charte à transposer (absentes de F0 aujourd'hui)
- **Crème, jamais de blanc pur**, pour le texte posé sur une image [Charte].
- **Le texte ne passe jamais sur un visage**, et la flèche s'arrête avant. Sur le web, chaque photo de Kenz a ses zones de texte définies, et le recadrage responsive (`object-position`) les respecte.
- **Une ombre large et douce, jamais de contour.** Un halo sombre très doux derrière le texte posé sur une image.
- **La lueur forte sur un seul mot** ; jamais deux mots lumineux en même temps.
- **Inter Display** : deux graisses au plus dans un même bloc.
- **Le titre se révèle par un balayage doux**, de gauche à droite, avec du flou, en gardant le crénage. C'est un geste de la charte qu'aucune direction n'utilise ; il remplace avantageusement le « fondu + glissé vers le haut » interdit.
- **Les tiers et la marge commune** : le titre dans le tiers haut, le total ou la conclusion dans le tiers bas, et tous les blocs d'un écran partent de la même marge.
- **L'accent de saison** (§ 1.3).
- **Deux tokens par accent** (§ 1.6).
- **La lumière de chaque côté fait partie de son identité** : pas d'inversion automatique qui rendrait les deux côtés semblables.
- **Aucun son par défaut.** Si un jour il y en a : uniquement à la demande, uniquement les sons de Kenz, jamais les effets sonores d'anime (droits) [Hypothèse].

---

## 5. Recomposition recommandée et ordre de maquettage

Au lieu de cinq directions parallèles, **trois maquettes complètes et deux modules** [Avis].

| Maquette | Pro | Créateur | Geste du point | Modules |
|---|---|---|---|---|
| **A. REC / PROD, renforcée** | F1 Pro corrigé (papier, 16:9, Inter Display) | F1 Créateur (9:16 avec ses rails) | W1 Iris (variante : flou directionnel) | Timeline à pistes, vue éclatée |
| **B. Carnet, renforcée** | F2 carnet d'atelier, avec le registre | l'image annotée | le quadrillage se retire | Lignes (page Agents), objets-preuves |
| **C. Épisode × Carnet** | F2 Pro (ou F1 Pro) | F4 Créateur corrigé | arrêt sur image ↔ déclencheur | rafale corrigée, WANTED en bas de page |

**Les modules**, utilisables par A, B et C :
- **Lignes** (F3, Pro seulement) : les agents, le déploiement, la frise du Lab ;
- **Matière** (F5) : la vue éclatée, les objets-preuves, le verre posé sur une image.

**Ordre**
1. **A, puis B** : peu d'assets, le système le plus fort, et c'est là que la page Agents est la plus claire pour un client.
2. **C**, dès que 7 plans fixes et 3 à 5 extraits verticaux sont exportés.
3. **La couche Matière**, quand Kenz a exporté les objets en pâte en WebP.

**Écrans** : ceux de la stratégie (F0), plus **`/livrable/demo`** dans la maquette B, parce que c'est l'écran le plus convaincant pour un futur client.

---

## 6. À trancher par Kenz (réponds par un numéro)

1. **Transition du point** : 1) l'iris qui se referme sur le point ; 2) le flou directionnel ; 3) les deux bandes de la stratégie.
2. **Typo du côté Pro** : 1) celle de la charte (Inter Display + Instrument Serif pour un mot) ; 2) une police propre au Pro, à proposer.
3. **La lumière du Pro** : 1) toujours claire, elle fait partie de l'identité ; 2) mode sombre automatique.
4. **Les objets en pâte sur le site** : 1) en objets-preuves, avec tes prix vécus ; 2) pas d'objets 3D sur le site.
5. **Les mascottes des apps** : 1) seulement sur la page de chaque app ; 2) aussi sur l'accueil Pro ; 3) jamais.
6. **Le schéma d'agents** : 1) la timeline à pistes ; 2) la ligne avec arrêt obligatoire ; 3) le dossier de transmission.
7. **Exports possibles** (aucune génération) : 7 plans fixes pour la rafale ; 3 à 5 extraits verticaux ; les objets en pâte en WebP ; des captures 16:9 des vidéos App Store. Lesquels peux-tu sortir ?
8. **TikTok Sans** pour k15ze sur le site : 1) oui, si la licence web le permet ; 2) non, Inter Display à la place.

---

## Sources

- **Briefs**, lus section par section : `_brief/03-marque-style.md`, `_brief/02-createur.md`, `_brief/04-strategie-v1.md` (11/11/2026).
- **Motion Lab, en lecture seule** : `00_Charte/CHARTE.md` (v2.0, 07/11 : polices, lueur, couleurs, verre, accent de saison, gestes, lisibilité, grille, son) ; `CHANGELOG.md` (v2.13.0 du 08/11 : les 12 objets en pâte, la référence « pastel sur bleu nuit », la motion I9 Profondeur) ; liste des fichiers de `03_Composants/exports/` (deux objets exportés, observés le 11/11).
- **Contrastes** : calculés le 11/11 avec la formule WCAG 2.x, par un script `node` local.
- **Aucune requête réseau, aucune tâche lourde.** Aucune note du coffre, aucun fichier du Motion Lab et aucun fichier du site n'a été modifié. Seul ce fichier a été écrit, dans `maquettes/_brief/`.

*— Claude, directeur de création, 11/11/2026.*
