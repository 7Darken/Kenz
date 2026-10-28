"use client";

import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getCity, type Itinerary } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { localize } from "@/i18n/localize";
import { EASE, tintText, tokens } from "./shared";

interface DayDockProps {
  itinerary: Itinerary;
  currentDay: number;
  visible: boolean;
  onNavigate: (day: number) => void;
}

/* Floating mini-calendar: takes over once the big calendar has scrolled
   out of view, so switching day never requires scrolling back up. */
export function DayDock({ itinerary, currentDay, visible, onNavigate }: DayDockProps) {
  const { lang, t } = useLanguage();
  const s = t.itinerary;
  const total = itinerary.days.length;
  const currentCity = getCity(itinerary, itinerary.days[currentDay - 1].city);

  return (
    <AnimatePresence>
      {visible && (
        <Dock
          aria-label={s.planner.title}
          initial={{ opacity: 0, y: 40, scale: 0.94, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: 40, scale: 0.94, x: "-50%" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <Arrow
            type="button"
            onClick={() => onNavigate(currentDay - 1)}
            disabled={currentDay === 1}
            aria-label={s.day.prev}
          >
            <ChevronLeft size={18} />
          </Arrow>

          <Track>
            {itinerary.days.map((day, index) => {
              const number = index + 1;
              const active = number === currentDay;
              const city = getCity(itinerary, day.city);
              return (
                <Segment
                  key={number}
                  type="button"
                  $color={city.color}
                  $active={active}
                  $past={number < currentDay}
                  onClick={() => onNavigate(number)}
                  aria-label={`${s.planner.dayLabel} ${number} · ${localize(day.title, lang)}`}
                  aria-current={active ? "step" : undefined}
                  initial={false}
                  animate={{ width: active ? 46 : 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                >
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                      >
                        {s.planner.dayShort}
                        {number}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Segment>
              );
            })}
          </Track>

          <CityLabel $color={currentCity.color}>{localize(currentCity.name, lang)}</CityLabel>

          <Arrow
            type="button"
            onClick={() => onNavigate(currentDay + 1)}
            disabled={currentDay === total}
            aria-label={s.day.next}
          >
            <ChevronRight size={18} />
          </Arrow>
        </Dock>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Dock = styled(motion.nav)`
  position: fixed;
  left: 50%;
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 100px;
  background: var(--it-dock);
  border: 1px solid ${tokens.borderStrong};
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow:
    inset 0 1px 0 ${tokens.highlight},
    0 20px 50px -12px ${tokens.shadow};
`;

const Arrow = styled.button`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: ${tokens.ink};
  transition:
    background 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${tokens.fillStrong};
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 0.25rem;

  @media (max-width: 380px) {
    gap: 3px;
  }
`;

const Segment = styled(motion.button)<{ $color: string; $active: boolean; $past: boolean }>`
  height: ${(p) => (p.$active ? "26px" : "18px")};
  border-radius: 100px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.66rem;
  font-weight: 700;
  color: #08080a;
  background: ${(p) => p.$color};
  opacity: ${(p) => (p.$active ? 1 : p.$past ? 0.75 : 0.3)};
  overflow: hidden;
  white-space: nowrap;
  transition:
    opacity 0.3s ease,
    height 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const CityLabel = styled.span<{ $color: string }>`
  padding: 0 0.4rem 0 0.2rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${(p) => tintText(p.$color)};
  white-space: nowrap;

  @media (max-width: 520px) {
    display: none;
  }
`;
