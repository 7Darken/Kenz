# Brief V5 : les apps et les 54 heures (12/11/2026)

## Ce que Kenz a dit après la V4 en 4 styles
« Je n'ai pas encore choisi le design, mais beaucoup de choses me dérangent. Surtout sur la partie app mobile : on ne comprend pas qu'il y a plusieurs apps. OK, il y a des lignes d'apps, mais il faudrait un truc beaucoup plus interactif. Pourquoi avoir mis Oshii plus en avant ? Peut-être le mettre en avant, mais aussi mettre en avant les autres. Pouvoir vraiment sélectionner, et comprendre direct : "ah oui, Wado, c'est une app pour le sport et la nutrition". Pas besoin de beaucoup de texte, il faut que ce soit visuel. Sur la landing : le héros, les apps, les agents IA (encore à voir). Peut-être du HyperFrames, des motions, pour représenter les 54 heures : bien comprendre. Là, on ne comprend pas, on voit juste "j'ai gagné, 54 heures". Il faut que ce soit beaucoup plus avancé visuellement. »

## Nouvelle structure de l'accueil Pro (les 4 styles)
1. Hero (inchangé).
2. **Les apps** : le module `apps` (nouveau). Il remplace l'histoire Oshii seule ET la liste de questions.
3. **Les 54 heures** : le module `victoire` (nouveau). Il remplace l'ancien bloc victoire.
4. Agents IA (aperçu, inchangé pour l'instant).
5. Contact (inchangé).

Les deux modules sont **partagés par les 4 styles** : `v4/shared/apps.css` + `apps.js`, et `v4/shared/victoire.css` + `victoire.js`.
- Ils prennent leur apparence dans les variables CSS de la page :
  - `--kz-bg`, `--kz-surface`, `--kz-ink`, `--kz-muted`, `--kz-line` ;
  - `--kz-accent` ;
  - `--kz-title` (police des titres), `--kz-text`, `--kz-word` ;
  - `--kz-radius`, et l'attribut `data-theme="dark"` ou `"light"` sur la section.
- Chaque style ajuste ensuite par-dessus (matière, cartes, arches…) dans sa propre page.
- Valeurs par défaut sensées si une variable manque. Ils doivent marcher dans un thème sombre (Golden hour, Le fil) comme dans un thème clair (Studio, Deux portraits).

Règles inchangées (voir `../v3/BRIEF-V3.md`, `BRIEF-V4.md`) :
- charte de Kenz ;
- une idée par écran, peu de texte, on montre ;
- **aucun composant « tag »** (pastille de sur-titre, badge à point, capitales espacées, numéros 01/02/03) ;
- mobile d'abord ;
- mouvement réduit respecté ;
- rien d'inventé, rien de privé ;
- GSAP 3.12.5 (cdnjs) autorisé si la page le charge, avec un repli sans lui ;
- aucune image externe.

## Module `apps` : « choisis une app »
**But** : en 3 secondes, on comprend qu'il y a plusieurs apps, et à quoi sert chacune, sans lire.

Ce qu'on voit :
- **Le dock** : les 6 icônes d'apps, grandes (64 à 80 px), en ligne comme sur l'écran d'un téléphone. À l'entrée dans l'écran, elles arrivent une à une (montée 34 px, 0,965 → 1, 70 ms d'écart).
- **L'app choisie** :
  - son icône se soulève et la lumière l'entoure ; les autres s'estompent légèrement ;
  - un trait fin sous l'icône se remplit pendant le défilement automatique.
- **Le domaine en très gros**, en police de titre, un ou deux mots :
  - Oshii : « Cuisine »
  - Sago : « Japonais »
  - Wado : « Sport & nutrition »
  - Croc : « Bonnes habitudes »
  - Miru : « Jeux entre amis »
  - Zenko : « Idées de journée »
  Il change avec un balayage doux et du flou. Dessous : le nom de l'app et UNE ligne (texte ci-dessous). C'est tout le texte.
- **Le téléphone** : un cadre de téléphone soigné (bords fins, reflet léger), au centre ou à droite. Il joue en boucle une **mini-animation propre à l'app** (2,5 à 4 s), puis montre 1,5 s la **vraie capture** (`assets/apps/<slug>-ecran-1.jpg` ; pour Wado et Croc, recadrer le visuel paysage ou garder l'animation seule).
  Les animations, adaptées en format téléphone depuis les scènes de `v4/golden/app.html` :
  - **Oshii** : une vidéo TikTok se replie dans l'icône, une fiche recette pesée se déplie.
  - **Sago** : ねこ flou, un chat se dessine, « J'aime les chats ».
  - **Wado** : le scan de l'assiette, puis les macros qui montent.
  - **Croc** : les jours de la semaine se cochent, la série monte.
  - **Miru** : un thème s'écrit, les cartes se distribuent.
  - **Zenko** : le budget glisse, la journée se recompose.
- **La couleur de l'app** teinte doucement le fond de la section et la lumière : Oshii `#E5483B`, Sago `#5B4BC4`, Wado `#2F7A55`, Croc `#8E7CF0`, Miru `#4B5FD6`, Zenko `#A0613A`. En thème clair, la teinte est très légère et le texte reste foncé (AA).
- **Une action** : « Découvrir l'app » appelle `window.Passage.ouvrir(el, 'app.html#<slug>', {couleur})` si `Passage` existe, sinon `location.href`. Un lien discret « App Store » à côté.

