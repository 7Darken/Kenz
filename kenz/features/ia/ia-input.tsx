/**
 * L'entrée réelle d'un cas, dessinée (maquettes/v6/shared/ia.js, `ENTREE`) : des formes, aucune donnée.
 * `shown` : l'entrée est à l'écran (la barre de lecture de la vidéo avance) ; `read` : la machine la lit
 * (un liseré de lumière) ; `compact` : la taille de l'aperçu.
 */
import { useId, type CSSProperties } from "react";

import type { IaInputDrawing } from "@/content/ia";
import { IaPictogram } from "./ia-picto";
import styles from "./ia-input.module.css";

interface IaInputProps {
  drawing: IaInputDrawing;
  shown: boolean;
  read: boolean;
  compact: boolean;
}

const flag = (on: boolean) => (on ? "" : undefined);

export function IaInput({ drawing, shown, read, compact }: IaInputProps) {
  const attrs = { "data-shown": flag(shown), "data-read": flag(read), "data-compact": flag(compact) };
  switch (drawing) {
    case "recipeVideo":
      return (
        <div className={`${styles.input} ${styles.video}`} {...attrs}>
          <RecipeVideo />
        </div>
      );
    case "plate":
      return (
        <div className={`${styles.input} ${styles.plate}`} {...attrs}>
          <Plate />
        </div>
      );
    case "rushes":
      return (
        <div className={`${styles.input} ${styles.loose}`} {...attrs}>
          <Rushes />
        </div>
      );
    case "notes":
      return (
        <div className={`${styles.input} ${styles.loose}`} {...attrs}>
          <Notes />
        </div>
      );
  }
}

/** Les dégradés SVG ont besoin d'ids uniques sur la page (aperçu et page complète peuvent coexister). */
function useSvgId() {
  return `ia${useId().replace(/[^\w-]/g, "")}`;
}

/** Une vidéo courte de recette : l'assiette vue de haut, les icônes du réseau, la barre de lecture. */
function RecipeVideo() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}t`} cx="50%" cy="40%" r="72%">
          <stop offset="0" stopColor="#6A4E3A" />
          <stop offset="1" stopColor="#1F1712" />
        </radialGradient>
        <radialGradient id={`${id}s`} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FCEBC0" />
          <stop offset="1" stopColor="#E4BC6E" />
        </radialGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".62" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".55" />
        </linearGradient>
      </defs>
      <rect width="90" height="160" fill={`url(#${id}t)`} />
      <ellipse cx="46" cy="71" rx="40" ry="37" fill="#140F0B" opacity=".45" />
      <circle cx="45" cy="66" r="37" fill="#EDE5D8" />
      <circle cx="45" cy="66" r="29" fill="#F8F3EB" />
      <circle cx="45" cy="66" r="24" fill={`url(#${id}s)`} />
      <g fill="none" stroke="#F7DC94" strokeWidth="2.4" strokeLinecap="round">
        <path d="M28 60c6-8 16-8 20 0s12 10 18 2" />
        <path d="M26 70c8-6 14 4 22-2s14-8 18 0" />
        <path d="M32 78c6-4 12 4 18-1s10-5 14 1" />
        <path d="M34 52c4-4 10-4 14 0s10 4 12 1" />
      </g>
      <g transform="translate(60 53)">
        <circle r="8.5" fill="#F2CF3A" />
        <circle r="7" fill="#FBE68A" />
        <path d="M0 0V-7M0 0L6-3.5M0 0L6 3.5M0 0V7M0 0L-6 3.5M0 0L-6-3.5" stroke="#F2CF3A" strokeWidth=".9" />
      </g>
      <ellipse cx="33" cy="58" rx="5.4" ry="2.6" fill="#5C8F45" transform="rotate(-35 33 58)" />
      <ellipse cx="38" cy="54.5" rx="4.4" ry="2.2" fill="#76A85A" transform="rotate(20 38 54.5)" />
      <rect width="90" height="160" fill={`url(#${id}v)`} />
      <g fill="#fff">
        <path d="M80 112.5s-4.4-2.8-4.4-6.3a2.5 2.5 0 0 1 4.4-1.6 2.5 2.5 0 0 1 4.4 1.6c0 3.5-4.4 6.3-4.4 6.3z" />
        <path d="M81 120l4.4 4-4.4 4v-2.5c-2.8 0-4.4.8-5.6 2.8.3-3.1 1.9-5.3 5.6-5.8z" />
      </g>
      <rect x="7" y="138" width="44" height="3" rx="1.5" fill="#fff" opacity=".9" />
      <rect x="7" y="145" width="30" height="3" rx="1.5" fill="#fff" opacity=".55" />
      <rect x="5" y="153" width="80" height="1.6" rx=".8" fill="#fff" opacity=".3" />
      <rect className={styles.playhead} x="5" y="153" width="80" height="1.6" rx=".8" fill="#fff" />
    </svg>
  );
}

