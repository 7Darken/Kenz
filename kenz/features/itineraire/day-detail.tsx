"use client";

/**
 * Le jour ouvert (le panneau des onglets du calendrier) : la ville, le rang du jour et sa date, le titre, le résumé,
 * partager / précédent / suivant, le trajet, la nuit et le budget, puis le programme heure par heure, et le lendemain
 * (ou la fin du voyage). Changer de jour fait glisser le panneau dans le sens du voyage ; sur écran tactile, on le
 * fait glisser du doigt.
 */
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import type { Itinerary } from "@/content/itineraries";
import { Button } from "@/design-system/components/button";
import { Icon } from "@/design-system/components/icon";
import { IconButton } from "@/design-system/components/icon-button";
import { gsap } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useQuality } from "@/design-system/motion/use-quality";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { ActivityItem } from "./activity-item";
import { DAY_PANEL_ID, dayTabId } from "./calendar-grid";
import styles from "./day-detail.module.css";
import { addDays, formatDate, padDay } from "./format";
import { TripIcon } from "./icons";
import { cityOf } from "./trip";
import { dayHash } from "./use-day-hash";

/** Le geste qui change de jour : 70 px, ou un lancer rapide (px/ms). */
const SWIPE_DISTANCE = 70;
const SWIPE_SPEED = 0.5;

interface DayDetailProps {
  itinerary: Itinerary;
  dayNumber: number;
  /** 1 en avançant, -1 en reculant : le sens du glissé. */
  direction: number;
  startDate: Date | null;
  /** Écran tactile : glisser pour changer de jour, et la feuille de partage du système. */
  touch: boolean;
  onNavigate: (day: number) => void;
}

interface Drag {
  id: number;
  x: number;
  y: number;
  time: number;
  dx: number;
  horizontal: boolean | null;
}

