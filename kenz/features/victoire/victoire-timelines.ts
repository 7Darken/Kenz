/**
 * Les gestes de la séquence « 54 heures » (port de maquettes/v6/shared/victoire.js), communs aux deux modes :
 * le mur de post-it, le rôle en trois temps, le couloir d'arches et l'éclat, la couronne, le « 1re », le podium,
 * les tirages. Chaque `seq*` ajoute ses tweens à une timeline : `t0` (début) et `s` (échelle du temps :
 * unités de défilement en mode épinglé, secondes à l'entrée en mode « à la suite »).
 * Les éléments sont trouvés par leurs ancres `data-kv` (le style, lui, vit dans victoire.module.css).
 */
import { gsap } from "@/design-system/motion/gsap";

import { CROWN, DOORS, GAP, OURS, PERSPECTIVE, SPARKS, WALL } from "./victoire-geometry";

type El = HTMLElement;

/** Les éléments animés de la séquence. */
export interface VictoireRefs {
  root: El;
  stage: El;
  t1: El;
  t2: El;
  t3: El;
  temps: El[];
  clock: El;
  seps: El[];
  cols: El[];
  /** Les chiffres : le compteur épinglé, puis les trois petits compteurs (un par temps). */
  digits: { clock: El[]; minis: El[][] };
  /* 1 */
  titleWords: El[];
  date: El;
  crowdLines: [El[], El[], El[]];
  wall: El;
  postIts: El[];
  ours: El;
  others: El[];
  avatars: El[];
  otherAvatars: El[];
  ourAvatars: El[];
  beam: El;
  beamCone: El;
  /* 2 */
  steps: [El[], El[], El[], El[]];
  scene: El;
  sceneShadow: El;
  bar: El;
  view: El;
  desk: El;
  artboards: El[];
  guide: El;
  selection: El;
  panel: El;
  swatchOr: El;
  cursor: El;
  cursorIcon: Element;
  grow: El;
  growMock: El;
  shot: El;
  bubble: El;
  ear: Element;
  earPaths: Element[];
  k24: El;
  n24: El;
  r24: El;
  /* 3 */
  dayWords: El[];
  liveWords: El[];
  acts: El;
  uneGlyph: El;
  uneName: El;
  uneLabel: El;
  doorsBox: El;
  doors: El[];
  arch: El;
  archIn: El;
  archImg: El;
  halo: El;
  lum: El;
  ray: El;
  credit: El;
  shoots: El[];
  printTeam: El;
  printCheck: El;
  links: Element[];
  stars: El[];
  pod: El;
  p3: El;
  floor: El;
  blocks: El[];
  glint: El;
  flash: El;
  sparks: El[];
}

