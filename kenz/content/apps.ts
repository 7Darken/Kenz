/**
 * Les apps de Kenz (six apps mobiles) et le projet web d'équipe Escapades Libres.
 * Une seule source pour la scène des apps (accueil Pro) et les pages `/apps/[slug]`.
 *
 * Sources : `maquettes/v6/shared/apps.js` (APPS, CODE) et `maquettes/v6/app.html`
 * (table T des couleurs, objet D, gabarits « Comment ça marche » et « En vrai »).
 * Les libellés d'interface (« Comment ça marche », « En vrai », « Sous le capot »…) sont dans le dictionnaire `apps`.
 * Tailles d'images relevées avec `sips` sur `maquettes/v6/assets/`.
 */
import type { Localized } from "@/i18n/localize";
import { ESCAPADES_LIBRES } from "@/content/escapades-libres";
import type { HexColor, ImageAsset, IsoDate, RgbTriplet, RichText } from "@/content/types";

export const APP_SLUGS = ["oshii", "wado", "sago", "croc", "miru", "zenko", "escapades-libres"] as const;
export type AppSlug = (typeof APP_SLUGS)[number];
export type WebAppSlug = Extract<AppSlug, "escapades-libres">;
export type MobileAppSlug = Exclude<AppSlug, WebAppSlug>;

/** Ordre d'arrivée des astres dans la scène des apps. */
export const SPACE_ORDER: readonly MobileAppSlug[] = ["oshii", "wado", "sago", "croc", "miru", "zenko"];

/** Chaîne « L'histoire suivante » : elle boucle ; Escapades Libres est hors chaîne et mène à son début. */
const STORY_ORDER: readonly MobileAppSlug[] = ["oshii", "sago", "wado", "croc", "miru", "zenko"];

/** Le code secret : les astres à relier sans lâcher, dans cet ordre (seul passage Pro → Créateur). */
export const CONSTELLATION_CODE: readonly MobileAppSlug[] = ["wado", "oshii", "sago", "croc"];

/** Jour du relevé des versions : au-delà de 60 jours, la maquette donne la date plutôt que « il y a … ». */
export const RELEASES_CHECKED_ON: IsoDate = "2026-11-11";

export type HttpsUrl = `https://${string}`;

export interface AppColors {
  /** L'aplat de l'app. */
  tint: HexColor;
  tintRgb: RgbTriplet;
  /** La lumière du thème sombre (aura, fil, arche, loupe). */
  light: HexColor;
  lightRgb: RgbTriplet;
  /** Texte de la couleur de l'app sur fond clair (contraste AA). */
  dark: HexColor;
}

export interface AppStoreLink {
  store: "app-store" | "google-play";
  href: HttpsUrl;
}

/** Un temps de « Comment ça marche » ; `at` : l'instant (s) de l'animation où il s'allume. */
export interface AppBeat {
  at: number;
  text: Localized<string>;
}

export interface AppStep {
  text: Localized<string>;
  /** L'étape faite par un modèle d'IA (nœud étincelle). */
  ai?: true;
}

/** « L'IA, en clair » : les étapes, ou (Croc) le choix de s'en passer. */
export type AppAiChapter =
  | { kind: "steps"; steps: readonly AppStep[] }
  | { kind: "none"; statement: RichText; detail: Localized<string> };

/** « Sous le capot ». Sans titre propre, l'interface dit « La chaîne » et « Les défis ». */
export interface AppEngine {
  title?: Localized<string>;
  chain: readonly Localized<string>[];
  fallback?: Localized<string>;
  takeaway?: Localized<string>;
  challengesTitle?: Localized<string>;
  challenges?: readonly Localized<string>[];
}

/** « En vrai » : deux écrans portrait (duo), deux écrans paysage (land) ou un seul (solo). */
export type AppShots =
  | { layout: "duo" | "land"; images: readonly [ImageAsset, ImageAsset] }
  | { layout: "solo"; images: readonly [ImageAsset] };

export interface AppRelease {
  /** Sortie sur l'App Store (« Sur l'App Store depuis <mois année> »). */
  date: IsoDate;
  version: string;
  updated: IsoDate;
  /** Phrase ajoutée après la date de sortie. */
  also?: Localized<string>;
  /** La première app de Kenz : la ligne le dit, et la version s'affiche sans date de mise à jour. */
  first?: true;
}

/** Aperçu de la fiche : un éventail de vraies captures App Store, ou (Zenko) la mini-animation puis sa capture. */
export type AppSpacePreview =
  | { kind: "gallery"; screens: readonly ImageAsset[] }
  | { kind: "animation"; alt: Localized<string>; screen: ImageAsset };

/** La fiche holographique de l'astre (scène des apps). */
export interface AppSpaceCard {
  domain: Localized<string>;
  line: Localized<string>;
  /** Deux ou trois phrases reprises des captures (rien d'inventé). */
  points?: readonly Localized<string>[];
  preview: AppSpacePreview;
}

interface StoryBase {
  /** L'accroche, sous le nom. */
  hook: RichText;
  problem: RichText;
  beats: readonly [AppBeat, AppBeat, AppBeat];
  /** Description de l'animation de « Comment ça marche ». */
  demoAlt: Localized<string>;
  engine: AppEngine;
}

export interface MobileAppStory extends StoryBase {
  /** Ouvre aussi « L'histoire suivante » sur la page de l'app précédente. */
  question: RichText;
  audience: Localized<string>;
  ai: AppAiChapter;
  shots: AppShots;
  release: AppRelease;
  stores: readonly [AppStoreLink, ...AppStoreLink[]];
  site?: HttpsUrl;
}

