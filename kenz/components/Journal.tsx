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
    <section className="bg-bg py-12 sm:py-16 md:py-24">
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
            <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-2 sm:mb-3">
                Recent{' '}
                <span className="font-display italic">thoughts</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-muted max-w-md">
                Réflexions sur le développement, le voyage et la création de contenu.
              </p>
            </div>
            <button className="hidden md:inline-flex group relative items-center gap-2 rounded-full text-sm px-5 py-2.5 text-muted hover:text-text-primary transition-colors shrink-0 cursor-pointer">
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative bg-surface rounded-full px-5 py-2.5 inline-flex items-center gap-2">
                View all <span>→</span>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Entries */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className="group flex flex-row items-center gap-3 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-2xl sm:rounded-[40px] transition-colors duration-300 cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-12 h-12 sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden shrink-0 border-2 border-stroke group-hover:border-muted transition-colors duration-300">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  sizes="100px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-medium text-text-primary transition-transform duration-300 group-hover:translate-x-1 truncate sm:whitespace-normal sm:line-clamp-2">
                  {entry.title}
                </h3>
                {/* Meta - mobile inline */}
                <div className="flex items-center sm:hidden gap-2 text-[10px] text-muted mt-0.5">
                  <span>{entry.readTime}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-muted" />
                  <span>{entry.date}</span>
                </div>
              </div>

              {/* Dotted separator (desktop) */}
              <div className="hidden lg:block flex-grow h-px bg-stroke/30" />

              {/* Meta - desktop */}
              <div className="hidden sm:flex items-center gap-3 text-xs md:text-sm text-muted shrink-0 whitespace-nowrap">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-muted" />
                <span>{entry.date}</span>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full border border-stroke items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-text-primary group-hover:text-bg group-hover:border-text-primary">
                <span className="text-xs sm:text-sm">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
