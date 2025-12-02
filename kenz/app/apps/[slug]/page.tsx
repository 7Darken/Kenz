'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Download, Star, Share } from 'lucide-react'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-bottom: 4rem;
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(3, 3, 5, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const HeroSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const AppIcon = styled(motion.div) <{ $color: string }>`
  width: 180px;
  height: 180px;
  border-radius: 40px;
  background: ${props => props.$color};
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  color: white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const AppInfo = styled.div`
  flex: 1;
  padding-top: 1rem;
`

const AppTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.1;
`

const AppSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const AppStoreButton = styled.a`
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: #1a1a1a;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }

  span:first-child {
    font-size: 0.65rem;
    font-weight: 500;
  }

  span:last-child {
    font-size: 1.1rem;
    font-weight: 600;
  }
`

const ShareButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2rem auto;
  max-width: 1000px;
  
  /* Scrollable on mobile */
  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 3rem;
    overflow-x: auto;
    padding: 2rem;
    mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  }
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
`

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
`

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.2rem;

  &.highlight {
    color: ${props => props.theme.colors.text};
  }
`

const ContentSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`

const Description = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.text};
  margin-bottom: 3rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`

const PreviewGallery = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 2rem 0;
  margin: 2rem -2rem;
  padding-left: 2rem;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
`

const Screenshot = styled.div`
  width: 300px;
  height: 600px;
  background: #1a1a1a;
  border-radius: 20px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border: 4px solid #333;

  img {
    object-fit: cover;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  display: grid;
  gap: 1rem;
`

const FeatureItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`

export default function AppDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use() or await if in async component
  // Since this is a server component (default in app dir), we can await params
  const { slug } = React.use(params)

  const project = projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <PageContainer>
      <Header>
        <BackButton href="/#apps">
          <ArrowLeft size={20} />
          Back
        </BackButton>
      </Header>

      <HeroSection>
        <AppIcon
          $color={project.glowColor || '#333'}
          layoutId={`icon-${project.slug}`}
        >
          <img src={project.thumbnail} alt={project.name} />
        </AppIcon>

        <AppInfo>
          <AppTitle layoutId={`title-${project.slug}`}>
            {project.name}
          </AppTitle>
          <AppSubtitle>{project.detail?.subheadline || project.description}</AppSubtitle>

          <ActionButtons>
            {project.socials?.find(s => s.title === "App Store") && (
              <AppStoreButton
                href={project.socials.find(s => s.title === "App Store")?.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                </svg>
                <div>
                  <span>Télécharger sur</span>
                  <span>App Store</span>
                </div>
              </AppStoreButton>
            )}
            <ShareButton>
              <Share size={20} />
            </ShareButton>
          </ActionButtons>
        </AppInfo>
      </HeroSection>

      {project.detail?.stats && (
        <StatsRow>
          {project.detail.stats.map((stat, i) => (
            <StatItem key={i}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue className="highlight" style={{ color: stat.accentColor }}>
                {stat.value}
              </StatValue>
              {stat.description && <StatLabel style={{ fontSize: '0.7rem', opacity: 0.7 }}>{stat.description}</StatLabel>}
            </StatItem>
          ))}
          <StatItem>
            <StatLabel>Rating</StatLabel>
            <StatValue className="highlight">
              4.9 <Star size={16} fill="currentColor" />
            </StatValue>
          </StatItem>
        </StatsRow>
      )}

      <ContentSection>
        <SectionTitle>Preview</SectionTitle>
        <PreviewGallery>
          {/* Placeholder screenshots - in real app, use project.screenshots */}
          <Screenshot>
            <Image src={project.thumbnail} alt="Screenshot 1" fill />
          </Screenshot>
          <Screenshot style={{ background: '#222' }} />
          <Screenshot style={{ background: '#2a2a2a' }} />
        </PreviewGallery>

        <SectionTitle>About This App</SectionTitle>
        <Description>
          <p>{project.detail?.headline}</p>
          <p>{project.detail?.subheadline}</p>
        </Description>

        <SectionTitle>Key Features</SectionTitle>
        <FeatureList>
          {project.detail?.overview.map((feature, i) => (
            <FeatureItem key={i}>
              <p>{feature}</p>
            </FeatureItem>
          ))}
        </FeatureList>
      </ContentSection>
    </PageContainer>
  )
}
