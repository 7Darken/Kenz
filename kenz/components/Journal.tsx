'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ENTRIES = [
  {
    title: "L'avenir des apps mobiles en 2026",
    image: '/images/destinations/Japon.png',
    readTime: '6 min read',
    date: 'Feb 13, 2026',
  },
  {
    title: 'Créer du contenu voyage authentique',
    image: '/images/destinations/Islande.png',
    readTime: '5 min read',
    date: 'Feb 06, 2026',
  },
  {
    title: 'La psychologie du design minimaliste',
    image: '/images/destinations/Coree.png',
    readTime: '6 min read',
    date: 'Feb 03, 2026',
  },
  {
    title: "L'importance du Mobile-First Design",
    image: '/images/destinations/Chine.png',
    readTime: '5 min read',
    date: 'Jan 31, 2026',
  },
]

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-3">
                Recent{' '}
                <span className="font-display italic">thoughts</span>
              </h2>
              <p className="text-sm md:text-base text-muted max-w-md">
                Réflexions sur le développement, le voyage et la création de contenu.
              </p>
            </div>
            <a
              href="#"
              className="hidden md:inline-flex group relative items-center gap-2 rounded-full text-sm px-5 py-2.5 text-muted hover:text-text-primary transition-colors"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative bg-surface rounded-full px-5 py-2.5 inline-flex items-center gap-2">
                View all <span>→</span>
              </span>
            </a>
          </div>
        </motion.div>

        {/* Entries */}
        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden shrink-0 border-2 border-stroke group-hover:border-muted transition-colors duration-300">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-2xl font-medium text-text-primary transition-transform duration-300 group-hover:translate-x-1 text-center sm:text-left">
                {entry.title}
              </h3>

              {/* Dotted separator (desktop) */}
              <div className="hidden md:block flex-grow h-px bg-stroke/30" />

              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-muted shrink-0">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-muted" />
                <span>{entry.date}</span>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-text-primary group-hover:text-bg group-hover:border-text-primary">
                <span className="text-sm">→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
