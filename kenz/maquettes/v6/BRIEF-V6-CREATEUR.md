# Brief V6 : la page Créateur, landing de ma création de contenu (14/11/2026)

## Ce que Kenz a dit (décodé)
« La partie après la Terre est à complètement revoir. Le but, c'est vraiment une vision, pas tout mélangé : il va falloir faire des choix. La partie "le vrai prix" est à enlever : elle irait dans le détail d'une page. Sur la page, on doit comprendre que ma création de contenu tourne clairement autour du voyage, du lifestyle et du sport. Ensuite, la preuve dans le sport, avec du motion : le HYROX et la Spartan dans la même section, qu'on la prenne bien. La partie "Me suivre" est à complètement retravailler, pour vraiment visualiser dans quel univers tu as envie de me suivre. Pense aussi aux pages d'après, et continue à rediriger, parce que c'est la landing de ma création de contenu. Le but : t'es intéressé par mes voyages, tu entres dans l'univers voyage ; t'es intéressé par la nutrition et l'entraînement, tu entres dans cet univers. Un inconnu doit comprendre tout ça naturellement. »

## La vision : deux univers, une porte d'entrée
Les données (`../_shared/content.js` → `KENZ.createur.univers`) et le coffre en définissent deux. Enkenz reste caché.
1. **Le voyage — Kenz en Asie**, le cœur. YouTube « Kenz in Asia » (@7Kinze), TikTok « En Bien en Asie », Instagram ; environ 28 000 abonnés TikTok, chiffre déjà sur la page.
2. **Le sport & lifestyle — k15ze** : « sport, nutrition, lifestyle — et mes courses ».
   - Promesse : « En sèche, je mange plaisir et copieux : des recettes simples, aux doses exactes. »
   - Ton : « Ni coach, ni expert. Je partage ce qui marche pour moi, sans conseil médical. »
   - YouTube @K15ze-l6z (TikTok prévu, pas lancé).
   - **Identité k15ze** validée le 08/11 : fond #0D0F0E, texte #F7F7F2, vert #3DDC84 (#1E7A46 sur fond clair), un mot vert en Instrument Serif italique, chiffres en Anton (Google Fonts), lueur douce sur un seul mot.
   - **Règle : rien du voyage ni de l'Asie côté k15ze.**
   - Wado n'y apparaît pas : le lien n'est pas validé.

Le lifestyle passe par k15ze (sport, nutrition, vie de tous les jours) ; le voyage reste à part.

## La landing `createur.html` : on garde, on retire, on ajoute
**On garde** : le hero (Kenz, Kuala Lumpur, la Terre de cristal derrière, le dézoom) et le trajet « Le voyage » sur le globe. On peut le resserrer : une escale par pays, environ 9, Japon et Chine regroupés.

**On retire de la landing** (ça part dans la page Voyage) : la dernière vidéo, **Le vrai prix**, le guide « Tu pars en Chine ? », l'ancienne section sport « Entre deux voyages » et la section marques. Les marques deviennent un petit lien discret en bas de page.

**L'ordre, une idée par écran** :
1. **Hero** : tel quel. La phrase peut annoncer les deux univers, sans perdre la voix de Kenz. Propose-la ; sinon garde l'actuelle.
2. **Le voyage** : le trajet sur le globe, raccourci. Il finit par une porte claire : « Entrer dans mes voyages → » vers `voyage.html`, avec la transition Passage.
3. **Le sport, la preuve en mouvement** : HYROX et Spartan dans **une seule section**, épinglée, avec du vrai motion.
   - **HYROX** Paris, 31/05/2025 : « 8 stations, 8 km de course ». Vidéo « Mon premier HYROX sans entraînement ! » : https://www.youtube.com/watch?v=kBNLSpnhrGU (7:08). Photos `assets/img/hyrox-1…4.jpg` (733 × 1100, dont une en 1100 × 733).
   - **Spartan Race**, juin 2025 : course à obstacles. Photos `spartan-1.jpg` (511 × 768) et `spartan-2.jpg` (768 × 511), petites, **jamais en grand**.
   - Idées de motion :
     - une ligne de course qui se trace au défilement ;
     - des compteurs en Anton (8 stations, 8 km) ;
     - les photos qui passent comme des étapes de course, en cadres ;
     - le passage de la piste HYROX à la boue de la Spartan.
   - Le vert k15ze annonce qu'on change d'univers. Fin de section : « Entrer dans le sport → » vers `sport.html`.
4. **« Me suivre », refait en choix d'univers** : deux grandes portes visuelles côte à côte (empilées sur mobile).
   - **Voyage** : l'ambiance du voyage (la Terre, l'Asie, une vraie miniature), les comptes Kenz in Asia, En Bien en Asie et Instagram.
   - **Sport & lifestyle** : l'ambiance k15ze (fond sombre, vert, une photo HYROX), le compte YouTube k15ze.
   - Au survol, l'univers s'anime : aperçu, couleur, mouvement. Chaque porte mène à sa page, et les liens des comptes restent cliquables directement.
   - Un inconnu doit comprendre en 3 secondes qu'il y a deux univers et choisir le sien.
5. **Pied de page** : le ciel en arche (passage secret vers Pro), le cordon, le petit lien « Marques & collaborations ».

## Les pages d'univers (nouvelles)
- **`voyage.html` — Kenz en Asie**, dans la DA Terre (crème, Lagon, or, la bille de cristal en petit si besoin) :
  - une arrivée ;
  - la dernière vidéo ;
  - les séries et les pays (les données des escales) ;
  - **Le vrai prix** (prix validés) ;
  - le guide « Tu pars en Chine ? » et l'itinéraire 14 jours ;
  - les comptes à suivre ;
  - un retour vers la landing.

  On reprend les sections existantes de la sauvegarde `scratchpad/createur-v22.html`, adaptées.
- **`sport.html` — k15ze**, dans l'**identité k15ze**, et non dans la DA Terre :
  - une arrivée avec la promesse ;
  - ce que Kenz partage (sujets observés : pizza entière, grosse assiette de patates, pancakes, gâteau whey ; formats Shorts) ;
  - **Mes courses** (HYROX, Spartan, et la boxe, que Kenz apprend depuis le 14/10/2026) ;
  - le compte YouTube k15ze ;
  - un retour vers la landing.

  Pas d'Asie, pas de voyage.

## Règles
- Base commune `shared/theme.*` (clair et sombre), `revue.js`, le fil et l'aura. Aucun composant « tag », rien d'inventé, rien de privé.
- Mobile d'abord, mouvement réduit respecté, transitions Passage entre les pages.
- Pas de photo agrandie au-delà de sa taille réelle.
