'use client'

import React, { useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, ExternalLink, ChevronRight, ChevronLeft, Globe } from 'lucide-react'

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`

/* ═══════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════ */

const Page = styled.div`
  min-height: 100vh;
  background: #030305;
  color: #fff;
  overflow-x: hidden;
`

const BackLink = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s ease;
  width: 100%;

  &:hover { color: #fff; }
`

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

const Hero = styled.section<{ $glow: string }>`
  position: relative;
  padding: 8rem 2rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 7rem 1.5rem 3rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const IconWrapper = styled(motion.div)<{ $glow: string }>`
  position: relative;
  z-index: 2;
  width: 140px;
  height: 140px;
  border-radius: 32px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow:
    0 20px 40px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 50px ${p => p.$glow}15;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    width: 110px;
    height: 110px;
    border-radius: 26px;
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  padding-top: 0.2rem;
`

const AppName = styled(motion.h1)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.03em;
`

const Headline = styled(motion.p)`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  font-weight: 300;
  max-width: 480px;
`

const Period = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const AppStoreBtn = styled.a<{ $glow: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.6rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${p => p.$glow}60;
    box-shadow: 0 0 30px ${p => p.$glow}20;
    transform: translateY(-2px);
  }
`

const SocialBtn = styled.a<{ $glow: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${p => p.$glow}60;
    box-shadow: 0 0 30px ${p => p.$glow}20;
    transform: translateY(-2px);
  }
`

/* ═══════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════ */

const StatsSection = styled.section`
  padding: 0 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled(motion.div)<{ $accent: string }>`
  padding: 2rem 1.5rem;
  background: rgba(3, 3, 5, 0.95);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;

  /* Subtle accent line at top */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${p => p.$accent}50, transparent);
  }
`

const StatValue = styled.span<{ $accent: string }>`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: 2.2rem;
  font-weight: 400;
  font-style: italic;
  color: ${p => p.$accent};
  line-height: 1;
`

const StatLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.02em;
`

const StatDesc = styled.span`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1.4;
`

/* ═══════════════════════════════════════════
   PREVIEW / SCREENSHOTS
   ═══════════════════════════════════════════ */

const PreviewSection = styled.section`
  padding: 4rem 0;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`

const PreviewHeader = styled.div`
  padding: 0 2rem;
  margin-bottom: 2rem;
`

const PreviewViewport = styled.div`
  position: relative;
`

const PreviewScroll = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 2rem 2rem;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }
`

const PreviewFade = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${p => p.$side}: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(${p => p.$side === 'right' ? 'to right' : 'to left'}, transparent, #030305);
  pointer-events: none;
  z-index: 3;
`

const ScrollBtn = styled.button<{ $glow: string; $side: 'left' | 'right' }>`
  position: absolute;
  ${p => p.$side}: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 12, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${p => p.$glow}40;
    box-shadow: 0 0 20px ${p => p.$glow}15;
  }
`

const PhoneFrame = styled(motion.div)<{ $glow: string }>`
  flex-shrink: 0;
  width: auto;
  height: 480px;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background: #0a0a0c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
  scroll-snap-align: center;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 30px 60px -10px rgba(0, 0, 0, 0.6),
      0 0 40px ${p => p.$glow}15;
  }

  img {
    height: 100%;
    width: auto;
    display: block;
  }

  @media (max-width: 768px) {
    height: 400px;
    border-radius: 22px;
  }
`

const EmptyFrame = styled(PhoneFrame)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.15);
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

/* ═══════════════════════════════════════════
   OVERVIEW / FEATURES
   ═══════════════════════════════════════════ */

const ContentWrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 5rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
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
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  margin-bottom: 2.5rem;
`

const FeatureGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FeatureCard = styled(motion.div)<{ $index: number; $glow: string }>`
  position: relative;
  padding: 2rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: background 0.4s ease, border-color 0.4s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const FeatureNumber = styled.span<{ $glow: string }>`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: 1.8rem;
  font-style: italic;
  color: ${p => p.$glow}40;
  flex-shrink: 0;
  width: 3rem;
  line-height: 1;
`

const FeatureText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  font-weight: 300;
`

/* ═══════════════════════════════════════════
   TAGS
   ═══════════════════════════════════════════ */

const TagsWrap = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 3rem;
`

const Tag = styled.span`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  padding: 0.45rem 1rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.12);
  }
`

/* ═══════════════════════════════════════════
   CTA FOOTER
   ═══════════════════════════════════════════ */

const CTASection = styled.section<{ $glow: string }>`
  position: relative;
  padding: 5rem 2rem;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${p => p.$glow}15 0%, transparent 60%);
    filter: blur(60px);
    pointer-events: none;
  }
`

const CTATitle = styled(motion.h3)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`

const CTASubtitle = styled(motion.p)`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`

const CTAButton = styled(motion.a)<{ $glow: string }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  border-radius: 100px;
  background: ${p => p.$glow};
  color: #000;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 40px ${p => p.$glow}40;

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: brightness(0);
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 60px ${p => p.$glow}60;
  }
`

/* ═══════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════ */

const Divider = styled.div<{ $glow: string }>`
  max-width: 800px;
  margin: 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${p => p.$glow}20, transparent);
`

