'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { destinations } from '@/data/destinations'
import { getDestinationDetail } from '@/data/destination-details'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Compass } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { localize } from '@/i18n/localize'

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`


/* ═══════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════ */

const Page = styled.div`
  min-height: 100vh;
  background: #030305;
  color: #fff;
`

/* ── Hero ── */

const Hero = styled.section`
  position: relative;
  height: 85vh;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
`

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(3, 3, 5, 0.1) 0%,
      rgba(3, 3, 5, 0.4) 50%,
      #030305 100%
    );
    z-index: 1;
  }

  img {
    object-fit: cover;
  }
`

const BackBtn = styled(Link)`
  position: absolute;
  top: 6rem;
  left: 2rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  padding: 0.55rem 1.2rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  }

  svg { width: 16px; height: 16px; }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem 4rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 3rem;
  }
`

const Badge = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  svg { width: 14px; height: 14px; }
`

const HeroTitle = styled(motion.h1)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 400;
  font-style: italic;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 0.8rem;
`

const HeroCountry = styled(motion.span)`
  font-size: 1.2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  display: block;
  margin-bottom: 1.5rem;
`

const HeroDesc = styled(motion.p)`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  max-width: 550px;
  font-weight: 300;
`

/* ── Stats ── */

const StatsBar = styled(motion.div)`
  max-width: 1100px;
  margin: -2rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 15;
`

const StatsInner = styled.div`
  display: flex;
  gap: 1px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
`

const StatCell = styled(motion.div)`
  flex: 1;
  padding: 1.5rem;
  background: rgba(3, 3, 5, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.8rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.4rem;
  }
`

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;

  svg { width: 18px; height: 18px; }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`

const StatLabel = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
`

/* ── Globe / Map Section ── */

const GlobeSection = styled.section`
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const GlobeContainer = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 280px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 220px;
    height: 220px;
  }
`

const GlobeRing = styled.div`
  position: absolute;
  inset: -10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  animation: ${rotate} 30s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00c8a0;
    box-shadow: 0 0 10px #00c8a0;
    transform: translateX(-50%);
  }
`

const GlobeRing2 = styled(GlobeRing)`
  inset: -25px;
  border-color: rgba(255, 255, 255, 0.03);
  animation-duration: 45s;
  animation-direction: reverse;

  &::before {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: none;
  }
`

const GlobeInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(0, 200, 160, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 65% 65%, rgba(0, 100, 200, 0.1) 0%, transparent 50%),
    rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* Grid lines */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      repeating-linear-gradient(0deg, transparent, transparent 18%, rgba(255,255,255,0.03) 18%, rgba(255,255,255,0.03) 18.5%),
      repeating-linear-gradient(90deg, transparent, transparent 18%, rgba(255,255,255,0.03) 18%, rgba(255,255,255,0.03) 18.5%);
  }
`

const GlobeFlag = styled.img`
  width: 80px;
  height: auto;
  border-radius: 6px;
  position: relative;
  z-index: 1;
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 60px;
  }
`

const GlobeCaption = styled(motion.p)`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  max-width: 400px;
  line-height: 1.5;

  strong {
    color: #00c8a0;
    font-weight: 600;
  }
`

/* ── Highlights ── */

const HighlightsSection = styled.section`
  padding: 2rem 2rem 5rem;
  max-width: 1100px;
  margin: 0 auto;
`

const SectionLabel = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  display: block;
  margin-bottom: 0.8rem;
`

const SectionTitle = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 2.5rem;
`

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
`

const HighlightCard = styled(motion.div)`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  height: 300px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }

  &:hover img {
    transform: scale(1.08);
  }

  img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
    z-index: 1;
  }
`

const HighlightInfo = styled.div`
  position: absolute;
  bottom: 1.2rem;
  left: 1.2rem;
  right: 1.2rem;
  z-index: 2;
`

const HighlightName = styled.h3`
  font-size: 1.1rem;
  font-weight: 650;
  color: #fff;
  margin-bottom: 0.2rem;
`

const HighlightTagline = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
`

/* ── CTA ── */

/* ── Other Destinations ── */

const OtherSection = styled.section`
  padding: 3rem 2rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
`

const OtherGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;

  &::-webkit-scrollbar { height: 0; display: none; }
`

const OtherCard = styled(motion(Link))`
  flex-shrink: 0;
  width: 200px;
  height: 260px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:hover img {
    transform: scale(1.08);
  }

  img {
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
    z-index: 1;
  }
`

const OtherInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

const OtherFlag = styled.img`
  width: 24px;
  height: auto;
  border-radius: 3px;
  flex-shrink: 0;
`

const OtherName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  span:first-child {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
  }

  span:last-child {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
  }
