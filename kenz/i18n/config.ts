/**
 * i18n configuration — single source of truth for supported languages.
 *
 * French is the default / base language of the site. English is being rolled
 * out progressively: every translatable string lives in `i18n/dictionaries`.
 */

export const LANGUAGES = ["fr", "en"] as const;

export type Lang = (typeof LANGUAGES)[number];

/** Base language of the site. */
export const DEFAULT_LANG: Lang = "fr";

/** localStorage key used to persist the visitor's language choice. */
export const LANG_STORAGE_KEY = "kenz-lang";

/**
 * Display metadata for each language.
 * `flagCode` is the ISO 3166-1 alpha-2 code used by the free flagcdn.com API
 * (https://flagcdn.com) — no API key required.
 *   FR -> France flag (fr), EN -> United Kingdom flag (gb).
 */
export const LANG_META: Record<
  Lang,
  { label: string; flagCode: string; aria: string }
> = {
  fr: { label: "FR", flagCode: "fr", aria: "Français" },
  en: { label: "EN", flagCode: "gb", aria: "English" },
};

/** Builds the flagcdn.com URL for a given language (width-40 PNG, retina-friendly). */
export const flagUrl = (lang: Lang) =>
  `https://flagcdn.com/w40/${LANG_META[lang].flagCode}.png`;
