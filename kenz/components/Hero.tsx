'use client'

import styled from 'styled-components'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useMode } from '@/contexts/mode-context'
import { useTranslation } from '@/contexts/language-context'
import { ArrowRight } from 'lucide-react'

/* ═══════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════ */

const HeroContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  background: #030305;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
  }
`

/* Contains all background effects so they don't cause scrollbars */
const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`

const PersoBackground = styled.div`
  position: absolute;
  inset: 0;
  background: url('/images/background-moi.webp') center center / cover no-repeat;
  z-index: 0;
  pointer-events: none;
`

const BackgroundGrid = styled.div`
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100px 100px;
  transform: rotateX(45deg);
  mask-image: radial-gradient(circle at 50% 50%, black, transparent 70%);
  pointer-events: none;
`

const AmbientGlow = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(120px);
  mix-blend-mode: screen;
`

const SecondaryGlow = styled(motion.div)`
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(255, 0, 85, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(100px);
  mix-blend-mode: screen;
`

/* ═══════════════════════════════════════════
   PRO MODE — Reference-style layout
   ═══════════════════════════════════════════ */

const ProWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 7rem 2rem 0;
  overflow: hidden;

  @media (max-width: 768px) {
    overflow: visible;
    height: auto;
    min-height: 100%;
    padding: 5rem 1rem 2rem;
  }
`

/* Neon glow behind the photo — cyan for Pro, orange for Perso */
const PhotoGlow = styled(motion.div)<{ $variant: 'pro' | 'perso' }>`
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: ${p => p.$variant === 'pro'
    ? `radial-gradient(ellipse at 50% 40%, rgba(0, 240, 255, 0.3) 0%, transparent 50%),
       radial-gradient(ellipse at 40% 50%, rgba(0, 180, 200, 0.2) 0%, transparent 45%),
       radial-gradient(ellipse at 60% 60%, rgba(0, 255, 180, 0.15) 0%, transparent 50%)`
    : `radial-gradient(ellipse at 50% 40%, rgba(255, 160, 50, 0.3) 0%, transparent 50%),
       radial-gradient(ellipse at 40% 50%, rgba(255, 120, 30, 0.2) 0%, transparent 45%),
       radial-gradient(ellipse at 60% 60%, rgba(255, 80, 50, 0.15) 0%, transparent 50%)`
  };
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
`

/* Title block — centered above the photo */
const ProTitleBlock = styled.div`
  text-align: center;
  position: relative;
  z-index: 3;
  margin-bottom: -11rem;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: -3rem;
  }
`

const ProGreeting = styled(motion.p)`
  font-family: ${props => props.theme.fonts.main};
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  font-weight: 300;
  color: #fff;
  margin-bottom: 0.3rem;
`

const ProNameLine = styled.div`
  width: 100%;
  text-align: center;
`

const proNameBase = `
  font-weight: 400;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.03em;
  white-space: nowrap;
`

const ProNameWhite = styled.span`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  ${proNameBase}
  color: #fff;
`

const ProNameGreen = styled.span`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  ${proNameBase}
  color: #00c8a0;
  text-shadow: 0 0 40px rgba(0, 200, 160, 0.3), 0 0 80px rgba(0, 200, 160, 0.15);
  padding-right: 0.1em;
`

/* ── Social comment cards (Perso mode) ── */

const SocialComment = styled(motion.div)<{ $left?: string; $right?: string; $top?: string; $bottom?: string }>`
  position: absolute;
  ${p => p.$left && `left: ${p.$left};`}
  ${p => p.$right && `right: ${p.$right};`}
  ${p => p.$top && `top: ${p.$top};`}
  ${p => p.$bottom && `bottom: ${p.$bottom};`}
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
  background: rgba(20, 20, 22, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  max-width: 280px;

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    max-width: 100%;
  }
`

const CommentAvatar = styled.div<{ $bg: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 14px; height: 14px; }
`

const CommentBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
`

const CommentUser = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
`

const CommentTime = styled.span`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
  margin-left: 0.4rem;
`

const CommentText = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
`

const SocialNotif = styled(motion.div)<{ $left?: string; $right?: string; $top?: string; $bottom?: string }>`
  position: absolute;
  ${p => p.$left && `left: ${p.$left};`}
  ${p => p.$right && `right: ${p.$right};`}
  ${p => p.$top && `top: ${p.$top};`}
  ${p => p.$bottom && `bottom: ${p.$bottom};`}
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 100px;
  background: rgba(20, 20, 22, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  white-space: nowrap;

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
  }
`

const NotifIcon = styled.span`
  font-size: 1rem;
`

const NotifText = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);

  strong {
    color: #fff;
    font-weight: 700;
  }
`

const PersoNameOrange = styled.span`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  ${proNameBase}
  color: #ff8c38;
  text-shadow: 0 0 40px rgba(255, 140, 56, 0.3), 0 0 80px rgba(255, 140, 56, 0.15);
  padding-right: 0.1em;
