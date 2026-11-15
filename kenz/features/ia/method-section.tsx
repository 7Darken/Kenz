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
import { ScrollTrigger } from "@/features/motion/gsap";
import { useGsap } from "@/features/motion/use-gsap";
import { useInView } from "@/features/motion/use-in-view";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { SectionTitle } from "./section-title";
import styles from "./method-section.module.css";

/** La progression (0 → 1) à laquelle chaque étape s'allume : en ligne (≥ 900 px), puis en colonne. */
const LIT_AT = { row: [0.01, 0.35, 0.69], column: [0.01, 0.45, 0.9] } as const;

export function MethodSection() {
  const { t, lang } = useLanguage();
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Le titre est masqué par son balayage : on observe sa boîte, qui ne l'est pas.
  const titleIn = useInView(titleBoxRef);
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
        <div ref={titleBoxRef}>
          <SectionTitle id="methode-t" className={styles.title} data-in={titleIn ? "" : undefined}>
            {t.agents.method.title}
          </SectionTitle>
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
