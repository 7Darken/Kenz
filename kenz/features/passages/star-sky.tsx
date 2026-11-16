"use client";

/**
 * Le ciel en arche (port de maquettes/v6/shared/etoiles.js) : le passage secret du pied de page Créateur vers Pro.
 * Au repos, 9 étoiles fines à positions fixes ; rien ne les trahit (au plus un scintillement au survol direct).
 * Le geste part d'une étoile (souris ou doigt) : un trait lumineux suit le pointeur et s'accroche aux étoiles frôlées.
 * - Le bon code (l'arche : 3, 4, 5, 7, 8, dans un sens ou dans l'autre, une étoile frôlée en trop pardonnée) : le tracé
 *   se redessine au propre, les segments s'illuminent un à un, la constellation s'embrase, se resserre
 *   et devient la lune ; puis le décollage vers l'univers Pro.
 * - Autre chose : au lâcher, le tracé s'efface en 400 ms, sans un mot.
 * La bande est décorative (aria-hidden) : le chemin au clavier est le cordon du logo (Alt + Flèche bas).
 * Mouvement réduit : pas d'échelle, l'ouverture en fondu.
 */
import { useEffect, useId, useRef, type CSSProperties } from "react";

import { isPassageBusy, prefersReducedMotion } from "./passage-state";
import { startLiftoff } from "./portal";
import { MOON_FILL, MOON_STROKE } from "./moon";
import styles from "./star-sky.module.css";
import { createTrack, round2 } from "./track";

/** Les étoiles à relier, dans l'ordre (numéros de STARS, de 1 à 9) : en bas à gauche, épaule, sommet, épaule, en bas à droite. */
const CODE = [3, 4, 5, 7, 8] as const;

interface Star {
  x: number;
  y: number;
  r: number;
  /** éclat, de 0 à 1 */
  a: number;
  gold?: boolean;
  rays?: boolean;
}

/** Les 9 étoiles, numérotées de gauche à droite, dans un repère de 360 × 130 (la bande garde ces proportions). */
const STARS: readonly Star[] = [
  { x: 24, y: 84, r: 1.3, a: 0.55 },
  { x: 76, y: 36, r: 1.8, a: 0.8, gold: true, rays: true },
  { x: 128, y: 108, r: 1.4, a: 0.7 },
  { x: 138, y: 58, r: 1.1, a: 0.6 },
  { x: 180, y: 20, r: 1.6, a: 0.85, rays: true },
  { x: 184, y: 84, r: 1.5, a: 0.65, gold: true },
  { x: 226, y: 50, r: 1.2, a: 0.7 },
  { x: 236, y: 104, r: 1.7, a: 0.75, gold: true },
  { x: 332, y: 58, r: 1.9, a: 0.8, rays: true },
];
const VB_W = 360;
const VB_H = 130;
const SNAP = 30; // px à l'écran : le tracé s'accroche à une étoile (un doigt n'est pas une règle)
const GRAB = 30; // px : tolérance pour partir d'une étoile
const MAX_STRAY = 1; // étoiles frôlées en trop, pardonnées
const FADE_MS = 400; // le mauvais tracé s'efface
const SAFETY_S = 8; // navigation bloquée : le ciel revient au repos
const BRASIER_R = 96;

const CENTER = {
  x: round2(CODE.reduce((sum, n) => sum + STARS[n - 1].x, 0) / CODE.length),
  y: round2(CODE.reduce((sum, n) => sum + STARS[n - 1].y, 0) / CODE.length),
};
const isCode = (n: number) => (CODE as readonly number[]).includes(n);
const CODE_BACK: readonly number[] = [...CODE].reverse();

/** Le tracé est-il l'arche ? Ses étoiles du code, dans l'ordre du tracé (sens direct ou inverse), avec au plus
 *  MAX_STRAY étoile en trop ; sinon null. */
function archOf(seq: readonly number[]): readonly number[] | null {
  const arch = seq.filter(isCode);
  if (seq.length - arch.length > MAX_STRAY || arch.length !== CODE.length) return null;
  const same = (ref: readonly number[]) => arch.every((n, i) => n === ref[i]);
  return same(CODE) || same(CODE_BACK) ? arch : null;
}

/** La lune (dessinée dans un repère de 400) posée au centre de la forme. */
const moonTransform = (k: number) =>
  `translate(${CENTER.x} ${CENTER.y}) scale(${Math.round(0.27 * k * 1000) / 1000}) translate(-206 -200)`;

