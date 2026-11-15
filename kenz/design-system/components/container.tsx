/** Conteneur de mise en page : largeur max de la maquette (1240 px) et gouttières (`.wrap`). */
import type { ComponentPropsWithoutRef } from "react";

import styles from "./container.module.css";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "header" | "footer" | "nav";
};

export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={className ? `${styles.container} ${className}` : styles.container} {...props} />;
}
