# Brief assets — Sport k15ze : stations HYROX, obstacles Spartan, boxe (icônes 3D)

Brief autonome pour l'agent assets de Kenz. 15/11/2026, Claude (Mac, session site Kenz).

**Livré le 15/11/2026 en WebP, conformément à la demande de Kenz.** 18 masters 1024 × 1024 sans perte et 18 copies 256 × 256, avec canal alpha et prompts exacts à côté de chaque résolution. [Aperçu et téléchargements](assets/sport3d/index.html) · [Manifeste](assets/sport3d/manifest.json) · [Vérifications des exports](assets/sport3d/validation.json). Les planches sur fond clair et sombre, à 40 et 160 px, sont dans `assets/sport3d/planches/`. Génération avec l'outil intégré image_gen ; conversion et mise au format avec Sharp. Le bloc PNG ci-dessous décrit la génération intermédiaire, les fichiers à utiliser sont les WebP.

## Contexte
Ces assets servent sur le site de Kenz, univers k15ze : `createur.html`, section sport, et `sport.html`.
- Au clic sur une course, une fiche compacte s'ouvre avec une petite animation qui explique le sport.
- Pour l'HYROX, un point court 1 km, s'arrête à une station qui s'allume, puis repart, 8 fois.
- Les pictogrammes au trait actuels sont jugés « pas du tout premium » par Kenz. Ces icônes 3D les remplacent.
- Maquette : https://claude.ai/artifact/MNrw9bbab3ZHZd1GyNrwCa (Créateur → sport → « Voir le détail + »).

## Le style à suivre (une seule série cohérente)
- **Objet 3D miniature « collectionnable »** : un seul objet par image, des formes pleines et un peu arrondies, aux proportions légèrement trapues, au rendu premium et tactile.
  - Matières : métal anodisé mat, caoutchouc satiné, textile technique, argile satinée.
  - Pas de photoréalisme brut, pas de style cartoon enfantin.
- **Palette k15ze** :
  - un corps **graphite et noir mat** (famille `#1A1D1C` à `#2A2F2D`) ;
  - des détails **off-white** `#F7F7F2` ;
  - **un seul accent vert** `#3DDC84` (poignée, sangle, liseré ou bouton) par objet ;
  - pas d'autre couleur vive.
- **Lumière studio** douce venant d'en haut à gauche, avec un léger liseré lumineux sur le bord droit pour décoller l'objet d'un fond sombre. Occlusion seulement dans l'objet.
- **Angle** : trois-quarts, légèrement plongeant (environ 25°), **le même pour toute la série**.
- **Fond réellement transparent** (canal alpha). Pas de sol, de socle, d'ombre portée détachée, de halo, ni de damier peint.
- **Aucun texte, chiffre, logo ou marque** (ni HYROX, ni Spartan, ni Concept2), **aucun visage, aucune personne, aucune main.** On montre l'objet du sport, pas l'athlète.
- **Lisible à 40 px** et beau à 160 px. Doit tenir sur le sombre `#0D0F0E` / `#141716` comme sur le clair `#F4F6F2`.

## À livrer
Un master WebP carré de 1024 px (ou plus) et une copie WebP de 256 px dans `256/` pour chaque fichier, avec à côté **le prompt exact** dans un `.txt` du même nom.

Dépôt : `~/Documents/Dev/Kenz/kenz/maquettes/v6/assets/sport3d/`

| Fichier | Sujet (objet seul) | Série |
|---|---|---|
| `hyrox-01-skierg.webp` | une machine SkiErg miniature : colonne verticale, deux poignées à câbles | HYROX |
| `hyrox-02-sled-push.webp` | un traîneau de poussée chargé de 2 disques, avec ses deux montants verticaux | HYROX |
| `hyrox-03-sled-pull.webp` | un traîneau chargé avec une corde épaisse lovée devant | HYROX |
| `hyrox-04-burpee-broad-jump.webp` | un tapis de sol avec une trajectoire de saut en ruban vert qui forme un arc vers l'avant | HYROX |
| `hyrox-05-row.webp` | un rameur miniature (volant, rail, siège) | HYROX |
| `hyrox-06-farmers-carry.webp` | deux kettlebells côte à côte | HYROX |
| `hyrox-07-sandbag-lunges.webp` | un sandbag cylindrique avec ses poignées | HYROX |
| `hyrox-08-wall-balls.webp` | un medicine ball posé devant une petite cible ronde murale | HYROX |
| `hyrox-run.webp` | une chaussure de running vue de trois-quarts (le « 1 km de course ») | HYROX |
| `hyrox-finish.webp` | une petite arche d'arrivée ou un drapeau à damier, sans texte | HYROX |
| `spartan-mur.webp` | un mur en bois avec deux prises, en trois-quarts | Spartan |
| `spartan-boue.webp` | une fosse de boue, avec deux fils barbelés tendus au-dessus | Spartan |
| `spartan-portes.webp` | une pierre ronde (« atlas stone ») | Spartan |
| `spartan-filet.webp` | un filet de cargo tendu sur une structure en A | Spartan |
| `spartan-saut.webp` | un petit feu de bûches, à sauter | Spartan |
| `boxe-gants.webp` | une paire de gants de boxe noirs, avec un liseré vert | Boxe |
| `boxe-sac.webp` | un sac de frappe suspendu par sa chaîne | Boxe |
| `boxe-bandes.webp` | des bandes de boxe enroulées | Boxe |

Ordre conseillé : `hyrox-01` d'abord, à faire valider par Kenz, puis toute la série avec **le même bloc de style**, pour garder lumière, angle et matières identiques.

## Prompt (bloc commun + sujet)
Remplacer `{SUJET}` par la colonne « Sujet » du tableau, traduite en anglais.

```
Use case: stylized-concept icon series. One transparent PNG 3D icon for the k15ze sport universe (Kenz's personal site): part of a matching set of HYROX stations, Spartan Race obstacles and boxing gear. Every icon in the set must share the exact same lighting, camera angle, materials and palette.

Create ONE isolated miniature object: {SUJET}.

Style: premium tactile 3D product illustration, sophisticated miniature collectible design, slightly chunky refined proportions, strong clean silhouette. Materials: matte anodized graphite and black metal (#1A1D1C to #2A2F2D), satin rubber, technical fabric, with off-white (#F7F7F2) details and exactly ONE accent in vivid green #3DDC84 (a handle, strap, edge or button). No other saturated colors. Soft studio light from upper left, subtle rim light on the right edge so it separates from a near-black background, ambient occlusion only within the object. Camera: three-quarter view, slightly elevated (about 25 degrees), identical for the whole set.

Composition: square 1024 x 1024 or higher PNG. Center the complete object at about 70% of the canvas height, clear transparent margin on every side, no cropping. Must stay readable at 40 px and look premium at 160 px, over near-black #0D0F0E and over light #F4F6F2.

Background: GENUINELY TRANSPARENT ALPHA, clean antialiased edges. No floor, no pedestal, no detached drop shadow, no glow or halo outside the object, no checkerboard painted into the image.

Avoid: text, letters, numbers, logos, brand marks (no HYROX, Spartan, Concept2 or sportswear logos), people, faces, hands, bodies, cartoon style, toy-like plastic, photoreal gym background, multiple objects, motion lines.
```

## Contrôle avant livraison
- Les 18 icônes posées en planche sur `#0D0F0E` puis sur `#F4F6F2`, à 40 px et à 160 px : même angle, même lumière, un seul vert.
- Le canal alpha est propre : aucun bord gris ni halo.
- Aucun logo ni texte visible, même minuscule.
