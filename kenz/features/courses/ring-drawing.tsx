/** Le ring, dessiné au trait (une course sans photo : la boxe). Les traits se tracent à l'entrée (CSS). */
import styles from "./courses.module.css";

const CORNERS = [
  [28, 28],
  [160, 28],
  [28, 160],
  [160, 160],
] as const;

export function RingDrawing() {
  return (
    <svg className={styles.drawing} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <rect x="34" y="34" width="132" height="132" rx="3" pathLength={1} />
      <rect x="44" y="44" width="112" height="112" rx="2" pathLength={1} />
      <rect x="54" y="54" width="92" height="92" rx="2" pathLength={1} />
      {CORNERS.map(([x, y]) => (
        <rect key={`${x}-${y}`} className={styles.accent} x={x} y={y} width="12" height="12" rx="2" pathLength={1} />
      ))}
    </svg>
  );
}
