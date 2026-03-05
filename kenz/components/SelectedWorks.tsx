'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const PROJECTS = [
  {
    slug: 'oshii',
    title: 'Oshii Recettes',
    description: 'Recettes TikTok prêtes à cuisiner',
    image: '/images/projects/Oshii_dark.png',
    gradient: 'from-red-500 via-rose-400/60 via-pink-500/60 to-transparent',
    href: '/projets/oshii',
  },
  {
    slug: 'zenko',
    title: 'Zenko Voyage',
    description: 'Ton compagnon de voyage intelligent',
    image: '/images/projects/Zenko.png',
    gradient: 'from-amber-500 via-amber-300/60 via-orange-500/60 to-transparent',
    href: '/projets/zenko',
  },
  {
    slug: 'japon',
    title: 'Tokyo & Kyoto',
    description: 'Voyage au Japon',
    image: '/images/destinations/Japon.png',
    gradient: 'from-sky-500 via-blue-400/60 to-transparent',
    href: '/destination/japon',
  },
  {
    slug: 'islande',
    title: 'Islande',
    description: 'Aventure en terre de glace',
    image: '/images/destinations/Islande.png',
    gradient: 'from-emerald-500 via-emerald-300/60 via-teal-500/60 to-transparent',
    href: '/destination/islande',
  },
]

const COL_SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-10 sm:py-12 md:py-16">
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
            <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-2 sm:mb-3">
                Featured{' '}
                <span className="font-display italic">projects</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-muted max-w-md">
                Une sélection de projets sur lesquels j&apos;ai travaillé, du concept au lancement.
              </p>
            </div>
            <Link
              href="#work"
              className="hidden md:inline-flex group relative items-center gap-2 rounded-full text-sm px-5 py-2.5 text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative bg-surface rounded-full px-5 py-2.5 inline-flex items-center gap-2">
                View all work <span>→</span>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className={`col-span-1 ${COL_SPANS[i]} sm:col-span-1`}
            >
              <Link
                href={project.href}
                className={`group relative block bg-surface border border-stroke rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] ${
                  i === 1 || i === 2 ? 'md:aspect-auto md:h-full md:min-h-[280px]' : ''
                }`}
              >
                {/* Background image */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-30`} />

                {/* Bottom info - always visible on mobile */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:from-black/60">
                  <h3 className="text-base sm:text-lg font-medium text-white mb-0.5">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-white/70">{project.description}</p>
                </div>

                {/* Hover overlay - desktop */}
                <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-lg hidden sm:flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-[-2px] rounded-full accent-gradient animate-gradient-shift" />
                    <span className="relative bg-white text-bg rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium inline-flex items-center gap-2">
                      View —{' '}
                      <span className="font-display italic">{project.title}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
