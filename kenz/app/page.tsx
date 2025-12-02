'use client'


import Hero from '@/components/Hero'
import About from '@/components/About'
import MobileApps from '@/components/MobileApps'
import TravelShowcase from '@/components/TravelShowcase'
import Socials from '@/components/Socials'
import Footer from '@/components/Footer'
import ContentCreation from '@/components/ContentCreation'
import styled from 'styled-components'

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

export default function Home() {
  return (
    <Main>
      <Hero />
      <About />
      <MobileApps />
      <TravelShowcase />
      <Socials />
      <Footer />
    </Main>
  )
}
