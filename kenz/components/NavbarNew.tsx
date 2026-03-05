'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Explore', href: '#explorations' },
  { label: 'Stats', href: '#stats' },
]

export default function NavbarNew() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)

      // Auto-detect active section
      const sections = ['home', 'work', 'explorations', 'stats', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 200) {
          const match = NAV_LINKS.find(l => l.href === `#${id}`)
          if (match) setActiveSection(match.label)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string, label: string) => {
    setActiveSection(label)
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-4 md:pt-6 px-3 sm:px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2 transition-shadow duration-300 ${
          scrolled ? 'shadow-lg shadow-black/20' : ''
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('#home', 'Home')}
          className="group relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300"
        >
          <div className="absolute inset-0 rounded-full accent-gradient group-hover:[background:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]" />
          <div className="absolute inset-[1.5px] rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">Kz</span>
          </div>
        </button>

        {/* Divider - desktop */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Nav links - desktop */}
        <div className="hidden sm:flex items-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href, link.label)}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 cursor-pointer ${
                activeSection === link.label
                  ? 'text-text-primary bg-stroke/50'
                  : 'text-muted hover:text-text-primary hover:bg-stroke/50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Divider - desktop */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Say hi button - desktop */}
        <button
          onClick={() => scrollTo('#contact', '')}
          className="hidden sm:inline-flex group relative text-xs sm:text-sm rounded-full text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative bg-surface rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md inline-flex items-center gap-1">
            Say hi <span className="text-xs">↗</span>
          </span>
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden ml-1 w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-text-primary hover:bg-stroke/50 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden absolute top-full mt-2 left-4 right-4 bg-surface/95 backdrop-blur-xl border border-stroke rounded-2xl p-3 shadow-xl shadow-black/30">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href, link.label)}
              className={`w-full text-left text-sm rounded-xl px-4 py-3 transition-colors duration-200 block ${
                activeSection === link.label
                  ? 'text-text-primary bg-stroke/50'
                  : 'text-muted hover:text-text-primary hover:bg-stroke/30'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="h-px bg-stroke my-2" />
          <button
            onClick={() => scrollTo('#contact', '')}
            className="w-full text-left text-sm rounded-xl px-4 py-3 text-muted hover:text-text-primary hover:bg-stroke/30 transition-colors flex items-center gap-1"
          >
            Say hi <span className="text-xs">↗</span>
          </button>
        </div>
      )}
    </nav>
  )
}
