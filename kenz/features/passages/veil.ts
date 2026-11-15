/**
 * Le passage coloré entre deux pages (port de maquettes/v6/shared/passage.js).
 * Départ : le rectangle de la source grandit jusqu'à l'écran entier, dans la couleur du lien (≈ 700 ms, léger flou) ;
 *   avec l'élément partagé (l'icône d'une app), la couleur s'étend en cercle depuis la source pendant que l'icône se
 *   pose au centre (≈ 740 ms). Puis la navigation (routeur Next) ; le voile reste en place, dans <body>.
 * Arrivée : le voile se contracte vers le centre et s'efface (≈ 800 ms). Avec l'icône, elle vole jusqu'à
 *   [data-passage-icone] (≈ 620 ms) pendant que le voile se rétracte dans [data-passage-arche] s'il existe.
 * Mouvement réduit : des fondus.
 */
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
  type Arrival,
} from "./passage-state";
import { createTrack, px, type Track } from "./track";
import styles from "./veil.module.css";

const DEFAULT_COLOR = "#0E1220";
const ICON_SIZE = 112;
const SAFETY_MS = 6000;

export interface OpenPassageOptions {
  /** La couleur du voile (sinon, le fond de la source). */
  color?: string;
  /** L'élément partagé : l'URL de l'icône, posée au centre, puis sur [data-passage-icone] à l'arrivée. */
  icon?: string;
  /** Sa taille au centre de l'écran, en px (112 par défaut). */
  size?: number;
}

type ColorArrival = Extract<Arrival, { kind: "passage" }>;

interface Veil {
  root: HTMLDivElement;
  inner: HTMLDivElement;
  icon: HTMLImageElement | null;
  track: Track;
  unregister: () => void;
}

/** Le voile en cours : celui du départ sert aussi à l'arrivée (navigation du routeur, sans rechargement). */
let veil: Veil | null = null;

function removeVeil(v: Veil) {
  v.track.kill();
  v.unregister();
  v.root.remove();
  if (veil === v) veil = null;
}

function mountVeil(color: string, icon: string | undefined, size: number): Veil {
  if (veil) removeVeil(veil);
  const root = document.createElement("div");
  root.className = styles.veil;
  root.setAttribute("aria-hidden", "true");
  root.style.setProperty("--passage-color", color);
  const inner = document.createElement("div");
  inner.className = styles.inner;
  root.append(inner);
  let img: HTMLImageElement | null = null;
  if (icon) {
    root.style.setProperty("--passage-icon", `${size}px`);
    img = document.createElement("img");
    img.className = styles.icon;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.src = icon;
    root.append(img);
  }
  document.body.append(root);
  const v: Veil = { root, inner, icon: img, track: createTrack(), unregister: () => {} };
  v.unregister = registerRelease(() => removeVeil(v));
  veil = v;
  return v;
}

function backgroundOf(el: Element | null) {
  if (!el) return "";
  const color = getComputedStyle(el).backgroundColor;
  return color && !/^(transparent|rgba\(\s*0,\s*0,\s*0,\s*0\s*\))$/i.test(color) ? color : "";
}

function radiusOf(el: Element, r: DOMRect) {
  const value = getComputedStyle(el).borderTopLeftRadius || "0";
  let n = Number.parseFloat(value) || 0;
  if (value.endsWith("%")) n = (Math.min(r.width, r.height) * n) / 100;
  return Math.min(n, Math.min(r.width, r.height) / 2);
}

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));

/**
 * Lance le passage vers `href` depuis `source` (le lien, ou l'élément qui s'ouvre). Faux si un passage est déjà
 * en cours. Un lien externe ou vers la page courante n'est pas un passage : c'est à l'appelant de l'écarter.
 */
export function openPassage(source: Element | null, href: string, options: OpenPassageOptions = {}): boolean {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (!beginPassage()) return false;
  prefetchRoute(url.pathname + url.search);

  const color = options.color || backgroundOf(source) || DEFAULT_COLOR;
  const size = options.size ?? ICON_SIZE;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let r = source?.getBoundingClientRect();
  if (!r || (!r.width && !r.height)) r = new DOMRect(vw / 2 - 40, vh / 2 - 40, 80, 80);
  const v = mountVeil(color, options.icon, size);
  const depart = () =>
    leave(url, { kind: "passage", path: url.pathname, t: Date.now(), color, icon: options.icon, size });

  if (prefersReducedMotion()) {
    v.track.fromTo(v.root, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: "power2.inOut", onComplete: depart });
    return true;
  }

  if (v.icon) {
    // L'élément partagé : la couleur s'étend en cercle depuis la source, l'icône se pose au centre.
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const r0 = Math.max(4, Math.min(r.width, r.height) * 0.55);
    const r1 = Math.ceil(Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy))) + 2;
    const at = `at ${px(cx)} ${px(cy)}`;
    v.track.tween(0.74, "power3.inOut", (k) => {
      v.inner.style.clipPath = `circle(${px(r0 + (r1 - r0) * k)} ${at})`;
    }, { onComplete: depart });
    v.track.fromTo(
      v.icon,
      { x: cx - vw / 2, y: cy - vh / 2, scale: r.width / size },
      { x: 0, y: 0, scale: 1, duration: 0.74, ease: "power3.inOut" },
    );
    return true;
  }

  // Le rectangle de la source grandit jusqu'à l'écran entier.
  const top = clamp(r.top, vh);
  const right = clamp(vw - r.right, vw);
  const bottom = clamp(vh - r.bottom, vh);
  const left = clamp(r.left, vw);
  const radius = source ? radiusOf(source, r) : 24;
  v.track.tween(0.7, "expo.out", (k) => {
    const q = 1 - k;
    v.inner.style.clipPath = `inset(${px(top * q)} ${px(right * q)} ${px(bottom * q)} ${px(left * q)} round ${px(radius * q)})`;
  }, { onComplete: depart });
  v.track.fromTo(v.root, { filter: "blur(10px)" }, { filter: "blur(0px)", duration: 0.42, ease: "power2.out", clearProps: "filter" });
  return true;
}

