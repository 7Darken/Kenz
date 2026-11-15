import type { ProDictionary } from "../fr/pro";

export const pro: ProDictionary = {
  meta: {
    title: "Kenz — Pro",
    description: "I build apps where AI does the real work.",
  },
  hero: {
    title: "Kenz",
    pro: {
      line: "I build apps where AI does the *real* work.",
      down: "See what I build",
      portraitAlt: "Kenz in a midnight-blue suit and a white shirt, looking at the camera",
    },
    createur: {
      line: "I travel across Asia, train between trips, and tell you everything, *for real*.",
      down: "Come along",
      portraitAlt: "Kenz in a lime-green T-shirt, gazing toward the horizon",
    },
  },
  space: {
    title: "My apps",
    sub: "I dream them up, I build them, I *ship* them.",
    portraitAlt: "Kenz",
    starLabel: "{app}, {domain}: {line}",
    hint: "Touch a star.",
    explore: "Explore",
    scene: {
      example: "example",
      budget: "Budget",
      amount: "€{n}",
      min: "€0",
      max: "€50",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
    },
  },
  team: {
    title: "I don’t just talk to AI. I build systems that do the *work*.",
  },
  contact: {
    pro: {
      title: "Let’s talk about your *idea*.",
      messagePlaceholder: "Where are you at, and what would you like to change?",
    },
    agents: {
      title: "Let’s talk about your *process*.",
      messagePlaceholder: "Which task would you like to stop doing by hand?",
    },
    name: {
      label: "Your name",
      placeholder: "First and last name",
    },
    need: "What you need",
    message: "Your message",
    submit: "Send",
    errors: {
      name: "Please enter your name.",
      nameTooLong: "That name is a little long ({max} characters max).",
      need: "Pick what brings you here.",
      message: "A few more words, please ({min} characters minimum).",
      messageTooLong: "Your message is a little long ({max} characters max).",
      unavailable: "Your message didn’t go through. Please try again in a moment.",
    },
    thanks: {
      title: "Thanks, got it.",
      text: "I’ll get back to you very soon.",
      again: "Write another message",
    },
  },
};
