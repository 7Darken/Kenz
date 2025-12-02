'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { destinations } from '@/data/destinations'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Thermometer } from 'lucide-react'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
`

const HeroSection = styled.section`
  height: 70vh;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding-bottom: 4rem;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, #000 100%);
  }
`

const Content = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.2);
  }
`

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.9;
  margin-bottom: 1rem;
`

const Country = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  padding: 2rem;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
`

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.8);
  max-width: 800px;
  margin-top: 2rem;
`

export default function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const destination = destinations.find(d => d.slug === slug)

  if (!destination) {
    notFound()
  }

  return (
    <PageContainer>
      <BackButton href="/">
        <ArrowLeft size={20} /> Back
      </BackButton>

      <HeroSection>
        <BackgroundImage>
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </BackgroundImage>

        <Content>
          <Country>
            <MapPin size={24} />
            {destination.country}
          </Country>

          <Title
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {destination.name}
          </Title>

          <Description>
            {destination.description}
          </Description>
        </Content>
      </HeroSection>

      <Content style={{ paddingBottom: '4rem' }}>
        <StatsGrid>
          {destination.stats.map((stat, i) => (
            <StatItem key={i}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatItem>
          ))}
        </StatsGrid>
      </Content>
    </PageContainer>
  )
}
