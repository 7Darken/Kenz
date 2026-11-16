"use client";

/**
 * « Comment on avance » (agents.html) : trois temps sur une ligne qui se trace au défilement, du même fil que le rail.
 * Chaque étape s'allume quand la ligne l'atteint. Mouvement réduit : tout est allumé, la ligne pleine.
 */
import { useRef } from "react";

import { IA_METHOD_STEPS } from "@/content/ia";
import { Container } from "@/design-system/components/container";
import { Rich } from "@/design-system/components/rich";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { ScrollTrigger } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./method-section.module.css";
import heading from "./section-title.module.css";

/** La progression (0 → 1) à laquelle chaque étape s'allume : en ligne (≥ 900 px), puis en colonne. */
const LIT_AT = { row: [0.01, 0.35, 0.69], column: [0.01, 0.45, 0.9] } as const;

export function MethodSection() {
  const { t, lang } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const list = listRef.current;
      if (!list) return;
      const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
      const light = (isLit: (index: number) => boolean) =>
        steps.forEach((step, index) => step.toggleAttribute("data-lit", isLit(index)));

      if (reduced) {
        light(() => true);
        return () => light(() => false);
      }
      list.setAttribute("data-scrub", "");
      list.style.setProperty("--sp", "0");
      ScrollTrigger.create({
        trigger: list,
        start: "top 78%",
        end: "bottom 52%",
        scrub: 0.5,
        onUpdate: ({ progress }) => {
          list.style.setProperty("--sp", progress.toFixed(3));
          const thresholds = window.innerWidth >= 900 ? LIT_AT.row : LIT_AT.column;
          light((index) => progress >= thresholds[index]);
        },
      });
      return () => {
        list.removeAttribute("data-scrub");
        list.style.removeProperty("--sp");
        light(() => false);
      };
    },
    listRef,
    [reduced],
  );

  return (
    <Section id="methode" aura="calme" className={styles.section} aria-labelledby="methode-t">
      <Container>
        {/* La boîte du titre : le balayage l'observe (le titre rogné, lui, ne franchit aucun seuil). */}
        <div>
          <SweepTitle variant="pro" id="methode-t" className={heading.title}>
            {t.agents.method.title}
          </SweepTitle>
        </div>
        <div ref={listRef} className={styles.list}>
          <span className={styles.line} aria-hidden="true">
            <i />
          </span>
          <ol className={styles.steps}>
            {IA_METHOD_STEPS.map((step, index) => (
              <li key={index} className={styles.step} data-step="">
                <Rich text={localize(step, lang)} />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
