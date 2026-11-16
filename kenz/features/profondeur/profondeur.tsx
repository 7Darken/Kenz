"use client";

/**
 * La profondeur des heros : des objets qui flottent sur trois plans autour du portrait, pour faire comprendre
 * l'univers sans texte. Du fond vers l'avant : loin (derrière le halo et l'arche) < portrait < milieu < près.
 * Le rendu est fait par React (une fois l'application démarrée : rien côté serveur, rien de lu par les
 * lecteurs d'écran) ; le choix des objets, leur entrée et leur mouvement par le moteur (./depth-engine).
 */
import Image from "next/image";
import { useEffect, useMemo, useRef, useSyncExternalStore, type CSSProperties } from "react";

import { Polaroid } from "@/design-system/components/polaroid";
import type { Quality } from "@/design-system/motion/quality";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useQuality } from "@/design-system/motion/use-quality";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { startDepth } from "./depth-engine";
import { PLANS, place, type PlacedObject } from "./profondeur-planes";
import { DEPTH_SERIES, type DepthSeriesId } from "./profondeur-series";
import styles from "./profondeur.module.css";

export interface ProfondeurProps {
  series: DepthSeriesId;
  /** Le hero est arrivé : les objets entrent 1,05 s plus tard. */
  ready: boolean;
  /** Lit le temps (s) déjà écoulé de l'arrivée du hero quand `ready` est passé à vrai : il est retiré de l'attente. */
  readyLag?: () => number;
  /** Le portrait (le visage est protégé). */
  figSelector?: string;
  /** Ce qu'aucun objet ne doit couvrir. */
  avoidSelector?: string;
}

/** Le visage, en fractions du portrait : x0, y0, x1, y1. */
const FACE = [0.27, 0.06, 0.73, 0.46] as const;
/** Le nombre d'objets montrés au plus [ordinateur, mobile], selon le niveau de qualité. */
const MAX_SHOWN: Record<Quality, readonly [number, number]> = { high: [6, 3], medium: [5, 3], low: [3, 2] };

const noop = () => () => {};
/** Vrai une fois l'application démarrée (faux au rendu serveur et à l'hydratation). */
const useStarted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

function itemStyle(p: PlacedObject): CSSProperties {
  const k = (p.index % 3) - 1;
  const plan = PLANS[p.plan];
  return {
    "--x": `${p.x}%`,
    "--y": `${p.y}%`,
    "--t": `${p.width.toFixed(1)}px`,
    "--k": p.ratio.toFixed(4),
    "--r": `${p.rot}deg`,
    "--ax": `${plan.souris}px`,
    "--fy": `${(plan.flotte * (1 + k * 0.18)).toFixed(1)}px`,
    "--fx": `${(plan.flotte * 0.25).toFixed(1)}px`,
    "--fr": `${(plan.rot * (1 - k * 0.2)).toFixed(2)}deg`,
    "--fd": `${(plan.duree + k * 1.3).toFixed(1)}s`,
    // Désynchronisés : chaque objet sa durée et sa phase.
    "--fdl": `${(-((p.index * 3.7) % 9) - 0.4).toFixed(2)}s`,
  } as CSSProperties;
}

function DepthItem({ p }: { p: PlacedObject }) {
  const { object } = p;
  const sizes = `${Math.round(p.size)}px`;
  const image =
    object.type === "polaroid" ? (
      <Polaroid image={object.image} sizes={sizes} />
    ) : object.neon !== undefined ? (
      // La lueur néon : une copie de l'image, filtrée sur ses accents Lagon (rien n'est peint dans l'image).
      <span className={styles.neon} style={{ "--neon-strength": object.neon } as CSSProperties}>
        <Image src={object.image.src} alt="" width={object.image.width} height={object.image.height} sizes={sizes} draggable={false} fetchPriority="low" />
        <Image className={styles.neonGlow} src={object.image.src} alt="" width={object.image.width} height={object.image.height} sizes={sizes} draggable={false} fetchPriority="low" />
      </span>
    ) : (
      <Image className={styles.img} src={object.image.src} alt="" width={object.image.width} height={object.image.height} sizes={sizes} draggable={false} fetchPriority="low" />
    );

  return (
    <div className={styles.item} data-depth-item="" data-plan={p.plan} data-type={object.type} style={itemStyle(p)}>
      <span className={styles.float}>
        <span className={styles.render}>{image}</span>
      </span>
    </div>
  );
}

export function Profondeur({
  series,
  ready,
  readyLag,
  figSelector = "[data-hero-fig]",
  avoidSelector = "[data-hero-avoid]",
}: ProfondeurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const started = useStarted();
  const desktop = useMediaQuery("(min-width: 861px)");
  const mouse = useMediaQuery("(min-width: 861px) and (hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const quality = useQuality();
  const config = DEPTH_SERIES[series];
  // Une liste stable : le moteur n'est remis en place que si les objets ou leurs places changent.
  const placed = useMemo(
    () =>
      started
        ? config.objects.map((object, index) => place(object, index, desktop)).filter((p): p is PlacedObject => p !== null)
        : [],
    [started, config, desktop],
  );
  const hasNeon = placed.some((p) => p.object.neon !== undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !placed.length) return;
    return startDepth(container, {
      placed,
      max: MAX_SHOWN[quality][desktop ? 0 : 1],
      reduced,
      // Qualité basse : pas de parallaxe à la souris (une mise à jour de style par image).
      mouse: mouse && quality !== "low",
      ready,
      readyLag: ready && readyLag ? readyLag() : 0,
      revealed: revealedRef.current,
      onReveal: () => {
        revealedRef.current = true;
      },
      fade: config.fade,
      figSelector,
      face: FACE,
      avoidSelector,
    });
  }, [placed, desktop, quality, reduced, mouse, ready, readyLag, config.fade, figSelector, avoidSelector]);

  return (
    <div ref={containerRef} className={styles.prof} aria-hidden="true">
      {hasNeon ? (
        <svg className={styles.filters} width="0" height="0" focusable="false">
          <defs>
            <filter id="kz-prof-neon" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0.45  0 0 0 0 0.88  0 0 0 0 0.96  -5 2.5 2.5 0 -0.8"
                result="blue-selection"
              />
              <feComposite in="blue-selection" in2="SourceAlpha" operator="in" result="blue-parts" />
              <feGaussianBlur in="blue-parts" stdDeviation="5" result="wide-glow" />
              <feGaussianBlur in="blue-parts" stdDeviation="1.5" result="close-glow" />
              <feMerge>
                <feMergeNode in="wide-glow" />
                <feMergeNode in="close-glow" />
                <feMergeNode in="blue-parts" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      ) : null}
      {placed.map((p) => (
        <DepthItem key={p.object.id} p={p} />
      ))}
    </div>
  );
}
