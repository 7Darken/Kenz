/**
 * Page d'un itinéraire jour par jour (`/createur/itineraire/[slug]`), univers Créateur : l'arrivée, le calendrier,
 * le jour ouvert, la carte du trajet, les infos pratiques, la vidéo, et la porte « abonnés » (subscribe-gate).
 * Les données du voyage (jours, villes, activités) sont dans content/itineraries.ts.
 */
export const itineraire = {
  meta: {
    /** « 14 jours en Chine : Pékin → Chongqing → Wulong → Shanghai » */
    title: "{title} : {route}",
  },
  hero: {
    explore: "Explorer l’itinéraire",
    watch: "Regarder la vidéo",
    /** Nom accessible de l'affiche : « Regarder la vidéo : 14 jours en Chine » */
    watchLabel: "Regarder la vidéo : {title}",
    /** Nom de la liste des villes (lecteurs d'écran) */
    route: "Les étapes",
    /** Nom du résumé chiffré (lecteurs d'écran) */
    facts: "Le voyage en bref",
  },
  stats: {
    days: "jours",
    cities: "villes",
    activities: "activités",
    budget: "sur place",
  },
  budgetNote: "Hors hôtels et vols",
  /** Fourchette en euros */
  euroRange: "{min}–{max} €",
  /** Prix en yuans */
  yuan: "{value} ¥",
  planner: {
    title: "Jour par jour",
    hint: "Clique sur un jour ou navigue avec les flèches ← → du clavier.",
    hintTouch: "Touche un jour, ou glisse vers la gauche ou la droite pour changer.",
    /** Nom des boutons des villes (lecteurs d'écran) */
    cities: "Aller à une ville",
    /** Nom du calendrier (lecteurs d'écran) */
    days: "Les jours du voyage",
    startDate: "Date de départ",
    clearDate: "Effacer la date",
    export: "Ajouter à mon agenda",
    exportNeedsDate: "Choisis d’abord ta date de départ",
    exported: "Agenda téléchargé",
    route: "Le parcours",
    /** Le jour en abrégé : « J5 » */
    dayShort: "J",
    dayLabel: "Jour",
    of: "sur",
    /** Nom de la barre flottante des jours (lecteurs d'écran) */
    dock: "Changer de jour",
  },
  day: {
    travel: "Trajet",
    stay: "Nuit",
    budget: "Budget",
    share: "Partager ce jour",
    copied: "Lien copié",
    prev: "Jour précédent",
    next: "Jour suivant",
    nextUp: "Demain",
    tripEnd: "Fin du voyage",
    restart: "Revoir depuis le jour 1",
    tip: "Astuce",
    free: "Gratuit",
    openMap: "Voir sur la carte",
    /** Nom de la liste des activités (lecteurs d'écran) : « Le programme du jour 5 » */
    program: "Le programme du jour {n}",
  },
  kinds: {
    sight: "Visite",
    food: "Repas",
    nature: "Nature",
    night: "Soirée",
    transport: "Trajet",
    shopping: "Shopping",
    wellness: "Détente",
  },
  essentials: {
    title: "Infos pratiques",
    checklist: "Ma checklist",
    checklistHint: "Sauvegardée sur cet appareil",
    ready: "Prêt pour le départ !",
  },
  video: {
    title: "Tout le voyage en *images*",
    text: "Les paysages, les galères, les bonnes adresses : regarde la vidéo pour vivre chaque étape en vrai.",
    watch: "Regarder sur YouTube",
    subscribe: "S’abonner",
    play: "Lire la vidéo",
  },
  gate: {
    back: "Retour au site",
    title: "Tu es abonné à ma chaîne ?",
    text: "L’itinéraire complet est offert à ceux qui soutiennent la chaîne. Ça prend deux secondes.",
    yes: "Oui, je suis abonné",
    subscribe: "Pas encore, je m’abonne",
    perks: {
      days: "jours détaillés",
      activities: "activités",
      calendar: "Export agenda",
    },
    steps: ["S’abonner", "Revenir ici", "Valider"],
    waitingTitle: "On t’attend sur YouTube",
    waitingText: "Abonne-toi dans l’onglet qui vient de s’ouvrir, puis reviens sur cette page.",
    done: "C’est fait, je suis abonné",
    reopen: "Rouvrir YouTube",
    backTitle: "Re ! Alors, c’est fait ?",
    backText: "Si tu t’es abonné, valide pour débloquer tout l’itinéraire.",
    unlock: "Valider et débloquer",
    notYet: "Pas encore, rouvrir YouTube",
    successTitle: "Accès débloqué",
    successText: "Merci pour le soutien. Bon voyage !",
  },
};

export type ItineraireDictionary = typeof itineraire;