/** Rassemble les éléments par leurs ancres `data-kv` (et les mots `[data-kv-w]`). */
export function collect(root: El): VictoireRefs {
  const one = <T extends Element = El>(name: string) => {
    const el = root.querySelector<T>(`[data-kv="${name}"]`);
    if (!el) throw new Error(`victoire : élément « ${name} » introuvable`);
    return el;
  };
  const all = <T extends Element = El>(name: string, scope: Element = root) =>
    Array.from(scope.querySelectorAll<T>(`[data-kv="${name}"]`));
  const words = (scope: Element) => Array.from(scope.querySelectorAll<El>("[data-kv-w]"));
  const postIts = all("post-it");
  const ours = postIts[OURS];
  const avatars = all("avatar");
  const minis = all("mini");
  const clock = one("clock");
  return {
    root,
    stage: one("stage"),
    t1: one("t1"),
    t2: one("t2"),
    t3: one("t3"),
    temps: [one("t1"), one("t2"), one("t3")],
    clock,
    seps: all("sep", clock),
    cols: all("col"),
    digits: { clock: all("dg", clock), minis: minis.map((m) => all("dg", m)) },
    titleWords: words(one("title")),
    date: one("date"),
    crowdLines: [words(one("line-1")), words(one("line-2")), words(one("line-3"))],
    wall: one("wall"),
    postIts,
    ours,
    others: postIts.filter((p) => p !== ours),
    avatars,
    otherAvatars: avatars.filter((a) => !a.hasAttribute("data-ours")),
    ourAvatars: avatars.filter((a) => a.hasAttribute("data-ours")),
    beam: one("beam"),
    beamCone: one("beam-cone"),
    steps: [words(one("step-1")), words(one("step-2")), words(one("step-3")), words(one("step-4"))],
    scene: one("scene"),
    sceneShadow: one("scene-shadow"),
    bar: one("bar"),
    view: one("view"),
    desk: one("desk"),
    artboards: all("artboard"),
    guide: one("guide"),
    selection: one("selection"),
    panel: one("panel"),
    swatchOr: one("swatch-or"),
    cursor: one("cursor"),
    cursorIcon: one<SVGSVGElement>("cursor-icon"),
    grow: one("grow"),
    growMock: one("grow-mock"),
    shot: one("shot"),
    bubble: one("bubble"),
    ear: one<SVGSVGElement>("ear"),
    earPaths: Array.from(one<SVGSVGElement>("ear").querySelectorAll("path")),
    k24: one("k24"),
    n24: one("n24"),
    r24: one("r24"),
    dayWords: words(one("day")),
    liveWords: words(one("live")),
    acts: one("acts"),
    uneGlyph: one("une-glyph"),
    uneName: one("une-name"),
    uneLabel: one("une-label"),
    doorsBox: one("doors"),
    doors: all("door"),
    arch: one("arch"),
    archIn: one("arch-in"),
    archImg: one("arch-img"),
    halo: one("halo"),
    lum: one("lum"),
    ray: one("ray"),
    credit: one("credit"),
    shoots: all("shoot"),
    printTeam: one("print-team"),
    printCheck: one("print-check"),
    links: Array.from(one<SVGSVGElement>("links").querySelectorAll("line")),
    // Les étoiles s'allument dans l'ordre de leur rang (k), pas dans l'ordre du DOM.
    stars: all("star")
      .map((el, n) => ({ el, k: CROWN.stars[n]?.k ?? n }))
      .sort((a, b) => a.k - b.k)
      .map((o) => o.el),
    pod: one("pod"),
    p3: one("p3"),
    floor: one("floor"),
    blocks: ["block-3", "block-2", "block-1"].map((name) => one(name)),
    glint: one("glint"),
    flash: one("flash"),
    sparks: all("spark"),
  };
}

/* ---------- Le compteur ---------- */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** « HHMMSS » (6 chiffres), arrondi à la seconde supérieure. */
export function clockDigits(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds - 1e-6));
  return pad(Math.floor(s / 3600)) + pad(Math.floor((s % 3600) / 60)) + pad(s % 60);
}

/** Met à jour un ou plusieurs compteurs (6 chiffres chacun), seulement là où un chiffre change. */
export function setClock(groups: El[][], seconds: number) {
  const str = clockDigits(seconds);
  for (const digits of groups) {
    for (let x = 0; x < 6; x++) {
      const dg = digits[x];
      const text = dg?.firstChild;
      if (!dg || !text || text.nodeValue === str[x]) continue;
      text.nodeValue = str[x];
      // Le zéro de Melodrama est large : sa case est resserrée.
      dg.parentElement?.toggleAttribute("data-z", str[x] === "0");
    }
  }
}

/* ---------- Le couloir d'arches : la caméra avance de 0 (entrée) à 1 (devant le cadre de la photo) ---------- */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function corridor(R: VictoireRefs, p: number) {
  const cam = p * DOORS * GAP;
  for (let i = 0; i <= DOORS; i++) {
    const el = i < DOORS ? R.doors[i] : R.arch;
    if (!el) continue;
    const z = cam - i * GAP;
    const s = PERSPECTIVE / (PERSPECTIVE - Math.min(z, PERSPECTIVE * 0.92));
    let o = clamp01((s - 0.16) / 0.22);
    if (z > 0) o *= 1 - clamp01(z / (PERSPECTIVE * 0.42));
    el.style.transform = `scale(${s.toFixed(4)})`;
    if (i < DOORS) el.style.opacity = o.toFixed(3);
  }
}

/** État final : les arches traversées, le cadre à sa place. */
export function corridorEnd(R: VictoireRefs) {
  R.doors.forEach((d) => {
    d.style.opacity = "0";
    d.style.transform = "";
  });
  R.arch.style.transform = "";
}

