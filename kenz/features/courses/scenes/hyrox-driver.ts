/**
 * Le pilote de la scène HYROX (port fidèle de courses.js, ANIMS.hyrox) : la formule « 1 km + 1 station × 8 »
 * se compose (la chaussure, le « + » qui claque, les stations qui défilent puis s'arrêtent, l'impact du « × 8 »),
 * puis se replie en une boucle de course vue de dessus (une ellipse), les 8 stations autour, l'arche, le cœur.
 * Au repos : un tour toutes les 4,6 s, la station passée s'allume.
 */
import { arrive, depart, lerp, part, parts, show, smooth, win, type SceneFactory } from "./scene-kit";

/** La station où la carte s'arrête après avoir défilé (le rameur). */
const STOP = 4;
/** La place de chaque station sur la boucle (0 → 1), juste avant chaque fin de kilomètre. */
const AT = Array.from({ length: 8 }, (_, k) => (k + 1) / 8 - 0.035);

export const createHyroxDriver: SceneFactory = (root) => {
  const svg = part<SVGSVGElement>(root, "svg");
  const ring = part<SVGPathElement>(root, "ring");
  const done = part<SVGPathElement>(root, "done");
  const trails = parts<SVGPathElement>(root, "trail");
  const formula = part(root, "formula");
  const run = part(root, "run");
  const runText = part(root, "run-text");
  const plus = part(root, "plus");
  const station = part(root, "station-card");
  const stationText = part(root, "station-text");
  const card = part(root, "card");
  const slots = parts(root, "slot");
  const times = part(root, "times");
  const timesHalo = part(root, "times-halo");
  const core = part(root, "core");
  const posts = parts(root, "post");
  const arch = part(root, "arch");
  const point = part(root, "point");
  let g = { cx: 0, cy: 0, rx: 0, ry: 0 };
  let frozen = false;

  const at = (f: number, dr = 0) => {
    const a = ((-90 + 360 * f) * Math.PI) / 180;
    return { x: g.cx + (g.rx + dr) * Math.cos(a), y: g.cy + (g.ry + dr) * Math.sin(a) };
  };

  /** La géométrie de la boucle : une ellipse, comme un circuit vu de dessus ; les stations autour. */
  function geo() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    const mobile = w < 420;
    const ic = mobile ? 34 : 52;
    const off = mobile ? 20 : 28;
    const top = root.hasAttribute("data-frozen") ? 26 : 0;
    const ia = ic + 12;
    const cy = top + (h - top) / 2 + 4;
    const ry = (h - top) / 2 - off - ia / 2 - 6;
    const rx = Math.min(w / 2 - off - ic / 2 - 6, ry * 2.7);
    g = { cx: w / 2, cy, rx, ry };
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const d = `M${g.cx} ${cy - ry} A${rx} ${ry} 0 1 1 ${g.cx} ${cy + ry} A${rx} ${ry} 0 1 1 ${g.cx} ${cy - ry}`;
    [ring, done, ...trails].forEach((path) => path.setAttribute("d", d));
    posts.forEach((post, k) => {
      const q = at(AT[k], off);
      post.style.left = `${(q.x - ic / 2).toFixed(1)}px`;
      post.style.top = `${(q.y - ic / 2).toFixed(1)}px`;
      post.style.width = post.style.height = `${ic}px`;
    });
    const qa = at(0, off + 4);
    arch.style.left = `${(qa.x - ia / 2).toFixed(1)}px`;
    arch.style.top = `${(qa.y - ia / 2).toFixed(1)}px`;
    arch.style.width = arch.style.height = `${ia}px`;
    core.style.left = `${g.cx}px`;
    core.style.top = `${cy}px`;
    // La formule, à l'échelle de la scène.
    formula.style.setProperty("--s", Math.min(1, (w - 8) / Math.max(1, formula.scrollWidth)).toFixed(3));
  }

  /** Le point : sa place (f de 0 à 1 sur la boucle), sa traînée ; la station qu'il passe s'allume. */
  function lap(f: number, visible: number) {
    const q = at(f);
    point.style.transform = `translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px)`;
    point.style.opacity = String(visible);
    trails[0].style.strokeDashoffset = (-(f - 0.16)).toFixed(4);
    trails[1].style.strokeDashoffset = (-(f - 0.07)).toFixed(4);
    trails.forEach((path) => {
      path.style.opacity = visible && f > 0.002 && f < 0.998 ? "1" : "0";
    });
    posts.forEach((post, k) => post.toggleAttribute("data-flash", visible > 0 && Math.abs(f - AT[k]) < 0.028));
  }

  /** La boucle se pose ; le tour vert se trace, puis s'efface : restent les 8 segments de 1 km. */
  function loop(opacity: number, traced: number, rest = 1) {
    show(svg, opacity, `scale(${(0.9 + 0.1 * opacity).toFixed(3)})`);
    done.style.strokeDasharray = `${traced.toFixed(4)} 1`;
    done.style.opacity = rest.toFixed(3);
  }

  geo();
  const observer = new ResizeObserver(() => {
    if (!root.isConnected) return;
    geo();
    if (frozen) lap(0, 1);
  });
  observer.observe(root);

  return {
    intro: 3.5,
    period: 4.6,
    tick(t) {
      root.removeAttribute("data-rest");
      if (t < 3.5) {
        // 1. La chaussure entre avec élan : « 1 km ».
        const a = arrive(win(t, 0, 0.45));
        const out = depart(win(t, 2.2, 2.48));
        show(formula, 1 - out, `translate(-50%,-50%) scale(calc(var(--s,1) * ${(1 - 0.3 * out).toFixed(3)}))`);
        show(run, a, `translateX(${((1 - a) * -70).toFixed(1)}px) rotate(${((1 - a) * -10).toFixed(2)}deg)`);
        const at1 = arrive(win(t, 0.14, 0.5));
        show(runText, at1, `translateY(${((1 - at1) * 8).toFixed(1)}px)`);
        // 2. « + » claque ; la carte : les stations défilent (≈ 70 ms), puis s'arrêtent.
        const p = arrive(win(t, 0.7, 0.86));
        show(plus, p, `scale(${lerp(1.8, 1, p).toFixed(3)})`);
        const c = arrive(win(t, 0.74, 0.98));
        show(station, c, `scale(${lerp(0.82, 1, c).toFixed(3)})`);
        const spinning = t >= 0.78 && t < 1.34;
        const index = t < 0.78 ? 0 : spinning ? Math.floor((t - 0.78) / 0.07) % 8 : STOP;
        slots.forEach((slot, k) => {
          slot.style.opacity = k === index ? "1" : "0";
          slot.style.transform =
            k !== index
              ? ""
              : spinning
                ? `translateY(${(6 - 12 * (((t - 0.78) / 0.07) % 1)).toFixed(1)}px)`
                : `translateY(${((1 - arrive(win(t, 1.34, 1.6))) * 10).toFixed(1)}px)`;
        });
        card.toggleAttribute("data-spin", spinning);
        const at2 = arrive(win(t, 1.12, 1.45));
        show(stationText, at2, `translateY(${((1 - at2) * 8).toFixed(1)}px)`);
        // 3. « × 8 » : un impact franc (une légère compression, puis ça se pose).
        const x = win(t, 1.5, 1.86);
        let sx: number;
        let sy: number;
        if (x < 0.22) {
          const k1 = arrive(x / 0.22);
          sx = lerp(1.3, 1.07, k1);
          sy = lerp(1.3, 0.9, k1);
        } else {
          const k2 = arrive((x - 0.22) / 0.78);
          sx = lerp(1.07, 1, k2);
          sy = lerp(0.9, 1, k2);
        }
        show(times, t < 1.5 ? 0 : 1, `scale(${sx.toFixed(3)},${sy.toFixed(3)})`);
        timesHalo.style.opacity = (t < 1.5 ? 0 : 1 - win(t, 1.55, 2.1)).toFixed(3);
        // 4. La formule se replie : la boucle, les stations en cascade, l'arche, le cœur, un tour complet.
        loop(arrive(win(t, 2.24, 2.66)), Math.max(0, smooth(win(t, 2.32, 3.5))));
        posts.forEach((post, k) => {
          const e = arrive(win(t, 2.34 + k * 0.06, 2.66 + k * 0.06));
          show(post, e, `scale(${lerp(0.3, 1, e).toFixed(3)})`);
        });
        const ea = arrive(win(t, 2.28, 2.6));
        show(arch, ea, `translateY(${((1 - ea) * -10).toFixed(1)}px)`);
        const ec = arrive(win(t, 2.55, 2.95));
        show(core, ec, `translate(-50%,-50%) scale(${lerp(0.9, 1, ec).toFixed(3)})`);
        if (t >= 2.32) lap(smooth(win(t, 2.32, 3.5)), 1);
        else lap(0, 0);
      } else {
        // 5. Au repos : un tour toutes les 4,6 s, la station passée s'allume.
        const u = t - 3.5;
        [formula, run, plus, station, times].forEach((el) => show(el, 0));
        loop(1, 1, 1 - arrive(win(u, 0, 0.7)));
        posts.forEach((post) => show(post, 1, ""));
        show(arch, 1, "");
        show(core, 1, "translate(-50%,-50%)");
        if (u > 3.2 && u < 4.4) lap(smooth(win(u, 3.2, 4.4)), 1);
        else {
          lap(0, 1);
          root.setAttribute("data-rest", "");
        }
      }
    },
    freeze() {
      frozen = true;
      geo();
      show(formula, 0);
      loop(1, 1, 0);
      posts.forEach((post) => show(post, 1, ""));
      show(arch, 1, "");
      show(core, 1, "translate(-50%,-50%)");
      lap(0, 1);
    },
    dispose: () => observer.disconnect(),
  };
};
