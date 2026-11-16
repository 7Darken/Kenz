/**
 * Textes d'interface communs à tout le site (nav, thème, langue, actions génériques).
 * Le français définit la forme : chaque dictionnaire EN doit la respecter (vérifié par TypeScript).
 */
export const common = {
  skip: "Aller au contenu",
  theme: {
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
  },
  language: {
    group: "Langue",
    fr: "Français",
    en: "English",
  },
  nav: {
    contact: "Me contacter",
    chapters: "Chapitres",
    tryApp: "Essayer",
    /** « Essayer {app} » : nom accessible du bouton de l'app dans la nav ; il commence par le texte visible (`tryApp`) */
    tryAppLabel: "Essayer {app}",
    seeSite: "Voir le site",
    /** « Voir le site d’{app} » : nom accessible du lien du projet web dans la nav */
    seeSiteLabel: "Voir le site d’{app}",
    back: "Création de contenu",
    backShort: "Création",
  },
  actions: {
    backToTop: "Revenir en haut",
    close: "Fermer",
    replay: "Rejouer",
    scrollDown: "Voir la suite",
  },
  /** Badges des stores (texte alternatif des badges officiels) */
  stores: {
    appStore: "Télécharger dans l’App Store",
    googlePlay: "Disponible sur Google Play",
  },
  /** La page 404 (hors univers) */
  notFound: {
    meta: "Page introuvable — Kenz",
    title: "Cette page *n’existe pas*.",
    text: "Le lien est peut-être ancien, ou l’adresse contient une faute de frappe.",
    back: "Revenir à l’accueil",
  },
};

export type CommonDictionary = typeof common;
