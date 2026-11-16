/**
 * L'icône du passage vers la page du projet (image SVG en data URI) : le symbole or d'Escapades Libres sur le bleu
 * nuit du site. Elle vole jusqu'au motif, à l'arrivée sur la page du projet.
 */
import { startupWeekend } from "@/content/startup-weekend";
import { ESCAPADES_LOGO } from "@/design-system/components/escapades-mark";

const [NAVY] = startupWeekend.designDesk.swatches;

export const PASSAGE_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="${NAVY}"/>` +
      `<g transform="translate(64 64) scale(.72) translate(-57 -64)" fill="none" stroke="${startupWeekend.color}" stroke-width="${ESCAPADES_LOGO.strokeWidth}" stroke-linecap="round">` +
      ESCAPADES_LOGO.arcs.map((d) => `<path d="${d}"/>`).join("") +
      "</g></svg>",
  );
