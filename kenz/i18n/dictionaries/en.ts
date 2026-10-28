/**
 * English dictionary.
 *
 * Typed as `Dictionary` so it MUST stay structurally in sync with the French
 * base dictionary — a missing or misnamed key is a compile-time error.
 */

import type { Dictionary } from "./fr";

export const en: Dictionary = {
  nav: {
    projects: "Projects",
    kenzAi: "Kenz AI",
    contact: "Contact",
    content: "Content",
    travels: "Travels",
    socials: "Socials",
    modePro: "Pro",
    modePerso: "Me",
    mode: "Mode",
    menu: "Menu",
    close: "Close",
  },

  hero: {
    greetingPro: "Hi, I'm Kenz",
    greetingPerso: "Hey, I'm Kenz",
    proSteps: [
      ["Full Stack", "Developer"],
      ["Backend", "Developer"],
      ["Frontend", "Developer"],
      ["Software", "Developer"],
      ["Software", "Engineer"],
    ],
    persoSteps: [
      ["Digital", "Creator"],
      ["Content", "Creator"],
      ["Globe", "Trotter"],
      ["Hybrid", "Athlete"],
    ],
    available: "Available for new opportunities",
    bio: "Passionate about crafting intuitive mobile & web experiences that deliver real value.",
    trust: {
      apps: "4 apps",
      middle: " published on the App Store with ",
      downloads: "12k+ downloads",
    },
    contact: "Get in touch",
    tiktok: {
      handle: "@7kinze",
      text: "Travel vlogs 🌍 Online business tips 💰 Japan · Korea · Iceland",
    },
    youtube: {
      handle: "@7Kinze",
      text: "Content creation · Online business · Long-term travel 🎬",
    },
    notifFollowers: { strong: "10K followers", rest: " reached on TikTok" },
    notifApps: {
      apps: "4 apps",
      middle: " launched · ",
      countries: "5 countries",
      rest: " filmed",
    },
  },

  common: {
    comingSoon: "Photo coming soon",
  },

  impact: {
    downloads: "Downloads",
    appsPublished: "Apps published",
    rating: "App Store rating",
  },

  mobileApps: {
    title: "Mobile Apps",
    subtitle: "Digital experiences crafted with passion.",
    details: "Details",
  },

  appDetail: {
    back: "Back",
    download: "Download",
    website: "Website",
    overview: "Overview",
    screenshots: "Screenshots",
    features: "Features",
    underTheHood: "Under the hood",
    stackArchitecture: "Stack & architecture",
    aiIntegrations: "AI integrations",
    technicalChallenges: "Technical challenges",
    aiBadge: "AI",
    ctaBefore: "Ready to try ",
    ctaAfter: "?",
    ctaSubtitleBoth: "Free on the App Store and Google Play.",
    ctaSubtitleApple: "Free on the App Store.",
    downloadNow: "Download now",
    googlePlay: "Google Play",
  },

  techStack: {
    label: "What I do",
    title: "Kenz AI",
    name: "Kenz",
    online: "Online",
    typing: "Kenz is typing",
    contactCta: "Get in touch",
    placeholderAsk: "Ask me a question...",
    placeholderDefault: "Pick a question or write your own...",
    intro: {
      question: "Hey Kenz, what exactly do you do?",
      answer:
        "I build mobile apps and digital products end to end — from the idea to shipping on the App Store.",
      tags: ["Swift", "SwiftUI", "React Native", "App Store"],
    },
    suggestions: [
      {
        label: "🌐 What about web?",
        question: "What about web?",
        answer:
          "I build modern, high-performance web experiences. This portfolio is one example — smooth animations, responsive, SSR.",
        tags: ["Next.js", "React", "TypeScript", "Framer Motion"],
      },
      {
        label: "⚙️ Do you handle backend?",
        question: "Do you handle the backend too?",
        answer:
          "Full stack. REST APIs, databases, auth, payments, cloud deployment. My apps run in production with thousands of users.",
        tags: ["Node.js", "PostgreSQL", "Firebase", "Vercel"],
      },
      {
        label: "📱 Your apps?",
        question: "What are your apps?",
        answer:
          "I have 4 published apps — Oshii for TikTok recipes, Zenko for travel, Sago to learn Japanese and Miru, a party game with friends. Over 12k downloads in total.",
        tags: ["Oshii", "Zenko", "Sago", "Miru"],
      },
      {
        label: "🎨 What about design?",
        question: "Do you do the design too?",
        answer:
          "Yes, from concept to pixel. Visual identity, UI/UX, prototyping. I create complete products, not just code.",
        tags: ["Figma", "UI/UX", "Branding"],
      },
    ],
    autoResponses: [
      {
        keywords: ["price", "pricing", "cost", "how much", "budget", "quote", "rate"],
        answer:
          "It depends on the project! Drop me an email at contact@kenzenbien.fr and let's talk.",
        tags: ["Freelance"],
      },
      {
        keywords: ["contact", "mail", "email", "reach", "get in touch"],
        answer:
          "You can reach me at contact@kenzenbien.fr or on LinkedIn. I'm available for new projects.",
        tags: ["Available"],
      },
      {
        keywords: ["hello", "hi", "hey", "yo", "good morning", "sup"],
        answer: "Hey! Feel free to ask me anything about my projects or skills.",
        tags: [],
      },
    ],
    defaultAnswer:
      "Good question! Feel free to contact me directly to talk about it.",
    defaultTags: ["Contact"],
  },

  achievements: {
    label: "Awards",
    title: "Competitions & awards",
    startupWeekend: {
      title: "1st Place — Startup Weekend",
      location: "France",
      badge: "Winner",
      description:
        "Winner of Startup Weekend: 54 hours to design, prototype and pitch a project as a team. Ranked 1st by the jury.",
      tags: ["Entrepreneurship", "Pitch", "54h", "Team"],
    },
  },

  sport: {
    label: "Sport & Challenges",
    title: "Pushing the limits",
    hyrox: {
      date: "May 2025",
      location: "Paris, France",
      description:
        "Hybrid race combining running and functional workouts. 8 stations, 8km of running — a complete fitness test.",
      tags: ["Endurance", "Functional", "8km"],
    },
    spartan: {
      date: "June 2025",
      location: "France",
      description:
        "Obstacle course out in the wild. Mud, walls, ropes — pushing physical and mental limits.",
      tags: ["Obstacles", "Nature", "Mental"],
    },
  },

  socials: {
    eyebrow: "Follow",
    title: "The Journey",
  },

  footer: {
    bioPro:
      "Full Stack Developer based in Paris. I build mobile apps and high-performance web experiences.",
    bioPerso:
      "Content creator, developer and globe-trotter. I share my travels and projects between Paris and Asia.",
    navigation: "Navigation",
    home: "Home",
    sport: "Sport",
    networks: "Socials",
    apps: "Apps",
    rights: "All rights reserved.",
    location: "Paris, France",
  },

  contactSection: {
    label: "Contact",
    title: "Got a project in mind?",
    subtitle:
      "I'm always open to new opportunities, collaborations or just chatting about a project.",
    cta: "Get in touch",
    modalTitle: "Send a message",
    modalSubtitle: "Leave me your email and message, I'll reply quickly.",
    emailLabel: "Email *",
    emailPlaceholder: "you@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Describe your project or question...",
    sending: "Sending...",
    send: "Send",
    successTitle: "Message sent",
    successText: "Thanks! I'll get back to you very soon.",
  },

  contentCreation: {
    title: "Content Creation",
    subtitle: "I share my travels, projects and discoveries on video.",
    subscribe: "Subscribe",
    youtubeTitle: "Trip to Malaysia",
    joinChannel: "Join the channel to follow my adventures",
    itinerariesLabel: "Itineraries",
    itinerariesTitle: "Follow my trips, day by day",
    itinerariesSubtitle:
      "Every video comes with its full itinerary: times, prices, tips and calendar export.",
    itineraryBadge: "New",
    itineraryCta: "See the itinerary",
    days: "days",
  },

  travelShowcase: {
    explore: "Explore",
  },

  destinationPage: {
    back: "Back",
    onSite: "on site",
    season: "season",
    highlights: "Key places",
    otherDestinations: "Other destinations",
    continueAdventure: "Continue the adventure",
    ctaBefore: "Want to discover ",
    ctaAfter: "?",
    vlogsBefore: "Watch the ",
    vlogsAfter: " vlogs",
    itineraryCta: "See the day-by-day itinerary",
  },

  itinerary: {
    back: "Back",
    eyebrow: "Video itinerary",
    explore: "Explore the itinerary",
    watch: "Watch the video",
    stats: {
      days: "days",
      cities: "cities",
      activities: "activities",
      budget: "on site",
    },
    budgetNote: "Excluding hotels and flights",
    euroRange: "€{min}–{max}",
    yuan: "¥{value}",
    planner: {
      eyebrow: "Calendar",
      title: "Day by day",
      hint: "Click a day or navigate with the ← → arrow keys.",
      hintTouch: "Tap a day, or swipe left and right to switch.",
      startDate: "Start date",
      clearDate: "Clear date",
      export: "Add to my calendar",
      exportNeedsDate: "Pick your start date first",
      exported: "Calendar downloaded",
      route: "The route",
      dayShort: "D",
      dayLabel: "Day",
      of: "of",
    },
    day: {
      travel: "Travel",
      stay: "Night",
      budget: "Budget",
      share: "Share this day",
      copied: "Link copied",
      prev: "Previous day",
      next: "Next day",
      nextUp: "Tomorrow",
      tripEnd: "End of the trip",
      restart: "Start again from day 1",
      tip: "Tip",
      free: "Free",
      openMap: "View on map",
      inVideo: "Watch in the video",
      plane: "Plane",
      train: "Train",
    },
    kinds: {
      sight: "Sightseeing",
      food: "Food",
      nature: "Nature",
      night: "Night",
      transport: "Transit",
      shopping: "Shopping",
      wellness: "Wellness",
    },
    theme: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
    essentials: {
      eyebrow: "Before you go",
      title: "Practical info",
      checklist: "My checklist",
      checklistHint: "Saved on this device",
      ready: "Ready for take-off!",
    },
    video: {
      eyebrow: "The video",
      title: "The whole trip on screen",
      text: "The landscapes, the struggles, the best spots: watch the video to live every stage for real.",
      watch: "Watch on YouTube",
      subscribe: "Subscribe",
      play: "Play the video",
    },
    gate: {
      back: "Back to site",
      badge: "Subscribers only",
      title: "Are you subscribed to my channel?",
      text: "The full itinerary is a gift for everyone who supports the channel. It takes two seconds.",
      yes: "Yes, I'm subscribed",
      subscribe: "Not yet, subscribe",
      perks: {
        days: "detailed days",
        activities: "activities",
        calendar: "Calendar export",
      },
      steps: ["Subscribe", "Come back", "Confirm"],
      waitingTitle: "Waiting for you on YouTube",
      waitingText: "Subscribe in the tab that just opened, then come back to this page.",
      done: "Done, I'm subscribed",
      reopen: "Reopen YouTube",
      backTitle: "Welcome back! All done?",
      backText: "If you subscribed, confirm to unlock the whole itinerary.",
      unlock: "Confirm & unlock",
      notYet: "Not yet, reopen YouTube",
      successTitle: "Unlocked",
      successText: "Thanks for the support. Enjoy the trip!",
    },
  },
};
