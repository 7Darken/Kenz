/**
 * Les deux formulaires du site et leur contrat avec `POST /api/contact` :
 * - « contact » (Pro, accueil et /agents) : nom, e-mail ou @, besoin (un choix), message ;
 * - « marques » (Créateur, /createur/voyage#marques) : nom de la marque, e-mail ou @, idée, budget (facultatif).
 * Les mêmes listes servent à l'affichage (libellés localisés) et à la validation serveur (valeurs).
 */
import type { Localized } from "@/i18n/localize";

export const CONTACT_TYPES = ["contact", "marques"] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

/** Pro : « Votre besoin » (pro.html, A4 Contact). */
export const CONTACT_NEEDS = ["app", "ia-produit", "agents", "autre"] as const;
export type ContactNeed = (typeof CONTACT_NEEDS)[number];

/** La valeur reçue (FormData, JSON) est-elle un des besoins proposés ? */
export function isContactNeed(value: unknown): value is ContactNeed {
  return typeof value === "string" && (CONTACT_NEEDS as readonly string[]).includes(value);
}

export const CONTACT_NEED_LABELS: Readonly<Record<ContactNeed, Localized<string>>> = {
  app: { fr: "Une app", en: "An app" },
  "ia-produit": { fr: "De l’IA dans mon produit", en: "AI in my product" },
  agents: { fr: "Des agents IA", en: "AI agents" },
  autre: { fr: "Autre", en: "Something else" },
};

/** Marques & collaborations : l'ordre de budget, facultatif (voyage.html). */
export const BRAND_BUDGET_VALUES = ["moins-1000", "1000-5000", "plus-5000", "a-definir"] as const;
export type BrandBudget = (typeof BRAND_BUDGET_VALUES)[number];

/** La valeur reçue est-elle un des ordres de budget proposés ? */
export function isBrandBudget(value: unknown): value is BrandBudget {
  return typeof value === "string" && (BRAND_BUDGET_VALUES as readonly string[]).includes(value);
}

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
  /** « Votre e-mail ou @ » : 254 caractères, la plus longue adresse e-mail possible. */
  contactMax: 254,
  /** Le pseudo après le @. */
  handleMin: 3,
  messageMin: 10,
  /** Telegram accepte 4 096 caractères par message : au-delà de l'en-tête, l'API envoie la suite à part. */
  messageMax: 4000,
} as const;

/** Corps de la requête `POST /api/contact` (JSON). `website` : piège à robots, toujours vide. */
export interface ContactRequest {
  type: ContactType;
  nom: string;
  /** Pour que Kenz puisse répondre : une adresse e-mail ou un @pseudo de réseau (voir `checkContact`). */
  contact: string;
  besoin?: ContactNeed | BrandBudget;
  message: string;
  website?: string;
}

/**
 * Erreurs de champ renvoyées par l'API (codes, que l'interface traduit). Pour `contact` :
 * `required` (vide), `invalid` (ni une adresse ni un @pseudo), `tooShort` (pseudo de moins de 3 caractères),
 * `tooLong` (plus de 254 caractères).
 */
export type ContactFieldError = "required" | "tooShort" | "tooLong" | "invalid";

export type ContactField = "type" | "nom" | "contact" | "besoin" | "message";

export type ContactFieldErrors = Partial<Record<ContactField, ContactFieldError>>;

/**
 * `unavailable` : l'envoi a échoué (Telegram, réseau) ou le visiteur a trop envoyé d'un coup ; l'interface dit
 * « indisponible » dans les deux cas.
 */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: "invalid"; fields: ContactFieldErrors }
  | { ok: false; error: "unavailable" };

// Les caractères qu'une adresse réelle ne contient jamais sans guillemets : on ne refuse rien d'autre.
const EMAIL_CHAR = String.raw`[^\s@"(),:;<>[\]\\]`;
const EMAIL_LABEL = String.raw`[^\s@"(),:;<>[\]\\.]`;

/** Une adresse e-mail complète, mais souple : +, sous-domaines, accents, extensions récentes ou en punycode. */
const EMAIL = new RegExp(`^${EMAIL_CHAR}+@(?:${EMAIL_LABEL}+\\.)+${EMAIL_LABEL}{2,}$`, "u");

/** Un @pseudo : lettres (toutes écritures), chiffres, « . », « _ », « - » ; le serveur en option (Mastodon). */
const HANDLE = /^@([\p{L}\p{M}\p{N}._-]+)(?:@(?:[\p{L}\p{M}\p{N}-]+\.)+[\p{L}\p{M}\p{N}-]{2,})?$/u;

/** Un texte obligatoire (nom, message) : assez long, pas trop. `null` si la valeur convient. */
export function checkText(value: unknown, min: number, max: number): ContactFieldError | null {
  if (typeof value !== "string" || !value.trim()) return "required";
  const length = value.trim().length;
  if (length < min) return "tooShort";
  if (length > max) return "tooLong";
  return null;
}

/**
 * Valide un corps de requête : le même code dans les deux formulaires (avant l'envoi) et dans `POST /api/contact`.
 * Le besoin est obligatoire pour « contact » ; le budget est facultatif pour « marques ». Vide si tout convient.
 */
export function validateContact(body: Readonly<Record<string, unknown>>): ContactFieldErrors {
  const fields: ContactFieldErrors = {};
  const { type, nom, contact, besoin, message } = body;
  if (type !== "contact" && type !== "marques") fields.type = "invalid";
  const nomError = checkText(nom, CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax);
  if (nomError) fields.nom = nomError;
  const contactError = checkContact(contact);
  if (contactError) fields.contact = contactError;
  const messageError = checkText(message, CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax);
  if (messageError) fields.message = messageError;
  if (type === "contact" && !isContactNeed(besoin)) fields.besoin = besoin ? "invalid" : "required";
  if (type === "marques" && besoin !== undefined && besoin !== "" && !isBrandBudget(besoin)) fields.besoin = "invalid";
  return fields;
}

/** « Votre e-mail ou @ » : la même règle côté client et côté serveur. `null` si la valeur convient. */
export function checkContact(value: unknown): ContactFieldError | null {
  if (typeof value !== "string" || !value.trim()) return "required";
  const contact = value.trim();
  if (contact.length > CONTACT_LIMITS.contactMax) return "tooLong";
  const handle = HANDLE.exec(contact);
  if (handle) return handle[1].length < CONTACT_LIMITS.handleMin ? "tooShort" : null;
  return EMAIL.test(contact) ? null : "invalid";
}