Interaction :
- **Défilement automatique** toutes les ~6 s tant que le visiteur ne touche à rien et que la section est visible. Il s'arrête au premier survol, clic, toucher ou clavier, et reprend après 10 s d'inactivité.
- Choisir une app : clic ou survol prolongé sur une icône du dock, flèches ← → au clavier (le dock est un `role="tablist"`, chaque icône un `tab`), glisser du doigt sur le téléphone.
- L'ordre d'arrivée est Oshii, Wado, Sago, Croc, Miru, Zenko, mais toutes ont le même poids visuel.

Mise en page :
- **Ordinateur** : grand domaine à gauche (avec nom, ligne, action), téléphone à droite, dock en bas sur toute la largeur.
- **Mobile 390 px** : le domaine en haut, le téléphone au centre (≈ 70 % de la largeur), le dock en bas, avec les 6 icônes visibles sans défiler (≈ 48 px).
- Hauteur d'environ un écran. Pas d'épinglage obligatoire.

Titre de section, discret : « Une app pour chaque petit problème. » (ou rien si le style s'en passe). Pas de chiffre.

Lignes par app (une seule chacune) :
- Oshii : « Ta vidéo TikTok devient une vraie recette. »
- Sago : « Le japonais, par l'image, épisode par épisode. »
- Wado : « Une photo de ton plat, et ton plan s'ajuste. »
- Croc : « Un petit pacte par jour pour arrêter de te ronger les ongles. »
- Miru : « Un thème, et le jeu se crée en direct. »
- Zenko : « Ta journée composée selon tes envies et ton budget. »

Liens App Store : voir `../v3/BRIEF-V3.md`. Icônes : `assets/apps/<slug>-icone.jpg`. Les chemins sont résolus depuis l'URL du script (`document.currentScript.src`) pour marcher depuis n'importe quel dossier de style.

Markup dans la page : `<section id="apps" class="kz-apps" data-kz-apps data-theme="dark" aria-label="Mes apps"></section>`. Le script remplit la section.

## Module `victoire` : « 54 heures »
**But** : qu'on comprenne ce qui s'est passé, en images et en mouvement, avec très peu de mots.

Les faits, sourcés par les photos et le site actuel de Kenz. **Rien d'autre.**
- Événement : **Techstars Startup Weekend, Grenoble**, 15e anniversaire (écrit sur le chèque géant, photo `startup-weekend-1.jpg`).
- Format : 54 heures, du vendredi soir au dimanche soir. Une idée, une équipe qui se forme, un prototype, un pitch devant le jury.
- Résultat : **1re place** (« Vainqueur du Startup Weekend… classé 1er devant le jury », site actuel).
- Le projet écrit sur le chèque : « Escapade Libre », une idée de voyages pour les personnes à mobilité réduite (tableau blanc de la photo `startup-weekend-3.jpg`). **Ne nomme pas le projet en texte** (accord de l'équipe à confirmer). La photo du chèque peut apparaître telle quelle.
- Photos :
  - `startup-weekend-3.jpg` (portrait) : l'équipe de 6 devant le tableau blanc couvert de recherches ;
  - `startup-weekend-2.jpg` : l'annonce, Kenz bras levés dans la salle (filigrane de photographe en bas à droite : recadrer) ;
  - `startup-weekend-1.jpg` : l'équipe sur scène avec le chèque géant.
- Ne nomme aucune personne de l'équipe.

Séquence (au défilement, épinglée sur ordinateur ≥ 900 × 600 ; sur mobile, chaque temps se joue à son entrée) :
1. **54:00:00**, un compteur géant en police de titre. Les chiffres montent d'une fente. Petite légende : « Startup Weekend, Grenoble. »
2. **Vendredi soir** : « Une idée, des inconnus. » Le compteur défile vite (≈ 50 h). Des points épars se rassemblent en une équipe de 6 (animation abstraite, sobre).
3. **Samedi** : « On construit. » La photo de l'équipe devant le tableau blanc arrive comme un tirage. Quelques traits du tableau s'animent dessus : flèches et cadres dessinés à la main, en SVG fin, sans texte inventé.
4. **Dimanche** : « Le pitch, devant le jury. » Le compteur approche de 00:00:00, la lumière baisse.
5. **00:00:00** : un éclat. La photo de l'annonce s'ouvre en plein cadre (iris ou balayage), avec en très grand « La *première* place. ». Puis le tirage du chèque se pose.
6. Dernière ligne, petite : « 54 heures pour transformer une idée en projet. »

Ton : cinématique et sobre, sans confettis cartoon. Une lumière dorée, quelques particules au plus au moment de l'éclat. Respecte la charte : arrive lentement, part vite, pas de rebond.

Markup dans la page : `<section id="victoire" class="kz-victoire" data-kz-victoire data-theme="dark" aria-label="Startup Weekend"></section>`. Le script remplit la section et gère ses épinglages (ScrollTrigger si GSAP est présent ; sinon IntersectionObserver et séquence jouée à l'entrée).

## Vérification
Outil commun `review.cjs` (scratchpad, verrou partagé, mode d'emploi dans `../v3/BRIEF-V3.md`).
- Crée tes propres pages de test dans `v4/_test/` : une sombre et une claire, avec les variables CSS du thème.
- Vérifie ordinateur 1440 × 900 et mobile 390 × 844, dans les deux thèmes.
- 12 captures au plus, tags préfixés par le module.
- Ne modifie AUCUNE page de style (`golden/`, `studio/`, `portraits/`, `fil/`) : l'intégration viendra après.
- `node --check` sur tes scripts.
