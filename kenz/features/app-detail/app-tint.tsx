/**
 * La couleur de l'app sur toute la page, dès le premier rendu et sans JS : sa teinte, sa lumière, son foncé,
 * ceux de l'histoire suivante, et la lumière du thème (--lum, --lum-2) que suivent l'aura, le fil, la loupe et
 * les arches. Ces calques vivent hors de la page (UniverseShell) : la règle vise donc :root quand la page de
 * cette app est affichée. Les valeurs viennent de content/apps.ts (une seule source), écrites au rendu serveur.
 */
import type { App } from "@/content/apps";

export function AppTint({ app, next }: { app: App; next: App }) {
  const page = `:has([data-app-page="${app.slug}"])`;
  const c = app.colors;
  const n = next.colors;
  const css =
    `:root${page}{--teinte:${c.tint};--teinte-rgb:${c.tintRgb};--lumiere:${c.light};--lumiere-rgb:${c.lightRgb};--fonce:${c.dark};` +
    `--nx-rgb:${n.tintRgb};--nx-l:${n.light};--nx-f:${n.dark};--lum:${c.lightRgb};--lum-2:${c.tintRgb}}` +
    `:root[data-theme="light"]${page}{--lum:${c.tintRgb};--lum-2:${c.lightRgb}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
