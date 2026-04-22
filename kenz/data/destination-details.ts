export interface DestinationHighlight {
  name: string;
  tagline: string;
  imageUrl: string;
}

export interface DestinationDetail {
  slug: string;
  heroImage: string;
  badge?: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: DestinationHighlight[];
}

export const destinationDetails: Record<string, DestinationDetail> = {
  japon: {
    slug: "japon",
    heroImage: "/images/destinations/Japon.webp",
    badge: "日本国",
    title: "JAPON",
    subtitle: "Le pays du soleil levant entre tradition et avant-garde",
    description:
      "Admirez la poésie des temples ancestraux, découvrez l'innovation de mégalopoles luminescentes et laissez-vous porter par une culture d'exception.",
    highlights: [
      {
        name: "Tokyo",
        tagline: "Plongée dans le futur",
        imageUrl: "https://images.unsplash.com/photo-JMD0K-kCJ5I?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Kyoto",
        tagline: "Les torii de Fushimi Inari",
        imageUrl: "https://images.unsplash.com/photo-MbkAh8PcSW0?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Osaka",
        tagline: "Dotonbori et le street food",
        imageUrl: "https://images.unsplash.com/photo-SMwAfgzj-VU?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Nara",
        tagline: "Les cerfs sacrés et les temples",
        imageUrl: "https://images.unsplash.com/photo-D-yZxa_G6wU?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  islande: {
    slug: "islande",
    heroImage: "/images/destinations/Islande.webp",
    badge: "ÍSLAND",
    title: "ISLANDE",
    subtitle: "Terre de feu, de glace et d'aurores",
    description:
      "Voyagez aux confins d'une nature brute où glaciers étincelants, volcans actifs et cascades vertigineuses composent un décor irréel.",
    highlights: [
      {
        name: "Reykjavík",
        tagline: "L'énergie de la capitale nordique",
        imageUrl: "https://images.unsplash.com/photo-6AqcE9pqq28?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Gullfoss",
        tagline: "La cascade dorée du Golden Circle",
        imageUrl: "https://images.unsplash.com/photo-e3Zr8SGrUNw?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Jökulsárlón",
        tagline: "La lagune aux icebergs",
        imageUrl: "https://images.unsplash.com/photo-KZdEtGWK1Mk?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Reynisfjara",
        tagline: "Plage de sable noir",
        imageUrl: "https://images.unsplash.com/photo-FV7NJ-bSH6o?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  chine: {
    slug: "chine",
    heroImage: "/images/destinations/Chine.webp",
    badge: "中国",
    title: "CHINE",
    subtitle: "Dynasties, innovation et contrastes infinis",
    description:
      "Des ruelles ancestrales de Pékin aux skylines futuristes de Shanghai, explorez un pays où traditions immémoriales et modernité fulgurante cohabitent à chaque instant.",
    highlights: [
      {
        name: "Shanghai",
        tagline: "Le skyline du Bund",
        imageUrl: "https://images.unsplash.com/photo-NldT0B6aKrI?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Pékin",
        tagline: "La Grande Muraille",
        imageUrl: "https://images.unsplash.com/photo-hB_nkwIw5f4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Chongqing",
        tagline: "La ville illuminée la nuit",
        imageUrl: "https://images.unsplash.com/photo-M0E7RreVgtI?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  "coree-du-sud": {
    slug: "coree-du-sud",
    heroImage: "/images/destinations/Coree.webp",
    badge: "대한민국",
    title: "CORÉE DU SUD",
    subtitle: "Entre pop culture et temples majestueux",
    description:
      "Du dynamisme high-tech de Séoul aux villages hanoks préservés, découvrez une scène créative effervescente adossée à des traditions séculaires.",
    highlights: [
      {
        name: "Séoul",
        tagline: "Néons, palais et K-culture",
        imageUrl: "https://images.unsplash.com/photo-0njBEcQmbk4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Busan",
        tagline: "Le village coloré de Gamcheon",
        imageUrl: "https://images.unsplash.com/photo-5ITi3WdzZ8Y?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Jeju",
        tagline: "L'île volcanique paradisiaque",
        imageUrl: "https://images.unsplash.com/photo-RjD376jWJXQ?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  malaisie: {
    slug: "malaisie",
    heroImage: "/images/destinations/Malaisie.webp",
    badge: "ماليزيا",
    title: "MALAISIE",
    subtitle: "Jungle luxuriante et villes scintillantes",
    description:
      "Un kaléidoscope de cultures et de paysages où se mêlent plages tropicales, forêts primaires et métropoles vibrantes.",
    highlights: [
      {
        name: "Kuala Lumpur",
        tagline: "Les tours Petronas illuminées",
        imageUrl: "https://images.unsplash.com/photo-TDZKKlsJwCk?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Langkawi",
        tagline: "Le sky bridge au-dessus de la jungle",
        imageUrl: "https://images.unsplash.com/photo-Jh_Xk8RQtG0?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Penang",
        tagline: "Street art et gastronomie",
        imageUrl: "https://images.unsplash.com/photo-0dF2fJjTHCw?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Bornéo",
        tagline: "La jungle et les orangs-outans",
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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDestinationDetail(slug: string) {
  const normalizedSlug = normalizeDestinationSlug(slug);
  return destinationDetails[normalizedSlug];
}