`

/* Photo — large centered, overlapping title */
const ProPhotoContainer = styled(motion.div)<{ $narrow?: boolean }>`
  position: relative;
  z-index: 2;
  width: ${p => p.$narrow ? 'clamp(380px, 55vw, 620px)' : 'clamp(500px, 85vw, 1000px)'};
  height: clamp(600px, 95vh, 1100px);
  margin: 0 auto;

  /* Fade out at the bottom */
  mask-image: ${p => p.$narrow
    ? 'linear-gradient(to bottom, black 60%, transparent 95%)'
    : 'linear-gradient(to bottom, black 50%, transparent 90%)'};
  -webkit-mask-image: ${p => p.$narrow
    ? 'linear-gradient(to bottom, black 60%, transparent 95%)'
    : 'linear-gradient(to bottom, black 50%, transparent 90%)'};

  @media (max-width: 768px) {
    width: 85vw;
    max-width: 350px;
    height: 60vh;
  }
`

const ProPhoto = styled.div<{ $fit?: 'cover' | 'contain' }>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  img {
    object-fit: ${p => p.$fit || 'cover'};
    object-position: ${p => (p.$fit === 'contain' ? 'center' : 'top center')};
    transform: ${p => (p.$fit === 'contain' ? 'translateY(16%) scale(1.35)' : 'none')};
    transform-origin: center;

    @media (max-width: 768px) {
      object-fit: cover;
      object-position: top center;
      transform: none;
    }
  }
`

/* Floating elements — positioned from the full-width wrapper, not the photo */
const ProFloatingLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;

  @media (max-width: 768px) {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
    padding: 0 1rem;
    margin-top: 1rem;
  }
`

const AvailableBadge = styled(motion.div)`
  position: absolute;
  left: 6%;
  top: 42%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.7rem 1.4rem;
  border-radius: 100px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  pointer-events: auto;
  white-space: nowrap;

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    top: auto;
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }
`

const GreenDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
  flex-shrink: 0;
`

const ProBioFloat = styled(motion.p)`
  position: absolute;
  right: 6%;
  top: 44%;
  max-width: 220px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-weight: 400;
  pointer-events: auto;

  @media (max-width: 768px) {
    position: relative;
    right: auto;
    top: auto;
    max-width: 100%;
    text-align: center;
  }
`

const TrustBlock = styled(motion.div)`
  position: absolute;
  left: 6%;
  bottom: 22%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  pointer-events: auto;

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    bottom: auto;
    justify-content: center;
  }
`

const AvatarStack = styled.div`
  display: flex;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #030305;
    object-fit: cover;
    margin-left: -8px;

    &:first-child {
      margin-left: 0;
    }
  }
`

const TrustText = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
  max-width: 200px;

  strong {
    color: #fff;
    font-weight: 700;
  }
`

const GetInTouchButton = styled(motion.a)`
  position: absolute;
  right: 6%;
  bottom: 22%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.8rem 1.6rem;
  border-radius: 100px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  pointer-events: auto;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    position: relative;
    right: auto;
    bottom: auto;
  }
