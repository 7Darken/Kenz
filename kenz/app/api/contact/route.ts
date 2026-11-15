/**
 * `POST /api/contact` : les formulaires « contact » (Pro) et « marques » (Créateur) → un message Telegram.
 * Corps JSON : { type, nom, besoin?, message, website? } (contrat : content/contact.ts).
 * Validation côté serveur ; les erreurs de champ sont des codes, traduits par l'interface.
 * Secrets en variables d'environnement : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 */
import { NextResponse } from "next/server";

import {
  BRAND_BUDGET_LABELS,
  BRAND_BUDGET_VALUES,
  CONTACT_LIMITS,
  CONTACT_NEED_LABELS,
  CONTACT_NEEDS,
  CONTACT_TYPES,
  type ContactFieldError,
  type ContactResponse,
  type ContactType,
} from "@/content/contact";

type Fields = Extract<ContactResponse, { error: "invalid" }>["fields"];

const includes = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (list as readonly string[]).includes(value);

function checkText(value: unknown, min: number, max: number): ContactFieldError | null {
  if (typeof value !== "string" || !value.trim()) return "required";
  const length = value.trim().length;
  if (length < min) return "tooShort";
  if (length > max) return "tooLong";
  return null;
}

/** Échappe le texte pour le mode HTML de Telegram (aucune mise en forme injectée par le visiteur). */
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function telegramText(type: ContactType, nom: string, besoin: string | undefined, message: string) {
  const need =
    type === "contact"
      ? includes(CONTACT_NEEDS, besoin) && CONTACT_NEED_LABELS[besoin].fr
      : includes(BRAND_BUDGET_VALUES, besoin) && BRAND_BUDGET_LABELS[besoin].fr;
  return [
    type === "contact" ? "📩 <b>Nouveau message (Pro)</b>" : "🤝 <b>Marques &amp; collaborations</b>",
    "",
    `<b>${type === "contact" ? "Nom" : "Marque"} :</b> ${escapeHtml(nom)}`,
    need ? `<b>${type === "contact" ? "Besoin" : "Budget"} :</b> ${escapeHtml(need)}` : null,
    "",
    `<b>${type === "contact" ? "Message" : "Idée"} :</b>`,
    escapeHtml(message),
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json<ContactResponse>({ ok: false, error: "invalid", fields: {} }, { status: 400 });
  }

  // Piège à robots : un vrai visiteur ne remplit jamais ce champ caché. On répond « ok » sans rien envoyer.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json<ContactResponse>({ ok: true });
  }

  const fields: Fields = {};
  const { type, nom, besoin, message } = body;
  if (!includes(CONTACT_TYPES, type)) fields.type = "invalid";
  const nomError = checkText(nom, CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax);
  if (nomError) fields.nom = nomError;
  const messageError = checkText(message, CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax);
  if (messageError) fields.message = messageError;
  // Le besoin est obligatoire pour « contact » ; le budget est facultatif pour « marques ».
  if (type === "contact" && !includes(CONTACT_NEEDS, besoin)) fields.besoin = besoin ? "invalid" : "required";
  if (type === "marques" && besoin !== undefined && besoin !== "" && !includes(BRAND_BUDGET_VALUES, besoin)) {
    fields.besoin = "invalid";
  }

  // Les trois dernières conditions sont déjà couvertes par `fields` : elles servent au typage de la suite.
  if (Object.keys(fields).length || !includes(CONTACT_TYPES, type) || typeof nom !== "string" || typeof message !== "string") {
    return NextResponse.json<ContactResponse>({ ok: false, error: "invalid", fields }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json<ContactResponse>({ ok: false, error: "unavailable" }, { status: 500 });
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramText(type, nom.trim(), typeof besoin === "string" ? besoin : undefined, message.trim()),
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    return NextResponse.json<ContactResponse>({ ok: false, error: "unavailable" }, { status: 502 });
  }
  return NextResponse.json<ContactResponse>({ ok: true });
}
