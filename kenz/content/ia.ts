/**
 * « La machine » : aperçu sur l'accueil Pro, version complète sur /agents.
 * Sources : maquettes/v6/shared/ia.js (CAS, ORDRE, BESOINS) et maquettes/v6/agents.html (« Comment on avance »).
 *
 * Les tracés des pictogrammes, les entrées dessinées et le dessin de la fiche sont du code (le composant) :
 * ici, seulement leurs noms et leurs textes. Les ids des cas et les noms des pictos sont ceux de la maquette.
 * Les textes d'interface fixes (« Vous validez », « Dans la vraie vie », « Et chez vous ? »…) vont dans les dictionnaires.
 */
import type { Localized } from "@/i18n/localize";
import type { ImageAsset, RichText } from "@/content/types";

/** Pictogrammes au trait (24 × 24). `vous`, `coche`, `rejouer` et `fleche` servent à la machine elle-même. */
export type IaPicto =
  | "oreille"
  | "ampoule"
  | "balance"
  | "oeil"
  | "cible"
  | "compte"
  | "ciseaux"
  | "eclat"
  | "livre"
  | "dossier"
  | "crayon"
  | "vous"
  | "coche"
  | "video"
  | "photo"
  | "film"
  | "notes"
  | "loupe"
  | "tableur"
  | "produit"
  | "rejouer"
  | "fleche";

/** Les quatre cas, dans l'ordre des boutons de choix. */
export const IA_CASE_IDS = ["recette", "assiette", "video", "projet"] as const;
export type IaCaseId = (typeof IA_CASE_IDS)[number];

/** Entrée dessinée par le composant (des formes, aucune donnée) : vidéo de recette, assiette, rushs, notes. */
export type IaInputDrawing = "recipeVideo" | "plate" | "rushes" | "notes";

/** Une station de la piste : le jeton s'y arrête avant « Vous validez ». */
export interface IaStep {
  picto: IaPicto;
  verb: Localized<string>;
}

/** Cadre de la capture de sortie ; `video` ajoute le bouton lecture. */
export type IaFrame = "portrait" | "landscape" | "video";

export interface IaImageOutput {
  kind: "image";
  frame: IaFrame;
  image: ImageAsset;
  caption: Localized<string>;
}

/** Une ligne de la fiche dessinée : son intitulé et la largeur (%) des traits qui figurent le texte. */
export interface IaSheetRow {
  label: Localized<string>;
  lines: readonly number[];
}

/** La fiche projet dessinée : le vrai format des fiches, sans aucune donnée. */
export interface IaSheetOutput {
  kind: "sheet";
  title: Localized<string>;
  rows: readonly IaSheetRow[];
  caption: Localized<string>;
}

export type IaOutput = IaImageOutput | IaSheetOutput;

export interface IaCase {
  title: Localized<string>;
  /** Pictogramme du bouton de choix. */
  picto: IaPicto;
  input: { drawing: IaInputDrawing; caption: Localized<string> };
  steps: readonly IaStep[];
  output: IaOutput;
  /** Suite de « Dans la vraie vie : » (d'où la minuscule initiale). */
  inRealLife: Localized<string>;
  /** Annonce aux lecteurs d'écran, après « Validé. ». */
  done: Localized<string>;
}

