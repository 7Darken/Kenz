"use client";

/**
 * Le titre en balayage doux (`[data-sweep]` des maquettes) : il se découvre de gauche à droite en fondu, à l'entrée à
 * l'écran. Rogné à zéro, il passerait pour invisible : on observe donc son parent.
 * Sans JS, il est simplement là. Le texte : `text` (dictionnaire, contenu localisé ou chaîne) ou les enfants.
 * Le déclenchement est celui des apparitions de l'univers (useInView). `variant`, le style de la page :
 * - "createur" (createur.html, voyage.html, sport.html) : mouvement réduit, immobile ;
 * - "pro" (app.html, agents.html) : mouvement réduit, un fondu.
 */
import { useRef, type ReactNode } from "react";

import { descender } from "@/design-system/lib/descender";
import { useInView } from "@/design-system/motion/use-in-view";
import { useText, type TextSource } from "@/i18n/text";
import styles from "./sweep-title.module.css";

type SweepTitleProps = {
  as?: "h2" | "h3";
  id?: string;
  className?: string;
  variant?: "createur" | "pro";
} & ({ text: TextSource; children?: never } | { children: ReactNode; text?: never });

export function SweepTitle({ as: Tag = "h2", id, className, variant = "createur", text, children }: SweepTitleProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const inView = useInView(hostRef);
  const label = useText(text ?? "");
  const cls = [styles.sweep, variant === "pro" && styles.pro, className].filter(Boolean).join(" ");

  return (
    <Tag
      ref={(node: HTMLHeadingElement | null) => {
        hostRef.current = node?.parentElement ?? null;
      }}
      id={id}
      className={cls}
      data-in={inView ? "" : undefined}
      {...(text !== undefined ? descender(label) : {})}
    >
      {text !== undefined ? label : children}
    </Tag>
  );
}
