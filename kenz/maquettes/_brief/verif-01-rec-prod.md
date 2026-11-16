# Vérification — maquette 01 « REC / PROD »

> Audit puis corrections du 11/11/2026, par un panel de cinq regards : produit, recherche UX, design visuel, motion, accessibilité.
> Fichier corrigé : `maquettes/01-rec-prod.html`. Références : `_brief/05-brief-final.md` (§ 4, 6, 7, 9, 10.1) et `_shared/content.js` (liste blanche).
> Précision de Kenz prise en compte : la partie Pro montre la **mise en place d'agents IA** (Hermes, rôles, mémoire, garde-fous, validation humaine) comme un savoir-faire qu'un client peut acheter, sans aucun détail d'usage privé.
> Rien n'a été vu dans un navigateur (règle : machine déjà chargée, plusieurs Chrome headless d'autres sessions observés pendant l'audit). Les constats de mise en page viennent de la lecture du CSS et de calculs à la main.

## Notes

| Axe | Avant | Après | En une phrase |
|---|---|---|---|
| Produit | 7 | 8,5 | La couverture était déjà bonne ; le premier écran mobile perdait son action Pro et le côté k15ze renvoyait vers la chaîne voyage. |
| UX | 6 | 8 | Plusieurs blocages sur la mise en page (bouton invisible au toucher, bandeaux qui rognaient leur bouton, carte illisible à 360 px). Note plafonnée tant que la maquette n'a pas été vue dans un navigateur. |
| UI | 7 | 8 | La direction tient. Les défauts : trop de rouges sur un même écran, des coupes en plein mot, des sources internes visibles. |
| Motion | 7,5 | 8 | Les signatures sont là, en natif. La vue éclatée était deux fois trop rapide et le flux d'agents suivait le mauvais ordre. |
| Accessibilité | 6,5 | 8 | Bordures de champs à 1,66:1, cibles sous 44 px, niveaux de titres, impression du CV qui perdait ses titres. |

## Ce qui tenait déjà

- Les 38 routes du sitemap sont rendues sur un routeur hash. On y trouve aussi les alias (`/chine`, `/apps/x`, `/projets/x`, `/destination/x`), le retour navigateur, le retour en haut de page et le focus sur le `h1`.
- Les deux casquettes sont vraiment séparées :
  - Pro : papier, 16:9, PROD vert, navigation haute, « vous ».
  - Créateur : nuit, colonne 9:16 entre deux rails, barre basse au pouce, « tu ».
  - Le point mène toujours au hub d'en face et porte un libellé visible.
- `/pro/agents` suit l'ordre du § 6.1, de l'ouverture à la FAQ :
  - les six cas titrés dans les mots du client ;
  - « ce que vous validez », « ce que vous recevez » et « ce qui reste humain » visibles sans accordéon ;
  - la démo « Composez votre équipe » s'arrête à la validation humaine (touches 1/2/3), et le document piégé est mis en quarantaine sans faire bouger le flux ;
  - « Envoyer ce brief » ouvre le devis pré-rempli.
- Aucun usage privé des agents n'apparaît. Hermes est le seul nom propre.
- La couche live est honnête : quatre états, une forme d'indicateur par état, et une horloge simulée.
- Tout le mouvement est natif : aucune bibliothèque ni CDN, seulement Google Fonts. Le mouvement réduit est respecté.
- Contrastes de texte calculés (WCAG 2.x) :
  - Pro : encre 16,03, secondaire 5,61, vert 5,48, bouton 5,83 ;
  - Créateur : crème 16,95, secondaire 7,58, REC 6,23 ;
  - k15ze : vert 9,95.

## Constats et corrections

Statut : **Corrigé** (appliqué dans le fichier) · **Restant** (à trancher ou à voir dans un navigateur).

### Bloquants

