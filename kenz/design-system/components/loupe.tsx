"use client";

/**
 * La loupe : une lentille de verre teinté qui suit la souris et grossit ce qu'elle survole (shared/theme.js §6).
 * Une seule lentille pour la page, montée une fois par l'univers (`UniverseShell`) dans un portail sur <body>, et
 * branchée par délégation : un module n'a qu'à poser des attributs.
 *
 * API (attributs HTML) :
 * - `data-loupe` sur l'hôte, l'élément dont le survol fait venir la lentille :
 *   - une image (<img>, donc next/image) : la lentille peint la même image (`currentSrc`), cadrée comme à l'écran
 *     (`object-fit`, `object-position`, coins arrondis) ;
 *   - tout autre élément : un clone figé, qui emporte ses styles calculés (fidèle hors de son contexte CSS).
 * - `data-loupe-zoom="1.15"` : le grossissement (×1,1 par défaut).
 * - `data-loupe-size="200"` : le diamètre de la lentille en px (168 par défaut).
 * - `data-loupe-source` sur un descendant de l'hôte : c'est lui qu'on clone et qu'on suit à chaque image (ex. la page
 *   qui défile dans une fenêtre de navigateur) ; l'hôte reste la zone de survol.
 *
 * Géométrie : tout se mesure dans le repère de la fenêtre (getBoundingClientRect). Un plateau grossit ce repère autour
 * du centre de la lentille ; on y pose l'élément à sa place réelle, découpé comme dans la page par son plus proche
 * ancêtre qui le rogne. Le point sous le centre de la lentille est donc exactement celui qu'elle grossit.
 * Souris seulement (`hover: hover` et `pointer: fine`), jamais en mouvement réduit : sinon rien n'est monté.
 * Ni le défilement ni les clics ne sont touchés : calque `pointer-events: none`, écouteurs passifs.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import styles from "./loupe.module.css";

const HOST = "[data-loupe]";
const SOURCE = "[data-loupe-source]";
/** Un contrôle au-dessus de l'hôte (le pavé « lecture », une pastille de lien) garde la main : pas de lentille. */
const CONTROLS = "a, button, input, select, textarea, label, summary, [role='button'], [role='link']";
const CURSOR_CLASS = "kz-loupe-curseur";
const ZOOM = 1.1;
/** La lentille rattrape la souris d'un quart du chemin à chaque image. */
const EASE = 0.24;
const MIN_HOST = 40;
/** Un calque qui s'efface (opacité cumulée sous ce seuil) ne garde pas la lentille. */
const MIN_OPACITY = 0.55;
/** Ce que le clone ne recopie pas : le mouvement propre de l'élément et ce qui ne se voit pas. */
const NOT_COPIED = /^(?:transition|animation|will-change|pointer-events|cursor|user-select|touch-action)/;
const ROTATE_Z = /^(?:z |0 0 1 )?(-?[\d.]+)deg$/;
const PX = /(-?[\d.]+)px/g;

const px = (v: number) => `${Math.round(v * 100) / 100}px`;
const CORNERS = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"] as const;

/** Les coins de `from` sur `to`, leurs longueurs multipliées par `scale` (un cadre mesuré à l'écran). */
function copyCorners(from: CSSStyleDeclaration, to: CSSStyleDeclaration, scale = 1) {
  CORNERS.forEach((corner) => {
    to[corner] = from[corner].replace(PX, (_, n: string) => px(Number(n) * scale));
  });
}

/** La rotation cumulée de l'élément et de ses ancêtres : un tirage penché reste aligné dans la lentille. */
function rotationOf(el: Element) {
  let angle = 0;
  for (let node: Element | null = el; node && node !== document.documentElement; node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.transform !== "none") {
      const m = new DOMMatrixReadOnly(cs.transform);
      angle += Math.atan2(m.b, m.a);
    }
    const rotate = ROTATE_Z.exec(cs.rotate);
    if (rotate) angle += (Number(rotate[1]) * Math.PI) / 180;
  }
  return angle;
}

/** Affiché et assez opaque. */
function isShown(el: Element) {
  if (getComputedStyle(el).visibility === "hidden") return false;
  let opacity = 1;
  for (let node: Element | null = el; node && node !== document.documentElement; node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.display === "none") return false;
    opacity *= Number.parseFloat(cs.opacity);
    if (opacity < MIN_OPACITY) return false;
  }
  return true;
}

