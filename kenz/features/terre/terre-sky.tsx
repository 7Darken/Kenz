"use client";

/**
 * Le ciel de la Terre sur /createur : un calque fixe, posé avant le hero (sous son paysage, comme dans la maquette où
 * le paysage s'efface sur lui), opaque derrière le globe pendant le voyage ; il s'efface avec le globe après le trajet.
 */
import styles from "./terre-layer.module.css";
import { useTerreScene } from "./terre-scene";

export function TerreSky() {
  const { setSky } = useTerreScene();
  return <div ref={setSky} className={styles.sky} aria-hidden="true" />;
}
