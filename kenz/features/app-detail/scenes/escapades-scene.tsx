"use client";

/**
 * Escapades Libres : le parcours du site. Une des 12 phrases du test reçoit sa réponse, l'avion avance sur le tracé ;
 * le profil « Aventurier » arrive en carte postale qui se retourne, et son timbre se pose. Puis le petit groupe, la
 * destination, et ce dont Escapades Libres s'occupe. Pictogrammes, avion, avatars, carte postale, couleurs et police
 * (Cabinet Grotesk) : ceux du site (EscapadesLibres : packages/brand, apps/web/src/components).
 */
import localFont from "next/font/local";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ESCAPADES_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import { all, Check, checkParts, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./escapades-scene.module.css";

/** La police des titres du site, chargée avec sa scène seule. */
const cabinet = localFont({
  src: "./fonts/cabinet-grotesk-bold.woff2",
  weight: "700",
  display: "swap",
  preload: false,
  variable: "--el-display",
});

/** Les pictogrammes de la marque (packages/brand/assets/icons), au trait. */
const MAP_PIN = (
  <>
    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </>
);

/** Ce dont Escapades Libres s'occupe : trajets, logement, activités, accessibilité. */
const AGENCY: readonly ReactNode[] = [
  <path key="plane-path" d="m13 3 8 6-7 1-2 6-2-2 1-5-4-2 1-2 5 1V3ZM3 21h2m2-1 1.5-1M3 14v1m0 3v1" />,
  <g key="key">
    <circle cx="8" cy="8" r="5" />
    <path d="m11.6 11.6 9 9m-4-4 2.4-2.4m-5.1-.3 2.4-2.4" />
  </g>,
  <g key="compass">
    <circle cx="12" cy="12" r="9" />
    <path d="m16 8-2.6 5.4L8 16l2.6-5.4L16 8Z" />
  </g>,
  <g key="accessibility">
    <circle cx="15.3" cy="4" r="1.8" />
    <path d="m12.7 7-3.5 4.3 5.8 1.4 3.5 5.5 2.5-1.5M12.7 7l4.3 3 3-.5M8.4 9.6a6 6 0 1 0 6.6 8.8m-5.8-7.1L8 15h5" />
  </g>,
];

/** Le petit avion vu de dessus du site (components/landing/plane-glyph.tsx). */
const PLANE =
  "M476 256C476 249 449 238 419 238H318L221 80Q216 70 208 70H186Q180 70 183 80L229 238H131L83 165Q79 159 73 159H57Q52 159 54 165L80 243L54 248Q48 250 48 256Q48 262 54 264L80 269L54 347Q52 353 57 353H73Q79 353 83 347L131 274H229L183 432Q180 442 186 442H208Q216 442 221 432L318 274H419C449 274 476 263 476 256Z";

/** Les trois escales du parcours du site : le profil, l'espace, le voyage. */
const STOPS = 3;
/** L'échelle du test : cinq ronds de plus en plus grands, la réponse choisie (« Tout à fait moi »). */
const SCALE = 5;
const PICKED = SCALE - 1;

const { group, destination, city } = ESCAPADES_SAMPLE;
/** Le groupe en éventail, comme dans le site : chacun penché selon son écart au milieu. */
const MIDDLE = (group.length - 1) / 2;

export function EscapadesScene() {
  const s = useTranslation().apps.scenes.escapades;
  return (
    <div className={`${styles.app} ${cabinet.variable}`}>
      <div className={styles.route} aria-hidden="true">
        <i className={styles.fill} data-s="route-fill" />
        {Array.from({ length: STOPS }, (_, i) => (
          <i key={i} className={styles.stop} style={{ left: `${((i + 1) / STOPS) * 100}%` }} data-s="stop" />
        ))}
        <span className={styles.planeWrap} data-s="plane">
          <span className={styles.plane}>
            <svg viewBox="0 0 512 512" focusable="false">
              <path d={PLANE} />
            </svg>
          </span>
        </span>
      </div>
      <div className={styles.question} data-s="question">
        <p className={styles.phrase}>
          <span className={styles.quote} aria-hidden="true">
            «&nbsp;
          </span>
          {s.question}
          <span className={styles.quote} aria-hidden="true">
            &nbsp;»
          </span>
        </p>
        <ul className={styles.scale} aria-hidden="true">
          {Array.from({ length: SCALE }, (_, i) => (
            <li key={i} data-s="choice">
              <i className={i === PICKED ? `${styles.dot} ${styles.picked}` : styles.dot} style={{ "--i": i } as CSSProperties} data-s={i === PICKED ? "pick" : undefined} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.postcard} data-s="postcard">
        <i className={styles.edge} />
        <div className={styles.postcardBody}>
          <p className={styles.postcardTitle}>{s.yourProfile}</p>
          <p className={styles.profile}>{s.profile}</p>
          <span className={styles.stamp} aria-hidden="true" data-s="stamp">
            <svg viewBox="0 0 24 24" focusable="false">
              {MAP_PIN}
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.group} aria-hidden="true">
        {group.map((face, i) => (
          <Image
            key={face.src}
            className={styles.face}
            src={face.src}
            width={face.width}
            height={face.height}
            alt=""
            sizes="96px"
            style={{ "--k": i - MIDDLE, "--d": Math.abs(i - MIDDLE) } as CSSProperties}
            data-s="face"
          />
        ))}
      </div>
      <div className={styles.dest} aria-hidden="true" data-s="dest">
        <span className={styles.destPhoto}>
          <Image src={destination.src} width={destination.width} height={destination.height} alt="" sizes="(min-width: 900px) 360px, 64vw" data-s="dest-img" />
          <span className={styles.city}>{city}</span>
        </span>
      </div>
      <ul className={styles.agency} aria-hidden="true">
        {AGENCY.map((icon, i) => (
          <li key={i} className={styles.tile} data-s="tile">
            <svg viewBox="0 0 24 24" focusable="false">
              {icon}
            </svg>
            <Check className={styles.tileCheck} name="agency" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const buildEscapades: SceneBuilder = (el) => {
  const fill = one(el, "route-fill");
  const stops = all(el, "stop");
  const plane = one(el, "plane");
  const question = one(el, "question");
  const choices = all(el, "choice");
  const pick = one(el, "pick");
  const postcard = one(el, "postcard");
  const stamp = one(el, "stamp");
  const faces = all(el, "face");
  const dest = one(el, "dest");
  const destImg = one(el, "dest-img");
  const tiles = all(el, "tile");
  const checks = all(el, "agency").map(checkParts);
  const leg = 1 / STOPS;

  gsap.set(fill, { scaleX: 0 });
  gsap.set(plane, { x: 0, xPercent: 0 });
  gsap.set(stops, { "--done": 0 });
  gsap.set(question, { opacity: 0, y: 14 });
  gsap.set(choices, { opacity: 0, scale: 0.6 });
  gsap.set(pick, { "--on": 0 });
  gsap.set(postcard, { opacity: 0, y: 16, rotation: -4, rotationY: -32, transformPerspective: 1100 });
  gsap.set(stamp, { opacity: 0, scale: 1.6, rotation: -12 });
  gsap.set(faces, { opacity: 0, scale: 0.5, xPercent: (i: number) => (MIDDLE - i) * 40 });
  gsap.set(dest, { opacity: 0, yPercent: 10, rotation: 6 });
  gsap.set(destImg, { scale: 1.12 });
  gsap.set(tiles, { opacity: 0, scale: 0.6, y: 10 });
  gsap.set(checks.map((c) => c.fill), { scale: 0, opacity: 0 });
  gsap.set(checks.map((c) => c.mark), { strokeDashoffset: 1 });

  const tl = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    // 1. Le test : la phrase, ses cinq ronds, la réponse ; l'avion avance vers la première escale.
    .to(question, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(choices, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 }, 0.3)
    .to(pick, { "--on": 1, duration: 0.5 }, 0.85)
    .to(fill, { scaleX: leg, duration: 1.1, ease: "power2.inOut" }, 0.25)
    .to(plane, { xPercent: leg * 100, duration: 1.1, ease: "power2.inOut" }, 0.25)
    .to(stops[0] ?? [], { "--done": 1, duration: 0.4, ease: "power2.out" }, 1.25)
    // 2. Le profil (à 1,45 s, content/apps.ts) : la carte postale se retourne, le timbre se pose comme un tampon.
    .to(question, { opacity: 0, y: -10, duration: 0.24, ease: "power2.in" }, 1.45)
    .to(postcard, { opacity: 1, y: 0, rotation: 0, rotationY: 0, duration: 0.9 }, 1.6)
    .to(stamp, { opacity: 1, scale: 0.94, rotation: -3, duration: 0.45, ease: "power3.out" }, 1.95)
    .to(stamp, { scale: 1, rotation: 0, duration: 0.25 }, 2.35)
    // Le troisième temps commence à 2,6 s (content/apps.ts) : la carte s'en va à ce moment-là.
    .to(postcard, { opacity: 0, scale: 0.92, y: -12, duration: 0.32, ease: "power2.in" }, 2.6)
    // 3. Le groupe, la destination, et ce dont Escapades Libres s'occupe ; l'avion finit le tracé.
    .to(faces, { opacity: 1, scale: 1, xPercent: 0, duration: 0.9, stagger: 0.07 }, 2.8)
    .to(fill, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 3)
    .to(plane, { xPercent: 100, duration: 1, ease: "power2.inOut" }, 3)
    .to(stops.slice(1), { "--done": 1, duration: 0.4, ease: "power2.out", stagger: 0.42 }, 3.45)
    .to(dest, { opacity: 1, yPercent: 0, rotation: 0, duration: 1 }, 3.1)
    .to(destImg, { scale: 1, duration: 1.4 }, 3.1)
    .to(tiles, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08 }, 3.45);
  checks.forEach((c, i) => {
    const t = 3.7 + i * 0.1;
    tl.to(c.fill, { scale: 1, opacity: 1, duration: 0.5 }, t).to(c.mark, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, t + 0.1);
  });
  return tl;
};

/** « Comment ça marche » de Escapades Libres, monté autour de son écran (chargé à part : ./registry). */
export default function EscapadesChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildEscapades} tint={styles.scene} sample={"bottom"}>
      <EscapadesScene />
    </HowItWorks>
  );
}
