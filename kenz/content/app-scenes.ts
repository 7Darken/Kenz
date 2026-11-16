/**
 * Les valeurs d'exemple des animations des apps (« Comment ça marche », et la fiche de Zenko sur l'accueil Pro) :
 * des données de démonstration, annoncées comme telles à l'écran, pas des chiffres réels.
 * Les textes de ces animations sont dans les dictionnaires (`apps.scenes`, `pro.space.scene`) ; leurs dessins,
 * dans leurs composants ; les vrais visuels des apps qu'elles montrent, ici (`public/assets/apps/<slug>/scene/`).
 * Un fichier à part de content/apps.ts : une scène n'embarque que ces quelques valeurs.
 */
import type { AppSlug } from "./apps";
import type { HexColor, ImageAsset } from "./types";

/** Un vrai visuel d'une app, repris pour sa scène (WebP, à deux fois sa taille affichée au plus). */
const sceneAsset = (app: AppSlug, name: string, width: number, height: number): ImageAsset => ({
  src: `/assets/apps/${app}/scene/${name}.webp`,
  width,
  height,
});

/**
 * Oshii : la recette de la démo de l'app (Oshii, components/onboarding/v3/demoRecipeV3.ts : une vraie recette de sa
 * base) : la photo de sa vidéo, le logo de la plateforme, la mascotte quand la fiche est prête, et la fiche pesée
 * (quatre de ses douze ingrédients, ses onze étapes).
 */
export const OSHII_SAMPLE = {
  photo: sceneAsset("oshii", "tarte-cookies", 600, 1067),
  platform: sceneAsset("oshii", "tiktok", 64, 64),
  mascot: sceneAsset("oshii", "mascotte-joie", 288, 288),
  minutes: 45,
  servings: 15,
  steps: 11,
  quantities: { flour: "475 g", butter: "230 g", chocolate: "450 g", brownSugar: "160 g" },
} as const;

/** Un mot de Sago posé à sa place sur l'image du lieu (`x`, `y` : de 0 à 1, les repères du lieu dans l'app). */
export interface SagoPin {
  word: string;
  x: number;
  y: number;
}

/** Un mot de la phrase de Sago ; `reading` : ses furigana ; `pin` : le mot de l'image qu'il reprend. */
export interface SagoToken {
  text: string;
  reading?: string;
  pin?: number;
}

/**
 * Sago : l'essai de l'app (Sago-Backend, v2/content/src/onboarding.yaml) : la caisse du konbini, les trois mots qu'on
 * y découvre à leur place, la phrase qu'on construit ensuite, et Kuro, la mascotte, qui réfléchit puis sourit.
 */
export const SAGO_SAMPLE: {
  place: ImageAsset;
  pins: readonly SagoPin[];
  sentence: readonly SagoToken[];
  kuro: { thinking: ImageAsset; happy: ImageAsset };
} = {
  place: sceneAsset("sago", "konbini-caisse", 960, 640),
  pins: [
    { word: "お茶", x: 0.26, y: 0.43 },
    { word: "おにぎり", x: 0.21, y: 0.62 },
    { word: "パン", x: 0.36, y: 0.64 },
  ],
  sentence: [{ text: "お茶", reading: "おちゃ", pin: 0 }, { text: "を" }, { text: "ください。" }],
  kuro: { thinking: sceneAsset("sago", "kuro-thinking", 288, 288), happy: sceneAsset("sago", "kuro-happy", 288, 288) },
};

/**
 * Wado : le plat scanné (une recette de l'app, assets/images/meal-plans/soy-honey-salmon-broccoli), ses macros et son
 * total, puis la journée qu'il complète (calories mangées avant le plat, objectif). Les icônes 3D des macros
 * (assets/images/nutrition-3d) et la flamme de la nutrition, dans ses humeurs du scan : curieuse pendant qu'elle lit
 * le plat, fière du résultat, ravie quand la journée monte (features/nutrition/scan, components/energy-card.tsx).
 */
export const WADO_SAMPLE = {
  photo: sceneAsset("wado", "plat-saumon-brocoli", 600, 600),
  macros: [
    { key: "protein", grams: 38, icon: sceneAsset("wado", "macro-protein", 112, 112) },
    { key: "carbs", grams: 62, icon: sceneAsset("wado", "macro-carbs", 112, 112) },
    { key: "fat", grams: 14, icon: sceneAsset("wado", "macro-fat", 112, 112) },
  ],
  kcal: 520,
  day: { eaten: 1000, goal: 2400 },
  flame: [sceneAsset("wado", "flamme-curious", 224, 224), sceneAsset("wado", "flamme-proud", 224, 224), sceneAsset("wado", "flamme-delighted", 224, 224)],
} as const;

