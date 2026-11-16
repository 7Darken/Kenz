/**
 * `POST /api/contact` : les formulaires « contact » (Pro) et « marques » (Créateur) → un message Telegram.
 * Corps JSON : { type, nom, contact, besoin?, message, website? } (contrat : content/contact.ts).
 * Validation côté serveur (`validateContact`, le même code que les formulaires) ; les erreurs de champ sont des
 * codes, traduits par l'interface. Secrets en variables d'environnement : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 *
 * Contre les abus (en plus du piège `website`, que contourne tout appel direct) :
 * - JSON seulement (415) : un site tiers ne peut pas envoyer un POST « simple » en `text/plain` sans pré-vol CORS ;
 * - même origine seulement (403), d'après `Sec-Fetch-Site` et `Origin` quand le navigateur les envoie ;
 * - un corps de 20 Kio au plus (413), lu par morceaux ;
 * - quelques envois par adresse IP et par fenêtre de 10 minutes (429).
 */
import { NextResponse } from "next/server";

import {
  BRAND_BUDGET_LABELS,
  CONTACT_NEED_LABELS,
  isBrandBudget,
  isContactNeed,
  validateContact,
  type ContactResponse,
  type ContactType,
} from "@/content/contact";

/**
 * Le plus gros envoi légitime : 4 000 caractères de message, 120 de nom, 254 de contact, à 3 octets au plus
 * par caractère en UTF-8 (≈ 13,2 Kio), plus les clés du JSON.
 */
const MAX_BODY_BYTES = 20 * 1024;
/** Telegram : 4 096 caractères par message, comptés après l'analyse des balises et des entités. */
const TELEGRAM_MAX = 4096;
const TELEGRAM_TIMEOUT_MS = 8000;

const json = (body: ContactResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json<ContactResponse>(body, { status, headers });

const unavailable = (status: number, headers?: HeadersInit) => json({ ok: false, error: "unavailable" }, status, headers);

/* ---------- Limite de débit ---------- */

/**
 * En mémoire, par instance du serveur : elle suffit à freiner un script qui inonde le formulaire. Pour une limite
 * partagée entre instances, il faudrait le KV de l'hébergeur.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_SENDS = 5;
const sendsByIp = new Map<string, number[]>();

/** L'adresse du visiteur, telle que le proxy de l'hébergeur la transmet. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "inconnue";
}

/** Compte un envoi ; `false` si l'adresse a déjà atteint la limite de la fenêtre. */
function allowSend(ip: string, now = Date.now()): boolean {
  const recent = (sendsByIp.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_SENDS) {
    sendsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  sendsByIp.set(ip, recent);
  // La table ne grossit pas sans fin : on oublie les adresses dont la fenêtre est passée.
  if (sendsByIp.size > 1000) {
    for (const [key, times] of sendsByIp) {
      if (times.every((at) => now - at >= RATE_WINDOW_MS)) sendsByIp.delete(key);
    }
  }
  return true;
}

/* ---------- Requête ---------- */

/** Un envoi venu d'une autre origine (formulaire ou script d'un site tiers, dans le navigateur d'un visiteur). */
function isCrossSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false; // client hors navigateur : la limite de débit s'applique
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")].filter(Boolean);
  try {
    return !hosts.includes(new URL(origin).host);
  } catch {
    return true;
  }
}

/** Le corps, lu par morceaux et coupé au-delà de `limit` octets ; `null` s'il est trop gros. */
async function readBody(request: Request, limit: number): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > limit) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    parts.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/* ---------- Le message Telegram ---------- */

/** Échappe le texte pour le mode HTML de Telegram (aucune mise en forme injectée par le visiteur). */
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** La longueur que Telegram compte : sans les balises, une entité vaut un caractère (unités UTF-16). */
const telegramLength = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&(?:amp|lt|gt);/g, "&").length;

