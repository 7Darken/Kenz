import { type Localized } from "@/i18n/localize";

export interface DestinationHighlight {
  name: Localized;
  tagline: Localized;
  imageUrl: string;
}

export interface DestinationDetail {
  slug: string;
  heroImage: string;
  badge?: string;
  title: Localized;
  subtitle: Localized;
  description: Localized;
  highlights: DestinationHighlight[];
}

export const destinationDetails: Record<string, DestinationDetail> = {
  japon: {
    slug: "japon",
    heroImage: "/images/destinations/Japon.webp",
    badge: "日本国",
    title: { fr: "JAPON", en: "JAPAN" },
    subtitle: {
      fr: "Le pays du soleil levant entre tradition et avant-garde",
      en: "The land of the rising sun, between tradition and avant-garde",
    },
    description: {
      fr: "Admirez la poésie des temples ancestraux, découvrez l'innovation de mégalopoles luminescentes et laissez-vous porter par une culture d'exception.",
      en: "Admire the poetry of ancient temples, discover the innovation of luminescent megacities and let an exceptional culture carry you away.",
    },
    highlights: [
      {
        name: { fr: "Tokyo", en: "Tokyo" },
        tagline: { fr: "Plongée dans le futur", en: "A dive into the future" },
        imageUrl: "https://images.unsplash.com/photo-JMD0K-kCJ5I?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Kyoto", en: "Kyoto" },
        tagline: { fr: "Les torii de Fushimi Inari", en: "The torii of Fushimi Inari" },
        imageUrl: "https://images.unsplash.com/photo-MbkAh8PcSW0?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Osaka", en: "Osaka" },
        tagline: { fr: "Dotonbori et le street food", en: "Dotonbori and street food" },
        imageUrl: "https://images.unsplash.com/photo-SMwAfgzj-VU?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Nara", en: "Nara" },
        tagline: { fr: "Les cerfs sacrés et les temples", en: "Sacred deer and temples" },
        imageUrl: "https://images.unsplash.com/photo-D-yZxa_G6wU?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  islande: {
    slug: "islande",
    heroImage: "/images/destinations/Islande.webp",
    badge: "ÍSLAND",
    title: { fr: "ISLANDE", en: "ICELAND" },
    subtitle: {
      fr: "Terre de feu, de glace et d'aurores",
      en: "Land of fire, ice and auroras",
    },
    description: {
      fr: "Voyagez aux confins d'une nature brute où glaciers étincelants, volcans actifs et cascades vertigineuses composent un décor irréel.",
      en: "Travel to the edge of raw nature where sparkling glaciers, active volcanoes and dizzying waterfalls compose an unreal landscape.",
    },
    highlights: [
      {
        name: { fr: "Reykjavík", en: "Reykjavík" },
        tagline: { fr: "L'énergie de la capitale nordique", en: "The energy of the Nordic capital" },
        imageUrl: "https://images.unsplash.com/photo-6AqcE9pqq28?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Gullfoss", en: "Gullfoss" },
        tagline: { fr: "La cascade dorée du Golden Circle", en: "The golden waterfall of the Golden Circle" },
        imageUrl: "https://images.unsplash.com/photo-e3Zr8SGrUNw?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Jökulsárlón", en: "Jökulsárlón" },
        tagline: { fr: "La lagune aux icebergs", en: "The iceberg lagoon" },
        imageUrl: "https://images.unsplash.com/photo-KZdEtGWK1Mk?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Reynisfjara", en: "Reynisfjara" },
        tagline: { fr: "Plage de sable noir", en: "Black-sand beach" },
        imageUrl: "https://images.unsplash.com/photo-FV7NJ-bSH6o?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  chine: {
    slug: "chine",
    heroImage: "/images/destinations/Chine.webp",
    badge: "中国",
    title: { fr: "CHINE", en: "CHINA" },
    subtitle: {
      fr: "Dynasties, innovation et contrastes infinis",
      en: "Dynasties, innovation and endless contrasts",
    },
    description: {
      fr: "Des ruelles ancestrales de Pékin aux skylines futuristes de Shanghai, explorez un pays où traditions immémoriales et modernité fulgurante cohabitent à chaque instant.",
      en: "From the ancient alleys of Beijing to the futuristic skylines of Shanghai, explore a country where age-old traditions and blazing modernity coexist at every moment.",
    },
    highlights: [
      {
        name: { fr: "Shanghai", en: "Shanghai" },
        tagline: { fr: "Le skyline du Bund", en: "The Bund skyline" },
        imageUrl: "https://images.unsplash.com/photo-NldT0B6aKrI?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Pékin", en: "Beijing" },
        tagline: { fr: "La Grande Muraille", en: "The Great Wall" },
        imageUrl: "https://images.unsplash.com/photo-hB_nkwIw5f4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Chongqing", en: "Chongqing" },
        tagline: { fr: "La ville illuminée la nuit", en: "The city lit up at night" },
        imageUrl: "https://images.unsplash.com/photo-M0E7RreVgtI?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  "coree-du-sud": {
    slug: "coree-du-sud",
    heroImage: "/images/destinations/Coree.webp",
    badge: "대한민국",
    title: { fr: "CORÉE DU SUD", en: "SOUTH KOREA" },
    subtitle: {
      fr: "Entre pop culture et temples majestueux",
      en: "Between pop culture and majestic temples",
    },
    description: {
      fr: "Du dynamisme high-tech de Séoul aux villages hanoks préservés, découvrez une scène créative effervescente adossée à des traditions séculaires.",
      en: "From the high-tech energy of Seoul to the preserved hanok villages, discover a vibrant creative scene rooted in centuries-old traditions.",
    },
    highlights: [
      {
        name: { fr: "Séoul", en: "Seoul" },
        tagline: { fr: "Néons, palais et K-culture", en: "Neon, palaces and K-culture" },
        imageUrl: "https://images.unsplash.com/photo-0njBEcQmbk4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Busan", en: "Busan" },
        tagline: { fr: "Le village coloré de Gamcheon", en: "The colorful Gamcheon village" },
        imageUrl: "https://images.unsplash.com/photo-5ITi3WdzZ8Y?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Jeju", en: "Jeju" },
        tagline: { fr: "L'île volcanique paradisiaque", en: "The paradise volcanic island" },
        imageUrl: "https://images.unsplash.com/photo-RjD376jWJXQ?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  malaisie: {
    slug: "malaisie",
    heroImage: "/images/destinations/Malaisie.webp",
    badge: "ماليزيا",
    title: { fr: "MALAISIE", en: "MALAYSIA" },
    subtitle: {
      fr: "Jungle luxuriante et villes scintillantes",
      en: "Lush jungle and glittering cities",
    },
    description: {
      fr: "Un kaléidoscope de cultures et de paysages où se mêlent plages tropicales, forêts primaires et métropoles vibrantes.",
      en: "A kaleidoscope of cultures and landscapes blending tropical beaches, primary forests and vibrant metropolises.",
    },
    highlights: [
      {
        name: { fr: "Kuala Lumpur", en: "Kuala Lumpur" },
        tagline: { fr: "Les tours Petronas illuminées", en: "The illuminated Petronas Towers" },
        imageUrl: "https://images.unsplash.com/photo-TDZKKlsJwCk?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Langkawi", en: "Langkawi" },
        tagline: { fr: "Le sky bridge au-dessus de la jungle", en: "The sky bridge above the jungle" },
        imageUrl: "https://images.unsplash.com/photo-Jh_Xk8RQtG0?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Penang", en: "Penang" },
        tagline: { fr: "Street art et gastronomie", en: "Street art and gastronomy" },
        imageUrl: "https://images.unsplash.com/photo-0dF2fJjTHCw?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: { fr: "Bornéo", en: "Borneo" },
        tagline: { fr: "La jungle et les orangs-outans", en: "The jungle and the orangutans" },
        imageUrl: "https://images.unsplash.com/photo-85k0aAs1a94?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
};

export function normalizeDestinationSlug(slug: string) {
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  return decodedSlug
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDestinationDetail(slug: string) {
  const normalizedSlug = normalizeDestinationSlug(slug);
  return destinationDetails[normalizedSlug];
}
