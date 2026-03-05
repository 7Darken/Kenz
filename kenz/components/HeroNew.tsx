'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const ROLES = ['Developer', 'Creator', 'Explorer', 'Builder']

export default function HeroNew() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % ROLES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const src = 'https://stream.mux.com/Aa02T7oM1wH5MkBZ00g3YAVPKXwz5yNBE5.m3u8'

    const loadHls = async () => {
      const { default: Hls } = await import('hls.js')
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      }
    }
    loadHls()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 })
      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        '-=0.8'
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="home" className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/30 sm:bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16">
        <p className="blur-in text-[10px] sm:text-xs text-muted uppercase tracking-[0.3em] mb-4 sm:mb-8">
          COLLECTION &apos;26
        </p>

        <h1 className="name-reveal text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-4 sm:mb-6">
          Kenz
        </h1>

        <p className="blur-in text-sm sm:text-base md:text-lg text-muted mb-3 sm:mb-4">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {ROLES[roleIndex]}
          </span>{' '}
          lives in Paris.
        </p>

        <p className="blur-in text-xs sm:text-sm md:text-base text-muted max-w-xs sm:max-w-md mb-8 sm:mb-12 leading-relaxed">
          Je transforme mes idées en réalité digitale. Apps mobiles, création de contenu et exploration du monde.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative rounded-full text-sm px-7 py-3 sm:py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all duration-300 hover:scale-105 font-medium"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            See Works
          </button>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative rounded-full text-sm px-7 py-3 sm:py-3.5 border-2 border-stroke bg-bg/50 text-text-primary hover:border-transparent transition-all duration-300 hover:scale-105 font-medium"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            Reach out...
          </button>
        </div>
      </div>

      {/* Scroll Indicator - hidden on very small screens */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 hidden sm:flex">
        <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
        <div className="relative w-px h-8 sm:h-10 bg-stroke overflow-hidden">
          <div className="absolute inset-x-0 h-3 accent-gradient animate-scroll-down" />
        </div>
      </div>
    </section>
  )
}