/** Coupe un texte brut en morceaux : le premier d'au plus `first` caractères, les suivants d'au plus `next`. */
function split(text: string, first: number, next: number): string[] {
  const parts: string[] = [];
  let rest = text;
  let size = first;
  while (rest.length > size) {
    // De préférence à un saut de ligne ou une espace, sans couper un caractère en deux (paire UTF-16).
    let cut = Math.max(rest.lastIndexOf("\n", size), rest.lastIndexOf(" ", size));
    if (cut < size * 0.6) cut = size;
    if (/[\uD800-\uDBFF]/.test(rest.charAt(cut - 1))) cut -= 1;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
    size = next;
  }
  parts.push(rest);
  return parts;
}

interface TelegramFields {
  type: ContactType;
  nom: string;
  contact: string;
  besoin: unknown;
  message: string;
}

/** Le message, en un ou plusieurs envois de 4 096 caractères au plus (l'en-tête, puis le texte du visiteur). */
function telegramMessages({ type, nom, contact, besoin, message }: TelegramFields): string[] {
  const need =
    type === "contact"
      ? isContactNeed(besoin) && CONTACT_NEED_LABELS[besoin].fr
      : isBrandBudget(besoin) && BRAND_BUDGET_LABELS[besoin].fr;
  const head = [
    type === "contact" ? "📩 <b>Nouveau message (Pro)</b>" : "🤝 <b>Marques &amp; collaborations</b>",
    "",
    `<b>${type === "contact" ? "Nom" : "Marque"} :</b> ${escapeHtml(nom)}`,
    `<b>Répondre à :</b> ${escapeHtml(contact)}`,
    need ? `<b>${type === "contact" ? "Besoin" : "Budget"} :</b> ${escapeHtml(need)}` : null,
    "",
    `<b>${type === "contact" ? "Message" : "Idée"} :</b>`,
  ]
    .filter((line) => line !== null)
    .join("\n");
  const more = "<i>(suite)</i>\n";
  const [first = "", ...rest] = split(message, TELEGRAM_MAX - telegramLength(head) - 1, TELEGRAM_MAX - telegramLength(more));
  return [`${head}\n${escapeHtml(first)}`, ...rest.map((part) => `${more}${escapeHtml(part)}`)];
}

/** Envoie un message ; `false` si Telegram refuse, ne répond pas à temps, ou si le réseau échoue. */
async function sendTelegram(token: string, chatId: string, text: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/* ---------- La route ---------- */

export async function POST(request: Request) {
  const invalid = json({ ok: false, error: "invalid", fields: {} }, 400);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "invalid", fields: {} }, 415);
  }
  if (isCrossSite(request)) return json({ ok: false, error: "invalid", fields: {} }, 403);

  const raw = await readBody(request, MAX_BODY_BYTES);
  if (raw === null) return json({ ok: false, error: "invalid", fields: {} }, 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid;
    body = parsed as Record<string, unknown>;
  } catch {
    return invalid;
  }

  const fields = validateContact(body);
  const { type, nom, contact, besoin, message } = body;
  // Les quatre dernières conditions sont déjà couvertes par `fields` : elles servent au typage de la suite.
  if (
    Object.keys(fields).length ||
    (type !== "contact" && type !== "marques") ||
    typeof nom !== "string" ||
    typeof contact !== "string" ||
    typeof message !== "string"
  ) {
    return json({ ok: false, error: "invalid", fields }, 400);
  }

  // Piège à robots : un vrai visiteur ne remplit jamais ce champ caché. On répond « ok » sans rien envoyer.
  // Il passe après la validation : un envoi piégé mais valide répond 200, ce qui permet de tester l'API sans message.
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });

  if (!allowSend(clientIp(request))) return unavailable(429, { "Retry-After": String(RATE_WINDOW_MS / 1000) });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return unavailable(500);

  const messages = telegramMessages({ type, nom: nom.trim(), contact: contact.trim(), besoin, message: message.trim() });
  for (const text of messages) {
    if (!(await sendTelegram(token, chatId, text))) return unavailable(502);
  }
  return json({ ok: true });
}
