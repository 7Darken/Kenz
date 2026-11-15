"use client";

/** Les deux pièces localisées de « Me suivre » : le portrait dans l'arche (son texte alternatif) et le nombre d'abonnés. */
import Image from "next/image";

import { FOLLOW_MEDIA, TIKTOK_FOLLOWERS } from "@/content/series";
import { Arch } from "@/design-system/components/arch";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./follow-section.module.css";

export function FollowPortrait() {
  const { lang } = useLanguage();
  const { portrait } = FOLLOW_MEDIA;
  return (
    <Arch className={styles.arch} ratio={0.78} trace traceGap={7} floor>
      <Image src={portrait.src} alt={localize(portrait.alt, lang)} fill sizes="96px" />
    </Arch>
  );
}

export function Followers() {
  const { lang, t } = useLanguage();
  return <>{format(t.voyage.suivre.followers, { count: localize(TIKTOK_FOLLOWERS, lang) })}</>;
}