export const IA_CASES: Readonly<Record<IaCaseId, IaCase>> = {
  recette: {
    title: { fr: "Une vidéo devient une recette", en: "A video becomes a recipe" },
    picto: "video",
    input: { drawing: "recipeVideo", caption: { fr: "Une vidéo de recette", en: "A recipe video" } },
    steps: [
      { picto: "oreille", verb: { fr: "Écoute", en: "Listens" } },
      { picto: "ampoule", verb: { fr: "Comprend", en: "Understands" } },
      { picto: "balance", verb: { fr: "Pèse", en: "Weighs" } },
    ],
    output: {
      kind: "image",
      frame: "portrait",
      image: {
        src: "/assets/apps/oshii-ecran-2.jpg",
        width: 462,
        height: 1000,
        alt: {
          fr: "Écran d’Oshii : la fiche « Cheese Nans & Kefta », avec calories, glucides, protéines et lipides.",
          en: "Oshii screen: the “Cheese Nans & Kefta” recipe card, with calories, carbs, protein and fat.",
        },
      },
      caption: { fr: "La recette, pesée et rangée", en: "The recipe, weighed and filed" },
    },
    inRealLife: {
      fr: "c’est Oshii, mon app en ligne sur l’App Store et Google Play.",
      en: "it’s Oshii, my app live on the App Store and Google Play.",
    },
    done: { fr: "La recette est pesée et rangée.", en: "The recipe is weighed and filed." },
  },
  assiette: {
    title: { fr: "Une photo devient un suivi", en: "A photo becomes a food log" },
    picto: "photo",
    input: { drawing: "plate", caption: { fr: "La photo d’un plat", en: "A photo of a dish" } },
    steps: [
      { picto: "oeil", verb: { fr: "Regarde", en: "Looks" } },
      { picto: "cible", verb: { fr: "Reconnaît", en: "Recognizes" } },
      { picto: "compte", verb: { fr: "Compte", en: "Counts" } },
    ],
    output: {
      kind: "image",
      frame: "landscape",
      image: {
        src: "/assets/apps/wado-ecran-1.jpg",
        width: 1000,
        height: 703,
        alt: {
          fr: "Écran de Wado sur tablette : « Muscu et calories, un seul plan », la journée avec le déjeuner à scanner et la séance du jour.",
          en: "Wado on a tablet: “Muscu et calories, un seul plan” (strength training and calories, one plan), the day with lunch to scan and today’s workout.",
        },
      },
      caption: { fr: "Le repas compté, le plan ajusté", en: "The meal counted, the plan adjusted" },
    },
    inRealLife: {
      fr: "c’est Wado, mon app de nutrition et de muscu, sur l’App Store.",
      en: "it’s Wado, my nutrition and strength-training app, on the App Store.",
    },
    done: { fr: "Le repas est compté, le plan s’ajuste.", en: "The meal is counted, the plan adjusts." },
  },
  video: {
    title: { fr: "Des idées deviennent des vidéos", en: "Ideas become videos" },
    picto: "film",
    input: { drawing: "rushes", caption: { fr: "Des rushs et une idée", en: "Raw footage and an idea" } },
    steps: [
      { picto: "oreille", verb: { fr: "Écoute", en: "Listens" } },
      { picto: "ciseaux", verb: { fr: "Coupe", en: "Cuts" } },
      { picto: "eclat", verb: { fr: "Habille", en: "Styles" } },
    ],
    output: {
      kind: "image",
      frame: "video",
      image: {
        src: "/assets/img/video-chine-14-jours.jpg",
        width: 960,
        height: 540,
        alt: {
          fr: "Miniature d’une vidéo de voyage de Kenz : « 14 jours » en Chine, devant la Grande Muraille.",
          en: "Thumbnail of one of Kenz’s travel videos: “14 jours” (14 days) in China, in front of the Great Wall.",
        },
      },
      caption: { fr: "Une vidéo prête à poster", en: "A video ready to post" },
    },
    inRealLife: {
      fr: "c’est mon atelier vidéo : plus de 60 vidéos courtes y sont nées.",
      en: "it’s my video workshop: more than 60 short videos were made there.",
    },
    done: { fr: "La vidéo est prête à poster.", en: "The video is ready to post." },
  },
  projet: {
    title: { fr: "Des notes deviennent un projet clair", en: "Notes become a clear project" },
    picto: "notes",
    input: { drawing: "notes", caption: { fr: "Des notes en vrac", en: "Scattered notes" } },
    steps: [
      { picto: "livre", verb: { fr: "Lit", en: "Reads" } },
      { picto: "dossier", verb: { fr: "Range", en: "Sorts" } },
      { picto: "crayon", verb: { fr: "Met à jour", en: "Updates" } },
    ],
    output: {
      kind: "sheet",
      title: { fr: "Fiche du projet", en: "Project sheet" },
      rows: [
        { label: { fr: "Où on en est", en: "Where things stand" }, lines: [92, 70] },
        { label: { fr: "Prochaine action", en: "Next step" }, lines: [80] },
        { label: { fr: "À vous", en: "Over to you" }, lines: [56] },
      ],
      caption: { fr: "Une fiche claire : où on en est", en: "A clear sheet: where things stand" },
    },
    inRealLife: {
      fr: "c’est mon studio. Des agents ont chacun leur rôle, Hermes les coordonne, et rien ne part sans validation.",
      en: "it’s my studio. Each agent has its own role, Hermes coordinates them, and nothing goes out without sign-off.",
    },
    done: { fr: "La fiche du projet est à jour.", en: "The project sheet is up to date." },
  },
};

