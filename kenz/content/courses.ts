/**
 * k15ze (/createur/sport, et l'aperçu de /createur) : mes courses, leurs scènes animées, et « Ce que je partage ».
 * Sources : maquettes/v6/shared/courses.js (PH, COURSES, ANIMS) et maquettes/v6/sport.html.
 *
 * Ajouter une course : son id dans COURSE_IDS, son entrée dans COURSES (et une scène si son sport est nouveau).
 * La date s'affiche à partir de la date ISO (« 31 mai 2025 », « Depuis le 14 octobre 2026 ») : c'est le composant qui la formate.
 * Les tracés (ring, objets des Shorts) sont du code ; les libellés fixes (« Voir le détail », « en cours »…) vont dans les dictionnaires.
 * Côté k15ze : rien sur l'Asie ni le voyage.
 */
import type { Localized } from "@/i18n/localize";
import type { ImageAsset, IsoDate } from "@/content/types";

/* ------------------------------------------------------------------------
   Les photos (une fois, réutilisées par les courses) ; `position` = le cadrage de la maquette
   ------------------------------------------------------------------------ */

const PHOTOS = {
  rowing: {
    src: "/assets/img/sport/hyrox-riga-rameur.webp",
    width: 1200,
    height: 1801,
    alt: {
      fr: "Kenz rame à fond sur l’ergomètre, le visage crispé par l’effort",
      en: "Kenz rowing flat out on the erg, his face tight with effort",
    },
    position: "50% 24%",
  },
  sledPush: {
    src: "/assets/img/sport/hyrox-riga-traineau.webp",
    width: 1200,
    height: 1801,
    alt: {
      fr: "Kenz pousse le traîneau sur la piste, sous les projecteurs",
      en: "Kenz pushing the sled down the track, under the spotlights",
    },
    position: "50% 46%",
  },
  wallBall: {
    src: "/assets/img/sport/hyrox-riga-wallball.webp",
    width: 1200,
    height: 1801,
    alt: {
      fr: "Kenz en squat, un medicine-ball contre la poitrine",
      en: "Kenz in a squat, a medicine ball against his chest",
    },
    position: "40% 62%",
  },
  finishLine: {
    src: "/assets/img/sport/hyrox-riga-finish.webp",
    width: 1200,
    height: 800,
    alt: {
      fr: "Kenz et un autre participant sous l’arche d’arrivée, tout sourire",
      en: "Kenz and another competitor under the finish arch, all smiles",
    },
    position: "45% 50%",
  },
  finalTime: {
    src: "/assets/img/sport/hyrox-riga-arrivee.webp",
    width: 1200,
    height: 800,
    alt: {
      fr: "Kenz et un autre participant devant le panneau du temps final",
      en: "Kenz and another competitor in front of the final time board",
    },
    position: "38% 50%",
  },
  spartanStone: {
    src: "/assets/img/spartan-1.jpg",
    width: 511,
    height: 768,
    alt: {
      fr: "Kenz porte une lourde boule de pierre dans les herbes hautes",
      en: "Kenz carrying a heavy stone ball through tall grass",
    },
    position: "50% 40%",
  },
  spartanFire: {
    src: "/assets/img/spartan-2.jpg",
    width: 768,
    height: 511,
    alt: {
      fr: "Kenz saute au-dessus d’un feu pendant une Spartan Race",
      en: "Kenz jumping over a fire during a Spartan Race",
    },
    position: "48% 50%",
  },
} satisfies Record<string, ImageAsset>;

/** L'arrivée de /createur/sport : Kenz en pleine course (sport.html, `.kh__photo` ; le cadrage suit l'écran, en CSS). */
export const SPORT_HERO_PHOTO: ImageAsset = {
  src: PHOTOS.sledPush.src,
  width: PHOTOS.sledPush.width,
  height: PHOTOS.sledPush.height,
  alt: {
    fr: "Kenz pousse le traîneau sur la piste du HYROX de Riga, sous les projecteurs",
    en: "Kenz pushing the sled down the track at HYROX Riga, under the spotlights",
  },
};

/* ------------------------------------------------------------------------
   Les scènes animées de la fiche (icônes 3D)
   ------------------------------------------------------------------------ */

/** Icônes 3D de chaque scène, dans l'ordre d'apparition (masters 1024 px : `/assets/sport3d/<id>.webp`). */
export const SPORT_3D_ICON_IDS = {
  hyrox: [
    "hyrox-run",
    "hyrox-01-skierg",
    "hyrox-02-sled-push",
    "hyrox-03-sled-pull",
    "hyrox-04-burpee-broad-jump",
    "hyrox-05-row",
    "hyrox-06-farmers-carry",
    "hyrox-07-sandbag-lunges",
    "hyrox-08-wall-balls",
    "hyrox-finish",
  ],
  spartan: ["spartan-mur", "spartan-boue", "spartan-portes", "spartan-filet", "spartan-saut"],
  boxe: ["boxe-bandes", "boxe-sac", "boxe-gants"],
} as const satisfies Record<CourseSceneId, readonly string[]>;
export type Sport3dIconId = (typeof SPORT_3D_ICON_IDS)[CourseSceneId][number];

