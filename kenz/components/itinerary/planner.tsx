"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useAnimationControls, useInView, useReducedMotion } from "framer-motion";
import { CalendarDays, CalendarPlus, Check, X } from "lucide-react";

import { getCity, getCityStops, type Itinerary } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { localize } from "@/i18n/localize";
import { useMediaQuery, useStoredState } from "@/lib/browser-state";
import { buildCalendar, downloadCalendar, type CalendarEvent } from "@/lib/ics";
import { CalendarGrid } from "./calendar-grid";
import { DayDetail } from "./day-detail";
import { DayDock } from "./day-dock";
import { RouteMap } from "./route-map";
import { Container, EASE, Eyebrow, GlassCard, SectionTitle, formatPrice, parseIsoDate, tokens } from "./shared";

/* ═══════════════════════════════════════════
   SELECTED DAY ⇄ URL HASH (#jour-5)
   Deep links to a day can be pasted in a video description.
   ═══════════════════════════════════════════ */

const HASH_PATTERN = /^#(?:jour|day)-(\d+)$/;
const hashListeners = new Set<() => void>();

function subscribeHash(listener: () => void) {
  hashListeners.add(listener);
  window.addEventListener("hashchange", listener);
  return () => {
    hashListeners.delete(listener);
    window.removeEventListener("hashchange", listener);
  };
}

export function readHashDay(): number | null {
  const match = HASH_PATTERN.exec(window.location.hash);
  return match ? Number(match[1]) : null;
}

function useDayFromHash(total: number) {
  const fromHash = useSyncExternalStore(subscribeHash, readHashDay, () => null);
  const day = fromHash !== null && fromHash >= 1 && fromHash <= total ? fromHash : 1;

  const setDay = useCallback((next: number) => {
    const url = new URL(window.location.href);
    url.hash = `jour-${next}`;
    // replaceState: browsing days must not flood the back button.
    window.history.replaceState(window.history.state, "", url);
    hashListeners.forEach((listener) => listener());
  }, []);

  return [day, setDay] as const;
}

/** True once the element has left the viewport through the top (scrolled past, not yet reached). */
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

/* ═══════════════════════════════════════════
   PLANNER
   ═══════════════════════════════════════════ */

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

interface PlannerProps {
  itinerary: Itinerary;
  /** False while the subscribe gate is up: keyboard shortcuts and the dock stay off. */
  active: boolean;
}

export const PLANNER_ID = "itineraire";

