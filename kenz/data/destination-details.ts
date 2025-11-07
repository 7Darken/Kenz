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
  chine: {
    slug: "chine",
    heroImage: "/images/destinations/chine.png",
    badge: "中国",
    title: "CHINE",
    subtitle: "Dynasties, innovation et contrastes infinis",
    description:
      "Des ruelles ancestrales de Pékin aux skylines futuristes de Shanghai, explorez un pays où traditions immémoriales et modernité fulgurante cohabitent à chaque instant.",
    highlights: [
      {
        name: "Pékin",
        tagline: "Plongez dans l'histoire impériale",
        imageUrl: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=360&q=80",
      },
     
      {
        name: "Chongqing",
        tagline: "Glissez entre les pics karstiques",
        imageUrl: "https://images.unsplash.com/photo-1560148387-b80dae69823d?auto=format&fit=crop&w=360&q=80",
      },
    ],
  },
  "malaisie": {
    slug: "malaisie",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80",
    badge: "ماليزيا",
    title: "MALAISIE",
    subtitle: "Jungle luxuriante et villes scintillantes",
    description:
      "Un kaléidoscope de cultures et de paysages où se mêlent plages tropicales, forêts primaires et métropoles vibrantes.",
    highlights: [
      {
        name: "Kuala Lumpur",
        tagline: "Vibrez sous les tours Petronas",
        imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Langkawi",
        tagline: "Escapade sur des eaux turquoise",
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Penang",
        tagline: "Savourez la gastronomie Peranakan",
        imageUrl: "https://images.unsplash.com/photo-1554979905-8a3e7e4c39af?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Bornéo",
        tagline: "Rencontrez la canopée sauvage",
        imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=360&q=80",
      },
    ],
  },
  "islande": {
    slug: "islande",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    badge: "ÍSLAND",
    title: "ISLANDE",
    subtitle: "Terre de feu, de glace et d'aurores",
    description:
      "Voyagez aux confins d'une nature brute où glaciers étincelants, volcans actifs et cascades vertigineuses composent un décor irréel.",
    highlights: [
      {
        name: "Reykjavík",
        tagline: "Ressentez l'énergie nordique",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Golden Circle",
        tagline: "Marchez entre les plaques tectoniques",
        imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Lagune glaciaire",
        tagline: "À la dérive parmi les icebergs",
        imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Vik",
        tagline: "Surplombez les plages de sable noir",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=360&q=80",
      },
    ],
  },
  "coree-du-sud": {
    slug: "coree-du-sud",
    heroImage: "https://images.unsplash.com/photo-1526481280695-3c4693f67309?auto=format&fit=crop&w=1800&q=80",
    badge: "대한민국",
    title: "CORÉE DU SUD",
    subtitle: "Entre pop culture et temples majestueux",
    description:
      "Du dynamisme high-tech de Séoul aux villages hanoks préservés, découvrez une scène créative effervescente adossée à des traditions séculaires.",
    highlights: [
      {
        name: "Séoul",
        tagline: "Naviguez entre palaces et néons",
        imageUrl: "https://images.unsplash.com/photo-1553245077-747ef2b29b17?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Busan",
        tagline: "Respirez l'air iodé des collines",
        imageUrl: "https://images.unsplash.com/photo-1526481280695-3c4693f67309?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Jeju",
        tagline: "Découvrez l'île de beauté",
        imageUrl: "https://images.unsplash.com/photo-1526481280695-3c4693f67309?auto=format&fit=crop&w=360&q=80",
      },
    ],
  },
  "japon": {
    slug: "japon",
    heroImage: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1800&q=80",
    badge: "日本国",
    title: "JAPON",
    subtitle: "Le pays du soleil levant entre tradition et avant-garde",
    description:
      "Admirez la poésie des temples ancestraux, découvrez l'innovation de mégalopoles luminescentes et laissez-vous porter par une culture d'exception.",
    highlights: [
      {
        name: "Tokyo",
        tagline: "Get into the future",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Kyoto",
        tagline: "Turn back the time",
        imageUrl: "https://images.unsplash.com/photo-1526481280695-3c4693f67309?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Osaka",
        tagline: "Get impressed by street food",
        imageUrl: "https://images.unsplash.com/photo-1494599931304-3f80f0f7b655?auto=format&fit=crop&w=360&q=80",
      },
      {
        name: "Nara",
        tagline: "Make friends with nature",
        imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=360&q=80",
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
