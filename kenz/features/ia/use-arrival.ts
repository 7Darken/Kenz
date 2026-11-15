"use client";

import { useEffect, useState } from "react";

import { usePassageArrival } from "@/features/passages";

/**
 * L'arrivée de la page /agents (agents.html, `heroIn`) : la phrase et la machine entrent ensemble,
 * juste après le premier affichage, ou quand le voile du passage se lève.
 * `enabled` à false : rien à jouer, l'état final tout de suite.
 */
export function useArrival(enabled = true): boolean {
  const { via, ready } = usePassageArrival();
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (!enabled || !ready) return;
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(() => setArrived(true), via ? 0 : 60);
    });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [enabled, ready, via]);

  return arrived || !enabled;
}
