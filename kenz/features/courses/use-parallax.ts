"use client";

/**
 * La parallaxe des compositions : chaque calque `[data-speed]` glisse à sa vitesse (en % de la hauteur de
 * l'écran sur toute la traversée de sa composition `[data-compo]`), GSAP ScrollTrigger + scrub.
 * Rien en mouvement réduit. Tout est annulé au démontage (useGsap).
 */
import type { RefObject } from "react";

import { gsap } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";

export function useParallax(rootRef: RefObject<HTMLElement | null>, enabled: boolean, count: number) {
  useGsap(
    () => {
      const root = rootRef.current;
      if (!enabled || !root) return;
      root.querySelectorAll<HTMLElement>("[data-compo]").forEach((compo) => {
        compo.querySelectorAll<HTMLElement>("[data-speed]").forEach((layer) => {
          const speed = Number(layer.dataset.speed) || 0;
          gsap.fromTo(
            layer,
            { y: () => (speed * window.innerHeight) / 100 },
            {
              y: () => (-speed * window.innerHeight) / 100,
              ease: "none",
              scrollTrigger: { trigger: compo, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
            },
          );
        });
      });
    },
    rootRef,
    [enabled, count],
  );
}
