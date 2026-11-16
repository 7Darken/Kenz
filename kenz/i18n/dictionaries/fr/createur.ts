/**
 * Univers Créateur, accueil (`/createur`) : la Terre, le voyage, le sport, me suivre.
 * Les escales elles-mêmes (pays, dates, séries) sont dans content/series.ts (ESCALES).
 */
export const createur = {
  meta: {
    title: "Kenz — Créateur",
    description:
      "Kenz voyage en Asie et s’entraîne entre deux voyages : deux univers, le voyage et le sport, à suivre.",
  },
  /** Les chapitres de la barre « stories » de la nav (ids des sections : top, voyage, sport, suivre). */
  chapters: {
    top: "Kenz",
    voyage: "Le voyage",
    sport: "Le sport",
    suivre: "Me suivre",
  },
  /** C0 : le hero partagé (features/hero), variante Créateur. */
  hero: {
    /** Le titre (et le nom du chapitre pour les lecteurs d'écran). */
    title: "Kenz",
    line: "Je voyage en Asie, je m’entraîne entre deux voyages, et je te raconte tout, *vraiment*.",
    down: "Partir avec moi",
    portraitAlt: "Kenz en t-shirt vert anis, le regard tourné vers l’horizon",
  },
  /** C1 : le trajet sur le globe, d'escale en escale. */
  voyage: {
    title: "Le voyage",
    /** `{count}` : le nombre de pays filmés (les escales passées). */
    sub: "{count} pays filmés, dans l’ordre des séries.",
    stopsLabel: "Les escales, un pays après l’autre",
    /** La liste compacte de l'écran statique (« vu une fois »). */
    pickLabel: "Les escales : choisis un pays, le globe tourne vers lui",
    next: "Prochaine escale",
    /** Nom accessible de la vignette d'une escale. */
    mediaLabel: "{country} : voir mes vidéos sur YouTube",
    youtube: "YouTube",
    door: "Entrer dans mes voyages",
  },
  /** C2 : le sport, l'univers k15ze en un écran. */
  sport: {
    universe: "k15ze · sport, nutrition, lifestyle",
    title: "Entre deux voyages, je m’*entraîne*.",
    door: "Entrer dans le sport",
  },
  /** C3 : me suivre, deux univers. */
  follow: {
    title: "Me suivre",
    lead: "Deux univers. Choisis le *tien*.",
    voyage: {
      who: "Kenz en Asie",
      title: "Le voyage",
      line: "L’Asie, et ce que ça coûte vraiment.",
      accounts: "Mes comptes voyage",
      note: "≈ 28 000 personnes me suivent sur TikTok.",
      enter: "Entrer dans mes voyages",
    },
    sport: {
      who: "k15ze",
      title: "Le sport",
      line: "En sèche, je mange plaisir et copieux : des recettes simples, aux doses exactes.",
      accounts: "Mes comptes sport",
      note: "Ni coach, ni expert. Je partage ce qui marche pour moi.",
      enter: "Entrer dans le sport",
      /** Dans l'arche du sport : « 8 km », le chiffre en vert. */
      kmValue: "8",
      kmUnit: "km",
    },
  },
};

export type CreateurDictionary = typeof createur;
