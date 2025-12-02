'use client'

import styled from 'styled-components'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const HeroContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #030305;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
`

const BackgroundGrid = styled.div`
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
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

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`

const TitleWrapper = styled.div`
  overflow: hidden;
  padding: 0 4rem; /* Increased padding to accommodate italic overflow */
`

const Title = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(4rem, 12vw, 11rem);
  font-weight: 400; /* Bodoni looks best at regular/light weights */
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
  font-style: italic;
  
  span {
    display: inline-block;
  }
`

const SubtitleWrapper = styled.div`
  overflow: hidden;
`

const Subtitle = styled(motion.div)`
  font-family: ${props => props.theme.fonts.main};
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  gap: 1.5rem;
  align-items: center;

  &::before, &::after {
    content: '';
    width: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
`

const FloatingElements = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const FloatItem = styled(motion.div)`
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
`

const AppCard = styled(FloatItem)`
  width: 180px;
  height: 180px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    object-fit: cover;
  }
`

const PhotoCard = styled(FloatItem)`
  width: 200px;
  height: 280px;
  background: #fff;
  padding: 8px;
  padding-bottom: 35px;
  transform: rotate(-5deg);

  img {
    object-fit: cover;
    border-radius: 4px;
  }
`

const SocialActions = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 4rem;
`

const SocialButton = styled(motion.a) <{ $glow: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.6rem;
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  backdrop-filter: blur(20px);
  color: white;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);

  /* Gradient Border Effect via Pseudo-element */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 100px;
    padding: 1.5px; /* Thicker border for visibility */
    background: linear-gradient(90deg, transparent, ${props => props.$glow}, transparent);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    background-size: 200% 100%;
    animation: borderFlow 3s linear infinite;
  }

  @keyframes borderFlow {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* Hover State */
  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 
      0 20px 40px -10px ${props => props.$glow}30,
      0 0 15px ${props => props.$glow}20; /* Inner glow hint */
    border-color: transparent;

    &::before {
      opacity: 1;
      background: linear-gradient(90deg, ${props => props.$glow}, white, ${props => props.$glow});
      background-size: 200% 100%;
    }
  }

  /* Shine Effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.5s ease;
  }

  &:hover::after {
    left: 150%;
    transition: left 0.6s ease;
  }
`

const SocialIcon = styled.div`
  width: 28px;
  height: 28px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));
  transition: transform 0.3s ease;
  
  svg {
    width: 100%;
    height: 100%;
  }

  ${SocialButton}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`

const SocialText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  position: relative;
  z-index: 1;

  span {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.3s ease;
  }

  strong {
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: -0.01em;
    color: #fff;
  }

  ${SocialButton}:hover & span {
    color: rgba(255, 255, 255, 0.9);
  }
`

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const x1 = useTransform(springX, [-0.5, 0.5], [-40, 40])
  const y1 = useTransform(springY, [-0.5, 0.5], [-40, 40])

  const x2 = useTransform(springX, [-0.5, 0.5], [25, -25])
  const y2 = useTransform(springY, [-0.5, 0.5], [25, -25])

  const x3 = useTransform(springX, [-0.5, 0.5], [-15, 15])
  const y3 = useTransform(springY, [-0.5, 0.5], [15, -15])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) - 0.5
      const y = (e.clientY / innerHeight) - 0.5
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <HeroContainer ref={containerRef}>
      <BackgroundGrid />

      <AmbientGlow
        style={{ top: '-20%', left: '-10%' }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <SecondaryGlow
        style={{ bottom: '-20%', right: '-10%' }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <FloatingElements>
        <AppCard
          style={{ top: '18%', left: '18%', x: x1, y: y1, rotate: -8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <Image src="/images/projects/Oshii_dark.png" alt="Oshii App" fill />
        </AppCard>

        <AppCard
          style={{ bottom: '22%', right: '18%', x: x2, y: y2, rotate: 12 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Image src="/images/projects/Zenko.png" alt="Zenko App" fill />
        </AppCard>

        <PhotoCard
          style={{ top: '22%', right: '22%', x: x3, y: y3, rotate: 6 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Image src="/images/destinations/Japon.png" alt="Japan" fill />
        </PhotoCard>

        <PhotoCard
          style={{ bottom: '18%', left: '22%', x: x1, y: y3, rotate: -6 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 1 }}
        >
          <Image src="/images/destinations/Islande.png" alt="Iceland" fill />
        </PhotoCard>
      </FloatingElements>

      <Content>
        <TitleWrapper>
          <Title
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            KENZ
          </Title>
        </TitleWrapper>

        <SubtitleWrapper>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Je forge mes rêves avec passion.
          </Subtitle>
        </SubtitleWrapper>

        <SocialActions
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <SocialButton
            href="https://www.tiktok.com/@7kinze"
            target="_blank"
            $glow="#ff0050"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SocialIcon>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.14c0 3.48-2.32 6.66-5.79 7.18-4.78.72-9.14-2.56-9.66-7.3C.68 9.28 4.31 4.91 9.24 5.3c.64.05 1.28.22 1.88.49v4.2c-.17-.07-.35-.1-.53-.13-1.74-.22-3.35.81-3.97 2.47-.73 1.96.25 4.21 2.17 5.03 2.21.94 4.82-.4 5.54-2.7.13-.42.19-.85.19-1.29v-13.36H12.525z" /></svg>
            </SocialIcon>
            <SocialText>
              <span>Suivre sur</span>
              <strong>TikTok</strong>
            </SocialText>
          </SocialButton>

          <SocialButton
            href="https://www.youtube.com/@7Kinze"
            target="_blank"
            $glow="#FF0000"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SocialIcon>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </SocialIcon>
            <SocialText>
              <span>S'abonner</span>
              <strong>YouTube</strong>
            </SocialText>
          </SocialButton>
        </SocialActions>
      </Content>
    </HeroContainer>
  )
}
