"use client";

import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Link2,
  MapPin,
  Play,
  RotateCcw,
  Ticket,
  Wallet,
} from "lucide-react";

import { getCity, type Itinerary, type ItineraryActivity } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { LANG_META } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import {
  EASE,
  GlassCard,
  KIND_STYLES,
  TRAVEL_ICONS,
  addDays,
  formatDate,
  formatDuration,
  formatEuroRange,
  formatPrice,
  padDay,
  tokens,
} from "./shared";

interface DayDetailProps {
  itinerary: Itinerary;
  dayNumber: number;
  /** 1 when moving forward, -1 when moving back — drives the slide direction. */
  direction: number;
  startDate: Date | null;
  /** Touch device: enables swipe navigation and the native share sheet. */
  touch: boolean;
  onNavigate: (day: number) => void;
}

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 500;

const panelVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48, filter: "blur(8px)" }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE, staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -48,
    filter: "blur(8px)",
    transition: { duration: 0.22, ease: "easeIn" },
  }),
};

const riseVariants: Variants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const lineVariants: Variants = {
  enter: { scaleY: 0 },
  center: { scaleY: 1, transition: { duration: 0.6, ease: EASE, delay: 0.15 } },
};

export function DayDetail({ itinerary, dayNumber, direction, startDate, touch, onNavigate }: DayDetailProps) {
  const { lang, t } = useLanguage();
  const s = t.itinerary;
  const [copied, setCopied] = useState(false);

  const total = itinerary.days.length;
  const day = itinerary.days[dayNumber - 1];
  const city = getCity(itinerary, day.city);
  const next = dayNumber < total ? itinerary.days[dayNumber] : null;
  const nextCity = next ? getCity(itinerary, next.city) : null;
  const TravelIcon = day.travel ? TRAVEL_ICONS[day.travel.mode] : null;
  const date = startDate
    ? formatDate(addDays(startDate, dayNumber - 1), LANG_META[lang].locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;
  const videoMoment =
    itinerary.youtubeVideoId && day.videoTimestamp !== undefined
      ? `https://www.youtube.com/watch?v=${itinerary.youtubeVideoId}&t=${day.videoTimestamp}s`
      : null;

  const share = async () => {
    const url = new URL(window.location.href);
    url.hash = `jour-${dayNumber}`;
    const title = `${s.planner.dayLabel} ${dayNumber} · ${localize(day.title, lang)}`;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: url.toString() });
      } catch {
        // Share sheet dismissed.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (insecure context): nothing to do.
    }
  };

  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    if (!swipe) return;
    const target = dayNumber + (info.offset.x < 0 ? 1 : -1);
    if (target >= 1 && target <= total) onNavigate(target);
  };

  return (
    <Panel>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <Article
          key={dayNumber}
          $color={city.color}
          custom={direction}
          variants={panelVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag={touch ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={onDragEnd}
        >
          <Head>
            <BigNumber aria-hidden variants={riseVariants}>
              {padDay(dayNumber)}
            </BigNumber>

            <HeadMain variants={riseVariants}>
              <HeadMeta>
                <CityPill>
                  <i aria-hidden />
                  {city.hanzi} · {localize(city.name, lang)}
                </CityPill>
                <Counter>
                  {s.planner.dayLabel} {dayNumber} {s.planner.of} {total}
                </Counter>
                {date && <DateText>{date}</DateText>}
              </HeadMeta>
              <DayTitle>{localize(day.title, lang)}</DayTitle>
              <Summary>{localize(day.summary, lang)}</Summary>
            </HeadMain>

            <HeadActions variants={riseVariants}>
              <ShareWrap>
                <IconButton type="button" onClick={share} aria-label={s.day.share} title={s.day.share}>
                  {copied ? <Check size={16} /> : <Link2 size={16} />}
                </IconButton>
                <AnimatePresence>
                  {copied && (
                    <Toast
                      role="status"
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    >
                      {s.day.copied}
                    </Toast>
                  )}
                </AnimatePresence>
              </ShareWrap>
              <IconButton
                type="button"
                onClick={() => onNavigate(dayNumber - 1)}
                disabled={dayNumber === 1}
                aria-label={s.day.prev}
                title={s.day.prev}
              >
                <ChevronLeft size={18} />
              </IconButton>
              <IconButton
                type="button"
                onClick={() => onNavigate(dayNumber + 1)}
                disabled={dayNumber === total}
                aria-label={s.day.next}
                title={s.day.next}
              >
                <ChevronRight size={18} />
              </IconButton>
            </HeadActions>
          </Head>

          <Facts variants={riseVariants}>
            {day.travel && TravelIcon && (
              <Fact>
                <TravelIcon size={16} />
                <span>
                  <small>{s.day.travel}</small>
                  {localize(getCity(itinerary, day.travel.from).name, lang)} → {localize(city.name, lang)} ·{" "}
                  {localize(day.travel.duration, lang)}
                </span>
              </Fact>
            )}
            {day.stay && (
              <Fact>
                <BedDouble size={16} />
                <span>
                  <small>{s.day.stay}</small>
                  {localize(day.stay, lang)}
                </span>
              </Fact>
            )}
            <Fact title={s.budgetNote}>
              <Wallet size={16} />
              <span>
                <small>{s.day.budget}</small>≈ {formatEuroRange(day.budgetEur, s)}
              </span>
            </Fact>
            {videoMoment && (
              <FactLink href={videoMoment} target="_blank" rel="noopener noreferrer">
                <Play size={15} fill="currentColor" />
                <span>
                  <small>YouTube</small>
                  {s.day.inVideo}
                </span>
              </FactLink>
            )}
          </Facts>

          <Timeline>
            {day.activities.map((activity, index) => (
              <ActivityItem
                key={`${dayNumber}-${index}`}
                activity={activity}
                last={index === day.activities.length - 1}
              />
            ))}
          </Timeline>

          <motion.div variants={riseVariants}>
            {next && nextCity ? (
              <NextCard type="button" $color={nextCity.color} onClick={() => onNavigate(dayNumber + 1)}>
                <span>
                  <small>
                    {s.day.nextUp} · {s.planner.dayShort}
                    {padDay(dayNumber + 1)} · {localize(nextCity.name, lang)}
                  </small>
                  <strong>{localize(next.title, lang)}</strong>
                </span>
                <ArrowRight size={20} />
              </NextCard>
            ) : (
              <EndCard>
                <span lang="zh">再见</span>
                <p>{s.day.tripEnd}</p>
                <button type="button" onClick={() => onNavigate(1)}>
                  <RotateCcw size={14} />
                  {s.day.restart}
                </button>
              </EndCard>
            )}
          </motion.div>
        </Article>
      </AnimatePresence>
    </Panel>
  );
}

/* ── One step of the day ── */

function ActivityItem({ activity, last }: { activity: ItineraryActivity; last: boolean }) {
  const { lang, t } = useLanguage();
  const s = t.itinerary;
  const kind = KIND_STYLES[activity.kind];
  const Icon = kind.icon;

  return (
    <Item variants={riseVariants} $tint={kind.color}>
      <Time>{activity.time}</Time>
      <Rail aria-hidden>
        <Node>
          <Icon size={15} />
        </Node>
        {!last && <Line variants={lineVariants} />}
      </Rail>
      <Body>
        <Meta>
          <KindTag>{s.kinds[activity.kind]}</KindTag>
          <MobileTime>{activity.time}</MobileTime>
          <Chip>
            <Clock size={12} />
            {formatDuration(activity.durationMin)}
          </Chip>
          {activity.price && (
            <Chip>
              <Ticket size={12} />
              {formatPrice(activity.price, s)}
            </Chip>
          )}
        </Meta>
        <ItemTitle>{localize(activity.title, lang)}</ItemTitle>
        <ItemText>{localize(activity.description, lang)}</ItemText>
        {activity.tip && (
          <Tip>
            <Lightbulb size={15} />
            <p>
              <strong>{s.day.tip}</strong> {localize(activity.tip, lang)}
            </p>
          </Tip>
        )}
        {activity.place && (
          <MapLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={13} />
            {s.day.openMap}
            <ArrowUpRight size={13} />
          </MapLink>
        )}
      </Body>
    </Item>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Panel = styled.div`
  position: relative;
  min-width: 0;
`;

const Article = styled(motion.article)<{ $color: string }>`
  --c: ${(p) => p.$color};
  touch-action: pan-y;
`;

const Head = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 1.25rem;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
  }
`;

const BigNumber = styled(motion.span)`
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(4.5rem, 9vw, 7rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: transparent;
  background: linear-gradient(180deg, var(--c), color-mix(in srgb, var(--c) 10%, transparent));
  -webkit-background-clip: text;
  background-clip: text;
  font-variant-numeric: tabular-nums;

  @media (max-width: 720px) {
    position: absolute;
    top: -0.6rem;
    right: 0;
    font-size: 5.5rem;
    opacity: 0.35;
    pointer-events: none;
  }
`;

const HeadMain = styled(motion.div)`
  min-width: 0;
`;

const HeadMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
`;

const CityPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  background: color-mix(in srgb, var(--c) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--c);
    box-shadow: 0 0 10px var(--c);
  }
`;

const Counter = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: ${tokens.faint};
`;

const DateText = styled.span`
  font-size: 0.8rem;
  color: ${tokens.muted};

  &::first-letter {
    text-transform: uppercase;
  }
`;

const DayTitle = styled.h3`
  margin-top: 0.75rem;
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: #fff;
`;

const Summary = styled.p`
  margin-top: 0.7rem;
  max-width: 60ch;
  font-size: 0.98rem;
  line-height: 1.65;
  font-weight: 300;
  color: ${tokens.muted};
`;

const HeadActions = styled(motion.div)`
  display: flex;
  gap: 0.4rem;

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`;

const ShareWrap = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${tokens.border};
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--c) 18%, transparent);
    border-color: color-mix(in srgb, var(--c) 45%, transparent);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--c);
    outline-offset: 2px;
  }
