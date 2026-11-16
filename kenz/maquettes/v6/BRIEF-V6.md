# Brief V6 : une seule maquette, qui réunit ce que Kenz aime (13/11/2026)

## Ce que Kenz a dit
« Pour l'instant j'aime bien Golden hour. Studio, j'aime bien le fond, vraiment : peut-être l'avoir en mode clair. Et la loupe j'aime bien, les portes ovales et l'effet loupe. Les portes, peut-être pour les apps, je me demande encore. Mon hero préféré, c'est Golden. Dans Le fil, j'aime aussi l'aura du fond et la continuité au scroll. Il faudrait fixer tout ce que j'aime bien, surtout de façon cohérente, et travailler sur une maquette unique qu'on améliore. »

## Le principe
On ne fait plus quatre styles. **Une seule maquette** dans `v6/` : `pro.html`, `app.html`, `agents.html`, `createur.html`, ainsi que les modules de `shared/` (apps, victoire, cordon, passage). Elle part de **Golden hour** (déjà copié dans `v6/`, chemins `assets/` et `shared/`), et on y fond, de façon cohérente, les éléments retenus :

1. **Golden hour, la base** : la structure, les textes, le hero (paysage de Kuala Lumpur + portrait détouré, « Kenz. »), l'heure bleue côté Pro, l'heure dorée côté Créateur, le cordon secret, les modules apps et 54 heures.
2. **Un vrai mode clair et un mode sombre** :
   - **Sombre** : l'ambiance Golden hour actuelle.
   - **Clair** : le **fond de Studio**. Surfaces claires et chaudes, grain très léger, brume douce, ombres en couches, filets fins. Référence : `_ref/studio-pro.html` et `_ref/studio-app.html`, à regarder à l'écran. On garde la composition de Golden, seul le fond et la matière passent au clair. Dans le hero, le paysage reste une photo mais s'éclaircit (lumière du matin, voile clair qui fond dans le fond Studio sous le hero). Le texte reste lisible, sans jamais passer sur le visage.
   - Le mode suit `prefers-color-scheme` au premier chargement. Un **bouton discret dans la nav** (icône soleil / lune dessinée en SVG fin, `aria-label` clair, sans pastille de texte) bascule le mode. Le choix est mémorisé (`localStorage` dans `try/catch`) et la bascule se fait en fondu de 400 ms.
   - Tous les jetons de couleur passent par des variables CSS, définies une fois pour le clair et une fois pour le sombre, y compris les `--kz-*` des modules (`data-theme` des sections apps et victoire mis à jour à la bascule).
3. **De Le fil** (référence : `_ref/fil-*.html`, à regarder à l'écran) :
   - **l'aura du fond** : les halos de lumière diffuse qui respirent derrière les chapitres. Lagon côté Pro, dorée côté Créateur, et en mode clair une version très douce de la même lumière ;
   - **la continuité au scroll** : le fil lumineux qui relie les chapitres. Un rail fin à gauche sur grand écran, avec un nœud par chapitre qui s'allume, et un trait qui descend dans chaque chapitre au défilement. Sur mobile, un simple filet de progression ;
   - **les arches (portes ovales)** : la forme signature des cadres. Hero : le portrait reste détouré comme dans Golden, mais l'arche peut servir de halo ou de cadre lumineux derrière lui, si c'est beau. Arrivée des pages projet sous une arche de lumière dans la couleur de l'app. Ouverture de la victoire et cadre des photos ;
   - **l'effet loupe** : une lentille au survol, à la souris seulement, en verre légèrement teinté et à ×1,1 (jamais de « grosse tête »). Sur les vraies captures des apps (pages projet, « En vrai »), sur le paysage de l'aperçu agents et sur les photos de la victoire. C'est un effet de détail, pas une navigation.
4. **Les apps : téléphone ou arche ?** Kenz hésite. Le module apps (`shared/apps.js`) propose les deux cadres :
   - `data-cadre="telephone"` : l'actuel ;
   - `data-cadre="arche"` : l'écran de l'app est découpé dans une grande arche, avec le même contenu, les mêmes animations et le même vol de l'icône depuis le dock.
   On bascule avec un petit sélecteur de revue en bas à gauche (je l'ajoute). Le module doit réagir à `section.kzApps.setCadre('arche'|'telephone')` et à l'événement `document` `kz-revue:cadre` {cadre}.

## Ce qui ne change pas
- Les règles de `../v3/BRIEF-V3.md` et de `../v4/BRIEF-V4.md` / `BRIEF-V5.md` :
  - charte de Kenz ;
  - une idée par écran ;
  - **aucun composant « tag »** ;
  - rien d'inventé, rien de privé ;
  - mobile d'abord ;
  - mouvement réduit respecté.
- Les contrats : cordon, Passage, `porte:arrivee`, `passage:arrivee`.
- Le coin en bas à gauche reste libre pour l'outil de revue.
- Cohérence avant tout : mêmes jetons, mêmes courbes de mouvement, mêmes rayons, même façon de dessiner le fil et les arches sur les 4 pages.
- Écris la base commune dans `shared/theme.css` et `shared/theme.js` : jetons clair et sombre, bouton de mode, aura, fil et rail, arche, loupe. Les 4 pages s'en servent au lieu de dupliquer.

## Vérification
Outil commun `review.cjs` (verrou partagé, mode d'emploi dans `../v3/BRIEF-V3.md`). Pour tester le mode clair dans l'outil, ajoute une porte de test : `?clair` ou `#clair`, à retirer ensuite, ou une valeur `localStorage` lue au chargement. Vérifie :
- chaque page en sombre et en clair, sur ordinateur 1440 × 900 ;
- au moins deux pages sur mobile 390 × 844 ;
- la bascule de mode ;
- le cordon ;
- les deux cadres du module apps.

`node --check` sur tout le JS.
