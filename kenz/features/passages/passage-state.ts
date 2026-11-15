/**
 * L'état partagé des passages, tenu hors de React : il doit survivre au changement de layout quand on passe
 * d'un univers à l'autre (le layout Pro est démonté, celui du Créateur monté, pendant que le voile couvre l'écran).
 * - L'arrivée en attente : en mémoire, et dans sessionStorage « kz-passage » (si la navigation recharge la page).
 * - La navigation : le routeur Next, branché par PassageRoot (sinon, une navigation classique).
 * - Un seul passage à la fois ; le défilement bloqué pendant le départ ; un garde-fou si la navigation n'aboutit pas.
 */
export type PassageKind = "passage" | "dive" | "liftoff";

/** Ce que la page d'arrivée rejoue : le voile coloré (et l'icône partagée), ou l'arrivée d'un passage secret. */
export type Arrival =
  | { kind: "passage"; path: string; t: number; color: string; icon?: string; size?: number }
  | { kind: "dive" | "liftoff"; path: string; t: number };

/** L'arrivée telle que la page la lit (usePassageArrival). */
export interface PassageArrival {
  /** Comment on arrive sur cette page : null (chargement ou lien ordinaire), le voile coloré, la plongée, le décollage. */
  via: PassageKind | null;
  /** Arrivée avec l'élément partagé (l'icône d'une app) : la page la montre déjà posée. */
  withIcon: boolean;
  /** Vrai quand le voile se lève (tout de suite sans passage) : le moment de jouer l'entrée du hero. */
  ready: boolean;
}

export const NO_ARRIVAL: PassageArrival = { via: null, withIcon: false, ready: true };

const STORAGE_KEY = "kz-passage";
/** Au-delà, le drapeau est périmé : un passage coloré se joue en un instant ; un passage secret peut attendre la Terre. */
const FRESH_MS: Record<PassageKind, number> = { passage: 6000, dive: 60000, liftoff: 60000 };

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------------
   L'arrivée en attente
   ------------------------------------------------------------------------ */
let pending: Arrival | null = null;
let current: { path: string; arrival: PassageArrival } | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());
const isFresh = (arrival: Arrival) => Date.now() - arrival.t < FRESH_MS[arrival.kind];

function clearStorage() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* stockage indisponible : rien à effacer */
  }
}

function parseArrival(raw: string | null): Arrival | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const a = value as Partial<Arrival> & { color?: unknown; icon?: unknown; size?: unknown };
    if (typeof a.path !== "string" || typeof a.t !== "number") return null;
    if (a.kind === "dive" || a.kind === "liftoff") return { kind: a.kind, path: a.path, t: a.t };
    if (a.kind !== "passage" || typeof a.color !== "string") return null;
    return {
      kind: "passage",
      path: a.path,
      t: a.t,
      color: a.color,
      icon: typeof a.icon === "string" ? a.icon : undefined,
      size: typeof a.size === "number" ? a.size : undefined,
    };
  } catch {
    return null;
  }
}

function hold(arrival: Arrival) {
  pending = arrival;
  current = {
    path: arrival.path,
    arrival: { via: arrival.kind, withIcon: arrival.kind === "passage" && !!arrival.icon, ready: false },
  };
  notify();
}

/** Départ : la page `arrival.path` jouera l'arrivée (en mémoire, et au cas où la navigation recharge la page). */
export function holdArrival(arrival: Arrival) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arrival));
  } catch {
    /* stockage indisponible : la mémoire suffit à une navigation du routeur */
  }
  hold(arrival);
}

/** La page `path` s'affiche : l'arrivée à jouer, s'il y en a une (elle est consommée). */
export function takeArrival(path: string): Arrival | null {
  const arrival = pending;
  if (arrival?.path === path) {
    pending = null;
    clearStorage();
    return arrival;
  }
  if (arrival && !isFresh(arrival)) {
    pending = null;
    clearStorage();
  }
  // Une autre page, sans passage : on oublie l'arrivée précédente.
  if (!pending && current && current.path !== path) {
    current = null;
    notify();
  }
  return null;
}