`;

const Toast = styled(motion.span)`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  translate: -50% 0;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  color: #08080a;
  background: #fff;
  pointer-events: none;
  z-index: 2;
`;

const Facts = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.5rem;
`;

const factStyles = `
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.95rem 0.65rem 0.8rem;
  border-radius: 14px;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid ${tokens.border};

  > svg {
    flex-shrink: 0;
    color: var(--c);
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    line-height: 1.3;
  }

  small {
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${tokens.faint};
  }
`;

const Fact = styled.div`
  ${factStyles}
`;

const FactLink = styled.a`
  ${factStyles}
  transition: background 0.2s ease;

  > svg {
    color: ${tokens.youtube};
  }

  &:hover {
    background: rgba(255, 0, 51, 0.08);
  }
`;

const Timeline = styled.ol`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  list-style: none;
`;

const Item = styled(motion.li)<{ $tint: string }>`
  --tint: ${(p) => p.$tint};
  display: grid;
  grid-template-columns: 52px 40px minmax(0, 1fr);
  gap: 0 0.9rem;

  @media (max-width: 640px) {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 0 0.7rem;
  }
`;

const Time = styled.span`
  padding-top: 0.6rem;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.82rem;
  text-align: right;
  color: ${tokens.muted};
  font-variant-numeric: tabular-nums;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Node = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  color: var(--tint);
  background: color-mix(in srgb, var(--tint) 13%, #0a0a0d);
  border: 1px solid color-mix(in srgb, var(--tint) 35%, transparent);
  box-shadow: 0 0 22px -6px color-mix(in srgb, var(--tint) 60%, transparent);

  @media (max-width: 640px) {
    width: 34px;
    height: 34px;
    border-radius: 11px;
  }
`;

