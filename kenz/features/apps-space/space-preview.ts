/**
 * Ce que joue la fiche ouverte (shared/apps.js : galerieJouer, ficheJouer).
 * - Galerie : un éventail de trois vrais écrans App Store ; toutes les 2,6 s, celui de droite passe au centre,
 *   celui de gauche s'efface (mouvement réduit : l'éventail reste fixe). À l'ouverture, les trois montent en place.
 * - Animation (Zenko) : la mini-animation en boucle, puis la vraie capture, qui ressort avant que la scène reparte.
 * Le contrôleur rendu se met en pause hors écran et s'arrête à la fermeture (tout est annulé).
 */
import { gsap } from "@/design-system/motion/gsap";
import { CSS_EASE } from "@/design-system/motion/easings";
import { zenkoTimeline } from "./zenko-timeline";

export interface PreviewController {
  play: () => void;
  pause: () => void;
  kill: () => void;
}

const FIRST_MS = 1900;
const NEXT_MS = 2600;
const RESUME_MS = 1400;

/** Les images de l'éventail apparaissent en fondu une fois chargées. */
function markLoaded(images: HTMLImageElement[]) {
  const offs: (() => void)[] = [];
  images.forEach((img) => {
    const ready = () => img.setAttribute("data-pret", "");
    if (img.complete && img.naturalWidth) {
      ready();
      return;
    }
    img.addEventListener("load", ready, { once: true });
    img.addEventListener("error", ready, { once: true });
    offs.push(() => {
      img.removeEventListener("load", ready);
      img.removeEventListener("error", ready);
    });
  });
  return () => offs.forEach((off) => off());
}

export function playGallery(panel: Element, reduced: boolean): PreviewController {
  const caps = Array.from(panel.querySelectorAll<HTMLElement>("[data-cap]"));
  const dots = Array.from(panel.querySelectorAll<HTMLElement>("[data-pt]"));
  const unload = markLoaded(Array.from(panel.querySelectorAll<HTMLImageElement>("[data-cap] img")));
  const slots = new Map<HTMLElement, number>();
  const count = caps.length;
  const half = Math.floor((count - 1) / 2);
  let current = 0;
  let timer = 0;
  let stopped = false;
  let paused = false;
  const animations: Animation[] = [];

  /** La place de chaque écran : 0 au centre, ±1 de côté, ±2 caché. Un écran qui revient par la droite y est
   *  d'abord posé sans transition (il ne traverse jamais l'éventail). */
  function layout(instant: boolean) {
    const jumped: HTMLElement[] = [];
    caps.forEach((cap, i) => {
      const o = (((i - current) % count) + count) % count;
      const slot = Math.max(-2, Math.min(2, o <= half ? o : o - count));
      const previous = slots.get(cap);
      if (instant || (previous !== undefined && slot - previous > 1)) {
        cap.style.transition = "none";
        cap.setAttribute("data-s", instant ? String(slot) : "2");
        jumped.push(cap);
      }
      slots.set(cap, slot);
    });
    if (jumped.length) {
      void panel.getBoundingClientRect();
      jumped.forEach((cap) => (cap.style.transition = ""));
    }
    caps.forEach((cap) => cap.setAttribute("data-s", String(slots.get(cap))));
    dots.forEach((dot, i) => dot.toggleAttribute("data-on", i === current));
  }

  const arm = (ms: number) => {
    window.clearTimeout(timer);
    if (!stopped && !paused) timer = window.setTimeout(advance, ms);
  };
  function advance() {
    current = (current + 1) % count;
    layout(false);
    arm(NEXT_MS);
  }

  layout(true);
  if (!reduced && count > 1) {
    caps.forEach((cap) => {
      const slot = slots.get(cap) ?? 2;
      const inner = cap.firstElementChild;
      if (Math.abs(slot) > 1 || !inner) return;
      animations.push(
        inner.animate([{ opacity: 0, transform: "translateY(16px) scale(.94)" }, { opacity: 1, transform: "none" }], {
          duration: 620,
          delay: 40 + Math.abs(slot) * 90,
          easing: CSS_EASE.expo,
          fill: "backwards",
        }),
      );
    });
    arm(FIRST_MS);
  }

  return {
    play() {
      if (!paused) return;
      paused = false;
      arm(RESUME_MS);
    },
    pause() {
      paused = true;
      window.clearTimeout(timer);
    },
    kill() {
      stopped = true;
      window.clearTimeout(timer);
      animations.forEach((a) => a.cancel());
      unload();
    },
  };
}

export function playAnimation(panel: Element, reduced: boolean): PreviewController {
  const views = panel.querySelector<HTMLElement>("[data-vues]");
  const capture = panel.querySelector<HTMLElement>("[data-capture]");
  const scene = views?.firstElementChild;
  const idle: PreviewController = { play() {}, pause() {}, kill() {} };
  if (!views || !scene) return idle;

  views.style.opacity = "1";
  views.style.filter = "none";
  if (capture) {
    capture.style.opacity = "0";
    capture.style.filter = "none";
  }
  if (reduced) {
    // Mouvement réduit : la vraie capture, d'emblée.
    if (capture) {
      views.style.opacity = "0";
      capture.style.opacity = "1";
    }
    return idle;
  }

  const sceneTl = zenkoTimeline(scene);
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });
  tl.add(sceneTl, 0.15);
  const end = 0.15 + sceneTl.duration();
  if (capture) {
    // La scène sort, puis la vraie capture entre ; elle ressort entièrement avant que la scène ne reparte.
    tl.to(views, { opacity: 0, filter: "blur(5px)", duration: 0.18, ease: "power2.in" }, end + 0.3)
      .fromTo(
        capture,
        { opacity: 0, filter: "blur(6px)" },
        { opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out", immediateRender: false },
        end + 0.5,
      )
      .to(capture, { opacity: 0, filter: "blur(6px)", duration: 0.24, ease: "power2.in" }, end + 2.3);
  } else {
    tl.to({}, { duration: 1.6 }, end);
  }

  return {
    play: () => tl.play(),
    pause: () => tl.pause(),
    kill: () => {
      tl.kill();
      sceneTl.kill();
    },
  };
}
