"use client";

/** Miru : le thème s'écrit, les cartes se battent puis se distribuent à cinq joueurs, un téléphone passe de main en main. */
import { gsap } from "@/features/motion/gsap";
import { useTranslation } from "@/i18n/language-provider";
import { all, one, type SceneBuilder } from "./scene-kit";
import styles from "./miru-scene.module.css";

/** Les cinq joueurs (visages au trait, couleurs douces) : fond, cheveux, encre, bouche. */
const PLAYERS = [
  { bg: "#FFB86B", hair: "M5 17c2-8 8-13 15-13s13 5 15 13c-5-3-9-4-15-4S10 14 5 17z", hairFill: "#7A4A1E", hairOpacity: 0.55, ink: "#2A1C3D", eyeY: 21, mouth: "M15.5 27q4.5 3.5 9 0" },
  { bg: "#7FD1C7", hair: "M6 15c3-7 8-11 14-11 7 0 12 5 14 12-6-4-10-1-14-5-4 4-9 2-14 4z", hairFill: "#1F4F4A", hairOpacity: 0.55, ink: "#16302E", eyeY: 21, mouth: "M16 27h8" },
  { bg: "#B9A5FF", hair: "M4 22c0-11 7-18 16-18s16 7 16 18c-3-5-8-8-16-8S7 17 4 22z", hairFill: "#3B2A7A", hairOpacity: 0.5, ink: "#221A45", eyeY: 22, mouth: "M15.5 28q4.5 3.5 9 0" },
  { bg: "#FFA493", hair: "M8 13c3-6 7-9 12-9s9 3 12 9c-4-2-8-2-12-2s-8 0-12 2z", hairFill: "#6B2A22", hairOpacity: 0.5, ink: "#3A1A16", eyeY: 21, mouth: "M15.5 26.5q4.5 4 9 0" },
  { bg: "#8EC5FF", hair: "M5 18c1-9 7-14 15-14s14 5 15 14c-4-4-8-6-15-6S9 14 5 18z", hairFill: "#1E3F66", hairOpacity: 0.5, ink: "#14263D", eyeY: 21, mouth: "M15.5 27q4.5 3 9 0" },
] as const;

const AV_CLASS = [styles.av0, styles.av1, styles.av2, styles.av3, styles.av4];
const CARD_CLASS = [styles.card0, styles.card1, styles.card2, styles.card3, styles.card4];

/** Où vont les cartes (x %, y %, rotation) et où passe le téléphone (x %, y %). */
const DEAL = [
  [0, -250.75, -6],
  [318, -77.5, 10],
  [196.5, 202.8, 14],
  [-196.5, 202.8, -12],
  [-318, -77.5, -9],
] as const;
const HANDS = [
  [0, -116.9],
  [197.6, -36.1],
  [122.1, 94.5],
] as const;

export function MiruScene() {
  const s = useTranslation().apps.scenes.miru;
  return (
    <>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>{s.theme}</span>
        <span className={styles.type}>
          <span>
            {Array.from(s.typed).map((char, index) => (
              <span key={index} data-s="char">
                {char}
              </span>
            ))}
          </span>
          <i className={styles.caret} data-s="caret" />
        </span>
      </div>
      {CARD_CLASS.map((cls, index) => (
        <span key={index} className={`${styles.card} ${cls}`} data-s="card" />
      ))}
      {PLAYERS.map((p, index) => (
        <span key={index} className={`${styles.av} ${AV_CLASS[index]}`} data-s="avatar">
          <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
            <circle cx="20" cy="20" r="20" fill={p.bg} />
            <path d={p.hair} fill={p.hairFill} opacity={p.hairOpacity} />
            <circle cx="15" cy={p.eyeY} r="1.8" fill={p.ink} />
            <circle cx="25" cy={p.eyeY} r="1.8" fill={p.ink} />
            <path d={p.mouth} stroke={p.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
          <i className={styles.hi} data-s="highlight" />
        </span>
      ))}
      <span className={styles.phone} data-s="phone">
        <i />
      </span>
    </>
  );
}

export const buildMiru: SceneBuilder = (el) => {
  const chars = all(el, "char");
  const caret = one(el, "caret");
  const cards = all(el, "card");
  const avatars = all(el, "avatar");
  const highlights = all(el, "highlight");
  const phone = one(el, "phone");
  gsap.set(chars, { display: "none" });
  gsap.set(caret, { opacity: 1 });
  gsap.set(cards, { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 0 });
  gsap.set(avatars, { opacity: 0.35, scale: 0.9 });
  gsap.set(highlights, { opacity: 0 });
  gsap.set(phone, { x: 0, y: 0, xPercent: 0, yPercent: 0, opacity: 0, scale: 0.8 });
  const tl = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(chars, { display: "inline", duration: 0, stagger: 0.034 }, 0.15)
    .to(avatars, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06 }, 0.25)
    .to(caret, { opacity: 0, duration: 0.2 }, 1.1)
    .to(cards, { opacity: 1, duration: 0.3, stagger: 0.03 }, 1.1)
    .to(cards, { xPercent: (i: number) => (i % 2 ? 58 : -58), rotation: (i: number) => (i % 2 ? 8 : -8), duration: 0.28, ease: "power2.out" }, 1.3)
    .to(cards, { xPercent: 0, rotation: (i: number) => (i - 2) * 2, yPercent: (i: number) => -i * 4, duration: 0.32, ease: "power3.inOut", stagger: 0.03 }, 1.6)
    .to(
      cards,
      {
        xPercent: (i: number) => DEAL[i]?.[0] ?? 0,
        yPercent: (i: number) => DEAL[i]?.[1] ?? 0,
        rotation: (i: number) => DEAL[i]?.[2] ?? 0,
        scale: 0.75,
        duration: 0.7,
        stagger: 0.09,
      },
      2.0,
    )
    .to(phone, { opacity: 1, scale: 1, duration: 0.5 }, 2.6);
  HANDS.forEach(([x, y], k) => {
    const t = 2.85 + k * 0.36;
    tl.to(phone, { xPercent: x, yPercent: y, duration: 0.4, ease: "power3.inOut" }, t).to(highlights[k] ?? [], { opacity: 1, duration: 0.3 }, t + 0.28);
    if (k > 0) tl.to(highlights[k - 1] ?? [], { opacity: 0, duration: 0.2 }, t + 0.1);
  });
  return tl;
};
