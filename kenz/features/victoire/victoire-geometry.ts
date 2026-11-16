/**
 * La géométrie fixe de la séquence « 54 heures » (portée de maquettes/v6/shared/victoire.js) :
 * le mur de post-it (tirages déterministes : toujours le même), la couronne d'étoiles autour de l'arche,
 * les éclats, le couloir d'arches et les durées du compteur.
 */

/** Les durées du compteur, en secondes : 54 h au départ, 30 h après le vendredi, 14 h le dimanche matin. */
export const H54 = 54 * 3600;
export const H30 = 30 * 3600;
export const H14 = 14 * 3600;

/** Longueur de l'épinglage, en hauteurs d'écran. */
export const PIN_SCREENS = 3;

/** Le couloir : 7 arches puis la dernière (le cadre de la photo) ; perspective P, écart GAP (px). */
export const DOORS = 7;
export const PERSPECTIVE = 900;
export const GAP = 420;

const TAU = Math.PI * 2;

/** Générateur pseudo-aléatoire à graine fixe (mulberry32) : le mur ne change jamais d'une visite à l'autre. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Le mur : 7 colonnes × 4 rangs ; le nôtre au rang 1, colonne 3. Des pictogrammes d'idées, aucun nom de projet. */
const COLUMNS = 7;
const ROWS = 4;
export const OURS = 10;
const TINTS = ["#FFF0A6", "#FFD4DF", "#C8EDD5", "#CFE2FF", "#E3D7FF", "#FFDDBD"];
const AVATAR_TINTS = ["#9FB4D6", "#D6B49A", "#A8D0C0", "#E0AFBC", "#BFB1E3", "#CFC6B4"];

/** Les pictogrammes des post-it (repère 24, trait) : une idée chacun. */
export const PICTOS = [
  "M8 3v6M12 3v6M16 3v6M8 9a4 4 0 0 0 8 0M12 13v8", // une fourchette
  "M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l8-8", // une feuille
  "M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-6h4v6", // une maison
  "M6.5 17.5a3.5 3.5 0 1 0 0-.01M17.5 17.5a3.5 3.5 0 1 0 0-.01M6.5 17.5L10 10h6.5l1 7.5M10 10L9 7H7M13 17.5L16.5 10", // un vélo
  "M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z", // une note
  "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z", // un cœur
  "M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0", // un sac
  "M4 6.5C6.5 5 9.5 5 12 6.5 14.5 5 17.5 5 20 6.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 6.5V19", // un livre
  "M4 8h4l2-2h4l2 2h4v11H4zM12 16a3 3 0 1 0 0-.01", // un appareil photo
  "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.5a2 2 0 0 1 0 4H16M9 3.5v3M12.5 3.5v3", // une tasse
  "M12 15.5a3.5 3.5 0 1 0 0-.01M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8", // un soleil
  "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z", // une ampoule
  "M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12", // un haltère
  "M12 20c-3 0-5-1.8-5-3.8S9 13 12 13s5 1.2 5 3.2S15 20 12 20zM6.5 10.5a1.6 2 0 1 0 0-.01M10 7.5a1.6 2 0 1 0 0-.01M14 7.5a1.6 2 0 1 0 0-.01M17.5 10.5a1.6 2 0 1 0 0-.01", // une patte
] as const;

export interface PostIt {
  /** Position du centre, en % du mur. */
  x: number;
  y: number;
  rotation: number;
  tint: string;
  picto: number;
  /** Ordre d'apparition (0 à 1). */
  order: number;
}

export interface Avatar {
  /** Le post-it de l'équipe. */
  team: number;
  x: number;
  y: number;
  /** D'où il arrive (en % du mur). */
  x0: number;
  y0: number;
  tint: string;
}

