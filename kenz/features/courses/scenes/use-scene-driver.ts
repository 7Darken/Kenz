"use client";

/**
 * Fait vivre une scène : crée son pilote sur le DOM rendu (avant l'affichage), puis la boucle
 * requestAnimationFrame tant que `running` (fiche ouverte, pas de photo agrandie). Mouvement réduit :
 * l'état final, figé. Tout est arrêté et nettoyé au démontage.
 */
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

import type { SceneDriver, SceneFactory, SceneLegend } from "./scene-kit";

export function useSceneDriver(
  rootRef: RefObject<HTMLElement | null>,
  factory: SceneFactory,
  onLegend: (legend: SceneLegend) => void,
  running: boolean,
  reduced: boolean,
) {
  const driverRef = useRef<SceneDriver | null>(null);
  const startRef = useRef(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const driver = factory(root, onLegend);
    driverRef.current = driver;
    if (reduced) driver.freeze();
    return () => {
      driver.dispose?.();
      driverRef.current = null;
    };
  }, [rootRef, factory, onLegend, reduced]);

  useEffect(() => {
    const driver = driverRef.current;
    if (!driver || reduced || !running) return;
    let raf = 0;
    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const sec = (now - startRef.current) / 1000;
      driver.tick(sec < driver.intro ? sec : driver.intro + ((sec - driver.intro) % driver.period));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, reduced]);
}
