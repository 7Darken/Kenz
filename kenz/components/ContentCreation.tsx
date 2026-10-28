'use client'

import { Fragment, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronRight, Play } from 'lucide-react'

import { getCityStops, getTripStats, itineraries, type Itinerary } from '@/data/itineraries'
import { useLanguage } from '@/contexts/language-context'
import { localize } from '@/i18n/localize'
import { YOUTUBE_SUBSCRIBE_URL } from '@/lib/socials'

const TIKTOK_URL = 'https://www.tiktok.com/@7kinze'
const TIKTOK_VIDEO_ID = '7544103386883427606'
const YOUTUBE_VIDEO_ID = 'Fp3SsWY28WE'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ContentCreation() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const tiktokY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const youtubeY = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <Section id="content" ref={containerRef}>
      <Container>
        <Header>
          <Title initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {t.contentCreation.title}
          </Title>
          <Subtitle>{t.contentCreation.subtitle}</Subtitle>
        </Header>

        <PlatformGrid>
          <Platform style={{ y: tiktokY }}>
            <PlatformLabel $color="#ff0050">
              <span>●</span> TikTok
            </PlatformLabel>
            <PhoneFrame
              initial={{ rotate: -5 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <iframe
                src={`https://www.tiktok.com/player/v1/${TIKTOK_VIDEO_ID}?music_info=1&description=1`}
                title="TikTok @7kinze"
                allow="fullscreen"
                allowFullScreen
              />
            </PhoneFrame>
            <SubscribeLink
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              $color="#ff0050"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.contentCreation.subscribe}
            </SubscribeLink>
          </Platform>

          <Platform style={{ y: youtubeY }}>
            <PlatformLabel $color="#ff0000">
              <span>●</span> YouTube
            </PlatformLabel>
            <YouTubeEmbed>
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title={t.contentCreation.youtubeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </YouTubeEmbed>
            <JoinText>{t.contentCreation.joinChannel}</JoinText>
            <SubscribeLink
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              $color="#ff0000"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.contentCreation.subscribe}
            </SubscribeLink>
          </Platform>
        </PlatformGrid>

        {itineraries.length > 0 && (
          <Itineraries>
            <ItinerariesHeader>
              <Eyebrow>{t.contentCreation.itinerariesLabel}</Eyebrow>
              <h3>{t.contentCreation.itinerariesTitle}</h3>
              <p>{t.contentCreation.itinerariesSubtitle}</p>
            </ItinerariesHeader>
            {itineraries.map((itinerary, index) => (
              <ItineraryCard key={itinerary.slug} itinerary={itinerary} index={index} />
            ))}
          </Itineraries>
        )}
      </Container>
    </Section>
  )
}

function ItineraryCard({ itinerary, index }: { itinerary: Itinerary; index: number }) {
  const { lang, t } = useLanguage()
  const stops = getCityStops(itinerary)
  const stats = getTripStats(itinerary)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
    >
      <Card href={`/itineraire/${itinerary.slug}`}>
        <CardCopy>
          <NewBadge>
            <i aria-hidden />
            {t.contentCreation.itineraryBadge}
          </NewBadge>
          <CardTitle>{localize(itinerary.title, lang)}</CardTitle>
          <Stops>
            {stops.map((stop, i) => (
              <Fragment key={stop.city.id}>
                {i > 0 && <ChevronRight size={12} aria-hidden />}
                <Stop $color={stop.city.color}>{localize(stop.city.name, lang)}</Stop>
              </Fragment>
            ))}
          </Stops>
          <CardMeta>
            {stats.days} {t.contentCreation.days} · {stats.activities} {t.itinerary.stats.activities}
          </CardMeta>
          <CardCta>
            {t.contentCreation.itineraryCta}
            <ArrowRight size={16} />
          </CardCta>
        </CardCopy>
        <CardMedia>
          <Image src={itinerary.thumbnail} alt="" fill sizes="(max-width: 860px) 100vw, 640px" />
          <PlayDot aria-hidden>
            <Play size={18} fill="currentColor" />
          </PlayDot>
        </CardMedia>
      </Card>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Section = styled.section`
  position: relative;
  padding: 5rem 2rem;
  overflow: hidden;
  scroll-margin-top: 4rem;

  @media (max-width: 640px) {
    padding: 4rem 1rem;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`

const Title = styled(motion.h2)`
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1;
  color: #fff;
`

const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
  font-weight: 300;
`

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 6rem;
  }
`

const Platform = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PlatformLabel = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  span {
    color: ${(p) => p.$color};
  }
`

const PhoneFrame = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 600px;
  overflow: hidden;
  background: #000;
  border: 8px solid #222;
  border-radius: 40px;
  box-shadow:
    0 50px 100px -20px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 10;
    width: 120px;
    height: 25px;
    transform: translateX(-50%);
    background: #222;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`

const YouTubeEmbed = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`

const JoinText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #aaa;
`

const SubscribeLink = styled(motion.a)<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem 1.8rem;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  background: ${(p) => p.$color};
`

/* ── Itineraries ── */

const Itineraries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 8rem;

  @media (max-width: 968px) {
    margin-top: 6rem;
  }
`

const ItinerariesHeader = styled.div`
  margin-bottom: 1rem;
  text-align: center;

  h3 {
    margin-top: 0.75rem;
    font-family: ${(p) => p.theme.fonts.aesthetic};
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400;
    font-style: italic;
    line-height: 1.05;
    color: #fff;
  }

  p {
    max-width: 480px;
    margin: 0.75rem auto 0;
    font-size: 0.95rem;
    line-height: 1.6;
    font-weight: 300;
    color: ${(p) => p.theme.colors.textSecondary};
  }
`

const Eyebrow = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`

const PlayDot = styled.span`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #fff;
  background: #ff0033;
  box-shadow: 0 10px 30px -6px rgba(255, 0, 51, 0.8);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  svg {
    margin-left: 3px;
  }
`

const CardCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  margin-top: 1.75rem;
  padding: 0.8rem 1.3rem;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 650;
  color: #08080a;
  background: #fff;

  svg {
    transition: transform 0.3s ease;
  }
`

const Card = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 32px;
  overflow: hidden;
  background:
    radial-gradient(60% 80% at 0% 100%, rgba(255, 90, 78, 0.14), transparent 70%),
    rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition:
    border-color 0.4s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-4px);
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover ${PlayDot} {
    transform: scale(1.12);
  }

  &:hover ${CardCta} svg {
    transform: translateX(4px);
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const CardCopy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);

  @media (max-width: 860px) {
    order: 2;
    padding-top: 0.5rem;
  }
`

const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2fd6a3;
  background: rgba(47, 214, 163, 0.1);
  border: 1px solid rgba(47, 214, 163, 0.3);

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2fd6a3;
    box-shadow: 0 0 0 0 rgba(47, 214, 163, 0.6);
    animation: pulse-dot 2s ease-out infinite;
  }

  @keyframes pulse-dot {
    to {
      box-shadow: 0 0 0 8px rgba(47, 214, 163, 0);
    }
  }
`

const CardTitle = styled.h4`
  margin-top: 1rem;
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #fff;
`

const Stops = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.3);
`

const Stop = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: 0 0 8px ${(p) => p.$color};
  }
`

const CardMeta = styled.p`
  margin-top: 0.6rem;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
`

const CardMedia = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 24px;
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
`
