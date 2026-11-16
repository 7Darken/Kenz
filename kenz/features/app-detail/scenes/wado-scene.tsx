"use client";

/**
 * Wado : le plat (une recette de l'app) passe sous le faisceau du scan pendant que la flamme de la nutrition le lit ;
 * ses macros arrivent avec leurs icônes 3D, puis la carte de la journée (le vert de l'app, son anneau citron) monte du
 * total du plat (exemple). Couleurs, pièces et humeurs : celles de l'app (features/nutrition/palette.ts,
 * scan/scan-plate.tsx, components/macro-trio.tsx, components/energy-card.tsx).
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import { WADO_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useLanguage, useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./wado-scene.module.css";

const { photo, macros, kcal, day, flame } = WADO_SAMPLE;
/** La part de l'objectif du jour, avant puis après le plat : l'arc de l'anneau. */
const BEFORE = day.eaten / day.goal;
const AFTER = (day.eaten + kcal) / day.goal;
/** Le faisceau parcourt toute la photo (tailles en cqw, comme dans le CSS), en pourcentage de sa hauteur. */
const PLATE = 52;
const BEAM = 13;
const BEAM_TRAVEL = ((PLATE - BEAM) / BEAM) * 100;
const TONE = { protein: styles.protein, carbs: styles.carbs, fat: styles.fat };

export function WadoScene() {
  const { lang } = useLanguage();
  const s = useTranslation().apps.scenes.wado;
  const n = (value: number) => value.toLocaleString(lang);
  const energy = (value: number) => `${n(value)} ${s.kcal}`;
  return (
    <div className={styles.app}>
      <div className={styles.shot} data-s="shot">
        <div className={styles.plate}>
          <Image className={styles.photo} src={photo.src} width={photo.width} height={photo.height} alt="" sizes="300px" />
          <span className={styles.beam} data-s="beam" />
          <span className={styles.chip} data-s="chip">
            {energy(kcal)}
          </span>
        </div>
        <i className={styles.rim} data-s="rim" />
      </div>
      <span className={styles.flame} data-s="flame-box">
        {flame.map((mood) => (
          <Image key={mood.src} src={mood.src} width={mood.width} height={mood.height} alt="" sizes="120px" data-s="flame" />
        ))}
      </span>
      <ul className={styles.macros}>
        {macros.map((macro) => (
          <li key={macro.key} className={`${styles.macro} ${TONE[macro.key]}`} data-s="macro">
            <span className={styles.medal}>
              <Image src={macro.icon.src} width={macro.icon.width} height={macro.icon.height} alt="" sizes="56px" />
            </span>
            <span className={styles.label}>{s[macro.key]}</span>
            <b className={kit.slit}>
              <span className={kit.num} data-s="value">
                {n(macro.grams)}
                <small>{s.gram}</small>
              </span>
            </b>
          </li>
        ))}
      </ul>
      <div className={styles.energy}>
        <span className={styles.ring} data-s="pulse">
          <svg className={styles.dial} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
            <circle className={styles.track} cx="70" cy="70" r="63" />
            <circle className={styles.arc} cx="70" cy="70" r="63" pathLength={1} style={{ "--off": 1 - AFTER } as CSSProperties} data-s="arc" />
          </svg>
          <span className={styles.total}>
            <b className={styles.swap}>
              <span className={styles.before} data-s="eaten-before">
                {n(day.eaten)}
              </span>
              <span data-s="eaten-after">{n(day.eaten + kcal)}</span>
            </b>
            <small>{s.kcal}</small>
          </span>
        </span>
        <span className={styles.dayCopy}>
          <span className={styles.dayTitle}>{s.day}</span>
          <b className={styles.gain} data-s="gain">
            +{energy(kcal)}
          </b>
        </span>
      </div>
    </div>
  );
}

