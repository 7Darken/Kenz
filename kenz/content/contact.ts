/**
 * Les deux formulaires du site et leur contrat avec `POST /api/contact` :
 * - « contact » (Pro, accueil et /agents) : nom, besoin (un choix), message ;
 * - « marques » (Créateur, /createur/voyage#marques) : nom de la marque, budget (facultatif), idée.
 * Les mêmes listes servent à l'affichage (libellés localisés) et à la validation serveur (valeurs).
 */
import type { Localized } from "@/i18n/localize";

export const CONTACT_TYPES = ["contact", "marques"] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

/** Pro : « Votre besoin » (pro.html, A4 Contact). */
export const CONTACT_NEEDS = ["app", "ia-produit", "agents", "autre"] as const;
export type ContactNeed = (typeof CONTACT_NEEDS)[number];

export const CONTACT_NEED_LABELS: Readonly<Record<ContactNeed, Localized<string>>> = {
  app: { fr: "Une app", en: "An app" },
  "ia-produit": { fr: "De l’IA dans mon produit", en: "AI in my product" },
  agents: { fr: "Des agents IA", en: "AI agents" },
  autre: { fr: "Autre", en: "Something else" },
};

/** Marques & collaborations : l'ordre de budget, facultatif (voyage.html). */
export const BRAND_BUDGET_VALUES = ["moins-1000", "1000-5000", "plus-5000", "a-definir"] as const;
export type BrandBudget = (typeof BRAND_BUDGET_VALUES)[number];

export const BRAND_BUDGET_LABELS: Readonly<Record<BrandBudget, Localized<string>>> = {
  "moins-1000": { fr: "Moins de 1 000 €", en: "Under €1,000" },
  "1000-5000": { fr: "1 000 à 5 000 €", en: "€1,000 to €5,000" },
  "plus-5000": { fr: "Plus de 5 000 €", en: "Over €5,000" },
  "a-definir": { fr: "À définir", en: "To be decided" },
};

/** Longueurs acceptées (les mêmes côté client et côté serveur). */
export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const;

/** Corps de la requête `POST /api/contact` (JSON). `website` : piège à robots, toujours vide. */
export interface ContactRequest {
  type: ContactType;
  nom: string;
  besoin?: ContactNeed | BrandBudget;
  message: string;
  website?: string;
}

/** Erreurs de champ renvoyées par l'API (codes, que l'interface traduit). */
export type ContactFieldError = "required" | "tooShort" | "tooLong" | "invalid";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: "invalid"; fields: Partial<Record<"type" | "nom" | "besoin" | "message", ContactFieldError>> }
  | { ok: false; error: "unavailable" };
