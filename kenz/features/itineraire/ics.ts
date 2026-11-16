/**
 * Un petit écrivain iCalendar (RFC 5545) : assez pour que Google Agenda, Apple Calendrier et Outlook importent
 * une liste d'événements datés. Le fichier est créé dans le navigateur, rien ne part sur le réseau.
 */
export interface CalendarEvent {
  uid: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  location?: string;
}

const toIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Replie une ligne à 75 octets, sans couper un caractère sur plusieurs octets. */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // Les lignes de suite commencent par une espace, qui compte dans la limite.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function buildCalendar(name: string, events: readonly CalendarEvent[]): string {
  const stamp = toIcsDate(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//kenzenbien.fr//Itinerary//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toIcsDate(event.start)}`,
      `DTEND:${toIcsDate(event.end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
      ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function downloadCalendar(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Libérer tout de suite peut annuler le téléchargement dans Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
