"use client";

/**
 * Le chef d'orchestre du hero : l'arrivée (au chargement, ou à la fin d'un passage) et le départ au défilement.
 * - L'arrivée pose `data-in` sur le chapitre (le CSS joue le paysage, le portrait, le titre, le lien) et
 *   la partage par contexte (les mots de la phrase, le fil de l'arche, les objets 3D).
 *   Après un passage (usePassageArrival de features/passages), elle attend que le voile se lève (2,5 s au plus),
 *   avec `data-arriving` (délais plus courts côté Créateur) et `data-dive` après la plongée.
 * - Au défilement (ordinateur, sans mouvement réduit) : le texte monte et s'efface, le portrait et l'arche
 *   remontent à peine. Créateur : le paysage glisse plus lentement et s'efface, la scène s'efface au début.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { gsap } from "@/features/motion/gsap";
import { useGsap } from "@/features/motion/use-gsap";
import { useMediaQuery } from "@/features/motion/use-media-query";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { usePassageArrival } from "@/features/passages";
import type { HeroVariant } from "./hero-variants";
import styles from "./hero.module.css";

const HeroContext = createContext(false);

/** Vrai quand le hero est arrivé (les éléments qui se dessinent à l'arrivée s'y accrochent). */
export const useHeroEntered = () => useContext(HeroContext);

/** Au plus tard, l'entrée se joue 2,5 s après l'arrivée d'un passage (comme la maquette). */
const ARRIVAL_MAX_MS = 2500;

interface HeroDirectorProps {
  variant: HeroVariant;
  children: ReactNode;
}

export function HeroDirector({ variant, children }: HeroDirectorProps) {
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");
  const { via, ready } = usePassageArrival();

  // Le chapitre (rendu par le composant serveur) : retrouvé depuis la sentinelle.
  const sentinelRef = useCallback((node: HTMLSpanElement | null) => {
    sectionRef.current = node?.closest("section") ?? null;
  }, []);

  // L'arrivée : une seule fois par montage.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || entered) return;
    const timers: number[] = [];
    let frame = 0;
    let dead = false;
    const enter = () => {
      if (dead) return;
      section.setAttribute("data-in", "");
      setEntered(true);
    };
    section.toggleAttribute("data-arriving", via !== null);
    section.toggleAttribute("data-dive", via === "dive");

    if (via !== null) {
      // Le voile se lève : l'entrée, raccourcie, se joue (au plus tard 2,5 s après l'arrivée).
      if (ready) frame = requestAnimationFrame(enter);
      else timers.push(window.setTimeout(enter, ARRIVAL_MAX_MS));
    } else if (variant === "createur") {
      // Créateur : après les polices (le titre se mesure juste), 0,7 s au plus.
      let started = false;
      const go = () => {
        if (started || dead) return;
        started = true;
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(enter);
        });
      };
      timers.push(window.setTimeout(go, 700));
      void document.fonts?.ready.then(go);
    } else {
      frame = requestAnimationFrame(() => timers.push(window.setTimeout(enter, 60)));
    }

    return () => {
      dead = true;
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [variant, via, ready, entered]);

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
      tl.fromTo("[data-hero-bg]", { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "none" }, 0);
      if (reduced) return;
      tl.fromTo("[data-hero-bg]", { y: 0 }, { y: () => height() * 0.78, duration: 1, ease: "none" }, 0);
      tl.fromTo("[data-hero-scene]", { opacity: 1 }, { opacity: 0, duration: 0.22, ease: "none" }, 0.03);
    },
    sectionRef,
    [wide, reduced, variant],
  );

  return (
    <HeroContext.Provider value={entered}>
      <span ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      {children}
    </HeroContext.Provider>
  );
}
