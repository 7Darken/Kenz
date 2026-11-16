"use client";

/** Oshii : une vidéo de recette est partagée à l'app, se replie dans l'icône et devient une fiche pesée. */

import { OSHII_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import type { ImageAsset } from "@/content/types";
import { ThemedImage } from "@/design-system/components/themed-image";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./oshii-scene.module.css";

/** Les quantités d'exemple de la fiche (content/app-scenes.ts). */
const QUANTITIES = OSHII_SAMPLE.quantities;

/** `icon`, `name` : ceux de l'app (content/apps.ts), passés par le chapitre. */
export function OshiiScene({ icon, iconDark, name }: { icon: ImageAsset; iconDark?: ImageAsset; name: string }) {
  const s = useTranslation().apps.scenes.oshii;
  return (
    <>
      <div className={styles.video} data-s="video">
        <svg className={styles.food} viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="osT" cx="50%" cy="40%" r="72%">
              <stop offset="0" stopColor="#6A4E3A" />
              <stop offset="1" stopColor="#1F1712" />
            </radialGradient>
            <radialGradient id="osS" cx="42%" cy="38%" r="70%">
              <stop offset="0" stopColor="#FCEBC0" />
              <stop offset="1" stopColor="#E4BC6E" />
            </radialGradient>
          </defs>
          <rect width="90" height="160" fill="url(#osT)" />
          <ellipse cx="46" cy="71" rx="40" ry="37" fill="#140F0B" opacity=".45" />
          <circle cx="45" cy="66" r="37" fill="#EDE5D8" />
          <circle cx="45" cy="66" r="29" fill="#F8F3EB" />
          <circle cx="45" cy="66" r="24" fill="url(#osS)" />
          <g fill="none" stroke="#F7DC94" strokeWidth="2.4" strokeLinecap="round">
            <path d="M28 60c6-8 16-8 20 0s12 10 18 2" />
            <path d="M26 70c8-6 14 4 22-2s14-8 18 0" />
            <path d="M32 78c6-4 12 4 18-1s10-5 14 1" />
            <path d="M34 52c4-4 10-4 14 0s10 4 12 1" />
          </g>
          <g fill="none" stroke="#D8AA58" strokeWidth="1.3" strokeLinecap="round" opacity=".85">
            <path d="M30 65c5-5 11 3 17-1s11-4 15 1" />
            <path d="M33 74c5-3 9 2 14 0" />
          </g>
          <g transform="translate(60 53)">
            <circle r="8.5" fill="#F2CF3A" />
            <circle r="7" fill="#FBE68A" />
            <path d="M0 0V-7M0 0L6-3.5M0 0L6 3.5M0 0V7M0 0L-6 3.5M0 0L-6-3.5" stroke="#F2CF3A" strokeWidth=".9" />
          </g>
          <ellipse cx="33" cy="58" rx="5.4" ry="2.6" fill="#5C8F45" transform="rotate(-35 33 58)" />
          <ellipse cx="38" cy="54.5" rx="4.4" ry="2.2" fill="#76A85A" transform="rotate(20 38 54.5)" />
          <g fill="#FFF8E6">
            <circle cx="44" cy="64" r=".9" />
            <circle cx="50" cy="70" r=".8" />
            <circle cx="40" cy="72" r=".8" />
            <circle cx="52" cy="60" r=".9" />
            <circle cx="47" cy="77" r=".7" />
          </g>
          <path d="M80 98L66 132" stroke="#B9B2A6" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <span className={styles.rail} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
            <path d="M12 4c4.7 0 8 2.9 8 6.6s-3.3 6.6-8 6.6c-.9 0-1.8-.1-2.6-.3L5 19l1-3.6C4.8 14.2 4 12.5 4 10.6 4 6.9 7.3 4 12 4z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
            <path d="M13 5l7 6.5-7 6.5v-4c-4.5 0-7 1.3-9 4.5.5-5 3-8.5 9-9.3V5z" />
          </svg>
        </span>
        <p className={styles.cap}>{s.caption}</p>
        <span className={styles.bar}>
          <i data-s="bar" />
        </span>
      </div>
      <div className={styles.sheet} data-s="sheet">
        <p className={styles.sheetTitle}>{s.shareTo}</p>
        <div className={styles.row}>
          <span className={styles.app}>
            <ThemedImage src={icon.src} darkSrc={iconDark?.src} width={icon.width} height={icon.height} alt="" sizes="64px" data-s="share-icon" />
            <span>{name}</span>
            <span className={styles.tap} data-s="tap" />
          </span>
          {[0, 1, 2].map((n) => (
            <span key={n} className={styles.app}>
              <i />
              <b />
            </span>
          ))}
        </div>
      </div>
      <div className={styles.recipe} data-s="recipe">
        <div className={styles.recipeHead} data-s="recipe-head">
          <ThemedImage src={icon.src} darkSrc={iconDark?.src} width={icon.width} height={icon.height} alt="" sizes="48px" />
          <p className={styles.recipeTitle}>{s.recipe}</p>
        </div>
        <ul className={styles.ing}>
          {(Object.keys(QUANTITIES) as (keyof typeof QUANTITIES)[]).map((key) => (
            <li key={key} data-s="ingredient">
              <span>{s.ingredients[key]}</span>
              <b className={kit.slit}>
                <span className={kit.num} data-s="qty">
                  {QUANTITIES[key]}
                </span>
              </b>
            </li>
          ))}
        </ul>
        <p className={styles.steps} data-s="steps">
          <span>{s.steps}</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M6 3.5L10.5 8 6 12.5" />
          </svg>
        </p>
      </div>
    </>
  );
}

export const buildOshii: SceneBuilder = (el) => {
  const video = one(el, "video");
  const bar = one(el, "bar");
  const sheet = one(el, "sheet");
  const tap = one(el, "tap");
  const icon = one(el, "share-icon");
  const recipe = one(el, "recipe");
  const head = one(el, "recipe-head");
  const items = all(el, "ingredient");
  const nums = all(el, "qty");
  const steps = one(el, "steps");
  gsap.set(video, { opacity: 1, scale: 1 });
  gsap.set(bar, { scaleX: 0 });
  gsap.set(sheet, { y: 0, yPercent: 105 });
  gsap.set(tap, { opacity: 0, scale: 0.5 });
  gsap.set(recipe, { opacity: 0, y: 26, scale: 0.94, clipPath: "inset(0% 0% 100% 0% round 18px)" });
  gsap.set([head, ...items, steps], { opacity: 0, y: 10 });
  gsap.set(nums, { yPercent: 110 });
  return gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(bar, { scaleX: 0.62, duration: 1.3, ease: "none" }, 0)
    .to(sheet, { yPercent: 0, duration: 0.8 }, 0.45)
    .to(tap, { opacity: 0.9, scale: 1, duration: 0.25, ease: "power2.out" }, 1.2)
    .to(icon, { scale: 0.9, duration: 0.12, ease: "power2.out" }, 1.2)
    .to(icon, { scale: 1, duration: 0.5 }, 1.32)
    .to(tap, { opacity: 0, scale: 1.3, duration: 0.4, ease: "power2.out" }, 1.45)
    .to(video, { scale: 0.08, opacity: 0, duration: 0.6, ease: "power3.in" }, 1.5)
    .to(sheet, { yPercent: 105, duration: 0.3, ease: "power2.in" }, 2.15)
    .to(recipe, { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1 }, 2.3)
    .to(head, { opacity: 1, y: 0, duration: 0.7 }, 2.45)
    .to(items, { opacity: 1, y: 0, duration: 0.7, stagger: 0.16 }, 2.6)
    .to(nums, { yPercent: 0, duration: 0.9, stagger: 0.16 }, 2.68)
    .to(steps, { opacity: 1, y: 0, duration: 0.7 }, 3.3);
};

/** « Comment ça marche » de Oshii, monté autour de son écran (chargé à part : ./registry). */
export default function OshiiChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildOshii} tint={styles.scene} sample={"top"}>
      {app.kind === "mobile" ? <OshiiScene icon={app.icon} iconDark={app.iconDark} name={app.name} /> : null}
    </HowItWorks>
  );
}
