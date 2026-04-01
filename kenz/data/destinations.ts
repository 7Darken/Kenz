export type Destination = {
  id: number;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  description: string;
  imageUrl: string;
  stats: {
    label: string;
    value: string;
  }[];
  gallery?: string[];
}

export const destinations: Destination[] = [
  {
    id: 1,
    slug: 'japon',
    name: 'Tokyo & Kyoto',
    country: 'Japon',
    countryCode: 'jp',
    description: 'Une immersion entre tradition millénaire et futurisme néon. Des temples zen aux quartiers électriques d\'Akihabara.',
    imageUrl: '/images/destinations/Japon.png',
    stats: [
      { label: 'Durée', value: '3 semaines' },
      { label: 'Saison', value: 'Printemps' },
      { label: 'Vibe', value: 'Cyberpunk' }
    ]
  },
  {
    id: 2,
    slug: 'islande',
    name: 'South Coast',
    country: 'Islande',
    countryCode: 'is',
    description: 'Terre de glace et de feu. Cascades géantes, plages de sable noir et aurores boréales.',
    imageUrl: '/images/destinations/Islande.png',
    stats: [
      { label: 'Durée', value: '10 jours' },
      { label: 'Saison', value: 'Hiver' },
      { label: 'Vibe', value: 'Nature' }
    ]
  },
  {
    id: 3,
    slug: 'chine',
    name: 'Shanghai & Beijing',
    country: 'Chine',
    countryCode: 'cn',
    description: 'La grandeur de la Grande Muraille et la modernité vertigineuse des gratte-ciels.',
    imageUrl: '/images/destinations/Chine.png',
    stats: [
      { label: 'Durée', value: '2 semaines' },
      { label: 'Saison', value: 'Automne' },
      { label: 'Vibe', value: 'Urbain' }
    ]
  },
  {
    id: 4,
    slug: 'coree',
    name: 'Seoul',
    country: 'Corée du Sud',
    countryCode: 'kr',
    description: 'K-Pop, Street Food et Palais Royaux. Une ville qui ne dort jamais.',
    imageUrl: '/images/destinations/Coree.png',
    stats: [
      { label: 'Durée', value: '2 semaines' },
      { label: 'Saison', value: 'Été' },
      { label: 'Vibe', value: 'Dynamique' }
    ]
  },
  {
    id: 5,
    slug: 'malaisie',
    name: 'Kuala Lumpur',
    country: 'Malaisie',
    countryCode: 'my',
    description: 'Un melting-pot culturel au cœur de l\'Asie du Sud-Est. Tours Petronas et jungle urbaine.',
    imageUrl: '/images/destinations/Malaisie.png',
    stats: [
      { label: 'Durée', value: '1 semaine' },
      { label: 'Saison', value: 'Toute l\'année' },
      { label: 'Vibe', value: 'Tropical' }
    ]
  }
]
