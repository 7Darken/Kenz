'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { destinations } from '@/data/destinations'
import { useLanguage } from '@/contexts/language-context'
import { localize } from '@/i18n/localize'

const ShowcaseContainer = styled.section`
  height: 85vh;
  width: 90%;
  max-width: 1800px;
  margin: 4rem auto;
  position: relative;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: flex-end;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
`

const BackgroundSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`

const SlideImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  img {
    object-fit: cover;
    object-position: center;
  }
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
  z-index: 1;
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: end;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const MainInfo = styled.div`
  color: white;
`

const DestinationTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.9;
  margin-bottom: 1rem;
  text-transform: uppercase;
`

const DestinationMeta = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: white;
  color: black;
  border-radius: 100px;
  font-weight: 700;
  text-transform: uppercase;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`

const ThumbnailList = styled.div`
  display: flex;
  overflow: hidden;
  padding-bottom: 1rem;
  width: 100%;
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
`

const MarqueeTrack = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  padding-left: 1.5rem; /* Initial offset */
`

const Thumbnail = styled(motion.button) <{ $active: boolean }>`
  position: relative;
  width: 120px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid ${props => props.$active ? 'white' : 'rgba(255,255,255,0.3)'};
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: white;
  }

  img {
    object-fit: cover;
    transition: transform 0.5s ease;
    transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};
  }
`

const ThumbLabel = styled.span`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
  z-index: 2;
`

export default function TravelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { lang, t } = useLanguage()
  const activeDest = destinations[activeIndex]

  return (
    <ShowcaseContainer id="travel">
      <BackgroundSlider>
        <AnimatePresence mode="popLayout">
          <SlideImage
            key={activeDest.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={activeDest.imageUrl}
              alt={activeDest.name}
              fill
              priority
              sizes="100vw"
            />
          </SlideImage>
        </AnimatePresence>
      </BackgroundSlider>

      <Overlay />

      <ContentWrapper>
        <MainInfo>
          <motion.div
            key={activeDest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DestinationTitle>{activeDest.name}</DestinationTitle>
            <DestinationMeta>
              <span>{localize(activeDest.country, lang)}</span>
              <span>•</span>
              <span>{localize(activeDest.stats[0].value, lang)}</span> {/* Duration */}
            </DestinationMeta>

            <ViewButton href={`/destination/${activeDest.slug}`}>
              {t.travelShowcase.explore} <ArrowRight size={20} />
            </ViewButton>
          </motion.div>
        </MainInfo>

        <ThumbnailList>
          <MarqueeTrack
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...destinations, ...destinations].map((dest, index) => (
              <Thumbnail
                key={`${dest.id}-${index}`}
                onClick={() => setActiveIndex(index % destinations.length)}
                $active={index % destinations.length === activeIndex}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <Image src={dest.imageUrl} alt={dest.name} fill sizes="120px" />
                <ThumbLabel>{localize(dest.country, lang)}</ThumbLabel>
              </Thumbnail>
            ))}
          </MarqueeTrack>
        </ThumbnailList>
      </ContentWrapper>
    </ShowcaseContainer>
  )
}
