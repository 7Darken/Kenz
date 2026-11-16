# Vérification — maquette n° 2 « Carnet » (`maquettes/02-carnet.html`)

> Audit puis corrections le 11/11/2026 par Claude (panel : produit, recherche UX, UI, motion, accessibilité).
> Lu en entier : `05-brief-final.md` (sitemap, audiences, livrables, checklist § 9.8, direction § 10.2), `_shared/content.js`, la maquette (3 400 lignes).
> Aucun navigateur, aucun serveur : contrôles en `node` (rendu des 38 routes hors DOM), `node --check`, `sips` pour 6 vignettes légères (vérification des textes alternatifs et des boîtes de visage).

## Notes sur 10

| Axe | Avant | Après | En une phrase |
|---|---|---|---|
| Produit | 7,5 | 8,5 | Très complet et bien séparé ; des étiquettes internes (« proposition, à valider », « Lot 2 », « à valider par Kenz ») s'affichaient au public et le Créateur avait un sélecteur EN. |
| UX | 7,5 | 8,5 | Routes, liens et formulaires solides ; porte créateur qui se chevauchait sur petit écran, cibles de 20 px, notes de marge bloquées fermées, palette ⌘K qui laissait sortir le focus. |
| UI | 7 | 8,5 | Direction tenue ; des dizaines de pastilles « observé le » sans date, 87 espaces typographiques manquantes, deux contrastes en échec, plusieurs rouges par écran. |
| Motion | 8 | 8,5 | Les six signatures sont codées en API native ; il manquait le tampon W5 des verdicts, la fermeture du tiroir clignotait, une onde de 700 ms. |
| Accessibilité | 7 | 8,5 | Bonne base (repères, aria, live, clavier) ; focus invisible sur les images (2,33:1), rôles ARIA cassés sur deux listes, niveaux de titres sautés. |

Plafond : rien n'a été vu à l'écran. Les notes « après » supposent que la mise en page rend comme le code le prévoit.

## Contrôles mesurés (après corrections)

