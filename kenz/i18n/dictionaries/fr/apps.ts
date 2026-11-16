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
    /** Son nom quand on la fait défiler soi-même (mouvement réduit) : `{app}` est le nom du site. */
    view: "{app}\u00a0: la page d’accueil, à faire défiler",
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
    /** La recette de la démo de l'app, avec ses textes (Oshii, locales/fr/onboarding.json). */
    oshii: {
      caption: "Tarte aux cookies Nutella à la cuillère 🍫 Recette complète en vidéo !",
      shareTo: "Partager vers",
      recipe: "Tarte aux cookies Nutella à la cuillère",
      /** « {n} » est remplacé par le nombre (de minutes, de parts, d'étapes). */
      time: "{n} min",
      servings: "{n} parts",
      ingredientsTitle: "Ingrédients",
      ingredients: {
        flour: "Farine",
        butter: "Beurre",
        chocolate: "Pépites de chocolat",
        brownSugar: "Sucre roux",
      },
      steps: "{n} étapes",
    },
    sago: {
      /** La phrase de l'essai de l'app (お茶をください), traduite. */
      translation: "Un thé, s’il vous plaît.",
    },
    wado: {
      protein: "Protéines",
      carbs: "Glucides",
      fat: "Lipides",
      day: "Ta journée",
      /** Les unités de l'app : les grammes d'une macro, l'énergie d'un plat et de la journée. */
      gram: "g",
      kcal: "kcal",
    },
    croc: {
      /** Le compteur de l'accueil de l'app, et son unité (« 12 j »). */
      clean: "Sans mordre",
      unit: "j",
      /** L'anneau du pacte, comme dans l'app : son titre puis le mot en son centre, à chaque étape. */
      commit: "Je m’engage",
      committed: "Promesse faite",
      kept: "Pacte tenu",
      hold: "Maintiens",
      engaged: "Engagé",
      held: "Tenu",
      morning: "Matin",
      evening: "Soir",
      /** Les initiales des jours, du lundi au dimanche (séparées par des espaces). */
      week: "L M M J V S D",
      bravo: "Cette série tient. Bravo.",
    },
    miru: {
      theme: "Thème",
      typed: "Les films des années 2000",
      /** L'invitation de l'écran « Passe le téléphone » de l'app : glisser vers le haut pour voir sa carte. */
      swipe: "Glisse",
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
    /** Les textes du site (vouvoiement) : la 2e des 12 phrases du test, puis la carte postale du résultat. */
    escapades: {
      question: "J’aime essayer des choses nouvelles : plats, activités, lieux.",
      yourProfile: "Votre profil",
      profile: "Aventurier",
    },
  },
};

export type AppsDictionary = typeof apps;
