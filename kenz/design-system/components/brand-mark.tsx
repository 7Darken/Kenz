/**
 * Le monogramme KZ de l'univers (3D, détouré) : devant « Kenz· » dans la nav et le pied de page. Décoratif : le nom
 * écrit à côté porte le sens. Sa hauteur suit la taille du texte du parent (`--mark-h`, en em).
 */
import Image from "next/image";

import { BRAND_MARKS, type Universe } from "@/content/site";
import styles from "./brand-mark.module.css";

export function BrandMark({ universe, className }: { universe: Universe; className?: string }) {
  const { src, width, height } = BRAND_MARKS[universe];
  return (
    <Image
      className={[styles.mark, className].filter(Boolean).join(" ")}
      src={src}
      width={width}
      height={height}
      sizes="64px"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
