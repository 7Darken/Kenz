"use client";

/**
 * « Le parcours » : la carte schématique du trajet, en SVG fait maison. Un arc par jour de trajet, tiré depuis la
 * ville vraiment quittée (l'aller-retour Chongqing → Wulong forme une branche), en pointillé pour l'avion ; il se
 * trace quand le voyage l'a franchi. La ville du jour respire ; le repère glisse de ville en ville. Chaque ville
 * est un bouton (44 px) qui ouvre son premier jour. Dessous : la ville, son nom chinois, sa devise et ses jours.
 */
import { useId, type CSSProperties } from "react";

import type { ItineraryCity, Itinerary, TravelMode } from "@/content/itineraries";
import bezel from "@/design-system/styles/bezel.module.css";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { dayRange } from "./format";
import { TripIcon } from "./icons";
import styles from "./route-map.module.css";
import { cityOf, cityStops } from "./trip";

/** Le repère de la carte (unités du viewBox) ; les positions des villes y sont données. */
const W = 100;
const H = 84;

type Point = ItineraryCity["map"];

/** Un arc entre deux villes, toujours bombé vers le haut ; l'avion s'arrondit plus que le train. */
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

const LABEL = {
  top: { dx: 0, dy: -4.6, anchor: "middle" },
  bottom: { dx: 0, dy: 6.4, anchor: "middle" },
  left: { dx: -3.8, dy: 1.1, anchor: "end" },
  right: { dx: 3.8, dy: 1.1, anchor: "start" },
} as const;

interface RouteMapProps {
  itinerary: Itinerary;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export function RouteMap({ itinerary, currentDay, onSelectDay }: RouteMapProps) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const stops = cityStops(itinerary);
  const currentIndex = Math.max(
    0,
    stops.findIndex((stop) => currentDay >= stop.firstDay && currentDay <= stop.lastDay),
  );
  const current = stops[currentIndex];

  const legs = itinerary.days.flatMap((day, index) => {
    if (!day.travel) return [];
    const from = cityOf(itinerary, day.travel.from);
    const to = cityOf(itinerary, day.city);
    return [{ from, to, mode: day.travel.mode, day: index + 1, ...arc(from.map, to.map, day.travel.mode) }];
  });

  return (
    <section className={`${bezel.bezel} ${styles.card}`} aria-labelledby={`${uid}-title`}>
      <div className={`${bezel.core} ${styles.core}`}>
        <header className={styles.head}>
          <h3 id={`${uid}-title`} className={styles.title}>
            {s.planner.route}
          </h3>
          <span className={styles.step} aria-hidden="true">
            {currentIndex + 1}/{stops.length}
          </span>
        </header>

        <div className={styles.map}>
          <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            <defs>
              <pattern id={`${uid}-dots`} width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r=".28" className={styles.dotFill} />
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

            <rect width={W} height={H} fill={`url(#${uid}-dots)`} />
            <text className={styles.watermark} x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle">
              {itinerary.hanzi}
            </text>

            {legs.map((leg, i) => {
              const done = currentDay >= leg.day;
              return (
                <g key={i}>
                  <path
                    className={styles.base}
                    d={leg.d}
                    strokeDasharray={leg.mode === "plane" ? "1.2 1.4" : undefined}
                  />
                  <path
                    className={styles.progress}
                    d={leg.d}
                    pathLength={1}
                    stroke={`url(#${uid}-leg-${i})`}
                    data-done={done ? "" : undefined}
                  />
                  <g transform={`translate(${leg.mid.x} ${leg.mid.y})`}>
                    <circle
                      r="2.9"
                      className={styles.modeDisc}
                      style={{ "--to": leg.to.color } as CSSProperties}
                      data-done={done ? "" : undefined}
                    />
                    <TripIcon
                      name={leg.mode}
                      x={-1.7}
                      y={-1.7}
                      width={3.4}
                      height={3.4}
                      strokeWidth={2}
                      className={styles.modeIcon}
                    />
                  </g>
                </g>
              );
            })}

            {stops.map((stop) => {
              const { x, y, label } = stop.city.map;
              const offset = LABEL[label];
              const active = stop === current;
              const visited = currentDay >= stop.firstDay;
              return (
                <g key={stop.city.id} style={{ "--c": stop.city.color } as CSSProperties}>
                  {active ? <circle className={styles.pulse} cx={x} cy={y} r="2" /> : null}
                  <circle
                    className={styles.cityDot}
                    cx={x}
                    cy={y}
                    r="1.5"
                    data-visited={visited ? "" : undefined}
                  />
                  <text
                    className={styles.label}
                    x={x + offset.dx}
                    y={y + offset.dy}
                    textAnchor={offset.anchor}
                    data-active={active ? "" : undefined}
                  >
                    {localize(stop.city.name, lang)}
                    <tspan className={styles.labelHanzi} dx="1">
                      {stop.city.hanzi}
                    </tspan>
                  </text>
                </g>
              );
            })}

            <g className={styles.target} style={{ transform: `translate(${current.city.map.x}px, ${current.city.map.y}px)` }}>
              <circle r="3.6" />
            </g>
          </svg>

          {stops.map((stop) => (
            <button
              key={stop.city.id}
              type="button"
              className={styles.hit}
              style={{ left: `${(stop.city.map.x / W) * 100}%`, top: `${(stop.city.map.y / H) * 100}%` }}
              aria-pressed={stop === current}
              aria-label={`${localize(stop.city.name, lang)}, ${dayRange(stop, s.planner.dayShort)}`}
              onClick={() => onSelectDay(stop.firstDay)}
            />
          ))}
        </div>

        <div key={current.city.id} className={styles.info} style={{ "--c": current.city.color } as CSSProperties}>
          <span className={styles.hanzi} lang="zh">
            {current.city.hanzi}
          </span>
          <div>
            <p className={styles.name}>{localize(current.city.name, lang)}</p>
            <p className={styles.tagline}>
              {localize(current.city.tagline, lang)} ·{" "}
              <span className={styles.range}>{dayRange(current, s.planner.dayShort)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
