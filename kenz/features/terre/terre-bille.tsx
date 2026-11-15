"use client";

/**
 * La petite bille de cristal de /createur/voyage (maquettes/v6/voyage.html) : un seul globe pour la page, dans un
 * calque fixe sans ciel (le fond de la page et l'aura restent visibles). Elle se pose sur l'emplacement `[data-bille]`
 * le plus visible (centre, rayon = la moitié de sa largeur) et s'efface quand aucun n'est à l'écran.
 * - Un emplacement `data-bille="libre"` : la rotation lente, l'Asie face à nous, aucun pays allumé.
 * - Tout autre emplacement : la bille se tourne vers `focus` (le pays un peu au-dessus du centre) et l'allume ;
 *   sans `focus`, comme un emplacement libre.
 */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import type { EscaleId } from "@/content/series";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import type { Globe, GlobeMode } from "./engine/globe";
import { STOPS } from "./stops";
import styles from "./terre-layer.module.css";

const GlobeMount = dynamic(() => import("./globe-mount"), { ssr: false });

export interface TerreBilleFocus {
  /** Le pays à allumer. */
  escale: EscaleId;
  /** Le point vers lequel la bille se tourne (la série, ou son escale). */
  lat: number;
  lon: number;
}

export interface TerreBilleProps {
  focus?: TerreBilleFocus | null;
}

const ASIA = { lat: 16, lon: 106 } as const;
const DRIFT = 1.2;
/** Le pays visé passe un peu au-dessus du centre de la bille. */
const TILT = 4;
const SLOTS = "[data-bille]";

const CLASS_NAMES = {
  floor: styles.floor,
  shadow: styles.shadow,
  caustic: styles.caustic,
  canvas: styles.canvas,
  fallback: styles.fallback,
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const observe = () => Array.from(document.querySelectorAll(SLOTS));

export function TerreBille({ focus = null }: TerreBilleProps) {
  const reduced = useReducedMotion();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [globe, setGlobe] = useState<Globe | null>(null);
  const [mode, setMode] = useState<GlobeMode | null>(null);
  const focusRef = useRef(focus);
  /** L'emplacement où la bille est posée, et s'il suit `focus`. */
  const followsRef = useRef<boolean | null>(null);

  const onGlobe = useCallback((g: Globe | null) => {
    setGlobe(g);
    if (!g) setMode(null);
  }, []);

  /* Tourner la bille : vers le pays visé, ou la rotation lente sur l'Asie */
  const turn = useCallback(
    (g: Globe, follows: boolean) => {
      const target = follows ? focusRef.current : null;
      if (target) {
        g.drift(0);
        g.orient(target.lat - TILT, target.lon);
        g.light(target.escale);
      } else {
        g.drift(reduced ? 0 : DRIFT);
        g.orient(ASIA.lat, ASIA.lon);
        g.light(null);
      }
    },
    [reduced],
  );

  /* La bille se pose sur l'emplacement le plus visible, à chaque défilement */
  useEffect(() => {
    if (!globe) return;
    followsRef.current = null;
    let raf = 0;
    const place = () => {
      raf = 0;
      const vh = window.innerHeight;
      let best: { el: Element; rect: DOMRect } | null = null;
      let bestSeen = 0;
      document.querySelectorAll(SLOTS).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width) return;
        const seen = clamp01((Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / rect.height);
        if (seen > bestSeen) {
          bestSeen = seen;
          best = { el, rect };
        }
      });
      if (!best || bestSeen <= 0) {
        globe.opacity(0);
        return;
      }
      const { el, rect } = best as { el: Element; rect: DOMRect };
      globe.frame({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, r: rect.width / 2 });
      globe.opacity(smooth(0.2, 0.75, bestSeen));
      const follows = el.getAttribute("data-bille") !== "libre";
      if (follows !== followsRef.current) {
        followsRef.current = follows;
        turn(globe, follows);
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [globe, turn]);

  /* Le pays visé change (la série au milieu de l'écran) : la bille se tourne vers lui */
  useEffect(() => {
    focusRef.current = focus;
    if (globe && followsRef.current) turn(globe, true);
  }, [globe, focus, turn]);

  return (
    <div ref={setHost} className={styles.layer} data-ready={mode ?? undefined} aria-hidden="true">
      {host ? (
        <GlobeMount
          host={host}
          points={STOPS}
          view={ASIA}
          drift={DRIFT}
          reduced={reduced}
          plunge={false}
          observe={observe}
          classNames={CLASS_NAMES}
          onGlobe={onGlobe}
          onReady={setMode}
        />
      ) : null}
    </div>
  );
}
