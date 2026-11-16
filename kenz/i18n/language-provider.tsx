"use client";

/**
 * Langue active du site (FR par défaut, `?lang=en` partageable, choix mémorisé).
 *
 * La langue vit dans un petit store hors de React, lu par `useSyncExternalStore` :
 * le serveur et l'hydratation rendent le français, puis le client passe à la langue
 * de l'URL ou du stockage, sans setState dans un effet. Le store survit au changement d'univers.
 * Priorité : `?lang=` dans l'URL > préférence mémorisée > français.
 *
 * Chaque univers monte son provider avec ses seuls espaces (`messages`, choisis par `universeMessages()`
 * d'i18n/server.ts) : les textes Pro ne partent pas dans les pages Créateur, et inversement.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_LANG, LANG_STORAGE_KEY, LANGUAGES, type Lang } from "./config";
import type { Dictionary } from "./dictionaries";
import type { Messages } from "./dictionaries/keys";

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

const SPACE_NAMES: ReadonlySet<string> = new Set<keyof Dictionary>([
  "common", "pro", "apps", "agents", "victoire", "createur", "voyage", "sport", "footer",
]);

/**
 * Le dictionnaire de l'univers. En développement, lire un espace qu'il n'a pas reçu lève une erreur claire
 * (en production, ce serait `undefined` plus loin) : il faut alors l'ajouter à l'univers dans i18n/server.ts.
 */
function universeDictionary(partial: Partial<Dictionary>): Dictionary {
  // Les espaces de l'univers suffisent à ses composants (voir ci-dessus).
  if (process.env.NODE_ENV === "production") return partial as Dictionary;
  return new Proxy(partial, {
    get(target, key, receiver) {
      if (typeof key === "string" && SPACE_NAMES.has(key) && !(key in target)) {
        throw new Error(`i18n : l'espace « ${key} » n'est pas chargé dans cet univers (voir universeMessages, i18n/server.ts)`);
      }
      return Reflect.get(target, key, receiver);
    },
  }) as Dictionary;
}

export function LanguageProvider({ messages, children }: { messages: Messages; children: ReactNode }) {
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
      t: universeDictionary(messages[lang]),
    }),
    [lang, messages],
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
