"use client";

import { useId } from "react";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import { getCity, getCityStops, type Itinerary, type ItineraryCity, type TravelMode } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { localize } from "@/i18n/localize";
import { EASE, Eyebrow, GlassCard, SPRING, TRAVEL_ICONS, tintText, tokens } from "./shared";

interface RouteMapProps {
  itinerary: Itinerary;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

type Point = ItineraryCity["map"];

/** Quadratic arc between two cities, always bowing upwards; flights bend more than trains. */
function arc(a: Point, b: Point, mode: TravelMode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  let nx = -dy / length;
  let ny = dx / length;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = length * (mode === "plane" ? 0.22 : 0.12);
  const c = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
  return {
    d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`,
    mid: { x: 0.25 * a.x + 0.5 * c.x + 0.25 * b.x, y: 0.25 * a.y + 0.5 * c.y + 0.25 * b.y },
  };
}

const LABEL_OFFSET = {
  top: { dx: 0, dy: -4.6, anchor: "middle" },
  bottom: { dx: 0, dy: 6.4, anchor: "middle" },
  left: { dx: -3.8, dy: 1.1, anchor: "end" },
  right: { dx: 3.8, dy: 1.1, anchor: "start" },
} as const;

export function RouteMap({ itinerary, currentDay, onSelectDay }: RouteMapProps) {
  const { lang, t } = useLanguage();
  const uid = useId().replace(/:/g, "");
  const stops = getCityStops(itinerary);
  const currentIndex = Math.max(
    0,
    stops.findIndex((s) => currentDay >= s.firstDay && currentDay <= s.lastDay),
  );
  const current = stops[currentIndex];

  // One arc per travel day, from the city actually left: a day trip
  // (Chongqing → Wulong, back the same night) shows up as a spur.
  const legs = itinerary.days.flatMap((day, index) => {
    if (!day.travel) return [];
    const from = getCity(itinerary, day.travel.from);
    const to = getCity(itinerary, day.city);
    const { mode } = day.travel;
    return [{ from, to, mode, day: index + 1, ...arc(from.map, to.map, mode) }];
  });

  return (
    <Card>
      <Header>
        <Eyebrow>{t.itinerary.planner.route}</Eyebrow>
        <StepCount>
          {currentIndex + 1}/{stops.length}
        </StepCount>
      </Header>

      <MapFrame>
        <svg viewBox="0 0 100 84" role="img" aria-label={stops.map((s) => localize(s.city.name, lang)).join(" → ")}>
          <defs>
            <pattern id={`${uid}-dots`} width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.28" style={{ fill: "var(--it-map-dot)" }} />
            </pattern>
            {legs.map((leg, i) => (
              <linearGradient
                key={i}
                id={`${uid}-leg-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={leg.from.map.x}
                y1={leg.from.map.y}
                x2={leg.to.map.x}
                y2={leg.to.map.y}
              >
                <stop offset="0%" stopColor={leg.from.color} />
                <stop offset="100%" stopColor={leg.to.color} />
              </linearGradient>
            ))}
          </defs>

          <rect width="100" height="84" fill={`url(#${uid}-dots)`} />
          <Watermark x="50" y="50" textAnchor="middle" dominantBaseline="middle">
            {itinerary.hanzi}
          </Watermark>

          {legs.map((leg, i) => {
            const done = currentDay >= leg.day;
            const TravelIcon = TRAVEL_ICONS[leg.mode];
            return (
              <g key={i}>
                <path
                  d={leg.d}
                  fill="none"
                  style={{ stroke: "var(--it-map-line)" }}
                  strokeWidth={0.5}
                  strokeDasharray={leg.mode === "plane" ? "1.2 1.4" : undefined}
                  strokeLinecap="round"
                />
                <motion.path
                  d={leg.d}
                  fill="none"
                  stroke={`url(#${uid}-leg-${i})`}
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
                <g transform={`translate(${leg.mid.x} ${leg.mid.y})`}>
                  <circle
                    r="2.9"
                    strokeWidth={0.35}
                    style={{ fill: tokens.solid, stroke: done ? leg.to.color : tokens.borderStrong }}
                  />
                  <TravelIcon x={-1.7} y={-1.7} size={3.4} style={{ color: done ? tokens.ink : tokens.faint }} />
                </g>
              </g>
            );
          })}

          {stops.map((stop) => {
            const { x, y, label } = stop.city.map;
            const offset = LABEL_OFFSET[label];
            const active = stop === current;
            const visited = currentDay >= stop.firstDay;
            const name = localize(stop.city.name, lang);
            return (
              <CityNode
                key={stop.city.id}
                role="button"
                tabIndex={0}
                aria-label={name}
                aria-pressed={active}
                onClick={() => onSelectDay(stop.firstDay)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectDay(stop.firstDay);
                  }
                }}
              >
                <circle cx={x} cy={y} r="5" fill="transparent" />
                {active && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill="none"
                    stroke={stop.city.color}
                    strokeWidth={0.4}
                    initial={{ r: 2, opacity: 0.8 }}
                    animate={{ r: 7, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="1.5"
                  style={{ fill: visited ? stop.city.color : tokens.solid }}
                  stroke={stop.city.color}
                  strokeWidth={0.5}
                />
                <CityLabel
                  x={x + offset.dx}
                  y={y + offset.dy}
                  textAnchor={offset.anchor}
                  fontSize="3.3"
                  $active={active}
                >
                  {name}
                  <tspan fontSize="2.5" dx="1" style={{ fill: tokens.faint }}>
                    {stop.city.hanzi}
                  </tspan>
                </CityLabel>
              </CityNode>
            );
          })}

          <motion.g initial={false} animate={{ x: current.city.map.x, y: current.city.map.y }} transition={SPRING}>
            <Target r="3.6" fill="none" strokeWidth={0.4} strokeDasharray="1.6 1.2" />
          </motion.g>
        </svg>
      </MapFrame>

      <AnimatePresence mode="wait" initial={false}>
        <CityInfo
          key={current.city.id}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <Hanzi $color={current.city.color}>{current.city.hanzi}</Hanzi>
          <div>
            <CityName>{localize(current.city.name, lang)}</CityName>
            <CityTagline>
              {localize(current.city.tagline, lang)} · {t.itinerary.planner.dayShort}
              {current.firstDay === current.lastDay ? current.firstDay : `${current.firstDay}–${current.lastDay}`}
            </CityTagline>
          </div>
        </CityInfo>
      </AnimatePresence>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Card = styled(GlassCard)`
  padding: 1.25rem;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepCount = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.72rem;
  color: ${tokens.faint};
`;

const MapFrame = styled.div`
  margin: 0.75rem -0.25rem 0;
  mask-image: radial-gradient(120% 100% at 50% 50%, #000 60%, transparent 100%);

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    font-family: ${(p) => p.theme.fonts.main};
  }
`;

const Watermark = styled.text`
  font-size: 34px;
  font-weight: 800;
  fill: var(--it-watermark);
  user-select: none;
`;

const CityNode = styled.g`
  cursor: pointer;
  outline: none;

  text {
    transition: fill 0.3s ease;
  }

  &:hover text,
  &:focus-visible text {
    fill: ${tokens.ink};
  }
`;

const CityLabel = styled.text<{ $active: boolean }>`
  fill: ${(p) => (p.$active ? tokens.ink : tokens.muted)};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
`;

const Target = styled.circle`
  stroke: ${tokens.ink};
  transform-box: fill-box;
  transform-origin: center;
  animation: ${spin} 6s linear infinite;
`;

const CityInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${tokens.border};
`;

const Hanzi = styled.span<{ $color: string }>`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: ${(p) => tintText(p.$color)};
  text-shadow: 0 0 24px color-mix(in srgb, ${(p) => p.$color} 55%, transparent);
`;

const CityName = styled.p`
  font-weight: 650;
  color: ${tokens.ink};
`;

const CityTagline = styled.p`
  margin-top: 0.15rem;
  font-size: 0.8rem;
  color: ${tokens.faint};
`;
