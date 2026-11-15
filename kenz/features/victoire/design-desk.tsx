/**
 * Temps 2 : la scène du rôle, en trois images qui se changent l'une en l'autre, dans une fenêtre de navigateur :
 * la bulle de la cliente (et l'oreille), la table de travail d'un outil de design (trois vraies maquettes,
 * la sélection, le panneau de styles, le curseur), puis la vraie plateforme en ligne.
 */
import Image from "next/image";

import type { PlatformArtboard } from "@/content/startup-weekend";
import type { HexColor, ImageAsset } from "@/content/types";
import styles from "./victoire.module.css";

interface DesignDeskProps {
  host: string;
  artboards: readonly { name: string; image: PlatformArtboard["image"] }[];
  selectionSize: string;
  swatches: readonly HexColor[];
  /** La couleur du projet : sa pastille s'allume quand la maquette est choisie. */
  accent: HexColor;
  typeface: string;
  live: ImageAsset;
  liveAlt: string;
  quote: string;
  labels: { colors: string; text: string };
}

export function DesignDesk({ host, artboards, selectionSize, swatches, accent, typeface, live, liveAlt, quote, labels }: DesignDeskProps) {
  const [home] = artboards;
  return (
    <div className={styles.scene} data-kv="scene">
      <i className={styles.sceneShadow} aria-hidden="true" data-kv="scene-shadow" />
      <div className={styles.bar} aria-hidden="true" data-kv="bar">
        <i />
        <i />
        <i />
        <span className={styles.url}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true" focusable="false">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
          </svg>
          <span>{host}</span>
        </span>
      </div>
      <div className={styles.view} data-kv="view">
        {/* La table de travail d'un outil de design (sans marque) */}
        <div className={styles.desk} aria-hidden="true" data-kv="desk">
          {artboards.map((board, index) => (
            <span key={board.image.src} className={`${styles.ab} ${[styles.ab1, styles.ab2, styles.ab3][index]}`} data-kv="artboard">
              <span className={styles.abName}>{board.name}</span>
              <Image src={board.image.src} width={board.image.width} height={board.image.height} alt="" sizes="(min-width: 900px) 140px, 20vw" />
            </span>
          ))}
          <i className={styles.guide} data-kv="guide" />
          <span className={styles.sel} data-kv="selection">
            <i />
            <i />
            <i />
            <i />
            <b className={styles.selDim}>{selectionSize}</b>
          </span>
          <span className={styles.panel} data-kv="panel">
            <b className={styles.panelTitle}>{labels.colors}</b>
            {swatches.map((color) => (
              <span
                key={color}
                className={color === accent ? `${styles.swatch} ${styles.swatchOr}` : styles.swatch}
                data-kv={color === accent ? "swatch-or" : undefined}
              >
                <i style={{ background: color }} />
                {color}
              </span>
            ))}
            <b className={styles.panelTitle}>{labels.text}</b>
            <span className={styles.type}>
              <b>Aa</b>
              {typeface}
            </span>
          </span>
          <span className={styles.cursor} data-kv="cursor">
            <svg className={styles.cursorIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-kv="cursor-icon">
              <path d="M5 3l14 8.2-6.3 1.5L9.2 19z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {/* La maquette choisie s'ouvre et devient la vraie plateforme */}
        <div className={styles.grow} data-kv="grow">
          {home ? (
            <Image className={styles.growMock} src={home.image.src} width={home.image.width} height={home.image.height} alt="" sizes="(min-width: 900px) 140px, 20vw" data-kv="grow-mock" />
          ) : null}
          <Image className={styles.shot} src={live.src} width={live.width} height={live.height} alt={liveAlt} sizes="(min-width: 900px) 48vw, 100vw" data-kv="shot" />
        </div>
        <figure className={styles.bubble} data-kv="bubble">
          <blockquote className={styles.quote}>
            <p>{quote}</p>
          </blockquote>
          <svg className={styles.ear} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-kv="ear">
            <path pathLength={1} d="M13 19.5C13 11.5 19 6 26 6s13 5.5 13 13.5c0 6.3-3.5 9.3-6.2 11.6-2.3 2-3.5 3.8-3.5 7.2 0 4.3-3.4 7.7-7.6 7.7-3.4 0-6.3-2.2-7.3-5.3" />
            <path pathLength={1} d="M19.5 19.5c0-4 2.9-7 6.5-7s6.5 3 6.5 7c0 2.8-1.5 4.3-3 5.6" />
            <path pathLength={1} d="M6 15c-1.4 2.6-1.4 6.4 0 9M2.6 12.4c-2.6 4.4-2.6 9.8 0 14.2" />
          </svg>
        </figure>
      </div>
    </div>
  );
}
