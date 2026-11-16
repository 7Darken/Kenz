"use client";

/**
 * Le calque du globe sur /createur : un seul globe pour toute la page, fixe derrière les chapitres.
 * Il se pose dans le hero (emplacement `behind` de `Hero`, entre le paysage et l'arche) : dans le hero, la Terre se
 * lève à l'horizon sous le portrait ; au défilement, `VoyageJourney` recule la caméra jusqu'à la planète entière.
 * Dedans : l'ombre portée et le canevas WebGL (ou l'image de repli), ajoutés par le globe, chargé à part
 * (`next/dynamic`, sans rendu serveur). Arrivée par la plongée depuis Pro : la descente finit ici, et l'éclat de la
 * plongée se dissipe sur la Terre dès son premier rendu.
 */
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { announceTerreReady, usePassageArrival } from "@/features/passages";
import type { GlobeMode } from "./engine/globe";
import { HERO_DRIFT, HERO_VIEW, STOPS } from "./stops";
import styles from "./terre-layer.module.css";
import { useTerreScene } from "./terre-scene";

const GlobeMount = dynamic(() => import("./globe-mount"), { ssr: false });

const CLASS_NAMES = {
  floor: styles.floor,
  shadow: styles.shadow,
  caustic: styles.caustic,
  canvas: styles.canvas,
  fallback: styles.fallback,
};

const observe = () => ["top", "voyage"].flatMap((id) => document.getElementById(id) ?? []);

export function TerreLayer() {
  const reduced = useReducedMotion();
  const { via } = usePassageArrival();
  const { setGlobe } = useTerreScene();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<GlobeMode | null>(null);
  const plunge = via === "dive";

  const onReady = useCallback((ready: GlobeMode) => {
    setMode(ready);
    announceTerreReady();
  }, []);

  return (
    <div
      ref={setHost}
      className={styles.layer}
      data-ready={mode ?? undefined}
      data-plunge={plunge ? "" : undefined}
      aria-hidden="true"
    >
      {host ? (
        <GlobeMount
          host={host}
          points={STOPS}
          view={HERO_VIEW}
          drift={HERO_DRIFT}
          reduced={reduced}
          plunge={plunge}
          observe={observe}
          classNames={CLASS_NAMES}
          onGlobe={setGlobe}
          onReady={onReady}
        />
      ) : null}
    </div>
  );
}
