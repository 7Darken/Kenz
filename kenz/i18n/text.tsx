"use client";

/**
 * Lire un texte localisé depuis n'importe où, y compris depuis un composant serveur :
 * - `<T k="common.nav.contact" />`                      texte du dictionnaire
 * - `<T value={app.domain} />`                           contenu `Localized` (dossier content/)
 * - `<T value={app.story.hook} rich glow />`             avec le mot `*mis en valeur*`
 * - `<T k="common.nav.tryAppLabel" vars={{ app: "Oshii" }} />`
 * `<T>` est une petite feuille client : le composant serveur parent reste serveur.
 * Dans un composant client, `useText(source)` renvoie la chaîne.
 */
import { Rich } from "@/design-system/components/rich";

import { translate, type DictKey } from "./dictionaries/keys";
import { format } from "./format";
import { useLanguage } from "./language-provider";
import { localize, type Localized } from "./localize";

/** Une source de texte : chaîne déjà résolue, contenu localisé, ou clé de dictionnaire. */
export type TextSource = string | Localized<string> | { k: DictKey };

type Vars = Readonly<Record<string, string | number>>;

/** Résout une source de texte dans la langue active (composants client). */
export function useText(source: TextSource, vars?: Vars): string {
  const { lang, t } = useLanguage();
  const text =
    typeof source === "string" ? source : "k" in source ? translate(t, source.k) : localize(source, lang);
  return vars ? format(text, vars) : text;
}

type TProps = ({ k: DictKey; value?: never } | { value: Localized<string>; k?: never }) & {
  /** Rend `*mot*` en Instrument Serif italique. */
  rich?: boolean;
  /** Avec `rich` : la lueur de l'univers sur le mot. */
  glow?: boolean;
  vars?: Vars;
};

export function T(props: TProps) {
  const text = useText(props.k !== undefined ? { k: props.k } : props.value, props.vars);
  return props.rich ? <Rich text={text} glow={props.glow} /> : <>{text}</>;
}
