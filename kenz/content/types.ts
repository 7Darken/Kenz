/**
 * Types communs à tout le contenu typé (`content/*.ts`).
 *
 * Règles :
 * - Le contenu vient de la maquette V6 (`maquettes/v6`) et de `maquettes/_shared/content.js` : rien d'inventé.
 * - Tout texte affiché est un `Localized<string>` (FR de la maquette, EN traduit naturellement).
 * - Texte riche : `*mot*` marque le mot en Instrument Serif italique (rendu par `<Rich>`). Aucune balise HTML.
 * - Typographie française : espace insécable (U+00A0) avant `; : ! ?`, comme dans la maquette.
 */
import type { Localized } from "@/i18n/localize";

/** Texte localisé pouvant contenir un mot mis en valeur : `"Le *vrai* travail"`. */
export type RichText = Localized<string>;

/** Couleur hexadécimale, ex. `#E5483B`. */
export type HexColor = `#${string}`;

/** Couleur au format « r g b » (pour `rgb(var(--x) / .5)`), ex. `229 72 59`. */
export type RgbTriplet = `${number} ${number} ${number}`;

/** Date ISO : `AAAA-MM-JJ` ou `AAAA-MM`. */
export type IsoDate = string;

/** Image servie depuis `public/` (chemin absolu `/assets/...`), décrite à sa taille réelle. */
export interface ImageAsset {
  src: `/assets/${string}`;
  width: number;
  height: number;
  /** Absent : image décorative (`alt=""`). */
  alt?: Localized<string>;
  /** Cadrage (`object-position`), ex. `50% 30%`. */
  position?: string;
  /** Qualité de réencodage par next/image (75 par défaut). 90 pour une photo affichée en très grand, ou déjà
   *  compressée à la source (LinkedIn), où un second passage à 75 se verrait. Valeurs : `images.qualities` (next.config). */
  quality?: 75 | 90;
}
