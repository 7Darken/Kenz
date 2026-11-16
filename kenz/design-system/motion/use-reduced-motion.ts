"use client";

import { useMediaQuery } from "./use-media-query";

/** Vrai si le visiteur demande moins de mouvement : on passe alors à des fondus, sans trajet. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
