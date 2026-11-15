/** Le grand titre de chapitre de /agents (« Et chez vous ? », « Comment on avance ») : Melodrama, sur toute sa largeur. */
import type { ComponentPropsWithoutRef } from "react";

import styles from "./section-title.module.css";

export function SectionTitle({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return <h2 className={className ? `${styles.title} ${className}` : styles.title} {...props} />;
}
