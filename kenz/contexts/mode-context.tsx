'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Mode = 'pro' | 'perso'

interface ModeContextValue {
  mode: Mode
  toggleMode: () => void
  isPro: boolean
  isPerso: boolean
}

const ModeContext = createContext<ModeContextValue | null>(null)

const STORAGE_KEY = 'kenz-mode'

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('pro')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pro' || stored === 'perso') {
      setMode(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }, [mode, mounted])

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'pro' ? 'perso' : 'pro'))
  }, [])

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isPro: mode === 'pro', isPerso: mode === 'perso' }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
