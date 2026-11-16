/**
 * Ce qui se calcule une fois, au chargement (sur le processeur), pour la bille :
 * - les images, ramenées à une largeur maximale dans un canevas (et vérifiées lisibles) ;
 * - le monde intérieur en relief : une sphère dense dont les sommets sont soulevés d'après le masque terre / mer
 *   (flouté : un biseau doux), les pays filmés un cran plus haut, un soupçon de topologie sur les montagnes ;
 * - la texture d'émission des néons, tirée du masque des pays filmés (bord = le tube, flous = halo, cœur, lueur) ;
 * - la courbe d'un trajet entre deux escales.
 * Porté de maquettes/v6/shared/terre.js (interieurConstruire, emissionConstruire, courbe).
 *
 * Les gros calculs (flous, sphère en relief, normales) sont des générateurs découpés en tranches : `runSliced` rend la
 * main au navigateur toutes les 8 ms, pour qu'aucune tâche longue ne bloque le défilement ni la première image.
 */
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  RepeatWrapping,
  RGBAFormat,
  Vector3,
} from "three";

const RAD = Math.PI / 180;

export interface LatLon {
  lat: number;
  lon: number;
}

/** Un calcul découpé : chaque `yield` est un point où l'on peut rendre la main. */
type Sliced<T> = Generator<void, T, void>;

/** Rend la main au navigateur (une image, un événement peuvent passer). */
export function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Déroule un calcul découpé par tranches de `budget` ms, en rendant la main entre deux. */
export async function runSliced<T>(work: Sliced<T>, budget = 8): Promise<T> {
  let step = work.next();
  while (!step.done) {
    const end = performance.now() + budget;
    while (!step.done && performance.now() < end) step = work.next();
    if (!step.done) await yieldToMain();
  }
  return step.value;
}

/** Un point du globe (rayon r) : la convention de la maquette (longitude 0 face à +x, nord en +y). */
export function latLonToVector(lat: number, lon: number, r: number): Vector3 {
  const a = lat * RAD;
  const b = lon * RAD;
  return new Vector3(Math.cos(a) * Math.cos(b) * r, Math.sin(a) * r, -Math.cos(a) * Math.sin(b) * r);
}

/** Une image ramenée à `max` px de large dans un canevas ; refusée si le canevas est « sali » (illisible). */
export function loadCanvas(url: string, max: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    const draw = () => {
      try {
        const k = Math.min(1, max / img.naturalWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * k);
        canvas.height = Math.round(img.naturalHeight * k);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas 2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.getImageData(0, 0, 1, 1);
        resolve(canvas);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };
    /* le décodage se fait hors du fil principal (decode), puis le dessin dans le canevas */
    img.onload = () => {
      img.decode().then(draw, draw);
    };
    img.onerror = () => reject(new Error(`image : ${url}`));
    img.src = url;
  });
}

