"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ChevronUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import type { Destination } from "@/data/destinations";

export interface DestinationShowcaseProps {
  destinations: Destination[];
}

const NAV_BUTTON_SIZE = "3.5rem";
const CAROUSEL_EDGE_PADDING = "clamp(2.25rem, 5vw, 3.75rem)";
const CAROUSEL_SCROLL_OFFSET = `calc(${CAROUSEL_EDGE_PADDING} + ${NAV_BUTTON_SIZE} / 2)`;
const CAROUSEL_FADE_WIDTH = CAROUSEL_SCROLL_OFFSET;

const ShowcaseSection = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #04060d;
  color: #fff;
  box-shadow: 0 50px 120px rgba(5, 8, 20, 0.4);
  max-width: 70rem;
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
    background: radial-gradient(
      ellipse 80% 80% at 50% 50%,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.25) 85%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;

/* Exemple wrapper interne : */
export const ContentWrapper = styled.section`
  position: relative;

`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

const BackgroundPhoto = styled(Image)`
  object-fit: cover;
  filter: saturate(1.08) contrast(1.04);
`;

const BackgroundScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.82) 8%, rgba(0, 0, 0, 0.55) 46%, rgba(0, 0, 0, 0.78) 100%);
`;

const BackgroundHighlight = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.22), transparent 62%);
`;

const ContentArea = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  padding: 3rem 1.5rem;

  @media (min-width: 640px) {
    padding-inline: 2rem;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-end;
    gap: 3rem;
  }

  @media (min-width: 1280px) {
    padding-inline: 3rem;
  }
`;

const HeroContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 32rem;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    flex-basis: 38%;
    min-width: 240px;
  }
`;

const HeroEyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.48em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

const HeroTitle = styled.h2`
  font-size: clamp(2.75rem, 4.4vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.05;
  margin: 0;
  text-shadow: 0 20px 50px rgba(8, 12, 30, 0.65);
`;

const HeroDescription = styled.p`
  max-width: 28rem;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
`;

const HeroButton = styled(motion.button)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.62rem 1.35rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #101527;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(12, 16, 28, 0.45);
  transition: transform 0.3s ease, background-color 0.3s ease;

  svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    background: #fff;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 3px;
  }
`;

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 36rem;

  @media (min-width: 1024px) {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const PreviewCardRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 1.75rem;
  width: 100%;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const PreviewCard = styled(motion.article)`
  position: relative;
  margin: 0 auto;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(28px);

  @media (min-width: 1024px) {
    margin: 0;
  }
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 1.75rem;
`;

const PreviewImage = styled(Image)`
  object-fit: cover;
  filter: saturate(1.08);
`;

const PreviewImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 60%, transparent 100%);
`;

const PreviewLabelStack = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  right: 5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PreviewLabel = styled.span`
  font-size: 0.72rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
`;

const PreviewName = styled.h3`
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.4rem);
  font-weight: 600;
  color: #fff;
  text-shadow: 0 16px 40px rgba(8, 12, 25, 0.45);
`;

const PreviewBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.35rem 1.6rem 1.75rem;
`;

const PreviewDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
`;

const PreviewAction = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.3s ease;

  svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #fff;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 4px;
  }
`;

const DesktopControls = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  padding: 0.5rem 0;
  min-width: calc(${NAV_BUTTON_SIZE} + 0.5rem);
  align-self: stretch;
  pointer-events: none;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const NavButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${NAV_BUTTON_SIZE};
  height: ${NAV_BUTTON_SIZE};
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px);
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  pointer-events: auto;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.24);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 4px;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const DesktopPagination = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
`;

const CarouselSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  margin-top: 1.5rem;
  padding-bottom: 0.25rem;
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  padding-inline: 0;
`;

const TrackFadeLeft = styled.div`
  position: absolute;
  inset: 0;
  width: ${CAROUSEL_FADE_WIDTH};
  left: 0;
  pointer-events: none;
  background: linear-gradient(90deg, #04060d 0%, rgba(4, 6, 13, 0) 100%);
  z-index: 1;
`;

const TrackFadeRight = styled.div`
  position: absolute;
  inset: 0;
  width: ${CAROUSEL_FADE_WIDTH};
  right: 0;
  pointer-events: none;
  background: linear-gradient(270deg, #04060d 0%, rgba(4, 6, 13, 0) 100%);
  z-index: 1;
`;

const ThumbnailScroller = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-start;
  overflow-x: auto;
  padding: 0 ${CAROUSEL_EDGE_PADDING} 0;
  margin-bottom: -0.25rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-padding-inline: ${CAROUSEL_SCROLL_OFFSET};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ThumbnailImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
`;

const ThumbnailShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 10%, rgba(0, 0, 0, 0.3) 60%, transparent 100%);
`;

const ThumbnailLabel = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
`;

const ThumbnailIndex = styled.span`
  font-size: 0.65rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
`;

const ThumbnailName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ThumbnailButton = styled(motion.button)<{ $active: boolean }>`
  position: relative;
  min-width: 120px;
  overflow: hidden;
  border: none;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  color: inherit;
  cursor: pointer;
  scroll-snap-align: center;
  scroll-margin-inline: ${CAROUSEL_SCROLL_OFFSET};
  transition: transform 0.5s ease, box-shadow 0.35s ease;
  box-shadow: ${({ $active }) => ($active ? "0 20px 44px rgba(5, 8, 20, 0.55)" : "0 12px 30px rgba(5, 8, 20, 0.35)")};

  &:hover ${ThumbnailImage} {
    transform: scale(1.08);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: ${({ $active }) => ($active ? "2px solid rgba(255, 255, 255, 0.7)" : "2px solid transparent")};
    box-shadow: ${({ $active }) => ($active ? "0 0 0 4px rgba(255, 255, 255, 0.18)" : "none")};
    pointer-events: none;
    transition: border 0.3s ease, box-shadow 0.3s ease;
  }

  &:focus-visible::after {
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25);
  }
`;

const PaginationDot = styled.span<{ $active?: boolean; $mobile?: boolean }>`
  display: inline-block;
  height: 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  transition: background 0.3s ease, width 0.3s ease;
  width: ${({ $mobile }) => ($mobile ? "0.6rem" : "0.45rem")};

  ${({ $active, $mobile }) =>
    $active &&
    css`
      background: rgba(255, 255, 255, 0.82);
      width: ${$mobile ? "1.15rem" : "1.35rem"};
    `}
`;

const MobileNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 640px) {
    display: none;
  }
`;

const MobilePagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    display: none;
  }
`;

const heroVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

const previewVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -24,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