export const WALL: { postIts: readonly PostIt[]; avatars: readonly Avatar[] } = (() => {
  const r = rng(54);
  const postIts: PostIt[] = [];
  const avatars: Avatar[] = [];
  for (let n = 0; n < COLUMNS * ROWS; n++) {
    const c = n % COLUMNS;
    const l = Math.floor(n / COLUMNS);
    postIts.push({
      x: ((c + 0.5) / COLUMNS) * 100 + (r() - 0.5) * 4.4,
      y: ((l + 0.5) / ROWS) * 100 + (r() - 0.5) * 7,
      rotation: (r() - 0.5) * 14,
      tint: TINTS[Math.floor(r() * TINTS.length)],
      picto: (n * 5) % PICTOS.length,
      order: r(),
    });
  }
  postIts[OURS] = { ...postIts[OURS], x: 50, y: 37.5, rotation: -3 };
  // Les équipes se forment : des avatars ronds viennent sous certains post-it.
  [OURS, 1, 5, 8, 15, 19, 23, 26].forEach((team, j) => {
    const m = 3 + (j % 3);
    const p = postIts[team];
    for (let a = 0; a < m; a++) {
      avatars.push({
        team,
        x: p.x + (a - (m - 1) / 2) * 3.1,
        y: p.y + 10.2 + Math.abs(a - (m - 1) / 2) * -0.8,
        x0: 6 + r() * 88,
        y0: 6 + r() * 88,
        tint: AVATAR_TINTS[Math.floor(r() * AVATAR_TINTS.length)],
      });
    }
  });
  return { postIts, avatars };
})();

/**
 * La couronne de lauriers en étoiles, autour du haut de l'arche large (3:2 ; haut en demi-ellipse de centre
 * u .5, v .38). Repère de l'arche : u et v de 0 à 1 ; la boîte de la constellation va de u -0,1 à 1,1 et de
 * v -0,2 à 0,7 (repère 120 × 60, même rapport que la boîte).
 */
export const CROWN_BOX = { u0: -0.1, du: 1.2, v0: -0.2, dv: 0.9, w: 120, h: 60 } as const;

export interface Star {
  x: number;
  y: number;
  /** Rang d'allumage. */
  k: number;
  kind: "" | "haut" | "feuille";
  /** La feuille extérieure de droite : en mode épinglé, la gouttière est plus étroite qu'elle, elle y est retirée. */
  outer?: true;
}

export const CROWN: { stars: readonly Star[]; links: readonly (readonly [number, number])[] } = (() => {
  const stars: Star[] = [];
  const links: [number, number][] = [];
  const angles = [165, 182, 198, 214, 230, 246, 258];
  const left: number[] = [];
  const right: number[] = [];
  const uv: { u: number; v: number }[] = [];
  const point = (u: number, v: number, k: number, kind: Star["kind"] = "", outer = false) => {
    const x = ((u - CROWN_BOX.u0) / CROWN_BOX.du) * CROWN_BOX.w;
    const y = ((v - CROWN_BOX.v0) / CROWN_BOX.dv) * CROWN_BOX.h;
    stars.push(outer ? { x, y, k, kind, outer } : { x, y, k, kind });
    uv.push({ u, v });
    return stars.length - 1;
  };
  angles.forEach((deg, n) => {
    const t = (deg * Math.PI) / 180;
    const u = 0.5 + 0.545 * Math.cos(t);
    const v = 0.38 + 0.46 * Math.sin(t);
    left.push(point(u, v, n));
    right.push(point(1 - u, v, n + 0.04));
  });
  const top = point(0.5, -0.11, 8, "haut");
  for (let n = 0; n < angles.length - 1; n++) {
    links.push([left[n], left[n + 1]], [right[n], right[n + 1]]);
  }
  links.push([left[angles.length - 1], top], [right[angles.length - 1], top]);
  // Les feuilles du laurier.
  [1, 3, 5].forEach((n) => {
    const t = ((angles[n] + 25) * Math.PI) / 180;
    const { u, v } = uv[left[n]];
    const du = 0.06 * Math.cos(t);
    const dv = 0.09 * Math.sin(t);
    links.push([left[n], point(u + du, v + dv, n + 0.5, "feuille")]);
    links.push([right[n], point(1 - u - du, v + dv, n + 0.54, "feuille", n === 1)]);
  });
  return { stars, links };
})();

/** Les éclats du zéro : direction et portée de chacun. */
export const SPARKS = Array.from({ length: 10 }, (_, n) => {
  const angle = (n / 10) * TAU + Math.sin(n * 2.3) * 0.25;
  const reach = 80 + ((n * 37) % 70);
  return { dx: Math.cos(angle) * reach, dy: Math.sin(angle) * reach * 0.8 };
});
