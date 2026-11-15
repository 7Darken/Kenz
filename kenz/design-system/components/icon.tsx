/**
 * Les petites icônes au trait de la maquette (16 × 16, trait 1,6, bouts ronds), décoratives.
 * Le texte du lien ou du bouton porte le sens : l'icône est toujours aria-hidden.
 */
const PATHS = {
  "arrow-right": "M3 8h10M8.5 3.5L13 8l-4.5 4.5",
  "arrow-left": "M13 8H3M7.5 3.5L3 8l4.5 4.5",
  "arrow-up-right": "M4.5 11.5l7-7M5.5 4.5h6v6",
  "arrow-down": "M8 3v10M3.5 8.5L8 13l4.5-4.5",
  "arrow-up": "M8 13V3M3.5 7.5L8 3l4.5 4.5",
  plus: "M8 3v10M3 8h10",
  close: "M4 4l8 8M12 4l-8 8",
  replay: "M2.6 8a5.4 5.4 0 1 0 1.7-3.9M2.6 2.6v3h3",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
