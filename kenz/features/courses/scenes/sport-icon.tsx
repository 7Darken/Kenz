/**
 * Une icône 3D (assets/sport3d, masters 1024 px) affichée à `size` px : next/image en sert la bonne taille.
 * Décorative (la scène est décrite par son résumé) ; chargée à l'ouverture de la fiche.
 */
import Image from "next/image";

import type { ImageAsset } from "@/content/types";
import styles from "./scene.module.css";

interface SportIconProps {
  icon: ImageAsset;
  /** Taille affichée (px). */
  size: number;
}

export function SportIcon({ icon, size }: SportIconProps) {
  return (
    <Image
      className={styles.img}
      src={icon.src}
      alt=""
      width={size}
      height={size}
      loading="eager"
      draggable={false}
    />
  );
}