| # | Constat | Statut |
|---|---|---|
| B1 | **Bouton « Demander un devis » invisible au toucher sur l'accueil mobile.** Sur un téléphone, une règle mobile de la porte Pro écrasait l'état « pilule pleine » du bouton (`hover:none`). Le texte crème s'affichait donc sur le papier crème. Sur un ordinateur en fenêtre étroite, le survol rendait aussi le texte invisible. | **Corrigé.** La position du point passe par une variable `--pt-x`. Aucune règle locale ne peut plus écraser l'état pilule (survol, focus, tactile). |
| B2 | **Héros `/pro`, études de cas et en-tête du CV rognés.** Les bandeaux 21:9 et 16:9 avaient `overflow:hidden`. D'après le calcul à 1 024 et à 1 440 px, le titre de six lignes plus le texte d'appui dépassent la hauteur 21:9, si bien que le bouton « Demander un devis » pouvait être coupé. | **Corrigé.** Le rapport devient un minimum (le bloc grandit avec le texte) et seule la colonne image est rognée, avec ses propres coins arrondis. |
| B3 | **Impression du CV (`/pro/cv`) : titres absents.** Les éléments pas encore révélés au défilement restaient à opacité 0 (`.rv-attente`), donc les titres sous la ligne de flottaison disparaissaient du PDF. | **Corrigé.** En impression, tout est révélé et les tokens passent en clair. L'enregistrement PDF de l'itinéraire Chine imprime aussi en noir sur blanc, sans les boutons. |

### Majeurs

