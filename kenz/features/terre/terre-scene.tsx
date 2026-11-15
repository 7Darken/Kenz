"use client";

/**
 * La scène de la Terre sur /createur : relie le ciel (`TerreSky`, sous le hero), le globe (`TerreLayer`, posé dans le
 * hero) et le trajet du voyage (`VoyageJourney`), qui les pilote au défilement.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { Globe } from "./engine/globe";

interface TerreSceneValue {
  globe: Globe | null;
  setGlobe: (globe: Globe | null) => void;
  /** Le ciel : sous le paysage du hero, derrière le globe pendant le voyage ; il s'efface avec le globe. */
  sky: HTMLElement | null;
  setSky: (sky: HTMLElement | null) => void;
}

const TerreSceneContext = createContext<TerreSceneValue | null>(null);

export function TerreScene({ children }: { children: ReactNode }) {
  const [globe, setGlobe] = useState<Globe | null>(null);
  const [sky, setSky] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ globe, setGlobe, sky, setSky }), [globe, sky]);
  return <TerreSceneContext.Provider value={value}>{children}</TerreSceneContext.Provider>;
}

export function useTerreScene(): TerreSceneValue {
  const context = useContext(TerreSceneContext);
  if (!context) throw new Error("useTerreScene doit être utilisé sous <TerreScene>");
  return context;
}
