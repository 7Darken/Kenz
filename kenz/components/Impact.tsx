'use client'

import styled from 'styled-components'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

/* ── Data ── */

const stats = [
  { value: 12000, suffix: '+', label: 'Téléchargements', prefix: '' },
  { value: 3, suffix: '', label: 'Apps publiées', prefix: '' },
  { value: 4.9, suffix: '/5', label: 'Note App Store', prefix: '' },
  { value: 2, suffix: ' ans', label: "D'expérience", prefix: '' },
]

/* ── Animated Counter ── */

function Counter({ target, suffix, prefix, inView }: {
  target: number
  suffix: string
  prefix: string
  inView: boolean
}) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return

    const isDecimal = target % 1 !== 0
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (isDecimal) {
          setDisplay(v.toFixed(1))
        } else if (target >= 1000) {
          setDisplay(Math.round(v).toLocaleString('fr-FR'))
        } else {
          setDisplay(Math.round(v).toString())
        }
      },
    })

    return () => controls.stop()
  }, [inView, target])

  return <>{prefix}{display}{suffix}</>
}

/* ── Styles ── */

const Section = styled.section`
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const StatBlock = styled(motion.div)`
  flex: 1;
  min-width: 0;
  padding: 2.5rem 2rem;
  background: rgba(3, 3, 5, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  position: relative;

  @media (max-width: 768px) {
    flex: 1 1 45%;
    padding: 2rem 1.5rem;
  }
`

const StatValue = styled.span`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
`

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
  letter-spacing: 0.02em;
`

const AccentLine = styled.div<{ $delay: number }>`
  position: absolute;
  bottom: 0;
  left: 2rem;
  right: 2rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 200, 160, 0.3), transparent);
  opacity: 0;
  animation: fadeIn 1s ${p => p.$delay}s forwards;

  @keyframes fadeIn {
    to { opacity: 1; }
  }
`

/* ── Component ── */

export default function Impact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <Section ref={ref}>
      <Inner>
        {stats.map((stat, i) => (
          <StatBlock
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: i * 0.12,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <StatValue>
              <Counter
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                inView={inView}
              />
            </StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <AccentLine $delay={0.5 + i * 0.15} />
          </StatBlock>
        ))}
      </Inner>
    </Section>
  )
}
