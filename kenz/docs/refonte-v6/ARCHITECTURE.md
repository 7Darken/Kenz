# Refonte V6 : architecture du site kenzenbien.fr

Document de référence pour tous les agents de la refonte (15/11/2026). On implémente en code de production la maquette V6 validée par Kenz. **La source de vérité visuelle et fonctionnelle est la maquette** : `maquettes/v6/*.html` et `maquettes/v6/shared/*`, publiée sur https://claude.ai/artifact/MNrw9bbab3ZHZd1GyNrwCa. Les briefs `maquettes/v6/BRIEF-*.md` expliquent les décisions de Kenz.

Branche : `refonte-v6`. Pas de push sans accord de Kenz. L'orchestrateur commite entre les étapes : **les agents ne commitent pas**.

## Décisions
- **Deux univers, deux URL, aucun lien visible entre eux.**
  - **Pro** : `/`, `/apps/[slug]` (Oshii, Wado, Sago, Croc, Miru, Zenko, Escapades Libres), `/agents`.
  - **Créateur** : `/createur`, `/createur/voyage`, `/createur/sport`.
  - On passe d'un univers à l'autre **seulement par les passages secrets** : le code de la constellation côté Pro ; le ciel en arche et le cordon côté Créateur.
  - Les anciennes URL (`/projets/[slug]`, `/destination/[slug]`, et toute route publique existante) sont **redirigées** (redirections 308 dans `next.config.ts`) vers leur équivalent.
- **Next.js 16 App Router, React 19, TypeScript strict.** Composants serveur par défaut ; `"use client"` seulement là où il y a de l'interaction ou de l'animation, aussi bas que possible dans l'arbre.
- **Styles : CSS Modules + design tokens** (variables CSS), portés depuis le CSS de la maquette.
  - On **retire** styled-components, framer-motion, canvas-confetti et Tailwind, s'ils ne servent plus à la fin (étape de nettoyage).
  - Pas de CSS-in-JS à l'exécution.
- **Animation** :
  - `gsap` (avec ScrollTrigger) et `lenis` (déjà présent) ; `three` pour la Terre, chargé dynamiquement (`next/dynamic`, `ssr: false`) ;
  - une seule instance Lenis, avec GSAP enregistré une seule fois (provider) ;
  - `prefers-reduced-motion` respecté partout.
- **Bilingue FR/EN** (convention existante, FR par défaut, `?lang=en` partageable) :
  - textes d'interface dans des dictionnaires typés **découpés par espace de noms** : `i18n/dictionaries/{fr,en}/{common,pro,apps,agents,victoire,createur,voyage,sport,footer}.ts`, avec un agrégateur typé ;
  - contenus de données en `Localized<T>` + `localize()` ;
  - aucun texte en dur dans les composants ;
  - l'anglais est une vraie traduction, naturelle, pas du mot à mot.
- **Thème clair et sombre** :
  - `data-theme` sur `<html>`, posé par un petit script inline avant l'affichage, sans flash ;
  - bouton soleil / lune ;
  - préférence en `localStorage`, dans un try/catch ;
  - `data-univers="pro|createur|k15ze"` sur le conteneur de l'univers.
- **Formulaires** (contact Pro, marques Créateur) : `POST /api/contact` (Telegram, existant), étendu aux champs nom, contact (e-mail ou @pseudo, pour pouvoir répondre), besoin, message, type, avec validation côté serveur. Les secrets restent en variables d'environnement.

## Arborescence cible
```
app/
  layout.tsx                 racine : polices, script de thème, providers (i18n, thème, motion)
  (pro)/layout.tsx           univers Pro : nav Pro, footer Pro, data-univers="pro"
  (pro)/page.tsx             /
  (pro)/apps/[slug]/page.tsx /apps/oshii … /apps/escapades-libres (generateStaticParams)
  (pro)/agents/page.tsx      /agents
  (createur)/createur/layout.tsx
  (createur)/createur/page.tsx          /createur
  (createur)/createur/voyage/page.tsx   /createur/voyage
  (createur)/createur/sport/page.tsx    /createur/sport  (identité k15ze)
  api/contact/route.ts
  fonts/                     Melodrama en local (woff2 extrait de maquettes/v6/assets/melodrama.css)
design-system/
  tokens.css                 couleurs, typo, espacements, rayons, ombres, easings ; clair, sombre, univers
  base.css                   reset, typo de base, focus, sélection, utilitaires .sr
  components/                primitives réutilisables, chacune avec son .module.css :
                             Button, IconButton, Arch (kz-arche + tracé), Fil (rail du fil), Aura,
                             Loupe, Reveal, Words (mots qui montent), Section, Container, Dialog
                             (accessible), Polaroid, SocialIcon (Simple Icons CC0), StoreBadge,
                             ThemeToggle, LanguageToggle
  motion/                    le socle du mouvement : MotionProvider (gsap + ScrollTrigger + Lenis), useGsap,
                             useInView, useReducedMotion, useMediaQuery, courbes ; features/ en dépend, jamais l'inverse
features/                    un dossier par module, avec composants, hooks et CSS propres :
  nav/                       Nav (variante pro / createur / k15ze)
  footer/                    Footer compact (variantes pro / createur / k15ze), avec le ciel secret côté Créateur
  passages/                  Passage (transition couleur + icône entre pages), plongée et décollage (Pro <-> Créateur),
                             ciel en arche (code secret), cordon ; flags sessionStorage
  profondeur/                objets flottants sur 3 plans (heros)
  hero/                      hero partagé (paysage, arche, portrait, titre) + variantes pro / createur
  apps-space/                scène spatiale des apps, fiche de survol (vraies captures), code secret constellation
  victoire/                  séquence des 54 h (post-it, rôle, couloir, flash, 1re, podium), « vu une fois »
  app-detail/                pages /apps/[slug] (histoire de l'app, badges stores, Escapades Libres)
  ia/                        « la machine » (aperçu sur / et page /agents)
  contact/                   formulaire de contact Pro
  terre/                     globe three.js (cristal, néon, relief), trajet du voyage, « vu une fois »
  courses/                   compositions parallaxe + fiche détail + animations (HYROX, Spartan, Boxe), liste évolutive
  suivre/                    « Me suivre » (deux univers, icônes réseaux)
  marques/                   section et formulaire Marques & collaborations
content/                     données typées et localisées (une seule source) :
                             apps.ts, startup-weekend.ts, ia.ts, series.ts (voyage), courses.ts, socials.ts, site.ts
i18n/                        existant, découpé par espace de noms (voir plus haut)
public/assets/               assets de la maquette, rangés : img/, apps/<slug>/, sport/, sport3d/, hero3d/, terre/,
                             badges/, el/ ; uniquement les fichiers utilisés
docs/refonte-v6/             ce document, la carte maquette -> code, et les rapports de vérification
```