`

/* ═══════════════════════════════════════════
   PERSO MODE — centered layout (original)
   ═══════════════════════════════════════════ */


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { isPro } = useMode()
  const t = useTranslation()
  const [stepIndex, setStepIndex] = useState(0)
  const steps = isPro ? t.hero.proSteps : t.hero.persoSteps
  const currentStep = steps[stepIndex % steps.length]

  useEffect(() => {
    setStepIndex(0)
  }, [isPro])

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [steps.length])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const x3 = useTransform(springX, [-0.5, 0.5], [-15, 15])
  const y3 = useTransform(springY, [-0.5, 0.5], [15, -15])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth) - 0.5)
      mouseY.set((e.clientY / innerHeight) - 0.5)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <HeroContainer ref={containerRef}>
      {isPro ? (
        <BackgroundLayer>
          <BackgroundGrid />
          <AmbientGlow
            style={{ top: '-20%', left: '-10%' }}
            animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <SecondaryGlow
            style={{ bottom: '-20%', right: '-10%' }}
            animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </BackgroundLayer>
      ) : (
        <PersoBackground />
      )}

      {/* ═══ MODE SWITCH ═══ */}
      <AnimatePresence mode="wait">
        {isPro ? (
          /* ── PRO: reference-style hero ── */
          <ProWrapper
            key="pro-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title above photo */}
            <ProTitleBlock>
              <ProGreeting
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {t.hero.greetingPro}
              </ProGreeting>
              <ProNameLine>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stepIndex}
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProNameWhite>{currentStep[0]} </ProNameWhite>
                    <ProNameGreen>{currentStep[1]}</ProNameGreen>
                  </motion.span>
                </AnimatePresence>
              </ProNameLine>
            </ProTitleBlock>

            {/* Centered photo with glow */}
            <div style={{ position: 'relative' }}>
              <PhotoGlow
                $variant="pro"
                style={{ left: '50%', top: '40%', x: '-50%', y: '-50%' }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <ProPhotoContainer
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ x: x3, y: y3 }}
              >
                <ProPhoto $fit="contain">
                  <Image
                    src="/images/Pro-pp.webp"
                    alt="Kenz"
                    fill
                    sizes="(max-width: 768px) 340px, 560px"
                    priority
                  />
                </ProPhoto>
              </ProPhotoContainer>
            </div>

            {/* Floating elements — full width of ProWrapper */}
            <ProFloatingLayer>
              <AvailableBadge
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <GreenDot />
                {t.hero.available}
              </AvailableBadge>

              <ProBioFloat
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {t.hero.bio}
              </ProBioFloat>

              <TrustBlock
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <AvatarStack>
                  <Image src="/images/projects/oshii/icon.webp" alt="" width={32} height={32} />
                  <Image src="/images/projects/zenko/icon.webp" alt="" width={32} height={32} />
                </AvatarStack>
                <TrustText>
                  <strong>{t.hero.trust.apps}</strong>{t.hero.trust.middle}<strong>{t.hero.trust.downloads}</strong>
                </TrustText>
              </TrustBlock>

              <GetInTouchButton
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  window.dispatchEvent(new Event('open-contact-modal'))
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowRight />
                {t.hero.contact}
              </GetInTouchButton>
            </ProFloatingLayer>
          </ProWrapper>
        ) : (
          /* ── PERSO: same layout as Pro but with orange glow + Moi photo ── */
          <ProWrapper
            key="perso-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProTitleBlock>
              <ProGreeting
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {t.hero.greetingPerso}
              </ProGreeting>
              <ProNameLine>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stepIndex}
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProNameWhite>{currentStep[0]} </ProNameWhite>
                    <PersoNameOrange>{currentStep[1]}</PersoNameOrange>
                  </motion.span>
                </AnimatePresence>
              </ProNameLine>
            </ProTitleBlock>

            <div style={{ position: 'relative' }}>
              <PhotoGlow
                $variant="perso"
                style={{ left: '50%', top: '40%', x: '-50%', y: '-50%' }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <ProPhotoContainer
                $narrow
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ x: x3, y: y3 }}
              >
                <ProPhoto>
                  <Image
                    src="/images/Moi-pp.webp"
                    alt="Kenz"
                    fill
                    sizes="(max-width: 768px) 340px, 560px"
                    priority
                  />
                </ProPhoto>
              </ProPhotoContainer>
            </div>

            <ProFloatingLayer>
              {/* TikTok — Voyage content */}
              <SocialComment
                $left="4%"
                $top="38%"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <CommentAvatar $bg="#ff0050">
                  <svg viewBox="0 0 24 24" fill="#fff" width="14" height="14"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.14c0 3.48-2.32 6.66-5.79 7.18-4.78.72-9.14-2.56-9.66-7.3C.68 9.28 4.31 4.91 9.24 5.3c.64.05 1.28.22 1.88.49v4.2c-.17-.07-.35-.1-.53-.13-1.74-.22-3.35.81-3.97 2.47-.73 1.96.25 4.21 2.17 5.03 2.21.94 4.82-.4 5.54-2.7.13-.42.19-.85.19-1.29v-13.36H12.525z" /></svg>
                </CommentAvatar>
                <CommentBody>
                  <CommentUser>TikTok <CommentTime>{t.hero.tiktok.handle}</CommentTime></CommentUser>
                  <CommentText>{t.hero.tiktok.text}</CommentText>
                </CommentBody>
              </SocialComment>

              {/* YouTube — Chaîne */}
              <SocialComment
                $right="4%"
                $top="42%"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <CommentAvatar $bg="#FF0000">
                  <svg viewBox="0 0 24 24" fill="#fff" width="14" height="14"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </CommentAvatar>
                <CommentBody>
                  <CommentUser>YouTube <CommentTime>{t.hero.youtube.handle}</CommentTime></CommentUser>
                  <CommentText>{t.hero.youtube.text}</CommentText>
                </CommentBody>
              </SocialComment>

              {/* Notif: followers */}
              <SocialNotif
                $left="5%"
                $bottom="24%"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <NotifIcon>🎉</NotifIcon>
                <NotifText><strong>{t.hero.notifFollowers.strong}</strong>{t.hero.notifFollowers.rest}</NotifText>
              </SocialNotif>

              {/* Notif: business */}
              <SocialNotif
                $right="5%"
                $bottom="22%"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <NotifIcon>🚀</NotifIcon>
                <NotifText><strong>{t.hero.notifApps.apps}</strong>{t.hero.notifApps.middle}<strong>{t.hero.notifApps.countries}</strong>{t.hero.notifApps.rest}</NotifText>
              </SocialNotif>
            </ProFloatingLayer>
          </ProWrapper>
        )}
      </AnimatePresence>
    </HeroContainer>
  )
}
