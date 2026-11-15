/** Dictionnaire anglais : typé par la forme du français (une clé manquante ou en trop ne compile pas). */
import type { Dictionary } from "../fr";
import { agents } from "./agents";
import { apps } from "./apps";
import { common } from "./common";
import { createur } from "./createur";
import { footer } from "./footer";
import { pro } from "./pro";
import { sport } from "./sport";
import { victoire } from "./victoire";
import { voyage } from "./voyage";

export const en: Dictionary = { common, pro, apps, agents, victoire, createur, voyage, sport, footer };
