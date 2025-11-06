"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styled from "styled-components";

import { fadeIn, fadeInUp, staggerChildren } from "@/lib/motion";
import { HeroWordmark } from "@/components/hero/hero-wordmark";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HERO_SOCIALS, getSocialIcon } from "@/lib/socials";

const socials = HERO_SOCIALS.map(({ label, href }) => ({
  label,
  href,
  icon: getSocialIcon(label, { size: 16 }),
}));

export function HeroSection() {
  return (
    <HeroContainer
      id="home"
      initial="initial"
      animate="animate"
      variants={staggerChildren(0.14)}
    >
      <BackgroundLayer variants={fadeIn} transition={{ duration: 1.2, ease: "easeOut" }}>
        <Halo />
        <GridWrapper>
          <GridPerspective>
            <GridPlane />
          </GridPerspective>
        </GridWrapper>
      </BackgroundLayer>

      <ContentReveal variants={fadeInUp} amount={0.3}>
        <HeroWordmark socials={socials} />
      </ContentReveal>

      <AvatarReveal variants={fadeInUp} amount={0.3}>
        <AvatarCard animate={{ y: [0, -14, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
          <StatusBadge>
            <StatusDot />
            Online
          </StatusBadge>
          <AvatarFrame whileHover={{ rotate: [0, -2, 2, 0] }} transition={{ duration: 2.4, ease: "easeInOut" }}>
            <AvatarImage
              src="/images/kenz-pp.PNG"
              alt="Portrait de Kenz"
              fill
              sizes="(max-width: 768px) 320px, 400px"
              priority
            />
          </AvatarFrame>
        </AvatarCard>
      </AvatarReveal>
    </HeroContainer>
  );
}

const HeroContainer = styled(motion.section)`
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 5vw, 4.5rem);
  padding: clamp(2.5rem, 4vw, 3.5rem) 0 clamp(5rem, 8vw, 6.5rem);
  isolation: isolate;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  top: -12%;
  bottom: -18%;
  left: 50%;
  width: min(100vw, calc(100% + 28vw));
  transform: translateX(-50%);
  z-index: -10;
  pointer-events: none;
  mask-image: radial-gradient(130% 115% at 50% 52%, rgba(0, 0, 0, 0.95) 52%, transparent 95%);
  -webkit-mask-image: radial-gradient(130% 115% at 50% 52%, rgba(0, 0, 0, 0.95) 52%, transparent 95%);
`;

const Halo = styled.div`
  position: absolute;
  pointer-events: none;
  right: clamp(-12%, -6vw, -2%);
  top: clamp(3rem, 10vw, 5rem);
  width: clamp(12rem, 26vw, 24rem);
  height: clamp(12rem, 26vw, 24rem);
  border-radius: 50%;
  background: rgba(244, 139, 39, 0.18);
  filter: blur(140px);
`;

const GridWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  bottom: -65%;
  left: 50%;
  width: 100vw;
  height: 140%;
  transform-origin: center bottom;
  transform: translateX(-50%) scale(1.65);
  opacity: 0.94;

  @media (min-width: 640px) {
    bottom: -58%;
    height: 155%;
    transform: translateX(-50%) scale(1.45);
  }

  @media (min-width: 1024px) {
    transform: translateX(-50%) scale(1.25);
  }
`;

const GridPerspective = styled.div`
  width: 100%;
  height: 100%;
  transform-origin: top;
  transform: perspective(1400px) rotateX(62deg);
`;

const GridPlane = styled.div`
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(244, 139, 39, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(244, 139, 39, 0.09) 1px, transparent 1px);
  background-size: 140px 120px, 140px 120px;
  background-position: center;
`;

const ContentReveal = styled(ScrollReveal)`
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  width: 100%;
  max-width: 38rem;
`;

const AvatarReveal = styled(ScrollReveal)`
  width: 100%;
  max-width: 22rem;
  margin-inline: auto;

  @media (min-width: 768px) {
    margin-inline: 0;
    margin-left: clamp(-2.5rem, -4vw, -3.5rem);
  }
`;

const AvatarCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  padding: clamp(2rem, 2.5vw, 4.5rem);

`;

const StatusBadge = styled.div`
  position: absolute;
  top: clamp(0.9rem, 1.5vw, 1.2rem);
  left: clamp(0.9rem, 1.5vw, 1.2rem);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.15);
  backdrop-filter: blur(6px);
  z-index: 1;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
`;

const AvatarFrame = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid var(--border);
  background: var(--background);
  aspect-ratio: 1 / 1;
`;

const AvatarImage = styled(Image)`
  object-fit: cover;
`;