`

const CTASection = styled.section`
  padding: 4rem 2rem 6rem;
  text-align: center;
  position: relative;
`

const CTAGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 200, 160, 0.08) 0%, transparent 60%);
  filter: blur(60px);
  pointer-events: none;
`

const CTAButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-2px);
  }

  svg { width: 16px; height: 16px; }
`

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const { lang, t } = useLanguage()
  const destination = destinations.find(d => d.slug === slug)
  const detail = getDestinationDetail(slug)

  if (!destination) notFound()

  const statsIcons = [Clock, Compass, MapPin]
  const country = localize(destination.country, lang)

  return (
    <Page>
      {/* ── Hero ── */}
      <Hero>
        <BackBtn href="/#travel">
          <ArrowLeft />
          {t.destinationPage.back}
        </BackBtn>

        <HeroBg>
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            priority
          />
        </HeroBg>

        <HeroContent>
          {detail?.badge && (
            <Badge
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <MapPin />
              {detail.badge}
            </Badge>
          )}

          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {destination.name}
          </HeroTitle>

          <HeroCountry
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {country}
          </HeroCountry>

          <HeroDesc
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {localize(detail?.description ?? destination.description, lang)}
          </HeroDesc>
        </HeroContent>
      </Hero>

      {/* ── Stats ── */}
      <StatsBar
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <StatsInner>
          {destination.stats.map((stat, i) => {
            const Icon = statsIcons[i] || MapPin
            return (
              <StatCell key={i}>
                <StatIcon><Icon /></StatIcon>
                <StatInfo>
                  <StatLabel>{localize(stat.label, lang)}</StatLabel>
                  <StatValue>{localize(stat.value, lang)}</StatValue>
                </StatInfo>
              </StatCell>
            )
          })}
        </StatsInner>
      </StatsBar>

      {/* ── Globe ── */}
      <GlobeSection>
        <GlobeContainer
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlobeRing />
          <GlobeRing2 />
          <GlobeInner>
            <GlobeFlag
              src={`https://flagcdn.com/w160/${destination.countryCode}.png`}
              alt={country}
            />
          </GlobeInner>
        </GlobeContainer>

        <GlobeCaption
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {destination.stats[0] && (
            <>
              <strong>{localize(destination.stats[0].value, lang)}</strong> {t.destinationPage.onSite}
              {destination.stats[1] && <> &middot; {t.destinationPage.season} <strong>{localize(destination.stats[1].value, lang).toLowerCase()}</strong></>}
            </>
          )}
        </GlobeCaption>
      </GlobeSection>

      {/* ── Highlights ── */}
      {detail?.highlights && detail.highlights.length > 0 && (
        <HighlightsSection>
          <SectionLabel
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.destinationPage.highlights}
          </SectionLabel>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {localize(detail.subtitle, lang)}
          </SectionTitle>

          <HighlightsGrid>
            {detail.highlights.map((h, i) => (
              <HighlightCard
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={h.imageUrl} alt={localize(h.name, lang)} fill />
                <HighlightInfo>
                  <HighlightName>{localize(h.name, lang)}</HighlightName>
                  <HighlightTagline>{localize(h.tagline, lang)}</HighlightTagline>
                </HighlightInfo>
              </HighlightCard>
            ))}
          </HighlightsGrid>
        </HighlightsSection>
      )}

      {/* ── Other Destinations ── */}
      <OtherSection>
        <SectionLabel
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t.destinationPage.otherDestinations}
        </SectionLabel>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '1.5rem' }}
        >
          {t.destinationPage.continueAdventure}
        </SectionTitle>

        <OtherGrid>
          {destinations
            .filter(d => d.slug !== slug)
            .map((d, i) => (
              <OtherCard
                key={d.id}
                href={`/destination/${d.slug}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={d.imageUrl} alt={d.name} fill />
                <OtherInfo>
                  <OtherFlag
                    src={`https://flagcdn.com/w80/${d.countryCode}.png`}
                    alt={localize(d.country, lang)}
                  />
                  <OtherName>
                    <span>{localize(d.country, lang)}</span>
                    <span>{d.name}</span>
                  </OtherName>
                </OtherInfo>
              </OtherCard>
            ))}
        </OtherGrid>
      </OtherSection>

      {/* ── CTA ── */}
      <CTASection>
        <CTAGlow />
        <SectionTitle
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '1.5rem' }}
        >
          {t.destinationPage.ctaBefore}{country}{t.destinationPage.ctaAfter}
        </SectionTitle>
        <CTAButton
          href="https://www.tiktok.com/@7kinze"
          target="_blank"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {t.destinationPage.vlogsBefore}{country}{t.destinationPage.vlogsAfter}
          <Compass size={16} />
        </CTAButton>
      </CTASection>
    </Page>
  )
}