/**
 * La photo (1200 × 800) dans l'arche : centrée sur les deux qui célèbrent, à peine au-delà de la couverture
 * minimale, jamais agrandie au-delà de sa taille réelle ; le bas coupé au-dessus du filigrane.
 */
export function frame(R: VictoireRefs, photo: PhotoFrame) {
  const bw = R.archIn.offsetWidth;
  const bh = R.archIn.offsetHeight;
  if (!bw || !bh) return;
  const s = Math.min(1, Math.max(bw / photo.width, bh / photo.height, bh / (photo.height * photo.watermarkFrom)));
  const w = photo.width * s;
  const h = photo.height * s;
  const l = Math.min(0, Math.max(bw - w, bw * 0.5 - photo.focusX * w));
  const t = Math.min(0, Math.max(bh - h, bh * 0.42 - photo.focusY * h));
  Object.assign(R.archImg.style, {
    width: `${w.toFixed(1)}px`,
    height: `${h.toFixed(1)}px`,
    left: `${l.toFixed(1)}px`,
    top: `${t.toFixed(1)}px`,
  });
}

/** La photo de l'arche : sa taille réelle, le point à garder au centre (0 à 1) et le début du filigrane (0 à 1). */
export interface PhotoFrame {
  width: number;
  height: number;
  focusX: number;
  focusY: number;
  watermarkFrom: number;
}

/** La géométrie du projecteur : son angle vers notre post-it et sa longueur. */
export interface BeamGeometry {
  ww: number;
  wh: number;
  a: number;
  l: number;
}

export function measureBeam(R: VictoireRefs, g: BeamGeometry) {
  const w = R.wall.offsetWidth;
  const h = R.wall.offsetHeight;
  if (!w || !h) return;
  const px = w * 0.5;
  const py = -h * 0.34;
  const ours = WALL.postIts[OURS];
  const dx = (w * ours.x) / 100 - px;
  const dy = (h * ours.y) / 100 - py;
  g.ww = w;
  g.wh = h;
  g.a = (-Math.atan2(dx, dy) * 180) / Math.PI;
  g.l = Math.hypot(dx, dy);
  R.beamCone.style.height = `${(g.l + w * 0.06).toFixed(1)}px`;
  R.beam.style.setProperty("--kv-bw", `${(w * 0.26).toFixed(1)}px`);
}

/* ---------- Le temps 1 : le mur de post-it, les équipes, le projecteur ---------- */
export function seqWall(tl: gsap.core.Timeline, R: VictoireRefs, t0: number, s: number, g: () => BeamGeometry) {
  const T = (u: number) => t0 + u * s;
  const wordIn = (els: El[], at: number) =>
    tl.fromTo(els, { opacity: 0, y: 18, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.38 * s, stagger: 0.045 * s, ease: "power2.out" }, at);
  const wordOut = (els: El[], at: number) => tl.to(els, { opacity: 0, y: -12, duration: 0.16 * s, ease: "power2.in" }, at);
  const order = R.postIts.slice().sort((a, b) => (WALL.postIts[R.postIts.indexOf(a)]?.order ?? 0) - (WALL.postIts[R.postIts.indexOf(b)]?.order ?? 0));

  // Vendredi soir : des dizaines d'idées.
  wordIn(R.crowdLines[0], T(0));
  tl.fromTo(order, { opacity: 0, scale: 0.6, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.3 * s, stagger: 0.022 * s, ease: "power3.out" }, T(0.04));
  // Des équipes se forment.
  wordOut(R.crowdLines[0], T(0.86));
  wordIn(R.crowdLines[1], T(0.92));
  tl.fromTo(
    R.avatars,
    {
      opacity: 0,
      scale: 0.5,
      x: (n: number) => (((WALL.avatars[n]?.x0 ?? 0) - (WALL.avatars[n]?.x ?? 0)) / 100) * g().ww,
      y: (n: number) => (((WALL.avatars[n]?.y0 ?? 0) - (WALL.avatars[n]?.y ?? 0)) / 100) * g().wh,
    },
    { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.42 * s, stagger: 0.012 * s, ease: "power3.inOut" },
    T(0.9),
  );
  // Dimanche, le jury en choisit une : le projecteur balaie le mur et s'arrête sur le nôtre.
  wordOut(R.crowdLines[1], T(1.62));
  wordIn(R.crowdLines[2], T(1.68));
  tl.set(R.beam, { rotation: () => g().a - 40 }, T(1.6))
    .fromTo(R.beam, { opacity: 0 }, { opacity: 1, duration: 0.14 * s }, T(1.6))
    .to(
      R.beam,
      {
        keyframes: [
          { rotation: () => g().a + 26, duration: 0.36 * s, ease: "power1.inOut" },
          { rotation: () => g().a, duration: 0.26 * s, ease: "power2.out" },
        ],
      },
      T(1.62),
    )
    .to(R.others, { opacity: 0.26, duration: 0.3 * s, stagger: { each: 0.006 * s, from: "random" } }, T(1.86))
    .to(R.otherAvatars, { opacity: 0.28, duration: 0.3 * s }, T(1.9))
    .fromTo(R.ours, { "--kv-on": 0 }, { "--kv-on": 1, duration: 0.24 * s }, T(2.14))
    .fromTo(R.ours, { scale: 1 }, { scale: 1.7, duration: 0.3 * s, ease: "power3.out" }, T(2.14))
    .to(R.ourAvatars, { y: () => g().wh * 0.085, duration: 0.3 * s, ease: "power3.out" }, T(2.14));
  return T(2.45);
}

