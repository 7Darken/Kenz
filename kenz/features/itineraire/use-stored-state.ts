"use client";

/**
 * L'état gardé sur l'appareil (localStorage), lu par `useSyncExternalStore` : le rendu serveur et l'hydratation voient
 * `null`, puis React passe à la vraie valeur, sans écart d'hydratation. Partagé par tous les composants (et les onglets)
 * qui lisent la même clé. Sans stockage (navigation privée, cookies bloqués), la valeur tient en mémoire pour la session.
 */
import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const memory = new Map<string, string | null>();

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key) memory.delete(event.key);
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useStoredState(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );

  const setValue = useCallback(
    (next: string | null) => {
      memory.set(key, next);
      try {
        if (next === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, next);
      } catch {
        /* stockage indisponible : la valeur en mémoire suffit pour la session */
      }
      listeners.forEach((listener) => listener());
    },
    [key],
  );

  return [value, setValue] as const;
}

const noop = () => () => {};

/** Faux au rendu serveur et à l'hydratation, vrai ensuite. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Commun à tous les itinéraires : s'abonner une fois les débloque tous (même clé que l'ancien site). */
const SUBSCRIBER_KEY = "kenz-yt-subscriber";

/** La porte « abonnés » : `locked` seulement après l'hydratation (le serveur rend la page entière, indexable). */
export function useSubscriber() {
  const hydrated = useHydrated();
  const [value, setValue] = useStoredState(SUBSCRIBER_KEY);
  const unlock = useCallback(() => setValue("1"), [setValue]);
  return { locked: hydrated && value !== "1", unlock };
}
