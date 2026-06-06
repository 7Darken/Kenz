'use client'

import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'

/* ── Types ── */

/** Image de la galerie : une string simple (carte portrait par défaut)
 *  ou un objet pour forcer un format horizontal et/ou ajuster sa position
 *  (top / left / rotate écrasent le layout par défaut du stack). */
export type GalleryItem =
  | string
  | { src: string; landscape?: boolean; top?: string; left?: string; rotate?: number }

export type TimelineEvent = {
  date: string
  title: string
  location: string
  description: string
  image?: string
  gallery?: GalleryItem[]
  tags: string[]
  color: string
  /** Met l'événement en avant (titre plus grand, icône trophée, carte mise en valeur). */
  featured?: boolean
  /** Petit badge affiché au-dessus du titre (ex. « Vainqueur »). */
  badge?: string
}

export type TimelineProps = {
  /** Ancre de la section (#sport, #achievements…). */
  id?: string
  /** Petit label en majuscules au-dessus du titre. */
  label: string
  /** Titre principal de la section. */
  title: string
  /** Liste des événements affichés sur la timeline (du plus récent au plus ancien). */
  events: TimelineEvent[]
}

/* ── Styles ── */

const Section = styled.section`
  padding: 5rem 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const SectionLabel = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  display: block;
  margin-bottom: 0.8rem;
`

const SectionTitle = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 3rem;
`

const Track = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;

  /* Ligne verticale */
  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.08) 10%, rgba(255, 255, 255, 0.08) 90%, transparent);

    @media (max-width: 768px) {
      left: 16px;
    }
  }
`

const Item = styled(motion.div)`
  display: flex;
  gap: 2rem;
  position: relative;
  padding-bottom: 3rem;

  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    gap: 1.2rem;
  }
`

const Dot = styled.div<{ $color: string; $featured?: boolean }>`
  position: relative;
  z-index: 2;
  width: ${p => (p.$featured ? 58 : 50)}px;
  height: ${p => (p.$featured ? 58 : 50)}px;
  border-radius: 50%;
  background: ${p => p.$color}${p => (p.$featured ? '22' : '15')};
  border: 2px solid ${p => p.$color}${p => (p.$featured ? '66' : '40')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${p => p.$color};
  box-shadow: ${p => (p.$featured ? `0 0 24px ${p.$color}40` : 'none')};

  /* Point central (uniquement quand pas d'icône) */
  &::after {
    content: '';
    display: ${p => (p.$featured ? 'none' : 'block')};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${p => p.$color};
    box-shadow: 0 0 12px ${p => p.$color}60;
  }

  @media (max-width: 768px) {
    width: ${p => (p.$featured ? 40 : 34)}px;
    height: ${p => (p.$featured ? 40 : 34)}px;

    &::after {
      width: 8px;
      height: 8px;
    }
  }
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 0.3rem;
`

const EventDate = styled.span<{ $color: string }>`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$color};
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
`

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${p => p.$color};
  background: ${p => p.$color}14;
  border: 1px solid ${p => p.$color}33;
  padding: 0.28rem 0.6rem;
  border-radius: 100px;
  margin-bottom: 0.6rem;
`

const EventTitle = styled.h3<{ $featured?: boolean }>`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: ${p => (p.$featured ? '2.3rem' : '1.8rem')};
  font-weight: 400;
  font-style: italic;
  color: #fff;
  margin: 0 0 0.3rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: ${p => (p.$featured ? '1.9rem' : '1.5rem')};
  }
`

const EventLocation = styled.span`
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.35);
  display: block;
  margin-bottom: 0.8rem;
`

const EventDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 1rem;
`

const EventImage = styled(motion.div)`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1rem;

  img {
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 160px;
    border-radius: 12px;
  }
`

const EventImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.15);
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const PhotoStack = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  margin-bottom: 1.5rem;

  /* Survol du stack : on assombrit les cartes non survolées */
  &:hover > div {
    opacity: 0.7;
    filter: brightness(0.85);
  }

  &:hover > div:hover {
    opacity: 1;
    filter: brightness(1);
  }

  @media (max-width: 768px) {
    height: 280px;
  }
