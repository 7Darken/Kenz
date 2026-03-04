'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { id: 1, title: 'Tokyo & Kyoto', category: 'Voyage au Japon', image: '/images/destinations/Japon.png' },
  { id: 2, title: 'South Coast', category: 'Aventure Islande', image: '/images/destinations/Islande.png' },
  { id: 3, title: 'Shanghai & Beijing', category: 'Découverte Chine', image: '/images/destinations/Chine.png' },
  { id: 4, title: 'Seoul Explorer', category: 'Corée du Sud', image: '/images/destinations/Coree.png' },
  { id: 5, title: 'Kuala Lumpur', category: 'Malaisie Tropicale', image: '/images/destinations/Malaisie.png' },
  { id: 6, title: 'App Oshii', category: 'Développement Mobile', image: '/images/projects/Oshii_dark.png' },
]

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin center content
      if (contentRef.current) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
        })
      }

      // Left column parallax
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { y: '10vh' },
          {
            y: '-120vh',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      }

      // Right column parallax
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { y: '40vh' },
          {
            y: '-100vh',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const leftItems = ITEMS.filter((_, i) => i % 2 === 0)
  const rightItems = ITEMS.filter((_, i) => i % 2 !== 0)

  return (
    <section ref={sectionRef} className="relative min-h-[300vh]">
      {/* Layer 1: Pinned Center Content */}
      <div ref={contentRef} className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
            <div className="w-8 h-px bg-stroke" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-4">
            Visual{' '}
            <span className="font-display italic">playground</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
            Un espace pour mes voyages, mes expériences créatives et mes explorations visuelles.
          </p>
          <a
            href="https://www.tiktok.com/@7kinze"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-full text-sm"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative bg-surface border border-stroke rounded-full px-5 py-2.5 inline-flex items-center gap-2 group-hover:border-transparent transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.28 0 .56.04.81.13v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 10.86 4.48c1.4-1.4 2.19-3.3 2.19-5.28V8.87a8.28 8.28 0 0 0 4.84 1.56V7.02a4.83 4.83 0 0 1-1.45-.33z" />
              </svg>
              View on TikTok
              <span className="text-xs">↗</span>
            </span>
          </a>
        </div>
      </div>

      {/* Layer 2: Parallax Columns */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 h-full">
          <div className="grid grid-cols-2 gap-12 md:gap-40">
            {/* Left Column */}
            <div ref={leftColRef} className="flex flex-col items-end">
              <div className="h-[20vh]" />
              {leftItems.map((item) => (
                <div
                  key={item.id}
                  className="pointer-events-auto mb-16 cursor-pointer"
                  onClick={() => setLightbox(item.id)}
                  style={{ transform: `rotate(${(item.id % 2 === 0 ? 1 : -1) * (1.5 + (item.id % 3))}deg)` }}
                >
                  <div className="relative aspect-square max-w-[320px] w-full">
                    {/* Border frame */}
                    <div className="absolute -inset-4 rounded-[40px] border border-stroke/30" />
                    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-surface border border-stroke group">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      {/* Blue tint */}
                      <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                      {/* Halftone */}
                      <div
                        className="absolute inset-0 opacity-20 mix-blend-multiply"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                          backgroundSize: '4px 4px',
                        }}
                      />
                      {/* Hover */}
                      <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm">
                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                        <p className="text-xs text-muted mt-1">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div ref={rightColRef} className="flex flex-col items-start">
              <div className="h-[40vh]" />
              {rightItems.map((item) => (
                <div
                  key={item.id}
                  className="pointer-events-auto mb-16 cursor-pointer"
                  onClick={() => setLightbox(item.id)}
                  style={{ transform: `rotate(${(item.id % 2 === 0 ? 1 : -1) * (1.5 + (item.id % 3))}deg)` }}
                >
                  <div className="relative aspect-square max-w-[320px] w-full">
                    <div className="absolute -inset-4 rounded-[40px] border border-stroke/30" />
                    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-surface border border-stroke group">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                      <div
                        className="absolute inset-0 opacity-20 mix-blend-multiply"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                          backgroundSize: '4px 4px',
                        }}
                      />
                      <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm">
                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                        <p className="text-xs text-muted mt-1">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={ITEMS.find((item) => item.id === lightbox)?.image || ''}
                alt=""
                fill
                className="object-cover rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
