/**
 * Les lettres dont la queue descend sous la ligne de base (g, j, p, q, y, la cédille, la virgule). Sous un grand titre
 * à interligne serré, elle dépasse de la boîte du texte et touche ce qui suit. `descender(texte)` pose
 * `data-descender` sur le titre (ou le mot) qui en a une : base.css réserve alors sa place, à toutes les tailles.
 */
const DESCENDERS = /[gjpqyçQ,;]/;

export function descender(text: string): { "data-descender"?: "" } {
  return DESCENDERS.test(text) ? { "data-descender": "" } : {};
}
