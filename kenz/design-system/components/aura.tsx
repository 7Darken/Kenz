"use client";

/**
 * L'aura (trois halos de lumière fixes derrière la page) et le grain, montés une fois par univers.
 * Quand un chapitre occupe le milieu de l'écran, les halos glissent lentement vers sa place
 * (`data-aura` posé par <Section aura="…">). Pas de boucle : ils bougent seulement au changement.
 */
import { useEffect, useRef } from "react";

import { subscribeChapters } from "../lib/chapters";
import styles from "./aura.module.css";

type Halo = readonly [x: number, y: number, opacity: number];

/** Les places des trois halos (x, y en % de l'écran ; opacité), reprises de la maquette. */
const PLACES: Record<string, readonly [Halo, Halo, Halo]> = {
  droite: [[82, 14, 1], [6, 98, 1], [64, 80, 0.7]],
  gauche: [[16, 18, 1], [96, 92, 1], [38, 78, 0.7]],
  centre: [[50, 30, 1], [10, 102, 0.8], [90, 94, 0.6]],
  haut: [[62, -6, 1], [4, 72, 0.8], [32, 18, 0.5]],
  bas: [[46, 104, 1], [98, 12, 0.8], [8, 40, 0.5]],
  calme: [[88, 4, 0.5], [2, 102, 0.55], [60, 76, 0.3]],
};

function placesFor(value: string | null): readonly [Halo, Halo, Halo] {
  const key = (value ?? "droite").trim();
  if (PLACES[key]) return PLACES[key];
  const [x, y] = key.split(/[\s,]+/).map(Number.parseFloat);
  const base = PLACES.droite;
  return Number.isFinite(x) && Number.isFinite(y) ? [[x, y, 1], base[1], base[2]] : base;
}

export function Aura({ grain = true }: { grain?: boolean }) {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aura = auraRef.current;
    if (!aura) return;
    const halos = Array.from(aura.children) as HTMLElement[];
    let current: string | null | undefined;

    const place = (value: string | null) => {
      if (value === current) return;
      current = value;
      placesFor(value).forEach(([x, y, opacity], index) => {
        halos[index]?.style.setProperty("--x", `${x}vw`);
        halos[index]?.style.setProperty("--y", `${y}vh`);
        halos[index]?.style.setProperty("--o", String(opacity));
      });
    };

    const frame = requestAnimationFrame(() => aura.setAttribute("data-on", ""));
    const unsubscribe = subscribeChapters({
      onFrame({ active }, boxes) {
        place(boxes[active]?.el.getAttribute("data-aura") ?? null);
      },
    });
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div ref={auraRef} className={styles.aura} aria-hidden="true">
        <i className={`${styles.halo} ${styles.halo1}`} />
        <i className={`${styles.halo} ${styles.halo2}`} />
        <i className={`${styles.halo} ${styles.halo3}`} />
      </div>
      {grain ? <div className={styles.grain} aria-hidden="true" /> : null}
    </>
  );
}