export interface WebAppStory extends StoryBase {
  /** « Mon rôle » remplace « L'IA, en clair » ; les quatre dessins des étapes sont du code. */
  role: { title: Localized<string>; steps: readonly AppStep[]; end: RichText };
  /** Le chapitre « 54 heures » (faits complets dans `content/startup-weekend.ts`). */
  weekend: { dates: Localized<string>; photo: ImageAsset };
  /** « En vrai » : la plateforme dans une fenêtre de navigateur (landing entière qui défile, haut de page, page du test). */
  browser: { page: ImageAsset; hero: ImageAsset; detail: ImageAsset };
  site: HttpsUrl;
}

interface AppBase {
  name: string;
  colors: AppColors;
}

export interface MobileApp extends AppBase {
  kind: "mobile";
  slug: MobileAppSlug;
  icon: ImageAsset;
  space: AppSpaceCard;
  story: MobileAppStory;
}

export interface WebApp extends AppBase {
  kind: "web";
  slug: WebAppSlug;
  /** Le nom sur deux lignes, à l'arrivée. */
  nameLines: readonly [string, string];
  /** Le motif du logo (deux arcs, dessinés en SVG) à la place d'une icône d'app : sa description. */
  mark: { label: Localized<string> };
  story: WebAppStory;
}

export type App = MobileApp | WebApp;

type AppsBySlug = { readonly [S in MobileAppSlug]: MobileApp & { slug: S } } & {
  readonly "escapades-libres": WebApp & { slug: "escapades-libres" };
};

const APP_STORE = "https://apps.apple.com/";

const appIcon = (slug: MobileAppSlug, alt: Localized<string>): ImageAsset => ({
  src: `/assets/apps/${slug}-icone.jpg`,
  width: 320,
  height: 320,
  alt,
});

/** Capture App Store iPhone (toutes en 600 × 1305). Sans `alt` : décorative (éventail de la fiche). */
const storeScreen = (slug: MobileAppSlug, n: string, alt?: Localized<string>): ImageAsset => ({
  src: `/assets/apps/${slug}/${n}.webp`,
  width: 600,
  height: 1305,
  ...(alt && { alt }),
});

const gallery = (slug: MobileAppSlug, screens: readonly string[]): AppSpacePreview => ({
  kind: "gallery",
  screens: screens.map((n) => storeScreen(slug, n)),
});

