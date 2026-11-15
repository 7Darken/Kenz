"use client";

/**
 * Le cordon (port de maquettes/v6/shared/cordon.js) : le point de « Kenz· », côté Créateur, qu'on tire vers le bas.
 * Rien ne le trahit au repos.
 * - On l'attrape et on le tire : une chaîne à billes sort de son œillet, le point suit à 0,6 × le doigt.
 * - À 110 px de traction, un cran : le point saute de 5 px, la chaîne s'éclaire, le téléphone vibre.
 * - Relâché après le cran : le point remonte d'un coup sec, puis le décollage vers l'univers Pro.
 *   Relâché avant : il remonte, rien ne se passe. Un simple clic garde le lien du logo.
 * - Au clavier : Alt + Flèche bas, le logo ayant le focus (le point lui-même n'est pas focalisable : il est dans
 *   le lien du logo, et un contrôle ne s'imbrique pas dans un lien).
 * Mouvement réduit : pas de trajet, le décollage en fondu.
 */
import { useEffect, useRef } from "react";

import { ROUTES } from "@/content/site";
import { isPassageBusy, prefersReducedMotion, prefetchRoute, setGesture, silenceNextClick } from "./passage-state";
import { startLiftoff } from "./portal";
import styles from "./cordon.module.css";
import { createTrack, round2 } from "./track";

const FOLLOW = 0.6; // le point suit à 0,6 × le déplacement du doigt
const NOTCH = 110; // px de traction pour le cran
const UNNOTCH = 94; // en remontant sous ce seuil, le cran se défait
const START = 5; // px vers le bas avant que le geste ne commence (sinon : un clic)
const CLICK = 5; // le point saute de 5 px au cran
const BEYOND = 0.16; // au-delà du cran, la résistance augmente
const STOP = 28; // et le point ne descend plus que de 28 px

interface Fil {
  el: HTMLDivElement;
  point: HTMLElement;
  eyelet: HTMLElement;
  paths: SVGPathElement[];
  x: number;
  y: number;
  notched: boolean;
  frame: number;
  warm: boolean;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Le fil, posé dans <body> au centre du point (la nav peut créer un contexte qui fausserait position: fixed). */
function createFil(dot: HTMLElement): Fil {
  const r = dot.getBoundingClientRect();
  const w = round2(r.width || 7);
  const h = round2(r.height || 7);
  const el = document.createElement("div");
  el.className = styles.fil;
  el.setAttribute("aria-hidden", "true");
  el.style.left = `${round2(r.left + r.width / 2)}px`;
  el.style.top = `${round2(r.top + r.height / 2)}px`;
  const eyelet = document.createElement("i");
  eyelet.className = styles.eyelet;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", styles.svg);
  svg.setAttribute("viewBox", "-60 -20 120 300");
  svg.setAttribute("focusable", "false");
  const paths = [styles.shine, styles.chain].map((className) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("class", className);
    path.setAttribute("d", "M0 0");
    svg.append(path);
    return path;
  });
  const point = document.createElement("i");
  point.className = styles.point;
  Object.assign(point.style, {
    width: `${w}px`,
    height: `${h}px`,
    margin: `${round2(-h / 2)}px 0 0 ${round2(-w / 2)}px`,
    background: getComputedStyle(dot).backgroundColor,
  });
  el.append(eyelet, svg, point);
  document.body.append(el);
  return { el, point, eyelet, paths, x: 0, y: 0, notched: false, frame: 0, warm: false };
}

function paint(fil: Fil) {
  fil.point.style.transform = `translate3d(${round2(fil.x)}px,${round2(fil.y)}px,0)`;
  // La chaîne part du point : les billes suivent le point et sortent de l'œillet.
  const d = `M${round2(fil.x)} ${round2(fil.y)}L0 0`;
  fil.paths.forEach((path) => path.setAttribute("d", d));
  fil.eyelet.style.opacity = String(round2(Math.min(1, fil.y / 16)));
}

