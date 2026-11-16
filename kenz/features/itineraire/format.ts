/** Mise en forme des durées, prix et dates de l'itinéraire. */
import type { PriceRange } from "@/content/itineraries";
import type { Lang } from "@/i18n/config";
import { format } from "@/i18n/format";
import type { CityStop } from "./trip";

const NB = " ";

export const padDay = (day: number) => String(day).padStart(2, "0");

/** « 45 min », « 3 h », « 1 h 15 ». */
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}${NB}min`;
  return rest === 0 ? `${hours}${NB}h` : `${hours}${NB}h${NB}${String(rest).padStart(2, "0")}`;
}

/** « Gratuit », « ≈ 40–60 ¥ », « ≈ 45 ¥ ». */
export function formatPrice(price: PriceRange, strings: { free: string; yuan: string }) {
  if (price.min === 0 && !price.max) return strings.free;
  const value = price.max ? `${price.min}–${price.max}` : price.min;
  return `≈${NB}${format(strings.yuan, { value })}`;
}

/** « J1–5 », « J10 ». */
export function dayRange(stop: Pick<CityStop, "firstDay" | "lastDay">, dayShort: string) {
  return `${dayShort}${stop.firstDay === stop.lastDay ? stop.firstDay : `${stop.firstDay}–${stop.lastDay}`}`;
}

/* Les dates : un départ est gardé en « AAAA-MM-JJ » et traité en UTC, pour qu'aucun fuseau ne décale un jour. */

export function parseIsoDate(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

export function formatDate(date: Date, lang: Lang, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(lang, { ...options, timeZone: "UTC" }).format(date);
}
