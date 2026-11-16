"use client";

/**
 * « Jour par jour » : le calendrier des jours (les villes, la date de départ, l'export agenda), le jour ouvert et la
 * carte du trajet. Le jour suit l'ancre de l'adresse (`#jour-5`) ; les flèches ← → du clavier changent de jour tant
 * que le calendrier est à l'écran ; une fois le calendrier passé, la barre des jours prend le relais en bas de l'écran.
 * Porte « abonnés » fermée : ni raccourcis ni barre.
 */
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import type { Itinerary } from "@/content/itineraries";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { useMotion } from "@/design-system/motion/motion-provider";
import { useInView } from "@/design-system/motion/use-in-view";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import bezel from "@/design-system/styles/bezel.module.css";
import page from "@/design-system/styles/univers-page.module.css";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { CalendarGrid } from "./calendar-grid";
import { DayDetail } from "./day-detail";
import { DayDock } from "./day-dock";
import { formatPrice, parseIsoDate } from "./format";
import { buildCalendar, downloadCalendar, type CalendarEvent } from "./ics";
import { TripIcon } from "./icons";
import styles from "./planner.module.css";
import { RouteMap } from "./route-map";
import { cityOf, cityStops } from "./trip";
import { dayHash, PLANNER_ID, readHashDay, useDayHash } from "./use-day-hash";
import { useHydrated, useStoredState, useSubscriber } from "./use-stored-state";

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
/** La hauteur de la nav fixe, plus un peu d'air : le haut du jour ouvert se cale dessous. */
const NAV_OFFSET = 88;

/** Vrai une fois que l'élément est sorti de l'écran par le haut (dépassé, pas encore atteint). */
function useScrolledPast(ref: RefObject<Element | null>) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return past;
}

type ExportState = "idle" | "needs-date" | "done";

