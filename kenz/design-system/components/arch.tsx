/**
 * L'arche (`kz-arche`) : un cadre au haut en demi-cercle. Variante `cadre` (une photo en cover dedans) ou
 * `lumiere` (un intérieur lumineux) ; `trace` dessine son fil de lumière ; `color` teinte la lumière
 * (« r g b », ex. la couleur d'une app) ; `traceDuration` et `floorOverhang` règlent le tracé et la ligne de sol.
 * Les enfants vont dans l'intérieur découpé.
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
  /** Durée du tracé du fil, en secondes (défaut 2,4 ; le fil fantôme suit, 0,4 s plus lent). */
  traceDuration?: number;
  /** Avec la ligne de sol (sous un fil tracé). */
  floor?: boolean;
  /** Débord de la ligne de sol de chaque côté, en % de la largeur de l'arche (défaut 30). */
  floorOverhang?: number;
  children?: ReactNode;
};

export function Arch({
  variant = "cadre",
  ratio,
  bottomRadius,
  color,
  trace = false,
  traceGap,
  traceDuration,
  floor = false,
  floorOverhang,
  className,
  style,
  children,
  ...props
}: ArchProps) {
  const vars = {
    ...(ratio !== undefined && { "--arche-ratio": ratio }),
    ...(bottomRadius !== undefined && { "--arche-rb": `${bottomRadius}px` }),
    ...(color && { "--arche-c": color }),
    ...(traceDuration !== undefined && { "--trace-dur": `${traceDuration}s` }),
    ...(floorOverhang !== undefined && { "--floor-x": `${-floorOverhang}%` }),
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
