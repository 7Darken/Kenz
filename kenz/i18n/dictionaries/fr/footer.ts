/**
 * Pied de page (features/footer). Trois univers : pro, createur, k15ze.
 * Le pied de page ne nomme jamais l'autre univers (Pro <-> Créateur).
 */
export const footer = {
  label: "Pied de page",
  navLabel: "Navigation",
  socialLabel: "Réseaux",
  copyright: "© {year} Kenz",
  pro: {
    phrase: "Je construis des apps où l’IA fait le vrai travail.",
    apps: "Mes apps",
    escapades: "Escapades Libres",
    agents: "Agents IA",
    contact: "Contact",
  },
  createur: {
    phrase: "Je voyage en Asie, je m’entraîne entre deux voyages, et je te raconte tout.",
    voyage: "Le voyage",
    sport: "Le sport",
    brands: "Marques & collaborations",
    youtubeK15ze: "YouTube k15ze",
  },
  k15ze: {
    phrase: "En sèche, je mange plaisir et copieux : des recettes simples, aux doses exactes.",
    partage: "Ce que je partage",
    courses: "Mes courses",
    createur: "Toute ma création de contenu",
  },
};

export type FooterDictionary = typeof footer;
