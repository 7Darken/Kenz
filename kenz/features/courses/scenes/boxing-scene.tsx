"use client";

/**
 * Boxe : les bandes, le sac suspendu, les gants, en icônes 3D (pas de personnage). Le mouvement est écrit par
 * ./boxing-driver ; la légende et la frise suivent l'étape. Mouvement réduit : les trois objets posés côte à côte.
 */
import { useRef, useState } from "react";

import type { BoxingScene as BoxingSceneData } from "@/content/courses";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { createBoxingDriver } from "./boxing-driver";
import styles from "./boxing-scene.module.css";
import shared from "./scene.module.css";
import type { SceneLegend } from "./scene-kit";
import { SceneLegendView } from "./scene-legend";
import { SportIcon } from "./sport-icon";
import { useSceneDriver } from "./use-scene-driver";

interface BoxingSceneProps {
  scene: BoxingSceneData;
  running: boolean;
  reduced: boolean;
}

export function BoxingScene({ scene, running, reduced }: BoxingSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const [legend, setLegend] = useState<SceneLegend>({ label: "recap", words: "all" });
  useSceneDriver(rootRef, createBoxingDriver, setLegend, running, reduced);

  const step = legend.label.startsWith("step:") ? scene.steps[Number(legend.label.slice(5))] : undefined;
  const caption = step?.caption ?? scene.recap;

  return (
    <div ref={rootRef} className={styles.scene} data-frozen={reduced ? "" : undefined}>
      <span className={`${styles.object} ${styles.wraps}`} data-part="wraps">
        <i className={`${shared.halo} ${styles.halo}`} />
        <SportIcon icon={scene.icons.wraps} size={120} />
      </span>
      <span className={`${styles.object} ${styles.bag}`} data-part="bag">
        <SportIcon icon={scene.icons.bag} size={150} />
      </span>
      <span className={`${styles.object} ${styles.gloves}`} data-part="gloves">
        <SportIcon icon={scene.icons.gloves} size={112} />
      </span>
      <SceneLegendView
        legendKey={legend.label}
        title={localize(caption.title, lang)}
        hint={localize(caption.hint, lang)}
        green
        words={scene.steps.map((s) => localize(s.word, lang))}
        on={legend.words}
      />
    </div>
  );
}
