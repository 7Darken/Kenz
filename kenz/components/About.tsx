'use client'

import styled from 'styled-components'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useRef, MouseEvent } from 'react'
import { Code2, Plane, Video, Sparkles, Globe, Smartphone } from 'lucide-react'
import Scene3D from './Scene3D'

const Section = styled.section`
  padding: 0 2rem 5rem 2rem;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 2000px; /* Deep perspective for 3D */
`

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  
  @media (max-width: 768px) {
    height: 600px;
  }
`

const CenterPiece = styled(motion.div)`
  position: relative;
  width: 400px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    width: 300px;
    height: 400px;
  }
`

const ProfileImageWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 
    0 20px 50px -10px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,255,255,0.1);
  transform-style: preserve-3d;
  
  img {
    object-fit: cover;
    transition: transform 0.7s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
    z-index: 1;
  }
`

const FloatingIdea = styled(motion.div) <{ $x: number, $y: number, $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1.2rem;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 4;
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);
  transform-style: preserve-3d;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }
`

const BigName = styled(motion.h2)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(8rem, 20vw, 15rem);
  line-height: 1;
  color: rgba(255, 255, 255, 0.03);
  white-space: nowrap;
  z-index: 1;
  pointer-events: none;
  font-style: italic;
  transform-style: preserve-3d;
`

const OverlayContent = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 3;
  padding: 0 1rem;
  transform: translateZ(20px); /* Pop out text */
`

const Tagline = styled.p`
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.theme.colors.primary};
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`

const MinimalBio = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`

const ideas = [
    { icon: Code2, label: "Tech", x: -160, y: -100, color: "#00f0ff" },
    { icon: Plane, label: "Voyage", x: 160, y: -100, color: "#ff0050" },
    { icon: Video, label: "Création", x: -160, y: 100, color: "#ffaa00" },
    { icon: Smartphone, label: "Apps", x: 160, y: 100, color: "#bd00ff" },
    { icon: Globe, label: "Monde", x: 0, y: -220, color: "#00ff88" },
]

export default function About() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Mouse parallax effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 20, stiffness: 100 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)

    const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10])
    const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10])

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
    const bigNameZ = useTransform(scrollYProgress, [0, 1], [-100, 50])

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    return (
        <Section id="about" ref={containerRef} onMouseMove={handleMouseMove}>
            <Scene3D />

            <Container>
                <BigName style={{ y, z: bigNameZ }}>KENZ</BigName>

                <CenterPiece>
                    <ProfileImageWrapper style={{ scale }}>
                        <Image
                            src="/images/kenz-pp.PNG"
                            alt="Kenz"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                        />

                        <OverlayContent
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Tagline>Digital • Explorer</Tagline>
                            <MinimalBio>
                                Je transforme mes idées en réalité digitale.
                            </MinimalBio>
                        </OverlayContent>
                    </ProfileImageWrapper>

                    {ideas.map((idea, index) => (
                        <FloatingIdea
                            key={index}
                            $x={idea.x}
                            $y={idea.y}
                            $delay={index * 0.1}
                            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                                x: `calc(-50% + ${idea.x}px)`,
                                y: `calc(-50% + ${idea.y}px)`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                delay: index * 0.1
                            }}
                            whileHover={{ scale: 1.1, zIndex: 10, translateZ: 50 }}
                            style={{ translateZ: 30 }} // Float above image
                        >
                            <idea.icon style={{ color: idea.color }} />
                            {idea.label}
                        </FloatingIdea>
                    ))}
                </CenterPiece>
            </Container>
        </Section>
    )
}
