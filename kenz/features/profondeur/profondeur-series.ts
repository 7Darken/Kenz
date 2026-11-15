/**
 * Les objets des heros, sur trois plans (shared/profondeur.js, SERIES). Positions en % de la scène du hero
 * (ordinateur : la moitié droite de l'écran ; mobile : le bas, sous le texte). Le visage occupe à peu près
 * x 35-65 %, y 9-57 % de la scène. Ordre = priorité : on garde les premiers objets chargés qui ne gênent rien.
 * Sans `mobile`, l'objet n'est pas montré sur mobile (≤ 860 px).
 */
import type { ImageAsset } from "@/content/types";

export type DepthPlan = "loin" | "milieu" | "pres";
export type DepthSeriesId = "pro" | "createur";

export interface DepthPlacement {
  /** Centre de l'objet, en % de la scène. */
  x: number;
  y: number;
  /** Largeur en px (un objet 3D occupe ≈ 70 % de son image carrée : 160 ≈ 110 px visibles). */
  size: number;
  /** Inclinaison au repos (degrés). */
  rot: number;
  plan: DepthPlan;
}

export interface DepthObject extends DepthPlacement {
  id: string;
  /** Objet 3D détouré, ou vraie miniature dans un cadre de polaroïd. */
  type: "objet" | "polaroid";
  image: ImageAsset;
  /** Mobile : ce qui change (le reste est repris de l'ordinateur). */
  mobile?: Partial<DepthPlacement>;
  /** Lueur néon sur les accents Lagon (force de 0 à 1). */
  neon?: number;
}

interface DepthSeries {
  /** Effacement au défilement : [début, fin], en part de la hauteur du hero. */
  fade: readonly [number, number];
  objects: readonly DepthObject[];
}

const object3d = (src: `/assets/${string}`, width = 512): ImageAsset => ({ src, width, height: width });
const thumbnail = (src: `/assets/${string}`): ImageAsset => ({ src, width: 960, height: 540 });

export const DEPTH_SERIES: Readonly<Record<DepthSeriesId, DepthSeries>> = {
  /* Pro : « je construis des apps où l'IA fait le vrai travail », dans l'heure bleue. Pas d'icônes d'apps
     (elles sont dans la constellation, juste en dessous). */
  pro: {
    fade: [0.12, 0.6],
    objects: [
      {
        id: "telephone",
        type: "objet",
        image: object3d("/assets/hero3d/pro-telephone.webp"),
        neon: 0.35,
        plan: "pres",
        x: 97,
        y: 64,
        size: 300,
        rot: -16,
        mobile: { x: 100, y: 80, size: 180 },
      },
      {
        id: "noyau-ia",
        type: "objet",
        image: object3d("/assets/hero3d/pro-noyau-ia.webp"),
        neon: 0.4,
        plan: "milieu",
        x: 16,
        y: 30,
        size: 160,
        rot: 0,
        mobile: { x: 10, y: 22, size: 104 },
      },
      {
        id: "trophee",
        type: "objet",
        image: object3d("/assets/hero3d/pro-trophee.webp"),
        neon: 0.3,
        plan: "milieu",
        x: 86,
        y: 28,
        size: 170,
        rot: 8,
      },
      {
        id: "satellite",
        type: "objet",
        image: object3d("/assets/hero3d/pro-satellite.webp"),
        neon: 0.35,
        plan: "loin",
        x: 8,
        y: 8,
        size: 100,
        rot: -14,
        mobile: { x: 88, y: 5, size: 76 },
      },
    ],
  },
  /* Créateur : le voyage (polaroïds de vraies miniatures, passeport, avion, appareil, étiquette) et le sport
     (les kettlebells du farmers carry). */
  createur: {
    fade: [0.02, 0.24],
    objects: [
      {
        id: "polaroid-japon",
        type: "polaroid",
        image: thumbnail("/assets/img/video-japon.jpg"),
        plan: "pres",
        x: 97,
        y: 62,
        size: 230,
        rot: 8,
        mobile: { x: 97, y: 76, size: 140 },
      },
      {
        id: "kettlebells",
        type: "objet",
        image: object3d("/assets/sport3d/hyrox-06-farmers-carry.webp", 1024),
        plan: "milieu",
        x: 86,
        y: 38,
        size: 150,
        rot: -8,
        mobile: { x: 10, y: 22, size: 104 },
      },
      {
        id: "polaroid-chine",
        type: "polaroid",
        image: thumbnail("/assets/img/video-chine.jpg"),
        plan: "milieu",
        x: 15,
        y: 22,
        size: 124,
        rot: -7,
      },
      {
        id: "passeport",
        type: "objet",
        image: object3d("/assets/hero3d/createur-passeport.webp"),
        plan: "milieu",
        x: 20,
        y: 60,
        size: 170,
        rot: -12,
      },
      {
        id: "avion",
        type: "objet",
        image: object3d("/assets/hero3d/createur-avion.webp"),
        plan: "loin",
        x: 6,
        y: 7,
        size: 96,
        rot: -8,
      },
      {
        id: "appareil",
        type: "objet",
        image: object3d("/assets/hero3d/createur-appareil.webp"),
        plan: "milieu",
        x: 95,
        y: 9,
        size: 140,
        rot: 10,
      },
      {
        id: "polaroid-malaisie",
        type: "polaroid",
        image: thumbnail("/assets/img/video-malaisie.jpg"),
        plan: "loin",
        x: 78,
        y: 6,
        size: 70,
        rot: 6,
        mobile: { x: 88, y: 5, size: 58 },
      },
      {
        id: "etiquette",
        type: "objet",
        image: object3d("/assets/hero3d/createur-etiquette.webp"),
        plan: "loin",
        x: 4,
        y: 42,
        size: 92,
        rot: 14,
      },
    ],
  },
};
