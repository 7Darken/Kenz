/**
 * Temps 1 : le mur de post-it de pitchs (couleurs douces, de travers, un pictogramme d'idée chacun, aucun nom),
 * les avatars anonymes des équipes, et le faisceau du projecteur. Le nôtre porte le symbole d'Escapades Libres.
 */
import type { CSSProperties } from "react";

import { ArcsMark } from "./escapades-symbol";
import styles from "./victoire.module.css";
import { OURS, PICTOS, WALL } from "./victoire-geometry";

const pct = (v: number) => `${v.toFixed(2)}%`;

export function CrowdWall({ label }: { label: string }) {
  return (
    <div className={styles.wall} role="img" aria-label={label} data-kv="wall">
      {WALL.postIts.map((p, n) => (
        <i
          key={n}
          className={n === OURS ? `${styles.pi} ${styles.ours}` : styles.pi}
          data-kv="post-it"
          style={{ left: pct(p.x), top: pct(p.y), "--r": `${p.rotation.toFixed(1)}deg`, "--t": p.tint } as CSSProperties}
        >
          <b className={styles.piIn}>
            {n === OURS ? (
              <ArcsMark className={styles.mark} />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={PICTOS[p.picto]} />
              </svg>
            )}
          </b>
        </i>
      ))}
      {WALL.avatars.map((a, n) => (
        <i
          key={n}
          className={a.team === OURS ? `${styles.av} ${styles.avOurs}` : styles.av}
          data-kv="avatar"
          data-ours={a.team === OURS ? "" : undefined}
          style={{ left: pct(a.x), top: pct(a.y), "--c": a.tint } as CSSProperties}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <circle cx="10" cy="7.6" r="3.3" />
            <path d="M3.8 17.2c1-3.7 3.4-5.4 6.2-5.4s5.2 1.7 6.2 5.4" />
          </svg>
        </i>
      ))}
      <span className={styles.beam} aria-hidden="true" data-kv="beam">
        <i className={styles.beamCone} data-kv="beam-cone" />
      </span>
    </div>
  );
}
