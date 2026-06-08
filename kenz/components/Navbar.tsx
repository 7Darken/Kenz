'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { projects } from '@/data/projects'
import { destinations } from '@/data/destinations'
import { ChevronDown, X } from 'lucide-react'
import { useMode } from '@/contexts/mode-context'
import { useLanguage } from '@/contexts/language-context'
import { localize } from '@/i18n/localize'
import LanguageToggle from '@/components/LanguageToggle'

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

/* ── Secret mode trigger: the dot in "Kenz." ──
   Hidden in plain sight. Only the initiated click it.
   Its colour quietly reveals the current mode:
   green = Pro, orange = Moi. */

const LogoText = styled.span`
  display: inline-block;
  white-space: nowrap;
`

const SecretDot = styled.span<{ $mode: 'pro' | 'perso' }>`
  display: inline-block;
  cursor: pointer;
  color: ${p => (p.$mode === 'pro' ? '#00c8a0' : '#ff8c38')};
  transform-origin: 50% 70%;
  transition: color 0.6s ease, text-shadow 0.35s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    text-shadow: 0 0 16px currentColor;
    animation: secretDotPulse 1.2s ease-in-out infinite;
  }

  @keyframes secretDotPulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.5); }
  }
`

const ModeRipple = styled(motion.div)`
  position: fixed;
  width: 250vmax;
  height: 250vmax;
  margin-left: -125vmax;
  margin-top: -125vmax;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: screen;
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

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [projectsDrop, setProjectsDrop] = useState(false)
  const [travelDrop, setTravelDrop] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { mode, toggleMode, isPro, isPerso } = useMode()
  const { lang, t } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number; color: string } | null>(null)

  // Le contact ouvre une modale sur la home (où le listener vit) ; ailleurs,
  // on laisse le Link naviguer vers /#contact pour rejoindre la section.
  const handleContactClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault()
      window.dispatchEvent(new Event('open-contact-modal'))
    }
  }

  // Secret switch: clicking the dot in the logo flips Pro <-> Moi,
  // sending a coloured wave out from the dot itself.
  const triggerSecretSwitch = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setRipple({
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      color: isPro ? '#ff8c38' : '#00c8a0',
    })
    toggleMode()
  }

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
            <Image src="/images/KzLogo.webp" alt="Kenz" width={30} height={30} />
            <LogoText>
              Kenz<SecretDot $mode={mode} onClick={triggerSecretSwitch}>.</SecretDot>
            </LogoText>
          </LogoLink>

          <DesktopNav>
            {isPro && (
              <>
                <DropdownWrap
                  onMouseEnter={() => setProjectsDrop(true)}
                  onMouseLeave={() => setProjectsDrop(false)}
                >
                  <DropdownTrigger>
                    {t.nav.projects}
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
                            <Image src={p.thumbnail} alt={localize(p.name, lang)} width={34} height={34} />
                            <DropdownText>
                              <span>{localize(p.name, lang)}</span>
                              <small>{localize(p.period, lang)}</small>
                            </DropdownText>
                          </DropdownLink>
                        ))}
                      </DropdownPanel>
                    )}
                  </AnimatePresence>
                </DropdownWrap>
                <NavItem href="/#kenz-ai">{t.nav.kenzAi}</NavItem>
                <NavItem href="/#contact" onClick={handleContactClick}>
                  {t.nav.contact}
                </NavItem>
              </>
            )}

            {isPerso && (
              <>
                <NavItem href="/#content">{t.nav.content}</NavItem>
                <DropdownWrap
                  onMouseEnter={() => setTravelDrop(true)}
                  onMouseLeave={() => setTravelDrop(false)}
                >
                  <DropdownTrigger>
                    {t.nav.travels}
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
                            <Image src={d.imageUrl} alt={d.name} width={34} height={34} />
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
                <NavItem href="/#socials">{t.nav.socials}</NavItem>
              </>
            )}
          </DesktopNav>

          <RightGroup>
            <LanguageToggle />

            <Burger onClick={() => setMobileOpen(true)} aria-label={t.nav.menu}>
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
                <Image src="/images/KzLogo.webp" alt="Kenz" width={28} height={28} />
                Kenz.
              </LogoLink>
              <MobileClose onClick={() => setMobileOpen(false)} aria-label={t.nav.close}>
                <X size={24} />
              </MobileClose>
            </MobileTop>

            <MobileLinks>
              {isPro && (
                <>
                  <MobileLink href="/#apps" onClick={() => setMobileOpen(false)}>{t.nav.projects}</MobileLink>
                  <MobileLink href="/#kenz-ai" onClick={() => setMobileOpen(false)}>{t.nav.kenzAi}</MobileLink>
                  <MobileLink
                    href="/#contact"
                    onClick={(e: React.MouseEvent) => {
                      setMobileOpen(false)
                      if (isHome) {
                        e.preventDefault()
                        window.dispatchEvent(new Event('open-contact-modal'))
                      }
                    }}
                  >
                    {t.nav.contact}
                  </MobileLink>
                </>
              )}
              {isPerso && (
                <>
                  <MobileLink href="/#content" onClick={() => setMobileOpen(false)}>{t.nav.content}</MobileLink>
                  <MobileLink href="/#travel" onClick={() => setMobileOpen(false)}>{t.nav.travels}</MobileLink>
                  <MobileLink href="/#socials" onClick={() => setMobileOpen(false)}>{t.nav.socials}</MobileLink>
                </>
              )}
            </MobileLinks>
          </MobileOverlay>
        )}
      </AnimatePresence>

      {/* Inversion wave radiating from the secret dot */}
      <AnimatePresence>
        {ripple && (
          <ModeRipple
            key={ripple.id}
            style={{ left: ripple.x, top: ripple.y, background: ripple.color }}
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
