"use client";

/**
 * Le titre de chapitre qui entre en balayage (app.html, [data-sweep]) : il se découvre de gauche à droite en
 * sortant du flou, à l'entrée à l'écran. Mouvement réduit : un fondu. Sans JS : lisible tout de suite.
 * Un élément masqué par clip-path ne franchit jamais le seuil de l'observateur : on observe son parent.
 */
import { useRef, type ReactNode } from "react";

import { useInView } from "@/features/motion/use-in-view";
import styles from "./sweep-title.module.css";

interface SweepTitleProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function SweepTitle({ id, className, children }: SweepTitleProps) {
  const parentRef = useRef<HTMLElement | null>(null);
  const inView = useInView(parentRef);
  return (
    <h2
      ref={(node) => {
        parentRef.current = node?.parentElement ?? null;
      }}
      id={id}
      className={className ? `${styles.sweep} ${className}` : styles.sweep}
      data-in={inView ? "" : undefined}
    >
      {children}
    </h2>
  );
}
