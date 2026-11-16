"use client";

/**
 * La barre des jours, en bas de l'écran : elle prend le relais du calendrier une fois qu'il est passé, pour changer
 * de jour sans remonter. Précédent / suivant (44 px, au clavier) ; entre les deux, les 14 jours en filets de la
 * couleur de leur ville, cliquables à la souris ou au doigt (le calendrier et les flèches font la même chose au
 * clavier) ; puis le jour et la ville en cours.
 */
import type { CSSProperties, MouseEvent } from "react";

import type { Itinerary } from "@/content/itineraries";
import { IconButton } from "@/design-system/components/icon-button";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./day-dock.module.css";
import { cityOf } from "./trip";

interface DayDockProps {
  itinerary: Itinerary;
  currentDay: number;
  visible: boolean;
  onNavigate: (day: number) => void;
}

export function DayDock({ itinerary, currentDay, visible, onNavigate }: DayDockProps) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const total = itinerary.days.length;
  const city = cityOf(itinerary, itinerary.days[currentDay - 1].city);

  const pick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-day]");
    if (target) onNavigate(Number(target.dataset.day));
  };

  return (
    <div
      className={styles.dock}
      role="group"
      aria-label={s.planner.dock}
      data-visible={visible ? "" : undefined}
      inert={!visible}
    >
      <IconButton
        icon="arrow-left"
        label={s.day.prev}
        size="sm"
        className={styles.arrow}
        disabled={currentDay === 1}
        onClick={() => onNavigate(currentDay - 1)}
      />
      <div className={styles.track} aria-hidden="true" onClick={pick}>
        {itinerary.days.map((day, index) => {
          const number = index + 1;
          return (
            <span
              key={number}
              className={styles.segment}
              style={{ "--c": cityOf(itinerary, day.city).color } as CSSProperties}
              data-day={number}
              data-state={number === currentDay ? "current" : number < currentDay ? "past" : undefined}
            >
              <span className={styles.segmentLabel}>
                {s.planner.dayShort}
                {number}
              </span>
            </span>
          );
        })}
      </div>
      <span className={styles.where} style={{ "--c": city.color } as CSSProperties}>
        <span className="sr">
          {s.planner.dayLabel} {currentDay} {s.planner.of} {total},{" "}
        </span>
        {localize(city.name, lang)}
      </span>
      <IconButton
        icon="arrow-right"
        label={s.day.next}
        size="sm"
        className={styles.arrow}
        disabled={currentDay === total}
        onClick={() => onNavigate(currentDay + 1)}
      />
    </div>
  );
}
