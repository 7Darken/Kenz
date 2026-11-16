"use client";

/**
 * Le chef d'orchestre du hero : l'arrivée (au chargement, ou à la fin d'un passage) et le départ au défilement.
 * - L'arrivée : le CSS la joue dès le premier affichage (le paysage, le portrait, le titre, le lien), sans attendre
 *   React. Pendant un passage, `data-hold` la retient (posé avant l'affichage) jusqu'à `data-in`, avec `data-arriving`
 *   (délais plus courts côté Créateur) et `data-dive` après la plongée. Le moment de `data-in` vient de
 *   usePageEntrance (features/passages) : quand le voile se lève (2,5 s au plus) ; sinon après les polices côté
 *   Créateur, juste après le premier affichage côté Pro. Il est partagé par contexte (les mots de la phrase, le fil
 *   de l'arche, les objets 3D), avec le temps déjà écoulé de l'arrivée CSS (`--hero-lag`) : ils restent en phase.
 * - Au défilement (ordinateur, sans mouvement réduit) : le texte monte et s'efface, le portrait et l'arche
 *   remontent à peine. Créateur : le paysage glisse plus lentement et s'efface, la scène s'efface au début.
 *   Leur opacité passe par `--hero-scroll` : un fondu piloté de l'extérieur (setHeroFade) peut primer sur elle.
 */
import { createContext, useCallback, useContext, useLayoutEffect, useRef, type ReactNode } from "react";

import { gsap } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { usePageEntrance } from "@/features/passages";
import type { HeroVariant } from "./hero-variants";
import styles from "./hero.module.css";

interface HeroArrival {
  entered: boolean;
  /** Secondes déjà écoulées de l'arrivée jouée en CSS quand `entered` est passé à vrai (0 après un passage). */
  lag: () => number;
}

const HeroContext = createContext<HeroArrival>({ entered: false, lag: () => 0 });

/** Vrai quand le hero est arrivé (les éléments qui se dessinent à l'arrivée s'y accrochent). */
export const useHeroEntered = () => useContext(HeroContext).entered;

/** Lit le temps (s) déjà écoulé de l'arrivée CSS, à retirer des délais de ce qui suit `useHeroEntered` (à lire dans
 *  un effet : il est mesuré juste avant). */
export const useHeroLag = () => useContext(HeroContext).lag;

/** Le temps écoulé (s) de l'animation d'arrivée du paysage, jouée en CSS dès le premier affichage. */
function elapsedArrival(section: HTMLElement): number {
  const animation = section.querySelector(`.${styles.bgIn}`)?.getAnimations()[0];
  const now = document.timeline.currentTime;
  const start = animation?.startTime;
  if (typeof now !== "number" || typeof start !== "number") return 0;
  return Math.max(0, (now - start) / 1000);
}

/** Au plus tard, l'entrée se joue 2,5 s après l'arrivée d'un passage (comme la maquette). */
const ARRIVAL_MAX_MS = 2500;

interface HeroDirectorProps {
  variant: HeroVariant;
  children: ReactNode;
}

export function HeroDirector({ variant, children }: HeroDirectorProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");
  // Créateur : après les polices (le titre se mesure juste) ; Pro : 60 ms après le premier affichage.
  const { entered, via } = usePageEntrance(
    variant === "createur" ? { waitFonts: true, maxWait: ARRIVAL_MAX_MS } : { delay: 60, maxWait: ARRIVAL_MAX_MS },
  );

  const lagRef = useRef(0);
  const lag = useCallback(() => lagRef.current, []);

  // Le chapitre (rendu par le composant serveur) : retrouvé depuis la sentinelle.
  const sentinelRef = useCallback((node: HTMLSpanElement | null) => {
    sectionRef.current = node?.closest("section") ?? null;
  }, []);

  // L'arrivée se lit sur le chapitre : `data-hold`, `data-arriving`, `data-dive` pendant l'attente d'un passage,
  // puis `data-in` (la retenue est levée ; sans passage, le CSS jouait déjà).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (entered) {
      const held = section.hasAttribute("data-hold") || document.documentElement.hasAttribute("data-kz-arrive");
      const late = held ? 0 : elapsedArrival(section);
      section.style.setProperty("--hero-lag", `${late.toFixed(3)}s`);
      section.setAttribute("data-in", "");
      section.removeAttribute("data-hold");
      document.documentElement.removeAttribute("data-kz-arrive");
      lagRef.current = late;
      return;
    }
    section.toggleAttribute("data-hold", via !== null);
    section.toggleAttribute("data-arriving", via !== null);
    section.toggleAttribute("data-dive", via === "dive");
  }, [entered, via]);

  // Le départ au défilement : GSAP pose et retire tout (gsap.context, via useGsap).
  useGsap(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const pass = { trigger: section, start: "top top", end: "bottom top" };

      if (wide && !reduced) {
        gsap.to("[data-hero-copy]", { y: -80, opacity: 0.12, ease: "none", scrollTrigger: { ...pass, scrub: 0.6 } });
        gsap.to(["[data-hero-fig]", "[data-hero-arch]"], {
          yPercent: -4,
          ease: "none",
          scrollTrigger: { ...pass, scrub: 0.6 },
        });
      }

      if (variant !== "createur") return;
      // Créateur : le paysage glisse à 0,22 de la vitesse du défilement et s'efface sur la moitié du hero ;
      // la scène (portrait, arche, objets) s'efface entre 3 % et 25 % du hero, quand la Terre prend la place.
      // Chaque timeline dure 1 : sa position suit la part du hero déjà défilée.
      const height = () => section.offsetHeight || window.innerHeight;
      const tl = gsap.timeline({ scrollTrigger: { ...pass, scrub: true, invalidateOnRefresh: true } }).set({}, {}, 1);
      tl.fromTo("[data-hero-bg]", { "--hero-scroll": 1 }, { "--hero-scroll": 0, duration: 0.5, ease: "none" }, 0);
      if (reduced) return;
      tl.fromTo("[data-hero-bg]", { y: 0 }, { y: () => height() * 0.78, duration: 1, ease: "none" }, 0);
      tl.fromTo("[data-hero-scene]", { "--hero-scroll": 1 }, { "--hero-scroll": 0, duration: 0.22, ease: "none" }, 0.03);
    },
    sectionRef,
    [wide, reduced, variant],
  );

  return (
    <HeroContext.Provider value={{ entered, lag }}>
      <span ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      {children}
    </HeroContext.Provider>
  );
}
