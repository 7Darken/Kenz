'use client'

import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #050505;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: none; /* Custom cursor experience */
`

const BackgroundGradient = styled(motion.div)`
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 50, 50, 0.15), transparent 60%);
  filter: blur(100px);
  opacity: 0.6;
  pointer-events: none;
`

const BigText = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(4rem, 15vw, 20rem);
  color: white;
  line-height: 0.8;
  text-align: center;
  font-style: italic;
  mix-blend-mode: difference;
  z-index: 10;
  pointer-events: none;
`

const SubText = styled(motion.p)`
  font-family: ${props => props.theme.fonts.main};
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5em;
  margin-top: 2rem;
  z-index: 10;
  text-align: center;
`

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 20;
  padding: 1rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const CursorFollower = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  mix-blend-mode: exclusion;
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
`

const FloatingWord = styled(motion.span)`
  position: absolute;
  font-family: ${props => props.theme.fonts.main};
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
`

const words = ["Rêves", "Création", "Liberté", "Code", "Voyage", "Art", "Futur", "Impact"]

export default function PassionReveal({ onClose }: { onClose: () => void }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <BackgroundGradient
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <CloseButton onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <X size={24} />
            </CloseButton>

            <CursorFollower
                animate={{ x: mousePosition.x, y: mousePosition.y }}
                transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
            />

            <BigText
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            >
                PASSION
            </BigText>

            <SubText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Le moteur de l'impossible
            </SubText>

            {words.map((word, i) => (
                <FloatingWord
                    key={word}
                    style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        y: [0, -50],
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                >
                    {word}
                </FloatingWord>
            ))}
        </Overlay>
    )
}