export const apps: AppsBySlug = {
  oshii: {
    kind: "mobile",
    slug: "oshii",
    name: "Oshii",
    colors: { tint: "#E5483B", tintRgb: "229 72 59", light: "#FF9384", lightRgb: "255 147 132", dark: "#B8322A" },
    icon: appIcon("oshii", { fr: "Icône d’Oshii", en: "Oshii app icon" }),
    space: {
      domain: { fr: "Cuisine", en: "Cooking" },
      line: { fr: "Ta vidéo TikTok devient une vraie recette.", en: "Your TikTok video becomes a real recipe." },
      points: [
        {
          fr: "Ta vidéo TikTok, Instagram ou YouTube devient une recette.",
          en: "Your TikTok, Instagram or YouTube video becomes a recipe.",
        },
        { fr: "Pas à pas, avec quantités et minuteurs.", en: "Step by step, with quantities and timers." },
        { fr: "Ta liste de courses se fait toute seule.", en: "Your shopping list writes itself." },
      ],
      preview: gallery("oshii", ["01", "02", "03", "04"]),
    },
    story: {
      question: {
        fr: "Et si tes recettes TikTok devenaient de *vraies* recettes ?",
        en: "What if your TikTok recipes became *real* recipes?",
      },
      hook: {
        fr: "Partage la vidéo à Oshii : elle devient une recette pesée, prête à *cuisiner*.",
        en: "Share the video with Oshii: it turns into a recipe with exact quantities, ready to *cook*.",
      },
      problem: {
        fr: "Tu enregistres des recettes sur TikTok. Tu ne les refais *jamais*.",
        en: "You save recipes on TikTok. You *never* make them.",
      },
      audience: {
        fr: "Pour qui sauvegarde des recettes sur les réseaux.",
        en: "For anyone who saves recipes on social media.",
      },
      beats: [
        { at: 0, text: { fr: "Une recette passe sur TikTok.", en: "A recipe pops up on TikTok." } },
        { at: 1.15, text: { fr: "Tu la partages à Oshii.", en: "You share it with Oshii." } },
        { at: 2.25, text: { fr: "Elle devient une fiche pesée.", en: "It becomes a recipe card with exact quantities." } },
      ],
      demoAlt: {
        fr: "Animation : une vidéo de recette, « pâtes crémeuses au citron », est partagée à Oshii. Elle se replie dans l’icône et devient une fiche pesée : pâtes 200 g, parmesan 40 g, citron 1, crème 10 cl, 4 étapes.",
        en: "Animation: a recipe video, “creamy lemon pasta”, is shared to Oshii. It folds into the icon and becomes a recipe card with exact quantities: pasta 200 g, parmesan 40 g, 1 lemon, cream 10 cl, 4 steps.",
      },
      ai: {
        kind: "steps",
        steps: [
          { text: { fr: "Tu partages une vidéo.", en: "You share a video." } },
          { text: { fr: "J’en extrais le son.", en: "I extract the audio." } },
          { text: { fr: "Je le transcris.", en: "I transcribe it." } },
          {
            text: {
              fr: "Un modèle d’IA en tire la recette, pesée.",
              en: "An AI model turns it into a recipe, with exact quantities.",
            },
            ai: true,
          },
        ],
      },
      engine: {
        chain: [
          {
            fr: "Partage depuis TikTok, Instagram ou YouTube Shorts",
            en: "Shared from TikTok, Instagram or YouTube Shorts",
          },
          { fr: "Détection de la plateforme et métadonnées", en: "Platform detection and metadata" },
          { fr: "Extraction de l’audio", en: "Audio extraction" },
          { fr: "Transcription (Whisper)", en: "Transcription (Whisper)" },
          { fr: "Analyse par un LLM (OpenAI ou Gemini)", en: "Analysis by an LLM (OpenAI or Gemini)" },
          { fr: "Fiche recette pesée et rangée", en: "A recipe card with exact quantities, filed away" },
        ],
        fallback: {
          fr: "Pour YouTube, Gemini analyse directement la vidéo ; si ça échoue, Whisper prend le relais.",
          en: "For YouTube, Gemini analyzes the video directly; if that fails, Whisper takes over.",
        },
        takeaway: {
          fr: "Le fournisseur de modèle se change par une variable : je ne réécris pas l’app quand un modèle change.",
          en: "The model provider is switched with a single variable: I don’t rewrite the app when a model changes.",
        },
        challenges: [
          {
            fr: "Partage entrant natif depuis TikTok, Instagram et YouTube.",
            en: "Native share-in from TikTok, Instagram and YouTube.",
          },
          {
            fr: "Miniatures TikTok cassées par l’oEmbed le 16/10 : repli yt-dlp avec garde SSRF et rattrapage.",
            en: "TikTok thumbnails broken by oEmbed on October 16: a yt-dlp fallback with an SSRF guard, plus a backfill.",
          },
          {
            fr: "Liste de courses hors ligne : file d’actions et identifiants créés sur le téléphone.",
            en: "Offline shopping list: an action queue and IDs created on the phone.",
          },
        ],
      },
      shots: {
        layout: "duo",
        images: [
          storeScreen("oshii", "01", {
            fr: "Écran App Store d’Oshii : « Ta vidéo de cuisine devient une recette. », un cookie pie fondant tiré d’une vidéo TikTok, avec ses ingrédients.",
            en: "Oshii App Store screen: “Your cooking video becomes a recipe.” A gooey cookie pie taken from a TikTok video, with its ingredients.",
          }),
          storeScreen("oshii", "03", {
            fr: "Écran App Store d’Oshii : « La même recette, version allégée. », le cookie pie fondant avec ses calories et ses macros recalculées.",
            en: "Oshii App Store screen: “The same recipe, made lighter.” The gooey cookie pie with its calories and macros recalculated.",
          }),
        ],
      },
      release: {
        date: "2025-11-06",
        version: "2.0.2",
        updated: "2026-11-04",
        also: { fr: "Aussi sur Android.", en: "Also on Android." },
      },
      stores: [
        { store: "app-store", href: `${APP_STORE}fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905` },
        { store: "google-play", href: "https://play.google.com/store/apps/details?id=com.x7kenz.Oshii" },
      ],
      site: "https://www.oshii.fr/",
    },
  },

  wado: {
    kind: "mobile",
    slug: "wado",
    name: "Wado",
    colors: { tint: "#2F7A55", tintRgb: "47 122 85", light: "#8ADBAE", lightRgb: "138 219 174", dark: "#24684A" },
    icon: appIcon("wado", { fr: "Icône de Wado", en: "Wado app icon" }),
    space: {
      domain: { fr: "Sport & nutrition", en: "Fitness & nutrition" },
      line: { fr: "Une photo de ton plat, et ton plan s’ajuste.", en: "A photo of your meal, and your plan adjusts." },
      points: [
        { fr: "Ton repas en photo, calories et macros comptées.", en: "Snap your meal: calories and macros, counted." },
        { fr: "Charge et reps exactes, à chaque série.", en: "Exact weight and reps, every set." },
        { fr: "Une date estimée pour ton poids cible.", en: "An estimated date for your goal weight." },
      ],
      preview: gallery("wado", ["01", "02", "03", "04"]),
    },
    story: {
      question: {
        fr: "Compter ses calories ? Personne n’a le *temps*.",
        en: "Counting calories? Nobody has the *time*.",
      },
      hook: {
        fr: "Une photo de ton plat. Wado compte, et ajuste ton *plan*.",
        en: "A photo of your meal. Wado counts, and adjusts your *plan*.",
      },
      problem: {
        fr: "Peser, noter, additionner : compter ses calories, c’est *pénible*.",
        en: "Weighing, logging, adding up: counting calories is a *chore*.",
      },
      audience: { fr: "Pour qui s’entraîne en salle.", en: "For anyone who trains at the gym." },
      beats: [
        { at: 0, text: { fr: "Tu prends ton plat en photo.", en: "You snap a photo of your meal." } },
        { at: 1.65, text: { fr: "Wado reconnaît, et compte.", en: "Wado recognizes it, and counts." } },
        { at: 2.3, text: { fr: "Ta journée se met à jour.", en: "Your day updates." } },
      ],
      demoAlt: {
        fr: "Animation : une assiette est scannée. Les macros apparaissent : protéines 38 g, glucides 62 g, lipides 14 g, environ 520 kcal, puis l’anneau « Ta journée » se remplit. Données d’exemple.",
        en: "Animation: a plate is scanned. The macros appear: protein 38 g, carbs 62 g, fat 14 g, about 520 kcal, then the “Your day” ring fills up. Sample data.",
      },
      ai: {
        kind: "steps",
        steps: [
          { text: { fr: "Tu prends ton plat en photo.", en: "You snap a photo of your meal." } },
          { text: { fr: "Un modèle d’IA reconnaît les aliments.", en: "An AI model recognizes the food." }, ai: true },
          { text: { fr: "Je calcule les macros.", en: "I calculate the macros." } },
          { text: { fr: "Tout s’ajoute à ta journée.", en: "It all goes into your day." } },
        ],
      },
      engine: {
        chain: [
          { fr: "Photo du plat", en: "Photo of the meal" },
          { fr: "Reconnaissance des aliments (Gemini vision)", en: "Food recognition (Gemini vision)" },
          { fr: "Calcul des macros", en: "Macro calculation" },
          { fr: "Ajout au journal du jour", en: "Added to today’s log" },
        ],
        fallback: {
          fr: "Provider « mock » hors ligne pour développer et tester ; paywall doux au moment de la limite quotidienne.",
          en: "An offline “mock” provider for building and testing; a soft paywall when the daily limit is reached.",
        },
        takeaway: {
          fr: "Un mode factice d’abord : je teste tout le parcours sans payer un seul appel.",
          en: "A mock mode first: I test the whole flow without paying for a single call.",
        },
        challenges: [
          {
            fr: "Moteur de programmes qui donne la charge exacte (« 42 kg × 8 »).",
            en: "A program engine that gives the exact load (“42 kg × 8”).",
          },
          {
            fr: "14 widgets iOS (accueil et écran verrouillé).",
            en: "14 iOS widgets (Home Screen and Lock Screen).",
          },
          {
            fr: "Plan repas de 7 jours sur un catalogue de 120 recettes, liste de courses et meal prep.",
            en: "A 7-day meal plan drawn from a catalog of 120 recipes, with a shopping list and meal prep.",
          },
        ],
      },
      shots: {
        layout: "land",
        images: [
          {
            src: "/assets/apps/wado-ecran-1.jpg",
            width: 1000,
            height: 703,
            alt: {
              fr: "Écran de Wado sur tablette : « Muscu et calories, un seul plan », la journée avec le déjeuner à scanner et la séance du jour.",
              en: "Wado on a tablet: “Lifting and calories, one plan.” The day, with lunch to scan and today’s workout.",
            },
          },
          {
            src: "/assets/apps/wado-ecran-2.jpg",
            width: 1000,
            height: 703,
            alt: {
              fr: "Écran de Wado sur tablette : « Ton repas en photo, calories comptées », un plat de saumon, riz et brocoli, 665 kcal et ses macros.",
              en: "Wado on a tablet: “Snap your meal, calories counted.” A plate of salmon, rice and broccoli, 665 kcal, with its macros.",
            },
          },
        ],
      },
      release: { date: "2026-10-10", version: "1.1.1", updated: "2026-11-04" },
      stores: [{ store: "app-store", href: `${APP_STORE}us/app/wado-calories-ia-muscu/id6813179120` }],
      site: "https://wado-lilac.vercel.app",
    },
  },

  sago: {
    kind: "mobile",
    slug: "sago",
    name: "Sago",
    colors: { tint: "#5B4BC4", tintRgb: "91 75 196", light: "#B3A8FF", lightRgb: "179 168 255", dark: "#4A3BB0" },
    icon: appIcon("sago", { fr: "Icône de Sago", en: "Sago app icon" }),
    space: {
      domain: { fr: "Japonais", en: "Japanese" },
      line: {
        fr: "Le japonais, par l’image, épisode par épisode.",
        en: "Japanese through pictures, one episode at a time.",
      },
      points: [
        { fr: "Le japonais, comme dans un anime.", en: "Japanese, just like in an anime." },
        { fr: "Un épisode de 15 minutes, chaque jour.", en: "A 15-minute episode, every day." },
        { fr: "Chaque mot, épinglé à sa place dans l’image.", en: "Every word, pinned right where it is in the picture." },
      ],
      preview: gallery("sago", ["01", "02", "03", "04", "06"]),
    },
    story: {
      question: {
        fr: "Le japonais, ça a l’air *impossible* ?",
        en: "Does Japanese seem *impossible*?",
      },
      hook: {
        fr: "Là, tu ne comprends rien. 15 minutes plus tard : maintenant, tu *comprends*.",
        en: "Right now, none of it makes sense. 15 minutes later: now you *understand*.",
      },
      problem: {
        fr: "Des flashcards, encore des flashcards. Et tu finis par *lâcher*.",
        en: "Flashcards, then more flashcards. And eventually you *quit*.",
      },
      audience: {
        fr: "Pour qui débute, surtout après un premier abandon. Et pour les fans d’animés.",
        en: "For beginners, especially after a first attempt that didn’t stick. And for anime fans.",
      },
      beats: [
        { at: 0, text: { fr: "Une phrase que tu ne sais pas lire.", en: "A sentence you can’t read." } },
        { at: 0.15, text: { fr: "Chaque mot prend une image.", en: "Each word gets a picture." } },
        { at: 2.3, text: { fr: "Et la phrase prend son sens.", en: "And the sentence makes sense." } },
      ],
      demoAlt: {
        fr: "Animation : la phrase japonaise « ねこ が すき », d’abord floue. Un chat se dessine au-dessus de ねこ, un cœur au-dessus de すき, les mots deviennent nets et la traduction apparaît : « J’aime les chats. »",
        en: "Animation: the Japanese sentence “ねこ が すき”, blurry at first. A cat is drawn above ねこ, a heart above すき, the words come into focus and the translation appears: “I like cats.”",
      },
      ai: {
        kind: "steps",
        steps: [
          { text: { fr: "J’écris les épisodes avec des agents IA.", en: "I write the episodes with AI agents." }, ai: true },
          { text: { fr: "Je relis, je compile, je valide.", en: "I review, compile and validate." } },
          { text: { fr: "Je publie, et je peux revenir en arrière.", en: "I publish, and I can roll back." } },
          {
            text: {
              fr: "Dans l’app, aucune IA : tout est déjà relu.",
              en: "In the app, no AI: everything has already been reviewed.",
            },
          },
        ],
      },
      engine: {
        chain: [
          { fr: "Écriture (agents + auteur)", en: "Writing (agents + author)" },
          { fr: "Compilation", en: "Compilation" },
          { fr: "Validation", en: "Validation" },
          { fr: "Publication", en: "Publishing" },
          { fr: "Activation", en: "Activation" },
          { fr: "Retour arrière par version", en: "Per-version rollback" },
        ],
        fallback: {
          fr: "Chaque version de contenu peut être réactivée ; un correctif peut partir côté contenu sans nouvelle version de l’app.",
          en: "Any content version can be reactivated; a fix can ship on the content side without a new app release.",
        },
        takeaway: {
          fr: "L’IA travaille avant, pas devant l’utilisateur : le contenu est écrit, relu, compilé et réversible.",
          en: "The AI works upstream, not in front of the user: the content is written, reviewed, compiled and reversible.",
        },
        challenges: [
          { fr: "Un compilateur qui refuse un arc incomplet.", en: "A compiler that rejects an incomplete story arc." },
          {
            fr: "Ordre de mise en prod imposé : migration → serveur → contenu → build.",
            en: "A strict release order: migration → server → content → build.",
          },
          {
            fr: "Correctif « bloqué au rebondissement » livré côté contenu, sans attendre une version de l’app.",
            en: "A “stuck at the plot twist” fix shipped on the content side, without waiting for an app release.",
          },
        ],
      },
      shots: {
        layout: "duo",
        images: [
          storeScreen("sago", "01", {
            fr: "Écran App Store de Sago : « Le japonais, comme dans un anime. », une scène d’anime sur un quai de gare et la phrase « ここは東京駅です。 ».",
            en: "Sago App Store screen: “Japanese, just like in an anime.” An anime scene on a station platform, with the sentence “ここは東京駅です。”",
          }),
          storeScreen("sago", "02", {
            fr: "Écran App Store de Sago : « Un épisode. 15 minutes. », l’accueil du jour avec l’épisode « Payer au konbini ».",
            en: "Sago App Store screen: “One episode. 15 minutes.” Today’s home screen, with the episode “Paying at the konbini”.",
          }),
        ],
      },
      release: {
        date: "2026-04-08",
        version: "2.0.1",
        updated: "2026-10-30",
        also: { fr: "Aussi sur iPad.", en: "Also on iPad." },
      },
      stores: [{ store: "app-store", href: `${APP_STORE}fr/app/sago-apprendre-le-japonais/id6759610780` }],
      site: "https://sago-landing.vercel.app",
    },
  },

  croc: {
    kind: "mobile",
    slug: "croc",
    name: "Croc",
    colors: { tint: "#8E7CF0", tintRgb: "142 124 240", light: "#CBC1FF", lightRgb: "203 193 255", dark: "#6A55D8" },
    icon: appIcon("croc", { fr: "Icône de Croc", en: "Croc app icon" }),
    space: {
      domain: { fr: "Bonnes habitudes", en: "Good habits" },
      line: {
        fr: "Un petit pacte par jour pour arrêter de te ronger les ongles.",
        en: "One small pact a day to stop biting your nails.",
      },
      points: [
        { fr: "Un pacte par jour, sans te juger.", en: "One pact a day, no judgment." },
        { fr: "Une envie ? 30 secondes guidées pour tenir.", en: "An urge? 30 guided seconds to hold on." },
        { fr: "Un rappel juste avant tes heures à risque.", en: "A reminder just before your high-risk hours." },
      ],
      preview: gallery("croc", ["01", "02", "03", "04", "05"]),
    },
    story: {
      question: {
        fr: "Tu te ronges les ongles depuis *toujours* ?",
        en: "Been biting your nails *forever*?",
      },
      hook: {
        fr: "Un petit pacte le matin, validé le soir. Croc t’accompagne, sans te *juger*.",
        en: "A small pact in the morning, checked off at night. Croc has your back, without *judging* you.",
      },
      problem: {
        fr: "Tu le fais sans y penser. Et les rappels ne *tiennent* pas.",
        en: "You do it without thinking. And reminders never *stick*.",
      },
      audience: {
        fr: "Pour qui veut arrêter de se ronger les ongles, avec bienveillance.",
        en: "For anyone who wants to stop biting their nails, with kindness.",
      },
      beats: [
        { at: 0, text: { fr: "Le matin, tu t’engages.", en: "In the morning, you commit." } },
        { at: 0.8, text: { fr: "Le soir, tu valides.", en: "At night, you check in." } },
        { at: 1.3, text: { fr: "Jour après jour, ta série grandit.", en: "Day after day, your streak grows." } },
      ],
      demoAlt: {
        fr: "Animation : le matin, « Je m’engage » se coche ; le soir, « Tenu ». Les jours de la semaine se cochent un à un et la série monte jusqu’à 12 jours. « Cette série tient. Bravo. » Données d’exemple.",
        en: "Animation: in the morning, “I commit” gets checked; at night, “Kept”. The days of the week are ticked off one by one and the streak climbs to 12 days. “This streak is holding. Well done.” Sample data.",
      },
      ai: {
        kind: "none",
        statement: { fr: "Pas d’IA ici, et c’est un *choix*.", en: "No AI here, and that’s a *choice*." },
        detail: { fr: "Une logique simple et testée suffit.", en: "Simple, tested logic is all it takes." },
      },
      engine: {
        title: { fr: "Comment c’est fait", en: "How it’s built" },
        chain: [
          {
            fr: "« Rien de calculable ne vit dans un composant » : logique pure et testée.",
            en: "“Nothing computable lives in a component”: pure, tested logic.",
          },
          {
            fr: "Mode hors ligne après connexion, synchro où le serveur fusionne.",
            en: "Offline mode after sign-in, with a sync where the server merges.",
          },
          {
            fr: "Analytics produit maison : actifs, rétention J1/J7/J30, tunnel onboarding → premier pacte.",
            en: "In-house product analytics: active users, D1/D7/D30 retention, onboarding → first pact funnel.",
          },
          {
            fr: "Rappels dégressifs ; journal photo avant/après.",
            en: "Reminders that taper off; a before/after photo journal.",
          },
          {
            fr: "Six widgets iOS, six sons de bois et un seul ressort d’animation.",
            en: "Six iOS widgets, six wooden sounds and a single animation spring.",
          },
        ],
      },
      shots: {
        layout: "land",
        images: [
          {
            src: "/assets/apps/croc-ecran-1.jpg",
            width: 1000,
            height: 687,
            alt: {
              fr: "Écran de Croc sur tablette : « Arrête de te ronger les ongles », une série de 12 jours et la promesse du matin.",
              en: "Croc on a tablet: “Stop biting your nails.” A 12-day streak and the morning pledge.",
            },
          },
          {
            src: "/assets/apps/croc-ecran-2.jpg",
            width: 1000,
            height: 687,
            alt: {
              fr: "Écran de Croc sur tablette : « Vois tes ongles changer », les deux mains en photo, avant et après (images d’illustration).",
              en: "Croc on a tablet: “Watch your nails change.” Photos of both hands, before and after (illustrative images).",
            },
          },
        ],
      },
      release: { date: "2026-09-23", version: "1.2.1", updated: "2026-10-19" },
      stores: [{ store: "app-store", href: `${APP_STORE}app/croc-stop-ongles-rong%C3%A9s/id6801541157` }],
      site: "https://croc-snowy.vercel.app",
    },
  },

  miru: {
    kind: "mobile",
    slug: "miru",
    name: "Miru",
    colors: { tint: "#4B5FD6", tintRgb: "75 95 214", light: "#A7B3FF", lightRgb: "167 179 255", dark: "#3B4EC0" },
    icon: appIcon("miru", { fr: "Icône de Miru", en: "Miru app icon" }),
    space: {
      domain: { fr: "Jeux entre amis", en: "Games with friends" },
      line: { fr: "Un thème, et le jeu se crée en direct.", en: "One theme, and the game builds itself live." },
      points: [
        { fr: "9 jeux de soirée, zéro préparation.", en: "9 party games, zero prep." },
        {
          fr: "Un seul tél, ou chacun le sien, même à distance.",
          en: "One phone, or one each, even from a distance.",
        },
        { fr: "Écris une idée, Miru crée les mots.", en: "Type an idea, Miru comes up with the words." },
      ],
      preview: gallery("miru", ["01", "02", "03", "04", "05"]),
    },
    story: {
      question: {
        fr: "Ce soir, on joue à *quoi* ?",
        en: "What are we *playing* tonight?",
      },
      hook: {
        fr: "Tu choisis un thème, Miru crée le jeu en *direct*.",
        en: "You pick a theme, Miru builds the game *live*.",
      },
      problem: {
        fr: "Pas de cartes, rien de prêt, et tout le monde *attend*.",
        en: "No cards, nothing ready, and everyone’s *waiting*.",
      },
      audience: {
        fr: "Pour les groupes d’amis et les familles, de 3 à 12 personnes.",
        en: "For groups of friends and families, from 3 to 12 people.",
      },
      beats: [
        { at: 0, text: { fr: "Tu choisis un thème.", en: "You pick a theme." } },
        { at: 1.05, text: { fr: "Miru crée les cartes et les distribue.", en: "Miru creates the cards and deals them." } },
        { at: 2.55, text: { fr: "Un seul téléphone passe de main en main.", en: "A single phone gets passed around." } },
      ],
      demoAlt: {
        fr: "Animation : le thème « Les films des années 2000 » s’écrit. Des cartes se battent puis se distribuent à cinq joueurs en cercle, et un téléphone passe de main en main.",
        en: "Animation: the theme “2000s movies” types itself out. Cards are shuffled, then dealt to five players sitting in a circle, and a phone is passed from hand to hand.",
      },
      ai: {
        kind: "steps",
        steps: [
          { text: { fr: "Le groupe choisit un thème.", en: "The group picks a theme." } },
          { text: { fr: "Un modèle d’IA écrit le jeu.", en: "An AI model writes the game." }, ai: true },
          { text: { fr: "Tu le vois se construire en direct.", en: "You watch it come together live." } },
          { text: { fr: "La partie démarre.", en: "The game begins." } },
        ],
      },
      engine: {
        chain: [
          { fr: "Le groupe choisit un thème", en: "The group picks a theme" },
          { fr: "File BullMQ avec quota", en: "BullMQ queue with a quota" },
          { fr: "Génération (OpenAI ou Gemini)", en: "Generation (OpenAI or Gemini)" },
          { fr: "Thème reçu en streaming (SSE)", en: "Theme streamed in (SSE)" },
          { fr: "La partie démarre", en: "The game begins" },
        ],
        takeaway: {
          fr: "La génération passe par une file avec quota et arrive en streaming : on voit le thème se construire.",
          en: "Generation goes through a queue with a quota and streams in: you watch the theme take shape.",
        },
        challenges: [
          {
            fr: "Temps réel multi-appareils : salons, chronos pausables, reprise après fermeture de l’app.",
            en: "Real time across devices: rooms, pausable timers, picking up again after the app is closed.",
          },
          {
            fr: "Mode TV appairé par code ; invité qui joue depuis le navigateur.",
            en: "TV mode paired with a code; guests can play from the browser.",
          },
          { fr: "Rôles et révélations par glissement.", en: "Swipe to reveal roles." },
        ],
      },
      shots: {
        layout: "solo",
        images: [
          storeScreen("miru", "04", {
            fr: "Écran App Store de Miru : « Chacun son tél, même à distance », le salon de jeu avec le code de la partie et les joueurs.",
            en: "Miru App Store screen: “Everyone on their own phone, even from a distance.” The game lobby, with the game code and the players.",
          }),
        ],
      },
      release: {
        date: "2026-04-17",
        version: "2.0",
        updated: "2026-10-30",
        also: {
          fr: "Aussi dans le navigateur, pour les invités et la télé.",
          en: "Also in the browser, for guests and the TV.",
        },
      },
      stores: [{ store: "app-store", href: `${APP_STORE}us/app/miru-jeux-entre-amis/id6761622088` }],
      site: "https://v0-miru-website.vercel.app",
    },
  },

  zenko: {
    kind: "mobile",
    slug: "zenko",
    name: "Zenko",
    colors: { tint: "#A0613A", tintRgb: "160 97 58", light: "#EDB78E", lightRgb: "237 183 142", dark: "#8A4F2C" },
    icon: appIcon("zenko", { fr: "Icône de Zenko", en: "Zenko app icon" }),
    space: {
      domain: { fr: "Idées de journée", en: "Day plans" },
      line: {
        fr: "Ta journée composée selon tes envies et ton budget.",
        en: "Your day, planned around what you want to do and your budget.",
      },
      preview: {
        kind: "animation",
        alt: {
          fr: "Animation : le curseur du budget glisse de 40 € à 25 €, et le matin, l’après-midi et le soir se recomposent avec des activités moins chères. Données d’exemple. Puis un écran de l’app.",
          en: "Animation: the budget slider moves from €40 to €25, and the morning, afternoon and evening rearrange themselves with cheaper activities. Sample data. Then a screen from the app.",
        },
        screen: { src: "/assets/apps/zenko-ecran-1.jpg", width: 462, height: 1000 },
      },
    },
    story: {
      question: {
        fr: "Une journée à remplir, un budget à *tenir* ?",
        en: "A day to fill and a budget to *keep*?",
      },
      hook: {
        fr: "Zenko compose ta journée selon tes envies et ton *budget*.",
        en: "Zenko plans your day around what you want to do and your *budget*.",
      },
      problem: {
        fr: "En voyage, organiser chaque journée entre tes envies et ton budget, c’est un *casse-tête*.",
        en: "When you travel, planning each day around what you want and what you can spend is a *headache*.",
      },
      audience: {
        fr: "Pour qui voyage avec des envies, et un budget.",
        en: "For travelers with a wish list, and a budget.",
      },
      beats: [
        { at: 0, text: { fr: "Tu as 40 € pour la journée.", en: "You have €40 for the day." } },
        { at: 0.2, text: { fr: "Ton budget passe à 25 €.", en: "Your budget drops to €25." } },
        { at: 1.7, text: { fr: "Zenko recompose ta journée.", en: "Zenko rebuilds your day." } },
      ],
      demoAlt: {
        fr: "Animation : le curseur du budget glisse de 40 € à 25 €, et les trois moments de la journée, matin, après-midi et soir, se recomposent avec des activités moins chères. Données d’exemple.",
        en: "Animation: the budget slider moves from €40 to €25, and the three parts of the day, morning, afternoon and evening, rearrange themselves with cheaper activities. Sample data.",
      },
      ai: {
        kind: "steps",
        steps: [
          {
            text: { fr: "Tu donnes tes envies et ton budget.", en: "You say what you want to do and your budget." },
          },
          { text: { fr: "Un modèle d’IA compose ta journée.", en: "An AI model plans your day." }, ai: true },
          { text: { fr: "Je vérifie sa réponse, et je la répare.", en: "I check its answer, and fix it." } },
          {
            text: {
              fr: "Ta journée est prête : matin, midi, après-midi, soir.",
              en: "Your day is ready: morning, lunch, afternoon, evening.",
            },
          },
        ],
      },
      engine: {
        chain: [
          { fr: "Envies et budget", en: "Wishes and budget" },
          { fr: "GPT-4o-mini (sortie JSON)", en: "GPT-4o-mini (JSON output)" },
          { fr: "Extraction et réparation du JSON", en: "JSON extraction and repair" },
          { fr: "Plan enregistré en base", en: "Plan saved to the database" },
        ],
        fallback: { fr: "Réparation du JSON renvoyé par le modèle.", en: "Repairing the JSON returned by the model." },
        takeaway: {
          fr: "Un modèle ne renvoie pas toujours un JSON propre : je l’extrais et je le répare avant de l’enregistrer.",
          en: "A model doesn’t always return clean JSON: I extract it and repair it before saving it.",
        },
        challenges: [
          {
            fr: "Fiabiliser une sortie JSON de modèle avant de la persister en relationnel.",
            en: "Making a model’s JSON output reliable before persisting it to a relational database.",
          },
        ],
      },
      shots: {
        layout: "solo",
        images: [
          {
            src: "/assets/apps/zenko-ecran-1.jpg",
            width: 462,
            height: 1000,
            alt: {
              fr: "Écran de Zenko : les dernières journées, comme « Ma journée à George Town », et les voyages.",
              en: "Zenko screen: recent days, such as “My day in George Town”, and trips.",
            },
          },
        ],
      },
      release: { date: "2025-10-20", version: "1.0", updated: "2025-10-20", first: true },
      stores: [{ store: "app-store", href: `${APP_STORE}ch/app/zenko/id6753706200` }],
    },
  },

  "escapades-libres": {
    kind: "web",
    slug: ESCAPADES_LIBRES.slug,
    name: ESCAPADES_LIBRES.name,
    nameLines: ["Escapades", "Libres"],
    colors: { tint: ESCAPADES_LIBRES.tint, tintRgb: "227 162 26", light: "#F2BE4E", lightRgb: "242 190 78", dark: "#8A5E0A" },
    mark: {
      label: {
        fr: "Le motif d’Escapades Libres : deux arcs dorés",
        en: "The Escapades Libres mark: two golden arcs",
      },
    },
    story: {
      hook: { fr: "Voyager libre, *ensemble*.", en: "Travel free, *together*." },
      problem: {
        fr: "En situation de handicap, le plus dur, c’est de trouver avec qui *partir*.",
        en: "When you live with a disability, the hardest part is finding people to *travel* with.",
      },
      beats: [
        { at: 0, text: { fr: "Un test, 3 minutes.", en: "One quiz, 3 minutes." } },
        { at: 1.45, text: { fr: "Un profil de voyageur.", en: "One traveler profile." } },
        { at: 2.6, text: { fr: "Un groupe, un voyage.", en: "One group, one trip." } },
      ],
      demoAlt: {
        fr: "Animation : les 12 phrases du test se remplissent, une réponse est choisie. Le profil « Aventurier » apparaît, puis rejoint un petit groupe de cinq voyageurs. Leur voyage se trace, et l’agence coche trajets, logement, activités et accessibilité.",
        en: "Animation: the quiz’s 12 statements fill in and an answer is picked. The “Adventurer” profile appears, then joins a small group of five travelers. Their trip is mapped out, and the agency ticks off transport, accommodation, activities and accessibility.",
      },
      role: {
        title: { fr: "Mon rôle", en: "My role" },
        steps: [
          { text: { fr: "J’écoute la cliente.", en: "I listen to the client." } },
          { text: { fr: "Je comprends son problème.", en: "I understand her problem." } },
          { text: { fr: "Je conçois : design et UX.", en: "I design it: UI and UX." } },
          {
            text: {
              fr: "Je développe un premier MVP en 24 heures.",
              en: "I build a first MVP in 24 hours.",
            },
          },
        ],
        end: { fr: "Du besoin du client au *produit*.", en: "From the client’s need to the *product*." },
      },
      engine: {
        title: { fr: "La plateforme", en: "The platform" },
        chain: [
          {
            fr: "Monorepo Next.js : le site voyageur et le back-office, avec une logique et une base Postgres communes.",
            en: "A Next.js monorepo: the traveler site and the back office, sharing their logic and a Postgres database.",
          },
          {
            fr: "Le test, le profil, le compte et le questionnaire.",
            en: "The quiz, the profile, the account and the questionnaire.",
          },
          { fr: "L’espace voyageur et les voyages à rejoindre.", en: "The traveler area and trips to join." },
          {
            fr: "Un back-office lisible par l’équipe non technique.",
            en: "A back office the non-technical team can read at a glance.",
          },
        ],
        challengesTitle: { fr: "Les garde-fous", en: "The safeguards" },
        challenges: [
          { fr: "Données de santé protégées, jamais agrégées.", en: "Health data protected, never aggregated." },
          {
            fr: "Tests d’accessibilité automatiques (WCAG 2.2 AA).",
            en: "Automated accessibility tests (WCAG 2.2 AA).",
          },
          { fr: "Aucun score de ressemblance entre voyageurs.", en: "No similarity score between travelers." },
        ],
      },
      weekend: {
        dates: { fr: "du 28 au 30 novembre 2025", en: "November 28–30, 2025" },
        photo: {
          src: "/assets/img/startup-weekend-1.jpg",
          width: 1200,
          height: 900,
          alt: {
            fr: "Sur scène au Startup Weekend Grenoble : l’équipe autour du chèque géant de la première place.",
            en: "On stage at Startup Weekend Grenoble: the team around the giant first-place check.",
          },
        },
      },
      browser: {
        page: {
          src: "/assets/el/el-web-landing.jpg",
          width: 804,
          height: 4890,
          alt: {
            fr: "La page d’accueil d’Escapades Libres : le globe, les trois étapes, le test et ses six profils de voyageur, puis « Chacun trouve sa place ».",
            en: "The Escapades Libres home page: the globe, the three steps, the quiz and its six traveler profiles, then “Everyone finds their place”.",
          },
        },
        hero: {
          src: "/assets/el/el-web-hero.jpg",
          width: 1440,
          height: 900,
          alt: {
            fr: "Le haut de la page d’accueil d’Escapades Libres : « Voyager libre, ensemble. », un globe et le bouton « Découvrir mon profil ».",
            en: "The top of the Escapades Libres home page: “Travel free, together.”, a globe and the “Discover my profile” button.",
          },
        },
        detail: {
          src: "/assets/el/el-web-test.jpg",
          width: 1440,
          height: 900,
          alt: {
            fr: "La page du test : « Découvrons votre façon de voyager », en trois escales.",
            en: "The quiz page: “Let’s discover how you travel”, in three stops.",
          },
        },
      },
      site: ESCAPADES_LIBRES.site,
    },
  },
};

