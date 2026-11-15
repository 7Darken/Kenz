/**
 * Les objets dessinés du « vrai prix » (voyage.html, symboles o-avion, o-train, o-lit, o-bol, o-tenue, o-tel) :
 * des traits d'épaisseur constante (`non-scaling-stroke`) ; `.accent` prend la couleur d'accent (--acc).
 * Le téléphone de la finale a son propre dessin (écran, fêlure) : <PhoneArt>.
 */
import type { ReactNode } from "react";

import type { PriceIcon as PriceIconName } from "@/content/series";
import styles from "./price-section.module.css";

const ns = "non-scaling-stroke" as const;
const acc = styles.accent;

const DRAWINGS: Record<PriceIconName, () => ReactNode> = {
  plane: () => (
    <>
      <path className={acc} d="M10 110 C18 102 26 94 34 86" strokeDasharray="2 7" vectorEffect={ns} />
      <path
        transform="rotate(45 64 56)"
        d="M64 14 C67.6 14 69.5 19 69.5 25 L69.5 43 L102.5 62 L102.5 69 L69.5 60 L69.5 80 L79.5 88 L79.5 93.5 L64 89.5 L48.5 93.5 L48.5 88 L58.5 80 L58.5 60 L25.5 69 L25.5 62 L58.5 43 L58.5 25 C58.5 19 60.4 14 64 14 Z"
        vectorEffect={ns}
      />
    </>
  ),
  train: () => (
    <>
      <path d="M36 30 C36 19 46 14 60 14 C74 14 84 19 84 30 L87 84 C87 91 82 96 75 96 L45 96 C38 96 33 91 33 84 Z" vectorEffect={ns} />
      <path d="M42 31 C42 25 50 22 60 22 C70 22 78 25 78 31 L79 50 C79 53 77 55 74 55 L46 55 C43 55 41 53 41 50 Z" vectorEffect={ns} />
      <path className={acc} d="M35 67 H85" vectorEffect={ns} />
      <circle cx="45" cy="80" r="4" vectorEffect={ns} />
      <circle cx="75" cy="80" r="4" vectorEffect={ns} />
      <path d="M44 96 L30 112 M76 96 L90 112 M37 104 H83 M32 110 H88" vectorEffect={ns} />
    </>
  ),
  bed: () => (
    <>
      <path className={acc} d="M62 46 C56 40 68 36 62 28 M76 42 C70 36 82 32 76 24 M90 46 C84 40 96 36 90 28" vectorEffect={ns} />
      <path d="M18 100 V54 C18 50 21 47 25 47 C29 47 32 50 32 54 V70" vectorEffect={ns} />
      <path d="M32 70 H98 C101.3 70 104 72.7 104 76 V86 H18" vectorEffect={ns} />
      <path d="M36 70 C36 63 39 60 45 60 H54 C58 60 60 63 60 70" vectorEffect={ns} />
      <path d="M22 86 V100 M100 86 V100" vectorEffect={ns} />
    </>
  ),
  bowl: () => (
    <>
      <path className={acc} d="M40 46 C34 40 46 36 40 28 M54 44 C48 38 60 34 54 26" vectorEffect={ns} />
      <path d="M66 52 L100 16 M74 55 L106 24" vectorEffect={ns} />
      <path d="M16 58 H104 C104 82 86 98 60 98 C34 98 16 82 16 58 Z" vectorEffect={ns} />
      <path className={acc} d="M24 64 C36 60 44 68 58 63 C72 58 82 66 96 63" vectorEffect={ns} />
      <path d="M46 98 L49 106 H71 L74 98" vectorEffect={ns} />
    </>
  ),
  costume: () => (
    <>
      <path d="M60 24 V19 C60 14 66 12 67.5 16.5" vectorEffect={ns} />
      <path d="M60 24 L28 38 H92 Z" vectorEffect={ns} />
      <path d="M44 38 L16 62 L24 72 L40 60 L36 106 H84 L80 60 L96 72 L104 62 L76 38" vectorEffect={ns} />
      <path d="M50 38 L60 54 L70 38" vectorEffect={ns} />
      <path className={acc} d="M39 72 H81" vectorEffect={ns} />
      <circle className={acc} cx="60" cy="89" r="6" vectorEffect={ns} />
    </>
  ),
  phone: () => (
    <>
      <rect x="36" y="10" width="48" height="100" rx="11" vectorEffect={ns} />
      <path d="M54 17 H66" vectorEffect={ns} />
      <path className={acc} d="M53 103 H67" vectorEffect={ns} />
    </>
  ),
};

/** Un objet du ticket, à la taille de son conteneur. */
export function PriceIcon({ icon, className }: { icon: PriceIconName; className?: string }) {
  const Drawing = DRAWINGS[icon];
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  );
}

/** Le téléphone de la finale : l'écran fêlé (la fêlure s'efface, l'écran s'allume : la réparation). */
export function PhoneArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <rect className={styles.screen} x="40" y="14" width="40" height="92" rx="8" />
      <rect x="36" y="10" width="48" height="100" rx="11" vectorEffect={ns} />
      <path d="M54 17 H66" vectorEffect={ns} />
      <path
        className={styles.crack}
        d="M43 33 L55 46 L50 56 L63 66 L58 77 L75 93 M55 46 L68 42 M63 66 L74 63"
        vectorEffect={ns}
      />
      <path className={acc} d="M53 103 H67" vectorEffect={ns} />
    </svg>
  );
}
