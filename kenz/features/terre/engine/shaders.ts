/**
 * Les shaders de la bille de cristal (portés de maquettes/v6/shared/terre.js, style « verre », le seul retenu).
 * GLSL ES 1 : three.js les compile en GLSL ES 3 (WebGL 2), d'où `textureLod` directement.
 *
 * La bille, de l'intérieur vers l'extérieur :
 * - le monde intérieur (sphère en relief, rayon 0,88) : terres de la Blue Marble teintées dans la masse, océan de verre
 *   bleu profond qui tire au turquoise près des côtes, pays filmés en verre ambré cerné d'un tube de néon ;
 * - la lueur des néons (sphère 0,95, additive) : elle diffuse dans le verre ;
 * - la coque (rayon 1, transparente) : Fresnel, reflets de trois boîtes à lumière, dispersion, contre-jour ;
 * - par-dessus : les escales (points) et les fils d'or des trajets, avec leur tête lumineuse.
 */

/** Le studio : trois boîtes à lumière, reflétées par la coque et les flancs du relief. */
const GLSL_STUDIO = /* glsl */ `
uniform vec3 uFond; uniform float uJour;
float boite(vec3 R, vec3 d, vec2 demi, float flou){
  float k = dot(R, d); if (k <= 0.0) return 0.0;
  vec3 u = normalize(cross(vec3(0.0, 1.0, 0.0), d)), w = cross(d, u);
  vec2 q = abs(vec2(dot(R, u), dot(R, w)) / k);
  vec2 e = 1.0 - smoothstep(demi - flou, demi + flou, q);
  return e.x * e.y;
}
vec3 studio(vec3 R){
  vec3 c = uFond * mix(0.35, 0.9, uJour);
  c += vec3(1.0, 0.985, 0.96) * mix(1.45, 0.85, uJour) * boite(R, normalize(vec3(-0.74, 0.56, 0.38)), vec2(0.34, 0.22), 0.06);
  c += vec3(1.0, 0.95, 0.88) * 1.5 * boite(R, normalize(vec3(0.9, 0.12, 0.42)), vec2(0.07, 0.62), 0.05);
  c += vec3(0.8, 0.9, 1.0) * mix(2.2, 0.7, uJour) * boite(R, normalize(vec3(0.15, 0.4, -0.9)), vec2(0.9, 0.5), 0.3);
  c += vec3(1.0, 0.9, 0.76) * 0.22 * smoothstep(-0.2, -0.7, R.y);
  return c;
}`;

/**
 * Le néon des pays filmés : une texture d'émission calculée au chargement (R tube, G halo, B cœur, A lueur large).
 * Le pays de l'escale active (un cercle autour de son centre) brille plus fort et s'allume en douceur.
 */
const GLSL_NEON = /* glsl */ `
uniform sampler2D uEmi; uniform vec3 uActif; uniform vec2 uActifCos; uniform float uActifK;
float actif(vec3 p){ return smoothstep(uActifCos.y, uActifCos.x, dot(normalize(p), uActif)) * uActifK; }`;

