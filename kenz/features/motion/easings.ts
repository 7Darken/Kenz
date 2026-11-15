/**
 * Les courbes de la maquette, côté JS (les mêmes que les jetons CSS de design-system/tokens.css).
 * GSAP : `ease: EASE.expo`. Web Animations : `easing: CSS_EASE.expo`.
 */
export const EASE = {
  /** --expo : les arrivées (lentes à la fin) */
  expo: "expo.out",
  /** --io : les tracés et les glissements */
  inOut: "power3.inOut",
  /** --out : les sorties rapides */
  in: "power3.in",
  /** fondus doux */
  soft: "power2.inOut",
  out: "power2.out",
} as const;

export const CSS_EASE = {
  expo: "cubic-bezier(.16,1,.3,1)",
  inOut: "cubic-bezier(.65,0,.35,1)",
  in: "cubic-bezier(.55,0,.75,.2)",
  soft: "cubic-bezier(.45,0,.55,1)",
  out: "cubic-bezier(.33,1,.68,1)",
} as const;
