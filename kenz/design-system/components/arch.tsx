/**
 * L'arche (`kz-arche`) : un cadre au haut en demi-cercle. Variante `cadre` (une photo en cover dedans) ou
 * `lumiere` (un intérieur lumineux) ; `trace` dessine son fil de lumière ; `color` teinte la lumière
 * (« r g b », ex. la couleur d'une app). Les enfants vont dans l'intérieur découpé.
 */
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

import type { RgbTriplet } from "@/content/types";
import styles from "./arch.module.css";
import { ArchTrace } from "./arch-trace";

type ArchProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  variant?: "cadre" | "lumiere";
  /** Largeur / hauteur (défaut .714). */
  ratio?: number;
  /** Rayon des coins du bas (px). */
  bottomRadius?: number;
  /** Couleur de la lumière (« r g b »), défaut : la lumière de l'univers. */
  color?: RgbTriplet;
  /** Dessine le fil : `true` à l'entrée à l'écran, ou { traced } pour le piloter. */
  trace?: boolean | { traced: boolean };
  /** Écart du fil fantôme (px). */
  traceGap?: number;
  /** Avec la ligne de sol (sous un fil tracé). */
  floor?: boolean;
  children?: ReactNode;
};

export function Arch({
  variant = "cadre",
  ratio,
  bottomRadius,
  color,
  trace = false,
  traceGap,
  floor = false,
  className,
  style,
  children,
  ...props
}: ArchProps) {
  const vars = {
    ...(ratio !== undefined && { "--arche-ratio": ratio }),
    ...(bottomRadius !== undefined && { "--arche-rb": `${bottomRadius}px` }),
    ...(color && { "--arche-c": color }),
    ...style,
  } as CSSProperties;
  const cls = [styles.arch, variant === "lumiere" && styles.light, className].filter(Boolean).join(" ");

  return (
    <div className={cls} style={vars} {...props}>
      {children !== undefined ? <div className={styles.inner}>{children}</div> : null}
      {trace ? (
        <ArchTrace traced={typeof trace === "object" ? trace.traced : undefined} gap={traceGap} floor={floor} />
      ) : floor ? (
        <i className={`${styles.floor} ${styles.floorStatic}`} aria-hidden="true" />
      ) : null}
    </div>
  );
}
