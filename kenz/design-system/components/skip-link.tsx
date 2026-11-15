/** Lien d'évitement « Aller au contenu », premier élément focusable de chaque univers. */
import { T } from "@/i18n/text";
import styles from "./skip-link.module.css";

export function SkipLink({ target }: { target: string }) {
  return (
    <a className={styles.skip} href={`#${target}`}>
      <T k="common.skip" />
    </a>
  );
}