export function Planner({ itinerary }: { itinerary: Itinerary }) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const total = itinerary.days.length;
  const stops = cityStops(itinerary);
  const motion = useMotion();
  const hydrated = useHydrated();
  const { locked } = useSubscriber();

  const [day, setDay] = useDayHash(total);
  const [direction, setDirection] = useState(1);
  const [storedStart, setStoredStart] = useStoredState(`kenz-trip-start:${itinerary.slug}`);
  const startDate = parseIsoDate(storedStart);
  const [exportState, setExportState] = useState<ExportState>("idle");

  const touch = useMediaQuery("(pointer: coarse)");
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const dateFieldRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const plannerInView = useInView(rootRef, { once: false, threshold: 0, rootMargin: "0px" });
  const detailInView = useInView(detailRef, { once: false, threshold: 0, rootMargin: "0px" });
  const calendarPassed = useScrolledPast(calendarRef);
  const currentCityId = itinerary.days[day - 1].city;

  /** Amène le haut du jour ouvert sous la nav, sauf s'il est déjà dans le haut de l'écran. */
  const revealDetail = () => {
    const element = detailRef.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top;
    if (top >= NAV_OFFSET - 8 && top < window.innerHeight * 0.55) return;
    motion.scrollTo(element, { offset: -NAV_OFFSET, immediate: reduced });
  };

  const navigate = (target: number, { reveal = true } = {}) => {
    if (target < 1 || target > total) return;
    if (target !== day) {
      setDirection(target > day ? 1 : -1);
      setDay(target);
    }
    if (reveal) revealDetail();
  };

  // ← → changent de jour tant que le calendrier est à l'écran (hors champs de saisie et porte fermée).
  useEffect(() => {
    if (locked || !plannerInView) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as Element).closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") navigate(day + 1);
      else if (event.key === "ArrowLeft") navigate(day - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Arrivée par un lien vers un jour (#jour-5) : une fois la page ouverte, droit au calendrier.
  // Différé pour passer après la remise en haut de la page qui suit une navigation.
  useEffect(() => {
    if (!hydrated || locked || readHashDay() === null) return;
    const timer = window.setTimeout(() => {
      const planner = document.getElementById(PLANNER_ID);
      if (planner) motion.scrollTo(planner, { immediate: true });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [hydrated, locked, motion]);

  // Le message « Agenda téléchargé » s'efface tout seul.
  useEffect(() => {
    if (exportState !== "done") return;
    const timer = window.setTimeout(() => setExportState("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [exportState]);

  const askForDate = () => {
    setExportState("needs-date");
    const field = dateFieldRef.current;
    if (field && !reduced) {
      field.removeAttribute("data-shake");
      void field.offsetWidth; // relance l'animation
      field.setAttribute("data-shake", "");
    }
    const input = dateInputRef.current;
    input?.focus();
    try {
      input?.showPicker();
    } catch {
      /* showPicker indisponible ou refusé : le focus suffit */
    }
  };

  const exportCalendar = () => {
    if (!startDate) {
      askForDate();
      return;
    }
    const pageUrl = `${window.location.origin}${window.location.pathname}`;
    const events: CalendarEvent[] = itinerary.days.flatMap((tripDay, dayIndex) =>
      tripDay.activities.map((activity, index) => {
        const [hours, minutes] = activity.time.split(":").map(Number);
        const start = new Date(
          startDate.getTime() + dayIndex * DAY_MS + (hours - itinerary.utcOffsetHours) * HOUR_MS + minutes * 60_000,
        );
        const description = [
          localize(activity.description, lang),
          activity.tip && `${s.day.tip} — ${localize(activity.tip, lang)}`,
          activity.price && formatPrice(activity.price, { free: s.day.free, yuan: s.yuan }),
          `${pageUrl}#${dayHash(dayIndex + 1)}`,
        ].filter(Boolean);
        return {
          uid: `${itinerary.slug}-${dayIndex + 1}-${index + 1}@kenzenbien.fr`,
          start,
          end: new Date(start.getTime() + activity.durationMin * 60_000),
          title: `${s.planner.dayShort}${dayIndex + 1} · ${localize(activity.title, lang)}`,
          description: description.join("\n\n"),
          location: activity.place,
        };
      }),
    );
    downloadCalendar(`${itinerary.slug}-itinerary.ics`, buildCalendar(localize(itinerary.title, lang), events));
    setExportState("done");
  };

  const notice =
    exportState === "needs-date" ? s.planner.exportNeedsDate : exportState === "done" ? s.planner.exported : "";

  return (
    <Section
      id={PLANNER_ID}
      aura="gauche"
      className={`${page.chapter} ${styles.planner}`}
      aria-labelledby="planner-title"
      tabIndex={-1}
    >
      <Container>
        <div ref={rootRef}>
          <header className={styles.head}>
            <SweepTitle id="planner-title" text={{ k: "itineraire.planner.title" }} className={page.title} />
            <p className={styles.hint}>{touch ? s.planner.hintTouch : s.planner.hint}</p>
          </header>

          <div ref={calendarRef} className={`${bezel.bezel} ${styles.calendar}`}>
            <div className={`${bezel.core} ${styles.calendarCore}`}>
              <div className={styles.toolbar}>
                <div className={styles.legend} role="group" aria-label={s.planner.cities}>
                  {stops.map((stop) => (
                    <button
                      key={stop.city.id}
                      type="button"
                      className={styles.chip}
                      style={{ "--c": stop.city.color } as CSSProperties}
                      aria-pressed={stop.city.id === currentCityId}
                      onClick={() => navigate(stop.firstDay)}
                    >
                      <span className={styles.chipDot} aria-hidden="true" />
                      {localize(stop.city.name, lang)}
                    </button>
                  ))}
                </div>

                <div className={styles.tools}>
                  <div
                    ref={dateFieldRef}
                    className={styles.dateField}
                    data-alert={exportState === "needs-date" ? "" : undefined}
                    onAnimationEnd={(event) => event.currentTarget.removeAttribute("data-shake")}
                  >
                    <TripIcon name="calendar" className={styles.dateIcon} />
                    <label className={styles.dateLabel}>
                      <span>{s.planner.startDate}</span>
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={storedStart ?? ""}
                        onChange={(event) => {
                          setStoredStart(event.target.value || null);
                          setExportState("idle");
                        }}
                      />
                    </label>
                    {startDate ? (
                      <button
                        type="button"
                        className={styles.clear}
                        aria-label={s.planner.clearDate}
                        onClick={() => {
                          setStoredStart(null);
                          dateInputRef.current?.focus();
                        }}
                      >
                        <Icon name="close" />
                      </button>
                    ) : null}
                  </div>
                  <Button size="sm" icon="arrow-down" className={styles.export} onClick={exportCalendar}>
                    {exportState === "done" ? s.planner.exported : s.planner.export}
                  </Button>
                </div>
              </div>

              {/* « Choisis d'abord ta date » s'affiche ; « Agenda téléchargé » est seulement annoncé (le bouton le montre) */}
              <p
                className={styles.notice}
                role="status"
                data-tone={exportState}
                data-visible={exportState === "needs-date" ? "" : undefined}
              >
                <span>{notice}</span>
              </p>

              <CalendarGrid
                itinerary={itinerary}
                currentDay={day}
                startDate={startDate}
                onSelect={(target) => navigate(target)}
                onMove={(target) => navigate(target, { reveal: false })}
              />
            </div>
          </div>

          <div className={styles.body}>
            <div ref={detailRef} className={styles.detail}>
              <DayDetail
                itinerary={itinerary}
                dayNumber={day}
                direction={direction}
                startDate={startDate}
                touch={touch}
                onNavigate={navigate}
              />
            </div>
            <aside className={styles.aside}>
              <RouteMap itinerary={itinerary} currentDay={day} onSelectDay={navigate} />
              <ol className={styles.strip} aria-hidden="true">
                {itinerary.days.map((tripDay, index) => (
                  <li
                    key={index}
                    style={{ "--c": cityOf(itinerary, tripDay.city).color } as CSSProperties}
                    data-state={index + 1 < day ? "past" : index + 1 === day ? "current" : undefined}
                  />
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </Container>

      <DayDock
        itinerary={itinerary}
        currentDay={day}
        visible={!locked && calendarPassed && detailInView}
        onNavigate={navigate}
      />
    </Section>
  );
}
