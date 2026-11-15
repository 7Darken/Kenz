/**
 * Un polaroïd : la vraie miniature dans un cadre blanc plus large en bas, légèrement penché (`rotate`, en degrés).
 * `sizes` décrit sa largeur affichée pour next/image (jamais plus grande que la photo réelle).
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import type { ImageAsset } from "@/content/types";
import styles from "./polaroid.module.css";

interface PolaroidProps {
  image: ImageAsset;
  /** Texte alternatif déjà localisé (vide : décoratif). */
  alt?: string;
  sizes: string;
  rotate?: number;
  className?: string;
}

export function Polaroid({ image, alt = "", sizes, rotate, className }: PolaroidProps) {
  const style = rotate !== undefined ? ({ "--rot": `${rotate}deg` } as CSSProperties) : undefined;
  return (
    <span className={className ? `${styles.polaroid} ${className}` : styles.polaroid} style={style}>
      <span className={styles.photo}>
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      </span>
    </span>
  );
}
