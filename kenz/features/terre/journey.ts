/**
 * Le trajet du voyage sur /createur, piloté au défilement (portage de maquettes/v6/createur.html, §5 et §6).
 *
 * - Le hero : le globe est le tour de la Terre, sa courbure en bas de l'écran (le paysage, le portrait et leur départ
 *   au défilement appartiennent au module hero ; on n'y lit que la place de la scène, `[data-hero-scene]`).
 * - Le dézoom : la caméra recule jusqu'à la planète entière, tournée vers la première escale.
 * - Le voyage, épinglé : la Terre tourne d'escale en escale (l'ordre réel des séries), un fil d'or se trace entre deux
 *   escales, le panneau de l'escale change ; après le trajet, le globe part avec la page et s'efface.
 * - Vu une fois (sessionStorage « kz-terre-vu ») : dès la dernière escale atteinte (ou si l'on arrive plus bas), le
 *   trajet n'est plus épinglé ni piloté. La section devient un écran statique, mis en page comme l'écran épinglé : le
 *   globe avec tous ses arcs, la liste compacte des escales (cliquable : le globe tourne vers le pays). Le hero ne
 *   rejoue plus le dézoom : deux compositions fixes, « hero » et « voyage », reliées par un fondu court (le globe, son
 *   ciel, et le paysage et la scène du portrait du hero, par `setHeroFade` de features/hero).
 * - Mouvement réduit : pas d'épinglage, une liste ; le globe (l'image de repli) reste dans le hero, puis s'efface.
 * Le ciel suit l'opacité du globe : il s'efface avec lui après le trajet, et dans le fondu de l'écran statique.
 */
import { setHeroFade } from "@/features/hero";
import type { Globe, GlobeArc, GlobeFrame, LatLon } from "./engine/globe";
import { HERO_DRIFT, HERO_VIEW, STOPS } from "./stops";

export interface JourneyElements {
  section: HTMLElement;
  stage: HTMLElement;
  head: HTMLElement;
  stops: HTMLElement;
  route: HTMLElement | null;
  list: HTMLElement;
  hero: HTMLElement;
}

export interface JourneyOptions {
  reduced: boolean;
  scrollTo: (y: number, immediate: boolean) => void;
  /** L'escale choisie dans la liste compacte (aria-pressed). */
  onChoice: (index: number) => void;
}

export interface Journey {
  attach: (globe: Globe | null, sky: HTMLElement | null) => void;
  choose: (index: number) => void;
  destroy: () => void;
}

type Zone = "hero" | "voyage";

const SEEN_KEY = "kz-terre-vu";
/** Sur le globe, la latitude visée est un peu au sud de l'escale : le pays passe au-dessus du centre. */
const TILT = 6;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const n180 = (v: number) => ((((v + 180) % 360) + 360) % 360) - 180;
const towards = (a: LatLon, b: LatLon, k: number): LatLon => ({ lat: lerp(a.lat, b.lat, k), lon: a.lon + n180(b.lon - a.lon) * k });
const aimOf = (i: number): LatLon => ({ lat: STOPS[i].lat - TILT, lon: STOPS[i].lon });

function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* stockage indisponible : le trajet sera rejoué */
  }
}

