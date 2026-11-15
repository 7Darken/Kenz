/**
 * Page Sport (`/createur/sport`), identité k15ze : la promesse, ce que je partage, mes courses, me suivre.
 * Le bloc `courses` sert aussi au module features/courses (l'aperçu de /createur). Rien sur l'Asie ni le voyage.
 */
export const sport = {
  meta: {
    title: "k15ze",
    description:
      "En sèche, je mange plaisir et copieux : des recettes simples, aux doses exactes. Et mes courses.",
  },
  hero: {
    cap: "Sport, nutrition, lifestyle, et mes courses",
    mark: "k15ze",
    promise: "En sèche, je mange plaisir et *copieux* : des recettes simples, aux doses exactes.",
    tone: "Ni coach, ni expert. Je partage ce qui marche pour moi, sans conseil médical.",
    youtube: "La chaîne YouTube",
    toCourses: "Mes courses",
  },
  partage: {
    title: "Ce que je partage",
    duration: "15–45 s",
    formats: "Des Shorts verticaux, et des carrousels.",
  },
  courses: {
    title: "Mes courses",
    sub: "Les courses que j’ai faites, et ce que j’apprends en ce moment.",
    ongoing: "en cours",
    open: "Voir le détail",
    /** Nom accessible du bouton : « Voir le détail : HYROX » */
    openLabel: "Voir le détail : {course}",
    watch: "Regarder la vidéo",
    /** Nom accessible d'une vignette : « Agrandir la photo : <description> » */
    zoomIn: "Agrandir la photo : {photo}",
    zoomOut: "Réduire la photo",
    date: {
      months: [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ],
      /** « 31 mai 2025 » */
      day: "{day} {month} {year}",
      /** Le premier du mois : « 1er mai 2025 » */
      firstDay: "1er",
      /** « juin 2025 » (la majuscule est posée seule en début de ligne) */
      month: "{month} {year}",
      /** Une course en cours, depuis un jour précis : « Depuis le 14 octobre 2026 » */
      since: "Depuis le {date}",
      /** En cours, depuis un mois ou une année : « Depuis juin 2025 » */
      sinceMonth: "Depuis {date}",
    },
  },
  suivre: {
    title: "Me suivre",
    accounts: "Mes comptes sport",
  },
  retour: {
    label: "Revenir à ma création de contenu",
    door: "Toute ma création de contenu",
  },
};

export type SportDictionary = typeof sport;