/* ---------- Le temps 2 : écouter, concevoir, développer ---------- */
export function seqRole(tl: gsap.core.Timeline, R: VictoireRefs, t0: number, s: number, onHours: (h: number) => void) {
  const T = (u: number) => t0 + u * s;
  const wordIn = (els: El[], at: number) =>
    tl.fromTo(els, { opacity: 0, y: 18, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 * s, stagger: 0.05 * s, ease: "power2.out" }, at);
  const wordOut = (els: El[], at: number) => tl.to(els, { opacity: 0, y: -12, duration: 0.18 * s, ease: "power2.in" }, at);

  // J'écoute la cliente.
  tl.fromTo(R.bubble, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.45 * s, ease: "power3.out" }, T(0))
    .fromTo(R.earPaths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 * s, stagger: 0.08 * s, ease: "power3.inOut" }, T(0.25))
    .fromTo(R.ear, { opacity: 0 }, { opacity: 1, duration: 0.1 * s }, T(0.25));
  wordIn(R.steps[0], T(0.2));
  // Je conçois : la bulle devient la table de travail ; le curseur sélectionne l'accueil.
  wordOut(R.steps[0], T(1.35));
  wordIn(R.steps[1], T(1.45));
  tl.to(R.bubble, { opacity: 0, scale: 1.12, duration: 0.25 * s, ease: "power2.in" }, T(1.35))
    .fromTo(
      R.desk,
      { opacity: 0, clipPath: "inset(26% 10% 26% 10% round 28px)" },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 0.45 * s, ease: "power3.inOut" },
      T(1.38),
    )
    .fromTo(R.artboards, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.32 * s, stagger: 0.08 * s, ease: "power2.out" }, T(1.58))
    .fromTo(R.panel, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.3 * s, ease: "power2.out" }, T(1.7))
    .fromTo(R.cursor, { opacity: 0, xPercent: 62, yPercent: 86 }, { opacity: 1, duration: 0.1 * s }, T(1.88))
    .to(R.cursor, { xPercent: 16, yPercent: 52, duration: 0.42 * s, ease: "power2.inOut" }, T(1.92))
    .fromTo(R.cursorIcon, { scale: 1 }, { scale: 0.8, duration: 0.07 * s, yoyo: true, repeat: 1, ease: "power1.inOut" }, T(2.34))
    .fromTo(R.selection, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.18 * s, ease: "power2.out" }, T(2.38))
    .fromTo(R.guide, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.28 * s, ease: "power2.out" }, T(2.5))
    .fromTo(R.swatchOr, { "--kv-on": 0 }, { "--kv-on": 1, duration: 0.2 * s }, T(2.62))
    .to(R.cursor, { opacity: 0, duration: 0.12 * s }, T(2.95));
  // Je développe : la maquette choisie s'ouvre et devient la vraie plateforme ; un « 24 h » file.
  wordOut(R.steps[1], T(3.05));
  wordIn(R.steps[2], T(3.15));
  const hours = { h: 0 };
  tl.fromTo(R.bar, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.25 * s, ease: "power2.out" }, T(3.05))
    .fromTo(
      R.grow,
      { opacity: 0, clipPath: "inset(20% 74.36% 12% 6% round 6px)" },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 0.5 * s, ease: "power3.inOut", immediateRender: true },
      T(3.08),
    )
    .fromTo(R.growMock, { opacity: 1 }, { opacity: 0, duration: 0.25 * s }, T(3.3))
    .fromTo(R.shot, { opacity: 0 }, { opacity: 1, duration: 0.3 * s, ease: "power2.out" }, T(3.26))
    .to([R.selection, R.guide, R.panel], { opacity: 0, duration: 0.15 * s }, T(3.06))
    .to(R.desk, { opacity: 0, duration: 0.2 * s }, T(3.45))
    .fromTo(R.sceneShadow, { opacity: 0 }, { opacity: 1, duration: 0.3 * s }, T(3.1))
    .fromTo(R.k24, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 * s, ease: "power2.out" }, T(3.1))
    .fromTo(hours, { h: 0 }, { h: 24, duration: 0.9 * s, ease: "power1.inOut", onUpdate: () => onHours(Math.round(hours.h)) }, T(3.15))
    .fromTo(R.r24, { scaleX: 0 }, { scaleX: 1, duration: 0.9 * s, ease: "power1.inOut" }, T(3.15));
  // La synthèse.
  wordOut(R.steps[2], T(4.25));
  wordIn(R.steps[3], T(4.35));
  return T(5);
}

