"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, ChevronRight, Play } from "lucide-react";

import { getCityStops, getTripStats, type Itinerary } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { localize } from "@/i18n/localize";
import { Container, EASE, Eyebrow, formatEuroRange, tokens } from "./shared";
import { ThemeToggle } from "./theme";

interface ItineraryHeroProps {
  itinerary: Itinerary;
  videoUrl: string;
  onExplore: () => void;
}

export function ItineraryHero({ itinerary, videoUrl, onExplore }: ItineraryHeroProps) {
  const { lang, t } = useLanguage();
  const strings = t.itinerary;
  const stats = getTripStats(itinerary);
  const stops = getCityStops(itinerary);
  const words = localize(itinerary.title, lang).split(" ");

  return (
    <Hero>
      <Backdrop aria-hidden>
        <Glow $color={stops[0]?.city.color ?? tokens.youtube} />
        <Watermark>{itinerary.hanzi}</Watermark>
      </Backdrop>

      <Container>
        <TopRow>
          <BackLink href="/#content">
            <ArrowLeft size={15} />
            {strings.back}
          </BackLink>
          <ThemeToggle />
        </TopRow>

        <Layout>
          <Copy>
            <Eyebrow>
              <Flag
                src={`https://flagcdn.com/w40/${itinerary.countryCode}.png`}
                alt=""
                width={20}
                height={14}
                unoptimized
              />
              {itinerary.hanzi} · {strings.eyebrow}
            </Eyebrow>

            <Title aria-label={localize(itinerary.title, lang)}>
              {words.map((word, i) => (
                <Word
                  key={`${word}-${i}`}
                  aria-hidden
                  initial={{ opacity: 0, y: "0.4em", filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: EASE }}
                >
                  {word}
                </Word>
              ))}
            </Title>

            <Lead
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            >
              {localize(itinerary.description, lang)}
            </Lead>

            <Route
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stops.map((stop, i) => (
                <Fragment key={stop.city.id}>
                  {i > 0 && <ChevronRight size={14} aria-hidden />}
                  <RouteChip $color={stop.city.color}>
                    <i aria-hidden />
                    {localize(stop.city.name, lang)}
                    <small>
                      {strings.planner.dayShort}
                      {stop.firstDay === stop.lastDay ? stop.firstDay : `${stop.firstDay}–${stop.lastDay}`}
                    </small>
                  </RouteChip>
                </Fragment>
              ))}
            </Route>

            <Actions
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
            >
              <PrimaryButton type="button" onClick={onExplore} whileTap={{ scale: 0.97 }}>
                {strings.explore}
                <ArrowDown size={16} />
              </PrimaryButton>
              <GhostLink href={videoUrl} target="_blank" rel="noopener noreferrer">
                <Play size={14} fill="currentColor" />
                {strings.watch}
              </GhostLink>
            </Actions>
          </Copy>

          <Poster thumbnail={itinerary.thumbnail} videoUrl={videoUrl} label={strings.watch} />
        </Layout>

        <Stats
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          <Stat>
            <strong>
              <CountUp value={stats.days} />
            </strong>
            <span>{strings.stats.days}</span>
          </Stat>
          <Stat>
            <strong>
              <CountUp value={stats.cities} />
            </strong>
            <span>{strings.stats.cities}</span>
          </Stat>
          <Stat>
            <strong>
              <CountUp value={stats.activities} />
            </strong>
            <span>{strings.stats.activities}</span>
          </Stat>
          <Stat title={strings.budgetNote}>
            <strong>{formatEuroRange({ min: stats.budgetMin, max: stats.budgetMax }, strings)}</strong>
            <span>
              {strings.stats.budget} · {strings.budgetNote}
            </span>
          </Stat>
        </Stats>
      </Container>
    </Hero>
  );
}

/* ── Video poster with a pointer-driven 3D tilt ── */

function Poster({ thumbnail, videoUrl, label }: { thumbnail: string; videoUrl: string; label: string }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useTransform(glareX, (x) => `radial-gradient(circle at ${x} 0%, rgba(255,255,255,0.25), transparent 55%)`);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <PosterStage
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: EASE }}
    >
      <PosterCard
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        style={{ rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
      >
        <Image src={thumbnail} alt="" fill sizes="(max-width: 960px) 100vw, 560px" priority />
        <PosterGlare style={{ background: glare }} />
        <PlayBadge>
          <Play size={22} fill="currentColor" />
        </PlayBadge>
      </PosterCard>
    </PosterStage>
  );
}

