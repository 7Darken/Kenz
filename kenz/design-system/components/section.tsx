/**
 * Un chapitre de page : `data-chapitre` (un nœud sur le rail du fil), `data-aura` (la place de la lumière
 * quand il occupe le milieu de l'écran) et le trait du fil en haut (sauf `fil="none"`, centré avec `fil="center"`).
 * Le premier chapitre de la page n'a jamais de trait (géré par <Fil>).
 */
import type { ComponentPropsWithoutRef } from "react";

import { FilTrait } from "./fil-trait";
import styles from "./section.module.css";

/** La place des halos de l'aura : un nom de la maquette, ou « x y » en % de l'écran. */
export type AuraPlace = "droite" | "gauche" | "centre" | "haut" | "bas" | "calme" | `${number} ${number}`;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  as?: "section" | "header" | "div" | "article";
  aura?: AuraPlace;
  /** Le trait du fil en haut du chapitre. */
  fil?: "auto" | "none" | "center";
  /** false : une section qui n'est pas un chapitre du fil (ni nœud, ni aura). */
  chapter?: boolean;
};

export function Section({
  as: Tag = "section",
  aura,
  fil = "auto",
  chapter = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={className ? `${styles.section} ${className}` : styles.section}
      data-chapitre={chapter ? "" : undefined}
      data-aura={chapter ? aura : undefined}
      {...props}
    >
      {chapter && fil !== "none" ? <FilTrait centered={fil === "center"} /> : null}
      {children}
    </Tag>
  );
}
