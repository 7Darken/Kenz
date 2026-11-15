"use client";

/**
 * HYROX : la formule (1 km + 1 station, × 8) qui se replie en une boucle de 8 stations, en icônes 3D.
 * Le balisage est rendu ici ; le mouvement est écrit par ./hyrox-driver. Un clic sur une station montre son nom.
 * Mouvement réduit : la formule en une ligne au-dessus, la boucle posée.
 */
import { useRef, useState } from "react";

import type { HyroxScene as HyroxSceneData } from "@/content/courses";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { createHyroxDriver } from "./hyrox-driver";
import styles from "./hyrox-scene.module.css";
import shared from "./scene.module.css";
import { SportIcon } from "./sport-icon";
import { useSceneDriver } from "./use-scene-driver";

interface HyroxSceneProps {
  scene: HyroxSceneData;
  running: boolean;
  reduced: boolean;
}

/** Cette scène n'a pas de légende changeante. */
const noLegend = () => {};

export function HyroxScene({ scene, running, reduced }: HyroxSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const [named, setNamed] = useState<number | null>(null);
  useSceneDriver(rootRef, createHyroxDriver, noLegend, running, reduced);

  const stationValue = localize(scene.station.value, lang);

  return (
    <div ref={rootRef} className={styles.scene} data-frozen={reduced ? "" : undefined}>
      <p className={styles.formulaStatic}>
        {scene.run.value} <span>+</span> {stationValue} <em>{scene.times}</em>
      </p>
      <svg className={styles.svg} data-part="svg" focusable="false">
        <path className={styles.ring} pathLength={1} data-part="ring" />
        <path className={styles.ringDone} pathLength={1} data-part="done" />
        <path className={styles.trail} pathLength={1} data-part="trail" />
        <path className={`${styles.trail} ${styles.trailLive}`} pathLength={1} data-part="trail" />
      </svg>

      <div className={styles.formula} data-part="formula">
        <div className={`${styles.kf} ${styles.run}`} data-part="run">
          <span className={styles.runIcon}>
            <SportIcon icon={scene.run.icon} size={72} />
          </span>
          <span className={styles.kfText} data-part="run-text">
            <b>{scene.run.value}</b>
            <small>{localize(scene.run.label, lang)}</small>
          </span>
        </div>
        <span className={`${styles.kf} ${styles.plus}`} data-part="plus">
          +
        </span>
        <div className={`${styles.kf} ${styles.station}`} data-part="station-card">
          <span className={styles.card} data-part="card">
            {scene.stations.map((station) => (
              <span key={station.icon.src} className={styles.slot} data-part="slot">
                <SportIcon icon={station.icon} size={64} />
              </span>
            ))}
          </span>
          <span className={`${styles.kfText} ${styles.kfTextCenter}`} data-part="station-text">
            <b>{stationValue}</b>
            <small>{localize(scene.station.label, lang)}</small>
          </span>
        </div>
        <span className={`${styles.kf} ${styles.times}`} data-part="times">
          <i className={`${shared.halo} ${styles.timesHalo}`} data-part="times-halo" />
          <b>{scene.times}</b>
        </span>
      </div>

      <div className={styles.core} data-part="core">
        <b>{localize(scene.loop.value, lang)}</b>
        <small>{localize(scene.loop.label, lang)}</small>
      </div>

      {scene.stations.map((station, k) => (
        <span
          key={station.icon.src}
          className={styles.post}
          data-part="post"
          data-named={named === k ? "" : undefined}
          onClick={() => setNamed((current) => (current === k ? null : k))}
        >
          <i className={`${shared.halo} ${styles.postHalo}`} />
          <SportIcon icon={station.icon} size={44} />
          <span className={styles.postName}>{localize(station.name, lang)}</span>
        </span>
      ))}
      <span className={styles.arch} data-part="arch">
        <SportIcon icon={scene.finish} size={52} />
      </span>
      <i className={`${shared.point} ${styles.point}`} data-part="point" />
    </div>
  );
}
