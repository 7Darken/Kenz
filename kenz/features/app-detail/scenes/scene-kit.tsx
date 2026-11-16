/**
 * Les outils communs aux animations « Comment ça marche » : la case cochée, et la recherche des pièces
 * animées par leurs ancres `data-s` (le style, lui, vit dans les CSS Modules des scènes).
 */
import { shownImage } from "@/design-system/components/themed-image";
import type { gsap } from "@/design-system/motion/gsap";
import styles from "./scene.module.css";

/** Construit la timeline (en pause) d'une scène à partir de son écran ; l'état final est celui du CSS. */
export type SceneBuilder = (core: HTMLElement) => gsap.core.Timeline;

export function one<T extends Element = HTMLElement>(scope: Element, name: string): T {
  // Une pièce en deux versions (ThemedImage, clair et sombre) : celle qui est affichée.
  const el = shownImage<T>(scope, `[data-s="${name}"]`);
  if (!el) throw new Error(`scène : pièce « ${name} » introuvable`);
  return el;
}

export function all<T extends Element = HTMLElement>(scope: Element, name: string): T[] {
  return Array.from(scope.querySelectorAll<T>(`[data-s="${name}"]`));
}

/** La pastille de remplissage et la coche d'une case. */
export const checkParts = (check: Element) => ({
  fill: check.querySelector("i"),
  mark: check.querySelector("path"),
});

/** Une case cochée (sa pastille, puis sa coche tracée). */
export function Check({ className, name = "chk" }: { className?: string; name?: string }) {
  return (
    <span className={className ? `${styles.chk} ${className}` : styles.chk} data-s={name}>
      <i />
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path pathLength={1} d="M7 12.5l3.2 3.2L17 9" />
      </svg>
    </span>
  );
}