export function DestinationShowcase({ destinations }: DestinationShowcaseProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const total = destinations.length;
  const clampedIndex = useMemo(() => (total === 0 ? 0 : activeIndex % total), [activeIndex, total]);
  const activeDestination = destinations[clampedIndex];

  if (total === 0 || !activeDestination) {
    return null;
  }

  const goTo = (index: number) => {
    if (total === 0) return;
    const next = (index + total) % total;
    setActiveIndex(next);
  };

  const handlePrev = () => goTo(clampedIndex - 1);
  const handleNext = () => goTo(clampedIndex + 1);

  return (
    <ContentWrapper id="destination">
      <ShowcaseSection>
        <BackgroundLayer>
          <AnimatePresence mode="wait">
            <BackgroundImage
              key={activeDestination.slug}
              initial={{ opacity: 0.15, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.45, scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <BackgroundPhoto
                src={activeDestination.imageUrl}
                alt={activeDestination.name}
                fill
                priority
                sizes="100vw"
              />
              <BackgroundScrim aria-hidden />
              <BackgroundHighlight aria-hidden />
            </BackgroundImage>
          </AnimatePresence>
        </BackgroundLayer>

        <ContentArea>
          <AnimatePresence mode="wait">
            <HeroContent
              key={`hero-${activeDestination.slug}`}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <HeroEyebrow>Discover</HeroEyebrow>
              <HeroTitle>{activeDestination.name}</HeroTitle>
              <HeroDescription>{activeDestination.description}</HeroDescription>
              <HeroButton
                type="button"
                onClick={() => router.push(`/destination/${activeDestination.slug}`)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`Explore ${activeDestination.name}`}
              >
                Explore
                <ArrowUpRight aria-hidden="true" />
              </HeroButton>
            </HeroContent>
          </AnimatePresence>

          <PreviewColumn>
            <PreviewCardRow>
              <AnimatePresence mode="wait">
                <PreviewCard
                  key={`preview-${activeDestination.slug}`}
                  variants={previewVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <PreviewImageWrapper>
                    <PreviewImage
                      src={activeDestination.imageUrl}
                      alt={activeDestination.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 620px"
                      priority
                    />
                    <PreviewImageOverlay aria-hidden />
                    <PreviewLabelStack>
                      <PreviewLabel>Featured</PreviewLabel>
                      <PreviewName>{activeDestination.name}</PreviewName>
                    </PreviewLabelStack>
                  </PreviewImageWrapper>

                  <PreviewBody>
                    <PreviewDescription>{activeDestination.description}</PreviewDescription>
                    <PreviewAction
                      type="button"
                      onClick={() => router.push(`/destination/${activeDestination.slug}`)}
                      whileHover={{ x: 4 }}
                      aria-label={`Explore ${activeDestination.name}`}
                    >
                      Explore destination
                      <ArrowUpRight aria-hidden="true" />
                    </PreviewAction>
                  </PreviewBody>
                </PreviewCard>
              </AnimatePresence>

              <DesktopControls>
                <NavButton type="button" onClick={handlePrev} aria-label="Previous destination">
                  <ChevronUp aria-hidden="true" />
                </NavButton>
                <DesktopPagination>
                  {destinations.map((destination, index) => (
                    <PaginationDot key={`${destination.slug}-desktop-dot`} $active={index === clampedIndex} />
                  ))}
                </DesktopPagination>
                <NavButton type="button" onClick={handleNext} aria-label="Next destination">
                  <ChevronDown aria-hidden="true" />
                </NavButton>
              </DesktopControls>
            </PreviewCardRow>

            <CarouselSection>
              <CarouselTrack>
                <TrackFadeLeft aria-hidden />
                <TrackFadeRight aria-hidden />

                <ThumbnailScroller
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {destinations.map((destination, index) => {
                    const isActive = index === clampedIndex;
                    return (
                      <ThumbnailButton
                        key={destination.slug}
                        type="button"
                        variants={cardVariants}
                        onClick={() => goTo(index)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Select ${destination.name}`}
                        $active={isActive}
                      >
                        <ThumbnailImage
                          src={destination.imageUrl}
                          alt={destination.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 160px"
                        />
                        <ThumbnailShade aria-hidden />
                        <ThumbnailLabel>
                          <ThumbnailIndex>{index + 1 < 10 ? `0${index + 1}` : index + 1}</ThumbnailIndex>
                          <ThumbnailName title={destination.name}>{destination.name}</ThumbnailName>
                        </ThumbnailLabel>
                      </ThumbnailButton>
                    );
                  })}
                </ThumbnailScroller>
              </CarouselTrack>

              <MobileNav>
                <NavButton type="button" onClick={handlePrev} aria-label="Previous destination">
                  <ChevronUp aria-hidden="true" />
                </NavButton>
                <NavButton type="button" onClick={handleNext} aria-label="Next destination">
                  <ChevronDown aria-hidden="true" />
                </NavButton>
              </MobileNav>

              <MobilePagination>
                {destinations.map((destination, index) => (
                  <PaginationDot key={`${destination.slug}-mobile-dot`} $active={index === clampedIndex} $mobile />
                ))}
              </MobilePagination>
            </CarouselSection>
          </PreviewColumn>
        </ContentArea>
      </ShowcaseSection>
    </ContentWrapper>
  );
}
