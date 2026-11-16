"use client";

/**
 * Badge officiel App Store / Google Play (fichiers de public/assets/badges, non modifiés), lien externe.
 * Seuls les badges français sont fournis : en anglais, le badge reste le même et seul son alt change
 * (`common.stores` du dictionnaire).
 */
import Image from "next/image";

import type { CommonDictionary } from "@/i18n/dictionaries/fr/common";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./store-badge.module.css";

export type Store = "app-store" | "google-play";

const BADGES: Record<Store, { src: string; width: number; height: number; alt: keyof CommonDictionary["stores"] }> = {
  "app-store": { src: "/assets/badges/app-store-fr.svg", width: 127, height: 40, alt: "appStore" },
  "google-play": { src: "/assets/badges/google-play-fr.png", width: 130, height: 40, alt: "googlePlay" },
};

interface StoreBadgeProps {
  store: Store;
  href: string;
  className?: string;
}

export function StoreBadge({ store, href, className }: StoreBadgeProps) {
  const stores = useTranslation().common.stores;
  const badge = BADGES[store];
  return (
    <a className={className ? `${styles.badge} ${className}` : styles.badge} href={href} target="_blank" rel="noopener">
      <Image
        src={badge.src}
        alt={stores[badge.alt]}
        width={badge.width}
        height={badge.height}
        unoptimized={badge.src.endsWith(".svg")}
      />
    </a>
  );
}
