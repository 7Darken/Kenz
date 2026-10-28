"use client";

import { useCallback, useSyncExternalStore } from "react";

/* Browser-only state exposed through useSyncExternalStore: the server render
   and the hydration pass both see the server snapshot, then React switches to
   the real browser value. No hydration mismatch, no setState-in-effect. */

const noopSubscribe = () => () => {};

/** `false` on the server and during hydration, `true` afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* ── localStorage ── */

const storageListeners = new Set<() => void>();
// Fallback when localStorage is unavailable (private mode, blocked cookies):
// the value still lives for the session instead of silently doing nothing.
const memory = new Map<string, string | null>();

function subscribeStorage(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key) memory.delete(event.key);
    listener();
  };
  storageListeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    storageListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readStorage(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** A string persisted in localStorage, shared by every component (and tab) using the same key. */
export function useStoredState(key: string) {
  const value = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(key),
    () => null,
  );

  const setValue = useCallback(
    (next: string | null) => {
      memory.set(key, next);
      try {
        if (next === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, next);
      } catch {
        // Storage unavailable: the in-memory value above still applies.
      }
      storageListeners.forEach((listener) => listener());
    },
    [key],
  );

  return [value, setValue] as const;
}

/* ── Media queries ── */

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (listener: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
