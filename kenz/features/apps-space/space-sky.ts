/**
 * Le ciel lointain de la scène des apps, dessiné dans un canvas (shared/apps.js : semerEtoiles, dessinerCiel,
 * filante). 260 à 520 étoiles en trois tons (la nuit : blanc chaud, bleu pâle, quelques dorées ; l'aube : encre, bleu
 * nuit, Lagon), chacune son rythme ; les plus vives ont des aigrettes. Les couleurs viennent de la palette du mode
 * (./space-palette), passée à chaque image : changer de mode redessine le même ciel. Une étoile filante discrète
 * toutes les 10 à 16 s, sur un trajet qui ne croise aucun texte.
 * À l'arrivée, les étoiles s'allument depuis le centre ; à la plongée, elles filent vers l'extérieur.
 * Niveau de qualité (design-system/motion/quality) : moins d'étoiles et un canevas moins fin en `medium` et `low` ;
 * en `low`, ni scintillement ni étoile filante : le ciel posé n'est redessiné que s'il change (arrivée, plongée, mode).
 */

import { getQuality, type Quality } from "@/design-system/motion/quality";
import type { SkyPalette } from "./space-palette";

export interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  /** Son ton, index de SkyPalette.tones. */
  tone: number;
  w: number;
  ph: number;
  aig: number;
  /** Délai d'allumage (ms) : la distance au centre. */
  n: number;
}

interface Shooting {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t0: number;
  d: number;
}

interface SkyFrame {
  /** Horloge (ms, performance.now). */
  t: number;
  reduced: boolean;
  /** Début de l'arrivée (0 : déjà allumé). */
  arrival: number;
  /** La plongée : son début (0 : aucune) et son point de fuite (repère de la scène). */
  plunge: number;
  plungeX: number;
  plungeY: number;
  /** Une étoile filante peut passer (ciel prêt, pas de départ). */
  shooting: boolean;
  /** Les zones à éviter en plus des textes (la fiche ouverte). */
  extraZones: readonly Zone[];
  /** Taille de la scène. */
  W: number;
  H: number;
  /** Les couleurs du mode. */
  palette: SkyPalette;
}

/** Le tirage des tons : quatre étoiles sur sept prennent le troisième, deux le premier, une le deuxième. */
const TONE_DRAW = [2, 2, 2, 2, 0, 0, 1];
const TAU = 6.2832;
/** La part des étoiles semées, et la finesse du canevas, selon le niveau de qualité. */
const STAR_SHARE: Record<Quality, number> = { high: 1, medium: 0.65, low: 0.4 };
const SKY_DPR: Record<Quality, number> = { high: 1.5, medium: 1.25, low: 1 };

/** Une lueur douce, dessinée une fois par palette, pour les étoiles vives et l'étoile filante. */
function makeSprite([c0, c1, c2]: NonNullable<SkyPalette["glow"]>): HTMLCanvasElement | null {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const g = sprite.getContext("2d");
  if (!g) return null;
  const rg = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  rg.addColorStop(0, c0);
  rg.addColorStop(0.22, c1);
  rg.addColorStop(1, c2);
  g.fillStyle = rg;
  g.fillRect(0, 0, 32, 32);
  return sprite;
}

