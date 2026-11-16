"use client";

/**
 * Un texte dont les mots montent un à un à l'entrée à l'écran (70 ms d'écart).
 * `text` accepte une chaîne, un contenu `Localized` ou une clé de dictionnaire ; `*mot*` devient le mot
 * en Instrument Serif (avec `glow` : sa lueur). La ponctuation reste collée à son mot.
 * Le texte entier reste lisible par les lecteurs d'écran (les mots ne sont que des <span>).
 */
import { Fragment, useRef, type CSSProperties } from "react";

import { useInView } from "@/design-system/motion/use-in-view";
import { useText, type TextSource } from "@/i18n/text";
import styles from "./words.module.css";

interface WordsProps {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "blockquote";
  text: TextSource;
  glow?: boolean;
  /** Délai avant le premier mot (s). */
  delay?: number;
  /** Contrôlé : les mots montent quand vrai (ex. l'arrivée du hero). Sinon : à l'entrée à l'écran. */
  play?: boolean;
  id?: string;
  className?: string;
}

interface Segment {
  text: string;
  emphasis: boolean;
}

/**
 * Découpe « Parlons de votre *idée*. » en mots ; un mot peut mêler le mot mis en valeur et sa ponctuation
 * (« *idée*. » reste un seul mot, le point hors de l'italique). On ne coupe que sur les espaces ordinaires :
 * l'espace insécable avant « ? » ou « : » garde la ponctuation avec son mot.
 */
function split(text: string): Segment[][] {
  const words: Segment[][] = [];
  let current: Segment[] | null = null;
  text.split(/(\*[^*]+\*)/).forEach((chunk, index) => {
    const emphasis = index % 2 === 1;
    const body = emphasis ? chunk.slice(1, -1) : chunk;
    body.split(/([ \t\n\r]+)/).forEach((piece) => {
      if (!piece) return;
      if (/^[ \t\n\r]+$/.test(piece)) {
        current = null;
        return;
      }
      if (!current) {
        current = [];
        words.push(current);
      }
      current.push({ text: piece, emphasis });
    });
  });
  return words;
}

export function Words({ as: Tag = "p", text, glow = false, delay, play, id, className }: WordsProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref);
  const resolved = useText(text);
  const visible = play ?? inView;
  const words = split(resolved);
  const style = delay !== undefined ? ({ "--wd": `${delay}s` } as CSSProperties) : undefined;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      id={id}
      className={className ? `${styles.words} ${className}` : styles.words}
      style={style}
      data-in={visible ? "" : undefined}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className={styles.word} style={{ "--i": index } as CSSProperties}>
            {word.map((segment, segmentIndex) =>
              segment.emphasis ? (
                <em key={segmentIndex} className={glow ? "word glow" : "word"}>
                  {segment.text}
                </em>
              ) : (
                <Fragment key={segmentIndex}>{segment.text}</Fragment>
              ),
            )}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