/** Le voile se lève : la page peut jouer son entrée. */
export function markArrivalReady() {
  if (!current || current.arrival.ready) return;
  current = { path: current.path, arrival: { ...current.arrival, ready: true } };
  notify();
}

export function subscribeArrival(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getArrival = () => current;
export const getServerArrival = () => null;

/* Rechargement de page (le routeur a dû naviguer en dur) : on reprend l'arrivée écrite au départ. */
if (typeof window !== "undefined") {
  let stored: Arrival | null = null;
  try {
    stored = parseArrival(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    stored = null;
  }
  if (stored && isFresh(stored) && stored.path === window.location.pathname) hold(stored);
  else clearStorage();
}

/* ------------------------------------------------------------------------
   La navigation (le routeur Next, branché par PassageRoot)
   ------------------------------------------------------------------------ */
interface PassageRouter {
  push: (href: string) => void;
  prefetch: (href: string) => void;
}

let router: PassageRouter | null = null;

export function connectRouter(next: PassageRouter) {
  router = next;
  return () => {
    if (router === next) router = null;
  };
}

export function navigate(href: string) {
  if (router) router.push(href);
  else window.location.assign(href);
}

export function prefetchRoute(href: string) {
  router?.prefetch(href);
}

/* ------------------------------------------------------------------------
   Un seul passage à la fois, le défilement bloqué, le garde-fou
   ------------------------------------------------------------------------ */
let running = false;
let gesture = false;
let silencedUntil = 0;
let safetyTimer = 0;
const releasers = new Set<() => void>();

/** Vrai pendant un passage, ou pendant le geste du cordon (les autres passages secrets attendent). */
export const isPassageBusy = () => running || gesture;

export function setGesture(on: boolean) {
  gesture = on;
}

/** Le clic qui suit un geste (cordon, ciel) ne doit pas suivre le lien sous le doigt. */
export function silenceNextClick(ms = 700) {
  silencedUntil = Date.now() + ms;
}

export function consumeSilencedClick() {
  if (Date.now() >= silencedUntil) return false;
  silencedUntil = 0;
  return true;
}

const blockEvent = (event: Event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
};
const blockKey = (event: KeyboardEvent) => {
  if (/^(?: |Spacebar|PageDown|PageUp|ArrowDown|ArrowUp|Home|End)$/.test(event.key)) blockEvent(event);
};
const BLOCK = { capture: true, passive: false } as const;

function lockScroll(on: boolean) {
  if (on) {
    window.addEventListener("wheel", blockEvent, BLOCK);
    window.addEventListener("touchmove", blockEvent, BLOCK);
    window.addEventListener("keydown", blockKey, BLOCK);
    return;
  }
  window.removeEventListener("wheel", blockEvent, BLOCK);
  window.removeEventListener("touchmove", blockEvent, BLOCK);
  window.removeEventListener("keydown", blockKey, BLOCK);
}

/** Prend la main pour un passage ; faux si un autre est déjà en cours. */
export function beginPassage(): boolean {
  if (running) return false;
  running = true;
  lockScroll(true);
  return true;
}

/** Un calque de passage à retirer si tout s'arrête (garde-fou, retour arrière). */
export function registerRelease(release: () => void) {
  releasers.add(release);
  return () => {
    releasers.delete(release);
  };
}

/** Le passage est arrivé (ou abandonné) : on rend la main et le défilement. */
export function endPassage() {
  window.clearTimeout(safetyTimer);
  if (running) lockScroll(false);
  running = false;
}

/** Tout s'arrête : les calques sont retirés, la page rendue intacte. */
export function releaseAll() {
  releasers.forEach((release) => release());
  releasers.clear();
  pending = null;
  clearStorage();
  endPassage();
  // La page d'arrivée, si elle finit par s'afficher, jouera une entrée ordinaire.
  if (current) {
    current = null;
    notify();
  }
}

/** Après la navigation : si la page d'arrivée ne s'affiche pas à temps, on rend la main. */
export function armSafety(ms: number) {
  window.clearTimeout(safetyTimer);
  safetyTimer = window.setTimeout(releaseAll, ms);
}
