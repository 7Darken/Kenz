/**
 * La légende d'une scène (un titre, sa précision ; en vert quand elle nomme une étape) et la frise de mots
 * dont le mot en cours s'allume. La clé de la légende relance son petit fondu à chaque changement.
 */
import styles from "./scene.module.css";

interface SceneLegendProps {
  legendKey: string;
  title: string;
  hint: string;
  green: boolean;
  words: readonly string[];
  /** Le mot allumé, tous, ou aucun. */
  on: number | "all" | null;
}

export function SceneLegendView({ legendKey, title, hint, green, words, on }: SceneLegendProps) {
  return (
    <>
      <p key={legendKey} className={green ? `${styles.label} ${styles.green}` : styles.label}>
        <span className={styles.labelTitle}>{title}</span>
        <span className={styles.labelHint}>{hint}</span>
      </p>
      <p className={styles.words}>
        {words.map((word, index) => (
          <span key={word} className={on === "all" || on === index ? styles.on : undefined}>
            {word}
          </span>
        ))}
      </p>
    </>
  );
}
