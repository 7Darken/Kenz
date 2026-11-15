"use client";

/** Les objets 3D du hero (features/profondeur) : ils entrent après le hero. */
import { Profondeur } from "@/features/profondeur";
import { useHeroEntered } from "./hero-director";
import type { HeroVariant } from "./hero-variants";
import styles from "./hero.module.css";

/** Le titre et le lien portent data-hero-avoid ; la phrase (rendue par <Words>) est reconnue par sa classe. */
const AVOID = `[data-hero-avoid], .${styles.line}`;

export function HeroDepth({ variant }: { variant: HeroVariant }) {
  const entered = useHeroEntered();
  return <Profondeur series={variant} ready={entered} avoidSelector={AVOID} />;
}
