'use client'

import Timeline, { TimelineEvent } from './Timeline'
import { useTranslation } from '@/contexts/language-context'

/* ── Composant ── */

export default function ProAchievements() {
  const { achievements: a } = useTranslation()

  /* Texte traduit + médias/couleurs statiques. */
  const events: TimelineEvent[] = [
    {
      date: '2025', // TODO: ajuster le mois / l'année exacte
      title: a.startupWeekend.title,
      location: a.startupWeekend.location,
      badge: a.startupWeekend.badge,
      description: a.startupWeekend.description,
      image: '/images/startupwknd/1773051513158.webp',
      gallery: [
        '/images/startupwknd/1764593040113.webp',
        { src: '/images/startupwknd/1773051513158.webp', landscape: true, top: '15%' },
        { src: '/images/startupwknd/1773051515851.webp', left: '52%' },
      ],
      tags: a.startupWeekend.tags,
      color: '#f5b941',
      featured: true,
    },
  ]

  return (
    <Timeline
      id="achievements"
      label={a.label}
      title={a.title}
      events={events}
    />
  )
}
