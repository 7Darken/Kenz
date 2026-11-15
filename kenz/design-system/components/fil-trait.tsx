/** Le trait du fil en haut d'un chapitre : caché sans JS, révélé et piloté par <Fil> (sauf au 1er chapitre). */
import styles from "./fil.module.css";

export function FilTrait({ centered = false }: { centered?: boolean }) {
  return (
    <span
      className={centered ? `${styles.trait} ${styles.traitCenter}` : styles.trait}
      data-fil-trait=""
      aria-hidden="true"
      hidden
    />
  );
}
