/**
 * Le voyage, côté Créateur : les escales du globe (/createur) et la page /createur/voyage
 * (mes séries, la dernière vidéo, le vrai prix, le guide Chine, « Me suivre »).
 * Sources : maquettes/v6/createur.html (escales) et maquettes/v6/voyage.html ; faits observés
 * de maquettes/_shared/content.js (KENZ.createur.asie, KENZ.videos) seulement.
 *
 * Noms de série :
 * - un nom de série est un titre : il reste en français (seuls « saison » et les noms de pays se traduisent) ;
 * - dans une phrase, il n'est pas écrit dans le texte : le texte porte le jeton `{series}` (SERIES_NAME_TOKEN)
 *   et le nom vit dans `seriesName`, que le composant rend en gras (`<b>`).
 *   Aucun marqueur dans le texte : `*mot*` reste réservé au mot en Instrument Serif.
 * Dates : libellé exact de la maquette (des chiffres, identiques en FR et en EN) et dates ISO.
 * Les titres de section et les libellés fixes (« Prochaine escale », « YouTube »…) vont dans les dictionnaires.
 */
import type { Localized } from "@/i18n/localize";
import type { ExternalLink, ImageAsset, IsoDate } from "@/content/types";

/** Jeton remplacé par `seriesName` (en gras) dans le texte d'une ligne de série. */
export const SERIES_NAME_TOKEN = "{series}";

/** Un nom dans sa langue et son écriture (rendu dans un `<span lang>`, police CJK). */
export interface NativeName {
  text: string;
  lang: "ja" | "ko" | "zh";
}

/** Un lieu : son nom, puis son nom local s'il en a un. */
export interface Place {
  name: Localized<string>;
  nativeName?: NativeName;
}

/** Des lieux et, entre eux, leurs mots de liaison (« , puis »). */
export type PlaceLine = readonly (Place | Localized<string>)[];

/** Vignette d'une vidéo, liée à la chaîne YouTube (l'image est décorative : le lien porte le nom). */
export interface YoutubeMedia {
  image: ImageAsset;
  href: `https://${string}`;
}

const YOUTUBE_CHANNEL = "https://www.youtube.com/@7Kinze";

/** Vignettes des vidéos (16:9), communes aux escales et aux séries. */
const THUMBS = {
  japon: { src: "/assets/img/video-japon.jpg", width: 960, height: 540 },
  coree: { src: "/assets/img/video-coree.jpg", width: 960, height: 540 },
  malaisie: { src: "/assets/img/video-malaisie.jpg", width: 960, height: 540 },
  chine: { src: "/assets/img/video-chine.jpg", width: 960, height: 540 },
  islande: { src: "/assets/img/video-islande.jpg", width: 960, height: 540 },
} satisfies Record<string, ImageAsset>;

const NATIVE = {
  japon: { text: "日本", lang: "ja" },
  coree: { text: "한국", lang: "ko" },
  chine: { text: "中国", lang: "zh" },
  hongKong: { text: "香港", lang: "zh" },
} satisfies Record<string, NativeName>;

/* ------------------------------------------------------------------------
   Les escales du globe (/createur), dans l'ordre réel des séries
   ------------------------------------------------------------------------ */

export const ESCALE_IDS = [
  "japon",
  "coree",
  "malaisie",
  "chine",
  "hong-kong",
  "islande",
  "emirats",
  "taiwan",
  "suisse",
  "maurice",
] as const;
export type EscaleId = (typeof ESCALE_IDS)[number];

export interface EscaleDates {
  /** Libellé exact de la maquette, ex. `05/2024 → 06/2026`. */
  label: string;
  start: IsoDate;
  end?: IsoDate;
}

/** Ligne « série » : `text` peut contenir `{series}`, remplacé par `seriesName` en gras. */
export interface SeriesLine {
  text: Localized<string>;
  seriesName?: string;
}

export interface Escale {
  country: Localized<string>;
  nativeName?: NativeName;
  /** Position sur le globe, en degrés. */
  lat: number;
  lon: number;
  /** Absentes pour l'escale à venir. */
  dates?: EscaleDates;
  series?: SeriesLine;
  media?: YoutubeMedia;
  /** L'escale en préparation : « Prochaine escale », nom en contour, puis la porte du voyage. */
  upcoming?: true;
}

