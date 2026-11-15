/**
 * Les trois plans et la géométrie d'un objet (shared/profondeur.js, PLANS).
 * vitesse : déplacement au défilement, en part de la hauteur du hero (+ : traîne, − : file) ;
 * souris : amplitude en px (le portrait est le pivot) ; flotte : px ; rot : degrés ; duree : s.
 */
import type { DepthObject, DepthPlacement, DepthPlan } from "./profondeur-series";

interface PlanSettings {
  vitesse: number;
  souris: number;
  flotte: number;
  rot: number;
  duree: number;
  rang: number;
}

export const PLANS: Readonly<Record<DepthPlan, PlanSettings>> = {
  loin: { vitesse: 0.16, souris: 6, flotte: 3, rot: 1.2, duree: 11, rang: 0 },
  milieu: { vitesse: -0.05, souris: -7, flotte: 6, rot: 2, duree: 8.5, rang: 1 },
  pres: { vitesse: -0.3, souris: -18, flotte: 8, rot: 2.6, duree: 10, rang: 2 },
};

/** La part visible de l'image : un objet 3D occupe ≈ 70 % de son carré, un polaroïd tout son cadre. */
export const FOOTPRINT = { objet: 0.7, polaroid: 1 } as const;

/** Hauteur / largeur d'un polaroïd : cadre 5,6 %, photo 16:9 sur 88,8 %, bas 19 %. */
const POLAROID_RATIO = 0.056 + (0.888 * 9) / 16 + 0.19;

/** Un objet placé dans le mode en cours (ordinateur, ou mobile), avec sa taille réelle à l'écran. */
export interface PlacedObject extends DepthPlacement {
  object: DepthObject;
  index: number;
  /** Largeur affichée (px), jamais plus grande que l'image. */
  width: number;
  /** Hauteur / largeur. */
  ratio: number;
}

export function place(object: DepthObject, index: number, desktop: boolean): PlacedObject | null {
  if (!desktop && !object.mobile) return null;
  const p: DepthPlacement = desktop ? object : { ...object, ...object.mobile };
  const natural = object.type === "polaroid" ? object.image.width / 0.888 : object.image.width;
  return {
    x: p.x,
    y: p.y,
    size: p.size,
    rot: p.rot,
    plan: p.plan,
    object,
    index,
    width: Math.min(p.size, natural),
    ratio: object.type === "polaroid" ? POLAROID_RATIO : object.image.height / object.image.width,
  };
}
