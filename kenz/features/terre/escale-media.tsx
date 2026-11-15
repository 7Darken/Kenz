"use client";

/** La vignette d'une escale, liée à la chaîne YouTube ; son nom accessible dit le pays (« Japon : voir mes vidéos… »). */
import Image from "next/image";

import type { YoutubeMedia } from "@/content/series";
import { Icon } from "@/design-system/components/icon";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize, type Localized } from "@/i18n/localize";
import styles from "./voyage-section.module.css";

interface EscaleMediaProps {
  media: YoutubeMedia;
  country: Localized<string>;
}

export function EscaleMedia({ media, country }: EscaleMediaProps) {
  const { lang, t } = useLanguage();
  return (
    <a
      className={styles.media}
      href={media.href}
      target="_blank"
      rel="noopener"
      aria-label={format(t.createur.voyage.mediaLabel, { country: localize(country, lang) })}
    >
      <Image
        src={media.image.src}
        alt=""
        width={media.image.width}
        height={media.image.height}
        sizes="(min-width: 1368px) 520px, (min-width: 900px) 38vw, (min-width: 600px) 560px, calc(100vw - 32px)"
        data-loupe=""
      />
      <span className={styles.pill} aria-hidden="true">
        {t.createur.voyage.youtube}
        <Icon name="arrow-up-right" />
      </span>
    </a>
  );
}
