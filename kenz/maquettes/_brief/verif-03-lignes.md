# Vérification — maquette 03 « Lignes »

> Audit puis corrections du 11/11/2026, par le panel (produit, recherche UX, design visuel, motion, accessibilité).
> Fichier corrigé : `maquettes/03-lignes.html` (311 Ko → 317 Ko). Aucun autre fichier du site ni du coffre n'a été modifié.
> Lu en entier : `05-brief-final.md` (sitemap, audiences, livrables, § 9.8, § 10.3), `_shared/content.js`, la maquette.

## Notes sur 10

| Axe | Avant | Après | En une phrase |
|---|---|---|---|
| Produit | 7,5 | 9 | Les casquettes sont maintenant séparées jusque dans la navigation des pages « lien en bio ». Le devis ne pré-remplit que ce que le visiteur a choisi. Les cas d'agents disent ce que fait chaque agent. |
| UX | 6,5 | 8,5 | Plusieurs bugs de mise en page sont corrigés : en-tête Pro qui débordait, hauteur d'en-tête mobile jamais appliquée, aperçu 390 px qui n'était pas un vrai mobile. Les cibles font 44 px et le contact s'ouvre directement depuis le CV. |
| UI | 7,5 | 8,5 | Les pastilles « proposition, à valider » ne s'affichent plus pour le public. Les correspondances du plan restent visibles, et la colonne Créateur de /now n'est plus étiquetée « Asie ». |
| Motion | 7,5 | 8,5 | La coupe W10 ne saute plus, la transmission ne sort plus de l'écran et le tronçon validé de W6 garde la forme de P2. La démo d'injection fige vraiment la rame. L'aiguillage s'amorce au survol. |
| Accessibilité | 7 | 8,5 | Le focus est visible sur toutes les stations du plan. Les libellés de navigation sont distincts, les rôles s'affichent en fiches sur mobile et les cibles font 44 px. |

Ces notes viennent d'une lecture du code, d'un calcul et d'un rendu jsdom. **Aucun navigateur n'a été ouvert** (interdit ici) : le rendu visuel reste à contrôler à l'œil (voir « Restants »).

## Vérifications faites

- `node --check` sur le JS inline extrait dans `_tmp-v3.js` : OK avant et après les corrections. Le fichier temporaire a été supprimé.
- Rendu jsdom, en Node seul : 39 vues (38 routes + une adresse inconnue) × 7 états (défaut, trous, vide, indisponible, retard, horloge +40 j, EN). Résultat : 273 rendus, 21 227 liens internes vérifiés, **0 lien mort, 0 erreur**, aucun « undefined », « NaN » ni « [object Object] ». jsdom a été pris dans un dépôt existant, en lecture, sans installation ni réseau.
- Interactions pilotées :
  - démo agents : 3 options à l'arrêt, touche 2, Valider (proposition décidée, segment validé), injection mise en quarantaine ;
  - cas sans rôle ;
  - filtre du registre ;
  - devis : champs vides, envoi, étape 2 ;
  - contact ouvert par intention ;
  - navigation de /liens et /k15ze.
- Images : les 38 chemins de `content.js` existent (`ls`). Aucune image « à éviter » n'est utilisée.
- Confidentialité : aucune adresse e-mail dans la maquette. Aucune mention de candidature, de recherche d'emploi ni d'usage privé des agents. Hermes est le seul nom propre d'agent.
- Contrastes calculés (WCAG 2.x), tous ≥ 4,5:1 pour le texte :

| Paire texte / fond | Ratio |
|---|---|
| Gris Pro / fond | 5,45 |
| Gris Pro / surface | 5,74 |
| Crème / P1 | 6,28 |
| Crème / P2 | 8,37 |
| Crème / P3 | 4,61 |
| Crème / P4 | 7,18 |
| Gris tableau / tableau | 8,18 |
| Gris Créateur / crème | 5,04 |
| Gris Pro / porte Créateur de l'accueil | 5,10 |
| k15ze secondaire / fond | 7,49 |
| k15ze secondaire / surface | 6,96 |
| Vert k15ze / fond | 10,78 |
| Maurice / crème | 6,55 |
| Texte Chine / crème | 4,95 |
| Message d'erreur / fond (6,80 au plus bas) | 7,26 |
| Palette ⌘K, catégorie | 5,74 |

  Le trait rouge Chine (3,73) ne sert qu'aux graphiques, ce qui suffit.

