'use client'

import styled from 'styled-components'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { destinations } from '@/data/destinations'
import { ChevronDown } from 'lucide-react'
import confetti from 'canvas-confetti'

const NavContainer = styled(motion.div)`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: fit-content;
  max-width: 90vw;
  
  @media (max-width: 768px) {
    top: 1rem;
    width: 90%;
  }
`

const NavPill = styled(motion.nav)`
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 0.8rem 1.5rem;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
    padding: 0.8rem 1.2rem;
  }
`

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  font-family: ${props => props.theme.fonts.aesthetic};

  img {
    border-radius: 50%;
  }
`

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    color: white;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  &:hover::after {
    width: 100%;
  }
`

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
`

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-85%); /* Aggressively shifted left to align with text */
  margin-top: 0.5rem;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 20px;
    background: transparent;
  }
`

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }

  div {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    
    span {
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
    }

    small {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
    }
  }
`

const PassionButton = styled(motion.button)`
  background: white;
  color: black;
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
  }

  /* Shine effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::after {
    left: 100%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false)

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  return (
    <NavContainer
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <NavPill>
        <LogoLink href="/">
          <Image src="/images/KzLogo.png" alt="Kenz" width={32} height={32} />
          Kenz.
        </LogoLink>

        <Links>
          <NavLink href="#about">À propos</NavLink>

          <DropdownContainer
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <NavLink href="#apps" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Projets
              <ChevronDown
                size={14}
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </NavLink>

            <AnimatePresence>
              {isDropdownOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {projects.map((project) => (
                    <DropdownItem key={project.id} href={`/apps/${project.slug}`}>
                      <img src={project.thumbnail} alt={project.name} />
                      <div>
                        <span>{project.name}</span>
                        <small>App Mobile</small>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </AnimatePresence>
          </DropdownContainer>

          <DropdownContainer
            onMouseEnter={() => setIsTravelDropdownOpen(true)}
            onMouseLeave={() => setIsTravelDropdownOpen(false)}
          >
            <NavLink href="#travel" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Voyages
              <ChevronDown
                size={14}
                style={{
                  transform: isTravelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </NavLink>

            <AnimatePresence>
              {isTravelDropdownOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {destinations.map((destination) => (
                    <DropdownItem key={destination.id} href={`/destination/${destination.slug}`}>
                      <img src={destination.imageUrl} alt={destination.name} />
                      <div>
                        <span>{destination.country}</span>
                        <small>{destination.name}</small>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </AnimatePresence>
          </DropdownContainer>
        </Links>

        <PassionButton onClick={triggerConfetti}>
          Passion
        </PassionButton>

        <MobileMenuButton>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </MobileMenuButton>
      </NavPill>
    </NavContainer>
  )
}
