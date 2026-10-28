/**
 * French dictionary — the BASE language.
 *
 * This file defines the canonical shape (`Dictionary`) that every other
 * language must implement. To add a new translatable string:
 *   1. add the key here (French copy),
 *   2. TypeScript will then require the same key in every other dictionary.
 *
 * Namespaces map roughly to a section/component of the site.
 */

export const fr = {
  nav: {
    projects: "Projets",
    kenzAi: "Kenz AI",
    contact: "Contact",
    content: "Contenu",
    travels: "Voyages",
    socials: "Réseaux",
    modePro: "Pro",
    modePerso: "Moi",
    mode: "Mode",
    menu: "Menu",
    close: "Fermer",
  },

  hero: {
    greetingPro: "Salut, moi c'est Kenz",
    greetingPerso: "Hey, moi c'est Kenz",
    // [mot blanc, mot coloré] — l'ordre des mots dépend de la langue.
    proSteps: [
      ["Full Stack", "Developer"],
      ["Backend", "Developer"],
      ["Frontend", "Developer"],
      ["Software", "Developer"],
      ["Software", "Engineer"],
    ],
    persoSteps: [
      ["Créateur", "Digital"],
      ["Créateur", "de Contenu"],
      ["Globe", "Trotteur"],
      ["Athlète", "Hybride"],
    ],
    available: "Disponible pour de nouvelles opportunités",
    bio: "Passionné par la création d'expériences mobiles & web intuitives qui apportent une vraie valeur.",
    trust: {
      apps: "4 apps",
      middle: " publiées sur l'App Store avec ",
      downloads: "12k+ téléchargements",
    },
    contact: "Me contacter",
    tiktok: {
      handle: "@7kinze",
      text: "Vlogs voyage 🌍 Astuces business en ligne 💰 Japon · Corée · Islande",
    },
    youtube: {
      handle: "@7Kinze",
      text: "Création de contenu · Business en ligne · Voyages longue durée 🎬",
    },
    notifFollowers: { strong: "10K abonnés", rest: " atteints sur TikTok" },
    notifApps: {
      apps: "4 apps",
      middle: " lancées · ",
      countries: "5 pays",
      rest: " filmés",
    },
  },

  common: {
    comingSoon: "Photo à venir",
  },

  impact: {
    downloads: "Téléchargements",
    appsPublished: "Apps publiées",
    rating: "Note App Store",
  },

  mobileApps: {
    title: "Applications Mobiles",
    subtitle: "Des expériences digitales conçues avec passion.",
    details: "Détails",
  },

  appDetail: {
    back: "Retour",
    download: "Télécharger",
    website: "Site web",
    overview: "Aperçu",
    screenshots: "Captures d'écran",
    features: "Fonctionnalités",
    underTheHood: "Sous le capot",
    stackArchitecture: "Stack & architecture",
    aiIntegrations: "Intégrations IA",
    technicalChallenges: "Défis techniques",
    aiBadge: "IA",
    ctaBefore: "Prêt à essayer ",
    ctaAfter: " ?",
    ctaSubtitleBoth: "Disponible gratuitement sur l'App Store et Google Play.",
    ctaSubtitleApple: "Disponible gratuitement sur l'App Store.",
    downloadNow: "Télécharger maintenant",
    googlePlay: "Google Play",
  },

  techStack: {
    label: "Ce que je fais",
    title: "Kenz AI",
    name: "Kenz",
    online: "En ligne",
    typing: "Kenz écrit",
    contactCta: "Me contacter",
    placeholderAsk: "Pose-moi une question...",
    placeholderDefault: "Choisis une question ou écris la tienne...",
    intro: {
      question: "Salut Kenz, tu fais quoi exactement ?",
      answer:
        "Je développe des applications mobiles et des produits digitaux de A à Z — de l'idée au déploiement sur l'App Store.",
      tags: ["Swift", "SwiftUI", "React Native", "App Store"],
    },
    suggestions: [
      {
        label: "🌐 Et côté web ?",
        question: "Et côté web ?",
        answer:
          "Je build des expériences web modernes et performantes. Ce portfolio en est un exemple — animations fluides, responsive, SSR.",
        tags: ["Next.js", "React", "TypeScript", "Framer Motion"],
      },
      {
        label: "⚙️ Tu gères le backend ?",
        question: "Tu gères aussi le backend ?",
        answer:
          "Full stack. APIs REST, bases de données, auth, paiement, déploiement cloud. Mes apps tournent en prod avec des milliers d'utilisateurs.",
        tags: ["Node.js", "PostgreSQL", "Firebase", "Vercel"],
      },
      {
        label: "📱 Tes apps ?",
        question: "C'est quoi tes apps ?",
        answer:
          "J'ai 4 apps publiées — Oshii pour les recettes TikTok, Zenko pour les voyages, Sago pour apprendre le japonais et Miru, un jeu party entre amis. Plus de 12k téléchargements au total.",
        tags: ["Oshii", "Zenko", "Sago", "Miru"],
      },
      {
        label: "🎨 Et le design ?",
        question: "Tu fais aussi le design ?",
        answer:
          "Oui, du concept au pixel. Identité visuelle, UI/UX, prototypage. Je crée des produits complets, pas juste du code.",
        tags: ["Figma", "UI/UX", "Branding"],
      },
    ],
    autoResponses: [
      {
        keywords: ["prix", "tarif", "cout", "coût", "combien", "budget", "devis"],
        answer:
          "Ça dépend du projet ! Envoie-moi un mail à contact@kenzenbien.fr et on en discute.",
        tags: ["Freelance"],
      },
      {
        keywords: ["contact", "mail", "email", "joindre"],
        answer:
          "Tu peux me contacter à contact@kenzenbien.fr ou sur LinkedIn. Je suis disponible pour de nouveaux projets.",
        tags: ["Disponible"],
      },
      {
        keywords: ["bonjour", "salut", "hello", "hey", "yo", "coucou"],
        answer: "Hey ! N'hésite pas à me poser des questions sur mes projets ou compétences.",
        tags: [],
      },
    ],
    defaultAnswer:
      "Bonne question ! N'hésite pas à me contacter directement pour en discuter.",
    defaultTags: ["Contact"],
  },

  achievements: {
    label: "Distinctions",
    title: "Concours & récompenses",
    startupWeekend: {
      title: "1ère Place — Startup Weekend",
      location: "France",
      badge: "Vainqueur",
      description:
        "Vainqueur du Startup Weekend : 54h pour concevoir, prototyper et pitcher un projet en équipe. Classé 1ᵉʳ devant le jury.",
      tags: ["Entrepreneuriat", "Pitch", "54h", "Équipe"],
    },
  },

  sport: {
    label: "Sport & Défis",
    title: "Repousser les limites",
    hyrox: {
      date: "Mai 2025",
      location: "Paris, France",
      description:
        "Course hybride combinant running et exercices fonctionnels. 8 stations, 8km de course — un test complet de fitness.",
      tags: ["Endurance", "Fonctionnel", "8km"],
    },
    spartan: {
      date: "Juin 2025",
      location: "France",
      description:
        "Course à obstacles en pleine nature. Boue, murs, cordes — repousser ses limites physiques et mentales.",
      tags: ["Obstacles", "Nature", "Mental"],
    },
  },

  socials: {
    eyebrow: "Suivre",
    title: "L'Aventure",
  },

  footer: {
    bioPro:
      "Développeur Full Stack basé à Paris. Je conçois des applications mobiles et des expériences web performantes.",
    bioPerso:
      "Créateur de contenu, développeur et globe-trotteur. Je partage mes voyages et mes projets entre Paris et l'Asie.",
    navigation: "Navigation",
    home: "Accueil",
    sport: "Sport",
    networks: "Réseaux",
    apps: "Apps",
    rights: "Tous droits réservés.",
    location: "Paris, France",
  },

  contactSection: {
    label: "Contact",
    title: "Un projet en tête ?",
    subtitle:
      "Je suis toujours ouvert aux nouvelles opportunités, collaborations ou simplement échanger sur un projet.",
    cta: "Me contacter",
    modalTitle: "Envoyer un message",
    modalSubtitle:
      "Laisse-moi ton email et ton message, je te réponds rapidement.",
    emailLabel: "Email *",
    emailPlaceholder: "ton@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Décris ton projet ou ta question...",
    sending: "Envoi...",
    send: "Envoyer",
    successTitle: "Message envoyé",
    successText: "Merci ! Je reviens vers toi très rapidement.",
  },

  contentCreation: {
    title: "Création de Contenu",
    subtitle: "Je partage mes voyages, mes projets et mes découvertes en vidéo.",
    subscribe: "S'abonner",
    youtubeTitle: "Voyage en Malaisie",
    joinChannel: "Rejoins la chaîne pour suivre mes aventures",
    itinerariesLabel: "Itinéraires",
    itinerariesTitle: "Refais mes voyages, jour par jour",
    itinerariesSubtitle:
      "Chaque vidéo a son itinéraire complet : horaires, prix, astuces et export agenda.",
    itineraryBadge: "Nouveau",
    itineraryCta: "Voir l'itinéraire",
    days: "jours",
  },

  travelShowcase: {
    explore: "Explorer",
  },

  destinationPage: {
    back: "Retour",
    onSite: "sur place",
    season: "saison",
    highlights: "Lieux marquants",
    otherDestinations: "Autres destinations",
    continueAdventure: "Continue l'aventure",
    ctaBefore: "Envie de découvrir ",
    ctaAfter: " ?",
    vlogsBefore: "Voir les vlogs ",
    vlogsAfter: "",
    itineraryCta: "Voir l'itinéraire jour par jour",
  },

  itinerary: {
    back: "Retour",
    eyebrow: "Itinéraire vidéo",
    explore: "Explorer l'itinéraire",
    watch: "Regarder la vidéo",
    stats: {
      days: "jours",
      cities: "villes",
      activities: "activités",
      budget: "sur place",
    },
    budgetNote: "Hors hôtels et vols",
    euroRange: "{min}–{max} €",
    yuan: "{value} ¥",
    planner: {
      eyebrow: "Calendrier",
      title: "Jour par jour",
      hint: "Clique sur un jour ou navigue avec les flèches ← → du clavier.",
      hintTouch: "Touche un jour, ou glisse vers la gauche ou la droite pour changer.",
      startDate: "Date de départ",
      clearDate: "Effacer la date",
      export: "Ajouter à mon agenda",
      exportNeedsDate: "Choisis d'abord ta date de départ",
      exported: "Agenda téléchargé",
      route: "Le parcours",
      dayShort: "J",
      dayLabel: "Jour",
      of: "sur",
    },
    day: {
      travel: "Trajet",
      stay: "Nuit",
      budget: "Budget",
      share: "Partager ce jour",
      copied: "Lien copié",
      prev: "Jour précédent",
      next: "Jour suivant",
      nextUp: "Demain",
      tripEnd: "Fin du voyage",
      restart: "Revoir depuis le jour 1",
      tip: "Astuce",
      free: "Gratuit",
      openMap: "Voir sur la carte",
      inVideo: "Voir dans la vidéo",
      plane: "Avion",
      train: "Train",
    },
    kinds: {
      sight: "Visite",
      food: "Repas",
      nature: "Nature",
      night: "Soirée",
      transport: "Trajet",
      shopping: "Shopping",
    },
    essentials: {
      eyebrow: "Avant de partir",
      title: "Infos pratiques",
      checklist: "Ma checklist",
      checklistHint: "Sauvegardée sur cet appareil",
      ready: "Prêt pour le départ !",
    },
    video: {
      eyebrow: "La vidéo",
      title: "Tout le voyage en images",
      text: "Les paysages, les galères, les bonnes adresses : regarde la vidéo pour vivre chaque étape en vrai.",
      watch: "Regarder sur YouTube",
      subscribe: "S'abonner",
      play: "Lire la vidéo",
    },
    gate: {
      back: "Retour au site",
      badge: "Réservé aux abonnés",
      title: "Tu es abonné à ma chaîne ?",
      text: "L'itinéraire complet est offert à ceux qui soutiennent la chaîne. Ça prend deux secondes.",
      yes: "Oui, je suis abonné",
      subscribe: "Pas encore, je m'abonne",
      perks: {
        days: "jours détaillés",
        activities: "activités",
        calendar: "Export agenda",
      },
      steps: ["S'abonner", "Revenir ici", "Valider"],
      waitingTitle: "On t'attend sur YouTube",
      waitingText: "Abonne-toi dans l'onglet qui vient de s'ouvrir, puis reviens sur cette page.",
      done: "C'est fait, je suis abonné",
      reopen: "Rouvrir YouTube",
      backTitle: "Re ! Alors, c'est fait ?",
      backText: "Si tu t'es abonné, valide pour débloquer tout l'itinéraire.",
      unlock: "Valider et débloquer",
      notYet: "Pas encore, rouvrir YouTube",
      successTitle: "Accès débloqué",
      successText: "Merci pour le soutien. Bon voyage !",
    },
  },
} satisfies Record<string, unknown>;

/** Canonical dictionary shape, derived from the French (base) dictionary. */
export type Dictionary = typeof fr;
