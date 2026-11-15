/**
 * Univers Créateur, accueil (`/createur`) : la Terre, le voyage, le sport, me suivre.
 * Rempli par l'agent du module « Créateur accueil ».
 */
export const createur = {
  meta: {
    title: "Kenz — Créateur",
    description:
      "Kenz voyage en Asie et s’entraîne entre deux voyages : deux univers, le voyage et le sport, à suivre.",
  },
  /** Les chapitres de la barre « stories » de la nav (ids des sections : top, voyage, sport, suivre). */
  chapters: {
    top: "Kenz",
    voyage: "Le voyage",
    sport: "Le sport",
    suivre: "Me suivre",
  },
};

export type CreateurDictionary = typeof createur;