/** Les pixels d'un canevas, redessiné à la taille w × h. */
function pixels(source: HTMLCanvasElement, w: number, h: number): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d");
  ctx.drawImage(source, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

/** La finesse du monde intérieur : la grille du masque (largeur) et les segments de la sphère. */
export interface InnerDetail {
  grid: number;
  segments: readonly [number, number];
}

/**
 * La sphère de three.js (SphereGeometry, mêmes sommets, mêmes uv, même ordre des triangles), construite en tranches ;
 * chaque sommet est soulevé par `lift(u, v)` (facteur du rayon).
 */
function* displacedSphere(radius: number, W: number, H: number, lift: (u: number, v: number) => number): Sliced<BufferGeometry> {
  const count = (W + 1) * (H + 1);
  const position = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  let i = 0;
  for (let iy = 0; iy <= H; iy++) {
    const v = iy / H;
    const uOffset = iy === 0 ? 0.5 / W : iy === H ? -0.5 / W : 0;
    const theta = v * Math.PI;
    for (let ix = 0; ix <= W; ix++) {
      const u = ix / W;
      const phi = u * Math.PI * 2;
      const uu = Math.fround(u + uOffset);
      const vv = Math.fround(1 - v);
      const k = lift(uu, vv);
      position[i * 3] = Math.fround(-radius * Math.cos(phi) * Math.sin(theta)) * k;
      position[i * 3 + 1] = Math.fround(radius * Math.cos(theta)) * k;
      position[i * 3 + 2] = Math.fround(radius * Math.sin(phi) * Math.sin(theta)) * k;
      uv[i * 2] = uu;
      uv[i * 2 + 1] = vv;
      i++;
    }
    yield;
  }
  const index = new Uint32Array(W * H * 6 - W * 6);
  let n = 0;
  for (let iy = 0; iy < H; iy++) {
    for (let ix = 0; ix < W; ix++) {
      const a = iy * (W + 1) + ix + 1;
      const b = iy * (W + 1) + ix;
      const c = (iy + 1) * (W + 1) + ix;
      const d = (iy + 1) * (W + 1) + ix + 1;
      if (iy !== 0) {
        index[n++] = a;
        index[n++] = b;
        index[n++] = d;
      }
      if (iy !== H - 1) {
        index[n++] = b;
        index[n++] = c;
        index[n++] = d;
      }
    }
    if (iy % 8 === 0) yield;
  }
  /* les normales des sommets, comme computeVertexNormals : somme des normales des faces, puis normalisées */
  const normal = new Float32Array(count * 3);
  for (let t = 0; t < n; t += 3) {
    const ia = index[t] * 3;
    const ib = index[t + 1] * 3;
    const ic = index[t + 2] * 3;
    const bx = position[ib];
    const by = position[ib + 1];
    const bz = position[ib + 2];
    const cbx = position[ic] - bx;
    const cby = position[ic + 1] - by;
    const cbz = position[ic + 2] - bz;
    const abx = position[ia] - bx;
    const aby = position[ia + 1] - by;
    const abz = position[ia + 2] - bz;
    const nx = cby * abz - cbz * aby;
    const ny = cbz * abx - cbx * abz;
    const nz = cbx * aby - cby * abx;
    normal[ia] += nx;
    normal[ia + 1] += ny;
    normal[ia + 2] += nz;
    normal[ib] += nx;
    normal[ib + 1] += ny;
    normal[ib + 2] += nz;
    normal[ic] += nx;
    normal[ic + 1] += ny;
    normal[ic + 2] += nz;
    if (t % 6144 === 0) yield;
  }
  for (let o = 0; o < normal.length; o += 3) {
    const l = Math.hypot(normal[o], normal[o + 1], normal[o + 2]) || 1;
    normal[o] /= l;
    normal[o + 1] /= l;
    normal[o + 2] /= l;
  }
  const geometry = new BufferGeometry();
  geometry.setIndex(new BufferAttribute(index, 1));
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("normal", new BufferAttribute(normal, 3));
  geometry.setAttribute("uv", new BufferAttribute(uv, 2));
  return geometry;
}

/**
 * Le monde intérieur (rayon 0,88 : l'anneau de verre reste assez large pour que le relief au limbe ne le rende pas
 * inégal). Terres à +2,2 %, pays filmés +0,9 %, montagnes +0,6 % au plus.
 */
export function* buildInnerGeometry(mask: HTMLCanvasElement, relief: HTMLCanvasElement | null, detail: InnerDetail): Sliced<BufferGeometry> {
  const GW = detail.grid;
  const GH = GW / 2;
  const N = GW * GH;
  const dm = pixels(mask, GW, GH);
  yield;
  const dr = relief ? pixels(relief, GW, GH) : null;
  yield;
  const land = new Float32Array(N);
  const filmed = new Float32Array(N);
  const height = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    land[i] = dm[i * 4] / 255;
    filmed[i] = dm[i * 4 + 1] / 255;
    height[i] = dr ? dr[i * 4] / 255 : 0;
  }
  yield;

  /* le biseau : deux flous en boîte, séparables (horizontal en boucle, vertical borné) */
  const B = new Float32Array(N);
  function* blur(A: Float32Array, rr: number): Sliced<void> {
    for (let y = 0; y < GH; y++) {
      for (let x = 0; x < GW; x++) {
        let s = 0;
        for (let k = -rr; k <= rr; k++) s += A[y * GW + ((x + k + GW) % GW)];
        B[y * GW + x] = s / (2 * rr + 1);
      }
      yield;
    }
    for (let x = 0; x < GW; x++) {
      for (let y = 0; y < GH; y++) {
        let s = 0;
        for (let k = -rr; k <= rr; k++) s += B[Math.min(GH - 1, Math.max(0, y + k)) * GW + x];
        A[y * GW + x] = s / (2 * rr + 1);
      }
      if (x % 2 === 0) yield;
    }
  }
  const rb = GW >= 1024 ? 2 : 1;
  yield* blur(land, rb);
  yield* blur(land, rb);
  yield* blur(filmed, rb);
  yield* blur(filmed, rb);

  /* échantillonnage bilinéaire (u en boucle, v borné) */
  const sample = (A: Float32Array, u: number, v: number) => {
    const x = u * GW - 0.5;
    const y = Math.min(GH - 1.001, Math.max(0, (1 - v) * GH - 0.5));
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const at = (xx: number, yy: number) => A[yy * GW + (((xx % GW) + GW) % GW)];
    return (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
  };

  const [W, H] = detail.segments;
  return yield* displacedSphere(0.88, W, H, (u, v) => {
    const t = sample(land, u, v);
    return 1 + 0.022 * t + 0.009 * sample(filmed, u, v) + 0.006 * sample(height, u, v) * t;
  });
}

/**
 * La texture du néon : le masque des pays filmés (canal vert) → R le tube (bord), G le halo, B le cœur, A la lueur large.
 * Flous en boîte à somme glissante (horizontal en boucle, vertical borné), plusieurs passes ≈ un flou gaussien.
 * `width` : 2048 (la référence), 1024 sur mobile et aux niveaux de qualité plus bas (rayons à l'échelle).
 */
export function* buildEmission(mask: HTMLCanvasElement, width: number, anisotropy: number): Sliced<DataTexture> {
  const EW = width;
  const EH = EW / 2;
  const N = EW * EH;
  const d = pixels(mask, EW, EH);
  yield;
  const P0 = new Float32Array(N);
  for (let i = 0; i < N; i++) P0[i] = d[i * 4 + 1] / 255;
  yield;

  /** Un flou en boîte de rayon r, de A vers out (out peut être A : la passe horizontale lit tout A d'abord). */
  const T = new Float32Array(N);
  const cl = (k: number) => (k < 0 ? 0 : k >= EH ? EH - 1 : k);
  function* box(A: Float32Array, r: number, out: Float32Array): Sliced<Float32Array> {
    const n = 2 * r + 1;
    for (let y = 0; y < EH; y++) {
      const row = y * EW;
      let s = 0;
      for (let x = -r; x <= r; x++) s += A[row + ((x + EW) % EW)];
      for (let x = 0; x < EW; x++) {
        T[row + x] = s / n;
        s += A[row + ((x + r + 1) % EW)] - A[row + ((x - r + EW) % EW)];
      }
      if (y % 4 === 0) yield;
    }
    for (let x = 0; x < EW; x++) {
      let s = 0;
      for (let y = -r; y <= r; y++) s += T[cl(y) * EW + x];
      for (let y = 0; y < EH; y++) {
        out[y * EW + x] = s / n;
        s += T[cl(y + r + 1) * EW + x] - T[cl(y - r) * EW + x];
      }
      if (x % 4 === 0) yield;
    }
    return out;
  }

  const k = EW / 2048;
  const fine = new Float32Array(N);
  yield* box(P0, Math.max(1, Math.round(2 * k)), fine);
  yield* box(fine, 1, fine);
  const edge = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const e = 1 - Math.abs(2 * fine[i] - 1);
    edge[i] = e * e;
  }
  yield;
  const rHalo = Math.max(3, Math.round(9 * k));
  const rCore = Math.max(6, Math.round(22 * k));
  const rWide = Math.max(4, Math.round(16 * k));
  const halo = fine; /* le flou fin n'est plus lu : sa mémoire sert au halo */
  yield* box(edge, rHalo, halo);
  yield* box(halo, rHalo, halo);
  const core = new Float32Array(N);
  yield* box(P0, rCore, core);
  yield* box(core, rCore, core);
  const wide = P0; /* P0 n'est plus lu après ses trois flous : le dernier passe dans sa mémoire */
  const w1 = new Float32Array(N);
  yield* box(P0, rWide, w1);
  yield* box(w1, rWide, w1);
  yield* box(w1, rWide, wide);

  const out = new Uint8Array(N * 4);
  for (let y = 0; y < EH; y++) {
    for (let x = 0; x < EW; x++) {
      const src = y * EW + x;
      const dst = ((EH - 1 - y) * EW + x) * 4; /* DataTexture : la ligne 0 est en bas (v = 0) */
      out[dst] = Math.min(255, edge[src] * 255);
      out[dst + 1] = Math.min(255, halo[src] * 2.6 * 255);
      out[dst + 2] = Math.min(255, core[src] * 255);
      out[dst + 3] = Math.min(255, wide[src] * 1.6 * 255);
    }
    if (y % 16 === 0) yield;
  }
  const texture = new DataTexture(out, EW, EH, RGBAFormat);
  texture.wrapS = RepeatWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(4, anisotropy);
  texture.needsUpdate = true;
  return texture;
}

/** Le trajet entre deux escales : un grand cercle, soulevé au milieu d'autant plus que le vol est long. */
export function arcCurve(a: LatLon, b: LatLon): CatmullRomCurve3 {
  const va = latLonToVector(a.lat, a.lon, 1);
  const vb = latLonToVector(b.lat, b.lon, 1);
  const angle = va.angleTo(vb);
  const lift = 0.016 + angle * 0.085;
  const s = Math.sin(angle);
  const points: Vector3[] = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const v =
      s < 1e-4
        ? va.clone().lerp(vb, u).normalize()
        : va
            .clone()
            .multiplyScalar(Math.sin((1 - u) * angle) / s)
            .add(vb.clone().multiplyScalar(Math.sin(u * angle) / s));
    points.push(v.multiplyScalar(1.005 + lift * Math.sin(Math.PI * u)));
  }
  return new CatmullRomCurve3(points);
}
