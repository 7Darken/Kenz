/**
 * Page Agents (`/agents`) et « la machine » (features/ia, aussi en aperçu sur l'accueil Pro) :
 * la phrase forte, la machine, « Et chez vous ? », la méthode. Les cas et les besoins sont dans content/ia.ts.
 */
export const agents = {
  meta: {
    title: "Kenz — L’IA au travail",
    description: "Je construis des systèmes qui font le travail, et vous gardez la main.",
  },
  hero: {
    /** La première phrase, en retrait (couleur atténuée). */
    lead: "Je ne me contente pas de parler à l’IA.",
    title: "Je construis des systèmes qui font le *travail*.",
    sub: "Et c’est vous qui gardez la main. Choisissez un cas :",
  },
  machine: {
    /** Titre (lecteurs d'écran) de la section de la machine. */
    label: "La machine, sur quatre vrais cas",
    choose: "Choisir un exemple",
    machine: "La machine",
    you: "Vous validez",
    approved: "Validé",
    approve: "Valider",
    realLife: "Dans la vraie vie",
    /** Entre « Dans la vraie vie » et la suite. */
    realLifeSeparator: " : ",
    seeHow: "Voir comment",
    /** Annonces aux lecteurs d'écran, au fil du récit. */
    live: {
      working: "La machine se met au travail.",
      step: "{verb}.",
      waiting: "La machine s’arrête : elle attend votre validation. Bouton « Valider ».",
      done: "Validé. {done}",
    },
  },
  needs: {
    title: "Et chez vous ?",
    prompt: "Choisissez ce qui vous ressemble.",
    region: "Ce que la machine ferait pour vous",
    machineDoes: "Ce que la machine ferait",
    leftToYou: "Ce qui reste à vous",
    cta: "Parlons de votre process",
  },
  method: {
    title: "Comment on avance",
  },
};

export type AgentsDictionary = typeof agents;
