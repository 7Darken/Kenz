"use client";

/**
 * La bille de cristal de la page (features/terre) : un seul globe, posé une fois en tête de page. Sur l'arrivée
 * (`data-bille="libre"`), elle tourne lentement, l'Asie face à nous ; à côté de « Mes séries », elle se tourne
 * vers le pays de la série au milieu de l'écran (la première, tant qu'aucune ne l'est).
 */
import { ESCALES, SERIES, SERIES_IDS } from "@/content/series";
import { TerreBille } from "@/features/terre";
import { useActiveSeries } from "./series-focus";

export function VoyageBille() {
  const id = useActiveSeries() ?? SERIES_IDS[0];
  const series = SERIES[id];
  const escale = ESCALES[series.escale];
  const target = series.focus ?? escale;
  return <TerreBille focus={{ escale: series.escale, lat: target.lat, lon: target.lon }} />;
}
