/**
 * Les passages secrets entre les deux univers, DA Terre (port de maquettes/v6/shared/cordon.js, BRIEF-V6-TERRE.md) :
 * le côté Pro, c'est l'espace ; le côté Créateur, c'est la Terre.
 * - startDive() : LA PLONGÉE (Pro → Créateur). Un point de lumière s'ouvre en petite planète bleue, qui grandit de
 *   plus en plus vite en glissant vers le centre ; l'éclat d'atmosphère la recouvre ; puis /createur, où l'éclat se
 *   dissipe dès que la Terre est prête (announceTerreReady), et la Terre finit la descente.
 * - startLiftoff() : LE DÉCOLLAGE (Créateur → Pro). La page se fond dans l'espace, la Terre s'éloigne jusqu'à n'être
 *   plus qu'un point, les étoiles reviennent ; puis /, où les étoiles filent et s'effacent sur la page.
 * Mouvement réduit : des fondus.
 */
import { ROUTES } from "@/content/site";
import {
  armSafety,
  beginPassage,
  endPassage,
  holdArrival,
  markArrivalReady,
  navigate,
  prefersReducedMotion,
  prefetchRoute,
  registerRelease,
} from "./passage-state";
import styles from "./portal.module.css";
import { createTrack, round2, smooth, type Track } from "./track";

/** L'événement émis par la Terre à son premier rendu (globe prêt, ou image de repli posée). */
const TERRE_READY_EVENT = "terre:prete";
/** La plongée commence (le point est devenu planète) : la scène de départ peut plonger avec elle. */
export const DIVE_PLUNGE_DELAY = 0.82;
const SAFETY_MS = 9000;

const GLOBE = { night: "/assets/terre/globe-nuit.webp", day: "/assets/terre/globe-jour.webp" } as const;
/** L'image fait 400 px de côté et son disque 42 % : on la pose puis on l'échelonne. */
const SIDE = 400;
const DISC = 0.42;

type PortalKind = "dive" | "liftoff";

interface Layer {
  el: HTMLDivElement;
  track: Track;
  unregister: () => void;
}

/** Le calque en cours (départ, puis arrivée) : il reste dans <body> pendant la navigation. */
let layer: Layer | null = null;
let terreReady = false;

function removeLayer(l: Layer) {
  l.track.kill();
  l.unregister();
  l.el.remove();
  if (layer === l) layer = null;
}

function mountLayer(className: string): Layer {
  const el = document.createElement("div");
  el.className = className;
  el.setAttribute("aria-hidden", "true");
  document.body.append(el);
  const previous = layer;
  const l: Layer = { el, track: createTrack(), unregister: () => {} };
  l.unregister = registerRelease(() => removeLayer(l));
  layer = l;
  // Le nouveau calque couvre déjà l'écran : l'ancien peut partir sans éclair.
  if (previous) removeLayer(previous);
  return l;
}

function add(parent: HTMLElement, tag: "div" | "i", className: string) {
  const el = document.createElement(tag);
  el.className = className;
  parent.append(el);
  return el;
}

/** La Terre (selon le mode : de nuit ou de jour), avec le point de lumière d'où elle naît pour la plongée. */
function addGlobe(parent: HTMLElement, withGlow: boolean) {
  const globe = add(parent, "div", styles.globe);
  if (withGlow) add(globe, "i", styles.glow);
  const img = document.createElement("img");
  img.className = styles.globeImg;
  img.alt = "";
  img.draggable = false;
  img.decoding = "async";
  img.src = document.documentElement.getAttribute("data-theme") === "light" ? GLOBE.day : GLOBE.night;
  globe.append(img);
  return globe;
}

/** La Terre centrée en (x, y), de rayon apparent r (px). */
function placeGlobe(el: HTMLElement, x: number, y: number, r: number) {
  const scale = Math.round((r / (SIDE * DISC)) * 10000) / 10000;
  el.style.transform = `translate3d(${round2(x - SIDE / 2)}px,${round2(y - SIDE / 2)}px,0) scale(${scale})`;
}

/** La page de départ est couverte : on part vers l'autre univers. */
function leave(kind: PortalKind) {
  const path = kind === "dive" ? ROUTES.createur : ROUTES.home;
  holdArrival({ kind, path, t: Date.now() });
  armSafety(SAFETY_MS);
  requestAnimationFrame(() => requestAnimationFrame(() => navigate(path)));
}

/**
 * La plongée vers la Terre (Pro → Créateur), depuis le point `from` de l'écran (par défaut, son centre).
 * Faux si un passage est déjà en cours.
 */