/** Sous la souris, autre chose que l'hôte reçoit le geste : un contrôle, ou un calque fixe (la nav). */
function isCovered(hit: Element | null, host: HTMLElement) {
  if (!hit || hit === host) return false;
  const control = hit.closest(CONTROLS);
  if (control && (host.contains(control) || !host.contains(hit))) return true;
  if (host.contains(hit)) return false;
  for (let node: Element | null = hit; node && !node.contains(host); node = node.parentElement) {
    if (getComputedStyle(node).position === "fixed") return true;
  }
  return false;
}

/** L'ancêtre qui rogne l'élément dans la page (débordement caché ou clip-path) : la lentille le rogne pareil. */
function clipperOf(el: HTMLElement) {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.clipPath !== "none") return node;
  }
  return null;
}

/** La taille de l'image dans sa boîte selon `object-fit` (même calcul que le navigateur). */
function fittedSize(fit: string, natW: number, natH: number, boxW: number, boxH: number): [number, number] {
  if (!natW || !natH || fit === "fill") return [boxW, boxH];
  const contain = Math.min(boxW / natW, boxH / natH);
  const scale = fit === "cover" ? Math.max(boxW / natW, boxH / natH) : fit === "contain" ? contain : fit === "none" ? 1 : Math.min(1, contain);
  return [natW * scale, natH * scale];
}

/** La même image que l'hôte, peinte en fond d'une plaque de sa taille : même source, même cadrage, mêmes coins. */
function imagePlate(img: HTMLImageElement) {
  const cs = getComputedStyle(img);
  const [top, right, bottom, left] = (["Top", "Right", "Bottom", "Left"] as const).map(
    (side) => Number.parseFloat(cs[`border${side}Width`]) + Number.parseFloat(cs[`padding${side}`]),
  );
  const [bgW, bgH] = fittedSize(
    cs.objectFit,
    img.naturalWidth,
    img.naturalHeight,
    img.offsetWidth - left - right,
    img.offsetHeight - top - bottom,
  );
  const plate = document.createElement("div");
  plate.className = styles.plate;
  Object.assign(plate.style, {
    width: px(img.offsetWidth),
    height: px(img.offsetHeight),
    padding: `${px(top)} ${px(right)} ${px(bottom)} ${px(left)}`,
    clipPath: cs.clipPath,
    filter: cs.filter,
    backgroundImage: `url(${JSON.stringify(img.currentSrc || img.src)})`,
    backgroundSize: `${px(bgW)} ${px(bgH)}`,
    backgroundPosition: cs.objectPosition,
  });
  copyCorners(cs, plate.style);
  return plate;
}

/** Un clone figé de l'élément, chaque nœud avec ses styles calculés : il ne dépend plus de ses ancêtres. */
function snapshot(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement;
  const copies = [clone, ...clone.querySelectorAll("*")];
  [source, ...source.querySelectorAll("*")].forEach((original, index) => {
    const copy = copies[index];
    const cs = getComputedStyle(original);
    let css = "";
    for (let i = 0; i < cs.length; i++) {
      const name = cs[i];
      if (!NOT_COPIED.test(name)) css += `${name}:${cs.getPropertyValue(name)};`;
    }
    copy.setAttribute("style", css);
    // Ni id en double, ni attribut que d'autres scripts chercheraient (data-loupe, data-kv, data-chapitre…)
    copy.removeAttribute("id");
    copy.removeAttribute("tabindex");
    Array.from(copy.attributes).forEach((attr) => attr.name.startsWith("data-") && copy.removeAttribute(attr.name));
    if (original instanceof HTMLImageElement && copy instanceof HTMLImageElement) {
      // Les pixels déjà chargés, sans nouveau choix dans srcset
      copy.removeAttribute("srcset");
      copy.removeAttribute("sizes");
      copy.src = original.currentSrc || original.src;
      copy.alt = "";
      copy.loading = "eager";
    }
  });
  Object.assign(clone.style, {
    position: "absolute",
    inset: "0 auto auto 0",
    margin: "0",
    boxSizing: "border-box",
    width: px(source.offsetWidth),
    height: px(source.offsetHeight),
    minWidth: "0",
    minHeight: "0",
    maxWidth: "none",
    maxHeight: "none",
    translate: "none",
    rotate: "none",
    scale: "none",
    transformOrigin: "50% 50%",
    opacity: "1",
    visibility: "visible",
  });
  return clone;
}

