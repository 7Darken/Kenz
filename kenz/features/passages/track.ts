/**
 * Les animations d'un calque de passage, toutes annulables d'un coup (calque retiré, composant démonté).
 * `tween` interpole 0 → 1 avec une courbe GSAP et laisse l'appelant poser les valeurs : c'est ainsi que la maquette
 * pilote les clip-path, la planète et les tracés image par image, sans dépendre du format des chaînes CSS.
 */
import { gsap } from "@/design-system/motion/gsap";

export interface Track {
  tween: (
    duration: number,
    ease: string,
    update: (k: number) => void,
    options?: { delay?: number; onComplete?: () => void },
  ) => void;
  fromTo: (target: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars) => void;
  after: (seconds: number, callback: () => void) => void;
  kill: () => void;
}

export function createTrack(): Track {
  const live = new Set<gsap.core.Animation>();
  /* Une animation terminée sort du suivi ; les autres sont annulées par kill(). Une durée nulle peut se terminer
     pendant sa création : elle n'entre alors pas dans le suivi. */
  const follow = (create: (done: () => void) => gsap.core.Animation) => {
    let finished = false;
    let animation: gsap.core.Animation | null = null;
    animation = create(() => {
      finished = true;
      if (animation) live.delete(animation);
    });
    if (!finished) live.add(animation);
  };
  return {
    tween(duration, ease, update, { delay = 0, onComplete } = {}) {
      const state = { k: 0 };
      follow((done) =>
        gsap.to(state, {
          k: 1,
          duration,
          delay,
          ease,
          onUpdate: () => update(state.k),
          onComplete: () => {
            done();
            onComplete?.();
          },
        }),
      );
    },
    fromTo(target, from, to) {
      const onComplete = to.onComplete;
      follow((done) =>
        gsap.fromTo(target, from, {
          ...to,
          onComplete: () => {
            done();
            onComplete?.();
          },
        }),
      );
    },
    after(seconds, callback) {
      follow((done) =>
        gsap.delayedCall(seconds, () => {
          done();
          callback();
        }),
      );
    },
    kill() {
      live.forEach((animation) => animation.kill());
      live.clear();
    },
  };
}

/** Une valeur en px, arrondie au dixième (comme la maquette). */
export const px = (n: number) => `${Math.round(n * 10) / 10}px`;

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Interpolation douce entre deux seuils (smoothstep). */
export function smooth(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
