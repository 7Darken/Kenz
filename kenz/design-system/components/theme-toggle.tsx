"use client";

/** Bouton soleil / lune : bascule clair ↔ sombre (mémorisé, fondu de 400 ms). `bare` : sans pastille. */
import { useTheme } from "@/design-system/theme/theme-provider";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./theme-toggle.module.css";

export function ThemeToggle({ bare = false, className }: { bare?: boolean; className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslation();
  const cls = [styles.toggle, bare && styles.bare, className].filter(Boolean).join(" ");

  return (
    <button
      className={cls}
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t.common.theme.toLight : t.common.theme.toDark}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g className={styles.sun}>
          <circle cx="12" cy="12" r="4.1" />
          <g className={styles.rays}>
            <path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5" />
          </g>
        </g>
        <path className={styles.moon} d="M19.5 14.3A7.6 7.6 0 0 1 9.7 4.5a7.6 7.6 0 1 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