export const buildWado: SceneBuilder = (el) => {
  const shot = one(el, "shot");
  const beam = one(el, "beam");
  const rim = one(el, "rim");
  const chip = one(el, "chip");
  const flameBox = one(el, "flame-box");
  const flames = all(el, "flame");
  const cards = all(el, "macro");
  const values = all(el, "value");
  const arc = one<SVGCircleElement>(el, "arc");
  const pulse = one(el, "pulse");
  const before = one(el, "eaten-before");
  const after = one(el, "eaten-after");
  const gain = one(el, "gain");

  gsap.set(shot, { opacity: 0, scale: 0.94, yPercent: 4 });
  gsap.set(rim, { opacity: 0 });
  gsap.set(beam, { opacity: 0, yPercent: -100 });
  gsap.set(chip, { opacity: 0, yPercent: 40, scale: 0.9 });
  gsap.set(flameBox, { opacity: 0, scale: 0.8 });
  gsap.set(flames, { opacity: (i: number) => (i === 0 ? 1 : 0) });
  gsap.set(cards, { opacity: 0, yPercent: 12, scale: 0.965 });
  gsap.set(values, { yPercent: 110 });
  // Une fraction du tracé : GSAP ne doit pas l'arrondir au pixel.
  gsap.set(arc, { strokeDashoffset: 1 - BEFORE, autoRound: false });
  gsap.set(pulse, { scale: 1 });
  gsap.set(before, { y: 0, yPercent: 0 });
  gsap.set(after, { yPercent: 110 });
  gsap.set(gain, { opacity: 0, yPercent: 60 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  /** La flamme change d'humeur (scan-mood.ts, energy-card.tsx). */
  const mood = (k: number, t: number) =>
    tl.to(flames[k - 1] ?? [], { opacity: 0, duration: 0.3, ease: "power2.out" }, t).to(flames[k] ?? [], { opacity: 1, duration: 0.45 }, t);

  // La photo arrive, et le faisceau la parcourt de haut en bas (scan-plate.tsx).
  tl.to(shot, { opacity: 1, scale: 1, yPercent: 0, duration: 0.8 }, 0.1)
    .to(flameBox, { opacity: 1, scale: 1, duration: 0.8 }, 0.3)
    .to(rim, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.35)
    .to(beam, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.4)
    .to(beam, { yPercent: BEAM_TRAVEL, duration: 1.1, ease: "power2.inOut" }, 0.45)
    .to(beam, { opacity: 0, duration: 0.35, ease: "power2.out" }, 1.5)
    .to(rim, { opacity: 0.35, duration: 0.5 }, 1.6);
  // Le plat est lu : son total, ses macros.
  tl.to(chip, { opacity: 1, yPercent: 0, scale: 1, duration: 0.8 }, 1.65)
    .to(cards, { opacity: 1, yPercent: 0, scale: 1, duration: 0.9, stagger: 0.1 }, 1.7)
    .to(values, { yPercent: 0, duration: 1, stagger: 0.1 }, 1.8);
  mood(1, 1.7);
  // La journée monte du total du plat : l'anneau bat et s'allonge, le chiffre change, le gain s'affiche.
  tl.to(arc, { strokeDashoffset: 1 - AFTER, autoRound: false, duration: 1.3, ease: "power2.out" }, 2.35)
    .to(pulse, { scale: 1.06, duration: 0.25, ease: "power2.out" }, 2.35)
    .to(pulse, { scale: 1, duration: 0.6 }, 2.6)
    .to(before, { yPercent: -110, duration: 0.6 }, 2.4)
    .to(after, { yPercent: 0, duration: 0.8 }, 2.45)
    .to(gain, { opacity: 1, yPercent: 0, duration: 0.8 }, 2.45);
  mood(2, 2.4);
  return tl;
};

/** « Comment ça marche » de Wado, monté autour de son écran (chargé à part : ./registry). */
export default function WadoChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildWado} tint={styles.scene} sample={"top"}>
      <WadoScene />
    </HowItWorks>
  );
}
