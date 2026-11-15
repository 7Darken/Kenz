/**
 * La date d'une course, à partir de sa date ISO (`AAAA-MM-JJ`, `AAAA-MM` ou `AAAA`), dans la langue active :
 * « 31 mai 2025 », « Juin 2025 », « Depuis le 14 octobre 2026 » (en : « May 31, 2025 », « Since October 14, 2026 »).
 * Les mots viennent du dictionnaire : le rendu serveur et le client donnent la même chaîne (pas d'Intl).
 */
import type { IsoDate } from "@/content/types";
import type { SportDictionary } from "@/i18n/dictionaries/fr/sport";
import { format } from "@/i18n/format";

type DateWords = SportDictionary["courses"]["date"];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function formatCourseDate(iso: IsoDate, ongoing: boolean, words: DateWords): string {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = month ? words.months[month - 1] : undefined;
  if (day && monthName) {
    const date = format(words.day, { day: day === 1 ? words.firstDay : day, month: monthName, year });
    return ongoing ? format(words.since, { date }) : date;
  }
  const date = monthName ? format(words.month, { month: monthName, year }) : String(year);
  return ongoing ? format(words.sinceMonth, { date }) : capitalize(date);
}