/* ---------- Le temps 3 : le couloir, puis l'éclat et la photo dans l'arche ----------
   Renvoie l'instant du zéro ; `sparkScale()` : la portée des éclats (selon la largeur de la scène). */
export function seqCorridor(tl: gsap.core.Timeline, R: VictoireRefs, t0: number, d: number, sparkScale: () => number) {
  const cam = { p: 0 };
  tl.fromTo(R.doorsBox, { opacity: 0 }, { opacity: 1, duration: 0.2 * d }, t0)
    .fromTo(R.arch, { opacity: 0 }, { opacity: 1, duration: 0.2 * d }, t0)
    .fromTo(cam, { p: 0 }, { p: 1, duration: d, ease: "power2.inOut", onUpdate: () => corridor(R, cam.p) }, t0)
    .fromTo(R.lum, { opacity: 0.25 }, { opacity: 1, duration: d * 0.9, ease: "power2.in" }, t0);
  const tZ = t0 + d;
  tl.fromTo(R.flash, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, tZ)
    .to(R.flash, { opacity: 0, scale: 1.5, duration: 0.5, ease: "power1.out" }, tZ + 0.12)
    .fromTo(R.archIn, { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", duration: 0.45, ease: "power2.out" }, tZ + 0.03)
    .to(R.lum, { opacity: 0, duration: 0.3 }, tZ + 0.2)
    .fromTo(R.halo, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, tZ + 0.05)
    .to(R.doorsBox, { opacity: 0, duration: 0.1 }, tZ + 0.05);
  R.sparks.forEach((spark, n) => {
    const { dx, dy } = SPARKS[n] ?? { dx: 0, dy: 0 };
    tl.fromTo(spark, { x: 0, y: 0, scale: 1 }, { x: () => dx * sparkScale(), y: () => dy * sparkScale(), scale: 0.3, duration: 0.7, ease: "power3.out" }, tZ + 0.02)
      .fromTo(spark, { opacity: 0 }, { opacity: 1, duration: 0.08 }, tZ + 0.02)
      .to(spark, { opacity: 0, duration: 0.35 }, tZ + 0.3);
  });
  return tZ;
}

/** Le moment triomphant : le rayon derrière les bras levés, les étoiles une à une, les fils, les étoiles filantes. */
export function seqTriumph(tl: gsap.core.Timeline, R: VictoireRefs, tZ: number, s: number) {
  tl.fromTo(R.ray, { opacity: 0, scaleY: 0.55 }, { opacity: 0.9, scaleY: 1, duration: 0.38 * s, ease: "power2.out" }, tZ + 0.12 * s)
    .to(R.ray, { opacity: 0.32, duration: 0.7 * s, ease: "power1.inOut" }, tZ + 0.55 * s)
    .fromTo(R.credit, { opacity: 0 }, { opacity: 1, duration: 0.3 * s }, tZ + 0.6 * s)
    .fromTo(R.stars, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.24 * s, stagger: 0.032 * s, ease: "power3.out" }, tZ + 0.22 * s)
    .fromTo(R.links, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.26 * s, stagger: 0.024 * s, ease: "power1.inOut" }, tZ + 0.52 * s);
  R.shoots.forEach((shoot, n) => {
    const at = tZ + (0.7 + n * 0.16) * s;
    tl.set(shoot, { opacity: 0, x: 0, y: 0 }, at - 0.001).to(
      shoot,
      {
        keyframes: [
          { opacity: 1, x: 40, y: -30, duration: 0.12 * s, ease: "none" },
          { opacity: 0, x: 190, y: -150, duration: 0.42 * s, ease: "power2.out" },
        ],
      },
      at,
    );
  });
}