const isAppSlug = (value: string): value is AppSlug => (APP_SLUGS as readonly string[]).includes(value);

/** Ce que la nav montre de l'app de la page : son nom, son type, son icône. */
export interface NavApp {
  name: string;
  kind: App["kind"];
  /** L'icône (apps mobiles) ; Escapades Libres a son motif. */
  icon?: string;
}

/**
 * Les apps vues par la nav, calculées côté serveur et passées par le layout Pro : la nav (composant client)
 * n'embarque ainsi ni l'histoire des apps ni ce module.
 */
export const navApps = (): Readonly<Record<AppSlug, NavApp>> => {
  const entry = (app: App): NavApp => ({ name: app.name, kind: app.kind, icon: app.kind === "mobile" ? app.icon.src : undefined });
  return Object.fromEntries(APP_SLUGS.map((slug) => [slug, entry(apps[slug])])) as Record<AppSlug, NavApp>;
};

/** Garde des routes `/apps/[slug]` : `undefined` pour un slug inconnu. */
export const getApp = (slug: string): App | undefined => (isAppSlug(slug) ? apps[slug] : undefined);

/** « L'histoire suivante ». Hors chaîne (Escapades Libres), l'index vaut -1 : on repart du début, Oshii. */
export const getNextSlug = (slug: AppSlug): MobileAppSlug => {
  const index = STORY_ORDER.findIndex((s) => s === slug);
  return STORY_ORDER[(index + 1) % STORY_ORDER.length];
};
