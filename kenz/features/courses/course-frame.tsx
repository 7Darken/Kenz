/**
 * Un cadre de photo de la composition, jamais plus large que la photo : largeur max = min(largeur réelle,
 * hauteur réelle × rapport du cadre). `data-photo` relie la photo à sa vignette dans la fiche (le vol).
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import type { ImageAsset } from "@/content/types";
import styles from "./courses.module.css";

interface CourseFrameProps {
  photo: ImageAsset;
  alt: string;
  /** Largeur / hauteur du cadre. */
  ratio: number;
  sizes: string;
  className?: string;
  eager?: boolean;
}

/** Le rapport d'un cadre secondaire : paysage 3:2, portrait 3:4. */
export const frameRatio = (photo: ImageAsset) => (photo.width >= photo.height ? 1.5 : 0.75);

export function CourseFrame({ photo, alt, ratio, sizes, className, eager = false }: CourseFrameProps) {
  const maxWidth = Math.floor(Math.min(photo.width, photo.height * ratio));
  return (
    <div
      className={className ? `${styles.frame} ${className}` : styles.frame}
      style={{ "--r": ratio, maxWidth } as CSSProperties}
      data-photo={photo.src}
    >
      <Image
        src={photo.src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
    </div>
  );
}
