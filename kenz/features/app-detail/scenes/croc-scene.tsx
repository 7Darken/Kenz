"use client";

/**
 * Croc : l'accueil de l'app. Le matin, on s'engage (l'anneau d'or du pacte se remplit) ; le soir, on valide (l'anneau
 * de sauge, ses étincelles) ; puis la semaine se coche et le compteur « Sans mordre » monte à 12 (exemple).
 * Décor, mascotte, couleurs claires et sombres, polices (Baloo 2, Nunito) : ceux de l'app (apps/mobile/src/theme.tsx,
 * components/pact-ring.tsx, app/(tabs)/index.tsx).
 */
import { Baloo_2, Nunito } from "next/font/google";
import Image from "next/image";

import { CROC_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { getQuality } from "@/design-system/motion/quality";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, Check, checkParts, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./croc-scene.module.css";

/** Les polices de l'app, chargées avec sa scène seule : Baloo 2 pour les titres et les chiffres, Nunito pour le reste. */
const baloo = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], display: "swap", preload: false, variable: "--cr-display" });
const nunito = Nunito({ subsets: ["latin"], weight: ["600", "800"], display: "swap", preload: false, variable: "--cr-text" });

/** L'anneau du pacte, version de l'accueil (pact-ring.tsx) : le matin dehors, le soir dedans. */
const RING = 116;
const R_OUT = 53.5;
const R_IN = 41.5;
/** Les étincelles du pacte tenu : leurs angles, leur taille, et leur trajet depuis le centre de l'anneau (cqw). */
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];
const SPARK = 1.6;
const SPARK_FROM = 7;
const SPARK_TO = 14.8;

/** Le repère matin / soir à côté de l'anneau : sa pastille se remplit quand l'étape est faite. */
function Step({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={styles.step}>
      <span className={`${styles.stepDot} ${tone}`}>
        <i data-s="step-dot" />
      </span>
      {label}
    </span>
  );
}

