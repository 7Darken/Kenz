/**
 * Les outils des scènes animées (portés de courses.js) : bornes, interpolations, courbes, fenêtres de temps,
 * accès aux parties du DOM (`data-part`). Les scènes se pilotent image par image (requestAnimationFrame) :
 * le pilote écrit directement les styles, React ne rend que le balisage.
 */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Accélère puis freine (cubique). */
export const smooth = (p: number) => {
  const x = clamp01(p);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Arriver lentement, sans rebond. */
export const arrive = (p: number) => 1 - Math.pow(1 - clamp01(p), 4);

/** Partir vite. */
export const depart = (p: number) => {
  const x = clamp01(p);
  return x * x * x;
};

/** La progression de t dans la fenêtre [a, b], bornée à 0 → 1. */
export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** La partie `data-part="name"` de la scène (elle est toujours rendue : son absence est un bug). */
export function part<T extends Element = HTMLElement>(root: Element, name: string): T {
  const el = root.querySelector<T>(`[data-part="${name}"]`);
  if (!el) throw new Error(`Scène : partie « ${name} » introuvable`);
  return el;
}

/** Toutes les parties `data-part="name"`, dans l'ordre du DOM. */
export const parts = <T extends Element = HTMLElement>(root: Element, name: string): T[] =>
  Array.from(root.querySelectorAll<T>(`[data-part="${name}"]`));

/** Opacité (bornée) et transformation d'un élément. */
export function show(el: HTMLElement | SVGElement, opacity: number, transform?: string) {
  el.style.opacity = clamp01(opacity).toFixed(3);
  if (transform !== undefined) el.style.transform = transform;
}

/** Une scène : une intro courte (≈ 3 s pour comprendre), puis une petite vie au repos, en boucle légère. */
export interface SceneDriver {
  intro: number;
  period: number;
  /** t : de 0 à `intro`, puis intro + (le temps du repos modulo `period`). */
  tick: (t: number) => void;
  /** Mouvement réduit : un état final, fixe et lisible. */
  freeze: () => void;
  dispose?: () => void;
}

/** La légende sous la scène (un mot-clé que le composant traduit) et les mots allumés de la frise. */
export interface SceneLegend {
  label: string;
  words: number | "all" | null;
}

export type SceneFactory = (root: HTMLElement, onLegend: (legend: SceneLegend) => void) => SceneDriver;

/** N'appelle `onLegend` que si la légende change (quelques fois par boucle, pas à chaque image). */
export function legendWriter(onLegend: (legend: SceneLegend) => void) {
  let current = "";
  return (label: string, words: SceneLegend["words"]) => {
    const key = `${label}|${words}`;
    if (key === current) return;
    current = key;
    onLegend({ label, words });
  };
}
