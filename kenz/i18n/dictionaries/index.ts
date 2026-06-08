import type { Lang } from "../config";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type { Dictionary };

/** All dictionaries, keyed by language code. */
export const dictionaries: Record<Lang, Dictionary> = { fr, en };
