# Brief V6 : Escapades Libres, du problème à la victoire (13/11/2026)

## Ce que Kenz a dit
« Pour la partie des 54 heures : quand on scrolle, il se passe plusieurs trucs, mais il faudrait vraiment montrer ma tâche dans ce projet. Le projet, c'est permettre aux personnes en situation de handicap de voyager, que ça leur convienne, de faire de beaux voyages et surtout que ça matche avec les personnes. C'est Escapades Libres. Il faut qu'on voie, au scroll, de façon smooth, avec des motions qui s'enchaînent et qui ont des relations entre elles, que je suis un vrai forward deployed developer : on voit le problème, je vais apporter la solution parfaite et la créer, hop, on voit le MVP, puis la victoire. Tout ça au scroll, un chemin qui arrive à ça avec le timer, toujours dans la même DA. Et montrer que c'est en ligne, pouvoir appuyer : ça redirige vers Escapades Libres, ou une page détaillée comme pour les apps mobiles, avec un lien. »

Kenz nomme le projet : on peut écrire **Escapades Libres**. On ne nomme **aucune personne** de l'équipe (ni la fondatrice, ni les membres).

## Les faits (sources : `~/Documents/Obsidian/Kenz/Projets/Escapades Libres.md`, le dépôt `~/Documents/Dev/EscapadesLibres` en lecture seule, le site en ligne)
- **Événement** : Techstars Startup Weekend Grenoble, 15e anniversaire, 54 heures du vendredi soir au dimanche soir. **1re place** devant le jury. Le chèque géant porte « Escapade Libre ».
- **Le problème**, dans les mots du projet : le plus difficile n'est pas seulement de trouver un voyage accessible, c'est de **trouver avec qui partir**.
- **La cible** : des adultes en situation de handicap (modéré), qui veulent voyager en petits groupes.
- **La solution** :
  - un **test de 12 phrases, environ 3 minutes**, qui donne un **profil de voyageur** (par exemple « Aventurier », « Rêveur ») ;
  - des **petits groupes de voyageurs qui s'entendent bien**, qui choisissent le voyage ensemble ;
  - une **agence partenaire** qui s'occupe du reste (trajets, logement, activités, accessibilité).
  - Promesse : « **Voyager libre, ensemble.** »
- **Le MVP**, aujourd'hui en ligne : https://escapades-libres.vercel.app. C'est une app web pensée pour le téléphone. Elle contient :
  - la page d'accueil, le test et le résultat (profil) ;
  - le compte ;
  - l'espace voyageur (accueil, voyages, profil, compte) ;
  - les « voyages à rejoindre » avec filtres et demandes ;
  - un catalogue de voyages avec fiches et photos ;
  - un back-office lisible par l'équipe non technique.
  Il a été construit du 23/10 au 02/11/2026, en 56 commits, puis enrichi jusqu'au 09/11.
  Une app mobile équivalente est prévue ensuite : ne dis pas qu'elle existe.
- **Le rôle de Kenz** (déclaré par Kenz) : le développeur « forward deployed » du projet. Il écoute le problème sur le terrain, conçoit la solution, la construit et la met en ligne. Formulation à la première personne, sobre, sans titre inventé.
- **Vraies captures du site** (mobile, 780 × 1688), dans `v6/assets/el/` :
  - `el-accueil.jpg` : « Voyager libre, ensemble. », navy et or ;
  - `el-test.jpg` : « Découvrons votre façon de voyager », 12 phrases ;
  - `el-profil-aventurier.jpg` et `el-profil-reveur.jpg` : les cartes de profil ;
  - `el-groupe.jpg` : une section de la landing (523 × 1688).
- **Photos du week-end** : `assets/img/startup-weekend-1.jpg` (le chèque sur scène), `-2.jpg` (l'annonce, Kenz bras levés), `-3.jpg` (l'équipe devant le tableau blanc).
- **Couleur du projet** : or `#E3A21A` sur navy `#121A2B` (celle du site).
- Interdits : adresse e-mail, nom de personne, commission, chiffres d'utilisateurs (aucun n'est connu).

## Règles
Même DA et mêmes règles que `v6/BRIEF-V6.md` et `../v3/BRIEF-V3.md` :
- base commune `shared/theme.*`, clair et sombre ;
- **aucun composant « tag »** ;
- une idée par écran ;
- mobile d'abord ;
- mouvement réduit ;
- rien d'inventé.
Ici, le « scintillement » n'est pas demandé : arrive lentement, part vite.
