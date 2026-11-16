/**
 * Le site : adresse, routes, couleurs des passages et du navigateur par univers.
 * Les routes sont la seule source des liens internes (nav, pied de page, passages).
 */
import type { AppSlug } from "./apps";
import type { HexColor, ImageAsset } from "./types";

export const SITE_URL = "https://kenzenbien.fr";
export const SITE_NAME = "Kenz";

/** Les trois univers : Pro (l'espace), Créateur (la Terre) et k15ze (le sport). */
export type Universe = "pro" | "createur" | "k15ze";

export const ROUTES = {
  home: "/",
  app: (slug: AppSlug) => `/apps/${slug}` as const,
  agents: "/agents",
  createur: "/createur",
  voyage: "/createur/voyage",
  sport: "/createur/sport",
} as const;

/**
 * La couleur du fond d'arrivée d'un passage vers une page (sombre ; clair si elle diffère),
 * posée sur les liens en `data-couleur` / `data-couleur-clair` (contrat de features/passages).
 */
export type PassageTarget = "pro" | "agents" | "escapades" | "voyage" | "sport" | "createur";

const PASSAGE_COLORS: Readonly<Record<PassageTarget, { dark: HexColor; light?: HexColor }>> = {
  pro: { dark: "#0E1220", light: "#F5F3EF" },
  agents: { dark: "#1A2440", light: "#E9EDEF" },
  escapades: { dark: "#E3A21A" },
  voyage: { dark: "#0F5D6B" },
  sport: { dark: "#0D0F0E" },
  createur: { dark: "#0A1117", light: "#F6F2EB" },
};

/** Attributs data-* d'un lien qui part avec la transition Passage. */
export function passageAttributes(target: PassageTarget) {
  const { dark, light } = PASSAGE_COLORS[target];
  return { "data-passage": "", "data-couleur": dark, ...(light && { "data-couleur-clair": light }) };
}

/** Les portraits détourés de Kenz (vraies photos), un par univers : le hero, et la scène des apps côté Pro. */
export const PORTRAITS: Readonly<Record<"pro" | "createur", ImageAsset>> = {
  pro: { src: "/assets/img/kenz-pro.webp", width: 1080, height: 1920 },
  createur: { src: "/assets/img/kenz-moi.webp", width: 1080, height: 1920 },
};

/** L'année du © du pied de page (celle de la maquette ; à faire évoluer avec le site). */
export const COPYRIGHT_YEAR = 2026;

/** L'image de partage (Open Graph) de chaque univers : une vraie photo de la maquette, en paysage. */
export const SHARE_IMAGES: Readonly<Record<Universe, { url: string; width: number; height: number; alt: string }>> = {
  pro: { url: "/assets/img/horizon-pro.jpg", width: 1672, height: 941, alt: "Kuala Lumpur à l’heure bleue" },
  createur: { url: "/assets/img/horizon-createur.jpg", width: 1672, height: 941, alt: "Kuala Lumpur à l’heure dorée" },
  k15ze: { url: "/assets/img/spartan-2.jpg", width: 768, height: 511, alt: "Kenz saute au-dessus d’un feu pendant une Spartan Race" },
};
