/**
 * La Terre : une bille de cristal en 3D (three.js), posée dans un calque fixe. Portage de maquettes/v6/shared/terre.js
 * (style « verre », le seul retenu). Textures de la NASA locales (/assets/terre), en variantes de 2048 px sur mobile.
 *
 * Une instance = un canevas WebGL. Le calque est l'hôte : l'instance y ajoute l'ombre portée, le canevas, ou l'image de
 * repli (sans WebGL, contexte perdu, texture illisible, ou mouvement réduit). L'API reste la même en repli : `frame()`
 * déplace l'image ; `aim()`, `arc()`, `light()` ne font rien.
 *
 * Performance : DPR ≤ 1,5 ; une seule boucle, en pause hors écran (IntersectionObserver sur `observe`), onglet caché,
 * calque à 0 ou cadre absent. `destroy()` libère tout (géométries, matériaux, textures, contexte WebGL).
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CustomBlending,
  DataTexture,
  Group,
  Mesh,
  NormalBlending,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PerspectiveCamera,
  Points,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  ZeroFactor,
  type IUniform,
  type Texture,
} from "three";

import type { EscaleId } from "@/content/series";
import {
  FRAG_ARC,
  FRAG_GLOW,
  FRAG_HEAD,
  FRAG_INNER,
  FRAG_POINTS,
  FRAG_SHELL,
  VERT_ARC,
  VERT_HEAD,
  VERT_INNER,
  VERT_POINTS,
  VERT_SHELL,
} from "./shaders";
import { arcCurve, buildEmission, buildInnerGeometry, latLonToVector, loadCanvas, type LatLon } from "./world";

export type { LatLon };
export type GlobeTheme = "day" | "night";
export type GlobeMode = "3d" | "fallback";

/** Le globe à l'écran : centre et rayon apparent, en px CSS. */
export interface GlobeFrame {
  x: number;
  y: number;
  r: number;
}

/** Une escale : un point (la prochaine : un anneau en pointillé). */
export interface GlobePoint extends LatLon {
  id: string;
  upcoming?: boolean;
}

export interface GlobeArc {
  /** 0 → 1 : la part tracée ; une tête lumineuse avance avec elle (`immediate` : sans lissage). */
  trace(progress: number, immediate?: boolean): GlobeArc;
  /** Le trajet en cours (lumineux) ou déjà parcouru (atténué). */
  vivid(on: boolean, immediate?: boolean): GlobeArc;
}

export interface GlobeClassNames {
  floor: string;
  shadow: string;
  caustic: string;
  canvas: string;
  fallback: string;
}

export interface GlobeOptions {
  points: readonly GlobePoint[];
  /** Le point face à nous au départ. */
  view: LatLon;
  /** Rotation lente, en degrés par seconde (0 : aucune). */
  drift: number;
  theme: GlobeTheme;
  /** Mouvement réduit : l'image de repli. */
  reduced: boolean;
  /** On arrive de l'espace (la plongée depuis Pro) : la descente finit ici. */
  plunge: boolean;
  /** Rendu seulement si l'un d'eux est à l'écran. */
  observe: readonly Element[];
  classNames: GlobeClassNames;
  /** Premier rendu (textures prêtes, ou image de repli posée). */
  onReady: (mode: GlobeMode) => void;
}

export interface Globe {
  readonly mode: GlobeMode;
  /** Place le globe (suivi lissé). `jump` : posé tout de suite (sous un fondu) ; `follow` : le déplacement de la cible
   *  est appliqué tel quel (le globe suit la page sans retard), le reste de l'écart reste lissé. */
  frame(frame: GlobeFrame, options?: { jump?: boolean; follow?: boolean }): void;
  /** Le point face à nous (suivi lissé : pour un trajet piloté au défilement). */
  orient(lat: number, lon: number): void;
  /** Tourne vers ce point en `duration` s (0 : tout de suite). */
  aim(lat: number, lon: number, duration?: number): void;
  /** Le point face à nous en ce moment. */
  view(): LatLon;
  /** Vitesse de la rotation lente (°/s) ; 0 l'arrête. */
  drift(speed: number): void;
  /** Un trajet entre deux escales (un objet sans effet en repli). */
  arc(id: string, from: LatLon, to: LatLon, dashed?: boolean): GlobeArc;
  /** Le pays actif (plus gros point, une onde, son néon plus vif) ; null : aucun. */
  light(id: string | null): void;
  /** Montre ou masque les points des escales (tout de suite). */
  showPoints(on: boolean): void;
  /** Fondu du calque (0 → 1) ; à 0, le rendu s'arrête. */
  opacity(value: number): void;
  setTheme(theme: GlobeTheme): void;
  destroy(): void;
}

