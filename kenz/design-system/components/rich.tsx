/**
 * Texte riche : `*mot*` devient le mot en Instrument Serif italique (`.word`, et `.glow` si demandé).
 * Composant pur (ni état ni effet) : utilisable côté serveur comme côté client.
 */
import { Fragment } from "react";

interface RichProps {
  /** Texte déjà localisé, ex. « Je construis des apps où l’IA fait le *vrai* travail. » */
  text: string;
  /** Ajoute la lueur de l'univers au mot mis en valeur. */
  glow?: boolean;
}

export function Rich({ text, glow = false }: RichProps) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className={glow ? "word glow" : "word"}>
            {part}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
