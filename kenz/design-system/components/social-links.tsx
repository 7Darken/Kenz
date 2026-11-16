"use client";

/**
 * Les comptes d'un univers en icônes rondes (logos officiels, Simple Icons), le nom du compte en bulle au survol et
 * au focus (createur.html, voyage.html et sport.html : `.reseaux`, `.reseau`).
 * - `size` : "md" (48 px, défaut : voyage, sport) ou "sm" (46 px, plus serrées : les portes de « Me suivre ») ;
 * - `tone`, la couleur au survol : "k15ze" (le vert), "glass" (un verre posé sur le paysage du voyage ; le Lagon et
 *   l'or au survol), ou rien : celle du parent, qui pose `--u` (« r g b »), `--ic` (l'icône) et `--ring` (le cerne).
 * `label` : le nom de la liste pour les lecteurs d'écran (ex. « Mes comptes sport »).
 */
import { socialsOf, type SocialUniverse } from "@/content/socials";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { useText, type TextSource } from "@/i18n/text";
import { SocialIcon } from "./social-icon";
import styles from "./social-links.module.css";

interface SocialLinksProps {
  universe: SocialUniverse;
  label: TextSource;
  size?: "md" | "sm";
  tone?: "k15ze" | "glass";
  className?: string;
}

export function SocialLinks({ universe, label, size = "md", tone, className }: SocialLinksProps) {
  const { lang } = useLanguage();
  const name = useText(label);
  const cls = [styles.list, size === "sm" && styles.sm, tone && styles[tone], className].filter(Boolean).join(" ");
  return (
    <ul className={cls} role="list" aria-label={name}>
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