/** Les textures maîtres (4096 px) et leurs variantes de 2048 px pour mobile : on ne télécharge que ce qui sert. */
const TEX = {
  mask: { full: "/assets/terre/terre-masque.webp", small: "/assets/terre/terre-masque-2048.webp" },
  day: { full: "/assets/terre/earth-blue-marble.jpg", small: "/assets/terre/earth-blue-marble-2048.jpg" },
  relief: "/assets/terre/earth-topology.png",
  fallbackDay: "/assets/terre/globe-jour.webp",
  fallbackNight: "/assets/terre/globe-nuit.webp",
} as const;

const DISC = 0.42; /* image de repli : rayon du disque / côté de l'image */
const FOV = 30;
const RAD = Math.PI / 180;
/** La lumière des gravures, en haut à gauche (repère de la caméra). */
const SUN = new Vector3(-0.5, 0.5, 0.71).normalize();

type Rgb = readonly [number, number, number];
/** Le fil d'or posé sur la coque, l'escale en petit point d'or : la nuit, puis le jour. */
const PALETTE = {
  point: [[1, 0.84, 0.52], [0.86, 0.58, 0.2]],
  core: [[1, 0.97, 0.88], [1, 0.86, 0.56]],
  arc: [[1, 0.8, 0.44], [0.88, 0.58, 0.2]],
  room: [[0.035, 0.05, 0.062], [0.955, 0.937, 0.905]],
} as const satisfies Record<string, readonly [Rgb, Rgb]>;