/** Une suite d'entiers de `from` à `to` (inclus), dans un sens ou dans l'autre : les chiffres d'un rouleau. */
function range(from: number, to: number): readonly number[] {
  const step = from <= to ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step);
}

/** Un joueur de Miru : un personnage de l'app recadré en avatar, posé sur sa couleur de joueur. */
interface MiruPlayer {
  face: ImageAsset;
  color: HexColor;
}

/**
 * Miru : les cinq joueurs autour de la table, dans l'ordre où le téléphone passe (des personnages des jeux de l'app,
 * miru/assets/games, sur ses couleurs de joueur), et le personnage des thèmes IA (miru/assets/categories/IA.png).
 */
export const MIRU_SAMPLE: { players: readonly MiruPlayer[]; ai: ImageAsset } = {
  players: [
    { face: sceneAsset("miru", "joueur-voyante", 160, 160), color: "#FDE047" },
    { face: sceneAsset("miru", "joueur-mr-white", 160, 160), color: "#4A7AFF" },
    { face: sceneAsset("miru", "joueur-villageoise", 160, 160), color: "#5EEAD4" },
    { face: sceneAsset("miru", "joueur-chasseur", 160, 160), color: "#4ADE80" },
    { face: sceneAsset("miru", "joueur-cupidon", 160, 160), color: "#93C5FD" },
  ],
  ai: sceneAsset("miru", "personnage-ia", 333, 400),
};

/**
 * Croc : le compteur monte de 5 à 12 jours. Le décor de l'accueil de l'app (assets/croc/scene-bg.png) et trois
 * humeurs de sa mascotte, celles du pacte : décidée avant de s'engager, sereine une fois engagée, en joie le pacte tenu.
 */
export const CROC_SAMPLE = {
  streak: range(5, 12),
  landscape: sceneAsset("croc", "paysage", 990, 440),
  moods: [sceneAsset("croc", "mascotte-urge", 288, 288), sceneAsset("croc", "mascotte-main", 288, 288), sceneAsset("croc", "mascotte-joy", 288, 288)],
} as const;

/** Un moment de la journée de Zenko : son pictogramme dans l'app, sa part du budget avant, puis après le nouveau budget. */
export interface ZenkoMoment {
  key: "morning" | "afternoon" | "evening";
  icon: ImageAsset;
  share: { before: number; after: number };
}

/**
 * Zenko : le budget glisse de 40 à 25, et chaque moment de la journée coûte moins. Le biscuit (le logo) et les
 * pictogrammes des moments sont ceux de l'app (EnBueno : assets/ZenkoLogo.png, src/assets/icons/moments).
 */
export const ZENKO_SAMPLE: { logo: ImageAsset; budget: readonly number[]; moments: readonly ZenkoMoment[] } = {
  logo: sceneAsset("zenko", "logo-biscuit", 80, 80),
  budget: range(40, 25),
  moments: [
    { key: "morning", icon: sceneAsset("zenko", "moment-matin", 96, 96), share: { before: 0.86, after: 0.42 } },
    { key: "afternoon", icon: sceneAsset("zenko", "moment-apres-midi", 96, 96), share: { before: 0.74, after: 0.36 } },
    { key: "evening", icon: sceneAsset("zenko", "moment-soir", 96, 96), share: { before: 0.92, after: 0.5 } },
  ],
};

/**
 * Escapades Libres : le petit groupe (les avatars de l'app, des photos Pexels de modèles : pas des voyageurs) et
 * la destination (le Vieux-Port, une carte postale du site), dans l'ordre de l'app (apps/web, carnet/insight.tsx).
 */
export const ESCAPADES_SAMPLE: { group: readonly ImageAsset[]; destination: ImageAsset; city: string } = {
  group: ["avatar-02", "avatar-05", "avatar-07", "avatar-03", "avatar-09"].map((name) =>
    sceneAsset("escapades-libres", name, 176, 176),
  ),
  destination: sceneAsset("escapades-libres", "marseille", 720, 480),
  city: "Marseille",
};
