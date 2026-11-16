/**
 * Les pictogrammes de l'itinéraire, au trait (24 × 24, trait 1,6, bouts ronds, comme les icônes du design system) :
 * les jours du calendrier, les moyens de transport, les genres d'activité, les infos pratiques et quelques gestes.
 * Toujours décoratifs : le texte voisin porte le sens.
 */
import type { SVGProps } from "react";

import type { ActivityKind, DayIcon, EssentialIcon, TravelMode } from "@/content/itineraries";

/** Un cercle en tracé (centre, rayon). */
const ring = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** L'avion vu de dessus, nez en haut ; tourné selon l'usage. */
const PLANE =
  "M12 2.5c.9 0 1.5 1 1.5 2.3V9l7 4.2v2l-7-2v4.6l2.2 1.7v1.6L12 20.4l-3.7.7v-1.6l2.2-1.7v-4.6l-7 2v-2l7-4.2V4.8c0-1.3.6-2.3 1.5-2.3z";

const BATH = "M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM7 19l-1 2M17 19l1 2M6 12V5.5A2.5 2.5 0 0 1 8.5 3c1.2 0 2.1.8 2.4 1.9M9.5 7.5h3";
const ARROW = "M3.5 11L20.5 3.5 13 20.5 11 13z";

type Glyph = { d: string; transform?: string };