/** Une icône 3D : décorative (la scène est décrite par `summary`). */
function sport3dIcon(id: Sport3dIconId): ImageAsset {
  return { src: `/assets/sport3d/${id}.webp`, width: 1024, height: 1024 };
}

/** Une légende sous la scène : un titre et sa précision. */
export interface SceneCaption {
  title: Localized<string>;
  hint: Localized<string>;
}

/** HYROX : la formule (1 km + 1 station, × 8) qui se replie en une boucle de 8 stations. */
export interface HyroxScene {
  /** La scène en mots, pour les lecteurs d'écran. */
  summary: Localized<string>;
  run: { icon: ImageAsset; value: string; label: Localized<string> };
  station: { value: Localized<string>; label: Localized<string> };
  times: string;
  /** Au centre de la boucle. */
  loop: { value: Localized<string>; label: Localized<string> };
  stations: readonly { icon: ImageAsset; name: Localized<string> }[];
  /** L'arche d'arrivée, sur la boucle. */
  finish: ImageAsset;
}

/** Ce que fait le coureur à l'obstacle (la forme du saut). */
export type SpartanObstacleKind = "wall" | "mud" | "carry" | "net" | "jump";

export interface SpartanObstacle {
  kind: SpartanObstacleKind;
  name: Localized<string>;
  icon: ImageAsset;
  /** Place sur le sentier, de 0 (départ) à 1 (arrivée). */
  at: number;
}

/** Spartan Race : le sentier et ses obstacles, parcourus d'un trait. */
export interface SpartanScene {
  summary: Localized<string>;
  obstacles: readonly SpartanObstacle[];
  /** Sur le sentier, entre deux obstacles. */
  trail: SceneCaption;
  /** Sous le nom de l'obstacle en cours. */
  obstacleHint: Localized<string>;
  /** À l'arrivée, et en mouvement réduit. */
  recap: SceneCaption;
}

export interface BoxingStep {
  /** Le mot de la frise sous la scène. */
  word: Localized<string>;
  caption: SceneCaption;
}

/** Boxe : les bandes, la garde, puis jab et direct au sac. */
export interface BoxingScene {
  summary: Localized<string>;
  icons: { wraps: ImageAsset; bag: ImageAsset; gloves: ImageAsset };
  steps: readonly BoxingStep[];
  /** À la fin, au repos, et en mouvement réduit. */
  recap: SceneCaption;
}

export interface CourseScenes {
  hyrox: HyroxScene;
  spartan: SpartanScene;
  boxe: BoxingScene;
}
export type CourseSceneId = keyof CourseScenes;

