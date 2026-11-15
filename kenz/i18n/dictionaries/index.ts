/**
 * Agrégateur typé des dictionnaires d'interface, découpés par espace de noms
 * (`fr/<espace>.ts`, `en/<espace>.ts`). Le type vient du français ; l'anglais doit le respecter.
 */
import type { Lang } from "../config";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type { Dictionary };

export const dictionaries: Record<Lang, Dictionary> = { fr, en };

/** Chemins « espace.clé.sous-clé » vers chaque texte (feuille `string`) du dictionnaire. */
type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : T[K] extends object
        ? Leaves<T[K], `${P}${K}.`>
        : never;
}[keyof T & string];

export type DictKey = Leaves<Dictionary>;

/** Lit un texte par son chemin, ex. `translate(t, "common.nav.contact")`. */
export function translate(dict: Dictionary, key: DictKey): string {
  let node: unknown = dict;
  for (const part of key.split(".")) node = (node as Record<string, unknown>)[part];
  // DictKey ne désigne que des feuilles string : la conversion est sûre.
  return node as string;
}
