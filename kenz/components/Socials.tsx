'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Instagram, Youtube } from 'lucide-react'
import { useTranslation } from '@/contexts/language-context'

// Custom TikTok icon since Lucide might not have it or I want a specific style
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.14c0 3.48-2.32 6.66-5.79 7.18-4.78.72-9.14-2.56-9.66-7.3C.68 9.28 4.31 4.91 9.24 5.3c.64.05 1.28.22 1.88.49v4.2c-.17-.07-.35-.1-.53-.13-1.74-.22-3.35.81-3.97 2.47-.73 1.96.25 4.21 2.17 5.03 2.21.94 4.82-.4 5.54-2.7.13-.42.19-.85.19-1.29V.02h-1.19z" />
    </svg>
)

const Section = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
`

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 3rem;
  line-height: 1;
  color: #fff;

  span {
    display: block;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.5em;
    font-style: normal;
    font-family: ${props => props.theme.fonts.main};
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
`

const SocialGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`

const SocialCard = styled(motion.a) <{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.$color};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  span {
    font-weight: 600;
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.$color};
    
    &::before {
      opacity: 0.1;
    }

    svg {
      transform: scale(1.1);
    }
  }
`

const socials = [
    { name: 'TikTok', icon: TikTokIcon, color: '#ff0050', link: 'https://www.tiktok.com/@7kinze' },
    { name: 'Instagram', icon: Instagram, color: '#E1306C', link: 'https://www.instagram.com/kenz.dev' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000', link: 'https://www.youtube.com/@7Kinze' },
]

export default function Socials() {
    const t = useTranslation()
    return (
        <Section id="socials">
            <Container>
                <Title>
                    <span>{t.socials.eyebrow}</span>
                    {t.socials.title}
                </Title>

                <SocialGrid>
                    {socials.map((social, index) => (
                        <SocialCard
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            $color={social.color}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <social.icon />
                            <span>{social.name}</span>
                        </SocialCard>
                    ))}
                </SocialGrid>
            </Container>
        </Section>
    )
}
