/**
 * Page Voyage (`/createur/voyage`), DA Terre : l'arrivée, la dernière vidéo, mes séries, le vrai prix, le guide,
 * Marques & collaborations (features/marques), me suivre, le retour.
 */
export const voyage = {
  meta: {
    title: "Kenz en Asie",
    description:
      "Je voyage en Asie et je raconte ce que ça coûte vraiment : mes séries, le vrai prix, le guide pour la Chine.",
  },
  hero: {
    titleTop: "Kenz",
    titleBottom: "en Asie",
    line: "Je voyage en Asie et je te raconte ce que ça coûte *vraiment*.",
    down: "Voir la dernière vidéo",
  },
  latest: {
    title: "Dernière vidéo",
    watch: "Regarder sur YouTube",
    /** Nom accessible de la miniature : « Regarder « <titre> » sur YouTube » */
    watchLabel: "Regarder « {title} » sur YouTube",
    /** « Publiée le 31 octobre 2026 » (la date suit la langue) */
    published: "Publiée le {date}",
  },
  series: {
    title: "Mes séries",
    sub: "9 pays filmés, dans l’ordre.",
    next: "Prochaine escale",
    youtube: "YouTube",
    /** Nom accessible d'une miniature : « Japon : voir mes vidéos sur YouTube » */
    mediaLabel: "{country} : voir mes vidéos sur YouTube",
  },
  prix: {
    title: "Le vrai prix",
    lead: "En Chine, voilà ce que j’ai *payé*.",
    note: "Prix vécus, pas des tarifs garantis.",
  },
  guide: {
    title: "Tu pars en *Chine* ?",
    bases: "Les trois bases",
    /** Le bouton, tant que la page de l'itinéraire n'est pas en ligne : la vidéo du même itinéraire */
    watch: "Voir l’itinéraire en vidéo",
    soon: "D’autres guides arrivent.",
  },
  marques: {
    title: "Une marque, une destination, une *idée* ?",
    brand: "Votre marque",
    brandPlaceholder: "Le nom de votre marque",
    /** Pour pouvoir répondre : une adresse e-mail ou un pseudo de réseau. */
    reply: "Votre e-mail ou @",
    replyPlaceholder: "contact@marque.com ou @marque",
    idea: "Votre idée",
    ideaPlaceholder: "Une destination, un format, une envie…",
    budget: "Ordre de budget",
    optional: "(facultatif)",
    send: "Envoyer",
    sending: "Envoi…",
    errors: {
      brand: "Indiquez le nom de votre marque.",
      reply: "Indiquez un e-mail ou un @pseudo, pour que je puisse vous répondre.",
      replyInvalid: "Entrez un e-mail complet ou un pseudo précédé de @.",
      /** `{min}` : la longueur minimale du pseudo, après le @ (content/contact.ts). */
      replyShort: "Un @pseudo compte au moins {min} caractères.",
      idea: "Décrivez votre idée en quelques mots (10 caractères au moins).",
      tooLong: "C’est un peu long : raccourcissez, s’il vous plaît.",
      budget: "Choisissez un ordre de budget dans la liste.",
      unavailable: "L’envoi n’a pas abouti. Réessayez dans un instant.",
    },
    sent: {
      title: "Merci, c’est noté.",
      text: "Je reviens vers vous très vite.",
      again: "Écrire un autre message",
    },
  },
  suivre: {
    title: "Me suivre",
    /** « ≈ 28 000 personnes me suivent sur TikTok. » ({count} : content/series.ts) */
    followers: "{count} personnes me suivent sur TikTok.",
    accounts: "Mes comptes voyage",
  },
  retour: {
    label: "Revenir à ma création de contenu",
    door: "Toute ma création de contenu",
  },
};

export type VoyageDictionary = typeof voyage;
