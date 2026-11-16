"use client";

/**
 * Escapades Libres : les 12 phrases du test se remplissent, une réponse est choisie ; le profil « Aventurier »
 * (l'un des six du site) apparaît, puis rejoint un petit groupe ; le voyage se trace et l'agence coche le reste.
 */
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import { all, Check, checkParts, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./escapades-scene.module.css";

const PIN = (
  <>
    <path pathLength={1} d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle pathLength={1} cx="12" cy="10" r="2.4" />
  </>
);
const PLANE = (
  <>
    <path d="M20.5 4 3.5 11l6.5 2.5L12.5 20z" />
    <path d="M10 13.5 20.5 4" />
  </>
);

/** Les quatre voyageurs autour du profil (position en cqw, pictogramme). */
const TRAVELERS = [
  { left: 21, top: 33, icon: <path d="M3.5 17h17M7 20.5h10M6.5 17a5.5 5.5 0 0 1 11 0M12 7V4.5M5.8 9.8 4.2 8.2M18.2 9.8l1.6-1.6" /> },
  {
    left: 79,
    top: 33,
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M15.4 8.6l-2.2 4.6-4.6 2.2 2.2-4.6z" />
      </>
    ),
  },
  { left: 31, top: 55, icon: <path d="M12 3.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /> },
  { left: 69, top: 55, icon: PLANE },
] as const;

/** L'agence coche : trajets, logement, activités, accessibilité. */
const SERVICES = [
  <path key="transport" d="M7.5 4h9a2.5 2.5 0 0 1 2.5 2.5v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 14V6.5A2.5 2.5 0 0 1 7.5 4zM5 10.5h14M8.5 13.5h.01M15.5 13.5h.01M8.5 20l1.4-3.5M15.5 20l-1.4-3.5" />,
  <g key="stay">
    <path d="M3.5 19V7.5M3.5 15h17M20.5 19v-6a2 2 0 0 0-2-2H11v4" />
    <circle cx="7.2" cy="11.6" r="1.8" />
  </g>,
  <path key="activities" d="M6 20.5V4.5M6 5h11l-2.4 3.6L17 12.2H6" />,
  <g key="access">
    <circle cx="10.5" cy="4.6" r="1.7" />
    <path d="M10.5 7.6v5.6h5.2l2.3 5.6M10.5 10h4.6M7.8 10.6a5.2 5.2 0 1 0 6.9 7.2" />
  </g>,
];

const LINKS = ["M50 40L21 33", "M50 40L79 33", "M50 40L31 55", "M50 40L69 55", "M21 33L31 55", "M79 33L69 55", "M31 55L69 55"];

export function EscapadesScene() {
  const profile = useTranslation().apps.scenes.escapades.profile;
  return (
    <>
      <ol className={styles.dots} aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i}>
            <i data-s="dot" />
          </li>
        ))}
      </ol>
      <div className={styles.question} aria-hidden="true" data-s="question">
        <i className={styles.questionBar} data-s="question-bar" />
        <i className={styles.questionBar} data-s="question-bar" />
        <ul className={styles.scale}>
          <li />
          <li />
          <li />
          <li />
          <li>
            <i data-s="pick" />
          </li>
        </ul>
      </div>
      <div className={styles.profile} data-s="profile">
        <span className={styles.profileIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" data-s="profile-pin">
            {PIN}
          </svg>
        </span>
        <span className={styles.profileName} data-s="profile-name">
          {profile}
        </span>
      </div>
      <svg className={styles.links} viewBox="0 0 100 125" aria-hidden="true" focusable="false">
        {LINKS.map((d) => (
          <path key={d} pathLength={1} d={d} data-s="link" />
        ))}
      </svg>
      <span className={`${styles.av} ${styles.me}`} style={{ left: "50cqw", top: "40cqw" }} data-s="me">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {PIN}
        </svg>
      </span>
      {TRAVELERS.map((t) => (
        <span key={`${t.left}-${t.top}`} className={styles.av} style={{ left: `${t.left}cqw`, top: `${t.top}cqw` }} data-s="traveler">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {t.icon}
          </svg>
        </span>
      ))}
      <div className={styles.trip} aria-hidden="true" data-s="trip">
        <div className={styles.route}>
          <svg viewBox="0 0 24 24" focusable="false">
            {PLANE}
          </svg>
          <i className={styles.routeLine} data-s="route" />
          <svg viewBox="0 0 24 24" focusable="false">
            {PIN}
          </svg>
        </div>
        <ul className={styles.chips}>
          {SERVICES.map((icon, i) => (
            <li key={i} className={styles.chip} data-s="chip">
              <svg viewBox="0 0 24 24" focusable="false">
                {icon}
              </svg>
              <Check className={styles.chipCheck} name="agency" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const buildEscapades: SceneBuilder = (el) => {
  const question = one(el, "question");
  const bars = all(el, "question-bar");
  const dots = all(el, "dot");
  const pick = one(el, "pick");
  const profile = one(el, "profile");
  const pin = Array.from(one(el, "profile-pin").querySelectorAll("path, circle"));
  const name = one(el, "profile-name");
  const me = one(el, "me");
  const travelers = all(el, "traveler");
  const links = all<SVGPathElement>(el, "link");
  const trip = one(el, "trip");
  const route = one(el, "route");
  const chips = all(el, "chip");
  const checks = all(el, "agency").map(checkParts);
  gsap.set(question, { opacity: 0, y: 14 });
  gsap.set(bars, { scaleX: 0.25 });
  gsap.set(dots, { scale: 0, opacity: 0 });
  gsap.set(pick, { scale: 0, opacity: 0 });
  gsap.set(profile, { opacity: 0, y: 34, yPercent: 0, scale: 0.965 });
  gsap.set(pin, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(name, { opacity: 0, y: 8 });
  gsap.set(me, { opacity: 0, scale: 0.4 });
  gsap.set(travelers, { opacity: 0, xPercent: (i: number) => [-70, 70, -60, 60][i] ?? 0, scale: 0.8 });
  gsap.set(links, { strokeDashoffset: 1 });
  gsap.set(trip, { opacity: 0, y: 34, scale: 0.965 });
  gsap.set(route, { scaleX: 0 });
  gsap.set(chips, { opacity: 0, y: 10 });
  gsap.set(checks.map((c) => c.fill), { scale: 0, opacity: 0 });
  gsap.set(checks.map((c) => c.mark), { strokeDashoffset: 1 });
  const tl = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(question, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(bars, { scaleX: 1, duration: 0.8, stagger: 0.1 }, 0.15)
    .to(pick, { scale: 1, opacity: 1, duration: 0.45 }, 0.5)
    .to(dots, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.055 }, 0.45)
    .to(question, { opacity: 0, y: -10, duration: 0.24, ease: "power2.in" }, 1.24)
    .to(profile, { opacity: 1, y: 0, scale: 1, duration: 1 }, 1.45)
    .to(pin, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 1.6)
    .to(name, { opacity: 1, y: 0, duration: 0.7 }, 1.62)
    .to(profile, { opacity: 0, scale: 0.3, yPercent: -24, duration: 0.42, ease: "power3.in" }, 2.6)
    .to(me, { opacity: 1, scale: 1, duration: 0.8 }, 2.92)
    .to(travelers, { opacity: 1, xPercent: 0, scale: 1, duration: 0.9, stagger: 0.07 }, 2.98)
    .to(links, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.04 }, 3.1)
    .to(trip, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 3.2)
    .to(route, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 3.32)
    .to(chips, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 3.36);
  checks.forEach((c, i) => {
    const t = 3.55 + i * 0.1;
    tl.to(c.fill, { scale: 1, opacity: 1, duration: 0.5 }, t).to(c.mark, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, t + 0.1);
  });
  return tl;
};

/** « Comment ça marche » de Escapades Libres, monté autour de son écran (chargé à part : ./registry). */
export default function EscapadesChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildEscapades} tint={styles.scene} sample={null}>
      <EscapadesScene />
    </HowItWorks>
  );
}
