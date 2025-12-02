'use client'

import styled from 'styled-components'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '@/data/projects'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Smartphone } from 'lucide-react'
import { useRef } from 'react'

const Section = styled.section`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    padding: 4rem 1.5rem;
  }
`

const Container = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Header = styled.div`
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Label = styled(motion.span)`
  font-family: ${props => props.theme.fonts.main};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`

const ProjectCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  cursor: pointer;
  padding: 2rem;
`

const ImageWrapper = styled(motion.div)`
  width: 240px;
  height: 240px;
  position: relative;
  z-index: 2;
  border-radius: 55px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const TextContent = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
`

const ProjectNumber = styled.span`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
`

const ProjectTitle = styled.h3`
  font-family: ${props => props.theme.fonts.main};
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
`

const ProjectDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  max-width: 300px;
  margin-bottom: 1rem;
`

const AppStoreButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.3);
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
`

function ProjectItem({ project, index }: { project: typeof projects[0], index: number }) {
    const router = useRouter()
    const appStoreLink = project.socials?.find(s => s.title === 'App Store')?.href || '#'

    return (
        <ProjectCard
            onClick={() => router.push(`/apps/${project.slug}`)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                delay: index * 0.15,
                duration: 1,
                ease: [0.2, 0.8, 0.2, 1] // Very smooth "premium" ease
            }}
            whileHover="hover"
        >
            <ProjectNumber>0{index + 1}</ProjectNumber>

            <ImageWrapper
                variants={{
                    hover: {
                        y: -20,
                        scale: 1.08,
                        boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
                    }
                }}
                transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1] // Smooth ease-in-out
                }}
            >
                <img src={project.thumbnail} alt={project.name} />
            </ImageWrapper>

            <TextContent>
                <ProjectTitle>{project.name}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>

                <div onClick={(e) => e.stopPropagation()}>
                    <AppStoreButton href={appStoreLink} target="_blank" rel="noopener noreferrer">
                        <img src="/images/icons/Apple_logo_white.png" alt="Apple" />
                        <span>Télécharger</span>
                    </AppStoreButton>
                </div>
            </TextContent>
        </ProjectCard>
    )
}

export default function MobileApps() {
    return (
        <Section id="apps">
            <Container>
                <Header>
                    <Title>Applications Mobiles</Title>
                    <Subtitle>
                        Des expériences digitaless conçues avec passion.
                    </Subtitle>
                </Header>

                <ProjectList>
                    {projects.map((project, index) => (
                        <ProjectItem key={project.id} project={project} index={index} />
                    ))}
                </ProjectList>
            </Container>
        </Section>
    )
}
