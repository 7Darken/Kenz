/**
 * Accès au dictionnaire hors React (composants serveur, `generateMetadata`).
 * Les pages sont rendues en français (langue de base) ; l'anglais s'applique côté client
 * (`?lang=en` ou préférence mémorisée), via `<T>` et `useTranslation()`.
 */
import { DEFAULT_LANG, type Lang } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

export function getDictionary(lang: Lang = DEFAULT_LANG): Dictionary {
  return dictionaries[lang];
}
