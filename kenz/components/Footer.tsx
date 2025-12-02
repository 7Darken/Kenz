'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react'

const FooterContainer = styled.footer`
  background: #020202;
  color: white;
  padding: 8rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.aesthetic};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`

const Bio = styled.p`
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  max-width: 300px;
`

const ColumnTitle = styled.h4`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: white;
  }
`

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: white;
  }
`

const BottomBar = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const Glow = styled.div`
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`

export default function Footer() {
  return (
    <FooterContainer>
      <Glow />
      <ContentWrapper>
        <Grid>
          <Column>
            <Logo>KENZ</Logo>
            <Bio>
              Développeur créatif et explorateur digital. Je conçois des expériences web immersives et des applications mobiles intuitives.
            </Bio>
          </Column>

          <Column>
            <ColumnTitle>Sitemap</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/">Accueil</FooterLink></li>
              <li><FooterLink href="#about">À propos</FooterLink></li>
              <li><FooterLink href="#apps">Projets</FooterLink></li>
              <li><FooterLink href="#travel">Voyages</FooterLink></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Réseaux</ColumnTitle>
            <LinkList>
              <li><SocialLink href="https://www.tiktok.com/@7kinze" target="_blank">TikTok</SocialLink></li>
              <li><SocialLink href="https://www.instagram.com/kenz.dev" target="_blank">Instagram</SocialLink></li>
              <li><SocialLink href="https://www.youtube.com/@7Kinze" target="_blank">YouTube</SocialLink></li>
              <li><SocialLink href="https://linkedin.com" target="_blank">LinkedIn</SocialLink></li>
            </LinkList>
          </Column>

          <Column>
            <ColumnTitle>Infos</ColumnTitle>
            <LinkList>
              <li><FooterLink href="#">Mentions Légales</FooterLink></li>
              <li><FooterLink href="#">Confidentialité</FooterLink></li>
              <li style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>
                Paris, France 🇫🇷
              </li>
            </LinkList>
          </Column>
        </Grid>

        <BottomBar>
          <p>&copy; {new Date().getFullYear()} Kenz. All rights reserved.</p>
          <p>Designed & Built with passion.</p>
        </BottomBar>
      </ContentWrapper>
    </FooterContainer>
  )
}
