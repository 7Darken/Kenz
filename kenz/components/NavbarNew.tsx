'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Resume', href: '#stats' },
]

export default function NavbarNew() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('Home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault()
    setActiveSection(label)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-black/10' : ''
        }`}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'Home')}
          className="group relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300"
        >
          <div className="absolute inset-0 rounded-full accent-gradient group-hover:[background:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]" />
          <div className="absolute inset-[1.5px] rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">Kz</span>
          </div>
        </a>

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Nav links */}
        <div className="hidden sm:flex items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href, link.label)}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 ${
                activeSection === link.label
                  ? 'text-text-primary bg-stroke/50'
                  : 'text-muted hover:text-text-primary hover:bg-stroke/50'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Say hi button */}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact', '')}
          className="group relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary transition-colors duration-200"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative bg-surface rounded-full px-3 py-1.5 backdrop-blur-md inline-flex items-center gap-1">
            Say hi <span className="text-xs">↗</span>
          </span>
        </a>
      </div>
    </nav>
  )
}
