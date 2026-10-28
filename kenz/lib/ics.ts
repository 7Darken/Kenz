/* Minimal iCalendar (RFC 5545) writer — enough for Google Calendar,
   Apple Calendar and Outlook to import a list of timed events. */

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

const encoder = new TextEncoder();

/** Folds a content line at 75 octets, never splitting a multi-byte character. */
function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines start with a space, which counts toward the limit.
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

export function buildCalendar(name: string, events: CalendarEvent[]): string {
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
  // Revoking synchronously can cancel the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
