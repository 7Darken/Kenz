'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const PROJECTS = [
  {
    slug: 'oshii',
    title: 'Oshii Recettes',
    image: '/images/projects/Oshii_dark.png',
    gradient: 'from-red-500 via-rose-400/60 via-pink-500/60 to-transparent',
  },
  {
    slug: 'zenko',
    title: 'Zenko Voyage',
    image: '/images/projects/Zenko.png',
    gradient: 'from-amber-500 via-amber-300/60 via-orange-500/60 to-transparent',
  },
  {
    slug: 'travel-japan',
    title: 'Tokyo & Kyoto',
    image: '/images/destinations/Japon.png',
    gradient: 'from-sky-500 via-blue-400/60 to-transparent',
  },
  {
    slug: 'travel-iceland',
    title: 'Islande',
    image: '/images/destinations/Islande.png',
    gradient: 'from-emerald-500 via-emerald-300/60 via-teal-500/60 to-transparent',
  },
]

const COL_SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
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
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-primary mb-3">
                Featured{' '}
                <span className="font-display italic">projects</span>
              </h2>
              <p className="text-sm md:text-base text-muted max-w-md">
                Une sélection de projets sur lesquels j&apos;ai travaillé, du concept au lancement.
              </p>
            </div>
            <a
              href="#work"
              className="hidden md:inline-flex group relative items-center gap-2 rounded-full text-sm px-5 py-2.5 text-muted hover:text-text-primary transition-colors"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative bg-surface rounded-full px-5 py-2.5 inline-flex items-center gap-2">
                View all work <span>→</span>
              </span>
            </a>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className={`col-span-1 ${COL_SPANS[i]} group relative bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer ${
                i === 0 || i === 3 ? 'aspect-[4/3]' : 'aspect-[4/3] md:aspect-auto md:h-full'
              }`}
            >
              {/* Background image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-30`} />

              {/* Halftone overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-lg flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-[-2px] rounded-full accent-gradient animate-gradient-shift" />
                  <span className="relative bg-white text-bg rounded-full px-6 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                    View —{' '}
                    <span className="font-display italic">{project.title}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