/** Les pays filmés : centre (lat, lon) et rayon (°) du cercle qui s'allume plus fort quand leur escale est active. */
const COUNTRY_GLOW: Partial<Record<EscaleId, readonly [number, number, number]>> = {
  chine: [34, 104, 19],
  japon: [36.5, 138, 9],
  coree: [36.3, 127.8, 3.6],
  malaisie: [3.6, 108, 9],
  "hong-kong": [22.35, 114.15, 1.4],
  taiwan: [23.7, 121, 2.4],
  emirats: [24, 54, 3.4],
  suisse: [46.8, 8.2, 2.2],
  islande: [64.9, -18.6, 4.6],
};

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const n180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix3 = (a: Rgb, b: Rgb, k: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type Uniforms = Record<string, IUniform>;

interface ArcState {
  api: GlobeArc;
  step: () => void;
  color: () => void;
  dispose: () => void;
}

export function createGlobe(host: HTMLElement, options: GlobeOptions): Globe {
  const small = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const cls = options.classNames;
  let mode: GlobeMode = !options.reduced && webglAvailable() ? "3d" : "fallback";

  const S = {
    theme: options.theme,
    day: options.theme === "day" ? 1 : 0,
    dayTarget: options.theme === "day" ? 1 : 0,
    view: { lat: options.view.lat, lon: options.view.lon },
    target: { lat: options.view.lat, lon: options.view.lon },
    tween: null as null | { from: LatLon; to: LatLon; ms: number; t0: number },
    drift: options.drift,
    frame: null as GlobeFrame | null,
    frameTarget: null as GlobeFrame | null,
    descent: options.plunge && !options.reduced ? { t0: 0 } : null,
    opacity: 1,
    visible: 0,
    raf: 0,
    last: 0,
    time: 0,
    ready: false,
    dead: false,
    texturesOk: false,
    W: 0,
    H: 0,
    activeK: 0,
    activeTarget: 0,
    activeId: null as string | null,
    pointsHidden: false,
    maskWidth: 4096,
  };

  /* ---------- L'ombre portée douce et la caustique, sous la sphère (seulement quand elle est entière à l'écran) ---------- */
  const floor = document.createElement("div");
  floor.className = cls.floor;
  floor.innerHTML = `<i class="${cls.shadow}"></i><i class="${cls.caustic}"></i>`;
  host.appendChild(floor);
  function placeFloor(c: GlobeFrame) {
    const h = S.H || window.innerHeight;
    const seen = clamp((h - (c.y + c.r * 1.06)) / (h * 0.05), 0, 1);
    floor.style.opacity = seen.toFixed(3);
    if (seen <= 0) return;
    const w = c.r * 2.3;
    const fh = c.r * 0.42;
    floor.style.width = `${w.toFixed(1)}px`;
    floor.style.height = `${fh.toFixed(1)}px`;
    floor.style.transform = `translate3d(${(c.x - w / 2 + c.r * 0.16).toFixed(1)}px,${(c.y + c.r * 0.9).toFixed(1)}px,0)`;
  }

  function signalReady() {
    if (S.ready) return;
    S.ready = true;
    options.onReady(mode);
  }

  /* ---------- Le repli : une image fixe ronde, le même halo ---------- */
  let fallback: HTMLImageElement | null = null;
  function placeFallback() {
    if (!fallback || !S.frameTarget) return;
    const c = S.frameTarget;
    const side = c.r / DISC;
    placeFloor(c);
    fallback.style.width = fallback.style.height = `${side.toFixed(1)}px`;
    fallback.style.transform = `translate3d(${(c.x - side / 2).toFixed(1)}px,${(c.y - side / 2).toFixed(1)}px,0)`;
  }
  function showFallback() {
    if (fallback) return;
    fallback = document.createElement("img");
    fallback.className = cls.fallback;
    fallback.alt = "";
    fallback.decoding = "async";
    fallback.draggable = false;
    fallback.src = S.theme === "day" ? TEX.fallbackDay : TEX.fallbackNight;
    host.appendChild(fallback);
    if (fallback.complete) signalReady();
    else fallback.onload = fallback.onerror = signalReady;
    placeFallback();
  }

  /* ---------- La scène ---------- */
  let renderer: WebGLRenderer | null = null;
  let scene: Scene | null = null;
  let camera: PerspectiveCamera | null = null;
  let group: Group | null = null;
  let shell: Mesh | null = null;
  let inner: Mesh | null = null;
  let glow: Mesh | null = null;
  let points: Points | null = null;
  let pointIds: string[] = [];
  const textures: Texture[] = [];
  const arcs = new Map<string, ArcState>();
  let uShell: Uniforms = {};
  let uPoints: Uniforms = {};
  const headUniforms = { uDpr: { value: dpr }, uTaille: { value: 9 } };

  function toFallback() {
    mode = "fallback";
    stop();
    disposeScene();
    showFallback();
  }

  function build(): boolean {
    const canvas = document.createElement("canvas");
    canvas.className = cls.canvas;
    host.appendChild(canvas);
    try {
      renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: "high-performance" });
    } catch {
      canvas.remove();
      return false;
    }
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    /* un contexte perdu en cours de route (pas celui que `destroy()` libère) : l'image de repli prend le relais */
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      if (!S.dead) toFallback();
    });
    scene = new Scene();
    camera = new PerspectiveCamera(FOV, 1, 0.01, 200);
    group = new Group();
    scene.add(group);

    const empty = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, RGBAFormat);
    empty.needsUpdate = true;
    textures.push(empty);
    uShell = {
      uFond: { value: new Vector3() },
      uJour: { value: S.day },
      uSoleil: { value: SUN },
      uMasque: { value: empty },
      uTexJ: { value: empty },
      uLod: { value: 0 },
      uTemps: { value: 0 },
      uEmi: { value: empty },
      uActif: { value: new Vector3(0, 0, 1) },
      uActifCos: { value: new Vector2(1, 1) },
      uActifK: { value: 0 },
      uZoom: { value: 0 },
    };
    const seg = small ? [96, 64] : [160, 112];
    /* la coque de verre (transparente) ; le monde intérieur et la lueur viendront avec le masque */
    shell = new Mesh(
      new SphereGeometry(1, seg[0], seg[1]),
      new ShaderMaterial({
        uniforms: uShell,
        vertexShader: VERT_SHELL,
        fragmentShader: FRAG_SHELL,
        transparent: true,
        depthWrite: false,
        blending: CustomBlending,
        blendSrc: OneFactor,
        blendDst: OneMinusSrcAlphaFactor,
      }),
    );
    shell.renderOrder = 2;
    group.add(shell);

    uPoints = {
      uDpr: { value: dpr },
      uActif: { value: -1 },
      uEchelle: { value: 1 },
      uTemps: { value: 0 },
      uCouleur: { value: new Vector3() },
      uCoeur: { value: new Vector3() },
    };
    buildPoints(options.points);
    colors();
    return true;
  }

  function buildPoints(list: readonly GlobePoint[]) {
    if (!group) return;
    const n = list.length;
    const pos = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const state = new Float32Array(n);
    const ids = new Float32Array(n);
    pointIds = [];
    list.forEach((p, i) => {
      const v = latLonToVector(p.lat, p.lon, 1.004);
      pos.set([v.x, v.y, v.z], i * 3);
      size[i] = p.upcoming ? 18 : 8;
      state[i] = p.upcoming ? 1 : 0;
      ids[i] = i;
      pointIds.push(p.id);
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(pos, 3));
    geometry.setAttribute("aTaille", new BufferAttribute(size, 1));
    geometry.setAttribute("aEtat", new BufferAttribute(state, 1));
    geometry.setAttribute("aId", new BufferAttribute(ids, 1));
    points = new Points(
      geometry,
      new ShaderMaterial({ uniforms: uPoints, vertexShader: VERT_POINTS, fragmentShader: FRAG_POINTS, transparent: true, depthWrite: false }),
    );
    points.renderOrder = 3;
    points.visible = !S.pointsHidden;
    group.add(points);
  }

  /** Le monde intérieur et la lueur des néons, une fois le masque chargé. */
  function buildInner(mask: HTMLCanvasElement, relief: HTMLCanvasElement | null) {
    if (!group || !renderer || !shell) return;
    const emission = buildEmission(mask, small, renderer.capabilities.getMaxAnisotropy());
    textures.push(emission);
    uShell.uEmi.value = emission;
    inner = new Mesh(
      buildInnerGeometry(mask, relief, small),
      new ShaderMaterial({ uniforms: uShell, vertexShader: VERT_INNER, fragmentShader: FRAG_INNER }),
    );
    inner.renderOrder = 0;
    group.add(inner);
    /* additif sur la couleur seulement : l'alpha du canevas ne bouge pas (sinon un anneau noir sur la crème, au clair) */
    glow = new Mesh(
      new SphereGeometry(0.95, 128, 64),
      new ShaderMaterial({
        uniforms: uShell,
        vertexShader: VERT_SHELL,
        fragmentShader: FRAG_GLOW,
        transparent: true,
        depthWrite: false,
        blending: CustomBlending,
        blendSrc: OneFactor,
        blendDst: OneFactor,
        blendSrcAlpha: ZeroFactor,
        blendDstAlpha: OneFactor,
      }),
    );
    glow.renderOrder = 1;
    group.add(glow);
  }

  /** Les couleurs suivent le mode (fondu nuit ↔ jour). */
  function colors() {
    if (mode !== "3d" || !renderer) return;
    const j = S.day;
    (uShell.uFond.value as Vector3).fromArray(mix3(PALETTE.room[0], PALETTE.room[1], j));
    uShell.uJour.value = j;
    (uPoints.uCouleur.value as Vector3).fromArray(mix3(PALETTE.point[0], PALETTE.point[1], j));
    (uPoints.uCoeur.value as Vector3).fromArray(mix3(PALETTE.core[0], PALETTE.core[1], j));
    arcs.forEach((arc) => arc.color());
  }

  function makeTexture(canvas: HTMLCanvasElement, anisotropy: number): CanvasTexture {
    const texture = new CanvasTexture(canvas);
    texture.anisotropy = Math.min(anisotropy, renderer ? renderer.capabilities.getMaxAnisotropy() : 1);
    texture.wrapS = RepeatWrapping;
    textures.push(texture);
    return texture;
  }

  /** Le masque (terre / mer, pays filmés), le relief (calculé une fois, pas de texture) et le jour (la couleur). */
  async function loadTextures() {
    const [max, size] = small ? ([2048, "small"] as const) : ([4096, "full"] as const);
    const [mask, relief, day] = await Promise.all([
      loadCanvas(TEX.mask[size], max),
      loadCanvas(TEX.relief, 2048),
      loadCanvas(TEX.day[size], max),
    ]);
    if (S.dead || mode !== "3d") return;
    uShell.uMasque.value = makeTexture(mask, 4);
    uShell.uTexJ.value = makeTexture(day, 8);
    S.maskWidth = mask.width;
    buildInner(mask, relief);
    colors();
    S.texturesOk = true;
    resume();
  }

  /* ---------- Le cadre : la caméra, et le décalage de l'objectif pour placer le globe ---------- */
  function measure() {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    if (w === S.W && h === S.H) return;
    S.W = w;
    S.H = h;
    renderer?.setSize(w, h, false);
  }
  /** L'arrivée de la plongée : on est encore tout près, l'horizon au-dessus de l'écran ; il redescend. */
  function approach(c: GlobeFrame): GlobeFrame {
    const r = c.r * 1.5;
    return { x: c.x, y: r - S.H * 0.25, r };
  }
  function applyCamera(c: GlobeFrame) {
    if (!camera) return;
    const q = S.H / (2 * Math.max(1, c.r) * Math.tan((FOV / 2) * RAD));
    const d = Math.sqrt(1 + q * q);
    camera.position.set(0, 0, d);
    camera.near = Math.max(0.002, (d - 1) * 0.5);
    camera.far = d + 60;
    camera.aspect = S.W / S.H;
    camera.setViewOffset(S.W, S.H, S.W / 2 - c.x, S.H / 2 - c.y, S.W, S.H);
    camera.updateProjectionMatrix();
    uPoints.uEchelle.value = clamp(c.r / 300, 0.62, 1.25);
  }

  /* ---------- La boucle (unique, en pause hors écran) ---------- */
  const alive = () =>
    !S.dead && mode === "3d" && S.texturesOk && S.opacity > 0.01 && S.visible > 0 && !document.hidden;
  function resume() {
    if (!S.raf && alive() && S.frameTarget) {
      S.last = 0;
      S.raf = requestAnimationFrame(loop);
    }
  }
  function stop() {
    if (S.raf) cancelAnimationFrame(S.raf);
    S.raf = 0;
  }
  function loop(t: number) {
    S.raf = 0;
    if (!alive() || !renderer || !scene || !camera || !group || !S.frameTarget) return;
    const dt = S.last ? Math.min(0.05, (t - S.last) / 1000) : 0.016;
    S.last = t;
    S.time += dt;
    measure();
    const k = 1 - Math.exp(-dt * 9);

    /* La rotation : le tour programmé, sinon la cible (et la dérive lente) */
    if (S.tween) {
      const w = S.tween;
      if (!w.t0) w.t0 = t;
      const p = Math.min(1, (t - w.t0) / w.ms);
      const e = easeInOut(p);
      S.view.lat = w.from.lat + (w.to.lat - w.from.lat) * e;
      S.view.lon = w.from.lon + n180(w.to.lon - w.from.lon) * e;
      if (p >= 1) {
        S.tween = null;
        S.target = { lat: w.to.lat, lon: w.to.lon };
      }
    } else {
      if (S.drift) S.target.lon -= S.drift * dt;
      S.view.lat += (S.target.lat - S.view.lat) * k;
      S.view.lon += n180(S.target.lon - S.view.lon) * k;
    }

    /* Le cadre, lissé ; la descente de l'arrivée s'y mêle (une courbe douce sur 3,4 s) */
    const c = S.frameTarget;
    let a = S.frame;
    if (!a) a = S.frame = { ...c };
    else {
      a.x += (c.x - a.x) * k * 1.4;
      a.y += (c.y - a.y) * k * 1.4;
      a.r += (c.r - a.r) * k * 1.4;
    }
    let shown: GlobeFrame = a;
    let lonPlus = 0;
    if (S.descent) {
      const pd = S.descent.t0 ? Math.min(1, (t - S.descent.t0) / 3400) : 0;
      const ed = 1 - (1 - pd) * (1 - pd);
      const ap = approach(a);
      shown = { x: ap.x + (a.x - ap.x) * ed, y: ap.y + (a.y - ap.y) * ed, r: ap.r + (a.r - ap.r) * ed };
      lonPlus = (1 - ed) * 26;
      if (pd >= 1) S.descent = null;
    }
    applyCamera(shown);
    group.rotation.set(S.view.lat * RAD, -(S.view.lon + lonPlus + 90) * RAD, 0, "XYZ");
    const texelsPerPixel = S.maskWidth / (2 * Math.PI * Math.max(1, shown.r) * dpr * 0.9);
    uShell.uLod.value = Math.max(0, Math.log2(texelsPerPixel)) + 1.2;
    placeFloor(shown);

    /* En gros plan (l'horizon du hero), le monde intérieur remonte sous la coque : la bande de verre devient fine */
    const zoom = clamp((shown.r / Math.max(1, S.H) - 0.6) / 1.1, 0, 1);
    uShell.uZoom.value = zoom;
    inner?.scale.setScalar(1 + 0.08 * zoom);
    glow?.scale.setScalar(1 + 0.035 * zoom);

    /* Le mode : fondu nuit ↔ jour */
    if (S.day !== S.dayTarget) {
      S.day += clamp(S.dayTarget - S.day, -dt * 2.4, dt * 2.4);
      colors();
    }
    uPoints.uTemps.value = S.time;
    uShell.uTemps.value = S.time;
    /* le néon du pays actif s'allume en douceur */
    S.activeK += (S.activeTarget - S.activeK) * (1 - Math.exp(-dt * 2.2));
    uShell.uActifK.value = S.activeK;
    arcs.forEach((arc) => arc.step());

    renderer.render(scene, camera);
    signalReady();
    if (S.descent && !S.descent.t0) S.descent.t0 = t;
    S.raf = requestAnimationFrame(loop);
  }

  /* ---------- Les trajets ---------- */
  const noArc: GlobeArc = { trace: () => noArc, vivid: () => noArc };
  function arc(id: string, from: LatLon, to: LatLon, dashed = false): GlobeArc {
    if (mode !== "3d" || !group) return noArc;
    const existing = arcs.get(id);
    if (existing) return existing.api;
    const curve = arcCurve(from, to);
    const u: Uniforms = {
      uProg: { value: 0 },
      uVif: { value: 0 },
      uPointille: { value: dashed ? 1 : 0 },
      uCouleur: { value: new Vector3() },
    };
    const tube = new Mesh(
      new TubeGeometry(curve, 140, small ? 0.0048 : 0.0036, 6, false),
      new ShaderMaterial({ uniforms: u, vertexShader: VERT_ARC, fragmentShader: FRAG_ARC, transparent: true, depthWrite: false }),
    );
    tube.renderOrder = 2;
    tube.visible = false;
    group.add(tube);
    const headGeometry = new BufferGeometry();
    headGeometry.setAttribute("position", new BufferAttribute(new Float32Array(3), 3));
    const hu: Uniforms = { ...headUniforms, uCouleur: { value: new Vector3() }, uForce: { value: 0 } };
    const head = new Points(
      headGeometry,
      new ShaderMaterial({ uniforms: hu, vertexShader: VERT_HEAD, fragmentShader: FRAG_HEAD, transparent: true, depthWrite: false }),
    );
    head.renderOrder = 4;
    head.visible = false;
    group.add(head);

    const state = { p: 0, target: 0, vivid: 0, vividTarget: 0 };
    const api: GlobeArc = {
      trace(progress, immediate) {
        state.target = clamp(progress, 0, 1);
        if (immediate) state.p = state.target;
        resume();
        return api;
      },
      vivid(on, immediate) {
        state.vividTarget = on ? 1 : 0;
        if (immediate) state.vivid = state.vividTarget;
        resume();
        return api;
      },
    };
    const entry: ArcState = {
      api,
      color() {
        const rgb = mix3(PALETTE.arc[0], PALETTE.arc[1], S.day);
        (u.uCouleur.value as Vector3).fromArray(rgb);
        (hu.uCouleur.value as Vector3).fromArray(rgb);
        /* le fil d'or : lumineux (additif) en sombre */
        const blending = S.day < 0.5 ? AdditiveBlending : NormalBlending;
        for (const material of [tube.material, head.material] as ShaderMaterial[]) {
          if (material.blending !== blending) {
            material.blending = blending;
            material.needsUpdate = true;
          }
        }
      },
      step() {
        state.p += (state.target - state.p) * 0.22;
        if (Math.abs(state.target - state.p) < 0.001) state.p = state.target;
        state.vivid += (state.vividTarget - state.vivid) * 0.12;
        u.uProg.value = state.p;
        u.uVif.value = state.vivid;
        tube.visible = state.p > 0.001;
        const headVisible = state.p > 0.002 && state.p < 0.998 && state.vivid > 0.05;
        head.visible = headVisible;
        if (headVisible) {
          const q = curve.getPointAt(state.p);
          headGeometry.attributes.position.setXYZ(0, q.x, q.y, q.z);
          headGeometry.attributes.position.needsUpdate = true;
          hu.uForce.value = state.vivid;
        }
      },
      dispose() {
        tube.geometry.dispose();
        (tube.material as ShaderMaterial).dispose();
        headGeometry.dispose();
        (head.material as ShaderMaterial).dispose();
      },
    };
    entry.color();
    arcs.set(id, entry);
    return api;
  }

  function disposeScene() {
    arcs.forEach((entry) => entry.dispose());
    arcs.clear();
    for (const mesh of [shell, inner, glow, points]) {
      if (!mesh) continue;
      mesh.geometry.dispose();
      (mesh.material as ShaderMaterial).dispose();
    }
    shell = inner = glow = points = null;
    textures.forEach((texture) => texture.dispose());
    textures.length = 0;
    if (renderer) {
      const canvas = renderer.domElement;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      renderer = null;
    }
    scene = null;
    camera = null;
    group = null;
  }

  /* ---------- Visible ou non ---------- */
  const seen = new WeakMap<Element, boolean>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => seen.set(entry.target, entry.isIntersecting));
      S.visible = options.observe.filter((el) => seen.get(el)).length;
      if (S.visible) resume();
      else {
        /* plus rien à l'écran : la boucle s'arrête, et le canevas ne garde pas une image périmée */
        stop();
        renderer?.clear();
      }
    },
    { rootMargin: "10% 0px" },
  );
  options.observe.forEach((el) => io.observe(el));
  if (!options.observe.length) S.visible = 1;
  const onVisibility = () => (document.hidden ? stop() : resume());
  document.addEventListener("visibilitychange", onVisibility);
  const ro = new ResizeObserver(() => {
    measure();
    resume();
  });
  ro.observe(host);

  /* ---------- Démarrage ---------- */
  if (mode === "3d" && build()) {
    measure();
    loadTextures().catch(() => {
      if (!S.dead) toFallback();
    });
  } else {
    mode = "fallback";
    showFallback();
  }

  return {
    get mode() {
      return mode;
    },
    frame(next, opts) {
      const n = { x: next.x, y: next.y, r: Math.max(4, next.r) };
      const a = S.frame;
      const o = S.frameTarget;
      if (opts?.jump) S.frame = { ...n };
      else if (opts?.follow && a && o) {
        a.x += n.x - o.x;
        a.y += n.y - o.y;
      }
      S.frameTarget = n;
      if (mode === "fallback") placeFallback();
      else resume();
    },
    orient(lat, lon) {
      S.tween = null;
      S.target = { lat, lon };
      resume();
    },
    aim(lat, lon, duration = 1.4) {
      if (mode !== "3d") return;
      if (!(duration > 0)) {
        S.tween = null;
        S.view = { lat, lon };
        S.target = { lat, lon };
      } else {
        S.tween = { from: { ...S.view }, to: { lat, lon }, ms: duration * 1000, t0: 0 };
      }
      resume();
    },
    view: () => ({ lat: S.view.lat, lon: n180(S.view.lon) }),
    drift(speed) {
      S.drift = Math.max(0, speed);
    },
    arc,
    light(id) {
      if (uPoints.uActif) uPoints.uActif.value = id == null ? -1 : pointIds.indexOf(id);
      const glowCircle = id == null ? undefined : COUNTRY_GLOW[id as EscaleId];
      if (glowCircle && uShell.uActif) {
        (uShell.uActif.value as Vector3).copy(latLonToVector(glowCircle[0], glowCircle[1], 1));
        (uShell.uActifCos.value as Vector2).set(
          Math.cos(glowCircle[2] * RAD),
          Math.cos((glowCircle[2] + Math.max(2, glowCircle[2] * 0.4)) * RAD),
        );
      }
      if (id !== S.activeId) {
        S.activeId = id;
        S.activeK = 0;
      }
      S.activeTarget = glowCircle ? 1 : 0;
      resume();
    },
    showPoints(on) {
      S.pointsHidden = !on;
      if (points) points.visible = on;
      resume();
    },
    opacity(value) {
      const v = clamp(value || 0, 0, 1);
      if (Math.abs(v - S.opacity) < 0.002) return;
      S.opacity = v;
      host.style.opacity = v >= 0.999 ? "" : v.toFixed(3);
      host.style.visibility = v < 0.01 ? "hidden" : "";
      if (v < 0.01) stop();
      else resume();
    },
    setTheme(theme) {
      if (theme === S.theme) return;
      S.theme = theme;
      if (fallback) fallback.src = theme === "day" ? TEX.fallbackDay : TEX.fallbackNight;
      S.dayTarget = theme === "day" ? 1 : 0;
      resume();
    },
    destroy() {
      S.dead = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      disposeScene();
      floor.remove();
      fallback?.remove();
      fallback = null;
    },
  };
}
