export type ProjectLink = {
  label: string;
  href: string;
  title?: string;
  icon?: string;
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
        href: "https://kenz.blog/nebula",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.png",
      },
      { label: "Tiktok",
        href: "https://kenz.blog/nebula",
        title: "+1 abonnés",
        icon: "/images/icons/tiktok_white.png", },
    ],
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
  },
  
];
