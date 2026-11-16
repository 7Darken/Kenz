"use client";

/**
 * Une image du contenu (`ImageAsset`) avec next/image, son texte alternatif dans la langue active
 * (décorative si elle n'en a pas). `loupe` : la loupe peut la grossir (souris seulement).
 */
import Image from "next/image";
import type { Ref } from "react";

import type { ImageAsset } from "@/content/types";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";

interface ContentImageProps {
  image: ImageAsset;
  sizes: string;
  className?: string;
  loupe?: boolean;
  priority?: boolean;
  ref?: Ref<HTMLImageElement>;
}

export function ContentImage({ image, sizes, className, loupe = false, priority = false, ref }: ContentImageProps) {
  const { lang } = useLanguage();
  return (
    <Image
      ref={ref}
      className={className}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt ? localize(image.alt, lang) : ""}
      sizes={sizes}
      quality={image.quality}
      priority={priority}
      style={image.position ? { objectPosition: image.position } : undefined}
      data-loupe={loupe ? "" : undefined}
    />
  );
}
