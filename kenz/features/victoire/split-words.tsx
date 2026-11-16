/**
 * Un texte coupé en mots animables (`[data-kv-w]`, `--i` = rang du mot) ; `*mot*` devient un <em>.
 * On ne coupe que sur les espaces ordinaires : l'espace insécable garde « 24 heures » ou « solution : » ensemble.
 */
import { Fragment, type CSSProperties, type ReactNode } from "react";

import { descender } from "@/design-system/lib/descender";
import styles from "./victoire.module.css";

interface Segment {
  text: string;
  emphasis: boolean;
}

function split(text: string): Segment[][] {
  const words: Segment[][] = [];
  let current: Segment[] | null = null;
  text.split(/(\*[^*]+\*)/).forEach((chunk, index) => {
    const emphasis = index % 2 === 1;
    const body = emphasis ? chunk.slice(1, -1) : chunk;
    body.split(/( +)/).forEach((piece) => {
      if (!piece) return;
      if (/^ +$/.test(piece)) {
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

interface SplitWordsProps {
  text: string;
  /** Collé au dernier mot (ex. le drapeau après « Weekend »). */
  children?: ReactNode;
}

export function SplitWords({ text, children }: SplitWordsProps) {
  const words = split(text);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className={styles.w} data-kv-w="" style={{ "--i": index } as CSSProperties} {...descender(word.map((segment) => segment.text).join(""))}>
            {word.map((segment, segmentIndex) =>
              segment.emphasis ? <em key={segmentIndex}>{segment.text}</em> : <Fragment key={segmentIndex}>{segment.text}</Fragment>,
            )}
            {index === words.length - 1 ? children : null}
          </span>
        </Fragment>
      ))}
    </>
  );
}
