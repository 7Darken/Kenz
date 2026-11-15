"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Suit une media query en direct. Rendu serveur et hydratation : `serverValue` (false par défaut).
 * Ex. `useMediaQuery("(min-width: 900px) and (min-height: 600px)")` pour décider d'un épinglage.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
