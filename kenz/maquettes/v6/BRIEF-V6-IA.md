# Brief V6 : la partie IA, « la machine » (13/11/2026)

## Ce que Kenz a dit
« La partie IA est beaucoup trop geek. Je voyais plutôt un truc où je démontre que je sais, grâce à l'IA, automatiser des process, mettre en place des agents, pour que ça colle parfaitement à la demande d'un client. Ça ne doit pas viser seulement quelqu'un qui cherche une entreprise : c'est pour monsieur tout le monde, pour qu'il comprenne que je sais mettre tout ça en place. Les fiches Obsidian le disent mieux, mais il ne faut pas entrer dans les détails. Il faut que ce soit visuel. Montrer que je n'utilise pas l'IA juste comme ça, en écrivant des prompts : je mets en place des automatisations, de vrais systèmes, des outils d'IA. Voir comment le montrer de façon visuelle, peut-être avec de vrais exemples concrets. Une proposition pour l'instant, et mets-la en place. »

## Le message, en une phrase
**« Je ne me contente pas de poser des questions à l'IA. Je construis des systèmes qui font le travail, et vous gardez la main. »** C'est l'idée à transmettre. Reformule-la librement, avec des mots simples, à la première personne, en vouvoyant le visiteur.

## La proposition : « la machine »
Un module visuel, compréhensible sans aucun jargon. On choisit un **vrai cas**, et on voit :
1. **L'entrée** : la chose réelle de départ, dessinée ou en image ;
2. **la machine** : 3 ou 4 stations très simples, chacune avec un pictogramme fin et un verbe de tous les jours (« écoute », « comprend », « prépare », « vérifie ») ;
3. **le point humain** : une station « **Vous validez** », mise en évidence, où la machine s'arrête jusqu'à un clic ;
4. **la sortie** : le vrai résultat.

Un jeton de lumière avance de station en station : c'est le fil de la base commune. Chaque étape dure moins d'une seconde. Le visiteur clique lui-même « Valider », puis la sortie apparaît avec un léger éclat. Aucune ligne de code, aucun nom de modèle, aucune flèche de diagramme technique.

## Les vrais cas (tirés du travail réel de Kenz ; rien d'autre)
Pour chaque cas : un titre de 3 à 6 mots, l'entrée, la sortie, et une ligne « Dans la vraie vie : … ».
1. **Une vidéo de recette devient une vraie recette** (Oshii, en ligne sur l'App Store et Google Play).
   - Entrée : une vidéo courte de recette.
   - Sortie : la fiche recette pesée. Vraie capture : `assets/apps/oshii-ecran-1.jpg` ou `-2.jpg`.
2. **Une photo d'assiette devient un suivi nutrition** (Wado).
   - Entrée : la photo d'un plat.
   - Sortie : les macros et le plan qui s'ajuste. Capture `assets/apps/wado-ecran-1.jpg`.
3. **Des idées deviennent des vidéos montées** : l'atelier vidéo de Kenz, où le montage est en partie automatisé (coupes de silences et de répétitions, animations à la charte, sous-titres).
   - Entrée : des rushs ou une idée.
   - Sortie : une vidéo prête à poster. Miniature réelle : `assets/img/video-chine-14-jours.jpg`.
   - Preuve : plus de 60 vidéos produites, selon `../_shared/content.js`, champ « ce qui le prouve ».
4. **Une équipe d'agents qui tient les projets à jour** : le studio de Kenz tourne avec des agents qui ont chacun un rôle, avec un coordinateur (**Hermes**), une mémoire commune où chaque projet a sa fiche à jour, et rien qui ne parte sans validation.
   - Entrée : des notes en vrac et des demandes.
   - Sortie : une fiche projet claire, « Où on en est », « Prochaine action ».
   - Ne parle **jamais** de l'usage privé : ni candidatures, ni comptes, ni noms d'agents autres que Hermes.

Optionnel, si ça reste lisible : 180 épisodes de Sago écrits avec des agents, relus et publiés.

## « Et chez vous ? »
Après la machine, 4 à 6 besoins de tous les jours, en grandes cartes visuelles, chacune avec un pictogramme fin et une phrase. Ils sont tirés de `../_shared/content.js` → `agents.cas[].titreClient`, avec un ton simplifié au besoin :
- « Je passe trop de temps à chercher et trier l'info. »
- « Je veux publier plus de contenu sans y passer mes soirées. »
- « Personne ne sait où en est un dossier. »
- « Mon back-office, c'est un tableur. »
- « Je veux de l'IA dans mon produit. »

Au clic, une ligne de réponse simple : ce que la machine ferait pour vous, et ce qui reste humain. Puis une action : « Parlons de votre process » vers le contact.

## Où
- **Module partagé** `shared/ia.js` + `shared/ia.css`, avec deux modes :
  - `<section data-kz-ia="complet">` pour `agents.html` : la machine avec tous les cas, puis « Et chez vous ? » ;
  - `<div data-kz-ia="apercu">` pour l'accueil Pro : un seul cas qui se joue tout seul en boucle douce, et « Voir comment » vers `agents.html`. Je l'intègre moi-même dans `pro.html`.
- `agents.html` est entièrement repensé autour de ce module :
  - arrivée : une phrase forte et la machine tout de suite ;
  - puis « Et chez vous ? » ;
  - « Comment on avance » en 3 temps ;
  - contact.
  La démo « Note du lundi », trop technique, et la liste de besoins dépliante actuelle disparaissent ou fondent dans le nouveau module.

## Règles
- Même DA, base commune `shared/theme.*`, clair et sombre.
- **Aucun composant « tag »**, aucun jargon : pas de LLM, API, pipeline, prompt, workflow ni RAG dans les titres. Vouvoiement pour le visiteur, « je » pour Kenz.
- Mobile d'abord : la machine passe à la verticale, et les stations restent lisibles au pouce.
- Mouvement réduit respecté.
- Rien d'inventé, rien de privé.
