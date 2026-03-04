'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const SOCIALS = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@7kinze' },
  { label: 'YouTube', href: 'https://www.youtube.com/@7Kinze' },
  { label: 'Instagram', href: 'https://www.instagram.com/kenz.dev' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kenz-narainen/' },
  { label: 'GitHub', href: 'https://github.com/7Darken' },
]

const MARQUEE_TEXT = 'BUILDING THE FUTURE \u2022 '

export default function ContactFooter() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // HLS video (flipped)
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

  // GSAP Marquee
  useEffect(() => {
    if (!marqueeRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Background Video (flipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: 'scaleY(-1)' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10">
        {/* Marquee */}
        <div className="overflow-hidden mb-16">
          <div ref={marqueeRef} className="whitespace-nowrap">
            <span className="text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/10">
              {MARQUEE_TEXT.repeat(10)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center px-6 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-muted max-w-md mx-auto mb-8"
          >
            Tu as un projet en tête ? Je suis toujours ouvert aux nouvelles idées et collaborations.
          </motion.p>
          <motion.a
            href="mailto:contact@kenzenbien.fr"
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-bg border-2 border-stroke rounded-full text-text-primary transition-all duration-300 hover:border-transparent"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            contact@kenzenbien.fr
            <span className="text-sm">↗</span>
          </motion.a>
        </div>

        {/* Footer Bar */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-stroke pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social links */}
            <div className="flex items-center gap-6">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-text-primary hover:-translate-y-0.5 transition-all duration-200"
                >
                  {social.label}
                </a>
              ))}
            </div>

            {/* Available indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm text-muted">Available for projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
