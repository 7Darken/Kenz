'use client'

import Timeline, { TimelineEvent } from './Timeline'

/* ── Données ── */

const events: TimelineEvent[] = [
  {
    date: '2025', // TODO: ajuster le mois / l'année exacte
    title: '1ère Place — Startup Weekend',
    location: 'France',
    badge: 'Vainqueur',
    description:
      'Vainqueur du Startup Weekend : 54h pour concevoir, prototyper et pitcher un projet en équipe. Classé 1ᵉʳ devant le jury.', // TODO: ajuster le détail
    image: '/images/startupwknd/1773051513158.webp',
    gallery: [
      '/images/startupwknd/1764593040113.webp',
      { src: '/images/startupwknd/1773051513158.webp', landscape: true, top: '15%' },
      { src: '/images/startupwknd/1773051515851.webp', left: '52%' },
    ],
    tags: ['Entrepreneuriat', 'Pitch', '54h', 'Équipe'],
    color: '#f5b941',
    featured: true,
  },
]

/* ── Composant ── */

export default function ProAchievements() {
  return (
    <Timeline
      id="achievements"
      label="Distinctions"
      title="Concours & récompenses"
      events={events}
    />
  )
}
