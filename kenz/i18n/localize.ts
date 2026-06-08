import type { Lang } from "./config";

/**
 * A value translated into every supported language.
 *   e.g. `Localized<string>` -> { fr: "Bonjour", en: "Hello" }
 *        `Localized<string[]>` -> { fr: [...], en: [...] }
 *
 * Used for translatable CONTENT that lives in data files (`data/*.ts`),
 * as opposed to static UI strings which live in `i18n/dictionaries`.
 */
export type Localized<T = string> = Record<Lang, T>;

/** Picks the value for the active language. */
export function localize<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}
