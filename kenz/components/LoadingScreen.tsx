'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

const WORDS = ['Design', 'Create', 'Inspire']
const DURATION = 2700

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const frameRef = useRef<number>(0)

  const animate = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) startTimeRef.current = timestamp
    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(Math.floor((elapsed / DURATION) * 100), 100)
    setCount(progress)

    if (progress < 100) {
      frameRef.current = requestAnimationFrame(animate)
    } else {
      setTimeout(() => onComplete(), 400)
    }
  }, [onComplete])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [animate])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % WORDS.length)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between overflow-hidden">
      {/* Top-left label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-8"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em]">Portfolio</span>
      </motion.div>

      {/* Center rotating words */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-8">
        {/* Counter - bottom right */}
        <div className="flex justify-end mb-6">
          <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
            {String(count).padStart(3, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-stroke/50 w-full">
          <div
            className="h-full accent-gradient transition-transform duration-75 origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
