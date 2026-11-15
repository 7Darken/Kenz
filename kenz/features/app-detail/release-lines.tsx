"use client";

/**
 * La sortie et la dernière version d'une app, dites en mots : « Sur l'App Store depuis novembre 2025. »,
 * « Version 2.0.2, mise à jour il y a 11 jours. ». Le « il y a » dépend du jour de la visite : le rendu serveur
 * (et l'hydratation) donne la date, le navigateur la reformule ensuite. Au-delà de 60 jours après le relevé
 * des versions, on garde la date (« le 4 novembre 2026 »).
 */
import { useSyncExternalStore } from "react";

import { RELEASES_CHECKED_ON, type AppRelease } from "@/content/apps";
import type { IsoDate } from "@/content/types";
import type { Lang } from "@/i18n/config";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";

const DAY = 864e5;

/** Le jour d'une date ISO, à minuit (heure locale). */
const dayOf = (iso: IsoDate) => {
  const [y = 1970, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const monthYear = (iso: IsoDate, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" }).format(dayOf(iso));

/** « 4 novembre 2026 », « 1er novembre 2026 » ; « 4 November 2026 ». */
const longDate = (iso: IsoDate, lang: Lang) => {
  const date = dayOf(iso);
  if (lang === "fr" && date.getDate() === 1) return `1er ${monthYear(iso, lang)}`;
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

/** Le jour courant (nombre de jours depuis l'époque, heure locale) : stable pendant toute la journée. */
const today = () => {
  const now = new Date();
  return Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / DAY);
};
const noSubscription = () => () => {};

export function ReleaseSince({ release }: { release: AppRelease }) {
  const { lang, t } = useLanguage();
  const r = t.apps.real;
  const date = monthYear(release.date, lang);
  const also = release.also ? ` ${localize(release.also, lang)}` : "";
  return <>{release.first ? format(r.sinceFirst, { date }) : `${format(r.since, { date })}${also}`}</>;
}

export function ReleaseVersion({ release }: { release: AppRelease }) {
  const { lang, t } = useLanguage();
  const day = useSyncExternalStore(noSubscription, today, () => null);
  const r = t.apps.real;
  if (release.first) return <>{format(r.versionFirst, { version: release.version })}</>;

  const full = longDate(release.updated, lang);
  let when = format(r.on, { date: full });
  const checked = Math.round(dayOf(RELEASES_CHECKED_ON).getTime() / DAY);
  if (day !== null && day - checked <= 60) {
    const n = day - Math.round(dayOf(release.updated).getTime() / DAY);
    when = n <= 0 ? r.today : n === 1 ? r.yesterday : n < 45 ? format(r.daysAgo, { n }) : format(r.monthsAgo, { n: Math.round(n / 30) });
  }
  const [before = "", after = ""] = r.version.split("{when}");
  return (
    <>
      {format(before, { version: release.version })}
      <time dateTime={release.updated} title={full}>
        {when}
      </time>
      {after}
    </>
  );
}