/** La position verticale d'un élément dans un ancêtre, hors transformations (le geste d'entrée du portrait). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  let node: Element | null = el;
  while (node instanceof HTMLElement && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return node === ancestor ? y : el.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}

export function createJourney(el: JourneyElements, options: JourneyOptions): Journey {
  const { section, stage, head, stops, route, list, hero } = el;
  const { reduced } = options;
  const heroScene = hero.querySelector<HTMLElement>("[data-hero-scene]");
  const stopEls = Array.from(stops.children) as HTMLElement[];
  const routeDots = route ? (Array.from(route.children) as HTMLElement[]) : [];
  const NE = STOPS.length;
  const desk = window.matchMedia("(min-width: 900px)");

  let globe: Globe | null = null;
  let sky: HTMLElement | null = null;
  let arcs: GlobeArc[] = [];

  let seen = readSeen();
  const lowAnchor = /^#(voyage|sport|suivre)$/.test(window.location.hash);
  if (lowAnchor) {
    seen = true; /* arrivé plus bas : les états finaux, pour toute la session */
    writeSeen();
  }
  const inSeen = () => seen && !reduced;

  let zone: Zone = "hero";
  let shownZone: Zone = "hero";
  let redo = false;
  let fade = 1;
  let fadeRaf = 0;
  let fadeT = 0;
  let lastArcRaf = 0;
  let choice = NE - 1;
  let lastProgress = 1;

  let vh = window.innerHeight;
  let vw = document.documentElement.clientWidth;
  let pinned = false;
  let top = 0;
  let len = 1;
  let step = 1;
  let active = -1;
  let departure: LatLon | null = null;
  let mobile: { y: number; r: number } | null = null;
  let stageBox: { top: number; height: number } | null = null;
  let lastVa = -1;
  let ticking = false;
  let frameRaf = 0;
  let resizeTimer = 0;

  /* « Le voyage » et la première escale n'apparaissent qu'une fois le globe posé à sa place */
  function appear(v: number) {
    if (Math.abs(v - lastVa) < 0.001) return;
    lastVa = v;
    stage.style.setProperty("--va", v.toFixed(3));
  }

  /** Le fondu de la Terre : le globe et son ciel ensemble ; à 0, le rendu s'arrête. */
  function layerOpacity(v: number) {
    globe?.opacity(v);
    if (!sky) return;
    sky.style.opacity = v >= 0.999 ? "" : v.toFixed(3);
    sky.style.visibility = v < 0.01 ? "hidden" : "";
  }

  /* Les places du globe à l'écran (px) : le tour de la Terre dans le hero, puis la planète entière du voyage */
  function poseHero(): GlobeFrame {
    if (globe?.mode === "fallback") {
      const r = vw >= 900 ? Math.min(vw * 0.36, vh * 0.72) : vw * 0.62;
      return { x: vw >= 900 ? vw * 0.71 : vw * 0.5, y: vh * 0.82 + r, r };
    }
    if (vw >= 900) {
      const r = Math.max(vw * 1.02, vh * 1.6);
      return { x: vw * 0.62, y: vh * 0.8 + r, r };
    }
    const r = Math.max(vw * 1.7, vh * 0.72);
    const limb = stageBox
      ? Math.min(vh * 0.88, Math.max(vh * 0.62, stageBox.top + stageBox.height * 0.74))
      : vh * 0.8;
    return { x: vw * 0.5, y: limb + r, r };
  }
  function poseVoyage(): GlobeFrame {
    if (vw >= 900) {
      const r = Math.min(vh * 0.31, vw * 0.22);
      return { x: Math.max(vw * 0.31, r + 72), y: vh * 0.57, r };
    }
    if (mobile) return { x: vw * 0.5, y: mobile.y, r: mobile.r };
    return { x: vw * 0.5, y: vh * 0.38, r: Math.min(vw * 0.4, vh * 0.18) };
  }

  function measureVoyage() {
    pinned = section.hasAttribute("data-pin") && !inSeen();
    if (pinned) {
      step = vh * (vw >= 900 ? 0.62 : 0.56);
      const h = `${Math.round(vh + (NE - 1) * step + vh * 0.5)}px`;
      if (section.style.height !== h) section.style.height = h;
    } else if (section.style.height) section.style.height = "";
    /* mobile : le globe entre le titre et le panneau (ou la liste) */
    const below = inSeen() ? list : stops;
    if ((pinned || inSeen()) && vw < 900) {
      const hb = head.offsetTop + head.offsetHeight;
      const pt = below.offsetTop;
      mobile = { y: (hb + pt) / 2 + 4, r: Math.max(56, Math.min(vw * 0.4, (pt - hb) / 2 - 16)) };
    } else mobile = null;
  }

  function measure() {
    vh = window.innerHeight;
    vw = document.documentElement.clientWidth;
    measureVoyage();
    const y = window.scrollY;
    const rect = section.getBoundingClientRect();
    top = rect.top + y;
    len = Math.max(1, rect.height - vh);
    stageBox = heroScene ? { top: offsetWithin(heroScene, hero), height: heroScene.offsetHeight } : null;
  }

  /* L'escale à l'écran : le panneau, le point qui s'allume, la petite route de points */
  function setStop(a: number) {
    if (a === active) return;
    active = a;
    stopEls.forEach((li, i) => {
      li.toggleAttribute("data-on", i === a);
      li.toggleAttribute("data-before", i < a);
    });
    routeDots.forEach((li, i) => {
      li.toggleAttribute("data-on", i === a);
      li.toggleAttribute("data-done", i < a);
    });
    route?.style.setProperty("--rp", (a / Math.max(1, NE - 1)).toFixed(4));
    globe?.light(STOPS[a]?.id ?? null);
  }

  function voyageFrame(y: number) {
    if (!globe) return;
    if (inSeen()) {
      seenFrame(y);
      return;
    }
    const ph = poseHero();
    if (!pinned) {
      /* mouvement réduit : le globe reste dans le hero, puis s'efface */
      globe.frame(ph);
      layerOpacity(1 - clamp01((y - vh * 0.3) / (vh * 0.55)));
      return;
    }
    const pv = poseVoyage();
    const t = clamp01(y / Math.max(1, top));
    appear(t < 1 ? 0 : smooth(0, 0.14, (y - top) / Math.max(1, step)));
    if (t <= 0) {
      if (departure) {
        /* retour au hero : l'Asie revient au bord de la Terre */
        departure = null;
        globe.drift(HERO_DRIFT);
        globe.orient(HERO_VIEW.lat, HERO_VIEW.lon);
      }
      globe.frame(ph);
      layerOpacity(1);
      arcs.forEach((arc) => arc.trace(0).vivid(false));
      setStop(0);
      return;
    }
    if (!departure) {
      departure = globe.view();
      globe.drift(0);
    }
    const end = top + (NE - 1) * step;
    let pose: GlobeFrame;
    let view: LatLon;
    let a = 0;
    if (t < 1) {
      /* l'orbite s'éloigne : on recule jusqu'à voir la Terre entière, tournée vers la première escale */
      const k = smooth(0, 1, t);
      pose = { x: lerp(ph.x, pv.x, k), y: lerp(ph.y, pv.y, k), r: lerp(ph.r, pv.r, k) };
      view = towards(departure, aimOf(0), k);
      arcs.forEach((arc) => arc.trace(0).vivid(false));
    } else {
      const p = clamp01((y - top) / Math.max(1, end - top));
      const f = p * (NE - 1);
      const i = Math.min(NE - 2, Math.floor(f));
      const fr = f - i;
      const mv = smooth(0.26, 0.86, fr);
      view = towards(aimOf(i), aimOf(i + 1), mv);
      /* pendant le vol, la caméra prend un peu de hauteur */
      pose = { x: pv.x, y: pv.y, r: pv.r * (1 - 0.1 * Math.sin(Math.PI * mv)) };
      arcs.forEach((arc, k) => {
        if (k < i) arc.trace(1).vivid(false);
        else if (k === i) arc.trace(smooth(0.2, 0.88, fr)).vivid(true);
        else arc.trace(0).vivid(false);
      });
      a = fr >= 0.6 ? i + 1 : i;
      /* la dernière escale est atteinte : le trajet est vu, il ne se rejouera plus */
      if (a >= NE - 1) {
        lastProgress = smooth(0.2, 0.88, fr);
        setStop(a);
        enterSeen(true);
        return;
      }
    }
    /* après le voyage, le globe part avec la page et s'efface */
    const after = y - (top + len);
    if (after > 0) pose.y -= after;
    layerOpacity(1 - clamp01(after / (vh * 0.6)));
    globe.orient(view.lat, view.lon);
    globe.frame(pose);
    setStop(a);
  }

  /* ---------- Vu une fois : les deux compositions, le fondu, la bascule ---------- */
  const zoneOf = (y: number): Zone => (y < Math.max(1, hero.offsetHeight - vh * 0.5) ? "hero" : "voyage");

  /** Le globe suit la page sans retard (`follow`) ; `jump` : posé d'un coup, sous le fondu. */
  function placeSeen(y: number, jump: boolean) {
    if (!globe) return;
    const opts = jump ? { jump: true } : { follow: true };
    if (shownZone === "hero") {
      const ph = poseHero();
      globe.frame({ x: ph.x, y: ph.y - y, r: ph.r }, opts);
    } else {
      const pv = poseVoyage();
      globe.frame({ x: pv.x, y: pv.y + top - y, r: pv.r }, opts);
    }
  }
  /** Le hero ne montre que le paysage, l'horizon et Kenz : les arcs et les escales sont masqués d'un coup. */
  function hideRoute() {
    arcs.forEach((arc) => arc.trace(0, true).vivid(false, true));
    globe?.showPoints(false);
  }
  /** L'état initial du hero (l'Asie au bord de la Terre, sans arcs), ou l'état final du voyage (tous les arcs). */
  function applyZone(z: Zone) {
    if (!globe) return;
    if (z === "hero") {
      departure = null;
      globe.drift(HERO_DRIFT);
      globe.aim(HERO_VIEW.lat, HERO_VIEW.lon, 0);
      hideRoute();
      globe.light(STOPS[0].id);
    } else {
      const target = aimOf(choice);
      globe.drift(0);
      globe.aim(target.lat, target.lon, 0);
      globe.showPoints(true);
      arcs.forEach((arc) => arc.trace(1, true).vivid(false, true));
      globe.light(STOPS[choice].id);
    }
    placeSeen(window.scrollY, true);
  }
  /** Le globe, son ciel, et le paysage et le portrait du hero (seulement quand le hero est la composition montrée). */
  function seenOpacities() {
    layerOpacity(fade);
    setHeroFade(hero, shownZone === "hero" ? fade : 0);
  }
  /* Le fondu : l'ancienne composition s'efface (0,14 s), la nouvelle est posée, elle apparaît (0,3 s) */
  function fadeStep(t: number) {
    fadeRaf = 0;
    const dt = Math.min(64, Math.max(0, t - fadeT));
    fadeT = t;
    if (shownZone !== zone || redo) {
      fade -= dt / 140;
      if (fade <= 0) {
        fade = 0;
        redo = false;
        shownZone = zone;
        applyZone(shownZone);
      }
    } else fade = Math.min(1, fade + dt / 300);
    seenOpacities();
    if (shownZone !== zone || redo || fade < 1) fadeRaf = requestAnimationFrame(fadeStep);
  }
  function startFade() {
    if (fadeRaf) return;
    fadeT = performance.now();
    fadeRaf = requestAnimationFrame(fadeStep);
  }
  function seenFrame(y: number) {
    const z = zoneOf(y);
    if (z !== zone) {
      zone = z;
      if (z === "hero") hideRoute(); /* dès le début du retour, avant le fondu */
      startFade();
    }
    placeSeen(y, false);
  }

  /** Un pays de la liste : le globe tourne vers lui (0,6 s). */
  function choose(index: number, duration = 0.6) {
    choice = index;
    options.onChoice(index);
    if (!globe || shownZone !== "voyage") return;
    const target = aimOf(index);
    globe.aim(target.lat, target.lon, duration);
    globe.light(STOPS[index].id);
  }

  /**
   * La bascule : l'épinglage et le pilotage sont retirés ; la position de défilement est compensée de la hauteur
   * retirée, pour que rien ne saute. `fromLast` : on vient d'atteindre la dernière escale (le globe finit sa rotation,
   * le dernier arc son tracé).
   */
  function enterSeen(fromLast: boolean) {
    if (seen || reduced) return;
    seen = true;
    writeSeen();
    const y = window.scrollY;
    const h0 = section.offsetHeight;
    const top0 = top;
    const end0 = top + len;
    section.setAttribute("data-vu", "");
    measure();
    const removed = h0 - section.offsetHeight;
    let y2 = y;
    if (y >= end0) y2 = y - removed;
    else if (y > top0) y2 = top0;
    if (Math.abs(y2 - y) > 0.5) options.scrollTo(y2, true);
    measure();
    lastVa = -1;
    appear(1);
    choice = NE - 1;
    options.onChoice(choice);
    zone = zoneOf(y2);
    if (fromLast && globe && zone === "voyage") {
      shownZone = "voyage";
      fade = 1;
      const target = aimOf(choice);
      const last = arcs[arcs.length - 1];
      globe.drift(0);
      globe.aim(target.lat, target.lon, 0.5);
      globe.light(STOPS[choice].id);
      arcs.forEach((arc) => {
        if (arc !== last) arc.trace(1).vivid(false);
      });
      if (last) {
        let t0 = 0;
        const finish = (t: number) => {
          lastArcRaf = 0;
          t0 = t0 || t;
          const k = Math.min(1, (t - t0) / 450);
          if (shownZone !== "voyage") return;
          last.trace(lastProgress + (1 - lastProgress) * k).vivid(k < 1);
          if (k < 1) lastArcRaf = requestAnimationFrame(finish);
        };
        lastArcRaf = requestAnimationFrame(finish);
      }
      placeSeen(y2, false);
    } else if (globe) {
      /* un saut (ancre) : la composition en cours s'efface, la bonne est posée, en fondu */
      shownZone = zone;
      redo = true;
      startFade();
    } else {
      shownZone = zone;
      fade = 1;
    }
    seenOpacities();
    ticking = false;
    onScroll();
  }

  function frame() {
    ticking = false;
    frameRaf = 0;
    const y = window.scrollY;
    /* arrivé d'un saut au-delà du trajet : il est vu */
    if (!seen && pinned && y > top + len) {
      enterSeen(false);
      return;
    }
    voyageFrame(y);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    frameRaf = requestAnimationFrame(frame);
  }
  function remeasure() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      frame();
    }, 120);
  }
  const measureNow = () => {
    measure();
    frame();
  };

  function setup() {
    section.toggleAttribute("data-pin", !reduced);
    section.toggleAttribute("data-vu", inSeen());
    active = -1;
    setStop(0);
    if (reduced) stopEls.forEach((li) => li.removeAttribute("data-on"));
    if (reduced) stopEls.forEach((li) => li.removeAttribute("data-before"));
    if (inSeen()) {
      measure();
      lastVa = -1;
      appear(1);
      options.onChoice(choice);
      zone = shownZone = zoneOf(window.scrollY);
      fade = 1;
      redo = false;
      applyZone(shownZone);
      seenOpacities();
    }
    measure();
    frame();
  }

  /* Les ancres du sport et de « Me suivre » sautent par-dessus le trajet : il est vu, la hauteur est juste */
  function onAnchorClick(event: MouseEvent) {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='#']");
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.pathname === window.location.pathname && (url.hash === "#sport" || url.hash === "#suivre")) enterSeen(false);
  }
  /* Au clavier, dans le voyage épinglé : l'escale qui reçoit le focus vient à l'écran */
  function onFocusIn(event: FocusEvent) {
    if (!pinned) return;
    const li = (event.target as Element | null)?.closest("li");
    const i = li ? stopEls.indexOf(li as HTMLElement) : -1;
    if (i > -1 && i !== active) options.scrollTo(top + Math.max(0, i - 0.25) * step, true);
  }

  setup();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", measureNow);
  desk.addEventListener("change", setup);
  document.addEventListener("click", onAnchorClick, true);
  section.addEventListener("focusin", onFocusIn);
  const ro = new ResizeObserver(remeasure);
  ro.observe(section.closest("main") ?? document.body);
  void document.fonts?.ready.then(measureNow);
  /* arrivé par une ancre plus bas : la page a changé de hauteur, on y retourne */
  if (lowAnchor && !reduced) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      measure();
      options.scrollTo(target.getBoundingClientRect().top + window.scrollY, true);
      frame();
    }
  }

  return {
    attach(nextGlobe, nextSky) {
      globe = nextGlobe;
      sky = nextSky;
      arcs = [];
      if (!globe) return;
      const g = globe;
      arcs = STOPS.slice(1).map((stop, k) => g.arc(`vol-${k}`, STOPS[k], stop, stop.upcoming));
      active = -1;
      measure();
      if (inSeen()) {
        zone = shownZone = zoneOf(window.scrollY);
        fade = 1;
        applyZone(shownZone);
        seenOpacities();
      }
      frame();
    },
    choose,
    destroy() {
      cancelAnimationFrame(frameRaf);
      cancelAnimationFrame(fadeRaf);
      cancelAnimationFrame(lastArcRaf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", measureNow);
      desk.removeEventListener("change", setup);
      document.removeEventListener("click", onAnchorClick, true);
      section.removeEventListener("focusin", onFocusIn);
      ro.disconnect();
      section.removeAttribute("data-pin");
      section.removeAttribute("data-vu");
      section.style.removeProperty("height");
      setHeroFade(hero, null);
      stage.style.removeProperty("--va");
      if (sky) {
        sky.style.removeProperty("opacity");
        sky.style.removeProperty("visibility");
      }
    },
  };
}