## Constats et corrections

### Bloquants et majeurs (tous corrigés)

| # | Constat | Correction appliquée |
|---|---|---|
| 1 | **Casquettes mêlées.** Sur `/liens`, la navigation proposait « k15ze ». Sur `/k15ze`, la navigation et la barre basse proposaient « Asie » et « Guides ». La checklist demande : `/k15ze` sans rien du voyage, `/liens` sans k15ze. | Nouvelle fonction `navCrea(path)`. `/k15ze` ne garde que Moi et k15ze, `/liens` retire k15ze, et le menu mobile suit. `/k15ze` perd la barre basse, comme `/liens`. Sur ces deux pages, le bouton Menu reste visible sur mobile pour ne pas laisser la page sans navigation. |
| 2 | **Hauteur d'en-tête mobile jamais appliquée.** `--tete:56px` était posé sur `:root` dans une requête de conteneur, or `:root` n'est pas dans le conteneur. L'en-tête mesurait 56 px mais le bandeau « Exemple — client fictif » et la carte collante de `/asie/chine` se calaient à 64 px, ce qui laissait 8 px de vide. | La variable est posée sur `.tete, main`. |
| 3 | **L'aperçu 390 px n'était pas un vrai mobile.** `--gout` était calculé en `vw`, d'après la fenêtre : sur un écran d'ordinateur, l'aperçu gardait 48 px de gouttière au lieu de 16 px. | `--gout:clamp(16px,4cqi,48px)` en unités de conteneur, sous `@supports`. |
| 4 | **L'en-tête Pro débordait.** Le calcul des largeurs montre une navigation qui chevauche les outils entre ≈ 900 et 970 px, puis entre ≈ 1 100 et 1 130 px. | Deux paliers : à 1 200 px, navigation resserrée (marges 7 px, texte 14,5 px) ; à 1 000 px, les pastilles P1–P4 sont masquées et la couleur de ligne reste dans le soulignement actif. Le libellé du point reste visible jusqu'à 1 100 px. |
| 5 | **Le devis pré-remplissait des choix jamais faits.** « Demander un devis » de `/pro/agents` et l'intention « Des agents IA » de `/contact` pré-remplissaient le cas « mémoire d'équipe ». `/pro/video` et les pages de cas écrivaient « Tâches cochées dans Composez votre équipe » sans que le visiteur ait rien coché. | Nouveau paramètre `?intention=agents|video|app` : le champ reste vide et le talon du billet affiche le sujet et les lignes (P2 ou P4). Les pages de cas envoient `?cas=` (« À partir du cas « … » »). Seule la démo « Composez votre équipe » écrit les tâches cochées. |
| 6 | **Focus invisible sur trois stations du plan.** Les capsules de correspondance (fond plein) étaient dessinées par-dessus les stations Contenu (P2) et Livrable (P2, P3) : le survol et le focus ne se voyaient plus. | Le SVG passe à trois calques : traits, puis capsules, puis stations. Les événements de survol fonctionnent toujours, par ligne. Les stations fermées (mode trous) ont aussi un état focus. |
| 7 | **Pastilles internes visibles par le public.** « proposition, à valider » apparaissait sur les accroches, « Ce que j'en retiens », les pratiques et les preuves. Le brief demande l'inverse (m1, m5 : pastille sur les chiffres et les statuts, trous seulement dans le panneau), et l'effet est « pas fini » pour un client. | `pas()` masque les statuts « proposition », « hypothèse » et « à confirmer » hors du mode « Montrer les trous ». Kenz les voit toujours en un clic. Les statuts observé, lu dans le code, déclaré et validé restent publics. |
| 8 | **Le client ne voyait pas ce qu'il achète.** Pour chacun des six cas, la colonne « Ce que font les agents » ne donnait que des noms de rôles. | Chaque rôle est suivi de sa mission, tirée de `agents.equipe[].role`, par exemple « Veille & recherche sourcée · critères, recherches sourcées, déduplication ». C'est la demande de Kenz : qu'un futur client comprenne ce qui peut être mis en place. |
| 9 | **Cibles trop petites.** ⌘K, FR/EN et les boutons « petit » mesuraient 40 px, les mots de la coupe W8 aussi, les liens du pied de page 36 px. | Tous passent à 44 px. FR/EN font 44 × 44, et 40 × 44 sous 400 px. |
| 10 | **Barre basse masquée sur téléphone.** Le bouton « Simulation » recouvrait la cible « Moi ». | Sous 640 px, le bouton et le panneau remontent au-dessus de la barre. |
| 11 | **Carte collante de `/asie/chine` trop haute sur un petit téléphone.** Carte et panneau de verdict débordaient du cadre collant. | Hauteurs en `svh`. Sous 640 px : carte à 38 svh et verdict plus court. La liste de prix (déjà complète plus bas) et la note d'usage sont masquées dans le panneau. |
| 12 | **Tableau des rôles illisible à 360 px.** Quatre colonnes dans un conteneur à défilement non focalisable. | Sous 640 px, une fiche par rôle avec intitulés « Lit », « Écrit », « N'a pas le droit de ». La case « interdit » reste encadrée, donc la plus visible. |

