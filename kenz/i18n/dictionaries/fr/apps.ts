/**
 * Pages des apps (`/apps/[slug]`) : l'histoire de chaque app, badges des stores, Escapades Libres.
 * Rempli par l'agent du module « 54 h et pages des apps ». `{app}` : le nom de l'app.
 */
export const apps = {
  meta: {
    title: "Kenz — {app}",
    description:
      "Une app de Kenz racontée en entier : le problème, comment ça marche, ce que fait l’IA, et l’app en vrai.",
  },
};

export type AppsDictionary = typeof apps;
