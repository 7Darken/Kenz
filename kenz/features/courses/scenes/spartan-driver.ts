/**
 * Le pilote de la scène Spartan Race (port de courses.js, ANIMS.spartan) : le sentier en pleine nature, les
 * obstacles posés dessus ; le point le parcourt d'un trait, saute les murs, les filets et le feu, passe dans
 * la boue ; l'obstacle passé grandit un instant. Légendes : « trail » (sur le sentier), « obstacle:k », « recap ».
 */
import { arrive, clamp01, legendWriter, part, parts, show, win, type SceneFactory } from "./scene-kit";

/** Le viewBox du terrain et le tracé du sentier. */
export const SPARTAN_VIEW = { width: 600, height: 150 } as const;
export const SPARTAN_TRAIL = "M18 124 C 80 110, 116 138, 166 124 S 256 102, 300 116 S 384 144, 432 124 S 520 104, 584 118";

/** La demi-largeur d'un obstacle sur le sentier (en part du trajet). */
const SPAN = 0.055;

export const createSpartanDriver: SceneFactory = (root, onLegend) => {
  const trail = part<SVGPathElement>(root, "trail");
  const done = part<SVGPathElement>(root, "done");
  const decor = part<SVGGElement>(root, "decor");
  const runner = part(root, "runner");
  const obstacles = parts(root, "obstacle");
  const kinds = obstacles.map((el) => el.dataset.kind);
  const places = obstacles.map((el) => Number(el.dataset.at));
  const legend = legendWriter(onLegend);
  const length = trail.getTotalLength() || 600;
  const pointAt = (f: number) => trail.getPointAtLength(length * clamp01(f));

  // Les obstacles se posent sur le sentier.
  obstacles.forEach((el, k) => {
    const p = pointAt(places[k]);
    el.style.left = `${((p.x / SPARTAN_VIEW.width) * 100).toFixed(2)}%`;
    el.style.top = `${((p.y / SPARTAN_VIEW.height) * 100).toFixed(2)}%`;
  });
  done.style.strokeDasharray = `${length} ${length + 2}`;

  /** Une traversée : f de 0 à 1 ; les sauts au-dessus des obstacles ; l'obstacle passé grandit un instant. */
  function race(f: number, visible: number) {
    let dy = 0;
    let active = -1;
    let glow = 0;
    places.forEach((at, k) => {
      const d = (f - at) / SPAN;
      if (Math.abs(d) < 1) {
        const q = (d + 1) / 2;
        const kind = kinds[k];
        if (kind === "wall") dy = -40 * Math.sin(Math.PI * q);
        else if (kind === "net") dy = -44 * (1 - Math.abs(2 * q - 1));
        else if (kind === "jump") dy = -30 * Math.sin(Math.PI * q);
        else if (kind === "mud") dy = 2;
      }
      const gk = clamp01(1 - Math.abs(d) / 1.6);
      if (gk > glow) {
        glow = gk;
        active = k;
      }
    });
    const p = pointAt(f);
    runner.style.left = `${((p.x / SPARTAN_VIEW.width) * 100).toFixed(2)}%`;
    runner.style.top = `${(((p.y + dy) / SPARTAN_VIEW.height) * 100).toFixed(2)}%`;
    runner.style.opacity = String(visible);
    done.style.strokeDashoffset = (length * (1 - f)).toFixed(1);
    obstacles.forEach((el, k) => {
      el.toggleAttribute("data-on", k === active && glow > 0);
      el.toggleAttribute("data-done", f > places[k]);
      el.style.setProperty("--g", k === active ? arrive(glow).toFixed(3) : "0");
    });
    return active;
  }

  const recap = () => legend("recap", "all");

  return {
    intro: 3.3,
    period: 4.8,
    tick(t) {
      if (t < 3.3) {
        const e = arrive(win(t, 0, 0.45));
        show(trail, e);
        show(decor, e);
        obstacles.forEach((el, k) => {
          const a = arrive(win(t, 0.18 + k * 0.08, 0.5 + k * 0.08));
          el.style.opacity = a < 1 ? (a * 0.45).toFixed(3) : "";
          el.style.translate = `0 ${((1 - a) * 10).toFixed(1)}px`;
        });
        // À vitesse constante : chaque obstacle a le temps d'être lu.
        const f = win(t, 0.5, 3);
        const k = race(f, t > 0.45 ? 1 : 0);
        if (t < 3 && k > -1 && f > 0.03) legend(`obstacle:${k}`, k);
        else if (t >= 3) recap();
        else legend("trail", null);
      } else {
        const u = t - 3.3;
        show(trail, 1);
        show(decor, 1);
        obstacles.forEach((el) => {
          el.style.opacity = "";
          el.style.translate = "";
        });
        if (u > 2.3 && u < 4.6) {
          const f = win(u, 2.3, 4.6);
          const k = race(f, clamp01((u - 2.3) / 0.15));
          if (k > -1 && f > 0.03 && f < 0.97) legend(`obstacle:${k}`, k);
          else recap();
        } else {
          race(1, 1);
          recap();
        }
      }
    },
    freeze() {
      race(1, 1);
      recap();
    },
  };
};