export function startDive({ from }: { from?: { x: number; y: number } } = {}): boolean {
  if (!beginPassage()) return false;
  terreReady = false;
  prefetchRoute(ROUTES.createur);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x0 = from && Number.isFinite(from.x) ? from.x : vw / 2;
  const y0 = from && Number.isFinite(from.y) ? from.y : vh / 2;
  const l = mountLayer(styles.dive);
  const globe = addGlobe(l.el, true);
  const eclat = add(l.el, "i", styles.eclat);
  const r1 = Math.max(26, Math.min(44, Math.min(vw, vh) * 0.045));

  if (prefersReducedMotion()) {
    placeGlobe(globe, x0, y0, r1);
    l.track.fromTo(globe, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.inOut" });
    l.track.fromTo(eclat, { opacity: 0 }, {
      opacity: 1,
      duration: 0.45,
      delay: 0.55,
      ease: "power2.inOut",
      onComplete: () => leave("dive"),
    });
    return true;
  }

  // 1. Le point de lumière s'ouvre en petite planète bleue.
  placeGlobe(globe, x0, y0, 1.2);
  globe.style.setProperty("--flash", "1");
  globe.style.opacity = "1";
  l.track.tween(0.75, "expo.out", (k) => {
    placeGlobe(globe, x0, y0, 1.2 + (r1 - 1.2) * k);
    globe.style.setProperty("--flash", String(round2(1 - k)));
  });
  // 2. Elle grandit de plus en plus vite et glisse vers le centre ; 3. l'éclat d'atmosphère.
  const rMax = Math.hypot(vw, vh) * 1.3;
  const cx = vw / 2;
  const cy = vh * 0.56;
  l.track.tween(1.25, "none", (p) => {
    const e = p ** 1.7;
    const m = smooth(0, 1, p);
    placeGlobe(globe, x0 + (cx - x0) * m, y0 + (cy - y0) * m, r1 * (rMax / r1) ** e);
    eclat.style.opacity = String(round2(smooth(0.52, 1, p)));
  }, { delay: DIVE_PLUNGE_DELAY, onComplete: () => leave("dive") });
  return true;
}

/** Le décollage vers les étoiles (Créateur → Pro). Faux si un passage est déjà en cours. */
export function startLiftoff(): boolean {
  if (!beginPassage()) return false;
  prefetchRoute(ROUTES.home);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const l = mountLayer(styles.liftoff);
  const stars = add(l.el, "i", styles.stars);
  const globe = addGlobe(l.el, false);
  globe.style.opacity = "1";

  if (prefersReducedMotion()) {
    placeGlobe(globe, vw / 2, vh * 0.56, Math.min(vw, vh) * 0.16);
    l.track.fromTo(l.el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.inOut" });
    l.track.after(0.95, () => leave("liftoff"));
    return true;
  }

  // L'horizon en bas de l'écran, comme l'orbite du hero ; la Terre s'éloigne jusqu'à n'être plus qu'un point.
  const r0 = Math.max(vw * 1.15, vh * 1.25);
  const y0 = vh * 0.82 + r0;
  const rf = 2.2;
  const yc = vh * 0.54;
  placeGlobe(globe, vw / 2, y0, r0);
  stars.style.opacity = "0";
  l.track.fromTo(l.el, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.inOut" });
  l.track.tween(1.5, "none", (p) => {
    const e = 1 - (1 - p) ** 1.6;
    const r = r0 * (rf / r0) ** e;
    const k = (r - rf) / (r0 - rf);
    placeGlobe(globe, vw / 2, yc + (y0 - yc) * k, r);
    globe.style.opacity = String(round2(1 - smooth(0.82, 1, p)));
    stars.style.opacity = String(round2(smooth(0.05, 0.6, p)));
    stars.style.transform = `scale(${round2(1.3 - 0.3 * smooth(0, 1, p))})`;
  }, { delay: 0.3, onComplete: () => leave("liftoff") });
  return true;
}

/**
 * La Terre (features/terre) a fait son premier rendu : l'éclat de la plongée peut se dissiper sur elle.
 * Sans cet appel, l'éclat se dissipe au bout de 2,4 s.
 */
export function announceTerreReady() {
  terreReady = true;
  document.dispatchEvent(new CustomEvent(TERRE_READY_EVENT));
}

/** L'arrivée d'un passage secret : l'éclat se dissipe sur la Terre (Créateur), ou les étoiles filent (Pro). */
export function playPortalArrival(kind: PortalKind) {
  endPassage();
  const toEarth = kind === "dive";
  const l = mountLayer(toEarth ? styles.arrival : `${styles.arrival} ${styles.arrivalSky}`);
  // Le même calque qu'au départ : l'éclat d'atmosphère (Créateur), ou l'espace étoilé (Pro).
  const surface = add(l.el, "i", toEarth ? styles.eclat : styles.stars);
  let finished = false;
  let ready = false;
  const signal = () => {
    if (ready) return;
    ready = true;
    markArrivalReady();
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    signal();
    document.removeEventListener(TERRE_READY_EVENT, go);
    removeLayer(l);
  };
  let started = false;
  function go() {
    if (started) return;
    started = true;
    document.removeEventListener(TERRE_READY_EVENT, go);
    l.track.after(4, finish); // garde-fou
    if (prefersReducedMotion()) {
      l.track.after(0.15, signal);
      l.track.fromTo(l.el, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power2.out", onComplete: finish });
      return;
    }
    if (toEarth) {
      l.track.after(0.3, signal);
      l.track.fromTo(l.el, { opacity: 1 }, { opacity: 0, duration: 1.5, ease: "power2.out", onComplete: finish });
      return;
    }
    l.track.after(0.25, signal);
    l.track.fromTo(surface, { scale: 1 }, { scale: 1.7, duration: 1.4, ease: "expo.out" });
    l.track.fromTo(l.el, { opacity: 1 }, { opacity: 0, duration: 1.1, delay: 0.12, ease: "power2.out", onComplete: finish });
  }
  if (toEarth && !terreReady) {
    // La Terre se charge (three.js, textures) : l'éclat l'attend, 2,4 s au plus.
    document.addEventListener(TERRE_READY_EVENT, go);
    l.track.after(2.4, go);
  } else {
    l.track.after(0.12, go);
  }
}
