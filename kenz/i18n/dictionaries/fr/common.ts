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
    /** « Essayer {app} » : nom accessible du bouton de l'app dans la nav */
    tryAppLabel: "Essayer {app}",
    seeSite: "Voir le site",
    /** « Voir le site d’{app} » : nom accessible du lien du projet web dans la nav */
    seeSiteLabel: "Voir le site d’{app}",
    back: "Création de contenu",
    backShort: "Création",
  },
  /** Passages secrets (features/passages, agent 6) : seul cet agent modifie ce bloc. */
  passages: {
    /** Nom accessible du point du logo quand il porte le cordon (la maquette ne trahit rien : « Kenz »). */
    dotLabel: "Kenz",
  },
  actions: {
    backToTop: "Revenir en haut",
    close: "Fermer",
    replay: "Rejouer",
    scrollDown: "Voir la suite",
  },
};

export type CommonDictionary = typeof common;
