export type ProjectLink = {
  label: string;
  href: string;
  title?: string;
  icon?: string;
};

export type ProjectStat = {
  label: string;
  value: string;
  description?: string;
  accentColor?: string;
  icon?: string;
};

export type ProjectDetail = {
  headline: string;
  subheadline?: string;
  overview: string[];
  stats: ProjectStat[];
  tags?: string[];
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  period: string;
  description: string;
  thumbnail: string;
  liveUrl?: string;
  repoUrl?: string;
  socials?: ProjectLink[];
  glowColor?: string;
  screenshots?: string[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "oshii",
    name: "Oshii Recettes réseaux",
    period: "2025 · App mobile",
    description:
      "Garde toutes tes recettes TikTok au même endroit Oshii convertit les vidéos en vraies recettes prêtes à cuisiner !",
    thumbnail: "/images/projects/oshii/icon.webp",
    glowColor: "#ff2330",
    screenshots: [
      "/images/projects/oshii/screenshots/460x996bb.webp",
      "/images/projects/oshii/screenshots/460x996bb (1).webp",
      "/images/projects/oshii/screenshots/460x996bb (2).webp",
      "/images/projects/oshii/screenshots/460x996bb (3).webp",
      "/images/projects/oshii/screenshots/460x996bb (4).webp",
    ],
    liveUrl: "https://www.oshii.fr/",

    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
      {
        label: "Tiktok",
        href: "https://kenz.blog/nebula",
        title: "+1 abonnés",
        icon: "/images/icons/tiktok_white.webp",
      },
    ],
    detail: {
      headline: "La cuisine virale devient réellement accessible",
      subheadline:
        "Oshii transforme les recettes vues sur les réseaux en fiches prêtes à cuisiner, avec ingrédients, étapes et minuteur intégré.",
      overview: [
        "Synchronisation directe avec TikTok pour sauvegarder les vidéos et générer des recettes structurées.",
        "Expérience gamifiée avec objectifs hebdomadaires et suivi de progression culinaire.",
        "Outils collaboratifs pour partager des listes d'ingrédients et préparer les recettes à plusieurs.",
      ],
      stats: [
        {
          label: "Taux d'engagement",
          value: "40%",
          description: "Sessions hebdo sur l'app",
          accentColor: "#fbbf24",
        },
        {
          label: "Note moyenne",
          value: "4.9",
          description: "App Store sur 1 200 avis",
          accentColor: "#f472b6",
        },
        {
          label: "Créateurs connectés",
          value: "280+",
          description: "Recettes importées automatiquement",
          accentColor: "#34d399",
        },
        {
          label: "Téléchargements",
          value: "12k",
          description: "Sur les 3 premiers mois",
          accentColor: "#60a5fa",
        },
      ],
    },
  },
  {
    id: 2,
    slug: "zenko",
    name: "Zenko Croque le monde",
    period: "2025 · App mobile",
    description:
      "Ton compagnon de voyage intelligent,des programmes quotidiens personnalisés adaptés à vos envies et à votre budget.",
    thumbnail: "/images/projects/zenko/icon.webp",
    glowColor: "#944f29",
    screenshots: [
      "/images/projects/zenko/screenshots/Simulator Screenshot - iPhone 16 - 2025-10-07 at 14.51.22.webp",
      "/images/projects/zenko/screenshots/simulator_screenshot_0F87DCF3-7B95-49D6-A78C-14F2DAC1B13E.webp",
      "/images/projects/zenko/screenshots/simulator_screenshot_2AFCECC9-DC68-4C66-9685-EF373A9913FD.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/ch/app/zenko/id6753706200?l=fr-FR",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
      {
        label: "Tiktok",
        href: "https://www.tiktok.com/@7kinze",
        title: "+10K abonnés",
        icon: "/images/icons/tiktok_white.webp",
      },
    ],
    detail: {
      headline: "Ton copilote de voyage personnalisé",
      subheadline:
        "Zenko compose des itinéraires intelligents selon ton budget, la météo et tes préférences culinaires, tout en te mettant en relation avec les commerces locaux.",
      overview: [
        "Agrégation de données météo, transports et évènements en temps réel pour ajuster l'agenda quotidien.",
        "Assistant IA conversationnel qui suggère restaurants, activités et bons plans adaptés à ton mood.",
        "Module d'offres locales avec cashback intégré pour stimuler les commerces partenaires.",
      ],
      stats: [
        {
          label: "Taux de rétention",
          value: "63%",
          description: "Utilisateurs actifs sur 30 jours",
          accentColor: "#22d3ee",
        },
        {
          label: "Itinéraires générés",
          value: "18k",
          description: "Planifications tout pays",
          accentColor: "#f97316",
        },
        {
          label: "Commerces partenaires",
          value: "460",
          description: "Offres locales connectées",
          accentColor: "#a855f7",
        },
        {
          label: "Note utilisateur",
          value: "4.7",
          description: "Sur le store & beta testers",
          accentColor: "#4ade80",
        },
      ],
    },
  },
  {
    id: 3,
    slug: "sago",
    name: "Sago",
    period: "2025 · App mobile",
    description:
      "Apprends le japonais de manière intuitive avec des leçons interactives, du vocabulaire contextuel et un suivi de progression personnalisé.",
    thumbnail: "/images/projects/sago/icon.webp",
    glowColor: "#e74c6f",
    liveUrl: "https://sago-landing.vercel.app/",
    screenshots: [
      "/images/projects/sago/screenshots/preview-1.webp",
      "/images/projects/sago/screenshots/preview-2.webp",
      "/images/projects/sago/screenshots/preview-3.webp",
      "/images/projects/sago/screenshots/preview-4.webp",
      "/images/projects/sago/screenshots/preview-5.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/fr/app/id6759610780",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
    ],
    detail: {
      headline: "Le japonais, simplifié",
      subheadline:
        "Sago rend l'apprentissage du japonais accessible avec des leçons courtes, de la reconnaissance de caractères et un système de répétition espacée.",
      overview: [
        "Leçons interactives couvrant hiragana, katakana et kanji avec progression adaptative.",
        "Système de répétition espacée intelligent pour ancrer le vocabulaire sur le long terme.",
        "Exercices contextuels basés sur des situations réelles de voyage et de conversation.",
      ],
      stats: [
        {
          label: "Caractères",
          value: "2000+",
          description: "Kanji et kana disponibles",
          accentColor: "#e74c6f",
        },
        {
          label: "Leçons",
          value: "150+",
          description: "Du débutant à l'avancé",
          accentColor: "#8b5cf6",
        },
        {
          label: "Rétention",
          value: "85%",
          description: "Grâce à la répétition espacée",
          accentColor: "#06b6d4",
        },
        {
          label: "Temps moyen",
          value: "10min",
          description: "Par session quotidienne",
          accentColor: "#f59e0b",
        },
      ],
    },
  },
  {
    id: 4,
    slug: "miru",
    name: "Miru: Imposteur Loup Garou",
    period: "2026 · App mobile",
    description:
      "Le jeu party entre amis ou en famille : imposteur, loup-garou et mini-jeux en ligne, avec des catégories animes, nourriture, acteurs et bien plus.",
    thumbnail: "/images/projects/miru/icon.webp",
    glowColor: "#7c3aed",
    liveUrl: "https://v0-miru-website.vercel.app/",
    screenshots: [
      "/images/projects/miru/screenshots/untitled-project-1242x2688.webp",
      "/images/projects/miru/screenshots/untitled-project-1242x2688 (1).webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.27.19.webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.29.59.webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.30.20.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/ch/app/id6761622088",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
    ],
    detail: {
      headline: "Le jeu party à partager entre amis ou en famille",
      subheadline:
        "Miru réunit tes proches autour de parties d'imposteur, de loup-garou et de mini-jeux en ligne, avec un catalogue de catégories prêtes à l'emploi.",
      overview: [
        "Rooms multijoueur en ligne pour rejoindre tes amis ou ta famille où qu'ils soient et lancer une partie en quelques secondes.",
        "Modes imposteur, loup-garou et mini-jeux animés par une belle variété de catégories : animes, nourriture, acteurs, et bien plus.",
        "Fonctionnalité clé : crée tes propres catégories personnalisées assistées par IA pour des parties 100% à ton image.",
      ],
      stats: [
        {
          label: "Modes de jeu",
          value: "15+",
          description: "Imposteur, loup-garou & mini-jeux",
          accentColor: "#a855f7",
        },
        {
          label: "Joueurs par room",
          value: "12",
          description: "En ligne et en simultané",
          accentColor: "#22d3ee",
        },
        {
          label: "Rôles uniques",
          value: "30+",
          description: "Pour varier chaque partie",
          accentColor: "#f472b6",
        },
        {
          label: "Catégories",
          value: "20+",
          description: "Animes, nourriture, acteurs… + IA perso",
          accentColor: "#facc15",
        },
      ],
    },
  },
];
