"use client";

/**
 * Une série de la liste (voyage.html, `.serie`) : son numéro, son nom, la ligne d'infos (lieux et noms locaux,
 * format, période, volume), une note, et sa miniature liée à la chaîne. La série à venir : nom en contour,
 * « Prochaine escale », son état.
 */
import Image from "next/image";
import { Fragment } from "react";

import { ESCALES, type PlaceLine, type Series, type SeriesMeta } from "@/content/series";
import { Icon } from "@/design-system/components/icon";
import bezel from "@/features/univers/bezel.module.css";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./series-section.module.css";

interface SeriesRowProps {
  series: Series;
  index: number;
  active: boolean;
}

function Places({ line }: { line: PlaceLine }) {
  const { lang } = useLanguage();
  return (
    <>
      {line.map((part, k) =>
        "name" in part ? (
          <Fragment key={k}>
            {localize(part.name, lang)}
            {part.nativeName ? <span lang={part.nativeName.lang}>{part.nativeName.text}</span> : null}
          </Fragment>
        ) : (
          <Fragment key={k}>{localize(part, lang)}</Fragment>
        ),
      )}
    </>
  );
}

/** La ligne d'infos : ses parties, dans l'ordre, séparées par « · ». */
function Meta({ meta }: { meta: SeriesMeta }) {
  const { lang } = useLanguage();
  const parts = [
    meta.places ? <Places key="places" line={meta.places} /> : null,
    ...[meta.format, meta.period, meta.volume, meta.status].map((text, k) =>
      text ? <Fragment key={k}>{localize(text, lang)}</Fragment> : null,
    ),
  ].filter((part) => part !== null);
  return (
    <p className={styles.meta}>
      {parts.map((part, k) => (
        <Fragment key={k}>
          {k > 0 ? " · " : null}
          {part}
        </Fragment>
      ))}
    </p>
  );
}

export function SeriesRow({ series, index, active }: SeriesRowProps) {
  const { lang, t } = useLanguage();
  const country = localize(ESCALES[series.escale].country, lang);
  const cls = [styles.serie, series.upcoming && styles.upcoming].filter(Boolean).join(" ");

  return (
    <li className={cls} data-on={active ? "" : undefined}>
      <p className={styles.number} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className={styles.name}>{localize(series.name, lang)}</h3>
      {series.upcoming ? <p className={styles.next}>{t.voyage.series.next}</p> : null}
      <Meta meta={series.meta} />
      {series.note ? <p className={styles.note}>{localize(series.note, lang)}</p> : null}
      {series.media ? (
        <a
          className={styles.media}
          href={series.media.href}
          target="_blank"
          rel="noopener"
          aria-label={format(t.voyage.series.mediaLabel, { country })}
        >
          <Image
            src={series.media.image.src}
            alt=""
            width={series.media.image.width}
            height={series.media.image.height}
            sizes="(min-width: 900px) 440px, calc(100vw - 130px)"
            data-loupe=""
          />
          <span className={`${bezel.glass} ${styles.mediaLabel}`} aria-hidden="true">
            {t.voyage.series.youtube}
            <Icon name="arrow-up-right" />
          </span>
        </a>
      ) : null}
    </li>
  );
}
