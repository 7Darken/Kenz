"use client";

/**
 * Oshii : la démo de l'app. La vidéo de la tarte aux cookies passe sur TikTok, elle est partagée à Oshii, se replie
 * dans l'icône et devient la fiche pesée de l'app ; la mascotte se réjouit. Photo, logos, mascotte, recette et
 * couleurs : ceux de l'app (Oshii, components/onboarding/v3, constants/theme.ts).
 */
import Image from "next/image";

import { OSHII_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import type { ImageAsset } from "@/content/types";
import { ThemedImage } from "@/design-system/components/themed-image";
import { gsap } from "@/design-system/motion/gsap";
import { format } from "@/i18n/format";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./oshii-scene.module.css";

const { photo, platform, mascot, quantities: QUANTITIES } = OSHII_SAMPLE;

/** `icon`, `name` : ceux de l'app (content/apps.ts), passés par le chapitre. */
export function OshiiScene({ icon, iconDark, name }: { icon: ImageAsset; iconDark?: ImageAsset; name: string }) {
  const s = useTranslation().apps.scenes.oshii;
  return (
    <>
      <div className={styles.video} data-s="video">
        <Image className={styles.photo} src={photo.src} width={photo.width} height={photo.height} alt="" sizes="(min-width: 900px) 240px, 44vw" data-s="video-img" />
        <Image className={styles.platform} src={platform.src} width={platform.width} height={platform.height} alt="" sizes="32px" />
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
        <div className={styles.hero}>
          <Image className={styles.photo} src={photo.src} width={photo.width} height={photo.height} alt="" sizes="(min-width: 900px) 440px, 82vw" data-s="recipe-img" />
          <Image className={styles.platform} src={platform.src} width={platform.width} height={platform.height} alt="" sizes="32px" />
        </div>
        <div className={styles.body}>
          <div className={styles.recipeHead} data-s="recipe-part">
            <ThemedImage src={icon.src} darkSrc={iconDark?.src} width={icon.width} height={icon.height} alt="" sizes="48px" />
            <p className={styles.recipeTitle}>{s.recipe}</p>
          </div>
          <p className={styles.meta} data-s="recipe-part">
            <span>{format(s.time, { n: OSHII_SAMPLE.minutes })}</span>
            <span>{format(s.servings, { n: OSHII_SAMPLE.servings })}</span>
          </p>
          <p className={styles.ingTitle} data-s="recipe-part">
            {s.ingredientsTitle}
          </p>
          <ul className={styles.ing}>
            {(Object.keys(QUANTITIES) as (keyof typeof QUANTITIES)[]).map((key) => (
              <li key={key} data-s="ingredient">
                <i className={styles.box} />
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
            <span>{format(s.steps, { n: OSHII_SAMPLE.steps })}</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M6 3.5L10.5 8 6 12.5" />
            </svg>
          </p>
        </div>
      </div>
      <Image className={styles.mascot} src={mascot.src} width={mascot.width} height={mascot.height} alt="" sizes="150px" data-s="mascot" />
    </>
  );
}

export const buildOshii: SceneBuilder = (el) => {
  const video = one(el, "video");
  const videoImg = one(el, "video-img");
  const bar = one(el, "bar");
  const sheet = one(el, "sheet");
  const tap = one(el, "tap");
  const icon = one(el, "share-icon");
  const recipe = one(el, "recipe");
  const recipeImg = one(el, "recipe-img");
  const parts = all(el, "recipe-part");
  const items = all(el, "ingredient");
  const nums = all(el, "qty");
  const steps = one(el, "steps");
  const mascotEl = one(el, "mascot");
  gsap.set(video, { opacity: 1, scale: 1 });
  gsap.set(videoImg, { scale: 1.12 });
  gsap.set(bar, { scaleX: 0 });
  gsap.set(sheet, { y: 0, yPercent: 105 });
  gsap.set(tap, { opacity: 0, scale: 0.5 });
  gsap.set(recipe, { opacity: 0, y: 26, scale: 0.94, clipPath: "inset(0% 0% 100% 0% round 18px)" });
  gsap.set(recipeImg, { scale: 1.14 });
  gsap.set([...parts, ...items, steps], { opacity: 0, y: 10 });
  gsap.set(nums, { yPercent: 110 });
  gsap.set(mascotEl, { opacity: 0, scale: 0.6, rotation: -14, yPercent: 18 });
  return (
    gsap
      .timeline({ paused: true, defaults: { ease: "expo.out" } })
      // La vidéo joue : la photo avance doucement, la barre de lecture aussi.
      .to(videoImg, { scale: 1, duration: 1.6, ease: "power1.out" }, 0)
      .to(bar, { scaleX: 0.62, duration: 1.3, ease: "none" }, 0)
      .to(sheet, { yPercent: 0, duration: 0.8 }, 0.45)
      .to(tap, { opacity: 0.9, scale: 1, duration: 0.25, ease: "power2.out" }, 1.2)
      .to(icon, { scale: 0.9, duration: 0.12, ease: "power2.out" }, 1.2)
      .to(icon, { scale: 1, duration: 0.5 }, 1.32)
      .to(tap, { opacity: 0, scale: 1.3, duration: 0.4, ease: "power2.out" }, 1.45)
      .to(video, { scale: 0.08, opacity: 0, duration: 0.6, ease: "power3.in" }, 1.5)
      .to(sheet, { yPercent: 105, duration: 0.3, ease: "power2.in" }, 2.15)
      // La fiche de l'app se déplie, la même photo en tête.
      .to(recipe, { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1 }, 2.3)
      .to(recipeImg, { scale: 1, duration: 1.4 }, 2.3)
      .to(parts, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 2.45)
      .to(items, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, 2.66)
      .to(nums, { yPercent: 0, duration: 0.9, stagger: 0.14 }, 2.74)
      .to(steps, { opacity: 1, y: 0, duration: 0.7 }, 3.25)
      .to(mascotEl, { opacity: 1, scale: 1, rotation: 0, yPercent: 0, duration: 0.9 }, 3.3)
  );
};

/** « Comment ça marche » de Oshii, monté autour de son écran (chargé à part : ./registry). */
export default function OshiiChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildOshii} tint={styles.scene} sample={"top"}>
      {app.kind === "mobile" ? <OshiiScene icon={app.icon} iconDark={app.iconDark} name={app.name} /> : null}
    </HowItWorks>
  );
}