/** « Et chez vous ? » : un besoin dans les mots du visiteur, ce que la machine ferait, ce qui lui reste. */
export interface IaNeed {
  picto: IaPicto;
  need: Localized<string>;
  machineDoes: Localized<string>;
  leftToYou: Localized<string>;
}

export const IA_NEEDS: readonly IaNeed[] = [
  {
    picto: "loupe",
    need: {
      fr: "Je passe trop de temps à chercher et trier l’info.",
      en: "I spend too much time finding and sorting information.",
    },
    machineDoes: {
      fr: "Elle suit vos sources, écarte les doublons et vous remet une note datée, chaque ligne avec sa source.",
      en: "It follows your sources, drops the duplicates and hands you a dated note, every line with its source.",
    },
    leftToYou: {
      fr: "Décider quoi faire de l’information.",
      en: "Deciding what to do with the information.",
    },
  },
  {
    picto: "film",
    need: {
      fr: "Je veux publier plus de contenu sans y passer mes soirées.",
      en: "I want to publish more content without giving up my evenings.",
    },
    machineDoes: {
      fr: "Elle prépare les montages, les sous-titres et les visuels, à votre charte.",
      en: "It prepares the edits, the subtitles and the visuals, in your brand style.",
    },
    leftToYou: {
      fr: "Votre voix, votre accord, et la publication.",
      en: "Your voice, your approval, and hitting publish.",
    },
  },
  {
    picto: "dossier",
    need: {
      fr: "Personne ne sait où en est un dossier.",
      en: "Nobody knows where a project stands.",
    },
    machineDoes: {
      fr: "Elle tient une fiche par dossier : où on en est, ce qui a été décidé, la prochaine action.",
      en: "It keeps one sheet per project: where things stand, what was decided, the next step.",
    },
    leftToYou: { fr: "Les décisions.", en: "The decisions." },
  },
  {
    picto: "tableur",
    need: {
      fr: "Mon back-office, c’est un tableur.",
      en: "My back office is a spreadsheet.",
    },
    machineDoes: {
      fr: "Elle vous donne un espace clair pour voir vos chiffres et modifier vos contenus, sans code.",
      en: "It gives you a clear space to see your numbers and edit your content, no code needed.",
    },
    leftToYou: {
      fr: "Les décisions à partir des chiffres.",
      en: "The decisions, based on the numbers.",
    },
  },
  {
    picto: "produit",
    need: {
      fr: "Je veux de l’IA dans mon produit.",
      en: "I want AI in my product.",
    },
    machineDoes: {
      fr: "Elle ajoute une fonction utile, avec un coût suivi et un interrupteur pour l’éteindre en une seconde.",
      en: "It adds a useful feature, with tracked costs and a switch to turn it off in a second.",
    },
    leftToYou: {
      fr: "Le choix de la fonction, et le moment de l’allumer.",
      en: "Choosing the feature, and when to switch it on.",
    },
  },
];

/** « Comment on avance » (/agents) : les trois étapes, dans l'ordre. */
export const IA_METHOD_STEPS: readonly RichText[] = [
  { fr: "On en parle.", en: "We talk it through." },
  { fr: "Je vous montre un premier *prototype*.", en: "I show you a first *prototype*." },
  { fr: "Vous validez, je lance.", en: "You sign off, I launch." },
];
