"use client";

/**
 * La mini-animation de Zenko, au format téléphone (shared/apps.js, SC.zenko) : le budget glisse de 40 à 25,
 * la journée se recompose avec des activités moins chères. Données d'exemple ; décorative (la fiche est aria-hidden).
 * État final dans le CSS ; ./zenko-timeline pose l'état de départ et joue vers lui.
 */
import type { CSSProperties } from "react";

import { useTranslation } from "@/i18n/language-provider";
import styles from "./zenko-scene.module.css";

/** Les valeurs du rouleau, de 40 à 25 (le rouleau finit sur 25). */
const BUDGET = Array.from({ length: 16 }, (_, i) => 40 - i);

/** Trois moments : la part du budget avant / après, l'activité avant / après (pictos au trait). */
const DAY = [
  {
    when: "morning",
    before: 0.86,
    after: 0.42,
    icons: [
      "M5 16.5h14M4.5 16.5v-3.2l1.8-4.6a2 2 0 0 1 1.9-1.2h7.6a2 2 0 0 1 1.9 1.2l1.8 4.6v3.2M7 16.5v2M17 16.5v2M7.5 13h.01M16.5 13h.01",
      "M8.5 4.5c1.6 0 2.5 1.6 2.5 3.6S10 12 8.5 12 6 10.1 6 8.1s.9-3.6 2.5-3.6zM7.8 14.5h1.6M15.5 9.5c1.6 0 2.5 1.6 2.5 3.6S17 17 15.5 17 13 15.1 13 13.1s.9-3.6 2.5-3.6zM14.8 19.5h1.6",
    ],
  },
  {
    when: "afternoon",
    before: 0.74,
    after: 0.36,
    icons: [
      "M3.5 9 12 4.5 20.5 9M5.5 9.5v7M10 9.5v7M14 9.5v7M18.5 9.5v7M3.5 19.5h17",
      "M12 20.5V15M12 15c-3.6 0-5.5-2.3-5.5-5S8.9 4 12 4s5.5 3.3 5.5 6-1.9 5-5.5 5z",
    ],
  },
  {
    when: "evening",
    before: 0.92,
    after: 0.5,
    icons: [
      "M4 16.5h16M5.5 16.5a6.5 6.5 0 0 1 13 0M12 10V8M10.5 8h3M3.5 19.5h17",
      "M4 12.5h16a8 8 0 0 1-16 0zM13.5 4l-3 6.5M18 5l-5 5.5",
    ],
  },
] as const;

export function ZenkoScene() {
  const s = useTranslation().pro.space.scene;
  const [before, after = ""] = s.amount.split("{n}");

  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.col}>
        <div>
          <div className={styles.head}>
            <span className={styles.label}>{s.budget}</span>
            <span className={styles.value}>
              {before.trim() ? <small>{before.trim()}</small> : null}
              <span className={styles.rollWindow}>
                <span className={styles.roll} data-zk-roll="">
                  {BUDGET.map((n) => (
                    <b key={n}>{n}</b>
                  ))}
                </span>
              </span>
              {after.trim() ? <small>{after.trim()}</small> : null}
            </span>
          </div>
          <div className={styles.track}>
            <i className={styles.fill} data-zk-fill="" />
            <span className={styles.knobWrap} data-zk-knobwrap="">
              <i className={styles.knob} data-zk-knob="" />
            </span>
          </div>
          <div className={styles.ends}>
            <span>{s.min}</span>
            <span>{s.max}</span>
          </div>
        </div>
        <ol className={styles.day}>
          {DAY.map((moment) => (
            <li
              key={moment.when}
              className={styles.card}
              data-zk-card=""
              data-before={moment.before}
              data-after={moment.after}
              style={{ "--c2": moment.after } as CSSProperties}
            >
              <span className={styles.act}>
                {moment.icons.map((d, i) => (
                  <svg
                    key={d}
                    className={`${styles.icon} ${i === 0 ? styles.iconBefore : ""}`}
                    data-zk-icon={i === 0 ? "before" : "after"}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={d} />
                  </svg>
                ))}
              </span>
              <span className={styles.txt}>
                <span className={styles.when}>{s[moment.when]}</span>
                <span className={styles.cost}>
                  <i data-zk-cost="" />
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <span className={styles.example}>{s.example}</span>
    </div>
  );
}