export const ESCALES: Readonly<Record<EscaleId, Escale>> = {
  japon: {
    country: { fr: "Japon", en: "Japan" },
    nativeName: NATIVE.japon,
    lat: 35.68,
    lon: 139.69,
    dates: { label: "05/2024 → 06/2026", start: "2024-05", end: "2026-06" },
    series: {
      text: {
        fr: "Débuts au Japon, puis {series}, saisons 1 et 2.",
        en: "Early days in Japan, then {series}, seasons 1 and 2.",
      },
      seriesName: "Branche-toi Japon",
    },
    media: { image: THUMBS.japon, href: YOUTUBE_CHANNEL },
  },
  coree: {
    country: { fr: "Corée du Sud", en: "South Korea" },
    nativeName: NATIVE.coree,
    lat: 35.18,
    lon: 129.08,
    dates: { label: "12/2024 → 03/2025", start: "2024-12", end: "2025-03" },
    series: { text: { fr: "{series}.", en: "{series}." }, seriesName: "Dans le bon en Corée" },
    media: { image: THUMBS.coree, href: YOUTUBE_CHANNEL },
  },
  malaisie: {
    country: { fr: "Malaisie", en: "Malaysia" },
    lat: 3.14,
    lon: 101.69,
    dates: { label: "05 → 06/2025", start: "2025-05", end: "2025-06" },
    series: {
      text: {
        fr: "{series}. Ma vidéo la plus vue : le budget.",
        en: "{series}. My most-watched video: the budget one.",
      },
      seriesName: "En Bien en Malaisie",
    },
    media: { image: THUMBS.malaisie, href: YOUTUBE_CHANNEL },
  },
  chine: {
    country: { fr: "Chine", en: "China" },
    nativeName: NATIVE.chine,
    lat: 39.9,
    lon: 116.4,
    dates: { label: "07/2025 → 02/2026", start: "2025-07", end: "2026-02" },
    series: {
      text: {
        fr: "{series}, saisons 1 et 2 (Shenzhen, Guangzhou). La saison 2 est ma meilleure série.",
        en: "{series}, seasons 1 and 2 (Shenzhen, Guangzhou). Season 2 is my best series.",
      },
      seriesName: "Branche-toi Chine",
    },
    media: { image: THUMBS.chine, href: YOUTUBE_CHANNEL },
  },
  "hong-kong": {
    country: { fr: "Hong Kong", en: "Hong Kong" },
    nativeName: NATIVE.hongKong,
    lat: 22.32,
    lon: 114.17,
    dates: { label: "08/2025", start: "2025-08" },
    series: { text: { fr: "Un hors-série.", en: "A one-off special." } },
  },
  islande: {
    country: { fr: "Islande", en: "Iceland" },
    lat: 64.15,
    lon: -21.94,
    dates: { label: "26/08/2025", start: "2025-08-26" },
    series: { text: { fr: "Un vlog.", en: "A vlog." } },
    media: { image: THUMBS.islande, href: YOUTUBE_CHANNEL },
  },
  emirats: {
    country: { fr: "Émirats", en: "UAE" },
    lat: 24.45,
    lon: 54.38,
    dates: { label: "12/2025", start: "2025-12" },
    series: { text: { fr: "Abu Dhabi, une mini-série.", en: "Abu Dhabi, a mini-series." } },
  },
  taiwan: {
    country: { fr: "Taïwan", en: "Taiwan" },
    lat: 25.03,
    lon: 121.57,
    dates: { label: "08/2026", start: "2026-08" },
  },
  suisse: {
    country: { fr: "Suisse", en: "Switzerland" },
    lat: 46.8,
    lon: 8.23,
    dates: { label: "09/2026", start: "2026-09" },
    series: { text: { fr: "Un hors-série.", en: "A one-off special." } },
  },
  maurice: {
    country: { fr: "Île Maurice", en: "Mauritius" },
    lat: -20.16,
    lon: 57.5,
    series: {
      text: { fr: "{series}, en préparation.", en: "{series}, in the works." },
      seriesName: "Branche-toi Île Maurice",
    },
    upcoming: true,
  },
};

/* ------------------------------------------------------------------------
   Mes séries (/createur/voyage), dans l'ordre de publication
   ------------------------------------------------------------------------ */

export const SERIES_IDS = [
  "japon-1",
  "japon-2",
  "coree",
  "malaisie",
  "chine-1",
  "islande",
  "emirats",
  "chine-2",
  "japon-3",
  "taiwan",
  "suisse",
  "maurice",
] as const;
export type SeriesId = (typeof SERIES_IDS)[number];

