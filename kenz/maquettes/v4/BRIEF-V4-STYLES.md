# Brief V4 : la même histoire en quatre styles (12/11/2026)

Kenz veut la V4 (accueil qui intrigue, pages projet, page agents, page créateur, cordon secret) dans les quatre styles de la V2, et pouvoir passer facilement d'un style à l'autre : « il y a des trucs que j'aime dans un style, des composants dans un autre, donc à voir ».

## Organisation
- `v4/golden/` : Golden hour, **déjà fait**. C'est la **base fonctionnelle** à reprendre.
- `v4/studio/`, `v4/portraits/`, `v4/fil/` : un dossier par style, avec les mêmes 4 fichiers : `pro.html`, `app.html`, `agents.html`, `createur.html`.
- Chemins depuis ces dossiers : `../assets/...` et `../shared/...`.
- Toutes les pages chargent l'outil de revue `<script src="../shared/revue.js" defer></script>` en fin de body. C'est la pastille en bas à gauche (retour et choix du style). Garde ce coin libre (environ 260 × 50 px) et n'ajoute aucun autre bouton retour.

## Ce qui ne change PAS (repris des pages Golden hour)
- **L'architecture et le récit** de chaque page :
  - **accueil** : hero, une histoire (Oshii), la victoire, les autres histoires en questions, aperçu agents, contact ;
  - **page projet** : arrivée dans la couleur de l'app, problème, comment ça marche, l'IA en clair et « Sous le capot », en vrai, action, histoire suivante ;
  - **page agents** et **page créateur** : mêmes séquences que dans Golden hour.
- **Les textes, les données et les liens** : reprends-les mot pour mot depuis `v4/golden/*.html`.
- **Les contrats** :
  - le point-cordon `button.kz-dot[data-cordon][data-vers][data-symbole]` dans le logo, sans aucune autre bascule visible entre Pro et Créateur ;
  - `Passage.ouvrir(...)` pour aller vers `app.html#slug` ;
  - les événements `passage:arrivee` et `porte:arrivee` ;
  - la ligne `data-porte-arrivee` dans le `<head>`.
- **Les règles** de `../v3/BRIEF-V3.md` et `BRIEF-V4.md` :
  - charte de Kenz ;
  - une idée par écran ;
  - **aucun composant « tag »** : pas de sur-titre en pastille ou en capitales espacées, pas de badge à point, pas de numéros 01/02/03 ;
  - mobile d'abord ;
  - mouvement réduit ;
  - rien d'inventé, rien de privé.

## Ce qui change : la couche visuelle et les composants signature du style
Chaque style reprend sa matière, sa composition et ses composants signature de la V2. Les fichiers de référence sont dans `../v2/`, à lire et à regarder :

- **Studio** (`v2/03-studio.html`) :
  - surfaces claires et chaudes, grain léger ;
  - **cartes premium « double bord »** (coque + cœur, grands rayons, ombres en couches) ;
  - grille bento aux tailles variées pour les captures App Store ;
  - carte portrait dont la tête **sort du cadre** ;
  - côté Pro en brume froide, côté Créateur en sable chaud ;
  - textes Encre ; mot italique en Lagon foncé.
  - Sur l'accueil, l'histoire Oshii et les questions vivent dans de grandes cartes ; dans les pages projet, les captures sont en bento.
- **Deux portraits** (`v2/01-deux-portraits.html`) :
  - clair et éditorial, fond porcelaine côté Pro et sable côté Créateur, beaucoup d'air ;
  - **le « Kenz. » géant derrière le portrait** en hero (le point du hero peut AUSSI porter le cordon) ;
  - l'iris (cercle qui s'ouvre) comme transition d'entrée sur les chapitres ;
  - les étagères de grandes cartes blanches ;
  - typographie magazine.
- **Le fil** (`v2/04-le-fil.html`) :
  - sombre Encre, Lagon côté Pro et lumière dorée côté Créateur ;
  - **le fil** (filet lumineux qui relie les chapitres, fil vertical à gauche sur grand écran) ;
  - **arches** pour les portraits ;
  - **défilement horizontal épinglé** pour les étapes « Comment ça marche » ou les captures (ordinateur seulement) ;
  - la **lentille** comme effet de survol sur les questions ou les portraits (décoratif : le passage secret reste le cordon) ;
  - récit au scroll très animé (GSAP ScrollTrigger).

Les passages secrets de la V2 (le point qui s'ouvre, l'heure, la carte qui se retourne, la loupe) **ne servent plus à basculer**. Leur mécanique visuelle peut revenir comme effet décoratif si elle sert le récit.

Le cordon (`../shared/cordon.css`) a des battants de pierre sombre. S'il expose des variables CSS, adapte-les au style. **Ne modifie aucun fichier de `../shared/`.**

## Vérification
Outil commun `/private/tmp/claude-501/-Users-kenz15-Documents-Dev-Kenz-kenz/492e2496-4b1a-48c5-9504-f1181702c2bd/scratchpad/review.cjs`, mode d'emploi dans `../v3/BRIEF-V3.md`. Le verrou sérialise les captures.
- 12 captures au plus par style, tags préfixés par le style.
- À vérifier : l'accueil sur ordinateur et sur mobile, une page projet, la page agents, la page créateur, et le cordon (`ACTION="drag:.kz-dot:0:190"`).
- Pas d'autre navigateur, serveur ni build.
- `node --check` sur le JS de chaque page, et `ls` de chaque asset cité.
