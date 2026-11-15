/**
 * Le moteur de la scène des apps (shared/apps.js) : le ciel, la fiche holographique, le départ, l'arrivée.
 * React rend le décor (couches, astres, fils, fiches) ; le moteur l'anime, par attributs et styles en ligne.
 *
 * LE CIEL : quatre couches en parallaxe au pointeur (4, 10, 18, 30 px, lissé) et au défilement ; des fils de
 * lumière relient les astres voisins ; toutes les 4 s environ, un photon passe de l'un au suivant, qui s'éclaire.
 * Une seule boucle requestAnimationFrame, arrêtée hors écran. À l'arrivée : les étoiles s'allument depuis le
 * centre, les nébuleuses s'épanouissent, les astres s'allument un à un.
 * LA FICHE (survol à la souris, focus clavier, premier toucher) : près de l'astre, du côté où il y a de la place,
 * reliée à lui par un fil de lumière. Apparition holographique en 340 ms, disparition en 180 ms ; la caméra glisse
 * à peine vers l'astre (≈ 3 %), les autres s'atténuent.
 * LE DÉPART (clic, Entrée, « Explorer », deuxième toucher) : la caméra plonge vers l'astre, les autres filent
 * hors du cadre, la fiche se replie dans l'icône ; puis le passage (openPassage) : l'icône vole vers la page.
 * Mouvement réduit : ciel fixe sans scintillement, pas de caméra, des fondus.
 */
import { CSS_EASE } from "@/features/motion/easings";
import { openPassage } from "@/features/passages";
import { createSky, type Zone } from "./space-sky";
import { playAnimation, playGallery, type PreviewController } from "./space-preview";
import { createTrace, TRACE_FADE_MS, TRACE_THRESHOLD, type StarPoint } from "./space-trace";

interface SpaceEngineApp {
  color: string;
  href: string;
  icon: string;
  preview: "gallery" | "animation";
}

interface SpaceEngineOptions {
  apps: readonly SpaceEngineApp[];
  /** Les index des astres du code secret, dans l'ordre. */
  code: readonly number[];
  /** Rend la fiche de l'app k (synchrone : elle est mesurée juste après). */
  showPanel: (k: number) => void;
  /** Classes des segments du tracé (CSS Module). */
  segmentClass: { group: string; halo: string; line: string };
}

/** Parallaxe au pointeur (px) : lointaines, nébuleuses, astres, poussière. */
const PARALLAX = [4, 10, 18, 30];
/** Travelling de caméra au défilement (px). */
const TRAVEL = [6, 16, 30, 54];
/** Caméra au survol : ≈ 3 % de zoom vers l'astre ; [échelle, part du recentrage]. */
const HOVER_ZOOM = [[1.012, 0.01], [1.025, 0.02], [1.03, 0.02], [1.06, 0.05]] as const;
/** Caméra au départ : la plongée. */
const DIVE_ZOOM = [[1.05, 0.12], [1.2, 0.4], [1.8, 1], [2.5, 1.6]] as const;
const ICON_SIZE = 112;
const IOS = "cubic-bezier(.2,.8,.2,1)";
const FAST = "cubic-bezier(.4,0,1,1)";

const px = (v: number) => `${Math.round(v * 10) / 10}px`;
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function required<T extends Element>(root: Element, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`apps-space : élément manquant ${selector}`);
  return el;
}

