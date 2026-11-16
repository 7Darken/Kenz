/**
 * Les courbes de la maquette pour les Web Animations (les mêmes que les jetons CSS de design-system/tokens.css) :
 * `easing: CSS_EASE.expo`. GSAP prend ses noms de courbe directement (`ease: "expo.out"`).
 */
export const CSS_EASE = {
  expo: "cubic-bezier(.16,1,.3,1)",
  inOut: "cubic-bezier(.65,0,.35,1)",
  in: "cubic-bezier(.55,0,.75,.2)",
  soft: "cubic-bezier(.45,0,.55,1)",
  out: "cubic-bezier(.33,1,.68,1)",
} as const;