/** La ligne d'infos d'une série : ses parties, dans cet ordre, séparées par « · ». */
export interface SeriesMeta {
  places?: PlaceLine;
  /** « Un vlog », « une mini-série », « Un hors-série ». */
  format?: Localized<string>;
  period?: Localized<string>;
  /** « 95 vidéos », « épisodes 0 à 56 ». */
  volume?: Localized<string>;
  /** État d'une série à venir. */
  status?: Localized<string>;
}

export interface Series {
  /** Pays sur le globe : son nom et son nom local s'affichent à côté de la liste. */
  escale: EscaleId;
  name: Localized<string>;
  /** Point visé sur le globe quand il diffère de l'escale (Shenzhen pour la saison 2 en Chine). */
  focus?: { lat: number; lon: number };
  meta: SeriesMeta;
  note?: Localized<string>;
  media?: YoutubeMedia;
  /** La série en préparation : « Prochaine escale », nom en contour. */
  upcoming?: true;
}

const JAPAN: Place = { name: { fr: "Japon", en: "Japan" }, nativeName: NATIVE.japon };

export const SERIES: Readonly<Record<SeriesId, Series>> = {
  "japon-1": {
    escale: "japon",
    name: { fr: "Débuts au Japon", en: "Débuts au Japon" },
    meta: {
      places: [JAPAN],
      period: { fr: "05 → 08/2024", en: "05 → 08/2024" },
      volume: { fr: "95 vidéos", en: "95 videos" },
    },
    media: { image: THUMBS.japon, href: YOUTUBE_CHANNEL },
  },
  "japon-2": {
    escale: "japon",
    name: { fr: "Branche-toi Japon, saison 1", en: "Branche-toi Japon, season 1" },
    meta: {
      places: [JAPAN],
      period: { fr: "09 → 11/2024", en: "09 → 11/2024" },
      volume: { fr: "épisodes 0 à 56", en: "episodes 0 to 56" },
    },
  },
  coree: {
    escale: "coree",
    name: { fr: "Dans le bon en Corée", en: "Dans le bon en Corée" },
    meta: {
      places: [{ name: { fr: "Corée du Sud", en: "South Korea" }, nativeName: NATIVE.coree }],
      period: { fr: "12/2024 → 03/2025", en: "12/2024 → 03/2025" },
      volume: { fr: "49 vidéos", en: "49 videos" },
    },
    media: { image: THUMBS.coree, href: YOUTUBE_CHANNEL },
  },
  malaisie: {
    escale: "malaisie",
    name: { fr: "En Bien en Malaisie", en: "En Bien en Malaisie" },
    meta: {
      places: [{ name: { fr: "Malaisie", en: "Malaysia" } }],
      period: { fr: "05 → 06/2025", en: "05 → 06/2025" },
      volume: { fr: "46 vidéos", en: "46 videos" },
    },
    note: {
      fr: "Ma vidéo la plus vue : le budget, 725 600 vues sur TikTok.",
      en: "My most-watched video: the budget one, 725,600 views on TikTok.",
    },
    media: { image: THUMBS.malaisie, href: YOUTUBE_CHANNEL },
  },
  "chine-1": {
    escale: "chine",
    name: { fr: "Branche-toi Chine, saison 1", en: "Branche-toi Chine, season 1" },
    meta: {
      places: [
        { name: { fr: "Chine", en: "China" }, nativeName: NATIVE.chine },
        { fr: ", puis ", en: ", then " },
        { name: { fr: "Hong Kong", en: "Hong Kong" }, nativeName: NATIVE.hongKong },
      ],
      period: { fr: "07 → 08/2025", en: "07 → 08/2025" },
      volume: { fr: "46 vidéos", en: "46 videos" },
    },
    media: { image: THUMBS.chine, href: YOUTUBE_CHANNEL },
  },
  islande: {
    escale: "islande",
    name: { fr: "Islande", en: "Iceland" },
    meta: {
      format: { fr: "Un vlog", en: "A vlog" },
      period: { fr: "publié le 26/08/2025", en: "published 26/08/2025" },
    },
    media: { image: THUMBS.islande, href: YOUTUBE_CHANNEL },
  },
  emirats: {
    escale: "emirats",
    name: { fr: "Abu Dhabi", en: "Abu Dhabi" },
    meta: {
      places: [{ name: { fr: "Émirats", en: "UAE" } }],
      format: { fr: "une mini-série", en: "a mini-series" },
      period: { fr: "12/2025", en: "12/2025" },
      volume: { fr: "7 vidéos", en: "7 videos" },
    },
  },
  "chine-2": {
    escale: "chine",
    name: { fr: "Branche-toi Chine, saison 2", en: "Branche-toi Chine, season 2" },
    focus: { lat: 22.54, lon: 114.06 },
    meta: {
      places: [
        { name: { fr: "Shenzhen", en: "Shenzhen" }, nativeName: { text: "深圳", lang: "zh" } },
        { fr: ", ", en: ", " },
        { name: { fr: "Guangzhou", en: "Guangzhou" }, nativeName: { text: "广州", lang: "zh" } },
      ],
      period: { fr: "12/2025 → 02/2026", en: "12/2025 → 02/2026" },
      volume: { fr: "29 vidéos", en: "29 videos" },
    },
    note: { fr: "Ma meilleure série.", en: "My best series." },
  },
  "japon-3": {
    escale: "japon",
    name: { fr: "Branche-toi Japon, saison 2", en: "Branche-toi Japon, season 2" },
    meta: {
      places: [JAPAN],
      period: { fr: "02 → 06/2026", en: "02 → 06/2026" },
      volume: { fr: "40 vidéos", en: "40 videos" },
    },
  },
  taiwan: {
    escale: "taiwan",
    name: { fr: "Taïwan", en: "Taiwan" },
    meta: {
      period: { fr: "08/2026", en: "08/2026" },
      volume: { fr: "3 vidéos", en: "3 videos" },
    },
  },
  suisse: {
    escale: "suisse",
    name: { fr: "Suisse", en: "Switzerland" },
    meta: {
      format: { fr: "Un hors-série", en: "A one-off special" },
      period: { fr: "09/2026", en: "09/2026" },
      volume: { fr: "1 vidéo", en: "1 video" },
    },
  },
  maurice: {
    escale: "maurice",
    name: { fr: "Branche-toi Île Maurice", en: "Branche-toi Île Maurice" },
    meta: {
      status: {
        fr: "En préparation : le générique est prêt, le tournage arrive.",
        en: "In the works: the opening titles are ready, filming is next.",
      },
    },
    upcoming: true,
  },
};