### Mineurs (corrigés)

| # | Constat | Correction |
|---|---|---|
| 13 | « Saison en cours : la Chine » laisse croire à une position actuelle (le brief dit « jamais la position du moment »). | « À la une : la Chine », et « À la une » sur `/asie/chine`. |
| 14 | Phrase sans verbe dans « Guides liés » : « à venir, quand la vidéo « budget réel » publiée ». Minuscule en début de phrase sur `/guides`. | « À venir : il sortira avec la vidéo « budget réel » publiée ». Majuscule ajoutée avec `cap()`. |
| 15 | « On peut s'arrêter à chaque arrêt. » | « On peut s'arrêter après chaque étape. » |
| 16 | Registre annoncé « dans l'ordre de sortie », alors que Ce site (sorti le 05/11/2025) est en dernier. | « …dans l'ordre de sortie, puis ce site. » |
| 17 | Bloc « Pour qui » vide sur Zenko et Ce site (pas de champ `public`). | Le bloc n'apparaît que s'il y a une donnée ; sinon « Le problème » prend toute la largeur. |
| 18 | Sur la démo d'un cas sans rôle (mémoire d'équipe), « Demander une autre proposition » faisait parler « Validation humaine ». | Le retour se fait à Hermes : « Hermes : nouvelle proposition prête ». |
| 19 | Pendant une démo en cours, « Tester une consigne cachée » marquait la rame « immobile » alors qu'elle continuait d'avancer. | Le flux est gelé 1,4 s (la rame reste à quai), puis il reprend. |
| 20 | W6 : après « Valider », le dernier tronçon devenait un trait plein, alors que P2 est une ligne double. | Le tronçon validé se trace en double (horizontal et vertical). |
| 21 | W10 : le `padding` changeait d'un coup à l'ouverture, d'où un saut de 120 px sous la pile, et un chevauchement à la fermeture. | La place de la coupe ouverte est réservée. Aucune propriété de mise en page n'est animée. |
| 22 | La transmission en 6 champs « glissait » de toute sa largeur, hors de l'écran. | Elle glisse de 28 px vers le destinataire (420 ms), et le destinataire l'accuse : cadre plein, « Reçue, à lire » par la fente. |
| 23 | Les noms de la frise (120 px pour 116 px d'écart) se touchaient entre 1 100 et 1 240 px. | Largeur ramenée à 112 px. |
| 24 | La barre basse portait le même nom accessible que la navigation d'en-tête. | « Raccourcis créateur ». |
| 25 | « relevé il y a 40 min » (RSS) : un chiffre inventé. | « relevé il y a moins d'une heure » (fréquence de 1 h, `content.js`). |
| 26 | `/contact` (page commune) vouvoyait : « Choisissez… », « Votre message », « pour vous répondre ». | Formulations neutres, comme le demande le § 8.1. |
| 27 | « Un recrutement ? Écrire » (CV) menait à `/contact` sans intention : un clic de plus. | Lien vers `/contact?intention=recrutement` : le formulaire est déjà ouvert, avec le lien vers le CV. |
| 28 | `k15ze` s'affichait « K15ZE » (capitales forcées), ce qui n'est pas le nom de la marque. | Bas de casse conservé, interlettrage serré. |
| 29 | Sur `/now` et `/a-propos`, la colonne Créateur portait l'étiquette « Asie » alors qu'elle couvre aussi k15ze. | Repère en pointillé (le dessin de la carte) à la place de l'étiquette. |
| 30 | Code mort : `lignesDe`, `.squelette`, `cotePrec`, `tacheDeCas`. | Supprimé. |

### Finition des micro-interactions (ajouts)

- **L'aiguillage hésite.** Au survol ou au focus du point, le tronçon amorce 22 % de la bascule vers l'autre tracé (240 ms, `--ease-arrivee`), puis revient. Rien ne se passe au toucher ni en mouvement réduit. Un état `S.cible` empêche le retour pendant les 240 ms de sortie de page.
- **Registre filtré.** Les stations qui réapparaissent glissent le long de la ligne : 10 px, 280 ms, 40 ms d'écart.
- **« Prochaine station ».** La flèche avance de 8 px au survol et au focus (220 ms).

## Restants (non corrigés, à décider ou à voir à l'œil)

1. **Contrôle visuel dans un vrai navigateur**, interdit ici. À regarder :
   - la densité des noms inclinés du plan entre 900 et 1 100 px ;
   - les tampons de Taïwan et de Hong Kong sur `/moi`, que le portrait détouré recouvre peut-être ;
   - la tenue de la carte collante de `/asie/chine` sur un téléphone de 640 px de haut ;
   - les paliers d'en-tête, calculés et non observés.
2. **Les tampons de ville de `/asie/chine` restent illisibles sur mobile** (environ 5 px). Le panneau de verdict donne la ville en grand, et la liste des villes suit. Les agrandir les ferait se chevaucher (Shenzhen et Guangzhou sont à 10 unités l'une de l'autre).
3. **Le slug `/pro/apps/escapades-libres` dévoile le nom de la startup** dans l'URL et le plan du site du panneau, alors que le nom est masqué partout ailleurs. C'est à corriger dans `content.js` (fichier partagé par les cinq maquettes, non modifié ici), par exemple avec `/pro/apps/mvp-startup`. G6 reste à trancher.
4. **W8 anime `flex-grow`**, donc une propriété de mise en page, sur 12 segments. La spécification dit que le segment se referme, et le coût est négligeable. Le passer en `transform` demanderait de recalculer les positions.
5. **L'anglais ne couvre que la navigation et le cadre**, avec une bannière d'explication (Lot 2).
6. **Données à confirmer dans `content.js`**, visibles en mode « trous » :
   - droits des photos HYROX et Spartan ;
   - date du Startup Weekend ;
   - éditeur de Hermes Agent ;
   - V2 de Miru ;
   - offres et formats (G13, G19) ;
   - les tampons « JE CONSEILLE », qui restent des propositions.
7. **Photos Japon, Malaisie et Corée** toujours non utilisées (origine à confirmer).

## Ce qui est fort (à garder)

- La métaphore tient sans gêner la lecture : chaque page Pro est une station (plaque Archivo, filet de ligne, tableau des départs), et les pages restent des pages éditoriales normales.
- Les deux dessins sont vraiment incompatibles : plan orthogonal côté Pro, côtes en pointillés et tampons côté Créateur. Chaque ligne a une couleur **et** une forme.
- `/pro/agents` suit l'ordre du § 6.1. On y comprend en une page ce qu'un client achète : six problèmes, ce que vous validez, ce que vous recevez, ce que je n'automatise pas. La démo s'arrête à « Validation humaine » (W6), la démo d'injection laisse la rame immobile, et « Envoyer ce brief » ouvre le devis pré-rempli.
- Hermes n'est présenté que comme coordinateur, dans un savoir-faire montré à un client fictif. Aucun usage personnel n'apparaît.
- La couche live a 4 états, et chaque état change la forme de l'indicateur. Les relevés sont étiquetés « Simulé », et le panneau de simulation est complet.
- Aucune dépendance : pas de GSAP, aucune requête réseau hors polices. Le mouvement réduit est respecté partout.
