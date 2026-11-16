import type { AppsDictionary } from "../fr/apps";

export const apps: AppsDictionary = {
  meta: {
    title: "Kenz — {app}",
    description: "One of Kenz’s apps, told in full: the problem, how it works, what the AI does, and the real thing.",
  },
  arrival: {
    scrollDown: "Scroll into the story",
  },
  how: {
    title: "How it works",
  },
  ai: {
    title: "The AI, plainly",
    engine: "Under the hood",
    chain: "The pipeline",
    fallback: "When it breaks",
    takeaway: "What I take from it",
    challenges: "The challenges",
  },
  weekend: {
    place: "place",
    line: "At Startup Weekend Grenoble, among many *teams*.",
    caption: "54 hours, in front of a jury, {dates}.",
  },
  real: {
    title: "The real thing",
    since: "On the App Store since {date}.",
    sinceFirst: "On the App Store since {date}: it’s my first app.",
    version: "Version {version}, updated {when}.",
    versionFirst: "Version {version}.",
    today: "today",
    yesterday: "yesterday",
    daysAgo: "{n} days ago",
    monthsAgo: "{n} months ago",
    on: "on {date}",
    online: "live",
    view: "{app}: the home page, scrollable",
  },
  action: {
    title: "Your turn to *try* it.",
    site: "{app}’s website",
    webTitle: "The site is *live*.",
    seeSite: "Visit the site",
  },
  next: {
    label: "Next story",
    caption: "Next story: {app}",
  },
  scenes: {
    sample: "sample",
    oshii: {
      caption: "creamy lemon pasta",
      shareTo: "Share to",
      recipe: "Creamy lemon pasta",
      ingredients: {
        pasta: "Pasta",
        parmesan: "Parmesan",
        lemon: "Lemon",
        cream: "Cream",
      },
      steps: "4 steps",
    },
    sago: {
      translation: "I like cats.",
    },
    wado: {
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      day: "Your day",
    },
    croc: {
      streak: "Streak",
      days: "days",
      morning: "Morning",
      commit: "I commit",
      evening: "Evening",
      kept: "Kept",
      week: "M T W T F S S",
      bravo: "This streak is holding. Well done.",
    },
    miru: {
      theme: "Theme",
      typed: "2000s movies",
    },
    zenko: {
      budget: "Budget",
      amount: "€{n}",
      min: "€0",
      max: "€50",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
    },
    escapades: {
      profile: "Adventurer",
    },
  },
};
