/**
 * La séquence « 54 heures » (Escapades Libres au Startup Weekend), sur l'accueil Pro (features/victoire).
 * Les faits (dates, ville, photos, plateforme) sont dans `content/startup-weekend.ts`.
 * `*mot*` : le mot en Instrument Serif. Aucun nom de personne de l'équipe.
 */
export const victoire = {
  sectionLabel: "Escapades Libres au Startup Weekend",
  /** Lu à la place du compteur, qui est décoratif. */
  clockLabel: "54 heures, du vendredi au dimanche.",
  crowd: {
    friday: "Vendredi soir, des dizaines d’*idées*.",
    teams: "Des équipes se *forment*.",
    sunday: "Dimanche, le jury en choisit *une*.",
    wallLabel:
      "Un mur de post-it de pitchs, chacun une idée ; des équipes se forment autour ; le projecteur s’arrête sur celui d’Escapades Libres.",
  },
  role: {
    listen: "J’écoute la *cliente*.",
    design: "Je conçois la solution : design et *UX*.",
    build: "Je développe un premier MVP en *24 heures*.",
    summary: "Du besoin du client au *produit*.",
    /** Le besoin, dans les mots du projet (la bulle). */
    quote: "« Trouver un voyage accessible, c’est possible. Trouver avec qui partir, beaucoup moins. »",
    colors: "Couleurs",
    text: "Texte",
    hours: "h",
  },
  win: {
    day: "Dimanche",
    pitch: "Le pitch, devant le jury.",
    /** « 1re place · Startup Weekend Grenoble · 2025 » (le rang et son suffixe viennent du contenu). */
    place: "place",
    live: "Aujourd’hui, elle est en *ligne*.",
    seePlatform: "Voir la plateforme",
    discoverProject: "Découvrir le projet",
    podiumLabel: "Le podium : {project}, première place.",
    credit: "Photo : {credit}",
  },
};

export type VictoireDictionary = typeof victoire;
