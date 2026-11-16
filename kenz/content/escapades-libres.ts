/**
 * Les faits d'Escapades Libres que partagent sa fiche (content/apps.ts) et les 54 heures
 * (content/startup-weekend.ts) : une seule source, sans que la scène des 54 heures (composant client)
 * n'embarque le contenu de toutes les apps.
 */
import type { HexColor } from "@/content/types";

export const ESCAPADES_LIBRES = {
  slug: "escapades-libres",
  name: "Escapades Libres",
  site: "https://escapades-libres.vercel.app",
  /** L'or du projet. */
  tint: "#E3A21A",
} as const satisfies { slug: string; name: string; site: `https://${string}`; tint: HexColor };
