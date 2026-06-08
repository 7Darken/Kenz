"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_LANG, LANG_STORAGE_KEY, LANGUAGES, type Lang } from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";

interface LanguageContextValue {
  /** Active language code. */
  lang: Lang;
  /** Set the active language explicitly. */
  setLang: (lang: Lang) => void;
  /** Toggle between FR and EN. */
  toggleLang: () => void;
  /** Active dictionary — read translated strings via `t.namespace.key`. */
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLang = (value: string | null): value is Lang =>
  value !== null && (LANGUAGES as readonly string[]).includes(value);

/**
 * Keep the language in the URL so a page can be shared in a given language.
 * The default language (FR) stays implicit (clean URL); only `?lang=en` is
 * written. Uses replaceState so it never adds a history entry or reloads.
 */
const syncUrl = (lang: Lang) => {
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANG) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", lang);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", next);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start from the default language so the server-rendered markup and
  // the first client render match (avoids hydration mismatches). The real
  // language (URL > stored preference) is applied right after mount.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Priority: ?lang= in the URL (shareable link) > stored preference > default.
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    const initial = isLang(urlLang)
      ? urlLang
      : isLang(stored)
        ? stored
        : DEFAULT_LANG;
    setLangState(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    // Re-apply on every language change AND every client-side navigation
    // (pathname dep) so the URL always reflects the active language.
    syncUrl(lang);
  }, [lang, mounted, pathname]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "fr" ? "en" : "fr")),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t: dictionaries[lang] }),
    [lang, setLang, toggleLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/** Convenience hook returning only the active dictionary. */
export function useTranslation(): Dictionary {
  return useLanguage().t;
}
