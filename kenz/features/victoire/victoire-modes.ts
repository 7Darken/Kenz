/**
 * Les deux façons de jouer la séquence « 54 heures » (port de maquettes/v6/shared/victoire.js) :
 * - `flowMode` : les trois temps les uns sous les autres, chacun joué à son entrée (mobile, mouvement réduit) ;
 * - `pinMode` : ordinateur ≥ 900 × 600, une scène épinglée sur 3 écrans que le défilement joue ;
 *   « vu une fois » (drapeau de session `kz-54h-vu`) : la fin atteinte, l'état final est figé, puis l'épinglage
 *   est retiré au repos du défilement et la position compensée (rien ne bouge à l'écran).
 * Chaque mode renvoie son nettoyage ; les tweens et ScrollTrigger sont annulés par le gsap.matchMedia appelant.
 */
import type Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/features/motion/gsap";

import { H14, H30, H54, PIN_SCREENS } from "./victoire-geometry";
import {
  corridor,
  corridorEnd,
  frame,
  measureBeam,
  seqCorridor,
  seqFirst,
  seqPodium,
  seqPrints,
  seqRole,
  seqTriumph,
  seqWall,
  setClock,
  tilt,
  type BeamGeometry,
  type PhotoFrame,
  type VictoireRefs,
} from "./victoire-timelines";

/* =========================================================
   Mode « à la suite » : chaque temps se joue à son entrée
   ========================================================= */
export function flowMode(R: VictoireRefs, photo: PhotoFrame, reduced: boolean) {
  const { root } = R;
  const anim = !reduced;
  const timers: number[] = [];
  let alive = true;
  root.dataset.mode = "flow";
  root.toggleAttribute("data-rm", reduced);
  // La loupe sur la photo de l'annonce et sur la plateforme (rien n'est épinglé ici).
  R.archIn.setAttribute("data-loupe", "");
  R.view.setAttribute("data-loupe", "");

  const [m1 = [], m2 = [], m3 = []] = R.digits.minis;
  setClock([m1], H54);
  setClock([m2], H30);
  setClock([m3], H14);

  const later = (ms: number, fn: () => void) => {
    timers.push(window.setTimeout(() => alive && fn(), ms));
  };
  const outCubic = (p: number) => 1 - Math.pow(1 - p, 3);
  const count = (digits: HTMLElement[], from: number, to: number, ms: number) => {
    let start = 0;
    const step = (now: number) => {
      if (!alive) return;
      if (!start) start = now;
      const p = Math.min(1, (now - start) / ms);
      setClock([digits], from + (to - from) * outCubic(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const beam: BeamGeometry = { ww: 0, wh: 0, a: 0, l: 0 };
  let tl1: gsap.core.Timeline | null = null;
  let tl2: gsap.core.Timeline | null = null;
  let tl3: gsap.core.Timeline | null = null;
  if (anim) {
    root.setAttribute("data-seq", "");
    measureBeam(R, beam);
    tl1 = gsap.timeline({ paused: true });
    seqWall(tl1, R, 0.2, 1.15, () => beam);
    tl2 = gsap.timeline({ paused: true });
    seqRole(tl2, R, 0.25, 1.05, (h) => {
      if (R.n24.firstChild) R.n24.firstChild.nodeValue = String(h);
    });
    tl3 = gsap.timeline({ paused: true });
    const clock = { s: H14 };
    tl3.fromTo(clock, { s: H14 }, { s: 0, duration: 1.7, ease: "power2.in", onUpdate: () => setClock([m3], clock.s) }, 0.3);
    const zero = seqCorridor(tl3, R, 0.3, 1.7, () => 1.6);
    seqTriumph(tl3, R, zero, 1.15);
    tl3.to(R.dayWords, { opacity: 0, y: -10, duration: 0.2 }, zero);
    seqFirst(tl3, R, zero + 0.5, 1.1);
    tl3.call(() => R.t3.setAttribute("data-zero", ""), undefined, zero + 1.7);
    corridor(R, 0);
  } else {
    corridorEnd(R);
  }

  const untilt = tilt(R, R.t3);
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!alive) return;
      frame(R, photo);
      if (anim) measureBeam(R, beam);
    }, 120);
  };
  frame(R, photo);
  window.addEventListener("resize", onResize);

  const play = (t: HTMLElement) => {
    if (t.hasAttribute("data-in")) return;
    t.setAttribute("data-in", "");
    if (t === R.t1) {
      if (!tl1) setClock([m1], H30);
      else {
        later(300, () => count(m1, H54, H30, 2600));
        measureBeam(R, beam);
        tl1.invalidate().play();
      }
    }
    if (t === R.t2) {
      if (reduced) setClock([m2], H14);
      else later(300, () => count(m2, H30, H14, 4200));
      tl2?.play();
    }
    if (t === R.t3) {
      if (tl3) tl3.play();
      else {
        setClock([m3], 0);
        R.t3.setAttribute("data-zero", "");
        corridorEnd(R);
      }
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        play(e.target as HTMLElement);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.4 },
  );
  R.temps.forEach((t) => io.observe(t));

  return () => {
    alive = false;
    timers.forEach((id) => window.clearTimeout(id));
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    io.disconnect();
    untilt();
    corridorEnd(R);
    R.archIn.removeAttribute("data-loupe");
    R.view.removeAttribute("data-loupe");
    root.removeAttribute("data-mode");
    root.removeAttribute("data-rm");
    root.removeAttribute("data-seq");
    R.temps.forEach((t) => {
      t.removeAttribute("data-in");
      t.removeAttribute("data-zero");
    });
  };
}