export function Planner({ itinerary, active }: PlannerProps) {
  const { lang, t } = useLanguage();
  const s = t.itinerary;
  const total = itinerary.days.length;
  const stops = getCityStops(itinerary);

  const [day, setDay] = useDayFromHash(total);
  const [direction, setDirection] = useState(1);
  const [storedStart, setStoredStart] = useStoredState(`kenz-trip-start:${itinerary.slug}`);
  const startDate = parseIsoDate(storedStart);
  const [exportState, setExportState] = useState<"idle" | "needs-date" | "done">("idle");

  const touch = useMediaQuery("(pointer: coarse)");
  const reduceMotion = useReducedMotion();
  const dateControls = useAnimationControls();

  const sectionRef = useRef<HTMLElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const sectionInView = useInView(sectionRef);
  const detailInView = useInView(detailRef);
  const calendarPassed = useScrolledPast(calendarRef);
  const currentCityId = itinerary.days[day - 1].city;

  /** Brings the day's header into view, unless it already sits in the upper part of the screen. */
  const revealDetail = useCallback(() => {
    const element = detailRef.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top;
    if (top >= tokens.navOffset - 8 && top < window.innerHeight * 0.55) return;
    window.scrollTo({
      top: window.scrollY + top - tokens.navOffset,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const navigate = useCallback(
    (target: number) => {
      if (target < 1 || target > total) return;
      if (target !== day) {
        setDirection(target > day ? 1 : -1);
        setDay(target);
      }
      revealDetail();
    },
    [day, total, setDay, revealDetail],
  );

  // ← → switch days while the planner is on screen.
  useEffect(() => {
    if (!active || !sectionInView) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") navigate(day + 1);
      else if (event.key === "ArrowLeft") navigate(day - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, sectionInView, day, navigate]);

  const exportCalendar = () => {
    if (!startDate) {
      setExportState("needs-date");
      void dateControls.start({ x: [0, -7, 7, -5, 5, 0], transition: { duration: 0.45 } });
      const input = dateInputRef.current;
      input?.focus();
      try {
        input?.showPicker();
      } catch {
        // showPicker is unsupported or blocked: focusing the field is enough.
      }
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
          activity.price && formatPrice(activity.price, s),
          `${pageUrl}#jour-${dayIndex + 1}`,
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
    window.setTimeout(() => setExportState("idle"), 2400);
  };

  return (
    <Section ref={sectionRef} id={PLANNER_ID} aria-labelledby="planner-title">
      <Container>
        <Header>
          <div>
            <Eyebrow>{s.planner.eyebrow}</Eyebrow>
            <SectionTitle id="planner-title">{s.planner.title}</SectionTitle>
          </div>
          <Hint>{touch ? s.planner.hintTouch : s.planner.hint}</Hint>
        </Header>

        <CalendarCard ref={calendarRef}>
          <Toolbar>
            <Legend>
              {stops.map((stop) => (
                <LegendChip
                  key={stop.city.id}
                  type="button"
                  $color={stop.city.color}
                  $active={stop.city.id === currentCityId}
                  onClick={() => navigate(stop.firstDay)}
                >
                  <i aria-hidden />
                  {localize(stop.city.name, lang)}
                </LegendChip>
              ))}
            </Legend>

            <Tools>
              <DateField animate={dateControls} $alert={exportState === "needs-date"}>
                <CalendarDays size={16} />
                <label>
                  <small>{s.planner.startDate}</small>
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
                {startDate && (
                  <ClearDate type="button" onClick={() => setStoredStart(null)} aria-label={s.planner.clearDate}>
                    <X size={13} />
                  </ClearDate>
                )}
              </DateField>

              <ExportButton type="button" onClick={exportCalendar} $done={exportState === "done"} whileTap={{ scale: 0.96 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={exportState === "done" ? "done" : "idle"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {exportState === "done" ? <Check size={16} /> : <CalendarPlus size={16} />}
                    {exportState === "done" ? s.planner.exported : s.planner.export}
                  </motion.span>
                </AnimatePresence>
              </ExportButton>
            </Tools>
          </Toolbar>

          <AnimatePresence>
            {exportState === "needs-date" && (
              <Notice
                role="status"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <span>{s.planner.exportNeedsDate}</span>
              </Notice>
            )}
          </AnimatePresence>

          <CalendarGrid itinerary={itinerary} currentDay={day} startDate={startDate} onSelectDay={navigate} />
        </CalendarCard>

        <Body>
          <DetailColumn ref={detailRef}>
            <DayDetail
              itinerary={itinerary}
              dayNumber={day}
              direction={direction}
              startDate={startDate}
              touch={touch}
              onNavigate={navigate}
            />
          </DetailColumn>
          <Aside>
            <RouteMap itinerary={itinerary} currentDay={day} onSelectDay={navigate} />
            <CityStrip>
              {itinerary.days.map((tripDay, index) => (
                <CityTick
                  key={index}
                  $color={getCity(itinerary, tripDay.city).color}
                  $state={index + 1 < day ? "past" : index + 1 === day ? "current" : "future"}
                />
              ))}
            </CityStrip>
          </Aside>
        </Body>
      </Container>

      <DayDock
        itinerary={itinerary}
        currentDay={day}
        visible={active && calendarPassed && detailInView}
        onNavigate={navigate}
      />
    </Section>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Section = styled.section`
  position: relative;
  padding: clamp(3rem, 7vw, 5.5rem) 0 clamp(4rem, 8vw, 6rem);
  scroll-margin-top: ${tokens.navOffset - 24}px;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: 1.75rem;

  h2 {
    margin-top: 0.6rem;
  }
`;

const Hint = styled.p`
  max-width: 34ch;
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${tokens.faint};
`;

const CalendarCard = styled(GlassCard)`
  padding: clamp(0.75rem, 2vw, 1.25rem);
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const LegendChip = styled.button<{ $color: string; $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.8rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? tokens.ink : tokens.muted)};
  background: ${(p) => (p.$active ? `color-mix(in srgb, ${p.$color} 16%, transparent)` : "transparent")};
  border: 1px solid ${(p) => (p.$active ? `color-mix(in srgb, ${p.$color} 45%, transparent)` : tokens.border)};
  transition: all 0.3s ease;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: ${(p) => (p.$active ? `0 0 10px ${p.$color}` : "none")};
  }

  &:hover {
    color: ${tokens.ink};
    border-color: color-mix(in srgb, ${(p) => p.$color} 45%, transparent);
  }
`;

const Tools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 640px) {
    width: 100%;

    > * {
      flex: 1 1 auto;
    }
  }
`;

const DateField = styled(motion.div)<{ $alert: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.5rem 0.35rem 0.85rem;
  border-radius: 14px;
  background: ${tokens.fill};
  border: 1px solid ${(p) => (p.$alert ? "var(--it-tip-accent)" : tokens.border)};
  box-shadow: ${(p) => (p.$alert ? "0 0 0 4px rgba(245, 199, 107, 0.15)" : "none")};
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  > svg {
    flex-shrink: 0;
    color: ${tokens.muted};
  }

  label {
    display: flex;
    flex-direction: column;
    flex: 1;
    cursor: pointer;
  }

  small {
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${tokens.faint};
  }

  input {
    min-width: 0;
    padding: 0;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    color: ${tokens.ink};
    background: transparent;
    border: none;
    outline: none;
  }
`;

const ClearDate = styled.button`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: ${tokens.muted};
  background: ${tokens.fill};

  &:hover {
    color: ${tokens.ink};
  }
`;

const ExportButton = styled(motion.button)<{ $done: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.1rem;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 650;
  color: ${(p) => (p.$done ? "#03140e" : tokens.onInverse)};
  background: ${(p) => (p.$done ? tokens.success : tokens.inverse)};
  transition: background 0.3s ease;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Notice = styled(motion.div)`
  overflow: hidden;

  span {
    display: block;
    margin-bottom: 0.9rem;
    padding: 0.6rem 0.9rem;
    border-radius: 12px;
    font-size: 0.84rem;
    color: var(--it-tip-accent);
    background: var(--it-tip-bg);
    border: 1px solid var(--it-tip-border);
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2rem, 5vw, 3rem);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const DetailColumn = styled.div`
  min-width: 0;
`;

const Aside = styled.aside`
  position: sticky;
  top: ${tokens.navOffset}px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const CityStrip = styled.div`
  display: flex;
  gap: 3px;
  padding: 0 0.5rem;
`;

const CityTick = styled.span<{ $color: string; $state: "past" | "current" | "future" }>`
  flex: 1;
  height: 4px;
  border-radius: 4px;
  background: ${(p) => p.$color};
  opacity: ${(p) => (p.$state === "future" ? 0.18 : p.$state === "past" ? 0.6 : 1)};
  box-shadow: ${(p) => (p.$state === "current" ? `0 0 12px ${p.$color}` : "none")};
  transition:
    opacity 0.4s ease,
    box-shadow 0.4s ease;
`;
