"use client";

/** Wado : une assiette est scannée, les macros apparaissent, puis l'anneau de la journée se remplit (exemple). */
import { gsap } from "@/features/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, one, type SceneBuilder } from "./scene-kit";
import styles from "./wado-scene.module.css";

/** Les valeurs d'exemple. */
const MACROS = [
  ["protein", "38 g"],
  ["carbs", "62 g"],
  ["fat", "14 g"],
] as const;

export function WadoScene() {
  const s = useTranslation().apps.scenes.wado;
  return (
    <>
      <div className={styles.plate}>
        <svg className={styles.food} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <circle cx="100" cy="106" r="95" fill="#04100A" opacity=".5" />
          <circle cx="100" cy="100" r="94" fill="#E6E0D2" />
          <circle cx="100" cy="100" r="78" fill="#F4F0E6" />
          <path d="M44 104C40 80 62 64 84 68c20 4 26 26 18 44-8 18-50 18-58-8z" fill="#FFFDF7" />
          <g fill="#E8E1D0">
            <ellipse cx="62" cy="88" rx="3" ry="1.4" transform="rotate(-20 62 88)" />
            <ellipse cx="74" cy="96" rx="3" ry="1.4" transform="rotate(30 74 96)" />
            <ellipse cx="58" cy="104" rx="3" ry="1.4" transform="rotate(10 58 104)" />
            <ellipse cx="84" cy="84" rx="3" ry="1.4" transform="rotate(-40 84 84)" />
            <ellipse cx="70" cy="112" rx="3" ry="1.4" transform="rotate(-10 70 112)" />
          </g>
          <g transform="rotate(-14 134 84)">
            <rect x="104" y="68" width="60" height="34" rx="15" fill="#F28E6C" />
            <path d="M118 72c4 8 4 18 0 26M132 70c4 9 4 21 0 30M146 71c4 9 4 20 0 29" stroke="#FFC4AA" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
          </g>
          <circle cx="122" cy="132" r="15" fill="#4E9C5C" />
          <circle cx="142" cy="124" r="12" fill="#68B46C" />
          <circle cx="134" cy="147" r="11" fill="#3F8A4E" />
          <circle cx="153" cy="141" r="9" fill="#5BAA60" />
          <g transform="rotate(-24 80 146)">
            <ellipse cx="80" cy="146" rx="22" ry="12" fill="#BFD776" />
            <ellipse cx="80" cy="146" rx="15" ry="7.5" fill="#E7EFAE" />
          </g>
          <g fill="#2B2B2B" opacity=".5">
            <ellipse cx="122" cy="80" rx="1.6" ry=".8" />
            <ellipse cx="138" cy="86" rx="1.6" ry=".8" transform="rotate(30 138 86)" />
            <ellipse cx="150" cy="78" rx="1.6" ry=".8" />
          </g>
        </svg>
        <span className={styles.scan} aria-hidden="true">
          <span className={styles.sweep} data-s="sweep" />
        </span>
        <i className={`${styles.br} ${styles.brA}`} data-s="bracket" />
        <i className={`${styles.br} ${styles.brB}`} data-s="bracket" />
        <i className={`${styles.br} ${styles.brC}`} data-s="bracket" />
        <i className={`${styles.br} ${styles.brD}`} data-s="bracket" />
      </div>
      <ul className={styles.pills}>
        {MACROS.map(([key, value]) => (
          <li key={key} data-s="pill">
            <span>{s[key]}</span>
            <b className={kit.slit}>
              <span className={kit.num} data-s="value">
                {value}
              </span>
            </b>
          </li>
        ))}
        <li className={styles.kcal} data-s="pill">
          <b className={kit.slit}>
            <span className={kit.num} data-s="value">
              ≈ 520 <small>kcal</small>
            </span>
          </b>
        </li>
      </ul>
      <div className={styles.ring}>
        <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
          <circle className={styles.ringBg} cx="22" cy="22" r="18" />
          <circle className={styles.ringFg} cx="22" cy="22" r="18" pathLength={1} data-s="ring" />
        </svg>
        <span>{s.day}</span>
      </div>
    </>
  );
}

export const buildWado: SceneBuilder = (el) => {
  const brackets = all(el, "bracket");
  const sweep = one(el, "sweep");
  const pills = all(el, "pill");
  const values = all(el, "value");
  const ring = one<SVGCircleElement>(el, "ring");
  const corners = [
    [-45, -45],
    [45, -45],
    [-45, 45],
    [45, 45],
  ];
  gsap.set(brackets, { opacity: 0, xPercent: (i: number) => corners[i]?.[0] ?? 0, yPercent: (i: number) => corners[i]?.[1] ?? 0 });
  gsap.set(sweep, { y: 0, yPercent: -100, opacity: 1 });
  gsap.set(pills, { opacity: 0, y: 14, scale: 0.965 });
  gsap.set(values, { yPercent: 110 });
  gsap.set(ring, { strokeDashoffset: 0.66 });
  return gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(brackets, { opacity: 1, xPercent: 0, yPercent: 0, duration: 0.8, stagger: 0.04 }, 0.1)
    .to(sweep, { yPercent: 0, duration: 1.1, ease: "power2.inOut" }, 0.55)
    .to(sweep, { opacity: 0, duration: 0.35, ease: "power2.out" }, 1.65)
    .to(brackets, { opacity: 0.35, duration: 0.5 }, 1.7)
    .to(pills, { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12 }, 1.7)
    .to(values, { yPercent: 0, duration: 1, stagger: 0.12 }, 1.8)
    .to(ring, { strokeDashoffset: 0.24, duration: 1.3, ease: "power2.out" }, 2.35);
};
