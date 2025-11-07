"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import type { DestinationDetail } from "@/data/destination-details";

export interface DestinationDetailViewProps {
  detail: DestinationDetail;
}

export function DestinationDetailView({ detail }: DestinationDetailViewProps) {
  return (
    <PageWrapper>
      <HeroSection>
        <BackLink href="/#destination">← Retour</BackLink>
        <HeroBackground>
          <HeroImage src={detail.heroImage} alt={detail.title} fill priority sizes="100vw" />
          <HeroGradient aria-hidden />
          <HeroRadial aria-hidden />
        </HeroBackground>

        <HeroContent>
          {detail.badge ? <HeroBadge>{detail.badge}</HeroBadge> : null}
          <HeroTitle>{detail.title}</HeroTitle>
          <HeroDescription>{detail.description}</HeroDescription>
        </HeroContent>

        <HighlightsBar>
          {detail.highlights.map((highlight) => (
            <HighlightCard key={highlight.name}>
              <HighlightFrame>
                <HighlightRing aria-hidden />
                <HighlightImageWrapper>
                  <Image src={highlight.imageUrl} alt={highlight.name} fill sizes="150px" />
                </HighlightImageWrapper>
              </HighlightFrame>

              <HighlightTagline>{highlight.tagline}</HighlightTagline>
              <HighlightName>{highlight.name}</HighlightName>
            </HighlightCard>
          ))}
        </HighlightsBar>
      </HeroSection>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  min-height: 100vh;
  color: #f7f8fb;
  padding: clamp(0.5rem, 1.2vw, 1.25rem) clamp(1.5rem, 6vw, 4rem) clamp(2.25rem, 6vw, 3.75rem);
  margin-top: clamp(-3rem, -6vw, -1.75rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.25rem);
`;

const BackLink = styled(Link)`
  position: absolute;
  top: clamp(1rem, 2.2vw, 1.85rem);
  left: clamp(1rem, 3vw, 2.25rem);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  font-size: 0.75rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  background: rgba(4, 6, 13, 0.65);
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(2, 4, 11, 0.45);
  backdrop-filter: blur(12px);
  z-index: 3;
  transition: color 0.3s ease, transform 0.3s ease, background 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(4, 6, 13, 0.78);
    transform: translateY(-1px);
  }
`;

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: clamp(0.75rem, 1vw, 2.5rem);
  background: #04060d;
  min-height: min(80vh, 720px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(2rem, 6vw, 3.5rem) clamp(2rem, 7vw, 4.5rem) clamp(3rem, 8vw, 4.5rem);
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
`;

const HeroImage = styled(Image)`
  object-fit: cover;
  filter: saturate(1.3) contrast(1.05);
  opacity: 0.9;
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(3, 5, 12, 0.3) 0%, rgba(3, 5, 12, 0.65) 55%, rgba(3, 5, 12, 0.9) 100%);
`;

const HeroRadial = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top center, rgba(255, 25, 80, 0.42), transparent 55%);
  mix-blend-mode: screen;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.8rem);
  max-width: 540px;
  align-self: center;
  align-items: center;
  text-align: center;
`;

const HeroBadge = styled.span`
  align-self: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  font-size: 0.85rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #fff;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(4rem, 9vw, 8.5rem);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  font-weight: 700;
  line-height: 0.95;
  text-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
`;



const HeroDescription = styled.p`
  margin: 0;
  max-width: 480px;
  font-size: clamp(0.9rem, 0.5vw, 1.05rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
`;

const HighlightsBar = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: clamp(1.2rem, 3vw, 2rem);
  margin-top: clamp(2.5rem, 6vw, 3.75rem);
  padding-top: clamp(1.8rem, 3vw, 2.2rem);

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HighlightCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  text-align: center;
`;

const HighlightFrame = styled.div`
  position: relative;
  width: clamp(120px, 5vw, 102px);
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
`;

const HighlightRing = styled.span`
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  background: conic-gradient(from 90deg, rgba(255, 255, 255, 0.4), rgba(255, 80, 110, 0.9), rgba(255, 255, 255, 0.4));
  filter: drop-shadow(0 12px 24px rgba(255, 25, 80, 0.35));
`;

const HighlightImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid rgba(2, 4, 11, 0.85);
`;

const HighlightTagline = styled.p`
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
`;

const HighlightName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
`;
