# Carte maquette → code (refonte V6)

Chaque section ou module de la maquette (`maquettes/v6`), avec son emplacement dans le code et l'agent responsable. Les numéros d'agent sont ceux d'`ARCHITECTURE.md` :

1. Pro accueil
2. 54 h et pages des apps
3. Agents
4. Créateur accueil
5. Voyage et Sport
6. Passages

« Fondations » : déjà livré, à utiliser tel quel.

## Ce qui est déjà en place (fondations)

| Maquette | Code | Notes |
|---|---|---|
| `shared/theme.css` : jetons, clair / sombre, univers | `design-system/tokens.css`, `design-system/base.css` | Le Créateur prend la DA « Terre » de `createur.html` ; k15ze les jetons de `sport.html`. |
| `theme.js` : le mode (script avant affichage, bouton) | `design-system/theme/*`, `design-system/components/theme-toggle.tsx` | `useTheme()` ; événement DOM `kz-theme:change`. |
| `theme.js` : l'aura et le grain | `design-system/components/aura.tsx` | Monté par `UniverseShell` ; `<Section aura="…">` en pilote la place. |
| `theme.js` : le fil (rail, nœuds, filet de progression, traits) | `design-system/components/fil.tsx`, `fil-trait.tsx`, `design-system/lib/chapters.ts` | Un chapitre = `<Section>`. |
| `theme.js` : l'arche (`kz-arche`, tracé, lumière, sol) | `design-system/components/arch.tsx`, `arch-trace.tsx` | `trace` ou `trace={{ traced }}` (contrôlé) ; `traceDuration` (s), `floorOverhang` (%) ; délais en CSS (`--fil-delay`, `--shadow-delay`, `--floor-delay`). |
| `theme.js` : la loupe (`[data-loupe]`) | `design-system/components/loupe.tsx` | Monté par `UniverseShell` ; il suffit de poser `data-loupe` sur l'image. Option `source` : `data-loupe-source` sur le descendant à grossir (ex. la page qui défile dans une fenêtre). |
| `.btn`, `.btn--light`, `.btn--ghost`, `.btn--sm`, `.btn__ico` | `design-system/components/button.tsx` | Variantes `light`, `ghost`, `accent` ; tailles `md`, `sm`. Une ancre (`#contact`) rend un simple `<a>` (défilement doux de `MotionProvider`). |
| `.round`, `.kz-mode` | `icon-button.tsx`, `theme-toggle.tsx` | |
| `[data-words]`, `[data-reveal="card"\|"fade"]` | `words.tsx`, `reveal.tsx` | `play` / `show` pour piloter (ex. l'arrivée du hero). |
| `[data-sweep]` (titre en balayage) | `design-system/components/sweep-title.tsx` | `variant` : `createur` (défaut) ou `pro` (app, agents). |
| `.wrap` | `container.tsx` | |
| `[data-chapitre]`, `data-aura`, `data-fil-trait` | `section.tsx` | |
| Fiche des courses (`role="dialog"`) | `dialog.tsx` | `<dialog>` natif : focus piégé, retour du focus. `onClose(reason)` : `escape`, `backdrop`, `button` ou `browser`. |
| `.field`, `.input`, `.choices`, `.choice`, `.field__err` | `design-system/components/form-field.tsx` | `FormField` (`htmlFor` ou `group`, `hint`, `error`), `Input`, `Textarea`, `Choices`, `Choice`. |
| Polaroïd (`profondeur.css`) | `polaroid.tsx` | |
| Icônes réseaux (sprite Simple Icons) | `social-icon.tsx` | YouTube, TikTok, Instagram, GitHub, LinkedIn. |
| `.reseaux` / `.reseau` (icônes rondes, bulle) | `design-system/components/social-links.tsx` | `size` : `md` (48 px) ou `sm` (46 px) ; `tone` : `k15ze`, `glass`, ou les couleurs du parent (`--u`, `--ic`, `--ring`). |
| Badges des stores (`app.html`) | `store-badge.tsx` | |
| Motif d'Escapades Libres (`MARQUE` d'app.html, symbole de `victoire.js`) | `escapades-mark.tsx` | `variant` : `page` (défaut : nav, arrivée, action) ou `logo` (mur de post-it) ; `ESCAPADES_LOGO` pour composer l'icône du passage. |
| Sélecteur de langue | `language-toggle.tsx` | Compact, en texte (« FR · EN »), dans la barre du bas du pied de page. |
| Porte de retour des pages d'univers (`.retour`), matière des cartes (`.bezel`), briques des pages d'univers | `design-system/components/return-door.tsx`, `design-system/styles/bezel.module.css`, `design-system/styles/univers-page.module.css` | Partagés par voyage, sport et marques. |
| Page 404 | `app/not-found.tsx` | Hors univers ; le retour mène à l'accueil de l'univers de l'adresse. |
| `.nav` + variantes de `pro`, `app`, `agents`, `createur` (barre « stories »), `voyage`, `sport` | `features/nav/nav.tsx`, `story-bar.tsx` | Choix automatique selon l'univers et le chemin. |
| `shared/footer.*` | `features/footer/footer.tsx` | Variantes pro, createur, k15ze. |
| Lenis, GSAP, ScrollTrigger, ancres | `design-system/motion/*` | `useMotion()`, `useGsap()`, `useInView()`, `useReducedMotion()`, `useMediaQuery()`. |
| Polices : Melodrama (data URI), Inter, Instrument Serif, Anton | `app/fonts.ts`, `app/fonts/Melodrama-Variable.woff2` | Jetons `--f-title`, `--f-text`, `--f-word`, `--f-num`. |
| Données en tête des modules `shared/*.js` | `content/*.ts` | Voir la dernière section. |
| Assets référencés | `public/assets/` | Voir `CONVENTIONS.md`, section « Images ». |

