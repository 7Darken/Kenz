"use client";

import { useSyncExternalStore } from "react";

import { getQuality, subscribeQuality, type Quality } from "./quality";

/**
 * Le niveau de qualité du rendu (`high`, `medium`, `low`), suivi en direct (il peut baisser en cours de route).
 * Rendu serveur et hydratation : `high` ; le niveau réel arrive juste après.
 */
export function useQuality(): Quality {
  return useSyncExternalStore(subscribeQuality, getQuality, () => "high");
}
