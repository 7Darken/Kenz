"use client";

/**
 * Les comptes d'un univers en icônes rondes (logos officiels, Simple Icons), le nom du compte en bulle au survol et
 * au focus. Les couleurs de l'univers viennent de la porte qui les porte (`--u`, `--ic`, `--ring`).
 */
import { socialsOf, type SocialUniverse } from "@/content/socials";
import { SocialIcon } from "@/design-system/components/social-icon";
import type { DictKey } from "@/i18n/dictionaries";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { useText } from "@/i18n/text";
import styles from "./suivre-section.module.css";

interface FollowLinksProps {
  universe: SocialUniverse;
  label: DictKey;
}

export function FollowLinks({ universe, label }: FollowLinksProps) {
  const { lang } = useLanguage();
  const name = useText({ k: label });
  return (
    <ul className={styles.links} role="list" aria-label={name}>
      {socialsOf(universe).map((social) => (
        <li key={social.id}>
          <a
            className={styles.link}
            href={social.href}
            target="_blank"
            rel="noopener"
            aria-label={localize(social.ariaLabel, lang)}
          >
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