export const COURSE_SCENES: CourseScenes = {
  hyrox: {
    summary: {
      fr: "Le HYROX, c’est une formule : 1 km de course, plus 1 station, fois 8. Les 8 stations : SkiErg, traîneau poussé, traîneau tiré, burpees broad jumps, rameur, farmers carry, fentes avec sandbag, wall balls. 8 km et 8 stations, une seule course.",
      en: "HYROX is a formula: 1 km of running, plus 1 station, times 8. The 8 stations: SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmers carry, sandbag lunges, wall balls. 8 km and 8 stations, one single race.",
    },
    run: { icon: sport3dIcon("hyrox-run"), value: "1 km", label: { fr: "de course", en: "of running" } },
    station: {
      value: { fr: "1 station", en: "1 station" },
      label: { fr: "SkiErg, traîneau, rameur…", en: "SkiErg, sled, rowing…" },
    },
    times: "× 8",
    loop: {
      value: { fr: "8 km · 8 stations", en: "8 km · 8 stations" },
      label: { fr: "une seule course", en: "one single race" },
    },
    stations: [
      { icon: sport3dIcon("hyrox-01-skierg"), name: { fr: "SkiErg", en: "SkiErg" } },
      { icon: sport3dIcon("hyrox-02-sled-push"), name: { fr: "Traîneau poussé", en: "Sled push" } },
      { icon: sport3dIcon("hyrox-03-sled-pull"), name: { fr: "Traîneau tiré", en: "Sled pull" } },
      {
        icon: sport3dIcon("hyrox-04-burpee-broad-jump"),
        name: { fr: "Burpees broad jumps", en: "Burpee broad jumps" },
      },
      { icon: sport3dIcon("hyrox-05-row"), name: { fr: "Rameur", en: "Rowing" } },
      { icon: sport3dIcon("hyrox-06-farmers-carry"), name: { fr: "Farmers carry", en: "Farmers carry" } },
      {
        icon: sport3dIcon("hyrox-07-sandbag-lunges"),
        name: { fr: "Fentes avec sandbag", en: "Sandbag lunges" },
      },
      { icon: sport3dIcon("hyrox-08-wall-balls"), name: { fr: "Wall balls", en: "Wall balls" } },
    ],
    finish: sport3dIcon("hyrox-finish"),
  },
  spartan: {
    summary: {
      fr: "Une Spartan Race, en général : un sentier en pleine nature, ponctué d’obstacles : des murs, de la boue sous des barbelés, des charges à porter, des filets à grimper, des sauts.",
      en: "A Spartan Race, in general: a trail out in nature, dotted with obstacles: walls, mud under barbed wire, loads to carry, nets to climb, jumps.",
    },
    obstacles: [
      { kind: "wall", name: { fr: "Mur", en: "Wall" }, icon: sport3dIcon("spartan-mur"), at: 0.14 },
      { kind: "mud", name: { fr: "Boue", en: "Mud" }, icon: sport3dIcon("spartan-boue"), at: 0.33 },
      { kind: "carry", name: { fr: "Portés", en: "Carries" }, icon: sport3dIcon("spartan-portes"), at: 0.52 },
      { kind: "net", name: { fr: "Filet", en: "Net" }, icon: sport3dIcon("spartan-filet"), at: 0.71 },
      { kind: "jump", name: { fr: "Sauts", en: "Jumps" }, icon: sport3dIcon("spartan-saut"), at: 0.89 },
    ],
    trail: { title: { fr: "Course", en: "Running" }, hint: { fr: "sur le sentier", en: "on the trail" } },
    obstacleHint: { fr: "un obstacle", en: "an obstacle" },
    recap: {
      title: { fr: "Course à obstacles", en: "Obstacle race" },
      hint: { fr: "en pleine nature", en: "out in nature" },
    },
  },
  boxe: {
    summary: {
      fr: "La boxe, les bases : les bandes, la garde, puis les coups au sac : le jab, le direct, et les deux enchaînés.",
      en: "Boxing, the basics: hand wraps, the guard, then punches on the bag: the jab, the cross, and the two together.",
    },
    icons: {
      wraps: sport3dIcon("boxe-bandes"),
      bag: sport3dIcon("boxe-sac"),
      gloves: sport3dIcon("boxe-gants"),
    },
    steps: [
      {
        word: { fr: "Bandes", en: "Wraps" },
        caption: {
          title: { fr: "Les bandes", en: "Hand wraps" },
          hint: { fr: "la base, avant tout", en: "the basics, first of all" },
        },
      },
      {
        word: { fr: "Garde", en: "Guard" },
        caption: { title: { fr: "La garde", en: "The guard" }, hint: { fr: "les gants hauts", en: "gloves up" } },
      },
      {
        word: { fr: "Jab", en: "Jab" },
        caption: { title: { fr: "Jab", en: "Jab" }, hint: { fr: "le bras avant", en: "the lead hand" } },
      },
      {
        word: { fr: "Direct", en: "Cross" },
        caption: { title: { fr: "Direct", en: "Cross" }, hint: { fr: "le bras arrière", en: "the rear hand" } },
      },
    ],
    recap: {
      title: { fr: "Les bases", en: "The basics" },
      hint: { fr: "bandes, garde, jab, direct", en: "wraps, guard, jab, cross" },
    },
  },
};

/* ------------------------------------------------------------------------
   Les courses
   ------------------------------------------------------------------------ */

/** Toutes les courses, dans l'ordre de la page Sport. */
export const COURSE_IDS = ["hyrox", "spartan", "boxe"] as const;
export type CourseId = (typeof COURSE_IDS)[number];

export const isCourseId = (value: string): value is CourseId => (COURSE_IDS as readonly string[]).includes(value);

/** Les courses de l'aperçu sur /createur. */
export const CREATEUR_COURSE_IDS: readonly CourseId[] = ["hyrox", "spartan"];

export type CourseStatus = "done" | "ongoing";

/** Un chiffre, en Anton, en discret : `8 stations`. */
export interface CourseFigure {
  value: string;
  label: Localized<string>;
}

export interface CourseVideo {
  title: Localized<string>;
  href: `https://${string}`;
  /** Durée affichée, ex. `7:08`. */
  duration: string;
}

