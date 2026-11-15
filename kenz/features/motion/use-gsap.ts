"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";

import { gsap } from "./gsap";

/**
 * Crée des animations GSAP dans un `gsap.context()` limité à `scope`, et les annule toutes au démontage
 * (tweens, timelines et ScrollTrigger créés dans `setup`). `setup` peut renvoyer un nettoyage en plus.
 *
 *   useGsap(() => {
 *     gsap.from(".item", { opacity: 0, y: 24, stagger: .1, scrollTrigger: { trigger: ".list" } });
 *   }, rootRef, [reduced]);
 */
export function useGsap(
  setup: (context: gsap.Context) => void | (() => void),
  scope: RefObject<Element | null>,
  deps: DependencyList = [],
): void {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const context = gsap.context(setup, scope.current);
    return () => context.revert();
    // Les dépendances sont celles de l'appelant (comme useEffect).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