/* ═══════════════════════════════════════════
   FRAMER VARIANTS
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function AppDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const project = projects.find(p => p.slug === slug)

  if (!project) notFound()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const glow = project.glowColor || '#00f0ff'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)

  const updateScrollState = () => {
    if (!scrollRef.current) return
    setCanScrollLeft(scrollRef.current.scrollLeft > 10)
  }

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [])

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const appStoreLink = project.socials?.find(s => s.title === 'App Store')
  const otherSocials = project.socials?.filter(s => s.title !== 'App Store') || []

  return (
    <Page>
      {/* ── Hero ── */}
      <Hero $glow={glow}>
        <BackLink
          href="/#apps"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <ArrowLeft size={16} />
          Retour
        </BackLink>

        <IconWrapper
          $glow={glow}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={project.thumbnail}
            alt={project.name}
            width={140}
            height={140}
            sizes="140px"
            priority
          />
        </IconWrapper>

        <HeroContent>
          <AppName
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {project.name}
          </AppName>

          <Headline
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {project.detail?.subheadline || project.description}
          </Headline>

          <Period
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {project.period}
          </Period>

          <HeroActions
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {appStoreLink && (
              <AppStoreBtn
                href={appStoreLink.href}
                target="_blank"
                rel="noopener noreferrer"
                $glow={glow}
              >
                <Image src="/images/icons/Apple_logo_white.webp" alt="Apple" width={18} height={18} />
                Télécharger
              </AppStoreBtn>
            )}
            {project.liveUrl && (
              <SocialBtn href={project.liveUrl} target="_blank" $glow={glow}>
                <Globe size={16} />
                Site web
                <ExternalLink />
              </SocialBtn>
            )}
            {otherSocials.map((social, i) => (
              <SocialBtn key={i} href={social.href} target="_blank" $glow={glow}>
                {social.icon && <Image src={social.icon} alt="" width={16} height={16} />}
                {social.title}
                <ExternalLink />
              </SocialBtn>
            ))}
          </HeroActions>
        </HeroContent>
      </Hero>

      {/* ── Stats ── */}
      {project.detail?.stats && (
        <StatsSection>
          <StatsGrid
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {project.detail.stats.map((stat, i) => (
              <StatCard
                key={i}
                $accent={stat.accentColor || glow}
                variants={fadeUp}
                custom={i * 0.1}
              >
                <StatValue $accent={stat.accentColor || glow}>
                  {stat.value}
                </StatValue>
                <StatLabel>{stat.label}</StatLabel>
                {stat.description && <StatDesc>{stat.description}</StatDesc>}
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>
      )}

      {/* ── Preview / Screenshots ── */}
      <PreviewSection>
        <PreviewHeader>
          <SectionLabel
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Aperçu
          </SectionLabel>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Captures d&apos;écran
          </SectionTitle>
        </PreviewHeader>

        <PreviewViewport>
          <PreviewScroll ref={scrollRef}>
            {project.screenshots && project.screenshots.length > 0 ? (
              project.screenshots.map((src, i) => (
                <PhoneFrame
                  key={i}
                  $glow={glow}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={src}
                    alt={`${project.name} screenshot ${i + 1}`}
                    width={240}
                    height={520}
                    sizes="(max-width: 768px) 200px, 240px"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </PhoneFrame>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <EmptyFrame
                  key={i}
                  $glow={glow}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  Screenshot {i + 1}
                </EmptyFrame>
              ))
            )}
          </PreviewScroll>
          {canScrollLeft && <PreviewFade $side="left" />}
          <PreviewFade $side="right" />
          {canScrollLeft && (
            <ScrollBtn $glow={glow} $side="left" onClick={scrollLeft} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </ScrollBtn>
          )}
          <ScrollBtn $glow={glow} $side="right" onClick={scrollRight} aria-label="Scroll right">
            <ChevronRight size={20} />
          </ScrollBtn>
        </PreviewViewport>
      </PreviewSection>

      <Divider $glow={glow} />

      {/* ── Features ── */}
      <ContentWrap>
        <SectionLabel
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Fonctionnalités
        </SectionLabel>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {project.detail?.headline}
        </SectionTitle>

        <FeatureGrid>
          {project.detail?.overview.map((feature, i) => (
            <FeatureCard
              key={i}
              $index={i}
              $glow={glow}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <FeatureNumber $glow={glow}>0{i + 1}</FeatureNumber>
              <FeatureText>{feature}</FeatureText>
            </FeatureCard>
          ))}
        </FeatureGrid>

        {project.detail?.tags && project.detail.tags.length > 0 && (
          <TagsWrap
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {project.detail.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </TagsWrap>
        )}
      </ContentWrap>

      <Divider $glow={glow} />

      {/* ── CTA ── */}
      {appStoreLink && (
        <CTASection $glow={glow}>
          <CTATitle
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Prêt à essayer {project.name.split(' ')[0]} ?
          </CTATitle>
          <CTASubtitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Disponible gratuitement sur l&apos;App Store.
          </CTASubtitle>
          <CTAButton
            href={appStoreLink.href}
            target="_blank"
            $glow={glow}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image src="/images/icons/Apple_logo_white.webp" alt="Apple" width={18} height={18} />
            Télécharger maintenant
            <ArrowUpRight size={16} />
          </CTAButton>
        </CTASection>
      )}
    </Page>
  )
}
