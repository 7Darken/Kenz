"use client";

import { useLayoutEffect, type RefObject } from "react";

import { startupWeekend } from "@/content/startup-weekend";
import { gsap } from "@/features/motion/gsap";
import { useMotion } from "@/features/motion/motion-provider";
import type { Lang } from "@/i18n/config";

import { flowMode, pinMode } from "./victoire-modes";
import { collect, type PhotoFrame } from "./victoire-timelines";

/** L'épinglage : ordinateur assez grand, sans mouvement réduit. */
const PIN_QUERY = "(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const { win } = startupWeekend.photos;
/** Le cadrage du contenu (« 48% 30% ») : le point gardé au centre de l'arche. */
const [focusX = 50, focusY = 50] = (win.position ?? "50% 50%").split(/\s+/).map((v) => Number.parseFloat(v));
const PHOTO: PhotoFrame = {
  width: win.width,
  height: win.height,
  focusX: focusX / 100,
  focusY: focusY / 100,
  watermarkFrom: win.watermarkFrom ?? 1,
};

/**
 * Branche la séquence sur la racine : épinglée sur ordinateur, « à la suite » ailleurs, fondus en mouvement
 * réduit. gsap.matchMedia rejoue le bon mode quand l'écran change, et annule tout (tweens, ScrollTrigger,
 * épinglage, écouteurs) au démontage. Les mots changent avec la langue : la séquence est alors reconstruite.
 */
export function useVictoireMotion(rootRef: RefObject<HTMLElement | null>, lang: Lang) {
  const motion = useMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const refs = collect(root);
    const mm = gsap.matchMedia(root);
    mm.add({ pin: PIN_QUERY, reduced: "(prefers-reduced-motion: reduce)", all: "(min-width: 0px)" }, (context) => {
      const { pin, reduced } = context.conditions as { pin: boolean; reduced: boolean };
      return pin ? pinMode(refs, PHOTO, motion.lenis) : flowMode(refs, PHOTO, reduced);
    });
    return () => mm.revert();
  }, [rootRef, lang, motion]);
}
