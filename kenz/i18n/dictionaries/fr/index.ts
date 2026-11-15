/** Dictionnaire français : la langue de base, qui définit la forme de tous les autres. */
import { agents } from "./agents";
import { apps } from "./apps";
import { common } from "./common";
import { createur } from "./createur";
import { footer } from "./footer";
import { pro } from "./pro";
import { sport } from "./sport";
import { victoire } from "./victoire";
import { voyage } from "./voyage";

export const fr = { common, pro, apps, agents, victoire, createur, voyage, sport, footer };

export type Dictionary = typeof fr;