/* ------------------------------------------------------------------------
   La dernière vidéo
   ------------------------------------------------------------------------ */

export interface LatestVideo {
  title: Localized<string>;
  href: `https://${string}`;
  publishedAt: IsoDate;
  image: ImageAsset;
}

export const LATEST_VIDEO: LatestVideo = {
  title: {
    fr: "Premier voyage en Chine : itinéraire de 14 jours",
    en: "First trip to China: a 14-day itinerary",
  },
  href: "https://www.youtube.com/watch?v=uG6WYRatp0I",
  publishedAt: "2026-10-31",
  image: {
    src: "/assets/img/video-chine-14-jours.jpg",
    width: 960,
    height: 540,
    alt: {
      fr: "Miniature « 14 jours » : Kenz sur la Grande Muraille de Chine",
      en: "“14 jours” (14 days) thumbnail: Kenz on the Great Wall of China",
    },
  },
};

/* ------------------------------------------------------------------------
   Le vrai prix : ce que j'ai payé en Chine (prix vécus, pas des tarifs garantis)
   ------------------------------------------------------------------------ */

/** Objet dessiné du ticket (les symboles `o-avion`, `o-train`… de la maquette). */
export type PriceIcon = "plane" | "train" | "bed" | "bowl" | "costume" | "phone";

export interface PriceTicket {
  icon: PriceIcon;
  item: Localized<string>;
  /** Le prix en grand. */
  amount: Localized<string>;
  /** Le prix court, dans l'en-tête du ticket. */
  compact: Localized<string>;
  /** Avant le prix : « moins de ». */
  prefix?: Localized<string>;
  /** Au-dessus du prix : « petit-déjeuner compris ». */
  detail?: Localized<string>;
  /** Après le prix : « la journée ». */
  suffix?: Localized<string>;
  /** Le prix attendu, barré, et sa source. */
  was?: { amount: Localized<string>; source: Localized<string> };
}