export function CrocScene() {
  const s = useTranslation().apps.scenes.croc;
  const { landscape, moods, streak } = CROC_SAMPLE;
  const c = RING / 2;
  return (
    <div className={`${styles.app} ${baloo.variable} ${nunito.variable}`}>
      <div className={styles.panel}>
        <Image className={styles.land} src={landscape.src} width={landscape.width} height={landscape.height} alt="" sizes="500px" />
        <p className={styles.bubble} data-s="bubble">
          {s.bravo}
        </p>
        <span className={styles.mascot}>
          {moods.map((mood) => (
            <Image key={mood.src} src={mood.src} width={mood.width} height={mood.height} alt="" sizes="140px" data-s="mood" />
          ))}
        </span>
      </div>
      <div className={styles.card}>
        <span className={styles.over}>{s.clean}</span>
        <span className={styles.hero}>
          <span className={kit.rollW}>
            <span className={`${kit.roll} ${styles.roll}`} data-s="roll">
              {streak.map((n) => (
                <b key={n}>{n}</b>
              ))}
            </span>
          </span>
          <span className={styles.unit}>{s.unit}</span>
        </span>
        <i className={styles.divider} />
        <ol className={styles.week}>
          {s.week.split(" ").map((day, index) => (
            <li key={index}>
              <Check className={styles.day} name="day" />
              {day}
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.pact}>
        <span className={styles.titles}>
          <b className={styles.titleCommit} data-s="title">
            {s.commit}
          </b>
          <b data-s="title">{s.committed}</b>
          <b className={styles.titleKept} data-s="title">
            {s.kept}
          </b>
        </span>
        <div className={styles.ringRow}>
          <Step label={s.morning} tone={styles.gold} />
          <span className={styles.ring} data-s="ring">
            <i className={`${styles.disc} ${styles.discIdle}`} data-s="disc" />
            <i className={`${styles.disc} ${styles.discOpen}`} data-s="disc" />
            <i className={`${styles.disc} ${styles.discSealed}`} data-s="disc" />
            <svg className={styles.dial} viewBox={`0 0 ${RING} ${RING}`} aria-hidden="true" focusable="false">
              <circle className={styles.track} cx={c} cy={c} r={R_OUT} />
              <circle className={styles.trackIn} cx={c} cy={c} r={R_IN} data-s="track-in" />
              <circle className={styles.arcOut} cx={c} cy={c} r={R_OUT} pathLength={1} data-s="arc" />
              <circle className={styles.arcIn} cx={c} cy={c} r={R_IN} pathLength={1} data-s="arc" />
            </svg>
            <span className={`${styles.face} ${styles.faceHold}`} data-s="face">
              {/* L'empreinte de l'app (lucide « fingerprint-pattern ») */}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M17.29 21.02c.12-.6.43-2.3.5-3.02M2 12a10 10 0 0 1 18-6M2 16h.01M21.8 16c.2-2 .131-5.354 0-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2M8.65 22c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2v2" />
              </svg>
              <b>{s.hold}</b>
            </span>
            <span className={`${styles.face} ${styles.faceEngaged}`} data-s="face">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <b>{s.engaged}</b>
            </span>
            <span className={`${styles.face} ${styles.faceHeld}`} data-s="face">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <b>{s.held}</b>
            </span>
            {SPARKS.map((angle) => (
              <i key={angle} className={styles.spark} data-s="spark" />
            ))}
          </span>
          <Step label={s.evening} tone={styles.sage} />
        </div>
      </div>
    </div>
  );
}

export const buildCroc: SceneBuilder = (el) => {
  const moods = all(el, "mood");
  const bubble = one(el, "bubble");
  const roll = one(el, "roll");
  const days = all(el, "day").map(checkParts);
  const titles = all(el, "title");
  const ring = one(el, "ring");
  const discs = all(el, "disc");
  const arcs = all<SVGCircleElement>(el, "arc");
  const trackIn = one<SVGCircleElement>(el, "track-in");
  const faces = all(el, "face");
  const dots = all(el, "step-dot");
  const sparks = all(el, "spark");
  // Appareil modeste : le pacte tenu sans ses étincelles.
  const lite = getQuality() === "low";
  const first = (i: number) => (i === 0 ? 1 : 0);
  const spark = (distance: number, axis: "cos" | "sin") => (i: number) =>
    (Math[axis](((SPARKS[i] ?? 0) * Math.PI) / 180) * distance * 100) / SPARK;

  [moods, titles, discs, faces].forEach((list) => gsap.set(list, { opacity: first }));
  gsap.set(bubble, { opacity: 0, yPercent: 30, scale: 0.94 });
  gsap.set(roll, { y: 0, yPercent: 0 });
  gsap.set(
    days.map((d) => d.fill),
    { scale: 0, opacity: 0 },
  );
  gsap.set(
    days.map((d) => d.mark),
    { strokeDashoffset: 1 },
  );
  gsap.set(ring, { scale: 1 });
  gsap.set(arcs, { strokeDashoffset: 1, opacity: 0 });
  gsap.set(trackIn, { opacity: 0 });
  gsap.set(dots, { scale: 0 });
  gsap.set(sparks, { xPercent: spark(SPARK_FROM, "cos"), yPercent: spark(SPARK_FROM, "sin"), opacity: 0, scale: 0.4 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  /** Une étape du pacte : le titre, le centre, le fond de l'anneau et l'humeur de la mascotte passent au suivant. */
  const next = (k: number, t: number) => {
    [titles, faces, discs, moods].forEach((list) => {
      tl.to(list[k - 1] ?? [], { opacity: 0, duration: 0.3, ease: "power2.out" }, t).to(list[k] ?? [], { opacity: 1, duration: 0.45 }, t);
    });
    tl.to(dots[k - 1] ?? [], { scale: 1, duration: 0.5 }, t);
  };
  /** Le maintien du doigt : l'anneau grossit un peu pendant que l'arc se remplit, puis revient (pact-ring.tsx). */
  const hold = (arc: Element | undefined, t: number, duration: number) => {
    tl.to(arc ?? [], { opacity: 1, duration: 0.05, ease: "none" }, t)
      .to(arc ?? [], { strokeDashoffset: 0, duration, ease: "power2.inOut" }, t)
      .to(ring, { scale: 1.06, duration, ease: "power2.inOut" }, t)
      .to(ring, { scale: 1, duration: 0.6 }, t + duration);
  };

  // Le matin : on maintient, l'anneau d'or se remplit, la promesse est faite.
  hold(arcs[0], 0.15, 0.55);
  next(1, 0.7);
  // Le soir : la piste du soir apparaît, l'anneau de sauge se remplit, le pacte est tenu.
  tl.to(trackIn, { opacity: 1, duration: 0.3 }, 0.8);
  hold(arcs[1], 0.85, 0.35);
  next(2, 1.2);
  if (!lite) {
    tl.to(sparks, { xPercent: spark(SPARK_TO, "cos"), yPercent: spark(SPARK_TO, "sin"), duration: 0.76 }, 1.2)
      .to(sparks, { opacity: 1, scale: 1.2, duration: 0.25, ease: "power2.out" }, 1.2)
      .to(sparks, { opacity: 0, scale: 0.4, duration: 0.5, ease: "power2.in" }, 1.45);
  }
  // Jour après jour : la semaine se coche, et le compteur monte d'un jour à chaque coche.
  const step = 100 / CROC_SAMPLE.streak.length;
  days.forEach(({ fill, mark }, k) => {
    const t = 1.35 + k * 0.2;
    tl.to(fill, { scale: 1, opacity: 1, duration: 0.45 }, t)
      .to(mark, { strokeDashoffset: 0, duration: 0.36, ease: "power2.out" }, t + 0.1)
      .to(roll, { yPercent: -step * (k + 1), duration: 0.45 }, t + 0.05);
  });
  return tl.to(bubble, { opacity: 1, yPercent: 0, scale: 1, duration: 0.9 }, 2.95);
};

/** « Comment ça marche » de Croc, monté autour de son écran (chargé à part : ./registry). */
export default function CrocChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildCroc} tint={styles.scene} sample={"bottom"}>
      <CrocScene />
    </HowItWorks>
  );
}
