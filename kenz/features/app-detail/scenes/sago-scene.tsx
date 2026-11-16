"use client";

/**
 * Sago : l'essai de l'app. La phrase « お茶をください » reste pâle sous la caisse du konbini ; les mots du lieu se posent
 * à leur place sur l'image (les vrais repères de l'app), お茶 s'éclaire avec le sien, puis toute la phrase prend son
 * sens. Kuro, la mascotte, réfléchit puis sourit. Image, mascotte, couleurs et police (Gabarito) : celles de l'app
 * (Sago, src/v2/design/tokens.ts et typography.ts).
 */
import { Gabarito } from "next/font/google";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";

import { SAGO_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./sago-scene.module.css";

/** La police des titres de l'app, chargée avec sa scène seule. */
const gabarito = Gabarito({ subsets: ["latin"], weight: "700", display: "swap", preload: false });

const { place, pins, sentence, kuro } = SAGO_SAMPLE;
/** Plus bas que ce repère (la moitié de l'image), l'étiquette passe sous son point : elle ne couvre pas ceux du haut. */
const BELOW = 0.5;

export function SagoScene() {
  const translation = useTranslation().apps.scenes.sago.translation;
  return (
    <>
      <div className={styles.place} data-s="place">
        <Image
          className={styles.placeImg}
          src={place.src}
          width={place.width}
          height={place.height}
          alt=""
          sizes="(min-width: 900px) min(35vw, 480px), min(80vw, 480px)"
          data-s="place-img"
        />
        {pins.map((pin) => (
          <span
            key={pin.word}
            className={pin.y > BELOW ? `${styles.pin} ${styles.below}` : styles.pin}
            style={{ "--x": pin.x, "--y": pin.y } as CSSProperties}
            lang="ja"
            data-s="pin"
          >
            <i className={styles.ring} data-s="pin-ring" />
            <i className={styles.dot} data-s="pin-dot" />
            <b className={styles.chip} data-s="pin-chip">
              {pin.word}
            </b>
          </span>
        ))}
      </div>
      <span className={styles.kuro} data-s="kuro">
        <Image className={`${styles.pose} ${styles.before}`} src={kuro.thinking.src} width={kuro.thinking.width} height={kuro.thinking.height} alt="" sizes="150px" data-s="kuro-thinking" />
        <Image className={styles.pose} src={kuro.happy.src} width={kuro.happy.width} height={kuro.happy.height} alt="" sizes="150px" data-s="kuro-happy" />
      </span>
      <p className={styles.line} lang="ja">
        {sentence.map((token) => (
          <span key={token.text} className={token.pin === undefined ? styles.word : `${styles.word} ${styles.found}`} data-s="word">
            {token.reading ? (
              <ruby>
                {token.text}
                <rt data-s="reading">{token.reading}</rt>
              </ruby>
            ) : (
              token.text
            )}
          </span>
        ))}
      </p>
      <span className={styles.rule} data-s="rule" />
      <p className={`${styles.fr} ${gabarito.className}`}>
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
  const place = one(el, "place");
  const placeImg = one(el, "place-img");
  const dots = all(el, "pin-dot");
  const rings = all(el, "pin-ring");
  const chips = all(el, "pin-chip");
  const words = all(el, "word");
  const reading = one(el, "reading");
  const kuroWrap = one(el, "kuro");
  const thinking = one(el, "kuro-thinking");
  const happy = one(el, "kuro-happy");
  const rule = one(el, "rule");
  const frWords = all(el, "fr-word");
  // Le mot de la phrase qui reprend un mot de l'image s'éclaire avec lui ; les autres attendent la fin.
  const found = sentence.flatMap((token, i) => (token.pin === undefined ? [] : [{ word: words[i], pin: token.pin }]));
  const rest = words.filter((_, i) => sentence[i]?.pin === undefined);

  gsap.set(place, { opacity: 0, yPercent: 5, scale: 0.97 });
  gsap.set(placeImg, { scale: 1.08 });
  gsap.set(dots, { scale: 0 });
  gsap.set(rings, { scale: 0.6, opacity: 0 });
  gsap.set(chips, { opacity: 0, yPercent: 40, scale: 0.86 });
  gsap.set(words, { opacity: 0.26 });
  gsap.set(reading, { opacity: 0 });
  gsap.set(kuroWrap, { opacity: 0, yPercent: 16 });
  gsap.set(thinking, { opacity: 1 });
  gsap.set(happy, { opacity: 0 });
  gsap.set(rule, { scaleX: 0 });
  gsap.set(frWords, { opacity: 0, y: 8 });

  const tl = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(place, { opacity: 1, yPercent: 0, scale: 1, duration: 1 }, 0)
    .to(placeImg, { scale: 1, duration: 2.4 }, 0)
    .to(kuroWrap, { opacity: 1, yPercent: 0, duration: 0.9 }, 0.3);
  // Chaque mot se pose à sa place : le point, son onde, puis l'étiquette.
  dots.forEach((dot, i) => {
    const t = 0.55 + i * 0.32;
    tl.to(dot, { scale: 1, duration: 0.6 }, t)
      .fromTo(rings[i] ?? [], { opacity: 0.8, scale: 1 }, { opacity: 0, scale: 2.6, duration: 1, ease: "power2.out", immediateRender: false }, t)
      .to(chips[i] ?? [], { opacity: 1, yPercent: 0, scale: 1, duration: 0.7 }, t + 0.1);
  });
  found.forEach(({ word, pin }) => {
    const t = 0.75 + pin * 0.32;
    tl.to(word ?? [], { opacity: 1, duration: 0.8 }, t).to(reading, { opacity: 1, duration: 0.8 }, t + 0.05);
  });
  // La phrase prend son sens : le reste s'éclaire, la traduction monte, Kuro sourit.
  return tl
    .to(rest, { opacity: 1, duration: 0.9, stagger: 0.12 }, 2.3)
    .to(rule, { scaleX: 1, duration: 0.9 }, 2.4)
    .to(frWords, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 2.55)
    .to(thinking, { opacity: 0, duration: 0.3, ease: "power2.out" }, 2.5)
    .to(happy, { opacity: 1, duration: 0.3, ease: "power2.out" }, 2.5)
    .to(kuroWrap, { yPercent: -7, duration: 0.22, ease: "power2.out" }, 2.5)
    .to(kuroWrap, { yPercent: 0, duration: 0.8 }, 2.72);
};

/** « Comment ça marche » de Sago, monté autour de son écran (chargé à part : ./registry). */
export default function SagoChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildSago} tint={styles.scene} sample={null}>
      <SagoScene />
    </HowItWorks>
  );
}
