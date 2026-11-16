"use client";

/**
 * Miru : le thème s'écrit dans le champ des thèmes IA, le personnage IA de l'app crée les cartes (leur vrai dos
 * « MIRU. »), elles se battent puis se distribuent aux cinq joueurs (des personnages des jeux de l'app), et le
 * téléphone passe de main en main, ouvert sur l'écran « Glisse » de l'app. Couleurs, police (Nunito) et pièces :
 * celles de l'app (miru/src/design/tokens, docs/miruv2/mockups/kit.css).
 */
import { Nunito } from "next/font/google";
import Image from "next/image";
import type { CSSProperties } from "react";

import { MIRU_SAMPLE } from "@/content/app-scenes";
import type { App } from "@/content/apps";
import { gsap } from "@/design-system/motion/gsap";
import { getQuality } from "@/design-system/motion/quality";
import { useTranslation } from "@/i18n/language-provider";
import { all, one, type SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./miru-scene.module.css";

/** La police de l'app, chargée avec sa scène seule. */
const nunito = Nunito({ subsets: ["latin"], weight: ["800", "900"], display: "swap", preload: false });

/** Une position en cqw, et son inclinaison en degrés. */
type Point = readonly [x: number, y: number, tilt?: number];

/** Le centre de la table (cqw) : la pioche, puis le téléphone posé au milieu. */
const TABLE: Point = [50, 72];
/** Tailles (cqw) d'une carte et du téléphone, comme dans le CSS ; la carte distribuée est réduite. */
const CARD: Point = [13, 17];
const CARD_DEALT = 0.72;
const PHONE: Point = [15, 31];

/** Les cinq places (cqw) : le joueur, sa carte posée devant lui, et le téléphone quand il l'a en main (les trois premiers). */
const SEATS: readonly { player: Point; card: Point; phone?: Point }[] = [
  { player: [50, 38], card: [50, 52.5, -4], phone: [50, 59, -5] },
  { player: [82.3, 61.5], card: [68.7, 66, 9], phone: [66.5, 67, 7] },
  { player: [70, 99.5], card: [61.6, 88, 13], phone: [57.5, 82.5, 8] },
  { player: [30, 99.5], card: [38.4, 88, -11] },
  { player: [17.7, 61.5], card: [31.3, 66, -8] },
];
const HANDS = SEATS.flatMap((seat) => (seat.phone ? [seat.phone] : []));
/** Le téléphone finit chez le dernier joueur qui l'a en main : c'est sa place dans le CSS. */
const LAST = HANDS.length - 1;
const REST = HANDS[LAST] ?? TABLE;

/** Une pièce placée par ses variables (--x, --y en cqw, --r en degrés) : le CSS la pose, la timeline part de là. */
const at = ([x, y, tilt]: Point) => ({ "--x": x, "--y": y, ...(tilt === undefined ? {} : { "--r": `${tilt}deg` }) }) as CSSProperties;
const tone = (color: string) => ({ "--a": color }) as CSSProperties;
/** Un écart en cqw, en pourcentage de la taille de la pièce (xPercent / yPercent : suit le redimensionnement). */
const pct = (delta: number, size: number) => (delta / size) * 100;

export function MiruScene({ name }: { name: string }) {
  const s = useTranslation().apps.scenes.miru;
  const { players, ai } = MIRU_SAMPLE;
  return (
    <div className={`${styles.app} ${nunito.className}`}>
      <div className={styles.field}>
        <span className={styles.fieldText}>
          <span className={styles.fieldLabel}>{s.theme}</span>
          <span className={styles.type}>
            {Array.from(s.typed).map((char, index) => (
              <span key={index} data-s="char">
                {char}
              </span>
            ))}
            <i className={styles.caret} data-s="caret" />
          </span>
        </span>
        <span className={styles.create} data-s="create">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" />
          </svg>
        </span>
      </div>
      <Image className={styles.ai} src={ai.src} width={ai.width} height={ai.height} alt="" sizes="180px" data-s="ai" />
      {SEATS.map((seat, index) => (
        <span key={index} className={styles.card} style={at(seat.card)} data-s="card">
          <b className={styles.brand}>
            {name}
            <i />
          </b>
        </span>
      ))}
      {SEATS.map((seat, index) => {
        const player = players[index];
        if (!player) return null;
        return (
          <span key={index} className={styles.seat} style={at(seat.player)} data-s="seat" data-held={index === LAST ? "" : undefined}>
            <span className={styles.avatar} style={tone(player.color)}>
              <Image src={player.face.src} width={player.face.width} height={player.face.height} alt="" sizes="80px" />
            </span>
            <i className={styles.ring} data-s="ring" />
          </span>
        );
      })}
      <span className={styles.phone} style={at(REST)} data-s="phone">
        <span className={styles.screen}>
          <span className={styles.lid}>
            <span className={styles.lidFace}>
              {HANDS.map((_, index) => {
                const player = players[index];
                return player ? (
                  <span key={index} className={styles.avatar} style={tone(player.color)} data-s="phone-face">
                    <Image src={player.face.src} width={player.face.width} height={player.face.height} alt="" sizes="40px" />
                  </span>
                ) : null;
              })}
            </span>
            <span className={styles.hint}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 15l6-6 6 6" />
              </svg>
              {s.swipe}
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}

export const buildMiru: SceneBuilder = (el) => {
  const chars = all(el, "char");
  const caret = one(el, "caret");
  const create = one(el, "create");
  const ai = one(el, "ai");
  const cards = all(el, "card");
  const seats = all(el, "seat");
  const rings = all(el, "ring");
  const phone = one(el, "phone");
  const faces = all(el, "phone-face");
  // Appareil modeste : les cartes vont droit aux joueurs, sans se battre.
  const lite = getQuality() === "low";
  const deckX = (i: number) => pct(TABLE[0] - (SEATS[i]?.card[0] ?? TABLE[0]), CARD[0]);
  const deckY = (i: number) => pct(TABLE[1] - (SEATS[i]?.card[1] ?? TABLE[1]), CARD[1]);
  const phoneX = (p: Point) => pct(p[0] - REST[0], PHONE[0]);
  const phoneY = (p: Point) => pct(p[1] - REST[1], PHONE[1]);

  gsap.set(chars, { display: "none" });
  gsap.set(caret, { opacity: 1 });
  gsap.set(create, { scale: 1 });
  gsap.set(ai, { autoAlpha: 0, yPercent: 8, scale: 0.9 });
  gsap.set(cards, { xPercent: deckX, yPercent: deckY, rotation: 0, scale: 0.7, opacity: 0 });
  gsap.set(seats, { opacity: 0.35, scale: 0.9 });
  gsap.set(rings, { opacity: 0 });
  gsap.set(faces, { opacity: (i: number) => (i === 0 ? 1 : 0) });
  gsap.set(phone, { xPercent: phoneX(TABLE), yPercent: phoneY(TABLE), rotation: 0, opacity: 0, scale: 0.8 });

  const tl = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(chars, { display: "inline", duration: 0, stagger: 0.034 }, 0.15)
    .to(seats, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06 }, 0.25)
    .to(ai, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.9 }, 0.3)
    // Le thème est écrit : « Créer », et le personnage IA sort les cartes.
    .to(create, { scale: 0.86, duration: 0.12, ease: "power2.out" }, 1)
    .to(create, { scale: 1, duration: 0.6 }, 1.12)
    .to(caret, { opacity: 0, duration: 0.2 }, 1.1)
    .to(cards, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05 }, 1.1)
    .to(ai, { autoAlpha: 0, yPercent: 6, scale: 0.92, duration: 0.45, ease: "expo.in" }, 1.15);
  if (!lite) {
    tl.to(cards, { xPercent: (i: number) => deckX(i) + (i % 2 ? 58 : -58), rotation: (i: number) => (i % 2 ? 8 : -8), duration: 0.28, ease: "power2.out" }, 1.35).to(
      cards,
      { xPercent: deckX, yPercent: (i: number) => deckY(i) - i * 4, rotation: (i: number) => (i - 2) * 2, duration: 0.32, ease: "power3.inOut", stagger: 0.03 },
      1.65,
    );
  }
  tl.to(cards, { xPercent: 0, yPercent: 0, rotation: (i: number) => SEATS[i]?.card[2] ?? 0, scale: CARD_DEALT, duration: 0.7, stagger: 0.09 }, 2).to(
    phone,
    { opacity: 1, scale: 1, duration: 0.5 },
    2.6,
  );
  // Le téléphone passe de main en main : l'anneau de l'app suit celui qui l'a, l'écran montre son avatar.
  HANDS.forEach((hand, k) => {
    const t = 2.85 + k * 0.36;
    tl.to(phone, { xPercent: phoneX(hand), yPercent: phoneY(hand), rotation: hand[2] ?? 0, duration: 0.4, ease: "power3.inOut" }, t)
      .to(rings[k] ?? [], { opacity: 1, duration: 0.3 }, t + 0.28)
      .to(seats[k] ?? [], { scale: 1.1, duration: 0.5 }, t + 0.28);
    if (k > 0) {
      tl.to(faces[k] ?? [], { opacity: 1, duration: 0.25, ease: "power2.out" }, t + 0.15)
        .to(faces[k - 1] ?? [], { opacity: 0, duration: 0.25, ease: "power2.out" }, t + 0.15)
        .to(rings[k - 1] ?? [], { opacity: 0, duration: 0.2 }, t + 0.1)
        .to(seats[k - 1] ?? [], { scale: 1, duration: 0.4 }, t + 0.1);
    }
  });
  return tl;
};

/** « Comment ça marche » de Miru, monté autour de son écran (chargé à part : ./registry). */
export default function MiruChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildMiru} tint={styles.scene} sample={"bottom"}>
      <MiruScene name={app.name} />
    </HowItWorks>
  );
}
