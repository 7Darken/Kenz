'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const Section = styled.section`
  padding: 6rem 2rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`

const Header = styled.div`
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Title = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1;
  margin-bottom: 1rem;
  color: #fff;
  font-style: italic;
`

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  line-height: 1.5;
  font-weight: 300;
`

/* ── Spread Cards Layout (like reference) ── */

const CardsRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2.5rem;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`

const CardOuter = styled(motion.div)<{ $position: 'left' | 'center' | 'right' }>`
  position: relative;
  margin-top: ${p => p.$position === 'center' ? '0' : '50px'};
  rotate: ${p =>
    p.$position === 'left' ? '-3deg' :
    p.$position === 'right' ? '3deg' : '0deg'
  };
  transition: rotate 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    rotate: 0deg;
    transform: translateY(-8px);
  }

  @media (max-width: 968px) {
    margin-top: 0;
    rotate: 0deg;
  }
`

const Card = styled.div<{ $glowColor?: string }>`
  width: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background 0.4s ease,
              border-color 0.4s ease,
              box-shadow 0.4s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow: 0 30px 60px -15px ${props => (props.$glowColor || 'rgba(0,0,0,0)') + '30'};
  }

  @media (max-width: 968px) {
    width: 100%;
    max-width: 360px;
  }
`

const CardNumber = styled.span`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: 3.5rem;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.06);
  line-height: 1;
  align-self: flex-start;
`

const ImageWrapper = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 44px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    border-radius: 36px;
  }
`

const TextContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`

const ProjectTitle = styled.h3`
  font-family: ${props => props.theme.fonts.main};
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
`

const ProjectDescription = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
  max-width: 260px;
  margin-top: 0.2rem;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
`

const PillButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
  img { width: 16px; height: 16px; object-fit: contain; }
  svg { width: 14px; height: 14px; }
`

const DownloadButton = styled(PillButton)`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.2); }
`

const DetailButton = styled(PillButton)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  &:hover { background: rgba(255, 255, 255, 0.18); border-color: rgba(255, 255, 255, 0.25); }
`

const positions: ('left' | 'center' | 'right')[] = ['left', 'center', 'right']
// Display order: Zenko (index 1) left, Oshii (index 0) center, Sago (index 2) right
const displayOrder = [1, 0, 2]

export default function MobileApps() {
  const router = useRouter()
  const orderedProjects = displayOrder.map(i => projects[i]).filter(Boolean)

  return (
    <Section id="apps">
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Applications Mobiles
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          Des expériences digitales conçues avec passion.
        </Subtitle>
      </Header>

      <CardsRow>
        {orderedProjects.map((project, index) => {
          const appStoreLink = project.socials?.find(s => s.title === 'App Store')?.href || '#'

          return (
            <CardOuter
              key={project.id}
              $position={positions[index] || 'center'}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card
                $glowColor={project.glowColor}
                onClick={() => router.push(`/apps/${project.slug}`)}
              >
                <CardNumber>0{index + 1}</CardNumber>

                <ImageWrapper>
                  <img src={project.thumbnail} alt={project.name} />
                </ImageWrapper>

                <TextContent>
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>

                  <ButtonRow onClick={(e) => e.stopPropagation()}>
                    <DownloadButton href={appStoreLink} target="_blank" rel="noopener noreferrer">
                      <img src="/images/icons/Apple_logo_white.png" alt="Apple" />
                      Télécharger
                    </DownloadButton>
                    <DetailButton
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`/apps/${project.slug}`)
                      }}
                      href={`/apps/${project.slug}`}
                    >
                      Détails
                      <ArrowRight />
                    </DetailButton>
                  </ButtonRow>
                </TextContent>
              </Card>
            </CardOuter>
          )
        })}
      </CardsRow>
    </Section>
  )
}
