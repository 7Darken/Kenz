"use client";

/* Client : index.ts est aussi importé par des layouts serveur, et ce hook lit le routeur. */
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { getArrival, getServerArrival, NO_ARRIVAL, subscribeArrival, type PassageArrival } from "./passage-state";

/**
 * Comment on arrive sur la page courante, connu dès son premier rendu côté client :
 * - `via` : null (chargement, lien ordinaire), "passage" (le voile coloré), "dive" (la plongée depuis Pro),
 *   "liftoff" (le décollage depuis Créateur) ;
 * - `withIcon` : arrivée avec l'icône d'une app, déjà posée sur [data-passage-icone] ;
 * - `ready` : le voile se lève, c'est le moment de jouer l'entrée (toujours vrai sans passage).
 * Le hero raccourcit son entrée quand `via` n'est pas null, et la joue quand `ready` passe à vrai ;
 * la Terre finit la descente quand `via === "dive"`.
 */
export function usePassageArrival(): PassageArrival {
  const pathname = usePathname();
  const entry = useSyncExternalStore(subscribeArrival, getArrival, getServerArrival);
  return entry && entry.path === pathname ? entry.arrival : NO_ARRIVAL;
}
