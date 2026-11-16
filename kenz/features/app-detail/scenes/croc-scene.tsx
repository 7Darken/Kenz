"use client";

/** Croc : le matin « Je m'engage » se coche, le soir « Tenu » ; les jours se cochent et la série monte à 12 (exemple). */
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, Check, checkParts, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./croc-scene.module.css";

/** La série d'exemple : de 5 à 12 jours. */
const STREAK = [5, 6, 7, 8, 9, 10, 11, 12];

export function CrocScene() {
  const s = useTranslation().apps.scenes.croc;
  return (
    <>
      <div className={styles.top}>
        <svg className={styles.mascot} viewBox="0 0 60 60" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="crG" cx="38%" cy="30%" r="75%">
              <stop offset="0" stopColor="#CDBFFF" />
              <stop offset="1" stopColor="#7F69E6" />
            </radialGradient>
          </defs>
          <path d="M30 6C40 6 46 16 49 28c4 14 1 26-19 26S7 42 11 28C14 16 20 6 30 6z" fill="url(#crG)" />
          <ellipse cx="19.5" cy="38.5" rx="2.8" ry="1.5" fill="#F4A6C8" opacity=".55" />
          <ellipse cx="40.5" cy="38.5" rx="2.8" ry="1.5" fill="#F4A6C8" opacity=".55" />
          <circle cx="24" cy="33" r="2" fill="#1C1733" />
          <circle cx="36" cy="33" r="2" fill="#1C1733" />
          <path data-s="mouth-flat" d="M27 40.5h6" stroke="#1C1733" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0" />
          <path data-s="mouth-smile" d="M26 39.5q4 4 8 0" stroke="#1C1733" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
        <div className={styles.streak}>
          <span className={styles.streakLabel}>{s.streak}</span>
          <span className={styles.streakValue}>
            <span className={kit.rollW}>
              <span className={`${kit.roll} ${styles.roll}`} data-s="roll">
                {STREAK.map((n) => (
                  <b key={n}>{n}</b>
                ))}
              </span>
            </span>
            <span className={styles.streakUnit}>{s.days}</span>
          </span>
        </div>
      </div>
      <div className={styles.pact}>
        <div className={styles.pill}>
          <Check name="pact" />
          <div>
            <small>{s.morning}</small>
            <span>{s.commit}</span>
          </div>
        </div>
        <div className={styles.pill}>
          <Check name="pact" />
          <div>
            <small>{s.evening}</small>
            <span>{s.kept}</span>
          </div>
        </div>
      </div>
      <ol className={styles.week}>
        {s.week.split(" ").map((day, index) => (
          <li key={index}>
            <Check className={styles.dayCheck} name="day" />
            {day}
          </li>
        ))}
      </ol>
      <p className={styles.bravo} data-s="bravo">
        {s.bravo}
      </p>
    </>
  );
}

export const buildCroc: SceneBuilder = (el) => {
  const pacts = all(el, "pact");
  const days = all(el, "day");
  const roll = one(el, "roll");
  const flat = one<SVGPathElement>(el, "mouth-flat");
  const smile = one<SVGPathElement>(el, "mouth-smile");
  const bravo = one(el, "bravo");
  const checks = [...pacts, ...days].map(checkParts);
  gsap.set(checks.map((c) => c.fill), { scale: 0, opacity: 0 });
  gsap.set(checks.map((c) => c.mark), { strokeDashoffset: 1 });
  gsap.set(roll, { y: 0, yPercent: 0 });
  gsap.set(flat, { opacity: 1 });
  gsap.set(smile, { opacity: 0 });
  gsap.set(bravo, { opacity: 0, y: 10, filter: "blur(6px)" });
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  const check = (box: Element | undefined, t: number, duration = 0.6) => {
    if (!box) return;
    const { fill, mark } = checkParts(box);
    tl.to(fill, { scale: 1, opacity: 1, duration }, t).to(mark, { strokeDashoffset: 0, duration: duration * 0.8, ease: "power2.out" }, t + 0.12);
  };
  check(pacts[0], 0.3);
  check(pacts[1], 0.85);
  check(days[0], 1.3);
  tl.to(roll, { yPercent: -12.5, duration: 0.5 }, 1.35);
  for (let k = 1; k < 7; k++) {
    const t = 1.55 + k * 0.2;
    check(days[k], t, 0.45);
    tl.to(roll, { yPercent: -12.5 * (k + 1), duration: 0.45 }, t + 0.05);
  }
  return tl
    .to(flat, { opacity: 0, duration: 0.2 }, 3)
    .to(smile, { opacity: 1, duration: 0.3 }, 3)
    .to(bravo, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 3.05);
};

/** « Comment ça marche » de Croc, monté autour de son écran (chargé à part : ./registry). */
export default function CrocChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildCroc} tint={styles.scene} sample={"bottom"}>
      <CrocScene />
    </HowItWorks>
  );
}
