'use client'

import { useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import NavbarNew from '@/components/NavbarNew'
import HeroNew from '@/components/HeroNew'
import SelectedWorks from '@/components/SelectedWorks'
import Journal from '@/components/Journal'
import Explorations from '@/components/Explorations'
import Stats from '@/components/Stats'
import ContactFooter from '@/components/ContactFooter'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <main className="overflow-x-hidden w-full">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <NavbarNew />
      <HeroNew />
      <SelectedWorks />
      <Journal />
      <Explorations />
      <Stats />
      <ContactFooter />
    </main>
  )
}
