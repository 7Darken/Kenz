"use client";

/**
 * Langue active du site (FR par défaut, `?lang=en` partageable, choix mémorisé).
 *
 * La langue vit dans un petit store hors de React, lu par `useSyncExternalStore` :
 * le serveur et l'hydratation rendent le français, puis le client passe à la langue
 * de l'URL ou du stockage, sans setState dans un effet.
 * Priorité : `?lang=` dans l'URL > préférence mémorisée > français.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_LANG, LANG_STORAGE_KEY, LANGUAGES, type Lang } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

interface LanguageContextValue {
  /** Langue active. */
  lang: Lang;
  /** Choisit la langue (mémorisée, reportée dans l'URL). */
  setLang: (lang: Lang) => void;
  /** Passe de FR à EN et inversement. */
  toggleLang: () => void;
  /** Dictionnaire actif : `t.espace.clé`. */
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLang = (value: string | null): value is Lang =>
  value !== null && (LANGUAGES as readonly string[]).includes(value);

/* ---------- Le store ---------- */
const listeners = new Set<() => void>();
let current: Lang | null = null;

function readStored(): string | null {
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): Lang {
  if (current) return current;
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  const stored = readStored();
  current = isLang(fromUrl) ? fromUrl : isLang(stored) ? stored : DEFAULT_LANG;
  return current;
}

const getServerSnapshot = (): Lang => DEFAULT_LANG;

function setLanguage(lang: Lang) {
  if (lang === current) return;
  current = lang;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* stockage indisponible (navigation privée) : la langue tient pour la session */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Un autre onglet change la langue : on suit.
  const onStorage = (event: StorageEvent) => {
    if (event.key === LANG_STORAGE_KEY && isLang(event.newValue)) setLanguage(event.newValue);
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Garde la langue dans l'URL (FR reste implicite), sans entrée d'historique. */
function syncUrl(lang: Lang) {
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANG) url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(window.history.state, "", next);
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();

  // À chaque changement de langue ET de page : <html lang> et l'URL suivent.
  useEffect(() => {
    document.documentElement.lang = lang;
    syncUrl(lang);
  }, [lang, pathname]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLanguage,
      toggleLang: () => setLanguage(lang === "fr" ? "en" : "fr"),
      t: dictionaries[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage doit être utilisé sous <LanguageProvider>");
  return context;
}

/** Le dictionnaire actif seulement. */
export function useTranslation(): Dictionary {
  return useLanguage().t;
}
