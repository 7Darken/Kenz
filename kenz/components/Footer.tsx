'use client'

import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import { useMode } from '@/contexts/mode-context'

const FooterContainer = styled.footer`
  background: #020202;
  color: white;
  padding: 5rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    padding: 3rem 1.5rem 1.5rem;
  }
`

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2.5rem;
  }
`

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 320px;
`

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  img { border-radius: 50%; }
`

const LogoText = styled.span`
  font-family: ${p => p.theme.fonts.main};
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
`

const Bio = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  font-weight: 300;
`

const LinksRow = styled.div`
  display: flex;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2.5rem;
    flex-wrap: wrap;
  }
`

const LinkCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const ColTitle = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  margin-bottom: 0.3rem;
`

const FooterLink = styled(Link)`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover { color: #fff; }
`

const ExtLink = styled.a`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover { color: #fff; }
`

const ContactLink = styled.button`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.3s ease;

  &:hover { color: #fff; }
`

const BottomBar = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.78rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.6rem;
    text-align: center;
  }
`

export default function Footer() {
  const { isPro, isPerso } = useMode()

  return (
    <FooterContainer>
      <Inner>
        <TopRow>
          <BrandCol>
            <LogoRow>
              <Image src="/images/KzLogo.webp" alt="Kenz" width={28} height={28} />
              <LogoText>Kenz Narainen</LogoText>
            </LogoRow>
            <Bio>
              {isPro
                ? "Développeur Full Stack basé à Paris. Je conçois des applications mobiles et des expériences web performantes."
                : "Créateur de contenu, développeur et globe-trotteur. Je partage mes voyages et mes projets entre Paris et l'Asie."}
            </Bio>
          </BrandCol>

          <LinksRow>
            <LinkCol>
              <ColTitle>Navigation</ColTitle>
              <FooterLink href="/">Accueil</FooterLink>
              {isPro && (
                <>
                  <FooterLink href="/#apps">Projets</FooterLink>
                  <FooterLink href="/#kenz-ai">Kenz AI</FooterLink>
                  <ContactLink onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}>
                    Contact
                  </ContactLink>
                </>
              )}
              {isPerso && (
                <>
                  <FooterLink href="/#content">Contenu</FooterLink>
                  <FooterLink href="/#travel">Voyages</FooterLink>
                  <FooterLink href="/#sport">Sport</FooterLink>
                  <FooterLink href="/#socials">Réseaux</FooterLink>
                </>
              )}
            </LinkCol>

            <LinkCol>
              <ColTitle>Réseaux</ColTitle>
              <ExtLink href="https://github.com/7Darken" target="_blank">GitHub</ExtLink>
              <ExtLink href="https://www.linkedin.com/in/kenz-narainen" target="_blank">LinkedIn</ExtLink>
              <ExtLink href="https://www.tiktok.com/@7kinze" target="_blank">TikTok</ExtLink>
              <ExtLink href="https://www.youtube.com/@7Kinze" target="_blank">YouTube</ExtLink>
              <ExtLink href="https://www.instagram.com/kenz.dev" target="_blank">Instagram</ExtLink>
            </LinkCol>

            {isPro && (
              <LinkCol>
                <ColTitle>Apps</ColTitle>
                <FooterLink href="/apps/oshii">Oshii</FooterLink>
                <FooterLink href="/apps/zenko">Zenko</FooterLink>
                <FooterLink href="/apps/sago">Sago</FooterLink>
              </LinkCol>
            )}
          </LinksRow>
        </TopRow>

        <BottomBar>
          <span>&copy; {new Date().getFullYear()} Kenz Narainen. Tous droits réservés.</span>
          <span>Paris, France</span>
        </BottomBar>
      </Inner>
    </FooterContainer>
  )
}
