/**
 * Le moteur de la profondeur (shared/profondeur.js, poser) : quels objets montrer, quand, et comment ils bougent.
 * - Choix : dans l'ordre de la liste, les objets chargés qui ne gênent rien (6 au plus sur ordinateur, 3 sur
 *   mobile). Jamais sur le visage (fractions du portrait), ni sur le titre, la phrase ou le lien : l'emprise
 *   de l'objet, sa marge de mouvement (souris, flottaison) et son trajet au défilement sont vérifiés à chaque
 *   mise en page ; un objet qui gênerait n'est pas montré. Un fichier absent : l'objet est retiré, sans bruit.
 * - Entrée : 1,05 s après celle du hero, du fond vers l'avant (on attend 3,2 s au plus les images lentes).
 * - Mouvement : défilement (chaque plan à sa vitesse, puis l'effacement), souris (ordinateur), flottaison (CSS).
 *   Mouvement réduit : objets fixes, un simple fondu.
 * Tout ce qu'il pose (attributs, minuteurs, écouteurs, ScrollTrigger) est retiré par la fonction rendue.
 */
import { gsap } from "@/design-system/motion/gsap";
import { FOOTPRINT, PLANS, type PlacedObject } from "./profondeur-planes";

const DELAY_S = 1.05;
const WAIT_MS = 3200;
const FALLBACK_MS = 4800;
const MARGIN = 10;

interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

interface DepthEngineOptions {
  /** Les objets placés dans le mode en cours, dans l'ordre de la liste (même ordre que les éléments). */
  placed: readonly PlacedObject[];
  desktop: boolean;
  reduced: boolean;
  /** La souris peut piloter la parallaxe (ordinateur, pointeur fin). */
  mouse: boolean;
  /** Le hero est arrivé. */
  ready: boolean;
  /** Déjà révélé lors d'une mise en place précédente (changement de mode). */
  revealed: boolean;
  onReveal: () => void;
  fade: readonly [number, number];
  /** Le portrait, et la place du visage dans le portrait [x0, y0, x1, y1] (fractions). */
  figSelector: string;
  face: readonly [number, number, number, number];
  /** Ce qu'aucun objet ne doit couvrir (titre, phrase, lien). */
  avoidSelector: string;
}

type Status = "wait" | "ok" | "absent";

/** La place d'un élément au repos : sa boîte, moins les glissements verticaux posés sur lui et ses parents. */
function rest(el: Element): Box {
  const box = el.getBoundingClientRect();
  let dy = 0;
  for (let node: Element | null = el; node && node !== document.documentElement; node = node.parentElement) {
    const transform = getComputedStyle(node).transform;
    if (transform && transform !== "none") dy += new DOMMatrixReadOnly(transform).m42;
  }
  return { l: box.left, t: box.top - dy, r: box.right, b: box.bottom - dy };
}

const overlaps = (a: Box, b: Box) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

