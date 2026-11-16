/**
 * Le moteur de la scène des apps (shared/apps.js) : le ciel, la fiche holographique, le départ, l'arrivée.
 * React rend le décor (couches, astres, fils, fiches) ; le moteur l'anime, par attributs et styles en ligne.
 *
 * LE CIEL : quatre couches en parallaxe au pointeur (4, 10, 18, 30 px, lissé) et au défilement ; des fils de
 * lumière relient les astres voisins ; toutes les 4 s environ, un photon passe de l'un au suivant, qui s'éclaire.
 * Une seule boucle requestAnimationFrame, arrêtée hors écran. À l'arrivée : les étoiles s'allument depuis le
 * centre, les nébuleuses s'épanouissent, les astres s'allument un à un.
 * LA FICHE (survol à la souris, focus clavier, premier toucher) : une seule, compacte, qui ne couvre jamais un
 * autre astre. Sur ordinateur, elle se pose dans le vide le plus proche de l'astre (à droite, à gauche, dessous ou
 * dessus), reliée à lui par un fil de lumière ; si la constellation n'en laisse pas pour chaque astre (écran étroit
 * ou bas), c'est une feuille en bas de la scène, sous les astres. D'un astre à l'autre, elle ne se ferme pas : elle
 * glisse vers le nouvel astre et son contenu se fond (la couleur aussi). Tolérance de 120 ms pour traverser le vide
 * jusqu'à elle, ou jusqu'au voisin ; au clavier, Tab et les flèches vont d'astre en astre. Apparition holographique
 * en 340 ms, disparition en 220 ms ; la caméra glisse à peine vers l'astre (≈ 3 %), les autres s'atténuent.
 * LE DÉPART (clic, Entrée, « Explorer », deuxième toucher) : la caméra plonge vers l'astre, les autres filent
 * hors du cadre, la fiche se replie dans l'icône ; puis le passage (openPassage) : l'icône vole vers la page.
 * Mouvement réduit : ciel fixe sans scintillement, pas de caméra, des fondus.
 */
import { shownImage } from "@/design-system/components/themed-image";
import { CSS_EASE } from "@/design-system/motion/easings";
import { noteFrame, subscribeQuality } from "@/design-system/motion/quality";
import { getTheme } from "@/design-system/theme/theme-store";
import { openPassage } from "@/features/passages";
import { SKY_PALETTES } from "./space-palette";
import { createSky, type Zone } from "./space-sky";
import { playAnimation, playGallery, type PreviewController } from "./space-preview";
import { createTrace, TRACE_FADE_MS, TRACE_THRESHOLD, type StarPoint } from "./space-trace";

/** Événement DOM sur la scène : le total des utilisateurs a fini de monter, tous les astres s'allument ensemble. */
export const ENSEMBLE_EVENT = "kz-apps:ensemble";

interface SpaceEngineApp {
  color: string;
  href: string;
  icon: string;
  /** La version sombre de l'icône (mode sombre), s'il y en a une. */
  iconDark?: string;
  preview: "gallery" | "animation";
}

interface SpaceEngineOptions {
  apps: readonly SpaceEngineApp[];
  /** Les index des astres du code secret, dans l'ordre. */
  code: readonly number[];
  /** Rend la fiche de l'app k (synchrone : elle est mesurée juste après). */
  showPanel: (k: number) => void;
  /** Classes des segments du tracé (CSS Module). */
  segmentClass: { group: string; halo: string; line: string };
}

/** Parallaxe au pointeur (px) : lointaines, nébuleuses, astres, poussière. */
const PARALLAX = [4, 10, 18, 30];
/** Travelling de caméra au défilement (px). */
const TRAVEL = [6, 16, 30, 54];
/** Caméra au survol : ≈ 3 % de zoom vers l'astre ; [échelle, part du recentrage]. */
const HOVER_ZOOM = [[1.012, 0.01], [1.025, 0.02], [1.03, 0.02], [1.06, 0.05]] as const;
/** Caméra au départ : la plongée. */
const DIVE_ZOOM = [[1.05, 0.12], [1.2, 0.4], [1.8, 1], [2.5, 1.6]] as const;
const ICON_SIZE = 112;
const IOS = "cubic-bezier(.2,.8,.2,1)";
const FAST = "cubic-bezier(.4,0,1,1)";
/** ms : le temps de traverser le vide jusqu'à la fiche, ou jusqu'à l'astre voisin, sans qu'elle se ferme. */
const GRACE_MS = 120;
/** ms : la fiche glisse d'un astre à l'autre. */
const GLIDE_MS = 440;
/** ms : la fiche s'éteint ; un astre survolé pendant ce temps la rattrape (elle glisse au lieu de se rouvrir). */
const FADE_MS = 220;
/** px : marge entre la fiche et ce qu'elle ne doit pas couvrir (astres, noms, signature). */
const CLEAR = 14;
/** Coût d'une place qui couvre quelque chose (la signature, au moins) : elle est exclue. */
const BLOCKED = 50;
/** Largeur sous laquelle la fiche est toujours une feuille (la constellation de poche). */
const SHEET_BELOW = 600;
/** px : la hauteur du téléphone de la fiche flottante (la feuille le met à l'échelle, --ek). */
const PHONE_H = 226;

const px = (v: number) => `${Math.round(v * 10) / 10}px`;
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOut = (k: number) => 1 - (1 - k) ** 4;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
/** Où la fiche se pose : à côté de l'astre, ou en feuille en bas de la scène. */
type Side = "right" | "left" | "below" | "above" | "sheet";
interface Spot {
  x: number;
  y: number;
  side: Side;
  cost: number;
}

const grow = (b: Box, m: number): Box => ({ x: b.x - m, y: b.y - m, w: b.w + 2 * m, h: b.h + 2 * m });
const meets = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function required<T extends Element>(root: Element, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`apps-space : élément manquant ${selector}`);
  return el;
}

