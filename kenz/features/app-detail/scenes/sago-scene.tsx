"use client";

/** Sago : une phrase japonaise floue ; chaque mot prend une image (un chat, un cœur), puis la phrase prend son sens. */
import { Fragment } from "react";

import { gsap } from "@/features/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import { all, one, type SceneBuilder } from "./scene-kit";
import styles from "./sago-scene.module.css";

export function SagoScene() {
  const translation = useTranslation().apps.scenes.sago.translation;
  return (
    <>
      <p className={styles.line} lang="ja">
        <span className={styles.word}>
          <svg className={`${styles.draw} ${styles.cat}`} viewBox="0 0 80 64" aria-hidden="true" focusable="false">
            <path pathLength={1} data-s="cat" d="M14 56C8 44 10 30 16 22L14 6l14 10c7-3 17-3 24 0L66 6l-2 16c6 8 8 22 2 34-10 6-42 6-52 0z" />
            <path pathLength={1} data-s="cat" d="M30 35v4M50 35v4" />
            <path pathLength={1} data-s="cat" d="M37 44l3 2.4 3-2.4" />
            <path pathLength={1} data-s="cat" d="M5 41l17 2.5M5 48l17-1M75 41l-17 2.5M75 48l-17-1" />
          </svg>
          <span className={styles.kana} data-s="kana">
            ねこ
          </span>
        </span>{" "}
        <span className={styles.word}>
          <span className={styles.kana} data-s="kana">
            が
          </span>
        </span>{" "}
        <span className={styles.word}>
          <svg className={`${styles.draw} ${styles.heart}`} viewBox="0 0 80 64" aria-hidden="true" focusable="false">
            <path pathLength={1} data-s="heart" d="M40 58C18 44 8 34 8 22 8 13 15 7 23 7c8 0 14 5 17 11 3-6 9-11 17-11 8 0 15 6 15 15 0 12-10 22-32 36z" />
          </svg>
          <span className={styles.kana} data-s="kana">
            すき
          </span>
        </span>
      </p>
      <span className={styles.rule} data-s="rule" />
      <p className={styles.fr}>
        {translation.split(" ").map((word, index) => (
          <Fragment key={index}>
            {index > 0 ? " " : null}
            <span className={styles.frWord} data-s="fr-word">
              {word}
            </span>
          </Fragment>
        ))}
      </p>
    </>
  );
}

export const buildSago: SceneBuilder = (el) => {
  const kana = all(el, "kana");
  const cat = all<SVGPathElement>(el, "cat");
  const heart = all<SVGPathElement>(el, "heart");
  const words = all(el, "fr-word");
  const rule = one(el, "rule");
  gsap.set(kana, { opacity: 0.3, filter: "blur(9px)" });
  gsap.set([...cat, ...heart], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(words, { opacity: 0, filter: "blur(8px)", y: 6 });
  gsap.set(rule, { scaleX: 0 });
  return gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(cat[0] ?? [], { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.2)
    .to(cat.slice(1, 3), { strokeDashoffset: 0, duration: 0.35, ease: "power2.out", stagger: 0.1 }, 1.05)
    .to(cat[3] ?? [], { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 1.25)
    .to(kana[0] ?? [], { opacity: 1, filter: "blur(0px)", duration: 0.9 }, 0.95)
    .to(heart, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 1.45)
    .to(kana[2] ?? [], { opacity: 1, filter: "blur(0px)", duration: 0.9 }, 2.05)
    .to(kana[1] ?? [], { opacity: 1, filter: "blur(0px)", duration: 0.9 }, 2.2)
    .to(rule, { scaleX: 1, duration: 0.9 }, 2.35)
    .to(words, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.07 }, 2.5);
};