## Règles de code (niveau senior)
- **Un composant = une responsabilité.**
  - Les données arrivent par props, depuis `content/` ; pas de contenu dans les composants.
  - Le code du DOM d'animation se fait avec des refs et un nettoyage complet : `gsap.context()`/`revert()` dans `useLayoutEffect`/`useEffect`, `ScrollTrigger.kill`, Three `dispose()`.
- **Aucun code mort** : pas de fichier inutilisé, d'export orphelin, de `console.log`, de TODO sans suite ni de dépendance inutile.
- **TypeScript strict** : pas de `any` (sauf justifié, commenté), types exportés pour les données.
- **Accessibilité** :
  - sémantique (landmarks, titres), focus visibles, `aria-*` sur les animations et dialogues, cibles de 44 px ;
  - les contenus animés ont toujours un état final lisible sans JS et en mouvement réduit.
- **Performance** :
  - `next/image` pour les images de contenu (tailles réelles et `sizes`), jamais agrandies au-delà de leur taille réelle ;
  - three et les gros modules en import dynamique ;
  - pas de JS client pour du texte statique ;
  - polices via `next/font`.
- **SEO** :
  - `metadata` par route (titre, description, Open Graph), en français : le serveur rend le français et `?lang=en` n'est qu'un basculement client, donc ni hreflang ni `og:locale:alternate` (les `meta` anglais des dictionnaires attendent une vraie route EN) ;
  - `sitemap` à jour avec les nouvelles routes, sans exposer de lien croisé visible entre les univers ;
  - `robots` inchangé.
- **Conventions** :
  - fichiers en kebab-case, composants en PascalCase ;
  - CSS Modules nommés comme le composant ;
  - commentaires en français, brefs, sur le pourquoi.
- **Règles de contenu de Kenz** :
  - aucun composant « tag » (pastille au-dessus d'un titre) ;
  - rien d'inventé ;
  - rien de privé : pas de nom de personne de l'équipe, pas d'e-mail affiché, pas de candidatures ;
  - côté k15ze, rien sur l'Asie ni le voyage.

## Règles machine (Mac de Kenz, CLAUDE.md)
- **Pas de `next build` ni de `next dev` lancés par les agents en parallèle.** L'orchestrateur fait tourner **un seul** serveur de dev, sur `http://localhost:3100`.
- Pour vérifier :
  - `npx tsc --noEmit` ;
  - `npx eslint <tes fichiers>` ;
  - captures via les scripts du scratchpad, qui partagent un verrou (une capture à la fois).
- Pas de traitements d'images en parallèle : `sips` ou `cwebp` un fichier à la fois.

## Répartition des rôles (l'orchestrateur assigne)
- **Fondations** (seul, avant les autres) : design system, polices, layouts, providers, i18n découpé, contenu typé, assets, nav, footer, routes squelettes, redirections.
- **Modules en parallèle**, chacun propriétaire de ses dossiers `features/<module>`, de sa route et de ses fichiers de dictionnaire :
  1. Pro accueil (hero et profondeur, scène des apps, aperçu IA, contact) ;
  2. 54 h (victoire) et pages des apps ;
  3. page Agents (la machine) ;
  4. Créateur accueil (Terre, voyage, Me suivre) ;
  5. pages Voyage et Sport, plus les courses ;
  6. passages secrets et transitions.
- **Vérification** : parité visuelle avec la maquette (captures côte à côte, même viewport et même thème), revue d'architecture et de code mort, accessibilité et performance, puis corrections.
- **Nettoyage final** : suppression de l'ancien code (components/, sections/, styles/, contexts/mode-context…) et des dépendances inutiles, un `next build` unique, puis commit.
