'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

// Custom TikTok icon since Lucide might not have it or I want a specific style
const TikTokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.394 6.394 0 0 0-5.394 6.365c0 3.532 2.868 6.397 6.406 6.397 3.538 0 6.406-2.865 6.406-6.397V6.22c.703.328 1.482.536 2.299.604V6.686z" />
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
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 3rem;
  text-transform: uppercase;
  line-height: 0.9;
  
  span {
    display: block;
    color: transparent;
    -webkit-text-stroke: 2px ${props => props.theme.colors.text};
    opacity: 0.3;
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
    { name: 'TikTok', icon: TikTokIcon, color: '#ff0050', link: '#' },
    { name: 'Instagram', icon: Instagram, color: '#E1306C', link: '#' },
    { name: 'Twitter', icon: Twitter, color: '#1DA1F2', link: '#' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5', link: '#' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000', link: '#' },
]

export default function Socials() {
    return (
        <Section id="socials">
            <Container>
                <Title>
                    <span>Follow The</span>
                    Journey
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
