"use client";

/**
 * La série au milieu de l'écran, partagée entre la liste « Mes séries » (qui l'écrit) et la bille de cristal
 * (posée une fois en tête de la page, qui se tourne vers son pays). Un petit store hors de React.
 */
import { useSyncExternalStore } from "react";

import type { SeriesId } from "@/content/series";

const listeners = new Set<() => void>();
let active: SeriesId | null = null;

export function setActiveSeries(id: SeriesId | null) {
  if (id === active) return;
  active = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActiveSeries(): SeriesId | null {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}
