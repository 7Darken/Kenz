"use client";

/**
 * Une capture portrait dans sa carte : elle glisse un peu au défilement (la seconde plus vite, pour la
 * profondeur). Mouvement réduit : immobile. La loupe la grossit.
 */
import { useRef } from "react";

import type { ImageAsset } from "@/content/types";
import { gsap } from "@/features/motion/gsap";
import { useGsap } from "@/features/motion/use-gsap";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { ContentImage } from "./content-image";

interface ParallaxShotProps {
  image: ImageAsset;
  className: string;
  sizes: string;
  /** Rang de la capture : la seconde glisse plus vite. */
  depth: 0 | 1;
}

export function ParallaxShot({ image, className, sizes, depth }: ParallaxShotProps) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const img = ref.current;
      if (reduced || !img) return;
      gsap.fromTo(
        img,
        { "--py": `${depth ? 56 : 30}px` },
        {
          "--py": `${depth ? -28 : -14}px`,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    },
    ref,
    [reduced, depth],
  );

  return <ContentImage ref={ref} className={className} image={image} sizes={sizes} loupe />;
}
