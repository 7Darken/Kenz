"use client";

/** Le portrait détouré : l'image du hero (priorité de chargement), son texte alternatif dans la langue active. */
import Image from "next/image";

import type { ImageAsset } from "@/content/types";
import type { DictKey } from "@/i18n/dictionaries";
import { useText } from "@/i18n/text";

interface HeroPortraitProps {
  image: ImageAsset;
  altKey: DictKey;
  className: string;
}

export function HeroPortrait({ image, altKey, className }: HeroPortraitProps) {
  const alt = useText({ k: altKey });
  return (
    <Image
      className={className}
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 861px) 44vw, 80vw"
      priority
    />
  );
}