const GLYPHS = {
  /* Les jours */
  arrival: [{ d: PLANE, transform: "translate(12 10.5) rotate(135) scale(.78) translate(-12 -12)" }, { d: "M3 21h18" }],
  departure: [{ d: PLANE, transform: "translate(12 10.5) rotate(45) scale(.78) translate(-12 -12)" }, { d: "M3 21h18" }],
  plane: [{ d: PLANE, transform: "rotate(45 12 12)" }],
  train: [{ d: "M7 3h10a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 10.5h14M9 14.5h.01M15 14.5h.01M8 18l-2 3M16 18l2 3" }],
  wall: [{ d: "M3 20.5V10h2.5V7.5h3V10h2V7.5h3V10h2V7.5h3V10H21v10.5zM3 15.2h18M9 15.2v5.3M15 15.2v5.3M12 10v5.2" }],
  temple: [{ d: "M12 2.5V5M7.5 8.5L12 5l4.5 3.5zM9 8.5V11M15 8.5V11M5 13.5L9 11h6l4 2.5zM7 13.5v3M17 13.5v3M5 16.5h14l1 3.5H4z" }],
  rest: [{ d: "M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10.5h1.5a2 2 0 0 1 0 4H16M8.5 3.5c-.6 1 .6 2-.2 3M12 3.5c-.6 1 .6 2-.2 3M4 21h13" }],
  spa: [{ d: BATH }],
  lights: [{ d: "M12 2.5V5M8 5h8M8 19h8M12 19v2.5M12 5c-4 0-6 3-6 7s2 7 6 7 6-3 6-7-2-7-6-7zM12 5c-1.6 1.6-2.4 4-2.4 7s.8 5.4 2.4 7M12 5c1.6 1.6 2.4 4 2.4 7s-.8 5.4-2.4 7" }],
  bike: [{ d: `${ring(6, 16, 3.5)}${ring(18, 16, 3.5)}M6 16l3.5-7h6.5L18 16M9.5 9l4 7H18M8 6.5h3M15 6h2.2l-1.2 3` }],
  city: [{ d: "M3 21h18M4.5 21V9.5l5-3V21M9.5 21V3.5h6.5V21M16 21v-9h3.5v9M12.2 7.5h1M12.2 11h1M12.2 14.5h1M6.8 12h.6M6.8 15.5h.6" }],
  mountain: [{ d: "M2.5 19.5L9 8.5l4.2 7 2.8-4.5 5.5 8.5zM7.2 11.4l1.8 1.3 1.8-1.3" }],
  skyline: [{ d: `M3 21h18M12 2.5v3${ring(12, 7.5, 2)}M12 9.5v5${ring(12, 16, 1.5)}M10.5 21l1.5-3.5 1.5 3.5M4.5 21v-8h3.5v8M16 21V11h3.5v10` }],

  /* Les genres d'activité */
  sight: [{ d: "M3 9.5L12 4l9 5.5zM6 10v7M10 10v7M14 10v7M18 10v7M4 17.5h16M3 20.5h18" }],
  food: [{ d: "M3 11h18c0 4.4-4 8-9 8s-9-3.6-9-8zM9 19l.5 2h5l.5-2M13 9l7-6M15.5 10l6-5" }],
  nature: [{ d: "M12 21v-5M12 16c-4 0-6.5-2-6.5-5 0-2.1 1.3-3.3 2.6-3.6C8.6 5 10.1 3.5 12 3.5s3.4 1.5 3.9 3.9c1.3.3 2.6 1.5 2.6 3.6 0 3-2.5 5-6.5 5z" }],
  night: [{ d: "M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5zM17 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" }],
  transport: [{ d: ARROW }],
  shopping: [{ d: "M5 8h14l-1 13H6zM9 10.5V7a3 3 0 0 1 6 0v3.5" }],
  wellness: [{ d: BATH }],

  /* Les infos pratiques (« transport » reprend la flèche) */
  visa: [{ d: "M9.5 3.5h5l-1 7h-3zM5 14.5c0-2 1.5-3.5 3.5-3.5h7c2 0 3.5 1.5 3.5 3.5V16H5zM5 20h14" }],
  payment: [{ d: "M5 5h14a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 19 19H5a2.5 2.5 0 0 1-2.5-2.5v-9A2.5 2.5 0 0 1 5 5zM2.5 10h19M6 15h4" }],
  internet: [{ d: "M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 15.9a4.8 4.8 0 0 1 6.4 0M12 19.5h.01" }],
  season: [{ d: "M14 14.8V5a2.5 2.5 0 0 0-5 0v9.8a4 4 0 1 0 5 0zM11.5 9v7.5M17.5 5h3M17.5 9h3" }],
  language: [{ d: "M4 4.5h10A1.5 1.5 0 0 1 15.5 6v5a1.5 1.5 0 0 1-1.5 1.5H9l-3 3v-3H4A1.5 1.5 0 0 1 2.5 11V6A1.5 1.5 0 0 1 4 4.5zM18.5 9H20a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 20 17h-1v3l-3-3h-4.5" }],

  /* Les gestes */
  calendar: [{ d: "M6 5h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1-2.5-2.5v-11A2.5 2.5 0 0 1 6 5zM3.5 10h17M8 3v4M16 3v4" }],
  check: [{ d: "M5 12.5l4.5 4.5L19 7.5" }],
  link: [{ d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" }],
  pin: [{ d: `M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z${ring(12, 10, 2.3)}` }],
  tip: [{ d: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" }],
} satisfies Record<DayIcon | TravelMode | ActivityKind | EssentialIcon, readonly Glyph[]> &
  Record<string, readonly Glyph[]>;

export type GlyphName = keyof typeof GLYPHS;

type TripIconProps = { name: GlyphName; className?: string } & Pick<
  SVGProps<SVGSVGElement>,
  "x" | "y" | "width" | "height" | "strokeWidth"
>;

/** Un pictogramme ; `x`, `y`, `width`, `height` le placent dans un autre SVG (la carte du trajet). */
export function TripIcon({ name, className, strokeWidth = 1.6, ...box }: TripIconProps) {
  return (
    <svg
      {...box}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name].map((glyph: Glyph, index) => (
        <path key={index} d={glyph.d} transform={glyph.transform} />
      ))}
    </svg>
  );
}

/** Le triangle « lecture », plein. */
export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 4.8v14.4c0 .6.7 1 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1C7.7 3.8 7 4.2 7 4.8z" fill="currentColor" />
    </svg>
  );
}
