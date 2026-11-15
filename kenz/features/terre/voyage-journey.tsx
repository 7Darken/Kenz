"use client";

/**
 * Le chapitre « Le voyage » (#voyage) côté client : la section, la scène épinglée, la liste compacte de l'écran
 * statique (« vu une fois »), et le trajet (`createJourney`) branché sur le globe de la scène.
 * Le titre, les escales et la petite route arrivent du serveur (`head`, `stops`, `route`).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ESCALES } from "@/content/series";
import { passageAttributes, ROUTES } from "@/content/site";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { useMotion } from "@/features/motion/motion-provider";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { createJourney, type Journey } from "./journey";
import { STOPS } from "./stops";
import { useTerreScene } from "./terre-scene";
import styles from "./voyage-section.module.css";

interface VoyageJourneyProps {
  titleId: string;
  head: ReactNode;
  stops: ReactNode;
  route: ReactNode;
}

export function VoyageJourney({ titleId, head, stops, route }: VoyageJourneyProps) {
  const reduced = useReducedMotion();
  const { globe, sky } = useTerreScene();
  const { scrollTo } = useMotion();
  const { lang, t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef<HTMLOListElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<Journey | null>(null);
  const sceneRef = useRef({ globe, sky });
  const [choice, setChoice] = useState(STOPS.length - 1);

  useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.parentElement;
    const head = stage?.querySelector<HTMLElement>("[data-voyage-head]");
    const hero = document.getElementById("top");
    if (!stage || !section || !head || !stopsRef.current || !listRef.current || !hero) return;
    const journey = createJourney(
      {
        section,
        stage,
        head,
        stops: stopsRef.current,
        route: stage.querySelector<HTMLElement>("[data-voyage-route]"),
        list: listRef.current,
        hero,
      },
      { reduced, scrollTo: (y, immediate) => scrollTo(y, { immediate }), onChoice: setChoice },
    );
    journeyRef.current = journey;
    journey.attach(sceneRef.current.globe, sceneRef.current.sky);
    return () => {
      journey.destroy();
      journeyRef.current = null;
    };
  }, [reduced, scrollTo]);

  useEffect(() => {
    sceneRef.current = { globe, sky };
    journeyRef.current?.attach(globe, sky);
  }, [globe, sky]);

  return (
    <Section id="voyage" aura="bas" aria-labelledby={titleId} className={styles.voyage}>
      <div ref={stageRef} className={styles.stage}>
        {head}
        <ol ref={stopsRef} className={styles.stops} aria-label={t.createur.voyage.stopsLabel}>
          {stops}
        </ol>
        {route}
        <div ref={listRef} className={styles.list}>
          <ol className={styles.picks} aria-label={t.createur.voyage.pickLabel}>
            {STOPS.map((stop, index) => {
              const escale = ESCALES[stop.id];
              return (
                <li key={stop.id} className={stop.upcoming ? styles.pickUpcoming : undefined}>
                  <button
                    type="button"
                    className={styles.pick}
                    aria-pressed={choice === index}
                    onClick={() => journeyRef.current?.choose(index)}
                  >
                    <span className={styles.pickName}>{localize(escale.country, lang)}</span>
                    <span className={styles.pickWhen}>{stop.upcoming ? t.createur.voyage.next : escale.dates?.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <Button href={ROUTES.voyage} icon="arrow-right" className={styles.listDoor} {...passageAttributes("voyage")}>
            {t.createur.voyage.door}
          </Button>
        </div>
      </div>
    </Section>
  );
}
