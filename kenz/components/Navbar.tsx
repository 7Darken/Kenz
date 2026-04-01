'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { destinations } from '@/data/destinations'
import { ChevronDown, X } from 'lucide-react'
import { useMode } from '@/contexts/mode-context'

/* ═══════════════════════════════════════════
   NAVBAR — Full-width frosted bar
   ═══════════════════════════════════════════ */

const NavOuter = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  background: ${p => p.$scrolled ? 'rgba(3, 3, 5, 0.7)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: 1px solid ${p => p.$scrolled ? 'rgba(255,255,255,0.05)' : 'transparent'};
  box-shadow: ${p => p.$scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none'};
`

const NavInner = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
  }
`

/* ── Logo ── */

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.15rem;
  font-family: ${p => p.theme.fonts.main};
  letter-spacing: -0.01em;
  transition: opacity 0.3s ease;

  &:hover { opacity: 0.8; }

  img { border-radius: 50%; }
`

/* ── Desktop Nav ── */

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled(Link)`
  font-size: 0.85rem;
  font-weight: 450;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  transition: color 0.25s ease, background 0.25s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }
`

const DropdownWrap = styled.div`
  position: relative;
`

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 450;
  color: rgba(255, 255, 255, 0.55);
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.25s ease, background 0.25s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }
`

const DropdownPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(12, 12, 14, 0.92);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.4rem;
  min-width: 260px;
  box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.6);

  /* Invisible bridge so hover doesn't break */
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 12px;
  }
`

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover { background: rgba(255, 255, 255, 0.06); }

  img {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    object-fit: cover;
  }
`

const DropdownText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  span {
    color: white;
    font-size: 0.85rem;
    font-weight: 550;
  }

  small {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.72rem;
  }
`

/* ── Right side ── */

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

/* ── Mode Toggle ── */

const ModeToggle = styled.button`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 3px;
  cursor: pointer;
  position: relative;
`

const ModeLabel = styled.span<{ $active: boolean }>`
  position: relative;
  z-index: 2;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: ${p => p.$active ? '#000' : 'rgba(255, 255, 255, 0.45)'};
  border-radius: 100px;
  transition: color 0.3s ease;
  white-space: nowrap;
  user-select: none;
`

const ModeIndicator = styled(motion.div)`
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 100px;
  background: white;
  z-index: 1;
