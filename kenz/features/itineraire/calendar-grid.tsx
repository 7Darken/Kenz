"use client";

/**
 * Le calendrier : une case par jour (numéro, pictogramme, date si le départ est choisi, le moment fort, la ville ;
 * en bas, le filet de la ville quittée vers la ville du jour). C'est une liste d'onglets qui commande le jour ouvert :
 * un seul arrêt de tabulation, les flèches passent d'un jour à l'autre (↑ ↓ d'une semaine), Début et Fin aux bornes.
 * Les cases s'allument une à une à l'entrée à l'écran.
 */
import { useRef, type CSSProperties, type KeyboardEvent } from "react";

import type { Itinerary } from "@/content/itineraries";
import { useInView } from "@/design-system/motion/use-in-view";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./calendar-grid.module.css";
import { addDays, formatDate, padDay } from "./format";
import { TripIcon } from "./icons";
import { cityOf } from "./trip";

/** Le jour ouvert (l'onglet) et son panneau. */
export const dayTabId = (day: number) => `jour-onglet-${day}`;
export const DAY_PANEL_ID = "jour-ouvert";

const STEPS: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };

interface CalendarGridProps {
  itinerary: Itinerary;
  currentDay: number;
  startDate: Date | null;
  /** Un clic sur un jour : il s'ouvre et l'écran le montre. */
  onSelect: (day: number) => void;
  /** Le clavier dans le calendrier : le jour s'ouvre, l'écran reste sur le calendrier. */
  onMove: (day: number) => void;
}

export function CalendarGrid({ itinerary, currentDay, startDate, onSelect, onMove }: CalendarGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const total = itinerary.days.length;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = STEPS[event.key];
    const target =
      step !== undefined ? currentDay + step : event.key === "Home" ? 1 : event.key === "End" ? total : null;
    if (target === null) return;
    // Pris ici : le raccourci ← → de la page ne doit pas rejouer le geste.
    event.preventDefault();
    if (target < 1 || target > total) return;
    onMove(target);
    requestAnimationFrame(() => document.getElementById(dayTabId(target))?.focus());
  };

  return (
    <div
      ref={ref}
      className={styles.grid}
      role="tablist"
      aria-label={s.planner.days}
      data-in={inView ? "" : undefined}
      onKeyDown={onKeyDown}
    >
      {itinerary.days.map((day, index) => {
        const number = index + 1;
        const city = cityOf(itinerary, day.city);
        const from = day.travel ? cityOf(itinerary, day.travel.from) : city;
        const selected = number === currentDay;
        const date = startDate ? formatDate(addDays(startDate, index), lang, { weekday: "short", day: "numeric", month: "short" }) : null;
        const highlight = localize(day.highlight, lang);
        const cityName = localize(city.name, lang);
        const label = [`${s.planner.dayLabel} ${number}`, date, highlight, cityName].filter(Boolean).join(", ");

        return (
          <button
            key={number}
            id={dayTabId(number)}
            type="button"
            role="tab"
            className={styles.cell}
            style={{ "--c": city.color, "--from": from.color, "--i": index } as CSSProperties}
            aria-selected={selected}
            aria-controls={DAY_PANEL_ID}
            aria-label={label}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(number)}
          >
            <span className={styles.top}>
              <span className={styles.number}>{padDay(number)}</span>
              <span className={styles.icon}>
                <TripIcon name={day.icon} />
              </span>
            </span>
            <span className={styles.bottom}>
              {date ? <span className={styles.date}>{date}</span> : null}
              <span className={styles.highlight}>{highlight}</span>
              <span className={styles.city}>
                {day.travel ? <TripIcon name={day.travel.mode} className={styles.mode} /> : null}
                {cityName}
              </span>
            </span>
            <span className={styles.bar} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
