/**
 * Le tracé d'astre en astre (shared/apps.js, « LE TRACÉ ») : le seul passage Pro → Créateur, et rien ne le trahit.
 * On appuie sur un astre et on glisse sans lâcher. Au-delà de 8 px, un fil de lumière fin suit le pointeur ;
 * il s'accroche à chaque astre traversé à moins de 28 px de son centre (un astre pris ne se reprend pas).
 * - Le code (CONSTELLATION_CODE, dans l'ordre) : les fils s'allument un à un, la constellation s'embrase et se
 *   resserre en un point de lumière, qui devient la Terre : la plongée (startDive de features/passages).
 * - Autre chose (au lâcher) : le fil s'efface en 400 ms, sans un mot ni vibration.
 * - Un tracé n'ouvre jamais la page d'une app ; un clic qui bouge de moins de 8 px reste un clic.
 * Mouvement réduit : pas de resserrement, des fondus.
 */
import { DIVE_PLUNGE_DELAY, isPassageBusy, startDive } from "@/features/passages";

/** px : en dessous, c'est un clic (la page de l'app) ; au-delà, un tracé. */
export const TRACE_THRESHOLD = 8;
/** ms : un tracé qui n'est pas le code s'efface. */
export const TRACE_FADE_MS = 400;
/** px à l'écran : le fil s'accroche à un astre traversé à cette distance de son centre. */
const SNAP = 28;
const SVG_NS = "http://www.w3.org/2000/svg";
const SAFETY_MS = 9000;

export interface StarPoint {
  x: number;
  y: number;
  r: number;
}

interface TraceHost {
  scene: HTMLElement;
  dock: HTMLElement;
  astres: readonly HTMLElement[];
  /** Les centres des astres, dans le repère de la scène. */
  points: () => readonly StarPoint[];
  /** Largeur de la scène (le dock peut être agrandi par la caméra). */
  width: () => number;
  /** Les index des astres à relier, dans l'ordre. */
  code: readonly number[];
  /** Le ciel est arrivé et rien ne part. */
  canStart: () => boolean;
  /** Le geste devient un tracé : la fiche se ferme, l'arrivée se termine. */
  onStart: () => void;
  /** L'éclat d'un astre pris. */
  flash: (k: number) => void;
  /** Le code est trouvé : plus de fiche, de départ, de reflet ni d'étoile filante. */
  onSuccess: () => void;
  /** La caméra plonge vers ce point de l'écran. */
  plunge: (x: number, y: number) => void;
  /** Retour au repos ; `fromSuccess` : après le code (le ciel revient de la plongée). */
  onReset: (fromSuccess: boolean) => void;
  reduced: () => boolean;
  /** Cible du fil, de la braise et de la pointe (rendus par React). */
  group: SVGGElement;
  live: SVGGElement;
  ember: SVGCircleElement;
  /** Classes des segments fixés (CSS Module). */
  segmentClass: { group: string; halo: string; line: string };
}

type State = "rest" | "trace" | "fade" | "fire";

const f1 = (v: number) => String(Math.round(v * 10) / 10);
const f3 = (v: number) => String(Math.round(v * 1000) / 1000);
const px = (v: number) => `${Math.round(v * 10) / 10}px`;
const cubicIn = (p: number) => p * p * p;

