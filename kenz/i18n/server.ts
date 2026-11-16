/**
 * Accès au dictionnaire côté serveur (composants serveur, métadonnées), et choix des espaces envoyés au client.
 * Les pages sont rendues en français (langue de base) ; l'anglais s'applique côté client
 * (`?lang=en` ou préférence mémorisée), via `<T>` et `useTranslation()`.
 */
import type { Universe } from "@/content/site";

import { DEFAULT_LANG, LANGUAGES, type Lang } from "./config";
import { dictionaries, type Dictionary, type Space } from "./dictionaries";
import type { Messages } from "./dictionaries/keys";

export function getDictionary(lang: Lang = DEFAULT_LANG): Dictionary {
  return dictionaries[lang];
}

/**
 * Les espaces de chaque univers : son provider de langue ne reçoit que ceux-là (en français et en anglais),
 * pour ne pas envoyer les textes d'un univers dans les pages de l'autre. `page` : une page hors univers (404).
 * Un composant ne lit donc que les espaces de l'univers où il est monté.
 */
const SPACES = {
  pro: ["common", "footer", "pro", "apps", "agents", "victoire"],
  createur: ["common", "footer", "createur", "voyage", "itineraire", "sport"],
  k15ze: ["common", "footer", "sport"],
  page: ["common"],
} as const satisfies Record<Universe | "page", readonly Space[]>;

export function universeMessages(universe: keyof typeof SPACES): Messages {
  const pick = (dict: Dictionary): Partial<Dictionary> =>
    Object.fromEntries(SPACES[universe].map((space) => [space, dict[space]]));
  return Object.fromEntries(LANGUAGES.map((lang) => [lang, pick(dictionaries[lang])])) as Record<Lang, Partial<Dictionary>>;
}
