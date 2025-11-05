"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

const logos: {
  src: string;
  alt: string;
  delay: number;
  size: number;
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  rotate?: number;
  blur?: number;
  opacity?: number;
}[] = [
  {
    src: "/images/projects/nebula.svg",
    alt: "Nebula logo",
    delay: 0.05,
    size: 68,
    position: { top: -30, left: 6 },
    rotate: -16,
    blur: 0.9,
  },
  {
    src: "/images/projects/pulse.svg",
    alt: "Pulse logo",
    delay: 0.12,
    size: 60,
    position: { top: -28, right: 12 },
    rotate: 12,
    blur: 0.9,
  },
  {
    src: "/images/projects/Oshii_dark.png",
    alt: "Oshii logo",
    delay: 0.18,
    size: 82,
    position: { bottom: -24, left: 14 },
    rotate: 9,
    blur: 0.95,
  },
  {
    src: "/images/projects/Zenko.png",
    alt: "Zenko logo",
    delay: 0.24,
    size: 94,
    position: { bottom: 14, right: 8 },
    rotate: -8,
    blur: 1.1,
    opacity: 0.85,
  },
];

type HeroWordmarkProps = {
  socials: SocialLink[];
};

type LogoBubbleProps = {
  $size: number;
  $top?: number;
  $left?: number;
  $right?: number;
  $bottom?: number;
  $rotate?: number;
  $blur?: number;
  $opacity?: number;
};

const WordmarkContainer = styled(motion.div)`
  position: relative;
  margin-inline: auto;
  width: min(100%, 34rem);
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const TitleText = styled.span`
  display: block;
  background: linear-gradient(
    180deg,
    var(--foreground) 0%,
    color-mix(in srgb, var(--foreground) 65%, transparent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  font-size: clamp(2.75rem, 8vw, 5.5rem);
  letter-spacing: -0.035em;
  text-shadow: 0 20px 30px rgba(8, 7, 5, 0.2);
  padding-left: 2rem;
`;

const Description = styled(motion.p)`
  max-width: 32rem;
  color: var(--muted);
  font-size: clamp(0.95rem, 1vw + 0.85rem, 1.15rem);
  line-height: 1.6;
 padding-left: 2rem;
  @media (min-width: 640px) {
    margin-top: 1rem;
  }
`;

const SocialBar = styled(motion.div)`
  margin-top: 1.5rem;
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 1.85rem;
  border-radius: 15px;
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  background-color: color-mix(in srgb, var(--card) 35%, transparent);
  color: var(--muted);
  box-shadow: 0 10px 28px rgba(10, 10, 10, 0.14);
  backdrop-filter: blur(14px);
  @media (min-width: 640px) {
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.65rem 1.25rem;
  }
`;

const SocialItem = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.35rem 0.7rem;
  font-size: clamp(0.75rem, 0.6vw + 0.7rem, 0.95rem);
  font-weight: 500;
  color: inherit;
  transition: color 0.25s ease, transform 0.25s ease;

  &:hover,
  &:focus-visible {
    color: var(--foreground);
    transform: translateY(-1px);
  }
`;

const SocialIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 0.6vw + 0.85rem, 1.25rem);
  color: color-mix(in srgb, var(--foreground) 80%, transparent);
`;

const SocialLabel = styled.span`
  white-space: nowrap;
`;

const LogoLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -10;
`;

const LogoBubble = styled(motion.span)<LogoBubbleProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
  padding: 0.5rem;
  background-color: color-mix(in srgb, var(--background) 85%, transparent);
  box-shadow: 0 15px 40px rgba(10, 10, 10, 0.25);
  backdrop-filter: blur(16px);
  width: ${({ $size }) => `clamp(${0.65 * $size}px, ${$size}px + 1vw, ${1.25 * $size}px)`};
  height: ${({ $size }) => `clamp(${0.65 * $size}px, ${$size}px + 1vw, ${1.25 * $size}px)`};
  transform: ${({ $rotate = 0 }) =>
    `perspective(1200px) rotateX(22deg) rotateY(-6deg) rotateZ(${$rotate}deg)`};
  filter: ${({ $blur }) => ($blur ? `blur(${$blur}px)` : "none")};
  opacity: ${({ $opacity }) => $opacity ?? 1};

  ${({ $top }) =>
    $top !== undefined &&
    css`
      top: ${$top}%;
    `}

  ${({ $left }) =>
    $left !== undefined &&
    css`
      left: ${$left}%;
    `}

  ${({ $right }) =>
    $right !== undefined &&
    css`
      right: ${$right}%;
    `}

  ${({ $bottom }) =>
    $bottom !== undefined &&
    css`
      bottom: ${$bottom}%;
    `}
`;

const LogoImage = styled(Image)`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 1rem;
`;

export function HeroWordmark({ socials }: HeroWordmarkProps) {
  return (
    <WordmarkContainer
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <TitleText>Kenz.</TitleText>
      </div>

      <Description
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Toujours en bien et dans le bon.
      </Description>

      <SocialBar
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {socials.map((social) => (
          <SocialItem
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
          >
            <SocialIcon>{social.icon}</SocialIcon>
            <SocialLabel>{social.label}</SocialLabel>
          </SocialItem>
        ))}
      </SocialBar>

      <LogoLayer>
        {logos.map((logo) => (
          <LogoBubble
            key={logo.src}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25 + logo.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            $size={logo.size}
            $top={logo.position.top}
            $left={logo.position.left}
            $right={logo.position.right}
            $bottom={logo.position.bottom}
            $rotate={logo.rotate}
            $blur={logo.blur}
            $opacity={logo.opacity}
          >
            <LogoImage src={logo.src} alt="" width={120} height={120} priority={false} />
            <span className="sr-only">{logo.alt}</span>
          </LogoBubble>
        ))}
      </LogoLayer>
    </WordmarkContainer>
  );
}
