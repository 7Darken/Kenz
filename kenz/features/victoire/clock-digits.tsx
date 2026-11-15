/**
 * Les chiffres du compteur « HH:MM:SS » (Melodrama), chacun dans sa case. Décoratif : le compteur est lu
 * une fois par sa phrase (« 54 heures, du vendredi au dimanche. »). Le défilement les met à jour en direct.
 */
import type { CSSProperties } from "react";

import styles from "./victoire.module.css";
import { clockDigits } from "./victoire-timelines";

export function ClockDigits({ seconds }: { seconds: number }) {
  const digits = clockDigits(seconds);
  const parts = [];
  let n = 0;
  for (let x = 0; x < 8; x++) {
    if (x === 2 || x === 5) {
      parts.push(
        <span key={x} className={styles.sep} data-kv="sep">
          :
        </span>,
      );
      continue;
    }
    const digit = digits[n];
    parts.push(
      <span key={x} className={styles.slot} data-z={digit === "0" ? "" : undefined}>
        <span className={styles.dg} data-kv="dg" style={{ "--i": n } as CSSProperties}>
          {digit}
        </span>
      </span>,
    );
    n++;
  }
  return <>{parts}</>;
}

/** Un petit compteur, en tête d'un temps (mode « à la suite ») ; caché, mais garde sa place, en mode épinglé. */
export function MiniClock({ seconds }: { seconds: number }) {
  return (
    <div className={styles.mini} aria-hidden="true" data-kv="mini">
      <ClockDigits seconds={seconds} />
    </div>
  );
}
