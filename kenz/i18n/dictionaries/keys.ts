/**
 * Les clés du dictionnaire (« espace.clé.sous-clé ») et leur lecture. Sans import de valeur : un composant
 * client peut s'en servir sans embarquer les dictionnaires (chaque univers reçoit les siens, voir i18n/server.ts).
 */
import type { Lang } from "../config";
import type { Dictionary } from "./fr";

/** Un espace de noms du dictionnaire (`common`, `pro`, `voyage`…). */
export type Space = keyof Dictionary;

/** Les espaces d'un univers, dans chaque langue : ce que reçoit son provider de langue. */
export type Messages = Readonly<Record<Lang, Partial<Dictionary>>>;

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
