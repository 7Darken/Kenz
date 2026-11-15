"use client";

/**
 * Le fil d'une arche : deux tracés SVG à la taille réelle de l'arche (le fil de lumière et son ombre,
 * décalée de `gap` px), dessinés à l'entrée à l'écran, ou quand `traced` passe à vrai (mode contrôlé,
 * ex. le hero qui trace son arche pendant que le portrait arrive). Mouvement réduit : déjà tracé.
 */
import { useEffect, useRef, useState } from "react";

import { useInView } from "@/features/motion/use-in-view";
import styles from "./arch.module.css";

const f1 = (v: number) => Math.round(v * 10) / 10;

/** Le contour d'une arche de largeur w et hauteur h, écarté de e px (haut en demi-cercle). */
function archPath(w: number, h: number, e: number) {
  const x0 = -e;
  const x1 = w + e;
  const r = (x1 - x0) / 2;
  const cy = -e + r;
  return `M${f1(x0)} ${f1(h)}V${f1(cy)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(x1)} ${f1(cy)}V${f1(h)}`;
}

interface ArchTraceProps {
  /** Contrôlé : trace quand vrai. Absent : trace à l'entrée à l'écran. */
  traced?: boolean;
  /** Écart du fil fantôme (px). Défaut : 4 % de la largeur, entre 8 et 18 px. */
  gap?: number;
  /** Avec la ligne de sol. */
  floor?: boolean;
}

export function ArchTrace({ traced, gap, floor = false }: ArchTraceProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const inView = useInView(svgRef, { threshold: 0.2, rootMargin: "0px" });
  const isTraced = traced ?? inView;

  // Le tracé suit la taille réelle de l'arche (le parent).
  useEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return;
    const observer = new ResizeObserver(() => {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      if (w && h) setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const e = gap ?? (size ? Math.max(8, Math.min(18, size.w * 0.04)) : 0);

  return (
    <>
      <svg
        ref={svgRef}
        className={styles.trace}
        viewBox={size ? `0 0 ${f1(size.w)} ${f1(size.h)}` : undefined}
        data-traced={isTraced && size ? "" : undefined}
        aria-hidden="true"
        focusable="false"
      >
        {size ? (
          <>
            <path className={styles.shadow} pathLength={1} d={archPath(size.w, size.h, e)} />
            <path className={styles.fil} pathLength={1} d={archPath(size.w, size.h, 0)} />
          </>
        ) : null}
      </svg>
      {floor ? <i className={styles.floor} aria-hidden="true" /> : null}
    </>
  );
}
