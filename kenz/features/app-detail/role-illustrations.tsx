/**
 * Les quatre dessins de « Mon rôle » (Escapades Libres), au trait fin, dans le langage de la séquence
 * « 54 heures » : la bulle de la cliente, la ligne qui coince sous la loupe, la table de travail du design,
 * la vraie plateforme dans une fenêtre et ses 24 heures. `or` : la lumière du projet. Décoratifs.
 */
import type { ReactNode } from "react";

import styles from "./ai-chapter.module.css";

/** J'écoute la cliente : sa bulle (son besoin, dans ses mots), et une oreille. */
const LISTEN = (
  <>
    <path d="M20 14h78a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H50L38 76V64H20a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10z" />
    <path className={styles.or} d="M24 32h66M24 45h44" />
    <g transform="translate(70 70) scale(.86)">
      <path d="M13 19.5C13 11.5 19 6 26 6s13 5.5 13 13.5c0 6.3-3.5 9.3-6.2 11.6-2.3 2-3.5 3.8-3.5 7.2 0 4.3-3.4 7.7-7.6 7.7-3.4 0-6.3-2.2-7.3-5.3" />
      <path d="M19.5 19.5c0-4 2.9-7 6.5-7s6.5 3 6.5 7c0 2.8-1.5 4.3-3 5.6" />
      <path className={styles.or} d="M6 15c-1.4 2.6-1.4 6.4 0 9M2.6 12.4c-2.6 4.4-2.6 9.8 0 14.2" />
    </g>
  </>
);

/** Je comprends son problème : la ligne qui coince, sous la loupe. */
const UNDERSTAND = (
  <>
    <rect x="14" y="14" width="70" height="90" rx="9" />
    <path d="M26 32h46M26 46h30M26 76h44M26 90h24" />
    <path className={styles.or} d="M26 61h40" strokeWidth="3" />
    <circle className={styles.or} cx="76" cy="62" r="18" />
    <path className={styles.or} d="M89 75l18 18" strokeWidth="3.2" />
  </>
);

/** Je conçois : trois plans, la sélection et ses dimensions, le panneau de styles. */
const DESIGN = (
  <>
    <path d="M10 28h10M36 28h8M62 28h9" />
    <rect x="10" y="34" width="20" height="44" rx="2" />
    <rect x="36" y="34" width="20" height="44" rx="2" />
    <rect x="62" y="34" width="20" height="44" rx="2" />
    <path className={styles.or} d="M3 34h84" strokeDasharray="2 3" strokeWidth="1" />
    <rect className={styles.or} x="8" y="32" width="24" height="48" rx="1" />
    <rect className={styles.orFill} x="6.5" y="30.5" width="3" height="3" />
    <rect className={styles.orFill} x="30.5" y="30.5" width="3" height="3" />
    <rect className={styles.orFill} x="6.5" y="78.5" width="3" height="3" />
    <rect className={styles.orFill} x="30.5" y="78.5" width="3" height="3" />
    <rect className={styles.orFill} x="11" y="86" width="18" height="6" rx="2" />
    <rect x="92" y="16" width="22" height="88" rx="5" />
    <rect className={styles.ink} x="97" y="25" width="6" height="6" rx="1.5" />
    <rect className={styles.orFill} x="97" y="37" width="6" height="6" rx="1.5" />
    <path d="M106 28h4M106 40h4" />
    <text x="103" y="62" textAnchor="middle">
      Aa
    </text>
    <path className={styles.ink} d="M24 54l10.5 5.6-4.4 1.2-2.3 4.6z" />
  </>
);

/** Je développe un premier MVP en 24 heures : la vraie plateforme dans une fenêtre, et les 24 heures. */
const BUILD = (
  <>
    <rect x="8" y="20" width="90" height="64" rx="7" />
    <path d="M8 32h90" />
    <circle className={styles.ink} cx="16" cy="26" r="1.6" />
    <circle className={styles.ink} cx="22" cy="26" r="1.6" />
    <circle className={styles.ink} cx="28" cy="26" r="1.6" />
    <path d="M16 46h26" strokeWidth="3" />
    <path d="M16 55h20" />
    <rect className={styles.or} x="16" y="63" width="16" height="6" rx="3" />
    <circle cx="74" cy="57" r="15" />
    <path d="M59 57h30M74 42c-6.5 8.5-6.5 21.5 0 30M74 42c6.5 8.5 6.5 21.5 0 30" />
    <text x="8" y="104">
      24 h
    </text>
    <path className={styles.or} d="M34 100.5h64" strokeWidth="2" />
  </>
);

const ROLE_ILLUSTRATIONS: readonly ReactNode[] = [LISTEN, UNDERSTAND, DESIGN, BUILD];

export function RoleIllustration({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {ROLE_ILLUSTRATIONS[index]}
    </svg>
  );
}
