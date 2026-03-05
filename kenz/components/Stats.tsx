'use client'

import { motion } from 'framer-motion'

const STATS = [
  { number: '12k+', label: 'Téléchargements', sublabel: "De nos apps en quelques mois." },
  { number: '4.9', label: 'Note Moyenne', sublabel: "Sur l'App Store avec 1,200+ avis." },
  { number: '10k+', label: 'Communauté', sublabel: 'Followers sur TikTok et réseaux.' },
]

export default function Stats() {
  return (
    <section id="stats" className="bg-bg py-12 sm:py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-8 h-px bg-stroke" />
            <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.3em]">Stats & Facts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-2 sm:mb-3">
            Making an{' '}
            <span className="font-display italic">impact</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted max-w-lg">
            Des chiffres qui reflètent mon engagement dans le développement mobile, la création de contenu et l&apos;exploration du monde.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className={`${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter text-text-primary mb-3 sm:mb-4">
                {stat.number}
              </div>
              <div className="h-px bg-stroke mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-1">{stat.label}</h3>
              <p className="text-xs sm:text-sm text-muted">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
