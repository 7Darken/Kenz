"use client";

/**
 * Le total des utilisateurs, toutes apps confondues : jamais près d'un astre (ce n'est le chiffre d'aucune app).
 * À sa première apparition de la visite, une micro-animation discrète : chaque chiffre monte de sous sa ligne de base,
 * l'un après l'autre de gauche à droite (sans flou) ; « + » et « utilisateurs » se posent ensuite. Puis `onDone` : la
 * scène allume tous les astres ensemble. Tout se joue en CSS (une transition de `transform` par chiffre).
 * Sans JS, en mouvement réduit, déjà vu ou déjà à l'écran au chargement : le total, tout de suite.
 * Les lecteurs d'écran lisent la phrase complète.
 */
import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import { useInView } from "@/design-system/motion/use-in-view";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import type { Lang } from "@/i18n/config";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./apps-space.module.css";

/** Le format des nombres : espace fine en français (13 000), virgule en anglais (13,000). */
const LOCALES: Readonly<Record<Lang, string>> = { fr: "fr-FR", en: "en-US" };
const SEEN_KEY = "kz-apps-total";
const RISE_MS = 900; // la montée d'un chiffre (même valeur que le CSS)
const STAGGER_MS = 70; // d'un chiffre au suivant, de gauche à droite

type Char = { ch: string; style?: undefined } | { ch: string; style: CSSProperties };

/** Les caractères du total ; un chiffre porte son retard (`--delay`). */
function toChars(total: string): { chars: Char[]; lastDelay: number } {
  let k = 0;
  const chars = [...total].map((ch): Char => {
    if (!/\d/.test(ch)) return { ch };
    const delay = k * STAGGER_MS;
    k += 1;
    return { ch, style: { "--delay": `${delay}ms` } as CSSProperties };
  });
  return { chars, lastDelay: Math.max(0, k - 1) * STAGGER_MS };
}

function seenBefore() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* stockage indisponible : l'animation ne se rejoue pas pour la page */
  }
}

/** Déjà (même en partie) à l'écran : on n'anime pas un chiffre que le visiteur a sous les yeux. */
function onScreen(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

interface AppsTotalProps {
  value: number;
  /** L'animation est finie (ou n'a pas lieu) : l'ensemble s'allume. */
  onDone: () => void;
}

export function AppsTotal({ value, onDone }: AppsTotalProps) {
  const { lang, t } = useLanguage();
  const s = t.pro.space.users;
  const rootRef = useRef<HTMLParagraphElement>(null);
  /** init : rien décidé ; armed : les chiffres attendent d'être vus ; done : joué (ou n'a pas lieu). */
  const phase = useRef<"init" | "armed" | "done">("init");
  const reduced = useReducedMotion();
  // Entièrement visible, bien dans l'écran : la scène s'est déjà allumée autour de lui.
  const inView = useInView(rootRef, { threshold: 1, rootMargin: "0px 0px -15% 0px" });
  const total = useMemo(() => new Intl.NumberFormat(LOCALES[lang]).format(value), [lang, value]);
  const { chars, lastDelay } = useMemo(() => toChars(total), [total]);
  const [before, after = ""] = s.amount.split("{n}");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || phase.current === "done") return;
    if (phase.current === "init") {
      if (reduced || seenBefore() || onScreen(root)) {
        phase.current = "done";
        return;
      }
      phase.current = "armed";
      root.dataset.rise = "armed";
    }
    if (reduced) {
      phase.current = "done";
      delete root.dataset.rise;
      return;
    }
    if (!inView) return;
    phase.current = "done";
    markSeen();
    // Une image entre la position de départ et le départ : la transition part bien de là.
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      root.dataset.rise = "go";
      timer = window.setTimeout(() => {
        delete root.dataset.rise;
        onDone();
      }, RISE_MS + lastDelay + 60);
    });
    // Interrompu (langue, mouvement réduit, démontage) : le total, tout de suite.
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      delete root.dataset.rise;
    };
  }, [inView, reduced, lastDelay, onDone]);

  return (
    <p ref={rootRef} className={styles.total} aria-live="off">
      <span className="sr">{format(s.full, { n: total })}</span>
      <span className={styles.totalVal} aria-hidden="true">
        {before ? <span className={styles.totalAff}>{before}</span> : null}
        {chars.map(({ ch, style }, i) =>
          style ? (
            <span key={i} className={styles.digit} style={style}>
              <span className={styles.digitIn}>{ch}</span>
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
        {after ? <span className={styles.totalAff}>{after}</span> : null}
      </span>
      <span className={styles.totalLeg} aria-hidden="true">
        {s.label}
      </span>
    </p>
  );
}
