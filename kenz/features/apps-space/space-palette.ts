/**
 * Les deux ciels de la scène des apps, pour ce que le CSS ne peint pas : le canvas (./space-sky) et l'éclat des astres
 * (./space-engine). Le moteur lit la palette du mode (<html data-theme>) et en change à l'événement kz-theme:change,
 * sans recharger la page. Le reste du mode clair est en variables CSS (apps-space.module.css, « Le mode clair »).
 * - Sombre : la nuit de la maquette (shared/apps.js), inchangée.
 * - Clair : un ciel d'aube, comme une carte du ciel imprimée sur le papier de la page : des points d'encre et de bleu
 *   nuit, quelques étoiles à branches très fines, un scintillement discret, aucune lueur.
 */
import type { Theme } from "@/design-system/theme/theme-store";

export interface SkyPalette {
  /** Les trois tons des étoiles : dans l'ordre du dessin (une étoile sur sept prend le deuxième, deux le premier). */
  tones: readonly [string, string, string];
  /** Opacité de tout le ciel (1 : celle de la maquette). */
  alpha: number;
  /** Le scintillement : opacité × (base + amp × sinus), base + amp = 1. */
  twinkle: { base: number; amp: number };
  /** Les aigrettes des étoiles vives : part de l'opacité de l'étoile, épaisseur (px). */
  spikes: { alpha: number; width: number };
  /** La lueur des étoiles vives et de la tête de l'étoile filante (trois arrêts d'un dégradé radial) ; null : aucune. */
  glow: readonly [string, string, string] | null;
  /** L'étoile filante : la couleur de la queue (« r,g,b ») à son départ et à sa tête, son opacité, son épaisseur (px). */
  shooting: { from: string; to: string; alpha: number; width: number };
  /** L'éclat d'un astre : le filtre de son halo au repos et au plus fort (même fonction, pour qu'il s'interpole). */
  flash: { rest: string; peak: string };
}

export const SKY_PALETTES: Record<Theme, SkyPalette> = {
  dark: {
    tones: ["#D3E1FF", "#FFD596", "#FFF3E2"],
    alpha: 1,
    twinkle: { base: 0.58, amp: 0.42 },
    spikes: { alpha: 0.5, width: 0.6 },
    glow: ["rgba(255,248,236,1)", "rgba(255,238,212,.38)", "rgba(255,238,212,0)"],
    shooting: { from: "255,244,228", to: "255,250,240", alpha: 0.85, width: 1.2 },
    flash: { rest: "brightness(1)", peak: "brightness(1.9)" },
  },
  light: {
    // Bleu nuit, Lagon foncé, encre : l'encre domine.
    tones: ["#2A3B66", "#0F5D6B", "#1A1918"],
    alpha: 0.62,
    twinkle: { base: 0.82, amp: 0.18 },
    spikes: { alpha: 0.6, width: 0.5 },
    glow: null,
    shooting: { from: "42,59,102", to: "42,59,102", alpha: 0.5, width: 1 },
    // Sur le papier, l'ombre colorée d'un astre s'avive et se fonce au lieu de blanchir.
    flash: { rest: "saturate(1) brightness(1)", peak: "saturate(1.8) brightness(.88)" },
  },
};
