"use client";

/**
 * Monte la bille three.js dans son calque (`host`) et la détruit au démontage. Chargé par `next/dynamic`
 * (`ssr: false`) : three.js n'est jamais dans le paquet du serveur ni dans celui du premier affichage.
 * Le mode clair / sombre suit `useTheme()` (fondu nuit ↔ jour dans le globe).
 */
import { useEffect, useRef } from "react";

import { useTheme } from "@/design-system/theme/theme-provider";
import { createGlobe, type Globe, type GlobeClassNames, type GlobeMode, type GlobePoint, type LatLon } from "./engine/globe";

export interface GlobeMountProps {
  host: HTMLElement;
  points: readonly GlobePoint[];
  view: LatLon;
  drift: number;
  reduced: boolean;
  plunge: boolean;
  /** Les éléments dont la présence à l'écran fait tourner le rendu. */
  observe: () => readonly Element[];
  classNames: GlobeClassNames;
  onGlobe: (globe: Globe | null) => void;
  onReady: (mode: GlobeMode) => void;
}

export default function GlobeMount({ host, points, view, drift, reduced, plunge, observe, classNames, onGlobe, onReady }: GlobeMountProps) {
  const { theme } = useTheme();
  const globeRef = useRef<Globe | null>(null);
  /* Les réglages de départ : lus une fois, à la création (le globe se recrée si le mouvement réduit change). */
  const initial = useRef({ points, view, drift, plunge, observe, classNames, onGlobe, onReady });

  useEffect(() => {
    const o = initial.current;
    const globe = createGlobe(host, {
      points: o.points,
      view: o.view,
      drift: reduced ? 0 : o.drift,
      theme: document.documentElement.getAttribute("data-theme") === "light" ? "day" : "night",
      reduced,
      plunge: o.plunge,
      observe: o.observe(),
      classNames: o.classNames,
      onReady: o.onReady,
    });
    globeRef.current = globe;
    o.onGlobe(globe);
    return () => {
      o.onGlobe(null);
      globe.destroy();
      globeRef.current = null;
    };
  }, [host, reduced]);

  useEffect(() => {
    globeRef.current?.setTheme(theme === "light" ? "day" : "night");
  }, [theme]);

  return null;
}
