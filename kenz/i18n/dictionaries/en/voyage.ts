import type { VoyageDictionary } from "../fr/voyage";

export const voyage: VoyageDictionary = {
  meta: {
    title: "Kenz in Asia",
    description: "I travel across Asia and show what it really costs: my series, the real price, the China guide.",
  },
  hero: {
    titleTop: "Kenz",
    titleBottom: "in Asia",
    line: "I travel across Asia and tell you what it *really* costs.",
    down: "See the latest video",
  },
  latest: {
    title: "Latest video",
    watch: "Watch on YouTube",
    watchLabel: "Watch “{title}” on YouTube",
    published: "Published {date}",
  },
  series: {
    title: "My series",
    sub: "9 countries filmed, in order.",
    next: "Next stop",
    youtube: "YouTube",
    mediaLabel: "{country}: watch my videos on YouTube",
  },
  prix: {
    title: "The real price",
    lead: "In China, here’s what I *paid*.",
    note: "Prices I actually paid, not guaranteed rates.",
  },
  guide: {
    title: "Heading to *China*?",
    bases: "The three bases",
    watch: "Watch the itinerary video",
    soon: "More guides are on the way.",
  },
  marques: {
    title: "A brand, a destination, an *idea*?",
    brand: "Your brand",
    brandPlaceholder: "Your brand’s name",
    reply: "Your email or @",
    replyPlaceholder: "hello@brand.com or @brand",
    idea: "Your idea",
    ideaPlaceholder: "A destination, a format, a wish…",
    budget: "Budget range",
    optional: "(optional)",
    send: "Send",
    sending: "Sending…",
    errors: {
      brand: "Please enter your brand’s name.",
      reply: "Please enter an email or an @handle so I can get back to you.",
      replyInvalid: "Enter a full email address, or a handle starting with @.",
      replyShort: "An @handle needs at least {min} characters.",
      idea: "Describe your idea in a few words (at least 10 characters).",
      tooLong: "That’s a bit long: please shorten it.",
      budget: "Please pick a budget range from the list.",
      unavailable: "The message didn’t go through. Please try again in a moment.",
    },
    sent: {
      title: "Thanks, got it.",
      text: "I’ll get back to you very soon.",
      again: "Write another message",
    },
  },
  suivre: {
    title: "Follow me",
    followers: "{count} people follow me on TikTok.",
    accounts: "My travel accounts",
  },
  retour: {
    label: "Back to my content creation",
    door: "All my content creation",
  },
};