/** L'état final du départ est l'état initial de l'arrivée : on navigue sous le voile plein. */
function leave(url: URL, arrival: ColorArrival) {
  holdArrival(arrival);
  armSafety(SAFETY_MS);
  requestAnimationFrame(() => requestAnimationFrame(() => navigate(url.pathname + url.search + url.hash)));
}

/** La page d'arrivée s'affiche : le voile se lève (celui du départ, ou un nouveau si la page a été rechargée). */
export function playVeilArrival(arrival: ColorArrival) {
  endPassage();
  const size = arrival.size ?? ICON_SIZE;
  const v = veil ?? mountVeil(arrival.color, arrival.icon, size);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    markArrivalReady();
    removeVeil(v);
  };
  v.track.after(3.5, finish); // garde-fou
  const reduced = prefersReducedMotion();

  if (arrival.icon && v.icon) {
    landIcon(v, size, reduced, finish);
    return;
  }
  if (reduced) {
    v.track.after(0.05, () => {
      v.track.after(0.12, markArrivalReady);
      v.track.fromTo(v.root, { opacity: 1 }, { opacity: 0, duration: 0.42, ease: "power2.out", onComplete: finish });
    });
    return;
  }
  // Une image pleine, puis le voile se contracte vers le centre et s'efface en arrivant.
  requestAnimationFrame(() => {
    v.track.after(0.08, () => {
      v.track.tween(0.8, "power3.inOut", (k) => {
        const inset = `${50 * k}%`;
        v.inner.style.clipPath = `inset(${inset} ${inset} ${inset} ${inset} round ${px(40 * k)})`;
      }, { onComplete: finish });
      v.track.fromTo(v.root, { opacity: 1 }, { opacity: 0, duration: 0.3, delay: 0.5, ease: "power2.out" });
      v.track.after(0.24, markArrivalReady);
    });
  });
}

/** L'icône posée à sa place : visible tout de suite, sans transition de la page. */
function placeIcon(target: HTMLElement | null) {
  if (!target) return;
  target.style.transition = "none";
  target.style.transform = "none";
  target.style.opacity = "1";
}

/** L'icône du voile vole jusqu'à sa place sur la page ; le voile se rétracte dans l'arche de lumière. */
function landIcon(v: Veil, size: number, reduced: boolean, finish: () => void) {
  const first = document.querySelector<HTMLElement>("[data-passage-icone]");
  if (first) first.style.opacity = "0";
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    const target = document.querySelector<HTMLElement>("[data-passage-icone]");
    const arch = document.querySelector<HTMLElement>("[data-passage-arche]");
    markArrivalReady();
    if (reduced || !target || !v.icon) {
      placeIcon(target);
      v.track.fromTo(v.root, { opacity: 1 }, { opacity: 0, duration: 0.42, ease: "power2.out", onComplete: finish });
      return;
    }
    target.style.opacity = "0";
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = target.getBoundingClientRect();
    const w = target.offsetWidth || r.width;
    let flown = false;
    let faded = false;
    const done = () => {
      if (flown && faded) finish();
    };
    v.track.fromTo(
      v.icon,
      { x: 0, y: 0, scale: 1 },
      {
        x: r.left + r.width / 2 - vw / 2,
        y: r.top + r.height / 2 - vh / 2,
        scale: w / size,
        duration: 0.62,
        ease: "power3.inOut",
        onComplete: () => {
          placeIcon(target);
          v.icon?.remove();
          flown = true;
          done();
        },
      },
    );
    // Vers l'arche (son cintre arrondi), sinon vers le centre.
    const a = arch?.getBoundingClientRect();
    const to = a
      ? { t: Math.max(0, a.top), r: Math.max(0, vw - a.right), b: Math.max(0, vh - a.bottom), l: Math.max(0, a.left), round: a.width / 2, flat: 0 }
      : { t: vh / 2, r: vw / 2, b: vh / 2, l: vw / 2, round: 40, flat: 40 };
    v.track.tween(0.7, "power3.inOut", (k) => {
      const top = px(to.round * k);
      const bottom = px(to.flat * k);
      v.inner.style.clipPath = `inset(${px(to.t * k)} ${px(to.r * k)} ${px(to.b * k)} ${px(to.l * k)} round ${top} ${top} ${bottom} ${bottom})`;
    });
    v.track.fromTo(v.inner, { opacity: 1 }, {
      opacity: 0,
      duration: 0.36,
      delay: 0.5,
      ease: "power2.out",
      onComplete: () => {
        faded = true;
        done();
      },
    });
  };
  // La place de l'icône dépend des polices de la page : on les attend un instant.
  requestAnimationFrame(() => {
    const wait = new Promise<void>((resolve) => v.track.after(0.65, resolve));
    Promise.race([document.fonts.ready, wait]).then(
      () => v.track.after(0.06, go),
      () => v.track.after(0.06, go),
    );
  });
}