`

const StackCard = styled.div<{
  $rotate: number
  $left: string
  $top: string
  $z: number
  $w: string
  $h: string
  $wMobile: string
  $hMobile: string
}>`
  position: absolute;
  width: ${p => p.$w};
  height: ${p => p.$h};
  left: ${p => p.$left};
  top: ${p => p.$top};
  border-radius: 14px;
  overflow: hidden;
  background: #111;
  border: 3px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: rotate(${p => p.$rotate}deg);
  z-index: ${p => p.$z};
  cursor: pointer;
  opacity: 1;
  filter: brightness(1);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    z-index: 10 !important;
    transform: rotate(${p => p.$rotate * 0.2}deg) translateY(-12px) scale(1.08);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.25);
  }

  img { object-fit: cover; }

  @media (max-width: 768px) {
    width: ${p => p.$wMobile};
    height: ${p => p.$hMobile};
  }
`

const STACK_LAYOUTS = [
  { rotate: -6, left: '0%',  top: '18%', z: 1, w: '130px', h: '190px', wM: '95px',  hM: '140px' },
  { rotate: -2, left: '18%', top: '2%',  z: 3, w: '175px', h: '255px', wM: '130px', hM: '190px' },
  { rotate: 3,  left: '38%', top: '6%',  z: 2, w: '165px', h: '240px', wM: '120px', hM: '175px' },
  { rotate: 6,  left: '58%', top: '4%',  z: 4, w: '185px', h: '265px', wM: '135px', hM: '195px' },
]

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`

const Tag = styled.span<{ $color: string }>`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.68rem;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  background: ${p => p.$color}10;
  border: 1px solid ${p => p.$color}20;
  color: ${p => p.$color};
  letter-spacing: 0.03em;
`

/* ── Sous-composant : visuel d'un événement (galerie, image, ou placeholder) ── */

function EventMedia({ event }: { event: TimelineEvent }) {
  if (event.gallery && event.gallery.length > 0) {
    return (
      <PhotoStack>
        {event.gallery.map((item, j) => {
          const cfg = typeof item === 'string' ? { src: item } : item
          const landscape = cfg.landscape ?? false
          const pos = STACK_LAYOUTS[j] || STACK_LAYOUTS[0]
          // Carte horizontale : on inverse largeur/hauteur du layout portrait.
          return (
            <StackCard
              key={cfg.src}
              $rotate={cfg.rotate ?? pos.rotate}
              $left={cfg.left ?? pos.left}
              $top={cfg.top ?? pos.top}
              $z={pos.z}
              $w={landscape ? pos.h : pos.w}
              $h={landscape ? pos.w : pos.h}
              $wMobile={landscape ? pos.hM : pos.wM}
              $hMobile={landscape ? pos.wM : pos.hM}
            >
              <Image src={cfg.src} alt={`${event.title} ${j + 1}`} fill />
            </StackCard>
          )
        })}
      </PhotoStack>
    )
  }

  if (event.image) {
    return (
      <EventImage whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <Image src={event.image} alt={event.title} fill />
      </EventImage>
    )
  }

  return (
    <EventImage>
      <EventImagePlaceholder>Photo à venir</EventImagePlaceholder>
    </EventImage>
  )
}

/* ── Composant réutilisable ── */

export default function Timeline({ id, label, title, events }: TimelineProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section id={id} ref={ref}>
      <Inner>
        <SectionLabel
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {label}
        </SectionLabel>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </SectionTitle>

        <Track>
          {events.map((event, i) => (
            <Item
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Dot $color={event.color} $featured={event.featured}>
                {event.featured && <Trophy size={22} strokeWidth={2} />}
              </Dot>

              <Content>
                <EventDate $color={event.color}>{event.date}</EventDate>
                {event.badge && (
                  <Badge $color={event.color}>
                    {event.featured && <Trophy size={11} strokeWidth={2.5} />}
                    {event.badge}
                  </Badge>
                )}
                <EventTitle $featured={event.featured}>{event.title}</EventTitle>
                <EventLocation>{event.location}</EventLocation>

                <EventMedia event={event} />

                <EventDesc>{event.description}</EventDesc>

                <TagsRow>
                  {event.tags.map(tag => (
                    <Tag key={tag} $color={event.color}>{tag}</Tag>
                  ))}
                </TagsRow>
              </Content>
            </Item>
          ))}
        </Track>
      </Inner>
    </Section>
  )
}