function CountUp({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, delay: 0.9, ease: EASE });
    return () => controls.stop();
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Hero = styled.section`
  position: relative;
  padding: 6.5rem 0 3rem;
  overflow: hidden;

  @media (max-width: 640px) {
    padding-top: 5.5rem;
  }
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Glow = styled.div<{ $color: string }>`
  position: absolute;
  inset: -30% -10% auto;
  height: 90%;
  background:
    radial-gradient(45% 50% at 25% 35%, color-mix(in srgb, ${(p) => p.$color} 22%, transparent), transparent 70%),
    radial-gradient(40% 45% at 85% 30%, rgba(111, 140, 255, 0.12), transparent 70%);
  filter: blur(30px);
`;

const Watermark = styled.span`
  position: absolute;
  right: -2vw;
  bottom: -6vw;
  font-size: clamp(10rem, 32vw, 30rem);
  line-height: 1;
  font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 1px var(--it-watermark);
  user-select: none;
`;

const TopRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  color: ${tokens.muted};
  background: ${tokens.fill};
  border: 1px solid ${tokens.border};
  transition: color 0.25s ease, background 0.25s ease, transform 0.25s ease;

  &:hover {
    color: ${tokens.ink};
    background: ${tokens.fillStrong};
    transform: translateX(-2px);
  }
`;

const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  margin-top: clamp(2rem, 5vw, 3.5rem);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  min-width: 0;
`;

const Flag = styled(Image)`
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  margin-top: 1.1rem;
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(3.2rem, 9vw, 6.4rem);
  font-weight: 400;
  font-style: italic;
  line-height: 0.92;
  letter-spacing: -0.035em;
  color: ${tokens.ink};
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.22em;
`;

const Lead = styled(motion.p)`
  margin-top: 1.4rem;
  max-width: 52ch;
  font-size: clamp(0.98rem, 1.6vw, 1.08rem);
  line-height: 1.7;
  font-weight: 300;
  color: ${tokens.muted};
`;

const Route = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.6rem;
  color: ${tokens.faint};
`;

const RouteChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.75rem 0.4rem 0.6rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${tokens.ink};
  background: color-mix(in srgb, ${(p) => p.$color} 10%, transparent);
  border: 1px solid color-mix(in srgb, ${(p) => p.$color} 35%, transparent);

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: 0 0 10px ${(p) => p.$color};
  }

  small {
    font-family: ${(p) => p.theme.fonts.mono};
    font-size: 0.68rem;
    font-weight: 500;
    color: ${tokens.faint};
  }
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 2rem;
`;

const PrimaryButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.95rem 1.5rem;
  border-radius: 100px;
  font-size: 0.92rem;
  font-weight: 650;
  color: ${tokens.onInverse};
  background: ${tokens.inverse};
  transition: box-shadow 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    box-shadow: 0 12px 40px -10px color-mix(in srgb, ${tokens.inverse} 45%, transparent);
  }

  &:hover svg {
    transform: translateY(3px);
  }
`;

const GhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.95rem 1.4rem;
  border-radius: 100px;
  font-size: 0.92rem;
  font-weight: 600;
  color: ${tokens.ink};
  border: 1px solid ${tokens.borderStrong};
  transition: background 0.25s ease, border-color 0.25s ease;

  svg {
    color: ${tokens.youtube};
  }

  &:hover {
    background: ${tokens.fill};
    border-color: ${tokens.faint};
  }
`;

const PosterStage = styled(motion.div)`
  perspective: 1200px;
`;

const PosterCard = styled(motion.a)`
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 24px;
  overflow: hidden;
  transform-style: preserve-3d;
  border: 1px solid ${tokens.borderStrong};
  box-shadow:
    0 40px 80px -30px ${tokens.shadow},
    0 0 0 6px ${tokens.fill};

  img {
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const PosterGlare = styled(motion.div)`
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  pointer-events: none;
`;

const PlayBadge = styled.span`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: ${tokens.youtube};
  box-shadow: 0 10px 30px -6px rgba(255, 0, 51, 0.8);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  svg {
    margin-left: 3px;
  }

  ${PosterCard}:hover & {
    transform: scale(1.1);
  }
`;

const Stats = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 0.7fr)) minmax(0, 1.3fr);
  margin-top: clamp(2.5rem, 6vw, 4rem);
  border-radius: 24px;
  overflow: hidden;
  gap: 1px;
  background: ${tokens.border};
  border: 1px solid ${tokens.border};

  @media (max-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    > :last-child {
      grid-column: 1 / -1;
    }
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.2rem 1.4rem;
  background: ${tokens.solid};

  strong {
    font-family: ${(p) => p.theme.fonts.aesthetic};
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    font-weight: 400;
    font-style: italic;
    line-height: 1;
    color: ${tokens.ink};
    font-variant-numeric: tabular-nums;
  }

  > span {
    font-size: 0.75rem;
    color: ${tokens.faint};
  }

  @media (max-width: 720px) {
    padding: 1rem;
  }
`;
