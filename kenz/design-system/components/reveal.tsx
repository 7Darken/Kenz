"use client";

/**
 * Apparition à l'entrée à l'écran : `card` (monte et grandit à peine) ou `fade` (fondu depuis le flou).
 * `index` décale l'arrivée de 90 ms par rang (une liste) ; `delay` ajoute un délai fixe (s).
 * Sans JS ou en mouvement réduit : l'état final (lisible) ou un simple fondu.
 */
import { useRef, type CSSProperties, type ReactNode } from "react";

import { useInView } from "@/design-system/motion/use-in-view";
import styles from "./reveal.module.css";

interface RevealProps {
  variant?: "card" | "fade";
  as?: "div" | "li" | "article" | "figure" | "p" | "span";
  /** Rang dans une liste : +90 ms par rang. */
  index?: number;
  /** Délai fixe (s). */
  delay?: number;
  /** Contrôlé : apparaît quand vrai (sinon à l'entrée à l'écran). */
  show?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Reveal({ variant = "card", as: Tag = "div", index, delay, show, className, style, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref);
  const visible = show ?? inView;
  const vars = {
    ...(index !== undefined && { "--d": index }),
    ...(delay !== undefined && { "--wd": `${delay}s` }),
    ...style,
  } as CSSProperties;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={className ? `${styles[variant]} ${className}` : styles[variant]}
      style={vars}
      data-in={visible ? "" : undefined}
    >
      {children}
    </Tag>
  );
}
