"use client";

/**
 * Le jour ouvert ⇄ l'ancre de l'adresse (`#jour-5`, ou `#day-5`) : un lien vers un jour se colle dans la description
 * d'une vidéo. Changer de jour remplace l'entrée d'historique (pas de pile de jours derrière le bouton « retour »).
 */
import { useCallback, useSyncExternalStore } from "react";

const HASH_PATTERN = /^#(?:jour|day)-(\d+)$/;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("hashchange", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", listener);
  };
}

/** Le jour de l'ancre, ou null. */
export function readHashDay(): number | null {
  const match = HASH_PATTERN.exec(window.location.hash);
  return match ? Number(match[1]) : null;
}

export const dayHash = (day: number) => `jour-${day}`;

/** Le chapitre du calendrier (ancre « Explorer l’itinéraire », arrivée sur un lien vers un jour). */
export const PLANNER_ID = "itineraire";

export function useDayHash(total: number) {
  const fromHash = useSyncExternalStore(subscribe, readHashDay, () => null);
  const day = fromHash !== null && fromHash >= 1 && fromHash <= total ? fromHash : 1;

  const setDay = useCallback((next: number) => {
    const url = new URL(window.location.href);
    url.hash = dayHash(next);
    window.history.replaceState(window.history.state, "", url);
    listeners.forEach((listener) => listener());
  }, []);

  return [day, setDay] as const;
}
