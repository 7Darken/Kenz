export interface Destination {
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export const destinations: Destination[] = [
  {
    name: "Chine",
    description: "Temples ancestraux, futurisme hypnotique et cuisine d'exception sur ",
    imageUrl: "/images/destinations/chine.png",
    slug: "chine",
  },
  {
    name: "Malaisie",
    description: "Souks colorés, montagnes de l'Atlas et dunes dorées: une mosaïque ",
    imageUrl: "/images/destinations/malaisie.png",
    slug: "malaisie",
  },
  {
    name: "Islande",
    description: "Geysers, volcans et aurores boréales au cœur d'une nature brute et mystique.",
    imageUrl: "/images/destinations/islande.png",
    slug: "islande",
  },
  {
    name: "Corée du sud",
    description: "Plages turquoise, jungle luxuriante et street-food épicée pour une immersion",
    imageUrl: "/images/destinations/Coree.png",
    slug: "coree-du-sud",
  },
  {
    name: "Japon",
    description: "Plages turquoise, jungle luxuriante et street-food épicée pour une immersion",
    imageUrl: "/images/destinations/japon.png",
    slug: "japon",
  }
];
