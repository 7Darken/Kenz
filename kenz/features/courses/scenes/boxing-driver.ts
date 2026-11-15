/**
 * Le pilote de la scène Boxe (port de courses.js, ANIMS.boxe) : les bandes (la base), la garde, puis le jab et
 * le direct au sac ; au repos, un enchaînement de temps en temps. Pas de personnage.
 * Légendes : « step:k » (bandes, garde, jab, direct) et « recap » ; la frise s'allume au coup porté.
 */
import { arrive, clamp01, depart, legendWriter, part, show, win, type SceneFactory } from "./scene-kit";

/** Un coup : il part vite, marque l'impact, revient en garde (s). */
const OUT = 0.16;
const HOLD = 0.12;
const BACK = 0.4;

function extension(t: number, start: number) {
  const u = t - start;
  if (u < 0 || u > OUT + HOLD + BACK) return 0;
  return u < OUT ? depart(u / OUT) : u < OUT + HOLD ? 1 : 1 - arrive((u - OUT - HOLD) / BACK);
}

export const createBoxingDriver: SceneFactory = (root, onLegend) => {
  const wraps = part(root, "wraps");
  const bag = part(root, "bag");
  const gloves = part(root, "gloves");
  const legend = legendWriter(onLegend);

  /** Les gants frappent le sac aux instants `punches` ; le sac oscille. Renvoie le mot du coup porté. */
  function strike(t: number, punches: readonly number[], entry: number) {
    const reach = Math.max(0, bag.offsetLeft - gloves.offsetLeft - gloves.offsetWidth * 0.62);
    let e = 0;
    let low = 0;
    let angle = 0;
    punches.forEach((start, i) => {
      const x = extension(t, start);
      if (x > e) {
        e = x;
        low = i % 2;
      }
      const u = t - (start + OUT);
      if (u > 0) angle += 10 * Math.exp(-u * 2.4) * Math.sin(u * 6.2);
    });
    const bob = e ? 0 : Math.sin(t * 3.2) * 2;
    gloves.style.transform = `translate(${(reach * e - (1 - entry) * 16).toFixed(1)}px,${((low ? e * 8 : -e * 4) + bob).toFixed(1)}px) rotate(${(low ? e * 6 : e * -4).toFixed(2)}deg)`;
    bag.style.transform = `translateY(${((1 - entry) * -12).toFixed(1)}px) rotate(${angle.toFixed(2)}deg)`;
    return e > 0.5 ? (low ? 3 : 2) : -1;
  }

  return {
    intro: 3.2,
    period: 3.6,
    tick(t) {
      if (t < 3.2) {
        const b = t < 0.75 ? arrive(t / 0.45) : 1 - depart((t - 0.75) / 0.22);
        const shown = clamp01(b);
        show(wraps, b, `translateY(${((1 - shown) * (t < 0.75 ? 12 : -10)).toFixed(1)}px) scale(${(0.86 + 0.14 * shown).toFixed(3)})`);
        const g = arrive(win(t, 0.85, 1.25));
        show(bag, g);
        show(gloves, g);
        strike(t, [1.5, 2.2], g);
        if (t < 0.85) legend("step:0", 0);
        else if (t < 1.5) legend("step:1", 1);
        else if (t < 2.2) legend("step:2", 2);
        else if (t < 2.85) legend("step:3", 3);
        else legend("recap", "all");
      } else {
        const u = t - 3.2;
        show(wraps, 0);
        show(bag, 1);
        show(gloves, 1);
        const hit = strike(u, [1.9, 2.25], 1);
        legend("recap", hit > -1 ? hit : "all");
      }
    },
    freeze() {
      [wraps, bag, gloves].forEach((el) => show(el, 1, ""));
      legend("recap", "all");
    },
  };
};
