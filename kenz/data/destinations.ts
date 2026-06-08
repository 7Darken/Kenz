import { type Localized } from "@/i18n/localize";

export type Destination = {
  id: number;
  slug: string;
  name: string;
  country: Localized;
  countryCode: string;
  description: Localized;
  imageUrl: string;
  stats: {
    label: Localized;
    value: Localized;
  }[];
  gallery?: string[];
}

export const destinations: Destination[] = [
  {
    id: 1,
    slug: 'japon',
    name: 'Tokyo & Kyoto',
    country: { fr: 'Japon', en: 'Japan' },
    countryCode: 'jp',
    description: {
      fr: "Une immersion entre tradition millénaire et futurisme néon. Des temples zen aux quartiers électriques d'Akihabara.",
      en: "An immersion between age-old tradition and neon futurism. From zen temples to the electric streets of Akihabara.",
    },
    imageUrl: '/images/destinations/Japon.webp',
    stats: [
      { label: { fr: 'Durée', en: 'Duration' }, value: { fr: '3 semaines', en: '3 weeks' } },
      { label: { fr: 'Saison', en: 'Season' }, value: { fr: 'Printemps', en: 'Spring' } },
      { label: { fr: 'Vibe', en: 'Vibe' }, value: { fr: 'Cyberpunk', en: 'Cyberpunk' } }
    ]
  },
  {
    id: 2,
    slug: 'islande',
    name: 'South Coast',
    country: { fr: 'Islande', en: 'Iceland' },
    countryCode: 'is',
    description: {
      fr: 'Terre de glace et de feu. Cascades géantes, plages de sable noir et aurores boréales.',
      en: 'Land of ice and fire. Giant waterfalls, black-sand beaches and northern lights.',
    },
    imageUrl: '/images/destinations/Islande.webp',
    stats: [
      { label: { fr: 'Durée', en: 'Duration' }, value: { fr: '10 jours', en: '10 days' } },
      { label: { fr: 'Saison', en: 'Season' }, value: { fr: 'Hiver', en: 'Winter' } },
      { label: { fr: 'Vibe', en: 'Vibe' }, value: { fr: 'Nature', en: 'Nature' } }
    ]
  },
  {
    id: 3,
    slug: 'chine',
    name: 'Shanghai & Beijing',
    country: { fr: 'Chine', en: 'China' },
    countryCode: 'cn',
    description: {
      fr: 'La grandeur de la Grande Muraille et la modernité vertigineuse des gratte-ciels.',
      en: 'The grandeur of the Great Wall and the dizzying modernity of the skyscrapers.',
    },
    imageUrl: '/images/destinations/Chine.webp',
    stats: [
      { label: { fr: 'Durée', en: 'Duration' }, value: { fr: '2 semaines', en: '2 weeks' } },
      { label: { fr: 'Saison', en: 'Season' }, value: { fr: 'Automne', en: 'Autumn' } },
      { label: { fr: 'Vibe', en: 'Vibe' }, value: { fr: 'Urbain', en: 'Urban' } }
    ]
  },
  {
    id: 4,
    slug: 'coree',
    name: 'Seoul',
    country: { fr: 'Corée du Sud', en: 'South Korea' },
    countryCode: 'kr',
    description: {
      fr: 'K-Pop, Street Food et Palais Royaux. Une ville qui ne dort jamais.',
      en: 'K-Pop, street food and royal palaces. A city that never sleeps.',
    },
    imageUrl: '/images/destinations/Coree.webp',
    stats: [
      { label: { fr: 'Durée', en: 'Duration' }, value: { fr: '2 semaines', en: '2 weeks' } },
      { label: { fr: 'Saison', en: 'Season' }, value: { fr: 'Été', en: 'Summer' } },
      { label: { fr: 'Vibe', en: 'Vibe' }, value: { fr: 'Dynamique', en: 'Dynamic' } }
    ]
  },
  {
    id: 5,
    slug: 'malaisie',
    name: 'Kuala Lumpur',
    country: { fr: 'Malaisie', en: 'Malaysia' },
    countryCode: 'my',
    description: {
      fr: "Un melting-pot culturel au cœur de l'Asie du Sud-Est. Tours Petronas et jungle urbaine.",
      en: 'A cultural melting pot in the heart of Southeast Asia. Petronas Towers and urban jungle.',
    },
    imageUrl: '/images/destinations/Malaisie.webp',
    stats: [
      { label: { fr: 'Durée', en: 'Duration' }, value: { fr: '1 semaine', en: '1 week' } },
      { label: { fr: 'Saison', en: 'Season' }, value: { fr: "Toute l'année", en: 'Year-round' } },
      { label: { fr: 'Vibe', en: 'Vibe' }, value: { fr: 'Tropical', en: 'Tropical' } }
    ]
  }
]
