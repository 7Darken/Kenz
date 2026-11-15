/**
 * Univers Pro, accueil (`/`) : hero, scène des apps, « Pour votre équipe », contact.
 * Module « Pro accueil » (agent 1). `meta` sert aux métadonnées de la route.
 * `hero.createur` : les textes de la variante Créateur du hero partagé (features/hero, même module).
 * `*mot*` : le mot en Instrument Serif italique. Espace insécable (U+00A0) avant « ? ! : ; ».
 */
export const pro = {
  meta: {
    title: "Kenz — Pro",
    description: "Je construis des apps où l’IA fait le vrai travail.",
  },
  hero: {
    /** Le titre (et le nom du chapitre pour les lecteurs d'écran). */
    title: "Kenz",
    pro: {
      line: "Je construis des apps où l’IA fait le *vrai* travail.",
      down: "Voir ce que je construis",
      portraitAlt: "Kenz en costume bleu nuit et chemise blanche, regard caméra",
    },
    createur: {
      line: "Je voyage en Asie, je m’entraîne entre deux voyages, et je te raconte tout, *vraiment*.",
      down: "Partir avec moi",
      portraitAlt: "Kenz en t-shirt vert anis, le regard tourné vers l’horizon",
    },
  },
  space: {
    title: "Mes apps",
    sub: "Je les imagine, je les code, je les *publie*.",
    portraitAlt: "Kenz",
    /** Nom accessible d'un astre : « Oshii, cuisine : Ta vidéo TikTok devient une vraie recette. » */
    starLabel: "{app}, {domain}\u00a0: {line}",
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
    need: "Votre besoin",
    message: "Votre message",
    submit: "Envoyer",
    errors: {
      name: "Indiquez votre nom.",
      nameTooLong: "Ce nom est un peu long ({max} caractères au plus).",
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
