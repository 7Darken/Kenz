# Écrire un module (refonte V6)

À lire avec `ARCHITECTURE.md` (les règles) et `CARTE.md` (qui fait quoi). La source de vérité visuelle reste la maquette.

## 1. Où ranger quoi

```
features/<module>/
  <module>-section.tsx           composant d'entrée du module (serveur si possible)
  <module>-section.module.css    son CSS Module, du même nom
  <partie>.tsx / .module.css     une responsabilité par composant
  use-<chose>.ts                 un hook propre au module
content/<domaine>.ts             données typées et localisées (une seule source)
i18n/dictionaries/{fr,en}/<espace>.ts   textes d'interface du module
```

- **Fichiers** : en kebab-case (`apps-space.tsx`). **Composants** : en PascalCase (`AppsSpace`). Le CSS Module porte le nom du fichier du composant.
- **Commentaires** : en français, brefs, sur le pourquoi.
- **Imports** : avec l'alias `@/` (`@/design-system/components/button`).
- **Points d'entrée d'un module** : chaque module a un `index.ts`, son API publique. `app/` et les autres modules
  n'importent que lui, jamais un fichier interne (`@/features/voyage`, pas `@/features/voyage/latest-video`).
  - Un module qui sert à deux routes a un point d'entrée par route : `index.ts` pour ce que montrent les autres pages
    (ex. `IaPreview` sur l'accueil), `page.ts` pour les chapitres de sa propre page, importé par sa route seule
    (`@/features/ia/page`, `@/features/sport/page`). Un même fichier ferait entrer dans chaque route les composants
    client de l'autre (Next suit tous les imports d'un point d'entrée).
  - Ce que plusieurs modules partagent sans qu'il appartienne à l'un d'eux va dans le design system
    (`useContactSubmit`, les styles `bezel` et `univers-page`).
  - Pas d'autre fichier barrel.
- **Interdit** :
  - le CSS-in-JS ;
  - Tailwind, styled-components et framer-motion dans le nouveau code ;
  - `any` sans commentaire ;
  - `console.log` ;
  - un composant « tag » (pastille au-dessus d'un titre).

## 2. La page et ses chapitres

Une page est un composant serveur qui assemble des sections. Chaque chapitre est une `<Section>` :

- `data-chapitre` : un nœud sur le rail du fil ;
- `aura` : la place de la lumière ;
- le trait du fil en haut du chapitre.

```tsx
// app/(pro)/page.tsx (serveur)
import { Section } from "@/design-system/components/section";
import { Container } from "@/design-system/components/container";
import { Words } from "@/design-system/components/words";

export default function ProHomePage() {
  return (
    <>
      <Hero variant="pro" />                         {/* <Section id="top" aura="droite" fil="none"> */}
      <Section id="equipe" aura="gauche" aria-labelledby="equipe-t">
        <Container>
          <Words as="h2" id="equipe-t" text={{ k: "pro.team.title" }} glow />
        </Container>
      </Section>
    </>
  );
}
```

**Ids attendus par la nav et le pied de page.** Ne pas les renommer.

| Page | Ids |
|---|---|
| Toutes | `#top` (le hero) |
| `/` | `#apps`, `#contact` |
| `/agents` | `#contact` |
| `/apps/[slug]` | `#action` |
| `/createur` | `#voyage`, `#sport`, `#suivre` |
| `/createur/voyage` | `#marques` |
| `/createur/sport` | `#partage`, `#courses` |

Une section qu'on atteint par une ancre et qui doit recevoir le focus porte `tabIndex={-1}`.

## 3. Textes : dictionnaire ou contenu

- **Texte d'interface** (titre de section, bouton, légende) : dans le dictionnaire de son espace.
  - Le français définit la forme ; l'anglais doit la respecter (TypeScript le vérifie). L'anglais est une vraie traduction, pas du mot à mot.
  - Variables : `{app}` puis `format(texte, { app })`.
- **Donnée** (une app, une course, une escale) : dans `content/`, en `Localized<T>` (`{ fr, en }`).
- **Mot mis en valeur** (Instrument Serif italique) : `*mot*`, dans un dictionnaire comme dans le contenu. Jamais de HTML.
- **Typographie française** : espace insécable (U+00A0) avant `? ! : ;`.

### Comment lire un texte selon l'endroit

| Où | Comment |
|---|---|
| Composant serveur | `<T k="pro.contact.title" />`, `<T value={app.domain} />`, `<T value={app.story.hook} rich glow />` (une petite feuille client) |
| Composant client | `const t = useTranslation()` puis `t.pro.contact.title` ; `const { lang } = useLanguage()` puis `localize(app.domain, lang)` ; `useText(source)` accepte une chaîne, un `Localized` ou `{ k }` |
| Mots animés | `<Words text={{ k: "pro.hero.line" }} glow />` ou `<Words text={app.story.question} />` |
| Métadonnées | `getDictionary().pro.meta` puis `pageMetadata({ …, path, universe })` (français, la langue du rendu serveur ; pas de hreflang ni d'`alternateLocale` tant qu'aucune URL ne sert l'anglais) |
| Attribut (`aria-label`, `alt`) | Dans un composant client : `useText()` ou `localize()` |

Le serveur rend toujours le français. L'anglais (`?lang=en` ou le choix mémorisé) s'applique côté client.

**Les espaces de chaque univers.** Le provider de langue est monté par `UniverseShell` avec les seuls espaces de son
univers (`universeMessages` d'i18n/server.ts) : Pro `common`, `footer`, `pro`, `apps`, `agents`, `victoire` ;
Créateur `common`, `footer`, `createur`, `voyage`, `sport` ; k15ze `common`, `footer`, `sport`. Un composant ne lit
que les espaces de l'univers où il est monté ; en développement, lire un autre espace lève une erreur claire.
Un nouvel espace s'ajoute à son univers dans `universeMessages`.

**L'entrée d'une page.** Le moment de jouer l'arrivée (hero, nav, /agents) vient de `usePageEntrance()`
(features/passages) : après le voile d'un passage, sinon après les polices (`waitFonts`) ou après une image et
`delay` ms.

## 4. Un composant client animé (GSAP, nettoyage complet)

Règles :

- **`"use client"`** : seulement là où il y a du mouvement ou de l'interaction, aussi bas que possible.
- **GSAP** : toujours importé de `@/design-system/motion/gsap`, où il est enregistré une seule fois avec ScrollTrigger.
- **`useGsap`** : crée tout dans un `gsap.context()` limité au composant, et l'annule au démontage (tweens, timelines, ScrollTrigger).
- **État final** : c'est celui du CSS par défaut. GSAP pose l'état de départ et joue vers l'état final. Sans JS et en mouvement réduit, tout reste lisible.
- **Lenis** : il y a une seule instance, celle de `MotionProvider`. Ne jamais en créer une autre. `useMotion()` donne `scrollTo`, `stop` et `start`.

```tsx
"use client";

import { useRef } from "react";

import { gsap } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import styles from "./team-scene.module.css";

/** La scène de l'équipe : épinglée sur ordinateur, jouée à l'entrée ailleurs. */
export function TeamScene({ items }: { items: readonly string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pinnable = useMediaQuery("(min-width: 900px) and (min-height: 600px)");

  useGsap(
    () => {
      if (reduced) return;                       // mouvement réduit : l'état final du CSS, rien à jouer
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },          // la courbe --expo de la maquette
        scrollTrigger: pinnable
          ? { trigger: rootRef.current, start: "top top", end: "+=200%", scrub: 0.6, pin: true }
          : { trigger: rootRef.current, start: "top 80%", once: true },
      });
      tl.from(`.${styles.item}`, { opacity: 0, y: 24, stagger: 0.12, duration: 0.9 });
    },
    rootRef,
    [reduced, pinnable],                         // tout est annulé puis recréé si l'un change
  );

  return (
    <div ref={rootRef} className={styles.scene}>
      {items.map((item) => (
        <p key={item} className={styles.item}>{item}</p>
      ))}
    </div>
  );
}
```

D'autres ressources pour le mouvement :

- **Hooks** :
  - `useInView(ref)` : apparition à l'entrée à l'écran (un IntersectionObserver partagé), réglée par défaut comme les maquettes de l'univers (pro .16 / -6 %, createur .12 / -10 %, k15ze .14 / -10 %) ;
  - `useMediaQuery()` ;
  - `useReducedMotion()`.
- **Composants** :
  - `<Reveal variant="card" index={i}>` ;
  - `<Words>` ;
  - `<Arch trace>` ;
  - `<Dialog>` ;
  - `data-loupe` sur une image.
- **Hors GSAP** (requestAnimationFrame, three.js, écouteurs) : chaque `useEffect` rend sa fonction de nettoyage (`cancelAnimationFrame`, `removeEventListener`, `renderer.dispose()`…).
- **Three.js et gros modules** : `next/dynamic(() => import(…), { ssr: false })`.

## 5. CSS Modules et jetons

```css
/* team-scene.module.css */
.scene {
  display: grid;
  gap: var(--space-m);
  padding-block: var(--sec);
}

.item {
  font-size: var(--fs-statement);
  color: var(--fg);
  transition: color .4s var(--expo);
}

/* Un réglage propre au mode clair */
:global(html[data-theme="light"]) .item {
  color: var(--muted);
}

/* L'état de départ n'existe qu'avec JS (html.js est posé avant l'affichage) */
:global(.js) .item[data-hidden] {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .item {
    transition-property: opacity;
  }
}
```

### Les jetons

Tous les jetons sont dans `design-system/tokens.css` :

| Rôle | Jetons |
|---|---|
| Fonds | `--bg`, `--bg-2`, `--hero-bg` |
| Texte | `--fg`, `--fg-rgb`, `--muted`, `--faint` |
| Filets | `--line` |
| Lumière | `--lum`, `--lum-2` (en « r g b ») |
| Matière | `--surface`, `--core`, `--sh-1`, `--sh-2` |
| Mouvement | `--expo`, `--out`, `--io` |
| Mesures | `--gutter`, `--gl`, `--gr`, `--maxw`, `--sec`, `--r-xl`, `--r-lg`, `--r-md`, `--fil-x` (l'axe du fil : rail et traits) |
| Polices | `--f-title`, `--f-text`, `--f-word`, `--f-num` |
| Couleurs de marque | `--creme`, `--encre`, `--nuit`, `--red`, `--lagon`, `--or` |
| k15ze | `--k-vert`, `--k-card`, `--k-title` |

Les couleurs en « r g b » s'emploient ainsi : `rgb(var(--lum) / .5)`.

### Mode et univers

- **Le mode** est sur `<html data-theme>`. Une règle propre à un mode s'écrit `:global(html[data-theme="light"]) .x {…}`.
- **L'univers** est sur le conteneur `[data-univers]`. Ses jetons s'appliquent à `:root` grâce à `:has()`, donc partout : `<dialog>`, calques fixes, voile des passages. Un module n'a pas à connaître l'univers : il lit `var(--lum)`, et cela suffit.
- **Variables propres à une page** (`--land-f`, `--hero-shade`…) : à déclarer dans le CSS Module de la section, pas dans `tokens.css`.

### Niveaux de qualité (appareils moins puissants)

- **Le niveau** est sur `<html data-quality="high|medium|low">` (`design-system/motion/quality*`). Un script inline le pose avant l'affichage d'après l'appareil (mémoire, cœurs, réseau, téléphone) ; la mesure des images (une sonde au démarrage, puis le défilement et les boucles lourdes) ne fait que le baisser, avec hystérésis, et le garde pour la session.
- **`high` ne change rien** : c'est le rendu de la maquette. `medium` et `low` allègent les effets, jamais la mise en page ni le sens.
- **En CSS** : `:global(html[data-quality="low"]) .x {…}` (flou d'arrière-plan, grain, filtres, grandes ombres).
- **En JS** : `useQuality()` dans un composant, `getQuality()` / `subscribeQuality()` dans un moteur (le niveau peut baisser en cours de route). Une boucle `requestAnimationFrame` lourde appelle `noteFrame(t)` : ses images comptent dans la mesure.
- **Calcul lourd au chargement** : en tranches (`runSliced` de `features/terre/engine/world`), jamais une tâche de plus de 50 ms.

## 6. Images

- **`next/image`** pour tout le contenu :
  - `width` et `height` réels (ceux de `ImageAsset`) ;
  - `sizes` = la largeur réellement affichée ;
  - jamais agrandie au-delà de sa taille réelle ;
  - `priority` ou `fetchPriority="high"` seulement pour l'image du hero.
- **Les assets** sont dans `public/assets/` (`img/`, `apps/`, `el/`, `sport3d/`, `hero3d/`, `terre/`, `badges/`). Seuls les fichiers que la maquette référence y ont été copiés.
  - Les variantes de taille de la maquette (`-320.webp`, `sport3d/256/`) ne sont pas reprises : `next/image` les produit.
  - Les objets 3D du hero sont à plat (`/assets/hero3d/pro-telephone.webp`).
- **Textures three.js** (`/assets/terre/*`) : chargées telles quelles, sans `next/image`.
- **Ajouter un asset** : un fichier à la fois, sans conversion en masse.

## 7. Liens, passages et formulaires

| Type de lien | Comment |
|---|---|
| Interne | `next/link` (ou `<Button href>`) avec les routes de `ROUTES` (`@/content/site`) |
| Externe | `<Button href external>`, ou bien `target="_blank" rel="noopener"` |
| Vers une autre page avec la transition | `{...passageAttributes("voyage")}` sur le lien |

- **Les passages** : les attributs posés par `passageAttributes()` (`data-passage`, `data-couleur`) sont repris par `features/passages`.
- **Aucun lien visible** entre Pro et Créateur.
- **Formulaires** : `POST /api/contact` (JSON). Le contrat est dans `content/contact.ts` :
  - champs `{ type: "contact" | "marques", nom, contact, besoin?, message, website: "" }` ;
  - `contact` : obligatoire, une adresse e-mail ou un @pseudo de réseau, vérifié par `checkContact()` ;
  - toute la validation est dans `validateContact(body)` : le même code dans les formulaires et dans la route ;
  - l'envoi, la réponse et l'état « Merci » : le hook `useContactSubmit` (`design-system/lib/use-contact-submit.ts`), partagé par les deux formulaires ; l'échec s'affiche dans une région `role="status"` permanente ;
  - le champ `website` est un piège à robots, caché et laissé vide ;
  - la route n'accepte que du JSON de même origine, 20 Kio au plus, et quelques envois par IP et par 10 minutes ; un message trop long pour Telegram part en plusieurs envois ;
  - les erreurs de champ sont des codes (`required`, `tooShort`…) à traduire dans le dictionnaire.

## 8. Vérifier avant de rendre

```bash
npx tsc --noEmit
npx eslint features/<module> app/<ta route> content/<ton fichier> i18n/dictionaries
```

- **Builds** : pas de `next build` ni de `next dev` de ton côté. Le serveur de l'orchestrateur tourne sur `http://localhost:3100`.
- **Captures** : une seule à la fois, avec les scripts du scratchpad.
- **Avant de rendre** :
  - parité visuelle avec la maquette, même viewport et même thème, en clair et en sombre ;
  - mouvement réduit ;
  - clavier ;
  - largeur de 375 px.
