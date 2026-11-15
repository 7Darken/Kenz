/**
 * Pages des apps (`/apps/[slug]`, features/app-detail) : les libellés du récit en 7 chapitres, les dates dites
 * en mots, et les textes des animations « Comment ça marche » (données d'exemple, marquées comme telles).
 * L'histoire de chaque app (accroche, problème, étapes, captures…) est dans `content/apps.ts`.
 * `{app}` : le nom de l'app. `*mot*` : le mot en Instrument Serif.
 */
export const apps = {
  meta: {
    title: "Kenz — {app}",
    description:
      "Une app de Kenz racontée en entier : le problème, comment ça marche, ce que fait l’IA, et l’app en vrai.",
  },
  arrival: {
    scrollDown: "Descendre dans l’histoire",
  },
  how: {
    title: "Comment ça marche",
  },
  ai: {
    title: "L’IA, en clair",
    engine: "Sous le capot",
    chain: "La chaîne",
    fallback: "Si ça coince",
    takeaway: "Ce que j’en retiens",
    challenges: "Les défis",
  },
  weekend: {
    /** « 1re place » : le rang et son suffixe viennent du contenu. */
    place: "place",
    line: "Au Startup Weekend Grenoble, parmi de nombreuses *équipes*.",
    caption: "54 heures, devant un jury, {dates}.",
  },
  real: {
    title: "En vrai",
    since: "Sur l’App Store depuis {date}.",
    sinceFirst: "Sur l’App Store depuis {date} : c’est ma première app.",
    version: "Version {version}, mise à jour {when}.",
    versionFirst: "Version {version}.",
    today: "aujourd’hui",
    yesterday: "hier",
    daysAgo: "il y a {n} jours",
    monthsAgo: "il y a {n} mois",
    on: "le {date}",
    /** La fenêtre de navigateur d'Escapades Libres : l'état du site. */
    online: "en ligne",
  },
  action: {
    title: "À toi d’*essayer*.",
    site: "Le site de {app}",
    webTitle: "Le site est en *ligne*.",
    seeSite: "Voir le site",
  },
  next: {
    label: "L’histoire suivante",
    caption: "L’histoire suivante : {app}",
  },
  /** Les animations de « Comment ça marche ». */
  scenes: {
    sample: "exemple",
    oshii: {
      caption: "pâtes crémeuses au citron",
      shareTo: "Partager vers",
      recipe: "Pâtes crémeuses au citron",
      ingredients: {
        pasta: "Pâtes",
        parmesan: "Parmesan",
        lemon: "Citron",
        cream: "Crème",
      },
      steps: "4 étapes",
    },
    sago: {
      translation: "J’aime les chats.",
    },
    wado: {
      protein: "Protéines",
      carbs: "Glucides",
      fat: "Lipides",
      day: "Ta journée",
    },
    croc: {
      streak: "Série",
      days: "jours",
      morning: "Matin",
      commit: "Je m’engage",
      evening: "Soir",
      kept: "Tenu",
      /** Les initiales des jours, du lundi au dimanche (séparées par des espaces). */
      week: "L M M J V S D",
      bravo: "Cette série tient. Bravo.",
    },
    miru: {
      theme: "Thème",
      typed: "Les films des années 2000",
    },
    zenko: {
      budget: "Budget",
      /** Le montant et sa devise : « {n} » est remplacé par le chiffre (le curseur), « € » est plus petit. */
      amount: "{n} €",
      min: "0 €",
      max: "50 €",
      morning: "Matin",
      afternoon: "Après-midi",
      evening: "Soir",
    },
    escapades: {
      profile: "Aventurier",
    },
  },
};

export type AppsDictionary = typeof apps;
