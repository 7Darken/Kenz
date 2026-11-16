"use client";

/**
 * Sélecteur de langue FR / EN : la langue est mémorisée et reportée dans l'URL (`?lang=en`).
 * Les drapeaux sont dessinés ici (aucune requête vers un tiers). Le nom de chaque bouton commence par son
 * texte visible (« FR, Français ») : la commande vocale « FR » le trouve.
 */
import { useId, type CSSProperties } from "react";

import { LANG_LABELS, LANGUAGES, type Lang } from "@/i18n/config";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./language-toggle.module.css";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  const style = { "--active": LANGUAGES.indexOf(lang) } as CSSProperties;

  return (
    <div
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      role="group"
      aria-label={t.common.language.group}
      style={style}
    >
      <span className={styles.pill} aria-hidden="true" />
      {LANGUAGES.map((code) => (
        <button
          key={code}
          className={styles.option}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          aria-label={`${LANG_LABELS[code]}, ${t.common.language[code]}`}
          onClick={() => setLang(code)}
        >
          <Flag lang={code} />
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

/** Le drapeau de la langue, en 4:3 : la France, et le Royaume-Uni pour l'anglais. */
function Flag({ lang }: { lang: Lang }) {
  const clip = useId();
  if (lang === "fr") {
    return (
      <svg width="20" height="15" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path fill="#000091" d="M0 0h1v2H0z" />
        <path fill="#FFF" d="M1 0h1v2H1z" />
        <path fill="#E1000F" d="M2 0h1v2H2z" />
      </svg>
    );
  }
  // Le tracé de référence du Union Jack (1:2), recadré au centre ; les diagonales rouges sont décalées (clip).
  return (
    <svg width="20" height="15" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <clipPath id={clip}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <path fill="#012169" d="M0 0v30h60V0z" />
      <path stroke="#FFF" strokeWidth="6" d="m0 0 60 30m0-30L0 30" />
      <path stroke="#C8102E" strokeWidth="4" clipPath={`url(#${clip})`} d="m0 0 60 30m0-30L0 30" />
      <path stroke="#FFF" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
    </svg>
  );
}
