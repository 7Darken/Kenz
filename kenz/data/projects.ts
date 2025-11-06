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
    thumbnail: "/images/projects/Oshii_dark.png",
    glowColor: "#ff2330",
    liveUrl: "https://nebula.app",

    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.png",
      },
      { label: "Tiktok",
        href: "https://kenz.blog/nebula",
        title: "+1 abonnés",
        icon: "/images/icons/tiktok_white.png", },
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
      tags: ["App mobile", "React Native", "NestJS", "AI ingredients"],
    },
  },
  {
    id: 2,
    slug: "zenko",
    name: "Zenko Croque le monde",
    period: "2025 · App mobile",
    description:
      "Ton compagnon de voyage intelligent,des programmes quotidiens personnalisés adaptés à vos envies et à votre budget.",
    thumbnail: "/images/projects/Zenko.png",
    glowColor: "#944f29",
    liveUrl: "https://orbit.app",
     socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/ch/app/zenko/id6753706200?l=fr-FR",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.png",
      },
      { label: "Tiktok",
        href: "https://www.tiktok.com/@7kinze",
        title: "+10K abonnés",
        icon: "/images/icons/tiktok_white.png", },
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
      tags: ["Travel", "AI", "Next.js", "Cloudflare Workers"],
    },
  },

];