/** Le « 1re » or se lève, puis le nom du projet et sa mention. */
export function seqFirst(tl: gsap.core.Timeline, R: VictoireRefs, at: number, s: number) {
  tl.fromTo(R.uneGlyph, { opacity: 0, y: 60, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45 * s, ease: "power3.out" }, at).fromTo(
    [R.uneName, R.uneLabel],
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.3 * s, stagger: 0.1 * s, ease: "power2.out" },
    at + 0.26 * s,
  );
}

/** Le podium s'assemble (le 1 en dernier, un éclat doré sur le dessus). */
export function seqPodium(tl: gsap.core.Timeline, R: VictoireRefs, tZ: number, s: number) {
  tl.fromTo(R.pod, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 * s }, tZ + 0.36 * s)
    .fromTo(R.floor, { opacity: 0 }, { opacity: 1, duration: 0.3 * s }, tZ + 0.35 * s)
    .fromTo(R.blocks, { scaleY: 0.001 }, { scaleY: 1, duration: 0.42 * s, stagger: 0.16 * s, ease: "power3.out" }, tZ + 0.42 * s)
    .fromTo(R.glint, { xPercent: -120 }, { xPercent: 120, duration: 0.4 * s, ease: "power1.inOut" }, tZ + 1.0 * s);
}

/** Les deux petits tirages se posent sur le bord du cadre, après la couronne. */
export function seqPrints(tl: gsap.core.Timeline, R: VictoireRefs, at: number, s: number) {
  tl.fromTo(R.printTeam, { opacity: 0, y: 70, rotation: 14, scale: 0.965 }, { opacity: 1, y: 0, rotation: 5, scale: 1, duration: 0.45 * s, ease: "power3.out" }, at).fromTo(
    R.printCheck,
    { opacity: 0, y: 80, rotation: -12, scale: 0.965 },
    { opacity: 1, y: 0, rotation: -4, scale: 1, duration: 0.45 * s, ease: "power3.out" },
    at + 0.14 * s,
  );
}

/** Le podium suit le pointeur (± 10°), à la souris seulement. Renvoie le nettoyage. */
export function tilt(R: VictoireRefs, zone: El) {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduced.matches) return () => {};
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    R.p3.style.setProperty("--ry", `${(cx * 10).toFixed(2)}deg`);
    R.p3.style.setProperty("--rx", `${(-cy * 6).toFixed(2)}deg`);
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
  };
  const move = (e: PointerEvent) => {
    const r = zone.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const out = () => {
    tx = 0;
    ty = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  };
  zone.addEventListener("pointermove", move);
  zone.addEventListener("pointerleave", out);
  return () => {
    zone.removeEventListener("pointermove", move);
    zone.removeEventListener("pointerleave", out);
    if (raf) cancelAnimationFrame(raf);
    R.p3.style.removeProperty("--ry");
    R.p3.style.removeProperty("--rx");
  };
}