/* =========================================================
   Mode épinglé : la section reste à l'écran, le défilement joue le week-end
   ========================================================= */
const SEEN_KEY = "kz-54h-vu";

function seenBefore() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* stockage indisponible : l'état reste en mémoire pour la page */
  }
}

export function pinMode(R: VictoireRefs, photo: PhotoFrame, lenis: () => Lenis | null) {
  const { root, stage } = R;
  root.dataset.mode = "pin";
  const geo = { k: 2 };

  // Une ancre sous la section (#contact…) : on arrive sous la section, donc à l'état final.
  let target: HTMLElement | null = null;
  try {
    target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  } catch {
    target = null;
  }
  const section = root.closest("section") ?? root;
  const below = !!(target && target !== section && !section.contains(target) && section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
  let seen = seenBefore() || below;

  const beam: BeamGeometry = { ww: 0, wh: 0, a: 0, l: 0 };
  const measure = () => {
    geo.k = Math.max(1.6, Math.min(2.6, stage.clientWidth / 620));
    frame(R, photo);
    measureBeam(R, beam);
  };
  measure();
  ScrollTrigger.addEventListener("refreshInit", measure);

  const clock = { s: H54 };
  let tLive = 1e9;
  let trigger: ScrollTrigger | null = null;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    paused: true,
    onUpdate: () => {
      setClock([R.digits.clock], clock.s);
      root.toggleAttribute("data-live", tl.time() > tLive);
    },
  });
  const blurIn = (els: HTMLElement[], at: number, stagger = 0.05, duration = 0.4) =>
    tl.fromTo(els, { opacity: 0, y: 20, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration, stagger, ease: "power2.out" }, at);

  // 0. Pendant que la section arrive : le titre, le drapeau, la date, le compteur (rien de tout ça une fois vue).
  const prep = seen
    ? null
    : gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root, start: "top 85%", end: "top 8%", scrub: 0.8 } })
        .fromTo(R.titleWords, { opacity: 0, y: 26, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0)
        .fromTo(R.date, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.35)
        .fromTo(R.digits.clock, { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" }, 0.3)
        .fromTo(R.seps, { opacity: 0 }, { opacity: 0.5, duration: 0.3 }, 0.45);

  // 1. Le mur de post-it : des dizaines d'idées, des équipes, le projecteur s'arrête sur le nôtre.
  const e1 = seqWall(tl, R, 0, 1, () => beam);
  tl.fromTo(clock, { s: H54 }, { s: H30, duration: e1 + 0.1 }, 0);

  // 2. Mon rôle (le post-it or s'efface, la bulle naît à sa place).
  const t2 = e1 + 0.1;
  tl.to(R.cols.slice(0, 1), { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, t2)
    .to([...R.others, ...R.avatars, R.beam], { opacity: 0, duration: 0.22 }, t2)
    .to(R.ours, { scale: 2.2, opacity: 0, duration: 0.2, ease: "power2.in" }, t2)
    .to(R.wall, { opacity: 0, duration: 0.01 }, t2 + 0.4);
  const e2 = seqRole(tl, R, t2 + 0.12, 0.9, (h) => {
    if (R.n24.firstChild) R.n24.firstChild.nodeValue = String(h);
  });
  tl.to(clock, { s: H14, duration: e2 - t2 }, t2);

  // 3. Dimanche : on traverse le couloir d'arches pendant que le compteur file vers 00:00:00.
  const t3 = e2 - 0.2;
  tl.to([...R.cols.slice(1, 2), R.k24], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, t3).to(
    R.scene,
    { opacity: 0, scale: 0.96, duration: 0.25, ease: "power2.in" },
    t3,
  );
  blurIn(R.dayWords, t3 + 0.12);
  const corridorDuration = 1.45;
  tl.to(clock, { s: 0, duration: corridorDuration, ease: "power2.in" }, t3 + 0.05);
  const tZ = seqCorridor(tl, R, t3 + 0.05, corridorDuration, () => geo.k);
  // 00:00:00 : la photo des bras levés prend la scène, la couronne, le « 1re » or, le podium, puis le texte.
  tl.to(R.dayWords, { opacity: 0, y: -12, duration: 0.16, ease: "power2.in" }, tZ);
  seqTriumph(tl, R, tZ, 1);
  tl.to(R.clock, { opacity: 0, duration: 0.25 }, tZ + 0.6);
  seqFirst(tl, R, tZ + 0.72, 1);
  seqPodium(tl, R, tZ + 0.95, 1);
  seqPrints(tl, R, tZ + 1.75, 1);
  blurIn(R.liveWords, tZ + 2.05, 0.06);
  tl.fromTo(R.acts, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, tZ + 2.3);
  tLive = tZ + 2.35;
  tl.to({}, { duration: 0.45 }, tZ + 2.65);

  // L'état final, figé : la timeline au bout (callbacks compris), le compteur à zéro, les boutons actifs.
  let guard = false;
  const freeze = () => {
    tl.eventCallback("onUpdate", () => {
      if (guard || tl.progress() >= 1) return;
      guard = true;
      tl.progress(1);
      guard = false;
    });
    tl.progress(1);
    corridor(R, 1);
    clock.s = 0;
    setClock([R.digits.clock], 0);
    root.setAttribute("data-vu", "");
    root.setAttribute("data-live", "");
  };

  const scrollToY = (y: number) => {
    const instance = lenis();
    if (instance) instance.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  // Retire l'épinglage et compense la position : rien ne bouge à l'écran.
  const detach = () => {
    if (!trigger) return;
    const y = window.scrollY;
    const length = trigger.end - trigger.start;
    const dy = Math.max(0, Math.min(length, y - trigger.start));
    // revert du seul épinglage (l'espaceur part) ; l'animation est gardée puis remise au bout aussitôt.
    trigger.kill(true, true);
    trigger = null;
    prep?.scrollTrigger?.kill(false, true);
    tl.progress(1);
    corridor(R, 1);
    scrollToY(y - dy);
    ScrollTrigger.refresh();
  };

  // Au repos du défilement (Lenis ne doit pas être en train d'animer), puis on détache.
  let restTimer = 0;
  let listening = false;
  const atRest = () => {
    window.clearTimeout(restTimer);
    const attempt = () => {
      if (document.documentElement.classList.contains("lenis-scrolling")) {
        restTimer = window.setTimeout(attempt, 160);
        return;
      }
      window.removeEventListener("scroll", atRest);
      listening = false;
      detach();
    };
    restTimer = window.setTimeout(attempt, 260);
  };
  const reached = () => {
    if (seen) return;
    seen = true;
    markSeen();
    freeze();
    if (!listening) {
      listening = true;
      window.addEventListener("scroll", atRest, { passive: true });
    }
    atRest();
  };

  if (seen) {
    // Déjà vue (ou arrivée sous la section) : un bloc statique d'un écran, à l'état final.
    freeze();
  } else {
    // L'épinglage : 3 écrans de défilement, la victoire arrive vers 2,3.
    trigger = ScrollTrigger.create({
      animation: tl,
      trigger: root,
      start: "top top",
      end: () => `+=${Math.round(stage.clientHeight * PIN_SCREENS)}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => setClock([R.digits.clock], clock.s),
      onUpdate: (self) => {
        if (self.progress >= 0.98) reached();
      },
      onLeave: reached,
    });
  }

  // Une ancre sur la section (#victoire) : résolue avant que l'épinglage n'ajoute sa longueur ; on la rejoint une fois.
  let onAnchorRefresh: (() => void) | null = null;
  if (!seen && target === section) {
    const since = Date.now();
    const anchor = target;
    onAnchorRefresh = () => {
      if (onAnchorRefresh) ScrollTrigger.removeEventListener("refresh", onAnchorRefresh);
      if (Date.now() - since > 5000) return;
      requestAnimationFrame(() => scrollToY(anchor.getBoundingClientRect().top + window.scrollY));
    };
    ScrollTrigger.addEventListener("refresh", onAnchorRefresh);
  }

  // Rechargement en bas de page, retour arrière : si l'on se retrouve sous la section, l'état final.
  const belowSection = () => {
    if (trigger && window.scrollY >= trigger.end - 2) reached();
  };
  let loadTimer = 0;
  const onLoad = () => {
    loadTimer = window.setTimeout(belowSection, 60);
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) belowSection();
  };
  window.addEventListener("pageshow", onPageShow);

  // Au clavier : un bouton reçoit le focus avant la fin du récit, on va à la fin.
  const focusEnd = () => {
    if (trigger && !root.hasAttribute("data-live")) scrollToY(trigger.end - 2);
  };
  R.acts.addEventListener("focusin", focusEnd);
  const untilt = tilt(R, stage);

  setClock([R.digits.clock], clock.s);
  let fontsReady = true;
  document.fonts?.ready.then(() => {
    if (fontsReady && root.dataset.mode === "pin") ScrollTrigger.refresh();
  });

  return () => {
    fontsReady = false;
    ScrollTrigger.removeEventListener("refreshInit", measure);
    if (onAnchorRefresh) ScrollTrigger.removeEventListener("refresh", onAnchorRefresh);
    R.acts.removeEventListener("focusin", focusEnd);
    window.removeEventListener("scroll", atRest);
    window.removeEventListener("load", onLoad);
    window.removeEventListener("pageshow", onPageShow);
    window.clearTimeout(restTimer);
    window.clearTimeout(loadTimer);
    untilt();
    corridorEnd(R);
    root.removeAttribute("data-mode");
    root.removeAttribute("data-live");
    root.removeAttribute("data-vu");
    setClock([R.digits.clock], H54);
    if (R.n24.firstChild) R.n24.firstChild.nodeValue = "24";
  };
}