export function startSpace(scene: HTMLElement, options: SpaceEngineOptions): () => void {
  const { apps } = options;
  const canvas = required<HTMLCanvasElement>(scene, "[data-sky-canvas]");
  const layers = ["loin", "neb", "dock", "pous"].map((name) => required<HTMLElement>(scene, `[data-layer="${name}"]`));
  const dock = layers[2];
  const astres = Array.from(scene.querySelectorAll<HTMLElement>("[data-astre]"));
  const filLines = Array.from(scene.querySelectorAll<SVGLineElement>("[data-fil]"));
  const filGrads = Array.from(scene.querySelectorAll<SVGLinearGradientElement>("[data-fil-grad]"));
  const svgs = Array.from(scene.querySelectorAll<SVGSVGElement>("[data-viewbox]"));
  const photon = required<SVGGElement>(scene, "[data-photon]");
  const photonTrail = Array.from(scene.querySelectorAll<SVGElement>("[data-photon-trail]"));
  const photonDots = Array.from(scene.querySelectorAll<SVGCircleElement>("[data-photon-dot]"));
  const legend = required<SVGSVGElement>(scene, "[data-legend]");
  const legendLine = required<SVGPathElement>(scene, "[data-legend-line]");
  const legendDot = required<SVGCircleElement>(scene, "[data-legend-dot]");
  const fiche = required<HTMLElement>(scene, "[data-fiche]");
  const scan = required<HTMLElement>(scene, "[data-fiche-scan]");

  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = () => mqReduced.matches;
  const now = () => performance.now();
  const sky = createSky(canvas, layers[0]);
  const cleanups: (() => void)[] = [];
  let dead = false;
  /** Un écouteur, retiré au démontage. Le type d'événement est celui annoncé par le gestionnaire. */
  const listen = <E extends Event>(target: EventTarget, type: string, fn: (event: E) => void, opts?: AddEventListenerOptions) => {
    const handler = fn as EventListener;
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };

  /* ---------- L'état ---------- */
  let W = 0;
  let H = 0;
  let pts: StarPoint[] = [];
  let segs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const parallax = layers.map(() => [0, 0]);
  let nx = 0;
  let ny = 0;
  let raf = 0;
  let active = false;
  let visible = false;
  let seen = false;
  let arrival = 0;
  let skyReady = false;
  const arrivalAnims: Animation[] = [];
  const arrivalTimers: number[] = [];
  const glint = { k: 0, t: 0, next: 0 };
  let hovered = -1;
  let open = -1;
  let ficheBox: { x: number; y: number; w: number; h: number; s: number; v: number } | null = null;
  let ficheAnims: Animation[] = [];
  let ficheTimer = 0;
  let preview: PreviewController | null = null;
  let pointerType = "";
  let leaving = false;
  let plunge = 0;
  let plungeX = 0;
  let plungeY = 0;
  let hoverDelay = 0;
  let restoreTimer = 0;

  /* ---------- Mesures ---------- */
  function textZones(): Zone[] {
    const r = scene.getBoundingClientRect();
    return Array.from(scene.querySelectorAll("[data-zone]"))
      .map((el) => {
        const b = el.getBoundingClientRect();
        return { x: b.left - r.left - 36, y: b.top - r.top - 36, w: b.width + 72, h: b.height + 72 };
      })
      .filter((z) => z.w > 74);
  }

  function measure() {
    W = scene.clientWidth;
    H = scene.clientHeight;
    if (!W || !H) return;
    pts = astres.map((t) => ({ x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, r: t.offsetWidth / 2 }));
    svgs.forEach((svg) => svg.setAttribute("viewBox", `0 0 ${W} ${H}`));
    // Les fils partent du bord de la lueur de chaque astre.
    segs = pts.slice(0, -1).map((a, i) => {
      const b = pts[i + 1];
      const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const ux = (b.x - a.x) / L;
      const uy = (b.y - a.y) / L;
      const s = { x1: a.x + ux * a.r * 1.3, y1: a.y + uy * a.r * 1.3, x2: b.x - ux * b.r * 1.3, y2: b.y - uy * b.r * 1.3 };
      ([filLines[i], filGrads[i]] as const).forEach((el) => {
        if (!el) return;
        el.setAttribute("x1", n1(s.x1));
        el.setAttribute("y1", n1(s.y1));
        el.setAttribute("x2", n1(s.x2));
        el.setAttribute("y2", n1(s.y2));
      });
      return s;
    });
    sky.measure(textZones());
    if (open >= 0 && !leaving) {
      placeFiche(open);
      camera(open, "hover");
    }
    if (reduced() || !active) drawSky(now());
  }

  function drawSky(t: number) {
    const box = open >= 0 ? ficheBox : null;
    sky.draw({
      t,
      reduced: reduced(),
      arrival,
      plunge,
      plungeX,
      plungeY,
      shooting: skyReady && !leaving,
      extraZones: box ? [{ x: box.x - 40, y: box.y - 40, w: box.w + 80, h: box.h + 80 }] : [],
      W,
      H,
    });
  }

  /* ---------- Le reflet : un photon passe d'un astre au suivant, qui s'éclaire ---------- */
  function setPhoton(i: number, k: number) {
    const s = segs[i];
    if (k < 0 || !s) {
      photon.removeAttribute("data-on");
      return;
    }
    const e = 0.5 - Math.cos(Math.PI * k) / 2;
    const b = Math.max(0, e - 0.3);
    const x = s.x1 + (s.x2 - s.x1) * e;
    const y = s.y1 + (s.y2 - s.y1) * e;
    const xt = s.x1 + (s.x2 - s.x1) * b;
    const yt = s.y1 + (s.y2 - s.y1) * b;
    photonTrail.forEach((el) => {
      el.setAttribute("x1", n1(xt));
      el.setAttribute("y1", n1(yt));
      el.setAttribute("x2", n1(x + 0.1));
      el.setAttribute("y2", n1(y));
    });
    photonDots.forEach((c) => {
      c.setAttribute("cx", n1(x));
      c.setAttribute("cy", n1(y));
    });
    photon.setAttribute("opacity", clamp(Math.min(k / 0.08, (1 - k) / 0.1), 0, 1).toFixed(3));
    photon.setAttribute("data-on", "");
  }

  function glintStep(t: number) {
    if (!skyReady || leaving || open >= 0 || trace.isActive() || reduced()) {
      if (glint.t) {
        glint.t = 0;
        setPhoton(0, -1);
      }
      return;
    }
    if (!glint.t) {
      if (t < glint.next) return;
      glint.t = t;
    }
    const k = (t - glint.t) / 1150;
    if (k >= 1) {
      setPhoton(0, -1);
      flash(glint.k + 1);
      glint.t = 0;
      glint.k = (glint.k + 1) % (apps.length - 1);
      glint.next = t + 2900;
      return;
    }
    setPhoton(glint.k, k);
  }

  /** L'éclat d'un astre : l'aigrette s'allonge, le halo s'avive, puis tout revient. */
  function flash(i: number, strong = false) {
    const star = astres[i];
    if (!star || reduced()) return;
    const aig = star.querySelector("[data-aig]");
    const hal = star.querySelector("[data-hal]");
    const m = strong ? 2.3 : 1.7;
    const timing = { duration: strong ? 1200 : 950, easing: IOS };
    aig?.animate([{ transform: "scale(1)" }, { transform: `scale(${m})`, offset: 0.28 }, { transform: "scale(1)" }], timing);
    hal?.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: `scale(${strong ? 1.5 : 1.25})`, filter: "brightness(1.9)", offset: 0.25 },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      timing,
    );
  }

  /* ---------- La boucle unique : parallaxe, ciel, reflet, légende de la fiche ---------- */
  function loop(t: number) {
    raf = 0;
    if (!active) return;
    const rm = reduced();
    const vh = window.innerHeight || 1;
    const r = scene.getBoundingClientRect();
    const sp = rm ? 0 : clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
    const boost = open >= 0 ? 1.6 : 1;
    layers.forEach((layer, i) => {
      const p = parallax[i];
      const tx = rm ? 0 : -nx * PARALLAX[i] * boost;
      const ty = rm ? 0 : -ny * PARALLAX[i] * 0.75 * boost + sp * TRAVEL[i];
      p[0] += (tx - p[0]) * 0.075;
      p[1] += (ty - p[1]) * 0.075;
      layer.style.translate = `${px(p[0])} ${px(p[1])}`;
    });
    drawSky(t);
    glintStep(t);
    if (open >= 0) drawLegend();
    if (!rm || plunge) raf = requestAnimationFrame(loop);
  }

  function setActive() {
    const on = visible && !document.hidden;
    if (on === active) return;
    active = on;
    scene.toggleAttribute("data-actif", on);
    if (on) {
      if (!raf) raf = requestAnimationFrame(loop);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  /** La caméra. « hover » : elle glisse à peine vers l'astre. « dive » : elle plonge vers lui (chaque couche
   *  grossit selon sa profondeur), les autres astres filent hors du cadre. */
  function camera(i: number, mode: "hover" | "dive" = "hover") {
    const P = pts[i];
    const zoom = mode === "dive" ? DIVE_ZOOM : HOVER_ZOOM;
    const R = Math.max(W, H) * 0.9;
    astres.forEach((star, j) => {
      const Q = pts[j];
      if (mode !== "dive" || i < 0 || j === i || reduced() || !P || !Q) {
        star.style.translate = "";
        return;
      }
      const L = Math.hypot(Q.x - P.x, Q.y - P.y) || 1;
      star.style.translate = `${px(((Q.x - P.x) / L) * R)} ${px(((Q.y - P.y) / L) * R)}`;
    });
    layers.forEach((layer, j) => {
      if (i < 0 || reduced() || !P) {
        layer.style.transform = "";
        return;
      }
      zoomLayer(layer, zoom[j], P.x, P.y);
    });
  }

  function zoomLayer(layer: HTMLElement, [scale, recenter]: readonly [number, number], x: number, y: number) {
    const lx = x - layer.offsetLeft;
    const ly = y - layer.offsetTop;
    layer.style.transform = `translate(${px(lx + (W / 2 - x) * recenter - scale * lx)},${px(ly + (H / 2 - y) * recenter - scale * ly)}) scale(${scale})`;
  }

  function hover(k: number) {
    if (hovered === k) return;
    hovered = k;
    dock.toggleAttribute("data-survol", k >= 0);
    astres.forEach((star, j) => star.toggleAttribute("data-vise", j === k));
  }

  /* ---------- La fiche holographique ---------- */
  function stopPreview() {
    preview?.kill();
    preview = null;
  }
  function cancelFicheAnims() {
    ficheAnims.forEach((a) => a.cancel());
    ficheAnims = [];
  }

  /** À côté de l'astre, du côté où il y a de la place, jamais hors du cadre ; si la galerie ne tient d'aucun
   *  côté (écran étroit), au-dessus ou au-dessous. On garde la place qui recouvre le moins d'autres astres. */
  function placeFiche(k: number) {
    const P = pts[k];
    if (!P) return;
    const small = W < 600;
    const fw = fiche.offsetWidth;
    const fh = fiche.offsetHeight;
    const m = small ? 12 : 24;
    const top = small ? 92 : 104;
    const bottom = small ? 40 : 72;
    const slide = HOVER_ZOOM[2][1];
    const x0 = P.x + (W / 2 - P.x) * slide;
    const y0 = P.y + (H / 2 - P.y) * slide;
    const gap = P.r * 1.2 + (small ? 14 : 64);
    const yMax = Math.max(top, H - bottom - fh);
    const cx = (v: number) => clamp(v, m, W - m - fw);
    const cy = (v: number) => clamp(v, top, yMax);
    const sides = [
      { x: x0 + gap, s: 1 },
      { x: x0 - gap - fw, s: -1 },
    ];
    if (x0 > W / 2) sides.reverse();
    const free = sides.filter((c) => c.x >= m && c.x + fw <= W - m);
    const gallery = apps[k]?.preview === "gallery";
    let best: { x: number; y: number; s: number; v: number; cost: number } | null = null;
    const attempt = (x: number, y: number, s: number, v: number, base: number) => {
      let cost = base;
      if (gallery && P.x + P.r > x && P.x - P.r < x + fw && P.y + P.r > y && P.y - P.r < y + fh) cost += 4;
      pts.forEach((q, j) => {
        if (j !== k && q.x + q.r + 14 > x && q.x - q.r - 14 < x + fw && q.y + q.r + 14 > y && q.y - q.r - 14 < y + fh) cost += 1;
      });
      if (!best || cost < best.cost) best = { x, y, s, v, cost };
    };
    (free.length ? free : [sides[0]]).forEach((side, si) => {
      [y0 - fh / 2, y0 - P.r * 1.4, y0 - fh + P.r * 1.4, y0 + P.r * 0.5, y0 - fh - P.r * 0.5].forEach((yc, o) => {
        attempt(cx(side.x), cy(yc), side.s, 0, o * 0.1 + si * 0.5 + (free.length ? 0 : 2));
      });
    });
    if (!free.length && gallery) {
      const gv = P.r * 1.4 + (small ? 12 : 30);
      ([[y0 + gv, 1], [y0 - gv - fh, -1]] as const).forEach(([y, v], o) => {
        attempt(cx(x0 - fw / 2), cy(y), 0, v, 1 + o * 0.1 + (y < top - 1 || y > yMax + 1 ? 2 : 0));
      });
    }
    const chosen = best as { x: number; y: number; s: number; v: number; cost: number } | null;
    if (!chosen) return;
    fiche.style.left = px(chosen.x);
    fiche.style.top = px(chosen.y);
    ficheBox = { x: chosen.x, y: chosen.y, w: fw, h: fh, s: chosen.s, v: chosen.v };
  }

  /** La légende de HUD : un fil de lumière de l'astre à la fiche (il suit l'astre pendant la parallaxe). */
  function drawLegend() {
    const F = ficheBox;
    const icon = astres[open]?.querySelector("img");
    if (!F || !icon) return;
    const r = scene.getBoundingClientRect();
    const b = icon.getBoundingClientRect();
    const ax = b.left - r.left + b.width / 2;
    const ay = b.top - r.top + b.height / 2;
    const R = b.width * 0.82;
    let d: string;
    let sx: number;
    let sy: number;
    if (F.v) {
      // Fiche au-dessus ou au-dessous : le fil descend (ou monte) droit vers son bord.
      const ex = clamp(ax, F.x + 28, F.x + F.w - 28);
      const ey = F.v > 0 ? F.y : F.y + F.h;
      const L = Math.hypot(ex - ax, ey - ay) || 1;
      sx = ax + ((ex - ax) / L) * R;
      sy = ay + ((ey - ay) / L) * R;
      d = `M${n1(sx)} ${n1(sy)}L${n1(ex)} ${n1(ey)}`;
    } else {
      const ex = F.s > 0 ? F.x : F.x + F.w;
      const ey = clamp(ay, F.y + 28, F.y + F.h - 28);
      const kx = ex - F.s * 20;
      const L = Math.hypot(kx - ax, ey - ay) || 1;
      sx = ax + ((kx - ax) / L) * R;
      sy = ay + ((ey - ay) / L) * R;
      d =
        (kx - sx) * F.s < 6
          ? `M${n1(sx)} ${n1(sy)}L${n1(ex)} ${n1(ey)}`
          : `M${n1(sx)} ${n1(sy)}L${n1(kx)} ${n1(ey)}L${n1(ex)} ${n1(ey)}`;
    }
    legendLine.setAttribute("d", d);
    legendDot.setAttribute("cx", n1(sx));
    legendDot.setAttribute("cy", n1(sy));
  }

  function finishArrival() {
    arrivalAnims.forEach((a) => a.finish());
    arrivalTimers.forEach(window.clearTimeout);
    arrivalTimers.length = 0;
    skyReady = true;
  }

  function openFiche(k: number) {
    if (leaving || !seen) return;
    window.clearTimeout(ficheTimer);
    if (open === k) return;
    const app = apps[k];
    if (!app) return;
    if (!skyReady) finishArrival();
    open = k;
    hover(k);
    fiche.style.setProperty("--c", app.color);
    legend.style.setProperty("--c", app.color);
    options.showPanel(k);
    stopPreview();
    const panel = fiche.querySelector(`[data-panel="${k}"]`);
    if (panel) preview = app.preview === "gallery" ? playGallery(panel, reduced()) : playAnimation(panel, reduced());
    cancelFicheAnims();
    fiche.style.transformOrigin = "";
    fiche.setAttribute("data-on", "");
    legend.setAttribute("data-on", "");
    placeFiche(k);
    drawLegend();
    camera(k, "hover");
    const rm = reduced();
    const h = fiche.offsetHeight;
    // Apparition holographique : un balayage la dessine de haut en bas, du flou au net, une très légère
    // aberration de couleur sur les bords, à l'arrivée seulement.
    ficheAnims.push(
      fiche.animate(
        rm
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              {
                opacity: 0.35,
                clipPath: "inset(0% 0% 100% 0% round 20px)",
                filter: "blur(7px) drop-shadow(3px 0px 0px rgba(255,64,120,.65)) drop-shadow(-3px 0px 0px rgba(64,214,255,.65))",
              },
              {
                opacity: 0.95,
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                filter: "blur(1.5px) drop-shadow(1.5px 0px 0px rgba(255,64,120,.3)) drop-shadow(-1.5px 0px 0px rgba(64,214,255,.3))",
                offset: 0.72,
              },
              {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                filter: "blur(0px) drop-shadow(0px 0px 0px rgba(255,64,120,0)) drop-shadow(0px 0px 0px rgba(64,214,255,0))",
              },
            ],
        { duration: rm ? 200 : 340, easing: IOS },
      ),
    );
    if (!rm) {
      ficheAnims.push(
        scan.animate(
          [
            { transform: "translateY(0px)", opacity: 1 },
            { transform: `translateY(${h}px)`, opacity: 0.9, offset: 0.86 },
            { transform: `translateY(${h}px)`, opacity: 0 },
          ],
          { duration: 320, easing: "cubic-bezier(.45,0,.55,1)" },
        ),
        legendLine.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 240, easing: IOS }),
      );
    }
  }

  function closeFiche(fast = false) {
    window.clearTimeout(ficheTimer);
    if (open < 0 || leaving) return;
    open = -1;
    hover(-1);
    camera(-1);
    cancelFicheAnims();
    const end = () => {
      fiche.removeAttribute("data-on");
      legend.removeAttribute("data-on");
      stopPreview();
      cancelFicheAnims();
    };
    if (fast) {
      end();
      return;
    }
    const out = fiche.animate(
      [
        { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
        { opacity: 0, filter: "blur(4px)", transform: "scale(.985)" },
      ],
      { duration: 180, easing: FAST, fill: "forwards" },
    );
    ficheAnims = [out, legend.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: FAST, fill: "forwards" })];
    out.onfinish = () => {
      if (open < 0) end();
    };
  }

  function closeFicheSoon() {
    window.clearTimeout(ficheTimer);
    ficheTimer = window.setTimeout(() => closeFiche(), 170);
  }

  /* ---------- Le départ ---------- */
  function restore() {
    leaving = false;
    plunge = 0;
    scene.removeAttribute("data-saut");
    cancelFicheAnims();
    fiche.removeAttribute("data-on");
    legend.removeAttribute("data-on");
    stopPreview();
    open = -1;
    hover(-1);
    camera(-1);
  }

  function explore(k: number) {
    if (leaving || k < 0) return;
    const app = apps[k];
    const icon = astres[k]?.querySelector("img");
    if (!app || !icon) return;
    const r = scene.getBoundingClientRect();
    const b = icon.getBoundingClientRect();
    leaving = true;
    window.clearTimeout(ficheTimer);
    scene.setAttribute("data-saut", "");
    hover(k);
    // La fiche se replie dans l'icône.
    if (open >= 0 && !reduced() && ficheBox) {
      const F = ficheBox;
      const tx = b.left - r.left + b.width / 2 - (F.x + F.w / 2);
      const ty = b.top - r.top + b.height / 2 - (F.y + F.h / 2);
      cancelFicheAnims();
      fiche.style.transformOrigin = "50% 50%";
      const fold = fiche.animate(
        [
          { transform: "translate(0px,0px) scale(1)", opacity: 1, filter: "blur(0px)" },
          { transform: `translate(${px(tx)},${px(ty)}) scale(.06)`, opacity: 0, filter: "blur(3px)" },
        ],
        { duration: 320, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" },
      );
      ficheAnims = [fold, legend.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: FAST, fill: "forwards" })];
      fold.onfinish = stopPreview;
    } else {
      fiche.removeAttribute("data-on");
      legend.removeAttribute("data-on");
      stopPreview();
    }
    open = -1;
    plunge = now();
    plungeX = b.left - r.left + b.width / 2;
    plungeY = b.top - r.top + b.height / 2;
    camera(k, "dive");
    if (!raf && active) raf = requestAnimationFrame(loop);
    // Puis le passage : l'icône se détache et se pose au centre, la couleur de l'app remplit l'écran.
    if (!openPassage(icon, app.href, { color: app.color, icon: app.icon, size: ICON_SIZE })) {
      restoreTimer = window.setTimeout(restore, 900);
    }
  }

  /* ---------- Le tracé (passage secret) ---------- */
  const traceGroup = required<SVGGElement>(scene, "[data-trace-group]");
  const trace = createTrace({
    scene,
    dock,
    astres,
    points: () => pts,
    width: () => W,
    code: options.code,
    canStart: () => seen && !leaving,
    onStart: () => {
      if (!skyReady) finishArrival();
      if (open >= 0) closeFiche();
      else {
        window.clearTimeout(ficheTimer);
        hover(-1);
      }
    },
    flash: (k) => flash(k),
    onSuccess: () => {
      leaving = true;
    },
    plunge: (x, y) => {
      const r = scene.getBoundingClientRect();
      plunge = now();
      plungeX = x - r.left;
      plungeY = y - r.top;
      scene.setAttribute("data-saut", "");
      layers.forEach((layer, j) => zoomLayer(layer, DIVE_ZOOM[j], plungeX, plungeY));
      if (!raf && active) raf = requestAnimationFrame(loop);
    },
    onReset: (fromSuccess) => {
      if (fromSuccess) restore();
    },
    reduced,
    group: traceGroup,
    live: required<SVGGElement>(scene, "[data-trace-live]"),
    ember: required<SVGCircleElement>(scene, "[data-trace-ember]"),
    segmentClass: options.segmentClass,
  });

  /* ---------- Les gestes ---------- */
  const isMouse = (e: PointerEvent) => e.pointerType === "mouse" && mqMouse.matches;
  const modified = (e: MouseEvent) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  astres.forEach((star, k) => {
    listen(star, "pointerdown", (e: PointerEvent) => {
      pointerType = e.pointerType;
      if (e.button > 0) return;
      star.setAttribute("data-presse", "");
      trace.arm(e, k);
    });
    ["pointerup", "pointerleave", "pointercancel", "blur"].forEach((type) =>
      listen(star, type, () => star.removeAttribute("data-presse")),
    );
    listen(star, "click", (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || modified(e)) return;
      e.preventDefault();
      // Un tracé n'ouvre jamais la page d'une app (ni la fiche) : le clic qui le suit est ignoré.
      if (trace.isActive() || trace.isFire() || now() - trace.endedAt() < 700) {
        pointerType = "";
        return;
      }
      const touch = pointerType === "touch" || pointerType === "pen";
      pointerType = "";
      // Au toucher : un premier toucher ouvre la fiche, un deuxième lance le voyage.
      if (touch && open !== k) {
        openFiche(k);
        return;
      }
      explore(k);
    });
    listen(star, "pointerenter", (e: PointerEvent) => {
      if (!isMouse(e) || trace.isActive()) return;
      // Juste après un tracé, la fiche attend que le fil se soit effacé.
      const wait = trace.endedAt() + TRACE_FADE_MS - now();
      window.clearTimeout(hoverDelay);
      if (wait > 0) {
        hoverDelay = window.setTimeout(() => {
          if (!trace.isActive() && star.matches(":hover")) openFiche(k);
        }, wait);
      } else openFiche(k);
    });
    listen(star, "pointerleave", (e: PointerEvent) => {
      if (isMouse(e) && open === k) closeFicheSoon();
    });
    listen(star, "focus", () => {
      if (star.matches(":focus-visible")) openFiche(k);
    });
    listen(star, "blur", () => {
      if (open === k) closeFicheSoon();
    });
  });

  listen(fiche, "pointerenter", (e: PointerEvent) => {
    if (isMouse(e)) window.clearTimeout(ficheTimer);
  });
  listen(fiche, "pointerleave", (e: PointerEvent) => {
    if (isMouse(e)) closeFicheSoon();
  });
  // Un glissé (≥ 8 px entre l'appui et le lâcher) sur la fiche n'est pas un clic : il n'ouvre rien.
  let fichePress: [number, number] | null = null;
  listen(fiche, "pointerdown", (e: PointerEvent) => {
    fichePress = [e.clientX, e.clientY];
  });
  const dragged = (e: MouseEvent) => {
    if (!fichePress || !e.detail) return false;
    return Math.hypot(e.clientX - fichePress[0], e.clientY - fichePress[1]) >= TRACE_THRESHOLD;
  };
  listen(fiche, "click", (e: MouseEvent) => {
    if (e.button !== 0 || modified(e)) return;
    e.preventDefault();
    if (dragged(e)) return;
    explore(open >= 0 ? open : hovered);
  });
  // Un toucher dans le vide referme la fiche ; Échap aussi.
  listen(scene, "pointerdown", (e: PointerEvent) => {
    if (open < 0 || e.pointerType === "mouse") return;
    if (e.target instanceof Element && e.target.closest("[data-astre], [data-fiche]")) return;
    closeFiche();
  });
  listen(scene, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && open >= 0) closeFiche();
  });
  // La parallaxe au pointeur (souris) ; pendant un tracé, le ciel la retient.
  listen(scene, "pointermove", (e: PointerEvent) => {
    trace.move(e);
    if (e.pointerType !== "mouse" || !mqMouse.matches || trace.isActive()) return;
    const r = scene.getBoundingClientRect();
    nx = clamp(((e.clientX - r.left) / (r.width || 1)) * 2 - 1, -1, 1);
    ny = clamp(((e.clientY - r.top) / (r.height || 1)) * 2 - 1, -1, 1);
  }, { passive: false });
  listen(scene, "pointerleave", (e: PointerEvent) => {
    if (e.pointerType === "mouse") {
      nx = 0;
      ny = 0;
    }
  });
  listen(document, "pointerup", (e: PointerEvent) => trace.release(e), { capture: true });
  listen(document, "pointercancel", (e: PointerEvent) => trace.release(e), { capture: true });
  listen(scene, "lostpointercapture", (e: PointerEvent) => {
    if (e.target === scene) trace.release(e);
  });
  listen(scene, "contextmenu", (e: MouseEvent) => {
    if (trace.isActive() || trace.isFire()) e.preventDefault();
  });
  // Retour arrière (page restaurée du cache) : le ciel revient tel quel.
  listen(window, "pageshow", (e: PageTransitionEvent) => {
    if (!e.persisted) return;
    trace.reset();
    restore();
  });

  /* ---------- L'arrivée : les étoiles depuis le centre, les nébuleuses, puis les astres un à un ---------- */
  function arrive() {
    arrivalAnims.forEach((a) => a.cancel());
    arrivalAnims.length = 0;
    arrivalTimers.forEach(window.clearTimeout);
    arrivalTimers.length = 0;
    skyReady = false;
    const rm = reduced();
    arrival = rm ? 0 : now();
    scene.removeAttribute("data-arrive");
    void scene.offsetWidth;
    scene.setAttribute("data-arrive", "");
    const done = () => {
      skyReady = true;
      glint.next = now() + 1600;
    };
    const t0 = rm ? 0 : 650;
    const step = rm ? 0 : 150;
    astres.forEach((star, i) => {
      arrivalAnims.push(
        star.animate(
          rm
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, scale: ".15", filter: "brightness(3) blur(4px)" },
                { opacity: 1, scale: "1", filter: "brightness(1) blur(0px)" },
              ],
          { duration: rm ? 200 : 950, delay: t0 + i * step, easing: CSS_EASE.expo, fill: "backwards" },
        ),
      );
      if (!rm) arrivalTimers.push(window.setTimeout(() => flash(i, true), t0 + i * step + 60));
    });
    filLines.forEach((line, i) => {
      arrivalAnims.push(
        line.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: rm ? 200 : 800,
          delay: rm ? 0 : t0 + (i + 1) * step + 250,
          easing: CSS_EASE.inOut,
          fill: "backwards",
        }),
      );
    });
    arrivalTimers.push(window.setTimeout(done, rm ? 200 : t0 + apps.length * step + 1000));
  }

  /* ---------- Visible ou non : le ciel joue, ou se met en pause ---------- */
  function see(on: boolean) {
    if (on === visible) return;
    visible = on;
    setActive();
    if (on) preview?.play();
    else preview?.pause();
    if (on && !seen) {
      seen = true;
      scene.setAttribute("data-vu", "");
      measure();
      arrive();
    }
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => see(entry.isIntersecting && entry.intersectionRatio >= 0.28)),
    { threshold: [0, 0.28, 0.5] },
  );
  io.observe(scene);
  listen(document, "visibilitychange", setActive);
  const ro = new ResizeObserver(() => measure());
  ro.observe(scene);
  listen(window, "resize", measure);
  void document.fonts?.ready.then(() => {
    if (!dead) measure();
  });

  measure();

  return () => {
    dead = true;
    io.disconnect();
    ro.disconnect();
    cleanups.forEach((fn) => fn());
    if (raf) cancelAnimationFrame(raf);
    [ficheTimer, hoverDelay, restoreTimer, ...arrivalTimers].forEach(window.clearTimeout);
    arrivalAnims.forEach((a) => a.cancel());
    cancelFicheAnims();
    stopPreview();
    trace.destroy();
  };
}