| # | Constat | Statut |
|---|---|---|
| M1 | Accueil à 390 px : le lien « Côté pro » de la porte Pro était masqué. Sans lui, le seul chemin vers `/pro` passait par le menu, et le 3:2 fixe risquait de déborder sur la porte Créateur. | **Corrigé.** Le 3:2 devient un minimum et le lien « Côté pro » est de retour. La porte Créateur prend la hauteur restante (entre 320 px et 4:5, en `svh` avec repli `vh`), pour que les deux portes tiennent dans le premier écran. |
| M2 | `/k15ze` : le bouton « S'abonner » de l'en-tête menait à la chaîne voyage. C'est le mélange interdit par la règle M4 du brief. | **Corrigé.** Sur `/k15ze`, il mène à la chaîne YouTube k15ze ; partout ailleurs côté Créateur, à Kenz in Asia. |
| M3 | `/now` sur ordinateur : la colonne Créateur en 9:16 (avec `overflow:hidden`) rognait la fin de son contenu (« Publication »). | **Corrigé.** Le 9:16 devient un minimum. |
| M4 | `/asie`, la carte : 6 colonnes de 50 px à 360 px, si bien que les noms (« Corée du Sud 한국 », « Émirats (Abu Dhabi) ») se chevauchaient. | **Corrigé.** Chaque pays occupe deux colonnes, sans collision (positions revues), et les rangées s'adaptent au contenu. |
| M5 | Bordures des champs à 1,66:1 et piste de l'interrupteur éteint à 1,66:1, sous le seuil de 3:1 des composants (WCAG 1.4.11). | **Corrigé.** Nouveau token `--trait` : Pro `#878278` (3,45 sur le fond, 3,66 sur la surface), Créateur `#7A736A` (3,75 et 4,15), k15ze `#66726C` (3,54). |
| M6 | En-tête entre 900 et 1 099 px : Pro (libellé du point, quatre liens, ⌘K, langue, devis) et Créateur (loupe avec libellé, timecode, S'abonner) dépassaient la largeur disponible. | **Corrigé.** Dans cette plage, ⌘K et la langue sont masqués (la langue reste dans le pied de page, ⌘K au clavier) et la loupe Créateur passe en icône. Le libellé du point reste visible, comme le demande le brief. |
| M7 | Sources internes visibles dans les pastilles publiques : « notes Dev », « brief 05 », chemins `i18n/dictionaries/fr.ts` et `data/projects.ts`. | **Corrigé.** Le filtre `srcPub()` retire les références aux documents de travail et les chemins de fichiers, et transforme « notes Dev » en « notes de développement ». Vérifié : aucune occurrence dans les 38 routes rendues. |
| M8 | Plusieurs éléments rouges sur un même écran : les quatre saisons Chine de la frise, plus les trois bases de l'itinéraire. Le brief n'en autorise qu'un par écran. | **Corrigé.** Seule la saison active (la dernière de la Chine) garde le trait rouge ; les autres ont un filet neutre. Les bases de l'itinéraire sont sobres. Le prix barré de l'iPhone reste l'unique rouge de `/asie/chine`. |
| M9 | Demande de Kenz : faire comprendre à un client tout ce qui peut s'installer. Les six cas n'arrivaient qu'après la section d'ouverture. | **Corrigé.** Un sommaire des six cas (puces de 44 px vers chaque page de cas) est ajouté dans le premier écran de `/pro/agents`. |
| M10 | Leçon affichée sur `/pro/agents` : « Une tâche lourde à la fois · des processus lancés en boucle ont saturé une machine ». C'est un incident d'usage privé, sans valeur pour un client. | **Corrigé (retiré de l'affichage), à valider par Kenz.** Les trois autres leçons restent : le modèle réellement utilisé, relire avant d'écrire, fidélité de l'audio. La règle de production « une seule tâche lourde à la fois » reste sur `/pro/video`. |

### Mineurs

| # | Constat | Statut |
|---|---|---|
| m1 | Cibles sous 44 px : langue (32 px), ⌘K (36 px), puces de liens « Les autres cas » (32 px). | **Corrigé.** La zone cliquable de la langue et de ⌘K déborde du visuel jusqu'à 44 px ; les puces de liens font 44 px. |
| m2 | Niveaux de titres : les portes de `/pro` étaient en `h2` sous un `h2`, les garde-fous en `h3` sous un `h3`. | **Corrigé.** Ils passent en `h3` et `h4`. |
| m3 | La timeline d'agents suivait l'ordre des pistes : le rôle Contenu proposait ses angles avant que la Veille ait relevé ses sources. | **Corrigé.** Le flux suit l'ordre du travail (veille, produit, code, contenu, relecture). Les pistes gardent l'ordre du brief. |
| m4 | W10, la vue éclatée : 240 ms au lieu des 480 ms du brief. Et en mouvement réduit, les onglets restaient alors que le brief demande une liste empilée. | **Corrigé.** Passée à 480 ms ; en mouvement réduit, la liste empilée s'affiche. |
| m5 | Pastilles de prix de l'itinéraire coupées en plein mot (« Grande Mura », « à volon »). | **Corrigé.** Coupe au dernier mot entier avec « … » ; le libellé complet reste dans l'infobulle. |
| m6 | Pastille « déclaré par Kenz le 11/11/2026 » sur le groupe « Agents & automatisation » du CV : cette date de déclaration n'existe pas. | **Corrigé.** La date ne s'affiche que pour le statut « lu dans le code ». |
| m7 | Vues de la vidéo HYROX (« 1 113 vues ») sans date de relevé. | **Corrigé.** Pastille « observé le 04/11/2026 · YouTube » ajoutée. |
| m8 | Exemple d'adresse e-mail dans un message d'erreur (règle : aucune adresse). | **Corrigé.** Le message devient « il manque l'arobase ou le domaine ». |
| m9 | Ton des pages communes : « Essaie… » dans la recherche, « Choisissez une intention » et « Ce qui vous amène » sur `/contact`. | **Corrigé.** Formulations neutres. |
| m10 | « 14 séries » dans le rail de `/asie`, alors que la liste contient aussi des hors-séries et des guides. | **Corrigé.** Le libellé devient « séries, hors-séries et guides ». |
| m11 | Attributs `lang` manquants sur le chinois, le japonais et le coréen (vignettes et carte de `/asie`). | **Corrigé.** Ajout de `zh`, `ja` et `ko`. |
| m12 | `aria-live` sur tout le registre des apps, bruyant au filtrage. L'annonce « N apps affichées » suffit. | **Corrigé.** |
| m13 | « Collaborer » absent du pied de page, alors que le brief le place côté Créateur. | **Corrigé.** Le lien est présent sur les pages Créateur et communes, jamais côté Pro. |
| m14 | Iris lancé depuis le menu mobile (masqué au clic) : il se refermait vers le coin haut gauche. | **Corrigé.** Il part du point de l'en-tête. |
| m15 | Sécurités : `overflow:clip` sans repli (Safari ancien), lien d'évitement animé sur `top`, titres longs sans coupure. | **Corrigé.** Repli `overflow:hidden`, lien d'évitement animé en `transform`, `overflow-wrap` sur les titres. |
| m16 | Polish des micro-interactions. | **Corrigé.** Flèche qui glisse sur les liens de `/liens`, appui sur les options 1/2/3, ouverture douce des FAQ (240 ms, 120 ms en mouvement réduit), point d'intention qui grossit quand il est choisi, filet W3 aussi au focus. |

### Restants

| # | Constat | Pourquoi ce n'est pas corrigé |
|---|---|---|
| R1 | Rien n'a été vu à l'écran : l'iris (DA-1), l'aimantation de la galerie, les pages à 360 et à 1 600 px, l'impression du CV. | Interdit sur cette machine (pas de navigateur headless). À regarder en premier dans un vrai navigateur, avec le bouton « Aperçu 390 px » du panneau. |
| R2 | Photos de pays (origine « à confirmer ») utilisées comme visuel de la dernière vidéo, sur l'accueil, `/moi`, `/now` et `/asie`. | `content.js` les associe lui-même (`live.derniereVideo.image`). Décision G15 / DA-7 de Kenz : remplacer par de vraies vignettes ou extraits. |
| R3 | Photos HYROX et Spartan affichées (droits « à confirmer »). | Elles sont déjà sur le site actuel. Décision G15. |
| R4 | Tampons « JE CONSEILLE » affichés par défaut (statut « proposé »). | Prévu par le brief. À valider par Kenz avant publication. |
| R5 | Les leçons d'agents et la leçon du Lab (« tableau de bord d'agents remplacé par des notes Markdown ») évoquent l'outillage de Kenz. | C'est formulé comme un savoir-faire et rien n'est privé, mais Kenz peut préférer ne garder que les pratiques et leurs preuves produits. |
| R6 | La barre basse Créateur affiche « k15ze » aussi sur `/liens`. | Navigation globale du côté, pas un contenu. À trancher si `/liens` doit être une page sans navigation, comme un vrai lien en bio. |
| R7 | « Demander une autre proposition » (option 3) rejoue le flux et ajoute à nouveau des lignes dans « Où on en est ». | Cohérent avec « l'historique n'est jamais écrasé ». À alléger si ça paraît répétitif à l'écran. |
| R8 | `/pro/apps/escapades-libres` reste accessible par URL directe hors mode « trous » (nom masqué). | La route fait partie du sitemap. Elle attend l'accord de l'équipe (G6). |
| R9 | Libellés des formulaires de `/contact` au « vous » (« Votre message »). | C'est l'usage courant d'un formulaire ; l'introduction de la page est neutre. |
| R10 | L'iris en variante B (flou directionnel) n'est pas implémenté. | Ce sera utile seulement si l'iris est refusé à DA-1. |

## Vérifications effectuées (sans navigateur)

- `node --check` sur le JS inline extrait dans `maquettes/_tmp-v1.js` : OK avant et après les corrections. Le fichier a ensuite été supprimé.
- Rendu des 38 routes avec un faux DOM léger en Node (script dans le scratchpad de la session, hors dépôt), dans cinq états :
  - défaut ;
  - « trous » ;
  - toutes les sources vides ;
  - sources en retard ou indisponibles ;
  - lien de livrable expiré.

  Résultat, plus la route inconnue : aucune erreur de vue, aucun `undefined`, `NaN` ou `[object` dans le HTML, **953 liens internes tous valides**, aucune adresse e-mail.
- Sondes ciblées dans le HTML produit :
  - sources internes absentes ;
  - leçon « tâche lourde » absente de `/pro/agents` ;
  - plus aucune coupe en plein mot ;
  - un seul `data-actif` rouge ;
  - sommaire des six cas présent ;
  - ordre veille → contenu respecté ;
  - « S'abonner » mène à k15ze sur `/k15ze` et à Kenz in Asia sur `/moi`.
- Les 38 chemins d'images de `content.js` existent sur le disque. Aucune image de `aEviter` n'est affichée (ni capture V1 de Sago, ni `background-moi`).
- Les accolades CSS sont équilibrées dans les deux blocs `<style>`.
- Contrastes recalculés (formule WCAG 2.x) pour les paires de texte et les nouveaux traits de composants.
- Données : chaque chiffre affiché vient de `content.js` avec sa pastille. Les « à confirmer » n'apparaissent qu'en mode « Montrer les trous ».

*Claude — vérification maquette 01, 11/11/2026.*