/** Sommet commun : la coque et la lueur. */
export const VERT_SHELL = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;
void main(){
  vUv = uv; vObj = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

/** La coque de verre (mélange : src × 1 + dst × (1 − a)). */
export const FRAG_SHELL = /* glsl */ `
${GLSL_STUDIO}
${GLSL_NEON}
uniform float uZoom;
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;
void main(){
  vec3 n = normalize(vN), v = normalize(vV);
  float nv = clamp(dot(n, v), 0.0, 1.0), e = 1.0 - nv;
  float F = (0.05 + 0.95 * pow(e, 5.0)) * mix(1.0, 0.3, uZoom);
  vec3 R = reflect(-v, n);
  vec3 st = studio(R);
  /* en clair, on retire de la coque le reflet de la pièce (crème) et du sol : sinon un voile plus ou moins épais
     recouvre le bord du monde selon l'angle, et l'anneau paraît décentré ; restent les boîtes à lumière */
  st -= (uFond * mix(0.35, 0.9, uJour) * 0.8 + vec3(1.0, 0.9, 0.76) * 0.22 * smoothstep(-0.2, -0.7, R.y)) * uJour;
  vec3 col = max(st, vec3(0.0)) * F;
  float a = F * mix(1.0, 0.55, uJour) + 0.06;
  /* en clair, un corps de verre à peine teinté : l'anneau ne se lit pas comme un vide crème */
  col += vec3(0.6, 0.72, 0.76) * 0.1 * uJour; a += 0.1 * uJour;
  vec3 disp = vec3(pow(e, 4.4), pow(e, 4.8), pow(e, 5.3));
  col += disp * mix(vec3(0.7, 0.82, 1.0) * 0.9, vec3(0.34, 0.38, 0.4) * 0.35, uJour);
  a += (disp.r + disp.g + disp.b) * 0.12;
  vec2 fo = n.xy - vec2(0.36, -0.3);
  col += mix(vec3(1.0, 0.88, 0.66) * 0.1, vec3(1.0, 0.95, 0.85) * 0.08, uJour) * exp(-dot(fo, fo) * 7.0);
  float bord = pow(e, 3.0) * 0.16 * uJour;
  col += vec3(0.1, 0.13, 0.15) * bord; a += bord;
  /* en gros plan (le hero), la coque s'efface : un liseré lumineux fin au bord, les reflets, et la Terre dessous */
  a *= mix(1.0, 0.35, uZoom);
  col *= mix(1.0, 0.55, uZoom);
  col += mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 0.98, 0.94), uJour) * pow(e, 16.0) * 0.9 * uZoom;
  /* le reflet très doux des néons sur la coque, au-dessus d'eux */
  vec4 em = texture2D(uEmi, vUv);
  col += vec3(1.0, 0.68, 0.3) * (em.a * 0.5 + em.g * 0.25) * (0.18 + F) * mix(0.42, 0.18, uJour) * mix(0.75, 1.2, actif(vObj));
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}`;

/** La lueur des néons, additive sur la couleur seulement (l'alpha du canevas ne bouge pas). */
export const FRAG_GLOW = /* glsl */ `
uniform float uJour;
${GLSL_NEON}
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vObj;
void main(){
  vec4 em = texture2D(uEmi, vUv);
  float nv = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
  float d = em.a * 0.7 + em.g * 0.3;
  vec3 col = vec3(1.0, 0.55, 0.15) * d * mix(0.95, 0.26, uJour) * mix(0.7, 1.3, actif(vObj)) * (0.55 + 0.45 * nv);
  gl_FragColor = vec4(col, 1.0);
}`;

export const VERT_INNER = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vR; varying vec3 vObj;
void main(){
  vUv = uv;
  vObj = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vR = normalize(normalMatrix * normalize(position));
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

/**
 * Le monde intérieur, en couleurs : les terres de la Blue Marble, un peu plus saturées et lumineuses (le biseau et
 * les flancs plus clairs) ; l'océan en verre coloré, avec de légères caustiques qui bougent ; les pays filmés en verre
 * ambré éclairé de l'intérieur, cerné d'un tube de néon (cœur blanc chaud, puis or et ambre) et d'un halo qui déborde.
 */
export const FRAG_INNER = /* glsl */ `
${GLSL_STUDIO}
${GLSL_NEON}
uniform sampler2D uMasque; uniform sampler2D uTexJ; uniform vec3 uSoleil; uniform float uLod; uniform float uTemps; uniform float uCaus;
varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vR; varying vec3 vObj;
float bruit(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float doux(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(bruit(i), bruit(i + vec2(1.0, 0.0)), u.x), mix(bruit(i + vec2(0.0, 1.0)), bruit(i + vec2(1.0, 1.0)), u.x), u.y); }
vec3 sature(vec3 c, float k){ float l = dot(c, vec3(0.3, 0.59, 0.11)); return mix(vec3(l), c, k); }
void main(){
  vec3 n = normalize(vN), v = normalize(vV), nr = normalize(vR);
  vec4 m = textureLod(uMasque, vUv, uLod);
  float pied = textureLod(uMasque, vUv, uLod + 1.6).r;
  float large = textureLod(uMasque, vUv, uLod + 3.4).r;
  float cerne = textureLod(uMasque, vUv, uLod + 1.4).g;
  float terre = smoothstep(0.3, 0.7, m.r), pf = smoothstep(0.35, 0.65, m.g);
  float lam = dot(n, uSoleil), nvr = clamp(dot(nr, v), 0.0, 1.0);
  float lum = 0.5 + 0.5 * smoothstep(-0.45, 0.85, lam);
  float pente = clamp((1.0 - dot(n, nr)) * 9.0, 0.0, 1.0);
  vec3 photo = textureLod(uTexJ, vUv, uLod).rgb;
  /* l'océan : du bleu profond au turquoise des lagons près des côtes */
  float peu = smoothstep(0.08, 0.55, large);
  vec3 profond = mix(vec3(0.02, 0.11, 0.27), vec3(0.08, 0.3, 0.56), uJour);
  vec3 lagon = mix(vec3(0.06, 0.5, 0.56), vec3(0.24, 0.72, 0.74), uJour);
  vec3 mer = mix(profond, lagon, peu);
  mer *= 0.85 + 0.3 * dot(photo, vec3(0.3, 0.59, 0.11));
  /* les caustiques (deux bruits par pixel) : coupées au niveau de qualité bas (uCaus = 0) */
  if (uCaus > 0.5) {
    vec2 cq = vUv * vec2(320.0, 160.0);
    float n1 = doux(cq + vec2(uTemps * 0.22, uTemps * 0.13)), n2 = doux(cq * 1.3 - vec2(uTemps * 0.17, -uTemps * 0.2));
    float caus = pow(1.0 - abs(n1 - n2), 9.0) * peu;
    mer += mix(vec3(0.5, 0.9, 0.95), vec3(0.85, 1.0, 1.0), uJour) * caus * 0.22;
  }
  mer *= lum * (0.78 + 0.3 * nvr);
  mer *= 1.0 - clamp(pied * 1.5, 0.0, 1.0) * (1.0 - terre) * mix(0.42, 0.2, uJour);
  /* les terres : la vraie couleur, teintée dans la masse ; les flancs et le biseau plus clairs */
  vec3 sol = sature(photo, 1.35) * 1.22;
  sol = mix(sol, vec3(0.97, 0.97, 0.95), smoothstep(0.62, 0.9, dot(photo, vec3(0.3, 0.59, 0.11))) * 0.6);
  /* les lacs (presque noirs sur la photo, « terre » dans le masque) : de l'eau claire, turquoise */
  float lac = 1.0 - smoothstep(0.02, 0.065, dot(photo, vec3(0.3, 0.59, 0.11)));
  sol = mix(sol, lagon * mix(0.9, 1.05, uJour) * (0.7 + 0.3 * smoothstep(-0.45, 0.85, lam)), lac);
  sol *= mix(0.58, 0.7, uJour) + mix(0.5, 0.36, uJour) * smoothstep(-0.45, 0.85, lam);
  sol += vec3(1.0, 0.99, 0.96) * pente * mix(0.45, 0.3, uJour) * smoothstep(-0.25, 0.5, lam);
  sol += studio(reflect(-v, n)) * 0.06;
  sol *= 1.0 - smoothstep(0.08, 0.5, cerne) * (1.0 - pf) * 0.32;
  /* les pays filmés : du verre ambré éclairé de l'intérieur (lumineux au centre, plus dense au bord, le relief dessous) */
  vec4 em = texture2D(uEmi, vUv);
  float act = actif(vObj), niveau = mix(0.62, 1.3, act);
  vec3 orN = vec3(1.0, 0.76, 0.3), blanc = vec3(1.0, 0.96, 0.84);
  float centre = smoothstep(0.55, 0.97, em.b);
  vec3 verreAmbre = mix(vec3(0.8, 0.3, 0.04) * 0.78, vec3(1.0, 0.8, 0.44) * 1.12, centre) * niveau;
  verreAmbre = mix(verreAmbre, sol * vec3(1.0, 0.7, 0.4), 0.22) * (0.82 + 0.3 * smoothstep(-0.4, 0.8, lam));
  verreAmbre += vec3(1.0, 0.85, 0.6) * pente * 0.3;
  vec3 c = mix(mer, mix(sol, verreAmbre, pf), max(terre, pf));
  c *= mix(0.74, 1.0, uJour);
  float tube = em.r;
  vec3 emi = blanc * smoothstep(0.55, 1.0, tube) * 1.45 + orN * smoothstep(0.08, 0.65, tube) * 1.15 + vec3(1.0, 0.45, 0.08) * em.g * 1.6;
  emi *= 0.86 + 0.14 * sin(uTemps * 1.3 + vObj.x * 9.0);
  c += emi * niveau * mix(1.0, 0.5, uJour);
  gl_FragColor = vec4(min(c, vec3(1.25)), 1.0);
}`;

/** Les escales : des points de taille fixe à l'écran, qui s'éteignent vers le bord ; la prochaine en anneau pointillé. */
export const VERT_POINTS = /* glsl */ `
attribute float aTaille; attribute float aEtat; attribute float aId;
uniform float uDpr; uniform float uActif; uniform float uEchelle;
varying float vA; varying float vEtat; varying float vActif;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 n = normalize(normalMatrix * normalize(position));
  vA = smoothstep(0.04, 0.32, dot(n, normalize(-mv.xyz)));
  vActif = abs(aId - uActif) < 0.5 ? 1.0 : 0.0;
  vEtat = aEtat;
  gl_PointSize = aTaille * uDpr * uEchelle * (1.0 + vActif * 1.6);
  gl_Position = projectionMatrix * mv;
}`;

export const FRAG_POINTS = /* glsl */ `
uniform vec3 uCouleur; uniform vec3 uCoeur; uniform float uTemps;
varying float vA; varying float vEtat; varying float vActif;
void main(){
  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);
  if (r > 1.0) discard;
  float a; float c = 0.0;
  if (vEtat > 0.5) {
    float anneau = smoothstep(0.5, 0.6, r) * (1.0 - smoothstep(0.74, 0.84, r));
    a = anneau * step(0.0, sin(atan(p.y, p.x) * 7.0 + uTemps * 0.8)) * 0.95;
  } else {
    c = 1.0 - smoothstep(0.16, 0.3, r);
    a = c + pow(1.0 - r, 3.0) * 0.18;
    float o = fract(uTemps * 0.5);
    a += vActif * (1.0 - smoothstep(0.0, 0.05, abs(r - (0.34 + o * 0.62)))) * (1.0 - o) * 0.75;
  }
  gl_FragColor = vec4(mix(uCouleur, uCoeur, c), clamp(a, 0.0, 1.0) * vA);
}`;

/** Le fil d'or d'un trajet : visible jusqu'à la tête, plus lumineux près d'elle ; en pointillé vers la prochaine escale. */
export const VERT_ARC = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const FRAG_ARC = /* glsl */ `
uniform float uProg; uniform float uVif; uniform float uPointille; uniform vec3 uCouleur;
varying vec2 vUv;
void main(){
  float x = vUv.x;
  if (x > uProg) discard;
  if (uPointille > 0.5 && fract(x * 30.0) > 0.5) discard;
  float tete = smoothstep(uProg - 0.3, uProg, x);
  float a = mix(0.32, 0.55 + 0.45 * tete, uVif);
  gl_FragColor = vec4(uCouleur, a);
}`;

/** La tête lumineuse qui avance avec le fil. */
export const VERT_HEAD = /* glsl */ `
uniform float uDpr; uniform float uTaille;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uTaille * uDpr;
  gl_Position = projectionMatrix * mv;
}`;

export const FRAG_HEAD = /* glsl */ `
uniform vec3 uCouleur; uniform float uForce;
void main(){
  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);
  if (r > 1.0) discard;
  float c = 1.0 - smoothstep(0.2, 0.42, r);
  gl_FragColor = vec4(mix(uCouleur, vec3(1.0, 0.98, 0.94), c * 0.6), (c + pow(1.0 - r, 3.0) * 0.15) * uForce);
}`;
