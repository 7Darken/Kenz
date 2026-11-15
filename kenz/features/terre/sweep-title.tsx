"use client";

/**
 * Un titre en balayage doux avec flou (`[data-sweep]` de la maquette) : il se découvre de gauche à droite à l'entrée
 * à l'écran. Rogné à zéro, il passerait pour invisible : on observe donc son parent. Sans JS et en mouvement réduit,
 * il est simplement là.
 */
import { useLayoutEffect, useRef } from "react";

import { useInView } from "@/features/motion/use-in-view";
import { useText, type TextSource } from "@/i18n/text";
import styles from "./sweep-title.module.css";

interface SweepTitleProps {
  as?: "h2" | "h3";
  id?: string;
  text: TextSource;
  className?: string;
}

export function SweepTitle({ as: Tag = "h2", id, text, className }: SweepTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const hostRef = useRef<Element | null>(null);
  useLayoutEffect(() => {
    hostRef.current = ref.current?.parentElement ?? null;
  }, []);
  const inView = useInView(hostRef, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  const label = useText(text);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className ? `${styles.sweep} ${className}` : styles.sweep}
      data-in={inView ? "" : undefined}
    >
      {label}
    </Tag>
  );
}
