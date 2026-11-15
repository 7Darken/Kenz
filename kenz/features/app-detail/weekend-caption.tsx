"use client";

/** « 54 heures, devant un jury, du 28 au 30 novembre 2025. » : la légende du week-end, dans la langue active. */
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize, type Localized } from "@/i18n/localize";

export function WeekendCaption({ dates }: { dates: Localized<string> }) {
  const { lang, t } = useLanguage();
  return <>{format(t.apps.weekend.caption, { dates: localize(dates, lang) })}</>;
}
