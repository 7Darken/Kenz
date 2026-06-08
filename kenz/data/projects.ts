import { type Localized } from "@/i18n/localize";

export type ProjectLink = {
  label: string;
  href: string;
  title?: string;
  icon?: string;
};

export type ProjectStat = {
  label: Localized;
  value: string;
  description?: Localized;
  accentColor?: string;
  icon?: string;
};

export type TechGroup = {
  label: Localized;
  items: Localized<string[]>;
};

export type AiCapability = {
  title: Localized;
  model: Localized;
  description: Localized;
};

export type TechHighlight = {
  title: Localized;
  description: Localized;
};

export type TechnicalDetail = {
  summary?: Localized;
  stack: TechGroup[];
  ai?: AiCapability[];
  highlights?: TechHighlight[];
};

export type ProjectDetail = {
  headline: Localized;
  subheadline?: Localized;
  overview: Localized<string[]>;
  stats: ProjectStat[];
  tags?: Localized<string[]>;
  technical?: TechnicalDetail;
};

export type Project = {
  id: number;
  slug: string;
  name: Localized;
  period: Localized;
  description: Localized;
  thumbnail: string;
  liveUrl?: string;
  repoUrl?: string;
  socials?: ProjectLink[];
  glowColor?: string;
  screenshots?: string[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "oshii",
    name: {
      fr: "Oshii Recettes réseaux",
      en: "Oshii — Recipes from socials",
    },
    period: { fr: "2025 · App mobile", en: "2025 · Mobile app" },
    description: {
      fr: "Garde toutes tes recettes TikTok au même endroit Oshii convertit les vidéos en vraies recettes prêtes à cuisiner !",
      en: "Keep all your TikTok recipes in one place — Oshii turns videos into real, ready-to-cook recipes!",
    },
    thumbnail: "/images/projects/oshii/icon.webp",
    glowColor: "#ff2330",
    screenshots: [
      "/images/projects/oshii/screenshots/460x996bb.webp",
      "/images/projects/oshii/screenshots/460x996bb (1).webp",
      "/images/projects/oshii/screenshots/460x996bb (2).webp",
      "/images/projects/oshii/screenshots/460x996bb (3).webp",
      "/images/projects/oshii/screenshots/460x996bb (4).webp",
    ],
    liveUrl: "https://www.oshii.fr/",

    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/fr/app/oshii-recettes-des-r%C3%A9seaux/id6754848905",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
      {
        label: "Disponible sur",
        href: "https://play.google.com/store/apps/details?id=com.x7kenz.Oshii",
        title: "Play Store",
      },
      {
        label: "Tiktok",
        href: "https://kenz.blog/nebula",
        title: "+1 abonnés",
        icon: "/images/icons/tiktok_white.webp",
      },
    ],
    detail: {
      headline: {
        fr: "La cuisine virale devient réellement accessible",
        en: "Viral cooking made truly accessible",
      },
      subheadline: {
        fr: "Oshii transforme les recettes vues sur les réseaux en fiches prêtes à cuisiner, avec ingrédients, étapes et minuteur intégré.",
        en: "Oshii turns recipes you see on social media into ready-to-cook cards, with ingredients, steps and a built-in timer.",
      },
      overview: {
        fr: [
          "Synchronisation directe avec TikTok pour sauvegarder les vidéos et générer des recettes structurées.",
          "Expérience gamifiée avec objectifs hebdomadaires et suivi de progression culinaire.",
          "Outils collaboratifs pour partager des listes d'ingrédients et préparer les recettes à plusieurs.",
        ],
        en: [
          "Direct TikTok sync to save videos and generate structured recipes.",
          "Gamified experience with weekly goals and cooking-progress tracking.",
          "Collaborative tools to share ingredient lists and cook recipes together.",
        ],
      },
      stats: [
        {
          label: { fr: "Taux d'engagement", en: "Engagement rate" },
          value: "40%",
          description: {
            fr: "Sessions hebdo sur l'app",
            en: "Weekly sessions in the app",
          },
          accentColor: "#fbbf24",
        },
        {
          label: { fr: "Note moyenne", en: "Average rating" },
          value: "4.9",
          description: {
            fr: "App Store sur 1 200 avis",
            en: "App Store, from 1,200 reviews",
          },
          accentColor: "#f472b6",
        },
        {
          label: { fr: "Créateurs connectés", en: "Connected creators" },
          value: "280+",
          description: {
            fr: "Recettes importées automatiquement",
            en: "Recipes imported automatically",
          },
          accentColor: "#34d399",
        },
        {
          label: { fr: "Téléchargements", en: "Downloads" },
          value: "12k",
          description: {
            fr: "Sur les 3 premiers mois",
            en: "Over the first 3 months",
          },
          accentColor: "#60a5fa",
        },
      ],
      technical: {
        summary: {
          fr: "Application mobile React Native / Expo SDK 55 (New Architecture, React 19) en TypeScript strict qui transforme des vidéos de cuisine partagées (TikTok / Instagram / YouTube) en recettes structurées via un pipeline IA (transcription + GPT-4) orchestré par un backend Express, avec Supabase pour l'auth et les données et des extensions natives iOS (Share Extension, Live Activity).",
          en: "A React Native / Expo SDK 55 (New Architecture, React 19) mobile app in strict TypeScript that turns shared cooking videos (TikTok / Instagram / YouTube) into structured recipes through an AI pipeline (transcription + GPT-4) orchestrated by an Express backend, with Supabase for auth and data and native iOS extensions (Share Extension, Live Activity).",
        },
        stack: [
          {
            label: { fr: "Frontend", en: "Frontend" },
            items: {
              fr: [
                "React Native 0.83",
                "Expo SDK 55",
                "React 19",
                "TypeScript strict",
                "Expo Router",
                "Zustand",
                "Reanimated 4",
                "React Compiler",
                "i18next (FR/EN)",
              ],
              en: [
                "React Native 0.83",
                "Expo SDK 55",
                "React 19",
                "Strict TypeScript",
                "Expo Router",
                "Zustand",
                "Reanimated 4",
                "React Compiler",
                "i18next (FR/EN)",
              ],
            },
          },
          {
            label: { fr: "Backend & Data", en: "Backend & Data" },
            items: {
              fr: [
                "Backend Express",
                "Supabase Auth",
                "PostgreSQL",
                "Supabase Storage",
                "Edge Functions (Deno)",
                "JWT + refresh auto",
              ],
              en: [
                "Express backend",
                "Supabase Auth",
                "PostgreSQL",
                "Supabase Storage",
                "Edge Functions (Deno)",
                "JWT + auto refresh",
              ],
            },
          },
          {
            label: { fr: "IA & ML", en: "AI & ML" },
            items: {
              fr: ["OpenAI GPT-4", "Transcription audio", "Sortie JSON structurée"],
              en: ["OpenAI GPT-4", "Audio transcription", "Structured JSON output"],
            },
          },
          {
            label: { fr: "Infra & Outils", en: "Infra & Tooling" },
            items: {
              fr: ["EAS Build", "RevenueCat", "PostHog", "Expo Push / APNs"],
              en: ["EAS Build", "RevenueCat", "PostHog", "Expo Push / APNs"],
            },
          },
          {
            label: { fr: "Natif iOS", en: "iOS Native" },
            items: {
              fr: ["Share Extension", "Live Activity (ActivityKit)", "Deep linking oshii://", "SecureStore"],
              en: ["Share Extension", "Live Activity (ActivityKit)", "Deep linking oshii://", "SecureStore"],
            },
          },
          {
            label: { fr: "APIs & Services", en: "APIs & Services" },
            items: {
              fr: ["Apple Sign In", "Google OAuth", "expo-share-intent", "NetInfo (offline)"],
              en: ["Apple Sign In", "Google OAuth", "expo-share-intent", "NetInfo (offline)"],
            },
          },
        ],
        ai: [
          {
            title: {
              fr: "Extraction de recette depuis une vidéo",
              en: "Recipe extraction from a video",
            },
            model: {
              fr: "OpenAI GPT-4 (sortie JSON structurée)",
              en: "OpenAI GPT-4 (structured JSON output)",
            },
            description: {
              fr: "L'app envoie l'URL d'une vidéo partagée à un endpoint /analyze : le backend télécharge la vidéo, transcrit la bande-son, puis GPT-4 en extrait une recette structurée (ingrédients, étapes, timings, portions). Le pipeline détecte aussi les contenus non-culinaires (erreur NOT_RECIPE).",
              en: "The app sends the URL of a shared video to an /analyze endpoint: the backend downloads the video, transcribes the audio, then GPT-4 extracts a structured recipe from it (ingredients, steps, timings, servings). The pipeline also detects non-cooking content (NOT_RECIPE error).",
            },
          },
          {
            title: {
              fr: "Génération de recette sur mesure",
              en: "Custom recipe generation",
            },
            model: { fr: "OpenAI GPT-4", en: "OpenAI GPT-4" },
            description: {
              fr: "Via /generate, GPT-4 compose une recette inédite à partir des contraintes de l'utilisateur (type de repas, régimes, équipement, ingrédients disponibles) dans la langue détectée.",
              en: "Through /generate, GPT-4 composes a brand-new recipe from the user's constraints (meal type, diets, equipment, available ingredients) in the detected language.",
            },
          },
        ],
        highlights: [
          {
            title: {
              fr: "Partage entrant multi-plateforme → IA",
              en: "Cross-platform inbound sharing → AI",
            },
            description: {
              fr: "Capture native d'un lien partagé (Share Extension Swift sur iOS, intent ACTION_SEND via expo-share-intent sur Android) routée par deep link oshii:// jusqu'au pipeline d'extraction IA — sans copier-coller manuel.",
              en: "Native capture of a shared link (Swift Share Extension on iOS, ACTION_SEND intent via expo-share-intent on Android) routed through the oshii:// deep link to the AI extraction pipeline — with no manual copy-paste.",
            },
          },
          {
            title: { fr: "Auth résiliente JWT", en: "Resilient JWT auth" },
            description: {
              fr: "Sessions Supabase stockées en SecureStore avec rafraîchissement automatique du token et retry transparent sur 401 dans chaque appel API, pour ne jamais interrompre l'utilisateur.",
              en: "Supabase sessions stored in SecureStore with automatic token refresh and transparent retry on 401 in every API call, so the user is never interrupted.",
            },
          },
          {
            title: {
              fr: "Mode cuisine en Live Activity iOS",
              en: "Cooking mode as an iOS Live Activity",
            },
            description: {
              fr: "Module natif Swift (ActivityKit / WidgetKit) qui affiche l'étape courante et son minuteur sur l'écran verrouillé et la Dynamic Island pendant la préparation.",
              en: "Native Swift module (ActivityKit / WidgetKit) that shows the current step and its timer on the lock screen and Dynamic Island while cooking.",
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    slug: "zenko",
    name: { fr: "Zenko Croque le monde", en: "Zenko — Taste the world" },
    period: { fr: "2025 · App mobile", en: "2025 · Mobile app" },
    description: {
      fr: "Ton compagnon de voyage intelligent,des programmes quotidiens personnalisés adaptés à vos envies et à votre budget.",
      en: "Your smart travel companion — personalized daily plans tailored to your tastes and budget.",
    },
    thumbnail: "/images/projects/zenko/icon.webp",
    glowColor: "#944f29",
    screenshots: [
      "/images/projects/zenko/screenshots/Simulator Screenshot - iPhone 16 - 2025-10-07 at 14.51.22.webp",
      "/images/projects/zenko/screenshots/simulator_screenshot_0F87DCF3-7B95-49D6-A78C-14F2DAC1B13E.webp",
      "/images/projects/zenko/screenshots/simulator_screenshot_2AFCECC9-DC68-4C66-9685-EF373A9913FD.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/ch/app/zenko/id6753706200?l=fr-FR",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
      {
        label: "Tiktok",
        href: "https://www.tiktok.com/@7kinze",
        title: "+10K abonnés",
        icon: "/images/icons/tiktok_white.webp",
      },
    ],
    detail: {
      headline: {
        fr: "Ton copilote de voyage personnalisé",
        en: "Your personalized travel copilot",
      },
      subheadline: {
        fr: "Zenko compose des itinéraires intelligents selon ton budget, la météo et tes préférences culinaires, tout en te mettant en relation avec les commerces locaux.",
        en: "Zenko builds smart itineraries based on your budget, the weather and your food preferences, while connecting you with local businesses.",
      },
      overview: {
        fr: [
          "Agrégation de données météo, transports et évènements en temps réel pour ajuster l'agenda quotidien.",
          "Assistant IA conversationnel qui suggère restaurants, activités et bons plans adaptés à ton mood.",
          "Module d'offres locales avec cashback intégré pour stimuler les commerces partenaires.",
        ],
        en: [
          "Real-time aggregation of weather, transit and events data to adjust the daily agenda.",
          "Conversational AI assistant that suggests restaurants, activities and deals matching your mood.",
          "Local-offers module with built-in cashback to boost partner businesses.",
        ],
      },
      stats: [
        {
          label: { fr: "Taux de rétention", en: "Retention rate" },
          value: "63%",
          description: {
            fr: "Utilisateurs actifs sur 30 jours",
            en: "Active users over 30 days",
          },
          accentColor: "#22d3ee",
        },
        {
          label: { fr: "Itinéraires générés", en: "Itineraries generated" },
          value: "18k",
          description: {
            fr: "Planifications tout pays",
            en: "Plans across all countries",
          },
          accentColor: "#f97316",
        },
        {
          label: { fr: "Commerces partenaires", en: "Partner businesses" },
          value: "460",
          description: {
            fr: "Offres locales connectées",
            en: "Connected local offers",
          },
          accentColor: "#a855f7",
        },
        {
          label: { fr: "Note utilisateur", en: "User rating" },
          value: "4.7",
          description: {
            fr: "Sur le store & beta testers",
            en: "On the store & beta testers",
          },
          accentColor: "#4ade80",
        },
      ],
      technical: {
        summary: {
          fr: "Application mobile de planification de voyage (React Native / Expo SDK 54, TypeScript) adossée à Supabase, dont la spécificité est un moteur IA double : génération d'itinéraires d'une journée 100% personnalisés (OpenAI) et création des visuels de villes (DALL·E 3).",
          en: "A travel-planning mobile app (React Native / Expo SDK 54, TypeScript) backed by Supabase, whose signature feature is a dual AI engine: generation of fully personalized one-day itineraries (OpenAI) and creation of city visuals (DALL·E 3).",
        },
        stack: [
          {
            label: { fr: "Frontend", en: "Frontend" },
            items: {
              fr: [
                "React Native 0.81",
                "Expo SDK 54",
                "TypeScript",
                "React Navigation 7",
                "React Native SVG",
                "react-native-maps",
              ],
              en: [
                "React Native 0.81",
                "Expo SDK 54",
                "TypeScript",
                "React Navigation 7",
                "React Native SVG",
                "react-native-maps",
              ],
            },
          },
          {
            label: { fr: "Backend & Data", en: "Backend & Data" },
            items: {
              fr: ["Supabase", "PostgreSQL", "Supabase Storage", "AsyncStorage"],
              en: ["Supabase", "PostgreSQL", "Supabase Storage", "AsyncStorage"],
            },
          },
          {
            label: { fr: "IA & ML", en: "AI & ML" },
            items: {
              fr: ["OpenAI GPT-4o-mini", "DALL·E 3"],
              en: ["OpenAI GPT-4o-mini", "DALL·E 3"],
            },
          },
          {
            label: { fr: "Auth & Temps réel", en: "Auth & Realtime" },
            items: {
              fr: ["Supabase Auth", "Google Sign-In", "Apple Sign-In", "Supabase Realtime"],
              en: ["Supabase Auth", "Google Sign-In", "Apple Sign-In", "Supabase Realtime"],
            },
          },
          {
            label: { fr: "APIs & Services", en: "APIs & Services" },
            items: {
              fr: ["Google Maps Places", "Unsplash", "RevenueCat"],
              en: ["Google Maps Places", "Unsplash", "RevenueCat"],
            },
          },
          {
            label: { fr: "Infra & Outils", en: "Infra & Tooling" },
            items: {
              fr: ["EAS Build", "ESLint", "Jest"],
              en: ["EAS Build", "ESLint", "Jest"],
            },
          },
        ],
        ai: [
          {
            title: {
              fr: "Génération d'itinéraires journaliers personnalisés",
              en: "Personalized daily itinerary generation",
            },
            model: {
              fr: "OpenAI GPT-4o-mini (Responses API, sortie JSON)",
              en: "OpenAI GPT-4o-mini (Responses API, JSON output)",
            },
            description: {
              fr: "Un prompt richement structuré (ville, pays d'origine pour le pouvoir d'achat, devise, type de voyage, traits, budget, événements locaux) produit un plan Matin/Midi/Après-midi/Soir entièrement typé, ensuite persisté en base relationnelle.",
              en: "A richly structured prompt (city, home country for purchasing power, currency, trip type, traits, budget, local events) produces a fully typed Morning/Noon/Afternoon/Evening plan, then persisted in a relational database.",
            },
          },
          {
            title: {
              fr: "Illustrations de villes façon poster de voyage",
              en: "City illustrations in travel-poster style",
            },
            model: {
              fr: "OpenAI DALL·E 3 (1024×1024, qualité HD)",
              en: "OpenAI DALL·E 3 (1024×1024, HD quality)",
            },
            description: {
              fr: "Génère une affiche minimaliste de la destination à partir d'un prompt dédié, puis la stocke dans un bucket Supabase pour obtenir une URL stable réutilisable.",
              en: "Generates a minimalist poster of the destination from a dedicated prompt, then stores it in a Supabase bucket to get a stable, reusable URL.",
            },
          },
        ],
        highlights: [
          {
            title: { fr: "Pipeline JSON fiabilisé", en: "Hardened JSON pipeline" },
            description: {
              fr: "Extraction du JSON depuis la réponse du modèle et auto-réparation des erreurs courantes (trailing commas) pour garantir un itinéraire exploitable malgré la variabilité du modèle.",
              en: "JSON extraction from the model's response and auto-repair of common errors (trailing commas) to guarantee a usable itinerary despite the model's variability.",
            },
          },
          {
            title: {
              fr: "Persistance relationnelle + temps réel",
              en: "Relational persistence + realtime",
            },
            description: {
              fr: "Le plan généré est éclaté dans Postgres (days → activities → advices/transports) avec synchronisation Supabase Realtime via postgres_changes.",
              en: "The generated plan is split across Postgres (days → activities → advices/transports) with Supabase Realtime sync via postgres_changes.",
            },
          },
          {
            title: {
              fr: "Abonnements premium synchronisés",
              en: "Synchronized premium subscriptions",
            },
            description: {
              fr: "Paywall RevenueCat (react-native-purchases) avec entitlement Premium répliqué dans Supabase, et imagerie d'activités via Unsplash scorée par pertinence et mise en cache (mémoire + AsyncStorage).",
              en: "RevenueCat paywall (react-native-purchases) with a Premium entitlement replicated in Supabase, and activity imagery via Unsplash scored by relevance and cached (memory + AsyncStorage).",
            },
          },
        ],
      },
    },
  },
  {
    id: 3,
    slug: "sago",
    name: { fr: "Sago", en: "Sago" },
    period: { fr: "2025 · App mobile", en: "2025 · Mobile app" },
    description: {
      fr: "Apprends le japonais de manière intuitive avec des leçons interactives, du vocabulaire contextuel et un suivi de progression personnalisé.",
      en: "Learn Japanese intuitively with interactive lessons, contextual vocabulary and personalized progress tracking.",
    },
    thumbnail: "/images/projects/sago/icon.webp",
    glowColor: "#e74c6f",
    liveUrl: "https://sago-landing.vercel.app/",
    screenshots: [
      "/images/projects/sago/screenshots/preview-1.webp",
      "/images/projects/sago/screenshots/preview-2.webp",
      "/images/projects/sago/screenshots/preview-3.webp",
      "/images/projects/sago/screenshots/preview-4.webp",
      "/images/projects/sago/screenshots/preview-5.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/fr/app/id6759610780",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
    ],
    detail: {
      headline: { fr: "Le japonais, simplifié", en: "Japanese, simplified" },
      subheadline: {
        fr: "Sago rend l'apprentissage du japonais accessible avec des leçons courtes, de la reconnaissance de caractères et un système de répétition espacée.",
        en: "Sago makes learning Japanese accessible with short lessons, character recognition and a spaced-repetition system.",
      },
      overview: {
        fr: [
          "Leçons interactives couvrant hiragana, katakana et kanji avec progression adaptative.",
          "Système de répétition espacée intelligent pour ancrer le vocabulaire sur le long terme.",
          "Exercices contextuels basés sur des situations réelles de voyage et de conversation.",
        ],
        en: [
          "Interactive lessons covering hiragana, katakana and kanji with adaptive progression.",
          "Smart spaced-repetition system to anchor vocabulary over the long term.",
          "Contextual exercises based on real travel and conversation situations.",
        ],
      },
      stats: [
        {
          label: { fr: "Caractères", en: "Characters" },
          value: "2000+",
          description: {
            fr: "Kanji et kana disponibles",
            en: "Kanji and kana available",
          },
          accentColor: "#e74c6f",
        },
        {
          label: { fr: "Leçons", en: "Lessons" },
          value: "150+",
          description: {
            fr: "Du débutant à l'avancé",
            en: "From beginner to advanced",
          },
          accentColor: "#8b5cf6",
        },
        {
          label: { fr: "Rétention", en: "Retention" },
          value: "85%",
          description: {
            fr: "Grâce à la répétition espacée",
            en: "Thanks to spaced repetition",
          },
          accentColor: "#06b6d4",
        },
        {
          label: { fr: "Temps moyen", en: "Average time" },
          value: "10min",
          description: { fr: "Par session quotidienne", en: "Per daily session" },
          accentColor: "#f59e0b",
        },
      ],
      technical: {
        summary: {
          fr: "Client mobile React Native / Expo (SDK 55, TypeScript) d'une app d'apprentissage du japonais en histoires interactives. Architecture offline-first : couche réseau résiliente (auth Supabase + retry), cache disque audio/images, et backend Node dédié (Railway) qui sert le contenu narratif et la génération IA.",
          en: "A React Native / Expo (SDK 55, TypeScript) mobile client for a Japanese-learning app built around interactive stories. Offline-first architecture: a resilient network layer (Supabase auth + retry), audio/image disk cache, and a dedicated Node backend (Railway) that serves the narrative content and AI generation.",
        },
        stack: [
          {
            label: { fr: "Frontend", en: "Frontend" },
            items: {
              fr: ["React Native 0.83", "Expo SDK 55", "Expo Router", "TypeScript", "Reanimated 4"],
              en: ["React Native 0.83", "Expo SDK 55", "Expo Router", "TypeScript", "Reanimated 4"],
            },
          },
          {
            label: { fr: "Backend & Data", en: "Backend & Data" },
            items: {
              fr: ["Supabase", "API REST Node", "Railway", "AsyncStorage"],
              en: ["Supabase", "Node REST API", "Railway", "AsyncStorage"],
            },
          },
          {
            label: { fr: "Auth", en: "Auth" },
            items: {
              fr: ["Supabase Auth", "Apple Sign-In", "Google Sign-In"],
              en: ["Supabase Auth", "Apple Sign-In", "Google Sign-In"],
            },
          },
          {
            label: { fr: "Média & Offline", en: "Media & Offline" },
            items: {
              fr: ["expo-audio", "expo-speech (TTS)", "Cache disque", "expo-image"],
              en: ["expo-audio", "expo-speech (TTS)", "Disk cache", "expo-image"],
            },
          },
          {
            label: { fr: "Infra & Outils", en: "Infra & Tooling" },
            items: {
              fr: ["EAS Build", "RevenueCat", "Push (Expo)", "Widgets iOS"],
              en: ["EAS Build", "RevenueCat", "Push (Expo)", "iOS Widgets"],
            },
          },
        ],
        ai: [
          {
            title: {
              fr: "Avatar de héros généré par IA",
              en: "AI-generated hero avatar",
            },
            model: {
              fr: "Génération d'image côté backend (modèle non exposé dans le client)",
              en: "Backend-side image generation (model not exposed in the client)",
            },
            description: {
              fr: "Pendant l'onboarding, l'utilisateur prend ou choisit une photo (expo-image-picker) ; elle est envoyée en multipart au backend qui renvoie un avatar stylisé. Timeout dédié de 60s pour la génération, avec repli sur des avatars presets en cas d'échec.",
              en: "During onboarding, the user takes or picks a photo (expo-image-picker); it's sent as multipart to the backend, which returns a stylized avatar. A dedicated 60s timeout for generation, with a fallback to preset avatars on failure.",
            },
          },
        ],
        highlights: [
          {
            title: { fr: "Couche réseau résiliente", en: "Resilient network layer" },
            description: {
              fr: "Client fetch typé avec injection des tokens Supabase auto-refresh, retry transparent sur 401 (refresh de session puis rejeu de la requête) et abort sur timeout.",
              en: "Typed fetch client with injection of auto-refreshed Supabase tokens, transparent retry on 401 (session refresh then request replay) and abort on timeout.",
            },
          },
          {
            title: {
              fr: "Audio narratif offline-first",
              en: "Offline-first narrative audio",
            },
            description: {
              fr: "Cache disque déterministe (hash d'URL), déduplication des téléchargements concurrents et repli sur la synthèse vocale native (expo-speech) quand l'audio distant est indisponible.",
              en: "Deterministic disk cache (URL hash), deduplication of concurrent downloads and fallback to native text-to-speech (expo-speech) when remote audio is unavailable.",
            },
          },
          {
            title: {
              fr: "Widgets iOS natifs & monétisation",
              en: "Native iOS widgets & monetization",
            },
            description: {
              fr: "Widgets iOS natifs et abonnement Sago Pro géré par RevenueCat, le tout buildé et distribué avec EAS.",
              en: "Native iOS widgets and a Sago Pro subscription managed by RevenueCat, all built and shipped with EAS.",
            },
          },
        ],
      },
    },
  },
  {
    id: 4,
    slug: "miru",
    name: { fr: "Miru: Imposteur Loup Garou", en: "Miru: Impostor & Werewolf" },
    period: { fr: "2026 · App mobile", en: "2026 · Mobile app" },
    description: {
      fr: "Le jeu party entre amis ou en famille : imposteur, loup-garou et mini-jeux en ligne, avec des catégories animes, nourriture, acteurs et bien plus.",
      en: "The party game for friends and family: impostor, werewolf and online mini-games, with categories like anime, food, actors and more.",
    },
    thumbnail: "/images/projects/miru/icon.webp",
    glowColor: "#7c3aed",
    liveUrl: "https://v0-miru-website.vercel.app/",
    screenshots: [
      "/images/projects/miru/screenshots/untitled-project-1242x2688.webp",
      "/images/projects/miru/screenshots/untitled-project-1242x2688 (1).webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.27.19.webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.29.59.webp",
      "/images/projects/miru/screenshots/Capture d’écran 2026-04-22 à 00.30.20.webp",
    ],
    socials: [
      {
        label: "Télécharger sur",
        href: "https://apps.apple.com/ch/app/id6761622088",
        title: "App Store",
        icon: "/images/icons/Apple_logo_white.webp",
      },
    ],
    detail: {
      headline: {
        fr: "Le jeu party à partager entre amis ou en famille",
        en: "The party game to share with friends and family",
      },
      subheadline: {
        fr: "Miru réunit tes proches autour de parties d'imposteur, de loup-garou et de mini-jeux en ligne, avec un catalogue de catégories prêtes à l'emploi.",
        en: "Miru brings your friends and family together around impostor, werewolf and online mini-game rounds, with a catalog of ready-to-play categories.",
      },
      overview: {
        fr: [
          "Rooms multijoueur en ligne pour rejoindre tes amis ou ta famille où qu'ils soient et lancer une partie en quelques secondes.",
          "Modes imposteur, loup-garou et mini-jeux animés par une belle variété de catégories : animes, nourriture, acteurs, et bien plus.",
          "Fonctionnalité clé : crée tes propres catégories personnalisées assistées par IA pour des parties 100% à ton image.",
        ],
        en: [
          "Online multiplayer rooms to join your friends or family wherever they are and start a game in seconds.",
          "Impostor, werewolf and mini-game modes powered by a great variety of categories: anime, food, actors, and more.",
          "Key feature: create your own AI-assisted custom categories for games that are 100% your style.",
        ],
      },
      stats: [
        {
          label: { fr: "Modes de jeu", en: "Game modes" },
          value: "15+",
          description: {
            fr: "Imposteur, loup-garou & mini-jeux",
            en: "Impostor, werewolf & mini-games",
          },
          accentColor: "#a855f7",
        },
        {
          label: { fr: "Joueurs par room", en: "Players per room" },
          value: "12",
          description: { fr: "En ligne et en simultané", en: "Online and simultaneous" },
          accentColor: "#22d3ee",
        },
        {
          label: { fr: "Rôles uniques", en: "Unique roles" },
          value: "30+",
          description: { fr: "Pour varier chaque partie", en: "To vary every game" },
          accentColor: "#f472b6",
        },
        {
          label: { fr: "Catégories", en: "Categories" },
          value: "20+",
          description: {
            fr: "Animes, nourriture, acteurs… + IA perso",
            en: "Anime, food, actors… + custom AI",
          },
          accentColor: "#facc15",
        },
      ],
      technical: {
        summary: {
          fr: "App de jeux de soirée en React Native / Expo SDK 55 (TypeScript strict), hybride : parties hors-ligne sur un seul téléphone et parties en ligne temps réel via Socket.IO, avec un mode écran (TV/laptop) où les téléphones deviennent des manettes. Backend custom (REST + WebSocket) doublé de Firebase pour l'auth, le stockage et la télémétrie, et d'une génération de contenu de jeu par IA côté serveur.",
          en: "A party-games app in React Native / Expo SDK 55 (strict TypeScript), hybrid: offline games on a single phone and real-time online games via Socket.IO, with a screen mode (TV/laptop) where phones become controllers. A custom backend (REST + WebSocket) paired with Firebase for auth, storage and telemetry, plus server-side AI generation of game content.",
        },
        stack: [
          {
            label: { fr: "Frontend", en: "Frontend" },
            items: {
              fr: [
                "React Native 0.83",
                "Expo SDK 55",
                "TypeScript",
                "React Navigation",
                "Reanimated 4",
                "react-native-svg",
              ],
              en: [
                "React Native 0.83",
                "Expo SDK 55",
                "TypeScript",
                "React Navigation",
                "Reanimated 4",
                "react-native-svg",
              ],
            },
          },
          {
            label: { fr: "Temps réel & Multijoueur", en: "Realtime & Multiplayer" },
            items: {
              fr: ["Socket.IO", "Mode écran (QR + WebSocket)"],
              en: ["Socket.IO", "Screen mode (QR + WebSocket)"],
            },
          },
          {
            label: { fr: "Backend & Data", en: "Backend & Data" },
            items: {
              fr: ["API REST custom", "Firebase Auth (anonyme)", "Cloud Storage", "Firestore"],
              en: ["Custom REST API", "Firebase Auth (anonymous)", "Cloud Storage", "Firestore"],
            },
          },
          {
            label: { fr: "IA & ML", en: "AI & ML" },
            items: {
              fr: ["Génération de catégories (LLM backend)", "Modération entrée/sortie"],
              en: ["Category generation (backend LLM)", "Input/output moderation"],
            },
          },
          {
            label: { fr: "Infra & Monétisation", en: "Infra & Monetization" },
            items: {
              fr: ["EAS Build", "RevenueCat", "Firebase Analytics", "Crashlytics"],
              en: ["EAS Build", "RevenueCat", "Firebase Analytics", "Crashlytics"],
            },
          },
          {
            label: { fr: "Device & i18n", en: "Device & i18n" },
            items: {
              fr: [
                "i18next",
                "expo-localization",
                "expo-notifications",
                "expo-sensors",
                "expo-camera",
                "expo-secure-store",
              ],
              en: [
                "i18next",
                "expo-localization",
                "expo-notifications",
                "expo-sensors",
                "expo-camera",
                "expo-secure-store",
              ],
            },
          },
        ],
        ai: [
          {
            title: {
              fr: "Génération de catégories de jeu par IA",
              en: "AI generation of game categories",
            },
            model: {
              fr: "LLM côté backend — provider/modèle exposés dynamiquement par l'API (non figés côté client)",
              en: "Backend-side LLM — provider/model surfaced dynamically by the API (not hardcoded in the client)",
            },
            description: {
              fr: "Le joueur saisit un thème libre ; l'IA génère le contenu adapté au jeu prioritaire (mots pour Devine/Time's Up, paires pour l'Imposteur, lettres+prompts pour Letter Blitz, listes pour Au Talent). La langue de génération est déduite de l'en-tête Accept-Language ; statut de génération suivi par jeu, quota quotidien et accès réservé au premium.",
              en: "The player enters a free-form theme; the AI generates content tailored to the primary game (words for Guess/Time's Up, pairs for Impostor, letters+prompts for Letter Blitz, lists for Au Talent). The generation language is inferred from the Accept-Language header; generation status is tracked per game, with a daily quota and premium-only access.",
            },
          },
          {
            title: {
              fr: "Modération IA des thèmes et du contenu",
              en: "AI moderation of themes and content",
            },
            model: {
              fr: "Même pipeline IA backend (garde-fous entrée + sortie)",
              en: "Same backend AI pipeline (input + output guardrails)",
            },
            description: {
              fr: "Le thème saisi et le contenu produit passent par une modération (rejets INPUT/OUTPUT_MODERATION). Un thème hors-cadre est soit refusé avec un motif, soit « adapté » automatiquement, la raison étant remontée à l'utilisateur.",
              en: "The entered theme and the produced content go through moderation (INPUT/OUTPUT_MODERATION rejections). An off-limits theme is either refused with a reason or automatically 'adapted', with the reason surfaced to the user.",
            },
          },
        ],
        highlights: [
          {
            title: {
              fr: "Auth WebSocket à token Firebase auto-rafraîchi",
              en: "WebSocket auth with auto-refreshed Firebase token",
            },
            description: {
              fr: "Le socket fournit un ID token Firebase frais à chaque connexion ET reconnexion via un authProvider dynamique, ce qui évite les coupures dues à l'expiration des tokens (1 h) sur des sockets restés longtemps en arrière-plan, avec retry ciblé sur les erreurs d'auth.",
              en: "The socket supplies a fresh Firebase ID token on every connection AND reconnection via a dynamic authProvider, which prevents drops caused by token expiry (1 h) on sockets left in the background for a long time, with targeted retry on auth errors.",
            },
          },
          {
            title: {
              fr: "i18n piloté par une source unique",
              en: "i18n driven by a single source",
            },
            description: {
              fr: "Toutes les langues dérivent d'un seul fichier (languages.ts) ; la locale active est propagée au backend par trois canaux automatiques (Accept-Language, auth Socket.IO, PATCH /users/me) et les catégories sont cachées par locale pour un offline multilingue cohérent.",
              en: "All languages derive from a single file (languages.ts); the active locale is propagated to the backend through three automatic channels (Accept-Language, Socket.IO auth, PATCH /users/me) and categories are cached per locale for consistent multilingual offline.",
            },
          },
          {
            title: { fr: "Mode écran TV/laptop", en: "TV/laptop screen mode" },
            description: {
              fr: "Un écran rejoint la partie via QR code + WebSocket : le contenu visuel est routé vers l'écran pendant que les téléphones deviennent de simples manettes (buzzer/saisie), avec repli transparent vers le mode normal si l'écran se déconnecte.",
              en: "A screen joins the game via QR code + WebSocket: visual content is routed to the screen while phones become simple controllers (buzzer/input), with transparent fallback to normal mode if the screen disconnects.",
            },
          },
        ],
      },
    },
  },
];
