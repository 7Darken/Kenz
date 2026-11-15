/**
 * Les pictogrammes de la machine : un trait fin, dessinés sur 24 × 24 (maquettes/v6/shared/ia.js, `P`).
 * Toujours décoratifs : le texte voisin porte le sens. La taille par défaut est de 20 px ; le parent la règle
 * avec un sélecteur `.parent svg`.
 */
import type { ReactNode } from "react";

import type { IaPicto } from "@/content/ia";
import styles from "./ia-picto.module.css";

const SHAPES: Readonly<Record<IaPicto, ReactNode>> = {
  oreille: (
    <>
      <path d="M7 9.5a5 5 0 0 1 10 0c0 2.8-2.2 3.9-3.3 5.3-.9 1.1-.6 3.7-3 3.7A2.7 2.7 0 0 1 8 16" />
      <path d="M10 9.7a2 2 0 0 1 4 0c0 1.1-.9 1.5-1.4 2.3" />
    </>
  ),
  ampoule: <path d="M9.5 17.5h5M10.5 20.5h3M12 3.5a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3.5z" />,
  balance: (
    <>
      <path d="M12 4.5v15M8 19.5h8M5.5 8h13" />
      <path d="M5.5 8 3 13.5a2.7 2.7 0 0 0 5 0L5.5 8zM18.5 8 16 13.5a2.7 2.7 0 0 0 5 0L18.5 8z" />
    </>
  ),
  oeil: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  cible: (
    <>
      <path d="M4 8.5v-3A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  compte: (
    <>
      <rect x="5.5" y="3.5" width="13" height="17" rx="2.5" />
      <path d="M8.5 7.5h7M8.7 11.5h.01M12 11.5h.01M15.3 11.5h.01M8.7 15h.01M12 15h.01M15.3 15h.01" />
    </>
  ),
  ciseaux: (
    <>
      <circle cx="6.5" cy="7" r="2.5" />
      <circle cx="6.5" cy="17" r="2.5" />
      <path d="M8.6 8.4 19.5 17.5M8.6 15.6 19.5 6.5" />
    </>
  ),
  eclat: (
    <>
      <path d="M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z" />
      <path d="M18 14.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />
    </>
  ),
  livre: (
    <>
      <path d="M3.5 6.5c3-1.4 5.8-1.4 8.5 0 2.7-1.4 5.5-1.4 8.5 0v11.5c-3-1.4-5.8-1.4-8.5 0-2.7-1.4-5.5-1.4-8.5 0z" />
      <path d="M12 6.5V18" />
    </>
  ),
  dossier: (
    <>
      <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l2 2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M3.5 11h17" />
    </>
  ),
  crayon: (
    <>
      <path d="M4.5 19.5l1-4L15.8 5.2a2.1 2.1 0 0 1 3 3L8.5 18.5z" />
      <path d="M14 7l3 3" />
    </>
  ),
  vous: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 19.5c1.1-3.4 3.6-5.2 6.5-5.2s5.4 1.8 6.5 5.2" />
    </>
  ),
  coche: <path d="M6 12.5l4 4 8-9" />,
  video: (
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.6" />
      <path d="M10.5 9.7v4.6l4-2.3z" />
    </>
  ),
  photo: (
    <>
      <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
      <path d="M8.5 6l1.3-2h4.4l1.3 2" />
      <circle cx="12" cy="12.5" r="3.2" />
    </>
  ),
  film: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 9h17M3.5 15h17M8 5v4M16 5v4M8 15v4M16 15v4" />
    </>
  ),
  notes: (
    <>
      <path d="M7 3.5h7.5l3.5 3.5v13.5H7z" />
      <path d="M14.5 3.5V7H18M9.5 11h6M9.5 14h6M9.5 17h3.5" />
    </>
  ),
  loupe: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l4.5 4.5" />
    </>
  ),
  tableur: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10" />
    </>
  ),
  produit: (
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.6" />
      <path d="M12 8.2l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" />
    </>
  ),
};

export function IaPictogram({ name, className }: { name: IaPicto; className?: string }) {
  return (
    <svg
      className={className ? `${styles.picto} ${className}` : styles.picto}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[name]}
    </svg>
  );
}
