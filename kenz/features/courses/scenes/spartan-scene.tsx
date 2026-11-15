"use client";

/**
 * Spartan Race : le sentier, la nature (quelques sapins au trait), les obstacles en icônes 3D posés dessus.
 * Le mouvement est écrit par ./spartan-driver ; la légende et la frise suivent l'obstacle en cours.
 */
import { useRef, useState } from "react";

import type { SpartanScene as SpartanSceneData } from "@/content/courses";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import type { SceneLegend } from "./scene-kit";
import { SceneLegendView } from "./scene-legend";
import shared from "./scene.module.css";
import { createSpartanDriver, SPARTAN_TRAIL, SPARTAN_VIEW } from "./spartan-driver";
import styles from "./spartan-scene.module.css";
import { SportIcon } from "./sport-icon";
import { useSceneDriver } from "./use-scene-driver";

interface SpartanSceneProps {
  scene: SpartanSceneData;
  running: boolean;
  reduced: boolean;
}

/** Les sapins du décor (sommet gauche de chaque triangle). */
const TREES = [
  [52, 84],
  [80, 90],
  [228, 78],
  [254, 86],
  [352, 84],
  [496, 80],
  [524, 88],
] as const;

export function SpartanScene({ scene, running, reduced }: SpartanSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const [legend, setLegend] = useState<SceneLegend>({ label: "recap", words: "all" });
  useSceneDriver(rootRef, createSpartanDriver, setLegend, running, reduced);

  const names = scene.obstacles.map((obstacle) => localize(obstacle.name, lang));
  const obstacleIndex = legend.label.startsWith("obstacle:") ? Number(legend.label.slice(9)) : -1;
  const caption =
    obstacleIndex > -1
      ? { title: names[obstacleIndex], hint: localize(scene.obstacleHint, lang) }
      : legend.label === "trail"
        ? { title: localize(scene.trail.title, lang), hint: localize(scene.trail.hint, lang) }
        : { title: localize(scene.recap.title, lang), hint: localize(scene.recap.hint, lang) };

  return (
    <div ref={rootRef} className={styles.scene}>
      <div className={styles.terrain}>
        <svg className={styles.svg} viewBox={`0 0 ${SPARTAN_VIEW.width} ${SPARTAN_VIEW.height}`} focusable="false">
          <g className={styles.decor} data-part="decor">
            {TREES.map(([x, y]) => (
              <path key={x} d={`M${x} ${y}l9 -18 9 18z`} />
            ))}
          </g>
          <path className={styles.trail} d={SPARTAN_TRAIL} data-part="trail" />
          <path className={styles.done} d={SPARTAN_TRAIL} data-part="done" />
        </svg>
        <div className={styles.obstacles}>
          {scene.obstacles.map((obstacle) => (
            <span
              key={obstacle.kind}
              className={styles.obstacle}
              data-part="obstacle"
              data-kind={obstacle.kind}
              data-at={obstacle.at}
            >
              <i className={`${shared.halo} ${styles.halo}`} />
              <SportIcon icon={obstacle.icon} size={96} />
            </span>
          ))}
        </div>
        <i className={`${shared.point} ${styles.runner}`} data-part="runner" />
      </div>
      <SceneLegendView
        legendKey={legend.label}
        title={caption.title}
        hint={caption.hint}
        green={legend.label !== "trail"}
        words={names}
        on={legend.words}
      />
    </div>
  );
}