export const PRICE_TICKETS: readonly PriceTicket[] = [
  {
    icon: "plane",
    item: { fr: "Vol Pékin → Chongqing", en: "Flight, Beijing → Chongqing" },
    amount: { fr: "≈ 100 €", en: "≈ €100" },
    compact: { fr: "≈ 100 €", en: "≈ €100" },
  },
  {
    icon: "train",
    item: { fr: "Train Chongqing → Wulong", en: "Train, Chongqing → Wulong" },
    prefix: { fr: "moins de", en: "under" },
    amount: { fr: "9 €", en: "€9" },
    compact: { fr: "< 9 €", en: "< €9" },
  },
  {
    icon: "bed",
    item: { fr: "24 h dans un spa à volonté", en: "24 h in an all-inclusive spa" },
    detail: { fr: "petit-déjeuner compris", en: "breakfast included" },
    amount: { fr: "25 €", en: "€25" },
    compact: { fr: "25 €", en: "€25" },
  },
  {
    icon: "bowl",
    item: { fr: "Un repas à Shanghai", en: "A meal in Shanghai" },
    amount: { fr: "7–8 €", en: "€7–8" },
    compact: { fr: "7–8 €", en: "€7–8" },
  },
  {
    icon: "costume",
    item: { fr: "Tenue d’empereur à la Grande Muraille", en: "Emperor costume at the Great Wall" },
    amount: { fr: "≈ 20 €", en: "≈ €20" },
    compact: { fr: "≈ 20 €", en: "≈ €20" },
    suffix: { fr: "la journée", en: "for the day" },
  },
  {
    icon: "phone",
    item: { fr: "Réparation d’iPhone à Shenzhen", en: "iPhone repair in Shenzhen" },
    was: {
      amount: { fr: "200 €", en: "€200" },
      source: { fr: "vu sur le site d’Apple France", en: "seen on Apple France’s website" },
    },
    amount: { fr: "≈ 10 €", en: "≈ €10" },
    compact: { fr: "≈ 10 €", en: "≈ €10" },
  },
];

/* ------------------------------------------------------------------------
   Pour ton voyage : le guide Chine
   ------------------------------------------------------------------------ */

export interface TravelGuide {
  title: Localized<string>;
  /** Nombre de jours : le calendrier dessiné sur la carte. */
  days: number;
  bases: readonly Place[];
  /** La page de l'itinéraire ; tant qu'elle n'est pas en ligne (`online: false`), le bouton mène à `video`. */
  page: ExternalLink & { online: boolean };
  /** La vidéo du même itinéraire, sur YouTube. */
  video: `https://${string}`;
}

export const CHINA_GUIDE: TravelGuide = {
  title: {
    fr: "L’itinéraire de 14 jours, jour par jour",
    en: "The 14-day itinerary, day by day",
  },
  days: 14,
  bases: [
    { name: { fr: "Pékin", en: "Beijing" }, nativeName: { text: "北京", lang: "zh" } },
    { name: { fr: "Chongqing", en: "Chongqing" }, nativeName: { text: "重庆", lang: "zh" } },
    { name: { fr: "Shanghai", en: "Shanghai" }, nativeName: { text: "上海", lang: "zh" } },
  ],
  // /itineraire/chine n'existe pas encore : le bouton ouvre la vidéo de l'itinéraire (LATEST_VIDEO).
  page: {
    label: { fr: "Ouvrir l’itinéraire", en: "Open the itinerary" },
    href: "https://kenzenbien.fr/itineraire/chine",
    online: false,
  },
  video: LATEST_VIDEO.href,
};

/* ------------------------------------------------------------------------
   Me suivre (/createur/voyage) : le paysage derrière, le portrait dans l'arche
   ------------------------------------------------------------------------ */

export const FOLLOW_MEDIA = {
  landscape: { src: "/assets/img/paysage-kuala-lumpur.jpg", width: 1600, height: 900 },
  portrait: {
    src: "/assets/img/kenz-carre.jpg",
    width: 900,
    height: 855,
    alt: {
      fr: "Kenz en t-shirt vert devant les rizières de Malaisie",
      en: "Kenz in a green T-shirt in front of the rice fields of Malaysia",
    },
  },
} satisfies Record<string, ImageAsset>;

/** Le nombre d'abonnés TikTok affiché sous « Me suivre » (chiffre observé, déjà sur la maquette). */
export const TIKTOK_FOLLOWERS = { fr: "≈\u202f28\u202f000", en: "≈\u202f28,000" } satisfies Localized<string>;
