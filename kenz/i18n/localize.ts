import type { Lang } from "./config";

/**
 * Une valeur traduite dans chaque langue du site, ex. `{ fr: "Bonjour", en: "Hello" }`.
 *
 * Sert aux contenus (`content/*.ts`) ; les textes d'interface, eux, vivent dans les dictionnaires
 * (`i18n/dictionaries/{fr,en}/<espace>.ts`).
 */
export type Localized<T = string> = Record<Lang, T>;

/** La valeur de la langue active. */
export function localize<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}
