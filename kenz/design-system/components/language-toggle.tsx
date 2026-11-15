"use client";

/**
 * Sélecteur de langue FR / EN (repris de l'ancien LanguageToggle, sans styled-components ni framer-motion) :
 * drapeaux officiels via flagcdn.com, la langue est mémorisée et reportée dans l'URL (`?lang=en`).
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import { flagUrl, LANG_META, LANGUAGES } from "@/i18n/config";
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
          aria-label={t.common.language[code]}
          onClick={() => setLang(code)}
        >
          <Image src={flagUrl(code)} alt="" width={20} height={15} unoptimized />
          {LANG_META[code].label}
        </button>
      ))}
    </div>
  );
}