export interface Course {
  name: Localized<string>;
  place?: string;
  date: IsoDate;
  status: CourseStatus;
  /** Deux à trois lignes : ce qu'est la course, ce qu'elle représente pour Kenz. */
  summary: Localized<string>;
  figures: readonly CourseFigure[];
  /** La composition : la première en grand, les suivantes (une ou deux) en décalé. */
  photos: readonly ImageAsset[];
  /** Sans photo : un dessin au trait à la place. */
  drawing?: "ring";
  video?: CourseVideo;
  scene: CourseSceneId;
  /** La fiche : une ou deux phrases, et ses vignettes (par défaut : `photos`). */
  detail: { paragraphs: readonly Localized<string>[]; photos?: readonly ImageAsset[] };
}

export const COURSES: Readonly<Record<CourseId, Course>> = {
  hyrox: {
    name: { fr: "HYROX", en: "HYROX" },
    place: "Riga",
    date: "2025-05-31",
    status: "done",
    summary: {
      fr: "Une course hybride : huit fois un kilomètre de course, chacun suivi d’une station. Mon premier, à Riga, sans entraînement.",
      en: "A hybrid race: eight times one kilometer of running, each followed by a station. My first, in Riga, with no training.",
    },
    figures: [
      { value: "8", label: { fr: "stations", en: "stations" } },
      { value: "8", label: { fr: "km de course", en: "km of running" } },
    ],
    photos: [PHOTOS.rowing, PHOTOS.sledPush, PHOTOS.finalTime],
    video: {
      title: { fr: "Mon premier HYROX sans entraînement !", en: "My first HYROX with no training!" },
      href: "https://www.youtube.com/watch?v=kBNLSpnhrGU",
      duration: "7:08",
    },
    scene: "hyrox",
    detail: {
      paragraphs: [
        {
          fr: "Une course de fitness en salle : 8 fois 1 km de course, chacun suivi d’une station.",
          en: "An indoor fitness race: 8 times 1 km of running, each followed by a station.",
        },
        {
          fr: "Le mien : Riga, le 31 mai 2025. Mon premier, sans entraînement.",
          en: "Mine: Riga, May 31, 2025. My first, with no training.",
        },
      ],
      photos: [PHOTOS.rowing, PHOTOS.sledPush, PHOTOS.wallBall, PHOTOS.finishLine],
    },
  },
  spartan: {
    name: { fr: "Spartan Race", en: "Spartan Race" },
    date: "2025-06",
    status: "done",
    summary: {
      fr: "Une course à obstacles en pleine nature : de la boue, des murs à franchir, des charges à porter.",
      en: "An obstacle race out in nature: mud, walls to get over, loads to carry.",
    },
    figures: [],
    photos: [PHOTOS.spartanStone, PHOTOS.spartanFire],
    scene: "spartan",
    detail: {
      paragraphs: [
        {
          fr: "Une course à obstacles en pleine nature : des murs, de la boue, des charges à porter, des filets, des sauts.",
          en: "An obstacle race out in nature: walls, mud, loads to carry, nets, jumps.",
        },
        { fr: "J’en ai couru une en juin 2025.", en: "I ran one in June 2025." },
      ],
    },
  },
  boxe: {
    name: { fr: "Boxe", en: "Boxing" },
    date: "2026-10-14",
    status: "ongoing",
    summary: {
      fr: "J’apprends les bases : garde, déplacements, technique.",
      en: "I’m learning the basics: guard, footwork, technique.",
    },
    figures: [],
    photos: [],
    drawing: "ring",
    scene: "boxe",
    detail: {
      paragraphs: [
        {
          fr: "Depuis le 14 octobre 2026, j’apprends la boxe.",
          en: "Since October 14, 2026, I’ve been learning to box.",
        },
        {
          fr: "Pour l’instant, les bases : la garde, les déplacements, la technique.",
          en: "For now, the basics: the guard, footwork, technique.",
        },
      ],
    },
  },
};

/* ------------------------------------------------------------------------
   Ce que je partage : les sujets des Shorts (chacun avec son dessin au trait)
   ------------------------------------------------------------------------ */

export type K15zeTopicDrawing = "pizza" | "potatoes" | "pancakes" | "whey-cake";

export interface K15zeTopic {
  drawing: K15zeTopicDrawing;
  name: Localized<string>;
}

export const K15ZE_TOPICS: readonly K15zeTopic[] = [
  { drawing: "pizza", name: { fr: "Pizza entière", en: "A whole pizza" } },
  { drawing: "potatoes", name: { fr: "Grosse assiette de patates", en: "A big plate of potatoes" } },
  { drawing: "pancakes", name: { fr: "Pancakes", en: "Pancakes" } },
  { drawing: "whey-cake", name: { fr: "Gâteau whey", en: "Whey cake" } },
];
