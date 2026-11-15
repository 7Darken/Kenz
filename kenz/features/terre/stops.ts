/**
 * Les escales du globe, dans l'ordre réel des séries (content/series.ts → ESCALES), et la vue du hero :
 * l'Asie au bord de la Terre, une rotation lente.
 */
import { ESCALE_IDS, ESCALES, type EscaleId } from "@/content/series";

export interface Stop {
  id: EscaleId;
  lat: number;
  lon: number;
  upcoming: boolean;
}

export const STOPS: readonly Stop[] = ESCALE_IDS.map((id) => ({
  id,
  lat: ESCALES[id].lat,
  lon: ESCALES[id].lon,
  upcoming: ESCALES[id].upcoming === true,
}));

export const HERO_VIEW = { lat: -22, lon: 116 } as const;
/** Degrés par seconde. */
export const HERO_DRIFT = 1.2;