export function createTrace(host: TraceHost) {
  const html = document.documentElement;
  const liveLines = Array.from(host.live.querySelectorAll("line"));
  const liveDots = Array.from(host.live.querySelectorAll("circle"));
  let pointer: number | null = null;
  let k0 = -1;
  let x0 = 0;
  let y0 = 0;
  let active = false;
  let state: State = "rest";
  let seq: number[] = [];
  let segments: SVGGElement[] = [];
  let lastX = 0;
  let lastY = 0;
  let cx = 0;
  let cy = 0;
  /** Fin du dernier geste (performance.now) : le clic qui le suit est ignoré, la fiche attend. */
  let endedAt = -1e9;
  let generation = 0;
  let fadeTimer = 0;
  let safetyTimer = 0;
  const timers: number[] = [];
  const now = () => performance.now();
  const at = (s: number, fn: () => void) => timers.push(window.setTimeout(fn, s * 1000));

  /** Une animation à la main (requestAnimationFrame), annulée par un retour au repos. */
  function tween(duration: number, ease: (p: number) => number, update: (k: number) => void) {
    const g = generation;
    const start = now();
    const step = () => {
      if (g !== generation) return;
      const p = duration > 0 ? Math.min(1, (now() - start) / (duration * 1000)) : 1;
      update(ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    step();
  }

  /** Du pointeur (écran) au repère des astres : le dock, parallaxe et caméra comprises. */
  function frame() {
    const r = host.dock.getBoundingClientRect();
    return { l: r.left, t: r.top, k: r.width / (host.width() || 1) || 1 };
  }
  const toDock = (f: ReturnType<typeof frame>, x: number, y: number) => [(x - f.l) / f.k, (y - f.t) / f.k] as const;

  function setLine(lines: readonly Element[], ax: number, ay: number, bx: number, by: number) {
    lines.forEach((l) => {
      l.setAttribute("x1", f1(ax));
      l.setAttribute("y1", f1(ay));
      l.setAttribute("x2", f1(bx));
      l.setAttribute("y2", f1(by));
    });
  }

  /** Un segment fixé, d'un centre à l'autre (sous les icônes : le fil se branche dans l'astre). */
  function addSegment(a: number, b: number) {
    const pts = host.points();
    const g = document.createElementNS(SVG_NS, "g");
    const halo = document.createElementNS(SVG_NS, "line");
    const line = document.createElementNS(SVG_NS, "line");
    g.setAttribute("class", host.segmentClass.group);
    halo.setAttribute("class", host.segmentClass.halo);
    line.setAttribute("class", host.segmentClass.line);
    g.append(halo, line);
    setLine([halo, line], pts[a].x, pts[a].y, pts[b].x, pts[b].y);
    host.group.insertBefore(g, host.live);
    segments.push(g);
  }

  /** Les astres libres que le pointeur frôle entre deux positions, dans l'ordre du passage. */
  function grazed(ax: number, ay: number, bx: number, by: number, radius: number) {
    const dx = bx - ax;
    const dy = by - ay;
    const L = dx * dx + dy * dy;
    const hits: [number, number][] = [];
    host.points().forEach((p, k) => {
      if (seq.includes(k)) return;
      let t = L ? ((p.x - ax) * dx + (p.y - ay) * dy) / L : 0;
      t = Math.max(0, Math.min(1, t));
      const qx = ax + t * dx - p.x;
      const qy = ay + t * dy - p.y;
      if (qx * qx + qy * qy < radius * radius) hits.push([t, k]);
    });
    return hits.sort((a, b) => a[0] - b[0]).map((h) => h[1]);
  }

  function take(k: number) {
    const previous = seq[seq.length - 1];
    seq.push(k);
    host.astres[k]?.setAttribute("data-lie", "");
    host.flash(k);
    if (previous !== undefined) addSegment(previous, k);
    if (seq.length === host.code.length && seq.every((s, i) => s === host.code[i])) succeed();
  }

  /** Le fil vif : du dernier astre pris jusqu'au pointeur, avec une pointe de lumière. */
  function drawLive(x: number, y: number) {
    const k = seq[seq.length - 1];
    if (k === undefined) return;
    const p = host.points()[k];
    setLine(liveLines, p.x, p.y, x, y);
    liveDots.forEach((c) => {
      c.setAttribute("cx", f1(x));
      c.setAttribute("cy", f1(y));
    });
    host.live.setAttribute("data-on", "");
  }

  function clear() {
    window.clearTimeout(fadeTimer);
    segments.forEach((g) => g.remove());
    segments = [];
    seq = [];
    host.live.removeAttribute("data-on");
    host.group.style.transition = "none";
    host.group.style.opacity = "";
    host.astres.forEach((t) => t.removeAttribute("data-lie"));
    state = "rest";
  }

  /** Pas le code (au lâcher) : le fil s'efface doucement. */
  function fadeOut() {
    state = "fade";
    host.group.style.transition = `opacity ${TRACE_FADE_MS}ms cubic-bezier(.45,0,.55,1)`;
    host.group.style.opacity = "0";
    host.astres.forEach((t) => t.removeAttribute("data-lie"));
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(clear, TRACE_FADE_MS + 20);
  }

  /** Fin du geste (lâcher, annulation, ou le code trouvé) ; vrai s'il y avait un tracé. */
  function finish() {
    const id = pointer;
    const wasActive = active;
    pointer = null;
    active = false;
    if (id !== null && host.scene.hasPointerCapture(id)) host.scene.releasePointerCapture(id);
    html.removeAttribute("data-kz-trace");
    if (wasActive) endedAt = now();
    return wasActive;
  }

  function start(event: PointerEvent) {
    active = true;
    endedAt = now();
    if (state === "fade") clear();
    host.onStart();
    host.astres[k0]?.removeAttribute("data-presse");
    try {
      host.scene.setPointerCapture(event.pointerId);
    } catch {
      /* pointeur déjà relâché : le tracé continue sans capture */
    }
    html.setAttribute("data-kz-trace", "");
    state = "trace";
    const [x, y] = toDock(frame(), x0, y0);
    lastX = x;
    lastY = y;
    take(k0);
  }

  /** La constellation, au centre de l'écran (repère de l'écran). */
  function centerOnScreen() {
    const f = frame();
    return { x: f.l + cx * f.k, y: f.t + cy * f.k };
  }

  function openPortal(point: { x: number; y: number }) {
    window.clearTimeout(safetyTimer);
    // Navigation bloquée : le ciel revient au repos.
    safetyTimer = window.setTimeout(reset, SAFETY_MS);
    if (!startDive({ from: point })) reset();
  }

  /** Le code : les fils s'allument, la constellation s'embrase, se resserre en un point, qui devient la Terre. */
  function succeed() {
    state = "fire";
    host.onSuccess();
    finish();
    host.live.removeAttribute("data-on");
    const reduced = host.reduced();
    const order = seq.slice();
    const stars = order.map((k) => host.astres[k]);
    const pts = host.points();
    cx = order.reduce((s, k) => s + pts[k].x, 0) / order.length;
    cy = order.reduce((s, k) => s + pts[k].y, 0) / order.length;
    const R = Math.max(...order.map((k) => Math.hypot(pts[k].x - cx, pts[k].y - cy)));
    const r0 = R * 0.8 + 50;
    host.ember.setAttribute("cx", f1(cx));
    host.ember.setAttribute("cy", f1(cy));
    host.ember.setAttribute("r", f1(r0));

    // 1. Les fils s'allument un à un.
    stars.forEach((star, i) => {
      at(reduced ? 0 : 0.11 * i, () => {
        star?.setAttribute("data-feu", "");
        segments[i - 1]?.setAttribute("data-feu", "");
        host.flash(order[i]);
      });
    });
    // 2. La constellation s'embrase.
    at(reduced ? 0 : 0.52, () => host.scene.setAttribute("data-embrase", ""));

    if (reduced) {
      // Mouvement réduit : pas de resserrement, des fondus ; la planète, puis l'éclat.
      at(0.25, () => {
        [...stars, host.group].forEach((el) => {
          if (!el) return;
          el.style.transition = "opacity .35s linear";
          el.style.opacity = "0";
        });
      });
      at(0.7, () => openPortal(centerOnScreen()));
      return;
    }
    // 3. Elle se resserre vers son centre, en un point de lumière…
    at(0.98, () => {
      stars.forEach((star) => star && (star.style.transition = "none"));
      host.group.style.transition = "none";
      tween(0.62, cubicIn, (k) => {
        stars.forEach((star, i) => {
          if (!star) return;
          const p = pts[order[i]];
          star.style.translate = `${px((cx - p.x) * k)} ${px((cy - p.y) * k)}`;
          star.style.scale = f3(1 - 0.82 * k);
          star.style.opacity = f3(1 - k * k);
        });
        host.group.setAttribute("transform", `translate(${f1(cx)} ${f1(cy)}) scale(${f3(1 - 0.9 * k)}) translate(${f1(-cx)} ${f1(-cy)})`);
        host.group.style.opacity = f3(1 - k * k);
        host.ember.setAttribute("r", f1(r0 + (16 - r0) * k));
      });
    });
    // 4. … qui devient une petite planète bleue : la Terre. On plonge vers elle.
    at(1.52, () => {
      const point = centerOnScreen();
      openPortal(point);
      at(0.3, () => {
        host.ember.style.transition = "opacity .6s ease-out";
        host.ember.style.opacity = "0";
      });
      at(DIVE_PLUNGE_DELAY, () => host.plunge(point.x, point.y));
    });
  }

  /** Retour au repos (navigation bloquée, retour arrière). */
  function reset() {
    const fromSuccess = state === "fire";
    generation += 1;
    window.clearTimeout(safetyTimer);
    timers.forEach(window.clearTimeout);
    timers.length = 0;
    finish();
    host.scene.removeAttribute("data-embrase");
    host.astres.forEach((t) => {
      t.removeAttribute("data-lie");
      t.removeAttribute("data-feu");
      t.style.translate = "";
      t.style.scale = "";
      t.style.opacity = "";
      t.style.transition = "";
    });
    clear();
    host.group.removeAttribute("transform");
    host.ember.setAttribute("r", "0");
    host.ember.style.opacity = "";
    host.ember.style.transition = "";
    host.onReset(fromSuccess);
  }

  /* ---------- Le geste : il s'arme sur un astre, ne devient un tracé qu'au-delà du seuil ---------- */
  function arm(event: PointerEvent, k: number) {
    if (pointer !== null || state === "fire" || !host.canStart()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!event.isPrimary || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (isPassageBusy()) return;
    pointer = event.pointerId;
    k0 = k;
    x0 = event.clientX;
    y0 = event.clientY;
    active = false;
  }

  function move(event: PointerEvent) {
    if (pointer === null || pointer !== event.pointerId) return;
    if (!active) {
      const dx = event.clientX - x0;
      const dy = event.clientY - y0;
      if (dx * dx + dy * dy < TRACE_THRESHOLD * TRACE_THRESHOLD) return;
      start(event);
    }
    if (state !== "trace") return;
    if (event.cancelable) event.preventDefault();
    const f = frame();
    const radius = SNAP / f.k;
    const coalesced = event.getCoalescedEvents?.() ?? [];
    for (const e of coalesced.length ? coalesced : [event]) {
      const [x, y] = toDock(f, e.clientX, e.clientY);
      const hits = grazed(lastX, lastY, x, y, radius);
      lastX = x;
      lastY = y;
      for (const k of hits) {
        take(k);
        if (state !== "trace") return;
      }
    }
    const [x, y] = toDock(f, event.clientX, event.clientY);
    drawLive(x, y);
  }

  function release(event: PointerEvent) {
    if (pointer === null || pointer !== event.pointerId) return;
    if (finish() && state === "trace") fadeOut();
  }

  return {
    arm,
    move,
    release,
    reset,
    /** Un tracé est en cours (le pointeur est tenu au-delà du seuil). */
    isActive: () => active,
    /** Le code est trouvé : la plongée est en route. */
    isFire: () => state === "fire",
    /** Fin du dernier geste (performance.now). */
    endedAt: () => endedAt,
    destroy() {
      generation += 1;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(safetyTimer);
      timers.forEach(window.clearTimeout);
      html.removeAttribute("data-kz-trace");
      segments.forEach((g) => g.remove());
    },
  };
}