## Univers Pro

| Maquette | Code cible | Agent |
|---|---|---|
| `pro.html` A0 : hero (paysage, portrait, arche de lumière, titre, ligne, « Voir ce que je construis ») | `features/hero/` (hero partagé, variantes `pro` et `createur`) | 1 |
| `shared/profondeur.*` : objets 3D sur trois plans (configurations pro et createur) | `features/profondeur/` | 1 |
| `pro.html` A1 + `shared/apps.*` : la scène spatiale, la fiche holographique, le départ vers l'app | `features/apps-space/` | 1 |
| `apps.js` : le tracé de la constellation (`CONSTELLATION_CODE`) | `features/apps-space/` détecte le code, puis appelle l'API de `features/passages` (la plongée) | 1 et 6 |
| `pro.html` A2 + `shared/victoire.*` : les 54 heures (post-it, rôle, couloir, flash, « 1re », podium, « vu une fois ») | `features/victoire/` | 2 |
| `pro.html` A3 : « Pour votre équipe » (la phrase et l'aperçu de la machine) | La section dans `app/(pro)/page.tsx` (agent 1), avec l'aperçu `IaPreview` de `features/ia/` (agent 3) | 1 et 3 |
| `pro.html` A4 : contact (formulaire nom / besoin / message, envoi, état « Merci ») | `features/contact/` → `POST /api/contact` (`type: "contact"`) | 1 |
| `app.html` : arrivée sous l'arche, problème, comment ça marche (épinglé), l'IA en clair, sous le capot, en vrai, action, histoire suivante | `features/app-detail/` + `app/(pro)/apps/[slug]/page.tsx` | 2 |
| `app.html` `#escapades-libres` : motif, « Mon rôle », chapitre 54 h, captures du site | `features/app-detail/` | 2 |
| La mini-animation de Zenko (`apps.js` SC.zenko, la fiche ; `app.html`, « Comment ça marche ») | `features/zenko-demo/` : un seul composant et une seule timeline, deux habillages (`features/apps-space/zenko-scene.tsx`, `features/app-detail/scenes/zenko-scene.tsx`) | 1 et 2 |
| `agents.html` : la phrase forte, la machine (mode complet, 4 cas), « Et chez vous ? », la méthode | `features/ia/` + `app/(pro)/agents/page.tsx` | 3 |
| `agents.html` : contact | Réutilise `features/contact/` (agent 1) | 3 |

## Univers Créateur et k15ze

| Maquette | Code cible | Agent |
|---|---|---|
| `createur.html` C0 : hero Créateur (même composition que Pro, sur le tour de la Terre ; le dézoom au défilement) | `features/hero/` variante `createur` (agent 1) + la Terre de `features/terre/` | 4 |
| `shared/terre.*` : un seul globe three.js (cristal, néon, relief), calque fixe, image de repli | `features/terre/` (`next/dynamic`, `ssr: false`) | 4 |
| `createur.html` C1 : le voyage, épinglé d'escale en escale (`ESCALES`), écran statique « vu une fois » | `features/terre/` + section dans `app/(createur)/createur/(terre)/page.tsx` | 4 |
| `createur.html` C2 : le sport en un écran (cartes HYROX et Spartan, variante `landing`) | `SportChapter` de `features/sport/` (agent 4), avec les compositions de `features/courses/` (agent 5) | 4 et 5 |
| `createur.html` C3 : « Me suivre » (deux univers en arche, réseaux en icônes avec bulle) | `features/suivre/` | 4 |
| Nav « stories » + nom du chapitre | Déjà faite : sections `#top`, `#voyage`, `#sport`, `#suivre` | Fondations |
| `voyage.html` : arrivée (la bille), dernière vidéo, mes séries (la bille suit la liste), le vrai prix, « Tu pars en Chine ? », me suivre, retour | `app/(createur)/createur/(terre)/voyage/page.tsx` + sections dans `features/voyage/` ; la bille vient du mode `bille` de `features/terre/` (agent 4) | 5 |
| `voyage.html` `#marques` : Marques & collaborations (marque / budget / idée) | `features/marques/` → `POST /api/contact` (`type: "marques"`) | 5 |
| `sport.html` : la promesse, ce que je partage (`K15ZE_TOPICS`), mes courses, me suivre (YouTube), retour | `app/(createur)/createur/sport/page.tsx` + `features/sport/page.ts` + `features/courses/` | 5 |
| `shared/courses.*` : compositions en parallaxe, fiche détail (`Dialog`), scènes animées HYROX, Spartan et Boxe | `features/courses/` | 5 |

## Passages (agent 6)

| Maquette | Code cible |
|---|---|
| `shared/passage.*` : le rectangle qui grandit, le voile d'arrivée, l'élément partagé (icône d'app) | `features/passages/` : un intercepteur global des liens `[data-passage]` (attributs déjà posés par la nav, le pied de page et `passageAttributes()`), puis `router.push` |
| `shared/cordon.*` : le cordon du point du logo, la plongée (Pro → Créateur) et le décollage (Créateur → Pro) | `features/passages/`. Brancher le point dans `app/(createur)/createur/(terre)/layout.tsx` : `<UniverseShell navDot={…}>` |
| `shared/etoiles.*` : le ciel en arche du pied de page Créateur (code secret) | `features/passages/`. Brancher `<UniverseShell sky={…}>` dans le même layout |
| Drapeaux `sessionStorage` (`kz-passage`, « vu une fois ») | `features/passages/` (et l'API exposée à `apps-space`) |

L'agent 6 peut monter son composant racine dans `app/_components/universe-shell.tsx` (une ligne). Ses textes vont dans `common.passages` des dictionnaires.

## Non portés

- `shared/revue.js` (outil de revue)
- `maquettes/v6/index.html` (sommaire des maquettes)
- Les portes de test `?clair` / `?sombre` et `?test-code` : retirées de la production. Pour tester un mode, utiliser le bouton ou les DevTools.
- `voyage.html` `#guide`, le bouton de la carte « Tu pars en Chine ? » : la maquette affiche « Ouvrir l'itinéraire » vers `https://kenzenbien.fr/itineraire/chine`, une page qui n'existe pas encore (404). Le site affiche donc « Voir l'itinéraire en vidéo » vers la vidéo YouTube du même itinéraire. Le libellé et le lien de la maquette reviennent d'eux-mêmes quand la page est en ligne : passer `CHINA_GUIDE.page.online` à `true` dans `content/series.ts`. **À valider par Kenz.**

## Contenu typé (`content/`) et dictionnaires

| Fichier | Contenu | Qui peut le modifier |
|---|---|---|
| `content/apps.ts` | Les 7 apps : couleurs, fiche de la scène, histoire complète, captures, stores. Expose `SPACE_ORDER`, `CONSTELLATION_CODE`, `getApp`, `getNextSlug` (la chaîne « L'histoire suivante »), `navApps` (le peu que la nav en lit). | 2, en accord avec 1 |
| `content/app-scenes.ts` | Les valeurs d'exemple des animations des apps (Oshii, Wado, Croc, Zenko), séparées de `apps.ts` pour qu'une scène n'embarque qu'elles | 2 |
| `content/startup-weekend.ts` | Faits et médias des 54 h | 2 |
| `content/ia.ts` | Les 4 cas, « Et chez vous ? » (`IA_NEEDS`), la méthode | 3 |
| `content/series.ts` | Bloc `ESCALES` ; séries, dernière vidéo, vrai prix, guide Chine | `ESCALES` : 4 ; le reste : 5 |
| `content/courses.ts` | Courses, scènes 3D, `K15ZE_TOPICS`, `CREATEUR_COURSE_IDS` | 5 |
| `content/contact.ts` | Contrat des formulaires (besoins, budgets, limites, réponse de l'API) | Fondations (demander à l'orchestrateur) |
| `content/site.ts`, `content/socials.ts`, `content/types.ts` | Routes, couleurs des passages, images de partage, réseaux | Fondations (demander à l'orchestrateur) |

Dictionnaires : `i18n/dictionaries/{fr,en}/<espace>.ts`. Chaque agent n'édite que ses espaces :

- 1 : `pro`
- 2 : `apps`, `victoire`
- 3 : `agents`
- 4 : `createur` (le bloc `chapters` sert à la nav)
- 5 : `voyage`, `sport`
- 6 : `common.passages`
- `common` et `footer` : fondations
