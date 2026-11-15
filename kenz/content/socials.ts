/**
 * Les comptes publics de Kenz, par univers (source : maquettes/_shared/content.js → KENZ.reseaux,
 * seulement ceux à afficher). Pro et Créateur ne se citent jamais l'un l'autre.
 */
import type { SocialNetwork } from "@/design-system/components/social-icon";
import type { Localized } from "@/i18n/localize";

export const SOCIAL_IDS = ["github", "linkedin", "youtube-asie", "tiktok-asie", "instagram-asie", "youtube-k15ze"] as const;
export type SocialId = (typeof SOCIAL_IDS)[number];

/** L'univers d'un compte : pro, le voyage (Kenz en Asie) ou le sport (k15ze). */
export type SocialUniverse = "pro" | "voyage" | "k15ze";

export interface Social {
  id: SocialId;
  network: SocialNetwork;
  universe: SocialUniverse;
  href: `https://${string}`;
  /** Nom du réseau, tel qu'affiché (« YouTube »). */
  label: string;
  /** Le nom du compte ou de la chaîne (« Kenz in Asia », « @kenzvoyage_enbien »). */
  account?: string;
  /** Nom accessible complet, ex. « YouTube : Kenz in Asia ». */
  ariaLabel: Localized<string>;
}

export const SOCIALS: Readonly<Record<SocialId, Social>> = {
  github: {
    id: "github",
    network: "github",
    universe: "pro",
    href: "https://github.com/7Darken",
    label: "GitHub",
    ariaLabel: { fr: "GitHub", en: "GitHub" },
  },
  linkedin: {
    id: "linkedin",
    network: "linkedin",
    universe: "pro",
    href: "https://www.linkedin.com/in/kenz-narainen/",
    label: "LinkedIn",
    ariaLabel: { fr: "LinkedIn", en: "LinkedIn" },
  },
  "youtube-asie": {
    id: "youtube-asie",
    network: "youtube",
    universe: "voyage",
    href: "https://www.youtube.com/@7Kinze",
    label: "YouTube",
    account: "Kenz in Asia",
    ariaLabel: { fr: "YouTube : Kenz in Asia", en: "YouTube: Kenz in Asia" },
  },
  "tiktok-asie": {
    id: "tiktok-asie",
    network: "tiktok",
    universe: "voyage",
    href: "https://www.tiktok.com/@7kinze",
    label: "TikTok",
    account: "En Bien en Asie",
    ariaLabel: { fr: "TikTok : En Bien en Asie", en: "TikTok: En Bien en Asie" },
  },
  "instagram-asie": {
    id: "instagram-asie",
    network: "instagram",
    universe: "voyage",
    href: "https://www.instagram.com/kenzvoyage_enbien/",
    label: "Instagram",
    account: "@kenzvoyage_enbien",
    ariaLabel: { fr: "Instagram : @kenzvoyage_enbien", en: "Instagram: @kenzvoyage_enbien" },
  },
  "youtube-k15ze": {
    id: "youtube-k15ze",
    network: "youtube",
    universe: "k15ze",
    href: "https://www.youtube.com/@K15ze-l6z",
    label: "YouTube",
    account: "k15ze",
    ariaLabel: { fr: "YouTube : k15ze", en: "YouTube: k15ze" },
  },
};

/** Les comptes d'un univers, dans l'ordre de SOCIAL_IDS. */
export const socialsOf = (universe: SocialUniverse): Social[] =>
  SOCIAL_IDS.map((id) => SOCIALS[id]).filter((social) => social.universe === universe);
