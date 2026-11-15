"use client";

/**
 * La loupe, montée une fois par univers : toute image ou capture marquée `data-loupe` devient agrandissable
 * à la souris (×1,1 ; `data-loupe="1.15"` change l'échelle, `data-loupe-taille="200"` le diamètre en px).
 * Une seule lentille pour la page, branchée par délégation : rien à faire dans les modules.
 * Souris seulement (jamais au toucher), jamais en mouvement réduit. Portage fidèle de shared/theme.js §6.
 */
import { useEffect, useRef } from "react";

import styles from "./loupe.module.css";

const f1 = (v: number) => Math.round(v * 10) / 10;
const IGNORED = ".nav, a, button, input, textarea, select, label";

/** Rotation et échelle cumulées des ancêtres (un tirage penché reste aligné dans la lentille). */
function pose(el: Element) {
  let angle = 0;
  let scale = 1;
  let node: Element | null = el;
  for (let n = 0; node && node !== document.body && n < 8; n++, node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.transform && cs.transform !== "none") {
      const m = new DOMMatrixReadOnly(cs.transform);
      angle += Math.atan2(m.b, m.a);
      scale *= Math.hypot(m.a, m.b) || 1;
    }
    if (cs.rotate && cs.rotate !== "none") {
      const deg = Number.parseFloat(cs.rotate.replace(/^[a-z\s]+/i, ""));
      if (!Number.isNaN(deg)) angle += (deg * Math.PI) / 180;
    }
    if (cs.scale && cs.scale !== "none") {
      const s = Number.parseFloat(cs.scale);
      if (!Number.isNaN(s) && s > 0) scale *= s;
    }
  }
  return { angle, scale };
}

/** Visible et assez opaque (un calque qui s'efface ne déclenche rien). */
function isVisible(el: Element) {
  let opacity = 1;
  let node: Element | null = el;
  for (let n = 0; node && node !== document.body && n < 8; n++, node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.visibility === "hidden" || cs.display === "none") return false;
    opacity *= Number.parseFloat(cs.opacity);
  }
  return opacity > 0.55;
}

interface Active {
  host: HTMLElement;
  node: HTMLElement;
  scale: number;
  w: number;
  h: number;
  angle: number;
  k: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  radius: number;
  frames: number;
}

export function Loupe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!root || !body || !inner) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const html = document.documentElement;

    let active: Active | null = null;
    let raf = 0;
    let probeRaf = 0;
    let sx = -1;
    let sy = -1;
    let hosts: HTMLElement[] = [];
    let hostsAt = 0;

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!active) return;
      html.classList.remove("kz-loupe-curseur");
      active = null;
      root.removeAttribute("data-on");
    };

    const draw = () => {
      raf = 0;
      const a = active;
      if (!a) return;
      const r = a.host.getBoundingClientRect();
      const outside = a.tx < r.left || a.tx > r.right || a.ty < r.top || a.ty > r.bottom || !r.width;
      if (outside || (++a.frames % 12 === 0 && !isVisible(a.host))) {
        stop();
        requestProbe();
        return;
      }
      a.x += (a.tx - a.x) * 0.24;
      a.y += (a.ty - a.y) * 0.24;
      body.style.transform = `translate3d(${f1(a.x - a.radius)}px,${f1(a.y - a.radius)}px,0)`;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const qx = a.radius - a.scale * (a.x - cx);
      const qy = a.radius - a.scale * (a.y - cy);
      a.node.style.transform = `translate(${f1(qx - a.w / 2)}px,${f1(qy - a.h / 2)}px) rotate(${a.angle.toFixed(4)}rad) scale(${(a.scale * a.k).toFixed(4)})`;
      if (Math.abs(a.tx - a.x) > 0.3 || Math.abs(a.ty - a.y) > 0.3) raf = requestAnimationFrame(draw);
    };

    const start = (host: HTMLElement, x: number, y: number) => {
      stop();
      const scaleAttr = Number.parseFloat(host.dataset.loupe ?? "");
      const sizeAttr = Number.parseFloat(host.dataset.loupeTaille ?? "");
      const node = host.cloneNode(true) as HTMLElement;
      node.removeAttribute("id");
      node.removeAttribute("data-loupe");
      node.querySelectorAll("[id]").forEach((child) => child.removeAttribute("id"));
      node.querySelectorAll("[data-loupe]").forEach((child) => child.removeAttribute("data-loupe"));
      const images = node instanceof HTMLImageElement ? [node] : Array.from(node.querySelectorAll("img"));
      images.forEach((img) => {
        img.alt = "";
        img.loading = "eager";
        img.removeAttribute("fetchpriority");
      });
      node.classList.add(styles.clone);
      node.setAttribute("aria-hidden", "true");
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
      inner.replaceChildren(node);
      if (sizeAttr > 60) body.style.setProperty("--lt", `${sizeAttr}px`);
      else body.style.removeProperty("--lt");
      const { angle, scale: k } = pose(host);
      const hidesCursor = !host.matches("a, button, [role='button']") && !host.querySelector("a, button, input, textarea, select");
      active = {
        host,
        node,
        scale: scaleAttr > 1 && scaleAttr < 2 ? scaleAttr : 1.1,
        w,
        h,
        angle,
        k,
        tx: x,
        ty: y,
        x,
        y,
        radius: (body.offsetWidth || 168) / 2,
        frames: 0,
      };
      if (hidesCursor) html.classList.add("kz-loupe-curseur");
      root.setAttribute("data-on", "");
      draw();
    };

    // On cherche l'hôte sous la souris par ses dimensions : un calque épinglé (pointer-events: none) n'empêche rien.
    const probe = () => {
      probeRaf = 0;
      if (sx < 0 || active || reduced.matches || !mouse.matches) return;
      const over = document.elementFromPoint(sx, sy);
      if (over?.closest(IGNORED)) return;
      const now = Date.now();
      if (now - hostsAt > 700) {
        hosts = Array.from(document.querySelectorAll<HTMLElement>("[data-loupe]"));
        hostsAt = now;
      }
      for (let i = hosts.length - 1; i >= 0; i--) {
        const r = hosts[i].getBoundingClientRect();
        if (r.width > 40 && sx >= r.left && sx <= r.right && sy >= r.top && sy <= r.bottom && isVisible(hosts[i])) {
          start(hosts[i], sx, sy);
          return;
        }
      }
    };
    function requestProbe() {
      if (!probeRaf) probeRaf = requestAnimationFrame(probe);
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      sx = event.clientX;
      sy = event.clientY;
      if (active) {
        active.tx = sx;
        active.ty = sy;
        if (!raf) raf = requestAnimationFrame(draw);
      } else requestProbe();
    };
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        sx = -1;
        stop();
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        sx = -1;
        stop();
      }
    };
    const onScroll = () => {
      if (active) {
        if (!raf) raf = requestAnimationFrame(draw);
      } else if (sx >= 0) requestProbe();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      cancelAnimationFrame(probeRaf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.loupe} aria-hidden="true">
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.disc}>
          <div ref={innerRef} className={styles.inner} />
          <i className={styles.tint} />
        </div>
        <i className={styles.ring} />
      </div>
    </div>
  );
}
