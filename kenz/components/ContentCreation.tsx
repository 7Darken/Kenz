'use client'

import styled from 'styled-components'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Play, Heart, MessageCircle, Share2, Music2 } from 'lucide-react'

const Section = styled.section`
  padding: 5rem 2rem;
  position: relative;
  overflow: hidden;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`

const Title = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(3rem, 6vw, 5rem);
  margin-bottom: 1rem;
  line-height: 1;
`

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 6rem;
  }
`

const PlatformCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

// TikTok Specific Styles
const PhoneFrame = styled(motion.div)`
  width: 300px;
  height: 600px;
  background: #000;
  border-radius: 40px;
  border: 8px solid #222;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 50px 100px -20px rgba(0,0,0,0.5),
    0 0 0 2px rgba(255,255,255,0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 25px;
    background: #222;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    z-index: 10;
  }
`

const TikTokScreen = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #111, #222);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
  }
`

const TikTokOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  z-index: 2;
`

const TikTokSideBar = styled.div`
  position: absolute;
  right: 10px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  z-index: 3;
`

const ActionIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  
  div {
    width: 45px;
    height: 45px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.1);
      background: rgba(255,255,255,0.2);
    }
  }
`

const MusicDisc = styled(motion.div)`
  width: 45px;
  height: 45px;
  background: #222;
  border-radius: 50%;
  border: 8px solid #111;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

// YouTube Specific Styles
const VideoCard = styled(motion.div)`
  width: 100%;
  aspect-ratio: 16/9;
  background: #111;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 30px 60px -15px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,255,255,0.1);
    
  &:hover img {
    transform: scale(1.05);
  }
`

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0.8;
`

const PlayButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.2);
  z-index: 2;
  
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.8);
    transform: translate(-50%, -50%) scale(1.1);
    border-color: transparent;
  }
`

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, black, transparent);
  z-index: 2;
`

const PlatformLabel = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
  
  span {
    color: ${props => props.$color};
  }
`

export default function ContentCreation() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <Section ref={containerRef}>
      <Container>
        <Header>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Content Creation
          </Title>
          <Subtitle>
            Sharing my journey and knowledge through video.
          </Subtitle>
        </Header>

        <ContentGrid>
          {/* TikTok Column */}
          <PlatformCard style={{ y: y1 }}>
            <PlatformLabel $color="#ff0050">
              <span>●</span> TikTok
            </PlatformLabel>

            <PhoneFrame
              initial={{ rotate: -5 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <TikTokScreen>
                {/* Placeholder for TikTok content */}
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '4rem' }}>
                  <Music2 size={64} />
                </div>

                <TikTokOverlay>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>@kenz.dev</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Building the future of mobile apps 🚀 #coding #dev #tech
                  </div>
                </TikTokOverlay>

                <TikTokSideBar>
                  <ActionIcon>
                    <div><Heart fill="white" size={24} /></div>
                    <span>12.5K</span>
                  </ActionIcon>
                  <ActionIcon>
                    <div><MessageCircle size={24} /></div>
                    <span>482</span>
                  </ActionIcon>
                  <ActionIcon>
                    <div><Share2 size={24} /></div>
                    <span>Share</span>
                  </ActionIcon>
                  <MusicDisc
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  >
                    <Music2 size={20} />
                  </MusicDisc>
                </TikTokSideBar>
              </TikTokScreen>
            </PhoneFrame>
          </PlatformCard>

          {/* YouTube Column */}
          <PlatformCard style={{ y: y2 }}>
            <PlatformLabel $color="#FF0000">
              <span>●</span> YouTube
            </PlatformLabel>

            <VideoCard>
              <Thumbnail src="/images/destinations/Japon.png" alt="YouTube Video" />
              <PlayButton whileTap={{ scale: 0.9 }}>
                <Play fill="white" size={32} />
              </PlayButton>
              <VideoInfo>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Building a Travel App from Scratch
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Full process: Design, Code & Launch
                </p>
              </VideoInfo>
            </VideoCard>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                Join 50K+ subscribers learning mobile development
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2rem',
                  background: '#FF0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                Subscribe Now
              </motion.button>
            </div>
          </PlatformCard>
        </ContentGrid>
      </Container>
    </Section>
  )
}