export function Cordon() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const html = document.documentElement;
    const link = dot.closest("a");
    const track = createTrack();
    let fil: Fil | null = null;
    let pointer: { id: number; x0: number; y0: number; active: boolean } | null = null;

    const draw = (f: Fil) => {
      if (!f.frame) {
        f.frame = requestAnimationFrame(() => {
          f.frame = 0;
          paint(f);
        });
      }
    };

    const open = () => {
      const f = createFil(dot);
      fil = f;
      dot.classList.add(styles.pulled);
      html.classList.add(styles.pulling);
      setGesture(true);
      return f;
    };

    const close = (f: Fil) => {
      cancelAnimationFrame(f.frame);
      f.el.remove();
      dot.classList.remove(styles.pulled);
      html.classList.remove(styles.pulling);
      if (fil === f) {
        fil = null;
        setGesture(false);
      }
    };

    // Au cran, on prépare l'autre univers.
    const notch = (f: Fil, on: boolean) => {
      if (f.notched === on) return;
      f.notched = on;
      f.el.classList.toggle(styles.notched, on);
      if (!on) return;
      navigator.vibrate?.(12);
      if (!f.warm) {
        f.warm = true;
        prefetchRoute(ROUTES.home);
      }
    };

    const follow = (f: Fil, dx: number, dy: number) => {
      const t = Math.max(0, dy);
      if (!f.notched && t >= NOTCH) notch(f, true);
      else if (f.notched && t < UNNOTCH) notch(f, false);
      const y = t <= NOTCH ? t * FOLLOW : NOTCH * FOLLOW + Math.min(STOP, (t - NOTCH) * BEYOND);
      f.x = Math.max(-12, Math.min(12, dx * 0.12));
      f.y = y + (f.notched ? CLICK : 0);
      draw(f);
    };

    // Relâché avant le cran : le point remonte, rien ne se passe.
    const relax = (f: Fil) => {
      notch(f, false);
      const { x: x0, y: y0 } = f;
      track.tween(prefersReducedMotion() ? 0 : 0.42, "expo.out", (k) => {
        f.x = x0 * (1 - k);
        f.y = y0 * (1 - k);
        paint(f);
      }, { onComplete: () => close(f) });
    };

    // Relâché après le cran : le point remonte d'un coup sec, et le mécanisme s'enclenche.
    const engage = (f: Fil) => {
      const { x: x0, y: y0 } = f;
      track.tween(prefersReducedMotion() ? 0 : 0.17, "power2.in", (k) => {
        f.x = x0 * (1 - k);
        f.y = y0 * (1 - k);
        paint(f);
      }, {
        onComplete: () => {
          close(f);
          dot.classList.add(styles.engaged);
          track.after(0.05, () => dot.classList.remove(styles.engaged));
          startLiftoff();
        },
      });
    };

    // Le même passage sans geste (clavier) : le fil descend seul jusqu'au cran, puis on relâche.
    const pullAlone = () => {
      if (isPassageBusy() || fil || pointer) return;
      const f = open();
      if (prefersReducedMotion()) {
        notch(f, true);
        engage(f);
        return;
      }
      const end = NOTCH * FOLLOW;
      track.tween(0.42, "power1.inOut", (k) => {
        f.y = end * k;
        paint(f);
      }, {
        onComplete: () => {
          notch(f, true);
          f.y = end + CLICK;
          paint(f);
          track.after(0.2, () => engage(f));
        },
      });
    };

    const onDown = (event: PointerEvent) => {
      if (isPassageBusy() || fil || pointer) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      pointer = { id: event.pointerId, x0: event.clientX, y0: event.clientY, active: false };
      dot.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x0;
      const dy = event.clientY - pointer.y0;
      if (!pointer.active) {
        if (dy < START) {
          if (Math.abs(dx) > 16 || dy < -12) abandon();
          return;
        }
        pointer.active = true;
        open();
      }
      if (event.cancelable) event.preventDefault();
      if (fil) follow(fil, dx, dy);
    };

    const abandon = () => {
      if (!pointer) return;
      const { id } = pointer;
      pointer = null;
      if (dot.hasPointerCapture(id)) dot.releasePointerCapture(id);
    };

    const release = (event: PointerEvent, cancelled: boolean) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const { active } = pointer;
      pointer = null;
      if (!active || !fil) return; // un simple clic : le lien du logo garde son comportement
      silenceNextClick(); // le clic qui suit le geste ne suit pas le lien
      if (fil.notched && !cancelled) engage(fil);
      else relax(fil);
    };
    const onUp = (event: PointerEvent) => release(event, false);
    const onCancel = (event: PointerEvent) => release(event, true);

    // Alt + Flèche bas, le logo ayant le focus.
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.key !== "ArrowDown") return;
      event.preventDefault();
      pullAlone();
    };
    const keyTarget = link ?? dot;

    // Pendant le geste : ni glisser-déposer du lien, ni menu contextuel.
    const onDrag = (event: Event) => {
      if (pointer || event.target === dot) event.preventDefault();
    };
    const onContextMenu = (event: Event) => {
      if (pointer?.active) event.preventDefault();
    };

    dot.addEventListener("pointerdown", onDown);
    dot.addEventListener("pointermove", onMove, { passive: false });
    dot.addEventListener("pointerup", onUp);
    dot.addEventListener("pointercancel", onCancel);
    dot.addEventListener("lostpointercapture", onCancel);
    dot.addEventListener("contextmenu", onContextMenu);
    keyTarget.addEventListener("keydown", onKey);
    keyTarget.addEventListener("dragstart", onDrag);

    return () => {
      dot.removeEventListener("pointerdown", onDown);
      dot.removeEventListener("pointermove", onMove);
      dot.removeEventListener("pointerup", onUp);
      dot.removeEventListener("pointercancel", onCancel);
      dot.removeEventListener("lostpointercapture", onCancel);
      dot.removeEventListener("contextmenu", onContextMenu);
      keyTarget.removeEventListener("keydown", onKey);
      keyTarget.removeEventListener("dragstart", onDrag);
      track.kill();
      if (fil) close(fil);
    };
  }, []);

  return <span ref={dotRef} className={styles.dot} data-cordon="" aria-hidden="true" />;
}
