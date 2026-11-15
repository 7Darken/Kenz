/**
 * Ce qui se calcule une fois, au chargement (sur le processeur), pour la bille :
 * - les images, ramenées à une largeur maximale dans un canevas (et vérifiées lisibles) ;
 * - le monde intérieur en relief : une sphère dense dont les sommets sont soulevés d'après le masque terre / mer
 *   (flouté : un biseau doux), les pays filmés un cran plus haut, un soupçon de topologie sur les montagnes ;
 * - la texture d'émission des néons, tirée du masque des pays filmés (bord = le tube, flous = halo, cœur, lueur) ;
 * - la courbe d'un trajet entre deux escales.
 * Porté de maquettes/v6/shared/terre.js (interieurConstruire, emissionConstruire, courbe).
 */
import {
  CatmullRomCurve3,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  RepeatWrapping,
  RGBAFormat,
  SphereGeometry,
  Vector3,
} from "three";

const RAD = Math.PI / 180;

export interface LatLon {
  lat: number;
  lon: number;
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
    img.onload = () => {
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
    img.onerror = () => reject(new Error(`image : ${url}`));
    img.src = url;
  });
}

/** Les pixels d'un canevas, redessiné à la taille w × h. */
function pixels(source: HTMLCanvasElement, w: number, h: number): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d");
  ctx.drawImage(source, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

/**
 * Le monde intérieur (rayon 0,88 : l'anneau de verre reste assez large pour que le relief au limbe ne le rende pas
 * inégal). Terres à +2,2 %, pays filmés +0,9 %, montagnes +0,6 % au plus.
 */
export function buildInnerGeometry(mask: HTMLCanvasElement, relief: HTMLCanvasElement | null, small: boolean): SphereGeometry {
  const GW = small ? 512 : 1024;
  const GH = GW / 2;
  const N = GW * GH;
  const dm = pixels(mask, GW, GH);
  const dr = relief ? pixels(relief, GW, GH) : null;
  const land = new Float32Array(N);
  const filmed = new Float32Array(N);
  const height = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    land[i] = dm[i * 4] / 255;
    filmed[i] = dm[i * 4 + 1] / 255;
    height[i] = dr ? dr[i * 4] / 255 : 0;
  }

  /* le biseau : deux flous en boîte, séparables (horizontal en boucle, vertical borné) */
  const blur = (A: Float32Array, rr: number) => {
    const B = new Float32Array(A.length);
    for (let y = 0; y < GH; y++) {
      for (let x = 0; x < GW; x++) {
        let s = 0;
        for (let k = -rr; k <= rr; k++) s += A[y * GW + ((x + k + GW) % GW)];
        B[y * GW + x] = s / (2 * rr + 1);
      }
    }
    for (let x = 0; x < GW; x++) {
      for (let y = 0; y < GH; y++) {
        let s = 0;
        for (let k = -rr; k <= rr; k++) s += B[Math.min(GH - 1, Math.max(0, y + k)) * GW + x];
        A[y * GW + x] = s / (2 * rr + 1);
      }
    }
    return A;
  };
  const rb = small ? 1 : 2;
  blur(blur(land, rb), rb);
  blur(blur(filmed, rb), rb);

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

  const geometry = new SphereGeometry(0.88, small ? 256 : 512, small ? 128 : 256);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v3 = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    const vv = uv.getY(i);
    const t = sample(land, u, vv);
    const p = sample(filmed, u, vv);
    const h = sample(height, u, vv);
    v3.fromBufferAttribute(pos, i).multiplyScalar(1 + 0.022 * t + 0.009 * p + 0.006 * h * t);
    pos.setXYZ(i, v3.x, v3.y, v3.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * La texture du néon : le masque des pays filmés (canal vert) → R le tube (bord), G le halo, B le cœur, A la lueur large.
 * Flous en boîte à somme glissante (horizontal en boucle, vertical borné), plusieurs passes ≈ un flou gaussien.
 */
export function buildEmission(mask: HTMLCanvasElement, small: boolean, anisotropy: number): DataTexture {
  const EW = small ? 1024 : 2048;
  const EH = EW / 2;
  const N = EW * EH;
  const d = pixels(mask, EW, EH);
  const P0 = new Float32Array(N);
  for (let i = 0; i < N; i++) P0[i] = d[i * 4 + 1] / 255;

  const box = (A: Float32Array, r: number) => {
    const B = new Float32Array(N);
    const C = new Float32Array(N);
    const n = 2 * r + 1;
    for (let y = 0; y < EH; y++) {
      const row = y * EW;
      let s = 0;
      for (let x = -r; x <= r; x++) s += A[row + ((x + EW) % EW)];
      for (let x = 0; x < EW; x++) {
        B[row + x] = s / n;
        s += A[row + ((x + r + 1) % EW)] - A[row + ((x - r + EW) % EW)];
      }
    }
    const cl = (k: number) => (k < 0 ? 0 : k >= EH ? EH - 1 : k);
    for (let x = 0; x < EW; x++) {
      let s = 0;
      for (let y = -r; y <= r; y++) s += B[cl(y) * EW + x];
      for (let y = 0; y < EH; y++) {
        C[y * EW + x] = s / n;
        s += B[cl(y + r + 1) * EW + x] - B[cl(y - r) * EW + x];
      }
    }
    return C;
  };

  const k = EW / 2048;
  const fine = box(box(P0, Math.max(1, Math.round(2 * k))), 1);
  const edge = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const e = 1 - Math.abs(2 * fine[i] - 1);
    edge[i] = e * e;
  }
  const rHalo = Math.max(3, Math.round(9 * k));
  const rCore = Math.max(6, Math.round(22 * k));
  const rWide = Math.max(4, Math.round(16 * k));
  const halo = box(box(edge, rHalo), rHalo);
  const core = box(box(P0, rCore), rCore);
  const wide = box(box(box(P0, rWide), rWide), rWide);

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
