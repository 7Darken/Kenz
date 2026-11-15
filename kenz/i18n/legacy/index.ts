/**
 * Ancien dictionnaire (avant la refonte V6), gardé seulement pour que l'ancien code
 * (`components/`, `contexts/`) compile jusqu'au nettoyage final. Ne pas l'utiliser :
 * le dictionnaire du site est `i18n/dictionaries`.
 */
import type { Lang } from "../config";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type { Dictionary };

/** All dictionaries, keyed by language code. */
export const dictionaries: Record<Lang, Dictionary> = { fr, en };
