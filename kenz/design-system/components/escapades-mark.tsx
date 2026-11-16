/**
 * Le motif d'Escapades Libres : deux arcs. Décoratif ; couleur : `currentColor`. Deux cadrages, repris des maquettes :
 * - "page" (défaut) : le motif des pages du projet (app.html, MARQUE) : la nav, l'arrivée, l'action ;
 * - "logo" : le symbole du site (logo_symbol.svg, repère 128), plus épais : le mur de post-it de la victoire,
 *   et l'icône du passage (`ESCAPADES_LOGO`).
 * Les traits sont posés sur le groupe : le CSS d'un parent (`svg { stroke }`) ne les écrase pas.
 */
const MARKS = {
  page: {
    viewBox: "2 2 80 60",
    strokeWidth: 7.5,
    arcs: ["M47.4 13.6A24 24 0 1 0 47.4 50.4", "M75.4 13.6A24 24 0 1 0 75.4 50.4"],
  },
  logo: {
    viewBox: "7 27 100 74",
    strokeWidth: 12,
    arcs: ["M62 41A29 29 0 1 0 62 87", "M99 41A29 29 0 1 0 99 87"],
  },
} as const;

/** Le symbole du site, pour composer une image (l'icône du passage) : ses arcs dans le repère 128, son épaisseur. */
export const ESCAPADES_LOGO = MARKS.logo;

export function EscapadesMark({ className, variant = "page" }: { className?: string; variant?: keyof typeof MARKS }) {
  const { viewBox, strokeWidth, arcs } = MARKS[variant];
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        {arcs.map((d) => (
          <path key={d} pathLength={1} d={d} />
        ))}
      </g>
    </svg>
  );
}
