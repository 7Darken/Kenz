import type { ProDictionary } from "../fr/pro";

export const pro: ProDictionary = {
  meta: {
    title: "Kenz — Pro",
    description: "I build apps where AI does the real work.",
  },
  hero: {
    title: "Kenz",
    line: "I build apps where AI does the *real* work.",
    down: "See what I build",
    portraitAlt: "Kenz in a midnight-blue suit and a white shirt, looking at the camera",
  },
  space: {
    title: "My apps",
    sub: "I dream them up, I build them, I *ship* them.",
    portraitAlt: "Kenz",
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
    reply: {
      label: "Your email",
      placeholder: "name@domain.com",
    },
    need: "What you need",
    message: "Your message",
    submit: "Send",
    errors: {
      name: "Please enter your name.",
      nameTooLong: "That name is a little long ({max} characters max).",
      reply: "Please enter your email so I can get back to you.",
      replyInvalid: "Enter a full email address, for example name@domain.com.",
      replyTooLong: "That’s a little long ({max} characters max).",
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
