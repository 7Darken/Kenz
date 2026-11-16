/**
 * Agrégateur typé des dictionnaires d'interface, découpés par espace de noms
 * (`fr/<espace>.ts`, `en/<espace>.ts`). Le type vient du français ; l'anglais doit le respecter.
 *
 * Réservé au serveur (métadonnées, choix des espaces de chaque univers dans i18n/server.ts) : côté client,
 * le provider de langue ne reçoit que les espaces de son univers. Les clés et `translate` : ./keys.
 */
import type { Lang } from "../config";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type { Dictionary };
export type { DictKey, Space } from "./keys";

export const dictionaries: Record<Lang, Dictionary> = { fr, en };
