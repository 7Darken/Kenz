"use client";

/**
 * « Le vrai prix » (voyage.html, `#prix`) : ce que j'ai payé en Chine, en tickets. Sur ordinateur (hors mouvement
 * réduit), la scène est épinglée et les tickets s'empilent au défilement (un par 52 % d'écran) ; ailleurs, chaque
 * ticket entre à l'écran seul.
 */
import { useRef, useState, type CSSProperties } from "react";

import { PRICE_TICKETS } from "@/content/series";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { ScrollTrigger } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import page from "@/design-system/styles/univers-page.module.css";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { T } from "@/i18n/text";
import styles from "./price-section.module.css";
import { PriceTicket } from "./price-ticket";

const PIN = "(min-width: 900px) and (min-height: 600px)";
const COUNT = PRICE_TICKETS.length;

export function PriceSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pinnable = useMediaQuery(PIN);
  const reduced = useReducedMotion();
  const pinned = pinnable && !reduced;
  const [step, setStep] = useState(0);

  // Le nombre de tickets posés suit la traversée de la section (du haut à 20 % de l'écran au bas à 120 %).
  useGsap(
    () => {
      const section = stageRef.current?.parentElement;
      if (!pinned || !section) return;
      const apply = (self: ScrollTrigger) =>
        setStep(self.progress <= 0 && !self.isActive ? 0 : Math.min(COUNT, Math.floor(self.progress * 6.6) + 1));
      ScrollTrigger.create({
        trigger: section,
        start: "top 20%",
        end: "bottom 120%",
        onUpdate: apply,
        onToggle: apply,
        onRefresh: apply,
      });
    },
    stageRef,
    [pinned],
  );

  return (
    <Section
      id="prix"
      aura="droite"
      fil={pinned ? "none" : "auto"}
      className={`${page.chapter} ${styles.section}`}
      aria-labelledby="prix-title"
      data-pinned={pinned ? "" : undefined}
    >
      <div ref={stageRef} className={styles.stage}>
        <Container className={styles.grid}>
          <header className={styles.head}>
            <SweepTitle id="prix-title" text={{ k: "voyage.prix.title" }} className={page.title} />
            <Words className={`${page.lead} ${styles.lead}`} text={{ k: "voyage.prix.lead" }} glow />
          </header>
          <ol className={styles.deck} role="list" style={{ "--s": Math.max(0, step - 1) } as CSSProperties}>
            {PRICE_TICKETS.map((ticket, index) => (
              <PriceTicket
                key={ticket.icon}
                ticket={ticket}
                index={index}
                shown={pinned ? index < step : undefined}
                under={pinned && index < step - 1}
              />
            ))}
          </ol>
          <Reveal variant="fade" as="p" className={styles.note}>
            <T k="voyage.prix.note" />
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
