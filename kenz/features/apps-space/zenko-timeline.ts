/**
 * La timeline de la mini-animation de Zenko (shared/apps.js, SC.zenko.tl) : l'état de départ, puis vers l'état
 * final du CSS. Rendue en pause dans une timeline parente (la fiche la joue en boucle).
 */
import { gsap } from "@/design-system/motion/gsap";

export function zenkoTimeline(root: Element): gsap.core.Timeline {
  const q = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
  const roll = root.querySelector("[data-zk-roll]");
  const fill = root.querySelector("[data-zk-fill]");
  const knobWrap = root.querySelector("[data-zk-knobwrap]");
  const knob = root.querySelector("[data-zk-knob]");
  const cards = q("[data-zk-card]");
  const before = q('[data-zk-icon="before"]');
  const after = q('[data-zk-icon="after"]');
  const costs = q("[data-zk-cost]");
  const share = (i: number, key: "before" | "after") => Number(cards[i]?.dataset[key]) || 0.6;

  gsap.set(roll, { y: 0, yPercent: 0 });
  gsap.set(fill, { scaleX: 0.8 });
  gsap.set(knobWrap, { x: 0, xPercent: 80 });
  gsap.set([...before, ...after], { transformPerspective: 240 });
  gsap.set(before, { opacity: 1, rotationX: 0 });
  gsap.set(after, { opacity: 0, rotationX: -90 });
  gsap.set(costs, { scaleX: (i: number) => share(i, "before") });
  gsap.set(cards, { xPercent: (i: number) => [-3, 4, -2][i] ?? 0, rotation: (i: number) => [-1.4, 1.1, -0.7][i] ?? 0 });

  return gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .to(knob, { scale: 1.15, duration: 0.25, ease: "power2.out" }, 0.25)
    .to(knobWrap, { xPercent: 50, duration: 1.4, ease: "power2.inOut" }, 0.4)
    .to(fill, { scaleX: 0.5, duration: 1.4, ease: "power2.inOut" }, 0.4)
    .to(roll, { yPercent: -93.75, duration: 1.4, ease: "power2.inOut" }, 0.4)
    .to(knob, { scale: 1, duration: 0.4 }, 1.8)
    .to(cards, { xPercent: 0, rotation: 0, duration: 0.9, stagger: 0.12 }, 1.75)
    .to(before, { rotationX: 90, opacity: 0, duration: 0.24, ease: "power2.in", stagger: 0.14 }, 1.8)
    .to(after, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.14 }, 2.05)
    .to(costs, { scaleX: (i: number) => share(i, "after"), duration: 1, stagger: 0.14 }, 1.95)
    .to({}, { duration: 0.5 }, 3);
}
