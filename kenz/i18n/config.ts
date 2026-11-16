/**
 * Les langues du site : une seule source.
 *
 * Le français est la langue de base (celle du rendu serveur) ; l'anglais s'applique côté client
 * (`?lang=en` ou le choix mémorisé). Les textes d'interface vivent dans `i18n/dictionaries/{fr,en}/<espace>.ts`,
 * les contenus dans `content/*.ts` en `Localized<T>`.
 */

export const LANGUAGES = ["fr", "en"] as const;

export type Lang = (typeof LANGUAGES)[number];

/** La langue de base du site. */
export const DEFAULT_LANG: Lang = "fr";

/** La clé `localStorage` du choix de langue du visiteur. */
export const LANG_STORAGE_KEY = "kenz-lang";

/** Le libellé court de chaque langue, affiché par le sélecteur. */
export const LANG_LABELS: Readonly<Record<Lang, string>> = { fr: "FR", en: "EN" };
