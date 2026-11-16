"use client";

/**
 * Le total des utilisateurs, toutes apps confondues : sous l'en-tête de la scène, jamais près d'un astre (ce n'est le
 * chiffre d'aucune app). À sa première apparition de la visite, il monte de 0 au total (1,6 s, expo.out), puis
 * `onDone` : la scène allume tous les astres ensemble. Sans JS, en mouvement réduit ou déjà vu : le total, tout de suite.
 * Le total rendu par React reste en place (il réserve la largeur, il suit la langue) ; le chiffre qui monte est un
 * calque écrit à la main par-dessus, le temps du compte. Les lecteurs d'écran lisent la phrase complète, jamais lui.
 */
import { useEffect, useMemo, useRef } from "react";

import { gsap } from "@/design-system/motion/gsap";
import { useInView } from "@/design-system/motion/use-in-view";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import type { Lang } from "@/i18n/config";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./apps-space.module.css";

/** Le format des nombres : espace fine en français (13 000), virgule en anglais (13,000). */
const LOCALES: Readonly<Record<Lang, string>> = { fr: "fr-FR", en: "en-US" };
const SEEN_KEY = "kz-apps-total";
const COUNT_S = 1.6;

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
    /* stockage indisponible : le compte ne se rejoue pas pour la page */
  }
}

interface AppsTotalProps {
  value: number;
  /** Le compte est fini : l'ensemble s'allume. */
  onDone: () => void;
}

export function AppsTotal({ value, onDone }: AppsTotalProps) {
  const { lang, t } = useLanguage();
  const s = t.pro.space.users;
  const rootRef = useRef<HTMLParagraphElement>(null);
  const runRef = useRef<HTMLSpanElement>(null);
  /** init : rien décidé ; armed : le 0 attend d'être vu ; done : le compte est joué (ou n'a pas lieu). */
  const phase = useRef<"init" | "armed" | "done">("init");
  const reduced = useReducedMotion();
  // Entièrement visible, bien dans l'écran : la scène s'est déjà allumée autour de lui.
  const inView = useInView(rootRef, { threshold: 1, rootMargin: "0px 0px -20% 0px" });
  const fmt = useMemo(() => new Intl.NumberFormat(LOCALES[lang]), [lang]);
  const total = fmt.format(value);
  const [before, after = ""] = s.amount.split("{n}");

  useEffect(() => {
    const root = rootRef.current;
    const run = runRef.current;
    if (!root || !run || phase.current === "done") return;
    if (phase.current === "init") {
      if (reduced || seenBefore()) {
        phase.current = "done";
        return;
      }
      phase.current = "armed";
    }
    if (reduced) {
      phase.current = "done";
      root.removeAttribute("data-run");
      return;
    }
    run.textContent = fmt.format(0);
    root.setAttribute("data-run", "");
    if (!inView) return;
    phase.current = "done";
    markSeen();
    const count = { v: 0 };
    const tween = gsap.to(count, {
      v: value,
      duration: COUNT_S,
      ease: "expo.out",
      onUpdate: () => {
        run.textContent = fmt.format(Math.round(count.v));
      },
      onComplete: () => {
        root.removeAttribute("data-run");
        onDone();
      },
    });
    // Interrompu (langue, mouvement réduit, démontage) : le total, tout de suite.
    return () => {
      tween.kill();
      root.removeAttribute("data-run");
    };
  }, [inView, reduced, fmt, value, onDone]);

  return (
    <p ref={rootRef} className={styles.total} aria-live="off">
      <span className="sr">{format(s.full, { n: total })}</span>
      <span className={styles.totalVal} aria-hidden="true">
        {before ? <span className={styles.totalAff}>{before}</span> : null}
        <span className={styles.totalNum}>
          <span className={styles.totalFin}>{total}</span>
          <span className={styles.totalRun} ref={runRef} />
        </span>
        {after ? <span className={styles.totalAff}>{after}</span> : null}
      </span>
      <span className={styles.totalLeg} aria-hidden="true">
        {s.label}
      </span>
    </p>
  );
}
