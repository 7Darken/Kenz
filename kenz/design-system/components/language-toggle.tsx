"use client";

/**
 * Sélecteur de langue compact, en texte : « FR · EN ». La langue active est soulignée ;
 * le choix est mémorisé et reporté dans l'URL (`?lang=en`). Le nom de chaque bouton commence par son
 * texte visible (« FR, Français ») : la commande vocale « FR » le trouve.
 */
import { Fragment } from "react";

import { LANG_LABELS, LANGUAGES } from "@/i18n/config";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./language-toggle.module.css";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      role="group"
      aria-label={t.common.language.group}
    >
      {LANGUAGES.map((code, index) => (
        <Fragment key={code}>
          {index > 0 ? (
            <span className={styles.separator} aria-hidden="true">
              ·
            </span>
          ) : null}
          <button
            className={styles.option}
            type="button"
            lang={code}
            aria-pressed={lang === code}
            aria-label={`${LANG_LABELS[code]}, ${t.common.language[code]}`}
            onClick={() => setLang(code)}
          >
            {LANG_LABELS[code]}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
