/**
 * Le Startup Weekend Grenoble : les faits et les médias de la séquence « 54 heures » (accueil Pro).
 * Sources : `maquettes/v6/shared/victoire.js` et `maquettes/v6/BRIEF-V6-EL.md`.
 * Les phrases du récit sont dans le dictionnaire `victoire`. Aucun nom de personne de l'équipe ;
 * pas de classement publié (aucun autre projet n'est nommé).
 * Le lien du site et la couleur or viennent du projet (`content/escapades-libres.ts`, partagé avec `content/apps.ts`) :
 * une seule source, sans importer le contenu de toutes les apps dans la scène client.
 * Tailles d'images relevées avec `sips` sur `maquettes/v6/assets/`.
 */
import type { Localized } from "@/i18n/localize";
import type { HttpsUrl, WebAppSlug } from "@/content/apps";
import { ESCAPADES_LIBRES as project } from "@/content/escapades-libres";
import type { HexColor, ImageAsset, IsoDate } from "@/content/types";

export interface StartupWeekendPhoto extends ImageAsset {
  alt: Localized<string>;
  /** Auteur, crédité sous la photo. */
  credit?: string;
  /** Hauteur (0 à 1) où commence un filigrane, à garder hors du cadre. */
  watermarkFrom?: number;
}

/** Un écran mobile de la plateforme, posé comme planche sur la table de travail (décoratif). */
export interface PlatformArtboard {
  name: Localized<string>;
  image: ImageAsset;
}

export interface StartupWeekend {
  name: string;
  city: string;
  /** Le pays du drapeau, à côté du nom. */
  country: Localized<string>;
  dates: { start: IsoDate; end: IsoDate; label: Localized<string> };
  durationHours: number;
  /** Le rang, et son suffixe ordinal en exposant (1re, 1st). */
  result: { rank: number; ordinal: Localized<string> };
  project: WebAppSlug;
  /** Le nom du projet (podium, légende de la photo). */
  projectName: string;
  site: HttpsUrl;
  color: HexColor;
  photos: {
    /** Le chèque géant, sur scène. */
    check: StartupWeekendPhoto;
    /** L'annonce de la 1re place, bras levés : la photo dans l'arche. */
    win: StartupWeekendPhoto;
    /** L'équipe devant le tableau blanc. */
    team: StartupWeekendPhoto;
  };
  /** La table de travail du design : trois planches, la taille de la sélection, la palette et la police du projet. */
  designDesk: {
    artboards: readonly [PlatformArtboard, PlatformArtboard, PlatformArtboard];
    selectionSize: string;
    swatches: readonly HexColor[];
    typeface: string;
  };
  /** La plateforme en ligne, née de la planche d'accueil. */
  live: ImageAsset;
}

/** Écran mobile de la plateforme (780 × 1688). */
const platformScreen = (file: string): ImageAsset => ({ src: `/assets/el/${file}`, width: 780, height: 1688 });

export const startupWeekend: StartupWeekend = {
  name: "Startup Weekend",
  city: "Grenoble",
  country: { fr: "France", en: "France" },
  dates: {
    start: "2025-11-28",
    end: "2025-11-30",
    label: { fr: "28–30 novembre 2025", en: "November 28–30, 2025" },
  },
  durationHours: 54,
  result: { rank: 1, ordinal: { fr: "re", en: "st" } },
  project: project.slug,
  projectName: project.name,
  site: project.site,
  color: project.tint,
  photos: {
    check: {
      src: "/assets/img/startup-weekend-1.webp",
      width: 1280,
      height: 960,
      quality: 90,
      alt: {
        fr: "L’équipe sur scène avec le chèque géant du Techstars Startup Weekend Grenoble, 15e anniversaire.",
        en: "The team on stage with the giant check from Techstars Startup Weekend Grenoble, 15th anniversary.",
      },
    },
    win: {
      src: "/assets/img/startup-weekend-2.webp",
      width: 1280,
      height: 854,
      quality: 90,
      alt: {
        fr: "Kenz, en t-shirt vert, les deux poings levés au moment de l’annonce de la première place, à côté d’un coéquipier qui lève le poing, au milieu du public qui applaudit.",
        en: "Kenz, in a green T-shirt, both fists in the air as first place is announced, next to a teammate raising his fist, amid an applauding crowd.",
      },
      // Cadrage de la maquette : centré sur les deux qui célèbrent.
      position: "48% 30%",
      watermarkFrom: 0.78,
      credit: "Annie Frénot",
    },
    team: {
      src: "/assets/img/startup-weekend-3.webp",
      width: 960,
      height: 1280,
      quality: 90,
      alt: {
        fr: "L’équipe, réunie devant le tableau blanc couvert de recherches.",
        en: "The team, gathered in front of a whiteboard covered in research.",
      },
    },
  },
  designDesk: {
    artboards: [
      { name: { fr: "Accueil", en: "Home" }, image: platformScreen("el-accueil.jpg") },
      { name: { fr: "Test", en: "Quiz" }, image: platformScreen("el-test.jpg") },
      { name: { fr: "Profil", en: "Profile" }, image: platformScreen("el-profil-aventurier.jpg") },
    ],
    selectionSize: "390 × 844",
    // Le navy et l'or du site d'Escapades Libres.
    swatches: ["#121A2B", project.tint],
    typeface: "Cabinet Grotesk",
  },
  live: {
    src: "/assets/el/el-web-hero.jpg",
    width: 1440,
    height: 900,
    alt: {
      fr: "La plateforme Escapades Libres en ligne : « Voyager libre, ensemble. », un globe et une carte postale de Lisbonne.",
      en: "The Escapades Libres platform, live: “Travel free, together.”, a globe and a postcard from Lisbon.",
    },
  },
};
