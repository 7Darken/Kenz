/**
 * Les valeurs d'exemple des animations des apps (« Comment ça marche », et la fiche de Zenko sur l'accueil Pro) :
 * des données de démonstration, annoncées comme telles à l'écran, pas des chiffres réels.
 * Les textes de ces animations sont dans les dictionnaires (`apps.scenes`, `pro.space.scene`) ; leurs dessins,
 * dans leurs composants. Un fichier à part de content/apps.ts : une scène n'embarque que ces quelques valeurs.
 */

/** Oshii : les quantités de la fiche pesée. */
export const OSHII_SAMPLE = {
  quantities: { pasta: "200 g", parmesan: "40 g", lemon: "1", cream: "10 cl" },
} as const;

/** Wado : les macros de l'assiette scannée, et son total. */
export const WADO_SAMPLE = {
  macros: [
    ["protein", "38 g"],
    ["carbs", "62 g"],
    ["fat", "14 g"],
  ],
  kcal: "≈ 520",
} as const;

/** Une suite d'entiers de `from` à `to` (inclus), dans un sens ou dans l'autre : les chiffres d'un rouleau. */
function range(from: number, to: number): readonly number[] {
  const step = from <= to ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step);
}

/** Croc : la série monte de 5 à 12 jours. */
export const CROC_SAMPLE = { streak: range(5, 12) } as const;

/** Un moment de la journée de Zenko : sa part du budget avant, puis après le nouveau budget. */
export interface ZenkoMoment {
  key: "morning" | "afternoon" | "evening";
  share: { before: number; after: number };
}

/** Zenko : le budget glisse de 40 à 25, et chaque moment de la journée coûte moins. */
export const ZENKO_SAMPLE: { budget: readonly number[]; moments: readonly ZenkoMoment[] } = {
  budget: range(40, 25),
  moments: [
    { key: "morning", share: { before: 0.86, after: 0.42 } },
    { key: "afternoon", share: { before: 0.74, after: 0.36 } },
    { key: "evening", share: { before: 0.92, after: 0.5 } },
  ],
};