export function startSpace(scene: HTMLElement, options: SpaceEngineOptions): () => void {
  const { apps } = options;
  const canvas = required<HTMLCanvasElement>(scene, "[data-sky-canvas]");
  const layers = ["loin", "neb", "dock", "pous"].map((name) => required<HTMLElement>(scene, `[data-layer="${name}"]`));
  const dock = layers[2];
  const astres = Array.from(scene.querySelectorAll<HTMLElement>("[data-astre]"));
  const filLines = Array.from(scene.querySelectorAll<SVGLineElement>("[data-fil]"));
  const filGrads = Array.from(scene.querySelectorAll<SVGLinearGradientElement>("[data-fil-grad]"));
  const svgs = Array.from(scene.querySelectorAll<SVGSVGElement>("[data-viewbox]"));
  const photon = required<SVGGElement>(scene, "[data-photon]");
  const photonTrail = Array.from(scene.querySelectorAll<SVGElement>("[data-photon-trail]"));
  const photonDots = Array.from(scene.querySelectorAll<SVGCircleElement>("[data-photon-dot]"));
  const legend = required<SVGSVGElement>(scene, "[data-legend]");
  const legendLine = required<SVGPathElement>(scene, "[data-legend-line]");
  const legendDot = required<SVGCircleElement>(scene, "[data-legend-dot]");
  const fiche = required<HTMLElement>(scene, "[data-fiche]");
  const scan = required<HTMLElement>(scene, "[data-fiche-scan]");
  const panels = Array.from(fiche.querySelectorAll<HTMLElement>("[data-panel]"));

  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = () => mqReduced.matches;
  const now = () => performance.now();
  const sky = createSky(canvas, layers[0]);
  /** Les couleurs du mode (clair : le ciel d'aube) ; suivies à chaque bascule. */
  let palette = SKY_PALETTES[getTheme()];
  const cleanups: (() => void)[] = [];
  let dead = false;
  /** Un écouteur, retiré au démontage. Le type d'événement est celui annoncé par le gestionnaire. */
  const listen = <E extends Event>(target: EventTarget, type: string, fn: (event: E) => void, opts?: AddEventListenerOptions) => {
    const handler = fn as EventListener;
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };

  /* ---------- L'état ---------- */
  let W = 0;
  let H = 0;
  let pts: StarPoint[] = [];
  let segs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const parallax = layers.map(() => [0, 0]);
  let nx = 0;
  let ny = 0;
  let raf = 0;
  let active = false;
  let visible = false;
  let seen = false;
  let arrival = 0;
  let skyReady = false;
  const arrivalAnims: Animation[] = [];
  const arrivalTimers: number[] = [];
  const glint = { k: 0, t: 0, next: 0 };
  let hovered = -1;
  /** L'astre dont la fiche est ouverte (-1 : aucune, ou elle s'éteint). */
  let open = -1;
  /** Le panneau affiché, fiche ouverte ou en train de s'éteindre (-1 : la fiche est cachée). */
  let shown = -1;
  let mode: "float" | "sheet" = "float";
  let ficheW = 0;
  let ficheH = 0;
  /** Ce que la fiche ne doit pas couvrir : l'icône et le nom de chaque astre, la signature (repère du dock). */
  let marks: { icon: Box; label: Box | null }[] = [];
  let sigBox: Box | null = null;
  /** Le bas de la nuit (la ligne de l'invitation) : plus bas, la scène fond dans la page. */
  let nightBottom = 0;
  /** Où la fiche va (sans la parallaxe), où elle est, et d'où elle glisse. */
  let spot: Spot | null = null;
  const pos = { x: 0, y: 0 };
  let glide: { x: number; y: number; t: number } | null = null;
  let ficheAnims: Animation[] = [];
  let ficheTimer = 0;
  let preview: PreviewController | null = null;
  let pointerType = "";
  let leaving = false;
  let plunge = 0;
  let plungeX = 0;
  let plungeY = 0;
  let hoverDelay = 0;
  let restoreTimer = 0;

  /* ---------- Mesures ---------- */
  function textZones(): Zone[] {
    const r = scene.getBoundingClientRect();
    return Array.from(scene.querySelectorAll("[data-zone]"))
      .map((el) => {
        const b = el.getBoundingClientRect();
        return { x: b.left - r.left - 36, y: b.top - r.top - 36, w: b.width + 72, h: b.height + 72 };
      })
      .filter((z) => z.w > 74);
  }

  function measure() {
    W = scene.clientWidth;
    H = scene.clientHeight;
    if (!W || !H) return;
    pts = astres.map((t) => ({ x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, r: t.offsetWidth / 2 }));
    svgs.forEach((svg) => svg.setAttribute("viewBox", `0 0 ${W} ${H}`));
    // Les fils partent du bord de la lueur de chaque astre.
    segs = pts.slice(0, -1).map((a, i) => {
      const b = pts[i + 1];
      const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const ux = (b.x - a.x) / L;
      const uy = (b.y - a.y) / L;
      const s = { x1: a.x + ux * a.r * 1.3, y1: a.y + uy * a.r * 1.3, x2: b.x - ux * b.r * 1.3, y2: b.y - uy * b.r * 1.3 };
      ([filLines[i], filGrads[i]] as const).forEach((el) => {
        if (!el) return;
        el.setAttribute("x1", n1(s.x1));
        el.setAttribute("y1", n1(s.y1));
        el.setAttribute("x2", n1(s.x2));
        el.setAttribute("y2", n1(s.y2));
      });
      return s;
    });
    sky.measure(textZones());
    refit();
    if (reduced() || !active) drawSky(now());
  }

  /** La forme de la fiche, et sa place si elle est ouverte (aussi quand elle ou un nom change de taille : la langue). */
  function refit() {
    if (!W || !H || !pts.length) return;
    layoutFiche();
    if (open >= 0 && !leaving) {
      spot = spotFor(open, spot?.side ?? null);
      glide = null;
      moveFiche(now());
      drawLegend();
      camera(open, "hover");
    }
  }

  function drawSky(t: number) {
    const box = open >= 0 ? spot : null;
    sky.draw({
      t,
      reduced: reduced(),
      arrival,
      plunge,
      plungeX,
      plungeY,
      shooting: skyReady && !leaving,
      extraZones: box ? [{ x: box.x - 40, y: box.y - 40, w: ficheW + 80, h: ficheH + 80 }] : [],
      W,
      H,
      palette,
    });
  }

  /* ---------- Le reflet : un photon passe d'un astre au suivant, qui s'éclaire ---------- */
  function setPhoton(i: number, k: number) {
    const s = segs[i];
    if (k < 0 || !s) {
      photon.removeAttribute("data-on");
      return;
    }
    const e = 0.5 - Math.cos(Math.PI * k) / 2;
    const b = Math.max(0, e - 0.3);
    const x = s.x1 + (s.x2 - s.x1) * e;
    const y = s.y1 + (s.y2 - s.y1) * e;
    const xt = s.x1 + (s.x2 - s.x1) * b;
    const yt = s.y1 + (s.y2 - s.y1) * b;
    photonTrail.forEach((el) => {
      el.setAttribute("x1", n1(xt));
      el.setAttribute("y1", n1(yt));
      el.setAttribute("x2", n1(x + 0.1));
      el.setAttribute("y2", n1(y));
    });
    photonDots.forEach((c) => {
      c.setAttribute("cx", n1(x));
      c.setAttribute("cy", n1(y));
    });
    photon.setAttribute("opacity", clamp(Math.min(k / 0.08, (1 - k) / 0.1), 0, 1).toFixed(3));
    photon.setAttribute("data-on", "");
  }

  function glintStep(t: number) {
    if (!skyReady || leaving || open >= 0 || trace.isActive() || reduced()) {
      if (glint.t) {
        glint.t = 0;
        setPhoton(0, -1);
      }
      return;
    }
    if (!glint.t) {
      if (t < glint.next) return;
      glint.t = t;
    }
    const k = (t - glint.t) / 1150;
    if (k >= 1) {
      setPhoton(0, -1);
      flash(glint.k + 1);
      glint.t = 0;
      glint.k = (glint.k + 1) % (apps.length - 1);
      glint.next = t + 2900;
      return;
    }
    setPhoton(glint.k, k);
  }

  /** L'éclat d'un astre : l'aigrette s'allonge, le halo s'avive, puis tout revient. */
  function flash(i: number, strong = false) {
    const star = astres[i];
    if (!star || reduced()) return;
    const aig = star.querySelector("[data-aig]");
    const hal = star.querySelector("[data-hal]");
    const m = strong ? 2.3 : 1.7;
    const timing = { duration: strong ? 1200 : 950, easing: IOS };
    aig?.animate([{ transform: "scale(1)" }, { transform: `scale(${m})`, offset: 0.28 }, { transform: "scale(1)" }], timing);
    const { rest, peak } = palette.flash;
    hal?.animate(
      [
        { transform: "scale(1)", filter: rest },
        { transform: `scale(${strong ? 1.5 : 1.25})`, filter: peak, offset: 0.25 },
        { transform: "scale(1)", filter: rest },
      ],
      timing,
    );
  }

  /* ---------- L'ensemble : le total des utilisateurs est monté, tous les astres s'allument une fois ensemble ----------
     Après l'arrivée des astres (sinon il l'attend) ; pas en mouvement réduit, ni pendant un départ ou un tracé. */
  let ensembleDue = false;
  function ensemble() {
    if (!skyReady) {
      ensembleDue = true;
      return;
    }
    ensembleDue = false;
    if (reduced() || leaving || trace.isActive()) return;
    astres.forEach((_, i) => flash(i, true));
    // Les fils s'avivent en même temps : la constellation entière, d'un seul éclat.
    filLines.forEach((line) =>
      line.animate([{ opacity: 0.6 }, { opacity: 1, offset: 0.3 }, { opacity: 0.6 }], { duration: 1200, easing: IOS }),
    );
  }

  /* ---------- La boucle unique : parallaxe, ciel, reflet, légende de la fiche ---------- */
  function loop(t: number) {
    raf = 0;
    if (!active) return;
    noteFrame(t);
    const rm = reduced();
    const vh = window.innerHeight || 1;
    // Toutes les lectures de mise en page avant les écritures de l'image (pas de mise en page forcée).
    const r = scene.getBoundingClientRect();
    const iconBox = shown >= 0 && mode === "float" ? shownImage(astres[shown])?.getBoundingClientRect() : undefined;
    const sp = rm ? 0 : clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
    const boost = open >= 0 ? 1.6 : 1;
    layers.forEach((layer, i) => {
      const p = parallax[i];
      const tx = rm ? 0 : -nx * PARALLAX[i] * boost;
      const ty = rm ? 0 : -ny * PARALLAX[i] * 0.75 * boost + sp * TRAVEL[i];
      p[0] += (tx - p[0]) * 0.075;
      p[1] += (ty - p[1]) * 0.075;
      layer.style.translate = `${px(p[0])} ${px(p[1])}`;
    });
    drawSky(t);
    glintStep(t);
    if (shown >= 0) {
      moveFiche(t);
      drawLegend(iconBox && { scene: r, icon: iconBox });
    }
    if (!rm || plunge) raf = requestAnimationFrame(loop);
  }

  function setActive() {
    const on = visible && !document.hidden;
    if (on === active) return;
    active = on;
    scene.toggleAttribute("data-actif", on);
    if (on) {
      if (!raf) raf = requestAnimationFrame(loop);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  /** La caméra. « hover » : elle glisse à peine vers l'astre. « dive » : elle plonge vers lui (chaque couche
   *  grossit selon sa profondeur), les autres astres filent hors du cadre. */
  function camera(i: number, mode: "hover" | "dive" = "hover") {
    const P = pts[i];
    const zoom = mode === "dive" ? DIVE_ZOOM : HOVER_ZOOM;
    const R = Math.max(W, H) * 0.9;
    astres.forEach((star, j) => {
      const Q = pts[j];
      if (mode !== "dive" || i < 0 || j === i || reduced() || !P || !Q) {
        star.style.translate = "";
        return;
      }
      const L = Math.hypot(Q.x - P.x, Q.y - P.y) || 1;
      star.style.translate = `${px(((Q.x - P.x) / L) * R)} ${px(((Q.y - P.y) / L) * R)}`;
    });
    layers.forEach((layer, j) => {
      if (i < 0 || reduced() || !P) {
        layer.style.transform = "";
        return;
      }
      zoomLayer(layer, zoom[j], P.x, P.y);
    });
  }

  function zoomLayer(layer: HTMLElement, [scale, recenter]: readonly [number, number], x: number, y: number) {
    const lx = x - layer.offsetLeft;
    const ly = y - layer.offsetTop;
    layer.style.transform = `translate(${px(lx + (W / 2 - x) * recenter - scale * lx)},${px(ly + (H / 2 - y) * recenter - scale * ly)}) scale(${scale})`;
  }

  function hover(k: number) {
    if (hovered === k) return;
    hovered = k;
    dock.toggleAttribute("data-survol", k >= 0);
    astres.forEach((star, j) => star.toggleAttribute("data-vise", j === k));
  }

  /* ---------- La fiche holographique ---------- */
  function stopPreview() {
    preview?.kill();
    preview = null;
  }
  function cancelFicheAnims() {
    ficheAnims.forEach((a) => a.cancel());
    ficheAnims = [];
  }

  /** Ce que la fiche ne doit pas couvrir (mesuré sans parallaxe ni caméra : les offsets ignorent les transformations),
   *  puis sa forme : flottante si chaque astre a un vide assez grand à côté de lui, sinon une feuille pour tous
   *  (la même partout, pour que le passage d'un astre à l'autre reste un glissé). */
  function layoutFiche() {
    marks = astres.map((star) => {
      const icon = { x: star.offsetLeft, y: star.offsetTop, w: star.offsetWidth, h: star.offsetHeight };
      const name = star.querySelector<HTMLElement>("[data-nom]");
      // Le nom est centré sous (ou sur) l'astre par une translation de -50 %, que les offsets ignorent.
      const label = name
        ? { x: icon.x + name.offsetLeft - name.offsetWidth / 2, y: icon.y + name.offsetTop, w: name.offsetWidth, h: name.offsetHeight }
        : null;
      return { icon, label };
    });
    const sig = scene.querySelector<HTMLElement>("[data-sig]");
    sigBox = sig ? { x: sig.offsetLeft, y: sig.offsetTop, w: sig.offsetWidth, h: sig.offsetHeight } : null;
    const hint = scene.querySelector<HTMLElement>("[data-indice]");
    nightBottom = hint ? hint.offsetTop + hint.offsetHeight : H;
    let next: typeof mode = "sheet";
    // La fiche flottante est mesurée à sa vraie taille (sans l'échelle d'une feuille précédente).
    fiche.style.removeProperty("--ek");
    if (W >= SHEET_BELOW) {
      fiche.setAttribute("data-mode", "float");
      ficheW = fiche.offsetWidth;
      ficheH = fiche.offsetHeight;
      if (apps.every((_, k) => (floatSpot(k, null)?.cost ?? BLOCKED) < BLOCKED)) next = "float";
    }
    mode = next;
    fiche.setAttribute("data-mode", mode);
    if (mode === "sheet") {
      // Le téléphone de la feuille prend la place laissée sous l'astre le plus bas (caméra comprise).
      const lowest = Math.max(
        ...apps.map((_, k) => Math.max(...marks.map((m, j) => Math.max(edge(k, m.icon), j !== k && m.label ? edge(k, m.label) : 0)))),
      );
      const pad = parseFloat(getComputedStyle(fiche).paddingTop) || 12;
      const phone = clamp(H - sheetMargin() - lowest - CLEAR - pad * 2, 96, 150);
      fiche.style.setProperty("--ek", (phone / PHONE_H).toFixed(3));
    }
    ficheW = fiche.offsetWidth;
    ficheH = fiche.offsetHeight;
    legend.toggleAttribute("data-on", shown >= 0 && mode === "float");
  }

  const sheetMargin = () => (W < SHEET_BELOW ? 12 : Math.max(16, H * 0.04));

  /** La caméra du survol rapproche l'astre k : où se trouve alors une boîte du dock. */
  function viewFrom(k: number) {
    const P = pts[k];
    const [s, rc] = reduced() || !P ? [1, 0] : HOVER_ZOOM[2];
    const fx = P ? P.x + (W / 2 - P.x) * rc : 0;
    const fy = P ? P.y + (H / 2 - P.y) * rc : 0;
    return (b: Box): Box => ({ x: fx + s * (b.x - (P?.x ?? 0)), y: fy + s * (b.y - (P?.y ?? 0)), w: b.w * s, h: b.h * s });
  }
  /** Le bas d'une boîte de l'astre j, quand la caméra rapproche l'astre k. */
  const edge = (k: number, b: Box) => {
    const v = viewFrom(k)(b);
    return v.y + v.h;
  };

  /** La place la plus proche de l'astre k qui ne couvre ni un autre astre, ni son nom, ni la signature.
   *  Coût : 100 par astre ou nom couvert, 200 si elle couvre son propre astre, 50 pour la signature (au-delà de
   *  BLOCKED, la place est interdite) ; puis, à la marge : descendre dans le fondu du bas de la scène, la distance,
   *  et de petites préférences (centrée, sur le côté, du même côté que la fiche d'avant). */
  function floatSpot(k: number, prev: Side | null): Spot | null {
    const view = viewFrom(k);
    const mark = marks[k];
    if (!mark) return null;
    const self = view(mark.icon);
    const cx = self.x + self.w / 2;
    const cy = self.y + self.h / 2;
    const R = (self.w / 2) * 1.16;
    const gap = 22;
    const fw = ficheW;
    const fh = ficheH;
    const top = sigBox ? sigBox.y : 16;
    const bottom = H - Math.max(16, H * 0.07);
    const blocks = marks.flatMap((m, j) =>
      j === k ? [] : [grow(view(m.icon), CLEAR), ...(m.label ? [grow(view(m.label), CLEAR / 2)] : [])],
    );
    const own = grow({ x: cx - R, y: cy - R, w: R * 2, h: R * 2 }, 6);
    const sig = sigBox ? grow(sigBox, CLEAR) : null;
    let best: Spot | null = null;
    for (const a of [0.5, 0.24, 0.76]) {
      const tries: [Side, number, number][] = [
        ["right", cx + R + gap, cy - fh * a],
        ["left", cx - R - gap - fw, cy - fh * a],
        ["below", cx - fw * a, cy + R + gap],
        ["above", cx - fw * a, cy - R - gap - fh],
      ];
      for (const [side, x0, y0] of tries) {
        const x = clamp(x0, 16, W - 16 - fw);
        const y = clamp(y0, top, Math.max(top, bottom - fh));
        const box = { x, y, w: fw, h: fh };
        let cost = blocks.reduce((c, b) => c + (meets(box, b) ? 100 : 0), 0);
        if (meets(box, own)) cost += 200;
        if (sig && meets(box, sig)) cost += 50;
        const dx = Math.max(x - cx, 0, cx - x - fw);
        const dy = Math.max(y - cy, 0, cy - y - fh);
        cost += Math.hypot(dx, dy) / 300 + (a === 0.5 ? 0 : 0.04) + (side === "above" || side === "below" ? 0.08 : 0);
        if (y + fh > nightBottom) cost += 0.3 + (y + fh - nightBottom) / 200;
        if (side === prev) cost -= 0.12;
        if (!best || cost < best.cost) best = { x, y, side, cost };
      }
    }
    return best;
  }

  function spotFor(k: number, prev: Side | null): Spot | null {
    if (mode === "float") return floatSpot(k, prev);
    return { x: (W - ficheW) / 2, y: H - sheetMargin() - ficheH, side: "sheet", cost: 0 };
  }

  /** La fiche suit la parallaxe du dock (elle reste à sa place près de l'astre) ; d'un astre à l'autre, elle glisse. */
  function moveFiche(t: number) {
    if (!spot) return;
    if (glide) {
      const e = easeOut(clamp((t - glide.t) / GLIDE_MS, 0, 1));
      pos.x = glide.x + (spot.x - glide.x) * e;
      pos.y = glide.y + (spot.y - glide.y) * e;
      if (e >= 1) glide = null;
    } else {
      pos.x = spot.x;
      pos.y = spot.y;
    }
    const [dx, dy] = parallax[2];
    fiche.style.translate = `${px(pos.x + dx)} ${px(pos.y + dy)}`;
  }

  /** Le panneau de l'app k ; sans fondu quand la fiche était cachée. */
  function showPanelOf(k: number, fade: boolean) {
    if (!fade) fiche.setAttribute("data-net", "");
    panels.forEach((panel, j) => panel.toggleAttribute("data-on", j === k));
    if (!fade) {
      void fiche.offsetWidth;
      fiche.removeAttribute("data-net");
    }
    shown = k;
  }

  /** La légende de HUD : un fil de lumière de l'astre au bord le plus proche de la fiche (il suit l'astre pendant la
   *  parallaxe, et la fiche pendant qu'elle glisse). La feuille n'en a pas : l'astre visé est mis en avant.
   *  `boxes` : la scène et l'icône déjà mesurées (la boucle les lit avant d'écrire) ; la fiche se déduit de sa place. */
  function drawLegend(boxes?: { scene: DOMRect; icon: DOMRect }) {
    if (mode !== "float") return;
    const icon = shownImage(astres[shown]);
    if (!icon) return;
    const r = boxes?.scene ?? scene.getBoundingClientRect();
    const b = boxes?.icon ?? icon.getBoundingClientRect();
    const ax = b.left - r.left + b.width / 2;
    const ay = b.top - r.top + b.height / 2;
    const R = b.width * 0.82;
    // La fiche est posée par sa translation (moveFiche) : sa boîte s'en déduit sans la mesurer.
    const [pdx, pdy] = parallax[2];
    const F = { x: pos.x + pdx, y: pos.y + pdy, w: ficheW, h: ficheH };
    const outX = Math.max(F.x - ax, 0, ax - F.x - F.w);
    const outY = Math.max(F.y - ay, 0, ay - F.y - F.h);
    let ex: number;
    let ey: number;
    let kx: number;
    let ky: number;
    if (outX >= outY) {
      // L'astre est à côté : le fil arrive à l'horizontale sur le bord gauche ou droit.
      const dir = ax < F.x ? -1 : 1;
      ex = dir < 0 ? F.x : F.x + F.w;
      ey = clamp(ay, F.y + 26, F.y + F.h - 26);
      kx = ex + dir * 20;
      ky = ey;
    } else {
      // Au-dessus ou au-dessous : le fil arrive à la verticale sur le bord haut ou bas.
      const dir = ay < F.y ? -1 : 1;
      ey = dir < 0 ? F.y : F.y + F.h;
      ex = clamp(ax, F.x + 26, F.x + F.w - 26);
      kx = ex;
      ky = ey + dir * 18;
    }
    const L = Math.hypot(kx - ax, ky - ay) || 1;
    const sx = ax + ((kx - ax) / L) * R;
    const sy = ay + ((ky - ay) / L) * R;
    const straight = Math.hypot(kx - sx, ky - sy) < 6;
    legendLine.setAttribute(
      "d",
      straight ? `M${n1(sx)} ${n1(sy)}L${n1(ex)} ${n1(ey)}` : `M${n1(sx)} ${n1(sy)}L${n1(kx)} ${n1(ky)}L${n1(ex)} ${n1(ey)}`,
    );
    legendDot.setAttribute("cx", n1(sx));
    legendDot.setAttribute("cy", n1(sy));
  }

  function finishArrival() {
    arrivalAnims.forEach((a) => a.finish());
    arrivalTimers.forEach(window.clearTimeout);
    arrivalTimers.length = 0;
    skyReady = true;
    if (ensembleDue) ensemble();
  }

  /** Ouvre la fiche de l'astre k. Si elle est déjà là (ouverte, ou en train de s'éteindre), elle ne se rouvre pas :
   *  elle glisse vers k, son contenu et sa couleur se fondent. */
  function openFiche(k: number) {
    if (leaving || !seen) return;
    window.clearTimeout(ficheTimer);
    if (open === k) return;
    const app = apps[k];
    if (!app) return;
    if (!skyReady) finishArrival();
    const there = shown >= 0;
    const again = there && shown === k;
    const rm = reduced();
    const moving = there && !rm && active;
    open = k;
    hover(k);
    if (!again) {
      options.showPanel(k);
      // La couleur avant le panneau : quand la fiche était cachée, les deux se posent sans fondu.
      fiche.style.setProperty("--kz-fiche-c", app.color);
      legend.style.setProperty("--c", app.color);
      showPanelOf(k, there);
      stopPreview();
      const panel = panels[k];
      if (panel) preview = app.preview === "gallery" ? playGallery(panel, rm) : playAnimation(panel, rm);
    }
    spot = spotFor(k, there ? (spot?.side ?? null) : null);
    glide = moving ? { x: pos.x, y: pos.y, t: now() } : null;
    camera(k, "hover");
    fiche.setAttribute("data-on", "");
    legend.toggleAttribute("data-on", mode === "float");
    if (there) {
      // Rattrapée pendant qu'elle s'éteignait : elle revient de là où elle en était.
      const cs = getComputedStyle(fiche);
      const from = { opacity: cs.opacity };
      cancelFicheAnims();
      moveFiche(now());
      drawLegend();
      if (Number(from.opacity) < 0.999)
        ficheAnims.push(fiche.animate([from, { opacity: 1 }], { duration: 200, easing: IOS }));
      if (!rm && !again)
        ficheAnims.push(
          legendLine.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 300, easing: IOS }),
          scan.animate(
            [
              { transform: "translateY(0px)", opacity: 0.55 },
              { transform: `translateY(${ficheH}px)`, opacity: 0 },
            ],
            { duration: 380, easing: "cubic-bezier(.45,0,.55,1)" },
          ),
        );
      if (moving && !raf) raf = requestAnimationFrame(loop);
      return;
    }
    cancelFicheAnims();
    fiche.style.transformOrigin = "";
    moveFiche(now());
    drawLegend();
    // Apparition holographique : un balayage la dessine de haut en bas, nette, une très légère
    // aberration de couleur sur les bords, à l'arrivée seulement.
    ficheAnims.push(
      fiche.animate(
        rm
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              {
                opacity: 0.35,
                clipPath: "inset(0% 0% 100% 0% round 20px)",
                filter: "drop-shadow(3px 0px 0px rgba(255,64,120,.65)) drop-shadow(-3px 0px 0px rgba(64,214,255,.65))",
              },
              {
                opacity: 0.95,
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                filter: "drop-shadow(1.5px 0px 0px rgba(255,64,120,.3)) drop-shadow(-1.5px 0px 0px rgba(64,214,255,.3))",
                offset: 0.72,
              },
              {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                filter: "drop-shadow(0px 0px 0px rgba(255,64,120,0)) drop-shadow(0px 0px 0px rgba(64,214,255,0))",
              },
            ],
        { duration: rm ? 200 : 340, easing: IOS },
      ),
    );
    if (!rm) {
      ficheAnims.push(
        scan.animate(
          [
            { transform: "translateY(0px)", opacity: 1 },
            { transform: `translateY(${ficheH}px)`, opacity: 0.9, offset: 0.86 },
            { transform: `translateY(${ficheH}px)`, opacity: 0 },
          ],
          { duration: 320, easing: "cubic-bezier(.45,0,.55,1)" },
        ),
        legendLine.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 240, easing: IOS }),
      );
    }
  }

  /** La fiche s'éteint (lentement d'abord : un astre voisin survolé à temps la rattrape). */
  function closeFiche(fast = false) {
    window.clearTimeout(ficheTimer);
    if (open < 0 || leaving) return;
    open = -1;
    hover(-1);
    camera(-1);
    cancelFicheAnims();
    const end = () => {
      shown = -1;
      glide = null;
      fiche.removeAttribute("data-on");
      legend.removeAttribute("data-on");
      stopPreview();
      cancelFicheAnims();
    };
    if (fast) {
      end();
      return;
    }
    const out = fiche.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(.985)" },
      ],
      { duration: FADE_MS, easing: "cubic-bezier(.55,0,.8,.2)", fill: "forwards" },
    );
    ficheAnims = [out, legend.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS - 40, easing: FAST, fill: "forwards" })];
    out.onfinish = () => {
      if (open < 0) end();
    };
  }

  function closeFicheSoon() {
    window.clearTimeout(ficheTimer);
    ficheTimer = window.setTimeout(() => closeFiche(), GRACE_MS);
  }

  /* ---------- Le départ ---------- */
  function restore() {
    leaving = false;
    plunge = 0;
    scene.removeAttribute("data-saut");
    cancelFicheAnims();
    fiche.removeAttribute("data-on");
    legend.removeAttribute("data-on");
    stopPreview();
    open = -1;
    shown = -1;
    glide = null;
    hover(-1);
    camera(-1);
  }

  function explore(k: number) {
    if (leaving || k < 0) return;
    const app = apps[k];
    const icon = shownImage(astres[k]);
    if (!app || !icon) return;
    const r = scene.getBoundingClientRect();
    const b = icon.getBoundingClientRect();
    leaving = true;
    window.clearTimeout(ficheTimer);
    scene.setAttribute("data-saut", "");
    hover(k);
    // La fiche se replie dans l'icône.
    if (shown >= 0 && !reduced()) {
      const f = fiche.getBoundingClientRect();
      const tx = b.left + b.width / 2 - (f.left + f.width / 2);
      const ty = b.top + b.height / 2 - (f.top + f.height / 2);
      cancelFicheAnims();
      fiche.style.transformOrigin = "50% 50%";
      const fold = fiche.animate(
        [
          { transform: "translate(0px,0px) scale(1)", opacity: 1 },
          { transform: `translate(${px(tx)},${px(ty)}) scale(.06)`, opacity: 0 },
        ],
        { duration: 320, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" },
      );
      ficheAnims = [fold, legend.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: FAST, fill: "forwards" })];
      fold.onfinish = stopPreview;
    } else {
      fiche.removeAttribute("data-on");
      legend.removeAttribute("data-on");
      stopPreview();
    }
    open = -1;
    glide = null;
    plunge = now();
    plungeX = b.left - r.left + b.width / 2;
    plungeY = b.top - r.top + b.height / 2;
    camera(k, "dive");
    if (!raf && active) raf = requestAnimationFrame(loop);
    // Puis le passage : l'icône se détache et se pose au centre, la couleur de l'app remplit l'écran.
    if (!openPassage(icon, app.href, { color: app.color, icon: getTheme() === "dark" && app.iconDark ? app.iconDark : app.icon, size: ICON_SIZE })) {
      restoreTimer = window.setTimeout(restore, 900);
    }
  }

  /* ---------- Le tracé (passage secret) ---------- */
  const traceGroup = required<SVGGElement>(scene, "[data-trace-group]");
  const trace = createTrace({
    scene,
    dock,
    astres,
    points: () => pts,
    width: () => W,
    code: options.code,
    canStart: () => seen && !leaving,
    onStart: () => {
      if (!skyReady) finishArrival();
      if (open >= 0) closeFiche();
      else {
        window.clearTimeout(ficheTimer);
        hover(-1);
      }
    },
    flash: (k) => flash(k),
    onSuccess: () => {
      leaving = true;
    },
    plunge: (x, y) => {
      const r = scene.getBoundingClientRect();
      plunge = now();
      plungeX = x - r.left;
      plungeY = y - r.top;
      scene.setAttribute("data-saut", "");
      layers.forEach((layer, j) => zoomLayer(layer, DIVE_ZOOM[j], plungeX, plungeY));
      if (!raf && active) raf = requestAnimationFrame(loop);
    },
    onReset: (fromSuccess) => {
      if (fromSuccess) restore();
    },
    reduced,
    group: traceGroup,
    live: required<SVGGElement>(scene, "[data-trace-live]"),
    ember: required<SVGCircleElement>(scene, "[data-trace-ember]"),
    segmentClass: options.segmentClass,
  });

  /* ---------- Les gestes ---------- */
  const isMouse = (e: PointerEvent) => e.pointerType === "mouse" && mqMouse.matches;
  const modified = (e: MouseEvent | KeyboardEvent) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  astres.forEach((star, k) => {
    listen(star, "pointerdown", (e: PointerEvent) => {
      pointerType = e.pointerType;
      if (e.button > 0) return;
      star.setAttribute("data-presse", "");
      trace.arm(e, k);
    });
    ["pointerup", "pointerleave", "pointercancel", "blur"].forEach((type) =>
      listen(star, type, () => star.removeAttribute("data-presse")),
    );
    listen(star, "click", (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || modified(e)) return;
      e.preventDefault();
      // Un tracé n'ouvre jamais la page d'une app (ni la fiche) : le clic qui le suit est ignoré.
      if (trace.isActive() || trace.isFire() || now() - trace.endedAt() < 700) {
        pointerType = "";
        return;
      }
      const touch = pointerType === "touch" || pointerType === "pen";
      pointerType = "";
      // Au toucher : un premier toucher ouvre la fiche, un deuxième lance le voyage.
      if (touch && open !== k) {
        openFiche(k);
        return;
      }
      explore(k);
    });
    listen(star, "pointerenter", (e: PointerEvent) => {
      if (!isMouse(e) || trace.isActive()) return;
      // Juste après un tracé, la fiche attend que le fil se soit effacé.
      const wait = trace.endedAt() + TRACE_FADE_MS - now();
      window.clearTimeout(hoverDelay);
      if (wait > 0) {
        hoverDelay = window.setTimeout(() => {
          if (!trace.isActive() && star.matches(":hover")) openFiche(k);
        }, wait);
      } else openFiche(k);
    });
    listen(star, "pointerleave", (e: PointerEvent) => {
      if (isMouse(e) && open === k) closeFicheSoon();
    });
    listen(star, "focus", () => {
      if (star.matches(":focus-visible")) openFiche(k);
    });
    listen(star, "blur", () => {
      if (open === k) closeFicheSoon();
    });
    // Au clavier, les flèches vont d'astre en astre (dans l'ordre de la constellation, en boucle) ; Tab aussi.
    listen(star, "keydown", (e: KeyboardEvent) => {
      if (modified(e) || leaving) return;
      const n = astres.length;
      const to: Record<string, number> = { ArrowRight: k + 1, ArrowDown: k + 1, ArrowLeft: k - 1, ArrowUp: k - 1, Home: 0, End: n - 1 };
      const j = to[e.key];
      if (j === undefined) return;
      e.preventDefault();
      astres[(j + n) % n]?.focus();
    });
  });

  listen(fiche, "pointerenter", (e: PointerEvent) => {
    if (!isMouse(e) || trace.isActive()) return;
    window.clearTimeout(ficheTimer);
    // Rejointe pendant qu'elle s'éteignait : elle se rallume.
    if (open < 0 && shown >= 0) openFiche(shown);
  });
  listen(fiche, "pointerleave", (e: PointerEvent) => {
    if (isMouse(e)) closeFicheSoon();
  });
  // Un glissé (≥ 8 px entre l'appui et le lâcher) sur la fiche n'est pas un clic : il n'ouvre rien.
  let fichePress: [number, number] | null = null;
  listen(fiche, "pointerdown", (e: PointerEvent) => {
    fichePress = [e.clientX, e.clientY];
  });
  const dragged = (e: MouseEvent) => {
    if (!fichePress || !e.detail) return false;
    return Math.hypot(e.clientX - fichePress[0], e.clientY - fichePress[1]) >= TRACE_THRESHOLD;
  };
  listen(fiche, "click", (e: MouseEvent) => {
    if (e.button !== 0 || modified(e)) return;
    e.preventDefault();
    if (dragged(e)) return;
    explore(open >= 0 ? open : hovered);
  });
  // Un toucher dans le vide referme la fiche ; Échap aussi, même ouverte au survol (le focus est alors ailleurs).
  listen(scene, "pointerdown", (e: PointerEvent) => {
    if (open < 0 || e.pointerType === "mouse") return;
    if (e.target instanceof Element && e.target.closest("[data-astre], [data-fiche]")) return;
    closeFiche();
  });
  listen(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && open >= 0) closeFiche();
  });
  // La parallaxe au pointeur (souris) ; pendant un tracé, le ciel la retient.
  listen(scene, "pointermove", (e: PointerEvent) => {
    trace.move(e);
    if (e.pointerType !== "mouse" || !mqMouse.matches || trace.isActive()) return;
    const r = scene.getBoundingClientRect();
    nx = clamp(((e.clientX - r.left) / (r.width || 1)) * 2 - 1, -1, 1);
    ny = clamp(((e.clientY - r.top) / (r.height || 1)) * 2 - 1, -1, 1);
  }, { passive: false });
  listen(scene, "pointerleave", (e: PointerEvent) => {
    if (e.pointerType === "mouse") {
      nx = 0;
      ny = 0;
    }
  });
  listen(document, "pointerup", (e: PointerEvent) => trace.release(e), { capture: true });
  listen(document, "pointercancel", (e: PointerEvent) => trace.release(e), { capture: true });
  listen(scene, "lostpointercapture", (e: PointerEvent) => {
    if (e.target === scene) trace.release(e);
  });
  listen(scene, "contextmenu", (e: MouseEvent) => {
    if (trace.isActive() || trace.isFire()) e.preventDefault();
  });
  // Retour arrière (page restaurée du cache) : le ciel revient tel quel.
  listen(window, "pageshow", (e: PageTransitionEvent) => {
    if (!e.persisted) return;
    trace.reset();
    restore();
  });

  /* ---------- L'arrivée : les étoiles depuis le centre, les nébuleuses, puis les astres un à un ---------- */
  function arrive() {
    arrivalAnims.forEach((a) => a.cancel());
    arrivalAnims.length = 0;
    arrivalTimers.forEach(window.clearTimeout);
    arrivalTimers.length = 0;
    skyReady = false;
    const rm = reduced();
    arrival = rm ? 0 : now();
    scene.removeAttribute("data-arrive");
    void scene.offsetWidth;
    scene.setAttribute("data-arrive", "");
    const done = () => {
      skyReady = true;
      glint.next = now() + 1600;
      if (ensembleDue) ensemble();
    };
    const t0 = rm ? 0 : 650;
    const step = rm ? 0 : 150;
    astres.forEach((star, i) => {
      arrivalAnims.push(
        star.animate(
          rm
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, scale: ".15", filter: "brightness(3)" },
                { opacity: 1, scale: "1", filter: "brightness(1)" },
              ],
          { duration: rm ? 200 : 950, delay: t0 + i * step, easing: CSS_EASE.expo, fill: "backwards" },
        ),
      );
      if (!rm) arrivalTimers.push(window.setTimeout(() => flash(i, true), t0 + i * step + 60));
    });
    filLines.forEach((line, i) => {
      arrivalAnims.push(
        line.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: rm ? 200 : 800,
          delay: rm ? 0 : t0 + (i + 1) * step + 250,
          easing: CSS_EASE.inOut,
          fill: "backwards",
        }),
      );
    });
    arrivalTimers.push(window.setTimeout(done, rm ? 200 : t0 + apps.length * step + 1000));
  }

  /* ---------- Visible ou non : le ciel joue, ou se met en pause ---------- */
  function see(on: boolean) {
    if (on === visible) return;
    visible = on;
    setActive();
    if (on) preview?.play();
    else preview?.pause();
    if (on && !seen) {
      seen = true;
      scene.setAttribute("data-vu", "");
      measure();
      arrive();
    }
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => see(entry.isIntersecting && entry.intersectionRatio >= 0.28)),
    { threshold: [0, 0.28, 0.5] },
  );
  io.observe(scene);
  listen(document, "visibilitychange", setActive);
  const ro = new ResizeObserver(() => measure());
  // Une baisse du niveau de qualité : le ciel se ressème (moins d'étoiles, canevas moins fin).
  const unsubscribeQuality = subscribeQuality(() => measure());
  ro.observe(scene);
  // La fiche et les noms changent de taille avec la langue : la place de la fiche se recalcule, le ciel ne bouge pas.
  const roFiche = new ResizeObserver(() => refit());
  [fiche, ...scene.querySelectorAll("[data-nom]")].forEach((el) => roFiche.observe(el));
  listen(window, "resize", measure);
  listen(scene, ENSEMBLE_EVENT, ensemble);
  // Le mode change (bouton, système) : le même ciel, redessiné dans l'autre palette, sans recharger la page.
  listen(document, "kz-theme:change", () => {
    palette = SKY_PALETTES[getTheme()];
    if (reduced() || !active) drawSky(now());
  });
  void document.fonts?.ready.then(() => {
    if (!dead) measure();
  });

  measure();

  return () => {
    dead = true;
    io.disconnect();
    ro.disconnect();
    roFiche.disconnect();
    unsubscribeQuality();
    cleanups.forEach((fn) => fn());
    if (raf) cancelAnimationFrame(raf);
    [ficheTimer, hoverDelay, restoreTimer, ...arrivalTimers].forEach(window.clearTimeout);
    arrivalAnims.forEach((a) => a.cancel());
    cancelFicheAnims();
    stopPreview();
    trace.destroy();
  };
}
