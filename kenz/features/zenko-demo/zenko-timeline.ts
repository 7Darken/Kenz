/**
 * La timeline de la mini-animation de Zenko (./zenko-demo) : l'état de départ, puis vers l'état final du CSS.
 * `start` : le moment où le curseur s'anime (chaque habillage a son tempo). La timeline rendue n'est pas en pause :
 * la fiche l'ajoute à sa boucle, « Comment ça marche » la met en pause et la pilote au défilement.
 */
import { ZENKO_SAMPLE } from "@/content/app-scenes";
import { gsap } from "@/design-system/motion/gsap";

export function zenkoTimeline(root: Element, start: number): gsap.core.Timeline {
  const q = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
  const roll = root.querySelector("[data-zk-roll]");
  const fill = root.querySelector("[data-zk-fill]");
  const knobWrap = root.querySelector("[data-zk-knobwrap]");
  const knob = root.querySelector("[data-zk-knob]");
  const cards = q("[data-zk-card]");
  const acts = q("[data-zk-act]");
  const costs = q("[data-zk-cost]");
  const share = (i: number, key: "before" | "after") => Number(cards[i]?.dataset[key]) || 0.6;
  // Le rouleau finit sur le dernier chiffre (25) : il remonte de tous les autres.
  const steps = ZENKO_SAMPLE.budget.length;
  const at = (offset: number) => start + offset;

  gsap.set(roll, { y: 0, yPercent: 0 });
  gsap.set(fill, { scaleX: 0.8 });
  gsap.set(knobWrap, { x: 0, xPercent: 80 });
  gsap.set(acts, { transformPerspective: 240, rotationX: 0 });
  gsap.set(costs, { scaleX: (i: number) => share(i, "before") });
  gsap.set(cards, { xPercent: (i: number) => [-3, 4, -2][i] ?? 0, rotation: (i: number) => [-1.4, 1.1, -0.7][i] ?? 0 });

  return gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .to(knob, { scale: 1.15, duration: 0.25, ease: "power2.out" }, at(0))
    .to(knobWrap, { xPercent: 50, duration: 1.4, ease: "power2.inOut" }, at(0.15))
    .to(fill, { scaleX: 0.5, duration: 1.4, ease: "power2.inOut" }, at(0.15))
    .to(roll, { yPercent: (-100 * (steps - 1)) / steps, duration: 1.4, ease: "power2.inOut" }, at(0.15))
    .to(knob, { scale: 1, duration: 0.4 }, at(1.55))
    .to(cards, { xPercent: 0, rotation: 0, duration: 0.9, stagger: 0.12 }, at(1.5))
    // Chaque moment se retourne comme une tuile : sa journée est recomposée.
    .to(acts, { rotationX: -360, duration: 1.1, ease: "power3.inOut", stagger: 0.14 }, at(1.5))
    .to(costs, { scaleX: (i: number) => share(i, "after"), duration: 1, stagger: 0.14 }, at(1.7));
}
