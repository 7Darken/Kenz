/**
 * Univers Pro, accueil (`/`) : hero, scène des apps, « Pour votre équipe », contact.
 * Module « Pro accueil » (agent 1). `meta` sert aux métadonnées de la route.
 * `*mot*` : le mot en Instrument Serif italique. Espace insécable (U+00A0) avant « ? ! : ; ».
 */
export const pro = {
  meta: {
    title: "Kenz — Pro",
    description: "Je construis des apps où l’IA fait le vrai travail.",
  },
  /** Le hero partagé (features/hero), variante Pro ; la variante Créateur lit `createur.hero`. */
  hero: {
    /** Le titre (et le nom du chapitre pour les lecteurs d'écran). */
    title: "Kenz",
    line: "Je construis des apps où l’IA fait le *vrai* travail.",
    down: "Voir ce que je construis",
    portraitAlt: "Kenz en costume bleu nuit et chemise blanche, regard caméra",
  },
  space: {
    title: "Mes apps",
    sub: "Je les imagine, je les code, je les *publie*.",
    portraitAlt: "Kenz",
    hint: "Touche une étoile.",
    explore: "Explorer",
    /** La mini-animation de la fiche (données d'exemple). */
    scene: {
      example: "exemple",
      budget: "Budget",
      /** Le budget : « 40 € ». `{n}` est animé, l'unité reste en petit. */
      amount: "{n} €",
      min: "0 €",
      max: "50 €",
      morning: "Matin",
      afternoon: "Après-midi",
      evening: "Soir",
    },
  },
  team: {
    title: "Je ne me contente pas de parler à l’IA. Je construis des systèmes qui font le *travail*.",
  },
  contact: {
    pro: {
      title: "Parlons de votre *idée*.",
      messagePlaceholder: "Où en êtes-vous, et qu’aimeriez-vous changer ?",
    },
    agents: {
      title: "Parlons de votre *process*.",
      messagePlaceholder: "Quelle tâche aimeriez-vous ne plus faire à la main ?",
    },
    name: {
      label: "Votre nom",
      placeholder: "Prénom et nom",
    },
    /** Pour pouvoir répondre par e-mail. */
    reply: {
      label: "Votre e-mail",
      placeholder: "nom@domaine.fr",
    },
    need: "Votre besoin",
    message: "Votre message",
    submit: "Envoyer",
    errors: {
      name: "Indiquez votre nom.",
      nameTooLong: "Ce nom est un peu long ({max} caractères au plus).",
      reply: "Indiquez votre e-mail, pour que je puisse vous répondre.",
      replyInvalid: "Entrez une adresse e-mail complète, par exemple nom@domaine.fr.",
      replyTooLong: "C’est un peu long ({max} caractères au plus).",
      need: "Choisissez ce qui vous amène.",
      /** `{min}` : la longueur minimale (content/contact.ts). */
      message: "Quelques mots de plus ({min} caractères au moins).",
      messageTooLong: "Votre message est un peu long ({max} caractères au plus).",
      unavailable: "Le message n’est pas parti. Réessayez dans un instant.",
    },
    thanks: {
      title: "Merci, c’est noté.",
      text: "Je reviens vers vous très vite.",
      again: "Écrire un autre message",
    },
  },
};

export type ProDictionary = typeof pro;
