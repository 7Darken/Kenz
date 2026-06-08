'use client'

import Timeline, { TimelineEvent } from './Timeline'
import { useTranslation } from '@/contexts/language-context'

/* ── Composant ── */

export default function SportTimeline() {
  const { sport } = useTranslation()

  /* Texte traduit + médias/couleurs statiques. */
  const events: TimelineEvent[] = [
    {
      date: sport.hyrox.date,
      title: 'Hyrox',
      location: sport.hyrox.location,
      description: sport.hyrox.description,
      image: '/images/sport/hyrox/12586_20250531_130056_500865369_socialmedia.webp',
      gallery: [
        '/images/sport/hyrox/12586_20250531_114633_500775136_socialmedia.webp',
        '/images/sport/hyrox/12586_20250531_115603_500798437_socialmedia.webp',
        '/images/sport/hyrox/12586_20250531_130056_500865369_socialmedia.webp',
        '/images/sport/hyrox/12586_20250531_130349_500882582_socialmedia.webp',
      ],
      tags: sport.hyrox.tags,
      color: '#f59e0b',
    },
    {
      date: sport.spartan.date,
      title: 'Spartan Race',
      location: sport.spartan.location,
      description: sport.spartan.description,
      image: '/images/sport/spartan/14571_AFA1_02724.webp',
      gallery: [
        '/images/sport/spartan/14571_AFA1_02724.webp',
        '/images/sport/spartan/14571_IBLA1_05552.webp',
        '/images/sport/spartan/14571_IBLA1_05552v２.webp',
      ],
      tags: sport.spartan.tags,
      color: '#ef4444',
    },
  ]

  return (
    <Timeline
      id="sport"
      label={sport.label}
      title={sport.title}
      events={events}
    />
  )
}
