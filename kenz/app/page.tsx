'use client'

import Hero from '@/components/Hero'
import Impact from '@/components/Impact'
import TechStack from '@/components/TechStack'
import MobileApps from '@/components/MobileApps'
import TravelShowcase from '@/components/TravelShowcase'
import Socials from '@/components/Socials'
import Footer from '@/components/Footer'
import ContentCreation from '@/components/ContentCreation'
import Contact from '@/components/Contact'
import SportTimeline from '@/components/SportTimeline'
import styled from 'styled-components'
import { useMode } from '@/contexts/mode-context'
import { AnimatePresence, motion } from 'framer-motion'

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