- `node --check` du JS extrait (`maquettes/_tmp-v2.js`, supprimé ensuite) : OK.
- 38 routes + 404 rendues sous 6 scénarios (défaut, sources vides, en retard, indisponibles, anglais, devis pré-rempli + livrable expiré) : 0 erreur, aucun « undefined », « NaN » ou « [object Object] ».
- En-têtes, pieds, barres basses, menus : 38 routes × FR/EN, 0 problème (aucun sélecteur de langue ni anglais côté Créateur, rien du voyage dans le pied de `/k15ze`).
- 31 liens internes distincts : 0 mort. Liens externes : tous en `target="_blank" rel="noopener"`.
- 30 images affichées : toutes présentes, aucune image « à éviter ».
- Pastilles sans date (« … le » orphelin) : 0 (avant : 8 libellés différents, des dizaines d'occurrences).
- Espaces ordinaires avant `: ; ! ? »` ou après `«` dans le texte rendu : 0 (avant : 87).
- « proposition, à valider » visible hors mode trous : 0 (avant : 19, dont 12 sur `/pro/agents`).
- Rouges hors W4 : 0 en dehors du point (avant : `/`, `/now`, `/a-propos`, plus les liens fléchés rouges côté Créateur).
- Recherche de confidentialité (texte rendu des 38 routes) : aucune adresse e-mail, aucun identifiant, rien sur une recherche d'emploi ni sur des agents qui postulent. « Recrutement » n'apparaît que comme audience (le CV), conformément au brief.

### Contrastes calculés (WCAG 2.x)

| Paire | Ratio | Verdict |
|---|---|---|
| encre / papier | 16,25 | OK |
| graphite / papier · feuille | 6,05 · 6,60 | OK |
| stylo / feuille | 7,53 | OK |
| vert prod / feuille | 5,89 | OK |
| encre / moutarde | 11,30 | OK |
| lagon / papier | 6,43 | OK |
| k15ze : texte · vert · secondaire / fond | 17,90 · 10,78 · 7,49 | OK |
| graphite / intercalaire le plus foncé | 5,17 | OK |
| **numéros du sommaire (filet / papier)** | **1,29** | **corrigé → graphite 6,05** |
| **libellés de la carte (#8C8577, 12 px)** | **3,42** | **corrigé → graphite 6,60** |
| **contour de focus rouge sur image sombre** | **2,33** | **corrigé → crème 12,5** |

## Constats et corrections

### Bloquants et majeurs, corrigés

1. **Pastilles « observé le » sans date.** `KENZ.util.preuve` ajoute « le » même sans date : frises, CV, tiroirs, outils, langues, démo affichaient « lu dans le code le », « déclaré par Kenz le · récit pro de Kenz »…
   → Nouvelle fonction `libPreuve()` : « observé le 04/11/2026 · source » avec une date, « observé · source » sans date (pastilles et attribut `title`).
2. **Statuts de travail affichés au public.** « proposition, à valider » sous des preuves publiques (`/pro/agents`, cas veille et mémoire, ce site), « Exemple de contenu de now.json, à valider par Kenz » sur `/` et `/pro`, « matière sourcée, page à publier (Lot 2) » à côté du guide « Avant de partir » (`/now`, `/asie`, `/asie/chine`, `/guides`).
   → Les pastilles « proposition » et « à confirmer » ne s'affichent plus qu'en mode trous (`.pst-interne`). L'étiquette now.json passe en trou. Les guides affichent « en préparation », et l'état d'origine reste visible en mode trous. La source « proposition · brief 05 » de `/pro/apps/ce-site` passe en trou.
3. **Chiffre faussement « live » sur `/collaborer`.** « YouTube · 1 530 abonnés » était présenté comme un relevé du flux RSS (« relevé il y a 4 j »), alors que le RSS ne donne pas d'abonnés et que le chiffre a été observé le 04/11.
   → Affiché avec sa propre pastille : « observé le 04/11/2026 · YouTube (arrondi) ».
4. **Casquettes : l'anglais côté Créateur.** Sélecteur FR/EN dans l'en-tête et le pied créateur ; en EN, la barre devenait « Me / Asia / Subscribe » (contraire à G17 / M13).
   → Sélecteur retiré côté Créateur ; `langue()` force le FR sur ce côté (libellés et attribut `lang`).
5. **« Un seul rouge par écran ».** Liens fléchés en rouge texte côté Créateur (3 sur `/asie`, en plus du point) ; libellés « ● créateur » et « Côté créateur » en rouge sur `/`, `/now` et `/a-propos`, à côté du point rouge.
   → Liens fléchés à l'encre côté Créateur ; libellés créateur à l'encre (« ○ créateur ») sur les pages communes. Le seul rouge est le point, ou le trait du W4 quand il est à l'écran.
6. **Focus invisible sur les images** : contour rouge sur photo sombre, 2,33:1.
   → Contour crème dans les zones image (`.plein`, porte créateur). Sur les tuiles et les vignettes, qui sont elles-mêmes des liens, le contour est tracé à l'intérieur de l'image. Contour encre sur l'aplat moutarde de `/moi`, encre ailleurs côté Créateur. J'ai aussi corrigé un problème de spécificité dans ma propre règle.
7. **Typographie française** : 87 espaces ordinaires avant « : ; ! ? » et dans « », dans la copie codée en dur et dans les textes posés par `textContent` (toasts, états des formulaires, journal).
   → Passe typographique idempotente : `KENZ.util.fr` est appliqué à chaque nœud texte rendu (TreeWalker et MutationObserver ; script, style, textarea, code et kbd exclus). Elle ne peut pas boucler, puisque le motif ne correspond plus une fois l'espace fine posée.
8. **Accueil mobile** : porte créateur en `min-height: calc(100svh − 360px)`, soit 280 px sur un écran de 360×640. Le titre et la zone « dernière vidéo » se chevauchaient.
   → Plancher `max(400px, …)` ; le titre de la porte pro est compacté (la règle visait un `h1` qui n'existe pas).
9. **Cibles tactiles** : sur les pages communes à 420 px et moins, les deux points « côté pro / côté créateur » faisaient 20 px de large.
   → `min-width: 44px` ; liens du pied de page à 44 px.
10. **Adresse e-mail d'exemple** dans le message d'erreur (« nom@domaine.fr ») : retirée (« il manque l'arobase ou le domaine »).

### Mineurs, corrigés

- Numéros du sommaire (1,29:1) et libellés de la carte (3,42:1) : passés au graphite.
- Liste des pays : `role="listitem"` posé sur des `<button>` écrasait le rôle bouton (et `aria-pressed`) → conteneur en `role="group"`, boutons natifs.
- Palette ⌘K : `<li>` sans `role="none"` dans un `listbox`, Tab qui sortait du dialogue modal, page conditionnelle (MVP de la startup) proposée dans les résultats → corrigés ; la page conditionnelle n'apparaît qu'en mode trous.
- Captures : `tabindex="0"` et `aria-label` sur un div sans rôle → `role="region"`.
- Titres : la liste des cas et les offres sautaient de h2 à h4 → `h3.cas-titre`. Le registre n'avait pas de h2 (h2 masqué ajouté), et les h4 du tiroir passent en h3.
- Checklist Chine : case masquée en position absolue sans ancêtre positionné → `label { position: relative }`.
- Notes de marge : refermées sur mobile, elles restaient fermées et non cliquables si la fenêtre s'élargissait → réouvertes au passage à 1024 px et plus, et avant l'impression (CV, guide hors ligne).
- Devis pré-rempli : il affichait « depuis « Composez votre équipe » » même en venant de `/contact` ou d'un cas → la source réelle est mémorisée et affichée.
- Guides : « Il sort quand : la vidéo … publiée » (phrase bancale) → « Déclencheur : … ».
- Accueil : le texte alternatif affirmait « Vignette de la dernière vidéo » (non sourcé) → « Kenz dans une rue de Chine, de nuit ».
- `/k15ze` : le pied de page proposait l'Asie, les guides, `/liens` et `/collaborer` → colonne réduite à « Côté créateur » et « k15ze » (lien en bio de k15ze, rien du voyage).
- Aperçu à 390 px : l'iframe dépassait sur un écran étroit → `max-width: 100%`.

### Polish des micro-interactions, appliqué

- **W5 sur les verdicts** (`/asie/chine`) : les tampons étaient statiques. Ils se posent maintenant à l'arrivée dans l'écran (1,04 → 1, 160 ms, rotation −4°, une fois), et rien ne se passe en mouvement réduit.
- **Navigation pro** : le soulignement à la main ne faisait qu'apparaître ou disparaître. Il se trace maintenant au survol et au focus (clip-path, 240 ms, encre à 45 %), et il est plein sur la page courante.
- **Tiroir W15** : la fermeture revenait à l'opacité 1 pendant une image avant d'être masquée. Le fondu tient jusqu'au masquage, et les animations sont annulées à la réouverture.
- **« Relever maintenant »** : l'onde passe de 700 ms à 280 ms (plafond des micro-interactions).
- **`/asie`** : l'annotation essaie d'abord le bas droit, parce que le haut de l'image porte un titre et un drapeau incrustés.

## Restants (non corrigeables sans navigateur ou sans décision de Kenz)

1. **Rien n'a été vu à l'écran.** À vérifier sur Safari/iOS et Chrome : la mise en page à 360, 390 et 1440 px ; `clip-path` sur les SVG (soulignés, flèches, anneau) ; la 3D CSS des feuillets W10 ; `max()` combiné à `svh` ; le calcul des flèches qui s'arrêtent avant le visage.
2. **Images de pays** : ce sont des vignettes YouTube aux titres incrustés (CHINE, Malaisie avec « BY 7KINZE », CORÉE, JAPON en illustration). `Malaisie.webp` montre les tours de Kuala Lumpur au-dessus de rizières, le même genre de composite que l'image « à éviter ». Sur `/asie/chine`, « CHINE » apparaît deux fois (incrusté et en titre). Il faut les exports de Kenz (DA-7).
3. **HYROX** : la photo porte le filigrane « HYROX RIGA », visible en bas à droite sur mobile, alors que la donnée dit « Paris ». La ville n'est pas affichée ; la question figure dans le mode trous.
4. **`/moi` sur mobile** : le titre long bascule en bas pour éviter le visage et passe sur le t-shirt. La lisibilité de l'encre sur le vert anis est à vérifier.
5. **Leçons d'agents** (« Surveiller le modèle réellement utilisé », « Une tâche lourde à la fois : des processus lancés en boucle ont saturé une machine ») : elles sont dans la liste blanche et présentées comme des pratiques. À Kenz de trancher si elles restent trop proches de l'atelier interne.
6. **`/k15ze`** : les intercalaires et la barre basse gardent « Asie » et « Guides » (navigation créateur commune de `content.js`). À arbitrer.
7. **« (Lot 2) »** reste dans deux textes de `content.js` (confidentialité, stack de « Ce site »). Il faut le corriger à la source.
8. **`exempleTon`** (« payé un iPhone 10 € » contre une réparation dans les données) : toujours non utilisé, à corriger dans `content.js`.
9. **Mineurs connus** : sur ordinateur large, le h2 du sommaire précède le h1 dans le DOM. L'erreur de la case d'accord des alertes passe par un toast plutôt qu'en ligne. Le menu mobile n'est pas modal (choix assumé).

## Ce qui tient déjà (points forts)

- La signature visuelle est la discipline de preuve de Kenz : feuille datée « état au … », numéro de feuille, sources en marge, renvois tracés (W14), registre qui s'ouvre en fiche « Où on en est » (W15).
- La partie agents fait comprendre à un client ce qu'il achète : six problèmes dans ses mots ; validez, recevez et ce qui reste humain visibles sans accordéon ; démo « dossier de transmission » qui s'arrête à la validation humaine (touches 1, 2, 3) ; démo d'injection mise en quarantaine ; Hermes seul nommé ; « Envoyer ce brief » qui pré-remplit le devis. Aucun usage privé.
- Les casquettes sont vraiment séparées : feuille quadrillée et stylo bleu côté Pro, image plein cadre annotée côté Créateur, papier uni et point dédoublé sur les pages communes, sous-identité k15ze.
- La couche live a quatre états qui changent la forme de l'indicateur ; une horloge simulée, un mode trous et cinq états de formulaire simulables.
- Aucune dépendance : animations en API native, uniquement transform, opacity, clip-path et un flou léger, avec mouvement réduit respecté. Rien ne casse si un CDN tombe.
