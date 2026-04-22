'use client'

import Hero from '@/components/Hero'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { useMode } from '@/contexts/mode-context'
import { AnimatePresence, motion } from 'framer-motion'

const Impact = dynamic(() => import('@/components/Impact'))
const TechStack = dynamic(() => import('@/components/TechStack'))
const MobileApps = dynamic(() => import('@/components/MobileApps'))
const TravelShowcase = dynamic(() => import('@/components/TravelShowcase'))
const Socials = dynamic(() => import('@/components/Socials'))
const Footer = dynamic(() => import('@/components/Footer'))
const ContentCreation = dynamic(() => import('@/components/ContentCreation'))
const Contact = dynamic(() => import('@/components/Contact'))
const SportTimeline = dynamic(() => import('@/components/SportTimeline'))

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

const PersoSection = styled(motion.div)``

export default function Home() {
  const { isPro, isPerso } = useMode()

  return (
    <Main>
      <Hero />
      {isPro && (
        <>
          <Impact />
          <MobileApps />
          <TechStack />
        </>
      )}
      <AnimatePresence mode="wait">
        {isPerso && (
          <PersoSection
            key="perso-sections"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ContentCreation />
            <TravelShowcase />
            <SportTimeline />
            <Socials />
          </PersoSection>
        )}
      </AnimatePresence>
      {isPro && <Contact />}
      <Footer />
    </Main>
  )
}
