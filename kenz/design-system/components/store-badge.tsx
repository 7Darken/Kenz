"use client";

/**
 * Badge officiel App Store / Google Play (fichiers de public/assets/badges, non modifiés), lien externe.
 * Seuls les badges français sont fournis : en anglais, le badge reste le même et seul son alt change.
 */
import Image from "next/image";

import { useLanguage } from "@/i18n/language-provider";
import type { Localized } from "@/i18n/localize";
import styles from "./store-badge.module.css";

export type Store = "app-store" | "google-play";

const BADGES: Record<Store, { src: string; width: number; height: number; alt: Localized<string> }> = {
  "app-store": {
    src: "/assets/badges/app-store-fr.svg",
    width: 127,
    height: 40,
    alt: { fr: "Télécharger dans l’App Store", en: "Download on the App Store" },
  },
  "google-play": {
    src: "/assets/badges/google-play-fr.png",
    width: 130,
    height: 40,
    alt: { fr: "Disponible sur Google Play", en: "Get it on Google Play" },
  },
};

interface StoreBadgeProps {
  store: Store;
  href: string;
  className?: string;
}

export function StoreBadge({ store, href, className }: StoreBadgeProps) {
  const { lang } = useLanguage();
  const badge = BADGES[store];
  return (
    <a className={className ? `${styles.badge} ${className}` : styles.badge} href={href} target="_blank" rel="noopener">
      <Image
        src={badge.src}
        alt={badge.alt[lang]}
        width={badge.width}
        height={badge.height}
        unoptimized={badge.src.endsWith(".svg")}
      />
    </a>
  );
}
