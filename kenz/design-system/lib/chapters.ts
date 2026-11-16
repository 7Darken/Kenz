/**
 * Les chapitres de la page ([data-chapitre], dans l'ordre du document), mesurés une fois pour tous :
 * le Fil (rail, nœuds, traits) et l'Aura s'y abonnent au lieu d'écouter chacun le défilement.
 * Un seul écouteur de défilement, une image par frame ; mesure à nouveau au redimensionnement,
 * quand la hauteur de la page change, au chargement des polices et à chaque refresh de ScrollTrigger.
 * Les épinglages (ScrollTrigger, .pin-spacer) sont pris en compte.
 */
import { ScrollTrigger } from "@/design-system/motion/gsap";

export interface ChapterBox {
  el: HTMLElement;
  /** Haut et bas dans la page (px). */
  top: number;
  bottom: number;
  /** Progression de la page (0 → 1) quand le haut du chapitre passe au milieu de l'écran. */
  start: number;
}

export interface ChapterFrame {
  /** Progression du défilement de la page, 0 → 1. */
  progress: number;
  /** Index du chapitre au milieu de l'écran. */
  active: number;
}

interface Subscriber {
  onMeasure?: (boxes: readonly ChapterBox[]) => void;
  onFrame?: (frame: ChapterFrame, boxes: readonly ChapterBox[]) => void;
}

const subscribers = new Set<Subscriber>();
let boxes: ChapterBox[] = [];
let raf = 0;
let measureTimer = 0;
let stopRuntime: (() => void) | null = null;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
/** Un chapitre épinglé occupe la boîte de son pin-spacer. */
const boxOf = (el: HTMLElement) => (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el);

function measure() {
  measureTimer = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = maxScroll();
  boxes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapitre]")).map((el) => {
    const rect = boxOf(el).getBoundingClientRect();
    return { el, top: rect.top + y, bottom: rect.bottom + y, start: clamp01((rect.top + y - vh * 0.5) / max) };
  });
  subscribers.forEach((s) => s.onMeasure?.(boxes));
  frame();
}

function frame() {
  raf = 0;
  const y = window.scrollY;
  const mid = y + window.innerHeight * 0.5;
  let active = 0;
  boxes.forEach((box, index) => {
    if (box.top <= mid) active = index;
  });
  const current: ChapterFrame = { progress: clamp01(y / maxScroll()), active };
  subscribers.forEach((s) => s.onFrame?.(current, boxes));
}

const requestFrame = () => {
  if (!raf) raf = requestAnimationFrame(frame);
};

/** Remesure bientôt (regroupe les demandes rapprochées). */
export function remeasureChapters() {
  window.clearTimeout(measureTimer);
  measureTimer = window.setTimeout(measure, 120);
}

function startRuntime() {
  const resizeObserver = new ResizeObserver(remeasureChapters);
  resizeObserver.observe(document.body);
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", remeasureChapters);
  window.addEventListener("load", remeasureChapters);
  ScrollTrigger.addEventListener("refresh", remeasureChapters);
  void document.fonts?.ready.then(remeasureChapters);
  remeasureChapters();
  return () => {
    resizeObserver.disconnect();
    window.removeEventListener("scroll", requestFrame);
    window.removeEventListener("resize", remeasureChapters);
    window.removeEventListener("load", remeasureChapters);
    ScrollTrigger.removeEventListener("refresh", remeasureChapters);
    window.clearTimeout(measureTimer);
    cancelAnimationFrame(raf);
    raf = 0;
  };
}

/** S'abonne aux mesures et aux frames ; le suivi démarre au premier abonné et s'arrête au dernier. */
export function subscribeChapters(subscriber: Subscriber): () => void {
  subscribers.add(subscriber);
  if (!stopRuntime) stopRuntime = startRuntime();
  else if (boxes.length) {
    subscriber.onMeasure?.(boxes);
    requestFrame();
  }
  return () => {
    subscribers.delete(subscriber);
    if (!subscribers.size && stopRuntime) {
      stopRuntime();
      stopRuntime = null;
    }
  };
}
