/**
 * Les niveaux de qualité du rendu, hors de React : `high` (l'ordinateur récent, rien ne change), `medium`, `low`.
 * Le niveau de départ est posé sur <html data-quality> par le script inline (./quality-script, signaux de l'appareil) ;
 * ici, la mesure réelle, discrète, ne fait que le baisser :
 * - la sonde : les premières images après le démarrage (≈ 2,4 s), sans boucle permanente ;
 * - en cours de route : les images échantillonnées pendant un défilement, et celles des boucles lourdes (globe, ciel
 *   des apps) qui les signalent par `noteFrame(t)`, par fenêtres de 60. Une baisse demande deux fenêtres lentes de
 *   suite, ou une seule très lente (hystérésis), puis un temps de repos le temps que le nouveau niveau se mesure. Jamais de remontée dans la session : pas de
 *   va-et-vient. La baisse est mémorisée pour la session (les pages suivantes partent du bon niveau).
 * Mouvement réduit : pas de mesure (rien ne bouge en continu) ; le niveau de départ reste.
 *
 * Les modules lisent le niveau par `getQuality()` / `subscribeQuality()` (moteurs hors React), `useQuality()`
 * (composants), ou en CSS : `:global(html[data-quality="low"]) .x {…}`.
 */
import { QUALITY_STORAGE_KEY } from "./quality-script";

export type Quality = "high" | "medium" | "low";

const RANK: Record<Quality, number> = { low: 0, medium: 1, high: 2 };
const LOWER: Record<Quality, Quality> = { high: "medium", medium: "low", low: "low" };

/** Intervalles par fenêtre de mesure (1 s à 60 i/s, 2 s à 30 i/s). */
const WINDOW = 60;
/** ms : une médiane au-delà, c'est moins de ≈ 42 i/s soutenus (à 120 Hz, 40 i/s donnent des intervalles de 25 ms). */
const SLOW_MEDIAN = 24;
/** ms : une médiane au-delà, c'est moins de ≈ 26 i/s : on descend d'un coup en `low`. */
const VERY_SLOW_MEDIAN = 38;
/** Part d'images de plus de 50 ms au-delà de laquelle la fenêtre est saccadée. */
const JANK_SHARE = 0.12;
/** Fenêtres lentes de suite avant de baisser ; une fenêtre très lente (moins de ≈ 26 i/s) suffit. */
const BAD_WINDOWS = 2;
/** ms : après une baisse, le temps que le nouveau niveau se mesure. */
const COOLDOWN = 4000;
/** ms : un écart plus long est une pause (boucle arrêtée, onglet caché), pas une image lente. */
const BREAK = 600;
/** La sonde de départ. */
const PROBE_DELAY = 500;
const PROBE_MS = 2400;
/** ms : le défilement est échantillonné jusqu'à ce délai après son dernier événement. */
const SCROLL_TAIL = 300;

const isQuality = (value: unknown): value is Quality => value === "high" || value === "medium" || value === "low";
const listeners = new Set<() => void>();

export function getQuality(): Quality {
  if (typeof document === "undefined") return "high";
  const value = document.documentElement.getAttribute("data-quality");
  return isQuality(value) ? value : "high";
}

/** Vrai si le niveau `q` vaut au moins `min`. */
export const atLeast = (q: Quality, min: Quality) => RANK[q] >= RANK[min];

export function subscribeQuality(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function lowerTo(next: Quality) {
  if (RANK[next] >= RANK[getQuality()]) return;
  document.documentElement.setAttribute("data-quality", next);
  try {
    window.sessionStorage.setItem(QUALITY_STORAGE_KEY, next);
  } catch {
    /* stockage indisponible : le niveau tient pour la page */
  }
  listeners.forEach((listener) => listener());
}

/* ---------- La mesure ---------- */
let running = false;
let samples: number[] = [];
let last = 0;
let bad = 0;
let quietUntil = 0;

function median(values: number[]): number {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

/** Le verdict d'une fenêtre : 0 (bonne), 1 (lente), 2 (très lente). */
function verdict(intervals: number[]): 0 | 1 | 2 {
  const m = median(intervals);
  const janky = intervals.filter((d) => d > 50).length / intervals.length;
  if (m > VERY_SLOW_MEDIAN) return 2;
  return m > SLOW_MEDIAN || janky > JANK_SHARE ? 1 : 0;
}

function evaluate(t: number) {
  const batch = samples;
  samples = [];
  if (t < quietUntil || getQuality() === "low") return;
  const v = verdict(batch);
  bad = v ? bad + 1 : 0;
  if (bad < BAD_WINDOWS && v < 2) return;
  bad = 0;
  quietUntil = t + COOLDOWN;
  lowerTo(v === 2 ? "low" : LOWER[getQuality()]);
}

/**
 * Une image rendue par une boucle (horodatage de requestAnimationFrame). Plusieurs boucles dans la même image
 * comptent une fois. Sans effet tant que la mesure n'est pas lancée (ou en mouvement réduit).
 */
export function noteFrame(t: number) {
  if (!running || t === last) return;
  const d = t - last;
  last = t;
  if (d <= 0 || d > BREAK || document.hidden) return;
  samples.push(d);
  if (samples.length >= WINDOW) evaluate(t);
}

/** Lance la sonde de départ et l'échantillonnage du défilement ; rend l'arrêt. Monté une fois (MotionProvider). */
export function startQualityMonitor(): () => void {
  if (running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  running = true;
  let raf = 0;
  let until = 0;
  const tick = (t: number) => {
    raf = 0;
    noteFrame(t);
    if (t < until) raf = requestAnimationFrame(tick);
    else last = 0;
  };
  /** Échantillonne jusqu'à `ms` après maintenant. */
  const sample = (ms: number) => {
    until = Math.max(until, performance.now() + ms);
    if (!raf) raf = requestAnimationFrame(tick);
  };

  // La sonde : les premières images. Une seule fenêtre suffit à décider (c'est la première impression).
  let stopProbe = () => {};
  const probe = window.setTimeout(() => {
    if (document.hidden) return;
    const start = performance.now();
    const first: number[] = [];
    let prev = 0;
    let frame = 0;
    const step = (t: number) => {
      frame = 0;
      if (prev && t - prev < BREAK) first.push(t - prev);
      prev = t;
      if (t - start < PROBE_MS) frame = requestAnimationFrame(step);
      else if (first.length > 20) {
        const v = verdict(first.slice(8));
        if (v) {
          quietUntil = t + COOLDOWN;
          lowerTo(v === 2 ? "low" : LOWER[getQuality()]);
        }
      }
    };
    frame = requestAnimationFrame(step);
    stopProbe = () => cancelAnimationFrame(frame);
  }, PROBE_DELAY);

  const onScroll = () => sample(SCROLL_TAIL);
  const onVisibility = () => {
    last = 0;
    samples = [];
    bad = 0;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    running = false;
    window.clearTimeout(probe);
    stopProbe();
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
