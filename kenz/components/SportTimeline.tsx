'use client'

import Timeline, { TimelineEvent } from './Timeline'

/* ── Données ── */

const events: TimelineEvent[] = [
  {
    date: 'Mai 2025',
    title: 'Hyrox',
    location: 'Paris, France',
    description: 'Course hybride combinant running et exercices fonctionnels. 8 stations, 8km de course — un test complet de fitness.',
    image: '/images/sport/hyrox/12586_20250531_130056_500865369_socialmedia.webp',
    gallery: [
      '/images/sport/hyrox/12586_20250531_114633_500775136_socialmedia.webp',
      '/images/sport/hyrox/12586_20250531_115603_500798437_socialmedia.webp',
      '/images/sport/hyrox/12586_20250531_130056_500865369_socialmedia.webp',
      '/images/sport/hyrox/12586_20250531_130349_500882582_socialmedia.webp',
    ],
    tags: ['Endurance', 'Fonctionnel', '8km'],
    color: '#f59e0b',
  },
  {
    date: 'Juin 2025',
    title: 'Spartan Race',
    location: 'France',
    description: 'Course à obstacles en pleine nature. Boue, murs, cordes — repousser ses limites physiques et mentales.',
    image: '/images/sport/spartan/14571_AFA1_02724.webp',
    gallery: [
      '/images/sport/spartan/14571_AFA1_02724.webp',
      '/images/sport/spartan/14571_IBLA1_05552.webp',
      '/images/sport/spartan/14571_IBLA1_05552v２.webp',
    ],
    tags: ['Obstacles', 'Nature', 'Mental'],
    color: '#ef4444',
  },
]

/* ── Composant ── */

export default function SportTimeline() {
  return (
    <Timeline
      id="sport"
      label="Sport & Défis"
      title="Repousser les limites"
      events={events}
    />
  )
}