function StarMark({ star, n }: { star: Star; n: number }) {
  const { x, y, r } = star;
  const ray = round2(r * 3.6);
  const style = { "--a": star.a, "--h": round2(0.05 + star.a * 0.04) } as CSSProperties;
  return (
    <g className={star.gold ? `${styles.star} ${styles.gold}` : styles.star} data-star={n} style={style}>
      <circle className={styles.glow} cx={x} cy={y} r={round2(r * 4.2)} />
      {star.rays ? (
        <path className={styles.rays} d={`M${round2(x - ray)} ${y}H${round2(x + ray)}M${x} ${round2(y - ray)}V${round2(y + ray)}`} />
      ) : null}
      <circle className={styles.core} cx={x} cy={y} r={r} />
    </g>
  );
}

function MoonFigure({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path className={styles.symStroke} pathLength={1} d={MOON_STROKE} />
      <path className={styles.symFill} d={MOON_FILL} />
    </g>
  );
}

const SVG_NS = "http://www.w3.org/2000/svg";

export function StarSky() {
  const gradientId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shapeRef = useRef<SVGGElement>(null);
  const traceRef = useRef<SVGGElement>(null);
  const segmentsRef = useRef<SVGGElement>(null);
  const liveRef = useRef<SVGGElement>(null);
  const brasierRef = useRef<SVGCircleElement>(null);
  const symbolRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const shape = shapeRef.current;
    const trace = traceRef.current;
    const segmentsHost = segmentsRef.current;
    const live = liveRef.current;
    const brasier = brasierRef.current;
    const symbol = symbolRef.current;
    if (!root || !svg || !shape || !trace || !segmentsHost || !live || !brasier || !symbol) return;
    const html = document.documentElement;
    const stars = Array.from(root.querySelectorAll<SVGGElement>("[data-star]")).sort(
      (a, b) => Number(a.dataset.star) - Number(b.dataset.star),
    );
    const symbolStrokes = Array.from(symbol.querySelectorAll<SVGPathElement>(`.${styles.symStroke}`));
    const symbolFills = Array.from(symbol.querySelectorAll<SVGPathElement>(`.${styles.symFill}`));
    const track = createTrack();

    let seq: number[] = [];
    let segments: SVGGElement[] = [];
    let phase: "rest" | "trace" | "fade" | "fire" = "rest";
    let pointerId: number | null = null;
    let last = { x: 0, y: 0 };
    let fadeTimer = 0;

    /* Repère : la bande garde les proportions du repère, l'échelle est la même en x et en y. */
    const geom = () => {
      const r = svg.getBoundingClientRect();
      return { l: r.left, t: r.top, k: r.width / VB_W || 1 };
    };
    type Geom = ReturnType<typeof geom>;
    const onScreen = (g: Geom, n: number) => [g.l + STARS[n - 1].x * g.k, g.t + STARS[n - 1].y * g.k] as const;

    const setLine = (seg: SVGGElement, x1: number, y1: number, x2: number, y2: number) => {
      seg.querySelectorAll("line").forEach((line) => {
        line.setAttribute("x1", String(round2(x1)));
        line.setAttribute("y1", String(round2(y1)));
        line.setAttribute("x2", String(round2(x2)));
        line.setAttribute("y2", String(round2(y2)));
      });
    };

    const addSegment = (a: number, b: number) => {
      const seg = document.createElementNS(SVG_NS, "g");
      for (const className of [styles.lineHalo, styles.line]) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("class", className);
        seg.append(line);
      }
      setLine(seg, STARS[a - 1].x, STARS[a - 1].y, STARS[b - 1].x, STARS[b - 1].y);
      segmentsHost.append(seg);
      segments.push(seg);
    };

    const nearest = (g: Geom, x: number, y: number, radius: number) => {
      let best = 0;
      let bestD = radius;
      STARS.forEach((_, i) => {
        const [sx, sy] = onScreen(g, i + 1);
        const d = Math.hypot(sx - x, sy - y);
        if (d <= bestD) {
          bestD = d;
          best = i + 1;
        }
      });
      return best;
    };

    /* Les étoiles libres que le pointeur frôle entre deux positions, dans l'ordre du passage. */
    const brushed = (g: Geom, x0: number, y0: number, x1: number, y1: number) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = dx * dx + dy * dy;
      const out: [number, number][] = [];
      STARS.forEach((_, i) => {
        const n = i + 1;
        if (seq.includes(n)) return;
        const [sx, sy] = onScreen(g, n);
        const t = Math.max(0, Math.min(1, len ? ((sx - x0) * dx + (sy - y0) * dy) / len : 0));
        const qx = x0 + t * dx - sx;
        const qy = y0 + t * dy - sy;
        if (qx * qx + qy * qy < SNAP * SNAP) out.push([t, n]);
      });
      return out.sort((a, b) => a[0] - b[0]).map(([, n]) => n);
    };

    const updateLive = (g: Geom, x: number, y: number) => {
      const n = seq[seq.length - 1];
      if (!n) return;
      setLine(live, STARS[n - 1].x, STARS[n - 1].y, (x - g.l) / g.k, (y - g.t) / g.k);
      live.removeAttribute("display");
    };

    const take = (n: number) => {
      const before = seq[seq.length - 1];
      seq.push(n);
      stars[n - 1].classList.add(styles.taken);
      if (before) addSegment(before, n);
      const arch = archOf(seq);
      if (arch) succeed(arch);
    };

    const clearTrace = () => {
      window.clearTimeout(fadeTimer);
      segments.forEach((seg) => seg.remove());
      segments = [];
      seq = [];
      live.setAttribute("display", "none");
      trace.style.transition = "none";
      trace.style.opacity = "";
      stars.forEach((star) => star.classList.remove(styles.taken));
      phase = "rest";
    };

    /* Mauvais code : le tracé s'efface doucement, sans un mot. */
    const fadeOut = () => {
      phase = "fade";
      trace.style.transition = `opacity ${FADE_MS}ms cubic-bezier(.45,0,.55,1)`;
      trace.style.opacity = "0";
      stars.forEach((star) => star.classList.remove(styles.taken));
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(clearTrace, FADE_MS + 20);
    };

    const releasePointer = () => {
      if (pointerId !== null && root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
      pointerId = null;
      html.classList.remove(styles.tracing);
    };

    /* Retour au repos (navigation bloquée, retour arrière). */
    const reset = () => {
      track.kill();
      releasePointer();
      clearTrace();
      root.classList.remove(styles.ablaze);
      stars.forEach((star) => star.classList.remove(styles.fire));
      shape.removeAttribute("transform");
      shape.style.opacity = "";
      brasier.setAttribute("r", String(BRASIER_R));
      symbol.style.opacity = "";
      symbol.setAttribute("transform", moonTransform(1));
      symbolStrokes.forEach((path) => path.style.removeProperty("stroke-dashoffset"));
      symbolFills.forEach((path) => path.style.removeProperty("opacity"));
    };

    const drawMoon = (k: number) => {
      symbol.setAttribute("transform", moonTransform(0.55 + 0.45 * k));
      symbol.style.opacity = String(round2(Math.min(1, k * 2.2)));
      symbolStrokes.forEach((path) => path.style.setProperty("stroke-dashoffset", String(round2(1 - k))));
      symbolFills.forEach((path) => path.style.setProperty("opacity", String(round2(Math.max(0, k * 1.6 - 0.6)))));
    };

    /* Le bon code : le tracé redessiné au propre (l'arche seule, dans le sens du geste), embrasement, la lune, puis le
       décollage. */
    const succeed = (arch: readonly number[]) => {
      phase = "fire";
      releasePointer();
      live.setAttribute("display", "none");
      segments.forEach((seg) => seg.remove());
      segments = [];
      stars.forEach((star, i) => star.classList.toggle(styles.taken, arch.includes(i + 1)));
      arch.slice(1).forEach((n, i) => addSegment(arch[i], n));
      const reduced = prefersReducedMotion();
      const codeStars = arch.map((n) => stars[n - 1]);
      const lift = () => {
        track.after(SAFETY_S, reset);
        if (!startLiftoff()) reset();
      };

      // 1. Les segments s'illuminent un à un ; 2. la constellation s'embrase.
      codeStars.forEach((star, k) => {
        track.after(reduced ? 0 : 0.1 * k, () => {
          star.classList.add(styles.fire);
          segments[k - 1]?.classList.add(styles.segFire);
        });
      });
      track.after(reduced ? 0 : 0.52, () => root.classList.add(styles.ablaze));

      if (reduced) {
        track.after(0.25, () => {
          track.tween(0.35, "power2.out", (k) => shape.style.setProperty("opacity", String(round2(1 - k))));
          symbolStrokes.forEach((path) => path.style.setProperty("stroke-dashoffset", "0"));
          symbolFills.forEach((path) => path.style.setProperty("opacity", "1"));
          track.tween(0.45, "power2.out", (k) => symbol.style.setProperty("opacity", String(round2(k))));
        });
        track.after(1, lift);
        return;
      }
      // 3. La forme se resserre vers son centre…
      track.tween(0.62, "power2.in", (k) => {
        const s = Math.round((1 - 0.9 * k) * 1000) / 1000;
        shape.setAttribute("transform", `translate(${CENTER.x} ${CENTER.y}) scale(${s}) translate(${-CENTER.x} ${-CENTER.y})`);
        shape.style.opacity = String(round2(1 - k * k));
        brasier.setAttribute("r", String(round2(BRASIER_R - 44 * k)));
      }, { delay: 0.98 });
      // … et devient la lune ; 4. le décollage.
      track.tween(1, "expo.out", drawMoon, { delay: 1.34 });
      track.after(2.05, lift);
    };

    const onDown = (event: PointerEvent) => {
      if (phase === "fire" || pointerId !== null || isPassageBusy()) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const hit = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-hit]") : null;
      if (!hit) return;
      const g = geom();
      const n = nearest(g, event.clientX, event.clientY, GRAB) || Number(hit.dataset.hit);
      if (phase === "fade") clearTrace();
      if (event.cancelable) event.preventDefault();
      pointerId = event.pointerId;
      phase = "trace";
      last = { x: event.clientX, y: event.clientY };
      root.setPointerCapture(event.pointerId);
      html.classList.add(styles.tracing);
      take(n);
      if (phase === "trace") updateLive(g, event.clientX, event.clientY);
    };

    const onMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId || phase !== "trace") return;
      if (event.cancelable) event.preventDefault();
      const g = geom();
      const events = event.getCoalescedEvents?.() ?? [];
      for (const e of events.length ? events : [event]) {
        const taken = brushed(g, last.x, last.y, e.clientX, e.clientY);
        last = { x: e.clientX, y: e.clientY };
        for (const n of taken) {
          take(n);
          if (phase !== "trace") return;
        }
      }
      updateLive(g, event.clientX, event.clientY);
    };

    const onEnd = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      releasePointer();
      if (phase === "trace") fadeOut();
    };

    const onContextMenu = (event: Event) => {
      if (phase === "trace") event.preventDefault();
    };
    const onDragStart = (event: Event) => event.preventDefault();

    /* Au plus un scintillement, au survol direct d'une étoile (souris). */
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || phase !== "rest") return;
      const hit = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-hit]") : null;
      if (!hit || (event.relatedTarget instanceof Node && hit.contains(event.relatedTarget))) return;
      const star = stars[Number(hit.dataset.hit) - 1];
      if (!star || star.classList.contains(styles.twinkle)) return;
      star.classList.add(styles.twinkle);
      track.after(1.15, () => star.classList.remove(styles.twinkle));
    };

    /* Retour arrière depuis une autre page (cache du navigateur) : le ciel revient au repos. */
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove, { passive: false });
    root.addEventListener("pointerup", onEnd);
    root.addEventListener("pointercancel", onEnd);
    root.addEventListener("lostpointercapture", onEnd);
    root.addEventListener("pointerover", onOver);
    root.addEventListener("contextmenu", onContextMenu);
    root.addEventListener("dragstart", onDragStart);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onEnd);
      root.removeEventListener("pointercancel", onEnd);
      root.removeEventListener("lostpointercapture", onEnd);
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("contextmenu", onContextMenu);
      root.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(fadeTimer);
      track.kill();
      html.classList.remove(styles.tracing);
    };
  }, []);

  const others = STARS.map((star, i) => ({ star, n: i + 1 })).filter(({ n }) => !isCode(n));
  const code = CODE.map((n) => ({ star: STARS[n - 1], n }));

  return (
    <div ref={rootRef} className={styles.sky} aria-hidden="true">
      <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${VB_W} ${VB_H}`} focusable="false">
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0" className={styles.stop0} />
            <stop offset=".42" className={styles.stop1} />
            <stop offset="1" className={styles.stop2} />
          </radialGradient>
        </defs>
        <circle ref={brasierRef} className={styles.brasier} cx={CENTER.x} cy={CENTER.y} r={BRASIER_R} fill={`url(#${gradientId})`} />
        <g className={styles.others}>
          {others.map(({ star, n }) => (
            <StarMark key={n} star={star} n={n} />
          ))}
        </g>
        {/* La forme : le tracé et les étoiles du code, qui se resserrent ensemble quand le code est trouvé. */}
        <g ref={shapeRef}>
          <g ref={traceRef}>
            <g ref={segmentsRef} />
            <g ref={liveRef} className={styles.live} display="none">
              <line className={styles.lineHalo} />
              <line className={styles.line} />
            </g>
          </g>
          {code.map(({ star, n }) => (
            <StarMark key={n} star={star} n={n} />
          ))}
        </g>
        <g ref={symbolRef} className={styles.symbol} transform={moonTransform(1)}>
          <MoonFigure className={styles.symHalo} />
          <MoonFigure />
        </g>
      </svg>
      {STARS.map((star, i) => (
        <span
          key={i}
          className={styles.hit}
          data-hit={i + 1}
          style={{ left: `${round2((star.x / VB_W) * 100)}%`, top: `${round2((star.y / VB_H) * 100)}%` }}
        />
      ))}
    </div>
  );
}
