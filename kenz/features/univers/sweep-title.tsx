"use client";

/**
 * Un titre en balayage doux avec flou (`[data-sweep]` de voyage.html et sport.html) : il se découvre de gauche
 * à droite à l'entrée à l'écran. Rogné à zéro, il passerait pour invisible : on observe donc son parent.
 * Sans JS et en mouvement réduit, il est simplement là.
 */
import { useEffect, useRef, useState } from "react";

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
  const [inView, setInView] = useState(false);
  const label = useText(text);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

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