/** La photo d'un plat, avec le cadre de visée. */
function Plate() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <rect width="200" height="200" rx="18" fill="#2B3A33" />
      <circle cx="100" cy="106" r="80" fill="#04100A" opacity=".45" />
      <circle cx="100" cy="100" r="79" fill="#E6E0D2" />
      <circle cx="100" cy="100" r="65" fill="#F4F0E6" />
      <path d="M53 103C50 83 68 70 86 73c17 3 22 22 15 37-7 15-42 15-48-7z" fill="#FFFDF7" />
      <g transform="rotate(-14 130 86)">
        <rect x="104" y="72" width="52" height="29" rx="13" fill="#F28E6C" />
        <path
          d="M116 76c3 7 3 15 0 22M128 74c4 8 4 18 0 26M140 75c3 8 3 17 0 25"
          stroke="#FFC4AA"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          opacity=".85"
        />
      </g>
      <circle cx="120" cy="128" r="13" fill="#4E9C5C" />
      <circle cx="137" cy="121" r="10" fill="#68B46C" />
      <circle cx="130" cy="141" r="9.5" fill="#3F8A4E" />
      <circle cx="147" cy="135" r="8" fill="#5BAA60" />
      <g transform="rotate(-24 82 140)">
        <ellipse cx="82" cy="140" rx="19" ry="10" fill="#BFD776" />
        <ellipse cx="82" cy="140" rx="13" ry="6.4" fill="#E7EFAE" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".92">
        <path d="M14 40V22a8 8 0 0 1 8-8h18M160 14h18a8 8 0 0 1 8 8v18M186 160v18a8 8 0 0 1-8 8h-18M40 186H22a8 8 0 0 1-8-8v-18" />
      </g>
    </svg>
  );
}

/** Trois rushs (rotation, position en %) et une idée notée. */
const CLIPS = [
  { r: -7, x: 0, y: 0 },
  { r: 5, x: 14, y: 30 },
  { r: -3, x: 4, y: 60 },
] as const;

function Rushes() {
  return (
    <>
      {CLIPS.map(({ r, x, y }) => (
        <span key={y} className={styles.clip} style={{ "--r": `${r}deg`, "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}>
          <svg viewBox="0 0 120 70" aria-hidden="true" focusable="false">
            <rect width="120" height="70" rx="9" fill="#1E2433" />
            <path d="M53 26v18l15-9z" fill="#F4EFE6" opacity=".9" />
            <path
              d="M10 58h4M17 54v8M22 56v4M27 52v12M32 55v6M37 57v2M42 53v10M47 56v4M52 58h3M60 55v6M65 52v12M70 56v4M75 54v8M80 57v2M85 55v6M90 53v10M95 56v4M100 58h4M108 55v6"
              stroke="#9DB8FF"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity=".75"
            />
          </svg>
        </span>
      ))}
      <span className={styles.idea}>
        <IaPictogram name="ampoule" />
        <i />
        <i />
      </span>
    </>
  );
}

/** Des notes en vrac (largeur des lignes en %) et une demande en bulle. */
const NOTES = [
  { variant: "a", r: -6, lines: [82, 64, 74, 40] },
  { variant: "b", r: 4, lines: [70, 88, 52] },
] as const;
const LAST_NOTE = { variant: "c", r: -2, lines: [60, 76, 48] } as const;

function Note({ variant, r, lines }: { variant: "a" | "b" | "c"; r: number; lines: readonly number[] }) {
  return (
    <span className={`${styles.note} ${styles[`note-${variant}`]}`} style={{ "--r": `${r}deg` } as CSSProperties}>
      {lines.map((width, index) => (
        <i key={index} style={{ width: `${width}%` }} />
      ))}
    </span>
  );
}

function Notes() {
  return (
    <>
      {NOTES.map((note) => (
        <Note key={note.variant} {...note} />
      ))}
      <span className={styles.bubble}>
        <i style={{ width: "78%" }} />
        <i style={{ width: "52%" }} />
      </span>
      <Note {...LAST_NOTE} />
    </>
  );
}
