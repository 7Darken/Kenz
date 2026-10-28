"use client";

import { useState } from "react";
import Image from "next/image";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";

import type { Itinerary } from "@/data/itineraries";
import { useTranslation } from "@/contexts/language-context";
import { YOUTUBE_SUBSCRIBE_URL } from "@/lib/socials";
import { Container, EASE, Eyebrow, SectionTitle, glass, tokens } from "./shared";

interface VideoSectionProps {
  itinerary: Itinerary;
  videoUrl: string;
}

export function VideoSection({ itinerary, videoUrl }: VideoSectionProps) {
  const s = useTranslation().itinerary.video;
  const [playing, setPlaying] = useState(false);
  const videoId = itinerary.youtubeVideoId;

  const poster = (
    <>
      <Image src={itinerary.thumbnail} alt="" fill sizes="(max-width: 900px) 100vw, 640px" />
      <PlayRing>
        <Play size={26} fill="currentColor" />
      </PlayRing>
    </>
  );

  return (
    <Section aria-labelledby="video-title">
      <Container>
        <Card
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Media>
            {/* Facade: the YouTube player only loads once the visitor asks for it. */}
            {videoId && playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={s.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoId ? (
              <PosterButton type="button" onClick={() => setPlaying(true)} aria-label={s.play}>
                {poster}
              </PosterButton>
            ) : (
              <PosterLink href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={s.watch}>
                {poster}
              </PosterLink>
            )}
          </Media>

          <Copy>
            <Eyebrow>
              <Youtube size={14} color={tokens.youtube} />
              {s.eyebrow}
            </Eyebrow>
            <SectionTitle id="video-title">{s.title}</SectionTitle>
            <p>{s.text}</p>
            <Actions>
              <LightLink href={videoUrl} target="_blank" rel="noopener noreferrer">
                <Play size={14} fill="currentColor" />
                {s.watch}
              </LightLink>
              <RedLink href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
                <Youtube size={16} />
                {s.subscribe}
              </RedLink>
            </Actions>
          </Copy>
        </Card>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Section = styled.section`
  padding: clamp(2rem, 6vw, 4rem) 0 clamp(5rem, 10vw, 8rem);
`;

const Card = styled(motion.div)`
  ${glass}
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: auto -10% -60% 30%;
    height: 120%;
    background: radial-gradient(closest-side, rgba(255, 0, 51, 0.16), transparent);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  background: #000;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const posterStyles = css`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  cursor: pointer;

  img {
    object-fit: cover;
    transition:
      transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
      filter 0.4s ease;
  }

  &:hover img {
    transform: scale(1.04);
    filter: brightness(0.8);
  }
`;

const PosterButton = styled.button`
  ${posterStyles}
`;

const PosterLink = styled.a`
  ${posterStyles}
`;

const PlayRing = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  color: #fff;
  background: ${tokens.youtube};
  box-shadow:
    0 0 0 10px rgba(255, 0, 51, 0.18),
    0 20px 40px -10px rgba(255, 0, 51, 0.8);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  svg {
    margin-left: 4px;
  }

  ${PosterButton}:hover &,
  ${PosterLink}:hover & {
    transform: scale(1.1);
  }
`;

const Copy = styled.div`
  position: relative;
  z-index: 1;
  padding: clamp(0.5rem, 2vw, 1.5rem);

  h2 {
    margin-top: 0.7rem;
  }

  p {
    margin-top: 0.9rem;
    max-width: 42ch;
    font-size: 0.95rem;
    line-height: 1.65;
    color: ${tokens.muted};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.6rem;
`;

const linkStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.3rem;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 650;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LightLink = styled.a`
  ${linkStyles}
  color: #08080a;
  background: #fff;
`;

const RedLink = styled.a`
  ${linkStyles}
  color: #fff;
  background: ${tokens.youtube};
  box-shadow: 0 12px 30px -12px rgba(255, 0, 51, 0.8);
`;
