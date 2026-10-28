"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

import { getCity, type Itinerary } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { LANG_META } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { DAY_ICONS, EASE, TRAVEL_ICONS, addDays, formatDate, padDay, tintText, tokens } from "./shared";

interface CalendarGridProps {
  itinerary: Itinerary;
  currentDay: number;
  startDate: Date | null;
  onSelectDay: (day: number) => void;
}

/** Cursor-following spotlight: pointer position is written as CSS variables, no re-render. */
function trackPointer(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function CalendarGrid({ itinerary, currentDay, startDate, onSelectDay }: CalendarGridProps) {
  const { lang, t } = useLanguage();
  const locale = LANG_META[lang].locale;

  return (
    <Grid
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
    >
      {itinerary.days.map((day, index) => {
        const number = index + 1;
        const city = getCity(itinerary, day.city);
        const fromColor = day.travel ? getCity(itinerary, day.travel.from).color : city.color;
        const selected = number === currentDay;
        const Icon = DAY_ICONS[day.icon];
        const TravelIcon = day.travel ? TRAVEL_ICONS[day.travel.mode] : null;
        const date = startDate ? addDays(startDate, index) : null;
        const highlight = localize(day.highlight, lang);
        const cityName = localize(city.name, lang);

        return (
          <Cell
            key={number}
            type="button"
            $color={city.color}
            $from={fromColor}
            $selected={selected}
            aria-pressed={selected}
            aria-label={`${t.itinerary.planner.dayLabel} ${number} · ${cityName} · ${localize(day.title, lang)}`}
            onClick={() => onSelectDay(number)}
            onPointerMove={trackPointer}
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            {selected && <ActiveRing layoutId="calendar-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}

            <CellTop>
              <DayNumber>{padDay(number)}</DayNumber>
              <IconWrap $color={city.color}>
                <Icon size={15} strokeWidth={1.8} />
              </IconWrap>
            </CellTop>

            <CellBottom>
              {date && <CellDate>{formatDate(date, locale, { weekday: "short", day: "numeric", month: "short" })}</CellDate>}
              <CellTitle>{highlight}</CellTitle>
              <CellCity $color={city.color}>
                {TravelIcon && <TravelIcon size={11} aria-hidden />}
                {cityName}
              </CellCity>
            </CellBottom>

            <CityBar aria-hidden />
          </Cell>
        );
      })}
    </Grid>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.6rem;

  @media (max-width: 640px) {
    gap: 0.35rem;
  }
`;

const Cell = styled(motion.button)<{ $color: string; $from: string; $selected: boolean }>`
  --c: ${(p) => p.$color};
  --from: ${(p) => p.$from};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 128px;
  padding: 0.75rem 0.75rem 0.85rem;
  border-radius: 20px;
  text-align: left;
  color: ${tokens.ink};
  overflow: hidden;
  isolation: isolate;
  background: ${(p) =>
    p.$selected ? `color-mix(in srgb, var(--c) 12%, ${tokens.card})` : tokens.card};
  border: 1px solid ${tokens.border};
  transition:
    background 0.35s ease,
    border-color 0.35s ease;

  /* Spotlight following the cursor */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(
      140px circle at var(--mx, 50%) var(--my, 50%),
      color-mix(in srgb, var(--c) 22%, transparent),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--c) 40%, transparent);
  }

  &:hover::before {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--c);
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    min-height: 108px;
  }

  @media (max-width: 640px) {
    min-height: 0;
    aspect-ratio: 0.8;
    padding: 0.45rem 0.3rem 0.55rem;
    border-radius: 14px;
    align-items: center;
    text-align: center;
  }
`;

const ActiveRing = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1.5px solid var(--c);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--c) 14%, transparent),
    0 18px 40px -16px var(--c),
    inset 0 0 24px -8px color-mix(in srgb, var(--c) 45%, transparent);
  pointer-events: none;
`;

const CellTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.25rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
`;

const DayNumber = styled.span`
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: 1.6rem;
  font-style: italic;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;

  @media (max-width: 640px) {
    font-size: 1.15rem;
  }
`;

const IconWrap = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  color: ${(p) => tintText(p.$color)};
  background: color-mix(in srgb, ${(p) => p.$color} 12%, transparent);

  @media (max-width: 640px) {
    width: 22px;
    height: 22px;
    border-radius: 7px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const CellBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

const CellDate = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.62rem;
  color: ${tokens.muted};

  &::first-letter {
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const CellTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 650;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 900px) {
    font-size: 0.72rem;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const CellCity = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: ${(p) => tintText(p.$color)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    display: none;
  }
`;

const CityBar = styled.span`
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(90deg, var(--from), var(--c));

  @media (max-width: 640px) {
    left: 0.5rem;
    right: 0.5rem;
  }
`;