`

/* ── Mobile ── */

const Burger = styled.button`
  display: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(3, 3, 5, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
`

const MobileTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`

const MobileClose = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
`

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const MobileLink = styled(Link)`
  font-size: 1.8rem;
  font-family: ${p => p.theme.fonts.aesthetic};
  font-style: italic;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 0.6rem 0;
  transition: color 0.3s ease;

  &:hover { color: white; }
`

const MobileBottom = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MobileModeText = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [projectsDrop, setProjectsDrop] = useState(false)
  const [travelDrop, setTravelDrop] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { mode, toggleMode, isPro, isPerso } = useMode()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <NavOuter
        $scrolled={scrolled}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <NavInner>
          <LogoLink href="/">
            <Image src="/images/KzLogo.png" alt="Kenz" width={30} height={30} />
            Kenz.
          </LogoLink>

          <DesktopNav>
            {isPro && (
              <>
                <DropdownWrap
                  onMouseEnter={() => setProjectsDrop(true)}
                  onMouseLeave={() => setProjectsDrop(false)}
                >
                  <DropdownTrigger>
                    Projets
                    <ChevronDown
                      size={13}
                      style={{
                        transform: projectsDrop ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        opacity: 0.5,
                      }}
                    />
                  </DropdownTrigger>

                  <AnimatePresence>
                    {projectsDrop && (
                      <DropdownPanel
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                      >
                        {projects.map((p) => (
                          <DropdownLink key={p.id} href={`/apps/${p.slug}`}>
                            <img src={p.thumbnail} alt={p.name} />
                            <DropdownText>
                              <span>{p.name}</span>
                              <small>{p.period}</small>
                            </DropdownText>
                          </DropdownLink>
                        ))}
                      </DropdownPanel>
                    )}
                  </AnimatePresence>
                </DropdownWrap>
                <NavItem href="#kenz-ai">Kenz AI</NavItem>
                <NavItem
                  href="#contact"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    window.dispatchEvent(new Event('open-contact-modal'))
                  }}
                >
                  Contact
                </NavItem>
              </>
            )}

            {isPerso && (
              <>
                <NavItem href="#content">Contenu</NavItem>
                <DropdownWrap
                  onMouseEnter={() => setTravelDrop(true)}
                  onMouseLeave={() => setTravelDrop(false)}
                >
                  <DropdownTrigger>
                    Voyages
                    <ChevronDown
                      size={13}
                      style={{
                        transform: travelDrop ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        opacity: 0.5,
                      }}
                    />
                  </DropdownTrigger>

                  <AnimatePresence>
                    {travelDrop && (
                      <DropdownPanel
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                      >
                        {destinations.map((d) => (
                          <DropdownLink key={d.id} href={`/destination/${d.slug}`}>
                            <img src={d.imageUrl} alt={d.name} />
                            <DropdownText>
                              <span>{d.country}</span>
                              <small>{d.name}</small>
                            </DropdownText>
                          </DropdownLink>
                        ))}
                      </DropdownPanel>
                    )}
                  </AnimatePresence>
                </DropdownWrap>
                <NavItem href="#socials">Réseaux</NavItem>
              </>
            )}
          </DesktopNav>

          <RightGroup>
            <ModeToggle onClick={toggleMode}>
              <ModeLabel $active={mode === 'pro'}>Pro</ModeLabel>
              <ModeLabel $active={mode === 'perso'}>Moi</ModeLabel>
              <ModeIndicator
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{
                  left: mode === 'pro' ? 3 : '50%',
                  right: mode === 'perso' ? 3 : '50%',
                }}
              />
            </ModeToggle>

            <Burger onClick={() => setMobileOpen(true)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </Burger>
          </RightGroup>
        </NavInner>
      </NavOuter>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileTop>
              <LogoLink href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/images/KzLogo.png" alt="Kenz" width={28} height={28} />
                Kenz.
              </LogoLink>
              <MobileClose onClick={() => setMobileOpen(false)} aria-label="Fermer">
                <X size={24} />
              </MobileClose>
            </MobileTop>

            <MobileLinks>
              {isPro && (
                <>
                  <MobileLink href="/#apps" onClick={() => setMobileOpen(false)}>Projets</MobileLink>
                  <MobileLink href="/#kenz-ai" onClick={() => setMobileOpen(false)}>Kenz AI</MobileLink>
                  <MobileLink
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault()
                      setMobileOpen(false)
                      window.dispatchEvent(new Event('open-contact-modal'))
                    }}
                  >
                    Contact
                  </MobileLink>
                </>
              )}
              {isPerso && (
                <>
                  <MobileLink href="/#content" onClick={() => setMobileOpen(false)}>Contenu</MobileLink>
                  <MobileLink href="/#travel" onClick={() => setMobileOpen(false)}>Voyages</MobileLink>
                  <MobileLink href="/#socials" onClick={() => setMobileOpen(false)}>Réseaux</MobileLink>
                </>
              )}
            </MobileLinks>

            <MobileBottom>
              <MobileModeText>Mode</MobileModeText>
              <ModeToggle onClick={toggleMode}>
                <ModeLabel $active={mode === 'pro'}>Pro</ModeLabel>
                <ModeLabel $active={mode === 'perso'}>Moi</ModeLabel>
                <ModeIndicator
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  style={{
                    left: mode === 'pro' ? 3 : '50%',
                    right: mode === 'perso' ? 3 : '50%',
                  }}
                />
              </ModeToggle>
            </MobileBottom>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