export function startDepth(container: HTMLElement, options: DepthEngineOptions): () => void {
  const { placed, desktop, reduced, mouse, fade } = options;
  const hero = container.closest("section") ?? container.parentElement ?? container;
  const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-depth-item]"));
  const items = placed.map((p, i) => {
    const el = elements[i];
    const img = el?.querySelector("img") ?? null;
    return { p, el, img, status: "wait" as Status, visible: false, tl: null as gsap.core.Timeline | null };
  });
  const timers: number[] = [];
  const cleanups: (() => void)[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
  let dead = false;
  let revealed = options.revealed;
  let delayDone = false;
  let t0 = 0;

  /* ---------- Le choix ---------- */
  function measure() {
    const c = rest(container);
    const zones: Box[] = [];
    const fig = hero.querySelector(options.figSelector);
    if (fig) {
      const f = rest(fig);
      const w = f.r - f.l;
      const h = f.b - f.t;
      const [x0, y0, x1, y1] = options.face;
      if (w && h) zones.push({ l: f.l + x0 * w, t: f.t + y0 * h, r: f.l + x1 * w, b: f.t + y1 * h });
    }
    hero.querySelectorAll(options.avoidSelector).forEach((el) => {
      const z = rest(el);
      if (z.r > z.l && z.b > z.t) zones.push(z);
    });
    return { c, zones, h: hero.getBoundingClientRect().height || window.innerHeight };
  }

  function blocks(p: PlacedObject, g: ReturnType<typeof measure>): boolean {
    const plan = PLANS[p.plan];
    const angle = (Math.abs(p.rot) * Math.PI) / 180;
    const we = p.width * FOOTPRINT[p.object.type];
    const he = p.width * p.ratio * FOOTPRINT[p.object.type];
    const bw = we * Math.cos(angle) + he * Math.sin(angle);
    const bh = we * Math.sin(angle) + he * Math.cos(angle);
    const cx = g.c.l + (p.x / 100) * (g.c.r - g.c.l);
    const cy = g.c.t + (p.y / 100) * (g.c.b - g.c.t);
    const m = MARGIN + plan.flotte + (mouse ? Math.abs(plan.souris) : 0);
    const box: Box = { l: cx - bw / 2 - m, r: cx + bw / 2 + m, t: cy - bh / 2 - m, b: cy + bh / 2 + m };
    if (!reduced) {
      // Le trajet au défilement, tant que l'objet est visible.
      const travel = plan.vitesse * g.h * fade[1];
      if (travel < 0) box.t += travel;
      else box.b += travel;
    }
    return g.zones.some((z) => overlaps(box, z));
  }

  function choose() {
    if (dead) return;
    const g = measure();
    const max = desktop ? 6 : 3;
    let count = 0;
    const shown: typeof items = [];
    items.forEach((item) => {
      const ok = item.status === "ok" && count < max && !blocks(item.p, g);
      item.visible = ok;
      item.el?.toggleAttribute("data-vis", ok);
      if (ok) {
        count += 1;
        shown.push(item);
      }
    });
    // L'entrée : du fond vers l'avant.
    shown
      .slice()
      .sort((a, b) => PLANS[a.p.plan].rang - PLANS[b.p.plan].rang || a.p.index - b.p.index)
      .forEach((item, k) => item.el?.style.setProperty("--ed", `${(k * 0.14).toFixed(2)}s`));
    if (revealed && count) {
      startMotion();
      if (!container.hasAttribute("data-in")) {
        const frame = requestAnimationFrame(() => {
          if (!dead) container.setAttribute("data-in", "");
        });
        cleanups.push(() => cancelAnimationFrame(frame));
      }
    }
  }

  /* ---------- Les images : chargées, ou absentes ---------- */
  function settle() {
    if (revealed) choose();
    else tryReveal();
  }
  items.forEach((item) => {
    const img = item.img;
    if (!img || !item.el) {
      item.status = "absent";
      return;
    }
    const onLoad = () => {
      item.status = "ok";
      settle();
    };
    const onError = () => {
      item.status = "absent";
      item.el?.setAttribute("data-absent", "");
      settle();
    };
    if (img.complete && img.naturalWidth) item.status = "ok";
    else if (img.complete && img.currentSrc) onError();
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    cleanups.push(() => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    });
  });

  /* ---------- La révélation ---------- */
  function reveal() {
    if (revealed || dead) return;
    revealed = true;
    options.onReveal();
    choose();
  }
  function tryReveal() {
    if (revealed || dead || !delayDone) return;
    const waiting = items.some((item) => item.status === "wait");
    if (waiting && Date.now() - t0 < WAIT_MS) return;
    reveal();
  }
  function startCountdown() {
    later(() => {
      delayDone = true;
      t0 = Date.now();
      tryReveal();
      later(reveal, WAIT_MS + 50);
    }, DELAY_S * 1000);
  }
  if (revealed) choose();
  else if (options.ready) startCountdown();
  else later(startCountdown, FALLBACK_MS - DELAY_S * 1000);

  /* ---------- Le défilement : chaque plan à sa vitesse, puis l'effacement au départ du hero ---------- */
  function startMotion() {
    container.toggleAttribute("data-fixe", reduced);
    if (reduced) return;
    setMouse(mouse);
    const [e0, e1] = fade;
    const end = Math.max(e0 + 0.01, e1);
    items.forEach((item) => {
      if (!item.visible || item.tl || !item.el) return;
      const v = PLANS[item.p.plan].vitesse * (1 + ((item.p.index % 3) - 1) * 0.12);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.fromTo(item.el, { y: 0 }, { y: () => v * (hero.getBoundingClientRect().height || window.innerHeight), duration: 1, ease: "none" }, 0);
      tl.fromTo(item.el, { opacity: 1 }, { opacity: 0, duration: end - e0, ease: "none", immediateRender: false }, e0);
      item.tl = tl;
    });
  }

  /* ---------- La souris : faible amplitude, lissée, seulement quand le hero est à l'écran ---------- */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let raf = 0;
  let mouseOn = false;
  let onScreen = true;
  function step() {
    raf = 0;
    current.x += (target.x - current.x) * 0.07;
    current.y += (target.y - current.y) * 0.07;
    container.style.setProperty("--mx", current.x.toFixed(4));
    container.style.setProperty("--my", current.y.toFixed(4));
    if (Math.abs(target.x - current.x) > 0.0008 || Math.abs(target.y - current.y) > 0.0008) raf = requestAnimationFrame(step);
  }
  const relaunch = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };
  function onMove(event: PointerEvent) {
    if (!onScreen || event.pointerType === "touch") return;
    target.x = Math.max(-1, Math.min(1, (event.clientX / (window.innerWidth || 1)) * 2 - 1));
    target.y = Math.max(-1, Math.min(1, (event.clientY / (window.innerHeight || 1)) * 2 - 1));
    relaunch();
  }
  function rest0() {
    target.x = 0;
    target.y = 0;
    relaunch();
  }
  function setMouse(on: boolean) {
    if (on === mouseOn) return;
    mouseOn = on;
    if (on) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", rest0);
    } else {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", rest0);
    }
  }
  const io = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
    if (!onScreen) rest0();
  });
  io.observe(hero);

  /* ---------- Mise en page : remesurer (redimensionnement, polices) ---------- */
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (revealed) choose();
    }, 160);
  };
  window.addEventListener("resize", onResize);
  void document.fonts?.ready.then(() => {
    if (revealed) choose();
  });

  return () => {
    dead = true;
    timers.forEach(window.clearTimeout);
    window.clearTimeout(resizeTimer);
    cleanups.forEach((fn) => fn());
    window.removeEventListener("resize", onResize);
    io.disconnect();
    setMouse(false);
    if (raf) cancelAnimationFrame(raf);
    items.forEach((item) => {
      if (item.tl) {
        item.tl.scrollTrigger?.kill();
        item.tl.kill();
      }
      if (item.el) gsap.set(item.el, { clearProps: "transform,opacity" });
    });
    // data-in et data-vis restent : une nouvelle mise en place (changement de mode) les repose sans refondu.
  };
}