interface LensParts {
  root: HTMLElement;
  body: HTMLElement;
  stage: HTMLElement;
  frame: HTMLElement;
}

interface Active {
  host: HTMLElement;
  /** Ce qu'on grossit : l'hôte, ou son descendant `[data-loupe-source]`. */
  source: HTMLElement;
  content: HTMLElement;
  clipper: HTMLElement | null;
  zoom: number;
  radius: number;
  /** Taille de mise en page de la source et sa rotation (l'échelle à l'écran se mesure à chaque image). */
  w: number;
  h: number;
  angle: number;
  cos: number;
  sin: number;
  /** Centre de la lentille, dans le repère de la fenêtre. */
  x: number;
  y: number;
  frames: number;
  written: Map<string, string>;
}

/** Le gestionnaire délégué : sonde l'hôte sous la souris, puis place la lentille à chaque image. */
function attachLoupe({ root, body, stage, frame }: LensParts) {
  const html = document.documentElement;
  let active: Active | null = null;
  let raf = 0;
  let probeRaf = 0;
  let sx = -1;
  let sy = -1;
  let hitStale = true;
  /** Un contrôle ou un calque fixe sous la souris, recalculé quand elle bouge ou que la page défile. */
  let covered = false;
  let hosts: HTMLElement[] = [];
  let hostsStale = true;

  const write = (a: Active, el: HTMLElement, prop: "transform" | "width" | "height", value: string, key: string) => {
    if (a.written.get(key) === value) return;
    a.written.set(key, value);
    el.style[prop] = value;
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (!active) return;
    active = null;
    html.classList.remove(CURSOR_CLASS);
    root.removeAttribute("data-on");
  };

  const draw = () => {
    raf = 0;
    const a = active;
    if (!a) return;
    // Les lectures d'abord (une seule mise à jour de la mise en page s'il y en a une), les écritures ensuite.
    const r = a.host.getBoundingClientRect();
    const s = a.source === a.host ? r : a.source.getBoundingClientRect();
    const f = a.clipper?.getBoundingClientRect();
    if (hitStale) {
      covered = isCovered(document.elementFromPoint(sx, sy), a.host);
      hitStale = false;
    }
    const outside = sx < r.left || sx > r.right || sy < r.top || sy > r.bottom || r.width < MIN_HOST;
    const gone = !a.host.isConnected || !a.host.hasAttribute("data-loupe");
    if (gone || outside || covered || (++a.frames % 12 === 0 && !isShown(a.host))) {
      stop();
      requestProbe();
      return;
    }
    a.x += (sx - a.x) * EASE;
    a.y += (sy - a.y) * EASE;
    const k = s.width / (a.w * a.cos + a.h * a.sin) || 1;
    const fx = f?.left ?? 0;
    const fy = f?.top ?? 0;
    const cx = s.left + s.width / 2 - fx;
    const cy = s.top + s.height / 2 - fy;
    write(a, body, "transform", `translate3d(${px(a.x - a.radius)},${px(a.y - a.radius)},0)`, "body");
    write(a, stage, "transform", `translate(${px(a.radius - a.zoom * a.x)},${px(a.radius - a.zoom * a.y)}) scale(${a.zoom})`, "stage");
    if (f) {
      write(a, frame, "transform", `translate(${px(fx)},${px(fy)})`, "frame");
      write(a, frame, "width", px(f.width), "frame-w");
      write(a, frame, "height", px(f.height), "frame-h");
    }
    write(a, a.content, "transform", `translate(${px(cx - a.w / 2)},${px(cy - a.h / 2)}) rotate(${a.angle.toFixed(4)}rad) scale(${k.toFixed(4)})`, "content");
    // Tant que la lentille est là, elle suit à chaque image ce qui bouge sous elle (défilement, parallaxe, landing).
    raf = requestAnimationFrame(draw);
  };

  const start = (host: HTMLElement) => {
    const source = host.querySelector<HTMLElement>(SOURCE) ?? host;
    const content = source instanceof HTMLImageElement ? imagePlate(source) : snapshot(source);
    const clipper = clipperOf(source);
    frame.replaceChildren(content);
    frame.removeAttribute("style");
    if (clipper) {
      // Le cadre prend la forme de l'ancêtre qui rogne (ses coins à l'échelle de l'écran)
      const cs = getComputedStyle(clipper);
      const kf = clipper.getBoundingClientRect().width / (clipper.offsetWidth || 1);
      copyCorners(cs, frame.style, kf);
      if (cs.clipPath !== "none") frame.style.clipPath = cs.clipPath.replace(PX, (_, n: string) => px(Number(n) * kf));
    }
    frame.toggleAttribute("data-clip", Boolean(clipper));
    const size = Number.parseFloat(host.dataset.loupeSize ?? "");
    if (size >= 60 && size <= 400) body.style.setProperty("--lt", `${size}px`);
    else body.style.removeProperty("--lt");
    const zoom = Number.parseFloat(host.dataset.loupeZoom ?? "");
    const angle = rotationOf(source);
    active = {
      host,
      source,
      content,
      clipper,
      zoom: zoom > 1 && zoom <= 3 ? zoom : ZOOM,
      radius: body.offsetWidth / 2,
      w: source.offsetWidth,
      h: source.offsetHeight,
      angle,
      cos: Math.abs(Math.cos(angle)),
      sin: Math.abs(Math.sin(angle)),
      x: sx,
      y: sy,
      frames: 0,
      written: new Map(),
    };
    // Sur une image qui n'est pas un lien, la lentille remplace le curseur
    if (!host.closest(CONTROLS) && !host.querySelector(CONTROLS)) html.classList.add(CURSOR_CLASS);
    root.setAttribute("data-on", "");
    draw();
  };

  // L'hôte se cherche à ses dimensions : un calque épinglé (pointer-events: none) au-dessus n'empêche rien.
  const probe = () => {
    probeRaf = 0;
    if (sx < 0 || active) return;
    if (hostsStale) {
      hosts = Array.from(document.querySelectorAll<HTMLElement>(HOST)).filter((el) => !root.contains(el));
      hostsStale = false;
    }
    for (let i = hosts.length - 1; i >= 0; i--) {
      const host = hosts[i];
      const r = host.getBoundingClientRect();
      if (r.width < MIN_HOST || sx < r.left || sx > r.right || sy < r.top || sy > r.bottom || !isShown(host)) continue;
      covered = isCovered(document.elementFromPoint(sx, sy), host);
      hitStale = false;
      if (!covered) start(host);
      return;
    }
  };
  function requestProbe() {
    if (!probeRaf) probeRaf = requestAnimationFrame(probe);
  }

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    sx = event.clientX;
    sy = event.clientY;
    hitStale = true;
    if (!active) requestProbe();
  };
  const onScroll = () => {
    hitStale = true;
    if (!active && sx >= 0) requestProbe();
  };
  const onOut = (event: PointerEvent) => {
    if (event.relatedTarget) return;
    sx = -1;
    stop();
  };
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    sx = -1;
    stop();
  };
  // Une nouvelle mise en page : on remesure tout en repartant de zéro.
  const onResize = () => {
    stop();
    hitStale = true;
    requestProbe();
  };
  const hostsObserver = new MutationObserver(() => {
    hostsStale = true;
  });

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onOut, { passive: true });
  document.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  hostsObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-loupe"] });

  return {
    /** Changement de page : la lentille se ferme et oublie l'ancienne page. */
    reset() {
      stop();
      frame.replaceChildren();
      hostsStale = true;
      hitStale = true;
    },
    destroy() {
      stop();
      cancelAnimationFrame(probeRaf);
      hostsObserver.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    },
  };
}

function Lens() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(null);
  const pathname = usePathname();

  useEffect(() => {
    const [root, body, stage, frame] = [rootRef.current, bodyRef.current, stageRef.current, frameRef.current];
    if (!root || !body || !stage || !frame) return;
    const loupe = attachLoupe({ root, body, stage, frame });
    resetRef.current = loupe.reset;
    return () => {
      resetRef.current = null;
      loupe.destroy();
    };
  }, []);

  useEffect(() => {
    resetRef.current?.();
  }, [pathname]);

  return (
    <div ref={rootRef} className={styles.loupe} aria-hidden="true">
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.disc}>
          <div ref={stageRef} className={styles.stage}>
            <div ref={frameRef} className={styles.frame} />
          </div>
          <i className={styles.tint} />
        </div>
        <i className={styles.ring} />
      </div>
    </div>
  );
}

/** La loupe de l'univers : montée seulement à la souris et hors mouvement réduit. */
export function Loupe() {
  const mouse = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  return mouse && !reduced ? createPortal(<Lens />, document.body) : null;
}
