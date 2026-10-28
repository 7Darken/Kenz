"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Check,
  ExternalLink,
  Lock,
  Sparkles,
  Unlock,
  Youtube,
} from "lucide-react";

import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/contexts/language-context";
import { YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/socials";
import { EASE, tokens } from "./shared";

/* Honor-system gate: YouTube offers no way to check a subscription without
   making the visitor sign in, so we ask, send them to the channel in a new
   tab, notice when they come back, and let them confirm. */

type Step = "ask" | "waiting" | "back" | "success";

const SUCCESS = "#2fd6a3";
const UNLOCK_DELAY_MS = 1700;

interface SubscribeGateProps {
  stats: { days: number; activities: number };
  /** Confetti palette. */
  colors: string[];
  onUnlock: () => void;
}

export function SubscribeGate({ stats, colors, onUnlock }: SubscribeGateProps) {
  const t = useTranslation().itinerary.gate;
  const [step, setStep] = useState<Step>("ask");
  const cardRef = useRef<HTMLDivElement>(null);

  // Freeze the page behind the gate. The overlay carries data-lenis-prevent,
  // so smooth-scroll never sees the wheel events either.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, [step]);

  // While YouTube is open in another tab, wait for the visitor to come back.
  useEffect(() => {
    if (step !== "waiting") return;
    let left = document.visibilityState === "hidden" || !document.hasFocus();
    const onLeave = () => {
      left = true;
    };
    const onReturn = () => {
      if (left && document.visibilityState === "visible") setStep("back");
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? onLeave() : onReturn());

    window.addEventListener("blur", onLeave);
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "success") return;
    void celebrate(colors);
    const timer = window.setTimeout(onUnlock, UNLOCK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [step, colors, onUnlock]);

  const confirm = () => setStep("success");
  const openYouTube = () => setStep("waiting");

  return (
    <Overlay
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      transition={{ duration: 0.4 }}
    >
      <Aura aria-hidden />

      <TopBar>
        <BackLink href="/">
          <ArrowLeft size={15} />
          {t.back}
        </BackLink>
        <LanguageToggle />
      </TopBar>

      <Card
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-text"
        tabIndex={-1}
        initial={{ opacity: 0, y: 32, scale: 0.96, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -24, scale: 0.97, filter: "blur(12px)" }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        <Avatar $success={step === "success"}>
          <AvatarRing aria-hidden />
          <AvatarImage>
            <Image src="/images/kenz-pp.webp" alt="" fill sizes="88px" priority />
          </AvatarImage>
          <AvatarBadge
            key={step === "success" ? "done" : "yt"}
            $success={step === "success"}
            initial={{ scale: 0.4, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            {step === "success" ? <DrawnCheck /> : <Youtube size={15} />}
          </AvatarBadge>
        </Avatar>
        <Handle>{YOUTUBE_HANDLE}</Handle>

        {(step === "waiting" || step === "back") && (
          <Steps labels={t.steps} current={step === "waiting" ? 1 : 2} />
        )}

        <AnimatePresence mode="wait" initial={false}>
          <StepBody
            key={step}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === "ask" && (
              <>
                <Badge>
                  <Lock size={12} />
                  {t.badge}
                </Badge>
                <Title id="gate-title">{t.title}</Title>
                <Text id="gate-text">{t.text}</Text>
                <Actions>
                  <Button type="button" $variant="light" onClick={confirm} whileTap={{ scale: 0.97 }}>
                    <Check size={17} />
                    {t.yes}
                  </Button>
                  <ButtonLink
                    href={YOUTUBE_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="youtube"
                    onClick={openYouTube}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Youtube size={17} />
                    {t.subscribe}
                  </ButtonLink>
                </Actions>
                <Perks>
                  <Perk>
                    <CalendarDays size={13} />
                    {stats.days} {t.perks.days}
                  </Perk>
                  <Perk>
                    <Sparkles size={13} />
                    {stats.activities} {t.perks.activities}
                  </Perk>
                  <Perk>
                    <CalendarPlus size={13} />
                    {t.perks.calendar}
                  </Perk>
                </Perks>
              </>
            )}

            {step === "waiting" && (
              <>
                <Radar aria-hidden>
                  <span />
                  <span />
                  <span />
                  <Youtube size={26} />
                </Radar>
                <Title id="gate-title">{t.waitingTitle}</Title>
                <Text id="gate-text">{t.waitingText}</Text>
                <Actions>
                  <Button type="button" $variant="light" onClick={confirm} whileTap={{ scale: 0.97 }}>
                    <Check size={17} />
                    {t.done}
                  </Button>
                  <ButtonLink
                    href={YOUTUBE_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="ghost"
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.reopen}
                    <ExternalLink size={14} />
                  </ButtonLink>
                </Actions>
              </>
            )}

            {step === "back" && (
              <>
                <Title id="gate-title">{t.backTitle}</Title>
                <Text id="gate-text">{t.backText}</Text>
                <Actions>
                  <Button type="button" $variant="youtube" onClick={confirm} whileTap={{ scale: 0.97 }}>
                    <Unlock size={17} />
                    {t.unlock}
                  </Button>
                  <ButtonLink
                    href={YOUTUBE_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="ghost"
                    onClick={openYouTube}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.notYet}
                    <ExternalLink size={14} />
                  </ButtonLink>
                </Actions>
              </>
            )}

            {step === "success" && (
              <>
                <Title id="gate-title">{t.successTitle}</Title>
                <Text id="gate-text">{t.successText}</Text>
                <Progress aria-hidden>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: UNLOCK_DELAY_MS / 1000, ease: "linear" }}
                  />
                </Progress>
              </>
            )}
          </StepBody>
        </AnimatePresence>
      </Card>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════
   PIECES
   ═══════════════════════════════════════════ */

function Steps({ labels, current }: { labels: string[]; current: number }) {
  return (
    <StepList aria-hidden>
      {labels.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <StepItem key={label}>
            {index > 0 && (
              <StepLine>
                <motion.span
                  initial={false}
                  animate={{ scaleX: index <= current ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </StepLine>
            )}
            <StepDot $done={done} $active={active}>
              {done ? <Check size={12} strokeWidth={3} /> : index + 1}
            </StepDot>
            <StepLabel $active={active || done}>{label}</StepLabel>
          </StepItem>
        );
      })}
    </StepList>
  );
}

function DrawnCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
      />
    </svg>
  );
}

async function celebrate(colors: string[]) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const burst = (x: number, angle: number) =>
    confetti({
      particleCount: 80,
      angle,
      spread: 70,
      startVelocity: 55,
      gravity: 1.1,
      ticks: 220,
      scalar: 0.95,
      origin: { x, y: 0.8 },
      colors,
      zIndex: 400,
    });
  burst(0.15, 60);
  burst(0.85, 120);
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const drift = keyframes`
  0%, 100% { transform: translate3d(-6%, -4%, 0) scale(1); }
  50% { transform: translate3d(6%, 4%, 0) scale(1.12); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shine = keyframes`
  0%, 60% { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(220%) skewX(-20deg); }
`;

const ping = keyframes`
  0% { transform: scale(0.6); opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 180;
  display: grid;
  place-items: center;
  padding: 5rem 1rem 2rem;
  overflow-y: auto;
  background: rgba(3, 3, 5, 0.62);
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
`;

const Aura = styled.div`
  position: fixed;
  inset: -20%;
  pointer-events: none;
  background:
    radial-gradient(40% 35% at 45% 45%, rgba(255, 0, 51, 0.22), transparent 70%),
    radial-gradient(35% 30% at 60% 60%, rgba(255, 165, 61, 0.12), transparent 70%);
  filter: blur(20px);
  animation: ${drift} 14s ease-in-out infinite;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(1rem, 4vw, 2rem);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  color: ${tokens.muted};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${tokens.border};
  transition: color 0.25s ease, background 0.25s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.09);
  }
`;

const Card = styled(motion.div)`
  position: relative;
  width: min(460px, 100%);
  padding: 2.4rem clamp(1.25rem, 5vw, 2.25rem) 1.9rem;
  border-radius: 32px;
  text-align: center;
  outline: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 50px 120px -30px rgba(0, 0, 0, 0.85);

  /* Specular edge — a 1px gradient border drawn through a mask. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(
      150deg,
      rgba(255, 255, 255, 0.38),
      rgba(255, 255, 255, 0.05) 35%,
      rgba(255, 255, 255, 0.03) 65%,
      rgba(255, 0, 51, 0.45)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const Avatar = styled.div<{ $success: boolean }>`
  --ring: ${(p) => (p.$success ? SUCCESS : tokens.youtube)};
  position: relative;
  width: 88px;
  height: 88px;
  margin: 0 auto;
`;

const AvatarRing = styled.span`
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--ring), transparent 45%, var(--ring) 70%, transparent 85%, var(--ring));
  -webkit-mask: radial-gradient(circle, transparent 58%, #000 60%);
  mask: radial-gradient(circle, transparent 58%, #000 60%);
  animation: ${spin} 3.5s linear infinite;
  transition: background 0.4s ease;
`;

const AvatarImage = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #0b0b0f;

  img {
    object-fit: cover;
    object-position: 50% 28%;
    transform: scale(1.5);
  }
`;

const AvatarBadge = styled(motion.span)<{ $success: boolean }>`
  position: absolute;
  right: -4px;
  bottom: -2px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${(p) => (p.$success ? "#03140e" : "#fff")};
  background: ${(p) => (p.$success ? SUCCESS : tokens.youtube)};
  border: 3px solid #121216;
  box-shadow: 0 6px 18px -4px ${(p) => (p.$success ? SUCCESS : tokens.youtube)};
`;

const Handle = styled.p`
  margin-top: 0.85rem;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.78rem;
  color: ${tokens.faint};
`;

const StepBody = styled(motion.div)`
  margin-top: 1.1rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 100px;
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ff6b85;
  background: rgba(255, 0, 51, 0.1);
  border: 1px solid rgba(255, 0, 51, 0.28);
`;

const Title = styled.h2`
  margin-top: 0.9rem;
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(1.75rem, 6vw, 2.15rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #fff;
`;

const Text = styled.p`
  margin: 0.75rem auto 0;
  max-width: 34ch;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${tokens.muted};
`;

const Actions = styled.div`
  display: grid;
  gap: 0.65rem;
  margin-top: 1.6rem;
`;

type Variant = "light" | "youtube" | "ghost";

const buttonStyles = css<{ $variant: Variant }>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 52px;
  padding: 0.75rem 1.1rem;
  border-radius: 16px;
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  ${(p) =>
    p.$variant === "light" &&
    css`
      color: #08080a;
      background: #fff;

      &:hover {
        background: #ececf0;
      }
    `}

  ${(p) =>
    p.$variant === "youtube" &&
    css`
      color: #fff;
      background: ${tokens.youtube};
      box-shadow: 0 14px 34px -12px rgba(255, 0, 51, 0.8);

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        width: 40%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
        animation: ${shine} 3.2s ease-in-out infinite;
      }

      &:hover {
        box-shadow: 0 18px 40px -10px rgba(255, 0, 51, 0.95);
      }
    `}

  ${(p) =>
    p.$variant === "ghost" &&
    css`
      color: ${tokens.muted};
      border: 1px solid ${tokens.border};

      &:hover {
        color: #fff;
        border-color: ${tokens.borderStrong};
      }
    `}

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

const Button = styled(motion.button)<{ $variant: Variant }>`
  ${buttonStyles}
`;

const ButtonLink = styled(motion.a)<{ $variant: Variant }>`
  ${buttonStyles}
`;

const Perks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 1.4rem;
`;

const Perk = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 100px;
  font-size: 0.74rem;
  color: ${tokens.muted};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${tokens.border};
`;

const Radar = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin: 2.2rem auto 1.6rem;
  display: grid;
  place-items: center;
  color: ${tokens.youtube};

  span {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid ${tokens.youtube};
    animation: ${ping} 2.4s cubic-bezier(0.2, 0.7, 0.3, 1) infinite;
  }

  span:nth-child(2) {
    animation-delay: 0.8s;
  }

  span:nth-child(3) {
    animation-delay: 1.6s;
  }

  svg {
    position: relative;
    filter: drop-shadow(0 0 14px rgba(255, 0, 51, 0.7));
  }
`;

const StepList = styled.ol`
  display: flex;
  justify-content: center;
  margin-top: 1.4rem;
  list-style: none;
`;

const StepItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  width: 96px;
`;

const StepLine = styled.span`
  position: absolute;
  top: 11px;
  right: calc(50% + 15px);
  width: calc(100% - 30px);
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;

  span {
    position: absolute;
    inset: 0;
    background: ${SUCCESS};
    transform-origin: left;
  }
`;

const StepDot = styled.span<{ $done: boolean; $active: boolean }>`
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${(p) => (p.$done ? "#03140e" : p.$active ? "#fff" : tokens.faint)};
  background: ${(p) => (p.$done ? SUCCESS : p.$active ? "rgba(255, 255, 255, 0.12)" : "transparent")};
  border: 1.5px solid ${(p) => (p.$done ? SUCCESS : p.$active ? "#fff" : "rgba(255, 255, 255, 0.15)")};
  transition: all 0.35s ease;
`;

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 0.68rem;
  color: ${(p) => (p.$active ? tokens.muted : tokens.faint)};
`;

const Progress = styled.div`
  height: 3px;
  margin: 1.6rem auto 0;
  width: 60%;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: ${SUCCESS};
    transform-origin: left;
  }
`;