export function createSky(canvas: HTMLCanvasElement, layer: HTMLElement) {
  const ctx = canvas.getContext("2d");
  let sprite: HTMLCanvasElement | null = null;
  let spriteOf: SkyPalette | null = null;
  let stars: Star[] = [];
  let zones: Zone[] = [];
  let cw = 0;
  let ch = 0;
  let ox = 0;
  let oy = 0;
  let dpr = 1;
  let shooting: Shooting | null = null;
  let nextShooting = 0;
  /** Le ciel posé (sans scintillement) déjà dessiné, avec cette palette : rien à redessiner. */
  let drawnStill: SkyPalette | null = null;

  /** Graines fixes : le même ciel à chaque visite. */
  function seed() {
    let s = 7;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    const count = Math.round(Math.max(260, Math.min(520, (cw * ch) / 2600)) * STAR_SHARE[getQuality()]);
    const cx = cw / 2;
    const cy = ch / 2;
    const dm = Math.sqrt(cx * cx + cy * cy) || 1;
    stars = [];
    for (let i = 0; i < count; i += 1) {
      const x = rnd() * cw;
      const y = rnd() * ch;
      const bright = rnd() < 0.055;
      const z = rnd();
      stars.push({
        x,
        y,
        r: bright ? 1.15 + z * 0.8 : 0.38 + z * z * 1.05,
        a: bright ? 1 : 0.3 + rnd() * 0.65,
        tone: TONE_DRAW[Math.floor(rnd() * TONE_DRAW.length)] ?? 2,
        w: TAU / (0.6 + rnd() * 2.4),
        ph: rnd() * TAU,
        aig: bright ? 5 + rnd() * 8 : 0,
        n: (Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) / dm) * 1100,
      });
    }
    // Groupées par ton : moins de changements de style au dessin.
    stars.sort((a, b) => a.tone - b.tone);
  }

  /** Remesure le calque (il déborde de la scène de 6 %) et ressème ; `textZones` en repère de la scène. */
  function measure(textZones: Zone[]) {
    ox = layer.offsetLeft;
    oy = layer.offsetTop;
    cw = layer.clientWidth;
    ch = layer.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, SKY_DPR[getQuality()]);
    drawnStill = null;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    zones = textZones;
    seed();
  }

  function drawShooting(t: number, f: SkyFrame) {
    if (!ctx) return;
    if (!shooting) {
      if (!nextShooting) nextShooting = t + 3500 + Math.random() * 3000;
      if (t < nextShooting) return;
      nextShooting = t + 10000 + Math.random() * 6000;
      const avoid = zones.concat(f.extraZones);
      for (let attempt = 0; attempt < 12 && !shooting; attempt += 1) {
        const x0 = f.W * (0.2 + Math.random() * 0.75);
        const y0 = f.H * (0.12 + Math.random() * 0.42);
        const angle = (0.16 + Math.random() * 0.16) * Math.PI;
        const length = 150 + Math.random() * 150;
        const dx = -Math.cos(angle) * length;
        const dy = Math.sin(angle) * length;
        let free = x0 + dx > 10 && y0 + dy < f.H - 220 && y0 > 200;
        for (let k = 0; k <= 10 && free; k += 1) {
          const qx = x0 + (dx * k) / 10;
          const qy = y0 + (dy * k) / 10;
          free = !avoid.some((z) => qx > z.x && qx < z.x + z.w && qy > z.y && qy < z.y + z.h);
        }
        if (free) shooting = { x: x0 - ox, y: y0 - oy, dx, dy, t0: t, d: 700 + Math.random() * 350 };
      }
      if (!shooting) return;
    }
    const k = (t - shooting.t0) / shooting.d;
    if (k >= 1) {
      shooting = null;
      return;
    }
    const e = 1 - (1 - k) * (1 - k);
    const q = Math.min(1, k * 5) * (1 - Math.max(0, (k - 0.55) / 0.45));
    const hx = shooting.x + shooting.dx * e;
    const hy = shooting.y + shooting.dy * e;
    const b = Math.max(0, e - 0.34);
    const tx = shooting.x + shooting.dx * b;
    const ty = shooting.y + shooting.dy * b;
    const { from, to, alpha, width } = f.palette.shooting;
    const gradient = ctx.createLinearGradient(tx, ty, hx, hy);
    gradient.addColorStop(0, `rgba(${from},0)`);
    gradient.addColorStop(1, `rgba(${to},${(alpha * q).toFixed(3)})`);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    if (sprite) {
      ctx.globalAlpha = q * 0.9;
      ctx.drawImage(sprite, hx - 8, hy - 8, 16, 16);
    }
  }

  function draw(f: SkyFrame) {
    if (!ctx || !cw) return;
    const { t, reduced } = f;
    const ta = t / 1000;
    const age = f.arrival ? t - f.arrival : 1e9;
    const pl = f.plunge && !reduced ? Math.min(1, (t - f.plunge) / 760) : 0;
    const pe = pl * pl * 0.2;
    const fx = f.plungeX - ox;
    const fy = f.plungeY - oy;
    const { tones, alpha, twinkle, spikes } = f.palette;
    /* sans scintillement (mouvement réduit, qualité basse), un ciel posé ne se redessine pas */
    const calm = reduced || getQuality() === "low";
    const settled = calm && age > 1700 && !pe && !shooting;
    if (settled && drawnStill === f.palette) return;
    drawnStill = settled ? f.palette : null;
    if (spriteOf !== f.palette) {
      spriteOf = f.palette;
      sprite = f.palette.glow ? makeSprite(f.palette.glow) : null;
    }
    let tone = -1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    for (const s of stars) {
      const na = age > 1700 ? 1 : Math.max(0, Math.min(1, (age - s.n) / 480));
      if (na <= 0) continue;
      const sn = calm ? 0.55 : Math.sin(ta * s.w + s.ph);
      const a = s.a * (twinkle.base + twinkle.amp * sn) * na * alpha;
      const rr = s.r * (0.86 + 0.14 * sn);
      if (s.tone !== tone) {
        tone = s.tone;
        const c = tones[tone] ?? tones[2];
        ctx.fillStyle = c;
        ctx.strokeStyle = c;
      }
      ctx.globalAlpha = a;
      if (pe) {
        // La plongée : chaque étoile s'étire vers l'extérieur, depuis l'astre choisi.
        ctx.lineWidth = Math.max(0.6, rr * 1.5);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + (s.x - fx) * pe, s.y + (s.y - fy) * pe);
        ctx.stroke();
        continue;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, rr, 0, TAU);
      ctx.fill();
      if (s.aig) {
        const L = s.aig * (calm ? 1 : 0.62 + 0.38 * Math.sin(ta * s.w * 1.27 + s.ph * 2));
        ctx.globalAlpha = a * spikes.alpha;
        ctx.lineWidth = spikes.width;
        ctx.beginPath();
        ctx.moveTo(s.x - L, s.y);
        ctx.lineTo(s.x + L, s.y);
        ctx.moveTo(s.x, s.y - L);
        ctx.lineTo(s.x, s.y + L);
        ctx.stroke();
        if (sprite) {
          ctx.globalAlpha = a * 0.6;
          ctx.drawImage(sprite, s.x - 7, s.y - 7, 14, 14);
        }
      }
    }
    if (!calm && f.shooting) drawShooting(t, f);
    else shooting = null;
    ctx.globalAlpha = 1;
  }

  return { measure, draw };
}
