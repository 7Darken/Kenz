"use client";

/**
 * « Me suivre » en icônes : une rangée de pastilles rondes (logos officiels, Simple Icons), le nom du compte
 * en infobulle au survol et au focus (voyage.html et sport.html, `.reseaux`).
 * `tone` : "k15ze" (le vert au survol) ou "glass" (un verre sur le paysage du voyage ; le Lagon et l'or au survol).
 */
import { socialsOf, type SocialUniverse } from "@/content/socials";
import { SocialIcon } from "@/design-system/components/social-icon";
import { useLanguage } from "@/i18n/language-provider";
import { useText, type TextSource } from "@/i18n/text";
import styles from "./social-links.module.css";

interface SocialLinksProps {
  universe: SocialUniverse;
  /** Le nom de la liste (lecteurs d'écran), ex. « Mes comptes sport ». */
  label: TextSource;
  tone: "k15ze" | "glass";
  className?: string;
}

export function SocialLinks({ universe, label, tone, className }: SocialLinksProps) {
  const { lang } = useLanguage();
  const name = useText(label);
  const cls = [styles.list, styles[tone], className].filter(Boolean).join(" ");
  return (
    <ul className={cls} role="list" aria-label={name}>
      {socialsOf(universe).map((social) => (
        <li key={social.id}>
          <a className={styles.link} href={social.href} target="_blank" rel="noopener" aria-label={social.ariaLabel[lang]}>
            <SocialIcon network={social.network} />
            <span className={styles.bubble} aria-hidden="true">
              {social.account ?? social.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
