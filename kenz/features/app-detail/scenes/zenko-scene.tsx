"use client";

/** Zenko : le curseur du budget glisse de 40 € à 25 €, et le matin, l'après-midi et le soir se recomposent (exemple). */
import type { CSSProperties } from "react";

import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./zenko-scene.module.css";

/** Le budget d'exemple : de 40 à 25. */
const AMOUNTS = Array.from({ length: 16 }, (_, i) => 40 - i);

/** Les trois moments : l'activité avant, la moins chère après (tracés), et la part du budget avant / après. */
const MOMENTS = [
  {
    key: "morning",
    before: "M5 16.5h14M4.5 16.5v-3.2l1.8-4.6a2 2 0 0 1 1.9-1.2h7.6a2 2 0 0 1 1.9 1.2l1.8 4.6v3.2M7 16.5v2M17 16.5v2M7.5 13h.01M16.5 13h.01",
    after: "M8.5 4.5c1.6 0 2.5 1.6 2.5 3.6S10 12 8.5 12 6 10.1 6 8.1s.9-3.6 2.5-3.6zM7.8 14.5h1.6M15.5 9.5c1.6 0 2.5 1.6 2.5 3.6S17 17 15.5 17 13 15.1 13 13.1s.9-3.6 2.5-3.6zM14.8 19.5h1.6",
    c1: 0.86,
    c2: 0.42,
  },
  {
    key: "afternoon",
    before: "M3.5 9 12 4.5 20.5 9M5.5 9.5v7M10 9.5v7M14 9.5v7M18.5 9.5v7M3.5 19.5h17",
    after: "M12 20.5V15M12 15c-3.6 0-5.5-2.3-5.5-5S8.9 4 12 4s5.5 3.3 5.5 6-1.9 5-5.5 5z",
    c1: 0.74,
    c2: 0.36,
  },
  {
    key: "evening",
    before: "M4 16.5h16M5.5 16.5a6.5 6.5 0 0 1 13 0M12 10V8M10.5 8h3M3.5 19.5h17",
    after: "M4 12.5h16a8 8 0 0 1-16 0zM13.5 4l-3 6.5M18 5l-5 5.5",
    c1: 0.92,
    c2: 0.5,
  },
] as const;

export function ZenkoScene() {
  const s = useTranslation().apps.scenes.zenko;
  // La devise autour du montant, selon la langue (« 40 € », « €40 ») : plus petite que le chiffre.
  const [before = "", after = ""] = s.amount.split("{n}");
  return (
    <>
      <div className={styles.budget}>
        <div className={styles.head}>
          <span className={styles.label}>{s.budget}</span>
          <span className={styles.value}>
            {before.trim() ? <small>{before.trim()}</small> : null}
            <span className={kit.rollW}>
              <span className={`${kit.roll} ${styles.roll}`} data-s="roll">
                {AMOUNTS.map((n) => (
                  <b key={n}>{n}</b>
                ))}
              </span>
            </span>
            {after.trim() ? <small>{after.trim()}</small> : null}
          </span>
        </div>
        <div className={styles.track}>
          <i className={styles.fill} data-s="fill" />
          <span className={styles.knobWrap} data-s="knob-wrap">
            <i className={styles.knob} data-s="knob" />
          </span>
        </div>
        <div className={styles.ends}>
          <span>{s.min}</span>
          <span>{s.max}</span>
        </div>
      </div>
      <ol className={styles.day}>
        {MOMENTS.map((m) => (
          <li key={m.key} className={styles.card} data-s="card" data-c1={m.c1} data-c2={m.c2} style={{ "--c2": m.c2 } as CSSProperties}>
            <span className={styles.act}>
              <svg className={`${styles.icon} ${styles.iconBefore}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-s="before">
                <path d={m.before} />
              </svg>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-s="after">
                <path d={m.after} />
              </svg>
            </span>
            <span className={styles.text}>
              <span className={styles.when}>{s[m.key]}</span>
              <span className={styles.cost}>
                <i data-s="cost" />
              </span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

export const buildZenko: SceneBuilder = (el) => {
  const roll = one(el, "roll");
  const fill = one(el, "fill");
  const knobWrap = one(el, "knob-wrap");
  const knob = one(el, "knob");
  const cards = all(el, "card");
  const before = all<SVGSVGElement>(el, "before");
  const after = all<SVGSVGElement>(el, "after");
  const costs = all(el, "cost");
  const share = (i: number, key: "c1" | "c2") => Number.parseFloat(cards[i]?.dataset[key] ?? "") || 0.6;
  gsap.set(roll, { y: 0, yPercent: 0 });
  gsap.set(fill, { scaleX: 0.8 });
  gsap.set(knobWrap, { x: 0, xPercent: 80 });
  gsap.set([...before, ...after], { transformPerspective: 240 });
  gsap.set(before, { opacity: 1, rotationX: 0 });
  gsap.set(after, { opacity: 0, rotationX: -90 });
  gsap.set(costs, { scaleX: (i: number) => share(i, "c1") });
  gsap.set(cards, { xPercent: (i: number) => [-3, 4, -2][i] ?? 0, rotation: (i: number) => [-1.4, 1.1, -0.7][i] ?? 0 });
  return gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(knob, { scale: 1.15, duration: 0.25, ease: "power2.out" }, 0.2)
    .to(knobWrap, { xPercent: 50, duration: 1.4, ease: "power2.inOut" }, 0.35)
    .to(fill, { scaleX: 0.5, duration: 1.4, ease: "power2.inOut" }, 0.35)
    .to(roll, { yPercent: -93.75, duration: 1.4, ease: "power2.inOut" }, 0.35)
    .to(knob, { scale: 1, duration: 0.4 }, 1.75)
    .to(cards, { xPercent: 0, rotation: 0, duration: 0.9, stagger: 0.12 }, 1.7)
    .to(before, { rotationX: 90, opacity: 0, duration: 0.24, ease: "power2.in", stagger: 0.14 }, 1.75)
    .to(after, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.14 }, 2)
    .to(costs, { scaleX: (i: number) => share(i, "c2"), duration: 1, stagger: 0.14 }, 1.9);
};

/** « Comment ça marche » de Zenko, monté autour de son écran (chargé à part : ./registry). */
export default function ZenkoChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildZenko} tint={styles.scene} sample={"bottom"}>
      <ZenkoScene />
    </HowItWorks>
  );
}