export function DayDetail({ itinerary, dayNumber, direction, startDate, touch, onNavigate }: DayDetailProps) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const panelRef = useRef<HTMLElement>(null);
  const shownRef = useRef(dayNumber);
  const dragRef = useRef<Drag | null>(null);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const light = useQuality() === "low";

  const total = itinerary.days.length;
  const day = itinerary.days[dayNumber - 1];
  const city = cityOf(itinerary, day.city);
  const next = dayNumber < total ? itinerary.days[dayNumber] : null;
  const nextCity = next ? cityOf(itinerary, next.city) : null;
  const date = startDate
    ? formatDate(addDays(startDate, dayNumber - 1), lang, { weekday: "long", day: "numeric", month: "long" })
    : null;

  // L'arrivée d'un autre jour : le panneau glisse dans le sens du voyage, puis son contenu monte ; sans flou.
  useGsap(
    () => {
      const panel = panelRef.current;
      if (!panel || shownRef.current === dayNumber) return;
      shownRef.current = dayNumber;
      if (reduced) {
        gsap.from(panel, { opacity: 0, duration: 0.35, ease: "power1.out" });
        return;
      }
      gsap.fromTo(panel, { opacity: 0, x: direction * 40 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" });
      if (light) return;
      gsap.from(panel.querySelectorAll("[data-rise]"), {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.05,
        delay: 0.05,
      });
      gsap.from(panel.querySelectorAll("[data-line]"), {
        scaleY: 0,
        transformOrigin: "50% 0%",
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.15,
      });
    },
    panelRef,
    [dayNumber],
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const share = async () => {
    const url = new URL(window.location.href);
    url.hash = dayHash(dayNumber);
    const title = `${s.planner.dayLabel} ${dayNumber} · ${localize(day.title, lang)}`;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: url.toString() });
      } catch {
        /* feuille de partage refermée */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      /* presse-papiers indisponible (contexte non sécurisé) : rien à faire */
    }
  };

  /* Le glissé du doigt : le panneau suit à peine (un quart du geste), puis change de jour ou revient. */
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!touch || event.pointerType === "mouse") return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp, dx: 0, horizontal: null };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (drag.horizontal === null && Math.hypot(dx, dy) > 8) drag.horizontal = Math.abs(dx) > Math.abs(dy);
    if (!drag.horizontal) return;
    drag.dx = dx;
    if (!reduced) gsap.set(event.currentTarget, { x: dx * 0.25 });
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.horizontal) return;
    const speed = Math.abs(drag.dx) / Math.max(1, event.timeStamp - drag.time);
    const target = dayNumber + (drag.dx < 0 ? 1 : -1);
    if ((Math.abs(drag.dx) > SWIPE_DISTANCE || speed > SWIPE_SPEED) && target >= 1 && target <= total) {
      onNavigate(target);
    } else if (!reduced) {
      gsap.to(event.currentTarget, { x: 0, duration: 0.5, ease: "expo.out" });
    }
  };

  return (
    <article
      ref={panelRef}
      id={DAY_PANEL_ID}
      role="tabpanel"
      aria-labelledby={dayTabId(dayNumber)}
      className={styles.panel}
      style={{ "--c": city.color } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <header className={styles.head}>
        <div className={styles.meta} data-rise="">
          <span className={styles.city}>
            <span className={styles.dot} aria-hidden="true" />
            <span lang="zh">{city.hanzi}</span> · {localize(city.name, lang)}
          </span>
          <span className={styles.counter}>
            {s.planner.dayLabel} {dayNumber} {s.planner.of} {total}
          </span>
          {date ? <span className={styles.date}>{date}</span> : null}
        </div>
        <h3 className={styles.title} data-rise="">
          {localize(day.title, lang)}
        </h3>
        <p className={styles.summary} data-rise="">
          {localize(day.summary, lang)}
        </p>
        <div className={styles.actions}>
          <span className={styles.shareWrap}>
            <button type="button" className={styles.round} onClick={share} aria-label={s.day.share}>
              <TripIcon name={copied ? "check" : "link"} />
            </button>
            <span className={styles.toast} role="status" data-visible={copied ? "" : undefined}>
              {copied ? s.day.copied : ""}
            </span>
          </span>
          <IconButton
            icon="arrow-left"
            label={s.day.prev}
            size="sm"
            disabled={dayNumber === 1}
            onClick={() => onNavigate(dayNumber - 1)}
          />
          <IconButton
            icon="arrow-right"
            label={s.day.next}
            size="sm"
            disabled={dayNumber === total}
            onClick={() => onNavigate(dayNumber + 1)}
          />
        </div>
      </header>

      <dl className={styles.facts} data-rise="">
        {day.travel ? (
          <div>
            <dt>{s.day.travel}</dt>
            <dd>
              <TripIcon name={day.travel.mode} className={styles.factIcon} />
              {localize(cityOf(itinerary, day.travel.from).name, lang)} → {localize(city.name, lang)} ·{" "}
              {localize(day.travel.duration, lang)}
            </dd>
          </div>
        ) : null}
        {day.stay ? (
          <div>
            <dt>{s.day.stay}</dt>
            <dd>{localize(day.stay, lang)}</dd>
          </div>
        ) : null}
        <div>
          <dt>
            {s.day.budget} <span className={styles.note}>· {s.budgetNote}</span>
          </dt>
          <dd>≈&nbsp;{format(s.euroRange, day.budgetEur)}</dd>
        </div>
      </dl>

      <ol className={styles.timeline} aria-label={format(s.day.program, { n: dayNumber })}>
        {day.activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} last={index === day.activities.length - 1} />
        ))}
      </ol>

      <div data-rise="">
        {next && nextCity ? (
          <button
            type="button"
            className={styles.next}
            style={{ "--n": nextCity.color } as CSSProperties}
            onClick={() => onNavigate(dayNumber + 1)}
          >
            <span className={styles.nextText}>
              <span className={styles.nextMeta}>
                {s.day.nextUp} · {s.planner.dayShort}
                {padDay(dayNumber + 1)} · {localize(nextCity.name, lang)}
              </span>
              <span className={styles.nextTitle}>{localize(next.title, lang)}</span>
            </span>
            <span className={styles.nextIcon}>
              <Icon name="arrow-right" />
            </span>
          </button>
        ) : (
          <div className={styles.end}>
            <span className={styles.bye} lang="zh">
              再见
            </span>
            <p className={styles.endText}>{s.day.tripEnd}</p>
            <Button variant="ghost" size="sm" icon="replay" onClick={() => onNavigate(1)}>
              {s.day.restart}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
