/**
 * Le symbole d'Escapades Libres : les deux arcs du site (logo_symbol.svg, repère 128). Sur le mur de post-it,
 * et comme élément partagé du passage vers la page du projet : le symbole or sur le bleu nuit du site.
 */
import { startupWeekend } from "@/content/startup-weekend";

const ARCS = ["M62 41A29 29 0 1 0 62 87", "M99 41A29 29 0 1 0 99 87"] as const;
const [NAVY] = startupWeekend.designDesk.swatches;

export function ArcsMark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="7 27 100 74" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round">
        {ARCS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** L'icône du passage (image SVG en data URI) : elle vole jusqu'au motif, à l'arrivée sur la page du projet. */
export const PASSAGE_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="${NAVY}"/>` +
      `<g transform="translate(64 64) scale(.72) translate(-57 -64)" fill="none" stroke="${startupWeekend.color}" stroke-width="12" stroke-linecap="round">` +
      ARCS.map((d) => `<path d="${d}"/>`).join("") +
      "</g></svg>",
  );