const Line = styled(motion.span)`
  flex: 1;
  width: 2px;
  min-height: 1rem;
  margin: 6px 0;
  border-radius: 2px;
  transform-origin: top;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tint) 50%, transparent), rgba(255, 255, 255, 0.06));
`;

const Body = styled.div`
  margin-bottom: 1rem;
  padding: 1rem 1.15rem 1.1rem;
  border-radius: 20px;
  background: ${tokens.card};
  border: 1px solid ${tokens.border};
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: ${tokens.cardHover};
    border-color: color-mix(in srgb, var(--tint) 30%, transparent);
    transform: translateX(3px);
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
`;

const KindTag = styled.span`
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tint);
  margin-right: 0.2rem;
`;

const MobileTime = styled.span`
  display: none;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.72rem;
  color: #fff;

  @media (max-width: 640px) {
    display: inline;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.5rem;
  border-radius: 100px;
  font-size: 0.7rem;
  color: ${tokens.muted};
  background: rgba(255, 255, 255, 0.05);
`;

const ItemTitle = styled.h4`
  margin-top: 0.55rem;
  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.3;
  color: #fff;
`;

const ItemText = styled.p`
  margin-top: 0.35rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${tokens.muted};
`;

const Tip = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.8rem;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  font-size: 0.84rem;
  line-height: 1.5;
  color: rgba(255, 236, 200, 0.85);
  background: rgba(245, 199, 107, 0.07);
  border: 1px solid rgba(245, 199, 107, 0.18);

  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
    color: #f5c76b;
  }

  strong {
    color: #f5c76b;
    font-weight: 650;
  }
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${tokens.muted};
  transition: color 0.2s ease;

  svg:last-child {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #fff;
  }

  &:hover svg:last-child {
    transform: translate(2px, -2px);
  }
`;

const NextCard = styled.button<{ $color: string }>`
  --n: ${(p) => p.$color};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  padding: 1.2rem 1.4rem;
  border-radius: 22px;
  text-align: left;
  color: #fff;
  overflow: hidden;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--n) 16%, transparent),
    rgba(255, 255, 255, 0.02) 60%
  );
  border: 1px solid color-mix(in srgb, var(--n) 30%, transparent);
  transition:
    border-color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  span {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  small {
    font-family: ${(p) => p.theme.fonts.mono};
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--n);
  }

  strong {
    font-family: ${(p) => p.theme.fonts.aesthetic};
    font-size: 1.45rem;
    font-weight: 400;
    font-style: italic;
  }

  > svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--n) 60%, transparent);
    transform: translateY(-2px);
  }

  &:hover > svg {
    transform: translateX(4px);
  }
`;

const EndCard = styled(GlassCard)`
  margin-top: 1rem;
  padding: 2rem 1.5rem;
  text-align: center;

  span {
    display: block;
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--c);
    text-shadow: 0 0 30px color-mix(in srgb, var(--c) 60%, transparent);
  }

  p {
    margin-top: 0.4rem;
    font-family: ${(p) => p.theme.fonts.aesthetic};
    font-size: 1.5rem;
    font-style: italic;
    color: #fff;
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 1.1rem;
    padding: 0.6rem 1.1rem;
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #fff;
    border: 1px solid ${tokens.borderStrong};
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;
